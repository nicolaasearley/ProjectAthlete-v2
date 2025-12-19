import { createClient } from '@/lib/supabase/server'
import { ChallengeCard } from '@/components/challenges/challenge-card'
import Link from 'next/link'
import { ArrowLeft, History } from 'lucide-react'

export default async function ChallengeHistoryPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()
  
  if (!profile) return null
  
  const today = new Date().toISOString().split('T')[0]
  
  // Get past challenges
  const { data: pastChallenges } = await supabase
    .from('challenges')
    .select('*')
    .eq('org_id', profile.org_id)
    .lt('end_date', today)
    .order('end_date', { ascending: false })
  
  // Fetch progress for each challenge
  const challengesWithProgress = await Promise.all(
    (pastChallenges || []).map(async (challenge) => {
      const { data: progress } = await supabase.rpc('get_user_challenge_progress', {
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
      <div className="flex items-center gap-4">
        <Link href="/challenges" className="p-2 rounded-lg hover:bg-accent transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Past Challenges</h1>
          <p className="text-muted-foreground">Historical competition results</p>
        </div>
      </div>
      
      {challengesWithProgress.length === 0 ? (
        <div className="text-center py-12">
          <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h3 className="text-lg font-medium">No past challenges found</h3>
          <p className="text-muted-foreground">Historical results will appear here once active challenges end.</p>
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

