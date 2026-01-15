/**
 * British Property Badges & Ribbons
 * Essential elements for UK estate agent brochures
 *
 * "You can't sell a house without showing it's chain free, love"
 * - Every British estate agent ever
 */

(function() {
    'use strict';

    // ========================================================================
    // PROPERTY STATUS BADGES - The important bits buyers look for
    // ========================================================================

    const STATUS_BADGES = {
        chainFree: {
            text: 'CHAIN FREE',
            color: '#059669',
            description: 'No chain - quick completion possible'
        },
        newToMarket: {
            text: 'NEW TO MARKET',
            color: '#2563eb',
            description: 'Just listed'
        },
        priceReduced: {
            text: 'PRICE REDUCED',
            color: '#dc2626',
            description: 'Price has been lowered'
        },
        underOffer: {
            text: 'UNDER OFFER',
            color: '#7c3aed',
            description: 'Offer accepted, not yet exchanged'
        },
        soldStc: {
            text: 'SOLD STC',
            color: '#6b7280',
            description: 'Sold subject to contract'
        },
        soleAgent: {
            text: 'SOLE AGENT',
            color: '#1a365d',
            description: 'Exclusive to this agency'
        },
        mustBeViewed: {
            text: 'MUST BE VIEWED',
            color: '#b45309',
            description: 'Photos don\'t do it justice'
        },
        virtualTour: {
            text: 'VIRTUAL TOUR',
            color: '#0891b2',
            description: '360° tour available'
        },
        openDay: {
            text: 'OPEN DAY',
            color: '#dc2626',
            description: 'Viewing day scheduled'
        }
    };

    // ========================================================================
    // TENURE BADGES - Freehold/Leasehold (crucial in UK!)
    // ========================================================================

    const TENURE_BADGES = {
        freehold: {
            text: 'FREEHOLD',
            color: '#065f46',
            description: 'You own the land outright'
        },
        leasehold: {
            text: 'LEASEHOLD',
            color: '#92400e',
            description: 'Check years remaining'
        },
        shareOfFreehold: {
            text: 'SHARE OF FREEHOLD',
            color: '#1e40af',
            description: 'Part ownership of freehold'
        },
        commonhold: {
            text: 'COMMONHOLD',
            color: '#5b21b6',
            description: 'Commonhold ownership'
        }
    };

    // ========================================================================
    // EPC RATING BADGES - Mandatory in UK property listings
    // ========================================================================

    const EPC_RATINGS = {
        A: { color: '#00845a', label: 'A (92-100)', band: 'Excellent' },
        B: { color: '#2daa4a', label: 'B (81-91)', band: 'Very Good' },
        C: { color: '#8dce46', label: 'C (69-80)', band: 'Good' },
        D: { color: '#ffd500', label: 'D (55-68)', band: 'Average' },
        E: { color: '#fcaa65', label: 'E (39-54)', band: 'Below Average' },
        F: { color: '#ef8023', label: 'F (21-38)', band: 'Poor' },
        G: { color: '#e9153b', label: 'G (1-20)', band: 'Very Poor' }
    };

    // ========================================================================
    // PRICE GUIDE STYLES - British pricing conventions
    // ========================================================================

    const PRICE_STYLES = {
        guidePrice: { prefix: 'Guide Price', format: '£{price}' },
        offersOver: { prefix: 'Offers Over', format: '£{price}' },
        offersInRegion: { prefix: 'OIRO', format: '£{price}', fullText: 'Offers In Region Of' },
        fixedPrice: { prefix: '', format: '£{price}' },
        poa: { prefix: '', format: 'Price On Application' },
        offersInvited: { prefix: '', format: 'Offers Invited' },
        auctionGuide: { prefix: 'Auction Guide', format: '£{price}*' },
        from: { prefix: 'From', format: '£{price}' },
        // Rental
        pcm: { prefix: '', format: '£{price} pcm', fullText: 'Per Calendar Month' },
        pw: { prefix: '', format: '£{price} pw', fullText: 'Per Week' },
        billsIncluded: { prefix: '', format: '£{price} pcm (bills inc.)' }
    };

    // ========================================================================
    // CORNER RIBBONS - Like Rightmove/Zoopla use
    // ========================================================================

    function createCornerRibbon(text, color = '#dc2626', position = 'top-left') {
        const ribbon = document.createElement('div');
        ribbon.className = `property-ribbon ribbon-${position}`;
        ribbon.innerHTML = `<span>${text}</span>`;

        const isLeft = position.includes('left');
        const isTop = position.includes('top');

        ribbon.style.cssText = `
            position: absolute;
            ${isTop ? 'top: 0' : 'bottom: 0'};
            ${isLeft ? 'left: 0' : 'right: 0'};
            width: 150px;
            height: 150px;
            overflow: hidden;
            pointer-events: none;
            z-index: 100;
        `;

        const span = ribbon.querySelector('span');
        span.style.cssText = `
            position: absolute;
            display: block;
            width: 225px;
            padding: 10px 0;
            background: ${color};
            color: white;
            text-align: center;
            font-weight: 600;
            font-size: 12px;
            letter-spacing: 1px;
            text-transform: uppercase;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            ${isTop ? 'top: 30px' : 'bottom: 30px'};
            ${isLeft ? 'left: -60px; transform: rotate(-45deg)' : 'right: -60px; transform: rotate(45deg)'};
        `;

        return ribbon;
    }

    // ========================================================================
    // STATUS BADGE ELEMENT
    // ========================================================================

    function createStatusBadge(type, style = 'pill') {
        const badge = STATUS_BADGES[type] || TENURE_BADGES[type];
        if (!badge) return null;

        const el = document.createElement('div');
        el.className = `property-badge badge-${style}`;
        el.setAttribute('data-badge-type', type);

        if (style === 'pill') {
            el.style.cssText = `
                display: inline-block;
                padding: 6px 16px;
                background: ${badge.color};
                color: white;
                font-weight: 600;
                font-size: 12px;
                letter-spacing: 0.5px;
                border-radius: 20px;
                text-transform: uppercase;
            `;
        } else if (style === 'square') {
            el.style.cssText = `
                display: inline-block;
                padding: 8px 14px;
                background: ${badge.color};
                color: white;
                font-weight: 700;
                font-size: 11px;
                letter-spacing: 1px;
                text-transform: uppercase;
            `;
        } else if (style === 'outline') {
            el.style.cssText = `
                display: inline-block;
                padding: 6px 14px;
                background: transparent;
                color: ${badge.color};
                font-weight: 600;
                font-size: 12px;
                letter-spacing: 0.5px;
                border: 2px solid ${badge.color};
                border-radius: 4px;
                text-transform: uppercase;
            `;
        }

        el.textContent = badge.text;
        el.title = badge.description;

        return el;
    }

    // ========================================================================
    // EPC BADGE - The rainbow one everyone knows
    // ========================================================================

    function createEPCBadge(rating, style = 'full') {
        const ratingUpper = rating.toUpperCase();
        const epc = EPC_RATINGS[ratingUpper];
        if (!epc) return null;

        const el = document.createElement('div');
        el.className = 'epc-badge';
        el.setAttribute('data-epc-rating', ratingUpper);

        if (style === 'full') {
            // Full EPC chart style
            el.style.cssText = `
                display: inline-block;
                font-family: Arial, sans-serif;
                background: white;
                border: 1px solid #ddd;
                border-radius: 4px;
                overflow: hidden;
            `;

            let html = '<div style="padding: 8px 12px; background: #f5f5f5; border-bottom: 1px solid #ddd; font-weight: 600; font-size: 11px;">Energy Rating</div>';
            html += '<div style="padding: 8px;">';

            Object.entries(EPC_RATINGS).forEach(([letter, data]) => {
                const isActive = letter === ratingUpper;
                const width = 100 - (letter.charCodeAt(0) - 65) * 10;
                html += `
                    <div style="display: flex; align-items: center; margin: 2px 0;">
                        <div style="width: ${width}%; background: ${data.color}; color: white; padding: 2px 6px; font-size: 10px; font-weight: ${isActive ? '700' : '400'}; ${isActive ? 'box-shadow: 0 0 0 2px #333;' : ''}">
                            ${letter}
                        </div>
                        ${isActive ? '<span style="margin-left: 8px; font-size: 10px; font-weight: 600;">◄ Current</span>' : ''}
                    </div>
                `;
            });

            html += '</div>';
            el.innerHTML = html;
        } else if (style === 'compact') {
            // Just the letter badge
            el.style.cssText = `
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 6px 12px;
                background: ${epc.color};
                color: white;
                font-weight: 700;
                font-size: 14px;
                border-radius: 4px;
            `;
            el.innerHTML = `<span>EPC</span><span style="font-size: 18px;">${ratingUpper}</span>`;
        } else if (style === 'mini') {
            el.style.cssText = `
                display: inline-block;
                width: 28px;
                height: 28px;
                line-height: 28px;
                text-align: center;
                background: ${epc.color};
                color: white;
                font-weight: 700;
                font-size: 14px;
                border-radius: 4px;
            `;
            el.textContent = ratingUpper;
        }

        return el;
    }

    // ========================================================================
    // PRICE BANNER - British style
    // ========================================================================

    function createPriceBanner(price, style = 'guidePrice', options = {}) {
        const priceStyle = PRICE_STYLES[style] || PRICE_STYLES.fixedPrice;

        const el = document.createElement('div');
        el.className = 'price-banner';

        const bgColor = options.bgColor || '#1a365d';
        const textColor = options.textColor || '#ffffff';
        const accentColor = options.accentColor || '#d4af37';

        el.style.cssText = `
            display: inline-block;
            background: ${bgColor};
            color: ${textColor};
            padding: 12px 24px;
            text-align: center;
            font-family: Georgia, serif;
        `;

        let formattedPrice = priceStyle.format.replace('{price}', formatBritishPrice(price));

        el.innerHTML = `
            ${priceStyle.prefix ? `<div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; opacity: 0.9;">${priceStyle.prefix}</div>` : ''}
            <div style="font-size: 24px; font-weight: 700; color: ${accentColor};">${formattedPrice}</div>
            ${priceStyle.fullText && priceStyle.fullText !== priceStyle.prefix ? `<div style="font-size: 9px; margin-top: 4px; opacity: 0.7;">${priceStyle.fullText}</div>` : ''}
        `;

        return el;
    }

    // ========================================================================
    // COUNCIL TAX BAND - Important for buyers!
    // ========================================================================

    function createCouncilTaxBadge(band) {
        const el = document.createElement('div');
        el.className = 'council-tax-badge';
        el.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 14px;
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 13px;
        `;
        el.innerHTML = `
            <span style="color: #6b7280;">Council Tax Band:</span>
            <span style="font-weight: 700; color: #1f2937;">${band.toUpperCase()}</span>
        `;
        return el;
    }

    // ========================================================================
    // KEY FEATURES BLOCK - British style
    // ========================================================================

    function createKeyFeaturesBlock(features, style = 'ticks') {
        const el = document.createElement('div');
        el.className = 'key-features-block';
        el.style.cssText = `
            padding: 16px;
            background: #f9fafb;
            border-radius: 8px;
        `;

        let html = '<div style="font-weight: 600; font-size: 14px; margin-bottom: 12px; color: #1f2937;">Key Features</div>';
        html += '<ul style="list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">';

        features.forEach(feature => {
            const icon = style === 'ticks' ? '✓' : style === 'bullets' ? '•' : '→';
            html += `
                <li style="display: flex; align-items: flex-start; gap: 8px; font-size: 13px; color: #374151;">
                    <span style="color: #059669; font-weight: 700;">${icon}</span>
                    <span>${feature}</span>
                </li>
            `;
        });

        html += '</ul>';
        el.innerHTML = html;
        return el;
    }

    // ========================================================================
    // BRITISH FEATURE SUGGESTIONS - What agents always mention
    // ========================================================================

    const BRITISH_FEATURES = {
        property: [
            'Period property', 'Character features', 'Original features retained',
            'Recently refurbished', 'Well-presented throughout', 'Deceptively spacious',
            'Viewing essential', 'Rarely available', 'Immaculate condition',
            'Thoughtfully extended', 'Tastefully decorated', 'Ready to move into'
        ],
        rooms: [
            'Reception room', 'Lounge', 'Dining room', 'Kitchen/diner',
            'Utility room', 'Conservatory', 'Study', 'Home office',
            'En-suite', 'Family bathroom', 'Cloakroom', 'WC'
        ],
        outside: [
            'South-facing garden', 'Private rear garden', 'Low maintenance garden',
            'Landscaped gardens', 'Mature garden', 'Patio area', 'Decking',
            'Off-road parking', 'Driveway', 'Garage', 'Double garage',
            'Allocated parking', 'Permit parking available'
        ],
        location: [
            'Quiet cul-de-sac', 'Popular location', 'Sought-after area',
            'Walking distance to station', 'Close to local amenities',
            'Good school catchment', 'Outstanding school nearby',
            'Tree-lined street', 'Conservation area'
        ],
        heating: [
            'Gas central heating', 'Double glazed throughout', 'UPVC double glazing',
            'Recently fitted boiler', 'Underfloor heating', 'Smart heating controls'
        ]
    };

    // ========================================================================
    // HELPER FUNCTIONS
    // ========================================================================

    function formatBritishPrice(price) {
        if (typeof price === 'string') {
            price = parseInt(price.replace(/[^0-9]/g, ''));
        }
        return price.toLocaleString('en-GB');
    }

    // ========================================================================
    // RENDER BADGES PANEL FOR EDITOR
    // ========================================================================

    function renderBadgesPanel() {
        const container = document.getElementById('badgesContainer') ||
                         document.getElementById('prebuiltSectionsContainer');
        if (!container) return;

        let html = `
            <div class="badges-panel">
                <h4 style="margin: 0 0 12px 0; font-size: 13px; color: #374151;">Property Badges</h4>

                <div class="badge-category">
                    <div style="font-size: 11px; color: #6b7280; margin-bottom: 8px;">Status</div>
                    <div class="badge-grid" style="display: flex; flex-wrap: wrap; gap: 6px;">
                        ${Object.keys(STATUS_BADGES).map(key => `
                            <button class="badge-btn" onclick="BritishBadges.addBadge('${key}')"
                                    style="padding: 4px 10px; font-size: 10px; background: ${STATUS_BADGES[key].color}; color: white; border: none; border-radius: 12px; cursor: pointer;">
                                ${STATUS_BADGES[key].text}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="badge-category" style="margin-top: 12px;">
                    <div style="font-size: 11px; color: #6b7280; margin-bottom: 8px;">Tenure</div>
                    <div class="badge-grid" style="display: flex; flex-wrap: wrap; gap: 6px;">
                        ${Object.keys(TENURE_BADGES).map(key => `
                            <button class="badge-btn" onclick="BritishBadges.addBadge('${key}')"
                                    style="padding: 4px 10px; font-size: 10px; background: ${TENURE_BADGES[key].color}; color: white; border: none; border-radius: 12px; cursor: pointer;">
                                ${TENURE_BADGES[key].text}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="badge-category" style="margin-top: 12px;">
                    <div style="font-size: 11px; color: #6b7280; margin-bottom: 8px;">EPC Rating</div>
                    <div class="badge-grid" style="display: flex; gap: 4px;">
                        ${Object.keys(EPC_RATINGS).map(letter => `
                            <button class="epc-btn" onclick="BritishBadges.addEPC('${letter}')"
                                    style="width: 26px; height: 26px; font-size: 11px; font-weight: 700; background: ${EPC_RATINGS[letter].color}; color: white; border: none; border-radius: 4px; cursor: pointer;">
                                ${letter}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="badge-category" style="margin-top: 12px;">
                    <div style="font-size: 11px; color: #6b7280; margin-bottom: 8px;">Corner Ribbon</div>
                    <div style="display: flex; gap: 6px;">
                        <button onclick="BritishBadges.addRibbon('NEW', '#dc2626')"
                                style="padding: 4px 10px; font-size: 10px; background: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            NEW
                        </button>
                        <button onclick="BritishBadges.addRibbon('SOLD', '#6b7280')"
                                style="padding: 4px 10px; font-size: 10px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            SOLD
                        </button>
                        <button onclick="BritishBadges.addRibbon('REDUCED', '#b45309')"
                                style="padding: 4px 10px; font-size: 10px; background: #b45309; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            REDUCED
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Append or replace
        const existing = container.querySelector('.badges-panel');
        if (existing) {
            existing.outerHTML = html;
        } else {
            container.insertAdjacentHTML('beforeend', html);
        }
    }

    // ========================================================================
    // ADD BADGE TO CANVAS
    // ========================================================================

    function addBadgeToCanvas(type) {
        const badge = createStatusBadge(type, 'pill');
        if (!badge) return;

        // Find canvas and add
        const canvas = document.querySelector('.page-canvas, #brochureCanvas, .brochure-canvas');
        if (canvas) {
            badge.style.position = 'absolute';
            badge.style.left = '50px';
            badge.style.top = '50px';
            badge.style.cursor = 'move';
            badge.classList.add('draggable-element', 'brochure-element');
            canvas.appendChild(badge);

            // Make draggable if drag system exists
            if (window.ElementDrag) {
                window.ElementDrag.makeElementDraggable(badge);
            }
        }
    }

    function addEPCToCanvas(rating) {
        const epc = createEPCBadge(rating, 'compact');
        if (!epc) return;

        const canvas = document.querySelector('.page-canvas, #brochureCanvas, .brochure-canvas');
        if (canvas) {
            epc.style.position = 'absolute';
            epc.style.left = '50px';
            epc.style.top = '100px';
            epc.style.cursor = 'move';
            epc.classList.add('draggable-element', 'brochure-element');
            canvas.appendChild(epc);

            if (window.ElementDrag) {
                window.ElementDrag.makeElementDraggable(epc);
            }
        }
    }

    function addRibbonToCanvas(text, color) {
        const canvas = document.querySelector('.page-canvas, #brochureCanvas, .brochure-canvas');
        if (canvas) {
            const ribbon = createCornerRibbon(text, color, 'top-left');
            ribbon.classList.add('brochure-element');
            canvas.style.position = 'relative';
            canvas.appendChild(ribbon);
        }
    }

    // ========================================================================
    // EXPORT
    // ========================================================================

    window.BritishBadges = {
        STATUS_BADGES,
        TENURE_BADGES,
        EPC_RATINGS,
        PRICE_STYLES,
        BRITISH_FEATURES,
        createStatusBadge,
        createEPCBadge,
        createPriceBanner,
        createCornerRibbon,
        createCouncilTaxBadge,
        createKeyFeaturesBlock,
        formatBritishPrice,
        renderPanel: renderBadgesPanel,
        addBadge: addBadgeToCanvas,
        addEPC: addEPCToCanvas,
        addRibbon: addRibbonToCanvas
    };

    console.log('British Property Badges loaded - proper estate agent stuff');

})();
