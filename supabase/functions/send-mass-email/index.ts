import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  try {
    const { org_id, roles, subject, body, from_name } = await req.json()
    
    // 1. Create Supabase client with SERVICE ROLE key
    const supabase = createClient(
      SUPABASE_URL ?? '',
      SUPABASE_SERVICE_ROLE_KEY ?? ''
    )

    // 2. Fetch user IDs for the organization and roles from profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('org_id', org_id)
      .in('role', roles)

    if (profileError) throw profileError
    const userIds = profiles?.map(p => p.id) || []

    if (userIds.length === 0) {
      return new Response(JSON.stringify({ message: 'No users found matching the selected roles' }), { status: 200 })
    }

    // 3. Fetch email addresses from auth.users (requires service_role)
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
    if (authError) throw authError

    const recipientEmails = users
      .filter(u => userIds.includes(u.id))
      .map(u => u.email)
      .filter(Boolean) as string[]

    if (recipientEmails.length === 0) {
      return new Response(JSON.stringify({ message: 'No email addresses found' }), { status: 200 })
    }

    // 4. Send emails via Resend
    // For large lists, Resend recommends using their Batch API or Bcc
    // For now, we'll use a single send with Bcc to keep it simple and efficient
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `${from_name || 'ProjectAthlete'} <notifications@projectathlete.com>`,
        to: ['notifications@projectathlete.com'], // Sent to self, others in Bcc
        bcc: recipientEmails,
        subject: subject,
        html: body.replace(/\n/g, '<br/>'),
      }),
    })

    const resData = await res.json()
    
    if (!res.ok) {
      throw new Error(`Resend Error: ${JSON.stringify(resData)}`)
    }

    // 5. Log the email
    await supabase.from('email_log').insert({
      org_id,
      sent_by: (await supabase.auth.getUser()).data.user?.id, // Note: this might not work if called from edge function without user session, but we'll handle it in the action
      recipient_roles: roles,
      recipient_count: recipientEmails.length,
      subject,
      body
    })

    return new Response(JSON.stringify({ success: true, count: recipientEmails.length }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    console.error("Mass Email Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

