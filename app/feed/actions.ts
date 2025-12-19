'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPost(content: string) {
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
    .from('feed_posts')
    .insert({
      org_id: profile.org_id,
      user_id: user.id,
      post_type: 'text',
      content: content.trim(),
    })
    
  if (error) throw error
  
  revalidatePath('/feed')
}

export async function toggleFeedReaction(postId: string, reactionType: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  // Check if reaction exists
  const { data: existing } = await supabase
    .from('feed_reactions')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .eq('reaction_type', reactionType)
    .single()
    
  if (existing) {
    await supabase
      .from('feed_reactions')
      .delete()
      .eq('id', existing.id)
  } else {
    await supabase
      .from('feed_reactions')
      .insert({
        post_id: postId,
        user_id: user.id,
        reaction_type: reactionType,
      })
  }
  
  revalidatePath('/feed')
}

export async function deletePost(postId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { error } = await supabase
    .from('feed_posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', user.id)
    
  if (error) throw error
  
  revalidatePath('/feed')
}

