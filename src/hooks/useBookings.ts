import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Booking {
  id: string;
  user_id: string;
  movie_id: string;
  seats: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  show_date: string;
  show_time: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingInput {
  movie_id: string;
  seats: number;
  total_amount: number;
  show_date: string;
  show_time: string;
}

export const useBookings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!user,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: CreateBookingInput) => {
      if (!user) throw new Error('You must be logged in to book');

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          movie_id: input.movie_id,
          seats: input.seats,
          total_amount: input.total_amount,
          show_date: input.show_date,
          show_time: input.show_time,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: Booking['status'] }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return data as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

// Mock payment processing
export const useMockPayment = () => {
  const updateBookingStatus = useUpdateBookingStatus();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Update booking status to paid
      return updateBookingStatus.mutateAsync({ bookingId, status: 'paid' });
    },
  });
};
