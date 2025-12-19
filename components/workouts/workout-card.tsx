import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'

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
}

interface WorkoutCardProps {
  workout: WorkoutData
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
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
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {formattedDate}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="outline">
                {totalSets} set{totalSets !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {workout.workout_exercises.slice(0, 5).map((ex) => (
              <Badge key={ex.id} variant="outline" className="text-xs">
                {ex.exercises?.name || 'Unknown'}
              </Badge>
            ))}
            {workout.workout_exercises.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{workout.workout_exercises.length - 5} more
              </Badge>
            )}
          </div>
          {workout.notes && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
              {workout.notes}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

