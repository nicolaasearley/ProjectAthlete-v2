'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteWorkout } from '@/app/community/actions'

interface DeleteWorkoutButtonProps {
  id: string
}

export function DeleteWorkoutButton({ id }: DeleteWorkoutButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this workout? This action cannot be undone.')) {
      return
    }

    startTransition(async () => {
      try {
        await deleteWorkout(id)
      } catch (error: any) {
        // Next.js redirects throw an error that should not be caught as a failure
        if (error.message === 'NEXT_REDIRECT') return
        
        console.error('Failed to delete workout:', error)
        alert('Failed to delete workout. Please try again.')
      }
    })
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleDelete}
      disabled={isPending}
      className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
      Delete
    </Button>
  )
}

