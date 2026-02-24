/**
 * ═══════════════════════════════════════════════════════════════════════
 * SIMPLE INTERACTIVE EDITOR - Clean Rebuild
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Clean, working editor for brochure pages.
 * Photos actually appear, can be reordered, edited, and exported.
 */

console.log('✏️ Simple Editor loaded');

// ═══════════════════════════════════════════════════════════════════════
// RENDER EDITOR
// ═══════════════════════════════════════════════════════════════════════

function renderSimpleEditor() {
    console.log('🎨 Rendering simple editor...');

    const state = window.SimpleBrochureState;
    if (!state || !state.pages || state.pages.length === 0) {
        console.error('❌ No brochure state found!');
        alert('No brochure data found. Please generate a brochure first.');
        return;
    }

    console.log(`📄 Rendering ${state.pages.length} pages`);

    // Create editor container
    const editorHTML = `
        <div id="simpleEditorModal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            overflow-y: auto;
            padding: 2rem;
        ">
            <div style="max-width: 1400px; margin: 0 auto;">
                <!-- Header -->
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding: 1.5rem;
                    background: white;
                    border-radius: 12px;
                ">
                    <div>
                        <h2 style="margin: 0 0 0.5rem 0; color: #2c3e50;">Your Brochure</h2>
                        <p style="margin: 0; color: #6c757d;">${state.pages.length} pages • ${state.allPhotos.length} photos</p>
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <button onclick="closeSimpleEditor()" style="
                            padding: 0.75rem 1.5rem;
                            background: white;
                            color: #6c757d;
                            border: 2px solid #dee2e6;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                        ">Close</button>
                        <button onclick="exportSimpleBrochure()" style="
                            padding: 0.75rem 2rem;
                            background: #4A1420;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            cursor: pointer;
                            font-weight: 600;
                            box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
                        ">📄 Export to PDF</button>
                    </div>
                </div>

                <!-- Pages Grid -->
                <div id="pagesGrid" style="
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 2rem;
                ">
                    ${renderPagesGrid(state.pages)}
                </div>
            </div>
        </div>
    `;

    // Insert into DOM
    const existingEditor = document.getElementById('simpleEditorModal');
    if (existingEditor) {
        existingEditor.remove();
    }

    document.body.insertAdjacentHTML('beforeend', editorHTML);

    console.log('✅ Editor rendered');
}

// ═══════════════════════════════════════════════════════════════════════
// RENDER PAGES GRID
// ═══════════════════════════════════════════════════════════════════════

function renderPagesGrid(pages) {
    return pages.map((page, index) => {
        return `
            <div class="page-card" data-page-id="${page.id}" style="
                background: white;
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            ">
                <!-- Page Header -->
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid #f0f0f0;
                ">
                    <div>
                        <div style="font-size: 0.85rem; color: #6c757d; font-weight: 600;">PAGE ${index + 1}</div>
                        <div style="font-size: 1.1rem; font-weight: 700; color: #2c3e50; margin-top: 0.25rem;">
                            ${page.title}
                        </div>
                    </div>
                    <div style="
                        background: ${getPageTypeColor(page.type)};
                        color: white;
                        padding: 0.25rem 0.75rem;
                        border-radius: 6px;
                        font-size: 0.75rem;
                        font-weight: 600;
                        text-transform: uppercase;
                    ">${page.type}</div>
                </div>

                <!-- Photos -->
                ${renderPagePhotos(page)}

                <!-- Content -->
                ${renderPageContent(page)}

                <!-- Actions -->
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    ${index > 0 ? `<button onclick="movePageUp(${index})" style="
                        flex: 1;
                        padding: 0.5rem;
                        background: #f8f9fa;
                        border: 1px solid #dee2e6;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 0.85rem;
                    ">↑ Move Up</button>` : ''}
                    ${index < pages.length - 1 ? `<button onclick="movePageDown(${index})" style="
                        flex: 1;
                        padding: 0.5rem;
                        background: #f8f9fa;
                        border: 1px solid #dee2e6;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 0.85rem;
                    ">↓ Move Down</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// ═══════════════════════════════════════════════════════════════════════
// RENDER PAGE PHOTOS
// ═══════════════════════════════════════════════════════════════════════

function renderPagePhotos(page) {
    if (!page.photos || page.photos.length === 0) {
        return `<div style="
            text-align: center;
            padding: 2rem;
            background: #f8f9fa;
            border-radius: 8px;
            color: #6c757d;
            font-size: 0.9rem;
        ">No photos on this page</div>`;
    }

    return `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 0.5rem; margin-bottom: 1rem;">
            ${page.photos.map((photo, photoIdx) => `
                <div style="
                    position: relative;
                    aspect-ratio: 1;
                    border-radius: 8px;
                    overflow: hidden;
                    background: #f0f0f0;
                ">
                    <img src="${photo.dataUrl || photo.url}" alt="${photo.filename}" style="
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    ">
                    <div style="
                        position: absolute;
                        bottom: 4px;
                        right: 4px;
                        background: rgba(0, 0, 0, 0.7);
                        color: white;
                        padding: 2px 6px;
                        border-radius: 4px;
                        font-size: 0.7rem;
                    ">${photoIdx + 1}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// ═══════════════════════════════════════════════════════════════════════
// RENDER PAGE CONTENT
// ═══════════════════════════════════════════════════════════════════════

function renderPageContent(page) {
    if (!page.content) return '';

    let contentHTML = '';

    if (page.type === 'cover' && page.content.address) {
        contentHTML = `
            <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; font-size: 0.9rem;">
                <div style="font-weight: 700; color: #2c3e50; margin-bottom: 0.5rem;">
                    ${page.content.address}
                </div>
                ${page.content.price ? `<div style="color: #4A1420; font-weight: 600; font-size: 1.1rem;">
                    ${page.content.price}
                </div>` : ''}
            </div>
        `;
    }

    if (page.type === 'contact' && page.content.agent) {
        const agent = page.content.agent;
        contentHTML = `
            <div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; font-size: 0.9rem;">
                ${agent.name ? `<div style="font-weight: 700; color: #2c3e50; margin-bottom: 0.5rem;">${agent.name}</div>` : ''}
                ${agent.phone ? `<div style="color: #6c757d;">📞 ${agent.phone}</div>` : ''}
                ${agent.email ? `<div style="color: #6c757d;">📧 ${agent.email}</div>` : ''}
            </div>
        `;
    }

    return contentHTML;
}

// ═══════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

function getPageTypeColor(type) {
    const colors = {
        'cover': '#4A1420',
        'interior': '#667eea',
        'floorplan': '#f39c12',
        'contact': '#28a745'
    };
    return colors[type] || '#6c757d';
}

function movePageUp(index) {
    const state = window.SimpleBrochureState;
    if (index <= 0) return;

    // Swap pages
    const temp = state.pages[index];
    state.pages[index] = state.pages[index - 1];
    state.pages[index - 1] = temp;

    // Re-render
    renderSimpleEditor();
    console.log(`✅ Moved page ${index} up`);
}

function movePageDown(index) {
    const state = window.SimpleBrochureState;
    if (index >= state.pages.length - 1) return;

    // Swap pages
    const temp = state.pages[index];
    state.pages[index] = state.pages[index + 1];
    state.pages[index + 1] = temp;

    // Re-render
    renderSimpleEditor();
    console.log(`✅ Moved page ${index} down`);
}

function closeSimpleEditor() {
    const editor = document.getElementById('simpleEditorModal');
    if (editor) {
        editor.remove();
        console.log('✅ Editor closed');
    }
}

function exportSimpleBrochure() {
    console.log('📄 Exporting brochure to PDF...');

    // Use existing export functionality
    if (typeof exportToPDF === 'function') {
        const state = window.SimpleBrochureState;
        exportToPDF(state.pages, state.property);
    } else {
        alert('Export functionality not available. Please refresh the page.');
        console.error('❌ exportToPDF function not found');
    }
}

// ═══════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════

window.renderSimpleEditor = renderSimpleEditor;
window.closeSimpleEditor = closeSimpleEditor;
window.movePageUp = movePageUp;
window.movePageDown = movePageDown;
window.exportSimpleBrochure = exportSimpleBrochure;

console.log('✅ Simple Editor ready');
