'use client'

import { MUSCLE_GROUPS } from '@/types/database'
import { cn } from '@/lib/utils'

interface MuscleGroupSelectorProps {
    selectedValues: string[]
    onChange: (values: string[]) => void
    className?: string
}

export function MuscleGroupSelector({ selectedValues, onChange, className }: MuscleGroupSelectorProps) {
    const toggleValue = (val: string) => {
        if (selectedValues.includes(val)) {
            onChange(selectedValues.filter(v => v !== val))
        } else {
            onChange([...selectedValues, val])
        }
    }

    return (
        <div className={cn("flex flex-wrap gap-2", className)}>
            {MUSCLE_GROUPS.map((group) => {
                const isSelected = selectedValues.includes(group.value)
                return (
                    <button
                        key={group.value}
                        onClick={() => toggleValue(group.value)}
                        className={cn(
                            "rounded-full border px-3 py-1 text-xs transition-all",
                            isSelected
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                                : "border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:border-neutral-700"
                        )}
                    >
                        {group.label}
                    </button>
                )
            })}
        </div>
    )
}
