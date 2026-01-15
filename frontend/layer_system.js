// ============================================================================
// LAYER SYSTEM
// Layer panel and z-index management for brochure editor
// ============================================================================

(function() {
    'use strict';

    // ========================================================================
    // LAYER PANEL RENDERING
    // ========================================================================

    function renderLayerPanel() {
        const panel = document.getElementById('layerPanel');
        if (!panel) {
            console.warn('Layer panel container not found');
            return;
        }

        const pageId = EditorState.currentPage;
        if (!pageId) {
            panel.innerHTML = `
                <div class="layer-empty-state">
                    <p>Select a page to view layers</p>
                </div>
            `;
            return;
        }

        // Gather all elements on current page
        const layers = getPageLayers(pageId);

        if (layers.length === 0) {
            panel.innerHTML = `
                <div class="layer-empty-state">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#9ca3af" stroke-width="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <line x1="3" y1="9" x2="21" y2="9"/>
                        <line x1="3" y1="15" x2="21" y2="15"/>
                    </svg>
                    <p>No elements on this page</p>
                    <p class="help-text">Add shapes or icons from the Elements panel</p>
                </div>
            `;
            return;
        }

        // Sort layers by z-index (highest first for display)
        layers.sort((a, b) => b.zIndex - a.zIndex);

        panel.innerHTML = `
            <div class="layer-panel-content">
                <div class="layer-list" id="layerList">
                    ${layers.map(layer => renderLayerRow(layer)).join('')}
                </div>

                <div class="layer-actions">
                    <div class="layer-action-group">
                        <button class="layer-action-btn" id="bringForwardBtn" title="Bring Forward">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="18 15 12 9 6 15"/>
                            </svg>
                        </button>
                        <button class="layer-action-btn" id="sendBackwardBtn" title="Send Backward">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </button>
                        <button class="layer-action-btn" id="bringToFrontBtn" title="Bring to Front">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="18 11 12 5 6 11"/>
                                <polyline points="18 19 12 13 6 19"/>
                            </svg>
                        </button>
                        <button class="layer-action-btn" id="sendToBackBtn" title="Send to Back">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="6 13 12 19 18 13"/>
                                <polyline points="6 5 12 11 18 5"/>
                            </svg>
                        </button>
                    </div>
                    <button class="layer-action-btn danger" id="deleteLayerBtn" title="Delete Selected">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        // Attach event listeners
        attachLayerListeners();

        // Set up drag reordering
        setupLayerDragReorder();
    }

    function renderLayerRow(layer) {
        const isSelected = EditorState.selectedElements?.some(
            el => el.dataset?.elementId === layer.id
        );
        const typeIcon = getLayerTypeIcon(layer.type);

        return `
            <div class="layer-row ${isSelected ? 'selected' : ''} ${layer.locked ? 'locked' : ''}"
                 data-layer-id="${layer.id}"
                 data-layer-type="${layer.type}"
                 draggable="true">

                <button class="layer-toggle visibility-toggle ${layer.visible ? 'active' : ''}"
                        data-action="visibility"
                        title="${layer.visible ? 'Hide' : 'Show'}">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5">
                        ${layer.visible ?
                            '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>' :
                            '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>'
                        }
                    </svg>
                </button>

                <button class="layer-toggle lock-toggle ${layer.locked ? 'active' : ''}"
                        data-action="lock"
                        title="${layer.locked ? 'Unlock' : 'Lock'}">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5">
                        ${layer.locked ?
                            '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>' :
                            '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 019.9-1"/>'
                        }
                    </svg>
                </button>

                <span class="layer-type-icon" title="${layer.type}">
                    ${typeIcon}
                </span>

                <span class="layer-name" title="${layer.name}">
                    ${layer.name}
                </span>

                <span class="layer-drag-handle">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="8" y1="6" x2="16" y2="6"/>
                        <line x1="8" y1="12" x2="16" y2="12"/>
                        <line x1="8" y1="18" x2="16" y2="18"/>
                    </svg>
                </span>
            </div>
        `;
    }

    function getLayerTypeIcon(type) {
        switch (type) {
            case 'shape':
                return `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                </svg>`;
            case 'icon':
                return `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>`;
            case 'qrcode':
                return `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                </svg>`;
            case 'photo':
                return `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                </svg>`;
            case 'text':
                return `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5">
                    <polyline points="4 7 4 4 20 4 20 7"/>
                    <line x1="9" y1="20" x2="15" y2="20"/>
                    <line x1="12" y1="4" x2="12" y2="20"/>
                </svg>`;
            default:
                return `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"/>
                </svg>`;
        }
    }

    // ========================================================================
    // GET PAGE LAYERS
    // ========================================================================

    function getPageLayers(pageId) {
        const layers = [];
        const page = document.querySelector(`.brochure-page[data-page-id="${pageId}"]`);
        if (!page) return layers;

        // Get design elements (shapes, icons, qrcodes)
        if (EditorState.elements && EditorState.elements[pageId]) {
            EditorState.elements[pageId].forEach(el => {
                layers.push({
                    id: el.id,
                    type: el.type,
                    name: getElementName(el),
                    zIndex: el.zIndex || 10,
                    visible: el.visible !== false,
                    locked: el.locked === true,
                    element: document.querySelector(`[data-element-id="${el.id}"]`)
                });
            });
        }

        // Get photos (optional - could include existing photos in layers)
        page.querySelectorAll('.photo-element').forEach((photo, index) => {
            const zIndex = parseInt(window.getComputedStyle(photo).zIndex) || 1;
            layers.push({
                id: `photo_${pageId}_${index}`,
                type: 'photo',
                name: `Photo ${index + 1}`,
                zIndex: zIndex,
                visible: photo.style.display !== 'none',
                locked: photo.classList.contains('locked'),
                element: photo
            });
        });

        // Get text elements (optional)
        page.querySelectorAll('.editable').forEach((text, index) => {
            const field = text.dataset.field || 'text';
            layers.push({
                id: `text_${pageId}_${index}`,
                type: 'text',
                name: field.charAt(0).toUpperCase() + field.slice(1),
                zIndex: parseInt(window.getComputedStyle(text).zIndex) || 6,
                visible: text.style.display !== 'none',
                locked: text.classList.contains('locked'),
                element: text
            });
        });

        return layers;
    }

    function getElementName(element) {
        if (element.name) return element.name;

        switch (element.type) {
            case 'shape':
                return element.shapeType ?
                    element.shapeType.charAt(0).toUpperCase() + element.shapeType.slice(1) :
                    'Shape';
            case 'icon':
                return element.iconType ?
                    element.iconType.charAt(0).toUpperCase() + element.iconType.slice(1) :
                    'Icon';
            case 'qrcode':
                return 'QR Code';
            default:
                return 'Element';
        }
    }

    // ========================================================================
    // EVENT LISTENERS
    // ========================================================================

    function attachLayerListeners() {
        const panel = document.getElementById('layerPanel');
        if (!panel) return;

        // Layer row clicks
        panel.querySelectorAll('.layer-row').forEach(row => {
            row.addEventListener('click', (e) => {
                if (e.target.closest('.layer-toggle')) return; // Handled separately

                const layerId = row.dataset.layerId;
                const layerType = row.dataset.layerType;
                selectLayerElement(layerId, layerType);
            });
        });

        // Visibility toggles
        panel.querySelectorAll('.visibility-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const row = btn.closest('.layer-row');
                const layerId = row.dataset.layerId;
                const layerType = row.dataset.layerType;
                toggleLayerVisibility(layerId, layerType);
            });
        });

        // Lock toggles
        panel.querySelectorAll('.lock-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const row = btn.closest('.layer-row');
                const layerId = row.dataset.layerId;
                const layerType = row.dataset.layerType;
                toggleLayerLock(layerId, layerType);
            });
        });

        // Layer action buttons
        document.getElementById('bringForwardBtn')?.addEventListener('click', () => changeLayerOrder('forward'));
        document.getElementById('sendBackwardBtn')?.addEventListener('click', () => changeLayerOrder('backward'));
        document.getElementById('bringToFrontBtn')?.addEventListener('click', () => changeLayerOrder('front'));
        document.getElementById('sendToBackBtn')?.addEventListener('click', () => changeLayerOrder('back'));
        document.getElementById('deleteLayerBtn')?.addEventListener('click', deleteSelectedLayer);
    }

    // ========================================================================
    // LAYER OPERATIONS
    // ========================================================================

    function selectLayerElement(layerId, layerType) {
        let element;

        if (['shape', 'icon', 'qrcode'].includes(layerType)) {
            element = document.querySelector(`[data-element-id="${layerId}"]`);
        } else if (layerType === 'photo') {
            const [, pageId, index] = layerId.split('_');
            const page = document.querySelector(`.brochure-page[data-page-id="${pageId}"]`);
            element = page?.querySelectorAll('.photo-element')[parseInt(index)];
        } else if (layerType === 'text') {
            const [, pageId, index] = layerId.split('_');
            const page = document.querySelector(`.brochure-page[data-page-id="${pageId}"]`);
            element = page?.querySelectorAll('.editable')[parseInt(index)];
        }

        if (element) {
            if (typeof ElementDrag !== 'undefined' && layerType !== 'text' && layerType !== 'photo') {
                ElementDrag.selectElement(element);
            } else {
                // Basic selection for photos/text
                document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
                element.classList.add('selected');
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        // Update layer panel selection
        document.querySelectorAll('.layer-row').forEach(row => {
            row.classList.toggle('selected', row.dataset.layerId === layerId);
        });
    }

    function toggleLayerVisibility(layerId, layerType) {
        const pageId = EditorState.currentPage;

        if (['shape', 'icon', 'qrcode'].includes(layerType) && EditorState.elements[pageId]) {
            const elementData = EditorState.elements[pageId].find(el => el.id === layerId);
            if (elementData) {
                elementData.visible = !elementData.visible;

                const domElement = document.querySelector(`[data-element-id="${layerId}"]`);
                if (domElement) {
                    domElement.style.display = elementData.visible ? '' : 'none';
                }
            }
        } else {
            // For photos/text, toggle display directly
            const layers = getPageLayers(pageId);
            const layer = layers.find(l => l.id === layerId);
            if (layer?.element) {
                const isVisible = layer.element.style.display !== 'none';
                layer.element.style.display = isVisible ? 'none' : '';
            }
        }

        EditorState.isDirty = true;
        renderLayerPanel();
    }

    function toggleLayerLock(layerId, layerType) {
        const pageId = EditorState.currentPage;

        if (['shape', 'icon', 'qrcode'].includes(layerType) && EditorState.elements[pageId]) {
            const elementData = EditorState.elements[pageId].find(el => el.id === layerId);
            if (elementData) {
                elementData.locked = !elementData.locked;

                const domElement = document.querySelector(`[data-element-id="${layerId}"]`);
                if (domElement) {
                    domElement.classList.toggle('locked', elementData.locked);
                }
            }
        } else {
            // For photos/text
            const layers = getPageLayers(pageId);
            const layer = layers.find(l => l.id === layerId);
            if (layer?.element) {
                layer.element.classList.toggle('locked');
            }
        }

        EditorState.isDirty = true;
        renderLayerPanel();
    }

    function changeLayerOrder(direction) {
        if (!EditorState.selectedElements || EditorState.selectedElements.length === 0) {
            showToast('Select an element first', 'warning');
            return;
        }

        const element = EditorState.selectedElements[0];
        const elementId = element.dataset.elementId;
        const pageId = EditorState.currentPage;

        if (!elementId || !EditorState.elements[pageId]) return;

        const elements = EditorState.elements[pageId];
        const elementData = elements.find(el => el.id === elementId);
        if (!elementData) return;

        // Get current z-indices
        const zIndices = elements.map(el => el.zIndex || 10).sort((a, b) => a - b);
        const currentZ = elementData.zIndex || 10;
        const currentIndex = zIndices.indexOf(currentZ);

        let newZ = currentZ;

        switch (direction) {
            case 'forward':
                if (currentIndex < zIndices.length - 1) {
                    newZ = zIndices[currentIndex + 1] + 1;
                }
                break;
            case 'backward':
                if (currentIndex > 0) {
                    newZ = zIndices[currentIndex - 1] - 1;
                }
                break;
            case 'front':
                newZ = Math.max(...zIndices) + 1;
                break;
            case 'back':
                newZ = Math.max(1, Math.min(...zIndices) - 1);
                break;
        }

        // Update z-index
        elementData.zIndex = newZ;
        element.style.zIndex = newZ;

        EditorState.isDirty = true;
        renderLayerPanel();

        console.log(`Layer ${elementId} z-index changed to ${newZ}`);
    }

    function deleteSelectedLayer() {
        if (typeof ElementDrag !== 'undefined') {
            // Use drag system's delete
            const selectedRows = document.querySelectorAll('.layer-row.selected');
            if (selectedRows.length === 0) {
                showToast('Select a layer to delete', 'warning');
                return;
            }

            // Confirm deletion
            if (!confirm('Delete selected element?')) return;

            selectedRows.forEach(row => {
                const layerId = row.dataset.layerId;
                const layerType = row.dataset.layerType;

                if (['shape', 'icon', 'qrcode'].includes(layerType)) {
                    const element = document.querySelector(`[data-element-id="${layerId}"]`);
                    if (element) {
                        const pageId = element.closest('.brochure-page')?.dataset.pageId;

                        // Remove from DOM
                        element.remove();

                        // Remove from state
                        if (pageId && EditorState.elements[pageId]) {
                            EditorState.elements[pageId] = EditorState.elements[pageId].filter(
                                el => el.id !== layerId
                            );
                        }
                    }
                }
            });

            EditorState.isDirty = true;
            renderLayerPanel();
            showToast('Element deleted', 'success');
        }
    }

    // ========================================================================
    // DRAG REORDERING
    // ========================================================================

    function setupLayerDragReorder() {
        const layerList = document.getElementById('layerList');
        if (!layerList) return;

        let draggedItem = null;

        layerList.addEventListener('dragstart', (e) => {
            const row = e.target.closest('.layer-row');
            if (!row) return;

            draggedItem = row;
            row.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        layerList.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            const afterElement = getDragAfterElement(layerList, e.clientY);
            if (afterElement) {
                layerList.insertBefore(draggedItem, afterElement);
            } else {
                layerList.appendChild(draggedItem);
            }
        });

        layerList.addEventListener('dragend', (e) => {
            if (!draggedItem) return;

            draggedItem.classList.remove('dragging');

            // Update z-indices based on new order
            updateZIndicesFromLayerOrder();

            draggedItem = null;
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.layer-row:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function updateZIndicesFromLayerOrder() {
        const layerList = document.getElementById('layerList');
        if (!layerList) return;

        const rows = layerList.querySelectorAll('.layer-row');
        const pageId = EditorState.currentPage;

        // Higher in list = higher z-index
        const baseZ = 10;
        const totalRows = rows.length;

        rows.forEach((row, index) => {
            const newZ = baseZ + (totalRows - index);
            const layerId = row.dataset.layerId;
            const layerType = row.dataset.layerType;

            if (['shape', 'icon', 'qrcode'].includes(layerType) && EditorState.elements[pageId]) {
                const elementData = EditorState.elements[pageId].find(el => el.id === layerId);
                if (elementData) {
                    elementData.zIndex = newZ;

                    const domElement = document.querySelector(`[data-element-id="${layerId}"]`);
                    if (domElement) {
                        domElement.style.zIndex = newZ;
                    }
                }
            }
        });

        EditorState.isDirty = true;
        console.log('Layer z-indices updated from drag reorder');
    }

    // ========================================================================
    // UPDATE SELECTION FROM EXTERNAL
    // ========================================================================

    function updateLayerSelection(elementId) {
        document.querySelectorAll('.layer-row').forEach(row => {
            row.classList.toggle('selected', row.dataset.layerId === elementId);
        });
    }

    // ========================================================================
    // HELPER
    // ========================================================================

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

    window.LayerSystem = {
        render: renderLayerPanel,
        updateSelection: updateLayerSelection,
        toggleVisibility: toggleLayerVisibility,
        toggleLock: toggleLayerLock,
        changeOrder: changeLayerOrder,
        getPageLayers: getPageLayers
    };

    // Expose for element_drag.js
    window.renderLayerPanel = renderLayerPanel;
    window.updateLayerSelection = updateLayerSelection;

})();
