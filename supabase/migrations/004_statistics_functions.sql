-- ============================================
-- TWO READ - Statistics Functions
-- Version: 1.0
-- Date: January 2026
-- ============================================

-- ============================================
-- STATISTICS FUNCTIONS
-- ============================================

-- Function: Get monthly reading statistics
CREATE OR REPLACE FUNCTION get_monthly_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
  month_start DATE;
BEGIN
  month_start := date_trunc('month', CURRENT_DATE)::DATE;

  SELECT json_build_object(
    'weeks', (
      SELECT json_agg(week_data)
      FROM (
        SELECT json_build_object(
          'week', EXTRACT(WEEK FROM date)::INTEGER,
          'minutes', SUM(minutes_read)::INTEGER,
          'pages', SUM(pages_read)::INTEGER
        ) as week_data
        FROM reading_sessions
        WHERE user_id = p_user_id
          AND date >= month_start
        GROUP BY EXTRACT(WEEK FROM date)
        ORDER BY EXTRACT(WEEK FROM date)
      ) weeks
    ),
    'total_minutes', COALESCE((
      SELECT SUM(minutes_read)::INTEGER
      FROM reading_sessions
      WHERE user_id = p_user_id AND date >= month_start
    ), 0),
    'total_pages', COALESCE((
      SELECT SUM(pages_read)::INTEGER
      FROM reading_sessions
      WHERE user_id = p_user_id AND date >= month_start
    ), 0),
    'days_active', COALESCE((
      SELECT COUNT(DISTINCT date)::INTEGER
      FROM reading_sessions
      WHERE user_id = p_user_id AND date >= month_start
    ), 0)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get all-time reading statistics
CREATE OR REPLACE FUNCTION get_all_time_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'sessions', (
      SELECT json_agg(
        json_build_object(
          'date', date,
          'minutes', minutes_read,
          'pages', pages_read
        )
        ORDER BY date
      )
      FROM reading_sessions
      WHERE user_id = p_user_id
    ),
    'first_session_date', (
      SELECT MIN(date) FROM reading_sessions WHERE user_id = p_user_id
    ),
    'average_daily_minutes', COALESCE((
      SELECT ROUND(AVG(minutes_read))::INTEGER
      FROM reading_sessions
      WHERE user_id = p_user_id AND minutes_read > 0
    ), 0),
    'longest_session_minutes', COALESCE((
      SELECT MAX(minutes_read)::INTEGER
      FROM reading_sessions
      WHERE user_id = p_user_id
    ), 0),
    'total_sessions', COALESCE((
      SELECT COUNT(*)::INTEGER
      FROM reading_sessions
      WHERE user_id = p_user_id
    ), 0)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
