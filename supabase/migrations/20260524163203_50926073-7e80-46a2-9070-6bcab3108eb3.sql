
-- Restrict booked_seats INSERT to seats tied to the user's own booking
DROP POLICY IF EXISTS "Authenticated users can book seats" ON public.booked_seats;

CREATE POLICY "Users can insert seats for their own bookings"
ON public.booked_seats
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.id = booked_seats.booking_id
      AND bookings.user_id = auth.uid()
  )
);

-- Add DELETE policy on bookings
CREATE POLICY "Users can delete their own bookings"
ON public.bookings
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Add DELETE policy on profiles
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Add server-side constraint to validate seat counts
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_seats_range CHECK (seats > 0 AND seats <= 10);
