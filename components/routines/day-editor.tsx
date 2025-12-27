'use client'

import { useState, useTransition } from 'react'
import { RoutineDay } from '@/types/database'
import { ExtendedRoutineBlock } from './routine-block-card'
import { BlockEditor } from './block-editor'
import { addRoutineBlock, upsertRoutineDay } from '@/app/routines/actions'
import { Button } from '@/components/ui/button'
import { Plus, Coffee, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExtendedRoutineDay extends RoutineDay {
    routine_blocks: ExtendedRoutineBlock[]
}

interface DayEditorProps {
    day: ExtendedRoutineDay
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function DayEditor({ day }: DayEditorProps) {
    const [isPending, startTransition] = useTransition()

    const handleAddBlock = (type: string = 'warm_up') => {
        startTransition(async () => {
            // Find next order index
            const maxOrder = day.routine_blocks.reduce((max, b) => Math.max(max, b.order_index), -1)
            await addRoutineBlock(day.id, type, maxOrder + 1)
        })
    }

    const dayName = DAYS[day.day_of_week]
    const isToday = new Date().getDay() === day.day_of_week

    return (
        <div className={cn(
            "flex flex-col h-full rounded-xl border bg-card text-card-foreground shadow-sm transition-all",
            isToday ? "border-primary/50 ring-1 ring-primary/20" : "border-border"
        )}>
            <div className="p-4 border-b border-border/50 flex justify-between items-center bg-muted/20">
                <div>
                    <h3 className={cn("font-semibold leading-none tracking-tight",
                        isToday ? "text-primary" : ""
                    )}>{dayName}</h3>
                </div>
                {/* Could add day-level notes editor here later */}
            </div>

            <div className="p-3 flex flex-col gap-3 flex-grow min-h-[200px]">
                {day.routine_blocks.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-8 text-center opacity-50 border border-dashed border-neutral-800 rounded-lg">
                        <Coffee className="h-8 w-8 mb-2" />
                        <p className="text-sm">Rest Day</p>
                    </div>
                )}

                {day.routine_blocks.map(block => (
                    <BlockEditor key={block.id} block={block} />
                ))}

                <div className="pt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-dashed border-neutral-700 bg-neutral-900/50 hover:bg-neutral-800 hover:border-neutral-600 text-neutral-400"
                        onClick={() => handleAddBlock('warm_up')} // Default to warm_up, user changes it immediately
                        disabled={isPending}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Block
                    </Button>
                </div>
            </div>
        </div>
    )
}
