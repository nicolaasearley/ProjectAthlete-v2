import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Calendar } from 'lucide-react'
import type { Challenge } from '@/types/database'

interface ChallengeWithProgress extends Challenge {
  progress?: {
    total_value: number
    log_count: number
    rank: number
  } | null
}

interface ChallengeCardProps {
  challenge: ChallengeWithProgress
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const today = new Date().toISOString().split('T')[0]
  const isActive = challenge.start_date <= today && challenge.end_date >= today
  const daysRemaining = Math.max(0, Math.ceil((new Date(challenge.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
  
  return (
    <Link href={`/challenges/${challenge.id}`}>
      <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer relative overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-1">
            <Badge variant={isActive ? 'default' : 'secondary'} className="text-[10px]">
              {isActive ? 'Active' : 'Ended'}
            </Badge>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {isActive ? `${daysRemaining} days left` : 'Ended'}
            </span>
          </div>
          <CardTitle className="text-base line-clamp-1">{challenge.name}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {challenge.description}
          </p>
          
          <div className="pt-2 border-t border-border">
            {challenge.progress && Number(challenge.progress.total_value) > 0 ? (
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Your Progress</p>
                  <p className="font-bold">
                    {Number(challenge.progress.total_value)} {challenge.metric_unit}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Rank</p>
                  <p className="font-bold text-primary">#{challenge.progress.rank}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trophy className="h-4 w-4" />
                <span>Join the challenge!</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

