'use client'

import { BLOCK_TYPES } from '@/types/database'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BlockTypeSelectorProps {
    value: string
    onChange: (value: string) => void
    className?: string
}

export function BlockTypeSelector({ value, onChange, className }: BlockTypeSelectorProps) {
    return (
        <div className={cn("grid grid-cols-2 gap-2 sm:grid-cols-3", className)}>
            {BLOCK_TYPES.map((type) => {
                const isSelected = value === type.value
                return (
                    <button
                        key={type.value}
                        onClick={() => onChange(type.value)}
                        className={cn(
                            "flex items-center justify-between rounded-lg border p-3 text-sm transition-all hover:bg-neutral-800/50",
                            isSelected
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-neutral-800 bg-neutral-900/50 text-neutral-400"
                        )}
                    >
                        <span>{type.label}</span>
                        {isSelected && <Check className="h-4 w-4" />}
                    </button>
                )
            })}
        </div>
    )
}
