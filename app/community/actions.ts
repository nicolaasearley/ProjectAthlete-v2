'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { CommunityWorkoutFormData } from '@/types/database'

export async function submitWorkout(formData: FormData | CommunityWorkoutFormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: profileData } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()
  
  if (!profileData) throw new Error('Profile not found')
  
  const profile = profileData as { org_id: string }

  // Extract data from FormData or use directly if CommunityWorkoutFormData
  let data: CommunityWorkoutFormData
  if (formData instanceof FormData) {
    data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      workout_type: formData.get('workout_type') as any,
      time_cap_minutes: formData.get('time_cap_minutes') ? parseInt(formData.get('time_cap_minutes') as string) : null,
    }
  } else {
    data = formData
  }
  
  const { error } = await (supabase
    .from('community_workouts') as any)
    .insert({
      org_id: profile.org_id,
      author_id: user.id,
      title: data.title,
      description: data.description,
      workout_type: data.workout_type,
      time_cap_minutes: data.time_cap_minutes,
      status: 'pending',
    })
  
  if (error) throw error
  
  revalidatePath('/community')
  redirect('/community?submitted=true')
}

export async function updateWorkout(id: string, formData: FormData | CommunityWorkoutFormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Extract data
  let data: CommunityWorkoutFormData
  if (formData instanceof FormData) {
    data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      workout_type: formData.get('workout_type') as any,
      time_cap_minutes: formData.get('time_cap_minutes') ? parseInt(formData.get('time_cap_minutes') as string) : null,
    }
  } else {
    data = formData
  }
  
  const { error } = await (supabase
    .from('community_workouts') as any)
    .update({
      title: data.title,
      description: data.description,
      workout_type: data.workout_type,
      time_cap_minutes: data.time_cap_minutes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
  
  if (error) throw error
  
  revalidatePath('/community')
  revalidatePath(`/community/${id}`)
  redirect(`/community/${id}`)
}

export async function deleteWorkout(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { error } = await (supabase
    .from('community_workouts') as any)
    .delete()
    .eq('id', id)
  
  if (error) throw error
  
  revalidatePath('/community')
  redirect('/community')
}

export async function addComment(workoutId: string, content: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { error } = await (supabase
    .from('workout_comments') as any)
    .insert({
      workout_id: workoutId,
      user_id: user.id,
      content,
    })
  
  if (error) throw error
  
  revalidatePath(`/community/${workoutId}`)
}

export async function deleteComment(commentId: string, workoutId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { error } = await (supabase
    .from('workout_comments') as any)
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id)
  
  if (error) throw error
  
  revalidatePath(`/community/${workoutId}`)
}

export async function toggleReaction(workoutId: string, reactionType: 'like' | 'fire' | 'strong' | 'respect') {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  // Check if reaction exists
  const { data: existing } = await (supabase
    .from('workout_reactions') as any)
    .select('id')
    .eq('workout_id', workoutId)
    .eq('user_id', user.id)
    .eq('reaction_type', reactionType)
    .single()
  
  if (existing) {
    // Remove it
    await (supabase
      .from('workout_reactions') as any)
      .delete()
      .eq('id', existing.id)
  } else {
    // Add it
    await (supabase
      .from('workout_reactions') as any)
      .insert({
        workout_id: workoutId,
        user_id: user.id,
        reaction_type: reactionType,
      })
  }
  
  revalidatePath(`/community/${workoutId}`)
}

