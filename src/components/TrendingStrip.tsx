import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import type { TrendingMovie } from '../types';

interface TrendingStripProps {
  movies: TrendingMovie[];
  onSelect: (movieId: number) => void;
}

const TrendingStrip: React.FC<TrendingStripProps> = ({ movies, onSelect }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  if (movies.length === 0) return null;

  return (
    <section className="py-8">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-[#00a8e1]" />
            <h2 className="text-white text-xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.5px' }}>
              MOST SEARCHED
            </h2>
            <span className="text-xs text-[#8197a4] bg-white/5 px-2 py-0.5 rounded-full ml-1">Powered by Appwrite</span>
          </div>
          <div className="flex gap-1">
            <button onClick={() => scroll('left')} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scroll('right')} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar pb-2"
        >
          {movies.map((movie, i) => (
            <button
              key={movie.$id}
              onClick={() => onSelect(movie.movie_id)}
              className="shrink-0 flex items-center gap-1 group cursor-pointer"
            >
              <span className="fancy-number opacity-60 group-hover:opacity-100 transition-opacity">{i + 1}</span>
              <div className="relative w-[110px] h-[155px] rounded-xl overflow-hidden bg-[#1a242f] -ml-4 shadow-xl group-hover:shadow-[#00a8e1]/20 transition-all duration-300 group-hover:-translate-y-1">
                <img
                  src={movie.poster_url}
                  alt={movie.searchTerm}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                  <span className="text-white text-xs font-semibold line-clamp-2">{movie.searchTerm}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingStrip;
