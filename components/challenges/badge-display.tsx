import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Badge, UserBadge } from '@/types/database'

interface BadgeWithMeta extends UserBadge {
  badges: Badge
  challenges?: {
    name: string
    badge_image_url: string | null
  } | null
}

interface BadgeDisplayProps {
  badges: BadgeWithMeta[]
}

export function BadgeDisplay({ badges }: BadgeDisplayProps) {
  if (badges.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>No badges earned yet. Complete challenges to win badges!</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements ({badges.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {badges.map((ub) => {
            const isCustom = !!ub.challenges?.badge_image_url
            const icon = ub.challenges?.badge_image_url || ub.badges.icon
            const name = ub.challenges?.name || ub.badges.name

            return (
              <div
                key={ub.id}
                className="flex flex-col items-center text-center p-4 rounded-xl bg-accent/30 border border-border/50 hover:bg-accent/50 transition-colors"
                title={ub.badges.description || ''}
              >
                <div className="h-12 w-12 flex items-center justify-center mb-2">
                  {isCustom ? (
                    <img src={icon} alt={name} className="h-full w-full object-contain" />
                  ) : (
                    <span className="text-4xl">{icon}</span>
                  )}
                </div>
                <p className="text-xs font-bold line-clamp-1">{name}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {new Date(ub.awarded_at).toLocaleDateString()}
                </p>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

