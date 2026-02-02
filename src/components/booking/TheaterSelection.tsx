import { format, addDays } from 'date-fns';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
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

  // Generate next 7 days
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEE'),
      day: format(date, 'd'),
      month: format(date, 'MMM'),
    };
  });

  return (
    <div className="space-y-6">
      {/* Movie Title Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">
          Theaters Showing {movie.title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select a date and showtime
        </p>
      </div>

      {/* Date Selection */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Select Date
        </Label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {availableDates.map((date) => (
            <button
              key={date.value}
              onClick={() => onDateChange(date.value)}
              className={`flex flex-col items-center px-4 py-2 rounded-lg text-sm min-w-[60px] transition-colors ${
                selectedDate === date.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              <span className="text-xs opacity-80">{date.label}</span>
              <span className="text-lg font-bold">{date.day}</span>
              <span className="text-xs opacity-80">{date.month}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Theaters List */}
      <div className="space-y-4">
        {isLoading ? (
          <>
            <TheaterSkeleton />
            <TheaterSkeleton />
            <TheaterSkeleton />
          </>
        ) : showtimes && showtimes.length > 0 ? (
          showtimes.map((showtime) => (
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
          ))
        ) : (
          <div className="text-center py-8 bg-secondary/30 rounded-lg">
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              No showtimes available for this date.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Try selecting a different date.
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
      className={`rounded-lg border p-4 transition-colors ${
        isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{theater.name}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" />
            {theater.location}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {theater.amenities?.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="secondary" className="text-xs">
              {amenity}
            </Badge>
          ))}
        </div>
      </div>

      {/* Showtimes */}
      <div className="flex flex-wrap gap-2">
        {showTimes.map((time) => {
          const isTimeSelected = isSelected && selectedTime === time;
          return (
            <button
              key={time}
              onClick={() => onSelectShowtime(theater, time, showtimeId)}
              className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                isTimeSelected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-primary/30 text-primary hover:bg-primary/10'
              }`}
            >
              {time}
            </button>
          );
        })}
        <span className="flex items-center text-sm text-muted-foreground ml-2">
          ₹{adjustedPrice}
        </span>
      </div>
    </div>
  );
};

const TheaterSkeleton = () => (
  <div className="rounded-lg border border-border p-4">
    <div className="flex justify-between mb-3">
      <div>
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-9 w-20" />
      <Skeleton className="h-9 w-20" />
      <Skeleton className="h-9 w-20" />
    </div>
  </div>
);

export default TheaterSelection;
