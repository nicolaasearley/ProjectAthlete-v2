-- ============================================
-- ProjectAthlete v2 - Database Migration 012
-- Activity Feed
-- ============================================

-- 1. Feed Posts Table
CREATE TABLE IF NOT EXISTS public.feed_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    post_type TEXT NOT NULL CHECK (post_type IN ('text', 'pr', 'achievement', 'milestone')),
    content TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Feed Reactions Table
CREATE TABLE IF NOT EXISTS public.feed_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.feed_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(post_id, user_id, reaction_type)
);

-- 3. RLS for Feed Posts
ALTER TABLE public.feed_posts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view feed posts in their org.') THEN
        CREATE POLICY "Users can view feed posts in their org."
            ON public.feed_posts FOR SELECT
            USING ( org_id = (SELECT org_id FROM public.profiles WHERE id = auth.uid()) );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create feed posts in their org.') THEN
        CREATE POLICY "Users can create feed posts in their org."
            ON public.feed_posts FOR INSERT
            WITH CHECK ( org_id = (SELECT org_id FROM public.profiles WHERE id = auth.uid()) );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own feed posts.') THEN
        CREATE POLICY "Users can update their own feed posts."
            ON public.feed_posts FOR UPDATE
            USING ( user_id = auth.uid() );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own feed posts.') THEN
        CREATE POLICY "Users can delete their own feed posts."
            ON public.feed_posts FOR DELETE
            USING ( user_id = auth.uid() );
    END IF;
END $$;

-- 4. RLS for Feed Reactions
ALTER TABLE public.feed_reactions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view reactions in their org.') THEN
        CREATE POLICY "Users can view reactions in their org."
            ON public.feed_reactions FOR SELECT
            USING ( 
                EXISTS (
                    SELECT 1 FROM public.feed_posts fp
                    WHERE fp.id = post_id
                    AND fp.org_id = (SELECT org_id FROM public.profiles WHERE id = auth.uid())
                )
            );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can react to posts in their org.') THEN
        CREATE POLICY "Users can react to posts in their org."
            ON public.feed_reactions FOR INSERT
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM public.feed_posts fp
                    WHERE fp.id = post_id
                    AND fp.org_id = (SELECT org_id FROM public.profiles WHERE id = auth.uid())
                )
            );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can remove their own reactions.') THEN
        CREATE POLICY "Users can remove their own reactions."
            ON public.feed_reactions FOR DELETE
            USING ( user_id = auth.uid() );
    END IF;
END $$;

-- 5. Helper Function to get feed
CREATE OR REPLACE FUNCTION get_activity_feed(p_org_id UUID, p_limit INTEGER DEFAULT 50, p_offset INTEGER DEFAULT 0)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    display_name TEXT,
    avatar_url TEXT,
    post_type TEXT,
    content TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ,
    reaction_counts JSONB,
    user_reactions TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        fp.id,
        fp.user_id,
        p.display_name,
        p.avatar_url,
        fp.post_type,
        fp.content,
        fp.metadata,
        fp.created_at,
        COALESCE(
            (SELECT jsonb_object_agg(reaction_type, count)
             FROM (
                SELECT fr.reaction_type, COUNT(*) as count
                FROM public.feed_reactions fr
                WHERE fr.post_id = fp.id
                GROUP BY fr.reaction_type
             ) r
            ), '{}'::jsonb
        ) as reaction_counts,
        COALESCE(
            (SELECT array_agg(fr.reaction_type)
             FROM public.feed_reactions fr
             WHERE fr.post_id = fp.id AND fr.user_id = auth.uid()
            ), ARRAY[]::TEXT[]
        ) as user_reactions
    FROM public.feed_posts fp
    JOIN public.profiles p ON p.id = fp.user_id
    WHERE fp.org_id = p_org_id
    ORDER BY fp.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. PR Detection and Feed Posting
CREATE OR REPLACE FUNCTION check_and_post_prs(p_session_id UUID)
RETURNS VOID AS $$
DECLARE
    v_user_id UUID;
    v_org_id UUID;
    v_exercise_id UUID;
    v_exercise_name TEXT;
    v_max_weight DECIMAL;
    v_reps INTEGER;
    v_is_pr BOOLEAN;
    v_row RECORD;
BEGIN
    -- Get session info
    SELECT user_id, org_id INTO v_user_id, v_org_id 
    FROM public.workout_sessions WHERE id = p_session_id;

    -- Check each exercise in the session - only pick the single best set per exercise
    FOR v_row IN 
        SELECT DISTINCT ON (we.exercise_id)
            we.exercise_id, 
            e.name as exercise_name, 
            wsets.weight as session_max, 
            wsets.reps
        FROM public.workout_exercises we
        JOIN public.exercises e ON e.id = we.exercise_id
        JOIN public.workout_sets wsets ON wsets.workout_exercise_id = we.id
        WHERE we.session_id = p_session_id AND wsets.weight > 0
        ORDER BY we.exercise_id, wsets.weight DESC, wsets.reps DESC
    LOOP
        -- Check if this weight/reps combo is better than previous best
        SELECT NOT EXISTS (
            SELECT 1 FROM public.workout_sessions ws
            JOIN public.workout_exercises we2 ON we2.session_id = ws.id
            JOIN public.workout_sets wsets2 ON wsets2.workout_exercise_id = we2.id
            WHERE ws.user_id = v_user_id 
              AND we2.exercise_id = v_row.exercise_id
              AND ws.id != p_session_id
              AND (wsets2.weight > v_row.session_max OR (wsets2.weight = v_row.session_max AND wsets2.reps >= v_row.reps))
        ) INTO v_is_pr;

        IF v_is_pr AND NOT EXISTS (
            SELECT 1 FROM public.feed_posts 
            WHERE user_id = v_user_id 
              AND post_type = 'pr' 
              AND metadata->>'exercise_name' = v_row.exercise_name
              AND metadata->>'session_id' = p_session_id::text
        ) THEN
            -- Post to feed
            INSERT INTO public.feed_posts (org_id, user_id, post_type, metadata)
            VALUES (
                v_org_id, 
                v_user_id, 
                'pr', 
                jsonb_build_object(
                    'exercise_name', v_row.exercise_name,
                    'weight', v_row.session_max,
                    'reps', v_row.reps,
                    'unit', 'lbs',
                    'session_id', p_session_id
                )
            );
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Trigger for Achievements (when a badge is awarded)
CREATE OR REPLACE FUNCTION post_achievement_to_feed()
RETURNS TRIGGER AS $$
DECLARE
    v_org_id UUID;
    v_challenge_name TEXT;
BEGIN
    -- Get org_id from profile
    SELECT org_id INTO v_org_id FROM public.profiles WHERE id = NEW.user_id;

    -- Get challenge name if it exists
    IF NEW.challenge_id IS NOT NULL THEN
        SELECT name INTO v_challenge_name FROM public.challenges WHERE id = NEW.challenge_id;
        
        INSERT INTO public.feed_posts (org_id, user_id, post_type, metadata)
        VALUES (
            v_org_id, 
            NEW.user_id, 
            'achievement', 
            jsonb_build_object(
                'challenge_name', v_challenge_name,
                'badge_id', NEW.badge_id
            )
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_badge_awarded ON public.user_badges;
CREATE TRIGGER on_badge_awarded
    AFTER INSERT ON public.user_badges
    FOR EACH ROW
    EXECUTE FUNCTION post_achievement_to_feed();
