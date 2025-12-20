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
  { name: 'Workouts', href: '/workouts', icon: Dumbbell },
  { name: 'Stats', href: '/stats', icon: BarChart2 },
  { name: 'Challenges', href: '/challenges', icon: Trophy },
  { name: 'Community', href: '/community', icon: Users },
]

export function BottomNav() {
  const pathname = usePathname()
  
  const activeIndex = navigation.findIndex(item => 
    pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
  )

  return (
    <div className="lg:hidden fixed bottom-6 left-0 right-0 px-6 z-50 pointer-events-none">
      <nav className="mx-auto max-w-md h-16 bg-foreground/[0.03] backdrop-blur-2xl border border-foreground/[0.08] rounded-[2.5rem] flex items-center relative px-2 shadow-2xl pointer-events-auto ring-1 ring-foreground/10 overflow-hidden">
        
        {/* Sliding Glass Bubble */}
        {activeIndex !== -1 && (
          <div 
            className="absolute inset-y-1.5 bg-foreground/[0.08] backdrop-blur-md border border-foreground/10 rounded-[1.25rem] shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
            style={{ 
              width: `calc((100% - 1rem) / ${navigation.length})`,
              left: '0.5rem',
              transform: `translateX(calc(${activeIndex} * 100%))`
            }}
          />
        )}

        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-all duration-500 relative group z-10',
                isActive ? 'text-foreground' : 'text-foreground/40 hover:text-foreground/70'
              )}
            >
              <div className="flex flex-col items-center justify-center gap-0">
                <item.icon className={cn(
                  'h-5 w-5 transition-all duration-500',
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                )} />
                <span className="text-[8px] font-medium tracking-wider uppercase opacity-80 mt-0.5">
                  {item.name}
                </span>
              </div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

