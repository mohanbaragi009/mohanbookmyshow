import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Movie {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  genre: string[];
  rating: number;
  language: string;
  release_date: string | null;
  duration: string | null;
  votes: string;
  availability: 'available' | 'sold_out' | 'coming_soon';
  price: number;
  available_seats: number;
  created_at: string;
  updated_at: string;
}

export const useMovies = () => {
  return useQuery({
    queryKey: ['movies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Movie[];
    },
  });
};

export const useNowShowingMovies = () => {
  return useQuery({
    queryKey: ['movies', 'now-showing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('availability', 'available')
        .order('rating', { ascending: false });

      if (error) throw error;
      return data as Movie[];
    },
  });
};

export const useUpcomingMovies = () => {
  return useQuery({
    queryKey: ['movies', 'upcoming'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('availability', 'coming_soon')
        .order('release_date', { ascending: true });

      if (error) throw error;
      return data as Movie[];
    },
  });
};

export const useMovie = (id: string) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Movie | null;
    },
    enabled: !!id,
  });
};
