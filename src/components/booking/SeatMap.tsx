import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useBookedSeats } from '@/hooks/useBookedSeats';
import { Monitor } from 'lucide-react';

interface SeatMapProps {
  showtimeId: string;
  maxSeats: number;
  selectedSeats: string[];
  onSeatSelect: (seats: string[]) => void;
}

// Theater layout configuration
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const SEATS_PER_ROW = 12;
const PREMIUM_ROWS = ['G', 'H']; // Back rows are premium
const VIP_ROWS = ['D', 'E', 'F']; // Middle rows

const SeatMap = ({ showtimeId, maxSeats, selectedSeats, onSeatSelect }: SeatMapProps) => {
  const { data: bookedSeats, isLoading } = useBookedSeats(showtimeId);

  const bookedSeatNumbers = useMemo(() => {
    return new Set(bookedSeats?.map(s => s.seat_number) || []);
  }, [bookedSeats]);

  const handleSeatClick = (seatId: string) => {
    if (bookedSeatNumbers.has(seatId)) return; // Can't select booked seats

    if (selectedSeats.includes(seatId)) {
      // Deselect seat
      onSeatSelect(selectedSeats.filter(s => s !== seatId));
    } else if (selectedSeats.length < maxSeats) {
      // Select seat (if under limit)
      onSeatSelect([...selectedSeats, seatId]);
    }
  };

  const getSeatStatus = (seatId: string): 'available' | 'booked' | 'selected' => {
    if (selectedSeats.includes(seatId)) return 'selected';
    if (bookedSeatNumbers.has(seatId)) return 'booked';
    return 'available';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 mx-auto" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Screen */}
      <div className="relative">
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
          <Monitor className="h-4 w-4" />
          <span className="text-xs uppercase tracking-wider">Screen</span>
        </div>
        <div className="h-2 bg-gradient-to-b from-primary/60 to-transparent rounded-t-full mx-8" />
        <div className="h-1 bg-primary/30 rounded-full mx-4 mb-6" />
      </div>

      {/* Seat Grid */}
      <div className="flex flex-col gap-2 items-center overflow-x-auto pb-4">
        {ROWS.map((row) => (
          <div key={row} className="flex items-center gap-1">
            {/* Row Label */}
            <span className="w-6 text-xs font-medium text-muted-foreground text-center">
              {row}
            </span>
            
            {/* Seats */}
            <div className="flex gap-1">
              {Array.from({ length: SEATS_PER_ROW }).map((_, seatIndex) => {
                const seatNumber = seatIndex + 1;
                const seatId = `${row}${seatNumber}`;
                const status = getSeatStatus(seatId);
                const isPremium = PREMIUM_ROWS.includes(row);
                const isVip = VIP_ROWS.includes(row);

                // Add gap in the middle (aisle)
                const hasAisle = seatNumber === 4 || seatNumber === 9;

                return (
                  <div key={seatId} className={`flex items-center ${hasAisle ? 'mr-3' : ''}`}>
                    <button
                      onClick={() => handleSeatClick(seatId)}
                      disabled={status === 'booked'}
                      className={`
                        w-7 h-7 sm:w-8 sm:h-8 rounded-t-lg text-xs font-medium
                        transition-all duration-200 flex items-center justify-center
                        ${status === 'booked' 
                          ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50' 
                          : status === 'selected'
                            ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background'
                            : isPremium
                              ? 'border-2 border-amber-500 text-amber-500 hover:bg-amber-500/20'
                              : isVip
                                ? 'border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500/20'
                                : 'border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500/20'
                        }
                        ${status !== 'booked' && selectedSeats.length >= maxSeats && !selectedSeats.includes(seatId)
                          ? 'opacity-40 cursor-not-allowed'
                          : ''
                        }
                      `}
                      title={`Seat ${seatId}${status === 'booked' ? ' (Booked)' : ''}`}
                    >
                      {seatNumber}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Row Label (right side) */}
            <span className="w-6 text-xs font-medium text-muted-foreground text-center">
              {row}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-lg border-2 border-emerald-500" />
          <span className="text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-lg bg-primary" />
          <span className="text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-lg bg-muted opacity-50" />
          <span className="text-muted-foreground">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-lg border-2 border-amber-500" />
          <span className="text-muted-foreground">Premium</span>
        </div>
      </div>

      {/* Selection Info */}
      <div className="bg-secondary/50 rounded-lg p-3 text-center">
        <p className="text-sm">
          Selected: <span className="font-semibold text-primary">{selectedSeats.length}</span> / {maxSeats} seats
          {selectedSeats.length > 0 && (
            <span className="ml-2 text-muted-foreground">
              ({selectedSeats.sort().join(', ')})
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default SeatMap;
