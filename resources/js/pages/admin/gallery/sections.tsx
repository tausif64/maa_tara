import { useState } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import {
    ArrowLeft, Plus, Edit2, Trash2, Folder,
    CheckCircle2, AlertCircle, X, Image as ImageIcon,
    MoveUp, MoveDown, Layers, Check
} from 'lucide-react';

interface GallerySection {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    cover_image?: string | null;
    sort_order: number;
    is_active: boolean;
    items_count?: number;
}

interface Props {
    sections: GallerySection[];
}

export default function AdminGallerySections({ sections }: Props) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    const [modalOpen, setModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<GallerySection | null>(null);

    const {
        data,
        setData,
        post,
        patch,
        processing,
        reset,
        errors,
    } = useForm({
        name: '',
        slug: '',
        description: '',
        sort_order: 0,
        is_active: true,
    });

    const openCreateModal = () => {
        reset();
        setEditingSection(null);
        setData({
            name: '',
            slug: '',
            description: '',
            sort_order: sections.length,
            is_active: true,
        });
        setModalOpen(true);
    };

    const openEditModal = (sec: GallerySection) => {
        setEditingSection(sec);
        setData({
            name: sec.name,
            slug: sec.slug,
            description: sec.description || '',
            sort_order: sec.sort_order || 0,
            is_active: Boolean(sec.is_active),
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSection) {
            patch(`/admin/gallery-sections/${editingSection.id}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        } else {
            post('/admin/gallery-sections', {
                onSuccess: () => {
                    setModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (sec: GallerySection) => {
        if (confirm(`Delete section "${sec.name}"? Media items in this section will become unassigned.`)) {
            router.delete(`/admin/gallery-sections/${sec.id}`);
        }
    };

    return (
        <AdminLayout title="Gallery Sections">
            <Head title="Manage Sections - Gallery Admin" />

            {/* Flash feedback */}
            {flash?.success && (
                <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                    <span>{flash.success}</span>
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3">
                    <AlertCircle size={18} className="text-red-600 shrink-0" />
                    <span>{flash.error}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/gallery"
                        className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Gallery Sections & Categories</h2>
                        <p className="text-sm text-gray-500">
                            Group photo collections by area (e.g. Infrastructure, Yoga & Meditation, Events).
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs"
                >
                    <Plus size={16} />
                    New Section
                </button>
            </div>

            {/* Sections Grid / List */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-2">
                        <Folder size={18} className="text-orange-600" />
                        <h3 className="font-bold text-gray-800 text-sm">All Sections ({sections.length})</h3>
                    </div>
                    <span className="text-xs text-gray-400">Used for public gallery category tabs</span>
                </div>

                <div className="divide-y divide-gray-100">
                    {sections.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 text-sm">
                            No gallery sections yet. Click "New Section" to create your first category.
                        </div>
                    ) : (
                        sections.map((sec, idx) => (
                            <div
                                key={sec.id}
                                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0 border border-orange-100">
                                        <Layers size={18} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900 text-sm">{sec.name}</span>
                                            <span className="text-xs font-mono text-gray-400">/{sec.slug}</span>
                                            {!sec.is_active && (
                                                <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                                                    Hidden
                                                </span>
                                            )}
                                        </div>
                                        {sec.description && (
                                            <p className="text-xs text-gray-500 mt-0.5 max-w-xl line-clamp-1">
                                                {sec.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                                        {sec.items_count || 0} {(sec.items_count === 1) ? 'media item' : 'media items'}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => openEditModal(sec)}
                                            className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                            title="Edit Section"
                                        >
                                            <Edit2 size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(sec)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Section"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal Create / Edit */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h3 className="text-base font-bold text-gray-900">
                                {editingSection ? 'Edit Section' : 'Create New Section'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setModalOpen(false)}
                                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Section Name *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., Rehabilitation Activities"
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                                    required
                                />
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Slug (optional)</label>
                                <input
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => setData('slug', e.target.value)}
                                    placeholder="rehabilitation-activities"
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Description (optional)</label>
                                <textarea
                                    rows={2}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Brief description for public gallery page subtitle..."
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Sort Order</label>
                                    <input
                                        type="number"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono"
                                    />
                                </div>
                                <div className="flex items-end pb-2">
                                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                                        />
                                        Active (Visible)
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-xs"
                                >
                                    {processing ? 'Saving...' : editingSection ? 'Save Changes' : 'Create Section'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
