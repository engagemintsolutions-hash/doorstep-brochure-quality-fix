/**
 * Brand Kit System v2
 * Save and manage brand colors, fonts, and logos
 */
const BrandKitV2 = (function() {
    'use strict';

    const STORAGE_KEY = 'brochure_editor_brand_kit';

    // Default brand kit structure
    const DEFAULT_KIT = {
        name: 'My Brand',
        colors: {
            primary: '#4A1420',
            secondary: '#1a1a2e',
            accent: '#D4AF37',
            background: '#FFFFFF',
            text: '#333333'
        },
        fonts: {
            heading: 'Playfair Display',
            subheading: 'Montserrat',
            body: 'Open Sans'
        },
        logos: [],
        customColors: [],
        createdAt: null,
        updatedAt: null
    };

    // Preset brand kits for UK estate agents
    const PRESET_KITS = {
        savills: {
            name: 'Savills Style',
            colors: {
                primary: '#C20430',
                secondary: '#1A1A1A',
                accent: '#D4AF37',
                background: '#FFFFFF',
                text: '#333333'
            },
            fonts: {
                heading: 'Playfair Display',
                subheading: 'Montserrat',
                body: 'Open Sans'
            }
        },
        knight_frank: {
            name: 'Knight Frank Style',
            colors: {
                primary: '#00263E',
                secondary: '#8B7355',
                accent: '#C9A961',
                background: '#F8F8F8',
                text: '#2C2C2C'
            },
            fonts: {
                heading: 'Cormorant Garamond',
                subheading: 'Raleway',
                body: 'Lato'
            }
        },
        foxtons: {
            name: 'Foxtons Style',
            colors: {
                primary: '#00A651',
                secondary: '#333333',
                accent: '#FFD700',
                background: '#FFFFFF',
                text: '#1A1A1A'
            },
            fonts: {
                heading: 'Montserrat',
                subheading: 'Open Sans',
                body: 'Roboto'
            }
        },
        purplebricks: {
            name: 'Purple Bricks Style',
            colors: {
                primary: '#7B2D8E',
                secondary: '#2D2D2D',
                accent: '#F7941D',
                background: '#FFFFFF',
                text: '#333333'
            },
            fonts: {
                heading: 'Poppins',
                subheading: 'Nunito',
                body: 'Open Sans'
            }
        },
        hamptons: {
            name: 'Hamptons Style',
            colors: {
                primary: '#003366',
                secondary: '#8B0000',
                accent: '#C9A961',
                background: '#FAFAFA',
                text: '#2C2C2C'
            },
            fonts: {
                heading: 'Libre Baskerville',
                subheading: 'Source Sans Pro',
                body: 'Inter'
            }
        },
        modern_minimal: {
            name: 'Modern Minimal',
            colors: {
                primary: '#000000',
                secondary: '#666666',
                accent: '#E0E0E0',
                background: '#FFFFFF',
                text: '#1A1A1A'
            },
            fonts: {
                heading: 'Inter',
                subheading: 'Inter',
                body: 'Inter'
            }
        },
        luxury_gold: {
            name: 'Luxury Gold',
            colors: {
                primary: '#1A1A1A',
                secondary: '#B8860B',
                accent: '#FFD700',
                background: '#0D0D0D',
                text: '#FFFFFF'
            },
            fonts: {
                heading: 'Cormorant Garamond',
                subheading: 'Montserrat',
                body: 'Lato'
            }
        },
        doorstep: {
            name: 'Doorstep',
            colors: {
                primary: '#722F37',
                secondary: '#F8F4E8',
                accent: '#4A1420',
                background: '#FAF9F6',
                text: '#2d2d2d'
            },
            fonts: {
                heading: 'Playfair Display',
                subheading: 'Inter',
                body: 'Inter'
            }
        },
        doorstep_dark: {
            name: 'Doorstep Dark',
            colors: {
                primary: '#4A1F24',
                secondary: '#D4AF37',
                accent: '#722F37',
                background: '#1a1a1a',
                text: '#F8F4E8'
            },
            fonts: {
                heading: 'Playfair Display',
                subheading: 'Inter',
                body: 'Inter'
            }
        },
        coastal: {
            name: 'Coastal Living',
            colors: {
                primary: '#2E86AB',
                secondary: '#A23B72',
                accent: '#F18F01',
                background: '#F5F5F5',
                text: '#333333'
            },
            fonts: {
                heading: 'Playfair Display',
                subheading: 'Raleway',
                body: 'Open Sans'
            }
        }
    };

    // State
    let currentKit = null;
    let panelElement = null;

    /**
     * Load brand kit from storage
     */
    function loadKit() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                currentKit = JSON.parse(stored);
            } else {
                currentKit = { ...DEFAULT_KIT, createdAt: Date.now() };
            }
        } catch (e) {
            console.error('Failed to load brand kit:', e);
            currentKit = { ...DEFAULT_KIT, createdAt: Date.now() };
        }
        return currentKit;
    }

    /**
     * Save brand kit to storage
     */
    function saveKit(kit = currentKit) {
        try {
            kit.updatedAt = Date.now();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(kit));
            currentKit = kit;
            return true;
        } catch (e) {
            console.error('Failed to save brand kit:', e);
            return false;
        }
    }

    /**
     * Get current brand kit
     */
    function getKit() {
        if (!currentKit) loadKit();
        return currentKit;
    }

    /**
     * Update a specific property
     */
    function updateKit(property, value) {
        if (!currentKit) loadKit();

        // Handle nested properties like 'colors.primary'
        const parts = property.split('.');
        let obj = currentKit;
        for (let i = 0; i < parts.length - 1; i++) {
            obj = obj[parts[i]];
        }
        obj[parts[parts.length - 1]] = value;

        saveKit();
        return currentKit;
    }

    /**
     * Apply a preset kit
     */
    function applyPreset(presetId) {
        const preset = PRESET_KITS[presetId];
        if (!preset) return null;

        currentKit = {
            ...DEFAULT_KIT,
            ...preset,
            logos: currentKit?.logos || [],
            customColors: currentKit?.customColors || [],
            createdAt: currentKit?.createdAt || Date.now()
        };

        saveKit();
        return currentKit;
    }

    /**
     * Add a logo
     */
    function addLogo(logoData) {
        if (!currentKit) loadKit();

        const logo = {
            id: Date.now(),
            name: logoData.name || 'Logo',
            url: logoData.url,
            type: logoData.type || 'primary' // primary, white, icon
        };

        currentKit.logos.push(logo);
        saveKit();
        return logo;
    }

    /**
     * Remove a logo
     */
    function removeLogo(logoId) {
        if (!currentKit) loadKit();
        currentKit.logos = currentKit.logos.filter(l => l.id !== logoId);
        saveKit();
    }

    /**
     * Add custom color
     */
    function addCustomColor(color, name = '') {
        if (!currentKit) loadKit();

        const colorObj = {
            id: Date.now(),
            color: color,
            name: name || color
        };

        currentKit.customColors.push(colorObj);
        saveKit();
        return colorObj;
    }

    /**
     * Remove custom color
     */
    function removeCustomColor(colorId) {
        if (!currentKit) loadKit();
        currentKit.customColors = currentKit.customColors.filter(c => c.id !== colorId);
        saveKit();
    }

    /**
     * Apply brand kit to selection/canvas
     */
    function applyToSelection(element, options = {}) {
        if (!currentKit) loadKit();

        const { applyColors = true, applyFonts = true } = options;

        if (applyColors) {
            // Apply based on element type
            if (element.classList.contains('text-element')) {
                element.style.color = currentKit.colors.text;
            } else if (element.classList.contains('shape-element')) {
                element.style.backgroundColor = currentKit.colors.primary;
            }
        }

        if (applyFonts && element.classList.contains('text-element')) {
            element.style.fontFamily = currentKit.fonts.body;
        }
    }

    /**
     * Handle logo file upload
     */
    function handleLogoUpload(file, type = 'primary', onApply) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            // Detect format
            const isSVG = file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg');
            const format = isSVG ? 'SVG (Vector)' : file.type.split('/')[1]?.toUpperCase() || 'Image';

            addLogo({
                name: file.name.replace(/\.[^/.]+$/, ''),
                url: ev.target.result,
                type: type,
                format: format,
                isSVG: isSVG
            });

            console.log(`✅ Logo uploaded: ${file.name} (${format}, type: ${type})`);

            // Refresh panel
            if (panelElement) {
                showPanel(onApply);
            }
        };
        reader.readAsDataURL(file);
    }

    /**
     * Add logo to the current brochure page
     */
    function addLogoToCurrentPage(logoUrl, options = {}) {
        const page = document.querySelector('.brochure-page.active') ||
                    document.querySelector('.brochure-page');

        if (!page) {
            console.warn('No brochure page found');
            alert('Please create a page first');
            return;
        }

        const {
            width = 150,
            height = 60,
            x = 40,
            y = 40
        } = options;

        // Create logo element
        const logoElement = document.createElement('div');
        logoElement.className = 'brochure-element image-element logo-element';
        logoElement.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: ${width}px;
            height: ${height}px;
            cursor: move;
            z-index: 100;
        `;

        const img = document.createElement('img');
        img.src = logoUrl;
        img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: contain;
        `;
        img.draggable = false;

        logoElement.appendChild(img);
        page.appendChild(logoElement);

        // Make it selectable/draggable if editor functions exist
        if (typeof window.makeElementDraggable === 'function') {
            window.makeElementDraggable(logoElement);
        }
        if (typeof window.makeElementSelectable === 'function') {
            window.makeElementSelectable(logoElement);
        }

        console.log('✅ Logo added to page');

        // Select the element
        if (typeof window.selectElement === 'function') {
            window.selectElement(logoElement);
        }

        return logoElement;
    }

    /**
     * Get primary logo URL
     */
    function getPrimaryLogo() {
        if (!currentKit) loadKit();
        const primary = currentKit.logos.find(l => l.type === 'primary') || currentKit.logos[0];
        return primary?.url || null;
    }

    /**
     * Get white/light logo URL
     */
    function getWhiteLogo() {
        if (!currentKit) loadKit();
        const white = currentKit.logos.find(l => l.type === 'white');
        return white?.url || getPrimaryLogo();
    }

    /**
     * Show brand kit panel
     */
    function showPanel(onApply) {
        if (panelElement) {
            panelElement.remove();
        }

        if (!currentKit) loadKit();

        const panel = document.createElement('div');
        panel.className = 'brand-kit-panel';
        panel.innerHTML = `
            <div class="bk-header">
                <h3>Brand Kit</h3>
                <button class="bk-close">&times;</button>
            </div>

            <div class="bk-tabs">
                <button class="bk-tab active" data-tab="colors">Colors</button>
                <button class="bk-tab" data-tab="fonts">Fonts</button>
                <button class="bk-tab" data-tab="logos">Logos</button>
                <button class="bk-tab" data-tab="presets">Presets</button>
            </div>

            <div class="bk-content">
                <!-- Colors Tab -->
                <div class="bk-tab-content active" data-content="colors">
                    <div class="bk-section">
                        <h4>Brand Colors</h4>
                        <div class="bk-color-grid">
                            ${Object.entries(currentKit.colors).map(([key, color]) => `
                                <div class="bk-color-item" data-color-key="${key}">
                                    <div class="bk-color-swatch" style="background: ${color}"></div>
                                    <input type="color" value="${color}" class="bk-color-input">
                                    <span class="bk-color-label">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="bk-section">
                        <h4>Custom Colors</h4>
                        <div class="bk-custom-colors">
                            ${currentKit.customColors.map(c => `
                                <div class="bk-custom-color" data-id="${c.id}">
                                    <div class="bk-color-swatch" style="background: ${c.color}"></div>
                                    <button class="bk-remove-color">&times;</button>
                                </div>
                            `).join('')}
                            <button class="bk-add-color">+</button>
                        </div>
                    </div>
                </div>

                <!-- Fonts Tab -->
                <div class="bk-tab-content" data-content="fonts">
                    <div class="bk-section">
                        <h4>Typography</h4>
                        ${Object.entries(currentKit.fonts).map(([key, font]) => `
                            <div class="bk-font-item">
                                <label>${key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                <select class="bk-font-select" data-font-key="${key}">
                                    ${getAvailableFonts().map(f => `
                                        <option value="${f}" ${f === font ? 'selected' : ''}>${f}</option>
                                    `).join('')}
                                </select>
                                <div class="bk-font-preview" style="font-family: '${font}'">
                                    The quick brown fox
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Logos Tab -->
                <div class="bk-tab-content" data-content="logos">
                    <div class="bk-section">
                        <h4>Brand Logos</h4>
                        <p class="bk-hint">Upload your agency logo (SVG recommended for best quality)</p>
                        <div class="bk-logos-grid">
                            ${currentKit.logos.map(logo => `
                                <div class="bk-logo-item" data-id="${logo.id}" data-url="${logo.url}">
                                    <div class="bk-logo-type ${logo.type || 'primary'}">${logo.type === 'white' ? '⬜' : logo.type === 'icon' ? '◻' : '⬛'}</div>
                                    <img src="${logo.url}" alt="${logo.name}">
                                    <span class="bk-logo-name">${logo.name}</span>
                                    <span class="bk-logo-format">${logo.format || 'image'}</span>
                                    <div class="bk-logo-actions">
                                        <button class="bk-add-to-page" title="Add to page">+</button>
                                        <button class="bk-remove-logo" title="Remove">&times;</button>
                                    </div>
                                </div>
                            `).join('')}
                            <label class="bk-add-logo">
                                <input type="file" accept=".svg,.png,.jpg,.jpeg,.webp,image/svg+xml,image/png,image/jpeg,image/webp" style="display:none">
                                <span class="bk-add-icon">+</span>
                                <span>Add Logo</span>
                                <span class="bk-formats">SVG, PNG, JPG</span>
                            </label>
                        </div>
                    </div>
                    <div class="bk-section">
                        <h4>Logo Variants</h4>
                        <p class="bk-hint">Upload different versions for different backgrounds</p>
                        <div class="bk-variant-btns">
                            <label class="bk-variant-btn" data-type="primary">
                                <input type="file" accept=".svg,.png,.jpg,.jpeg,.webp,image/svg+xml,image/png,image/jpeg" style="display:none">
                                <span class="bk-variant-icon">⬛</span>
                                <span>Primary</span>
                            </label>
                            <label class="bk-variant-btn" data-type="white">
                                <input type="file" accept=".svg,.png,.jpg,.jpeg,.webp,image/svg+xml,image/png,image/jpeg" style="display:none">
                                <span class="bk-variant-icon">⬜</span>
                                <span>White</span>
                            </label>
                            <label class="bk-variant-btn" data-type="icon">
                                <input type="file" accept=".svg,.png,.jpg,.jpeg,.webp,image/svg+xml,image/png,image/jpeg" style="display:none">
                                <span class="bk-variant-icon">◻</span>
                                <span>Icon Only</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Presets Tab -->
                <div class="bk-tab-content" data-content="presets">
                    <div class="bk-section">
                        <h4>Estate Agent Presets</h4>
                        <div class="bk-presets-grid">
                            ${Object.entries(PRESET_KITS).map(([id, preset]) => `
                                <button class="bk-preset-btn" data-preset="${id}">
                                    <div class="bk-preset-colors">
                                        ${Object.values(preset.colors).slice(0, 3).map(c => `
                                            <span style="background: ${c}"></span>
                                        `).join('')}
                                    </div>
                                    <span class="bk-preset-name">${preset.name}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>

            <div class="bk-footer">
                <button class="bk-export">Export Kit</button>
                <button class="bk-apply">Apply to Design</button>
            </div>
        `;

        // Event handlers
        panel.querySelector('.bk-close').onclick = () => {
            panel.remove();
            panelElement = null;
        };

        // Tab switching
        panel.querySelectorAll('.bk-tab').forEach(tab => {
            tab.onclick = () => {
                panel.querySelectorAll('.bk-tab').forEach(t => t.classList.remove('active'));
                panel.querySelectorAll('.bk-tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                panel.querySelector(`[data-content="${tab.dataset.tab}"]`).classList.add('active');
            };
        });

        // Color inputs
        panel.querySelectorAll('.bk-color-input').forEach(input => {
            input.oninput = () => {
                const key = input.closest('.bk-color-item').dataset.colorKey;
                updateKit(`colors.${key}`, input.value);
                input.previousElementSibling.style.background = input.value;
            };
        });

        // Font selects
        panel.querySelectorAll('.bk-font-select').forEach(select => {
            select.onchange = () => {
                const key = select.dataset.fontKey;
                updateKit(`fonts.${key}`, select.value);
                select.nextElementSibling.style.fontFamily = select.value;
            };
        });

        // Add custom color
        panel.querySelector('.bk-add-color').onclick = () => {
            const color = prompt('Enter color (hex):', '#6c5ce7');
            if (color) {
                addCustomColor(color);
                showPanel(onApply); // Refresh
            }
        };

        // Remove custom colors
        panel.querySelectorAll('.bk-remove-color').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const id = parseInt(btn.closest('.bk-custom-color').dataset.id);
                removeCustomColor(id);
                btn.closest('.bk-custom-color').remove();
            };
        });

        // Logo upload
        panel.querySelector('.bk-add-logo input').onchange = (e) => {
            handleLogoUpload(e.target.files[0], 'primary', onApply);
        };

        // Logo variant uploads
        panel.querySelectorAll('.bk-variant-btn input').forEach(input => {
            input.onchange = (e) => {
                const type = input.closest('.bk-variant-btn').dataset.type;
                handleLogoUpload(e.target.files[0], type, onApply);
            };
        });

        // Add logo to page
        panel.querySelectorAll('.bk-add-to-page').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const logoItem = btn.closest('.bk-logo-item');
                const logoUrl = logoItem.dataset.url;
                addLogoToCurrentPage(logoUrl);
            };
        });

        // Remove logos
        panel.querySelectorAll('.bk-remove-logo').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const id = parseInt(btn.closest('.bk-logo-item').dataset.id);
                removeLogo(id);
                btn.closest('.bk-logo-item').remove();
            };
        });

        // Preset selection
        panel.querySelectorAll('.bk-preset-btn').forEach(btn => {
            btn.onclick = () => {
                applyPreset(btn.dataset.preset);
                showPanel(onApply); // Refresh with new preset
            };
        });

        // Export kit
        panel.querySelector('.bk-export').onclick = () => {
            const data = JSON.stringify(currentKit, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${currentKit.name.toLowerCase().replace(/\s+/g, '_')}_brand_kit.json`;
            a.click();
            URL.revokeObjectURL(url);
        };

        // Apply to design
        panel.querySelector('.bk-apply').onclick = () => {
            if (onApply) onApply(currentKit);
        };

        document.body.appendChild(panel);
        panelElement = panel;

        return panel;
    }

    /**
     * Get available fonts
     */
    function getAvailableFonts() {
        if (typeof FontLoader !== 'undefined' && FontLoader.getAllFonts) {
            return FontLoader.getAllFonts();
        }
        return [
            'Playfair Display', 'Cormorant Garamond', 'Libre Baskerville',
            'Montserrat', 'Raleway', 'Open Sans', 'Lato', 'Roboto',
            'Inter', 'Poppins', 'Nunito', 'Source Sans Pro'
        ];
    }

    /**
     * Initialize styles
     */
    function init() {
        loadKit();

        if (document.getElementById('brand-kit-v2-styles')) return;

        const style = document.createElement('style');
        style.id = 'brand-kit-v2-styles';
        style.textContent = `
            .brand-kit-panel {
                position: fixed;
                right: 20px;
                top: 80px;
                width: 340px;
                background: #1a1a2e;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                z-index: 10005;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                max-height: 80vh;
            }

            .bk-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .bk-header h3 {
                margin: 0;
                color: #fff;
                font-size: 16px;
            }

            .bk-close {
                background: none;
                border: none;
                color: #888;
                font-size: 24px;
                cursor: pointer;
            }

            .bk-tabs {
                display: flex;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .bk-tab {
                flex: 1;
                padding: 10px;
                background: none;
                border: none;
                color: #888;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .bk-tab:hover { color: #fff; }

            .bk-tab.active {
                color: #fff;
                background: rgba(255,255,255,0.05);
                border-bottom: 2px solid #6c5ce7;
            }

            .bk-content {
                flex: 1;
                overflow-y: auto;
                padding: 15px;
            }

            .bk-tab-content {
                display: none;
            }

            .bk-tab-content.active {
                display: block;
            }

            .bk-section {
                margin-bottom: 20px;
            }

            .bk-section h4 {
                margin: 0 0 12px;
                color: #6c5ce7;
                font-size: 12px;
                text-transform: uppercase;
            }

            .bk-color-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
            }

            .bk-color-item {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px;
                background: rgba(255,255,255,0.03);
                border-radius: 8px;
            }

            .bk-color-swatch {
                width: 32px;
                height: 32px;
                border-radius: 6px;
                border: 2px solid rgba(255,255,255,0.1);
            }

            .bk-color-input {
                width: 0;
                height: 0;
                opacity: 0;
                position: absolute;
            }

            .bk-color-item:hover .bk-color-swatch {
                cursor: pointer;
                border-color: #6c5ce7;
            }

            .bk-color-item:hover .bk-color-input {
                width: 32px;
                height: 32px;
                opacity: 1;
                position: relative;
            }

            .bk-color-label {
                font-size: 11px;
                color: #aaa;
            }

            .bk-custom-colors {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .bk-custom-color {
                position: relative;
            }

            .bk-custom-color .bk-color-swatch {
                width: 40px;
                height: 40px;
                cursor: pointer;
            }

            .bk-remove-color {
                position: absolute;
                top: -5px;
                right: -5px;
                width: 18px;
                height: 18px;
                background: #dc3545;
                border: none;
                border-radius: 50%;
                color: #fff;
                font-size: 12px;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.2s;
            }

            .bk-custom-color:hover .bk-remove-color {
                opacity: 1;
            }

            .bk-add-color {
                width: 40px;
                height: 40px;
                background: rgba(255,255,255,0.05);
                border: 2px dashed rgba(255,255,255,0.2);
                border-radius: 6px;
                color: #888;
                font-size: 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .bk-add-color:hover {
                border-color: #6c5ce7;
                color: #6c5ce7;
            }

            .bk-font-item {
                margin-bottom: 15px;
            }

            .bk-font-item label {
                display: block;
                font-size: 12px;
                color: #888;
                margin-bottom: 6px;
            }

            .bk-font-select {
                width: 100%;
                padding: 8px;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 6px;
                color: #fff;
                font-size: 13px;
            }

            .bk-font-preview {
                margin-top: 8px;
                padding: 10px;
                background: rgba(255,255,255,0.03);
                border-radius: 6px;
                color: #fff;
                font-size: 16px;
            }

            .bk-logos-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
            }

            .bk-logo-item {
                position: relative;
                padding: 15px;
                background: rgba(255,255,255,0.03);
                border-radius: 8px;
                text-align: center;
            }

            .bk-logo-item img {
                max-width: 100%;
                max-height: 60px;
                object-fit: contain;
            }

            .bk-logo-item span {
                display: block;
                margin-top: 8px;
                font-size: 11px;
                color: #888;
            }

            .bk-remove-logo {
                position: absolute;
                top: 5px;
                right: 5px;
                width: 20px;
                height: 20px;
                background: rgba(220,53,69,0.8);
                border: none;
                border-radius: 50%;
                color: #fff;
                font-size: 14px;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.2s;
            }

            .bk-logo-item:hover .bk-remove-logo {
                opacity: 1;
            }

            .bk-add-logo {
                padding: 20px;
                background: rgba(255,255,255,0.03);
                border: 2px dashed rgba(255,255,255,0.2);
                border-radius: 8px;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s;
            }

            .bk-add-logo:hover {
                border-color: #6c5ce7;
            }

            .bk-add-icon {
                display: block;
                font-size: 24px;
                color: #666;
                margin-bottom: 5px;
            }

            .bk-add-logo span:last-child {
                font-size: 11px;
                color: #888;
            }

            .bk-presets-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
            }

            .bk-preset-btn {
                padding: 12px;
                background: rgba(255,255,255,0.03);
                border: 2px solid transparent;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .bk-preset-btn:hover {
                border-color: rgba(255,255,255,0.2);
            }

            .bk-preset-colors {
                display: flex;
                gap: 4px;
                margin-bottom: 8px;
            }

            .bk-preset-colors span {
                flex: 1;
                height: 24px;
                border-radius: 4px;
            }

            .bk-preset-name {
                display: block;
                font-size: 11px;
                color: #aaa;
            }

            .bk-footer {
                display: flex;
                gap: 10px;
                padding: 15px;
                border-top: 1px solid rgba(255,255,255,0.1);
            }

            .bk-footer button {
                flex: 1;
                padding: 10px;
                border-radius: 8px;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .bk-export {
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                color: #aaa;
            }

            .bk-export:hover {
                background: rgba(255,255,255,0.1);
                color: #fff;
            }

            .bk-apply {
                background: #6c5ce7;
                border: none;
                color: #fff;
            }

            .bk-apply:hover {
                background: #5b4cdb;
            }

            /* Logo UI Enhancements */
            .bk-hint {
                font-size: 11px;
                color: #666;
                margin: -5px 0 12px;
            }

            .bk-logo-item {
                position: relative;
            }

            .bk-logo-type {
                position: absolute;
                top: 5px;
                left: 5px;
                font-size: 10px;
                opacity: 0.5;
            }

            .bk-logo-name {
                font-weight: 500;
            }

            .bk-logo-format {
                display: block;
                font-size: 9px;
                color: #6c5ce7;
                margin-top: 2px;
            }

            .bk-logo-actions {
                position: absolute;
                top: 5px;
                right: 5px;
                display: flex;
                gap: 4px;
                opacity: 0;
                transition: opacity 0.2s;
            }

            .bk-logo-item:hover .bk-logo-actions {
                opacity: 1;
            }

            .bk-add-to-page {
                width: 22px;
                height: 22px;
                background: #6c5ce7;
                border: none;
                border-radius: 4px;
                color: #fff;
                font-size: 14px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .bk-add-to-page:hover {
                background: #5b4cdb;
            }

            .bk-formats {
                display: block;
                font-size: 9px;
                color: #666;
                margin-top: 4px;
            }

            .bk-variant-btns {
                display: flex;
                gap: 10px;
            }

            .bk-variant-btn {
                flex: 1;
                padding: 15px 10px;
                background: rgba(255,255,255,0.03);
                border: 2px dashed rgba(255,255,255,0.15);
                border-radius: 8px;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s;
            }

            .bk-variant-btn:hover {
                border-color: #6c5ce7;
                background: rgba(108, 92, 231, 0.1);
            }

            .bk-variant-icon {
                display: block;
                font-size: 20px;
                margin-bottom: 5px;
            }

            .bk-variant-btn span:last-child {
                font-size: 10px;
                color: #888;
            }

            /* Logo element on page */
            .logo-element {
                border: 2px solid transparent;
                border-radius: 4px;
                transition: border-color 0.2s;
            }

            .logo-element:hover,
            .logo-element.selected {
                border-color: #6c5ce7;
            }

            .logo-element.selected::after {
                content: 'Logo';
                position: absolute;
                bottom: -20px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 10px;
                color: #6c5ce7;
                white-space: nowrap;
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
        loadKit,
        saveKit,
        getKit,
        updateKit,
        applyPreset,
        addLogo,
        removeLogo,
        addCustomColor,
        removeCustomColor,
        applyToSelection,
        showPanel,
        addLogoToCurrentPage,
        getPrimaryLogo,
        getWhiteLogo,
        PRESET_KITS,
        isLoaded: true
    };
})();

// Global export
window.BrandKitV2 = BrandKitV2;
