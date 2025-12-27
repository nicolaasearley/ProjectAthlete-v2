import { getWeeklyRoutine } from '@/app/routines/actions'
import { RoutineEditor } from '@/components/routines/routine-editor'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditRoutinePage() {
    const routine = await getWeeklyRoutine()

    if (!routine) {
        redirect('/routines')
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-4">
                <Link href="/routines">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Routine</h1>
                    <p className="text-sm text-muted-foreground">Manage your weekly training structure</p>
                </div>
            </div>

            <RoutineEditor routine={routine as any} />
        </div>
    )
}
