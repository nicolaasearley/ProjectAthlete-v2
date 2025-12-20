'use client'

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

interface VolumeChartProps {
  data: {
    work_date: string
    total_volume: number
  }[]
}

export function VolumeChart({ data }: VolumeChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No data for the selected period
      </div>
    )
  }

  const formattedData = data.map(d => ({
    ...d,
    date: new Date(d.work_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    volume: Number(d.total_volume)
  }))

  return (
    <ResponsiveContainer width="100%" height="100%" debounce={100}>
      <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          minTickGap={30}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            borderColor: 'hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px'
          }}
          itemStyle={{ color: 'hsl(var(--primary))' }}
        />
        <Area 
          type="monotone" 
          dataKey="volume" 
          stroke="hsl(var(--primary))" 
          fillOpacity={1} 
          fill="url(#colorVolume)" 
          strokeWidth={2}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

