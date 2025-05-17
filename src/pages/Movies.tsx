
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from '@/contexts/LocationContext';
import { getAllMovies, Movie } from '@/services/movieService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, Star } from 'lucide-react';

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const { selectedLocation } = useLocation();
  
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const allMovies = await getAllMovies();
        setMovies(allMovies);
        setFilteredMovies(allMovies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);
  
  useEffect(() => {
    // Apply filters when searchTerm or selectedGenre changes
    let results = movies;
    
    if (searchTerm) {
      results = results.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedGenre) {
      results = results.filter(movie => 
        movie.genres.includes(selectedGenre)
      );
    }
    
    setFilteredMovies(results);
  }, [searchTerm, selectedGenre, movies]);

  // Get all unique genres from movies
  const allGenres = Array.from(
    new Set(movies.flatMap(movie => movie.genres))
  ).sort();

  const handleGenreSelect = (genre: string) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null); // Toggle off
    } else {
      setSelectedGenre(genre); // Select new genre
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">
          Movies in {selectedLocation?.city || 'Your Area'}
        </h1>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search movies..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Genre filter */}
      <div className="flex flex-wrap gap-2">
        {allGenres.map(genre => (
          <Badge
            key={genre}
            variant={selectedGenre === genre ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => handleGenreSelect(genre)}
          >
            {genre}
          </Badge>
        ))}
        {selectedGenre && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedGenre(null)}
            className="text-xs"
          >
            Clear Filter
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredMovies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-2xl text-muted-foreground">No movies found matching your criteria</p>
              <Button 
                className="mt-4" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGenre(null);
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredMovies.map((movie) => (
                <Link 
                  to={`/movies/${movie.id}`} 
                  key={movie.id} 
                  className="movie-card group"
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="movie-poster"
                    />
                    <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
                      <span className="text-sm font-medium">{movie.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-1">
                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                      {movie.title}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(movie.releaseDate).getFullYear()}
                      <span className="mx-2">•</span>
                      {movie.duration} min
                    </div>
                    <p className="text-sm text-muted-foreground">{movie.genres.join(', ')}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Movies;
