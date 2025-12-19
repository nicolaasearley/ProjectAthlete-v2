'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import type { CommunityWorkoutFormData, WorkoutType } from '@/types/database'

interface SubmitWorkoutFormProps {
  action: (data: CommunityWorkoutFormData) => Promise<void>
}

const WORKOUT_TYPES: { value: WorkoutType; label: string }[] = [
  { value: 'amrap', label: 'AMRAP' },
  { value: 'for_time', label: 'For Time' },
  { value: 'emom', label: 'EMOM' },
  { value: 'other', label: 'Other' },
]

export function SubmitWorkoutForm({ action }: SubmitWorkoutFormProps) {
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState('')
  const [workoutType, setWorkoutType] = useState<WorkoutType>('amrap')
  const [description, setDescription] = useState('')
  const [timeCap, setTimeCap] = useState<number | ''>('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !description) return
    
    startTransition(async () => {
      try {
        await action({
          title,
          description,
          workout_type: workoutType,
          time_cap_minutes: timeCap === '' ? null : timeCap,
        })
      } catch (error) {
        console.error('Failed to submit workout:', error)
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Workout Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Workout Title"
            placeholder="e.g., The Chief, Fran, Heavy Day"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <div className="flex flex-wrap gap-2">
              {WORKOUT_TYPES.map((type) => (
                <Button
                  key={type.value}
                  type="button"
                  variant={workoutType === type.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setWorkoutType(type.value)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              placeholder="Describe the workout, rounds, reps, and movements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-40 rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none"
              required
            />
          </div>
          
          <Input
            label="Time Cap (minutes, optional)"
            type="number"
            placeholder="e.g., 20"
            value={timeCap}
            onChange={(e) => setTimeCap(e.target.value === '' ? '' : parseInt(e.target.value))}
          />
          
          <Button 
            type="submit" 
            className="w-full h-12"
            disabled={isPending || !title || !description}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Submit for Approval
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Workouts are reviewed by coaches before being visible to the community.
          </p>
        </CardContent>
      </Card>
    </form>
  )
}

