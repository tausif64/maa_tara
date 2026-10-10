import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import {
    Plus, Search, Filter, Edit2, Trash2, Eye, ExternalLink,
    Calendar, Clock, Tag, Sparkles, AlertCircle, CheckCircle2, MoreHorizontal
} from 'lucide-react';
import { getColorHex } from '@/utils/colors';

const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Not published';
    try {
        const date = new Date(dateStr);
        const month = date.toLocaleString('en-US', { month: 'short' });
        const day = date.getDate();
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${month} ${day}, ${year} · ${hours}:${minutes}`;
    } catch {
        return dateStr;
    }
};

interface Category {
    id: number;
    name: string;
    slug: string;
    badge_color?: string;
    color?: string;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    category?: Category | null;
    author_name: string;
    excerpt?: string | null;
    featured_image?: string | null;
    status: 'draft' | 'published' | 'scheduled';
    is_featured: boolean;
    views_count: number;
    reading_time_minutes: number;
    published_at?: string | null;
    created_at: string;
}

interface Props {
    posts?: {
        data: Post[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        total: number;
    };
    categories?: Category[];
    filters?: {
        search?: string;
        category?: string;
        category_id?: string;
        status?: string;
    };
    counts?: {
        all?: number;
        total?: number;
        published?: number;
        draft?: number;
        scheduled?: number;
    };
    stats?: {
        all?: number;
        total?: number;
        published?: number;
        draft?: number;
        scheduled?: number;
    };
}

export default function AdminBlogIndex({
    posts = { data: [], links: [], current_page: 1, last_page: 1, total: 0 },
    categories = [],
    filters = {},
    counts,
    stats,
}: Props) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    const countsData = counts || stats || { all: 0, total: 0, published: 0, draft: 0, scheduled: 0 };
    const allCount = countsData.all ?? countsData.total ?? 0;
    const publishedCount = countsData.published ?? 0;
    const draftCount = countsData.draft ?? 0;
    const scheduledCount = countsData.scheduled ?? 0;

    const postsList = posts?.data || [];
    const postsLinks = posts?.links || [];
    const postsTotal = posts?.total || 0;

    const [search, setSearch] = useState(filters?.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters?.category || '');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [bulkAction, setBulkAction] = useState('');

    const handleFilterChange = (newStatus?: string, newCat?: string) => {
        router.get('/admin/blog', {
            search: search || undefined,
            category: newCat !== undefined ? newCat : (selectedCategory || undefined),
            status: newStatus !== undefined ? newStatus : (selectedStatus || undefined),
        }, { preserveState: true, replace: true });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleFilterChange();
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === postsList.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(postsList.map(p => p.id));
        }
    };

    const toggleSelectOne = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkApply = () => {
        if (!bulkAction || selectedIds.length === 0) return;
        if (bulkAction === 'delete' && !confirm(`Are you sure you want to permanently delete ${selectedIds.length} articles?`)) {
            return;
        }

        router.post('/admin/blog/bulk-action', {
            action: bulkAction,
            ids: selectedIds,
        }, {
            onSuccess: () => {
                setSelectedIds([]);
                setBulkAction('');
            }
        });
    };

    const handleDeleteSingle = (id: number, title: string) => {
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            router.delete(`/admin/blog/${id}`);
        }
    };

    return (
        <AdminLayout title="Blog & Articles">
            <Head title="Blog Management - Admin" />

            {/* Flash Messages */}
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

            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Articles & Insights</h2>
                    <p className="text-sm text-gray-500">Create, edit, and publish rich stories, clinical advice, and recovery guidance.</p>
                </div>
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <Link
                        href="/admin/blog-categories"
                        className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-xs"
                    >
                        <Tag size={16} />
                        Categories & Tags
                    </Link>
                    <Link
                        href="/admin/blog/create"
                        className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={17} />
                        New Article
                    </Link>
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-6 overflow-x-auto text-sm">
                <button
                    onClick={() => { setSelectedStatus(''); handleFilterChange(''); }}
                    className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                        !selectedStatus ? 'bg-orange-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    All ({allCount})
                </button>
                <button
                    onClick={() => { setSelectedStatus('published'); handleFilterChange('published'); }}
                    className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                        selectedStatus === 'published' ? 'bg-orange-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    Published ({publishedCount})
                </button>
                <button
                    onClick={() => { setSelectedStatus('draft'); handleFilterChange('draft'); }}
                    className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                        selectedStatus === 'draft' ? 'bg-orange-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    Drafts ({draftCount})
                </button>
                <button
                    onClick={() => { setSelectedStatus('scheduled'); handleFilterChange('scheduled'); }}
                    className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors shrink-0 ${
                        selectedStatus === 'scheduled' ? 'bg-orange-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    Scheduled ({scheduledCount})
                </button>
            </div>

            {/* Search & Category Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
                <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title, excerpt or author..."
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

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <select
                        value={selectedCategory}
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            handleFilterChange(undefined, e.target.value);
                        }}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.slug}>{c.name}</option>
                        ))}
                    </select>

                    {(search || selectedCategory || selectedStatus) && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setSelectedCategory('');
                                setSelectedStatus('');
                                router.get('/admin/blog');
                            }}
                            className="text-xs text-red-600 hover:underline px-2"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 p-3 rounded-xl mb-4 flex items-center justify-between text-sm animate-fadeIn">
                    <span className="text-orange-950 font-medium">
                        {selectedIds.length} article{selectedIds.length > 1 ? 's' : ''} selected
                    </span>
                    <div className="flex items-center gap-2">
                        <select
                            value={bulkAction}
                            onChange={(e) => setBulkAction(e.target.value)}
                            className="px-2.5 py-1.5 bg-white border border-orange-300 rounded-lg text-xs font-medium text-gray-800"
                        >
                            <option value="">Bulk Actions</option>
                            <option value="publish">Mark as Published</option>
                            <option value="draft">Move to Draft</option>
                            <option value="delete">Delete Permanently</option>
                        </select>
                        <button
                            type="button"
                            onClick={handleBulkApply}
                            disabled={!bulkAction}
                            className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            )}

            {/* Articles Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="p-4 w-10">
                                    <input
                                        type="checkbox"
                                        checked={posts.data.length > 0 && selectedIds.length === posts.data.length}
                                        onChange={toggleSelectAll}
                                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    />
                                </th>
                                <th className="p-4">Article</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Author</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Views</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {posts.data.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-12 text-center text-gray-400">
                                        No articles found. Click "New Article" to create your first post.
                                    </td>
                                </tr>
                            ) : (
                                posts.data.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(post.id)}
                                                onChange={() => toggleSelectOne(post.id)}
                                                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {post.featured_image ? (
                                                    <img
                                                        src={post.featured_image}
                                                        alt={post.title}
                                                        className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-100"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0">
                                                        POST
                                                    </div>
                                                )}
                                                <div className="min-w-0 max-w-sm">
                                                    <div className="flex items-center gap-1.5">
                                                        <Link
                                                            href={`/admin/blog/${post.id}/edit`}
                                                            className="font-semibold text-gray-900 hover:text-orange-600 truncate block"
                                                        >
                                                            {post.title}
                                                        </Link>
                                                        {post.is_featured && (
                                                            <span className="shrink-0 text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                                                <Sparkles size={10} /> Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-400 truncate mt-0.5">
                                                        /blog/{post.slug}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {post.category ? (
                                                <span
                                                    className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full"
                                                    style={{
                                                        backgroundColor: `${getColorHex(post.category.color)}15`,
                                                        color: getColorHex(post.category.color)
                                                    }}
                                                >
                                                    {post.category.name}
                                                </span>
                                            ) : (
                                                <span className="text-xs text-gray-400">Uncategorized</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-xs font-medium text-gray-700">
                                            {post.author_name}
                                            <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                                                <Clock size={11} /> {post.reading_time_minutes} min read
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {post.status === 'published' && (
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    Published
                                                </span>
                                            )}
                                            {post.status === 'draft' && (
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                    Draft
                                                </span>
                                            )}
                                            {post.status === 'scheduled' && (
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                    Scheduled
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-xs text-gray-600 font-medium">
                                            <div className="flex items-center gap-1">
                                                <Eye size={13} className="text-gray-400" />
                                                {post.views_count.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs text-gray-500">
                                            {formatDate(post.published_at)}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {post.status === 'published' && (
                                                    <a
                                                        href={`/blog/${post.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View on site"
                                                    >
                                                        <ExternalLink size={15} />
                                                    </a>
                                                )}
                                                <Link
                                                    href={`/admin/blog/${post.id}/edit`}
                                                    className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={15} />
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteSingle(post.id, post.title)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
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

                {/* Pagination */}
                {posts.links.length > 3 && (
                    <div className="p-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                        <span>Showing {posts.data.length} of {posts.total} articles</span>
                        <div className="flex items-center gap-1">
                            {posts.links.map((link, idx) => (
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
            </div>
        </AdminLayout>
    );
}
