'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExercisePicker } from '@/components/exercises/exercise-picker'
import { SetRow } from './set-row'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import type { WorkoutExerciseInput, Exercise } from '@/types/database'

interface ExerciseInputProps {
  data: WorkoutExerciseInput
  onChange: (data: WorkoutExerciseInput) => void
  onRemove: () => void
}

export function ExerciseInput({ data, onChange, onRemove }: ExerciseInputProps) {
  const handleExerciseSelect = (exercise: Exercise) => {
    onChange({
      ...data,
      exercise_id: exercise.id,
      exercise_name: exercise.name,
    })
  }
  
  const addSet = () => {
    // Copy last set's values for convenience
    const lastSet = data.sets[data.sets.length - 1]
    onChange({
      ...data,
      sets: [
        ...data.sets,
        { weight: lastSet?.weight || 0, reps: lastSet?.reps || 0 },
      ],
    })
  }
  
  const updateSet = (index: number, set: { weight: number; reps: number }) => {
    const updated = [...data.sets]
    updated[index] = set
    onChange({ ...data, sets: updated })
  }
  
  const removeSet = (index: number) => {
    if (data.sets.length <= 1) return
    onChange({
      ...data,
      sets: data.sets.filter((_, i) => i !== index),
    })
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 py-3">
        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
        <div className="flex-1">
          <ExercisePicker
            value={data.exercise_id}
            onSelect={handleExerciseSelect}
            placeholder={data.exercise_name || 'Select exercise...'}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 text-xs text-muted-foreground px-1">
          <div className="w-8 text-center">Set</div>
          <div>Weight (lbs)</div>
          <div>Reps</div>
          <div className="w-8"></div>
        </div>
        
        {/* Sets */}
        {data.sets.map((set, index) => (
          <SetRow
            key={index}
            setNumber={index + 1}
            weight={set.weight}
            reps={set.reps}
            onChange={(updated) => updateSet(index, updated)}
            onRemove={() => removeSet(index)}
            canRemove={data.sets.length > 1}
          />
        ))}
        
        {/* Add Set Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addSet}
          className="w-full text-muted-foreground"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Set
        </Button>
      </CardContent>
    </Card>
  )
}

