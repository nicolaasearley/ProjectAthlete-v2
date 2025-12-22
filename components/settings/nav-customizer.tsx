'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Loader2, Home, Dumbbell, BarChart2, Trophy, Users, Rss, Library, User } from 'lucide-react'
import { updateNavPreferences } from '@/app/profile/actions'
import { cn } from '@/lib/utils'

const ALL_NAV_ITEMS = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Feed', href: '/feed', icon: Rss },
  { name: 'Workouts', href: '/workouts', icon: Dumbbell },
  { name: 'Exercises', href: '/exercises', icon: Library },
  { name: 'Stats', href: '/stats', icon: BarChart2 },
  { name: 'Challenges', href: '/challenges', icon: Trophy },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Profile', href: '/profile', icon: User },
]

interface NavCustomizerProps {
  initialNavItems: string[]
}

export function NavCustomizer({ initialNavItems }: NavCustomizerProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>(initialNavItems)
  const [isPending, startTransition] = useTransition()

  const toggleItem = (href: string) => {
    if (selectedItems.includes(href)) {
      if (selectedItems.length <= 2) return // Keep at least 2 items
      setSelectedItems(selectedItems.filter(item => item !== href))
    } else {
      if (selectedItems.length >= 5) return // Limit to 5 items
      setSelectedItems([...selectedItems, href])
    }
  }

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateNavPreferences(selectedItems)
        alert('Navigation preferences saved!')
      } catch (error) {
        console.error('Failed to save nav preferences:', error)
        alert('Failed to save preferences')
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Customize Mobile Navigation</CardTitle>
        <p className="text-sm text-muted-foreground">Select up to 5 items to show in your bottom navigation bar.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ALL_NAV_ITEMS.map((item) => {
            const isSelected = selectedItems.includes(item.href)
            return (
              <button
                key={item.href}
                onClick={() => toggleItem(item.href)}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all relative",
                  isSelected 
                    ? "border-primary bg-primary/5 text-primary" 
                    : "border-border hover:border-foreground/20 text-muted-foreground"
                )}
              >
                <item.icon className="h-6 w-6 mb-2" />
                <span className="text-xs font-medium">{item.name}</span>
                {isSelected && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {selectedItems.length} / 5 items selected
          </p>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

