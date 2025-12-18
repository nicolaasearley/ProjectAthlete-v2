-- ============================================
-- ProjectAthlete v2 - Database Migration 002
-- Exercise Library: Exercises and Aliases
-- ============================================

-- Run this AFTER 001_foundation.sql

-- ============================================
-- EXERCISES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'squat', 'hinge', 'push', 'pull', 'carry', 'core', 'olympic', 'cardio', 'other'
  )),
  is_global BOOLEAN DEFAULT TRUE,
  org_id UUID REFERENCES public.organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT exercise_scope CHECK (
    (is_global = TRUE AND org_id IS NULL) OR
    (is_global = FALSE AND org_id IS NOT NULL)
  )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_exercises_category ON public.exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_is_global ON public.exercises(is_global);
CREATE INDEX IF NOT EXISTS idx_exercises_name ON public.exercises(name);

-- Enable RLS
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view global exercises and their org's exercises
CREATE POLICY "Users can view global and org exercises"
  ON public.exercises FOR SELECT
  USING (is_global = TRUE OR org_id = get_user_org_id());

-- ============================================
-- EXERCISE ALIASES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.exercise_aliases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  UNIQUE(exercise_id, alias)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_exercise_aliases_exercise_id ON public.exercise_aliases(exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercise_aliases_alias ON public.exercise_aliases(alias);

-- Enable RLS
ALTER TABLE public.exercise_aliases ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view aliases for visible exercises
CREATE POLICY "Users can view aliases for visible exercises"
  ON public.exercise_aliases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.exercises
      WHERE exercises.id = exercise_aliases.exercise_id
      AND (exercises.is_global = TRUE OR exercises.org_id = get_user_org_id())
    )
  );

-- ============================================
-- SEARCH FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION search_exercises(search_term TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  category TEXT,
  match_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    e.id,
    e.name,
    e.category,
    CASE 
      WHEN e.name ILIKE search_term || '%' THEN 'name_prefix'
      WHEN e.name ILIKE '%' || search_term || '%' THEN 'name_contains'
      WHEN ea.alias ILIKE search_term || '%' THEN 'alias_prefix'
      ELSE 'alias_contains'
    END as match_type
  FROM public.exercises e
  LEFT JOIN public.exercise_aliases ea ON ea.exercise_id = e.id
  WHERE (e.is_global = TRUE OR e.org_id = get_user_org_id())
  AND (
    e.name ILIKE '%' || search_term || '%'
    OR ea.alias ILIKE '%' || search_term || '%'
  )
  ORDER BY 
    CASE 
      WHEN e.name ILIKE search_term || '%' THEN 1
      WHEN ea.alias ILIKE search_term || '%' THEN 2
      WHEN e.name ILIKE '%' || search_term || '%' THEN 3
      ELSE 4
    END,
    e.name;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
