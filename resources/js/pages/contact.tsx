import React from 'react';
import { useForm } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import SeoHead from '@/components/public/SeoHead';
import {
    Phone, Mail, MapPin, Clock, MessageCircle, CheckCircle,
    Shield, AlertCircle, HeartHandshake, PhoneCall, Sparkles,
    Send, Building2
} from 'lucide-react';

interface Settings {
    [key: string]: string | null | undefined;
}

interface Props {
    settings?: Settings;
}

export default function Contact({ settings = {} }: Props) {
    const siteName = settings['site_name'] || 'Our Centre';

    const phonePrimary = settings['phone_primary'] || '';
    const phoneSecondary = settings['phone_secondary'] || '';
    const email = settings['email'] || '';

    const rawWhatsapp = settings['whatsapp_number'] || '';
    const whatsappNum = rawWhatsapp.replace(/\D/g, '');

    const addressLine = settings['address_line1'] || '';
    const city = settings['city'] || '';
    const state = settings['state'] || '';
    const pincode = settings['pincode'] || '';

    const fullAddress = [addressLine, city, state, pincode]
        .filter(Boolean)
        .join(', ');

    const officeHours =
        settings['office_hours'] ||
        'Open 24 × 7 — including Sundays and public holidays';

    const mapsEmbed = settings['maps_embed_url'] || '';

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        wasSuccessful,
    } = useForm({
        name: '',
        phone: '',
        email: '',
        addiction_type: '',
        message: '',
        website: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post('/contact', {
            onSuccess: () => reset(),
        });
    };

    return (
        <PublicLayout title="Contact Us">
            <SeoHead
                title={`Contact & 24/7 Helpline — Best Rehab Center in Ranchi | ${siteName}`}
                description={`Get 24/7 confidential help, admission support, and emergency medical detox assistance from ${siteName} in Ranchi, Jharkhand. Call now or visit our center.`}
                canonicalPath="/contact"
                keywords={[
                    'rehab center contact number ranchi',
                    'nasha mukti kendra contact number ranchi',
                    'rehab helpline ranchi',
                    'emergency detox ranchi contact',
                    'de addiction center phone number jharkhand',
                    'nasha mukti kendra near me contact',
                    'sharab chhudane ka doctor ranchi contact',
                ]}
                settings={settings}
            />

            {/* ── Hero Section ── */}
            <section
                className="relative py-16 sm:py-24 text-white text-center px-4 overflow-hidden"
                style={{
                    background:
                        'linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-primary-dark) 100%)',
                }}
            >
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold glass-card border border-white/20 mb-4">
                        <Sparkles size={13} className="text-yellow-400" />
                        24/7 Dedicated Care & Rapid Admissions
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-tight">
                        Contact & Emergency Admissions
                    </h1>

                    <p className="text-white/85 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Whether you are reaching out for yourself or a loved one in
                        crisis, our medical & counseling team is on standby 24 hours
                        a day.
                    </p>
                </div>
            </section>

            {/* ── Main Content Grid ── */}
            <section className="py-16 sm:py-20 px-4 bg-brand-bg">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* Emergency Card */}
                        <div
                            className="rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden"
                            style={{
                                background:
                                    'linear-gradient(135deg, var(--theme-secondary) 0%, var(--theme-secondary-dark) 100%)',
                            }}
                        >
                            <div className="flex items-start gap-4 mb-5">
                                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                                    <AlertCircle size={26} className="text-white" />
                                </div>

                                <div>
                                    <span className="text-xs font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-md">
                                        Immediate Crisis Support
                                    </span>

                                    <h2 className="text-xl sm:text-2xl font-bold mt-1">
                                        24/7 Emergency Admission Helpline
                                    </h2>
                                </div>
                            </div>

                            <p className="text-white/90 text-sm mb-6 leading-relaxed">
                                Facing acute withdrawal symptoms, severe intoxication,
                                or psychiatric distress? Call our rapid response line
                                directly or chat with our team on WhatsApp.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                {phonePrimary && (
                                    <a
                                        href={`tel:${phonePrimary}`}
                                        className="bg-white text-brand-slate font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all text-sm shadow-md"
                                    >
                                        <PhoneCall
                                            size={18}
                                            style={{
                                                color: 'var(--theme-secondary)',
                                            }}
                                        />
                                        {phonePrimary}
                                    </a>
                                )}

                                {whatsappNum && (
                                    <a
                                        href={`https://wa.me/${whatsappNum}?text=I%20need%20immediate%20admission%20support`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm shadow-md"
                                    >
                                        <MessageCircle size={18} />
                                        WhatsApp Support
                                    </a>
                                )}

                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Address */}
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-start gap-4">
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                    style={{
                                        backgroundColor:
                                            'var(--theme-primary-tint)',
                                        color: 'var(--theme-primary)',
                                    }}
                                >
                                    <Building2 size={20} />
                                </div>

                                <div>
                                    <p className="text-xs text-brand-body font-bold uppercase tracking-wider mb-1">
                                        Campus Location
                                    </p>

                                    <p className="text-sm font-semibold text-brand-slate leading-snug">
                                        {fullAddress || 'Address not available'}
                                    </p>
                                </div>
                            </div>

                            {/* Secondary Phone */}
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-start gap-4">
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                    style={{
                                        backgroundColor:
                                            'var(--theme-primary-tint)',
                                        color: 'var(--theme-primary)',
                                    }}
                                >
                                    <Phone size={20} />
                                </div>

                                <div>
                                    <p className="text-xs text-brand-body font-bold uppercase tracking-wider mb-1">
                                        Secondary Helpline
                                    </p>

                                    {phoneSecondary ? (
                                        <a
                                            href={`tel:${phoneSecondary}`}
                                            className="text-sm font-semibold hover:underline block"
                                            style={{
                                                color: 'var(--theme-primary)',
                                            }}
                                        >
                                            {phoneSecondary}
                                        </a>
                                    ) : (
                                        <span className="text-sm text-brand-body">
                                            Not available
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-start gap-4">
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                    style={{
                                        backgroundColor:
                                            'var(--theme-primary-tint)',
                                        color: 'var(--theme-primary)',
                                    }}
                                >
                                    <Mail size={20} />
                                </div>

                                <div>
                                    <p className="text-xs text-brand-body font-bold uppercase tracking-wider mb-1">
                                        Email Inquiry
                                    </p>

                                    {email ? (
                                        <a
                                            href={`mailto:${email}`}
                                            className="text-sm font-semibold hover:underline block"
                                            style={{
                                                color: 'var(--theme-primary)',
                                            }}
                                        >
                                            {email}
                                        </a>
                                    ) : (
                                        <span className="text-sm text-brand-body">
                                            Not available
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Office Hours */}
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-start gap-4">
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                                    style={{
                                        backgroundColor:
                                            'var(--theme-primary-tint)',
                                        color: 'var(--theme-primary)',
                                    }}
                                >
                                    <Clock size={20} />
                                </div>

                                <div>
                                    <p className="text-xs text-brand-body font-bold uppercase tracking-wider mb-1">
                                        Visiting Hours
                                    </p>

                                    <p className="text-sm font-semibold text-brand-slate leading-snug">
                                        {officeHours}
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Map */}
                        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between mb-3 px-1">
                                <h3 className="font-bold text-brand-slate text-base flex items-center gap-2">
                                    <MapPin
                                        size={18}
                                        style={{
                                            color: 'var(--theme-primary)',
                                        }}
                                    />
                                    Find Our Centre on Map
                                </h3>

                                <span className="text-xs text-brand-body">
                                    Open in GPS
                                </span>
                            </div>

                            <div className="rounded-2xl overflow-hidden border border-gray-100 aspect-video max-h-72 w-full">
                                {mapsEmbed ? (
                                    <iframe
                                        title={`${siteName} Location`}
                                        src={mapsEmbed}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                ) : (
                                    <div className="w-full h-full min-h-[250px] flex items-center justify-center bg-gray-50 text-sm text-gray-500">
                                        Map location is not configured.
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-3xl p-7 sm:p-9 border border-gray-100 shadow-sm sticky top-24">

                            <div className="flex items-center gap-2.5 mb-2">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{
                                        backgroundColor:
                                            'var(--theme-primary-tint)',
                                        color: 'var(--theme-primary)',
                                    }}
                                >
                                    <Shield size={16} />
                                </div>

                                <span className="text-xs font-bold uppercase tracking-wider text-brand-body">
                                    Confidential Counseling
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold text-brand-slate mb-2">
                                Send an Inquiry
                            </h2>

                            <p className="text-sm text-brand-body mb-6">
                                Leave your query below. Our counseling team guarantees
                                complete privacy and responds promptly.
                            </p>

                            {wasSuccessful ? (
                                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                                    <CheckCircle
                                        size={46}
                                        className="text-green-500 mx-auto mb-3"
                                    />

                                    <h3 className="font-bold text-green-800 text-xl mb-1">
                                        Message Received!
                                    </h3>

                                    <p className="text-green-700 text-sm leading-relaxed">
                                        Our senior counselor will contact you privately
                                        within the hour. You took the right step today. 🙏
                                    </p>
                                </div>
                            ) : (
                                <form
                                    onSubmit={submit}
                                    className="space-y-4"
                                >

                                    {/* Honeypot */}
                                    <input
                                        type="text"
                                        name="website"
                                        value={data.website}
                                        onChange={(e) =>
                                            setData('website', e.target.value)
                                        }
                                        className="hidden"
                                        tabIndex={-1}
                                        autoComplete="off"
                                    />

                                    {/* Name */}
                                    <div>
                                        <label className="text-xs font-bold text-brand-slate uppercase tracking-wide block mb-1">
                                            Full Name *
                                        </label>

                                        <input
                                            type="text"
                                            required
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            placeholder="Your name"
                                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all"
                                        />

                                        {errors.name && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="text-xs font-bold text-brand-slate uppercase tracking-wide block mb-1">
                                            Phone Number *
                                        </label>

                                        <input
                                            type="tel"
                                            required
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData('phone', e.target.value)
                                            }
                                            placeholder="+91 XXXXX XXXXX"
                                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all"
                                        />

                                        {errors.phone && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="text-xs font-bold text-brand-slate uppercase tracking-wide block mb-1">
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            placeholder="you@example.com (optional)"
                                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all"
                                        />
                                    </div>

                                    {/* Addiction */}
                                    <div>
                                        <label className="text-xs font-bold text-brand-slate uppercase tracking-wide block mb-1">
                                            Primary Substance / Concern
                                        </label>

                                        <select
                                            value={data.addiction_type}
                                            onChange={(e) =>
                                                setData(
                                                    'addiction_type',
                                                    e.target.value
                                                )
                                            }
                                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all"
                                        >
                                            <option value="">
                                                Select addiction type (optional)
                                            </option>
                                            <option value="alcohol">
                                                Alcohol Addiction
                                            </option>
                                            <option value="drugs">
                                                Narcotics / Substance Abuse
                                            </option>
                                            <option value="prescription">
                                                Prescription Pills
                                            </option>
                                            <option value="tobacco">
                                                Tobacco / Gutkha / Nicotine
                                            </option>
                                            <option value="multiple">
                                                Multiple Substances
                                            </option>
                                            <option value="other">
                                                Other Behavioral Addiction
                                            </option>
                                        </select>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="text-xs font-bold text-brand-slate uppercase tracking-wide block mb-1">
                                            Message / Question
                                        </label>

                                        <textarea
                                            rows={3}
                                            value={data.message}
                                            onChange={(e) =>
                                                setData('message', e.target.value)
                                            }
                                            placeholder="Share any specific requirements or ask questions..."
                                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all resize-none"
                                        />

                                        {errors.message && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="btn-primary w-full justify-center py-3.5 text-base font-bold shadow-md gap-2"
                                    >
                                        <Send size={16} />

                                        {processing
                                            ? 'Submitting Message…'
                                            : 'Send Confidential Inquiry'}
                                    </button>

                                    <div className="flex items-center justify-center gap-1.5 text-xs text-brand-body pt-2">
                                        <HeartHandshake
                                            size={14}
                                            className="text-emerald-500"
                                        />
                                        Strict doctor-patient confidentiality
                                        guaranteed.
                                    </div>
                                </form>
                            )}

                        </div>
                    </div>

                </div>
            </section>

            {/* ── Admission Roadmap ── */}
            <section className="py-16 px-4 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto">

                    <div className="text-center mb-12">
                        <span
                            className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 inline-block"
                            style={{
                                backgroundColor:
                                    'var(--theme-primary-tint)',
                                color: 'var(--theme-primary)',
                            }}
                        >
                            Simple Admission Roadmap
                        </span>

                        <h2 className="section-title">
                            What Happens When You Reach Out?
                        </h2>

                        <p className="section-subtitle">
                            A transparent, caring 4-step process designed to remove
                            stress and begin treatment promptly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                step: '01',
                                title: 'Initial Call / Inquiry',
                                desc: 'Speak to a compassionate counselor who listens without judgment and evaluates urgency.',
                            },
                            {
                                step: '02',
                                title: 'Clinical Assessment',
                                desc: 'Our psychiatrist conducts a pre-admission health and psychiatric evaluation.',
                            },
                            {
                                step: '03',
                                title: 'Comfortable Admission',
                                desc: 'Smooth check-in to a private/shared room with medical detox protocol initiation.',
                            },
                            {
                                step: '04',
                                title: 'Structured Recovery',
                                desc: 'Evidence-based therapy, yoga, family counseling, and long-term relapse prevention.',
                            },
                        ].map((s) => (
                            <div
                                key={s.step}
                                className="p-6 rounded-2xl border border-gray-100 bg-brand-bg shadow-xs relative"
                            >
                                <span className="text-3xl font-black text-gray-300/80 mb-2 block">
                                    {s.step}
                                </span>

                                <h3 className="font-bold text-brand-slate text-lg mb-2">
                                    {s.title}
                                </h3>

                                <p className="text-sm text-brand-body leading-relaxed">
                                    {s.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </PublicLayout>
    );
}