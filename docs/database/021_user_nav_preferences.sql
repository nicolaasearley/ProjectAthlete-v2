-- ============================================
-- ProjectAthlete v2 - Database Migration 021
-- User Nav Preferences
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_nav_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nav_items TEXT[] DEFAULT ARRAY['/', '/workouts', '/stats', '/challenges', '/community'],
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_nav_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own nav preferences"
  ON public.user_nav_preferences FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own nav preferences"
  ON public.user_nav_preferences FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own nav preferences update"
  ON public.user_nav_preferences FOR UPDATE
  USING (user_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_user_nav_preferences_updated_at
  BEFORE UPDATE ON public.user_nav_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

