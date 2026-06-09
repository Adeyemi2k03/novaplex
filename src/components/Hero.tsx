import React, { useState, useEffect, useCallback } from 'react';
import { Play, Plus, Info, Star, Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { fetchTrendingMovies, getBackdropUrl } from '../services/tmdb';
import { useAuth } from '../contexts/AuthContext';
import type { Movie } from '../types';

interface HeroProps {
  onPlay: (movie: Movie) => void;
  onInfo: (movie: Movie) => void;
}

const Hero: React.FC<HeroProps> = ({ onPlay, onInfo }) => {
  const [featured, setFeatured] = useState<Movie[]>([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const { watchlistIds, toggleWatchlist, user } = useAuth();

  useEffect(() => {
    fetchTrendingMovies().then(m => setFeatured(m.slice(0, 6))).catch(console.error);
  }, []);

  const prev = useCallback(() => { setCurrent(c => (c - 1 + featured.length) % featured.length); setPaused(true); }, [featured.length]);
  const next = useCallback(() => { setCurrent(c => (c + 1) % featured.length); setPaused(true); }, [featured.length]);

  useEffect(() => {
    if (!paused) return;
    const t = setTimeout(() => setPaused(false), 4000);
    return () => clearTimeout(t);
  }, [paused]);

  useEffect(() => {
    if (featured.length <= 1 || paused) return;
    const interval = setInterval(() => setCurrent(c => (c + 1) % featured.length), 7000);
    return () => clearInterval(interval);
  }, [featured.length, paused]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prev, next]);

  const movie = featured[current];
  if (!movie) {
    return (
      <div className="h-[75vh] min-h-[520px] bg-gradient-to-b from-[#0a1018] to-[#0f171e] flex items-end pb-16">
        <div className="max-w-[1400px] mx-auto px-6 w-full space-y-3">
          <div className="h-6 w-48 bg-white/8 rounded-lg animate-pulse" />
          <div className="h-12 w-72 bg-white/10 rounded-lg animate-pulse" />
          <div className="h-4 w-96 bg-white/5 rounded-lg animate-pulse" />
          <div className="h-4 w-80 bg-white/5 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  const backdrop = getBackdropUrl(movie.backdrop_path, 'original');
  const inWatchlist = watchlistIds.includes(movie.id);

  return (
    <div className="relative h-[75vh] min-h-[520px] overflow-hidden group/hero">
      {/* Backdrop */}
      {backdrop && (
        <div
          key={movie.id}
          className="absolute inset-0 bg-cover bg-center animate-scale-in"
          style={{ backgroundImage: `url(${backdrop})` }}
        />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f171e] via-[#0f171e]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f171e] via-[#0f171e]/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

      {/* ── Desktop arrows — centered vertically, hidden until hover ── */}
      {featured.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute left-5 top-1/2 -translate-y-1/2 z-20
              w-12 h-12 rounded-full
              bg-black/50 hover:bg-[#00a8e1] border border-white/20 hover:border-[#00a8e1]
              hidden sm:flex items-center justify-center text-white
              transition-all duration-200 cursor-pointer
              opacity-0 group-hover/hero:opacity-100 hover:scale-110 shadow-xl"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute right-5 top-1/2 -translate-y-1/2 z-20
              w-12 h-12 rounded-full
              bg-black/50 hover:bg-[#00a8e1] border border-white/20 hover:border-[#00a8e1]
              hidden sm:flex items-center justify-center text-white
              transition-all duration-200 cursor-pointer
              opacity-0 group-hover/hero:opacity-100 hover:scale-110 shadow-xl"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Content */}
      <div className="relative h-full flex items-end">
        <div className="max-w-[1400px] mx-auto px-6 w-full pb-16 sm:pb-20">
          <div key={movie.id} className="max-w-lg animate-slide-left">
            {/* Meta badges */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="px-2.5 py-0.5 bg-[#00a8e1] text-white text-xs font-bold rounded-md tracking-wider">NOVA</span>
              <div className="flex items-center gap-1.5">
                <Star size={13} className="text-[#f5c518]" fill="#f5c518" />
                <span className="text-white text-sm font-semibold">{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#8197a4] text-sm">
                <Clock size={13} />
                <span>{movie.release_date?.split('-')[0]}</span>
              </div>
            </div>

            {/* Title */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-none"
              style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '-0.02em' }}
            >
              {movie.title}
            </h1>

            {/* Overview */}
            <p className="text-[#8197a4] text-sm sm:text-base mb-7 line-clamp-3 max-w-md leading-relaxed">
              {movie.overview}
            </p>

            {/* Buttons */}
            <div className="flex gap-2 flex-nowrap items-center">
              <button
                onClick={() => onPlay(movie)}
                className="nova-btn-primary text-xs sm:text-sm px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-xl shadow-[#00a8e1]/25 animate-pulse-blue whitespace-nowrap"
              >
                <Play size={14} fill="white" />
                Watch Now
              </button>
              <button
                onClick={() => onInfo(movie)}
                className="nova-btn-secondary text-xs sm:text-sm px-3 sm:px-6 py-2 sm:py-3 rounded-xl whitespace-nowrap"
              >
                <Info size={14} />
                More Info
              </button>
              {user && (
                <button
                  onClick={() => toggleWatchlist(movie, 'movie')}
                  className={`nova-btn-secondary text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-3 rounded-xl transition-all whitespace-nowrap ${inWatchlist ? 'bg-[#00a8e1]/15 border-[#00a8e1]/50 text-[#00a8e1]' : ''}`}
                >
                  {inWatchlist ? <Check size={14} /> : <Plus size={14} />}
                  {inWatchlist ? 'In Watchlist' : 'Watchlist'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicator dots */}
      {featured.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setPaused(true); }}
              aria-label={`Slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 cursor-pointer ${i === current ? 'w-8 h-2.5 bg-[#00a8e1]' : 'w-2.5 h-2.5 bg-white/25 hover:bg-white/50'
                }`}
            />
          ))}
        </div>
      )}

      {/* Slide counter */}
      {featured.length > 1 && (
        <div className="absolute top-20 right-6 text-white/30 text-xs font-mono hidden sm:block select-none">
          {current + 1} / {featured.length}
        </div>
      )}
    </div>
  );
};

export default Hero;
