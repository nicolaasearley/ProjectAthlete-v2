-- ============================================
-- ProjectAthlete v2 - Database Migration 006
-- Community Workouts: Submissions, Comments, Reactions
-- ============================================

-- Run this AFTER 005_exercise_stats.sql

-- ============================================
-- COMMUNITY WORKOUTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.community_workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES public.organizations(id),
  author_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  workout_type TEXT NOT NULL CHECK (workout_type IN ('amrap', 'for_time', 'emom', 'other')),
  time_cap_minutes INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_featured BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_community_workouts_org_id ON public.community_workouts(org_id);
CREATE INDEX IF NOT EXISTS idx_community_workouts_status ON public.community_workouts(status);
CREATE INDEX IF NOT EXISTS idx_community_workouts_author_id ON public.community_workouts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_workouts_is_featured ON public.community_workouts(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_community_workouts_created_at ON public.community_workouts(created_at DESC);

-- Enable RLS
ALTER TABLE public.community_workouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view approved workouts and their own submissions"
  ON public.community_workouts FOR SELECT
  USING (
    org_id = get_user_org_id()
    AND (
      status = 'approved' 
      OR author_id = auth.uid() 
      OR is_coach_or_admin()
    )
  );

CREATE POLICY "Users can submit community workouts"
  ON public.community_workouts FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND org_id = get_user_org_id()
    AND status = 'pending'
  );

CREATE POLICY "Authors can update their pending submissions"
  ON public.community_workouts FOR UPDATE
  USING (
    org_id = get_user_org_id()
    AND (
      (author_id = auth.uid() AND status = 'pending')
      OR is_coach_or_admin()
    )
  );

CREATE POLICY "Authors can delete their pending submissions"
  ON public.community_workouts FOR DELETE
  USING (author_id = auth.uid() AND status = 'pending');

-- Update trigger
CREATE TRIGGER update_community_workouts_updated_at
  BEFORE UPDATE ON public.community_workouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- WORKOUT COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.workout_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID NOT NULL REFERENCES public.community_workouts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workout_comments_workout_id ON public.workout_comments(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_comments_user_id ON public.workout_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_comments_created_at ON public.workout_comments(created_at DESC);

-- Enable RLS
ALTER TABLE public.workout_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view comments on approved workouts"
  ON public.workout_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_workouts
      WHERE community_workouts.id = workout_comments.workout_id
      AND community_workouts.org_id = get_user_org_id()
      AND community_workouts.status = 'approved'
    )
  );

CREATE POLICY "Users can create comments on approved workouts"
  ON public.workout_comments FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.community_workouts
      WHERE community_workouts.id = workout_comments.workout_id
      AND community_workouts.org_id = get_user_org_id()
      AND community_workouts.status = 'approved'
    )
  );

CREATE POLICY "Users can update their own comments"
  ON public.workout_comments FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
  ON public.workout_comments FOR DELETE
  USING (user_id = auth.uid());

-- Update trigger
CREATE TRIGGER update_workout_comments_updated_at
  BEFORE UPDATE ON public.workout_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- WORKOUT REACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.workout_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID NOT NULL REFERENCES public.community_workouts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'fire', 'strong', 'respect')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workout_id, user_id, reaction_type)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_workout_reactions_workout_id ON public.workout_reactions(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_reactions_user_id ON public.workout_reactions(user_id);

-- Enable RLS
ALTER TABLE public.workout_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view reactions on org workouts"
  ON public.workout_reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_workouts
      WHERE community_workouts.id = workout_reactions.workout_id
      AND community_workouts.org_id = get_user_org_id()
    )
  );

CREATE POLICY "Users can add reactions to approved workouts"
  ON public.workout_reactions FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.community_workouts
      WHERE community_workouts.id = workout_reactions.workout_id
      AND community_workouts.org_id = get_user_org_id()
      AND community_workouts.status = 'approved'
    )
  );

CREATE POLICY "Users can remove their own reactions"
  ON public.workout_reactions FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get reaction counts for a workout
CREATE OR REPLACE FUNCTION get_workout_reaction_counts(p_workout_id UUID)
RETURNS TABLE (
  reaction_type TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    wr.reaction_type,
    COUNT(*)::BIGINT
  FROM public.workout_reactions wr
  WHERE wr.workout_id = p_workout_id
  GROUP BY wr.reaction_type;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Get user's reactions for a workout
CREATE OR REPLACE FUNCTION get_user_workout_reactions(p_workout_id UUID)
RETURNS TEXT[] AS $$
BEGIN
  RETURN ARRAY(
    SELECT reaction_type
    FROM public.workout_reactions
    WHERE workout_id = p_workout_id
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Approve a community workout
CREATE OR REPLACE FUNCTION approve_community_workout(p_workout_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  IF NOT is_coach_or_admin() THEN
    RAISE EXCEPTION 'Only coaches and admins can approve workouts';
  END IF;

  UPDATE public.community_workouts
  SET 
    status = 'approved',
    approved_by = auth.uid(),
    approved_at = NOW()
  WHERE id = p_workout_id
  AND org_id = get_user_org_id()
  AND status = 'pending';

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reject a community workout
CREATE OR REPLACE FUNCTION reject_community_workout(p_workout_id UUID, p_reason TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  IF NOT is_coach_or_admin() THEN
    RAISE EXCEPTION 'Only coaches and admins can reject workouts';
  END IF;

  UPDATE public.community_workouts
  SET 
    status = 'rejected',
    rejection_reason = p_reason,
    approved_by = auth.uid(),
    approved_at = NOW()
  WHERE id = p_workout_id
  AND org_id = get_user_org_id()
  AND status = 'pending';

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Toggle featured status
CREATE OR REPLACE FUNCTION toggle_workout_featured(p_workout_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_featured BOOLEAN;
BEGIN
  IF NOT is_coach_or_admin() THEN
    RAISE EXCEPTION 'Only coaches and admins can feature workouts';
  END IF;

  UPDATE public.community_workouts
  SET is_featured = NOT is_featured
  WHERE id = p_workout_id
  AND org_id = get_user_org_id()
  AND status = 'approved'
  RETURNING is_featured INTO v_is_featured;

  RETURN v_is_featured;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
