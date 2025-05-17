
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  getBookingById, 
  getMovieById, 
  getShowtimeById,
  getSeatsByShowtime
} from '@/services/movieService';
import { Film, Calendar, Clock, MapPin, Ticket, Receipt, Check } from 'lucide-react';

const Confirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [booking, setBooking] = useState<any>(null);
  const [movie, setMovie] = useState<any>(null);
  const [showtime, setShowtime] = useState<any>(null);
  const [seats, setSeats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfirmationData = async () => {
      try {
        if (id) {
          const bookingData = await getBookingById(id);
          
          if (bookingData && bookingData.userId === user?.id) {
            setBooking(bookingData);
            
            // Fetch related data
            const [movieData, showtimeData, seatData] = await Promise.all([
              getMovieById(bookingData.movieId),
              getShowtimeById(bookingData.showtimeId),
              getSeatsByShowtime(bookingData.showtimeId)
            ]);
            
            setMovie(movieData);
            setShowtime(showtimeData);
            setSeats(seatData);
          } else {
            toast({
              title: "Access denied",
              description: "You don't have permission to view this booking",
              variant: "destructive"
            });
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching confirmation data:', error);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load booking information",
          variant: "destructive"
        });
      }
    };

    fetchConfirmationData();
  }, [id, user, toast]);

  const getSelectedSeats = () => {
    if (!booking || !seats.length) return [];
    
    return seats.filter((seat: any) => booking.seats.includes(seat.id))
      .sort((a: any, b: any) => {
        if (a.row !== b.row) return a.row.localeCompare(b.row);
        return a.number - b.number;
      });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container max-w-2xl mx-auto py-8">
        <Skeleton className="h-12 w-3/4 mb-8" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (!booking || !movie || !showtime) {
    return (
      <div className="container text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The booking you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button asChild>
          <Link to="/profile">View Your Bookings</Link>
        </Button>
      </div>
    );
  }

  const selectedSeats = getSelectedSeats();

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-secondary/20 rounded-full p-3">
          <Check className="h-8 w-8 text-secondary" />
        </div>
        <h1 className="text-3xl font-bold ml-3">Booking Confirmed!</h1>
      </div>
      
      <Card className="print:shadow-none">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Ticket className="h-5 w-5 mr-2" />
              Movie Ticket
            </CardTitle>
            <div className="text-sm font-mono bg-muted px-2 py-1 rounded">
              {booking.confirmationCode}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="py-6">
          {/* Movie Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={movie.posterUrl} 
                  alt={movie.title} 
                  className="w-full h-auto"
                />
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{movie.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {movie.duration} min • {movie.genres.join(', ')}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">{showtime.date}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-sm text-muted-foreground">{showtime.time}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Auditorium</p>
                    <p className="text-sm text-muted-foreground">{showtime.auditorium}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Seat and Payment Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Seats</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat: any) => (
                  <div 
                    key={seat.id}
                    className={`px-2 py-1 rounded text-sm font-medium
                      ${seat.type === 'premium' ? 'bg-primary/20 text-primary' :
                        seat.type === 'accessible' ? 'bg-accent/20 text-accent-foreground' :
                          'bg-muted'
                      }
                    `}
                  >
                    {seat.row}{seat.number}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Total Amount</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedSeats.length} ticket{selectedSeats.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-xl font-bold">${booking.totalAmount.toFixed(2)}</div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* QR Code Placeholder */}
          <div className="flex flex-col items-center">
            <div className="bg-muted w-40 h-40 flex items-center justify-center mb-2">
              <Film className="h-12 w-12 text-muted-foreground/50" />
              <p className="text-xs text-muted-foreground">QR Code Placeholder</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Show this ticket at the theater entrance
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button onClick={handlePrint} className="w-full" variant="outline">
            <Receipt className="h-4 w-4 mr-2" />
            Print Ticket
          </Button>
          
          <div className="text-center text-xs text-muted-foreground">
            <p>Booking ID: {booking.id} • {new Date(booking.bookingDate).toLocaleString()}</p>
          </div>
        </CardFooter>
      </Card>
      
      <div className="flex justify-center mt-8 space-x-4">
        <Button asChild variant="outline">
          <Link to="/profile">View All Bookings</Link>
        </Button>
        <Button asChild>
          <Link to="/movies">Browse More Movies</Link>
        </Button>
      </div>
    </div>
  );
};

export default Confirmation;
