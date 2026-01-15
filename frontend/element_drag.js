// ============================================================================
// ELEMENT DRAG & DROP SYSTEM
// Core drag-and-drop engine for brochure editor elements
// ============================================================================

(function() {
    'use strict';

    // ========================================================================
    // DRAG STATE
    // ========================================================================

    const DragState = {
        active: false,
        element: null,
        elementData: null,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0,
        originalPosition: { x: 0, y: 0 },
        originalSize: { width: 0, height: 0 },
        pageElement: null,
        mode: null // 'drag' or 'resize'
    };

    const ResizeState = {
        active: false,
        handle: null,
        element: null,
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
        startLeft: 0,
        startTop: 0,
        aspectRatio: 1,
        maintainAspect: false
    };

    const RotationState = {
        active: false,
        element: null,
        centerX: 0,
        centerY: 0,
        startAngle: 0,
        currentRotation: 0
    };

    // ========================================================================
    // INITIALIZATION
    // ========================================================================

    function initDragSystem() {
        console.log('🎯 Initializing element drag system...');

        // Extend EditorState if not already done
        if (typeof EditorState !== 'undefined') {
            EditorState.elements = EditorState.elements || {};
            EditorState.layerOrder = EditorState.layerOrder || {};
            EditorState.gridVisible = EditorState.gridVisible || false;
            EditorState.smartGuidesEnabled = EditorState.smartGuidesEnabled !== false;
            EditorState.selectedElements = EditorState.selectedElements || [];
        }

        // Set up event listeners
        const canvas = document.getElementById('brochureCanvas');
        if (!canvas) {
            console.warn('Canvas not found, drag system not initialized');
            return;
        }

        // Mouse events for dragging
        canvas.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        // Keyboard events
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        console.log('✅ Element drag system initialized');
    }

    // ========================================================================
    // EVENT HANDLERS
    // ========================================================================

    function handleMouseDown(event) {
        // Check if clicking on rotation handle
        const rotationHandle = event.target.closest('.rotation-handle');
        if (rotationHandle) {
            const element = rotationHandle.closest('.design-element');
            if (element && !isElementLocked(element)) {
                event.preventDefault();
                event.stopPropagation();
                startRotation(element, event);
                return;
            }
        }

        // Check if clicking on a resize handle
        const handle = event.target.closest('.resize-handle');
        if (handle) {
            const element = handle.closest('.design-element');
            if (element && !isElementLocked(element)) {
                event.preventDefault();
                event.stopPropagation();
                startResize(handle, element, event);
                return;
            }
        }

        // Check if clicking on a design element
        const element = event.target.closest('.design-element');
        if (element && !isElementLocked(element)) {
            event.preventDefault();
            selectElement(element);
            startDrag(element, event);
            return;
        }

        // Clicking on empty canvas area - deselect
        if (event.target.closest('.brochure-page') && !event.target.closest('.design-element')) {
            deselectAllElements();
        }
    }

    function handleMouseMove(event) {
        if (DragState.active) {
            event.preventDefault();
            updateDrag(event);
        } else if (ResizeState.active) {
            event.preventDefault();
            updateResize(event);
        } else if (RotationState.active) {
            event.preventDefault();
            updateRotation(event);
        }
    }

    function handleMouseUp(event) {
        if (DragState.active) {
            endDrag(event);
        } else if (ResizeState.active) {
            endResize(event);
        } else if (RotationState.active) {
            endRotation(event);
        }
    }

    function handleKeyDown(event) {
        // Shift key for maintaining aspect ratio during resize
        if (event.key === 'Shift') {
            ResizeState.maintainAspect = true;
        }

        // Delete key to remove selected element
        if ((event.key === 'Delete' || event.key === 'Backspace') &&
            EditorState.selectedElements && EditorState.selectedElements.length > 0) {
            // Don't delete if editing text
            if (document.activeElement.contentEditable === 'true') return;

            event.preventDefault();
            deleteSelectedElements();
        }

        // Arrow keys for nudging
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            if (EditorState.selectedElements && EditorState.selectedElements.length > 0) {
                event.preventDefault();
                nudgeSelectedElements(event.key, event.shiftKey ? 10 : 1);
            }
        }
    }

    function handleKeyUp(event) {
        if (event.key === 'Shift') {
            ResizeState.maintainAspect = false;
        }
    }

    // ========================================================================
    // DRAG OPERATIONS
    // ========================================================================

    function startDrag(element, event) {
        const page = element.closest('.brochure-page');
        if (!page) return;

        // Alt+drag to duplicate
        if (event.altKey) {
            element = duplicateElementForDrag(element, page);
            if (!element) return;
        }

        const pageRect = page.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        // Account for canvas zoom
        const zoom = getCanvasZoom();

        DragState.active = true;
        DragState.element = element;
        DragState.pageElement = page;
        DragState.startX = event.clientX;
        DragState.startY = event.clientY;
        DragState.offsetX = (event.clientX - elementRect.left) / zoom;
        DragState.offsetY = (event.clientY - elementRect.top) / zoom;
        DragState.originalPosition = {
            x: parseInt(element.style.left) || 0,
            y: parseInt(element.style.top) || 0
        };

        element.classList.add('dragging');

        // Save state for undo
        if (typeof saveToHistory === 'function') {
            saveToHistory(event.altKey ? 'duplicate element' : 'move element');
        }

        console.log('🎯 Started drag:', element.dataset.elementId, event.altKey ? '(duplicate)' : '');
    }

    /**
     * Duplicate element for Alt+drag operation
     */
    function duplicateElementForDrag(element, page) {
        try {
            // Clone the element
            const clone = element.cloneNode(true);

            // Generate new ID
            const timestamp = Date.now();
            const random = Math.random().toString(36).substr(2, 9);
            const newId = `${element.dataset.elementType || 'element'}_${timestamp}_${random}`;
            clone.dataset.elementId = newId;
            clone.id = newId;

            // Remove selection state from original
            element.classList.remove('selected');
            if (window.EditorState) {
                const idx = window.EditorState.selectedElements?.indexOf(element);
                if (idx > -1) {
                    window.EditorState.selectedElements.splice(idx, 1);
                }
            }

            // Add to page
            page.appendChild(clone);

            // Register in EditorState
            if (window.EditorState) {
                window.EditorState.elements = window.EditorState.elements || {};
                window.EditorState.elements[newId] = clone;
            }

            // Select the clone
            selectElement(clone);

            // Show toast
            if (typeof window.showToast === 'function') {
                window.showToast('Element duplicated');
            }

            console.log('🔄 Duplicated element for drag:', newId);
            return clone;
        } catch (e) {
            console.error('Failed to duplicate element:', e);
            return null;
        }
    }

    function updateDrag(event) {
        if (!DragState.active || !DragState.element) return;

        const page = DragState.pageElement;
        const pageRect = page.getBoundingClientRect();
        const zoom = getCanvasZoom();

        // Calculate new position relative to page
        let x = (event.clientX - pageRect.left) / zoom - DragState.offsetX;
        let y = (event.clientY - pageRect.top) / zoom - DragState.offsetY;

        // Track if we snapped
        let snappedX = false;
        let snappedY = false;

        // Snap to grid if enabled
        if (EditorState.gridVisible) {
            const snappedGridX = snapToGrid(x);
            const snappedGridY = snapToGrid(y);
            if (snappedGridX !== x) snappedX = true;
            if (snappedGridY !== y) snappedY = true;
            x = snappedGridX;
            y = snappedGridY;
        }

        // Constrain to page boundaries
        const elementWidth = DragState.element.offsetWidth;
        const elementHeight = DragState.element.offsetHeight;
        const pageWidth = page.offsetWidth;
        const pageHeight = page.offsetHeight;

        x = Math.max(0, Math.min(x, pageWidth - elementWidth));
        y = Math.max(0, Math.min(y, pageHeight - elementHeight));

        // Apply position
        DragState.element.style.left = x + 'px';
        DragState.element.style.top = y + 'px';

        // Show smart guides if enabled
        if (EditorState.smartGuidesEnabled && typeof showSmartGuides === 'function') {
            const snapResult = showSmartGuides(DragState.element);
            if (snapResult) {
                snappedX = snappedX || snapResult.snappedX;
                snappedY = snappedY || snapResult.snappedY;
            }
        }

        // Visual snap feedback
        if (snappedX && !DragState.element.classList.contains('snapped-x')) {
            DragState.element.classList.add('snapped-x');
            setTimeout(() => DragState.element.classList.remove('snapped-x'), 200);
        }
        if (snappedY && !DragState.element.classList.contains('snapped-y')) {
            DragState.element.classList.add('snapped-y');
            setTimeout(() => DragState.element.classList.remove('snapped-y'), 200);
        }
    }

    function endDrag(event) {
        if (!DragState.active) return;

        const element = DragState.element;
        element.classList.remove('dragging');

        // Hide smart guides
        if (typeof hideSmartGuides === 'function') {
            hideSmartGuides();
        }

        // Update element data
        const elementId = element.dataset.elementId;
        if (elementId) {
            updateElementPosition(elementId, {
                x: parseInt(element.style.left) || 0,
                y: parseInt(element.style.top) || 0
            });
        }

        // Mark as dirty
        if (typeof EditorState !== 'undefined') {
            EditorState.isDirty = true;
        }

        console.log('✅ Ended drag:', elementId);

        // Reset state
        DragState.active = false;
        DragState.element = null;
        DragState.pageElement = null;
    }

    // ========================================================================
    // RESIZE OPERATIONS
    // ========================================================================

    function startResize(handle, element, event) {
        const page = element.closest('.brochure-page');
        if (!page) return;

        ResizeState.active = true;
        ResizeState.handle = handle.dataset.handle;
        ResizeState.element = element;
        ResizeState.startX = event.clientX;
        ResizeState.startY = event.clientY;
        ResizeState.startWidth = element.offsetWidth;
        ResizeState.startHeight = element.offsetHeight;
        ResizeState.startLeft = parseInt(element.style.left) || 0;
        ResizeState.startTop = parseInt(element.style.top) || 0;
        ResizeState.aspectRatio = ResizeState.startWidth / ResizeState.startHeight;
        ResizeState.pageElement = page;

        element.classList.add('resizing');

        // Save state for undo
        if (typeof saveToHistory === 'function') {
            saveToHistory('resize element');
        }

        console.log('📐 Started resize:', element.dataset.elementId, 'handle:', ResizeState.handle);
    }

    function updateResize(event) {
        if (!ResizeState.active || !ResizeState.element) return;

        const zoom = getCanvasZoom();
        const deltaX = (event.clientX - ResizeState.startX) / zoom;
        const deltaY = (event.clientY - ResizeState.startY) / zoom;
        const handle = ResizeState.handle;
        const element = ResizeState.element;

        let newWidth = ResizeState.startWidth;
        let newHeight = ResizeState.startHeight;
        let newLeft = ResizeState.startLeft;
        let newTop = ResizeState.startTop;

        // Calculate new dimensions based on handle
        switch (handle) {
            case 'se':
                newWidth = ResizeState.startWidth + deltaX;
                newHeight = ResizeState.startHeight + deltaY;
                break;
            case 'sw':
                newWidth = ResizeState.startWidth - deltaX;
                newHeight = ResizeState.startHeight + deltaY;
                newLeft = ResizeState.startLeft + deltaX;
                break;
            case 'ne':
                newWidth = ResizeState.startWidth + deltaX;
                newHeight = ResizeState.startHeight - deltaY;
                newTop = ResizeState.startTop + deltaY;
                break;
            case 'nw':
                newWidth = ResizeState.startWidth - deltaX;
                newHeight = ResizeState.startHeight - deltaY;
                newLeft = ResizeState.startLeft + deltaX;
                newTop = ResizeState.startTop + deltaY;
                break;
            case 'n':
                newHeight = ResizeState.startHeight - deltaY;
                newTop = ResizeState.startTop + deltaY;
                break;
            case 's':
                newHeight = ResizeState.startHeight + deltaY;
                break;
            case 'e':
                newWidth = ResizeState.startWidth + deltaX;
                break;
            case 'w':
                newWidth = ResizeState.startWidth - deltaX;
                newLeft = ResizeState.startLeft + deltaX;
                break;
        }

        // Maintain aspect ratio if shift is held
        if (ResizeState.maintainAspect && ['nw', 'ne', 'sw', 'se'].includes(handle)) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                newHeight = newWidth / ResizeState.aspectRatio;
            } else {
                newWidth = newHeight * ResizeState.aspectRatio;
            }
        }

        // Minimum size
        const minSize = 20;
        newWidth = Math.max(minSize, newWidth);
        newHeight = Math.max(minSize, newHeight);

        // Apply to element
        element.style.width = newWidth + 'px';
        element.style.height = newHeight + 'px';
        element.style.left = newLeft + 'px';
        element.style.top = newTop + 'px';
    }

    function endResize(event) {
        if (!ResizeState.active) return;

        const element = ResizeState.element;
        element.classList.remove('resizing');

        // Update element data
        const elementId = element.dataset.elementId;
        if (elementId) {
            updateElementSize(elementId, {
                width: element.offsetWidth,
                height: element.offsetHeight,
                x: parseInt(element.style.left) || 0,
                y: parseInt(element.style.top) || 0
            });
        }

        // Mark as dirty
        if (typeof EditorState !== 'undefined') {
            EditorState.isDirty = true;
        }

        console.log('✅ Ended resize:', elementId);

        // Reset state
        ResizeState.active = false;
        ResizeState.element = null;
        ResizeState.handle = null;
    }

    // ========================================================================
    // ROTATION OPERATIONS
    // ========================================================================

    function startRotation(element, event) {
        const rect = element.getBoundingClientRect();
        const zoom = getCanvasZoom();

        // Calculate center of element
        RotationState.active = true;
        RotationState.element = element;
        RotationState.centerX = rect.left + rect.width / 2;
        RotationState.centerY = rect.top + rect.height / 2;

        // Get current rotation
        const transform = element.style.transform || '';
        const match = transform.match(/rotate\((-?\d+(?:\.\d+)?)deg\)/);
        RotationState.currentRotation = match ? parseFloat(match[1]) : 0;

        // Calculate starting angle from mouse to center
        RotationState.startAngle = Math.atan2(
            event.clientY - RotationState.centerY,
            event.clientX - RotationState.centerX
        ) * (180 / Math.PI);

        element.classList.add('rotating');

        // Save state for undo
        if (typeof saveToHistory === 'function') {
            saveToHistory('rotate element');
        }

        console.log('🔄 Started rotation:', element.dataset.elementId);
    }

    function updateRotation(event) {
        if (!RotationState.active || !RotationState.element) return;

        // Calculate current angle from mouse to center
        const currentAngle = Math.atan2(
            event.clientY - RotationState.centerY,
            event.clientX - RotationState.centerX
        ) * (180 / Math.PI);

        // Calculate rotation delta
        let delta = currentAngle - RotationState.startAngle;
        let newRotation = RotationState.currentRotation + delta;

        // Snap to 15 degree increments if shift is held
        if (event.shiftKey) {
            newRotation = Math.round(newRotation / 15) * 15;
        }

        // Normalize to -180 to 180
        while (newRotation > 180) newRotation -= 360;
        while (newRotation < -180) newRotation += 360;

        // Apply rotation
        const element = RotationState.element;
        element.style.transform = `rotate(${newRotation}deg)`;
    }

    function endRotation(event) {
        if (!RotationState.active) return;

        const element = RotationState.element;
        element.classList.remove('rotating');

        // Update element data
        const elementId = element.dataset.elementId;
        if (elementId) {
            const transform = element.style.transform || '';
            const match = transform.match(/rotate\((-?\d+(?:\.\d+)?)deg\)/);
            const rotation = match ? parseFloat(match[1]) : 0;
            updateElementRotation(elementId, rotation);
        }

        // Mark as dirty
        if (typeof EditorState !== 'undefined') {
            EditorState.isDirty = true;
        }

        console.log('✅ Ended rotation:', elementId);

        // Reset state
        RotationState.active = false;
        RotationState.element = null;
    }

    function updateElementRotation(elementId, rotation) {
        // Find element in state and update
        for (const pageId in EditorState.elements) {
            const elements = EditorState.elements[pageId];
            const element = elements.find(el => el.id === elementId);
            if (element) {
                element.rotation = rotation;
                break;
            }
        }
    }

    // ========================================================================
    // SELECTION
    // ========================================================================

    function selectElement(element) {
        // Deselect previous
        deselectAllElements();

        // Select new
        element.classList.add('selected');
        addResizeHandles(element);

        // Update state
        if (typeof EditorState !== 'undefined') {
            EditorState.selectedElements = [element];
        }

        // Show properties panel for element type
        const elementType = element.dataset.elementType;
        if (typeof showElementProperties === 'function') {
            showElementProperties(element, elementType);
        }

        // Trigger layer panel update
        if (typeof updateLayerSelection === 'function') {
            updateLayerSelection(element.dataset.elementId);
        }

        console.log('🎯 Selected element:', element.dataset.elementId);
    }

    function deselectAllElements() {
        document.querySelectorAll('.design-element.selected').forEach(el => {
            el.classList.remove('selected');
            removeResizeHandles(el);
        });

        if (typeof EditorState !== 'undefined') {
            EditorState.selectedElements = [];
        }

        // Hide element properties panel
        if (typeof hideElementProperties === 'function') {
            hideElementProperties();
        }
    }

    function deleteSelectedElements() {
        if (!EditorState.selectedElements || EditorState.selectedElements.length === 0) return;

        // Save for undo
        if (typeof saveToHistory === 'function') {
            saveToHistory('delete element');
        }

        EditorState.selectedElements.forEach(element => {
            const elementId = element.dataset.elementId;
            const pageId = element.closest('.brochure-page')?.dataset.pageId;

            // Remove from DOM
            element.remove();

            // Remove from state
            if (pageId && EditorState.elements[pageId]) {
                EditorState.elements[pageId] = EditorState.elements[pageId].filter(
                    el => el.id !== elementId
                );
            }

            console.log('🗑️ Deleted element:', elementId);
        });

        EditorState.selectedElements = [];
        EditorState.isDirty = true;

        // Update layer panel
        if (typeof renderLayerPanel === 'function') {
            renderLayerPanel();
        }
    }

    function nudgeSelectedElements(direction, amount) {
        EditorState.selectedElements.forEach(element => {
            let left = parseInt(element.style.left) || 0;
            let top = parseInt(element.style.top) || 0;

            switch (direction) {
                case 'ArrowUp': top -= amount; break;
                case 'ArrowDown': top += amount; break;
                case 'ArrowLeft': left -= amount; break;
                case 'ArrowRight': left += amount; break;
            }

            element.style.left = left + 'px';
            element.style.top = top + 'px';

            // Update element data
            updateElementPosition(element.dataset.elementId, { x: left, y: top });
        });

        EditorState.isDirty = true;
    }

    // ========================================================================
    // RESIZE HANDLES
    // ========================================================================

    function addResizeHandles(element) {
        // Remove existing handles first
        removeResizeHandles(element);

        const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
        const container = document.createElement('div');
        container.className = 'resize-handles-container';

        handles.forEach(pos => {
            const handle = document.createElement('div');
            handle.className = `resize-handle resize-${pos}`;
            handle.dataset.handle = pos;
            container.appendChild(handle);
        });

        // Add rotation handle
        const rotationHandle = document.createElement('div');
        rotationHandle.className = 'rotation-handle';
        rotationHandle.title = 'Rotate (hold Shift for 15° increments)';
        container.appendChild(rotationHandle);

        element.appendChild(container);
    }

    function removeResizeHandles(element) {
        const container = element.querySelector('.resize-handles-container');
        if (container) {
            container.remove();
        }
    }

    // ========================================================================
    // HELPER FUNCTIONS
    // ========================================================================

    function isElementLocked(element) {
        const elementId = element.dataset.elementId;
        if (!elementId) return false;

        // Check in EditorState
        const pageId = element.closest('.brochure-page')?.dataset.pageId;
        if (pageId && EditorState.elements[pageId]) {
            const elementData = EditorState.elements[pageId].find(el => el.id === elementId);
            return elementData?.locked === true;
        }

        return element.classList.contains('locked');
    }

    function getCanvasZoom() {
        const canvas = document.getElementById('brochureCanvas');
        if (!canvas) return 1;

        const transform = canvas.style.transform;
        const match = transform.match(/scale\(([^)]+)\)/);
        return match ? parseFloat(match[1]) : 1;
    }

    function snapToGrid(value, gridSize = 10) {
        return Math.round(value / gridSize) * gridSize;
    }

    function updateElementPosition(elementId, position) {
        // Find element in state and update
        for (const pageId in EditorState.elements) {
            const elements = EditorState.elements[pageId];
            const element = elements.find(el => el.id === elementId);
            if (element) {
                element.position = { x: position.x, y: position.y };
                break;
            }
        }
    }

    function updateElementSize(elementId, dimensions) {
        // Find element in state and update
        for (const pageId in EditorState.elements) {
            const elements = EditorState.elements[pageId];
            const element = elements.find(el => el.id === elementId);
            if (element) {
                element.size = { width: dimensions.width, height: dimensions.height };
                element.position = { x: dimensions.x, y: dimensions.y };
                break;
            }
        }
    }

    // ========================================================================
    // ELEMENT CREATION HELPERS
    // ========================================================================

    function createElementId() {
        return `elem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    function getNextZIndex(pageId) {
        const elements = EditorState.elements[pageId] || [];
        if (elements.length === 0) return 10;
        return Math.max(...elements.map(el => el.zIndex || 10)) + 1;
    }

    function addElementToPage(elementData, pageId) {
        // Initialize page elements array if needed
        if (!EditorState.elements[pageId]) {
            EditorState.elements[pageId] = [];
        }

        // Add element data
        EditorState.elements[pageId].push(elementData);

        // Render element on canvas
        renderElementOnCanvas(elementData, pageId);

        // Update layer panel
        if (typeof renderLayerPanel === 'function') {
            renderLayerPanel();
        }

        // Mark dirty
        EditorState.isDirty = true;

        console.log('➕ Added element:', elementData.id, 'to page:', pageId);
    }

    function renderElementOnCanvas(elementData, pageId) {
        const page = document.querySelector(`.brochure-page[data-page-id="${pageId}"]`);
        if (!page) return;

        const element = document.createElement('div');
        element.className = `design-element ${elementData.type}-element`;
        element.dataset.elementId = elementData.id;
        element.dataset.elementType = elementData.type;

        // Apply position and size
        element.style.position = 'absolute';
        element.style.left = elementData.position.x + 'px';
        element.style.top = elementData.position.y + 'px';
        element.style.width = elementData.size.width + 'px';
        element.style.height = elementData.size.height + 'px';
        element.style.zIndex = elementData.zIndex;

        // Apply visibility and lock
        if (!elementData.visible) {
            element.style.display = 'none';
        }
        if (elementData.locked) {
            element.classList.add('locked');
        }

        // Render content based on type
        switch (elementData.type) {
            case 'shape':
                renderShapeContent(element, elementData);
                break;
            case 'icon':
                renderIconContent(element, elementData);
                break;
            case 'qrcode':
                renderQRCodeContent(element, elementData);
                break;
        }

        page.appendChild(element);
    }

    function renderShapeContent(element, data) {
        const shape = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        shape.setAttribute('width', '100%');
        shape.setAttribute('height', '100%');
        shape.setAttribute('preserveAspectRatio', 'none');

        let shapeEl;
        switch (data.shapeType) {
            case 'rectangle':
                shapeEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                shapeEl.setAttribute('width', '100%');
                shapeEl.setAttribute('height', '100%');
                shapeEl.setAttribute('rx', data.borderRadius || 0);
                break;
            case 'circle':
                shapeEl = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
                shapeEl.setAttribute('cx', '50%');
                shapeEl.setAttribute('cy', '50%');
                shapeEl.setAttribute('rx', '50%');
                shapeEl.setAttribute('ry', '50%');
                break;
            case 'triangle':
                shapeEl = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                shapeEl.setAttribute('points', '50,0 100,100 0,100');
                break;
            case 'line':
                shapeEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                shapeEl.setAttribute('x1', '0');
                shapeEl.setAttribute('y1', '50%');
                shapeEl.setAttribute('x2', '100%');
                shapeEl.setAttribute('y2', '50%');
                break;
        }

        if (shapeEl) {
            shapeEl.setAttribute('fill', data.fill || '#C20430');
            shapeEl.setAttribute('stroke', data.stroke || 'none');
            shapeEl.setAttribute('stroke-width', data.strokeWidth || 0);
            shape.appendChild(shapeEl);
        }

        element.appendChild(shape);
    }

    function renderIconContent(element, data) {
        element.innerHTML = `
            <svg viewBox="${data.viewBox || '0 0 24 24'}"
                 width="100%" height="100%"
                 fill="${data.fill || '#374151'}"
                 style="pointer-events: none;">
                ${data.svgPath || ''}
            </svg>
        `;
    }

    function renderQRCodeContent(element, data) {
        // QR code rendering will be handled by qrcode_generator.js
        element.innerHTML = `
            <div class="qrcode-placeholder" style="
                width: 100%; height: 100%;
                display: flex; align-items: center; justify-content: center;
                background: white; border: 1px dashed #ccc;
            ">
                <span style="color: #666; font-size: 12px;">QR Code</span>
            </div>
        `;

        // Generate actual QR code if function available
        if (typeof generateQRCode === 'function' && data.url) {
            generateQRCode(element, data.url, data);
        }
    }

    // ========================================================================
    // SIDEBAR DRAG PREVIEW GHOST SYSTEM
    // For dragging elements from sidebar to canvas with visual preview
    // ========================================================================

    const SidebarDragState = {
        active: false,
        ghost: null,
        elementData: null,
        sourceType: null // 'template', 'shape', 'icon', 'stock-photo', etc.
    };

    /**
     * Initialize sidebar draggable items
     */
    function initSidebarDraggables() {
        console.log('🎯 Initializing sidebar drag previews...');

        // Find all draggable sidebar items
        const draggableSelectors = [
            '.sidebar-item[draggable="true"]',
            '.element-library-item[draggable="true"]',
            '.template-item[draggable="true"]',
            '.shape-item[draggable="true"]',
            '.icon-item[draggable="true"]',
            '.stock-photo-item',
            '[data-sidebar-draggable]'
        ];

        document.querySelectorAll(draggableSelectors.join(', ')).forEach(item => {
            setupDragPreview(item);
        });

        // Set up drop zone on canvas
        const canvas = document.getElementById('brochureCanvas');
        if (canvas) {
            canvas.addEventListener('dragover', handleCanvasDragOver);
            canvas.addEventListener('drop', handleCanvasDrop);
            canvas.addEventListener('dragleave', handleCanvasDragLeave);
        }

        // Also set up drop on brochure pages
        document.querySelectorAll('.brochure-page').forEach(page => {
            page.addEventListener('dragover', handleCanvasDragOver);
            page.addEventListener('drop', handleCanvasDrop);
            page.addEventListener('dragleave', handleCanvasDragLeave);
        });

        console.log('✅ Sidebar drag previews initialized');
    }

    /**
     * Set up drag preview for a sidebar item
     */
    function setupDragPreview(item) {
        if (item.dataset.dragPreviewSetup) return;
        item.dataset.dragPreviewSetup = 'true';

        // Ensure draggable
        item.draggable = true;

        item.addEventListener('dragstart', handleSidebarDragStart);
        item.addEventListener('dragend', handleSidebarDragEnd);
    }

    /**
     * Handle sidebar item drag start - create ghost preview
     */
    function handleSidebarDragStart(e) {
        const item = e.currentTarget;

        // Collect element data from item
        const elementData = {
            type: item.dataset.elementType || item.dataset.type || 'unknown',
            subtype: item.dataset.subtype || item.dataset.shapeType,
            content: item.dataset.content || item.textContent?.trim(),
            icon: item.dataset.icon,
            imageUrl: item.dataset.photoUrl || item.dataset.imageUrl,
            template: item.dataset.template,
            color: item.dataset.color || getComputedStyle(item).backgroundColor,
            width: parseInt(item.dataset.width) || 100,
            height: parseInt(item.dataset.height) || 100
        };

        SidebarDragState.active = true;
        SidebarDragState.elementData = elementData;
        SidebarDragState.sourceType = elementData.type;

        // Set drag data for browsers
        const dragDataStr = JSON.stringify(elementData);
        e.dataTransfer.setData('text/plain', dragDataStr);
        e.dataTransfer.setData('application/json', dragDataStr);
        e.dataTransfer.effectAllowed = 'copy';

        // Create custom ghost element
        const ghost = createDragGhost(item, elementData);
        SidebarDragState.ghost = ghost;
        document.body.appendChild(ghost);

        // Use empty image as default drag preview (we use our custom ghost)
        const emptyImg = new Image();
        emptyImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        e.dataTransfer.setDragImage(emptyImg, 0, 0);

        // Start tracking mouse to move ghost
        document.addEventListener('dragover', updateGhostPosition);

        console.log('🎯 Sidebar drag started:', elementData.type);
    }

    /**
     * Create a visual ghost element for drag preview
     */
    function createDragGhost(item, data) {
        const ghost = document.createElement('div');
        ghost.className = 'drag-preview-ghost';
        ghost.style.cssText = `
            position: fixed;
            pointer-events: none;
            z-index: 99999;
            opacity: 0.85;
            transform: translate(-50%, -50%) scale(0.9);
            transition: transform 0.1s ease;
            border: 2px dashed var(--primary-color, #C20430);
            border-radius: 4px;
            background: white;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            padding: 8px;
            min-width: 80px;
            min-height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 4px;
        `;

        // Create content based on type
        let content = '';
        let width = data.width || 100;
        let height = data.height || 80;

        switch (data.type) {
            case 'shape':
                content = createShapeGhostContent(data);
                break;

            case 'icon':
                content = `
                    <div style="font-size: 32px;">${data.icon || '⭐'}</div>
                    <span style="font-size: 10px; color: #666;">Icon</span>
                `;
                width = 60;
                height = 60;
                break;

            case 'text':
                content = `
                    <div style="font-size: 14px; font-weight: bold;">Aa</div>
                    <span style="font-size: 10px; color: #666;">Text</span>
                `;
                width = 80;
                height = 40;
                break;

            case 'image':
            case 'stock-photo':
                const imgUrl = data.imageUrl || '';
                if (imgUrl) {
                    content = `<img src="${imgUrl}" style="max-width: 100%; max-height: 100%; object-fit: cover; border-radius: 2px;" />`;
                } else {
                    content = `
                        <div style="font-size: 24px;">🖼️</div>
                        <span style="font-size: 10px; color: #666;">Image</span>
                    `;
                }
                width = 120;
                height = 90;
                break;

            case 'template':
                content = `
                    <div style="font-size: 20px;">📄</div>
                    <span style="font-size: 10px; color: #666; text-align: center;">${data.subtype || 'Template'}</span>
                `;
                width = 100;
                height = 80;
                break;

            case 'badge':
                content = `
                    <div style="
                        background: var(--primary-color, #C20430);
                        color: white;
                        padding: 4px 12px;
                        font-size: 11px;
                        font-weight: bold;
                        border-radius: 2px;
                    ">${data.content || 'BADGE'}</div>
                `;
                width = 90;
                height = 40;
                break;

            default:
                // Try to clone item appearance
                const cloned = item.cloneNode(true);
                cloned.style.cssText = 'max-width: 100px; max-height: 80px; overflow: hidden;';
                content = cloned.outerHTML;
        }

        ghost.style.width = width + 'px';
        ghost.style.height = height + 'px';
        ghost.innerHTML = content;

        // Add drop hint text
        const hint = document.createElement('div');
        hint.style.cssText = `
            position: absolute;
            bottom: -24px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 11px;
            color: var(--primary-color, #C20430);
            white-space: nowrap;
            font-weight: 500;
        `;
        hint.textContent = 'Drop on canvas';
        ghost.appendChild(hint);

        return ghost;
    }

    /**
     * Create shape preview content
     */
    function createShapeGhostContent(data) {
        const color = data.color || '#C20430';
        const shapeType = data.subtype || 'rectangle';

        let svgContent = '';
        switch (shapeType) {
            case 'circle':
                svgContent = `<ellipse cx="50" cy="50" rx="45" ry="45" fill="${color}"/>`;
                break;
            case 'triangle':
                svgContent = `<polygon points="50,5 95,95 5,95" fill="${color}"/>`;
                break;
            case 'line':
                svgContent = `<line x1="5" y1="50" x2="95" y2="50" stroke="${color}" stroke-width="4"/>`;
                break;
            default: // rectangle
                svgContent = `<rect x="5" y="5" width="90" height="90" rx="4" fill="${color}"/>`;
        }

        return `<svg viewBox="0 0 100 100" width="60" height="60">${svgContent}</svg>`;
    }

    /**
     * Update ghost position to follow cursor
     */
    function updateGhostPosition(e) {
        if (!SidebarDragState.ghost) return;

        SidebarDragState.ghost.style.left = e.clientX + 'px';
        SidebarDragState.ghost.style.top = e.clientY + 'px';
    }

    /**
     * Handle drag over canvas - show drop indicator
     */
    function handleCanvasDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';

        // Highlight drop target
        const page = e.target.closest('.brochure-page');
        if (page) {
            page.classList.add('drag-over');

            // Scale up ghost slightly when over valid drop target
            if (SidebarDragState.ghost) {
                SidebarDragState.ghost.style.transform = 'translate(-50%, -50%) scale(1)';
                SidebarDragState.ghost.style.borderColor = '#27ae60';
            }
        }
    }

    /**
     * Handle drag leave - remove drop indicator
     */
    function handleCanvasDragLeave(e) {
        const page = e.target.closest('.brochure-page');
        if (page && !page.contains(e.relatedTarget)) {
            page.classList.remove('drag-over');

            // Reset ghost scale
            if (SidebarDragState.ghost) {
                SidebarDragState.ghost.style.transform = 'translate(-50%, -50%) scale(0.9)';
                SidebarDragState.ghost.style.borderColor = 'var(--primary-color, #C20430)';
            }
        }
    }

    /**
     * Handle drop on canvas - create element
     */
    function handleCanvasDrop(e) {
        e.preventDefault();

        // Get drop target page
        const page = e.target.closest('.brochure-page');
        if (!page) {
            console.warn('Drop not on a page');
            return;
        }

        page.classList.remove('drag-over');

        // Get element data
        let elementData = SidebarDragState.elementData;
        if (!elementData) {
            // Try to get from dataTransfer
            try {
                const jsonData = e.dataTransfer.getData('application/json') ||
                                 e.dataTransfer.getData('text/plain');
                if (jsonData) {
                    elementData = JSON.parse(jsonData);
                }
            } catch (err) {
                console.error('Failed to parse drop data:', err);
                return;
            }
        }

        if (!elementData) {
            console.warn('No element data for drop');
            return;
        }

        // Calculate drop position relative to page
        const pageRect = page.getBoundingClientRect();
        const zoom = getCanvasZoom();
        const dropX = (e.clientX - pageRect.left) / zoom - (elementData.width || 100) / 2;
        const dropY = (e.clientY - pageRect.top) / zoom - (elementData.height || 80) / 2;

        // Create element based on type
        createDroppedElement(elementData, page, dropX, dropY);

        console.log('✅ Element dropped:', elementData.type, 'at', dropX, dropY);
    }

    /**
     * Handle sidebar drag end - cleanup
     */
    function handleSidebarDragEnd(e) {
        // Remove ghost
        if (SidebarDragState.ghost) {
            SidebarDragState.ghost.remove();
            SidebarDragState.ghost = null;
        }

        // Remove dragover listener
        document.removeEventListener('dragover', updateGhostPosition);

        // Remove any remaining drag-over classes
        document.querySelectorAll('.drag-over').forEach(el => {
            el.classList.remove('drag-over');
        });

        // Reset state
        SidebarDragState.active = false;
        SidebarDragState.elementData = null;
        SidebarDragState.sourceType = null;

        console.log('🎯 Sidebar drag ended');
    }

    /**
     * Create element after drop
     */
    function createDroppedElement(data, page, x, y) {
        const pageId = page.dataset.pageId || 'page_1';

        // Create element data
        const elementData = {
            id: createElementId(),
            type: data.type,
            position: { x: Math.max(0, x), y: Math.max(0, y) },
            size: { width: data.width || 100, height: data.height || 100 },
            zIndex: getNextZIndex(pageId),
            visible: true,
            locked: false,
            ...data
        };

        // Add to page using existing function
        addElementToPage(elementData, pageId);

        // Select the new element
        setTimeout(() => {
            const newElement = document.querySelector(`[data-element-id="${elementData.id}"]`);
            if (newElement) {
                selectElement(newElement);
            }
        }, 100);

        // Show toast
        if (typeof window.showToast === 'function') {
            window.showToast('Element added');
        }
    }

    /**
     * Make an existing element draggable from sidebar
     * Call this for dynamically created sidebar items
     */
    function makeElementDraggable(element) {
        setupDragPreview(element);
    }

    // Initialize sidebar draggables after a short delay
    setTimeout(initSidebarDraggables, 1000);

    // Re-initialize when new elements are added to sidebar
    const sidebarObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        const draggables = node.querySelectorAll ?
                            node.querySelectorAll('[draggable="true"], .stock-photo-item, [data-sidebar-draggable]') :
                            [];
                        draggables.forEach(setupDragPreview);
                        if (node.matches && (node.matches('[draggable="true"]') || node.matches('.stock-photo-item'))) {
                            setupDragPreview(node);
                        }
                    }
                });
            }
        });
    });

    // Observe sidebar for new draggable items
    const sidebar = document.querySelector('.editor-sidebar, .sidebar, #sidebar');
    if (sidebar) {
        sidebarObserver.observe(sidebar, { childList: true, subtree: true });
    }

    // ========================================================================
    // EXPOSE TO GLOBAL SCOPE
    // ========================================================================

    window.ElementDrag = {
        init: initDragSystem,
        selectElement,
        deselectAllElements,
        addElementToPage,
        renderElementOnCanvas,
        createElementId,
        getNextZIndex,
        isElementLocked,
        addResizeHandles,
        removeResizeHandles,
        makeElementDraggable,
        initSidebarDraggables,
        DragState,
        ResizeState,
        SidebarDragState,
        isLoaded: true
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDragSystem);
    } else {
        // DOM already loaded, wait for editor to be ready
        setTimeout(initDragSystem, 500);
    }

})();
