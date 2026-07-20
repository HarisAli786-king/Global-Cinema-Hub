import { Star, Heart } from "lucide-react";
import { useState } from "react";
import type { Movie } from "../types";
import { imgUrl } from "../lib/tmdb";
import { isFavorite, toggleFavorite } from "../lib/favorites";

type Props = {
  movie: Movie;
  onSelect: (m: Movie) => void;
};

export function MovieCard({ movie, onSelect }: Props) {
  const poster = movie.poster_path ? imgUrl(movie.poster_path, "w342") : "";
  const [fav, setFav] = useState(isFavorite(movie.id));

  const onFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setFav(toggleFavorite(movie));
  };

  return (
    <div className="group/card relative w-[140px] flex-none md:w-[180px]">
      <button
        onClick={() => onSelect(movie)}
        className="relative w-full overflow-hidden rounded-lg bg-base-card text-left transition duration-300 hover:z-10 hover:scale-105 hover:shadow-2xl"
      >
        <div className="aspect-[2/3] w-full overflow-hidden">
          {poster ? (
            <img
              src={poster}
              alt={movie.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-300 group-hover/card:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-base-elevated p-2 text-center text-xs text-white/40">
              {movie.title}
            </div>
          )}
        </div>
        {movie.is_tv && (
          <span className="absolute left-2 top-2 rounded bg-accent-red/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
            Series
          </span>
        )}
        {movie.is_custom && (
          <span className="absolute left-2 top-2 rounded bg-white/90 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-black">
            Custom
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-3 pt-8">
          <p className="truncate text-sm font-semibold text-white">{movie.title}</p>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-white/60">
            {movie.vote_average > 0 && (
              <span className="flex items-center gap-0.5 text-amber-400">
                <Star className="h-3 w-3 fill-amber-400" />
                {movie.vote_average.toFixed(1)}
              </span>
            )}
            {movie.release_date && <span>• {movie.release_date.slice(0, 4)}</span>}
          </div>
        </div>
      </button>

      <button
        onClick={onFav}
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition hover:bg-black/80"
      >
        <Heart
          className={`h-4 w-4 transition ${
            fav ? "fill-accent-red text-accent-red" : "text-white/70 hover:text-white"
          }`}
        />
      </button>
    </div>
  );
}
