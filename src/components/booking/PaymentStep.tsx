import { format } from 'date-fns';
import { CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Movie } from '@/hooks/useMovies';
import { Theater } from '@/hooks/useTheaters';

interface PaymentStepProps {
  movie: Movie;
  theater: Theater;
  selectedDate: string;
  selectedTime: string;
  seats: number;
  totalAmount: number;
  onPay: () => void;
  isPending: boolean;
}

const PaymentStep = ({
  movie,
  theater,
  selectedDate,
  selectedTime,
  seats,
  totalAmount,
  onPay,
  isPending,
}: PaymentStepProps) => {
  return (
    <div className="space-y-6 mt-4">
      <div className="bg-secondary/50 rounded-lg p-4">
        <h3 className="font-semibold mb-3">Booking Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Movie</span>
            <span>{movie.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Theater</span>
            <span>{theater.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Location</span>
            <span>{theater.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date</span>
            <span>{format(new Date(selectedDate), 'EEE, MMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time</span>
            <span>{selectedTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Seats</span>
            <span>{seats}</span>
          </div>
          <div className="border-t border-border mt-2 pt-2 flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-primary">₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg p-4 border border-dashed border-border">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <CreditCard className="h-4 w-4" />
          <span className="text-sm font-medium">Mock Payment</span>
        </div>
        <p className="text-xs text-muted-foreground">
          This is a simulated payment. Click "Pay Now" to complete the mock transaction.
        </p>
      </div>

      <Button className="w-full" onClick={onPay} disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay ₹${totalAmount.toFixed(2)}`
        )}
      </Button>
    </div>
  );
};

export default PaymentStep;
