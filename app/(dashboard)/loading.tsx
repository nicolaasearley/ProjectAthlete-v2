import { SkeletonStats, SkeletonCard } from '@/components/shared/skeleton'

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <div className="h-9 w-48 bg-muted/50 rounded-lg animate-pulse" />
        <div className="h-4 w-64 bg-muted/50 rounded-lg animate-pulse" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SkeletonStats />
        <SkeletonStats />
        <SkeletonStats />
        <SkeletonStats />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-7 w-32 bg-muted/50 rounded-lg animate-pulse" />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="space-y-4">
          <div className="h-7 w-32 bg-muted/50 rounded-lg animate-pulse" />
          <div className="space-y-4">
            <div className="h-16 w-full bg-muted/50 rounded-lg animate-pulse" />
            <div className="h-16 w-full bg-muted/50 rounded-lg animate-pulse" />
            <div className="h-16 w-full bg-muted/50 rounded-lg animate-pulse" />
            <div className="h-16 w-full bg-muted/50 rounded-lg animate-pulse" />
            <div className="h-16 w-full bg-muted/50 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

