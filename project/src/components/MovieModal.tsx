import { useEffect, useState } from "react";
import {
  X,
  Star,
  Calendar,
  Clock,
  Play,
  Heart,
  Send,
  Tv,
  Lock,
  Search,
} from "lucide-react";
import type { Movie, MovieDetails } from "../types";
import { fetchMovieDetails, imgUrl } from "../lib/tmdb";
import { isFavorite, toggleFavorite } from "../lib/favorites";
import { getComments, addComment, type Comment } from "../lib/comments";
import { useAuth } from "../hooks/useAuth";

type Props = {
  movie: Movie;
  onClose: () => void;
  onRequireAuth: () => void;
};

export function MovieModal({ movie, onClose, onRequireAuth }: Props) {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [fav, setFav] = useState(isFavorite(movie.id));
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const { user } = useAuth();

  const isTv = Boolean(movie.is_tv);
  const isCustom = Boolean(movie.is_custom);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setDetails(null);
    setComments(getComments(movie.id));
    if (isCustom) {
      setLoading(false);
      return;
    }
    fetchMovieDetails(movie.id, isTv)
      .then((d) => {
        if (!cancelled) setDetails(d);
      })
      .catch(() => {
        // optional catch
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [movie.id, isTv, isCustom]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const title = movie.title;
  
  // Safe links for AdSense Compliance (Official Trailer & Search)
  const trailerUrl = movie.trailer_url || `https://www.youtube.com/results?search_query=${encodeURIComponent(title + " official trailer")}`;
  const searchAvailabilityUrl = `https://www.google.com/search?q=${encodeURIComponent(title + " movie where to watch legal OTT")}`;

  const poster = (details?.poster_path ?? movie.poster_path)
    ? imgUrl(details?.poster_path ?? movie.poster_path, "w500")
    : "";
  const backdrop = (details?.backdrop_path ?? movie.backdrop_path)
    ? imgUrl(details?.backdrop_path ?? movie.backdrop_path, "original")
    : "";

  const genres = details?.genres?.map((g) => g.name).join(" • ") ?? "";
  const director = details?.crew?.find((c) => c.job === "Director")?.name ?? "";
  const cast = details?.cast ?? [];

  const onFav = () => setFav(toggleFavorite(movie));

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onRequireAuth();
      return;
    }
    if (!commentText.trim()) return;
    setComments(addComment(movie.id, user.name, commentText));
    setCommentText("");
  };

  const onCommentFocus = () => {
    if (!user) onRequireAuth();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/85 p-2 backdrop-blur-sm animate-fadeIn md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        className="relative my-4 w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-base-card shadow-2xl animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white/80 transition hover:bg-black/90 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {backdrop && (
          <div className="relative h-40 w-full overflow-hidden md:h-64">
            <img src={backdrop} alt={title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-base-card via-base-card/50 to-transparent" />
          </div>
        )}

        <div className="grid gap-5 p-4 md:grid-cols-[260px_1fr] md:gap-8 md:p-8">
          <div className="-mt-20 mx-auto w-40 flex-none md:-mt-24 md:mx-0 md:w-56">
            {poster ? (
              <img
                src={poster}
                alt={title}
                className="w-full rounded-xl border border-white/10 shadow-xl"
              />
            ) : (
              <div className="flex aspect-[2/3] w-full items-center justify-center rounded-xl bg-base-elevated text-center text-sm text-white/40">
                {title}
              </div>
            )}
            <button
              onClick={onFav}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/15"
            >
              <Heart className={`h-4 w-4 ${fav ? "fill-accent-red text-accent-red" : ""}`} />
              {fav ? "In Favorites" : "Add to Favorites"}
            </button>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-3xl tracking-wide text-white md:text-4xl">{title}</h2>
              {isTv && (
                <span className="flex items-center gap-1 rounded-full border border-accent-red/40 bg-accent-red/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent-red">
                  <Tv className="h-3 w-3" /> Series
                </span>
              )}
              {isCustom && (
                <span className="rounded-full border border-white/30 bg-white/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white/80">
                  Custom
                </span>
              )}
            </div>
            {details?.tagline && (
              <p className="mt-1 text-sm italic text-white/60">{details.tagline}</p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/70">
              {movie.vote_average > 0 && (
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="h-4 w-4 fill-amber-400" /> {movie.vote_average.toFixed(1)}
                </span>
              )}
              {movie.release_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" /> {movie.release_date}
                </span>
              )}
              {details?.runtime != null && details.runtime > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {details.runtime} min
                </span>
              )}
              {isTv && details?.number_of_seasons != null && (
                <span className="text-white/70">
                  {details.number_of_seasons} season{details.number_of_seasons !== 1 ? "s" : ""}
                  {details.number_of_episodes ? ` • ${details.number_of_episodes} eps` : ""}
                </span>
              )}
            </div>

            {genres && (
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/50">{genres}</p>
            )}
            {isCustom && movie.custom_category && (
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-accent-red/70">
                {movie.custom_category}
              </p>
            )}

            <p className="mt-4 text-sm leading-relaxed text-white/80 md:text-base">
              {movie.overview || details?.overview || "No description available."}
            </p>

            {director && (
              <p className="mt-3 text-sm text-white/70">
                <span className="text-white/40">Director: </span>
                {director}
              </p>
            )}

            {/* Safe Action Buttons (Watch Trailer & Check Streaming) */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent-red px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-accent-red/30 transition hover:bg-accent-red-dark md:text-lg"
              >
                <Play className="h-5 w-5 fill-white" /> Watch Trailer
              </a>
              <a
                href={searchAvailabilityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3.5 text-base font-bold text-white transition hover:bg-white/20 md:text-lg"
              >
                <Search className="h-5 w-5" /> Check Availability
              </a>
            </div>

            {isTv && details?.seasons && details.seasons.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  Seasons
                </h3>
                <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                  {details.seasons
                    .filter((s) => s.season_number > 0)
                    .slice(0, 12)
                    .map((s) => (
                      <div
                        key={s.id}
                        className="flex w-20 flex-none flex-col items-center rounded-lg border border-white/10 bg-base-elevated/60 p-2 text-center"
                      >
                        {s.poster_path ? (
                          <img
                            src={imgUrl(s.poster_path, "w200")}
                            alt={s.name}
                            loading="lazy"
                            className="mb-1 h-24 w-full rounded object-cover"
                          />
                        ) : (
                          <div className="mb-1 flex h-24 w-full items-center justify-center rounded bg-base-elevated text-xs text-white/30">
                            S{s.season_number}
                          </div>
                        )}
                        <p className="truncate text-[10px] font-medium text-white/80">{s.name}</p>
                        <p className="text-[9px] text-white/40">{s.episode_count} eps</p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {cast.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
                  Cast
                </h3>
                <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
                  {cast.slice(0, 10).map((c) => (
                    <div key={c.id} className="w-16 flex-none text-center md:w-20">
                      {c.profile_path ? (
                        <img
                          src={imgUrl(c.profile_path, "w200")}
                          alt={c.name}
                          loading="lazy"
                          className="mx-auto h-16 w-16 rounded-full object-cover md:h-20 md:w-20"
                        />
                      ) : (
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-base-elevated text-2xl text-white/40 md:h-20 md:w-20">
                          {c.name.charAt(0)}
                        </div>
                      )}
                      <p className="mt-1.5 truncate text-xs font-medium text-white/90">{c.name}</p>
                      <p className="truncate text-[10px] text-white/40">{c.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="mt-8">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
                Comments
              </h3>
              <form onSubmit={submitComment} className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onFocus={onCommentFocus}
                  placeholder={user ? "Share your thoughts…" : "Sign in to comment…"}
                  className="flex-1 rounded-lg border border-white/15 bg-base-elevated px-3 py-2.5 text-sm text-white outline-none focus:border-accent-red"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="flex items-center gap-1.5 rounded-lg bg-accent-red px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-red-dark disabled:opacity-50"
                >
                  {user ? <Send className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </button>
              </form>
              <div className="space-y-3">
                {comments.length === 0 && (
                  <p className="text-sm text-white/40">No comments yet. Be the first!</p>
                )}
                {comments.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <img src={c.avatar} alt={c.author} className="h-9 w-9 flex-none rounded-full" />
                    <div className="min-w-0 flex-1 rounded-lg bg-base-elevated/60 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white/90">{c.author}</span>
                        <span className="text-xs text-white/40">
                          {new Date(c.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-white/70">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {loading && <p className="mt-4 text-xs text-white/40">Loading full details…</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
