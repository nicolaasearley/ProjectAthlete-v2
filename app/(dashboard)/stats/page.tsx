import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { VolumeChart } from '@/components/stats/volume-chart'
import { CategoryBreakdown } from '@/components/stats/category-breakdown'
import { StreakCard } from '@/components/stats/streak-card'
import { PRTimeline } from '@/components/stats/pr-timeline'
import { Metadata } from 'next'

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
  userExercises?.forEach(session => {
    session.workout_exercises.forEach((we: any) => {
      if (we.exercises) {
        exerciseMap.set(we.exercise_id, we.exercises.name)
      }
    })
  })
  const exerciseList = Array.from(exerciseMap.entries()).map(([id, name]) => ({ id, name }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Training Stats</h1>
        <p className="text-muted-foreground">Your progress at a glance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StreakCard streaks={streaks?.[0] || { current_streak: 0, longest_streak: 0 }} />
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Volume Trends (30 Days)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <VolumeChart data={volumeTrends || []} />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Training Split</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <CategoryBreakdown data={categoryData || []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Records</CardTitle>
          </CardHeader>
          <CardContent>
            <PRTimeline exercises={exerciseList} userId={user.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

