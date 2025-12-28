import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Trophy, Calendar, Dumbbell, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { formatDate, cn } from '@/lib/utils'

export const metadata: Metadata = {
    title: 'Personal Records | ProjectAthlete',
    description: 'Your all-time best performances and strength milestones.',
}

export default async function RecordsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Fetch all exercise PRs for the user
    const { data: records, error } = await (supabase.rpc as any)('get_user_exercise_summary', {
        p_user_id: user.id,
        p_limit: 100 // Get a comprehensive list
    })

    if (error) {
        console.error('Error fetching records:', error)
    }

    const hasRecords = records && records.length > 0

    const CATEGORY_STYLES: Record<string, {
        bg: string
        border: string
        text: string
        gradient: string
    }> = {
        squat: {
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            text: 'text-blue-400',
            gradient: 'from-blue-500/15 to-transparent'
        },
        hinge: {
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            text: 'text-amber-400',
            gradient: 'from-amber-500/15 to-transparent'
        },
        push: {
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
            text: 'text-red-400',
            gradient: 'from-red-500/15 to-transparent'
        },
        pull: {
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            text: 'text-emerald-400',
            gradient: 'from-emerald-500/15 to-transparent'
        },
        carry: {
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20',
            text: 'text-purple-400',
            gradient: 'from-purple-500/15 to-transparent'
        },
        core: {
            bg: 'bg-cyan-500/10',
            border: 'border-cyan-500/20',
            text: 'text-cyan-400',
            gradient: 'from-cyan-500/15 to-transparent'
        },
        olympic: {
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/20',
            text: 'text-yellow-400',
            gradient: 'from-yellow-500/15 to-transparent'
        },
        cardio: {
            bg: 'bg-rose-500/10',
            border: 'border-rose-500/20',
            text: 'text-rose-400',
            gradient: 'from-rose-500/15 to-transparent'
        },
        other: {
            bg: 'bg-slate-400/10',
            border: 'border-slate-400/20',
            text: 'text-slate-400',
            gradient: 'from-slate-400/15 to-transparent'
        }
    }

    return (
        <div className="space-y-12 pb-24 page-transition">
            <div className="px-2">
                <h1 className="text-4xl font-bold tracking-tight">Personal Records</h1>
                <p className="text-foreground/40 font-semibold uppercase tracking-[0.3em] text-[10px] mt-2">
                    Your hall of fame & strength milestones
                </p>
            </div>

            {!hasRecords ? (
                <Card premium className="p-16 text-center flex flex-col items-center justify-center border-dashed border-2 bg-transparent">
                    <Trophy className="h-16 w-16 text-foreground/5 mb-6" />
                    <h3 className="text-2xl font-bold tracking-tight">Empty Record Book</h3>
                    <p className="text-muted-foreground mt-3 max-w-sm mx-auto text-sm leading-relaxed">
                        Log your sessions to archive your performance here.
                    </p>
                    <Link
                        href="/workouts/new"
                        className="mt-8 px-8 py-3 bg-primary text-primary-foreground rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                    >
                        Start Logging
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {records.map((record: any) => {
                        const style = CATEGORY_STYLES[record.category?.toLowerCase()] || CATEGORY_STYLES.other
                        return (
                            <Link key={record.exercise_id} href={`/exercises/${record.exercise_id}`}>
                                <Card premium className={cn(
                                    "group hover:scale-[1.01] transition-all duration-300 cursor-pointer overflow-hidden h-full",
                                    "bg-card/30 backdrop-blur-xl border-foreground/5",
                                    "hover:border-foreground/20"
                                )}>
                                    {/* Gradient Overlay */}
                                    <div className={cn(
                                        "absolute inset-0 bg-gradient-to-br pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500",
                                        style.gradient
                                    )} />

                                    <div className="p-6 flex flex-col h-full relative z-10">
                                        {/* Category Tag */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className={cn(
                                                "px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest",
                                                style.bg,
                                                style.border,
                                                style.text
                                            )}>
                                                {record.category}
                                            </div>
                                            <ArrowUpRight className="h-4 w-4 text-foreground/10 group-hover:text-foreground/40 transition-colors" />
                                        </div>

                                        <div className="mb-8">
                                            <h3 className="text-2xl font-bold tracking-tight text-foreground transition-colors leading-tight">
                                                {record.exercise_name}
                                            </h3>
                                        </div>

                                        {/* Stats Hero - Using raw values (which are already in lbs) */}
                                        <div className="flex-1 flex items-end">
                                            <div className="w-full">
                                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/20 mb-1">Personal Best</p>
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className="text-5xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors duration-300 leading-none">
                                                        {record.max_weight}
                                                    </span>
                                                    <span className="text-base font-bold text-foreground/20 italic">lbs</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer - Date moved here */}
                                        <div className="mt-8 pt-5 border-t border-foreground/[0.03] flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground/20">
                                                <Calendar className="h-3.5 w-3.5 opacity-50" />
                                                <span>Achieved</span>
                                                <span className="text-foreground/40">{formatDate(record.last_logged)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
