'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface SetRowProps {
  setNumber: number
  data: {
    weight?: number
    reps?: number
    distance_meters?: number
    time_seconds?: number
    calories?: number
  }
  metricType?: string
  onChange: (data: any) => void
  onRemove: () => void
  canRemove: boolean
}

export function SetRow({
  setNumber,
  data,
  metricType = 'weight_reps',
  onChange,
  onRemove,
  canRemove,
}: SetRowProps) {
  const showWeight = metricType === 'weight_reps'
  const showReps = metricType === 'weight_reps'
  const showDistance = metricType === 'distance' || metricType === 'time_distance'
  const showTime = metricType === 'time' || metricType === 'time_distance' || metricType === 'time_calories'
  const showCalories = metricType === 'calories' || metricType === 'time_calories'

  // Format seconds to MM:SS for input display if possible, or just use seconds
  const [timeValue, setTimeValue] = useState(data.time_seconds?.toString() || '')

  return (
    <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 sm:gap-3 items-center">
      <div className="w-6 sm:w-8 text-center text-sm font-bold text-primary/80">
        {setNumber}
      </div>
      
      <div className="col-span-2 grid grid-cols-2 gap-2">
        {showWeight && (
          <div className="relative">
            <input
              type="number"
              value={data.weight || ''}
              onChange={(e) => onChange({ ...data, weight: parseFloat(e.target.value) || 0 })}
              placeholder="lbs"
              className="w-full h-10 sm:h-12 rounded-lg border border-input bg-background px-2 text-sm text-center focus:ring-2 focus:ring-primary/30 outline-none"
            />
            <span className="hidden xs:block absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-muted-foreground pointer-events-none uppercase">lbs</span>
          </div>
        )}

        {showReps && (
          <div className="relative">
            <input
              type="number"
              value={data.reps || ''}
              onChange={(e) => onChange({ ...data, reps: parseInt(e.target.value) || 0 })}
              placeholder="reps"
              className="w-full h-10 sm:h-12 rounded-lg border border-input bg-background px-2 text-sm text-center focus:ring-2 focus:ring-primary/30 outline-none"
            />
            <span className="hidden xs:block absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-muted-foreground pointer-events-none uppercase">reps</span>
          </div>
        )}

        {showTime && (
          <div className="relative">
            <input
              type="text"
              value={timeValue}
              onChange={(e) => {
                setTimeValue(e.target.value)
                onChange({ ...data, time_seconds: parseInt(e.target.value) || 0 })
              }}
              placeholder="sec"
              className="w-full h-10 sm:h-12 rounded-lg border border-input bg-background px-2 text-sm text-center focus:ring-2 focus:ring-primary/30 outline-none"
            />
            <span className="hidden xs:block absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-muted-foreground pointer-events-none uppercase">sec</span>
          </div>
        )}

        {showDistance && (
          <div className="relative">
            <input
              type="number"
              value={data.distance_meters || ''}
              onChange={(e) => onChange({ ...data, distance_meters: parseFloat(e.target.value) || 0 })}
              placeholder="m"
              className="w-full h-10 sm:h-12 rounded-lg border border-input bg-background px-2 text-sm text-center focus:ring-2 focus:ring-primary/30 outline-none"
            />
            <span className="hidden xs:block absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-muted-foreground pointer-events-none uppercase">m</span>
          </div>
        )}

        {showCalories && (
          <div className="relative">
            <input
              type="number"
              value={data.calories || ''}
              onChange={(e) => onChange({ ...data, calories: parseInt(e.target.value) || 0 })}
              placeholder="cal"
              className="w-full h-10 sm:h-12 rounded-lg border border-input bg-background px-2 text-sm text-center focus:ring-2 focus:ring-primary/30 outline-none"
            />
            <span className="hidden xs:block absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-muted-foreground pointer-events-none uppercase">cal</span>
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        disabled={!canRemove}
        className="h-8 w-8 text-muted-foreground hover:text-destructive disabled:opacity-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
