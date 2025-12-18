# ProjectAthlete v2 — Phase 3: Workout Logging

> **Copy this entire prompt to your AI coding agent to execute Phase 3.**

---

## Context

Phases 0-2 complete. The app has:
- Authentication with Apple OAuth
- Dashboard with navigation
- Exercise library with 100+ exercises
- Exercise picker component

Now implementing **Workout Logging** — the core feature.

---

## Data Model

```
workout_session (date, user, org)
  └─ workout_exercise (exercise, order)
       └─ workout_set (weight, reps)
```

---

## Database Setup

Run migration `004_workouts.sql` in Supabase SQL Editor.

---

## Types Update

**Add to `types/database.ts`:**

```typescript
// Add to Tables
workout_sessions: {
  Row: {
    id: string
    user_id: string
    org_id: string
    date: string
    notes: string | null
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    user_id: string
    org_id: string
    date: string
    notes?: string | null
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    user_id?: string
    org_id?: string
    date?: string
    notes?: string | null
    created_at?: string
    updated_at?: string
  }
}
workout_exercises: {
  Row: {
    id: string
    session_id: string
    exercise_id: string
    order_index: number
    notes: string | null
    created_at: string
  }
  Insert: {
    id?: string
    session_id: string
    exercise_id: string
    order_index?: number
    notes?: string | null
    created_at?: string
  }
  Update: {
    id?: string
    session_id?: string
    exercise_id?: string
    order_index?: number
    notes?: string | null
    created_at?: string
  }
}
workout_sets: {
  Row: {
    id: string
    workout_exercise_id: string
    set_number: number
    weight: number
    reps: number
    created_at: string
  }
  Insert: {
    id?: string
    workout_exercise_id: string
    set_number: number
    weight: number
    reps: number
    created_at?: string
  }
  Update: {
    id?: string
    workout_exercise_id?: string
    set_number?: number
    weight?: number
    reps?: number
    created_at?: string
  }
}

// Convenience types
export type WorkoutSession = Database['public']['Tables']['workout_sessions']['Row']
export type WorkoutExercise = Database['public']['Tables']['workout_exercises']['Row']
export type WorkoutSet = Database['public']['Tables']['workout_sets']['Row']

// Form types
export interface WorkoutSetInput {
  id?: string
  weight: number
  reps: number
}

export interface WorkoutExerciseInput {
  id?: string
  exercise_id: string
  exercise_name?: string
  sets: WorkoutSetInput[]
}

export interface WorkoutFormData {
  date: string
  notes?: string
  exercises: WorkoutExerciseInput[]
}
```

---

## Server Actions

**`app/workouts/actions.ts`:**

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { WorkoutFormData } from '@/types/database'

export async function createWorkout(data: WorkoutFormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  // Get user's org_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()
  
  if (!profile) throw new Error('Profile not found')
  
  // Create session
  const { data: session, error: sessionError } = await supabase
    .from('workout_sessions')
    .insert({
      user_id: user.id,
      org_id: profile.org_id,
      date: data.date,
      notes: data.notes || null,
    })
    .select()
    .single()
  
  if (sessionError) throw sessionError
  
  // Create exercises and sets
  for (let i = 0; i < data.exercises.length; i++) {
    const exercise = data.exercises[i]
    
    const { data: workoutExercise, error: exerciseError } = await supabase
      .from('workout_exercises')
      .insert({
        session_id: session.id,
        exercise_id: exercise.exercise_id,
        order_index: i,
      })
      .select()
      .single()
    
    if (exerciseError) throw exerciseError
    
    // Create sets
    const sets = exercise.sets.map((set, setIndex) => ({
      workout_exercise_id: workoutExercise.id,
      set_number: setIndex + 1,
      weight: set.weight,
      reps: set.reps,
    }))
    
    if (sets.length > 0) {
      const { error: setsError } = await supabase
        .from('workout_sets')
        .insert(sets)
      
      if (setsError) throw setsError
    }
  }
  
  revalidatePath('/workouts')
  redirect(`/workouts/${session.id}`)
}

export async function updateWorkout(id: string, data: WorkoutFormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  // Update session
  const { error: sessionError } = await supabase
    .from('workout_sessions')
    .update({
      date: data.date,
      notes: data.notes || null,
    })
    .eq('id', id)
    .eq('user_id', user.id)
  
  if (sessionError) throw sessionError
  
  // Delete existing exercises (cascades to sets)
  await supabase
    .from('workout_exercises')
    .delete()
    .eq('session_id', id)
  
  // Recreate exercises and sets
  for (let i = 0; i < data.exercises.length; i++) {
    const exercise = data.exercises[i]
    
    const { data: workoutExercise, error: exerciseError } = await supabase
      .from('workout_exercises')
      .insert({
        session_id: id,
        exercise_id: exercise.exercise_id,
        order_index: i,
      })
      .select()
      .single()
    
    if (exerciseError) throw exerciseError
    
    const sets = exercise.sets.map((set, setIndex) => ({
      workout_exercise_id: workoutExercise.id,
      set_number: setIndex + 1,
      weight: set.weight,
      reps: set.reps,
    }))
    
    if (sets.length > 0) {
      await supabase.from('workout_sets').insert(sets)
    }
  }
  
  revalidatePath('/workouts')
  revalidatePath(`/workouts/${id}`)
  redirect(`/workouts/${id}`)
}

export async function deleteWorkout(id: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { error } = await supabase
    .from('workout_sessions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
  
  if (error) throw error
  
  revalidatePath('/workouts')
  redirect('/workouts')
}

export async function getWorkouts() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('workout_sessions')
    .select(`
      *,
      workout_exercises(
        *,
        exercises(name, category),
        workout_sets(*)
      )
    `)
    .order('date', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getWorkout(id: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('workout_sessions')
    .select(`
      *,
      workout_exercises(
        *,
        exercises(id, name, category),
        workout_sets(*)
      )
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}
```

---

## Pages

### Workouts List

**`app/(dashboard)/workouts/page.tsx`:**

```typescript
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { WorkoutCard } from '@/components/workouts/workout-card'
import Link from 'next/link'
import { Plus, Dumbbell } from 'lucide-react'

export default async function WorkoutsPage() {
  const supabase = await createClient()
  
  const { data: workouts } = await supabase
    .from('workout_sessions')
    .select(`
      *,
      workout_exercises(
        id,
        exercises(name),
        workout_sets(id)
      )
    `)
    .order('date', { ascending: false })
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workouts</h1>
          <p className="text-muted-foreground">
            {workouts?.length || 0} workouts logged
          </p>
        </div>
        <Button asChild>
          <Link href="/workouts/new">
            <Plus className="h-4 w-4 mr-2" />
            Log Workout
          </Link>
        </Button>
      </div>
      
      {workouts && workouts.length > 0 ? (
        <div className="space-y-4">
          {workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h3 className="text-lg font-medium">No workouts yet</h3>
          <p className="text-muted-foreground mb-4">Start logging to track your progress</p>
          <Button asChild>
            <Link href="/workouts/new">
              <Plus className="h-4 w-4 mr-2" />
              Log Your First Workout
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
```

### New Workout

**`app/(dashboard)/workouts/new/page.tsx`:**

```typescript
import { WorkoutForm } from '@/components/workouts/workout-form'
import { createWorkout } from '@/app/workouts/actions'

export default function NewWorkoutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Log Workout</h1>
        <p className="text-muted-foreground">Record your training session</p>
      </div>
      
      <WorkoutForm action={createWorkout} />
    </div>
  )
}
```

### View/Edit Workout

**`app/(dashboard)/workouts/[id]/page.tsx`:**

```typescript
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { WorkoutForm } from '@/components/workouts/workout-form'
import { updateWorkout, deleteWorkout } from '@/app/workouts/actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface WorkoutPageProps {
  params: Promise<{ id: string }>
}

export default async function WorkoutPage({ params }: WorkoutPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: workout } = await supabase
    .from('workout_sessions')
    .select(`
      *,
      workout_exercises(
        *,
        exercises(id, name, category),
        workout_sets(*)
      )
    `)
    .eq('id', id)
    .single()
  
  if (!workout) {
    notFound()
  }
  
  // Transform to form data
  const initialData = {
    date: workout.date,
    notes: workout.notes || '',
    exercises: workout.workout_exercises
      .sort((a, b) => a.order_index - b.order_index)
      .map((we) => ({
        id: we.id,
        exercise_id: we.exercise_id,
        exercise_name: we.exercises?.name,
        sets: we.workout_sets
          .sort((a, b) => a.set_number - b.set_number)
          .map((s) => ({
            id: s.id,
            weight: s.weight,
            reps: s.reps,
          })),
      })),
  }
  
  const updateAction = updateWorkout.bind(null, id)
  const deleteAction = deleteWorkout.bind(null, id)
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/workouts"
          className="p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Edit Workout</h1>
          <p className="text-muted-foreground">
            {new Date(workout.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>
      
      <WorkoutForm 
        action={updateAction}
        initialData={initialData}
        deleteAction={deleteAction}
      />
    </div>
  )
}
```

---

## Components

### Workout Form

**`components/workouts/workout-form.tsx`:**

```typescript
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExerciseInput } from './exercise-input'
import { Plus, Loader2, Trash2 } from 'lucide-react'
import type { WorkoutFormData, WorkoutExerciseInput } from '@/types/database'

interface WorkoutFormProps {
  action: (data: WorkoutFormData) => Promise<void>
  initialData?: WorkoutFormData
  deleteAction?: () => Promise<void>
}

export function WorkoutForm({ action, initialData, deleteAction }: WorkoutFormProps) {
  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split('T')[0]
  )
  const [notes, setNotes] = useState(initialData?.notes || '')
  const [exercises, setExercises] = useState<WorkoutExerciseInput[]>(
    initialData?.exercises || []
  )
  
  const addExercise = () => {
    setExercises([
      ...exercises,
      { exercise_id: '', sets: [{ weight: 0, reps: 0 }] },
    ])
  }
  
  const updateExercise = (index: number, data: WorkoutExerciseInput) => {
    const updated = [...exercises]
    updated[index] = data
    setExercises(updated)
  }
  
  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate
    if (!date) return
    if (exercises.length === 0) return
    
    const validExercises = exercises.filter(
      (ex) => ex.exercise_id && ex.sets.some((s) => s.weight > 0 && s.reps > 0)
    )
    
    if (validExercises.length === 0) return
    
    startTransition(async () => {
      await action({
        date,
        notes: notes || undefined,
        exercises: validExercises,
      })
    })
  }
  
  const handleDelete = () => {
    if (!deleteAction) return
    if (!confirm('Are you sure you want to delete this workout?')) return
    
    setIsDeleting(true)
    startTransition(async () => {
      await deleteAction()
    })
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workout Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="date"
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did the workout feel?"
              className="w-full h-20 rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Exercises</h2>
          <Button type="button" variant="outline" size="sm" onClick={addExercise}>
            <Plus className="h-4 w-4 mr-1" />
            Add Exercise
          </Button>
        </div>
        
        {exercises.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <p>No exercises added yet</p>
              <Button 
                type="button" 
                variant="outline" 
                className="mt-4"
                onClick={addExercise}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Your First Exercise
              </Button>
            </CardContent>
          </Card>
        ) : (
          exercises.map((exercise, index) => (
            <ExerciseInput
              key={index}
              data={exercise}
              onChange={(data) => updateExercise(index, data)}
              onRemove={() => removeExercise(index)}
            />
          ))
        )}
      </div>
      
      <div className="flex gap-4">
        <Button 
          type="submit" 
          disabled={isPending || exercises.length === 0}
          className="flex-1"
        >
          {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {initialData ? 'Save Changes' : 'Log Workout'}
        </Button>
        
        {deleteAction && (
          <Button 
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending || isDeleting}
          >
            {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  )
}
```

### Exercise Input

**`components/workouts/exercise-input.tsx`:**

```typescript
'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExercisePicker } from '@/components/exercises/exercise-picker'
import { SetRow } from './set-row'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import type { WorkoutExerciseInput, Exercise } from '@/types/database'

interface ExerciseInputProps {
  data: WorkoutExerciseInput
  onChange: (data: WorkoutExerciseInput) => void
  onRemove: () => void
}

export function ExerciseInput({ data, onChange, onRemove }: ExerciseInputProps) {
  const handleExerciseSelect = (exercise: Exercise) => {
    onChange({
      ...data,
      exercise_id: exercise.id,
      exercise_name: exercise.name,
    })
  }
  
  const addSet = () => {
    // Copy last set's values for convenience
    const lastSet = data.sets[data.sets.length - 1]
    onChange({
      ...data,
      sets: [
        ...data.sets,
        { weight: lastSet?.weight || 0, reps: lastSet?.reps || 0 },
      ],
    })
  }
  
  const updateSet = (index: number, set: { weight: number; reps: number }) => {
    const updated = [...data.sets]
    updated[index] = set
    onChange({ ...data, sets: updated })
  }
  
  const removeSet = (index: number) => {
    if (data.sets.length <= 1) return
    onChange({
      ...data,
      sets: data.sets.filter((_, i) => i !== index),
    })
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 py-3">
        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
        <div className="flex-1">
          <ExercisePicker
            value={data.exercise_id}
            onSelect={handleExerciseSelect}
            placeholder={data.exercise_name || 'Select exercise...'}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Header */}
        <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 text-xs text-muted-foreground px-1">
          <div className="w-8 text-center">Set</div>
          <div>Weight (lbs)</div>
          <div>Reps</div>
          <div className="w-8"></div>
        </div>
        
        {/* Sets */}
        {data.sets.map((set, index) => (
          <SetRow
            key={index}
            setNumber={index + 1}
            weight={set.weight}
            reps={set.reps}
            onChange={(updated) => updateSet(index, updated)}
            onRemove={() => removeSet(index)}
            canRemove={data.sets.length > 1}
          />
        ))}
        
        {/* Add Set Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addSet}
          className="w-full text-muted-foreground"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Set
        </Button>
      </CardContent>
    </Card>
  )
}
```

### Set Row

**`components/workouts/set-row.tsx`:**

```typescript
'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface SetRowProps {
  setNumber: number
  weight: number
  reps: number
  onChange: (data: { weight: number; reps: number }) => void
  onRemove: () => void
  canRemove: boolean
}

export function SetRow({
  setNumber,
  weight,
  reps,
  onChange,
  onRemove,
  canRemove,
}: SetRowProps) {
  return (
    <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center">
      <div className="w-8 text-center text-sm font-medium text-muted-foreground">
        {setNumber}
      </div>
      <input
        type="number"
        value={weight || ''}
        onChange={(e) => onChange({ weight: parseFloat(e.target.value) || 0, reps })}
        placeholder="0"
        min="0"
        step="0.5"
        className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-center"
      />
      <input
        type="number"
        value={reps || ''}
        onChange={(e) => onChange({ weight, reps: parseInt(e.target.value) || 0 })}
        placeholder="0"
        min="0"
        className="h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm text-center"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        disabled={!canRemove}
        className="h-8 w-8 text-muted-foreground hover:text-destructive disabled:opacity-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
```

### Workout Card

**`components/workouts/workout-card.tsx`:**

```typescript
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Dumbbell } from 'lucide-react'

interface WorkoutExerciseData {
  id: string
  exercises: { name: string } | null
  workout_sets: { id: string }[]
}

interface WorkoutData {
  id: string
  date: string
  notes: string | null
  workout_exercises: WorkoutExerciseData[]
}

interface WorkoutCardProps {
  workout: WorkoutData
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const exerciseCount = workout.workout_exercises.length
  const totalSets = workout.workout_exercises.reduce(
    (sum, ex) => sum + ex.workout_sets.length,
    0
  )
  
  const formattedDate = new Date(workout.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  
  return (
    <Link href={`/workouts/${workout.id}`}>
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {formattedDate}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="outline">
                {totalSets} set{totalSets !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {workout.workout_exercises.slice(0, 5).map((ex) => (
              <Badge key={ex.id} variant="outline" className="text-xs">
                {ex.exercises?.name || 'Unknown'}
              </Badge>
            ))}
            {workout.workout_exercises.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{workout.workout_exercises.length - 5} more
              </Badge>
            )}
          </div>
          {workout.notes && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
              {workout.notes}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
```

---

## Verification Checklist

- [ ] `/workouts` shows empty state initially
- [ ] `/workouts/new` renders workout form
- [ ] Can select date
- [ ] Can add exercise using picker
- [ ] Can add multiple sets to exercise
- [ ] Can add multiple exercises
- [ ] Can remove sets (except last one)
- [ ] Can remove exercises
- [ ] Form submits successfully
- [ ] Redirects to workout detail after save
- [ ] Workout appears in list
- [ ] Can edit existing workout
- [ ] Can delete workout with confirmation
- [ ] RLS prevents seeing other users' workouts

---

## What NOT to Do

- ❌ Do not add set metadata (RPE, tempo, notes)
- ❌ Do not add workout templates
- ❌ Do not add auto-save
- ❌ Do not add timers
- ❌ Do not add drag-and-drop reordering (nice to have, not v1)
