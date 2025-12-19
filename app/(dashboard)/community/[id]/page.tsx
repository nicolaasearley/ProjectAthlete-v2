import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ReactionBar } from '@/components/community/reaction-bar'
import { CommentSection } from '@/components/community/comment-section'
import { toggleReaction, addComment, deleteComment } from '@/app/community/actions'
import { toggleFeatured } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Star } from 'lucide-react'

interface WorkoutPageProps {
  params: Promise<{ id: string }>
}

export default async function CommunityWorkoutPage({ params }: WorkoutPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data: workout } = await supabase
    .from('community_workouts')
    .select(`
      *,
      author:profiles(display_name),
      workout_comments(
        *,
        profiles(display_name)
      )
    `)
    .eq('id', id)
    .single()
  
  if (!workout) notFound()
  
  // Get reaction counts
  const { data: counts } = await (supabase.rpc as any)('get_workout_reaction_counts', {
    p_workout_id: id
  })
  
  // Get user's reactions
  const { data: userReactions } = await (supabase.rpc as any)('get_user_workout_reactions', {
    p_workout_id: id
  })
  
  // Check if admin
  const { data: isAdmin } = await (supabase.rpc as any)('is_coach_or_admin')
  
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/community" className="p-2 rounded-lg hover:bg-accent transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="capitalize">
                {workout.workout_type.replace('_', ' ')}
              </Badge>
              {workout.is_featured && (
                <Badge variant="default" className="bg-yellow-600 text-white">
                  <Star className="h-3 w-3 mr-1 fill-white" />
                  Featured
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold">{workout.title}</h1>
            <p className="text-sm text-muted-foreground">
              by {workout.author?.display_name || 'Anonymous'} • {new Date(workout.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        {isAdmin && (
          <form action={toggleFeatured.bind(null, id)}>
            <Button variant="outline" size="sm" type="submit">
              <Star className={`h-4 w-4 mr-2 ${workout.is_featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
              {workout.is_featured ? 'Unfeature' : 'Feature'}
            </Button>
          </form>
        )}
      </div>
      
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap leading-relaxed">{workout.description}</p>
          </div>
          
          {workout.time_cap_minutes && (
            <div className="p-3 rounded-lg bg-accent/50 inline-block">
              <p className="text-sm font-semibold">Time Cap: {workout.time_cap_minutes} minutes</p>
            </div>
          )}
          
          <div className="pt-4 border-t border-border">
            <ReactionBar 
              workoutId={id}
              counts={(counts as any[]) || []}
              userReactions={(userReactions as any[]) || []}
              onToggle={toggleReaction}
            />
          </div>
        </CardContent>
      </Card>
      
      <CommentSection 
        workoutId={id}
        comments={(workout.workout_comments as any[]) || []}
        userId={user.id}
        onAddComment={addComment}
        onDeleteComment={deleteComment}
      />
    </div>
  )
}

