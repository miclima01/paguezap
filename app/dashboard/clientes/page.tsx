import { getClients } from './actions'
import { ClientTable } from './client-table'
import { ClientDialog } from './client-dialog'

export default async function ClientesPage() {
    const clients = await getClients()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
                <ClientDialogClientWrapper />
            </div>

            <ClientTable clients={clients || []} />
        </div>
    )
}

// Wrapper to handle state in client component for the specific "New Client" button
import { ClientDialogClientWrapper } from './client-dialog-wrapper'
