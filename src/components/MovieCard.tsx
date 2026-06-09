import React, { useState } from 'react';
import { Play, Plus, Star, Info, Check, Heart } from 'lucide-react';
import { getPosterUrl } from '../services/tmdb';
import { useAuth } from '../contexts/AuthContext';
import type { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onInfo: (movie: Movie) => void;
  onToggleLike: (movie: Movie) => void;
  isLiked: boolean;
  index?: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onPlay, onInfo, onToggleLike, isLiked, index = 0 }) => {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [lastInteraction, setLastInteraction] = useState<'touch' | 'mouse'>('mouse');
  const { watchlistIds, toggleWatchlist, user, watchlistLimitReached } = useAuth();

  const poster = imgError ? '/no-movie.png' : getPosterUrl(movie.poster_path, 'w500');
  const year = movie.release_date?.split('-')[0] ?? 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const inWatchlist = watchlistIds.includes(movie.id);

  return (
    <div
      className="relative group animate-fade-in card-shine"
      style={{ animationDelay: `${(index % 8) * 0.06}s` }}
      onMouseEnter={() => lastInteraction === 'mouse' && setHovered(true)}
      onMouseLeave={() => lastInteraction === 'mouse' && setHovered(false)}
      onTouchStart={() => setLastInteraction('touch')}
      onMouseMove={() => setLastInteraction('mouse')}
      onClick={() => lastInteraction === 'touch' && setHovered(v => !v)}
    >
      <div className="relative overflow-hidden rounded-xl bg-[#1a242f] aspect-[2/3]">
        <img src={poster} alt={movie.title} loading="lazy" onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`} />

        {/* Rating */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
          <Star size={11} className="text-[#f5c518]" fill="#f5c518" />
          <span className="text-white text-xs font-bold">{rating}</span>
        </div>

        {/* Top-right badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5">
          {/* Like button — always visible */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleLike(movie); }}
            title={isLiked ? 'Remove from liked' : 'Like this movie'}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${isLiked ? 'bg-red-500 scale-110' : 'bg-black/60 hover:bg-red-500/80'
              }`}>
            <Heart size={12} className="text-white" fill={isLiked ? 'white' : 'none'} />
          </button>
          {/* Watchlist check badge */}
          {inWatchlist && (
            <div className="w-6 h-6 rounded-full bg-[#00a8e1] flex items-center justify-center">
              <Check size={12} className="text-white" />
            </div>
          )}
        </div>

        {/* Hover actions */}
        <div className={`absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-2 transition-all duration-300 ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <button onClick={(e) => { e.stopPropagation(); onPlay(movie); }}
            className="w-full flex items-center justify-center gap-2 bg-[#00a8e1] hover:bg-[#00d4ff] text-white text-sm font-semibold py-2 rounded-lg transition-colors cursor-pointer">
            <Play size={14} fill="white" />Watch Now
          </button>
          <div className="flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); onInfo(movie); }}
              className="flex-1 flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-white text-xs py-1.5 rounded-lg transition-colors border border-white/10 cursor-pointer">
              <Info size={12} />Details
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!user) return;
                if (!inWatchlist && watchlistLimitReached) return;
                toggleWatchlist(movie, 'movie');
              }}
              title={!user ? 'Sign in to use watchlist' : !inWatchlist && watchlistLimitReached ? 'Limit reached — upgrade plan' : inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
              className={`w-9 flex items-center justify-center rounded-lg transition-all border cursor-pointer ${inWatchlist ? 'bg-[#00a8e1]/20 border-[#00a8e1] text-[#00a8e1]'
                : !inWatchlist && watchlistLimitReached ? 'bg-white/5 border-white/5 text-white/30 cursor-not-allowed'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                }`}>
              {inWatchlist ? <Check size={14} /> : <Plus size={14} />}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-2.5 px-0.5">
        <h3 className="text-white font-semibold text-sm leading-tight line-clamp-1">{movie.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[#8197a4] text-xs">{year}</span>
          <span className="text-[#8197a4] text-xs">•</span>
          <span className="text-[#8197a4] text-xs uppercase">{movie.original_language}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
