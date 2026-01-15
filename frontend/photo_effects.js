/**
 * Photo Effects & Filters System
 * Canva-style image adjustments and filter presets
 */
const PhotoEffects = (function() {
    'use strict';

    // Filter presets - Professional, subtle adjustments
    // Values are kept LOW for natural-looking results
    const FILTER_PRESETS = {
        // Natural & Clean - Very subtle, professional
        none: {
            name: 'None',
            category: 'natural',
            adjustments: {}
        },
        enhance: {
            name: 'Enhance',
            category: 'natural',
            adjustments: { contrast: 5, saturation: 5, brightness: 3 }
        },
        vivid: {
            name: 'Vivid',
            category: 'natural',
            adjustments: { saturation: 12, contrast: 8, brightness: 2 }
        },
        clarity: {
            name: 'Clarity',
            category: 'natural',
            adjustments: { contrast: 10, saturation: -3, brightness: 2 }
        },
        natural: {
            name: 'Natural',
            category: 'natural',
            adjustments: { brightness: 3, saturation: 3, contrast: 3 }
        },

        // Warm Tones - Subtle warmth
        warm: {
            name: 'Warm',
            category: 'warm',
            adjustments: { temperature: 8, saturation: 5 }
        },
        sunset: {
            name: 'Sunset',
            category: 'warm',
            adjustments: { temperature: 15, saturation: 8, contrast: 5 }
        },
        golden: {
            name: 'Golden',
            category: 'warm',
            adjustments: { temperature: 12, brightness: 5, saturation: 3 }
        },
        autumn: {
            name: 'Autumn',
            category: 'warm',
            adjustments: { temperature: 12, saturation: 10, contrast: 3 }
        },
        cozy: {
            name: 'Cozy',
            category: 'warm',
            adjustments: { temperature: 10, brightness: 3, saturation: 5, vignette: 8 }
        },

        // Cool Tones - Subtle cool
        cool: {
            name: 'Cool',
            category: 'cool',
            adjustments: { temperature: -8, saturation: 3 }
        },
        arctic: {
            name: 'Arctic',
            category: 'cool',
            adjustments: { temperature: -15, brightness: 5, contrast: 3 }
        },
        moonlight: {
            name: 'Moonlight',
            category: 'cool',
            adjustments: { temperature: -10, brightness: -3, contrast: 8 }
        },
        ocean: {
            name: 'Ocean',
            category: 'cool',
            adjustments: { temperature: -8, saturation: 8, tint: -5 }
        },
        fresh: {
            name: 'Fresh',
            category: 'cool',
            adjustments: { temperature: -5, brightness: 5, saturation: 5 }
        },

        // Vintage & Retro - Subtle vintage
        vintage: {
            name: 'Vintage',
            category: 'vintage',
            adjustments: { saturation: -8, contrast: 5, sepia: 8, vignette: 10 }
        },
        retro: {
            name: 'Retro',
            category: 'vintage',
            adjustments: { saturation: -5, contrast: 8, brightness: 3, sepia: 5 }
        },
        film: {
            name: 'Film',
            category: 'vintage',
            adjustments: { contrast: 3, saturation: -8, vignette: 5 }
        },
        polaroid: {
            name: 'Polaroid',
            category: 'vintage',
            adjustments: { contrast: -3, brightness: 5, saturation: -5, temperature: 5 }
        },
        faded: {
            name: 'Faded',
            category: 'vintage',
            adjustments: { contrast: -8, brightness: 8, saturation: -12 }
        },
        nostalgic: {
            name: 'Nostalgic',
            category: 'vintage',
            adjustments: { sepia: 10, contrast: 5, saturation: -10, vignette: 8 }
        },

        // Black & White
        bw: {
            name: 'B&W',
            category: 'bw',
            adjustments: { saturation: -100 }
        },
        noir: {
            name: 'Noir',
            category: 'bw',
            adjustments: { saturation: -100, contrast: 20, brightness: -5 }
        },
        silver: {
            name: 'Silver',
            category: 'bw',
            adjustments: { saturation: -100, contrast: 10, brightness: 5 }
        },
        inkwell: {
            name: 'Inkwell',
            category: 'bw',
            adjustments: { saturation: -100, contrast: 15 }
        },
        classic_bw: {
            name: 'Classic B&W',
            category: 'bw',
            adjustments: { saturation: -100, contrast: 12, brightness: 3 }
        },

        // Dramatic - More subtle dramatic
        dramatic: {
            name: 'Dramatic',
            category: 'dramatic',
            adjustments: { contrast: 15, saturation: 5, brightness: -3 }
        },
        bold: {
            name: 'Bold',
            category: 'dramatic',
            adjustments: { contrast: 12, saturation: 12, brightness: 3 }
        },
        punch: {
            name: 'Punch',
            category: 'dramatic',
            adjustments: { contrast: 15, saturation: 8 }
        },
        cinematic: {
            name: 'Cinematic',
            category: 'dramatic',
            adjustments: { contrast: 10, saturation: -5, temperature: -3, vignette: 12 }
        },
        moody: {
            name: 'Moody',
            category: 'dramatic',
            adjustments: { contrast: 12, brightness: -5, saturation: -8, vignette: 15 }
        },

        // Property-specific - Optimized for real estate photos
        estate_bright: {
            name: 'Estate Bright',
            category: 'property',
            adjustments: { brightness: 8, contrast: 5, saturation: 3 }
        },
        estate_warm: {
            name: 'Estate Warm',
            category: 'property',
            adjustments: { temperature: 8, brightness: 5, saturation: 5 }
        },
        estate_clean: {
            name: 'Estate Clean',
            category: 'property',
            adjustments: { brightness: 5, contrast: 3, saturation: -3 }
        },
        estate_luxury: {
            name: 'Estate Luxury',
            category: 'property',
            adjustments: { contrast: 8, saturation: 3, brightness: 3, vignette: 5 }
        },
        estate_airy: {
            name: 'Estate Airy',
            category: 'property',
            adjustments: { brightness: 10, contrast: -3, saturation: -5 }
        },
        estate_vibrant: {
            name: 'Estate Vibrant',
            category: 'property',
            adjustments: { saturation: 10, contrast: 5, brightness: 3 }
        },
        estate_natural: {
            name: 'Estate Natural',
            category: 'property',
            adjustments: { brightness: 3, contrast: 3, saturation: 2 }
        },
        estate_twilight: {
            name: 'Twilight',
            category: 'property',
            adjustments: { temperature: -5, saturation: 8, contrast: 8, brightness: -3 }
        }
    };

    // Adjustment ranges
    const ADJUSTMENTS = {
        brightness: { min: -100, max: 100, default: 0, unit: '%', label: 'Brightness' },
        contrast: { min: -100, max: 100, default: 0, unit: '%', label: 'Contrast' },
        saturation: { min: -100, max: 100, default: 0, unit: '%', label: 'Saturation' },
        temperature: { min: -100, max: 100, default: 0, unit: '', label: 'Temperature' },
        tint: { min: -100, max: 100, default: 0, unit: '', label: 'Tint' },
        exposure: { min: -100, max: 100, default: 0, unit: '%', label: 'Exposure' },
        highlights: { min: -100, max: 100, default: 0, unit: '%', label: 'Highlights' },
        shadows: { min: -100, max: 100, default: 0, unit: '%', label: 'Shadows' },
        vignette: { min: 0, max: 100, default: 0, unit: '%', label: 'Vignette' },
        blur: { min: 0, max: 20, default: 0, unit: 'px', label: 'Blur' },
        sharpen: { min: 0, max: 100, default: 0, unit: '%', label: 'Sharpen' },
        sepia: { min: 0, max: 100, default: 0, unit: '%', label: 'Sepia' },
        grain: { min: 0, max: 100, default: 0, unit: '%', label: 'Grain' },
        hue: { min: -180, max: 180, default: 0, unit: '°', label: 'Hue Rotate' }
    };

    // Category labels
    const CATEGORIES = {
        natural: { name: 'Natural', icon: '🌿' },
        warm: { name: 'Warm', icon: '🌅' },
        cool: { name: 'Cool', icon: '❄️' },
        vintage: { name: 'Vintage', icon: '📷' },
        bw: { name: 'B&W', icon: '⬛' },
        dramatic: { name: 'Dramatic', icon: '🎭' },
        property: { name: 'Property', icon: '🏠' }
    };

    // Current state
    let currentElement = null;
    let currentAdjustments = {};
    let originalImage = null;

    /**
     * Generate CSS filter string from adjustments
     */
    function generateFilterCSS(adjustments) {
        // Handle null/undefined input gracefully
        if (!adjustments || typeof adjustments !== 'object') {
            return '';
        }
        const filters = [];

        // Brightness: 0-200% (100% is normal)
        if (adjustments.brightness) {
            filters.push(`brightness(${100 + adjustments.brightness}%)`);
        }

        // Contrast: 0-200% (100% is normal)
        if (adjustments.contrast) {
            filters.push(`contrast(${100 + adjustments.contrast}%)`);
        }

        // Saturation: 0-200% (100% is normal)
        if (adjustments.saturation) {
            filters.push(`saturate(${100 + adjustments.saturation}%)`);
        }

        // Sepia: 0-100%
        if (adjustments.sepia) {
            filters.push(`sepia(${adjustments.sepia}%)`);
        }

        // Hue rotate
        if (adjustments.hue) {
            filters.push(`hue-rotate(${adjustments.hue}deg)`);
        }

        // Blur
        if (adjustments.blur) {
            filters.push(`blur(${adjustments.blur}px)`);
        }

        // Temperature (simulated with sepia + hue-rotate)
        if (adjustments.temperature) {
            if (adjustments.temperature > 0) {
                // Warm: add slight sepia and rotate hue towards orange
                filters.push(`sepia(${Math.min(adjustments.temperature * 0.3, 30)}%)`);
                filters.push(`hue-rotate(${-adjustments.temperature * 0.1}deg)`);
            } else {
                // Cool: rotate hue towards blue
                filters.push(`hue-rotate(${adjustments.temperature * 0.2}deg)`);
            }
        }

        // Exposure (brightness variant)
        if (adjustments.exposure) {
            filters.push(`brightness(${100 + adjustments.exposure * 0.5}%)`);
        }

        return filters.join(' ');
    }

    /**
     * Generate vignette overlay CSS
     */
    function generateVignetteCSS(strength) {
        if (!strength) return '';
        const intensity = strength / 100;
        return `radial-gradient(ellipse at center, transparent 0%, transparent ${60 - strength * 0.3}%, rgba(0,0,0,${intensity * 0.7}) 100%)`;
    }

    /**
     * Generate grain overlay
     */
    function generateGrainCSS(strength) {
        if (!strength) return '';
        // SVG noise filter would be better, but CSS approximation
        return `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;
    }

    /**
     * Apply adjustments to an image element
     */
    function applyAdjustments(element, adjustments) {
        if (!element) return;

        const img = element.querySelector('img') || element;

        // Apply CSS filters
        const filterCSS = generateFilterCSS(adjustments);
        img.style.filter = filterCSS;

        // Handle vignette with overlay
        let vignetteOverlay = element.querySelector('.vignette-overlay');
        if (adjustments.vignette) {
            if (!vignetteOverlay) {
                vignetteOverlay = document.createElement('div');
                vignetteOverlay.className = 'vignette-overlay';
                vignetteOverlay.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;';
                element.style.position = 'relative';
                element.appendChild(vignetteOverlay);
            }
            vignetteOverlay.style.background = generateVignetteCSS(adjustments.vignette);
        } else if (vignetteOverlay) {
            vignetteOverlay.remove();
        }

        // Store adjustments on element
        element.dataset.photoEffects = JSON.stringify(adjustments);
    }

    /**
     * Apply a preset filter
     */
    function applyPreset(element, presetId) {
        const preset = FILTER_PRESETS[presetId];
        if (!preset) return;

        currentAdjustments = { ...preset.adjustments };
        applyAdjustments(element, currentAdjustments);

        return currentAdjustments;
    }

    /**
     * Get presets by category
     */
    function getPresetsByCategory(category) {
        return Object.entries(FILTER_PRESETS)
            .filter(([_, preset]) => preset.category === category)
            .map(([id, preset]) => ({ id, ...preset }));
    }

    /**
     * Get all presets
     */
    function getAllPresets() {
        return Object.entries(FILTER_PRESETS)
            .map(([id, preset]) => ({ id, ...preset }));
    }

    /**
     * Create the effects panel UI
     */
    function createEffectsPanel(element, onUpdate) {
        currentElement = element;

        // Get existing adjustments
        if (element.dataset.photoEffects) {
            try {
                currentAdjustments = JSON.parse(element.dataset.photoEffects);
            } catch (e) {
                currentAdjustments = {};
            }
        } else {
            currentAdjustments = {};
        }

        const panel = document.createElement('div');
        panel.className = 'photo-effects-panel';
        panel.innerHTML = `
            <div class="effects-panel-header">
                <h3>Photo Effects</h3>
                <button class="effects-close-btn" title="Close">&times;</button>
            </div>

            <div class="effects-tabs">
                <button class="effects-tab active" data-tab="filters">Filters</button>
                <button class="effects-tab" data-tab="adjust">Adjust</button>
            </div>

            <div class="effects-content">
                <div class="effects-tab-content active" data-content="filters">
                    <div class="filter-categories">
                        ${Object.entries(CATEGORIES).map(([id, cat]) => `
                            <button class="filter-category-btn${id === 'natural' ? ' active' : ''}" data-category="${id}">
                                <span class="cat-icon">${cat.icon}</span>
                                <span class="cat-name">${cat.name}</span>
                            </button>
                        `).join('')}
                    </div>
                    <div class="filter-presets-grid">
                        ${renderFilterPresets('natural')}
                    </div>
                </div>

                <div class="effects-tab-content" data-content="adjust">
                    <div class="adjustments-list">
                        ${Object.entries(ADJUSTMENTS).map(([id, adj]) => `
                            <div class="adjustment-row">
                                <label>${adj.label}</label>
                                <div class="adjustment-control">
                                    <input type="range"
                                        class="adjustment-slider"
                                        data-adjustment="${id}"
                                        min="${adj.min}"
                                        max="${adj.max}"
                                        value="${currentAdjustments[id] || adj.default}">
                                    <span class="adjustment-value">${currentAdjustments[id] || adj.default}${adj.unit}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="reset-adjustments-btn">Reset All</button>
                </div>
            </div>
        `;

        // Event handlers
        panel.querySelector('.effects-close-btn').onclick = () => {
            panel.remove();
        };

        // Tab switching
        panel.querySelectorAll('.effects-tab').forEach(tab => {
            tab.onclick = () => {
                panel.querySelectorAll('.effects-tab').forEach(t => t.classList.remove('active'));
                panel.querySelectorAll('.effects-tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                panel.querySelector(`[data-content="${tab.dataset.tab}"]`).classList.add('active');
            };
        });

        // Category switching
        panel.querySelectorAll('.filter-category-btn').forEach(btn => {
            btn.onclick = () => {
                panel.querySelectorAll('.filter-category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                panel.querySelector('.filter-presets-grid').innerHTML = renderFilterPresets(btn.dataset.category);
                attachPresetHandlers(panel, onUpdate);
            };
        });

        // Adjustment sliders
        panel.querySelectorAll('.adjustment-slider').forEach(slider => {
            slider.oninput = () => {
                const adj = slider.dataset.adjustment;
                const value = parseInt(slider.value);
                currentAdjustments[adj] = value;
                slider.nextElementSibling.textContent = `${value}${ADJUSTMENTS[adj].unit}`;
                applyAdjustments(currentElement, currentAdjustments);
                if (onUpdate) onUpdate(currentAdjustments);
            };
        });

        // Reset button
        panel.querySelector('.reset-adjustments-btn').onclick = () => {
            currentAdjustments = {};
            panel.querySelectorAll('.adjustment-slider').forEach(slider => {
                const adj = slider.dataset.adjustment;
                slider.value = ADJUSTMENTS[adj].default;
                slider.nextElementSibling.textContent = `${ADJUSTMENTS[adj].default}${ADJUSTMENTS[adj].unit}`;
            });
            applyAdjustments(currentElement, currentAdjustments);
            if (onUpdate) onUpdate(currentAdjustments);
        };

        // Attach preset handlers
        attachPresetHandlers(panel, onUpdate);

        return panel;
    }

    /**
     * Render filter presets for a category
     */
    function renderFilterPresets(category) {
        const presets = getPresetsByCategory(category);
        return presets.map(preset => `
            <div class="filter-preset" data-preset="${preset.id}">
                <div class="preset-preview" style="${getPresetPreviewStyle(preset)}">
                    <div class="preset-sample-img"></div>
                </div>
                <span class="preset-name">${preset.name}</span>
            </div>
        `).join('');
    }

    /**
     * Get preview style for a preset
     */
    function getPresetPreviewStyle(preset) {
        const filterCSS = generateFilterCSS(preset.adjustments);
        return `filter: ${filterCSS || 'none'};`;
    }

    /**
     * Attach click handlers to preset buttons
     */
    function attachPresetHandlers(panel, onUpdate) {
        panel.querySelectorAll('.filter-preset').forEach(preset => {
            preset.onclick = () => {
                panel.querySelectorAll('.filter-preset').forEach(p => p.classList.remove('active'));
                preset.classList.add('active');
                const adjustments = applyPreset(currentElement, preset.dataset.preset);

                // Update sliders
                panel.querySelectorAll('.adjustment-slider').forEach(slider => {
                    const adj = slider.dataset.adjustment;
                    const value = adjustments[adj] || ADJUSTMENTS[adj].default;
                    slider.value = value;
                    slider.nextElementSibling.textContent = `${value}${ADJUSTMENTS[adj].unit}`;
                });

                if (onUpdate) onUpdate(adjustments);
            };
        });
    }

    /**
     * Show effects panel for an element
     */
    function show(element, position, onUpdate) {
        // Remove existing panel
        const existing = document.querySelector('.photo-effects-panel');
        if (existing) existing.remove();

        const panel = createEffectsPanel(element, onUpdate);

        // Position panel
        panel.style.position = 'fixed';
        panel.style.left = `${Math.min(position.x, window.innerWidth - 320)}px`;
        panel.style.top = `${Math.min(position.y, window.innerHeight - 500)}px`;
        panel.style.zIndex = '10001';

        document.body.appendChild(panel);

        return panel;
    }

    /**
     * Hide effects panel
     */
    function hide() {
        const panel = document.querySelector('.photo-effects-panel');
        if (panel) panel.remove();
    }

    /**
     * Get current adjustments for an element
     */
    function getAdjustments(element) {
        if (element.dataset.photoEffects) {
            try {
                return JSON.parse(element.dataset.photoEffects);
            } catch (e) {
                return {};
            }
        }
        return {};
    }

    /**
     * Initialize - add CSS styles
     */
    function init() {
        if (document.getElementById('photo-effects-styles')) return;

        const style = document.createElement('style');
        style.id = 'photo-effects-styles';
        style.textContent = `
            .photo-effects-panel {
                width: 300px;
                background: #1a1a2e;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                color: #fff;
                overflow: hidden;
            }

            .effects-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .effects-panel-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .effects-close-btn {
                background: none;
                border: none;
                color: #888;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }

            .effects-close-btn:hover {
                color: #fff;
            }

            .effects-tabs {
                display: flex;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .effects-tab {
                flex: 1;
                padding: 12px;
                background: none;
                border: none;
                color: #888;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .effects-tab:hover {
                color: #fff;
            }

            .effects-tab.active {
                color: #fff;
                background: rgba(255,255,255,0.05);
                border-bottom: 2px solid #6c5ce7;
            }

            .effects-content {
                max-height: 400px;
                overflow-y: auto;
            }

            .effects-tab-content {
                display: none;
                padding: 15px;
            }

            .effects-tab-content.active {
                display: block;
            }

            .filter-categories {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 15px;
            }

            .filter-category-btn {
                padding: 6px 10px;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 20px;
                color: #aaa;
                font-size: 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 4px;
                transition: all 0.2s;
            }

            .filter-category-btn:hover {
                background: rgba(255,255,255,0.1);
                color: #fff;
            }

            .filter-category-btn.active {
                background: #6c5ce7;
                border-color: #6c5ce7;
                color: #fff;
            }

            .cat-icon {
                font-size: 14px;
            }

            .filter-presets-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
            }

            .filter-preset {
                cursor: pointer;
                text-align: center;
                transition: transform 0.2s;
            }

            .filter-preset:hover {
                transform: scale(1.05);
            }

            .filter-preset.active .preset-preview {
                border-color: #6c5ce7;
                box-shadow: 0 0 0 2px #6c5ce7;
            }

            .preset-preview {
                width: 100%;
                aspect-ratio: 1;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 8px;
                border: 2px solid transparent;
                overflow: hidden;
            }

            .preset-sample-img {
                width: 100%;
                height: 100%;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f0f0f0" width="100" height="100"/><circle fill="%23ddd" cx="30" cy="30" r="15"/><polygon fill="%23bbb" points="0,100 40,50 70,75 100,40 100,100"/></svg>');
                background-size: cover;
            }

            .preset-name {
                display: block;
                margin-top: 6px;
                font-size: 11px;
                color: #aaa;
            }

            .filter-preset.active .preset-name {
                color: #6c5ce7;
                font-weight: 600;
            }

            .adjustments-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .adjustment-row {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .adjustment-row label {
                font-size: 12px;
                color: #888;
            }

            .adjustment-control {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .adjustment-slider {
                flex: 1;
                -webkit-appearance: none;
                height: 4px;
                background: rgba(255,255,255,0.1);
                border-radius: 2px;
                outline: none;
            }

            .adjustment-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 14px;
                height: 14px;
                background: #6c5ce7;
                border-radius: 50%;
                cursor: pointer;
            }

            .adjustment-slider::-moz-range-thumb {
                width: 14px;
                height: 14px;
                background: #6c5ce7;
                border-radius: 50%;
                cursor: pointer;
                border: none;
            }

            .adjustment-value {
                min-width: 45px;
                text-align: right;
                font-size: 12px;
                color: #aaa;
                font-family: monospace;
            }

            .reset-adjustments-btn {
                width: 100%;
                margin-top: 15px;
                padding: 10px;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 8px;
                color: #aaa;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .reset-adjustments-btn:hover {
                background: rgba(255,255,255,0.1);
                color: #fff;
            }

            /* Scrollbar */
            .effects-content::-webkit-scrollbar {
                width: 6px;
            }

            .effects-content::-webkit-scrollbar-track {
                background: transparent;
            }

            .effects-content::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.2);
                border-radius: 3px;
            }
        `;
        document.head.appendChild(style);
    }

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    return {
        init,
        show,
        hide,
        applyPreset,
        applyAdjustments,
        getAdjustments,
        getAllPresets,
        getPresetsByCategory,
        generateFilterCSS,
        getFilterCSS: generateFilterCSS,  // Alias for compatibility
        FILTER_PRESETS,
        ADJUSTMENTS,
        CATEGORIES,
        isLoaded: true
    };
})();

// Global export
window.PhotoEffects = PhotoEffects;
