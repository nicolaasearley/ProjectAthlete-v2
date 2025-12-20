'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MobileNav } from '@/components/layout/mobile-nav'
import { LogOut, Menu } from 'lucide-react'
import { useState } from 'react'
import type { Profile } from '@/types/database'

interface NavbarProps {
  profile: (Profile & { organizations: { name: string } | null }) | null
}

export function Navbar({ profile }: NavbarProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      <header className="h-20 border-b border-white/[0.03] bg-background/60 backdrop-blur-3xl px-8 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <Menu className="h-5 w-5 text-white/40" />
          </button>
          
          <div className="hidden sm:block">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20">
              {profile?.organizations?.name || 'ProjectAthlete'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold tracking-tight">{profile?.display_name || 'User'}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-white/20">{profile?.role || 'athlete'}</p>
          </div>
          
          <Button variant="ghost" size="icon" onClick={handleSignOut} className="h-10 w-10 rounded-xl hover:bg-white/5 text-white/20 hover:text-red-400 transition-colors">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <MobileNav 
        open={mobileNavOpen} 
        onClose={() => setMobileNavOpen(false)} 
        role={profile?.role}
      />
    </>
  )
}

