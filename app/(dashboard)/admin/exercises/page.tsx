import { createClient } from '@/lib/supabase/server'
import { Exercise } from '@/types/database'
import { Dumbbell, Search, Filter, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EditExerciseDialog } from '@/components/admin/edit-exercise-dialog'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface AdminExercisesPageProps {
    searchParams: Promise<{
        search?: string
        status?: 'missing_desc' | 'missing_media' | 'complete'
    }>
}

export default async function AdminExercisesPage({ searchParams }: AdminExercisesPageProps) {
    const params = await searchParams
    const supabase = await createClient()

    let query = supabase
        .from('exercises')
        .select('*')
        .order('name')

    if (params.search) {
        query = query.ilike('name', `%${params.search}%`)
    }

    const { data: exercises } = await query

    const filteredExercises = ((exercises as any) || []).filter((ex: any) => {
        if (params.status === 'missing_desc') return !ex.description
        if (params.status === 'missing_media') return !ex.demo_url
        if (params.status === 'complete') return ex.description && ex.demo_url
        return true
    })

    return (
        <div className="space-y-10 pb-20 page-transition">
            <div className="flex items-end justify-between px-2">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter">Exercise Management</h1>
                    <p className="text-foreground/40 font-medium uppercase tracking-[0.2em] text-[10px] mt-1">Data Population & Metadata Tuning</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-4 px-2">
                <form className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/20" />
                    <Input
                        name="search"
                        placeholder="Search movements..."
                        defaultValue={params.search}
                        className="pl-10 h-12 rounded-2xl bg-foreground/[0.02] border-foreground/5 shadow-inner"
                    />
                </form>

                <div className="flex gap-2">
                    <Link href="/admin/exercises" className="flex-1">
                        <Button variant={!params.status ? 'secondary' : 'outline'} className="w-full h-12 rounded-2xl">All</Button>
                    </Link>
                    <Link href="/admin/exercises?status=missing_desc" className="flex-1">
                        <Button variant={params.status === 'missing_desc' ? 'secondary' : 'outline'} className="w-full h-12 rounded-2xl">No Cues</Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-2 px-2">
                {filteredExercises.map((exercise: any) => (
                    <div
                        key={exercise.id}
                        className="group flex items-center justify-between p-4 rounded-3xl bg-card border border-border/50 hover:bg-foreground/[0.02] transition-all duration-300"
                    >
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-foreground/5 flex items-center justify-center border border-border group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors">
                                <Dumbbell className="h-6 w-6 text-foreground/20 group-hover:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-bold tracking-tight">{exercise.name}</h3>
                                <div className="flex gap-2 mt-1">
                                    <Badge variant="outline" className="text-[9px] uppercase tracking-widest">{exercise.category}</Badge>
                                    {exercise.description ? (
                                        <CheckCircle2 className="h-3 w-3 text-emerald-500/50" />
                                    ) : (
                                        <AlertCircle className="h-3 w-3 text-amber-500/50" />
                                    )}
                                    {exercise.demo_url ? (
                                        <CheckCircle2 className="h-3 w-3 text-emerald-500/50" />
                                    ) : (
                                        <AlertCircle className="h-3 w-3 text-blue-500/50" />
                                    )}
                                </div>
                            </div>
                        </div>

                        <EditExerciseDialog exercise={exercise} />
                    </div>
                ))}
            </div>
        </div>
    )
}
