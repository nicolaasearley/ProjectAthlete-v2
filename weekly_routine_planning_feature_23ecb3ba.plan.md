---
name: Weekly Routine Planning Feature
overview: Add a persistent weekly routine planning section where athletes can plan daily training focuses using blocks (Warm Up, Plyometrics, Main Lift, Accessory, etc.) with optional notes and specific configurations for Main Lift and Accessory blocks.
todos:
  - id: db-migration
    content: Create database migration file 023_weekly_routines.sql with tables, indexes, RLS policies, and triggers
    status: pending
  - id: type-definitions
    content: Add TypeScript types for weekly_routines, routine_days, routine_blocks, and routine_block_configs tables in types/database.ts
    status: pending
    dependencies:
      - db-migration
  - id: constants
    content: Add constants for block types, main lift types, and muscle groups in types/database.ts
    status: pending
  - id: server-actions
    content: Create app/routines/actions.ts with CRUD functions for routines, days, blocks, and configs
    status: pending
    dependencies:
      - type-definitions
  - id: overview-page
    content: Create app/(dashboard)/routines/page.tsx with weekly calendar overview showing all days and blocks
    status: pending
    dependencies:
      - server-actions
  - id: routine-components
    content: Create routine overview, day card, and block card components for displaying the routine
    status: pending
    dependencies:
      - overview-page
  - id: edit-page
    content: Create app/(dashboard)/routines/edit/page.tsx with full editing capabilities
    status: pending
    dependencies:
      - routine-components
  - id: editor-components
    content: Create routine editor, day editor, and block editor components with drag-to-reorder functionality
    status: pending
    dependencies:
      - edit-page
  - id: block-config
    content: Create main lift selector and muscle group selector components for block configuration
    status: pending
    dependencies:
      - editor-components
  - id: navigation
    content: Add Routines to sidebar and bottom navigation
    status: pending
    dependencies:
      - overview-page
---

# Weekly Routine Planning Feature

## Overview

Create a new "Routine" section where athletes can plan out a persistent weekly training schedule using daily blocks. Each day can have multiple blocks (Warm Up, Plyometrics, Main Lift, Accessory, etc.) with optional notes. Main Lift blocks can specify lift types (Hinge, Squat, Bench, Press), and Accessory blocks can specify muscle groups.

## Database Schema

### New Migration: `023_weekly_routines.sql`

**Tables to create:**

1. **`weekly_routines`** - One per user, stores the routine metadata

- `id` UUID PRIMARY KEY
- `user_id` UUID REFERENCES auth.users
- `org_id` UUID REFERENCES organizations
- `name` TEXT (optional, e.g., "Off-Season", "Competition Prep")
- `created_at` TIMESTAMPTZ
- `updated_at` TIMESTAMPTZ

2. **`routine_days`**  - One per day of the week (7 per routine)

- `id` UUID PRIMARY KEY
- `routine_id` UUID REFERENCES weekly_routines ON DELETE CASCADE
- `day_of_week` INTEGER (0=Sunday, 1=Monday, ..., 6=Saturday)
- `notes` TEXT (optional day-level notes)
- `created_at` TIMESTAMPTZ

3. **`routine_blocks`** - Individual blocks within each day

- `id` UUID PRIMARY KEY
- `day_id` UUID REFERENCES routine_days ON DELETE CASCADE
- `block_type` TEXT CHECK (warm_up, plyometrics, main_lift, accessory, calisthenics, general_cardio, running, engine_work, yoga_mobility, hyrox, other)
- `order_index` INTEGER (for ordering blocks within a day)
- `notes` TEXT (optional block-specific notes)
- `created_at` TIMESTAMPTZ

4. **`routine_block_configs`** - Configuration for blocks that need it

- `id` UUID PRIMARY KEY
- `block_id` UUID REFERENCES routine_blocks ON DELETE CASCADE
- `config_type` TEXT CHECK ('main_lift_type', 'muscle_group')
- `value` TEXT (e.g., 'hinge', 'squat' for main_lift_type; 'chest', 'back' for muscle_group)
- `created_at` TIMESTAMPTZ

**RLS Policies:**

- Users can view their own routines
- Users can create/update/delete their own routines
- Coaches/admins can view routines in their org

**Indexes:**

- `routine_days(routine_id, day_of_week)`
- `routine_blocks(day_id, order_index)`
- `routine_block_configs(block_id)`

## Implementation Structure

### 1. Database Migration

- File: `docs/database/023_weekly_routines.sql`
- Create all tables, indexes, RLS policies, and triggers
- Follow existing migration patterns

### 2. Type Definitions

- File: `types/database.ts`
- Add types for new tables
- Add constants for block types and main lift types
- Add muscle groups constant

### 3. Server Actions

- File: `app/routines/actions.ts`
- Functions:
- `getWeeklyRoutine()` - Get user's current routine
- `createWeeklyRoutine(data)` - Create new routine
- `updateWeeklyRoutine(routineId, data)` - Update existing routine
- `deleteWeeklyRoutine(routineId)` - Delete routine
- `upsertRoutineDay(routineId, dayOfWeek, data)` - Create/update a day
- `deleteRoutineDay(dayId)` - Delete a day
- `addRoutineBlock(dayId, blockType, orderIndex)` - Add block to day
- `updateRoutineBlock(blockId, data)` - Update block
- `deleteRoutineBlock(blockId)` - Delete block
- `updateBlockConfig(blockId, configType, values)` - Update block configs

### 4. Route Structure

- `app/(dashboard)/routines/page.tsx` - Main routine overview page
- `app/(dashboard)/routines/edit/page.tsx` - Edit routine page
- `app/(dashboard)/routines/loading.tsx` - Loading state

### 5. Components

**Main Components:**

- `components/routines/routine-overview.tsx` - Weekly calendar view showing all days
- `components/routines/routine-day-card.tsx` - Card showing a single day's blocks
- `components/routines/routine-block-card.tsx` - Individual block display
- `components/routines/routine-editor.tsx` - Main editor component
- `components/routines/day-editor.tsx` - Editor for a single day
- `components/routines/block-editor.tsx` - Editor for adding/editing blocks
- `components/routines/block-type-selector.tsx` - Selector for block types
- `components/routines/main-lift-selector.tsx` - Multi-select for main lift types
- `components/routines/muscle-group-selector.tsx` - Multi-select for muscle groups

**Constants:**

- Block types: Warm Up, Plyometrics, Main Lift, Accessory, Calisthenics, General Cardio, Running, Engine Work, Yoga/Mobility, Hyrox, Other
- Main lift types: Hinge, Squat, Bench, Press (can use existing exercise categories)
- Muscle groups: Chest, Back, Shoulders, Arms, Legs, Core, Glutes, etc.

### 6. Navigation

- Add "Routines" to sidebar navigation (`components/layout/sidebar.tsx`)
- Use Calendar icon from lucide-react
- Add to bottom nav if applicable

## UI/UX Flow

### Overview Page (`/routines`)

- Show weekly calendar view (7 days)
- Each day shows blocks as cards/chips
- Empty state if no routine exists
- "Create Routine" or "Edit Routine" button
- Visual indicator for days with planned blocks

### Edit Page (`/routines/edit`)

- Week view with expandable day sections
- For each day:
- Add/remove blocks
- Reorder blocks (drag or up/down arrows)
- Add notes to blocks
- Configure Main Lift block (select lift types)
- Configure Accessory block (select muscle groups)
- Save/Cancel buttons
- Auto-save or explicit save (prefer explicit for clarity)

### Block Configuration

- **Main Lift Block**: Show multi-select for lift types (Hinge, Squat, Bench, Press)
- **Accessory Block**: Show multi-select for muscle groups
- **All Blocks**: Optional notes textarea
- **Other Block**: Custom notes field

## Data Flow

```javascript
User creates/edits routine
  ↓
Server action validates and saves to database
  ↓
RLS ensures user can only access their own routine
  ↓
Overview page displays routine
  ↓
User can view/edit anytime
```



## Additional Enhancements

1. **Visual Indicators**: Color-code block types for quick scanning
2. **Copy Day**: Allow copying blocks from one day to another
3. **Quick Actions**: "Rest Day" button to clear a day
4. **Routine Name**: Optional name field for multiple routines (future expansion)
5. **Validation**: Ensure at least one day has blocks before saving

## Files to Create/Modify

**New Files:**

- `docs/database/023_weekly_routines.sql`
- `app/routines/actions.ts`
- `app/(dashboard)/routines/page.tsx`
- `app/(dashboard)/routines/edit/page.tsx`
- `app/(dashboard)/routines/loading.tsx`
- `components/routines/routine-overview.tsx`
- `components/routines/routine-day-card.tsx`
- `components/routines/routine-block-card.tsx`
- `components/routines/routine-editor.tsx`
- `components/routines/day-editor.tsx`
- `components/routines/block-editor.tsx`
- `components/routines/block-type-selector.tsx`
- `components/routines/main-lift-selector.tsx`
- `components/routines/muscle-group-selector.tsx`

**Modified Files:**

- `types/database.ts` - Add new table types and constants
- `components/layout/sidebar.tsx` - Add Routines navigation item
- `components/layout/bottom-nav.tsx` - Add Routines if needed

## Implementation Order

1. Database migration and types
2. Server actions (CRUD operations)
3. Main overview page (read-only initially)
4. Edit page and editor components
5. Block configuration components
6. Navigation integration