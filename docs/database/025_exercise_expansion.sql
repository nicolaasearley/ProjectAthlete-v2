-- ============================================
-- ProjectAthlete v2 - Database Migration 025
-- Exercise Expansion: Description, Muscle Groups, Demo
-- ============================================

-- Add new columns to public.exercises
ALTER TABLE public.exercises 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS primary_muscle_group TEXT,
ADD COLUMN IF NOT EXISTS secondary_muscle_groups TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS demo_url TEXT;

-- Update the existing search function to include description in the search?
-- For now, we'll keep it simple as the search is already working on name and alias.

COMMENT ON COLUMN public.exercises.description IS 'Detailed technique instructions and tips';
COMMENT ON COLUMN public.exercises.primary_muscle_group IS 'Main muscle target (e.g., Quads, Chest)';
COMMENT ON COLUMN public.exercises.secondary_muscle_groups IS 'Supporting muscles involved';
COMMENT ON COLUMN public.exercises.demo_url IS 'URL to an image, GIF, or hosted video demo';
