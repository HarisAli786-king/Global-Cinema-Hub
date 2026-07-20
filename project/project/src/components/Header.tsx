import { Settings, Film, Search, X, MessageCircle, Plus } from "lucide-react";
import type { User } from "../lib/auth";

type Props = {
  onOpenSettings: () => void;
  onOpenAddMovie: () => void;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onSearch: (query: string) => void;
  searchActive: boolean;
  setSearchActive: (v: boolean) => void;
  onNavigate: (route: "home" | "community") => void;
  route: "home" | "community";
};

export function Header({
  onOpenSettings,
  onOpenAddMovie,
  user,
  onSignIn,
  onSignOut,
  onSearch,
  searchActive,
  setSearchActive,
  onNavigate,
  route,
}: Props) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-base-black/95 via-base-black/70 to-transparent">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-2 px-4 py-4 md:px-10">
        <button onClick={() => onNavigate("home")} className="flex flex-none items-center gap-2">
          <Film className="h-7 w-7 text-accent-red" />
          <h1 className="font-display text-lg tracking-[0.18em] text-white md:text-2xl">
            GLOBAL CINEMA HUB
          </h1>
        </button>

        <nav className="hidden gap-6 text-sm text-white/70 md:flex">
          <button
            onClick={() => onNavigate("home")}
            className={`transition hover:text-white ${route === "home" ? "text-white" : ""}`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate("community")}
            className={`flex items-center gap-1.5 transition hover:text-white ${
              route === "community" ? "text-white" : ""
            }`}
          >
            <MessageCircle className="h-4 w-4" /> Community
          </button>
        </nav>

        <div className="flex flex-none items-center gap-2 md:gap-3">
          <div className="relative flex items-center">
            {searchActive && (
              <input
                autoFocus
                type="text"
                placeholder="Search films & shows…"
                onChange={(e) => onSearch(e.target.value)}
                onBlur={(e) => {
                  if (!e.target.value) setSearchActive(false);
                }}
                className="absolute right-10 w-40 animate-expandIn rounded-md border border-white/20 bg-base-elevated/95 px-3 py-1.5 text-sm text-white outline-none focus:border-accent-red md:w-64"
              />
            )}
            <button
              aria-label="Search"
              onClick={() => setSearchActive(!searchActive)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/15 hover:text-white"
            >
              {searchActive ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </button>
          </div>

          <button
            onClick={onOpenAddMovie}
            className="flex items-center gap-1.5 rounded-full border border-accent-red/40 bg-accent-red/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-accent-red hover:text-white md:text-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Movie</span>
          </button>

          <button
            onClick={onOpenSettings}
            aria-label="Settings"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/15 hover:text-white sm:flex"
          >
            <Settings className="h-5 w-5" />
          </button>

          {user ? (
            <button onClick={onSignOut} className="flex items-center gap-2" title="Sign out">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-9 w-9 rounded-full border border-white/20"
              />
            </button>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-white/15 md:text-sm"
            >
              <GoogleIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}
