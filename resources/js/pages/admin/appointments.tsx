import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Search, Edit, Phone } from 'lucide-react';

interface Appointment {
    id: number;
    reference_code: string;
    patient_name: string;
    contact_number: string;
    email?: string;
    service_type: string;
    consultation_mode: string;
    appointment_date: string;
    time_slot: string;
    severity?: string;
    guardian_name?: string;
    notes?: string;
    status: 'pending' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled';
    created_at: string;
}

interface Pagination<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    appointments: Pagination<Appointment>;
    filters: { search?: string; status?: string; date?: string };
}

const statusColor: Record<string, string> = {
    pending:     'bg-amber-100 text-amber-800',
    confirmed:   'bg-green-100 text-green-800',
    rescheduled: 'bg-blue-100 text-blue-800',
    completed:   'bg-purple-100 text-purple-800',
    cancelled:   'bg-red-100 text-red-800',
};

const SERVICE_LABELS: Record<string, string> = {
    inpatient:         'Inpatient',
    outpatient:        'Outpatient',
    family_counseling: 'Family Counselling',
    emergency_detox:   'Emergency Detox',
};

export default function Appointments({ appointments, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [date, setDate] = useState(filters.date || '');
    const [editing, setEditing] = useState<Appointment | null>(null);
    const [editStatus, setEditStatus] = useState('');
    const [editNotes, setEditNotes] = useState('');

    const applyFilters = (overrides: Partial<{ search: string; status: string; date: string }> = {}) => {
        router.get('/admin/appointments', {
            search,
            status,
            date,
            ...overrides,
        }, { preserveState: true });
    };

    const openEdit = (a: Appointment) => {
        setEditing(a);
        setEditStatus(a.status);
        setEditNotes(a.notes || '');
    };

    const saveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editing) return;
        router.patch(`/admin/appointments/${editing.id}`, {
            status: editStatus,
        }, { onSuccess: () => setEditing(null) });
    };

    return (
        <AdminLayout title="Appointments">
            <Head title="Appointments — Maa Tara Admin" />

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6">
                <div className="flex flex-wrap gap-3 items-end">
                    <div className="relative">
                        <Search size={15} className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Name / Ref Code / Phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <input
                        type="date"
                        value={date}
                        onChange={(e) => { setDate(e.target.value); applyFilters({ date: e.target.value }); }}
                        className="py-2 px-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={() => applyFilters()}
                        className="btn-primary py-2 px-4 text-sm"
                    >
                        Search
                    </button>

                    <div className="flex gap-2 flex-wrap">
                        {['', 'pending', 'confirmed', 'rescheduled', 'completed', 'cancelled'].map((s) => (
                            <button
                                key={s}
                                onClick={() => { setStatus(s); applyFilters({ status: s }); }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                                    status === s ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {s === '' ? 'All' : s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase">
                            <tr>
                                <th className="p-4">Ref / Patient</th>
                                <th className="p-4">Service & Mode</th>
                                <th className="p-4">Date & Time</th>
                                <th className="p-4">Severity</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {appointments.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400">No appointments found.</td>
                                </tr>
                            ) : (
                                appointments.data.map((a) => (
                                    <tr key={a.id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            <p className="font-semibold text-gray-800">{a.patient_name}</p>
                                            <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                                                <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{a.reference_code}</span>
                                                <a href={`tel:${a.contact_number}`} className="text-blue-600 hover:underline flex items-center gap-0.5">
                                                    <Phone size={11} /> {a.contact_number}
                                                </a>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium text-gray-700">{SERVICE_LABELS[a.service_type] || a.service_type}</p>
                                            <p className="text-xs text-gray-400 capitalize">{a.consultation_mode.replace('_', '-')}</p>
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <p className="font-medium text-gray-700">{new Date(a.appointment_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                            <p className="text-xs text-gray-400">{a.time_slot}</p>
                                        </td>
                                        <td className="p-4 capitalize text-xs">
                                            {a.severity || '—'}
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${statusColor[a.status] || 'bg-gray-100 text-gray-700'}`}>
                                                {a.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => openEdit(a)}
                                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {appointments.last_page > 1 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <span>Page {appointments.current_page} of {appointments.last_page} ({appointments.total} total)</span>
                        <div className="flex gap-1">
                            {appointments.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 rounded-lg border ${
                                        link.active
                                            ? 'bg-blue-600 text-white border-blue-600 font-bold'
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 disabled:opacity-40'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editing && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">Update Appointment</h3>
                        <p className="text-sm text-gray-500 mb-4">{editing.patient_name} — {editing.reference_code}</p>
                        <form onSubmit={saveEdit} className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">Status</label>
                                <select
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="rescheduled">Rescheduled</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditing(null)}
                                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary py-2 px-5 text-sm">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
