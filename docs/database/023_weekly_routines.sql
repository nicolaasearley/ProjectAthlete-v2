-- ============================================
-- ProjectAthlete v2 - Database Migration 023
-- Weekly Routines Feature
-- ============================================

-- Ensure updated_at trigger function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 1. weekly_routines
CREATE TABLE IF NOT EXISTS public.weekly_routines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES public.organizations(id),
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for weekly_routines
CREATE INDEX IF NOT EXISTS idx_weekly_routines_user_id ON public.weekly_routines(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_routines_org_id ON public.weekly_routines(org_id);

-- Trigger for weekly_routines updated_at
DROP TRIGGER IF EXISTS update_weekly_routines_updated_at ON public.weekly_routines;
CREATE TRIGGER update_weekly_routines_updated_at
    BEFORE UPDATE ON public.weekly_routines
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- 2. routine_days
CREATE TABLE IF NOT EXISTS public.routine_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    routine_id UUID NOT NULL REFERENCES public.weekly_routines(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(routine_id, day_of_week)
);

-- Index for routine_days
CREATE INDEX IF NOT EXISTS idx_routine_days_routine_id ON public.routine_days(routine_id);

-- 3. routine_blocks
CREATE TABLE IF NOT EXISTS public.routine_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_id UUID NOT NULL REFERENCES public.routine_days(id) ON DELETE CASCADE,
    block_type TEXT NOT NULL CHECK (block_type IN ('warm_up', 'plyometrics', 'main_lift', 'accessory', 'calisthenics', 'general_cardio', 'running', 'engine_work', 'yoga_mobility', 'hyrox', 'other')),
    order_index INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for routine_blocks
CREATE INDEX IF NOT EXISTS idx_routine_blocks_day_id ON public.routine_blocks(day_id);

-- 4. routine_block_configs
CREATE TABLE IF NOT EXISTS public.routine_block_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    block_id UUID NOT NULL REFERENCES public.routine_blocks(id) ON DELETE CASCADE,
    config_type TEXT NOT NULL CHECK (config_type IN ('main_lift_type', 'muscle_group')),
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for routine_block_configs
CREATE INDEX IF NOT EXISTS idx_routine_block_configs_block_id ON public.routine_block_configs(block_id);


-- ============================================
-- RLS POLICIES
-- ============================================

-- weekly_routines
ALTER TABLE public.weekly_routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own routines"
    ON public.weekly_routines FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own routines"
    ON public.weekly_routines FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own routines"
    ON public.weekly_routines FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own routines"
    ON public.weekly_routines FOR DELETE
    USING (user_id = auth.uid());

CREATE POLICY "Coaches and admins can view routines in their org"
    ON public.weekly_routines FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid()
            AND org_id = weekly_routines.org_id
            AND role IN ('coach', 'admin')
        )
    );

-- routine_days
ALTER TABLE public.routine_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view days of their routines"
    ON public.routine_days FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.weekly_routines
            WHERE id = routine_days.routine_id
            AND (user_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.profiles
                WHERE id = auth.uid()
                AND org_id = weekly_routines.org_id
                AND role IN ('coach', 'admin')
            ))
        )
    );

CREATE POLICY "Users can manage days of their routines"
    ON public.routine_days FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.weekly_routines
            WHERE id = routine_days.routine_id
            AND user_id = auth.uid()
        )
    );

-- routine_blocks
ALTER TABLE public.routine_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view blocks of their routines"
    ON public.routine_blocks FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.routine_days
            JOIN public.weekly_routines ON weekly_routines.id = routine_days.routine_id
            WHERE routine_days.id = routine_blocks.day_id
            AND (user_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.profiles
                WHERE id = auth.uid()
                AND org_id = weekly_routines.org_id
                AND role IN ('coach', 'admin')
            ))
        )
    );

CREATE POLICY "Users can manage blocks of their routines"
    ON public.routine_blocks FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.routine_days
            JOIN public.weekly_routines ON weekly_routines.id = routine_days.routine_id
            WHERE routine_days.id = routine_blocks.day_id
            AND user_id = auth.uid()
        )
    );

-- routine_block_configs
ALTER TABLE public.routine_block_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view configs for their blocks"
    ON public.routine_block_configs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.routine_blocks
            JOIN public.routine_days ON routine_days.id = routine_blocks.day_id
            JOIN public.weekly_routines ON weekly_routines.id = routine_days.routine_id
            WHERE routine_blocks.id = routine_block_configs.block_id
            AND (user_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.profiles
                WHERE id = auth.uid()
                AND org_id = weekly_routines.org_id
                AND role IN ('coach', 'admin')
            ))
        )
    );

CREATE POLICY "Users can manage configs for their blocks"
    ON public.routine_block_configs FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.routine_blocks
            JOIN public.routine_days ON routine_days.id = routine_blocks.day_id
            JOIN public.weekly_routines ON weekly_routines.id = routine_days.routine_id
            WHERE routine_blocks.id = routine_block_configs.block_id
            AND user_id = auth.uid()
        )
    );
