-- ============================================
-- ProjectAthlete v2 - Database Migration 016
-- Admin Notifications: Realtime & Webhooks
-- ============================================

-- 1. Enable Realtime for community_workouts
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_workouts;

-- 2. Create a notification log table for future use (optional but good for history)
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES public.organizations(id),
  type TEXT NOT NULL, -- e.g., 'new_submission'
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for notifications
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view notifications for their org"
  ON public.admin_notifications FOR SELECT
  USING (
    org_id = get_user_org_id()
    AND is_coach_or_admin()
  );

-- 3. Trigger function to create a notification (and potentially trigger email/webhook)
CREATE OR REPLACE FUNCTION public.handle_new_community_workout()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into notification log
  INSERT INTO public.admin_notifications (org_id, type, message, link)
  VALUES (
    NEW.org_id,
    'new_submission',
    'A new community workout "' || NEW.title || '" has been submitted for approval.',
    '/admin/submissions'
  );

  -- NOTE: To enable email notifications, you should:
  -- 1. Deploy the Supabase Edge Function in /supabase/functions/send-submission-email
  -- 2. Create a Database Webhook in the Supabase Dashboard:
  --    - Table: community_workouts
  --    - Events: INSERT
  --    - Filter: status = 'pending'
  --    - Target: Edge Function (send-submission-email)

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_community_workout_submitted ON public.community_workouts;
CREATE TRIGGER on_community_workout_submitted
  AFTER INSERT ON public.community_workouts
  FOR EACH ROW
  WHEN (NEW.status = 'pending')
  EXECUTE FUNCTION public.handle_new_community_workout();

