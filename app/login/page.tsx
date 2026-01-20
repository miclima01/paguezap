'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { MessageCircle, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react'

export default function LoginPage({
    searchParams,
}: {
    searchParams: { message?: string; error?: string }
}) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [isLogin, setIsLogin] = useState(true)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        try {
            if (isLogin) {
                const result = await login(formData)
                if (result?.error) {
                    toast.error(result.error)
                }
            } else {
                const result = await signup(formData)
                if (result?.error) {
                    toast.error(result.error)
                } else if (result?.success) {
                    toast.success(result.message)
                    setIsLogin(true) // Switch back to login after signup
                }
            }
        } catch (e) {
            toast.error("Ocorreu um erro inesperado. Tente novamente.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen bg-[#F0F2F5] dark:bg-[var(--background)] flex flex-col items-center justify-center overflow-hidden">
            {/* Top Teal Strip (WhatsApp Style) */}
            <div className="absolute top-0 w-full h-[220px] bg-primary z-0 hidden md:block">
                <div className="container mx-auto px-4 h-full flex items-center mb-8">
                    <div className="flex items-center gap-2 text-white/90">
                        <MessageCircle className="w-8 h-8" />
                        <span className="text-xl font-medium tracking-wide">PAGUE ZAP WEB</span>
                    </div>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="z-10 w-full max-w-[1000px] h-auto md:h-[70vh] md:min-h-[550px] flex rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">

                {/* Left Side (Features / Branding) - Hidden on Mobile */}
                <div className="hidden md:flex flex-1 flex-col justify-center p-12 bg-white dark:bg-sidebar text-slate-800 dark:text-gray-200 border-r dark:border-gray-800">
                    <h1 className="text-4xl font-light mb-6 text-slate-700 dark:text-gray-100">
                        Gerencie suas cobranças <br />
                        <span className="font-semibold text-primary">diretamente no Zap.</span>
                    </h1>
                    <div className="space-y-6 mt-4">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Automação Completa</h3>
                                <p className="text-muted-foreground">Envie cobranças automáticas e lembretes sem esforço.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-full bg-primary/10 text-primary">
                                <Lock className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Segurança Total</h3>
                                <p className="text-muted-foreground">Seus dados e de seus clientes protegidos com criptografia.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side (Login Form) */}
                <div className="flex-1 bg-white dark:bg-sidebar p-8 md:p-12 flex flex-col justify-center relative">
                    <div className="max-w-sm mx-auto w-full space-y-8">
                        <div className="text-center md:text-left space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {isLogin ? 'Acesse sua conta' : 'Crie sua conta grátis'}
                            </h2>
                            <p className="text-muted-foreground">
                                {isLogin
                                    ? 'Bem-vindo de volta! Digite seus dados abaixo.'
                                    : 'Comece a otimizar seu tempo hoje mesmo.'}
                            </p>
                        </div>

                        <form action={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-600 dark:text-gray-300">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        required
                                        className="pl-10 h-11 bg-slate-50 dark:bg-gray-800/50 border-slate-200 dark:border-gray-700 focus-visible:ring-primary focus-visible:border-primary transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-600 dark:text-gray-300">Senha</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="pl-10 h-11 bg-slate-50 dark:bg-gray-800/50 border-slate-200 dark:border-gray-700 focus-visible:ring-primary focus-visible:border-primary transition-all"
                                    />
                                </div>
                            </div>

                            {searchParams?.error && (
                                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium dark:bg-red-900/20 dark:text-red-400">
                                    {searchParams.error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isLogin ? 'Entrar no Sistema' : 'Começar Agora'}
                                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                            </Button>
                        </form>

                        <div className="text-center pt-4">
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                            >
                                {isLogin
                                    ? 'Ainda não tem uma conta? Cadastre-se'
                                    : 'Já possui uma conta? Faça login'}
                            </button>
                        </div>
                    </div>

                    {/* Decorative Bottom Pattern (Optional) */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                </div>
            </div>

            <div className="mt-8 text-sm text-muted-foreground/60 hidden md:block">
                &copy; 2024 Pague Zap. Todos os direitos reservados.
            </div>
        </div>
    )
}
