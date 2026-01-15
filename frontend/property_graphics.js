/**
 * Property Graphics Library
 * Ready-to-use graphics for property brochures
 * SOLD badges, icons, decorative elements, floor plan symbols
 */
const PropertyGraphics = (function() {
    'use strict';

    // =========================================================================
    // STATUS BADGES - FOR SALE, SOLD, LET, etc.
    // =========================================================================
    const STATUS_BADGES = {
        for_sale: {
            name: 'For Sale',
            styles: {
                classic: {
                    html: '<div class="badge-for-sale classic">FOR SALE</div>',
                    css: `background: #C20430; color: white; padding: 12px 24px; font-weight: bold; font-size: 14px; letter-spacing: 1px;`
                },
                ribbon: {
                    html: '<div class="badge-ribbon for-sale"><span>FOR SALE</span></div>',
                    css: `position: relative; background: #C20430; color: white; padding: 10px 30px; font-weight: bold; clip-path: polygon(10px 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0 50%);`
                },
                circle: {
                    html: '<div class="badge-circle for-sale"><span>FOR</span><span>SALE</span></div>',
                    css: `width: 80px; height: 80px; border-radius: 50%; background: #C20430; color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; font-weight: bold; font-size: 12px;`
                },
                modern: {
                    html: '<div class="badge-modern for-sale">FOR SALE</div>',
                    css: `background: linear-gradient(135deg, #C20430, #a00328); color: white; padding: 10px 20px; border-radius: 4px; font-weight: 600; font-size: 13px; box-shadow: 0 4px 15px rgba(194,4,48,0.3);`
                },
                minimal: {
                    html: '<div class="badge-minimal for-sale">For Sale</div>',
                    css: `border: 2px solid #C20430; color: #C20430; padding: 8px 16px; font-weight: 500; font-size: 13px;`
                },
                tag: {
                    html: '<div class="badge-tag for-sale">FOR SALE</div>',
                    css: `background: #C20430; color: white; padding: 8px 16px 8px 24px; font-weight: bold; font-size: 12px; clip-path: polygon(15px 0, 100% 0, 100% 100%, 15px 100%, 0 50%);`
                }
            }
        },
        sold: {
            name: 'Sold',
            styles: {
                classic: {
                    html: '<div class="badge-sold classic">SOLD</div>',
                    css: `background: #2ecc71; color: white; padding: 12px 24px; font-weight: bold; font-size: 14px; letter-spacing: 1px;`
                },
                diagonal: {
                    html: '<div class="badge-sold diagonal">SOLD</div>',
                    css: `background: #2ecc71; color: white; padding: 8px 40px; font-weight: bold; transform: rotate(-15deg); font-size: 16px;`
                },
                stamp: {
                    html: '<div class="badge-sold stamp">SOLD</div>',
                    css: `border: 4px solid #2ecc71; color: #2ecc71; padding: 10px 20px; font-weight: bold; font-size: 24px; transform: rotate(-10deg); border-radius: 4px;`
                },
                banner: {
                    html: '<div class="badge-sold banner"><span>SOLD</span></div>',
                    css: `background: #2ecc71; color: white; padding: 15px 50px; font-weight: bold; font-size: 18px; position: relative;`
                },
                stc: {
                    html: '<div class="badge-sold stc">SOLD STC</div>',
                    css: `background: #f39c12; color: white; padding: 10px 20px; font-weight: bold; font-size: 14px; border-radius: 4px;`
                }
            }
        },
        let_agreed: {
            name: 'Let Agreed',
            styles: {
                classic: {
                    html: '<div class="badge-let classic">LET AGREED</div>',
                    css: `background: #3498db; color: white; padding: 12px 24px; font-weight: bold; font-size: 14px;`
                },
                modern: {
                    html: '<div class="badge-let modern">LET AGREED</div>',
                    css: `background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 10px 20px; border-radius: 4px; font-weight: 600;`
                }
            }
        },
        new_instruction: {
            name: 'New Instruction',
            styles: {
                burst: {
                    html: '<div class="badge-new burst">NEW!</div>',
                    css: `background: #e74c3c; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 14px; animation: pulse 2s infinite;`
                },
                tag: {
                    html: '<div class="badge-new tag">NEW INSTRUCTION</div>',
                    css: `background: #e74c3c; color: white; padding: 8px 16px; font-weight: bold; font-size: 12px; border-radius: 20px;`
                }
            }
        },
        price_reduced: {
            name: 'Price Reduced',
            styles: {
                arrow: {
                    html: '<div class="badge-reduced arrow">PRICE REDUCED</div>',
                    css: `background: #9b59b6; color: white; padding: 10px 20px; font-weight: bold; font-size: 13px; position: relative;`
                },
                percent: {
                    html: '<div class="badge-reduced percent"><span class="amount">10%</span><span class="text">REDUCED</span></div>',
                    css: `background: #9b59b6; color: white; padding: 15px; text-align: center; font-weight: bold;`
                }
            }
        },
        coming_soon: {
            name: 'Coming Soon',
            styles: {
                classic: {
                    html: '<div class="badge-coming classic">COMING SOON</div>',
                    css: `background: #34495e; color: white; padding: 10px 20px; font-weight: bold; font-size: 13px;`
                }
            }
        },
        under_offer: {
            name: 'Under Offer',
            styles: {
                classic: {
                    html: '<div class="badge-offer classic">UNDER OFFER</div>',
                    css: `background: #f39c12; color: white; padding: 12px 24px; font-weight: bold; font-size: 14px;`
                }
            }
        }
    };

    // =========================================================================
    // PROPERTY ICONS - Beds, Baths, etc.
    // =========================================================================
    const PROPERTY_ICONS = {
        bedroom: {
            svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm12-3h-8v8H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg>`,
            label: 'Bedrooms'
        },
        bathroom: {
            svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm13 13v-2H4v2h16zM4 11h16c0-4-4-4-4-4H7C3.13 7 4 11 4 11zm3.5 2c-.83 0-1.5.67-1.5 1.5S6.67 16 7.5 16s1.5-.67 1.5-1.5S8.33 13 7.5 13zm9 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/></svg>`,
            label: 'Bathrooms'
        },
        reception: {
            svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 9V7l-2 1.5-2-1.5v2l2 1.5L21 9zm-4 10v-4h-2v6h8v-6h-2v4h-4zm-8-2v-2H3v6h8v-2H7v-2h2zm0-6H5v2h2v2h2V9H7v2zm6-2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`,
            label: 'Receptions'
        },
        parking: {
            svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`,
            label: 'Parking'
        },
        garden: {
            svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.59-1.85-1.43-2.25.84-.4 1.43-1.25 1.43-2.25 0-1.38-1.12-2.5-2.5-2.5-.53 0-1.01.16-1.42.44l.02-.19C14.5 4.12 13.38 3 12 3S9.5 4.12 9.5 5.5l.02.19c-.4-.28-.89-.44-1.42-.44-1.38 0-2.5 1.12-2.5 2.5 0 1 .59 1.85 1.43 2.25-.84.4-1.43 1.25-1.43 2.25zM12 5.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8s1.12-2.5 2.5-2.5zM3 13c0 4.97 4.03 9 9 9 0-4.97-4.03-9-9-9z"/></svg>`,
            label: 'Garden'
        },
        sqft: {
            svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2h2V9h-4v2h2z"/></svg>`,
            label: 'Sq Ft'
        },
        epc: {
            svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>`,
            label: 'EPC Rating'
        },
        council_tax: {
            svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`,
            label: 'Council Tax'
        }
    };

    // =========================================================================
    // DECORATIVE ELEMENTS
    // =========================================================================
    const DECORATIVE = {
        dividers: {
            line_simple: '<div style="width: 100%; height: 2px; background: currentColor;"></div>',
            line_dots: '<div style="width: 100%; height: 2px; background: repeating-linear-gradient(90deg, currentColor 0px, currentColor 4px, transparent 4px, transparent 8px);"></div>',
            diamond: '<div style="display: flex; align-items: center; gap: 10px;"><span style="flex: 1; height: 1px; background: currentColor;"></span><span style="font-size: 8px;">&#9670;</span><span style="flex: 1; height: 1px; background: currentColor;"></span></div>',
            ornate: '<div style="text-align: center; color: currentColor;">&#10022; &#10022; &#10022;</div>',
            wave: '<svg viewBox="0 0 100 10" style="width: 100%; height: 10px;"><path d="M0 5 Q25 0 50 5 T100 5" stroke="currentColor" fill="none" stroke-width="1"/></svg>'
        },
        corners: {
            classic: {
                topLeft: '<svg viewBox="0 0 50 50" style="width: 50px; height: 50px;"><path d="M5 5 L5 45 M5 5 L45 5" stroke="currentColor" fill="none" stroke-width="2"/></svg>',
                topRight: '<svg viewBox="0 0 50 50" style="width: 50px; height: 50px;"><path d="M45 5 L45 45 M45 5 L5 5" stroke="currentColor" fill="none" stroke-width="2"/></svg>',
                bottomLeft: '<svg viewBox="0 0 50 50" style="width: 50px; height: 50px;"><path d="M5 45 L5 5 M5 45 L45 45" stroke="currentColor" fill="none" stroke-width="2"/></svg>',
                bottomRight: '<svg viewBox="0 0 50 50" style="width: 50px; height: 50px;"><path d="M45 45 L45 5 M45 45 L5 45" stroke="currentColor" fill="none" stroke-width="2"/></svg>'
            },
            ornate: {
                topLeft: '<svg viewBox="0 0 60 60"><path d="M5 55 L5 30 Q5 5 30 5 L55 5" stroke="currentColor" fill="none" stroke-width="2"/><circle cx="30" cy="5" r="3" fill="currentColor"/></svg>'
            }
        },
        frames: {
            simple: { border: '2px solid currentColor', padding: '20px' },
            double: { border: '3px double currentColor', padding: '20px' },
            shadow: { border: '1px solid currentColor', boxShadow: '5px 5px 0 currentColor', padding: '20px' }
        }
    };

    // =========================================================================
    // FLOOR PLAN SYMBOLS
    // =========================================================================
    const FLOOR_PLAN_SYMBOLS = {
        door: '<svg viewBox="0 0 24 24"><path d="M19 19V5c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v14H3v2h18v-2h-2zm-2 0H7V5h10v14z" fill="currentColor"/><path d="M9 12h2v2H9z" fill="currentColor"/></svg>',
        window: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1" stroke="currentColor" fill="none" stroke-width="2"/><line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" stroke-width="2"/><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2"/></svg>',
        stairs: '<svg viewBox="0 0 24 24"><path d="M5 20h4v-4h4v-4h4v-4h4v-4" stroke="currentColor" fill="none" stroke-width="2"/></svg>',
        bath: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="14" rx="8" ry="4" stroke="currentColor" fill="none" stroke-width="2"/><path d="M4 14V8c0-2 2-4 4-4" stroke="currentColor" fill="none" stroke-width="2"/></svg>',
        shower: '<svg viewBox="0 0 24 24"><circle cx="12" cy="6" r="4" stroke="currentColor" fill="none" stroke-width="2"/><path d="M8 10L6 20M16 10L18 20M10 10L9 20M14 10L15 20M12 10V20" stroke="currentColor" stroke-width="1.5"/></svg>',
        toilet: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="15" rx="6" ry="4" stroke="currentColor" fill="none" stroke-width="2"/><path d="M6 15V8c0-1 1-2 2-2h8c1 0 2 1 2 2v7" stroke="currentColor" fill="none" stroke-width="2"/></svg>',
        sink: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="8" ry="5" stroke="currentColor" fill="none" stroke-width="2"/><line x1="12" y1="7" x2="12" y2="4" stroke="currentColor" stroke-width="2"/></svg>',
        kitchen_sink: '<svg viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="12" rx="2" stroke="currentColor" fill="none" stroke-width="2"/><rect x="6" y="10" width="5" height="8" rx="1" stroke="currentColor" fill="none" stroke-width="1.5"/><rect x="13" y="10" width="5" height="8" rx="1" stroke="currentColor" fill="none" stroke-width="1.5"/><circle cx="12" cy="5" r="2" stroke="currentColor" fill="none" stroke-width="1.5"/></svg>',
        cooker: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="1" stroke="currentColor" fill="none" stroke-width="2"/><circle cx="8" cy="8" r="2" stroke="currentColor" fill="none" stroke-width="1.5"/><circle cx="16" cy="8" r="2" stroke="currentColor" fill="none" stroke-width="1.5"/><circle cx="8" cy="14" r="2" stroke="currentColor" fill="none" stroke-width="1.5"/><circle cx="16" cy="14" r="2" stroke="currentColor" fill="none" stroke-width="1.5"/></svg>',
        fridge: '<svg viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="1" stroke="currentColor" fill="none" stroke-width="2"/><line x1="6" y1="8" x2="18" y2="8" stroke="currentColor" stroke-width="2"/><line x1="15" y1="4" x2="15" y2="6" stroke="currentColor" stroke-width="2"/><line x1="15" y1="11" x2="15" y2="15" stroke="currentColor" stroke-width="2"/></svg>',
        wardrobe: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="1" stroke="currentColor" fill="none" stroke-width="2"/><line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/></svg>',
        bed_single: '<svg viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="10" rx="1" stroke="currentColor" fill="none" stroke-width="2"/><rect x="6" y="6" width="12" height="4" rx="1" stroke="currentColor" fill="none" stroke-width="1.5"/></svg>',
        bed_double: '<svg viewBox="0 0 24 24"><rect x="2" y="8" width="20" height="10" rx="1" stroke="currentColor" fill="none" stroke-width="2"/><rect x="4" y="6" width="7" height="4" rx="1" stroke="currentColor" fill="none" stroke-width="1.5"/><rect x="13" y="6" width="7" height="4" rx="1" stroke="currentColor" fill="none" stroke-width="1.5"/></svg>',
        sofa: '<svg viewBox="0 0 24 24"><path d="M4 12V9c0-1 1-2 2-2h12c1 0 2 1 2 2v3" stroke="currentColor" fill="none" stroke-width="2"/><rect x="2" y="12" width="20" height="6" rx="1" stroke="currentColor" fill="none" stroke-width="2"/><rect x="4" y="18" width="2" height="2" fill="currentColor"/><rect x="18" y="18" width="2" height="2" fill="currentColor"/></svg>',
        dining_table: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="6" stroke="currentColor" fill="none" stroke-width="2"/></svg>',
        compass: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" stroke-width="2"/><path d="M12 2L12 6M12 18L12 22M2 12L6 12M18 12L22 12" stroke="currentColor" stroke-width="2"/><text x="12" y="9" text-anchor="middle" font-size="6" fill="currentColor">N</text></svg>'
    };

    // =========================================================================
    // UTILITY FUNCTIONS
    // =========================================================================

    /**
     * Create a status badge element
     */
    function createBadge(status, style = 'classic') {
        const badge = STATUS_BADGES[status];
        if (!badge || !badge.styles[style]) {
            console.warn(`Badge not found: ${status}/${style}`);
            return null;
        }

        const container = document.createElement('div');
        container.className = 'property-badge';
        container.innerHTML = badge.styles[style].html;
        container.querySelector('div').style.cssText = badge.styles[style].css;
        return container;
    }

    /**
     * Create a property icon element with value
     */
    function createIcon(type, value, options = {}) {
        const icon = PROPERTY_ICONS[type];
        if (!icon) {
            console.warn(`Icon not found: ${type}`);
            return null;
        }

        const container = document.createElement('div');
        container.className = 'property-icon-item';
        container.style.cssText = `display: flex; align-items: center; gap: 8px; ${options.style || ''}`;

        const iconEl = document.createElement('span');
        iconEl.className = 'property-icon';
        iconEl.innerHTML = icon.svg;
        iconEl.style.cssText = 'width: 24px; height: 24px; display: flex; align-items: center;';

        const valueEl = document.createElement('span');
        valueEl.className = 'property-icon-value';
        valueEl.innerHTML = `<strong>${value}</strong> ${options.showLabel !== false ? icon.label : ''}`;

        container.appendChild(iconEl);
        container.appendChild(valueEl);

        return container;
    }

    /**
     * Create a specs row with multiple icons
     */
    function createSpecsRow(specs, options = {}) {
        const container = document.createElement('div');
        container.className = 'property-specs-row';
        container.style.cssText = `display: flex; gap: 24px; flex-wrap: wrap; ${options.style || ''}`;

        Object.entries(specs).forEach(([type, value]) => {
            if (value) {
                const icon = createIcon(type, value, { showLabel: options.showLabel });
                if (icon) container.appendChild(icon);
            }
        });

        return container;
    }

    /**
     * Create a floor plan symbol
     */
    function createFloorPlanSymbol(type, size = 24) {
        const symbol = FLOOR_PLAN_SYMBOLS[type];
        if (!symbol) return null;

        const container = document.createElement('div');
        container.className = 'floor-plan-symbol';
        container.innerHTML = symbol;
        container.style.cssText = `width: ${size}px; height: ${size}px;`;
        return container;
    }

    /**
     * Create a divider
     */
    function createDivider(type = 'line_simple', color = '#333') {
        const divider = document.createElement('div');
        divider.className = 'property-divider';
        divider.innerHTML = DECORATIVE.dividers[type] || DECORATIVE.dividers.line_simple;
        divider.style.color = color;
        return divider;
    }

    /**
     * Get SVG markup for an icon
     */
    function getIconSVG(type) {
        return PROPERTY_ICONS[type]?.svg || '';
    }

    /**
     * Get all available badge styles for a status
     */
    function getBadgeStyles(status) {
        const badge = STATUS_BADGES[status];
        return badge ? Object.keys(badge.styles) : [];
    }

    /**
     * Get all status types
     */
    function getStatusTypes() {
        return Object.keys(STATUS_BADGES);
    }

    /**
     * Get all icon types
     */
    function getIconTypes() {
        return Object.keys(PROPERTY_ICONS);
    }

    /**
     * Render graphics panel UI
     */
    function showPanel() {
        // Remove existing panel
        const existing = document.querySelector('.property-graphics-panel');
        if (existing) existing.remove();

        const panel = document.createElement('div');
        panel.className = 'property-graphics-panel';
        panel.innerHTML = `
            <div class="graphics-panel-header">
                <h3>Property Graphics</h3>
                <button class="graphics-close-btn">&times;</button>
            </div>
            <div class="graphics-tabs">
                <button class="graphics-tab active" data-tab="badges">Badges</button>
                <button class="graphics-tab" data-tab="icons">Icons</button>
                <button class="graphics-tab" data-tab="decor">Decor</button>
            </div>
            <div class="graphics-content">
                <div class="graphics-tab-content active" data-content="badges">
                    ${renderBadgesGrid()}
                </div>
                <div class="graphics-tab-content" data-content="icons">
                    ${renderIconsGrid()}
                </div>
                <div class="graphics-tab-content" data-content="decor">
                    ${renderDecorGrid()}
                </div>
            </div>
        `;

        // Add styles
        addPanelStyles();

        // Event handlers
        panel.querySelector('.graphics-close-btn').onclick = () => panel.remove();

        panel.querySelectorAll('.graphics-tab').forEach(tab => {
            tab.onclick = () => {
                panel.querySelectorAll('.graphics-tab').forEach(t => t.classList.remove('active'));
                panel.querySelectorAll('.graphics-tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                panel.querySelector(`[data-content="${tab.dataset.tab}"]`).classList.add('active');
            };
        });

        // Make items draggable
        panel.querySelectorAll('.graphic-item').forEach(item => {
            item.draggable = true;
            item.ondragstart = (e) => {
                e.dataTransfer.setData('text/html', item.querySelector('.graphic-preview').innerHTML);
                e.dataTransfer.setData('graphic-type', item.dataset.type);
            };
            item.onclick = () => {
                // Add to canvas
                addToCanvas(item.dataset.type, item.dataset.style);
            };
        });

        document.body.appendChild(panel);
        return panel;
    }

    function renderBadgesGrid() {
        let html = '';
        Object.entries(STATUS_BADGES).forEach(([status, badge]) => {
            html += `<div class="graphic-category"><h4>${badge.name}</h4><div class="graphic-items">`;
            Object.entries(badge.styles).forEach(([style, data]) => {
                html += `
                    <div class="graphic-item" data-type="${status}" data-style="${style}">
                        <div class="graphic-preview">${data.html}</div>
                        <span class="graphic-name">${style}</span>
                    </div>
                `;
            });
            html += '</div></div>';
        });
        return html;
    }

    function renderIconsGrid() {
        let html = '<div class="graphic-items icons-grid">';
        Object.entries(PROPERTY_ICONS).forEach(([type, icon]) => {
            html += `
                <div class="graphic-item icon-item" data-type="${type}">
                    <div class="graphic-preview icon-preview">${icon.svg}</div>
                    <span class="graphic-name">${icon.label}</span>
                </div>
            `;
        });
        html += '</div>';
        return html;
    }

    function renderDecorGrid() {
        let html = '<div class="graphic-category"><h4>Dividers</h4><div class="graphic-items dividers-grid">';
        Object.entries(DECORATIVE.dividers).forEach(([type, divider]) => {
            html += `
                <div class="graphic-item divider-item" data-type="divider" data-style="${type}">
                    <div class="graphic-preview divider-preview">${divider}</div>
                    <span class="graphic-name">${type.replace('_', ' ')}</span>
                </div>
            `;
        });
        html += '</div></div>';

        html += '<div class="graphic-category"><h4>Floor Plan Symbols</h4><div class="graphic-items floor-grid">';
        Object.entries(FLOOR_PLAN_SYMBOLS).forEach(([type, symbol]) => {
            html += `
                <div class="graphic-item floor-item" data-type="floor" data-style="${type}">
                    <div class="graphic-preview floor-preview">${symbol}</div>
                    <span class="graphic-name">${type.replace('_', ' ')}</span>
                </div>
            `;
        });
        html += '</div></div>';

        return html;
    }

    function addToCanvas(type, style) {
        // This will be integrated with the editor
        const event = new CustomEvent('addPropertyGraphic', {
            detail: { type, style }
        });
        document.dispatchEvent(event);
    }

    function addPanelStyles() {
        if (document.getElementById('property-graphics-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'property-graphics-styles';
        styles.textContent = `
            .property-graphics-panel {
                position: fixed;
                right: 20px;
                top: 100px;
                width: 320px;
                max-height: 80vh;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                overflow: hidden;
            }

            .graphics-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid #eee;
            }

            .graphics-panel-header h3 {
                margin: 0;
                font-size: 16px;
            }

            .graphics-close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;
            }

            .graphics-tabs {
                display: flex;
                border-bottom: 1px solid #eee;
            }

            .graphics-tab {
                flex: 1;
                padding: 12px;
                border: none;
                background: none;
                cursor: pointer;
                font-size: 13px;
                color: #666;
            }

            .graphics-tab.active {
                color: #C20430;
                border-bottom: 2px solid #C20430;
            }

            .graphics-content {
                max-height: calc(80vh - 120px);
                overflow-y: auto;
                padding: 15px;
            }

            .graphics-tab-content {
                display: none;
            }

            .graphics-tab-content.active {
                display: block;
            }

            .graphic-category {
                margin-bottom: 20px;
            }

            .graphic-category h4 {
                margin: 0 0 10px;
                font-size: 13px;
                color: #666;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .graphic-items {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
            }

            .icons-grid {
                grid-template-columns: repeat(4, 1fr);
            }

            .graphic-item {
                cursor: pointer;
                text-align: center;
                padding: 10px;
                border-radius: 8px;
                transition: all 0.2s;
                border: 2px solid transparent;
            }

            .graphic-item:hover {
                background: #f5f5f5;
                border-color: #C20430;
            }

            .graphic-preview {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 40px;
                margin-bottom: 5px;
            }

            .icon-preview svg {
                width: 32px;
                height: 32px;
            }

            .floor-preview svg {
                width: 32px;
                height: 32px;
            }

            .divider-preview {
                width: 100%;
                padding: 10px 0;
            }

            .graphic-name {
                font-size: 10px;
                color: #888;
                text-transform: capitalize;
            }
        `;
        document.head.appendChild(styles);
    }

    // Initialize
    console.log('[PropertyGraphics] Loaded -', Object.keys(STATUS_BADGES).length, 'badge types,', Object.keys(PROPERTY_ICONS).length, 'icons');

    // Public API
    return {
        createBadge,
        createIcon,
        createSpecsRow,
        createFloorPlanSymbol,
        createDivider,
        getIconSVG,
        getBadgeStyles,
        getStatusTypes,
        getIconTypes,
        showPanel,
        STATUS_BADGES,
        PROPERTY_ICONS,
        DECORATIVE,
        FLOOR_PLAN_SYMBOLS,
        isLoaded: true
    };
})();

// Global export
window.PropertyGraphics = PropertyGraphics;
