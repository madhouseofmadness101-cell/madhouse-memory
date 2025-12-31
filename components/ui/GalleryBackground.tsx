import { memo } from 'react';
import { motion } from 'framer-motion';
import { getImgPath } from '../../data';

// Gallery Background Component - Minimal & Artistic
const GalleryBackground = memo(() => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none"
        >
            {/* Deep Artistic Base */}
            <div className="absolute inset-0 bg-[#030303]"></div>

            {/* Abstract Background Image */}
            <div className="absolute inset-0 opacity-40 mix-blend-screen contrast-125">
                <img
                    src={getImgPath("gallery-bg.jpg")}
                    alt="Magical Floating Mountains"
                    className="w-full h-full object-cover opacity-60"
                />
            </div>

            {/* Subtle Ambient Glows - Like gallery lighting */}
            <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-indigo-900/20 blur-[150px] rounded-full animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-amber-900/10 blur-[150px] rounded-full animate-pulse-slow" style={{ animationDelay: '4s' }}></div>

            {/* Fine Grain Texture for Premium Feel */}
            <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

            {/* Vignette */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030303]/60 to-[#030303]"></div>
        </motion.div>
    );
});

export default GalleryBackground;
