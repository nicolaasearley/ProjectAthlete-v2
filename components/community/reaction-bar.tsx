'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ReactionBarProps {
  workoutId: string
  counts: { reaction_type: string; count: number }[]
  userReactions: string[]
  onToggle: (workoutId: string, type: 'like' | 'fire' | 'strong' | 'respect') => Promise<void>
}

const REACTIONS = [
  { type: 'like', icon: '👍', label: 'Like' },
  { type: 'fire', icon: '🔥', label: 'Fire' },
  { type: 'strong', icon: '💪', label: 'Strong' },
  { type: 'respect', icon: '🫡', label: 'Respect' },
] as const

export function ReactionBar({ workoutId, counts, userReactions, onToggle }: ReactionBarProps) {
  const [isPending, startTransition] = useTransition()
  
  const handleToggle = (type: 'like' | 'fire' | 'strong' | 'respect') => {
    startTransition(async () => {
      await onToggle(workoutId, type)
    })
  }
  
  return (
    <div className="flex flex-wrap gap-2">
      {REACTIONS.map((reaction) => {
        const count = counts.find(c => c.reaction_type === reaction.type)?.count || 0
        const isActive = userReactions.includes(reaction.type)
        
        return (
          <Button
            key={reaction.type}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleToggle(reaction.type)}
            className={cn(
              'h-9 gap-2 px-3',
              isActive && 'bg-primary/20 text-primary border-primary/50 hover:bg-primary/30'
            )}
            disabled={isPending}
          >
            <span>{reaction.icon}</span>
            {count > 0 && <span className="font-bold">{count}</span>}
          </Button>
        )
      })}
      {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2 my-auto" />}
    </div>
  )
}

