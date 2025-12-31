'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ExerciseCategory } from '@/types/database'

export async function createCustomExercise(formData: FormData) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: profile } = await (supabase
      .from('profiles') as any)
      .select('org_id')
      .eq('id', user.id)
      .single()

    if (!profile) return { error: 'Profile not found' }

    const name = (formData.get('name') as string)?.trim()
    const category = formData.get('category') as ExerciseCategory
    const default_metric = formData.get('default_metric') as string

    if (!name || !category) {
      return { error: 'Name and category are required' }
    }

    const { error } = await (supabase
      .from('exercises') as any)
      .insert({
        name,
        category,
        default_metric,
        is_global: false,
        org_id: (profile as any).org_id,
      })

    if (error) {
      if (error.code === '23505') {
        return { error: 'An exercise with this name already exists' }
      }
      return { error: error.message }
    }

    revalidatePath('/exercises')
    return { success: true }
  } catch (error: any) {
    console.error('Error creating exercise:', error)
    return { error: error.message || 'Failed to create exercise' }
  }
}

export async function toggleFavoriteExercise(exerciseId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Check if already favorited - use type assertion for new table
  const { data: existing } = await (supabase as any)
    .from('user_favorite_exercises')
    .select('id')
    .eq('user_id', user.id)
    .eq('exercise_id', exerciseId)
    .single()

  if (existing) {
    // Unfavorite
    await (supabase as any)
      .from('user_favorite_exercises')
      .delete()
      .eq('id', existing.id)
  } else {
    // Favorite
    await (supabase as any)
      .from('user_favorite_exercises')
      .insert({
        user_id: user.id,
        exercise_id: exerciseId
      })
  }

  revalidatePath('/exercises')
}

