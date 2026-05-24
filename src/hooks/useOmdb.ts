import { useQuery } from "@tanstack/react-query";

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

export const fetchOmdb = async (q: string): Promise<OmdbSearchResponse> => {
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const url = `https://${projectId}.supabase.co/functions/v1/omdb-search?q=${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
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
