-- ============================================
-- ProjectAthlete v2 - Database Migration 022
-- Email Log for Mass Emails
-- ============================================

CREATE TABLE IF NOT EXISTS public.email_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  sent_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_roles TEXT[] NOT NULL,
  recipient_count INTEGER NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view email logs for their org"
  ON public.email_log FOR SELECT
  USING (org_id = get_user_org_id() AND is_admin());

CREATE POLICY "Admins can insert email logs for their org"
  ON public.email_log FOR INSERT
  WITH CHECK (org_id = get_user_org_id() AND is_admin());

