/**
 * RICH COLOR PICKER
 * Canva-style color picker with advanced features
 */

const ColorPicker = (function() {
    'use strict';

    // Preset color palettes
    const COLOR_PALETTES = {
        brand: {
            name: 'Brand Colors',
            colors: ['#C20430', '#000000', '#FFFFFF', '#D4AF37', '#1a1a1a', '#f5f5f5']
        },
        basic: {
            name: 'Basic',
            colors: ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']
        },
        neutral: {
            name: 'Neutral',
            colors: ['#1a1a1a', '#333333', '#4a4a4a', '#666666', '#888888', '#aaaaaa', '#cccccc', '#f5f5f5']
        },
        warm: {
            name: 'Warm',
            colors: ['#FF6B6B', '#FFA07A', '#FFD93D', '#FF8C42', '#C84B31', '#8B4513', '#A0522D', '#CD853F']
        },
        cool: {
            name: 'Cool',
            colors: ['#6B5B95', '#88B04B', '#45B8AC', '#5B5EA6', '#9B2335', '#DD4132', '#DFCFBE', '#55B4B0']
        },
        estate_agent: {
            name: 'Estate Agent',
            colors: ['#C20430', '#003366', '#2E5090', '#4A4A4A', '#8B0000', '#006400', '#DAA520', '#1C1C1C']
        },
        pastel: {
            name: 'Pastel',
            colors: ['#FFD1DC', '#BFEFFF', '#BAFFC9', '#FFFFBA', '#FFB7B2', '#E2B6CF', '#B5EAD7', '#C7CEEA']
        },
        earth: {
            name: 'Earth Tones',
            colors: ['#8B4513', '#A0522D', '#6B4423', '#556B2F', '#708238', '#9B7653', '#C19A6B', '#E8DCCA']
        }
    };

    // Recent colors (from localStorage)
    let recentColors = JSON.parse(localStorage.getItem('colorPicker_recent') || '[]');

    // Current state
    let currentColor = '#C20430';
    let currentOpacity = 100;
    let onChangeCallback = null;

    /**
     * Initialize color picker
     */
    function init() {
        // Add CSS
        addStyles();

        console.log('[ColorPicker] Initialized');
    }

    /**
     * Add CSS styles
     */
    function addStyles() {
        if (document.getElementById('colorPickerStyles')) return;

        const style = document.createElement('style');
        style.id = 'colorPickerStyles';
        style.textContent = `
            .color-picker-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
            }

            .color-picker-panel {
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                width: 320px;
                max-height: 90vh;
                overflow: hidden;
            }

            .color-picker-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid #eee;
            }

            .color-picker-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .color-picker-close {
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                color: #666;
            }

            .color-picker-body {
                padding: 20px;
                max-height: 500px;
                overflow-y: auto;
            }

            .color-picker-preview {
                display: flex;
                gap: 12px;
                margin-bottom: 20px;
            }

            .color-preview-swatch {
                width: 80px;
                height: 80px;
                border-radius: 8px;
                border: 2px solid #ddd;
                position: relative;
                overflow: hidden;
            }

            .color-preview-swatch::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%) 50% / 16px 16px;
            }

            .color-preview-swatch-inner {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
            }

            .color-preview-inputs {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .color-input-row {
                display: flex;
                gap: 8px;
            }

            .color-input-field {
                flex: 1;
            }

            .color-input-field label {
                display: block;
                font-size: 11px;
                color: #666;
                margin-bottom: 4px;
            }

            .color-input-field input {
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 13px;
                font-family: monospace;
            }

            .color-input-field input:focus {
                outline: none;
                border-color: var(--primary-color, #C20430);
            }

            .color-spectrum {
                width: 100%;
                height: 150px;
                border-radius: 8px;
                margin-bottom: 12px;
                cursor: crosshair;
                position: relative;
            }

            .color-spectrum-marker {
                position: absolute;
                width: 16px;
                height: 16px;
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2);
                transform: translate(-50%, -50%);
                pointer-events: none;
            }

            .color-hue-slider {
                width: 100%;
                height: 16px;
                border-radius: 8px;
                margin-bottom: 12px;
                cursor: pointer;
                background: linear-gradient(to right,
                    #ff0000, #ff8000, #ffff00, #80ff00, #00ff00,
                    #00ff80, #00ffff, #0080ff, #0000ff, #8000ff,
                    #ff00ff, #ff0080, #ff0000);
                position: relative;
            }

            .color-slider-marker {
                position: absolute;
                width: 8px;
                height: 20px;
                background: white;
                border: 1px solid #999;
                border-radius: 4px;
                top: -2px;
                transform: translateX(-50%);
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            }

            .color-opacity-slider {
                width: 100%;
                height: 16px;
                border-radius: 8px;
                margin-bottom: 16px;
                cursor: pointer;
                position: relative;
                background: repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%) 50% / 12px 12px;
            }

            .color-opacity-track {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border-radius: 8px;
            }

            .color-section {
                margin-bottom: 16px;
            }

            .color-section-title {
                font-size: 12px;
                font-weight: 600;
                color: #333;
                margin-bottom: 10px;
            }

            .color-palette-grid {
                display: grid;
                grid-template-columns: repeat(8, 1fr);
                gap: 6px;
            }

            .color-swatch {
                width: 100%;
                aspect-ratio: 1;
                border-radius: 4px;
                cursor: pointer;
                border: 2px solid transparent;
                transition: transform 0.1s ease, border-color 0.1s ease;
            }

            .color-swatch:hover {
                transform: scale(1.1);
                border-color: #333;
            }

            .color-swatch.selected {
                border-color: #333;
                box-shadow: 0 0 0 2px white, 0 0 0 3px #333;
            }

            .color-picker-footer {
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                padding: 16px 20px;
                border-top: 1px solid #eee;
            }

            .color-picker-btn {
                padding: 10px 20px;
                border-radius: 6px;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .color-picker-btn-secondary {
                background: white;
                border: 1px solid #ddd;
            }

            .color-picker-btn-secondary:hover {
                background: #f5f5f5;
            }

            .color-picker-btn-primary {
                background: var(--primary-color, #C20430);
                color: white;
                border: none;
            }

            .color-picker-btn-primary:hover {
                filter: brightness(1.1);
            }

            .recent-colors-empty {
                color: #999;
                font-size: 12px;
                text-align: center;
                padding: 10px;
            }

            /* Eyedropper button */
            .eyedropper-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                background: #f5f5f5;
                border: 1px solid #ddd;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                width: 100%;
                margin-bottom: 16px;
            }

            .eyedropper-btn:hover {
                background: #eee;
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * Show color picker
     */
    function show(initialColor = '#C20430', callback = null) {
        // Remove existing
        const existing = document.getElementById('colorPickerModal');
        if (existing) existing.remove();

        currentColor = initialColor;
        currentOpacity = 100;
        onChangeCallback = callback;

        const modal = document.createElement('div');
        modal.id = 'colorPickerModal';
        modal.className = 'color-picker-modal';

        modal.innerHTML = `
            <div class="color-picker-panel">
                <div class="color-picker-header">
                    <h3>Choose Color</h3>
                    <button class="color-picker-close" onclick="ColorPicker.close()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <div class="color-picker-body">
                    <!-- Preview and inputs -->
                    <div class="color-picker-preview">
                        <div class="color-preview-swatch">
                            <div class="color-preview-swatch-inner" id="colorPreviewInner" style="background: ${currentColor}"></div>
                        </div>
                        <div class="color-preview-inputs">
                            <div class="color-input-field">
                                <label>HEX</label>
                                <input type="text" id="hexInput" value="${currentColor}" maxlength="7" onchange="ColorPicker.updateFromHex(this.value)">
                            </div>
                            <div class="color-input-row">
                                <div class="color-input-field">
                                    <label>R</label>
                                    <input type="number" id="rInput" min="0" max="255" value="${hexToRgb(currentColor).r}" onchange="ColorPicker.updateFromRgb()">
                                </div>
                                <div class="color-input-field">
                                    <label>G</label>
                                    <input type="number" id="gInput" min="0" max="255" value="${hexToRgb(currentColor).g}" onchange="ColorPicker.updateFromRgb()">
                                </div>
                                <div class="color-input-field">
                                    <label>B</label>
                                    <input type="number" id="bInput" min="0" max="255" value="${hexToRgb(currentColor).b}" onchange="ColorPicker.updateFromRgb()">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Eyedropper -->
                    <button class="eyedropper-btn" onclick="ColorPicker.startEyedropper()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M2 22l1-1h3l9-9"/>
                            <path d="M3 21v-3l9-9"/>
                            <path d="M14.5 3.5l6 6"/>
                            <path d="M12 6l6 6"/>
                            <circle cx="17" cy="7" r="3"/>
                        </svg>
                        Pick color from screen
                    </button>

                    <!-- Color spectrum -->
                    <div class="color-spectrum" id="colorSpectrum" onmousedown="ColorPicker.startSpectrumDrag(event)">
                        <div class="color-spectrum-marker" id="spectrumMarker"></div>
                    </div>

                    <!-- Hue slider -->
                    <div class="color-hue-slider" id="hueSlider" onmousedown="ColorPicker.startHueDrag(event)">
                        <div class="color-slider-marker" id="hueMarker"></div>
                    </div>

                    <!-- Opacity slider -->
                    <div class="color-section">
                        <div class="color-section-title">Opacity: <span id="opacityValue">100%</span></div>
                        <div class="color-opacity-slider" id="opacitySlider" onmousedown="ColorPicker.startOpacityDrag(event)">
                            <div class="color-opacity-track" id="opacityTrack"></div>
                            <div class="color-slider-marker" id="opacityMarker" style="left: 100%"></div>
                        </div>
                    </div>

                    <!-- Recent colors -->
                    <div class="color-section">
                        <div class="color-section-title">Recent Colors</div>
                        <div class="color-palette-grid" id="recentColorsGrid">
                            ${recentColors.length > 0 ?
                                recentColors.map(c => `<div class="color-swatch" style="background: ${c}" onclick="ColorPicker.selectColor('${c}')"></div>`).join('') :
                                '<div class="recent-colors-empty">No recent colors</div>'
                            }
                        </div>
                    </div>

                    <!-- Color palettes -->
                    ${Object.entries(COLOR_PALETTES).map(([id, palette]) => `
                        <div class="color-section">
                            <div class="color-section-title">${palette.name}</div>
                            <div class="color-palette-grid">
                                ${palette.colors.map(c => `
                                    <div class="color-swatch ${c === currentColor ? 'selected' : ''}"
                                         style="background: ${c}"
                                         onclick="ColorPicker.selectColor('${c}')"></div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="color-picker-footer">
                    <button class="color-picker-btn color-picker-btn-secondary" onclick="ColorPicker.close()">Cancel</button>
                    <button class="color-picker-btn color-picker-btn-primary" onclick="ColorPicker.apply()">Apply</button>
                </div>
            </div>
        `;

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) close();
        });

        document.body.appendChild(modal);

        // Initialize spectrum
        updateSpectrum();

        console.log('[ColorPicker] Opened with color:', currentColor);
    }

    /**
     * Update spectrum from current hue
     */
    function updateSpectrum() {
        const spectrum = document.getElementById('colorSpectrum');
        const hsl = hexToHsl(currentColor);

        if (spectrum) {
            spectrum.style.background = `linear-gradient(to bottom, white, transparent),
                                         linear-gradient(to right, white, hsl(${hsl.h}, 100%, 50%)),
                                         linear-gradient(to bottom, transparent, black)`;
        }

        // Update opacity track
        updateOpacityTrack();

        // Update marker positions
        updateMarkers();
    }

    /**
     * Update opacity track gradient
     */
    function updateOpacityTrack() {
        const track = document.getElementById('opacityTrack');
        if (track) {
            track.style.background = `linear-gradient(to right, transparent, ${currentColor})`;
        }
    }

    /**
     * Update marker positions
     */
    function updateMarkers() {
        const hsl = hexToHsl(currentColor);

        // Hue marker
        const hueMarker = document.getElementById('hueMarker');
        if (hueMarker) {
            hueMarker.style.left = `${(hsl.h / 360) * 100}%`;
        }

        // Spectrum marker
        const spectrumMarker = document.getElementById('spectrumMarker');
        if (spectrumMarker) {
            spectrumMarker.style.left = `${hsl.s}%`;
            spectrumMarker.style.top = `${100 - hsl.l}%`;
        }
    }

    /**
     * Select a color
     */
    function selectColor(color) {
        currentColor = color;
        updateUI();
        updateSpectrum();

        // Highlight selected swatch
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.classList.toggle('selected', swatch.style.background === color || rgbToHex(swatch.style.background) === color);
        });
    }

    /**
     * Update UI to reflect current color
     */
    function updateUI() {
        const rgb = hexToRgb(currentColor);

        // Update preview
        const preview = document.getElementById('colorPreviewInner');
        if (preview) {
            preview.style.background = currentColor;
            preview.style.opacity = currentOpacity / 100;
        }

        // Update inputs
        const hexInput = document.getElementById('hexInput');
        const rInput = document.getElementById('rInput');
        const gInput = document.getElementById('gInput');
        const bInput = document.getElementById('bInput');

        if (hexInput) hexInput.value = currentColor;
        if (rInput) rInput.value = rgb.r;
        if (gInput) gInput.value = rgb.g;
        if (bInput) bInput.value = rgb.b;

        // Update opacity display
        const opacityValue = document.getElementById('opacityValue');
        if (opacityValue) opacityValue.textContent = `${currentOpacity}%`;
    }

    /**
     * Update from HEX input
     */
    function updateFromHex(hex) {
        if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
            currentColor = hex.toUpperCase();
            updateUI();
            updateSpectrum();
        }
    }

    /**
     * Update from RGB inputs
     */
    function updateFromRgb() {
        const r = parseInt(document.getElementById('rInput').value) || 0;
        const g = parseInt(document.getElementById('gInput').value) || 0;
        const b = parseInt(document.getElementById('bInput').value) || 0;

        currentColor = rgbToHex(`rgb(${r}, ${g}, ${b})`);
        updateUI();
        updateSpectrum();
    }

    /**
     * Start spectrum drag
     */
    function startSpectrumDrag(e) {
        const spectrum = document.getElementById('colorSpectrum');
        if (!spectrum) return;

        const updateFromPosition = (e) => {
            const rect = spectrum.getBoundingClientRect();
            const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

            const hsl = hexToHsl(currentColor);
            const saturation = x * 100;
            const lightness = (1 - y) * 100;

            currentColor = hslToHex(hsl.h, saturation, lightness);
            updateUI();
            updateOpacityTrack();

            const marker = document.getElementById('spectrumMarker');
            if (marker) {
                marker.style.left = `${x * 100}%`;
                marker.style.top = `${y * 100}%`;
            }
        };

        updateFromPosition(e);

        const onMove = (e) => updateFromPosition(e);
        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }

    /**
     * Start hue drag
     */
    function startHueDrag(e) {
        const slider = document.getElementById('hueSlider');
        if (!slider) return;

        const updateFromPosition = (e) => {
            const rect = slider.getBoundingClientRect();
            const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const hue = x * 360;

            const hsl = hexToHsl(currentColor);
            currentColor = hslToHex(hue, hsl.s, hsl.l);
            updateUI();
            updateSpectrum();

            const marker = document.getElementById('hueMarker');
            if (marker) marker.style.left = `${x * 100}%`;
        };

        updateFromPosition(e);

        const onMove = (e) => updateFromPosition(e);
        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }

    /**
     * Start opacity drag
     */
    function startOpacityDrag(e) {
        const slider = document.getElementById('opacitySlider');
        if (!slider) return;

        const updateFromPosition = (e) => {
            const rect = slider.getBoundingClientRect();
            const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            currentOpacity = Math.round(x * 100);

            const opacityValue = document.getElementById('opacityValue');
            if (opacityValue) opacityValue.textContent = `${currentOpacity}%`;

            const preview = document.getElementById('colorPreviewInner');
            if (preview) preview.style.opacity = currentOpacity / 100;

            const marker = document.getElementById('opacityMarker');
            if (marker) marker.style.left = `${x * 100}%`;
        };

        updateFromPosition(e);

        const onMove = (e) => updateFromPosition(e);
        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }

    /**
     * Start eyedropper
     */
    async function startEyedropper() {
        if (!window.EyeDropper) {
            alert('Eyedropper not supported in this browser');
            return;
        }

        try {
            const eyeDropper = new EyeDropper();
            const result = await eyeDropper.open();
            selectColor(result.sRGBHex);
        } catch (e) {
            console.log('[ColorPicker] Eyedropper cancelled');
        }
    }

    /**
     * Apply the selected color
     */
    function apply() {
        // Save to recent
        addToRecent(currentColor);

        // Call callback
        if (onChangeCallback) {
            const result = {
                hex: currentColor,
                rgb: hexToRgb(currentColor),
                opacity: currentOpacity,
                rgba: `rgba(${hexToRgb(currentColor).r}, ${hexToRgb(currentColor).g}, ${hexToRgb(currentColor).b}, ${currentOpacity / 100})`
            };
            onChangeCallback(result);
        }

        close();
    }

    /**
     * Add color to recent
     */
    function addToRecent(color) {
        recentColors = recentColors.filter(c => c !== color);
        recentColors.unshift(color);
        recentColors = recentColors.slice(0, 16);
        localStorage.setItem('colorPicker_recent', JSON.stringify(recentColors));
    }

    /**
     * Close the color picker
     */
    function close() {
        const modal = document.getElementById('colorPickerModal');
        if (modal) modal.remove();
    }

    // =========================================================================
    // Color conversion utilities
    // =========================================================================

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    function rgbToHex(rgb) {
        if (typeof rgb === 'string') {
            const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (match) {
                const r = parseInt(match[1]);
                const g = parseInt(match[2]);
                const b = parseInt(match[3]);
                return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
            }
        }
        return rgb;
    }

    function hexToHsl(hex) {
        const rgb = hexToRgb(hex);
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    function hslToHex(h, s, l) {
        s /= 100;
        l /= 100;

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;

        if (0 <= h && h < 60) { r = c; g = x; b = 0; }
        else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
        else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
        else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
        else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
        else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
    }

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    return {
        show,
        close,
        apply,
        selectColor,
        updateFromHex,
        updateFromRgb,
        startSpectrumDrag,
        startHueDrag,
        startOpacityDrag,
        startEyedropper,
        hexToRgb,
        rgbToHex,
        hexToHsl,
        hslToHex,
        PALETTES: COLOR_PALETTES,
        isLoaded: true
    };
})();

// Export globally
window.ColorPicker = ColorPicker;

console.log('[ColorPicker] Loaded - Advanced color selection ready');
