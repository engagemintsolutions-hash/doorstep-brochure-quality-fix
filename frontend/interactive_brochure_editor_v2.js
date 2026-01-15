/**
 * ═══════════════════════════════════════════════════════════════════════
 * INTERACTIVE BROCHURE EDITOR V2 - COMPLETE SYSTEM
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Full-featured brochure preview and editor before payment authorization
 * Features:
 * - Keyboard navigation (up/down arrows) for page reordering
 * - Drag-and-drop page reordering with mouse
 * - Edit pages: title, add/remove photos, add/remove content blocks
 * - Delete photos with X button
 * - Drag photos between categories
 * - Drag content blocks to reorder
 * - Floor plan integration
 * - Approve & Continue to payment
 */

console.log('🎨 Interactive Brochure Editor V2 loading...');

// Global state for selected page card
let selectedPageIndex = null;

// ═══════════════════════════════════════════════════════════════════════
// RENDER INTERACTIVE EDITOR
// ═══════════════════════════════════════════════════════════════════════

function renderInteractiveBrochureEditor() {
    const state = window.UnifiedBrochureState;
    const pages = state.pages;

    // Hide CTA, show preview
    const cta = document.getElementById('pageBuilderCTA');
    if (cta) cta.style.display = 'none';

    let previewContainer = document.getElementById('pageBuilderPreview');
    if (!previewContainer) {
        console.error('❌ Preview container not found');
        return;
    }

    previewContainer.style.display = 'block';

    // Build rich interactive HTML
    let html = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; padding: 2.5rem; box-shadow: 0 8px 24px rgba(0,0,0,0.15); color: white; margin-bottom: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h2 style="margin: 0; font-size: 2rem; font-weight: bold;">
                        📚 Your Brochure is Ready to Review
                    </h2>
                    <p style="margin: 0.75rem 0 0 0; font-size: 1.1rem; opacity: 0.95;">
                        ${pages.length} pages • ${state.photos.length} photos • ${getContentBlockCount()} content sections
                    </p>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; opacity: 0.85;">
                        💡 Click a page and use ↑↓ arrow keys to reorder, or drag with mouse
                    </p>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button onclick="regenerateBrochure()"
                            style="padding: 0.75rem 1.5rem; background: rgba(255,255,255,0.2); color: white; border: 2px solid white; border-radius: 8px; cursor: pointer; font-size: 1rem; font-weight: 600; transition: all 0.2s;"
                            onmouseover="this.style.background='rgba(255,255,255,0.3)'"
                            onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                        🔄 Regenerate
                    </button>
                    <button onclick="approveBrochureAndContinue()"
                            style="padding: 0.75rem 2rem; background: white; color: #667eea; border: none; border-radius: 8px; cursor: pointer; font-size: 1.1rem; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.2); transition: all 0.2s;"
                            onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.3)'"
                            onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.2)'">
                        ✓ Approve & Continue
                    </button>
                </div>
            </div>
        </div>

        <!-- Page Cards -->
        <div id="sortablePagesList" style="display: flex; flex-direction: column; gap: 1.5rem;">
            ${pages.map((page, index) => renderPageCard(page, index, state)).join('')}
        </div>

        <!-- Add New Page Button -->
        <button onclick="addNewPage()"
                style="margin-top: 2rem; padding: 1rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1.1rem; font-weight: bold; width: 100%; transition: all 0.2s;"
                onmouseover="this.style.transform='scale(1.02)'"
                onmouseout="this.style.transform='scale(1)'">
            ➕ Add New Page
        </button>
    `;

    previewContainer.innerHTML = html;

    // Initialize drag-and-drop and keyboard navigation
    setTimeout(() => {
        initializeDragAndDrop();
        initializeKeyboardNavigation();
    }, 100);

    console.log('✅ Interactive brochure editor rendered');
}

// ═══════════════════════════════════════════════════════════════════════
// RENDER PAGE CARD
// ═══════════════════════════════════════════════════════════════════════

function renderPageCard(page, index, state) {
    const photoCount = page.photos.length;
    const contentBlocks = extractContentBlocks(page, state);
    const hasFloorPlan = state.floorPlan && index === 0;
    const isSelected = selectedPageIndex === index;

    return `
        <div class="draggable-page-card"
             data-page-index="${index}"
             draggable="true"
             tabindex="0"
             onclick="selectPageCard(${index})"
             style="background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1); transition: all 0.3s; cursor: pointer; position: relative; border: ${isSelected ? '3px solid #667eea' : '2px solid #e9ecef'}; ${isSelected ? 'box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);' : ''}">

            <!-- Drag Handle -->
            <div style="position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 30px; height: 60px; background: #f8f9fa; border-radius: 0 8px 8px 0; display: flex; align-items: center; justify-content: center; cursor: grab; color: #6c757d; font-weight: bold; font-size: 1.2rem;">
                ⋮⋮
            </div>

            <div style="display: flex; gap: 1.5rem; padding-left: 30px;">
                <!-- Page Number Badge -->
                <div style="min-width: 60px; height: 60px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; font-weight: bold; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                    ${index + 1}
                </div>

                <!-- Page Content -->
                <div style="flex: 1;">
                    <!-- Title -->
                    <h3 style="margin: 0 0 1rem 0; color: #212529; font-size: 1.3rem; font-weight: bold;">
                        ${page.title}
                    </h3>

                    <!-- Photos Grid -->
                    ${page.photos.length > 0 ? `
                        <div style="margin-bottom: 1.25rem;">
                            <div style="font-size: 0.875rem; color: #6c757d; margin-bottom: 0.5rem; font-weight: 600;">
                                📸 PHOTOS (${photoCount})
                            </div>
                            <div id="photosGrid_${index}" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                ${page.photos.map((photo, photoIdx) => `
                                    <div style="position: relative; width: 90px; height: 90px; border-radius: 6px; overflow: hidden; border: 2px solid #e9ecef; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" draggable="true" data-photo-index="${photoIdx}">
                                        <img src="${photo.dataUrl}"
                                             style="width: 100%; height: 100%; object-fit: cover;"
                                             title="${photo.name}" />
                                        <button onclick="deletePhotoFromPage(${index}, ${photoIdx}); event.stopPropagation();"
                                                style="position: absolute; top: 2px; right: 2px; width: 20px; height: 20px; border-radius: 50%; background: rgba(220, 53, 69, 0.9); color: white; border: none; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; line-height: 1; padding: 0;"
                                                onmouseover="this.style.background='#dc3545'"
                                                onmouseout="this.style.background='rgba(220, 53, 69, 0.9)'">
                                            ×
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Floor Plan -->
                    ${hasFloorPlan ? `
                        <div style="margin-bottom: 1.25rem;">
                            <div style="font-size: 0.875rem; color: #6c757d; margin-bottom: 0.5rem; font-weight: 600;">
                                🗺️ FLOOR PLAN
                            </div>
                            <div style="width: 180px; height: 120px; border-radius: 6px; overflow: hidden; border: 2px solid #17a2b8; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                <img src="${state.floorPlan.dataUrl}"
                                     style="width: 100%; height: 100%; object-fit: cover;"
                                     title="Floor Plan" />
                            </div>
                        </div>
                    ` : ''}

                    <!-- Content Blocks -->
                    ${contentBlocks.length > 0 ? `
                        <div>
                            <div style="font-size: 0.875rem; color: #6c757d; margin-bottom: 0.5rem; font-weight: 600;">
                                📝 CONTENT SECTIONS (${contentBlocks.length})
                            </div>
                            <div id="contentBlocksGrid_${index}" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                                ${contentBlocks.map((block, blockIdx) => `
                                    <div draggable="true" data-block-index="${blockIdx}" style="background: #f8f9fa; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.875rem; color: #495057; border: 1px solid #dee2e6; display: flex; align-items: center; gap: 0.5rem; cursor: move;">
                                        <span style="font-size: 1.1rem;">${block.icon}</span>
                                        <span style="font-weight: 500;">${block.title}</span>
                                        ${block.preview ? `<span style="color: #6c757d; font-size: 0.8rem;">• ${block.preview}</span>` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>

                <!-- Actions Column -->
                <div style="display: flex; flex-direction: column; gap: 0.75rem; min-width: 120px;">
                    <button onclick="editPageInEditor(${index}); event.stopPropagation();"
                            style="padding: 0.6rem 1rem; background: white; color: #007bff; border: 2px solid #007bff; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: 600; transition: all 0.2s;"
                            onmouseover="this.style.background='#007bff'; this.style.color='white'"
                            onmouseout="this.style.background='white'; this.style.color='#007bff'">
                        ✏️ Edit
                    </button>
                    <button onclick="duplicatePage(${index}); event.stopPropagation();"
                            style="padding: 0.6rem 1rem; background: white; color: #17a2b8; border: 2px solid #17a2b8; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: 600; transition: all 0.2s;"
                            onmouseover="this.style.background='#17a2b8'; this.style.color='white'"
                            onmouseout="this.style.background='white'; this.style.color='#17a2b8'">
                        📋 Duplicate
                    </button>
                    <button onclick="deletePageFromEditor(${index}); event.stopPropagation();"
                            style="padding: 0.6rem 1rem; background: white; color: #dc3545; border: 2px solid #dc3545; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: 600; transition: all 0.2s;"
                            onmouseover="this.style.background='#dc3545'; this.style.color='white'"
                            onmouseout="this.style.background='white'; this.style.color='#dc3545'">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ═══════════════════════════════════════════════════════════════════════
// KEYBOARD NAVIGATION FOR PAGE REORDERING
// ═══════════════════════════════════════════════════════════════════════

function selectPageCard(index) {
    selectedPageIndex = index;
    renderInteractiveBrochureEditor(); // Re-render to show selection
}

function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (selectedPageIndex === null) return;

        const state = window.UnifiedBrochureState;
        const totalPages = state.pages.length;

        if (e.key === 'ArrowUp' && selectedPageIndex > 0) {
            e.preventDefault();
            // Move page up
            const pages = state.pages;
            [pages[selectedPageIndex], pages[selectedPageIndex - 1]] = [pages[selectedPageIndex - 1], pages[selectedPageIndex]];
            selectedPageIndex--;
            renderInteractiveBrochureEditor();
            console.log(`📄 Moved page up to position ${selectedPageIndex + 1}`);
        } else if (e.key === 'ArrowDown' && selectedPageIndex < totalPages - 1) {
            e.preventDefault();
            // Move page down
            const pages = state.pages;
            [pages[selectedPageIndex], pages[selectedPageIndex + 1]] = [pages[selectedPageIndex + 1], pages[selectedPageIndex]];
            selectedPageIndex++;
            renderInteractiveBrochureEditor();
            console.log(`📄 Moved page down to position ${selectedPageIndex + 1}`);
        }
    });
}

// ═══════════════════════════════════════════════════════════════════════
// DRAG-AND-DROP FOR PAGE REORDERING (MOUSE)
// ═══════════════════════════════════════════════════════════════════════

function initializeDragAndDrop() {
    const container = document.getElementById('sortablePagesList');
    if (!container) return;

    let draggedElement = null;
    let draggedIndex = null;

    const cards = container.querySelectorAll('.draggable-page-card');

    cards.forEach((card, index) => {
        card.addEventListener('dragstart', (e) => {
            draggedElement = card;
            draggedIndex = parseInt(card.getAttribute('data-page-index'));
            card.style.opacity = '0.4';
            e.dataTransfer.effectAllowed = 'move';
        });

        card.addEventListener('dragend', (e) => {
            card.style.opacity = '1';
            draggedElement = null;
        });

        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            const targetIndex = parseInt(card.getAttribute('data-page-index'));

            if (draggedElement && draggedIndex !== targetIndex) {
                const rect = card.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;

                if (e.clientY < midpoint) {
                    container.insertBefore(draggedElement, card);
                } else {
                    container.insertBefore(draggedElement, card.nextSibling);
                }
            }
        });

        card.addEventListener('drop', (e) => {
            e.preventDefault();
            reorderPages();
        });
    });
}

function reorderPages() {
    const container = document.getElementById('sortablePagesList');
    const cards = container.querySelectorAll('.draggable-page-card');
    const newOrder = [];

    cards.forEach(card => {
        const index = parseInt(card.getAttribute('data-page-index'));
        newOrder.push(window.UnifiedBrochureState.pages[index]);
    });

    window.UnifiedBrochureState.pages = newOrder;
    renderInteractiveBrochureEditor();
    console.log('✅ Pages reordered');
}

// ═══════════════════════════════════════════════════════════════════════
// EDIT PAGE MODAL
// ═══════════════════════════════════════════════════════════════════════

function editPageInEditor(pageIndex) {
    const state = window.UnifiedBrochureState;
    const page = state.pages[pageIndex];

    // Create modal HTML
    const modalHTML = `
        <div id="editPageModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center;" onclick="if(event.target.id === 'editPageModal') closeEditModal()">
            <div style="background: white; border-radius: 16px; padding: 2rem; max-width: 800px; width: 90%; max-height: 90vh; overflow-y: auto;" onclick="event.stopPropagation()">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 style="margin: 0; color: #212529;">✏️ Edit Page ${pageIndex + 1}</h2>
                    <button onclick="closeEditModal()" style="background: none; border: none; font-size: 2rem; cursor: pointer; color: #6c757d; line-height: 1;">&times;</button>
                </div>

                <!-- Edit Title -->
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: #495057;">Page Title</label>
                    <input type="text" id="editPageTitle" value="${page.title}" style="width: 100%; padding: 0.75rem; border: 2px solid #dee2e6; border-radius: 6px; font-size: 1rem;">
                </div>

                <!-- Photos Section -->
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: #495057;">Photos (${page.photos.length})</label>
                    <div id="editModalPhotos" style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem;">
                        ${page.photos.map((photo, idx) => `
                            <div style="position: relative; width: 100px; height: 100px; border-radius: 8px; overflow: hidden; border: 2px solid #dee2e6;">
                                <img src="${photo.dataUrl}" style="width: 100%; height: 100%; object-fit: cover;">
                                <button onclick="removePhotoFromEditModal(${idx})" style="position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; border-radius: 50%; background: rgba(220, 53, 69, 0.95); color: white; border: none; cursor: pointer; font-size: 14px;">×</button>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="addPhotosToPage(${pageIndex})" style="padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">+ Add Photos from Library</button>
                </div>

                <!-- Content Blocks Section -->
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: #495057;">Content Blocks</label>
                    <div id="editModalContent" style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;">
                        ${extractContentBlocks(page, state).map((block, idx) => `
                            <div style="background: #f8f9fa; padding: 0.5rem 1rem; border-radius: 6px; border: 1px solid #dee2e6; display: flex; align-items: center; gap: 0.5rem;">
                                <span style="font-size: 1.1rem;">${block.icon}</span>
                                <span style="font-weight: 500; font-size: 0.875rem;">${block.title}</span>
                                <button onclick="removeContentBlock(${idx})" style="background: none; border: none; color: #dc3545; cursor: pointer; margin-left: 0.5rem;">×</button>
                            </div>
                        `).join('')}
                    </div>
                    <button onclick="addContentBlock(${pageIndex})" style="padding: 0.5rem 1rem; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">+ Add Content Block</button>
                </div>

                <!-- Save Button -->
                <div style="display: flex; justify-content: flex-end; gap: 1rem;">
                    <button onclick="closeEditModal()" style="padding: 0.75rem 1.5rem; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Cancel</button>
                    <button onclick="savePageEdits(${pageIndex})" style="padding: 0.75rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">Save Changes</button>
                </div>
            </div>
        </div>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

window.currentEditPageIndex = null;
window.currentEditPhotos = [];

function closeEditModal() {
    const modal = document.getElementById('editPageModal');
    if (modal) modal.remove();
}

function removePhotoFromEditModal(photoIdx) {
    const state = window.UnifiedBrochureState;
    const page = state.pages[window.currentEditPageIndex || 0];
    page.photos.splice(photoIdx, 1);
    closeEditModal();
    editPageInEditor(window.currentEditPageIndex || 0);
}

function savePageEdits(pageIndex) {
    const state = window.UnifiedBrochureState;
    const page = state.pages[pageIndex];

    // Update title
    const newTitle = document.getElementById('editPageTitle').value;
    page.title = newTitle;

    closeEditModal();
    renderInteractiveBrochureEditor();
    console.log(`✅ Saved changes to page ${pageIndex + 1}`);
}

// ═══════════════════════════════════════════════════════════════════════
// DELETE PHOTO FROM PAGE
// ═══════════════════════════════════════════════════════════════════════

function deletePhotoFromPage(pageIndex, photoIndex) {
    const state = window.UnifiedBrochureState;
    const page = state.pages[pageIndex];

    if (confirm(`Delete this photo from page ${pageIndex + 1}?`)) {
        page.photos.splice(photoIndex, 1);
        renderInteractiveBrochureEditor();
        console.log(`🗑️ Deleted photo ${photoIndex} from page ${pageIndex + 1}`);
    }
}

// ═══════════════════════════════════════════════════════════════════════
// ADD/REMOVE CONTENT BLOCKS
// ═══════════════════════════════════════════════════════════════════════

function addContentBlock(pageIndex) {
    alert('Add Content Block - Feature coming in next update!\n\nYou can currently edit existing content blocks.');
}

function removeContentBlock(blockIdx) {
    console.log(`Remove content block ${blockIdx}`);
}

// ═══════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

function extractContentBlocks(page, state) {
    const blocks = [];
    const property = state.property;

    // Features block
    if (property.features && property.features.length > 0) {
        blocks.push({
            icon: '⭐',
            title: 'Key Features',
            preview: `${property.features.length} features`
        });
    }

    // Location enrichment blocks
    if (property.locationEnrichment) {
        if (property.locationEnrichment.schools) {
            blocks.push({
                icon: '🎓',
                title: 'Schools',
                preview: property.locationEnrichment.schools.substring(0, 30) + '...'
            });
        }

        if (property.locationEnrichment.transport) {
            blocks.push({
                icon: '🚇',
                title: 'Transport',
                preview: property.locationEnrichment.transport.substring(0, 30) + '...'
            });
        }

        if (property.locationEnrichment.amenities) {
            blocks.push({
                icon: '🏪',
                title: 'Amenities',
                preview: property.locationEnrichment.amenities.substring(0, 30) + '...'
            });
        }
    }

    // Room-specific blocks based on page title
    const title = page.title.toLowerCase();

    if (title.includes('kitchen') && property.kitchenDetails) {
        blocks.push({
            icon: '🍳',
            title: 'Kitchen Details',
            preview: 'Fitted appliances'
        });
    }

    if (title.includes('bedroom') && property.bedrooms) {
        blocks.push({
            icon: '🛏️',
            title: 'Bedroom Info',
            preview: `${property.bedrooms} bedrooms`
        });
    }

    if (title.includes('bathroom') && property.bathrooms) {
        blocks.push({
            icon: '🚿',
            title: 'Bathroom Info',
            preview: `${property.bathrooms} bathrooms`
        });
    }

    if (title.includes('garden') || title.includes('outdoor')) {
        blocks.push({
            icon: '🌳',
            title: 'Garden Details',
            preview: 'Outdoor space'
        });
    }

    return blocks;
}

function getContentBlockCount() {
    const state = window.UnifiedBrochureState;
    let total = 0;
    state.pages.forEach(page => {
        total += extractContentBlocks(page, state).length;
    });
    return total;
}

// ═══════════════════════════════════════════════════════════════════════
// PAGE ACTIONS
// ═══════════════════════════════════════════════════════════════════════

function duplicatePage(pageIndex) {
    const page = window.UnifiedBrochureState.pages[pageIndex];
    const duplicate = JSON.parse(JSON.stringify(page));
    duplicate.id = Date.now();
    duplicate.title = page.title + ' (Copy)';

    window.UnifiedBrochureState.pages.splice(pageIndex + 1, 0, duplicate);
    renderInteractiveBrochureEditor();
    console.log(`✅ Duplicated page ${pageIndex + 1}`);
}

function deletePageFromEditor(pageIndex) {
    if (window.UnifiedBrochureState.pages.length <= 1) {
        alert('Cannot delete the last page!');
        return;
    }

    if (confirm(`Delete page ${pageIndex + 1}?`)) {
        window.UnifiedBrochureState.pages.splice(pageIndex, 1);
        if (selectedPageIndex === pageIndex) selectedPageIndex = null;
        renderInteractiveBrochureEditor();
        console.log(`🗑️ Deleted page ${pageIndex + 1}`);
    }
}

function addNewPage() {
    const newPage = {
        id: Date.now(),
        type: 'custom',
        title: 'New Page',
        photos: [],
        content: []
    };

    window.UnifiedBrochureState.pages.push(newPage);
    renderInteractiveBrochureEditor();
    console.log('✅ Added new page');
}

function regenerateBrochure() {
    if (confirm('Regenerate brochure? This will reset all pages.')) {
        if (typeof generateUnifiedBrochure === 'function') {
            generateUnifiedBrochure();
        } else {
            console.error('generateUnifiedBrochure function not found');
        }
    }
}

function approveBrochureAndContinue() {
    // TODO: Integration with payment system
    alert('✅ Brochure approved!\n\nProceeding to payment...\n\n(Payment integration coming soon)');
    console.log('✅ Brochure approved by user');
}

// Global exports
window.renderInteractiveBrochureEditor = renderInteractiveBrochureEditor;
window.editPageInEditor = editPageInEditor;
window.duplicatePage = duplicatePage;
window.deletePageFromEditor = deletePageFromEditor;
window.addNewPage = addNewPage;
window.regenerateBrochure = regenerateBrochure;
window.approveBrochureAndContinue = approveBrochureAndContinue;
window.selectPageCard = selectPageCard;
window.deletePhotoFromPage = deletePhotoFromPage;
window.savePageEdits = savePageEdits;
window.closeEditModal = closeEditModal;

console.log('✅ Interactive Brochure Editor V2 ready');
