import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { WorkoutCard } from '@/components/workouts/workout-card'
import Link from 'next/link'
import { ArrowLeft, Dumbbell, Users } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function AllWorkoutsPage() {
  const supabase = await createClient()
  
  // Check if coach/admin
  const { data: isCoachOrAdmin } = await (supabase.rpc as any)('is_coach_or_admin')
  if (!isCoachOrAdmin) redirect('/workouts')
  
  // Get current user's org
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()
  
  if (!profile) redirect('/workouts')
  
  // Get all workouts from the organization
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
    .eq('org_id', (profile as any).org_id)
    .order('date', { ascending: false })
    .limit(100)

  // Fetch profiles separately for names
  const workoutsWithUsers = [...(workouts || [])] as any[]
  if (workoutsWithUsers.length > 0) {
    const userIds = [...new Set(workoutsWithUsers.map(w => w.user_id))] as string[]
    const { data: authors } = await supabase
      .from('profiles')
      .select('id, display_name')
      .in('id', userIds)
    
    workoutsWithUsers.forEach((w: any) => {
      w.user = authors?.find(a => a.id === w.user_id)
    })
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/workouts">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">All Athletes&apos; Workouts</h1>
          <p className="text-muted-foreground">
            {workoutsWithUsers.length} workouts from your organization
          </p>
        </div>
      </div>
      
      {workoutsWithUsers.length > 0 ? (
        <div className="space-y-4">
          {workoutsWithUsers.map((workout) => (
            <WorkoutCard 
              key={workout.id} 
              workout={workout as any}
              showUser
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h3 className="text-lg font-medium">No workouts yet</h3>
          <p className="text-muted-foreground">Athletes haven&apos;t logged any workouts yet</p>
        </div>
      )}
    </div>
  )
}

