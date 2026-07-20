import { useEffect, useState } from "react";
import { X, KeyRound, Lock, AlertTriangle, Check } from "lucide-react";
import { getApiKey, setApiKey, hasCustomKey } from "../lib/apiKey";

type Props = { onClose: () => void };

export function SettingsModal({ onClose }: Props) {
  const [usingCustom, setUsingCustom] = useState(hasCustomKey());
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);
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

  const trimmed = draft.trim();
  const isValid = /^[a-f0-9]{32}$/.test(trimmed);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!trimmed) {
      setError("Please enter a key.");
      return;
    }
    if (!isValid) {
      setError("That doesn't look like a valid TMDB API v3 key (32 hex characters).");
      return;
    }
    setApiKey(trimmed);
    setUsingCustom(true);
    setSaved(true);
    setDraft("");
    setTimeout(() => setSaved(false), 2500);
  };

  const resetToDefault = () => {
    setApiKey("");
    setUsingCustom(false);
    setError("");
    setDraft("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-base-card p-6 shadow-2xl animate-fadeInUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/70 transition hover:bg-white/15 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          <KeyRound className="h-6 w-6 text-accent-red" />
          <h2 className="text-xl font-semibold text-white">API Key Settings</h2>
        </div>
        <p className="mt-2 text-sm text-white/60">
          Paste your TMDB API v3 key here. It's stored locally in your browser only.
        </p>

        <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-none text-red-400" />
          <p className="text-xs leading-relaxed text-red-200">
            <span className="font-semibold">Notice:</span> Enter a valid 32-character TMDB API v3
            key. Do not share your private key.
          </p>
        </div>

        <form onSubmit={save} className="mt-5">
          <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">
            TMDB API Key
          </label>
          <div className="relative">
            <input
              type="password"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="••••••••••••••••••••••••••••••••"
              autoComplete="off"
              spellCheck={false}
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
              className="w-full rounded-lg border border-white/15 bg-base-elevated px-4 py-3 pr-11 font-mono text-sm tracking-widest text-white outline-none focus:border-accent-red"
              style={{ userSelect: "none", WebkitUserSelect: "none" }}
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
              <Lock className="h-5 w-5" />
            </div>
          </div>

          {error && (
            <p className="mt-2 text-xs text-red-300">{error}</p>
          )}

          <div className="mt-5 flex gap-3">
            <button
              type="submit"
              disabled={!trimmed}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent-red px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-red-dark disabled:opacity-50"
            >
              <KeyRound className="h-4 w-4" /> Save Key
            </button>
            <button
              type="button"
              onClick={resetToDefault}
              className="rounded-lg border border-white/15 px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              Use Default
            </button>
          </div>
        </form>

        <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
          {saved ? (
            <span className="flex items-center gap-1.5 text-green-400">
              <Check className="h-3.5 w-3.5" /> Saved — content refreshing now.
            </span>
          ) : (
            <>
              <Lock className="h-3 w-3" /> Key set &amp; locked.
              {usingCustom ? " Using your saved key." : " Using built-in default key."}
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
        >
          Close
        </button>
      </div>
    </div>
  );
}
