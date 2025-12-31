-- ============================================
-- ProjectAthlete v2 - Migration 031
-- RLS Fix: Allow users to insert custom exercises
-- ============================================

-- Add INSERT policy for exercises
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'exercises' 
        AND policyname = 'Users can insert their own org exercises'
    ) THEN
        CREATE POLICY "Users can insert their own org exercises"
            ON public.exercises FOR INSERT
            TO authenticated
            WITH CHECK (
                is_global = FALSE 
                AND org_id = get_user_org_id()
            );
    END IF;
END $$;

-- Also add DELETE policy for org members to manage their custom exercises
-- This allows anyone in the org to delete an exercise that belongs to the org
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'exercises' 
        AND policyname = 'Users can delete their own org exercises'
    ) THEN
        CREATE POLICY "Users can delete their own org exercises"
            ON public.exercises FOR DELETE
            TO authenticated
            USING (
                is_global = FALSE 
                AND org_id = get_user_org_id()
            );
    END IF;
END $$;

-- Verify policies
-- SELECT * FROM pg_policies WHERE tablename = 'exercises';
