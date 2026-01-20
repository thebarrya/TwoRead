-- ============================================
-- TWO READ - Database Functions
-- Version: 1.0
-- Date: January 2026
-- ============================================

-- ============================================
-- USER MANAGEMENT FUNCTIONS
-- ============================================

-- Function: Create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );

  -- Create default preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Auto-create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- STREAK CALCULATION FUNCTIONS
-- ============================================

-- Function: Calculate current streak for a user
CREATE OR REPLACE FUNCTION calculate_streak(user_uuid UUID)
RETURNS INT AS $$
DECLARE
  streak INT := 0;
  check_date DATE := CURRENT_DATE;
  session_exists BOOLEAN;
BEGIN
  LOOP
    SELECT EXISTS (
      SELECT 1 FROM reading_sessions
      WHERE user_id = user_uuid
      AND date = check_date
      AND minutes_read > 0
    ) INTO session_exists;

    IF session_exists THEN
      streak := streak + 1;
      check_date := check_date - INTERVAL '1 day';
    ELSE
      -- Allow for one grace day if checking yesterday
      IF check_date = CURRENT_DATE THEN
        check_date := check_date - INTERVAL '1 day';
        SELECT EXISTS (
          SELECT 1 FROM reading_sessions
          WHERE user_id = user_uuid
          AND date = check_date
          AND minutes_read > 0
        ) INTO session_exists;

        IF session_exists THEN
          streak := streak + 1;
          check_date := check_date - INTERVAL '1 day';
          CONTINUE;
        END IF;
      END IF;
      EXIT;
    END IF;

    -- Safety limit
    IF streak > 365 THEN
      EXIT;
    END IF;
  END LOOP;

  -- Update user's streak count
  UPDATE users
  SET
    streak_count = streak,
    longest_streak = GREATEST(longest_streak, streak),
    last_read_date = CASE WHEN streak > 0 THEN CURRENT_DATE ELSE last_read_date END
  WHERE id = user_uuid;

  RETURN streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Log reading session and update streak
CREATE OR REPLACE FUNCTION log_reading_session(
  p_user_id UUID,
  p_book_id UUID,
  p_minutes INT,
  p_pages INT DEFAULT 0
)
RETURNS JSON AS $$
DECLARE
  session_id UUID;
  new_streak INT;
  result JSON;
BEGIN
  -- Insert or update today's session
  INSERT INTO reading_sessions (user_id, book_id, date, minutes_read, pages_read)
  VALUES (p_user_id, p_book_id, CURRENT_DATE, p_minutes, p_pages)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    minutes_read = reading_sessions.minutes_read + p_minutes,
    pages_read = reading_sessions.pages_read + p_pages,
    book_id = COALESCE(p_book_id, reading_sessions.book_id)
  RETURNING id INTO session_id;

  -- Update user totals
  UPDATE users
  SET
    total_minutes_read = total_minutes_read + p_minutes,
    total_pages_read = total_pages_read + p_pages
  WHERE id = p_user_id;

  -- Calculate new streak
  new_streak := calculate_streak(p_user_id);

  -- Check for streak achievements
  PERFORM check_streak_achievements(p_user_id, new_streak);

  -- Return result
  SELECT json_build_object(
    'session_id', session_id,
    'streak', new_streak,
    'date', CURRENT_DATE
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- DUO READING FUNCTIONS
-- ============================================

-- Function: Generate unique invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code TEXT := '';
  i INT;
BEGIN
  FOR i IN 1..6 LOOP
    code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function: Create a reading duo with invitation
CREATE OR REPLACE FUNCTION create_reading_duo(
  p_creator_id UUID,
  p_book_id UUID
)
RETURNS JSON AS $$
DECLARE
  duo_id UUID;
  invite_code TEXT;
  result JSON;
BEGIN
  -- Check if book exists
  IF NOT EXISTS (SELECT 1 FROM books WHERE id = p_book_id) THEN
    RAISE EXCEPTION 'Book not found';
  END IF;

  -- Create the duo
  INSERT INTO reading_duos (creator_id, book_id, status)
  VALUES (p_creator_id, p_book_id, 'pending')
  RETURNING id INTO duo_id;

  -- Generate unique invite code
  LOOP
    invite_code := generate_invite_code();
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM duo_invitations di WHERE di.invite_code = create_reading_duo.invite_code
    );
  END LOOP;

  -- Create invitation
  INSERT INTO duo_invitations (duo_id, invite_code, expires_at)
  VALUES (duo_id, invite_code, NOW() + INTERVAL '7 days');

  -- Add book to creator's library if not already there
  INSERT INTO user_books (user_id, book_id, status)
  VALUES (p_creator_id, p_book_id, 'not_started')
  ON CONFLICT (user_id, book_id) DO NOTHING;

  SELECT json_build_object(
    'duo_id', duo_id,
    'invite_code', invite_code,
    'expires_at', NOW() + INTERVAL '7 days'
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Join a reading duo
CREATE OR REPLACE FUNCTION join_reading_duo(
  p_user_id UUID,
  p_invite_code TEXT
)
RETURNS JSON AS $$
DECLARE
  invitation RECORD;
  duo RECORD;
  result JSON;
BEGIN
  -- Find valid invitation
  SELECT * INTO invitation
  FROM duo_invitations
  WHERE invite_code = UPPER(p_invite_code)
  AND used_at IS NULL
  AND expires_at > NOW();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or expired invitation code';
  END IF;

  -- Get duo details
  SELECT * INTO duo
  FROM reading_duos
  WHERE id = invitation.duo_id;

  -- Check user is not the creator
  IF duo.creator_id = p_user_id THEN
    RAISE EXCEPTION 'You cannot join your own duo';
  END IF;

  -- Update duo with partner
  UPDATE reading_duos
  SET
    partner_id = p_user_id,
    status = 'active',
    started_at = NOW()
  WHERE id = invitation.duo_id;

  -- Mark invitation as used
  UPDATE duo_invitations
  SET used_at = NOW(), used_by = p_user_id
  WHERE id = invitation.id;

  -- Add book to partner's library
  INSERT INTO user_books (user_id, book_id, status, started_at)
  VALUES (p_user_id, duo.book_id, 'in_progress', NOW())
  ON CONFLICT (user_id, book_id)
  DO UPDATE SET status = 'in_progress', started_at = NOW();

  -- Update creator's book status too
  UPDATE user_books
  SET status = 'in_progress', started_at = COALESCE(started_at, NOW())
  WHERE user_id = duo.creator_id AND book_id = duo.book_id;

  SELECT json_build_object(
    'duo_id', invitation.duo_id,
    'book_id', duo.book_id,
    'partner_name', (SELECT username FROM users WHERE id = duo.creator_id)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check if user can advance to next chapter in duo
CREATE OR REPLACE FUNCTION can_advance_chapter(
  p_duo_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  duo_record RECORD;
  user_chapter INT;
  partner_chapter INT;
BEGIN
  SELECT * INTO duo_record FROM reading_duos WHERE id = p_duo_id;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  IF duo_record.creator_id = p_user_id THEN
    user_chapter := duo_record.creator_chapter;
    partner_chapter := duo_record.partner_chapter;
  ELSIF duo_record.partner_id = p_user_id THEN
    user_chapter := duo_record.partner_chapter;
    partner_chapter := duo_record.creator_chapter;
  ELSE
    RETURN false;
  END IF;

  -- Can advance if partner is at same chapter or ahead
  RETURN user_chapter <= partner_chapter;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update duo chapter progress
CREATE OR REPLACE FUNCTION update_duo_progress(
  p_duo_id UUID,
  p_user_id UUID,
  p_chapter INT
)
RETURNS JSON AS $$
DECLARE
  duo_record RECORD;
  can_advance BOOLEAN;
  waiting_for TEXT;
  result JSON;
BEGIN
  SELECT * INTO duo_record FROM reading_duos WHERE id = p_duo_id AND status = 'active';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Duo not found or not active';
  END IF;

  -- Update the appropriate chapter
  IF duo_record.creator_id = p_user_id THEN
    UPDATE reading_duos
    SET creator_chapter = p_chapter, creator_last_read = NOW()
    WHERE id = p_duo_id;

    waiting_for := CASE
      WHEN p_chapter > duo_record.partner_chapter
      THEN (SELECT username FROM users WHERE id = duo_record.partner_id)
      ELSE NULL
    END;
  ELSIF duo_record.partner_id = p_user_id THEN
    UPDATE reading_duos
    SET partner_chapter = p_chapter, partner_last_read = NOW()
    WHERE id = p_duo_id;

    waiting_for := CASE
      WHEN p_chapter > duo_record.creator_chapter
      THEN (SELECT username FROM users WHERE id = duo_record.creator_id)
      ELSE NULL
    END;
  ELSE
    RAISE EXCEPTION 'User is not part of this duo';
  END IF;

  -- Check if book is completed
  PERFORM check_duo_completion(p_duo_id);

  SELECT json_build_object(
    'chapter', p_chapter,
    'waiting_for', waiting_for,
    'can_continue', waiting_for IS NULL
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check if duo has completed the book
CREATE OR REPLACE FUNCTION check_duo_completion(p_duo_id UUID)
RETURNS VOID AS $$
DECLARE
  duo RECORD;
  total_chapters INT;
BEGIN
  SELECT d.*, b.total_chapters
  INTO duo
  FROM reading_duos d
  JOIN books b ON d.book_id = b.id
  WHERE d.id = p_duo_id;

  IF duo.creator_chapter >= duo.total_chapters
     AND duo.partner_chapter >= duo.total_chapters THEN
    UPDATE reading_duos
    SET status = 'completed', completed_at = NOW()
    WHERE id = p_duo_id;

    -- Update user_books for both users
    UPDATE user_books
    SET status = 'completed', completed_at = NOW()
    WHERE book_id = duo.book_id
    AND user_id IN (duo.creator_id, duo.partner_id);

    -- Update user stats
    UPDATE users
    SET total_books_read = total_books_read + 1
    WHERE id IN (duo.creator_id, duo.partner_id);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- LEADERBOARD FUNCTIONS
-- ============================================

-- Function: Update weekly leaderboard points
CREATE OR REPLACE FUNCTION update_leaderboard_points(
  p_user_id UUID,
  p_pages INT DEFAULT 0,
  p_minutes INT DEFAULT 0,
  p_chapters INT DEFAULT 0
)
RETURNS VOID AS $$
DECLARE
  week_start_date DATE;
  points INT;
  user_division TEXT;
BEGIN
  -- Get Monday of current week
  week_start_date := date_trunc('week', CURRENT_DATE)::DATE;

  -- Get user's current division
  SELECT division INTO user_division FROM users WHERE id = p_user_id;

  -- Calculate points
  points := (p_pages * 1) + (p_minutes * 2) + (p_chapters * 10);

  -- Insert or update leaderboard entry
  INSERT INTO weekly_leaderboard (
    user_id, week_start, points, pages_read, minutes_read,
    chapters_completed, division
  )
  VALUES (
    p_user_id, week_start_date, points, p_pages, p_minutes,
    p_chapters, user_division
  )
  ON CONFLICT (user_id, week_start)
  DO UPDATE SET
    points = weekly_leaderboard.points + points,
    pages_read = weekly_leaderboard.pages_read + p_pages,
    minutes_read = weekly_leaderboard.minutes_read + p_minutes,
    chapters_completed = weekly_leaderboard.chapters_completed + p_chapters;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Calculate weekly rankings (run by cron)
CREATE OR REPLACE FUNCTION calculate_weekly_rankings()
RETURNS VOID AS $$
DECLARE
  week_start_date DATE;
BEGIN
  week_start_date := date_trunc('week', CURRENT_DATE)::DATE;

  -- Update ranks for each division
  WITH ranked AS (
    SELECT
      id,
      ROW_NUMBER() OVER (PARTITION BY division ORDER BY points DESC) as new_rank
    FROM weekly_leaderboard
    WHERE week_start = week_start_date
  )
  UPDATE weekly_leaderboard wl
  SET rank = r.new_rank
  FROM ranked r
  WHERE wl.id = r.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Process weekly promotions/demotions (run by cron on Monday)
CREATE OR REPLACE FUNCTION process_weekly_promotions()
RETURNS VOID AS $$
DECLARE
  last_week DATE;
  user_record RECORD;
BEGIN
  last_week := date_trunc('week', CURRENT_DATE - INTERVAL '1 week')::DATE;

  FOR user_record IN
    SELECT wl.*, u.division as current_division
    FROM weekly_leaderboard wl
    JOIN users u ON wl.user_id = u.id
    WHERE wl.week_start = last_week
  LOOP
    -- Bronze → Argent: 100+ points
    IF user_record.division = 'bronze' AND user_record.points >= 100 THEN
      UPDATE users SET division = 'argent' WHERE id = user_record.user_id;
      UPDATE weekly_leaderboard
      SET promotion_status = 'promoted'
      WHERE id = user_record.id;

    -- Argent → Or: 500+ points
    ELSIF user_record.division = 'argent' AND user_record.points >= 500 THEN
      UPDATE users SET division = 'or' WHERE id = user_record.user_id;
      UPDATE weekly_leaderboard
      SET promotion_status = 'promoted'
      WHERE id = user_record.id;

    -- Or → Argent: <100 points
    ELSIF user_record.division = 'or' AND user_record.points < 100 THEN
      UPDATE users SET division = 'argent' WHERE id = user_record.user_id;
      UPDATE weekly_leaderboard
      SET promotion_status = 'demoted'
      WHERE id = user_record.id;

    -- Argent → Bronze: <50 points
    ELSIF user_record.division = 'argent' AND user_record.points < 50 THEN
      UPDATE users SET division = 'bronze' WHERE id = user_record.user_id;
      UPDATE weekly_leaderboard
      SET promotion_status = 'demoted'
      WHERE id = user_record.id;

    ELSE
      UPDATE weekly_leaderboard
      SET promotion_status = 'stayed'
      WHERE id = user_record.id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ACHIEVEMENT FUNCTIONS
-- ============================================

-- Function: Check and grant streak achievements
CREATE OR REPLACE FUNCTION check_streak_achievements(
  p_user_id UUID,
  p_streak INT
)
RETURNS VOID AS $$
DECLARE
  achievement RECORD;
BEGIN
  FOR achievement IN
    SELECT * FROM achievements
    WHERE category = 'streak'
    AND requirement_value <= p_streak
    AND id NOT IN (
      SELECT achievement_id FROM user_achievements WHERE user_id = p_user_id
    )
  LOOP
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (p_user_id, achievement.id);

    -- Create notification
    INSERT INTO notifications (user_id, type, title_fr, body_fr)
    VALUES (
      p_user_id,
      'achievement',
      'Nouveau badge!',
      'Vous avez obtenu: ' || achievement.name_fr
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check reading achievements (books completed)
CREATE OR REPLACE FUNCTION check_reading_achievements(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  books_count INT;
  achievement RECORD;
BEGIN
  SELECT total_books_read INTO books_count FROM users WHERE id = p_user_id;

  FOR achievement IN
    SELECT * FROM achievements
    WHERE category = 'reading'
    AND requirement_value <= books_count
    AND id NOT IN (
      SELECT achievement_id FROM user_achievements WHERE user_id = p_user_id
    )
  LOOP
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (p_user_id, achievement.id);

    -- Update reader level based on books
    IF books_count >= 21 THEN
      UPDATE users SET reader_level = 'expert' WHERE id = p_user_id;
    ELSIF books_count >= 6 THEN
      UPDATE users SET reader_level = 'regulier' WHERE id = p_user_id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- READING PROGRESS FUNCTIONS
-- ============================================

-- Function: Update reading position and progress
CREATE OR REPLACE FUNCTION update_reading_progress(
  p_user_id UUID,
  p_book_id UUID,
  p_chapter INT,
  p_position INT
)
RETURNS JSON AS $$
DECLARE
  book RECORD;
  progress DECIMAL;
  result JSON;
BEGIN
  -- Get book info
  SELECT * INTO book FROM books WHERE id = p_book_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Book not found';
  END IF;

  -- Calculate progress percentage
  progress := (p_chapter::DECIMAL / book.total_chapters) * 100;

  -- Update user_books
  UPDATE user_books
  SET
    current_chapter = p_chapter,
    current_position = p_position,
    progress_percent = progress,
    status = CASE
      WHEN p_chapter >= book.total_chapters THEN 'completed'
      ELSE 'in_progress'
    END,
    completed_at = CASE
      WHEN p_chapter >= book.total_chapters THEN NOW()
      ELSE NULL
    END,
    last_read_at = NOW()
  WHERE user_id = p_user_id AND book_id = p_book_id;

  -- If just completed, update user stats
  IF p_chapter >= book.total_chapters THEN
    UPDATE users
    SET total_books_read = total_books_read + 1
    WHERE id = p_user_id;

    PERFORM check_reading_achievements(p_user_id);
  END IF;

  SELECT json_build_object(
    'chapter', p_chapter,
    'progress', progress,
    'completed', p_chapter >= book.total_chapters
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- UTILITY FUNCTIONS
-- ============================================

-- Function: Get user stats summary
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'streak_count', u.streak_count,
    'longest_streak', u.longest_streak,
    'total_books_read', u.total_books_read,
    'total_pages_read', u.total_pages_read,
    'total_minutes_read', u.total_minutes_read,
    'reader_level', u.reader_level,
    'division', u.division,
    'books_in_progress', (
      SELECT COUNT(*) FROM user_books
      WHERE user_id = p_user_id AND status = 'in_progress'
    ),
    'active_duos', (
      SELECT COUNT(*) FROM reading_duos
      WHERE (creator_id = p_user_id OR partner_id = p_user_id)
      AND status = 'active'
    ),
    'achievements_count', (
      SELECT COUNT(*) FROM user_achievements WHERE user_id = p_user_id
    )
  )
  INTO result
  FROM users u
  WHERE u.id = p_user_id;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get weekly reading stats
CREATE OR REPLACE FUNCTION get_weekly_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
  week_start DATE;
BEGIN
  week_start := date_trunc('week', CURRENT_DATE)::DATE;

  SELECT json_build_object(
    'days', (
      SELECT json_agg(
        json_build_object(
          'date', date,
          'minutes', minutes_read,
          'completed', minutes_read > 0
        )
        ORDER BY date
      )
      FROM reading_sessions
      WHERE user_id = p_user_id
      AND date >= week_start
      AND date <= CURRENT_DATE
    ),
    'total_minutes', COALESCE((
      SELECT SUM(minutes_read) FROM reading_sessions
      WHERE user_id = p_user_id AND date >= week_start
    ), 0),
    'total_pages', COALESCE((
      SELECT SUM(pages_read) FROM reading_sessions
      WHERE user_id = p_user_id AND date >= week_start
    ), 0),
    'days_active', (
      SELECT COUNT(DISTINCT date) FROM reading_sessions
      WHERE user_id = p_user_id AND date >= week_start AND minutes_read > 0
    )
  )
  INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
