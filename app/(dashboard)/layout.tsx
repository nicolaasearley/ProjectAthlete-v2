import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { BottomNav } from '@/components/layout/bottom-nav'

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

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .single()

  // Force narrowing for TypeScript
  const profileData = profile as any

  return (
    <div className="min-h-screen flex text-foreground">
      <Sidebar role={profileData?.role} orgId={profileData?.org_id} />
      <div className="flex-1 flex flex-col min-h-0">
        <Navbar profile={profileData} />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto animate-fade-in pb-24 lg:pb-6">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
