'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { upsertClient } from './actions'
import { clientSchema, ClientFormData } from './schema'
import { PlusCircle } from 'lucide-react'

export function ClientDialog({ clientToEdit, open, setOpen }: {
    clientToEdit?: ClientFormData & { id: string },
    open: boolean,
    setOpen: (open: boolean) => void
}) {
    const form = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: clientToEdit || {
            name: '',
            phone: '',
            cpf: '',
            email: '',
        },
    })

    const [loading, setLoading] = useState(false)

    async function onSubmit(data: ClientFormData) {
        setLoading(true)
        const result = await upsertClient({ ...data, id: clientToEdit?.id })
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Cliente salvo com sucesso!')
            setOpen(false)
            form.reset()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {!clientToEdit && (
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Novo Cliente
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{clientToEdit ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nome do cliente" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefone (WhatsApp)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="(85) 99999-9999" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cpf"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CPF</FormLabel>
                                    <FormControl>
                                        <Input placeholder="000.000.000-00" {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="cliente@email.com" {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
