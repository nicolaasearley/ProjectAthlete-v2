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

  return (
    <div className="lg:hidden fixed bottom-6 left-0 right-0 px-6 z-50 pointer-events-none">
      <nav className="mx-auto max-w-md h-16 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-[2.5rem] flex items-center justify-around px-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto ring-1 ring-white/10 overflow-hidden">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full transition-all duration-500 relative group',
                isActive ? 'text-white' : 'text-white/40 hover:text-white/70'
              )}
            >
              {/* Active Glass Highlight */}
              {isActive && (
                <div className="absolute inset-x-1 inset-y-1.5 bg-white/[0.07] backdrop-blur-md border border-white/10 rounded-[1.25rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] animate-in fade-in zoom-in-95 duration-500" />
              )}
              
              <div className="relative z-10 flex flex-col items-center justify-center gap-0">
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

