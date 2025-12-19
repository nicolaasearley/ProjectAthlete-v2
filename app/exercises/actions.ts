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
  
  if (!name || !category) {
    throw new Error('Name and category are required')
  }
  
  const { error } = await (supabase
    .from('exercises') as any)
    .insert({
      name: name.trim(),
      category,
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

