import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface OmdbSearchItem {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export interface OmdbSearchResponse {
  Search?: OmdbSearchItem[];
  totalResults?: string;
  Response: "True" | "False";
  Error?: string;
}

export const useOmdbSearch = (query: string) => {
  const q = query.trim();
  return useQuery({
    queryKey: ["omdb-search", q],
    enabled: q.length > 1,
    staleTime: 1000 * 60 * 10,
    queryFn: async (): Promise<OmdbSearchResponse> => {
      const { data, error } = await supabase.functions.invoke("omdb-search", {
        method: "GET",
        // body not used; query string is passed via URL
      });
      // fallback to direct fetch with query string since invoke doesn't accept GET params nicely
      if (error) throw error;
      if (data) return data as OmdbSearchResponse;
      throw new Error("No data");
    },
  });
};

// Direct fetch helper (supports query string)
export const fetchOmdb = async (q: string): Promise<OmdbSearchResponse> => {
  const url = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/omdb-search?q=${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    headers: {
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`OMDB request failed (${res.status})`);
  return res.json();
};

export const useOmdb = (query: string) => {
  const q = query.trim();
  return useQuery({
    queryKey: ["omdb", q],
    enabled: q.length > 1,
    staleTime: 1000 * 60 * 10,
    queryFn: () => fetchOmdb(q),
  });
};
