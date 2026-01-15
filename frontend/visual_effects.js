/**
 * Visual Effects System - Canva-like effects for brochure editor
 * Shadows, gradients, blur, and blend modes
 */

(function() {
    'use strict';

    // ============================================================================
    // EFFECT PRESETS
    // ============================================================================

    const SHADOW_PRESETS = {
        none: { offsetX: 0, offsetY: 0, blur: 0, spread: 0, color: 'transparent', opacity: 0 },
        subtle: { offsetX: 0, offsetY: 2, blur: 8, spread: 0, color: '#000000', opacity: 0.1 },
        soft: { offsetX: 0, offsetY: 4, blur: 16, spread: 0, color: '#000000', opacity: 0.15 },
        medium: { offsetX: 0, offsetY: 8, blur: 24, spread: -4, color: '#000000', opacity: 0.2 },
        strong: { offsetX: 0, offsetY: 12, blur: 32, spread: -8, color: '#000000', opacity: 0.25 },
        dramatic: { offsetX: 0, offsetY: 20, blur: 48, spread: -12, color: '#000000', opacity: 0.3 },
        lifted: { offsetX: 0, offsetY: 24, blur: 64, spread: -16, color: '#000000', opacity: 0.2 },
        floating: { offsetX: 0, offsetY: 32, blur: 80, spread: -20, color: '#000000', opacity: 0.25 }
    };

    const GRADIENT_PRESETS = {
        sunset: { type: 'linear', angle: 135, colors: ['#FF512F', '#DD2476'] },
        ocean: { type: 'linear', angle: 135, colors: ['#2193b0', '#6dd5ed'] },
        forest: { type: 'linear', angle: 135, colors: ['#134E5E', '#71B280'] },
        lavender: { type: 'linear', angle: 135, colors: ['#834d9b', '#d04ed6'] },
        gold: { type: 'linear', angle: 135, colors: ['#f2994a', '#f2c94c'] },
        midnight: { type: 'linear', angle: 135, colors: ['#232526', '#414345'] },
        fire: { type: 'linear', angle: 135, colors: ['#f12711', '#f5af19'] },
        arctic: { type: 'linear', angle: 135, colors: ['#74ebd5', '#ACB6E5'] },
        royal: { type: 'linear', angle: 135, colors: ['#141E30', '#243B55'] },
        rose: { type: 'linear', angle: 135, colors: ['#ee9ca7', '#ffdde1'] },
        spring: { type: 'radial', colors: ['#00d2ff', '#3a7bd5'] },
        warm: { type: 'radial', colors: ['#f5af19', '#f12711'] }
    };

    const BLEND_MODES = [
        { value: 'normal', label: 'Normal' },
        { value: 'multiply', label: 'Multiply' },
        { value: 'screen', label: 'Screen' },
        { value: 'overlay', label: 'Overlay' },
        { value: 'darken', label: 'Darken' },
        { value: 'lighten', label: 'Lighten' },
        { value: 'color-dodge', label: 'Color Dodge' },
        { value: 'color-burn', label: 'Color Burn' },
        { value: 'hard-light', label: 'Hard Light' },
        { value: 'soft-light', label: 'Soft Light' },
        { value: 'difference', label: 'Difference' },
        { value: 'exclusion', label: 'Exclusion' },
        { value: 'hue', label: 'Hue' },
        { value: 'saturation', label: 'Saturation' },
        { value: 'color', label: 'Color' },
        { value: 'luminosity', label: 'Luminosity' }
    ];

    // ============================================================================
    // EFFECT APPLICATION FUNCTIONS
    // ============================================================================

    /**
     * Apply shadow to an element
     */
    function applyShadow(element, options = {}) {
        const { offsetX = 0, offsetY = 4, blur = 16, spread = 0, color = '#000000', opacity = 0.2 } = options;

        // Convert hex color to rgba
        const rgba = hexToRgba(color, opacity);
        const shadow = `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${rgba}`;

        element.style.boxShadow = shadow;

        // Store effect data
        element.dataset.shadowEffect = JSON.stringify(options);

        return element;
    }

    /**
     * Apply gradient fill to an element
     */
    function applyGradient(element, options = {}) {
        const { type = 'linear', angle = 135, colors = ['#C20430', '#8b1a1a'] } = options;

        let gradient;
        if (type === 'linear') {
            gradient = `linear-gradient(${angle}deg, ${colors.join(', ')})`;
        } else if (type === 'radial') {
            gradient = `radial-gradient(circle, ${colors.join(', ')})`;
        } else if (type === 'conic') {
            gradient = `conic-gradient(from ${angle}deg, ${colors.join(', ')})`;
        }

        element.style.background = gradient;

        // Store effect data
        element.dataset.gradientEffect = JSON.stringify(options);

        return element;
    }

    /**
     * Apply blur effect to an element (typically images)
     */
    function applyBlur(element, amount = 0) {
        element.style.filter = amount > 0 ? `blur(${amount}px)` : '';
        element.dataset.blurEffect = amount.toString();
        return element;
    }

    /**
     * Apply blend mode to an element
     */
    function applyBlendMode(element, mode = 'normal') {
        element.style.mixBlendMode = mode;
        element.dataset.blendMode = mode;
        return element;
    }

    /**
     * Apply opacity to an element
     */
    function applyOpacity(element, opacity = 1) {
        element.style.opacity = opacity;
        element.dataset.opacity = opacity.toString();
        return element;
    }

    /**
     * Apply border radius to an element
     */
    function applyBorderRadius(element, radius = 0) {
        element.style.borderRadius = typeof radius === 'number' ? `${radius}px` : radius;
        element.dataset.borderRadius = radius.toString();
        return element;
    }

    /**
     * Apply rotation to an element
     */
    function applyRotation(element, degrees = 0) {
        const currentTransform = element.style.transform || '';
        const cleanTransform = currentTransform.replace(/rotate\([^)]+\)/g, '').trim();
        element.style.transform = `${cleanTransform} rotate(${degrees}deg)`.trim();
        element.dataset.rotation = degrees.toString();
        return element;
    }

    // ============================================================================
    // HELPER FUNCTIONS
    // ============================================================================

    function hexToRgba(hex, opacity) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            const r = parseInt(result[1], 16);
            const g = parseInt(result[2], 16);
            const b = parseInt(result[3], 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        return `rgba(0, 0, 0, ${opacity})`;
    }

    function rgbaToHex(rgba) {
        const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            const r = parseInt(match[1]).toString(16).padStart(2, '0');
            const g = parseInt(match[2]).toString(16).padStart(2, '0');
            const b = parseInt(match[3]).toString(16).padStart(2, '0');
            return `#${r}${g}${b}`;
        }
        return '#000000';
    }

    // ============================================================================
    // EFFECTS PANEL UI
    // ============================================================================

    function renderEffectsPanel(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="effects-panel">
                <h3 class="effects-title">Visual Effects</h3>

                <!-- Shadow Section -->
                <div class="effects-section">
                    <div class="section-header" data-section="shadow">
                        <span class="section-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <rect x="7" y="7" width="18" height="18" rx="2" fill="none" stroke-dasharray="4"/>
                            </svg>
                        </span>
                        <span>Shadow</span>
                        <span class="section-toggle">+</span>
                    </div>
                    <div class="section-content" id="shadow-content">
                        <div class="shadow-presets">
                            ${Object.entries(SHADOW_PRESETS).map(([key, preset]) => `
                                <button class="preset-btn shadow-preset" data-shadow="${key}" title="${key}">
                                    <div class="preset-preview" style="box-shadow: ${preset.offsetX}px ${preset.offsetY}px ${preset.blur}px ${hexToRgba(preset.color, preset.opacity)};"></div>
                                    <span>${key}</span>
                                </button>
                            `).join('')}
                        </div>
                        <div class="shadow-custom">
                            <div class="slider-row">
                                <label>X Offset</label>
                                <input type="range" id="shadowOffsetX" min="-50" max="50" value="0">
                                <span class="slider-value">0</span>
                            </div>
                            <div class="slider-row">
                                <label>Y Offset</label>
                                <input type="range" id="shadowOffsetY" min="-50" max="50" value="4">
                                <span class="slider-value">4</span>
                            </div>
                            <div class="slider-row">
                                <label>Blur</label>
                                <input type="range" id="shadowBlur" min="0" max="100" value="16">
                                <span class="slider-value">16</span>
                            </div>
                            <div class="slider-row">
                                <label>Opacity</label>
                                <input type="range" id="shadowOpacity" min="0" max="100" value="20">
                                <span class="slider-value">20%</span>
                            </div>
                            <div class="color-row">
                                <label>Color</label>
                                <input type="color" id="shadowColor" value="#000000">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Gradient Section -->
                <div class="effects-section">
                    <div class="section-header" data-section="gradient">
                        <span class="section-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <defs>
                                    <linearGradient id="gradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style="stop-color:#C20430"/>
                                        <stop offset="100%" style="stop-color:#f5af19"/>
                                    </linearGradient>
                                </defs>
                                <rect x="3" y="3" width="18" height="18" rx="2" fill="url(#gradIcon)"/>
                            </svg>
                        </span>
                        <span>Gradient</span>
                        <span class="section-toggle">+</span>
                    </div>
                    <div class="section-content" id="gradient-content" style="display:none;">
                        <div class="gradient-presets">
                            ${Object.entries(GRADIENT_PRESETS).map(([key, preset]) => {
                                const bg = preset.type === 'linear'
                                    ? `linear-gradient(${preset.angle}deg, ${preset.colors.join(', ')})`
                                    : `radial-gradient(circle, ${preset.colors.join(', ')})`;
                                return `
                                    <button class="preset-btn gradient-preset" data-gradient="${key}" title="${key}">
                                        <div class="preset-preview" style="background: ${bg};"></div>
                                        <span>${key}</span>
                                    </button>
                                `;
                            }).join('')}
                        </div>
                        <div class="gradient-custom">
                            <div class="select-row">
                                <label>Type</label>
                                <select id="gradientType">
                                    <option value="linear">Linear</option>
                                    <option value="radial">Radial</option>
                                    <option value="conic">Conic</option>
                                </select>
                            </div>
                            <div class="slider-row">
                                <label>Angle</label>
                                <input type="range" id="gradientAngle" min="0" max="360" value="135">
                                <span class="slider-value">135°</span>
                            </div>
                            <div class="color-row">
                                <label>Color 1</label>
                                <input type="color" id="gradientColor1" value="#C20430">
                            </div>
                            <div class="color-row">
                                <label>Color 2</label>
                                <input type="color" id="gradientColor2" value="#8b1a1a">
                            </div>
                            <button class="apply-btn" id="applyGradientBtn">Apply Gradient</button>
                            <button class="remove-btn" id="removeGradientBtn">Remove</button>
                        </div>
                    </div>
                </div>

                <!-- Blur Section -->
                <div class="effects-section">
                    <div class="section-header" data-section="blur">
                        <span class="section-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10" stroke-dasharray="3"/>
                            </svg>
                        </span>
                        <span>Blur</span>
                        <span class="section-toggle">+</span>
                    </div>
                    <div class="section-content" id="blur-content" style="display:none;">
                        <div class="slider-row">
                            <label>Amount</label>
                            <input type="range" id="blurAmount" min="0" max="20" value="0" step="0.5">
                            <span class="slider-value">0px</span>
                        </div>
                        <div class="blur-presets">
                            <button class="preset-btn blur-preset" data-blur="0">None</button>
                            <button class="preset-btn blur-preset" data-blur="2">Subtle</button>
                            <button class="preset-btn blur-preset" data-blur="5">Soft</button>
                            <button class="preset-btn blur-preset" data-blur="10">Strong</button>
                        </div>
                    </div>
                </div>

                <!-- Blend Mode Section -->
                <div class="effects-section">
                    <div class="section-header" data-section="blend">
                        <span class="section-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="9" cy="9" r="7"/>
                                <circle cx="15" cy="15" r="7"/>
                            </svg>
                        </span>
                        <span>Blend Mode</span>
                        <span class="section-toggle">+</span>
                    </div>
                    <div class="section-content" id="blend-content" style="display:none;">
                        <div class="select-row">
                            <select id="blendMode">
                                ${BLEND_MODES.map(mode => `
                                    <option value="${mode.value}">${mode.label}</option>
                                `).join('')}
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Opacity Section -->
                <div class="effects-section">
                    <div class="section-header" data-section="opacity">
                        <span class="section-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" opacity="0.5"/>
                            </svg>
                        </span>
                        <span>Opacity</span>
                        <span class="section-toggle">+</span>
                    </div>
                    <div class="section-content" id="opacity-content" style="display:none;">
                        <div class="slider-row">
                            <input type="range" id="opacitySlider" min="0" max="100" value="100">
                            <span class="slider-value">100%</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Attach event listeners
        initEffectsPanelEvents(container);
    }

    function initEffectsPanelEvents(container) {
        // Section toggles
        container.querySelectorAll('.section-header').forEach(header => {
            header.addEventListener('click', () => {
                const section = header.dataset.section;
                const content = container.querySelector(`#${section}-content`);
                const toggle = header.querySelector('.section-toggle');

                if (content) {
                    const isOpen = content.style.display !== 'none';
                    content.style.display = isOpen ? 'none' : 'block';
                    toggle.textContent = isOpen ? '+' : '-';
                }
            });
        });

        // Shadow presets
        container.querySelectorAll('.shadow-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                const presetName = btn.dataset.shadow;
                const preset = SHADOW_PRESETS[presetName];
                if (preset) applyToSelectedElement('shadow', preset);
            });
        });

        // Shadow sliders
        ['shadowOffsetX', 'shadowOffsetY', 'shadowBlur', 'shadowOpacity'].forEach(id => {
            const slider = container.querySelector(`#${id}`);
            if (slider) {
                slider.addEventListener('input', () => {
                    updateShadowFromSliders(container);
                });
            }
        });

        // Shadow color
        const shadowColor = container.querySelector('#shadowColor');
        if (shadowColor) {
            shadowColor.addEventListener('input', () => {
                updateShadowFromSliders(container);
            });
        }

        // Gradient presets
        container.querySelectorAll('.gradient-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                const presetName = btn.dataset.gradient;
                const preset = GRADIENT_PRESETS[presetName];
                if (preset) applyToSelectedElement('gradient', preset);
            });
        });

        // Gradient apply button
        const applyGradientBtn = container.querySelector('#applyGradientBtn');
        if (applyGradientBtn) {
            applyGradientBtn.addEventListener('click', () => {
                const type = container.querySelector('#gradientType').value;
                const angle = parseInt(container.querySelector('#gradientAngle').value);
                const color1 = container.querySelector('#gradientColor1').value;
                const color2 = container.querySelector('#gradientColor2').value;
                applyToSelectedElement('gradient', { type, angle, colors: [color1, color2] });
            });
        }

        // Remove gradient button
        const removeGradientBtn = container.querySelector('#removeGradientBtn');
        if (removeGradientBtn) {
            removeGradientBtn.addEventListener('click', () => {
                const selected = getSelectedElement();
                if (selected) {
                    selected.style.background = '';
                    delete selected.dataset.gradientEffect;
                }
            });
        }

        // Blur presets
        container.querySelectorAll('.blur-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                const amount = parseFloat(btn.dataset.blur);
                applyToSelectedElement('blur', amount);
                container.querySelector('#blurAmount').value = amount;
                container.querySelector('#blur-content .slider-value').textContent = amount + 'px';
            });
        });

        // Blur slider
        const blurSlider = container.querySelector('#blurAmount');
        if (blurSlider) {
            blurSlider.addEventListener('input', () => {
                const amount = parseFloat(blurSlider.value);
                applyToSelectedElement('blur', amount);
                container.querySelector('#blur-content .slider-value').textContent = amount + 'px';
            });
        }

        // Blend mode
        const blendSelect = container.querySelector('#blendMode');
        if (blendSelect) {
            blendSelect.addEventListener('change', () => {
                applyToSelectedElement('blend', blendSelect.value);
            });
        }

        // Opacity slider
        const opacitySlider = container.querySelector('#opacitySlider');
        if (opacitySlider) {
            opacitySlider.addEventListener('input', () => {
                const opacity = parseInt(opacitySlider.value) / 100;
                applyToSelectedElement('opacity', opacity);
                container.querySelector('#opacity-content .slider-value').textContent = opacitySlider.value + '%';
            });
        }

        // Gradient angle slider
        const gradientAngle = container.querySelector('#gradientAngle');
        if (gradientAngle) {
            gradientAngle.addEventListener('input', () => {
                container.querySelector('#gradient-content .slider-value').textContent = gradientAngle.value + '°';
            });
        }
    }

    function updateShadowFromSliders(container) {
        const offsetX = parseInt(container.querySelector('#shadowOffsetX').value);
        const offsetY = parseInt(container.querySelector('#shadowOffsetY').value);
        const blur = parseInt(container.querySelector('#shadowBlur').value);
        const opacity = parseInt(container.querySelector('#shadowOpacity').value) / 100;
        const color = container.querySelector('#shadowColor').value;

        // Update value displays
        container.querySelectorAll('#shadow-content .slider-row').forEach(row => {
            const slider = row.querySelector('input[type="range"]');
            const display = row.querySelector('.slider-value');
            if (slider && display) {
                const val = slider.value;
                if (slider.id === 'shadowOpacity') {
                    display.textContent = val + '%';
                } else {
                    display.textContent = val;
                }
            }
        });

        applyToSelectedElement('shadow', { offsetX, offsetY, blur, spread: 0, color, opacity });
    }

    function applyToSelectedElement(effectType, value) {
        const element = getSelectedElement();
        if (!element) {
            console.warn('No element selected');
            return;
        }

        switch (effectType) {
            case 'shadow':
                applyShadow(element, value);
                break;
            case 'gradient':
                applyGradient(element, value);
                break;
            case 'blur':
                applyBlur(element, value);
                break;
            case 'blend':
                applyBlendMode(element, value);
                break;
            case 'opacity':
                applyOpacity(element, value);
                break;
        }

        // Mark dirty
        if (window.EditorState) {
            window.EditorState.isDirty = true;
        }

        // Save to history
        if (typeof saveToHistory === 'function') {
            saveToHistory(`apply ${effectType} effect`);
        }
    }

    function getSelectedElement() {
        if (window.EditorState?.selectedElement) {
            return window.EditorState.selectedElement;
        }
        if (window.EditorState?.selectedElements?.length > 0) {
            return window.EditorState.selectedElements[0];
        }
        return document.querySelector('.design-element.selected, .shape-element.selected, .brochure-element.selected, [data-selected="true"]');
    }

    /**
     * Update panel to reflect current element's effects
     */
    function updatePanelFromElement(element) {
        if (!element) return;

        const container = document.querySelector('.effects-panel');
        if (!container) return;

        // Update shadow controls
        if (element.dataset.shadowEffect) {
            try {
                const shadow = JSON.parse(element.dataset.shadowEffect);
                const offsetXSlider = container.querySelector('#shadowOffsetX');
                const offsetYSlider = container.querySelector('#shadowOffsetY');
                const blurSlider = container.querySelector('#shadowBlur');
                const opacitySlider = container.querySelector('#shadowOpacity');
                const colorInput = container.querySelector('#shadowColor');

                if (offsetXSlider) offsetXSlider.value = shadow.offsetX || 0;
                if (offsetYSlider) offsetYSlider.value = shadow.offsetY || 0;
                if (blurSlider) blurSlider.value = shadow.blur || 0;
                if (opacitySlider) opacitySlider.value = (shadow.opacity || 0) * 100;
                if (colorInput) colorInput.value = shadow.color || '#000000';
            } catch (e) {}
        }

        // Update opacity
        if (element.dataset.opacity) {
            const opacitySlider = container.querySelector('#opacitySlider');
            if (opacitySlider) {
                opacitySlider.value = parseFloat(element.dataset.opacity) * 100;
            }
        }

        // Update blur
        if (element.dataset.blurEffect) {
            const blurSlider = container.querySelector('#blurAmount');
            if (blurSlider) {
                blurSlider.value = parseFloat(element.dataset.blurEffect);
            }
        }

        // Update blend mode
        if (element.dataset.blendMode) {
            const blendSelect = container.querySelector('#blendMode');
            if (blendSelect) {
                blendSelect.value = element.dataset.blendMode;
            }
        }
    }

    // ============================================================================
    // EXPORT TO GLOBAL SCOPE
    // ============================================================================

    window.VisualEffects = {
        // Effect functions
        applyShadow,
        applyGradient,
        applyBlur,
        applyBlendMode,
        applyOpacity,
        applyBorderRadius,
        applyRotation,

        // Panel
        renderPanel: renderEffectsPanel,
        updatePanelFromElement,

        // Presets
        SHADOW_PRESETS,
        GRADIENT_PRESETS,
        BLEND_MODES,

        // Helpers
        hexToRgba,
        rgbaToHex
    };

    console.log('Visual Effects System loaded');

})();
