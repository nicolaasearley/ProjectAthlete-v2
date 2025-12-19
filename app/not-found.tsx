import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Dumbbell } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Dumbbell className="h-8 w-8 text-primary" />
      </div>
      
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">404</h1>
        <h2 className="text-xl font-semibold text-muted-foreground">Page Not Found</h2>
        <p className="text-muted-foreground max-w-[400px]">
          The page you are looking for doesn&apos;t exist or has been moved to a new location.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild variant="default" size="lg">
          <Link href="/">
            Go to Dashboard
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/workouts">
            View Workouts
          </Link>
        </Button>
      </div>
    </div>
  )
}

