import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import SeoHead from '@/components/public/SeoHead';
import {
    Calendar, Clock, Eye, Share2, Tag as TagIcon,
    ArrowLeft, ArrowRight, Check, HeartHandshake, Phone,
    ChevronRight, BookOpen, MessageCircle, Twitter, Facebook,
    Linkedin, Copy, ShieldCheck, Sparkles, Image as ImageIcon
} from 'lucide-react';
import { getColorHex } from '@/utils/colors';

interface Category {
    id: number;
    name: string;
    slug: string;
    badge_color?: string;
}

interface Tag {
    id: number;
    name: string;
    slug: string;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    author_name: string;
    excerpt?: string | null;
    content: string;
    featured_image?: string | null;
    image_caption?: string | null;
    reading_time_minutes: number;
    published_at?: string | null;
    views_count?: number;
    meta_title?: string | null;
    meta_description?: string | null;
    meta_keywords?: string | null;
    category?: Category | null;
    tags?: Tag[];
}

interface NavPost {
    id: number;
    title: string;
    slug: string;
    featured_image?: string | null;
    category?: Category | null;
}

interface Props {
    post: Post;
    relatedPosts: Post[];
    previousPost: NavPost | null;
    nextPost: NavPost | null;
    popularTags: Tag[];
}

export default function BlogShow({
    post,
    relatedPosts = [],
    previousPost,
    nextPost,
    popularTags = [],
}: Props) {
    const [readingProgress, setReadingProgress] = useState(0);
    const [copied, setCopied] = useState(false);

    // Scroll reading progress calculation
    useEffect(() => {
        const updateProgress = () => {
            const article = document.getElementById('article-content');
            if (!article) return;

            const totalHeight = article.scrollHeight - window.innerHeight;
            const scrolled = window.scrollY - (article.offsetTop - 100);

            if (scrolled <= 0) {
                setReadingProgress(0);
            } else {
                const progress = Math.min(100, Math.max(0, (scrolled / (article.scrollHeight - 300)) * 100));
                setReadingProgress(progress);
            }
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = post.title;

    const copyToClipboard = () => {
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            const month = date.toLocaleString('en-US', { month: 'long' });
            const day = date.getDate();
            const year = date.getFullYear();
            return `${month} ${day}, ${year}`;
        } catch {
            return dateStr;
        }
    };

    const { settings = {} } = usePage().props as { settings?: Record<string, string> };
    const siteName = settings['site_name'] || 'Maa Tara Freedom Trust';

    const seoTitle = post.meta_title || `${post.title} — ${siteName}`;
    const seoDescription = post.meta_description || post.excerpt || 'Evidence-based rehabilitation guidance, addiction detox advice, and psychological insights from Maa Tara Freedom Trust.';

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: seoDescription,
        image: post.featured_image ? [post.featured_image] : ['https://maatarafreedomtrust.org/logo.jpeg'],
        datePublished: post.published_at || new Date().toISOString(),
        author: {
            '@type': 'Person',
            name: post.author_name || 'Maa Tara Care Team',
        },
        publisher: {
            '@type': 'Organization',
            name: siteName,
            logo: {
                '@type': 'ImageObject',
                url: 'https://maatarafreedomtrust.org/logo.jpeg',
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://maatarafreedomtrust.org/blog/${post.slug}`,
        },
    };

    return (
        <PublicLayout title={post.title}>
            <SeoHead
                title={seoTitle}
                description={seoDescription}
                keywords={post.meta_keywords ? post.meta_keywords.split(',').map(k => k.trim()) : undefined}
                canonicalPath={`/blog/${post.slug}`}
                ogImage={post.featured_image || undefined}
                ogType="article"
                schemaJson={articleSchema}
                settings={settings}
            />

            {/* Reading Progress Indicator Bar (Top Fixed) */}
            <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-gray-100/60">
                <div
                    className="h-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 transition-all duration-150 ease-out"
                    style={{ width: `${readingProgress}%` }}
                />
            </div>

            {/* Light Breadcrumbs Header */}
            <div className="bg-slate-50/70 border-b border-gray-100 py-3.5">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <nav className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto whitespace-nowrap">
                        <Link href="/" className="hover:text-orange-600 transition-colors">
                            Home
                        </Link>
                        <ChevronRight size={12} className="text-gray-400 shrink-0" />
                        <Link href="/blog" className="hover:text-orange-600 transition-colors">
                            Blog & Insights
                        </Link>
                        {post.category && (
                            <>
                                <ChevronRight size={12} className="text-gray-400 shrink-0" />
                                <Link
                                    href={`/blog?category=${post.category.slug}`}
                                    className="hover:text-orange-600 transition-colors font-medium text-gray-700"
                                >
                                    {post.category.name}
                                </Link>
                            </>
                        )}
                        <ChevronRight size={12} className="text-gray-400 shrink-0" />
                        <span className="text-gray-400 truncate max-w-[180px] sm:max-w-xs">{post.title}</span>
                    </nav>
                </div>
            </div>

            {/* Main Article Container */}
            <article id="article-content" className="py-8 sm:py-14 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    {/* Header Details */}
                    <div className="space-y-4 text-left mb-8">
                        {post.category && (
                            <Link
                                href={`/blog?category=${post.category.slug}`}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-white text-xs font-bold shadow-xs hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: getColorHex(post.category.badge_color) }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                {post.category.name}
                            </Link>
                        )}

                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold text-gray-900 tracking-tight leading-tight">
                            {post.title}
                        </h1>

                        {post.excerpt && (
                            <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed">
                                {post.excerpt}
                            </p>
                        )}

                        {/* Author & Metadata Strip */}
                        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-100 text-xs text-gray-500">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 font-bold text-sm flex items-center justify-center border border-orange-200 shrink-0">
                                    {(post.author_name || 'M').charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 text-sm">
                                        {post.author_name || 'Maa Tara Care Team'}
                                    </div>
                                    <div className="text-gray-400 text-[11px]">
                                        Clinical Rehabilitation Specialist
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={14} className="text-orange-600" />
                                    {formatDate(post.published_at)}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock size={14} className="text-orange-600" />
                                    {post.reading_time_minutes} min read
                                </span>
                                {typeof post.views_count === 'number' && (
                                    <span className="flex items-center gap-1.5">
                                        <Eye size={14} className="text-orange-600" />
                                        {post.views_count} views
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Featured Thumbnail Image (Prominent & Elegantly Framed) */}
                    {post.featured_image && (
                        <div className="mb-10 rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-slate-50">
                            <div className="relative aspect-[16/9] sm:aspect-[21/9] max-h-[500px] w-full overflow-hidden">
                                <img
                                    src={post.featured_image}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                    loading="eager"
                                />
                            </div>
                            {post.image_caption && (
                                <div className="p-3.5 text-center text-xs text-gray-500 italic bg-slate-50/90 border-t border-gray-100 flex items-center justify-center gap-1.5">
                                    <ImageIcon size={13} className="text-gray-400" />
                                    <span>{post.image_caption}</span>
                                </div>
                            )}
                        </div>
                    ) }

                    {/* Rich Text Body */}
                    <div
                        className="tiptap-content prose prose-orange max-w-none text-gray-800 leading-relaxed text-base sm:text-lg"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Tags List */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                                <TagIcon size={14} className="text-orange-600" /> Tags:
                            </span>
                            {post.tags.map((tag) => (
                                <Link
                                    key={tag.id}
                                    href={`/blog?tag=${tag.slug}`}
                                    className="text-xs px-3 py-1 rounded-full bg-slate-100 hover:bg-orange-50 text-gray-700 hover:text-orange-700 font-medium transition-colors"
                                >
                                    #{tag.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Social Share Bar */}
                    <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                            <Share2 size={16} className="text-orange-600" />
                            <span>Share this clinical insight:</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* WhatsApp */}
                            <a
                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-2xs"
                                title="Share on WhatsApp"
                            >
                                <MessageCircle size={16} />
                            </a>

                            {/* Twitter / X */}
                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white transition-colors shadow-2xs"
                                title="Share on X (Twitter)"
                            >
                                <Twitter size={16} />
                            </a>

                            {/* Facebook */}
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-2xs"
                                title="Share on Facebook"
                            >
                                <Facebook size={16} />
                            </a>

                            {/* LinkedIn */}
                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white transition-colors shadow-2xs"
                                title="Share on LinkedIn"
                            >
                                <Linkedin size={16} />
                            </a>

                            {/* Copy Link */}
                            <button
                                type="button"
                                onClick={copyToClipboard}
                                className="px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                                title="Copy Article Link"
                            >
                                {copied ? (
                                    <>
                                        <Check size={14} className="text-emerald-600" />
                                        <span className="text-emerald-600">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy size={14} />
                                        <span>Copy Link</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Author Clinical Bio Card */}
                    <div className="mt-10 p-6 sm:p-7 rounded-3xl bg-orange-50/40 border border-orange-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-sm">
                            {(post.author_name || 'M').charAt(0)}
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-extrabold text-sm sm:text-base text-gray-900">
                                    Authored by {post.author_name || 'Maa Tara Care Team'}
                                </h3>
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold">
                                    <ShieldCheck size={11} /> Verified Care
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Our multidisciplinary clinical panel consists of certified psychiatrists, clinical psychologists, de-addiction specialists, and experienced recovery peer counselors dedicated to evidence-based sobriety.
                            </p>
                        </div>
                    </div>

                    {/* Confidential Consultation Callout Card */}
                    <div className="mt-10 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white text-center space-y-4 shadow-lg relative overflow-hidden">
                        <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-xs flex items-center justify-center mx-auto text-white">
                            <HeartHandshake size={26} />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-extrabold">
                            Taking the First Step Towards Freedom?
                        </h3>
                        <p className="text-white/90 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                            Addiction is a treatable medical condition. Reach out to our compassionate team for confidential admission assessment and family counseling.
                        </p>
                        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                            <a
                                href="tel:+919876543210"
                                className="px-6 py-3 bg-white text-orange-700 hover:bg-orange-50 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
                            >
                                <Phone size={15} /> 24/7 Helpline: +91-9876543210
                            </a>
                            <Link
                                href="/appointment"
                                className="px-6 py-3 bg-black/20 hover:bg-black/30 text-white font-semibold text-xs rounded-xl backdrop-blur-xs transition-colors"
                            >
                                Book Confidential Appointment
                            </Link>
                        </div>
                    </div>

                    {/* Prev / Next Article Navigation */}
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-8">
                        {previousPost ? (
                            <Link
                                href={`/blog/${previousPost.slug}`}
                                className="p-4 rounded-2xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all flex items-center gap-3 group"
                            >
                                <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-orange-600 group-hover:text-white transition-colors shrink-0">
                                    <ArrowLeft size={16} />
                                </div>
                                <div className="min-w-0">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Previous Article</span>
                                    <h4 className="text-xs font-bold text-gray-800 truncate group-hover:text-orange-600 transition-colors">
                                        {previousPost.title}
                                    </h4>
                                </div>
                            </Link>
                        ) : <div />}

                        {nextPost ? (
                            <Link
                                href={`/blog/${nextPost.slug}`}
                                className="p-4 rounded-2xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all flex items-center justify-end gap-3 text-right group"
                            >
                                <div className="min-w-0">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Next Article</span>
                                    <h4 className="text-xs font-bold text-gray-800 truncate group-hover:text-orange-600 transition-colors">
                                        {nextPost.title}
                                    </h4>
                                </div>
                                <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-orange-600 group-hover:text-white transition-colors shrink-0">
                                    <ArrowRight size={16} />
                                </div>
                            </Link>
                        ) : <div />}
                    </div>

                    {/* Related Articles Section */}
                    {relatedPosts && relatedPosts.length > 0 && (
                        <div className="mt-14 pt-8 border-t border-gray-100">
                            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                                <BookOpen size={18} className="text-orange-600" />
                                Related Articles & Guides
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                {relatedPosts.map((rel) => (
                                    <Link
                                        key={rel.id}
                                        href={`/blog/${rel.slug}`}
                                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col"
                                    >
                                        <div className="h-36 overflow-hidden bg-slate-100">
                                            <img
                                                src={rel.featured_image || '/logo.jpeg'}
                                                alt={rel.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                                            {rel.category && (
                                                <span
                                                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white w-fit"
                                                    style={{ backgroundColor: getColorHex(rel.category.badge_color) }}
                                                >
                                                    {rel.category.name}
                                                </span>
                                            )}
                                            <h3 className="text-xs font-bold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                                                {rel.title}
                                            </h3>
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                <Clock size={11} /> {rel.reading_time_minutes}m read
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </article>
        </PublicLayout>
    );
}
