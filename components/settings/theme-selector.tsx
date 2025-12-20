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
      primary: '#2563eb',
      accent: '#3b82f6'
    }
  },
  {
    id: 'light',
    name: 'Light',
    colors: {
      bg: '#fafafa',
      card: '#ffffff',
      primary: '#2563eb',
      accent: '#3b82f6'
    }
  },
  {
    id: 'pastel',
    name: 'Pastel',
    colors: {
      bg: '#f7f3f0',
      card: '#fcf7f9',
      primary: '#f299b1',
      accent: '#fbcfe8'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      bg: '#091417',
      card: '#0d1e22',
      primary: '#14e0d4',
      accent: '#2dd4bf'
    }
  }
] as const

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="grid grid-cols-2 gap-3">
      {THEMES.map((t) => {
        const isActive = theme === t.id
        
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={cn(
              "group relative flex flex-col p-1 rounded-[2rem] transition-all duration-500",
              isActive 
                ? "bg-primary/20 ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.02]" 
                : "bg-foreground/[0.03] hover:bg-foreground/[0.08] ring-1 ring-foreground/10"
            )}
          >
            {/* Theme Mockup Preview */}
            <div 
              style={{ backgroundColor: t.colors.bg }}
              className="w-full aspect-[4/3] rounded-[1.75rem] overflow-hidden relative shadow-inner flex flex-col p-2 gap-1.5"
            >
              {/* Header mockup */}
              <div 
                style={{ backgroundColor: t.colors.card }}
                className="h-3 w-full rounded-full shadow-sm border border-black/5 flex items-center px-2"
              >
                <div className="h-1 w-4 rounded-full bg-black/10" />
              </div>
              
              {/* Content area mockup */}
              <div className="flex-1 flex gap-1.5">
                <div 
                  style={{ backgroundColor: t.colors.card }}
                  className="flex-1 rounded-xl border border-black/5 p-1.5 flex flex-col gap-1"
                >
                  <div className="h-1.5 w-full rounded-full bg-black/10" />
                  <div className="h-1.5 w-2/3 rounded-full bg-black/5" />
                  <div 
                    style={{ backgroundColor: t.colors.primary }}
                    className="h-3 w-3 rounded-md mt-auto shadow-sm"
                  />
                </div>
                <div className="w-1/3 flex flex-col gap-1.5">
                  <div 
                    style={{ backgroundColor: t.colors.card }}
                    className="h-1/2 rounded-xl border border-black/5"
                  />
                  <div 
                    style={{ backgroundColor: t.colors.accent }}
                    className="flex-1 rounded-xl shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Label */}
            <div className="py-2.5 px-1 flex items-center justify-center gap-2">
              <span className={cn(
                "text-[11px] font-semibold tracking-wider transition-colors",
                isActive ? "text-foreground" : "text-foreground/40 group-hover:text-foreground/70"
              )}>
                {t.name}
              </span>
              {isActive && (
                <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-primary-foreground" strokeWidth={4} />
                </div>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

