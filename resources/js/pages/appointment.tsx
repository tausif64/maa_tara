import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import SeoHead from '@/components/public/SeoHead';
import { CheckCircle, ChevronRight, ChevronLeft, Calendar, User, Stethoscope, Check } from 'lucide-react';

// ── Step indicator ─────────────────────────────────────────────────────────────
const STEPS = ['Service Type', 'Consultation Mode', 'Date & Slot', 'Patient Details'];

function StepIndicator({ current }: { current: number }) {
    return (
        <div className="flex items-center justify-center gap-0 mb-10 overflow-x-auto">
            {STEPS.map((label, i) => (
                <div key={label} className="flex items-center">
                    <div className="flex flex-col items-center">
                        <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                                i < current
                                    ? 'text-white'
                                    : i === current
                                    ? 'text-white ring-4'
                                    : 'bg-gray-200 text-gray-400'
                            }`}
                            style={
                                i <= current
                                    ? { backgroundColor: 'var(--theme-primary)', ringColor: 'var(--theme-primary-tint)' }
                                    : {}
                            }
                        >
                            {i < current ? <Check size={16} /> : i + 1}
                        </div>
                        <span className={`text-xs mt-1.5 whitespace-nowrap hidden sm:block ${i === current ? 'font-semibold' : 'text-gray-400'}`}>
                            {label}
                        </span>
                    </div>
                    {i < STEPS.length - 1 && (
                        <div
                            className="h-0.5 w-8 sm:w-16 mx-1"
                            style={{ backgroundColor: i < current ? 'var(--theme-primary)' : '#E5E7EB' }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

// ── Time slots ─────────────────────────────────────────────────────────────────
const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
];

// ── Booking form ───────────────────────────────────────────────────────────────
export default function Appointment() {
    const { settings = {} } = usePage().props as { settings?: Record<string, string> };
    const siteName = settings['site_name'] || 'Maa Tara Freedom Trust';

    const [step, setStep] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        service_type: '',
        consultation_mode: '',
        appointment_date: '',
        time_slot: '',
        patient_name: '',
        contact_number: '',
        email: '',
        guardian_name: '',
        guardian_relation: '',
        notes: '',
        severity: '',
        website: '',
    });

    const next = () => setStep((s) => Math.min(s + 1, 3));
    const prev = () => setStep((s) => Math.max(s - 1, 0));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/appointment');
    };

    const minDate = (() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
    })();

    return (
        <PublicLayout title="Book Appointment">
            <SeoHead
                title={`Book Confidential Consultation — Best Rehab Center in Ranchi | ${siteName}`}
                description={`Schedule a confidential in-person or online consultation with licensed addiction psychiatrists and clinical psychologists at ${siteName}, Ranchi.`}
                canonicalPath="/appointment"
                keywords={[
                    'book rehab consultation ranchi',
                    'nasha mukti kendra appointment ranchi',
                    'addiction psychiatrist appointment ranchi',
                    'confidential de addiction counseling ranchi',
                    'substance abuse doctor appointment ranchi',
                ]}
                settings={settings}
            />

            {/* Hero */}
            <section
                className="py-14 text-white text-center px-4"
                style={{ background: 'linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-primary-dark) 100%)' }}
            >
                <h1 className="text-4xl font-bold mb-3">Book a Confidential Appointment</h1>
                <p className="text-white/80 max-w-xl mx-auto">
                    Schedule an in-person or online consultation with our clinical team. All information is strictly confidential.
                </p>
            </section>

            <section className="py-16 px-4 bg-brand-bg min-h-screen">
                <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-8">
                    <StepIndicator current={step} />

                    {/* Honeypot */}
                    <input type="text" name="website" value={data.website} onChange={e => setData('website', e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" />

                    {/* Step 0 — Service type */}
                    {step === 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-brand-slate mb-6">Select Service Type</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { value: 'inpatient',        label: 'Inpatient Care',            icon: '🏥', desc: 'Full residential treatment programme' },
                                    { value: 'outpatient',       label: 'Outpatient Session',         icon: '🏃', desc: 'Non-residential structured programme' },
                                    { value: 'family_counseling',label: 'Family Counseling',          icon: '👨‍👩‍👧', desc: 'Family support and systemic healing' },
                                    { value: 'emergency_detox',  label: 'Emergency Detox Admission', icon: '🚨', desc: 'Urgent medically supervised detox' },
                                ].map((s) => (
                                    <button
                                        key={s.value}
                                        onClick={() => setData('service_type', s.value)}
                                        className={`text-left p-5 rounded-2xl border-2 transition-all ${
                                            data.service_type === s.value ? 'border-tp' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        style={data.service_type === s.value ? { borderColor: 'var(--theme-primary)', backgroundColor: 'var(--theme-primary-tint)' } : {}}
                                    >
                                        <div className="text-3xl mb-2">{s.icon}</div>
                                        <div className="font-semibold text-brand-slate">{s.label}</div>
                                        <div className="text-xs text-brand-body mt-1">{s.desc}</div>
                                    </button>
                                ))}
                            </div>
                            {errors.service_type && <p className="text-red-500 text-sm mt-3">{errors.service_type}</p>}
                            <div className="flex justify-end mt-8">
                                <button onClick={next} disabled={!data.service_type} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                                    Next <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 1 — Consultation mode */}
                    {step === 1 && (
                        <div>
                            <h2 className="text-xl font-bold text-brand-slate mb-6">Consultation Mode</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { value: 'in_person', label: 'In-Person Visit',       icon: '📍', desc: 'Visit our Ranchi facility (Sahera Road)' },
                                    { value: 'online',    label: 'Online / Tele-Consult', icon: '💻', desc: 'Video call from the comfort of your home' },
                                ].map((m) => (
                                    <button
                                        key={m.value}
                                        onClick={() => setData('consultation_mode', m.value)}
                                        className={`text-left p-6 rounded-2xl border-2 transition-all`}
                                        style={data.consultation_mode === m.value
                                            ? { borderColor: 'var(--theme-primary)', backgroundColor: 'var(--theme-primary-tint)' }
                                            : { borderColor: '#E5E7EB' }}
                                    >
                                        <div className="text-4xl mb-3">{m.icon}</div>
                                        <div className="font-semibold text-brand-slate">{m.label}</div>
                                        <div className="text-xs text-brand-body mt-1">{m.desc}</div>
                                    </button>
                                ))}
                            </div>
                            {errors.consultation_mode && <p className="text-red-500 text-sm mt-3">{errors.consultation_mode}</p>}
                            <div className="flex justify-between mt-8">
                                <button onClick={prev} className="btn-outline-primary">
                                    <ChevronLeft size={18} /> Back
                                </button>
                                <button onClick={next} disabled={!data.consultation_mode} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                                    Next <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2 — Date & slot */}
                    {step === 2 && (
                        <div>
                            <h2 className="text-xl font-bold text-brand-slate mb-6">Select Date & Time Slot</h2>
                            <div className="mb-6">
                                <label className="text-sm font-medium text-brand-slate block mb-2">Preferred Date *</label>
                                <input
                                    type="date"
                                    min={minDate}
                                    value={data.appointment_date}
                                    onChange={e => setData('appointment_date', e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2"
                                    style={{ '--tw-ring-color': 'var(--theme-primary)' } as React.CSSProperties}
                                />
                                {errors.appointment_date && <p className="text-red-500 text-sm mt-1">{errors.appointment_date}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-brand-slate block mb-3">Available Time Slots *</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {TIME_SLOTS.map((slot) => (
                                        <button
                                            key={slot}
                                            onClick={() => setData('time_slot', slot)}
                                            className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all`}
                                            style={data.time_slot === slot
                                                ? { borderColor: 'var(--theme-primary)', backgroundColor: 'var(--theme-primary)', color: 'white' }
                                                : { borderColor: '#E5E7EB', color: '#475569' }}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                                {errors.time_slot && <p className="text-red-500 text-sm mt-3">{errors.time_slot}</p>}
                            </div>
                            <div className="flex justify-between mt-8">
                                <button onClick={prev} className="btn-outline-primary">
                                    <ChevronLeft size={18} /> Back
                                </button>
                                <button onClick={next} disabled={!data.appointment_date || !data.time_slot} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                                    Next <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3 — Patient details + submit */}
                    {step === 3 && (
                        <form onSubmit={submit}>
                            <h2 className="text-xl font-bold text-brand-slate mb-6">Patient Details</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-brand-slate block mb-1">Patient Name *</label>
                                        <input type="text" required value={data.patient_name} onChange={e => setData('patient_name', e.target.value)}
                                            placeholder="Full name" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2" />
                                        {errors.patient_name && <p className="text-red-500 text-xs mt-1">{errors.patient_name}</p>}
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-brand-slate block mb-1">Contact Number *</label>
                                        <input type="tel" required value={data.contact_number} onChange={e => setData('contact_number', e.target.value)}
                                            placeholder="+91 XXXXX XXXXX" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2" />
                                        {errors.contact_number && <p className="text-red-500 text-xs mt-1">{errors.contact_number}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-brand-slate block mb-1">Email Address</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                        placeholder="you@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-brand-slate block mb-1">Guardian/Contact Name</label>
                                        <input type="text" value={data.guardian_name} onChange={e => setData('guardian_name', e.target.value)}
                                            placeholder="If booking for someone" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2" />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-brand-slate block mb-1">Relation to Patient</label>
                                        <select value={data.guardian_relation} onChange={e => setData('guardian_relation', e.target.value)}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 bg-white">
                                            <option value="">Select relation</option>
                                            <option value="self">Self</option>
                                            <option value="spouse">Spouse</option>
                                            <option value="parent">Parent</option>
                                            <option value="sibling">Sibling</option>
                                            <option value="child">Child</option>
                                            <option value="friend">Friend</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-brand-slate block mb-1">Severity / Brief Description</label>
                                    <select value={data.severity} onChange={e => setData('severity', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 bg-white">
                                        <option value="">Select severity</option>
                                        <option value="mild">Mild — Early stage, occasional use</option>
                                        <option value="moderate">Moderate — Regular dependency</option>
                                        <option value="severe">Severe — Heavy daily dependency</option>
                                        <option value="critical">Critical — Medical emergency</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-brand-slate block mb-1">Additional Notes</label>
                                    <textarea rows={3} value={data.notes} onChange={e => setData('notes', e.target.value)}
                                        placeholder="Any other information helpful for our team..."
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 resize-none" />
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="mt-6 p-4 rounded-xl text-sm" style={{ backgroundColor: 'var(--theme-primary-tint)' }}>
                                <p className="font-semibold mb-2" style={{ color: 'var(--theme-primary)' }}>Appointment Summary</p>
                                <p className="text-brand-body">📋 {data.service_type.replace('_', ' ')} · {data.consultation_mode.replace('_', '-')} · {data.appointment_date} at {data.time_slot}</p>
                            </div>

                            <div className="flex justify-between mt-6">
                                <button type="button" onClick={prev} className="btn-outline-primary">
                                    <ChevronLeft size={18} /> Back
                                </button>
                                <button type="submit" disabled={processing} className="btn-primary disabled:opacity-60">
                                    {processing ? 'Submitting…' : '✓ Confirm Appointment'}
                                </button>
                            </div>
                            <p className="text-xs text-brand-body text-center mt-4">
                                🔒 Your information is 100% confidential and secure.
                            </p>
                        </form>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
