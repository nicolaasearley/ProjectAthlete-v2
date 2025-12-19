import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ChallengeCard } from '@/components/challenges/challenge-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Trophy, Plus, History, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Challenges | ProjectAthlete',
  description: 'Join community challenges and climb the leaderboard.',
}

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
  
  // Get active challenges (started and not ended)
  const { data: activeChallenges } = await supabase
    .from('challenges')
    .select('*')
    .eq('org_id', profileData.org_id)
    .lte('start_date', today)
    .gte('end_date', today)
    .order('end_date', { ascending: true })
  
  // Get upcoming challenges (haven't started yet)
  const { data: upcomingChallenges } = await supabase
    .from('challenges')
    .select('*')
    .eq('org_id', profileData.org_id)
    .gt('start_date', today)
    .order('start_date', { ascending: true })
  
  const challenges = (activeChallenges || []) as any[]
  const upcoming = (upcomingChallenges || []) as any[]
  
  // Check if admin
  const { data: isAdmin } = await (supabase.rpc as any)('is_coach_or_admin')
  
  // Fetch progress for each active challenge
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Challenges</h1>
          <p className="text-muted-foreground">Monthly community competitions</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href="/challenges/history">
              <History className="h-4 w-4" />
              History
            </Link>
          </Button>
          {isAdmin && (
            <Button asChild size="sm" className="gap-2">
              <Link href="/admin/challenges/new">
                <Plus className="h-4 w-4" />
                New
              </Link>
            </Button>
          )}
        </div>
      </div>
      
      {/* Active Challenges */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Active Challenges
        </h2>
      {challengesWithProgress.length === 0 ? (
          <div className="text-center py-8 bg-card rounded-lg border border-border">
            <Trophy className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-30" />
            <h3 className="font-medium">No active challenges</h3>
            <p className="text-sm text-muted-foreground">Check back soon or view upcoming challenges below!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {challengesWithProgress.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge as any} />
          ))}
        </div>
      )}
      </section>
      
      {/* Upcoming Challenges */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Upcoming Challenges
        </h2>
        {upcoming.length === 0 ? (
          <div className="text-center py-8 bg-card/50 rounded-lg border border-border/50">
            <Clock className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-30" />
            <h3 className="font-medium text-muted-foreground">No upcoming challenges</h3>
            <p className="text-sm text-muted-foreground">New challenges will appear here when scheduled</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {upcoming.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge as any} isUpcoming />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

