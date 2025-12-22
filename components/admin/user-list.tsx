'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Users, Search, Loader2 } from 'lucide-react'
import { updateUserRole } from '@/app/admin/actions'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { UserAvatar } from '@/components/shared/user-avatar'

interface UserProfile {
  id: string
  display_name: string | null
  email: string | null
  avatar_url: string | null
  role: 'athlete' | 'coach' | 'admin'
}

interface UserListProps {
  users: UserProfile[]
  currentUserId: string
}

export function UserList({ users, currentUserId }: UserListProps) {
  const [search, setSearch] = useState('')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleRoleUpdate = (userId: string, role: 'athlete' | 'coach' | 'admin') => {
    startTransition(async () => {
      try {
        await updateUserRole(userId, role)
        router.refresh()
      } catch (error) {
        console.error('Failed to update role:', error)
      }
    })
  }

  const filteredUsers = users.filter(user => {
    const searchLower = search.toLowerCase()
    return (
      user.display_name?.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {filteredUsers.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No users found matching your search.
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar 
                      src={user.avatar_url} 
                      name={user.display_name} 
                      role={user.role} 
                    />
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {user.display_name || 'Anonymous'}
                        {user.id === currentUserId && (
                          <Badge variant="outline" className="text-[10px] py-0 h-4">You</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        user.role === 'admin' ? 'destructive' : 
                        user.role === 'coach' ? 'default' : 
                        'outline'
                      } className="capitalize">
                        {user.role}
                      </Badge>
                      {isPending && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                    </div>
                    
                    {user.id !== currentUserId && (
                      <div className="flex gap-1">
                        {user.role !== 'athlete' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRoleUpdate(user.id, 'athlete')}
                            disabled={isPending}
                            className="text-xs h-8"
                          >
                            Make Athlete
                          </Button>
                        )}
                        {user.role !== 'coach' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRoleUpdate(user.id, 'coach')}
                            disabled={isPending}
                            className="text-xs h-8"
                          >
                            Make Coach
                          </Button>
                        )}
                        {user.role !== 'admin' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRoleUpdate(user.id, 'admin')}
                            disabled={isPending}
                            className="text-xs h-8"
                          >
                            Make Admin
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

