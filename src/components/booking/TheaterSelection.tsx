import { format } from 'date-fns';
import { MapPin, Clock, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Movie } from '@/hooks/useMovies';
import { useMovieShowtimes, Theater } from '@/hooks/useTheaters';

interface TheaterSelectionProps {
  movie: Movie;
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedTheater: Theater | null;
  selectedTime: string | null;
  onSelectShowtime: (theater: Theater, time: string, showtimeId?: string) => void;
}

const TheaterSelection = ({
  movie,
  selectedDate,
  onDateChange,
  selectedTheater,
  selectedTime,
  onSelectShowtime,
}: TheaterSelectionProps) => {
  const { data: showtimes, isLoading } = useMovieShowtimes(movie.id, selectedDate);

  const formattedDate = format(new Date(selectedDate), 'EEEE, MMMM d, yyyy');

  return (
    <div className="space-y-5">
      {/* Header with selected date */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Halls Showing {movie.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {formattedDate}
            </p>
          </div>
        </div>
      </div>

      {/* Theaters List */}
      <div className="space-y-3">
        {isLoading ? (
          <>
            <TheaterSkeleton />
            <TheaterSkeleton />
            <TheaterSkeleton />
          </>
        ) : showtimes && showtimes.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground">
              {showtimes.length} theater{showtimes.length > 1 ? 's' : ''} available
            </p>
            {showtimes.map((showtime) => (
              <TheaterCard
                key={showtime.id}
                showtimeId={showtime.id}
                theater={showtime.theater}
                showTimes={showtime.show_times}
                priceMultiplier={showtime.price_multiplier}
                basePrice={movie.price}
                selectedTheater={selectedTheater}
                selectedTime={selectedTime}
                onSelectShowtime={onSelectShowtime}
              />
            ))}
          </>
        ) : (
          <div className="text-center py-10 bg-secondary/30 rounded-xl border border-dashed border-border">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-medium">
              No showtimes available for this date.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Please go back and select a different date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface TheaterCardProps {
  showtimeId: string;
  theater: Theater;
  showTimes: string[];
  priceMultiplier: number;
  basePrice: number;
  selectedTheater: Theater | null;
  selectedTime: string | null;
  onSelectShowtime: (theater: Theater, time: string, showtimeId?: string) => void;
}

const TheaterCard = ({
  showtimeId,
  theater,
  showTimes,
  priceMultiplier,
  basePrice,
  selectedTheater,
  selectedTime,
  onSelectShowtime,
}: TheaterCardProps) => {
  const adjustedPrice = Math.round(basePrice * priceMultiplier);
  const isSelected = selectedTheater?.id === theater.id;

  return (
    <div
      className={`rounded-xl border-2 p-4 transition-all duration-200 ${
        isSelected 
          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
          : 'border-border bg-card hover:border-primary/30'
      }`}
    >
      {/* Theater Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground text-base">{theater.name}</h3>
            {isSelected && (
              <Badge className="bg-primary/20 text-primary text-xs">Selected</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" />
            {theater.location}, {theater.city}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {theater.amenities?.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="outline" className="text-xs bg-secondary/50">
              {amenity}
            </Badge>
          ))}
        </div>
      </div>

      {/* Showtimes Grid */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          Available Showtimes
        </p>
        <div className="flex flex-wrap gap-2">
          {showTimes.map((time) => {
            const isTimeSelected = isSelected && selectedTime === time;
            return (
              <button
                key={time}
                onClick={() => onSelectShowtime(theater, time, showtimeId)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium border-2 transition-all duration-200 ${
                  isTimeSelected
                    ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30'
                    : 'border-primary/40 text-primary bg-primary/5 hover:bg-primary/10 hover:border-primary/60'
                }`}
              >
                {time}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          ₹{adjustedPrice} per ticket
        </p>
      </div>
    </div>
  );
};

const TheaterSkeleton = () => (
  <div className="rounded-xl border border-border p-4 bg-card">
    <div className="flex justify-between mb-4">
      <div>
        <Skeleton className="h-5 w-36 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
    <Skeleton className="h-3 w-24 mb-2" />
    <div className="flex gap-2">
      <Skeleton className="h-10 w-20 rounded-lg" />
      <Skeleton className="h-10 w-20 rounded-lg" />
      <Skeleton className="h-10 w-20 rounded-lg" />
      <Skeleton className="h-10 w-20 rounded-lg" />
    </div>
  </div>
);

export default TheaterSelection;