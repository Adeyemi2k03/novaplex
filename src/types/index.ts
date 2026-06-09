export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status?: string;
  tagline?: string;
  genres?: { id: number; name: string }[];
  networks?: { id: number; name: string; logo_path: string | null }[];
  episode_run_time?: number[];
}

export interface TVVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface MovieVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number | null;
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  production_companies: { id: number; name: string; logo_path: string | null }[];
}

export interface TrendingMovie {
  $id: string;
  searchTerm: string;
  count: number;
  movie_id: number;
  poster_url: string;
  title?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface WatchlistItem {
  $id?: string;
  userId: string;
  mediaId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
}

export type Category = 'popular' | 'top_rated' | 'now_playing' | 'upcoming';
export type TVCategory = 'popular' | 'top_rated' | 'on_the_air' | 'airing_today';
export type MediaTab = 'movies' | 'tv';

export type SubscriptionTier = 'free' | 'basic' | 'premium';

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  features: string[];
  color: string;
}
