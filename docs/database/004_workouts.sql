-- ============================================
-- ProjectAthlete v2 - Database Migration 004
-- Workout Logging: Sessions, Exercises, Sets
-- ============================================

-- Run this AFTER 003_exercise_seed.sql

-- ============================================
-- WORKOUT SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES public.organizations(id),
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON public.workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_org_id ON public.workout_sessions(org_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_date ON public.workout_sessions(date DESC);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_date ON public.workout_sessions(user_id, date DESC);

-- Enable RLS
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Athletes can view their own sessions"
  ON public.workout_sessions FOR SELECT
  USING (
    user_id = auth.uid()
    OR (org_id = get_user_org_id() AND is_coach_or_admin())
  );

CREATE POLICY "Athletes can create their own sessions"
  ON public.workout_sessions FOR INSERT
  WITH CHECK (user_id = auth.uid() AND org_id = get_user_org_id());

CREATE POLICY "Athletes can update their own sessions"
  ON public.workout_sessions FOR UPDATE
  USING (user_id = auth.uid() AND org_id = get_user_org_id())
  WITH CHECK (user_id = auth.uid() AND org_id = get_user_org_id());

CREATE POLICY "Athletes can delete their own sessions"
  ON public.workout_sessions FOR DELETE
  USING (user_id = auth.uid() AND org_id = get_user_org_id());

-- ============================================
-- WORKOUT EXERCISES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.workout_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id),
  order_index INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workout_exercises_session_id ON public.workout_exercises(session_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_exercise_id ON public.workout_exercises(exercise_id);

-- Enable RLS
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view exercises in visible sessions"
  ON public.workout_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions
      WHERE workout_sessions.id = workout_exercises.session_id
      AND (
        workout_sessions.user_id = auth.uid()
        OR (workout_sessions.org_id = get_user_org_id() AND is_coach_or_admin())
      )
    )
  );

CREATE POLICY "Athletes can create exercises in their sessions"
  ON public.workout_exercises FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_sessions
      WHERE workout_sessions.id = workout_exercises.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Athletes can update exercises in their sessions"
  ON public.workout_exercises FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions
      WHERE workout_sessions.id = workout_exercises.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Athletes can delete exercises in their sessions"
  ON public.workout_exercises FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions
      WHERE workout_sessions.id = workout_exercises.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

-- ============================================
-- WORKOUT SETS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.workout_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_exercise_id UUID NOT NULL REFERENCES public.workout_exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  weight DECIMAL(7,2) NOT NULL CHECK (weight >= 0), -- up to 99999.99 lbs/kg
  reps INTEGER NOT NULL CHECK (reps > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workout_sets_workout_exercise_id ON public.workout_sets(workout_exercise_id);

-- Enable RLS
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view sets in visible exercises"
  ON public.workout_sets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_exercises we
      JOIN public.workout_sessions ws ON ws.id = we.session_id
      WHERE we.id = workout_sets.workout_exercise_id
      AND (
        ws.user_id = auth.uid()
        OR (ws.org_id = get_user_org_id() AND is_coach_or_admin())
      )
    )
  );

CREATE POLICY "Athletes can create sets in their exercises"
  ON public.workout_sets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_exercises we
      JOIN public.workout_sessions ws ON ws.id = we.session_id
      WHERE we.id = workout_sets.workout_exercise_id
      AND ws.user_id = auth.uid()
    )
  );

CREATE POLICY "Athletes can update their sets"
  ON public.workout_sets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_exercises we
      JOIN public.workout_sessions ws ON ws.id = we.session_id
      WHERE we.id = workout_sets.workout_exercise_id
      AND ws.user_id = auth.uid()
    )
  );

CREATE POLICY "Athletes can delete their sets"
  ON public.workout_sets FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_exercises we
      JOIN public.workout_sessions ws ON ws.id = we.session_id
      WHERE we.id = workout_sets.workout_exercise_id
      AND ws.user_id = auth.uid()
    )
  );

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workout_sessions_updated_at
  BEFORE UPDATE ON public.workout_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
