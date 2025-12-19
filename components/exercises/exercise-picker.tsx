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
  }, [value, selectedExercise, supabase])
  
  // Search exercises
  useEffect(() => {
    if (!open) return
    
    const searchExercises = async () => {
      setLoading(true)
      
      if (search) {
        const { data } = await supabase.rpc('search_exercises', { 
          search_term: search 
        })
        
        if (data && data.length > 0) {
          // Get full exercise data for search results
          const { data: fullExercises } = await supabase
            .from('exercises')
            .select('*')
            .in('id', data.map(d => d.id))
          
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

