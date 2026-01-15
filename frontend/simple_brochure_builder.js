/**
 * ═══════════════════════════════════════════════════════════════════════
 * SIMPLE BROCHURE BUILDER - Clean Rebuild
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Clean, predictable brochure generation that actually works.
 *
 * Flow:
 * 1. Click Generate → Collect photos from window.uploadedPhotos
 * 2. Distribute photos across pages intelligently
 * 3. Create simple page structure with photos + text
 * 4. Open interactive editor
 * 5. Export to PDF
 */

console.log('🏗️ Simple Brochure Builder loaded');

// ═══════════════════════════════════════════════════════════════════════
// GLOBAL STATE - One source of truth
// ═══════════════════════════════════════════════════════════════════════

window.SimpleBrochureState = {
    pages: [],           // Array of page objects
    allPhotos: [],       // All uploaded photos
    property: {},        // Property data from form
    agent: {},          // Agent data
    floorplan: null     // Floor plan if uploaded
};

// ═══════════════════════════════════════════════════════════════════════
// STEP 1: COLLECT DATA
// ═══════════════════════════════════════════════════════════════════════

function collectFormData() {
    console.log('📝 Collecting form data...');

    // Get photos from window.uploadedPhotos (set by app_v2.js)
    const photos = window.uploadedPhotos || [];
    console.log(`📸 Found ${photos.length} uploaded photos`);

    // Get property details
    const property = {
        address: document.getElementById('address')?.value || '',
        postcode: document.getElementById('postcode')?.value || '',
        price: document.getElementById('askingPrice')?.value || '',
        bedrooms: document.querySelectorAll('input[name="features"][value*="bedroom"]:checked').length,
        bathrooms: document.querySelectorAll('input[name="features"][value*="bathroom"]:checked').length,
        propertyType: document.getElementById('propertyType')?.value || '',
        description: document.getElementById('propertyDescription')?.value || ''
    };

    // Get agent info
    const agent = {
        name: document.getElementById('agentName')?.value || '',
        phone: document.getElementById('agentPhone')?.value || '',
        email: document.getElementById('agentEmail')?.value || ''
    };

    // Floor plan
    const floorplan = window.floorplanFile || null;

    return { photos, property, agent, floorplan };
}

// ═══════════════════════════════════════════════════════════════════════
// STEP 2: GENERATE PAGES - Simple and Predictable
// ═══════════════════════════════════════════════════════════════════════

function generateSimpleBrochurePages(photos, property, agent, floorplan) {
    console.log('📄 Generating brochure pages...');

    const pages = [];
    let pageId = 1;

    // ─────────────────────────────────────────────────────────────────
    // PAGE 1: COVER PAGE (Hero Image)
    // ─────────────────────────────────────────────────────────────────

    // Find best cover photo (exterior, garden, or first photo)
    let coverPhoto = photos.find(p => p.category === 'exterior' || p.category === 'garden');
    if (!coverPhoto && photos.length > 0) {
        coverPhoto = photos[0];
    }

    if (coverPhoto) {
        pages.push({
            id: pageId++,
            type: 'cover',
            title: 'Welcome Home',
            photos: [coverPhoto],
            content: {
                address: property.address,
                price: property.price
            }
        });

        console.log('✅ Cover page created with photo:', coverPhoto.filename);
    }

    // ─────────────────────────────────────────────────────────────────
    // PAGES 2-N: INTERIOR PAGES (2-4 photos per page)
    // ─────────────────────────────────────────────────────────────────

    // Get remaining photos (excluding cover photo)
    const remainingPhotos = photos.filter(p => p !== coverPhoto);

    // Group photos into pages (3 photos per page works well)
    const photosPerPage = 3;

    for (let i = 0; i < remainingPhotos.length; i += photosPerPage) {
        const pagePhotos = remainingPhotos.slice(i, i + photosPerPage);

        // Determine page title based on photo categories
        let pageTitle = 'Interior Views';
        if (pagePhotos[0]?.category) {
            const category = pagePhotos[0].category;
            pageTitle = category.charAt(0).toUpperCase() + category.slice(1);
        }

        pages.push({
            id: pageId++,
            type: 'interior',
            title: pageTitle,
            photos: pagePhotos,
            content: {
                description: property.description
            }
        });

        console.log(`✅ Interior page ${pageId - 1} created with ${pagePhotos.length} photos`);
    }

    // ─────────────────────────────────────────────────────────────────
    // FLOOR PLAN PAGE (if uploaded)
    // ─────────────────────────────────────────────────────────────────

    if (floorplan) {
        pages.push({
            id: pageId++,
            type: 'floorplan',
            title: 'Property Layout',
            photos: [],
            content: {
                floorplan: floorplan
            }
        });

        console.log('✅ Floor plan page created');
    }

    // ─────────────────────────────────────────────────────────────────
    // LAST PAGE: AGENT CONTACT
    // ─────────────────────────────────────────────────────────────────

    pages.push({
        id: pageId++,
        type: 'contact',
        title: 'Get In Touch',
        photos: [],
        content: {
            agent: agent
        }
    });

    console.log('✅ Contact page created');

    console.log(`📊 Total pages created: ${pages.length}`);
    return pages;
}

// ═══════════════════════════════════════════════════════════════════════
// STEP 3: MAIN GENERATION FUNCTION
// ═══════════════════════════════════════════════════════════════════════

async function generateSimpleBrochure() {
    console.log('🚀 Starting simple brochure generation...');

    try {
        // Step 1: Collect data
        const { photos, property, agent, floorplan } = collectFormData();

        // Validate minimum requirements
        if (!photos || photos.length === 0) {
            alert('⚠️ Please upload at least one photo before generating the brochure.');
            return;
        }

        if (!property.address) {
            alert('⚠️ Please enter a property address before generating the brochure.');
            return;
        }

        // Step 2: Generate pages
        const pages = generateSimpleBrochurePages(photos, property, agent, floorplan);

        // Step 3: Store in global state
        window.SimpleBrochureState = {
            pages: pages,
            allPhotos: photos,
            property: property,
            agent: agent,
            floorplan: floorplan
        };

        console.log('✅ Brochure state saved:', window.SimpleBrochureState);

        // Step 4: Open interactive editor
        if (typeof renderSimpleEditor === 'function') {
            renderSimpleEditor();
        } else {
            console.error('❌ Simple editor not loaded!');
            alert('Editor not available. Please refresh the page.');
        }

    } catch (error) {
        console.error('❌ Error generating brochure:', error);
        alert('Failed to generate brochure. Please try again.');
    }
}

// ═══════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════

window.generateSimpleBrochure = generateSimpleBrochure;

console.log('✅ Simple Brochure Builder ready');
