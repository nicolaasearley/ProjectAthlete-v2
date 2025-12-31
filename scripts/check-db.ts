import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkExercises() {
    const { data, error } = await supabase.from('exercises').select('*')
    if (error) {
        console.error('Error fetching exercises:', error)
        return
    }

    console.log(`Found ${data.length} exercises`)

    data.forEach(e => {
        if (!['squat', 'hinge', 'push', 'pull', 'carry', 'core', 'olympic', 'cardio', 'other'].includes(e.category)) {
            console.warn(`Exercise ${e.id} (${e.name}) has invalid category: ${e.category}`)
        }
        if (!e.default_metric) {
            console.warn(`Exercise ${e.id} (${e.name}) has missing default_metric`)
        }
    })
}

checkExercises()
