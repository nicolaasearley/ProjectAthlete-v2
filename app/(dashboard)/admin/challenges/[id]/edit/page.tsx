import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateChallenge, deleteChallenge } from '@/app/challenges/actions'
import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'

interface EditChallengePageProps {
  params: Promise<{ id: string }>
}

export default async function EditChallengePage({ params }: EditChallengePageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  // Check if admin
  const { data: isAdmin } = await (supabase.rpc as any)('is_coach_or_admin')
  if (!isAdmin) redirect('/challenges')
  
  const { data: challenge } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', id)
    .single()
    
  if (!challenge) {
    notFound()
  }

  // Force narrowing for TypeScript
  const challengeData = challenge as any

  const updateAction = updateChallenge.bind(null, id)
  const deleteAction = deleteChallenge.bind(null, id)
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/challenges/${id}`} className="p-2 rounded-lg hover:bg-accent transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Challenge</h1>
            <p className="text-muted-foreground">Modify challenge details or configuration</p>
          </div>
        </div>
        <form action={deleteAction}>
          <Button type="submit" variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
            <Trash2 className="h-5 w-5" />
          </Button>
        </form>
      </div>
      
      <form action={updateAction}>
        <Card>
          <CardHeader>
            <CardTitle>Challenge Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              name="name"
              label="Challenge Name"
              defaultValue={challengeData.name}
              required
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                defaultValue={challengeData.description || ''}
                className="w-full h-32 rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none"
                required
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="metric"
                label="Metric (e.g., Pull-ups, Miles)"
                defaultValue={challengeData.metric}
                required
              />
              <Input
                name="metric_unit"
                label="Unit (e.g., reps, miles, mins)"
                defaultValue={challengeData.metric_unit}
                required
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="start_date"
                label="Start Date"
                type="date"
                defaultValue={challengeData.start_date}
                required
              />
              <Input
                name="end_date"
                label="End Date"
                type="date"
                defaultValue={challengeData.end_date}
                required
              />
            </div>
            
            <Button type="submit" className="w-full h-12">
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

