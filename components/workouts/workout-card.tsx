import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, User } from 'lucide-react'

interface WorkoutExerciseData {
  id: string
  exercises: { name: string } | null
  workout_sets: { id: string }[]
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
  
  const formattedDate = new Date(workout.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  
  return (
    <Link href={`/workouts/${workout.id}`}>
      <Card hoverable className="group p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="stat-label mb-1">Workout Session</div>
            <h3 className="text-xl font-bold tracking-tight">{formattedDate}</h3>
            {showUser && workout.user && (
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-1 flex items-center gap-1">
                <User className="h-3 w-3" />
                {workout.user.display_name || 'Anonymous'}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white/20 group-hover:text-blue-400 transition-colors" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {workout.workout_exercises.slice(0, 4).map((ex) => (
            <div key={ex.id} className="px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-wider text-white/40">
              {ex.exercises?.name || 'Unknown'}
            </div>
          ))}
          {workout.workout_exercises.length > 4 && (
            <div className="px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-wider text-white/20">
              +{workout.workout_exercises.length - 4}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-4 border-t border-white/5 pt-4">
          <div>
            <p className="text-xs font-bold tracking-tight">{exerciseCount}</p>
            <p className="stat-label">Exercises</p>
          </div>
          <div className="h-4 w-px bg-white/5" />
          <div>
            <p className="text-xs font-bold tracking-tight">{totalSets}</p>
            <p className="stat-label">Total Sets</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}

