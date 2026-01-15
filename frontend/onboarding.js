/**
 * Onboarding Tutorial System
 * Interactive guided tour for new users
 */
const Onboarding = (function() {
    'use strict';

    const STORAGE_KEY = 'brochure_editor_onboarding_complete';
    const VERSION = '1.0'; // Increment to re-show tutorial after major updates

    // Tutorial steps
    const TOUR_STEPS = [
        {
            id: 'welcome',
            target: null, // Centered modal
            title: 'Welcome to the Brochure Editor!',
            content: 'Create stunning property brochures in minutes. Let us show you around.',
            position: 'center',
            icon: '👋'
        },
        {
            id: 'templates',
            target: '[data-panel="templates"], .panel-btn[data-panel="templates"]',
            title: 'Choose a Template',
            content: 'Start with a professionally designed template. We have 24 unique layouts to choose from.',
            position: 'right',
            icon: '📐'
        },
        {
            id: 'elements',
            target: '[data-panel="elements"], .panel-btn[data-panel="elements"]',
            title: 'Add Elements',
            content: 'Drag shapes, text boxes, and icons onto your canvas. Build your design piece by piece.',
            position: 'right',
            icon: '🔷'
        },
        {
            id: 'photos',
            target: '[data-panel="photos"], .panel-btn[data-panel="photos"], [data-panel="stock"]',
            title: 'Add Photos',
            content: 'Upload your property photos or browse our stock photo library. Drag and drop to add.',
            position: 'right',
            icon: '📷'
        },
        {
            id: 'canvas',
            target: '.brochure-canvas, .page-content',
            title: 'Edit on Canvas',
            content: 'Click any element to select it. Drag to move, resize handles to change size. Double-click text to edit.',
            position: 'left',
            icon: '✏️'
        },
        {
            id: 'toolbar',
            target: '.formatting-toolbar, .toolbar',
            title: 'Format Your Content',
            content: 'Use the toolbar to change fonts, colors, alignment, and more. Select an element first.',
            position: 'bottom',
            icon: '🎨'
        },
        {
            id: 'pages',
            target: '.pages-panel, .page-thumbnails, [data-panel="pages"]',
            title: 'Manage Pages',
            content: 'Add, remove, and reorder pages. Most brochures work best with 2-4 pages.',
            position: 'left',
            icon: '📄'
        },
        {
            id: 'export',
            target: '.export-btn, [data-action="export"], #exportBtn',
            title: 'Export Your Brochure',
            content: 'Download as PDF, PNG, or JPG. Choose quality settings for print or web.',
            position: 'bottom',
            icon: '💾'
        },
        {
            id: 'shortcuts',
            target: null,
            title: 'Pro Tips',
            content: 'Press ? anytime to see keyboard shortcuts. Use Ctrl+Z to undo, Ctrl+S to save.',
            position: 'center',
            icon: '⌨️'
        },
        {
            id: 'complete',
            target: null,
            title: "You're Ready!",
            content: "That's all you need to know. Start creating your first brochure now!",
            position: 'center',
            icon: '🎉'
        }
    ];

    // State
    let currentStep = 0;
    let overlay = null;
    let tooltip = null;
    let spotlight = null;
    let isActive = false;

    /**
     * Check if user has completed onboarding
     */
    function hasCompleted() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return false;

        try {
            const data = JSON.parse(stored);
            return data.version === VERSION && data.completed === true;
        } catch {
            return false;
        }
    }

    /**
     * Mark onboarding as complete
     */
    function markComplete() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            version: VERSION,
            completed: true,
            timestamp: Date.now()
        }));
    }

    /**
     * Reset onboarding (for testing or re-showing)
     */
    function reset() {
        localStorage.removeItem(STORAGE_KEY);
    }

    /**
     * Create overlay elements
     */
    function createOverlay() {
        // Main overlay
        overlay = document.createElement('div');
        overlay.className = 'onboarding-overlay';

        // Spotlight hole
        spotlight = document.createElement('div');
        spotlight.className = 'onboarding-spotlight';
        overlay.appendChild(spotlight);

        // Tooltip
        tooltip = document.createElement('div');
        tooltip.className = 'onboarding-tooltip';

        document.body.appendChild(overlay);
        document.body.appendChild(tooltip);
    }

    /**
     * Remove overlay elements
     */
    function removeOverlay() {
        if (overlay) overlay.remove();
        if (tooltip) tooltip.remove();
        overlay = null;
        tooltip = null;
        spotlight = null;
    }

    /**
     * Position spotlight on target element
     */
    function positionSpotlight(target) {
        if (!target || !spotlight) {
            spotlight.style.display = 'none';
            return;
        }

        const rect = target.getBoundingClientRect();
        const padding = 10;

        spotlight.style.display = 'block';
        spotlight.style.left = `${rect.left - padding}px`;
        spotlight.style.top = `${rect.top - padding}px`;
        spotlight.style.width = `${rect.width + padding * 2}px`;
        spotlight.style.height = `${rect.height + padding * 2}px`;
    }

    /**
     * Position tooltip relative to target
     */
    function positionTooltip(step, targetElement) {
        if (!tooltip) return;

        const padding = 20;
        let left, top;

        if (step.position === 'center' || !targetElement) {
            // Center on screen
            tooltip.style.left = '50%';
            tooltip.style.top = '50%';
            tooltip.style.transform = 'translate(-50%, -50%)';
            return;
        }

        tooltip.style.transform = 'none';
        const rect = targetElement.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        switch (step.position) {
            case 'right':
                left = rect.right + padding;
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                break;
            case 'left':
                left = rect.left - tooltipRect.width - padding;
                top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
                break;
            case 'top':
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                top = rect.top - tooltipRect.height - padding;
                break;
            case 'bottom':
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                top = rect.bottom + padding;
                break;
            default:
                left = rect.right + padding;
                top = rect.top;
        }

        // Keep within viewport
        left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));
        top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding));

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    /**
     * Show a specific step
     */
    function showStep(stepIndex) {
        const step = TOUR_STEPS[stepIndex];
        if (!step) return;

        currentStep = stepIndex;

        // Find target element
        let targetElement = null;
        if (step.target) {
            targetElement = document.querySelector(step.target);
        }

        // Position spotlight
        positionSpotlight(targetElement);

        // Update tooltip content
        tooltip.innerHTML = `
            <div class="tooltip-icon">${step.icon}</div>
            <div class="tooltip-content">
                <h4>${step.title}</h4>
                <p>${step.content}</p>
            </div>
            <div class="tooltip-progress">
                <span>Step ${stepIndex + 1} of ${TOUR_STEPS.length}</span>
                <div class="progress-dots">
                    ${TOUR_STEPS.map((_, i) => `
                        <span class="dot ${i === stepIndex ? 'active' : ''} ${i < stepIndex ? 'completed' : ''}"></span>
                    `).join('')}
                </div>
            </div>
            <div class="tooltip-actions">
                ${stepIndex > 0 ? '<button class="btn-back">Back</button>' : ''}
                <button class="btn-skip">Skip Tour</button>
                <button class="btn-next">${stepIndex === TOUR_STEPS.length - 1 ? 'Get Started' : 'Next'}</button>
            </div>
        `;

        // Position tooltip
        positionTooltip(step, targetElement);

        // Attach event handlers
        const nextBtn = tooltip.querySelector('.btn-next');
        const backBtn = tooltip.querySelector('.btn-back');
        const skipBtn = tooltip.querySelector('.btn-skip');

        nextBtn.onclick = () => {
            if (currentStep < TOUR_STEPS.length - 1) {
                showStep(currentStep + 1);
            } else {
                complete();
            }
        };

        if (backBtn) {
            backBtn.onclick = () => showStep(currentStep - 1);
        }

        skipBtn.onclick = () => complete();

        // Scroll target into view if needed
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    /**
     * Start the onboarding tour
     */
    function start() {
        if (isActive) return;

        isActive = true;
        currentStep = 0;

        createOverlay();
        showStep(0);

        // Handle resize
        window.addEventListener('resize', handleResize);

        // Handle escape key
        document.addEventListener('keydown', handleKeydown);
    }

    /**
     * Complete the onboarding
     */
    function complete() {
        isActive = false;
        markComplete();
        removeOverlay();

        window.removeEventListener('resize', handleResize);
        document.removeEventListener('keydown', handleKeydown);

        // Dispatch completion event
        window.dispatchEvent(new CustomEvent('onboarding-complete'));
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        if (isActive) {
            const step = TOUR_STEPS[currentStep];
            const targetElement = step.target ? document.querySelector(step.target) : null;
            positionSpotlight(targetElement);
            positionTooltip(step, targetElement);
        }
    }

    /**
     * Handle keyboard events
     */
    function handleKeydown(e) {
        if (!isActive) return;

        if (e.key === 'Escape') {
            complete();
        } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
            if (currentStep < TOUR_STEPS.length - 1) {
                showStep(currentStep + 1);
            } else {
                complete();
            }
        } else if (e.key === 'ArrowLeft') {
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        }
    }

    /**
     * Auto-start if first visit
     */
    function autoStart() {
        if (!hasCompleted()) {
            // Delay slightly to let page render
            setTimeout(start, 1000);
        }
    }

    /**
     * Initialize styles
     */
    function init() {
        if (document.getElementById('onboarding-styles')) return;

        const style = document.createElement('style');
        style.id = 'onboarding-styles';
        style.textContent = `
            .onboarding-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.75);
                z-index: 10003;
                pointer-events: auto;
            }

            .onboarding-spotlight {
                position: fixed;
                border-radius: 8px;
                box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.75);
                pointer-events: none;
                transition: all 0.3s ease;
                z-index: 10004;
            }

            .onboarding-tooltip {
                position: fixed;
                background: #fff;
                border-radius: 16px;
                padding: 24px;
                width: 360px;
                max-width: calc(100vw - 40px);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                z-index: 10005;
                animation: tooltipAppear 0.3s ease;
            }

            @keyframes tooltipAppear {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .tooltip-icon {
                font-size: 48px;
                text-align: center;
                margin-bottom: 16px;
            }

            .tooltip-content h4 {
                margin: 0 0 8px 0;
                font-size: 20px;
                font-weight: 600;
                color: #1a1a2e;
            }

            .tooltip-content p {
                margin: 0;
                font-size: 14px;
                line-height: 1.6;
                color: #666;
            }

            .tooltip-progress {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 20px 0;
                padding: 12px 0;
                border-top: 1px solid #eee;
                border-bottom: 1px solid #eee;
            }

            .tooltip-progress span {
                font-size: 12px;
                color: #888;
            }

            .progress-dots {
                display: flex;
                gap: 6px;
            }

            .progress-dots .dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #ddd;
                transition: all 0.2s;
            }

            .progress-dots .dot.active {
                background: #6c5ce7;
                transform: scale(1.2);
            }

            .progress-dots .dot.completed {
                background: #a855f7;
            }

            .tooltip-actions {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }

            .tooltip-actions button {
                padding: 10px 18px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }

            .tooltip-actions .btn-back {
                background: #f5f5f5;
                border: none;
                color: #666;
            }

            .tooltip-actions .btn-back:hover {
                background: #eee;
            }

            .tooltip-actions .btn-skip {
                background: transparent;
                border: 1px solid #ddd;
                color: #888;
            }

            .tooltip-actions .btn-skip:hover {
                border-color: #bbb;
                color: #666;
            }

            .tooltip-actions .btn-next {
                background: linear-gradient(135deg, #6c5ce7, #a855f7);
                border: none;
                color: #fff;
            }

            .tooltip-actions .btn-next:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 15px rgba(108, 92, 231, 0.4);
            }

            /* Mobile adjustments */
            @media (max-width: 480px) {
                .onboarding-tooltip {
                    width: calc(100vw - 32px);
                    padding: 20px;
                }

                .tooltip-icon {
                    font-size: 36px;
                }

                .tooltip-content h4 {
                    font-size: 18px;
                }

                .tooltip-actions {
                    flex-wrap: wrap;
                }

                .tooltip-actions button {
                    flex: 1;
                    min-width: 80px;
                }
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
        start,
        complete,
        reset,
        hasCompleted,
        autoStart,
        getCurrentStep: () => currentStep,
        isActive: () => isActive,
        TOUR_STEPS,
        isLoaded: true
    };
})();

// Global export
window.Onboarding = Onboarding;

// Auto-start for new users after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => Onboarding.autoStart(), 500);
    });
} else {
    setTimeout(() => Onboarding.autoStart(), 500);
}
