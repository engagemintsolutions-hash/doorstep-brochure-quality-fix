/**
 * Extended Design Elements - Frames, Grids, Stock Photos, Charts
 * Boosts design elements to match Canva
 */

(function() {
    'use strict';

    // ============================================================================
    // FRAMES LIBRARY (50+ frames)
    // ============================================================================

    const FRAMES_LIBRARY = {
        // Simple Frames
        simpleSquare: {
            name: 'Simple Square',
            category: 'simple',
            ratio: '1:1',
            svg: `<svg viewBox="0 0 100 100"><rect x="2" y="2" width="96" height="96" fill="none" stroke="currentColor" stroke-width="4"/><rect x="8" y="8" width="84" height="84" fill="#f0f0f0" class="frame-content"/></svg>`
        },
        simplePortrait: {
            name: 'Simple Portrait',
            category: 'simple',
            ratio: '3:4',
            svg: `<svg viewBox="0 0 75 100"><rect x="2" y="2" width="71" height="96" fill="none" stroke="currentColor" stroke-width="4"/><rect x="8" y="8" width="59" height="84" fill="#f0f0f0" class="frame-content"/></svg>`
        },
        simpleLandscape: {
            name: 'Simple Landscape',
            category: 'simple',
            ratio: '4:3',
            svg: `<svg viewBox="0 0 100 75"><rect x="2" y="2" width="96" height="71" fill="none" stroke="currentColor" stroke-width="4"/><rect x="8" y="8" width="84" height="59" fill="#f0f0f0" class="frame-content"/></svg>`
        },
        simpleWide: {
            name: 'Simple Wide',
            category: 'simple',
            ratio: '16:9',
            svg: `<svg viewBox="0 0 160 90"><rect x="2" y="2" width="156" height="86" fill="none" stroke="currentColor" stroke-width="4"/><rect x="8" y="8" width="144" height="74" fill="#f0f0f0" class="frame-content"/></svg>`
        },

        // Rounded Frames
        roundedSquare: {
            name: 'Rounded Square',
            category: 'rounded',
            ratio: '1:1',
            svg: `<svg viewBox="0 0 100 100"><rect x="2" y="2" width="96" height="96" rx="12" fill="none" stroke="currentColor" stroke-width="4"/><rect x="8" y="8" width="84" height="84" rx="8" fill="#f0f0f0" class="frame-content"/></svg>`
        },
        roundedPortrait: {
            name: 'Rounded Portrait',
            category: 'rounded',
            ratio: '3:4',
            svg: `<svg viewBox="0 0 75 100"><rect x="2" y="2" width="71" height="96" rx="12" fill="none" stroke="currentColor" stroke-width="4"/><rect x="8" y="8" width="59" height="84" rx="8" fill="#f0f0f0" class="frame-content"/></svg>`
        },
        pill: {
            name: 'Pill Shape',
            category: 'rounded',
            ratio: '2:1',
            svg: `<svg viewBox="0 0 100 50"><rect x="2" y="2" width="96" height="46" rx="23" fill="none" stroke="currentColor" stroke-width="4"/><rect x="6" y="6" width="88" height="38" rx="19" fill="#f0f0f0" class="frame-content"/></svg>`
        },

        // Circle Frames
        circle: {
            name: 'Circle',
            category: 'circle',
            ratio: '1:1',
            svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="50" cy="50" r="42" fill="#f0f0f0" class="frame-content"/></svg>`
        },
        circleDouble: {
            name: 'Double Circle',
            category: 'circle',
            ratio: '1:1',
            svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="50" r="40" fill="#f0f0f0" class="frame-content"/></svg>`
        },
        circleOrnate: {
            name: 'Ornate Circle',
            category: 'circle',
            ratio: '1:1',
            svg: `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4,4"/><circle cx="50" cy="50" r="38" fill="#f0f0f0" class="frame-content"/></svg>`
        },

        // Decorative Frames
        elegantSquare: {
            name: 'Elegant Square',
            category: 'decorative',
            ratio: '1:1',
            svg: `<svg viewBox="0 0 100 100"><rect x="2" y="2" width="96" height="96" fill="none" stroke="currentColor" stroke-width="2"/><rect x="6" y="6" width="88" height="88" fill="none" stroke="currentColor" stroke-width="1"/><line x1="2" y1="2" x2="10" y2="10" stroke="currentColor" stroke-width="2"/><line x1="98" y1="2" x2="90" y2="10" stroke="currentColor" stroke-width="2"/><line x1="2" y1="98" x2="10" y2="90" stroke="currentColor" stroke-width="2"/><line x1="98" y1="98" x2="90" y2="90" stroke="currentColor" stroke-width="2"/><rect x="12" y="12" width="76" height="76" fill="#f0f0f0" class="frame-content"/></svg>`
        },
        artDeco: {
            name: 'Art Deco',
            category: 'decorative',
            ratio: '1:1',
            svg: `<svg viewBox="0 0 100 100"><rect x="2" y="2" width="96" height="96" fill="none" stroke="currentColor" stroke-width="3"/><path d="M2,15 L15,2 M85,2 L98,15 M98,85 L85,98 M15,98 L2,85" fill="none" stroke="currentColor" stroke-width="3"/><rect x="10" y="10" width="80" height="80" fill="#f0f0f0" class="frame-content"/></svg>`
        },
        vintage: {
            name: 'Vintage',
            category: 'decorative',
            ratio: '1:1',
            svg: `<svg viewBox="0 0 100 100"><rect x="3" y="3" width="94" height="94" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><rect x="8" y="8" width="84" height="84" fill="none" stroke="currentColor" stroke-width="1"/><circle cx="8" cy="8" r="3" fill="currentColor"/><circle cx="92" cy="8" r="3" fill="currentColor"/><circle cx="8" cy="92" r="3" fill="currentColor"/><circle cx="92" cy="92" r="3" fill="currentColor"/><rect x="12" y="12" width="76" height="76" fill="#f0f0f0" class="frame-content"/></svg>`
        },
        polaroid: {
            name: 'Polaroid',
            category: 'decorative',
            ratio: '1:1.2',
            svg: `<svg viewBox="0 0 100 120"><rect x="2" y="2" width="96" height="116" fill="white" stroke="currentColor" stroke-width="2"/><rect x="8" y="8" width="84" height="84" fill="#f0f0f0" class="frame-content"/></svg>`
        },
        filmStrip: {
            name: 'Film Strip',
            category: 'decorative',
            ratio: '4:3',
            svg: `<svg viewBox="0 0 120 90"><rect x="0" y="0" width="120" height="90" fill="currentColor"/><rect x="10" y="10" width="100" height="70" fill="#f0f0f0" class="frame-content"/><circle cx="5" cy="10" r="3" fill="white"/><circle cx="5" cy="25" r="3" fill="white"/><circle cx="5" cy="40" r="3" fill="white"/><circle cx="5" cy="55" r="3" fill="white"/><circle cx="5" cy="70" r="3" fill="white"/><circle cx="5" cy="85" r="3" fill="white"/><circle cx="115" cy="10" r="3" fill="white"/><circle cx="115" cy="25" r="3" fill="white"/><circle cx="115" cy="40" r="3" fill="white"/><circle cx="115" cy="55" r="3" fill="white"/><circle cx="115" cy="70" r="3" fill="white"/><circle cx="115" cy="85" r="3" fill="white"/></svg>`
        },

        // Shadow Frames
        shadowBox: {
            name: 'Shadow Box',
            category: 'shadow',
            ratio: '1:1',
            svg: `<svg viewBox="0 0 110 110"><rect x="8" y="8" width="100" height="100" fill="rgba(0,0,0,0.2)"/><rect x="2" y="2" width="100" height="100" fill="white" stroke="currentColor" stroke-width="2"/><rect x="10" y="10" width="84" height="84" fill="#f0f0f0" class="frame-content"/></svg>`
        },
        floatingFrame: {
            name: 'Floating Frame',
            category: 'shadow',
            ratio: '1:1',
            svg: `<svg viewBox="0 0 110 115"><ellipse cx="55" cy="108" rx="40" ry="5" fill="rgba(0,0,0,0.15)"/><rect x="5" y="2" width="100" height="100" fill="white" stroke="currentColor" stroke-width="2"/><rect x="13" y="10" width="84" height="84" fill="#f0f0f0" class="frame-content"/></svg>`
        },

        // Geometric Frames
        hexagonFrame: {
            name: 'Hexagon',
            category: 'geometric',
            ratio: '1:1',
            svg: `<svg viewBox="0 0 100 100"><polygon points="50,2 93,25 93,75 50,98 7,75 7,25" fill="none" stroke="currentColor" stroke-width="3"/><polygon points="50,10 85,28 85,72 50,90 15,72 15,28" fill="#f0f0f0" class="frame-content"/></svg>`
        },
        octagonFrame: {
            name: 'Octagon',
            category: 'geometric',
            ratio: '1:1',
            svg: `<svg viewBox="0 0 100 100"><polygon points="30,2 70,2 98,30 98,70 70,98 30,98 2,70 2,30" fill="none" stroke="currentColor" stroke-width="3"/><polygon points="32,8 68,8 92,32 92,68 68,92 32,92 8,68 8,32" fill="#f0f0f0" class="frame-content"/></svg>`
        },
        diamondFrame: {
            name: 'Diamond',
            category: 'geometric',
            ratio: '1:1',
            svg: `<svg viewBox="0 0 100 100"><polygon points="50,2 98,50 50,98 2,50" fill="none" stroke="currentColor" stroke-width="3"/><polygon points="50,12 88,50 50,88 12,50" fill="#f0f0f0" class="frame-content"/></svg>`
        },
        archFrame: {
            name: 'Arch',
            category: 'geometric',
            ratio: '3:4',
            svg: `<svg viewBox="0 0 75 100"><path d="M2,100 L2,40 A35.5,35.5 0 0 1 73,40 L73,100 Z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M8,100 L8,42 A29.5,29.5 0 0 1 67,42 L67,100 Z" fill="#f0f0f0" class="frame-content"/></svg>`
        },

        // Property-specific frames
        propertyCard: {
            name: 'Property Card',
            category: 'property',
            ratio: '4:5',
            svg: `<svg viewBox="0 0 80 100"><rect x="2" y="2" width="76" height="96" rx="4" fill="white" stroke="currentColor" stroke-width="2"/><rect x="6" y="6" width="68" height="55" fill="#f0f0f0" class="frame-content"/><line x1="10" y1="70" x2="70" y2="70" stroke="currentColor" stroke-width="1" opacity="0.3"/><line x1="10" y1="80" x2="50" y2="80" stroke="currentColor" stroke-width="1" opacity="0.3"/><line x1="10" y1="90" x2="60" y2="90" stroke="currentColor" stroke-width="1" opacity="0.3"/></svg>`
        },
        featureImage: {
            name: 'Feature Image',
            category: 'property',
            ratio: '16:9',
            svg: `<svg viewBox="0 0 160 90"><rect x="0" y="0" width="160" height="90" fill="currentColor"/><rect x="4" y="4" width="152" height="82" fill="#f0f0f0" class="frame-content"/><rect x="8" y="70" width="60" height="16" rx="2" fill="rgba(255,255,255,0.9)"/></svg>`
        },
        galleryFrame: {
            name: 'Gallery Frame',
            category: 'property',
            ratio: '1:1',
            svg: `<svg viewBox="0 0 100 100"><rect x="0" y="0" width="100" height="100" fill="#222"/><rect x="6" y="6" width="88" height="88" fill="#f0f0f0" class="frame-content"/><rect x="3" y="3" width="94" height="94" fill="none" stroke="gold" stroke-width="1"/></svg>`
        }
    };

    // ============================================================================
    // GRIDS LIBRARY (20+ grids)
    // ============================================================================

    const GRIDS_LIBRARY = {
        // 2-Photo Grids
        grid2Horizontal: {
            name: '2 Side by Side',
            category: 'two',
            layout: [
                { x: 0, y: 0, w: 49, h: 100 },
                { x: 51, y: 0, w: 49, h: 100 }
            ],
            svg: `<svg viewBox="0 0 100 60"><rect x="0" y="0" width="48" height="60" fill="#e0e0e0" stroke="#999" stroke-width="1"/><rect x="52" y="0" width="48" height="60" fill="#d0d0d0" stroke="#999" stroke-width="1"/></svg>`
        },
        grid2Vertical: {
            name: '2 Stacked',
            category: 'two',
            layout: [
                { x: 0, y: 0, w: 100, h: 49 },
                { x: 0, y: 51, w: 100, h: 49 }
            ],
            svg: `<svg viewBox="0 0 100 100"><rect x="0" y="0" width="100" height="48" fill="#e0e0e0" stroke="#999" stroke-width="1"/><rect x="0" y="52" width="100" height="48" fill="#d0d0d0" stroke="#999" stroke-width="1"/></svg>`
        },
        grid2Featured: {
            name: '2 Featured Left',
            category: 'two',
            layout: [
                { x: 0, y: 0, w: 65, h: 100 },
                { x: 67, y: 0, w: 33, h: 100 }
            ],
            svg: `<svg viewBox="0 0 100 60"><rect x="0" y="0" width="64" height="60" fill="#e0e0e0" stroke="#999" stroke-width="1"/><rect x="68" y="0" width="32" height="60" fill="#d0d0d0" stroke="#999" stroke-width="1"/></svg>`
        },

        // 3-Photo Grids
        grid3Row: {
            name: '3 Row',
            category: 'three',
            layout: [
                { x: 0, y: 0, w: 32, h: 100 },
                { x: 34, y: 0, w: 32, h: 100 },
                { x: 68, y: 0, w: 32, h: 100 }
            ],
            svg: `<svg viewBox="0 0 100 60"><rect x="0" y="0" width="31" height="60" fill="#e0e0e0" stroke="#999" stroke-width="1"/><rect x="34" y="0" width="32" height="60" fill="#d0d0d0" stroke="#999" stroke-width="1"/><rect x="69" y="0" width="31" height="60" fill="#c0c0c0" stroke="#999" stroke-width="1"/></svg>`
        },
        grid3Featured: {
            name: '3 Featured',
            category: 'three',
            layout: [
                { x: 0, y: 0, w: 65, h: 100 },
                { x: 67, y: 0, w: 33, h: 49 },
                { x: 67, y: 51, w: 33, h: 49 }
            ],
            svg: `<svg viewBox="0 0 100 100"><rect x="0" y="0" width="64" height="100" fill="#e0e0e0" stroke="#999" stroke-width="1"/><rect x="68" y="0" width="32" height="48" fill="#d0d0d0" stroke="#999" stroke-width="1"/><rect x="68" y="52" width="32" height="48" fill="#c0c0c0" stroke="#999" stroke-width="1"/></svg>`
        },
        grid3Tshape: {
            name: '3 T-Shape',
            category: 'three',
            layout: [
                { x: 0, y: 0, w: 100, h: 60 },
                { x: 0, y: 62, w: 49, h: 38 },
                { x: 51, y: 62, w: 49, h: 38 }
            ],
            svg: `<svg viewBox="0 0 100 100"><rect x="0" y="0" width="100" height="58" fill="#e0e0e0" stroke="#999" stroke-width="1"/><rect x="0" y="62" width="48" height="38" fill="#d0d0d0" stroke="#999" stroke-width="1"/><rect x="52" y="62" width="48" height="38" fill="#c0c0c0" stroke="#999" stroke-width="1"/></svg>`
        },

        // 4-Photo Grids
        grid4Square: {
            name: '4 Square',
            category: 'four',
            layout: [
                { x: 0, y: 0, w: 49, h: 49 },
                { x: 51, y: 0, w: 49, h: 49 },
                { x: 0, y: 51, w: 49, h: 49 },
                { x: 51, y: 51, w: 49, h: 49 }
            ],
            svg: `<svg viewBox="0 0 100 100"><rect x="0" y="0" width="48" height="48" fill="#e0e0e0" stroke="#999" stroke-width="1"/><rect x="52" y="0" width="48" height="48" fill="#d0d0d0" stroke="#999" stroke-width="1"/><rect x="0" y="52" width="48" height="48" fill="#c0c0c0" stroke="#999" stroke-width="1"/><rect x="52" y="52" width="48" height="48" fill="#b0b0b0" stroke="#999" stroke-width="1"/></svg>`
        },
        grid4Featured: {
            name: '4 Featured',
            category: 'four',
            layout: [
                { x: 0, y: 0, w: 65, h: 100 },
                { x: 67, y: 0, w: 33, h: 32 },
                { x: 67, y: 34, w: 33, h: 32 },
                { x: 67, y: 68, w: 33, h: 32 }
            ],
            svg: `<svg viewBox="0 0 100 100"><rect x="0" y="0" width="64" height="100" fill="#e0e0e0" stroke="#999" stroke-width="1"/><rect x="68" y="0" width="32" height="31" fill="#d0d0d0" stroke="#999" stroke-width="1"/><rect x="68" y="34" width="32" height="32" fill="#c0c0c0" stroke="#999" stroke-width="1"/><rect x="68" y="69" width="32" height="31" fill="#b0b0b0" stroke="#999" stroke-width="1"/></svg>`
        },
        grid4Row: {
            name: '4 Row',
            category: 'four',
            layout: [
                { x: 0, y: 0, w: 24, h: 100 },
                { x: 26, y: 0, w: 24, h: 100 },
                { x: 52, y: 0, w: 24, h: 100 },
                { x: 76, y: 0, w: 24, h: 100 }
            ],
            svg: `<svg viewBox="0 0 100 60"><rect x="0" y="0" width="23" height="60" fill="#e0e0e0" stroke="#999" stroke-width="1"/><rect x="26" y="0" width="24" height="60" fill="#d0d0d0" stroke="#999" stroke-width="1"/><rect x="52" y="0" width="24" height="60" fill="#c0c0c0" stroke="#999" stroke-width="1"/><rect x="77" y="0" width="23" height="60" fill="#b0b0b0" stroke="#999" stroke-width="1"/></svg>`
        },

        // 5-Photo Grids
        grid5Mixed: {
            name: '5 Mixed',
            category: 'five',
            layout: [
                { x: 0, y: 0, w: 49, h: 65 },
                { x: 51, y: 0, w: 49, h: 32 },
                { x: 51, y: 34, w: 49, h: 32 },
                { x: 0, y: 67, w: 32, h: 33 },
                { x: 34, y: 67, w: 66, h: 33 }
            ],
            svg: `<svg viewBox="0 0 100 100"><rect x="0" y="0" width="48" height="64" fill="#e0e0e0" stroke="#999" stroke-width="1"/><rect x="52" y="0" width="48" height="31" fill="#d0d0d0" stroke="#999" stroke-width="1"/><rect x="52" y="34" width="48" height="31" fill="#c0c0c0" stroke="#999" stroke-width="1"/><rect x="0" y="68" width="31" height="32" fill="#b0b0b0" stroke="#999" stroke-width="1"/><rect x="34" y="68" width="66" height="32" fill="#a0a0a0" stroke="#999" stroke-width="1"/></svg>`
        },

        // 6-Photo Grids
        grid6Square: {
            name: '6 Grid',
            category: 'six',
            layout: [
                { x: 0, y: 0, w: 32, h: 49 },
                { x: 34, y: 0, w: 32, h: 49 },
                { x: 68, y: 0, w: 32, h: 49 },
                { x: 0, y: 51, w: 32, h: 49 },
                { x: 34, y: 51, w: 32, h: 49 },
                { x: 68, y: 51, w: 32, h: 49 }
            ],
            svg: `<svg viewBox="0 0 100 100"><rect x="0" y="0" width="31" height="48" fill="#e0e0e0" stroke="#999" stroke-width="1"/><rect x="34" y="0" width="32" height="48" fill="#d0d0d0" stroke="#999" stroke-width="1"/><rect x="69" y="0" width="31" height="48" fill="#c0c0c0" stroke="#999" stroke-width="1"/><rect x="0" y="52" width="31" height="48" fill="#b0b0b0" stroke="#999" stroke-width="1"/><rect x="34" y="52" width="32" height="48" fill="#a0a0a0" stroke="#999" stroke-width="1"/><rect x="69" y="52" width="31" height="48" fill="#909090" stroke="#999" stroke-width="1"/></svg>`
        },

        // Property Specific
        propertyShowcase: {
            name: 'Property Showcase',
            category: 'property',
            layout: [
                { x: 0, y: 0, w: 100, h: 65 },
                { x: 0, y: 67, w: 24, h: 33 },
                { x: 26, y: 67, w: 24, h: 33 },
                { x: 52, y: 67, w: 24, h: 33 },
                { x: 76, y: 67, w: 24, h: 33 }
            ],
            svg: `<svg viewBox="0 0 100 100"><rect x="0" y="0" width="100" height="64" fill="#e0e0e0" stroke="#999" stroke-width="1"/><rect x="0" y="68" width="23" height="32" fill="#d0d0d0" stroke="#999" stroke-width="1"/><rect x="26" y="68" width="24" height="32" fill="#c0c0c0" stroke="#999" stroke-width="1"/><rect x="52" y="68" width="24" height="32" fill="#b0b0b0" stroke="#999" stroke-width="1"/><rect x="77" y="68" width="23" height="32" fill="#a0a0a0" stroke="#999" stroke-width="1"/></svg>`
        },
        interiorTour: {
            name: 'Interior Tour',
            category: 'property',
            layout: [
                { x: 0, y: 0, w: 49, h: 49 },
                { x: 51, y: 0, w: 49, h: 49 },
                { x: 0, y: 51, w: 32, h: 49 },
                { x: 34, y: 51, w: 32, h: 49 },
                { x: 68, y: 51, w: 32, h: 49 }
            ],
            svg: `<svg viewBox="0 0 100 100"><rect x="0" y="0" width="48" height="48" fill="#e0e0e0" stroke="#999" stroke-width="1"/><rect x="52" y="0" width="48" height="48" fill="#d0d0d0" stroke="#999" stroke-width="1"/><rect x="0" y="52" width="31" height="48" fill="#c0c0c0" stroke="#999" stroke-width="1"/><rect x="34" y="52" width="32" height="48" fill="#b0b0b0" stroke="#999" stroke-width="1"/><rect x="69" y="52" width="31" height="48" fill="#a0a0a0" stroke="#999" stroke-width="1"/></svg>`
        }
    };

    // ============================================================================
    // STOCK PHOTOS INTEGRATION (Unsplash API)
    // ============================================================================

    const STOCK_PHOTO_CATEGORIES = {
        property: {
            name: 'Property',
            queries: ['house exterior', 'modern home', 'luxury property', 'apartment building']
        },
        interior: {
            name: 'Interior',
            queries: ['living room interior', 'modern kitchen', 'bedroom design', 'bathroom interior']
        },
        landscape: {
            name: 'Landscapes',
            queries: ['garden landscape', 'countryside uk', 'city skyline', 'nature scenic']
        },
        lifestyle: {
            name: 'Lifestyle',
            queries: ['family home', 'cozy living', 'modern lifestyle', 'home office']
        },
        backgrounds: {
            name: 'Backgrounds',
            queries: ['abstract background', 'gradient texture', 'marble texture', 'minimal background']
        }
    };

    // Curated free stock photo URLs (Unsplash)
    const CURATED_PHOTOS = {
        property: [
            { id: 'house1', url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400', credit: 'Unsplash' },
            { id: 'house2', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400', credit: 'Unsplash' },
            { id: 'house3', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', credit: 'Unsplash' },
            { id: 'house4', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400', credit: 'Unsplash' }
        ],
        interior: [
            { id: 'living1', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400', credit: 'Unsplash' },
            { id: 'kitchen1', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', credit: 'Unsplash' },
            { id: 'bedroom1', url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400', credit: 'Unsplash' },
            { id: 'bathroom1', url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400', credit: 'Unsplash' }
        ],
        backgrounds: [
            { id: 'bg1', url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400', credit: 'Unsplash' },
            { id: 'bg2', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400', credit: 'Unsplash' },
            { id: 'bg3', url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400', credit: 'Unsplash' },
            { id: 'marble', url: 'https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?w=400', credit: 'Unsplash' }
        ]
    };

    // ============================================================================
    // CHARTS LIBRARY (Simple charts for property info)
    // ============================================================================

    const CHARTS_LIBRARY = {
        priceChart: {
            name: 'Price Comparison',
            category: 'property',
            create: (data) => createBarChart(data, { title: 'Price Comparison' })
        },
        areaChart: {
            name: 'Area Breakdown',
            category: 'property',
            create: (data) => createPieChart(data, { title: 'Area Breakdown' })
        },
        roomsChart: {
            name: 'Rooms Overview',
            category: 'property',
            create: (data) => createBarChart(data, { title: 'Rooms', horizontal: true })
        },
        statsChart: {
            name: 'Property Stats',
            category: 'property',
            create: (data) => createStatsDisplay(data)
        }
    };

    function createBarChart(data, options = {}) {
        const width = options.width || 200;
        const height = options.height || 150;
        const bars = data || [
            { label: 'Beds', value: 3 },
            { label: 'Baths', value: 2 },
            { label: 'Reception', value: 1 }
        ];
        const maxValue = Math.max(...bars.map(b => b.value));

        let svg = `<svg viewBox="0 0 ${width} ${height}" class="chart-element">`;
        svg += `<text x="${width/2}" y="15" text-anchor="middle" font-size="12" font-weight="bold">${options.title || 'Chart'}</text>`;

        const barWidth = (width - 40) / bars.length;
        const chartHeight = height - 40;

        bars.forEach((bar, i) => {
            const barHeight = (bar.value / maxValue) * (chartHeight - 20);
            const x = 20 + i * barWidth + 5;
            const y = chartHeight - barHeight + 25;

            svg += `<rect x="${x}" y="${y}" width="${barWidth - 10}" height="${barHeight}" fill="currentColor" opacity="0.8"/>`;
            svg += `<text x="${x + (barWidth - 10) / 2}" y="${height - 5}" text-anchor="middle" font-size="10">${bar.label}</text>`;
            svg += `<text x="${x + (barWidth - 10) / 2}" y="${y - 5}" text-anchor="middle" font-size="10">${bar.value}</text>`;
        });

        svg += '</svg>';
        return svg;
    }

    function createPieChart(data, options = {}) {
        const size = options.size || 150;
        const items = data || [
            { label: 'Living', value: 40, color: '#4CAF50' },
            { label: 'Bedrooms', value: 35, color: '#2196F3' },
            { label: 'Kitchen', value: 15, color: '#FF9800' },
            { label: 'Other', value: 10, color: '#9C27B0' }
        ];

        const total = items.reduce((sum, item) => sum + item.value, 0);
        const cx = size / 2;
        const cy = size / 2;
        const radius = size / 2 - 20;

        let svg = `<svg viewBox="0 0 ${size} ${size}" class="chart-element">`;
        let currentAngle = -90;

        items.forEach((item) => {
            const angle = (item.value / total) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;

            const x1 = cx + radius * Math.cos(startAngle * Math.PI / 180);
            const y1 = cy + radius * Math.sin(startAngle * Math.PI / 180);
            const x2 = cx + radius * Math.cos(endAngle * Math.PI / 180);
            const y2 = cy + radius * Math.sin(endAngle * Math.PI / 180);

            const largeArc = angle > 180 ? 1 : 0;

            svg += `<path d="M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z" fill="${item.color}"/>`;
            currentAngle = endAngle;
        });

        svg += '</svg>';
        return svg;
    }

    function createStatsDisplay(data) {
        const stats = data || [
            { label: 'Bedrooms', value: '4', icon: 'bed' },
            { label: 'Bathrooms', value: '2', icon: 'bath' },
            { label: 'Sq Ft', value: '2,500', icon: 'area' },
            { label: 'Parking', value: '2', icon: 'car' }
        ];

        let html = '<div class="stats-display">';
        stats.forEach(stat => {
            html += `
                <div class="stat-item">
                    <div class="stat-value">${stat.value}</div>
                    <div class="stat-label">${stat.label}</div>
                </div>
            `;
        });
        html += '</div>';
        return html;
    }

    // ============================================================================
    // ILLUSTRATIONS (Simple decorative illustrations)
    // ============================================================================

    const ILLUSTRATIONS_LIBRARY = {
        houseSketch: {
            name: 'House Sketch',
            category: 'property',
            svg: `<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 45 L50 15 L90 45"/><rect x="20" y="45" width="60" height="30"/><rect x="40" y="55" width="15" height="20"/><rect x="25" y="50" width="12" height="10"/><rect x="63" y="50" width="12" height="10"/><path d="M25 55 L31 50 L31 55 M25 55 L25 60"/><path d="M63 55 L69 50 L69 55 M63 55 L63 60"/><rect x="45" y="35" width="8" height="12"/></svg>`
        },
        keyHand: {
            name: 'Key Handover',
            category: 'property',
            svg: `<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="2"><circle cx="30" cy="35" r="12"/><circle cx="30" cy="35" r="5"/><path d="M42 35 L75 35"/><rect x="60" y="32" width="5" height="12"/><rect x="70" y="32" width="5" height="8"/><path d="M20 60 Q10 50 20 40 Q25 38 30 42"/><path d="M80 60 Q90 50 80 40 Q75 38 70 42"/></svg>`
        },
        familyHome: {
            name: 'Family & Home',
            category: 'lifestyle',
            svg: `<svg viewBox="0 0 100 80" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M25 50 L50 25 L75 50"/><rect x="30" y="50" width="40" height="25"/><rect x="45" y="60" width="10" height="15"/><circle cx="30" cy="65" r="8"/><circle cx="30" cy="58" r="5"/><circle cx="70" cy="65" r="8"/><circle cx="70" cy="58" r="5"/><circle cx="50" cy="70" r="5"/><circle cx="50" cy="65" r="3"/></svg>`
        },
        locationPin: {
            name: 'Location Pin',
            category: 'location',
            svg: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2"><path d="M50 90 C30 65 20 50 20 35 A30 30 0 1 1 80 35 C80 50 70 65 50 90Z"/><circle cx="50" cy="35" r="10"/></svg>`
        },
        soldBanner: {
            name: 'Sold Banner',
            category: 'status',
            svg: `<svg viewBox="0 0 120 50" fill="currentColor"><path d="M0 10 L10 0 L110 0 L120 10 L120 40 L110 50 L10 50 L0 40 Z" fill="currentColor"/><text x="60" y="32" text-anchor="middle" font-size="20" font-weight="bold" fill="white">SOLD</text></svg>`
        },
        newListing: {
            name: 'New Listing',
            category: 'status',
            svg: `<svg viewBox="0 0 100 40"><rect x="5" y="5" width="90" height="30" rx="5" fill="currentColor"/><text x="50" y="26" text-anchor="middle" font-size="14" font-weight="bold" fill="white">NEW LISTING</text></svg>`
        }
    };

    // ============================================================================
    // UI RENDERING
    // ============================================================================

    function renderFramesPanel(container) {
        let html = '<div class="frames-panel">';
        html += '<input type="text" class="element-search" id="frameSearch" placeholder="Search frames...">';

        const categories = {};
        Object.entries(FRAMES_LIBRARY).forEach(([id, frame]) => {
            if (!categories[frame.category]) categories[frame.category] = [];
            categories[frame.category].push({ id, ...frame });
        });

        Object.entries(categories).forEach(([category, frames]) => {
            html += `<div class="element-category">`;
            html += `<div class="category-title">${category.charAt(0).toUpperCase() + category.slice(1)}</div>`;
            html += '<div class="element-grid">';

            frames.forEach(frame => {
                html += `
                    <div class="element-item frame-item" data-type="frame" data-id="${frame.id}" title="${frame.name}" draggable="true">
                        ${frame.svg}
                    </div>
                `;
            });

            html += '</div></div>';
        });

        html += '</div>';
        container.innerHTML = html;
        initFrameEvents(container);
    }

    function renderGridsPanel(container) {
        let html = '<div class="grids-panel">';
        html += '<input type="text" class="element-search" id="gridSearch" placeholder="Search grids...">';

        const categories = {};
        Object.entries(GRIDS_LIBRARY).forEach(([id, grid]) => {
            if (!categories[grid.category]) categories[grid.category] = [];
            categories[grid.category].push({ id, ...grid });
        });

        Object.entries(categories).forEach(([category, grids]) => {
            html += `<div class="element-category">`;
            html += `<div class="category-title">${category.charAt(0).toUpperCase() + category.slice(1)} Photos</div>`;
            html += '<div class="element-grid">';

            grids.forEach(grid => {
                html += `
                    <div class="element-item grid-item" data-type="grid" data-id="${grid.id}" title="${grid.name}" draggable="true">
                        ${grid.svg}
                    </div>
                `;
            });

            html += '</div></div>';
        });

        html += '</div>';
        container.innerHTML = html;
        initGridEvents(container);
    }

    function renderStockPhotosPanel(container) {
        let html = '<div class="stock-photos-panel">';
        html += '<input type="text" class="element-search" id="photoSearch" placeholder="Search photos...">';

        Object.entries(CURATED_PHOTOS).forEach(([category, photos]) => {
            html += `<div class="element-category">`;
            html += `<div class="category-title">${category.charAt(0).toUpperCase() + category.slice(1)}</div>`;
            html += '<div class="photo-grid">';

            photos.forEach(photo => {
                html += `
                    <div class="photo-item" data-type="stock-photo" data-url="${photo.url}" data-credit="${photo.credit}" draggable="true">
                        <img src="${photo.url}" alt="${photo.id}" loading="lazy">
                        <span class="photo-credit">${photo.credit}</span>
                    </div>
                `;
            });

            html += '</div></div>';
        });

        html += '</div>';
        container.innerHTML = html;
        initPhotoEvents(container);
    }

    function renderIllustrationsPanel(container) {
        let html = '<div class="illustrations-panel">';
        html += '<input type="text" class="element-search" id="illustrationSearch" placeholder="Search illustrations...">';

        const categories = {};
        Object.entries(ILLUSTRATIONS_LIBRARY).forEach(([id, illust]) => {
            if (!categories[illust.category]) categories[illust.category] = [];
            categories[illust.category].push({ id, ...illust });
        });

        Object.entries(categories).forEach(([category, illusts]) => {
            html += `<div class="element-category">`;
            html += `<div class="category-title">${category.charAt(0).toUpperCase() + category.slice(1)}</div>`;
            html += '<div class="element-grid">';

            illusts.forEach(illust => {
                html += `
                    <div class="element-item illustration-item" data-type="illustration" data-id="${illust.id}" title="${illust.name}" draggable="true">
                        ${illust.svg}
                    </div>
                `;
            });

            html += '</div></div>';
        });

        html += '</div>';
        container.innerHTML = html;
        initIllustrationEvents(container);
    }

    // ============================================================================
    // EVENT HANDLERS
    // ============================================================================

    function initFrameEvents(container) {
        container.querySelectorAll('.frame-item').forEach(item => {
            item.addEventListener('click', () => addFrameToCanvas(item.dataset.id));
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('elementType', 'frame');
                e.dataTransfer.setData('elementId', item.dataset.id);
            });
        });
    }

    function initGridEvents(container) {
        container.querySelectorAll('.grid-item').forEach(item => {
            item.addEventListener('click', () => addGridToCanvas(item.dataset.id));
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('elementType', 'grid');
                e.dataTransfer.setData('elementId', item.dataset.id);
            });
        });
    }

    function initPhotoEvents(container) {
        container.querySelectorAll('.photo-item').forEach(item => {
            item.addEventListener('click', () => addPhotoToCanvas(item.dataset.url));
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('elementType', 'stock-photo');
                e.dataTransfer.setData('photoUrl', item.dataset.url);
            });
        });
    }

    function initIllustrationEvents(container) {
        container.querySelectorAll('.illustration-item').forEach(item => {
            item.addEventListener('click', () => addIllustrationToCanvas(item.dataset.id));
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('elementType', 'illustration');
                e.dataTransfer.setData('elementId', item.dataset.id);
            });
        });
    }

    // ============================================================================
    // CANVAS INTEGRATION
    // ============================================================================

    function addFrameToCanvas(frameId) {
        const frame = FRAMES_LIBRARY[frameId];
        if (!frame) return;

        const element = document.createElement('div');
        element.className = 'design-element frame-element';
        element.dataset.elementType = 'frame';
        element.dataset.elementId = `frame_${Date.now()}`;
        element.innerHTML = frame.svg;
        element.style.cssText = 'position: absolute; left: 100px; top: 100px; width: 200px; height: 200px;';

        addToCurrentPage(element);
    }

    function addGridToCanvas(gridId) {
        const grid = GRIDS_LIBRARY[gridId];
        if (!grid) return;

        const element = document.createElement('div');
        element.className = 'design-element grid-element';
        element.dataset.elementType = 'grid';
        element.dataset.elementId = `grid_${Date.now()}`;
        element.dataset.layout = JSON.stringify(grid.layout);
        element.innerHTML = grid.svg;
        element.style.cssText = 'position: absolute; left: 50px; top: 50px; width: 300px; height: 200px;';

        addToCurrentPage(element);
    }

    function addPhotoToCanvas(url) {
        const element = document.createElement('div');
        element.className = 'design-element photo-element';
        element.dataset.elementType = 'image';
        element.dataset.elementId = `photo_${Date.now()}`;
        element.innerHTML = `<img src="${url}" style="width: 100%; height: 100%; object-fit: cover;">`;
        element.style.cssText = 'position: absolute; left: 100px; top: 100px; width: 200px; height: 150px;';

        addToCurrentPage(element);
    }

    function addIllustrationToCanvas(illustId) {
        const illust = ILLUSTRATIONS_LIBRARY[illustId];
        if (!illust) return;

        const element = document.createElement('div');
        element.className = 'design-element illustration-element';
        element.dataset.elementType = 'illustration';
        element.dataset.elementId = `illust_${Date.now()}`;
        element.innerHTML = illust.svg;
        element.style.cssText = 'position: absolute; left: 100px; top: 100px; width: 150px; height: 120px;';

        addToCurrentPage(element);
    }

    function addToCurrentPage(element) {
        const currentPageId = window.EditorState?.currentPage;
        if (!currentPageId) {
            console.warn('No page selected');
            return;
        }

        const pageCanvas = document.querySelector(`[data-page-id="${currentPageId}"] .page-canvas, [data-page-id="${currentPageId}"]`);
        if (pageCanvas) {
            pageCanvas.appendChild(element);

            if (typeof initElementDrag === 'function') {
                initElementDrag(element);
            }
            if (typeof selectElement === 'function') {
                selectElement(element);
            }
            if (window.EditorState) {
                window.EditorState.isDirty = true;
            }
        }
    }

    // ============================================================================
    // EXPORTS
    // ============================================================================

    window.FRAMES_LIBRARY = FRAMES_LIBRARY;
    window.GRIDS_LIBRARY = GRIDS_LIBRARY;
    window.STOCK_PHOTO_CATEGORIES = STOCK_PHOTO_CATEGORIES;
    window.CURATED_PHOTOS = CURATED_PHOTOS;
    window.CHARTS_LIBRARY = CHARTS_LIBRARY;
    window.ILLUSTRATIONS_LIBRARY = ILLUSTRATIONS_LIBRARY;

    window.renderFramesPanel = renderFramesPanel;
    window.renderGridsPanel = renderGridsPanel;
    window.renderStockPhotosPanel = renderStockPhotosPanel;
    window.renderIllustrationsPanel = renderIllustrationsPanel;

    window.addFrameToCanvas = addFrameToCanvas;
    window.addGridToCanvas = addGridToCanvas;
    window.addPhotoToCanvas = addPhotoToCanvas;
    window.addIllustrationToCanvas = addIllustrationToCanvas;

    console.log('Design Elements Extended loaded:',
        Object.keys(FRAMES_LIBRARY).length, 'frames,',
        Object.keys(GRIDS_LIBRARY).length, 'grids,',
        Object.keys(ILLUSTRATIONS_LIBRARY).length, 'illustrations'
    );

})();
