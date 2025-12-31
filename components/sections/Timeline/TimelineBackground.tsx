import { memo, useState } from 'react';
import { useScroll, useMotionValueEvent, AnimatePresence, motion } from 'framer-motion';

// --- Scroll-Reactive Background for Timeline ---
const TimelineBackground = memo(() => {
    const { scrollY } = useScroll();
    const [currentBgIndex, setCurrentBgIndex] = useState(0);

    // Background images that transition as you scroll - Welcoming Nature Scenes
    const backgrounds = [
        {
            url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=85&w=2400", // Mountain landscape at sunrise
            scrollRange: [0, 400]
        },
        {
            url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=85&w=2400", // Lush green forest
            scrollRange: [400, 800]
        },
        {
            url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=85&w=2400", // Ocean and beach
            scrollRange: [800, 1200]
        },
        {
            url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=85&w=2400", // Rolling hills and nature
            scrollRange: [1200, 1600]
        },
        {
            url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=85&w=2400", // Golden sunset landscape
            scrollRange: [1600, 2000]
        },
        {
            url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=85&w=2400", // Misty nature scene
            scrollRange: [2000, 5000]
        }
    ];

    // Update background index based on scroll position
    useMotionValueEvent(scrollY, "change", (latest: number) => {
        const newIndex = backgrounds.findIndex(
            (bg) => latest >= bg.scrollRange[0] && latest < bg.scrollRange[1]
        );
        if (newIndex !== -1 && newIndex !== currentBgIndex) {
            setCurrentBgIndex(newIndex);
        } else if (latest >= backgrounds[backgrounds.length - 1].scrollRange[1]) {
            setCurrentBgIndex(backgrounds.length - 1);
        }
    });

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Base Layer */}
            <div className="absolute inset-0 bg-[#02040a]"></div>

            {/* Transitioning Background Images */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentBgIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.75, ease: "easeInOut" }}
                    className="absolute inset-0"
                >
                    <div className="absolute inset-0 opacity-50 mix-blend-screen saturate-[0.9] contrast-110">
                        <img
                            src={backgrounds[currentBgIndex].url}
                            className="w-full h-full object-cover"
                            alt=""
                            loading="lazy"
                            decoding="async"
                            draggable="false"
                        />
                    </div>

                    {/* Atmospheric Fog Layers */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>
                    <div
                        className="absolute inset-0 bg-[url('https://raw.githubusercontent.com/daniel-friyia/assets/master/fog.png')] bg-repeat-x opacity-20 animate-fog-flow"
                        style={{ backgroundSize: '200% 100%' }}
                    ></div>
                </motion.div>
            </AnimatePresence>

            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050505]/60 to-[#050505] opacity-90"></div>
        </div>
    );
});

export default TimelineBackground;
