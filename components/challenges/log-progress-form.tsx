'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

interface LogProgressFormProps {
  challengeId: string
  metricName: string
  unit: string
  onLog: (challengeId: string, value: number, notes?: string) => Promise<void>
}

export function LogProgressForm({ challengeId, metricName, unit, onLog }: LogProgressFormProps) {
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = useState<number | ''>('')
  const [notes, setNotes] = useState('')
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value === '' || value <= 0) return
    
    startTransition(async () => {
      try {
        await onLog(challengeId, value, notes || undefined)
        setValue('')
        setNotes('')
      } catch (error) {
        console.error('Failed to log progress:', error)
      }
    })
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Log Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="number"
                label={`Value (${unit})`}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value === '' ? '' : parseFloat(e.target.value))}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any details about this log?"
              className="w-full h-20 rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none"
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isPending || value === '' || value <= 0}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Add Log
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

