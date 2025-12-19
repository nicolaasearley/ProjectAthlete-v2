import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatsSummary } from '@/components/exercises/stats-summary'
import { BestPerformances } from '@/components/exercises/best-performances'
import { ExerciseHistory } from '@/components/exercises/exercise-history'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface ExercisePageProps {
  params: Promise<{ id: string }>
}

export default async function ExercisePage({ params }: ExercisePageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  // Get exercise
  const { data: exercise } = await supabase
    .from('exercises')
    .select('*, exercise_aliases(*)')
    .eq('id', id)
    .single()
  
  if (!exercise) notFound()
  
  // Get stats
  const { data: stats } = await (supabase.rpc as any)('get_exercise_stats', {
    p_exercise_id: id,
  })
  
  // Get best performances
  const { data: bestPerformances } = await (supabase.rpc as any)('get_best_performances', {
    p_exercise_id: id,
    p_limit: 5,
  })
  
  // Get history
  const { data: history } = await (supabase.rpc as any)('get_exercise_history', {
    p_exercise_id: id,
    p_limit: 20,
  })
  
  const statsData = (stats as any)?.[0] || null
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/exercises" className="p-2 rounded-lg hover:bg-accent transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{exercise.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="capitalize">
              {exercise.category}
            </Badge>
            {exercise.is_global && (
              <Badge variant="outline">Global</Badge>
            )}
          </div>
        </div>
      </div>
      
      {/* Aliases */}
      {exercise.exercise_aliases && (exercise.exercise_aliases as any[]).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(exercise.exercise_aliases as any[]).map((alias) => (
            <Badge key={alias.id} variant="outline">
              {alias.alias}
            </Badge>
          ))}
        </div>
      )}
      
      {/* Stats */}
      <StatsSummary stats={statsData} />
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Best Performances */}
        <BestPerformances performances={(bestPerformances as any[]) || []} />
        
        {/* History */}
        <ExerciseHistory history={(history as any[]) || []} />
      </div>
    </div>
  )
}
