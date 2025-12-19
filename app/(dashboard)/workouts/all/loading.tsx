import { SkeletonList } from '@/components/shared/skeleton'

export default function AllWorkoutsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-10 w-64 bg-muted rounded animate-pulse" />
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
      </div>
      <div className="space-y-4">
        <SkeletonList items={10} />
      </div>
    </div>
  )
}

