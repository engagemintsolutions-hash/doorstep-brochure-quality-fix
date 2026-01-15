/**
 * BROCHURE EDITOR V3 - LANDSCAPE A4 INTERACTIVE EDITING
 *
 * Features:
 * - Session-based state management
 * - Landscape A4 page rendering (297mm x 210mm)
 * - Contenteditable text editing
 * - Photo display from session URLs
 * - Auto-save functionality
 * - Zoom and view controls
 * - Properties panel
 */

// ============================================================================
// GLOBAL STATE
// ============================================================================

const EditorState = {
    sessionId: null,
    sessionData: null,
    photoUrls: {},
    currentPage: null,
    selectedElement: null,
    isDirty: false,
    zoomLevel: 1.0,
    showGuides: false,
    autoSaveInterval: null,
    pageDescriptions: {},  // Store page-specific AI descriptions by page ID
    pageLayouts: {},  // Store layout preference per page: '1-col', '2x2', '1x3', etc.
    photoGaps: {},  // Store photo grid gap per page in pixels: 0, 5, 10, 15
    customPhotoPositions: {},  // Store custom photo positions: {pageId: {photoId: {x, y, width, height}}}
    adjustMode: false,  // Toggle for drag/resize mode
    selectedPhoto: null  // Currently selected photo for adjusting
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Brochure Editor V3 initializing...');

    // Extract session ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    EditorState.sessionId = urlParams.get('session');

    if (!EditorState.sessionId) {
        showError('No session ID provided', 'Please return to the brochure builder and try again.');
        return;
    }

    console.log(`📝 Session ID: ${EditorState.sessionId}`);

    // Initialize UI
    initializeEventListeners();

    // Load session data
    loadSession();
});

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

async function generatePageSpecificDescription(page) {
    console.log(`🤖 Generating AI description for ${page.type} (${page.photos?.length || 0} photos)...`);

    try {
        const property = EditorState.sessionData.property || {};

        // Extract vision analysis details from photos on this page
        const photoDetails = [];
        console.log(`📸 Page ${page.type} has ${page.photos?.length || 0} photos`, page.photos);

        if (page.photos && page.photos.length > 0) {
            page.photos.forEach((photoItem, index) => {
                // photoItem might be an ID string OR an object with {id, ...}
                let photo = null;
                let photoId = null;

                // If photoItem is already an object, use it directly
                if (typeof photoItem === 'object' && photoItem !== null) {
                    photo = photoItem;
                    photoId = photoItem.id;
                } else {
                    // Otherwise it's an ID, look it up
                    photoId = photoItem;
                    photo = EditorState.sessionData.photos?.[photoId];

                    // If photos is an array, try direct lookup
                    if (!photo && Array.isArray(EditorState.sessionData.photos)) {
                        photo = EditorState.sessionData.photos.find(p => p.id === photoId);
                    }
                }

                console.log(`  📷 Photo ${index + 1} (${photoId}):`, photo?.analysis);

                if (photo && photo.analysis) {
                    const attributes = photo.analysis.attributes || [];
                    const caption = photo.analysis.caption || '';
                    if (attributes.length > 0 || caption) {
                        photoDetails.push(`Photo ${index + 1}: ${attributes.join(', ')}${caption ? ` - ${caption}` : ''}`);
                    }
                } else {
                    console.warn(`  ⚠️ No analysis for photo ${index + 1}:`, photo);
                }
            });
        }

        console.log(`✅ Extracted ${photoDetails.length} photo descriptions for ${page.type}`);

        const photoContext = photoDetails.length > 0
            ? `\n\nThe photos show these specific features: ${photoDetails.join('; ')}. Reference these exact details in your description.`
            : '';

        // Create comprehensive professional prompts with photo details
        const roomPrompts = {
            kitchen: `Write a comprehensive, professional description of the KITCHEN for this ${property.bedrooms || 3} bedroom ${property.type || 'house'} in ${property.address || 'this premium location'}. ${photoContext || 'Describe kitchen features in detail: appliances, worktops, storage, lighting, dining area, and any special features like islands, breakfast bars, or integrated appliances.'} Write 150-200 words in flowing paragraphs. Use sophisticated Savills tone - evocative, detailed, and aspirational. Compete with the best human copywriters.`,

            living: `Write a comprehensive, professional description of the LIVING SPACES for this property. ${photoContext || 'Describe the reception rooms in detail: proportions, natural light, period features, flooring, entertaining potential, views, and atmosphere.'} Write 150-200 words in flowing paragraphs. Use sophisticated Savills tone - paint a picture of how residents will live and entertain in these spaces. Compete with the best human copywriters.`,

            bedrooms: `Write a comprehensive, professional description of the BEDROOMS for this ${property.bedrooms || 3} bedroom property. ${photoContext || 'Describe each bedroom in detail: the principal bedroom with its proportions and ensuite, other bedrooms, built-in storage, light quality, and peaceful ambiance.'} Write 150-200 words in flowing paragraphs. Use sophisticated Savills tone - emphasize rest, comfort, and private sanctuary. Compete with the best human copywriters.`,

            bathrooms: `Write a comprehensive, professional description of the BATHROOMS for this property. ${photoContext || 'Describe bathroom specifications in detail: fixtures, finishes, tiling, lighting, style (contemporary/traditional), quality of fittings, and any special features like underfloor heating or rainfall showers.'} Write 120-150 words in flowing paragraphs. Use sophisticated Savills tone - emphasize luxury and attention to detail. Compete with the best human copywriters.`,

            garden: `Write a comprehensive, professional description of the OUTDOOR SPACES for this property. ${photoContext || 'Describe the gardens and exterior in detail: landscaping, mature planting, entertaining areas, terraces or patios, privacy, orientation for sun, and any special features like summer houses or water features.'} Write 150-200 words in flowing paragraphs. Use sophisticated Savills tone - emphasize outdoor lifestyle and connection to nature. Compete with the best human copywriters.`,

            location: `Write a comprehensive, professional description of the LOCATION for this property at ${property.address || 'this address'}. Describe the neighborhood character, local amenities (schools, shops, restaurants), transport links, community feel, and why this area is desirable. Write 150-200 words in flowing paragraphs. Use sophisticated Savills tone - sell the lifestyle and location. Compete with the best human copywriters.`,

            contact: `Write a professional closing statement inviting contact with Savills to arrange a viewing of this exceptional ${property.type || 'property'}. Be warm, welcoming, and emphasize Savills' expertise and service. 40-50 words.`
        };

        const systemPrompt = roomPrompts[page.type] || `Write a comprehensive professional description of ${page.title}. 150-200 words in flowing paragraphs. Use sophisticated Savills tone.`;

        console.log(`📝 Prompt for ${page.type}:`, systemPrompt.substring(0, 200) + '...');

        // Use NEW /generate/room endpoint for room-specific descriptions
        const response = await fetch('/generate/room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: systemPrompt,
                target_words: 180
            })
        });

        if (!response.ok) {
            console.warn(`⚠️ Failed to generate ${page.type} description:`, response.statusText);
            return null;
        }

        const result = await response.json();

        if (result.text) {
            console.log(`✅ Generated ${page.type} description (${result.text.length} chars, ${result.word_count} words)`);
            return result.text;
        }

        return null;

    } catch (error) {
        console.error(`❌ Failed to generate ${page.type} description:`, error);
        return null;
    }
}

function updateLoadingProgress(step, completed = false) {
    const stepEl = document.querySelector(`.step[data-step="${step}"]`);
    if (stepEl) {
        stepEl.classList.remove('active');
        if (completed) {
            stepEl.classList.add('completed');
        } else {
            stepEl.classList.add('active');
        }
    }

    // Update progress bar
    const totalSteps = 8; // session + 6 pages + rendering
    const completedSteps = document.querySelectorAll('.step.completed').length;
    const progress = (completedSteps / totalSteps) * 100;

    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${Math.round(progress)}%`;
}

async function generateAllPageDescriptions() {
    console.log('🤖 Generating AI descriptions for all pages IN PARALLEL...');

    EditorState.pageDescriptions = {};

    const pages = EditorState.sessionData?.pages || [];
    const contentPages = pages.filter(page => page.type !== 'cover');

    console.log(`📋 Found ${contentPages.length} content pages to generate`);

    // Mark all as active initially
    contentPages.forEach(page => updateLoadingProgress(page.type, false));

    // Generate ALL descriptions in parallel for speed
    const generationPromises = contentPages.map(async (page) => {
        try {
            const description = await generatePageSpecificDescription(page);

            if (description) {
                EditorState.pageDescriptions[page.id] = description;
                updateLoadingProgress(page.type, true);
                return { success: true, pageId: page.id, pageType: page.type };
            }

            updateLoadingProgress(page.type, true);
            return { success: false, pageId: page.id, pageType: page.type };

        } catch (error) {
            console.error(`❌ Failed to generate ${page.type}:`, error);
            updateLoadingProgress(page.type, true);
            return { success: false, pageId: page.id, pageType: page.type, error };
        }
    });

    // Wait for all generations to complete
    const results = await Promise.all(generationPromises);

    const successCount = results.filter(r => r.success).length;
    console.log(`✅ Generated descriptions for ${successCount}/${contentPages.length} pages in parallel`);

    return results;
}

async function loadSession() {
    console.log(`📂 Loading session ${EditorState.sessionId}...`);
    showLoading(true);
    updateLoadingProgress('session', false);

    try {
        const response = await fetch(`/api/brochure/session/${EditorState.sessionId}`);

        if (!response.ok) {
            throw new Error(`Failed to load session: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ Session loaded:', result);

        // Store session data
        EditorState.sessionData = result.data;
        EditorState.photoUrls = result.photo_urls || {};

        // Update UI
        updatePropertyAddress();

        updateLoadingProgress('session', true);

        // Generate AI descriptions for all pages
        await generateAllPageDescriptions();

        // Rendering phase
        updateLoadingProgress('rendering', false);
        renderPages();
        updateLoadingProgress('rendering', true);

        updateStatus('ready', 'Ready');

        // Enable buttons
        document.getElementById('saveBtn').disabled = false;
        document.getElementById('exportBtn').disabled = false;

        // Start auto-save
        startAutoSave();

        showLoading(false);

    } catch (error) {
        console.error('❌ Failed to load session:', error);
        showError('Failed to load brochure', error.message);
        updateStatus('error', 'Failed to load');
        showLoading(false);
    }
}

async function saveSession() {
    if (!EditorState.isDirty) {
        console.log('💾 No changes to save');
        showToast('No changes to save');
        return;
    }

    console.log('💾 Saving session...');
    updateStatus('loading', 'Saving...');

    try {
        // Extract current state from DOM
        updateSessionDataFromDOM();

        const response = await fetch(`/api/brochure/session/${EditorState.sessionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(EditorState.sessionData)
        });

        if (!response.ok) {
            throw new Error(`Failed to save: ${response.statusText}`);
        }

        console.log('✅ Session saved');
        EditorState.isDirty = false;
        updateStatus('ready', 'Saved');
        showToast('Changes saved successfully');

        // Reset status after 2 seconds
        setTimeout(() => {
            updateStatus('ready', 'Ready');
        }, 2000);

    } catch (error) {
        console.error('❌ Failed to save session:', error);
        updateStatus('error', 'Save failed');
        showError('Failed to save changes', error.message);
    }
}

function startAutoSave() {
    // Auto-save every 30 seconds if there are changes
    EditorState.autoSaveInterval = setInterval(() => {
        if (EditorState.isDirty) {
            console.log('🔄 Auto-save triggered');
            saveSession();
        }
    }, 30000); // 30 seconds
}

function stopAutoSave() {
    if (EditorState.autoSaveInterval) {
        clearInterval(EditorState.autoSaveInterval);
        EditorState.autoSaveInterval = null;
    }
}

// ============================================================================
// PAGE RENDERING
// ============================================================================

function renderPages() {
    console.log('🎨 Rendering pages...');

    const pageList = document.getElementById('pageList');
    const canvas = document.getElementById('brochureCanvas');

    pageList.innerHTML = '';
    canvas.innerHTML = '';

    if (!EditorState.sessionData || !EditorState.sessionData.pages) {
        console.warn('⚠️ No pages to render');
        return;
    }

    const pages = EditorState.sessionData.pages;

    console.log('📄 Pages to render:', pages.length, 'pages');
    pages.forEach((p, idx) => {
        console.log(`  Page ${idx + 1}: id=${p.id}, type=${p.type}, title=${p.title}`);
    });

    // Update page count
    document.getElementById('pageCount').textContent = `${pages.length} page${pages.length !== 1 ? 's' : ''}`;

    // Render each page
    pages.forEach((page, index) => {
        console.log(`🖼️ Rendering page ${index + 1} (type: ${page.type})`);
        renderPageListItem(page, index);
        renderPageCanvas(page, index);
    });

    // Select first page
    if (pages.length > 0) {
        selectPage(pages[0].id);
    }
}

function renderPageListItem(page, index) {
    const pageList = document.getElementById('pageList');

    const item = document.createElement('div');
    item.className = 'page-item';
    item.dataset.pageId = page.id;
    item.onclick = () => selectPage(page.id);

    item.innerHTML = `
        <div class="page-thumbnail">
            <span>Page ${index + 1}</span>
        </div>
        <div class="page-info">
            <div class="page-title">${page.title || 'Untitled'}</div>
            <div class="page-type">${page.type || 'general'}</div>
        </div>
    `;

    pageList.appendChild(item);
}

function renderPageCanvas(page, index) {
    const canvas = document.getElementById('brochureCanvas');

    const pageEl = document.createElement('div');
    pageEl.className = 'brochure-page';
    pageEl.dataset.pageId = page.id;
    pageEl.dataset.pageIndex = index;

    if (EditorState.showGuides) {
        pageEl.classList.add('show-guides');
    }

    // Render directly into pageEl (no wrapper needed)
    switch (page.type) {
        case 'cover':
            renderCoverPage(pageEl, page);
            break;
        case 'details':
            renderDetailsPage(pageEl, page);
            break;
        case 'gallery':
            renderGalleryPage(pageEl, page);
            break;
        case 'location':
            renderLocationPage(pageEl, page);
            break;
        default:
            renderGenericPage(pageEl, page);
    }

    canvas.appendChild(pageEl);
}

function renderCoverPage(container, page) {
    // Cover page: hero photo + headline + price with Savills branding
    const property = EditorState.sessionData.property || {};
    const headline = EditorState.generatedHeadline || page.title || property.address || 'Property Title';

    container.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column; position: relative;">
            ${renderPhotoSection(page.photos, '100%', '70%')}

            <!-- Savills Logo Header -->
            <div style="position: absolute; top: 20px; left: 20px; background: white; padding: 15px 25px; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <img src="/static/savills-logo.svg" alt="Savills" style="height: 40px; display: block;" onerror="this.style.display='none'; this.parentElement.innerHTML='<span style=\\'font-size: 28px; font-weight: 700; color: #C8102E;\\'>SAVILLS</span>';">
            </div>

            <!-- Property Info Section with Savills Colors -->
            <div style="flex: 1; padding: 30px 40px; display: flex; flex-direction: column; justify-content: center; background: linear-gradient(to bottom, rgba(200, 16, 46, 0.05), rgba(255, 213, 0, 0.1));">
                <h1 class="editable" contenteditable="true" data-field="title" style="font-size: 42px; font-weight: 700; color: #C8102E; margin-bottom: 15px; line-height: 1.2; text-shadow: 1px 1px 2px rgba(255,255,255,0.8);">
                    ${headline}
                </h1>
                <p class="editable" contenteditable="true" data-field="price" style="font-size: 32px; font-weight: 600; color: #2c3e50; margin: 0; background: rgba(255, 213, 0, 0.3); padding: 10px 20px; display: inline-block; border-left: 5px solid #C8102E;">
                    ${property.price || 'Price on Request'}
                </p>
            </div>
        </div>
    `;

    attachEditableListeners(container);
}

function renderDetailsPage(container, page) {
    // Details page: property description + key features
    const content = page.content || {};

    // Use AI-generated text if available, otherwise use page content or placeholder
    const description = EditorState.generatedText || content.description || 'Enter property description here...';
    const features = EditorState.generatedFeatures || content.features;

    console.log('🎨 Rendering details page with:', {
        hasGeneratedText: !!EditorState.generatedText,
        hasGeneratedFeatures: !!EditorState.generatedFeatures,
        descriptionLength: description?.length || 0,
        featuresCount: features?.length || 0
    });

    container.innerHTML = `
        <div style="width: 100%; height: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="display: flex; flex-direction: column; gap: 20px;">
                <div>
                    <h2 style="font-size: 28px; font-weight: 700; color: var(--savills-red); margin-bottom: 15px; border-bottom: 3px solid var(--savills-yellow); padding-bottom: 10px;">Property Details</h2>
                    <div class="editable" contenteditable="true" data-field="description" style="font-size: 14px; line-height: 1.8; color: #2c3e50; font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;">
                        ${description}
                    </div>
                </div>
                <div>
                    <h3 style="font-size: 20px; font-weight: 600; color: var(--savills-red); margin-bottom: 10px; border-bottom: 2px solid var(--savills-yellow); padding-bottom: 8px;">Key Features</h3>
                    <div class="editable" contenteditable="true" data-field="features" style="font-size: 14px; line-height: 2; color: #2c3e50;">
                        ${renderFeaturesList(features)}
                    </div>
                </div>
            </div>
            <div>
                ${renderPhotoSection(page.photos, '100%', '100%')}
            </div>
        </div>
    `;

    attachEditableListeners(container);
}

function renderGalleryPage(container, page) {
    // Gallery page: grid of photos with Savills branding
    const photoCount = page.photos ? page.photos.length : 0;

    if (photoCount === 0) {
        container.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 16px;">
                No photos assigned to this page
            </div>
        `;
        return;
    }

    // Determine grid layout based on photo count
    // For landscape A4 (297mm x 210mm), use layouts that respect landscape photo aspect ratios
    let gridTemplate = 'repeat(2, 1fr)';
    let gridRows = 'auto';
    if (photoCount === 1) {
        gridTemplate = '1fr';
        gridRows = '1fr';
    } else if (photoCount === 2) {
        gridTemplate = 'repeat(2, 1fr)';
        gridRows = '1fr';
    } else if (photoCount === 3) {
        gridTemplate = 'repeat(2, 1fr)';
        gridRows = 'repeat(2, 1fr)';
    } else {
        gridTemplate = 'repeat(2, 1fr)';
        gridRows = 'repeat(2, 1fr)';
    }

    container.innerHTML = `
        <div>
            <h2 class="editable" contenteditable="true" data-field="title" style="font-size: 28px; font-weight: 700; color: var(--savills-red); margin-bottom: 20px; border-bottom: 3px solid var(--savills-yellow); padding-bottom: 10px;">${page.title || 'Photo Gallery'}</h2>
            <div style="display: grid; grid-template-columns: ${gridTemplate}; grid-template-rows: ${gridRows}; gap: 15px; height: calc(100% - 60px);">
                ${page.photos.map(photo => renderPhotoElement(photo, '100%', '100%')).join('')}
            </div>
        </div>
    `;

    attachEditableListeners(container);
}

function renderLocationPage(container, page) {
    // Location page: area description + amenities with Savills branding
    const content = page.content || {};

    container.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; flex-direction: column; gap: 20px;">
            <div>
                <h2 class="editable" contenteditable="true" data-field="title" style="font-size: 28px; font-weight: 700; color: var(--savills-red); margin-bottom: 15px; border-bottom: 3px solid var(--savills-yellow); padding-bottom: 10px;">${page.title || 'Location & Area'}</h2>
                <div class="editable" contenteditable="true" data-field="location_description" style="font-size: 14px; line-height: 1.8; color: #2c3e50;">
                    ${content.location_description || 'Enter location description here...'}
                </div>
            </div>
            ${renderPhotoSection(page.photos, '100%', 'auto')}
        </div>
    `;

    attachEditableListeners(container);
}

function renderGenericPage(container, page) {
    // Generic page: title + content + photos with Savills branding
    const content = page.content || {};

    // Use page-specific AI-generated text if available
    const description = EditorState.pageDescriptions[page.id]
        || content.text
        || content.description
        || 'Click to edit this description...';

    console.log('🎨 Rendering generic page:', {
        pageId: page.id,
        pageType: page.type,
        hasAIText: !!EditorState.pageDescriptions[page.id],
        descriptionLength: description?.length || 0
    });

    const photoCount = page.photos?.length || 0;
    const savedLayout = EditorState.pageLayouts[page.id] || 'auto';
    const photoGap = EditorState.photoGaps?.[page.id] || 0;

    let layoutHTML = '';

    switch (savedLayout) {
        case 'text-top':
            // Text above, photos below - natural flow, no height constraints
            layoutHTML = `
                <div style="width: 100%; display: flex; flex-direction: column; gap: 20px; padding: 20px; box-sizing: border-box;">
                    <div>
                        <h2 class="editable" contenteditable="true" data-field="title" style="font-size: 28px; font-weight: 700; color: var(--savills-red); margin: 0 0 10px 0; border-bottom: 3px solid var(--savills-yellow); padding-bottom: 8px;">
                            ${page.title || 'Page Title'}
                        </h2>
                        <div class="editable" contenteditable="true" data-field="description" style="font-size: 13px; line-height: 1.7; color: #2c3e50;">
                            ${description}
                        </div>
                    </div>
                    <div style="position: relative; min-height: 400px;">
                        ${renderLayoutControls(page.id)}
                        ${renderPhotoSection(page.photos, '100%', 'auto', 'text-top', page.id)}
                    </div>
                </div>
            `;
            break;

        case 'photo-right':
            // Text left, ALL photos displayed in grid on right - natural flow
            layoutHTML = `
                <div style="width: 100%; display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; padding: 20px; box-sizing: border-box; align-items: start;">
                    <div>
                        <h2 class="editable" contenteditable="true" data-field="title" style="font-size: 28px; font-weight: 700; color: var(--savills-red); margin: 0 0 10px 0; border-bottom: 3px solid var(--savills-yellow); padding-bottom: 8px;">
                            ${page.title || 'Page Title'}
                        </h2>
                        <div class="editable" contenteditable="true" data-field="description" style="font-size: 14px; line-height: 1.8; color: #2c3e50;">
                            ${description}
                        </div>
                    </div>
                    <div style="position: relative; min-height: 400px;">
                        ${renderLayoutControls(page.id)}
                        ${renderPhotoSection(page.photos, '100%', 'auto', 'photo-right', page.id)}
                    </div>
                </div>
            `;
            break;

        case 'magazine':
            // Magazine layout - Interleaved 2x2 grid matching diagram
            const mainPhoto = page.photos[0];
            const secondPhoto = page.photos[1];

            // Split description into two roughly equal parts
            const sentences = description.match(/[^.!?]+[.!?]+/g) || [description];
            const midpoint = Math.floor(sentences.length / 2);
            const firstHalf = sentences.slice(0, midpoint).join(' ').trim();
            const secondHalf = sentences.slice(midpoint).join(' ').trim();

            // Get photo URL helper
            const getPhotoUrl = (photo) => {
                return EditorState.photoUrls[photo.id] || photo.dataUrl || '';
            };

            layoutHTML = `
                ${renderLayoutControls(page.id)}

                <h2 class="page-title editable" contenteditable="true" data-field="title">
                    ${page.title || 'Page Title'}
                </h2>

                <div class="layout-magazine">
                    <div class="layout-magazine-text1 page-text-sm editable" contenteditable="true" data-field="description-part1">
                        ${firstHalf}
                    </div>
                    <div class="layout-magazine-photo1">
                        ${mainPhoto ? `<div class="layout-photo"><img src="${getPhotoUrl(mainPhoto)}" alt="${mainPhoto.caption || 'Property photo'}" loading="lazy"></div>` : '<div class="layout-photo"></div>'}
                    </div>
                    <div class="layout-magazine-text2 page-text-sm editable" contenteditable="true" data-field="description-part2">
                        ${secondHalf}
                    </div>
                    <div class="layout-magazine-photo2">
                        ${secondPhoto ? `<div class="layout-photo"><img src="${getPhotoUrl(secondPhoto)}" alt="${secondPhoto.caption || 'Property photo'}" loading="lazy"></div>` : '<div class="layout-photo"></div>'}
                    </div>
                </div>
            `;
            break;

        case 'hero':
            // Hero layout - Large hero photo at top, text below
            const heroPhoto = page.photos[0];

            layoutHTML = `
                ${renderLayoutControls(page.id)}

                <div class="layout-hero">
                    ${heroPhoto ? `<div class="layout-photo"><img src="${EditorState.photoUrls[heroPhoto.id] || heroPhoto.dataUrl || ''}" alt="${heroPhoto.caption || 'Property photo'}" loading="lazy"></div>` : '<div class="layout-photo"></div>'}

                    <div>
                        <h2 class="page-title editable" contenteditable="true" data-field="title">
                            ${page.title || 'Page Title'}
                        </h2>
                        <div class="page-text editable" contenteditable="true" data-field="description">
                            ${description}
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'photos-only':
            // Photos-only layout - Pure photo showcase
            const poPhotos = page.photos;
            const poCount = poPhotos.length;
            let poCountClass = 'count-1';
            if (poCount === 2) poCountClass = 'count-2';
            else if (poCount >= 3 && poCount <= 4) poCountClass = 'count-4';
            else if (poCount >= 5) poCountClass = 'count-5plus';

            layoutHTML = `
                ${renderLayoutControls(page.id)}

                <div class="layout-photos-only ${poCountClass}">
                    ${poPhotos.map(photo => {
                        const photoUrl = EditorState.photoUrls[photo.id] || photo.dataUrl || '';
                        return `<div class="layout-photo"><img src="${photoUrl}" alt="${photo.caption || 'Property photo'}" loading="lazy"></div>`;
                    }).join('')}
                </div>
            `;
            break;

        case 'reverse-l':
            // Reverse-L layout - Text top-left, 3 photos in L shape
            const rlPhoto1 = page.photos[0];
            const rlPhoto2 = page.photos[1];
            const rlPhoto3 = page.photos[2];

            layoutHTML = `

                    ${renderLayoutControls(page.id)}

                    <h2 class="page-title editable" contenteditable="true" data-field="title">
                        ${page.title || 'Page Title'}
                    </h2>

                    <div class="layout-reverse-l">
                        <div class="layout-reverse-l-text page-text-sm editable" contenteditable="true" data-field="description">
                            ${description}
                        </div>

                        ${rlPhoto1 ? `<div class="layout-photo photo-1"><img src="${EditorState.photoUrls[rlPhoto1.id] || rlPhoto1.dataUrl || ''}" alt="${rlPhoto1.caption || 'Property photo'}" loading="lazy"></div>` : '<div class="layout-photo photo-1"></div>'}

                        ${rlPhoto2 ? `<div class="layout-photo photo-2"><img src="${EditorState.photoUrls[rlPhoto2.id] || rlPhoto2.dataUrl || ''}" alt="${rlPhoto2.caption || 'Property photo'}" loading="lazy"></div>` : '<div class="layout-photo photo-2"></div>'}

                        ${rlPhoto3 ? `<div class="layout-photo photo-3"><img src="${EditorState.photoUrls[rlPhoto3.id] || rlPhoto3.dataUrl || ''}" alt="${rlPhoto3.caption || 'Property photo'}" loading="lazy"></div>` : '<div class="layout-photo photo-3"></div>'}
                    </div>
                </div>
            `;
            break;

        case 'l-shape':
            // L-Shape layout - Large photo left, text and 2 photos right
            const lPhoto1 = page.photos[0];
            const lPhoto2 = page.photos[1];
            const lPhoto3 = page.photos[2];

            layoutHTML = `

                    ${renderLayoutControls(page.id)}

                    <h2 class="page-title editable" contenteditable="true" data-field="title">
                        ${page.title || 'Page Title'}
                    </h2>

                    <div class="layout-l-shape">
                        ${lPhoto1 ? `<div class="layout-photo photo-1"><img src="${EditorState.photoUrls[lPhoto1.id] || lPhoto1.dataUrl || ''}" alt="${lPhoto1.caption || 'Property photo'}" loading="lazy"></div>` : '<div class="layout-photo photo-1"></div>'}

                        <div class="layout-l-shape-text page-text-sm editable" contenteditable="true" data-field="description">
                            ${description}
                        </div>

                        <div class="layout-l-shape-photos-bottom">
                            ${lPhoto2 ? `<div class="layout-photo"><img src="${EditorState.photoUrls[lPhoto2.id] || lPhoto2.dataUrl || ''}" alt="${lPhoto2.caption || 'Property photo'}" loading="lazy"></div>` : '<div class="layout-photo"></div>'}
                            ${lPhoto3 ? `<div class="layout-photo"><img src="${EditorState.photoUrls[lPhoto3.id] || lPhoto3.dataUrl || ''}" alt="${lPhoto3.caption || 'Property photo'}" loading="lazy"></div>` : '<div class="layout-photo"></div>'}
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'split':
            // Split layout - Perfect 50/50 text and photo
            const splitPhoto = page.photos[0];

            layoutHTML = `

                    ${renderLayoutControls(page.id)}

                    <h2 class="page-title editable" contenteditable="true" data-field="title">
                        ${page.title || 'Page Title'}
                    </h2>

                    <div class="layout-split">
                        <div class="layout-split-text page-text editable" contenteditable="true" data-field="description">
                            ${description}
                        </div>

                        ${splitPhoto ? `<div class="layout-photo"><img src="${EditorState.photoUrls[splitPhoto.id] || splitPhoto.dataUrl || ''}" alt="${splitPhoto.caption || 'Property photo'}" loading="lazy"></div>` : '<div class="layout-photo"></div>'}
                    </div>
                </div>
            `;
            break;

        case 'mosaic':
            // Mosaic layout - Asymmetric photo grid
            const mosaicPhotos = page.photos;
            let mosaicGrid = '';

            if (mosaicPhotos.length === 3) {
                // 3 photos: 1 large left, 2 stacked right
                mosaicGrid = `
                    <div class="layout-mosaic-3">
                        ${mosaicPhotos[0] ? `<div class="layout-photo photo-1"><img src="${EditorState.photoUrls[mosaicPhotos[0].id] || mosaicPhotos[0].dataUrl || ''}" alt="${mosaicPhotos[0].caption || 'Property photo'}" loading="lazy"></div>` : '<div class="layout-photo photo-1"></div>'}
                        ${mosaicPhotos[1] ? `<div class="layout-photo"><img src="${EditorState.photoUrls[mosaicPhotos[1].id] || mosaicPhotos[1].dataUrl || ''}" alt="${mosaicPhotos[1].caption || 'Property photo'}" loading="lazy"></div>` : '<div class="layout-photo"></div>'}
                        ${mosaicPhotos[2] ? `<div class="layout-photo"><img src="${EditorState.photoUrls[mosaicPhotos[2].id] || mosaicPhotos[2].dataUrl || ''}" alt="${mosaicPhotos[2].caption || 'Property photo'}" loading="lazy"></div>` : '<div class="layout-photo"></div>'}
                    </div>
                `;
            } else if (mosaicPhotos.length === 4) {
                // 4 photos: 2x2 grid with varying sizes
                mosaicGrid = `
                    <div class="layout-mosaic-4">
                        ${mosaicPhotos[0] ? `<div class="layout-photo"><img src="${EditorState.photoUrls[mosaicPhotos[0].id] || mosaicPhotos[0].dataUrl || ''}" alt="${mosaicPhotos[0].caption || 'Property photo'}" loading="lazy"></div>` : '<div class="layout-photo"></div>'}
                        ${mosaicPhotos[1] ? `<div class="layout-photo photo-2"><img src="${EditorState.photoUrls[mosaicPhotos[1].id] || mosaicPhotos[1].dataUrl || ''}" alt="${mosaicPhotos[1].caption || 'Property photo'}" loading="lazy"></div>` : '<div class="layout-photo photo-2"></div>'}
                        ${mosaicPhotos[2] ? `<div class="layout-photo"><img src="${EditorState.photoUrls[mosaicPhotos[2].id] || mosaicPhotos[2].dataUrl || ''}" alt="${mosaicPhotos[2].caption || 'Property photo'}" loading="lazy"></div>` : '<div class="layout-photo"></div>'}
                        ${mosaicPhotos[3] ? `<div class="layout-photo"><img src="${EditorState.photoUrls[mosaicPhotos[3].id] || mosaicPhotos[3].dataUrl || ''}" alt="${mosaicPhotos[3].caption || 'Property photo'}" loading="lazy"></div>` : '<div class="layout-photo"></div>'}
                    </div>
                `;
            } else {
                // 5+ photos: mixed grid
                mosaicGrid = `
                    <div class="layout-mosaic-5plus">
                        ${mosaicPhotos.map(photo => {
                            const photoUrl = EditorState.photoUrls[photo.id] || photo.dataUrl || '';
                            return `<div class="layout-photo"><img src="${photoUrl}" alt="${photo.caption || 'Property photo'}" loading="lazy"></div>`;
                        }).join('')}
                    </div>
                `;
            }

            layoutHTML = `

                    ${renderLayoutControls(page.id)}

                    <h2 class="page-title editable" contenteditable="true" data-field="title">
                        ${page.title || 'Page Title'}
                    </h2>

                    <div class="page-text editable" contenteditable="true" data-field="description">
                        ${description}
                    </div>

                    ${mosaicGrid}
                </div>
            `;
            break;

        case 'auto':
        default:
            // Auto layout - Adaptive two-column layout
            const autoPhotos = page.photos;
            const autoCount = autoPhotos.length;

            // Determine grid class based on photo count
            let autoLayoutClass = 'layout-auto';
            if (autoCount === 1) autoLayoutClass += ' photos-1';
            else if (autoCount >= 3) autoLayoutClass += ' photos-3plus';

            // Determine photo grid class
            let autoPhotoClass = 'layout-auto-photos';
            if (autoCount === 1) autoPhotoClass += ' count-1';
            else if (autoCount === 2) autoPhotoClass += ' count-2';
            else if (autoCount >= 3 && autoCount <= 4) autoPhotoClass += ' count-4';
            else if (autoCount >= 5) autoPhotoClass += ' count-5plus';

            layoutHTML = `

                    ${renderLayoutControls(page.id)}

                    <h2 class="page-title editable" contenteditable="true" data-field="title">
                        ${page.title || 'Page Title'}
                    </h2>

                    <div class="${autoLayoutClass}">
                        <div class="layout-auto-text page-text editable" contenteditable="true" data-field="description">
                            ${description}
                        </div>

                        <div class="${autoPhotoClass}">
                            ${autoPhotos.map(photo => {
                                const photoUrl = EditorState.photoUrls[photo.id] || photo.dataUrl || '';
                                return `<div class="layout-photo"><img src="${photoUrl}" alt="${photo.caption || 'Property photo'}" loading="lazy"></div>`;
                            }).join('')}
                        </div>
                    </div>
                </div>
            `;
            break;
    }

    container.innerHTML = layoutHTML;
    attachEditableListeners(container);
    attachLayoutControlListeners(page.id);
}

// ============================================================================
// PHOTO RENDERING HELPERS
// ============================================================================

function renderPhotoSection(photos, width = '100%', height = 'auto', layout = 'auto', pageId = null) {
    if (!photos || photos.length === 0) {
        return '';
    }

    const photoCount = photos.length;
    let gridCols = '1fr';
    let gridRows = 'auto';  // Use auto for flexible heights

    // Get saved layout preference and gap for this page
    const savedLayout = pageId ? EditorState.pageLayouts[pageId] : null;
    const activeLayout = savedLayout || layout;
    const photoGap = pageId ? (EditorState.photoGaps[pageId] || 0) : 0;

    // Determine grid layout based on mode and photo count
    switch (activeLayout) {
        case 'text-top':
            // Horizontal row of photos with auto height
            gridCols = `repeat(${Math.min(photoCount, 3)}, 1fr)`;
            gridRows = 'auto';
            break;
        case 'hero':
            // Single large photo with auto height
            gridCols = '1fr';
            gridRows = 'auto';
            break;
        case 'photo-right':
            // Photos in right column - stack vertically or grid
            if (photoCount === 1) {
                gridCols = '1fr';
                gridRows = '1fr';
            } else if (photoCount === 2) {
                gridCols = '1fr';
                gridRows = '1fr 1fr';
            } else {
                // 3+ photos: 2 column grid
                gridCols = 'repeat(2, 1fr)';
                gridRows = `repeat(${Math.ceil(photoCount / 2)}, 1fr)`;
            }
            break;
        case 'magazine':
            // Magazine layout - not used in renderPhotoSection (handled in applyLayout)
            gridCols = '1fr';
            gridRows = 'auto';
            break;
        case 'photos-only':
            // Photos Only layout - equal grid squares
            if (photoCount === 1) {
                gridCols = '1fr';
                gridRows = '1fr';
            } else if (photoCount === 2) {
                gridCols = 'repeat(2, 1fr)';
                gridRows = '1fr';
            } else if (photoCount === 3) {
                gridCols = 'repeat(2, 1fr)';
                gridRows = '1fr 1fr';
            } else if (photoCount === 4) {
                gridCols = 'repeat(2, 1fr)';
                gridRows = '1fr 1fr';
            } else {
                // 5+ photos: 2 column grid
                gridCols = 'repeat(2, 1fr)';
                gridRows = `repeat(${Math.ceil(photoCount / 2)}, 1fr)`;
            }
            break;
        case 'reverse-l':
        case 'l-shape':
        case 'split':
        case 'mosaic':
            // These layouts are not used in renderPhotoSection (handled in applyLayout)
            gridCols = '1fr';
            gridRows = 'auto';
            break;
        case 'auto':
        default:
            // Auto mode - intelligent grid with flexible heights
            if (photoCount === 1) {
                // Single photo: full width
                gridCols = '1fr';
                gridRows = 'auto';
            } else if (photoCount === 2) {
                // Two photos: stack vertically (one above the other)
                gridCols = '1fr';
                gridRows = 'auto auto';
            } else if (photoCount >= 3 && photoCount <= 4) {
                // 3-4 photos: 2x2 grid
                gridCols = 'repeat(2, 1fr)';
                gridRows = 'auto auto';
            } else {
                // 5+ photos: 2 column grid, multiple rows
                gridCols = 'repeat(2, 1fr)';
                gridRows = `repeat(${Math.ceil(photoCount / 2)}, auto)`;
            }
            break;
    }

    // Use the user-configured gap spacing
    const gridHeight = height === 'auto' ? 'auto' : (height === '100%' ? '100%' : height);

    return `
        <div class="photo-grid" data-page-id="${pageId || ''}" data-layout="${activeLayout}"
             style="width: ${width}; height: ${gridHeight}; display: grid;
                    grid-template-columns: ${gridCols}; grid-template-rows: ${gridRows};
                    gap: ${photoGap}px; box-sizing: border-box;">
            ${photos.map(photo => renderPhotoElement(photo, '100%', 'auto')).join('')}
        </div>
    `;
}

function renderPhotoElement(photo, width = '100%', height = 'auto') {
    // Get photo URL from session photo URLs mapping
    const photoUrl = EditorState.photoUrls[photo.id] || photo.dataUrl || '';

    if (!photoUrl) {
        return `
            <div class="photo-element" style="display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 12px;">
                Photo not available
            </div>
        `;
    }

    return `
        <div class="photo-element" data-photo-id="${photo.id}">
            <img src="${photoUrl}"
                 alt="${photo.caption || photo.name || 'Property photo'}"
                 loading="lazy">
            ${photo.caption ? `<div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 8px; background: rgba(0,0,0,0.6); color: white; font-size: 12px; z-index: 1;">${photo.caption}</div>` : ''}
        </div>
    `;
}

function renderFeaturesList(features) {
    if (!features || !Array.isArray(features)) {
        return '• Feature 1<br>• Feature 2<br>• Feature 3';
    }

    return features.map(f => `• ${f}`).join('<br>');
}

// ============================================================================
// LAYOUT PICKER PANEL
// ============================================================================

// SVG diagram generators for each layout
const layoutDiagrams = {
    'auto': `<svg class="layout-diagram" viewBox="0 0 100 80">
        <rect class="text-block" x="5" y="5" width="45" height="70" rx="3"/>
        <rect class="photo-block" x="55" y="5" width="40" height="32" rx="3"/>
        <rect class="photo-block" x="55" y="43" width="40" height="32" rx="3"/>
    </svg>`,

    'text-top': `<svg class="layout-diagram" viewBox="0 0 100 80">
        <rect class="text-block" x="5" y="5" width="90" height="30" rx="3"/>
        <rect class="photo-block" x="5" y="40" width="25" height="35" rx="3"/>
        <rect class="photo-block" x="35" y="40" width="25" height="35" rx="3"/>
        <rect class="photo-block" x="65" y="40" width="30" height="35" rx="3"/>
    </svg>`,

    'photo-right': `<svg class="layout-diagram" viewBox="0 0 100 80">
        <rect class="text-block" x="5" y="5" width="50" height="70" rx="3"/>
        <rect class="photo-block" x="60" y="5" width="35" height="70" rx="3"/>
    </svg>`,

    'magazine': `<svg class="layout-diagram" viewBox="0 0 100 80">
        <rect class="text-block" x="5" y="5" width="42" height="32" rx="3"/>
        <rect class="photo-block" x="53" y="5" width="42" height="32" rx="3"/>
        <rect class="text-block" x="5" y="43" width="42" height="32" rx="3"/>
        <rect class="photo-block" x="53" y="43" width="42" height="32" rx="3"/>
    </svg>`,

    'hero': `<svg class="layout-diagram" viewBox="0 0 100 80">
        <rect class="photo-block" x="5" y="5" width="90" height="45" rx="3"/>
        <rect class="text-block" x="5" y="55" width="90" height="20" rx="3"/>
    </svg>`,

    'photos-only': `<svg class="layout-diagram" viewBox="0 0 100 80">
        <rect class="photo-block" x="5" y="5" width="42" height="35" rx="3"/>
        <rect class="photo-block" x="53" y="5" width="42" height="35" rx="3"/>
        <rect class="photo-block" x="5" y="45" width="42" height="30" rx="3"/>
        <rect class="photo-block" x="53" y="45" width="42" height="30" rx="3"/>
    </svg>`,

    'reverse-l': `<svg class="layout-diagram" viewBox="0 0 100 80">
        <rect class="text-block" x="5" y="5" width="42" height="35" rx="3"/>
        <rect class="photo-block" x="53" y="5" width="42" height="16" rx="3"/>
        <rect class="photo-block" x="53" y="24" width="42" height="16" rx="3"/>
        <rect class="photo-block" x="5" y="45" width="42" height="30" rx="3"/>
    </svg>`,

    'l-shape': `<svg class="layout-diagram" viewBox="0 0 100 80">
        <rect class="photo-block" x="5" y="5" width="42" height="70" rx="3"/>
        <rect class="text-block" x="53" y="5" width="42" height="30" rx="3"/>
        <rect class="photo-block" x="53" y="40" width="19" height="35" rx="3"/>
        <rect class="photo-block" x="76" y="40" width="19" height="35" rx="3"/>
    </svg>`,

    'split': `<svg class="layout-diagram" viewBox="0 0 100 80">
        <rect class="text-block" x="5" y="5" width="42" height="70" rx="3"/>
        <rect class="photo-block" x="53" y="5" width="42" height="70" rx="3"/>
    </svg>`,

    'mosaic': `<svg class="layout-diagram" viewBox="0 0 100 80">
        <rect class="photo-block" x="5" y="5" width="48" height="70" rx="3"/>
        <rect class="photo-block" x="57" y="5" width="38" height="32" rx="3"/>
        <rect class="photo-block" x="57" y="43" width="38" height="32" rx="3"/>
    </svg>`
};

// Render layout picker panel
function renderLayoutPicker() {
    const currentPageId = EditorState.currentPage;
    console.log('🎨 renderLayoutPicker called for page:', currentPageId);

    if (!currentPageId) {
        console.warn('⚠️ No current page ID');
        return;
    }

    const page = EditorState.sessionData.pages.find(p => p.id === currentPageId);
    if (!page) {
        console.warn('⚠️ Page not found:', currentPageId);
        return;
    }

    const currentLayout = EditorState.pageLayouts[currentPageId] || 'auto';
    const currentGap = EditorState.photoGaps[currentPageId] || 0;
    console.log('📐 Current layout for page', currentPageId, ':', currentLayout);

    // Determine if this is the cover/first page
    const pageIndex = EditorState.sessionData.pages.findIndex(p => p.id === currentPageId);
    const isCoverPage = pageIndex === 0;

    // Get photo count for current page
    const photoCount = page.photos?.length || 0;
    console.log('📸 Photo count for page', currentPageId, ':', photoCount);

    // Filter layouts based on photo count
    let layouts = [];

    if (photoCount === 0) {
        // No photos: only show Auto (which handles text-only gracefully)
        layouts = [
            { key: 'auto', name: 'Auto' }
        ];
    } else if (photoCount === 1) {
        // Single photo: Auto, Split, Photos Only, and Hero (if cover)
        layouts = [
            { key: 'auto', name: 'Auto' },
            { key: 'split', name: 'Split' },
            { key: 'photos-only', name: 'Photos Only' }
        ];
        if (isCoverPage) {
            layouts.push({ key: 'hero', name: 'Hero' });
        }
    } else if (photoCount === 2) {
        // Two photos: show most layouts (Split works with 1 photo, Magazine needs 2, L-Shape/Reverse L/Mosaic need 3+)
        layouts = [
            { key: 'auto', name: 'Auto' },
            { key: 'split', name: 'Split' },
            { key: 'text-top', name: 'Text Top' },
            { key: 'photo-right', name: 'Photo Right' },
            { key: 'magazine', name: 'Magazine' },
            { key: 'photos-only', name: 'Photos Only' }
        ];
        if (isCoverPage) {
            layouts.push({ key: 'hero', name: 'Hero' });
        }
    } else {
        // Three or more photos: show ALL layouts
        layouts = [
            { key: 'auto', name: 'Auto' },
            { key: 'split', name: 'Split' },
            { key: 'text-top', name: 'Text Top' },
            { key: 'photo-right', name: 'Photo Right' },
            { key: 'magazine', name: 'Magazine' },
            { key: 'reverse-l', name: 'Reverse L' },
            { key: 'l-shape', name: 'L-Shape' },
            { key: 'mosaic', name: 'Mosaic' },
            { key: 'photos-only', name: 'Photos Only' }
        ];
        if (isCoverPage) {
            layouts.push({ key: 'hero', name: 'Hero' });
        }
    }

    const layoutCardsHTML = layouts.map(layout => `
        <div class="layout-preview-card ${currentLayout === layout.key ? 'active' : ''}"
             data-layout="${layout.key}"
             data-page-id="${currentPageId}">
            <div class="layout-preview-visual">
                ${layoutDiagrams[layout.key]}
            </div>
            <div class="layout-preview-label">${layout.name}</div>
        </div>
    `).join('');

    // Photo gap control
    const gapControlHTML = `
        <div style="padding: 15px; border-top: 2px solid #e5e7eb; background: #f9fafb;">
            <label style="display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 8px;">
                Photo Spacing
            </label>
            <div style="display: flex; align-items: center; gap: 10px;">
                <input type="range" id="photoGapSlider"
                       min="0" max="30" step="5" value="${currentGap}"
                       style="flex: 1; height: 4px; border-radius: 2px; outline: none; cursor: pointer;"
                       data-page-id="${currentPageId}">
                <span id="gapValue" style="font-size: 12px; font-weight: 600; color: #6b7280; min-width: 35px;">${currentGap}px</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 10px; color: #9ca3af;">
                <span>Flush</span>
                <span>Wide</span>
            </div>
        </div>
    `;

    const pickerContent = document.getElementById('layoutPickerContent');
    if (pickerContent) {
        pickerContent.innerHTML = layoutCardsHTML + gapControlHTML;
        attachLayoutPickerListeners();
        attachGapControlListener();
        console.log('✅ Layout picker rendered with', layouts.length, 'options');
    }
}

// Attach click listeners to layout cards
function attachLayoutPickerListeners() {
    const cards = document.querySelectorAll('.layout-preview-card');
    console.log('🔗 Attaching listeners to', cards.length, 'layout cards');

    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            const layout = card.dataset.layout;
            const pageId = card.dataset.pageId;
            console.log('🖱️ Layout card clicked - Layout:', layout, 'PageID:', pageId);
            console.log('📊 Current EditorState.currentPage:', EditorState.currentPage);

            if (layout && pageId) {
                console.log('✅ Calling changePageLayout for page', pageId, 'with layout', layout);
                changePageLayout(pageId, layout);
                renderLayoutPicker(); // Re-render to update active state
            } else {
                console.error('❌ Missing layout or pageId!');
            }
        });
    });
}

// Attach listener to photo gap slider
function attachGapControlListener() {
    const slider = document.getElementById('photoGapSlider');
    const gapValue = document.getElementById('gapValue');

    if (!slider) return;

    slider.addEventListener('input', (e) => {
        const pageId = slider.dataset.pageId;
        const gap = parseInt(e.target.value);

        // Update display
        gapValue.textContent = `${gap}px`;

        // Save to state
        EditorState.photoGaps[pageId] = gap;
        EditorState.isDirty = true;

        console.log(`📏 Photo gap changed for page ${pageId}: ${gap}px`);

        // Re-render the page to apply new gap
        const page = EditorState.sessionData.pages.find(p => p.id === pageId);
        if (page) {
            const pageEl = document.querySelector(`.brochure-page[data-page-id="${pageId}"]`);
            if (pageEl) {
                renderGenericPage(pageEl, page);
            }
        }
    });
}

// ============================================================================
// LAYOUT CONTROLS (INLINE BUTTONS ON PAGE)
// ============================================================================

function renderLayoutControls(pageId) {
    return `
        <div class="layout-controls" style="position: absolute; top: -35px; right: 0; display: flex; gap: 5px; background: white; padding: 5px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); z-index: 10; flex-wrap: wrap; max-width: 300px;">
            <button class="layout-btn" data-layout="auto" data-page-id="${pageId}" title="Auto Layout" style="padding: 5px 8px; border: 1px solid #e5e7eb; background: white; border-radius: 4px; cursor: pointer; font-size: 11px; color: #6b7280;">
                Auto
            </button>
            <button class="layout-btn" data-layout="text-top" data-page-id="${pageId}" title="Text Above Photos" style="padding: 5px 8px; border: 1px solid #e5e7eb; background: white; border-radius: 4px; cursor: pointer; font-size: 11px; color: #6b7280;">
                Text Top
            </button>
            <button class="layout-btn" data-layout="photo-right" data-page-id="${pageId}" title="Large Photo Right" style="padding: 5px 8px; border: 1px solid #e5e7eb; background: white; border-radius: 4px; cursor: pointer; font-size: 11px; color: #6b7280;">
                Photo Right
            </button>
            <button class="layout-btn" data-layout="magazine" data-page-id="${pageId}" title="Magazine Style" style="padding: 5px 8px; border: 1px solid #e5e7eb; background: white; border-radius: 4px; cursor: pointer; font-size: 11px; color: #6b7280;">
                Magazine
            </button>
            <button class="layout-btn" data-layout="hero" data-page-id="${pageId}" title="Hero Photo" style="padding: 5px 8px; border: 1px solid #e5e7eb; background: white; border-radius: 4px; cursor: pointer; font-size: 11px; color: #6b7280;">
                Hero
            </button>
        </div>
    `;
}

function attachLayoutControlListeners(pageId) {
    // Wait for next tick to ensure buttons are in DOM
    setTimeout(() => {
        const buttons = document.querySelectorAll(`.layout-btn[data-page-id="${pageId}"]`);
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const layout = btn.dataset.layout;
                changePageLayout(pageId, layout);
            });
        });
    }, 0);
}

function changePageLayout(pageId, layout) {
    console.log(`🎨 Changing layout for page ${pageId} to ${layout}`);

    // Save layout preference
    EditorState.pageLayouts[pageId] = layout;
    EditorState.isDirty = true;

    // Find the page in session data
    const page = EditorState.sessionData.pages.find(p => p.id === pageId);
    if (!page) return;

    // Re-render the page
    const pageEl = document.querySelector(`.brochure-page[data-page-id="${pageId}"]`);
    if (pageEl) {
        renderGenericPage(pageEl, page);
    }
}

// ============================================================================
// PAGE SELECTION & NAVIGATION
// ============================================================================

function selectPage(pageId) {
    console.log(`📄 Selecting page: ${pageId}`);

    // Update sidebar
    document.querySelectorAll('.page-item').forEach(item => {
        item.classList.toggle('active', item.dataset.pageId === pageId);
    });

    // Scroll to page in canvas
    const pageEl = document.querySelector(`.brochure-page[data-page-id="${pageId}"]`);
    if (pageEl) {
        pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        EditorState.currentPage = pageId;

        // Update layout picker to show layouts for this page
        renderLayoutPicker();
    }
}

// Update current page based on scroll position
function updateCurrentPageFromScroll() {
    const canvasScroll = document.querySelector('.canvas-scroll');
    if (!canvasScroll) return;

    const scrollTop = canvasScroll.scrollTop;
    const pages = document.querySelectorAll('.brochure-page');

    // Find which page is most visible in the viewport
    let currentVisiblePage = null;
    let maxVisibility = 0;

    pages.forEach(page => {
        const rect = page.getBoundingClientRect();
        const scrollRect = canvasScroll.getBoundingClientRect();

        // Calculate how much of the page is visible
        const visibleTop = Math.max(rect.top, scrollRect.top);
        const visibleBottom = Math.min(rect.bottom, scrollRect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibility = visibleHeight / rect.height;

        if (visibility > maxVisibility) {
            maxVisibility = visibility;
            currentVisiblePage = page;
        }
    });

    if (currentVisiblePage) {
        const pageId = currentVisiblePage.dataset.pageId;

        // Only update if different from current
        if (EditorState.currentPage !== pageId) {
            console.log(`🔄 Scroll detected - switching to page: ${pageId}`);
            EditorState.currentPage = pageId;

            // Update sidebar highlighting
            document.querySelectorAll('.page-item').forEach(item => {
                item.classList.toggle('active', item.dataset.pageId === pageId);
            });

            // Update layout picker
            renderLayoutPicker();
        }
    }
}

// ============================================================================
// EDITABLE CONTENT HANDLERS
// ============================================================================

function attachEditableListeners(container) {
    const editables = container.querySelectorAll('.editable');

    editables.forEach(el => {
        // Track changes
        el.addEventListener('input', () => {
            EditorState.isDirty = true;
            console.log('✏️ Content changed, marking as dirty');
        });

        // Prevent default paste behavior (paste as plain text)
        el.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        });
    });
}

function updateSessionDataFromDOM() {
    console.log('📝 Extracting state from DOM...');

    if (!EditorState.sessionData || !EditorState.sessionData.pages) {
        return;
    }

    // Update each page's content from DOM
    EditorState.sessionData.pages.forEach(page => {
        const pageEl = document.querySelector(`.brochure-page[data-page-id="${page.id}"]`);
        if (!pageEl) return;

        const editables = pageEl.querySelectorAll('.editable');
        editables.forEach(el => {
            const field = el.dataset.field;
            if (!field) return;

            const value = el.innerHTML.trim();

            // Store in page content or page properties
            if (field === 'title') {
                page.title = el.textContent.trim();
            } else {
                if (!page.content) page.content = {};
                page.content[field] = value;
            }
        });
    });

    console.log('✅ Session data updated from DOM');
}

// ============================================================================
// PROPERTIES PANEL
// ============================================================================

function updatePropertiesPanel(element) {
    const panel = document.getElementById('propertiesContent');

    if (!element) {
        panel.innerHTML = `
            <div class="empty-state">
                <p>Select an element to edit its properties</p>
            </div>
        `;
        return;
    }

    const field = element.dataset.field || 'text';
    const currentValue = element.textContent.trim();

    panel.innerHTML = `
        <div class="property-group">
            <div class="property-group-title">Text Properties</div>
            <div class="property-field">
                <label class="property-label">Content</label>
                <textarea class="property-textarea" id="propContent">${currentValue}</textarea>
            </div>
            <div class="property-field">
                <label class="property-label">Font Size</label>
                <select class="property-select" id="propFontSize">
                    <option value="12px">12px - Small</option>
                    <option value="14px" selected>14px - Normal</option>
                    <option value="16px">16px - Medium</option>
                    <option value="20px">20px - Large</option>
                    <option value="28px">28px - Heading</option>
                    <option value="42px">42px - Title</option>
                </select>
            </div>
            <div class="property-field">
                <label class="property-label">Font Weight</label>
                <select class="property-select" id="propFontWeight">
                    <option value="400">Normal</option>
                    <option value="500">Medium</option>
                    <option value="600" selected>Semi-Bold</option>
                    <option value="700">Bold</option>
                </select>
            </div>
        </div>
    `;

    // Attach listeners
    document.getElementById('propContent').addEventListener('input', (e) => {
        element.textContent = e.target.value;
        EditorState.isDirty = true;
    });

    document.getElementById('propFontSize').addEventListener('change', (e) => {
        element.style.fontSize = e.target.value;
        EditorState.isDirty = true;
    });

    document.getElementById('propFontWeight').addEventListener('change', (e) => {
        element.style.fontWeight = e.target.value;
        EditorState.isDirty = true;
    });
}

// ============================================================================
// ZOOM & VIEW CONTROLS
// ============================================================================

function setZoom(level) {
    EditorState.zoomLevel = Math.max(0.25, Math.min(2.0, level));

    const canvas = document.getElementById('brochureCanvas');
    canvas.style.transform = `scale(${EditorState.zoomLevel})`;

    document.getElementById('zoomLevel').textContent = `${Math.round(EditorState.zoomLevel * 100)}%`;
}

function zoomIn() {
    setZoom(EditorState.zoomLevel + 0.1);
}

function zoomOut() {
    setZoom(EditorState.zoomLevel - 0.1);
}

function fitToWidth() {
    const container = document.getElementById('canvasContainer');
    const canvas = document.getElementById('brochureCanvas');

    // Calculate zoom to fit page width
    const containerWidth = container.offsetWidth - 64; // padding
    const pageWidth = 297 * 3.7795275591; // 297mm to pixels (at 96dpi)
    const zoom = containerWidth / pageWidth;

    setZoom(zoom);
}

function toggleGuides() {
    EditorState.showGuides = !EditorState.showGuides;

    document.querySelectorAll('.brochure-page').forEach(page => {
        page.classList.toggle('show-guides', EditorState.showGuides);
    });
}

// ============================================================================
// UI HELPERS
// ============================================================================

function updatePropertyAddress() {
    const property = EditorState.sessionData?.property || {};
    const addressEl = document.getElementById('propertyAddress');
    addressEl.textContent = property.address || 'Property Brochure';
}

function updateStatus(state, text) {
    const dot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    dot.className = `status-dot ${state}`;
    statusText.textContent = text;
}

function showLoading(visible) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.toggle('visible', visible);
}

function showError(title, message) {
    const modal = document.getElementById('errorModal');
    const messageEl = document.getElementById('errorMessage');

    messageEl.textContent = message;
    modal.classList.add('visible');
}

function hideError() {
    const modal = document.getElementById('errorModal');
    modal.classList.remove('visible');
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('successToast');
    const messageEl = document.getElementById('toastMessage');

    messageEl.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('visible');

    setTimeout(() => {
        toast.classList.remove('visible');
    }, 3000);
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function initializeEventListeners() {
    // Header buttons
    document.getElementById('backBtn').addEventListener('click', () => {
        if (EditorState.isDirty) {
            if (confirm('You have unsaved changes. Save before leaving?')) {
                saveSession().then(() => {
                    window.location.href = '/static/index.html';
                });
            } else {
                window.location.href = '/static/index.html';
            }
        } else {
            window.location.href = '/static/index.html';
        }
    });

    document.getElementById('saveBtn').addEventListener('click', () => {
        saveSession();
    });

    document.getElementById('exportBtn').addEventListener('click', () => {
        exportPDF();
    });

    // Zoom controls
    document.getElementById('zoomInBtn').addEventListener('click', zoomIn);
    document.getElementById('zoomOutBtn').addEventListener('click', zoomOut);
    document.getElementById('fitToWidthBtn').addEventListener('click', fitToWidth);
    document.getElementById('showGuidesToggle').addEventListener('change', toggleGuides);

    // Error modal
    document.querySelector('.modal-close').addEventListener('click', hideError);
    document.getElementById('errorBackBtn').addEventListener('click', () => {
        window.location.href = '/static/index.html';
    });
    document.getElementById('errorRetryBtn').addEventListener('click', () => {
        hideError();
        loadSession();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + S = Save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveSession();
        }

        // Ctrl/Cmd + Plus = Zoom In
        if ((e.ctrlKey || e.metaKey) && e.key === '+') {
            e.preventDefault();
            zoomIn();
        }

        // Ctrl/Cmd + Minus = Zoom Out
        if ((e.ctrlKey || e.metaKey) && e.key === '-') {
            e.preventDefault();
            zoomOut();
        }

        // Ctrl/Cmd + 0 = Fit to Width
        if ((e.ctrlKey || e.metaKey) && e.key === '0') {
            e.preventDefault();
            fitToWidth();
        }
    });

    // Scroll listener to auto-select page in view
    const canvasScroll = document.querySelector('.canvas-scroll');
    if (canvasScroll) {
        let scrollTimeout;
        canvasScroll.addEventListener('scroll', () => {
            // Debounce scroll events
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                updateCurrentPageFromScroll();
            }, 150);
        });
    }

    // Warn before closing with unsaved changes
    window.addEventListener('beforeunload', (e) => {
        if (EditorState.isDirty) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            return e.returnValue;
        }
    });
}

// ============================================================================
// EXPORT FUNCTIONALITY
// ============================================================================

async function exportPDF() {
    console.log('📄 Exporting PDF...');

    // First, save current state
    if (EditorState.isDirty) {
        await saveSession();
    }

    updateStatus('loading', 'Generating PDF...');

    try {
        // TODO: Implement PDF export endpoint
        // For now, show a placeholder message
        showToast('PDF export coming soon!', 'info');
        updateStatus('ready', 'Ready');

    } catch (error) {
        console.error('❌ PDF export failed:', error);
        showError('Export failed', error.message);
        updateStatus('error', 'Export failed');
    }
}

// ============================================================================
// CLEANUP
// ============================================================================

window.addEventListener('unload', () => {
    stopAutoSave();
});

console.log('✅ Brochure Editor V3 loaded');
