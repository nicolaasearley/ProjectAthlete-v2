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
}

// Category color mapping for filter pills
const CATEGORY_COLORS: Record<string, string> = {
  chest: 'data-[active=true]:bg-red-500/20 data-[active=true]:border-red-500/30 data-[active=true]:text-red-400',
  back: 'data-[active=true]:bg-blue-500/20 data-[active=true]:border-blue-500/30 data-[active=true]:text-blue-400',
  shoulders: 'data-[active=true]:bg-purple-500/20 data-[active=true]:border-purple-500/30 data-[active=true]:text-purple-400',
  arms: 'data-[active=true]:bg-emerald-500/20 data-[active=true]:border-emerald-500/30 data-[active=true]:text-emerald-400',
  legs: 'data-[active=true]:bg-amber-500/20 data-[active=true]:border-amber-500/30 data-[active=true]:text-amber-400',
  core: 'data-[active=true]:bg-cyan-500/20 data-[active=true]:border-cyan-500/30 data-[active=true]:text-cyan-400',
  cardio: 'data-[active=true]:bg-rose-500/20 data-[active=true]:border-rose-500/30 data-[active=true]:text-rose-400',
  olympic: 'data-[active=true]:bg-yellow-500/20 data-[active=true]:border-yellow-500/30 data-[active=true]:text-yellow-400',
  compound: 'data-[active=true]:bg-indigo-500/20 data-[active=true]:border-indigo-500/30 data-[active=true]:text-indigo-400',
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
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin text-white/20" />
          ) : (
            <Search className="h-5 w-5 text-white/20" />
          )}
        </div>
        <input
          placeholder="Search exercises..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="w-full h-14 rounded-2xl bg-white/[0.03] border border-white/10 pl-12 pr-12 text-base font-medium placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all"
        />
        {searchValue && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4 text-white/40" />
          </button>
        )}
      </div>
      
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryChange('all')}
          disabled={isPending}
          data-active={!currentCategory || currentCategory === 'all'}
          className={cn(
            "h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
            "bg-white/[0.03] border-white/10 text-white/40 hover:bg-white/[0.08] hover:text-white/70",
            "data-[active=true]:bg-white data-[active=true]:text-black data-[active=true]:border-white"
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
              "bg-white/[0.03] border-white/10 text-white/40 hover:bg-white/[0.08] hover:text-white/70",
              CATEGORY_COLORS[cat.value] || "data-[active=true]:bg-white/10 data-[active=true]:border-white/20 data-[active=true]:text-white"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}

