/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Camera, History, Users } from 'lucide-react';
import MysticalBackground from './components/ui/MysticalBackground';
import GalleryBackground from './components/ui/GalleryBackground';
import AccessGate from './components/ui/AccessGate';

// Lazy Load Pages for Performance
const IntroPage = lazy(() => import('./components/sections/IntroPage'));
const GalleryPage = lazy(() => import('./components/sections/GalleryPage'));
const TimelinePage = lazy(() => import('./components/sections/Timeline'));
const MembersPage = lazy(() => import('./components/sections/MembersPage'));

// --- Types ---
type ViewState = 'intro' | 'gallery' | 'timeline' | 'about';

// --- Main App Shell ---
const App = () => {
  console.log("App mounted");
  // New Authentication State - DEFAULTED TO TRUE to pause password for now
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
          <Suspense fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-cinematic-gold">
              <div className="animate-pulse tracking-widest uppercase text-xs">Loading Journey...</div>
            </div>
          }>
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
                    {view === 'about' && <MembersPage key="about" />}
                  </AnimatePresence>
                </main>

                <footer className="py-12 border-t border-white/5 text-center bg-black/90 relative z-10">
                  <div className="mb-4 font-display text-xl text-white/50">MadHouse</div>
                  <p className="text-white/20 text-[10px] tracking-[0.2em] uppercase">&copy; 2025 Memory Library. All moments preserved.</p>
                </footer>
              </>
            )}
          </Suspense>
        </>
      )}
    </div>
  );
};

export default App;