'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dumbbell, Heart, Zap, Target, Sparkles, MoveHorizontal, Flame, ArrowUpDown, Package, CircleDot } from 'lucide-react'
import type { Exercise, ExerciseAlias } from '@/types/database'
import { cn } from '@/lib/utils'
import { toggleFavoriteExercise } from '@/app/exercises/actions'
import { useTransition } from 'react'

interface ExerciseWithAliases extends Exercise {
  exercise_aliases: ExerciseAlias[]
}

interface ExerciseCardProps {
  exercise: ExerciseWithAliases
  isFavorite?: boolean
}

// Category color and icon mapping - Using ACTUAL categories from database
const CATEGORY_STYLES: Record<string, { 
  gradient: string
  border: string
  text: string
  icon: typeof Dumbbell
  glow: string
}> = {
  squat: {
    gradient: 'from-blue-500/15 to-transparent',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    icon: ArrowUpDown,
    glow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]'
  },
  hinge: {
    gradient: 'from-amber-500/15 to-transparent',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    icon: Flame,
    glow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]'
  },
  push: {
    gradient: 'from-red-500/15 to-transparent',
    border: 'border-red-500/30',
    text: 'text-red-400',
    icon: Target,
    glow: 'group-hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]'
  },
  pull: {
    gradient: 'from-emerald-500/15 to-transparent',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    icon: MoveHorizontal,
    glow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]'
  },
  carry: {
    gradient: 'from-purple-500/15 to-transparent',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    icon: Package,
    glow: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]'
  },
  core: {
    gradient: 'from-cyan-500/15 to-transparent',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    icon: CircleDot,
    glow: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]'
  },
  olympic: {
    gradient: 'from-yellow-500/15 to-transparent',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    icon: Zap,
    glow: 'group-hover:shadow-[0_0_30px_rgba(234,179,8,0.2)]'
  },
  cardio: {
    gradient: 'from-rose-500/15 to-transparent',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    icon: Heart,
    glow: 'group-hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]'
  },
  other: {
    gradient: 'from-slate-400/15 to-transparent',
    border: 'border-slate-400/30',
    text: 'text-slate-400',
    icon: Dumbbell,
    glow: 'group-hover:shadow-[0_0_30px_rgba(148,163,184,0.15)]'
  }
}

const DEFAULT_STYLE = {
  gradient: 'from-foreground/5 to-transparent',
  border: 'border-foreground/10',
  text: 'text-foreground/60',
  icon: Dumbbell,
  glow: ''
}

export function ExerciseCard({ exercise, isFavorite = false }: ExerciseCardProps) {
  const style = CATEGORY_STYLES[exercise.category] || DEFAULT_STYLE
  const Icon = style.icon
  const [isPending, startTransition] = useTransition()

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    startTransition(async () => {
      await toggleFavoriteExercise(exercise.id)
    })
  }

  return (
    <Link href={`/exercises/${exercise.id}`} className="group relative block h-full">
      <Card 
        premium 
        hoverable 
        className={cn(
          "h-full relative overflow-hidden transition-all duration-500",
          style.glow
        )}
      >
        {/* Favorite Toggle Button */}
        <button
          onClick={handleToggleFavorite}
          disabled={isPending}
          className={cn(
            "absolute top-4 right-4 z-20 p-2 rounded-xl transition-all duration-300",
            "bg-foreground/5 hover:bg-foreground/10 border border-foreground/5",
            isFavorite ? "text-red-500 border-red-500/20" : "text-foreground/20 hover:text-foreground/40"
          )}
        >
          <Heart 
            className={cn("h-4 w-4 transition-all", isFavorite && "fill-current")} 
          />
        </button>

        {/* Gradient Overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br pointer-events-none",
          style.gradient
        )} />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0 pr-10">
              <h3 className="text-lg font-bold tracking-tight truncate group-hover:text-foreground transition-colors">
                {exercise.name}
              </h3>
              <div className={cn(
                "inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                style.text,
                'bg-foreground/5 border',
                style.border
              )}>
                <Icon className="h-3 w-3" />
                {exercise.category}
              </div>
            </div>
          </div>

          {exercise.exercise_aliases && exercise.exercise_aliases.length > 0 && (
            <p className="text-xs text-foreground/30 line-clamp-1 mt-4">
              Also: {exercise.exercise_aliases.map(a => a.alias).join(', ')}
            </p>
          )}
        </div>
      </Card>
    </Link>
  )
}

