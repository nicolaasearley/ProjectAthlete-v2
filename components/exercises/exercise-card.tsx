import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Exercise, ExerciseAlias } from '@/types/database'

interface ExerciseWithAliases extends Exercise {
  exercise_aliases: ExerciseAlias[]
}

interface ExerciseCardProps {
  exercise: ExerciseWithAliases
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <Link href={`/exercises/${exercise.id}`}>
      <Card hoverable className="h-full cursor-pointer">
        <CardHeader className="pb-2">
          <CardTitle className="text-base line-clamp-1">{exercise.name}</CardTitle>
          <Badge variant="secondary" className="w-fit capitalize text-xs">
            {exercise.category}
          </Badge>
        </CardHeader>
        <CardContent>
          {exercise.exercise_aliases && exercise.exercise_aliases.length > 0 && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              Also: {exercise.exercise_aliases.map(a => a.alias).join(', ')}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

