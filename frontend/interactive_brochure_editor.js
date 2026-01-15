/**
 * ═══════════════════════════════════════════════════════════════════════
 * INTERACTIVE BROCHURE EDITOR - COMPLETE SYSTEM
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Full-featured brochure preview and editor before payment authorization
 * Features:
 * - Drag-and-drop page reordering
 * - Content blocks (features, schools, transport, etc.)
 * - Floor plan integration
 * - Edit pages (add/remove photos and content)
 * - Approve & Continue to payment
 */

console.log('🎨 Interactive Brochure Editor loading...');

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
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button onclick="regenerateBrochure()"
                            style="padding: 0.75rem 1.5rem; background: rgba(255,255,255,0.2); color: white; border: 2px solid white; border-radius: 8px; cursor: pointer; font-size: 1rem; backdrop-filter: blur(10px); transition: all 0.2s;"
                            onmouseover="this.style.background='rgba(255,255,255,0.3)'"
                            onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                        🔄 Regenerate
                    </button>
                    <button onclick="approveBrochureAndContinue()"
                            style="padding: 0.75rem 2rem; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4); transition: all 0.2s;"
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(40, 167, 69, 0.6)'"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(40, 167, 69, 0.4)'">
                        ✓ Approve & Continue
                    </button>
                </div>
            </div>
        </div>

        <!-- Interactive Pages Container -->
        <div id="sortablePagesList" style="display: flex; flex-direction: column; gap: 1.25rem;">
    `;

    // Render each page with full details
    pages.forEach((page, index) => {
        html += renderPageCard(page, index, state);
    });

    html += `
        </div>

        <!-- Add Page Button -->
        <button onclick="addNewPageToEditor()"
                style="width: 100%; padding: 1.5rem; background: white; color: #667eea; border: 3px dashed #667eea; border-radius: 12px; cursor: pointer; font-size: 1.1rem; font-weight: bold; margin-top: 1.5rem; transition: all 0.2s;"
                onmouseover="this.style.background='#f8f9fa'; this.style.borderColor='#764ba2'"
                onmouseout="this.style.background='white'; this.style.borderColor='#667eea'">
            ➕ Add New Page
        </button>

        <!-- Bottom Summary & Actions -->
        <div style="background: white; border-radius: 12px; padding: 2rem; margin-top: 2rem; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 2px solid #e9ecef;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-size: 0.95rem; color: #6c757d; margin-bottom: 0.5rem;">
                        💡 <strong>Tip:</strong> Drag pages to reorder, click edit to customize content
                    </div>
                    <div style="font-size: 0.85rem; color: #adb5bd;">
                        Changes are saved automatically as you edit
                    </div>
                </div>
                <button onclick="approveBrochureAndContinue()"
                        style="padding: 1rem 2.5rem; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 1.2rem; box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4); transition: all 0.3s;"
                        onmouseover="this.style.transform='translateY(-3px) scale(1.02)'; this.style.boxShadow='0 8px 25px rgba(40, 167, 69, 0.5)'"
                        onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 6px 20px rgba(40, 167, 69, 0.4)'">
                    ✓ Looks Perfect - Continue to Payment
                </button>
            </div>
        </div>
    `;

    previewContainer.innerHTML = html;

    // Initialize drag-and-drop
    initializeDragAndDrop();

    // Scroll to preview
    previewContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    console.log('✅ Interactive editor rendered');
}

// ═══════════════════════════════════════════════════════════════════════
// RENDER INDIVIDUAL PAGE CARD
// ═══════════════════════════════════════════════════════════════════════

function renderPageCard(page, index, state) {
    const photoCount = page.photos.length;
    const contentBlocks = extractContentBlocks(page, state);
    const hasFloorPlan = state.floorPlan && index === 0; // Floor plan typically on first page

    return `
        <div class="draggable-page-card"
             data-page-index="${index}"
             draggable="true"
             style="background: white; border-radius: 12px; padding: 1.75rem; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 2px solid #e9ecef; cursor: move; transition: all 0.2s; position: relative;">

            <!-- Drag Handle -->
            <div style="position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 40px; height: 60px; display: flex; align-items: center; justify-content: center; color: #adb5bd; font-size: 1.5rem; cursor: grab;">
                ⋮⋮
            </div>

            <div style="margin-left: 40px; display: flex; gap: 1.5rem;">
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
                            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                ${page.photos.map(photo => `
                                    <div style="position: relative; width: 90px; height: 90px; border-radius: 6px; overflow: hidden; border: 2px solid #e9ecef; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                        <img src="${photo.dataUrl}"
                                             style="width: 100%; height: 100%; object-fit: cover;"
                                             title="${photo.name}" />
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Floor Plan (if applicable) -->
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
                            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                                ${contentBlocks.map(block => `
                                    <div style="background: #f8f9fa; padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.875rem; color: #495057; border: 1px solid #dee2e6; display: flex; align-items: center; gap: 0.5rem;">
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
                    <button onclick="editPageInEditor(${index})"
                            style="padding: 0.6rem 1rem; background: white; color: #007bff; border: 2px solid #007bff; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: 600; transition: all 0.2s;"
                            onmouseover="this.style.background='#007bff'; this.style.color='white'"
                            onmouseout="this.style.background='white'; this.style.color='#007bff'">
                        ✏️ Edit
                    </button>
                    <button onclick="duplicatePage(${index})"
                            style="padding: 0.6rem 1rem; background: white; color: #17a2b8; border: 2px solid #17a2b8; border-radius: 6px; cursor: pointer; font-size: 0.9rem; font-weight: 600; transition: all 0.2s;"
                            onmouseover="this.style.background='#17a2b8'; this.style.color='white'"
                            onmouseout="this.style.background='white'; this.style.color='#17a2b8'">
                        📋 Duplicate
                    </button>
                    <button onclick="deletePageFromEditor(${index})"
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
// CONTENT BLOCK EXTRACTION
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
    if (title.includes('bedroom') && property.beds) {
        blocks.push({
            icon: '🛏️',
            title: 'Bedroom Info',
            preview: `${property.beds} bedrooms`
        });
    }
    if (title.includes('bathroom') && property.bathrooms) {
        blocks.push({
            icon: '🚿',
            title: 'Bathroom Info',
            preview: `${property.bathrooms} bathrooms`
        });
    }
    if (title.includes('garden')) {
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
    let count = 0;
    state.pages.forEach(page => {
        count += extractContentBlocks(page, state).length;
    });
    return count;
}

// ═══════════════════════════════════════════════════════════════════════
// DRAG AND DROP FUNCTIONALITY
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
            card.style.cursor = 'grabbing';
        });

        card.addEventListener('dragend', (e) => {
            card.style.opacity = '1';
            card.style.cursor = 'move';
        });

        card.addEventListener('dragover', (e) => {
            e.preventDefault();
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
            // Reorder pages in state
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

    // Re-render to update indices
    renderInteractiveBrochureEditor();

    if (typeof showToast === 'function') {
        showToast('success', '✓ Pages reordered');
    }
}

// ═══════════════════════════════════════════════════════════════════════
// PAGE ACTIONS
// ═══════════════════════════════════════════════════════════════════════

function editPageInEditor(pageIndex) {
    // TODO: Open edit modal
    alert(`Edit Page ${pageIndex + 1}\n\nComing soon:\n- Edit page title\n- Add/remove photos\n- Add/remove content blocks\n- Reorder elements`);
}

function duplicatePage(pageIndex) {
    const page = window.UnifiedBrochureState.pages[pageIndex];
    const duplicate = JSON.parse(JSON.stringify(page)); // Deep clone
    duplicate.id = `page_${Date.now()}`;
    duplicate.title = page.title + ' (Copy)';

    window.UnifiedBrochureState.pages.splice(pageIndex + 1, 0, duplicate);
    renderInteractiveBrochureEditor();

    if (typeof showToast === 'function') {
        showToast('success', `✓ Page duplicated`);
    }
}

function deletePageFromEditor(pageIndex) {
    if (window.UnifiedBrochureState.pages.length === 1) {
        alert('⚠️ Cannot delete the last page');
        return;
    }

    if (confirm(`Delete page ${pageIndex + 1}?`)) {
        window.UnifiedBrochureState.pages.splice(pageIndex, 1);
        renderInteractiveBrochureEditor();

        if (typeof showToast === 'function') {
            showToast('success', `✓ Page deleted`);
        }
    }
}

function addNewPageToEditor() {
    const newPage = {
        id: `page_${Date.now()}`,
        title: 'New Page',
        photos: [],
        contentBlocks: []
    };

    window.UnifiedBrochureState.pages.push(newPage);
    renderInteractiveBrochureEditor();

    if (typeof showToast === 'function') {
        showToast('success', '✓ New page added');
    }
}

function regenerateBrochure() {
    if (confirm('🔄 Regenerate brochure?\n\nThis will create a new layout with your current photos and content.')) {
        if (typeof generateUnifiedBrochure === 'function') {
            generateUnifiedBrochure();
        }
    }
}

function approveBrochureAndContinue() {
    const pageCount = window.UnifiedBrochureState.pages.length;
    const photoCount = window.UnifiedBrochureState.photos.length;

    if (confirm(`✓ Approve this brochure?\n\n• ${pageCount} pages\n• ${photoCount} photos\n• ${getContentBlockCount()} content sections\n\nYou'll proceed to payment next.`)) {
        // TODO: Integrate with payment system
        alert('✅ Brochure approved!\n\nRedirecting to payment...\n\n(Payment integration pending)');

        // Store approval in state
        window.UnifiedBrochureState.status.approved = true;
        window.UnifiedBrochureState.status.approvedAt = Date.now();

        // TODO: Call payment API
        console.log('📊 Brochure approved, ready for payment');
    }
}

// ═══════════════════════════════════════════════════════════════════════
// GLOBAL EXPORTS
// ═══════════════════════════════════════════════════════════════════════

window.renderInteractiveBrochureEditor = renderInteractiveBrochureEditor;
window.editPageInEditor = editPageInEditor;
window.duplicatePage = duplicatePage;
window.deletePageFromEditor = deletePageFromEditor;
window.addNewPageToEditor = addNewPageToEditor;
window.regenerateBrochure = regenerateBrochure;
window.approveBrochureAndContinue = approveBrochureAndContinue;

console.log('✅ Interactive Brochure Editor ready!');
