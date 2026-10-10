import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, RotateCcw, Calendar, Tag } from 'lucide-react';

export interface GalleryPhoto {
    id: number;
    title: string;
    caption?: string | null;
    image_path: string;
    year: number;
    section?: {
        id: number;
        name: string;
        slug: string;
    } | null;
}

interface Props {
    photos: GalleryPhoto[];
    currentIndex: number;
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (newIndex: number) => void;
}

export default function GalleryLightbox({ photos, currentIndex, isOpen, onClose, onNavigate }: Props) {
    const [zoomLevel, setZoomLevel] = useState(1);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const currentPhoto = photos[currentIndex];

    const handlePrev = useCallback(() => {
        setZoomLevel(1);
        onNavigate((currentIndex - 1 + photos.length) % photos.length);
    }, [currentIndex, photos.length, onNavigate]);

    const handleNext = useCallback(() => {
        setZoomLevel(1);
        onNavigate((currentIndex + 1) % photos.length);
    }, [currentIndex, photos.length, onNavigate]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === '+' || e.key === '=') {
                setZoomLevel(prev => Math.min(prev + 0.25, 3));
            } else if (e.key === '-') {
                setZoomLevel(prev => Math.max(prev - 0.25, 1));
            } else if (e.key === '0') {
                setZoomLevel(1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, handlePrev, handleNext, onClose]);

    // Touch Swipe Handlers for mobile
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext();
        } else if (isRightSwipe) {
            handlePrev();
        }
    };

    if (!isOpen || !currentPhoto) return null;

    return (
        <div
            ref={modalRef}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between select-none animate-fadeIn"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Top Bar: Counter & Controls */}
            <div className="p-4 flex items-center justify-between text-white/80 z-10 bg-gradient-to-b from-black/80 to-transparent">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium tracking-wide bg-white/10 px-3 py-1 rounded-full text-white">
                        {currentIndex + 1} / {photos.length}
                    </span>
                    {currentPhoto.section && (
                        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-orange-400 bg-orange-950/60 border border-orange-800/60 px-2.5 py-1 rounded-full">
                            <Tag size={12} />
                            {currentPhoto.section.name}
                        </span>
                    )}
                    <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-300 bg-white/10 px-2.5 py-1 rounded-full">
                        <Calendar size={12} />
                        {currentPhoto.year}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Zoom In */}
                    <button
                        type="button"
                        onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3))}
                        disabled={zoomLevel >= 3}
                        className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white disabled:opacity-30 transition-colors"
                        title="Zoom In (+)"
                    >
                        <ZoomIn size={18} />
                    </button>
                    {/* Zoom Out */}
                    <button
                        type="button"
                        onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 1))}
                        disabled={zoomLevel <= 1}
                        className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white disabled:opacity-30 transition-colors"
                        title="Zoom Out (-)"
                    >
                        <ZoomOut size={18} />
                    </button>
                    {/* Reset Zoom */}
                    {zoomLevel > 1 && (
                        <button
                            type="button"
                            onClick={() => setZoomLevel(1)}
                            className="p-2 rounded-full hover:bg-white/10 text-orange-400 hover:text-orange-300 transition-colors text-xs font-semibold flex items-center gap-1"
                            title="Reset Zoom (0)"
                        >
                            <RotateCcw size={16} />
                        </button>
                    )}
                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/20 text-white transition-colors ml-2 bg-white/10"
                        title="Close (Esc)"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Main Stage: Photo & Navigation Arrows */}
            <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden">
                {/* Previous Button */}
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-xs transition-all hover:scale-105"
                    title="Previous (Left Arrow)"
                >
                    <ChevronLeft size={28} />
                </button>

                {/* Center Image with Zoom */}
                <div
                    className="max-w-full max-h-[75vh] flex items-center justify-center transition-transform duration-200 ease-out"
                    style={{ transform: `scale(${zoomLevel})` }}
                >
                    <img
                        src={currentPhoto.image_path}
                        alt={currentPhoto.title}
                        className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl transition-opacity duration-300"
                    />
                </div>

                {/* Next Button */}
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-xs transition-all hover:scale-105"
                    title="Next (Right Arrow)"
                >
                    <ChevronRight size={28} />
                </button>
            </div>

            {/* Bottom Caption Bar */}
            <div className="p-4 sm:p-6 text-center z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                <h3 className="text-white text-base sm:text-lg font-semibold tracking-wide max-w-3xl mx-auto">
                    {currentPhoto.title}
                </h3>
                {currentPhoto.caption && (
                    <p className="text-gray-300 text-xs sm:text-sm mt-1 max-w-2xl mx-auto font-normal leading-relaxed">
                        {currentPhoto.caption}
                    </p>
                )}
            </div>
        </div>
    );
}
