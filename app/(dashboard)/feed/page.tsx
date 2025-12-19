import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PostComposer } from '@/components/feed/post-composer'
import { FeedItem } from '@/components/feed/feed-item'
import { Metadata } from 'next'
import { MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Activity Feed | ProjectAthlete',
  description: 'Stay updated with your community PRs and achievements.',
}

export default async function FeedPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()
    
  if (!profile) return null

  const { data: feed } = await (supabase.rpc as any)('get_activity_feed', {
    p_org_id: profile.org_id,
    p_limit: 50
  })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activity Feed</h1>
          <p className="text-muted-foreground">Recent updates from your organization</p>
        </div>
      </div>

      <PostComposer />

      <div className="space-y-4">
        {feed && feed.length > 0 ? (
          feed.map((post: any) => (
            <FeedItem key={post.id} post={post} currentUserId={user.id} />
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No activity yet. Be the first to post!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

