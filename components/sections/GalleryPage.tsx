import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Grid, Square, Sparkles } from 'lucide-react';
import { PHOTOS_DATA } from '../../data';
import LazyImage from '../ui/LazyImage';
import MemoryPortal from '../ui/MemoryPortal';

type GalleryLayout = 'bento' | 'uniform';

const GalleryPage = memo(({ onBack, onToggleNav }: { onBack: () => void, onToggleNav?: (visible: boolean) => void }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [layout, setLayout] = useState<GalleryLayout>('bento');
    const filteredPhotos = PHOTOS_DATA;

    // Helper functions for nav
    const handleNext = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prev) => (prev !== null && prev < filteredPhotos.length - 1 ? prev + 1 : 0));
        }
    };

    const handlePrev = () => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredPhotos.length - 1));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-6 pt-32 pb-24 relative z-10 select-none content-visibility-auto"
        >
            {/* Title Section with Controls underneath to prevent overlap */}
            <div className="mb-12 text-center relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h2 className="font-display text-5xl md:text-7xl text-white mb-4 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        Whispers of the Heart
                    </h2>
                    <p className="text-cinematic-gold/80 font-sans font-light tracking-wider text-sm md:text-base uppercase">
                        A collection of shared memories
                    </p>
                </motion.div>

                {/* Gallery Controls - Positioned in flow below title */}
                <div className="flex items-center justify-center gap-4 mt-8">
                    <button
                        onClick={onBack}
                        className="p-3 rounded-full border border-white/10 bg-black/40 text-white/70 hover:text-cinematic-gold hover:border-cinematic-gold/50 transition-all backdrop-blur-sm group"
                        title="Back"
                    >
                        <ArrowLeft size={20} strokeWidth={1.5} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div className="h-8 w-[1px] bg-white/10"></div>

                    <button
                        onClick={() => setLayout('bento')}
                        className={`p-3 rounded-full border border-white/10 bg-black/40 transition-all backdrop-blur-sm ${layout === 'bento' ? 'text-cinematic-gold border-cinematic-gold/50' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                        title="Jumbled View"
                    >
                        <Grid size={20} strokeWidth={1.5} />
                    </button>

                    <button
                        onClick={() => setLayout('uniform')}
                        className={`p-3 rounded-full border border-white/10 bg-black/40 transition-all backdrop-blur-sm ${layout === 'uniform' ? 'text-cinematic-gold border-cinematic-gold/50' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                        title="Uniform Grid"
                    >
                        <Square size={20} strokeWidth={1.5} />
                    </button>
                </div>
            </div>

            {/* Grid Layout - Masonry for Bento, Grid for Uniform */}
            <motion.div
                layout
                className={`
        mx-auto max-w-7xl pb-24
        ${layout === 'bento'
                        ? 'columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6' // Masonry Mode
                        : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-auto' // Uniform Grid
                    }
      `}
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.08,
                            delayChildren: 0.2
                        }
                    }
                }}
            >
                <AnimatePresence mode='popLayout'>
                    {filteredPhotos.map((photo) => (
                        <motion.div
                            key={photo.src}
                            layout
                            variants={{
                                hidden: { opacity: 0, y: 50, scale: 0.9 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    transition: { type: "spring", stiffness: 100, damping: 20 }
                                }
                            }}
                            className={`
              ${layout === 'bento' ? 'break-inside-avoid mb-4 md:mb-6 min-h-[100px]' : 'aspect-square'} 
              relative group cursor-zoom-in overflow-hidden rounded-2xl bg-[#0a0a0a] 
              border border-white/10 hover:border-cinematic-gold/50 shadow-lg 
              hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all duration-500 will-change-transform transform-gpu
            `}
                            onClick={() => {
                                // Find index in filtered list
                                const idx = filteredPhotos.findIndex(p => p.src === photo.src);
                                setSelectedImageIndex(idx);
                            }}
                        >
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

                            {/* Lazy Image Replacement */}
                            <LazyImage
                                src={photo.src}
                                alt=""
                                className={`w-full ${layout === 'bento' ? 'h-auto' : 'h-full object-cover'} transform scale-100 group-hover:scale-105 transition-all duration-[1.2s] ease-in-out will-change-transform block`}
                            />

                            {/* Hover Icon */}
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-20">
                                <div className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-cinematic-gold">
                                    <Sparkles size={16} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredPhotos.length === 0 && (
                    <div className="col-span-full text-center py-24 text-white/40">
                        <p className="font-display text-2xl mb-2">No memories found</p>
                    </div>
                )}
            </motion.div>

            {/* Cinematic Memory Portal (Replaces Lightbox) */}
            <AnimatePresence>
                {selectedImageIndex !== null && filteredPhotos[selectedImageIndex] && (
                    <MemoryPortal
                        photo={filteredPhotos[selectedImageIndex]}
                        onClose={() => setSelectedImageIndex(null)}
                        onNext={handleNext}
                        onPrev={handlePrev}
                        currentIndex={selectedImageIndex}
                        total={filteredPhotos.length}
                        onToggleNav={onToggleNav}
                    />
                )}
            </AnimatePresence>
        </motion.div >
    );
});

export default GalleryPage;
