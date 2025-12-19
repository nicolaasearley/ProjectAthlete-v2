import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { CommunityWorkoutCard } from '@/components/community/workout-card'
import Link from 'next/link'
import { Plus, Users } from 'lucide-react'

interface CommunityPageProps {
  searchParams: Promise<{
    type?: string
    search?: string
  }>
}

export default async function CommunityPage({ searchParams }: CommunityPageProps) {
  const params = await searchParams
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()
  
  if (!profile) return null
  
  let query = supabase
    .from('community_workouts')
    .select(`
      *,
      author:profiles(display_name),
      workout_comments(id),
      workout_reactions(id)
    `)
    .eq('org_id', profile.org_id)
    .eq('status', 'approved')
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
  
  if (params.type && params.type !== 'all') {
    query = query.eq('workout_type', params.type)
  }
  
  if (params.search) {
    query = query.ilike('title', `%${params.search}%`)
  }
  
  const { data: workouts } = await query
  
  // Transform counts
  const transformedWorkouts = (workouts || []).map(w => ({
    ...w,
    comment_count: (w.workout_comments as any[]).length,
    reaction_count: (w.workout_reactions as any[]).length
  }))
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-muted-foreground">Workouts from your community</p>
        </div>
        <Button asChild>
          <Link href="/community/submit">
            <Plus className="h-4 w-4 mr-2" />
            Submit Workout
          </Link>
        </Button>
      </div>
      
      {/* Featured / Empty State */}
      {transformedWorkouts.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h3 className="text-lg font-medium">No community workouts yet</h3>
          <p className="text-muted-foreground mb-4">Be the first to share a workout with your organization!</p>
          <Button asChild variant="outline">
            <Link href="/community/submit">
              <Plus className="h-4 w-4 mr-2" />
              Share a Workout
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {transformedWorkouts.map((workout) => (
            <CommunityWorkoutCard key={workout.id} workout={workout as any} />
          ))}
        </div>
      )}
    </div>
  )
}

