import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CategoryConfig, Movie } from "../types";
import { useInView } from "../hooks/useInView";
import { MovieCard } from "./MovieCard";
import { customMoviesForCategory } from "../lib/customMovies";

type Props = {
  category: CategoryConfig;
  onSelect: (m: Movie) => void;
  onSeeAll: (categoryName: string) => void;
  reloadKey: number;
  fixedMovies?: Movie[];
  customKey: number;
};

export function CategoryRow({ category, onSelect, onSeeAll, reloadKey, fixedMovies, customKey }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [error, setError] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fixedMovies !== undefined) {
      setMovies(fixedMovies);
      return;
    }
    if (!inView) return;
    let cancelled = false;
    setMovies(null);
    setError(false);
    category
      .fetcher(1)
      .then((data) => {
        if (!cancelled) setMovies(data.length ? data : []);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [inView, category, reloadKey, fixedMovies]);

  const scroll = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const customForCategory = (() => {
    void customKey;
    if (fixedMovies !== undefined) return [];
    return customMoviesForCategory(category.name);
  })();

  const fetched = fixedMovies !== undefined ? fixedMovies : movies;
  const show: Movie[] | null = (() => {
    if (fetched === null) return null;
    if (fixedMovies !== undefined) return fetched;
    const seen = new Set(customForCategory.map((m) => m.id));
    return [...customForCategory, ...fetched.filter((m) => !seen.has(m.id))];
  })();

  if (
    fixedMovies === undefined &&
    inView &&
    !error &&
    movies &&
    movies.length === 0 &&
    customForCategory.length === 0
  ) {
    return <div ref={ref} className="hidden" />;
  }
  if (fixedMovies === undefined && inView && error && customForCategory.length === 0) {
    return <div ref={ref} className="hidden" />;
  }

  const isFavoritesRow = category.name === "My Favorites";
  const showEmptyFavorites = isFavoritesRow && show && show.length === 0;
  const canSeeAll = !isFavoritesRow && (show === null || (show && show.length > 0));

  return (
    <div ref={ref} className="group/row px-4 md:px-10">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight text-white/90 md:text-xl">
          {category.name}
        </h3>
        <div className="flex items-center gap-2">
          {show && show.length > 4 && (
            <div className="hidden gap-2 md:flex">
              <button
                aria-label="Scroll left"
                onClick={() => scroll(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:bg-white/15 hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                aria-label="Scroll right"
                onClick={() => scroll(1)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:bg-white/15 hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
          {canSeeAll && (
            <button
              onClick={() => onSeeAll(category.name)}
              className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 transition hover:bg-white/15 hover:text-white"
            >
              See All
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {fixedMovies === undefined && !inView && <div className="h-[210px] md:h-[270px]" />}

      {fixedMovies === undefined && inView && !movies && !error && (
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-[210px] w-[140px] flex-none animate-pulse rounded-lg bg-base-card md:h-[270px] md:w-[180px]"
            />
          ))}
        </div>
      )}

      {showEmptyFavorites && (
        <p className="py-6 text-sm text-white/40">
          No favorites yet. Tap the heart on any film or series to add it here.
        </p>
      )}

      {show && show.length > 0 && (
        <div
          ref={scroller}
          className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth pb-2 md:gap-4"
        >
          {show.map((m) => (
            <MovieCard key={`${category.name}-${m.id}`} movie={m} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
