import { WorkoutForm } from '@/components/workouts/workout-form'
import { createWorkout } from '@/app/workouts/actions'
import { createClient } from '@/lib/supabase/server'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Log Workout | ProjectAthlete',
  description: 'Record your training session.',
}

export default async function NewWorkoutPage() {
  const supabase = await createClient()
  
  const { data: templates } = await supabase
    .from('workout_templates')
    .select(`
      *,
      template_exercises(
        *,
        exercises(id, name, category, default_metric),
        template_sets(*)
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Log Workout</h1>
        <p className="text-muted-foreground">Record your training session</p>
      </div>
      
      <WorkoutForm 
        action={createWorkout} 
        templates={templates || []}
      />
    </div>
  )
}

