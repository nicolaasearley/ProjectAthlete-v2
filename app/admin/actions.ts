'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveWorkout(id: string) {
  const supabase = await createClient()

  const { data, error } = await (supabase.rpc as any)('approve_community_workout', {
    p_workout_id: id,
  })

  if (error) throw error

  revalidatePath('/admin/submissions')
  revalidatePath('/community')
  return data
}

export async function rejectWorkout(id: string, reason?: string) {
  const supabase = await createClient()

  const { data, error } = await (supabase.rpc as any)('reject_community_workout', {
    p_workout_id: id,
    p_reason: reason,
  })

  if (error) throw error

  revalidatePath('/admin/submissions')
  return data
}

export async function toggleFeatured(id: string) {
  const supabase = await createClient()

  const { data, error } = await (supabase.rpc as any)('toggle_workout_featured', {
    p_workout_id: id,
  })

  if (error) throw error

  revalidatePath('/community')
  revalidatePath(`/community/${id}`)
  return data
}

export async function updateUserRole(userId: string, role: 'athlete' | 'coach' | 'admin') {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: isAdmin } = await (supabase.rpc as any)('is_admin')
  if (!isAdmin) throw new Error('Unauthorized')

  const { error } = await (supabase
    .from('profiles') as any)
    .update({ role })
    .eq('id', userId)

  if (error) throw error

  revalidatePath('/admin/users')
}

export async function sendMassEmail(roles: string[], subject: string, body: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: isAdmin } = await (supabase.rpc as any)('is_admin')
  if (!isAdmin) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id, display_name')
    .eq('id', user.id)
    .single()

  if (!profile) throw new Error('Profile not found')

  // Call the Edge Function
  // We use the supabase client's invoke method
  const { data, error } = await supabase.functions.invoke('send-mass-email', {
    body: {
      org_id: (profile as any).org_id,
      roles,
      subject,
      body,
      from_name: (profile as any).display_name
    }
  })

  if (error) throw error

  // Also log it manually here since the edge function won't have the user session for 'sent_by'
  await (supabase.from('email_log') as any).insert({
    org_id: (profile as any).org_id,
    sent_by: user.id,
    recipient_roles: roles,
    recipient_count: data.count || 0,
    subject,
    body
  })

  return data
}

