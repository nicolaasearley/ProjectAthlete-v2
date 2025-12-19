'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, X, Loader2 } from 'lucide-react'
import { EXERCISE_CATEGORIES } from '@/types/database'
import { createCustomExercise } from '@/app/exercises/actions'

export function CreateExerciseDialog() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      try {
        await createCustomExercise(formData)
        setOpen(false)
      } catch (err: any) {
        setError(err.message || 'Failed to create exercise')
      }
    })
  }
  
  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} variant="outline" size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Add Custom Exercise
      </Button>
    )
  }
  
  return (
    <Card className="border-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Create Custom Exercise</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            placeholder="Exercise name"
            required
            autoFocus
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              name="category"
              required
              className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              {EXERCISE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

