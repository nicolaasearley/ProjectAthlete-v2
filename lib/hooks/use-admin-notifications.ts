import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useAdminNotifications(isAdmin: boolean, orgId?: string) {
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    if (!isAdmin || !orgId) return

    const supabase = createClient()

    // Fetch initial count
    const fetchCount = async () => {
      const { count } = await supabase
        .from('community_workouts')
        .select('*', { count: 'exact', head: true })
        .eq('org_id', orgId)
        .eq('status', 'pending')
      
      setPendingCount(count || 0)
    }

    fetchCount()

    // Subscribe to changes
    const channel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_workouts',
          filter: `org_id=eq.${orgId}`,
        },
        () => {
          // Re-fetch count on any change to stay accurate
          fetchCount()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [isAdmin, orgId])

  return { pendingCount }
}

