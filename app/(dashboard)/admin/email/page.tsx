'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Mail, Users, Check, AlertCircle } from 'lucide-react'
import { sendMassEmail } from '@/app/admin/actions'
import { cn } from '@/lib/utils'

const ROLE_OPTIONS = [
  { value: 'athlete', label: 'Athletes' },
  { value: 'coach', label: 'Coaches' },
  { value: 'admin', label: 'Admins' },
]

export default function AdminEmailPage() {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['athlete'])
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role))
    } else {
      setSelectedRoles([...selectedRoles, role])
    }
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedRoles.length === 0 || !subject || !body) return

    if (!confirm(`Are you sure you want to send this email to all users with the selected roles?`)) {
      return
    }

    startTransition(async () => {
      try {
        const result = await sendMassEmail(selectedRoles, subject, body)
        setStatus({ 
          type: 'success', 
          message: `Email sent successfully to ${result.count} recipients!` 
        })
        setSubject('')
        setBody('')
      } catch (error: any) {
        console.error('Failed to send mass email:', error)
        setStatus({ 
          type: 'error', 
          message: error.message || 'Failed to send email. Please try again.' 
        })
      }
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mass Email</h1>
        <p className="text-muted-foreground">Send an announcement to your organization's members.</p>
      </div>

      <form onSubmit={handleSend} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Recipients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {ROLE_OPTIONS.map((role) => {
                const isSelected = selectedRoles.includes(role.value)
                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => toggleRole(role.value)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all",
                      isSelected 
                        ? "border-primary bg-primary/10 text-primary" 
                        : "border-border hover:border-foreground/20 text-muted-foreground"
                    )}
                  >
                    {isSelected && <Check className="h-4 w-4" />}
                    <span className="text-sm font-medium">{role.label}</span>
                  </button>
                )
              })}
            </div>
            {selectedRoles.length === 0 && (
              <p className="text-xs text-destructive mt-2 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Please select at least one group.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Message Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Email Subject"
              placeholder="e.g., Important Organization Update"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Body</label>
              <textarea
                placeholder="Write your message here... (HTML supported, line breaks will be preserved)"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full h-64 rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-primary outline-none transition-all"
                required
              />
            </div>

            {status && (
              <div className={cn(
                "p-4 rounded-xl flex items-center gap-3",
                status.type === 'success' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              )}>
                {status.type === 'success' ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                <p className="text-sm font-medium">{status.message}</p>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <Button 
                type="submit" 
                size="lg"
                disabled={isPending || selectedRoles.length === 0 || !subject || !body}
                className="gap-2"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                Send Mass Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

