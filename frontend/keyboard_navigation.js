/**
 * ═══════════════════════════════════════════════════════════════════════
 * KEYBOARD ARROW NAVIGATION FOR PHOTOS AND CONTENT BLOCKS
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Allows users to:
 * - Click to select a photo or content block
 * - Use arrow keys (↑/↓) to move items up/down within pages
 * - Visual feedback for selected items
 * - Improved UX alternative to drag-and-drop
 */

console.log('⌨️ Keyboard Navigation loaded');

// State for selected item
window.keyboardNavState = {
    selectedItem: null,  // { type: 'photo'|'contentBlock', pageId, itemIndex }
    enabled: true
};

/**
 * Initialize keyboard navigation for page builder
 */
function initKeyboardNavigation() {
    console.log('⌨️ Initializing keyboard navigation...');

    // Remove existing listener if present
    document.removeEventListener('keydown', handleKeyboardNav);

    // Add global keyboard listener
    document.addEventListener('keydown', handleKeyboardNav);

    // Mark all photos and content blocks as selectable
    makeItemsSelectable();

    console.log('✅ Keyboard navigation initialized');
}

/**
 * Make photos and content blocks selectable
 */
function makeItemsSelectable() {
    if (!window.brochurePages) return;

    // Re-render to add click handlers
    if (typeof window.renderBrochurePages === 'function') {
        window.renderBrochurePages();
    }
}

/**
 * Handle keyboard navigation
 */
function handleKeyboardNav(event) {
    if (!window.keyboardNavState.enabled) return;
    if (!window.keyboardNavState.selectedItem) return;

    const { type, pageId, itemIndex } = window.keyboardNavState.selectedItem;

    // Only handle arrow up/down
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;

    event.preventDefault();
    event.stopPropagation();

    const direction = event.key === 'ArrowUp' ? -1 : 1;

    console.log(`⌨️ Moving ${type} ${direction > 0 ? 'down' : 'up'}`);

    if (type === 'photo') {
        movePhotoInPage(pageId, itemIndex, direction);
    } else if (type === 'contentBlock') {
        moveContentBlock(pageId, itemIndex, direction);
    }
}

/**
 * Move photo up/down within a page
 */
function movePhotoInPage(pageId, blockIndex, direction) {
    const page = window.brochurePages.find(p => p.id === pageId);

    // Support both old structure (photos array) and new structure (contentBlocks array)
    const contentBlocks = page.contentBlocks || [];
    if (contentBlocks.length < 2) {
        console.log('⚠️ Cannot move photo - not enough items on page');
        return;
    }

    const newIndex = blockIndex + direction;

    // Check bounds
    if (newIndex < 0 || newIndex >= contentBlocks.length) {
        console.log('⚠️ Cannot move photo - at boundary');
        showToast('info', `📸 Photo is already at the ${direction < 0 ? 'top' : 'bottom'} of this page`);
        return;
    }

    // Swap content blocks
    const temp = contentBlocks[blockIndex];
    contentBlocks[blockIndex] = contentBlocks[newIndex];
    contentBlocks[newIndex] = temp;

    console.log(`✅ Moved photo from position ${blockIndex} to ${newIndex}`);

    // Update selected item index
    window.keyboardNavState.selectedItem.itemIndex = newIndex;

    // Re-render
    if (typeof window.renderBrochurePages === 'function') {
        window.renderBrochurePages();
    }

    // Re-select the moved item
    setTimeout(() => {
        highlightSelectedItem();
    }, 50);

    showToast('success', `📸 Photo moved ${direction < 0 ? 'up' : 'down'}`);
}

/**
 * Move content block up/down within a page
 */
function moveContentBlock(pageId, blockIndex, direction) {
    const page = window.brochurePages.find(p => p.id === pageId);

    // Support both old structure (content array) and new structure (contentBlocks array)
    const contentBlocks = page.contentBlocks || page.content || [];
    if (contentBlocks.length < 2) {
        console.log('⚠️ Cannot move content block - not enough blocks on page');
        return;
    }

    const newIndex = blockIndex + direction;

    // Check bounds
    if (newIndex < 0 || newIndex >= contentBlocks.length) {
        console.log('⚠️ Cannot move content block - at boundary');
        showToast('info', `📝 Content block is already at the ${direction < 0 ? 'top' : 'bottom'} of this page`);
        return;
    }

    // Swap content blocks
    const temp = contentBlocks[blockIndex];
    contentBlocks[blockIndex] = contentBlocks[newIndex];
    contentBlocks[newIndex] = temp;

    console.log(`✅ Moved content block from position ${blockIndex} to ${newIndex}`);

    // Update selected item index
    window.keyboardNavState.selectedItem.itemIndex = newIndex;

    // Re-render
    if (typeof window.renderBrochurePages === 'function') {
        window.renderBrochurePages();
    }

    // Re-select the moved item
    setTimeout(() => {
        highlightSelectedItem();
    }, 50);

    showToast('success', `📝 Content block moved ${direction < 0 ? 'up' : 'down'}`);
}

/**
 * Select a photo for keyboard navigation
 */
function selectPhoto(pageId, photoIndex) {
    console.log(`📸 Selected photo ${photoIndex} on page ${pageId}`);

    window.keyboardNavState.selectedItem = {
        type: 'photo',
        pageId: pageId,
        itemIndex: photoIndex
    };

    highlightSelectedItem();
}

/**
 * Select a content block for keyboard navigation
 */
function selectContentBlock(pageId, blockIndex) {
    console.log(`📝 Selected content block ${blockIndex} on page ${pageId}`);

    window.keyboardNavState.selectedItem = {
        type: 'contentBlock',
        pageId: pageId,
        itemIndex: blockIndex
    };

    highlightSelectedItem();
}

/**
 * Highlight the currently selected item
 */
function highlightSelectedItem() {
    // Remove all existing highlights
    document.querySelectorAll('.keyboard-nav-selected').forEach(el => {
        el.classList.remove('keyboard-nav-selected');
    });

    if (!window.keyboardNavState.selectedItem) return;

    const { type, pageId, itemIndex } = window.keyboardNavState.selectedItem;

    // Find and highlight the selected item
    const selector = type === 'photo'
        ? `[data-keyboard-nav="photo"][data-page-id="${pageId}"][data-item-index="${itemIndex}"]`
        : `[data-keyboard-nav="contentBlock"][data-page-id="${pageId}"][data-item-index="${itemIndex}"]`;

    const element = document.querySelector(selector);
    if (element) {
        element.classList.add('keyboard-nav-selected');
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/**
 * Deselect current item
 */
function deselectItem() {
    window.keyboardNavState.selectedItem = null;

    document.querySelectorAll('.keyboard-nav-selected').forEach(el => {
        el.classList.remove('keyboard-nav-selected');
    });
}

/**
 * Add CSS for keyboard navigation highlighting
 */
function addKeyboardNavStyles() {
    const styleId = 'keyboardNavStyles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        .keyboard-nav-selectable {
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
        }

        .keyboard-nav-selectable:hover {
            transform: scale(1.02);
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .keyboard-nav-selected {
            outline: 3px solid #667eea !important;
            outline-offset: 2px;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.5) !important;
            z-index: 10;
        }

        .keyboard-nav-hint {
            position: absolute;
            top: 4px;
            right: 4px;
            background: rgba(102, 126, 234, 0.9);
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: 600;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
        }

        .keyboard-nav-selectable:hover .keyboard-nav-hint,
        .keyboard-nav-selected .keyboard-nav-hint {
            opacity: 1;
        }

        .keyboard-nav-instructions {
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 0.85rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
            pointer-events: none;
        }

        .keyboard-nav-instructions.show {
            opacity: 1;
            transform: translateY(0);
        }

        .keyboard-nav-instructions strong {
            display: block;
            margin-bottom: 4px;
            font-size: 0.9rem;
        }
    `;

    document.head.appendChild(style);
}

/**
 * Show keyboard navigation instructions
 */
function showKeyboardInstructions() {
    let instructionsEl = document.getElementById('keyboardNavInstructions');

    if (!instructionsEl) {
        instructionsEl = document.createElement('div');
        instructionsEl.id = 'keyboardNavInstructions';
        instructionsEl.className = 'keyboard-nav-instructions';
        instructionsEl.innerHTML = `
            <strong>⌨️ Keyboard Navigation Active</strong>
            <div>↑/↓ arrows to move item</div>
            <div>Click elsewhere to deselect</div>
        `;
        document.body.appendChild(instructionsEl);
    }

    instructionsEl.classList.add('show');

    // Auto-hide after 5 seconds
    setTimeout(() => {
        instructionsEl.classList.remove('show');
    }, 5000);
}

/**
 * Hide keyboard navigation instructions
 */
function hideKeyboardInstructions() {
    const instructionsEl = document.getElementById('keyboardNavInstructions');
    if (instructionsEl) {
        instructionsEl.classList.remove('show');
    }
}

// Initialize styles on load
addKeyboardNavStyles();

// Export functions to window
window.initKeyboardNavigation = initKeyboardNavigation;
window.selectPhoto = selectPhoto;
window.selectContentBlock = selectContentBlock;
window.deselectItem = deselectItem;
window.showKeyboardInstructions = showKeyboardInstructions;
window.hideKeyboardInstructions = hideKeyboardInstructions;

console.log('✅ Keyboard Navigation ready');
