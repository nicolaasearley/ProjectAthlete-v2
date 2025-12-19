'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Trash2 } from 'lucide-react'
import type { WorkoutComment } from '@/types/database'

interface CommentWithAuthor extends WorkoutComment {
  profiles?: { display_name: string | null } | null
}

interface CommentSectionProps {
  workoutId: string
  comments: CommentWithAuthor[]
  userId: string
  onAddComment: (workoutId: string, content: string) => Promise<void>
  onDeleteComment: (commentId: string, workoutId: string) => Promise<void>
}

export function CommentSection({ 
  workoutId, 
  comments, 
  userId, 
  onAddComment, 
  onDeleteComment 
}: CommentSectionProps) {
  const [isPending, startTransition] = useTransition()
  const [newComment, setNewComment] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    
    startTransition(async () => {
      await onAddComment(workoutId, newComment)
      setNewComment('')
    })
  }
  
  const handleDelete = (commentId: string) => {
    if (!confirm('Delete this comment?')) return
    
    startTransition(async () => {
      await onDeleteComment(commentId, workoutId)
    })
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Comments ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
            disabled={isPending}
          />
          <Button type="submit" disabled={isPending || !newComment.trim()}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Post'}
          </Button>
        </form>
        
        {/* List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-center py-4 text-sm text-muted-foreground">
              No comments yet. Be the first!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 text-sm">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">
                      {comment.profiles?.display_name || 'Anonymous'}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                      {comment.user_id === userId && (
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-muted-foreground hover:text-destructive"
                          disabled={isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-1 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

