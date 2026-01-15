/**
 * Zoom Controls - Toolbar for canvas zoom functionality
 */

(function() {
    'use strict';

    // Zoom settings
    const ZOOM_LEVELS = [25, 50, 75, 100, 125, 150, 200, 300, 400];
    const MIN_ZOOM = 25;
    const MAX_ZOOM = 400;
    const ZOOM_STEP = 10;

    let currentZoom = 100;

    /**
     * Initialize zoom controls
     */
    function init() {
        renderZoomToolbar();
        setupKeyboardShortcuts();
        console.log('Zoom Controls initialized');
    }

    /**
     * Render zoom toolbar
     */
    function renderZoomToolbar() {
        // Find or create toolbar container
        let toolbar = document.querySelector('.zoom-toolbar');
        if (!toolbar) {
            toolbar = document.createElement('div');
            toolbar.className = 'zoom-toolbar';

            // Insert into canvas area
            const canvasArea = document.querySelector('.canvas-area');
            if (canvasArea) {
                canvasArea.appendChild(toolbar);
            } else {
                document.body.appendChild(toolbar);
            }
        }

        toolbar.innerHTML = `
            <button class="zoom-btn" id="zoomOutBtn" title="Zoom Out (Ctrl+-)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
            </button>
            <div class="zoom-display" id="zoomDisplay" title="Click to select zoom level">
                <span class="zoom-value">${currentZoom}%</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </div>
            <button class="zoom-btn" id="zoomInBtn" title="Zoom In (Ctrl++)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="11" y1="8" x2="11" y2="14"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
            </button>
            <button class="zoom-btn" id="zoomFitBtn" title="Fit to View">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
                    <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
                    <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
                    <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
                </svg>
            </button>
            <button class="zoom-btn" id="zoomResetBtn" title="Reset to 100%">
                100%
            </button>
        `;

        // Attach event listeners
        attachZoomListeners(toolbar);
    }

    /**
     * Attach zoom toolbar event listeners
     */
    function attachZoomListeners(toolbar) {
        // Zoom out
        toolbar.querySelector('#zoomOutBtn').addEventListener('click', () => {
            zoomOut();
        });

        // Zoom in
        toolbar.querySelector('#zoomInBtn').addEventListener('click', () => {
            zoomIn();
        });

        // Zoom display (dropdown)
        toolbar.querySelector('#zoomDisplay').addEventListener('click', (e) => {
            showZoomDropdown(e.currentTarget);
        });

        // Fit to view
        toolbar.querySelector('#zoomFitBtn').addEventListener('click', () => {
            zoomToFit();
        });

        // Reset to 100%
        toolbar.querySelector('#zoomResetBtn').addEventListener('click', () => {
            setZoom(100);
        });
    }

    /**
     * Set up keyboard shortcuts for zoom
     */
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Plus for zoom in
            if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
                e.preventDefault();
                zoomIn();
            }
            // Ctrl/Cmd + Minus for zoom out
            if ((e.ctrlKey || e.metaKey) && e.key === '-') {
                e.preventDefault();
                zoomOut();
            }
            // Ctrl/Cmd + 0 for reset
            if ((e.ctrlKey || e.metaKey) && e.key === '0') {
                e.preventDefault();
                setZoom(100);
            }
        });

        // Mouse wheel zoom with Ctrl
        document.querySelector('.canvas-area')?.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                if (e.deltaY < 0) {
                    zoomIn(5);
                } else {
                    zoomOut(5);
                }
            }
        }, { passive: false });
    }

    /**
     * Zoom in
     */
    function zoomIn(step = ZOOM_STEP) {
        setZoom(Math.min(currentZoom + step, MAX_ZOOM));
    }

    /**
     * Zoom out
     */
    function zoomOut(step = ZOOM_STEP) {
        setZoom(Math.max(currentZoom - step, MIN_ZOOM));
    }

    /**
     * Set zoom level
     */
    function setZoom(level) {
        currentZoom = Math.round(level);
        applyZoom();
        updateZoomDisplay();
    }

    /**
     * Apply zoom to canvas
     */
    function applyZoom() {
        const canvas = document.getElementById('brochureCanvas');
        if (!canvas) return;

        const scale = currentZoom / 100;
        canvas.style.transform = `scale(${scale})`;
        canvas.style.transformOrigin = 'top center';

        // Update EditorState
        if (window.EditorState) {
            window.EditorState.zoom = currentZoom;
        }
    }

    /**
     * Update zoom display
     */
    function updateZoomDisplay() {
        const display = document.querySelector('.zoom-value');
        if (display) {
            display.textContent = `${currentZoom}%`;
        }
    }

    /**
     * Zoom to fit the canvas in view
     */
    function zoomToFit() {
        const canvasArea = document.querySelector('.canvas-area');
        const canvas = document.getElementById('brochureCanvas');
        if (!canvasArea || !canvas) return;

        // Reset transform to get actual size
        canvas.style.transform = 'none';
        const canvasRect = canvas.getBoundingClientRect();
        const areaRect = canvasArea.getBoundingClientRect();

        // Calculate zoom to fit
        const horizontalZoom = (areaRect.width - 80) / canvasRect.width * 100;
        const verticalZoom = (areaRect.height - 80) / canvasRect.height * 100;
        const fitZoom = Math.min(horizontalZoom, verticalZoom, 100);

        setZoom(Math.round(fitZoom / 5) * 5); // Round to nearest 5
    }

    /**
     * Show zoom level dropdown
     */
    function showZoomDropdown(anchor) {
        // Remove existing dropdown
        const existing = document.querySelector('.zoom-dropdown');
        if (existing) {
            existing.remove();
            return;
        }

        const dropdown = document.createElement('div');
        dropdown.className = 'zoom-dropdown';
        dropdown.innerHTML = ZOOM_LEVELS.map(level => `
            <button class="zoom-level-btn ${level === currentZoom ? 'active' : ''}" data-zoom="${level}">
                ${level}%
            </button>
        `).join('');

        // Position dropdown
        const rect = anchor.getBoundingClientRect();
        dropdown.style.left = rect.left + 'px';
        dropdown.style.bottom = (window.innerHeight - rect.top + 4) + 'px';

        document.body.appendChild(dropdown);

        // Add click handlers
        dropdown.querySelectorAll('.zoom-level-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                setZoom(parseInt(btn.dataset.zoom));
                dropdown.remove();
            });
        });

        // Close on click outside
        setTimeout(() => {
            document.addEventListener('click', function closeDropdown(e) {
                if (!dropdown.contains(e.target) && e.target !== anchor) {
                    dropdown.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            });
        }, 0);
    }

    /**
     * Get current zoom level
     */
    function getZoom() {
        return currentZoom;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export to global scope
    window.ZoomControls = {
        init,
        zoomIn,
        zoomOut,
        setZoom,
        getZoom,
        zoomToFit
    };

})();
