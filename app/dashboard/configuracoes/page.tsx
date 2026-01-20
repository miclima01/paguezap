import { getSettings, saveSettings } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Save } from 'lucide-react'

export default async function ConfiguracoesPage() {
    const settings = await getSettings()

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Configurações</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie suas integrações e chaves de API.</p>
            </div>

            <form action={saveSettings} className="space-y-6">
                <Card className="border-0 shadow-sm bg-white dark:bg-[#202c33] overflow-hidden">
                    <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                {/* WhatsApp Icon or generic */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                            </div>
                            <div>
                                <CardTitle className="text-lg">Integração WhatsApp</CardTitle>
                                <CardDescription>Configure suas credenciais da Meta Cloud API.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                        <div className="space-y-2">
                            <Label htmlFor="waba_token">WABA Access Token</Label>
                            <Input
                                id="waba_token"
                                name="waba_token"
                                type="password"
                                defaultValue={settings?.waba_access_token || ''}
                                placeholder="EAAG..."
                                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="waba_phone_id">WABA Phone ID</Label>
                            <Input
                                id="waba_phone_id"
                                name="waba_phone_id"
                                defaultValue={settings?.waba_phone_id || ''}
                                placeholder="123456789"
                                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-white dark:bg-[#202c33] overflow-hidden">
                    <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                {/* Credit Card Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                            </div>
                            <div>
                                <CardTitle className="text-lg">Integração Mercado Pago</CardTitle>
                                <CardDescription>Configure suas chaves de API.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                        <div className="space-y-2">
                            <Label htmlFor="mp_token">Access Token</Label>
                            <Input
                                id="mp_token"
                                name="mp_token"
                                type="password"
                                defaultValue={settings?.mp_access_token || ''}
                                placeholder="APP_USR-..."
                                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" size="lg" className="shadow-lg shadow-primary/20">
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Configurações
                    </Button>
                </div>
            </form>
        </div>
    )
}
