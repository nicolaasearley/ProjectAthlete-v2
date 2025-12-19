import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Weight, Zap, Calendar } from 'lucide-react'

interface StatsData {
  max_weight: number | null
  estimated_1rm: number | null
  max_session_volume: number | null
  total_sets: number | null
  session_count: number | null
}

interface StatsSummaryProps {
  stats: StatsData | null
}

export function StatsSummary({ stats }: StatsSummaryProps) {
  const hasData = stats && stats.total_sets && Number(stats.total_sets) > 0
  
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estimated 1RM</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {hasData && stats.estimated_1rm 
              ? `${Number(stats.estimated_1rm).toFixed(1)} lbs`
              : '—'}
          </div>
          <p className="text-xs text-muted-foreground">Epley formula</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Max Weight</CardTitle>
          <Weight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {hasData && stats.max_weight
              ? `${Number(stats.max_weight)} lbs`
              : '—'}
          </div>
          <p className="text-xs text-muted-foreground">Heaviest set</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Best Volume</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {hasData && stats.max_session_volume
              ? `${Number(stats.max_session_volume).toLocaleString()} lbs`
              : '—'}
          </div>
          <p className="text-xs text-muted-foreground">Single session</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sessions</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {hasData ? Number(stats.session_count) : '—'}
          </div>
          <p className="text-xs text-muted-foreground">
            {hasData ? `${Number(stats.total_sets)} total sets` : 'No data yet'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

