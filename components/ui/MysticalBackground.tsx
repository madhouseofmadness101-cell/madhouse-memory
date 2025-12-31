import { memo } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

// Memoized to prevent re-renders on scroll
const MysticalBackground = memo(() => {
    const { scrollY } = useScroll();
    // Parallax effect: Moves background up slower than scroll (creates depth)
    // Maps 0px scroll to 0px offset, and 2000px scroll to -200px offset. Clamped to prevent it from moving too far up.
    const y = useTransform(scrollY, [0, 2000], [0, -200], { clamp: true });

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none transform-gpu will-change-transform select-none">
            {/* Base Layer - Deep Dark Blue/Black for UI Contrast */}
            <div className="absolute inset-0 bg-[#02040a]"></div>

            {/* Parallax Container: Larger than screen to allow movement without showing edges */}
            <motion.div
                style={{ y }}
                className="absolute -top-[10%] -left-[5%] w-[110%] h-[150%]"
            >
                {/* Earth from Space Background - Cosmic Night Mode */}
                <div className="absolute inset-0 opacity-50 mix-blend-screen saturate-[0.9] contrast-110">
                    <img
                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000"
                        className="w-full h-full object-cover animate-slow-zoom"
                        alt=""
                        loading="lazy"
                        decoding="async"
                        draggable="false"
                    />
                </div>

                {/* Atmospheric Fog Layers - Moves with the world */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>
                <div
                    className="absolute inset-0 bg-[url('https://raw.githubusercontent.com/daniel-friyia/assets/master/fog.png')] bg-repeat-x opacity-20 animate-fog-flow"
                    style={{ backgroundSize: '200% 100%' }}
                ></div>
            </motion.div>

            {/* Vignette Overlay for Readability - Stays fixed relative to viewport (camera lens effect) */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050505]/60 to-[#050505] opacity-90"></div>
        </div>
    );
});

export default MysticalBackground;
