'use client'

import { useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Check, X } from 'lucide-react'
import type { CommunityWorkout } from '@/types/database'

interface PendingWorkout extends CommunityWorkout {
  author?: { display_name: string | null } | null
}

interface ApprovalQueueProps {
  workouts: PendingWorkout[]
  onApprove: (id: string) => Promise<void>
  onReject: (id: string, reason?: string) => Promise<void>
}

export function ApprovalQueue({ workouts, onApprove, onReject }: ApprovalQueueProps) {
  const [isPending, startTransition] = useTransition()
  
  const handleApprove = (id: string) => {
    if (!confirm('Approve this workout?')) return
    startTransition(async () => {
      await onApprove(id)
    })
  }
  
  const handleReject = (id: string) => {
    const reason = prompt('Reason for rejection? (optional)')
    if (reason === null) return
    
    startTransition(async () => {
      await onReject(id, reason || undefined)
    })
  }
  
  if (workouts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>No pending submissions in the queue.</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <Card key={workout.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between mb-1">
              <Badge variant="secondary" className="capitalize">
                {workout.workout_type.replace('_', ' ')}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Submitted {new Date(workout.created_at).toLocaleDateString()}
              </span>
            </div>
            <CardTitle>{workout.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              by {workout.author?.display_name || 'Anonymous'}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm whitespace-pre-wrap">{workout.description}</p>
            
            {workout.time_cap_minutes && (
              <p className="text-xs font-medium">
                Time Cap: {workout.time_cap_minutes} minutes
              </p>
            )}
            
            <div className="flex gap-2 pt-2 border-t border-border">
              <Button
                variant="default"
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => handleApprove(workout.id)}
                disabled={isPending}
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                Approve
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => handleReject(workout.id)}
                disabled={isPending}
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-2" />}
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

