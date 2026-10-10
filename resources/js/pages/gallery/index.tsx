import { useState, useEffect, useCallback } from 'react';
import { router, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/PublicLayout';
import SeoHead from '@/components/public/SeoHead';
import {
    Image as ImageIcon, Video, Calendar, Filter, X,
    ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw,
    Layers, Sparkles, Eye, Phone, HeartHandshake, MapPin,
    Compass
} from 'lucide-react';

interface GallerySection {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    cover_image?: string | null;
    items_count?: number;
}

interface GalleryItem {
    id: number;
    section_id?: number | null;
    title: string;
    caption?: string | null;
    description?: string | null;
    media_type: 'image' | 'video';
    image_path: string;
    file_path?: string;
    thumbnail_path?: string | null;
    video_url?: string | null;
    year: number;
    is_featured: boolean;
    section?: GallerySection | null;
}

interface Props {
    sections: GallerySection[];
    years: number[];
    items: GalleryItem[];
    featuredItems: GalleryItem[];
    filters: {
        section: string;
        year: string;
    };
}

export default function GalleryIndex({
    sections = [],
    years = [],
    items = [],
    featuredItems = [],
    filters = { section: 'all', year: '' },
}: Props) {
    const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
    const [zoomLevel, setZoomLevel] = useState<number>(1);

    const handleSectionChange = (sectionSlug: string) => {
        router.get('/gallery', {
            ...filters,
            section: sectionSlug,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleYearChange = (year: string) => {
        router.get('/gallery', {
            ...filters,
            year: year,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        router.get('/gallery', {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const hasActiveFilters = Boolean(
        (filters.section && filters.section !== 'all') ||
        (filters.year && filters.year !== '')
    );

    // Lightbox navigation
    const openLightbox = (index: number) => {
        setActiveLightboxIndex(index);
        setZoomLevel(1);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setActiveLightboxIndex(null);
        setZoomLevel(1);
        document.body.style.overflow = 'unset';
    };

    const nextLightboxItem = useCallback(() => {
        if (activeLightboxIndex !== null && items.length > 0) {
            setActiveLightboxIndex((prev) => (prev !== null ? (prev + 1) % items.length : 0));
            setZoomLevel(1);
        }
    }, [activeLightboxIndex, items.length]);

    const prevLightboxItem = useCallback(() => {
        if (activeLightboxIndex !== null && items.length > 0) {
            setActiveLightboxIndex((prev) => (prev !== null ? (prev - 1 + items.length) % items.length : 0));
            setZoomLevel(1);
        }
    }, [activeLightboxIndex, items.length]);

    // Keyboard navigation for Lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (activeLightboxIndex === null) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextLightboxItem();
            if (e.key === 'ArrowLeft') prevLightboxItem();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeLightboxIndex, nextLightboxItem, prevLightboxItem]);

    const activeItem = activeLightboxIndex !== null ? items[activeLightboxIndex] : null;
    const { settings = {} } = usePage().props as { settings?: Record<string, string> };
    const siteName = settings['site_name'] || 'Maa Tara Freedom Trust';

    return (
        <PublicLayout title="Photo & Video Gallery">
            <SeoHead
                title={`Photo & Video Gallery — Best Rehab Center in Ranchi | ${siteName}`}
                description="Explore our residential campus infrastructure, daily yoga & meditation sessions, clinical therapy activities, and milestones at Maa Tara Freedom Trust, Ranchi."
                canonicalPath="/gallery"
                keywords={[
                    'rehab center gallery ranchi',
                    'nasha mukti kendra photos ranchi',
                    'rehab campus infrastructure ranchi images',
                    'addiction recovery center pictures jharkhand',
                    'yoga and meditation rehab ranchi',
                ]}
                settings={settings}
            />

            {/* Light, Airy Hero Header */}
            <section className="bg-gradient-to-b from-orange-50/60 via-slate-50/40 to-white py-12 sm:py-16 border-b border-gray-100 text-center px-4">
                <div className="max-w-4xl mx-auto space-y-3.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/70 text-orange-800 text-xs font-semibold">
                        <ImageIcon size={13} className="text-orange-600" />
                        A Glimpse of Recovery Life
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Life, Campus & Healing Gallery
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                        A visual window into the serene environment, daily therapeutic schedules, and milestones achieved by our residents on their road to freedom.
                    </p>
                </div>
            </section>

            {/* Sticky Two-Tier Filter Navigation */}
            <div className="bg-white/95 backdrop-blur-xs border-b border-gray-100 sticky top-16 md:top-20 z-20 shadow-2xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 space-y-2">
                    {/* Tier 1: Section Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                        <button
                            type="button"
                            onClick={() => handleSectionChange('all')}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${!filters.section || filters.section === 'all'
                                    ? 'bg-gray-900 text-white shadow-2xs'
                                    : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
                                }`}
                        >
                            All Collections
                        </button>

                        {sections.map((sec) => {
                            const isSelected = filters.section === sec.slug;
                            return (
                                <button
                                    key={sec.id}
                                    type="button"
                                    onClick={() => handleSectionChange(sec.slug)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all flex items-center gap-2 ${isSelected
                                            ? 'bg-orange-600 text-white shadow-2xs'
                                            : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
                                        }`}
                                >
                                    <span>{sec.name}</span>
                                    {typeof sec.items_count === 'number' && (
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-white text-gray-500 border border-gray-200'
                                            }`}>
                                            {sec.items_count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tier 2: Year Filter Pills */}
                    {years && years.length > 0 && (
                        <div className="flex items-center gap-2 pt-1 border-t border-gray-100 overflow-x-auto no-scrollbar">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
                                <Calendar size={11} /> Year:
                            </span>
                            <button
                                type="button"
                                onClick={() => handleYearChange('')}
                                className={`px-2.5 py-0.5 rounded-md text-xs font-medium shrink-0 transition-colors ${!filters.year
                                        ? 'bg-orange-100 text-orange-800 font-bold'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-slate-100'
                                    }`}
                            >
                                All Years
                            </button>
                            {years.map((yr) => (
                                <button
                                    key={yr}
                                    type="button"
                                    onClick={() => handleYearChange(String(yr))}
                                    className={`px-2.5 py-0.5 rounded-md text-xs font-medium shrink-0 transition-colors ${filters.year === String(yr)
                                            ? 'bg-orange-100 text-orange-800 font-bold'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-slate-100'
                                        }`}
                                >
                                    {yr}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Active Filter Strip */}
                {hasActiveFilters && (
                    <div className="mb-8 p-3 rounded-xl bg-orange-50/80 border border-orange-100 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-orange-950">Showing:</span>
                            {filters.section && filters.section !== 'all' && (
                                <span className="px-2.5 py-1 bg-white text-gray-800 rounded-lg border border-orange-200 font-medium">
                                    Section: {sections.find(s => s.slug === filters.section)?.name || filters.section}
                                </span>
                            )}
                            {filters.year && (
                                <span className="px-2.5 py-1 bg-white text-gray-800 rounded-lg border border-orange-200 font-medium">
                                    Year: {filters.year}
                                </span>
                            )}
                            <span className="text-gray-400">({items.length} items)</span>
                        </div>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition-colors shadow-2xs"
                        >
                            <X size={13} /> Reset View
                        </button>
                    </div>
                )}

                {/* Media Grid */}
                {items.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center space-y-3 shadow-xs">
                        <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
                            <ImageIcon size={28} />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">No media found in this collection</h3>
                        <p className="text-xs text-gray-500 max-w-md mx-auto">
                            There are currently no photos or videos matching the selected category and year filters.
                        </p>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors shadow-2xs"
                        >
                            View All Media
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                onClick={() => openLightbox(index)}
                                className="group relative bg-slate-100 rounded-2xl overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 cursor-pointer aspect-4/3"
                            >
                                <img
                                    src={item.image_path || item.thumbnail_path || item.file_path}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                                    loading="lazy"
                                />

                                {/* Video or Featured Indicators */}
                                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
                                    {item.media_type === 'video' && (
                                        <span className="p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-xs shadow-xs">
                                            <Video size={12} />
                                        </span>
                                    )}
                                    {item.is_featured && (
                                        <span className="p-1.5 rounded-lg bg-orange-600 text-white shadow-xs">
                                            <Sparkles size={12} />
                                        </span>
                                    )}
                                </div>

                                {item.year && (
                                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono font-bold backdrop-blur-xs z-10">
                                        {item.year}
                                    </span>
                                )}

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end text-white">
                                    {item.section && (
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-orange-300 mb-0.5">
                                            {item.section.name}
                                        </span>
                                    )}
                                    <h4 className="text-xs sm:text-sm font-bold line-clamp-1 leading-snug">
                                        {item.title}
                                    </h4>
                                    {(item.caption || item.description) && (
                                        <p className="text-[11px] text-white/80 line-clamp-2 mt-0.5 leading-relaxed">
                                            {item.caption || item.description}
                                        </p>
                                    )}
                                    <div className="mt-2 flex items-center justify-between text-[10px] text-white/90 pt-1.5 border-t border-white/20">
                                        <span className="flex items-center gap-1">
                                            <Eye size={11} /> View
                                        </span>
                                        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                            <ZoomIn size={11} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tour Campus & Admission Consultation Callout */}
                <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white text-center space-y-4 shadow-lg relative overflow-hidden">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto text-white">
                        <MapPin size={24} />
                    </div>
                    <div className="space-y-1.5 max-w-2xl mx-auto">
                        <h3 className="text-xl sm:text-2xl font-extrabold">
                            Experience Our Rehabilitation Campus in Person
                        </h3>
                        <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
                            We welcome families to visit our peaceful facility, inspect living amenities, meet our psychiatric counselors, and witness our patient recovery ecosystem firsthand.
                        </p>
                    </div>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                        <a
                            href="tel:+919876543210"
                            className="px-6 py-3 bg-white text-orange-700 hover:bg-orange-50 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
                        >
                            <Phone size={14} /> Call for Campus Visit: +91-9876543210
                        </a>
                        <a
                            href="/contact"
                            className="px-6 py-3 bg-black/20 hover:bg-black/30 text-white font-semibold text-xs rounded-xl backdrop-blur-xs transition-colors"
                        >
                            Get Directions
                        </a>
                    </div>
                </div>
            </div>

            {/* Interactive Lightbox Modal */}
            {activeItem && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between animate-fadeIn">
                    {/* Top Control Bar */}
                    <div className="p-4 sm:p-6 flex items-center justify-between text-white border-b border-white/10 z-20">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-orange-400">
                                {activeLightboxIndex! + 1} / {items.length}
                            </span>
                            {activeItem.section && (
                                <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white font-semibold border border-white/15 hidden sm:inline-block">
                                    {activeItem.section.name}
                                </span>
                            )}
                            {activeItem.year && (
                                <span className="text-xs font-mono text-gray-400">
                                    ({activeItem.year})
                                </span>
                            )}
                        </div>

                        {/* Zoom & Close controls */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setZoomLevel((z) => Math.min(z + 0.3, 2.5))}
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                                title="Zoom In"
                            >
                                <ZoomIn size={18} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setZoomLevel((z) => Math.max(z - 0.3, 0.7))}
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                                title="Zoom Out"
                            >
                                <ZoomOut size={18} />
                            </button>
                            {zoomLevel !== 1 && (
                                <button
                                    type="button"
                                    onClick={() => setZoomLevel(1)}
                                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                                    title="Reset Zoom"
                                >
                                    <RotateCcw size={18} />
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={closeLightbox}
                                className="p-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white transition-colors ml-2"
                                title="Close (Esc)"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Image Viewer Center Stage */}
                    <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden select-none">
                        {/* Prev Button */}
                        {items.length > 1 && (
                            <button
                                type="button"
                                onClick={prevLightboxItem}
                                className="absolute left-4 sm:left-8 z-20 p-3 rounded-2xl bg-white/10 hover:bg-white/25 text-white backdrop-blur-xs transition-colors shadow-lg"
                                title="Previous (Left Arrow)"
                            >
                                <ChevronLeft size={28} />
                            </button>
                        )}

                        {/* Media Display */}
                        <div
                            className="max-w-5xl max-h-[75vh] transition-transform duration-200 flex items-center justify-center"
                            style={{ transform: `scale(${zoomLevel})` }}
                        >
                            {activeItem.media_type === 'video' ? (
                                <video
                                    src={activeItem.video_url || activeItem.image_path || activeItem.file_path}
                                    controls
                                    autoPlay
                                    className="max-h-[75vh] max-w-full rounded-2xl shadow-2xl object-contain"
                                />
                            ) : (
                                <img
                                    src={activeItem.image_path || activeItem.file_path || activeItem.thumbnail_path || ""}
                                    alt={activeItem.title}
                                    className="max-h-[75vh] max-w-full rounded-2xl shadow-2xl object-contain"
                                />
                            )}
                        </div>

                        {/* Next Button */}
                        {items.length > 1 && (
                            <button
                                type="button"
                                onClick={nextLightboxItem}
                                className="absolute right-4 sm:right-8 z-20 p-3 rounded-2xl bg-white/10 hover:bg-white/25 text-white backdrop-blur-xs transition-colors shadow-lg"
                                title="Next (Right Arrow)"
                            >
                                <ChevronRight size={28} />
                            </button>
                        )}
                    </div>

                    {/* Bottom Info Caption Bar */}
                    <div className="p-4 sm:p-6 bg-black/60 border-t border-white/10 text-white text-center max-w-3xl mx-auto w-full z-20">
                        <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                            {activeItem.title}
                        </h3>
                        {(activeItem.caption || activeItem.description) && (
                            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl mx-auto leading-relaxed">
                                {activeItem.caption || activeItem.description}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
