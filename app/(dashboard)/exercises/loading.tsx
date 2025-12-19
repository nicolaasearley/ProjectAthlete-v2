import { SkeletonCard } from '@/components/shared/skeleton'

export default function ExercisesLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-9 w-32 bg-muted/50 rounded-lg animate-pulse" />
          <div className="h-4 w-48 bg-muted/50 rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="h-10 w-full sm:w-64 bg-muted/50 rounded-lg animate-pulse" />
        <div className="h-10 w-full sm:w-48 bg-muted/50 rounded-lg animate-pulse" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}

