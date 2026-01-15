/**
 * Expanded Icons Library - 200+ icons for property brochures
 * Extends the base ICONS_LIBRARY
 */

(function() {
    'use strict';

    // Additional icons to merge with ICONS_LIBRARY
    const EXTENDED_ICONS = {
        // More Property Types
        cottage: {
            name: 'Cottage',
            category: 'property',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-8 9 8"/><path d="M5 9v11h14V9"/><rect x="9" y="14" width="6" height="6"/><circle cx="9" cy="7" r="2"/></svg>`
        },
        villa: {
            name: 'Villa',
            category: 'property',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 11l4-4h12l4 4"/><rect x="4" y="11" width="16" height="10"/><rect x="8" y="15" width="3" height="6"/><rect x="13" y="15" width="3" height="6"/><path d="M10 4v3"/><circle cx="10" cy="3" r="1"/></svg>`
        },
        mansion: {
            name: 'Mansion',
            category: 'property',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="8" width="20" height="14"/><path d="M2 8l10-6 10 6"/><line x1="6" y1="12" x2="6" y2="12.01"/><line x1="10" y1="12" x2="10" y2="12.01"/><line x1="14" y1="12" x2="14" y2="12.01"/><line x1="18" y1="12" x2="18" y2="12.01"/><rect x="9" y="16" width="6" height="6"/></svg>`
        },
        farmhouse: {
            name: 'Farmhouse',
            category: 'property',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10l9-7 9 7"/><path d="M5 8v14h14V8"/><rect x="8" y="14" width="4" height="8"/><path d="M15 12v4h3v-4z"/></svg>`
        },
        townhouse: {
            name: 'Townhouse',
            category: 'property',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="7" height="18"/><rect x="9" y="6" width="6" height="16"/><rect x="15" y="4" width="7" height="18"/><line x1="5" y1="8" x2="5" y2="8.01"/><line x1="12" y1="10" x2="12" y2="10.01"/><line x1="18" y1="8" x2="18" y2="8.01"/></svg>`
        },
        penthouse: {
            name: 'Penthouse',
            category: 'property',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20"/><path d="M4 6h16"/><path d="M8 2v4"/><path d="M16 2v4"/><rect x="8" y="14" width="8" height="8"/><path d="M8 10h8"/></svg>`
        },
        studio: {
            name: 'Studio',
            category: 'property',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16"/><rect x="6" y="12" width="5" height="6"/><line x1="14" y1="13" x2="18" y2="13"/><line x1="14" y1="16" x2="17" y2="16"/></svg>`
        },
        maisonette: {
            name: 'Maisonette',
            category: 'property',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20"/><line x1="4" y1="12" x2="20" y2="12"/><rect x="8" y="5" width="3" height="3"/><rect x="13" y="5" width="3" height="3"/><rect x="8" y="15" width="3" height="3"/><rect x="13" y="15" width="3" height="3"/></svg>`
        },

        // More Room Types
        utility: {
            name: 'Utility Room',
            category: 'rooms',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="9" cy="12" r="3"/><circle cx="16" cy="9" r="2"/><path d="M9 15v4"/></svg>`
        },
        conservatory: {
            name: 'Conservatory',
            category: 'rooms',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12l9-9 9 9"/><path d="M5 10v12h14V10"/><line x1="5" y1="14" x2="19" y2="14"/><line x1="5" y1="18" x2="19" y2="18"/><line x1="9" y1="10" x2="9" y2="22"/><line x1="15" y1="10" x2="15" y2="22"/></svg>`
        },
        basement: {
            name: 'Basement',
            category: 'rooms',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="10" width="16" height="12"/><path d="M4 10V6l8-4 8 4v4"/><path d="M8 10v-4"/><line x1="8" y1="14" x2="8" y2="14.01"/><line x1="12" y1="14" x2="12" y2="14.01"/><line x1="16" y1="14" x2="16" y2="14.01"/></svg>`
        },
        loft: {
            name: 'Loft',
            category: 'rooms',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12l10-9 10 9"/><path d="M4 10v12h16V10"/><path d="M9 10l3-3 3 3"/><rect x="8" y="16" width="8" height="6"/></svg>`
        },
        pantry: {
            name: 'Pantry',
            category: 'rooms',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="16" x2="20" y2="16"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="14" r="1"/><circle cx="16" cy="10" r="1"/></svg>`
        },
        hallway: {
            name: 'Hallway',
            category: 'rooms',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="2" width="12" height="20"/><path d="M6 2v20"/><path d="M18 2v20"/><circle cx="15" cy="12" r="1"/></svg>`
        },
        study: {
            name: 'Study',
            category: 'rooms',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><rect x="7" y="10" width="4" height="3"/><line x1="14" y1="11" x2="17" y2="11"/><line x1="14" y1="14" x2="16" y2="14"/></svg>`
        },
        playroom: {
            name: 'Playroom',
            category: 'rooms',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="2"/><rect x="14" y="6" width="4" height="4"/><path d="M6 16l4-4 4 4 4-4"/></svg>`
        },
        cellar: {
            name: 'Wine Cellar',
            category: 'rooms',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><ellipse cx="8" cy="10" rx="2" ry="3"/><ellipse cx="12" cy="10" rx="2" ry="3"/><ellipse cx="16" cy="10" rx="2" ry="3"/><line x1="4" y1="16" x2="20" y2="16"/></svg>`
        },

        // More Amenities
        ev: {
            name: 'EV Charging',
            category: 'amenities',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="8" width="12" height="14" rx="2"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/><path d="M11 14l2-3h-2l2-3"/></svg>`
        },
        solar: {
            name: 'Solar Panels',
            category: 'amenities',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="10" width="18" height="10"/><line x1="3" y1="14" x2="21" y2="14"/><line x1="3" y1="17" x2="21" y2="17"/><line x1="7" y1="10" x2="7" y2="20"/><line x1="12" y1="10" x2="12" y2="20"/><line x1="17" y1="10" x2="17" y2="20"/><circle cx="12" cy="5" r="2"/><path d="M12 7v3"/></svg>`
        },
        cctv: {
            name: 'CCTV',
            category: 'amenities',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12l3-3h6l3-3h3v6l-3 3v6H8l-3-3z"/><circle cx="9" cy="12" r="2"/></svg>`
        },
        sauna: {
            name: 'Sauna',
            category: 'amenities',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="6" width="16" height="14" rx="2"/><line x1="8" y1="10" x2="8" y2="16"/><line x1="12" y1="10" x2="12" y2="16"/><line x1="16" y1="10" x2="16" y2="16"/><path d="M10 3c0 1 1 2 1 3"/><path d="M14 3c0 1 1 2 1 3"/></svg>`
        },
        jacuzzi: {
            name: 'Hot Tub',
            category: 'amenities',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="14" rx="8" ry="5"/><path d="M4 14v4a8 5 0 0 0 16 0v-4"/><path d="M8 10c0-2 1-3 2-4"/><path d="M12 10c0-2 1-3 2-4"/><path d="M16 10c0-2 1-3 2-4"/></svg>`
        },
        laundry: {
            name: 'Laundry',
            category: 'amenities',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="13" r="5"/><circle cx="12" cy="13" r="2"/><circle cx="7" cy="5" r="1"/><circle cx="10" cy="5" r="1"/></svg>`
        },
        dishwasher: {
            name: 'Dishwasher',
            category: 'amenities',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="4" y1="8" x2="20" y2="8"/><circle cx="8" cy="6" r="1"/><circle cx="12" cy="14" r="4"/><line x1="10" y1="12" x2="14" y2="16"/></svg>`
        },
        alarm: {
            name: 'Alarm System',
            category: 'amenities',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><circle cx="12" cy="16" r="1"/></svg>`
        },
        intercom: {
            name: 'Intercom',
            category: 'amenities',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="12" height="16" rx="2"/><circle cx="12" cy="10" r="3"/><rect x="9" y="15" width="6" height="2"/></svg>`
        },
        underfloor: {
            name: 'Underfloor Heating',
            category: 'amenities',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M6 10c2-2 4 0 6-2s4 0 6-2"/><path d="M6 14c2-2 4 0 6-2s4 0 6-2"/><path d="M6 18c2-2 4 0 6-2s4 0 6-2"/></svg>`
        },
        smartHome: {
            name: 'Smart Home',
            category: 'amenities',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3"/><path d="M12 10v-2"/><path d="M12 16v2"/><path d="M9 13H7"/><path d="M17 13h-2"/></svg>`
        },
        lift: {
            name: 'Lift/Elevator',
            category: 'amenities',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="4" y1="6" x2="20" y2="6"/><path d="M9 3l3 2 3-2"/><path d="M9 14l3-2 3 2"/><path d="M9 18l3 2 3-2"/></svg>`
        },

        // More Transport
        tube: {
            name: 'Underground',
            category: 'transport',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 8h8v8H8z"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>`
        },
        tram: {
            name: 'Tram',
            category: 'transport',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="6" width="14" height="12" rx="2"/><line x1="5" y1="10" x2="19" y2="10"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/><line x1="8" y1="18" x2="8" y2="22"/><line x1="16" y1="18" x2="16" y2="22"/><path d="M12 2v4"/></svg>`
        },
        ferry: {
            name: 'Ferry',
            category: 'transport',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M4 17l2-10h12l2 10"/><rect x="9" y="9" width="6" height="5"/></svg>`
        },
        motorway: {
            name: 'Motorway',
            category: 'transport',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19l4-14h8l4 14"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="6" y1="16" x2="18" y2="16"/></svg>`
        },
        taxi: {
            name: 'Taxi Rank',
            category: 'transport',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 17h14v-5H5z"/><path d="M6 12l2-5h8l2 5"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><rect x="9" y="6" width="6" height="2"/></svg>`
        },

        // More Local
        university: {
            name: 'University',
            category: 'local',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 10l10-7 10 7-10 7z"/><path d="M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6"/><path d="M22 10v10"/></svg>`
        },
        nursery: {
            name: 'Nursery',
            category: 'local',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M12 12v10"/><path d="M8 16l4-4 4 4"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>`
        },
        library: {
            name: 'Library',
            category: 'local',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="14" y2="10"/></svg>`
        },
        cinema: {
            name: 'Cinema',
            category: 'local',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8h20"/><circle cx="6" cy="6" r="1"/><circle cx="10" cy="6" r="1"/><polygon points="10 12 16 15 10 18"/></svg>`
        },
        theatre: {
            name: 'Theatre',
            category: 'local',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`
        },
        supermarket: {
            name: 'Supermarket',
            category: 'local',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`
        },
        pharmacy: {
            name: 'Pharmacy',
            category: 'local',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>`
        },
        dentist: {
            name: 'Dentist',
            category: 'local',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8 2 5 5 5 9c0 3 2 5 2 8 0 2 1 5 3 5 1 0 2-2 2-4 0 2 1 4 2 4 2 0 3-3 3-5 0-3 2-5 2-8 0-4-3-7-7-7z"/></svg>`
        },
        gym2: {
            name: 'Fitness Centre',
            category: 'local',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.5 6.5L17.5 17.5"/><path d="M21 21l-2-2"/><path d="M3 3l2 2"/><path d="M18 18l3 3"/><path d="M3 21l3-3"/><rect x="12" y="8" width="4" height="8" rx="1" transform="rotate(45 14 12)"/></svg>`
        },
        cafe: {
            name: 'Cafe',
            category: 'local',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`
        },
        pub: {
            name: 'Pub',
            category: 'local',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 22h8"/><path d="M12 11v11"/><path d="M5.5 11c-.5 0-1-.5-1-1V6c0-.5.5-1 1-1h13c.5 0 1 .5 1 1v4c0 .5-.5 1-1 1"/><path d="M5 3h14"/></svg>`
        },
        church: {
            name: 'Church',
            category: 'local',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4"/><path d="M10 4h4"/><path d="M7 8l5-2 5 2v14H7V8z"/><rect x="10" y="14" width="4" height="8"/></svg>`
        },
        mosque: {
            name: 'Mosque',
            category: 'local',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2c-3 3-6 6-6 10v10h12V12c0-4-3-7-6-10z"/><rect x="9" y="16" width="6" height="6"/><circle cx="20" cy="8" r="2"/></svg>`
        },

        // More UI/General
        heart: {
            name: 'Heart',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
        },
        heartFilled: {
            name: 'Heart Filled',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
        },
        check: {
            name: 'Checkmark',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`
        },
        checkCircle: {
            name: 'Check Circle',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="16 10 10 16 8 14"/></svg>`
        },
        cross: {
            name: 'Cross',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
        },
        plus: {
            name: 'Plus',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`
        },
        minus: {
            name: 'Minus',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>`
        },
        arrowRight: {
            name: 'Arrow Right',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`
        },
        arrowLeft: {
            name: 'Arrow Left',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`
        },
        arrowUp: {
            name: 'Arrow Up',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`
        },
        arrowDown: {
            name: 'Arrow Down',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>`
        },
        menu: {
            name: 'Menu',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`
        },
        search: {
            name: 'Search',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`
        },
        settings: {
            name: 'Settings',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`
        },
        user: {
            name: 'User',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
        },
        users: {
            name: 'Users',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
        },
        home: {
            name: 'Home',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
        },
        bell: {
            name: 'Bell',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`
        },
        lock: {
            name: 'Lock',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
        },
        unlock: {
            name: 'Unlock',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`
        },
        eye: {
            name: 'Eye',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
        },
        eyeOff: {
            name: 'Eye Off',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
        },
        edit: {
            name: 'Edit',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`
        },
        trash: {
            name: 'Trash',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`
        },
        copy: {
            name: 'Copy',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`
        },
        link: {
            name: 'Link',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`
        },
        image: {
            name: 'Image',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
        },
        video: {
            name: 'Video',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`
        },
        file: {
            name: 'File',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>`
        },
        folder: {
            name: 'Folder',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`
        },
        sun: {
            name: 'Sun',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        },
        moon: {
            name: 'Moon',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
        },
        cloud: {
            name: 'Cloud',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`
        },
        droplet: {
            name: 'Droplet',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`
        },
        zap: {
            name: 'Lightning',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
        },
        award: {
            name: 'Award',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`
        },
        gift: {
            name: 'Gift',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`
        },
        tag: {
            name: 'Tag',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`
        },
        bookmark: {
            name: 'Bookmark',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`
        },
        flag: {
            name: 'Flag',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`
        },
        percent: {
            name: 'Percent',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`
        },
        pound: {
            name: 'Pound',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 20h10"/><path d="M7 12h6"/><path d="M8 20V12c0-2 1-5 4-5s4 2 4 4"/></svg>`
        },
        euro: {
            name: 'Euro',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10h12"/><path d="M4 14h10"/><path d="M19 6a8 8 0 0 0-16 0v12a8 8 0 0 0 16 0"/></svg>`
        },
        dollar: {
            name: 'Dollar',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
        },
        creditCard: {
            name: 'Credit Card',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`
        },
        briefcase: {
            name: 'Briefcase',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`
        },
        key: {
            name: 'Key',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>`
        },
        keys: {
            name: 'House Keys',
            category: 'property',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7.5" cy="15.5" r="5.5"/><path d="M21 2l-9.6 9.6"/><path d="M15.5 7.5l3 3L22 7l-3-3"/><circle cx="7.5" cy="15.5" r="2"/></svg>`
        },
        handshake: {
            name: 'Handshake',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 17l-5-5 5-5"/><path d="M13 7l5 5-5 5"/><path d="M6 12h12"/></svg>`
        },
        thumbUp: {
            name: 'Thumbs Up',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>`
        },
        compass: {
            name: 'Compass',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`
        },
        map: {
            name: 'Map',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`
        },
        navigation: {
            name: 'Navigation',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`
        },
        layers: {
            name: 'Layers',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`
        },
        layout: {
            name: 'Layout',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`
        },
        grid: {
            name: 'Grid',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`
        },
        list: {
            name: 'List',
            category: 'ui',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`
        },

        // Badges & Labels
        newBadge: {
            name: 'New Badge',
            category: 'badges',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="8" width="20" height="8" rx="2"/><text x="12" y="14" text-anchor="middle" font-size="6" fill="currentColor">NEW</text></svg>`
        },
        soldBadge: {
            name: 'Sold Badge',
            category: 'badges',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L2 22"/><rect x="2" y="8" width="20" height="8" rx="2"/></svg>`
        },
        priceDrop: {
            name: 'Price Drop',
            category: 'badges',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l9 18H3z"/><path d="M12 8v4"/><path d="M12 16v.01"/></svg>`
        },
        verified: {
            name: 'Verified',
            category: 'badges',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7v5c0 5.55 3.84 10.74 10 12 6.16-1.26 10-6.45 10-12V7l-10-5z"/><polyline points="9 12 11 14 15 10"/></svg>`
        },
        premium: {
            name: 'Premium',
            category: 'badges',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/><circle cx="12" cy="12" r="4"/></svg>`
        },
        exclusive: {
            name: 'Exclusive',
            category: 'badges',
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 14.5 9 22 9 16 13.5 18.5 21 12 16.5 5.5 21 8 13.5 2 9 9.5 9"/></svg>`
        }
    };

    // Merge with existing ICONS_LIBRARY
    if (window.ICONS_LIBRARY) {
        Object.assign(window.ICONS_LIBRARY, EXTENDED_ICONS);
        console.log(`Icons expanded to ${Object.keys(window.ICONS_LIBRARY).length} total icons`);
    } else {
        window.EXTENDED_ICONS = EXTENDED_ICONS;
        console.log(`Extended Icons loaded: ${Object.keys(EXTENDED_ICONS).length} additional icons`);
    }

    // Export as IconsExpanded object for module detection
    window.IconsExpanded = {
        icons: EXTENDED_ICONS,
        count: Object.keys(EXTENDED_ICONS).length,
        isLoaded: true,
        getIcon: (id) => EXTENDED_ICONS[id] || null,
        getByCategory: (cat) => Object.values(EXTENDED_ICONS).filter(i => i.category === cat)
    };

})();
