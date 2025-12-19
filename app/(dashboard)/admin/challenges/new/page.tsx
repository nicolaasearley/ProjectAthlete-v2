import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createChallenge } from '@/app/challenges/actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function NewChallengePage() {
  const supabase = await createClient()
  
  // Check if admin
  const { data: isAdmin } = await (supabase.rpc as any)('is_coach_or_admin')
  if (!isAdmin) redirect('/challenges')
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/challenges" className="p-2 rounded-lg hover:bg-accent transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">New Challenge</h1>
          <p className="text-muted-foreground">Create a monthly community competition</p>
        </div>
      </div>
      
      <form action={createChallenge}>
        <Card>
          <CardHeader>
            <CardTitle>Challenge Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              name="name"
              label="Challenge Name"
              placeholder="e.g., Summer Shred, 10k Pull-up Challenge"
              required
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                placeholder="What is this challenge about? How can users participate?"
                className="w-full h-32 rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none"
                required
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="metric"
                label="Metric (e.g., Pull-ups, Miles)"
                placeholder="Pull-ups"
                required
              />
              <Input
                name="metric_unit"
                label="Unit (e.g., reps, miles, mins)"
                placeholder="reps"
                required
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                name="start_date"
                label="Start Date"
                type="date"
                required
              />
              <Input
                name="end_date"
                label="End Date"
                type="date"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Badge Image (optional)</label>
              <Input
                name="badge_image"
                type="file"
                accept="image/*"
              />
              <p className="text-[10px] text-muted-foreground italic">Custom badges make your challenge stand out!</p>
            </div>
            
            <Button type="submit" className="w-full h-12">
              Create Challenge
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

