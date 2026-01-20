import { create } from 'zustand';
import { supabase } from './supabase';
import {
  OverviewStats,
  WeeklyStats,
  MonthlyStats,
  AllTimeStats,
  BookAnalytics,
  UserBook,
  ReadingSession,
} from '../types/database';

interface StatisticsState {
  // Data
  overview: OverviewStats | null;
  weeklyData: WeeklyStats | null;
  monthlyData: MonthlyStats | null;
  allTimeData: AllTimeStats | null;
  bookAnalytics: BookAnalytics | null;

  // State
  isLoading: boolean;
  lastFetched: Date | null;
  error: string | null;

  // Actions
  fetchOverview: (userId: string) => Promise<void>;
  fetchWeekly: (userId: string) => Promise<void>;
  fetchMonthly: (userId: string) => Promise<void>;
  fetchAllTime: (userId: string) => Promise<void>;
  fetchBookAnalytics: (userId: string) => Promise<void>;
  refresh: (userId: string) => Promise<void>;
  clearCache: () => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useStatisticsStore = create<StatisticsState>((set, get) => ({
  // Initial state
  overview: null,
  weeklyData: null,
  monthlyData: null,
  allTimeData: null,
  bookAnalytics: null,
  isLoading: false,
  lastFetched: null,
  error: null,

  // Fetch overview statistics
  fetchOverview: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await (supabase.rpc as any)('get_user_stats', {
        p_user_id: userId,
      });

      if (error) throw error;

      set({ overview: data as OverviewStats });
    } catch (error) {
      console.error('Error fetching overview stats:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch weekly statistics
  fetchWeekly: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await (supabase.rpc as any)('get_weekly_stats', {
        p_user_id: userId,
      });

      if (error) throw error;

      set({ weeklyData: data as WeeklyStats });
    } catch (error) {
      console.error('Error fetching weekly stats:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch monthly statistics
  fetchMonthly: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await (supabase.rpc as any)('get_monthly_stats', {
        p_user_id: userId,
      });

      if (error) throw error;

      set({ monthlyData: data as MonthlyStats });
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch all-time statistics
  fetchAllTime: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await (supabase.rpc as any)('get_all_time_stats', {
        p_user_id: userId,
      });

      if (error) throw error;

      set({ allTimeData: data as AllTimeStats });
    } catch (error) {
      console.error('Error fetching all-time stats:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch book analytics (calculated client-side)
  fetchBookAnalytics: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });

      // Fetch completed books with timing data
      const { data: completedBooks, error: booksError } = await supabase
        .from('user_books')
        .select(`
          *,
          books!inner(title)
        `)
        .eq('user_id', userId)
        .eq('status', 'completed')
        .not('started_at', 'is', null)
        .not('completed_at', 'is', null);

      if (booksError) throw booksError;

      // Fetch reading sessions for timing calculations
      const { data: sessions, error: sessionsError } = await supabase
        .from('reading_sessions')
        .select('book_id, minutes_read')
        .eq('user_id', userId);

      if (sessionsError) throw sessionsError;

      // Calculate analytics
      const bookTimings = new Map<string, number>();
      sessions?.forEach((session: ReadingSession) => {
        const current = bookTimings.get(session.book_id) || 0;
        bookTimings.set(session.book_id, current + session.minutes_read);
      });

      const totalBooks = completedBooks?.length || 0;
      const totalMinutes = Array.from(bookTimings.values()).reduce((sum, min) => sum + min, 0);
      const avgTimePerBook = totalBooks > 0 ? Math.round(totalMinutes / totalBooks) : 0;

      // Completion rate (completed / total in library)
      const { count: totalInLibrary } = await supabase
        .from('user_books')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      const completionRate = totalInLibrary && totalInLibrary > 0
        ? Math.round((totalBooks / totalInLibrary) * 100)
        : 0;

      // Books by rating
      const booksByRating: Record<number, number> = {};
      completedBooks?.forEach((book: UserBook) => {
        if (book.user_rating) {
          booksByRating[book.user_rating] = (booksByRating[book.user_rating] || 0) + 1;
        }
      });

      // Books by emotion
      const booksByEmotion: Record<string, number> = {};
      completedBooks?.forEach((book: UserBook) => {
        if (book.emotion_rating) {
          booksByEmotion[book.emotion_rating] = (booksByEmotion[book.emotion_rating] || 0) + 1;
        }
      });

      // Find fastest and slowest books
      let fastest: { title: string; minutes: number } | null = null;
      let slowest: { title: string; minutes: number } | null = null;

      completedBooks?.forEach((book: any) => {
        const minutes = bookTimings.get(book.book_id) || 0;
        if (minutes > 0) {
          if (!fastest || minutes < fastest.minutes) {
            fastest = { title: book.books.title, minutes };
          }
          if (!slowest || minutes > slowest.minutes) {
            slowest = { title: book.books.title, minutes };
          }
        }
      });

      const analytics: BookAnalytics = {
        average_time_per_book: avgTimePerBook,
        completion_rate: completionRate,
        books_by_rating: booksByRating,
        books_by_emotion: booksByEmotion,
        fastest_book: fastest,
        slowest_book: slowest,
      };

      set({ bookAnalytics: analytics });
    } catch (error) {
      console.error('Error fetching book analytics:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Refresh all statistics
  refresh: async (userId: string) => {
    const { lastFetched } = get();
    const now = new Date();

    // Check cache validity
    if (lastFetched && now.getTime() - lastFetched.getTime() < CACHE_DURATION) {
      return; // Cache still valid
    }

    try {
      set({ isLoading: true, error: null });

      await Promise.all([
        get().fetchOverview(userId),
        get().fetchWeekly(userId),
        get().fetchMonthly(userId),
        get().fetchAllTime(userId),
        get().fetchBookAnalytics(userId),
      ]);

      set({ lastFetched: now });
    } catch (error) {
      console.error('Error refreshing statistics:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Clear cache and data
  clearCache: () => {
    set({
      overview: null,
      weeklyData: null,
      monthlyData: null,
      allTimeData: null,
      bookAnalytics: null,
      lastFetched: null,
      error: null,
    });
  },
}));
