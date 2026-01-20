import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    LayoutDashboard,
    Users,
    Package,
    FileText,
    Settings,
    LogOut,
    PlusCircle,
    LayoutTemplate,
    MessageCircle,
    MoreVertical
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const signOut = async () => {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/login')
    }

    return (
        <div className="relative min-h-screen bg-[#d1d7db] dark:bg-[#0b141a] flex flex-col items-center overflow-hidden">
            {/* Top Green Strip */}
            <div className="absolute top-0 w-full h-32 bg-primary z-0 hidden md:block"></div>

            {/* Main App Container */}
            <div className="relative z-10 w-full md:max-w-[1600px] h-screen md:h-[calc(100vh-2.5rem)] md:mt-5 bg-white dark:bg-sidebar md:rounded-xl shadow-2xl flex overflow-hidden">

                {/* Sidebar (Left Panel) */}
                <aside className="w-full md:w-[400px] bg-white dark:bg-[#111b21] border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all">
                    {/* Header */}
                    <div className="h-16 px-4 py-3 bg-[#F0F2F5] dark:bg-[#202c33] flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <span className="font-semibold text-gray-700 dark:text-gray-200 hidden md:block">Pague Zap</span>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* User Avatar */}
                            <Avatar className="h-9 w-9 cursor-pointer hover:opacity-80 transition-opacity">
                                <AvatarImage src="" /> {/* Add profile pic if available */}
                                <AvatarFallback className="bg-primary text-white text-xs">{user.email?.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-black/5 dark:text-gray-400 dark:hover:bg-white/5 rounded-full">
                                <MoreVertical className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Navigation Items (Action List Style) */}
                    <nav className="flex-1 overflow-y-auto p-2 space-y-1 bg-white dark:bg-[#111b21]">
                        <NavItem href="/dashboard/nova-cobranca" icon={<PlusCircle className="h-5 w-5" />} activeColor="text-primary">
                            Nova Cobrança
                        </NavItem>
                        <Separator className="my-2 bg-gray-100 dark:bg-gray-800" />
                        <NavItem href="/dashboard/clientes" icon={<Users className="h-5 w-5" />}>
                            Meus Clientes
                        </NavItem>
                        <NavItem href="/dashboard/produtos" icon={<Package className="h-5 w-5" />}>
                            Meus Produtos
                        </NavItem>
                        <NavItem href="/dashboard/cobrancas" icon={<FileText className="h-5 w-5" />}>
                            Minhas Cobranças
                        </NavItem>
                        <NavItem href="/dashboard/templates" icon={<LayoutTemplate className="h-5 w-5" />}>
                            Templates de Mensagem
                        </NavItem>
                        <Separator className="my-2 bg-gray-100 dark:bg-gray-800" />
                        <NavItem href="/dashboard/configuracoes" icon={<Settings className="h-5 w-5" />}>
                            Configurações
                        </NavItem>
                    </nav>

                    {/* Footer / Sign Out */}
                    <div className="p-3 bg-gray-50 dark:bg-[#202c33] border-t dark:border-gray-800">
                        <form action={signOut}>
                            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10" type="submit">
                                <LogOut className="mr-3 h-5 w-5" />
                                Sair do Sistema
                            </Button>
                        </form>
                    </div>
                </aside>

                {/* Main Content (Right Panel) */}
                <main className="hidden md:flex flex-1 flex-col bg-[#efeae2] dark:bg-[#0b141a] relative">
                    {/* Chat Pattern Background (Optional, using CSS opacity) */}
                    <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }}></div>

                    {/* Header (Context) */}
                    {/* Keeps the content clean, maybe a breadcrumb or title could go here if needed, but for now typical "Chat" header style */}
                    <div className="h-16 px-6 py-3 bg-[#F0F2F5] dark:bg-[#202c33] border-b border-gray-200 dark:border-gray-800 shrink-0 flex items-center z-10 shadow-sm">
                        <div className="flex flex-col">
                            <h2 className="font-semibold text-gray-800 dark:text-gray-100">Visão Geral</h2>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Dashboard Administrativo</span>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 z-10 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

function NavItem({ href, icon, children, activeColor }: { href: string; icon: React.ReactNode; children: React.ReactNode, activeColor?: string }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-4 px-4 py-3.5 text-[15px] font-normal text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-100 dark:hover:bg-[#202c33] transition-colors group relative ${activeColor || ''}`}
        >
            <div className={`text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors ${activeColor ? 'text-primary' : ''}`}>
                {icon}
            </div>
            {children}
        </Link>
    )
}
