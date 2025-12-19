import { createClient } from '@/lib/supabase/server'
import { ExerciseGrid } from '@/components/exercises/exercise-grid'
import { ExerciseFilters } from '@/components/exercises/exercise-filters'
import { EXERCISE_CATEGORIES } from '@/types/database'

interface ExercisesPageProps {
  searchParams: Promise<{
    category?: string
    search?: string
  }>
}

export default async function ExercisesPage({ searchParams }: ExercisesPageProps) {
  const params = await searchParams
  const supabase = await createClient()
  
  let query = supabase
    .from('exercises')
    .select('*, exercise_aliases(*)')
    .order('name')
  
  if (params.category && params.category !== 'all') {
    query = query.eq('category', params.category)
  }
  
  if (params.search) {
    // Use the search function for better alias matching
    const { data: searchResults, error: searchError } = await (supabase.rpc as any)('search_exercises', { search_term: params.search })
    
    if (searchError) {
      console.error('Search error:', searchError)
    }

    if (searchResults && searchResults.length > 0) {
      query = query.in('id', searchResults.map(r => r.id))
    } else {
      // Fallback: If RPC returns nothing, try a simple ILIKE on the exercises table directly
      // This helps if there are issues with the RPC or aliases
      query = query.ilike('name', `%${params.search}%`)
    }
  }
  
  const { data: exercises } = await query
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Exercise Library</h1>
        <p className="text-muted-foreground">
          {exercises?.length || 0} exercises available
        </p>
      </div>
      
      <ExerciseFilters 
        categories={EXERCISE_CATEGORIES}
        currentCategory={params.category}
        currentSearch={params.search}
      />
      
      <ExerciseGrid exercises={(exercises as any) || []} />
    </div>
  )
}

