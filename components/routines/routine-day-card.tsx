'use client'

import { RoutineDay } from '@/types/database'
import { ExtendedRoutineBlock, RoutineBlockCard } from './routine-block-card'
import { cn } from '@/lib/utils'

interface ExtendedRoutineDay extends RoutineDay {
    routine_blocks: ExtendedRoutineBlock[]
}

interface RoutineDayCardProps {
    day: ExtendedRoutineDay
    className?: string
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function RoutineDayCard({ day, className }: RoutineDayCardProps) {
    const dayName = DAYS[day.day_of_week]
    const isToday = new Date().getDay() === day.day_of_week
    const hasBlocks = day.routine_blocks && day.routine_blocks.length > 0

    return (
        <div className={cn("flex flex-col h-full rounded-xl border bg-card text-card-foreground shadow-sm",
            isToday ? "border-primary/50 ring-1 ring-primary/20" : "border-border",
            className
        )}>
            <div className="p-4 border-b border-border/50">
                <h3 className={cn("font-semibold leading-none tracking-tight",
                    isToday ? "text-primary" : ""
                )}>{dayName}</h3>
                {day.notes && <p className="text-xs text-muted-foreground mt-1">{day.notes}</p>}
            </div>

            <div className="p-3 flex flex-col gap-2 flex-grow overflow-y-auto min-h-[120px]">
                {!hasBlocks && (
                    <div className="h-full flex items-center justify-center text-xs text-muted-foreground italic opacity-50">
                        Rest / No Plan
                    </div>
                )}
                {hasBlocks && day.routine_blocks.map(block => (
                    <RoutineBlockCard key={block.id} block={block} />
                ))}
            </div>
        </div>
    )
}
