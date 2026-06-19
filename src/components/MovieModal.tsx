import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, Play, Plus, Star, Clock, Globe, Check } from 'lucide-react';
import { fetchMovieDetails, getBackdropUrl } from '../services/tmdb';
import type { Movie, MovieDetails } from '../types';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose, onPlay }) => {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const { watchlistIds, toggleWatchlist, user, watchlistLimitReached } = useAuth();
  const inWatchlist = watchlistIds.includes(movie.id);

  useEffect(() => {
    fetchMovieDetails(movie.id).then(setDetails).catch(console.error);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [movie.id]);

  const backdrop = getBackdropUrl(movie.backdrop_path, 'w1280');

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-[#0f171e] border border-white/10 shadow-2xl animate-scale-in">
        {/* Backdrop header */}
        <div className="relative h-48 sm:h-64 overflow-hidden rounded-t-2xl sm:rounded-t-2xl">
          {backdrop ? (
            <img src={backdrop} alt={movie.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a242f] to-[#0a1018]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f171e] via-[#0f171e]/30 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h2 className="text-white text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              {movie.title}
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center gap-1.5">
              <Star size={14} className="text-[#f5c518]" fill="#f5c518" />
              <span className="text-white font-bold text-sm">{movie.vote_average.toFixed(1)}</span>
            </div>
            {movie.release_date && (
              <div className="flex items-center gap-1 text-[#8197a4] text-sm">
                <Clock size={13} />
                {movie.release_date.split('-')[0]}
              </div>
            )}
            {details?.runtime && (
              <span className="text-[#8197a4] text-sm">{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>
            )}
            <div className="flex items-center gap-1 text-[#8197a4] text-sm uppercase">
              <Globe size={13} />
              {movie.original_language}
            </div>
          </div>

          {details?.tagline && (
            <p className="text-[#00a8e1] italic text-sm mb-3">"{details.tagline}"</p>
          )}

          <p className="text-[#8197a4] text-sm leading-relaxed mb-5">{movie.overview}</p>

          {details?.genres && (
            <div className="flex flex-wrap gap-2 mb-6">
              {details.genres.map(g => (
                <span key={g.id} className="px-3 py-1 bg-white/8 border border-white/10 text-[#8197a4] text-xs rounded-full">
                  {g.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { onClose(); onPlay(movie); }}
              className="flex-1 nova-btn-primary justify-center py-3 rounded-xl"
            >
              <Play size={16} fill="white" />
              Watch Now
            </button>
            {user && (
              <button
                onClick={() => {
                  if (!inWatchlist && watchlistLimitReached) return;
                  toggleWatchlist(movie, 'movie');
                }}
                title={!inWatchlist && watchlistLimitReached ? 'Limit reached — upgrade plan' : inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
                className={`nova-btn-secondary px-4 py-3 rounded-xl transition-all ${
                  inWatchlist ? 'bg-[#00a8e1]/20 border-[#00a8e1] text-[#00a8e1]'
                  : !inWatchlist && watchlistLimitReached ? 'opacity-50 cursor-not-allowed'
                  : ''
                }`}
              >
                {inWatchlist ? <Check size={16} /> : <Plus size={16} />}
                {inWatchlist ? 'In Watchlist' : 'Watchlist'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;
