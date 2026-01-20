import { z } from 'zod'

export const chargeSchema = z.object({
    client_id: z.string().min(1, 'Selecione um cliente'),
    product_id: z.string().optional(), // Can be empty if custom? User requirement: "2. Select Produto (dropdown)" - implies selection but maybe optional? 
    // "3. Nome do Item (input editável - valor vem do produto)" -> imply we can edit or create custom. 
    // But logic says "3. SALVAR NO BANCO (SNAPSHOT)".
    // Let's assume product_id is optional but fields are required.

    snapshot_product_name: z.string().min(1, 'Nome do produto obrigatório'),
    snapshot_price: z.coerce.number().min(0.01, 'Valor deve ser positivo'),
    snapshot_image_url: z.string().url().optional().or(z.literal('')),
    snapshot_product_description: z.string().optional(),

    template_type: z.enum(['simple', 'detailed']),
    scheduled_at: z.string().optional(), // ISO string from date picker
})

export type ChargeFormData = z.infer<typeof chargeSchema>
