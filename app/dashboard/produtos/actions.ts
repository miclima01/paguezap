'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { productSchema, ProductFormData } from './schema'

export async function getProducts() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data
}

export async function upsertProduct(data: ProductFormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const parsed = productSchema.parse(data)

    const payload = {
        ...parsed,
        user_id: user?.id,
        created_at: undefined, // Let DB handle default
        // If updating, we might want to keep original created_at but Supabase upsert handles this if we don't pass it? 
        // Usually we pass ID.
    }

    const { error } = await supabase
        .from('products')
        .upsert(payload)
        .select()
        .single()

    if (error) return { error: error.message }

    revalidatePath('/dashboard/produtos')
    return { success: true }
}

export async function deleteProduct(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id)

    if (error) return { error: error.message }

    revalidatePath('/dashboard/produtos')
    return { success: true }
}
