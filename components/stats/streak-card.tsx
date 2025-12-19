import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Flame, Trophy } from 'lucide-react'

interface StreakCardProps {
  streaks: {
    current_streak: number
    longest_streak: number
  }
}

export function StreakCard({ streaks }: StreakCardProps) {
  return (
    <Card className="bg-orange-500/10 border-orange-500/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-500" />
          Consistency
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-4xl font-bold text-orange-500">
            {streaks.current_streak}
          </p>
          <p className="text-xs text-muted-foreground uppercase font-semibold">Day Streak</p>
        </div>
        <div className="pt-4 border-t border-orange-500/10 flex items-center justify-between">
          <div>
            <p className="text-lg font-bold">{streaks.longest_streak}</p>
            <p className="text-[10px] text-muted-foreground uppercase">Best Streak</p>
          </div>
          <Trophy className="h-8 w-8 text-orange-500 opacity-20" />
        </div>
      </CardContent>
    </Card>
  )
}

