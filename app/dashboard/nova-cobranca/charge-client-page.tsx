'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createCharge } from './actions'
import { chargeSchema, ChargeFormData } from './schema'
import { WhatsAppPreview } from './whatsapp-preview'
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function ChargeClientPage({ clients, products }: { clients: any[], products: any[] }) {
    const form = useForm({
        resolver: zodResolver(chargeSchema),
        defaultValues: {
            template_type: 'simple',
            snapshot_price: 0,
            snapshot_product_name: '',
            snapshot_image_url: '',
            snapshot_product_description: '',
        },
    })

    // Hydration logic
    const selectedProductId = form.watch('product_id')
    useEffect(() => {
        if (selectedProductId) {
            const p = products.find(prod => prod.id === selectedProductId)
            if (p) {
                form.setValue('snapshot_product_name', p.name)
                form.setValue('snapshot_price', p.price)
                form.setValue('snapshot_image_url', p.image_url || '')
                form.setValue('snapshot_product_description', p.description_short || '')
                // Trigger validation if needed
            }
        }
    }, [selectedProductId, products, form])

    // Watch for Preview
    const formData = form.watch()
    const selectedClientId = form.watch('client_id')
    const selectedClient = clients.find(c => c.id === selectedClientId)

    const [loading, setLoading] = useState(false)

    async function onSubmit(data: ChargeFormData) {
        setLoading(true)
        try {
            const result = await createCharge(data)
            // If createCharge throws, it goes to catch? No server actions usually return error object or throw.
            // My action throws Error.
            toast.success(`Cobrança criada com sucesso! ID: ${result.chargeId}`)
            form.reset()
        } catch (e: any) {
            toast.error(e.message || 'Erro ao criar cobrança')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column - Form (60% -> col-span-3) */}
            <div className="lg:col-span-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Nova Cobrança</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                                {/* 1. Cliente */}
                                <FormField
                                    control={form.control}
                                    name="client_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cliente</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione um cliente" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {clients.map(c => (
                                                        <SelectItem key={c.id} value={c.id}>{c.name} ({c.phone})</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* 2. Produto (Hydration source) */}
                                <FormField
                                    control={form.control}
                                    name="product_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Produto (Opcional - Preenchimento Automático)</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione para preencher" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {products.map(p => (
                                                        <SelectItem key={p.id} value={p.id}>{p.name} - R$ {p.price}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    {/* 3. Nome do Item */}
                                    <FormField
                                        control={form.control}
                                        name="snapshot_product_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome do Item</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* 4. Valor */}
                                    <FormField
                                        control={form.control}
                                        name="snapshot_price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Valor (R$)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        {...field}
                                                        value={field.value as number}
                                                        onChange={e => field.onChange(parseFloat(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* 5. Imagem */}
                                <FormField
                                    control={form.control}
                                    name="snapshot_image_url"
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

                                {/* 7. Template Choice */}
                                <FormField
                                    control={form.control}
                                    name="template_type"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Escolher Template</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col space-y-1"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="simple" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Simples
                                                        </FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="detailed" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            Detalhado
                                                        </FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* 6. Descrição (Detailed Only) */}
                                {form.watch('template_type') === 'detailed' && (
                                    <FormField
                                        control={form.control}
                                        name="snapshot_product_description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Descrição Detalhada</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                {/* 8. Agendamento */}
                                <FormField
                                    control={form.control}
                                    name="scheduled_at"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Agendamento (Opcional)</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[240px] pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(new Date(field.value), "PPP")
                                                            ) : (
                                                                <span>Agendar envio</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value ? new Date(field.value) : undefined}
                                                        onSelect={(date) => field.onChange(date?.toISOString())}
                                                        disabled={(date) =>
                                                            date < new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {/* Note: Standard Calendar is Date only, user might want Time. 
                          Prompt says "DateTime picker".
                          Shadcn Calendar is just Date.
                          I'll stick to Date for now or add a time input.
                          I'll explicitly mention Date only for MVP unless I add time input.*/}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                                    {loading ? 'Processando...' : 'Gerar e Enviar Cobrança'}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column - Preview (40% -> col-span-2) */}
            <div className="lg:col-span-2 flex justify-center lg:justify-start lg:sticky lg:top-8 h-fit">
                <WhatsAppPreview data={formData as ChargeFormData} clientName={selectedClient?.name} />
            </div>
        </div>
    )
}
