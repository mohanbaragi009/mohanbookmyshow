import { format } from 'date-fns';
import { MapPin, Calendar, Clock, Loader2, Armchair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Movie } from '@/hooks/useMovies';
import { Theater } from '@/hooks/useTheaters';
import SeatMap from './SeatMap';

interface SeatSelectionProps {
  movie: Movie;
  theater: Theater;
  showtimeId: string;
  selectedDate: string;
  selectedTime: string;
  seats: number;
  selectedSeatNumbers: string[];
  onSeatNumbersChange: (seats: string[]) => void;
  totalAmount: number;
  onProceed: () => void;
  isPending: boolean;
}

const SeatSelection = ({
  movie,
  theater,
  showtimeId,
  selectedDate,
  selectedTime,
  seats,
  selectedSeatNumbers,
  onSeatNumbersChange,
  totalAmount,
  onProceed,
  isPending,
}: SeatSelectionProps) => {
  const canProceed = selectedSeatNumbers.length === seats;

  return (
    <div className="space-y-6">
      {/* Booking Summary Header */}
      <div className="bg-secondary/50 rounded-lg p-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{theater.name}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(selectedDate), 'MMM d')}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{selectedTime}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Armchair className="h-3 w-3" />
            <span>Select {seats} seat{seats > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Seat Map */}
      <SeatMap
        showtimeId={showtimeId}
        maxSeats={seats}
        selectedSeats={selectedSeatNumbers}
        onSeatSelect={onSeatNumbersChange}
      />

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

      <Button 
        className="w-full" 
        onClick={onProceed} 
        disabled={!canProceed || isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : !canProceed ? (
          `Select ${seats - selectedSeatNumbers.length} more seat${seats - selectedSeatNumbers.length > 1 ? 's' : ''}`
        ) : (
          'Proceed to Payment'
        )}
      </Button>
    </div>
  );
};

export default SeatSelection;
