/**
 * British Property Features
 * All the proper stuff estate agents need
 *
 * - Floorplan integration
 * - Schools & Ofsted
 * - Transport links
 * - Stamp duty calculator
 * - British description phrases
 * - Local amenities
 *
 * "If it doesn't have the school catchment, it's not a proper brochure" - Old British Man
 */

(function() {
    'use strict';

    // ========================================================================
    // STAMP DUTY CALCULATOR (2024/25 rates)
    // ========================================================================

    const STAMP_DUTY = {
        // Standard rates (England & NI)
        standard: [
            { threshold: 250000, rate: 0 },
            { threshold: 925000, rate: 0.05 },
            { threshold: 1500000, rate: 0.10 },
            { threshold: Infinity, rate: 0.12 }
        ],
        // First-time buyer rates
        firstTimeBuyer: [
            { threshold: 425000, rate: 0 },
            { threshold: 625000, rate: 0.05 },
            // Above £625k, standard rates apply
        ],
        // Additional property surcharge
        additionalProperty: 0.03,
        // First-time buyer max price for relief
        ftbMaxPrice: 625000
    };

    function calculateStampDuty(price, options = {}) {
        const isFirstTimeBuyer = options.firstTimeBuyer || false;
        const isAdditionalProperty = options.additionalProperty || false;

        let tax = 0;
        let bands = STAMP_DUTY.standard;

        // First-time buyers get better rates (up to £625k)
        if (isFirstTimeBuyer && price <= STAMP_DUTY.ftbMaxPrice) {
            bands = STAMP_DUTY.firstTimeBuyer;
        }

        let previousThreshold = 0;
        for (const band of bands) {
            if (price > previousThreshold) {
                const taxableInBand = Math.min(price, band.threshold) - previousThreshold;
                tax += taxableInBand * band.rate;
            }
            previousThreshold = band.threshold;
            if (price <= band.threshold) break;
        }

        // Additional property surcharge
        if (isAdditionalProperty) {
            tax += price * STAMP_DUTY.additionalProperty;
        }

        return {
            price: price,
            tax: Math.round(tax),
            isFirstTimeBuyer,
            isAdditionalProperty,
            effectiveRate: ((tax / price) * 100).toFixed(2) + '%'
        };
    }

    function createStampDutyWidget(price, options = {}) {
        const result = calculateStampDuty(price, options);

        const el = document.createElement('div');
        el.className = 'stamp-duty-widget';
        el.style.cssText = `
            background: #f8f9fa;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        `;

        el.innerHTML = `
            <div style="font-weight: 600; font-size: 13px; color: #374151; margin-bottom: 12px;">
                Stamp Duty Estimate
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <span style="color: #6b7280; font-size: 12px;">Property Price:</span>
                <span style="font-weight: 600;">£${price.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid #e2e8f0;">
                <span style="color: #374151; font-weight: 600;">Stamp Duty:</span>
                <span style="font-size: 18px; font-weight: 700; color: #1a365d;">£${result.tax.toLocaleString()}</span>
            </div>
            <div style="font-size: 10px; color: #9ca3af; margin-top: 8px;">
                ${result.isFirstTimeBuyer ? 'First-time buyer rates applied' : 'Standard rates'}
                ${result.isAdditionalProperty ? ' + 3% surcharge' : ''}
            </div>
        `;

        return el;
    }

    // ========================================================================
    // SCHOOL CATCHMENT SECTION
    // ========================================================================

    const OFSTED_RATINGS = {
        1: { text: 'Outstanding', color: '#059669', icon: '★★★★' },
        2: { text: 'Good', color: '#2563eb', icon: '★★★' },
        3: { text: 'Requires Improvement', color: '#d97706', icon: '★★' },
        4: { text: 'Inadequate', color: '#dc2626', icon: '★' }
    };

    function createSchoolSection(schools) {
        const el = document.createElement('div');
        el.className = 'schools-section';
        el.style.cssText = `
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
        `;

        let html = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a365d" stroke-width="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
                </svg>
                <span style="font-weight: 600; font-size: 14px; color: #1f2937;">Local Schools</span>
            </div>
        `;

        if (schools && schools.length > 0) {
            html += '<div style="display: flex; flex-direction: column; gap: 8px;">';
            schools.forEach(school => {
                const ofsted = OFSTED_RATINGS[school.ofsted] || { text: 'Not Rated', color: '#6b7280', icon: '' };
                html += `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #f9fafb; border-radius: 6px;">
                        <div>
                            <div style="font-weight: 500; font-size: 12px; color: #374151;">${school.name}</div>
                            <div style="font-size: 10px; color: #6b7280;">${school.type || 'School'} • ${school.distance || '?'} miles</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 11px; font-weight: 600; color: ${ofsted.color};">${ofsted.text}</div>
                            <div style="font-size: 10px; color: ${ofsted.color};">${ofsted.icon}</div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        } else {
            html += '<div style="font-size: 12px; color: #6b7280; text-align: center; padding: 12px;">School data not available</div>';
        }

        el.innerHTML = html;
        return el;
    }

    // ========================================================================
    // TRANSPORT LINKS SECTION
    // ========================================================================

    const TRANSPORT_ICONS = {
        train: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="3" width="16" height="16" rx="2"/>
            <path d="M4 11h16"/>
            <circle cx="8.5" cy="15.5" r="1.5"/>
            <circle cx="15.5" cy="15.5" r="1.5"/>
            <path d="M8 19l-2 3"/><path d="M16 19l2 3"/>
        </svg>`,
        tube: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
            <rect x="6" y="10" width="12" height="4" rx="1"/>
        </svg>`,
        bus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="4" width="16" height="14" rx="2"/>
            <path d="M4 10h16"/>
            <circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/>
            <path d="M4 18v2"/><path d="M20 18v2"/>
        </svg>`,
        walk: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="5" r="2"/>
            <path d="M10 22l2-7 2 7"/>
            <path d="M10 13l-2 2"/>
            <path d="M14 13l2 2"/>
            <path d="M10 9l2 6 2-6"/>
        </svg>`
    };

    function createTransportSection(transport) {
        const el = document.createElement('div');
        el.className = 'transport-section';
        el.style.cssText = `
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
        `;

        let html = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                ${TRANSPORT_ICONS.train.replace('currentColor', '#1a365d')}
                <span style="font-weight: 600; font-size: 14px; color: #1f2937;">Transport Links</span>
            </div>
        `;

        if (transport && transport.length > 0) {
            html += '<div style="display: flex; flex-direction: column; gap: 6px;">';
            transport.forEach(link => {
                const icon = TRANSPORT_ICONS[link.type] || TRANSPORT_ICONS.train;
                html += `
                    <div style="display: flex; align-items: center; gap: 10px; padding: 6px 8px; background: #f9fafb; border-radius: 4px;">
                        <span style="color: #4b5563;">${icon}</span>
                        <div style="flex: 1;">
                            <span style="font-size: 12px; font-weight: 500; color: #374151;">${link.name}</span>
                        </div>
                        <div style="text-align: right;">
                            <span style="font-size: 11px; color: #6b7280;">${link.distance}</span>
                            ${link.walkTime ? `<span style="font-size: 10px; color: #9ca3af;"> (${link.walkTime} walk)</span>` : ''}
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        } else {
            html += '<div style="font-size: 12px; color: #6b7280; text-align: center; padding: 12px;">Transport links not available</div>';
        }

        el.innerHTML = html;
        return el;
    }

    // ========================================================================
    // LOCAL AMENITIES SECTION
    // ========================================================================

    const AMENITY_ICONS = {
        supermarket: '🛒',
        cafe: '☕',
        restaurant: '🍽️',
        pub: '🍺',
        park: '🌳',
        gym: '💪',
        pharmacy: '💊',
        postOffice: '📮',
        bank: '🏦',
        doctor: '🏥'
    };

    function createAmenitiesSection(amenities) {
        const el = document.createElement('div');
        el.className = 'amenities-section';
        el.style.cssText = `
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
        `;

        let html = `
            <div style="font-weight: 600; font-size: 14px; color: #1f2937; margin-bottom: 12px;">
                🏪 Local Amenities
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
        `;

        if (amenities) {
            Object.entries(amenities).forEach(([type, data]) => {
                const icon = AMENITY_ICONS[type] || '📍';
                const name = data.name || type;
                const distance = data.distance || '?';
                html += `
                    <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: #f9fafb; border-radius: 6px;">
                        <span style="font-size: 16px;">${icon}</span>
                        <div>
                            <div style="font-size: 11px; font-weight: 500; color: #374151;">${name}</div>
                            <div style="font-size: 10px; color: #6b7280;">${distance}</div>
                        </div>
                    </div>
                `;
            });
        }

        html += '</div>';
        el.innerHTML = html;
        return el;
    }

    // ========================================================================
    // BRITISH DESCRIPTION PHRASES - The classics!
    // ========================================================================

    const BRITISH_PHRASES = {
        // Property condition
        condition: [
            'Immaculate condition throughout',
            'Well-presented family home',
            'Tastefully decorated',
            'Beautifully maintained',
            'Recently refurbished to a high standard',
            'Lovingly maintained by current owners',
            'In need of modernisation',
            'Ready to move into',
            'Offering potential to extend (STPP)'
        ],
        // Size/space
        space: [
            'Deceptively spacious',
            'Generous proportions',
            'Well-proportioned rooms',
            'Bright and airy throughout',
            'Excellent storage throughout',
            'Flexible living accommodation',
            'Perfect for entertaining'
        ],
        // Location
        location: [
            'Sought-after location',
            'Popular residential area',
            'Quiet cul-de-sac position',
            'Tree-lined street',
            'Walking distance to local amenities',
            'Convenient for schools',
            'Close to excellent transport links',
            'Within catchment of outstanding schools'
        ],
        // Call to action
        cta: [
            'Viewing essential',
            'Must be viewed to be appreciated',
            'Internal inspection highly recommended',
            'Early viewing recommended',
            'Rarely available',
            'Dont miss this opportunity',
            'Offered with no onward chain',
            'Chain free'
        ],
        // Garden
        garden: [
            'South-facing rear garden',
            'Generous private garden',
            'Mature and well-stocked garden',
            'Low maintenance garden',
            'Landscaped rear garden',
            'Secluded garden',
            'Wrap-around garden'
        ],
        // Character
        character: [
            'Period features throughout',
            'Retaining original character',
            'Charming character property',
            'Full of period charm',
            'Original features include...',
            'Exposed beams and fireplaces',
            'Victorian elegance'
        ],
        // Parking
        parking: [
            'Off-road parking',
            'Driveway providing parking',
            'Garage and driveway',
            'Double garage',
            'Residents parking permit',
            'Ample parking'
        ]
    };

    function getRandomPhrase(category) {
        const phrases = BRITISH_PHRASES[category];
        if (!phrases) return '';
        return phrases[Math.floor(Math.random() * phrases.length)];
    }

    function generateBritishDescription(property) {
        const parts = [];

        // Opening based on property type
        if (property.bedrooms >= 4) {
            parts.push('A substantial family home');
        } else if (property.bedrooms >= 3) {
            parts.push('An attractive family property');
        } else if (property.bedrooms >= 2) {
            parts.push('A well-proportioned property');
        } else {
            parts.push('A charming property');
        }

        // Condition
        parts.push(getRandomPhrase('condition').toLowerCase());

        // Location
        if (property.location) {
            parts.push(`situated in a ${getRandomPhrase('location').toLowerCase()}`);
        }

        // Space
        parts.push(`The accommodation is ${getRandomPhrase('space').toLowerCase()}`);

        // Garden if applicable
        if (property.hasGarden) {
            parts.push(`and benefits from a ${getRandomPhrase('garden').toLowerCase()}`);
        }

        // CTA
        parts.push(`. ${getRandomPhrase('cta')}.`);

        return parts.join(', ').replace(', .', '.');
    }

    function createPhrasePanel() {
        const el = document.createElement('div');
        el.className = 'phrase-panel';
        el.style.cssText = `
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            max-height: 400px;
            overflow-y: auto;
        `;

        let html = `
            <div style="font-weight: 600; font-size: 14px; color: #1f2937; margin-bottom: 12px;">
                📝 Estate Agent Phrases
            </div>
            <div style="font-size: 11px; color: #6b7280; margin-bottom: 12px;">Click to copy</div>
        `;

        Object.entries(BRITISH_PHRASES).forEach(([category, phrases]) => {
            const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
            html += `
                <div style="margin-bottom: 12px;">
                    <div style="font-size: 11px; font-weight: 600; color: #4b5563; margin-bottom: 6px; text-transform: uppercase;">${categoryTitle}</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            `;
            phrases.forEach(phrase => {
                html += `
                    <button onclick="navigator.clipboard.writeText('${phrase}'); this.style.background='#059669'; this.style.color='white'; setTimeout(() => { this.style.background='#f3f4f6'; this.style.color='#374151'; }, 500);"
                            style="padding: 4px 8px; font-size: 10px; background: #f3f4f6; border: none; border-radius: 4px; cursor: pointer; color: #374151; transition: all 0.2s;">
                        ${phrase}
                    </button>
                `;
            });
            html += '</div></div>';
        });

        el.innerHTML = html;
        return el;
    }

    // ========================================================================
    // FLOORPLAN INTEGRATION
    // ========================================================================

    function createFloorplanUploader(onUpload) {
        const el = document.createElement('div');
        el.className = 'floorplan-uploader';
        el.style.cssText = `
            background: #f9fafb;
            border: 2px dashed #d1d5db;
            border-radius: 8px;
            padding: 24px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
        `;

        el.innerHTML = `
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" style="margin: 0 auto 8px;">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18"/>
                <path d="M9 3v18"/>
            </svg>
            <div style="font-weight: 500; color: #374151; margin-bottom: 4px;">Upload Floorplan</div>
            <div style="font-size: 12px; color: #6b7280;">Click or drag & drop</div>
            <input type="file" accept="image/*,.pdf" style="display: none;">
        `;

        const input = el.querySelector('input');

        el.addEventListener('click', () => input.click());
        el.addEventListener('dragover', (e) => {
            e.preventDefault();
            el.style.borderColor = '#2563eb';
            el.style.background = '#eff6ff';
        });
        el.addEventListener('dragleave', () => {
            el.style.borderColor = '#d1d5db';
            el.style.background = '#f9fafb';
        });
        el.addEventListener('drop', (e) => {
            e.preventDefault();
            el.style.borderColor = '#d1d5db';
            el.style.background = '#f9fafb';
            const file = e.dataTransfer.files[0];
            if (file && onUpload) onUpload(file);
        });
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && onUpload) onUpload(file);
        });

        return el;
    }

    function addFloorplanToCanvas(file) {
        const canvas = document.querySelector('.page-canvas, #brochureCanvas, .brochure-canvas');
        if (!canvas) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.cssText = `
                position: absolute;
                left: 50px;
                top: 50px;
                max-width: 80%;
                max-height: 60%;
                border: 1px solid #e2e8f0;
                cursor: move;
            `;
            img.className = 'floorplan-image draggable-element brochure-element';

            canvas.appendChild(img);

            if (window.ElementDrag) {
                window.ElementDrag.makeElementDraggable(img);
            }

            showToast('Floorplan added!');
        };
        reader.readAsDataURL(file);
    }

    // ========================================================================
    // COMBINED PROPERTY INFO PANEL
    // ========================================================================

    function createPropertyInfoPanel(propertyData) {
        const el = document.createElement('div');
        el.className = 'property-info-panel';
        el.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 16px;
        `;

        // Schools
        if (propertyData.schools) {
            el.appendChild(createSchoolSection(propertyData.schools));
        }

        // Transport
        if (propertyData.transport) {
            el.appendChild(createTransportSection(propertyData.transport));
        }

        // Amenities
        if (propertyData.amenities) {
            el.appendChild(createAmenitiesSection(propertyData.amenities));
        }

        // Stamp duty
        if (propertyData.price) {
            el.appendChild(createStampDutyWidget(propertyData.price, {
                firstTimeBuyer: propertyData.firstTimeBuyer,
                additionalProperty: propertyData.additionalProperty
            }));
        }

        return el;
    }

    // ========================================================================
    // HELPER
    // ========================================================================

    function showToast(message) {
        if (typeof window.showToast === 'function') {
            window.showToast(message);
        } else {
            console.log(message);
        }
    }

    // ========================================================================
    // RENDER FEATURES PANEL IN EDITOR
    // ========================================================================

    function renderFeaturesPanel() {
        const container = document.getElementById('propertFeaturesContainer') ||
                         document.getElementById('elementsContainer');
        if (!container) {
            console.log('Features panel container not found');
            return;
        }

        let html = `
            <div class="british-features-panel" style="padding: 12px;">
                <h4 style="margin: 0 0 12px 0; font-size: 13px; color: #374151;">Property Features</h4>

                <!-- Floorplan Upload -->
                <div style="margin-bottom: 16px;">
                    <div style="font-size: 11px; color: #6b7280; margin-bottom: 6px;">Floorplan</div>
                    <div id="floorplanUploader"></div>
                </div>

                <!-- Stamp Duty Calculator -->
                <div style="margin-bottom: 16px;">
                    <div style="font-size: 11px; color: #6b7280; margin-bottom: 6px;">Stamp Duty Calculator</div>
                    <div style="display: flex; gap: 6px; margin-bottom: 8px;">
                        <input type="number" id="stampDutyPrice" placeholder="Price (£)"
                               style="flex: 1; padding: 6px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 12px;">
                        <button onclick="BritishFeatures.showStampDuty()"
                                style="padding: 6px 12px; background: #1a365d; color: white; border: none; border-radius: 4px; font-size: 11px; cursor: pointer;">
                            Calculate
                        </button>
                    </div>
                    <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                        <label style="font-size: 10px; color: #6b7280; display: flex; align-items: center; gap: 4px;">
                            <input type="checkbox" id="ftbCheckbox"> First-time buyer
                        </label>
                        <label style="font-size: 10px; color: #6b7280; display: flex; align-items: center; gap: 4px;">
                            <input type="checkbox" id="additionalCheckbox"> Additional property
                        </label>
                    </div>
                    <div id="stampDutyResult"></div>
                </div>

                <!-- Description Generator -->
                <div style="margin-bottom: 16px;">
                    <div style="font-size: 11px; color: #6b7280; margin-bottom: 6px;">Quick Phrases</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px;" id="quickPhrases">
                        ${['Chain Free', 'Viewing Essential', 'Must Be Seen', 'Rarely Available', 'No Onward Chain'].map(p =>
                            `<button onclick="navigator.clipboard.writeText('${p}')"
                                    style="padding: 3px 8px; font-size: 10px; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 12px; cursor: pointer;">
                                ${p}
                            </button>`
                        ).join('')}
                    </div>
                </div>

                <!-- Full Phrase Library -->
                <details style="margin-bottom: 16px;">
                    <summary style="font-size: 11px; color: #6b7280; cursor: pointer; margin-bottom: 8px;">
                        📝 All Estate Agent Phrases
                    </summary>
                    <div id="phraseLibrary" style="max-height: 200px; overflow-y: auto;"></div>
                </details>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', html);

        // Initialize floorplan uploader
        const uploaderContainer = document.getElementById('floorplanUploader');
        if (uploaderContainer) {
            uploaderContainer.appendChild(createFloorplanUploader(addFloorplanToCanvas));
        }

        // Initialize phrase library
        const phraseLib = document.getElementById('phraseLibrary');
        if (phraseLib) {
            phraseLib.appendChild(createPhrasePanel());
        }
    }

    function showStampDutyCalculation() {
        const priceInput = document.getElementById('stampDutyPrice');
        const resultDiv = document.getElementById('stampDutyResult');
        const ftb = document.getElementById('ftbCheckbox')?.checked;
        const additional = document.getElementById('additionalCheckbox')?.checked;

        if (!priceInput || !resultDiv) return;

        const price = parseInt(priceInput.value);
        if (isNaN(price) || price <= 0) {
            resultDiv.innerHTML = '<div style="color: #dc2626; font-size: 11px;">Enter a valid price</div>';
            return;
        }

        const result = calculateStampDuty(price, {
            firstTimeBuyer: ftb,
            additionalProperty: additional
        });

        resultDiv.innerHTML = `
            <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 10px; text-align: center;">
                <div style="font-size: 10px; color: #166534;">Stamp Duty</div>
                <div style="font-size: 20px; font-weight: 700; color: #166534;">£${result.tax.toLocaleString()}</div>
                <div style="font-size: 9px; color: #6b7280;">${result.effectiveRate} effective rate</div>
            </div>
        `;
    }

    // ========================================================================
    // EXPORT
    // ========================================================================

    window.BritishFeatures = {
        // Stamp Duty
        calculateStampDuty,
        createStampDutyWidget,
        showStampDuty: showStampDutyCalculation,

        // Schools
        OFSTED_RATINGS,
        createSchoolSection,

        // Transport
        createTransportSection,

        // Amenities
        createAmenitiesSection,

        // Phrases
        BRITISH_PHRASES,
        getRandomPhrase,
        generateBritishDescription,
        createPhrasePanel,

        // Floorplan
        createFloorplanUploader,
        addFloorplanToCanvas,

        // Combined
        createPropertyInfoPanel,

        // Panel
        renderPanel: renderFeaturesPanel
    };

    // Auto-initialize if DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderFeaturesPanel);
    } else {
        setTimeout(renderFeaturesPanel, 100);
    }

    console.log('British Property Features loaded - all the proper stuff');

})();
