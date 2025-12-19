-- ============================================
-- ProjectAthlete v2 - Database Migration 008
-- Flexible Metrics for Workouts
-- ============================================

-- 1. Add metric columns to workout_sets
ALTER TABLE public.workout_sets 
  ADD COLUMN IF NOT EXISTS distance_meters DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS time_seconds INTEGER,
  ADD COLUMN IF NOT EXISTS calories INTEGER;

-- 2. Add default_metric to exercises table to help the UI
-- Options: 'weight_reps', 'time', 'distance', 'calories', 'time_distance', etc.
ALTER TABLE public.exercises 
  ADD COLUMN IF NOT EXISTS default_metric TEXT DEFAULT 'weight_reps' 
  CHECK (default_metric IN ('weight_reps', 'time', 'distance', 'calories', 'time_distance', 'time_calories'));

-- 3. Update existing exercises based on categories
UPDATE public.exercises SET default_metric = 'time' WHERE category = 'cardio' AND (name ILIKE '%run%' OR name ILIKE '%walk%' OR name ILIKE '%cycle%');
UPDATE public.exercises SET default_metric = 'distance' WHERE category = 'cardio' AND (name ILIKE '%row%' OR name ILIKE '%swim%');
UPDATE public.exercises SET default_metric = 'calories' WHERE category = 'cardio' AND (name ILIKE '%bike%' OR name ILIKE '%ski%');
UPDATE public.exercises SET default_metric = 'weight_reps' WHERE default_metric IS NULL;

