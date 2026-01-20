export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          avatar_url: string | null;
          reader_level: 'debutant' | 'regulier' | 'expert';
          division: 'bronze' | 'argent' | 'or';
          streak_count: number;
          longest_streak: number;
          last_read_date: string | null;
          subscription_type: 'free' | 'child' | 'adult' | 'family';
          subscription_expires_at: string | null;
          language: string;
          daily_goal_minutes: number;
          motivation: string | null;
          reading_obstacles: string[] | null;
          reading_reason: string | null;
          preferred_genre: string | null;
          custom_preference: string | null;
          total_books_read: number;
          total_pages_read: number;
          total_minutes_read: number;
          onboarding_completed: boolean;
          notifications_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username?: string | null;
          avatar_url?: string | null;
          reader_level?: 'debutant' | 'regulier' | 'expert';
          division?: 'bronze' | 'argent' | 'or';
          streak_count?: number;
          longest_streak?: number;
          last_read_date?: string | null;
          subscription_type?: 'free' | 'child' | 'adult' | 'family';
          language?: string;
          daily_goal_minutes?: number;
          motivation?: string | null;
          reading_obstacles?: string[] | null;
          preferred_genre?: string | null;
          custom_preference?: string | null;
          onboarding_completed?: boolean;
          notifications_enabled?: boolean;
        };
        Update: {
          username?: string | null;
          avatar_url?: string | null;
          reader_level?: 'debutant' | 'regulier' | 'expert';
          division?: 'bronze' | 'argent' | 'or';
          language?: string;
          daily_goal_minutes?: number;
          motivation?: string | null;
          reading_obstacles?: string[] | null;
          reading_reason?: string | null;
          preferred_genre?: string | null;
          custom_preference?: string | null;
          onboarding_completed?: boolean;
          notifications_enabled?: boolean;
        };
      };
      books: {
        Row: {
          id: string;
          title: string;
          author: string | null;
          cover_url: string | null;
          total_pages: number;
          total_chapters: number;
          genre: string | null;
          language: string;
          description: string | null;
          source: 'gutenberg' | 'wikisource' | 'bnf' | 'feedbooks' | 'custom' | null;
          difficulty: 'easy' | 'medium' | 'hard';
          is_featured: boolean;
          read_count: number;
          average_rating: number;
          created_at: string;
        };
      };
      book_chapters: {
        Row: {
          id: string;
          book_id: string;
          chapter_number: number;
          title: string | null;
          content: string;
          word_count: number;
          page_count: number;
        };
      };
      user_books: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          status: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
          current_chapter: number;
          current_position: number;
          progress_percent: number;
          started_at: string | null;
          completed_at: string | null;
          last_read_at: string | null;
          emotion_rating: 'love' | 'happy' | 'neutral' | 'confused' | 'sad' | null;
          user_rating: number | null;
          is_favorite: boolean;
        };
        Insert: {
          user_id: string;
          book_id: string;
          status?: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
        };
        Update: {
          status?: 'not_started' | 'in_progress' | 'completed' | 'abandoned';
          current_chapter?: number;
          current_position?: number;
          progress_percent?: number;
          emotion_rating?: 'love' | 'happy' | 'neutral' | 'confused' | 'sad' | null;
          user_rating?: number | null;
          is_favorite?: boolean;
        };
      };
      reading_sessions: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          date: string;
          minutes_read: number;
          pages_read: number;
          chapters_completed: number;
        };
      };
      reading_duos: {
        Row: {
          id: string;
          creator_id: string;
          partner_id: string | null;
          book_id: string;
          status: 'pending' | 'active' | 'completed' | 'cancelled' | 'expired';
          creator_chapter: number;
          partner_chapter: number;
          creator_last_read: string | null;
          partner_last_read: string | null;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
      };
      duo_invitations: {
        Row: {
          id: string;
          duo_id: string;
          invite_code: string;
          expires_at: string;
          used_at: string | null;
          used_by: string | null;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          theme: 'light' | 'sepia' | 'dark';
          font_size: 'small' | 'medium' | 'large' | 'xlarge';
          font_family: 'serif' | 'sans-serif' | 'dyslexie';
          line_spacing: 'compact' | 'normal' | 'spacious';
          margins: 'narrow' | 'normal' | 'wide';
          auto_night_mode: boolean;
          page_orientation: 'portrait' | 'landscape' | 'auto';
        };
        Update: {
          theme?: 'light' | 'sepia' | 'dark';
          font_size?: 'small' | 'medium' | 'large' | 'xlarge';
          font_family?: 'serif' | 'sans-serif' | 'dyslexie';
          line_spacing?: 'compact' | 'normal' | 'spacious';
        };
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          book_id: string;
          chapter_number: number;
          position: number;
          note: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          book_id: string;
          chapter_number: number;
          position: number;
          note?: string | null;
        };
      };
      achievements: {
        Row: {
          id: string;
          code: string;
          name_fr: string;
          name_en: string;
          description_fr: string | null;
          description_en: string | null;
          icon_url: string | null;
          category: 'streak' | 'reading' | 'social' | 'special';
          requirement_value: number | null;
          points: number;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          earned_at: string;
        };
      };
      weekly_leaderboard: {
        Row: {
          id: string;
          user_id: string;
          week_start: string;
          points: number;
          pages_read: number;
          minutes_read: number;
          division: 'bronze' | 'argent' | 'or';
          rank: number | null;
        };
      };
    };
    Functions: {
      calculate_streak: {
        Args: { user_uuid: string };
        Returns: number;
      };
      log_reading_session: {
        Args: { p_user_id: string; p_book_id: string; p_minutes: number; p_pages?: number };
        Returns: Json;
      };
      create_reading_duo: {
        Args: { p_creator_id: string; p_book_id: string };
        Returns: Json;
      };
      join_reading_duo: {
        Args: { p_user_id: string; p_invite_code: string };
        Returns: Json;
      };
      can_advance_chapter: {
        Args: { p_duo_id: string; p_user_id: string };
        Returns: boolean;
      };
      update_duo_progress: {
        Args: { p_duo_id: string; p_user_id: string; p_chapter: number };
        Returns: Json;
      };
      get_user_stats: {
        Args: { p_user_id: string };
        Returns: Json;
      };
      get_weekly_stats: {
        Args: { p_user_id: string };
        Returns: Json;
      };
      get_monthly_stats: {
        Args: { p_user_id: string };
        Returns: Json;
      };
      get_all_time_stats: {
        Args: { p_user_id: string };
        Returns: Json;
      };
    };
  };
}

export type User = Database['public']['Tables']['users']['Row'];
export type Book = Database['public']['Tables']['books']['Row'];
export type BookChapter = Database['public']['Tables']['book_chapters']['Row'];
export type UserBook = Database['public']['Tables']['user_books']['Row'];
export type ReadingDuo = Database['public']['Tables']['reading_duos']['Row'];
export type UserPreferences = Database['public']['Tables']['user_preferences']['Row'];
export type Achievement = Database['public']['Tables']['achievements']['Row'];
export type ReadingSession = Database['public']['Tables']['reading_sessions']['Row'];

// Statistics Types
export interface OverviewStats {
  streak_count: number;
  total_books_read: number;
  total_pages_read: number;
  total_minutes_read: number;
  reader_level: string;
  division: string;
  books_in_progress: number;
  active_duos: number;
  achievements_count: number;
}

export interface WeeklyStats {
  days: Array<{
    date: string;
    minutes: number;
    pages: number;
    completed: boolean;
  }>;
  total_minutes: number;
  total_pages: number;
  days_active: number;
}

export interface MonthlyStats {
  weeks: Array<{
    week: number;
    minutes: number;
    pages: number;
  }>;
  total_minutes: number;
  total_pages: number;
  days_active: number;
}

export interface AllTimeStats {
  sessions: Array<{
    date: string;
    minutes: number;
    pages: number;
  }>;
  first_session_date: string;
  average_daily_minutes: number;
  longest_session_minutes: number;
  total_sessions: number;
}

export interface BookAnalytics {
  average_time_per_book: number;
  completion_rate: number;
  books_by_rating: Record<number, number>;
  books_by_emotion: Record<string, number>;
  fastest_book: { title: string; minutes: number } | null;
  slowest_book: { title: string; minutes: number } | null;
}
