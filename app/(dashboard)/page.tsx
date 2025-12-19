import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared/empty-state'
import { WorkoutCard } from '@/components/workouts/workout-card'
import { Dumbbell, Trophy, Users, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard | ProjectAthlete',
  description: 'Your training overview and recent activity.',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Fetch stats
  const { data: workouts } = await supabase
    .from('workout_sessions')
    .select(`
      *,
      workout_exercises(
        *,
        exercises(name, category),
        workout_sets(*)
      )
    `)
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  // Fetch community stats
  const { count: communityCount } = await supabase
    .from('community_workouts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Fetch active challenges count
  const today = new Date().toISOString().split('T')[0]
  const { count: activeChallengesCount } = await supabase
    .from('challenges')
    .select('*', { count: 'exact', head: true })
    .lte('start_date', today)
    .gte('end_date', today)

  // Calculate this week's workouts
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const thisWeekWorkouts = workouts?.filter((w: any) => new Date(w.date) >= oneWeekAgo).length || 0

  // Get Personal Records (simplified for dashboard)
  const { data: prs } = await (supabase.rpc as any)('get_user_exercise_summary', {
    p_user_id: user.id
  })

  const recentWorkouts = (workouts as any[] || []).slice(0, 3)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Here&apos;s your training overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workouts?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Lifetime sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisWeekWorkouts}</div>
            <p className="text-xs text-muted-foreground">workouts completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeChallengesCount || 0}</div>
            <p className="text-xs text-muted-foreground">Available to join</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{communityCount || 0}</div>
            <p className="text-xs text-muted-foreground">workouts shared</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
            <CardDescription>Your latest training sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentWorkouts.length > 0 ? (
              <div className="space-y-4">
                {recentWorkouts.map((workout) => (
                  <WorkoutCard key={workout.id} workout={workout as any} />
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={Dumbbell}
                title="No workouts yet"
                description="Start logging your training sessions to track your progress."
                actionLabel="Log Workout"
                actionHref="/workouts/new"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Records</CardTitle>
            <CardDescription>Your best lifts</CardDescription>
          </CardHeader>
          <CardContent>
            {prs && prs.length > 0 ? (
              <div className="space-y-4">
                {prs.slice(0, 5).map((pr: any) => (
                  <div key={pr.exercise_id} className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-border gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{pr.exercise_name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase truncate">{pr.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-lg leading-tight">
                        {Number(pr.max_weight) > 0 
                          ? Number(pr.max_weight).toLocaleString() 
                          : Number(pr.estimated_1rm || 0).toLocaleString()} 
                        <span className="text-xs font-normal text-muted-foreground ml-0.5">lbs</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {Number(pr.max_weight) > 0 ? 'Max Weight' : 'Est. 1RM'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={Trophy}
                title="No records yet"
                description="Your PRs will appear here automatically as you log workouts."
                actionLabel="Browse Exercises"
                actionHref="/exercises"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

