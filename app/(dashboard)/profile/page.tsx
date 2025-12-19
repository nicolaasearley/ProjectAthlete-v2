import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BadgeDisplay } from '@/components/challenges/badge-display'
import { Button } from '@/components/ui/button'
import { updateAnonymity } from '@/app/challenges/actions'
import { User, Shield, AtSign, Building } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Profile | ProjectAthlete',
  description: 'Manage your profile and view your earned badges.',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, organizations(name)')
    .eq('id', user.id)
    .single()
  
  if (!profile) return null
  
  // Force narrowing for TypeScript
  const profileData = profile as any
  
  // Get user badges
  const { data: userBadges } = await supabase
    .from('user_badges')
    .select('*, badges(*)')
    .eq('user_id', user.id)
    .order('awarded_at', { ascending: false })
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your identity and view achievements</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                <User className="h-10 w-10" />
              </div>
              <CardTitle className="text-xl">{profileData.display_name || 'User'}</CardTitle>
              <p className="text-sm text-muted-foreground capitalize">{profileData.role}</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-3 text-sm">
                <AtSign className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{profileData.organizations?.name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>ID: {user.id.slice(0, 8)}...</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={updateAnonymity.bind(null, !profileData.is_anonymous_on_leaderboards)}>
                <div className="flex items-center justify-between space-x-2">
                  <div>
                    <p className="text-sm font-medium">Anonymous Mode</p>
                    <p className="text-xs text-muted-foreground">Hide name on leaderboards</p>
                  </div>
                  <Button 
                    type="submit" 
                    variant={profileData.is_anonymous_on_leaderboards ? 'default' : 'outline'}
                    size="sm"
                  >
                    {profileData.is_anonymous_on_leaderboards ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <BadgeDisplay badges={(userBadges as any[]) || []} />
          
          <Card>
            <CardHeader>
              <CardTitle>Training Stats</CardTitle>
            </CardHeader>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>Detailed profile statistics coming soon.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

