# ProjectAthlete v2

A self-hosted, multi-tenant workout logging web application built with Next.js, Supabase, and Docker.

## Features

- **Multi-Tenant Architecture**: Each organization has isolated data via Supabase RLS.
- **Next.js App Router**: Fast, modern frontend with standard output for easy hosting.
- **Tailwind CSS**: Beautiful UI with dark mode, glassmorphism, and mobile-first design.
- **Supabase Auth**: Apple OAuth and Email/Password support.
- **Developer Mode**: Quick login toggle for development and testing.
- **Exercise Library**: 100+ seeded exercises with categorized browsing and instant live search.
- **Workout Logging**: Log sets, weight, and reps with real-time performance tracking.
- **Coach Dashboards**: Specialized views for coaches to monitor athlete progress and approve community submissions.
- **Computed Stats**: Automated tracking of Estimated 1RM, Personal Records, and Volume.
- **Community Workouts**: Share training sessions, react, and comment on others' work with an approval workflow.
- **Gamified Challenges**: Compete in org-wide challenges with live leaderboards, real-time countdowns, and automated badge awarding.
- **Docker Ready**: Fully containerized with standalone output.

## Tech Stack

- **Frontend**: Next.js 15+, React 19, Tailwind CSS v4, Lucide Icons.
- **Backend**: Supabase (PostgreSQL, RLS, Edge Functions, Auth).
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
4. Run the database migrations located in `docs/database/` in your Supabase SQL Editor in order (`001_foundation.sql` to `007_challenges.sql`).
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
   - **Join Code**: The default organization "ProjectAthlete" is created with join code `ATHLETE2025`. Users must enter this code to sign up.
6. Run the development server:
   ```bash
   npm run dev
   ```

## Docker Deployment
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
