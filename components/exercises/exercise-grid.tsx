import { ExerciseCard } from './exercise-card'
import { Card } from '@/components/ui/card'
import { Dumbbell } from 'lucide-react'
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
      <Card premium className="text-center py-16">
        <Dumbbell className="h-16 w-16 mx-auto mb-6 text-white/10" />
        <p className="text-xl font-bold tracking-tight mb-2">No exercises found</p>
        <p className="text-white/40 text-sm">Try adjusting your search or filter criteria.</p>
      </Card>
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

