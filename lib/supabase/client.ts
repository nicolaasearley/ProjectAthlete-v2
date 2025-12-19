import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

// Get URLs with fallbacks for build-time (actual values come from Docker build args)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // During build time, return a mock client that won't be used
    // The real client will be created at runtime with proper env vars
    return createBrowserClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
  }
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  )
}

