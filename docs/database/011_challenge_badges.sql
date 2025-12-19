-- ============================================
-- ProjectAthlete v2 - Database Migration 011
-- Custom Challenge Badges
-- ============================================

-- 1. Add badge_image_url to challenges table
ALTER TABLE public.challenges 
  ADD COLUMN IF NOT EXISTS badge_image_url TEXT;

-- 2. Update existing challenges to use default badges if needed
-- (Optional: logic to link existing challenges to predefined badge images)

