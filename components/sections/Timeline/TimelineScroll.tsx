import { memo, useRef, useState, useEffect, FC, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { motion, useScroll, useSpring, useMotionValueEvent, MotionValue, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Calendar, MapPin } from 'lucide-react';
import { EVENTS_DATA, PATH_D } from '../../../data';

// Optimized Stardust: Fewer particles, simple transitions
const StardustTrail = memo(() => {
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] pointer-events-none z-0 overflow-visible">
            {[...Array(3)].map((_, i) => { // Reduced from 5 to 3 for performance
                const randomX = (Math.random() - 0.5) * 200;
                const randomY = (Math.random() - 0.5) * 150;
                const size = Math.random() * 2 + 1;
                const delay = Math.random() * 0.3;

                return (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-cinematic-gold opacity-80"
                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                        whileInView={{
                            opacity: [0, 0.8, 0],
                            scale: [0, 1, 0],
                            x: randomX,
                            y: randomY
                        }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                            duration: 2,
                            ease: "easeOut",
                            delay: 0.3 + delay
                        }}
                        style={{
                            width: size,
                            height: size,
                            left: '50%',
                            top: '50%',
                            willChange: 'transform, opacity'
                        }}
                    />
                );
            })}
        </div>
    );
});

// Component to handle the Ray following the path based on scroll
const ScrollAwareRay = ({ scrollProgress, pathRef }: { scrollProgress: MotionValue<number>, pathRef: RefObject<SVGPathElement> }) => {
    const rayRef = useRef<SVGGElement>(null);
    const [rayOpacity, setRayOpacity] = useState(1);
    const [trailPositions, setTrailPositions] = useState<Array<{ x: number, y: number }>>([]);

    // Update ray position on every scroll change
    useMotionValueEvent(scrollProgress, "change", (latest: number) => {
        if (pathRef.current && rayRef.current) {
            const pathLength = pathRef.current.getTotalLength();
            // Ensure we don't exceed bounds
            const safeLatest = Math.max(0, Math.min(1, latest));
            const point = pathRef.current.getPointAtLength(pathLength * safeLatest);

            // Update the transform directly for max performance
            rayRef.current.setAttribute("transform", `translate(${point.x}, ${point.y})`);

            // Update trail positions (store last 8 positions)
            setTrailPositions(prev => {
                const newTrail = [{ x: point.x, y: point.y }, ...prev.slice(0, 7)];
                return newTrail;
            });

            // Magical fade out when reaching the end (last 10% of path)
            if (safeLatest > 0.9) {
                const fadeProgress = (safeLatest - 0.9) / 0.1; // 0 to 1
                setRayOpacity(1 - fadeProgress);
            } else {
                setRayOpacity(1);
            }
        }
    });

    return (
        <>
            {/* Magical Trail - Rendered behind the main ray */}
            {trailPositions.map((pos, i) => {
                const trailOpacity = (1 - i / trailPositions.length) * 0.6 * rayOpacity;
                const trailSize = 8 - i;
                return (
                    <g key={i} transform={`translate(${pos.x}, ${pos.y})`} className="pointer-events-none">
                        <circle r={trailSize} fill="#D4AF37" opacity={trailOpacity} className="blur-sm" />
                        <circle r={trailSize * 0.5} fill="#FFF" opacity={trailOpacity * 0.5} />
                    </g>
                );
            })}

            {/* Main Ray */}
            <g ref={rayRef} className="pointer-events-none" style={{ willChange: 'transform', opacity: rayOpacity }}>
                {/* Magical Particle Burst at the end */}
                {rayOpacity < 1 && (
                    <>
                        {[...Array(8)].map((_, i) => {
                            const angle = (i / 8) * Math.PI * 2;
                            const distance = 20 * (1 - rayOpacity);
                            return (
                                <circle
                                    key={i}
                                    cx={Math.cos(angle) * distance}
                                    cy={Math.sin(angle) * distance}
                                    r={2}
                                    fill="#D4AF37"
                                    opacity={rayOpacity}
                                />
                            );
                        })}
                    </>
                )}

                {/* Main Star with Glow */}
                <circle r="12" fill="#D4AF37" opacity={0.15 * rayOpacity} className="blur-md" />
                <circle r="8" fill="#FFF" opacity={0.2 * rayOpacity} />
                <circle r="4" fill="#FFF" opacity={0.4 * rayOpacity} />
                <circle r="2" fill="#FFF" opacity={rayOpacity} />
                <circle r="1.5" fill="#D4AF37" className="animate-ping" style={{ animationDuration: '2s', opacity: rayOpacity }} />
            </g>
        </>
    );
};

// Component for the trailing comet tail
const ScrollAwareTail: FC<{ scrollProgress: MotionValue<number>, pathRef: RefObject<SVGPathElement>, delayOffset: number }> = ({ scrollProgress, pathRef, delayOffset }) => {
    const tailRef = useRef<SVGCircleElement>(null);

    useMotionValueEvent(scrollProgress, "change", (latest: number) => {
        if (pathRef.current && tailRef.current) {
            const pathLength = pathRef.current.getTotalLength();
            // Trail follows slightly behind
            const laggedLatest = Math.max(0, Math.min(1, latest - delayOffset));
            const point = pathRef.current.getPointAtLength(pathLength * laggedLatest);

            tailRef.current.setAttribute("cx", `${point.x}`);
            tailRef.current.setAttribute("cy", `${point.y}`);

            // Simple falloff
            const opacity = 1 - (delayOffset * 10);
            tailRef.current.setAttribute("opacity", `${Math.max(0, opacity)}`);
        }
    });

    return (
        <circle ref={tailRef} r={3 - delayOffset * 50} fill="#D4AF37" style={{ willChange: 'cx, cy' }} />
    );
};

const WindingPathBackground = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
    const pathRef = useRef<SVGPathElement>(null);
    const [pathLoaded, setPathLoaded] = useState(false);

    useEffect(() => {
        if (pathRef.current) {
            setPathLoaded(true);
        }
    }, []);

    return (
        <div className="absolute top-0 left-0 w-full h-full hidden md:block pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 1000 2400" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(212, 175, 55, 0)" />
                        <stop offset="20%" stopColor="rgba(212, 175, 55, 0.5)" />
                        <stop offset="50%" stopColor="rgba(212, 175, 55, 1)" />
                        <stop offset="80%" stopColor="rgba(212, 175, 55, 0.5)" />
                        <stop offset="100%" stopColor="rgba(212, 175, 55, 0)" />
                    </linearGradient>
                    {/* Filters removed to prevent repaint lag */}
                </defs>

                {/* Invisible Reference Path for calculations */}
                <path
                    ref={pathRef}
                    d={PATH_D}
                    fill="none"
                    stroke="none"
                />

                {/* 1. Base dim path (always visible guide) */}
                <path
                    d={PATH_D}
                    fill="none"
                    stroke="url(#gold-gradient)"
                    strokeWidth="2"
                    className="opacity-10"
                />

                {/* 2. The Active Drawing Line (fills as you scroll) */}
                <motion.path
                    d={PATH_D}
                    fill="none"
                    stroke="url(#gold-gradient)"
                    strokeWidth="3"
                    className="opacity-100" // removed drop-shadow for perf
                    style={{ pathLength: scrollProgress, willChange: 'stroke-dashoffset' }}
                />

                {/* 3. The Interactive Ray & Tail (Only render when path ref is ready) */}
                {pathLoaded && (
                    <>
                        {/* Comet Tail Particles - Reduced count */}
                        {[0.005, 0.01, 0.015].map((offset, i) => (
                            <ScrollAwareTail
                                key={i}
                                scrollProgress={scrollProgress}
                                pathRef={pathRef}
                                delayOffset={offset}
                            />
                        ))}

                        {/* Main Glowing Ray */}
                        <ScrollAwareRay scrollProgress={scrollProgress} pathRef={pathRef} />
                    </>
                )}

            </svg>
        </div>
    );
};

const TimelineScroll = memo(() => {
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress relative to this specific container/section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end end"] // Ray starts earlier, moves slower through the timeline
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        restDelta: 0.001
    });

    return (
        <div ref={containerRef} className="relative w-full pb-32 select-none">
            <div className="relative max-w-6xl mx-auto px-4">

                {/* Pass the scroll progress to the background animation */}
                <WindingPathBackground scrollProgress={smoothProgress} />

                {/* Central Line for Mobile */}
                <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cinematic-gold/40 to-transparent md:hidden"></div>

                <div className="relative space-y-32 md:space-y-0 md:h-[3000px] pt-12">
                    {EVENTS_DATA.map((evt, i) => {
                        const isLeft = i % 2 === 0;
                        const topPos = i * 400;

                        return (
                            <motion.div
                                key={i}
                                className={`relative md:absolute w-full md:w-[45%] ${isLeft ? 'md:left-[5%] md:text-right' : 'md:right-[5%] md:text-left'} pl-16 md:pl-0`}
                                style={{ top: window.innerWidth >= 768 ? `${topPos}px` : 'auto' }}
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ margin: "-100px", once: true }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                {/* Mobile Dot */}
                                <div className="absolute left-[29px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cinematic-gold shadow-[0_0_15px_#D4AF37] md:hidden"></div>

                                <StardustTrail />

                                {/* Clickable Card - REMOVED BACKDROP BLUR for performance, used high opacity solid bg instead */}
                                <div
                                    onClick={() => setSelectedEvent(evt)}
                                    className={`group relative aspect-[16/9] md:aspect-[2/1] rounded-[1.5rem] overflow-hidden bg-[#0d0d0d] border border-white/5 transition-all duration-700 cursor-pointer ${isLeft ? 'md:ml-auto' : 'md:mr-auto'}`}
                                    style={{ willChange: 'transform', contain: 'layout style paint', transform: 'translate3d(0,0,0)' }}
                                >

                                    {/* Hover Glow */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-radial-gradient-gold pointer-events-none"></div>

                                    {/* Image Background */}
                                    <div className="absolute inset-0 z-0" style={{ transform: 'translate3d(0,0,0)' }}>
                                        <img
                                            src={evt.img}
                                            alt={evt.title}
                                            className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500"
                                            loading="lazy"
                                            decoding="async"
                                            draggable="false"
                                            onContextMenu={(e) => e.preventDefault()}
                                            style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                    </div>

                                    {/* Content */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                                        <h3 className="font-display text-4xl md:text-5xl text-white drop-shadow-lg mb-2 transform group-hover:-translate-y-2 transition-transform duration-500 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                                            {evt.title}
                                        </h3>
                                        <p className="font-sans text-xs md:text-sm text-cinematic-gold tracking-[0.2em] uppercase opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                                            {evt.subtitle}
                                        </p>
                                        <p className="mt-4 text-white/30 text-[10px] tracking-widest border border-white/10 px-3 py-1 rounded-full bg-black/50 group-hover:border-cinematic-gold/30 transition-colors">
                                            {evt.year}
                                        </p>

                                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2">
                                            <span className="text-[10px] text-cinematic-gold tracking-widest uppercase">Read Story</span>
                                            <Sparkles size={16} className="text-cinematic-gold" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Story Modal */}
            {/* Story Modal - Portaled to body to fix z-index overlap with header */}
            {
                createPortal(
                    <AnimatePresence>
                        {selectedEvent && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
                                onClick={() => setSelectedEvent(null)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
                                    className="bg-cinematic-gray/95 border border-cinematic-gold/20 w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-2xl relative grid grid-cols-1 md:grid-cols-2 max-h-[90vh]"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        onClick={() => setSelectedEvent(null)}
                                        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/80 transition-all"
                                    >
                                        <X size={24} />
                                    </button>

                                    <div className="relative h-64 md:h-full overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-transparent to-black/80 z-10"></div>
                                        <img src={selectedEvent.img} className="w-full h-full object-cover select-none" alt={selectedEvent.title} draggable="false" onContextMenu={(e) => e.preventDefault()} />
                                        <div className="absolute bottom-6 left-6 z-20">
                                            <span className="text-cinematic-gold text-sm tracking-[0.3em] font-sans uppercase mb-2 block">{selectedEvent.year}</span>
                                            <h2 className="text-white font-display text-5xl md:text-6xl leading-none">{selectedEvent.title}</h2>
                                        </div>
                                    </div>

                                    <div className="p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
                                        <div className="mb-6 flex items-center gap-2 text-white/40">
                                            <Sparkles size={16} className="text-cinematic-gold" />
                                            <span className="text-xs uppercase tracking-widest">Memory Detail</span>
                                        </div>

                                        <p className="text-lg md:text-xl text-white/90 font-serif leading-relaxed italic mb-8">
                                            "{selectedEvent.story}"
                                        </p>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 text-sm text-white/60 font-sans border-t border-white/10 pt-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-cinematic-gold" />
                                                    <span>{selectedEvent.year}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} className="text-cinematic-gold" />
                                                    <span>{selectedEvent.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )
            }
        </div >
    );
});

export default TimelineScroll;
