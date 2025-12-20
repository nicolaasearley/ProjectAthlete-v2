# ProjectAthlete v2

A self-hosted, multi-tenant workout logging web application built with Next.js, Supabase, and Docker.

## Features

- **Multi-Tenant Architecture**: Each organization has isolated data via Supabase RLS.
- **Next.js App Router**: Fast, modern frontend with standard output for easy hosting.
- **Tailwind CSS**: Beautiful UI with dark mode, glassmorphism, and mobile-first design.
- **Supabase Auth**: Apple OAuth and Email/Password support.
- **Developer Mode**: Quick login toggle for development and testing.
- **Flexible Metrics**: Track more than just weights and reps. Support for time, distance (meters/km), and calories per exercise.
- **Training Stats Dashboard**: Comprehensive analytics with interactive charts for volume trends, consistency streaks, and PR progression.
- **Activity Feed**: Real-time community hub showing New Personal Records, challenge achievements, and community updates with social reactions.
- **Workout Templates**: Save favorite routines as templates to jumpstart your next training session.
- **Profile Management**: Customize your identity with display names and profile photo uploads via Supabase Storage.
- **Coach Dashboards**: Specialized views for coaches to monitor all athletes' lifts, manage organization users, and approve community submissions.
- **Gamified Challenges**: Compete in org-wide challenges with live leaderboards, custom challenge badges, and automated awarding.
- **Docker Ready**: Fully containerized with standalone output.

## Tech Stack

- **Frontend**: Next.js 15+, React 19, Tailwind CSS v4, Lucide Icons, Recharts.
- **Backend**: Supabase (PostgreSQL, RLS, Storage, Auth).
- **Deployment**: Docker, Exposed on Port 6767.

## Getting Started

### Prerequisites
- Node.js 18+
- Docker (optional)
- Supabase Project

### Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables (see `.env.example`).
4. Run the database migrations located in `docs/database/` in your Supabase SQL Editor in order (`001_foundation.sql` to `014_fix_1rm_calculation.sql`).
5. **Supabase Configuration**:
   - **Authentication Providers**:
     - **Email**: Enable in `Authentication > Providers`. Disable "Confirm Email" for immediate access.
     - **Google**: 
       1. Create a project in Google Cloud Console.
       2. Set up OAuth consent screen and create Web App Client IDs.
       3. Add the Supabase Callback URL to Google's redirect URIs.
       4. Add Client ID/Secret to Supabase.
     - **Apple**: 
       1. Setup App ID and Service ID in Apple Developer Portal.
       2. Add Supabase Callback URL to the Service ID.
       3. Generate and upload a private key to Supabase.
   - **Storage**: Create two public buckets named `avatars` and `badges` in your Supabase project (or run migration `009_storage_setup.sql`).
   - **Join Code**: The default organization "ProjectAthlete" is created with join code `ATHLETE2025`. Users must enter this code to sign up.
6. Run the development server:
   ```bash
   npm run dev
   ```

## Docker Deployment

### Quick Start with Docker Compose (Recommended)

1. Copy the example environment file and fill in your Supabase credentials:
   ```bash
   cp .env.example .env.local
   nano .env.local  # Add your credentials
   ```

2. Build and start the container:
   ```bash
   # Source the env file first (required for build args)
   set -a && source .env.local && set +a
   docker compose up -d --build
   ```

3. Access the app at `http://localhost:6767`

### Updating the Live Server

After pushing changes to GitHub, SSH into your server and run:
```bash
./deploy.sh
```

This script will:
- Load environment variables from `.env.local`
- Pull the latest code from GitHub
- Rebuild the Docker image
- Restart the container with zero downtime
- Clean up old Docker images

### Manual Docker Build (Alternative)

Build the container with your Supabase credentials (required for client-side code):
```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="your-supabase-url" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key" \
  -t projectathlete .
```

Run the container:
```bash
docker run -p 6767:6767 --env-file .env.local projectathlete
```
