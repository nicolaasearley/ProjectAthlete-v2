'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X, Loader2 } from 'lucide-react'
import { useState, useTransition, useCallback, useEffect, useRef } from 'react'

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
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  
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
  
  // Live search with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    debounceRef.current = setTimeout(() => {
      if (searchValue !== (currentSearch || '')) {
        startTransition(() => {
          router.push(pathname + '?' + createQueryString('search', searchValue))
        })
      }
    }, 300)
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchValue, currentSearch, pathname, router, createQueryString])
  
  const handleCategoryChange = (category: string) => {
    startTransition(() => {
      router.push(pathname + '?' + createQueryString('category', category === 'all' ? '' : category))
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
      {/* Search - Live as you type */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search exercises..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 pr-10"
        />
        {isPending ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : searchValue ? (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      
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

