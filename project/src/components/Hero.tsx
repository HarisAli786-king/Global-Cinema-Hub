import type { Movie } from "../lib/supabase";
import { Info, Play } from "lucide-react";

type Props = {
  movie: Movie;
  onMore: () => void;
};

export function Hero({ movie, onMore }: Props) {
  const bg = movie.backdrop_url ?? movie.poster_url ?? "";
  const genres = movie.genres?.map((g) => g.name).join(" • ") ?? "";

  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
      <div className="absolute inset-0">
        {bg ? (
          <img
            src={bg}
            alt={movie.title}
            className="h-full w-full object-cover"
            loading="eager"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-ink-800 via-black to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      </div>

      <div className="relative z-10 flex h-full items-end px-6 pb-16 md:px-10 md:pb-20">
        <div className="max-w-2xl animate-fade-in-up">
          <span className="mb-3 inline-block rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-white/70">
            Featured
          </span>
          <h2 className="font-display text-5xl leading-none tracking-wide text-white md:text-7xl">
            {movie.title}
          </h2>
          <p className="mt-3 text-base text-white/80 md:text-lg">{movie.tagline}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/70">
            {movie.year && <span>{movie.year}</span>}
            {movie.runtime_minutes && <span>• {movie.runtime_minutes} min</span>}
            {movie.rating != null && (
              <span className="text-amber-400">★ {Number(movie.rating).toFixed(1)}</span>
            )}
            {movie.country && <span>• {movie.country}</span>}
            {genres && <span className="hidden md:inline">• {genres}</span>}
          </div>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
            {movie.overview}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {/* 🟢 Watch Trailer Button (Safe for AdSense) */}
            <a
              href={movie.trailer_url || `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " official trailer")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md bg-accent-red px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-red/90 shadow-lg shadow-accent-red/30"
            >
              <Play className="h-4 w-4 fill-current" />
              Watch Trailer
            </a>

            {/* More Info Button */}
            <button
              onClick={onMore}
              className="flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <Info className="h-4 w-4" />
              More Info
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
