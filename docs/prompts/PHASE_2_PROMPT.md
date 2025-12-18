# ProjectAthlete v2 — Phase 2: Exercise Library

> **Copy this entire prompt to your AI coding agent to execute Phase 2.**

---

## Context

Phase 0-1 complete. The app has:
- Next.js 14 with App Router
- Supabase SSR authentication
- Dashboard shell with navigation
- Multi-org data model

Now implementing the **Exercise Library** — a controlled list of exercises with aliases.

---

## Database Setup

Run these SQL migrations in Supabase SQL Editor:

1. `002_exercises.sql` — Creates exercises and exercise_aliases tables
2. `003_exercise_seed.sql` — Seeds 100+ common exercises with aliases

---

## New Files to Create

### Types Update

**Update `types/database.ts`** — Add exercise types:

```typescript
// Add to existing types
export type Database = {
  public: {
    Tables: {
      // ... existing tables ...
      exercises: {
        Row: {
          id: string
          name: string
          category: 'squat' | 'hinge' | 'push' | 'pull' | 'carry' | 'core' | 'olympic' | 'cardio' | 'other'
          is_global: boolean
          org_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: 'squat' | 'hinge' | 'push' | 'pull' | 'carry' | 'core' | 'olympic' | 'cardio' | 'other'
          is_global?: boolean
          org_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: 'squat' | 'hinge' | 'push' | 'pull' | 'carry' | 'core' | 'olympic' | 'cardio' | 'other'
          is_global?: boolean
          org_id?: string | null
          created_at?: string
        }
      }
      exercise_aliases: {
        Row: {
          id: string
          exercise_id: string
          alias: string
        }
        Insert: {
          id?: string
          exercise_id: string
          alias: string
        }
        Update: {
          id?: string
          exercise_id?: string
          alias?: string
        }
      }
    }
  }
}

// Convenience types
export type Exercise = Database['public']['Tables']['exercises']['Row']
export type ExerciseAlias = Database['public']['Tables']['exercise_aliases']['Row']
export type ExerciseCategory = Exercise['category']

export const EXERCISE_CATEGORIES: { value: ExerciseCategory; label: string }[] = [
  { value: 'squat', label: 'Squat' },
  { value: 'hinge', label: 'Hinge' },
  { value: 'push', label: 'Push' },
  { value: 'pull', label: 'Pull' },
  { value: 'carry', label: 'Carry' },
  { value: 'core', label: 'Core' },
  { value: 'olympic', label: 'Olympic' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'other', label: 'Other' },
]
```

---

### Exercise List Page

**`app/(dashboard)/exercises/page.tsx`:**
```typescript
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
    const { data: searchResults } = await supabase
      .rpc('search_exercises', { search_term: params.search })
    
    if (searchResults && searchResults.length > 0) {
      query = query.in('id', searchResults.map(r => r.id))
    } else {
      // No results
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Exercise Library</h1>
            <p className="text-muted-foreground">Browse and search exercises</p>
          </div>
          <ExerciseFilters 
            categories={EXERCISE_CATEGORIES}
            currentCategory={params.category}
            currentSearch={params.search}
          />
          <div className="text-center py-12 text-muted-foreground">
            <p>No exercises found matching "{params.search}"</p>
          </div>
        </div>
      )
    }
  }
  
  const { data: exercises, error } = await query
  
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
      
      <ExerciseGrid exercises={exercises || []} />
    </div>
  )
}
```

---

### Exercise Detail Page

**`app/(dashboard)/exercises/[id]/page.tsx`:**
```typescript
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Weight, Zap } from 'lucide-react'

interface ExercisePageProps {
  params: Promise<{ id: string }>
}

export default async function ExercisePage({ params }: ExercisePageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: exercise } = await supabase
    .from('exercises')
    .select('*, exercise_aliases(*)')
    .eq('id', id)
    .single()
  
  if (!exercise) {
    notFound()
  }
  
  // Placeholder for stats - will be implemented in Phase 4
  const stats = null
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/exercises"
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
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
      {exercise.exercise_aliases && exercise.exercise_aliases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Also Known As</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {exercise.exercise_aliases.map((alias: { id: string; alias: string }) => (
                <Badge key={alias.id} variant="outline">
                  {alias.alias}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Stats Placeholder - Phase 4 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated 1RM</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">—</div>
            <p className="text-xs text-muted-foreground">Log workouts to see stats</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Weight</CardTitle>
            <Weight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">—</div>
            <p className="text-xs text-muted-foreground">Your heaviest set</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sets</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">—</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
      </div>
      
      {/* History Placeholder - Phase 4 */}
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>Your workout history with this exercise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No history yet</p>
            <p className="text-sm">Log a workout with this exercise to see your history</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

### Exercise Components

**`components/exercises/exercise-grid.tsx`:**
```typescript
import { ExerciseCard } from './exercise-card'
import type { Exercise, ExerciseAlias } from '@/types/database'

interface ExerciseWithAliases extends Exercise {
  exercise_aliases: ExerciseAlias[]
}

interface ExerciseGridProps {
  exercises: ExerciseWithAliases[]
}

export function ExerciseGrid({ exercises }: ExerciseGridProps) {
  if (exercises.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No exercises found</p>
      </div>
    )
  }
  
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </div>
  )
}
```

**`components/exercises/exercise-card.tsx`:**
```typescript
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Exercise, ExerciseAlias } from '@/types/database'

interface ExerciseWithAliases extends Exercise {
  exercise_aliases: ExerciseAlias[]
}

interface ExerciseCardProps {
  exercise: ExerciseWithAliases
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <Link href={`/exercises/${exercise.id}`}>
      <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer">
        <CardHeader className="pb-2">
          <CardTitle className="text-base line-clamp-1">{exercise.name}</CardTitle>
          <Badge variant="secondary" className="w-fit capitalize text-xs">
            {exercise.category}
          </Badge>
        </CardHeader>
        <CardContent>
          {exercise.exercise_aliases && exercise.exercise_aliases.length > 0 && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              Also: {exercise.exercise_aliases.map(a => a.alias).join(', ')}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
```

**`components/exercises/exercise-filters.tsx`:**
```typescript
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { useState, useTransition, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface ExerciseFiltersProps {
  categories: { value: string; label: string }[]
  currentCategory?: string
  currentSearch?: string
}

export function ExerciseFilters({ 
  categories, 
  currentCategory,
  currentSearch 
}: ExerciseFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(currentSearch || '')
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )
  
  const handleCategoryChange = (category: string) => {
    startTransition(() => {
      router.push(pathname + '?' + createQueryString('category', category === 'all' ? '' : category))
    })
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => {
      router.push(pathname + '?' + createQueryString('search', searchValue))
    })
  }
  
  const clearSearch = () => {
    setSearchValue('')
    startTransition(() => {
      router.push(pathname + '?' + createQueryString('search', ''))
    })
  }
  
  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchValue && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" disabled={isPending}>
          Search
        </Button>
      </form>
      
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={!currentCategory || currentCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleCategoryChange('all')}
          disabled={isPending}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={currentCategory === cat.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange(cat.value)}
            disabled={isPending}
          >
            {cat.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
```

---

### Exercise Picker Component (Reusable)

**`components/exercises/exercise-picker.tsx`:**
```typescript
'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Search, Check } from 'lucide-react'
import type { Exercise } from '@/types/database'

interface ExercisePickerProps {
  value?: string
  onSelect: (exercise: Exercise) => void
  placeholder?: string
}

export function ExercisePicker({ 
  value, 
  onSelect,
  placeholder = 'Search for an exercise...'
}: ExercisePickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  
  // Load selected exercise if value provided
  useEffect(() => {
    if (value && !selectedExercise) {
      supabase
        .from('exercises')
        .select('*')
        .eq('id', value)
        .single()
        .then(({ data }) => {
          if (data) setSelectedExercise(data)
        })
    }
  }, [value])
  
  // Search exercises
  useEffect(() => {
    if (!open) return
    
    const searchExercises = async () => {
      setLoading(true)
      
      if (search) {
        const { data } = await supabase.rpc('search_exercises', { 
          search_term: search 
        })
        
        if (data) {
          // Get full exercise data for search results
          const { data: fullExercises } = await supabase
            .from('exercises')
            .select('*')
            .in('id', data.map(d => d.id))
          
          setExercises(fullExercises || [])
        }
      } else {
        // Show popular/recent exercises when no search
        const { data } = await supabase
          .from('exercises')
          .select('*')
          .order('name')
          .limit(20)
        
        setExercises(data || [])
      }
      
      setLoading(false)
    }
    
    const debounce = setTimeout(searchExercises, 200)
    return () => clearTimeout(debounce)
  }, [search, open])
  
  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const handleSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise)
    setSearch('')
    setOpen(false)
    onSelect(exercise)
  }
  
  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          'flex items-center gap-2 h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm cursor-pointer',
          open && 'ring-2 ring-ring'
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        {open ? (
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none"
          />
        ) : (
          <span className={cn(
            'flex-1',
            !selectedExercise && 'text-muted-foreground'
          )}>
            {selectedExercise?.name || placeholder}
          </span>
        )}
      </div>
      
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Searching...
            </div>
          ) : exercises.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {search ? 'No exercises found' : 'Start typing to search'}
            </div>
          ) : (
            <div className="py-1">
              {exercises.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => handleSelect(exercise)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent text-left',
                    selectedExercise?.id === exercise.id && 'bg-accent'
                  )}
                >
                  <span className="flex-1">{exercise.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {exercise.category}
                  </span>
                  {selectedExercise?.id === exercise.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

---

### Badge Component

**`components/ui/badge.tsx`:**
```typescript
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        {
          'bg-primary text-primary-foreground': variant === 'default',
          'bg-secondary text-secondary-foreground': variant === 'secondary',
          'border border-border text-foreground': variant === 'outline',
          'bg-destructive text-destructive-foreground': variant === 'destructive',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
```

---

## Verification Checklist

- [ ] Database migrations run successfully
- [ ] `/exercises` page shows all exercises
- [ ] Category filter works
- [ ] Search finds exercises by name
- [ ] Search finds exercises by alias
- [ ] `/exercises/[id]` page shows exercise detail
- [ ] Aliases displayed on detail page
- [ ] ExercisePicker component works (test in isolation)
- [ ] Mobile responsive

---

## What NOT to Do

- ❌ Do not implement stats yet (Phase 4)
- ❌ Do not implement workout logging (Phase 3)
- ❌ Do not allow users to create custom exercises
- ❌ Do not add exercise images/videos
