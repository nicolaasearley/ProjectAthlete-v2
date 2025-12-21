'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ExerciseCategory } from '@/types/database'

export async function createCustomExercise(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()
  
  if (!profile) throw new Error('Profile not found')
  
  const name = formData.get('name') as string
  const category = formData.get('category') as ExerciseCategory
  const default_metric = formData.get('default_metric') as string
  
  if (!name || !category) {
    throw new Error('Name and category are required')
  }
  
  const { error } = await (supabase
    .from('exercises') as any)
    .insert({
      name: name.trim(),
      category,
      default_metric,
      is_global: false,
      org_id: (profile as any).org_id,
    })
  
  if (error) {
    if (error.code === '23505') {
      throw new Error('An exercise with this name already exists')
    }
    throw error
  }
  
  revalidatePath('/exercises')
  redirect('/exercises')
}

export async function toggleFavoriteExercise(exerciseId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  // Check if already favorited
  const { data: existing } = await supabase
    .from('user_favorite_exercises')
    .select('id')
    .eq('user_id', user.id)
    .eq('exercise_id', exerciseId)
    .single()
  
  if (existing) {
    // Unfavorite
    await supabase
      .from('user_favorite_exercises')
      .delete()
      .eq('id', existing.id)
  } else {
    // Favorite
    await supabase
      .from('user_favorite_exercises')
      .insert({
        user_id: user.id,
        exercise_id: exerciseId
      })
  }
  
  revalidatePath('/exercises')
}

