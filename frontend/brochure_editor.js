// Brochure Editor - Interactive HTML-based brochure with live editing

// ============================================
// State Management
// ============================================

let brochureData = {
    property: {},
    photos: [],
    pages: [],
    photoAssignments: {},
    brand: 'generic',
    typography: 'classic',
    orientation: 'landscape'
};

let currentPage = 0;
let zoomLevel = 1.0;
let selectedElement = null;
let undoStack = [];
let redoStack = [];

// ============================================
// Initialize Editor
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Brochure Editor Initializing...');

    // Get brochure data from URL params or localStorage
    loadBrochureData();

    // Render the editor
    renderBrochure();
    renderPageNavigator();
    renderPhotoLibrary();

    // Set up event listeners
    setupEventListeners();

    console.log('✅ Brochure Editor Ready');
});

// ============================================
// SAVE FUNCTIONALITY
// ============================================

function saveBrochureData() {
    try {
        localStorage.setItem('brochure_editor_data', JSON.stringify(brochureData));
        console.log('💾 Brochure data saved');
    } catch (error) {
        console.error('❌ Failed to save brochure data:', error);
    }
}

// ============================================
// Data Loading
// ============================================

function loadBrochureData() {
    // Try to load from URL params first (coming from generate page)
    const urlParams = new URLParams(window.location.search);
    const encodedData = urlParams.get('data');

    if (encodedData) {
        try {
            brochureData = JSON.parse(decodeURIComponent(encodedData));
            console.log('📥 Loaded brochure data from URL');
        } catch (e) {
            console.error('Failed to parse URL data:', e);
        }
    }

    // Fallback to localStorage
    if (!brochureData.pages || brochureData.pages.length === 0) {
        const saved = localStorage.getItem('brochure_editor_data');
        if (saved) {
            brochureData = JSON.parse(saved);
            console.log('📥 Loaded brochure data from localStorage');

            // CRITICAL: Check if loaded data has pages array
            if (!brochureData.pages || brochureData.pages.length === 0) {
                console.log('⚠️ Loaded data missing pages array - creating default pages');
                createDefaultPages();
            }
        } else {
            // Create default 8-page structure
            createDefaultPages();
        }
    }

    // Update title
    if (brochureData.property && brochureData.property.address) {
        document.getElementById('propertyTitle').textContent = brochureData.property.address;
    }
}

function createDefaultPages() {
    console.log('📄 Creating default 8-page brochure structure');

    brochureData.pages = [
        {
            id: 1,
            name: 'Cover',
            layout: 'cover',
            content: {
                headline: brochureData.property.address || 'Stunning Family Home',
                price: brochureData.property.price || 'POA',
                tagline: 'Your dream home awaits'
            },
            photoZones: [
                { id: 'cover-hero', category: 'cover', size: 'full', photo: null }
            ]
        },
        {
            id: 2,
            name: 'Introduction',
            layout: 'intro-spread',
            content: {
                title: 'Welcome Home',
                intro: 'A beautifully presented property offering exceptional living space and modern comfort...',
                highlights: [
                    'Spacious living areas',
                    'Modern kitchen',
                    'Private garden',
                    'Prime location'
                ]
            },
            photoZones: [
                { id: 'intro-1', category: 'exterior', size: 'large', photo: null },
                { id: 'intro-2', category: 'interior', size: 'medium', photo: null }
            ]
        },
        {
            id: 3,
            name: 'Living Spaces',
            layout: 'gallery-2col',
            content: {
                title: 'Living & Reception',
                description: 'Generous reception rooms flooded with natural light, perfect for both family life and entertaining...'
            },
            photoZones: [
                { id: 'living-1', category: 'interior', size: 'medium', photo: null },
                { id: 'living-2', category: 'interior', size: 'medium', photo: null },
                { id: 'living-3', category: 'interior', size: 'medium', photo: null },
                { id: 'living-4', category: 'interior', size: 'medium', photo: null }
            ]
        },
        {
            id: 4,
            name: 'Kitchen & Dining',
            layout: 'feature-page',
            content: {
                title: 'Heart of the Home',
                description: 'A stunning modern kitchen with high-end appliances and ample space for family dining...'
            },
            photoZones: [
                { id: 'kitchen-1', category: 'kitchen', size: 'large', photo: null },
                { id: 'kitchen-2', category: 'kitchen', size: 'small', photo: null },
                { id: 'kitchen-3', category: 'kitchen', size: 'small', photo: null }
            ]
        },
        {
            id: 5,
            name: 'Bedrooms',
            layout: 'gallery-3col',
            content: {
                title: 'Restful Retreats',
                description: 'Well-proportioned bedrooms offering comfort and tranquility...'
            },
            photoZones: [
                { id: 'bed-1', category: 'bedrooms', size: 'medium', photo: null },
                { id: 'bed-2', category: 'bedrooms', size: 'medium', photo: null },
                { id: 'bed-3', category: 'bedrooms', size: 'medium', photo: null }
            ]
        },
        {
            id: 6,
            name: 'Bathrooms',
            layout: 'feature-page',
            content: {
                title: 'Luxury Bathrooms',
                description: 'Beautifully appointed bathrooms with high-quality fixtures and fittings...'
            },
            photoZones: [
                { id: 'bath-1', category: 'bathrooms', size: 'large', photo: null },
                { id: 'bath-2', category: 'bathrooms', size: 'medium', photo: null }
            ]
        },
        {
            id: 7,
            name: 'Garden & Exterior',
            layout: 'outdoor-spread',
            content: {
                title: 'Outdoor Living',
                description: 'Private garden perfect for al fresco dining and relaxation...'
            },
            photoZones: [
                { id: 'garden-1', category: 'garden', size: 'large', photo: null },
                { id: 'garden-2', category: 'exterior', size: 'medium', photo: null },
                { id: 'garden-3', category: 'garden', size: 'medium', photo: null }
            ]
        },
        {
            id: 8,
            name: 'Location & Details',
            layout: 'back-page',
            content: {
                title: 'Prime Location',
                location: brochureData.property.location || '',
                features: brochureData.property.features || [],
                epc: brochureData.property.epc || 'TBC',
                agent: {
                    name: brochureData.property.agentName || 'Estate Agent',
                    phone: brochureData.property.agentPhone || '',
                    email: brochureData.property.agentEmail || ''
                }
            },
            photoZones: [
                { id: 'location-map', category: 'exterior', size: 'medium', photo: null }
            ]
        }
    ];

    // Auto-populate pages with generated text and photos
    populatePagesWithGeneratedContent();
}

function populatePagesWithGeneratedContent() {
    console.log('✨ Populating pages with generated content and photos');

    // 1. Update COVER PAGE with property address
    if (brochureData.pages[0] && brochureData.property) {
        brochureData.pages[0].content.headline = brochureData.property.address || 'Stunning Family Home';
        brochureData.pages[0].content.price = brochureData.property.price || 'POA';
        console.log(`📍 Cover page updated: ${brochureData.pages[0].content.headline}`);
    }

    // 2. Fix page titles - use descriptive names, not creative titles
    if (brochureData.pages) {
        brochureData.pages.forEach(page => {
            page.content.title = page.name; // Use page name instead of creative titles
        });
        console.log('📝 Updated page titles to be descriptive');
    }

    // 3. Semantically distribute generated text across pages
    if (brochureData.generatedText && brochureData.generatedText.length > 0) {
        const bestVariant = brochureData.generatedText[0];
        console.log(`📝 Using generated text: "${bestVariant.headline.substring(0, 50)}..."`);

        const fullText = bestVariant.full_text;
        const sentences = fullText.split(/(?<=[.!?])\s+/);

        // Helper function to find relevant sentences for a topic
        function findRelevantSentences(keywords, maxWords = 80) {
            const relevant = [];
            let wordCount = 0;

            for (const sentence of sentences) {
                // Check if sentence contains any of the keywords (case-insensitive)
                const lowerSentence = sentence.toLowerCase();
                const hasKeyword = keywords.some(keyword => lowerSentence.includes(keyword.toLowerCase()));

                if (hasKeyword && wordCount < maxWords) {
                    const words = sentence.split(/\s+/).length;
                    if (wordCount + words <= maxWords * 1.2) { // Allow 20% overflow for sentence completion
                        relevant.push(sentence);
                        wordCount += words;
                    }
                }
            }

            return relevant.join(' ');
        }

        // Page 2 (Introduction): Opening sentences (first 120 words)
        if (brochureData.pages[1]) {
            const introSentences = [];
            let wordCount = 0;
            for (const sentence of sentences) {
                const words = sentence.split(/\s+/).length;
                if (wordCount + words <= 120) {
                    introSentences.push(sentence);
                    wordCount += words;
                } else {
                    break;
                }
            }
            brochureData.pages[1].content.intro = introSentences.join(' ');
            brochureData.pages[1].content.highlights = (bestVariant.key_features || []).slice(0, 4);
            console.log(`  Page 2 (Introduction): ${wordCount} words`);
        }

        // Page 3 (Living Spaces): Sentences about living room, reception, lounge
        if (brochureData.pages[2]) {
            const livingText = findRelevantSentences(['living', 'reception', 'lounge', 'sitting', 'drawing', 'family room', 'entertaining'], 80);
            brochureData.pages[2].content.description = livingText || 'Spacious reception rooms perfect for relaxation and entertaining.';
            console.log(`  Page 3 (Living Spaces): ${livingText.split(/\s+/).length} words`);
        }

        // Page 4 (Kitchen & Dining): Sentences about kitchen, dining
        if (brochureData.pages[3]) {
            const kitchenText = findRelevantSentences(['kitchen', 'dining', 'cooking', 'breakfast', 'appliance', 'counter', 'island', 'cupboard'], 80);
            brochureData.pages[3].content.description = kitchenText || 'A beautifully appointed kitchen with modern fixtures and ample dining space.';
            console.log(`  Page 4 (Kitchen & Dining): ${kitchenText.split(/\s+/).length} words`);
        }

        // Page 5 (Bedrooms): Sentences about bedrooms
        if (brochureData.pages[4]) {
            const bedroomText = findRelevantSentences(['bedroom', 'master', 'ensuite', 'wardrobe', 'sleeping', 'principal', 'double bedroom'], 80);
            brochureData.pages[4].content.description = bedroomText || 'Well-proportioned bedrooms offering comfort and tranquility.';
            console.log(`  Page 5 (Bedrooms): ${bedroomText.split(/\s+/).length} words`);
        }

        // Page 6 (Bathrooms): Sentences about bathrooms
        if (brochureData.pages[5]) {
            const bathroomText = findRelevantSentences(['bathroom', 'shower', 'bath', 'toilet', 'wc', 'ensuite', 'tiles', 'basin'], 80);
            brochureData.pages[5].content.description = bathroomText || 'Luxurious bathrooms with high-quality fixtures and fittings.';
            console.log(`  Page 6 (Bathrooms): ${bathroomText.split(/\s+/).length} words`);
        }

        // Page 7 (Garden & Exterior): Sentences about garden, outdoor
        if (brochureData.pages[6]) {
            const gardenText = findRelevantSentences(['garden', 'outdoor', 'patio', 'terrace', 'lawn', 'landscaped', 'exterior', 'driveway', 'parking'], 80);
            brochureData.pages[6].content.description = gardenText || 'Private garden perfect for outdoor entertaining and relaxation.';
            console.log(`  Page 7 (Garden & Exterior): ${gardenText.split(/\s+/).length} words`);
        }

        // Page 8 (Location & Details): Sentences about location, transport, area
        if (brochureData.pages[7]) {
            const locationText = findRelevantSentences(['location', 'area', 'transport', 'schools', 'shops', 'station', 'access', 'nearby', 'walking distance'], 80);
            brochureData.pages[7].content.description = locationText || 'Prime location with excellent transport links and local amenities.';
            console.log(`  Page 8 (Location & Details): ${locationText.split(/\s+/).length} words`);
        }
    }

    // 3. Auto-assign photos to photo zones
    if (brochureData.photoAssignments && brochureData.photos && brochureData.photos.length > 0) {
        console.log('📸 Auto-assigning photos to pages...');
        console.log('Photo assignments:', brochureData.photoAssignments);
        console.log('Total photos:', brochureData.photos.length);

        // Track which photos have been used
        const usedPhotos = new Set();

        // Assign photos to each page
        brochureData.pages.forEach((page, pageIdx) => {
            page.photoZones.forEach((zone, zoneIdx) => {
                const category = zone.category;
                const assignedPhotos = brochureData.photoAssignments[category] || [];

                console.log(`  Page ${pageIdx + 1} (${page.name}) - Zone ${zone.id} needs category: ${category}`);
                console.log(`    Available ${category} photos:`, assignedPhotos);

                // Find first unassigned photo from this category
                for (const photoIdx of assignedPhotos) {
                    if (!usedPhotos.has(photoIdx)) {
                        zone.photo = photoIdx;
                        usedPhotos.add(photoIdx);
                        console.log(`    ✓ Assigned photo ${photoIdx} (${brochureData.photos[photoIdx]?.name})`);
                        break;
                    }
                }

                if (zone.photo === null && assignedPhotos.length > 0) {
                    console.warn(`    ⚠️ No unused ${category} photos available`);
                }
            });
        });

        console.log(`✅ Assigned ${usedPhotos.size} photos total`);
    } else {
        console.warn('⚠️ No photo assignments or photos available');
    }
}

// ============================================
// Render Brochure Pages
// ============================================

function renderBrochure() {
    const container = document.getElementById('pagesContainer');
    container.innerHTML = '';

    brochureData.pages.forEach((page, index) => {
        const pageEl = createPageElement(page, index);
        container.appendChild(pageEl);
    });

    // Add "Add Page" button at the end
    const addPageBtn = document.createElement('div');
    addPageBtn.className = 'add-page-button';
    addPageBtn.onclick = () => addNewBlankPage();
    addPageBtn.style.cssText = `
        width: 794px;
        height: 200px;
        margin: 0 auto 2rem auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: white;
        border: 4px dashed #2C5F7C;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    `;
    addPageBtn.innerHTML = `
        <div style="font-size: 4rem; color: #2C5F7C; margin-bottom: 0.5rem; font-weight: 300;">+</div>
        <div style="font-size: 1.25rem; color: #2C5F7C; font-weight: 600;">Add New Page</div>
        <div style="font-size: 0.9rem; color: #666; margin-top: 0.25rem;">Click to add a blank page</div>
    `;
    addPageBtn.onmouseover = () => {
        addPageBtn.style.background = '#f0f7fc';
        addPageBtn.style.borderColor = '#E5A844';
        addPageBtn.style.transform = 'scale(1.02)';
    };
    addPageBtn.onmouseout = () => {
        addPageBtn.style.background = 'white';
        addPageBtn.style.borderColor = '#2C5F7C';
        addPageBtn.style.transform = 'scale(1)';
    };
    container.appendChild(addPageBtn);

    // Scroll to current page
    scrollToPage(currentPage);
}

function createPageElement(page, index) {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'brochure-page';
    pageDiv.id = `page-${page.id}`;
    pageDiv.dataset.pageIndex = index;

    // Apply orientation class
    const orientation = brochureData.orientation || 'landscape';
    pageDiv.classList.add(orientation);

    if (index === currentPage) {
        pageDiv.classList.add('active');
    }

    // Render different layouts based on page type
    pageDiv.innerHTML = getPageLayout(page);

    // Add click handler
    pageDiv.addEventListener('click', () => setCurrentPage(index));

    return pageDiv;
}

function getPageLayout(page) {
    // Check if Savills brand is selected
    if (brochureData.brand === 'savills') {
        return getSavillsPageLayout(page);
    }

    // Default generic layout
    return `
        <div style="padding: 3rem; height: 100%; display: flex; flex-direction: column; position: relative;">
            <!-- Delete Page Button -->
            <button onclick="deletePage(${page.id})"
                    style="position: absolute; top: 1rem; right: 5rem; width: 48px; height: 48px; background: linear-gradient(135deg, #E74C3C 0%, #C0392B 100%); color: white; border: none; border-radius: 50%; font-size: 1.5rem; cursor: pointer; box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3); transition: all 0.3s; z-index: 100;"
                    onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 6px 16px rgba(231, 76, 60, 0.5)';"
                    onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 12px rgba(231, 76, 60, 0.3)';"
                    title="Delete this page">
                ×
            </button>

            <!-- AI Assistant Button -->
            <button onclick="openAIAssistant(${page.id})"
                    style="position: absolute; top: 1rem; right: 1rem; width: 48px; height: 48px; background: linear-gradient(135deg, #00CED1 0%, #20B2AA 100%); color: white; border: none; border-radius: 50%; font-size: 1.5rem; cursor: pointer; box-shadow: 0 4px 12px rgba(0,206,209,0.3); transition: all 0.3s; z-index: 100;"
                    onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 6px 16px rgba(0,206,209,0.5)';"
                    onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 12px rgba(0,206,209,0.3)';"
                    title="Ask AI to help with this page">
                🤖
            </button>

            <div class="editable" contenteditable="true" data-field="title"
                 style="font-size: 2.5rem; font-weight: 700; color: #2C5F7C; margin-bottom: 1.5rem;">
                ${page.content.title || page.name}
            </div>

            <div class="editable" contenteditable="true" data-field="description"
                 style="font-size: 1.1rem; line-height: 1.8; color: #333; margin-bottom: 2rem; flex: 1;">
                ${page.content.description || page.content.intro || 'Add your property description here...'}
            </div>

            ${renderPhotoZones(getPhotoBlocksForPage(page), page)}
        </div>
    `;
}

function getSavillsPageLayout(page) {
    // Savills brand colors
    const savillsBeige = '#D9CEC1';
    const savillsYellow = '#FFE600';
    const savillsRed = '#E4002B';
    const savillsText = '#2C2C2C';

    // Cover page (Page 1) - Full bleed hero image with property name
    if (page.layout === 'cover') {
        return `
            <div style="position: relative; height: 100%; background-color: ${savillsBeige};">
                ${renderPhotoZones(getPhotoBlocksForPage(page), page)}
                <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%); padding: 3rem;">
                    <div class="editable" contenteditable="true" data-field="headline"
                         style="font-size: 3rem; font-weight: 700; color: white; font-family: Georgia, serif; margin-bottom: 0.5rem;">
                        ${page.content.headline || brochureData.property.address || 'Property Name'}
                    </div>
                    <div class="editable" contenteditable="true" data-field="price"
                         style="font-size: 1.5rem; color: white; font-weight: 600;">
                        ${page.content.price || brochureData.property.price || 'POA'}
                    </div>
                </div>
                <div style="position: absolute; top: 2rem; right: 2rem; background: ${savillsYellow}; padding: 1rem 2rem; border-radius: 4px;">
                    <span style="font-family: Georgia, serif; font-size: 1.5rem; font-weight: 700; color: ${savillsText}; letter-spacing: 0.05em;">SAVILLS</span>
                </div>
            </div>
        `;
    }

    // Overview page (Page 2) - Photos left, details right
    if (page.name === 'Overview' || page.layout === 'overview') {
        return `
            <div style="display: grid; grid-template-columns: 1.5fr 1fr; height: 100%; background-color: ${savillsBeige};">
                <div style="padding: 3rem;">
                    ${renderPhotoZones(getPhotoBlocksForPage(page), page)}
                </div>
                <div style="padding: 3rem; background: white;">
                    <div class="editable" contenteditable="true" data-field="title"
                         style="font-size: 2rem; font-weight: 700; color: ${savillsText}; font-family: Georgia, serif; margin-bottom: 1.5rem; border-bottom: 3px solid ${savillsYellow}; padding-bottom: 1rem;">
                        ${page.content.title || page.name}
                    </div>
                    <div class="editable" contenteditable="true" data-field="description"
                         style="font-size: 1rem; line-height: 1.8; color: ${savillsText}; margin-bottom: 2rem;">
                        ${page.content.description || 'Property overview and key features...'}
                    </div>
                </div>
            </div>
        `;
    }

    // Back page (Page 10) - Agent details, EPC, legal disclaimers
    if (page.name === 'Back Cover' || page.layout === 'back_cover' || page.name === 'Contact') {
        const agentName = brochureData.property?.agentName || 'Your Agent';
        const agentPhone = brochureData.property?.agentPhone || '+44 20 7000 0000';
        const agentEmail = brochureData.property?.agentEmail || 'agent@savills.com';

        return `
            <div style="padding: 3rem; height: 100%; display: flex; flex-direction: column; background-color: ${savillsBeige};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 4px solid ${savillsYellow}; padding-bottom: 1.5rem;">
                    <div>
                        <h2 style="font-family: Georgia, serif; font-size: 2rem; color: ${savillsText}; margin-bottom: 0.5rem;">Contact Us</h2>
                    </div>
                    <div style="background: ${savillsYellow}; padding: 0.75rem 1.5rem; border-radius: 4px;">
                        <span style="font-family: Georgia, serif; font-size: 1.25rem; font-weight: 700; color: ${savillsText}; letter-spacing: 0.05em;">SAVILLS</span>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                    <div style="background: white; padding: 2rem; border-radius: 8px;">
                        <h3 style="font-family: Georgia, serif; color: ${savillsText}; margin-bottom: 1rem;">Your Agent</h3>
                        <div class="editable" contenteditable="true" data-field="agentName"
                             style="font-weight: 600; font-size: 1.1rem; color: ${savillsText}; margin-bottom: 0.5rem;">
                            ${agentName}
                        </div>
                        <div class="editable" contenteditable="true" data-field="agentPhone"
                             style="color: ${savillsText}; margin-bottom: 0.25rem;">
                            📞 ${agentPhone}
                        </div>
                        <div class="editable" contenteditable="true" data-field="agentEmail"
                             style="color: ${savillsText};">
                            ✉️ ${agentEmail}
                        </div>
                    </div>

                    <div style="background: white; padding: 2rem; border-radius: 8px;">
                        <h3 style="font-family: Georgia, serif; color: ${savillsText}; margin-bottom: 1rem;">Energy Performance</h3>
                        <div class="editable" contenteditable="true" data-field="epc"
                             style="font-size: 1rem; color: ${savillsText};">
                            EPC Rating: ${brochureData.property?.epc || 'TBC'}
                        </div>
                    </div>
                </div>

                <div style="margin-top: auto; background: white; padding: 1.5rem; border-radius: 8px; font-size: 0.75rem; line-height: 1.6; color: #666;">
                    <div class="editable" contenteditable="true" data-field="disclaimer"
                         style="font-size: 0.75rem; line-height: 1.6; color: #666;">
                        <strong>Important Notice:</strong> These particulars are set out as a general outline only for the guidance of intended purchasers and do not constitute any part of an offer or contract. All descriptions, dimensions, references to condition and necessary permissions for use and occupation, and other details are given in good faith and are believed to be correct but any intending purchaser should not rely on them as statements or representations of fact and must satisfy themselves by inspection or otherwise as to the accuracy of each of them. No person in the employment of Savills has any authority to make or give any representation or warranty whatsoever in relation to this property. All areas and distances are approximate. Photographs taken ${new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}. © ${new Date().getFullYear()} Savills.
                    </div>
                </div>
            </div>
        `;
    }

    // Standard content pages (Pages 3-9)
    return `
        <div style="padding: 3rem; height: 100%; display: flex; flex-direction: column; background-color: ${savillsBeige}; position: relative;">
            <!-- AI Assistant Button -->
            <button onclick="openAIAssistant(${page.id})"
                    style="position: absolute; top: 1rem; right: 1rem; width: 48px; height: 48px; background: linear-gradient(135deg, #00CED1 0%, #20B2AA 100%); color: white; border: none; border-radius: 50%; font-size: 1.5rem; cursor: pointer; box-shadow: 0 4px 12px rgba(0,206,209,0.3); transition: all 0.3s; z-index: 100;"
                    onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 6px 16px rgba(0,206,209,0.5)';"
                    onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 12px rgba(0,206,209,0.3)';"
                    title="Ask AI to help with this page">
                🤖
            </button>

            <div class="editable" contenteditable="true" data-field="title"
                 style="font-size: 2.5rem; font-weight: 700; color: ${savillsText}; font-family: Georgia, serif; margin-bottom: 1.5rem; border-bottom: 4px solid ${savillsYellow}; padding-bottom: 0.5rem;">
                ${page.content.title || page.name}
            </div>

            <div class="editable" contenteditable="true" data-field="description"
                 style="font-size: 1.1rem; line-height: 1.8; color: ${savillsText}; margin-bottom: 2rem; flex: 1;">
                ${page.content.description || page.content.intro || 'Add your property description here...'}
            </div>

            ${renderPhotoZones(getPhotoBlocksForPage(page), page)}

            <div style="margin-top: auto; padding-top: 2rem; border-top: 2px solid ${savillsYellow}; text-align: right;">
                <span style="font-family: Georgia, serif; font-size: 0.9rem; color: ${savillsText}; font-weight: 600;">SAVILLS</span>
            </div>
        </div>
    `;
}

// Helper: Convert contentBlocks to photoZones format for rendering
function getPhotoBlocksForPage(page) {
    // If page has contentBlocks (new format from page builder)
    if (page.contentBlocks && Array.isArray(page.contentBlocks)) {
        return page.contentBlocks.filter(block => block.type === 'photo');
    }
    // If page has photoZones (old format)
    if (page.photoZones && Array.isArray(page.photoZones)) {
        return page.photoZones;
    }
    return [];
}

function renderPhotoZones(zones, page) {
    if (!zones || zones.length === 0) return '';

    return `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: auto;">
            ${zones.map(zone => {
                // Handle both old photoZones format and new contentBlocks format
                let photoData = null;
                let photoUrl = null;

                // New format: zone is a contentBlock with photoId
                if (zone.photoId !== undefined) {
                    photoData = brochureData.photos[zone.photoId];
                    photoUrl = photoData ? photoData.dataUrl : null;
                }
                // Old format: zone.photo contains the photo INDEX
                else if (zone.photo !== null && typeof zone.photo === 'number') {
                    photoData = brochureData.photos[zone.photo];
                    photoUrl = photoData ? photoData.dataUrl : null;
                }

                const zoneId = zone.id || zone.photoId || 'zone-' + Math.random();
                const zoneHeight = zone.customHeight || (zone.size === 'large' ? 300 : zone.size === 'medium' ? 200 : 150);
                const pageId = page ? (page.id || '') : '';

                return `
                    <div class="photo-zone ${photoUrl ? 'has-photo' : ''}"
                         data-zone-id="${zoneId}"
                         data-page-id="${pageId}"
                         draggable="${photoUrl ? 'true' : 'false'}"
                         ondragstart="handlePhotoZoneDragStart(event)"
                         ondragover="handlePhotoDragOver(event)"
                         ondrop="handlePhotoDrop(event, '${zoneId}')"
                         style="height: ${zoneHeight}px; position: relative; transition: all 0.3s;">
                        ${photoUrl ?
                            `<img src="${photoUrl}" alt="${zone.category || ''}" title="${photoData ? photoData.name : ''}"
                                  style="width: 100%; height: 100%; object-fit: cover; cursor: move;"
                                  draggable="false">
                             <!-- Delete button in top-right corner -->
                             <button class="photo-delete-btn"
                                     onclick="event.stopPropagation(); removePhotoFromZone('${zoneId}', ${pageId})"
                                     title="Delete Photo"
                                     style="position: absolute; top: 0.5rem; right: 0.5rem; width: 32px; height: 32px; background: rgba(231, 76, 60, 0.9); color: white; border: 2px solid white; border-radius: 50%; font-size: 1.5rem; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; padding: 0; z-index: 10; box-shadow: 0 2px 8px rgba(0,0,0,0.3); transition: all 0.2s;">
                                 ×
                             </button>
                             <div class="photo-controls" style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); padding: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                                 <button class="photo-action-btn" onclick="openPhotoLibrary('${zoneId}')" title="Change Photo">🔄</button>
                                 <input type="range" min="100" max="500" value="${zoneHeight}"
                                        onchange="resizePhoto('${zoneId}', this.value)"
                                        style="flex: 1; cursor: pointer;" title="Resize">
                             </div>` :
                            `<div class="photo-zone-placeholder" onclick="openPhotoLibrary('${zoneId}')"
                                  style="cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; border: 2px dashed #ccc;">
                                📸<br>Drag photo here or click
                             </div>`
                        }
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// ============================================
// Page Navigator
// ============================================

function renderPageNavigator() {
    const navList = document.getElementById('pageNavList');
    navList.innerHTML = '';

    brochureData.pages.forEach((page, index) => {
        const navItem = document.createElement('div');
        navItem.className = 'page-nav-item';
        if (index === currentPage) navItem.classList.add('active');

        navItem.innerHTML = `
            <div class="page-nav-thumbnail"></div>
            <div class="page-nav-info">
                <div class="page-nav-title">Page ${index + 1}: ${page.name}</div>
                <div class="page-nav-desc">${page.layout}</div>
            </div>
        `;

        navItem.addEventListener('click', () => setCurrentPage(index));
        navList.appendChild(navItem);
    });
}

function setCurrentPage(index) {
    currentPage = index;

    // Update active states
    document.querySelectorAll('.brochure-page').forEach((el, i) => {
        el.classList.toggle('active', i === index);
    });

    document.querySelectorAll('.page-nav-item').forEach((el, i) => {
        el.classList.toggle('active', i === index);
    });

    // Scroll to page
    scrollToPage(index);
}

function scrollToPage(index) {
    const page = document.querySelector(`[data-page-index="${index}"]`);
    if (page) {
        page.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function addNewBlankPage() {
    console.log('Adding new blank page');

    // Get the highest page ID
    const maxId = Math.max(...brochureData.pages.map(p => p.id || 0));
    const newId = maxId + 1;

    // Get current brand colors
    const brand = brochureData.brand || 'generic';
    const savillsBeige = '#D9CEC1';

    // Create new blank page following the theme
    const newPage = {
        id: newId,
        name: `Page ${newId}`,
        layout: 'standard',
        content: {
            title: 'New Page',
            description: 'Add your content here...'
        },
        contentBlocks: []  // Empty content blocks for photos
    };

    // Add the page
    brochureData.pages.push(newPage);

    // Save state for undo/redo
    saveState();

    // Re-render everything
    renderBrochure();
    renderPageNavigator();
    saveBrochureData();

    // Navigate to the new page
    setCurrentPage(brochureData.pages.length - 1);

    showToast('success', `Page ${newId} added`);
    console.log('✓ New page created:', newPage);
}

function deletePage(pageId) {
    // Find the page index
    const pageIndex = brochureData.pages.findIndex(p => p.id === pageId);

    if (pageIndex === -1) {
        console.error('Page not found:', pageId);
        return;
    }

    // Don't allow deleting if only one page remains
    if (brochureData.pages.length <= 1) {
        showToast('error', 'Cannot delete the last page');
        return;
    }

    const pageName = brochureData.pages[pageIndex].name || `Page ${pageId}`;

    // Show confirmation dialog
    if (!confirm(`Are you sure you want to delete "${pageName}"?\n\nThis action cannot be undone.`)) {
        return;
    }

    // Remove the page
    brochureData.pages.splice(pageIndex, 1);

    // Save state for undo/redo
    saveState();

    // If we deleted the current page, navigate to the previous one
    if (currentPageIndex >= brochureData.pages.length) {
        setCurrentPage(brochureData.pages.length - 1);
    }

    // Re-render everything
    renderBrochure();
    renderPageNavigator();
    saveBrochureData();

    showToast('success', `Page deleted: ${pageName}`);
    console.log('✓ Page deleted:', pageId);
}

// ============================================
// Photo Library
// ============================================

function renderPhotoLibrary() {
    const library = document.getElementById('photoLibrary');
    if (!brochureData.photos || brochureData.photos.length === 0) {
        library.innerHTML = '<p style="color: #999; text-align: center; padding: 1rem;">No photos uploaded</p>';
        return;
    }

    // Helper function to check if photo is assigned to any page
    function isPhotoAssigned(photoIndex) {
        for (const page of brochureData.pages) {
            // Check contentBlocks (new format)
            if (page.contentBlocks && Array.isArray(page.contentBlocks)) {
                const hasPhoto = page.contentBlocks.some(block =>
                    block.type === 'photo' && block.photoId === photoIndex
                );
                if (hasPhoto) return true;
            }
            // Check photoZones (old format)
            if (page.photoZones && Array.isArray(page.photoZones)) {
                const hasPhoto = page.photoZones.some(zone => zone.photo === photoIndex);
                if (hasPhoto) return true;
            }
        }
        return false;
    }

    library.innerHTML = brochureData.photos.map((photo, index) => {
        const assigned = isPhotoAssigned(index);
        const badgeText = assigned ? 'Assigned' : 'Unassigned';
        const badgeColor = assigned ? '#27ae60' : '#95a5a6';

        return `
            <div class="library-photo" draggable="true" data-photo-index="${index}"
                 ondragstart="handlePhotoDragStart(event)">
                <img src="${photo.dataUrl || photo.url}" alt="Photo ${index + 1}" draggable="false">
                <div class="photo-category-badge" style="background: ${badgeColor};">${badgeText}</div>
            </div>
        `;
    }).join('');
}

// ============================================
// Drag & Drop Photos
// ============================================

function handlePhotoDragStart(event) {
    const photoIndex = event.target.closest('[data-photo-index]').dataset.photoIndex;
    event.dataTransfer.setData('photo-index', photoIndex);
    event.dataTransfer.effectAllowed = 'copy';

    // Create custom drag image to avoid browser default
    const dragImage = document.createElement('div');
    dragImage.style.cssText = 'width: 100px; height: 100px; background: rgba(44, 95, 124, 0.8); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; position: absolute; top: -1000px; font-size: 2rem;';
    dragImage.textContent = '📸';
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 50, 50);
    setTimeout(() => dragImage.remove(), 0);

    // Visual feedback on source
    const libraryPhoto = event.target.closest('.library-photo');
    if (libraryPhoto) {
        libraryPhoto.style.opacity = '0.5';
        setTimeout(() => {
            libraryPhoto.style.opacity = '1';
        }, 100);
    }

    console.log('📷 Started dragging library photo:', photoIndex);
}

function handlePhotoDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';

    // Visual feedback - highlight drop zone
    const zone = event.currentTarget;
    zone.style.background = 'rgba(44, 95, 124, 0.1)';
    zone.style.borderColor = '#2C5F7C';
    zone.style.transform = 'scale(1.02)';
}

function handlePhotoDrop(event, zoneId) {
    event.preventDefault();
    event.stopPropagation();

    // Reset visual feedback
    const zone = event.currentTarget;
    zone.style.background = '';
    zone.style.borderColor = '';
    zone.style.transform = '';

    // Check if this is a cross-page photo zone drag (photo moving between pages)
    if (draggedPhotoZone) {
        handlePhotoZoneSwap(draggedPhotoZone, zoneId);
        draggedPhotoZone = null;
        return;
    }

    // Otherwise, this is a photo from the library being dropped
    const photoIndex = parseInt(event.dataTransfer.getData('photo-index'));

    if (isNaN(photoIndex)) {
        console.error('Invalid photo index');
        return;
    }

    // Assign photo to zone (supports both photoZones and contentBlocks)
    brochureData.pages.forEach(page => {
        // Handle contentBlocks format (new)
        if (page.contentBlocks && Array.isArray(page.contentBlocks)) {
            const targetBlock = page.contentBlocks.find(b => (b.id === zoneId || b.photoId === zoneId) && b.type === 'photo');
            if (targetBlock) {
                targetBlock.photoId = photoIndex;
                console.log('✓ Photo assigned to contentBlock');
            }
        }
        // Handle photoZones format (legacy)
        if (page.photoZones && Array.isArray(page.photoZones)) {
            const targetZone = page.photoZones.find(z => z.id === zoneId);
            if (targetZone) {
                targetZone.photo = photoIndex;
                console.log('✓ Photo assigned to photoZone');
            }
        }
    });

    renderBrochure();
    saveBrochureData();

    // Success feedback
    showToast('success', 'Photo added!');
}

// Reset drag over styling when leaving zone
document.addEventListener('dragleave', (event) => {
    if (event.target.classList.contains('photo-zone')) {
        event.target.style.background = '';
        event.target.style.borderColor = '';
        event.target.style.transform = '';
    }
});

// ============================================
// AI Text Refinement
// ============================================

async function refineText() {
    if (!selectedElement) {
        showToast('warning', 'Please select a text block first');
        return;
    }

    const prompt = document.getElementById('aiPrompt').value.trim();
    if (!prompt) {
        showToast('warning', 'Please enter refinement instructions');
        return;
    }

    const originalText = selectedElement.textContent;

    // Track regeneration count per text block
    const textBlockId = selectedElement.dataset.field || 'unknown';
    let regenCounts = JSON.parse(localStorage.getItem('ai_regeneration_counts') || '{}');
    const currentCount = regenCounts[textBlockId] || 0;

    // Calculate cost: 2 FREE, then 0.1 credits each
    let cost = 0;
    if (currentCount >= 2) {
        cost = 0.1;
    }

    // Check if user has enough credits (if cost > 0)
    if (cost > 0) {
        const creditBalanceEl = document.getElementById('creditBalance');
        const creditBalance = creditBalanceEl ? parseFloat(creditBalanceEl.textContent) || 100 : 100;

        if (creditBalance < cost) {
            showToast('error', 'Insufficient credits. Please top up your account.');
            return;
        }

        // Confirm charge with user
        if (!confirm(`This regeneration will cost ${cost} credits. Continue?`)) {
            return;
        }
    }

    // Add user message to chat
    addAIMessage('user', prompt);

    // Show loading
    addAIMessage('bot', '✨ Refining your text...');

    try {
        const response = await fetch('/refine-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: originalText,
                instruction: prompt
            })
        });

        if (!response.ok) throw new Error('Refinement failed');

        const result = await response.json();

        // Increment regeneration count
        regenCounts[textBlockId] = currentCount + 1;
        localStorage.setItem('ai_regeneration_counts', JSON.stringify(regenCounts));

        // Deduct credits if needed
        if (cost > 0) {
            const creditBalanceEl = document.getElementById('creditBalance');
            const aiCreditBalanceEl = document.getElementById('aiCreditBalance');
            const currentBalance = parseFloat(creditBalanceEl.textContent) || 100;
            const newBalance = Math.max(0, currentBalance - cost);

            creditBalanceEl.textContent = newBalance.toFixed(1) + ' credits';
            if (aiCreditBalanceEl) {
                aiCreditBalanceEl.textContent = newBalance.toFixed(1);
            }
        }

        // Update button cost display
        updateAIButtonCost(textBlockId, regenCounts[textBlockId]);

        // Remove loading message
        const messages = document.getElementById('aiMessages');
        messages.lastChild.remove();

        // Add refined result
        addAIMessage('bot', result.refined_text);

        // Show comparison modal
        showComparisonModal(originalText, result.refined_text);

        // Clear input
        document.getElementById('aiPrompt').value = '';

    } catch (error) {
        console.error('Refinement error:', error);
        showToast('error', 'Failed to refine text');
    }
}

function updateAIButtonCost(textBlockId, count) {
    const costSpan = document.getElementById('aiButtonCost');
    if (!costSpan) return;

    const remaining = Math.max(0, 2 - count);
    if (remaining > 0) {
        costSpan.textContent = `(${remaining} free left)`;
        costSpan.style.color = '#27ae60';
    } else {
        costSpan.textContent = '(0.1 credits)';
        costSpan.style.color = '#e67e22';
    }
}

function addAIMessage(type, text) {
    const messages = document.getElementById('aiMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `ai-message ${type}`;
    msgDiv.innerHTML = `<strong>${type === 'user' ? 'You' : 'AI'}:</strong> ${text}`;
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
}

function showComparisonModal(original, refined) {
    document.getElementById('originalText').textContent = original;
    document.getElementById('refinedText').textContent = refined;
    document.getElementById('aiRefinementModal').style.display = 'flex';
}

function closeAIModal() {
    document.getElementById('aiRefinementModal').style.display = 'none';
}

function applyRefinedText() {
    if (selectedElement) {
        const refined = document.getElementById('refinedText').textContent;
        selectedElement.textContent = refined;
        saveState();
        showToast('success', 'Text updated!');
    }
    closeAIModal();
}

// ============================================
// Zoom Controls
// ============================================

function zoomIn() {
    zoomLevel = Math.min(zoomLevel + 0.1, 2.0);
    applyZoom();
}

function zoomOut() {
    zoomLevel = Math.max(zoomLevel - 0.1, 0.5);
    applyZoom();
}

function applyZoom() {
    const container = document.getElementById('pagesContainer');
    const wrapper = container.parentElement; // canvas-wrapper

    container.style.transform = `scale(${zoomLevel})`;
    document.getElementById('zoomLevel').textContent = `${Math.round(zoomLevel * 100)}%`;

    // Adjust wrapper padding to account for scaled content
    // When zoomed in (>1), we need MORE space. When zoomed out (<1), we need LESS space
    const basePadding = 15; // rem
    const adjustedPadding = basePadding * zoomLevel;
    wrapper.style.paddingBottom = `${adjustedPadding}rem`;

    console.log(`Zoom: ${Math.round(zoomLevel * 100)}%, Padding: ${adjustedPadding}rem`);
}

// ============================================
// Save & Export
// ============================================

function saveDraft() {
    // Collect current state
    collectBrochureState();

    // Save to localStorage
    localStorage.setItem('brochure_editor_data', JSON.stringify(brochureData));
    localStorage.setItem('brochure_editor_timestamp', Date.now());

    showToast('success', '💾 Draft saved!');
}

function collectBrochureState() {
    // Collect all editable content from the page
    document.querySelectorAll('.editable').forEach(el => {
        const pageIndex = parseInt(el.closest('[data-page-index]')?.dataset.pageIndex);
        const field = el.dataset.field;

        if (pageIndex !== undefined && field && brochureData.pages[pageIndex]) {
            brochureData.pages[pageIndex].content[field] = el.textContent;
        }
    });
}

function previewPrint() {
    collectBrochureState();
    window.print();
}

async function exportToPDF() {
    collectBrochureState();

    showToast('info', '📄 Generating PDF... This may take a moment');

    try {
        // Get jsPDF from the global window object (loaded from CDN)
        const { jsPDF } = window.jspdf;

        // Create PDF in A4 size (portrait)
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // A4 dimensions in mm
        const pageWidth = 210;
        const pageHeight = 297;

        // Get all brochure pages
        const pageElements = document.querySelectorAll('.brochure-page');

        if (pageElements.length === 0) {
            throw new Error('No pages to export');
        }

        console.log(`📄 Exporting ${pageElements.length} pages to PDF...`);

        // Process each page
        for (let i = 0; i < pageElements.length; i++) {
            const pageElement = pageElements[i];

            // Update progress
            showToast('info', `📄 Processing page ${i + 1} of ${pageElements.length}...`);

            // Capture page as canvas with high quality
            const canvas = await html2canvas(pageElement, {
                scale: 2, // Higher quality
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false
            });

            // Convert canvas to image
            const imgData = canvas.toDataURL('image/jpeg', 0.95);

            // Calculate dimensions to fit A4
            const imgWidth = pageWidth;
            const imgHeight = (canvas.height * pageWidth) / canvas.width;

            // Add new page if not first page
            if (i > 0) {
                pdf.addPage();
            }

            // Add image to PDF
            pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

            console.log(`✓ Page ${i + 1} added to PDF`);
        }

        // Generate filename
        const filename = brochureData.property?.address
            ? `brochure-${brochureData.property.address.replace(/[^a-z0-9]/gi, '-')}.pdf`
            : 'property-brochure.pdf';

        // Save PDF
        pdf.save(filename);

        showToast('success', '✅ PDF exported successfully!');
        console.log('✓ PDF export complete');

        // Show feedback modal after successful export
        setTimeout(() => {
            if (typeof showFeedbackModal === 'function') {
                showFeedbackModal();
            }
        }, 500);

    } catch (error) {
        console.error('Export error:', error);
        showToast('error', `Failed to export PDF: ${error.message}`);
    }
}

function backToForm() {
    if (confirm('Return to form? Any unsaved changes will be lost.')) {
        window.location.href = '/static/index.html';
    }
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Track selected editable elements and add regen buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('editable')) {
            selectedElement = e.target;
            document.querySelectorAll('.editable').forEach(el => {
                el.classList.remove('selected');
                // Remove any existing regen buttons
                const existingBtn = el.querySelector('.regen-btn');
                if (existingBtn) existingBtn.remove();
            });
            e.target.classList.add('selected');

            // Add regen button to selected element
            addRegenButton(e.target);
        }
    });

    // Add regen buttons on hover for better UX
    document.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('editable') && !e.target.classList.contains('selected')) {
            if (!e.target.querySelector('.regen-btn-hover')) {
                addRegenButtonHover(e.target);
            }
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('editable') && !e.target.classList.contains('selected')) {
            const hoverBtn = e.target.querySelector('.regen-btn-hover');
            if (hoverBtn) hoverBtn.remove();
        }
    });

    // Auto-save on content change
    let saveTimeout;
    document.addEventListener('input', (e) => {
        if (e.target.classList.contains('editable')) {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                saveDraft();
            }, 2000); // Auto-save after 2 seconds of inactivity
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 's') {
                e.preventDefault();
                saveDraft();
            } else if (e.key === 'z') {
                e.preventDefault();
                undo();
            } else if (e.key === 'y' || (e.shiftKey && e.key === 'Z')) {
                e.preventDefault();
                redo();
            }
        }
    });
}

// ============================================
// Undo/Redo (Simple Implementation)
// ============================================

function saveState() {
    collectBrochureState();
    undoStack.push(JSON.parse(JSON.stringify(brochureData)));
    if (undoStack.length > 50) undoStack.shift(); // Limit stack size
    redoStack = []; // Clear redo stack on new action
}

function undo() {
    if (undoStack.length > 0) {
        redoStack.push(JSON.parse(JSON.stringify(brochureData)));
        brochureData = undoStack.pop();
        renderBrochure();
        showToast('info', '↩️ Undone');
    }
}

function redo() {
    if (redoStack.length > 0) {
        undoStack.push(JSON.parse(JSON.stringify(brochureData)));
        brochureData = redoStack.pop();
        renderBrochure();
        showToast('info', '↪️ Redone');
    }
}

// ============================================
// Utility Functions
// ============================================

function showToast(type, message) {
    // Simple toast notification (you can enhance this)
    console.log(`[${type.toUpperCase()}] ${message}`);
    alert(message); // Temporary - replace with proper toast UI
}

function formatText(command) {
    document.execCommand(command, false, null);
}

function changeFontSize(size) {
    if (selectedElement) {
        selectedElement.style.fontSize = size;
        saveState();
    }
}

function changeFontFamily(fontFamily) {
    if (selectedElement) {
        selectedElement.style.fontFamily = fontFamily;
        saveState();
    } else {
        showToast('warning', 'Please select text first');
    }
}

function changePhoto(zoneId) {
    console.log('Change photo for zone:', zoneId);
    // Implement photo selection modal
}

function removePhoto(zoneId) {
    console.log('Remove photo from zone:', zoneId);
    // Implement photo removal
}

function uploadMorePhotos() {
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'image/*';

    fileInput.onchange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        showToast('info', `Uploading ${files.length} photo(s)...`);

        // Process each file
        for (const file of files) {
            try {
                // Read file as data URL
                const dataUrl = await readFileAsDataURL(file);

                // Add to brochureData.photos array
                if (!brochureData.photos) {
                    brochureData.photos = [];
                }

                brochureData.photos.push({
                    name: file.name,
                    dataUrl: dataUrl,
                    category: 'Uploaded',
                    size: file.size
                });

                console.log('✓ Photo added:', file.name);

            } catch (error) {
                console.error('Failed to upload photo:', file.name, error);
            }
        }

        // Re-render photo library
        renderPhotoLibrary();
        saveBrochureData();
        showToast('success', `${files.length} photo(s) added to library!`);
    };

    // Trigger file selection
    fileInput.click();
}

// Helper function to read file as data URL
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
    });
}

// ============================================
// AUTO-ASSIGN PHOTOS (AI-Powered)
// ============================================

async function autoAssignPhotos() {
    if (!brochureData.photos || brochureData.photos.length === 0) {
        showToast('error', 'No photos in library to assign');
        return;
    }

    showToast('info', '🤖 AI analyzing photos...');
    console.log('🎯 Starting auto-assign for', brochureData.photos.length, 'photos');

    try {
        // Prepare form data with all photos
        const formData = new FormData();

        for (let i = 0; i < brochureData.photos.length; i++) {
            const photo = brochureData.photos[i];

            // Convert data URL to blob
            const blob = await dataURLtoBlob(photo.dataUrl);
            const filename = photo.name || `photo-${i}.jpg`;

            formData.append('files', blob, filename);
        }

        // Call vision API
        const response = await fetch('/analyze-images', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const analysisResults = await response.json();
        console.log('✓ Analysis complete:', analysisResults);

        // Auto-assign photos based on room type
        let assignedCount = 0;

        analysisResults.forEach((result, photoIndex) => {
            const roomType = result.room_type;
            console.log(`Photo ${photoIndex}: ${roomType}`);

            // Find empty photo zones matching this room type
            for (const page of brochureData.pages) {
                // Check photoZones
                if (page.photoZones && Array.isArray(page.photoZones)) {
                    for (const zone of page.photoZones) {
                        // If zone is empty and matches room type
                        if (zone.photo === null && zone.category && zone.category.toLowerCase().includes(roomType.replace('_', ' '))) {
                            zone.photo = photoIndex;
                            assignedCount++;
                            console.log(`✓ Assigned photo ${photoIndex} (${roomType}) to ${zone.category} zone on page ${page.id}`);
                            return; // Move to next photo
                        }
                    }
                }

                // Check contentBlocks
                if (page.contentBlocks && Array.isArray(page.contentBlocks)) {
                    for (const block of page.contentBlocks) {
                        // If block is empty photo and matches room type
                        if (block.type === 'photo' && block.photoId === null && block.category && block.category.toLowerCase().includes(roomType.replace('_', ' '))) {
                            block.photoId = photoIndex;
                            assignedCount++;
                            console.log(`✓ Assigned photo ${photoIndex} (${roomType}) to ${block.category} block on page ${page.id}`);
                            return; // Move to next photo
                        }
                    }
                }
            }
        });

        // Re-render and save
        saveState();
        renderBrochure();
        renderPhotoLibrary();
        saveBrochureData();

        if (assignedCount > 0) {
            showToast('success', `🎯 ${assignedCount} photo(s) auto-assigned!`);
        } else {
            showToast('info', 'No matching empty zones found. Photos remain in library.');
        }

    } catch (error) {
        console.error('Auto-assign failed:', error);
        showToast('error', `Failed to auto-assign: ${error.message}`);
    }
}

// Helper: Convert data URL to Blob
async function dataURLtoBlob(dataURL) {
    const response = await fetch(dataURL);
    return await response.blob();
}

// ============================================
// Photo Management Functions
// ============================================

function resizePhoto(zoneId, newHeight) {
    // Find the zone across all pages and update its custom height
    brochureData.pages.forEach(page => {
        // Check contentBlocks first
        if (page.contentBlocks && Array.isArray(page.contentBlocks)) {
            const block = page.contentBlocks.find(b => b.id === zoneId);
            if (block) {
                block.customHeight = parseInt(newHeight);
            }
        }
        // Check photoZones (legacy)
        if (page.photoZones && Array.isArray(page.photoZones)) {
            const zone = page.photoZones.find(z => z.id === zoneId);
            if (zone) {
                zone.customHeight = parseInt(newHeight);
            }
        }
    });

    // Re-render to show the new size
    renderBrochure();
    saveBrochureData();
}

function removePhoto(zoneId) {
    // Remove photo from zone (legacy photoZones format)
    brochureData.pages.forEach(page => {
        const zone = page.photoZones.find(z => z.id === zoneId);
        if (zone) {
            zone.photo = null;
        }
    });

    renderBrochure();
    saveBrochureData();
}

// New function to remove photo from contentBlocks
function removePhotoFromZone(zoneId, pageId) {
    console.log('Removing photo from zone:', zoneId, 'on page:', pageId);

    const page = brochureData.pages.find(p => p.id === pageId);
    if (!page) {
        console.error('Page not found:', pageId);
        return;
    }

    // Handle contentBlocks format (new)
    if (page.contentBlocks && Array.isArray(page.contentBlocks)) {
        const blockIndex = page.contentBlocks.findIndex(b => b.id === zoneId || b.photoId === zoneId);
        if (blockIndex !== -1) {
            page.contentBlocks.splice(blockIndex, 1);
            console.log('✓ Photo removed from contentBlocks');
        }
    }
    // Handle photoZones format (legacy)
    else if (page.photoZones && Array.isArray(page.photoZones)) {
        const zone = page.photoZones.find(z => z.id === zoneId);
        if (zone) {
            zone.photo = null;
            console.log('✓ Photo removed from photoZones');
        }
    }

    saveState();  // Save for undo/redo
    renderBrochure();
    renderPhotoLibrary();
    saveBrochureData();
    showToast('success', 'Photo removed');
}

// Handle dragging photo zones between pages
let draggedPhotoZone = null;

function handlePhotoZoneDragStart(event) {
    const zoneEl = event.currentTarget;
    const zoneId = zoneEl.dataset.zoneId;
    const pageId = zoneEl.dataset.pageId;

    draggedPhotoZone = { zoneId, pageId, element: zoneEl };

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', zoneEl.innerHTML);

    // Create transparent drag image to avoid X cursor
    const dragImage = document.createElement('div');
    dragImage.style.cssText = 'width: 100px; height: 100px; background: rgba(44, 95, 124, 0.5); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; position: absolute; top: -1000px;';
    dragImage.textContent = '📸';
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 50, 50);
    setTimeout(() => dragImage.remove(), 0);

    // Visual feedback
    zoneEl.style.opacity = '0.4';
    console.log('📦 Started dragging photo zone:', zoneId, 'from page:', pageId);
}

// Add dragend handler to reset opacity
document.addEventListener('dragend', (event) => {
    if (draggedPhotoZone && draggedPhotoZone.element) {
        draggedPhotoZone.element.style.opacity = '1';
        draggedPhotoZone = null;
    }
    // Reset any drag-over styles
    document.querySelectorAll('.photo-zone').forEach(zone => {
        zone.style.background = '';
        zone.style.borderColor = '';
        zone.style.transform = '';
    });
});

function handlePhotoZoneSwap(sourceZone, targetZoneId) {
    console.log('🔄 Swapping photos:', sourceZone.zoneId, '→', targetZoneId);

    const sourcePage = brochureData.pages.find(p => p.id == sourceZone.pageId);
    let targetPage = null;
    let targetZone = null;

    // Find target zone across all pages
    for (const page of brochureData.pages) {
        // Check contentBlocks
        if (page.contentBlocks) {
            const block = page.contentBlocks.find(b => b.id === targetZoneId || b.photoId === targetZoneId);
            if (block) {
                targetPage = page;
                targetZone = block;
                break;
            }
        }
        // Check photoZones
        if (page.photoZones) {
            const zone = page.photoZones.find(z => z.id === targetZoneId);
            if (zone) {
                targetPage = page;
                targetZone = zone;
                break;
            }
        }
    }

    if (!sourcePage || !targetPage || !targetZone) {
        console.error('Could not find source or target zone');
        return;
    }

    // Get source zone - check both formats
    let sourceZoneObj = null;
    if (sourcePage.contentBlocks) {
        sourceZoneObj = sourcePage.contentBlocks.find(b => b.id === sourceZone.zoneId || b.photoId === sourceZone.zoneId);
    }
    if (!sourceZoneObj && sourcePage.photoZones) {
        sourceZoneObj = sourcePage.photoZones.find(z => z.id === sourceZone.zoneId);
    }

    if (!sourceZoneObj) {
        console.error('Source zone not found:', sourceZone.zoneId);
        return;
    }

    // Swap photo IDs - handle both formats
    let tempPhotoId;

    // Get source photo ID
    if (sourceZoneObj.photoId !== undefined) {
        tempPhotoId = sourceZoneObj.photoId;
    } else if (sourceZoneObj.photo !== undefined) {
        tempPhotoId = sourceZoneObj.photo;
    }

    // Get target photo ID
    let targetPhotoId;
    if (targetZone.photoId !== undefined) {
        targetPhotoId = targetZone.photoId;
    } else if (targetZone.photo !== undefined) {
        targetPhotoId = targetZone.photo;
    }

    // Set target photo to source
    if (sourceZoneObj.photoId !== undefined) {
        sourceZoneObj.photoId = targetPhotoId;
    } else if (sourceZoneObj.photo !== undefined) {
        sourceZoneObj.photo = targetPhotoId;
    }

    // Set source photo to target
    if (targetZone.photoId !== undefined) {
        targetZone.photoId = tempPhotoId;
    } else if (targetZone.photo !== undefined) {
        targetZone.photo = tempPhotoId;
    }

    console.log('✓ Photos swapped successfully');
    saveState();  // Save for undo/redo
    renderBrochure();
    saveBrochureData();
    showToast('success', 'Photos swapped');
}

let currentZoneId = null;  // Track which zone we're selecting a photo for

function openPhotoLibrary(zoneId) {
    currentZoneId = zoneId;

    // Create modal with photo library
    const modal = document.createElement('div');
    modal.id = 'photoLibraryModal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.8); z-index: 10000;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        padding: 2rem;
    `;

    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 8px; max-width: 900px; max-height: 80vh; overflow-y: auto; width: 100%;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2 style="margin: 0;">Select Photo</h2>
                <button onclick="closePhotoLibrary()" style="background: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 1.2rem;">×</button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem;">
                ${brochureData.photos.map((photo, idx) => `
                    <div onclick="selectPhotoFromLibrary(${idx})"
                         style="cursor: pointer; border: 2px solid #ddd; border-radius: 4px; overflow: hidden; transition: transform 0.2s;">
                        <img src="${photo.dataUrl}" alt="${photo.name}" style="width: 100%; height: 150px; object-fit: cover;">
                        <div style="padding: 0.5rem; font-size: 0.8rem; text-align: center; background: #f8f9fa;">${photo.name}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function closePhotoLibrary() {
    const modal = document.getElementById('photoLibraryModal');
    if (modal) {
        modal.remove();
    }
    currentZoneId = null;
}

function selectPhotoFromLibrary(photoIndex) {
    if (currentZoneId === null) return;

    // Find the zone and assign the photo
    brochureData.pages.forEach(page => {
        const zone = page.photoZones.find(z => z.id === currentZoneId);
        if (zone) {
            zone.photo = photoIndex;
        }
    });

    closePhotoLibrary();
    renderBrochure();
    saveBrochureData();
}

// Add regenerate button to text element (when selected)
function addRegenButton(element) {
    // Don't add if already exists
    if (element.querySelector('.regen-btn')) return;

    const regenBtn = document.createElement('button');
    regenBtn.className = 'regen-btn';
    regenBtn.innerHTML = '✨ Regenerate';
    regenBtn.style.cssText = `
        position: absolute;
        top: -35px;
        right: 0;
        background: linear-gradient(135deg, #E5A844 0%, #d99a3a 100%);
        color: white;
        border: none;
        padding: 0.4rem 0.8rem;
        border-radius: 6px;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        transition: all 0.2s;
    `;

    regenBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        quickRegenText(element);
    };

    regenBtn.onmouseover = () => {
        regenBtn.style.transform = 'translateY(-2px)';
        regenBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    };

    regenBtn.onmouseout = () => {
        regenBtn.style.transform = 'translateY(0)';
        regenBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    };

    // Make element position relative if not already
    if (!element.style.position || element.style.position === 'static') {
        element.style.position = 'relative';
    }

    element.appendChild(regenBtn);
}

// Add hover regenerate button (lighter version)
function addRegenButtonHover(element) {
    const regenBtn = document.createElement('button');
    regenBtn.className = 'regen-btn-hover';
    regenBtn.innerHTML = '✨';
    regenBtn.title = 'Regenerate this text';
    regenBtn.style.cssText = `
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: rgba(229, 168, 68, 0.8);
        color: white;
        border: none;
        padding: 0.3rem 0.6rem;
        border-radius: 4px;
        font-size: 0.9rem;
        cursor: pointer;
        z-index: 999;
        opacity: 0.7;
        transition: all 0.2s;
    `;

    regenBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        selectedElement = element;
        quickRegenText(element);
    };

    regenBtn.onmouseover = () => {
        regenBtn.style.opacity = '1';
        regenBtn.style.transform = 'scale(1.1)';
    };

    // Make element position relative if not already
    if (!element.style.position || element.style.position === 'static') {
        element.style.position = 'relative';
    }

    element.appendChild(regenBtn);
}

// Quick regenerate function
async function quickRegenText(element) {
    const originalText = element.textContent;

    if (!originalText || originalText.trim().length === 0) {
        showToast('warning', 'No text to regenerate');
        return;
    }

    // Track regeneration count
    const textBlockId = element.dataset.field || 'unknown';
    let regenCounts = JSON.parse(localStorage.getItem('ai_regeneration_counts') || '{}');
    const currentCount = regenCounts[textBlockId] || 0;

    // Calculate cost
    let cost = currentCount >= 2 ? 0.1 : 0;

    // Check credits if needed
    if (cost > 0) {
        const creditBalanceEl = document.getElementById('creditBalance');
        const creditBalance = creditBalanceEl ? parseFloat(creditBalanceEl.textContent) || 100 : 100;

        if (creditBalance < cost) {
            showToast('error', 'Insufficient credits');
            return;
        }

        if (!confirm(`This regeneration will cost ${cost} credits. Continue?`)) {
            return;
        }
    }

    // Show loading state
    element.style.opacity = '0.5';
    element.textContent = '✨ Generating...';

    try {
        const response = await fetch('/refine-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: originalText,
                instruction: 'Improve this text and make it more engaging and professional'
            })
        });

        if (!response.ok) throw new Error('Generation failed');

        const result = await response.json();

        // Update counts and credits
        regenCounts[textBlockId] = currentCount + 1;
        localStorage.setItem('ai_regeneration_counts', JSON.stringify(regenCounts));

        if (cost > 0) {
            const creditBalanceEl = document.getElementById('creditBalance');
            const aiCreditBalanceEl = document.getElementById('aiCreditBalance');
            const currentBalance = parseFloat(creditBalanceEl.textContent) || 100;
            const newBalance = Math.max(0, currentBalance - cost);

            creditBalanceEl.textContent = newBalance.toFixed(1) + ' credits';
            if (aiCreditBalanceEl) {
                aiCreditBalanceEl.textContent = newBalance.toFixed(1);
            }
        }

        // Apply new text
        element.textContent = result.refined_text;
        element.style.opacity = '1';

        saveState();
        saveBrochureData();

        showToast('success', '✨ Text regenerated!');

    } catch (error) {
        console.error('Regeneration error:', error);
        element.textContent = originalText;
        element.style.opacity = '1';
        showToast('error', 'Failed to regenerate text');
    }
}

// Open AI assistant for a specific page with dedicated chat modal
function openPageAIAssistant(pageId) {
    const page = brochureData.pages.find(p => p.id === pageId);
    if (!page) return;

    const pageIndex = brochureData.pages.indexOf(page);

    // Create AI chat modal
    const modal = document.createElement('div');
    modal.id = 'aiChatModal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.7); z-index: 10000;
        display: flex; align-items: center; justify-content: center;
        animation: fadeIn 0.3s;
    `;

    modal.innerHTML = `
        <div style="background: white; border-radius: 16px; width: 600px; max-width: 90vw; max-height: 80vh; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #00CED1 0%, #20B2AA 100%); color: white; padding: 1.5rem; border-radius: 16px 16px 0 0; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <span style="font-size: 2rem;">🤖</span>
                    <div>
                        <h3 style="margin: 0; font-size: 1.25rem;">AI Assistant</h3>
                        <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Page ${pageIndex + 1}: ${page.name}</p>
                    </div>
                </div>
                <button onclick="closeAIChatModal()" style="background: none; border: none; color: white; font-size: 2rem; cursor: pointer; width: 40px; height: 40px; border-radius: 50%; transition: background 0.2s;"
                        onmouseover="this.style.background='rgba(255,255,255,0.2)'"
                        onmouseout="this.style.background='none'">
                    ×
                </button>
            </div>

            <!-- Chat Messages -->
            <div id="aiChatMessages" style="flex: 1; overflow-y: auto; padding: 1.5rem; background: #f8f9fa; min-height: 300px;">
                <div style="background: #e3f2fd; padding: 1rem; border-radius: 12px; margin-bottom: 1rem; border-left: 4px solid #00CED1;">
                    <strong style="color: #00CED1;">AI:</strong> Hi! I'm here to help with this page. You can:
                    <ul style="margin: 0.5rem 0 0 0; padding-left: 1.5rem;">
                        <li>Ask me to improve any text on the page</li>
                        <li>Request new content ideas</li>
                        <li>Get suggestions for better wording</li>
                    </ul>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #666;">
                        <strong>Tip:</strong> Click on text in the page first, then tell me how to improve it!
                    </p>
                </div>
            </div>

            <!-- Input Area -->
            <div style="padding: 1.5rem; border-top: 2px solid #e0e0e0; background: white; border-radius: 0 0 16px 16px;">
                <textarea id="aiChatInput" placeholder="Type your instruction here... (e.g., 'Make it more engaging')"
                          style="width: 100%; min-height: 80px; padding: 1rem; border: 2px solid #e0e0e0; border-radius: 8px; font-family: inherit; font-size: 1rem; resize: vertical; margin-bottom: 1rem;"></textarea>
                <div style="display: flex; gap: 0.75rem; align-items: center;">
                    <button onclick="sendAIChatMessage()"
                            style="flex: 1; background: linear-gradient(135deg, #00CED1 0%, #20B2AA 100%); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s;"
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,206,209,0.4)'"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        ✨ Send & Refine
                    </button>
                    <div style="font-size: 0.85rem; color: #666;">
                        <strong id="aiChatCostLabel">FREE</strong>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Update cost label based on regeneration count
    if (selectedElement) {
        const textBlockId = selectedElement.dataset.field || 'unknown';
        const regenCounts = JSON.parse(localStorage.getItem('ai_regeneration_counts') || '{}');
        const currentCount = regenCounts[textBlockId] || 0;
        const remaining = Math.max(0, 2 - currentCount);

        const costLabel = document.getElementById('aiChatCostLabel');
        if (costLabel) {
            if (remaining > 0) {
                costLabel.textContent = `${remaining} FREE left`;
                costLabel.style.color = '#27ae60';
            } else {
                costLabel.textContent = '0.1 credits';
                costLabel.style.color = '#e67e22';
            }
        }
    }

    // Focus on input
    setTimeout(() => {
        const input = document.getElementById('aiChatInput');
        if (input) input.focus();
    }, 100);
}

function closeAIChatModal() {
    const modal = document.getElementById('aiChatModal');
    if (modal) modal.remove();
}

async function sendAIChatMessage() {
    if (!selectedElement) {
        addAIChatMessage('bot', '⚠️ Please click on some text in the page first, then I can help you improve it!');
        return;
    }

    const input = document.getElementById('aiChatInput');
    const instruction = input.value.trim();

    if (!instruction) {
        addAIChatMessage('bot', '⚠️ Please type an instruction (e.g., "Make it more professional")');
        return;
    }

    // Add user message
    addAIChatMessage('user', instruction);
    input.value = '';

    // Add loading message
    addAIChatMessage('bot', '✨ Working on it...');

    // Use the existing refineText function logic
    const originalText = selectedElement.textContent;
    const textBlockId = selectedElement.dataset.field || 'unknown';
    let regenCounts = JSON.parse(localStorage.getItem('ai_regeneration_counts') || '{}');
    const currentCount = regenCounts[textBlockId] || 0;
    const cost = currentCount >= 2 ? 0.1 : 0;

    try {
        const response = await fetch('/refine-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: originalText,
                instruction: instruction
            })
        });

        if (!response.ok) throw new Error('Refinement failed');

        const result = await response.json();

        // Remove loading message
        const chatMessages = document.getElementById('aiChatMessages');
        chatMessages.lastChild.remove();

        // Add result
        addAIChatMessage('bot', `✨ Here's the improved text:\n\n"${result.refined_text}"\n\nDo you want to apply this?`);

        // Add apply button
        const applyBtn = document.createElement('button');
        applyBtn.innerHTML = '✓ Apply This Text';
        applyBtn.style.cssText = 'background: #27ae60; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 0.5rem;';
        applyBtn.onclick = () => {
            selectedElement.textContent = result.refined_text;
            regenCounts[textBlockId] = currentCount + 1;
            localStorage.setItem('ai_regeneration_counts', JSON.stringify(regenCounts));

            if (cost > 0) {
                const creditBalanceEl = document.getElementById('creditBalance');
                const currentBalance = parseFloat(creditBalanceEl.textContent) || 100;
                creditBalanceEl.textContent = (currentBalance - cost).toFixed(1) + ' credits';
            }

            saveState();
            saveBrochureData();
            addAIChatMessage('bot', '✓ Applied! The text has been updated.');
            applyBtn.remove();
        };
        chatMessages.lastChild.appendChild(applyBtn);

    } catch (error) {
        const chatMessages = document.getElementById('aiChatMessages');
        chatMessages.lastChild.remove();
        addAIChatMessage('bot', '❌ Sorry, something went wrong. Please try again.');
    }
}

function addAIChatMessage(type, text) {
    const chatMessages = document.getElementById('aiChatMessages');
    if (!chatMessages) return;

    const msgDiv = document.createElement('div');
    msgDiv.style.cssText = type === 'user'
        ? 'background: #fff9f0; padding: 1rem; border-radius: 12px; margin-bottom: 1rem; border-left: 4px solid #E5A844;'
        : 'background: #e3f2fd; padding: 1rem; border-radius: 12px; margin-bottom: 1rem; border-left: 4px solid #00CED1;';

    const label = type === 'user' ? 'You' : 'AI';
    const labelColor = type === 'user' ? '#E5A844' : '#00CED1';

    msgDiv.innerHTML = `<strong style="color: ${labelColor};">${label}:</strong> ${text.replace(/\n/g, '<br>')}`;
    chatMessages.appendChild(msgDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Polyfill for URLSearchParams if needed
class URLParams {
    constructor(search) {
        this.params = {};
        if (search) {
            search.substring(1).split('&').forEach(param => {
                const [key, value] = param.split('=');
                this.params[key] = value;
            });
        }
    }
    get(key) {
        return this.params[key];
    }
}
