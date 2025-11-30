/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"Inter"', 'sans-serif'],
                display: ['"Cormorant Garamond"', 'serif'],
            },
            colors: {
                cinematic: {
                    black: '#050505',
                    dark: '#0a0a0a',
                    gray: '#1a1a1a',
                    light: '#e5e5e5',
                    gold: '#d4af37',
                }
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-out forwards',
                'slow-zoom': 'slowZoom 30s infinite alternate',
                'shimmer': 'shimmer 8s linear infinite',
                'float': 'float 6s ease-in-out infinite',
                'fog-flow': 'fogFlow 20s linear infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slowZoom: {
                    '0%': { transform: 'scale(1)' },
                    '100%': { transform: 'scale(1.15)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '200% 0' },
                    '100%': { backgroundPosition: '-200% 0' }
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                fogFlow: {
                    '0%': { transform: 'translateX(-10%)' },
                    '100%': { transform: 'translateX(10%)' }
                }
            }
        }
    },
    plugins: [],
}
