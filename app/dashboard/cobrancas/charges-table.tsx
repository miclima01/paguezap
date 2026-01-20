'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ExternalLink, RefreshCw, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { StatusBadge } from './status-badge'
import { format } from 'date-fns'

export function ChargesTable({ charges }: { charges: any[] }) {

    function copyLink(url: string) {
        navigator.clipboard.writeText(url)
        toast.success('Link copiado!')
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {charges.map((charge) => (
                        <TableRow key={charge.id}>
                            <TableCell>{format(new Date(charge.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                            <TableCell>
                                <div className="font-medium">{charge.clients?.name}</div>
                                <div className="text-xs text-muted-foreground">{charge.clients?.phone}</div>
                            </TableCell>
                            <TableCell>{charge.snapshot_product_name}</TableCell>
                            <TableCell>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(charge.snapshot_price)}
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={charge.status} />
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                {charge.payment_link_url && (
                                    <Button variant="outline" size="icon" onClick={() => copyLink(charge.payment_link_url)} title="Copiar Link">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                )}
                                {/* Re-send logic could be added here */}
                            </TableCell>
                        </TableRow>
                    ))}
                    {charges.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                Nenhuma cobrança encontrada.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
