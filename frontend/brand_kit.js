/**
 * Brand Kit - Save and apply brand colors, fonts, and logos
 * Enables consistent branding across designs
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'brochure_brand_kits';

    // Default brand kit structure
    const DEFAULT_BRAND_KIT = {
        id: 'default',
        name: 'Default Brand',
        colors: {
            primary: '#1a365d',
            secondary: '#2b6cb0',
            accent: '#ed8936',
            background: '#ffffff',
            text: '#2d3748'
        },
        fonts: {
            heading: 'Playfair Display',
            body: 'Open Sans',
            accent: 'Montserrat'
        },
        logos: [],
        patterns: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    // Popular estate agent brand presets
    const PRESET_BRANDS = {
        savills: {
            name: 'Savills Style',
            colors: {
                primary: '#1a3c6e',
                secondary: '#c9a961',
                accent: '#8b7355',
                background: '#f8f6f3',
                text: '#333333'
            },
            fonts: { heading: 'Georgia', body: 'Arial', accent: 'Georgia' }
        },
        knightFrank: {
            name: 'Knight Frank Style',
            colors: {
                primary: '#003366',
                secondary: '#d4af37',
                accent: '#4a4a4a',
                background: '#ffffff',
                text: '#1a1a1a'
            },
            fonts: { heading: 'Times New Roman', body: 'Helvetica', accent: 'Times New Roman' }
        },
        foxtons: {
            name: 'Foxtons Style',
            colors: {
                primary: '#00594c',
                secondary: '#8dc63f',
                accent: '#ffffff',
                background: '#f5f5f5',
                text: '#333333'
            },
            fonts: { heading: 'Futura', body: 'Arial', accent: 'Futura' }
        },
        purpleBricks: {
            name: 'Purple Bricks Style',
            colors: {
                primary: '#6b2d5b',
                secondary: '#f7941d',
                accent: '#ffffff',
                background: '#ffffff',
                text: '#333333'
            },
            fonts: { heading: 'Gotham', body: 'Arial', accent: 'Gotham' }
        },
        rightmove: {
            name: 'Rightmove Style',
            colors: {
                primary: '#00deb6',
                secondary: '#2c2c2c',
                accent: '#ff5a00',
                background: '#ffffff',
                text: '#2c2c2c'
            },
            fonts: { heading: 'Roboto', body: 'Roboto', accent: 'Roboto' }
        },
        zoopla: {
            name: 'Zoopla Style',
            colors: {
                primary: '#6d2077',
                secondary: '#e95420',
                accent: '#8a3e91',
                background: '#ffffff',
                text: '#333333'
            },
            fonts: { heading: 'Open Sans', body: 'Open Sans', accent: 'Open Sans' }
        },
        modernMinimal: {
            name: 'Modern Minimal',
            colors: {
                primary: '#000000',
                secondary: '#666666',
                accent: '#cccccc',
                background: '#ffffff',
                text: '#000000'
            },
            fonts: { heading: 'Inter', body: 'Inter', accent: 'Inter' }
        },
        luxuryGold: {
            name: 'Luxury Gold',
            colors: {
                primary: '#1a1a1a',
                secondary: '#d4af37',
                accent: '#c9a961',
                background: '#0d0d0d',
                text: '#ffffff'
            },
            fonts: { heading: 'Playfair Display', body: 'Lato', accent: 'Playfair Display' }
        }
    };

    let currentBrandKit = null;
    let brandKits = [];

    /**
     * Initialize brand kit system
     */
    function init() {
        loadBrandKits();
        console.log('Brand Kit initialized with', brandKits.length, 'saved kits');
    }

    /**
     * Load brand kits from storage
     */
    function loadBrandKits() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                brandKits = JSON.parse(stored);
            }
            if (brandKits.length === 0) {
                brandKits = [{ ...DEFAULT_BRAND_KIT }];
                saveBrandKits();
            }
            currentBrandKit = brandKits[0];
        } catch (e) {
            console.error('Error loading brand kits:', e);
            brandKits = [{ ...DEFAULT_BRAND_KIT }];
            currentBrandKit = brandKits[0];
        }
    }

    /**
     * Save brand kits to storage
     */
    function saveBrandKits() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(brandKits));
        } catch (e) {
            console.error('Error saving brand kits:', e);
        }
    }

    /**
     * Create new brand kit
     */
    function createBrandKit(name = 'New Brand Kit') {
        const kit = {
            ...DEFAULT_BRAND_KIT,
            id: `brand_${Date.now()}`,
            name,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        brandKits.push(kit);
        saveBrandKits();
        return kit;
    }

    /**
     * Update brand kit
     */
    function updateBrandKit(kitId, updates) {
        const kit = brandKits.find(k => k.id === kitId);
        if (kit) {
            Object.assign(kit, updates, { updatedAt: Date.now() });
            saveBrandKits();
        }
        return kit;
    }

    /**
     * Delete brand kit
     */
    function deleteBrandKit(kitId) {
        const index = brandKits.findIndex(k => k.id === kitId);
        if (index > -1 && brandKits.length > 1) {
            brandKits.splice(index, 1);
            if (currentBrandKit?.id === kitId) {
                currentBrandKit = brandKits[0];
            }
            saveBrandKits();
            return true;
        }
        return false;
    }

    /**
     * Set active brand kit
     */
    function setActiveBrandKit(kitId) {
        const kit = brandKits.find(k => k.id === kitId);
        if (kit) {
            currentBrandKit = kit;
            return kit;
        }
        return null;
    }

    /**
     * Apply preset brand
     */
    function applyPreset(presetId) {
        const preset = PRESET_BRANDS[presetId];
        if (!preset) return null;

        if (currentBrandKit) {
            currentBrandKit.colors = { ...preset.colors };
            currentBrandKit.fonts = { ...preset.fonts };
            currentBrandKit.updatedAt = Date.now();
            saveBrandKits();
        }
        return currentBrandKit;
    }

    /**
     * Add logo to brand kit
     */
    function addLogo(kitId, logoData) {
        const kit = brandKits.find(k => k.id === kitId);
        if (kit) {
            kit.logos.push({
                id: `logo_${Date.now()}`,
                name: logoData.name || 'Logo',
                url: logoData.url,
                type: logoData.type || 'primary', // primary, secondary, icon
                addedAt: Date.now()
            });
            kit.updatedAt = Date.now();
            saveBrandKits();
            return kit.logos[kit.logos.length - 1];
        }
        return null;
    }

    /**
     * Remove logo from brand kit
     */
    function removeLogo(kitId, logoId) {
        const kit = brandKits.find(k => k.id === kitId);
        if (kit) {
            const index = kit.logos.findIndex(l => l.id === logoId);
            if (index > -1) {
                kit.logos.splice(index, 1);
                kit.updatedAt = Date.now();
                saveBrandKits();
                return true;
            }
        }
        return false;
    }

    /**
     * Apply brand kit to canvas
     */
    function applyToCanvas(canvasElement, options = {}) {
        if (!currentBrandKit || !canvasElement) return;

        const { applyColors = true, applyFonts = true } = options;

        if (applyColors) {
            // Set CSS custom properties
            canvasElement.style.setProperty('--brand-primary', currentBrandKit.colors.primary);
            canvasElement.style.setProperty('--brand-secondary', currentBrandKit.colors.secondary);
            canvasElement.style.setProperty('--brand-accent', currentBrandKit.colors.accent);
            canvasElement.style.setProperty('--brand-background', currentBrandKit.colors.background);
            canvasElement.style.setProperty('--brand-text', currentBrandKit.colors.text);

            // Apply background
            canvasElement.style.backgroundColor = currentBrandKit.colors.background;
        }

        if (applyFonts) {
            canvasElement.style.setProperty('--brand-font-heading', currentBrandKit.fonts.heading);
            canvasElement.style.setProperty('--brand-font-body', currentBrandKit.fonts.body);
            canvasElement.style.setProperty('--brand-font-accent', currentBrandKit.fonts.accent);
        }

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('brandKitApplied', { detail: currentBrandKit }));
    }

    /**
     * Render brand kit panel UI
     */
    function renderBrandKitPanel(container) {
        let html = `
            <div class="brand-kit-panel">
                <div class="brand-kit-header">
                    <h3>Brand Kit</h3>
                    <button class="btn btn-sm btn-primary" id="newBrandBtn">+ New</button>
                </div>

                <div class="brand-kit-selector">
                    <select id="brandKitSelect" class="form-select">
                        ${brandKits.map(kit => `
                            <option value="${kit.id}" ${kit.id === currentBrandKit?.id ? 'selected' : ''}>
                                ${kit.name}
                            </option>
                        `).join('')}
                    </select>
                </div>

                <div class="brand-section">
                    <h4>Preset Brands</h4>
                    <div class="preset-grid">
                        ${Object.entries(PRESET_BRANDS).map(([id, preset]) => `
                            <button class="preset-btn" data-preset="${id}" title="${preset.name}">
                                <div class="preset-colors">
                                    <span style="background: ${preset.colors.primary}"></span>
                                    <span style="background: ${preset.colors.secondary}"></span>
                                    <span style="background: ${preset.colors.accent}"></span>
                                </div>
                                <span class="preset-name">${preset.name}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="brand-section">
                    <h4>Brand Colors</h4>
                    <div class="color-inputs">
                        <div class="color-input-group">
                            <label>Primary</label>
                            <input type="color" id="colorPrimary" value="${currentBrandKit?.colors.primary || '#1a365d'}">
                        </div>
                        <div class="color-input-group">
                            <label>Secondary</label>
                            <input type="color" id="colorSecondary" value="${currentBrandKit?.colors.secondary || '#2b6cb0'}">
                        </div>
                        <div class="color-input-group">
                            <label>Accent</label>
                            <input type="color" id="colorAccent" value="${currentBrandKit?.colors.accent || '#ed8936'}">
                        </div>
                        <div class="color-input-group">
                            <label>Background</label>
                            <input type="color" id="colorBackground" value="${currentBrandKit?.colors.background || '#ffffff'}">
                        </div>
                        <div class="color-input-group">
                            <label>Text</label>
                            <input type="color" id="colorText" value="${currentBrandKit?.colors.text || '#2d3748'}">
                        </div>
                    </div>
                </div>

                <div class="brand-section">
                    <h4>Brand Fonts</h4>
                    <div class="font-inputs">
                        <div class="font-input-group">
                            <label>Heading</label>
                            <select id="fontHeading" class="form-select">
                                ${getFontOptions(currentBrandKit?.fonts.heading)}
                            </select>
                        </div>
                        <div class="font-input-group">
                            <label>Body</label>
                            <select id="fontBody" class="form-select">
                                ${getFontOptions(currentBrandKit?.fonts.body)}
                            </select>
                        </div>
                    </div>
                </div>

                <div class="brand-section">
                    <h4>Logos</h4>
                    <div class="logos-grid" id="logosGrid">
                        ${(currentBrandKit?.logos || []).map(logo => `
                            <div class="logo-item" data-logo-id="${logo.id}">
                                <img src="${logo.url}" alt="${logo.name}">
                                <button class="logo-remove" title="Remove">&times;</button>
                            </div>
                        `).join('')}
                        <button class="logo-add-btn" id="addLogoBtn">
                            <span>+</span>
                            <span>Add Logo</span>
                        </button>
                    </div>
                    <input type="file" id="logoFileInput" accept="image/*" style="display: none;">
                </div>

                <div class="brand-actions">
                    <button class="btn btn-primary" id="applyBrandBtn">Apply to Design</button>
                    <button class="btn btn-secondary" id="saveBrandBtn">Save Changes</button>
                </div>
            </div>
        `;

        container.innerHTML = html;
        initBrandKitEvents(container);
    }

    /**
     * Get font options HTML
     */
    function getFontOptions(selected) {
        const fonts = [
            'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Verdana',
            'Playfair Display', 'Open Sans', 'Roboto', 'Lato', 'Montserrat',
            'Inter', 'Poppins', 'Raleway', 'Source Sans Pro', 'Futura',
            'Gotham', 'Proxima Nova', 'Avenir', 'Garamond', 'Libre Baskerville'
        ];
        return fonts.map(font => `
            <option value="${font}" ${font === selected ? 'selected' : ''}>${font}</option>
        `).join('');
    }

    /**
     * Initialize brand kit panel events
     */
    function initBrandKitEvents(container) {
        // Brand kit selector
        container.querySelector('#brandKitSelect')?.addEventListener('change', (e) => {
            setActiveBrandKit(e.target.value);
            renderBrandKitPanel(container);
        });

        // New brand kit
        container.querySelector('#newBrandBtn')?.addEventListener('click', () => {
            const name = prompt('Enter brand kit name:', 'New Brand Kit');
            if (name) {
                const kit = createBrandKit(name);
                setActiveBrandKit(kit.id);
                renderBrandKitPanel(container);
            }
        });

        // Preset buttons
        container.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                applyPreset(btn.dataset.preset);
                renderBrandKitPanel(container);
                showToast('Brand preset applied');
            });
        });

        // Color inputs
        ['Primary', 'Secondary', 'Accent', 'Background', 'Text'].forEach(color => {
            const input = container.querySelector(`#color${color}`);
            if (input && currentBrandKit) {
                input.addEventListener('change', (e) => {
                    currentBrandKit.colors[color.toLowerCase()] = e.target.value;
                });
            }
        });

        // Font selects
        ['Heading', 'Body'].forEach(font => {
            const select = container.querySelector(`#font${font}`);
            if (select && currentBrandKit) {
                select.addEventListener('change', (e) => {
                    currentBrandKit.fonts[font.toLowerCase()] = e.target.value;
                });
            }
        });

        // Add logo
        const addLogoBtn = container.querySelector('#addLogoBtn');
        const logoInput = container.querySelector('#logoFileInput');

        addLogoBtn?.addEventListener('click', () => logoInput?.click());

        logoInput?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && currentBrandKit) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    addLogo(currentBrandKit.id, {
                        name: file.name,
                        url: event.target.result,
                        type: 'primary'
                    });
                    renderBrandKitPanel(container);
                };
                reader.readAsDataURL(file);
            }
        });

        // Remove logos
        container.querySelectorAll('.logo-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const logoItem = btn.closest('.logo-item');
                if (logoItem && currentBrandKit) {
                    removeLogo(currentBrandKit.id, logoItem.dataset.logoId);
                    renderBrandKitPanel(container);
                }
            });
        });

        // Apply brand
        container.querySelector('#applyBrandBtn')?.addEventListener('click', () => {
            const canvas = document.getElementById('brochureCanvas') ||
                          document.querySelector('.page-canvas') ||
                          document.querySelector('.canvas-area');
            if (canvas) {
                applyToCanvas(canvas);
                showToast('Brand applied to design');
            }
        });

        // Save changes
        container.querySelector('#saveBrandBtn')?.addEventListener('click', () => {
            saveBrandKits();
            showToast('Brand kit saved');
        });
    }

    /**
     * Show toast notification
     */
    function showToast(message) {
        if (typeof window.showToast === 'function') {
            window.showToast(message);
        }
    }

    // Initialize on load
    init();

    // Export to global scope
    window.BrandKit = {
        init,
        create: createBrandKit,
        update: updateBrandKit,
        delete: deleteBrandKit,
        setActive: setActiveBrandKit,
        getCurrent: () => currentBrandKit,
        getAll: () => brandKits,
        applyPreset,
        addLogo,
        removeLogo,
        applyToCanvas,
        renderPanel: renderBrandKitPanel,
        PRESETS: PRESET_BRANDS,
        AGENCY_PRESETS: PRESET_BRANDS,  // Alias for compatibility
        isLoaded: true
    };

    console.log('Brand Kit loaded with', Object.keys(PRESET_BRANDS).length, 'presets');

})();
