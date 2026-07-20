import { useEffect, useState } from "react";
import { X, Plus, Film } from "lucide-react";
import { addCustomMovie } from "../lib/customMovies";
import { CATEGORY_NAMES } from "../lib/categories";

type Props = {
  onClose: () => void;
  onAdded: () => void;
};

export function AddMovieModal({ onClose, onAdded }: Props) {
  const [title, setTitle] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [category, setCategory] = useState(CATEGORY_NAMES[0]);
  const [description, setDescription] = useState("");
  const [watchUrl, setWatchUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }
    if (!category) {
      setError("Please select a category.");
      return;
    }
    addCustomMovie({
      title,
      posterUrl,
      category,
      description,
      watchUrl,
    });
    onAdded();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative my-4 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-base-card shadow-2xl animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/70 transition hover:bg-white/15 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 border-b border-white/10 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-red/15 text-accent-red">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Add Custom Movie</h2>
            <p className="text-xs text-white/50">Add your own title to any category.</p>
          </div>
        </div>

        <form onSubmit={submit} className="max-h-[70vh] space-y-4 overflow-y-auto p-6">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-white/50">
              Movie / Show Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Neon Skyline"
              className="w-full rounded-lg border border-white/15 bg-base-elevated px-4 py-2.5 text-sm text-white outline-none focus:border-accent-red"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-white/50">
              Poster Image URL
            </label>
            <input
              type="text"
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              placeholder="https://example.com/poster.jpg"
              className="w-full rounded-lg border border-white/15 bg-base-elevated px-4 py-2.5 text-sm text-white outline-none focus:border-accent-red"
            />
            {posterUrl.trim() && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={posterUrl}
                  alt="Poster preview"
                  className="h-24 w-16 rounded border border-white/10 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.opacity = "0.3";
                  }}
                />
                <span className="text-xs text-white/40">Preview</span>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-white/50">
              Category / Genre
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-base-elevated px-4 py-2.5 text-sm text-white outline-none focus:border-accent-red"
            >
              {CATEGORY_NAMES.map((name) => (
                <option key={name} value={name} className="bg-base-elevated text-white">
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-white/50">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short synopsis…"
              rows={3}
              className="w-full resize-none rounded-lg border border-white/15 bg-base-elevated px-4 py-2.5 text-sm text-white outline-none focus:border-accent-red"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-white/50">
              Watch / Stream Link
            </label>
            <input
              type="text"
              value={watchUrl}
              onChange={(e) => setWatchUrl(e.target.value)}
              placeholder="https://…"
              className="w-full rounded-lg border border-white/15 bg-base-elevated px-4 py-2.5 text-sm text-white outline-none focus:border-accent-red"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent-red px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-red-dark"
            >
              <Film className="h-4 w-4" /> Add to {category}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/15 px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
