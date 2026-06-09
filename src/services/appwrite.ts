import { Client, Databases, ID, Query } from 'appwrite';
import type { TrendingMovie, WatchlistItem } from '../types';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const WATCHLIST_COLLECTION_ID = import.meta.env.VITE_APPWRITE_WATCHLIST_COLLECTION_ID;

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject(PROJECT_ID);

const database = new Databases(client);

// ── SEARCH TRENDING ──────────────────────────────────────
export const updateSearchCount = async (
  searchTerm: string,
  movie: { id: number; poster_path: string | null; title: string }
): Promise<void> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('movie_id', movie.id),
    ]);
    if (result.documents.length > 0) {
      const doc = result.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
        searchTerm,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-movie.png',
        title: movie.title,
      });
    }
  } catch (error) {
    console.error('Appwrite updateSearchCount error:', error);
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(10),
      Query.orderDesc('count'),
    ]);
    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error('Appwrite getTrendingMovies error:', error);
    return [];
  }
};

// ── WATCHLIST ─────────────────────────────────────────────
export const getWatchlist = async (userId: string): Promise<WatchlistItem[]> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, WATCHLIST_COLLECTION_ID, [
      Query.equal('userId', userId),
      Query.orderDesc('$createdAt'),
    ]);
    return result.documents as unknown as WatchlistItem[];
  } catch (error) {
    console.error('getWatchlist error:', error);
    return [];
  }
};

export const addToWatchlist = async (item: WatchlistItem): Promise<WatchlistItem | null> => {
  try {
    const doc = await database.createDocument(DATABASE_ID, WATCHLIST_COLLECTION_ID, ID.unique(), item);
    return doc as unknown as WatchlistItem;
  } catch (error) {
    console.error('addToWatchlist error:', error);
    return null;
  }
};

export const removeFromWatchlist = async (docId: string): Promise<void> => {
  await database.deleteDocument(DATABASE_ID, WATCHLIST_COLLECTION_ID, docId);
};

export const isInWatchlist = async (userId: string, mediaId: number): Promise<string | null> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, WATCHLIST_COLLECTION_ID, [
      Query.equal('userId', userId),
      Query.equal('mediaId', mediaId),
    ]);
    return result.documents.length > 0 ? result.documents[0].$id : null;
  } catch {
    return null;
  }
};
