/**
 * BULK PHOTO OPERATIONS
 *
 * Enables selecting multiple photos and performing batch operations:
 * - Select multiple photos with checkboxes
 * - Select All / Select None / Invert Selection
 * - Bulk Add to Page
 * - Bulk Delete
 * - Bulk Distribute Across Pages
 *
 * Value: 10x faster photo management
 */

console.log('📦 Bulk Photo Operations loaded');

// ============================================
// GLOBAL STATE
// ============================================

window.bulkPhotoState = {
    selectedPhotoIds: new Set(),
    bulkMode: false,
    lastSelectedIndex: null
};

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initializes bulk photo operations when Page Builder modal opens
 */
function initBulkPhotoOperations() {
    console.log('🎯 Initializing Bulk Photo Operations');

    // Add bulk selection UI to Page Builder modal
    addBulkSelectionToolbar();

    // Add checkboxes to all photo thumbnails
    enhancePhotoThumbnailsWithCheckboxes();

    // Listen for photo list updates to re-add checkboxes
    observePhotoListChanges();

    console.log('✅ Bulk Photo Operations ready');
}

/**
 * Adds toolbar with bulk operation buttons to Page Builder modal
 */
function addBulkSelectionToolbar() {
    const availablePhotosSection = document.querySelector('#availablePhotosList')?.parentElement;
    if (!availablePhotosSection) {
        console.warn('⚠️ Available photos section not found');
        return;
    }

    // Check if toolbar already exists
    if (document.getElementById('bulkPhotoToolbar')) {
        return;
    }

    // Create toolbar
    const toolbar = document.createElement('div');
    toolbar.id = 'bulkPhotoToolbar';
    toolbar.className = 'bulk-photo-toolbar';
    toolbar.innerHTML = `
        <div class="bulk-toolbar-section">
            <span class="bulk-toolbar-label">
                <input type="checkbox" id="bulkModeToggle" onchange="toggleBulkMode(this.checked)">
                <label for="bulkModeToggle" style="margin-left: 0.5rem; font-weight: 600; cursor: pointer;">
                    Bulk Selection Mode
                </label>
            </span>
            <span id="bulkSelectedCount" class="bulk-selected-count" style="display: none;">
                0 selected
            </span>
        </div>

        <div id="bulkActionButtons" class="bulk-action-buttons" style="display: none;">
            <!-- Selection Controls -->
            <button class="bulk-btn bulk-btn-secondary" onclick="selectAllPhotos()" title="Select all visible photos">
                📋 Select All
            </button>
            <button class="bulk-btn bulk-btn-secondary" onclick="selectNonePhotos()" title="Clear selection">
                ✕ Select None
            </button>
            <button class="bulk-btn bulk-btn-secondary" onclick="invertPhotoSelection()" title="Invert selection">
                🔄 Invert
            </button>

            <!-- Bulk Operations -->
            <div class="bulk-toolbar-divider"></div>
            <button class="bulk-btn bulk-btn-primary" onclick="bulkAddToPage()" title="Add selected photos to a page" disabled id="bulkAddBtn">
                ➕ Add to Page
            </button>
            <button class="bulk-btn bulk-btn-primary" onclick="bulkDistribute()" title="Distribute selected photos across pages" disabled id="bulkDistributeBtn">
                📊 Distribute
            </button>
            <button class="bulk-btn bulk-btn-danger" onclick="bulkDelete()" title="Delete selected photos" disabled id="bulkDeleteBtn">
                🗑️ Delete
            </button>
        </div>
    `;

    // Insert toolbar before the photos list
    availablePhotosSection.insertBefore(toolbar, document.getElementById('availablePhotosList'));

    console.log('✅ Bulk selection toolbar added');
}

/**
 * Adds checkboxes to photo thumbnails in Page Builder
 */
function enhancePhotoThumbnailsWithCheckboxes() {
    const photoThumbs = document.querySelectorAll('.page-builder-photo-thumb');

    photoThumbs.forEach((thumb, index) => {
        // Skip if already has checkbox
        if (thumb.querySelector('.bulk-photo-checkbox')) {
            return;
        }

        const photoId = thumb.dataset.photoId;
        if (!photoId) return;

        // Create checkbox overlay
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'bulk-photo-checkbox';
        checkboxContainer.style.display = window.bulkPhotoState.bulkMode ? 'block' : 'none';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.photoId = photoId;
        checkbox.dataset.index = index;
        checkbox.checked = window.bulkPhotoState.selectedPhotoIds.has(photoId);
        checkbox.onchange = (e) => handlePhotoCheckboxChange(e, photoId, index);

        // Support Shift+Click for range selection
        checkbox.onclick = (e) => {
            if (e.shiftKey && window.bulkPhotoState.lastSelectedIndex !== null) {
                selectPhotoRange(window.bulkPhotoState.lastSelectedIndex, index);
                e.preventDefault();
            }
        };

        checkboxContainer.appendChild(checkbox);
        thumb.appendChild(checkboxContainer);

        // Update visual selection state
        updatePhotoThumbnailState(thumb, photoId);
    });

    console.log(`✅ Enhanced ${photoThumbs.length} photo thumbnails with checkboxes`);
}

/**
 * Observes changes to photo list and re-adds checkboxes
 */
function observePhotoListChanges() {
    const photosList = document.getElementById('availablePhotosList');
    if (!photosList) return;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Re-add checkboxes to new photos
                setTimeout(() => enhancePhotoThumbnailsWithCheckboxes(), 100);
            }
        });
    });

    observer.observe(photosList, { childList: true, subtree: true });
}

// ============================================
// BULK MODE TOGGLE
// ============================================

/**
 * Toggles bulk selection mode on/off
 */
function toggleBulkMode(enabled) {
    window.bulkPhotoState.bulkMode = enabled;

    // Show/hide checkboxes
    const checkboxes = document.querySelectorAll('.bulk-photo-checkbox');
    checkboxes.forEach(cb => {
        cb.style.display = enabled ? 'block' : 'none';
    });

    // Show/hide action buttons
    const actionButtons = document.getElementById('bulkActionButtons');
    const selectedCount = document.getElementById('bulkSelectedCount');

    if (enabled) {
        actionButtons.style.display = 'flex';
        selectedCount.style.display = 'inline-block';
        updateBulkActionButtons();
    } else {
        actionButtons.style.display = 'none';
        selectedCount.style.display = 'none';
        // Clear selection when disabling
        selectNonePhotos();
    }

    console.log(`🎯 Bulk mode: ${enabled ? 'ON' : 'OFF'}`);
}

// ============================================
// SELECTION MANAGEMENT
// ============================================

/**
 * Handles checkbox change event
 */
function handlePhotoCheckboxChange(event, photoId, index) {
    const checked = event.target.checked;

    if (checked) {
        window.bulkPhotoState.selectedPhotoIds.add(photoId);
        window.bulkPhotoState.lastSelectedIndex = index;
    } else {
        window.bulkPhotoState.selectedPhotoIds.delete(photoId);
    }

    updatePhotoThumbnailState(event.target.closest('.page-builder-photo-thumb'), photoId);
    updateBulkSelectionUI();
}

/**
 * Selects a range of photos (for Shift+Click)
 */
function selectPhotoRange(startIndex, endIndex) {
    const start = Math.min(startIndex, endIndex);
    const end = Math.max(startIndex, endIndex);

    const checkboxes = Array.from(document.querySelectorAll('.bulk-photo-checkbox input'));

    for (let i = start; i <= end && i < checkboxes.length; i++) {
        const checkbox = checkboxes[i];
        const photoId = checkbox.dataset.photoId;

        checkbox.checked = true;
        window.bulkPhotoState.selectedPhotoIds.add(photoId);
        updatePhotoThumbnailState(checkbox.closest('.page-builder-photo-thumb'), photoId);
    }

    updateBulkSelectionUI();
    console.log(`📌 Selected range: ${start} to ${end}`);
}

/**
 * Selects all visible photos
 */
function selectAllPhotos() {
    const checkboxes = document.querySelectorAll('.bulk-photo-checkbox input');

    checkboxes.forEach(checkbox => {
        const photoId = checkbox.dataset.photoId;
        checkbox.checked = true;
        window.bulkPhotoState.selectedPhotoIds.add(photoId);
        updatePhotoThumbnailState(checkbox.closest('.page-builder-photo-thumb'), photoId);
    });

    updateBulkSelectionUI();
    console.log(`✅ Selected all ${checkboxes.length} photos`);
}

/**
 * Deselects all photos
 */
function selectNonePhotos() {
    const checkboxes = document.querySelectorAll('.bulk-photo-checkbox input');

    checkboxes.forEach(checkbox => {
        const photoId = checkbox.dataset.photoId;
        checkbox.checked = false;
        window.bulkPhotoState.selectedPhotoIds.delete(photoId);
        updatePhotoThumbnailState(checkbox.closest('.page-builder-photo-thumb'), photoId);
    });

    window.bulkPhotoState.selectedPhotoIds.clear();
    window.bulkPhotoState.lastSelectedIndex = null;
    updateBulkSelectionUI();
    console.log('✅ Cleared all selections');
}

/**
 * Inverts current selection
 */
function invertPhotoSelection() {
    const checkboxes = document.querySelectorAll('.bulk-photo-checkbox input');

    checkboxes.forEach(checkbox => {
        const photoId = checkbox.dataset.photoId;
        checkbox.checked = !checkbox.checked;

        if (checkbox.checked) {
            window.bulkPhotoState.selectedPhotoIds.add(photoId);
        } else {
            window.bulkPhotoState.selectedPhotoIds.delete(photoId);
        }

        updatePhotoThumbnailState(checkbox.closest('.page-builder-photo-thumb'), photoId);
    });

    updateBulkSelectionUI();
    console.log('🔄 Inverted selection');
}

/**
 * Updates visual state of a photo thumbnail
 */
function updatePhotoThumbnailState(thumb, photoId) {
    if (!thumb) return;

    const isSelected = window.bulkPhotoState.selectedPhotoIds.has(photoId);

    if (isSelected) {
        thumb.classList.add('bulk-selected');
    } else {
        thumb.classList.remove('bulk-selected');
    }
}

/**
 * Updates UI to reflect current selection
 */
function updateBulkSelectionUI() {
    const count = window.bulkPhotoState.selectedPhotoIds.size;

    // Update count display
    const countElement = document.getElementById('bulkSelectedCount');
    if (countElement) {
        countElement.textContent = `${count} selected`;
    }

    // Update action buttons state
    updateBulkActionButtons();
}

/**
 * Enables/disables bulk action buttons based on selection
 */
function updateBulkActionButtons() {
    const hasSelection = window.bulkPhotoState.selectedPhotoIds.size > 0;

    const addBtn = document.getElementById('bulkAddBtn');
    const distributeBtn = document.getElementById('bulkDistributeBtn');
    const deleteBtn = document.getElementById('bulkDeleteBtn');

    if (addBtn) addBtn.disabled = !hasSelection;
    if (distributeBtn) distributeBtn.disabled = !hasSelection;
    if (deleteBtn) deleteBtn.disabled = !hasSelection;
}

// ============================================
// BULK OPERATIONS
// ============================================

/**
 * Adds selected photos to a specific page
 */
function bulkAddToPage() {
    const selectedIds = Array.from(window.bulkPhotoState.selectedPhotoIds);

    if (selectedIds.length === 0) {
        if (typeof showToast === 'function') {
            showToast('warning', 'No photos selected');
        }
        return;
    }

    // Get available pages
    const pages = window.brochurePages || [];
    if (pages.length === 0) {
        if (typeof showToast === 'function') {
            showToast('error', 'No pages available. Create pages first.');
        }
        return;
    }

    // Show page selection modal
    showPageSelectionModal(selectedIds, 'add');
}

/**
 * Distributes selected photos evenly across pages
 */
function bulkDistribute() {
    const selectedIds = Array.from(window.bulkPhotoState.selectedPhotoIds);

    if (selectedIds.length === 0) {
        if (typeof showToast === 'function') {
            showToast('warning', 'No photos selected');
        }
        return;
    }

    // Get available pages (exclude cover and back page)
    const pages = window.brochurePages || [];
    const contentPages = pages.filter((p, idx) => idx > 0 && idx < pages.length - 1);

    if (contentPages.length === 0) {
        if (typeof showToast === 'function') {
            showToast('error', 'No content pages available. Create pages first.');
        }
        return;
    }

    // Distribute photos evenly
    const photosPerPage = Math.ceil(selectedIds.length / contentPages.length);
    let photoIndex = 0;
    let addedCount = 0;

    contentPages.forEach(page => {
        const photosForThisPage = selectedIds.slice(photoIndex, photoIndex + photosPerPage);
        photoIndex += photosPerPage;

        photosForThisPage.forEach(photoId => {
            // Check if photo already in page
            const alreadyInPage = page.contentBlocks.some(b => b.type === 'photo' && b.photoId === photoId);
            if (!alreadyInPage) {
                page.contentBlocks.push({
                    id: `photo_${Date.now()}_${Math.random()}`,
                    type: 'photo',
                    photoId: photoId
                });
                addedCount++;
            }
        });
    });

    // Update global state
    window.brochurePages = pages;

    // Re-render
    if (typeof renderBrochurePages === 'function') {
        renderBrochurePages();
    }
    if (typeof renderAvailablePhotos === 'function') {
        renderAvailablePhotos();
    }

    // Clear selection
    selectNonePhotos();

    if (typeof showToast === 'function') {
        showToast('success', `✓ Distributed ${addedCount} photos across ${contentPages.length} pages`);
    }

    console.log(`📊 Distributed ${selectedIds.length} photos across ${contentPages.length} pages`);
}

/**
 * Deletes selected photos from the project
 */
function bulkDelete() {
    const selectedIds = Array.from(window.bulkPhotoState.selectedPhotoIds);

    if (selectedIds.length === 0) {
        if (typeof showToast === 'function') {
            showToast('warning', 'No photos selected');
        }
        return;
    }

    // Confirm deletion
    const confirmed = confirm(`Delete ${selectedIds.length} photo${selectedIds.length !== 1 ? 's' : ''}?\n\nThis will remove them from all pages and categories.`);
    if (!confirmed) return;

    let removedCount = 0;

    // Remove from uploaded photos
    if (window.uploadedPhotos) {
        window.uploadedPhotos = window.uploadedPhotos.filter(photo => {
            const photoId = photo.id || photo.name;
            if (selectedIds.includes(photoId)) {
                removedCount++;
                return false;
            }
            return true;
        });
    }

    // Remove from category assignments
    if (window.photoCategoryAssignments) {
        Object.keys(window.photoCategoryAssignments).forEach(category => {
            window.photoCategoryAssignments[category] = window.photoCategoryAssignments[category].filter(
                photoId => !selectedIds.includes(photoId)
            );
        });
    }

    // Remove from all pages
    if (window.brochurePages) {
        window.brochurePages.forEach(page => {
            page.contentBlocks = page.contentBlocks.filter(
                block => !(block.type === 'photo' && selectedIds.includes(block.photoId))
            );
        });
    }

    // Clear selection
    selectNonePhotos();

    // Re-render
    if (typeof renderBrochurePages === 'function') {
        renderBrochurePages();
    }
    if (typeof renderAvailablePhotos === 'function') {
        renderAvailablePhotos();
    }

    if (typeof showToast === 'function') {
        showToast('info', `🗑️ Deleted ${removedCount} photo${removedCount !== 1 ? 's' : ''}`);
    }

    console.log(`🗑️ Bulk deleted ${removedCount} photos`);
}

/**
 * Shows modal for selecting target page for bulk operations
 */
function showPageSelectionModal(photoIds, operation) {
    const pages = window.brochurePages || [];

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'bulk-page-selection-modal';
    modal.innerHTML = `
        <div class="bulk-modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="bulk-modal-content">
            <div class="bulk-modal-header">
                <h3>Select Target Page</h3>
                <button class="bulk-modal-close" onclick="this.closest('.bulk-page-selection-modal').remove()">✕</button>
            </div>
            <div class="bulk-modal-body">
                <p>Select a page to add ${photoIds.length} photo${photoIds.length !== 1 ? 's' : ''}:</p>
                <div class="bulk-page-list">
                    ${pages.map(page => {
                        const photoCount = page.contentBlocks.filter(b => b.type === 'photo').length;
                        return `
                            <div class="bulk-page-option" onclick="executeBulkAddToPage(${page.id}, ${JSON.stringify(photoIds).replace(/"/g, '&quot;')})">
                                <div class="bulk-page-option-name">
                                    <strong>Page ${page.id}: ${page.name}</strong>
                                    <span class="bulk-page-option-count">${photoCount} photo${photoCount !== 1 ? 's' : ''}</span>
                                </div>
                                <div class="bulk-page-option-arrow">→</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

/**
 * Executes bulk add to a specific page
 */
function executeBulkAddToPage(pageId, photoIds) {
    const page = window.brochurePages.find(p => p.id === pageId);
    if (!page) return;

    let addedCount = 0;

    photoIds.forEach(photoId => {
        // Check if photo already in page
        const alreadyInPage = page.contentBlocks.some(b => b.type === 'photo' && b.photoId === photoId);
        if (!alreadyInPage) {
            page.contentBlocks.push({
                id: `photo_${Date.now()}_${Math.random()}`,
                type: 'photo',
                photoId: photoId
            });
            addedCount++;
        }
    });

    // Update global state
    window.brochurePages = window.brochurePages;

    // Re-render
    if (typeof renderBrochurePages === 'function') {
        renderBrochurePages();
    }
    if (typeof renderAvailablePhotos === 'function') {
        renderAvailablePhotos();
    }

    // Clear selection
    selectNonePhotos();

    // Close modal
    document.querySelector('.bulk-page-selection-modal')?.remove();

    if (typeof showToast === 'function') {
        showToast('success', `✓ Added ${addedCount} photo${addedCount !== 1 ? 's' : ''} to ${page.name}`);
    }

    console.log(`➕ Added ${addedCount} photos to page ${pageId}`);
}

// ============================================
// GLOBAL EXPORTS
// ============================================

window.initBulkPhotoOperations = initBulkPhotoOperations;
window.toggleBulkMode = toggleBulkMode;
window.selectAllPhotos = selectAllPhotos;
window.selectNonePhotos = selectNonePhotos;
window.invertPhotoSelection = invertPhotoSelection;
window.bulkAddToPage = bulkAddToPage;
window.bulkDistribute = bulkDistribute;
window.bulkDelete = bulkDelete;
window.executeBulkAddToPage = executeBulkAddToPage;

// ============================================
// AUTO-INITIALIZE
// ============================================

// Hook into Page Builder modal opening
const originalOpenPageBuilderModal = window.openPageBuilderModal;
if (typeof originalOpenPageBuilderModal === 'function') {
    window.openPageBuilderModal = function() {
        originalOpenPageBuilderModal();
        setTimeout(() => initBulkPhotoOperations(), 200);
    };
}

console.log('✅ Bulk Photo Operations module ready');
