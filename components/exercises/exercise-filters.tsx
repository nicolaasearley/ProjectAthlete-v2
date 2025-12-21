'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X, Loader2 } from 'lucide-react'
import { useState, useTransition, useCallback, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ExerciseFiltersProps {
  categories: { value: string; label: string }[]
  currentCategory?: string
  currentSearch?: string
  currentFavorites?: boolean
}

// Category color mapping for filter pills - Using ACTUAL categories from database
const CATEGORY_COLORS: Record<string, string> = {
  squat: 'data-[active=true]:bg-blue-500/20 data-[active=true]:border-blue-500/30 data-[active=true]:text-blue-400',
  hinge: 'data-[active=true]:bg-amber-500/20 data-[active=true]:border-amber-500/30 data-[active=true]:text-amber-400',
  push: 'data-[active=true]:bg-red-500/20 data-[active=true]:border-red-500/30 data-[active=true]:text-red-400',
  pull: 'data-[active=true]:bg-emerald-500/20 data-[active=true]:border-emerald-500/30 data-[active=true]:text-emerald-400',
  carry: 'data-[active=true]:bg-purple-500/20 data-[active=true]:border-purple-500/30 data-[active=true]:text-purple-400',
  core: 'data-[active=true]:bg-cyan-500/20 data-[active=true]:border-cyan-500/30 data-[active=true]:text-cyan-400',
  olympic: 'data-[active=true]:bg-yellow-500/20 data-[active=true]:border-yellow-500/30 data-[active=true]:text-yellow-400',
  cardio: 'data-[active=true]:bg-rose-500/20 data-[active=true]:border-rose-500/30 data-[active=true]:text-rose-400',
  other: 'data-[active=true]:bg-slate-400/20 data-[active=true]:border-slate-400/30 data-[active=true]:text-slate-400',
}

export function ExerciseFilters({ 
  categories, 
  currentCategory,
  currentSearch,
  currentFavorites = false
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

  const handleFavoritesToggle = () => {
    startTransition(() => {
      router.push(pathname + '?' + createQueryString('favorites', currentFavorites ? '' : 'true'))
    })
  }
  
  const clearSearch = () => {
    setSearchValue('')
    startTransition(() => {
      router.push(pathname + '?' + createQueryString('search', ''))
    })
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin text-foreground/20" />
            ) : (
              <Search className="h-5 w-5 text-foreground/20" />
            )}
          </div>
          <input
            placeholder="Search exercises..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full h-14 rounded-2xl bg-foreground/[0.03] border border-foreground/10 pl-12 pr-12 text-base font-medium placeholder:text-foreground/20 focus:outline-none focus:border-foreground/20 focus:bg-foreground/[0.05] transition-all"
          />
          {searchValue && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-foreground/5 flex items-center justify-center hover:bg-foreground/10 transition-colors"
            >
              <X className="h-4 w-4 text-foreground/40" />
            </button>
          )}
        </div>

        {/* Favorites Toggle */}
        <button
          onClick={handleFavoritesToggle}
          disabled={isPending}
          data-active={currentFavorites}
          className={cn(
            "h-14 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2",
            "bg-foreground/[0.03] border-foreground/10 text-foreground/40 hover:bg-foreground/[0.08] hover:text-foreground/70",
            "data-[active=true]:bg-red-500/10 data-[active=true]:text-red-400 data-[active=true]:border-red-500/30"
          )}
        >
          <div className={cn(
            "h-2 w-2 rounded-full transition-all",
            currentFavorites ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-foreground/20"
          )} />
          Favorites
        </button>
      </div>
      
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange('all')}
          disabled={isPending}
          data-active={(!currentCategory || currentCategory === 'all') && !currentFavorites}
          className={cn(
            "h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
            "bg-foreground/[0.03] border-foreground/10 text-foreground/40 hover:bg-foreground/[0.08] hover:text-foreground/70",
            "data-[active=true]:bg-foreground data-[active=true]:text-background data-[active=true]:border-foreground"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            disabled={isPending}
            data-active={currentCategory === cat.value}
            className={cn(
              "h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
              "bg-foreground/[0.03] border-foreground/10 text-foreground/40 hover:bg-foreground/[0.08] hover:text-foreground/70",
              CATEGORY_COLORS[cat.value] || "data-[active=true]:bg-foreground/10 data-[active=true]:border-foreground/20 data-[active=true]:text-foreground"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}

