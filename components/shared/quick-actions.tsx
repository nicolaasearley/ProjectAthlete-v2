'use client'

import { useState, useEffect } from 'react'
import { Plus, Dumbbell, Trophy, Trophy as RecordIcon, X, Target } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

export function QuickActions() {
    const [isOpen, setIsOpen] = useState(false)
    const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        async function fetchActiveChallenge() {
            const today = new Date().toISOString().split('T')[0]
            const { data } = await supabase
                .from('challenges')
                .select('id')
                .lte('start_date', today)
                .gte('end_date', today)
                .order('end_date', { ascending: true })
                .limit(1)
                .single()

            if (data) setActiveChallengeId((data as any).id)
        }

        fetchActiveChallenge()
    }, [])

    const actions = [
        {
            name: 'Log Workout',
            icon: Dumbbell,
            href: '/workouts/new',
            color: 'bg-primary',
            description: 'Start a new session'
        },
        {
            name: 'Log Challenge',
            icon: Target,
            href: activeChallengeId ? `/challenges/${activeChallengeId}` : '/challenges',
            color: 'bg-purple-600',
            description: 'Submit progress'
        },
        {
            name: 'View Records',
            icon: RecordIcon,
            href: '/records',
            color: 'bg-teal-600',
            description: 'Check your PRs'
        },
    ]

    return (
        <div className="fixed bottom-32 right-4 lg:bottom-10 lg:right-10 z-[100] flex flex-col items-end">
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/40 backdrop-blur-md z-[-1] transition-opacity duration-300 pointer-events-auto"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Menu Options */}
            <div className={cn(
                "flex flex-col items-end gap-3 mb-4 transition-all duration-300 origin-bottom",
                isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-0 opacity-0 translate-y-10"
            )}>
                {actions.map((action, idx) => (
                    <Link
                        key={action.name}
                        href={action.href}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-center gap-3"
                        style={{ transitionDelay: `${idx * 50}ms` }}
                    >
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 leading-none mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {action.description}
                            </span>
                            <span className="px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-md border border-foreground/10 text-xs font-black uppercase tracking-widest shadow-2xl group-active:scale-95 transition-all">
                                {action.name}
                            </span>
                        </div>
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center shadow-xl group-active:scale-90 transition-all",
                            action.color
                        )}>
                            <action.icon className="w-5 h-5 text-white" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-90 relative overflow-hidden group",
                    isOpen ? "bg-foreground text-background" : "bg-primary text-primary-foreground"
                )}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-none" />

                {isOpen ? (
                    <X className="w-6 h-6 transition-transform duration-500 rotate-0" />
                ) : (
                    <div className="relative">
                        <Plus className="w-6 h-6 transition-transform duration-500 rotate-0" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping opacity-50 group-hover:hidden" />
                    </div>
                )}
            </button>
        </div>
    )
}
