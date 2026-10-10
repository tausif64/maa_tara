import { useState } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import {
    ArrowLeft, Plus, Edit2, Trash2, Tag as TagIcon,
    Folder, CheckCircle2, AlertCircle, X, Hash, Palette
} from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    badge_color: string;
    sort_order: number;
    is_active: boolean;
    posts_count: number;
}

interface Tag {
    id: number;
    name: string;
    slug: string;
    posts_count: number;
}

interface Props {
    categories: Category[];
    tags: Tag[];
}

const COLOR_PRESETS = [
    { label: 'Emerald / Green', value: '#10B981', bg: 'bg-emerald-500' },
    { label: 'Orange / Warm', value: '#F97316', bg: 'bg-orange-500' },
    { label: 'Blue / Clinical', value: '#3B82F6', bg: 'bg-blue-500' },
    { label: 'Purple / Therapy', value: '#8B5CF6', bg: 'bg-purple-500' },
    { label: 'Amber / Notice', value: '#F59E0B', bg: 'bg-amber-500' },
    { label: 'Rose / Care', value: '#F43F5E', bg: 'bg-rose-500' },
    { label: 'Teal / Wellness', value: '#14B8A6', bg: 'bg-teal-500' },
    { label: 'Indigo / Mind', value: '#6366F1', bg: 'bg-indigo-500' },
];

export default function AdminBlogCategories({ categories, tags }: Props) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    // Category Modal state
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const {
        data: catData,
        setData: setCatData,
        post: postCat,
        patch: patchCat,
        processing: catProcessing,
        reset: resetCat,
        errors: catErrors
    } = useForm({
        name: '',
        slug: '',
        description: '',
        badge_color: '#10B981',
        sort_order: 0,
        is_active: true,
    });

    // Tag Form
    const [tagInput, setTagInput] = useState('');
    const [tagProcessing, setTagProcessing] = useState(false);

    const openCreateModal = () => {
        resetCat();
        setEditingCategory(null);
        setCategoryModalOpen(true);
    };

    const openEditModal = (cat: Category) => {
        setEditingCategory(cat);
        setCatData({
            name: cat.name,
            slug: cat.slug,
            description: cat.description || '',
            badge_color: cat.badge_color || '#10B981',
            sort_order: cat.sort_order || 0,
            is_active: Boolean(cat.is_active),
        });
        setCategoryModalOpen(true);
    };

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            patchCat(`/admin/blog-categories/${editingCategory.id}`, {
                onSuccess: () => {
                    setCategoryModalOpen(false);
                    resetCat();
                },
            });
        } else {
            postCat('/admin/blog-categories', {
                onSuccess: () => {
                    setCategoryModalOpen(false);
                    resetCat();
                },
            });
        }
    };

    const handleDeleteCategory = (cat: Category) => {
        if (confirm(`Delete category "${cat.name}"? Articles in this category will become uncategorized.`)) {
            router.delete(`/admin/blog-categories/${cat.id}`);
        }
    };

    const handleAddTag = (e: React.FormEvent) => {
        e.preventDefault();
        if (!tagInput.trim()) return;

        setTagProcessing(true);
        router.post('/admin/blog-tags', {
            name: tagInput.trim(),
        }, {
            onSuccess: () => setTagInput(''),
            onFinish: () => setTagProcessing(false),
        });
    };

    const handleDeleteTag = (tag: Tag) => {
        if (confirm(`Delete tag "#${tag.name}"?`)) {
            router.delete(`/admin/blog-tags/${tag.id}`);
        }
    };

    return (
        <AdminLayout title="Blog Taxonomy">
            <Head title="Categories & Tags - Admin" />

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
                        href="/admin/blog"
                        className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Blog Taxonomy & Organization</h2>
                        <p className="text-sm text-gray-500">Manage categories, badge color coding, and article tags.</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs"
                >
                    <Plus size={16} />
                    New Category
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Columns: Categories List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Folder size={18} className="text-orange-600" />
                                <h3 className="font-bold text-gray-800 text-sm">Categories ({categories.length})</h3>
                            </div>
                            <span className="text-xs text-gray-400">Used for primary menu filtering</span>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {categories.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 text-sm">
                                    No categories yet. Click "New Category" to create one.
                                </div>
                            ) : (
                                categories.map((cat) => (
                                    <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="w-4 h-4 rounded-full shrink-0 shadow-xs"
                                                style={{ backgroundColor: cat.badge_color || '#10B981' }}
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-gray-900 text-sm">{cat.name}</span>
                                                    <span className="text-xs font-mono text-gray-400">/{cat.slug}</span>
                                                    {!cat.is_active && (
                                                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                                            Hidden
                                                        </span>
                                                    )}
                                                </div>
                                                {cat.description && (
                                                    <p className="text-xs text-gray-500 mt-0.5 max-w-md line-clamp-1">
                                                        {cat.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                                                {cat.posts_count} {cat.posts_count === 1 ? 'article' : 'articles'}
                                            </span>

                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditModal(cat)}
                                                    className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={15} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteCategory(cat)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
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
                </div>

                {/* Right 1 Column: Tags Manager */}
                <div className="space-y-6">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                            <TagIcon size={16} className="text-orange-600" />
                            <h3 className="text-sm font-bold text-gray-800">Article Tags ({tags.length})</h3>
                        </div>

                        {/* Tag Adder */}
                        <form onSubmit={handleAddTag} className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    placeholder="Add new tag name..."
                                    className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={tagProcessing || !tagInput.trim()}
                                className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-semibold hover:bg-black disabled:opacity-50 transition-colors shrink-0"
                            >
                                Add
                            </button>
                        </form>

                        {/* Tag Chips Pool */}
                        <div className="flex flex-wrap gap-2 max-h-[480px] overflow-y-auto pt-2">
                            {tags.length === 0 ? (
                                <span className="text-xs text-gray-400">No tags yet.</span>
                            ) : (
                                tags.map((t) => (
                                    <span
                                        key={t.id}
                                        className="group inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-xs font-medium transition-colors"
                                    >
                                        <span>#{t.name}</span>
                                        <span className="text-[10px] text-gray-400 bg-white px-1.5 py-0.2 rounded-full border border-gray-200">
                                            {t.posts_count}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteTag(t)}
                                            className="text-gray-400 hover:text-red-600 transition-colors ml-0.5"
                                            title="Delete tag"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Create/Edit Modal */}
            {categoryModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <h3 className="text-base font-bold text-gray-900">
                                {editingCategory ? 'Edit Category' : 'Create New Category'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setCategoryModalOpen(false)}
                                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCategorySubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Category Name *</label>
                                <input
                                    type="text"
                                    value={catData.name}
                                    onChange={(e) => setCatData('name', e.target.value)}
                                    placeholder="e.g., Clinical Insights"
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                                    required
                                />
                                {catErrors.name && <p className="text-xs text-red-500 mt-1">{catErrors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Slug (optional)</label>
                                <input
                                    type="text"
                                    value={catData.slug}
                                    onChange={(e) => setCatData('slug', e.target.value)}
                                    placeholder="clinical-insights"
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Badge Color</label>
                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="color"
                                        value={catData.badge_color}
                                        onChange={(e) => setCatData('badge_color', e.target.value)}
                                        className="w-8 h-8 rounded border border-gray-200 cursor-pointer p-0.5"
                                    />
                                    <input
                                        type="text"
                                        value={catData.badge_color}
                                        onChange={(e) => setCatData('badge_color', e.target.value)}
                                        className="w-28 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {COLOR_PRESETS.map((preset) => (
                                        <button
                                            key={preset.value}
                                            type="button"
                                            onClick={() => setCatData('badge_color', preset.value)}
                                            className={`w-5 h-5 rounded-full ${preset.bg} transition-transform ${
                                                catData.badge_color === preset.value ? 'scale-125 ring-2 ring-offset-1 ring-gray-600' : 'hover:scale-110'
                                            }`}
                                            title={preset.label}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Description (optional)</label>
                                <textarea
                                    rows={2}
                                    value={catData.description}
                                    onChange={(e) => setCatData('description', e.target.value)}
                                    placeholder="Short description for the category archive header..."
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setCategoryModalOpen(false)}
                                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={catProcessing}
                                    className="flex-1 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-xs"
                                >
                                    {catProcessing ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
