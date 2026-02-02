import { format } from 'date-fns';
import { Ticket, MapPin, Calendar, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Movie } from '@/hooks/useMovies';
import { Theater } from '@/hooks/useTheaters';

interface SeatSelectionProps {
  movie: Movie;
  theater: Theater;
  selectedDate: string;
  selectedTime: string;
  seats: number;
  onSeatsChange: (seats: number) => void;
  totalAmount: number;
  onProceed: () => void;
  isPending: boolean;
  maxSeats: number;
}

const SeatSelection = ({
  movie,
  theater,
  selectedDate,
  selectedTime,
  seats,
  onSeatsChange,
  totalAmount,
  onProceed,
  isPending,
  maxSeats,
}: SeatSelectionProps) => {
  return (
    <div className="space-y-6">
      {/* Booking Summary */}
      <div className="bg-secondary/50 rounded-lg p-4">
        <h3 className="font-semibold mb-3 text-foreground">Your Selection</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Movie</span>
            <span className="text-foreground font-medium">{movie.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Theater
            </span>
            <span className="text-foreground">{theater.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Date
            </span>
            <span className="text-foreground">
              {format(new Date(selectedDate), 'EEE, MMM d, yyyy')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Time
            </span>
            <span className="text-foreground">{selectedTime}</span>
          </div>
        </div>
      </div>

      {/* Seats Selection */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Ticket className="h-4 w-4" />
          Number of Seats
        </Label>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onSeatsChange(Math.max(1, seats - 1))}
            disabled={seats <= 1}
          >
            -
          </Button>
          <span className="text-2xl font-bold w-12 text-center">{seats}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onSeatsChange(Math.min(10, seats + 1))}
            disabled={seats >= 10 || seats >= maxSeats}
          >
            +
          </Button>
          <span className="text-sm text-muted-foreground">
            ({maxSeats} seats available)
          </span>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-secondary/50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Price per ticket</span>
          <span>₹{movie.price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-muted-foreground">Seats</span>
          <span>× {seats}</span>
        </div>
        <div className="border-t border-border mt-3 pt-3 flex justify-between items-center">
          <span className="font-semibold">Total Amount</span>
          <span className="text-xl font-bold text-primary">
            ₹{totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      <Button className="w-full" onClick={onProceed} disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Proceed to Payment'
        )}
      </Button>
    </div>
  );
};

export default SeatSelection;
