# ProjectAthlete v2

A self-hosted, multi-tenant workout logging web application built with Next.js, Supabase, and Docker.

## Features

- **Multi-Tenant Architecture**: Each organization has isolated data via Supabase RLS.
- **Next.js 14+ App Router**: Fast, SEO-friendly, and modern frontend.
- **Tailwind CSS v4**: Beautiful, modern UI with dark mode and glassmorphism.
- **Supabase Auth**: Apple OAuth and Email/Password support with secure session management.
- **Developer Login**: Quick login for development and testing.
- **Exercise Library**: 100+ seeded exercises with categorization and alias search.
- **Workout Logging**: Log sets, weight, and reps with real-time stat calculations.
- **Computed Stats**: View estimated 1RM, Max Weight, and Volume progression.
- **Community Workouts**: Share training sessions, react, and comment on others' work.
- **Monthly Challenges**: Compete in org-wide challenges with live leaderboards.
- **Docker Ready**: Standalone output for easy deployment.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Lucide Icons.
- **Backend**: Supabase (Auth, Database, RLS, SQL Functions).
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
