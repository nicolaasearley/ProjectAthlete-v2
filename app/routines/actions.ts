'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getWeeklyRoutine() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await (supabase
        .from('weekly_routines') as any)
        .select(`
      *,
      routine_days (
        *,
        routine_blocks (
          *,
          routine_block_configs (*)
        )
      )
    `)
        .eq('user_id', user.id)
        .maybeSingle()

    if (error) {
        console.error('Error fetching weekly routine:', error)
        return null
    }

    // Sort days and blocks
    if (data) {
        if (data.routine_days) {
            data.routine_days.sort((a: any, b: any) => a.day_of_week - b.day_of_week)

            data.routine_days.forEach((day: any) => {
                if (day.routine_blocks) {
                    day.routine_blocks.sort((a: any, b: any) => a.order_index - b.order_index)
                }
            })
        }
    }

    return data
}

export async function createWeeklyRoutine(name: string = 'Weekly Routine') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    // Get org_id
    const { data: profile } = await (supabase
        .from('profiles') as any)
        .select('org_id')
        .eq('id', user.id)
        .single()

    if (!profile) throw new Error('Profile not found')

    const { data, error } = await (supabase
        .from('weekly_routines') as any)
        .insert({
            user_id: user.id,
            org_id: profile.org_id,
            name
        })
        .select()
        .single()

    if (error) throw error

    // Create 7 empty days
    const days = Array.from({ length: 7 }, (_, i) => ({
        routine_id: data.id,
        day_of_week: i
    }))

    const { error: daysError } = await (supabase
        .from('routine_days') as any)
        .insert(days)

    if (daysError) throw daysError

    revalidatePath('/routines')
    return data
}

export async function upsertRoutineDay(routineId: string, dayOfWeek: number, notes: string | null) {
    const supabase = await createClient()

    const { data, error } = await (supabase
        .from('routine_days') as any)
        .upsert({
            routine_id: routineId,
            day_of_week: dayOfWeek,
            notes
        }, {
            onConflict: 'routine_id,day_of_week'
        })
        .select()
        .single()

    if (error) throw error
    revalidatePath('/routines')
    return data
}

export async function addRoutineBlock(dayId: string, blockType: string, orderIndex: number) {
    const supabase = await createClient()

    const { data, error } = await (supabase
        .from('routine_blocks') as any)
        .insert({
            day_id: dayId,
            block_type: blockType,
            order_index: orderIndex
        })
        .select()
        .single()

    if (error) throw error
    revalidatePath('/routines')
    return data
}

export async function updateRoutineBlock(blockId: string, updates: { notes?: string, block_type?: string, order_index?: number }) {
    const supabase = await createClient()

    const { data, error } = await (supabase
        .from('routine_blocks') as any)
        .update(updates)
        .eq('id', blockId)
        .select()
        .single()

    if (error) throw error
    revalidatePath('/routines')
    return data
}

export async function deleteRoutineBlock(blockId: string) {
    const supabase = await createClient()

    const { error } = await (supabase
        .from('routine_blocks') as any)
        .delete()
        .eq('id', blockId)

    if (error) throw error
    revalidatePath('/routines')
}

export async function updateBlockConfigs(blockId: string, configs: { config_type: 'main_lift_type' | 'muscle_group', value: string }[]) {
    const supabase = await createClient()

    // First delete existing configs for this block (simple replacement strategy)
    // Or simpler: delete and insert.

    // Since we might be updating just one specific config or multiple? 
    // Let's assume we want to replace all configs for this block to match the UI state.

    // Actually, usually we might have multiple values for main_lift_type (e.g. Squat AND Bench?)
    // The schema allows multiple rows per block.

    // Let's first delete all configs for this block to ensure clean state
    await (supabase.from('routine_block_configs') as any).delete().eq('block_id', blockId)

    if (configs.length > 0) {
        const { error } = await (supabase
            .from('routine_block_configs') as any)
            .insert(configs.map(c => ({
                block_id: blockId,
                config_type: c.config_type,
                value: c.value
            })))

        if (error) throw error
    }

    revalidatePath('/routines')
}

export async function reorderBlocks(dayId: string, orderedBlockIds: string[]) {
    const supabase = await createClient()

    // This could be optimized to a batch RPC call or Promise.all
    // For now, simple loop is fine for small number of blocks (<10)
    for (let i = 0; i < orderedBlockIds.length; i++) {
        await (supabase.from('routine_blocks') as any)
            .update({ order_index: i })
            .eq('id', orderedBlockIds[i])
            .eq('day_id', dayId)
    }

    revalidatePath('/routines')
}
