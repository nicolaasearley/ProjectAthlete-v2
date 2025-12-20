import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dumbbell, Heart, Zap, Target, Sparkles, MoveHorizontal, Flame } from 'lucide-react'
import type { Exercise, ExerciseAlias } from '@/types/database'
import { cn } from '@/lib/utils'

interface ExerciseWithAliases extends Exercise {
  exercise_aliases: ExerciseAlias[]
}

interface ExerciseCardProps {
  exercise: ExerciseWithAliases
}

// Category color and icon mapping
const CATEGORY_STYLES: Record<string, { 
  gradient: string
  border: string
  text: string
  icon: typeof Dumbbell
  glow: string
}> = {
  chest: {
    gradient: 'from-red-500/10 to-transparent',
    border: 'border-red-500/20',
    text: 'text-red-400',
    icon: Target,
    glow: 'group-hover:shadow-[0_0_30px_rgba(239,68,68,0.15)]'
  },
  back: {
    gradient: 'from-blue-500/10 to-transparent',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    icon: MoveHorizontal,
    glow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]'
  },
  shoulders: {
    gradient: 'from-purple-500/10 to-transparent',
    border: 'border-purple-500/20',
    text: 'text-purple-400',
    icon: Sparkles,
    glow: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]'
  },
  arms: {
    gradient: 'from-emerald-500/10 to-transparent',
    border: 'border-emerald-500/20',
    text: 'text-emerald-400',
    icon: Zap,
    glow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]'
  },
  legs: {
    gradient: 'from-amber-500/10 to-transparent',
    border: 'border-amber-500/20',
    text: 'text-amber-400',
    icon: Flame,
    glow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]'
  },
  core: {
    gradient: 'from-cyan-500/10 to-transparent',
    border: 'border-cyan-500/20',
    text: 'text-cyan-400',
    icon: Target,
    glow: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]'
  },
  cardio: {
    gradient: 'from-rose-500/10 to-transparent',
    border: 'border-rose-500/20',
    text: 'text-rose-400',
    icon: Heart,
    glow: 'group-hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]'
  },
  olympic: {
    gradient: 'from-yellow-500/10 to-transparent',
    border: 'border-yellow-500/20',
    text: 'text-yellow-400',
    icon: Dumbbell,
    glow: 'group-hover:shadow-[0_0_30px_rgba(234,179,8,0.15)]'
  },
  compound: {
    gradient: 'from-indigo-500/10 to-transparent',
    border: 'border-indigo-500/20',
    text: 'text-indigo-400',
    icon: Dumbbell,
    glow: 'group-hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]'
  }
}

const DEFAULT_STYLE = {
  gradient: 'from-white/5 to-transparent',
  border: 'border-white/10',
  text: 'text-white/60',
  icon: Dumbbell,
  glow: ''
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const style = CATEGORY_STYLES[exercise.category] || DEFAULT_STYLE
  const Icon = style.icon

  return (
    <Link href={`/exercises/${exercise.id}`}>
      <Card 
        premium 
        hoverable 
        className={cn(
          "group h-full relative overflow-hidden transition-all duration-500",
          style.glow
        )}
      >
        {/* Gradient Overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br pointer-events-none",
          style.gradient
        )} />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold tracking-tight truncate group-hover:text-white transition-colors">
                {exercise.name}
              </h3>
              <div className={cn(
                "inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                style.text,
                'bg-white/5 border',
                style.border
              )}>
                <Icon className="h-3 w-3" />
                {exercise.category}
              </div>
            </div>
          </div>

          {exercise.exercise_aliases && exercise.exercise_aliases.length > 0 && (
            <p className="text-xs text-white/30 line-clamp-1 mt-4">
              Also: {exercise.exercise_aliases.map(a => a.alias).join(', ')}
            </p>
          )}
        </div>
      </Card>
    </Link>
  )
}

