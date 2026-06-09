import type { Movie, MovieDetails, MovieVideo, Genre, TVShow, TVVideo } from '../types';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS: RequestInit = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

export const IMAGE_BASE = 'https://image.tmdb.org/t/p';
export const getPosterUrl = (path: string | null, size: 'w300' | 'w500' | 'w780' | 'original' = 'w500') =>
  path ? `${IMAGE_BASE}/${size}${path}` : '/no-movie.png';
export const getBackdropUrl = (path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') =>
  path ? `${IMAGE_BASE}/${size}${path}` : null;

// ── MOVIES ──────────────────────────────────────────────
export async function fetchMovies(query: string = '', page: number = 1): Promise<{ results: Movie[]; total_pages: number }> {
  const endpoint = query
    ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
    : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;
  const res = await fetch(endpoint, API_OPTIONS);
  if (!res.ok) throw new Error('Failed to fetch movies');
  return res.json();
}

export async function fetchMoviesByCategory(category: string, page: number = 1): Promise<{ results: Movie[]; total_pages: number }> {
  const res = await fetch(`${API_BASE_URL}/movie/${category}?page=${page}`, API_OPTIONS);
  if (!res.ok) throw new Error('Failed to fetch movies');
  return res.json();
}

export async function fetchMovieDetails(movieId: number): Promise<MovieDetails> {
  const res = await fetch(`${API_BASE_URL}/movie/${movieId}`, API_OPTIONS);
  if (!res.ok) throw new Error('Failed to fetch movie details');
  return res.json();
}

export async function fetchMovieVideos(movieId: number): Promise<MovieVideo[]> {
  const res = await fetch(`${API_BASE_URL}/movie/${movieId}/videos`, API_OPTIONS);
  if (!res.ok) throw new Error('Failed to fetch videos');
  const data = await res.json();
  return data.results as MovieVideo[];
}

export async function fetchSimilarMovies(movieId: number): Promise<Movie[]> {
  const res = await fetch(`${API_BASE_URL}/movie/${movieId}/similar`, API_OPTIONS);
  if (!res.ok) throw new Error('Failed to fetch similar movies');
  const data = await res.json();
  return data.results as Movie[];
}

export async function fetchGenres(): Promise<Genre[]> {
  const res = await fetch(`${API_BASE_URL}/genre/movie/list`, API_OPTIONS);
  if (!res.ok) throw new Error('Failed to fetch genres');
  const data = await res.json();
  return data.genres as Genre[];
}

export async function fetchTrendingMovies(): Promise<Movie[]> {
  const res = await fetch(`${API_BASE_URL}/trending/movie/week`, API_OPTIONS);
  if (!res.ok) throw new Error('Failed to fetch trending');
  const data = await res.json();
  return data.results as Movie[];
}

// ── TV SHOWS ─────────────────────────────────────────────
export async function fetchTVShows(query: string = '', page: number = 1): Promise<{ results: TVShow[]; total_pages: number }> {
  const endpoint = query
    ? `${API_BASE_URL}/search/tv?query=${encodeURIComponent(query)}&page=${page}`
    : `${API_BASE_URL}/discover/tv?sort_by=popularity.desc&page=${page}`;
  const res = await fetch(endpoint, API_OPTIONS);
  if (!res.ok) throw new Error('Failed to fetch TV shows');
  return res.json();
}

export async function fetchTVByCategory(category: string, page: number = 1): Promise<{ results: TVShow[]; total_pages: number }> {
  const res = await fetch(`${API_BASE_URL}/tv/${category}?page=${page}`, API_OPTIONS);
  if (!res.ok) throw new Error('Failed to fetch TV shows');
  return res.json();
}

export async function fetchTVDetails(tvId: number): Promise<TVShow> {
  const res = await fetch(`${API_BASE_URL}/tv/${tvId}`, API_OPTIONS);
  if (!res.ok) throw new Error('Failed to fetch TV details');
  return res.json();
}

export async function fetchTVVideos(tvId: number): Promise<TVVideo[]> {
  const res = await fetch(`${API_BASE_URL}/tv/${tvId}/videos`, API_OPTIONS);
  if (!res.ok) throw new Error('Failed to fetch TV videos');
  const data = await res.json();
  return data.results as TVVideo[];
}

export async function fetchSimilarTV(tvId: number): Promise<TVShow[]> {
  const res = await fetch(`${API_BASE_URL}/tv/${tvId}/similar`, API_OPTIONS);
  if (!res.ok) throw new Error('Failed to fetch similar TV');
  const data = await res.json();
  return data.results as TVShow[];
}

export async function fetchTrendingTV(): Promise<TVShow[]> {
  const res = await fetch(`${API_BASE_URL}/trending/tv/week`, API_OPTIONS);
  if (!res.ok) throw new Error('Failed to fetch trending TV');
  const data = await res.json();
  return data.results as TVShow[];
}
