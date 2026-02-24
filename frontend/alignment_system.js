// ============================================================================
// ALIGNMENT SYSTEM
// Smart guides, grid overlay, and alignment tools for brochure editor
// ============================================================================

(function() {
    'use strict';

    // ========================================================================
    // CONFIGURATION
    // ========================================================================

    const CONFIG = {
        gridSize: 10,           // Grid cell size in pixels
        snapThreshold: 5,       // Distance to trigger snap in pixels
        guideColor: '#4A1420',  // Doorstep red
        guideWidth: 1
    };

    // ========================================================================
    // SMART GUIDES
    // ========================================================================

    let guidesContainer = null;
    let activeGuides = [];

    function initGuidesContainer() {
        if (guidesContainer) return;

        guidesContainer = document.createElement('div');
        guidesContainer.id = 'smartGuidesContainer';
        guidesContainer.className = 'smart-guides-container';
        guidesContainer.style.cssText = `
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 900;
            overflow: hidden;
        `;

        // Add to each brochure page
        document.querySelectorAll('.brochure-page').forEach(page => {
            const container = guidesContainer.cloneNode(true);
            container.id = `guides-${page.dataset.pageId}`;
            page.appendChild(container);
        });
    }

    function showSmartGuides(draggedElement) {
        if (!EditorState.smartGuidesEnabled) return;

        const page = draggedElement.closest('.brochure-page');
        if (!page) return;

        // Initialize container if needed
        let container = page.querySelector('.smart-guides-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'smart-guides-container';
            container.style.cssText = `
                position: absolute;
                inset: 0;
                pointer-events: none;
                z-index: 900;
                overflow: hidden;
            `;
            page.appendChild(container);
        }

        // Clear previous guides
        container.innerHTML = '';
        activeGuides = [];

        // Get dragged element bounds
        const draggedRect = getElementBounds(draggedElement, page);

        // Get all other elements on the page
        const otherElements = page.querySelectorAll('.design-element:not(.dragging), .photo-element');
        const elementBounds = [];

        otherElements.forEach(el => {
            if (el === draggedElement) return;
            elementBounds.push(getElementBounds(el, page));
        });

        // Also check page bounds
        const pageBounds = {
            left: 0,
            right: page.offsetWidth,
            top: 0,
            bottom: page.offsetHeight,
            centerX: page.offsetWidth / 2,
            centerY: page.offsetHeight / 2
        };

        // Check for alignments
        const guides = [];

        // Check vertical alignments (x-axis)
        const verticalPositions = [
            { value: pageBounds.left, label: 'left edge' },
            { value: pageBounds.centerX, label: 'center' },
            { value: pageBounds.right, label: 'right edge' }
        ];

        elementBounds.forEach(bounds => {
            verticalPositions.push({ value: bounds.left, label: 'element left' });
            verticalPositions.push({ value: bounds.centerX, label: 'element center' });
            verticalPositions.push({ value: bounds.right, label: 'element right' });
        });

        // Check dragged element edges against vertical positions
        ['left', 'centerX', 'right'].forEach(edge => {
            const draggedValue = draggedRect[edge];

            verticalPositions.forEach(pos => {
                const diff = Math.abs(draggedValue - pos.value);
                if (diff < CONFIG.snapThreshold) {
                    guides.push({
                        type: 'vertical',
                        x: pos.value,
                        snappedEdge: edge,
                        snapTo: pos.value
                    });
                }
            });
        });

        // Check horizontal alignments (y-axis)
        const horizontalPositions = [
            { value: pageBounds.top, label: 'top edge' },
            { value: pageBounds.centerY, label: 'center' },
            { value: pageBounds.bottom, label: 'bottom edge' }
        ];

        elementBounds.forEach(bounds => {
            horizontalPositions.push({ value: bounds.top, label: 'element top' });
            horizontalPositions.push({ value: bounds.centerY, label: 'element center' });
            horizontalPositions.push({ value: bounds.bottom, label: 'element bottom' });
        });

        // Check dragged element edges against horizontal positions
        ['top', 'centerY', 'bottom'].forEach(edge => {
            const draggedValue = draggedRect[edge];

            horizontalPositions.forEach(pos => {
                const diff = Math.abs(draggedValue - pos.value);
                if (diff < CONFIG.snapThreshold) {
                    guides.push({
                        type: 'horizontal',
                        y: pos.value,
                        snappedEdge: edge,
                        snapTo: pos.value
                    });
                }
            });
        });

        // Render guides
        guides.forEach(guide => {
            const guideEl = document.createElement('div');
            guideEl.className = `smart-guide ${guide.type}`;

            if (guide.type === 'vertical') {
                guideEl.style.cssText = `
                    position: absolute;
                    left: ${guide.x}px;
                    top: 0;
                    width: ${CONFIG.guideWidth}px;
                    height: 100%;
                    background: ${CONFIG.guideColor};
                `;
            } else {
                guideEl.style.cssText = `
                    position: absolute;
                    left: 0;
                    top: ${guide.y}px;
                    width: 100%;
                    height: ${CONFIG.guideWidth}px;
                    background: ${CONFIG.guideColor};
                `;
            }

            container.appendChild(guideEl);
            activeGuides.push({ element: guideEl, data: guide });
        });

        return guides;
    }

    function hideSmartGuides() {
        document.querySelectorAll('.smart-guides-container').forEach(container => {
            container.innerHTML = '';
        });
        activeGuides = [];
    }

    function getElementBounds(element, page) {
        const rect = element.getBoundingClientRect();
        const pageRect = page.getBoundingClientRect();
        const zoom = getCanvasZoom();

        const left = (rect.left - pageRect.left) / zoom;
        const top = (rect.top - pageRect.top) / zoom;
        const width = rect.width / zoom;
        const height = rect.height / zoom;

        return {
            left: left,
            right: left + width,
            top: top,
            bottom: top + height,
            centerX: left + width / 2,
            centerY: top + height / 2,
            width: width,
            height: height
        };
    }

    // ========================================================================
    // GRID OVERLAY
    // ========================================================================

    function toggleGridOverlay() {
        EditorState.gridVisible = !EditorState.gridVisible;

        document.querySelectorAll('.brochure-page').forEach(page => {
            page.classList.toggle('show-grid', EditorState.gridVisible);
        });

        // Update button state
        const gridBtn = document.getElementById('gridToggleBtn');
        if (gridBtn) {
            gridBtn.classList.toggle('active', EditorState.gridVisible);
        }

        console.log('Grid overlay:', EditorState.gridVisible ? 'ON' : 'OFF');
    }

    function toggleSmartGuides() {
        EditorState.smartGuidesEnabled = !EditorState.smartGuidesEnabled;

        // Update button state
        const guidesBtn = document.getElementById('guidesToggleBtn');
        if (guidesBtn) {
            guidesBtn.classList.toggle('active', EditorState.smartGuidesEnabled);
        }

        if (!EditorState.smartGuidesEnabled) {
            hideSmartGuides();
        }

        console.log('Smart guides:', EditorState.smartGuidesEnabled ? 'ON' : 'OFF');
    }

    // ========================================================================
    // ALIGNMENT FUNCTIONS
    // ========================================================================

    function alignElements(direction) {
        const selected = EditorState.selectedElements;
        if (!selected || selected.length === 0) {
            showToast('Select elements to align', 'warning');
            return;
        }

        const pageId = EditorState.currentPage;
        const page = document.querySelector(`.brochure-page[data-page-id="${pageId}"]`);
        if (!page) return;

        // Save for undo
        if (typeof saveToHistory === 'function') {
            saveToHistory('align elements');
        }

        const pageWidth = page.offsetWidth;
        const pageHeight = page.offsetHeight;

        selected.forEach(element => {
            const elementWidth = element.offsetWidth;
            const elementHeight = element.offsetHeight;
            let left = parseInt(element.style.left) || 0;
            let top = parseInt(element.style.top) || 0;

            switch (direction) {
                case 'left':
                    left = 0;
                    break;
                case 'center':
                    left = (pageWidth - elementWidth) / 2;
                    break;
                case 'right':
                    left = pageWidth - elementWidth;
                    break;
                case 'top':
                    top = 0;
                    break;
                case 'middle':
                    top = (pageHeight - elementHeight) / 2;
                    break;
                case 'bottom':
                    top = pageHeight - elementHeight;
                    break;
            }

            // Apply position
            element.style.left = left + 'px';
            element.style.top = top + 'px';

            // Update element data
            const elementId = element.dataset.elementId;
            if (elementId && EditorState.elements[pageId]) {
                const elementData = EditorState.elements[pageId].find(el => el.id === elementId);
                if (elementData) {
                    elementData.position = { x: left, y: top };
                }
            }
        });

        EditorState.isDirty = true;
        showToast(`Aligned ${direction}`, 'success');
    }

    function distributeElements(axis) {
        const selected = EditorState.selectedElements;
        if (!selected || selected.length < 3) {
            showToast('Select at least 3 elements to distribute', 'warning');
            return;
        }

        const pageId = EditorState.currentPage;

        // Save for undo
        if (typeof saveToHistory === 'function') {
            saveToHistory('distribute elements');
        }

        // Sort elements by position
        const sorted = [...selected].sort((a, b) => {
            if (axis === 'horizontal') {
                return (parseInt(a.style.left) || 0) - (parseInt(b.style.left) || 0);
            } else {
                return (parseInt(a.style.top) || 0) - (parseInt(b.style.top) || 0);
            }
        });

        // Calculate spacing
        const first = sorted[0];
        const last = sorted[sorted.length - 1];

        if (axis === 'horizontal') {
            const totalSpace = (parseInt(last.style.left) || 0) - (parseInt(first.style.left) || 0);
            const spacing = totalSpace / (sorted.length - 1);

            sorted.forEach((element, index) => {
                if (index === 0 || index === sorted.length - 1) return;

                const newLeft = (parseInt(first.style.left) || 0) + (spacing * index);
                element.style.left = newLeft + 'px';

                // Update data
                const elementId = element.dataset.elementId;
                if (elementId && EditorState.elements[pageId]) {
                    const elementData = EditorState.elements[pageId].find(el => el.id === elementId);
                    if (elementData) {
                        elementData.position.x = newLeft;
                    }
                }
            });
        } else {
            const totalSpace = (parseInt(last.style.top) || 0) - (parseInt(first.style.top) || 0);
            const spacing = totalSpace / (sorted.length - 1);

            sorted.forEach((element, index) => {
                if (index === 0 || index === sorted.length - 1) return;

                const newTop = (parseInt(first.style.top) || 0) + (spacing * index);
                element.style.top = newTop + 'px';

                // Update data
                const elementId = element.dataset.elementId;
                if (elementId && EditorState.elements[pageId]) {
                    const elementData = EditorState.elements[pageId].find(el => el.id === elementId);
                    if (elementData) {
                        elementData.position.y = newTop;
                    }
                }
            });
        }

        EditorState.isDirty = true;
        showToast(`Distributed ${axis === 'horizontal' ? 'horizontally' : 'vertically'}`, 'success');
    }

    // ========================================================================
    // TOOLBAR RENDERING
    // ========================================================================

    function renderAlignmentToolbar() {
        const toolbar = document.getElementById('alignmentToolbar');
        if (!toolbar) return;

        toolbar.innerHTML = `
            <div class="alignment-toolbar-content">
                <div class="toolbar-group toggle-group">
                    <button id="gridToggleBtn"
                            class="toolbar-btn ${EditorState.gridVisible ? 'active' : ''}"
                            title="Toggle Grid (10px)">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="3" y="3" width="18" height="18"/>
                            <line x1="3" y1="9" x2="21" y2="9"/>
                            <line x1="3" y1="15" x2="21" y2="15"/>
                            <line x1="9" y1="3" x2="9" y2="21"/>
                            <line x1="15" y1="3" x2="15" y2="21"/>
                        </svg>
                    </button>
                    <button id="guidesToggleBtn"
                            class="toolbar-btn ${EditorState.smartGuidesEnabled ? 'active' : ''}"
                            title="Toggle Smart Guides">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5">
                            <line x1="12" y1="2" x2="12" y2="22"/>
                            <line x1="2" y1="12" x2="22" y2="12"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                </div>

                <div class="toolbar-divider"></div>

                <div class="toolbar-group align-group">
                    <button class="toolbar-btn" data-align="left" title="Align Left">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5">
                            <line x1="4" y1="4" x2="4" y2="20"/>
                            <rect x="7" y="6" width="10" height="4"/>
                            <rect x="7" y="14" width="6" height="4"/>
                        </svg>
                    </button>
                    <button class="toolbar-btn" data-align="center" title="Align Center">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5">
                            <line x1="12" y1="4" x2="12" y2="20"/>
                            <rect x="5" y="6" width="14" height="4"/>
                            <rect x="7" y="14" width="10" height="4"/>
                        </svg>
                    </button>
                    <button class="toolbar-btn" data-align="right" title="Align Right">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5">
                            <line x1="20" y1="4" x2="20" y2="20"/>
                            <rect x="7" y="6" width="10" height="4"/>
                            <rect x="11" y="14" width="6" height="4"/>
                        </svg>
                    </button>
                    <button class="toolbar-btn" data-align="top" title="Align Top">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5">
                            <line x1="4" y1="4" x2="20" y2="4"/>
                            <rect x="6" y="7" width="4" height="10"/>
                            <rect x="14" y="7" width="4" height="6"/>
                        </svg>
                    </button>
                    <button class="toolbar-btn" data-align="middle" title="Align Middle">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5">
                            <line x1="4" y1="12" x2="20" y2="12"/>
                            <rect x="6" y="5" width="4" height="14"/>
                            <rect x="14" y="7" width="4" height="10"/>
                        </svg>
                    </button>
                    <button class="toolbar-btn" data-align="bottom" title="Align Bottom">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5">
                            <line x1="4" y1="20" x2="20" y2="20"/>
                            <rect x="6" y="7" width="4" height="10"/>
                            <rect x="14" y="11" width="4" height="6"/>
                        </svg>
                    </button>
                </div>

                <div class="toolbar-divider"></div>

                <div class="toolbar-group distribute-group">
                    <button class="toolbar-btn" data-distribute="horizontal" title="Distribute Horizontally">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="2" y="8" width="4" height="8"/>
                            <rect x="10" y="8" width="4" height="8"/>
                            <rect x="18" y="8" width="4" height="8"/>
                            <line x1="4" y1="4" x2="4" y2="6"/>
                            <line x1="20" y1="4" x2="20" y2="6"/>
                        </svg>
                    </button>
                    <button class="toolbar-btn" data-distribute="vertical" title="Distribute Vertically">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="8" y="2" width="8" height="4"/>
                            <rect x="8" y="10" width="8" height="4"/>
                            <rect x="8" y="18" width="8" height="4"/>
                            <line x1="4" y1="4" x2="6" y2="4"/>
                            <line x1="4" y1="20" x2="6" y2="20"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        // Attach event listeners
        attachAlignmentListeners();
    }

    function attachAlignmentListeners() {
        // Grid toggle
        document.getElementById('gridToggleBtn')?.addEventListener('click', toggleGridOverlay);

        // Guides toggle
        document.getElementById('guidesToggleBtn')?.addEventListener('click', toggleSmartGuides);

        // Align buttons
        document.querySelectorAll('[data-align]').forEach(btn => {
            btn.addEventListener('click', () => {
                alignElements(btn.dataset.align);
            });
        });

        // Distribute buttons
        document.querySelectorAll('[data-distribute]').forEach(btn => {
            btn.addEventListener('click', () => {
                distributeElements(btn.dataset.distribute);
            });
        });
    }

    // ========================================================================
    // HELPER FUNCTIONS
    // ========================================================================

    function getCanvasZoom() {
        const canvas = document.getElementById('brochureCanvas');
        if (!canvas) return 1;
        const transform = canvas.style.transform;
        const match = transform.match(/scale\(([^)]+)\)/);
        return match ? parseFloat(match[1]) : 1;
    }

    function showToast(message, type) {
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        } else {
            console.log(`[${type}] ${message}`);
        }
    }

    // ========================================================================
    // EXPOSE TO GLOBAL SCOPE
    // ========================================================================

    window.AlignmentSystem = {
        showSmartGuides,
        hideSmartGuides,
        toggleGrid: toggleGridOverlay,
        toggleGuides: toggleSmartGuides,
        align: alignElements,
        distribute: distributeElements,
        renderToolbar: renderAlignmentToolbar,
        CONFIG
    };

    // Expose for element_drag.js
    window.showSmartGuides = showSmartGuides;
    window.hideSmartGuides = hideSmartGuides;

})();
