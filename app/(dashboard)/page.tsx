import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared/empty-state'
import { WorkoutCard } from '@/components/workouts/workout-card'
import { Button } from '@/components/ui/button'
import { Dumbbell, Trophy, Users, TrendingUp, BarChart2, Play, Flame, Moon, Activity } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CurrentRoutineCard } from '@/components/routines/current-routine-card'

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

  // Get streaks
  const { data: streaks } = await (supabase.rpc as any)('get_workout_streaks', {
    p_user_id: user.id
  })

  // Get Personal Records (simplified for dashboard)
  const { data: prs } = await (supabase.rpc as any)('get_user_exercise_summary', {
    p_user_id: user.id
  })

  const recentWorkouts = (workouts as any[] || []).slice(0, 3)

  return (
    <div className="space-y-10 pb-20 page-transition">
      {/* Header Section */}
      <div className="flex items-end justify-between px-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter">Overview</h1>
          <p className="text-foreground/40 font-medium uppercase tracking-[0.2em] text-[10px] mt-1">Your training performance</p>
        </div>
        <Button asChild variant="ghost" size="sm" className="text-foreground/40 hover:text-foreground transition-colors uppercase tracking-widest text-[9px] font-black">
          <Link href="/stats" className="flex items-center gap-2">
            Details <BarChart2 className="h-3 w-3" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Main Consistency Card (Replaces Readiness) */}
        <Card premium glow="primary" className="md:col-span-8 flex flex-col justify-between group overflow-hidden">
          <div className="relative z-10">
            <div className="stat-label mb-2 text-blue-400">Current Streak</div>
            <div className="flex items-baseline gap-2">
              <span className="stat-value text-blue-500">{streaks?.[0]?.current_streak || 0}</span>
              <span className="text-2xl font-black uppercase tracking-widest text-foreground/20">Days</span>
            </div>
            <p className="text-xl font-medium mt-6 leading-tight">
              You&apos;ve logged <span className="text-blue-400">{thisWeekWorkouts} workouts</span> this week. <br />
              Keep the momentum going!
            </p>
          </div>

          <div className="mt-12 flex items-center gap-8 relative z-10">
            <div>
              <p className="stat-label mb-1">Total Workouts</p>
              <p className="text-2xl font-bold tracking-tight">{workouts?.length || 0}</p>
            </div>
            <div className="h-8 w-px bg-foreground/10" />
            <div>
              <p className="stat-label mb-1">Longest Streak</p>
              <p className="text-2xl font-bold tracking-tight">{streaks?.[0]?.longest_streak || 0}</p>
            </div>
          </div>

          {/* Abstract Liquid Glass Element */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />
        </Card>

        {/* Current Day Routine Card */}
        <CurrentRoutineCard />

        {/* Start Workout Card */}
        <Card premium className="md:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Next Session</h2>
              <div className="h-10 w-10 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-foreground/40" />
              </div>
            </div>
            <p className="text-foreground/40 text-[10px] font-black uppercase tracking-[0.2em]">Ready to lift?</p>
            <p className="mt-2 text-lg font-medium text-foreground/80">Track your progress and beat your previous PRs.</p>
          </div>

          <Button asChild className="w-full mt-10 h-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest text-xs transition-transform active:scale-[0.98] shadow-2xl">
            <Link href="/workouts/new" className="flex items-center justify-center gap-3">
              <Play className="h-4 w-4 fill-current ml-1" /> Start Workout
            </Link>
          </Button>
        </Card>

        {/* Live Stats Row (Feed & Challenges) */}
        <Card premium glow="teal" className="md:col-span-4 flex flex-col justify-between py-8">
          <div className="stat-label">Active Challenges</div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="stat-value text-[#14e0d4]">{activeChallengesCount || 0}</span>
            <Trophy className="h-6 w-6 text-[#14e0d4]/40" />
          </div>
          <p className="mt-4 text-xs font-medium text-foreground/40">Competitions currently available to join and compete in.</p>
          <Button asChild variant="ghost" className="mt-6 w-fit p-0 h-auto text-[10px] font-black uppercase tracking-widest text-[#14e0d4] hover:bg-transparent hover:opacity-80">
            <Link href="/challenges">View Leaderboards →</Link>
          </Button>
        </Card>


        {/* Top PRs Preview */}
        <Card premium className="md:col-span-4 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="stat-label">Top Records</div>
            <Trophy className="h-4 w-4 text-foreground/20" />
          </div>
          <div className="space-y-5">
            {prs && prs.length > 0 ? (
              prs.slice(0, 3).map((pr: any) => (
                <div key={pr.exercise_id} className="flex items-center justify-between group">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold tracking-tight truncate group-hover:text-blue-400 transition-colors">{pr.exercise_name}</p>
                    <p className="text-[10px] text-foreground/20 font-black uppercase tracking-widest mt-0.5 truncate">{pr.category}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-black text-lg tracking-tighter leading-none">
                      {Number(pr.max_weight) > 0
                        ? Number(pr.max_weight).toLocaleString()
                        : Number(pr.estimated_1rm || 0).toLocaleString()}
                      <span className="text-[10px] text-foreground/20 ml-1">LBS</span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-foreground/20 font-medium">No records yet. Log workouts to see your PRs.</p>
            )}
          </div>
        </Card>

        {/* Recent Sessions List */}
        <div className="md:col-span-12 mt-4 px-2 flex items-center justify-between">
          <h3 className="text-2xl font-bold tracking-tighter">Recent Sessions</h3>
          <Button asChild variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-foreground/30 hover:text-foreground p-0 h-auto hover:bg-transparent">
            <Link href="/workouts/all">All Workouts →</Link>
          </Button>
        </div>

        <div className="md:col-span-12 grid gap-6 md:grid-cols-3">
          {recentWorkouts.length > 0 ? (
            recentWorkouts.map((workout: any) => (
              <WorkoutCard key={workout.id} workout={workout as any} />
            ))
          ) : (
            <div className="md:col-span-3">
              <EmptyState
                icon={Dumbbell}
                title="No workouts yet"
                description="Start logging your sessions to see your progress here."
                actionLabel="Log Workout"
                actionHref="/workouts/new"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
