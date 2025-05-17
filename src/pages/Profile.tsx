
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getBookingsByUser, 
  getMovieById, 
  getShowtimeById 
} from '@/services/movieService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Film, Ticket } from 'lucide-react';

interface BookingWithDetails {
  id: string;
  confirmationCode: string;
  bookingDate: string;
  totalAmount: number;
  seats: string[];
  movie: {
    id: string;
    title: string;
    posterUrl: string;
  };
  showtime: {
    date: string;
    time: string;
    auditorium: string;
  };
}

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        if (user) {
          const userBookings = await getBookingsByUser(user.id);
          
          // For each booking, get the movie and showtime details
          const bookingsWithDetails = await Promise.all(
            userBookings.map(async (booking) => {
              const [movie, showtime] = await Promise.all([
                getMovieById(booking.movieId),
                getShowtimeById(booking.showtimeId)
              ]);
              
              return {
                ...booking,
                movie: movie ? {
                  id: movie.id,
                  title: movie.title,
                  posterUrl: movie.posterUrl
                } : {
                  id: booking.movieId,
                  title: 'Unknown Movie',
                  posterUrl: ''
                },
                showtime: showtime ? {
                  date: showtime.date,
                  time: showtime.time,
                  auditorium: showtime.auditorium
                } : {
                  date: '',
                  time: '',
                  auditorium: ''
                }
              };
            })
          );
          
          setBookings(bookingsWithDetails);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user bookings:', error);
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [user]);

  // Group bookings by upcoming and past
  const currentDate = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD
  
  const upcomingBookings = bookings.filter(
    booking => booking.showtime.date >= currentDate
  );
  
  const pastBookings = bookings.filter(
    booking => booking.showtime.date < currentDate
  );

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Info Card */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={logout} className="w-full">
                Sign Out
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Bookings List */}
        <div className="md:col-span-2">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="upcoming">
                Upcoming Tickets ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past Tickets ({pastBookings.length})
              </TabsTrigger>
            </TabsList>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex space-x-4">
                        <Skeleton className="h-24 w-16 rounded" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-1/4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <TabsContent value="upcoming">
                  {upcomingBookings.length === 0 ? (
                    <div className="text-center py-12 bg-muted/30 rounded-lg">
                      <Film className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">No upcoming tickets</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't booked any upcoming movies yet
                      </p>
                      <Button asChild>
                        <Link to="/movies">Browse Movies</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} isUpcoming />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="past">
                  {pastBookings.length === 0 ? (
                    <div className="text-center py-12 bg-muted/30 rounded-lg">
                      <Film className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">No past tickets</h3>
                      <p className="text-muted-foreground mb-4">
                        Your booking history will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pastBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} isUpcoming={false} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

const BookingCard: React.FC<{ booking: BookingWithDetails; isUpcoming: boolean }> = ({ 
  booking, 
  isUpcoming 
}) => {
  return (
    <Card className={isUpcoming ? "border-l-4 border-l-primary" : ""}>
      <CardContent className="p-4">
        <div className="flex space-x-4">
          {/* Movie Poster */}
          <div className="flex-shrink-0">
            <div className="rounded overflow-hidden w-16 h-24">
              {booking.movie.posterUrl ? (
                <img 
                  src={booking.movie.posterUrl} 
                  alt={booking.movie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Film className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
          
          {/* Booking Details */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{booking.movie.title}</h3>
              {isUpcoming && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                  Upcoming
                </Badge>
              )}
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{booking.showtime.date} at {booking.showtime.time}</span>
              </div>
              
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>{booking.showtime.auditorium}</span>
              </div>
              
              <div className="flex items-center text-muted-foreground">
                <Ticket className="h-4 w-4 mr-1" />
                <span>{booking.seats.length} seat(s) • ${booking.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            Confirmation: {booking.confirmationCode}
          </div>
          
          <Button asChild size="sm" variant={isUpcoming ? "default" : "outline"}>
            <Link to={`/confirmation/${booking.id}`}>
              {isUpcoming ? "View Ticket" : "View Receipt"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
