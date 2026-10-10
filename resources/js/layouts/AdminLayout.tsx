import { useState, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, Users, CalendarCheck, UserCheck, Settings as SettingsIcon,
    LogOut, Menu, X, Bell, Activity, Newspaper, Image as ImageIcon
} from 'lucide-react';

interface Props { children: ReactNode; title?: string; }

const nav = [
    { href: '/admin',              label: 'Dashboard',            icon: LayoutDashboard },
    { href: '/admin/leads',        label: 'Leads / CRM',          icon: Users },
    { href: '/admin/appointments', label: 'Appointments',         icon: CalendarCheck },
    { href: '/admin/patients',     label: 'Patients / Admission', icon: UserCheck },
    { href: '/admin/blog',         label: 'Blog / Articles',      icon: Newspaper },
    { href: '/admin/gallery',      label: 'Photo Gallery',        icon: ImageIcon },
    { href: '/admin/settings',     label: 'CMS & Settings',       icon: SettingsIcon },
];

export default function AdminLayout({ children, title }: Props) {
    const [sideOpen, setSideOpen] = useState(false);
    const { url } = usePage();

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ${
                    sideOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0`}
            >
                {/* Brand */}
                <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-100" style={{ backgroundColor: 'var(--theme-primary)' }}>
                    <img src="/logo.jpeg" alt="Maa Tara Logo" className="w-9 h-9 object-contain rounded-lg bg-white/10 p-0.5 shadow-xs" />
                    <div>
                        <p className="text-white font-bold text-sm leading-tight">Maa Tara Admin</p>
                        <p className="text-white/60 text-xs">Control Panel</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {nav.map(({ href, label, icon: Icon }) => {
                        const active = url === href || (href !== '/admin' && url.startsWith(href));
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                    active
                                        ? 'text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                style={active ? { backgroundColor: 'var(--theme-primary)' } : {}}
                                onClick={() => setSideOpen(false)}
                            >
                                <Icon size={17} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="px-3 py-4 border-t border-gray-100">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={17} /> Sign Out
                    </Link>
                </div>
            </aside>

            {/* Overlay (mobile) */}
            {sideOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                    onClick={() => setSideOpen(false)}
                />
            )}

            {/* Main */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen lg:max-w-[calc(100%-16rem)]">
                {/* Top bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-5 sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSideOpen(true)}
                            className="lg:hidden text-gray-500 hover:text-gray-700"
                        >
                            <Menu size={22} />
                        </button>
                        {title && <h1 className="font-semibold text-gray-800 text-lg">{title}</h1>}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <Link href="/" target="_blank" className="text-xs text-blue-600 hover:underline">
                            View Website ↗
                        </Link>
                        <div className="flex items-center gap-1.5">
                            <Activity size={15} className="text-green-500" />
                            <span className="hidden sm:inline font-medium">Admin</span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-5 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
