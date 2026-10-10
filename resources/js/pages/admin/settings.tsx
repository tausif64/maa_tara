import { useState, useRef, useEffect } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import {
    Globe, Phone, Share2, Layout, HelpCircle, Star,
    Users, Briefcase, Plus, Edit, Trash2, X, Save, ChevronDown, Image,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Settings { [key: string]: string | null }

interface Service {
    id: number; title: string; short_description: string;
    full_description?: string; icon?: string; category?: string;
    is_active: boolean; sort_order: number;
}

interface Testimonial {
    id: number; patient_name: string; patient_initials: string;
    story: string; rating: number; addiction_type?: string;
    recovery_months?: number; is_active: boolean;
}

interface TeamMember {
    id: number; name: string; designation: string;
    qualification?: string; bio?: string; photo?: string;
    specialization?: string; experience_years?: number;
    is_active: boolean; sort_order: number;
}

interface Faq {
    id: number; question: string; answer: string;
    category?: string; is_active: boolean; sort_order: number;
}

interface HeroSlide {
    id: number;
    image_path: string; sort_order: number; is_active: boolean;
}

interface Props {
    settings: Settings;
    services: Service[];
    testimonials: Testimonial[];
    team_members: TeamMember[];
    faqs: Faq[];
    hero_slides: HeroSlide[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const inp = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400';
const ta  = inp + ' resize-none';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
            {children}
        </div>
    );
}

// ── Tab definitions ───────────────────────────────────────────────────────────

type Tab = 'general' | 'contact' | 'social' | 'hero' | 'slides' | 'seo' | 'services' | 'testimonials' | 'team' | 'faqs';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'general',      label: 'General',        icon: <Globe size={15} /> },
    { id: 'contact',      label: 'Contact',         icon: <Phone size={15} /> },
    { id: 'social',       label: 'Social Links',    icon: <Share2 size={15} /> },
    { id: 'hero',         label: 'Hero Text',       icon: <Layout size={15} /> },
    { id: 'slides',       label: 'Carousel Slides', icon: <Image size={15} /> },
    { id: 'seo',          label: 'SEO',             icon: <Globe size={15} /> },
    { id: 'services',     label: 'Services',        icon: <Briefcase size={15} /> },
    { id: 'testimonials', label: 'Testimonials',    icon: <Star size={15} /> },
    { id: 'team',         label: 'Team Members',    icon: <Users size={15} /> },
    { id: 'faqs',         label: 'FAQs',            icon: <HelpCircle size={15} /> },
];

// ── Expandable row ─────────────────────────────────────────────────────────────

function CollapsibleRow({ title, subtitle, badge, onDelete, children }: {
    title: string; subtitle?: string; badge?: string;
    onDelete: () => void;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-gray-100 rounded-xl overflow-hidden">
            <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 select-none"
                onClick={() => setOpen(o => !o)}
            >
                <div className="flex items-center gap-3 min-w-0">
                    <ChevronDown size={14} className={`text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{title}</p>
                        {subtitle && <p className="text-xs text-gray-400 truncate">{subtitle}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2" onClick={e => e.stopPropagation()}>
                    {badge && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">{badge}</span>}
                    <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
            {open && <div className="px-4 pb-4 border-t border-gray-100 pt-4">{children}</div>}
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Settings({ settings, services, testimonials, team_members, faqs, hero_slides }: Props) {
    const [tab, setTab] = useState<Tab>('general');
    const [flash, setFlash] = useState<string | null>(null);

    const s = (key: string) => settings[key] || '';

    const showFlash = (msg: string) => {
        setFlash(msg);
        setTimeout(() => setFlash(null), 3000);
    };

    const saveGroup = (group: string, data: Record<string, string>) => {
        router.post(`/admin/settings/${group}`, data as Record<string, string>, {
            preserveState: true,
            onSuccess: () => showFlash('Saved successfully!'),
        });
    };

    return (
        <AdminLayout title="CMS & Settings">
            <Head title="CMS & Settings — Maa Tara Admin" />

            {/* Flash */}
            {flash && (
                <div className="fixed top-5 right-5 z-[60] bg-green-600 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg animate-pulse">
                    ✓ {flash}
                </div>
            )}

            {/* Tab bar */}
            <div className="flex gap-1 flex-wrap mb-6 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                {TABS.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                            tab === t.id ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            {/* ── General ── */}
            {tab === 'general' && (
                <GroupForm title="General Settings" onSave={(d) => saveGroup('general', d)}>
                    <Field label="Site Name"><input type="text" name="site_name" defaultValue={s('site_name')} className={inp} /></Field>
                    <Field label="Tagline / Slogan"><input type="text" name="site_tagline" defaultValue={s('site_tagline')} className={inp} /></Field>
                    <Field label="Established Year"><input type="text" name="established_year" defaultValue={s('established_year')} className={inp} /></Field>
                    <Field label="About Text (short)">
                        <textarea name="about_short" rows={3} defaultValue={s('about_short')} className={ta} />
                    </Field>
                    <Field label="About Text (full)">
                        <textarea name="about_full" rows={6} defaultValue={s('about_full')} className={ta} />
                    </Field>
                    <Field label="Vision Statement">
                        <textarea name="vision" rows={3} defaultValue={s('vision')} className={ta} />
                    </Field>
                    <Field label="Mission Statement">
                        <textarea name="mission" rows={3} defaultValue={s('mission')} className={ta} />
                    </Field>
                    <Field label="Beds Capacity"><input type="text" name="beds_capacity" defaultValue={s('beds_capacity')} className={inp} /></Field>
                    <Field label="Success Rate (%)"><input type="text" name="success_rate" defaultValue={s('success_rate')} className={inp} /></Field>
                    <Field label="Total Recovered Patients"><input type="text" name="total_recovered" defaultValue={s('total_recovered')} className={inp} /></Field>
                </GroupForm>
            )}

            {/* ── Contact ── */}
            {tab === 'contact' && (
                <GroupForm title="Contact & Location" onSave={(d) => saveGroup('contact', d)}>
                    <Field label="Primary Phone"><input type="tel" name="phone_primary" defaultValue={s('phone_primary')} className={inp} /></Field>
                    <Field label="Secondary Phone"><input type="tel" name="phone_secondary" defaultValue={s('phone_secondary')} className={inp} /></Field>
                    <Field label="WhatsApp Number (with country code)"><input type="text" name="whatsapp_number" defaultValue={s('whatsapp_number')} placeholder="918987654321" className={inp} /></Field>
                    <Field label="Email"><input type="email" name="email" defaultValue={s('email')} className={inp} /></Field>
                    <Field label="Address Line 1"><input type="text" name="address_line1" defaultValue={s('address_line1')} className={inp} /></Field>
                    <Field label="Address Line 2"><input type="text" name="address_line2" defaultValue={s('address_line2')} className={inp} /></Field>
                    <Field label="City"><input type="text" name="city" defaultValue={s('city')} className={inp} /></Field>
                    <Field label="State"><input type="text" name="state" defaultValue={s('state')} className={inp} /></Field>
                    <Field label="PIN Code"><input type="text" name="pincode" defaultValue={s('pincode')} className={inp} /></Field>
                    <Field label="Google Maps Embed URL">
                        <textarea name="maps_embed_url" rows={3} defaultValue={s('maps_embed_url')} className={ta} placeholder="Paste the full Google Maps iframe src URL..." />
                    </Field>
                    <Field label="Google Maps Link (for directions)">
                        <input type="text" name="maps_link" defaultValue={s('maps_link')} className={inp} />
                    </Field>
                    <Field label="Office Hours"><input type="text" name="office_hours" defaultValue={s('office_hours')} placeholder="24/7 Emergency · Mon–Sat 9am–6pm" className={inp} /></Field>
                </GroupForm>
            )}

            {/* ── Social ── */}
            {tab === 'social' && (
                <GroupForm title="Social Media Links" onSave={(d) => saveGroup('social', d)}>
                    <Field label="Facebook"><input type="url" name="social_facebook" defaultValue={s('social_facebook')} className={inp} /></Field>
                    <Field label="Instagram"><input type="url" name="social_instagram" defaultValue={s('social_instagram')} className={inp} /></Field>
                    <Field label="YouTube"><input type="url" name="social_youtube" defaultValue={s('social_youtube')} className={inp} /></Field>
                    <Field label="Twitter / X"><input type="url" name="social_twitter" defaultValue={s('social_twitter')} className={inp} /></Field>
                    <Field label="LinkedIn"><input type="url" name="social_linkedin" defaultValue={s('social_linkedin')} className={inp} /></Field>
                </GroupForm>
            )}

            {/* ── Hero ── */}
            {tab === 'hero' && (
                <GroupForm title="Hero / Banner Section" onSave={(d) => saveGroup('hero', d)}>
                    <Field label="Hero Headline">
                        <textarea name="hero_headline" rows={2} defaultValue={s('hero_headline')} className={ta} placeholder="Your Hope, Our Mission." />
                    </Field>
                    <Field label="Hero Sub-headline">
                        <textarea name="hero_subheadline" rows={3} defaultValue={s('hero_subheadline')} className={ta} />
                    </Field>
                    <Field label="Primary CTA Button Label"><input type="text" name="hero_cta_primary" defaultValue={s('hero_cta_primary')} placeholder="Book an Appointment" className={inp} /></Field>
                    <Field label="Secondary CTA Button Label"><input type="text" name="hero_cta_secondary" defaultValue={s('hero_cta_secondary')} placeholder="Emergency Admission" className={inp} /></Field>
                    <Field label="Announcement Bar Text">
                        <textarea name="announcement_text" rows={2} defaultValue={s('announcement_text')} className={ta} placeholder="24/7 Emergency admission helpline: ..." />
                    </Field>
                    <Field label="Show Announcement Bar">
                        <select name="announcement_visible" defaultValue={s('announcement_visible') || '1'} className={inp}>
                            <option value="1">Yes — Show</option>
                            <option value="0">No — Hide</option>
                        </select>
                    </Field>
                    <Field label="Stats Bar — Stat 1 Label"><input type="text" name="stat1_label" defaultValue={s('stat1_label')} placeholder="Years of Service" className={inp} /></Field>
                    <Field label="Stats Bar — Stat 1 Value"><input type="text" name="stat1_value" defaultValue={s('stat1_value')} placeholder="15+" className={inp} /></Field>
                    <Field label="Stats Bar — Stat 2 Label"><input type="text" name="stat2_label" defaultValue={s('stat2_label')} placeholder="Lives Transformed" className={inp} /></Field>
                    <Field label="Stats Bar — Stat 2 Value"><input type="text" name="stat2_value" defaultValue={s('stat2_value')} placeholder="2000+" className={inp} /></Field>
                    <Field label="Stats Bar — Stat 3 Label"><input type="text" name="stat3_label" defaultValue={s('stat3_label')} placeholder="Recovery Rate" className={inp} /></Field>
                    <Field label="Stats Bar — Stat 3 Value"><input type="text" name="stat3_value" defaultValue={s('stat3_value')} placeholder="92%" className={inp} /></Field>
                    <Field label="Stats Bar — Stat 4 Label"><input type="text" name="stat4_label" defaultValue={s('stat4_label')} placeholder="Bed Capacity" className={inp} /></Field>
                    <Field label="Stats Bar — Stat 4 Value"><input type="text" name="stat4_value" defaultValue={s('stat4_value')} placeholder="60" className={inp} /></Field>
                </GroupForm>
            )}

            {/* ── Carousel Slides ── */}
            {tab === 'slides' && (
                <SlideSection slides={hero_slides} />
            )}

            {/* ── SEO ── */}
            {tab === 'seo' && (
                <GroupForm title="SEO & Meta Tags" onSave={(d) => saveGroup('seo', d)}>
                    <Field label="Meta Title (Homepage)"><input type="text" name="seo_title" defaultValue={s('seo_title')} className={inp} /></Field>
                    <Field label="Meta Description">
                        <textarea name="seo_description" rows={3} defaultValue={s('seo_description')} className={ta} />
                    </Field>
                    <Field label="Meta Keywords (comma-separated)"><input type="text" name="seo_keywords" defaultValue={s('seo_keywords')} className={inp} /></Field>
                    <Field label="OG Image URL"><input type="url" name="seo_og_image" defaultValue={s('seo_og_image')} className={inp} /></Field>
                    <Field label="Google Analytics ID"><input type="text" name="analytics_id" defaultValue={s('analytics_id')} placeholder="G-XXXXXXXXXX" className={inp} /></Field>
                </GroupForm>
            )}

            {/* ── Services ── */}
            {tab === 'services' && (
                <CrudSection<Service>
                    title="Services"
                    items={services}
                    renderItem={(svc, refresh) => (
                        <ServiceRow key={svc.id} svc={svc} onSaved={refresh} />
                    )}
                    addForm={(onSaved) => <ServiceAddForm onSaved={onSaved} />}
                />
            )}

            {/* ── Testimonials ── */}
            {tab === 'testimonials' && (
                <CrudSection<Testimonial>
                    title="Patient Testimonials"
                    items={testimonials}
                    renderItem={(t, refresh) => (
                        <TestimonialRow key={t.id} item={t} onSaved={refresh} />
                    )}
                    addForm={(onSaved) => <TestimonialAddForm onSaved={onSaved} />}
                />
            )}

            {/* ── Team ── */}
            {tab === 'team' && (
                <CrudSection<TeamMember>
                    title="Team Members"
                    items={team_members}
                    renderItem={(m, refresh) => (
                        <TeamRow key={m.id} item={m} onSaved={refresh} />
                    )}
                    addForm={(onSaved) => <TeamAddForm onSaved={onSaved} />}
                />
            )}

            {/* ── FAQs ── */}
            {tab === 'faqs' && (
                <CrudSection<Faq>
                    title="Frequently Asked Questions"
                    items={faqs}
                    renderItem={(f, refresh) => (
                        <FaqRow key={f.id} item={f} onSaved={refresh} />
                    )}
                    addForm={(onSaved) => <FaqAddForm onSaved={onSaved} />}
                />
            )}
        </AdminLayout>
    );
}

// ── Group form wrapper ────────────────────────────────────────────────────────

function GroupForm({ title, onSave, children }: {
    title: string;
    onSave: (data: Record<string, string>) => void;
    children: React.ReactNode;
}) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const data: Record<string, string> = {};
        fd.forEach((v, k) => { data[k] = v.toString(); });
        onSave(data);
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-gray-800 mb-6">{title}</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {children}
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="btn-primary py-2 px-6 text-sm flex items-center gap-1.5">
                        <Save size={15} /> Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

// ── CRUD section wrapper ──────────────────────────────────────────────────────

function CrudSection<T extends { id: number }>({ title, items, renderItem, addForm }: {
    title: string;
    items: T[];
    renderItem: (item: T, refresh: () => void) => React.ReactNode;
    addForm: (onSaved: () => void) => React.ReactNode;
}) {
    const [showAdd, setShowAdd] = useState(false);
    const refresh = () => router.reload({ only: [] });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-800">{title} ({items.length})</h2>
                <button onClick={() => setShowAdd(o => !o)} className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5">
                    <Plus size={15} /> Add New
                </button>
            </div>
            {showAdd && (
                <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-semibold text-gray-800">New {title.replace(/s$/, '')}</p>
                        <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                    </div>
                    {addForm(() => { setShowAdd(false); router.reload(); })}
                </div>
            )}
            <div className="space-y-2">
                {items.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-8">No {title.toLowerCase()} yet. Click Add New to create one.</p>
                )}
                {items.map(item => renderItem(item, refresh))}
            </div>
        </div>
    );
}

// ── Services ──────────────────────────────────────────────────────────────────

function ServiceRow({ svc, onSaved }: { svc: Service; onSaved: () => void }) {
    const { data, setData, patch, delete: destroy, processing } = useForm({
        title: svc.title, short_description: svc.short_description,
        full_description: svc.full_description || '', icon: svc.icon || '',
        category: svc.category || '', sort_order: svc.sort_order,
    });

    return (
        <CollapsibleRow
            title={svc.title}
            subtitle={svc.short_description.slice(0, 80)}
            badge={svc.category || undefined}
            onDelete={() => { if (confirm('Delete this service?')) destroy(`/admin/settings/services/${svc.id}`, { onSuccess: onSaved }); }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Title"><input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className={inp} /></Field>
                <Field label="Icon (emoji)"><input type="text" value={data.icon} onChange={e => setData('icon', e.target.value)} className={inp} placeholder="🏥" /></Field>
                <div className="sm:col-span-2">
                    <Field label="Short Description"><textarea rows={2} value={data.short_description} onChange={e => setData('short_description', e.target.value)} className={ta} /></Field>
                </div>
                <div className="sm:col-span-2">
                    <Field label="Full Description"><textarea rows={4} value={data.full_description} onChange={e => setData('full_description', e.target.value)} className={ta} /></Field>
                </div>
                <Field label="Category"><input type="text" value={data.category} onChange={e => setData('category', e.target.value)} className={inp} placeholder="inpatient, outpatient..." /></Field>
                <Field label="Sort Order"><input type="number" value={data.sort_order} onChange={e => setData('sort_order', Number(e.target.value))} className={inp} /></Field>
            </div>
            <div className="flex justify-end mt-3">
                <button disabled={processing} onClick={() => patch(`/admin/settings/services/${svc.id}`, { onSuccess: onSaved })} className="btn-primary py-1.5 px-4 text-xs">
                    {processing ? 'Saving…' : 'Save'}
                </button>
            </div>
        </CollapsibleRow>
    );
}

function ServiceAddForm({ onSaved }: { onSaved: () => void }) {
    const { data, setData, post, processing, reset } = useForm({
        title: '', short_description: '', full_description: '', icon: '', category: '', sort_order: 0,
    });
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Title *"><input required type="text" value={data.title} onChange={e => setData('title', e.target.value)} className={inp} /></Field>
            <Field label="Icon (emoji)"><input type="text" value={data.icon} onChange={e => setData('icon', e.target.value)} className={inp} /></Field>
            <div className="sm:col-span-2">
                <Field label="Short Description *"><textarea required rows={2} value={data.short_description} onChange={e => setData('short_description', e.target.value)} className={ta} /></Field>
            </div>
            <Field label="Category"><input type="text" value={data.category} onChange={e => setData('category', e.target.value)} className={inp} /></Field>
            <Field label="Sort Order"><input type="number" value={data.sort_order} onChange={e => setData('sort_order', Number(e.target.value))} className={inp} /></Field>
            <div className="sm:col-span-2 flex justify-end">
                <button disabled={processing} onClick={() => post('/admin/settings/services', { onSuccess: () => { reset(); onSaved(); } })} className="btn-primary py-1.5 px-5 text-sm">
                    {processing ? 'Adding…' : 'Add Service'}
                </button>
            </div>
        </div>
    );
}

// ── Testimonials ──────────────────────────────────────────────────────────────

function TestimonialRow({ item, onSaved }: { item: Testimonial; onSaved: () => void }) {
    const { data, setData, patch, delete: destroy, processing } = useForm({
        patient_name: item.patient_name, patient_initials: item.patient_initials,
        story: item.story, rating: item.rating,
        addiction_type: item.addiction_type || '', recovery_months: item.recovery_months || '',
    });

    return (
        <CollapsibleRow
            title={item.patient_name}
            subtitle={item.story.slice(0, 80)}
            badge={item.addiction_type || undefined}
            onDelete={() => { if (confirm('Delete this testimonial?')) destroy(`/admin/settings/testimonials/${item.id}`, { onSuccess: onSaved }); }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Patient Name *"><input type="text" value={data.patient_name} onChange={e => setData('patient_name', e.target.value)} className={inp} /></Field>
                <Field label="Initials (e.g. R.K.)"><input type="text" value={data.patient_initials} onChange={e => setData('patient_initials', e.target.value)} className={inp} /></Field>
                <div className="sm:col-span-2">
                    <Field label="Story / Quote *"><textarea rows={4} value={data.story} onChange={e => setData('story', e.target.value)} className={ta} /></Field>
                </div>
                <Field label="Addiction Type"><input type="text" value={data.addiction_type} onChange={e => setData('addiction_type', e.target.value)} className={inp} /></Field>
                <Field label="Recovery (months)"><input type="number" value={data.recovery_months} onChange={e => setData('recovery_months', e.target.value)} className={inp} /></Field>
                <Field label="Rating (1–5)">
                    <select value={data.rating} onChange={e => setData('rating', Number(e.target.value))} className={inp}>
                        {[5,4,3,2,1].map(n => <option key={n} value={n}>{'★'.repeat(n)} {n} star{n > 1 ? 's' : ''}</option>)}
                    </select>
                </Field>
            </div>
            <div className="flex justify-end mt-3">
                <button disabled={processing} onClick={() => patch(`/admin/settings/testimonials/${item.id}`, { onSuccess: onSaved })} className="btn-primary py-1.5 px-4 text-xs">
                    {processing ? 'Saving…' : 'Save'}
                </button>
            </div>
        </CollapsibleRow>
    );
}

function TestimonialAddForm({ onSaved }: { onSaved: () => void }) {
    const { data, setData, post, processing, reset } = useForm({
        patient_name: '', patient_initials: '', story: '',
        rating: 5, addiction_type: '', recovery_months: '',
    });
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Patient Name *"><input required type="text" value={data.patient_name} onChange={e => setData('patient_name', e.target.value)} className={inp} /></Field>
            <Field label="Initials"><input type="text" value={data.patient_initials} onChange={e => setData('patient_initials', e.target.value)} className={inp} placeholder="Auto-generated if empty" /></Field>
            <div className="sm:col-span-2">
                <Field label="Story *"><textarea required rows={4} value={data.story} onChange={e => setData('story', e.target.value)} className={ta} /></Field>
            </div>
            <Field label="Addiction Type"><input type="text" value={data.addiction_type} onChange={e => setData('addiction_type', e.target.value)} className={inp} /></Field>
            <Field label="Recovery (months)"><input type="number" value={data.recovery_months} onChange={e => setData('recovery_months', e.target.value)} className={inp} /></Field>
            <Field label="Rating">
                <select value={data.rating} onChange={e => setData('rating', Number(e.target.value))} className={inp}>
                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{'★'.repeat(n)} {n} star{n > 1 ? 's' : ''}</option>)}
                </select>
            </Field>
            <div className="sm:col-span-2 flex justify-end">
                <button disabled={processing} onClick={() => post('/admin/settings/testimonials', { onSuccess: () => { reset(); onSaved(); } })} className="btn-primary py-1.5 px-5 text-sm">
                    {processing ? 'Adding…' : 'Add Testimonial'}
                </button>
            </div>
        </div>
    );
}

// ── Team Members ──────────────────────────────────────────────────────────────

function TeamRow({ item, onSaved }: { item: TeamMember; onSaved: () => void }) {
    const { data, setData, patch, delete: destroy, processing } = useForm({
        name: item.name, designation: item.designation,
        qualification: item.qualification || '', bio: item.bio || '',
        photo: item.photo || '', specialization: item.specialization || '',
        experience_years: item.experience_years || 0, sort_order: item.sort_order,
    });

    return (
        <CollapsibleRow
            title={item.name}
            subtitle={item.designation}
            badge={item.specialization || undefined}
            onDelete={() => { if (confirm('Remove this team member?')) destroy(`/admin/settings/team/${item.id}`, { onSuccess: onSaved }); }}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Name *"><input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inp} /></Field>
                <Field label="Designation *"><input type="text" value={data.designation} onChange={e => setData('designation', e.target.value)} className={inp} /></Field>
                <Field label="Qualification"><input type="text" value={data.qualification} onChange={e => setData('qualification', e.target.value)} className={inp} /></Field>
                <Field label="Specialization"><input type="text" value={data.specialization} onChange={e => setData('specialization', e.target.value)} className={inp} /></Field>
                <Field label="Experience (years)"><input type="number" value={data.experience_years} onChange={e => setData('experience_years', Number(e.target.value))} className={inp} /></Field>
                <Field label="Sort Order"><input type="number" value={data.sort_order} onChange={e => setData('sort_order', Number(e.target.value))} className={inp} /></Field>
                <Field label="Photo URL"><input type="text" value={data.photo} onChange={e => setData('photo', e.target.value)} className={inp} placeholder="https://..." /></Field>
                <div className="sm:col-span-2">
                    <Field label="Bio"><textarea rows={3} value={data.bio} onChange={e => setData('bio', e.target.value)} className={ta} /></Field>
                </div>
            </div>
            <div className="flex justify-end mt-3">
                <button disabled={processing} onClick={() => patch(`/admin/settings/team/${item.id}`, { onSuccess: onSaved })} className="btn-primary py-1.5 px-4 text-xs">
                    {processing ? 'Saving…' : 'Save'}
                </button>
            </div>
        </CollapsibleRow>
    );
}

function TeamAddForm({ onSaved }: { onSaved: () => void }) {
    const { data, setData, post, processing, reset } = useForm({
        name: '', designation: '', qualification: '', bio: '',
        photo: '', specialization: '', experience_years: 0, sort_order: 0,
    });
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Name *"><input required type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inp} /></Field>
            <Field label="Designation *"><input required type="text" value={data.designation} onChange={e => setData('designation', e.target.value)} className={inp} /></Field>
            <Field label="Qualification"><input type="text" value={data.qualification} onChange={e => setData('qualification', e.target.value)} className={inp} /></Field>
            <Field label="Specialization"><input type="text" value={data.specialization} onChange={e => setData('specialization', e.target.value)} className={inp} /></Field>
            <Field label="Experience (years)"><input type="number" value={data.experience_years} onChange={e => setData('experience_years', Number(e.target.value))} className={inp} /></Field>
            <Field label="Photo URL"><input type="text" value={data.photo} onChange={e => setData('photo', e.target.value)} className={inp} /></Field>
            <div className="sm:col-span-2">
                <Field label="Bio"><textarea rows={3} value={data.bio} onChange={e => setData('bio', e.target.value)} className={ta} /></Field>
            </div>
            <div className="sm:col-span-2 flex justify-end">
                <button disabled={processing} onClick={() => post('/admin/settings/team', { onSuccess: () => { reset(); onSaved(); } })} className="btn-primary py-1.5 px-5 text-sm">
                    {processing ? 'Adding…' : 'Add Member'}
                </button>
            </div>
        </div>
    );
}

// ── FAQs ──────────────────────────────────────────────────────────────────────

function FaqRow({ item, onSaved }: { item: Faq; onSaved: () => void }) {
    const { data, setData, patch, delete: destroy, processing } = useForm({
        question: item.question, answer: item.answer,
        category: item.category || '', sort_order: item.sort_order,
    });

    return (
        <CollapsibleRow
            title={item.question}
            subtitle={item.answer.slice(0, 70)}
            badge={item.category || undefined}
            onDelete={() => { if (confirm('Delete this FAQ?')) destroy(`/admin/settings/faqs/${item.id}`, { onSuccess: onSaved }); }}
        >
            <div className="space-y-3">
                <Field label="Question *"><input type="text" value={data.question} onChange={e => setData('question', e.target.value)} className={inp} /></Field>
                <Field label="Answer *"><textarea rows={4} value={data.answer} onChange={e => setData('answer', e.target.value)} className={ta} /></Field>
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Category"><input type="text" value={data.category} onChange={e => setData('category', e.target.value)} className={inp} /></Field>
                    <Field label="Sort Order"><input type="number" value={data.sort_order} onChange={e => setData('sort_order', Number(e.target.value))} className={inp} /></Field>
                </div>
            </div>
            <div className="flex justify-end mt-3">
                <button disabled={processing} onClick={() => patch(`/admin/settings/faqs/${item.id}`, { onSuccess: onSaved })} className="btn-primary py-1.5 px-4 text-xs">
                    {processing ? 'Saving…' : 'Save'}
                </button>
            </div>
        </CollapsibleRow>
    );
}

function FaqAddForm({ onSaved }: { onSaved: () => void }) {
    const { data, setData, post, processing, reset } = useForm({
        question: '', answer: '', category: '', sort_order: 0,
    });
    return (
        <div className="space-y-3">
            <Field label="Question *"><input required type="text" value={data.question} onChange={e => setData('question', e.target.value)} className={inp} /></Field>
            <Field label="Answer *"><textarea required rows={4} value={data.answer} onChange={e => setData('answer', e.target.value)} className={ta} /></Field>
            <div className="grid grid-cols-2 gap-3">
                <Field label="Category"><input type="text" value={data.category} onChange={e => setData('category', e.target.value)} className={inp} /></Field>
                <Field label="Sort Order"><input type="number" value={data.sort_order} onChange={e => setData('sort_order', Number(e.target.value))} className={inp} /></Field>
            </div>
            <div className="flex justify-end">
                <button disabled={processing} onClick={() => post('/admin/settings/faqs', { onSuccess: () => { reset(); onSaved(); } })} className="btn-primary py-1.5 px-5 text-sm">
                    {processing ? 'Adding…' : 'Add FAQ'}
                </button>
            </div>
        </div>
    );
}

// ── Hero Carousel Slides ───────────────────────────────────────────────────────

function SlideSection({ slides: initialSlides }: { slides: HeroSlide[] }) {
    const [slides, setSlides] = useState<HeroSlide[]>([...initialSlides].sort((a, b) => a.sort_order - b.sort_order));
    const [showAdd, setShowAdd] = useState(false);
    const [dragId, setDragId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    // Keep in sync when Inertia reloads
    const prevIds = useRef(initialSlides.map(s => s.id).join(','));
    useEffect(() => {
        const nextIds = initialSlides.map(s => s.id).join(',');
        if (nextIds !== prevIds.current) {
            prevIds.current = nextIds;
            setSlides([...initialSlides].sort((a, b) => a.sort_order - b.sort_order));
        }
    }, [initialSlides]);

    const refresh = () => router.reload({ only: ['hero_slides'] });

    const persistOrder = async (ordered: HeroSlide[]) => {
        setSaving(true);
        try {
            await fetch('/admin/settings/hero-slides/reorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ ids: ordered.map(s => s.id) }),
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDragStart = (id: number) => setDragId(id);
    const handleDragOver = (e: React.DragEvent, targetId: number) => {
        e.preventDefault();
        if (dragId === null || dragId === targetId) return;
        setSlides(prev => {
            const arr = [...prev];
            const fromIdx = arr.findIndex(s => s.id === dragId);
            const toIdx = arr.findIndex(s => s.id === targetId);
            if (fromIdx === -1 || toIdx === -1) return prev;
            const [moved] = arr.splice(fromIdx, 1);
            arr.splice(toIdx, 0, moved);
            return arr;
        });
    };
    const handleDrop = () => {
        setDragId(null);
        persistOrder(slides);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-gray-800">Hero Carousel Slides ({slides.length})</h2>
                    {saving && <span className="text-xs text-blue-500 animate-pulse">Saving order…</span>}
                </div>
                <button onClick={() => setShowAdd(o => !o)} className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5">
                    <Plus size={15} /> Add Slide
                </button>
            </div>
            <p className="text-xs text-gray-500">Upload images that appear as background slides in the homepage hero section. Slides auto-advance every 5 seconds. <strong>Drag</strong> the ⠿ handle to reorder.</p>

            {showAdd && (
                <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-semibold text-gray-800">New Slide</p>
                        <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                    </div>
                    <SlideAddForm onSaved={() => { setShowAdd(false); refresh(); }} />
                </div>
            )}

            <div className="space-y-2">
                {slides.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-10">No slides yet. Click <strong>Add Slide</strong> to upload the first hero background image.</p>
                )}
                {slides.map(slide => (
                    <SlideRow
                        key={slide.id}
                        slide={slide}
                        isDragging={dragId === slide.id}
                        onSaved={refresh}
                        onDragStart={() => handleDragStart(slide.id)}
                        onDragOver={(e) => handleDragOver(e, slide.id)}
                        onDrop={handleDrop}
                    />
                ))}
            </div>
        </div>
    );
}

function SlideRow({
    slide, isDragging, onSaved, onDragStart, onDragOver, onDrop,
}: {
    slide: HeroSlide;
    isDragging: boolean;
    onSaved: () => void;
    onDragStart: () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [isActive, setIsActive] = useState(slide.is_active);
    const fileRef = useRef<HTMLInputElement>(null);
    const { delete: destroy, processing } = useForm({});

    const handleSave = () => {
        const fd = new FormData();
        fd.append('_method', 'PUT');
        fd.append('is_active', isActive ? '1' : '0');
        if (fileRef.current?.files?.[0]) {
            fd.append('image', fileRef.current.files[0]);
        }
        router.post(`/admin/settings/hero-slides/${slide.id}`, fd, {
            forceFormData: true,
            onSuccess: onSaved,
        });
    };

    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnd={onDrop}
            className={`border rounded-xl overflow-hidden transition-opacity ${isDragging ? 'opacity-40 border-blue-300' : 'border-gray-100'}`}
        >
            <div className="flex items-center gap-2 px-3 py-3 hover:bg-gray-50 select-none">
                {/* Drag handle */}
                <span className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 text-lg leading-none px-0.5 flex-shrink-0" title="Drag to reorder">⠿</span>

                {/* Thumbnail */}
                <img
                    src={slide.image_path}
                    alt="Slide"
                    className="w-16 h-10 object-cover rounded-lg flex-shrink-0 border border-gray-100"
                />

                {/* Label */}
                <span className="text-sm text-gray-600 truncate flex-1 min-w-0">Slide #{slide.sort_order}</span>

                {/* Badges + actions */}
                <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${slide.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {slide.is_active ? 'Active' : 'Hidden'}
                    </span>
                    <button
                        onClick={() => setOpen(o => !o)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                    <button
                        onClick={() => { if (confirm('Delete this slide?')) destroy(`/admin/settings/hero-slides/${slide.id}`, { onSuccess: onSaved }); }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {open && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-3">
                    <Field label="Replace Image (leave blank to keep current)">
                        <input ref={fileRef} type="file" accept="image/*" className="block w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-xl px-2 py-1.5" />
                    </Field>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsActive(v => !v)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0.5'}`} />
                        </button>
                        <span className="text-xs text-gray-600">{isActive ? 'Active — shown in carousel' : 'Hidden — not shown'}</span>
                    </div>
                    <div className="flex justify-end">
                        <button disabled={processing} onClick={handleSave} className="btn-primary py-1.5 px-4 text-xs">
                            {processing ? 'Saving…' : 'Save Slide'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function SlideAddForm({ onSaved }: { onSaved: () => void }) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [isActive, setIsActive] = useState(true);
    const [busy, setBusy] = useState(false);
    const [imgError, setImgError] = useState('');

    const handleAdd = () => {
        if (!fileRef.current?.files?.[0]) { setImgError('Please select an image file.'); return; }
        setImgError('');
        setBusy(true);
        const fd = new FormData();
        fd.append('is_active', isActive ? '1' : '0');
        fd.append('image', fileRef.current.files[0]);
        router.post('/admin/settings/hero-slides', fd, {
            forceFormData: true,
            onSuccess: () => { setBusy(false); onSaved(); },
            onError: () => setBusy(false),
        });
    };

    return (
        <div className="space-y-3">
            <Field label="Image *">
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-200 rounded-xl px-2 py-1.5"
                />
                {imgError && <p className="text-xs text-red-500 mt-1">{imgError}</p>}
            </Field>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setIsActive(v => !v)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${isActive ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-xs text-gray-600">{isActive ? 'Active — will show in carousel' : 'Hidden — save as draft'}</span>
            </div>
            <div className="flex justify-end">
                <button disabled={busy} onClick={handleAdd} className="btn-primary py-1.5 px-5 text-sm">
                    {busy ? 'Uploading…' : 'Add Slide'}
                </button>
            </div>
        </div>
    );
}
