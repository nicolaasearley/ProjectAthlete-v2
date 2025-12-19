'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Copy, Trash2, Loader2, Plus } from 'lucide-react'
import { deleteTemplate } from '@/app/workouts/templates/actions'
import { cn } from '@/lib/utils'

interface TemplatePickerProps {
  templates: any[]
  onSelect: (template: any) => void
}

export function TemplatePicker({ templates, onSelect }: TemplatePickerProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this template?')) return
    
    setIsDeleting(id)
    startTransition(async () => {
      try {
        await deleteTemplate(id)
      } catch (error) {
        console.error('Failed to delete template:', error)
      } finally {
        setIsDeleting(null)
      }
    })
  }

  if (templates.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Copy className="h-4 w-4 text-muted-foreground" />
        Quick Start from Template
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className="cursor-pointer hover:border-primary/50 transition-all group relative"
            onClick={() => onSelect(template)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-sm">{template.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {template.template_exercises?.length || 0} exercises
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDelete(template.id, e)}
                  disabled={isDeleting === template.id}
                >
                  {isDeleting === template.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

