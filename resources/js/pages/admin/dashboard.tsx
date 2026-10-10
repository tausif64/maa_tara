import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import {
    Users, CalendarCheck, UserCheck, AlertCircle,
    ArrowUpRight, Phone, Clock, Plus, Newspaper, Image as ImageIcon,
    Settings as SettingsIcon, PenTool, Upload
} from 'lucide-react';

interface Stats {
    total_leads: number;
    new_leads: number;
    total_appointments: number;
    pending_appointments: number;
    total_patients: number;
    active_patients: number;
    total_posts?: number;
    total_gallery_items?: number;
}

interface Lead {
    id: number;
    name: string;
    phone: string;
    email?: string;
    addiction_type?: string;
    status: string;
    created_at: string;
}

interface Appointment {
    id: number;
    reference_code: string;
    patient_name: string;
    service_type: string;
    appointment_date: string;
    time_slot: string;
    status: string;
}

interface Patient {
    id: number;
    name: string;
    phone: string;
    status: string;
    admission_date: string;
    addiction_type?: string;
    room_number?: string;
}

interface Props {
    stats: Stats;
    recent_leads: Lead[];
    upcoming_appointments: Appointment[];
    recent_patients: Patient[];
}

const statusBadge = (s: string) => {
    switch (s) {
        case 'new': return 'bg-blue-100 text-blue-800';
        case 'contacted': return 'bg-amber-100 text-amber-800';
        case 'converted': return 'bg-green-100 text-green-800';
        case 'lost': return 'bg-gray-100 text-gray-800';
        case 'pending': return 'bg-amber-100 text-amber-800';
        case 'confirmed': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        case 'completed': return 'bg-purple-100 text-purple-800';
        case 'admitted': return 'bg-blue-100 text-blue-800';
        case 'under_treatment': return 'bg-amber-100 text-amber-800';
        case 'released': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export default function Dashboard({ stats, recent_leads, upcoming_appointments, recent_patients }: Props) {
    return (
        <AdminLayout title="Dashboard Overview">
            <Head title="Admin Dashboard — Maa Tara Freedom Trust" />

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">New Leads</p>
                        <h3 className="text-3xl font-bold text-gray-800">{stats.new_leads}</h3>
                        <p className="text-xs text-gray-400 mt-1">{stats.total_leads} total enquiries</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Users size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Pending Appointments</p>
                        <h3 className="text-3xl font-bold text-gray-800">{stats.pending_appointments}</h3>
                        <p className="text-xs text-gray-400 mt-1">{stats.total_appointments} total bookings</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <CalendarCheck size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Active Patients</p>
                        <h3 className="text-3xl font-bold text-gray-800">{stats.active_patients}</h3>
                        <p className="text-xs text-gray-400 mt-1">{stats.total_patients} registered</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <UserCheck size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Blog & Gallery</p>
                        <h3 className="text-3xl font-bold text-gray-800">
                            {(stats.total_posts || 0) + (stats.total_gallery_items || 0)}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                            {stats.total_posts || 0} articles · {stats.total_gallery_items || 0} photos
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Newspaper size={24} />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8 flex gap-3 flex-wrap items-center">
                <Link href="/admin/patients" className="btn-primary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                    <Plus size={15} /> Admit Patient
                </Link>
                <Link href="/admin/blog" className="bg-white border border-gray-200 hover:bg-orange-50 hover:border-orange-200 text-gray-800 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-2xs">
                    <PenTool size={15} className="text-orange-600" /> Manage Articles & Blog
                </Link>
                <Link href="/admin/gallery" className="bg-white border border-gray-200 hover:bg-orange-50 hover:border-orange-200 text-gray-800 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-2xs">
                    <ImageIcon size={15} className="text-orange-600" /> Photo & Video Gallery
                </Link>
                <Link href="/admin/settings" className="border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5 bg-white shadow-2xs">
                    <SettingsIcon size={15} className="text-gray-500" /> CMS & Site Settings
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Recent Leads */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800">Recent Web Enquiries</h3>
                        <Link href="/admin/leads" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                            View All <ArrowUpRight size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recent_leads.length === 0 ? (
                            <p className="p-5 text-sm text-gray-400 text-center">No inquiries yet.</p>
                        ) : (
                            recent_leads.map((l) => (
                                <div key={l.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div>
                                        <p className="font-semibold text-sm text-gray-800">{l.name}</p>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                            <span>📞 {l.phone}</span>
                                            {l.addiction_type && <span>· {l.addiction_type}</span>}
                                        </div>
                                    </div>
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${statusBadge(l.status)}`}>
                                        {l.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-bold text-gray-800">Upcoming Appointments</h3>
                        <Link href="/admin/appointments" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                            View All <ArrowUpRight size={14} />
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {upcoming_appointments.length === 0 ? (
                            <p className="p-5 text-sm text-gray-400 text-center">No upcoming appointments.</p>
                        ) : (
                            upcoming_appointments.map((a) => (
                                <div key={a.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold text-sm text-gray-800">{a.patient_name}</p>
                                            <span className="text-[10px] font-mono bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                                {a.reference_code}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                            <span>📅 {a.appointment_date}</span>
                                            <span>⏰ {a.time_slot}</span>
                                        </div>
                                    </div>
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${statusBadge(a.status)}`}>
                                        {a.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Currently Admitted Patients */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-gray-800">Recent Rehab Admissions</h3>
                        <p className="text-xs text-gray-500">Currently admitted or undergoing treatment</p>
                    </div>
                    <Link href="/admin/patients" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                        Manage Patients <ArrowUpRight size={14} />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase">
                            <tr>
                                <th className="p-4">Patient</th>
                                <th className="p-4">Contact</th>
                                <th className="p-4">Admission Date</th>
                                <th className="p-4">Room</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recent_patients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-5 text-center text-gray-400">No patient records found.</td>
                                </tr>
                            ) : (
                                recent_patients.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-800">{p.name}</td>
                                        <td className="p-4 text-gray-600">{p.phone}</td>
                                        <td className="p-4 text-gray-600">{p.admission_date}</td>
                                        <td className="p-4 text-gray-600">{p.room_number || '—'}</td>
                                        <td className="p-4">
                                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${statusBadge(p.status)}`}>
                                                {p.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
