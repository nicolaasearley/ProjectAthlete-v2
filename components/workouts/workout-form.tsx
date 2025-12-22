'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExerciseInput } from './exercise-input'
import { TemplatePicker } from './template-picker'
import { Plus, Loader2, Trash2, Copy, Save } from 'lucide-react'
import { createTemplate } from '@/app/workouts/templates/actions'
import type { WorkoutFormData, WorkoutExerciseInput } from '@/types/database'

interface WorkoutFormProps {
  action: (data: WorkoutFormData) => Promise<void>
  initialData?: WorkoutFormData
  deleteAction?: () => Promise<void>
  templates?: any[]
}

export function WorkoutForm({ action, initialData, deleteAction, templates = [] }: WorkoutFormProps) {
  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSavingTemplate, setIsSavingTemplate] = useState(false)
  
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split('T')[0]
  )
  const [notes, setNotes] = useState(initialData?.notes || '')
  const [exercises, setExercises] = useState<WorkoutExerciseInput[]>(
    initialData?.exercises || []
  )

  const handleSelectTemplate = (template: any) => {
    setExercises(template.template_exercises.map((te: any) => ({
      exercise_id: te.exercise_id,
      exercise_name: te.exercises?.name,
      default_metric: te.exercises?.default_metric,
      sets: te.template_sets.map((ts: any) => ({
        weight: ts.weight,
        reps: ts.reps,
        distance_meters: ts.distance_meters,
        time_seconds: ts.time_seconds,
        calories: ts.calories,
      }))
    })))
    if (template.notes) setNotes(template.notes)
  }

  const handleSaveTemplate = () => {
    const name = prompt('Enter a name for this template:')
    if (!name) return

    setIsSavingTemplate(true)
    startTransition(async () => {
      try {
        await createTemplate(name, { date, notes, exercises })
        alert('Template saved!')
      } catch (error) {
        console.error('Failed to save template:', error)
        alert('Failed to save template')
      } finally {
        setIsSavingTemplate(false)
      }
    })
  }
  
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
      (ex) => ex.exercise_id && ex.sets.some((s) => 
        (s.weight ?? 0) > 0 || 
        (s.reps ?? 0) > 0 || 
        (s.distance_meters ?? 0) > 0 || 
        (s.time_seconds ?? 0) > 0 || 
        (s.calories ?? 0) > 0
      )
    )
    
    if (validExercises.length === 0) return
    
    startTransition(async () => {
      try {
        await action({
          date,
          notes: notes || undefined,
          exercises: validExercises,
        })
      } catch (error: any) {
        if (error.message === 'NEXT_REDIRECT') return
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
      } catch (error: any) {
        if (error.message === 'NEXT_REDIRECT') return
        console.error('Failed to delete workout:', error)
        setIsDeleting(false)
      }
    })
  }
  
  return (
    <div className="space-y-6">
      {!initialData && templates.length > 0 && (
        <TemplatePicker 
          templates={templates} 
          onSelect={handleSelectTemplate} 
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Workout Details</CardTitle>
            {!initialData && exercises.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-primary gap-1.5"
                onClick={handleSaveTemplate}
                disabled={isSavingTemplate || isPending}
              >
                {isSavingTemplate ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save as Template
              </Button>
            )}
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
            className="flex-1 gap-2"
          >
            {isPending && !isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            {initialData ? 'Save Changes' : 'Log Workout'}
          </Button>
          
          {deleteAction && (
            <Button 
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending || isDeleting}
              className="gap-2"
            >
              {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {!isDeleting && <Trash2 className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
