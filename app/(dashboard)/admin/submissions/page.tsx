import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ApprovalQueue } from '@/components/admin/approval-queue'
import { approveWorkout, rejectWorkout } from '@/app/admin/actions'

export default async function SubmissionsPage() {
  const supabase = await createClient()
  
  // Check if admin
  const { data: isAdmin } = await (supabase.rpc as any)('is_coach_or_admin')
  if (!isAdmin) redirect('/')
  
  // Get current user's org
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()
  
  if (!profile) redirect('/')
  const orgId = (profile as any).org_id

  // Get pending submissions
  const { data: pending } = await supabase
    .from('community_workouts')
    .select('*')
    .eq('org_id', orgId)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  // Fetch authors separately since there might not be a direct FK for easy joining
  const workoutsWithAuthors = [...(pending || [])] as any[]
  if (workoutsWithAuthors.length > 0) {
    const authorIds = [...new Set(workoutsWithAuthors.map(w => w.author_id))] as string[]
    const { data: authors } = await supabase
      .from('profiles')
      .select('id, display_name')
      .in('id', authorIds)
    
    workoutsWithAuthors.forEach((w: any) => {
      w.author = authors?.find(a => a.id === w.author_id)
    })
  }
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pending Submissions</h1>
        <p className="text-muted-foreground">Review community workout submissions</p>
      </div>
      
      <ApprovalQueue 
        workouts={workoutsWithAuthors as any[]}
        onApprove={approveWorkout}
        onReject={rejectWorkout}
      />
    </div>
  )
}

