'use client'

import { useState, useTransition } from 'react'
import { Exercise } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Loader2, Settings2, Sparkles, Check, AlertCircle } from 'lucide-react'
import { updateExerciseMetadata } from '@/app/admin/actions'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface EditExerciseDialogProps {
    exercise: Exercise
}

export function EditExerciseDialog({ exercise }: EditExerciseDialogProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        const formData = new FormData(e.currentTarget)

        const updates = {
            description: formData.get('description') as string,
            primary_muscle_group: formData.get('primary_muscle_group') as string,
            secondary_muscle_groups: (formData.get('secondary_muscle_groups') as string)
                .split(',')
                .map(s => s.trim())
                .filter(Boolean),
            demo_url: formData.get('demo_url') as string,
        }

        startTransition(async () => {
            try {
                await updateExerciseMetadata(exercise.id, updates)
                setIsSuccess(true)
                router.refresh()
                setTimeout(() => {
                    setIsSuccess(false)
                    setOpen(false)
                }, 1000)
            } catch (err: any) {
                console.error(err)
                setError(err.message || 'Failed to update exercise')
            }
        })
    }

    if (!open) {
        return (
            <Button
                onClick={() => setOpen(true)}
                variant="ghost"
                size="icon"
                className="rounded-2xl hover:bg-blue-500/10 hover:text-blue-400 group/btn"
            >
                <Settings2 className="h-4 w-4 text-foreground/20 group-hover/btn:rotate-90 transition-transform" />
            </Button>
        )
    }

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <Card premium className="w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200">
                <CardHeader className="p-6 border-b border-border/50 bg-foreground/[0.02]">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold tracking-tight">Tuning: {exercise.name}</CardTitle>
                            <p className="text-[10px] text-foreground/40 font-black uppercase tracking-widest mt-1">Movement Metadata</p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setOpen(false)}
                            className="rounded-full"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 px-1">Technique Cues (Description)</label>
                            <Textarea
                                name="description"
                                defaultValue={exercise.description || ''}
                                placeholder="technical instructions..."
                                className="min-h-[100px] rounded-2xl bg-foreground/[0.02] border-foreground/5"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 px-1">Primary Muscle</label>
                                <Input
                                    name="primary_muscle_group"
                                    defaultValue={exercise.primary_muscle_group || ''}
                                    placeholder="e.g. Quads"
                                    className="rounded-2xl bg-foreground/[0.02] border-foreground/5"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 px-1">Secondary (csv)</label>
                                <Input
                                    name="secondary_muscle_groups"
                                    defaultValue={exercise.secondary_muscle_groups?.join(', ') || ''}
                                    placeholder="Glutes, Core..."
                                    className="rounded-2xl bg-foreground/[0.02] border-foreground/5"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 px-1">Demo URL (GIF/Image)</label>
                            <Input
                                name="demo_url"
                                defaultValue={exercise.demo_url || ''}
                                placeholder="https://..."
                                className="rounded-2xl bg-foreground/[0.02] border-foreground/5"
                            />
                        </div>

                        {error && (
                            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="flex gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="flex-1 h-12 rounded-2xl"
                            >
                                Discard
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending || isSuccess}
                                className={cn(
                                    "flex-1 h-12 rounded-2xl gap-2 transition-all duration-300",
                                    isSuccess ? "bg-emerald-500 hover:bg-emerald-500 scale-95" : "bg-blue-600 hover:bg-blue-500"
                                )}
                            >
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : isSuccess ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Sparkles className="h-4 w-4" />
                                )}
                                {isSuccess ? 'Updated' : 'Save Tuning'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
