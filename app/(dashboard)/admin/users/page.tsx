import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UserList } from '@/components/admin/user-list'

export default async function UserManagementPage() {
  const supabase = await createClient()
  
  // Check if admin (strictly admin for user management)
  const { data: isAdmin } = await (supabase.rpc as any)('is_admin')
  if (!isAdmin) redirect('/')
  
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  if (!currentUser) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', currentUser.id)
    .single()
    
  if (!profile) redirect('/')

  // Force narrowing for TypeScript
  const profileData = profile as any

  // Get all users in the organization from profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .eq('org_id', profileData.org_id)
    .order('display_name', { ascending: true })

  const userList = ((profiles as any[]) || []).map(p => ({
    ...p,
    email: null // Removed for security
  }))

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage athlete, coach, and admin roles in your organization</p>
      </div>

      <UserList users={userList as any[]} currentUserId={currentUser.id} />
    </div>
  )
}

