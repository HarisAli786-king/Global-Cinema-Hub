import { Star } from "lucide-react";
import type { Movie } from "../types";
import { imgUrl } from "../lib/tmdb";

type Props = {
  results: Movie[];
  loading: boolean;
  query: string;
  onSelect: (m: Movie) => void;
};

export function SearchResults({ results, loading, query, onSelect }: Props) {
  return (
    <section className="relative z-10 px-4 pt-24 pb-20 md:px-10">
      <h2 className="mb-4 text-xl font-semibold text-white/90 md:text-2xl">
        {loading ? "Searching…" : query ? `Results for “${query}”` : "Search for films & shows above"}
      </h2>

      {loading && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] animate-pulse rounded-lg bg-base-card" />
          ))}
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <p className="text-sm text-white/40">No titles found. Try a different search.</p>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
          {results.map((m) => {
            const poster = m.poster_path ? imgUrl(m.poster_path, "w342") : "";
            return (
              <button
                key={m.id}
                onClick={() => onSelect(m)}
                className="group overflow-hidden rounded-lg bg-base-card text-left transition hover:scale-105 hover:shadow-2xl"
              >
                <div className="aspect-[2/3] w-full overflow-hidden">
                  {poster ? (
                    <img
                      src={poster}
                      alt={m.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-base-elevated p-2 text-center text-xs text-white/40">
                      {m.title}
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="truncate text-xs font-semibold text-white">{m.title}</p>
                  <div className="mt-0.5 flex items-center gap-1 text-[10px] text-white/50">
                    {m.vote_average > 0 && (
                      <span className="flex items-center gap-0.5 text-amber-400">
                        <Star className="h-2.5 w-2.5 fill-amber-400" />
                        {m.vote_average.toFixed(1)}
                      </span>
                    )}
                    {m.release_date && <span>• {m.release_date.slice(0, 4)}</span>}
                    {m.is_tv && <span className="text-accent-red">• Series</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
