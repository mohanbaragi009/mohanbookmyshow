import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BookedSeat {
  id: string;
  movie_showtime_id: string;
  seat_number: string;
  booking_id: string | null;
  created_at: string;
}

export const useBookedSeats = (showtimeId: string | undefined) => {
  return useQuery({
    queryKey: ['booked-seats', showtimeId],
    queryFn: async () => {
      if (!showtimeId) return [];
      
      const { data, error } = await supabase
        .from('booked_seats')
        .select('*')
        .eq('movie_showtime_id', showtimeId);

      if (error) throw error;
      return data as BookedSeat[];
    },
    enabled: !!showtimeId,
  });
};
