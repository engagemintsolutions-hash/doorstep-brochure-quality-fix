/**
 * Text Styles & Pre-Made Text Combinations
 * Professional text presets for property brochures
 */
const TextStyles = (function() {
    'use strict';

    // =========================================================================
    // TEXT STYLE PRESETS
    // =========================================================================
    const TEXT_STYLES = {
        // Headlines
        headline_bold: {
            name: 'Bold Headline',
            category: 'headline',
            css: {
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '48px',
                fontWeight: '700',
                lineHeight: '1.1',
                letterSpacing: '-1px'
            }
        },
        headline_modern: {
            name: 'Modern Headline',
            category: 'headline',
            css: {
                fontFamily: '"Inter", "Helvetica Neue", sans-serif',
                fontSize: '42px',
                fontWeight: '600',
                lineHeight: '1.2',
                letterSpacing: '-0.5px'
            }
        },
        headline_elegant: {
            name: 'Elegant Headline',
            category: 'headline',
            css: {
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontSize: '52px',
                fontWeight: '400',
                lineHeight: '1.1',
                letterSpacing: '2px',
                textTransform: 'uppercase'
            }
        },
        headline_impact: {
            name: 'Impact Headline',
            category: 'headline',
            css: {
                fontFamily: '"Montserrat", sans-serif',
                fontSize: '56px',
                fontWeight: '800',
                lineHeight: '1.0',
                letterSpacing: '-2px',
                textTransform: 'uppercase'
            }
        },
        headline_minimal: {
            name: 'Minimal Headline',
            category: 'headline',
            css: {
                fontFamily: '"Outfit", sans-serif',
                fontSize: '38px',
                fontWeight: '300',
                lineHeight: '1.3',
                letterSpacing: '1px'
            }
        },

        // Prices
        price_large: {
            name: 'Large Price',
            category: 'price',
            css: {
                fontFamily: '"Inter", sans-serif',
                fontSize: '56px',
                fontWeight: '700',
                lineHeight: '1'
            }
        },
        price_elegant: {
            name: 'Elegant Price',
            category: 'price',
            css: {
                fontFamily: '"Playfair Display", serif',
                fontSize: '48px',
                fontWeight: '600',
                lineHeight: '1',
                letterSpacing: '-1px'
            }
        },
        price_compact: {
            name: 'Compact Price',
            category: 'price',
            css: {
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '32px',
                fontWeight: '700',
                lineHeight: '1'
            }
        },

        // Body text
        body_serif: {
            name: 'Serif Body',
            category: 'body',
            css: {
                fontFamily: '"Source Serif Pro", Georgia, serif',
                fontSize: '16px',
                fontWeight: '400',
                lineHeight: '1.8'
            }
        },
        body_sans: {
            name: 'Sans Body',
            category: 'body',
            css: {
                fontFamily: '"Inter", sans-serif',
                fontSize: '15px',
                fontWeight: '400',
                lineHeight: '1.7'
            }
        },
        body_modern: {
            name: 'Modern Body',
            category: 'body',
            css: {
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '16px',
                fontWeight: '400',
                lineHeight: '1.6'
            }
        },

        // Labels & Captions
        label_caps: {
            name: 'Caps Label',
            category: 'label',
            css: {
                fontFamily: '"Inter", sans-serif',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '2px',
                textTransform: 'uppercase'
            }
        },
        label_minimal: {
            name: 'Minimal Label',
            category: 'label',
            css: {
                fontFamily: '"Inter", sans-serif',
                fontSize: '11px',
                fontWeight: '500',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                opacity: '0.7'
            }
        },
        caption: {
            name: 'Caption',
            category: 'label',
            css: {
                fontFamily: '"Inter", sans-serif',
                fontSize: '13px',
                fontWeight: '400',
                lineHeight: '1.5',
                color: '#666'
            }
        }
    };

    // =========================================================================
    // TEXT EFFECTS
    // =========================================================================
    const TEXT_EFFECTS = {
        shadow_soft: {
            name: 'Soft Shadow',
            css: { textShadow: '0 2px 10px rgba(0,0,0,0.15)' }
        },
        shadow_hard: {
            name: 'Hard Shadow',
            css: { textShadow: '3px 3px 0 rgba(0,0,0,0.2)' }
        },
        shadow_glow: {
            name: 'Glow',
            css: { textShadow: '0 0 20px rgba(255,255,255,0.8)' }
        },
        shadow_dark_glow: {
            name: 'Dark Glow',
            css: { textShadow: '0 0 20px rgba(0,0,0,0.5)' }
        },
        outline_dark: {
            name: 'Dark Outline',
            css: {
                webkitTextStroke: '1px rgba(0,0,0,0.3)',
                textShadow: 'none'
            }
        },
        outline_light: {
            name: 'Light Outline',
            css: {
                webkitTextStroke: '1px rgba(255,255,255,0.5)',
                textShadow: 'none'
            }
        },
        gradient_gold: {
            name: 'Gold Gradient',
            css: {
                background: 'linear-gradient(135deg, #D4AF37 0%, #F5D77A 50%, #D4AF37 100%)',
                webkitBackgroundClip: 'text',
                webkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }
        },
        gradient_silver: {
            name: 'Silver Gradient',
            css: {
                background: 'linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 50%, #C0C0C0 100%)',
                webkitBackgroundClip: 'text',
                webkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }
        },
        gradient_red: {
            name: 'Red Gradient',
            css: {
                background: 'linear-gradient(135deg, #4A1420 0%, #FF4D6D 100%)',
                webkitBackgroundClip: 'text',
                webkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }
        },
        gradient_blue: {
            name: 'Blue Gradient',
            css: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                webkitBackgroundClip: 'text',
                webkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }
        },
        letterpress: {
            name: 'Letterpress',
            css: {
                textShadow: '0 1px 0 rgba(255,255,255,0.5), 0 -1px 0 rgba(0,0,0,0.2)'
            }
        },
        embossed: {
            name: 'Embossed',
            css: {
                textShadow: '1px 1px 0 rgba(255,255,255,0.5), -1px -1px 0 rgba(0,0,0,0.1)'
            }
        },
        neon: {
            name: 'Neon Glow',
            css: {
                textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 20px currentColor'
            }
        }
    };

    // =========================================================================
    // PRE-MADE TEXT COMBINATIONS (Ready to use)
    // =========================================================================
    const TEXT_COMBINATIONS = {
        // Price + Address combinations
        price_address_stack: {
            name: 'Price & Address Stack',
            category: 'property',
            elements: [
                {
                    type: 'text',
                    content: '695,000',
                    prefix: '\u00A3',
                    style: { ...TEXT_STYLES.price_large.css, color: '#4A1420', marginBottom: '8px' }
                },
                {
                    type: 'text',
                    content: '42 Primrose Lane, Richmond',
                    style: { ...TEXT_STYLES.headline_modern.css, fontSize: '24px', fontWeight: '500' }
                }
            ]
        },
        price_badge: {
            name: 'Price Badge',
            category: 'property',
            elements: [
                {
                    type: 'container',
                    style: {
                        background: '#4A1420',
                        color: 'white',
                        padding: '16px 28px',
                        borderRadius: '4px',
                        display: 'inline-block'
                    },
                    children: [
                        {
                            type: 'text',
                            content: '\u00A3695,000',
                            style: { fontSize: '32px', fontWeight: '700', margin: 0 }
                        }
                    ]
                }
            ]
        },
        price_ribbon: {
            name: 'Price Ribbon',
            category: 'property',
            elements: [
                {
                    type: 'container',
                    style: {
                        background: 'linear-gradient(90deg, #4A1420, #E31C5F)',
                        color: 'white',
                        padding: '12px 40px',
                        clipPath: 'polygon(10px 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0 50%)'
                    },
                    children: [
                        {
                            type: 'text',
                            content: '\u00A3695,000',
                            style: { fontSize: '28px', fontWeight: '700' }
                        }
                    ]
                }
            ]
        },

        // Spec rows
        specs_horizontal: {
            name: 'Horizontal Specs',
            category: 'property',
            elements: [
                {
                    type: 'container',
                    style: { display: 'flex', gap: '32px', alignItems: 'center' },
                    children: [
                        { type: 'spec', icon: 'bed', value: '4', label: 'Beds' },
                        { type: 'spec', icon: 'bath', value: '3', label: 'Baths' },
                        { type: 'spec', icon: 'reception', value: '2', label: 'Receptions' }
                    ]
                }
            ]
        },
        specs_boxed: {
            name: 'Boxed Specs',
            category: 'property',
            elements: [
                {
                    type: 'container',
                    style: { display: 'flex', gap: '8px' },
                    children: [
                        {
                            type: 'container',
                            style: { background: '#f5f5f5', padding: '12px 20px', borderRadius: '4px', textAlign: 'center' },
                            children: [
                                { type: 'text', content: '4', style: { fontSize: '24px', fontWeight: '700', color: '#4A1420' } },
                                { type: 'text', content: 'Beds', style: { fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#666' } }
                            ]
                        },
                        {
                            type: 'container',
                            style: { background: '#f5f5f5', padding: '12px 20px', borderRadius: '4px', textAlign: 'center' },
                            children: [
                                { type: 'text', content: '3', style: { fontSize: '24px', fontWeight: '700', color: '#4A1420' } },
                                { type: 'text', content: 'Baths', style: { fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#666' } }
                            ]
                        }
                    ]
                }
            ]
        },

        // Feature lists
        features_bullets: {
            name: 'Bullet Features',
            category: 'property',
            elements: [
                {
                    type: 'list',
                    style: { listStyle: 'none', padding: 0, margin: 0 },
                    itemStyle: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px',
                        fontSize: '15px'
                    },
                    bulletStyle: {
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#4A1420',
                        flexShrink: 0
                    },
                    items: ['Period features throughout', 'South-facing garden', 'Recently renovated', 'Close to transport links']
                }
            ]
        },
        features_checkmarks: {
            name: 'Checkmark Features',
            category: 'property',
            elements: [
                {
                    type: 'list',
                    style: { listStyle: 'none', padding: 0, margin: 0 },
                    itemStyle: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '10px',
                        fontSize: '14px'
                    },
                    bulletContent: '\u2713',
                    bulletStyle: {
                        color: '#2ecc71',
                        fontWeight: 'bold',
                        fontSize: '16px'
                    },
                    items: ['Period features throughout', 'South-facing garden', 'Recently renovated']
                }
            ]
        },

        // Headers
        section_header: {
            name: 'Section Header',
            category: 'layout',
            elements: [
                {
                    type: 'container',
                    style: { marginBottom: '24px' },
                    children: [
                        {
                            type: 'text',
                            content: 'Property Details',
                            style: { ...TEXT_STYLES.headline_modern.css, fontSize: '28px', marginBottom: '8px' }
                        },
                        {
                            type: 'divider',
                            style: { width: '60px', height: '3px', background: '#4A1420' }
                        }
                    ]
                }
            ]
        },
        section_header_centered: {
            name: 'Centered Section Header',
            category: 'layout',
            elements: [
                {
                    type: 'container',
                    style: { textAlign: 'center', marginBottom: '32px' },
                    children: [
                        {
                            type: 'text',
                            content: 'Property Details',
                            style: { ...TEXT_STYLES.headline_elegant.css, fontSize: '32px', marginBottom: '12px' }
                        },
                        {
                            type: 'divider',
                            style: { width: '80px', height: '2px', background: '#4A1420', margin: '0 auto' }
                        }
                    ]
                }
            ]
        },

        // Quotes & Taglines
        tagline_italic: {
            name: 'Italic Tagline',
            category: 'text',
            elements: [
                {
                    type: 'text',
                    content: '"An exceptional family home with character and charm"',
                    style: {
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        fontSize: '22px',
                        fontStyle: 'italic',
                        lineHeight: '1.5',
                        color: '#555'
                    }
                }
            ]
        },
        pull_quote: {
            name: 'Pull Quote',
            category: 'text',
            elements: [
                {
                    type: 'container',
                    style: { borderLeft: '4px solid #4A1420', paddingLeft: '24px' },
                    children: [
                        {
                            type: 'text',
                            content: '"A rare opportunity to acquire a stunning period property in one of London\'s most desirable locations"',
                            style: {
                                fontFamily: '"Playfair Display", serif',
                                fontSize: '20px',
                                fontStyle: 'italic',
                                lineHeight: '1.6'
                            }
                        }
                    ]
                }
            ]
        },

        // Contact info
        contact_block: {
            name: 'Contact Block',
            category: 'contact',
            elements: [
                {
                    type: 'container',
                    style: { textAlign: 'center' },
                    children: [
                        {
                            type: 'text',
                            content: 'Arrange Your Viewing',
                            style: { fontSize: '24px', fontWeight: '600', marginBottom: '16px' }
                        },
                        {
                            type: 'text',
                            content: '020 7123 4567',
                            style: { fontSize: '32px', fontWeight: '700', color: '#4A1420', marginBottom: '8px' }
                        },
                        {
                            type: 'text',
                            content: 'sales@agency.co.uk',
                            style: { fontSize: '16px', color: '#666' }
                        }
                    ]
                }
            ]
        },

        // Address formats
        address_elegant: {
            name: 'Elegant Address',
            category: 'property',
            elements: [
                {
                    type: 'container',
                    children: [
                        {
                            type: 'text',
                            content: '42 Primrose Lane',
                            style: { fontFamily: '"Playfair Display", serif', fontSize: '28px', fontWeight: '500', marginBottom: '4px' }
                        },
                        {
                            type: 'text',
                            content: 'Richmond, Surrey TW10 6AH',
                            style: { fontFamily: '"Inter", sans-serif', fontSize: '14px', color: '#666', letterSpacing: '1px' }
                        }
                    ]
                }
            ]
        },
        address_minimal: {
            name: 'Minimal Address',
            category: 'property',
            elements: [
                {
                    type: 'text',
                    content: '42 Primrose Lane, Richmond',
                    style: { fontFamily: '"Inter", sans-serif', fontSize: '18px', fontWeight: '400', letterSpacing: '0.5px' }
                }
            ]
        }
    };

    // =========================================================================
    // UTILITY FUNCTIONS
    // =========================================================================

    /**
     * Apply a text style to an element
     */
    function applyStyle(element, styleId) {
        const style = TEXT_STYLES[styleId];
        if (!style) return false;

        Object.assign(element.style, style.css);
        element.dataset.textStyle = styleId;
        return true;
    }

    /**
     * Apply a text effect to an element
     */
    function applyEffect(element, effectId) {
        const effect = TEXT_EFFECTS[effectId];
        if (!effect) return false;

        Object.assign(element.style, effect.css);
        element.dataset.textEffect = effectId;
        return true;
    }

    /**
     * Create a text combination element
     */
    function createCombination(combinationId, data = {}) {
        const combination = TEXT_COMBINATIONS[combinationId];
        if (!combination) return null;

        const container = document.createElement('div');
        container.className = 'text-combination';
        container.dataset.combination = combinationId;

        renderElements(container, combination.elements, data);

        return container;
    }

    /**
     * Render elements recursively
     */
    function renderElements(parent, elements, data) {
        elements.forEach(el => {
            let domEl;

            switch (el.type) {
                case 'text':
                    domEl = document.createElement('div');
                    domEl.className = 'text-element';
                    const content = data[el.role] || el.content || '';
                    domEl.textContent = (el.prefix || '') + content + (el.suffix || '');
                    if (el.style) Object.assign(domEl.style, el.style);
                    break;

                case 'container':
                    domEl = document.createElement('div');
                    domEl.className = 'text-container';
                    if (el.style) Object.assign(domEl.style, el.style);
                    if (el.children) renderElements(domEl, el.children, data);
                    break;

                case 'divider':
                    domEl = document.createElement('div');
                    domEl.className = 'text-divider';
                    if (el.style) Object.assign(domEl.style, el.style);
                    break;

                case 'list':
                    domEl = document.createElement('ul');
                    domEl.className = 'text-list';
                    if (el.style) Object.assign(domEl.style, el.style);
                    const items = data.items || el.items || [];
                    items.forEach(item => {
                        const li = document.createElement('li');
                        if (el.itemStyle) Object.assign(li.style, el.itemStyle);

                        if (el.bulletStyle || el.bulletContent) {
                            const bullet = document.createElement('span');
                            bullet.className = 'list-bullet';
                            bullet.textContent = el.bulletContent || '';
                            if (el.bulletStyle) Object.assign(bullet.style, el.bulletStyle);
                            li.appendChild(bullet);
                        }

                        const text = document.createElement('span');
                        text.textContent = item;
                        li.appendChild(text);
                        domEl.appendChild(li);
                    });
                    break;

                case 'spec':
                    domEl = document.createElement('div');
                    domEl.className = 'spec-item';
                    domEl.style.cssText = 'display: flex; align-items: center; gap: 8px;';
                    domEl.innerHTML = `
                        <span style="font-size: 24px; font-weight: 700; color: #4A1420;">${el.value}</span>
                        <span style="font-size: 13px; color: #666;">${el.label}</span>
                    `;
                    break;

                default:
                    domEl = document.createElement('div');
                    if (el.style) Object.assign(domEl.style, el.style);
            }

            if (domEl) parent.appendChild(domEl);
        });
    }

    /**
     * Get all styles by category
     */
    function getStylesByCategory(category) {
        return Object.entries(TEXT_STYLES)
            .filter(([_, style]) => style.category === category)
            .map(([id, style]) => ({ id, ...style }));
    }

    /**
     * Get all combinations by category
     */
    function getCombinationsByCategory(category) {
        return Object.entries(TEXT_COMBINATIONS)
            .filter(([_, combo]) => combo.category === category)
            .map(([id, combo]) => ({ id, ...combo }));
    }

    /**
     * Show text styles panel
     */
    function showPanel() {
        const existing = document.querySelector('.text-styles-panel');
        if (existing) existing.remove();

        const panel = document.createElement('div');
        panel.className = 'text-styles-panel';
        panel.innerHTML = `
            <div class="panel-header">
                <h3>Text Styles</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="panel-tabs">
                <button class="tab active" data-tab="combinations">Ready to Use</button>
                <button class="tab" data-tab="styles">Styles</button>
                <button class="tab" data-tab="effects">Effects</button>
            </div>
            <div class="panel-content">
                <div class="tab-content active" data-content="combinations">
                    ${renderCombinationsGrid()}
                </div>
                <div class="tab-content" data-content="styles">
                    ${renderStylesGrid()}
                </div>
                <div class="tab-content" data-content="effects">
                    ${renderEffectsGrid()}
                </div>
            </div>
        `;

        addPanelStyles();
        setupPanelEvents(panel);
        document.body.appendChild(panel);
        return panel;
    }

    function renderCombinationsGrid() {
        const categories = ['property', 'layout', 'text', 'contact'];
        let html = '';

        categories.forEach(cat => {
            const combos = getCombinationsByCategory(cat);
            if (combos.length === 0) return;

            html += `<div class="category-section">
                <h4>${cat.charAt(0).toUpperCase() + cat.slice(1)}</h4>
                <div class="items-grid">`;

            combos.forEach(combo => {
                html += `
                    <div class="combo-item" data-combo="${combo.id}">
                        <div class="combo-preview">${combo.name}</div>
                    </div>
                `;
            });

            html += '</div></div>';
        });

        return html;
    }

    function renderStylesGrid() {
        const categories = ['headline', 'price', 'body', 'label'];
        let html = '';

        categories.forEach(cat => {
            const styles = getStylesByCategory(cat);
            if (styles.length === 0) return;

            html += `<div class="category-section">
                <h4>${cat.charAt(0).toUpperCase() + cat.slice(1)}</h4>
                <div class="items-grid styles-grid">`;

            styles.forEach(style => {
                const previewStyle = Object.entries(style.css)
                    .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`)
                    .join('; ');
                html += `
                    <div class="style-item" data-style="${style.id}">
                        <div class="style-preview" style="${previewStyle}; font-size: 16px !important;">Aa</div>
                        <span class="style-name">${style.name}</span>
                    </div>
                `;
            });

            html += '</div></div>';
        });

        return html;
    }

    function renderEffectsGrid() {
        let html = '<div class="items-grid effects-grid">';

        Object.entries(TEXT_EFFECTS).forEach(([id, effect]) => {
            const previewStyle = Object.entries(effect.css)
                .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`)
                .join('; ');
            html += `
                <div class="effect-item" data-effect="${id}">
                    <div class="effect-preview" style="font-size: 24px; font-weight: bold; ${previewStyle}">Aa</div>
                    <span class="effect-name">${effect.name}</span>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    function setupPanelEvents(panel) {
        panel.querySelector('.close-btn').onclick = () => panel.remove();

        panel.querySelectorAll('.tab').forEach(tab => {
            tab.onclick = () => {
                panel.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                panel.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                panel.querySelector(`[data-content="${tab.dataset.tab}"]`).classList.add('active');
            };
        });

        panel.querySelectorAll('.combo-item').forEach(item => {
            item.onclick = () => {
                document.dispatchEvent(new CustomEvent('addTextCombination', {
                    detail: { combinationId: item.dataset.combo }
                }));
            };
        });

        panel.querySelectorAll('.style-item').forEach(item => {
            item.onclick = () => {
                document.dispatchEvent(new CustomEvent('applyTextStyle', {
                    detail: { styleId: item.dataset.style }
                }));
            };
        });

        panel.querySelectorAll('.effect-item').forEach(item => {
            item.onclick = () => {
                document.dispatchEvent(new CustomEvent('applyTextEffect', {
                    detail: { effectId: item.dataset.effect }
                }));
            };
        });
    }

    function addPanelStyles() {
        if (document.getElementById('text-styles-panel-css')) return;

        const style = document.createElement('style');
        style.id = 'text-styles-panel-css';
        style.textContent = `
            .text-styles-panel {
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

            .text-styles-panel .panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid #eee;
            }

            .text-styles-panel .panel-header h3 { margin: 0; font-size: 16px; }
            .text-styles-panel .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #999; }

            .text-styles-panel .panel-tabs {
                display: flex;
                border-bottom: 1px solid #eee;
            }

            .text-styles-panel .tab {
                flex: 1;
                padding: 12px 8px;
                border: none;
                background: none;
                cursor: pointer;
                font-size: 12px;
                color: #666;
            }

            .text-styles-panel .tab.active {
                color: #4A1420;
                border-bottom: 2px solid #4A1420;
            }

            .text-styles-panel .panel-content {
                max-height: calc(80vh - 120px);
                overflow-y: auto;
                padding: 15px;
            }

            .text-styles-panel .tab-content { display: none; }
            .text-styles-panel .tab-content.active { display: block; }

            .text-styles-panel .category-section { margin-bottom: 20px; }
            .text-styles-panel .category-section h4 {
                margin: 0 0 10px;
                font-size: 12px;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .text-styles-panel .items-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
            }

            .text-styles-panel .combo-item,
            .text-styles-panel .style-item,
            .text-styles-panel .effect-item {
                padding: 12px;
                border: 1px solid #eee;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
                text-align: center;
            }

            .text-styles-panel .combo-item:hover,
            .text-styles-panel .style-item:hover,
            .text-styles-panel .effect-item:hover {
                border-color: #4A1420;
                background: #fef5f7;
            }

            .text-styles-panel .combo-preview { font-size: 13px; font-weight: 500; }
            .text-styles-panel .style-preview { margin-bottom: 5px; }
            .text-styles-panel .style-name,
            .text-styles-panel .effect-name { font-size: 11px; color: #888; }
        `;
        document.head.appendChild(style);
    }

    // Initialize
    console.log('[TextStyles] Loaded -', Object.keys(TEXT_STYLES).length, 'styles,', Object.keys(TEXT_COMBINATIONS).length, 'combinations');

    // Public API
    return {
        applyStyle,
        applyEffect,
        createCombination,
        getStylesByCategory,
        getCombinationsByCategory,
        showPanel,
        TEXT_STYLES,
        TEXT_EFFECTS,
        TEXT_COMBINATIONS,
        isLoaded: true
    };
})();

// Global export
window.TextStyles = TextStyles;
