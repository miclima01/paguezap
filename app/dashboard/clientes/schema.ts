import { z } from 'zod'

export const clientSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    phone: z.string()
        .min(10, 'Telefone inválido')
        .transform((val) => {
            let cleaned = val.replace(/\D/g, '')
            // Auto-add 55 for Brazil if missing and length looks like DDD+Number (10 or 11 digits)
            if ((cleaned.length === 10 || cleaned.length === 11) && !cleaned.startsWith('55')) {
                cleaned = `55${cleaned}`
            }
            return cleaned
        }),
    cpf: z.string().optional().nullable().transform(val => val?.replace(/\D/g, '') || null),
    email: z.string().email('Email inválido').optional().or(z.literal('')).nullable(),
})

export type ClientFormData = z.input<typeof clientSchema>
