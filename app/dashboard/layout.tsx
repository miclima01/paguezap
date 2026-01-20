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
    LayoutTemplate
} from 'lucide-react'

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
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                        <LayoutDashboard className="h-6 w-6" />
                        Pague Zap
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <NavItem href="/dashboard/nova-cobranca" icon={<PlusCircle className="h-5 w-5" />}>
                        Nova Cobrança
                    </NavItem>
                    <NavItem href="/dashboard/clientes" icon={<Users className="h-5 w-5" />}>
                        Clientes
                    </NavItem>
                    <NavItem href="/dashboard/produtos" icon={<Package className="h-5 w-5" />}>
                        Produtos
                    </NavItem>
                    <NavItem href="/dashboard/cobrancas" icon={<FileText className="h-5 w-5" />}>
                        Cobranças
                    </NavItem>
                    <NavItem href="/dashboard/templates" icon={<LayoutTemplate className="h-5 w-5" />}>
                        Templates
                    </NavItem>
                    <NavItem href="/dashboard/configuracoes" icon={<Settings className="h-5 w-5" />}>
                        Configurações
                    </NavItem>
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="mb-4 px-2">
                        <p className="text-sm font-medium truncate">{user.email}</p>
                    </div>
                    <form action={signOut}>
                        <Button variant="outline" className="w-full justify-start" type="submit">
                            <LogOut className="mr-2 h-4 w-4" />
                            Sair
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-6 md:p-8 max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    )
}

function NavItem({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
            {icon}
            {children}
        </Link>
    )
}
