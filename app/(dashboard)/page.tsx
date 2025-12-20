import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/shared/empty-state'
import { WorkoutCard } from '@/components/workouts/workout-card'
import { Button } from '@/components/ui/button'
import { Dumbbell, Trophy, Users, TrendingUp, Rss, BarChart2, Play, Flame, Moon, Activity } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

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

  // Fetch streaks
  const { data: streaks } = await (supabase.rpc as any)('get_workout_streaks', {
    p_user_id: user.id
  })

  const recentWorkouts = (workouts as any[] || []).slice(0, 3)

  return (
    <div className="space-y-10 pb-20 page-transition">
      {/* Header Section */}
      <div className="flex items-end justify-between px-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter">Overview</h1>
          <p className="text-white/40 font-medium uppercase tracking-[0.2em] text-[10px] mt-1">Primed for performance</p>
        </div>
        <Button asChild variant="ghost" size="sm" className="text-white/40 hover:text-white transition-colors uppercase tracking-widest text-[9px] font-black">
          <Link href="/stats" className="flex items-center gap-2">
            Details <BarChart2 className="h-3 w-3" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Main Readiness Card */}
        <Card premium glow="teal" className="md:col-span-8 flex flex-col justify-between group overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-baseline gap-1">
              <span className="stat-value text-white">87</span>
              <span className="text-2xl font-bold text-white/20">/ 100</span>
            </div>
            <p className="text-xl font-medium mt-4">You&apos;re primed for performance.</p>
            
            <div className="mt-8 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 w-fit">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 tracking-wide">+5 vs yesterday</span>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-4 gap-4 relative z-10">
            {[
              { label: 'HRV', value: '68ms' },
              { label: 'Recovery', value: '92%' },
              { label: 'Resting HR', value: '52bpm' },
              { label: 'Sleep', value: '85' }
            ].map((stat) => (
              <div key={stat.label}>
                <p className="stat-label mb-1">{stat.label}</p>
                <p className="text-lg font-bold tracking-tight">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Abstract Liquid Glass Element */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none" />
        </Card>

        {/* Quick Action Card */}
        <Card premium glow="primary" className="md:col-span-4 flex flex-col justify-between hover-lift">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight">The Catalyst</h2>
              <div className="flex gap-2">
                <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <Flame className="h-4 w-4 text-blue-400" />
                </div>
              </div>
            </div>
            <p className="text-white/40 text-sm font-medium">45 min • High intensity</p>
            
            <div className="mt-8 space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/20">
                <span>Estimated Exertion</span>
                <span className="text-white/40">High</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[70%] bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" />
              </div>
            </div>
          </div>

          <Button asChild className="w-full mt-10 h-14 rounded-2xl bg-white text-black hover:bg-white/90 font-bold text-base transition-transform active:scale-[0.98] shadow-2xl">
            <Link href="/workouts/new" className="flex items-center justify-center gap-3">
              <Play className="h-4 w-4 fill-current" /> Start Workout
            </Link>
          </Button>
        </Card>

        {/* Mini Stat Cards */}
        <Card premium glow="purple" className="md:col-span-4 flex flex-col items-center justify-center text-center py-10 group">
          <div className="stat-label mb-6">Sleep</div>
          <div className="relative h-32 w-32 flex items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90">
              <circle cx="64" cy="64" r="58" className="stroke-white/5 fill-none" strokeWidth="8" />
              <circle 
                cx="64" cy="64" r="58" 
                className="stroke-purple-500 fill-none transition-all duration-1000" 
                strokeWidth="8" 
                strokeDasharray={364} 
                strokeDashoffset={364 * (1 - 0.85)} 
                strokeLinecap="round" 
              />
            </svg>
            <div className="text-3xl font-bold tracking-tighter">85</div>
          </div>
          <div className="mt-6 text-xl font-bold tracking-tight">7.5h</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Slept</div>
          
          <div className="mt-8 w-full max-w-[120px] space-y-1">
            <div className="h-1.5 w-full bg-white/5 rounded-full flex overflow-hidden">
              <div className="h-full w-[30%] bg-purple-600" />
              <div className="h-full w-[40%] bg-purple-400" />
              <div className="h-full w-[30%] bg-purple-200" />
            </div>
            <div className="flex justify-between text-[8px] font-black uppercase tracking-tighter text-white/20">
              <span>Deep</span>
              <span>REM</span>
              <span>Light</span>
            </div>
          </div>
        </Card>

        <Card premium glow="teal" className="md:col-span-4 flex flex-col items-center justify-center text-center py-10 group">
          <div className="stat-label mb-6">Recovery</div>
          <div className="relative h-32 w-32 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-8 border-white/5" />
            <div className="absolute inset-0 rounded-full border-8 border-[#14e0d4] border-t-transparent -rotate-45" />
            <div className="text-3xl font-bold tracking-tighter">92</div>
          </div>
          
          <div className="mt-8 space-y-4 w-full px-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/40 uppercase">HRV</span>
              <span className="text-xs font-bold text-emerald-400">+12ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/40 uppercase">Resting HR</span>
              <span className="text-xs font-bold text-emerald-400">-3bpm</span>
            </div>
          </div>
        </Card>

        {/* Recent Activity Mini-Card */}
        <Card premium className="md:col-span-4 p-6 overflow-y-auto max-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold tracking-tight">Recent Sessions</h3>
            <Link href="/workouts/all" className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">View All</Link>
          </div>
          <div className="space-y-4">
            {recentWorkouts.map((workout: any) => (
              <div key={workout.id} className="group cursor-pointer">
                <p className="text-xs font-bold tracking-tight group-hover:text-primary transition-colors">{workout.exercises?.name || 'Workout'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">
                    {new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <div className="h-1 w-1 rounded-full bg-white/10" />
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{workout.workout_exercises?.length || 0} Exercises</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

