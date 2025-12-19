'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Camera, Loader2, Check } from 'lucide-react'
import { updateProfile, uploadAvatar } from '@/app/profile/actions'

interface ProfileEditorProps {
  profile: {
    id: string
    display_name: string | null
    avatar_url: string | null
    role: string
  }
}

export function ProfileEditor({ profile }: ProfileEditorProps) {
  const [isPending, startTransition] = useTransition()
  const [isAvatarPending, startAvatarTransition] = useTransition()
  const [isEditingName, setIsEditingName] = useState(false)
  const [displayName, setDisplayName] = useState(profile.display_name || '')

  const handleNameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      try {
        await updateProfile(formData)
        setIsEditingName(false)
      } catch (error) {
        console.error('Failed to update name:', error)
      }
    })
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Optional: Size limit check (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File is too large. Maximum size is 2MB.')
      return
    }

    const formData = new FormData()
    formData.append('avatar', file)

    startAvatarTransition(async () => {
      try {
        await uploadAvatar(formData)
      } catch (error) {
        console.error('Failed to upload avatar:', error)
        alert('Failed to upload avatar. Please try again.')
      }
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden border-2 border-border mb-4">
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.display_name || 'User'} 
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-primary" />
            )}
            {isAvatarPending && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>
          <label 
            htmlFor="avatar-upload" 
            className="absolute bottom-4 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors border-2 border-background shadow-sm"
          >
            <Camera className="h-4 w-4" />
            <input 
              id="avatar-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleAvatarChange}
              disabled={isAvatarPending}
            />
          </label>
        </div>

        {isEditingName ? (
          <form onSubmit={handleNameSubmit} className="w-full flex flex-col items-center gap-2">
            <Input
              name="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="text-center h-10 max-w-[200px]"
              autoFocus
              required
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={isPending} className="gap-1">
                {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                Save
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setDisplayName(profile.display_name || '')
                  setIsEditingName(false)
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <CardTitle 
              className="text-2xl cursor-pointer hover:text-primary transition-colors flex items-center gap-2 group"
              onClick={() => setIsEditingName(true)}
            >
              {profile.display_name || 'User'}
              <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground capitalize">{profile.role}</p>
          </div>
        )}
      </CardHeader>
    </Card>
  )
}

