'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createPost } from '@/app/feed/actions'
import { Send, Loader2, Edit3 } from 'lucide-react'

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
    <Card premium glow="primary" className="overflow-hidden">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Edit3 className="h-5 w-5 text-blue-400" />
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share an update with your team..."
            className="flex-1 bg-transparent border-none resize-none text-lg font-medium placeholder:text-foreground/20 focus:outline-none min-h-[80px]"
            disabled={isPending}
          />
        </div>
        <div className="flex justify-end border-t border-foreground/5 pt-6 -mx-8 -mb-8 px-8 pb-6 bg-foreground/[0.02]">
          <Button 
            type="submit" 
            disabled={isPending || !content.trim()} 
            className="h-12 px-8 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-widest text-[10px] transition-transform active:scale-[0.98] disabled:opacity-30"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            Post Update
          </Button>
        </div>
      </form>
    </Card>
  )
}

