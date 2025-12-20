import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PostComposer } from '@/components/feed/post-composer'
import { FeedItem } from '@/components/feed/feed-item'
import { Metadata } from 'next'
import { MessageSquare, Rss, TrendingUp, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Activity Feed | ProjectAthlete',
  description: 'Stay updated with your community PRs and achievements.',
}

export default async function FeedPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data: profileData } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()
    
  if (!profileData) return null
  
  const profile = profileData as { org_id: string }

  const { data: feed } = await (supabase.rpc as any)('get_activity_feed', {
    p_org_id: profile.org_id,
    p_limit: 50
  })

  // Calculate feed stats
  const prCount = feed?.filter((p: any) => p.post_type === 'pr').length || 0
  const achievementCount = feed?.filter((p: any) => p.post_type === 'achievement').length || 0
  const textCount = feed?.filter((p: any) => p.post_type === 'text').length || 0

  return (
    <div className="space-y-10 pb-20 page-transition">
      {/* Header */}
      <div className="px-2">
        <h1 className="text-4xl font-bold tracking-tighter">Activity Feed</h1>
        <p className="text-foreground/40 font-medium uppercase tracking-[0.2em] text-[10px] mt-1">Updates from your organization</p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-foreground/[0.02] border border-foreground/5">
          <div className="h-10 w-10 rounded-full bg-[#14e0d4]/10 border border-[#14e0d4]/20 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-[#14e0d4]" />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tighter">{prCount}</p>
            <p className="stat-label">New PRs</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-foreground/[0.02] border border-foreground/5">
          <div className="h-10 w-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Rss className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tighter">{achievementCount}</p>
            <p className="stat-label">Achievements</p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-foreground/[0.02] border border-foreground/5">
          <div className="h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tighter">{textCount}</p>
            <p className="stat-label">Updates</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-8">
        <PostComposer />

        <div className="space-y-6">
          {feed && feed.length > 0 ? (
            feed.map((post: any) => (
              <FeedItem key={post.id} post={post} currentUserId={user.id} />
            ))
          ) : (
            <Card premium className="text-center py-16">
              <MessageSquare className="h-16 w-16 mx-auto mb-6 text-foreground/10" />
              <p className="text-xl font-bold tracking-tight mb-2">No activity yet</p>
              <p className="text-foreground/40 text-sm max-w-xs mx-auto">Be the first to share an update or log a workout to see PRs appear here.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

