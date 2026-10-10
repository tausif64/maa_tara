import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X, Palette, ChevronDown } from 'lucide-react';
import type { Theme } from '@/layouts/PublicLayout';

interface Props {
    theme: Theme;
    onThemeChange: (t: Theme) => void;
}

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Treatments', href: '/treatments' },
    { label: 'Facilities', href: '/facilities' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
];

const themes: { value: Theme; label: string; icon: string }[] = [
    { value: 'navy', label: 'Trust Navy', icon: '🔵' },
    { value: 'orange', label: 'Vibrant Orange', icon: '🟠' },
    { value: 'dark', label: 'Dark Mode', icon: '🌙' },
];

export default function Navbar({ theme, onThemeChange }: Props) {
    const [open, setOpen] = useState(false);
    const [themeOpen, setThemeOpen] = useState(false);
    const { url, props } = usePage();
    const settings = (props.settings || {}) as Record<string, string>;

    const siteName = settings['site_name'] || 'Maa Tara Freedom Trust';
    const tagline = settings['tagline'] || settings['site_tagline'] || 'Your Hope, Our Mission.';
    const currentPath = (url || '/').split('?')[0];

    const isActive = (href: string) => {
        if (href === '/') {
            return currentPath === '/' || currentPath === '';
        }
        return currentPath === href || currentPath.startsWith(href + '/');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 shrink-0">
                        <img
                            src="/logo.jpeg"
                            alt={siteName}
                            className="h-10 w-10 md:h-14 md:w-14 object-contain rounded-lg shadow-xs"
                        />
                        <div className="hidden sm:block">
                            <div className="font-bold text-lg leading-tight" style={{ color: 'var(--theme-primary)' }}>
                                {siteName}
                            </div>
                            <div className="text-xs text-brand-body italic">{tagline}</div>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden lg:flex items-center gap-6">
                        {navLinks.map((l) => {
                            const active = isActive(l.href);
                            return (
                                <a
                                    key={l.href}
                                    href={l.href}
                                    className={`text-sm font-medium transition-colors hover:text-tp pb-0.5 border-b-2 ${
                                        active
                                            ? 'border-current font-semibold'
                                            : 'border-transparent'
                                    }`}
                                    style={{ color: active ? 'var(--theme-primary)' : 'var(--color-brand-body, #475569)' }}
                                >
                                    {l.label}
                                </a>
                            );
                        })}
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-3">
                        {/* Theme switcher */}
                        {/* <div className="relative hidden md:block">
                            <button
                                onClick={() => setThemeOpen(!themeOpen)}
                                className="flex items-center gap-1 text-brand-body hover:text-tp transition-colors p-2 rounded-lg hover:bg-gray-100"
                                aria-label="Switch theme"
                            >
                                <Palette size={18} />
                                <ChevronDown size={14} />
                            </button>
                            {themeOpen && (
                                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                                    {themes.map((t) => (
                                        <button
                                            key={t.value}
                                            onClick={() => { onThemeChange(t.value); setThemeOpen(false); }}
                                            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                                                theme === t.value ? 'font-semibold' : ''
                                            }`}
                                        >
                                            <span>{t.icon}</span>
                                            {t.label}
                                            {theme === t.value && <span className="ml-auto text-green-500">✓</span>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div> */}

                        {/* Book appointment CTA */}
                        <a href="/appointment" className="btn-secondary text-sm px-4 py-2 hidden sm:inline-flex">
                            Book Appointment
                        </a>

                        {/* Mobile menu toggle */}
                        <button
                            className="lg:hidden p-2 rounded-lg text-brand-body hover:bg-gray-100"
                            onClick={() => setOpen(!open)}
                            aria-label="Toggle menu"
                        >
                            {open ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="lg:hidden bg-white border-t border-gray-100 px-4 pb-4">
                    <div className="flex flex-col gap-1 pt-2">
                        {navLinks.map((l) => {
                            const active = isActive(l.href);
                            return (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                                        active
                                            ? 'font-bold bg-gray-50'
                                            : 'text-brand-body hover:bg-gray-50'
                                    }`}
                                    style={active ? { color: 'var(--theme-primary)' } : {}}
                                    onClick={() => setOpen(false)}
                                >
                                    {l.label}
                                </Link>
                            );
                        })}
                        {/* <Link
                            href="/appointment"
                            className="btn-secondary mt-2 text-sm justify-center"
                            onClick={() => setOpen(false)}
                        >
                            Book Appointment
                        </Link> */}
                      
                    </div>
                </div>
            )}
        </nav>
    );
}
