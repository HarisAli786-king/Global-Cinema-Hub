import { useEffect, useState } from "react";
import { X, KeyRound, Lock } from "lucide-react";
import { hasCustomKey } from "../lib/apiKey";

type Props = { onClose: () => void };

export function SettingsModal({ onClose }: Props) {
  const [usingCustom] = useState(hasCustomKey());

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

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
          The TMDB API key is configured and locked for security. It cannot be viewed or edited from
          the UI.
        </p>

        <div className="mt-5">
          <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/50">
            TMDB API Key
          </label>
          <div
            className="pointer-events-none flex select-none items-center gap-3 rounded-lg border border-white/10 bg-neutral-800 px-4 py-3"
            style={{ userSelect: "none", WebkitUserSelect: "none", pointerEvents: "none" }}
            aria-hidden="true"
          >
            <Lock className="h-5 w-5 flex-none text-white/30" />
            <span
              className="font-mono text-sm tracking-widest text-white/40"
              style={{ userSelect: "none", WebkitUserSelect: "none" }}
            >
              ••••••••••••••••
            </span>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-white/40">
            <Lock className="h-3 w-3" /> Key set &amp; locked.
            {usingCustom ? " Using your saved key." : " Using built-in default key."}
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-accent-red px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-red-dark"
        >
          Close
        </button>
      </div>
    </div>
  );
}
