import { useState } from 'react';
import { format } from 'date-fns';
import { CreditCard, Loader2, Smartphone, Building2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Movie } from '@/hooks/useMovies';
import { Theater } from '@/hooks/useTheaters';
import { cn } from '@/lib/utils';

interface PaymentStepProps {
  movie: Movie;
  theater: Theater;
  selectedDate: string;
  selectedTime: string;
  seats: number;
  selectedSeatNumbers: string[];
  totalAmount: number;
  onPay: () => void;
  isPending: boolean;
}

type PaymentMethod = 'credit' | 'debit' | 'upi';

const PaymentStep = ({
  movie,
  theater,
  selectedDate,
  selectedTime,
  seats,
  selectedSeatNumbers,
  totalAmount,
  onPay,
  isPending,
}: PaymentStepProps) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const isFormValid = () => {
    if (paymentMethod === 'upi') {
      return upiId.includes('@') && upiId.length >= 5;
    }
    return (
      cardNumber.replace(/\s/g, '').length === 16 &&
      cardExpiry.length === 5 &&
      cardCvv.length >= 3 &&
      cardName.length >= 2
    );
  };

  const handlePayment = () => {
    if (isFormValid()) {
      onPay();
    }
  };

  return (
    <div className="space-y-6 mt-4">
      {/* Booking Summary */}
      <div className="bg-secondary/50 rounded-lg p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          Booking Summary
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Movie</span>
            <span className="font-medium">{movie.title}</span>
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
            <span className="text-muted-foreground">Date & Time</span>
            <span>{format(new Date(selectedDate), 'EEE, MMM d')} • {selectedTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Seats</span>
            <span className="font-medium">{selectedSeatNumbers.join(', ')}</span>
          </div>
          <div className="border-t border-border mt-3 pt-3 flex justify-between">
            <span className="font-semibold">Total Amount</span>
            <span className="font-bold text-lg text-primary">₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-4">
        <h3 className="font-semibold">Select Payment Method</h3>
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
          className="grid grid-cols-3 gap-3"
        >
          <div>
            <RadioGroupItem value="credit" id="credit" className="peer sr-only" />
            <Label
              htmlFor="credit"
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all",
                paymentMethod === 'credit' && "border-primary bg-primary/5"
              )}
            >
              <CreditCard className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Credit Card</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="debit" id="debit" className="peer sr-only" />
            <Label
              htmlFor="debit"
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all",
                paymentMethod === 'debit' && "border-primary bg-primary/5"
              )}
            >
              <Building2 className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Debit Card</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="upi" id="upi" className="peer sr-only" />
            <Label
              htmlFor="upi"
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all",
                paymentMethod === 'upi' && "border-primary bg-primary/5"
              )}
            >
              <Smartphone className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">UPI</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Payment Form */}
      <div className="space-y-4">
        {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
          <div className="space-y-4 bg-muted/30 rounded-lg p-4 border border-border">
            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="•••"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'upi' && (
          <div className="space-y-4 bg-muted/30 rounded-lg p-4 border border-border">
            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter your UPI ID linked to your bank account
              </p>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI" className="h-8 object-contain" />
              <span className="text-xs text-muted-foreground">
                Supported: Google Pay, PhonePe, Paytm, and all UPI apps
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Mock Payment Notice */}
      <div className="bg-accent/50 border border-accent rounded-lg p-3">
        <p className="text-xs text-muted-foreground">
          <strong>Demo Mode:</strong> This is a simulated payment. No actual charges will be made.
        </p>
      </div>

      <Button
        className="w-full" 
        onClick={handlePayment} 
        disabled={isPending || !isFormValid()}
        size="lg"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay ₹{totalAmount.toFixed(2)}
          </>
        )}
      </Button>
    </div>
  );
};

export default PaymentStep;
