# ProjectAthlete v2

A premium, self-hosted web application for strength and hybrid athletes to log workouts, track performance, and participate in community challenges.

## Features

- **Workout Logging**: Track gym sessions with exercises, sets, weights, and reps
- **Exercise Library**: 100+ pre-seeded exercises with aliases and search
- **Performance Stats**: Auto-calculated 1RM, max weight, volume records
- **Community Workouts**: Share and discover CrossFit-style WODs (AMRAP, For Time, EMOM)
- **Monthly Challenges**: Compete on leaderboards and earn badges
- **Multi-Tenant**: Support for multiple organizations/teams

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, PostgreSQL, RLS)
- **Auth**: Apple OAuth via Supabase SSR
- **Deployment**: Docker container on port 6767

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account
- Docker (for production deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/nicolaasearley/ProjectAthlete-v2.git
   cd ProjectAthlete-v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Enable Apple OAuth in Authentication settings
   - Run database migrations (see `/docs/database/`)

5. **Start development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

### Docker Deployment

1. **Build the image**
   ```bash
   docker build -t projectathlete .
   ```

2. **Run the container**
   ```bash
   docker run -p 6767:6767 \
     -e NEXT_PUBLIC_SUPABASE_URL=your-url \
     -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
     projectathlete
   ```

3. **Configure Cloudflare Tunnel** (for Unraid)
   - Point tunnel to `http://<unraid-ip>:6767`

## Project Structure

```
/app                    # Next.js App Router pages
  /(auth)               # Auth pages (login)
  /(dashboard)          # Main app pages
  /auth/callback        # OAuth callback
  /workouts             # Workout logging
  /exercises            # Exercise library
  /community            # Community workouts
  /challenges           # Monthly challenges
/components             # React components
  /ui                   # Base UI components
  /layout               # Layout components
  /workouts             # Workout feature
  /exercises            # Exercise feature
  /community            # Community feature
  /challenges           # Challenge feature
/lib                    # Utilities
  /supabase             # Supabase clients
/types                  # TypeScript types
/docs                   # Documentation
  /database             # SQL migrations
  /prompts              # AI agent prompts
```

## Database Migrations

Run these in order in Supabase SQL Editor:

1. `001_foundation.sql` - Organizations, Profiles, Auth triggers
2. `002_exercises.sql` - Exercise library tables
3. `003_exercise_seed.sql` - 100+ exercise seed data
4. `004_workouts.sql` - Workout logging tables
5. `005_exercise_stats.sql` - Stats computation functions
6. `006_community.sql` - Community workouts tables
7. `007_challenges.sql` - Challenges and badges

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

## User Roles

- **Athlete**: Log workouts, view stats, participate in challenges
- **Coach**: All athlete permissions + approve community workouts, manage challenges
- **Admin**: All coach permissions + organization management

## Documentation

See the `/docs` folder for:
- [Execution Plan](docs/EXECUTION_PLAN.md) - Full technical specification
- [Implementation Checklist](docs/IMPLEMENTATION_CHECKLIST.md) - Phase-by-phase checklist
- [Phase Prompts](docs/prompts/) - AI agent prompts for each phase
- [Database Migrations](docs/database/) - SQL files

## License

Private - All rights reserved

## Author

Built with ❤️ for strength athletes
