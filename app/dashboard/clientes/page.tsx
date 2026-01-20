import { getClients } from './actions'
import { ClientTable } from './client-table'
import { ClientDialog } from './client-dialog'
import { Card, CardContent } from '@/components/ui/card'

export default async function ClientesPage() {
    const clients = await getClients()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Meus Clientes</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie sua base de clientes.</p>
                </div>
                <ClientDialogClientWrapper />
            </div>

            <Card className="border-0 shadow-sm bg-white dark:bg-[#202c33] overflow-hidden">
                <CardContent className="p-0">
                    <ClientTable clients={clients || []} />
                </CardContent>
            </Card>
        </div>
    )
}

// Wrapper to handle state in client component for the specific "New Client" button
import { ClientDialogClientWrapper } from './client-dialog-wrapper'
