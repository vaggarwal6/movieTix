
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLocation } from '@/contexts/LocationContext';
import { getMovieById, getShowtimesByMovieAndLocation } from '@/services/movieService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Star } from 'lucide-react';
import { format } from 'date-fns';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedLocation } = useLocation();
  
  const [movie, setMovie] = useState<any>(null);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        if (id) {
          const movieData = await getMovieById(id);
          setMovie(movieData);
          
          if (selectedLocation && movieData) {
            const showtimesData = await getShowtimesByMovieAndLocation(
              id,
              selectedLocation.id
            );
            setShowtimes(showtimesData);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id, selectedLocation]);

  const handleShowtimeSelect = (showtimeId: string) => {
    navigate(`/booking/${id}/${showtimeId}`);
  };

  // Generate the next 5 days for date selection
  const dateOptions = Array.from({ length: 5 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: i === 0 ? 'Today' : format(date, 'EEE, MMM d')
    };
  });

  if (loading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Movie Not Found</h2>
        <p className="text-muted-foreground mb-8">The movie you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/movies">Browse Movies</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Movie Backdrop */}
      <div className="-mx-4 md:-mx-8 lg:-mx-16 -mt-8">
        <div className="relative h-[60vh] min-h-[400px]">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${movie.backdropUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
      </div>
      
      <div className="container -mt-72 relative z-10">
        {/* Movie Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src={movie.posterUrl} 
                alt={movie.title}
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div className="md:col-span-2 text-white">
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-1" fill="currentColor" />
                <span>{movie.rating.toFixed(1)}/10</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-1" />
                <span>{new Date(movie.releaseDate).getFullYear()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-1" />
                <span>{movie.duration} min</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map((genre: string) => (
                <Badge key={genre} variant="outline">
                  {genre}
                </Badge>
              ))}
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Synopsis</h2>
              <p className="text-gray-300">{movie.description}</p>
            </div>
          </div>
        </div>
        
        {/* Showtimes */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Showtimes at {selectedLocation?.name}</h2>
          
          {/* Date Selection */}
          <Tabs defaultValue={dateOptions[0].value} className="mb-8" onValueChange={setSelectedDate}>
            <TabsList className="w-full md:w-auto grid grid-cols-5">
              {dateOptions.map(date => (
                <TabsTrigger key={date.value} value={date.value}>
                  {date.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {dateOptions.map(date => (
              <TabsContent key={date.value} value={date.value}>
                {showtimes.filter(st => st.date === date.value).length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {showtimes
                      .filter(st => st.date === date.value)
                      .map(showtime => (
                        <Button 
                          key={showtime.id}
                          variant="outline"
                          className="flex flex-col h-auto py-4"
                          onClick={() => handleShowtimeSelect(showtime.id)}
                        >
                          <span className="text-lg font-bold">{showtime.time}</span>
                          <span className="text-sm text-muted-foreground">{showtime.auditorium}</span>
                        </Button>
                      ))
                    }
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-lg">
                    <p className="text-muted-foreground">No showtimes available for this date</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default MovieDetails;
