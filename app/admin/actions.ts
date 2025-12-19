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
  
  const { data: isAdmin } = await (supabase.rpc as any)('is_coach_or_admin')
  if (!isAdmin) throw new Error('Unauthorized')

  const { error } = await (supabase
    .from('profiles') as any)
    .update({ role })
    .eq('id', userId)
  
  if (error) throw error
  
  revalidatePath('/admin/users')
}

