-- ============================================
-- ProjectAthlete v2 - Database Migration 010
-- Training Stats Functions
-- ============================================

-- 1. Volume Trends: Returns daily volume for the last X days
CREATE OR REPLACE FUNCTION get_volume_trends(p_user_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
  work_date DATE,
  total_volume DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ws.date::DATE as work_date,
    SUM(wsets.weight * wsets.reps) as total_volume
  FROM public.workout_sessions ws
  JOIN public.workout_exercises we ON we.session_id = ws.id
  JOIN public.workout_sets wsets ON wsets.workout_exercise_id = we.id
  WHERE ws.user_id = p_user_id
    AND ws.date >= (CURRENT_DATE - p_days)
  GROUP BY work_date
  ORDER BY work_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Workout Streaks: Returns current and longest streaks
CREATE OR REPLACE FUNCTION get_workout_streaks(p_user_id UUID)
RETURNS TABLE (
  current_streak INTEGER,
  longest_streak INTEGER
) AS $$
DECLARE
  v_current_streak INTEGER := 0;
  v_longest_streak INTEGER := 0;
  v_temp_streak INTEGER := 0;
  v_last_date DATE;
  v_work_date DATE;
BEGIN
  FOR v_work_date IN 
    SELECT DISTINCT date::DATE 
    FROM public.workout_sessions 
    WHERE user_id = p_user_id 
    ORDER BY date DESC
  LOOP
    IF v_last_date IS NULL THEN
      IF v_work_date = CURRENT_DATE OR v_work_date = (CURRENT_DATE - 1) THEN
        v_temp_streak := 1;
      ELSE
        v_temp_streak := 0;
      END IF;
    ELSIF v_last_date - v_work_date = 1 THEN
      v_temp_streak := v_temp_streak + 1;
    ELSE
      IF v_temp_streak > v_longest_streak THEN
        v_longest_streak := v_temp_streak;
      END IF;
      -- If we're looking at the most recent dates and the gap is broken, current streak is done
      IF v_current_streak = 0 AND v_last_date >= (CURRENT_DATE - 1) THEN
        v_current_streak := v_temp_streak;
      END IF;
      v_temp_streak := 1;
    END IF;
    v_last_date := v_work_date;
  END LOOP;

  IF v_temp_streak > v_longest_streak THEN
    v_longest_streak := v_temp_streak;
  END IF;
  
  IF v_current_streak = 0 THEN
    v_current_streak := v_temp_streak;
  END IF;

  RETURN QUERY SELECT COALESCE(v_current_streak, 0), COALESCE(v_longest_streak, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Category Breakdown: Returns % of sets per category
CREATE OR REPLACE FUNCTION get_category_breakdown(p_user_id UUID)
RETURNS TABLE (
  category TEXT,
  set_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.category::TEXT,
    COUNT(wsets.id) as set_count
  FROM public.workout_sessions ws
  JOIN public.workout_exercises we ON we.session_id = ws.id
  JOIN public.exercises e ON e.id = we.exercise_id
  JOIN public.workout_sets wsets ON wsets.workout_exercise_id = we.id
  WHERE ws.user_id = p_user_id
  GROUP BY e.category;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. PR History: Returns PR progression for a specific exercise
CREATE OR REPLACE FUNCTION get_pr_history(p_user_id UUID, p_exercise_id UUID)
RETURNS TABLE (
  logged_date DATE,
  max_weight DECIMAL,
  reps INTEGER,
  estimated_1rm DECIMAL
) AS $$
DECLARE
  v_current_max_1rm DECIMAL := 0;
  v_row RECORD;
BEGIN
  FOR v_row IN 
    SELECT 
      ws.date::DATE as work_date,
      wsets.weight,
      wsets.reps,
      CASE 
        WHEN wsets.reps = 1 THEN wsets.weight 
        ELSE wsets.weight * (1 + wsets.reps / 30.0) 
      END as e1rm
    FROM public.workout_sessions ws
    JOIN public.workout_exercises we ON we.session_id = ws.id
    JOIN public.workout_sets wsets ON wsets.workout_exercise_id = we.id
    WHERE ws.user_id = p_user_id
      AND we.exercise_id = p_exercise_id
    ORDER BY work_date ASC, e1rm DESC
  LOOP
    IF v_row.e1rm > v_current_max_1rm THEN
      v_current_max_1rm := v_row.e1rm;
      logged_date := v_row.work_date;
      max_weight := v_row.weight;
      reps := v_row.reps;
      estimated_1rm := v_row.e1rm;
      RETURN NEXT;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

