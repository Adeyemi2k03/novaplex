import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser, signIn, signUp, signOut } from '../services/auth';
import { getWatchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } from '../services/appwrite';
import type { WatchlistItem, Movie, TVShow, SubscriptionTier } from '../types';

export interface User {
  $id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string;
  clearError: () => void;
  watchlist: WatchlistItem[];
  watchlistIds: number[];
  toggleWatchlist: (item: Movie | TVShow, type: 'movie' | 'tv') => Promise<void>;
  watchlistLoading: boolean;
  subscription: SubscriptionTier;
  setSubscription: (tier: SubscriptionTier) => void;
  watchlistLimitReached: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const WATCHLIST_LIMITS: Record<SubscriptionTier, number> = {
  free: 10,
  basic: Infinity,
  premium: Infinity,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionTier>(() => {
    const saved = localStorage.getItem('nova_subscription');
    return (saved as SubscriptionTier) ?? 'free';
  });

  const watchlistIds = watchlist.map(w => w.mediaId);
  const watchlistLimitReached = watchlist.length >= WATCHLIST_LIMITS[subscription];

  const loadWatchlist = useCallback(async (userId: string) => {
    setWatchlistLoading(true);
    const items = await getWatchlist(userId);
    setWatchlist(items);
    setWatchlistLoading(false);
  }, []);

  useEffect(() => {
    getCurrentUser().then(u => {
      const typedUser = u as User | null;
      setUser(typedUser);
      if (typedUser) loadWatchlist(typedUser.$id);
      setIsLoading(false);
    });
  }, [loadWatchlist]);

  const login = useCallback(async (email: string, password: string) => {
    setError('');
    try {
      await signIn(email, password);
      const u = await getCurrentUser() as User | null;
      setUser(u);
      if (u) await loadWatchlist(u.$id);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Login failed. Check your credentials.';
      setError(msg);
      throw e;
    }
  }, [loadWatchlist]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setError('');
    try {
      await signUp(name, email, password);
      const u = await getCurrentUser() as User | null;
      setUser(u);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Registration failed. Try again.';
      setError(msg);
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
    setWatchlist([]);
    setSubscription('free');
    localStorage.removeItem('nova_subscription');
  }, []);

  const toggleWatchlist = useCallback(async (item: Movie | TVShow, type: 'movie' | 'tv') => {
    if (!user) return;
    const mediaId = item.id;
    const existing = watchlist.find(w => w.mediaId === mediaId);

    if (existing?.$id) {
      try {
        await removeFromWatchlist(existing.$id);
        setWatchlist(prev => prev.filter(w => w.mediaId !== mediaId));
      } catch (error) {
        console.error('Failed to remove from watchlist:', error);
        // Re-sync from Appwrite if delete failed
        const items = await getWatchlist(user.$id);
        setWatchlist(items);
      }
    } else {
      // Prevent duplicate — check Appwrite directly before adding
      if (watchlistLimitReached) return;
      const existingDocId = await isInWatchlist(user.$id, mediaId);
      if (existingDocId) {
        // Already exists in DB but not in local state — sync it
        const items = await getWatchlist(user.$id);
        setWatchlist(items);
        return;
      }

      const isMovie = type === 'movie';
      const newItem: WatchlistItem = {
        userId: user.$id,
        mediaId,
        mediaType: type,
        title: isMovie ? (item as Movie).title : (item as TVShow).name,
        poster_path: item.poster_path,
        vote_average: item.vote_average,
        release_date: isMovie ? (item as Movie).release_date : (item as TVShow).first_air_date,
        overview: item.overview,
      };
      const saved = await addToWatchlist(newItem);
      if (saved) setWatchlist(prev => [saved, ...prev]);
    }
  }, [user, watchlist, watchlistLimitReached]);

  const clearError = useCallback(() => setError(''), []);

  return (
    <AuthContext.Provider value={{
      user, isLoading, login, register, logout, error, clearError,
      watchlist, watchlistIds, toggleWatchlist, watchlistLoading,
      subscription,
      setSubscription: (tier: SubscriptionTier) => {
        localStorage.setItem('nova_subscription', tier);
        setSubscription(tier);
      },
      watchlistLimitReached,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
