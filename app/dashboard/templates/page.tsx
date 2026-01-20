'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { installTemplates } from './actions'
import { useState } from 'react'

export default function TemplatesPage() {
    const [loading, setLoading] = useState(false)

    async function handleInstall() {
        setLoading(true)
        try {
            await installTemplates()
            toast.success('Templates enviados para aprovação na Meta!')
        } catch (e: any) {
            toast.error(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Templates WhatsApp</h1>
                <Button onClick={handleInstall} disabled={loading}>
                    {loading ? 'Instalando...' : 'Instalar Templates na Meta'}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Cobrança Simples</CardTitle>
                        <CardDescription>Ideal para mensagens rápidas e diretas.</CardDescription>
                    </CardHeader>
                    <CardContent className="bg-gray-100 p-4 rounded-md mx-6 mb-6 font-mono text-sm whitespace-pre-wrap">
                        {`[IMAGEM]

Olá {{1}}, tudo bem?

Aqui está sua cobrança referente a {{2}} no valor de {{3}}.

Para facilitar o pagamento, você pode usar o botão abaixo ou acessar: {{4}}`}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Cobrança Detalhada</CardTitle>
                        <CardDescription>Inclui descrição completa do item.</CardDescription>
                    </CardHeader>
                    <CardContent className="bg-gray-100 p-4 rounded-md mx-6 mb-6 font-mono text-sm whitespace-pre-wrap">
                        {`[IMAGEM]

Olá {{1}}, tudo bem?

Segue sua cobrança:

📦 Produto: {{2}}
📝 {{3}}
💰 Valor: {{4}}

Pague pelo botão abaixo ou acesse: {{5}}`}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
