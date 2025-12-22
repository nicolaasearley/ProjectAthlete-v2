-- ============================================
-- ProjectAthlete v2 - Database Migration 020
-- Community Workouts: Enhanced Permissions
-- ============================================

-- 1. Update the UPDATE policy to allow authors to edit their own workouts (any status)
-- and coaches/admins to edit any workout in their org.
DROP POLICY IF EXISTS "Authors can update their pending submissions" ON public.community_workouts;

CREATE POLICY "Authors and coaches can update community workouts"
  ON public.community_workouts FOR UPDATE
  USING (
    org_id = get_user_org_id()
    AND (
      author_id = auth.uid()
      OR is_coach_or_admin()
    )
  )
  WITH CHECK (
    org_id = get_user_org_id()
    AND (
      author_id = auth.uid()
      OR is_coach_or_admin()
    )
  );

-- 2. Update the DELETE policy to allow authors to delete their own workouts
-- and coaches/admins to delete any workout in their org.
DROP POLICY IF EXISTS "Authors can delete their pending submissions" ON public.community_workouts;

CREATE POLICY "Authors and coaches can delete community workouts"
  ON public.community_workouts FOR DELETE
  USING (
    org_id = get_user_org_id()
    AND (
      author_id = auth.uid()
      OR is_coach_or_admin()
    )
  );

