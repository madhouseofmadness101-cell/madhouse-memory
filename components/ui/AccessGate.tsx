import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { X, Lock, ArrowRight } from 'lucide-react';
import { PASSCODE } from '../../data';

const AccessGate = ({ onUnlock }: { onUnlock: () => void }) => {
    const [input, setInput] = useState("");
    const [error, setError] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (input.toLowerCase() === PASSCODE.toLowerCase()) {
            onUnlock();
        } else {
            setError(true);
            setInput("");
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-cinematic-black flex items-center justify-center p-4 select-none">
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1),transparent_70%)] animate-pulse-slow"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 text-center relative z-10 shadow-2xl"
            >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-cinematic-gold border border-white/10">
                    {error ? <X size={24} className="text-red-400" /> : <Lock size={24} />}
                </div>

                <h2 className="font-display text-3xl text-white mb-2">Private Collection</h2>
                <p className="font-sans text-sm text-white/50 mb-8">Enter the passcode to view this journey.</p>

                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="password"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Passcode"
                        className={`w-full bg-black/50 border ${error ? 'border-red-500/50 text-red-200' : 'border-white/10 focus:border-cinematic-gold/50'} rounded-full py-4 px-6 text-center text-white outline-none transition-all placeholder:text-white/20 tracking-widest`}
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 aspect-square rounded-full bg-white/10 hover:bg-cinematic-gold hover:text-black transition-colors flex items-center justify-center text-white/50"
                    >
                        <ArrowRight size={18} />
                    </button>
                </form>
                {error && <p className="text-red-400 text-xs mt-4 tracking-widest uppercase animate-pulse">Incorrect Passcode</p>}
            </motion.div>
        </div>
    );
};

export default AccessGate;
