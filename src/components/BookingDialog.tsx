import { useState } from 'react';
import { format, addDays } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateBooking, useMockPayment } from '@/hooks/useBookings';
import { Movie } from '@/hooks/useMovies';
import { Calendar, Clock, Ticket, CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookingDialogProps {
  movie: Movie;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const showTimes = ['10:00 AM', '1:30 PM', '4:00 PM', '7:00 PM', '10:30 PM'];

const BookingDialog = ({ movie, open, onOpenChange }: BookingDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const mockPayment = useMockPayment();

  const [step, setStep] = useState<'select' | 'payment' | 'success'>('select');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState(showTimes[0]);
  const [seats, setSeats] = useState(1);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const totalAmount = movie.price * seats;

  // Generate next 7 days
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEE, MMM d'),
    };
  });

  const handleBookNow = async () => {
    if (!user) {
      toast({
        title: 'Please Sign In',
        description: 'You need to be logged in to book tickets.',
        variant: 'destructive',
      });
      onOpenChange(false);
      navigate('/auth');
      return;
    }

    try {
      const booking = await createBooking.mutateAsync({
        movie_id: movie.id,
        seats,
        total_amount: totalAmount,
        show_date: selectedDate,
        show_time: selectedTime,
      });

      setBookingId(booking.id);
      setStep('payment');
    } catch (error) {
      toast({
        title: 'Booking Failed',
        description: 'Could not create booking. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handlePayment = async () => {
    if (!bookingId) return;

    try {
      await mockPayment.mutateAsync(bookingId);
      setStep('success');

      // Mock email notification - show toast instead
      toast({
        title: '📧 Booking Confirmation Sent!',
        description: `A confirmation email has been sent to ${user?.email}`,
      });
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: 'Could not process payment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    setStep('select');
    setSeats(1);
    setBookingId(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {step === 'success' ? 'Booking Confirmed!' : `Book ${movie.title}`}
          </DialogTitle>
          <DialogDescription>
            {step === 'select' && 'Select your preferred date, time, and seats'}
            {step === 'payment' && 'Complete your payment to confirm booking'}
            {step === 'success' && 'Your tickets have been booked successfully'}
          </DialogDescription>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-6 mt-4">
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
                    onClick={() => setSelectedDate(date.value)}
                    className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                      selectedDate === date.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {date.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Select Time
              </Label>
              <div className="flex flex-wrap gap-2">
                {showTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      selectedTime === time
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {time}
                  </button>
                ))}
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
                  onClick={() => setSeats(Math.max(1, seats - 1))}
                  disabled={seats <= 1}
                >
                  -
                </Button>
                <span className="text-2xl font-bold w-12 text-center">{seats}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSeats(Math.min(10, seats + 1))}
                  disabled={seats >= 10 || seats >= movie.available_seats}
                >
                  +
                </Button>
                <span className="text-sm text-muted-foreground">
                  ({movie.available_seats} seats available)
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
                <span className="text-xl font-bold text-primary">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleBookNow}
              disabled={createBooking.isPending}
            >
              {createBooking.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </Button>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-6 mt-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Movie</span>
                  <span>{movie.title}</span>
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

            <Button
              className="w-full"
              onClick={handlePayment}
              disabled={mockPayment.isPending}
            >
              {mockPayment.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                `Pay ₹${totalAmount.toFixed(2)}`
              )}
            </Button>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-6 mt-4 text-center">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Payment Successful!</h3>
              <p className="text-muted-foreground">
                Your tickets for <span className="text-foreground font-medium">{movie.title}</span> have been booked.
              </p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4 text-left">
              <div className="space-y-2 text-sm">
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

            <Button className="w-full" onClick={handleClose}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
