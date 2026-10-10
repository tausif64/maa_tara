import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Search, Filter, Phone, Mail, Trash2, Edit } from 'lucide-react';

interface Lead {
    id: number;
    name: string;
    phone: string;
    email?: string;
    addiction_type?: string;
    message?: string;
    status: 'new' | 'contacted' | 'converted' | 'lost';
    notes?: string;
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
    leads: Pagination<Lead>;
    filters: { search?: string; status?: string; addiction_type?: string };
}

export default function Leads({ leads, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [editStatus, setEditStatus] = useState('');
    const [editNotes, setEditNotes] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/leads', { search, status }, { preserveState: true });
    };

    const handleStatusFilter = (val: string) => {
        setStatus(val);
        router.get('/admin/leads', { search, status: val }, { preserveState: true });
    };

    const openEdit = (lead: Lead) => {
        setSelectedLead(lead);
        setEditStatus(lead.status);
        setEditNotes(lead.notes || '');
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLead) return;
        router.patch(`/admin/leads/${selectedLead.id}`, {
            status: editStatus,
            notes: editNotes,
        }, {
            onSuccess: () => setSelectedLead(null),
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this enquiry?')) {
            router.delete(`/admin/leads/${id}`);
        }
    };

    return (
        <AdminLayout title="Leads & Inquiries">
            <Head title="Leads Management — Maa Tara Admin" />

            {/* Filter bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search name, phone..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" className="btn-primary py-2 px-4 text-sm">
                        Search
                    </button>
                </form>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    {['', 'new', 'contacted', 'converted', 'lost'].map((s) => (
                        <button
                            key={s}
                            onClick={() => handleStatusFilter(s)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                                status === s
                                    ? 'bg-gray-800 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {s === '' ? 'All Status' : s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase">
                            <tr>
                                <th className="p-4">Contact Details</th>
                                <th className="p-4">Addiction / Query</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {leads.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-400">
                                        No leads found matching criteria.
                                    </td>
                                </tr>
                            ) : (
                                leads.data.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            <p className="font-semibold text-gray-800">{lead.name}</p>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                <a href={`tel:${lead.phone}`} className="hover:underline text-blue-600 flex items-center gap-1">
                                                    <Phone size={12} /> {lead.phone}
                                                </a>
                                                {lead.email && (
                                                    <a href={`mailto:${lead.email}`} className="hover:underline text-gray-500 flex items-center gap-1">
                                                        <Mail size={12} /> {lead.email}
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {lead.addiction_type && (
                                                <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-md font-medium mb-1 capitalize">
                                                    {lead.addiction_type}
                                                </span>
                                            )}
                                            {lead.message && (
                                                <p className="text-xs text-gray-600 line-clamp-2 max-w-xs">{lead.message}</p>
                                            )}
                                        </td>
                                        <td className="p-4 text-xs text-gray-500 whitespace-nowrap">
                                            {new Date(lead.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                                                lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                                                lead.status === 'contacted' ? 'bg-amber-100 text-amber-800' :
                                                lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(lead)}
                                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Update Status"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(lead.id)}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Lead"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {leads.last_page > 1 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <span>Showing page {leads.current_page} of {leads.last_page} ({leads.total} total)</span>
                        <div className="flex gap-1">
                            {leads.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 rounded-lg border ${
                                        link.active
                                            ? 'bg-blue-600 text-white border-blue-600 font-bold'
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Edit modal */}
            {selectedLead && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Update Lead: {selectedLead.name}</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">Status</label>
                                <select
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="converted">Converted (Admitted)</option>
                                    <option value="lost">Lost / Invalid</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 block mb-1">Internal Notes</label>
                                <textarea
                                    rows={3}
                                    value={editNotes}
                                    onChange={(e) => setEditNotes(e.target.value)}
                                    placeholder="Add any remarks or call log notes..."
                                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedLead(null)}
                                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary py-2 px-5 text-sm">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
