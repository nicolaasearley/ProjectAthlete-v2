# ProjectAthlete v2 — Full Execution Plan

> **Document Version:** 1.0  
> **Last Updated:** December 18, 2025  
> **Author:** Technical Project Lead (Claude Opus)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [Database Design & RLS Strategy](#3-database-design--rls-strategy)
4. [Execution Roadmap](#4-execution-roadmap)
5. [Git & AI-Agent Workflow](#5-git--ai-agent-workflow)
6. [Phase Implementation Prompts](#6-phase-implementation-prompts)
7. [Risk Mitigation & Quality Gates](#7-risk-mitigation--quality-gates)

---

## 1. Executive Summary

### 1.1 What We're Building

ProjectAthlete v2 is a **self-hosted, multi-tenant web application** for strength and hybrid athletes. It enables:

- **Workout Logging**: Post-workout entry of exercises, sets, weights, and reps
- **Performance Analytics**: Auto-calculated stats (1RM, max weight, volume records)
- **Community Workouts**: CrossFit-style WODs with submission/approval workflow
- **Monthly Challenges**: Leaderboard-driven community competitions with badges

### 1.2 Critical Constraints

| Constraint | Specification |
|------------|---------------|
| **Deployment** | Single Docker container on Unraid |
| **Port** | 6767 (internal), Cloudflare Tunnel to external |
| **Backend** | Supabase (hosted) — no custom server |
| **Auth** | Supabase SSR with Apple OAuth |
| **Multi-tenancy** | All data scoped by `org_id`, enforced via RLS |

### 1.3 Success Criteria

- [ ] User can authenticate via Apple OAuth
- [ ] User can log workouts with exercises/sets
- [ ] User can view exercise history and computed stats
- [ ] User can browse/submit community workouts
- [ ] User can participate in monthly challenges
- [ ] Coach can approve submissions and manage challenges
- [ ] All data properly isolated by organization
- [ ] App deploys as single Docker container on port 6767

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLOUDFLARE TUNNEL                        │
│                    (projectathlete.example.com)                 │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     UNRAID SERVER (Docker)                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Next.js App (Port 6767)                      │  │
│  │  ┌─────────────────┐  ┌─────────────────────────────────┐ │  │
│  │  │   App Router    │  │     Server Components           │ │  │
│  │  │   /app/*        │  │     + Server Actions            │ │  │
│  │  └────────┬────────┘  └──────────────┬──────────────────┘ │  │
│  │           │                          │                    │  │
│  │           ▼                          ▼                    │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │            Supabase Client (SSR)                    │  │  │
│  │  │            @supabase/ssr                            │  │  │
│  │  └────────────────────────┬────────────────────────────┘  │  │
│  └───────────────────────────┼───────────────────────────────┘  │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE (Hosted)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │    Auth     │  │  PostgreSQL │  │      Storage            │  │
│  │  (Apple)    │  │  + RLS      │  │  (future: avatars)      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Frontend Architecture

```
/app
├── (auth)/                    # Auth group (no layout chrome)
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   └── auth/callback/route.ts
├── (dashboard)/               # Main app group (with nav/sidebar)
│   ├── layout.tsx             # Dashboard shell with navigation
│   ├── page.tsx               # Dashboard home / overview
│   ├── workouts/
│   │   ├── page.tsx           # Workout history list
│   │   ├── new/page.tsx       # Log new workout
│   │   └── [id]/page.tsx      # View/edit workout
│   ├── exercises/
│   │   ├── page.tsx           # Exercise library
│   │   └── [id]/page.tsx      # Exercise detail + stats
│   ├── community/
│   │   ├── page.tsx           # Community workouts browse
│   │   ├── submit/page.tsx    # Submit new workout
│   │   └── [id]/page.tsx      # Workout detail + comments
│   ├── challenges/
│   │   ├── page.tsx           # Active challenges
│   │   ├── [id]/page.tsx      # Challenge detail + leaderboard
│   │   └── history/page.tsx   # Past challenges
│   ├── profile/
│   │   └── page.tsx           # User profile + badges
│   └── admin/                 # Coach/Admin only
│       ├── submissions/page.tsx
│       ├── challenges/
│       │   ├── page.tsx
│       │   └── new/page.tsx
│       └── athletes/page.tsx  # Coach: view athlete logs
├── api/                       # API routes (if needed)
├── layout.tsx                 # Root layout
└── globals.css
```

### 2.3 Component Architecture

```
/components
├── ui/                        # Base UI primitives (shadcn/ui style)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   └── ...
├── layout/                    # Layout components
│   ├── navbar.tsx
│   ├── sidebar.tsx
│   ├── mobile-nav.tsx
│   └── page-header.tsx
├── workouts/                  # Feature: Workout logging
│   ├── workout-form.tsx
│   ├── workout-card.tsx
│   ├── exercise-input.tsx
│   ├── set-row.tsx
│   └── exercise-picker.tsx
├── exercises/                 # Feature: Exercise stats
│   ├── exercise-card.tsx
│   ├── stats-summary.tsx
│   ├── history-chart.tsx
│   └── records-list.tsx
├── community/                 # Feature: Community workouts
│   ├── workout-card.tsx
│   ├── submit-form.tsx
│   ├── comment-section.tsx
│   └── reaction-bar.tsx
├── challenges/                # Feature: Challenges
│   ├── challenge-card.tsx
│   ├── leaderboard.tsx
│   ├── log-progress-form.tsx
│   └── badge-display.tsx
└── shared/                    # Shared components
    ├── loading-spinner.tsx
    ├── empty-state.tsx
    ├── error-boundary.tsx
    └── avatar.tsx
```

### 2.4 Auth Flow (Supabase SSR)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   /login    │────▶│   Supabase  │────▶│    Apple    │
│   page.tsx  │     │  signInWith │     │   OAuth     │
└─────────────┘     │  OAuth      │     └──────┬──────┘
                    └─────────────┘            │
                                               │
       ┌───────────────────────────────────────┘
       │
       ▼
┌─────────────────────┐     ┌─────────────────────┐
│  /auth/callback     │────▶│   Exchange code     │
│  route.ts           │     │   for session       │
└─────────────────────┘     └──────────┬──────────┘
                                       │
                                       ▼
                            ┌─────────────────────┐
                            │  Set cookies &      │
                            │  redirect to /      │
                            └─────────────────────┘
```

**Key Implementation Details:**

1. **Middleware** (`middleware.ts`): Refresh session on every request
2. **Server Client**: Created fresh per request in Server Components
3. **Browser Client**: Singleton for Client Components
4. **Cookies**: Managed via `@supabase/ssr` helpers

### 2.5 Multi-Org Permission Model

```
┌─────────────────────────────────────────────────────────────────┐
│                        REQUEST LIFECYCLE                        │
└─────────────────────────────────────────────────────────────────┘

1. Request arrives at Next.js
2. Middleware refreshes Supabase session (updates JWT)
3. Server Component/Action creates Supabase client
4. Query executed with user's JWT
5. RLS policies evaluate:
   - auth.uid() → current user
   - auth.jwt() → contains app_metadata.org_id, role
6. Only permitted rows returned

┌─────────────────────────────────────────────────────────────────┐
│                      RLS ENFORCEMENT                            │
└─────────────────────────────────────────────────────────────────┘

Every table with user data includes:
- org_id column (UUID, NOT NULL)
- RLS policy checking: org_id = auth.jwt()->>'org_id'

Role checks use helper function:
- get_user_role() returns 'athlete' | 'coach' | 'admin'
- Policies use: get_user_role() IN ('coach', 'admin')
```

---

## 3. Database Design & RLS Strategy

### 3.1 Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│  organizations  │       │    profiles     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────│ id (PK, FK auth)│
│ name            │       │ org_id (FK)     │
│ slug            │       │ role            │
│ created_at      │       │ display_name    │
└────────┬────────┘       │ avatar_url      │
         │                │ created_at      │
         │                └─────────────────┘
         │
         │    ┌─────────────────┐
         │    │   exercises     │
         │    ├─────────────────┤
         │    │ id (PK)         │
         │    │ name            │
         │    │ category        │
         │    │ is_global       │
         └───▶│ org_id (FK)     │◄─────────────────┐
              └────────┬────────┘                  │
                       │                           │
         ┌─────────────┴─────────────┐             │
         │                           │             │
         ▼                           ▼             │
┌─────────────────┐       ┌─────────────────┐      │
│exercise_aliases │       │workout_sessions │      │
├─────────────────┤       ├─────────────────┤      │
│ id (PK)         │       │ id (PK)         │      │
│ exercise_id(FK) │       │ user_id (FK)    │      │
│ alias           │       │ org_id (FK)     │──────┘
└─────────────────┘       │ date            │
                          │ notes           │
                          │ created_at      │
                          └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │workout_exercises│
                          ├─────────────────┤
                          │ id (PK)         │
                          │ session_id (FK) │
                          │ exercise_id(FK) │
                          │ order           │
                          └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │  workout_sets   │
                          ├─────────────────┤
                          │ id (PK)         │
                          │ workout_ex_id   │
                          │ set_number      │
                          │ weight          │
                          │ reps            │
                          └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│community_workouts│      │    challenges   │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ org_id (FK)     │       │ org_id (FK)     │
│ author_id (FK)  │       │ name            │
│ title           │       │ description     │
│ description     │       │ metric          │
│ workout_type    │       │ start_date      │
│ status          │       │ end_date        │
│ is_featured     │       │ created_by (FK) │
│ created_at      │       │ created_at      │
└────────┬────────┘       └────────┬────────┘
         │                         │
         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│workout_comments │       │ challenge_logs  │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ workout_id (FK) │       │ challenge_id(FK)│
│ user_id (FK)    │       │ user_id (FK)    │
│ content         │       │ value           │
│ created_at      │       │ logged_at       │
└─────────────────┘       └─────────────────┘

┌─────────────────┐       ┌─────────────────┐
│workout_reactions│       │     badges      │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ workout_id (FK) │       │ name            │
│ user_id (FK)    │       │ description     │
│ reaction_type   │       │ icon            │
│ created_at      │       │ criteria        │
└─────────────────┘       └────────┬────────┘
                                   │
                                   ▼
                          ┌─────────────────┐
                          │   user_badges   │
                          ├─────────────────┤
                          │ id (PK)         │
                          │ user_id (FK)    │
                          │ badge_id (FK)   │
                          │ awarded_at      │
                          │ challenge_id    │
                          └─────────────────┘
```

### 3.2 Complete Schema Definition

```sql
-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get current user's org_id from JWT
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'org_id')::UUID,
    NULL
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Get current user's role from JWT
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    auth.jwt() -> 'app_metadata' ->> 'role',
    'athlete'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Check if user is coach or admin
CREATE OR REPLACE FUNCTION is_coach_or_admin()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() IN ('coach', 'admin');
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() = 'admin';
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- ============================================
-- TABLES
-- ============================================

-- Organizations (multi-tenant root)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id),
  role TEXT NOT NULL DEFAULT 'athlete' CHECK (role IN ('athlete', 'coach', 'admin')),
  display_name TEXT,
  avatar_url TEXT,
  is_anonymous_on_leaderboards BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercise library
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('squat', 'hinge', 'push', 'pull', 'carry', 'core', 'olympic', 'cardio', 'other')),
  is_global BOOLEAN DEFAULT FALSE,
  org_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT exercise_scope CHECK (
    (is_global = TRUE AND org_id IS NULL) OR
    (is_global = FALSE AND org_id IS NOT NULL)
  )
);

-- Exercise aliases
CREATE TABLE exercise_aliases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  UNIQUE(exercise_id, alias)
);

-- Workout sessions (one per day per user typically)
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id),
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercises within a workout session
CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  order_index INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sets within a workout exercise
CREATE TABLE workout_sets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_exercise_id UUID NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  weight DECIMAL(7,2) NOT NULL, -- up to 99999.99 lbs/kg
  reps INTEGER NOT NULL CHECK (reps > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community workouts
CREATE TABLE community_workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  author_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  workout_type TEXT NOT NULL CHECK (workout_type IN ('amrap', 'for_time', 'emom', 'other')),
  time_cap_minutes INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_featured BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments on community workouts
CREATE TABLE workout_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID NOT NULL REFERENCES community_workouts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reactions to community workouts
CREATE TABLE workout_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_id UUID NOT NULL REFERENCES community_workouts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'fire', 'strong', 'respect')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workout_id, user_id, reaction_type)
);

-- Monthly challenges
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  description TEXT,
  metric TEXT NOT NULL, -- e.g., 'steps', 'pullups', 'miles'
  metric_unit TEXT NOT NULL, -- e.g., 'count', 'miles', 'minutes'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (end_date > start_date)
);

-- Challenge progress logs
CREATE TABLE challenge_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  value DECIMAL(10,2) NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- Badge definitions
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL, -- emoji or icon identifier
  badge_type TEXT NOT NULL CHECK (badge_type IN ('challenge_participation', 'challenge_winner', 'milestone', 'special')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User badge awards
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id),
  challenge_id UUID REFERENCES challenges(id),
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id, challenge_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_profiles_org_id ON profiles(org_id);
CREATE INDEX idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX idx_workout_sessions_org_id ON workout_sessions(org_id);
CREATE INDEX idx_workout_sessions_date ON workout_sessions(date DESC);
CREATE INDEX idx_workout_exercises_session_id ON workout_exercises(session_id);
CREATE INDEX idx_workout_exercises_exercise_id ON workout_exercises(exercise_id);
CREATE INDEX idx_workout_sets_workout_exercise_id ON workout_sets(workout_exercise_id);
CREATE INDEX idx_community_workouts_org_id ON community_workouts(org_id);
CREATE INDEX idx_community_workouts_status ON community_workouts(status);
CREATE INDEX idx_challenges_org_id ON challenges(org_id);
CREATE INDEX idx_challenges_dates ON challenges(start_date, end_date);
CREATE INDEX idx_challenge_logs_challenge_id ON challenge_logs(challenge_id);
CREATE INDEX idx_challenge_logs_user_id ON challenge_logs(user_id);
```

### 3.3 Row Level Security Policies

```sql
-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ORGANIZATIONS
-- ============================================
CREATE POLICY "Users can view their own organization"
  ON organizations FOR SELECT
  USING (id = get_user_org_id());

-- ============================================
-- PROFILES
-- ============================================
CREATE POLICY "Users can view profiles in their org"
  ON profiles FOR SELECT
  USING (org_id = get_user_org_id());

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND org_id = get_user_org_id());

-- ============================================
-- EXERCISES
-- ============================================
CREATE POLICY "Users can view global exercises and their org exercises"
  ON exercises FOR SELECT
  USING (is_global = TRUE OR org_id = get_user_org_id());

-- ============================================
-- EXERCISE ALIASES
-- ============================================
CREATE POLICY "Users can view aliases for visible exercises"
  ON exercise_aliases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM exercises
      WHERE exercises.id = exercise_aliases.exercise_id
      AND (exercises.is_global = TRUE OR exercises.org_id = get_user_org_id())
    )
  );

-- ============================================
-- WORKOUT SESSIONS
-- ============================================
CREATE POLICY "Athletes can view their own sessions"
  ON workout_sessions FOR SELECT
  USING (
    user_id = auth.uid()
    OR (org_id = get_user_org_id() AND is_coach_or_admin())
  );

CREATE POLICY "Athletes can create their own sessions"
  ON workout_sessions FOR INSERT
  WITH CHECK (user_id = auth.uid() AND org_id = get_user_org_id());

CREATE POLICY "Athletes can update their own sessions"
  ON workout_sessions FOR UPDATE
  USING (user_id = auth.uid() AND org_id = get_user_org_id())
  WITH CHECK (user_id = auth.uid() AND org_id = get_user_org_id());

CREATE POLICY "Athletes can delete their own sessions"
  ON workout_sessions FOR DELETE
  USING (user_id = auth.uid() AND org_id = get_user_org_id());

-- ============================================
-- WORKOUT EXERCISES
-- ============================================
CREATE POLICY "Users can view exercises in visible sessions"
  ON workout_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = workout_exercises.session_id
      AND (
        workout_sessions.user_id = auth.uid()
        OR (workout_sessions.org_id = get_user_org_id() AND is_coach_or_admin())
      )
    )
  );

CREATE POLICY "Athletes can create exercises in their sessions"
  ON workout_exercises FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = workout_exercises.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Athletes can update exercises in their sessions"
  ON workout_exercises FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = workout_exercises.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Athletes can delete exercises in their sessions"
  ON workout_exercises FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions
      WHERE workout_sessions.id = workout_exercises.session_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

-- ============================================
-- WORKOUT SETS
-- ============================================
CREATE POLICY "Users can view sets in visible exercises"
  ON workout_sets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workout_sessions ON workout_sessions.id = workout_exercises.session_id
      WHERE workout_exercises.id = workout_sets.workout_exercise_id
      AND (
        workout_sessions.user_id = auth.uid()
        OR (workout_sessions.org_id = get_user_org_id() AND is_coach_or_admin())
      )
    )
  );

CREATE POLICY "Athletes can create sets in their exercises"
  ON workout_sets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workout_sessions ON workout_sessions.id = workout_exercises.session_id
      WHERE workout_exercises.id = workout_sets.workout_exercise_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Athletes can update their sets"
  ON workout_sets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workout_sessions ON workout_sessions.id = workout_exercises.session_id
      WHERE workout_exercises.id = workout_sets.workout_exercise_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Athletes can delete their sets"
  ON workout_sets FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workout_sessions ON workout_sessions.id = workout_exercises.session_id
      WHERE workout_exercises.id = workout_sets.workout_exercise_id
      AND workout_sessions.user_id = auth.uid()
    )
  );

-- ============================================
-- COMMUNITY WORKOUTS
-- ============================================
CREATE POLICY "Users can view approved community workouts in their org"
  ON community_workouts FOR SELECT
  USING (
    org_id = get_user_org_id()
    AND (status = 'approved' OR author_id = auth.uid() OR is_coach_or_admin())
  );

CREATE POLICY "Users can submit community workouts"
  ON community_workouts FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND org_id = get_user_org_id()
    AND status = 'pending'
  );

CREATE POLICY "Authors can update pending workouts"
  ON community_workouts FOR UPDATE
  USING (author_id = auth.uid() AND status = 'pending')
  WITH CHECK (author_id = auth.uid() AND status = 'pending');

CREATE POLICY "Coaches can approve/reject workouts"
  ON community_workouts FOR UPDATE
  USING (org_id = get_user_org_id() AND is_coach_or_admin());

CREATE POLICY "Authors can delete pending workouts"
  ON community_workouts FOR DELETE
  USING (author_id = auth.uid() AND status = 'pending');

-- ============================================
-- WORKOUT COMMENTS
-- ============================================
CREATE POLICY "Users can view comments on visible workouts"
  ON workout_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_workouts
      WHERE community_workouts.id = workout_comments.workout_id
      AND community_workouts.org_id = get_user_org_id()
      AND community_workouts.status = 'approved'
    )
  );

CREATE POLICY "Users can create comments"
  ON workout_comments FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM community_workouts
      WHERE community_workouts.id = workout_comments.workout_id
      AND community_workouts.org_id = get_user_org_id()
      AND community_workouts.status = 'approved'
    )
  );

CREATE POLICY "Users can delete their own comments"
  ON workout_comments FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- WORKOUT REACTIONS
-- ============================================
CREATE POLICY "Users can view reactions"
  ON workout_reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_workouts
      WHERE community_workouts.id = workout_reactions.workout_id
      AND community_workouts.org_id = get_user_org_id()
    )
  );

CREATE POLICY "Users can add reactions"
  ON workout_reactions FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM community_workouts
      WHERE community_workouts.id = workout_reactions.workout_id
      AND community_workouts.org_id = get_user_org_id()
      AND community_workouts.status = 'approved'
    )
  );

CREATE POLICY "Users can remove their reactions"
  ON workout_reactions FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- CHALLENGES
-- ============================================
CREATE POLICY "Users can view challenges in their org"
  ON challenges FOR SELECT
  USING (org_id = get_user_org_id());

CREATE POLICY "Coaches can create challenges"
  ON challenges FOR INSERT
  WITH CHECK (
    org_id = get_user_org_id()
    AND is_coach_or_admin()
    AND created_by = auth.uid()
  );

CREATE POLICY "Coaches can update challenges"
  ON challenges FOR UPDATE
  USING (org_id = get_user_org_id() AND is_coach_or_admin());

CREATE POLICY "Coaches can delete challenges"
  ON challenges FOR DELETE
  USING (org_id = get_user_org_id() AND is_coach_or_admin());

-- ============================================
-- CHALLENGE LOGS
-- ============================================
CREATE POLICY "Users can view logs for challenges they can see"
  ON challenge_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM challenges
      WHERE challenges.id = challenge_logs.challenge_id
      AND challenges.org_id = get_user_org_id()
    )
  );

CREATE POLICY "Users can log their own progress"
  ON challenge_logs FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM challenges
      WHERE challenges.id = challenge_logs.challenge_id
      AND challenges.org_id = get_user_org_id()
      AND CURRENT_DATE BETWEEN challenges.start_date AND challenges.end_date
    )
  );

CREATE POLICY "Users can update their own logs"
  ON challenge_logs FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own logs"
  ON challenge_logs FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- BADGES
-- ============================================
CREATE POLICY "Everyone can view badges"
  ON badges FOR SELECT
  USING (TRUE);

-- ============================================
-- USER BADGES
-- ============================================
CREATE POLICY "Users can view badges in their org"
  ON user_badges FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = user_badges.user_id
      AND profiles.org_id = get_user_org_id()
    )
  );

-- Badges are awarded by system/triggers, not direct insert
```

### 3.4 Computed Stats Strategy

**Philosophy:** Stats are computed on-read, not stored. This ensures:
- Data consistency (no sync issues)
- Simpler writes
- Acceptable performance for v1 scale

**Key Computed Values:**

| Stat | Formula | Implementation |
|------|---------|----------------|
| **Estimated 1RM** | `weight × (1 + reps/30)` (Epley) | SQL function or app layer |
| **Max Weight** | `MAX(weight) WHERE reps >= 1` | SQL aggregate |
| **Max Volume** | `MAX(SUM(weight × reps))` per session | SQL window function |
| **Best Performances** | Top N by e1RM | SQL ORDER BY + LIMIT |

```sql
-- Example: Get exercise stats for a user
CREATE OR REPLACE FUNCTION get_exercise_stats(p_exercise_id UUID, p_user_id UUID)
RETURNS TABLE (
  max_weight DECIMAL,
  estimated_1rm DECIMAL,
  max_session_volume DECIMAL,
  total_sets INTEGER,
  total_reps INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH user_sets AS (
    SELECT
      ws.id AS set_id,
      we.session_id,
      ws.weight,
      ws.reps,
      ws.weight * (1 + ws.reps::DECIMAL / 30) AS e1rm,
      ws.weight * ws.reps AS set_volume
    FROM workout_sets ws
    JOIN workout_exercises we ON we.id = ws.workout_exercise_id
    JOIN workout_sessions wsess ON wsess.id = we.session_id
    WHERE we.exercise_id = p_exercise_id
    AND wsess.user_id = p_user_id
  ),
  session_volumes AS (
    SELECT session_id, SUM(set_volume) AS total_volume
    FROM user_sets
    GROUP BY session_id
  )
  SELECT
    MAX(us.weight),
    MAX(us.e1rm),
    MAX(sv.total_volume),
    COUNT(us.set_id)::INTEGER,
    SUM(us.reps)::INTEGER
  FROM user_sets us
  LEFT JOIN session_volumes sv ON sv.session_id = us.session_id;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
```

---

## 4. Execution Roadmap

### 4.1 Phase Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE DEPENDENCY GRAPH                       │
└─────────────────────────────────────────────────────────────────┘

Phase 0: Foundation
    │
    ▼
Phase 1: Auth & Multi-Org ──────────────┐
    │                                   │
    ▼                                   │
Phase 2: Exercise Library               │
    │                                   │
    ▼                                   │
Phase 3: Workout Logging                │
    │                                   │
    ▼                                   │
Phase 4: Exercise Stats                 │
    │                                   │
    ├───────────────────────────────────┤
    │                                   │
    ▼                                   ▼
Phase 5: Community Workouts    Phase 6: Challenges & Badges
    │                                   │
    └───────────────────────────────────┘
                    │
                    ▼
            Phase 7: Polish & Deploy
```

### 4.2 Detailed Phase Breakdown

---

#### **PHASE 0: Foundation** (Day 1)
*Estimated effort: 2-4 hours*

**Goals:**
- Scaffold Next.js project with all tooling
- Set up Supabase project
- Establish Docker deployment pipeline
- Create base UI component system

**Deliverables:**
- [ ] Next.js 14+ app with App Router
- [ ] TypeScript configured
- [ ] Tailwind CSS + design tokens
- [ ] Base UI components (button, input, card)
- [ ] Dockerfile exposing port 6767
- [ ] `.env.example` with all required variables
- [ ] Supabase project created (manual step)

**Verification:**
```bash
docker build -t projectathlete .
docker run -p 6767:6767 projectathlete
# App accessible at http://localhost:6767
```

---

#### **PHASE 1: Auth & Multi-Org** (Days 2-3)
*Estimated effort: 4-6 hours*

**Dependencies:** Phase 0 complete

**Goals:**
- Implement Supabase SSR auth
- Apple OAuth login
- Multi-org data model
- Profile creation on signup
- Dashboard shell with navigation

**Deliverables:**
- [ ] `@supabase/ssr` client setup
- [ ] Middleware for session refresh
- [ ] `/login` page with Apple OAuth
- [ ] `/auth/callback` route handler
- [ ] Database: organizations, profiles tables
- [ ] RLS policies for org isolation
- [ ] Auto-create profile on signup (trigger)
- [ ] Dashboard layout with navigation
- [ ] Protected route handling

**Verification:**
- Sign in with Apple works
- Profile created in database
- Unauthenticated users redirected to /login
- Can see dashboard after login

**Database Migrations:**
```sql
-- Migration 001: Organizations and Profiles
-- Contains: organizations, profiles tables
-- Contains: RLS policies for both
-- Contains: Trigger for profile creation
```

---

#### **PHASE 2: Exercise Library** (Day 4)
*Estimated effort: 2-3 hours*

**Dependencies:** Phase 1 complete

**Goals:**
- Seed global exercise library
- Exercise browsing UI
- Alias support

**Deliverables:**
- [ ] Database: exercises, exercise_aliases tables
- [ ] RLS policies
- [ ] Seed data: 50+ common exercises
- [ ] `/exercises` browse page
- [ ] `/exercises/[id]` detail page (placeholder stats)
- [ ] Exercise picker component (reusable)

**Verification:**
- Can browse exercise library
- Exercises filterable by category
- Search finds exercises and aliases

**Seed Exercises (Partial List):**
```
Squat: Back Squat, Front Squat, Goblet Squat, Box Squat
Hinge: Deadlift, Romanian Deadlift, Good Morning, Hip Thrust
Push: Bench Press, Overhead Press, Incline Press, Push Press
Pull: Pull-up, Barbell Row, Pendlay Row, Lat Pulldown
Olympic: Clean, Snatch, Clean & Jerk, Power Clean
```

---

#### **PHASE 3: Workout Logging** (Days 5-7)
*Estimated effort: 6-8 hours*

**Dependencies:** Phase 2 complete

**Goals:**
- Full workout logging CRUD
- Session → Exercises → Sets hierarchy
- Edit past workouts
- Workout history view

**Deliverables:**
- [ ] Database: workout_sessions, workout_exercises, workout_sets
- [ ] RLS policies
- [ ] `/workouts` history page
- [ ] `/workouts/new` create workout page
- [ ] `/workouts/[id]` view/edit page
- [ ] Workout form with:
  - Date picker
  - Add exercise (with picker)
  - Add/remove sets per exercise
  - Weight + reps input per set
- [ ] Delete workout functionality
- [ ] Server actions for all CRUD

**Verification:**
- Can create workout with multiple exercises
- Can add sets to each exercise
- Can edit past workout
- Can delete workout
- History shows all past workouts

**UX Considerations:**
- Quick-add for common exercises
- Remember last used weights
- Easy set duplication

---

#### **PHASE 4: Exercise Stats** (Days 8-9)
*Estimated effort: 4-5 hours*

**Dependencies:** Phase 3 complete

**Goals:**
- Per-exercise statistics
- Auto-computed records
- History visualization

**Deliverables:**
- [ ] Database functions for stats computation
- [ ] `/exercises/[id]` stats section:
  - Estimated 1RM
  - Max weight lifted
  - Max session volume
  - Best performances list
- [ ] Exercise history list
- [ ] Simple chart (line chart for e1RM over time)

**Verification:**
- Stats update after logging workout
- Records correctly computed
- History shows all instances of exercise

---

#### **PHASE 5: Community Workouts** (Days 10-12)
*Estimated effort: 5-7 hours*

**Dependencies:** Phase 1 complete (can parallelize with Phase 3-4)

**Goals:**
- Community workout browsing
- Submission workflow
- Approval system for coaches
- Comments and reactions

**Deliverables:**
- [ ] Database: community_workouts, workout_comments, workout_reactions
- [ ] RLS policies
- [ ] `/community` browse page
- [ ] `/community/[id]` detail page
- [ ] `/community/submit` submission form
- [ ] `/admin/submissions` approval queue (coach only)
- [ ] Comment section component
- [ ] Reaction bar component
- [ ] Featured workouts section

**Verification:**
- Athletes can submit workouts (status: pending)
- Coaches see pending queue
- Coaches can approve/reject
- Approved workouts visible to all
- Comments and reactions work

---

#### **PHASE 6: Challenges & Badges** (Days 13-15)
*Estimated effort: 5-6 hours*

**Dependencies:** Phase 1 complete (can parallelize with Phase 5)

**Goals:**
- Monthly challenge system
- Progress logging
- Leaderboards
- Badge awards

**Deliverables:**
- [ ] Database: challenges, challenge_logs, badges, user_badges
- [ ] RLS policies
- [ ] Seed data: initial badges
- [ ] `/challenges` active challenges page
- [ ] `/challenges/[id]` detail + leaderboard
- [ ] `/challenges/history` past challenges
- [ ] Log progress form
- [ ] Leaderboard component (with anonymous option)
- [ ] `/admin/challenges/new` create challenge (coach only)
- [ ] Badge display on profile
- [ ] Trigger for badge awards (participation)

**Verification:**
- Coaches can create challenges
- Athletes can log progress
- Leaderboard updates correctly
- Anonymous users show correctly
- Badges awarded on participation

---

#### **PHASE 7: Polish & Deploy** (Days 16-18)
*Estimated effort: 4-6 hours*

**Dependencies:** All prior phases complete

**Goals:**
- UI polish and consistency
- Performance optimization
- Final Docker deployment
- Documentation

**Deliverables:**
- [ ] UI audit and fixes
- [ ] Loading states everywhere
- [ ] Error boundaries
- [ ] Empty states
- [ ] Mobile responsiveness pass
- [ ] Lighthouse audit (aim for 90+)
- [ ] Final Docker build test
- [ ] README with:
  - Setup instructions
  - Environment variables
  - Deployment guide
- [ ] Seed script for demo data

**Verification:**
- App works end-to-end on Docker
- Mobile experience is excellent
- No console errors
- All features functional

---

### 4.3 Timeline Summary

| Phase | Duration | Parallel? |
|-------|----------|-----------|
| Phase 0: Foundation | Day 1 | No |
| Phase 1: Auth & Multi-Org | Days 2-3 | No |
| Phase 2: Exercise Library | Day 4 | No |
| Phase 3: Workout Logging | Days 5-7 | No |
| Phase 4: Exercise Stats | Days 8-9 | No |
| Phase 5: Community Workouts | Days 10-12 | Yes (with 3-4) |
| Phase 6: Challenges & Badges | Days 13-15 | Yes (with 5) |
| Phase 7: Polish & Deploy | Days 16-18 | No |

**Total Estimated Duration: 15-18 working days**

---

## 5. Git & AI-Agent Workflow

### 5.1 Branch Strategy

**Keep it simple:**
- Single `main` branch
- Commit at phase boundaries
- No feature branches for v1

### 5.2 Commit Strategy

```
Phase 0 complete  → Commit: "feat: scaffold Next.js app with Tailwind and Docker"
Phase 1 complete  → Commit: "feat: implement Supabase auth with Apple OAuth"
Phase 2 complete  → Commit: "feat: add exercise library with seed data"
Phase 3 complete  → Commit: "feat: implement workout logging CRUD"
Phase 4 complete  → Commit: "feat: add exercise stats and history"
Phase 5 complete  → Commit: "feat: add community workouts with approval workflow"
Phase 6 complete  → Commit: "feat: implement challenges and badges"
Phase 7 complete  → Commit: "chore: polish UI and prepare for deployment"
```

### 5.3 AI-Agent Safety Rules

**DO:**
- ✅ Complete one phase before moving to next
- ✅ Test locally before committing
- ✅ Keep changes focused on current phase
- ✅ Follow established patterns
- ✅ Use Server Components by default
- ✅ Implement proper loading/error states

**DON'T:**
- ❌ Refactor existing code unless broken
- ❌ Add "nice to have" features
- ❌ Change architectural decisions mid-phase
- ❌ Skip database migrations
- ❌ Commit broken code
- ❌ Over-engineer for future requirements

### 5.4 Code Review Checklist (Per Phase)

Before committing, verify:

1. **Functionality**
   - [ ] All acceptance criteria met
   - [ ] No console errors
   - [ ] Works on mobile viewport

2. **Database**
   - [ ] Migrations applied cleanly
   - [ ] RLS policies in place
   - [ ] No data leakage between orgs

3. **Code Quality**
   - [ ] TypeScript strict mode passes
   - [ ] No `any` types
   - [ ] Components properly typed
   - [ ] Server/client boundary correct

4. **Security**
   - [ ] No secrets in code
   - [ ] Auth checks in place
   - [ ] RLS tested

---

## 6. Phase Implementation Prompts

### 6.1 Day-1 Prompt: Foundation + Auth

```markdown
# Task: ProjectAthlete v2 - Phase 0 & 1 (Foundation + Auth)

## Context
You are building ProjectAthlete v2, a workout logging app for strength athletes.
This is a greenfield Next.js project deploying as a Docker container.

## Environment
- Next.js 14+ with App Router
- TypeScript (strict mode)
- Tailwind CSS
- Supabase for auth and database
- Docker deployment on port 6767

## Phase 0: Foundation (Do First)

### 1. Initialize Next.js Project
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```

### 2. Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/ssr
npm install lucide-react clsx tailwind-merge
npm install -D @types/node
```

### 3. Create Project Structure
```
/app
  /auth
    /callback
      route.ts
  /(auth)
    /login
      page.tsx
  /(dashboard)
    layout.tsx
    page.tsx
  layout.tsx
  globals.css
/components
  /ui
    button.tsx
    input.tsx
    card.tsx
/lib
  supabase
    client.ts
    server.ts
    middleware.ts
/types
  database.ts
```

### 4. Configure Environment
Create `.env.example`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Create `.env.local` (gitignored):
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Create Dockerfile
```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=6767
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 6767
CMD ["node", "server.js"]
```

Update `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}
module.exports = nextConfig
```

### 6. Design System Setup
Configure Tailwind with design tokens for premium aesthetic:
- Primary: Deep blue (#1e40af)
- Background: Near-black (#0a0a0a)
- Surface: Glass effect with backdrop-blur
- Border radius: Rounded (0.75rem default)

### 7. Base UI Components
Create minimal UI components:
- Button (variants: default, outline, ghost)
- Input (with label support)
- Card (with glass effect)

## Phase 1: Auth & Multi-Org

### 1. Supabase Client Setup
Create browser and server clients using @supabase/ssr:
- Browser client (singleton)
- Server client (per-request)
- Middleware helper

### 2. Middleware
Create `/middleware.ts`:
- Refresh session on every request
- Protect dashboard routes
- Redirect unauthenticated to /login

### 3. Auth Pages
`/login/page.tsx`:
- Apple OAuth button
- Clean, centered design
- Error handling for failed auth

`/auth/callback/route.ts`:
- Exchange code for session
- Redirect to dashboard

### 4. Database Setup (Run in Supabase SQL Editor)
Execute the following migrations:

**Migration: Create organizations table**
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default organization
INSERT INTO organizations (name, slug) VALUES ('Default Org', 'default');

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
```

**Migration: Create profiles table**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id),
  role TEXT NOT NULL DEFAULT 'athlete' CHECK (role IN ('athlete', 'coach', 'admin')),
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_org_id ON profiles(org_id);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

**Migration: Create helper functions**
```sql
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
  SELECT org_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_coach_or_admin()
RETURNS BOOLEAN AS $$
  SELECT get_user_role() IN ('coach', 'admin');
$$ LANGUAGE SQL STABLE SECURITY DEFINER;
```

**Migration: Create profile trigger**
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_org_id UUID;
BEGIN
  SELECT id INTO default_org_id FROM organizations WHERE slug = 'default' LIMIT 1;
  
  INSERT INTO profiles (id, org_id, display_name)
  VALUES (
    NEW.id,
    default_org_id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

**Migration: RLS Policies**
```sql
CREATE POLICY "Users can view their own organization"
  ON organizations FOR SELECT
  USING (id = get_user_org_id());

CREATE POLICY "Users can view profiles in their org"
  ON profiles FOR SELECT
  USING (org_id = get_user_org_id());

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());
```

### 5. Dashboard Shell
Create `/(dashboard)/layout.tsx`:
- Sidebar navigation (collapsible on mobile)
- Top nav with user menu
- Main content area

Navigation items:
- Dashboard (home)
- Workouts
- Exercises
- Community
- Challenges
- Profile

### 6. TypeScript Types
Create `/types/database.ts` with all table types.

## Acceptance Criteria
- [ ] `npm run dev` starts app on port 3000
- [ ] `docker build` succeeds
- [ ] Docker container runs on port 6767
- [ ] Apple OAuth login works
- [ ] Profile created in database on signup
- [ ] Dashboard visible after login
- [ ] Unauthenticated users redirected to /login
- [ ] Navigation works on mobile

## Files to Create
1. `Dockerfile`
2. `.env.example`
3. `middleware.ts`
4. `lib/supabase/client.ts`
5. `lib/supabase/server.ts`
6. `lib/supabase/middleware.ts`
7. `app/(auth)/login/page.tsx`
8. `app/auth/callback/route.ts`
9. `app/(dashboard)/layout.tsx`
10. `app/(dashboard)/page.tsx`
11. `components/ui/button.tsx`
12. `components/ui/input.tsx`
13. `components/ui/card.tsx`
14. `components/layout/sidebar.tsx`
15. `components/layout/navbar.tsx`
16. `types/database.ts`

## Do NOT
- Add features beyond auth and dashboard shell
- Create workout logging yet
- Add exercise library yet
- Over-engineer component library
```

---

### 6.2 Phase 2 Prompt: Exercise Library

```markdown
# Task: ProjectAthlete v2 - Phase 2 (Exercise Library)

## Context
Phase 0-1 complete. App has auth and dashboard shell.
Now implementing the exercise library.

## Requirements

### Database (Run in Supabase)
```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('squat', 'hinge', 'push', 'pull', 'carry', 'core', 'olympic', 'cardio', 'other')),
  is_global BOOLEAN DEFAULT TRUE,
  org_id UUID REFERENCES organizations(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exercise_aliases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  UNIQUE(exercise_id, alias)
);

CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercise_aliases_exercise ON exercise_aliases(exercise_id);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_aliases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view global and org exercises"
  ON exercises FOR SELECT
  USING (is_global = TRUE OR org_id = get_user_org_id());

CREATE POLICY "Users can view aliases"
  ON exercise_aliases FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM exercises WHERE id = exercise_id
    AND (is_global = TRUE OR org_id = get_user_org_id())
  ));
```

### Seed Data
Insert 50+ common exercises across all categories.
Include aliases (e.g., "Back Squat" → "High Bar Squat", "Low Bar Squat").

### Pages
1. `/exercises` - Browse all exercises
   - Filter by category
   - Search by name/alias
   - Card grid layout

2. `/exercises/[id]` - Exercise detail
   - Exercise name and category
   - Aliases list
   - Placeholder for stats (Phase 4)

### Components
1. `ExerciseCard` - Display in grid
2. `ExercisePicker` - Searchable dropdown (reuse in Phase 3)
3. `CategoryFilter` - Filter tabs/buttons

## Acceptance Criteria
- [ ] Exercises seeded in database
- [ ] Browse page shows all exercises
- [ ] Filter by category works
- [ ] Search finds by name and alias
- [ ] Detail page renders
- [ ] ExercisePicker component ready for reuse

## Do NOT
- Implement stats yet (Phase 4)
- Add workout logging (Phase 3)
- Allow users to create exercises
```

---

### 6.3 Phase 3 Prompt: Workout Logging

```markdown
# Task: ProjectAthlete v2 - Phase 3 (Workout Logging)

## Context
Phases 0-2 complete. Exercise library exists.
Now implementing the core workout logging feature.

## Data Model
```
workout_session (date, user_id, org_id, notes)
  └─ workout_exercise (exercise_id, order)
       └─ workout_set (set_number, weight, reps)
```

## Requirements

### Database (Run in Supabase)
```sql
-- See full schema in Section 3.2
-- Create: workout_sessions, workout_exercises, workout_sets
-- Create: All RLS policies
-- Create: Indexes
```

### Pages
1. `/workouts` - Workout history
   - List of past workouts (most recent first)
   - Each shows: date, exercises performed, total sets
   - Click to view/edit

2. `/workouts/new` - Log new workout
   - Date picker (default: today)
   - Add exercises (use ExercisePicker)
   - Add sets to each exercise
   - Weight + reps per set
   - Save button

3. `/workouts/[id]` - View/Edit workout
   - Same form as new, pre-populated
   - Save changes
   - Delete workout (with confirmation)

### Components
1. `WorkoutForm` - Main form component
2. `ExerciseInput` - Single exercise with sets
3. `SetRow` - Weight + reps input
4. `WorkoutCard` - Summary card for list

### Server Actions
```typescript
// app/workouts/actions.ts
'use server'

export async function createWorkout(data: WorkoutFormData)
export async function updateWorkout(id: string, data: WorkoutFormData)
export async function deleteWorkout(id: string)
export async function getWorkouts()
export async function getWorkout(id: string)
```

### UX Requirements
- Minimum friction for data entry
- Tab through weight → reps → next set
- Add set with single click
- Remove set with single click
- Auto-save not required (explicit save button)

## Acceptance Criteria
- [ ] Can create workout with date
- [ ] Can add multiple exercises
- [ ] Can add multiple sets per exercise
- [ ] Weight and reps saved correctly
- [ ] Can edit existing workout
- [ ] Can delete workout
- [ ] History shows all workouts
- [ ] RLS prevents seeing other users' workouts

## Do NOT
- Add set metadata (RPE, tempo) - not in v1
- Add workout templates
- Add auto-save
- Add timers
```

---

### 6.4 Phase 4 Prompt: Exercise Stats

```markdown
# Task: ProjectAthlete v2 - Phase 4 (Exercise Stats)

## Context
Phases 0-3 complete. Workout logging works.
Now adding computed stats for each exercise.

## Stats to Compute

| Stat | Formula |
|------|---------|
| Estimated 1RM | `weight × (1 + reps/30)` (Epley) |
| Max Weight | `MAX(weight)` where exercise performed |
| Max Session Volume | `MAX(SUM(weight × reps))` per session |
| Total Sets | `COUNT(sets)` |
| Best Performances | Top 5 by e1RM |

## Requirements

### Database Function
```sql
CREATE OR REPLACE FUNCTION get_exercise_stats(
  p_exercise_id UUID,
  p_user_id UUID
) RETURNS JSON AS $$
  -- Return: max_weight, estimated_1rm, max_volume, total_sets, total_reps
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_exercise_history(
  p_exercise_id UUID,
  p_user_id UUID,
  p_limit INTEGER DEFAULT 50
) RETURNS TABLE (...) AS $$
  -- Return: date, sets performed, best e1rm that day
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_best_performances(
  p_exercise_id UUID,
  p_user_id UUID,
  p_limit INTEGER DEFAULT 5
) RETURNS TABLE (...) AS $$
  -- Return: date, weight, reps, e1rm
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
```

### Update Exercise Detail Page
`/exercises/[id]` should now show:
1. Stats summary card
   - Estimated 1RM (large, prominent)
   - Max weight lifted
   - Max session volume
   - Total sets logged

2. Best performances list
   - Top 5 by e1RM
   - Shows: date, weight × reps, e1RM

3. History list/chart
   - Recent workout instances
   - Line chart showing e1RM over time (optional)

### Components
1. `StatsSummary` - Stats card
2. `BestPerformances` - Top lifts list
3. `ExerciseHistory` - History list
4. `HistoryChart` - Line chart (use simple library or CSS)

## Acceptance Criteria
- [ ] Stats compute correctly from workout data
- [ ] Stats update after logging new workout
- [ ] Best performances ranked by e1RM
- [ ] History shows all instances
- [ ] No stats for exercises with no data (empty state)
- [ ] Performance is acceptable (< 500ms load)

## Do NOT
- Store computed stats (compute on read)
- Add manual PR tracking
- Add goal setting
```

---

### 6.5 Phase 5 Prompt: Community Workouts

```markdown
# Task: ProjectAthlete v2 - Phase 5 (Community Workouts)

## Context
Core workout logging complete.
Now adding community workout sharing.

## Workout Types
- AMRAP (As Many Rounds As Possible)
- For Time
- EMOM (Every Minute On the Minute)
- Other

## Workflow
1. Athlete submits workout (status: pending)
2. Coach/Admin reviews in queue
3. Coach approves or rejects
4. Approved workouts visible to org
5. Coach can feature workouts

## Requirements

### Database
```sql
-- community_workouts table
-- workout_comments table
-- workout_reactions table
-- All RLS policies
```

### Pages
1. `/community` - Browse approved workouts
   - Filter by type
   - Featured section at top
   - Search by title

2. `/community/[id]` - Workout detail
   - Full description
   - Author info
   - Comments section
   - Reaction bar

3. `/community/submit` - Submit new workout
   - Title
   - Type (dropdown)
   - Description (rich text or markdown)
   - Time cap (optional)

4. `/admin/submissions` - Coach approval queue
   - List pending workouts
   - Preview each
   - Approve/Reject buttons
   - Optional: Feature toggle

### Components
1. `CommunityWorkoutCard` - List card
2. `WorkoutDetail` - Full view
3. `SubmitWorkoutForm` - Submission form
4. `CommentSection` - Comments
5. `ReactionBar` - Like/fire/strong/respect
6. `ApprovalQueue` - Admin list

### Reactions
- Like (👍)
- Fire (🔥)
- Strong (💪)
- Respect (🫡)

Only one of each type per user per workout.

## Acceptance Criteria
- [ ] Athletes can submit workouts
- [ ] Submissions start as pending
- [ ] Coach sees approval queue
- [ ] Approve/reject updates status
- [ ] Only approved workouts in browse
- [ ] Comments work (add, view)
- [ ] Reactions work (toggle)
- [ ] Featured workouts highlighted
- [ ] Author can edit pending submission
- [ ] Author can delete pending submission

## Do NOT
- Allow direct approval bypass
- Add scoring/logging for community workouts
- Add nested comments
```

---

### 6.6 Phase 6 Prompt: Challenges & Badges

```markdown
# Task: ProjectAthlete v2 - Phase 6 (Challenges & Badges)

## Context
Community workouts complete.
Now adding monthly challenges and badge system.

## Challenge Model
- Created by Coach/Admin
- Has: name, description, metric, unit, date range
- Athletes log cumulative progress
- Public leaderboard with anonymous option

## Badge Model
- Types: participation, winner, milestone, special
- Awarded automatically or manually
- Displayed on profile

## Requirements

### Database
```sql
-- challenges table
-- challenge_logs table
-- badges table (with seed data)
-- user_badges table
-- All RLS policies
```

### Badge Seed Data
```sql
INSERT INTO badges (name, description, icon, badge_type) VALUES
('First Challenge', 'Completed your first challenge', '🎯', 'milestone'),
('Challenge Champion', 'Won a monthly challenge', '🏆', 'challenge_winner'),
('Consistent', 'Logged progress 7 days in a row', '📅', 'milestone'),
('Community Contributor', 'Had a workout approved', '📝', 'milestone');
```

### Pages
1. `/challenges` - Active challenges
   - Current month's challenges
   - Progress summary per challenge
   - Quick log button

2. `/challenges/[id]` - Challenge detail
   - Full description
   - Your progress total
   - Log progress form
   - Leaderboard
   - Days remaining

3. `/challenges/history` - Past challenges
   - Completed challenges
   - Final standings
   - Badges earned

4. `/admin/challenges/new` - Create challenge (Coach)
   - Name, description
   - Metric and unit
   - Start/end dates

5. `/profile` - Update to show badges

### Components
1. `ChallengeCard` - Summary card
2. `Leaderboard` - Ranked list (respects anonymous)
3. `LogProgressForm` - Quick entry
4. `BadgeDisplay` - Badge grid on profile
5. `ChallengeCountdown` - Days remaining

### Leaderboard Rules
- Ranks by total logged value
- Anonymous users show as "Anonymous" + random animal
- Own position always highlighted
- Top 3 get special styling

### Badge Award Triggers
```sql
-- Award participation badge when user logs to a challenge
CREATE OR REPLACE FUNCTION award_participation_badge()
RETURNS TRIGGER AS $$
  -- Check if first time logging to this challenge
  -- If so, award participation badge
$$ LANGUAGE plpgsql;
```

## Acceptance Criteria
- [ ] Coach can create challenge
- [ ] Challenge has valid date range
- [ ] Athletes can log progress
- [ ] Leaderboard ranks correctly
- [ ] Anonymous athletes hidden
- [ ] Past challenges viewable
- [ ] Badges displayed on profile
- [ ] Participation badge auto-awarded

## Do NOT
- Add team challenges
- Add complex badge rules
- Add push notifications
```

---

### 6.7 Phase 7 Prompt: Polish & Deploy

```markdown
# Task: ProjectAthlete v2 - Phase 7 (Polish & Deploy)

## Context
All features complete. Final polish and deployment prep.

## Requirements

### UI Audit
1. Review all pages for:
   - Consistent spacing
   - Typography hierarchy
   - Color usage
   - Border radii
   - Glass effect consistency

2. Mobile responsiveness:
   - Test all pages at 375px width
   - Navigation works
   - Forms usable
   - Tables scroll horizontally

3. Loading states:
   - Every async operation
   - Skeleton loaders preferred
   - No layout shift

4. Empty states:
   - No workouts yet
   - No exercises yet
   - No challenges yet
   - No stats yet

5. Error states:
   - Network errors
   - Auth errors
   - Not found pages

### Performance
1. Run Lighthouse audit
2. Target scores:
   - Performance: 90+
   - Accessibility: 90+
   - Best Practices: 90+

3. Fix any critical issues

### Docker Final Test
```bash
docker build -t projectathlete:v1 .
docker run -p 6767:6767 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  projectathlete:v1
```

Test all flows in container.

### Documentation
Update README.md with:
1. Project overview
2. Tech stack
3. Local development setup
4. Environment variables
5. Docker deployment
6. Supabase setup

Create CONTRIBUTING.md (basic).

### Seed Script
Create script to populate demo data:
- Sample exercises (if not already)
- Sample workouts for test user
- Sample community workouts
- Active challenge

## Acceptance Criteria
- [ ] All pages responsive on mobile
- [ ] Loading states on all async
- [ ] Empty states implemented
- [ ] Error boundaries in place
- [ ] Lighthouse scores 90+
- [ ] Docker build succeeds
- [ ] Docker run works end-to-end
- [ ] README complete
- [ ] No TypeScript errors
- [ ] No console errors

## Do NOT
- Add new features
- Major refactors
- Change architecture
```

---

## 7. Risk Mitigation & Quality Gates

### 7.1 Key Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| **RLS misconfiguration** | High (data leak) | Medium | Test policies with multiple users; explicit RLS tests |
| **Auth session issues** | High (broken app) | Medium | Follow Supabase SSR docs exactly; test callback flow |
| **Docker build fails** | Medium (delays) | Low | Test build early and after each phase |
| **Performance issues** | Medium (UX) | Medium | Compute stats efficiently; add indexes; Lighthouse audit |
| **Mobile UX poor** | Medium (UX) | Medium | Mobile-first design; test early |
| **Scope creep** | High (delays) | High | Strict phase boundaries; no feature additions |

### 7.2 Quality Gates Per Phase

Each phase must pass before proceeding:

**Phase 0: Foundation**
- [ ] `npm run build` succeeds
- [ ] `docker build` succeeds
- [ ] App runs on port 6767

**Phase 1: Auth**
- [ ] OAuth login works
- [ ] Session persists across refreshes
- [ ] Protected routes redirect
- [ ] Profile created on signup
- [ ] RLS: Can't see other org's data

**Phase 2: Exercise Library**
- [ ] 50+ exercises seeded
- [ ] Search works
- [ ] Filter works
- [ ] ExercisePicker functional

**Phase 3: Workout Logging**
- [ ] Full CRUD works
- [ ] Multiple exercises per workout
- [ ] Multiple sets per exercise
- [ ] Edit existing workout
- [ ] Delete works
- [ ] RLS: Can't see other users' workouts

**Phase 4: Exercise Stats**
- [ ] Stats compute correctly
- [ ] 1RM formula accurate
- [ ] History shows all data
- [ ] Stats update after new workout

**Phase 5: Community Workouts**
- [ ] Submission workflow works
- [ ] Approval workflow works
- [ ] Only approved visible
- [ ] Comments work
- [ ] Reactions work

**Phase 6: Challenges**
- [ ] Coach can create
- [ ] Athletes can log
- [ ] Leaderboard accurate
- [ ] Anonymous works
- [ ] Badges awarded

**Phase 7: Polish**
- [ ] Mobile responsive
- [ ] Lighthouse 90+
- [ ] Docker end-to-end
- [ ] README complete

### 7.3 Testing Strategy

**For V1, focus on:**
1. **Manual testing** at each phase boundary
2. **RLS testing** with multiple test users
3. **Docker testing** after each phase

**Minimal automated tests (optional for V1):**
- Database function tests (SQL)
- Critical path E2E (Playwright) for auth flow

### 7.4 Rollback Strategy

Since we're committing at phase boundaries:
- If phase breaks, `git checkout HEAD~1`
- Fix issues, recommit
- Single `main` branch keeps it simple

---

## Appendix A: Environment Variables

```bash
# .env.example

# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: Supabase service role (for admin operations)
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Appendix B: Useful SQL Queries

```sql
-- Check user's org and role
SELECT p.*, o.name as org_name
FROM profiles p
JOIN organizations o ON o.id = p.org_id
WHERE p.id = auth.uid();

-- Test RLS as specific user (in Supabase SQL editor)
SET request.jwt.claim.sub = 'user-uuid-here';
SELECT * FROM workout_sessions; -- Should only show their data

-- Reset test data
TRUNCATE workout_sets, workout_exercises, workout_sessions CASCADE;
```

## Appendix C: Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Auth callback 500 error | Check redirect URL in Supabase dashboard matches exactly |
| Session not persisting | Ensure middleware refreshes session; check cookie settings |
| RLS blocking all queries | Ensure helper functions exist; check JWT structure |
| Docker build OOM | Increase Docker memory limit; ensure standalone output |
| Styles not loading in Docker | Check `next.config.js` has `output: 'standalone'` |

---

*End of Execution Plan Document*
