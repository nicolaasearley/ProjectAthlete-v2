'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ChallengeFormData } from '@/types/database'

export async function createChallenge(formData: FormData | ChallengeFormData) {
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

  // Extract data from FormData or use directly if ChallengeFormData
  let data: ChallengeFormData
  if (formData instanceof FormData) {
    data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      metric: formData.get('metric') as string,
      metric_unit: formData.get('metric_unit') as string,
      start_date: formData.get('start_date') as string,
      end_date: formData.get('end_date') as string,
    }
  } else {
    data = formData
  }
  
  const { error } = await (supabase
    .from('challenges') as any)
    .insert({
      org_id: profile.org_id,
      name: data.name,
      description: data.description,
      metric: data.metric,
      metric_unit: data.metric_unit,
      start_date: data.start_date,
      end_date: data.end_date,
      created_by: user.id,
    })
  
  if (error) throw error
  
  revalidatePath('/challenges')
  redirect('/challenges')
}

export async function logProgress(challengeId: string, value: number, notes?: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { error } = await (supabase
    .from('challenge_logs') as any)
    .insert({
      challenge_id: challengeId,
      user_id: user.id,
      value,
      notes: notes || null,
    })
  
  if (error) throw error
  
  revalidatePath(`/challenges/${challengeId}`)
  revalidatePath('/challenges')
}

export async function updateProgress(logId: string, challengeId: string, value: number, notes?: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { error } = await (supabase
    .from('challenge_logs') as any)
    .update({
      value,
      notes: notes || null,
    })
    .eq('id', logId)
    .eq('user_id', user.id)
  
  if (error) throw error
  
  revalidatePath(`/challenges/${challengeId}`)
  revalidatePath('/challenges')
}

export async function deleteProgress(logId: string, challengeId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { error } = await (supabase
    .from('challenge_logs') as any)
    .delete()
    .eq('id', logId)
    .eq('user_id', user.id)
  
  if (error) throw error
  
  revalidatePath(`/challenges/${challengeId}`)
  revalidatePath('/challenges')
}

export async function updateAnonymity(isAnonymous: boolean) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { error } = await (supabase
    .from('profiles') as any)
    .update({ is_anonymous_on_leaderboards: isAnonymous })
    .eq('id', user.id)
  
  if (error) throw error
  
  revalidatePath('/profile')
}

