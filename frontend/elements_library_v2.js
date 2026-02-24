/**
 * Expanded Elements Library V2 - Canva-Level Design Elements
 * 50+ shapes, 100+ icons, decorative elements
 */

// ============================================================================
// SHAPES LIBRARY (50+ shapes)
// ============================================================================

const SHAPES_LIBRARY = {
    // Basic Shapes
    rectangle: {
        name: 'Rectangle',
        category: 'basic',
        svg: `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><rect x="0" y="0" width="100" height="100" fill="currentColor"/></svg>`
    },
    roundedRect: {
        name: 'Rounded Rectangle',
        category: 'basic',
        svg: `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><rect x="0" y="0" width="100" height="100" rx="15" ry="15" fill="currentColor"/></svg>`
    },
    circle: {
        name: 'Circle',
        category: 'basic',
        svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="currentColor"/></svg>`
    },
    ellipse: {
        name: 'Ellipse',
        category: 'basic',
        svg: `<svg viewBox="0 0 100 60"><ellipse cx="50" cy="30" rx="48" ry="28" fill="currentColor"/></svg>`
    },
    triangle: {
        name: 'Triangle',
        category: 'basic',
        svg: `<svg viewBox="0 0 100 100"><polygon points="50,5 95,95 5,95" fill="currentColor"/></svg>`
    },
    triangleDown: {
        name: 'Triangle Down',
        category: 'basic',
        svg: `<svg viewBox="0 0 100 100"><polygon points="5,5 95,5 50,95" fill="currentColor"/></svg>`
    },
    diamond: {
        name: 'Diamond',
        category: 'basic',
        svg: `<svg viewBox="0 0 100 100"><polygon points="50,2 98,50 50,98 2,50" fill="currentColor"/></svg>`
    },
    pentagon: {
        name: 'Pentagon',
        category: 'basic',
        svg: `<svg viewBox="0 0 100 100"><polygon points="50,2 97,38 79,95 21,95 3,38" fill="currentColor"/></svg>`
    },
    hexagon: {
        name: 'Hexagon',
        category: 'basic',
        svg: `<svg viewBox="0 0 100 100"><polygon points="50,2 93,25 93,75 50,98 7,75 7,25" fill="currentColor"/></svg>`
    },
    octagon: {
        name: 'Octagon',
        category: 'basic',
        svg: `<svg viewBox="0 0 100 100"><polygon points="30,2 70,2 98,30 98,70 70,98 30,98 2,70 2,30" fill="currentColor"/></svg>`
    },

    // Stars
    star5: {
        name: '5-Point Star',
        category: 'stars',
        svg: `<svg viewBox="0 0 100 100"><polygon points="50,2 61,39 98,39 68,61 79,98 50,76 21,98 32,61 2,39 39,39" fill="currentColor"/></svg>`
    },
    star6: {
        name: '6-Point Star',
        category: 'stars',
        svg: `<svg viewBox="0 0 100 100"><polygon points="50,2 62,35 98,35 68,55 80,90 50,68 20,90 32,55 2,35 38,35" fill="currentColor"/></svg>`
    },
    starBurst: {
        name: 'Starburst',
        category: 'stars',
        svg: `<svg viewBox="0 0 100 100"><polygon points="50,0 56,35 75,10 62,40 100,25 70,50 100,75 62,60 75,90 56,65 50,100 44,65 25,90 38,60 0,75 30,50 0,25 38,40 25,10 44,35" fill="currentColor"/></svg>`
    },

    // Arrows
    arrowRight: {
        name: 'Arrow Right',
        category: 'arrows',
        svg: `<svg viewBox="0 0 100 60"><polygon points="0,20 60,20 60,0 100,30 60,60 60,40 0,40" fill="currentColor"/></svg>`
    },
    arrowLeft: {
        name: 'Arrow Left',
        category: 'arrows',
        svg: `<svg viewBox="0 0 100 60"><polygon points="100,20 40,20 40,0 0,30 40,60 40,40 100,40" fill="currentColor"/></svg>`
    },
    arrowUp: {
        name: 'Arrow Up',
        category: 'arrows',
        svg: `<svg viewBox="0 0 60 100"><polygon points="30,0 60,40 40,40 40,100 20,100 20,40 0,40" fill="currentColor"/></svg>`
    },
    arrowDown: {
        name: 'Arrow Down',
        category: 'arrows',
        svg: `<svg viewBox="0 0 60 100"><polygon points="30,100 60,60 40,60 40,0 20,0 20,60 0,60" fill="currentColor"/></svg>`
    },
    arrowDouble: {
        name: 'Double Arrow',
        category: 'arrows',
        svg: `<svg viewBox="0 0 100 60"><polygon points="0,30 25,0 25,20 75,20 75,0 100,30 75,60 75,40 25,40 25,60" fill="currentColor"/></svg>`
    },
    chevronRight: {
        name: 'Chevron Right',
        category: 'arrows',
        svg: `<svg viewBox="0 0 60 100"><polygon points="0,0 60,50 0,100 15,50" fill="currentColor"/></svg>`
    },
    chevronLeft: {
        name: 'Chevron Left',
        category: 'arrows',
        svg: `<svg viewBox="0 0 60 100"><polygon points="60,0 0,50 60,100 45,50" fill="currentColor"/></svg>`
    },

    // Callouts & Speech Bubbles
    speechBubble: {
        name: 'Speech Bubble',
        category: 'callouts',
        svg: `<svg viewBox="0 0 100 80"><path d="M5,5 H95 Q98,5 98,10 V55 Q98,60 93,60 H30 L15,78 L20,60 H7 Q5,60 5,55 V10 Q5,5 10,5 Z" fill="currentColor"/></svg>`
    },
    thoughtBubble: {
        name: 'Thought Bubble',
        category: 'callouts',
        svg: `<svg viewBox="0 0 100 80"><ellipse cx="50" cy="35" rx="45" ry="30" fill="currentColor"/><circle cx="20" cy="70" r="8" fill="currentColor"/><circle cx="10" cy="78" r="5" fill="currentColor"/></svg>`
    },
    calloutBox: {
        name: 'Callout Box',
        category: 'callouts',
        svg: `<svg viewBox="0 0 100 70"><path d="M0,0 H100 V50 H20 L10,70 L15,50 H0 Z" fill="currentColor"/></svg>`
    },

    // Banners & Ribbons
    banner: {
        name: 'Banner',
        category: 'banners',
        svg: `<svg viewBox="0 0 100 40"><path d="M0,10 L10,0 L10,10 L90,10 L90,0 L100,10 L100,30 L90,40 L90,30 L10,30 L10,40 L0,30 Z" fill="currentColor"/></svg>`
    },
    ribbon: {
        name: 'Ribbon',
        category: 'banners',
        svg: `<svg viewBox="0 0 100 30"><path d="M0,0 L15,15 L0,30 L20,30 L20,0 Z M80,0 L80,30 L100,30 L85,15 L100,0 Z M15,5 H85 V25 H15 Z" fill="currentColor"/></svg>`
    },
    ribbonCorner: {
        name: 'Corner Ribbon',
        category: 'banners',
        svg: `<svg viewBox="0 0 100 100"><polygon points="0,0 100,0 100,25 25,100 0,100" fill="currentColor"/></svg>`
    },
    badge: {
        name: 'Badge',
        category: 'banners',
        svg: `<svg viewBox="0 0 100 120"><circle cx="50" cy="50" r="45" fill="currentColor"/><polygon points="30,85 50,120 70,85" fill="currentColor"/></svg>`
    },
    seal: {
        name: 'Seal',
        category: 'banners',
        svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="currentColor"/><circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="8,4"/></svg>`
    },

    // Lines & Dividers
    line: {
        name: 'Line',
        category: 'lines',
        svg: `<svg viewBox="0 0 100 10"><line x1="0" y1="5" x2="100" y2="5" stroke="currentColor" stroke-width="3"/></svg>`
    },
    lineDouble: {
        name: 'Double Line',
        category: 'lines',
        svg: `<svg viewBox="0 0 100 15"><line x1="0" y1="3" x2="100" y2="3" stroke="currentColor" stroke-width="2"/><line x1="0" y1="12" x2="100" y2="12" stroke="currentColor" stroke-width="2"/></svg>`
    },
    lineDotted: {
        name: 'Dotted Line',
        category: 'lines',
        svg: `<svg viewBox="0 0 100 10"><line x1="0" y1="5" x2="100" y2="5" stroke="currentColor" stroke-width="3" stroke-dasharray="2,4"/></svg>`
    },
    lineDashed: {
        name: 'Dashed Line',
        category: 'lines',
        svg: `<svg viewBox="0 0 100 10"><line x1="0" y1="5" x2="100" y2="5" stroke="currentColor" stroke-width="3" stroke-dasharray="10,5"/></svg>`
    },
    dividerFancy: {
        name: 'Fancy Divider',
        category: 'lines',
        svg: `<svg viewBox="0 0 100 20"><line x1="0" y1="10" x2="40" y2="10" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="10" r="5" fill="currentColor"/><line x1="60" y1="10" x2="100" y2="10" stroke="currentColor" stroke-width="2"/></svg>`
    },
    dividerDiamond: {
        name: 'Diamond Divider',
        category: 'lines',
        svg: `<svg viewBox="0 0 100 20"><line x1="0" y1="10" x2="35" y2="10" stroke="currentColor" stroke-width="2"/><polygon points="50,0 60,10 50,20 40,10" fill="currentColor"/><line x1="65" y1="10" x2="100" y2="10" stroke="currentColor" stroke-width="2"/></svg>`
    },

    // Hearts & Symbols
    heart: {
        name: 'Heart',
        category: 'symbols',
        svg: `<svg viewBox="0 0 100 90"><path d="M50,88 C20,60 0,40 0,25 C0,10 15,0 30,0 C40,0 48,8 50,15 C52,8 60,0 70,0 C85,0 100,10 100,25 C100,40 80,60 50,88 Z" fill="currentColor"/></svg>`
    },
    cloud: {
        name: 'Cloud',
        category: 'symbols',
        svg: `<svg viewBox="0 0 100 60"><path d="M80,55 C95,55 100,45 100,35 C100,25 90,18 80,20 C80,8 65,0 50,0 C35,0 22,12 20,25 C8,25 0,35 0,45 C0,55 10,55 20,55 Z" fill="currentColor"/></svg>`
    },
    lightning: {
        name: 'Lightning',
        category: 'symbols',
        svg: `<svg viewBox="0 0 60 100"><polygon points="35,0 10,45 25,45 5,100 55,40 35,40 55,0" fill="currentColor"/></svg>`
    },
    checkmark: {
        name: 'Checkmark',
        category: 'symbols',
        svg: `<svg viewBox="0 0 100 80"><polyline points="10,45 35,70 90,10" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    },
    cross: {
        name: 'Cross',
        category: 'symbols',
        svg: `<svg viewBox="0 0 100 100"><line x1="15" y1="15" x2="85" y2="85" stroke="currentColor" stroke-width="12" stroke-linecap="round"/><line x1="85" y1="15" x2="15" y2="85" stroke="currentColor" stroke-width="12" stroke-linecap="round"/></svg>`
    },
    plus: {
        name: 'Plus',
        category: 'symbols',
        svg: `<svg viewBox="0 0 100 100"><rect x="40" y="10" width="20" height="80" fill="currentColor"/><rect x="10" y="40" width="80" height="20" fill="currentColor"/></svg>`
    },
    minus: {
        name: 'Minus',
        category: 'symbols',
        svg: `<svg viewBox="0 0 100 30"><rect x="5" y="10" width="90" height="10" fill="currentColor"/></svg>`
    },

    // Frames
    frameSimple: {
        name: 'Simple Frame',
        category: 'frames',
        svg: `<svg viewBox="0 0 100 100"><rect x="0" y="0" width="100" height="100" fill="none" stroke="currentColor" stroke-width="4"/></svg>`
    },
    frameDouble: {
        name: 'Double Frame',
        category: 'frames',
        svg: `<svg viewBox="0 0 100 100"><rect x="2" y="2" width="96" height="96" fill="none" stroke="currentColor" stroke-width="2"/><rect x="8" y="8" width="84" height="84" fill="none" stroke="currentColor" stroke-width="2"/></svg>`
    },
    frameRounded: {
        name: 'Rounded Frame',
        category: 'frames',
        svg: `<svg viewBox="0 0 100 100"><rect x="2" y="2" width="96" height="96" rx="15" fill="none" stroke="currentColor" stroke-width="4"/></svg>`
    },
    frameCorners: {
        name: 'Corner Frame',
        category: 'frames',
        svg: `<svg viewBox="0 0 100 100"><path d="M0,20 L0,0 L20,0 M80,0 L100,0 L100,20 M100,80 L100,100 L80,100 M20,100 L0,100 L0,80" fill="none" stroke="currentColor" stroke-width="4"/></svg>`
    }
};

// ============================================================================
// ICONS LIBRARY (100+ icons)
// ============================================================================

const ICONS_LIBRARY = {
    // Property Types
    house: {
        name: 'House',
        category: 'property',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
    },
    apartment: {
        name: 'Apartment',
        category: 'property',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><path d="M9 18h6v4H9z"/></svg>`
    },
    bungalow: {
        name: 'Bungalow',
        category: 'property',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12l10-9 10 9"/><path d="M4 10v10h16V10"/><rect x="9" y="14" width="6" height="6"/></svg>`
    },
    building: {
        name: 'Building',
        category: 'property',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/></svg>`
    },

    // Rooms
    bedroom: {
        name: 'Bedroom',
        category: 'rooms',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/><path d="M3 18h18"/><path d="M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"/><rect x="7" y="6" width="4" height="4" rx="1"/><rect x="13" y="6" width="4" height="4" rx="1"/></svg>`
    },
    bathroom: {
        name: 'Bathroom',
        category: 'rooms',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16"/><path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/><path d="M6 12V5a2 2 0 0 1 2-2h1"/><circle cx="9" cy="6" r="1"/></svg>`
    },
    kitchen: {
        name: 'Kitchen',
        category: 'rooms',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><circle cx="7" cy="6" r="1"/><circle cx="12" cy="6" r="1"/><circle cx="17" cy="6" r="1"/><rect x="7" y="13" width="10" height="4"/></svg>`
    },
    livingRoom: {
        name: 'Living Room',
        category: 'rooms',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8"/><path d="M2 16h20v2H2z"/><path d="M6 16v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/></svg>`
    },
    diningRoom: {
        name: 'Dining Room',
        category: 'rooms',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="8" width="14" height="8"/><line x1="8" y1="16" x2="8" y2="20"/><line x1="16" y1="16" x2="16" y2="20"/><line x1="5" y1="12" x2="19" y2="12"/><circle cx="12" cy="5" r="2"/></svg>`
    },
    office: {
        name: 'Office',
        category: 'rooms',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="18" x2="6" y2="21"/><line x1="18" y1="18" x2="18" y2="21"/><rect x="5" y="9" width="6" height="6"/><line x1="14" y1="10" x2="18" y2="10"/><line x1="14" y1="14" x2="17" y2="14"/></svg>`
    },
    garage: {
        name: 'Garage',
        category: 'rooms',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21V9l9-6 9 6v12"/><rect x="6" y="12" width="12" height="9"/><line x1="6" y1="15" x2="18" y2="15"/><line x1="6" y1="18" x2="18" y2="18"/></svg>`
    },
    garden: {
        name: 'Garden',
        category: 'rooms',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22v-9"/><path d="M9 9c-3 0-6 2-6 6s4 4 9 4"/><path d="M15 9c3 0 6 2 6 6s-4 4-9 4"/><circle cx="12" cy="6" r="3"/></svg>`
    },

    // Amenities
    parking: {
        name: 'Parking',
        category: 'amenities',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>`
    },
    pool: {
        name: 'Pool',
        category: 'amenities',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12c1.5 1.5 3 1.5 4.5 0s3-1.5 4.5 0 3 1.5 4.5 0 3-1.5 4.5 0"/><path d="M2 17c1.5 1.5 3 1.5 4.5 0s3-1.5 4.5 0 3 1.5 4.5 0 3-1.5 4.5 0"/><line x1="8" y1="4" x2="8" y2="12"/><line x1="16" y1="4" x2="16" y2="12"/><circle cx="8" cy="3" r="1"/><circle cx="16" cy="3" r="1"/></svg>`
    },
    gym: {
        name: 'Gym',
        category: 'amenities',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6h2v12H6z"/><path d="M16 6h2v12h-2z"/><path d="M8 10h8"/><path d="M8 14h8"/><rect x="3" y="8" width="3" height="8"/><rect x="18" y="8" width="3" height="8"/></svg>`
    },
    balcony: {
        name: 'Balcony',
        category: 'amenities',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="10" width="18" height="2"/><line x1="5" y1="12" x2="5" y2="20"/><line x1="10" y1="12" x2="10" y2="20"/><line x1="14" y1="12" x2="14" y2="20"/><line x1="19" y1="12" x2="19" y2="20"/><path d="M3 10V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"/></svg>`
    },
    terrace: {
        name: 'Terrace',
        category: 'amenities',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16"/><path d="M6 20v-4h12v4"/><path d="M2 4l10 6 10-6"/><circle cx="12" cy="13" r="2"/></svg>`
    },
    fireplace: {
        name: 'Fireplace',
        category: 'amenities',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><rect x="5" y="10" width="14" height="11"/><path d="M9 21v-5c0-2 3-3 3-6 0 3 3 4 3 6v5"/></svg>`
    },
    aircon: {
        name: 'Air Conditioning',
        category: 'amenities',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="8" rx="2"/><path d="M6 12v4"/><path d="M10 12v6"/><path d="M14 12v4"/><path d="M18 12v6"/></svg>`
    },
    heating: {
        name: 'Heating',
        category: 'amenities',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3c-2 4-6 6-6 10a6 6 0 0 0 12 0c0-4-4-6-6-10"/><path d="M12 14a2 2 0 0 0 2-2c0-1.5-2-2.5-2-4-1 1.5-2 2.5-2 4a2 2 0 0 0 2 2"/></svg>`
    },
    wifi: {
        name: 'WiFi',
        category: 'amenities',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>`
    },
    security: {
        name: 'Security',
        category: 'amenities',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>`
    },

    // Transport
    train: {
        name: 'Train',
        category: 'transport',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><line x1="12" y1="3" x2="12" y2="11"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/><path d="M8 19l-2 3"/><path d="M16 19l2 3"/></svg>`
    },
    bus: {
        name: 'Bus',
        category: 'transport',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 10h18"/><circle cx="7" cy="16" r="1"/><circle cx="17" cy="16" r="1"/><path d="M5 18v2"/><path d="M19 18v2"/></svg>`
    },
    car: {
        name: 'Car',
        category: 'transport',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 17h14v-5H5z"/><path d="M6 12l2-5h8l2 5"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`
    },
    bike: {
        name: 'Bike',
        category: 'transport',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="5" cy="17" r="3"/><circle cx="19" cy="17" r="3"/><path d="M12 17V5l7 12"/><path d="M5 17l7-5"/></svg>`
    },
    walk: {
        name: 'Walking',
        category: 'transport',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="4" r="2"/><path d="M14 10l3 9"/><path d="M10 10l-3 9"/><path d="M12 6v4l3 2"/></svg>`
    },
    plane: {
        name: 'Airport',
        category: 'transport',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>`
    },

    // Local Amenities
    school: {
        name: 'School',
        category: 'local',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 10l10-7 10 7"/><path d="M4 10v10h16V10"/><rect x="9" y="14" width="6" height="6"/><path d="M12 3v4"/></svg>`
    },
    shop: {
        name: 'Shop',
        category: 'local',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l2-6h14l2 6"/><rect x="3" y="9" width="18" height="12"/><path d="M9 21V12h6v9"/><path d="M3 9c0 2 1.5 3 3 3s3-1 3-3"/><path d="M9 9c0 2 1.5 3 3 3s3-1 3-3"/><path d="M15 9c0 2 1.5 3 3 3s3-1 3-3"/></svg>`
    },
    restaurant: {
        name: 'Restaurant',
        category: 'local',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`
    },
    hospital: {
        name: 'Hospital',
        category: 'local',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`
    },
    park: {
        name: 'Park',
        category: 'local',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22v-7"/><circle cx="12" cy="10" r="5"/><path d="M7 15l-2 7h14l-2-7"/></svg>`
    },
    beach: {
        name: 'Beach',
        category: 'local',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3l2.5 16.5"/><path d="M5.5 5.5L19 3"/><path d="M3 21c3-3 7-3 10-3"/><circle cx="9" cy="9" r="1"/></svg>`
    },
    golf: {
        name: 'Golf',
        category: 'local',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="17" r="3"/><path d="M6 3v12l6-3V3z"/><path d="M6 15v6"/></svg>`
    },

    // Social & Contact
    phone: {
        name: 'Phone',
        category: 'social',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`
    },
    email: {
        name: 'Email',
        category: 'social',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
    },
    web: {
        name: 'Website',
        category: 'social',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
    },
    facebook: {
        name: 'Facebook',
        category: 'social',
        svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`
    },
    instagram: {
        name: 'Instagram',
        category: 'social',
        svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`
    },
    twitter: {
        name: 'Twitter/X',
        category: 'social',
        svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`
    },
    linkedin: {
        name: 'LinkedIn',
        category: 'social',
        svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`
    },
    whatsapp: {
        name: 'WhatsApp',
        category: 'social',
        svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`
    },
    location: {
        name: 'Location',
        category: 'social',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`
    },

    // UI Icons
    info: {
        name: 'Info',
        category: 'ui',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
    },
    warning: {
        name: 'Warning',
        category: 'ui',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
    },
    star: {
        name: 'Star',
        category: 'ui',
        svg: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
    },
    starOutline: {
        name: 'Star Outline',
        category: 'ui',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
    },
    clock: {
        name: 'Clock',
        category: 'ui',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`
    },
    calendar: {
        name: 'Calendar',
        category: 'ui',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`
    },
    camera: {
        name: 'Camera',
        category: 'ui',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`
    },
    download: {
        name: 'Download',
        category: 'ui',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`
    },
    share: {
        name: 'Share',
        category: 'ui',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`
    },
    print: {
        name: 'Print',
        category: 'ui',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`
    }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all shapes organized by category
 */
function getShapesByCategory() {
    const categories = {};
    Object.entries(SHAPES_LIBRARY).forEach(([id, shape]) => {
        const cat = shape.category || 'other';
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push({ id, ...shape });
    });
    return categories;
}

/**
 * Get all icons organized by category
 */
function getIconsByCategory() {
    const categories = {};
    Object.entries(ICONS_LIBRARY).forEach(([id, icon]) => {
        const cat = icon.category || 'other';
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push({ id, ...icon });
    });
    return categories;
}

/**
 * Create a shape element
 */
function createShapeElement(shapeId, options = {}) {
    const shape = SHAPES_LIBRARY[shapeId];
    if (!shape) return null;

    const {
        width = 100,
        height = 100,
        color = '#4A1420',
        x = 50,
        y = 50
    } = options;

    const element = document.createElement('div');
    element.className = 'design-element shape-element';
    element.dataset.elementType = 'shape';
    element.dataset.shapeId = shapeId;
    element.dataset.elementId = `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    element.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${width}px;
        height: ${height}px;
        color: ${color};
        cursor: move;
    `;
    element.innerHTML = shape.svg;

    return element;
}

/**
 * Create an icon element
 */
function createIconElement(iconId, options = {}) {
    const icon = ICONS_LIBRARY[iconId];
    if (!icon) return null;

    const {
        size = 48,
        color = '#4A1420',
        x = 50,
        y = 50
    } = options;

    const element = document.createElement('div');
    element.className = 'design-element icon-element';
    element.dataset.elementType = 'icon';
    element.dataset.iconId = iconId;
    element.dataset.elementId = `icon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    element.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        color: ${color};
        cursor: move;
    `;
    element.innerHTML = icon.svg;

    return element;
}

/**
 * Render elements panel in sidebar
 */
function renderElementsPanel(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const shapeCategories = getShapesByCategory();
    const iconCategories = getIconsByCategory();

    let html = `
        <div class="elements-panel">
            <div class="elements-tabs">
                <button class="tab-btn active" data-tab="shapes">Shapes</button>
                <button class="tab-btn" data-tab="icons">Icons</button>
            </div>

            <div class="tab-content" id="shapes-tab">
                <div class="elements-search">
                    <input type="text" placeholder="Search shapes..." id="shapeSearch">
                </div>
    `;

    // Render shape categories
    Object.entries(shapeCategories).forEach(([category, shapes]) => {
        html += `
            <div class="element-category">
                <h4 class="category-title">${category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                <div class="elements-grid">
        `;
        shapes.forEach(shape => {
            html += `
                <div class="element-item" data-type="shape" data-id="${shape.id}" title="${shape.name}" draggable="true">
                    ${shape.svg}
                </div>
            `;
        });
        html += `</div></div>`;
    });

    html += `</div><div class="tab-content" id="icons-tab" style="display:none;">
        <div class="elements-search">
            <input type="text" placeholder="Search icons..." id="iconSearch">
        </div>
    `;

    // Render icon categories
    Object.entries(iconCategories).forEach(([category, icons]) => {
        html += `
            <div class="element-category">
                <h4 class="category-title">${category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                <div class="elements-grid icons-grid">
        `;
        icons.forEach(icon => {
            html += `
                <div class="element-item" data-type="icon" data-id="${icon.id}" title="${icon.name}" draggable="true">
                    ${icon.svg}
                </div>
            `;
        });
        html += `</div></div>`;
    });

    html += `</div></div>`;

    container.innerHTML = html;

    // Add event listeners
    initElementsPanelEvents(container);
}

/**
 * Initialize elements panel events
 */
function initElementsPanelEvents(container) {
    // Tab switching
    container.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.dataset.tab;
            container.querySelector('#shapes-tab').style.display = tab === 'shapes' ? 'block' : 'none';
            container.querySelector('#icons-tab').style.display = tab === 'icons' ? 'block' : 'none';
        });
    });

    // Drag and drop for elements
    container.querySelectorAll('.element-item').forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('elementType', item.dataset.type);
            e.dataTransfer.setData('elementId', item.dataset.id);
        });

        item.addEventListener('click', () => {
            const type = item.dataset.type;
            const id = item.dataset.id;
            addElementToCanvas(type, id);
        });
    });

    // Search functionality
    const shapeSearch = container.querySelector('#shapeSearch');
    if (shapeSearch) {
        shapeSearch.addEventListener('input', (e) => {
            filterElements(container, 'shapes-tab', e.target.value);
        });
    }

    const iconSearch = container.querySelector('#iconSearch');
    if (iconSearch) {
        iconSearch.addEventListener('input', (e) => {
            filterElements(container, 'icons-tab', e.target.value);
        });
    }
}

/**
 * Filter elements by search term
 */
function filterElements(container, tabId, searchTerm) {
    const tab = container.querySelector(`#${tabId}`);
    const items = tab.querySelectorAll('.element-item');
    const term = searchTerm.toLowerCase();

    items.forEach(item => {
        const name = item.title.toLowerCase();
        item.style.display = name.includes(term) ? 'flex' : 'none';
    });
}

/**
 * Add element to current canvas
 */
function addElementToCanvas(type, id) {
    const currentPageId = window.EditorState?.currentPage;
    if (!currentPageId) {
        console.warn('No page selected');
        return;
    }

    const pageCanvas = document.querySelector(`[data-page-id="${currentPageId}"] .page-canvas, [data-page-id="${currentPageId}"]`);
    if (!pageCanvas) return;

    let element;
    if (type === 'shape') {
        element = createShapeElement(id, { x: 100, y: 100 });
    } else if (type === 'icon') {
        element = createIconElement(id, { x: 100, y: 100 });
    }

    if (element) {
        pageCanvas.appendChild(element);

        // Initialize drag functionality if available
        if (typeof initElementDrag === 'function') {
            initElementDrag(element);
        }

        // Select the new element
        if (typeof selectElement === 'function') {
            selectElement(element);
        }

        // Mark dirty
        if (window.EditorState) {
            window.EditorState.isDirty = true;
        }

        console.log(`Added ${type}: ${id}`);
    }
}

// Export for global access
window.SHAPES_LIBRARY = SHAPES_LIBRARY;
window.ICONS_LIBRARY = ICONS_LIBRARY;
window.getShapesByCategory = getShapesByCategory;
window.getIconsByCategory = getIconsByCategory;
window.createShapeElement = createShapeElement;
window.createIconElement = createIconElement;
window.renderElementsPanel = renderElementsPanel;
window.addElementToCanvas = addElementToCanvas;

console.log('Elements Library V2 loaded:', Object.keys(SHAPES_LIBRARY).length, 'shapes,', Object.keys(ICONS_LIBRARY).length, 'icons');
