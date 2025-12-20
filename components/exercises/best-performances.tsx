import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy } from 'lucide-react'

interface Performance {
  set_id: string
  date: string
  weight: number
  reps: number
  estimated_1rm: number
  volume: number
}

interface BestPerformancesProps {
  performances: Performance[]
}

export function BestPerformances({ performances }: BestPerformancesProps) {
  if (performances.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Best Performances
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          <p>No performances recorded yet</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Best Performances
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {performances.map((perf, index) => (
            <div
              key={perf.set_id || index}
              className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
            >
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-muted-foreground">
                  #{index + 1}
                </span>
                <div>
                  <p className="font-medium">
                    {Number(perf.weight)} lbs × {perf.reps} reps
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(perf.date).toLocaleDateString('en-US')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">
                  {Number(perf.estimated_1rm).toFixed(1)} lbs
                </p>
                <p className="text-xs text-muted-foreground">est. 1RM</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

