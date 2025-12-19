-- ============================================
-- ProjectAthlete v2 - Database Migration 001
-- Foundation: Extensions, Helper Functions, Organizations, Profiles
-- ============================================

-- Run this FIRST in Supabase SQL Editor

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ORGANIZATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  join_code TEXT UNIQUE, -- Added for registration access control
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add column if it doesn't exist (for existing databases)
ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS join_code TEXT UNIQUE;

-- Insert default organization
INSERT INTO public.organizations (name, slug, join_code) 
VALUES ('ProjectAthlete', 'projectathlete', 'ATHLETE2025')
ON CONFLICT (slug) DO UPDATE SET join_code = 'ATHLETE2025';

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES public.organizations(id),
  role TEXT NOT NULL DEFAULT 'athlete' CHECK (role IN ('athlete', 'coach', 'admin')),
  display_name TEXT,
  avatar_url TEXT,
  is_anonymous_on_leaderboards BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_org_id ON public.profiles(org_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get current user's org_id from profile
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
  SELECT org_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Get current user's role from profile
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(role, 'athlete') FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Check if user is coach or admin
CREATE OR REPLACE FUNCTION is_coach_or_admin()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() IN ('coach', 'admin');
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() = 'admin';
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Validate an organization join code and return the org_id
CREATE OR REPLACE FUNCTION validate_org_code(p_code TEXT)
RETURNS TABLE (org_id UUID, org_name TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT id, name
  FROM public.organizations
  WHERE join_code = p_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own organization"
  ON public.organizations FOR SELECT
  USING (id = get_user_org_id());

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view profiles in their org"
  ON public.profiles FOR SELECT
  USING (org_id = get_user_org_id());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ============================================
-- PROFILE CREATION TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  target_org_id UUID;
  metadata_org_code TEXT;
BEGIN
  -- 1. Try to get org_id from explicit metadata (passed via state in OAuth or direct)
  metadata_org_code := NEW.raw_user_meta_data->>'org_code';
  
  IF metadata_org_code IS NOT NULL THEN
    SELECT id INTO target_org_id 
    FROM public.organizations 
    WHERE join_code = metadata_org_code 
    LIMIT 1;
  END IF;

  -- 2. Fallback to default org if no valid code provided
  IF target_org_id IS NULL THEN
    SELECT id INTO target_org_id 
    FROM public.organizations 
    WHERE slug = 'projectathlete' 
    LIMIT 1;
  END IF;
  
  -- Create profile for new user
  INSERT INTO public.profiles (id, org_id, display_name)
  VALUES (
    NEW.id,
    target_org_id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger (drop first if exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify setup:
-- SELECT * FROM organizations;
-- SELECT * FROM profiles;
