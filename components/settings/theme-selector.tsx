'use client'

import { useTheme } from '@/lib/theme-context'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const THEMES = [
  {
    id: 'dark',
    name: 'Dark',
    colors: {
      bg: '#0a0a0a',
      card: '#121212',
      primary: '#2563eb'
    }
  },
  {
    id: 'light',
    name: 'Light',
    colors: {
      bg: '#fafafa',
      card: '#ffffff',
      primary: '#2563eb'
    }
  },
  {
    id: 'pastel',
    name: 'Pastel',
    colors: {
      bg: '#f7f3f0',
      card: '#fcf7f9',
      primary: '#f299b1'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      bg: '#091417',
      card: '#0d1e22',
      primary: '#14e0d4'
    }
  }
] as const

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="grid grid-cols-2 gap-4">
      {THEMES.map((t) => {
        const isActive = theme === t.id
        
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={cn(
              "group relative flex flex-col items-center gap-4 p-5 rounded-[2.5rem] border transition-all duration-500",
              isActive 
                ? "bg-white/[0.08] border-white/20 shadow-2xl ring-1 ring-white/10 scale-[1.02]" 
                : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
            )}
          >
            {/* Minimal Palette Preview */}
            <div className="relative h-12 w-20 flex items-center justify-center">
              <div 
                style={{ backgroundColor: t.colors.bg }}
                className="absolute left-0 h-10 w-10 rounded-full border border-white/10 shadow-lg z-10 transition-transform duration-500 group-hover:-translate-x-1"
              />
              <div 
                style={{ backgroundColor: t.colors.card }}
                className="h-11 w-11 rounded-full border border-white/10 shadow-xl z-20 transition-transform duration-500 group-hover:scale-105"
              />
              <div 
                style={{ backgroundColor: t.colors.primary }}
                className="absolute right-0 h-10 w-10 rounded-full border border-white/10 shadow-lg z-30 transition-transform duration-500 group-hover:translate-x-1"
              />
            </div>

            {/* Label with Indicator */}
            <div className="flex flex-col items-center gap-1.5">
              <span className={cn(
                "text-[10px] font-black tracking-[0.25em] uppercase transition-colors",
                isActive ? "text-white" : "text-white/30 group-hover:text-white/50"
              )}>
                {t.name}
              </span>
              
              <div className={cn(
                "h-1 w-8 rounded-full transition-all duration-500",
                isActive ? "bg-primary shadow-[0_0_10px_rgba(var(--primary),0.6)]" : "bg-transparent"
              )} />
            </div>

            {/* Selection Checkmark */}
            {isActive && (
              <div className="absolute top-4 right-5 text-primary">
                <Check className="h-4 w-4" strokeWidth={3} />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

