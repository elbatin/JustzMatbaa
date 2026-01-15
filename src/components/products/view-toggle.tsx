'use client'

import { Grid3X3, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ViewToggleProps {
  view: 'grid' | 'list'
  onViewChange: (view: 'grid' | 'list') => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 border rounded-lg p-1">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'h-8 w-8 p-0',
          view === 'grid' && 'bg-muted'
        )}
        onClick={() => onViewChange('grid')}
      >
        <Grid3X3 className="h-4 w-4" />
        <span className="sr-only">Grid görünümü</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'h-8 w-8 p-0',
          view === 'list' && 'bg-muted'
        )}
        onClick={() => onViewChange('list')}
      >
        <List className="h-4 w-4" />
        <span className="sr-only">Liste görünümü</span>
      </Button>
    </div>
  )
}
