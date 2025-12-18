# ProjectAthlete v2 — Phases 4, 5, 6: Stats, Community, Challenges

> **This document contains prompts for Phases 4, 5, and 6. Execute them in order.**

---

# Phase 4: Exercise Stats

## Context
Workout logging complete. Now adding computed statistics per exercise.

## Database Setup
Run migration `005_exercise_stats.sql` in Supabase SQL Editor.

## Stats to Display

| Stat | Description |
|------|-------------|
| Estimated 1RM | `weight × (1 + reps/30)` - Epley formula |
| Max Weight | Heaviest weight used |
| Max Session Volume | Highest `SUM(weight × reps)` in a session |
| Total Sets | All-time count |
| Best Performances | Top 5 by e1RM |

## Update Exercise Detail Page

**`app/(dashboard)/exercises/[id]/page.tsx`:**

Replace the placeholder stats section with real data:

```typescript
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  const { data: stats } = await supabase.rpc('get_exercise_stats', {
    p_exercise_id: id,
  })
  
  // Get best performances
  const { data: bestPerformances } = await supabase.rpc('get_best_performances', {
    p_exercise_id: id,
    p_limit: 5,
  })
  
  // Get history
  const { data: history } = await supabase.rpc('get_exercise_history', {
    p_exercise_id: id,
    p_limit: 20,
  })
  
  const statsData = stats?.[0] || null
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/exercises" className="p-2 rounded-lg hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{exercise.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="capitalize">
              {exercise.category}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Aliases */}
      {exercise.exercise_aliases?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {exercise.exercise_aliases.map((alias) => (
            <Badge key={alias.id} variant="outline">
              {alias.alias}
            </Badge>
          ))}
        </div>
      )}
      
      {/* Stats */}
      <StatsSummary stats={statsData} />
      
      {/* Best Performances */}
      <BestPerformances performances={bestPerformances || []} />
      
      {/* History */}
      <ExerciseHistory history={history || []} />
    </div>
  )
}
```

## New Components

**`components/exercises/stats-summary.tsx`:**
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Weight, Zap, Calendar } from 'lucide-react'

interface StatsData {
  max_weight: number | null
  estimated_1rm: number | null
  max_session_volume: number | null
  total_sets: number | null
  session_count: number | null
}

interface StatsSummaryProps {
  stats: StatsData | null
}

export function StatsSummary({ stats }: StatsSummaryProps) {
  const hasData = stats && stats.total_sets && stats.total_sets > 0
  
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estimated 1RM</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {hasData && stats.estimated_1rm 
              ? `${stats.estimated_1rm.toFixed(1)} lbs`
              : '—'}
          </div>
          <p className="text-xs text-muted-foreground">Epley formula</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Max Weight</CardTitle>
          <Weight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {hasData && stats.max_weight
              ? `${stats.max_weight} lbs`
              : '—'}
          </div>
          <p className="text-xs text-muted-foreground">Heaviest set</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Best Volume</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {hasData && stats.max_session_volume
              ? `${stats.max_session_volume.toLocaleString()} lbs`
              : '—'}
          </div>
          <p className="text-xs text-muted-foreground">Single session</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sessions</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {hasData ? stats.session_count : '—'}
          </div>
          <p className="text-xs text-muted-foreground">
            {hasData ? `${stats.total_sets} total sets` : 'No data yet'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

**`components/exercises/best-performances.tsx`:**
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy } from 'lucide-react'

interface Performance {
  date: string
  weight: number
  reps: number
  estimated_1rm: number
}

interface BestPerformancesProps {
  performances: Performance[]
}

export function BestPerformances({ performances }: BestPerformancesProps) {
  if (performances.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Best Performances
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          <p>No performances recorded yet</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Best Performances
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {performances.map((perf, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-accent/50"
            >
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-muted-foreground">
                  #{index + 1}
                </span>
                <div>
                  <p className="font-medium">
                    {perf.weight} lbs × {perf.reps} reps
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(perf.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">
                  {perf.estimated_1rm.toFixed(1)} lbs
                </p>
                <p className="text-xs text-muted-foreground">est. 1RM</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

**`components/exercises/exercise-history.tsx`:**
```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { History } from 'lucide-react'
import Link from 'next/link'

interface HistoryEntry {
  session_id: string
  date: string
  set_count: number
  total_reps: number
  best_e1rm: number
}

interface ExerciseHistoryProps {
  history: HistoryEntry[]
}

export function ExerciseHistory({ history }: ExerciseHistoryProps) {
  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            History
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          <p>No workout history yet</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {history.map((entry) => (
            <Link
              key={entry.session_id}
              href={`/workouts/${entry.session_id}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <div>
                <p className="font-medium">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {entry.set_count} sets, {entry.total_reps} reps
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{entry.best_e1rm.toFixed(1)} lbs</p>
                <p className="text-xs text-muted-foreground">best e1RM</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

## Verification
- [ ] Exercise detail shows real stats
- [ ] Best performances ranked by e1RM
- [ ] History clickable to workout
- [ ] Empty state when no data

---

# Phase 5: Community Workouts

## Database Setup
Run migration `006_community.sql` in Supabase SQL Editor.

## Key Features
- Browse approved workouts
- Submit new workouts (pending approval)
- Coach approval queue
- Comments and reactions

## Pages to Create

1. **`/community`** - Browse approved workouts
2. **`/community/[id]`** - Workout detail with comments
3. **`/community/submit`** - Submit new workout
4. **`/admin/submissions`** - Approval queue (coach only)

## Core Components

### Community Workout Card
```typescript
// components/community/workout-card.tsx
// Display workout type badge, title, author, reactions count
```

### Submit Form
```typescript
// components/community/submit-form.tsx
// Title, type dropdown (amrap/for_time/emom/other), description, time cap
```

### Comment Section
```typescript
// components/community/comment-section.tsx
// List comments, add comment form
```

### Reaction Bar
```typescript
// components/community/reaction-bar.tsx
// Toggle reactions: like, fire, strong, respect
```

### Approval Queue (Coach)
```typescript
// components/admin/approval-queue.tsx
// List pending, approve/reject buttons
```

## Server Actions
```typescript
// app/community/actions.ts
export async function submitWorkout(data)
export async function addComment(workoutId, content)
export async function toggleReaction(workoutId, type)

// app/admin/actions.ts
export async function approveWorkout(id)
export async function rejectWorkout(id, reason?)
export async function toggleFeatured(id)
```

## Verification
- [ ] Athletes can submit workouts
- [ ] Submissions start as pending
- [ ] Coach sees approval queue
- [ ] Approve/reject works
- [ ] Only approved in browse
- [ ] Comments work
- [ ] Reactions toggle correctly

---

# Phase 6: Challenges & Badges

## Database Setup
Run migration `007_challenges.sql` in Supabase SQL Editor.

## Key Features
- View active challenges
- Log progress
- Leaderboard with anonymous option
- Badge display on profile

## Pages to Create

1. **`/challenges`** - Active challenges
2. **`/challenges/[id]`** - Detail + leaderboard + log form
3. **`/challenges/history`** - Past challenges
4. **`/admin/challenges/new`** - Create challenge (coach)
5. **Update `/profile`** - Show badges

## Core Components

### Challenge Card
```typescript
// components/challenges/challenge-card.tsx
// Name, metric, dates, your progress
```

### Leaderboard
```typescript
// components/challenges/leaderboard.tsx
// Rank, name (or "Anonymous"), total, highlight current user
```

### Log Progress Form
```typescript
// components/challenges/log-progress-form.tsx
// Value input, optional notes
```

### Badge Display
```typescript
// components/challenges/badge-display.tsx
// Grid of earned badges with icons
```

## Server Actions
```typescript
// app/challenges/actions.ts
export async function logProgress(challengeId, value, notes?)
export async function createChallenge(data) // coach only
```

## Leaderboard Logic
- Anonymous users show as "Anonymous 🦊" (random animal)
- Current user always highlighted
- Top 3 get special styling

## Verification
- [ ] Coach can create challenge
- [ ] Athletes can log progress
- [ ] Leaderboard updates correctly
- [ ] Anonymous users hidden
- [ ] Badges display on profile
- [ ] Participation badge auto-awarded

---

# Phase 7: Polish & Deploy

## UI Audit Checklist
- [ ] Consistent spacing (4/6/8 pattern)
- [ ] Typography hierarchy
- [ ] Loading states everywhere
- [ ] Error boundaries
- [ ] Empty states
- [ ] Mobile responsive

## Performance
- [ ] Lighthouse audit (target 90+)
- [ ] No unnecessary re-renders
- [ ] Images optimized (if any)

## Final Docker Test
```bash
docker build -t projectathlete:v1 .
docker run -p 6767:6767 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  projectathlete:v1
```

## Documentation
- [ ] README with setup instructions
- [ ] Environment variables documented
- [ ] Deployment guide

## Commit
```bash
git add .
git commit -m "feat: complete ProjectAthlete v2 with all features"
```
