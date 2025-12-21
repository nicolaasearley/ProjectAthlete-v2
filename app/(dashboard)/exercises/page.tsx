import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ExerciseGrid } from '@/components/exercises/exercise-grid'
import { ExerciseFilters } from '@/components/exercises/exercise-filters'
import { CreateExerciseDialog } from '@/components/exercises/create-exercise-dialog'
import { EXERCISE_CATEGORIES, Exercise } from '@/types/database'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Exercises | ProjectAthlete',
  description: 'Browse the exercise library and track your personal records.',
}

interface ExercisesPageProps {
  searchParams: Promise<{
    category?: string
    search?: string
    favorites?: string
  }>
}

export default async function ExercisesPage({ searchParams }: ExercisesPageProps) {
  const params = await searchParams
  
  let exercises: Exercise[] = []
  let favoriteIds: string[] = []
  
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    // Fetch user favorites - use type assertion since table is newly added
    const { data: favorites } = await (supabase as any)
      .from('user_favorite_exercises')
      .select('exercise_id')
      .eq('user_id', user.id)
    
    favoriteIds = (favorites || []).map((f: { exercise_id: string }) => f.exercise_id)

    // Build filters for the main query
    let exerciseQuery = supabase
      .from('exercises')
      .select('*, exercise_aliases(*)')
      .order('name')
    
    if (params.category && params.category !== 'all') {
      exerciseQuery = exerciseQuery.eq('category', params.category)
    }

    if (params.favorites === 'true' && favoriteIds.length > 0) {
      exerciseQuery = exerciseQuery.in('id', favoriteIds)
    }
    
    if (params.search) {
      // Try RPC search first - use type assertion for the RPC
      const { data: searchResults } = await (supabase as any).rpc('search_exercises', { 
        search_term: params.search 
      })
      
      const matchingIds = (searchResults || []).map((r: { id: string }) => r.id)
      if (matchingIds.length > 0) {
        exerciseQuery = exerciseQuery.in('id', matchingIds)
      } else {
        exerciseQuery = exerciseQuery.ilike('name', `%${params.search}%`)
      }
    }
    
    const { data } = await exerciseQuery
    exercises = (data || []) as Exercise[]
  } catch (error) {
    console.error('Error loading exercises:', error)
  }
  
  return (
    <div className="space-y-10 pb-20 page-transition">
      {/* Header */}
      <div className="flex items-end justify-between px-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter">Exercise Library</h1>
          <p className="text-foreground/40 font-medium uppercase tracking-[0.2em] text-[10px] mt-1">{exercises.length} exercises available</p>
        </div>
        <CreateExerciseDialog />
      </div>
      
      <ExerciseFilters 
        categories={EXERCISE_CATEGORIES}
        currentCategory={params.category}
        currentSearch={params.search}
        currentFavorites={params.favorites === 'true'}
      />
      
      <ExerciseGrid 
        exercises={exercises as any} 
        favoriteExerciseIds={favoriteIds}
      />
    </div>
  )
}
