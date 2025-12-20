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
    <Card premium className={cn(
      "overflow-hidden transition-all hover:border-white/10 group",
      post.post_type === 'pr' && "glow-teal bg-[#14e0d4]/[0.02]",
      post.post_type === 'achievement' && "glow-purple bg-purple-500/[0.02]"
    )}>
      <CardContent className="p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
              {post.avatar_url ? (
                <img src={post.avatar_url} alt={post.display_name || ''} className="h-full w-full object-cover" />
              ) : (
                <User className="h-6 w-6 text-white/20" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <p className="font-bold text-lg tracking-tight">
                  {post.display_name || 'Anonymous'}
                </p>
                {post.post_type === 'pr' && (
                  <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black uppercase tracking-widest text-emerald-400">
                    New PR
                  </div>
                )}
                {post.post_type === 'achievement' && (
                  <div className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[8px] font-black uppercase tracking-widest text-purple-400">
                    Achievement
                  </div>
                )}
              </div>
              <p className="stat-label mt-1">
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
              className="h-8 w-8 text-white/10 hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {post.post_type === 'pr' ? (
            <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
              <div className="h-16 w-16 rounded-full bg-[#14e0d4] flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(20,224,212,0.3)]">
                <Trophy className="h-8 w-8 text-black" />
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tighter">
                  {post.metadata?.weight} <span className="text-sm font-black uppercase tracking-widest text-white/20 ml-1">{post.metadata?.unit || 'lbs'}</span>
                </p>
                <p className="text-sm font-bold tracking-tight text-[#14e0d4] mt-1">
                  {post.metadata?.exercise_name}
                </p>
                <p className="stat-label mt-1">Personal Record</p>
              </div>
            </div>
          ) : post.post_type === 'achievement' ? (
            <div className="flex items-center gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
              <div className="h-16 w-16 rounded-full bg-purple-500 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight leading-tight">
                  Challenge Completed
                </p>
                <p className="text-sm font-bold tracking-tight text-purple-400 mt-1">
                  {post.metadata?.challenge_name}
                </p>
                <p className="stat-label mt-1">New Badge Earned</p>
              </div>
            </div>
          ) : (
            <p className="text-lg font-medium leading-relaxed tracking-tight text-white/80">
              {post.content}
            </p>
          )}
        </div>

        <div className="pt-4 flex items-center gap-3">
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
                  "h-10 gap-2 rounded-full px-4 transition-all bg-white/[0.03] border border-white/5",
                  hasReacted 
                    ? cn("bg-white/[0.1] border-white/20", reaction.color) 
                    : "hover:bg-white/[0.08] text-white/20"
                )}
              >
                <Icon className={cn("h-4 w-4", hasReacted && reaction.fill)} />
                {count > 0 && <span className="text-xs font-black">{count}</span>}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

