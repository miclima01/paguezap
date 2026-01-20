import { z } from 'zod'

export const productSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    price: z.coerce.number().min(0.01, 'Preço deve ser maior que zero'),
    image_url: z.string().url('URL de imagem inválida').optional().or(z.literal('')),
    description_short: z.string().max(150, 'Descrição máxima de 150 caracteres').optional(),
})

export type ProductFormData = z.input<typeof productSchema>
