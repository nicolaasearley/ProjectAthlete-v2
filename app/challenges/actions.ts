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
  let data: ChallengeFormData & { badge_image?: File | null }
  if (formData instanceof FormData) {
    data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      metric: formData.get('metric') as string,
      metric_unit: formData.get('metric_unit') as string,
      start_date: formData.get('start_date') as string,
      end_date: formData.get('end_date') as string,
      badge_image: formData.get('badge_image') as File | null,
    }
  } else {
    data = formData
  }

  let badgeImageUrl = null
  if (data.badge_image && data.badge_image.size > 0) {
    const fileExt = data.badge_image.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `challenge-badges/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('badges')
      .upload(filePath, data.badge_image)

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('badges')
        .getPublicUrl(filePath)
      badgeImageUrl = publicUrl
    }
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
      badge_image_url: badgeImageUrl,
    })
  
  if (error) throw error
  
  revalidatePath('/challenges')
  redirect('/challenges')
}

export async function updateChallenge(challengeId: string, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: isAdmin } = await (supabase.rpc as any)('is_coach_or_admin')
  if (!isAdmin) throw new Error('Unauthorized')

  const data = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    metric: formData.get('metric') as string,
    metric_unit: formData.get('metric_unit') as string,
    start_date: formData.get('start_date') as string,
    end_date: formData.get('end_date') as string,
  }

  const badgeImage = formData.get('badge_image') as File | null
  let badgeImageUrl = undefined // undefined means don't update if not provided
  
  if (badgeImage && badgeImage.size > 0) {
    const fileExt = badgeImage.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `challenge-badges/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('badges')
      .upload(filePath, badgeImage)

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage
        .from('badges')
        .getPublicUrl(filePath)
      badgeImageUrl = publicUrl
    }
  }
  
  const updateData: any = { ...data }
  if (badgeImageUrl) updateData.badge_image_url = badgeImageUrl

  const { error } = await (supabase
    .from('challenges') as any)
    .update(updateData)
    .eq('id', challengeId)
  
  if (error) throw error
  
  revalidatePath('/challenges')
  revalidatePath(`/challenges/${challengeId}`)
  redirect(`/challenges/${challengeId}`)
}

export async function deleteChallenge(challengeId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: isAdmin } = await (supabase.rpc as any)('is_coach_or_admin')
  if (!isAdmin) throw new Error('Unauthorized')

  const { error } = await (supabase
    .from('challenges') as any)
    .delete()
    .eq('id', challengeId)
  
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

