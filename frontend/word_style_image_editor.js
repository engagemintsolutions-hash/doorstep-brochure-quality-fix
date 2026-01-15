/**
 * ═══════════════════════════════════════════════════════════════════════
 * WORD-STYLE IMAGE EDITOR
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Provides Microsoft Word-like image manipulation:
 * - Free drag and position anywhere on the page
 * - Resize with corner/edge handles
 * - Visual selection feedback
 * - Maintain aspect ratio
 */

console.log('📝 Word-Style Image Editor loaded');

// State for active image manipulation
window.wordStyleImageState = {
    selectedImage: null,  // Currently selected image element
    isDragging: false,
    isResizing: false,
    resizeHandle: null,  // which handle is being dragged
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startLeft: 0,
    startTop: 0
};

/**
 * Initialize Word-style image editing for a page
 */
function initWordStyleImageEditor() {
    console.log('📝 Initializing Word-style image editor...');

    // Add global click listener to deselect when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.word-style-image-wrapper')) {
            deselectImage();
        }
    });

    // Add styles
    addWordStyleImageStyles();

    console.log('✅ Word-style image editor initialized');
}

/**
 * Make an image editable with Word-style controls
 */
function makeImageWordStyle(imgElement, pageElement) {
    if (!imgElement || !pageElement) return;

    // Wrap image in a positionable container
    const wrapper = document.createElement('div');
    wrapper.className = 'word-style-image-wrapper';
    wrapper.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        cursor: move;
        user-select: none;
    `;

    // Store original image size
    const originalWidth = imgElement.naturalWidth || imgElement.width || 300;
    const originalHeight = imgElement.naturalHeight || imgElement.height || 200;

    wrapper.style.width = originalWidth + 'px';
    wrapper.style.height = originalHeight + 'px';

    // Move image into wrapper
    imgElement.parentNode.insertBefore(wrapper, imgElement);
    wrapper.appendChild(imgElement);

    imgElement.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: contain;
        pointer-events: none;
    `;

    // Add resize handles
    addResizeHandles(wrapper);

    // Add click handler for selection
    wrapper.addEventListener('click', (e) => {
        e.stopPropagation();
        selectImage(wrapper);
    });

    // Add drag handlers
    wrapper.addEventListener('mousedown', (e) => {
        if (e.target === wrapper || e.target === imgElement) {
            startDragging(e, wrapper);
        }
    });

    return wrapper;
}

/**
 * Add resize handles to image wrapper
 */
function addResizeHandles(wrapper) {
    const handles = [
        'nw', 'n', 'ne',
        'w',       'e',
        'sw', 's', 'se'
    ];

    handles.forEach(position => {
        const handle = document.createElement('div');
        handle.className = `word-style-resize-handle handle-${position}`;
        handle.dataset.position = position;

        handle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            startResizing(e, wrapper, position);
        });

        wrapper.appendChild(handle);
    });
}

/**
 * Select an image for editing
 */
function selectImage(wrapper) {
    // Deselect previous
    if (window.wordStyleImageState.selectedImage) {
        window.wordStyleImageState.selectedImage.classList.remove('word-style-selected');
    }

    // Select new
    window.wordStyleImageState.selectedImage = wrapper;
    wrapper.classList.add('word-style-selected');

    console.log('📝 Image selected');
}

/**
 * Deselect current image
 */
function deselectImage() {
    if (window.wordStyleImageState.selectedImage) {
        window.wordStyleImageState.selectedImage.classList.remove('word-style-selected');
        window.wordStyleImageState.selectedImage = null;
        console.log('📝 Image deselected');
    }
}

/**
 * Start dragging an image
 */
function startDragging(e, wrapper) {
    e.preventDefault();
    e.stopPropagation();

    selectImage(wrapper);

    const state = window.wordStyleImageState;
    state.isDragging = true;
    state.startX = e.clientX;
    state.startY = e.clientY;

    // Get current position
    const rect = wrapper.getBoundingClientRect();
    const parentRect = wrapper.parentElement.getBoundingClientRect();
    state.startLeft = rect.left - parentRect.left;
    state.startTop = rect.top - parentRect.top;

    wrapper.style.cursor = 'grabbing';

    // Add global mouse move and up listeners
    const onMouseMove = (e) => handleDragging(e, wrapper);
    const onMouseUp = () => stopDragging(wrapper, onMouseMove, onMouseUp);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    console.log('📝 Started dragging image');
}

/**
 * Handle dragging movement
 */
function handleDragging(e, wrapper) {
    if (!window.wordStyleImageState.isDragging) return;

    const state = window.wordStyleImageState;
    const deltaX = e.clientX - state.startX;
    const deltaY = e.clientY - state.startY;

    const newLeft = state.startLeft + deltaX;
    const newTop = state.startTop + deltaY;

    wrapper.style.left = newLeft + 'px';
    wrapper.style.top = newTop + 'px';
    wrapper.style.transform = 'none';
}

/**
 * Stop dragging
 */
function stopDragging(wrapper, moveHandler, upHandler) {
    window.wordStyleImageState.isDragging = false;
    wrapper.style.cursor = 'move';

    document.removeEventListener('mousemove', moveHandler);
    document.removeEventListener('mouseup', upHandler);

    console.log('📝 Stopped dragging image');
}

/**
 * Start resizing an image
 */
function startResizing(e, wrapper, position) {
    e.preventDefault();
    e.stopPropagation();

    selectImage(wrapper);

    const state = window.wordStyleImageState;
    state.isResizing = true;
    state.resizeHandle = position;
    state.startX = e.clientX;
    state.startY = e.clientY;
    state.startWidth = wrapper.offsetWidth;
    state.startHeight = wrapper.offsetHeight;

    // Get current position
    const rect = wrapper.getBoundingClientRect();
    const parentRect = wrapper.parentElement.getBoundingClientRect();
    state.startLeft = rect.left - parentRect.left;
    state.startTop = rect.top - parentRect.top;

    // Add global mouse move and up listeners
    const onMouseMove = (e) => handleResizing(e, wrapper);
    const onMouseUp = () => stopResizing(onMouseMove, onMouseUp);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    console.log('📝 Started resizing image:', position);
}

/**
 * Handle resizing movement
 */
function handleResizing(e, wrapper) {
    if (!window.wordStyleImageState.isResizing) return;

    const state = window.wordStyleImageState;
    const deltaX = e.clientX - state.startX;
    const deltaY = e.clientY - state.startY;

    const position = state.resizeHandle;
    const aspectRatio = state.startWidth / state.startHeight;

    let newWidth = state.startWidth;
    let newHeight = state.startHeight;
    let newLeft = state.startLeft;
    let newTop = state.startTop;

    // Calculate new dimensions based on handle position
    // Maintain aspect ratio for corner handles
    if (position.includes('e')) {
        newWidth = state.startWidth + deltaX;
    }
    if (position.includes('w')) {
        newWidth = state.startWidth - deltaX;
        newLeft = state.startLeft + deltaX;
    }
    if (position.includes('s')) {
        newHeight = state.startHeight + deltaY;
    }
    if (position.includes('n')) {
        newHeight = state.startHeight - deltaY;
        newTop = state.startTop + deltaY;
    }

    // Maintain aspect ratio for corner handles
    if (position.length === 2) {  // Corner handle
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            newHeight = newWidth / aspectRatio;
            if (position.includes('n')) {
                newTop = state.startTop + (state.startHeight - newHeight);
            }
        } else {
            newWidth = newHeight * aspectRatio;
            if (position.includes('w')) {
                newLeft = state.startLeft + (state.startWidth - newWidth);
            }
        }
    }

    // Apply minimum size
    const minSize = 50;
    if (newWidth < minSize) newWidth = minSize;
    if (newHeight < minSize) newHeight = minSize;

    // Update wrapper size and position
    wrapper.style.width = newWidth + 'px';
    wrapper.style.height = newHeight + 'px';
    wrapper.style.left = newLeft + 'px';
    wrapper.style.top = newTop + 'px';
    wrapper.style.transform = 'none';
}

/**
 * Stop resizing
 */
function stopResizing(moveHandler, upHandler) {
    window.wordStyleImageState.isResizing = false;
    window.wordStyleImageState.resizeHandle = null;

    document.removeEventListener('mousemove', moveHandler);
    document.removeEventListener('mouseup', upHandler);

    console.log('📝 Stopped resizing image');
}

/**
 * Add CSS styles for Word-style image editing
 */
function addWordStyleImageStyles() {
    const styleId = 'wordStyleImageStyles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        .word-style-image-wrapper {
            position: absolute;
            box-sizing: border-box;
            transition: none;
        }

        .word-style-image-wrapper.word-style-selected {
            outline: 2px solid #667eea;
            outline-offset: -2px;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .word-style-resize-handle {
            position: absolute;
            width: 8px;
            height: 8px;
            background: white;
            border: 2px solid #667eea;
            border-radius: 50%;
            opacity: 0;
            transition: opacity 0.2s;
            z-index: 10;
        }

        .word-style-selected .word-style-resize-handle {
            opacity: 1;
        }

        /* Corner handles */
        .handle-nw { top: -4px; left: -4px; cursor: nw-resize; }
        .handle-ne { top: -4px; right: -4px; cursor: ne-resize; }
        .handle-sw { bottom: -4px; left: -4px; cursor: sw-resize; }
        .handle-se { bottom: -4px; right: -4px; cursor: se-resize; }

        /* Edge handles */
        .handle-n { top: -4px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
        .handle-s { bottom: -4px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
        .handle-w { top: 50%; left: -4px; transform: translateY(-50%); cursor: w-resize; }
        .handle-e { top: 50%; right: -4px; transform: translateY(-50%); cursor: e-resize; }

        .word-style-resize-handle:hover {
            background: #667eea;
            transform: scale(1.3);
        }

        /* Update page preview to allow absolute positioning */
        .brochure-page-preview {
            position: relative !important;
            overflow: visible !important;
        }
    `;

    document.head.appendChild(style);
}

// Export functions
window.initWordStyleImageEditor = initWordStyleImageEditor;
window.makeImageWordStyle = makeImageWordStyle;
window.selectImage = selectImage;
window.deselectImage = deselectImage;

console.log('✅ Word-Style Image Editor ready');
