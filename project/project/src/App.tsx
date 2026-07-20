import { useEffect, useRef, useState } from "react";
import type { Movie } from "./types";
import { trendingMovies, searchMovies } from "./lib/tmdb";
import { CATEGORIES } from "./lib/categories";
import { useAdsterraTrigger } from "./hooks/useAdsterraTrigger";
import { useAuth } from "./hooks/useAuth";
import { useFavorites } from "./hooks/useFavorites";
import { useCustomMovies } from "./hooks/useCustomMovies";
import { Header } from "./components/Header";
import { HeroSlider } from "./components/HeroSlider";
import { CategoryRow } from "./components/CategoryRow";
import { CategoryGrid } from "./components/CategoryGrid";
import { MovieModal } from "./components/MovieModal";
import { SettingsModal } from "./components/SettingsModal";
import { AdBanner } from "./components/AdBanner";
import { SearchResults } from "./components/SearchResults";
import { CommunityChat } from "./components/CommunityChat";
import { AddMovieModal } from "./components/AddMovieModal";
import { SignInPrompt } from "./components/SignInPrompt";

type Route = "home" | "community" | "category";

export default function App() {
  const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
  const [heroError, setHeroError] = useState(false);
  const [selected, setSelected] = useState<Movie | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addMovieOpen, setAddMovieOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [route, setRoute] = useState<Route>("home");
  const [categoryView, setCategoryView] = useState<string | null>(null);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Auth-gate prompt state
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [authPromptMsg, setAuthPromptMsg] = useState<string | undefined>(undefined);

  const { user, signIn, signOut } = useAuth();
  const favorites = useFavorites();
  const customMovies = useCustomMovies();
  const [customKey, setCustomKey] = useState(0);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useAdsterraTrigger();

  useEffect(() => {
    let cancelled = false;
    setHeroError(false);
    trendingMovies()
      .then((data) => {
        if (!cancelled) setHeroMovies(data.slice(0, 8));
      })
      .catch(() => {
        if (!cancelled) setHeroError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  useEffect(() => {
    const onKeyChange = () => setReloadKey((k) => k + 1);
    window.addEventListener("gch-apikey-change", onKeyChange);
    return () => window.removeEventListener("gch-apikey-change", onKeyChange);
  }, []);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    searchTimer.current = setTimeout(() => {
      searchMovies(searchQuery)
        .then((data) => {
          setSearchResults(data);
          setSearchLoading(false);
        })
        .catch(() => {
          setSearchResults([]);
          setSearchLoading(false);
        });
    }, 400);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [searchQuery]);

  useEffect(() => {
    setCustomKey((k) => k + 1);
  }, [customMovies]);

  const isSearching = searchActive && searchQuery.trim().length > 0;

  const navigate = (r: "home" | "community") => {
    setRoute(r);
    setCategoryView(null);
    setSearchActive(false);
    setSearchQuery("");
    window.scrollTo({ top: 0 });
  };

  const openCategory = (name: string) => {
    setCategoryView(name);
    setRoute("category");
    setSearchActive(false);
    setSearchQuery("");
    window.scrollTo({ top: 0 });
  };

  const backToHome = () => {
    setCategoryView(null);
    setRoute("home");
    window.scrollTo({ top: 0 });
  };

  // Auth-gate helper: blocks an action if logged out and shows the prompt.
  const requireAuth = (msg?: string): boolean => {
    if (user) return true;
    setAuthPromptMsg(msg);
    setAuthPromptOpen(true);
    return false;
  };

  const handleAddMovie = () => {
    if (!requireAuth("Please Sign In with Google to add a custom movie.")) return;
    setAddMovieOpen(true);
  };

  const handlePromptSignIn = () => {
    signIn();
    setAuthPromptOpen(false);
  };

  return (
    <div className="min-h-screen bg-base-black text-white">
      <Header
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenAddMovie={handleAddMovie}
        user={user}
        onSignIn={signIn}
        onSignOut={signOut}
        onSearch={setSearchQuery}
        searchActive={searchActive}
        setSearchActive={setSearchActive}
        onNavigate={navigate}
        route={route === "category" ? "home" : route}
      />

      {route === "community" ? (
        <CommunityChat
          onRequireAuth={() =>
            requireAuth("Please Sign In with Google to send a message in the community chat.")
          }
        />
      ) : route === "category" && categoryView ? (
        <CategoryGrid
          categoryName={categoryView}
          onBack={backToHome}
          onSelect={setSelected}
          customKey={customKey}
        />
      ) : (
        <>
          {heroError ? (
            <div className="flex h-screen items-center justify-center px-6">
              <div className="max-w-md rounded-lg border border-red-500/30 bg-red-500/10 p-6 text-center">
                <p className="text-red-200">Unable to load trending content right now.</p>
                <p className="mt-2 text-xs text-red-200/60">
                  Check your TMDB API key in Settings, or try again shortly.
                </p>
              </div>
            </div>
          ) : (
            <HeroSlider movies={heroMovies} onSelect={setSelected} />
          )}

          {isSearching ? (
            <SearchResults
              results={searchResults}
              loading={searchLoading}
              query={searchQuery}
              onSelect={setSelected}
            />
          ) : (
            <main className="relative z-10 -mt-16 space-y-8 pb-20 md:-mt-32">
              <CategoryRow
                key="My Favorites"
                category={{ name: "My Favorites", fetcher: () => Promise.resolve([]) }}
                onSelect={setSelected}
                onSeeAll={() => {}}
                reloadKey={reloadKey}
                fixedMovies={favorites}
                customKey={customKey}
              />

              <AdBanner />

              {CATEGORIES.map((cat, i) => (
                <div key={cat.name} className="space-y-8">
                  {i === 3 && <AdBanner />}
                  <CategoryRow
                    category={cat}
                    onSelect={setSelected}
                    onSeeAll={openCategory}
                    reloadKey={reloadKey}
                    customKey={customKey}
                  />
                </div>
              ))}
            </main>
          )}

          <footer className="border-t border-white/10 px-4 py-8 text-center text-xs text-white/40 md:px-10">
            <p>Global Cinema Hub — curated films & series from around the world.</p>
            <p className="mt-1">
              Watch &amp; Download links open a Google Search for availability in your region.
            </p>
          </footer>
        </>
      )}

      {selected && (
        <MovieModal
          movie={selected}
          onClose={() => setSelected(null)}
          onRequireAuth={() =>
            requireAuth("Please Sign In with Google to post a comment.")
          }
        />
      )}
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
      {addMovieOpen && (
        <AddMovieModal
          onClose={() => setAddMovieOpen(false)}
          onAdded={() => setCustomKey((k) => k + 1)}
        />
      )}
      {authPromptOpen && (
        <SignInPrompt
          message={authPromptMsg}
          onSignIn={handlePromptSignIn}
          onClose={() => setAuthPromptOpen(false)}
        />
      )}
    </div>
  );
}
