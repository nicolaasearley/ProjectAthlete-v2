import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LeaderboardEntry {
  rank: number
  user_id: string
  display_name: string
  is_anonymous: boolean
  total_value: number
  log_count: number
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  currentUserId: string
  unit: string
}

export function Leaderboard({ entries, currentUserId, unit }: LeaderboardProps) {
  const animals = ['🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵']
  
  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>No progress logged yet. Be the first!</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {entries.map((entry) => {
            const isMe = entry.user_id === currentUserId
            const animal = animals[entry.user_id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % animals.length]
            const displayName = entry.is_anonymous && !isMe ? `Anonymous ${animal}` : entry.display_name
            
            return (
              <div
                key={entry.user_id}
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg',
                  isMe ? 'bg-primary/20 border border-primary/50' : 'bg-accent/50'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={cn(
                    'w-6 shrink-0 text-center font-bold',
                    entry.rank === 1 && 'text-yellow-500',
                    entry.rank === 2 && 'text-gray-400',
                    entry.rank === 3 && 'text-amber-600',
                    entry.rank > 3 && 'text-muted-foreground'
                  )}>
                    {entry.rank}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium flex items-center gap-2">
                      <span className="truncate">{displayName}</span>
                      {isMe && <span className="shrink-0 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full uppercase">You</span>}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {entry.log_count} log{entry.log_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="font-bold">
                    {Number(entry.total_value).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{unit}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

