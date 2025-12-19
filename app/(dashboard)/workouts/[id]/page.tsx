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
      .select('id, name, category, default_metric')
      .in('id', exerciseIds)
    
    const { data: sets } = await supabase
      .from('workout_sets')
      .select('*')
      .in('workout_exercise_id', exercisesWithDetails.map(we => we.id))
      .order('set_number', { ascending: true })

    const exerciseList = (exerciseNames || []) as { id: string; name: string; category: string; default_metric: string }[]
    const setList = (sets || []) as { 
      id: string; 
      workout_exercise_id: string; 
      set_number: number; 
      weight: number; 
      reps: number;
      distance_meters: number | null;
      time_seconds: number | null;
      calories: number | null;
    }[]
    
    exercisesWithDetails.forEach((we: any) => {
      we.exercises = exerciseList.find(e => e.id === we.exercise_id)
      we.workout_sets = setList.filter(s => s.workout_exercise_id === we.id)
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
      default_metric: we.exercises?.default_metric,
      sets: we.workout_sets.map((s: any) => ({
            id: s.id,
        weight: s.weight ? Number(s.weight) : undefined,
        reps: s.reps ? Number(s.reps) : undefined,
        distance_meters: s.distance_meters ? Number(s.distance_meters) : undefined,
        time_seconds: s.time_seconds ? Number(s.time_seconds) : undefined,
        calories: s.calories ? Number(s.calories) : undefined,
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

