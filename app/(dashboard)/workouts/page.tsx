import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { WorkoutCard } from '@/components/workouts/workout-card'
import Link from 'next/link'
import { Plus, Dumbbell, Users, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Workouts | ProjectAthlete',
  description: 'View and log your training sessions.',
}

export default async function WorkoutsPage() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  // Check if coach/admin
  const { data: isCoachOrAdmin } = await (supabase.rpc as any)('is_coach_or_admin')
  
  // Fetch workouts with set data for volume calculation
  const { data: workouts } = await supabase
    .from('workout_sessions')
    .select(`
      *,
      workout_exercises(
        id,
        exercises(name),
        workout_sets(id, weight, reps)
      )
    `)
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  // Generate calendar data for current month
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const firstDay = new Date(currentYear, currentMonth, 1)
  const lastDay = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startDayOfWeek = firstDay.getDay()
  
  // Get workout dates for the month
  const workoutDates = new Set(
    (workouts || [])
      .filter((w: any) => {
        const d = new Date(w.date)
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear
      })
      .map((w: any) => new Date(w.date).getDate())
  )

  const monthName = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  
  return (
    <div className="space-y-10 pb-20 page-transition">
      {/* Header */}
      <div className="flex items-end justify-between px-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter">Workouts</h1>
          <p className="text-white/40 font-medium uppercase tracking-[0.2em] text-[10px] mt-1">{workouts?.length || 0} sessions logged</p>
        </div>
        <div className="flex gap-3">
          {isCoachOrAdmin && (
            <Button asChild variant="ghost" className="h-12 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white border border-white/10 hover:border-white/20">
              <Link href="/workouts/all" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                All Athletes
              </Link>
            </Button>
          )}
          <Button asChild className="h-12 px-6 rounded-xl bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-[10px]">
            <Link href="/workouts/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Log Workout
            </Link>
          </Button>
        </div>
      </div>

      {/* Calendar Card */}
      <Card premium className="overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="stat-label">{monthName}</div>
          <div className="flex items-center gap-1">
            <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
              <ChevronLeft className="h-4 w-4 text-white/40" />
            </div>
            <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
              <ChevronRight className="h-4 w-4 text-white/40" />
            </div>
          </div>
        </div>
        
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((day, i) => (
            <div key={i} className="text-center text-[10px] font-black uppercase tracking-widest text-white/20 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before the 1st */}
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1
            const isToday = dayNum === now.getDate() && currentMonth === now.getMonth()
            const hasWorkout = workoutDates.has(dayNum)
            
            return (
              <div
                key={dayNum}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all
                  ${isToday ? 'bg-white/10 border border-white/20' : 'bg-white/[0.02] border border-transparent'}
                  ${hasWorkout ? 'border-blue-500/30' : ''}
                `}
              >
                <span className={`text-sm font-bold ${isToday ? 'text-white' : 'text-white/40'}`}>
                  {dayNum}
                </span>
                {hasWorkout && (
                  <div className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                )}
              </div>
            )
          })}
        </div>
        
        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Workout Logged</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Today</span>
          </div>
        </div>
      </Card>

      {/* Workout List */}
      {workouts && workouts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(workouts as any[]).map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      ) : (
        <Card premium className="text-center py-16">
          <Dumbbell className="h-16 w-16 mx-auto mb-6 text-white/10" />
          <h3 className="text-xl font-bold tracking-tight mb-2">No workouts yet</h3>
          <p className="text-white/40 text-sm max-w-xs mx-auto mb-8">Start logging to track your progress and see your data here.</p>
          <Button asChild className="h-12 px-8 rounded-xl bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-[10px]">
            <Link href="/workouts/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Log Your First Workout
            </Link>
          </Button>
        </Card>
      )}
    </div>
  )
}
