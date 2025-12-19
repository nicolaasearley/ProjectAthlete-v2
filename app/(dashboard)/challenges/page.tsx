import { createClient } from '@/lib/supabase/server'
import { ChallengeCard } from '@/components/challenges/challenge-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Trophy, Plus, History } from 'lucide-react'

export default async function ChallengesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()
  
  if (!profile) return null
  
  // Force narrowing for TypeScript
  const profileData = profile as any
  const today = new Date().toISOString().split('T')[0]
  
  // Get active challenges
  const { data: activeChallenges } = await supabase
    .from('challenges')
    .select('*')
    .eq('org_id', profileData.org_id)
    .lte('start_date', today)
    .gte('end_date', today)
    .order('end_date', { ascending: true })
  
  const challenges = (activeChallenges || []) as any[]
  
  // Check if admin
  const { data: isAdmin } = await (supabase.rpc as any)('is_coach_or_admin')
  
  // Fetch progress for each challenge
  const challengesWithProgress = await Promise.all(
    challenges.map(async (challenge) => {
      const { data: progress } = await (supabase.rpc as any)('get_user_challenge_progress', {
        p_challenge_id: challenge.id,
        p_user_id: user.id
      })
      return {
        ...challenge,
        progress: (progress as any)?.[0] || null
      }
    })
  )
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Challenges</h1>
          <p className="text-muted-foreground">Monthly community competitions</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/challenges/history">
              <History className="h-4 w-4 mr-2" />
              History
            </Link>
          </Button>
          {isAdmin && (
            <Button asChild size="sm">
              <Link href="/admin/challenges/new">
                <Plus className="h-4 w-4 mr-2" />
                New
              </Link>
            </Button>
          )}
        </div>
      </div>
      
      {challengesWithProgress.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h3 className="text-lg font-medium">No active challenges</h3>
          <p className="text-muted-foreground mb-4">Check back soon for the next competition!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {challengesWithProgress.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge as any} />
          ))}
        </div>
      )}
    </div>
  )
}

