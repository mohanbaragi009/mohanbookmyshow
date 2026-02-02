import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Theater {
  id: string;
  name: string;
  location: string;
  city: string;
  amenities: string[];
  created_at: string;
}

export interface MovieShowtime {
  id: string;
  movie_id: string;
  theater_id: string;
  show_date: string;
  show_times: string[];
  price_multiplier: number;
  available_seats: number;
  created_at: string;
  theater?: Theater;
}

export const useTheaters = () => {
  return useQuery({
    queryKey: ['theaters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('theaters')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Theater[];
    },
  });
};

export const useMovieShowtimes = (movieId: string, date?: string) => {
  return useQuery({
    queryKey: ['movie-showtimes', movieId, date],
    queryFn: async () => {
      let query = supabase
        .from('movie_showtimes')
        .select(`
          *,
          theater:theaters(*)
        `)
        .eq('movie_id', movieId);
      
      if (date) {
        query = query.eq('show_date', date);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as (MovieShowtime & { theater: Theater })[];
    },
    enabled: !!movieId,
  });
};
