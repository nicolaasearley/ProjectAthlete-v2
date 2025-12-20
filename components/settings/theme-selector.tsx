'use client'

import { useTheme } from '@/lib/theme-context'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const THEMES = [
  {
    id: 'dark',
    name: 'Dark',
    colors: {
      bg: 'bg-[#0a0a0a]',
      primary: 'bg-[#2563eb]',
      card: 'bg-[#121212]'
    }
  },
  {
    id: 'light',
    name: 'Light',
    colors: {
      bg: 'bg-[#fafafa]',
      primary: 'bg-[#2563eb]',
      card: 'bg-white'
    }
  },
  {
    id: 'pastel',
    name: 'Pastel',
    colors: {
      bg: 'bg-[#f7f3f0]',
      primary: 'bg-[#f299b1]',
      card: 'bg-[#fcf7f9]'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      bg: 'bg-[#091417]',
      primary: 'bg-[#14e0d4]',
      card: 'bg-[#0d1e22]'
    }
  }
] as const

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {THEMES.map((t) => {
        const isActive = theme === t.id
        
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={cn(
              "group relative flex flex-col gap-2 p-2 rounded-xl border-2 transition-all duration-300",
              isActive 
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" 
                : "border-border hover:border-border/80 bg-card/50"
            )}
          >
            {/* Theme Preview */}
            <div className={cn(
              "w-full aspect-video rounded-lg overflow-hidden flex shadow-inner",
              t.colors.bg
            )}>
              <div className="w-1/3 h-full p-1">
                <div className={cn("w-full h-full rounded-md shadow-sm", t.colors.card)}>
                  <div className="w-1/2 h-1 bg-white/10 rounded-full mt-1 ml-1" />
                  <div className="w-3/4 h-1 bg-white/5 rounded-full mt-1 ml-1" />
                </div>
              </div>
              <div className="flex-1 p-1">
                <div className={cn("w-full h-4 rounded shadow-sm", t.colors.primary)} />
                <div className="grid grid-cols-2 gap-1 mt-1">
                  <div className="h-6 rounded bg-white/5 shadow-sm" />
                  <div className="h-6 rounded bg-white/5 shadow-sm" />
                </div>
              </div>
            </div>

            {/* Label */}
            <div className="flex items-center justify-between px-1">
              <span className={cn(
                "text-xs font-semibold uppercase tracking-wider transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {t.name}
              </span>
              {isActive && <Check className="h-3 w-3 text-primary" strokeWidth={3} />}
            </div>

            {/* Ripple effect on active */}
            {isActive && (
              <div className="absolute inset-0 rounded-xl bg-primary/5 animate-pulse" />
            )}
          </button>
        )
      })}
    </div>
  )
}

