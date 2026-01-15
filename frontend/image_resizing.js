/**
 * Image Resizing System
 *
 * Features:
 * - Mouse-based resizing with 8 handles (4 corners + 4 edges)
 * - Dimensions tooltip during resize
 * - Aspect ratio preservation on corner drag
 * - Min/max size constraints
 * - Smooth visual feedback
 *
 * Author: Claude Code
 * Date: October 16, 2025
 */

// ============================================
// GLOBAL STATE
// ============================================

window.imageResizingSystem = {
    // Currently active resize operation
    activeResize: null,

    // Configuration
    config: {
        minWidth: 100,
        minHeight: 100,
        maxWidth: 1200,
        maxHeight: 1200,
        handleSize: 12,
        preserveAspectRatio: true
    }
};

// ============================================
// CORE FUNCTIONS
// ============================================

/**
 * Initialize image resizing on all brochure images
 */
function initializeImageResizing() {
    console.log('🖼️ Initializing image resizing system...');

    // Find all images in brochure pages - use more specific selectors
    const images = document.querySelectorAll('.photo-zone img, .brochure-page img, #brochurePages img');

    console.log(`📸 Found ${images.length} images to initialize`);

    let initializedCount = 0;

    images.forEach((img, index) => {
        // Skip if no src or is a placeholder
        if (!img.src || img.src.includes('placeholder')) {
            console.log(`⏭️ Skipping placeholder/empty image ${index}`);
            return;
        }

        // Create unique ID if not exists
        if (!img.dataset.imageId) {
            img.dataset.imageId = `image-${Date.now()}-${index}`;
        }

        // Skip if already initialized
        if (img.parentElement.classList.contains('resizable-image-wrapper')) {
            console.log(`⏭️ Image ${index} already has resize wrapper`);
            return;
        }

        // Wrap image in resizable container
        try {
            wrapImageWithResizeHandles(img);
            initializedCount++;
            console.log(`✅ Initialized resize handles for image ${index} (${img.dataset.imageId})`);
        } catch (err) {
            console.error(`❌ Failed to initialize image ${index}:`, err);
        }
    });

    console.log(`✅ Initialized resizing for ${initializedCount}/${images.length} images`);
}

/**
 * Wrap an image with resize handles
 */
function wrapImageWithResizeHandles(img) {
    const imageId = img.dataset.imageId;

    // Check if image has dimensions
    const imgWidth = img.offsetWidth || img.naturalWidth || 300;
    const imgHeight = img.offsetHeight || img.naturalHeight || 200;

    if (imgWidth === 0 || imgHeight === 0) {
        console.warn(`⚠️ Image ${imageId} has no dimensions, skipping resize initialization`);
        return;
    }

    console.log(`📐 Image dimensions: ${imgWidth}×${imgHeight}px`);

    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'resizable-image-wrapper';
    wrapper.dataset.imageId = imageId;
    wrapper.style.cssText = `
        position: relative;
        display: inline-block;
    `;

    // Store original dimensions
    img.dataset.originalWidth = imgWidth;
    img.dataset.originalHeight = imgHeight;

    // Wrap image
    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    // Set image to actual dimensions (not percentage-based)
    img.style.cssText = `
        width: ${imgWidth}px;
        height: ${imgHeight}px;
        display: block;
        user-select: none;
        pointer-events: none;
    `;

    // Create 8 resize handles
    const handles = [
        { name: 'nw', cursor: 'nw-resize', position: { top: '-6px', left: '-6px' } },
        { name: 'n',  cursor: 'n-resize',  position: { top: '-6px', left: '50%', transform: 'translateX(-50%)' } },
        { name: 'ne', cursor: 'ne-resize', position: { top: '-6px', right: '-6px' } },
        { name: 'e',  cursor: 'e-resize',  position: { top: '50%', right: '-6px', transform: 'translateY(-50%)' } },
        { name: 'se', cursor: 'se-resize', position: { bottom: '-6px', right: '-6px' } },
        { name: 's',  cursor: 's-resize',  position: { bottom: '-6px', left: '50%', transform: 'translateX(-50%)' } },
        { name: 'sw', cursor: 'sw-resize', position: { bottom: '-6px', left: '-6px' } },
        { name: 'w',  cursor: 'w-resize',  position: { top: '50%', left: '-6px', transform: 'translateY(-50%)' } }
    ];

    handles.forEach(handle => {
        const handleEl = document.createElement('div');
        handleEl.className = `resize-handle resize-handle-${handle.name}`;
        handleEl.dataset.handle = handle.name;

        // Build style string
        let styleString = `
            position: absolute;
            width: ${window.imageResizingSystem.config.handleSize}px;
            height: ${window.imageResizingSystem.config.handleSize}px;
            background: #00CED1;
            border: 2px solid white;
            border-radius: 50%;
            cursor: ${handle.cursor};
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.2s, transform 0.1s;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;

        // Add position styles
        Object.entries(handle.position).forEach(([key, value]) => {
            styleString += `${key}: ${value};`;
        });

        handleEl.style.cssText = styleString;

        // Add hover effect
        handleEl.onmouseover = () => {
            handleEl.style.transform = (handle.position.transform || '') + ' scale(1.2)';
            handleEl.style.background = '#20B2AA';
        };

        handleEl.onmouseout = () => {
            handleEl.style.transform = handle.position.transform || '';
            handleEl.style.background = '#00CED1';
        };

        // Add drag listener
        handleEl.onmousedown = (e) => startResize(e, imageId, handle.name);

        wrapper.appendChild(handleEl);
    });

    // Show handles on hover
    wrapper.onmouseenter = () => {
        const handles = wrapper.querySelectorAll('.resize-handle');
        handles.forEach(h => h.style.opacity = '1');
    };

    wrapper.onmouseleave = () => {
        if (!window.imageResizingSystem.activeResize) {
            const handles = wrapper.querySelectorAll('.resize-handle');
            handles.forEach(h => h.style.opacity = '0');
        }
    };
}

/**
 * Start resize operation
 */
function startResize(e, imageId, handleName) {
    e.preventDefault();
    e.stopPropagation();

    const wrapper = document.querySelector(`.resizable-image-wrapper[data-image-id="${imageId}"]`);
    const img = wrapper.querySelector('img');

    // Get current dimensions
    const rect = wrapper.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = rect.width;
    const startHeight = rect.height;

    // Calculate aspect ratio
    const aspectRatio = startWidth / startHeight;

    // Store resize state
    window.imageResizingSystem.activeResize = {
        imageId,
        handleName,
        startX,
        startY,
        startWidth,
        startHeight,
        aspectRatio,
        wrapper,
        img
    };

    // Create dimensions tooltip
    const tooltip = createDimensionsTooltip();
    updateDimensionsTooltip(tooltip, startWidth, startHeight, e.clientX, e.clientY);

    // Add document listeners
    document.addEventListener('mousemove', onResizeMove);
    document.addEventListener('mouseup', onResizeEnd);

    // Add visual feedback
    wrapper.style.outline = '2px dashed #00CED1';
    document.body.style.cursor = window.getComputedStyle(e.target).cursor;
    document.body.style.userSelect = 'none';
}

/**
 * Handle resize mouse move
 */
function onResizeMove(e) {
    const resize = window.imageResizingSystem.activeResize;
    if (!resize) return;

    const { startX, startY, startWidth, startHeight, handleName, aspectRatio, wrapper, img } = resize;
    const config = window.imageResizingSystem.config;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;

    // Calculate new dimensions based on handle
    switch (handleName) {
        case 'se': // Southeast corner
            newWidth = startWidth + deltaX;
            newHeight = config.preserveAspectRatio ? newWidth / aspectRatio : startHeight + deltaY;
            break;

        case 'sw': // Southwest corner
            newWidth = startWidth - deltaX;
            newHeight = config.preserveAspectRatio ? newWidth / aspectRatio : startHeight + deltaY;
            break;

        case 'ne': // Northeast corner
            newWidth = startWidth + deltaX;
            newHeight = config.preserveAspectRatio ? newWidth / aspectRatio : startHeight - deltaY;
            break;

        case 'nw': // Northwest corner
            newWidth = startWidth - deltaX;
            newHeight = config.preserveAspectRatio ? newWidth / aspectRatio : startHeight - deltaY;
            break;

        case 'e': // East edge
            newWidth = startWidth + deltaX;
            newHeight = config.preserveAspectRatio ? newWidth / aspectRatio : startHeight;
            break;

        case 'w': // West edge
            newWidth = startWidth - deltaX;
            newHeight = config.preserveAspectRatio ? newWidth / aspectRatio : startHeight;
            break;

        case 's': // South edge
            newHeight = startHeight + deltaY;
            newWidth = config.preserveAspectRatio ? newHeight * aspectRatio : startWidth;
            break;

        case 'n': // North edge
            newHeight = startHeight - deltaY;
            newWidth = config.preserveAspectRatio ? newHeight * aspectRatio : startWidth;
            break;
    }

    // Apply constraints
    newWidth = Math.max(config.minWidth, Math.min(config.maxWidth, newWidth));
    newHeight = Math.max(config.minHeight, Math.min(config.maxHeight, newHeight));

    // Apply new dimensions directly to the image (not wrapper)
    img.style.width = `${newWidth}px`;
    img.style.height = `${newHeight}px`;

    // Update tooltip
    const tooltip = document.querySelector('.resize-dimensions-tooltip');
    if (tooltip) {
        updateDimensionsTooltip(tooltip, newWidth, newHeight, e.clientX, e.clientY);
    }
}

/**
 * End resize operation
 */
function onResizeEnd(e) {
    const resize = window.imageResizingSystem.activeResize;
    if (!resize) return;

    // Remove document listeners
    document.removeEventListener('mousemove', onResizeMove);
    document.removeEventListener('mouseup', onResizeEnd);

    // Remove visual feedback
    resize.wrapper.style.outline = '';
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    // Remove tooltip
    const tooltip = document.querySelector('.resize-dimensions-tooltip');
    if (tooltip) {
        tooltip.remove();
    }

    // Save to undo stack
    saveToUndoStack();

    // Get final image dimensions
    const finalWidth = resize.img.offsetWidth;
    const finalHeight = resize.img.offsetHeight;

    // Clear active resize
    window.imageResizingSystem.activeResize = null;

    console.log(`✅ Resized image to ${finalWidth}×${finalHeight}px`);
}

// ============================================
// UI HELPER FUNCTIONS
// ============================================

/**
 * Create dimensions tooltip
 */
function createDimensionsTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'resize-dimensions-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        padding: 0.5rem 1rem;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 600;
        font-family: monospace;
        z-index: 10000;
        pointer-events: none;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        white-space: nowrap;
    `;
    document.body.appendChild(tooltip);
    return tooltip;
}

/**
 * Update dimensions tooltip
 */
function updateDimensionsTooltip(tooltip, width, height, mouseX, mouseY) {
    tooltip.textContent = `${Math.round(width)} × ${Math.round(height)} px`;
    tooltip.style.left = `${mouseX + 20}px`;
    tooltip.style.top = `${mouseY - 40}px`;
}

/**
 * Save to undo stack (use existing function if available)
 */
function saveToUndoStack() {
    if (typeof window.saveToUndoStack === 'function') {
        window.saveToUndoStack();
    } else if (typeof saveBrochureData === 'function') {
        saveBrochureData();
    }
}

// ============================================
// AUTO-INITIALIZATION
// ============================================

// Wait for brochure to load, then initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeImageResizing, 1000);
    });
} else {
    setTimeout(initializeImageResizing, 1000);
}

// Re-initialize when pages are re-rendered
const originalRenderBrochureForResize = window.renderBrochure;
if (originalRenderBrochureForResize && typeof originalRenderBrochureForResize === 'function') {
    window.renderBrochure = function(...args) {
        const result = originalRenderBrochureForResize.apply(this, args);
        setTimeout(initializeImageResizing, 500);
        return result;
    };
}

console.log('🖼️ Image Resizing System loaded');
