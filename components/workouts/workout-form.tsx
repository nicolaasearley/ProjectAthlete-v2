'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExerciseInput } from './exercise-input'
import { Plus, Loader2, Trash2 } from 'lucide-react'
import type { WorkoutFormData, WorkoutExerciseInput } from '@/types/database'

interface WorkoutFormProps {
  action: (data: WorkoutFormData) => Promise<void>
  initialData?: WorkoutFormData
  deleteAction?: () => Promise<void>
}

export function WorkoutForm({ action, initialData, deleteAction }: WorkoutFormProps) {
  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split('T')[0]
  )
  const [notes, setNotes] = useState(initialData?.notes || '')
  const [exercises, setExercises] = useState<WorkoutExerciseInput[]>(
    initialData?.exercises || []
  )
  
  const addExercise = () => {
    setExercises([
      ...exercises,
      { exercise_id: '', sets: [{ weight: 0, reps: 0 }] },
    ])
  }
  
  const updateExercise = (index: number, data: WorkoutExerciseInput) => {
    const updated = [...exercises]
    updated[index] = data
    setExercises(updated)
  }
  
  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate
    if (!date) return
    if (exercises.length === 0) return
    
    const validExercises = exercises.filter(
      (ex) => ex.exercise_id && ex.sets.some((s) => s.weight > 0 && s.reps > 0)
    )
    
    if (validExercises.length === 0) return
    
    startTransition(async () => {
      try {
        await action({
          date,
          notes: notes || undefined,
          exercises: validExercises,
        })
      } catch (error) {
        console.error('Failed to save workout:', error)
      }
    })
  }
  
  const handleDelete = () => {
    if (!deleteAction) return
    if (!confirm('Are you sure you want to delete this workout?')) return
    
    setIsDeleting(true)
    startTransition(async () => {
      try {
        await deleteAction()
      } catch (error) {
        console.error('Failed to delete workout:', error)
        setIsDeleting(false)
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workout Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="date"
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did the workout feel?"
              className="w-full h-20 rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Exercises</h2>
          <Button type="button" variant="outline" size="sm" onClick={addExercise}>
            <Plus className="h-4 w-4 mr-1" />
            Add Exercise
          </Button>
        </div>
        
        {exercises.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <p>No exercises added yet</p>
              <Button 
                type="button" 
                variant="outline" 
                className="mt-4"
                onClick={addExercise}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Your First Exercise
              </Button>
            </CardContent>
          </Card>
        ) : (
          exercises.map((exercise, index) => (
            <ExerciseInput
              key={index}
              data={exercise}
              onChange={(data) => updateExercise(index, data)}
              onRemove={() => removeExercise(index)}
            />
          ))
        )}
      </div>
      
      <div className="flex gap-4">
        <Button 
          type="submit" 
          disabled={isPending || exercises.length === 0}
          className="flex-1"
        >
          {isPending && !isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {initialData ? 'Save Changes' : 'Log Workout'}
        </Button>
        
        {deleteAction && (
          <Button 
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending || isDeleting}
          >
            {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {!isDeleting && <Trash2 className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </form>
  )
}

