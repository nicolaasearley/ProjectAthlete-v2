-- ============================================
-- ProjectAthlete v2 - Database Migration 015
-- User Favorite Exercises
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_favorite_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, exercise_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_favorite_exercises_user_id ON public.user_favorite_exercises(user_id);

-- Enable RLS
ALTER TABLE public.user_favorite_exercises ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own favorite exercises.') THEN
        CREATE POLICY "Users can view their own favorite exercises."
            ON public.user_favorite_exercises FOR SELECT
            USING ( auth.uid() = user_id );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own favorite exercises.') THEN
        CREATE POLICY "Users can manage their own favorite exercises."
            ON public.user_favorite_exercises FOR ALL
            USING ( auth.uid() = user_id )
            WITH CHECK ( auth.uid() = user_id );
    END IF;
END $$;

