import { Suspense } from 'react'
import { getWeeklyRoutine, createWeeklyRoutine } from '@/app/routines/actions'
import { RoutineOverview } from '@/components/routines/routine-overview'
import { Button } from '@/components/ui/button'
import { Plus, Pencil } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function RoutinesPage() {
    const routine = await getWeeklyRoutine()

    async function handleCreate() {
        'use server'
        await createWeeklyRoutine()
    }

    if (!routine) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <h1 className="text-3xl font-bold">Weekly Routine</h1>
                <p className="text-muted-foreground text-center max-w-md">
                    Plan your training week with granular blocks for Warm Ups, Main Lifts, Accessories, and more.
                </p>
                <form action={handleCreate}>
                    <Button size="lg" className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your Routine
                    </Button>
                </form>
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Weekly Routine</h1>
                <Link href="/routines/edit">
                    <Button variant="outline">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Routine
                    </Button>
                </Link>
            </div>

            <RoutineOverview routine={routine as any} />
        </div>
    )
}
