import { useState, memo } from 'react';

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

export default LazyImage;
