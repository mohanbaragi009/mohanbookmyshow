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
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateBooking, useMockPayment } from '@/hooks/useBookings';
import { Movie } from '@/hooks/useMovies';
import { Theater } from '@/hooks/useTheaters';
import { ArrowLeft } from 'lucide-react';
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

type BookingStep = 'theater' | 'seats' | 'payment' | 'success';

const BookingDialog = ({ movie, open, onOpenChange }: BookingDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const createBooking = useCreateBooking();
  const mockPayment = useMockPayment();

  const [step, setStep] = useState<BookingStep>('theater');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [seats, setSeats] = useState(1);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const totalAmount = movie.price * seats;

  const handleSelectShowtime = (theater: Theater, time: string) => {
    setSelectedTheater(theater);
    setSelectedTime(time);
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

    if (!selectedTheater || !selectedTime) return;

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
    setStep('theater');
    setSeats(1);
    setBookingId(null);
    setSelectedTheater(null);
    setSelectedTime(null);
    onOpenChange(false);
  };

  const handleBack = () => {
    if (step === 'seats') setStep('theater');
    else if (step === 'payment') setStep('seats');
  };

  const getDialogTitle = () => {
    switch (step) {
      case 'theater':
        return 'Book Tickets';
      case 'seats':
        return 'Select Seats';
      case 'payment':
        return 'Complete Payment';
      case 'success':
        return 'Booking Confirmed!';
    }
  };

  const getDialogDescription = () => {
    switch (step) {
      case 'theater':
        return 'Choose your preferred theater and showtime';
      case 'seats':
        return 'Select the number of seats for your booking';
      case 'payment':
        return 'Complete your payment to confirm booking';
      case 'success':
        return 'Your tickets have been booked successfully';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] bg-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {(step === 'seats' || step === 'payment') && (
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
                Continue
              </Button>
            </div>
          )}

          {step === 'seats' && selectedTheater && selectedTime && (
            <SeatSelection
              movie={movie}
              theater={selectedTheater}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              seats={seats}
              onSeatsChange={setSeats}
              totalAmount={totalAmount}
              onProceed={handleBookNow}
              isPending={createBooking.isPending}
              maxSeats={movie.available_seats}
            />
          )}

          {step === 'payment' && selectedTheater && selectedTime && (
            <PaymentStep
              movie={movie}
              theater={selectedTheater}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              seats={seats}
              totalAmount={totalAmount}
              onPay={handlePayment}
              isPending={mockPayment.isPending}
            />
          )}

          {step === 'success' && selectedTheater && selectedTime && (
            <SuccessStep
              movie={movie}
              theater={selectedTheater}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              seats={seats}
              onClose={handleClose}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
