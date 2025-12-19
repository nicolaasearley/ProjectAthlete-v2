import { SkeletonList } from '@/components/shared/skeleton'

export default function WorkoutsLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-9 w-32 bg-muted/50 rounded-lg animate-pulse" />
          <div className="h-4 w-48 bg-muted/50 rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-muted/50 rounded-lg animate-pulse" />
      </div>

      <div className="space-y-4">
        <div className="h-8 w-24 bg-muted/50 rounded-lg animate-pulse" />
        <SkeletonList items={5} />
      </div>
    </div>
  )
}

