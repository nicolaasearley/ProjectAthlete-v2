'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { WorkoutFormData } from '@/types/database'

export async function createTemplate(name: string, data: WorkoutFormData) {
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
  
  // 1. Create Template
  const { data: template, error: templateError } = await (supabase
    .from('workout_templates') as any)
    .insert({
      org_id: profile.org_id,
      user_id: user.id,
      name: name.trim(),
      notes: data.notes || null,
    })
    .select()
    .single()
    
  if (templateError) throw templateError
  
  // 2. Create Exercises and Sets
  for (let i = 0; i < data.exercises.length; i++) {
    const exercise = data.exercises[i]
    
    const { data: templateExercise, error: exerciseError } = await (supabase
      .from('template_exercises') as any)
      .insert({
        template_id: template.id,
        exercise_id: exercise.exercise_id,
        order_index: i,
      })
      .select()
      .single()
      
    if (exerciseError) throw exerciseError
    
    const sets = exercise.sets.map((set, setIndex) => ({
      template_exercise_id: templateExercise.id,
      set_number: setIndex + 1,
      weight: set.weight || 0,
      reps: set.reps || 0,
      distance_meters: set.distance_meters || null,
      time_seconds: set.time_seconds || null,
      calories: set.calories || null,
    }))
    
    if (sets.length > 0) {
      await (supabase.from('template_sets') as any).insert(sets)
    }
  }
  
  revalidatePath('/workouts/new')
}

export async function deleteTemplate(templateId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { error } = await supabase
    .from('workout_templates')
    .delete()
    .eq('id', templateId)
    .eq('user_id', user.id)
    
  if (error) throw error
  
  revalidatePath('/workouts/new')
}

