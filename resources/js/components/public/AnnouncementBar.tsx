import { usePage } from '@inertiajs/react';
import { Phone, Mail, Clock, MessageCircle } from 'lucide-react';

export default function AnnouncementBar() {
    const { settings = {} } = usePage().props as { settings?: Record<string, string> };

    if (settings['announcement_visible'] === '0') {
        return null;
    }

    const phone = settings['phone_primary'] || '+91-9876543210';
    const email = settings['email'] || 'care@maataratrust.org';
    const rawWhatsapp = settings['whatsapp_number'] || '919876543210';
    const whatsappNum = rawWhatsapp.replace(/\D/g, '');
    const announcementText = settings['announcement_text'];

    return (
        <div className="hidden md:block text-white text-sm py-2 px-4" style={{ backgroundColor: 'var(--theme-primary-dark, #061D42)' }}>
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-4">
                    <a
                        href={`tel:${phone}`}
                        className="flex items-center gap-1.5 hover:text-brand-gold transition-colors"
                    >
                        <Phone size={13} />
                        <span className="font-semibold">{phone}</span>
                    </a>
                    <a
                        href={`mailto:${email}`}
                        className="flex items-center gap-1.5 hover:text-brand-gold transition-colors hidden sm:flex"
                    >
                        <Mail size={13} />
                        <span>{email}</span>
                    </a>
                    <span className="flex items-center gap-1.5 text-white/70 hidden md:flex">
                        <Clock size={13} />
                        <span>{announcementText || 'Open 24×7 — Emergency Helpline'}</span>
                    </span>
                </div>
                <a
                    href={`https://wa.me/${whatsappNum}?text=I%20need%20help%20with%20addiction%20recovery`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold transition-colors shrink-0"
                >
                    <MessageCircle size={13} />
                    WhatsApp Help
                </a>
            </div>
        </div>
    );
}
