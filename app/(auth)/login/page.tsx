'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { useState, useEffect } from 'react'
import { Loader2, ShieldCheck, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  
  // Sign In / Sign Up common
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Sign Up specific
  const [orgCode, setOrgCode] = useState('')
  const [isValidatingCode, setIsValidatingCode] = useState(false)
  const [orgDetails, setOrgDetails] = useState<{ id: string; name: string } | null>(null)
  const [displayName, setDisplayName] = useState('')
  
  const supabase = createClient()

  // Validate org code when it changes
  useEffect(() => {
    if (orgCode.length >= 4 && activeTab === 'signup') {
      const validate = async () => {
        setIsValidatingCode(true)
        const { data, error } = await (supabase.rpc as any)('validate_org_code', {
          p_code: orgCode.toUpperCase()
        })
        
        if (data && data.length > 0) {
          setOrgDetails(data[0])
          setError(null)
        } else {
          setOrgDetails(null)
        }
        setIsValidatingCode(false)
      }
      
      const timer = setTimeout(validate, 500)
      return () => clearTimeout(timer)
    } else {
      setOrgDetails(null)
    }
  }, [orgCode, activeTab, supabase])

  const handleOAuthLogin = async (provider: 'apple' | 'google') => {
    setIsLoading(true)
    setError(null)
    
    // For signup, we pass the org code so the trigger can pick it up
    const options: any = {
      redirectTo: `${window.location.origin}/auth/callback`,
    }

    if (activeTab === 'signup' && orgCode) {
      options.queryParams = {
        org_code: orgCode.toUpperCase()
      }
      // Supabase also allows passing data that ends up in raw_user_meta_data
      options.data = {
        org_code: orgCode.toUpperCase()
      }
    }
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (activeTab === 'signup' && !orgDetails) {
      setError('Please enter a valid organization code to sign up.')
      setIsLoading(false)
      return
    }

    const { error } = activeTab === 'signup'
      ? await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              display_name: displayName,
              org_code: orgCode.toUpperCase()
            }
          }
        })
      : await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      // Refresh to trigger middleware redirect
      window.location.href = '/'
    }
  }

  const handleDevLogin = async () => {
    setIsLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signInWithPassword({
      email: 'dev@projectathlete.com',
      password: 'password123',
    })

    if (error) {
      setError('Dev account not found. Please create dev@projectathlete.com in Supabase with password "password123".')
      setIsLoading(false)
    } else {
      window.location.href = '/'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background animate-fade-in">
      <Card className="w-full max-w-md shadow-2xl border-primary/10">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <ShieldCheck className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">ProjectAthlete</CardTitle>
          <CardDescription className="text-base mt-2">
            {activeTab === 'signin' ? 'Welcome back to the grind' : 'Join your local fitness community'}
          </CardDescription>
        </CardHeader>

        <div className="px-6 pt-4">
          <div className="flex p-1 bg-muted/50 rounded-lg gap-1">
            <button
              onClick={() => setActiveTab('signin')}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                activeTab === 'signin' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-md transition-all",
                activeTab === 'signup' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Sign Up
            </button>
          </div>
        </div>

        <CardContent className="space-y-6 pt-6">
          {error && (activeTab === 'signin' || !error.includes('org code')) && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20 flex gap-2 items-start animate-in fade-in zoom-in-95 duration-200">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {activeTab === 'signup' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="relative">
                  <Input
                    label="Organization Join Code"
                    placeholder="Enter code (e.g. ATHLETE2025)"
                    value={orgCode}
                    onChange={(e) => setOrgCode(e.target.value.toUpperCase())}
                    className={cn(
                      "pr-10 h-11",
                      orgDetails && "border-green-500/50 focus:ring-green-500/20"
                    )}
                    required
                  />
                  <div className="absolute right-3 top-[34px]">
                    {isValidatingCode ? (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    ) : orgDetails ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : orgCode.length >= 4 ? (
                      <AlertCircle className="h-5 w-5 text-destructive/50" />
                    ) : null}
                  </div>
                </div>
                
                {orgDetails && (
                  <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/10 text-xs text-green-600 dark:text-green-400 flex items-center gap-2 animate-in fade-in duration-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Joining <strong>{orgDetails.name}</strong>
                  </div>
                )}

                <Input
                  label="Display Name"
                  placeholder="Your Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-11"
                  required
                />
              </div>
            )}

            <Input
              type="email"
              label="Email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11"
              required
            />
            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
              required
            />
            
            <Button 
              type="submit" 
              className="w-full h-11 shadow-lg shadow-primary/20"
              disabled={isLoading || (activeTab === 'signup' && !orgDetails)}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : activeTab === 'signup' ? (
                <ArrowRight className="h-4 w-4 mr-2" />
              ) : (
                <Mail className="h-4 w-4 mr-2" />
              )}
              {activeTab === 'signup' ? 'Create Account' : 'Sign In with Email'}
            </Button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-4 text-muted-foreground font-medium">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline"
              onClick={() => handleOAuthLogin('apple')}
              disabled={isLoading || (activeTab === 'signup' && !orgDetails)}
              className="h-11 bg-white text-black hover:bg-gray-50 hover:text-black border-gray-200"
            >
              {!isLoading && (
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
              )}
              Apple
            </Button>

            <Button 
              variant="outline"
              onClick={() => handleOAuthLogin('google')}
              disabled={isLoading || (activeTab === 'signup' && !orgDetails)}
              className="h-11 bg-white text-black hover:bg-gray-50 hover:text-black border-gray-200"
            >
              {!isLoading && (
                <svg className="h-5 w-5 mr-2" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C40.483,35.091,44,30.577,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
              )}
              Google
            </Button>
          </div>

          <Button 
            variant="ghost"
            onClick={handleDevLogin}
            disabled={isLoading}
            className="w-full h-11 text-muted-foreground hover:text-primary transition-colors"
          >
            <ShieldCheck className="h-4 w-4 mr-2" />
            Developer Access
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-[10px] text-center text-muted-foreground w-full">
            By continuing, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
