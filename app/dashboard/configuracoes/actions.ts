'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getSettings() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase.from('settings').select('*').eq('user_id', user.id).single()
    return data
}

export async function saveSettings(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const waba_token = formData.get('waba_token') as string
    const waba_phone_id = formData.get('waba_phone_id') as string
    const mp_token = formData.get('mp_token') as string

    const { error } = await supabase.from('settings').upsert({
        user_id: user.id,
        waba_access_token: waba_token,
        waba_phone_id: waba_phone_id,
        mp_access_token: mp_token,
        updated_at: new Date().toISOString()
    })

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/configuracoes')
}
