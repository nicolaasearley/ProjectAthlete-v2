-- ============================================
-- ProjectAthlete v2 - Database Migration 009
-- Storage Buckets and Policies
-- ============================================

-- Create 'avatars' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'avatars', 'avatars', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'avatars'
);

-- Policies for 'avatars' bucket
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

CREATE POLICY "Users can upload their own avatar."
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own avatar."
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create 'badges' bucket for custom challenge badges
INSERT INTO storage.buckets (id, name, public)
SELECT 'badges', 'badges', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'badges'
);

-- Policies for 'badges' bucket
CREATE POLICY "Badge images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'badges' );

CREATE POLICY "Admins can upload badges."
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'badges' AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND (role = 'admin' OR role = 'coach')
    )
  );

