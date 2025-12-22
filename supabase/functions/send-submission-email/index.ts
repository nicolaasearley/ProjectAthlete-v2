// Follow the Supabase Edge Functions guide to deploy this:
// https://supabase.com/docs/guides/functions

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  const payload = await req.json()
  const { record } = payload
  
  // 1. Create Supabase client
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // 2. Fetch admin emails for the organization
  const { data: admins } = await supabase
    .from('profiles')
    .select('display_name, id')
    .eq('org_id', record.org_id)
    .in('role', ['admin', 'coach'])

  // Fetch email addresses from auth.users (requires service_role)
  const adminIds = admins?.map(a => a.id) || []
  const { data: { users } } = await supabase.auth.admin.listUsers()
  const adminEmails = users
    .filter(u => adminIds.includes(u.id))
    .map(u => u.email)

  if (adminEmails.length === 0) {
    return new Response(JSON.stringify({ message: 'No admins found to notify' }), { status: 200 })
  }

  // 3. Send email via Resend (or your preferred provider)
  // You can install 'resend' via esm.sh
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'ProjectAthlete <notifications@projectathlete.com>',
      to: adminEmails,
      subject: 'New Community Workout Submission',
      html: `
        <h2>New Submission for Review</h2>
        <p>A new community workout <strong>"${record.title}"</strong> has been submitted.</p>
        <p><a href="${Deno.env.get('PUBLIC_APP_URL')}/admin/submissions">Click here to review the submission</a></p>
      `,
    }),
  })

  const result = await res.json()

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})

