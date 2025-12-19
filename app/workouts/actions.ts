'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { WorkoutFormData } from '@/types/database'

export async function createWorkout(data: WorkoutFormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  // Get user's org_id
  const { data: profileData } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()
  
  if (!profileData) throw new Error('Profile not found')
  
  const profile = profileData as { org_id: string }
  
  // Create session
  const { data: session, error: sessionError } = await (supabase
    .from('workout_sessions') as any)
    .insert({
      user_id: user.id,
      org_id: profile.org_id,
      date: data.date,
      notes: data.notes || null,
    })
    .select()
    .single()
  
  if (sessionError) throw sessionError
  
  // Create exercises and sets
  for (let i = 0; i < data.exercises.length; i++) {
    const exercise = data.exercises[i]
    
    const { data: workoutExercise, error: exerciseError } = await (supabase
      .from('workout_exercises') as any)
      .insert({
        session_id: session.id,
        exercise_id: exercise.exercise_id,
        order_index: i,
      })
      .select()
      .single()
    
    if (exerciseError) throw exerciseError
    
    // Create sets
    const sets = exercise.sets.map((set, setIndex) => ({
      workout_exercise_id: workoutExercise.id,
      set_number: setIndex + 1,
      weight: set.weight || 0,
      reps: set.reps || 0,
      distance_meters: set.distance_meters || null,
      time_seconds: set.time_seconds || null,
      calories: set.calories || null,
    }))
    
    if (sets.length > 0) {
      const { error: setsError } = await (supabase
        .from('workout_sets') as any)
        .insert(sets)
      
      if (setsError) throw setsError
    }
  }
  
  // Check for PRs and post to feed
  await (supabase.rpc as any)('check_and_post_prs', { p_session_id: session.id })
  
  revalidatePath('/workouts')
  revalidatePath('/feed')
  redirect(`/workouts/${session.id}`)
}

export async function updateWorkout(id: string, data: WorkoutFormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  // Update session
  const { error: sessionError } = await (supabase
    .from('workout_sessions') as any)
    .update({
      date: data.date,
      notes: data.notes || null,
    })
    .eq('id', id)
    .eq('user_id', user.id)
  
  if (sessionError) throw sessionError
  
  // Delete existing exercises (cascades to sets)
  await (supabase
    .from('workout_exercises') as any)
    .delete()
    .eq('session_id', id)
  
  // Recreate exercises and sets
  for (let i = 0; i < data.exercises.length; i++) {
    const exercise = data.exercises[i]
    
    const { data: workoutExercise, error: exerciseError } = await (supabase
      .from('workout_exercises') as any)
      .insert({
        session_id: id,
        exercise_id: exercise.exercise_id,
        order_index: i,
      })
      .select()
      .single()
    
    if (exerciseError) throw exerciseError
    
    const sets = exercise.sets.map((set, setIndex) => ({
      workout_exercise_id: workoutExercise.id,
      set_number: setIndex + 1,
      weight: set.weight,
      reps: set.reps,
    }))
    
    if (sets.length > 0) {
      await (supabase.from('workout_sets') as any).insert(sets)
    }
  }

  // Check for PRs and post to feed
  await (supabase.rpc as any)('check_and_post_prs', { p_session_id: id })
  
  revalidatePath('/workouts')
  revalidatePath(`/workouts/${id}`)
  revalidatePath('/feed')
  redirect(`/workouts/${id}`)
}

export async function deleteWorkout(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { error } = await (supabase
    .from('workout_sessions') as any)
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  
  if (error) throw error
  
  revalidatePath('/workouts')
  redirect('/workouts')
}

export async function getWorkouts() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('workout_sessions')
    .select(`
      *,
      workout_exercises(
        *,
        exercises(name, category),
        workout_sets(*)
      )
    `)
    .order('date', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getWorkout(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('workout_sessions')
    .select(`
      *,
      workout_exercises(
        *,
        exercises(id, name, category),
        workout_sets(*)
      )
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

