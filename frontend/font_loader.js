/**
 * GOOGLE FONTS LOADER
 * Dynamic font loading and font picker UI
 */

const FontLoader = (function() {
    'use strict';

    // =========================================================================
    // FONT LIBRARY
    // =========================================================================
    const FONTS = {
        // Display / Serif fonts (elegant headers)
        display: {
            name: 'Display & Serif',
            fonts: [
                { family: 'Playfair Display', weights: [400, 500, 600, 700], style: 'elegant' },
                { family: 'Cormorant Garamond', weights: [400, 500, 600, 700], style: 'elegant' },
                { family: 'Libre Baskerville', weights: [400, 700], style: 'classic' },
                { family: 'Merriweather', weights: [300, 400, 700, 900], style: 'classic' },
                { family: 'Lora', weights: [400, 500, 600, 700], style: 'elegant' },
                { family: 'Source Serif Pro', weights: [400, 600, 700], style: 'professional' },
                { family: 'EB Garamond', weights: [400, 500, 600, 700], style: 'classic' },
                { family: 'Crimson Text', weights: [400, 600, 700], style: 'elegant' },
                { family: 'Spectral', weights: [400, 500, 600, 700], style: 'elegant' },
                { family: 'PT Serif', weights: [400, 700], style: 'classic' }
            ]
        },

        // Sans-serif fonts (modern, clean)
        sans: {
            name: 'Sans-Serif',
            fonts: [
                { family: 'Inter', weights: [300, 400, 500, 600, 700], style: 'modern' },
                { family: 'Poppins', weights: [300, 400, 500, 600, 700], style: 'modern' },
                { family: 'Montserrat', weights: [300, 400, 500, 600, 700], style: 'modern' },
                { family: 'Raleway', weights: [300, 400, 500, 600, 700], style: 'elegant' },
                { family: 'Open Sans', weights: [300, 400, 600, 700], style: 'neutral' },
                { family: 'Roboto', weights: [300, 400, 500, 700], style: 'neutral' },
                { family: 'Lato', weights: [300, 400, 700, 900], style: 'neutral' },
                { family: 'Nunito', weights: [300, 400, 600, 700], style: 'friendly' },
                { family: 'Work Sans', weights: [300, 400, 500, 600, 700], style: 'modern' },
                { family: 'DM Sans', weights: [400, 500, 700], style: 'modern' },
                { family: 'Outfit', weights: [300, 400, 500, 600, 700], style: 'modern' },
                { family: 'Plus Jakarta Sans', weights: [400, 500, 600, 700], style: 'modern' },
                { family: 'Sora', weights: [300, 400, 500, 600, 700], style: 'modern' },
                { family: 'Space Grotesk', weights: [300, 400, 500, 600, 700], style: 'modern' },
                { family: 'Manrope', weights: [400, 500, 600, 700], style: 'modern' }
            ]
        },

        // Condensed fonts (for tight spaces)
        condensed: {
            name: 'Condensed',
            fonts: [
                { family: 'Oswald', weights: [300, 400, 500, 600, 700], style: 'bold' },
                { family: 'Roboto Condensed', weights: [300, 400, 700], style: 'neutral' },
                { family: 'Barlow Condensed', weights: [400, 500, 600, 700], style: 'modern' },
                { family: 'Anton', weights: [400], style: 'bold' },
                { family: 'Fjalla One', weights: [400], style: 'bold' }
            ]
        },

        // Handwriting / Script fonts
        handwriting: {
            name: 'Handwriting',
            fonts: [
                { family: 'Dancing Script', weights: [400, 500, 600, 700], style: 'casual' },
                { family: 'Pacifico', weights: [400], style: 'casual' },
                { family: 'Great Vibes', weights: [400], style: 'elegant' },
                { family: 'Sacramento', weights: [400], style: 'elegant' },
                { family: 'Satisfy', weights: [400], style: 'casual' },
                { family: 'Caveat', weights: [400, 500, 600, 700], style: 'casual' },
                { family: 'Kaushan Script', weights: [400], style: 'bold' }
            ]
        },

        // Monospace fonts
        mono: {
            name: 'Monospace',
            fonts: [
                { family: 'Fira Code', weights: [400, 500, 600, 700], style: 'modern' },
                { family: 'JetBrains Mono', weights: [400, 500, 700], style: 'modern' },
                { family: 'Source Code Pro', weights: [400, 500, 600, 700], style: 'neutral' },
                { family: 'IBM Plex Mono', weights: [400, 500, 600, 700], style: 'professional' }
            ]
        },

        // UK Estate Agent favorites
        estate_agent: {
            name: 'Estate Agent Favorites',
            fonts: [
                { family: 'Playfair Display', weights: [400, 700], style: 'elegant', note: 'Luxury properties' },
                { family: 'Montserrat', weights: [400, 600], style: 'modern', note: 'Modern developments' },
                { family: 'Cormorant Garamond', weights: [400, 600], style: 'elegant', note: 'Period homes' },
                { family: 'Raleway', weights: [400, 600], style: 'elegant', note: 'Contemporary' },
                { family: 'Lora', weights: [400, 700], style: 'elegant', note: 'Traditional' },
                { family: 'Open Sans', weights: [400, 600], style: 'neutral', note: 'Body text' }
            ]
        }
    };

    // Loaded fonts tracking
    const loadedFonts = new Set();
    const loadingFonts = new Set();

    // =========================================================================
    // Font Loading
    // =========================================================================

    /**
     * Load a specific font from Google Fonts
     */
    async function loadFont(fontFamily, weights = [400, 700]) {
        // Already loaded?
        if (loadedFonts.has(fontFamily)) {
            return true;
        }

        // Currently loading?
        if (loadingFonts.has(fontFamily)) {
            // Wait for it
            return new Promise(resolve => {
                const checkLoaded = setInterval(() => {
                    if (loadedFonts.has(fontFamily)) {
                        clearInterval(checkLoaded);
                        resolve(true);
                    }
                }, 100);
            });
        }

        loadingFonts.add(fontFamily);

        try {
            // Build Google Fonts URL
            const weightsStr = weights.join(';');
            const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@${weightsStr}&display=swap`;

            // Create link element
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = fontUrl;

            // Wait for load
            await new Promise((resolve, reject) => {
                link.onload = resolve;
                link.onerror = reject;
                document.head.appendChild(link);
            });

            loadedFonts.add(fontFamily);
            loadingFonts.delete(fontFamily);

            console.log('[FontLoader] Loaded:', fontFamily);
            return true;

        } catch (error) {
            console.error('[FontLoader] Failed to load:', fontFamily, error);
            loadingFonts.delete(fontFamily);
            return false;
        }
    }

    /**
     * Load multiple fonts
     */
    async function loadFonts(fontFamilies) {
        const promises = fontFamilies.map(f => {
            if (typeof f === 'string') {
                return loadFont(f);
            } else {
                return loadFont(f.family, f.weights);
            }
        });

        return Promise.all(promises);
    }

    /**
     * Preload essential fonts
     */
    async function preloadEssentialFonts() {
        const essential = [
            { family: 'Playfair Display', weights: [400, 700] },
            { family: 'Montserrat', weights: [400, 600] },
            { family: 'Open Sans', weights: [400, 600] },
            { family: 'Lora', weights: [400, 700] }
        ];

        console.log('[FontLoader] Preloading essential fonts...');
        await loadFonts(essential);
        console.log('[FontLoader] Essential fonts loaded');
    }

    // =========================================================================
    // Font Picker UI
    // =========================================================================

    /**
     * Show font picker panel
     */
    function showFontPicker(currentFont = 'Open Sans', callback) {
        const existing = document.getElementById('fontPickerPanel');
        if (existing) existing.remove();

        const panel = document.createElement('div');
        panel.id = 'fontPickerPanel';
        panel.className = 'font-picker-panel';

        panel.innerHTML = `
            <div class="font-picker-header">
                <h3>Choose Font</h3>
                <button class="font-picker-close" onclick="FontLoader.closePicker()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <div class="font-picker-search">
                <input type="text" id="fontSearch" placeholder="Search fonts..." oninput="FontLoader.filterFonts(this.value)">
            </div>

            <div class="font-picker-body" id="fontPickerBody">
                ${Object.entries(FONTS).map(([categoryId, category]) => `
                    <div class="font-category" data-category="${categoryId}">
                        <div class="font-category-title">${category.name}</div>
                        <div class="font-list">
                            ${category.fonts.map(font => `
                                <div class="font-item ${font.family === currentFont ? 'selected' : ''}"
                                     data-family="${font.family}"
                                     onclick="FontLoader.selectFont('${font.family}')"
                                     onmouseenter="FontLoader.previewFont('${font.family}', this)">
                                    <span class="font-name">${font.family}</span>
                                    <span class="font-preview" style="font-family: '${font.family}', sans-serif;">Aa</span>
                                    ${font.note ? `<span class="font-note">${font.note}</span>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Add styles
        addStyles();

        // Store callback
        window._fontCallback = callback;

        document.body.appendChild(panel);

        // Start loading visible font previews
        loadVisibleFontPreviews();
    }

    /**
     * Load fonts for visible previews
     */
    async function loadVisibleFontPreviews() {
        const items = document.querySelectorAll('.font-item');
        const toLoad = [];

        items.forEach(item => {
            const family = item.dataset.family;
            if (!loadedFonts.has(family)) {
                toLoad.push({ family, weights: [400] });
            }
        });

        // Load in batches of 5
        for (let i = 0; i < toLoad.length; i += 5) {
            const batch = toLoad.slice(i, i + 5);
            await loadFonts(batch);

            // Update previews
            batch.forEach(font => {
                const preview = document.querySelector(`.font-item[data-family="${font.family}"] .font-preview`);
                if (preview) {
                    preview.style.fontFamily = `'${font.family}', sans-serif`;
                }
            });
        }
    }

    /**
     * Filter fonts by search
     */
    function filterFonts(query) {
        const q = query.toLowerCase();
        const categories = document.querySelectorAll('.font-category');

        categories.forEach(category => {
            const items = category.querySelectorAll('.font-item');
            let hasVisible = false;

            items.forEach(item => {
                const name = item.dataset.family.toLowerCase();
                const matches = name.includes(q);
                item.style.display = matches ? 'flex' : 'none';
                if (matches) hasVisible = true;
            });

            category.style.display = hasVisible ? 'block' : 'none';
        });
    }

    /**
     * Preview font on hover
     */
    async function previewFont(fontFamily, element) {
        await loadFont(fontFamily, [400, 700]);
        const preview = element.querySelector('.font-preview');
        if (preview) {
            preview.style.fontFamily = `'${fontFamily}', sans-serif`;
        }
    }

    /**
     * Select a font
     */
    async function selectFont(fontFamily) {
        // Load full weights
        const fontData = getAllFonts().find(f => f.family === fontFamily);
        const weights = fontData ? fontData.weights : [400, 700];

        await loadFont(fontFamily, weights);

        // Update selection UI
        document.querySelectorAll('.font-item').forEach(item => {
            item.classList.toggle('selected', item.dataset.family === fontFamily);
        });

        // Call callback
        if (window._fontCallback) {
            window._fontCallback({
                family: fontFamily,
                weights: weights,
                css: `font-family: '${fontFamily}', sans-serif;`
            });
        }

        console.log('[FontLoader] Selected:', fontFamily);
    }

    /**
     * Close picker
     */
    function closePicker() {
        const panel = document.getElementById('fontPickerPanel');
        if (panel) panel.remove();
    }

    /**
     * Get all fonts as flat array
     */
    function getAllFonts() {
        const all = [];
        Object.values(FONTS).forEach(category => {
            all.push(...category.fonts);
        });
        return all;
    }

    /**
     * Apply font to element
     */
    async function applyFont(element, fontFamily, weight = 400) {
        await loadFont(fontFamily, [weight]);
        element.style.fontFamily = `'${fontFamily}', sans-serif`;
        element.style.fontWeight = weight;
    }

    // =========================================================================
    // Styles
    // =========================================================================

    function addStyles() {
        if (document.getElementById('fontLoaderStyles')) return;

        const style = document.createElement('style');
        style.id = 'fontLoaderStyles';
        style.textContent = `
            .font-picker-panel {
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
                display: flex;
                flex-direction: column;
            }

            .font-picker-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid #eee;
                flex-shrink: 0;
            }

            .font-picker-header h3 { margin: 0; font-size: 16px; }

            .font-picker-close {
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                color: #666;
            }

            .font-picker-search {
                padding: 12px 16px;
                border-bottom: 1px solid #eee;
                flex-shrink: 0;
            }

            .font-picker-search input {
                width: 100%;
                padding: 10px 14px;
                border: 1px solid #ddd;
                border-radius: 8px;
                font-size: 14px;
            }

            .font-picker-search input:focus {
                outline: none;
                border-color: var(--primary-color, #C20430);
            }

            .font-picker-body {
                overflow-y: auto;
                flex: 1;
                padding: 8px 0;
            }

            .font-category {
                padding: 8px 16px;
            }

            .font-category-title {
                font-size: 11px;
                font-weight: 600;
                color: #999;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
            }

            .font-list {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .font-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 12px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.15s ease;
            }

            .font-item:hover {
                background: #f5f5f5;
            }

            .font-item.selected {
                background: rgba(194, 4, 48, 0.1);
                border: 1px solid var(--primary-color, #C20430);
            }

            .font-name {
                font-size: 14px;
                font-weight: 500;
                flex: 1;
            }

            .font-preview {
                font-size: 20px;
                color: #333;
                min-width: 40px;
                text-align: center;
            }

            .font-note {
                font-size: 10px;
                color: #999;
                margin-left: 8px;
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * Get font counts
     */
    function getCounts() {
        let total = 0;
        Object.values(FONTS).forEach(cat => {
            total += cat.fonts.length;
        });
        return {
            categories: Object.keys(FONTS).length,
            fonts: total
        };
    }

    // Initialize - preload essential fonts
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(preloadEssentialFonts, 1000);
        });
    } else {
        setTimeout(preloadEssentialFonts, 1000);
    }

    // Public API
    return {
        FONTS,
        loadFont,
        loadFonts,
        preloadEssentialFonts,
        showFontPicker,
        closePicker,
        selectFont,
        filterFonts,
        previewFont,
        applyFont,
        getAllFonts,
        getCounts,
        isLoaded: true
    };
})();

// Export globally
window.FontLoader = FontLoader;

console.log('[FontLoader] Loaded -',
    FontLoader.getCounts().fonts, 'fonts in',
    FontLoader.getCounts().categories, 'categories');
