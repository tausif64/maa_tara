import { Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import SeoHead from '@/components/public/SeoHead';
import DynamicIcon from '@/components/DynamicIcon';
import { ChevronRight, Phone } from 'lucide-react';

interface Service {
    id: number;
    title: string;
    short_description?: string;
    description?: string;
    full_description?: string;
    icon?: string;
}
interface Props { services: Service[]; }

const addictions = [
    { title: 'Alcoholism', icon: '🍺', desc: 'Medical detox, counselling, and long-term support for alcohol dependency including Delirium Tremens management.' },
    { title: 'Substance Abuse', icon: '💊', desc: 'Treatment for narcotics, opioids, cannabis, and stimulant dependency with medication-assisted therapy.' },
    { title: 'Prescription Drugs', icon: '🧴', desc: 'Safe tapering and withdrawal management for benzodiazepines, opioids, and other prescription medications.' },
    { title: 'Dual Diagnosis', icon: '🧠', desc: 'Co-occurring mental health and substance use disorders treated together by psychiatric professionals.' },
    { title: 'Tobacco / Nicotine', icon: '🚭', desc: 'Nicotine replacement therapy and behavioural support programmes.' },
    { title: 'Behavioural Addictions', icon: '📱', desc: 'Counselling for gaming, gambling, and internet addiction using cognitive behavioural therapy.' },
];

const steps = [
    { num: '01', title: 'Medical Assessment & Detox',      desc: 'Medically supervised withdrawal management in a safe clinical environment.' },
    { num: '02', title: 'Individual Counselling & Therapy', desc: 'One-on-one sessions with licensed psychologists using CBT, DBT, and motivational interviewing.' },
    { num: '03', title: 'Group Therapy',                    desc: 'Peer support sessions to build community, accountability, and shared coping strategies.' },
    { num: '04', title: 'Behavioural Modification',         desc: 'Life skills training, healthy routine building, and anger/stress management techniques.' },
    { num: '05', title: 'Family Counselling',               desc: 'Healing family relationships and educating loved ones on supporting the recovery process.' },
    { num: '06', title: 'Aftercare & Relapse Prevention',   desc: 'Ongoing check-ins, alumni support groups, and personalized trigger management strategies.' },
];

export default function Treatments({ services }: Props) {
    const { settings = {} } = usePage().props as { settings?: Record<string, string> };
    const siteName = settings['site_name'] || 'Maa Tara Freedom Trust';

    return (
        <PublicLayout title="Treatments">
            <SeoHead
                title={`Treatment Programs — Best Rehab Center in Ranchi & Jharkhand | ${siteName}`}
                description={`Explore evidence-based rehabilitation and de-addiction programs at ${siteName}, Ranchi. Specialized treatment for alcohol, drugs, brown sugar, smack, cannabis, prescription medications, and psychiatric dual diagnosis.`}
                canonicalPath="/treatments"
                keywords={[
                    'alcohol rehabilitation centre in ranchi',
                    'drug de addiction centre in ranchi',
                    'substance abuse treatment ranchi',
                    'brown sugar de addiction centre ranchi',
                    'smack de addiction centre in ranchi',
                    'medical detox centre in ranchi',
                    'dual diagnosis treatment ranchi',
                    '12 step recovery programme ranchi',
                    'best de addiction centre in ranchi',
                    'best de addiction centre in jharkhand',
                ]}
                settings={settings}
            />

            {/* Hero */}
            <section
                className="py-20 text-white text-center px-4"
                style={{ background: 'linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-primary-dark) 100%)' }}
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Treatment Programmes</h1>
                <p className="text-white/80 max-w-2xl mx-auto text-lg">
                    Evidence-based, personalised recovery pathways for every type of addiction.
                </p>
            </section>

            {/* Our programmes (from DB) */}
            <section className="py-20 bg-brand-bg px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="section-title">Our Recovery Pathways</h2>
                        <p className="section-subtitle">Comprehensive programmes tailored to each patient's unique situation and needs.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {services.map((s) => (
                            <div key={s.id} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 card-hover flex gap-5">
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                                    style={{ backgroundColor: 'var(--theme-primary-tint)', color: 'var(--theme-primary)' }}
                                >
                                    <DynamicIcon name={s.icon} size={28} className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-brand-slate text-xl mb-2">{s.title}</h3>
                                    <p className="text-brand-body leading-relaxed text-sm">{s.short_description || s.description}</p>
                                    <Link href="/appointment" className="inline-flex items-center gap-1 mt-4 text-sm font-semibold hover:gap-2 transition-all" style={{ color: 'var(--theme-primary)' }}>
                                        Book this programme <ChevronRight size={15} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Addictions we treat */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="section-title">Addictions We Treat</h2>
                        <p className="section-subtitle">We offer specialised programmes for a wide range of substance and behavioural addictions.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {addictions.map((a) => (
                            <div key={a.title} className="rounded-2xl border border-gray-100 p-6 bg-brand-bg card-hover">
                                <div className="text-4xl mb-3">{a.icon}</div>
                                <h3 className="font-bold text-brand-slate mb-2">{a.title}</h3>
                                <p className="text-sm text-brand-body leading-relaxed">{a.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recovery methodology */}
            <section className="py-20 px-4" style={{ backgroundColor: 'var(--theme-primary-tint)' }}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="section-title">Step-by-Step Recovery Methodology</h2>
                        <p className="section-subtitle">A structured, multi-phase approach that addresses mind, body, and spirit.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {steps.map((s) => (
                            <div key={s.num} className="bg-white rounded-2xl p-6 shadow-sm">
                                <div
                                    className="text-3xl font-bold mb-3"
                                    style={{ color: 'var(--theme-primary)', opacity: 0.2 }}
                                >
                                    {s.num}
                                </div>
                                <h3 className="font-bold text-brand-slate text-lg mb-2">{s.title}</h3>
                                <p className="text-sm text-brand-body leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-14 px-4 text-center text-white" style={{ background: 'linear-gradient(135deg, var(--theme-secondary) 0%, var(--theme-secondary-dark) 100%)' }}>
                <h2 className="text-3xl font-bold mb-3">Find the Right Programme For You</h2>
                <p className="text-white/80 max-w-xl mx-auto mb-8">
                    Speak to our clinical team for a free assessment and personalised programme recommendation.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                    <a href="tel:+918987654321" className="bg-white font-bold px-8 py-3.5 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2" style={{ color: 'var(--theme-secondary)' }}>
                        <Phone size={20} /> Call Now
                    </a>
                    <Link href="/appointment" className="border-2 border-white text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors">
                        Book Free Assessment
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}
