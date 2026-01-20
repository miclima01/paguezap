import { getCharges } from './actions'
import { ChargesTable } from './charges-table'

export default async function CobrancasPage() {
    const charges = await getCharges()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Cobranças</h1>
            </div>

            <ChargesTable charges={charges || []} />
        </div>
    )
}
