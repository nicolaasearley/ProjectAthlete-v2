'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Trash2, X, Check, Loader2 } from 'lucide-react'
import { updateProgress, deleteProgress } from '@/app/challenges/actions'

interface ChallengeLog {
  id: string
  value: number
  notes: string | null
  logged_at: string
}

interface ChallengeLogHistoryProps {
  logs: ChallengeLog[]
  challengeId: string
  unit: string
}

export function ChallengeLogHistory({ logs, challengeId, unit }: ChallengeLogHistoryProps) {
  const [editingId, setEditId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleEdit = (log: ChallengeLog) => {
    setEditId(log.id)
    setEditValue(log.value.toString())
    setEditNotes(log.notes || '')
  }

  const handleCancel = () => {
    setEditId(null)
    setEditValue('')
    setEditNotes('')
  }

  const handleSave = async (id: string) => {
    const val = parseFloat(editValue)
    if (isNaN(val)) return

    startTransition(async () => {
      try {
        await updateProgress(id, challengeId, val, editNotes)
        setEditId(null)
      } catch (error) {
        console.error('Failed to update log:', error)
      }
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this log?')) return

    startTransition(async () => {
      try {
        await deleteProgress(id, challengeId)
      } catch (error) {
        console.error('Failed to delete log:', error)
      }
    })
  }

  if (logs.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Progress Logs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="divide-y divide-border">
          {logs.map((log) => (
            <div key={log.id} className="py-3 first:pt-0 last:pb-0">
              {editingId === log.id ? (
                <div className="space-y-3 bg-accent/30 p-3 rounded-lg">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] uppercase text-muted-foreground font-semibold px-1">Value ({unit})</label>
                      <Input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="h-9"
                        autoFocus
                      />
                    </div>
                    <div className="flex items-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleCancel}
                        disabled={isPending}
                        className="h-9 w-9 text-muted-foreground"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        onClick={() => handleSave(log.id)}
                        disabled={isPending}
                        className="h-9 w-9"
                      >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-muted-foreground font-semibold px-1">Notes (optional)</label>
                    <Input
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Add a note..."
                      className="h-9"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between group pr-14 md:pr-0">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <p className="font-bold text-lg">
                        {log.value} <span className="text-xs font-normal text-muted-foreground uppercase">{unit}</span>
                      </p>
                      <span className="text-[10px] text-muted-foreground uppercase">
                        {(() => {
                          const dateStr = log.logged_at
                          // If it's a full timestamp, extract just the date part
                          const datePart = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr.substring(0, 10)
                          // Parse as local date
                          const [year, month, day] = datePart.split('-').map(Number)
                          return new Date(year, month - 1, day).toLocaleDateString('en-US')
                        })()}
                      </span>
                    </div>
                    {log.notes && (
                      <p className="text-xs text-muted-foreground italic">&ldquo;{log.notes}&rdquo;</p>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(log)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(log.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

