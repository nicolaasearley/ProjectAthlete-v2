'use client'

import { User, Shield, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  src?: string | null
  name?: string | null
  role?: 'athlete' | 'coach' | 'admin' | string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function UserAvatar({ src, name, role, className, size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const badgeSizeClasses = {
    sm: 'h-3 w-3 p-0.5',
    md: 'h-4 w-4 p-0.5',
    lg: 'h-5 w-5 p-1',
  }

  const hasBadge = role === 'coach' || role === 'admin'

  return (
    <div className={cn('relative inline-block shrink-0', className)}>
      <div className={cn(
        'rounded-full bg-foreground/5 border border-foreground/10 flex items-center justify-center overflow-hidden',
        sizeClasses[size]
      )}>
        {src ? (
          <img src={src} alt={name || 'User'} className="h-full w-full object-cover" />
        ) : (
          <User className={cn('text-foreground/20', iconSizeClasses[size])} />
        )}
      </div>

      {hasBadge && (
        <div className={cn(
          'absolute -bottom-0.5 -right-0.5 rounded-full border border-background flex items-center justify-center shadow-sm',
          role === 'admin' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white',
          badgeSizeClasses[size]
        )}>
          {role === 'admin' ? (
            <ShieldAlert className="h-full w-full" />
          ) : (
            <Shield className="h-full w-full" />
          )}
        </div>
      )}
    </div>
  )
}

