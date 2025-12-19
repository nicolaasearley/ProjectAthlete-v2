'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Clock } from 'lucide-react'

interface ChallengeCountdownProps {
  endDate: string
}

export function ChallengeCountdown({ endDate }: ChallengeCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    const target = new Date(endDate).getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = target - now

      if (distance < 0) {
        setTimeLeft(null)
        return
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [endDate])

  if (!timeLeft) return null

  return (
    <Card className="bg-primary/5 border-primary/20 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">Time Remaining</span>
          </div>
          <div className="flex gap-3">
            <div className="text-center">
              <p className="text-xl font-bold leading-none">{timeLeft.days}</p>
              <p className="text-[10px] text-muted-foreground uppercase mt-1">Days</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold leading-none">{timeLeft.hours}</p>
              <p className="text-[10px] text-muted-foreground uppercase mt-1">Hrs</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold leading-none">{timeLeft.minutes}</p>
              <p className="text-[10px] text-muted-foreground uppercase mt-1">Min</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold leading-none">{timeLeft.seconds}</p>
              <p className="text-[10px] text-muted-foreground uppercase mt-1">Sec</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

