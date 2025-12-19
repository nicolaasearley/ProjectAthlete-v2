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
- [x] Next.js 14+ initialized with App Router
- [x] TypeScript configured (strict mode)
- [x] Tailwind CSS configured with design tokens
- [x] Dependencies installed:
  - [x] `@supabase/supabase-js`
  - [x] `@supabase/ssr`
  - [x] `lucide-react`
  - [x] `clsx`
  - [x] `tailwind-merge`

### Configuration
- [x] `.env.example` created
- [ ] `.env.local` created (gitignored)
- [x] `.gitignore` updated
- [x] `next.config.js` has `output: 'standalone'`

### Docker
- [x] `Dockerfile` created
- [x] `.dockerignore` created
- [x] `docker build` succeeds
- [x] Container runs on port 6767

### Design System
- [x] CSS variables for colors
- [x] Dark mode by default
- [x] Glass effect tokens

### UI Components
- [x] `Button` component (variants: default, outline, ghost, destructive)
- [x] `Input` component (with label and error support)
- [x] `Card` components (Card, CardHeader, CardTitle, CardContent, CardFooter)
- [x] `Badge` component
- [x] `cn()` utility function

### Verification
- [x] `npm run dev` works
- [x] `npm run build` succeeds
- [x] Docker container accessible at `http://localhost:6767`

---

## Phase 1: Auth & Multi-Org

### Supabase Client
- [x] `lib/supabase/client.ts` (browser client)
- [x] `lib/supabase/server.ts` (server client)
- [x] `lib/supabase/middleware.ts` (session refresh)

### Middleware
- [x] `middleware.ts` at root
- [x] Session refresh on all requests
- [x] Protected route redirect to `/login`
- [x] Auth route redirect to `/` if logged in

### Database
- [x] Migration `001_foundation.sql` run
- [x] `organizations` table created
- [x] `profiles` table created
- [x] Default organization inserted
- [x] Profile creation trigger working
- [x] Helper functions created (`get_user_org_id`, `get_user_role`, etc.)
- [x] RLS policies applied

### Auth Pages
- [x] `/login` page with Apple OAuth button
- [x] `/auth/callback` route handler
- [x] Error handling for failed auth
- [x] Email/Password login & Dev login added

### Dashboard
- [x] `/(dashboard)/layout.tsx` with sidebar and navbar
- [x] `/(dashboard)/page.tsx` dashboard home
- [x] Sidebar navigation component
- [x] Navbar with user menu
- [x] Mobile navigation drawer
- [x] Sign out functionality

### Types
- [x] `types/database.ts` with Organization and Profile types

### Verification
- [ ] Apple OAuth login works (Pending Apple Config)
- [x] Profile created in database on first login
- [x] Dashboard loads after login
- [x] Unauthenticated users redirected
- [x] Sign out returns to login
- [x] Mobile navigation works

---

## Phase 2: Exercise Library

### Database
- [x] Migration `002_exercises.sql` run
- [x] Migration `003_exercise_seed.sql` run
- [x] 100+ exercises seeded
- [x] Aliases created
- [x] RLS policies applied

### Pages
- [x] `/exercises` browse page
- [x] `/exercises/[id]` detail page

### Components
- [x] `ExerciseGrid` component
- [x] `ExerciseCard` component
- [x] `ExerciseFilters` component
- [x] `ExercisePicker` component (reusable)

### Features
- [x] Category filter works
- [x] Search by name works
- [x] Search by alias works
- [x] Detail page shows aliases
- [x] Stats wired up

### Types
- [x] Exercise types added
- [x] ExerciseAlias types added
- [x] EXERCISE_CATEGORIES constant

### Verification
- [x] All exercises visible
- [x] Filter reduces results
- [x] Search finds by name
- [x] Search finds by alias
- [x] Exercise picker works standalone

---

## Phase 3: Workout Logging

### Database
- [x] Migration `004_workouts.sql` run
- [x] `workout_sessions` table
- [x] `workout_exercises` table
- [x] `workout_sets` table
- [x] RLS policies applied
- [x] Cascade deletes working

### Server Actions
- [x] `createWorkout` action
- [x] `updateWorkout` action
- [x] `deleteWorkout` action
- [x] `getWorkouts` action
- [x] `getWorkout` action

### Pages
- [x] `/workouts` list page
- [x] `/workouts/new` create page
- [x] `/workouts/[id]` view/edit page

### Components
- [x] `WorkoutForm` component
- [x] `ExerciseInput` component
- [x] `SetRow` component
- [x] `WorkoutCard` component

### Features
- [x] Date picker works
- [x] Add exercise with picker
- [x] Add sets to exercise
- [x] Remove sets (min 1)
- [x] Remove exercises
- [x] Save creates workout
- [x] Edit updates workout
- [x] Delete with confirmation
- [x] History shows all workouts

### Types
- [x] WorkoutSession types
- [x] WorkoutExercise types
- [x] WorkoutSet types
- [x] Form input types

### Verification
- [x] Create workout with multiple exercises
- [x] Each exercise has multiple sets
- [x] Edit existing workout
- [x] Delete workout
- [x] RLS blocks other users' workouts

---

## Phase 4: Exercise Stats

### Database
- [x] Migration `005_exercise_stats.sql` run
- [x] `get_exercise_stats` function
- [x] `get_exercise_history` function
- [x] `get_best_performances` function
- [x] `get_e1rm_progression` function

### Components
- [x] `StatsSummary` component
- [x] `BestPerformances` component
- [x] `ExerciseHistory` component

### Features
- [x] Estimated 1RM displays (Epley formula)
- [x] Max weight displays
- [x] Max session volume displays
- [x] Total sets displays
- [x] Best performances list (top 5)
- [x] History list links to workouts
- [x] Empty state when no data

### Verification
- [x] Stats match expected calculations
- [x] Stats update after new workout
- [x] Performance ranking correct
- [x] History chronological

---

## Phase 5: Community Workouts

### Database
- [x] Migration `006_community.sql` run
- [x] `community_workouts` table
- [x] `workout_comments` table
- [x] `workout_reactions` table
- [x] RLS policies applied
- [x] Helper functions created

### Server Actions
- [x] `submitWorkout` action
- [x] `addComment` action
- [x] `deleteComment` action
- [x] `toggleReaction` action
- [x] `approveWorkout` action (coach)
- [x] `rejectWorkout` action (coach)
- [x] `toggleFeatured` action (coach)

### Pages
- [x] `/community` browse page
- [x] `/community/[id]` detail page
- [x] `/community/submit` submission page
- [x] `/admin/submissions` approval queue (coach only)

### Components
- [x] `CommunityWorkoutCard` component
- [x] `SubmitWorkoutForm` component
- [x] `CommentSection` component
- [x] `ReactionBar` component
- [x] `ApprovalQueue` component

### Features
- [x] Browse approved workouts
- [x] Featured section at top
- [x] Filter by type
- [x] Submit new workout (pending)
- [x] View workout detail
- [x] Add comments
- [x] Toggle reactions
- [x] Coach approval queue
- [x] Approve/reject workflow
- [x] Feature toggle

### Verification
- [x] Submission creates pending workout
- [x] Pending not visible to others
- [x] Coach sees approval queue
- [x] Approve changes status
- [x] Approved visible to all
- [x] Comments persist
- [x] Reactions toggle correctly

---

## Phase 6: Challenges & Badges

### Database
- [x] Migration `007_challenges.sql` run
- [x] `challenges` table
- [x] `challenge_logs` table
- [x] `badges` table
- [x] `user_badges` table
- [x] Badge seed data inserted
- [x] RLS policies applied
- [x] Leaderboard function created
- [x] Auto-award trigger created

### Server Actions
- [x] `createChallenge` action (coach)
- [x] `logProgress` action
- [x] `updateProgress` action
- [x] `deleteProgress` action

### Pages
- [x] `/challenges` active list
- [x] `/challenges/[id]` detail + leaderboard
- [x] `/challenges/history` past challenges
- [x] `/admin/challenges/new` create page (coach)
- [x] `/profile` updated with badges

### Components
- [x] `ChallengeCard` component
- [x] `Leaderboard` component
- [x] `LogProgressForm` component
- [x] `BadgeDisplay` component
- [x] `ChallengeCountdown` component

### Features
- [x] View active challenges
- [x] Log progress
- [x] Update/delete progress
- [x] Leaderboard updates
- [x] Anonymous users hidden
- [x] Current user highlighted
- [x] Coach can create challenges
- [x] Badges on profile
- [x] Participation badge auto-awarded

### Verification
- [x] Challenge creation works
- [x] Progress logging works
- [x] Leaderboard accurate
- [x] Anonymous respected
- [x] First participation awards badge

---

## Phase 7: Polish & Deploy

### UI Audit
- [x] Consistent spacing throughout
- [x] Typography hierarchy clear
- [x] Color usage consistent
- [x] Border radii consistent
- [x] Glass effects consistent

### States
- [x] Loading states on all async operations
- [x] Error boundaries implemented
- [x] Empty states for all lists
- [x] 404 page exists

### Mobile
- [x] All pages responsive at 375px
- [x] Navigation usable on mobile (BottomNav implemented)
- [x] Forms usable on mobile
- [x] Tables scroll horizontally (using flex/grid wrappers)

### Performance
- [ ] Lighthouse Performance: 90+
- [ ] Lighthouse Accessibility: 90+
- [ ] Lighthouse Best Practices: 90+
- [x] No console errors
- [x] No TypeScript errors
- [x] Page metadata (titles/descriptions) implemented
- [x] Skeleton loaders for all routes

### Docker
- [x] Final build succeeds
- [x] Container runs correctly
- [x] All features work in container
- [x] Environment variables documented (in README)

### Documentation
- [x] README updated with:
  - [x] Project overview
  - [x] Tech stack
  - [x] Setup instructions
  - [x] Environment variables
  - [x] Deployment guide
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
