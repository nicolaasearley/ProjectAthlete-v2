import { SkeletonCard, SkeletonStats, SkeletonList } from '@/components/shared/skeleton'

export default function ExerciseDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-10 w-64 bg-muted rounded animate-pulse" />
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SkeletonStats />
        <SkeletonStats />
        <SkeletonStats />
        <SkeletonStats />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-6 w-40 bg-muted rounded animate-pulse" />
          <SkeletonList items={5} />
        </div>
        <div className="space-y-4">
          <div className="h-6 w-40 bg-muted rounded animate-pulse" />
          <SkeletonList items={5} />
        </div>
      </div>
    </div>
  )
}

