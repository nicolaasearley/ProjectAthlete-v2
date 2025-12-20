import { Card, CardContent } from '@/components/ui/card'
import { Flame, Trophy } from 'lucide-react'

interface StreakCardProps {
  streaks: {
    current_streak: number
    longest_streak: number
  }
}

export function StreakCard({ streaks }: StreakCardProps) {
  return (
    <Card premium glow="primary" className="flex flex-col justify-between group h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="stat-label">Consistency</div>
        <div className="h-8 w-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Flame className="h-4 w-4 text-blue-500" />
        </div>
      </div>

      <div>
        <div className="flex items-baseline gap-1">
          <span className="stat-value text-blue-500">{streaks.current_streak}</span>
          <span className="text-sm font-black uppercase tracking-widest text-white/20 ml-2">Days</span>
        </div>
        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Current Streak</p>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
        <div>
          <p className="text-xl font-bold tracking-tight">{streaks.longest_streak}</p>
          <p className="stat-label">All-time Best</p>
        </div>
        <Trophy className="h-8 w-8 text-blue-500/20" />
      </div>
    </Card>
  )
}

