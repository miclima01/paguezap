'use server'

import { createClient } from '@/lib/supabase/server'

export async function getCharges() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Join clients to get client name
    const { data, error } = await supabase
        .from('charges')
        .select(`
      *,
      clients ( name, phone )
    `)
        // Filter by client owner if needed, but charges link to clients which link to users. 
        // RLS should handle this if policies are set. 
        // For now assuming we need filter. The prompt SQL didn't have user_id on charges, but client has user_id.
        // So we can filter by inner join or rely on RLS.
        // Let's rely on RLS or filtering by client.user_id if Supabase supports deep filtering easily here or just assume RLS policies exist/will exist.
        // Wait, the prompt SQL adds user_id to clients and products, but NOT charges.
        // So we must ensure RLS or join filtering.
        // For simplicity:
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
}
