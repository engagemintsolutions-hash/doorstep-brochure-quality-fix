/**
 * ═══════════════════════════════════════════════════════════════════════
 * UNIFIED BROCHURE BUILDER SYSTEM - COMPLETE REBUILD
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Clean, unified system for brochure generation with clear data flow:
 * Form Data → Photo Upload → Auto-Categorize → Generate Pages → Preview → Export
 *
 * NO legacy dependencies, NO complex hooks, NO competing systems.
 * Everything happens synchronously with immediate visual feedback.
 */

console.log('🚀 Unified Brochure Builder System Loading...');

// ═══════════════════════════════════════════════════════════════════════
// GLOBAL STATE - Single Source of Truth
// ═══════════════════════════════════════════════════════════════════════

window.UnifiedBrochureState = {
    // Form data
    property: {
        houseName: '',
        address: '',
        postcode: '',
        askingPrice: '',
        bedrooms: 0,
        bathrooms: 0,
        propertyType: '',
        sizeSqft: 0,
        tenure: '',
        councilTaxBand: '',
        epcRating: '',
        features: [],
        locationEnrichment: {
            schools: '',
            amenities: '',
            transport: ''
        }
    },

    // Agent data
    agent: {
        name: '',
        phone: '',
        email: '',
        includePhoto: true
    },

    // Photos with categories
    photos: [],
    categorizedPhotos: {
        cover: [],
        exterior: [],
        interior: [],
        kitchen: [],
        bedrooms: [],
        bathrooms: [],
        garden: []
    },

    // Generated pages
    pages: [],

    // Status
    status: {
        formComplete: false,
        photosUploaded: false,
        photosCategorized: false,
        pagesGenerated: false,
        readyToExport: false
    }
};

// ═══════════════════════════════════════════════════════════════════════
// PHASE 1: FORM DATA CAPTURE
// ═══════════════════════════════════════════════════════════════════════

function captureFormData() {
    console.log('📋 Capturing form data...');

    const state = window.UnifiedBrochureState;

    // Property details
    state.property.houseName = document.getElementById('houseName')?.value || '';
    state.property.address = document.getElementById('address')?.value || '';
    state.property.postcode = document.getElementById('postcode')?.value || '';
    state.property.askingPrice = document.getElementById('askingPrice')?.value || '';
    state.property.bedrooms = parseInt(document.getElementById('bedrooms')?.value) || 0;
    state.property.bathrooms = parseInt(document.getElementById('bathrooms')?.value) || 0;
    state.property.propertyType = document.getElementById('propertyType')?.value || 'house';
    state.property.sizeSqft = parseInt(document.getElementById('sizeSqft')?.value) || 0;
    state.property.tenure = document.getElementById('tenure')?.value || '';
    state.property.councilTaxBand = document.getElementById('councilTaxBand')?.value || '';
    state.property.epcRating = document.getElementById('epcRating')?.value || '';

    // Features (checkboxes)
    state.property.features = Array.from(document.querySelectorAll('input[name="features"]:checked')).map(el => el.value);

    // Location enrichment
    state.property.locationEnrichment.schools = document.getElementById('enrichmentSchools')?.value || '';
    state.property.locationEnrichment.amenities = document.getElementById('enrichmentAmenities')?.value || '';
    state.property.locationEnrichment.transport = document.getElementById('enrichmentTransport')?.value || '';

    // Agent details
    const userEmail = localStorage.getItem('userEmail');
    state.agent.name = document.getElementById('agentName')?.value || 'James Smith';
    state.agent.phone = document.getElementById('agentPhone')?.value || '+44 7700 900123';
    state.agent.email = document.getElementById('agentEmail')?.value || userEmail || 'james.smith@savills.com';
    state.agent.includePhoto = document.getElementById('includeAgentPhoto')?.checked || true;

    // Validation
    const isValid = state.property.address && state.property.postcode;
    state.status.formComplete = isValid;

    console.log('✅ Form data captured:', {
        address: state.property.address,
        price: state.property.askingPrice,
        beds: state.property.bedrooms,
        valid: isValid
    });

    return isValid;
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 2: PHOTO UPLOAD & CATEGORIZATION (SYNCHRONOUS)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Categorize photo IMMEDIATELY during upload
 * No async delays, no hooks, no waiting
 */
function categorizePhotoSync(photoData) {
    const filename = photoData.name.toLowerCase();

    // Category keyword mappings
    const categories = {
        cover: ['cover', 'hero', 'main'],
        exterior: ['exterior', 'outside', 'front', 'facade', 'building', 'street', 'drive'],
        kitchen: ['kitchen', 'cooking', 'dining'],
        bedrooms: ['bedroom', 'bed', 'master', 'guest', 'sleep'],
        bathrooms: ['bathroom', 'bath', 'shower', 'toilet', 'ensuite', 'wc'],
        garden: ['garden', 'outdoor', 'patio', 'terrace', 'yard', 'deck', 'balcony', 'pool', 'swimming'],
        interior: ['living', 'lounge', 'reception', 'hall', 'stairs', 'study', 'office']
    };

    // Check filename for keywords
    for (const [category, keywords] of Object.entries(categories)) {
        for (const keyword of keywords) {
            if (filename.includes(keyword)) {
                return category;
            }
        }
    }

    // Default: interior
    return 'interior';
}

/**
 * Normalize vision API room_type to single category
 */
function normalizeRoomTypeToCategory(roomType) {
    if (!roomType) return 'interior';

    const normalized = roomType.toLowerCase().trim();

    // Priority mapping for multi-category responses
    if (normalized.includes('kitchen')) return 'kitchen';
    if (normalized.includes('bedroom')) return 'bedrooms';
    if (normalized.includes('bathroom')) return 'bathrooms';
    if (normalized.includes('garden') || normalized.includes('outdoor')) return 'garden';
    if (normalized.includes('living') || normalized.includes('lounge') || normalized.includes('reception')) return 'interior';
    if (normalized.includes('dining')) return 'interior';
    if (normalized.includes('exterior') || normalized.includes('front') || normalized.includes('building')) return 'exterior';

    // Fallback
    return 'interior';
}

/**
 * Sync existing uploadedPhotos array to unified state
 * Called after photos are uploaded via the existing system
 */
async function syncPhotosToUnifiedState() {
    console.log('🔄 Syncing photos to unified state...');

    // Check if uploadedPhotos exists
    if (!window.uploadedPhotos || window.uploadedPhotos.length === 0) {
        console.warn('⚠️ No photos to sync');
        return;
    }

    // CRITICAL DEBUG: Log all photo names to track missing photos
    console.log(`📸 Total uploadedPhotos BEFORE sync: ${window.uploadedPhotos.length}`);
    console.log('📸 All photo names:', window.uploadedPhotos.map((p, i) => `[${i}] ${p.name}`).join(', '));

    // ═══════════════════════════════════════════════════════════════════════
    // LOCATION-FIRST STRATEGY: Split photos BEFORE any processing
    // ═══════════════════════════════════════════════════════════════════════
    const locationPhotoIds = window.selectedLocationPhotos || [];

    // Split into propertyPhotos and locationPhotos arrays
    const propertyPhotos = window.uploadedPhotos.filter(p => !locationPhotoIds.includes(p.id));
    const locationPhotos = window.uploadedPhotos.filter(p => locationPhotoIds.includes(p.id));

    console.log(`📍 LOCATION-FIRST SPLIT:`);
    console.log(`   Property photos (for analysis): ${propertyPhotos.length}`);
    console.log(`   Location photos (bypass pipeline): ${locationPhotos.length}`);
    if (locationPhotos.length > 0) {
        console.log(`   Location photo names: ${locationPhotos.map(p => p.name).join(', ')}`);
    }

    // Reset state
    window.UnifiedBrochureState.photos = [];
    window.UnifiedBrochureState.categorizedPhotos = {
        cover: [],
        exterior: [],
        interior: [],
        kitchen: [],
        bedrooms: [],
        bathrooms: [],
        garden: []
    };

    // Call vision API with BATCH PROCESSING (3 photos at a time to avoid timeout)
    // ONLY PROCESS PROPERTY PHOTOS - location photos bypass vision API entirely
    console.log('🔍 Calling vision API with batch processing...');
    let visionAnalysis = [];

    try {
        const BATCH_SIZE = 3; // Process 3 photos at a time
        const totalPhotos = propertyPhotos.length;

        console.log(`📦 Processing ${totalPhotos} property photos in batches of ${BATCH_SIZE}...`);

        for (let i = 0; i < totalPhotos; i += BATCH_SIZE) {
            const batch = propertyPhotos.slice(i, i + BATCH_SIZE);
            console.log(`   Batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(totalPhotos/BATCH_SIZE)}: Processing photos ${i+1}-${Math.min(i+BATCH_SIZE, totalPhotos)}`);

            const formData = new FormData();

            // Add batch photos to FormData
            for (const photo of batch) {
                const response = await fetch(photo.dataUrl);
                const blob = await response.blob();
                const file = new File([blob], photo.name, { type: blob.type });
                formData.append('files', file);
            }

            // Call vision API with timeout for this batch
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout per batch

            const apiResponse = await fetch('/analyze-images', {
                method: 'POST',
                body: formData,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (apiResponse.ok) {
                const batchResults = await apiResponse.json();
                visionAnalysis.push(...batchResults);
                console.log(`   ✅ Batch ${Math.floor(i/BATCH_SIZE) + 1} complete: ${batchResults.length} photos analyzed`);
            } else {
                console.warn(`   ⚠️ Batch ${Math.floor(i/BATCH_SIZE) + 1} failed, using filename fallback for these photos`);
                // Add empty results for this batch so indices match
                for (let j = 0; j < batch.length; j++) {
                    visionAnalysis.push(null);
                }
            }
        }

        console.log(`✅ Vision API complete: ${visionAnalysis.filter(v => v !== null).length}/${totalPhotos} photos analyzed successfully`);

    } catch (error) {
        if (error.name === 'AbortError') {
            console.warn('⚠️ Vision API batch timeout, using filename-based categorization for remaining photos');
        } else {
            console.warn('⚠️ Vision API error, using filename-based categorization:', error);
        }
    }

    // Process PROPERTY PHOTOS ONLY (location photos bypass entirely)
    propertyPhotos.forEach((photo, index) => {
        // Ensure photo has required fields
        const photoData = {
            id: photo.id || `photo_${Date.now()}_${index}`,
            index: index,
            name: photo.name || `Photo ${index + 1}`,
            dataUrl: photo.dataUrl || photo.url,
            size: photo.size || 0,
            uploadedAt: photo.uploadedAt || Date.now()
        };

        // Get vision analysis if available
        const vision = visionAnalysis[index];
        if (vision) {
            photoData.roomType = vision.room_type || categorizePhotoSync(photoData);
            photoData.attributes = vision.attributes || [];
            photoData.caption = vision.caption || '';
            // NORMALIZE: Convert vision API's multi-category response to single valid category
            photoData.category = normalizeRoomTypeToCategory(photoData.roomType);
            // Extract attribute text for logging
            const attrTexts = photoData.attributes.map(attr =>
                typeof attr === 'string' ? attr : (attr.attribute || attr.description || String(attr))
            ).join(', ');
            console.log(`✅ Vision: "${photoData.name}" → ${photoData.roomType} → normalized to "${photoData.category}" (${attrTexts})`);
        } else {
            // Fallback to filename categorization
            const category = categorizePhotoSync(photoData);
            photoData.category = category;
            photoData.roomType = category;
            photoData.attributes = [category];
            photoData.caption = `${category.charAt(0).toUpperCase() + category.slice(1)} photo`;
        }

        // Add to state
        window.UnifiedBrochureState.photos.push(photoData);

        // Ensure category array exists before pushing
        if (!window.UnifiedBrochureState.categorizedPhotos[photoData.category]) {
            window.UnifiedBrochureState.categorizedPhotos[photoData.category] = [];
        }
        window.UnifiedBrochureState.categorizedPhotos[photoData.category].push(photoData);

        console.log(`✅ Synced "${photoData.name}" as "${photoData.category}"`);
    });

    // Location photos do NOT go into state.photos or categorizedPhotos - they stay separate
    console.log(`📍 Location photos stored separately: ${locationPhotos.length} photos`);

    console.log(`📸 Total photos AFTER sync: ${window.UnifiedBrochureState.photos.length}`);
    console.log('📸 Synced photo names:', window.UnifiedBrochureState.photos.map(p => p.name).join(', '));

    // Auto-assign cover if none
    if (window.UnifiedBrochureState.categorizedPhotos.cover.length === 0 &&
        window.UnifiedBrochureState.categorizedPhotos.exterior.length > 0) {
        const firstExterior = window.UnifiedBrochureState.categorizedPhotos.exterior[0];
        window.UnifiedBrochureState.categorizedPhotos.cover.push(firstExterior);
        console.log('✅ Auto-assigned first exterior photo as cover');
    }

    // Update status
    window.UnifiedBrochureState.status.photosUploaded = true;
    window.UnifiedBrochureState.status.photosCategorized = true;

    // Log summary
    const summary = Object.entries(window.UnifiedBrochureState.categorizedPhotos)
        .map(([cat, photos]) => `${cat}: ${photos.length}`)
        .join(', ');
    console.log(`✅ Photo sync complete: ${summary}`);

    return window.UnifiedBrochureState.categorizedPhotos;
}

// Export to global scope
window.syncPhotosToUnifiedState = syncPhotosToUnifiedState;

/**
 * Enhanced photo processing during upload
 */
async function processPhotoUpload(file, index) {
    try {
        // Compress image
        const reader = new FileReader();
        const dataUrl = await new Promise((resolve) => {
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });

        // Create photo object
        const photoData = {
            id: `photo_${Date.now()}_${index}`,
            index: index,
            name: file.name,
            dataUrl: dataUrl,
            size: file.size,
            uploadedAt: Date.now()
        };

        // IMMEDIATELY categorize
        const category = categorizePhotoSync(photoData);
        photoData.category = category;

        // Add to state
        window.UnifiedBrochureState.photos.push(photoData);
        window.UnifiedBrochureState.categorizedPhotos[category].push(photoData);

        console.log(`✅ Categorized "${file.name}" as "${category}"`);

        return photoData;

    } catch (error) {
        console.error('❌ Photo processing error:', error);
        return null;
    }
}

/**
 * Initialize photo upload system
 */
function initPhotoUpload() {
    const imageInput = document.getElementById('imageInput');
    if (!imageInput) {
        console.warn('⚠️ Image input not found');
        return;
    }

    imageInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        console.log(`📸 Processing ${files.length} photos...`);

        // Process all photos
        for (let i = 0; i < files.length; i++) {
            await processPhotoUpload(files[i], window.UnifiedBrochureState.photos.length);
        }

        // Update state
        window.UnifiedBrochureState.status.photosUploaded = true;
        window.UnifiedBrochureState.status.photosCategorized = true;

        // Auto-assign cover if needed
        autoAssignCover();

        // Show feedback
        updatePhotoStats();
        showCategorizedPhotos();

        if (typeof showToast === 'function') {
            showToast('success', `✅ Uploaded & categorized ${files.length} photos`);
        }
    });

    console.log('📸 Photo upload system initialized');
}

/**
 * Auto-assign first exterior photo as cover if no cover exists
 */
function autoAssignCover() {
    const state = window.UnifiedBrochureState;

    if (state.categorizedPhotos.cover.length === 0 &&
        state.categorizedPhotos.exterior.length > 0) {

        const firstExterior = state.categorizedPhotos.exterior[0];
        state.categorizedPhotos.cover.push(firstExterior);

        console.log('✅ Auto-assigned first exterior photo as cover');
    }
}

/**
 * Show categorized photos in UI
 */
function showCategorizedPhotos() {
    const state = window.UnifiedBrochureState;
    const categories = ['cover', 'exterior', 'interior', 'kitchen', 'bedrooms', 'bathrooms', 'garden'];

    categories.forEach(category => {
        const photos = state.categorizedPhotos[category];
        console.log(`  ${category}: ${photos.length} photos`);
    });
}

/**
 * Update photo statistics display
 */
function updatePhotoStats() {
    const state = window.UnifiedBrochureState;
    const totalPhotos = state.photos.length;
    const categorized = Object.values(state.categorizedPhotos).reduce((sum, arr) => sum + arr.length, 0);

    console.log(`📊 Photo Stats: ${totalPhotos} uploaded, ${categorized} categorized`);
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 3: SMART PAGE GENERATION
// ═══════════════════════════════════════════════════════════════════════

/**
 * Detect property character for smart page generation
 */
function detectPropertyCharacter() {
    const state = window.UnifiedBrochureState;
    const bedrooms = state.property.bedrooms;
    const price = parseInt(state.property.askingPrice?.replace(/[£,]/g, '')) || 0;
    const sizeSqft = state.property.sizeSqft;
    const hasGarden = state.categorizedPhotos.garden.length > 0;

    if (price >= 1000000 || bedrooms >= 5) return 'luxury';
    if (bedrooms >= 4 && price >= 500000 && sizeSqft >= 2000) return 'executive';
    if (bedrooms >= 3 && hasGarden) return 'family';
    if (bedrooms <= 2) return 'compact';
    return 'modern';
}

/**
 * Generate page titles based on property character
 */
function getPageTitle(pageType, character) {
    const titles = {
        intro: {
            luxury: 'Executive Summary',
            executive: 'Property Overview',
            family: 'Welcome Home',
            compact: 'Your Perfect Space',
            modern: 'Contemporary Living'
        },
        living: {
            luxury: 'Entertain in Elegance',
            executive: 'Sophisticated Living',
            family: 'Spaces for Living',
            compact: 'Smart Living',
            modern: 'Open-Plan Living'
        },
        bedrooms: {
            luxury: 'Private Sanctuaries',
            executive: 'Luxurious Bedrooms',
            family: 'Peaceful Retreats',
            compact: 'Restful Bedrooms',
            modern: 'Modern Bedrooms'
        }
    };

    return titles[pageType]?.[character] || pageType;
}

/**
 * Generate brochure pages with automatic page adjustment based on photo count
 */
function generateBrochurePages() {
    console.log('📄 Generating brochure pages with dynamic photo distribution...');

    const state = window.UnifiedBrochureState;
    const photos = state.categorizedPhotos;
    const property = state.property;
    const pages = [];
    let pageId = 1;

    const PHOTOS_PER_PAGE = 6; // Maximum photos per page for optimal layout

    // Detect character
    const character = detectPropertyCharacter();
    console.log(`🏠 Property character: ${character}`);

    // PAGE 1: COVER (always 1 photo)
    const coverPhoto = photos.cover.length > 0 ? photos.cover[0] :
                      (photos.exterior.length > 0 ? photos.exterior[0] : null);

    pages.push({
        id: pageId++,
        type: 'cover',
        title: property.houseName || property.address || 'Welcome',
        photos: coverPhoto ? [coverPhoto] : [],
        content: []
    });

    // IMPORTANT: Create filter function to exclude cover photo from ALL other pages
    const isNotCoverPhoto = (photo) => {
        if (!coverPhoto) return true;
        return photo.id !== coverPhoto.id;
    };

    // PROPERTY OVERVIEW PAGE (after cover)
    // Select 3 best photos from kitchen, dining, exterior, garden (exclude bathrooms/bedrooms AND cover photo)
    const overviewPhotoCandidates = [
        ...photos.kitchen.filter(isNotCoverPhoto),
        ...photos.interior.filter(p => p.roomType !== 'bedroom' && isNotCoverPhoto(p)), // Include living/dining, exclude cover
        ...photos.exterior.filter(isNotCoverPhoto), // Exclude cover photo
        ...photos.garden.filter(isNotCoverPhoto)
    ];
    const overviewPhotos = overviewPhotoCandidates.slice(0, 3); // Take best 3

    if (overviewPhotos.length > 0) {
        pages.push({
            id: pageId++,
            type: 'overview',
            title: 'Property Overview',
            photos: overviewPhotos,
            content: {
                price: property.askingPrice,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                propertyType: property.propertyType,
                features: property.features || [],
                agent: state.agent
            }
        });
        console.log(`📄 Added Property Overview page with ${overviewPhotos.length} photos`);
    }

    // HELPER: Create pages from a photo array with a title
    const createPagesFromPhotos = (photoArray, pageType, baseTitle) => {
        const localPages = [];
        for (let i = 0; i < photoArray.length; i += PHOTOS_PER_PAGE) {
            const chunk = photoArray.slice(i, i + PHOTOS_PER_PAGE);
            const pageNumber = Math.floor(i / PHOTOS_PER_PAGE) + 1;
            const title = photoArray.length > PHOTOS_PER_PAGE
                ? `${baseTitle} (${pageNumber})`
                : baseTitle;

            localPages.push({
                id: pageId++,
                type: pageType,
                title: title,
                photos: chunk,
                content: []
            });
        }
        return localPages;
    };

    // KITCHEN PHOTOS (exclude cover)
    const kitchenPhotos = photos.kitchen.filter(isNotCoverPhoto);
    if (kitchenPhotos.length > 0) {
        pages.push(...createPagesFromPhotos(kitchenPhotos, 'kitchen', 'Kitchen'));
    }

    // LIVING/INTERIOR PHOTOS (exclude cover)
    const interiorPhotos = photos.interior.filter(isNotCoverPhoto);
    if (interiorPhotos.length > 0) {
        pages.push(...createPagesFromPhotos(interiorPhotos, 'living', getPageTitle('living', character)));
    }

    // BEDROOM PHOTOS (exclude cover)
    const bedroomPhotos = photos.bedrooms.filter(isNotCoverPhoto);
    if (bedroomPhotos.length > 0) {
        pages.push(...createPagesFromPhotos(bedroomPhotos, 'bedrooms', getPageTitle('bedrooms', character)));
    }

    // BATHROOM PHOTOS (exclude cover)
    const bathroomPhotos = photos.bathrooms.filter(isNotCoverPhoto);
    if (bathroomPhotos.length > 0) {
        pages.push(...createPagesFromPhotos(bathroomPhotos, 'bathrooms', 'Bathrooms'));
    }

    // EXTERIOR PHOTOS (building exteriors only, exclude cover)
    const remainingExterior = photos.exterior.filter(isNotCoverPhoto);
    if (remainingExterior.length > 0) {
        pages.push(...createPagesFromPhotos(remainingExterior, 'exterior', 'Exterior'));
    }

    // GARDEN/OUTDOOR PHOTOS (exclude cover) - Moved to end for better flow
    const gardenPhotos = photos.garden.filter(isNotCoverPhoto);
    if (gardenPhotos.length > 0) {
        pages.push(...createPagesFromPhotos(gardenPhotos, 'garden', 'Garden & Outdoor Spaces'));
    }

    // FLOOR PLAN PAGE (check window.propertyFloorPlan or photos.floorPlan)
    // For window.propertyFloorPlan, we need to convert it to dataUrl synchronously
    // This is done BEFORE buildPages is called, so we check if it's already been converted
    if (window.floorplanDataUrl) {
        // Floorplan has been pre-converted to dataUrl
        const floorplanPhoto = {
            id: 'floorplan_' + Date.now(),
            name: 'Floor Plan',
            dataUrl: window.floorplanDataUrl,
            category: 'floorplan'
        };

        pages.push({
            id: pageId++,
            type: 'floorplan',
            title: 'Floor Plan',
            photos: [floorplanPhoto],
            content: {
                address: property.address,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                propertyType: property.propertyType
            },
            layout: 'photos-only'
        });
        console.log('📐 Added Floor Plan page from window.floorplanDataUrl');
    } else if (photos.floorPlan && photos.floorPlan.length > 0) {
        pages.push({
            id: pageId++,
            type: 'floorplan',
            title: 'Floor Plan',
            photos: [photos.floorPlan[0]], // Just the floor plan image
            content: {
                address: property.address,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                propertyType: property.propertyType
            },
            layout: 'photos-only'
        });
        console.log('📐 Added Floor Plan page from photos.floorPlan');
    }

    // LOCATION PAGE (with location photos pulled directly from uploadedPhotos)
    const locationPhotoIds = window.selectedLocationPhotos || [];
    const locationPhotos = [];

    // Pull location photos directly from window.uploadedPhotos using IDs
    if (locationPhotoIds.length > 0 && window.uploadedPhotos) {
        locationPhotoIds.forEach(photoId => {
            const photo = window.uploadedPhotos.find(p => p.id === photoId);
            if (photo) {
                locationPhotos.push({
                    id: photo.id,
                    name: photo.name,
                    dataUrl: photo.dataUrl || photo.url,
                    category: 'location',
                    caption: ''  // No caption for location photos
                });
            }
        });
        console.log(`📍 Found ${locationPhotos.length} location photos: ${locationPhotos.map(p => p.name).join(', ')}`);
    }

    pages.push({
        id: pageId++,
        type: 'location',
        title: 'The Location',
        photos: locationPhotos,
        layout: 'photo-left', // Default layout
        content: {
            address: property.address,
            locationName: 'Cranleigh', // You can make this dynamic if needed
            generateAI: true // Flag to trigger AI generation in editor
        }
    });
    console.log(`📍 Added Location page with ${locationPhotos.length} photos`);

    // FINAL PAGE: AGENT CONTACT
    if (state.agent.includePhoto) {
        pages.push({
            id: pageId++,
            type: 'contact',
            title: 'Contact Your Agent',
            photos: [],
            content: [
                { type: 'agent_contact',
                  name: state.agent.name,
                  phone: state.agent.phone,
                  email: state.agent.email
                }
            ]
        });
    }

    // Update state
    state.pages = pages;
    state.status.pagesGenerated = true;
    state.status.readyToExport = true;

    const totalPhotosInPages = pages.reduce((sum, page) => sum + page.photos.length, 0);
    console.log(`✅ Generated ${pages.length} pages with ${totalPhotosInPages} photos (${PHOTOS_PER_PAGE} max per page)`);

    return pages;
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 4: LIVE PREVIEW
// ═══════════════════════════════════════════════════════════════════════

/**
 * Render brochure preview
 */
function renderBrochurePreview() {
    const state = window.UnifiedBrochureState;
    const pages = state.pages;

    // Find or create preview container
    let previewContainer = document.getElementById('pageBuilderPreview');

    if (!previewContainer) {
        // Try alternative ID
        previewContainer = document.getElementById('unifiedBrochurePreview');
    }

    if (!previewContainer) {
        // Create new container
        previewContainer = document.createElement('div');
        previewContainer.id = 'unifiedBrochurePreview';
        previewContainer.style.cssText = `
            margin: 2rem 0;
            padding: 2rem;
            background: #f8f9fa;
            border-radius: 12px;
            border: 2px solid #dee2e6;
        `;

        // Insert after page builder section
        const builderSection = document.getElementById('pageBuilderSection');
        if (builderSection) {
            builderSection.appendChild(previewContainer);
        } else {
            // Fallback: insert at end of body
            document.body.appendChild(previewContainer);
        }
    }

    // Show the container
    previewContainer.style.display = 'block';

    // Build preview HTML
    let html = `
        <h2 style="margin-bottom: 1.5rem; color: #212529;">
            📖 Brochure Preview
        </h2>
        <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
            <div style="padding: 1rem; background: white; border-radius: 8px; flex: 1;">
                <strong>${pages.length}</strong> Pages
            </div>
            <div style="padding: 1rem; background: white; border-radius: 8px; flex: 1;">
                <strong>${state.photos.length}</strong> Photos
            </div>
            <div style="padding: 1rem; background: white; border-radius: 8px; flex: 1;">
                <strong>${state.property.address || 'Property'}</strong>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
    `;

    pages.forEach((page, index) => {
        const photoCount = page.photos.length;
        const firstPhoto = page.photos[0];

        html += `
            <div style="background: white; border-radius: 8px; padding: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="font-weight: bold; margin-bottom: 0.5rem;">
                    Page ${index + 1}: ${page.title}
                </div>
                ${firstPhoto ? `
                    <img src="${firstPhoto.dataUrl}"
                         style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 0.5rem;" />
                ` : ''}
                <div style="font-size: 0.875rem; color: #6c757d;">
                    ${photoCount} photo${photoCount !== 1 ? 's' : ''}
                </div>
            </div>
        `;
    });

    html += `
        </div>
        <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
            <button onclick="exportBrochureToPDF()"
                    style="padding: 0.75rem 1.5rem; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                📄 Export to PDF
            </button>
            <button onclick="window.UnifiedBrochureState.pages = []; renderBrochurePreview();"
                    style="padding: 0.75rem 1.5rem; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer;">
                🔄 Regenerate
            </button>
        </div>
    `;

    previewContainer.innerHTML = html;

    // Scroll to preview
    previewContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    console.log('✅ Preview rendered');
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 5: MAIN GENERATION FUNCTION
// ═══════════════════════════════════════════════════════════════════════

/**
 * MAIN: Generate complete brochure
 */
async function generateUnifiedBrochure() {
    console.log('🚀 Starting unified brochure generation...');

    try {
        // Step 1: Capture form data
        const formValid = captureFormData();
        if (!formValid) {
            if (typeof showToast === 'function') {
                showToast('error', 'Please fill in address and postcode');
            }
            return;
        }

        // Step 2: Sync photos from existing system if needed
        if (window.uploadedPhotos && window.uploadedPhotos.length > 0) {
            syncPhotosToUnifiedState();
        }

        // Step 3: Check photos
        if (window.UnifiedBrochureState.photos.length === 0) {
            if (typeof showToast === 'function') {
                showToast('warning', 'Please upload at least one photo');
            }
            return;
        }

        // Step 3: Generate pages
        const pages = generateBrochurePages();

        // Step 4: Show interactive editor (if available)
        if (typeof renderInteractiveBrochureEditor === 'function') {
            renderInteractiveBrochureEditor();
        } else {
            renderBrochurePreview();
        }

        // Step 5: Success message
        if (typeof showToast === 'function') {
            showToast('success', `✅ Generated ${pages.length}-page brochure with ${window.UnifiedBrochureState.photos.length} photos`);
        }

        console.log('✅ Brochure generation complete!');

    } catch (error) {
        console.error('❌ Brochure generation error:', error);
        if (typeof showToast === 'function') {
            showToast('error', 'Generation failed: ' + error.message);
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 6: EXPORT INTEGRATION
// ═══════════════════════════════════════════════════════════════════════

/**
 * Export brochure to PDF (integrates with existing system)
 */
async function exportBrochureToPDF() {
    console.log('📄 Exporting brochure to PDF...');

    const state = window.UnifiedBrochureState;

    // Convert to format expected by existing export system
    const exportData = {
        property: state.property,
        agent: state.agent,
        pages: state.pages.map(page => ({
            id: page.id,
            title: page.title,
            photos: page.photos.map(p => p.dataUrl),
            content: page.content
        }))
    };

    // Call existing export function if available
    if (typeof generatePDFExport === 'function') {
        await generatePDFExport(exportData);
    } else {
        console.warn('⚠️ PDF export function not found');
        if (typeof showToast === 'function') {
            showToast('info', 'PDF export system needs integration');
        }
    }
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 7: INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════

/**
 * Initialize the unified brochure builder system
 */
function initUnifiedBrochureBuilder() {
    console.log('🎬 Initializing Unified Brochure Builder...');

    // Initialize photo upload
    initPhotoUpload();

    // Add generation button if it doesn't exist
    setTimeout(() => {
        addGenerationButton();
    }, 1000);

    console.log('✅ Unified Brochure Builder ready!');
}

/**
 * Add the main generation button to UI
 */
function addGenerationButton() {
    // Buttons are already in HTML, no need to add dynamically
    // They call generateUnifiedBrochure() directly
    console.log('✅ Using existing HTML buttons for brochure generation');
    return;
}

// ═══════════════════════════════════════════════════════════════════════
// GLOBAL EXPORTS
// ═══════════════════════════════════════════════════════════════════════

window.generateUnifiedBrochure = generateUnifiedBrochure;
window.generateBrochurePages = generateBrochurePages;
window.exportBrochureToPDF = exportBrochureToPDF;
window.renderBrochurePreview = renderBrochurePreview;

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUnifiedBrochureBuilder);
} else {
    initUnifiedBrochureBuilder();
}

console.log('✅ Unified Brochure Builder System Loaded Successfully!');
