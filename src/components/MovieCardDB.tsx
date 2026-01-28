import { useState } from 'react';
import { Star, Clock } from 'lucide-react';
import { Movie } from '@/hooks/useMovies';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import BookingDialog from './BookingDialog';

interface MovieCardDBProps {
  movie: Movie;
  showBookButton?: boolean;
}

const MovieCardDB = ({ movie, showBookButton = true }: MovieCardDBProps) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isComingSoon = movie.availability === 'coming_soon';
  const isSoldOut = movie.availability === 'sold_out';

  return (
    <>
      <div
        className="group relative rounded-xl overflow-hidden bg-card border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80'}
            alt={movie.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />

          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Rating Badge */}
          {movie.rating > 0 && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold">{movie.rating}</span>
            </div>
          )}

          {/* Status Badge */}
          {isComingSoon && (
            <Badge className="absolute top-3 right-3 bg-primary/90">Coming Soon</Badge>
          )}
          {isSoldOut && (
            <Badge variant="destructive" className="absolute top-3 right-3">
              Sold Out
            </Badge>
          )}

          {/* Book Button */}
          {showBookButton && !isComingSoon && !isSoldOut && (
            <div
              className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Button className="w-full" onClick={() => setIsBookingOpen(true)}>
                Book Now • ₹{movie.price}
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-1 mb-1">{movie.title}</h3>

          <div className="flex flex-wrap gap-1 mb-2">
            {movie.genre.slice(0, 2).map((g) => (
              <span key={g} className="text-xs text-muted-foreground">
                {g}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {movie.duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {movie.duration}
              </span>
            )}
            <span>{movie.language}</span>
          </div>
        </div>
      </div>

      <BookingDialog
        movie={movie}
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
      />
    </>
  );
};

export default MovieCardDB;
