import { getClients } from '../clientes/actions'
import { getProducts } from '../produtos/actions'
import { ChargeClientPage } from './charge-client-page'
import { Card, CardContent } from '@/components/ui/card'

export default async function NovaCobrancaPage() {
    // Parallel fetch
    const [clients, products] = await Promise.all([
        getClients(),
        getProducts()
    ])

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Nova Cobrança</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Preencha os dados abaixo para gerar uma nova cobrança.</p>
            </div>

            <Card className="border-0 shadow-sm bg-white dark:bg-[#202c33] overflow-hidden">
                <CardContent className="p-6 md:p-8">
                    <ChargeClientPage clients={clients || []} products={products || []} />
                </CardContent>
            </Card>
        </div>
    )
}
