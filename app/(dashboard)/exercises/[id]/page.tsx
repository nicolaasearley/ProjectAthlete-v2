import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { StatsSummary } from '@/components/exercises/stats-summary'
import { BestPerformances } from '@/components/exercises/best-performances'
import { ExerciseHistory } from '@/components/exercises/exercise-history'
import { ExerciseMedia } from '@/components/exercises/exercise-media'
import Link from 'next/link'
import { ArrowLeft, Dumbbell } from 'lucide-react'

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

  if (!exercise) {
    notFound()
  }

  // Force narrowing for TypeScript
  const exerciseData = exercise as any

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
          <h1 className="text-3xl font-bold">{exerciseData.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="capitalize">
              {exerciseData.category}
            </Badge>
            {exerciseData.is_global && (
              <Badge variant="outline">Global</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Info & Media Section */}
      <Card premium className="overflow-hidden">
        <div className="grid lg:grid-cols-2">
          {/* Media Side */}
          <div className="relative aspect-video lg:aspect-auto h-full min-h-[300px] bg-foreground/5 border-b lg:border-b-0 lg:border-r border-border/50">
            {exerciseData.demo_url ? (
              <ExerciseMedia
                src={exerciseData.demo_url}
                alt={exerciseData.name}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground/10">
                <Dumbbell className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-[10px] font-black uppercase tracking-widest">No Demo Available</p>
              </div>
            )}
          </div>

          {/* Info Side */}
          <div className="p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                  {exerciseData.category}
                </Badge>
                {exerciseData.primary_muscle_group && (
                  <Badge className="bg-foreground/5 text-foreground/60 border-foreground/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                    {exerciseData.primary_muscle_group}
                  </Badge>
                )}
              </div>

              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/30 mb-4">Technique & Instructions</h2>
              {exerciseData.description ? (
                <p className="text-lg text-foreground/80 leading-relaxed font-medium italic mb-8">
                  "{exerciseData.description}"
                </p>
              ) : (
                <p className="text-sm text-foreground/20 font-medium italic mb-8">
                  No instructions provided yet.
                </p>
              )}
            </div>

            <div className="space-y-6 pt-6 border-t border-border/30">
              {exerciseData.secondary_muscle_groups && (exerciseData.secondary_muscle_groups as string[]).length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/20 mb-3">Secondary Muscles</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(exerciseData.secondary_muscle_groups as string[]).map(muscle => (
                      <span key={muscle} className="px-2 py-0.5 rounded-md bg-foreground/5 text-[9px] font-bold text-foreground/40 uppercase tracking-tight border border-foreground/5">
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {exerciseData.exercise_aliases && (exerciseData.exercise_aliases as any[]).length > 0 && (
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/20 mb-3">Also Known As</h3>
                  <div className="flex flex-wrap gap-2">
                    {(exerciseData.exercise_aliases as any[]).map((alias) => (
                      <Badge key={alias.id} variant="outline" className="text-[10px] font-medium tracking-tight border-foreground/5 bg-foreground/[0.02] px-2 py-0">
                        {alias.alias}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

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
