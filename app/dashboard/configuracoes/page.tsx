import { getSettings, saveSettings } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Save } from 'lucide-react'

export default async function ConfiguracoesPage() {
    const settings = await getSettings()

    return (
        <div className="space-y-6 max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>

            <form action={saveSettings} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Integração WhatsApp</CardTitle>
                        <CardDescription>Configure suas credenciais da Meta Cloud API.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="waba_token">WABA Access Token</Label>
                            <Input
                                id="waba_token"
                                name="waba_token"
                                type="password"
                                defaultValue={settings?.waba_access_token || ''}
                                placeholder="EAAG..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="waba_phone_id">WABA Phone ID</Label>
                            <Input
                                id="waba_phone_id"
                                name="waba_phone_id"
                                defaultValue={settings?.waba_phone_id || ''}
                                placeholder="123456789"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Integração Mercado Pago</CardTitle>
                        <CardDescription>Configure suas chaves de API.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="mp_token">Access Token</Label>
                            <Input
                                id="mp_token"
                                name="mp_token"
                                type="password"
                                defaultValue={settings?.mp_access_token || ''}
                                placeholder="APP_USR-..."
                            />
                        </div>
                    </CardContent>
                </Card>

                <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Configurações
                </Button>
            </form>
        </div>
    )
}
