'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveWorkout(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('approve_community_workout', {
    p_workout_id: id,
  })
  
  if (error) throw error
  
  revalidatePath('/admin/submissions')
  revalidatePath('/community')
  return data
}

export async function rejectWorkout(id: string, reason?: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('reject_community_workout', {
    p_workout_id: id,
    p_reason: reason,
  })
  
  if (error) throw error
  
  revalidatePath('/admin/submissions')
  return data
}

export async function toggleFeatured(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('toggle_workout_featured', {
    p_workout_id: id,
  })
  
  if (error) throw error
  
  revalidatePath('/community')
  revalidatePath(`/community/${id}`)
  return data
}

