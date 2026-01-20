'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { ChargeFormData, chargeSchema } from './schema'
import { randomUUID } from 'crypto'

export async function createCharge(data: ChargeFormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const parsed = chargeSchema.parse(data)

    // 1. Get Client Details for email/name
    const { data: client } = await supabase.from('clients').select('*').eq('id', parsed.client_id).single()
    if (!client) throw new Error('Client not found')

    // Get Settings
    const { data: settings } = await supabase.from('settings').select('*').eq('user_id', user.id).single()

    const MP_ACCESS_TOKEN = settings?.mp_access_token
    const WABA_ACCESS_TOKEN = settings?.waba_access_token
    const WABA_PHONE_ID = settings?.waba_phone_id

    // Generate unique ref ahead of time
    const external_reference = randomUUID()

    let paymentData: any = {
        point_of_interaction: {
            transaction_data: {
                ticket_url: 'https://mock.link',
                qr_code: 'mock_qr_code'
            }
        },
        external_reference: external_reference
    }

    // 2. CREATE PAYMENT IN MERCADO PAGO (Only if token exists, else mock)
    if (MP_ACCESS_TOKEN) {
        const mpRes = await fetch('https://api.mercadopago.com/v1/payments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'X-Idempotency-Key': external_reference
            },
            body: JSON.stringify({
                transaction_amount: parsed.snapshot_price,
                description: parsed.snapshot_product_name,
                payment_method_id: 'pix',
                payer: {
                    email: client.email || 'customer@email.com',
                    first_name: client.name.split(' ')[0],
                    last_name: client.name.split(' ').slice(1).join(' '),
                },
                external_reference: external_reference,
                notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`
            })
        })

        if (!mpRes.ok) {
            const err = await mpRes.text()
            console.error('MP Error:', err)
            throw new Error('Falha ao criar pagamento no Mercado Pago: ' + err)
        }
        paymentData = await mpRes.json()
    } else {
        console.warn('MP_ACCESS_TOKEN not found. Using mock payment data.')
    }

    // 3. SAVE TO DB (SNAPSHOT)
    const { data: charge, error } = await supabase.from('charges').insert({
        client_id: parsed.client_id,
        product_id: parsed.product_id || null,
        snapshot_product_name: parsed.snapshot_product_name,
        snapshot_product_description: parsed.snapshot_product_description,
        snapshot_price: parsed.snapshot_price,
        snapshot_image_url: parsed.snapshot_image_url,
        payment_link_url: paymentData.point_of_interaction?.transaction_data?.ticket_url,
        pix_copy_paste_code: paymentData.point_of_interaction?.transaction_data?.qr_code,
        external_reference_id: paymentData.external_reference,
        status: 'PENDING',
        scheduled_at: parsed.scheduled_at || null,
    }).select().single()

    if (error) throw new Error(error.message)

    // 4. SEND WHATSAPP
    if (WABA_ACCESS_TOKEN && WABA_PHONE_ID && charge) {
        try {
            await sendWhatsAppMessage(charge, parsed.template_type, WABA_ACCESS_TOKEN, WABA_PHONE_ID, client)
        } catch (e: any) {
            console.error('WhatsApp Error:', e)
            // Don't fail the whole action if message fails, just warn? 
            // Or maybe return warning.
        }
    } else {
        console.warn('WABA credentials missing. WhatsApp message skipped.')
    }

    return { success: true, chargeId: charge?.id }
}

async function sendWhatsAppMessage(charge: any, templateType: 'simple' | 'detailed', token: string, phoneId: string, client: any) {
    const templateName = templateType === 'simple'
        ? 'paguezap_billing_simple'
        : 'paguezap_billing_detailed';

    // Format phone: remove non-digits
    const phone = client.phone.replace(/\D/g, '')

    const payload = {
        messaging_product: 'whatsapp',
        to: phone,
        type: 'template',
        template: {
            name: templateName,
            language: { code: 'pt_BR' },
            components: [
                {
                    type: 'header',
                    parameters: [
                        {
                            type: 'image',
                            image: { link: charge.snapshot_image_url }
                        }
                    ]
                },
                {
                    type: 'body',
                    parameters: templateType === 'simple'
                        ? [
                            { type: 'text', text: client.name },
                            { type: 'text', text: charge.snapshot_product_name },
                            { type: 'text', text: `R$ ${charge.snapshot_price.toFixed(2)}` },
                            { type: 'text', text: charge.payment_link_url || 'https://...' }
                        ]
                        : [
                            { type: 'text', text: client.name },
                            { type: 'text', text: charge.snapshot_product_name },
                            { type: 'text', text: charge.snapshot_product_description || ' ' },
                            { type: 'text', text: `R$ ${charge.snapshot_price.toFixed(2)}` },
                            { type: 'text', text: charge.payment_link_url || 'https://...' }
                        ]
                },
                {
                    type: 'button',
                    sub_type: 'mpm',
                    index: '0',
                    parameters: [
                        {
                            type: 'action',
                            action: {
                                name: 'review_and_pay',
                                parameters: {
                                    reference_id: charge.external_reference_id,
                                    type: 'digital-goods',
                                    payment_type: 'pix',
                                    order: {
                                        status: 'pending',
                                        items: [
                                            {
                                                name: charge.snapshot_product_name,
                                                amount: {
                                                    value: Math.round(charge.snapshot_price * 100), // Centavos, integer
                                                    offset: 100
                                                },
                                                quantity: 1
                                            }
                                        ],
                                        subtotal: {
                                            value: Math.round(charge.snapshot_price * 100),
                                            offset: 100
                                        }
                                    },
                                    payment_settings: [
                                        {
                                            type: 'pix_static_code',
                                            pix_static_code: {
                                                key_type: 'EVP',
                                                code: charge.pix_copy_paste_code || '123'
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            ]
        }
    };

    const res = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const txt = await res.text()
        throw new Error('Meta API Error: ' + txt)
    }
}
