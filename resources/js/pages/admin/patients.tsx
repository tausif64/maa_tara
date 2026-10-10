import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Search, Plus, Edit, Trash2, X, UserCheck, Phone } from 'lucide-react';

interface Patient {
    id: number;
    name: string;
    phone: string;
    email?: string;
    status: string;
    admission_date: string;
    expected_release?: string;
    actual_release?: string;
    addiction_type?: string;
    severity?: string;
    guardian_name?: string;
    guardian_phone?: string;
    room_number?: string;
    notes?: string;
}

interface Pagination<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    patients: Pagination<Patient>;
    filters: { search?: string; status?: string };
}

const statusColors: Record<string, string> = {
    admitted:        'bg-blue-100 text-blue-800',
    under_treatment: 'bg-amber-100 text-amber-800',
    released:        'bg-green-100 text-green-800',
    follow_up:       'bg-purple-100 text-purple-800',
    discharged:      'bg-gray-100 text-gray-800',
};

type ModalMode = 'add' | 'edit' | null;

const emptyForm = {
    name: '', phone: '', email: '', status: 'admitted',
    admission_date: new Date().toISOString().split('T')[0],
    expected_release: '', actual_release: '',
    addiction_type: '', severity: '',
    guardian_name: '', guardian_phone: '',
    room_number: '', notes: '',
};

export default function Patients({ patients, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, patch, processing, errors, reset } = useForm({ ...emptyForm });

    const applyFilters = (overrides: object = {}) => {
        router.get('/admin/patients', { search, status, ...overrides }, { preserveState: true });
    };

    const openAdd = () => {
        reset();
        setData({ ...emptyForm });
        setModalMode('add');
    };

    const openEdit = (p: Patient) => {
        setEditingId(p.id);
        setData({
            name: p.name, phone: p.phone, email: p.email || '',
            status: p.status,
            admission_date: p.admission_date || '',
            expected_release: p.expected_release || '',
            actual_release: p.actual_release || '',
            addiction_type: p.addiction_type || '',
            severity: p.severity || '',
            guardian_name: p.guardian_name || '',
            guardian_phone: p.guardian_phone || '',
            room_number: p.room_number || '',
            notes: p.notes || '',
        });
        setModalMode('edit');
    };

    const closeModal = () => { setModalMode(null); setEditingId(null); };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'add') {
            post('/admin/patients', { onSuccess: closeModal });
        } else if (editingId) {
            patch(`/admin/patients/${editingId}`, { onSuccess: closeModal });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Delete this patient record permanently?')) {
            router.delete(`/admin/patients/${id}`);
        }
    };

    return (
        <AdminLayout title="Patient Admissions">
            <Head title="Patients / Admissions — Maa Tara Admin" />

            {/* Toolbar */}
            <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
                <div className="flex gap-3 flex-wrap">
                    <div className="relative">
                        <Search size={15} className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search name or phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl w-52 focus:outline-none focus:ring-2"
                        />
                    </div>
                    <button onClick={() => applyFilters()} className="btn-primary py-2 px-4 text-sm">Search</button>
                </div>
                <button onClick={openAdd} className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5">
                    <Plus size={16} /> Admit New Patient
                </button>
            </div>

            {/* Status Tabs */}
            <div className="flex gap-2 flex-wrap mb-5">
                {['', 'admitted', 'under_treatment', 'released', 'follow_up', 'discharged'].map((s) => (
                    <button
                        key={s}
                        onClick={() => { setStatus(s); applyFilters({ status: s }); }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                            status === s ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {s === '' ? 'All Patients' : s.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase">
                            <tr>
                                <th className="p-4">Patient</th>
                                <th className="p-4">Addiction / Severity</th>
                                <th className="p-4">Admission Date</th>
                                <th className="p-4">Expected Release</th>
                                <th className="p-4">Room</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {patients.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-10 text-center text-gray-400">
                                        <UserCheck size={32} className="mx-auto mb-2 text-gray-300" />
                                        No patient records found.
                                    </td>
                                </tr>
                            ) : (
                                patients.data.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            <p className="font-semibold text-gray-800">{p.name}</p>
                                            <a href={`tel:${p.phone}`} className="text-xs text-blue-600 hover:underline flex items-center gap-0.5 mt-0.5">
                                                <Phone size={11} /> {p.phone}
                                            </a>
                                        </td>
                                        <td className="p-4">
                                            {p.addiction_type && <span className="inline-block text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium capitalize mb-0.5">{p.addiction_type}</span>}
                                            {p.severity && <p className="text-xs text-gray-500 capitalize">{p.severity}</p>}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600 whitespace-nowrap">{p.admission_date}</td>
                                        <td className="p-4 text-sm text-gray-600 whitespace-nowrap">{p.expected_release || '—'}</td>
                                        <td className="p-4 text-sm text-gray-600">{p.room_number || '—'}</td>
                                        <td className="p-4">
                                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${statusColors[p.status] || 'bg-gray-100 text-gray-700'}`}>
                                                {p.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button onClick={() => openEdit(p)} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Edit size={15} />
                                                </button>
                                                <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {patients.last_page > 1 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <span>Page {patients.current_page} of {patients.last_page} ({patients.total} total)</span>
                        <div className="flex gap-1">
                            {patients.links.map((link, i) => (
                                <button key={i} disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 rounded-lg border text-xs ${link.active ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 disabled:opacity-40'}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Add / Edit Modal */}
            {modalMode && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl max-h-screen overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-800">
                                {modalMode === 'add' ? '🏥 Admit New Patient' : '✏️ Edit Patient Record'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Patient Name *</label>
                                    <input type="text" required value={data.name} onChange={e => setData('name', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Phone *</label>
                                    <input type="tel" required value={data.phone} onChange={e => setData('phone', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Email</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Room Number</label>
                                    <input type="text" value={data.room_number} onChange={e => setData('room_number', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Status *</label>
                                    <select value={data.status} onChange={e => setData('status', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2">
                                        <option value="admitted">Admitted</option>
                                        <option value="under_treatment">Under Treatment</option>
                                        <option value="released">Released</option>
                                        <option value="follow_up">Follow-up</option>
                                        <option value="discharged">Discharged</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Severity</label>
                                    <select value={data.severity} onChange={e => setData('severity', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2">
                                        <option value="">Select</option>
                                        <option value="mild">Mild</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="severe">Severe</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Addiction Type</label>
                                    <input type="text" value={data.addiction_type} onChange={e => setData('addiction_type', e.target.value)}
                                        placeholder="Alcohol, Drugs, etc."
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Admission Date *</label>
                                    <input type="date" required value={data.admission_date} onChange={e => setData('admission_date', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Expected Release</label>
                                    <input type="date" value={data.expected_release} onChange={e => setData('expected_release', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Actual Release Date</label>
                                    <input type="date" value={data.actual_release} onChange={e => setData('actual_release', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Guardian Name</label>
                                    <input type="text" value={data.guardian_name} onChange={e => setData('guardian_name', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Guardian Phone</label>
                                    <input type="tel" value={data.guardian_phone} onChange={e => setData('guardian_phone', e.target.value)}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">Internal Notes</label>
                                <textarea rows={3} value={data.notes} onChange={e => setData('notes', e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none"
                                    placeholder="Clinician's remarks, medical history, special instructions..." />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
                                <button type="submit" disabled={processing} className="btn-primary py-2 px-5 text-sm disabled:opacity-60">
                                    {processing ? 'Saving…' : modalMode === 'add' ? 'Admit Patient' : 'Update Record'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
