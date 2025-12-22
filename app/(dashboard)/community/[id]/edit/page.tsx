import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { SubmitWorkoutForm } from '@/components/community/submit-form'
import { updateWorkout } from '@/app/community/actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface EditWorkoutPageProps {
  params: Promise<{ id: string }>
}

export default async function EditWorkoutPage({ params }: EditWorkoutPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  
  const { data: workout } = await supabase
    .from('community_workouts')
    .select('*')
    .eq('id', id)
    .single()
  
  if (!workout) notFound()

  // Check permissions: Author or Coach/Admin
  const { data: isAdmin } = await (supabase.rpc as any)('is_coach_or_admin')
  const isAuthor = workout.author_id === user.id
  
  if (!isAuthor && !isAdmin) {
    redirect(`/community/${id}`)
  }

  const handleUpdate = async (data: any) => {
    'use server'
    await updateWorkout(id, data)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href={`/community/${id}`}
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Workout</h1>
          <p className="text-muted-foreground">Update the community workout details</p>
        </div>
      </div>

      <SubmitWorkoutForm 
        action={handleUpdate}
        initialData={workout}
        submitLabel="Save Changes"
      />
    </div>
  )
}

