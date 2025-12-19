import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { WorkoutCard } from '@/components/workouts/workout-card'
import Link from 'next/link'
import { Plus, Dumbbell, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Workouts | ProjectAthlete',
  description: 'View and log your training sessions.',
}

export default async function WorkoutsPage() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  // Check if coach/admin
  const { data: isCoachOrAdmin } = await (supabase.rpc as any)('is_coach_or_admin')
  
  // Always filter to only show the current user's workouts
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
    .eq('user_id', user.id)
    .order('date', { ascending: false })
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Workouts</h1>
          <p className="text-muted-foreground">
            {workouts?.length || 0} workouts logged
          </p>
        </div>
        <div className="flex gap-2">
          {isCoachOrAdmin && (
            <Button asChild variant="outline" className="gap-2">
              <Link href="/workouts/all">
                <Users className="h-4 w-4" />
                All Athletes
              </Link>
            </Button>
          )}
          <Button asChild className="gap-2">
          <Link href="/workouts/new">
              <Plus className="h-4 w-4" />
            Log Workout
          </Link>
        </Button>
        </div>
      </div>
      
      {workouts && workouts.length > 0 ? (
        <div className="space-y-6">
          {(workouts as any[]).map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h3 className="text-lg font-medium">No workouts yet</h3>
          <p className="text-muted-foreground mb-4">Start logging to track your progress</p>
          <Button asChild className="gap-2">
            <Link href="/workouts/new">
              <Plus className="h-4 w-4" />
              Log Your First Workout
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
