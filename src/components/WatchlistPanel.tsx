import React, { useEffect } from 'react';
import { X, Play, Trash2, BookmarkX, Film, Tv } from 'lucide-react';
import { getPosterUrl } from '../services/tmdb';
import { useAuth } from '../contexts/AuthContext';
import type { Movie, TVShow } from '../types';

interface WatchlistPanelProps {
  onClose: () => void;
  onPlayMovie: (movie: Movie) => void;
  onPlayTV: (show: TVShow) => void;
}

const WatchlistPanel: React.FC<WatchlistPanelProps> = ({ onClose, onPlayMovie, onPlayTV }) => {
  const { watchlist, toggleWatchlist, watchlistLoading } = useAuth();

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
            <h2 className="text-white font-bold text-lg" style={{ fontFamily: 'Rajdhani, sans-serif' }}>MY WATCHLIST</h2>
            <p className="text-[#8197a4] text-xs">{watchlist.length} {watchlist.length === 1 ? 'item' : 'items'}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          {watchlistLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="w-8 h-8 border-2 border-[#00a8e1] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : watchlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
              <BookmarkX size={48} className="text-white/20" />
              <p className="text-white font-semibold">Your watchlist is empty</p>
              <p className="text-[#8197a4] text-sm">Add movies and TV shows by clicking the + button</p>
            </div>
          ) : (
            watchlist.map(item => (
              <div key={item.$id ?? item.mediaId} className="flex gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                <img src={getPosterUrl(item.poster_path, 'w300')} alt={item.title}
                  className="w-14 h-20 object-cover rounded-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    {item.mediaType === 'tv'
                      ? <Tv size={11} className="text-[#00a8e1] shrink-0" />
                      : <Film size={11} className="text-[#8197a4] shrink-0" />}
                    <span className="text-[#8197a4] text-xs uppercase">{item.mediaType}</span>
                  </div>
                  <p className="text-white text-sm font-semibold line-clamp-2 leading-tight">{item.title}</p>
                  <p className="text-[#8197a4] text-xs mt-0.5">{item.release_date?.split('-')[0]}</p>
                  <p className="text-[#f5c518] text-xs mt-0.5">★ {item.vote_average.toFixed(1)}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        if (item.mediaType === 'tv') {
                          onPlayTV({ id: item.mediaId, name: item.title, overview: item.overview, poster_path: item.poster_path, backdrop_path: null, first_air_date: item.release_date, vote_average: item.vote_average, vote_count: 0, original_language: '', genre_ids: [], popularity: 0 });
                        } else {
                          onPlayMovie({ id: item.mediaId, title: item.title, overview: item.overview, poster_path: item.poster_path, backdrop_path: null, release_date: item.release_date, vote_average: item.vote_average, vote_count: 0, original_language: '', genre_ids: [], popularity: 0, adult: false });
                        }
                        onClose();
                      }}
                      className="flex items-center gap-1 bg-[#00a8e1] hover:bg-[#00d4ff] text-white text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                      <Play size={11} fill="white" />Watch
                    </button>
                    <button
                      onClick={() => {
                        const fakeItem = item.mediaType === 'movie'
                          ? { id: item.mediaId, title: item.title } as Movie
                          : { id: item.mediaId, name: item.title } as TVShow;
                        toggleWatchlist(fakeItem, item.mediaType);
                      }}
                      className="flex items-center gap-1 bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-[#8197a4] text-xs px-2 py-1.5 rounded-lg transition-colors cursor-pointer">
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchlistPanel;
