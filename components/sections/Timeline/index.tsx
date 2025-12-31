import { memo } from 'react';
import { motion } from 'framer-motion';
import TimelineBackground from './TimelineBackground';
import TimelineHero from './TimelineHero';
import TimelineProgress from './TimelineProgress';
import TimelineScroll from './TimelineScroll';

// --- Timeline Page Composition ---
const TimelinePage = memo(() => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="content-visibility-auto relative"
        >
            {/* Scroll-Reactive Background Layer */}
            <TimelineBackground />

            <TimelineHero />
            <TimelineProgress />
            <TimelineScroll />
        </motion.div>
    );
});

export default TimelinePage;
