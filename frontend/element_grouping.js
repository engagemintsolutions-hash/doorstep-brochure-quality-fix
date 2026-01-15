/**
 * Element Grouping - Multi-select, group/ungroup elements
 * Ctrl+G to group, Ctrl+Shift+G to ungroup
 */

(function() {
    'use strict';

    // ============================================================================
    // MULTI-SELECT STATE
    // ============================================================================

    let selectedElements = [];
    let groupIdCounter = 1;

    /**
     * Initialize grouping system
     */
    function init() {
        // Add keyboard shortcuts
        document.addEventListener('keydown', handleKeyDown);

        // Add shift-click for multi-select
        document.addEventListener('click', handleClick, true);

        console.log('Element Grouping initialized');
    }

    /**
     * Handle keyboard shortcuts
     */
    function handleKeyDown(e) {
        // Ctrl+G - Group selected elements
        if ((e.ctrlKey || e.metaKey) && e.key === 'g' && !e.shiftKey) {
            e.preventDefault();
            groupSelected();
        }

        // Ctrl+Shift+G - Ungroup
        if ((e.ctrlKey || e.metaKey) && e.key === 'g' && e.shiftKey) {
            e.preventDefault();
            ungroupSelected();
        }

        // Ctrl+A - Select all on current page
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            const target = e.target;
            if (!target.matches('input, textarea')) {
                e.preventDefault();
                selectAllOnPage();
            }
        }

        // Delete - Remove selected elements
        if (e.key === 'Delete' || e.key === 'Backspace') {
            const target = e.target;
            if (!target.matches('input, textarea')) {
                deleteSelected();
            }
        }

        // Escape - Deselect all
        if (e.key === 'Escape') {
            deselectAll();
        }

        // Arrow keys - Move selected
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            if (selectedElements.length > 0 && !e.target.matches('input, textarea')) {
                e.preventDefault();
                moveSelected(e.key, e.shiftKey ? 10 : 1);
            }
        }
    }

    /**
     * Handle click for multi-select
     */
    function handleClick(e) {
        const element = e.target.closest('.design-element, .brochure-element');

        if (element) {
            if (e.shiftKey) {
                // Shift+click: Add/remove from selection
                e.preventDefault();
                e.stopPropagation();
                toggleSelection(element);
            } else if (!e.ctrlKey && !e.metaKey) {
                // Normal click: Only select this element if clicking on element itself
                if (!element.classList.contains('selected')) {
                    // Will be handled by the main editor
                }
            }
        }
    }

    /**
     * Add element to selection
     */
    function addToSelection(element) {
        if (!selectedElements.includes(element)) {
            selectedElements.push(element);
            element.classList.add('multi-selected');
            updateSelectionUI();
        }
    }

    /**
     * Remove element from selection
     */
    function removeFromSelection(element) {
        const index = selectedElements.indexOf(element);
        if (index > -1) {
            selectedElements.splice(index, 1);
            element.classList.remove('multi-selected');
            updateSelectionUI();
        }
    }

    /**
     * Toggle element selection
     */
    function toggleSelection(element) {
        if (selectedElements.includes(element)) {
            removeFromSelection(element);
        } else {
            addToSelection(element);
        }
    }

    /**
     * Select single element (clear others)
     */
    function selectSingle(element) {
        deselectAll();
        addToSelection(element);
    }

    /**
     * Deselect all elements
     */
    function deselectAll() {
        selectedElements.forEach(el => {
            el.classList.remove('multi-selected');
        });
        selectedElements = [];
        updateSelectionUI();
        hideGroupBoundingBox();
    }

    /**
     * Select all elements on current page
     */
    function selectAllOnPage() {
        const currentPage = document.querySelector('.page-container.active .page-canvas, .page-canvas');
        if (!currentPage) return;

        const elements = currentPage.querySelectorAll('.design-element, .brochure-element');
        deselectAll();
        elements.forEach(el => addToSelection(el));
        showGroupBoundingBox();
    }

    /**
     * Get selection count
     */
    function getSelectionCount() {
        return selectedElements.length;
    }

    /**
     * Get selected elements
     */
    function getSelected() {
        return [...selectedElements];
    }

    // ============================================================================
    // GROUPING
    // ============================================================================

    /**
     * Group selected elements
     */
    function groupSelected() {
        if (selectedElements.length < 2) {
            showToast('Select at least 2 elements to group');
            return;
        }

        const parent = selectedElements[0].parentElement;
        const groupId = `group_${groupIdCounter++}`;

        // Calculate group bounds
        const bounds = calculateBounds(selectedElements);

        // Create group container
        const group = document.createElement('div');
        group.className = 'design-element element-group';
        group.dataset.elementType = 'group';
        group.dataset.elementId = groupId;
        group.dataset.groupId = groupId;
        group.style.cssText = `
            position: absolute;
            left: ${bounds.left}px;
            top: ${bounds.top}px;
            width: ${bounds.width}px;
            height: ${bounds.height}px;
        `;

        // Move elements into group (adjust positions to be relative to group)
        selectedElements.forEach(el => {
            const elLeft = parseFloat(el.style.left) || 0;
            const elTop = parseFloat(el.style.top) || 0;

            el.style.left = `${elLeft - bounds.left}px`;
            el.style.top = `${elTop - bounds.top}px`;
            el.dataset.inGroup = groupId;

            group.appendChild(el);
        });

        parent.appendChild(group);

        // Select the group
        deselectAll();
        addToSelection(group);

        // Initialize drag on group
        if (typeof initElementDrag === 'function') {
            initElementDrag(group);
        }

        showToast(`Grouped ${selectedElements.length} elements`);

        // Dispatch event
        window.dispatchEvent(new CustomEvent('elementsGrouped', {
            detail: { groupId, elementCount: selectedElements.length }
        }));
    }

    /**
     * Ungroup selected group
     */
    function ungroupSelected() {
        const groups = selectedElements.filter(el => el.dataset.elementType === 'group');

        if (groups.length === 0) {
            showToast('Select a group to ungroup');
            return;
        }

        let ungroupedCount = 0;

        groups.forEach(group => {
            const parent = group.parentElement;
            const groupLeft = parseFloat(group.style.left) || 0;
            const groupTop = parseFloat(group.style.top) || 0;

            // Get children and move them out
            const children = Array.from(group.children);
            children.forEach(child => {
                const childLeft = parseFloat(child.style.left) || 0;
                const childTop = parseFloat(child.style.top) || 0;

                child.style.left = `${groupLeft + childLeft}px`;
                child.style.top = `${groupTop + childTop}px`;
                delete child.dataset.inGroup;

                parent.appendChild(child);
                ungroupedCount++;
            });

            // Remove empty group
            group.remove();
        });

        deselectAll();
        showToast(`Ungrouped ${ungroupedCount} elements`);

        // Dispatch event
        window.dispatchEvent(new CustomEvent('elementsUngrouped', {
            detail: { count: ungroupedCount }
        }));
    }

    /**
     * Calculate bounding box of elements
     */
    function calculateBounds(elements) {
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;

        elements.forEach(el => {
            const left = parseFloat(el.style.left) || 0;
            const top = parseFloat(el.style.top) || 0;
            const width = el.offsetWidth || parseFloat(el.style.width) || 100;
            const height = el.offsetHeight || parseFloat(el.style.height) || 100;

            minX = Math.min(minX, left);
            minY = Math.min(minY, top);
            maxX = Math.max(maxX, left + width);
            maxY = Math.max(maxY, top + height);
        });

        return {
            left: minX,
            top: minY,
            width: maxX - minX,
            height: maxY - minY,
            right: maxX,
            bottom: maxY
        };
    }

    // ============================================================================
    // MOVE SELECTED
    // ============================================================================

    /**
     * Move selected elements with arrow keys
     */
    function moveSelected(direction, amount) {
        const dx = direction === 'ArrowRight' ? amount : direction === 'ArrowLeft' ? -amount : 0;
        const dy = direction === 'ArrowDown' ? amount : direction === 'ArrowUp' ? -amount : 0;

        selectedElements.forEach(el => {
            const left = parseFloat(el.style.left) || 0;
            const top = parseFloat(el.style.top) || 0;
            el.style.left = `${left + dx}px`;
            el.style.top = `${top + dy}px`;
        });

        updateGroupBoundingBox();
    }

    /**
     * Delete selected elements
     */
    function deleteSelected() {
        if (selectedElements.length === 0) return;

        const count = selectedElements.length;
        selectedElements.forEach(el => {
            el.remove();
        });

        selectedElements = [];
        hideGroupBoundingBox();
        showToast(`Deleted ${count} element${count > 1 ? 's' : ''}`);

        if (window.EditorState) {
            window.EditorState.isDirty = true;
        }
    }

    // ============================================================================
    // VISUAL FEEDBACK
    // ============================================================================

    let boundingBox = null;

    /**
     * Show bounding box around selected elements
     */
    function showGroupBoundingBox() {
        if (selectedElements.length < 2) {
            hideGroupBoundingBox();
            return;
        }

        const bounds = calculateBounds(selectedElements);
        const parent = selectedElements[0].parentElement;

        if (!boundingBox) {
            boundingBox = document.createElement('div');
            boundingBox.className = 'group-bounding-box';
            boundingBox.innerHTML = `
                <div class="group-count">${selectedElements.length} selected</div>
            `;
        }

        boundingBox.style.cssText = `
            position: absolute;
            left: ${bounds.left - 2}px;
            top: ${bounds.top - 2}px;
            width: ${bounds.width + 4}px;
            height: ${bounds.height + 4}px;
            pointer-events: none;
            z-index: 1000;
        `;

        boundingBox.querySelector('.group-count').textContent = `${selectedElements.length} selected`;

        if (!boundingBox.parentElement) {
            parent.appendChild(boundingBox);
        }
    }

    /**
     * Update bounding box position
     */
    function updateGroupBoundingBox() {
        if (selectedElements.length >= 2) {
            showGroupBoundingBox();
        }
    }

    /**
     * Hide bounding box
     */
    function hideGroupBoundingBox() {
        if (boundingBox && boundingBox.parentElement) {
            boundingBox.remove();
        }
    }

    /**
     * Update selection UI
     */
    function updateSelectionUI() {
        if (selectedElements.length >= 2) {
            showGroupBoundingBox();
        } else {
            hideGroupBoundingBox();
        }

        // Dispatch event
        window.dispatchEvent(new CustomEvent('selectionChanged', {
            detail: { count: selectedElements.length, elements: selectedElements }
        }));
    }

    /**
     * Show toast
     */
    function showToast(msg) {
        if (typeof window.showToast === 'function') {
            window.showToast(msg);
        }
    }

    // ============================================================================
    // STYLES
    // ============================================================================

    const styles = document.createElement('style');
    styles.textContent = `
        .multi-selected {
            outline: 2px solid #2196F3 !important;
            outline-offset: 2px;
        }

        .element-group {
            border: 1px dashed rgba(33, 150, 243, 0.5);
        }

        .element-group.selected {
            border-color: #2196F3;
        }

        .group-bounding-box {
            border: 2px dashed #2196F3;
            background: rgba(33, 150, 243, 0.05);
            border-radius: 4px;
        }

        .group-count {
            position: absolute;
            top: -24px;
            left: 0;
            background: #2196F3;
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
        }
    `;
    document.head.appendChild(styles);

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export
    window.ElementGrouping = {
        addToSelection,
        removeFromSelection,
        toggleSelection,
        selectSingle,
        deselectAll,
        selectAllOnPage,
        getSelected,
        getSelectionCount,
        groupSelected,
        ungroupSelected,
        deleteSelected,
        moveSelected
    };

    console.log('Element Grouping loaded: Ctrl+G to group, Ctrl+Shift+G to ungroup');

})();
