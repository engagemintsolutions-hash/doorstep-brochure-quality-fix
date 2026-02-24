/**
 * BACKGROUNDS LIBRARY
 * Patterns, gradients, and textures for page backgrounds
 */

const BackgroundsLibrary = (function() {
    'use strict';

    // =========================================================================
    // CSS PATTERNS (Pure CSS, no images needed)
    // =========================================================================
    const PATTERNS = {
        dots: {
            name: 'Dots',
            category: 'geometric',
            css: (color = '#000', bgColor = '#fff', size = 20) => `
                background-color: ${bgColor};
                background-image: radial-gradient(${color} 1px, transparent 1px);
                background-size: ${size}px ${size}px;
            `
        },
        dots_large: {
            name: 'Large Dots',
            category: 'geometric',
            css: (color = '#000', bgColor = '#fff') => `
                background-color: ${bgColor};
                background-image: radial-gradient(${color} 3px, transparent 3px);
                background-size: 30px 30px;
            `
        },
        grid: {
            name: 'Grid',
            category: 'geometric',
            css: (color = '#ddd', bgColor = '#fff') => `
                background-color: ${bgColor};
                background-image: linear-gradient(${color} 1px, transparent 1px),
                                  linear-gradient(90deg, ${color} 1px, transparent 1px);
                background-size: 20px 20px;
            `
        },
        grid_dense: {
            name: 'Dense Grid',
            category: 'geometric',
            css: (color = '#eee', bgColor = '#fff') => `
                background-color: ${bgColor};
                background-image: linear-gradient(${color} 1px, transparent 1px),
                                  linear-gradient(90deg, ${color} 1px, transparent 1px);
                background-size: 10px 10px;
            `
        },
        stripes_horizontal: {
            name: 'Horizontal Stripes',
            category: 'stripes',
            css: (color = '#f0f0f0', bgColor = '#fff') => `
                background: repeating-linear-gradient(
                    0deg,
                    ${bgColor},
                    ${bgColor} 10px,
                    ${color} 10px,
                    ${color} 20px
                );
            `
        },
        stripes_vertical: {
            name: 'Vertical Stripes',
            category: 'stripes',
            css: (color = '#f0f0f0', bgColor = '#fff') => `
                background: repeating-linear-gradient(
                    90deg,
                    ${bgColor},
                    ${bgColor} 10px,
                    ${color} 10px,
                    ${color} 20px
                );
            `
        },
        stripes_diagonal: {
            name: 'Diagonal Stripes',
            category: 'stripes',
            css: (color = '#f0f0f0', bgColor = '#fff') => `
                background: repeating-linear-gradient(
                    45deg,
                    ${bgColor},
                    ${bgColor} 10px,
                    ${color} 10px,
                    ${color} 20px
                );
            `
        },
        chevron: {
            name: 'Chevron',
            category: 'geometric',
            css: (color = '#f0f0f0', bgColor = '#fff') => `
                background-color: ${bgColor};
                background-image:
                    linear-gradient(135deg, ${color} 25%, transparent 25%),
                    linear-gradient(225deg, ${color} 25%, transparent 25%),
                    linear-gradient(45deg, ${color} 25%, transparent 25%),
                    linear-gradient(315deg, ${color} 25%, transparent 25%);
                background-position: 10px 0, 10px 0, 0 0, 0 0;
                background-size: 20px 20px;
            `
        },
        zigzag: {
            name: 'Zigzag',
            category: 'geometric',
            css: (color = '#f0f0f0', bgColor = '#fff') => `
                background-color: ${bgColor};
                background-image:
                    linear-gradient(135deg, ${color} 25%, transparent 25%),
                    linear-gradient(225deg, ${color} 25%, transparent 25%);
                background-size: 20px 20px;
            `
        },
        checkerboard: {
            name: 'Checkerboard',
            category: 'geometric',
            css: (color = '#f0f0f0', bgColor = '#fff') => `
                background-color: ${bgColor};
                background-image:
                    linear-gradient(45deg, ${color} 25%, transparent 25%),
                    linear-gradient(-45deg, ${color} 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, ${color} 75%),
                    linear-gradient(-45deg, transparent 75%, ${color} 75%);
                background-size: 20px 20px;
                background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
            `
        },
        diamond: {
            name: 'Diamond',
            category: 'geometric',
            css: (color = '#f0f0f0', bgColor = '#fff') => `
                background-color: ${bgColor};
                background-image:
                    linear-gradient(45deg, ${color} 25%, transparent 25%, transparent 75%, ${color} 75%),
                    linear-gradient(45deg, ${color} 25%, transparent 25%, transparent 75%, ${color} 75%);
                background-size: 30px 30px;
                background-position: 0 0, 15px 15px;
            `
        },
        hexagons: {
            name: 'Hexagons',
            category: 'geometric',
            css: (color = '#f0f0f0', bgColor = '#fff') => `
                background-color: ${bgColor};
                background-image:
                    radial-gradient(circle farthest-side at 0% 50%, ${bgColor} 23.5%, transparent 0),
                    radial-gradient(circle farthest-side at 0% 50%, ${color} 24%, transparent 0),
                    linear-gradient(${color} 14%, transparent 0),
                    linear-gradient(${color} 14%, transparent 0);
                background-size: 40px 69px;
            `
        },
        circles: {
            name: 'Circles',
            category: 'geometric',
            css: (color = '#f0f0f0', bgColor = '#fff') => `
                background-color: ${bgColor};
                background-image: radial-gradient(circle, ${color} 20%, transparent 20%);
                background-size: 40px 40px;
            `
        },
        waves: {
            name: 'Waves',
            category: 'organic',
            css: (color = '#f0f0f0', bgColor = '#fff') => `
                background-color: ${bgColor};
                background-image:
                    radial-gradient(ellipse at 50% 50%, transparent 60%, ${color} 60%, ${color} 70%, transparent 70%),
                    radial-gradient(ellipse at 50% 50%, transparent 60%, ${color} 60%, ${color} 70%, transparent 70%);
                background-size: 60px 30px;
                background-position: 0 0, 30px 15px;
            `
        },
        paper: {
            name: 'Paper Texture',
            category: 'texture',
            css: (color = '#f5f5f0') => `
                background-color: ${color};
                background-image:
                    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                background-blend-mode: multiply;
            `
        },
        noise: {
            name: 'Subtle Noise',
            category: 'texture',
            css: (bgColor = '#fff') => `
                background-color: ${bgColor};
                background-image:
                    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E");
            `
        },
        cross: {
            name: 'Cross Hatch',
            category: 'geometric',
            css: (color = '#ddd', bgColor = '#fff') => `
                background-color: ${bgColor};
                background-image:
                    linear-gradient(45deg, ${color} 2px, transparent 2px),
                    linear-gradient(-45deg, ${color} 2px, transparent 2px);
                background-size: 20px 20px;
            `
        },
        blueprint: {
            name: 'Blueprint',
            category: 'professional',
            css: () => `
                background-color: #0a4b8c;
                background-image:
                    linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
                background-size: 20px 20px;
            `
        },
        graph_paper: {
            name: 'Graph Paper',
            category: 'professional',
            css: () => `
                background-color: #fff;
                background-image:
                    linear-gradient(#e0e0e0 1px, transparent 1px),
                    linear-gradient(90deg, #e0e0e0 1px, transparent 1px),
                    linear-gradient(#f0f0f0 1px, transparent 1px),
                    linear-gradient(90deg, #f0f0f0 1px, transparent 1px);
                background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
            `
        }
    };

    // =========================================================================
    // GRADIENT PRESETS
    // =========================================================================
    const GRADIENTS = {
        // Subtle gradients
        subtle_gray: {
            name: 'Subtle Gray',
            category: 'subtle',
            css: 'linear-gradient(180deg, #fafafa 0%, #f0f0f0 100%)'
        },
        subtle_warm: {
            name: 'Subtle Warm',
            category: 'subtle',
            css: 'linear-gradient(180deg, #fffaf5 0%, #fef5e7 100%)'
        },
        subtle_cool: {
            name: 'Subtle Cool',
            category: 'subtle',
            css: 'linear-gradient(180deg, #f5f9ff 0%, #e8f0fe 100%)'
        },

        // Elegant gradients
        cream: {
            name: 'Cream',
            category: 'elegant',
            css: 'linear-gradient(180deg, #fdfcfb 0%, #f5f0e8 100%)'
        },
        champagne: {
            name: 'Champagne',
            category: 'elegant',
            css: 'linear-gradient(135deg, #f5f0e6 0%, #ebe4d4 100%)'
        },
        pearl: {
            name: 'Pearl',
            category: 'elegant',
            css: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)'
        },
        silver: {
            name: 'Silver',
            category: 'elegant',
            css: 'linear-gradient(180deg, #e8e8e8 0%, #c4c4c4 100%)'
        },

        // Vibrant gradients
        sunset: {
            name: 'Sunset',
            category: 'vibrant',
            css: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)'
        },
        ocean: {
            name: 'Ocean',
            category: 'vibrant',
            css: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        forest: {
            name: 'Forest',
            category: 'vibrant',
            css: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
        },
        royal: {
            name: 'Royal',
            category: 'vibrant',
            css: 'linear-gradient(135deg, #141E30 0%, #243B55 100%)'
        },
        berry: {
            name: 'Berry',
            category: 'vibrant',
            css: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)'
        },
        fire: {
            name: 'Fire',
            category: 'vibrant',
            css: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)'
        },

        // Professional gradients
        corporate_blue: {
            name: 'Corporate Blue',
            category: 'professional',
            css: 'linear-gradient(135deg, #003366 0%, #004d99 100%)'
        },
        estate_red: {
            name: 'Estate Red',
            category: 'professional',
            css: 'linear-gradient(135deg, #4A1420 0%, #8B0000 100%)'
        },
        luxury_gold: {
            name: 'Luxury Gold',
            category: 'professional',
            css: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)'
        },
        modern_dark: {
            name: 'Modern Dark',
            category: 'professional',
            css: 'linear-gradient(135deg, #232526 0%, #414345 100%)'
        },

        // Multi-color gradients
        rainbow: {
            name: 'Rainbow',
            category: 'multicolor',
            css: 'linear-gradient(90deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff)'
        },
        aurora: {
            name: 'Aurora',
            category: 'multicolor',
            css: 'linear-gradient(135deg, #a8ff78 0%, #78ffd6 50%, #78d6ff 100%)'
        },
        candy: {
            name: 'Candy',
            category: 'multicolor',
            css: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 25%, #ffc3c3 50%, #ff8e8e 75%, #ff6b6b 100%)'
        },

        // Radial gradients
        spotlight: {
            name: 'Spotlight',
            category: 'radial',
            css: 'radial-gradient(circle at center, #ffffff 0%, #f5f5f5 50%, #e0e0e0 100%)'
        },
        vignette_light: {
            name: 'Vignette Light',
            category: 'radial',
            css: 'radial-gradient(ellipse at center, #ffffff 0%, #f0f0f0 70%, #e0e0e0 100%)'
        },
        vignette_dark: {
            name: 'Vignette Dark',
            category: 'radial',
            css: 'radial-gradient(ellipse at center, #3d3d3d 0%, #1a1a1a 100%)'
        }
    };

    // =========================================================================
    // SOLID COLORS (Property-themed)
    // =========================================================================
    const SOLID_COLORS = {
        // Whites and creams
        pure_white: { name: 'Pure White', hex: '#FFFFFF', category: 'neutral' },
        off_white: { name: 'Off White', hex: '#FAFAFA', category: 'neutral' },
        cream: { name: 'Cream', hex: '#FFFDD0', category: 'neutral' },
        ivory: { name: 'Ivory', hex: '#FFFFF0', category: 'neutral' },
        linen: { name: 'Linen', hex: '#FAF0E6', category: 'neutral' },
        antique_white: { name: 'Antique White', hex: '#FAEBD7', category: 'neutral' },

        // Grays
        light_gray: { name: 'Light Gray', hex: '#F5F5F5', category: 'neutral' },
        silver: { name: 'Silver', hex: '#E8E8E8', category: 'neutral' },
        medium_gray: { name: 'Medium Gray', hex: '#CCCCCC', category: 'neutral' },
        charcoal: { name: 'Charcoal', hex: '#333333', category: 'neutral' },
        slate: { name: 'Slate', hex: '#4A4A4A', category: 'neutral' },

        // Estate agent colors
        doorstep_red: { name: 'Doorstep Red', hex: '#4A1420', category: 'brand' },
        navy_blue: { name: 'Navy Blue', hex: '#003366', category: 'professional' },
        forest_green: { name: 'Forest Green', hex: '#228B22', category: 'professional' },
        burgundy: { name: 'Burgundy', hex: '#800020', category: 'professional' },
        gold: { name: 'Gold', hex: '#D4AF37', category: 'professional' },

        // Soft colors
        soft_pink: { name: 'Soft Pink', hex: '#FFE4E1', category: 'soft' },
        soft_blue: { name: 'Soft Blue', hex: '#E6F3FF', category: 'soft' },
        soft_green: { name: 'Soft Green', hex: '#E8F5E9', category: 'soft' },
        soft_yellow: { name: 'Soft Yellow', hex: '#FFFDE7', category: 'soft' },
        soft_lavender: { name: 'Soft Lavender', hex: '#F3E5F5', category: 'soft' }
    };

    // =========================================================================
    // UI Functions
    // =========================================================================

    /**
     * Show background selector panel
     */
    function showBackgroundPanel(targetElement, callback) {
        const existing = document.getElementById('backgroundsPanel');
        if (existing) existing.remove();

        const panel = document.createElement('div');
        panel.id = 'backgroundsPanel';
        panel.className = 'backgrounds-panel';

        panel.innerHTML = `
            <div class="backgrounds-panel-header">
                <h3>Page Background</h3>
                <button class="backgrounds-close" onclick="BackgroundsLibrary.closePanel()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <div class="backgrounds-panel-body">
                <!-- Tabs -->
                <div class="backgrounds-tabs">
                    <button class="backgrounds-tab active" data-tab="colors">Colors</button>
                    <button class="backgrounds-tab" data-tab="gradients">Gradients</button>
                    <button class="backgrounds-tab" data-tab="patterns">Patterns</button>
                </div>

                <!-- Colors Tab -->
                <div class="backgrounds-tab-content active" data-content="colors">
                    ${Object.entries(groupByCategory(SOLID_COLORS)).map(([category, colors]) => `
                        <div class="backgrounds-category">
                            <div class="backgrounds-category-title">${formatCategoryName(category)}</div>
                            <div class="backgrounds-grid">
                                ${Object.entries(colors).map(([id, color]) => `
                                    <div class="background-item color-item"
                                         style="background: ${color.hex}"
                                         title="${color.name}"
                                         onclick="BackgroundsLibrary.applyBackground('solid', '${color.hex}')">
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Gradients Tab -->
                <div class="backgrounds-tab-content" data-content="gradients">
                    ${Object.entries(groupByCategory(GRADIENTS)).map(([category, gradients]) => `
                        <div class="backgrounds-category">
                            <div class="backgrounds-category-title">${formatCategoryName(category)}</div>
                            <div class="backgrounds-grid">
                                ${Object.entries(gradients).map(([id, gradient]) => `
                                    <div class="background-item gradient-item"
                                         style="background: ${gradient.css}"
                                         title="${gradient.name}"
                                         onclick="BackgroundsLibrary.applyBackground('gradient', '${id}')">
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Patterns Tab -->
                <div class="backgrounds-tab-content" data-content="patterns">
                    ${Object.entries(groupByCategory(PATTERNS)).map(([category, patterns]) => `
                        <div class="backgrounds-category">
                            <div class="backgrounds-category-title">${formatCategoryName(category)}</div>
                            <div class="backgrounds-grid">
                                ${Object.entries(patterns).map(([id, pattern]) => `
                                    <div class="background-item pattern-item"
                                         style="${pattern.css()}"
                                         title="${pattern.name}"
                                         onclick="BackgroundsLibrary.applyBackground('pattern', '${id}')">
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Add styles if not already added
        addStyles();

        // Tab switching
        panel.querySelectorAll('.backgrounds-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                panel.querySelectorAll('.backgrounds-tab').forEach(t => t.classList.remove('active'));
                panel.querySelectorAll('.backgrounds-tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                panel.querySelector(`.backgrounds-tab-content[data-content="${tab.dataset.tab}"]`).classList.add('active');
            });
        });

        // Store callback and target
        panel.dataset.targetElement = targetElement ? targetElement.id : '';
        window._backgroundCallback = callback;

        document.body.appendChild(panel);

        console.log('[BackgroundsLibrary] Panel opened');
    }

    /**
     * Apply background to element
     */
    function applyBackground(type, value) {
        const panel = document.getElementById('backgroundsPanel');
        const targetId = panel?.dataset.targetElement;
        const target = targetId ? document.getElementById(targetId) :
                       document.querySelector('.brochure-page.active, .page-canvas.active, .brochure-page');

        if (!target) {
            console.warn('[BackgroundsLibrary] No target element');
            return;
        }

        let cssValue = '';

        switch (type) {
            case 'solid':
                cssValue = value;
                target.style.background = value;
                break;

            case 'gradient':
                const gradient = GRADIENTS[value];
                if (gradient) {
                    cssValue = gradient.css;
                    target.style.background = gradient.css;
                }
                break;

            case 'pattern':
                const pattern = PATTERNS[value];
                if (pattern) {
                    cssValue = pattern.css();
                    target.style.cssText += pattern.css();
                }
                break;
        }

        // Call callback
        if (window._backgroundCallback) {
            window._backgroundCallback({ type, value, css: cssValue });
        }

        // Visual feedback
        showToast(`Background applied: ${type}`);

        console.log('[BackgroundsLibrary] Applied:', type, value);
    }

    /**
     * Close the panel
     */
    function closePanel() {
        const panel = document.getElementById('backgroundsPanel');
        if (panel) panel.remove();
    }

    /**
     * Group items by category
     */
    function groupByCategory(items) {
        const groups = {};
        Object.entries(items).forEach(([id, item]) => {
            const category = item.category || 'other';
            if (!groups[category]) groups[category] = {};
            groups[category][id] = item;
        });
        return groups;
    }

    /**
     * Format category name
     */
    function formatCategoryName(name) {
        return name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    /**
     * Show toast notification
     */
    function showToast(message) {
        const existing = document.querySelector('.bg-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'bg-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            background: #333;
            color: white;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10002;
        `;

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    /**
     * Add styles
     */
    function addStyles() {
        if (document.getElementById('backgroundsLibraryStyles')) return;

        const style = document.createElement('style');
        style.id = 'backgroundsLibraryStyles';
        style.textContent = `
            .backgrounds-panel {
                position: fixed;
                right: 20px;
                top: 100px;
                width: 320px;
                max-height: 80vh;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                z-index: 10001;
                overflow: hidden;
            }

            .backgrounds-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid #eee;
            }

            .backgrounds-panel-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .backgrounds-close {
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                color: #666;
            }

            .backgrounds-panel-body {
                padding: 16px;
                max-height: calc(80vh - 60px);
                overflow-y: auto;
            }

            .backgrounds-tabs {
                display: flex;
                gap: 8px;
                margin-bottom: 16px;
            }

            .backgrounds-tab {
                flex: 1;
                padding: 8px 12px;
                border: 1px solid #ddd;
                background: white;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                transition: all 0.2s ease;
            }

            .backgrounds-tab:hover {
                border-color: var(--primary-color, #4A1420);
            }

            .backgrounds-tab.active {
                background: var(--primary-color, #4A1420);
                color: white;
                border-color: var(--primary-color, #4A1420);
            }

            .backgrounds-tab-content {
                display: none;
            }

            .backgrounds-tab-content.active {
                display: block;
            }

            .backgrounds-category {
                margin-bottom: 16px;
            }

            .backgrounds-category-title {
                font-size: 12px;
                font-weight: 600;
                color: #666;
                margin-bottom: 8px;
            }

            .backgrounds-grid {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                gap: 8px;
            }

            .background-item {
                aspect-ratio: 1;
                border-radius: 6px;
                cursor: pointer;
                border: 2px solid transparent;
                transition: all 0.2s ease;
            }

            .background-item:hover {
                transform: scale(1.1);
                border-color: var(--primary-color, #4A1420);
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }

            .color-item {
                border: 1px solid #ddd;
            }

            .pattern-item {
                background-size: 10px 10px !important;
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * Get counts
     */
    function getCounts() {
        return {
            patterns: Object.keys(PATTERNS).length,
            gradients: Object.keys(GRADIENTS).length,
            colors: Object.keys(SOLID_COLORS).length,
            total: Object.keys(PATTERNS).length + Object.keys(GRADIENTS).length + Object.keys(SOLID_COLORS).length
        };
    }

    // Public API
    return {
        PATTERNS,
        GRADIENTS,
        SOLID_COLORS,
        showBackgroundPanel,
        applyBackground,
        applyToPage: applyBackground,  // Alias for compatibility
        closePanel,
        getCounts,
        isLoaded: true
    };
})();

// Export globally
window.BackgroundsLibrary = BackgroundsLibrary;

console.log('[BackgroundsLibrary] Loaded -',
    BackgroundsLibrary.getCounts().patterns, 'patterns,',
    BackgroundsLibrary.getCounts().gradients, 'gradients,',
    BackgroundsLibrary.getCounts().colors, 'colors');
