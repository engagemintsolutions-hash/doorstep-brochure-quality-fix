/**
 * Knight Frank Style Brochure Template
 * Professional 9-page estate agent brochure generator
 *
 * Replicates the exact layout and style of premium UK estate agent brochures
 */

const KnightFrankTemplate = (function() {
    'use strict';

    // Default brand colors (Doorstep - can be overridden)
    const DEFAULT_BRAND = {
        primary: '#722F37',      // Doorstep burgundy
        secondary: '#F8F4E8',    // Doorstep cream
        accent: '#722F37',       // Accent for highlighted words
        text: '#2d2d2d',
        textLight: '#666666',
        background: '#ffffff',
        logoSvg: `<svg viewBox="0 0 200 60" style="height: 40px; width: auto;">
            <path d="M30 45 L30 28 L23 28 L40 12 L57 28 L50 28 L50 45 Z" fill="currentColor"/>
            <rect x="35" y="32" width="10" height="13" fill="#F8F4E8"/>
            <text x="65" y="38" font-family="Georgia, serif" font-size="18" fill="currentColor">doorstep</text>
        </svg>`
    };

    // Font stacks
    const FONTS = {
        heading: "'Playfair Display', Georgia, 'Times New Roman', serif",
        body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    };

    /**
     * Generate complete Knight Frank style brochure HTML
     */
    function generate(data, options = {}) {
        const brand = { ...DEFAULT_BRAND, ...options.brand };
        const property = data.property || {};
        const photos = data.photos || [];
        const location = data.location || {};
        const agent = data.agent || {};
        const floorPlan = data.floorPlan || null;
        const siteMap = data.siteMap || null;

        // Extract key data
        const address = property.address || 'Property Address';
        const price = formatPrice(property.askingPrice || property.price);
        const tagline = generateTagline(property, location);
        const roomSummary = generateRoomSummary(property);
        const situation = generateSituation(property, location);
        const propertyDescription = generatePropertyDescription(property, photos);
        const bedroomDescription = generateBedroomDescription(property, photos);
        const gardenDescription = generateGardenDescription(property, photos);

        // Categorize photos
        const categorizedPhotos = categorizePhotos(photos);

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(address)} | ${escapeHtml(price)}</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
    <style>
        ${generateStyles(brand)}
    </style>
</head>
<body>
    <!-- Page 1: Cover -->
    ${generateCoverPage(address, price, property, categorizedPhotos, brand)}

    <!-- Page 2: Summary -->
    ${generateSummaryPage(address, tagline, roomSummary, property, location, agent, categorizedPhotos, brand)}

    <!-- Page 3: Location -->
    ${generateLocationPage(situation, categorizedPhotos, brand)}

    <!-- Page 4: Property Description -->
    ${generatePropertyPage(address, propertyDescription, categorizedPhotos, brand)}

    <!-- Page 5: Bedrooms -->
    ${generateBedroomsPage(bedroomDescription, categorizedPhotos, brand)}

    <!-- Page 6: Floor Plans -->
    ${generateFloorPlansPage(floorPlan, property, categorizedPhotos, brand)}

    <!-- Page 7: Gardens & Grounds -->
    ${generateGardensPage(gardenDescription, property, categorizedPhotos, brand)}

    <!-- Page 8: Technical Details -->
    ${generateDetailsPage(property, location, siteMap, categorizedPhotos, brand)}

    <!-- Page 9: Back Cover -->
    ${generateBackCoverPage(categorizedPhotos, agent, brand)}

    <script>
        // Enable contenteditable for all editable elements
        document.querySelectorAll('[data-editable]').forEach(el => {
            el.contentEditable = true;
        });
    </script>
</body>
</html>`;
    }

    /**
     * Generate CSS styles
     */
    function generateStyles(brand) {
        return `
        @page {
            size: A4 landscape;
            margin: 0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: ${FONTS.body};
            color: ${brand.text};
            line-height: 1.6;
            background: #f5f5f5;
        }

        /* Editable elements */
        [data-editable]:hover {
            outline: 2px dashed ${brand.primary}40;
            outline-offset: 2px;
        }
        [data-editable]:focus {
            outline: 2px solid ${brand.primary};
            outline-offset: 2px;
            background: ${brand.primary}08;
        }

        /* Page structure */
        .brochure-page {
            width: 297mm;
            min-height: 210mm;
            background: ${brand.background};
            margin: 20px auto;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            position: relative;
            overflow: hidden;
            page-break-after: always;
        }

        /* Cover page */
        .cover-page {
            position: relative;
        }
        .cover-page .hero-image {
            width: 100%;
            height: 210mm;
            object-fit: cover;
        }
        .cover-page .overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0,0,0,0.7));
            padding: 60px 50px 40px;
        }
        .cover-page .cover-content {
            text-align: left;
        }
        .cover-page .property-name {
            font-family: ${FONTS.heading};
            font-size: 38px;
            font-weight: 400;
            color: white;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .cover-page .cover-price {
            font-family: ${FONTS.heading};
            font-size: 28px;
            font-weight: 500;
            color: white;
            margin-bottom: 15px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .cover-page .cover-stats {
            display: flex;
            gap: 25px;
            margin-top: 10px;
        }
        .cover-page .cover-stats .stat {
            color: white;
            font-size: 14px;
            text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .cover-page .cover-stats .stat strong {
            font-size: 18px;
            font-weight: 600;
            margin-right: 5px;
        }
        .cover-page .logo {
            position: absolute;
            top: 30px;
            right: 40px;
            color: white;
            background: rgba(255,255,255,0.95);
            padding: 10px 15px;
            border-radius: 4px;
        }
        .cover-page .logo svg {
            color: ${brand.primary};
        }

        /* Summary page - split layout */
        .summary-page {
            display: grid;
            grid-template-columns: 1fr 1fr;
        }
        .summary-page .image-section {
            position: relative;
        }
        .summary-page .image-section img {
            width: 100%;
            height: 210mm;
            object-fit: cover;
        }
        .summary-page .image-section .caption {
            position: absolute;
            bottom: 20px;
            left: 20px;
            color: white;
            font-size: 12px;
            text-shadow: 0 1px 3px rgba(0,0,0,0.5);
        }
        .summary-page .content-section {
            padding: 50px 45px;
            display: flex;
            flex-direction: column;
        }
        .summary-page .tagline {
            font-family: ${FONTS.heading};
            font-size: 22px;
            font-weight: 400;
            line-height: 1.4;
            color: ${brand.text};
            margin-bottom: 20px;
        }
        .summary-page .tagline .accent {
            color: ${brand.accent};
            font-weight: 500;
        }

        /* At a Glance Box */
        .summary-page .at-glance-box {
            background: ${brand.secondary};
            padding: 20px 25px;
            margin-bottom: 20px;
            border-left: 4px solid ${brand.primary};
        }
        .summary-page .at-glance-box h3 {
            font-family: ${FONTS.heading};
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            color: ${brand.primary};
        }
        .summary-page .at-glance-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 15px;
        }
        .summary-page .glance-item {
            text-align: center;
        }
        .summary-page .glance-value {
            display: block;
            font-family: ${FONTS.heading};
            font-size: 24px;
            font-weight: 600;
            color: ${brand.primary};
        }
        .summary-page .glance-label {
            display: block;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: ${brand.textLight};
            margin-top: 3px;
        }
        .summary-page .price-display {
            text-align: center;
            padding-top: 15px;
            border-top: 1px solid ${brand.primary}30;
        }
        .summary-page .price-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: ${brand.textLight};
        }
        .summary-page .price-value {
            display: block;
            font-family: ${FONTS.heading};
            font-size: 28px;
            font-weight: 600;
            color: ${brand.primary};
            margin-top: 5px;
        }

        .summary-page .divider {
            width: 100%;
            height: 1px;
            background: ${brand.text}30;
            margin-bottom: 20px;
        }
        .summary-page h3 {
            font-family: ${FONTS.heading};
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 10px;
            color: ${brand.text};
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .summary-page .room-list {
            font-size: 13px;
            line-height: 1.9;
            color: ${brand.textLight};
            margin-bottom: 20px;
        }
        .summary-page .total-size {
            font-size: 13px;
            font-weight: 500;
            color: ${brand.text};
            margin-bottom: 30px;
        }
        .summary-page .distances h3 {
            margin-bottom: 8px;
        }
        .summary-page .distances p {
            font-size: 12px;
            color: ${brand.textLight};
            margin-bottom: 5px;
        }
        .summary-page .distances .note {
            font-size: 11px;
            font-style: italic;
            color: #999;
        }
        .summary-page .agent-section {
            margin-top: auto;
            display: grid;
            grid-template-columns: auto 1fr 1fr;
            gap: 30px;
            align-items: start;
            padding-top: 30px;
            border-top: 1px solid #eee;
        }
        .summary-page .agent-section .logo {
            color: ${brand.primary};
        }
        .summary-page .agent-office h4 {
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 5px;
        }
        .summary-page .agent-office p {
            font-size: 11px;
            color: ${brand.textLight};
            line-height: 1.5;
        }
        .summary-page .agent-office a {
            color: ${brand.primary};
            text-decoration: none;
        }
        .summary-page .agent-name {
            font-weight: 600;
            color: ${brand.text};
            margin-top: 10px;
        }

        /* Location page (formerly Situation) */
        .location-page {
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            gap: 0;
        }
        .location-page .text-section {
            padding: 50px 40px;
            background: ${brand.background};
        }
        .location-page h2 {
            font-family: ${FONTS.heading};
            font-size: 26px;
            font-weight: 500;
            margin-bottom: 25px;
            padding-left: 15px;
            border-left: 4px solid ${brand.primary};
            color: ${brand.text};
        }
        .location-page .text-content {
            font-size: 14px;
            line-height: 1.9;
            color: ${brand.textLight};
            text-align: justify;
        }
        .location-page .text-content p {
            margin-bottom: 18px;
        }
        .location-page .photo-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 3px;
        }
        .location-page .photo-grid img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .location-page .photo-grid img:first-child {
            grid-row: span 2;
        }

        /* Property description page */
        .property-page {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 0;
        }
        .property-page .main-image {
            grid-row: span 2;
        }
        .property-page .main-image img {
            width: 100%;
            height: 210mm;
            object-fit: cover;
        }
        .property-page .text-section {
            padding: 40px 35px;
        }
        .property-page h2 {
            font-family: ${FONTS.heading};
            font-size: 22px;
            font-weight: 400;
            margin-bottom: 20px;
            color: ${brand.text};
        }
        .property-page .description {
            font-size: 12px;
            line-height: 1.8;
            color: ${brand.textLight};
            text-align: justify;
        }
        .property-page .description p {
            margin-bottom: 15px;
        }
        .property-page .side-photos {
            display: grid;
            grid-template-rows: 1fr 1fr;
            gap: 3px;
        }
        .property-page .side-photos img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* Bedrooms page */
        /* Bedrooms page - 2 column: photos left, text right */
        .bedrooms-page-v2 {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 0;
        }
        .bedrooms-page-v2 .bedroom-photos {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 3px;
        }
        .bedrooms-page-v2 .bedroom-photos img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .bedrooms-page-v2 .bedroom-text {
            padding: 50px 40px;
            background: ${brand.background};
            display: flex;
            flex-direction: column;
        }
        .bedrooms-page-v2 .bedroom-text h2 {
            font-family: ${FONTS.heading};
            font-size: 26px;
            font-weight: 500;
            margin-bottom: 25px;
            padding-left: 15px;
            border-left: 4px solid ${brand.primary};
            color: ${brand.text};
        }
        .bedrooms-page-v2 .text-content {
            font-size: 14px;
            line-height: 1.9;
            color: ${brand.textLight};
        }
        .bedrooms-page-v2 .text-content p {
            margin-bottom: 18px;
        }

        /* Floor plans page */
        .floorplans-page {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
        }
        .floorplans-page .plans-section {
            padding: 30px 40px;
            background: ${brand.background};
        }
        .floorplans-page .area-info {
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 5px;
        }
        .floorplans-page .area-detail {
            font-size: 12px;
            color: ${brand.textLight};
            margin-bottom: 20px;
        }
        .floorplans-page .disclaimer {
            font-size: 10px;
            color: #999;
            margin-bottom: 20px;
            line-height: 1.5;
        }
        .floorplans-page .plan-image {
            max-width: 100%;
            margin-bottom: 20px;
        }
        .floorplans-page .legend {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
            font-size: 11px;
        }
        .floorplans-page .legend-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        .floorplans-page .legend-color {
            width: 12px;
            height: 12px;
            border-radius: 2px;
        }
        .floorplans-page .photos-section {
            display: grid;
            grid-template-rows: 1fr 1fr;
            gap: 3px;
        }
        .floorplans-page .photos-section img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* Gardens page */
        .gardens-page {
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            gap: 0;
        }
        .gardens-page .text-section {
            padding: 40px;
            background: ${brand.background};
        }
        .gardens-page h2 {
            font-family: ${FONTS.heading};
            font-size: 20px;
            font-weight: 400;
            margin-bottom: 20px;
            color: ${brand.text};
        }
        .gardens-page .description {
            font-size: 12px;
            line-height: 1.8;
            color: ${brand.textLight};
            text-align: justify;
            margin-bottom: 25px;
        }
        .gardens-page .outbuilding-info {
            font-size: 11px;
            color: ${brand.textLight};
            padding: 15px;
            background: #f9f9f9;
            border-left: 3px solid ${brand.primary};
        }
        .gardens-page .photo-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1.2fr 0.8fr;
            gap: 3px;
        }
        .gardens-page .photo-grid img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .gardens-page .photo-grid img:first-child {
            grid-column: span 2;
        }

        /* Details page */
        .details-page {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 0;
        }
        .details-page .map-section {
            padding: 30px;
            background: #f9f9f9;
        }
        .details-page .map-section img {
            width: 100%;
            margin-bottom: 15px;
            border: 1px solid #ddd;
        }
        .details-page .map-note {
            font-size: 9px;
            color: #999;
            line-height: 1.4;
        }
        .details-page .info-section {
            padding: 40px 35px;
            background: ${brand.background};
        }
        .details-page h3 {
            font-family: ${FONTS.heading};
            font-size: 16px;
            font-weight: 400;
            margin-bottom: 10px;
            color: ${brand.text};
        }
        .details-page .info-content {
            font-size: 12px;
            color: ${brand.textLight};
            margin-bottom: 25px;
            line-height: 1.6;
        }
        .details-page .info-table {
            margin-bottom: 25px;
        }
        .details-page .info-row {
            display: flex;
            font-size: 12px;
            padding: 5px 0;
        }
        .details-page .info-label {
            font-weight: 500;
            color: ${brand.text};
            width: 120px;
        }
        .details-page .info-value {
            color: ${brand.textLight};
        }
        .details-page .legal-section {
            font-size: 8px;
            color: #999;
            line-height: 1.5;
            margin-top: auto;
        }
        .details-page .photo-column {
            display: grid;
            grid-template-rows: 1fr 1fr;
            gap: 3px;
        }
        .details-page .photo-column img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        /* Back cover */
        .back-cover {
            position: relative;
        }
        .back-cover img {
            width: 100%;
            height: 210mm;
            object-fit: cover;
            filter: brightness(0.7);
        }
        .back-cover .back-cover-content {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 60px;
            background: linear-gradient(transparent, rgba(0,0,0,0.8));
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        .back-cover .logo-large {
            color: white;
        }
        .back-cover .logo-large svg {
            height: 60px;
            width: auto;
        }
        .back-cover .contact-info {
            text-align: right;
        }
        .back-cover .contact-info p {
            font-size: 14px;
            margin-bottom: 5px;
            color: white;
        }
        .back-cover .contact-info .office {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .back-cover .contact-info a {
            color: white;
            text-decoration: none;
        }

        /* Print styles */
        @media print {
            body {
                background: white;
            }
            .brochure-page {
                margin: 0;
                box-shadow: none;
                page-break-after: always;
            }
            [data-editable]:hover,
            [data-editable]:focus {
                outline: none;
                background: transparent;
            }
        }
        `;
    }

    /**
     * Generate Cover Page (Page 1)
     */
    function generateCoverPage(address, price, property, photos, brand) {
        const heroPhoto = photos.exterior?.[0] || photos.aerial?.[0] || photos.all?.[0];
        const heroUrl = heroPhoto?.url || heroPhoto?.dataUrl || '';

        // Build key stats for cover
        const beds = property.bedrooms || '';
        const baths = property.bathrooms || '';
        const receptions = property.receptions || '';
        const sqft = property.sqft ? `${Number(property.sqft).toLocaleString()} sq ft` : '';

        return `
        <div class="brochure-page cover-page">
            <img src="${heroUrl}" alt="Property exterior" class="hero-image">
            <div class="overlay">
                <div class="cover-content">
                    <h1 class="property-name" data-editable="address">${escapeHtml(address)}</h1>
                    <div class="cover-price" data-editable="price">Guide Price ${price}</div>
                    <div class="cover-stats">
                        ${beds ? `<span class="stat"><strong>${beds}</strong> Bedrooms</span>` : ''}
                        ${baths ? `<span class="stat"><strong>${baths}</strong> Bathrooms</span>` : ''}
                        ${receptions ? `<span class="stat"><strong>${receptions}</strong> Reception Rooms</span>` : ''}
                        ${sqft ? `<span class="stat"><strong>${sqft}</strong></span>` : ''}
                    </div>
                </div>
            </div>
            <div class="logo">${brand.logoSvg}</div>
        </div>`;
    }

    /**
     * Generate Summary Page (Page 2)
     */
    function generateSummaryPage(address, tagline, roomSummary, property, location, agent, photos, brand) {
        const viewPhoto = photos.living?.[0] || photos.view?.[0] || photos.exterior?.[1] || photos.all?.[1];
        const viewUrl = viewPhoto?.url || viewPhoto?.dataUrl || '';

        const distances = generateDistances(location);
        const price = formatPrice(property.askingPrice || property.price);

        // Generate At-a-Glance box
        const atGlance = generateAtGlance(property);

        return `
        <div class="brochure-page summary-page">
            <div class="image-section">
                <img src="${viewUrl}" alt="View from the property">
            </div>
            <div class="content-section">
                <p class="tagline" data-editable="tagline">${tagline}</p>

                <!-- At a Glance Box -->
                <div class="at-glance-box">
                    <h3>At a Glance</h3>
                    <div class="at-glance-grid">
                        ${atGlance}
                    </div>
                    <div class="price-display">
                        <span class="price-label">Guide Price</span>
                        <span class="price-value" data-editable="price">${price}</span>
                    </div>
                </div>

                <div class="divider"></div>

                <h3>Summary of Accommodation</h3>
                <div class="room-list" data-editable="rooms">${roomSummary}</div>

                <div class="distances">
                    <h3>Distances</h3>
                    ${distances}
                    <p class="note">(All distances and times are approximate)</p>
                </div>

                <div class="agent-section">
                    <div class="logo">${brand.logoSvg}</div>
                    <div class="agent-office">
                        <h4>${agent.officeName || 'Doorstep'}</h4>
                        <p>${agent.address || ''}</p>
                        <p><a href="${agent.website || 'https://doorstep.co.uk'}">${agent.website || 'doorstep.co.uk'}</a></p>
                        <p class="agent-name">${agent.name || ''}</p>
                        <p>${agent.phone || ''}</p>
                        <p>${agent.email || ''}</p>
                    </div>
                </div>
            </div>
        </div>`;
    }

    /**
     * Generate Location Page (Page 3) - renamed from "Situation"
     */
    function generateLocationPage(situation, photos, brand) {
        // Location page should show EXTERIOR and GARDEN photos, not interior
        const locationPhotos = [
            photos.exterior?.[0],
            photos.garden?.[0],
            photos.exterior?.[1] || photos.aerial?.[0],
            photos.garden?.[1] || photos.view?.[0]
        ].filter(Boolean).slice(0, 4);

        // Pad with exterior/garden if needed
        while (locationPhotos.length < 4) {
            const fallback = photos.exterior?.[locationPhotos.length] ||
                           photos.garden?.[locationPhotos.length] ||
                           photos.all?.[locationPhotos.length];
            if (fallback) locationPhotos.push(fallback);
            else break;
        }

        return `
        <div class="brochure-page location-page">
            <div class="text-section">
                <h2>Location</h2>
                <div class="text-content" data-editable="location">
                    ${situation}
                </div>
            </div>
            <div class="photo-grid">
                ${locationPhotos.map((photo, i) => `
                    <img src="${photo?.url || photo?.dataUrl || ''}" alt="Location ${i + 1}">
                `).join('')}
            </div>
        </div>`;
    }

    /**
     * Generate Property Description Page (Page 4)
     */
    function generatePropertyPage(address, description, photos, brand) {
        const mainPhoto = photos.kitchen?.[0] || photos.living?.[0] || photos.interior?.[0];
        const sidePhotos = [
            photos.living?.[1] || photos.reception?.[0],
            photos.dining?.[0] || photos.interior?.[1]
        ].filter(Boolean);

        const propertyName = address.split(',')[0] || address;

        return `
        <div class="brochure-page property-page">
            <div class="main-image">
                <img src="${mainPhoto?.url || mainPhoto?.dataUrl || ''}" alt="Kitchen">
            </div>
            <div class="text-section">
                <h2 data-editable="property-name">${escapeHtml(propertyName)}</h2>
                <div class="description" data-editable="property-description">
                    ${description}
                </div>
            </div>
            <div class="side-photos">
                ${sidePhotos.map((photo, i) => `
                    <img src="${photo?.url || photo?.dataUrl || ''}" alt="Interior ${i + 1}">
                `).join('')}
            </div>
        </div>`;
    }

    /**
     * Generate Bedrooms Page (Page 5) - adaptive layout based on photos available
     */
    function generateBedroomsPage(description, photos, brand) {
        const bedroomPhotos = [
            ...(photos.bedroom || []),
            ...(photos.bathroom || [])
        ].slice(0, 4);

        // Simpler 2-column layout: photos left, text right
        return `
        <div class="brochure-page bedrooms-page-v2">
            <div class="bedroom-photos">
                ${bedroomPhotos.map((photo, i) => `
                    <img src="${photo?.url || photo?.dataUrl || ''}" alt="${i < (photos.bedroom?.length || 0) ? 'Bedroom' : 'Bathroom'}">
                `).join('')}
            </div>
            <div class="bedroom-text">
                <h2>Bedroom Accommodation</h2>
                <div class="text-content" data-editable="bedroom-description">
                    ${description}
                </div>
            </div>
        </div>`;
    }

    /**
     * Generate Floor Plans Page (Page 6)
     */
    function generateFloorPlansPage(floorPlan, property, photos, brand) {
        const sqft = property.sqft || '';
        const sqm = sqft ? Math.round(parseInt(sqft) * 0.0929) : '';

        const exteriorPhotos = [
            photos.exterior?.[1] || photos.pool?.[0],
            photos.exterior?.[2] || photos.garden?.[0]
        ].filter(Boolean);

        return `
        <div class="brochure-page floorplans-page">
            <div class="plans-section">
                <p class="area-info">Approximate Gross Internal Floor Area</p>
                <p class="area-detail">${sqm ? `${sqm} sq m / ` : ''}${sqft ? `${sqft} sq ft` : 'TBC'}</p>

                <p class="disclaimer">This plan is for guidance only and must not be relied upon as a statement of fact. Attention is drawn to the Important Notice on the last page of the text of the Particulars.</p>

                ${floorPlan ? `<img src="${floorPlan}" alt="Floor Plan" class="plan-image">` : `
                    <div style="background: #f5f5f5; padding: 60px; text-align: center; color: #999; margin-bottom: 20px;">
                        <p>Floor plan to be provided</p>
                    </div>
                `}

                <div class="legend">
                    <div class="legend-item"><span class="legend-color" style="background: #f5d6d6;"></span> Reception</div>
                    <div class="legend-item"><span class="legend-color" style="background: #d6e5f5;"></span> Bedroom</div>
                    <div class="legend-item"><span class="legend-color" style="background: #d6f5e5;"></span> Bathroom</div>
                    <div class="legend-item"><span class="legend-color" style="background: #f5f5d6;"></span> Kitchen/Utility</div>
                    <div class="legend-item"><span class="legend-color" style="background: #e5e5e5;"></span> Storage</div>
                    <div class="legend-item"><span class="legend-color" style="background: #d6f5d6;"></span> Outside</div>
                </div>
            </div>
            <div class="photos-section">
                ${exteriorPhotos.map(photo => `
                    <img src="${photo?.url || photo?.dataUrl || ''}" alt="Exterior">
                `).join('')}
            </div>
        </div>`;
    }

    /**
     * Generate Gardens Page (Page 7)
     */
    function generateGardensPage(description, property, photos, brand) {
        const gardenPhotos = [
            photos.exterior?.[0] || photos.garden?.[0],
            photos.garden?.[1] || photos.exterior?.[1],
            photos.pool?.[0] || photos.exterior?.[2],
            photos.terrace?.[0] || photos.garden?.[2]
        ].filter(Boolean).slice(0, 4);

        return `
        <div class="brochure-page gardens-page">
            <div class="text-section">
                <h2>Gardens and grounds</h2>
                <div class="description" data-editable="garden-description">
                    ${description}
                </div>
                ${property.outbuildings ? `
                    <div class="outbuilding-info">
                        <strong>Outbuildings:</strong> ${property.outbuildings}
                    </div>
                ` : ''}
            </div>
            <div class="photo-grid">
                ${gardenPhotos.map((photo, i) => `
                    <img src="${photo?.url || photo?.dataUrl || ''}" alt="Garden ${i + 1}">
                `).join('')}
            </div>
        </div>`;
    }

    /**
     * Generate Details Page (Page 8)
     */
    function generateDetailsPage(property, location, siteMap, photos, brand) {
        const scenicPhotos = [
            photos.view?.[0] || photos.exterior?.[3],
            photos.garden?.[3] || photos.exterior?.[4]
        ].filter(Boolean);

        return `
        <div class="brochure-page details-page">
            <div class="map-section">
                ${siteMap ? `<img src="${siteMap}" alt="Site Map">` : `
                    <div style="background: #eee; padding: 40px; text-align: center; color: #999;">
                        <p>Site map available on request</p>
                    </div>
                `}
                <p class="map-note">Note: "This plan is based upon the Ordnance Survey map with the sanction of the control of H.M. Stationery office. This plan is for convenience of purchasers only. Its accuracy is not guaranteed and it is expressly excluded from any contract."</p>
            </div>
            <div class="info-section">
                <h3>Services</h3>
                <p class="info-content" data-editable="services">${property.services || 'Mains water and electricity. Gas central heating. Mains drainage.'}</p>

                <h3>Directions</h3>
                <p class="info-content">Postcode: ${property.postcode || 'Available on request'}</p>

                <h3>Property information</h3>
                <div class="info-table">
                    <div class="info-row">
                        <span class="info-label">Tenure:</span>
                        <span class="info-value">${property.tenure || 'Freehold'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Local Authority:</span>
                        <span class="info-value">${property.localAuthority || 'To be confirmed'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Council Tax:</span>
                        <span class="info-value">Band ${property.councilTaxBand || 'TBC'}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">EPC Rating:</span>
                        <span class="info-value">${property.epc || 'TBC'}</span>
                    </div>
                </div>

                <div class="legal-section">
                    <p><strong>Fixtures and fittings:</strong> A list of the fitted carpets, curtains, light fittings and other items fixed to the property which are included in the sale (or may be available by separate negotiation) will be provided by the Seller's Solicitors.</p>
                    <br>
                    <p><strong>Important Notice:</strong> 1. Particulars: These particulars are not an offer or contract, nor part of one. You should not rely on statements by the agent in the particulars or by word of mouth or in writing ("information") as being factually accurate about the property, its condition or its value. Neither the agent nor any joint agent has any authority to make any representations about the property, and accordingly any information given is entirely without responsibility on the part of the agents, seller(s) or lessor(s). 2. Photos, Videos etc: The photographs, property videos and virtual viewings etc. show only certain parts of the property as they appeared at the time they were taken. Areas, measurements and distances given are approximate only. 3. Regulations etc: Any reference to alterations to, or use of, any part of the property does not mean that any necessary planning, building regulations or other consent has been obtained.</p>
                </div>
            </div>
            <div class="photo-column">
                ${scenicPhotos.map(photo => `
                    <img src="${photo?.url || photo?.dataUrl || ''}" alt="Property view">
                `).join('')}
            </div>
        </div>`;
    }

    /**
     * Generate Back Cover (Page 9)
     */
    function generateBackCoverPage(photos, agent, brand) {
        // Back cover should ONLY use exterior or garden photos - never interior
        const heroPhoto = photos.exterior?.[1] || photos.garden?.[0] || photos.exterior?.[0] || photos.aerial?.[0];
        const heroUrl = heroPhoto?.url || heroPhoto?.dataUrl || '';

        return `
        <div class="brochure-page back-cover">
            ${heroUrl ? `<img src="${heroUrl}" alt="Property grounds">` : ''}
            <div class="back-cover-content">
                <div class="logo-large">${brand.logoSvg}</div>
                <div class="contact-info">
                    <p class="office">${agent?.officeName || 'Doorstep'}</p>
                    <p>${agent?.address || ''}</p>
                    <p>${agent?.phone || ''}</p>
                    <p><a href="mailto:${agent?.email || ''}">${agent?.email || ''}</a></p>
                    <p><a href="https://${agent?.website || 'doorstep.co.uk'}">${agent?.website || 'doorstep.co.uk'}</a></p>
                </div>
            </div>
        </div>`;
    }

    // =========================================================================
    // CONTENT GENERATION HELPERS
    // =========================================================================

    /**
     * Generate opening tagline
     */
    function generateTagline(property, location) {
        const type = property.propertyType || 'property';
        const beds = property.bedrooms || '';
        const style = property.style || '';
        const highlight = property.keyFeature || 'beautiful surroundings';
        const area = location.area || property.location || '';

        // Avoid duplication: if style contains "house" and type contains "house", use just style
        let propertyDesc = '';
        const styleLower = style.toLowerCase();
        const typeLower = type.toLowerCase();

        if (style && styleLower.includes('house') && typeLower.includes('house')) {
            // Use style only to avoid "Country House detached house"
            propertyDesc = style.toLowerCase();
        } else if (style && styleLower.includes('cottage') && typeLower.includes('cottage')) {
            propertyDesc = style.toLowerCase();
        } else if (style) {
            propertyDesc = `${style.toLowerCase()} ${type}`;
        } else {
            propertyDesc = type;
        }

        // Generate elegant tagline with accent word
        let tagline = '';
        if (property.listed) {
            tagline = `An exceptional ${property.listed} ${propertyDesc} offering <span class="accent">${highlight}</span>${area ? ` in ${area}` : ''}.`;
        } else if (beds) {
            tagline = `An impressive ${beds} bedroom ${propertyDesc} offering <span class="accent">${highlight}</span>${area ? ` in ${area}` : ''}.`;
        } else {
            tagline = `A distinguished ${propertyDesc} offering <span class="accent">${highlight}</span>${area ? ` in ${area}` : ''}.`;
        }

        return tagline;
    }

    /**
     * Generate room summary with pipe separators
     */
    function generateRoomSummary(property) {
        const rooms = [];

        // Ground floor
        const groundFloor = [];
        if (property.entranceHall) groundFloor.push('Entrance hall');
        if (property.receptions) {
            for (let i = 0; i < Math.min(property.receptions, 3); i++) {
                groundFloor.push(['Sitting room', 'Dining room', 'Family room'][i]);
            }
        }
        if (property.kitchen) groundFloor.push('Kitchen/breakfast room');
        if (property.utility) groundFloor.push('Utility');
        if (property.study) groundFloor.push('Study');
        if (property.cloakroom || property.wc) groundFloor.push('Cloakroom');

        if (groundFloor.length > 0) {
            rooms.push(groundFloor.join(' | '));
        }

        // Bedrooms
        const bedrooms = [];
        if (property.bedrooms) {
            if (property.masterEnsuite) {
                bedrooms.push('Principal bedroom suite with en suite bathroom');
                if (property.bedrooms > 1) {
                    bedrooms.push(`${property.bedrooms - 1} further bedroom${property.bedrooms > 2 ? 's' : ''}`);
                }
            } else {
                bedrooms.push(`${property.bedrooms} bedroom${property.bedrooms > 1 ? 's' : ''}`);
            }
        }
        if (property.bathrooms) {
            bedrooms.push(`${property.bathrooms} bathroom${property.bathrooms > 1 ? 's' : ''}`);
        }

        if (bedrooms.length > 0) {
            rooms.push(bedrooms.join(' | '));
        }

        // Outside
        const outside = [];
        if (property.garden) outside.push('Garden');
        if (property.garage) outside.push('Garage');
        if (property.parking) outside.push('Parking');
        if (property.pool) outside.push('Swimming pool');
        if (property.tennisCourt) outside.push('Tennis court');

        if (outside.length > 0) {
            rooms.push(outside.join(' | '));
        }

        return rooms.join('<br><br>');
    }

    /**
     * Generate distances section
     */
    function generateDistances(location) {
        const distances = [];

        if (location.nearestStation) {
            distances.push(`<p>${location.nearestStation.name} ${location.nearestStation.distance} (${location.nearestStation.journeyTime} to London)</p>`);
        }
        if (location.nearestTown) {
            distances.push(`<p>${location.nearestTown.name} ${location.nearestTown.distance}</p>`);
        }
        if (location.londonDistance) {
            distances.push(`<p>Central London ${location.londonDistance}</p>`);
        }

        if (distances.length === 0) {
            distances.push('<p>Transport links available on request</p>');
        }

        return distances.join('');
    }

    /**
     * Generate situation/location description
     */
    function generateSituation(property, location) {
        const paragraphs = [];
        const address = property.address || '';
        const area = location.area || address.split(',').slice(-2).join(',').trim();

        // Paragraph 1: Setting
        let setting = `<p>${address.split(',')[0] || 'The property'} is located`;
        if (location.areaDescription) {
            setting += ` in ${location.areaDescription}`;
        } else if (area) {
            setting += ` in the desirable area of ${area}`;
        }
        if (location.nearbyLandmark) {
            setting += `, with ${location.nearbyLandmark} nearby`;
        }
        setting += '.</p>';
        paragraphs.push(setting);

        // Paragraph 2: Local amenities
        if (location.amenities || location.nearestTown) {
            let amenities = '<p>The area is well served by local amenities';
            if (location.nearestTown) {
                amenities += ` with ${location.nearestTown.name} offering a range of shops, restaurants, and services`;
            }
            amenities += '.</p>';
            paragraphs.push(amenities);
        }

        // Paragraph 3: Transport
        if (location.transport || location.nearestStation) {
            let transport = '<p>The area has excellent transport links';
            if (location.nearestStation) {
                transport += ` with ${location.nearestStation.name} station providing services to London`;
                if (location.nearestStation.journeyTime) {
                    transport += ` in approximately ${location.nearestStation.journeyTime}`;
                }
            }
            transport += '.</p>';
            paragraphs.push(transport);
        }

        // Paragraph 4: Schools
        if (location.schools && location.schools.length > 0) {
            const schoolNames = location.schools.slice(0, 4).map(s => s.name).join(', ');
            paragraphs.push(`<p>There are a number of well-regarded schools in the area including ${schoolNames}.</p>`);
        }

        // Paragraph 5: Leisure
        if (location.leisure) {
            paragraphs.push(`<p>Leisure facilities in the area include ${location.leisure}.</p>`);
        }

        return paragraphs.join('\n');
    }

    /**
     * Generate property description - comprehensive and lifestyle-focused
     */
    function generatePropertyDescription(property, photos) {
        const paragraphs = [];
        const name = property.address?.split(',')[0] || 'The property';
        const sqft = property.sqft ? Number(property.sqft).toLocaleString() : null;

        // Opening paragraph - set the scene
        let opening = `<p>${name}`;
        if (property.listed) {
            opening += ` is a ${property.listed}`;
        } else {
            opening += ` is a`;
        }
        if (property.style) {
            opening += ` ${property.style.toLowerCase()}`;
        }
        if (property.propertyType && !property.style?.toLowerCase().includes(property.propertyType.toLowerCase())) {
            opening += ` ${property.propertyType}`;
        }
        opening += ' that has been thoughtfully maintained and improved by the current owners. ';
        if (sqft) {
            opening += `The accommodation extends to approximately ${sqft} sq ft and offers flexible living space ideal for modern family life.`;
        }
        opening += '</p>';
        paragraphs.push(opening);

        // Entrance and hallway
        if (property.entranceHall) {
            paragraphs.push('<p>Upon entering, guests are greeted by a welcoming entrance hall that sets the tone for the rest of the house. The hallway provides access to the principal reception rooms and features elegant proportions.</p>');
        }

        // Reception rooms - more descriptive
        if (property.receptions) {
            let receptions = '<p>The reception rooms are generously proportioned and flow naturally from one to another, creating an excellent space for entertaining. ';
            if (property.sittingRoom) {
                receptions += 'The drawing room is a particular highlight, featuring ample natural light and creating a warm, inviting atmosphere. ';
            }
            if (property.diningRoom) {
                receptions += 'The separate dining room provides an elegant setting for formal occasions. ';
            }
            if (property.familyRoom) {
                receptions += 'A relaxed family room offers a more casual living space, perfect for everyday use. ';
            }
            receptions += '</p>';
            paragraphs.push(receptions);
        }

        // Kitchen - lifestyle focused
        if (property.kitchen) {
            let kitchen = '<p>The heart of the home is undoubtedly the kitchen/breakfast room, which has been fitted with quality cabinetry and modern appliances. ';
            kitchen += 'The space is ideal for family life, combining practical work areas with comfortable dining space. ';
            kitchen += 'Natural light floods the room, creating a bright and welcoming environment.</p>';
            paragraphs.push(kitchen);
        }

        // Utility and additional
        if (property.utility || property.study) {
            let additional = '<p>';
            if (property.utility) {
                additional += 'A separate utility room provides practical space for laundry and storage. ';
            }
            if (property.study) {
                additional += 'The study offers a quiet retreat for working from home, increasingly important in today\'s world. ';
            }
            additional += '</p>';
            paragraphs.push(additional);
        }

        return paragraphs.join('\n');
    }

    /**
     * Generate bedroom description - comprehensive
     */
    function generateBedroomDescription(property, photos) {
        const paragraphs = [];

        if (property.bedrooms) {
            // Opening
            let opening = '<p>The bedroom accommodation is arranged ';
            opening += property.floors > 1 ? 'over the upper floors and ' : 'on the first floor, ';
            opening += 'providing excellent space for family and guests alike.</p>';
            paragraphs.push(opening);

            // Principal suite
            if (property.masterEnsuite) {
                let master = '<p>The principal bedroom suite is a particular highlight, offering a peaceful retreat with ample space. ';
                master += 'The room benefits from an en suite bathroom, fitted to a high standard, ';
                master += 'along with built-in wardrobes providing excellent storage. ';
                master += 'Views from the windows look out over the surrounding grounds.</p>';
                paragraphs.push(master);
            }

            // Further bedrooms
            if (property.bedrooms > 1) {
                const further = property.bedrooms - 1;
                let others = `<p>There are ${further} further bedroom${further > 1 ? 's' : ''}, each of generous proportions and filled with natural light. `;
                others += 'These rooms offer flexibility as guest accommodation, children\'s rooms, or home offices as required. ';
                if (property.bathrooms > 1) {
                    others += `The bedrooms are served by ${property.bathrooms - 1} additional bathroom${property.bathrooms > 2 ? 's' : ''}, `;
                    others += 'ensuring convenience for family and guests.</p>';
                } else {
                    others += 'A well-appointed family bathroom serves the additional bedrooms.</p>';
                }
                paragraphs.push(others);
            }

            // Bathrooms detail
            if (property.bathrooms >= 2) {
                let baths = '<p>The bathrooms throughout have been fitted with quality sanitaryware and offer a blend of ';
                baths += 'contemporary style and practical functionality. ';
                baths += 'Several feature both bath and separate shower facilities.</p>';
                paragraphs.push(baths);
            }
        }

        return paragraphs.join('\n');
    }

    /**
     * Generate garden description - comprehensive outdoor living
     */
    function generateGardenDescription(property, photos) {
        const paragraphs = [];
        const name = property.address?.split(',')[0] || 'The property';

        // Opening
        let opening = `<p>${name} is set within `;
        if (property.acres) {
            opening += `approximately ${property.acres} acres of `;
        }
        opening += 'beautifully landscaped gardens and grounds that provide an idyllic setting for outdoor living and entertaining.</p>';
        paragraphs.push(opening);

        // Garden detail
        if (property.garden) {
            let garden = '<p>The gardens have been thoughtfully designed with a combination of formal lawns, ';
            garden += 'mature specimen trees, and colourful herbaceous borders. ';
            garden += 'There are various seating areas positioned to take advantage of the sun throughout the day, ';
            garden += 'perfect for al fresco dining on summer evenings.</p>';
            paragraphs.push(garden);
        }

        // Pool
        if (property.pool) {
            let pool = '<p>A particular highlight is the swimming pool, ';
            pool += 'which provides an excellent leisure facility during the warmer months. ';
            pool += 'The pool area has been landscaped to create a private oasis, ';
            pool += 'with surrounding terrace space for sun loungers and relaxation.</p>';
            paragraphs.push(pool);
        }

        // Parking and outbuildings
        if (property.parking || property.garage) {
            let parking = '<p>Practical considerations have not been overlooked, ';
            if (property.garage) {
                parking += 'with a garage providing secure parking and additional storage. ';
            }
            parking += 'There is ample space for off-street parking, ';
            parking += 'ensuring convenience for residents and visitors alike.</p>';
            paragraphs.push(parking);
        }

        // Summary
        if (property.acres) {
            let summary = `<p>In total, the grounds extend to approximately ${property.acres} acres, `;
            summary += 'offering privacy and seclusion while remaining easily manageable. ';
            summary += 'The outdoor space truly complements the house and offers year-round enjoyment.</p>';
            paragraphs.push(summary);
        }

        return paragraphs.join('\n');
    }

    // =========================================================================
    // UTILITY FUNCTIONS
    // =========================================================================

    function formatPrice(price) {
        if (!price) return 'Price on Application';
        const num = parseInt(price.toString().replace(/[^0-9]/g, ''));
        return '£' + num.toLocaleString('en-GB');
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Generate At-a-Glance stats grid
     */
    function generateAtGlance(property) {
        const items = [];

        if (property.bedrooms) {
            items.push(`<div class="glance-item"><span class="glance-value">${property.bedrooms}</span><span class="glance-label">Bedrooms</span></div>`);
        }
        if (property.bathrooms) {
            items.push(`<div class="glance-item"><span class="glance-value">${property.bathrooms}</span><span class="glance-label">Bathrooms</span></div>`);
        }
        if (property.receptions) {
            items.push(`<div class="glance-item"><span class="glance-value">${property.receptions}</span><span class="glance-label">Receptions</span></div>`);
        }
        if (property.sqft) {
            items.push(`<div class="glance-item"><span class="glance-value">${Number(property.sqft).toLocaleString()}</span><span class="glance-label">Sq Ft</span></div>`);
        }
        if (property.acres) {
            items.push(`<div class="glance-item"><span class="glance-value">${property.acres}</span><span class="glance-label">Acres</span></div>`);
        }
        if (property.tenure) {
            items.push(`<div class="glance-item"><span class="glance-value">${property.tenure}</span><span class="glance-label">Tenure</span></div>`);
        }
        if (property.epc) {
            items.push(`<div class="glance-item"><span class="glance-value">${property.epc}</span><span class="glance-label">EPC</span></div>`);
        }
        if (property.councilTaxBand) {
            items.push(`<div class="glance-item"><span class="glance-value">${property.councilTaxBand}</span><span class="glance-label">Council Tax</span></div>`);
        }

        return items.join('');
    }

    /**
     * Categorize photos by room type
     */
    function categorizePhotos(photos) {
        const categories = {
            exterior: [],
            aerial: [],
            view: [],
            living: [],
            kitchen: [],
            dining: [],
            bedroom: [],
            bathroom: [],
            garden: [],
            pool: [],
            terrace: [],
            reception: [],
            interior: [],
            all: []
        };

        photos.forEach(photo => {
            categories.all.push(photo);

            const type = (photo.type || photo.category || photo.room || '').toLowerCase();
            const desc = (photo.description || photo.label || '').toLowerCase();
            const combined = type + ' ' + desc;

            if (combined.includes('exterior') || combined.includes('front') || combined.includes('outside')) {
                categories.exterior.push(photo);
            } else if (combined.includes('aerial') || combined.includes('drone')) {
                categories.aerial.push(photo);
            } else if (combined.includes('view') || combined.includes('outlook')) {
                categories.view.push(photo);
            } else if (combined.includes('living') || combined.includes('lounge') || combined.includes('sitting')) {
                categories.living.push(photo);
            } else if (combined.includes('kitchen')) {
                categories.kitchen.push(photo);
            } else if (combined.includes('dining')) {
                categories.dining.push(photo);
            } else if (combined.includes('bedroom') || combined.includes('master')) {
                categories.bedroom.push(photo);
            } else if (combined.includes('bathroom') || combined.includes('ensuite') || combined.includes('shower')) {
                categories.bathroom.push(photo);
            } else if (combined.includes('garden')) {
                categories.garden.push(photo);
            } else if (combined.includes('pool') || combined.includes('swimming')) {
                categories.pool.push(photo);
            } else if (combined.includes('terrace') || combined.includes('patio')) {
                categories.terrace.push(photo);
            } else if (combined.includes('reception') || combined.includes('hall')) {
                categories.reception.push(photo);
            } else {
                categories.interior.push(photo);
            }
        });

        return categories;
    }

    // =========================================================================
    // PUBLIC API
    // =========================================================================

    return {
        generate,
        generateTagline,
        generateRoomSummary,
        generateSituation,
        categorizePhotos,
        DEFAULT_BRAND,
        FONTS
    };

})();

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.KnightFrankTemplate = KnightFrankTemplate;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = KnightFrankTemplate;
}
