'use client'

import { WeeklyRoutine, RoutineDay } from '@/types/database'
import { RoutineDayCard } from './routine-day-card'

// Define the full structure used by the front-end
interface ExtendedRoutine extends WeeklyRoutine {
    routine_days: (RoutineDay & {
        routine_blocks: any[] // Using any for simplicity here or import ExtendedRoutineBlock
    })[]
}

interface RoutineOverviewProps {
    routine: ExtendedRoutine
}

export function RoutineOverview({ routine }: RoutineOverviewProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold font-heading">{routine.name || 'Weekly Routine'}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
                {/* We assume data is sorted 0-6 (Sun-Sat) or we can map DAYS explicitly to be safe */}
                {[0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
                    const dayData = routine.routine_days.find(d => d.day_of_week === dayIndex)
                    if (!dayData) return null // Should ideally have all days created

                    return (
                        <RoutineDayCard key={dayIndex} day={dayData} />
                    )
                })}
            </div>
        </div>
    )
}
