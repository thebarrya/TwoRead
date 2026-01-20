-- ============================================
-- TWO READ - Update Weekly Stats Function
-- Version: 1.1
-- Date: January 2026
-- ============================================

-- Update get_weekly_stats to include pages_read per day
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
          'pages', pages_read,
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
