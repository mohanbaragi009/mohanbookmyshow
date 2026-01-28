import { Star } from "lucide-react";
import { Movie } from "@/data/movies";
import { Badge } from "@/components/ui/badge";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <div className="group relative flex-shrink-0 w-44 sm:w-52 cursor-pointer">
      {/* Poster */}
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-secondary">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Rating Badge */}
        {movie.rating > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-md px-2 py-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-xs font-semibold text-foreground">
              {movie.rating}/10
            </span>
            <span className="text-xs text-muted-foreground">
              {movie.votes} Votes
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-1 group-hover:text-primary transition-colors">
          {movie.title}
        </h3>
        <div className="flex flex-wrap gap-1">
          {movie.genre.slice(0, 2).map((g) => (
            <Badge key={g} variant="secondary" className="text-xs px-2 py-0">
              {g}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
