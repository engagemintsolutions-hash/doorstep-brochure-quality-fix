// ============================================
// PAGE BUILDER SYSTEM
// ============================================
console.log('📖 Page Builder loaded');

// Global state
let brochurePages = [];
let selectedPhotoInBuilder = null;
let activePageId = null;

// Make brochurePages accessible globally for validation
window.brochurePages = brochurePages;

// Expose renderBrochurePages globally for Smart Defaults UX enhancements
// (exported at end of file with other window assignments)

// ============================================
// CONTENT BLOCK SYSTEM
// ============================================

/**
 * Collects all form data and organizes it into content blocks.
 * Content blocks can be assigned to pages and rearranged.
 */
function collectFormDataAsBlocks() {
    const blocks = [];
    let blockId = 1;

    // 1. PROPERTY DETAILS BLOCK
    const propertyType = document.getElementById('propertyType')?.value || 'house';
    const bedrooms = document.getElementById('bedrooms')?.value || '3';
    const bathrooms = document.getElementById('bathrooms')?.value || '2';
    const sizeSqft = document.getElementById('sizeSqft')?.value;
    const condition = document.getElementById('condition')?.value || 'good';
    const epcRating = document.getElementById('epcRating')?.value;
    const councilTaxBand = document.getElementById('councilTaxBand')?.value;
    const tenure = document.getElementById('tenure')?.value;

    const propertyDetailsContent = [
        `${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}`,
        `${bedrooms} Bedroom${bedrooms !== '1' ? 's' : ''}`,
        `${bathrooms} Bathroom${bathrooms !== '1' ? 's' : ''}`,
        sizeSqft ? `${sizeSqft} sq ft` : null,
        epcRating ? `EPC Rating: ${epcRating}` : null,
        councilTaxBand ? `Council Tax: Band ${councilTaxBand}` : null,
        tenure ? `Tenure: ${tenure.charAt(0).toUpperCase() + tenure.slice(1)}` : null
    ].filter(Boolean).join(' • ');

    if (propertyDetailsContent) {
        blocks.push({
            id: `block_${blockId++}`,
            type: 'property_details',
            title: '🏠 Essential Details',
            content: propertyDetailsContent,
            data: { propertyType, bedrooms, bathrooms, sizeSqft, condition, epcRating, councilTaxBand, tenure }
        });
    }

    // 2. LOCATION BLOCK (with property name and pricing)
    const houseName = document.getElementById('houseName')?.value;
    const address = document.getElementById('address')?.value;
    const postcode = document.getElementById('postcode')?.value;
    const askingPrice = document.getElementById('askingPrice')?.value;
    const setting = document.getElementById('setting')?.value;
    const proximityNotes = document.getElementById('proximityNotes')?.value;

    if (address || postcode || houseName) {
        // Format asking price with commas if provided
        const formattedPrice = askingPrice ? `£${parseInt(askingPrice).toLocaleString()}` : null;

        const locationContent = [
            houseName,
            address,
            postcode,
            formattedPrice,
            proximityNotes
        ].filter(Boolean).join('\n');

        blocks.push({
            id: `block_${blockId++}`,
            type: 'location_info',
            title: '📍 Location',
            content: locationContent,
            data: { houseName, address, postcode, askingPrice: formattedPrice, setting, proximityNotes }
        });
    }

    // 3. FEATURES BLOCKS (grouped by category)
    const selectedFeatures = Array.from(document.querySelectorAll('input[name="features"]:checked'))
        .map(cb => ({ value: cb.value, label: cb.parentElement.textContent.trim() }));

    // Group features by category
    const featureCategories = {
        bedrooms: { title: '🛏️ Bedrooms', features: [] },
        bathrooms: { title: '🚿 Bathrooms', features: [] },
        parking: { title: '🚗 Parking & Access', features: [] },
        outdoor: { title: '🌳 Outdoor Spaces', features: [] },
        heating: { title: '♨️ Heating & Efficiency', features: [] },
        indoor: { title: '🏡 Indoor Features', features: [] },
        period: { title: '🏛️ Period Features', features: [] },
        rooms: { title: '🚪 Additional Rooms', features: [] },
        kitchen: { title: '👨‍🍳 Kitchen', features: [] },
        security: { title: '🔒 Security & Tech', features: [] },
        luxury: { title: '✨ Premium Features', features: [] }
    };

    selectedFeatures.forEach(feature => {
        const value = feature.value;
        const label = feature.label;

        if (value.includes('bedroom')) featureCategories.bedrooms.features.push(label);
        else if (value.includes('bathroom') || value.includes('ensuite') || value.includes('shower') || value.includes('wc')) featureCategories.bathrooms.features.push(label);
        else if (value.includes('parking') || value.includes('garage') || value.includes('driveway') || value.includes('carport') || value.includes('charging')) featureCategories.parking.features.push(label);
        else if (value.includes('garden') || value.includes('patio') || value.includes('balcony') || value.includes('terrace') || value.includes('decking')) featureCategories.outdoor.features.push(label);
        else if (value.includes('heating') || value.includes('glazing') || value.includes('solar') || value.includes('conditioning')) featureCategories.heating.features.push(label);
        else if (value.includes('fireplace') || value.includes('conservatory') || value.includes('wardrobe')) featureCategories.indoor.features.push(label);
        else if (value.includes('period') || value.includes('ceiling') || value.includes('sash') || value.includes('beam') || value.includes('flooring')) featureCategories.period.features.push(label);
        else if (value.includes('utility') || value.includes('study') || value.includes('loft') || value.includes('basement') || value.includes('annexe')) featureCategories.rooms.features.push(label);
        else if (value.includes('kitchen') || value.includes('appliances') || value.includes('breakfast') || value.includes('island') || value.includes('cooker')) featureCategories.kitchen.features.push(label);
        else if (value.includes('alarm') || value.includes('cctv') || value.includes('smart') || value.includes('video_entry')) featureCategories.security.features.push(label);
        else if (value.includes('pool') || value.includes('hot_tub') || value.includes('sauna') || value.includes('steam') || value.includes('gym') || value.includes('cinema') || value.includes('games') || value.includes('wine') || value.includes('bar') || value.includes('tennis') || value.includes('stables') || value.includes('paddock') || value.includes('guest_house') || value.includes('lift')) featureCategories.luxury.features.push(label);
    });

    // Create blocks for each category with features
    Object.entries(featureCategories).forEach(([key, category]) => {
        if (category.features.length > 0) {
            blocks.push({
                id: `block_${blockId++}`,
                type: 'features',
                category: key,
                title: category.title,
                content: category.features.join('\n• '),
                data: { features: category.features }
            });
        }
    });

    // 4. AGENT CONTACT BLOCK
    const agentName = document.getElementById('agentName')?.value;
    const agentPhone = document.getElementById('agentPhone')?.value;
    const agentEmail = document.getElementById('agentEmail')?.value;

    if (agentName || agentPhone || agentEmail) {
        const agentContent = [
            agentName,
            agentPhone,
            agentEmail
        ].filter(Boolean).join('\n');

        blocks.push({
            id: `block_${blockId++}`,
            type: 'agent_contact',
            title: '👤 Agent Contact',
            content: agentContent,
            data: { agentName, agentPhone, agentEmail }
        });
    }

    // 5. FLOORPLAN BLOCK (if uploaded)
    // Bug #45 fix: Check window.floorplanFile instead of DOM element (for localStorage restoration compatibility)
    if (window.floorplanFile) {
        blocks.push({
            id: `block_${blockId++}`,
            type: 'floorplan',
            title: '📐 Floorplan',
            content: window.floorplanFile.name,
            data: { fileName: window.floorplanFile.name }
        });
    }

    // 6. EPC CERTIFICATE BLOCK (if uploaded)
    if (window.epcFile) {
        blocks.push({
            id: `block_${blockId++}`,
            type: 'epc_certificate',
            title: '⚡ EPC Certificate',
            content: window.epcFile.name,
            data: { fileName: window.epcFile.name }
        });
    }

    console.log('📦 Collected content blocks:', blocks);
    return blocks;
}

// Make globally accessible
window.collectFormDataAsBlocks = collectFormDataAsBlocks;

// ============================================
// INITIALIZATION
// ============================================

function initializePageBuilder() {
    console.log('Initializing page builder system');

    // Check photo assignment progress periodically
    setInterval(checkPageBuilderReadiness, 1000);
}

function checkPageBuilderReadiness() {
    const totalPhotos = Object.values(window.photoCategoryAssignments || {}).flat().length;

    // Always show the collapsible section (it's visible by default now)
    // Just update the photo count
    const collapsibleSection = document.getElementById('pageBuilderCollapsible');

    // Update both inline counters
    const inlineCounter = document.getElementById('totalPhotosAssignedInline');
    if (inlineCounter) {
        inlineCounter.textContent = totalPhotos;
    }

    // Also update old section if it exists (keep it visible)
    const oldSection = document.getElementById('pageBuilderSection');
    if (oldSection) {
        oldSection.style.display = 'block'; // Keep section visible
    }
    const oldCounter = document.getElementById('totalPhotosAssigned');
    if (oldCounter) {
        oldCounter.textContent = totalPhotos;
    }

    // Show a toast when they reach 5+ photos (optional milestone)
    if (totalPhotos === 5) {
        console.log('✅ 5 photos assigned - page builder ready!');
    }
}

// ============================================
// MODAL CONTROLS
// ============================================

function openPageBuilderModal() {
    console.log('Opening page builder modal');

    // Show modal
    const modal = document.getElementById('pageBuilderModal');
    modal.style.display = 'flex';

    // Initialize sliders with smart defaults based on photo count
    const totalPhotos = window.uploadedPhotos?.length || 0;
    if (totalPhotos > 0) {
        // Calculate optimal page count
        const optimalPages = calculateOptimalPages(totalPhotos);

        // Set page count slider
        const pageCountSlider = document.getElementById('pageCountSlider');
        if (pageCountSlider && !window.desiredPageCount) {
            pageCountSlider.value = optimalPages;
            updatePageCount(optimalPages);
            console.log(`🎯 Set optimal page count: ${optimalPages} for ${totalPhotos} photos`);
        }

        // Set word count slider (default 1200 or use stored value)
        const wordCountSlider = document.getElementById('wordCountSlider');
        if (wordCountSlider && !window.desiredWordCount) {
            const defaultWords = 1200;
            wordCountSlider.value = defaultWords;
            updateWordCount(defaultWords);
        }
    }

    // Initialize if needed
    if (brochurePages.length === 0) {
        initializeDefaultPages();
    }

    // Render modal content
    renderAvailablePhotos();
    renderBrochurePages();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // ============================================
    // INITIALIZE NEW UX ENHANCEMENTS
    // ============================================
    // Initialize UX enhancements (from smart_defaults_ux.js and smart_defaults_ux_part2.js)
    if (typeof showPropertyTypePresets === 'function') {
        setTimeout(() => showPropertyTypePresets(), 100);
    }
    if (typeof addSliderTooltips === 'function') {
        setTimeout(() => addSliderTooltips(), 100);
    }
    if (typeof addSliderRecommendations === 'function') {
        setTimeout(() => addSliderRecommendations(), 100);
    }
    if (typeof enableLiveSliderPreview === 'function') {
        setTimeout(() => enableLiveSliderPreview(), 100);
    }
    if (typeof initializeLearningSystem === 'function') {
        initializeLearningSystem();
    }
}

function closePageBuilderModal() {
    console.log('Closing page builder modal');

    const modal = document.getElementById('pageBuilderModal');
    modal.style.display = 'none';

    // Re-enable body scroll
    document.body.style.overflow = '';

    // Clear selection
    selectedPhotoInBuilder = null;
    activePageId = null;
}

function savePageBuilderChanges() {
    console.log('Saving page builder changes');

    // Validate
    if (!validatePageStructure()) {
        return;
    }

    // Load existing brochure data from localStorage (from initial generation)
    let editorData = {};
    try {
        const existing = localStorage.getItem('brochure_editor_data');
        if (existing) {
            editorData = JSON.parse(existing);
            console.log('📥 Loaded existing brochure data');
        }
    } catch (error) {
        console.error('⚠️ Could not load existing data:', error);
    }

    // Add/update pages array from page builder
    editorData.pages = brochurePages;

    // Ensure photos are included
    if (!editorData.photos || editorData.photos.length === 0) {
        editorData.photos = window.uploadedPhotos || [];
    }

    // Ensure photoAssignments are included
    if (!editorData.photoAssignments) {
        editorData.photoAssignments = window.photoCategoryAssignments || {};
    }

    // Save complete data structure to localStorage
    try {
        localStorage.setItem('brochure_editor_data', JSON.stringify(editorData));
        console.log('💾 Saved complete brochure data with', brochurePages.length, 'pages');
    } catch (error) {
        console.error('❌ Failed to save to localStorage:', error);
        showToast('error', 'Failed to save brochure data. Please try again.');
        return;
    }

    // Update preview in main section
    updatePageBuilderPreview();

    // Close modal
    closePageBuilderModal();

    // Show success message (removed auto-navigation - only happens when user clicks Generate)
    showToast('success', '✓ Brochure pages saved! Click "Generate Brochure" when ready.');
}

// ============================================
// SMART DEFAULTS
// ============================================

function useSmartDefaults() {
    console.log('Applying smart defaults');

    // Bug #25 fix: Check if photo analysis is in progress
    if (window.isAnalyzingPhotos) {
        showToast('warning', 'Photo analysis in progress. Please wait...');
        return;
    }

    // Bug #10 fix: Validate minimum photos
    const totalPhotos = window.uploadedPhotos?.length || 0;
    if (totalPhotos < 5) {
        showToast('error', `Smart Defaults requires at least 5 photos (currently: ${totalPhotos})`);
        return;
    }

    // Save state before applying for undo functionality
    if (typeof saveStateForUndo === 'function') {
        saveStateForUndo();
    }

    brochurePages = generateSmartDefaultPages();
    window.brochurePages = brochurePages;  // Update global reference

    // Bug #6, #9 fix: Validate pages were generated
    if (!brochurePages || brochurePages.length === 0) {
        showToast('error', 'Failed to create pages. Please assign photos to categories first.');
        return;
    }

    renderBrochurePages();

    // Show change log with undo option
    if (typeof showChangeLog === 'function') {
        showChangeLog(brochurePages.length);
    } else {
        showToast('success', `✨ Smart defaults applied! Created ${brochurePages.length} pages.`);
    }

    // Show quality score
    if (typeof calculateQualityScore === 'function') {
        setTimeout(() => {
            const scoreData = calculateQualityScore();
            if (scoreData && typeof showQualityScore === 'function') {
                showQualityScore(scoreData);
            }
        }, 500);
    }

    // Show AI confidence scores
    if (typeof calculateConfidenceScores === 'function' && typeof showConfidenceScores === 'function') {
        setTimeout(() => {
            const confidenceData = calculateConfidenceScores();
            showConfidenceScores(confidenceData);
        }, 1000);
    }

    // Generate smart suggestions
    if (typeof generateSmartSuggestions === 'function') {
        setTimeout(() => generateSmartSuggestions(), 1500);
    }

    // Show readiness summary
    showReadinessSummary();

    // Bug #55 fix: Trigger section completion check
    if (typeof window.updateAllSections === 'function') {
        window.updateAllSections();
    }
}

function generateSmartDefaultPages() {
    const pages = [];
    let pageNumber = 1;

    // Collect all content blocks from the form
    const contentBlocks = collectFormDataAsBlocks();
    console.log('🎯 Smart Defaults - collected', contentBlocks.length, 'content blocks');

    // Get desired page count from slider (or calculate optimal)
    const totalPhotos = window.uploadedPhotos?.length || 0;
    const desiredPageCount = window.desiredPageCount || calculateOptimalPages(totalPhotos);

    // Smart photo distribution constants
    const MAX_PHOTOS_PER_PAGE = 4;
    const MIN_PHOTOS_PER_PAGE = 1;

    // Category-specific feature mapping for relevance validation
    const categoryFeatureMap = {
        'cover': ['parking', 'outdoor', 'indoor', 'period'],  // Cover can show overview features
        'exterior': ['parking', 'outdoor', 'security', 'period'],
        'interior': ['indoor', 'heating', 'period', 'rooms'],
        'kitchen': ['kitchen', 'indoor', 'heating'],
        'bedrooms': ['bedrooms', 'heating', 'period', 'rooms'],
        'bathrooms': ['bathrooms', 'luxury', 'heating'],
        'garden': ['outdoor', 'luxury']
    };

    // Helper function to determine which photo categories are present in a set of photos
    function getPhotoCategoriesForPhotos(photoIds) {
        const categories = new Set();
        photoIds.forEach(photoId => {
            // Find which category this photo belongs to
            for (const [category, photos] of Object.entries(window.photoCategoryAssignments)) {
                if (photos.includes(photoId)) {
                    categories.add(category);
                    break;
                }
            }
        });
        return Array.from(categories);
    }

    // Helper function to validate if a feature block is relevant to the photos on a page
    function isFeatureRelevantToPhotos(featureBlock, photoCategories) {
        // If no photos, allow all features
        if (photoCategories.length === 0) return true;

        // Check if this feature category is valid for ANY of the photo categories on the page
        const featureCategory = featureBlock.category;
        return photoCategories.some(photoCategory => {
            const allowedFeatures = categoryFeatureMap[photoCategory] || [];
            return allowedFeatures.includes(featureCategory);
        });
    }

    // Helper function to create content blocks array with photos + text blocks
    function createPageContent(photoIds, blockTypes = []) {
        const content = [];

        // Add photos first
        photoIds.forEach(photoId => {
            content.push({
                type: 'photo',
                photoId: photoId,
                id: `photo_${photoId}`
            });
        });

        // Determine photo categories for validation
        const photoCategories = getPhotoCategoriesForPhotos(photoIds);

        // Add matching content blocks (with relevance validation)
        blockTypes.forEach(blockType => {
            const matchingBlocks = contentBlocks.filter(b => {
                // First check if block matches the requested type
                let typeMatches = false;
                if (typeof blockType === 'string') {
                    typeMatches = b.type === blockType;
                } else if (typeof blockType === 'object') {
                    // Match by type and category
                    typeMatches = b.type === blockType.type && (!blockType.category || b.category === blockType.category);
                }

                if (!typeMatches) return false;

                // Then validate relevance for feature blocks
                if (b.type === 'features') {
                    const relevant = isFeatureRelevantToPhotos(b, photoCategories);
                    if (!relevant) {
                        console.log(`🚫 Filtered out irrelevant feature "${b.title}" (${b.category}) from page with photos in categories: ${photoCategories.join(', ')}`);
                    }
                    return relevant;
                }

                // Non-feature blocks always pass
                return true;
            });
            content.push(...matchingBlocks);
        });

        return content;
    }

    // Helper function to distribute photos evenly across pages
    function distributePhotosBalanced(photos, targetPageCount) {
        const contentPages = Math.max(1, targetPageCount - 2); // Exclude cover and back page
        const photosPerPage = Math.ceil(photos.length / contentPages);

        // Check if we need more pages
        if (photosPerPage > MAX_PHOTOS_PER_PAGE) {
            const neededPages = Math.ceil(photos.length / MAX_PHOTOS_PER_PAGE) + 2;
            console.warn(`⚠️ ${photos.length} photos need ${neededPages} pages (currently ${targetPageCount}). Consider increasing page count.`);
            showToast('warning', `Tip: ${photos.length} photos work best with ${neededPages}+ pages`, 5000);
        }

        // Distribute photos evenly
        const distribution = [];
        for (let i = 0; i < contentPages; i++) {
            const start = i * photosPerPage;
            const end = Math.min(start + photosPerPage, photos.length);
            if (start < photos.length) {
                distribution.push(photos.slice(start, end));
            }
        }

        console.log(`📸 Distributed ${photos.length} photos across ${distribution.length} pages (${photosPerPage} per page max)`);
        return distribution;
    }

    // PAGE 1: Cover - Hero photo + Address + Essential Details
    const coverPhotos = window.photoCategoryAssignments.cover || [];
    if (coverPhotos.length > 0) {
        pages.push({
            id: pageNumber++,
            name: 'Welcome Home',
            contentBlocks: createPageContent(
                [coverPhotos[0]],
                ['location_info', 'property_details']
            ),
            locked: true,
            theme: 'welcoming'
        });
    }

    // IMPROVED ALGORITHM: Group photos by category, create pages per category with unique names
    // This prevents duplicate page names and ensures logical photo grouping

    const categoryConfig = [
        {
            key: 'exterior',
            name: 'Exterior & Grounds',
            theme: 'architectural',
            features: [{ type: 'features', category: 'parking' }, { type: 'features', category: 'outdoor' }]
        },
        {
            key: 'interior',
            name: 'Living Spaces',
            theme: 'entertaining',
            features: [{ type: 'features', category: 'indoor' }]
        },
        {
            key: 'kitchen',
            name: 'Kitchen & Dining',
            theme: 'entertaining',
            features: [{ type: 'features', category: 'kitchen' }]
        },
        {
            key: 'bedrooms',
            name: 'Bedrooms',
            theme: 'comfortable',
            features: [{ type: 'features', category: 'bedrooms' }, { type: 'features', category: 'period' }]
        },
        {
            key: 'bathrooms',
            name: 'Bathrooms',
            theme: 'relaxing',
            features: [{ type: 'features', category: 'bathrooms' }, { type: 'features', category: 'luxury' }]
        },
        {
            key: 'garden',
            name: 'Outdoor Spaces',
            theme: 'outdoor',
            features: [{ type: 'features', category: 'outdoor' }]
        }
    ];

    // Create pages for each category that has photos
    categoryConfig.forEach(config => {
        const categoryPhotos = window.photoCategoryAssignments[config.key] || [];
        if (categoryPhotos.length === 0) return;

        // Split photos into pages if needed (max 4 photos per page)
        const photosPerPage = Math.min(MAX_PHOTOS_PER_PAGE, Math.ceil(categoryPhotos.length / 1));
        let pageIndex = 1;

        for (let i = 0; i < categoryPhotos.length; i += photosPerPage) {
            const pagePhotos = categoryPhotos.slice(i, i + photosPerPage);

            // Create unique page name if multiple pages for same category
            const totalPagesForCategory = Math.ceil(categoryPhotos.length / photosPerPage);
            const pageName = totalPagesForCategory > 1
                ? `${config.name} ${pageIndex}`
                : config.name;

            pages.push({
                id: pageNumber++,
                name: pageName,
                contentBlocks: createPageContent(pagePhotos, config.features),
                locked: false,
                theme: config.theme
            });

            pageIndex++;
        }
    });

    // FLOORPLAN PAGE: Always include if floorplan exists (not limited by page budget)
    const floorplanBlock = contentBlocks.find(b => b.type === 'floorplan');
    if (floorplanBlock) {
        pages.push({
            id: pageNumber++,
            name: 'Property Layout',
            contentBlocks: [floorplanBlock],
            locked: false,
            theme: 'technical'
        });
        console.log('✅ Added floorplan page');
    }

    // FINAL PAGE: Agent Contact (always last if present)
    const agentBlock = contentBlocks.find(b => b.type === 'agent_contact');
    if (agentBlock) {
        pages.push({
            id: pageNumber++,
            name: 'Get In Touch',
            contentBlocks: [agentBlock],
            locked: false,
            theme: 'contact'
        });
        console.log('✅ Added agent contact page');
    }

    console.log('✅ Generated', pages.length, 'pages with content blocks');
    return pages;
}

function initializeDefaultPages() {
    // Start with cover page only
    const coverPhotos = window.photoCategoryAssignments.cover || [];

    brochurePages = [{
        id: 1,
        name: 'Cover',
        contentBlocks: coverPhotos.length > 0 ? [{
            id: 1,
            type: 'photo',
            photoId: coverPhotos[0]
        }] : [],
        locked: true,
        theme: 'welcoming'
    }];
    window.brochurePages = brochurePages;  // Update global reference
}

/**
 * Shows a readiness summary with checklist and recommendations
 */
function showReadinessSummary() {
    const totalPhotos = window.uploadedPhotos?.length || 0;
    const totalPages = brochurePages.length;
    const photosUsedCount = new Set(brochurePages.flatMap(p =>
        p.contentBlocks.filter(b => b.type === 'photo').map(b => b.photoId)
    )).size;
    const photosUnused = totalPhotos - photosUsedCount;

    // Calculate metrics
    const desiredPageCount = window.desiredPageCount || calculateOptimalPages(totalPhotos);
    const desiredWordCount = window.desiredWordCount || 1200;
    const avgPhotosPerPage = (photosUsedCount / Math.max(1, totalPages - 2)).toFixed(1); // Exclude cover and back

    // Generate checklist items
    const checklist = [];
    checklist.push({ icon: '✅', text: `${totalPhotos} photos uploaded`, status: 'complete' });
    checklist.push({ icon: '✅', text: `${totalPages} pages created`, status: 'complete' });
    checklist.push({ icon: '✅', text: `${photosUsedCount} photos assigned to pages`, status: 'complete' });

    if (photosUnused > 0) {
        checklist.push({ icon: '⚠️', text: `${photosUnused} photos not used yet`, status: 'warning' });
    }

    // Generate recommendations
    const recommendations = [];

    // Page count recommendation
    const optimalPages = calculateOptimalPages(totalPhotos);
    if (totalPages < optimalPages - 1) {
        recommendations.push({
            icon: '💡',
            text: `Consider adding ${optimalPages - totalPages} more pages for better photo spacing (currently ${avgPhotosPerPage} photos/page)`,
            action: () => {
                document.getElementById('pageCountSlider').value = optimalPages;
                updatePageCount(optimalPages);
            }
        });
    } else if (avgPhotosPerPage > 4) {
        recommendations.push({
            icon: '⚠️',
            text: `${avgPhotosPerPage} photos per page is too many. Increase page count to ${optimalPages}+ for better layout`,
            action: () => {
                document.getElementById('pageCountSlider').value = optimalPages;
                updatePageCount(optimalPages);
            }
        });
    }

    // Word count recommendation
    const wordsPerPage = Math.floor(desiredWordCount / Math.max(1, totalPages - 2));
    if (wordsPerPage < 100) {
        recommendations.push({
            icon: '💡',
            text: `Word count is low (${wordsPerPage} per page). Consider increasing to 1500+ total words for richer content`
        });
    }

    // Unused photos recommendation
    if (photosUnused > 0) {
        recommendations.push({
            icon: '📸',
            text: `${photosUnused} photos are unused. Add more pages or manually assign them to existing pages`
        });
    }

    // Build summary HTML
    const summaryHTML = `
        <div style="background: #f8f9fa; border: 2px solid #C20430; border-radius: 12px; padding: 1.5rem; margin: 1rem 0; max-width: 500px; margin-left: auto; margin-right: auto;">
            <h3 style="color: #C20430; margin: 0 0 1rem 0; text-align: center; font-size: 1.1rem;">📋 Brochure Readiness Summary</h3>

            <!-- Stats -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1rem;">
                <div style="text-align: center; background: white; padding: 0.75rem; border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: bold; color: #C20430;">${totalPages}</div>
                    <div style="font-size: 0.75rem; color: #6c757d;">Pages</div>
                </div>
                <div style="text-align: center; background: white; padding: 0.75rem; border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: bold; color: #C20430;">${photosUsedCount}</div>
                    <div style="font-size: 0.75rem; color: #6c757d;">Photos</div>
                </div>
                <div style="text-align: center; background: white; padding: 0.75rem; border-radius: 8px;">
                    <div style="font-size: 1.5rem; font-weight: bold; color: #C20430;">${desiredWordCount.toLocaleString()}</div>
                    <div style="font-size: 0.75rem; color: #6c757d;">Words</div>
                </div>
            </div>

            <!-- Checklist -->
            <div style="background: white; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <div style="font-weight: 600; color: #2c3e50; margin-bottom: 0.5rem; font-size: 0.9rem;">✓ Completion Checklist:</div>
                ${checklist.map(item => `
                    <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.3rem 0; font-size: 0.85rem; color: ${item.status === 'warning' ? '#ffc107' : '#28a745'};">
                        <span>${item.icon}</span>
                        <span>${item.text}</span>
                    </div>
                `).join('')}
            </div>

            <!-- Recommendations -->
            ${recommendations.length > 0 ? `
                <div style="background: #fff3cd; padding: 1rem; border-radius: 8px; border: 1px solid #ffc107;">
                    <div style="font-weight: 600; color: #856404; margin-bottom: 0.5rem; font-size: 0.9rem;">💡 Recommendations:</div>
                    ${recommendations.map(rec => `
                        <div style="display: flex; align-items: start; gap: 0.5rem; padding: 0.3rem 0; font-size: 0.85rem; color: #856404;">
                            <span style="flex-shrink: 0;">${rec.icon}</span>
                            <span>${rec.text}</span>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div style="background: #d4edda; padding: 1rem; border-radius: 8px; border: 1px solid #28a745; text-align: center;">
                    <span style="font-size: 1.2rem;">🎉</span>
                    <div style="color: #155724; font-weight: 600; margin-top: 0.5rem;">Your brochure looks great!</div>
                    <div style="color: #155724; font-size: 0.85rem; margin-top: 0.25rem;">Ready to save and generate</div>
                </div>
            `}

            <div style="text-align: center; margin-top: 1rem;">
                <button onclick="document.getElementById('readinessSummary').style.display='none'" style="background: #6c757d; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">
                    Close Summary
                </button>
            </div>
        </div>
    `;

    // Display the summary
    let summaryContainer = document.getElementById('readinessSummary');
    if (!summaryContainer) {
        summaryContainer = document.createElement('div');
        summaryContainer.id = 'readinessSummary';
        summaryContainer.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10001; max-width: 90vw; max-height: 90vh; overflow-y: auto;';

        // Add backdrop
        const backdrop = document.createElement('div');
        backdrop.id = 'readinessSummaryBackdrop';
        backdrop.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000;';
        backdrop.onclick = () => {
            summaryContainer.style.display = 'none';
            backdrop.style.display = 'none';
        };

        document.body.appendChild(backdrop);
        document.body.appendChild(summaryContainer);
    }

    summaryContainer.innerHTML = summaryHTML;
    summaryContainer.style.display = 'block';
    document.getElementById('readinessSummaryBackdrop').style.display = 'block';

    console.log('📋 Readiness summary displayed');
}

// ============================================
// RENDERING
// ============================================

function renderAvailablePhotos() {
    const container = document.getElementById('availablePhotosList');
    container.innerHTML = '';

    // Get photos already used in pages (from contentBlocks)
    const usedPhotoIds = new Set(brochurePages.flatMap(p =>
        p.contentBlocks.filter(b => b.type === 'photo').map(b => b.photoId)
    ));

    // Count available photos
    let totalAvailable = 0;

    // Render each category
    const categories = [
        { key: 'cover', name: 'Cover', icon: '🏠' },
        { key: 'exterior', name: 'Exterior', icon: '🏘️' },
        { key: 'interior', name: 'Interior', icon: '🛋️' },
        { key: 'kitchen', name: 'Kitchen', icon: '🍽️' },
        { key: 'bedrooms', name: 'Bedrooms', icon: '🛏️' },
        { key: 'bathrooms', name: 'Bathrooms', icon: '🚿' },
        { key: 'garden', name: 'Garden', icon: '🌳' }
    ];

    categories.forEach(category => {
        const photos = window.photoCategoryAssignments[category.key] || [];
        const availablePhotos = photos.filter(photoId => !usedPhotoIds.has(photoId));
        totalAvailable += availablePhotos.length;

        if (photos.length === 0) return;

        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'page-builder-photo-category';

        // Category header
        const header = document.createElement('div');
        header.className = 'page-builder-photo-category-header';
        header.innerHTML = `
            <span style="font-weight: 600;">${category.icon} ${category.name}</span>
            <span style="font-size: 0.85rem; color: #6c757d;">${availablePhotos.length}/${photos.length}</span>
        `;

        // Photo grid (initially hidden)
        const photoGrid = document.createElement('div');
        photoGrid.className = 'page-builder-photo-category-photos';
        photoGrid.style.display = 'none';

        photos.forEach(photoId => {
            // Bug #38 fix: photoId could be either unique ID or filename (backwards compatible)
            // Bug #46 fix: Use window.uploadedPhotos for consistency
            const photoData = window.uploadedPhotos.find(p => p.id === photoId || p.name === photoId);
            if (!photoData) return;

            const img = document.createElement('img');
            img.src = photoData.dataUrl || photoData.url;  // Use dataUrl first (from file upload), fallback to url
            img.className = 'page-builder-photo-thumb';
            img.dataset.photoId = photoId;

            if (usedPhotoIds.has(photoId)) {
                img.classList.add('used');
                img.title = 'Already used in a page';
            } else {
                // Click to select
                img.onclick = () => selectPhotoForPage(photoId);

                // Drag-and-drop support
                img.draggable = true;
                img.ondragstart = (e) => {
                    e.dataTransfer.effectAllowed = 'copy';
                    e.dataTransfer.setData('text/plain', JSON.stringify({
                        photoId: photoId,
                        type: 'new-photo'
                    }));
                    img.classList.add('dragging');
                };
                img.ondragend = (e) => {
                    img.classList.remove('dragging');
                };
            }

            photoGrid.appendChild(img);
        });

        // Toggle visibility on header click
        header.onclick = () => {
            const isVisible = photoGrid.style.display !== 'none';
            photoGrid.style.display = isVisible ? 'none' : 'grid';
        };

        categoryDiv.appendChild(header);
        categoryDiv.appendChild(photoGrid);
        container.appendChild(categoryDiv);
    });

    // Update count
    document.getElementById('availablePhotoCount').textContent = totalAvailable;

    // Add quality badges if photo analysis has been performed
    if (typeof window.addQualityBadgesToPhotos === 'function') {
        setTimeout(() => window.addQualityBadgesToPhotos(), 100);
    }
}

function renderBrochurePages() {
    const container = document.getElementById('brochurePagesList');
    container.innerHTML = '';

    if (brochurePages.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #6c757d;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">📄</div>
                <p>No pages yet. Click "Use Smart Defaults" to auto-create pages.</p>
            </div>
        `;
        return;
    }

    brochurePages.forEach(page => {
        const pageCard = createPageCard(page);
        container.appendChild(pageCard);
    });

    // Initialize drag-and-drop for pages
    initializePagesSorting();
}

function createPageCard(page) {
    const card = document.createElement('div');
    card.className = 'page-builder-page-card';
    card.dataset.pageId = page.id;

    if (activePageId === page.id) {
        card.classList.add('active');
    }

    // Header
    const header = document.createElement('div');
    header.className = 'page-builder-page-header';

    const title = document.createElement('div');
    title.className = 'page-builder-page-title';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.value = page.name;
    titleInput.disabled = page.locked;
    titleInput.onchange = (e) => {
        page.name = e.target.value;
    };
    title.appendChild(titleInput);

    // Support both old (photoIds) and new (contentBlocks) structure
    const contentBlocks = page.contentBlocks || [];
    const photoCount = contentBlocks.filter(b => b.type === 'photo').length;
    const otherContentCount = contentBlocks.filter(b => b.type !== 'photo').length;

    const badge = document.createElement('span');
    badge.className = 'page-builder-page-badge';
    if (contentBlocks.length === 0) {
        badge.classList.add('empty');
        badge.textContent = 'Empty';
    } else if (otherContentCount > 0) {
        badge.textContent = `${photoCount} photo${photoCount !== 1 ? 's' : ''} • ${otherContentCount} detail${otherContentCount !== 1 ? 's' : ''}`;
    } else {
        badge.textContent = `${photoCount} photo${photoCount !== 1 ? 's' : ''}`;
    }

    const actions = document.createElement('div');
    actions.className = 'page-builder-page-actions';

    if (!page.locked) {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.title = 'Delete page';
        deleteBtn.onclick = () => deletePage(page.id);
        actions.appendChild(deleteBtn);
    }

    header.appendChild(title);
    header.appendChild(badge);
    header.appendChild(actions);

    // Content container (photos + other content blocks)
    const contentContainer = document.createElement('div');
    contentContainer.className = 'page-builder-page-content';
    contentContainer.dataset.pageId = page.id;

    // Drop zone handlers
    contentContainer.ondragover = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        contentContainer.classList.add('drag-over');
    };
    contentContainer.ondragleave = (e) => {
        if (e.target === contentContainer) {
            contentContainer.classList.remove('drag-over');
        }
    };
    contentContainer.ondrop = (e) => {
        e.preventDefault();
        contentContainer.classList.remove('drag-over');

        try {
            const data = JSON.parse(e.dataTransfer.getData('text/plain'));

            // Handle new photo being dropped from left panel
            if (data.type === 'new-photo' && data.photoId) {
                addPhotoToPage(data.photoId, page.id);
            }
            // Handle existing block being moved between pages
            else if (data.blockId && data.fromPageId) {
                const { blockId, fromPageId } = data;
                if (fromPageId !== page.id) {
                    moveBlockToPage(blockId, fromPageId, page.id);
                }
            }
        } catch (err) {
            console.error('Drop error:', err);
        }
    };

    if (contentBlocks.length > 0) {
        contentContainer.classList.add('has-content');
    }

    if (contentBlocks.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'page-builder-page-empty';
        emptyMsg.textContent = 'Drag content blocks here';
        contentContainer.appendChild(emptyMsg);
    } else {
        contentBlocks.forEach(block => {
            const blockElement = createContentBlockElement(block, page.id);
            contentContainer.appendChild(blockElement);
        });
    }

    card.appendChild(header);
    card.appendChild(contentContainer);

    return card;
}

/**
 * Creates a visual element for a content block (photo, property details, features, etc.)
 */
function createContentBlockElement(block, pageId) {
    const blockDiv = document.createElement('div');
    blockDiv.className = 'page-builder-content-block';
    blockDiv.dataset.blockId = block.id;
    blockDiv.dataset.blockType = block.type;
    blockDiv.draggable = true;

    // Drag and drop handlers
    blockDiv.ondragstart = (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', JSON.stringify({ blockId: block.id, fromPageId: pageId }));
        blockDiv.classList.add('dragging');
    };
    blockDiv.ondragend = (e) => {
        blockDiv.classList.remove('dragging');
    };

    // Photo blocks
    if (block.type === 'photo') {
        // Bug #38 fix: photoId could be either unique ID or filename (backwards compatible)
        // Try multiple ID formats for robust matching
        let photoData = window.uploadedPhotos.find(p =>
            p.id === block.photoId ||
            p.name === block.photoId ||
            p.id === block.photoId.replace('photo_', '') ||  // Remove photo_ prefix if present
            `photo_${p.id}` === block.photoId ||              // Add photo_ prefix to match
            p.name.includes(block.photoId) ||                 // Partial filename match
            block.photoId.includes(p.name)                    // Reverse partial match
        );

        if (!photoData) {
            console.warn('Photo not found for ID:', block.photoId, 'Available photos:', window.uploadedPhotos.map(p => ({id: p.id, name: p.name})));
            // Create placeholder instead of returning empty
            blockDiv.classList.add('block-photo', 'photo-missing');
            blockDiv.innerHTML = `
                <div style="background: #f0f0f0; padding: 20px; text-align: center; color: #999;">
                    <div>📷</div>
                    <div style="font-size: 12px; margin-top: 8px;">Photo not found</div>
                    <div style="font-size: 10px;">${block.photoId}</div>
                </div>
            `;
            return blockDiv;
        }

        blockDiv.classList.add('block-photo');
        const img = document.createElement('img');
        img.src = photoData.dataUrl || photoData.url;  // Fix: use dataUrl
        img.alt = 'Photo';
        blockDiv.appendChild(img);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'block-remove-btn';
        removeBtn.textContent = '✕';
        removeBtn.title = 'Remove from page';
        removeBtn.onclick = (e) => {
            e.stopPropagation();
            removeBlockFromPage(block.id, pageId);
        };
        blockDiv.appendChild(removeBtn);
    }
    // Property details block
    else if (block.type === 'property_details') {
        blockDiv.classList.add('block-details');
        blockDiv.innerHTML = `
            <div class="block-icon">🏠</div>
            <div class="block-content">
                <div class="block-title">${block.title}</div>
                <div class="block-text">${block.content}</div>
            </div>
            <button class="block-remove-btn" onclick="removeBlockFromPage('${block.id}', ${pageId})" title="Remove from page">✕</button>
        `;
    }
    // Location info block
    else if (block.type === 'location_info') {
        blockDiv.classList.add('block-location');
        blockDiv.innerHTML = `
            <div class="block-icon">📍</div>
            <div class="block-content">
                <div class="block-title">${block.title}</div>
                <div class="block-text">${block.content.replace(/\n/g, '<br>')}</div>
            </div>
            <button class="block-remove-btn" onclick="removeBlockFromPage('${block.id}', ${pageId})" title="Remove from page">✕</button>
        `;
    }
    // Features block
    else if (block.type === 'features') {
        blockDiv.classList.add('block-features');
        const features = block.content.split('\n').filter(f => f.trim());
        blockDiv.innerHTML = `
            <div class="block-icon">${block.title.split(' ')[0]}</div>
            <div class="block-content">
                <div class="block-title">${block.title}</div>
                <div class="block-text">${features.map(f => `• ${f}`).join('<br>')}</div>
            </div>
            <button class="block-remove-btn" onclick="removeBlockFromPage('${block.id}', ${pageId})" title="Remove from page">✕</button>
        `;
    }
    // Agent contact block
    else if (block.type === 'agent_contact') {
        blockDiv.classList.add('block-agent');
        blockDiv.innerHTML = `
            <div class="block-icon">👤</div>
            <div class="block-content">
                <div class="block-title">${block.title}</div>
                <div class="block-text">${block.content.replace(/\n/g, '<br>')}</div>
            </div>
            <button class="block-remove-btn" onclick="removeBlockFromPage('${block.id}', ${pageId})" title="Remove from page">✕</button>
        `;
    }
    // Floorplan block
    else if (block.type === 'floorplan') {
        blockDiv.classList.add('block-floorplan');
        blockDiv.innerHTML = `
            <div class="block-icon">📐</div>
            <div class="block-content">
                <div class="block-title">${block.title}</div>
                <div class="block-text">${block.content}</div>
            </div>
            <button class="block-remove-btn" onclick="removeBlockFromPage('${block.id}', ${pageId})" title="Remove from page">✕</button>
        `;
    }
    // EPC Certificate block
    else if (block.type === 'epc_certificate') {
        blockDiv.classList.add('block-epc');
        blockDiv.innerHTML = `
            <div class="block-icon">⚡</div>
            <div class="block-content">
                <div class="block-title">${block.title}</div>
                <div class="block-text">${block.content}</div>
            </div>
            <button class="block-remove-btn" onclick="removeBlockFromPage('${block.id}', ${pageId})" title="Remove from page">✕</button>
        `;
    }
    // Generic block
    else {
        blockDiv.classList.add('block-generic');
        blockDiv.innerHTML = `
            <div class="block-content">
                <div class="block-title">${block.title || block.type}</div>
                <div class="block-text">${block.content || 'No content'}</div>
            </div>
            <button class="block-remove-btn" onclick="removeBlockFromPage('${block.id}', ${pageId})" title="Remove from page">✕</button>
        `;
    }

    return blockDiv;
}

// Expose renderBrochurePages globally for Smart Defaults UX enhancements
// MOVED: Now assigned immediately after function definition (line 974)
// window.renderBrochurePages = renderBrochurePages;

function removeBlockFromPage(blockId, pageId) {
    const page = brochurePages.find(p => p.id === pageId);
    if (!page) return;

    page.contentBlocks = page.contentBlocks.filter(b => b.id !== blockId);
    window.brochurePages = brochurePages;
    renderBrochurePages();
    showToast('info', 'Content removed from page');
}

function moveBlockToPage(blockId, fromPageId, toPageId) {
    const fromPage = brochurePages.find(p => p.id === fromPageId);
    const toPage = brochurePages.find(p => p.id === toPageId);

    if (!fromPage || !toPage) {
        console.error('Pages not found:', { fromPageId, toPageId });
        return;
    }

    // Find and remove the block from the source page
    const blockIndex = fromPage.contentBlocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) {
        console.error('Block not found:', blockId);
        return;
    }

    const block = fromPage.contentBlocks[blockIndex];
    fromPage.contentBlocks.splice(blockIndex, 1);

    // Add to target page
    toPage.contentBlocks.push(block);

    window.brochurePages = brochurePages;
    renderBrochurePages();
    showToast('success', 'Content moved to ' + toPage.name);
}
window.removeBlockFromPage = removeBlockFromPage;
window.moveBlockToPage = moveBlockToPage;

function createPagePhotoElement(photoId, pageId) {
    // Bug #38 fix: photoId could be either unique ID or filename (backwards compatible)
    // Bug #46 fix: Use window.uploadedPhotos for consistency
    const photoData = window.uploadedPhotos.find(p => p.id === photoId || p.name === photoId);
    if (!photoData) return document.createElement('div');

    const photoDiv = document.createElement('div');
    photoDiv.className = 'page-builder-page-photo';

    const img = document.createElement('img');
    img.src = photoData.dataUrl || photoData.url;  // Use dataUrl first (from file upload), fallback to url
    img.alt = 'Page photo';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'page-builder-page-photo-remove';
    removeBtn.textContent = '✕';
    removeBtn.onclick = (e) => {
        e.stopPropagation();
        removePhotoFromPage(photoId, pageId);
    };

    photoDiv.appendChild(img);
    photoDiv.appendChild(removeBtn);

    return photoDiv;
}

// ============================================
// PHOTO MANAGEMENT
// ============================================

function selectPhotoForPage(photoId) {
    console.log('Selected photo:', photoId);

    selectedPhotoInBuilder = photoId;

    // Update visual selection
    document.querySelectorAll('.page-builder-photo-thumb').forEach(thumb => {
        thumb.classList.remove('selected');
    });

    const selectedThumb = document.querySelector(`[data-photo-id="${photoId}"]`);
    if (selectedThumb) {
        selectedThumb.classList.add('selected');
    }

    // Highlight pages as clickable
    document.querySelectorAll('.page-builder-page-photos').forEach(container => {
        container.style.cursor = 'pointer';
    });

    showToast('info', 'Now click a page to add this photo');
}

function addPhotoToPage(photoId, pageId) {
    console.log('Adding photo', photoId, 'to page', pageId);

    const page = brochurePages.find(p => p.id === pageId);
    if (!page) return;

    // Check if photo already in this page (check contentBlocks)
    const alreadyInPage = page.contentBlocks.some(b => b.type === 'photo' && b.photoId === photoId);
    if (alreadyInPage) {
        showToast('warning', 'Photo already in this page');
        return;
    }

    // Check if photo used in another page
    const usedInPage = brochurePages.find(p =>
        p.contentBlocks.some(b => b.type === 'photo' && b.photoId === photoId)
    );
    if (usedInPage) {
        showToast('warning', `Photo already used in "${usedInPage.name}"`);
        return;
    }

    // Add photo as a content block
    page.contentBlocks.push({
        id: Date.now(),
        type: 'photo',
        photoId: photoId
    });

    // Clear selection
    selectedPhotoInBuilder = null;

    // Re-render
    renderAvailablePhotos();
    renderBrochurePages();

    showToast('success', `Photo added to ${page.name}`);
}

function removePhotoFromPage(photoId, pageId) {
    console.log('Removing photo', photoId, 'from page', pageId);

    const page = brochurePages.find(p => p.id === pageId);
    if (!page) return;

    // Remove photo from contentBlocks
    page.contentBlocks = page.contentBlocks.filter(b => !(b.type === 'photo' && b.photoId === photoId));

    // Re-render
    renderAvailablePhotos();
    renderBrochurePages();

    showToast('info', 'Photo removed');
}

// ============================================
// PAGE MANAGEMENT
// ============================================

function addNewPage() {
    console.log('Adding new page');

    const newPageId = Math.max(...brochurePages.map(p => p.id), 0) + 1;

    const newPage = {
        id: newPageId,
        name: `Page ${newPageId}`,
        contentBlocks: [],
        locked: false,
        theme: 'general'
    };

    brochurePages.push(newPage);
    renderBrochurePages();

    showToast('success', '✓ New page added');
}

function deletePage(pageId) {
    console.log('Deleting page', pageId);

    const page = brochurePages.find(p => p.id === pageId);
    if (!page) return;

    if (page.locked) {
        showToast('error', 'Cannot delete locked page');
        return;
    }

    if (confirm(`Delete "${page.name}"?`)) {
        brochurePages = brochurePages.filter(p => p.id !== pageId);
        window.brochurePages = brochurePages;  // Update global reference
        renderAvailablePhotos();
        renderBrochurePages();
        showToast('info', 'Page deleted');
    }
}

// ============================================
// VALIDATION
// ============================================

function validatePageStructure() {
    // Check cover page
    const coverPage = brochurePages.find(p => p.id === 1);
    if (!coverPage) {
        showToast('error', 'Cover page is missing');
        return false;
    }

    // Count photos in cover page
    const coverPhotoCount = coverPage.contentBlocks.filter(b => b.type === 'photo').length;
    if (coverPhotoCount !== 1) {
        showToast('error', 'Cover page must have exactly 1 photo');
        return false;
    }

    // Check for empty pages (no content blocks at all)
    const emptyPages = brochurePages.filter(p => !p.contentBlocks || p.contentBlocks.length === 0);
    if (emptyPages.length > 0) {
        showToast('warning', `${emptyPages.length} page(s) are empty. Add content or delete them.`);
        return false;
    }

    return true;
}

// ============================================
// DRAG-AND-DROP SORTING
// ============================================

/**
 * Initializes SortableJS for reordering pages
 */
function initializePagesSorting() {
    const pagesContainer = document.getElementById('brochurePagesList');
    if (!pagesContainer || typeof Sortable === 'undefined') {
        console.warn('⚠️ SortableJS not available or container not found');
        return;
    }

    // Destroy existing Sortable instance if it exists
    if (pagesContainer.sortableInstance) {
        pagesContainer.sortableInstance.destroy();
    }

    pagesContainer.sortableInstance = new Sortable(pagesContainer, {
        animation: 200,
        handle: '.page-builder-page-header',  // Drag by header
        draggable: '.page-builder-page-card',
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        filter: '.locked',  // Don't allow dragging locked pages (cover page)

        onEnd: function(evt) {
            const oldIndex = evt.oldIndex;
            const newIndex = evt.newIndex;

            if (oldIndex === newIndex) return;

            // Reorder the pages array
            const movedPage = brochurePages.splice(oldIndex, 1)[0];
            brochurePages.splice(newIndex, 0, movedPage);

            // Update page IDs to match new order
            brochurePages.forEach((page, index) => {
                page.id = index + 1;
            });

            window.brochurePages = brochurePages;
            console.log(`📄 Moved page from position ${oldIndex + 1} to ${newIndex + 1}`);
            showToast('success', `Page reordered successfully`);

            // Re-render to update page numbers
            renderBrochurePages();
        }
    });

    // Initialize sorting for content blocks within each page
    document.querySelectorAll('.page-builder-page-content').forEach(contentContainer => {
        initializeContentSorting(contentContainer);
    });

    console.log('✅ Pages sorting initialized');
}

/**
 * Initializes SortableJS for reordering content blocks within a page
 */
function initializeContentSorting(contentContainer) {
    if (!contentContainer || typeof Sortable === 'undefined') return;

    const pageId = parseInt(contentContainer.dataset.pageId);
    if (!pageId) return;

    // Destroy existing Sortable instance if it exists
    if (contentContainer.sortableInstance) {
        contentContainer.sortableInstance.destroy();
    }

    contentContainer.sortableInstance = new Sortable(contentContainer, {
        animation: 150,
        handle: '.page-builder-content-block',
        draggable: '.page-builder-content-block',
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',

        onEnd: function(evt) {
            const oldIndex = evt.oldIndex;
            const newIndex = evt.newIndex;

            if (oldIndex === newIndex) return;

            // Find the page and reorder its content blocks
            const page = brochurePages.find(p => p.id === pageId);
            if (!page) return;

            const movedBlock = page.contentBlocks.splice(oldIndex, 1)[0];
            page.contentBlocks.splice(newIndex, 0, movedBlock);

            window.brochurePages = brochurePages;
            console.log(`🔄 Reordered content in page ${pageId}: moved block from ${oldIndex} to ${newIndex}`);
            showToast('info', 'Content reordered');
        }
    });
}

// ============================================
// SLIDER CONTROLS
// ============================================

/**
 * Updates the page count slider value and recalculates word distribution
 */
function updatePageCount(value) {
    const pageCount = parseInt(value);
    document.getElementById('pageCountValue').textContent = pageCount;

    // Store in window for use during page generation
    window.desiredPageCount = pageCount;

    // Update word distribution calculation
    const wordCountSlider = document.getElementById('wordCountSlider');
    if (wordCountSlider) {
        const totalWords = parseInt(wordCountSlider.value);
        updateWordDistribution(totalWords, pageCount);
    }

    console.log(`📄 Page count updated: ${pageCount} pages`);
}

/**
 * Updates the word count slider value and recalculates distribution
 */
function updateWordCount(value) {
    const totalWords = parseInt(value);
    const formatted = totalWords.toLocaleString();
    document.getElementById('wordCountValue').textContent = formatted;

    // Store in window for use during text generation
    window.desiredWordCount = totalWords;

    // Update word distribution calculation
    const pageCountSlider = document.getElementById('pageCountSlider');
    if (pageCountSlider) {
        const pageCount = parseInt(pageCountSlider.value);
        updateWordDistribution(totalWords, pageCount);
    }

    console.log(`📝 Word count updated: ${totalWords} words`);
}

/**
 * Calculates and displays words per page based on total words and page count
 */
function updateWordDistribution(totalWords, pageCount) {
    // Reserve words for cover and back page
    const COVER_WORDS = 50;
    const BACK_WORDS = 50;

    // Calculate content pages (exclude cover and back)
    const contentPages = Math.max(1, pageCount - 2);

    // Distribute remaining words across content pages
    const remainingWords = totalWords - COVER_WORDS - BACK_WORDS;
    const wordsPerPage = Math.floor(remainingWords / contentPages);

    // Update display
    const wordsPerPageElement = document.getElementById('wordsPerPage');
    if (wordsPerPageElement) {
        wordsPerPageElement.textContent = `~${wordsPerPage}/page`;
    }

    console.log(`📊 Distribution: ${totalWords} total words = ${COVER_WORDS} (cover) + ${wordsPerPage} × ${contentPages} (content) + ${BACK_WORDS} (back)`);
}

/**
 * Calculates optimal page count based on number of photos
 */
function calculateOptimalPages(photoCount) {
    const MIN_PAGES = 4;
    const MAX_PAGES = 16;
    const PHOTOS_PER_PAGE_AVG = 2.5;

    // +2 for cover and back page
    const calculated = Math.ceil(photoCount / PHOTOS_PER_PAGE_AVG) + 2;

    return Math.max(MIN_PAGES, Math.min(MAX_PAGES, calculated));
}

// Expose globally for Smart Defaults UX enhancements
window.calculateOptimalPages = calculateOptimalPages;

// ============================================
// PREVIEW UPDATE
// ============================================

function updatePageBuilderPreview() {
    // Update BOTH the old section AND the new inline section
    const previewContainer = document.getElementById('pageBuilderPreview');
    const ctaContainer = document.getElementById('pageBuilderCTA');
    const inlinePreviewContainer = document.getElementById('pageBuilderPreviewInline');
    const inlineCTAContainer = document.getElementById('pageBuilderCTAInline');

    if (brochurePages.length === 0) {
        // Hide previews, show CTAs
        if (previewContainer) previewContainer.style.display = 'none';
        if (ctaContainer) ctaContainer.style.display = 'block';
        if (inlinePreviewContainer) inlinePreviewContainer.style.display = 'none';
        if (inlineCTAContainer) inlineCTAContainer.style.display = 'block';
        return;
    }

    // Hide CTAs, show previews
    if (ctaContainer) ctaContainer.style.display = 'none';
    if (previewContainer) previewContainer.style.display = 'block';
    if (inlineCTAContainer) inlineCTAContainer.style.display = 'none';
    if (inlinePreviewContainer) inlinePreviewContainer.style.display = 'block';

    // Render page cards in OLD section
    if (previewContainer) {
        const cardsContainer = previewContainer.querySelector('div');
        if (cardsContainer) {
            cardsContainer.innerHTML = '';
            brochurePages.forEach(page => {
                const card = document.createElement('div');
                card.className = 'page-preview-card';
                const photoCount = page.contentBlocks.filter(b => b.type === 'photo').length;
                card.innerHTML = `
                    <strong>Page ${page.id}: ${page.name}</strong>
                    <span>${photoCount} photo${photoCount !== 1 ? 's' : ''}</span>
                `;
                cardsContainer.appendChild(card);
            });
        }
    }

    // Render page cards in NEW inline section
    if (inlinePreviewContainer) {
        const inlineCardsContainer = inlinePreviewContainer.querySelector('div');
        if (inlineCardsContainer) {
            inlineCardsContainer.innerHTML = '';
            brochurePages.forEach(page => {
                const card = document.createElement('div');
                card.style.cssText = 'background: #f8f9fa; padding: 0.75rem; border-radius: 6px; border: 1px solid #dee2e6;';
                const photoCount = page.contentBlocks.filter(b => b.type === 'photo').length;
                card.innerHTML = `
                    <div style="font-weight: bold; color: #C20430; margin-bottom: 0.25rem;">Page ${page.id}: ${page.name}</div>
                    <div style="color: #6c757d; font-size: 0.85rem;">${photoCount} photo${photoCount !== 1 ? 's' : ''}</div>
                `;
                inlineCardsContainer.appendChild(card);
            });
        }
    }
}

// ============================================
// EXPORT FOR GENERATION
// ============================================

function getPageStructureForGeneration() {
    return brochurePages.map(page => ({
        page_number: page.id,
        page_name: page.name,
        photo_ids: page.photoIds,
        theme: page.theme || 'general'
    }));
}

// ============================================
// INITIALIZATION ON LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializePageBuilder();
    console.log('✅ Page builder ready');
});

// Export functions to window for onclick handlers
window.openPageBuilderModal = openPageBuilderModal;
window.closePageBuilderModal = closePageBuilderModal;
window.savePageBuilderChanges = savePageBuilderChanges;
window.useSmartDefaults = useSmartDefaults;
window.addNewPage = addNewPage;
window.renderBrochurePages = renderBrochurePages;
window.getPageStructureForGeneration = getPageStructureForGeneration;

// Export slider control functions
window.updatePageCount = updatePageCount;
window.updateWordCount = updateWordCount;
window.calculateOptimalPages = calculateOptimalPages;
