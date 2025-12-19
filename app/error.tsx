'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
      <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Something went wrong</h1>
        <p className="text-muted-foreground max-w-[400px]">
          An unexpected error occurred while processing your request. Our team has been notified.
        </p>
        {error.digest && (
          <p className="text-[10px] font-mono text-muted-foreground mt-4">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={() => reset()} variant="default" size="lg" className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Try again
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline" size="lg">
          Go to Home
        </Button>
      </div>
    </div>
  )
}

