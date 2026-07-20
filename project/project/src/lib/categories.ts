import type { CategoryConfig, Movie } from "../types";
import {
  discoverMovies,
  discoverMoviesPaged,
  trendingMovies,
  trendingMoviesPaged,
  popularMovies,
  popularMoviesPaged,
  searchMovies,
  searchMoviesPaged,
  searchTv,
  searchTvPaged,
  discoverTv,
  discoverTvPaged,
  GENRE_IDS,
  TV_GENRE_IDS,
} from "./tmdb";

// A category can specify both a single-page fetcher (for the homepage row)
// and a paged fetcher (for the "See All" grid view). When only a fetcher is
// given, the paged version falls back to fetching page 1 of the same query.
export type Category = CategoryConfig & {
  pagedFetcher?: (page: number) => Promise<{ results: Movie[]; total_pages: number; total_results: number }>;
};

const marvel = () =>
  discoverMovies({ with_companies: "420", sort_by: "popularity.desc" }).catch(() => searchMovies("Marvel"));
const marvelPaged = (page: number) =>
  discoverMoviesPaged({ with_companies: "420", sort_by: "popularity.desc" }, page).catch(() =>
    searchMoviesPaged("Marvel", page)
  );

const dc = () => searchMovies("DC Comics superhero").catch(() => searchMovies("DC"));
const dcPaged = (page: number) => searchMoviesPaged("DC Comics superhero", page).catch(() => searchMoviesPaged("DC", page));

const genre = (id: number) => () => discoverMovies({ with_genres: id, sort_by: "popularity.desc" });
const genrePaged = (id: number) => (page: number) =>
  discoverMoviesPaged({ with_genres: id, sort_by: "popularity.desc" }, page);

const anime = () =>
  discoverTv({
    with_genres: TV_GENRE_IDS.animation,
    with_original_language: "ja",
    sort_by: "popularity.desc",
  }).catch(() => searchTv("anime"));
const animePaged = (page: number) =>
  discoverTvPaged(
    { with_genres: TV_GENRE_IDS.animation, with_original_language: "ja", sort_by: "popularity.desc" },
    page
  ).catch(() => searchTvPaged("anime", page));

const boboiboy = () => searchTv("BoBoiBoy").catch(() => Promise.resolve([]));
const boboiboyPaged = (page: number) => searchTvPaged("BoBoiBoy", page).catch(() => ({ results: [], total_pages: 0, total_results: 0 }));

const ben10 = () => searchTv("Ben 10").catch(() => Promise.resolve([]));
const ben10Paged = (page: number) => searchTvPaged("Ben 10", page).catch(() => ({ results: [], total_pages: 0, total_results: 0 }));

const koreanDrama = () =>
  discoverTv({ with_original_language: "ko", sort_by: "popularity.desc" }).catch(() => searchTv("Korean drama"));
const koreanDramaPaged = (page: number) =>
  discoverTvPaged({ with_original_language: "ko", sort_by: "popularity.desc" }, page).catch(() =>
    searchTvPaged("Korean drama", page)
  );

const disney = () =>
  discoverMovies({ with_companies: "2, 3, 6259, 3130", sort_by: "popularity.desc" }).catch(() =>
    searchMovies("Disney")
  );
const disneyPaged = (page: number) =>
  discoverMoviesPaged({ with_companies: "2, 3, 6259, 3130", sort_by: "popularity.desc" }, page).catch(() =>
    searchMoviesPaged("Disney", page)
  );

const monsters = () => searchMovies("monster creature").catch(() => Promise.resolve([]));
const monstersPaged = (page: number) => searchMoviesPaged("monster creature", page).catch(() => ({ results: [], total_pages: 0, total_results: 0 }));

const cyberpunk = () =>
  searchMovies("cyberpunk").catch(() => discoverMovies({ with_keywords: 9717, sort_by: "popularity.desc" }));
const cyberpunkPaged = (page: number) =>
  searchMoviesPaged("cyberpunk", page).catch(() => discoverMoviesPaged({ with_keywords: 9717, sort_by: "popularity.desc" }, page));

const sonic = () => searchMovies("Sonic the Hedgehog").catch(() => Promise.resolve([]));
const sonicPaged = (page: number) => searchMoviesPaged("Sonic the Hedgehog", page).catch(() => ({ results: [], total_pages: 0, total_results: 0 }));

const martialArts = () =>
  discoverMovies({ with_keywords: 205857, sort_by: "popularity.desc" }).catch(() => searchMovies("martial arts"));
const superheroes = () =>
  discoverMovies({ with_keywords: 9715, sort_by: "popularity.desc" }).catch(() => searchMovies("superhero"));
const standUpComedy = () =>
  discoverMovies({ with_keywords: 11546, sort_by: "popularity.desc" }).catch(() => searchMovies("stand up comedy"));

export const CATEGORIES: Category[] = [
  { name: "Marvel", fetcher: marvel, pagedFetcher: marvelPaged },
  { name: "DC", fetcher: dc, pagedFetcher: dcPaged },
  { name: "Action", fetcher: genre(GENRE_IDS.action), pagedFetcher: genrePaged(GENRE_IDS.action) },
  { name: "Thriller", fetcher: genre(GENRE_IDS.thriller), pagedFetcher: genrePaged(GENRE_IDS.thriller) },
  { name: "Adventure", fetcher: genre(GENRE_IDS.adventure), pagedFetcher: genrePaged(GENRE_IDS.adventure) },
  { name: "Sci-Fi", fetcher: genre(GENRE_IDS.scifi), pagedFetcher: genrePaged(GENRE_IDS.scifi) },
  { name: "Horror", fetcher: genre(GENRE_IDS.horror), pagedFetcher: genrePaged(GENRE_IDS.horror) },
  { name: "Anime", fetcher: anime, pagedFetcher: animePaged },
  { name: "Cyberpunk", fetcher: cyberpunk, pagedFetcher: cyberpunkPaged },
  { name: "Sonic", fetcher: sonic, pagedFetcher: sonicPaged },
  { name: "BoBoiBoy", fetcher: boboiboy, pagedFetcher: boboiboyPaged },
  { name: "Ben 10", fetcher: ben10, pagedFetcher: ben10Paged },
  { name: "Disney", fetcher: disney, pagedFetcher: disneyPaged },
  { name: "Monsters", fetcher: monsters, pagedFetcher: monstersPaged },
  { name: "Trending Now", fetcher: trendingMovies, pagedFetcher: trendingMoviesPaged },
  { name: "Popular Movies", fetcher: popularMovies, pagedFetcher: popularMoviesPaged },
  { name: "Korean Drama", fetcher: koreanDrama, pagedFetcher: koreanDramaPaged },
  { name: "Mystery", fetcher: genre(GENRE_IDS.mystery), pagedFetcher: genrePaged(GENRE_IDS.mystery) },
  { name: "Fantasy", fetcher: genre(GENRE_IDS.fantasy), pagedFetcher: genrePaged(GENRE_IDS.fantasy) },
  { name: "War", fetcher: genre(GENRE_IDS.war), pagedFetcher: genrePaged(GENRE_IDS.war) },
  { name: "Western", fetcher: genre(GENRE_IDS.western), pagedFetcher: genrePaged(GENRE_IDS.western) },
  { name: "Documentary", fetcher: genre(GENRE_IDS.documentary), pagedFetcher: genrePaged(GENRE_IDS.documentary) },
  { name: "Family", fetcher: genre(GENRE_IDS.family), pagedFetcher: genrePaged(GENRE_IDS.family) },
  { name: "History", fetcher: genre(GENRE_IDS.history), pagedFetcher: genrePaged(GENRE_IDS.history) },
  { name: "Music", fetcher: genre(GENRE_IDS.music), pagedFetcher: genrePaged(GENRE_IDS.music) },
  { name: "Crime", fetcher: genre(GENRE_IDS.crime), pagedFetcher: genrePaged(GENRE_IDS.crime) },
  { name: "Romance", fetcher: genre(GENRE_IDS.romance), pagedFetcher: genrePaged(GENRE_IDS.romance) },
  { name: "Comedy", fetcher: genre(GENRE_IDS.comedy), pagedFetcher: genrePaged(GENRE_IDS.comedy) },
  { name: "Sports", fetcher: genre(GENRE_IDS.sports), pagedFetcher: genrePaged(GENRE_IDS.sports) },
  { name: "Biography", fetcher: genre(GENRE_IDS.biography), pagedFetcher: genrePaged(GENRE_IDS.biography) },
];

export const BONUS_CATEGORIES: Category[] = [
  { name: "Martial Arts", fetcher: martialArts },
  { name: "Superheroes", fetcher: superheroes },
  { name: "Stand-up Comedy", fetcher: standUpComedy },
];

export const CATEGORY_NAMES = [
  ...CATEGORIES.map((c) => c.name),
  ...BONUS_CATEGORIES.map((c) => c.name),
];

export function findCategory(name: string): Category | undefined {
  return [...CATEGORIES, ...BONUS_CATEGORIES].find((c) => c.name === name);
}
