'use client'

import { useTheme } from '@/lib/theme-context'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

const THEMES = [
  {
    id: 'dark',
    name: 'Dark',
    colors: ['#0a0a0a', '#121212', '#2563eb']
  },
  {
    id: 'light',
    name: 'Light',
    colors: ['#fafafa', '#ffffff', '#2563eb']
  },
  {
    id: 'pastel',
    name: 'Pastel',
    colors: ['#f7f3f0', '#fcf7f9', '#f299b1']
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: ['#091417', '#0d1e22', '#14e0d4']
  }
] as const

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {THEMES.map((t) => {
        const isActive = theme === t.id
        
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={cn(
              "group relative flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-300 overflow-hidden",
              isActive 
                ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.1)]" 
                : "border-white/[0.05] hover:border-white/10 bg-white/[0.02]"
            )}
          >
            {/* Color Swatches */}
            <div className="flex -space-x-2">
              {t.colors.map((color, i) => (
                <div 
                  key={i}
                  style={{ backgroundColor: color }}
                  className={cn(
                    "h-6 w-6 rounded-full border border-white/10 shadow-sm",
                    i === 2 && "ring-2 ring-white/5"
                  )}
                />
              ))}
            </div>

            {/* Label */}
            <span className={cn(
              "text-[10px] font-bold tracking-widest uppercase transition-colors relative z-10",
              isActive ? "text-primary" : "text-white/40 group-hover:text-white/60"
            )}>
              {t.name}
            </span>

            {/* Selection Check (Hidden but semantic) */}
            {isActive && (
              <div className="absolute top-1 right-1">
                <Check className="h-2.5 w-2.5 text-primary" strokeWidth={4} />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

