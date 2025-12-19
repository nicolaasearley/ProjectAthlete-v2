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
  BarChart2,
  Rss,
} from 'lucide-react'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Feed', href: '/feed', icon: Rss },
  { name: 'Workouts', href: '/workouts', icon: Dumbbell },
  { name: 'Stats', href: '/stats', icon: BarChart2 },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Profile', href: '/profile', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-card/90 backdrop-blur-lg border-t border-border flex items-center justify-around px-2 z-40 pb-safe">
      {navigation.map((item) => {
        const isActive = pathname === item.href || 
          (item.href !== '/' && pathname.startsWith(item.href))
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1.5 flex-1 h-full transition-colors relative',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <item.icon className={cn(
              'h-6 w-6 transition-transform duration-200',
              isActive && 'scale-110'
            )} />
            <span className="text-xs font-medium">{item.name}</span>
            {isActive && (
              <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-primary animate-in fade-in zoom-in duration-300" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}

