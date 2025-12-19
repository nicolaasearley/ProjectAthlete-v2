'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface SetRowProps {
  setNumber: number
  weight: number
  reps: number
  onChange: (data: { weight: number; reps: number }) => void
  onRemove: () => void
  canRemove: boolean
}

export function SetRow({
  setNumber,
  weight,
  reps,
  onChange,
  onRemove,
  canRemove,
}: SetRowProps) {
  return (
    <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center">
      <div className="w-8 text-center text-sm font-medium text-muted-foreground">
        {setNumber}
      </div>
      <input
        type="number"
        value={weight || ''}
        onChange={(e) => onChange({ weight: parseFloat(e.target.value) || 0, reps })}
        placeholder="0"
        min="0"
        step="0.5"
        className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-center"
      />
      <input
        type="number"
        value={reps || ''}
        onChange={(e) => onChange({ weight, reps: parseInt(e.target.value) || 0 })}
        placeholder="0"
        min="0"
        className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-center"
      />
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

