import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { BottomNav } from '@/components/layout/bottom-nav'
import { getNavPreferences } from '@/app/profile/actions'
import { QuickActions } from '@/components/shared/quick-actions'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [profileResponse, navPreferences] = await Promise.all([
    supabase
      .from('profiles')
      .select('*, organizations(*)')
      .eq('id', user.id)
      .single(),
    getNavPreferences()
  ])

  const profile = profileResponse.data
  // Force narrowing for TypeScript
  const profileData = profile as any

  return (
    <div className="min-h-screen w-full flex text-foreground overflow-x-hidden">
      <Sidebar role={profileData?.role} orgId={profileData?.org_id} />
      <div className="flex-1 w-full flex flex-col min-h-0">
        <Navbar profile={profileData} />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto animate-fade-in pb-24 lg:pb-6">
          {children}
        </main>
        <BottomNav navItems={navPreferences || undefined} />
      </div>
      <QuickActions />
    </div>
  )
}
