import { WorkoutForm } from '@/components/workouts/workout-form'
import { createWorkout } from '@/app/workouts/actions'

export default function NewWorkoutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Log Workout</h1>
        <p className="text-muted-foreground">Record your training session</p>
      </div>
      
      <WorkoutForm action={createWorkout} />
    </div>
  )
}

