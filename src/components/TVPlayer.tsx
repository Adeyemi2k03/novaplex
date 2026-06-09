import React, { useState, useEffect } from 'react';
import { X, Star, Tv, Globe, Play, ChevronLeft, Calendar, Film } from 'lucide-react';
import { fetchTVVideos, fetchTVDetails, fetchSimilarTV, getPosterUrl } from '../services/tmdb';
import type { TVShow, TVVideo } from '../types';

interface TVPlayerProps {
  show: TVShow;
  onClose: () => void;
  onSelectShow: (show: TVShow) => void;
}

const TVPlayer: React.FC<TVPlayerProps> = ({ show, onClose, onSelectShow }) => {
  const [details, setDetails] = useState<TVShow | null>(null);
  const [videos, setVideos] = useState<TVVideo[]>([]);
  const [similar, setSimilar] = useState<TVShow[]>([]);
  const [activeVideo, setActiveVideo] = useState<TVVideo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setActiveVideo(null);
    Promise.all([
      fetchTVDetails(show.id),
      fetchTVVideos(show.id),
      fetchSimilarTV(show.id),
    ]).then(([det, vids, sim]) => {
      setDetails(det);
      const sorted = vids.filter(v => v.site === 'YouTube')
        .sort((a, b) => {
          const order: Record<string, number> = { Trailer: 0, Teaser: 1, Clip: 2, 'Behind the Scenes': 3 };
          return (order[a.type] ?? 4) - (order[b.type] ?? 4);
        });
      setVideos(sorted);
      if (sorted.length > 0) setActiveVideo(sorted[0]);
      setSimilar(sim.slice(0, 8));
    }).catch(console.error).finally(() => setLoading(false));
  }, [show.id]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col overflow-y-auto animate-fade-in">
      <div className="sticky top-0 z-10 glass border-b border-white/10 px-4 py-3 flex items-center gap-3">
        <button onClick={onClose} className="flex items-center gap-1.5 text-[#8197a4] hover:text-white transition-colors cursor-pointer">
          <ChevronLeft size={20} /><span className="text-sm">Back</span>
        </button>
        <Tv size={16} className="text-[#00a8e1]" />
        <span className="text-white font-semibold truncate" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 18 }}>{show.name}</span>
        <button onClick={onClose} className="ml-auto text-[#8197a4] hover:text-white cursor-pointer"><X size={20} /></button>
      </div>

      <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 pb-12">
        <div className="mt-4 rounded-2xl overflow-hidden bg-black shadow-2xl">
          {loading ? (
            <div className="aspect-video flex items-center justify-center bg-[#0a1018]">
              <div className="w-12 h-12 border-2 border-[#00a8e1] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activeVideo ? (
            <div className="aspect-video">
              <iframe key={activeVideo.key} className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo.key}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.name} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen />
            </div>
          ) : (
            <div className="aspect-video flex items-center justify-center bg-[#0a1018] relative"
              style={{ backgroundImage: show.backdrop_path ? `url(https://image.tmdb.org/t/p/w1280${show.backdrop_path})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="absolute inset-0 bg-black/70" />
              <div className="relative text-center p-8">
                <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4">
                  <Play size={24} className="text-white ml-1" />
                </div>
                <p className="text-white font-semibold text-lg mb-2">No trailer available</p>
                <p className="text-[#8197a4] text-sm">Check back later for trailers and clips.</p>
              </div>
            </div>
          )}
        </div>

        {videos.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {videos.map(v => (
              <button key={v.id} onClick={() => setActiveVideo(v)}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeVideo?.id === v.id ? 'bg-[#00a8e1] text-white' : 'bg-white/8 text-[#8197a4] hover:bg-white/12 hover:text-white border border-white/10'
                }`}>
                {v.type}: {v.name.length > 30 ? v.name.slice(0, 30) + '…' : v.name}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex items-center gap-1.5 bg-[#f5c518]/10 px-3 py-1 rounded-full">
                <Star size={14} className="text-[#f5c518]" fill="#f5c518" />
                <span className="text-[#f5c518] font-bold text-sm">{show.vote_average.toFixed(1)}</span>
              </div>
              {show.first_air_date && (
                <div className="flex items-center gap-1.5 text-[#8197a4] text-sm">
                  <Calendar size={14} />{show.first_air_date.split('-')[0]}
                </div>
              )}
              {details?.number_of_seasons && (
                <div className="flex items-center gap-1.5 text-[#8197a4] text-sm">
                  <Film size={14} />{details.number_of_seasons} Season{details.number_of_seasons > 1 ? 's' : ''}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-[#8197a4] text-sm uppercase">
                <Globe size={14} />{show.original_language}
              </div>
              {details?.status && (
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${details.status === 'Returning Series' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-[#8197a4]'}`}>
                  {details.status}
                </span>
              )}
            </div>

            {details?.tagline && <p className="text-[#00a8e1] italic text-sm mb-3">"{details.tagline}"</p>}
            <p className="text-[#8197a4] leading-relaxed text-sm mb-4">{show.overview}</p>

            {details?.genres && details.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {details.genres.map(g => (
                  <span key={g.id} className="px-3 py-1 bg-white/8 border border-white/10 text-[#8197a4] text-xs rounded-full">{g.name}</span>
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:block">
            <img src={getPosterUrl(show.poster_path, 'w300')} alt={show.name} className="w-full rounded-xl shadow-xl" />
          </div>
        </div>

        {similar.length > 0 && (
          <div className="mt-10">
            <h3 className="text-white font-bold text-xl mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>MORE LIKE THIS</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {similar.map(s => (
                <button key={s.id} onClick={() => onSelectShow(s)} className="group cursor-pointer text-left">
                  <div className="rounded-lg overflow-hidden aspect-[2/3] bg-[#1a242f] relative">
                    <img src={getPosterUrl(s.poster_path, 'w300')} alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play size={20} className="text-white" fill="white" />
                    </div>
                  </div>
                  <p className="text-[#8197a4] text-xs mt-1.5 line-clamp-1 group-hover:text-white transition-colors">{s.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TVPlayer;
