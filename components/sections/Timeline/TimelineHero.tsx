import { memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const TimelineHero = memo(() => {
    return (
        <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden select-none">

            {/* Disney Castle Arc Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[80vh] pointer-events-none z-0">
                <svg viewBox="0 0 1000 500" className="w-full h-full overflow-visible opacity-90">
                    <defs>
                        <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="20%" stopColor="#D4AF37" stopOpacity="0.2" />
                            <stop offset="50%" stopColor="#FFF" stopOpacity="0.8" />
                            <stop offset="80%" stopColor="#D4AF37" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>

                    <motion.path
                        d="M 0 450 Q 500 -150 1000 450"
                        fill="none"
                        stroke="url(#arc-gradient)"
                        strokeWidth="0.5"
                        className="opacity-40"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.2 }}
                        transition={{ duration: 3, ease: "easeInOut", delay: 0.5 }}
                    />

                    <circle r="3" fill="#fff" className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                        <animateMotion
                            dur="3s"
                            begin="0.5s"
                            repeatCount="1"
                            path="M 0 450 Q 500 -150 1000 450"
                            fill="freeze"
                            keyPoints="0;1"
                            keyTimes="0;1"
                            calcMode="spline"
                            keySplines="0.4 0 0.2 1"
                        />
                        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="3s" begin="0.5s" fill="freeze" />
                    </circle>

                    {[...Array(3)].map((_, i) => (
                        <circle key={i} r={2 - i * 0.4} fill="#D4AF37" opacity="0.8">
                            <animateMotion
                                dur={`${3 + i * 0.05}s`}
                                begin={`${0.5 + i * 0.05}s`}
                                repeatCount="1"
                                path="M 0 450 Q 500 -150 1000 450"
                                rotate="auto"
                                calcMode="spline"
                                keySplines="0.4 0 0.2 1"
                            />
                            <animate attributeName="opacity" values="0;0.6;0" keyTimes="0;0.5;1" dur={`${3 + i * 0.05}s`} begin={`${0.5 + i * 0.05}s`} fill="freeze" />
                        </circle>
                    ))}
                </svg>
            </div>

            <div className="relative z-10 text-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
                >
                    {/* Fix: Added padding and relaxed leading to stop text cutoff */}
                    <h2 className="font-display text-5xl md:text-7xl lg:text-9xl tracking-tight leading-tight text-transparent bg-clip-text bg-[linear-gradient(110deg,#999_0%,#fff_20%,#eee_40%,#999_100%)] bg-[length:200%_100%] animate-shimmer drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] p-4">
                        OUR JOURNEY
                    </h2>
                    <div className="h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-cinematic-gold to-transparent mt-4 mb-4 opacity-70"></div>
                    <p className="text-cinematic-gold/80 text-sm md:text-base tracking-[0.4em] uppercase font-light drop-shadow-md">
                        Of Moments & Memories
                    </p>
                </motion.div>
            </div>

            <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.5, duration: 1 }}
            >
                <span className="text-xs tracking-widest uppercase">Scroll to Explore</span>
                <ChevronDown size={20} className="animate-bounce text-cinematic-gold" />
            </motion.div>
        </div>
    );
});

export default TimelineHero;
