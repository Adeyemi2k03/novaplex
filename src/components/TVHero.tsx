import React, { useState, useEffect } from 'react';
import { Play, Info, Star, Clock, Tv } from 'lucide-react';
import { fetchTrendingTV, getBackdropUrl } from '../services/tmdb';
import type { TVShow } from '../types';

interface TVHeroProps {
  onPlay: (show: TVShow) => void;
  onInfo: (show: TVShow) => void;
}

const TVHero: React.FC<TVHeroProps> = ({ onPlay, onInfo }) => {
  const [featured, setFeatured] = useState<TVShow | null>(null);

  useEffect(() => {
    fetchTrendingTV()
      .then(shows => setFeatured(shows[0]))
      .catch(console.error);
  }, []);

  if (!featured) {
    return (
      <div className="h-64 bg-gradient-to-b from-[#0a1018] to-[#0f171e] flex items-end pb-8 pt-16">
        <div className="max-w-[1400px] mx-auto px-6 w-full space-y-3">
          <div className="h-8 w-48 bg-white/8 rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-white/5 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  const backdrop = getBackdropUrl(featured.backdrop_path, 'w1280');

  return (
  <div className="relative h-64 sm:h-80 overflow-hidden mt-16 sm:mt-16">
      {backdrop && (
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backdrop})` }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f171e] via-[#0f171e]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f171e] via-transparent to-black/50" />

      <div className="relative h-full flex items-end pb-6 sm:pb-8">
        <div className="max-w-[1400px] mx-auto px-6 w-full">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1.5 bg-[#00a8e1]/20 border border-[#00a8e1]/30 px-2 py-0.5 rounded-md">
              <Tv size={11} className="text-[#00a8e1]" />
              <span className="text-[#00a8e1] text-xs font-bold">TV SHOWS</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={11} className="text-[#f5c518]" fill="#f5c518" />
              <span className="text-white text-xs font-semibold">{featured.vote_average.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-[#8197a4] text-xs">
              <Clock size={11} />
              <span>{featured.first_air_date?.split('-')[0]}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white mb-2 leading-tight"
            style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            {featured.name}
          </h1>
          <p className="text-[#8197a4] text-xs sm:text-sm mb-4 line-clamp-2 max-w-lg">
            {featured.overview}
          </p>

          <div className="flex gap-2">
            <button onClick={() => onPlay(featured)}
              className="nova-btn-primary text-xs sm:text-sm px-4 py-2 rounded-xl whitespace-nowrap">
              <Play size={13} fill="white" />Watch Now
            </button>
            <button onClick={() => onInfo(featured)}
              className="nova-btn-secondary text-xs sm:text-sm px-4 py-2 rounded-xl whitespace-nowrap">
              <Info size={13} />More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVHero;