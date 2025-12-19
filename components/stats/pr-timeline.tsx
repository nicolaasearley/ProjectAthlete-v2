'use client'

import { useState, useEffect, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Loader2, Trophy } from 'lucide-react'

interface PRTimelineProps {
  exercises: { id: string; name: string }[]
  userId: string
}

export function PRTimeline({ exercises, userId }: PRTimelineProps) {
  const [selectedExercise, setSelectedExercise] = useState<string>(exercises[0]?.id || '')
  const [data, setData] = useState<any[]>([])
  const [isPending, startTransition] = useTransition()
  const supabase = createClient()

  useEffect(() => {
    if (!selectedExercise) return

    const fetchPRHistory = async () => {
      startTransition(async () => {
        const { data: prData, error } = await (supabase.rpc as any)('get_pr_history', {
          p_user_id: userId,
          p_exercise_id: selectedExercise
        })

        if (!error && prData) {
          setData(prData.map((d: any) => ({
            date: new Date(d.logged_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            e1rm: Math.round(Number(d.estimated_1rm)),
            weight: Number(d.max_weight),
            reps: d.reps
          })))
        }
      })
    }

    fetchPRHistory()
  }, [selectedExercise, userId])

  if (exercises.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-12">
        <Trophy className="h-12 w-12 opacity-10 mb-2" />
        <p>No exercise data found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <select
        value={selectedExercise}
        onChange={(e) => setSelectedExercise(e.target.value)}
        className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary/30 outline-none"
      >
        {exercises.map((ex) => (
          <option key={ex.id} value={ex.id}>
            {ex.name}
          </option>
        ))}
      </select>

      <div className="h-[240px] relative">
        {isPending ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : null}

        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '11px'
                }}
                formatter={(value: any) => [`${value} lbs`, 'Estimated 1RM']}
              />
              <Line 
                type="monotone" 
                dataKey="e1rm" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'hsl(var(--card))' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            No PR history for this exercise
          </div>
        )}
      </div>
    </div>
  )
}

