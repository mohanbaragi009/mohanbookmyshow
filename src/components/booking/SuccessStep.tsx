import { format } from 'date-fns';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Movie } from '@/hooks/useMovies';
import { Theater } from '@/hooks/useTheaters';

interface SuccessStepProps {
  movie: Movie;
  theater: Theater;
  selectedDate: string;
  selectedTime: string;
  seats: number;
  onClose: () => void;
}

const SuccessStep = ({
  movie,
  theater,
  selectedDate,
  selectedTime,
  seats,
  onClose,
}: SuccessStepProps) => {
  return (
    <div className="space-y-6 mt-4 text-center">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          Payment Successful!
        </h3>
        <p className="text-muted-foreground">
          Your tickets for{' '}
          <span className="text-foreground font-medium">{movie.title}</span> have
          been booked.
        </p>
      </div>

      <div className="bg-secondary/50 rounded-lg p-4 text-left">
        <div className="space-y-2 text-sm">
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
        </div>
      </div>

      <Button className="w-full" onClick={onClose}>
        Done
      </Button>
    </div>
  );
};

export default SuccessStep;
