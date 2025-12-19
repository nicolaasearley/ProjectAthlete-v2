'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { useState, useTransition, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface ExerciseFiltersProps {
  categories: { value: string; label: string }[]
  currentCategory?: string
  currentSearch?: string
}

export function ExerciseFilters({ 
  categories, 
  currentCategory,
  currentSearch 
}: ExerciseFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(currentSearch || '')
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams]
  )
  
  const handleCategoryChange = (category: string) => {
    startTransition(() => {
      router.push(pathname + '?' + createQueryString('category', category === 'all' ? '' : category))
    })
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(() => {
      router.push(pathname + '?' + createQueryString('search', searchValue))
    })
  }
  
  const clearSearch = () => {
    setSearchValue('')
    startTransition(() => {
      router.push(pathname + '?' + createQueryString('search', ''))
    })
  }
  
  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchValue && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" disabled={isPending}>
          Search
        </Button>
      </form>
      
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={!currentCategory || currentCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleCategoryChange('all')}
          disabled={isPending}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.value}
            variant={currentCategory === cat.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange(cat.value)}
            disabled={isPending}
          >
            {cat.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

