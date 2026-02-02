import { useState } from 'react';
import { format } from 'date-fns';
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
import { Theater, MovieShowtime } from '@/hooks/useTheaters';
import { ArrowLeft, Ticket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TheaterSelection from './booking/TheaterSelection';
import SeatSelection from './booking/SeatSelection';
import PaymentStep from './booking/PaymentStep';
import SuccessStep from './booking/SuccessStep';

interface BookingDialogProps {
  movie: Movie;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type BookingStep = 'tickets' | 'theater' | 'seats' | 'payment' | 'success';

const BookingDialog = ({ movie, open, onOpenChange }: BookingDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const mockPayment = useMockPayment();

  const [step, setStep] = useState<BookingStep>('tickets');
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string | null>(null);
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState<string[]>([]);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const totalAmount = movie.price * ticketCount;

  const handleSelectShowtime = (theater: Theater, time: string, showtimeId?: string) => {
    setSelectedTheater(theater);
    setSelectedTime(time);
    if (showtimeId) setSelectedShowtimeId(showtimeId);
  };

  const handleProceedToTheater = () => {
    setStep('theater');
  };

  const handleProceedToSeats = () => {
    if (!selectedTheater || !selectedTime) {
      toast({
        title: 'Select Showtime',
        description: 'Please select a theater and showtime to continue.',
        variant: 'destructive',
      });
      return;
    }
    setSelectedSeatNumbers([]); // Reset seat selection when going to seats
    setStep('seats');
  };

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

    if (!selectedTheater || !selectedTime || !selectedShowtimeId) return;

    if (selectedSeatNumbers.length !== ticketCount) {
      toast({
        title: 'Select Seats',
        description: `Please select exactly ${ticketCount} seat(s).`,
        variant: 'destructive',
      });
      return;
    }

    try {
      const booking = await createBooking.mutateAsync({
        movie_id: movie.id,
        seats: ticketCount,
        seat_numbers: selectedSeatNumbers,
        total_amount: totalAmount,
        show_date: selectedDate,
        show_time: selectedTime,
        showtime_id: selectedShowtimeId,
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
    setStep('tickets');
    setTicketCount(1);
    setBookingId(null);
    setSelectedTheater(null);
    setSelectedTime(null);
    setSelectedShowtimeId(null);
    setSelectedSeatNumbers([]);
    onOpenChange(false);
  };

  const handleBack = () => {
    if (step === 'theater') setStep('tickets');
    else if (step === 'seats') setStep('theater');
    else if (step === 'payment') setStep('seats');
  };

  const getDialogTitle = () => {
    switch (step) {
      case 'tickets':
        return 'How Many Tickets?';
      case 'theater':
        return 'Select Theater & Showtime';
      case 'seats':
        return 'Select Your Seats';
      case 'payment':
        return 'Complete Payment';
      case 'success':
        return 'Booking Confirmed!';
    }
  };

  const getDialogDescription = () => {
    switch (step) {
      case 'tickets':
        return `Choose the number of tickets for ${movie.title}`;
      case 'theater':
        return 'Choose your preferred theater and showtime';
      case 'seats':
        return `Select ${ticketCount} seat${ticketCount > 1 ? 's' : ''} from the theater layout`;
      case 'payment':
        return 'Complete your payment to confirm booking';
      case 'success':
        return 'Your tickets have been booked successfully';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {(step === 'theater' || step === 'seats' || step === 'payment') && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <DialogTitle className="text-xl">{getDialogTitle()}</DialogTitle>
              <DialogDescription>{getDialogDescription()}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4">
          {/* Ticket Count Selection */}
          {step === 'tickets' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <Ticket className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{movie.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">₹{movie.price} per ticket</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 justify-center">
                  <Ticket className="h-4 w-4" />
                  Number of Tickets
                </Label>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                    disabled={ticketCount <= 1}
                  >
                    -
                  </Button>
                  <span className="text-3xl font-bold w-16 text-center">{ticketCount}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                    disabled={ticketCount >= 10 || ticketCount >= movie.available_seats}
                  >
                    +
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Maximum 10 tickets per booking
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="text-xl font-bold text-primary">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full" onClick={handleProceedToTheater}>
                Select Theater & Showtime
              </Button>
            </div>
          )}

          {/* Theater Selection */}
          {step === 'theater' && (
            <div className="space-y-4">
              <TheaterSelection
                movie={movie}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                selectedTheater={selectedTheater}
                selectedTime={selectedTime}
                onSelectShowtime={handleSelectShowtime}
              />
              <Button
                className="w-full"
                onClick={handleProceedToSeats}
                disabled={!selectedTheater || !selectedTime}
              >
                Select Seats
              </Button>
            </div>
          )}

          {/* Seat Selection */}
          {step === 'seats' && selectedTheater && selectedTime && selectedShowtimeId && (
            <SeatSelection
              movie={movie}
              theater={selectedTheater}
              showtimeId={selectedShowtimeId}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              seats={ticketCount}
              selectedSeatNumbers={selectedSeatNumbers}
              onSeatNumbersChange={setSelectedSeatNumbers}
              totalAmount={totalAmount}
              onProceed={handleBookNow}
              isPending={createBooking.isPending}
            />
          )}

          {/* Payment */}
          {step === 'payment' && selectedTheater && selectedTime && (
            <PaymentStep
              movie={movie}
              theater={selectedTheater}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              seats={ticketCount}
              totalAmount={totalAmount}
              onPay={handlePayment}
              isPending={mockPayment.isPending}
            />
          )}

          {/* Success */}
          {step === 'success' && selectedTheater && selectedTime && (
            <SuccessStep
              movie={movie}
              theater={selectedTheater}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              seats={ticketCount}
              onClose={handleClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
