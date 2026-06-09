import React, { useEffect } from 'react';
import { X, Heart, Play, Trash2 } from 'lucide-react';
import { getPosterUrl } from '../services/tmdb';
import type { Movie } from '../types';

interface LikedMoviesPanelProps {
  liked: Movie[];
  onClose: () => void;
  onPlay: (movie: Movie) => void;
  onRemove: (id: number) => void;
}

const LikedMoviesPanel: React.FC<LikedMoviesPanelProps> = ({ liked, onClose, onPlay, onRemove }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-[80] flex justify-end animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm h-full glass border-l border-white/10 flex flex-col shadow-2xl animate-slide-left">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'Rajdhani, sans-serif' }}>LIKED MOVIES</h2>
            <p className="text-[#8197a4] text-xs">{liked.length} {liked.length === 1 ? 'item' : 'items'}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          {liked.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
              <Heart size={48} className="text-white/20" />
              <p className="text-white font-semibold">No liked movies yet</p>
              <p className="text-[#8197a4] text-sm">Click the ♥ button on any movie or TV show card to like it</p>
            </div>
          ) : liked.map(movie => (
            <div key={movie.id} className="flex gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
              <img src={getPosterUrl(movie.poster_path, 'w300')} alt={movie.title}
                className="w-14 h-20 object-cover rounded-lg shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold line-clamp-2 leading-tight">{movie.title}</p>
                <p className="text-[#8197a4] text-xs mt-0.5">{movie.release_date?.split('-')[0]}</p>
                <p className="text-[#f5c518] text-xs mt-0.5">★ {movie.vote_average.toFixed(1)}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => onPlay(movie)}
                    className="flex items-center gap-1 bg-[#00a8e1] hover:bg-[#00d4ff] text-white text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors">
                    <Play size={11} fill="white" />Watch
                  </button>
                  <button onClick={() => onRemove(movie.id)}
                    className="flex items-center gap-1 bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-[#8197a4] text-xs px-2 py-1.5 rounded-lg cursor-pointer transition-colors">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LikedMoviesPanel;
