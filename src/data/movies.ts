export interface Movie {
  id: number;
  title: string;
  poster: string;
  genre: string[];
  rating: number;
  language: string;
  releaseDate: string;
  duration: string;
  votes: string;
}

export const featuredMovie: Movie = {
  id: 1,
  title: "Inception",
  poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
  genre: ["Action", "Sci-Fi", "Thriller"],
  rating: 8.8,
  language: "English",
  releaseDate: "2024",
  duration: "2h 28m",
  votes: "2.1M",
};

export const nowShowingMovies: Movie[] = [
  {
    id: 2,
    title: "The Dark Knight",
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80",
    genre: ["Action", "Crime", "Drama"],
    rating: 9.0,
    language: "English",
    releaseDate: "2024",
    duration: "2h 32m",
    votes: "2.5M",
  },
  {
    id: 3,
    title: "Interstellar",
    poster: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&q=80",
    genre: ["Adventure", "Drama", "Sci-Fi"],
    rating: 8.6,
    language: "English",
    releaseDate: "2024",
    duration: "2h 49m",
    votes: "1.8M",
  },
  {
    id: 4,
    title: "The Matrix",
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80",
    genre: ["Action", "Sci-Fi"],
    rating: 8.7,
    language: "English",
    releaseDate: "2024",
    duration: "2h 16m",
    votes: "1.9M",
  },
  {
    id: 5,
    title: "Avatar",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80",
    genre: ["Action", "Adventure", "Fantasy"],
    rating: 7.9,
    language: "English",
    releaseDate: "2024",
    duration: "2h 42m",
    votes: "1.3M",
  },
  {
    id: 6,
    title: "Dune",
    poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80",
    genre: ["Action", "Adventure", "Drama"],
    rating: 8.0,
    language: "English",
    releaseDate: "2024",
    duration: "2h 35m",
    votes: "800K",
  },
  {
    id: 7,
    title: "Oppenheimer",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80",
    genre: ["Biography", "Drama", "History"],
    rating: 8.5,
    language: "English",
    releaseDate: "2024",
    duration: "3h 0m",
    votes: "700K",
  },
];

export const upcomingMovies: Movie[] = [
  {
    id: 8,
    title: "Deadpool 3",
    poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&q=80",
    genre: ["Action", "Comedy"],
    rating: 0,
    language: "English",
    releaseDate: "Coming Soon",
    duration: "TBA",
    votes: "0",
  },
  {
    id: 9,
    title: "Furiosa",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80",
    genre: ["Action", "Adventure"],
    rating: 0,
    language: "English",
    releaseDate: "Coming Soon",
    duration: "TBA",
    votes: "0",
  },
  {
    id: 10,
    title: "Gladiator 2",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80",
    genre: ["Action", "Drama"],
    rating: 0,
    language: "English",
    releaseDate: "Coming Soon",
    duration: "TBA",
    votes: "0",
  },
  {
    id: 11,
    title: "Mission Impossible 8",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80",
    genre: ["Action", "Thriller"],
    rating: 0,
    language: "English",
    releaseDate: "Coming Soon",
    duration: "TBA",
    votes: "0",
  },
  {
    id: 12,
    title: "Captain America 4",
    poster: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400&q=80",
    genre: ["Action", "Adventure"],
    rating: 0,
    language: "English",
    releaseDate: "Coming Soon",
    duration: "TBA",
    votes: "0",
  },
];
