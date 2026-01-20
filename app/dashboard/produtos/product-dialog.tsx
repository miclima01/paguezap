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
    FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { upsertProduct } from './actions'
import { productSchema, ProductFormData } from './schema'
import { PlusCircle, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

export function ProductDialog({ productToEdit, open, setOpen }: {
    productToEdit?: ProductFormData & { id: string },
    open: boolean,
    setOpen: (open: boolean) => void
}) {
    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: productToEdit || {
            name: '',
            price: 0,
            image_url: '',
            description_short: '',
        },
    })

    const [loading, setLoading] = useState(false)
    const imageUrl = form.watch('image_url')
    const description = form.watch('description_short') || ''

    async function onSubmit(data: ProductFormData) {
        setLoading(true)
        const result = await upsertProduct({ ...data, id: productToEdit?.id })
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Produto salvo com sucesso!')
            setOpen(false)
            form.reset()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {!productToEdit && (
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Novo Produto
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{productToEdit ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome do Produto</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Curso de Marketing" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Preço (R$)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    name={field.name}
                                                    ref={field.ref}
                                                    onBlur={field.onBlur}
                                                    disabled={field.disabled}
                                                    value={field.value as number}
                                                    onChange={e => field.onChange(parseFloat(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description_short"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descrição Curta (WhatsApp)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Breve descrição do produto..."
                                                    className="resize-none"
                                                    {...field}
                                                    maxLength={150}
                                                />
                                            </FormControl>
                                            <FormDescription className={description.length > 150 ? 'text-red-500' : ''}>
                                                {description.length}/150 caracteres
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="image_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>URL da Imagem</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="mt-2 text-center">
                                    <FormLabel>Preview</FormLabel>
                                    <div className="mt-2 border rounded-md aspect-square flex items-center justify-center bg-gray-50 overflow-hidden relative">
                                        {imageUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={imageUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.currentTarget.style.display = 'none' }}
                                            />
                                        ) : (
                                            <ImageIcon className="h-12 w-12 text-gray-300" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
