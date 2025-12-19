'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createPost } from '@/app/feed/actions'
import { Send, Loader2 } from 'lucide-react'

export function PostComposer() {
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    startTransition(async () => {
      try {
        await createPost(content)
        setContent('')
      } catch (error) {
        console.error('Failed to create post:', error)
      }
    })
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share an update, news, or just say hi..."
            className="w-full h-24 rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-primary/30 outline-none transition-all"
            disabled={isPending}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending || !content.trim()} className="gap-2">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Post Update
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

