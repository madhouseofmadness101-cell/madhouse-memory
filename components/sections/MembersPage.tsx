import { memo } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { MEMBERS_DATA } from '../../data';

const MembersPage = memo(() => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen pt-32 pb-24 px-6 relative select-none"
        >
            <div className="container mx-auto max-w-7xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <div className="inline-block mb-4 relative">
                        <div className="text-cinematic-gold text-xs tracking-[0.4em] uppercase font-sans">The Fellowship</div>
                    </div>
                    <h2 className="font-display text-5xl md:text-7xl text-white mb-6 drop-shadow-xl">The Travelers</h2>
                    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-cinematic-gold to-transparent mx-auto"></div>
                </motion.div>

                {/* 4x2 Grid Layout for 8 Members */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {MEMBERS_DATA.map((member, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true, margin: "50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`group relative h-[400px] md:h-[450px] overflow-hidden rounded-[2rem] border border-white/5 bg-black/20 hover:border-cinematic-gold/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] ${index === 8 ? 'lg:col-start-2' : ''}`}
                        >
                            {/* Image Background */}
                            <div className="absolute inset-0">
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className={`w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0`}
                                    draggable="false"
                                    onContextMenu={(e) => e.preventDefault()}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500"></div>
                                {/* Transparent overlay for drag protection */}
                                <div className="absolute inset-0 bg-transparent z-10"></div>
                            </div>

                            {/* Text Content */}
                            <div className="absolute inset-0 flex flex-col justify-end p-8 z-10 pointer-events-none">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="text-cinematic-gold text-[10px] tracking-[0.3em] uppercase mb-2 font-sans opacity-80">{member.role}</div>
                                    <h3 className="text-3xl text-white font-display leading-none mb-4 drop-shadow-lg">{member.name}</h3>

                                    {/* Quote Reveal */}
                                    <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100">
                                        <div className="pt-4 border-t border-white/20">
                                            <div className="flex gap-2">
                                                <Quote size={12} className="text-cinematic-gold shrink-0 mt-1" />
                                                <p className="text-sm text-white/70 italic font-serif leading-relaxed">
                                                    "{member.quote}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
});

export default MembersPage;
