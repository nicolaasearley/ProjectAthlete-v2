import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { WorkoutForm } from '@/components/workouts/workout-form'
import { updateWorkout, deleteWorkout } from '@/app/workouts/actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface WorkoutPageProps {
  params: Promise<{ id: string }>
}

export default async function WorkoutPage({ params }: WorkoutPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: workout } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('id', id)
    .single()
  
  if (!workout) {
    notFound()
  }

  // Force narrowing for TypeScript
  const workoutData = workout as any

  // Fetch exercises and sets separately
  const { data: workoutExercises } = await supabase
    .from('workout_exercises')
    .select('*')
    .eq('session_id', id)
    .order('order_index', { ascending: true })

  const exercisesWithDetails = [...(workoutExercises || [])] as any[]
  if (exercisesWithDetails.length > 0) {
    const exerciseIds = [...new Set(exercisesWithDetails.map(we => we.exercise_id))] as string[]
    const { data: exerciseNames } = await supabase
      .from('exercises')
      .select('id, name, category')
      .in('id', exerciseIds)
    
    const { data: sets } = await supabase
      .from('workout_sets')
      .select('*')
      .in('workout_exercise_id', exercisesWithDetails.map(we => we.id))
      .order('set_number', { ascending: true })

    exercisesWithDetails.forEach((we: any) => {
      we.exercises = exerciseNames?.find(e => e.id === we.exercise_id)
      we.workout_sets = sets?.filter(s => s.workout_exercise_id === we.id) || []
    })
  }
  
  // Transform to form data
  const initialData = {
    date: workoutData.date,
    notes: workoutData.notes || '',
    exercises: exercisesWithDetails.map((we) => ({
      id: we.id,
      exercise_id: we.exercise_id,
      exercise_name: we.exercises?.name,
      sets: we.workout_sets.map((s: any) => ({
        id: s.id,
        weight: Number(s.weight),
        reps: Number(s.reps),
      })),
    })),
  }
  
  const updateAction = updateWorkout.bind(null, id)
  const deleteAction = deleteWorkout.bind(null, id)
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/workouts"
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Edit Workout</h1>
          <p className="text-muted-foreground">
            {new Date(workoutData.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
      
      <WorkoutForm 
        action={updateAction}
        initialData={initialData}
        deleteAction={deleteAction}
      />
    </div>
  )
}

