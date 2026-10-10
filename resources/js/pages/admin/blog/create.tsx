import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import RichTextEditor from '@/components/admin/RichTextEditor';
import {
    ArrowLeft, Save, Sparkles, Image as ImageIcon,
    Tag as TagIcon, Globe, Calendar, Clock, X, UploadCloud, CheckCircle
} from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    color: string;
}

interface Tag {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    categories: Category[];
    tags: Tag[];
}

export default function AdminBlogCreate({ categories, tags }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        slug: string;
        category_id: string;
        author_name: string;
        excerpt: string;
        content: string;
        featured_image: File | null;
        image_caption: string;
        status: 'draft' | 'published' | 'scheduled';
        is_featured: boolean;
        published_at: string;
        reading_time_minutes: string | number;
        meta_title: string;
        meta_description: string;
        meta_keywords: string;
        tags: string[];
    }>({
        title: '',
        slug: '',
        category_id: categories[0]?.id ? String(categories[0].id) : '',
        author_name: 'Maa Tara Care Team',
        excerpt: '',
        content: '',
        featured_image: null,
        image_caption: '',
        status: 'published',
        is_featured: false,
        published_at: new Date().toISOString().slice(0, 16),
        reading_time_minutes: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: '',
        tags: [],
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [tagInput, setTagInput] = useState('');
    const [autoSlug, setAutoSlug] = useState(true);

    // Auto-generate slug when title changes
    useEffect(() => {
        if (autoSlug && data.title) {
            const slug = data.title
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/[\s-]+/g, '-');
            setData('slug', slug);
        }
    }, [data.title, autoSlug]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('featured_image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setData('featured_image', null);
        setImagePreview(null);
    };

    const addTag = (tagName: string) => {
        const trimmed = tagName.trim();
        if (trimmed && !data.tags.includes(trimmed)) {
            setData('tags', [...data.tags, trimmed]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setData('tags', data.tags.filter(t => t !== tagToRemove));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/blog', {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Create New Article">
            <Head title="Write Article - Admin" />

            <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-xs sticky top-20 z-10">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/blog"
                            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <div>
                            <h2 className="text-base font-bold text-gray-900">Write New Article</h2>
                            <p className="text-xs text-gray-400">Compose and publish recovery insights or news.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value as 'draft' | 'published' | 'scheduled')}
                            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700"
                        >
                            <option value="published">Publish Immediately</option>
                            <option value="draft">Save as Draft</option>
                            <option value="scheduled">Schedule Publication</option>
                        </select>

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-5 py-2 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                        >
                            <Save size={16} />
                            {processing ? 'Saving...' : 'Publish Article'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2 Columns: Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title & Slug Box */}
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Article Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g., 7 Proven Steps to Relapse Prevention in Early Recovery"
                                    className="w-full px-3.5 py-2.5 text-base font-semibold bg-white border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    required
                                />
                                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs font-semibold text-gray-600">Permalink (URL Slug)</label>
                                    <button
                                        type="button"
                                        onClick={() => setAutoSlug(!autoSlug)}
                                        className="text-[11px] text-orange-600 hover:underline font-medium"
                                    >
                                        {autoSlug ? '🔒 Auto-sync ON' : '🔓 Manual Slug'}
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400 font-mono">/blog/</span>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => {
                                            setAutoSlug(false);
                                            setData('slug', e.target.value);
                                        }}
                                        placeholder="url-friendly-slug"
                                        className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono focus:outline-hidden focus:ring-1 focus:ring-orange-500"
                                    />
                                </div>
                                {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Summary / Excerpt
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.excerpt}
                                    onChange={(e) => setData('excerpt', e.target.value)}
                                    placeholder="A concise 1-2 sentence teaser for cards and search snippets..."
                                    className="w-full px-3.5 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                />
                                {errors.excerpt && <p className="text-xs text-red-500 mt-1">{errors.excerpt}</p>}
                            </div>
                        </div>

                        {/* TipTap Rich Text Editor */}
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Article Body Content <span className="text-red-500">*</span>
                            </label>
                            <RichTextEditor
                                content={data.content}
                                onChange={(html) => setData('content', html)}
                                placeholder="Start writing your article... format with headings, quotes, bullet points, and inline images."
                            />
                            {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
                        </div>

                        {/* SEO Metadata Box */}
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                                <Globe size={16} className="text-orange-600" />
                                <h3 className="text-sm font-bold text-gray-800">Search Engine Optimization (SEO)</h3>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">SEO Meta Title</label>
                                <input
                                    type="text"
                                    value={data.meta_title}
                                    onChange={(e) => setData('meta_title', e.target.value)}
                                    placeholder={data.title || 'Maa Tara Freedom Trust Blog'}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Meta Description</label>
                                <textarea
                                    rows={2}
                                    value={data.meta_description}
                                    onChange={(e) => setData('meta_description', e.target.value)}
                                    placeholder="Enter meta description for Google search result preview..."
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Meta Keywords</label>
                                <input
                                    type="text"
                                    value={data.meta_keywords}
                                    onChange={(e) => setData('meta_keywords', e.target.value)}
                                    placeholder="addiction recovery, rehabilitation varanasi, mental health tips"
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right 1 Column: Metadata & Settings Sidebar */}
                    <div className="space-y-6">
                        {/* Featured Image Box */}
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-3">
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                                <ImageIcon size={16} className="text-orange-600" />
                                <h3 className="text-sm font-bold text-gray-800">Featured Image</h3>
                            </div>

                            {imagePreview ? (
                                <div className="space-y-2">
                                    <div className="relative rounded-lg overflow-hidden border border-gray-200 group">
                                        <img src={imagePreview} alt="Preview" className="w-full h-44 object-cover" />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={data.image_caption}
                                        onChange={(e) => setData('image_caption', e.target.value)}
                                        placeholder="Image caption / photographer credit"
                                        className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs"
                                    />
                                </div>
                            ) : (
                                <label className="border-2 border-dashed border-gray-200 hover:border-orange-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50 hover:bg-orange-50/20">
                                    <UploadCloud size={28} className="text-gray-400 mb-2" />
                                    <span className="text-xs font-semibold text-gray-700">Upload Featured Image</span>
                                    <span className="text-[11px] text-gray-400 mt-0.5">PNG, JPG or WebP up to 10MB</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                            {errors.featured_image && <p className="text-xs text-red-500 mt-1">{errors.featured_image}</p>}
                        </div>

                        {/* Category & Attributes */}
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-4">
                            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">Category & Flags</h3>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium"
                                >
                                    <option value="">Select a Category</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="text-xs text-red-500 mt-1">{errors.category_id}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Author Name</label>
                                <input
                                    type="text"
                                    value={data.author_name}
                                    onChange={(e) => setData('author_name', e.target.value)}
                                    placeholder="e.g., Dr. Suresh Sharma"
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl">
                                <div>
                                    <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                                        <Sparkles size={13} /> Feature on Blog Hero
                                    </span>
                                    <p className="text-[11px] text-amber-700">Display prominently on the blog homepage</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={data.is_featured}
                                    onChange={(e) => setData('is_featured', e.target.checked)}
                                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                                />
                            </div>
                        </div>

                        {/* Tags Manager */}
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-3">
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                                <TagIcon size={16} className="text-orange-600" />
                                <h3 className="text-sm font-bold text-gray-800">Tags</h3>
                            </div>

                            {/* Tag Chips */}
                            <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                                {data.tags.map((t) => (
                                    <span
                                        key={t}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-xs font-medium"
                                    >
                                        #{t}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(t)}
                                            className="hover:text-red-600"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>

                            {/* Tag Input */}
                            <div className="flex items-center gap-1.5">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addTag(tagInput);
                                        }
                                    }}
                                    placeholder="Type tag & press enter..."
                                    className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                                />
                                <button
                                    type="button"
                                    onClick={() => addTag(tagInput)}
                                    className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-medium hover:bg-black"
                                >
                                    Add
                                </button>
                            </div>

                            {/* Available Quick Tags */}
                            {tags.length > 0 && (
                                <div className="pt-2 border-t border-gray-100">
                                    <span className="text-[11px] text-gray-400 block mb-1.5">Suggested Tags:</span>
                                    <div className="flex flex-wrap gap-1">
                                        {tags.slice(0, 10).map((tag) => (
                                            <button
                                                key={tag.id}
                                                type="button"
                                                onClick={() => addTag(tag.name)}
                                                className="text-[11px] px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors"
                                            >
                                                +{tag.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Scheduling & Publish Time */}
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs space-y-3">
                            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                                <Calendar size={16} className="text-orange-600" />
                                <h3 className="text-sm font-bold text-gray-800">Publish Timestamp</h3>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={data.published_at}
                                    onChange={(e) => setData('published_at', e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Override Reading Time (Minutes)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={data.reading_time_minutes}
                                    onChange={(e) => setData('reading_time_minutes', e.target.value)}
                                    placeholder="Leave blank for auto calculation"
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
