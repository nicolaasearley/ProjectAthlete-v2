-- ============================================
-- ProjectAthlete v2 - Migration 028
-- RLS Fix: Allow admins to update exercises
-- ============================================

-- Add UPDATE policy for exercises
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'exercises' 
        AND policyname = 'Admins can update exercises'
    ) THEN
        CREATE POLICY "Admins can update exercises"
            ON public.exercises FOR UPDATE
            TO authenticated
            USING (is_admin());
    END IF;
END $$;

-- Verify policies
-- SELECT * FROM pg_policies WHERE tablename = 'exercises';
