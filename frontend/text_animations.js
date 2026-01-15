/**
 * Text Animations - CSS-based text effects for brochures
 * Fade, slide, typewriter, glow, and more
 */

(function() {
    'use strict';

    // ============================================================================
    // ANIMATION PRESETS
    // ============================================================================

    const ANIMATIONS = {
        // Fade animations
        fadeIn: {
            name: 'Fade In',
            category: 'fade',
            icon: '💫',
            css: `
                animation: fadeIn 1s ease forwards;
            `,
            keyframes: `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `
        },
        fadeInUp: {
            name: 'Fade In Up',
            category: 'fade',
            icon: '⬆️',
            css: `
                animation: fadeInUp 0.8s ease forwards;
            `,
            keyframes: `
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `
        },
        fadeInDown: {
            name: 'Fade In Down',
            category: 'fade',
            icon: '⬇️',
            css: `
                animation: fadeInDown 0.8s ease forwards;
            `,
            keyframes: `
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `
        },
        fadeInLeft: {
            name: 'Fade In Left',
            category: 'fade',
            icon: '⬅️',
            css: `
                animation: fadeInLeft 0.8s ease forwards;
            `,
            keyframes: `
                @keyframes fadeInLeft {
                    from { opacity: 0; transform: translateX(-30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `
        },
        fadeInRight: {
            name: 'Fade In Right',
            category: 'fade',
            icon: '➡️',
            css: `
                animation: fadeInRight 0.8s ease forwards;
            `,
            keyframes: `
                @keyframes fadeInRight {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `
        },

        // Scale animations
        zoomIn: {
            name: 'Zoom In',
            category: 'scale',
            icon: '🔍',
            css: `
                animation: zoomIn 0.6s ease forwards;
            `,
            keyframes: `
                @keyframes zoomIn {
                    from { opacity: 0; transform: scale(0.5); }
                    to { opacity: 1; transform: scale(1); }
                }
            `
        },
        zoomInBounce: {
            name: 'Zoom Bounce',
            category: 'scale',
            icon: '🏀',
            css: `
                animation: zoomInBounce 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
            `,
            keyframes: `
                @keyframes zoomInBounce {
                    from { opacity: 0; transform: scale(0.3); }
                    50% { transform: scale(1.1); }
                    to { opacity: 1; transform: scale(1); }
                }
            `
        },
        popIn: {
            name: 'Pop In',
            category: 'scale',
            icon: '💥',
            css: `
                animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            `,
            keyframes: `
                @keyframes popIn {
                    0% { opacity: 0; transform: scale(0); }
                    50% { transform: scale(1.2); }
                    100% { opacity: 1; transform: scale(1); }
                }
            `
        },

        // Slide animations
        slideInLeft: {
            name: 'Slide Left',
            category: 'slide',
            icon: '◀️',
            css: `
                animation: slideInLeft 0.6s ease forwards;
            `,
            keyframes: `
                @keyframes slideInLeft {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                }
            `
        },
        slideInRight: {
            name: 'Slide Right',
            category: 'slide',
            icon: '▶️',
            css: `
                animation: slideInRight 0.6s ease forwards;
            `,
            keyframes: `
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `
        },
        slideInUp: {
            name: 'Slide Up',
            category: 'slide',
            icon: '🔼',
            css: `
                animation: slideInUp 0.6s ease forwards;
            `,
            keyframes: `
                @keyframes slideInUp {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
            `
        },

        // Attention seekers
        bounce: {
            name: 'Bounce',
            category: 'attention',
            icon: '🎾',
            css: `
                animation: bounce 1s ease infinite;
            `,
            keyframes: `
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-20px); }
                    60% { transform: translateY(-10px); }
                }
            `
        },
        pulse: {
            name: 'Pulse',
            category: 'attention',
            icon: '💓',
            css: `
                animation: pulse 1.5s ease-in-out infinite;
            `,
            keyframes: `
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
            `
        },
        shake: {
            name: 'Shake',
            category: 'attention',
            icon: '🫨',
            css: `
                animation: shake 0.8s ease-in-out;
            `,
            keyframes: `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
            `
        },
        wobble: {
            name: 'Wobble',
            category: 'attention',
            icon: '🌊',
            css: `
                animation: wobble 1s ease-in-out;
            `,
            keyframes: `
                @keyframes wobble {
                    0% { transform: rotate(0deg); }
                    15% { transform: rotate(-5deg); }
                    30% { transform: rotate(3deg); }
                    45% { transform: rotate(-3deg); }
                    60% { transform: rotate(2deg); }
                    75% { transform: rotate(-1deg); }
                    100% { transform: rotate(0deg); }
                }
            `
        },
        heartbeat: {
            name: 'Heartbeat',
            category: 'attention',
            icon: '❤️',
            css: `
                animation: heartbeat 1.5s ease-in-out infinite;
            `,
            keyframes: `
                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    14% { transform: scale(1.1); }
                    28% { transform: scale(1); }
                    42% { transform: scale(1.1); }
                    70% { transform: scale(1); }
                }
            `
        },

        // Text specific
        typewriter: {
            name: 'Typewriter',
            category: 'text',
            icon: '⌨️',
            css: `
                overflow: hidden;
                white-space: nowrap;
                animation: typing 3s steps(40, end), blinkCursor 0.75s step-end infinite;
                border-right: 2px solid;
            `,
            keyframes: `
                @keyframes typing {
                    from { width: 0; }
                    to { width: 100%; }
                }
                @keyframes blinkCursor {
                    from, to { border-color: transparent; }
                    50% { border-color: currentColor; }
                }
            `
        },
        glowPulse: {
            name: 'Glow Pulse',
            category: 'text',
            icon: '✨',
            css: `
                animation: glowPulse 2s ease-in-out infinite;
            `,
            keyframes: `
                @keyframes glowPulse {
                    0%, 100% { text-shadow: 0 0 5px currentColor, 0 0 10px currentColor; }
                    50% { text-shadow: 0 0 20px currentColor, 0 0 30px currentColor, 0 0 40px currentColor; }
                }
            `
        },
        colorShift: {
            name: 'Color Shift',
            category: 'text',
            icon: '🌈',
            css: `
                animation: colorShift 4s linear infinite;
                background-size: 200% 100%;
            `,
            keyframes: `
                @keyframes colorShift {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `
        },
        letterSpacing: {
            name: 'Letter Expand',
            category: 'text',
            icon: '📏',
            css: `
                animation: letterSpacing 1s ease forwards;
            `,
            keyframes: `
                @keyframes letterSpacing {
                    from { letter-spacing: -0.5em; opacity: 0; }
                    to { letter-spacing: normal; opacity: 1; }
                }
            `
        },

        // Rotate
        flipIn: {
            name: 'Flip In',
            category: 'rotate',
            icon: '🔄',
            css: `
                animation: flipIn 0.8s ease forwards;
                backface-visibility: visible;
            `,
            keyframes: `
                @keyframes flipIn {
                    from { transform: perspective(400px) rotateY(90deg); opacity: 0; }
                    40% { transform: perspective(400px) rotateY(-10deg); }
                    70% { transform: perspective(400px) rotateY(10deg); }
                    to { transform: perspective(400px) rotateY(0deg); opacity: 1; }
                }
            `
        },
        rotateIn: {
            name: 'Rotate In',
            category: 'rotate',
            icon: '🔃',
            css: `
                animation: rotateIn 0.6s ease forwards;
            `,
            keyframes: `
                @keyframes rotateIn {
                    from { transform: rotate(-200deg); opacity: 0; }
                    to { transform: rotate(0); opacity: 1; }
                }
            `
        }
    };

    // ============================================================================
    // ANIMATION APPLICATION
    // ============================================================================

    /**
     * Apply animation to element
     */
    function applyAnimation(element, animationId, options = {}) {
        const animation = ANIMATIONS[animationId];
        if (!animation) {
            console.error(`Unknown animation: ${animationId}`);
            return;
        }

        // Remove existing animation classes
        element.classList.remove('animated');
        element.style.animation = '';

        // Force reflow
        void element.offsetWidth;

        // Add keyframes if not already added
        ensureKeyframes(animationId);

        // Apply animation
        const duration = options.duration || 1;
        const delay = options.delay || 0;
        const iterations = options.iterations || (animation.category === 'attention' ? 'infinite' : 1);

        // Parse CSS and modify values
        let animCSS = animation.css;
        animCSS = animCSS.replace(/(\d+\.?\d*)s/g, (match, num) => `${parseFloat(num) * duration}s`);

        element.style.cssText += animCSS;
        element.style.animationDelay = `${delay}s`;
        element.style.animationIterationCount = iterations;
        element.classList.add('animated');

        // Store animation info
        element.dataset.animation = animationId;
        element.dataset.animationDuration = duration;
        element.dataset.animationDelay = delay;

        showToast(`Applied "${animation.name}" animation`);
    }

    /**
     * Remove animation from element
     */
    function removeAnimation(element) {
        element.classList.remove('animated');
        element.style.animation = '';
        element.style.animationDelay = '';
        element.style.animationIterationCount = '';
        delete element.dataset.animation;
        delete element.dataset.animationDuration;
        delete element.dataset.animationDelay;
    }

    /**
     * Replay animation
     */
    function replayAnimation(element) {
        const animationId = element.dataset.animation;
        if (!animationId) return;

        element.style.animation = 'none';
        void element.offsetWidth;
        applyAnimation(element, animationId, {
            duration: parseFloat(element.dataset.animationDuration) || 1,
            delay: parseFloat(element.dataset.animationDelay) || 0
        });
    }

    /**
     * Ensure keyframes are added to document
     */
    const addedKeyframes = new Set();

    function ensureKeyframes(animationId) {
        if (addedKeyframes.has(animationId)) return;

        const animation = ANIMATIONS[animationId];
        if (!animation || !animation.keyframes) return;

        const style = document.createElement('style');
        style.textContent = animation.keyframes;
        document.head.appendChild(style);
        addedKeyframes.add(animationId);
    }

    // ============================================================================
    // UI RENDERING
    // ============================================================================

    /**
     * Render animations panel
     */
    function renderAnimationsPanel(container) {
        const categories = {
            fade: { name: 'Fade', icon: '💫' },
            scale: { name: 'Scale', icon: '🔍' },
            slide: { name: 'Slide', icon: '➡️' },
            attention: { name: 'Attention', icon: '👀' },
            text: { name: 'Text', icon: '✏️' },
            rotate: { name: 'Rotate', icon: '🔄' }
        };

        let html = `
            <div class="animations-panel">
                <div class="panel-header">
                    <h3>Text Animations</h3>
                </div>

                <div class="animation-controls">
                    <div class="control-row">
                        <label>Duration</label>
                        <input type="range" id="animDuration" min="0.2" max="3" step="0.1" value="1">
                        <span id="animDurationVal">1s</span>
                    </div>
                    <div class="control-row">
                        <label>Delay</label>
                        <input type="range" id="animDelay" min="0" max="2" step="0.1" value="0">
                        <span id="animDelayVal">0s</span>
                    </div>
                </div>

                ${Object.entries(categories).map(([catId, cat]) => `
                    <div class="animation-category">
                        <div class="category-header">
                            <span class="category-icon">${cat.icon}</span>
                            <span class="category-name">${cat.name}</span>
                        </div>
                        <div class="animations-grid">
                            ${Object.entries(ANIMATIONS)
                                .filter(([id, anim]) => anim.category === catId)
                                .map(([id, anim]) => `
                                    <button class="animation-btn" data-animation="${id}" title="${anim.name}">
                                        <span class="anim-icon">${anim.icon}</span>
                                        <span class="anim-name">${anim.name}</span>
                                    </button>
                                `).join('')}
                        </div>
                    </div>
                `).join('')}

                <div class="animation-actions">
                    <button class="btn btn-secondary" id="replayAnimBtn">Replay</button>
                    <button class="btn btn-secondary" id="removeAnimBtn">Remove</button>
                </div>
            </div>
        `;

        container.innerHTML = html;
        initAnimationsEvents(container);
    }

    /**
     * Initialize panel events
     */
    function initAnimationsEvents(container) {
        const durationSlider = container.querySelector('#animDuration');
        const durationVal = container.querySelector('#animDurationVal');
        const delaySlider = container.querySelector('#animDelay');
        const delayVal = container.querySelector('#animDelayVal');

        durationSlider?.addEventListener('input', () => {
            durationVal.textContent = `${durationSlider.value}s`;
        });

        delaySlider?.addEventListener('input', () => {
            delayVal.textContent = `${delaySlider.value}s`;
        });

        // Animation buttons
        container.querySelectorAll('.animation-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedEl = document.querySelector('.design-element.selected, .brochure-element.selected');
                if (!selectedEl) {
                    showToast('Select an element first');
                    return;
                }

                applyAnimation(selectedEl, btn.dataset.animation, {
                    duration: parseFloat(durationSlider?.value || 1),
                    delay: parseFloat(delaySlider?.value || 0)
                });
            });
        });

        // Replay button
        container.querySelector('#replayAnimBtn')?.addEventListener('click', () => {
            const selectedEl = document.querySelector('.design-element.selected, .brochure-element.selected');
            if (selectedEl) {
                replayAnimation(selectedEl);
            }
        });

        // Remove button
        container.querySelector('#removeAnimBtn')?.addEventListener('click', () => {
            const selectedEl = document.querySelector('.design-element.selected, .brochure-element.selected');
            if (selectedEl) {
                removeAnimation(selectedEl);
                showToast('Animation removed');
            }
        });
    }

    /**
     * Show toast
     */
    function showToast(msg) {
        if (typeof window.showToast === 'function') window.showToast(msg);
    }

    // ============================================================================
    // STYLES
    // ============================================================================

    const styles = document.createElement('style');
    styles.textContent = `
        .animations-panel { padding: 12px; }
        .animations-panel .panel-header { margin-bottom: 16px; }
        .animations-panel .panel-header h3 { margin: 0; font-size: 16px; }

        .animation-controls {
            background: #f8f9fa;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 16px;
        }

        .animation-controls .control-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
        }

        .animation-controls .control-row:last-child { margin-bottom: 0; }
        .animation-controls label { width: 60px; font-size: 12px; color: #666; }
        .animation-controls input[type="range"] { flex: 1; }
        .animation-controls span { width: 30px; font-size: 12px; font-weight: 500; }

        .animation-category { margin-bottom: 16px; }
        .category-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
        }
        .category-icon { font-size: 16px; }
        .category-name { font-size: 13px; font-weight: 600; color: #333; }

        .animations-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 6px;
        }

        .animation-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 10px;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
            text-align: left;
        }

        .animation-btn:hover {
            border-color: #667eea;
            background: #f0f4ff;
        }

        .anim-icon { font-size: 14px; }
        .anim-name { font-size: 11px; color: #333; }

        .animation-actions {
            display: flex;
            gap: 8px;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid #eee;
        }

        .animation-actions .btn { flex: 1; }

        /* Animation base class */
        .animated {
            animation-fill-mode: both;
        }
    `;
    document.head.appendChild(styles);

    // ============================================================================
    // EXPORTS
    // ============================================================================

    window.TextAnimations = {
        ANIMATIONS,
        apply: applyAnimation,
        remove: removeAnimation,
        replay: replayAnimation,
        renderPanel: renderAnimationsPanel,
        getAnimationList: () => Object.keys(ANIMATIONS)
    };

    console.log(`Text Animations loaded: ${Object.keys(ANIMATIONS).length} animations`);

})();
