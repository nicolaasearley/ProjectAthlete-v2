'use client'

import { cn } from '@/lib/utils'
import { RoutineBlock, RoutineBlockConfig, BLOCK_TYPES } from '@/types/database'
import { Dumbbell, Activity, Timer, Zap, Heart, StretchHorizontal, Footprints, Flame, Star, BatteryCharging } from 'lucide-react'

// Extended type to include nested configs
export interface ExtendedRoutineBlock extends RoutineBlock {
    routine_block_configs: RoutineBlockConfig[]
}

interface RoutineBlockCardProps {
    block: ExtendedRoutineBlock
    className?: string
}

const BLOCK_ICONS: Record<string, any> = {
    warm_up: Activity,
    plyometrics: Zap,
    main_lift: Dumbbell,
    accessory: Dumbbell,
    calisthenics: Activity,
    general_cardio: Heart,
    running: Footprints,
    engine_work: Timer,
    yoga_mobility: StretchHorizontal,
    hyrox: Timer,
    wod: Flame,
    skills: Star,
    recovery: BatteryCharging,
    other: Activity
}

const BLOCK_COLORS: Record<string, string> = {
    warm_up: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    plyometrics: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    main_lift: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    accessory: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    calisthenics: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
    general_cardio: "text-red-500 bg-red-500/10 border-red-500/20",
    running: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    engine_work: "text-red-600 bg-red-600/10 border-red-600/20",
    yoga_mobility: "text-green-400 bg-green-400/10 border-green-400/20",
    hyrox: "text-yellow-600 bg-yellow-600/10 border-yellow-600/20",
    wod: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    skills: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
    recovery: "text-teal-400 bg-teal-400/10 border-teal-400/20",
    other: "text-neutral-400 bg-neutral-800 border-neutral-700",
}

export function RoutineBlockCard({ block, className }: RoutineBlockCardProps) {
    const Icon = BLOCK_ICONS[block.block_type] || Activity
    const colorClass = BLOCK_COLORS[block.block_type] || BLOCK_COLORS.other
    const label = BLOCK_TYPES.find(t => t.value === block.block_type)?.label || block.block_type

    const mainLiftConfigs = block.routine_block_configs.filter(c => c.config_type === 'main_lift_type').map(c => c.value)
    const muscleConfigs = block.routine_block_configs.filter(c => c.config_type === 'muscle_group').map(c => c.value)

    return (
        <div className={cn("rounded-lg border p-3 text-sm", colorClass, className)}>
            <div className="flex items-center gap-2 font-medium mb-1">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
            </div>

            {mainLiftConfigs.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                    {mainLiftConfigs.map(v => (
                        <span key={v} className="px-1.5 py-0.5 rounded textxs bg-black/20 capitalize">{v}</span>
                    ))}
                </div>
            )}

            {muscleConfigs.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                    {muscleConfigs.map(v => (
                        <span key={v} className="px-1.5 py-0.5 rounded text-xs bg-black/20 capitalize">{v}</span>
                    ))}
                </div>
            )}

            {block.notes && (
                <div className="text-xs opacity-80 mt-2 whitespace-pre-wrap">{block.notes}</div>
            )}
        </div>
    )
}
