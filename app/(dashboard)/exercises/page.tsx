import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ExerciseGrid } from '@/components/exercises/exercise-grid'
import { ExerciseFilters } from '@/components/exercises/exercise-filters'
import { CreateExerciseDialog } from '@/components/exercises/create-exercise-dialog'
import { EXERCISE_CATEGORIES } from '@/types/database'
import { Library } from 'lucide-react'

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
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Fetch user favorites
  const { data: favorites } = await supabase
    .from('user_favorite_exercises')
    .select('exercise_id')
    .eq('user_id', user.id)
  
  const favoriteIds = favorites?.map(f => f.exercise_id) || []

  let query = supabase
    .from('exercises')
    .select('*, exercise_aliases(*)')
    .order('name')
  
  if (params.category && params.category !== 'all') {
    query = query.eq('category', params.category)
  }

  if (params.favorites === 'true') {
    query = query.in('id', favoriteIds)
  }
  
  if (params.search) {
    try {
      // Use the search function for better alias matching
      const { data: searchResults, error: searchError } = await supabase.rpc('search_exercises', { 
        search_term: params.search 
      })
      
      if (searchError) {
        console.error('Search RPC error:', {
          message: searchError.message,
          details: searchError.details,
          hint: searchError.hint,
          code: searchError.code
        })
        // Fallback to simple filtering if RPC fails
        query = query.ilike('name', `%${params.search}%`)
      } else if (searchResults && searchResults.length > 0) {
        query = query.in('id', searchResults.map((r: any) => r.id))
      } else {
        // No results from RPC, still fallback to be safe
        query = query.ilike('name', `%${params.search}%`)
      }
    } catch (err) {
      console.error('Search unexpected error:', err)
      query = query.ilike('name', `%${params.search}%`)
    }
  }
  
  const { data: exercises } = await query
  
  return (
    <div className="space-y-10 pb-20 page-transition">
      {/* Header */}
      <div className="flex items-end justify-between px-2">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter">Exercise Library</h1>
          <p className="text-foreground/40 font-medium uppercase tracking-[0.2em] text-[10px] mt-1">{exercises?.length || 0} exercises available</p>
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
        exercises={(exercises as any) || []} 
        favoriteExerciseIds={favoriteIds}
      />
    </div>
  )
}

