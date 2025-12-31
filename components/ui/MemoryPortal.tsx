import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PHOTOS_DATA } from '../../data';

const MemoryPortal = ({ photo, onClose, onNext, onPrev, currentIndex, total, onToggleNav }: { photo: any, onClose: () => void, onNext: () => void, onPrev: () => void, currentIndex: number, total: number, onToggleNav?: (visible: boolean) => void }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    // Auto-advance slideshow logic
    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                onNext();
            }, 4000); // Change slide every 4 seconds
        }
        return () => clearInterval(interval);
    }, [isPlaying, onNext]);

    // Hide Nav on Mount, Show on Unmount
    useEffect(() => {
        if (onToggleNav) onToggleNav(false);
        return () => {
            if (onToggleNav) onToggleNav(true);
        };
    }, [onToggleNav]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-4 backdrop-blur-md select-none"
        >
            {/* Cinematic Background Particles within Modal */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-[150vw] h-[150vh] left-[-25vw] top-[-25vh] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_60%)]"></div>
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="absolute bg-cinematic-gold rounded-full opacity-20 animate-float" style={{
                        left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
                        width: Math.random() * 3 + 'px', height: Math.random() * 3 + 'px',
                        animationDuration: `${Math.random() * 5 + 5}s`, animationDelay: `${Math.random() * 2}s`
                    }}></div>
                ))}
            </div>

            {/* Top Controls - Fixed to Screen Corners for consistency */}
            <div className="fixed top-6 right-6 z-[110] flex items-center gap-3">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`p-4 rounded-full border backdrop-blur-md transition-all duration-300 ${isPlaying ? 'bg-cinematic-gold/20 text-cinematic-gold border-cinematic-gold' : 'bg-black/40 text-white/70 border-white/10 hover:text-cinematic-gold hover:border-cinematic-gold/50 hover:bg-black/60'}`}
                    title={isPlaying ? "Pause Slideshow" : "Start Slideshow"}
                >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                </button>

                <button
                    onClick={onClose}
                    className="p-4 rounded-full border border-white/10 bg-black/40 text-white/70 hover:text-red-400 hover:border-red-500/50 hover:bg-black/60 backdrop-blur-md transition-all"
                    title="Close"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Main Card Container */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className="relative w-full h-full flex items-center justify-center pointer-events-none"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Portal Stage (Center) */}
                <div className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden pointer-events-auto">
                    {/* Previous Button - Fixed Left */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onPrev(); }}
                        className="fixed left-6 top-1/2 -translate-y-1/2 z-[110] p-4 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 hover:border-cinematic-gold/50 text-white/50 hover:text-cinematic-gold transition-all backdrop-blur-md group"
                    >
                        <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
                    </button>

                    {/* Glowing Portal Frame - Adaptive Size */}
                    <motion.div
                        className="relative z-20 max-w-[90vw] max-h-[85vh] w-auto h-auto rounded-[1rem] md:rounded-[2rem] overflow-hidden border-[2px] border-cinematic-gold/30 shadow-[0_0_80px_rgba(212,175,55,0.15),inset_0_0_40px_rgba(0,0,0,0.8)] transform-gpu will-change-transform flex items-center justify-center bg-black"
                        initial={{ boxShadow: "0 0 0px rgba(212,175,55,0)" }}
                        animate={{ boxShadow: ["0 0 20px rgba(212,175,55,0.1)", "0 0 40px rgba(212,175,55,0.2)", "0 0 20px rgba(212,175,55,0.1)"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        {/* The Living Image - Full View */}
                        <motion.img
                            key={photo.src} // Reset animation on change
                            src={photo.src}
                            className="max-w-full max-h-[85vh] w-auto h-auto object-contain select-none"
                            initial={{ scale: 1.0 }}
                            animate={{
                                scale: [1.0, 1.05], // Subtle breathe instead of pan
                            }}
                            transition={{
                                scale: { duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                            }}
                            draggable="false"
                            onContextMenu={(e) => e.preventDefault()}
                        />
                        {/* Overlay to prevent right click saving even more */}
                        <div className="absolute inset-0 bg-transparent z-50"></div>

                        {/* Inner Vignette for Portal Depth */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.5)_100%)] pointer-events-none z-30"></div>
                    </motion.div>

                    {/* Next Button - Fixed Right */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onNext(); }}
                        className="fixed right-6 top-1/2 -translate-y-1/2 z-[110] p-4 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 hover:border-cinematic-gold/50 text-white/50 hover:text-cinematic-gold transition-all backdrop-blur-md group"
                    >
                        <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Footer / Pagination Dots - Fixed Bottom Center */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] h-16 flex items-center justify-center gap-3 pointer-events-auto">
                    {PHOTOS_DATA.map((_, idx) => {
                        // Only show a window of dots if too many
                        if (Math.abs(currentIndex - idx) > 4) return null;

                        return (
                            <button
                                key={idx}
                                onClick={() => { /* jump logic could go here */ }}
                                className={`rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-3 h-3 bg-cinematic-gold shadow-[0_0_8px_#D4AF37]' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'}`}
                            />
                        );
                    })}
                </div>

            </motion.div>
        </motion.div>
    );
};

export default MemoryPortal;
