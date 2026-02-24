/**
 * UX ENHANCEMENTS MODULE
 *
 * Comprehensive UX improvements including:
 * 1. Progressive Loading with Skeleton Screens
 * 2. Contextual Help Tooltips
 * 3. Optimistic UI Updates
 * 4. Drag-and-Drop File Upload Anywhere
 * 5. Preview Mode with Client Simulation
 */

console.log('🎨 UX Enhancements loaded');

// ============================================
// 1. PROGRESSIVE LOADING WITH SKELETON SCREENS
// ============================================

/**
 * Shows skeleton screen while content loads
 */
function showSkeletonScreen(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const skeleton = document.createElement('div');
    skeleton.className = 'skeleton-container';
    skeleton.innerHTML = `
        <div class="skeleton-header"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-grid">
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
        </div>
    `;

    container.appendChild(skeleton);
}

/**
 * Removes skeleton screen and shows actual content
 */
function hideSkeletonScreen(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const skeleton = container.querySelector('.skeleton-container');
    if (skeleton) {
        skeleton.style.opacity = '0';
        setTimeout(() => skeleton.remove(), 300);
    }
}

/**
 * Progressive image loading with placeholder
 */
function loadImageProgressively(imgElement, src) {
    // Show low-quality placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'image-placeholder';
    imgElement.parentElement.insertBefore(placeholder, imgElement);
    imgElement.style.opacity = '0';

    // Load actual image
    const img = new Image();
    img.onload = () => {
        imgElement.src = src;
        imgElement.style.opacity = '1';
        placeholder.remove();
    };
    img.src = src;
}

// ============================================
// 2. CONTEXTUAL HELP TOOLTIPS
// ============================================

const tooltips = {
    propertyType: 'Select the type of property. This helps generate more accurate descriptions.',
    bedrooms: 'Number of bedrooms. This is a key search criteria for buyers.',
    askingPrice: 'The listing price. Enter amount in GBP without currency symbols.',
    epcRating: 'Energy Performance Certificate rating (A-G). Required for most UK properties.',
    photos: 'Upload high-quality photos. We recommend 10-20 images covering all key areas.',
    pageCount: 'More pages allow better photo spacing. We recommend 1 page per 2-3 photos.',
    wordCount: 'Total words across all pages. 1200-1500 works well for most properties.',
    smartDefaults: 'Automatically creates optimized pages based on your photos and preferences.',
    bulkSelection: 'Select multiple photos at once for faster management.',
    photoAnalysis: 'AI analyzes lighting, composition, and quality to recommend best photos.'
};

/**
 * Adds tooltip to an element
 */
function addTooltip(elementId, text, position = 'top') {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Create tooltip icon
    const icon = document.createElement('span');
    icon.className = 'tooltip-icon';
    icon.innerHTML = '?';
    icon.title = text;

    // Create tooltip content
    const tooltip = document.createElement('div');
    tooltip.className = `tooltip tooltip-${position}`;
    tooltip.textContent = text;

    // Position tooltip
    icon.style.position = 'relative';
    icon.appendChild(tooltip);

    // Show/hide on hover
    icon.addEventListener('mouseenter', () => {
        tooltip.style.display = 'block';
        setTimeout(() => tooltip.style.opacity = '1', 10);
    });

    icon.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        setTimeout(() => tooltip.style.display = 'none', 200);
    });

    // Insert after label or element
    const label = element.closest('label') || element.parentElement;
    if (label) {
        label.style.position = 'relative';
        label.appendChild(icon);
    }
}

/**
 * Initialize all tooltips
 */
function initializeTooltips() {
    Object.entries(tooltips).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element) {
            addTooltip(id, text);
        }
    });

    console.log('✅ Initialized tooltips');
}

// ============================================
// 3. OPTIMISTIC UI UPDATES
// ============================================

/**
 * Optimistically updates UI before server response
 */
async function optimisticUpdate(action, rollbackFn) {
    try {
        // Perform optimistic update immediately
        const result = await action();
        return result;
    } catch (error) {
        // Rollback on error
        console.error('Optimistic update failed, rolling back:', error);
        if (typeof rollbackFn === 'function') {
            rollbackFn();
        }
        throw error;
    }
}

/**
 * Optimistic photo upload
 */
function optimisticPhotoUpload(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            // Immediately show preview
            const photoId = Date.now() + '_' + Math.random();
            const photoData = {
                id: photoId,
                name: file.name,
                dataUrl: e.target.result,
                size: file.size,
                optimistic: true
            };

            // Add to uploaded photos
            if (!window.uploadedPhotos) window.uploadedPhotos = [];
            window.uploadedPhotos.push(photoData);

            // Show in UI immediately
            if (typeof renderPhotoPreview === 'function') {
                renderPhotoPreview(photoData);
            }

            resolve(photoData);
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Optimistic page creation
 */
function optimisticPageAdd(pageName) {
    const newPageId = Math.max(...(window.brochurePages || []).map(p => p.id), 0) + 1;

    const newPage = {
        id: newPageId,
        name: pageName || `Page ${newPageId}`,
        contentBlocks: [],
        locked: false,
        theme: 'general',
        optimistic: true
    };

    // Add immediately
    if (!window.brochurePages) window.brochurePages = [];
    window.brochurePages.push(newPage);

    // Re-render
    if (typeof renderBrochurePages === 'function') {
        renderBrochurePages();
    }

    return newPage;
}

// ============================================
// 4. DRAG-AND-DROP FILE UPLOAD ANYWHERE
// ============================================

/**
 * Enables drag-and-drop file upload on the entire page
 */
function enableGlobalDragDrop() {
    const dropZone = document.body;

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight drop zone on drag
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        // Don't show overlay if Page Builder modal is open
        const pageBuilderModal = document.getElementById('pageBuilderModal');
        if (pageBuilderModal && pageBuilderModal.style.display !== 'none') {
            return; // Page Builder has its own drag-drop functionality
        }

        if (!document.querySelector('.drop-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'drop-overlay';
            overlay.innerHTML = `
                <div class="drop-content">
                    <div class="drop-icon">📤</div>
                    <div class="drop-text">Drop photos here to upload</div>
                    <div class="drop-subtext">JPG, PNG, WEBP supported</div>
                </div>
            `;
            document.body.appendChild(overlay);
        }
    }

    function unhighlight() {
        const overlay = document.querySelector('.drop-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Handle drop
    dropZone.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        handleFiles(files);
    }

    function handleFiles(files) {
        const imageFiles = Array.from(files).filter(file =>
            file.type.startsWith('image/')
        );

        if (imageFiles.length === 0) {
            if (typeof showToast === 'function') {
                showToast('warning', 'Please drop image files only');
            }
            return;
        }

        // Upload files
        imageFiles.forEach(file => {
            optimisticPhotoUpload(file).then(photoData => {
                // Process actual upload in background
                uploadPhotoToServer(file, photoData.id);
            }).catch(error => {
                console.error('Photo upload failed:', error);
            });
        });

        if (typeof showToast === 'function') {
            showToast('success', `Uploading ${imageFiles.length} photo${imageFiles.length !== 1 ? 's' : ''}...`);
        }
    }

    async function uploadPhotoToServer(file, photoId) {
        // This would normally upload to server
        // For now, just mark as uploaded
        const photo = window.uploadedPhotos?.find(p => p.id === photoId);
        if (photo) {
            delete photo.optimistic;
        }
    }

    console.log('✅ Global drag-and-drop enabled');
}

// ============================================
// 5. PREVIEW MODE WITH CLIENT SIMULATION
// ============================================

/**
 * Opens preview mode with client perspective
 */
function openPreviewMode() {
    const modal = document.createElement('div');
    modal.id = 'previewModeModal';
    modal.className = 'preview-mode-modal';
    modal.innerHTML = `
        <div class="preview-mode-overlay" onclick="closePreviewMode()"></div>
        <div class="preview-mode-content">
            <div class="preview-mode-header">
                <h2>📱 Client Preview</h2>
                <div class="preview-device-selector">
                    <button onclick="setPreviewDevice('mobile')" class="device-btn active" data-device="mobile">📱 Mobile</button>
                    <button onclick="setPreviewDevice('tablet')" class="device-btn" data-device="tablet">📱 Tablet</button>
                    <button onclick="setPreviewDevice('desktop')" class="device-btn" data-device="desktop">💻 Desktop</button>
                </div>
                <button class="preview-close" onclick="closePreviewMode()">✕</button>
            </div>
            <div class="preview-mode-body">
                <div class="preview-device mobile" id="previewDevice">
                    <div class="preview-screen" id="previewScreen">
                        <iframe id="previewFrame" style="width: 100%; height: 100%; border: none;"></iframe>
                    </div>
                </div>
            </div>
            <div class="preview-mode-footer">
                <div class="preview-info">
                    <span id="previewDimensions">375 × 812</span>
                    <span style="margin: 0 1rem; color: #ccc;">|</span>
                    <span>Client View Simulation</span>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Load preview content
    loadPreviewContent();

    console.log('✅ Preview mode opened');
}

/**
 * Changes preview device
 */
function setPreviewDevice(device) {
    const previewDevice = document.getElementById('previewDevice');
    const dimensions = document.getElementById('previewDimensions');

    // Remove all device classes
    previewDevice.className = 'preview-device';
    previewDevice.classList.add(device);

    // Update active button
    document.querySelectorAll('.device-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.device === device) {
            btn.classList.add('active');
        }
    });

    // Update dimensions display
    const sizes = {
        mobile: '375 × 812',
        tablet: '768 × 1024',
        desktop: '1920 × 1080'
    };

    dimensions.textContent = sizes[device];
}

/**
 * Loads preview content into iframe
 */
function loadPreviewContent() {
    const iframe = document.getElementById('previewFrame');
    if (!iframe) return;

    // Get brochure data
    const pages = window.brochureData?.pages || window.brochurePages || [];

    // Generate preview HTML
    const html = generatePreviewHTML(pages);

    // Load into iframe
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframe.src = url;
}

/**
 * Generates preview HTML
 */
function generatePreviewHTML(pages) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Property Brochure Preview</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: #f5f5f5;
            padding: 1rem;
        }
        .page {
            background: white;
            margin-bottom: 1rem;
            border-radius: 8px;
            padding: 2rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .page-title {
            font-size: 1.8rem;
            color: #2c3e50;
            margin-bottom: 1rem;
            border-bottom: 2px solid #4A1420;
            padding-bottom: 0.5rem;
        }
        .content-block {
            margin-bottom: 1.5rem;
        }
        .block-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 0.5rem;
        }
        .block-content {
            color: #4a5568;
            line-height: 1.6;
        }
        @media (max-width: 768px) {
            body { padding: 0.5rem; }
            .page { padding: 1rem; }
            .page-title { font-size: 1.4rem; }
        }
    </style>
</head>
<body>
    ${pages.map((page, index) => `
        <div class="page">
            <h1 class="page-title">${page.name || `Page ${index + 1}`}</h1>
            ${(page.contentBlocks || []).filter(b => b.type !== 'photo').map(block => `
                <div class="content-block">
                    <div class="block-title">${block.title || block.type}</div>
                    <div class="block-content">${(block.content || '').replace(/\n/g, '<br>')}</div>
                </div>
            `).join('')}
        </div>
    `).join('')}
</body>
</html>
    `;
}

/**
 * Closes preview mode
 */
function closePreviewMode() {
    const modal = document.getElementById('previewModeModal');
    if (modal) {
        modal.remove();
    }
}

// ============================================
// INITIALIZATION
// ============================================

function initializeUXEnhancements() {
    console.log('🎨 Initializing UX enhancements...');

    // 1. Add skeleton screens to key sections
    // (Applied dynamically when loading content)

    // 2. Initialize tooltips
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTooltips);
    } else {
        initializeTooltips();
    }

    // 3. Set up optimistic updates
    // (Used on-demand in upload/create functions)

    // 4. Enable global drag-and-drop
    enableGlobalDragDrop();

    // 5. Add preview mode button (if in brochure editor)
    if (window.location.pathname.includes('brochure_editor')) {
        addPreviewModeButton();
    }

    console.log('✅ UX enhancements initialized');
}

/**
 * Adds preview mode button to editor
 */
function addPreviewModeButton() {
    const nav = document.querySelector('.editor-nav');
    if (!nav) return;

    const button = document.createElement('button');
    button.className = 'btn-nav';
    button.innerHTML = '👁️ Preview';
    button.onclick = openPreviewMode;
    button.style.cssText = 'margin-left: 1rem; background: #6c757d; color: white;';

    nav.appendChild(button);
}

// ============================================
// GLOBAL EXPORTS
// ============================================

window.showSkeletonScreen = showSkeletonScreen;
window.hideSkeletonScreen = hideSkeletonScreen;
window.loadImageProgressively = loadImageProgressively;
window.addTooltip = addTooltip;
window.initializeTooltips = initializeTooltips;
window.optimisticUpdate = optimisticUpdate;
window.optimisticPhotoUpload = optimisticPhotoUpload;
window.optimisticPageAdd = optimisticPageAdd;
window.enableGlobalDragDrop = enableGlobalDragDrop;
window.openPreviewMode = openPreviewMode;
window.closePreviewMode = closePreviewMode;
window.setPreviewDevice = setPreviewDevice;

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUXEnhancements);
} else {
    setTimeout(initializeUXEnhancements, 100);
}

console.log('✅ UX Enhancements module ready');
