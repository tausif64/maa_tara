import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import { CheckCircle, Calendar, Phone, MessageCircle, Download } from 'lucide-react';

interface Appointment {
    reference_code: string;
    patient_name: string;
    service_type: string;
    consultation_mode: string;
    appointment_date: string;
    time_slot: string;
    status: string;
}
interface Props { appointment: Appointment; }

const SERVICE_LABELS: Record<string, string> = {
    inpatient:        'Inpatient Residential Care',
    outpatient:       'Outpatient Session',
    family_counseling:'Family Counselling',
    emergency_detox:  'Emergency Detox Admission',
};

const MODE_LABELS: Record<string, string> = {
    in_person: 'In-Person Visit (Ranchi Facility)',
    online:    'Online / Tele-Consultation',
};

const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        const weekday = date.toLocaleString('en-IN', { weekday: 'long' });
        const month = date.toLocaleString('en-IN', { month: 'long' });
        const day = date.getDate();
        const year = date.getFullYear();
        return `${weekday}, ${month} ${day}, ${year}`;
    } catch {
        return dateStr;
    }
};

export default function AppointmentConfirmation({ appointment }: Props) {
    const gcalDate = appointment.appointment_date.replace(/-/g, '');
    const gcalUrl = `https://calendar.google.com/calendar/r/eventedit?text=Appointment+at+Maa+Tara+Freedom+Trust&dates=${gcalDate}/${gcalDate}&details=Appointment+Reference:+${appointment.reference_code}`;

    return (
        <PublicLayout title="Appointment Confirmed">
            <Head title="Appointment Confirmed — Maa Tara Freedom Trust" />

            <section className="py-20 px-4 bg-brand-bg min-h-[80vh] flex items-center justify-center">
                <div className="max-w-lg w-full">
                    {/* Success icon */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={44} className="text-green-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-brand-slate mb-2">Appointment Confirmed! 🎉</h1>
                        <p className="text-brand-body">
                            Thank you, <strong>{appointment.patient_name}</strong>. Our team will call you shortly to confirm the details.
                        </p>
                    </div>

                    {/* Reference card */}
                    <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6">
                        {/* Ref header */}
                        <div className="p-6 text-white text-center" style={{ backgroundColor: 'var(--theme-primary)' }}>
                            <p className="text-sm text-white/70 mb-1">Appointment Reference</p>
                            <p className="text-3xl font-bold tracking-widest">{appointment.reference_code}</p>
                            <p className="text-xs text-white/60 mt-1">Save this code to track your appointment</p>
                        </div>
                        {/* Details */}
                        <div className="p-6 space-y-3">
                            {[
                                { label: 'Service',      value: SERVICE_LABELS[appointment.service_type] || appointment.service_type },
                                { label: 'Mode',         value: MODE_LABELS[appointment.consultation_mode] || appointment.consultation_mode },
                                { label: 'Date',         value: formatDate(appointment.appointment_date) },
                                { label: 'Time Slot',    value: appointment.time_slot },
                                { label: 'Status',       value: '⏳ Pending Confirmation' },
                            ].map((row) => (
                                <div key={row.label} className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0">
                                    <span className="text-brand-body font-medium">{row.label}</span>
                                    <span className="text-brand-slate font-semibold text-right max-w-[60%]">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        <a
                            href={gcalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-brand-body hover:border-gray-300 transition-colors"
                        >
                            <Calendar size={17} /> Add to Google Calendar
                        </a>
                        <a
                            href={`https://wa.me/918987654321?text=My+appointment+reference+is+${appointment.reference_code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-xl px-4 py-3 text-sm font-medium transition-colors"
                        >
                            <MessageCircle size={17} /> WhatsApp Us
                        </a>
                    </div>

                    {/* Important note */}
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800 mb-6">
                        <strong>📞 What happens next?</strong><br />
                        Our admissions team will call you within 2–4 hours to confirm your slot and provide any pre-visit instructions.
                        You can also reach us directly at <a href="tel:+918987654321" className="font-bold underline">+91 89876 54321</a>.
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link href="/" className="btn-outline-primary flex-1 justify-center">
                            Return to Home
                        </Link>
                        <Link href="/appointment" className="btn-primary flex-1 justify-center">
                            Book Another Appointment
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
