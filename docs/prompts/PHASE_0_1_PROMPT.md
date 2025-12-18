# ProjectAthlete v2 — Phase 0 & 1: Foundation + Auth

> **Copy this entire prompt to your AI coding agent to execute Phase 0 and 1.**

---

## Context

You are building ProjectAthlete v2, a workout logging app for strength athletes. This is a **greenfield Next.js project** deploying as a **Docker container** on an Unraid server with Cloudflare Tunnel.

**Critical Constraints:**
- App must run on **port 6767** (not 3000)
- Backend is **Supabase** (hosted) — no custom backend
- Auth is **Supabase SSR** with Apple OAuth
- This is a **multi-tenant** app — all data scoped by `org_id`

---

## Phase 0: Foundation

### Step 1: Initialize Project

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

### Step 2: Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install clsx tailwind-merge
npm install lucide-react
```

### Step 3: Project Structure

Create this folder structure:

```
/app
  /(auth)
    /login
      page.tsx
  /(dashboard)
    layout.tsx
    page.tsx
  /auth
    /callback
      route.ts
  layout.tsx
  globals.css
/components
  /ui
    button.tsx
    input.tsx
    card.tsx
  /layout
    sidebar.tsx
    navbar.tsx
    mobile-nav.tsx
/lib
  /supabase
    client.ts
    server.ts
    middleware.ts
  utils.ts
/types
  database.ts
```

### Step 4: Environment Files

**`.env.example`** (commit this):
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**`.env.local`** (gitignored):
```env
NEXT_PUBLIC_SUPABASE_URL=https://actual-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=actual-anon-key
```

Update `.gitignore` to include:
```
.env.local
.env*.local
```

### Step 5: Docker Configuration

**`Dockerfile`:**
```dockerfile
FROM node:20-alpine AS base

# Dependencies stage
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=6767
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 6767

CMD ["node", "server.js"]
```

**`next.config.js`** (update existing):
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}

module.exports = nextConfig
```

**`.dockerignore`:**
```
node_modules
.next
.git
*.md
.env.local
```

### Step 6: Tailwind Design System

**`tailwind.config.ts`** (update):
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
export default config
```

**`app/globals.css`** (replace):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 4%;
    --foreground: 0 0% 98%;
    --card: 0 0% 7%;
    --card-foreground: 0 0% 98%;
    --primary: 221 83% 53%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 15%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 15%;
    --muted-foreground: 0 0% 64%;
    --accent: 0 0% 15%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 15%;
    --input: 0 0% 15%;
    --ring: 221 83% 53%;
    --radius: 0.75rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground antialiased;
  }
}
```

### Step 7: Utility Functions

**`lib/utils.ts`:**
```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Step 8: Base UI Components

**`components/ui/button.tsx`:**
```typescript
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'default',
            'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground': variant === 'outline',
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
            'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
          },
          {
            'h-10 px-4 py-2': size === 'default',
            'h-9 px-3': size === 'sm',
            'h-11 px-8': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
```

**`components/ui/input.tsx`:**
```typescript
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
```

**`components/ui/card.tsx`:**
```typescript
import * as React from 'react'
import { cn } from '@/lib/utils'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl border border-border bg-card/50 backdrop-blur-sm text-card-foreground shadow-sm',
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

---

## Phase 1: Authentication & Multi-Org

### Step 1: Supabase Client Setup

**`lib/supabase/client.ts`:**
```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**`lib/supabase/server.ts`:**
```typescript
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
```

**`lib/supabase/middleware.ts`:**
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login')
  const isCallbackRoute = request.nextUrl.pathname.startsWith('/auth/callback')
  const isProtectedRoute = !isAuthRoute && !isCallbackRoute

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

### Step 2: Middleware

**`middleware.ts`** (root level):
```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### Step 3: TypeScript Types

**`types/database.ts`:**
```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          org_id: string
          role: 'athlete' | 'coach' | 'admin'
          display_name: string | null
          avatar_url: string | null
          is_anonymous_on_leaderboards: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          org_id: string
          role?: 'athlete' | 'coach' | 'admin'
          display_name?: string | null
          avatar_url?: string | null
          is_anonymous_on_leaderboards?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          org_id?: string
          role?: 'athlete' | 'coach' | 'admin'
          display_name?: string | null
          avatar_url?: string | null
          is_anonymous_on_leaderboards?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      get_user_org_id: {
        Args: Record<string, never>
        Returns: string
      }
      get_user_role: {
        Args: Record<string, never>
        Returns: string
      }
      is_coach_or_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
  }
}

// Convenience types
export type Organization = Database['public']['Tables']['organizations']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type UserRole = Profile['role']
```

### Step 4: Login Page

**`app/(auth)/login/page.tsx`:**
```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleAppleLogin = async () => {
    setIsLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">ProjectAthlete</CardTitle>
          <CardDescription>
            Track your workouts. Crush your goals.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}
          
          <Button 
            onClick={handleAppleLogin}
            disabled={isLoading}
            className="w-full h-12 bg-white text-black hover:bg-gray-100"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Connecting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Continue with Apple
              </span>
            )}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Step 5: Auth Callback

**`app/auth/callback/route.ts`:**
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
```

### Step 6: Dashboard Layout

**`app/(dashboard)/layout.tsx`:**
```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar user={user} profile={profile} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### Step 7: Sidebar Component

**`components/layout/sidebar.tsx`:**
```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  Dumbbell,
  Library,
  Users,
  Trophy,
  User,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Workouts', href: '/workouts', icon: Dumbbell },
  { name: 'Exercises', href: '/exercises', icon: Library },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Challenges', href: '/challenges', icon: Trophy },
  { name: 'Profile', href: '/profile', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:border-border lg:bg-card/30">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Dumbbell className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">ProjectAthlete</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
```

### Step 8: Navbar Component

**`components/layout/navbar.tsx`:**
```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MobileNav } from '@/components/layout/mobile-nav'
import { LogOut, Menu } from 'lucide-react'
import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types/database'

interface NavbarProps {
  user: User
  profile: (Profile & { organizations: { name: string } | null }) | null
}

export function Navbar({ user, profile }: NavbarProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      <header className="h-16 border-b border-border bg-card/30 backdrop-blur-sm px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-accent"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden sm:block">
            <span className="text-sm text-muted-foreground">
              {profile?.organizations?.name || 'ProjectAthlete'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{profile?.display_name || 'User'}</p>
            <p className="text-xs text-muted-foreground capitalize">{profile?.role || 'athlete'}</p>
          </div>
          
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  )
}
```

### Step 9: Mobile Navigation

**`components/layout/mobile-nav.tsx`:**
```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  Dumbbell,
  Library,
  Users,
  Trophy,
  User,
  X,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Workouts', href: '/workouts', icon: Dumbbell },
  { name: 'Exercises', href: '/exercises', icon: Library },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Challenges', href: '/challenges', icon: Trophy },
  { name: 'Profile', href: '/profile', icon: User },
]

interface MobileNavProps {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border">
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">ProjectAthlete</span>
          </Link>
          
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
```

### Step 10: Dashboard Home Page

**`app/(dashboard)/page.tsx`:**
```typescript
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dumbbell, Trophy, Users, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Here's your training overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Start logging to see stats</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">workouts completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Join a challenge to compete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">workouts shared</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
            <CardDescription>Your latest training sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Dumbbell className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No workouts yet</p>
              <p className="text-sm">Start logging to see your history</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Records</CardTitle>
            <CardDescription>Your best lifts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No records yet</p>
              <p className="text-sm">Log workouts to track your PRs</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### Step 11: Root Layout

**`app/layout.tsx`:**
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ProjectAthlete',
  description: 'Track your workouts. Crush your goals.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

---

## Supabase Setup (Manual Steps)

1. Create Supabase project at https://supabase.com
2. Enable Apple OAuth provider in Auth settings
3. Configure redirect URL: `https://your-domain.com/auth/callback`
4. Run migration `001_foundation.sql` in SQL Editor

---

## Verification Checklist

- [ ] `npm run dev` starts without errors
- [ ] `npm run build` succeeds
- [ ] `docker build -t projectathlete .` succeeds
- [ ] `docker run -p 6767:6767 -e NEXT_PUBLIC_SUPABASE_URL=... -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... projectathlete` runs
- [ ] Login page renders at `/login`
- [ ] Apple OAuth button triggers redirect
- [ ] After auth, redirected to dashboard
- [ ] Sidebar navigation works
- [ ] Mobile navigation works
- [ ] Sign out returns to login

---

## What NOT to Do

- ❌ Do not add workout logging features
- ❌ Do not add exercise library
- ❌ Do not over-engineer components
- ❌ Do not add unnecessary dependencies
- ❌ Do not create additional pages beyond scope
