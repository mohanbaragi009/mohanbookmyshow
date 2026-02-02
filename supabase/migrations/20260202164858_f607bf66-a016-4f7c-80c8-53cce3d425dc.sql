-- Add seat_numbers column to bookings to track specific seats booked
ALTER TABLE public.bookings ADD COLUMN seat_numbers TEXT[] DEFAULT '{}';

-- Create a table to track booked seats per showtime
CREATE TABLE public.booked_seats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_showtime_id UUID NOT NULL REFERENCES public.movie_showtimes(id) ON DELETE CASCADE,
  seat_number TEXT NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(movie_showtime_id, seat_number)
);

-- Enable RLS
ALTER TABLE public.booked_seats ENABLE ROW LEVEL SECURITY;

-- Anyone can view booked seats
CREATE POLICY "Anyone can view booked seats" ON public.booked_seats FOR SELECT USING (true);

-- Users can insert booked seats (through booking flow)
CREATE POLICY "Authenticated users can book seats" ON public.booked_seats FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);