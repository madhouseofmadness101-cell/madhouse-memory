/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { useState, useEffect, useMemo, useRef, memo } from 'react';
import type { FormEvent, RefObject, FC } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValueEvent, MotionValue } from 'framer-motion';
import { X, ArrowRight, Camera, History, Users, ChevronDown, Sparkles, Calendar, MapPin, Grid, Square, Search, ArrowLeft, Play, Pause, ChevronLeft, ChevronRight, Quote, Lock } from 'lucide-react';

// --- Types ---
type ViewState = 'intro' | 'gallery' | 'timeline' | 'about';
type GalleryLayout = 'bento' | 'uniform';

// --- CONFIG ---
const PASSCODE = "journey"; // <--- CHANGE THIS TO YOUR SECRET PASSWORD
const CACHE_VERSION = Date.now(); // Forces images to refresh when you reload the page

/**
 * ⚠️ INSTRUCTIONS FOR IMAGES ⚠️
 * 
 * 1. Create a folder named 'public' in your project root.
 * 2. Inside 'public', create a folder named 'images'.
 * 3. Add your photos and rename them exactly as listed below:
 * 
 * Timeline: event-1.jpg, event-2.jpg ... event-5.jpg
 * Members: member-1.jpg, member-2.jpg ... member-8.jpg
 * Gallery: gallery-1.jpg, gallery-2.jpg ... gallery-14.jpg
 */

// Helper to prevent browser caching when you swap images locally
// Usage: getImgPath("my-file.jpg") -> "/images/my-file.jpg?v=..."
// If it starts with http, it returns it as is.
const getImgPath = (filename: string) => {
  if (filename.startsWith('http')) return filename;
  return `/images/${filename}?v=${CACHE_VERSION}`;
};

// --- Static Data ---
const EVENTS_DATA = [
  {
    year: "2025",
    title: "Our Beginning",
    subtitle: "Where our story started",
    img: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&q=80&w=1000",
    location: "The Threshold of Tomorrow",
    story: "I will stand at the window, watching the world outside. There is so much to see, so many places I've only read about. That day, I will make a promise to myself—this year, I won't just dream about traveling. I will go."
  },
  {
    year: "2026",
    title: "The Departure",
    subtitle: "Bags packed, ready to go",
    // New Image: Planning vibe
    img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000",
    location: "Gate of Wandering Souls",
    story: "The bag will sit by the door, heavier with excitement than clothes. My ticket will be booked. The airport will await. As I lock the door behind me, I will feel it—the thrill of finally chasing the dreams I've waited so long to live."
  },
  {
    year: "2026",
    title: "Into the Woods",
    subtitle: "Nature's quiet embrace",
    // New Image: Lush Green Woods
    img: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=1000",
    location: "Whispering Emerald Valley",
    story: "I will leave the city noise far behind and step into the quiet of the forest. The air will be cool and fresh. Every step on the trail will remind me why I wanted this—to see the world, to feel small in nature's vastness, and find myself in the silence."
  },
  {
    year: "2026",
    title: "Ocean Breeze",
    subtitle: "Where the sky meets the sea",
    // New Image: Ocean/Coast
    img: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&q=80&w=1000",
    location: "Edge of Forgotten Tides",
    story: "Standing at the edge of the coast, I will watch the waves crash endlessly against the rocks. The horizon will stretch forever, reminding me that the world is vast and full of wonders I've yet to discover. This is what freedom will feel like."
  },
  {
    year: "2026",
    title: "The Scenic Route",
    subtitle: "It's about the journey",
    // New Image: Road Trip/Greenery
    img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1000",
    location: "Path of Golden Horizons",
    story: "I will take the long way—windows down, music playing, no strict plan. The road will stretch ahead with rolling hills and endless skies. I will stop whenever something catches my eye. This journey won't be about reaching a destination. It will be about being alive."
  },
  {
    year: "2026",
    title: "Summit Views",
    subtitle: "On top of the world",
    // New Image: Mountain Peak/Sunset
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000",
    location: "Crown of Twilight Peaks",
    story: "The climb will be exhausting, but when I reach the top and see the sunset paint the sky in shades of gold and purple, every step will be worth it. Up here, above the clouds, I will understand—I'm not just seeing the world. I'm becoming part of it."
  },
];

const MEMBERS_DATA = [
  { name: "Aakash", role: "The Entertainer", img: getImgPath("img-01-travel.jpg"), quote: "Laughter shared is a journey remembered." },
  { name: "Reecheek", role: "The Newcomer", img: getImgPath("img-02-travel.jpg"), quote: "Fresh eyes see the magic we almost forgot." },
  { name: "Suraj Sharma", role: "The Anchor", img: getImgPath("img-03-travel.jpg"), quote: "The ones who stay steady help others soar." },
  { name: "Siddharth", role: "The Architect", img: getImgPath("img-04-travel.jpg"), quote: "Building something together that lasts forever." },
  { name: "Malav", role: "The Spirit", img: getImgPath("img-05-travel.jpeg"), quote: "Where there's spirit, there's always a way." },
  { name: "Priya Patel", role: "The Navigator", img: getImgPath("img-06-travel.jpg"), quote: "The best journeys have a friend who knows the way." },
  { name: "Shivangi", role: "The Muse", img: getImgPath("img-07-travel.jpeg"), quote: "You make people to see beauty in everything." },
  { name: "Archana", role: "The Explorer", img: getImgPath("img-08-travel.jpg"), quote: "Curiosity turns ordinary days into adventures." },
];

const PHOTOS_DATA = [
  { src: getImgPath("photo-x01.jpg"), type: "tall" },
  { src: getImgPath("photo-x02.jpeg"), type: "wide" },
  { src: getImgPath("photo-x03.jpg"), type: "big" },
  { src: getImgPath("photo-x04.jpeg"), type: "tall" },
  { src: getImgPath("photo-x05.jpg"), type: "wide" },
  { src: getImgPath("photo-x06.jpg"), type: "small" },
  { src: getImgPath("photo-x07.jpg"), type: "tall" },
  { src: getImgPath("photo-x08.jpeg"), type: "wide" },
  { src: getImgPath("photo-x09.jpg"), type: "tall" },
  { src: getImgPath("photo-x10.jpg"), type: "small" },
  { src: getImgPath("photo-x12.jpg"), type: "wide" },
  { src: getImgPath("photo-x13.jpeg"), type: "small" },
  { src: getImgPath("photo-x14.jpg"), type: "big" },
  { src: getImgPath("photo-x15.jpg"), type: "tall" },
  { src: getImgPath("photo-x16.jpg"), type: "wide" },
  { src: getImgPath("photo-x17.jpg"), type: "small" },
  { src: getImgPath("photo-x18.jpeg"), type: "tall" },
  { src: getImgPath("photo-x19.jpg"), type: "wide" },
  { src: getImgPath("img-01-travel.jpg"), type: "big" },
];

// Updated Path Definition for 6 items (Extended height)
const PATH_D = "M 500 0 C 500 200, 250 200, 250 400 C 250 600, 750 600, 750 800 C 750 1000, 250 1000, 250 1200 C 250 1400, 750 1400, 750 1600 C 750 1800, 250 1800, 250 2000 C 250 2200, 500 2200, 500 2400";

// --- Shared Components ---

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

// Lazy Image Component for smooth loading
const LazyImage = memo(({ src, alt, className }: { src: string, alt: string, className: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {/* Placeholder with slight pulse */}
      <div
        className={`absolute inset-0 bg-white/5 transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100 animate-pulse'}`}
      />
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
        decoding="async"
        draggable="false"
        onContextMenu={(e) => e.preventDefault()}
        className={`${className} transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'} select-none`}
      />
      {/* Transparent overlay for extra protection against drag/save */}
      <div className="absolute inset-0 z-20"></div>
    </>
  );
});

// --- Access Gate / Password Screen ---
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

// --- Intro Page ---
const IntroPage = memo(({ onEnter }: { onEnter: () => void }) => {
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
          poster="/video-poster.png"
          className="w-full h-full object-cover"
          key="video-bg"
        >
          <source src="/video.mp4" type="video/mp4" />
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

          {/* Fix: Added padding and adjusted leading to prevent 'J' from being cut off */}
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

// --- Memory Modal Component ---
const MemoryPortal = ({ photo, onClose, onNext, onPrev, currentIndex, total, onToggleNav }: { photo: any, onClose: () => void, onNext: () => void, onPrev: () => void, currentIndex: number, total: number, onToggleNav?: (visible: boolean) => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-advance slideshow logic
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        onNext();
      }, 4000); // Change slide every 4 seconds
    }
    return () => clearInterval(interval);
  }, [isPlaying, onNext]);

  // Hide Nav on Mount, Show on Unmount
  useEffect(() => {
    if (onToggleNav) onToggleNav(false);
    return () => {
      if (onToggleNav) onToggleNav(true);
    };
  }, [onToggleNav]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-4 backdrop-blur-md select-none"
    >
      {/* Cinematic Background Particles within Modal */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[150vw] h-[150vh] left-[-25vw] top-[-25vh] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_60%)]"></div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute bg-cinematic-gold rounded-full opacity-20 animate-float" style={{
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            width: Math.random() * 3 + 'px', height: Math.random() * 3 + 'px',
            animationDuration: `${Math.random() * 5 + 5}s`, animationDelay: `${Math.random() * 2}s`
          }}></div>
        ))}
      </div>

      {/* Top Controls - Fixed to Screen Corners for consistency */}
      <div className="fixed top-6 right-6 z-[110] flex items-center gap-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`p-4 rounded-full border backdrop-blur-md transition-all duration-300 ${isPlaying ? 'bg-cinematic-gold/20 text-cinematic-gold border-cinematic-gold' : 'bg-black/40 text-white/70 border-white/10 hover:text-cinematic-gold hover:border-cinematic-gold/50 hover:bg-black/60'}`}
          title={isPlaying ? "Pause Slideshow" : "Start Slideshow"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>

        <button
          onClick={onClose}
          className="p-4 rounded-full border border-white/10 bg-black/40 text-white/70 hover:text-red-400 hover:border-red-500/50 hover:bg-black/60 backdrop-blur-md transition-all"
          title="Close"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Card Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="relative w-full h-full flex items-center justify-center pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Portal Stage (Center) */}
        <div className="relative w-full h-full flex items-center justify-center p-4 overflow-hidden pointer-events-auto">
          {/* Previous Button - Fixed Left */}
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="fixed left-6 top-1/2 -translate-y-1/2 z-[110] p-4 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 hover:border-cinematic-gold/50 text-white/50 hover:text-cinematic-gold transition-all backdrop-blur-md group"
          >
            <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* Glowing Portal Frame - Adaptive Size */}
          <motion.div
            className="relative z-20 max-w-[90vw] max-h-[85vh] w-auto h-auto rounded-[1rem] md:rounded-[2rem] overflow-hidden border-[2px] border-cinematic-gold/30 shadow-[0_0_80px_rgba(212,175,55,0.15),inset_0_0_40px_rgba(0,0,0,0.8)] transform-gpu will-change-transform flex items-center justify-center bg-black"
            initial={{ boxShadow: "0 0 0px rgba(212,175,55,0)" }}
            animate={{ boxShadow: ["0 0 20px rgba(212,175,55,0.1)", "0 0 40px rgba(212,175,55,0.2)", "0 0 20px rgba(212,175,55,0.1)"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* The Living Image - Full View */}
            <motion.img
              key={photo.src} // Reset animation on change
              src={photo.src}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain select-none"
              initial={{ scale: 1.0 }}
              animate={{
                scale: [1.0, 1.05], // Subtle breathe instead of pan
              }}
              transition={{
                scale: { duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
              }}
              draggable="false"
              onContextMenu={(e) => e.preventDefault()}
            />
            {/* Overlay to prevent right click saving even more */}
            <div className="absolute inset-0 bg-transparent z-50"></div>

            {/* Inner Vignette for Portal Depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.5)_100%)] pointer-events-none z-30"></div>
          </motion.div>

          {/* Next Button - Fixed Right */}
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="fixed right-6 top-1/2 -translate-y-1/2 z-[110] p-4 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 hover:border-cinematic-gold/50 text-white/50 hover:text-cinematic-gold transition-all backdrop-blur-md group"
          >
            <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Footer / Pagination Dots - Fixed Bottom Center */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] h-16 flex items-center justify-center gap-3 pointer-events-auto">
          {PHOTOS_DATA.map((_, idx) => {
            // Only show a window of dots if too many
            if (Math.abs(currentIndex - idx) > 4) return null;

            return (
              <button
                key={idx}
                onClick={() => { /* jump logic could go here */ }}
                className={`rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-3 h-3 bg-cinematic-gold shadow-[0_0_8px_#D4AF37]' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'}`}
              />
            );
          })}
        </div>

      </motion.div>
    </motion.div>
  );
};

// --- Gallery Page ---
const GalleryPage = memo(({ onBack, onToggleNav }: { onBack: () => void, onToggleNav?: (visible: boolean) => void }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [layout, setLayout] = useState<GalleryLayout>('bento');
  // Filter photos based on search - REMOVED as tags are gone
  const filteredPhotos = PHOTOS_DATA;

  // Helper functions for nav
  const handleNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev !== null && prev < filteredPhotos.length - 1 ? prev + 1 : 0));
    }
  };

  const handlePrev = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredPhotos.length - 1));
    }
  };

  // Helper to determine grid span classes based on photo type AND current layout
  const getSpanClass = (type: string) => {
    if (layout === 'uniform') return 'col-span-1 row-span-1 aspect-square'; // Uniform Grid Mode

    // Bento Mode
    switch (type) {
      case 'tall': return 'row-span-2';
      case 'wide': return 'col-span-2';
      case 'big': return 'col-span-2 row-span-2';
      default: return 'col-span-1 row-span-1';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-6 pt-32 pb-24 relative z-10 select-none content-visibility-auto"
    >
      {/* Title Section with Controls underneath to prevent overlap */}
      <div className="mb-12 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Whispers of the Heart
          </h2>
          <p className="text-cinematic-gold/80 font-sans font-light tracking-wider text-sm md:text-base uppercase">
            A collection of shared memories
          </p>
        </motion.div>

        {/* Gallery Controls - Positioned in flow below title */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={onBack}
            className="p-3 rounded-full border border-white/10 bg-black/40 text-white/70 hover:text-cinematic-gold hover:border-cinematic-gold/50 transition-all backdrop-blur-sm group"
            title="Back"
          >
            <ArrowLeft size={20} strokeWidth={1.5} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div className="h-8 w-[1px] bg-white/10"></div>

          <button
            onClick={() => setLayout('bento')}
            className={`p-3 rounded-full border border-white/10 bg-black/40 transition-all backdrop-blur-sm ${layout === 'bento' ? 'text-cinematic-gold border-cinematic-gold/50' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            title="Jumbled View"
          >
            <Grid size={20} strokeWidth={1.5} />
          </button>

          <button
            onClick={() => setLayout('uniform')}
            className={`p-3 rounded-full border border-white/10 bg-black/40 transition-all backdrop-blur-sm ${layout === 'uniform' ? 'text-cinematic-gold border-cinematic-gold/50' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
            title="Uniform Grid"
          >
            <Square size={20} strokeWidth={1.5} />
          </button>

          {/* Search Removed */}
        </div>
      </div>

      {/* Grid Layout - Masonry for Bento, Grid for Uniform */}
      <motion.div
        layout
        className={`
        mx-auto max-w-7xl pb-24
        ${layout === 'bento'
            ? 'columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6' // Masonry Mode
            : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-auto' // Uniform Grid
          }
      `}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08,
              delayChildren: 0.2
            }
          }
        }}
      >
        <AnimatePresence mode='popLayout'>
          {filteredPhotos.map((photo, i) => (
            <motion.div
              key={photo.src}
              layout
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.9 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { type: "spring", stiffness: 100, damping: 20 }
                }
              }}
              className={`
              ${layout === 'bento' ? 'break-inside-avoid mb-4 md:mb-6 min-h-[100px]' : 'aspect-square'} 
              relative group cursor-zoom-in overflow-hidden rounded-2xl bg-[#0a0a0a] 
              border border-white/10 hover:border-cinematic-gold/50 shadow-lg 
              hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] transition-all duration-500 will-change-transform transform-gpu
            `}
              onClick={() => {
                // Find index in filtered list
                const idx = filteredPhotos.findIndex(p => p.src === photo.src);
                setSelectedImageIndex(idx);
              }}
            >
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

              {/* Lazy Image Replacement */}
              <LazyImage
                src={photo.src}
                alt=""
                className={`w-full ${layout === 'bento' ? 'h-auto' : 'h-full object-cover'} transform scale-100 group-hover:scale-105 transition-all duration-[1.2s] ease-in-out will-change-transform block`}
              />

              {/* Hover Icon */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-20">
                <div className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-cinematic-gold">
                  <Sparkles size={16} />
                </div>
              </div>

              {/* Tag Removed */}
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredPhotos.length === 0 && (
          <div className="col-span-full text-center py-24 text-white/40">
            <p className="font-display text-2xl mb-2">No memories found</p>
          </div>
        )}
      </motion.div>

      {/* Cinematic Memory Portal (Replaces Lightbox) */}
      <AnimatePresence>
        {selectedImageIndex !== null && filteredPhotos[selectedImageIndex] && (
          <MemoryPortal
            photo={filteredPhotos[selectedImageIndex]}
            onClose={() => setSelectedImageIndex(null)}
            onNext={handleNext}
            onPrev={handlePrev}
            currentIndex={selectedImageIndex}
            total={filteredPhotos.length}
            onToggleNav={onToggleNav}
          />
        )}
      </AnimatePresence>
    </motion.div >
  );
});

// --- Timeline Components ---

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
                transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
              >
                {/* Mobile Dot */}
                <div className="absolute left-[29px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cinematic-gold shadow-[0_0_15px_#D4AF37] md:hidden"></div>

                <StardustTrail />

                {/* Clickable Card - REMOVED BACKDROP BLUR for performance, used high opacity solid bg instead */}
                <div
                  onClick={() => setSelectedEvent(evt)}
                  className={`group relative aspect-[16/9] md:aspect-[2/1] rounded-[1.5rem] overflow-hidden bg-[#0d0d0d] border border-white/5 transition-all duration-700 cursor-pointer ${isLeft ? 'md:ml-auto' : 'md:mr-auto'}`}
                  style={{ willChange: 'transform' }}
                >

                  {/* Hover Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-radial-gradient-gold pointer-events-none"></div>

                  {/* Image Background */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={evt.img}
                      alt={evt.title}
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-all duration-700 scale-105 group-hover:scale-100 grayscale group-hover:grayscale-0"
                      loading="lazy"
                      decoding="async"
                      draggable="false"
                      onContextMenu={(e) => e.preventDefault()}
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

// --- Members Page (Renamed from AboutPage) ---
const AboutPage = memo(() => {
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
              className="group relative h-[400px] md:h-[450px] overflow-hidden rounded-[2rem] border border-white/5 bg-black/20 hover:border-cinematic-gold/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]"
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

// --- Main App Shell ---
const App = () => {
  console.log("App mounted");
  // New Authentication State - DEFAULTED TO TRUE to pause password for now
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [view, setView] = useState<ViewState>('intro');
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Small optimization: only update state if value actually changes
      const isScrolled = window.scrollY > 50;
      setScrolled(prev => prev !== isScrolled ? isScrolled : prev);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // SECURITY: Disable Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    window.addEventListener('contextmenu', handleContextMenu);

    // SECURITY: Detect Print Screen or Key Combos (Best Effort)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Try to prevent printing or saving via keyboard shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p')) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const NavItem = ({ target, label, icon: Icon }: { target: ViewState, label: string, icon: any }) => (
    <button
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setView(target);
      }}
      className={`group flex items-center gap-2 text-xs md:text-sm uppercase tracking-widest transition-all duration-300 ${view === target ? 'text-cinematic-gold' : 'text-white/60 hover:text-white'}`}
    >
      <Icon size={14} className={`mb-0.5 transition-transform duration-300 ${view === target ? 'scale-110' : 'group-hover:scale-110'}`} />
      <span className="hidden md:inline relative">
        {label}
        {view === target && <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-cinematic-gold animate-fade-in"></span>}
      </span>
    </button>
  );

  return (
    <div className="bg-cinematic-black min-h-screen text-white selection:bg-cinematic-gold/30 selection:text-white overflow-x-hidden font-sans relative select-none print:hidden">

      {/* Global Background Layer - Memoized */}
      <AnimatePresence mode="wait">
        {view === 'gallery' ? (
          <GalleryBackground key="gallery-bg" />
        ) : view === 'intro' ? (
          null
        ) : (
          <MysticalBackground key="main-bg" />
        )}
      </AnimatePresence>

      {/* ACCESS CONTROL GATE */}
      <AnimatePresence>
        {!isAuthenticated && (
          <AccessGate onUnlock={() => setIsAuthenticated(true)} />
        )}
      </AnimatePresence>

      {/* Main App Content - Only visible if authenticated */}
      {isAuthenticated && (
        <>
          <AnimatePresence mode="wait">
            {view === 'intro' && <IntroPage onEnter={() => setView('timeline')} />}
          </AnimatePresence>

          {view !== 'intro' && (
            <>
              <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 border-b ${scrolled ? 'bg-black/90 py-4 border-white/5 shadow-2xl' : 'bg-transparent py-8 border-transparent'} ${navVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
                <div className="container mx-auto px-6 flex justify-between items-center">
                  <div
                    className="font-display text-2xl font-bold tracking-wider cursor-pointer text-white relative group"
                    onClick={() => setView('intro')}
                  >
                    MadHouse<span className="text-cinematic-gold">.</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-500"></span>
                  </div>

                  <div className="flex items-center gap-8">
                    <NavItem target="timeline" label="Timeline" icon={History} />
                    <NavItem target="gallery" label="Gallery" icon={Camera} />
                    <NavItem target="about" label="Members" icon={Users} />
                  </div>
                </div>
              </nav>

              <main className="min-h-screen relative z-10">
                <AnimatePresence mode="wait">
                  {view === 'gallery' && <GalleryPage key="gallery" onBack={() => setView('timeline')} onToggleNav={setNavVisible} />}
                  {view === 'timeline' && <TimelinePage key="timeline" />}
                  {view === 'about' && <AboutPage key="about" />}
                </AnimatePresence>
              </main>

              <footer className="py-12 border-t border-white/5 text-center bg-black/90 relative z-10">
                <div className="mb-4 font-display text-xl text-white/50">MadHouse</div>
                <p className="text-white/20 text-[10px] tracking-[0.2em] uppercase">&copy; 2025 Memory Library. All moments preserved.</p>
              </footer>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default App;