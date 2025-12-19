import { SkeletonCard, SkeletonList } from '@/components/shared/skeleton'

export default function CommunityWorkoutLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        <div className="h-10 w-64 bg-muted rounded animate-pulse" />
        <div className="h-4 w-48 bg-muted rounded animate-pulse" />
      </div>
      
      <SkeletonCard />
      
      <div className="space-y-4">
        <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        <SkeletonList items={3} />
      </div>
    </div>
  )
}

