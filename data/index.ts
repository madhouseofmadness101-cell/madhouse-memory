
// --- CONFIG ---
export const PASSCODE = import.meta.env.VITE_PASSCODE || "journey";
export const CACHE_VERSION = Date.now();

// Helper to prevent browser caching when you swap images locally
export const getImgPath = (filename: string) => {
    if (filename.startsWith('http')) return filename;
    const base = window.location.hostname === 'localhost' ? '/' : '/madhouse-memory/';
    return `${base}images/${filename}?v=${CACHE_VERSION}`;
};

// --- Static Data ---
export const EVENTS_DATA = [
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
        img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000",
        location: "Gate of Wandering Souls",
        story: "The bag will sit by the door, heavier with excitement than clothes. My ticket will be booked. The airport will await. As I lock the door behind me, I will feel it—the thrill of finally chasing the dreams I've waited so long to live."
    },
    {
        year: "2026",
        title: "Into the Woods",
        subtitle: "Nature's quiet embrace",
        img: "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&q=80&w=1000",
        location: "Whispering Emerald Valley",
        story: "I will leave the city noise far behind and step into the quiet of the forest. The air will be cool and fresh. Every step on the trail will remind me why I wanted this, to see the world, to feel small in nature's vastness, and find myself in the silence."
    },
    {
        year: "2026",
        title: "Ocean Breeze",
        subtitle: "Where the sky meets the sea",
        img: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&q=80&w=1000",
        location: "Edge of Forgotten Tides",
        story: "Standing at the edge of the coast, I will watch the waves crash endlessly against the rocks. The horizon will stretch forever, reminding me that the world is vast and full of wonders I've yet to discover. This is what freedom will feel like."
    },
    {
        year: "2026",
        title: "The Scenic Route",
        subtitle: "It's about the journey",
        img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1000",
        location: "Path of Golden Horizons",
        story: "I will take the long way windows down, music playing, no strict plan. The road will stretch ahead with rolling hills and endless skies. I will stop whenever something catches my eye. This journey won't be about reaching a destination. It will be about being alive."
    },
    {
        year: "2026",
        title: "Summit Views",
        subtitle: "On top of the world",
        img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1000",
        location: "Crown of Twilight Peaks",
        story: "The climb will be exhausting, but when I reach the top and see the sunset paint the sky in shades of gold and purple, every step will be worth it. Up here, above the clouds, I will understand I'm not just seeing the world. I'm becoming part of it."
    },
];

export const MEMBERS_DATA = [
    { name: "Aakash", role: "The Entertainer", img: getImgPath("img-01-travel.jpg"), quote: "Laughter shared is a journey remembered." },
    { name: "Reecheek", role: "The Newcomer", img: getImgPath("img-02-travel.jpg"), quote: "Fresh eyes see the magic we almost forgot." },
    { name: "Suraj Sharma", role: "The Anchor", img: getImgPath("img-03-travel.jpg"), quote: "The ones who stay steady help others soar." },
    { name: "Siddharth", role: "The Architect", img: getImgPath("img-04-travel.jpg"), quote: "Building something together that lasts forever." },
    { name: "Malav", role: "The Spirit", img: getImgPath("img-05-travel.jpeg"), quote: "Where there's spirit, there's always a way." },
    { name: "Priya Patel", role: "The Navigator", img: getImgPath("img-06-travel.jpg"), quote: "The best journeys have a friend who knows the way." },
    { name: "Shivangi", role: "The Muse", img: getImgPath("img-07-travel.jpeg"), quote: "You make people to see beauty in everything." },
    { name: "Archana", role: "The Explorer", img: getImgPath("img-08-travel.jpg"), quote: "Curiosity turns ordinary days into adventures." },
    { name: "Shekhar", role: "The Rediscovered", img: getImgPath("img-09-travel.jpg"), quote: "Some journeys take you away so you can appreciate coming home." },
    { name: "Aman", role: "The Wanderer", img: getImgPath("img-10-travel.jpg"), quote: "Lost for a while, but never truly gone from the story" },
];

export const PHOTOS_DATA = [
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

export const PATH_D = "M 500 0 C 500 200, 250 200, 250 400 C 250 600, 750 600, 750 800 C 750 1000, 250 1000, 250 1200 C 250 1400, 750 1400, 750 1600 C 750 1800, 250 1800, 250 2000 C 250 2200, 500 2200, 500 2400";
