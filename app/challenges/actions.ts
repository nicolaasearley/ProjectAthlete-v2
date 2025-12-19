'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { ChallengeFormData } from '@/types/database'

export async function createChallenge(data: ChallengeFormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()
  
  if (!profile) throw new Error('Profile not found')
  
  const { error } = await supabase
    .from('challenges')
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
  
  const { error } = await supabase
    .from('challenge_logs')
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

export async function updateAnonymity(isAnonymous: boolean) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { error } = await supabase
    .from('profiles')
    .update({ is_anonymous_on_leaderboards: isAnonymous })
    .eq('id', user.id)
  
  if (error) throw error
  
  revalidatePath('/profile')
}

