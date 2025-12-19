import { SubmitWorkoutForm } from '@/components/community/submit-form'
import { submitWorkout } from '@/app/community/actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function SubmitWorkoutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/community" className="p-2 rounded-lg hover:bg-accent transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Share Workout</h1>
          <p className="text-muted-foreground">Post a workout for the community</p>
        </div>
      </div>
      
      <SubmitWorkoutForm action={submitWorkout} />
    </div>
  )
}

