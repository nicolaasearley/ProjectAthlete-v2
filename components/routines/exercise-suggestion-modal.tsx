'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { getSuggestedExercises } from '@/app/routines/actions'
import { Exercise } from '@/types/database'
import { X, Loader2, Dumbbell, History, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ExerciseSuggestionModalProps {
    filterType: 'main_lift_type' | 'muscle_group'
    value: string
    onClose: () => void
}

export function ExerciseSuggestionModal({ filterType, value, onClose }: ExerciseSuggestionModalProps) {
    const [exercises, setExercises] = useState<Exercise[]>([])
    const [loading, setLoading] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        async function fetchExercises() {
            const data = await getSuggestedExercises(filterType, value)
            setExercises(data as Exercise[])
            setLoading(false)
        }
        fetchExercises()
    }, [filterType, value])

    if (!mounted) return null

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/90 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
                onClick={(e) => {
                    e.stopPropagation()
                    onClose()
                }}
            />

            {/* Modal Content */}
            <div
                className="relative w-full max-w-lg bg-card border border-border rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 fade-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border/50 flex items-center justify-between bg-foreground/[0.02]">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight capitalize">{value} Library</h3>
                        <p className="text-xs text-foreground/40 font-medium uppercase tracking-widest mt-1">Suggested Movements</p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation()
                            onClose()
                        }}
                        className="rounded-full hover:bg-foreground/5"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-foreground/20">
                            <Loader2 className="h-8 w-8 animate-spin mb-4" />
                            <p className="text-sm font-medium">Fetching Exercises...</p>
                        </div>
                    ) : exercises.length > 0 ? (
                        <div className="grid gap-1">
                            {exercises.map((exercise) => (
                                <div
                                    key={exercise.id}
                                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-foreground/[0.03] transition-colors group cursor-default"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                            <Dumbbell className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold tracking-tight">{exercise.name}</p>
                                            <p className="text-[10px] text-foreground/30 font-black uppercase tracking-widest mt-0.5">{exercise.category}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-foreground/20 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-foreground/20 text-center px-10">
                            <Dumbbell className="h-10 w-10 mb-4 opacity-20" />
                            <p className="text-sm font-medium">No movements found for this category.</p>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-foreground/[0.02] border-t border-border/50">
                    <Button
                        variant="outline"
                        onClick={(e) => {
                            e.stopPropagation()
                            onClose()
                        }}
                        className="w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest border-foreground/10 hover:bg-foreground/5"
                    >
                        Close Library
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    )
}
