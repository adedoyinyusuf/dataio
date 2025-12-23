import { getSession, deleteSession } from '@/lib/session';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';

    if (!session) {
        redirect('/admin/login');
    }

    const isActive = (path: string) => pathname.startsWith(path);

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Premium Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col shadow-2xl">
                {/* Logo Area */}
                <div className="px-6 py-8 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-xl font-bold">D</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Data.io</h2>
                            <p className="text-xs text-slate-400 font-medium">Admin Console</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    <Link
                        href="/admin"
                        className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${pathname === '/admin'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                            : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                            }`}
                    >
                        <span className="text-lg">📊</span>
                        <span className="font-medium">Dashboard</span>
                    </Link>

                    <Link
                        href="/admin/modules"
                        className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/admin/modules')
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                            : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                            }`}
                    >
                        <span className="text-lg">📦</span>
                        <span className="font-medium">Modules</span>
                    </Link>

                    <Link
                        href="/admin/indicators"
                        className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/admin/indicators')
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                            : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                            }`}
                    >
                        <span className="text-lg">📈</span>
                        <span className="font-medium">Indicators</span>
                    </Link>

                    <Link
                        href="/admin/data-editor"
                        className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/admin/data-editor')
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                            : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                            }`}
                    >
                        <span className="text-lg">✏️</span>
                        <span className="font-medium">Data Editor</span>
                    </Link>

                    <Link
                        href="/admin/import"
                        className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/admin/import')
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                            : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                            }`}
                    >
                        <span className="text-lg">📤</span>
                        <span className="font-medium">Import Data</span>
                    </Link>

                    <Link
                        href="/admin/audit"
                        className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/admin/audit')
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                            : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                            }`}
                    >
                        <span className="text-lg">🔍</span>
                        <span className="font-medium">Data Audit</span>
                    </Link>
                </nav>

                {/* User Info */}
                <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-800/30">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold">
                            {session.user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs text-slate-400 mb-0.5">Logged in as</div>
                            <div className="text-sm font-medium text-white truncate">{session.user?.email}</div>
                        </div>
                    </div>

                    <form action={async () => {
                        'use server';
                        await deleteSession();
                        redirect('/admin/login');
                    }}>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all text-sm font-medium border border-red-500/20"
                        >
                            🚪 Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
