import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
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
    .select('*')
    .eq('id', id)
    .single()
  
  if (!workout) {
    notFound()
  }

  // Force narrowing for TypeScript
  const workoutData = workout as any

  // Fetch author
  const { data: author } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', workoutData.author_id)
    .single()
  
  workoutData.author = author

  // Fetch comments
  const { data: comments } = await supabase
    .from('workout_comments')
    .select('*')
    .eq('workout_id', id)
    .order('created_at', { ascending: true })
  
  const commentsWithAuthors = [...(comments || [])] as any[]
  if (commentsWithAuthors.length > 0) {
    const commenterIds = [...new Set(commentsWithAuthors.map(c => c.user_id))] as string[]
    const { data: commenters } = await supabase
      .from('profiles')
      .select('id, display_name')
      .in('id', commenterIds)
    
    const commenterList = (commenters || []) as { id: string; display_name: string | null }[]
    commentsWithAuthors.forEach((c: any) => {
      c.profiles = commenterList.find(p => p.id === c.user_id)
    })
  }
  workoutData.workout_comments = commentsWithAuthors
  
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
                {workoutData.workout_type.replace('_', ' ')}
              </Badge>
              {workoutData.is_featured && (
                <Badge variant="default" className="bg-yellow-600 text-white">
                  <Star className="h-3 w-3 mr-1 fill-white" />
                  Featured
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold">{workoutData.title}</h1>
            <p className="text-sm text-muted-foreground">
              by {workoutData.author?.display_name || 'Anonymous'} • {new Date(workoutData.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          {isAdmin && (
            <form action={toggleFeatured.bind(null, id)}>
              <Button variant="outline" size="sm" type="submit" className="w-full sm:w-auto gap-2">
                <Star className={`h-4 w-4 ${workoutData.is_featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                {workoutData.is_featured ? 'Unfeature' : 'Feature'}
              </Button>
            </form>
          )}
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap leading-relaxed">{workoutData.description}</p>
          </div>
          
          {workoutData.time_cap_minutes && (
            <div className="p-3 rounded-lg bg-accent/50 inline-block">
              <p className="text-sm font-semibold">Time Cap: {workoutData.time_cap_minutes} minutes</p>
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
        comments={(workoutData.workout_comments as any[]) || []}
        userId={user.id}
        onAddComment={addComment}
        onDeleteComment={deleteComment}
      />
    </div>
  )
}

