/**
 * Animation System
 * CSS-based animations for elements with preview and export support
 */
const Animations = (function() {
    'use strict';

    // Animation definitions
    const ANIMATIONS = {
        // Entrance animations
        entrance: {
            label: 'Entrance',
            animations: {
                fadeIn: {
                    name: 'Fade In',
                    keyframes: `
                        0% { opacity: 0; }
                        100% { opacity: 1; }
                    `,
                    duration: 500,
                    easing: 'ease-out'
                },
                fadeInUp: {
                    name: 'Fade In Up',
                    keyframes: `
                        0% { opacity: 0; transform: translateY(30px); }
                        100% { opacity: 1; transform: translateY(0); }
                    `,
                    duration: 600,
                    easing: 'ease-out'
                },
                fadeInDown: {
                    name: 'Fade In Down',
                    keyframes: `
                        0% { opacity: 0; transform: translateY(-30px); }
                        100% { opacity: 1; transform: translateY(0); }
                    `,
                    duration: 600,
                    easing: 'ease-out'
                },
                fadeInLeft: {
                    name: 'Fade In Left',
                    keyframes: `
                        0% { opacity: 0; transform: translateX(-30px); }
                        100% { opacity: 1; transform: translateX(0); }
                    `,
                    duration: 600,
                    easing: 'ease-out'
                },
                fadeInRight: {
                    name: 'Fade In Right',
                    keyframes: `
                        0% { opacity: 0; transform: translateX(30px); }
                        100% { opacity: 1; transform: translateX(0); }
                    `,
                    duration: 600,
                    easing: 'ease-out'
                },
                scaleIn: {
                    name: 'Scale In',
                    keyframes: `
                        0% { opacity: 0; transform: scale(0.5); }
                        100% { opacity: 1; transform: scale(1); }
                    `,
                    duration: 500,
                    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                },
                slideInUp: {
                    name: 'Slide In Up',
                    keyframes: `
                        0% { transform: translateY(100%); }
                        100% { transform: translateY(0); }
                    `,
                    duration: 500,
                    easing: 'ease-out'
                },
                slideInDown: {
                    name: 'Slide In Down',
                    keyframes: `
                        0% { transform: translateY(-100%); }
                        100% { transform: translateY(0); }
                    `,
                    duration: 500,
                    easing: 'ease-out'
                },
                zoomIn: {
                    name: 'Zoom In',
                    keyframes: `
                        0% { opacity: 0; transform: scale(0); }
                        100% { opacity: 1; transform: scale(1); }
                    `,
                    duration: 400,
                    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                },
                bounceIn: {
                    name: 'Bounce In',
                    keyframes: `
                        0% { opacity: 0; transform: scale(0.3); }
                        50% { transform: scale(1.1); }
                        70% { transform: scale(0.9); }
                        100% { opacity: 1; transform: scale(1); }
                    `,
                    duration: 700,
                    easing: 'ease-out'
                },
                flipInX: {
                    name: 'Flip In X',
                    keyframes: `
                        0% { opacity: 0; transform: perspective(400px) rotateX(90deg); }
                        40% { transform: perspective(400px) rotateX(-20deg); }
                        60% { opacity: 1; transform: perspective(400px) rotateX(10deg); }
                        80% { transform: perspective(400px) rotateX(-5deg); }
                        100% { transform: perspective(400px) rotateX(0); }
                    `,
                    duration: 800,
                    easing: 'ease-in-out'
                },
                flipInY: {
                    name: 'Flip In Y',
                    keyframes: `
                        0% { opacity: 0; transform: perspective(400px) rotateY(90deg); }
                        40% { transform: perspective(400px) rotateY(-20deg); }
                        60% { opacity: 1; transform: perspective(400px) rotateY(10deg); }
                        80% { transform: perspective(400px) rotateY(-5deg); }
                        100% { transform: perspective(400px) rotateY(0); }
                    `,
                    duration: 800,
                    easing: 'ease-in-out'
                },
                rotateIn: {
                    name: 'Rotate In',
                    keyframes: `
                        0% { opacity: 0; transform: rotate(-180deg) scale(0.5); }
                        100% { opacity: 1; transform: rotate(0) scale(1); }
                    `,
                    duration: 600,
                    easing: 'ease-out'
                }
            }
        },

        // Emphasis animations (for attention)
        emphasis: {
            label: 'Emphasis',
            animations: {
                pulse: {
                    name: 'Pulse',
                    keyframes: `
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.05); }
                    `,
                    duration: 1000,
                    easing: 'ease-in-out',
                    iterations: 'infinite'
                },
                bounce: {
                    name: 'Bounce',
                    keyframes: `
                        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                        40% { transform: translateY(-20px); }
                        60% { transform: translateY(-10px); }
                    `,
                    duration: 1000,
                    easing: 'ease',
                    iterations: 'infinite'
                },
                shake: {
                    name: 'Shake',
                    keyframes: `
                        0%, 100% { transform: translateX(0); }
                        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                        20%, 40%, 60%, 80% { transform: translateX(5px); }
                    `,
                    duration: 500,
                    easing: 'ease-in-out'
                },
                swing: {
                    name: 'Swing',
                    keyframes: `
                        0% { transform: rotate(0deg); }
                        20% { transform: rotate(15deg); }
                        40% { transform: rotate(-10deg); }
                        60% { transform: rotate(5deg); }
                        80% { transform: rotate(-5deg); }
                        100% { transform: rotate(0deg); }
                    `,
                    duration: 800,
                    easing: 'ease-in-out',
                    transformOrigin: 'top center'
                },
                rubberBand: {
                    name: 'Rubber Band',
                    keyframes: `
                        0% { transform: scale(1, 1); }
                        30% { transform: scale(1.25, 0.75); }
                        40% { transform: scale(0.75, 1.25); }
                        50% { transform: scale(1.15, 0.85); }
                        65% { transform: scale(0.95, 1.05); }
                        75% { transform: scale(1.05, 0.95); }
                        100% { transform: scale(1, 1); }
                    `,
                    duration: 800,
                    easing: 'ease-in-out'
                },
                wobble: {
                    name: 'Wobble',
                    keyframes: `
                        0% { transform: translateX(0) rotate(0); }
                        15% { transform: translateX(-15px) rotate(-5deg); }
                        30% { transform: translateX(10px) rotate(3deg); }
                        45% { transform: translateX(-10px) rotate(-3deg); }
                        60% { transform: translateX(5px) rotate(2deg); }
                        75% { transform: translateX(-5px) rotate(-1deg); }
                        100% { transform: translateX(0) rotate(0); }
                    `,
                    duration: 1000,
                    easing: 'ease-in-out'
                },
                heartbeat: {
                    name: 'Heartbeat',
                    keyframes: `
                        0%, 100% { transform: scale(1); }
                        14% { transform: scale(1.1); }
                        28% { transform: scale(1); }
                        42% { transform: scale(1.1); }
                        70% { transform: scale(1); }
                    `,
                    duration: 1300,
                    easing: 'ease-in-out',
                    iterations: 'infinite'
                },
                flash: {
                    name: 'Flash',
                    keyframes: `
                        0%, 50%, 100% { opacity: 1; }
                        25%, 75% { opacity: 0; }
                    `,
                    duration: 1000,
                    easing: 'ease-in-out'
                }
            }
        },

        // Exit animations
        exit: {
            label: 'Exit',
            animations: {
                fadeOut: {
                    name: 'Fade Out',
                    keyframes: `
                        0% { opacity: 1; }
                        100% { opacity: 0; }
                    `,
                    duration: 500,
                    easing: 'ease-in'
                },
                fadeOutUp: {
                    name: 'Fade Out Up',
                    keyframes: `
                        0% { opacity: 1; transform: translateY(0); }
                        100% { opacity: 0; transform: translateY(-30px); }
                    `,
                    duration: 600,
                    easing: 'ease-in'
                },
                fadeOutDown: {
                    name: 'Fade Out Down',
                    keyframes: `
                        0% { opacity: 1; transform: translateY(0); }
                        100% { opacity: 0; transform: translateY(30px); }
                    `,
                    duration: 600,
                    easing: 'ease-in'
                },
                scaleOut: {
                    name: 'Scale Out',
                    keyframes: `
                        0% { opacity: 1; transform: scale(1); }
                        100% { opacity: 0; transform: scale(0.5); }
                    `,
                    duration: 500,
                    easing: 'ease-in'
                },
                zoomOut: {
                    name: 'Zoom Out',
                    keyframes: `
                        0% { opacity: 1; transform: scale(1); }
                        100% { opacity: 0; transform: scale(0); }
                    `,
                    duration: 400,
                    easing: 'ease-in'
                },
                slideOutUp: {
                    name: 'Slide Out Up',
                    keyframes: `
                        0% { transform: translateY(0); }
                        100% { transform: translateY(-100%); }
                    `,
                    duration: 500,
                    easing: 'ease-in'
                },
                rotateOut: {
                    name: 'Rotate Out',
                    keyframes: `
                        0% { opacity: 1; transform: rotate(0) scale(1); }
                        100% { opacity: 0; transform: rotate(180deg) scale(0.5); }
                    `,
                    duration: 600,
                    easing: 'ease-in'
                }
            }
        },

        // Text-specific animations
        text: {
            label: 'Text',
            animations: {
                typewriter: {
                    name: 'Typewriter',
                    keyframes: `
                        0% { width: 0; }
                        100% { width: 100%; }
                    `,
                    duration: 2000,
                    easing: 'steps(40, end)',
                    customSetup: (el) => {
                        el.style.overflow = 'hidden';
                        el.style.whiteSpace = 'nowrap';
                    }
                },
                colorChange: {
                    name: 'Color Change',
                    keyframes: `
                        0% { color: inherit; }
                        50% { color: #6c5ce7; }
                        100% { color: inherit; }
                    `,
                    duration: 2000,
                    easing: 'ease-in-out',
                    iterations: 'infinite'
                },
                tracking: {
                    name: 'Letter Spacing',
                    keyframes: `
                        0% { letter-spacing: -0.5em; opacity: 0; }
                        40% { opacity: 0.6; }
                        100% { letter-spacing: normal; opacity: 1; }
                    `,
                    duration: 800,
                    easing: 'ease-out'
                },
                blur: {
                    name: 'Blur In',
                    keyframes: `
                        0% { filter: blur(12px); opacity: 0; }
                        100% { filter: blur(0); opacity: 1; }
                    `,
                    duration: 800,
                    easing: 'ease-out'
                }
            }
        }
    };

    // Easing presets
    const EASINGS = {
        linear: 'linear',
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
        bounce: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
    };

    // State
    let registeredAnimations = {};
    let currentPreview = null;

    /**
     * Register animation keyframes in stylesheet
     */
    function registerAnimation(id, animation) {
        if (registeredAnimations[id]) return;

        const styleId = `animation-${id}`;
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes ${id} {
                ${animation.keyframes}
            }
        `;
        document.head.appendChild(style);
        registeredAnimations[id] = true;
    }

    /**
     * Apply animation to element
     */
    function applyAnimation(element, animationId, options = {}) {
        const animation = getAnimation(animationId);
        if (!animation) return;

        // Register keyframes
        registerAnimation(animationId, animation);

        // Merge options with defaults
        const {
            duration = animation.duration,
            delay = 0,
            easing = animation.easing,
            iterations = animation.iterations || 1,
            fillMode = 'forwards'
        } = options;

        // Custom setup if needed
        if (animation.customSetup) {
            animation.customSetup(element);
        }

        // Apply transform origin if specified
        if (animation.transformOrigin) {
            element.style.transformOrigin = animation.transformOrigin;
        }

        // Apply animation
        element.style.animation = `${animationId} ${duration}ms ${easing} ${delay}ms ${iterations} ${fillMode}`;

        // Store animation data
        element.dataset.animation = JSON.stringify({
            id: animationId,
            duration,
            delay,
            easing,
            iterations
        });

        return {
            pause: () => { element.style.animationPlayState = 'paused'; },
            play: () => { element.style.animationPlayState = 'running'; },
            stop: () => { element.style.animation = 'none'; }
        };
    }

    /**
     * Remove animation from element
     */
    function removeAnimation(element) {
        element.style.animation = 'none';
        delete element.dataset.animation;
    }

    /**
     * Get animation by ID
     */
    function getAnimation(animationId) {
        for (const category of Object.values(ANIMATIONS)) {
            if (category.animations[animationId]) {
                return category.animations[animationId];
            }
        }
        return null;
    }

    /**
     * Get all animations
     */
    function getAllAnimations() {
        const all = [];
        for (const [catId, category] of Object.entries(ANIMATIONS)) {
            for (const [animId, anim] of Object.entries(category.animations)) {
                all.push({
                    id: animId,
                    category: catId,
                    categoryLabel: category.label,
                    ...anim
                });
            }
        }
        return all;
    }

    /**
     * Preview animation on element
     */
    function previewAnimation(element, animationId) {
        // Stop any current preview
        if (currentPreview) {
            currentPreview.stop();
        }

        currentPreview = applyAnimation(element, animationId);

        // Auto-stop preview after animation completes
        const animation = getAnimation(animationId);
        if (animation && animation.iterations !== 'infinite') {
            setTimeout(() => {
                if (currentPreview) {
                    removeAnimation(element);
                    currentPreview = null;
                }
            }, animation.duration + 100);
        }

        return currentPreview;
    }

    /**
     * Show animation panel
     */
    function showPanel(element, onApply) {
        const existing = document.querySelector('.animations-panel');
        if (existing) existing.remove();

        const panel = document.createElement('div');
        panel.className = 'animations-panel';
        panel.innerHTML = `
            <div class="animations-header">
                <h3>Animations</h3>
                <button class="animations-close">&times;</button>
            </div>
            <div class="animations-content">
                ${Object.entries(ANIMATIONS).map(([catId, category]) => `
                    <div class="animation-category">
                        <h4>${category.label}</h4>
                        <div class="animation-grid">
                            ${Object.entries(category.animations).map(([animId, anim]) => `
                                <button class="animation-btn" data-animation="${animId}">
                                    <div class="anim-preview-box">
                                        <div class="anim-preview-el"></div>
                                    </div>
                                    <span>${anim.name}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="animations-options">
                <div class="option-row">
                    <label>Duration</label>
                    <input type="range" id="animDuration" min="200" max="3000" value="500" step="100">
                    <span class="option-value" id="durationValue">500ms</span>
                </div>
                <div class="option-row">
                    <label>Delay</label>
                    <input type="range" id="animDelay" min="0" max="2000" value="0" step="100">
                    <span class="option-value" id="delayValue">0ms</span>
                </div>
            </div>
            <div class="animations-actions">
                <button class="btn-remove">Remove Animation</button>
                <button class="btn-apply" disabled>Apply</button>
            </div>
        `;

        // State
        let selectedAnimation = null;

        // Event handlers
        panel.querySelector('.animations-close').onclick = () => panel.remove();

        panel.querySelectorAll('.animation-btn').forEach(btn => {
            btn.onclick = () => {
                panel.querySelectorAll('.animation-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedAnimation = btn.dataset.animation;
                panel.querySelector('.btn-apply').disabled = false;

                // Preview
                previewAnimation(element, selectedAnimation);
            };
        });

        // Duration slider
        const durationSlider = panel.querySelector('#animDuration');
        const durationValue = panel.querySelector('#durationValue');
        durationSlider.oninput = () => {
            durationValue.textContent = `${durationSlider.value}ms`;
        };

        // Delay slider
        const delaySlider = panel.querySelector('#animDelay');
        const delayValue = panel.querySelector('#delayValue');
        delaySlider.oninput = () => {
            delayValue.textContent = `${delaySlider.value}ms`;
        };

        // Remove button
        panel.querySelector('.btn-remove').onclick = () => {
            removeAnimation(element);
            if (onApply) onApply(null);
        };

        // Apply button
        panel.querySelector('.btn-apply').onclick = () => {
            if (selectedAnimation) {
                applyAnimation(element, selectedAnimation, {
                    duration: parseInt(durationSlider.value),
                    delay: parseInt(delaySlider.value)
                });
                if (onApply) onApply(selectedAnimation);
            }
        };

        document.body.appendChild(panel);

        return panel;
    }

    /**
     * Initialize styles
     */
    function init() {
        if (document.getElementById('animations-styles')) return;

        const style = document.createElement('style');
        style.id = 'animations-styles';
        style.textContent = `
            .animations-panel {
                position: fixed;
                right: 20px;
                top: 100px;
                width: 320px;
                background: #1a1a2e;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                z-index: 10005;
                overflow: hidden;
            }

            .animations-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .animations-header h3 {
                margin: 0;
                color: #fff;
                font-size: 16px;
            }

            .animations-close {
                background: none;
                border: none;
                color: #888;
                font-size: 24px;
                cursor: pointer;
            }

            .animations-content {
                max-height: 350px;
                overflow-y: auto;
                padding: 15px;
            }

            .animation-category {
                margin-bottom: 20px;
            }

            .animation-category h4 {
                margin: 0 0 10px;
                color: #6c5ce7;
                font-size: 12px;
                text-transform: uppercase;
            }

            .animation-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
            }

            .animation-btn {
                padding: 8px;
                background: rgba(255,255,255,0.03);
                border: 2px solid transparent;
                border-radius: 8px;
                cursor: pointer;
                text-align: center;
                transition: all 0.2s;
            }

            .animation-btn:hover {
                background: rgba(255,255,255,0.05);
            }

            .animation-btn.selected {
                border-color: #6c5ce7;
                background: rgba(108,92,231,0.1);
            }

            .anim-preview-box {
                width: 100%;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 4px;
            }

            .anim-preview-el {
                width: 20px;
                height: 20px;
                background: #6c5ce7;
                border-radius: 4px;
            }

            .animation-btn span {
                display: block;
                font-size: 10px;
                color: #aaa;
            }

            .animations-options {
                padding: 15px;
                border-top: 1px solid rgba(255,255,255,0.1);
            }

            .option-row {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 10px;
            }

            .option-row label {
                width: 60px;
                font-size: 12px;
                color: #888;
            }

            .option-row input[type="range"] {
                flex: 1;
                -webkit-appearance: none;
                height: 4px;
                background: rgba(255,255,255,0.1);
                border-radius: 2px;
            }

            .option-row input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 12px;
                height: 12px;
                background: #6c5ce7;
                border-radius: 50%;
                cursor: pointer;
            }

            .option-value {
                width: 50px;
                text-align: right;
                font-size: 12px;
                color: #aaa;
                font-family: monospace;
            }

            .animations-actions {
                display: flex;
                gap: 10px;
                padding: 15px;
                border-top: 1px solid rgba(255,255,255,0.1);
            }

            .animations-actions button {
                flex: 1;
                padding: 10px;
                border-radius: 8px;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .btn-remove {
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                color: #aaa;
            }

            .btn-remove:hover {
                background: rgba(220,53,69,0.2);
                border-color: rgba(220,53,69,0.3);
                color: #ff6b6b;
            }

            .btn-apply {
                background: #6c5ce7;
                border: none;
                color: #fff;
            }

            .btn-apply:hover:not(:disabled) {
                background: #5b4cdb;
            }

            .btn-apply:disabled {
                opacity: 0.5;
                cursor: not-allowed;
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

    // Create flat lookup of all animations for easier counting
    const ALL_ANIMATIONS_FLAT = {};
    for (const [catId, category] of Object.entries(ANIMATIONS)) {
        if (category.animations) {
            for (const [animId, anim] of Object.entries(category.animations)) {
                ALL_ANIMATIONS_FLAT[animId] = { ...anim, category: catId };
            }
        }
    }

    // Public API
    return {
        init,
        ANIMATIONS,
        ALL_ANIMATIONS: ALL_ANIMATIONS_FLAT,  // Flat map for easy counting
        EASINGS,
        applyAnimation,
        removeAnimation,
        getAnimation,
        getAllAnimations,
        previewAnimation,
        showPanel,
        isLoaded: true
    };
})();

// Global export
window.Animations = Animations;
// Alias for compatibility
window.AnimationSystem = Animations;
