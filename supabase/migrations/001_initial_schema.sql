-- ============================================
-- TWO READ - Database Schema
-- Version: 1.0
-- Date: January 2026
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- ============================================
-- USERS TABLE
-- Core user profile and settings
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT,
  avatar_url TEXT,
  reader_level TEXT DEFAULT 'debutant' CHECK (reader_level IN ('debutant', 'regulier', 'expert')),
  division TEXT DEFAULT 'bronze' CHECK (division IN ('bronze', 'argent', 'or')),
  streak_count INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_read_date DATE,
  subscription_type TEXT DEFAULT 'free' CHECK (subscription_type IN ('free', 'child', 'adult', 'family')),
  subscription_expires_at TIMESTAMP,
  language TEXT DEFAULT 'fr',
  daily_goal_minutes INT DEFAULT 10,
  motivation TEXT,
  reading_obstacles TEXT[],
  reading_reason TEXT,
  total_books_read INT DEFAULT 0,
  total_pages_read INT DEFAULT 0,
  total_minutes_read INT DEFAULT 0,
  onboarding_completed BOOLEAN DEFAULT false,
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for username search
CREATE INDEX idx_users_username ON users USING gin(username gin_trgm_ops);

-- ============================================
-- BOOKS TABLE
-- Public domain book catalog
-- ============================================
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  author TEXT,
  cover_url TEXT,
  total_pages INT DEFAULT 0,
  total_chapters INT DEFAULT 0,
  genre TEXT,
  language TEXT DEFAULT 'fr',
  description TEXT,
  source TEXT CHECK (source IN ('gutenberg', 'wikisource', 'bnf', 'feedbooks', 'custom')),
  source_url TEXT,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_featured BOOLEAN DEFAULT false,
  read_count INT DEFAULT 0,
  average_rating DECIMAL(2,1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for book search
CREATE INDEX idx_books_title ON books USING gin(title gin_trgm_ops);
CREATE INDEX idx_books_author ON books USING gin(author gin_trgm_ops);
CREATE INDEX idx_books_genre ON books(genre);
CREATE INDEX idx_books_language ON books(language);
CREATE INDEX idx_books_featured ON books(is_featured) WHERE is_featured = true;

-- ============================================
-- BOOK_CHAPTERS TABLE
-- Book content divided into chapters
-- ============================================
CREATE TABLE book_chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  word_count INT DEFAULT 0,
  page_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(book_id, chapter_number)
);

-- Index for chapter lookup
CREATE INDEX idx_book_chapters_book ON book_chapters(book_id, chapter_number);

-- ============================================
-- USER_BOOKS TABLE
-- User's personal library and reading progress
-- ============================================
CREATE TABLE user_books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'abandoned')),
  current_chapter INT DEFAULT 1,
  current_position INT DEFAULT 0,
  progress_percent DECIMAL(5,2) DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_read_at TIMESTAMP WITH TIME ZONE,
  emotion_rating TEXT CHECK (emotion_rating IN ('love', 'happy', 'neutral', 'confused', 'sad')),
  user_rating INT CHECK (user_rating >= 1 AND user_rating <= 5),
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Indexes for user library
CREATE INDEX idx_user_books_user ON user_books(user_id);
CREATE INDEX idx_user_books_status ON user_books(user_id, status);
CREATE INDEX idx_user_books_in_progress ON user_books(user_id) WHERE status = 'in_progress';

-- ============================================
-- BOOKMARKS TABLE
-- User's saved reading positions
-- ============================================
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  position INT NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for bookmark retrieval
CREATE INDEX idx_bookmarks_user_book ON bookmarks(user_id, book_id);

-- ============================================
-- HIGHLIGHTS TABLE
-- User's text highlights and annotations
-- ============================================
CREATE TABLE highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  start_position INT NOT NULL,
  end_position INT NOT NULL,
  text_content TEXT NOT NULL,
  color TEXT DEFAULT 'yellow' CHECK (color IN ('yellow', 'green', 'blue', 'pink', 'orange')),
  note TEXT,
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for highlights retrieval
CREATE INDEX idx_highlights_user_book ON highlights(user_id, book_id);
CREATE INDEX idx_highlights_chapter ON highlights(book_id, chapter_number);

-- ============================================
-- READING_SESSIONS TABLE
-- Track daily reading activity for streaks
-- ============================================
CREATE TABLE reading_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  minutes_read INT DEFAULT 0,
  pages_read INT DEFAULT 0,
  chapters_completed INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Index for streak calculation
CREATE INDEX idx_reading_sessions_user_date ON reading_sessions(user_id, date DESC);

-- ============================================
-- READING_DUOS TABLE
-- Paired reading challenges (KEY MVP FEATURE)
-- ============================================
CREATE TABLE reading_duos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled', 'expired')),
  creator_chapter INT DEFAULT 1,
  partner_chapter INT DEFAULT 1,
  creator_last_read TIMESTAMP WITH TIME ZONE,
  partner_last_read TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for duo queries
CREATE INDEX idx_reading_duos_creator ON reading_duos(creator_id);
CREATE INDEX idx_reading_duos_partner ON reading_duos(partner_id);
CREATE INDEX idx_reading_duos_active ON reading_duos(status) WHERE status = 'active';

-- ============================================
-- DUO_INVITATIONS TABLE
-- Invitation codes for joining duos
-- ============================================
CREATE TABLE duo_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  duo_id UUID REFERENCES reading_duos(id) ON DELETE CASCADE,
  invite_code TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  used_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for code lookup
CREATE INDEX idx_duo_invitations_code ON duo_invitations(invite_code) WHERE used_at IS NULL;

-- ============================================
-- USER_PREFERENCES TABLE
-- Reading display preferences
-- ============================================
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'sepia', 'dark')),
  font_size TEXT DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large', 'xlarge')),
  font_family TEXT DEFAULT 'sans-serif' CHECK (font_family IN ('serif', 'sans-serif', 'dyslexie')),
  line_spacing TEXT DEFAULT 'normal' CHECK (line_spacing IN ('compact', 'normal', 'spacious')),
  margins TEXT DEFAULT 'normal' CHECK (margins IN ('narrow', 'normal', 'wide')),
  auto_night_mode BOOLEAN DEFAULT false,
  page_orientation TEXT DEFAULT 'portrait' CHECK (page_orientation IN ('portrait', 'landscape', 'auto')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- WEEKLY_LEADERBOARD TABLE
-- Weekly ranking by division
-- ============================================
CREATE TABLE weekly_leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  points INT DEFAULT 0,
  pages_read INT DEFAULT 0,
  minutes_read INT DEFAULT 0,
  chapters_completed INT DEFAULT 0,
  books_completed INT DEFAULT 0,
  streak_bonus INT DEFAULT 0,
  division TEXT DEFAULT 'bronze' CHECK (division IN ('bronze', 'argent', 'or')),
  rank INT,
  promotion_status TEXT CHECK (promotion_status IN ('promoted', 'demoted', 'stayed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- Indexes for leaderboard
CREATE INDEX idx_weekly_leaderboard_week ON weekly_leaderboard(week_start, division, points DESC);
CREATE INDEX idx_weekly_leaderboard_user ON weekly_leaderboard(user_id, week_start DESC);

-- ============================================
-- ACHIEVEMENTS TABLE
-- Unlockable badges and rewards
-- ============================================
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_fr TEXT,
  description_en TEXT,
  icon_url TEXT,
  category TEXT CHECK (category IN ('streak', 'reading', 'social', 'special')),
  requirement_value INT,
  points INT DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER_ACHIEVEMENTS TABLE
-- Achievements earned by users
-- ============================================
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Index for user achievements
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);

-- ============================================
-- NOTIFICATIONS TABLE
-- In-app and push notification queue
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('streak_reminder', 'duo_progress', 'duo_waiting', 'duo_complete', 'achievement', 'weekly_summary', 'promotion')),
  title_fr TEXT NOT NULL,
  title_en TEXT,
  body_fr TEXT NOT NULL,
  body_en TEXT,
  data JSONB,
  read_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for notifications
CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read_at IS NULL;

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- Auto-update the updated_at column
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_books_updated_at BEFORE UPDATE ON user_books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_highlights_updated_at BEFORE UPDATE ON highlights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reading_sessions_updated_at BEFORE UPDATE ON reading_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reading_duos_updated_at BEFORE UPDATE ON reading_duos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_leaderboard_updated_at BEFORE UPDATE ON weekly_leaderboard
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HELPER VIEWS
-- ============================================

-- View: Active user books with book details
CREATE VIEW v_user_library AS
SELECT
  ub.id,
  ub.user_id,
  ub.book_id,
  b.title,
  b.author,
  b.cover_url,
  b.total_chapters,
  ub.status,
  ub.current_chapter,
  ub.progress_percent,
  ub.is_favorite,
  ub.last_read_at
FROM user_books ub
JOIN books b ON ub.book_id = b.id;

-- View: Active duos with user and book details
CREATE VIEW v_active_duos AS
SELECT
  d.id AS duo_id,
  d.book_id,
  b.title AS book_title,
  b.cover_url,
  b.total_chapters,
  d.status,
  d.creator_id,
  u1.username AS creator_name,
  u1.avatar_url AS creator_avatar,
  d.creator_chapter,
  d.partner_id,
  u2.username AS partner_name,
  u2.avatar_url AS partner_avatar,
  d.partner_chapter,
  d.created_at
FROM reading_duos d
JOIN books b ON d.book_id = b.id
JOIN users u1 ON d.creator_id = u1.id
LEFT JOIN users u2 ON d.partner_id = u2.id;

-- View: Weekly leaderboard with user details
CREATE VIEW v_leaderboard AS
SELECT
  wl.id,
  wl.week_start,
  wl.user_id,
  u.username,
  u.avatar_url,
  u.reader_level,
  wl.division,
  wl.points,
  wl.pages_read,
  wl.minutes_read,
  wl.rank
FROM weekly_leaderboard wl
JOIN users u ON wl.user_id = u.id;
