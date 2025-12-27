'use client'

import { MAIN_LIFT_TYPES } from '@/types/database'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MainLiftSelectorProps {
    selectedValues: string[] // Array of strings (e.g. ['squat', 'bench'])
    onChange: (values: string[]) => void
    className?: string
}

export function MainLiftSelector({ selectedValues, onChange, className }: MainLiftSelectorProps) {
    const toggleValue = (val: string) => {
        if (selectedValues.includes(val)) {
            onChange(selectedValues.filter(v => v !== val))
        } else {
            onChange([...selectedValues, val])
        }
    }

    return (
        <div className={cn("grid grid-cols-2 gap-2", className)}>
            {MAIN_LIFT_TYPES.map((type) => {
                const isSelected = selectedValues.includes(type.value)
                return (
                    <button
                        key={type.value}
                        onClick={() => toggleValue(type.value)}
                        className={cn(
                            "flex items-center justify-center gap-2 rounded-lg border p-2 text-sm transition-all hover:bg-neutral-800/50",
                            isSelected
                                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                                : "border-neutral-800 bg-neutral-900/50 text-neutral-400"
                        )}
                    >
                        <span>{type.label}</span>
                        {isSelected && <Check className="h-3 w-3" />}
                    </button>
                )
            })}
        </div>
    )
}
