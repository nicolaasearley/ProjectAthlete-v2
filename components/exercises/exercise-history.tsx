import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { History } from 'lucide-react'
import Link from 'next/link'

interface HistoryEntry {
  session_id: string
  date: string
  set_count: number
  total_reps: number
  total_volume: number
  best_set_weight: number
  best_set_reps: number
  best_e1rm: number
}

interface ExerciseHistoryProps {
  history: HistoryEntry[]
}

export function ExerciseHistory({ history }: ExerciseHistoryProps) {
  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            History
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          <p>No workout history yet</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {history.map((entry) => (
            <Link
              key={entry.session_id}
              href={`/workouts/${entry.session_id}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div>
                <p className="font-medium">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {entry.set_count} sets, {entry.total_reps} reps
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{Number(entry.best_e1rm).toFixed(1)} lbs</p>
                <p className="text-xs text-muted-foreground">best e1RM</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

