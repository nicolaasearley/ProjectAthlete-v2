-- ============================================
-- ProjectAthlete v2 - Database Migration 007
-- Challenges & Badges
-- ============================================

-- Run this AFTER 006_community.sql

-- ============================================
-- CHALLENGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES public.organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  metric TEXT NOT NULL, -- e.g., 'pullups', 'steps', 'miles'
  metric_unit TEXT NOT NULL, -- e.g., 'count', 'miles', 'minutes'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (end_date > start_date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_challenges_org_id ON public.challenges(org_id);
CREATE INDEX IF NOT EXISTS idx_challenges_dates ON public.challenges(start_date, end_date);

-- Enable RLS
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view challenges in their org"
  ON public.challenges FOR SELECT
  USING (org_id = get_user_org_id());

CREATE POLICY "Coaches can create challenges"
  ON public.challenges FOR INSERT
  WITH CHECK (
    org_id = get_user_org_id()
    AND is_coach_or_admin()
    AND created_by = auth.uid()
  );

CREATE POLICY "Coaches can update challenges"
  ON public.challenges FOR UPDATE
  USING (org_id = get_user_org_id() AND is_coach_or_admin());

CREATE POLICY "Coaches can delete challenges"
  ON public.challenges FOR DELETE
  USING (org_id = get_user_org_id() AND is_coach_or_admin());

-- Update trigger
CREATE TRIGGER update_challenges_updated_at
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- CHALLENGE LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.challenge_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  value DECIMAL(10,2) NOT NULL CHECK (value > 0),
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_challenge_logs_challenge_id ON public.challenge_logs(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_logs_user_id ON public.challenge_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_logs_logged_at ON public.challenge_logs(logged_at DESC);

-- Enable RLS
ALTER TABLE public.challenge_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view logs for challenges in their org"
  ON public.challenge_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.challenges
      WHERE challenges.id = challenge_logs.challenge_id
      AND challenges.org_id = get_user_org_id()
    )
  );

CREATE POLICY "Users can log their own progress during active challenges"
  ON public.challenge_logs FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.challenges
      WHERE challenges.id = challenge_logs.challenge_id
      AND challenges.org_id = get_user_org_id()
      AND CURRENT_DATE BETWEEN challenges.start_date AND challenges.end_date
    )
  );

CREATE POLICY "Users can update their own logs"
  ON public.challenge_logs FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own logs"
  ON public.challenge_logs FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- BADGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT NOT NULL, -- emoji or icon identifier
  badge_type TEXT NOT NULL CHECK (badge_type IN (
    'challenge_participation', 
    'challenge_winner', 
    'milestone', 
    'special'
  )),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (badges are global, readable by all)
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view badges"
  ON public.badges FOR SELECT
  USING (TRUE);

-- ============================================
-- USER BADGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id),
  challenge_id UUID REFERENCES public.challenges(id),
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id, challenge_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON public.user_badges(badge_id);

-- Enable RLS
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view badges in their org"
  ON public.user_badges FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = user_badges.user_id
      AND profiles.org_id = get_user_org_id()
    )
    OR user_id = auth.uid()
  );

-- ============================================
-- SEED BADGES
-- ============================================
INSERT INTO public.badges (name, description, icon, badge_type) VALUES
('First Challenge', 'Participated in your first challenge', '🎯', 'milestone'),
('Challenge Champion', 'Won a monthly challenge', '🏆', 'challenge_winner'),
('Runner Up', 'Finished second in a challenge', '🥈', 'challenge_winner'),
('Third Place', 'Finished third in a challenge', '🥉', 'challenge_winner'),
('Consistent Logger', 'Logged progress 7 days in a row', '📅', 'milestone'),
('Community Contributor', 'Had a workout submission approved', '📝', 'milestone'),
('Century Club', 'Logged over 100 workouts', '💯', 'milestone'),
('Early Adopter', 'Joined during beta', '🌟', 'special'),
('Challenge Creator', 'Created a community challenge', '🎨', 'special')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get leaderboard for a challenge
CREATE OR REPLACE FUNCTION get_challenge_leaderboard(p_challenge_id UUID)
RETURNS TABLE (
  rank BIGINT,
  user_id UUID,
  display_name TEXT,
  is_anonymous BOOLEAN,
  total_value DECIMAL,
  log_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ROW_NUMBER() OVER (ORDER BY SUM(cl.value) DESC) AS rank,
    cl.user_id,
    CASE 
      WHEN p.is_anonymous_on_leaderboards THEN 'Anonymous'
      ELSE p.display_name
    END AS display_name,
    p.is_anonymous_on_leaderboards AS is_anonymous,
    SUM(cl.value)::DECIMAL AS total_value,
    COUNT(cl.id) AS log_count
  FROM public.challenge_logs cl
  JOIN public.profiles p ON p.id = cl.user_id
  WHERE cl.challenge_id = p_challenge_id
  GROUP BY cl.user_id, p.display_name, p.is_anonymous_on_leaderboards
  ORDER BY total_value DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Get user's challenge progress
CREATE OR REPLACE FUNCTION get_user_challenge_progress(p_challenge_id UUID, p_user_id UUID DEFAULT NULL)
RETURNS TABLE (
  total_value DECIMAL,
  log_count BIGINT,
  last_logged TIMESTAMPTZ,
  rank BIGINT
) AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := COALESCE(p_user_id, auth.uid());
  
  RETURN QUERY
  WITH user_total AS (
    SELECT 
      SUM(value) AS total,
      COUNT(*) AS logs,
      MAX(logged_at) AS last_log
    FROM public.challenge_logs
    WHERE challenge_id = p_challenge_id
    AND user_id = v_user_id
  ),
  rankings AS (
    SELECT 
      user_id,
      ROW_NUMBER() OVER (ORDER BY SUM(value) DESC) AS user_rank
    FROM public.challenge_logs
    WHERE challenge_id = p_challenge_id
    GROUP BY user_id
  )
  SELECT 
    ut.total,
    ut.logs,
    ut.last_log,
    r.user_rank
  FROM user_total ut
  LEFT JOIN rankings r ON r.user_id = v_user_id;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Award badge to user
CREATE OR REPLACE FUNCTION award_badge(
  p_user_id UUID,
  p_badge_name TEXT,
  p_challenge_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_badge_id UUID;
BEGIN
  SELECT id INTO v_badge_id FROM public.badges WHERE name = p_badge_name;
  
  IF v_badge_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  INSERT INTO public.user_badges (user_id, badge_id, challenge_id)
  VALUES (p_user_id, v_badge_id, p_challenge_id)
  ON CONFLICT (user_id, badge_id, challenge_id) DO NOTHING;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- AUTO-AWARD PARTICIPATION BADGE
-- ============================================
CREATE OR REPLACE FUNCTION auto_award_participation_badge()
RETURNS TRIGGER AS $$
DECLARE
  v_is_first_log BOOLEAN;
  v_is_first_challenge BOOLEAN;
BEGIN
  -- Check if this is user's first log for this challenge
  SELECT COUNT(*) = 1 INTO v_is_first_log
  FROM public.challenge_logs
  WHERE challenge_id = NEW.challenge_id
  AND user_id = NEW.user_id;
  
  IF v_is_first_log THEN
    -- Check if this is user's first challenge ever
    SELECT COUNT(*) = 1 INTO v_is_first_challenge
    FROM (
      SELECT DISTINCT challenge_id
      FROM public.challenge_logs
      WHERE user_id = NEW.user_id
    ) sub;
    
    IF v_is_first_challenge THEN
      PERFORM award_badge(NEW.user_id, 'First Challenge', NEW.challenge_id);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_challenge_log_created
  AFTER INSERT ON public.challenge_logs
  FOR EACH ROW EXECUTE FUNCTION auto_award_participation_badge();
