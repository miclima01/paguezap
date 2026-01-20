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
import { Edit2, Trash2 } from 'lucide-react'
import { deleteClient } from './actions'
import { toast } from 'sonner'
import { useState } from 'react'
import { ClientDialog } from './client-dialog'

export function ClientTable({ clients }: { clients: any[] }) {
    const [editingClient, setEditingClient] = useState<any>(null)
    const [open, setOpen] = useState(false)

    async function handleDelete(id: string) {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            const result = await deleteClient(id)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Cliente excluído com sucesso')
            }
        }
    }

    function handleEdit(client: any) {
        setEditingClient(client)
        setOpen(true)
    }

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>CPF</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell>{client.name}</TableCell>
                                <TableCell>{client.phone}</TableCell>
                                <TableCell>{client.cpf || '-'}</TableCell>
                                <TableCell>{client.email || '-'}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(client)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(client.id)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {clients.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    Nenhum cliente cadastrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <ClientDialog
                open={open}
                setOpen={(val) => {
                    setOpen(val)
                    if (!val) setEditingClient(null)
                }}
                clientToEdit={editingClient}
            />
        </>
    )
}
