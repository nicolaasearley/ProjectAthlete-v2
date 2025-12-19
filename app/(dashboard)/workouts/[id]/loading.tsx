import { SkeletonCard, SkeletonList } from '@/components/shared/skeleton'

export default function WorkoutLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="h-10 w-48 bg-muted rounded animate-pulse" />
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
      </div>
      <SkeletonCard />
      <div className="space-y-4 pt-4">
        <div className="h-6 w-24 bg-muted rounded animate-pulse" />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}

