'use client'

import { useState, useTransition } from 'react'
import { ExtendedRoutineBlock } from './routine-block-card'
import { BlockTypeSelector } from './block-type-selector'
import { MainLiftSelector } from './main-lift-selector'
import { MuscleGroupSelector } from './muscle-group-selector'
import { updateRoutineBlock, deleteRoutineBlock, updateBlockConfigs } from '@/app/routines/actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, Save, X, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BlockEditorProps {
    block: ExtendedRoutineBlock
    onDelete?: () => void
}

export function BlockEditor({ block, onDelete }: BlockEditorProps) {
    const [isPending, startTransition] = useTransition()
    const [isEditing, setIsEditing] = useState(false)
    const [blockType, setBlockType] = useState(block.block_type)
    const [notes, setNotes] = useState(block.notes || '')

    // Parse initial configs
    const initialMainLifts = block.routine_block_configs
        .filter(c => c.config_type === 'main_lift_type')
        .map(c => c.value)

    const initialMuscleGroups = block.routine_block_configs
        .filter(c => c.config_type === 'muscle_group')
        .map(c => c.value)

    const [mainLifts, setMainLifts] = useState<string[]>(initialMainLifts)
    const [muscleGroups, setMuscleGroups] = useState<string[]>(initialMuscleGroups)

    const handleSave = () => {
        startTransition(async () => {
            // 1. Update Block Details
            if (blockType !== block.block_type || notes !== block.notes) {
                await updateRoutineBlock(block.id, {
                    block_type: blockType,
                    notes: notes
                })
            }

            // 2. Update Configs if relevant
            const newConfigs = []

            if (blockType === 'main_lift') {
                newConfigs.push(...mainLifts.map(v => ({ config_type: 'main_lift_type' as const, value: v })))
            } else if (blockType === 'accessory') {
                newConfigs.push(...muscleGroups.map(v => ({ config_type: 'muscle_group' as const, value: v })))
            }

            // Always update configs to sync state (clearing old ones if type changed)
            await updateBlockConfigs(block.id, newConfigs)

            setIsEditing(false)
        })
    }

    const handleDelete = () => {
        if (!confirm('Are you sure you want to delete this block?')) return
        startTransition(async () => {
            await deleteRoutineBlock(block.id)
            onDelete?.()
        })
    }

    if (!isEditing) {
        // Read-only preview (clickable to edit)
        return (
            <div
                onClick={() => setIsEditing(true)}
                className="group relative cursor-pointer opacity-90 transition-all hover:opacity-100"
            >
                {/* Reuse the display card logic or component, but wrap it */}
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-3 hover:border-neutral-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="font-semibold text-sm capitalize">{block.block_type.replace('_', ' ')}</span>
                            {(block.block_type === 'main_lift' && mainLifts.length > 0) && (
                                <div className="text-xs text-blue-400 mt-1">{mainLifts.join(', ')}</div>
                            )}
                            {(block.block_type === 'accessory' && muscleGroups.length > 0) && (
                                <div className="text-xs text-emerald-400 mt-1">{muscleGroups.join(', ')}</div>
                            )}
                        </div>
                        {/* Show notes preview if any */}
                        {notes && <div className="text-xs text-neutral-500 max-w-[50%] truncate">{notes}</div>}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-neutral-700 bg-neutral-900/80 p-4 space-y-4 shadow-xl">
            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-neutral-400">Block Type</label>
                <BlockTypeSelector value={blockType} onChange={(val) => setBlockType(val as ExtendedRoutineBlock['block_type'])} />
            </div>

            {blockType === 'main_lift' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-semibold uppercase text-neutral-400">Lift Type</label>
                    <MainLiftSelector selectedValues={mainLifts} onChange={setMainLifts} />
                </div>
            )}

            {blockType === 'accessory' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-semibold uppercase text-neutral-400">Muscle Groups</label>
                    <MuscleGroupSelector selectedValues={muscleGroups} onChange={setMuscleGroups} />
                </div>
            )}

            <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-neutral-400">Notes</label>
                <Textarea
                    value={notes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                    placeholder="Reps, schemes, specific exercises..."
                    className="min-h-[80px] bg-neutral-950/50"
                />
            </div>

            <div className="flex items-center justify-between pt-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                </Button>

                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isPending}
                        className="bg-blue-600 hover:bg-blue-500 text-white"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    )
}
