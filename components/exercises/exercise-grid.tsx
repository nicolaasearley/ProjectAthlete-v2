import { ExerciseCard } from './exercise-card'
import type { Exercise, ExerciseAlias } from '@/types/database'

interface ExerciseWithAliases extends Exercise {
  exercise_aliases: ExerciseAlias[]
}

interface ExerciseGridProps {
  exercises: ExerciseWithAliases[]
}

export function ExerciseGrid({ exercises }: ExerciseGridProps) {
  if (exercises.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No exercises found</p>
      </div>
    )
  }
  
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </div>
  )
}

