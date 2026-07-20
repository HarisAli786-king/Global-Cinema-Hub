import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !anonKey) {
  throw new Error("Missing Supabase env vars (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).");
}

export const supabase = createClient(url, anonKey);

export type Genre = {
  id: string;
  name: string;
  slug: string;
};

export type WatchOption = {
  id: string;
  provider: string;
  search_url: string;
};

export type Movie = {
  id: string;
  title: string;
  tagline: string | null;
  overview: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  trailer_url: string | null;
  year: number | null;
  runtime_minutes: number | null;
  rating: number | null;
  country: string | null;
  language: string | null;
  is_featured: boolean;
  created_at: string;
  genres?: Genre[];
  watch_options?: WatchOption[];
};
