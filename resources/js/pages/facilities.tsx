import { Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import SeoHead from '@/components/public/SeoHead';
import { CheckCircle, Phone } from 'lucide-react';

const facilities = [
    {
        emoji: '🏠',
        title: 'Patient Accommodation',
        desc: 'Clean, comfortable, air-conditioned private and shared rooms with attached bathrooms, round-the-clock housekeeping, and personal storage lockers.',
        features: ['Private & shared room options', 'Air-conditioned rooms', 'Regular housekeeping', 'Personal lockers'],
    },
    {
        emoji: '🏥',
        title: 'Medical Wing',
        desc: 'A fully equipped medical ward with ICCU facilities, 24/7 nursing staff, and visiting psychiatrists for emergency and routine care.',
        features: ['24/7 nursing care', 'Emergency ICCU', 'Visiting psychiatrists', 'Pharmacy on site'],
    },
    {
        emoji: '🧠',
        title: 'Therapy Rooms',
        desc: 'Private consultation rooms and spacious group therapy halls designed to promote openness, reflection, and healing.',
        features: ['Individual counselling', 'Group therapy hall', 'Art & music therapy', 'Meditation room'],
    },
    {
        emoji: '🌿',
        title: 'Garden & Recreation',
        desc: 'Lush green garden, walking paths, and open-air spaces for relaxation, contemplation, and recreational activities.',
        features: ['Landscaped garden', 'Walking paths', 'Outdoor seating', 'Peaceful environment'],
    },
    {
        emoji: '🏋️',
        title: 'Yoga & Fitness Centre',
        desc: 'Daily yoga sessions, meditation classes, and a modern gym to promote physical health as a cornerstone of recovery.',
        features: ['Daily yoga sessions', 'Guided meditation', 'Modern gym equipment', 'Fitness instructor'],
    },
    {
        emoji: '🍽️',
        title: 'Dining Hall',
        desc: 'Nutritious, dietitian-approved meals served three times daily. Special dietary requirements and cultural food preferences accommodated.',
        features: ['Dietitian-planned meals', 'Three meals daily', 'Vegetarian options', 'Cultural preferences'],
    },
];

const safetyFeatures = [
    'CCTV surveillance across all common areas',
    'Biometric access control at entry/exit points',
    'Trained security personnel on premises 24/7',
    'Regular fire safety drills and extinguisher checks',
    'Visitor log and controlled visiting hours',
    'Emergency call buttons in all patient rooms',
];

export default function Facilities() {
    const { settings = {} } = usePage().props as { settings?: Record<string, string> };
    const siteName = settings['site_name'] || 'Maa Tara Freedom Trust';

    return (
        <PublicLayout title="Facilities">
            <SeoHead
                title={`Our Facilities — Best Luxury Rehab Center in Ranchi | ${siteName}`}
                description={`Tour the world-class residential facilities at ${siteName}, Ranchi. Equipped with 24/7 medical wing, comfortable AC rooms, yoga & meditation halls, nutritious dining, and round-the-clock security.`}
                canonicalPath="/facilities"
                keywords={[
                    'luxury rehab center in ranchi',
                    'rehab center infrastructure ranchi',
                    'inpatient rehab centre in ranchi',
                    'residential de addiction centre jharkhand',
                    'nasha mukti kendra facilities ranchi',
                    'best rehab center campus jharkhand',
                    'medical ward rehab ranchi',
                ]}
                settings={settings}
            />

            {/* Hero */}
            <section
                className="py-20 text-white text-center px-4"
                style={{ background: 'linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-primary-dark) 100%)' }}
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Facilities</h1>
                <p className="text-white/80 max-w-2xl mx-auto text-lg">
                    A serene, secure, and modern healing environment designed to support every stage of recovery.
                </p>
            </section>

            {/* Facilities grid */}
            <section className="py-20 bg-brand-bg px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="section-title">World-Class Infrastructure</h2>
                        <p className="section-subtitle">Every detail of our facility is designed with patient comfort and clinical efficacy in mind.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {facilities.map((f) => (
                            <div key={f.title} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 card-hover">
                                <div className="text-5xl mb-4">{f.emoji}</div>
                                <h3 className="font-bold text-brand-slate text-xl mb-2">{f.title}</h3>
                                <p className="text-sm text-brand-body leading-relaxed mb-4">{f.desc}</p>
                                <ul className="space-y-1.5">
                                    {f.features.map((feat) => (
                                        <li key={feat} className="flex items-center gap-2 text-sm text-brand-body">
                                            <CheckCircle size={14} style={{ color: 'var(--theme-primary)' }} className="shrink-0" />
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Safety & Security */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="section-title">Safety & Security</h2>
                        <p className="section-subtitle">Your safety is our highest priority — from admission to discharge.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {safetyFeatures.map((f) => (
                            <div key={f} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-brand-bg">
                                <CheckCircle size={18} style={{ color: 'var(--theme-primary)' }} className="shrink-0" />
                                <span className="text-sm text-brand-body">{f}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Photo gallery placeholder */}
            <section className="py-20 px-4" style={{ backgroundColor: 'var(--theme-primary-tint)' }}>
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="section-title">Take a Virtual Tour</h2>
                        <p className="section-subtitle">Get a feel for the warm, supportive environment awaiting you.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            { label: 'Building', bg: '/building.jpeg' },
                            { label: 'Therapy Hall', bg: '/therapy-hall.jpeg' },
                            { label: 'Game', bg: '/game.jpeg' },
                            // { label: 'Dining Hall', bg: 'from-amber-400' },
                            { label: 'Yoga Centre', bg: '/yoga.jpeg' },
                            { label: 'Reception', bg: '/reception.jpeg' },
                        ].map((img) => (
                            <div
                                key={img.label}
                                className={`aspect-4/3 rounded-2xl to-gray-400 flex items-end p-4 max-h-75 overflow-hidden relative`}
                            >
                                <img src={img.bg} alt={img.label} className='object-cover aspect-4/3 w-full rounded-2xl' />
                                <span className="text-white font-semibold text-sm bg-black/30 px-3 py-1 rounded-full absolute left-7 bottom-7">
                                    {img.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-14 px-4 text-center text-white" style={{ background: 'linear-gradient(135deg, var(--theme-secondary) 0%, var(--theme-secondary-dark) 100%)' }}>
                <h2 className="text-3xl font-bold mb-3">Visit Us or Book a Consultation</h2>
                <p className="text-white/80 max-w-xl mx-auto mb-8">Experience our facility in person. Arrange a guided visit or speak to our admissions team.</p>
                <div className="flex gap-4 justify-center flex-wrap">
                    <a href="tel:+918987654321" className="bg-white font-bold px-8 py-3.5 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2" style={{ color: 'var(--theme-secondary)' }}>
                        <Phone size={20} /> Call for Visit Enquiry
                    </a>
                    <Link href="/appointment" className="border-2 border-white text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors">
                        Book Appointment
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}
