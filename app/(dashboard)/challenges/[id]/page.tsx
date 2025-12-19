import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Leaderboard } from '@/components/challenges/leaderboard'
import { LogProgressForm } from '@/components/challenges/log-progress-form'
import { logProgress } from '@/app/challenges/actions'
import Link from 'next/link'
import { ArrowLeft, Calendar, Info } from 'lucide-react'

interface ChallengePageProps {
  params: Promise<{ id: string }>
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data: challenge } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', id)
    .single()
  
  if (!challenge) {
    notFound()
  }

  // Force narrowing for TypeScript
  const challengeData = challenge as any
  
  const today = new Date().toISOString().split('T')[0]
  const isActive = challengeData.start_date <= today && challengeData.end_date >= today
  
  // Get leaderboard
  const { data: leaderboard } = await (supabase.rpc as any)('get_challenge_leaderboard', {
    p_challenge_id: id
  })
  
  // Get user progress
  const { data: progress } = await (supabase.rpc as any)('get_user_challenge_progress', {
    p_challenge_id: id,
    p_user_id: user.id
  })
  
  const userProgress = (progress as any)?.[0] || null
  const daysRemaining = Math.max(0, Math.ceil((new Date(challengeData.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/challenges" className="p-2 rounded-lg hover:bg-accent transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={isActive ? 'default' : 'secondary'}>
              {isActive ? 'Active' : 'Ended'}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {isActive ? `${daysRemaining} days left` : 'Competition ended'}
            </span>
          </div>
          <h1 className="text-3xl font-bold">{challengeData.name}</h1>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-muted-foreground" />
                About this Challenge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p className="whitespace-pre-wrap">{challengeData.description}</p>
              <div className="pt-4 border-t border-border grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Goal</p>
                  <p>Log most {challengeData.metric} total</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Dates</p>
                  <p>{new Date(challengeData.start_date).toLocaleDateString()} - {new Date(challengeData.end_date).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Leaderboard 
            entries={(leaderboard as any[]) || []}
            currentUserId={user.id}
            unit={challengeData.metric_unit}
          />
        </div>
        
        <div className="space-y-6">
          {isActive && (
            <LogProgressForm 
              challengeId={id}
              metricName={challengeData.metric}
              unit={challengeData.metric_unit}
              onLog={logProgress}
            />
          )}
          
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Your Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-2xl font-bold">
                  {userProgress?.total_value ? Number(userProgress.total_value).toLocaleString() : '0'}
                </p>
                <p className="text-xs text-muted-foreground uppercase">{challengeData.metric_unit} total</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-primary/10">
                <div>
                  <p className="text-lg font-bold">#{userProgress?.rank || '—'}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Rank</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{userProgress?.log_count || '0'}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Logs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

