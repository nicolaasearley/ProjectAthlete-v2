'use client'

import { useTransition } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Heart, Trash2, Trophy, Award, Zap } from 'lucide-react'
import { toggleFeedReaction, deletePost } from '@/app/feed/actions'
import { cn } from '@/lib/utils'

interface FeedItemProps {
  post: {
    id: string
    user_id: string
    display_name: string | null
    avatar_url: string | null
    post_type: 'text' | 'pr' | 'achievement' | 'milestone'
    content: string | null
    metadata: any
    created_at: string
    reaction_counts: Record<string, number>
    user_reactions: string[]
  }
  currentUserId: string
}

const REACTION_TYPES = [
  { type: 'like', icon: Heart, color: 'text-red-500', fill: 'fill-red-500' },
  { type: 'fire', icon: Zap, color: 'text-orange-500', fill: 'fill-orange-500' },
  { type: 'respect', icon: Award, color: 'text-blue-500', fill: 'fill-blue-500' },
]

export function FeedItem({ post, currentUserId }: FeedItemProps) {
  const [isPending, startTransition] = useTransition()
  const isOwner = post.user_id === currentUserId

  const handleReaction = (type: string) => {
    startTransition(async () => {
      await toggleFeedReaction(post.id, type)
    })
  }

  const handleDelete = () => {
    if (!confirm('Are you sure you want to delete this post?')) return
    startTransition(async () => {
      await deletePost(post.id)
    })
  }

  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:border-primary/30",
      post.post_type === 'pr' && "border-orange-500/30 bg-orange-500/5",
      post.post_type === 'achievement' && "border-yellow-500/30 bg-yellow-500/5"
    )}>
      <CardContent className="p-4 sm:p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center overflow-hidden shrink-0">
              {post.avatar_url ? (
                <img src={post.avatar_url} alt={post.display_name || ''} className="h-full w-full object-cover" />
              ) : (
                <User className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm sm:text-base">
                  {post.display_name || 'Anonymous'}
                </p>
                {post.post_type === 'pr' && (
                  <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-200 text-[10px] uppercase h-5">
                    New PR
                  </Badge>
                )}
                {post.post_type === 'achievement' && (
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200 text-[10px] uppercase h-5">
                    Achievement
                  </Badge>
                )}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {new Date(post.created_at).toLocaleString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  hour: 'numeric', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>

          {isOwner && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleDelete}
              className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {post.post_type === 'pr' ? (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg leading-tight">
                  {post.metadata?.weight} {post.metadata?.unit || 'lbs'}
                </p>
                <p className="text-sm text-orange-700 font-medium">
                  {post.metadata?.exercise_name}
                </p>
                <p className="text-[10px] text-orange-600/70 uppercase font-bold tracking-wider">
                  New Personal Record!
                </p>
              </div>
            </div>
          ) : post.post_type === 'achievement' ? (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center shrink-0">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg leading-tight">
                  Challenge Completed
                </p>
                <p className="text-sm text-yellow-700 font-medium">
                  {post.metadata?.challenge_name}
                </p>
                <p className="text-[10px] text-yellow-600/70 uppercase font-bold tracking-wider">
                  Earned a new badge!
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          )}
        </div>

        <div className="pt-2 flex items-center gap-2">
          {REACTION_TYPES.map((reaction) => {
            const count = post.reaction_counts[reaction.type] || 0
            const hasReacted = post.user_reactions.includes(reaction.type)
            const Icon = reaction.icon

            return (
              <Button
                key={reaction.type}
                variant="ghost"
                size="sm"
                onClick={() => handleReaction(reaction.type)}
                className={cn(
                  "h-8 gap-1.5 rounded-full px-3 transition-all",
                  hasReacted 
                    ? cn("bg-accent", reaction.color) 
                    : "hover:bg-accent text-muted-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", hasReacted && reaction.fill)} />
                {count > 0 && <span className="text-xs font-bold">{count}</span>}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

