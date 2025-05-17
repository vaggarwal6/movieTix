
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from '@/contexts/LocationContext';
import { getAllMovies, Movie } from '@/services/movieService';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MapPin } from 'lucide-react';

const Index: React.FC = () => {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedLocation } = useLocation();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const allMovies = await getAllMovies();
        // Just get a few for the featured section
        setFeaturedMovies(allMovies.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative -mt-8 h-[70vh] min-h-[500px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: `url(${featuredMovies[0]?.backdropUrl || 'https://wallpapercave.com/wp/hquoZQy.jpg'})`,
            filter: 'brightness(0.5)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        
        <div className="relative container h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Book Movie Tickets Online
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl">
            Your ultimate destination for booking movie tickets. Find the latest movies, select your favorite seats, and enjoy the show!
          </p>
          
          <div className="w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder="Search for movies..."
                className="w-full pl-10 pr-4 py-3 rounded-full bg-background/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="mt-4 flex items-center justify-center text-sm text-gray-300">
              {selectedLocation && (
                <>
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    {selectedLocation.name}, {selectedLocation.city}
                  </span>
                </>
              )}
            </div>
          </div>
          
          <Button asChild size="lg" className="mt-8">
            <Link to="/movies">Browse All Movies</Link>
          </Button>
        </div>
      </section>

      {/* Featured Movies */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Movies</h2>
          <Button variant="outline" asChild>
            <Link to="/movies">View All</Link>
          </Button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredMovies.map((movie) => (
              <Link 
                to={`/movies/${movie.id}`} 
                key={movie.id}
                className="movie-card group"
              >
                <div className="overflow-hidden rounded-lg">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="movie-poster"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {movie.genres.join(', ')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* How it Works */}
      <section className="bg-card py-16 -mx-4 px-4 rounded-xl">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Choose Your Movie</h3>
            <p className="text-muted-foreground">
              Browse our selection of the latest movies and pick your favorite.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Select Your Seats</h3>
            <p className="text-muted-foreground">
              Choose from available seats in the theater of your choice.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Enjoy the Show</h3>
            <p className="text-muted-foreground">
              Get your electronic ticket and enjoy the movie experience!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
