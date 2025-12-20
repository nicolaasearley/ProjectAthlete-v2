import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, User, Dumbbell, TrendingUp } from 'lucide-react'

interface WorkoutSetData {
  id: string
  weight?: number | null
  reps?: number | null
}

interface WorkoutExerciseData {
  id: string
  exercises: { name: string } | null
  workout_sets: WorkoutSetData[]
}

interface WorkoutData {
  id: string
  date: string
  notes: string | null
  workout_exercises: WorkoutExerciseData[]
  user?: { display_name: string | null } | null
}

interface WorkoutCardProps {
  workout: WorkoutData
  showUser?: boolean
}

export function WorkoutCard({ workout, showUser }: WorkoutCardProps) {
  const exerciseCount = workout.workout_exercises.length
  const totalSets = workout.workout_exercises.reduce(
    (sum, ex) => sum + ex.workout_sets.length,
    0
  )
  
  // Calculate total volume (weight * reps for all sets)
  const totalVolume = workout.workout_exercises.reduce((sum, ex) => {
    return sum + ex.workout_sets.reduce((setSum, set) => {
      const weight = Number(set.weight) || 0
      const reps = Number(set.reps) || 0
      return setSum + (weight * reps)
    }, 0)
  }, 0)
  
  const formattedDate = new Date(workout.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  
  return (
    <Link href={`/workouts/${workout.id}`}>
      <Card premium hoverable className="group p-5 sm:p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="stat-label mb-2">Session</div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tighter">{formattedDate}</h3>
            {showUser && workout.user && (
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/20 mt-2 flex items-center gap-1.5">
                <User className="h-3 w-3" />
                {workout.user.display_name || 'Anonymous'}
              </p>
            )}
          </div>
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors">
            <Dumbbell className="h-4 w-4 sm:h-5 sm:w-5 text-foreground/20 group-hover:text-blue-400 transition-colors" />
          </div>
        </div>

        {/* Exercise Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {workout.workout_exercises.slice(0, 3).map((ex) => (
            <div key={ex.id} className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-foreground/[0.03] border border-foreground/5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-foreground/40">
              {ex.exercises?.name || 'Unknown'}
            </div>
          ))}
          {workout.workout_exercises.length > 3 && (
            <div key="more" className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-foreground/[0.03] border border-foreground/5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-foreground/20">
              +{workout.workout_exercises.length - 3} more
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className="flex items-center justify-between border-t border-foreground/5 pt-6 gap-2">
          <div className="flex-1">
            <p className="text-base sm:text-lg font-bold tracking-tighter">{exerciseCount}</p>
            <p className="stat-label truncate">Exercises</p>
          </div>
          <div className="h-6 w-px bg-foreground/5 shrink-0" />
          <div className="flex-1 text-center px-1">
            <p className="text-base sm:text-lg font-bold tracking-tighter">{totalSets}</p>
            <p className="stat-label truncate">Sets</p>
          </div>
          {totalVolume > 0 && (
            <>
              <div className="h-6 w-px bg-foreground/5 shrink-0" />
              <div className="flex-1 text-right">
                <p className="text-base sm:text-lg font-bold tracking-tighter text-blue-400 whitespace-nowrap">
                  {totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)}k` : totalVolume.toLocaleString()}
                  <span className="text-[9px] sm:text-[10px] text-foreground/20 ml-0.5">LBS</span>
                </p>
                <p className="stat-label truncate">Volume</p>
              </div>
            </>
          )}
        </div>
      </Card>
    </Link>
  )
}

