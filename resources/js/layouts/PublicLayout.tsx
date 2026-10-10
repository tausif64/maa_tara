import { ReactNode, useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import AnnouncementBar from '@/components/public/AnnouncementBar';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import FloatingWidget from '@/components/public/FloatingWidget';

interface Props {
    children: ReactNode;
    title?: string;
}

export type Theme = 'navy' | 'orange' | 'dark';

export default function PublicLayout({ children, title }: Props) {
    const [theme, setTheme] = useState<Theme>('navy');

    useEffect(() => {
        const saved = (localStorage.getItem('mt-theme') as Theme) || 'navy';
        setTheme(saved);
        document.documentElement.setAttribute('data-theme', saved);
    }, []);

    const handleThemeChange = (t: Theme) => {
        setTheme(t);
        localStorage.setItem('mt-theme', t);
        document.documentElement.setAttribute('data-theme', t);
    };

    return (
        <>
            {title && <title>{title} — Maa Tara Freedom Trust</title>}
            <div className="min-h-screen flex flex-col bg-brand-bg font-sans" data-theme={theme}>
                <AnnouncementBar />
                <Navbar theme={theme} onThemeChange={handleThemeChange} />
                <main className="flex-1">{children}</main>
                <Footer />
                <FloatingWidget />
            </div>
        </>
    );
}
