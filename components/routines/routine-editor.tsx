'use client'

import { WeeklyRoutine, RoutineDay } from '@/types/database'
import { DayEditor } from './day-editor'

// Define the full structure
interface ExtendedRoutine extends WeeklyRoutine {
    routine_days: (RoutineDay & {
        routine_blocks: any[]
    })[]
}

interface RoutineEditorProps {
    routine: ExtendedRoutine
}

export function RoutineEditor({ routine }: RoutineEditorProps) {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
                    const dayData = routine.routine_days.find(d => d.day_of_week === dayIndex)
                    if (!dayData) return null

                    return (
                        <div key={dayIndex} className="h-full">
                            <DayEditor day={dayData} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
