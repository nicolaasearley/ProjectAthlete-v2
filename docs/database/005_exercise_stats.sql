-- ============================================
-- ProjectAthlete v2 - Database Migration 005
-- Exercise Stats: Computed Functions
-- ============================================

-- Run this AFTER 004_workouts.sql

-- ============================================
-- GET EXERCISE STATS
-- Returns summary stats for a specific exercise
-- ============================================
CREATE OR REPLACE FUNCTION get_exercise_stats(
  p_exercise_id UUID,
  p_user_id UUID DEFAULT NULL
)
RETURNS TABLE (
  max_weight DECIMAL,
  estimated_1rm DECIMAL,
  max_session_volume DECIMAL,
  total_sets BIGINT,
  total_reps BIGINT,
  total_volume DECIMAL,
  first_logged DATE,
  last_logged DATE,
  session_count BIGINT
) AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Use provided user_id or current user
  v_user_id := COALESCE(p_user_id, auth.uid());
  
  RETURN QUERY
  WITH user_sets AS (
    SELECT
      ws.id AS set_id,
      we.session_id,
      wsess.date,
      ws.weight,
      ws.reps,
      -- Epley formula for estimated 1RM
      ws.weight * (1 + ws.reps::DECIMAL / 30) AS e1rm,
      ws.weight * ws.reps AS set_volume
    FROM public.workout_sets ws
    JOIN public.workout_exercises we ON we.id = ws.workout_exercise_id
    JOIN public.workout_sessions wsess ON wsess.id = we.session_id
    WHERE we.exercise_id = p_exercise_id
    AND wsess.user_id = v_user_id
  ),
  session_volumes AS (
    SELECT 
      session_id, 
      SUM(set_volume) AS total_volume
    FROM user_sets
    GROUP BY session_id
  )
  SELECT
    MAX(us.weight)::DECIMAL AS max_weight,
    ROUND(MAX(us.e1rm), 1)::DECIMAL AS estimated_1rm,
    MAX(sv.total_volume)::DECIMAL AS max_session_volume,
    COUNT(us.set_id)::BIGINT AS total_sets,
    SUM(us.reps)::BIGINT AS total_reps,
    SUM(us.set_volume)::DECIMAL AS total_volume,
    MIN(us.date) AS first_logged,
    MAX(us.date) AS last_logged,
    COUNT(DISTINCT us.session_id)::BIGINT AS session_count
  FROM user_sets us
  LEFT JOIN session_volumes sv ON sv.session_id = us.session_id;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================
-- GET EXERCISE HISTORY
-- Returns workout history for a specific exercise
-- ============================================
CREATE OR REPLACE FUNCTION get_exercise_history(
  p_exercise_id UUID,
  p_user_id UUID DEFAULT NULL,
  p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
  session_id UUID,
  date DATE,
  set_count INTEGER,
  total_reps INTEGER,
  total_volume DECIMAL,
  best_set_weight DECIMAL,
  best_set_reps INTEGER,
  best_e1rm DECIMAL
) AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := COALESCE(p_user_id, auth.uid());
  
  RETURN QUERY
  SELECT
    wsess.id AS session_id,
    wsess.date,
    COUNT(ws.id)::INTEGER AS set_count,
    SUM(ws.reps)::INTEGER AS total_reps,
    SUM(ws.weight * ws.reps)::DECIMAL AS total_volume,
    MAX(ws.weight)::DECIMAL AS best_set_weight,
    -- Get reps from the heaviest set
    (
      SELECT ws2.reps 
      FROM public.workout_sets ws2 
      JOIN public.workout_exercises we2 ON we2.id = ws2.workout_exercise_id
      WHERE we2.session_id = wsess.id AND we2.exercise_id = p_exercise_id
      ORDER BY ws2.weight DESC, ws2.reps DESC
      LIMIT 1
    )::INTEGER AS best_set_reps,
    ROUND(MAX(ws.weight * (1 + ws.reps::DECIMAL / 30)), 1)::DECIMAL AS best_e1rm
  FROM public.workout_sessions wsess
  JOIN public.workout_exercises we ON we.session_id = wsess.id
  JOIN public.workout_sets ws ON ws.workout_exercise_id = we.id
  WHERE we.exercise_id = p_exercise_id
  AND wsess.user_id = v_user_id
  GROUP BY wsess.id, wsess.date
  ORDER BY wsess.date DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================
-- GET BEST PERFORMANCES
-- Returns top performances by estimated 1RM
-- ============================================
CREATE OR REPLACE FUNCTION get_best_performances(
  p_exercise_id UUID,
  p_user_id UUID DEFAULT NULL,
  p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
  set_id UUID,
  date DATE,
  weight DECIMAL,
  reps INTEGER,
  estimated_1rm DECIMAL,
  volume DECIMAL
) AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := COALESCE(p_user_id, auth.uid());
  
  RETURN QUERY
  SELECT
    ws.id AS set_id,
    wsess.date,
    ws.weight,
    ws.reps,
    ROUND(ws.weight * (1 + ws.reps::DECIMAL / 30), 1) AS estimated_1rm,
    (ws.weight * ws.reps)::DECIMAL AS volume
  FROM public.workout_sets ws
  JOIN public.workout_exercises we ON we.id = ws.workout_exercise_id
  JOIN public.workout_sessions wsess ON wsess.id = we.session_id
  WHERE we.exercise_id = p_exercise_id
  AND wsess.user_id = v_user_id
  ORDER BY ws.weight * (1 + ws.reps::DECIMAL / 30) DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================
-- GET E1RM PROGRESSION
-- Returns e1RM over time for charting
-- ============================================
CREATE OR REPLACE FUNCTION get_e1rm_progression(
  p_exercise_id UUID,
  p_user_id UUID DEFAULT NULL,
  p_limit INTEGER DEFAULT 100
)
RETURNS TABLE (
  date DATE,
  best_e1rm DECIMAL
) AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := COALESCE(p_user_id, auth.uid());
  
  RETURN QUERY
  SELECT
    wsess.date,
    ROUND(MAX(ws.weight * (1 + ws.reps::DECIMAL / 30)), 1)::DECIMAL AS best_e1rm
  FROM public.workout_sessions wsess
  JOIN public.workout_exercises we ON we.session_id = wsess.id
  JOIN public.workout_sets ws ON ws.workout_exercise_id = we.id
  WHERE we.exercise_id = p_exercise_id
  AND wsess.user_id = v_user_id
  GROUP BY wsess.date
  ORDER BY wsess.date ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================
-- GET USER EXERCISE SUMMARY
-- Returns summary of all exercises for dashboard
-- ============================================
DROP FUNCTION IF EXISTS get_user_exercise_summary(UUID, INTEGER);
CREATE OR REPLACE FUNCTION get_user_exercise_summary(
  p_user_id UUID DEFAULT NULL,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  exercise_id UUID,
  exercise_name TEXT,
  category TEXT,
  max_weight DECIMAL,
  estimated_1rm DECIMAL,
  last_logged DATE,
  total_sets BIGINT
) AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := COALESCE(p_user_id, auth.uid());
  
  RETURN QUERY
  SELECT
    e.id AS exercise_id,
    e.name AS exercise_name,
    e.category,
    MAX(ws.weight)::DECIMAL AS max_weight,
    ROUND(MAX(ws.weight * (1 + ws.reps::DECIMAL / 30)), 1)::DECIMAL AS estimated_1rm,
    MAX(wsess.date) AS last_logged,
    COUNT(ws.id) AS total_sets
  FROM public.exercises e
  JOIN public.workout_exercises we ON we.exercise_id = e.id
  JOIN public.workout_sessions wsess ON wsess.id = we.session_id
  JOIN public.workout_sets ws ON ws.workout_exercise_id = we.id
  WHERE wsess.user_id = v_user_id
  GROUP BY e.id, e.name, e.category
  ORDER BY MAX(wsess.date) DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
