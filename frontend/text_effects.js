// ============================================================================
// TEXT EFFECTS SYSTEM
// Drop shadows, outlines, gradients, and letter spacing for text elements
// ============================================================================

(function() {
    'use strict';

    // ========================================================================
    // TEXT EFFECTS STATE
    // ========================================================================

    const TextEffectsState = {
        selectedTextElement: null,
        currentEffects: {
            shadow: { enabled: false, x: 2, y: 2, blur: 4, color: '#000000', opacity: 0.3 },
            outline: { enabled: false, width: 1, color: '#000000' },
            gradient: { enabled: false, startColor: '#4A1420', endColor: '#1e3a5f', angle: 135 },
            letterSpacing: 0
        }
    };

    // ========================================================================
    // INITIALIZATION
    // ========================================================================

    function initTextEffects() {
        console.log('🎨 Initializing text effects system...');

        // Listen for text element selection
        document.addEventListener('click', handleTextSelection);

        console.log('✅ Text effects system initialized');
    }

    function handleTextSelection(event) {
        const textElement = event.target.closest('.editable, [contenteditable="true"]');
        if (textElement) {
            TextEffectsState.selectedTextElement = textElement;
            loadCurrentEffects(textElement);
            showTextEffectsPanel();
        }
    }

    // ========================================================================
    // TEXT EFFECTS PANEL
    // ========================================================================

    function createTextEffectsPanel() {
        // Check if panel already exists
        if (document.getElementById('textEffectsPanel')) return;

        const panel = document.createElement('div');
        panel.id = 'textEffectsPanel';
        panel.className = 'text-effects-panel';
        panel.innerHTML = `
            <div class="text-effects-section">
                <h4 class="section-title">Text Effects</h4>

                <!-- Preview -->
                <div class="text-shadow-preview" id="textEffectPreview">
                    Sample Text
                </div>

                <!-- Drop Shadow -->
                <div class="text-effect-group">
                    <label class="effect-toggle">
                        <input type="checkbox" id="shadowEnabled" onchange="TextEffects.toggleShadow(this.checked)">
                        <span>Drop Shadow</span>
                    </label>
                    <div class="effect-controls" id="shadowControls" style="display: none;">
                        <div class="text-effect-row">
                            <label>X Offset</label>
                            <input type="range" id="shadowX" min="-20" max="20" value="2"
                                   oninput="TextEffects.updateShadow()">
                            <span id="shadowXValue">2px</span>
                        </div>
                        <div class="text-effect-row">
                            <label>Y Offset</label>
                            <input type="range" id="shadowY" min="-20" max="20" value="2"
                                   oninput="TextEffects.updateShadow()">
                            <span id="shadowYValue">2px</span>
                        </div>
                        <div class="text-effect-row">
                            <label>Blur</label>
                            <input type="range" id="shadowBlur" min="0" max="20" value="4"
                                   oninput="TextEffects.updateShadow()">
                            <span id="shadowBlurValue">4px</span>
                        </div>
                        <div class="text-effect-row">
                            <label>Color</label>
                            <input type="color" id="shadowColor" value="#000000"
                                   oninput="TextEffects.updateShadow()">
                        </div>
                        <div class="text-effect-row">
                            <label>Opacity</label>
                            <input type="range" id="shadowOpacity" min="0" max="100" value="30"
                                   oninput="TextEffects.updateShadow()">
                            <span id="shadowOpacityValue">30%</span>
                        </div>
                    </div>
                </div>

                <!-- Text Outline -->
                <div class="text-effect-group">
                    <label class="effect-toggle">
                        <input type="checkbox" id="outlineEnabled" onchange="TextEffects.toggleOutline(this.checked)">
                        <span>Text Outline</span>
                    </label>
                    <div class="effect-controls" id="outlineControls" style="display: none;">
                        <div class="text-effect-row">
                            <label>Width</label>
                            <input type="range" id="outlineWidth" min="1" max="5" value="1"
                                   oninput="TextEffects.updateOutline()">
                            <span id="outlineWidthValue">1px</span>
                        </div>
                        <div class="text-effect-row">
                            <label>Color</label>
                            <input type="color" id="outlineColor" value="#000000"
                                   oninput="TextEffects.updateOutline()">
                        </div>
                    </div>
                </div>

                <!-- Gradient Fill -->
                <div class="text-effect-group">
                    <label class="effect-toggle">
                        <input type="checkbox" id="gradientEnabled" onchange="TextEffects.toggleGradient(this.checked)">
                        <span>Gradient Fill</span>
                    </label>
                    <div class="effect-controls" id="gradientControls" style="display: none;">
                        <div class="text-effect-row">
                            <label>Start</label>
                            <input type="color" id="gradientStart" value="#4A1420"
                                   oninput="TextEffects.updateGradient()">
                        </div>
                        <div class="text-effect-row">
                            <label>End</label>
                            <input type="color" id="gradientEnd" value="#1e3a5f"
                                   oninput="TextEffects.updateGradient()">
                        </div>
                        <div class="text-effect-row">
                            <label>Angle</label>
                            <input type="range" id="gradientAngle" min="0" max="360" value="135"
                                   oninput="TextEffects.updateGradient()">
                            <span id="gradientAngleValue">135°</span>
                        </div>
                    </div>
                </div>

                <!-- Letter Spacing -->
                <div class="text-effect-group">
                    <div class="text-effect-row">
                        <label>Letter Spacing</label>
                        <input type="range" id="letterSpacing" min="-5" max="20" value="0"
                               oninput="TextEffects.updateLetterSpacing(this.value)">
                        <span id="letterSpacingValue">0px</span>
                    </div>
                </div>

                <!-- Reset Button -->
                <button class="reset-effects-btn" onclick="TextEffects.resetAll()">
                    Reset All Effects
                </button>
            </div>
        `;

        // Add styles for the panel
        const style = document.createElement('style');
        style.textContent = `
            .text-effects-panel {
                display: none;
            }

            .text-effects-panel.visible {
                display: block;
            }

            .text-effect-group {
                margin-bottom: 12px;
                padding-bottom: 12px;
                border-bottom: 1px solid #e5e7eb;
            }

            .text-effect-group:last-of-type {
                border-bottom: none;
            }

            .effect-toggle {
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                color: #374151;
                margin-bottom: 8px;
            }

            .effect-toggle input[type="checkbox"] {
                width: 16px;
                height: 16px;
                accent-color: var(--doorstep-red, #4A1420);
            }

            .effect-controls {
                padding-left: 24px;
            }

            .reset-effects-btn {
                width: 100%;
                padding: 8px;
                margin-top: 8px;
                background: #f3f4f6;
                border: 1px solid #e5e7eb;
                border-radius: 4px;
                font-size: 12px;
                color: #6b7280;
                cursor: pointer;
                transition: all 0.15s;
            }

            .reset-effects-btn:hover {
                background: #e5e7eb;
                color: #374151;
            }
        `;

        document.head.appendChild(style);
        return panel;
    }

    function showTextEffectsPanel() {
        let panel = document.getElementById('textEffectsPanel');
        if (!panel) {
            panel = createTextEffectsPanel();
            // Add to the right panel or properties area
            const rightPanel = document.querySelector('.right-panels-container, .properties-panel, #elementsPanel');
            if (rightPanel) {
                rightPanel.appendChild(panel);
            } else {
                document.body.appendChild(panel);
            }
        }
        panel.classList.add('visible');
        updatePanelFromState();
    }

    function hideTextEffectsPanel() {
        const panel = document.getElementById('textEffectsPanel');
        if (panel) {
            panel.classList.remove('visible');
        }
    }

    // ========================================================================
    // EFFECT CONTROLS
    // ========================================================================

    function toggleShadow(enabled) {
        TextEffectsState.currentEffects.shadow.enabled = enabled;
        const controls = document.getElementById('shadowControls');
        if (controls) {
            controls.style.display = enabled ? 'block' : 'none';
        }
        applyEffects();
    }

    function updateShadow() {
        const shadow = TextEffectsState.currentEffects.shadow;
        shadow.x = parseInt(document.getElementById('shadowX')?.value || 2);
        shadow.y = parseInt(document.getElementById('shadowY')?.value || 2);
        shadow.blur = parseInt(document.getElementById('shadowBlur')?.value || 4);
        shadow.color = document.getElementById('shadowColor')?.value || '#000000';
        shadow.opacity = parseInt(document.getElementById('shadowOpacity')?.value || 30) / 100;

        // Update display values
        updateDisplayValue('shadowXValue', shadow.x + 'px');
        updateDisplayValue('shadowYValue', shadow.y + 'px');
        updateDisplayValue('shadowBlurValue', shadow.blur + 'px');
        updateDisplayValue('shadowOpacityValue', Math.round(shadow.opacity * 100) + '%');

        applyEffects();
    }

    function toggleOutline(enabled) {
        TextEffectsState.currentEffects.outline.enabled = enabled;
        const controls = document.getElementById('outlineControls');
        if (controls) {
            controls.style.display = enabled ? 'block' : 'none';
        }
        applyEffects();
    }

    function updateOutline() {
        const outline = TextEffectsState.currentEffects.outline;
        outline.width = parseInt(document.getElementById('outlineWidth')?.value || 1);
        outline.color = document.getElementById('outlineColor')?.value || '#000000';

        updateDisplayValue('outlineWidthValue', outline.width + 'px');

        applyEffects();
    }

    function toggleGradient(enabled) {
        TextEffectsState.currentEffects.gradient.enabled = enabled;
        const controls = document.getElementById('gradientControls');
        if (controls) {
            controls.style.display = enabled ? 'block' : 'none';
        }
        applyEffects();
    }

    function updateGradient() {
        const gradient = TextEffectsState.currentEffects.gradient;
        gradient.startColor = document.getElementById('gradientStart')?.value || '#4A1420';
        gradient.endColor = document.getElementById('gradientEnd')?.value || '#1e3a5f';
        gradient.angle = parseInt(document.getElementById('gradientAngle')?.value || 135);

        updateDisplayValue('gradientAngleValue', gradient.angle + '°');

        applyEffects();
    }

    function updateLetterSpacing(value) {
        TextEffectsState.currentEffects.letterSpacing = parseInt(value);
        updateDisplayValue('letterSpacingValue', value + 'px');
        applyEffects();
    }

    function updateDisplayValue(elementId, value) {
        const el = document.getElementById(elementId);
        if (el) el.textContent = value;
    }

    // ========================================================================
    // APPLY EFFECTS
    // ========================================================================

    function applyEffects() {
        const element = TextEffectsState.selectedTextElement;
        if (!element) return;

        const effects = TextEffectsState.currentEffects;
        let styles = {};

        // Text shadow
        if (effects.shadow.enabled) {
            const { x, y, blur, color, opacity } = effects.shadow;
            const rgba = hexToRgba(color, opacity);
            styles.textShadow = `${x}px ${y}px ${blur}px ${rgba}`;
        } else {
            styles.textShadow = 'none';
        }

        // Text outline (using text-stroke)
        if (effects.outline.enabled) {
            styles.webkitTextStroke = `${effects.outline.width}px ${effects.outline.color}`;
        } else {
            styles.webkitTextStroke = 'unset';
        }

        // Gradient fill
        if (effects.gradient.enabled) {
            const { startColor, endColor, angle } = effects.gradient;
            styles.background = `linear-gradient(${angle}deg, ${startColor}, ${endColor})`;
            styles.webkitBackgroundClip = 'text';
            styles.webkitTextFillColor = 'transparent';
            styles.backgroundClip = 'text';
        } else {
            styles.background = 'unset';
            styles.webkitBackgroundClip = 'unset';
            styles.webkitTextFillColor = 'unset';
            styles.backgroundClip = 'unset';
        }

        // Letter spacing
        styles.letterSpacing = effects.letterSpacing + 'px';

        // Apply styles to element
        Object.assign(element.style, styles);

        // Update preview
        updatePreview();

        // Store effects in data attribute for persistence
        element.dataset.textEffects = JSON.stringify(effects);

        // Mark dirty
        if (typeof EditorState !== 'undefined') {
            EditorState.isDirty = true;
        }

        console.log('🎨 Applied text effects');
    }

    function updatePreview() {
        const preview = document.getElementById('textEffectPreview');
        if (!preview) return;

        const effects = TextEffectsState.currentEffects;

        // Apply same styles to preview
        if (effects.shadow.enabled) {
            const { x, y, blur, color, opacity } = effects.shadow;
            preview.style.textShadow = `${x}px ${y}px ${blur}px ${hexToRgba(color, opacity)}`;
        } else {
            preview.style.textShadow = 'none';
        }

        if (effects.outline.enabled) {
            preview.style.webkitTextStroke = `${effects.outline.width}px ${effects.outline.color}`;
        } else {
            preview.style.webkitTextStroke = 'unset';
        }

        if (effects.gradient.enabled) {
            const { startColor, endColor, angle } = effects.gradient;
            preview.style.background = `linear-gradient(${angle}deg, ${startColor}, ${endColor})`;
            preview.style.webkitBackgroundClip = 'text';
            preview.style.webkitTextFillColor = 'transparent';
        } else {
            preview.style.background = 'unset';
            preview.style.webkitBackgroundClip = 'unset';
            preview.style.webkitTextFillColor = 'unset';
        }

        preview.style.letterSpacing = effects.letterSpacing + 'px';
    }

    // ========================================================================
    // LOAD/RESET
    // ========================================================================

    function loadCurrentEffects(element) {
        const storedEffects = element.dataset.textEffects;
        if (storedEffects) {
            try {
                TextEffectsState.currentEffects = JSON.parse(storedEffects);
            } catch (e) {
                console.warn('Could not parse stored text effects');
            }
        } else {
            // Reset to defaults
            resetEffectsState();
        }
        updatePanelFromState();
    }

    function updatePanelFromState() {
        const effects = TextEffectsState.currentEffects;

        // Shadow
        const shadowEnabled = document.getElementById('shadowEnabled');
        const shadowControls = document.getElementById('shadowControls');
        if (shadowEnabled) shadowEnabled.checked = effects.shadow.enabled;
        if (shadowControls) shadowControls.style.display = effects.shadow.enabled ? 'block' : 'none';

        setInputValue('shadowX', effects.shadow.x);
        setInputValue('shadowY', effects.shadow.y);
        setInputValue('shadowBlur', effects.shadow.blur);
        setInputValue('shadowColor', effects.shadow.color);
        setInputValue('shadowOpacity', effects.shadow.opacity * 100);

        // Outline
        const outlineEnabled = document.getElementById('outlineEnabled');
        const outlineControls = document.getElementById('outlineControls');
        if (outlineEnabled) outlineEnabled.checked = effects.outline.enabled;
        if (outlineControls) outlineControls.style.display = effects.outline.enabled ? 'block' : 'none';

        setInputValue('outlineWidth', effects.outline.width);
        setInputValue('outlineColor', effects.outline.color);

        // Gradient
        const gradientEnabled = document.getElementById('gradientEnabled');
        const gradientControls = document.getElementById('gradientControls');
        if (gradientEnabled) gradientEnabled.checked = effects.gradient.enabled;
        if (gradientControls) gradientControls.style.display = effects.gradient.enabled ? 'block' : 'none';

        setInputValue('gradientStart', effects.gradient.startColor);
        setInputValue('gradientEnd', effects.gradient.endColor);
        setInputValue('gradientAngle', effects.gradient.angle);

        // Letter spacing
        setInputValue('letterSpacing', effects.letterSpacing);

        updatePreview();
    }

    function setInputValue(id, value) {
        const el = document.getElementById(id);
        if (el) el.value = value;
    }

    function resetEffectsState() {
        TextEffectsState.currentEffects = {
            shadow: { enabled: false, x: 2, y: 2, blur: 4, color: '#000000', opacity: 0.3 },
            outline: { enabled: false, width: 1, color: '#000000' },
            gradient: { enabled: false, startColor: '#4A1420', endColor: '#1e3a5f', angle: 135 },
            letterSpacing: 0
        };
    }

    function resetAll() {
        resetEffectsState();
        updatePanelFromState();
        applyEffects();

        if (typeof showToast === 'function') {
            showToast('Text effects reset', 'info');
        }
    }

    // ========================================================================
    // UTILITIES
    // ========================================================================

    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // ========================================================================
    // EXPOSE TO GLOBAL SCOPE
    // ========================================================================

    window.TextEffects = {
        init: initTextEffects,
        show: showTextEffectsPanel,
        hide: hideTextEffectsPanel,
        toggleShadow,
        updateShadow,
        toggleOutline,
        updateOutline,
        toggleGradient,
        updateGradient,
        updateLetterSpacing,
        resetAll,
        applyEffects,
        getPanel: createTextEffectsPanel
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTextEffects);
    } else {
        setTimeout(initTextEffects, 600);
    }

})();
