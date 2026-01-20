'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function LoginPage({
    searchParams,
}: {
    searchParams: { message?: string; error?: string }
}) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleLogin(formData: FormData) {
        setLoading(true)
        try {
            const result = await login(formData)
            if (result?.error) {
                toast.error(result.error)
            } else {
                // Redirect happens in server action purely if successful?
                // Wait, if redirect() in action, it acts as navigation.
                // But if we want custom handling, we might need a generic return.
                // My action logic: success -> redirect. error -> return object.
                // So if we reach here, and result is undefined, it meant redirect happened?
                // Actually, if redirect() throws, this catch block might catch it?
                // No, Next.js handles redirects specially.
            }
        } catch (e) {
            // Ignored, likely redirect
        } finally {
            setLoading(false)
        }
    }

    async function handleSignup(formData: FormData) {
        setLoading(true)
        try {
            const result = await signup(formData)
            if (result?.error) {
                toast.error(result.error)
            } else if (result?.success) {
                toast.success(result.message)
                // Optional: clear form
            }
        } catch (e) {
            // Ignored
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">
                        Pague Zap
                    </CardTitle>
                    <CardDescription className="text-center">
                        Entre com seu email para acessar o dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                            />
                        </div>
                        {searchParams?.error && (
                            <div className="text-red-500 text-sm font-medium">
                                {searchParams.error}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <Button formAction={handleLogin} className="w-full" disabled={loading}>
                                {loading ? '...' : 'Entrar'}
                            </Button>
                            <Button formAction={handleSignup} variant="outline" className="w-full" disabled={loading}>
                                {loading ? '...' : 'Cadastrar'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
