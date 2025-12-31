import { motion, useScroll, useSpring } from 'framer-motion';

const TimelineProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div
            className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-4 pointer-events-none mix-blend-screen"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
        >
            <div className="w-1.5 h-1.5 rounded-full bg-white/20 mb-2"></div>
            <div className="relative w-[1px] h-[30vh] bg-white/10 rounded-full overflow-visible">
                <motion.div
                    className="absolute top-0 left-0 w-full bg-gradient-to-b from-transparent via-cinematic-gold to-cinematic-gold origin-top"
                    style={{ height: '100%', scaleY }}
                />
                <motion.div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-[30vh] bg-cinematic-gold/50 blur-[2px] origin-top"
                    style={{ height: '100%', scaleY }}
                />
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2"></div>
            <span className="text-[10px] text-white/30 uppercase tracking-widest" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                Scroll
            </span>
        </motion.div>
    );
};

export default TimelineProgress;
