import { useState, useCallback } from 'react';
import type { Movie, TVShow } from '../types';

const STORAGE_KEY = 'nova_liked';

const load = (): Movie[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
};

const save = (items: Movie[]) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* ignore */ }
};

export function useLiked() {
  const [liked, setLiked] = useState<Movie[]>(load);

  const likedIds = liked.map(m => m.id);

  const toggleLike = useCallback((item: Movie | TVShow, type: 'movie' | 'tv') => {
    setLiked(prev => {
      const exists = prev.find(m => m.id === item.id);
      let updated: Movie[];
      if (exists) {
        updated = prev.filter(m => m.id !== item.id);
      } else {
        // Normalise TV show to Movie shape for storage
        const asMovie: Movie = type === 'movie'
          ? item as Movie
          : {
              id: item.id,
              title: (item as TVShow).name,
              overview: item.overview,
              poster_path: item.poster_path,
              backdrop_path: item.backdrop_path,
              release_date: (item as TVShow).first_air_date,
              vote_average: item.vote_average,
              vote_count: item.vote_count,
              original_language: item.original_language,
              genre_ids: item.genre_ids,
              popularity: item.popularity,
              adult: false,
            };
        updated = [asMovie, ...prev];
      }
      save(updated);
      return updated;
    });
  }, []);

  const removeLike = useCallback((id: number) => {
    setLiked(prev => {
      const updated = prev.filter(m => m.id !== id);
      save(updated);
      return updated;
    });
  }, []);

  return { liked, likedIds, toggleLike, removeLike };
}
