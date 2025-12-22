'use client'

import { useTransition } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Heart, Trash2, Trophy, Award, Zap } from 'lucide-react'
import { toggleFeedReaction, deletePost } from '@/app/feed/actions'
import { cn } from '@/lib/utils'

import { UserAvatar } from '@/components/shared/user-avatar'

interface FeedItemProps {
  post: {
    id: string
    user_id: string
    display_name: string | null
    avatar_url: string | null
    user_role?: 'athlete' | 'coach' | 'admin'
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
  { type: 'fire', icon: Zap, color: 'text-blue-500', fill: 'fill-blue-500' },
  { type: 'respect', icon: Award, color: 'text-primary', fill: 'fill-primary' },
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
    <div className={cn(
      "rounded-2xl bg-foreground/[0.02] border border-foreground/5 p-4 transition-all hover:bg-foreground/[0.04]",
      post.post_type === 'pr' && "border-[#14e0d4]/20 bg-[#14e0d4]/[0.02]",
      post.post_type === 'achievement' && "border-purple-500/20 bg-purple-500/[0.02]"
    )}>
      {/* Header Row */}
      <div className="flex items-center gap-3">
        <UserAvatar 
          src={post.avatar_url} 
          name={post.display_name} 
          role={post.user_role || 'athlete'} 
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm truncate">
              {post.display_name || 'Anonymous'}
            </p>
            {post.post_type === 'pr' && (
              <span className="text-[8px] font-black uppercase tracking-widest text-[#14e0d4]">PR</span>
            )}
            {post.post_type === 'achievement' && (
              <span className="text-[8px] font-black uppercase tracking-widest text-purple-400">🏆</span>
            )}
          </div>
          <p className="text-[10px] text-foreground/30">
            {new Date(post.created_at).toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              hour: 'numeric', 
              minute: '2-digit' 
            })}
          </p>
        </div>
        {isOwner && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDelete}
            className="h-7 w-7 text-foreground/10 hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="mt-3">
        {post.post_type === 'pr' ? (
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-[#14e0d4] flex items-center justify-center shrink-0">
              <Trophy className="h-5 w-5 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-black tracking-tighter">
                {post.metadata?.weight} <span className="text-[10px] text-foreground/30">{post.metadata?.unit || 'lbs'}</span>
              </p>
              <p className="text-xs font-medium text-[#14e0d4] truncate">{post.metadata?.exercise_name}</p>
            </div>
          </div>
        ) : post.post_type === 'achievement' ? (
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-purple-500 flex items-center justify-center shrink-0">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold tracking-tight">
                {post.metadata?.badge_name || 'Challenge Achievement'}
              </p>
              {post.metadata?.challenge_name && (
                <p className="text-xs text-purple-400 truncate">{post.metadata?.challenge_name}</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-foreground/70 leading-relaxed">
            {post.content}
          </p>
        )}
      </div>

      {/* Reactions - Inline */}
      <div className="mt-3 flex items-center gap-1.5">
        {REACTION_TYPES.map((reaction) => {
          const count = post.reaction_counts[reaction.type] || 0
          const hasReacted = post.user_reactions.includes(reaction.type)
          const Icon = reaction.icon

          return (
            <button
              key={reaction.type}
              onClick={() => handleReaction(reaction.type)}
              className={cn(
                "h-7 flex items-center gap-1 rounded-lg px-2 transition-all text-foreground/20",
                hasReacted && cn("bg-foreground/10", reaction.color)
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", hasReacted && reaction.fill)} />
              {count > 0 && <span className="text-[10px] font-bold">{count}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

