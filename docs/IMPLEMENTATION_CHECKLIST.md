# ProjectAthlete v2 — Implementation Checklist

> Use this checklist to track progress through each phase.

---

## Pre-Flight

- [ ] Supabase project created
- [ ] Apple OAuth configured in Supabase
- [ ] Redirect URL set: `https://your-domain.com/auth/callback`
- [ ] Environment variables ready

---

## Phase 0: Foundation

### Project Setup
- [ ] Next.js 14+ initialized with App Router
- [ ] TypeScript configured (strict mode)
- [ ] Tailwind CSS configured with design tokens
- [ ] Dependencies installed:
  - [ ] `@supabase/supabase-js`
  - [ ] `@supabase/ssr`
  - [ ] `lucide-react`
  - [ ] `clsx`
  - [ ] `tailwind-merge`

### Configuration
- [ ] `.env.example` created
- [ ] `.env.local` created (gitignored)
- [ ] `.gitignore` updated
- [ ] `next.config.js` has `output: 'standalone'`

### Docker
- [ ] `Dockerfile` created
- [ ] `.dockerignore` created
- [ ] `docker build` succeeds
- [ ] Container runs on port 6767

### Design System
- [ ] CSS variables for colors
- [ ] Dark mode by default
- [ ] Glass effect tokens

### UI Components
- [ ] `Button` component (variants: default, outline, ghost, destructive)
- [ ] `Input` component (with label and error support)
- [ ] `Card` components (Card, CardHeader, CardTitle, CardContent, CardFooter)
- [ ] `Badge` component
- [ ] `cn()` utility function

### Verification
- [ ] `npm run dev` works
- [ ] `npm run build` succeeds
- [ ] Docker container accessible at `http://localhost:6767`

---

## Phase 1: Auth & Multi-Org

### Supabase Client
- [ ] `lib/supabase/client.ts` (browser client)
- [ ] `lib/supabase/server.ts` (server client)
- [ ] `lib/supabase/middleware.ts` (session refresh)

### Middleware
- [ ] `middleware.ts` at root
- [ ] Session refresh on all requests
- [ ] Protected route redirect to `/login`
- [ ] Auth route redirect to `/` if logged in

### Database
- [ ] Migration `001_foundation.sql` run
- [ ] `organizations` table created
- [ ] `profiles` table created
- [ ] Default organization inserted
- [ ] Profile creation trigger working
- [ ] Helper functions created (`get_user_org_id`, `get_user_role`, etc.)
- [ ] RLS policies applied

### Auth Pages
- [ ] `/login` page with Apple OAuth button
- [ ] `/auth/callback` route handler
- [ ] Error handling for failed auth

### Dashboard
- [ ] `/(dashboard)/layout.tsx` with sidebar and navbar
- [ ] `/(dashboard)/page.tsx` dashboard home
- [ ] Sidebar navigation component
- [ ] Navbar with user menu
- [ ] Mobile navigation drawer
- [ ] Sign out functionality

### Types
- [ ] `types/database.ts` with Organization and Profile types

### Verification
- [ ] Apple OAuth login works
- [ ] Profile created in database on first login
- [ ] Dashboard loads after login
- [ ] Unauthenticated users redirected
- [ ] Sign out returns to login
- [ ] Mobile navigation works

---

## Phase 2: Exercise Library

### Database
- [ ] Migration `002_exercises.sql` run
- [ ] Migration `003_exercise_seed.sql` run
- [ ] 100+ exercises seeded
- [ ] Aliases created
- [ ] RLS policies applied

### Pages
- [ ] `/exercises` browse page
- [ ] `/exercises/[id]` detail page

### Components
- [ ] `ExerciseGrid` component
- [ ] `ExerciseCard` component
- [ ] `ExerciseFilters` component
- [ ] `ExercisePicker` component (reusable)

### Features
- [ ] Category filter works
- [ ] Search by name works
- [ ] Search by alias works
- [ ] Detail page shows aliases
- [ ] Stats placeholder (for Phase 4)

### Types
- [ ] Exercise types added
- [ ] ExerciseAlias types added
- [ ] EXERCISE_CATEGORIES constant

### Verification
- [ ] All exercises visible
- [ ] Filter reduces results
- [ ] Search finds by name
- [ ] Search finds by alias
- [ ] Exercise picker works standalone

---

## Phase 3: Workout Logging

### Database
- [ ] Migration `004_workouts.sql` run
- [ ] `workout_sessions` table
- [ ] `workout_exercises` table
- [ ] `workout_sets` table
- [ ] RLS policies applied
- [ ] Cascade deletes working

### Server Actions
- [ ] `createWorkout` action
- [ ] `updateWorkout` action
- [ ] `deleteWorkout` action
- [ ] `getWorkouts` action
- [ ] `getWorkout` action

### Pages
- [ ] `/workouts` list page
- [ ] `/workouts/new` create page
- [ ] `/workouts/[id]` view/edit page

### Components
- [ ] `WorkoutForm` component
- [ ] `ExerciseInput` component
- [ ] `SetRow` component
- [ ] `WorkoutCard` component

### Features
- [ ] Date picker works
- [ ] Add exercise with picker
- [ ] Add sets to exercise
- [ ] Remove sets (min 1)
- [ ] Remove exercises
- [ ] Save creates workout
- [ ] Edit updates workout
- [ ] Delete with confirmation
- [ ] History shows all workouts

### Types
- [ ] WorkoutSession types
- [ ] WorkoutExercise types
- [ ] WorkoutSet types
- [ ] Form input types

### Verification
- [ ] Create workout with multiple exercises
- [ ] Each exercise has multiple sets
- [ ] Edit existing workout
- [ ] Delete workout
- [ ] RLS blocks other users' workouts

---

## Phase 4: Exercise Stats

### Database
- [ ] Migration `005_exercise_stats.sql` run
- [ ] `get_exercise_stats` function
- [ ] `get_exercise_history` function
- [ ] `get_best_performances` function
- [ ] `get_e1rm_progression` function

### Components
- [ ] `StatsSummary` component
- [ ] `BestPerformances` component
- [ ] `ExerciseHistory` component

### Features
- [ ] Estimated 1RM displays (Epley formula)
- [ ] Max weight displays
- [ ] Max session volume displays
- [ ] Total sets displays
- [ ] Best performances list (top 5)
- [ ] History list links to workouts
- [ ] Empty state when no data

### Verification
- [ ] Stats match expected calculations
- [ ] Stats update after new workout
- [ ] Performance ranking correct
- [ ] History chronological

---

## Phase 5: Community Workouts

### Database
- [ ] Migration `006_community.sql` run
- [ ] `community_workouts` table
- [ ] `workout_comments` table
- [ ] `workout_reactions` table
- [ ] RLS policies applied
- [ ] Helper functions created

### Server Actions
- [ ] `submitWorkout` action
- [ ] `addComment` action
- [ ] `deleteComment` action
- [ ] `toggleReaction` action
- [ ] `approveWorkout` action (coach)
- [ ] `rejectWorkout` action (coach)
- [ ] `toggleFeatured` action (coach)

### Pages
- [ ] `/community` browse page
- [ ] `/community/[id]` detail page
- [ ] `/community/submit` submission page
- [ ] `/admin/submissions` approval queue (coach only)

### Components
- [ ] `CommunityWorkoutCard` component
- [ ] `SubmitWorkoutForm` component
- [ ] `CommentSection` component
- [ ] `ReactionBar` component
- [ ] `ApprovalQueue` component

### Features
- [ ] Browse approved workouts
- [ ] Featured section at top
- [ ] Filter by type
- [ ] Submit new workout (pending)
- [ ] View workout detail
- [ ] Add comments
- [ ] Toggle reactions
- [ ] Coach approval queue
- [ ] Approve/reject workflow
- [ ] Feature toggle

### Verification
- [ ] Submission creates pending workout
- [ ] Pending not visible to others
- [ ] Coach sees approval queue
- [ ] Approve changes status
- [ ] Approved visible to all
- [ ] Comments persist
- [ ] Reactions toggle correctly

---

## Phase 6: Challenges & Badges

### Database
- [ ] Migration `007_challenges.sql` run
- [ ] `challenges` table
- [ ] `challenge_logs` table
- [ ] `badges` table
- [ ] `user_badges` table
- [ ] Badge seed data inserted
- [ ] RLS policies applied
- [ ] Leaderboard function created
- [ ] Auto-award trigger created

### Server Actions
- [ ] `createChallenge` action (coach)
- [ ] `logProgress` action
- [ ] `updateProgress` action
- [ ] `deleteProgress` action

### Pages
- [ ] `/challenges` active list
- [ ] `/challenges/[id]` detail + leaderboard
- [ ] `/challenges/history` past challenges
- [ ] `/admin/challenges/new` create page (coach)
- [ ] `/profile` updated with badges

### Components
- [ ] `ChallengeCard` component
- [ ] `Leaderboard` component
- [ ] `LogProgressForm` component
- [ ] `BadgeDisplay` component
- [ ] `ChallengeCountdown` component

### Features
- [ ] View active challenges
- [ ] Log progress
- [ ] Update/delete progress
- [ ] Leaderboard updates
- [ ] Anonymous users hidden
- [ ] Current user highlighted
- [ ] Coach can create challenges
- [ ] Badges on profile
- [ ] Participation badge auto-awarded

### Verification
- [ ] Challenge creation works
- [ ] Progress logging works
- [ ] Leaderboard accurate
- [ ] Anonymous respected
- [ ] First participation awards badge

---

## Phase 7: Polish & Deploy

### UI Audit
- [ ] Consistent spacing throughout
- [ ] Typography hierarchy clear
- [ ] Color usage consistent
- [ ] Border radii consistent
- [ ] Glass effects consistent

### States
- [ ] Loading states on all async operations
- [ ] Error boundaries implemented
- [ ] Empty states for all lists
- [ ] 404 page exists

### Mobile
- [ ] All pages responsive at 375px
- [ ] Navigation usable on mobile
- [ ] Forms usable on mobile
- [ ] Tables scroll horizontally

### Performance
- [ ] Lighthouse Performance: 90+
- [ ] Lighthouse Accessibility: 90+
- [ ] Lighthouse Best Practices: 90+
- [ ] No console errors
- [ ] No TypeScript errors

### Docker
- [ ] Final build succeeds
- [ ] Container runs correctly
- [ ] All features work in container
- [ ] Environment variables documented

### Documentation
- [ ] README updated with:
  - [ ] Project overview
  - [ ] Tech stack
  - [ ] Setup instructions
  - [ ] Environment variables
  - [ ] Deployment guide
- [ ] CONTRIBUTING.md (basic)

### Final Verification
- [ ] Full flow: login → log workout → view stats
- [ ] Full flow: submit community workout → approve → view
- [ ] Full flow: create challenge → log progress → leaderboard
- [ ] All roles tested: athlete, coach, admin

---

## Post-Launch

- [ ] Monitor for errors
- [ ] Gather user feedback
- [ ] Document known issues
- [ ] Plan v2 features
