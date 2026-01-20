import { getClients } from '../clientes/actions'
import { getProducts } from '../produtos/actions'
import { ChargeClientPage } from './charge-client-page'

export default async function NovaCobrancaPage() {
    // Parallel fetch
    const [clients, products] = await Promise.all([
        getClients(),
        getProducts()
    ])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Nova Cobrança</h1>
                <p className="text-muted-foreground">Crie e envie cobranças via WhatsApp integrado ao Mercado Pago.</p>
            </div>

            <ChargeClientPage clients={clients || []} products={products || []} />
        </div>
    )
}
