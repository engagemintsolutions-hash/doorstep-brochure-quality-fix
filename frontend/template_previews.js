/**
 * TEMPLATE PREVIEW THUMBNAILS
 * Generates visual previews for all templates
 * Shows users what each layout looks like before applying
 */

const TemplatePreviews = (function() {
    'use strict';

    // Preview dimensions (LARGE for easy viewing)
    const PREVIEW_WIDTH = 400;
    const PREVIEW_HEIGHT = 300;

    // Color mappings for previews
    const PREVIEW_COLORS = {
        primary: '#C20430',
        secondary: '#f5f5f5',
        accent: '#D4AF37',
        text: '#333333',
        textLight: '#666666',
        imagePlaceholder: '#e0e0e0',
        imagePlaceholderDark: '#cccccc'
    };

    /**
     * Generate SVG preview for a template layout
     */
    function generatePreviewSVG(layoutId, pageType) {
        const generators = {
            cover: generateCoverPreview,
            details: generateDetailsPreview,
            gallery: generateGalleryPreview,
            contact: generateContactPreview
        };

        const generator = generators[pageType];
        if (!generator) {
            return generateDefaultPreview(layoutId);
        }

        return generator(layoutId);
    }

    /**
     * Generate cover page preview
     */
    function generateCoverPreview(layoutId) {
        const previews = {
            hero_full_bleed: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <!-- Full image background -->
                    <rect width="100%" height="100%" fill="${PREVIEW_COLORS.imagePlaceholder}"/>
                    <rect x="40" y="40" width="120" height="70" fill="${PREVIEW_COLORS.imagePlaceholderDark}" rx="2"/>

                    <!-- Gradient overlay -->
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="50%" style="stop-color:transparent;stop-opacity:0"/>
                            <stop offset="100%" style="stop-color:black;stop-opacity:0.7"/>
                        </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grad1)"/>

                    <!-- Price -->
                    <text x="15" y="125" fill="white" font-size="14" font-weight="bold">£695,000</text>
                    <!-- Address -->
                    <text x="15" y="140" fill="white" font-size="8" opacity="0.9">42 Primrose Lane</text>

                    <!-- Badge -->
                    <rect x="145" y="10" width="45" height="16" fill="${PREVIEW_COLORS.primary}" rx="2"/>
                    <text x="168" y="21" fill="white" font-size="6" text-anchor="middle">FOR SALE</text>
                </svg>
            `,

            hero_split_left: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <!-- Left image -->
                    <rect width="55%" height="100%" fill="${PREVIEW_COLORS.imagePlaceholder}"/>
                    <rect x="15" y="30" width="75" height="90" fill="${PREVIEW_COLORS.imagePlaceholderDark}" rx="2"/>

                    <!-- Right content -->
                    <rect x="55%" width="45%" height="100%" fill="white"/>

                    <!-- Content -->
                    <text x="125" y="45" fill="${PREVIEW_COLORS.primary}" font-size="12" font-weight="bold">£695,000</text>
                    <text x="125" y="60" fill="${PREVIEW_COLORS.text}" font-size="7">42 Primrose Lane</text>
                    <text x="125" y="70" fill="${PREVIEW_COLORS.text}" font-size="7">Richmond</text>

                    <!-- Specs -->
                    <rect x="125" y="85" width="20" height="15" fill="${PREVIEW_COLORS.secondary}" rx="2"/>
                    <text x="135" y="95" font-size="6" text-anchor="middle">4 Bed</text>
                    <rect x="150" y="85" width="20" height="15" fill="${PREVIEW_COLORS.secondary}" rx="2"/>
                    <text x="160" y="95" font-size="6" text-anchor="middle">3 Bath</text>
                </svg>
            `,

            hero_overlay_center: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <!-- Background image -->
                    <rect width="100%" height="100%" fill="${PREVIEW_COLORS.imagePlaceholder}"/>
                    <rect x="30" y="25" width="140" height="100" fill="${PREVIEW_COLORS.imagePlaceholderDark}" rx="2"/>

                    <!-- Dark overlay -->
                    <rect width="100%" height="100%" fill="rgba(0,0,0,0.4)"/>

                    <!-- Centered content -->
                    <rect x="70" y="40" width="60" height="14" fill="${PREVIEW_COLORS.primary}" rx="2"/>
                    <text x="100" y="50" fill="white" font-size="6" text-anchor="middle">FOR SALE</text>

                    <text x="100" y="75" fill="white" font-size="9" text-anchor="middle">42 Primrose Lane</text>
                    <text x="100" y="100" fill="white" font-size="16" font-weight="bold" text-anchor="middle">£695,000</text>
                </svg>
            `,

            hero_minimal: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <!-- White background -->
                    <rect width="100%" height="100%" fill="white"/>

                    <!-- Price -->
                    <text x="20" y="40" fill="${PREVIEW_COLORS.primary}" font-size="20" font-weight="bold">£695,000</text>
                    <!-- Address -->
                    <text x="20" y="58" fill="${PREVIEW_COLORS.text}" font-size="9">42 Primrose Lane, Richmond</text>

                    <!-- Divider -->
                    <rect x="20" y="68" width="30" height="3" fill="${PREVIEW_COLORS.primary}"/>

                    <!-- Specs -->
                    <text x="20" y="90" fill="${PREVIEW_COLORS.textLight}" font-size="7">4 Beds  |  3 Baths  |  2 Parking</text>

                    <!-- Small image -->
                    <rect x="130" y="85" width="55" height="50" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="3"/>
                </svg>
            `,

            hero_collage: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <!-- Header bar -->
                    <rect width="100%" height="25%" fill="${PREVIEW_COLORS.primary}"/>
                    <text x="15" y="22" fill="white" font-size="12" font-weight="bold">£695,000</text>
                    <text x="15" y="32" fill="white" font-size="6" opacity="0.9">42 Primrose Lane</text>

                    <!-- Image grid -->
                    <rect y="25%" width="66%" height="75%" fill="${PREVIEW_COLORS.imagePlaceholder}"/>
                    <rect x="0%" y="40%" width="65%" height="58%" fill="${PREVIEW_COLORS.imagePlaceholderDark}"/>

                    <rect x="67%" y="25%" width="33%" height="37%" fill="${PREVIEW_COLORS.imagePlaceholder}"/>
                    <rect x="67%" y="63%" width="33%" height="37%" fill="${PREVIEW_COLORS.imagePlaceholder}"/>
                </svg>
            `,

            hero_magazine: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="${PREVIEW_COLORS.secondary}"/>

                    <!-- Large image -->
                    <rect x="15" y="15" width="100" height="105" fill="${PREVIEW_COLORS.imagePlaceholder}"/>
                    <rect x="25" y="30" width="80" height="75" fill="${PREVIEW_COLORS.imagePlaceholderDark}"/>

                    <!-- Text card (offset) -->
                    <rect x="100" y="35" width="85" height="70" fill="white" filter="url(#shadow)"/>
                    <text x="110" y="55" fill="${PREVIEW_COLORS.primary}" font-size="12" font-weight="bold">£695,000</text>
                    <text x="110" y="68" fill="${PREVIEW_COLORS.text}" font-size="6">42 Primrose Lane</text>
                    <text x="110" y="78" fill="${PREVIEW_COLORS.text}" font-size="6">Richmond</text>
                    <line x1="110" y1="85" x2="170" y2="85" stroke="#eee"/>
                    <text x="110" y="95" fill="${PREVIEW_COLORS.textLight}" font-size="5">4 Beds | 3 Baths</text>

                    <!-- Agency badge -->
                    <rect x="15" y="125" width="60" height="12" fill="${PREVIEW_COLORS.primary}"/>
                    <text x="45" y="133" fill="white" font-size="5" text-anchor="middle">DOORSTEP</text>

                    <defs>
                        <filter id="shadow">
                            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.2"/>
                        </filter>
                    </defs>
                </svg>
            `,

            hero_geometric: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="white"/>

                    <!-- Diagonal shape -->
                    <polygon points="0,0 120,0 100,150 0,150" fill="${PREVIEW_COLORS.primary}"/>

                    <!-- Content on colored side -->
                    <text x="15" y="55" fill="white" font-size="14" font-weight="bold">£695,000</text>
                    <text x="15" y="70" fill="white" font-size="7" opacity="0.9">42 Primrose Lane</text>
                    <text x="15" y="80" fill="white" font-size="7" opacity="0.9">Richmond</text>
                    <text x="15" y="100" fill="white" font-size="6">4 Beds | 3 Baths</text>

                    <!-- Image on right -->
                    <rect x="115" y="15" width="70" height="120" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="3"/>
                    <rect x="125" y="30" width="50" height="90" fill="${PREVIEW_COLORS.imagePlaceholderDark}" rx="2"/>
                </svg>
            `,

            hero_classic: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="white"/>

                    <!-- Border frame -->
                    <rect x="8" y="8" width="184" height="134" fill="none" stroke="${PREVIEW_COLORS.primary}" stroke-width="1.5"/>

                    <!-- Image area -->
                    <rect x="15" y="15" width="170" height="80" fill="${PREVIEW_COLORS.imagePlaceholder}"/>
                    <rect x="30" y="25" width="140" height="60" fill="${PREVIEW_COLORS.imagePlaceholderDark}"/>

                    <!-- Info bar -->
                    <text x="15" y="110" fill="${PREVIEW_COLORS.text}" font-size="8">42 Primrose Lane, Richmond</text>
                    <text x="185" y="110" fill="${PREVIEW_COLORS.primary}" font-size="10" font-weight="bold" text-anchor="end">£695,000</text>

                    <!-- Specs -->
                    <text x="15" y="125" fill="${PREVIEW_COLORS.textLight}" font-size="6">4 Bedrooms | 3 Bathrooms | 2,400 sq ft</text>
                </svg>
            `,

            hero_vertical: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <!-- Dark sidebar -->
                    <rect width="35%" height="100%" fill="#1a1a1a"/>

                    <!-- Sidebar content -->
                    <rect x="10" y="30" width="35" height="10" fill="${PREVIEW_COLORS.primary}" rx="2"/>
                    <text x="27.5" y="38" fill="white" font-size="5" text-anchor="middle">FOR SALE</text>

                    <text x="10" y="65" fill="white" font-size="12" font-weight="bold">£695,000</text>
                    <text x="10" y="80" fill="white" font-size="6" opacity="0.8">42 Primrose Lane</text>
                    <text x="10" y="90" fill="white" font-size="6" opacity="0.8">Richmond</text>

                    <!-- Large image right -->
                    <rect x="35%" width="65%" height="100%" fill="${PREVIEW_COLORS.imagePlaceholder}"/>
                    <rect x="85" y="20" width="100" height="110" fill="${PREVIEW_COLORS.imagePlaceholderDark}"/>
                </svg>
            `,

            hero_polaroid: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="${PREVIEW_COLORS.secondary}"/>

                    <!-- Polaroid frame -->
                    <g transform="translate(50, 20) rotate(-2)">
                        <rect width="100" height="105" fill="white" filter="url(#shadowPol)"/>
                        <rect x="8" y="8" width="84" height="65" fill="${PREVIEW_COLORS.imagePlaceholder}"/>
                        <rect x="15" y="15" width="70" height="50" fill="${PREVIEW_COLORS.imagePlaceholderDark}"/>
                        <text x="50" y="90" fill="${PREVIEW_COLORS.text}" font-size="8" text-anchor="middle" font-style="italic">42 Primrose Lane</text>
                    </g>

                    <!-- Price badge -->
                    <circle cx="160" cy="35" r="22" fill="${PREVIEW_COLORS.primary}"/>
                    <text x="160" y="38" fill="white" font-size="8" font-weight="bold" text-anchor="middle">£695k</text>

                    <defs>
                        <filter id="shadowPol">
                            <feDropShadow dx="3" dy="3" stdDeviation="4" flood-opacity="0.15"/>
                        </filter>
                    </defs>
                </svg>
            `
        };

        return previews[layoutId] || generateDefaultPreview(layoutId);
    }

    /**
     * Generate details page preview
     */
    function generateDetailsPreview(layoutId) {
        const previews = {
            two_column_classic: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="white"/>

                    <!-- Header -->
                    <text x="15" y="20" fill="${PREVIEW_COLORS.text}" font-size="10" font-weight="bold">Property Details</text>
                    <line x1="15" y1="25" x2="185" y2="25" stroke="${PREVIEW_COLORS.primary}" stroke-width="2"/>

                    <!-- Left column -->
                    <text x="15" y="45" fill="${PREVIEW_COLORS.primary}" font-size="7" font-weight="bold">Key Features</text>
                    <circle cx="20" cy="57" r="2" fill="${PREVIEW_COLORS.primary}"/>
                    <text x="27" y="60" fill="${PREVIEW_COLORS.text}" font-size="5">Victorian character</text>
                    <circle cx="20" cy="70" r="2" fill="${PREVIEW_COLORS.primary}"/>
                    <text x="27" y="73" fill="${PREVIEW_COLORS.text}" font-size="5">South-facing garden</text>
                    <circle cx="20" cy="83" r="2" fill="${PREVIEW_COLORS.primary}"/>
                    <text x="27" y="86" fill="${PREVIEW_COLORS.text}" font-size="5">Recently renovated</text>

                    <!-- Right column -->
                    <text x="100" y="45" fill="${PREVIEW_COLORS.primary}" font-size="7" font-weight="bold">Description</text>
                    <rect x="100" y="52" width="85" height="4" fill="${PREVIEW_COLORS.secondary}" rx="1"/>
                    <rect x="100" y="60" width="80" height="4" fill="${PREVIEW_COLORS.secondary}" rx="1"/>
                    <rect x="100" y="68" width="85" height="4" fill="${PREVIEW_COLORS.secondary}" rx="1"/>
                    <rect x="100" y="76" width="70" height="4" fill="${PREVIEW_COLORS.secondary}" rx="1"/>
                    <rect x="100" y="84" width="82" height="4" fill="${PREVIEW_COLORS.secondary}" rx="1"/>
                </svg>
            `,

            feature_grid: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="white"/>

                    <!-- Title -->
                    <text x="100" y="20" fill="${PREVIEW_COLORS.primary}" font-size="10" font-weight="bold" text-anchor="middle">Property Highlights</text>

                    <!-- Feature grid -->
                    <rect x="15" y="30" width="50" height="35" fill="${PREVIEW_COLORS.secondary}" rx="3"/>
                    <text x="40" y="50" fill="${PREVIEW_COLORS.primary}" font-size="12" font-weight="bold" text-anchor="middle">4</text>
                    <text x="40" y="60" fill="${PREVIEW_COLORS.textLight}" font-size="5" text-anchor="middle">Beds</text>

                    <rect x="75" y="30" width="50" height="35" fill="${PREVIEW_COLORS.secondary}" rx="3"/>
                    <text x="100" y="50" fill="${PREVIEW_COLORS.primary}" font-size="12" font-weight="bold" text-anchor="middle">3</text>
                    <text x="100" y="60" fill="${PREVIEW_COLORS.textLight}" font-size="5" text-anchor="middle">Baths</text>

                    <rect x="135" y="30" width="50" height="35" fill="${PREVIEW_COLORS.secondary}" rx="3"/>
                    <text x="160" y="50" fill="${PREVIEW_COLORS.primary}" font-size="12" font-weight="bold" text-anchor="middle">2</text>
                    <text x="160" y="60" fill="${PREVIEW_COLORS.textLight}" font-size="5" text-anchor="middle">Parking</text>

                    <!-- Description -->
                    <rect x="15" y="75" width="170" height="4" fill="${PREVIEW_COLORS.secondary}" rx="1"/>
                    <rect x="15" y="83" width="160" height="4" fill="${PREVIEW_COLORS.secondary}" rx="1"/>
                    <rect x="15" y="91" width="165" height="4" fill="${PREVIEW_COLORS.secondary}" rx="1"/>
                </svg>
            `,

            magazine_style: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="white"/>

                    <!-- Main content area -->
                    <text x="15" y="25" fill="${PREVIEW_COLORS.text}" font-size="12" font-weight="bold">The Property</text>

                    <!-- Two columns text -->
                    <rect x="15" y="35" width="60" height="4" fill="${PREVIEW_COLORS.secondary}" rx="1"/>
                    <rect x="15" y="43" width="55" height="4" fill="${PREVIEW_COLORS.secondary}" rx="1"/>
                    <rect x="15" y="51" width="58" height="4" fill="${PREVIEW_COLORS.secondary}" rx="1"/>
                    <rect x="15" y="59" width="52" height="4" fill="${PREVIEW_COLORS.secondary}" rx="1"/>

                    <rect x="80" y="35" width="50" height="4" fill="${PREVIEW_COLORS.secondary}" rx="1"/>
                    <rect x="80" y="43" width="55" height="4" fill="${PREVIEW_COLORS.secondary}" rx="1"/>
                    <rect x="80" y="51" width="48" height="4" fill="${PREVIEW_COLORS.secondary}" rx="1"/>
                    <rect x="80" y="59" width="53" height="4" fill="${PREVIEW_COLORS.secondary}" rx="1"/>

                    <!-- Sidebar -->
                    <rect x="140" width="60" height="100%" fill="${PREVIEW_COLORS.primary}"/>
                    <text x="145" y="25" fill="white" font-size="5" font-style="italic">"An exceptional</text>
                    <text x="145" y="33" fill="white" font-size="5" font-style="italic">family home..."</text>

                    <circle cx="150" cy="55" r="2" fill="white"/>
                    <text x="157" y="58" fill="white" font-size="4">Victorian</text>
                    <circle cx="150" cy="68" r="2" fill="white"/>
                    <text x="157" y="71" fill="white" font-size="4">Renovated</text>
                </svg>
            `,

            infographic: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="white"/>

                    <!-- Header bar -->
                    <rect width="100%" height="25" fill="${PREVIEW_COLORS.primary}"/>
                    <text x="15" y="16" fill="white" font-size="8" font-weight="bold">Property Overview</text>
                    <text x="185" y="16" fill="white" font-size="6" text-anchor="end">EPC: B</text>

                    <!-- Stats row -->
                    <rect y="25" width="100%" height="40" fill="${PREVIEW_COLORS.secondary}"/>

                    <circle cx="35" cy="45" r="12" fill="white" stroke="${PREVIEW_COLORS.primary}" stroke-width="2"/>
                    <text x="35" y="48" fill="${PREVIEW_COLORS.primary}" font-size="10" font-weight="bold" text-anchor="middle">4</text>

                    <circle cx="85" cy="45" r="12" fill="white" stroke="${PREVIEW_COLORS.primary}" stroke-width="2"/>
                    <text x="85" y="48" fill="${PREVIEW_COLORS.primary}" font-size="10" font-weight="bold" text-anchor="middle">3</text>

                    <circle cx="135" cy="45" r="12" fill="white" stroke="${PREVIEW_COLORS.primary}" stroke-width="2"/>
                    <text x="135" y="48" fill="${PREVIEW_COLORS.primary}" font-size="8" font-weight="bold" text-anchor="middle">2.4k</text>

                    <text x="35" y="62" fill="${PREVIEW_COLORS.textLight}" font-size="4" text-anchor="middle">Beds</text>
                    <text x="85" y="62" fill="${PREVIEW_COLORS.textLight}" font-size="4" text-anchor="middle">Baths</text>
                    <text x="135" y="62" fill="${PREVIEW_COLORS.textLight}" font-size="4" text-anchor="middle">Sq Ft</text>

                    <!-- Content -->
                    <text x="15" y="80" fill="${PREVIEW_COLORS.text}" font-size="6" font-weight="bold">Features</text>
                    <text x="110" y="80" fill="${PREVIEW_COLORS.text}" font-size="6" font-weight="bold">About</text>
                </svg>
            `,

            cards_layout: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="white"/>

                    <!-- Title -->
                    <text x="15" y="18" fill="${PREVIEW_COLORS.text}" font-size="9" font-weight="bold">Property Information</text>
                    <line x1="15" y1="23" x2="185" y2="23" stroke="#eee"/>

                    <!-- Cards grid -->
                    <rect x="15" y="30" width="80" height="45" fill="${PREVIEW_COLORS.secondary}" rx="3"/>
                    <text x="25" y="42" fill="${PREVIEW_COLORS.text}" font-size="5" font-weight="bold">Key Features</text>
                    <rect x="25" y="48" width="60" height="3" fill="white" rx="1"/>
                    <rect x="25" y="54" width="55" height="3" fill="white" rx="1"/>
                    <rect x="25" y="60" width="58" height="3" fill="white" rx="1"/>

                    <rect x="105" y="30" width="80" height="45" fill="${PREVIEW_COLORS.secondary}" rx="3"/>
                    <text x="115" y="42" fill="${PREVIEW_COLORS.text}" font-size="5" font-weight="bold">Specifications</text>
                    <rect x="115" y="48" width="60" height="3" fill="white" rx="1"/>
                    <rect x="115" y="54" width="55" height="3" fill="white" rx="1"/>

                    <!-- Full width card -->
                    <rect x="15" y="82" width="170" height="35" fill="${PREVIEW_COLORS.secondary}" rx="3"/>
                    <text x="25" y="94" fill="${PREVIEW_COLORS.text}" font-size="5" font-weight="bold">Description</text>
                    <rect x="25" y="100" width="150" height="3" fill="white" rx="1"/>
                    <rect x="25" y="106" width="140" height="3" fill="white" rx="1"/>
                </svg>
            `
        };

        return previews[layoutId] || generateDefaultPreview(layoutId);
    }

    /**
     * Generate gallery page preview
     */
    function generateGalleryPreview(layoutId) {
        const previews = {
            masonry_grid: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="white"/>

                    <!-- Masonry-style grid -->
                    <rect x="10" y="10" width="55" height="80" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="2"/>
                    <rect x="70" y="10" width="55" height="35" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="2"/>
                    <rect x="130" y="10" width="55" height="80" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="2"/>
                    <rect x="70" y="50" width="55" height="85" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="2"/>
                    <rect x="10" y="95" width="55" height="40" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="2"/>
                    <rect x="130" y="95" width="55" height="40" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="2"/>
                </svg>
            `,

            full_width_single: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="white"/>

                    <!-- Large image -->
                    <rect y="0" width="100%" height="80%" fill="${PREVIEW_COLORS.imagePlaceholder}"/>
                    <rect x="30" y="20" width="140" height="80" fill="${PREVIEW_COLORS.imagePlaceholderDark}" rx="2"/>

                    <!-- Caption bar -->
                    <rect y="80%" width="100%" height="20%" fill="${PREVIEW_COLORS.primary}"/>
                    <text x="15" y="132" fill="white" font-size="8" font-weight="bold">Reception Room</text>
                    <text x="15" y="142" fill="white" font-size="5" opacity="0.9">24'3" x 18'6"</text>
                </svg>
            `,

            two_by_two: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="white"/>

                    <!-- 2x2 grid -->
                    <rect x="10" y="10" width="87" height="62" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="2"/>
                    <rect x="103" y="10" width="87" height="62" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="2"/>
                    <rect x="10" y="78" width="87" height="62" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="2"/>
                    <rect x="103" y="78" width="87" height="62" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="2"/>

                    <!-- Labels -->
                    <text x="53" y="65" fill="white" font-size="6" text-anchor="middle">Kitchen</text>
                    <text x="146" y="65" fill="white" font-size="6" text-anchor="middle">Living</text>
                    <text x="53" y="133" fill="white" font-size="6" text-anchor="middle">Bedroom</text>
                    <text x="146" y="133" fill="white" font-size="6" text-anchor="middle">Garden</text>
                </svg>
            `,

            featured_with_thumbs: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="white"/>

                    <!-- Featured large image -->
                    <rect x="5" y="5" width="130" height="140" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="2"/>
                    <rect x="15" y="20" width="110" height="110" fill="${PREVIEW_COLORS.imagePlaceholderDark}" rx="2"/>

                    <!-- Thumbnail strip -->
                    <rect x="140" y="5" width="55" height="32" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="2"/>
                    <rect x="140" y="42" width="55" height="32" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="2"/>
                    <rect x="140" y="79" width="55" height="32" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="2"/>
                    <rect x="140" y="116" width="55" height="29" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="2"/>
                </svg>
            `,

            polaroid_collection: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="${PREVIEW_COLORS.secondary}"/>

                    <!-- Scattered polaroids -->
                    <g transform="translate(20, 15) rotate(-5)">
                        <rect width="50" height="55" fill="white" filter="url(#polShadow)"/>
                        <rect x="5" y="5" width="40" height="32" fill="${PREVIEW_COLORS.imagePlaceholder}"/>
                    </g>

                    <g transform="translate(120, 10) rotate(3)">
                        <rect width="50" height="55" fill="white" filter="url(#polShadow)"/>
                        <rect x="5" y="5" width="40" height="32" fill="${PREVIEW_COLORS.imagePlaceholder}"/>
                    </g>

                    <g transform="translate(35, 75) rotate(2)">
                        <rect width="50" height="55" fill="white" filter="url(#polShadow)"/>
                        <rect x="5" y="5" width="40" height="32" fill="${PREVIEW_COLORS.imagePlaceholder}"/>
                    </g>

                    <g transform="translate(105, 80) rotate(-3)">
                        <rect width="50" height="55" fill="white" filter="url(#polShadow)"/>
                        <rect x="5" y="5" width="40" height="32" fill="${PREVIEW_COLORS.imagePlaceholder}"/>
                    </g>

                    <defs>
                        <filter id="polShadow">
                            <feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.15"/>
                        </filter>
                    </defs>
                </svg>
            `,

            horizontal_strip: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="white"/>

                    <!-- Title -->
                    <text x="15" y="25" fill="${PREVIEW_COLORS.text}" font-size="10" font-weight="bold">Gallery</text>

                    <!-- Horizontal strip of images -->
                    <rect x="10" y="40" width="35" height="80" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="2"/>
                    <rect x="48" y="40" width="35" height="80" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="2"/>
                    <rect x="86" y="40" width="35" height="80" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="2"/>
                    <rect x="124" y="40" width="35" height="80" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="2"/>
                    <rect x="162" y="40" width="30" height="80" fill="${PREVIEW_COLORS.imagePlaceholder}" rx="2"/>
                </svg>
            `
        };

        return previews[layoutId] || generateDefaultPreview(layoutId);
    }

    /**
     * Generate contact page preview
     */
    function generateContactPreview(layoutId) {
        const previews = {
            split_contact: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <!-- Left side -->
                    <rect width="50%" height="100%" fill="${PREVIEW_COLORS.primary}"/>
                    <text x="15" y="40" fill="white" font-size="9" font-weight="bold">Arrange a</text>
                    <text x="15" y="52" fill="white" font-size="9" font-weight="bold">Viewing</text>
                    <text x="15" y="80" fill="white" font-size="8">020 7123 4567</text>
                    <text x="15" y="95" fill="white" font-size="5" opacity="0.9">sales@doorstep.co.uk</text>

                    <!-- Right side -->
                    <rect x="50%" width="50%" height="100%" fill="white"/>

                    <!-- Agent photo placeholder -->
                    <circle cx="150" cy="55" r="25" fill="${PREVIEW_COLORS.imagePlaceholder}"/>
                    <text x="150" y="95" fill="${PREVIEW_COLORS.text}" font-size="7" font-weight="bold" text-anchor="middle">Sarah Johnson</text>
                    <text x="150" y="105" fill="${PREVIEW_COLORS.textLight}" font-size="5" text-anchor="middle">Senior Negotiator</text>

                    <!-- QR code placeholder -->
                    <rect x="135" y="115" width="30" height="30" fill="${PREVIEW_COLORS.secondary}" rx="2"/>
                </svg>
            `,

            minimal_contact: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="white"/>

                    <!-- Logo placeholder -->
                    <rect x="75" y="25" width="50" height="15" fill="${PREVIEW_COLORS.primary}" rx="2"/>

                    <!-- Title -->
                    <text x="100" y="65" fill="${PREVIEW_COLORS.text}" font-size="12" font-weight="bold" text-anchor="middle">Book Your Viewing</text>

                    <!-- Divider -->
                    <rect x="70" y="75" width="60" height="3" fill="${PREVIEW_COLORS.primary}"/>

                    <!-- Phone -->
                    <text x="100" y="100" fill="${PREVIEW_COLORS.primary}" font-size="10" font-weight="bold" text-anchor="middle">020 7123 4567</text>

                    <!-- Email -->
                    <text x="100" y="115" fill="${PREVIEW_COLORS.text}" font-size="6" text-anchor="middle">sales@doorstep.co.uk</text>

                    <!-- Address -->
                    <text x="100" y="130" fill="${PREVIEW_COLORS.textLight}" font-size="5" text-anchor="middle">123 High Street, London</text>
                </svg>
            `,

            card_contact: `
                <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="${PREVIEW_COLORS.secondary}"/>

                    <!-- Business card -->
                    <rect x="25" y="35" width="150" height="80" fill="white" rx="3" filter="url(#cardShadow)"/>

                    <!-- Left section -->
                    <rect x="35" y="50" width="40" height="10" fill="${PREVIEW_COLORS.primary}" rx="2"/>
                    <text x="55" y="75" fill="${PREVIEW_COLORS.text}" font-size="7" font-weight="bold" text-anchor="middle">Sarah Johnson</text>
                    <text x="55" y="85" fill="${PREVIEW_COLORS.textLight}" font-size="4" text-anchor="middle">Senior Negotiator</text>

                    <!-- Divider -->
                    <line x1="95" y1="45" x2="95" y2="105" stroke="${PREVIEW_COLORS.primary}" stroke-width="1.5"/>

                    <!-- Right section -->
                    <text x="105" y="60" fill="${PREVIEW_COLORS.text}" font-size="5">020 7123 4567</text>
                    <text x="105" y="75" fill="${PREVIEW_COLORS.text}" font-size="5">sarah@doorstep.co.uk</text>
                    <text x="105" y="90" fill="${PREVIEW_COLORS.text}" font-size="5">123 High Street</text>

                    <defs>
                        <filter id="cardShadow">
                            <feDropShadow dx="3" dy="3" stdDeviation="5" flood-opacity="0.1"/>
                        </filter>
                    </defs>
                </svg>
            `
        };

        return previews[layoutId] || generateDefaultPreview(layoutId);
    }

    /**
     * Default preview for unknown layouts
     */
    function generateDefaultPreview(layoutId) {
        return `
            <svg viewBox="0 0 ${PREVIEW_WIDTH} ${PREVIEW_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="${PREVIEW_COLORS.secondary}"/>
                <rect x="20" y="20" width="160" height="110" fill="white" rx="5"/>
                <text x="100" y="70" fill="${PREVIEW_COLORS.textLight}" font-size="10" text-anchor="middle">Template</text>
                <text x="100" y="85" fill="${PREVIEW_COLORS.primary}" font-size="8" text-anchor="middle">${layoutId}</text>
            </svg>
        `;
    }

    /**
     * Create preview element
     */
    function createPreviewElement(layoutId, pageType, onClick) {
        const container = document.createElement('div');
        container.className = 'template-preview';
        container.dataset.layoutId = layoutId;
        container.dataset.pageType = pageType;

        const svg = generatePreviewSVG(layoutId, pageType);
        container.innerHTML = svg;

        if (onClick) {
            container.addEventListener('click', () => onClick(layoutId, pageType));
            container.style.cursor = 'pointer';
        }

        return container;
    }

    /**
     * Get all previews for a page type
     */
    function getAllPreviews(pageType) {
        if (!window.RealTemplates) {
            console.warn('[TemplatePreviews] RealTemplates not loaded');
            return {};
        }

        const layoutGetters = {
            cover: () => window.RealTemplates.getCoverLayouts(),
            details: () => window.RealTemplates.getDetailsLayouts(),
            gallery: () => window.RealTemplates.getGalleryLayouts(),
            contact: () => window.RealTemplates.getContactLayouts()
        };

        const getter = layoutGetters[pageType];
        if (!getter) return {};

        const layouts = getter();
        const previews = {};

        Object.keys(layouts).forEach(layoutId => {
            previews[layoutId] = {
                svg: generatePreviewSVG(layoutId, pageType),
                layout: layouts[layoutId]
            };
        });

        return previews;
    }

    // Initialize
    console.log('[TemplatePreviews] Loaded - SVG preview generator ready');

    // Public API
    return {
        generatePreviewSVG,
        createPreviewElement,
        getAllPreviews,
        PREVIEW_WIDTH,
        PREVIEW_HEIGHT,
        isLoaded: true
    };
})();

// Export globally
window.TemplatePreviews = TemplatePreviews;
