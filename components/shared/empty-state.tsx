import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  actionHref 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-border rounded-xl bg-accent/5">
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-xs mx-auto mb-6">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Button asChild>
          <Link href={actionHref}>
            {actionLabel}
          </Link>
        </Button>
      )}
    </div>
  )
}

