import { useState, useRef } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import {
    Image as ImageIcon, Video, Plus, UploadCloud, Trash2, Edit2,
    CheckCircle2, AlertCircle, Filter, Search, Sparkles, Folder,
    Calendar, Eye, X, CheckSquare, Square, Layers, RefreshCw
} from 'lucide-react';

interface GallerySection {
    id: number;
    name: string;
    slug: string;
    items_count?: number;
}

interface GalleryItem {
    id: number;
    section_id: number | null;
    section?: GallerySection | null;
    title: string | null;
    caption: string | null;
    image_path: string;
    year: number;
    date_taken: string | null;
    media_type: 'image' | 'video';
    video_url: string | null;
    is_featured: boolean;
    is_active: boolean;
    sort_order: number;
    created_at: string;
}

interface Props {
    items: {
        data: GalleryItem[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        total: number;
    };
    sections: GallerySection[];
    years: number[];
    stats: {
        total: number;
        images: number;
        videos: number;
        featured: number;
    };
    filters: {
        section_id: string;
        year: string;
        search: string;
    };
}

export default function AdminGalleryIndex({ items, sections, years, stats, filters }: Props) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    // Filters
    const [search, setSearch] = useState(filters.search || '');
    const [selectedSection, setSelectedSection] = useState(filters.section_id || 'all');
    const [selectedYear, setSelectedYear] = useState(filters.year || 'all');

    // Selection & Bulk Actions
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [bulkAction, setBulkAction] = useState('');
    const [bulkTargetSection, setBulkTargetSection] = useState('');
    const [bulkTargetYear, setBulkTargetYear] = useState(new Date().getFullYear().toString());

    // Modals
    const [batchModalOpen, setBatchModalOpen] = useState(false);
    const [singleModalOpen, setSingleModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

    // Batch Upload Form
    const [batchFiles, setBatchFiles] = useState<File[]>([]);
    const [batchSectionId, setBatchSectionId] = useState<string>('');
    const [batchYear, setBatchYear] = useState<number>(new Date().getFullYear());
    const [batchProcessing, setBatchProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Single Create/Edit Form
    const {
        data: singleData,
        setData: setSingleData,
        post: postSingle,
        processing: singleProcessing,
        reset: resetSingle,
        errors: singleErrors,
    } = useForm<{
        _method?: string;
        title: string;
        caption: string;
        section_id: string;
        year: number;
        date_taken: string;
        media_type: 'image' | 'video';
        video_url: string;
        image: File | null;
        is_featured: boolean;
        is_active: boolean;
        sort_order: number;
    }>({
        title: '',
        caption: '',
        section_id: '',
        year: new Date().getFullYear(),
        date_taken: '',
        media_type: 'image',
        video_url: '',
        image: null,
        is_featured: false,
        is_active: true,
        sort_order: 0,
    });
    const [singlePreview, setSinglePreview] = useState<string | null>(null);

    // Filter Trigger
    const handleFilterChange = (sec?: string, yr?: string) => {
        router.get('/admin/gallery', {
            search: search || undefined,
            section_id: sec !== undefined ? sec : (selectedSection !== 'all' ? selectedSection : undefined),
            year: yr !== undefined ? yr : (selectedYear !== 'all' ? selectedYear : undefined),
        }, { preserveState: true, replace: true });
    };

    // Selection Handlers
    const toggleSelectAll = () => {
        if (selectedIds.length === items.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(items.data.map(i => i.id));
        }
    };

    const toggleSelectOne = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    // Bulk Action Handler
    const handleBulkApply = () => {
        if (!bulkAction || selectedIds.length === 0) return;

        if (bulkAction === 'delete') {
            if (!confirm(`Permanently delete ${selectedIds.length} media item(s)?`)) return;
        }

        router.post('/admin/gallery/bulk-action', {
            action: bulkAction,
            ids: selectedIds,
            target_section_id: bulkAction === 'set_section' ? bulkTargetSection : null,
            target_year: bulkAction === 'set_year' ? parseInt(bulkTargetYear) : null,
        }, {
            onSuccess: () => {
                setSelectedIds([]);
                setBulkAction('');
            }
        });
    };

    // Batch Upload Handlers
    const handleBatchFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setBatchFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeBatchFile = (idx: number) => {
        setBatchFiles(prev => prev.filter((_, i) => i !== idx));
    };

    const handleBatchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (batchFiles.length === 0) return;

        setBatchProcessing(true);
        const formData = new FormData();
        batchFiles.forEach((file) => {
            formData.append('images[]', file);
        });
        if (batchSectionId) {
            formData.append('section_id', batchSectionId);
        }
        formData.append('year', String(batchYear));
        formData.append('is_active', '1');

        router.post('/admin/gallery/batch-upload', formData, {
            forceFormData: true,
            onSuccess: () => {
                setBatchModalOpen(false);
                setBatchFiles([]);
                setBatchProcessing(false);
            },
            onError: () => {
                setBatchProcessing(false);
            },
        });
    };

    // Single Create/Edit Handlers
    const openSingleCreate = () => {
        resetSingle();
        setEditingItem(null);
        setSinglePreview(null);
        setSingleData({
            title: '',
            caption: '',
            section_id: sections[0]?.id ? String(sections[0].id) : '',
            year: new Date().getFullYear(),
            date_taken: '',
            media_type: 'image',
            video_url: '',
            image: null,
            is_featured: false,
            is_active: true,
            sort_order: 0,
        });
        setSingleModalOpen(true);
    };

    const openSingleEdit = (item: GalleryItem) => {
        setEditingItem(item);
        setSinglePreview(item.image_path || null);
        setSingleData({
            _method: 'PUT',
            title: item.title || '',
            caption: item.caption || '',
            section_id: item.section_id ? String(item.section_id) : '',
            year: item.year || new Date().getFullYear(),
            date_taken: item.date_taken || '',
            media_type: item.media_type,
            video_url: item.video_url || '',
            image: null,
            is_featured: Boolean(item.is_featured),
            is_active: Boolean(item.is_active),
            sort_order: item.sort_order || 0,
        });
        setSingleModalOpen(true);
    };

    const handleSingleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            postSingle(`/admin/gallery/${editingItem.id}`, {
                forceFormData: true,
                onSuccess: () => {
                    setSingleModalOpen(false);
                    resetSingle();
                },
            });
        } else {
            postSingle('/admin/gallery', {
                forceFormData: true,
                onSuccess: () => {
                    setSingleModalOpen(false);
                    resetSingle();
                },
            });
        }
    };

    const handleDeleteSingle = (item: GalleryItem) => {
        if (confirm(`Are you sure you want to delete this ${item.media_type}?`)) {
            router.delete(`/admin/gallery/${item.id}`);
        }
    };

    return (
        <AdminLayout title="Photo & Media Gallery">
            <Head title="Gallery Management - Admin" />

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

            {/* Header & Stats */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Photo & Media Gallery</h2>
                    <p className="text-sm text-gray-500">
                        Organize facility photos, patient milestones, recovery sessions, and annual events.
                    </p>
                </div>
                <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
                    <Link
                        href="/admin/gallery-sections"
                        className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs"
                    >
                        <Folder size={16} />
                        Manage Sections
                    </Link>
                    <button
                        type="button"
                        onClick={() => setBatchModalOpen(true)}
                        className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs"
                    >
                        <UploadCloud size={16} />
                        Batch Upload
                    </button>
                    <button
                        type="button"
                        onClick={openSingleCreate}
                        className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={16} />
                        Add Media
                    </button>
                </div>
            </div>

            {/* Summary Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                        <ImageIcon size={20} />
                    </div>
                    <div>
                        <div className="text-xl font-extrabold text-gray-900">{stats.total}</div>
                        <div className="text-xs text-gray-500 font-medium">Total Media</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Layers size={20} />
                    </div>
                    <div>
                        <div className="text-xl font-extrabold text-gray-900">{stats.images}</div>
                        <div className="text-xs text-gray-500 font-medium">Photographs</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                        <Video size={20} />
                    </div>
                    <div>
                        <div className="text-xl font-extrabold text-gray-900">{stats.videos}</div>
                        <div className="text-xs text-gray-500 font-medium">Videos</div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <div className="text-xl font-extrabold text-gray-900">{stats.featured}</div>
                        <div className="text-xs text-gray-500 font-medium">Featured Items</div>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleFilterChange(); }}
                    className="flex-1 w-full flex items-center gap-2"
                >
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by photo title or description..."
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-black transition-colors"
                    >
                        Search
                    </button>
                </form>

                <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                    {/* Section Filter */}
                    <select
                        value={selectedSection}
                        onChange={(e) => {
                            setSelectedSection(e.target.value);
                            handleFilterChange(e.target.value, undefined);
                        }}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium"
                    >
                        <option value="all">All Sections</option>
                        {sections.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name} ({s.items_count || 0})
                            </option>
                        ))}
                    </select>

                    {/* Year Filter */}
                    <select
                        value={selectedYear}
                        onChange={(e) => {
                            setSelectedYear(e.target.value);
                            handleFilterChange(undefined, e.target.value);
                        }}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium"
                    >
                        <option value="all">All Years</option>
                        {years.map((yr) => (
                            <option key={yr} value={yr}>Year {yr}</option>
                        ))}
                    </select>

                    {(search || selectedSection !== 'all' || selectedYear !== 'all') && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setSelectedSection('all');
                                setSelectedYear('all');
                                router.get('/admin/gallery');
                            }}
                            className="text-xs text-red-600 hover:underline px-2"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Bulk Action Bar */}
            <div className="flex items-center justify-between gap-4 mb-4">
                <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-gray-900"
                >
                    {selectedIds.length === items.data.length && items.data.length > 0 ? (
                        <CheckSquare size={16} className="text-orange-600" />
                    ) : (
                        <Square size={16} className="text-gray-400" />
                    )}
                    Select All ({items.data.length})
                </button>

                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl animate-fadeIn">
                        <span className="text-xs font-bold text-orange-950">
                            {selectedIds.length} selected
                        </span>

                        <select
                            value={bulkAction}
                            onChange={(e) => setBulkAction(e.target.value)}
                            className="px-2.5 py-1 bg-white border border-orange-300 rounded-lg text-xs font-medium"
                        >
                            <option value="">Choose Action</option>
                            <option value="set_section">Move to Section...</option>
                            <option value="set_year">Assign Year...</option>
                            <option value="set_featured">Mark as Featured</option>
                            <option value="unset_featured">Unset Featured</option>
                            <option value="delete">Delete Permanently</option>
                        </select>

                        {bulkAction === 'set_section' && (
                            <select
                                value={bulkTargetSection}
                                onChange={(e) => setBulkTargetSection(e.target.value)}
                                className="px-2.5 py-1 bg-white border border-orange-300 rounded-lg text-xs font-medium"
                                required
                            >
                                <option value="">Select Section</option>
                                {sections.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        )}

                        {bulkAction === 'set_year' && (
                            <input
                                type="number"
                                value={bulkTargetYear}
                                onChange={(e) => setBulkTargetYear(e.target.value)}
                                className="w-20 px-2 py-1 bg-white border border-orange-300 rounded-lg text-xs font-mono"
                                min="2000"
                                max="2099"
                            />
                        )}

                        <button
                            type="button"
                            onClick={handleBulkApply}
                            disabled={!bulkAction}
                            className="px-3 py-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold"
                        >
                            Apply
                        </button>
                    </div>
                )}
            </div>

            {/* Gallery Grid */}
            {items.data.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs">
                    <ImageIcon size={44} className="mx-auto text-gray-300 mb-3" />
                    <h3 className="text-base font-bold text-gray-800 mb-1">No media items found</h3>
                    <p className="text-xs text-gray-400 mb-4">
                        Upload photographs or videos to enrich your gallery.
                    </p>
                    <button
                        type="button"
                        onClick={() => setBatchModalOpen(true)}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold"
                    >
                        Upload Photos
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {items.data.map((item) => (
                        <div
                            key={item.id}
                            className={`group relative bg-white rounded-xl border transition-all overflow-hidden flex flex-col ${
                                selectedIds.includes(item.id)
                                    ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-md'
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-xs'
                            }`}
                        >
                            {/* Checkbox Selector */}
                            <button
                                type="button"
                                onClick={() => toggleSelectOne(item.id)}
                                className="absolute top-2 left-2 z-10 p-1 rounded-md bg-black/40 text-white hover:bg-black/60 backdrop-blur-xs transition-colors"
                            >
                                {selectedIds.includes(item.id) ? (
                                    <CheckSquare size={14} className="text-orange-400" />
                                ) : (
                                    <Square size={14} />
                                )}
                            </button>

                            {/* Featured Star */}
                            {item.is_featured && (
                                <span className="absolute top-2 right-2 z-10 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center gap-0.5 shadow-xs">
                                    <Sparkles size={10} />
                                </span>
                            )}

                            {/* Media Thumbnail */}
                            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                {item.media_type === 'video' ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-2 text-center">
                                        <Video size={28} className="text-orange-400 mb-1" />
                                        <span className="text-[10px] font-medium text-gray-300 line-clamp-1">
                                            {item.title || 'Video Media'}
                                        </span>
                                    </div>
                                ) : (
                                    <img
                                        src={item.image_path}
                                        alt={item.title || 'Gallery item'}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                )}

                                {/* Hover Action Bar */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => openSingleEdit(item)}
                                        className="p-1.5 bg-white text-gray-800 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors shadow-xs"
                                        title="Edit Item"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteSingle(item)}
                                        className="p-1.5 bg-white text-gray-800 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors shadow-xs"
                                        title="Delete Item"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Metadata Footer */}
                            <div className="p-2.5 text-xs flex-1 flex flex-col justify-between space-y-1">
                                <div>
                                    <div className="font-semibold text-gray-900 truncate" title={item.title || 'Untitled'}>
                                        {item.title || 'Untitled'}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5">
                                        <span className="truncate">
                                            {item.section?.name || 'Unassigned'}
                                        </span>
                                        <span>•</span>
                                        <span className="font-mono text-gray-600 font-semibold">{item.year}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {items.links.length > 3 && (
                <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between text-xs text-gray-500">
                    <span>Showing {items.data.length} of {items.total} media items</span>
                    <div className="flex items-center gap-1">
                        {items.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                preserveScroll
                                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                    link.active
                                        ? 'bg-orange-600 text-white'
                                        : link.url
                                        ? 'hover:bg-gray-100 text-gray-700'
                                        : 'opacity-40 pointer-events-none text-gray-400'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Batch Upload Modal */}
            {batchModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-fadeIn">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
                                <UploadCloud size={20} className="text-orange-600" />
                                <h3 className="text-base font-bold text-gray-900">Batch Photo Uploader</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => { setBatchModalOpen(false); setBatchFiles([]); }}
                                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleBatchSubmit} className="space-y-4">
                            {/* Section & Year Selection */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Target Section</label>
                                    <select
                                        value={batchSectionId}
                                        onChange={(e) => setBatchSectionId(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                                    >
                                        <option value="">Unassigned Section</option>
                                        {sections.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Year Tag *</label>
                                    <input
                                        type="number"
                                        value={batchYear}
                                        onChange={(e) => setBatchYear(parseInt(e.target.value))}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono"
                                        min="2000"
                                        max="2099"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Drop Zone */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 hover:border-orange-500 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50 hover:bg-orange-50/20 text-center"
                            >
                                <UploadCloud size={36} className="text-gray-400 mb-2" />
                                <span className="text-xs font-bold text-gray-700">Click or Drag & Drop Multiple Images</span>
                                <span className="text-[11px] text-gray-400 mt-1">Select PNG, JPG, JPEG or WebP (Up to 15MB each)</span>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleBatchFiles}
                                    className="hidden"
                                />
                            </div>

                            {/* Selected Files Preview Pool */}
                            {batchFiles.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                                        <span>{batchFiles.length} file{batchFiles.length > 1 ? 's' : ''} queued for upload:</span>
                                        <button
                                            type="button"
                                            onClick={() => setBatchFiles([])}
                                            className="text-red-600 hover:underline text-[11px]"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 max-h-44 overflow-y-auto p-1">
                                        {batchFiles.map((f, idx) => (
                                            <div key={idx} className="relative rounded-lg overflow-hidden border border-gray-200 group aspect-square">
                                                <img
                                                    src={URL.createObjectURL(f)}
                                                    alt={f.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeBatchFile(idx)}
                                                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full text-[10px] hover:bg-red-700"
                                                >
                                                    <X size={10} />
                                                </button>
                                                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] p-0.5 truncate text-center">
                                                    {f.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Modal Actions */}
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => { setBatchModalOpen(false); setBatchFiles([]); }}
                                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={batchProcessing || batchFiles.length === 0}
                                    className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                                >
                                    {batchProcessing ? 'Uploading Images...' : `Upload ${batchFiles.length} Images`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Single Create / Edit Modal */}
            {singleModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fadeIn max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h3 className="text-base font-bold text-gray-900">
                                {editingItem ? 'Edit Media Item' : 'Add Single Media Item'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setSingleModalOpen(false)}
                                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSingleSubmit} className="space-y-4">
                            {/* Media Type Switcher */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Media Type</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSingleData('media_type', 'image')}
                                        className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors ${
                                            singleData.media_type === 'image'
                                                ? 'bg-orange-50 border-orange-500 text-orange-700'
                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                        }`}
                                    >
                                        <ImageIcon size={15} /> Photograph
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSingleData('media_type', 'video')}
                                        className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors ${
                                            singleData.media_type === 'video'
                                                ? 'bg-orange-50 border-orange-500 text-orange-700'
                                                : 'bg-gray-50 border-gray-200 text-gray-600'
                                        }`}
                                    >
                                        <Video size={15} /> Video Link
                                    </button>
                                </div>
                            </div>

                            {/* File Upload or Video URL */}
                            {singleData.media_type === 'image' ? (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Image File {!editingItem && '*'}
                                    </label>
                                    {singlePreview ? (
                                        <div className="relative rounded-lg overflow-hidden border border-gray-200 mb-2 h-44">
                                            <img src={singlePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSinglePreview(null);
                                                    setSingleData('image', null);
                                                }}
                                                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="border-2 border-dashed border-gray-200 hover:border-orange-500 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50 hover:bg-orange-50/20">
                                            <UploadCloud size={24} className="text-gray-400 mb-1" />
                                            <span className="text-xs font-semibold text-gray-700">Choose Image File</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const f = e.target.files?.[0];
                                                    if (f) {
                                                        setSingleData('image', f);
                                                        setSinglePreview(URL.createObjectURL(f));
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                    {singleErrors.image && <p className="text-xs text-red-500 mt-1">{singleErrors.image}</p>}
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Video URL / Embed Link *</label>
                                    <input
                                        type="url"
                                        value={singleData.video_url}
                                        onChange={(e) => setSingleData('video_url', e.target.value)}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono"
                                        required
                                    />
                                    {singleErrors.video_url && <p className="text-xs text-red-500 mt-1">{singleErrors.video_url}</p>}
                                </div>
                            )}

                            {/* Title & Section */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={singleData.title}
                                        onChange={(e) => setSingleData('title', e.target.value)}
                                        placeholder="e.g., Yoga Session Hall"
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Section</label>
                                    <select
                                        value={singleData.section_id}
                                        onChange={(e) => setSingleData('section_id', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                                    >
                                        <option value="">Unassigned</option>
                                        {sections.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Year & Date Taken */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Year *</label>
                                    <input
                                        type="number"
                                        value={singleData.year}
                                        onChange={(e) => setSingleData('year', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono"
                                        min="2000"
                                        max="2099"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Date Taken (optional)</label>
                                    <input
                                        type="date"
                                        value={singleData.date_taken}
                                        onChange={(e) => setSingleData('date_taken', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                                    />
                                </div>
                            </div>

                            {/* Caption */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Description / Caption</label>
                                <textarea
                                    rows={2}
                                    value={singleData.caption}
                                    onChange={(e) => setSingleData('caption', e.target.value)}
                                    placeholder="Brief background note or location detail..."
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                                />
                            </div>

                            {/* Featured & Active Flags */}
                            <div className="flex items-center justify-between gap-4 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={singleData.is_featured}
                                        onChange={(e) => setSingleData('is_featured', e.target.checked)}
                                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                                    />
                                    Feature on Gallery Highlights
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                                    <input
                                        type="checkbox"
                                        checked={singleData.is_active}
                                        onChange={(e) => setSingleData('is_active', e.target.checked)}
                                        className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                                    />
                                    Active (Visible)
                                </label>
                            </div>

                            {/* Modal Actions */}
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setSingleModalOpen(false)}
                                    className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={singleProcessing}
                                    className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                                >
                                    {singleProcessing ? 'Saving...' : editingItem ? 'Save Changes' : 'Add Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
