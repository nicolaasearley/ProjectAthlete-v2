'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MobileNav } from '@/components/layout/mobile-nav'
import { LogOut, Menu } from 'lucide-react'
import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types/database'

interface NavbarProps {
  user: User
  profile: (Profile & { organizations: { name: string } | null }) | null
}

export function Navbar({ user, profile }: NavbarProps) {
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
      <header className="h-16 border-b border-border bg-card/30 backdrop-blur-sm px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-accent"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden sm:block">
            <span className="text-sm text-muted-foreground">
              {profile?.organizations?.name || 'ProjectAthlete'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{profile?.display_name || 'User'}</p>
            <p className="text-xs text-muted-foreground capitalize">{profile?.role || 'athlete'}</p>
          </div>
          
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  )
}

