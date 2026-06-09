import { useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrendingStrip from './components/TrendingStrip';
import MovieCard from './components/MovieCard';
import TVHero from './components/TVHero';
import TVCard from './components/TVCard';
import VideoPlayer from './components/VideoPlayer';
import TVPlayer from './components/TVPlayer';
import MovieModal from './components/MovieModal';
import TVModal from './components/TVModal';
import WatchlistPanel from './components/WatchlistPanel';
import LikedMoviesPanel from './components/LikedMoviesPanel';
import AuthModal from './components/AuthModal';
import SubscriptionModal from './components/SubscriptionModal';
import SettingsModal from './components/SettingsModal';
import HelpModal from './components/HelpModal';
import FilterBar from './components/FilterBar';
import Spinner, { SkeletonGrid } from './components/Spinner';
import { useMovies, useTrending, useTVShows, useGenres } from './hooks/useMovies';
import { useLiked } from './hooks/useLiked';
import { fetchMovieDetails } from './services/tmdb';
import { useAuth } from './contexts/AuthContext';
import type { Movie, TVShow, Category, TVCategory, MediaTab } from './types';
import { WifiOff, RefreshCw } from 'lucide-react';

function App() {
  const { user } = useAuth();
  const { liked, likedIds, toggleLike, removeLike } = useLiked();
  const genres = useGenres();

  const [activeTab, setActiveTab] = useState<MediaTab>('movies');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<Category>('popular');
  const [tvCategory, setTVCategory] = useState<TVCategory>('popular');
  const [activeGenre, setActiveGenre] = useState<number | null>(null);
  const [activeRating, setActiveRating] = useState<number | null>(null);

  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [playingTV, setPlayingTV] = useState<TVShow | null>(null);
  const [infoMovie, setInfoMovie] = useState<Movie | null>(null);
  const [infoTV, setInfoTV] = useState<TVShow | null>(null);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [showLiked, setShowLiked] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const { movies, isLoading: moviesLoading, error: moviesError, loadMore: loadMoreMovies, hasMore: hasMoreMovies } = useMovies(searchTerm, category);
  const { shows, isLoading: tvLoading, error: tvError, loadMore: loadMoreTV, hasMore: hasMoreTV } = useTVShows(searchTerm, tvCategory);
  const trending = useTrending();

  const handleTrendingSelect = useCallback(async (movieId: number) => {
    try {
      const details = await fetchMovieDetails(movieId);
      setPlayingMovie(details as unknown as Movie);
    } catch { /* silent */ }
  }, []);

  const handleTabChange = (tab: MediaTab) => {
    setActiveTab(tab);
    setSearchTerm('');
    setActiveGenre(null);
    setActiveRating(null);
  };

  const isSearching = searchTerm.trim().length > 0;
  const isLoading = activeTab === 'movies' ? moviesLoading : tvLoading;
  const error = activeTab === 'movies' ? moviesError : tvError;
  const hasMore = activeTab === 'movies' ? hasMoreMovies : hasMoreTV;
  const isOffline = error?.toLowerCase().includes('internet') || error?.toLowerCase().includes('network') || error?.toLowerCase().includes('connection');

  const MOVIE_LABELS: Record<Category, string> = { popular: 'POPULAR NOW', top_rated: 'TOP RATED', now_playing: 'NOW PLAYING', upcoming: 'COMING SOON' };
  const TV_LABELS: Record<TVCategory, string> = { popular: 'POPULAR SHOWS', top_rated: 'TOP RATED', on_the_air: 'ON THE AIR', airing_today: 'AIRING TODAY' };
  const sectionLabel = isSearching ? `Results for "${searchTerm}"` : activeTab === 'movies' ? MOVIE_LABELS[category] : TV_LABELS[tvCategory];

  const filteredMovies = movies
    .filter(m => activeGenre === null || m.genre_ids.includes(activeGenre))
    .filter(m => activeRating === null || m.vote_average >= activeRating);

  const filteredShows = shows
    .filter(s => activeGenre === null || s.genre_ids.includes(activeGenre))
    .filter(s => activeRating === null || s.vote_average >= activeRating);

  const itemCount = activeTab === 'movies' ? filteredMovies.length : filteredShows.length;

  return (
    <div className="min-h-screen bg-[#0f171e]">
      <Navbar
        searchTerm={searchTerm} onSearch={setSearchTerm}
        category={category} onCategory={c => { setCategory(c); setSearchTerm(''); }}
        tvCategory={tvCategory} onTVCategory={c => { setTVCategory(c); setSearchTerm(''); }}
        activeTab={activeTab} onTabChange={handleTabChange}
        onShowWatchlist={() => user ? setShowWatchlist(true) : setShowAuth(true)}
        onShowAuth={() => setShowAuth(true)}
        onShowSubscription={() => user ? setShowSubscription(true) : setShowAuth(true)}
        onShowSettings={() => setShowSettings(true)}
        onShowHelp={() => setShowHelp(true)}
        onShowLiked={() => setShowLiked(true)}
      />

      {activeTab === 'movies' && !isSearching && (
        <Hero onPlay={setPlayingMovie} onInfo={setInfoMovie} />
      )}

      {activeTab === 'tv' && !isSearching && (
        <TVHero onPlay={setPlayingTV} onInfo={setInfoTV} />
      )}

      <main className={activeTab === 'movies' && !isSearching ? '' : 'pt-8'}>
        {activeTab === 'movies' && !isSearching && (
          <TrendingStrip movies={trending} onSelect={handleTrendingSelect} />
        )}

        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-20">

          <FilterBar
            genres={genres}
            onFilterChange={(genreId, minRating) => {
              setActiveGenre(genreId);
              setActiveRating(minRating);
            }}
          />
          <div className="mb-2" />

          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-[#00a8e1] rounded-full" />
              <h2 className="text-white text-xl sm:text-2xl font-bold tracking-wide"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                {sectionLabel}
              </h2>
            </div>
            {itemCount > 0 && (
              <span className="text-[#8197a4] text-xs sm:text-sm bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {itemCount} titles
              </span>
            )}
          </div>

          {error && (
            <div className="flex flex-col items-center justify-center py-20 gap-5">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${isOffline ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                <WifiOff size={32} className={isOffline ? 'text-orange-400' : 'text-red-400'} />
              </div>
              <div className="text-center">
                <p className={`font-bold text-xl mb-2 ${isOffline ? 'text-orange-400' : 'text-red-400'}`}>
                  {isOffline ? 'No Internet Connection' : 'Something Went Wrong'}
                </p>
                <p className="text-[#8197a4] text-sm max-w-sm leading-relaxed">{error}</p>
              </div>
              <button onClick={() => window.location.reload()}
                className="flex items-center gap-2 nova-btn-secondary px-6 py-2.5 rounded-xl">
                <RefreshCw size={15} />Try Again
              </button>
            </div>
          )}

          {!error && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {activeTab === 'movies'
                  ? filteredMovies.map((movie, i) => (
                    <MovieCard key={movie.id} movie={movie} index={i}
                      onPlay={setPlayingMovie} onInfo={setInfoMovie}
                      onToggleLike={m => toggleLike(m, 'movie')}
                      isLiked={likedIds.includes(movie.id)} />
                  ))
                  : filteredShows.map((show, i) => (
                    <TVCard key={show.id} show={show} index={i}
                      onPlay={setPlayingTV} onInfo={setInfoTV}
                      onToggleLike={s => toggleLike(s, 'tv')}
                      isLiked={likedIds.includes(show.id)} />
                  ))
                }
              </div>

              {isLoading && (activeTab === 'movies' ? movies.length : shows.length) === 0 && <SkeletonGrid />}
              {isLoading && (activeTab === 'movies' ? movies.length : shows.length) > 0 && <Spinner />}

              {!isLoading && itemCount === 0 && !error && (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                    <span className="text-3xl">🔍</span>
                  </div>
                  <p className="text-white font-bold text-xl">No results found</p>
                  <p className="text-[#8197a4] text-sm">
                    {isSearching ? 'Try searching with a different term' : 'Try changing the filters'}
                  </p>
                </div>
              )}

              {!isLoading && hasMore && itemCount > 0 && (
                <div className="flex justify-center mt-12">
                  <button onClick={activeTab === 'movies' ? loadMoreMovies : loadMoreTV}
                    className="nova-btn-secondary px-10 py-3 rounded-xl text-sm font-semibold hover:scale-105 transition-transform">
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <footer className="border-t border-white/5 bg-[#0a1018]">
        <div className="max-w-[1400px] mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#00a8e1] flex items-center justify-center">
              <span className="text-white font-black text-xs">N</span>
            </div>
            <span className="text-white font-black text-base" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              NOVA<span className="text-[#00a8e1]">PLEX</span>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-[#8197a4] text-xs">
            <span>Powered by TMDB API</span>
            <span className="hidden sm:block">·</span>
            <span>Search tracking by Appwrite</span>
            <span className="hidden sm:block">·</span>
            <span>© 2026 NovaPlex</span>
          </div>
        </div>
      </footer>

      {playingMovie && <VideoPlayer movie={playingMovie} onClose={() => setPlayingMovie(null)} onSelectMovie={setPlayingMovie} />}
      {playingTV && <TVPlayer show={playingTV} onClose={() => setPlayingTV(null)} onSelectShow={setPlayingTV} />}
      {infoMovie && !playingMovie && <MovieModal movie={infoMovie} onClose={() => setInfoMovie(null)} onPlay={m => { setInfoMovie(null); setPlayingMovie(m); }} />}
      {infoTV && !playingTV && <TVModal show={infoTV} onClose={() => setInfoTV(null)} onPlay={s => { setInfoTV(null); setPlayingTV(s); }} />}
      {showWatchlist && <WatchlistPanel onClose={() => setShowWatchlist(false)} onPlayMovie={m => { setPlayingMovie(m); setShowWatchlist(false); }} onPlayTV={s => { setPlayingTV(s); setShowWatchlist(false); }} />}
      {showLiked && <LikedMoviesPanel liked={liked} onClose={() => setShowLiked(false)} onPlay={m => { setPlayingMovie(m); setShowLiked(false); }} onRemove={removeLike} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showSubscription && <SubscriptionModal onClose={() => setShowSubscription(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}

export default App;
