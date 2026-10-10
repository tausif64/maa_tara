import { useEffect, useRef, useState, useCallback } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import DynamicIcon from '@/components/DynamicIcon';
import SeoHead from '@/components/public/SeoHead';
import { generateLocalBusinessSchema } from '@/lib/seo-keywords';
import {
    Phone, Calendar, ChevronDown, ChevronUp, CheckCircle,
    Heart, Shield, Users, Award, MapPin, Bed, Activity,
    Apple, Dumbbell, Clock, Star, Sparkles, ArrowRight,
    Check, MessageCircle, AlertCircle, ChevronLeft, ChevronRight
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Service {
    id: number;
    title: string;
    short_description?: string;
    description?: string;
    full_description?: string;
    icon?: string;
}
interface Faq { id: number; question: string; answer: string; }
interface Testimonial { id: number; patient_name: string; message: string; rating: number; location: string; }
interface HeroSlide { id: number; image_path: string; sort_order: number; is_active: boolean; }
interface Props { services: Service[]; faqs: Faq[]; testimonials: Testimonial[]; heroSlides?: HeroSlide[]; }

// ── Animated counter ──────────────────────────────────────────────────────────
function Counter({ target, label, suffix = '' }: { target: number; label: string; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    let start = 0;
                    const step = Math.max(1, Math.ceil(target / 60));
                    const timer = setInterval(() => {
                        start += step;
                        if (start >= target) { setCount(target); clearInterval(timer); }
                        else setCount(start);
                    }, 25);
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [target]);

    return (
        <div ref={ref} className="text-center p-4 rounded-2xl glass-card transition-all duration-300 hover:scale-105">
            <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1.5 tracking-tight drop-shadow-sm">
                {count.toLocaleString()}{suffix}
            </div>
            <div className="text-xs sm:text-sm text-white/80 font-medium">{label}</div>
        </div>
    );
}

// ── Hero rotating words ───────────────────────────────────────────────────────
const heroWords = ['Alcohol Addiction', 'Drug Dependence', 'Substance Abuse', 'Tobacco & Nicotine', 'Prescription Pills'];

const facilityFeatures = [
    { icon: Bed, label: 'Comfortable Rooms', desc: 'Clean, air-conditioned private and shared accommodation with hygienic sanitisation.' },
    { icon: Activity, label: '24/7 Medical Care', desc: 'Round-the-clock psychiatric and medical supervision by certified clinicians.' },
    { icon: Apple, label: 'Nutritious Meals', desc: 'Dietitian-approved balanced meal plans supporting physical and biochemical recovery.' },
    { icon: Heart, label: 'Therapy Suites', desc: 'Individual, group, and family counseling in tranquil, distraction-free spaces.' },
    { icon: Dumbbell, label: 'Yoga & Meditation', desc: 'Daily morning yoga, breathwork, and fitness regimes for mind-body balance.' },
    { icon: Star, label: 'Recreational Spaces', desc: 'Indoor recreation, library, landscaped garden walks, and community zones.' },
];

const pillars = [
    { icon: Award, title: 'Expert Medical Team', desc: 'Renowned psychiatrists, clinical psychologists, and addiction therapists.' },
    { icon: Shield, title: 'Safe & Confidential', desc: 'Modern, peaceful rehabilitation campus with 24/7 security and strict privacy.' },
    { icon: Users, title: 'Personalised Roadmaps', desc: 'Every individual receives a customised, evidence-based multi-step recovery plan.' },
    { icon: Heart, title: 'Family-Centred Care', desc: 'Structured counseling and education to heal relationships and prevent relapse.' },
    { icon: CheckCircle, title: 'Govt. Approved & Regulated', desc: 'Registered trust adhering to international clinical standards and protocols.' },
    { icon: Clock, title: '24×7 Emergency Admissions', desc: 'Instant crisis intervention, round-the-clock helplines, and rapid admission.' },
];

// ── Facility features ─────────────────────────────────────────────────────────
const facilityFeatures = [
    { icon: Bed, label: 'Comfortable Rooms', desc: 'Clean, air-conditioned private and shared accommodation with hygienic sanitisation.' },
    { icon: Activity, label: '24/7 Medical Care', desc: 'Round-the-clock psychiatric and medical supervision by certified clinicians.' },
    { icon: Apple, label: 'Nutritious Meals', desc: 'Dietitian-approved balanced meal plans supporting physical and biochemical recovery.' },
    { icon: Heart, label: 'Therapy Suites', desc: 'Individual, group, and family counseling in tranquil, distraction-free spaces.' },
    { icon: Dumbbell, label: 'Yoga & Meditation', desc: 'Daily morning yoga, breathwork, and fitness regimes for mind-body balance.' },
    { icon: Star, label: 'Recreational Spaces', desc: 'Indoor recreation, library, landscaped garden walks, and community zones.' },
];

// ── Trust pillars ─────────────────────────────────────────────────────────────
const pillars = [
    { icon: Award, title: 'Expert Medical Team', desc: 'Renowned psychiatrists, clinical psychologists, and addiction therapists.' },
    { icon: Shield, title: 'Safe & Confidential', desc: 'Modern, peaceful rehabilitation campus with 24/7 security and strict privacy.' },
    { icon: Users, title: 'Personalised Roadmaps', desc: 'Every individual receives a customised, evidence-based multi-step recovery plan.' },
    { icon: Heart, title: 'Family-Centred Care', desc: 'Structured counseling and education to heal relationships and prevent relapse.' },
    { icon: CheckCircle, title: 'Govt. Approved & Regulated', desc: 'Registered trust adhering to international clinical standards and protocols.' },
    { icon: Clock, title: '24×7 Emergency Admissions', desc: 'Instant crisis intervention, round-the-clock helplines, and rapid admission.' },
];

// ── FAQ Item ──────────────────────────────────────────────────────────────────
function FaqItem({ faq }: { faq: Faq }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-gray-200/80 rounded-2xl overflow-hidden bg-white shadow-xs transition-all duration-200 hover:border-gray-300">
            <button
                className="w-full text-left px-5 py-4 flex items-center justify-between font-semibold text-brand-slate hover:bg-gray-50/80 transition-colors"
                onClick={() => setOpen(!open)}
            >
                <span className="pr-4 text-sm sm:text-base">{faq.question}</span>
                {open ? (
                    <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-blue-50 text-tp" style={{ color: 'var(--theme-primary)' }}>
                        <ChevronUp size={18} />
                    </span>
                ) : (
                    <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gray-100 text-gray-500">
                        <ChevronDown size={18} />
                    </span>
                )}
            </button>
            {open && (
                <div className="px-5 pb-5 text-sm text-brand-body leading-relaxed border-t border-gray-100 pt-3">
                    {faq.answer}
                </div>
            )}
        </div>
    );
}

// ── Main Home Page ────────────────────────────────────────────────────────────
export default function Home({ services, faqs, testimonials, heroSlides = [] }: Props) {
    const { settings = {} } = usePage().props as { settings?: Record<string, string> };

    const siteName = settings['site_name'] || 'Maa Tara Freedom Trust';
    const heroTitle = settings['hero_title'] || 'Break Free & Reclaim Your Life';
    const heroSubtitle = settings['hero_subtitle'] || `${siteName} is a premier de-addiction and rehabilitation centre providing medically supervised detox, clinical counseling, and lifelong relapse prevention.`;
    const heroCta1 = settings['hero_cta_primary'] || 'Call for Immediate Help';
    const heroCta2 = settings['hero_cta_secondary'] || 'Book Confidential Consultation';
    const phone = settings['phone_primary'] || '+91-9876543210';
    const rawWhatsapp = settings['whatsapp_number'] || '919876543210';
    const whatsappNum = rawWhatsapp.replace(/\D/g, '');

    const stat1Val = parseInt(settings['stat1_value'] || '1200', 10) || 1200;
    const stat1Lbl = settings['stat1_label'] || 'Recovered Lives';

    const stat2Val = parseInt(settings['stat2_value'] || '12', 10) || 12;
    const stat2Lbl = settings['stat2_label'] || 'Expert Doctors & Counselors';

    const stat3Val = parseInt(settings['hero_stat_3_value'] || '95', 10) || 95;
    const stat3Lbl = settings['stat3_label'] || 'Success Rate';

    const stat4Val = parseInt(settings['stat4_value'] || '10', 10) || 10;
    const stat4Lbl = settings['stat4_label'] || 'Years of Service';

    const [wordIndex, setWordIndex] = useState(0);
    const [animKey, setAnimKey] = useState(0);

    // ── Hero Carousel ──────────────────────────────────────────────────────────
    const activeSlides = heroSlides.filter(s => s.is_active);
    const hasSlides = activeSlides.length > 0;
    const [slideIndex, setSlideIndex] = useState(0);
    const slideTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const nextSlide = useCallback(() => {
        setSlideIndex(i => (i + 1) % activeSlides.length);
    }, [activeSlides.length]);

    const prevSlide = useCallback(() => {
        setSlideIndex(i => (i - 1 + activeSlides.length) % activeSlides.length);
    }, [activeSlides.length]);

    const resetSlideTimer = useCallback(() => {
        if (slideTimerRef.current) clearInterval(slideTimerRef.current);
        if (activeSlides.length > 1) {
            slideTimerRef.current = setInterval(nextSlide, 5000);
        }
    }, [activeSlides.length, nextSlide]);

    useEffect(() => {
        resetSlideTimer();
        return () => { if (slideTimerRef.current) clearInterval(slideTimerRef.current); };
    }, [resetSlideTimer]);

    const { data, setData, post, processing, errors, reset, wasSuccessful } = useForm({
        name: '', phone: '', email: '', addiction_type: '', message: '', website: '',
    });

    useEffect(() => {
        const t = setInterval(() => {
            setWordIndex((i) => (i + 1) % heroWords.length);
            setAnimKey((k) => k + 1);
        }, 2600);
        return () => clearInterval(t);
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', { onSuccess: () => reset() });
    };

    const faqSchema = faqs && faqs.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
            },
        })),
    } : null;

    const homeSchemas = [
        generateLocalBusinessSchema(settings),
        ...(faqSchema ? [faqSchema] : []),
    ];

    return (
        <PublicLayout>
            <SeoHead
                title={`${siteName} — Best Rehab Center in Ranchi & Jharkhand | Nasha Mukti Kendra`}
                description="Maa Tara Freedom Trust is rated the best rehab center in Ranchi & Jharkhand, India. Government-approved Nasha Mukti Kendra providing 24/7 medical detox, alcohol & drug de-addiction, psychiatric care, and holistic lifelong recovery."
                canonicalPath="/"
                schemaJson={homeSchemas}
                settings={settings}
            />

            {/* ── Hero Section with Dynamic Carousel & Animations ── */}
            <section
                className="relative min-h-[80vh] flex items-center justify-center text-white overflow-hidden py-12 sm:py-16"
                style={{
                    background: 'radial-gradient(circle at 50% 20%, var(--theme-primary) 0%, var(--theme-primary-dark, #061D42) 65%, #051329 100%)',
                }}
            >
                {/* Background Carousel Slides */}
                {hasSlides && (
                    <div className="absolute inset-0 z-0">
                        {activeSlides.map((slide, idx) => (
                            <div
                                key={slide.id}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                    idx === slideIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                }`}
                            >
                                <img
                                    src={slide.image_path}
                                    alt="Rehabilitation Campus"
                                    className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
                                />
                                {/* Dark Multi-stop Gradient Overlay for Crisp Text Contrast */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/60 to-slate-900/45" />
                                <div className="absolute inset-0 bg-black/25" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Floating Glow Orbs */}
                <div className="absolute top-12 left-1/4 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl animate-pulse-glow pointer-events-none z-1" />
                <div className="absolute bottom-16 right-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl animate-pulse-glow pointer-events-none z-1" />
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none z-1" />

                {/* Subtle Grid Background */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none z-1"
                    style={{
                        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                    }}
                />

                {/* Carousel Navigation Arrows (Visible when > 1 slide) */}
                {hasSlides && activeSlides.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => { prevSlide(); resetSlideTimer(); }}
                            aria-label="Previous slide"
                            className="absolute left-3 sm:left-6 top-1/2 md:top-1/3 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/30 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-sm border border-white/10 transition-all duration-200 hover:scale-110 shadow-lg"
                        >
                            <ChevronLeft size={22} className="sm:w-6 sm:h-6" />
                        </button>
                        <button
                            type="button"
                            onClick={() => { nextSlide(); resetSlideTimer(); }}
                            aria-label="Next slide"
                            className="absolute right-3 sm:right-6 top-1/2 md:top-1/3 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/30 hover:bg-black/60 text-white/80 hover:text-white backdrop-blur-sm border border-white/10 transition-all duration-200 hover:scale-110 shadow-lg"
                        >
                            <ChevronRight size={22} className="sm:w-6 sm:h-6" />
                        </button>

                        {/* Carousel Dot Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/10">
                            {activeSlides.map((s, idx) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => { setSlideIndex(idx); resetSlideTimer(); }}
                                    aria-label={`Go to slide ${idx + 1}`}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        idx === slideIndex ? 'w-6 bg-orange-500' : 'w-2 bg-white/50 hover:bg-white'
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">

                    {/* Top Govt badge & Live Helpline indicator */}
                    <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-6">
                        <span className="glass-card inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full text-white/90 shadow-sm border border-white/20">
                            <Sparkles size={13} className="text-yellow-400" />
                            Government Approved Rehabilitation Centre
                        </span>
                        <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            24/7 Helpline Active
                        </span>
                    </div>

                    {/* Main Headline with Animated Rotating Word */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.12] tracking-tight">
                        {heroTitle}
                        <br />
                        <span className="text-white/90">From </span>
                        <span
                            key={animKey}
                            className="inline-block animate-word-fade font-black drop-shadow-md pb-1 border-b-4"
                            style={{
                                color: 'var(--theme-accent, #F4A213)',
                                borderColor: 'var(--theme-secondary, #E85D04)',
                            }}
                        >
                            {heroWords[wordIndex]}
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-base sm:text-lg md:text-xl text-white/85 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
                        {heroSubtitle}
                    </p>

                    {/* CTA Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <a
                            href={`tel:${phone}`}
                            className="btn-secondary w-full sm:w-auto text-base px-8 py-4 gap-2.5 font-bold shadow-xl hover:scale-105 transition-transform"
                        >
                            <Phone size={20} /> {heroCta1}
                        </a>
                        <a
                            href="/appointment"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold bg-white text-brand-slate hover:bg-gray-100 shadow-xl hover:scale-105 transition-all"
                        >
                            <Calendar size={20} style={{ color: 'var(--theme-primary)' }} />
                            {heroCta2}
                        </a>
                    </div>

                    {/* Trust Highlight Badges */}
                    <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs sm:text-sm text-white/80 font-medium">
                        <span className="glass-card px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                            <Check size={14} className="text-emerald-400" /> 100% Confidential
                        </span>
                        <span className="glass-card px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                            <Check size={14} className="text-emerald-400" /> Medically Supervised Detox
                        </span>
                        <span className="glass-card px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                            <Check size={14} className="text-emerald-400" /> Expert Clinical Team
                        </span>
                    </div>

                    {/* Floating Hero Stats Bar */}
                    <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        <Counter target={stat1Val} label={stat1Lbl} suffix="+" />
                        <Counter target={stat2Val} label={stat2Lbl} suffix="+" />
                        <Counter target={stat3Val} label={stat3Lbl} suffix="%" />
                        <Counter target={stat4Val} label={stat4Lbl} suffix="+" />
                    </div>

                </div>
            </section>

            {/* ── Emergency Strip ── */}
            <section
                className="py-5 px-4 shadow-md relative z-20"
                style={{ backgroundColor: 'var(--theme-secondary)' }}
            >
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-white text-center sm:text-left">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                            <AlertCircle size={22} className="text-white" />
                        </div>
                        <div>
                            <div className="font-extrabold text-base sm:text-lg leading-tight">24/7 Emergency De-Addiction Helpline</div>
                            <div className="text-xs text-white/85">Instant admissions & medical consultation across Jharkhand & India</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <a
                            href={`https://wa.me/${whatsappNum}?text=I%20need%20emergency%20de-addiction%20help`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <MessageCircle size={16} /> WhatsApp Help
                        </a>
                        <a
                            href={`tel:${phone}`}
                            className="bg-white font-extrabold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-all text-sm flex items-center gap-2 shadow-md"
                            style={{ color: 'var(--theme-secondary)' }}
                        >
                            <Phone size={17} /> {phone}
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Care Programmes ── */}
            <section className="py-20 bg-brand-bg px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 inline-block" style={{ backgroundColor: 'var(--theme-primary-tint)', color: 'var(--theme-primary)' }}>
                            Specialised Treatments
                        </span>
                        <h2 className="section-title">Evidence-Based Care Programmes</h2>
                        <p className="section-subtitle">
                            Compassionate, clinically structured pathways designed to heal addiction, restore mental health, and build lasting sobriety.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((s) => (
                            <div
                                key={s.id}
                                className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 card-hover flex flex-col justify-between"
                            >
                                <div>
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-xs"
                                        style={{ backgroundColor: 'var(--theme-primary-tint)', color: 'var(--theme-primary)' }}
                                    >
                                        <DynamicIcon name={s.icon} size={28} className="w-7 h-7" />
                                    </div>
                                    <h3 className="font-bold text-brand-slate text-xl mb-2.5">{s.title}</h3>
                                    <p className="text-sm text-brand-body leading-relaxed">{s.short_description || s.description}</p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <a
                                        href="/treatments"
                                        className="text-sm font-bold flex items-center gap-1.5 hover:gap-2.5 transition-all"
                                        style={{ color: 'var(--theme-primary)' }}
                                    >
                                        Explore Programme <ArrowRight size={15} />
                                    </a>
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-gray-50 text-gray-600">
                                        Residential & OPD
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Why Choose Us ── */}
            <section className="py-20 px-4" style={{ backgroundColor: 'var(--theme-primary-tint)' }}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 inline-block bg-white text-tp shadow-xs" style={{ color: 'var(--theme-primary)' }}>Why Trust Us</span>
                        <h2 className="section-title">Why Choose {siteName}?</h2>
                        <p className="section-subtitle">We combine advanced clinical protocols with empathetic care to give every patient the highest chance at lifelong recovery.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pillars.map((p) => (
                            <div key={p.title} className="flex gap-4 bg-white rounded-2xl p-6 shadow-sm border border-white/80 card-hover">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-white" style={{ backgroundColor: 'var(--theme-primary)' }}><p.icon size={22} /></div>
                                <div><h3 className="font-bold text-brand-slate text-base mb-1.5">{p.title}</h3><p className="text-sm text-brand-body leading-relaxed">{p.desc}</p></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Facilities Showcase ── */}
            <section className="py-20 bg-white px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 inline-block" style={{ backgroundColor: 'var(--theme-primary-tint)', color: 'var(--theme-primary)' }}>Our Campus</span>
                        <h2 className="section-title">Healing Environment & Facilities</h2>
                        <p className="section-subtitle">A peaceful, secure, and fully equipped sanctuary designed to support mental clarity, physical healing, and comfort.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {facilityFeatures.map((f) => (
                            <div key={f.label} className="flex items-start gap-4 p-6 rounded-2xl border border-gray-100 bg-brand-bg card-hover">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-white" style={{ backgroundColor: 'var(--theme-secondary)' }}><f.icon size={22} /></div>
                                <div><h3 className="font-bold text-brand-slate text-base mb-1">{f.label}</h3><p className="text-sm text-brand-body leading-relaxed">{f.desc}</p></div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12"><a href="/facilities" className="btn-primary">Explore Campus Facilities <ArrowRight size={16} /></a></div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            {testimonials.length > 0 && (
                <section className="py-20 px-4" style={{ backgroundColor: 'var(--theme-primary-tint)' }}>
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 inline-block bg-white text-tp shadow-xs" style={{ color: 'var(--theme-primary)' }}>
                                Real Stories
                            </span>
                            <h2 className="section-title">Stories of Hope & Recovery</h2>
                            <p className="section-subtitle">Read how our patients and their families transformed their lives.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {testimonials.map((t) => (
                                <div key={t.id} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 flex flex-col justify-between card-hover">
                                    <div>
                                        <div className="flex mb-4 gap-1">
                                            {Array.from({ length: t.rating }).map((_, i) => (
                                                <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                                            ))}
                                        </div>
                                        <p className="text-brand-body text-sm italic leading-relaxed mb-6">"{t.message}"</p>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100">
                                        <div className="font-bold text-brand-slate text-base">{t.patient_name}</div>
                                        {t.location && (
                                            <div className="text-xs text-brand-body mt-1 flex items-center gap-1">
                                                <MapPin size={12} className="text-gray-400" /> {t.location}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Lead Form + FAQ ── */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-6 bg-brand-bg rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm">
                        <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-white text-tp shadow-xs mb-3 inline-block" style={{ color: 'var(--theme-primary)' }}>Confidential Help</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-brand-slate mb-2">Request a Free Callback</h2>
                        <p className="text-sm text-brand-body mb-6">Fill in your contact details and our senior clinical counselor will get in touch with you within the hour.</p>
                        {wasSuccessful ? (
                            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                                <CheckCircle size={44} className="text-green-500 mx-auto mb-3" />
                                <h3 className="font-bold text-green-800 text-lg mb-1">Inquiry Submitted Successfully!</h3>
                                <p className="text-green-700 text-sm">Our medical counselor will contact you privately within the hour. 🙏</p>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="space-y-4">
                                <input type="text" name="website" value={data.website} onChange={e => setData('website', e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div><label className="text-xs font-bold text-brand-slate uppercase tracking-wide block mb-1">Full Name *</label><input type="text" required value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Your full name" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2" />{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}</div>
                                    <div><label className="text-xs font-bold text-brand-slate uppercase tracking-wide block mb-1">Phone Number *</label><input type="tel" required value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2" />{errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}</div>
                                </div>
                                <div><label className="text-xs font-bold text-brand-slate uppercase tracking-wide block mb-1">Email Address</label><input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="you@example.com (optional)" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2" /></div>
                                <div><label className="text-xs font-bold text-brand-slate uppercase tracking-wide block mb-1">Concern / Substance</label><select value={data.addiction_type} onChange={e => setData('addiction_type', e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2"><option value="">Select addiction type (optional)</option><option value="alcohol">Alcohol Addiction</option><option value="drugs">Narcotics / Drugs (Opioids, Cannabis, etc.)</option><option value="prescription">Prescription Medication</option><option value="tobacco">Tobacco / Nicotine</option><option value="multiple">Multiple Substances</option><option value="other">Other Behavioral Addiction</option></select></div>
                                <div><label className="text-xs font-bold text-brand-slate uppercase tracking-wide block mb-1">Message / Situation</label><textarea rows={3} value={data.message} onChange={e => setData('message', e.target.value)} placeholder="Briefly describe what you or your loved one is going through..." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 resize-none" /></div>
                                <button type="submit" disabled={processing} className="btn-primary w-full justify-center py-3.5 text-base font-bold shadow-lg">{processing ? 'Submitting Details…' : 'Request Free Callback'}</button>
                                <p className="text-xs text-brand-body text-center pt-1">🔒 100% Confidential. Your data is strictly protected.</p>
                            </form>
                        )}
                    </div>
                    <div className="lg:col-span-6">
                        <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-3 inline-block" style={{ backgroundColor: 'var(--theme-primary-tint)', color: 'var(--theme-primary)' }}>Common Questions</span>
                        <h2 className="section-title mb-2">Frequently Asked Questions</h2>
                        <p className="text-sm text-brand-body mb-6">Got questions about admission protocols, stay duration, medical safety, or costs? Here are answers to the most common queries.</p>
                        <div className="space-y-3.5">{faqs.slice(0, 6).map((f) => <FaqItem key={f.id} faq={f} />)}</div>
                    </div>
                </div>
            </section>

            {/* ── Final Call To Action ── */}
            <section
                className="py-16 px-4 text-center text-white relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, var(--theme-secondary) 0%, var(--theme-secondary-dark) 100%)' }}
            >
                <div className="max-w-3xl mx-auto relative z-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Start Your Recovery Journey Today</h2>
                    <p className="text-white/90 text-base sm:text-lg mb-8 leading-relaxed">
                        Don't let addiction take another day. Reach out now for compassionate, confidential, and professional guidance.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href={`tel:${phone}`}
                            className="bg-white font-extrabold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 text-base shadow-lg"
                            style={{ color: 'var(--theme-secondary)' }}
                        >
                            <Phone size={20} /> Call Helpline ({phone})
                        </a>
                        <a
                            href="/appointment"
                            className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-base"
                        >
                            <Calendar size={20} /> Book Appointment
                        </a>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
