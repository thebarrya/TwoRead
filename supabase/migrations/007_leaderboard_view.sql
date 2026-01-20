-- Vue optimisée pour le classement hebdomadaire
-- Cette vue combine les données de weekly_leaderboard avec les informations utilisateur
-- Elle retourne uniquement les données de la semaine en cours

CREATE OR REPLACE VIEW v_leaderboard AS
SELECT
  wl.user_id,
  wl.week_start,
  wl.points,
  wl.pages_read,
  wl.minutes_read,
  wl.division,
  wl.rank,
  u.username,
  u.avatar_url,
  u.reader_level
FROM weekly_leaderboard wl
INNER JOIN users u ON wl.user_id = u.id
WHERE wl.week_start = (
  SELECT MAX(week_start)
  FROM weekly_leaderboard
)
ORDER BY wl.rank ASC;

-- Grant permissions pour permettre l'accès à tous les utilisateurs authentifiés
GRANT SELECT ON v_leaderboard TO authenticated;
GRANT SELECT ON v_leaderboard TO anon;

-- Commentaire sur la vue pour documentation
COMMENT ON VIEW v_leaderboard IS 'Vue du classement hebdomadaire avec informations utilisateur. Retourne uniquement les données de la semaine en cours, triées par rang.';
