
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  getMovieById, 
  getShowtimeById, 
  getSeatsByShowtime, 
  getSeatPrice,
  createBooking
} from '@/services/movieService';

const Booking: React.FC = () => {
  const { id: movieId, showtime: showtimeId } = useParams<{ id: string, showtime: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [movie, setMovie] = useState<any>(null);
  const [showtime, setShowtime] = useState<any>(null);
  const [seats, setSeats] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        if (movieId && showtimeId) {
          const [movieData, showtimeData, seatData] = await Promise.all([
            getMovieById(movieId),
            getShowtimeById(showtimeId),
            getSeatsByShowtime(showtimeId)
          ]);
          
          setMovie(movieData);
          setShowtime(showtimeData);
          setSeats(seatData);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching booking data:', error);
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load booking information",
          variant: "destructive"
        });
      }
    };

    fetchBookingData();
  }, [movieId, showtimeId, toast]);

  const handleSeatClick = (seatId: string) => {
    // Find the seat
    const seat = seats.find(s => s.id === seatId);
    
    // Cannot select unavailable seats
    if (!seat || !seat.isAvailable) return;
    
    setSelectedSeats(prevSelected => {
      if (prevSelected.includes(seatId)) {
        // Deselect the seat
        return prevSelected.filter(id => id !== seatId);
      } else {
        // Select the seat (limit to 8 seats per booking)
        if (prevSelected.length >= 8) {
          toast({
            title: "Maximum seats",
            description: "You can select up to 8 seats per booking",
            variant: "default"
          });
          return prevSelected;
        }
        return [...prevSelected, seatId];
      }
    });
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      if (seat) {
        return total + getSeatPrice(seat.type);
      }
      return total;
    }, 0);
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to continue",
        variant: "default"
      });
      return;
    }
    
    try {
      setLoading(true);
      const booking = await createBooking(
        user!.id,
        movieId!,
        showtimeId!,
        selectedSeats
      );
      
      toast({
        title: "Booking successful!",
        description: "Your tickets have been reserved",
      });
      
      navigate(`/confirmation/${booking.id}`);
    } catch (error) {
      console.error('Error creating booking:', error);
      setLoading(false);
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Skeleton className="h-12 w-3/4 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <Skeleton className="h-[400px] w-full" />
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie || !showtime) {
    return (
      <div className="container text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Booking Information Not Found</h2>
        <Button onClick={() => navigate('/movies')}>Return to Movies</Button>
      </div>
    );
  }

  // Group seats by row
  const seatsByRow = seats.reduce((acc: any, seat: any) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});

  // Sort rows alphabetically
  const sortedRows = Object.keys(seatsByRow).sort();

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">{movie.title} - Select Seats</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          {/* Seat Selection UI */}
          <div className="bg-card rounded-lg p-6">
            <div className="text-center mb-12">
              <div className="w-3/4 h-2 bg-secondary mx-auto mb-8 rounded"></div>
              <p className="text-sm text-muted-foreground">SCREEN</p>
            </div>
            
            {/* Seat Types Legend */}
            <div className="flex justify-center space-x-6 mb-8 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-muted rounded mr-2"></div>
                <span>Standard (${getSeatPrice('standard').toFixed(2)})</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-primary/40 rounded mr-2"></div>
                <span>Premium (${getSeatPrice('premium').toFixed(2)})</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-accent/40 rounded mr-2"></div>
                <span>Accessible (${getSeatPrice('accessible').toFixed(2)})</span>
              </div>
            </div>
            
            {/* Seats Grid */}
            <div className="space-y-3">
              {sortedRows.map(row => (
                <div key={row} className="flex items-center">
                  <div className="w-6 text-center font-bold">{row}</div>
                  <div className="flex flex-1 justify-center space-x-2">
                    {seatsByRow[row].map((seat: any) => {
                      let seatClass = "w-8 h-8 text-xs flex items-center justify-center rounded cursor-pointer transition-colors";
                      
                      // Determine seat appearance based on type and selection status
                      if (!seat.isAvailable) {
                        seatClass += " bg-muted/20 text-muted-foreground cursor-not-allowed";
                      } else if (selectedSeats.includes(seat.id)) {
                        seatClass += " bg-secondary text-secondary-foreground";
                      } else {
                        switch (seat.type) {
                          case 'premium':
                            seatClass += " bg-primary/40 hover:bg-primary/60";
                            break;
                          case 'accessible':
                            seatClass += " bg-accent/40 hover:bg-accent/60";
                            break;
                          default:
                            seatClass += " bg-muted hover:bg-muted/80";
                        }
                      }
                      
                      return (
                        <button
                          key={seat.id}
                          className={seatClass}
                          onClick={() => handleSeatClick(seat.id)}
                          disabled={!seat.isAvailable}
                          title={`${seat.row}${seat.number} - ${seat.type}`}
                        >
                          {seat.number}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Booking Summary */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{movie.title}</p>
                <p className="text-sm text-muted-foreground">
                  {showtime.date} at {showtime.time} • {showtime.auditorium}
                </p>
              </div>
              
              <Separator />
              
              <div>
                <div className="flex justify-between mb-2">
                  <p>Selected Seats</p>
                  <p>{selectedSeats.length > 0 ? 
                    selectedSeats.map(id => {
                      const seat = seats.find(s => s.id === id);
                      return seat ? `${seat.row}${seat.number}` : '';
                    }).join(', ') : 
                    'None'}
                  </p>
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <p>Tickets</p>
                  <p>{selectedSeats.length} × various prices</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <p>Total</p>
                <p>${calculateTotal().toFixed(2)}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg"
                disabled={selectedSeats.length === 0 || loading}
                onClick={handleBooking}
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>By confirming your booking, you agree to our Terms of Service and Refund Policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
