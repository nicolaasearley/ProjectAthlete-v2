import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Star } from 'lucide-react'
import type { CommunityWorkout } from '@/types/database'

interface CommunityWorkoutWithMeta extends CommunityWorkout {
  author?: { display_name: string | null } | null
  comment_count?: number
  reaction_count?: number
}

interface CommunityWorkoutCardProps {
  workout: CommunityWorkoutWithMeta
}

export function CommunityWorkoutCard({ workout }: CommunityWorkoutCardProps) {
  return (
    <Link href={`/community/${workout.id}`}>
      <Card hoverable className="h-full cursor-pointer relative overflow-hidden">
        {workout.is_featured && (
          <div className="absolute top-0 right-0 p-2">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          </div>
        )}
        
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-1">
            <Badge variant="secondary" className="capitalize text-[10px]">
              {workout.workout_type.replace('_', ' ')}
            </Badge>
            <span className="text-[10px] text-muted-foreground">
              {new Date(workout.created_at).toLocaleDateString('en-US')}
            </span>
          </div>
          <CardTitle className="text-base line-clamp-1">{workout.title}</CardTitle>
          <p className="text-xs text-muted-foreground">
            by {workout.author?.display_name || 'Anonymous'}
          </p>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {workout.description}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {workout.comment_count || 0}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-primary">💪</span>
              {workout.reaction_count || 0}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

