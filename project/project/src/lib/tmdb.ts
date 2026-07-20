import type { Genre, Movie } from "../types";
import { getApiKey } from "./apiKey";

const TMDB_BASE = "https://api.themoviedb.org/3";
export const TMDB_IMG = "https://image.tmdb.org/t/p";

export function imgUrl(
  path: string | null,
  size: "w200" | "w342" | "w500" | "w780" | "original" = "w500"
): string {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  return `${TMDB_IMG}/${size}${path}`;
}

async function tmdb<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", getApiKey());
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${res.statusText}`);
  return (await res.json()) as T;
}

type DiscoverResponse = { results: Movie[]; page: number; total_pages: number; total_results: number };

// --- Movie endpoints ---
export async function discoverMovies(params: Record<string, string | number>): Promise<Movie[]> {
  const data = await tmdb<DiscoverResponse>("/discover/movie", { page: 1, ...params });
  return data.results.filter((m) => m.poster_path || m.backdrop_path);
}

export async function discoverMoviesPaged(
  params: Record<string, string | number>,
  page: number
): Promise<{ results: Movie[]; total_pages: number; total_results: number }> {
  const data = await tmdb<DiscoverResponse>("/discover/movie", { page, ...params });
  return {
    results: data.results.filter((m) => m.poster_path || m.backdrop_path),
    total_pages: data.total_pages,
    total_results: data.total_results,
  };
}

export async function trendingMovies(): Promise<Movie[]> {
  const data = await tmdb<DiscoverResponse>("/trending/movie/week");
  return data.results.filter((m) => m.poster_path || m.backdrop_path);
}

export async function trendingMoviesPaged(page: number): Promise<{ results: Movie[]; total_pages: number; total_results: number }> {
  const data = await tmdb<DiscoverResponse>("/trending/movie/week", { page });
  return {
    results: data.results.filter((m) => m.poster_path || m.backdrop_path),
    total_pages: data.total_pages,
    total_results: data.total_results,
  };
}

export async function popularMovies(): Promise<Movie[]> {
  const data = await tmdb<DiscoverResponse>("/movie/popular");
  return data.results.filter((m) => m.poster_path || m.backdrop_path);
}

export async function popularMoviesPaged(page: number): Promise<{ results: Movie[]; total_pages: number; total_results: number }> {
  const data = await tmdb<DiscoverResponse>("/movie/popular", { page });
  return {
    results: data.results.filter((m) => m.poster_path || m.backdrop_path),
    total_pages: data.total_pages,
    total_results: data.total_results,
  };
}

export async function searchMovies(query: string): Promise<Movie[]> {
  const data = await tmdb<DiscoverResponse>("/search/movie", { query, include_adult: "false" });
  return data.results.filter((m) => m.poster_path || m.backdrop_path);
}

export async function searchMoviesPaged(query: string, page: number): Promise<{ results: Movie[]; total_pages: number; total_results: number }> {
  const data = await tmdb<DiscoverResponse>("/search/movie", { query, include_adult: "false", page });
  return {
    results: data.results.filter((m) => m.poster_path || m.backdrop_path),
    total_pages: data.total_pages,
    total_results: data.total_results,
  };
}

// --- TV endpoints ---
function normalizeTv(item: any): Movie {
  return {
    id: item.id,
    title: item.name || item.original_name || "Untitled Series",
    overview: item.overview ?? "",
    poster_path: item.poster_path ?? null,
    backdrop_path: item.backdrop_path ?? null,
    vote_average: item.vote_average ?? 0,
    release_date: item.first_air_date ?? null,
    genre_ids: item.genre_ids ?? [],
    media_type: "tv",
    is_tv: true,
    first_air_date: item.first_air_date ?? null,
    name: item.name,
  };
}

function filterTv(items: Movie[]): Movie[] {
  return items.filter((m) => m.poster_path || m.backdrop_path);
}

export async function discoverTv(params: Record<string, string | number>): Promise<Movie[]> {
  const data = await tmdb<DiscoverResponse>("/discover/tv", { page: 1, ...params });
  return filterTv(data.results.map(normalizeTv));
}

export async function discoverTvPaged(
  params: Record<string, string | number>,
  page: number
): Promise<{ results: Movie[]; total_pages: number; total_results: number }> {
  const data = await tmdb<DiscoverResponse>("/discover/tv", { page, ...params });
  return {
    results: filterTv(data.results.map(normalizeTv)),
    total_pages: data.total_pages,
    total_results: data.total_results,
  };
}

export async function searchTv(query: string): Promise<Movie[]> {
  const data = await tmdb<DiscoverResponse>("/search/tv", { query, include_adult: "false" });
  return filterTv(data.results.map(normalizeTv));
}

export async function searchTvPaged(query: string, page: number): Promise<{ results: Movie[]; total_pages: number; total_results: number }> {
  const data = await tmdb<DiscoverResponse>("/search/tv", { query, include_adult: "false", page });
  return {
    results: filterTv(data.results.map(normalizeTv)),
    total_pages: data.total_pages,
    total_results: data.total_results,
  };
}

// --- Genres ---
export async function fetchGenres(): Promise<Genre[]> {
  const data = await tmdb<{ genres: Genre[] }>("/genre/movie/list");
  return data.genres;
}

// --- Details (movie or TV) ---
type CreditsResponse = {
  cast: { id: number; name: string; character: string; profile_path: string | null }[];
  crew: { id: number; name: string; job: string; department: string; profile_path: string | null }[];
};

type MovieDetailsResponse = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string | null;
  runtime: number | null;
  genres: Genre[];
  tagline: string | null;
};

type TvDetailsResponse = {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  first_air_date: string | null;
  runtime: number | null;
  episode_run_time: number[];
  genres: Genre[];
  tagline: string | null;
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: { id: number; name: string; season_number: number; episode_count: number; poster_path: string | null }[];
};

type TvCreditsResponse = {
  cast: { id: number; name: string; character: string; profile_path: string | null }[];
  crew: { id: number; name: string; job: string; department: string; profile_path: string | null }[];
};

export async function fetchMovieDetails(id: number, isTv = false) {
  if (isTv) {
    const [details, credits] = await Promise.all([
      tmdb<TvDetailsResponse>(`/tv/${id}`),
      tmdb<TvCreditsResponse>(`/tv/${id}/credits`),
    ]);
    return {
      id: details.id,
      title: details.name,
      overview: details.overview,
      poster_path: details.poster_path,
      backdrop_path: details.backdrop_path,
      vote_average: details.vote_average,
      release_date: details.first_air_date,
      runtime: details.episode_run_time?.[0] ?? null,
      genres: details.genres,
      tagline: details.tagline,
      cast: credits.cast.slice(0, 12),
      crew: credits.crew.slice(0, 12),
      is_tv: true,
      number_of_seasons: details.number_of_seasons,
      number_of_episodes: details.number_of_episodes,
      seasons: details.seasons,
    };
  }
  const [details, credits] = await Promise.all([
    tmdb<MovieDetailsResponse>(`/movie/${id}`),
    tmdb<CreditsResponse>(`/movie/${id}/credits`),
  ]);
  return {
    ...details,
    cast: credits.cast.slice(0, 12),
    crew: credits.crew.slice(0, 12),
    is_tv: false,
  };
}

export const GENRE_IDS = {
  action: 28, thriller: 53, adventure: 12, scifi: 878, horror: 27, mystery: 9648,
  fantasy: 14, war: 10752, western: 37, documentary: 99, family: 10751, history: 36,
  music: 10402, crime: 80, romance: 10749, comedy: 35, sports: 10770, biography: 18,
  animation: 16,
} as const;

export const TV_GENRE_IDS = {
  animation: 16, scifi: 10765, documentary: 99, family: 10751, mystery: 9648,
  war: 10768, western: 37, history: 36, music: 10402, crime: 80, romance: 10749,
  comedy: 35, action: 10759, fantasy: 10765, horror: 10765,
} as const;
