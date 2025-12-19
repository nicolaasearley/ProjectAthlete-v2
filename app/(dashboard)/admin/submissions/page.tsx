import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ApprovalQueue } from '@/components/admin/approval-queue'
import { approveWorkout, rejectWorkout } from '@/app/admin/actions'

export default async function SubmissionsPage() {
  const supabase = await createClient()
  
  // Check if admin
  const { data: isAdmin } = await supabase.rpc('is_coach_or_admin')
  if (!isAdmin) redirect('/')
  
  // Get pending submissions
  const { data: pending } = await supabase
    .from('community_workouts')
    .select(`
      *,
      author:profiles(display_name)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pending Submissions</h1>
        <p className="text-muted-foreground">Review community workout submissions</p>
      </div>
      
      <ApprovalQueue 
        workouts={(pending as any[]) || []}
        onApprove={approveWorkout}
        onReject={rejectWorkout}
      />
    </div>
  )
}

