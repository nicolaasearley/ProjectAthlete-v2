import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { updateUserRole } from '@/app/admin/actions'
import { Users, User as UserIcon, Shield, ShieldAlert, MoreHorizontal } from 'lucide-react'

export default async function UserManagementPage() {
  const supabase = await createClient()
  
  // Check if admin
  const { data: isAdmin } = await (supabase.rpc as any)('is_coach_or_admin')
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

  // Get all users in the organization
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .eq('org_id', profileData.org_id)
    .order('display_name', { ascending: true })

  const userList = (users || []) as any[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage athlete and coach roles in your organization</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active Users ({userList.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {userList.map((user) => (
              <div key={user.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{user.display_name || 'Anonymous'}</p>
                    <p className="text-xs text-muted-foreground">{user.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2">
                    <Badge variant={
                      user.role === 'admin' ? 'default' : 
                      user.role === 'coach' ? 'secondary' : 
                      'outline'
                    } className="gap-1">
                      {user.role === 'admin' && <ShieldAlert className="h-3 w-3" />}
                      {user.role === 'coach' && <Shield className="h-3 w-3" />}
                      {user.role}
                    </Badge>
                  </div>
                  
                  {user.id !== currentUser.id && (
                    <div className="flex gap-1">
                      {user.role !== 'athlete' && (
                        <form action={updateUserRole.bind(null, user.id, 'athlete')}>
                          <Button variant="ghost" size="sm" type="submit">Make Athlete</Button>
                        </form>
                      )}
                      {user.role !== 'coach' && (
                        <form action={updateUserRole.bind(null, user.id, 'coach')}>
                          <Button variant="ghost" size="sm" type="submit">Make Coach</Button>
                        </form>
                      )}
                      {user.role !== 'admin' && (
                        <form action={updateUserRole.bind(null, user.id, 'admin')}>
                          <Button variant="ghost" size="sm" type="submit">Make Admin</Button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

