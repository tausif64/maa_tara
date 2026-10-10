import { usePage } from '@inertiajs/react';
import { Phone, MessageCircle } from 'lucide-react';

export default function FloatingWidget() {
    const { settings = {} } = usePage().props as { settings?: Record<string, string> };

    const phone = settings['phone_primary'] || '+91-9876543210';
    const rawWhatsapp = settings['whatsapp_number'] || '919876543210';
    const whatsappNum = rawWhatsapp.replace(/\D/g, '');

    return (
        <div className="fixed bottom-6 right-5 z-50 flex flex-col gap-3">
            {/* WhatsApp */}
            <a
                href={`https://wa.me/${whatsappNum}?text=I%20need%20help%20with%20de-addiction%20admission`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-13 h-13 rounded-full bg-green-500 hover:bg-green-600 shadow-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-110 group relative"
                aria-label="Chat on WhatsApp"
            >
                <MessageCircle size={26} />
                <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    WhatsApp Us
                </span>
            </a>
            {/* Call */}
            <a
                href={`tel:${phone}`}
                className="w-13 h-13 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-200 hover:scale-110 group relative"
                style={{ backgroundColor: 'var(--theme-secondary)' }}
                aria-label="Call helpline"
            >
                <Phone size={24} />
                <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Call Helpline
                </span>
            </a>
        </div>
    );
}
