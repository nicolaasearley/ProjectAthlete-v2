-- ============================================
-- ProjectAthlete v2 - Database Migration 019
-- Challenge Leaderboard: Include User Info
-- ============================================

CREATE OR REPLACE FUNCTION get_challenge_leaderboard(p_challenge_id UUID)
RETURNS TABLE (
  rank BIGINT,
  user_id UUID,
  display_name TEXT,
  avatar_url TEXT,
  user_role TEXT,
  is_anonymous BOOLEAN,
  total_value DECIMAL,
  log_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROW_NUMBER() OVER (ORDER BY SUM(cl.value) DESC) AS rank,
    cl.user_id,
    CASE 
      WHEN p.is_anonymous_on_leaderboards THEN 'Anonymous'
      ELSE p.display_name
    END AS display_name,
    CASE 
      WHEN p.is_anonymous_on_leaderboards THEN NULL
      ELSE p.avatar_url
    END AS avatar_url,
    CASE 
      WHEN p.is_anonymous_on_leaderboards THEN 'athlete'
      ELSE p.role
    END AS user_role,
    p.is_anonymous_on_leaderboards AS is_anonymous,
    SUM(cl.value)::DECIMAL AS total_value,
    COUNT(cl.id) AS log_count
  FROM public.challenge_logs cl
  JOIN public.profiles p ON p.id = cl.user_id
  WHERE cl.challenge_id = p_challenge_id
  GROUP BY cl.user_id, p.display_name, p.avatar_url, p.role, p.is_anonymous_on_leaderboards
  ORDER BY total_value DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

