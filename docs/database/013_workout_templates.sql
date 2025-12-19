-- ============================================
-- ProjectAthlete v2 - Database Migration 013
-- Workout Templates
-- ============================================

-- 1. Workout Templates Table
CREATE TABLE public.workout_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Template Exercises Table
CREATE TABLE public.template_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES public.workout_templates(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Template Sets Table
CREATE TABLE public.template_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_exercise_id UUID NOT NULL REFERENCES public.template_exercises(id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL,
    weight DECIMAL,
    reps INTEGER,
    distance_meters DECIMAL,
    time_seconds INTEGER,
    calories INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. RLS for Workout Templates
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view templates in their org."
    ON public.workout_templates FOR SELECT
    USING ( org_id = (SELECT org_id FROM public.profiles WHERE id = auth.uid()) );

CREATE POLICY "Users can create their own templates."
    ON public.workout_templates FOR INSERT
    WITH CHECK ( user_id = auth.uid() );

CREATE POLICY "Users can update their own templates."
    ON public.workout_templates FOR UPDATE
    USING ( user_id = auth.uid() );

CREATE POLICY "Users can delete their own templates."
    ON public.workout_templates FOR DELETE
    USING ( user_id = auth.uid() );

-- 5. RLS for Template Exercises
ALTER TABLE public.template_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view template exercises in their org."
    ON public.template_exercises FOR SELECT
    USING ( 
        EXISTS (
            SELECT 1 FROM public.workout_templates wt
            WHERE wt.id = template_id
            AND wt.org_id = (SELECT org_id FROM public.profiles WHERE id = auth.uid())
        )
    );

CREATE POLICY "Users can manage their own template exercises."
    ON public.template_exercises FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.workout_templates wt
            WHERE wt.id = template_id
            AND wt.user_id = auth.uid()
        )
    );

-- 6. RLS for Template Sets
ALTER TABLE public.template_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view template sets in their org."
    ON public.template_sets FOR SELECT
    USING ( 
        EXISTS (
            SELECT 1 FROM public.template_exercises te
            JOIN public.workout_templates wt ON wt.id = te.template_id
            WHERE te.id = template_exercise_id
            AND wt.org_id = (SELECT org_id FROM public.profiles WHERE id = auth.uid())
        )
    );

CREATE POLICY "Users can manage their own template sets."
    ON public.template_sets FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.template_exercises te
            JOIN public.workout_templates wt ON wt.id = te.template_id
            WHERE te.id = template_exercise_id
            AND wt.user_id = auth.uid()
        )
    );

