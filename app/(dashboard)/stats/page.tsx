import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VolumeChart } from '@/components/stats/volume-chart'
import { CategoryBreakdown } from '@/components/stats/category-breakdown'
import { StreakCard } from '@/components/stats/streak-card'
import { PRTimeline } from '@/components/stats/pr-timeline'
import { Metadata } from 'next'
import { Trophy, Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Training Stats | ProjectAthlete',
  description: 'Track your progress, volume, and consistency.',
}

export default async function StatsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  // Fetch stats using RPC functions
  const { data: volumeTrends } = await (supabase.rpc as any)('get_volume_trends', {
    p_user_id: user.id,
    p_days: 30
  })
  
  const { data: streaks } = await (supabase.rpc as any)('get_workout_streaks', {
    p_user_id: user.id
  })
  
  const { data: categoryData } = await (supabase.rpc as any)('get_category_breakdown', {
    p_user_id: user.id
  })

  // Get top exercises for PR history selection
  const { data: topExercises } = await supabase
    .from('workout_exercises')
    .select('exercise_id, exercises(id, name)')
    .eq('session_id', user.id) // This is wrong, session_id is not user_id. Need to join.
    // Actually just get all exercises the user has logged
    
  const { data: userExercises } = await supabase
    .from('workout_sessions')
    .select(`
      workout_exercises(
        exercise_id,
        exercises(id, name)
      )
    `)
    .eq('user_id', user.id)
    
  const exerciseMap = new Map()
  // Type assertion for nested Supabase query result
  const sessions = userExercises as { workout_exercises: { exercise_id: string; exercises: { id: string; name: string } | null }[] }[] | null
  sessions?.forEach(session => {
    session.workout_exercises.forEach((we) => {
      if (we.exercises) {
        exerciseMap.set(we.exercise_id, we.exercises.name)
      }
    })
  })
  const exerciseList = Array.from(exerciseMap.entries()).map(([id, name]) => ({ id, name }))

  return (
    <div className="space-y-10 pb-20 page-transition">
      <div className="px-2">
        <h1 className="text-4xl font-bold tracking-tighter">Training Stats</h1>
        <p className="text-foreground/40 font-medium uppercase tracking-[0.2em] text-[10px] mt-1">Your progress at a glance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <StreakCard streaks={streaks?.[0] || { current_streak: 0, longest_streak: 0 }} />
        </div>
        
        <Card premium glow="teal" className="md:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div className="stat-label">Volume Trends</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-foreground/20">Last 30 Days</div>
          </div>
          <div className="h-[250px] w-full">
            <VolumeChart data={volumeTrends || []} />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card premium glow="purple">
          <div className="flex items-center justify-between mb-8">
            <div className="stat-label">Training Split</div>
            <Activity className="h-4 w-4 text-purple-500/40" />
          </div>
          <div className="h-[300px] w-full">
            <CategoryBreakdown data={categoryData || []} />
          </div>
        </Card>

        <Card premium>
          <div className="flex items-center justify-between mb-8">
            <div className="stat-label">Personal Records</div>
            <Trophy className="h-4 w-4 text-foreground/20" />
          </div>
          <PRTimeline exercises={exerciseList} userId={user.id} />
        </Card>
      </div>
    </div>
  )
}

