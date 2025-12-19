import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { WorkoutCard } from '@/components/workouts/workout-card'
import Link from 'next/link'
import { Plus, Dumbbell } from 'lucide-react'

export default async function WorkoutsPage() {
  const supabase = await createClient()
  
  const { data: workouts } = await supabase
    .from('workout_sessions')
    .select(`
      *,
      workout_exercises(
        id,
        exercises(name),
        workout_sets(id)
      )
    `)
    .order('date', { ascending: false })
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workouts</h1>
          <p className="text-muted-foreground">
            {workouts?.length || 0} workouts logged
          </p>
        </div>
        <Button asChild>
          <Link href="/workouts/new">
            <Plus className="h-4 w-4 mr-2" />
            Log Workout
          </Link>
        </Button>
      </div>
      
      {workouts && workouts.length > 0 ? (
        <div className="space-y-4">
          {(workouts as any[]).map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h3 className="text-lg font-medium">No workouts yet</h3>
          <p className="text-muted-foreground mb-4">Start logging to track your progress</p>
          <Button asChild>
            <Link href="/workouts/new">
              <Plus className="h-4 w-4 mr-2" />
              Log Your First Workout
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

