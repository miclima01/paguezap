'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { clientSchema, ClientFormData } from './schema'

export async function getClients() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
}

export async function upsertClient(data: ClientFormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const parsed = clientSchema.parse(data)

    const payload = {
        ...parsed,
        user_id: user?.id,
        updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
        .from('clients')
        .upsert(payload)
        .select()
        .single()

    if (error) return { error: error.message }

    revalidatePath('/dashboard/clientes')
    return { success: true }
}

export async function deleteClient(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

    if (error) return { error: error.message }

    revalidatePath('/dashboard/clientes')
    return { success: true }
}
