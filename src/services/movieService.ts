
// Sample movie data
export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  duration: number; // in minutes
  genres: string[];
  rating: number;
  description: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  locationId: string;
  date: string;
  time: string;
  auditorium: string;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'standard' | 'premium' | 'accessible';
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  movieId: string;
  showtimeId: string;
  seats: string[]; // Seat IDs
  totalAmount: number;
  bookingDate: string;
  confirmationCode: string;
}

const MOCK_MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Inception',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
    backdropUrl: 'https://wallpapercave.com/wp/hquoZQy.jpg',
    releaseDate: '2010-07-16',
    duration: 148,
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    rating: 8.8,
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.'
  },
  {
    id: '2',
    title: 'The Dark Knight',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
    backdropUrl: 'https://wallpaperaccess.com/full/1093736.jpg',
    releaseDate: '2008-07-18',
    duration: 152,
    genres: ['Action', 'Crime', 'Drama'],
    rating: 9.0,
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.'
  },
  {
    id: '3',
    title: 'Interstellar',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
    backdropUrl: 'https://wallpapercave.com/wp/wp1817955.jpg',
    releaseDate: '2014-11-07',
    duration: 169,
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    rating: 8.6,
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.'
  },
  {
    id: '4',
    title: 'The Shawshank Redemption',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
    backdropUrl: 'https://wallpapercave.com/wp/wp2014257.jpg',
    releaseDate: '1994-10-14',
    duration: 142,
    genres: ['Drama'],
    rating: 9.3,
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.'
  },
  {
    id: '5',
    title: 'The Matrix',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
    backdropUrl: 'https://wallpapercave.com/wp/aZeUaca.jpg',
    releaseDate: '1999-03-31',
    duration: 136,
    genres: ['Action', 'Sci-Fi'],
    rating: 8.7,
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.'
  },
  {
    id: '6',
    title: 'Pulp Fiction',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    backdropUrl: 'https://wallpapercave.com/wp/wp1853383.jpg',
    releaseDate: '1994-10-14',
    duration: 154,
    genres: ['Crime', 'Drama'],
    rating: 8.9,
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.'
  },
];

const MOCK_SHOWTIMES: Showtime[] = [
  // For Inception (movie 1)
  { id: '1', movieId: '1', locationId: '1', date: '2025-05-17', time: '14:30', auditorium: 'Hall 1' },
  { id: '2', movieId: '1', locationId: '1', date: '2025-05-17', time: '18:00', auditorium: 'Hall 2' },
  { id: '3', movieId: '1', locationId: '1', date: '2025-05-17', time: '21:30', auditorium: 'Hall 1' },
  { id: '4', movieId: '1', locationId: '2', date: '2025-05-17', time: '15:00', auditorium: 'Hall 3' },
  { id: '5', movieId: '1', locationId: '2', date: '2025-05-17', time: '19:30', auditorium: 'Hall 1' },
  
  // For The Dark Knight (movie 2)
  { id: '6', movieId: '2', locationId: '1', date: '2025-05-17', time: '13:00', auditorium: 'Hall 3' },
  { id: '7', movieId: '2', locationId: '1', date: '2025-05-17', time: '16:30', auditorium: 'Hall 2' },
  { id: '8', movieId: '2', locationId: '1', date: '2025-05-17', time: '20:00', auditorium: 'Hall 3' },
  { id: '9', movieId: '2', locationId: '2', date: '2025-05-17', time: '14:00', auditorium: 'Hall 2' },
  { id: '10', movieId: '2', locationId: '2', date: '2025-05-17', time: '18:30', auditorium: 'Hall 3' },
  
  // Add similar patterns for other movies
  { id: '11', movieId: '3', locationId: '1', date: '2025-05-17', time: '15:30', auditorium: 'Hall 1' },
  { id: '12', movieId: '3', locationId: '2', date: '2025-05-17', time: '19:00', auditorium: 'Hall 2' },
  { id: '13', movieId: '4', locationId: '1', date: '2025-05-17', time: '16:00', auditorium: 'Hall 3' },
  { id: '14', movieId: '4', locationId: '2', date: '2025-05-17', time: '20:30', auditorium: 'Hall 1' },
  { id: '15', movieId: '5', locationId: '1', date: '2025-05-17', time: '17:30', auditorium: 'Hall 2' },
  { id: '16', movieId: '5', locationId: '2', date: '2025-05-17', time: '21:00', auditorium: 'Hall 3' }
];

// Generate seat data
const generateSeats = (showtimeId: string): Seat[] => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;
  const seats: Seat[] = [];
  
  rows.forEach(row => {
    for (let num = 1; num <= seatsPerRow; num++) {
      // Make some seats unavailable randomly
      const isAvailable = Math.random() > 0.2;
      
      // Determine seat type
      let type: 'standard' | 'premium' | 'accessible' = 'standard';
      if (row === 'D' || row === 'E') {
        type = 'premium';
      } else if ((row === 'A' && (num === 1 || num === 2)) || (row === 'H' && (num === 11 || num === 12))) {
        type = 'accessible';
      }
      
      seats.push({
        id: `${showtimeId}-${row}${num}`,
        row,
        number: num,
        type,
        isAvailable
      });
    }
  });
  
  return seats;
};

// Service functions
export const getAllMovies = (): Promise<Movie[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_MOVIES);
    }, 500);
  });
};

export const getMovieById = (id: string): Promise<Movie | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const movie = MOCK_MOVIES.find(m => m.id === id);
      resolve(movie);
    }, 300);
  });
};

export const getShowtimesByMovieAndLocation = (
  movieId: string,
  locationId: string
): Promise<Showtime[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const showtimes = MOCK_SHOWTIMES.filter(
        st => st.movieId === movieId && st.locationId === locationId
      );
      resolve(showtimes);
    }, 300);
  });
};

export const getShowtimeById = (id: string): Promise<Showtime | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const showtime = MOCK_SHOWTIMES.find(st => st.id === id);
      resolve(showtime);
    }, 200);
  });
};

export const getSeatsByShowtime = (showtimeId: string): Promise<Seat[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const seats = generateSeats(showtimeId);
      resolve(seats);
    }, 400);
  });
};

// Pricing
export const getSeatPrice = (seatType: string): number => {
  switch (seatType) {
    case 'premium':
      return 16.99;
    case 'accessible':
      return 12.99;
    case 'standard':
    default:
      return 13.99;
  }
};

// Booking
const MOCK_BOOKINGS: Booking[] = [];

export const createBooking = (
  userId: string,
  movieId: string,
  showtimeId: string,
  seatIds: string[]
): Promise<Booking> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Calculate total amount based on seat types
      const totalAmount = seatIds.length * 13.99; // Simplified for mock data
      
      const booking: Booking = {
        id: Date.now().toString(),
        userId,
        movieId,
        showtimeId,
        seats: seatIds,
        totalAmount,
        bookingDate: new Date().toISOString(),
        confirmationCode: Math.random().toString(36).substring(2, 10).toUpperCase()
      };
      
      MOCK_BOOKINGS.push(booking);
      resolve(booking);
    }, 800);
  });
};

export const getBookingsByUser = (userId: string): Promise<Booking[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const bookings = MOCK_BOOKINGS.filter(b => b.userId === userId);
      resolve(bookings);
    }, 500);
  });
};

export const getBookingById = (id: string): Promise<Booking | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const booking = MOCK_BOOKINGS.find(b => b.id === id);
      resolve(booking);
    }, 300);
  });
};
