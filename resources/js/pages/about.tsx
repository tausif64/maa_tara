import { Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import SeoHead from '@/components/public/SeoHead';
import {
    Award, Heart, Users, CheckCircle, Phone, Calendar,
    Shield, Sparkles, Building2, Target, HeartHandshake,
    Stethoscope, Activity, ArrowRight
} from 'lucide-react';

interface TeamMember {
    id: number;
    name: string;
    designation: string;
    qualification: string;
    bio: string;
    experience_years: number;
}

interface Props {
    teamMembers?: TeamMember[];
    team?: TeamMember[];
}

const values = [
    {
        icon: Heart,
        title: 'Compassion & Dignity',
        desc: 'We treat every individual with absolute empathy, dignity, and zero judgment throughout their stay and recovery.',
    },
    {
        icon: Award,
        title: 'Clinical Excellence',
        desc: 'Adherence to standardized psychiatric protocols, modern pharmacological detox, and evidence-based CBT.',
    },
    {
        icon: Users,
        title: 'Family Reunification',
        desc: 'Actively involving families in structured therapy to rebuild trust, heal trauma, and establish a supportive home.',
    },
    {
        icon: Shield,
        title: 'Complete Confidentiality',
        desc: 'Strict privacy policies ensure that identity, medical history, and treatment records remain 100% confidential.',
    },
];

const approach = [
    {
        step: '01',
        title: 'Biopsychosocial Assessment',
        desc: 'Comprehensive multi-parameter evaluation covering physical vitals, substance dependence severity, and co-occurring psychiatric conditions.',
    },
    {
        step: '02',
        title: 'Medically Supervised Detox',
        desc: 'Round-the-clock clinical detox protocol to manage withdrawal symptoms safely with minimal discomfort and zero medical risk.',
    },
    {
        step: '03',
        title: 'Psychotherapy & Counseling',
        desc: 'Daily one-on-one Cognitive Behavioral Therapy (CBT), Motivational Enhancement Therapy (MET), and group sharing circles.',
    },
    {
        step: '04',
        title: 'Holistic Mind-Body Healing',
        desc: 'Morning yoga, guided pranayama breathwork, fitness, balanced nutrition, and healthy routine rebuilding.',
    },
    {
        step: '05',
        title: 'Relapse Prevention & Aftercare',
        desc: 'Structured coping strategies, trigger identification, alumni peer support, and ongoing scheduled OPD follow-ups.',
    },
];

export default function About({ teamMembers, team }: Props) {
    const { settings = {} } = usePage().props as { settings?: Record<string, string> };

    const siteName = settings['site_name'] || 'Maa Tara Freedom Trust';
    const phone = settings['phone_primary'] || '+91-9876543210';

    const stat1Val = settings['stat1_value'] || '100+';
    const stat1Lbl = settings['stat1_label'] || 'Lives Restored';

    const stat2Val = settings['stat_2_value'] || '4';
    const stat2Lbl = settings['stat_2_label'] || 'Clinicians & Counselors';

    const stat3Val = settings['stat_3_value'] || '95%';
    const stat3Lbl = settings['stat_3_label'] || 'Recovery Rate';

    const stat4Val = settings['stat_4_value'] || '3+';
    const stat4Lbl = settings['stat_4_label'] || 'Years of Experience';

    const staff = teamMembers || team || [];

    return (
        <PublicLayout title="About Us">
            <SeoHead
                title={`About Us — Best Rehab Center in Ranchi & Jharkhand | ${siteName}`}
                description={`Learn about ${siteName}, the leading government-approved Nasha Mukti Kendra and De-Addiction Rehabilitation Centre in Ranchi, Jharkhand. Our team of psychiatrists, clinical psychologists, and counselors provide 24/7 compassionate recovery care.`}
                canonicalPath="/about"
                keywords={[
                    'about maa tara freedom trust',
                    'best rehab center in ranchi about',
                    'government approved rehab center in ranchi',
                    'nasha mukti kendra ranchi doctors',
                    'de addiction experts ranchi',
                    'addiction psychiatrist jharkhand',
                    'rehabilitation team ranchi',
                ]}
                settings={settings}
            />

            {/* ── Page Hero ── */}
            <section
                className="relative py-16 sm:py-24 text-white text-center px-4 overflow-hidden"
                style={{ background: 'linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-primary-dark) 100%)' }}
            >
                <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold glass-card border border-white/20 mb-4">
                        <Sparkles size={13} className="text-yellow-400" />
                        A Decade of Healing & Transforming Lives
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 tracking-tight">
                        About {siteName}
                    </h1>
                    <p className="text-white/85 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Dedicated to restoring hope, healing families, and empowering individuals to break free from addiction through science-backed clinical rehabilitation.
                    </p>
                </div>
            </section>

            {/* ── Mission & Story ── */}
            <section className="py-16 sm:py-20 px-4 bg-brand-bg">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: 'var(--theme-primary-tint)', color: 'var(--theme-primary)' }}>
                            <Target size={14} /> Our Purpose & Foundation
                        </div>
                        <h2 className="section-title text-left mb-0">
                            Rebuilding Dignity, Restoring Health & Reuniting Families
                        </h2>
                        <p className="text-brand-body text-base sm:text-lg leading-relaxed">
                            <strong>{siteName}</strong> was founded with a deep commitment: to provide accessible, compassionate, and medically rigorous de-addiction and mental healthcare services in Jharkhand and across India.
                        </p>
                        <p className="text-brand-body leading-relaxed text-sm sm:text-base">
                            We treat addiction not as a moral failure, but as a complex, treatable biopsychosocial disorder. Our multidisciplinary care model unites senior psychiatrists, clinical psychologists, certified addiction counselors, and trained medical nursing staff under one serene, healing campus.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link href="/appointment" className="btn-primary">
                                <Calendar size={18} /> Schedule Consultation
                            </Link>
                            <Link href="/contact" className="btn-outline-primary">
                                Contact Care Team
                            </Link>
                        </div>
                    </div>

                    {/* Stats Quad */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                        {[
                            { value: stat1Val, label: stat1Lbl, icon: HeartHandshake },
                            { value: stat2Val, label: stat2Lbl, icon: Stethoscope },
                            { value: stat3Val, label: stat3Lbl, icon: Award },
                            { value: stat4Val, label: stat4Lbl, icon: Building2 },
                        ].map((s) => (
                            <div
                                key={s.label}
                                className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-xs card-hover flex flex-col items-center justify-center"
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-white"
                                    style={{ backgroundColor: 'var(--theme-primary)' }}
                                >
                                    <s.icon size={20} />
                                </div>
                                <div className="text-2xl sm:text-3xl font-extrabold text-brand-slate mb-1" style={{ color: 'var(--theme-primary)' }}>
                                    {s.value}
                                </div>
                                <div className="text-xs text-brand-body font-medium">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Core Values ── */}
            <section className="py-16 sm:py-20 px-4 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 inline-block" style={{ backgroundColor: 'var(--theme-primary-tint)', color: 'var(--theme-primary)' }}>
                            Guiding Philosophy
                        </span>
                        <h2 className="section-title">Our Core Pillars of Care</h2>
                        <p className="section-subtitle">
                            The ethical and clinical standards that anchor every decision, treatment plan, and patient interaction.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((v) => (
                            <div key={v.title} className="p-6 rounded-2xl border border-gray-100 bg-brand-bg card-hover flex flex-col justify-between">
                                <div>
                                    <div
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-white shadow-xs"
                                        style={{ backgroundColor: 'var(--theme-primary)' }}
                                    >
                                        <v.icon size={22} />
                                    </div>
                                    <h3 className="font-bold text-brand-slate text-lg mb-2">{v.title}</h3>
                                    <p className="text-sm text-brand-body leading-relaxed">{v.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Clinical Approach Roadmap ── */}
            <section className="py-16 sm:py-20 px-4" style={{ backgroundColor: 'var(--theme-primary-tint)' }}>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 inline-block bg-white shadow-xs" style={{ color: 'var(--theme-primary)' }}>
                            Structured Treatment
                        </span>
                        <h2 className="section-title">Our 5-Stage Clinical Framework</h2>
                        <p className="section-subtitle">
                            A carefully designed pathway from acute stabilization to sustained lifelong independence.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {approach.map((a) => (
                            <div key={a.step} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 bg-white rounded-2xl p-6 shadow-xs border border-white card-hover">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shrink-0 shadow-xs"
                                    style={{ backgroundColor: 'var(--theme-primary)' }}
                                >
                                    {a.step}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-brand-slate text-base sm:text-lg mb-1">{a.title}</h3>
                                    <p className="text-sm text-brand-body leading-relaxed">{a.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Multidisciplinary Team ── */}
            {staff.length > 0 && (
                <section className="py-16 sm:py-20 px-4 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-14">
                            <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3 inline-block" style={{ backgroundColor: 'var(--theme-primary-tint)', color: 'var(--theme-primary)' }}>
                                Medical Experts
                            </span>
                            <h2 className="section-title">Meet Our Clinical Specialists</h2>
                            <p className="section-subtitle">
                                Certified psychiatrists, clinical psychologists, and addiction rehabilitation specialists.
                            </p>
                        </div>

                        <div
                            className={`
                                ${staff.length === 1
                                    ? 'max-w-3xl mx-auto'
                                    : staff.length === 2
                                        ? 'max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8'
                                        : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                }
                            `}
                        >
                            {staff.map((m) => (
                                <div
                                    key={m.id}
                                    className={`
                                      bg-brand-bg rounded-3xl border border-gray-100
                                        card-hover
                                        ${staff.length <= 2
                                            ? 'p-8 sm:p-10'
                                            : 'p-7'
                                        }
                                    `}
                                >
                                    <div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div
                                                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shrink-0 shadow-xs"
                                                style={{ backgroundColor: 'var(--theme-primary)' }}
                                            >
                                                {m.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-brand-slate text-lg leading-tight">{m.name}</h3>
                                                <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--theme-secondary)' }}>
                                                    {m.designation}
                                                </p>
                                                {m.qualification && (
                                                    <p className="text-xs text-gray-500 mt-0.5">{m.qualification}</p>
                                                )}
                                            </div>
                                        </div>
                                        {m.bio && (
                                            <p className="text-sm text-brand-body leading-relaxed line-clamp-4 mb-4">
                                                {m.bio}
                                            </p>
                                        )}
                                    </div>
                                    <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between">
                                        <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                            <Activity size={13} className="text-emerald-500" /> Active Clinician
                                        </span>
                                        {m.experience_years > 0 && (
                                            <span className="text-xs font-bold px-2.5 py-1 rounded-md" style={{ backgroundColor: 'var(--theme-primary-tint)', color: 'var(--theme-primary)' }}>
                                                {m.experience_years}+ Yrs Exp
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Final Call to Action ── */}
            <section
                className="py-16 px-4 text-center text-white relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, var(--theme-secondary) 0%, var(--theme-secondary-dark) 100%)' }}
            >
                <div className="max-w-3xl mx-auto relative z-10">
                    <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">You Don't Have to Fight Alone</h2>
                    <p className="text-white/90 text-base sm:text-lg mb-8 leading-relaxed">
                        Take the first step toward a renewed life. Call our 24/7 confidential helpline or schedule an in-person assessment.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href={`tel:${phone}`}
                            className="bg-white font-extrabold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 text-base shadow-lg"
                            style={{ color: 'var(--theme-secondary)' }}
                        >
                            <Phone size={20} /> Call Helpline ({phone})
                        </a>
                        <Link
                            href="/appointment"
                            className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-base"
                        >
                            <Calendar size={20} /> Book Appointment
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
