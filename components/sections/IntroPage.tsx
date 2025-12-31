import { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const IntroPage = memo(({ onEnter }: { onEnter: () => void }) => {
    const basePath = window.location.hostname === 'localhost' ? '/' : '/madhouse-memory/';

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden select-none"
            // Updated Exit Transition: Cinematic Zoom, Blur, and Fade
            exit={{
                opacity: 0,
                scale: 1.5,
                filter: "blur(20px)",
                transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
            }}
        >
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    poster={`${basePath}video-poster.png`}
                    className="w-full h-full object-cover"
                    key="video-bg"
                >
                    <source src={`${basePath}video.mp4`} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="relative z-10 text-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                >
                    <div className="inline-block mb-6 relative">
                        <h2 className="text-cinematic-gold text-xs md:text-sm tracking-[0.5em] uppercase font-sans drop-shadow-lg relative z-10">The Journey Of</h2>
                        <div className="absolute -inset-4 bg-cinematic-gold/10 blur-xl rounded-full opacity-50"></div>
                    </div>

                    <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40 mb-8 tracking-wide drop-shadow-2xl animate-float p-4 leading-tight">
                        MadHouse
                    </h1>
                    <p className="font-serif italic text-white/70 text-lg md:text-2xl max-w-xl mx-auto mb-16 leading-relaxed text-shadow-sm">
                        "We took photos as a return ticket to the moments we'll cherish forever."
                    </p>

                    <button
                        onClick={onEnter}
                        className="group relative inline-flex items-center justify-center px-12 py-4 overflow-hidden font-sans text-sm font-medium tracking-[0.2em] text-white transition-all duration-500 ease-out rounded-full hover:scale-105"
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                        <span className="absolute inset-0 w-full h-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 border border-white/20 rounded-full blur-[2px]"></span>
                        <span className="absolute inset-0 w-full h-full border border-white/30 rounded-full group-hover:border-cinematic-gold/60 transition-colors duration-500"></span>

                        <span className="relative mr-3 uppercase group-hover:text-cinematic-gold transition-colors duration-300">Click to experience</span>
                        <ArrowRight size={16} className="relative group-hover:translate-x-1 group-hover:text-cinematic-gold transition-all duration-300" />
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
});

export default IntroPage;
