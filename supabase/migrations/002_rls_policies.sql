-- ============================================
-- TWO READ - Row Level Security Policies
-- Version: 1.1 (Fixed INSERT policies)
-- Date: January 2026
-- ============================================

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_duos ENABLE ROW LEVEL SECURITY;
ALTER TABLE duo_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Users can view all profiles (for leaderboard/community)
CREATE POLICY "Users can view profiles"
  ON users FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow insert on signup
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- BOOKS TABLE POLICIES
-- Books are public/read-only for all authenticated users
-- ============================================

CREATE POLICY "Books are viewable by everyone"
  ON books FOR SELECT
  USING (true);

-- Service role policies for books
CREATE POLICY "Service role can insert books"
  ON books FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update books"
  ON books FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete books"
  ON books FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================
-- BOOK_CHAPTERS TABLE POLICIES
-- ============================================

CREATE POLICY "Chapters are viewable by everyone"
  ON book_chapters FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert chapters"
  ON book_chapters FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update chapters"
  ON book_chapters FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete chapters"
  ON book_chapters FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================
-- USER_BOOKS TABLE POLICIES
-- ============================================

-- Users can view their own library
CREATE POLICY "Users can view own library"
  ON user_books FOR SELECT
  USING (auth.uid() = user_id);

-- Users can add books to their library
CREATE POLICY "Users can add to library"
  ON user_books FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their reading progress
CREATE POLICY "Users can update own library"
  ON user_books FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can remove books from their library
CREATE POLICY "Users can delete from library"
  ON user_books FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- BOOKMARKS TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- HIGHLIGHTS TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view own highlights"
  ON highlights FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view shared highlights from duo partners
CREATE POLICY "Users can view partner highlights"
  ON highlights FOR SELECT
  USING (
    is_shared = true
    AND EXISTS (
      SELECT 1 FROM reading_duos d
      WHERE d.book_id = highlights.book_id
      AND d.status = 'active'
      AND (
        (d.creator_id = auth.uid() AND d.partner_id = highlights.user_id)
        OR (d.partner_id = auth.uid() AND d.creator_id = highlights.user_id)
      )
    )
  );

CREATE POLICY "Users can create highlights"
  ON highlights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update highlights"
  ON highlights FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete highlights"
  ON highlights FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- READING_SESSIONS TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view own sessions"
  ON reading_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create sessions"
  ON reading_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON reading_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- READING_DUOS TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view own duos"
  ON reading_duos FOR SELECT
  USING (auth.uid() = creator_id OR auth.uid() = partner_id);

CREATE POLICY "Users can create duos"
  ON reading_duos FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own duos"
  ON reading_duos FOR UPDATE
  USING (auth.uid() = creator_id OR auth.uid() = partner_id)
  WITH CHECK (auth.uid() = creator_id OR auth.uid() = partner_id);

CREATE POLICY "Creators can delete duos"
  ON reading_duos FOR DELETE
  USING (auth.uid() = creator_id);

-- ============================================
-- DUO_INVITATIONS TABLE POLICIES
-- ============================================

CREATE POLICY "Invitations are viewable"
  ON duo_invitations FOR SELECT
  USING (true);

CREATE POLICY "Creators can create invitations"
  ON duo_invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM reading_duos d
      WHERE d.id = duo_id
      AND d.creator_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can update invitations"
  ON duo_invitations FOR UPDATE
  USING (true);

-- ============================================
-- USER_PREFERENCES TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- WEEKLY_LEADERBOARD TABLE POLICIES
-- ============================================

CREATE POLICY "Leaderboard is viewable by all"
  ON weekly_leaderboard FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert leaderboard"
  ON weekly_leaderboard FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update leaderboard"
  ON weekly_leaderboard FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete leaderboard"
  ON weekly_leaderboard FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================
-- ACHIEVEMENTS TABLE POLICIES
-- ============================================

CREATE POLICY "Achievements are viewable"
  ON achievements FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert achievements"
  ON achievements FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can update achievements"
  ON achievements FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can delete achievements"
  ON achievements FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================
-- USER_ACHIEVEMENTS TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view all achievements"
  ON user_achievements FOR SELECT
  USING (true);

CREATE POLICY "Service role can grant achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- NOTIFICATIONS TABLE POLICIES
-- ============================================

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
