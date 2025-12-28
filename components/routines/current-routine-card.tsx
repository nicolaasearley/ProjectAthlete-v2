'use client'

import { useEffect, useState } from 'react'
import { getWeeklyRoutine } from '@/app/routines/actions'
import { Card } from '@/components/ui/card'
import { RoutineBlockCard, ExtendedRoutineBlock } from './routine-block-card'
import { Calendar, ChevronRight, Loader2, Coffee } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function CurrentRoutineCard() {
    const [routine, setRoutine] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadRoutine() {
            const data = await getWeeklyRoutine()
            setRoutine(data)
            setLoading(false)
        }
        loadRoutine()
    }, [])

    const todayIndex = new Date().getDay() // 0-6
    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const todayName = DAYS[todayIndex]

    const todayData = routine?.routine_days?.find((d: any) => d.day_of_week === todayIndex)
    const blocks = todayData?.routine_blocks || []

    if (loading) {
        return (
            <Card premium className="md:col-span-4 min-h-[200px] flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-foreground/20" />
            </Card>
        )
    }

    if (!routine) return null

    return (
        <Card premium glow="primary" className="md:col-span-4 flex flex-col justify-between group overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="stat-label text-blue-400">Today&apos;s Focus</div>
                        <h2 className="text-2xl font-bold tracking-tight mt-1">{todayName}</h2>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-foreground/40" />
                    </div>
                </div>

                <div className="space-y-3 min-h-[100px]">
                    {blocks.length > 0 ? (
                        blocks.map((block: ExtendedRoutineBlock) => (
                            <RoutineBlockCard
                                key={block.id}
                                block={block}
                                className="bg-foreground/[0.03] border-foreground/5 hover:bg-foreground/[0.05] transition-colors"
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-6 text-center opacity-40">
                            <Coffee className="h-8 w-8 mb-2" />
                            <p className="text-xs font-medium uppercase tracking-widest">Rest Day</p>
                        </div>
                    )}
                </div>
            </div>

            <Link
                href="/routines"
                className="mt-8 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors group/link"
            >
                View Weekly Plan
                <ChevronRight className="h-3 w-3 transition-transform group-hover/link:translate-x-1" />
            </Link>

            {/* Subtle Background Glow Effect */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 blur-[80px] pointer-events-none" />
        </Card>
    )
}
