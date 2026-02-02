-- Create theaters table
CREATE TABLE public.theaters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Mumbai',
  amenities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create movie_showtimes table (links movies to theaters with specific times)
CREATE TABLE public.movie_showtimes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
  theater_id UUID NOT NULL REFERENCES public.theaters(id) ON DELETE CASCADE,
  show_date DATE NOT NULL,
  show_times TEXT[] NOT NULL DEFAULT '{}',
  price_multiplier NUMERIC DEFAULT 1.0,
  available_seats INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(movie_id, theater_id, show_date)
);

-- Enable RLS
ALTER TABLE public.theaters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movie_showtimes ENABLE ROW LEVEL SECURITY;

-- Public read access for theaters
CREATE POLICY "Anyone can view theaters" ON public.theaters FOR SELECT USING (true);

-- Public read access for showtimes
CREATE POLICY "Anyone can view showtimes" ON public.movie_showtimes FOR SELECT USING (true);

-- Insert sample theaters
INSERT INTO public.theaters (name, location, city, amenities) VALUES
  ('PVR Cinemas', 'Phoenix Mall, Lower Parel', 'Mumbai', ARRAY['Dolby Atmos', 'IMAX', 'Recliner Seats']),
  ('INOX', 'R City Mall, Ghatkopar', 'Mumbai', ARRAY['4DX', 'Dolby Atmos', 'Food Court']),
  ('Cinepolis', 'Viviana Mall, Thane', 'Mumbai', ARRAY['VIP Lounge', 'Dolby Atmos']),
  ('Carnival Cinemas', 'Andheri West', 'Mumbai', ARRAY['3D', 'Parking']),
  ('Miraj Cinemas', 'Dombivli', 'Mumbai', ARRAY['Dolby Sound', 'Snack Bar']);