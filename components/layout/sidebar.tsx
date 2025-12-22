'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  Dumbbell,
  Library,
  Users,
  Trophy,
  User,
  Shield,
  BarChart2,
  Rss,
  ClipboardList,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { useAdminNotifications } from '@/lib/hooks/use-admin-notifications'
import { UserAvatar } from '@/components/shared/user-avatar'

function LogoImage() {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
        <Dumbbell className="h-5 w-5 text-primary-foreground" />
      </div>
    )
  }

  return (
    <img 
      src="/logo.png" 
      alt="Logo" 
      className="h-8 w-8 rounded-lg object-cover"
      onError={() => setImageError(true)}
    />
  )
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Feed', href: '/feed', icon: Rss },
  { name: 'Workouts', href: '/workouts', icon: Dumbbell },
  { name: 'Exercises', href: '/exercises', icon: Library },
  { name: 'Stats', href: '/stats', icon: BarChart2 },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Challenges', href: '/challenges', icon: Trophy },
  { name: 'Profile', href: '/profile', icon: User },
]

const adminNavigation = [
  { name: 'User Management', href: '/admin/users', icon: Shield },
  { name: 'Submissions', href: '/admin/submissions', icon: ClipboardList, badge: 'pending' },
  { name: 'Send Email', href: '/admin/email', icon: Rss },
]

interface SidebarProps {
  role?: string
  orgId?: string
}

export function Sidebar({ role, orgId }: SidebarProps) {
  const pathname = usePathname()
  const isAdmin = role === 'admin' || role === 'coach'
  const { pendingCount } = useAdminNotifications(isAdmin, orgId)

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:border-foreground/5 lg:bg-background/40 lg:backdrop-blur-xl">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <LogoImage />
          <span className="font-bold text-lg">ProjectAthlete</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}

        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-border">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Admin
            </p>
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href
              const hasBadge = item.badge === 'pending' && pendingCount > 0
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  {item.name}
                  </div>
                  {hasBadge && (
                    <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0 text-[10px] animate-pulse">
                      {pendingCount}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </nav>
    </aside>
  )
}

