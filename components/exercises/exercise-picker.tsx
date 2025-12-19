'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Search, Check, X } from 'lucide-react'
import type { Exercise } from '@/types/database'
import { Button } from '@/components/ui/button'

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
  }, [value, selectedExercise, supabase])
  
  // Search exercises
  useEffect(() => {
    if (!open) return
    
    const searchExercises = async () => {
      setLoading(true)
      
      if (search) {
        const { data } = await (supabase.rpc as any)('search_exercises', { 
          search_term: search 
        })
        
        if (data && data.length > 0) {
          // Get full exercise data for search results
          const { data: fullExercises } = await supabase
            .from('exercises')
            .select('*')
            .in('id', data.map((d: any) => d.id))
          
          setExercises(fullExercises || [])
        } else {
          setExercises([])
        }
      } else {
        // Show popular/recent exercises when no search
        const { data } = await supabase
          .from('exercises')
          .select('*')
          .order('name')
          .limit(100)
        
        setExercises(data || [])
      }
      
      setLoading(false)
    }
    
    const debounce = setTimeout(searchExercises, 200)
    return () => clearTimeout(debounce)
  }, [search, open, supabase])
  
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
        <span className={cn(
          'flex-1 truncate',
          !selectedExercise && 'text-muted-foreground'
        )}>
          {selectedExercise?.name || placeholder}
        </span>
      </div>
      
      {open && (
        <div className={cn(
          "z-50 bg-card border border-border shadow-2xl overflow-hidden flex flex-col transition-all duration-200",
          // Mobile: Full screen fixed
          "fixed inset-0 lg:absolute lg:inset-auto lg:top-full lg:left-0 lg:right-0 lg:mt-1 lg:rounded-lg lg:max-h-64",
          // Animation
          "animate-in fade-in zoom-in-95 duration-200"
        )}>
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-2 p-4 border-b border-border bg-background">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent outline-none text-base"
            />
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Desktop Search Bar (already auto-focused on mobile header) */}
          <div className="hidden lg:block p-2 border-b border-border">
            <div className="flex items-center gap-2 px-2 py-1 bg-accent/50 rounded-md">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter..."
                className="flex-1 bg-transparent outline-none text-xs h-6"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm">Searching...</p>
              </div>
            ) : exercises.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p className="text-sm">{search ? 'No exercises found' : 'Start typing to search'}</p>
              </div>
            ) : (
              <div className="py-1">
                {exercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => handleSelect(exercise)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent text-left transition-colors border-b border-border/50 lg:border-none',
                      selectedExercise?.id === exercise.id && 'bg-primary/10 text-primary'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{exercise.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{exercise.category}</p>
                    </div>
                    {selectedExercise?.id === exercise.id && (
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

