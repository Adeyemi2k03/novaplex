import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from 'react-use';
import { fetchMovies, fetchMoviesByCategory, fetchGenres, fetchTVShows, fetchTVByCategory } from '../services/tmdb';
import { updateSearchCount, getTrendingMovies } from '../services/appwrite';
import type { Movie, TrendingMovie, Genre, Category, TVShow, TVCategory } from '../types';

const getErrorMessage = (err: unknown): string => {
  if (!navigator.onLine) return 'No internet connection. Please check your network and try again.';
  if (err instanceof TypeError && err.message.includes('fetch')) return 'Network error. Please check your internet connection.';
  if (err instanceof Error) {
    if (err.message.includes('401')) return 'Invalid API key. Please check your TMDB API key in .env';
    if (err.message.includes('404')) return 'Content not found. Try a different search.';
    if (err.message.includes('429')) return 'Too many requests. Please wait a moment and try again.';
    if (err.message.includes('500')) return 'Server error. Please try again later.';
  }
  return 'Something went wrong. Please check your connection and try again.';
};

export function useMovies(searchTerm: string, category: Category) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useDebounce(() => setDebouncedSearch(searchTerm), 500, [searchTerm]);

  const load = useCallback(async (q: string, cat: Category, pg: number, append: boolean) => {
    setIsLoading(true);
    setError('');
    try {
      const data = q ? await fetchMovies(q, pg) : await fetchMoviesByCategory(cat, pg);
      setMovies(prev => append ? [...prev, ...data.results] : data.results);
      setTotalPages(data.total_pages);
      if (q && data.results.length > 0 && pg === 1) {
        await updateSearchCount(q, data.results[0]);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    load(debouncedSearch, category, 1, false);
  }, [debouncedSearch, category, load]);

  const loadMore = () => {
    if (page < totalPages) {
      const next = page + 1;
      setPage(next);
      load(debouncedSearch, category, next, true);
    }
  };

  return { movies, isLoading, error, loadMore, hasMore: page < totalPages };
}

export function useTVShows(searchTerm: string, category: TVCategory) {
  const [shows, setShows] = useState<TVShow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useDebounce(() => setDebouncedSearch(searchTerm), 500, [searchTerm]);

  const load = useCallback(async (q: string, cat: TVCategory, pg: number, append: boolean) => {
    setIsLoading(true);
    setError('');
    try {
      const data = q ? await fetchTVShows(q, pg) : await fetchTVByCategory(cat, pg);
      setShows(prev => append ? [...prev, ...data.results] : data.results);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    load(debouncedSearch, category, 1, false);
  }, [debouncedSearch, category, load]);

  const loadMore = () => {
    if (page < totalPages) {
      const next = page + 1;
      setPage(next);
      load(debouncedSearch, category, next, true);
    }
  };

  return { shows, isLoading, error, loadMore, hasMore: page < totalPages };
}

export function useTrending() {
  const [trending, setTrending] = useState<TrendingMovie[]>([]);
  useEffect(() => {
    getTrendingMovies().then(setTrending).catch(console.error);
  }, []);
  return trending;
}

export function useGenres() {
  const [genres, setGenres] = useState<Genre[]>([]);
  useEffect(() => {
    fetchGenres().then(setGenres).catch(console.error);
  }, []);
  return genres;
}
