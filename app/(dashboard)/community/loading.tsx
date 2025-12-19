import { SkeletonCard } from '@/components/shared/skeleton'

export default function CommunityLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-9 w-32 bg-muted/50 rounded-lg animate-pulse" />
          <div className="h-4 w-48 bg-muted/50 rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-40 bg-muted/50 rounded-lg animate-pulse" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}

