-- ============================================
-- ProjectAthlete v2 - Database Migration 017
-- User Management: Admin Permissions
-- ============================================

-- 1. Add policy to allow admins to update profiles in their organization
-- This is needed for the User Management page to work.
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update profiles in their org') THEN
        CREATE POLICY "Admins can update profiles in their org"
            ON public.profiles FOR UPDATE
            USING (is_admin() AND org_id = get_user_org_id())
            WITH CHECK (is_admin() AND org_id = get_user_org_id());
    END IF;
END $$;

