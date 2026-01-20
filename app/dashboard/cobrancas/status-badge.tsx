import { Badge } from '@/components/ui/badge'

const statusMap: Record<string, { label: string; className: string }> = {
    PENDING: { label: 'Pendente', className: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
    PAID: { label: 'Pago', className: 'bg-green-500 hover:bg-green-600 text-white' },
    EXPIRED: { label: 'Expirado', className: 'bg-gray-500 hover:bg-gray-600 text-white' },
    FAILED: { label: 'Falhou', className: 'bg-red-500 hover:bg-red-600 text-white' },
}

export function StatusBadge({ status }: { status: string }) {
    const config = statusMap[status] || { label: status, className: 'bg-gray-500' }
    return (
        <Badge className={config.className}>
            {config.label}
        </Badge>
    )
}
