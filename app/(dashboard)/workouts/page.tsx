import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { WorkoutCard } from '@/components/workouts/workout-card'
import Link from 'next/link'
import { Plus, Dumbbell, Users, ChevronLeft, ChevronRight } from 'lucide-react'

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
  
  // Map workout dates to workout IDs for linking
  const workoutsByDate: Record<number, { id: string; exercises: string[] }> = {}
  ;(workouts || []).forEach((w: any) => {
    const d = new Date(w.date)
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      const dayNum = d.getDate()
      const exerciseNames = w.workout_exercises?.slice(0, 2).map((e: any) => e.exercises?.name).filter(Boolean) || []
      workoutsByDate[dayNum] = { id: w.id, exercises: exerciseNames }
    }
  })

  const monthName = firstDay.toLocaleDateString('en-US', { month: 'short' })
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  
  return (
    <div className="space-y-6 sm:space-y-8 pb-20 page-transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 px-2">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter">Workouts</h1>
          <p className="text-foreground/40 font-medium uppercase tracking-[0.2em] text-[9px] sm:text-[10px] mt-1">{workouts?.length || 0} sessions logged</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          {isCoachOrAdmin && (
            <Button asChild variant="ghost" className="h-10 sm:h-12 px-3 sm:px-5 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-foreground border border-foreground/10 hover:border-foreground/20 flex-1 sm:flex-none">
              <Link href="/workouts/all" className="flex items-center justify-center gap-2">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">All Athletes</span>
                <span className="xs:hidden">All</span>
              </Link>
            </Button>
          )}
          <Button asChild className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest text-[9px] sm:text-[10px] flex-1 sm:flex-none">
            <Link href="/workouts/new" className="flex items-center justify-center gap-2">
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Log Workout
            </Link>
          </Button>
        </div>
      </div>

      {/* Compact Calendar Strip */}
      <div className="rounded-2xl bg-foreground/[0.02] border border-foreground/5 p-3 sm:p-4 mx-2 sm:mx-0">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">{monthName} {currentYear}</span>
          <div className="flex items-center gap-1">
            <div className="h-6 w-6 rounded-md bg-foreground/5 flex items-center justify-center cursor-pointer hover:bg-foreground/10 transition-colors">
              <ChevronLeft className="h-3 w-3 text-foreground/40" />
            </div>
            <div className="h-6 w-6 rounded-md bg-foreground/5 flex items-center justify-center cursor-pointer hover:bg-foreground/10 transition-colors">
              <ChevronRight className="h-3 w-3 text-foreground/40" />
            </div>
          </div>
        </div>
        
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayNames.map((day, i) => (
            <div key={i} className="text-center text-[8px] font-black uppercase tracking-widest text-foreground/20 py-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid - Compact */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the 1st */}
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-9" />
          ))}
          
          {/* Day cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1
            const isToday = dayNum === now.getDate() && currentMonth === now.getMonth()
            const workoutData = workoutsByDate[dayNum]
            const hasWorkout = !!workoutData
            
            const cellContent = (
              <div
                className={`
                  h-9 rounded-lg flex items-center justify-center relative transition-all cursor-pointer group
                  ${hasWorkout 
                    ? 'bg-gradient-to-br from-blue-500/30 to-blue-600/10 border border-blue-500/30 hover:from-blue-500/40 hover:to-blue-600/20' 
                    : 'hover:bg-foreground/5'}
                  ${isToday && !hasWorkout ? 'ring-1 ring-foreground/20' : ''}
                `}
              >
                <span className={`text-xs font-bold ${hasWorkout ? 'text-blue-400' : isToday ? 'text-foreground' : 'text-foreground/30'}`}>
                  {dayNum}
                </span>
                {hasWorkout && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    <div className="bg-background/95 backdrop-blur-sm border border-foreground/10 rounded-lg px-2 py-1 whitespace-nowrap shadow-xl">
                      <p className="text-[8px] font-bold text-blue-400">{workoutData.exercises.join(', ') || 'Workout'}</p>
                    </div>
                  </div>
                )}
              </div>
            )
            
            return hasWorkout ? (
              <Link key={dayNum} href={`/workouts/${workoutData.id}`}>
                {cellContent}
              </Link>
            ) : (
              <div key={dayNum}>{cellContent}</div>
            )
          })}
        </div>
      </div>

      {/* Workout List */}
      {workouts && workouts.length > 0 ? (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {(workouts as any[]).map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      ) : (
        <Card premium className="text-center py-16">
          <Dumbbell className="h-16 w-16 mx-auto mb-6 text-foreground/10" />
          <h3 className="text-xl font-bold tracking-tight mb-2">No workouts yet</h3>
          <p className="text-foreground/40 text-sm max-w-xs mx-auto mb-8">Start logging to track your progress and see your data here.</p>
          <Button asChild className="h-12 px-8 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest text-[10px]">
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
