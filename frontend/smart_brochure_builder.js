// ============================================
// INTELLIGENT BROCHURE BUILDER
// Narrative-driven, context-aware page generation
// ============================================
console.log('📚 Smart Brochure Builder loaded');

/**
 * PROPERTY CHARACTER DETECTION
 * Analyzes property data and photos to determine character/type
 */
function detectPropertyCharacter(propertyData, photoAssignments) {
    const bedrooms = parseInt(propertyData.bedrooms) || 0;
    const bathrooms = parseInt(propertyData.bathrooms) || 0;
    const price = parseInt(propertyData.askingPrice?.replace(/[£,]/g, '')) || 0;
    const propertyType = (propertyData.propertyType || 'house').toLowerCase();
    const sizeSqft = parseInt(propertyData.sizeSqft) || 0;

    // Count photo types for intelligence
    const photoInventory = {
        hasPool: (photoAssignments.luxury || []).some(id => {
            const photo = window.uploadedPhotos?.find(p => p.id === id || p.name === id);
            return photo && (photo.description || '').toLowerCase().includes('pool');
        }),
        hasGym: (photoAssignments.luxury || []).some(id => {
            const photo = window.uploadedPhotos?.find(p => p.id === id || p.name === id);
            return photo && (photo.description || '').toLowerCase().includes('gym');
        }),
        hasGarden: (photoAssignments.garden || []).length > 0,
        totalPhotos: Object.values(photoAssignments).flat().length,
        hasParking: (photoAssignments.exterior || []).some(id => {
            const photo = window.uploadedPhotos?.find(p => p.id === id || p.name === id);
            return photo && (photo.description || '').toLowerCase().match(/garage|parking|driveway/);
        })
    };

    console.log('🔍 Property analysis:', { bedrooms, bathrooms, price, propertyType, photoInventory });

    // Detection logic (in priority order)
    if (price >= 1000000 || bedrooms >= 5 || photoInventory.hasPool || propertyData.condition === 'luxury') {
        return 'luxury';
    } else if (bedrooms >= 4 && price >= 500000 && sizeSqft >= 2000) {
        return 'executive';
    } else if (propertyData.condition === 'period' || propertyData.epcRating === 'F' || propertyData.epcRating === 'G') {
        return 'period';
    } else if (bedrooms >= 3 && photoInventory.hasGarden) {
        return 'family';
    } else if (propertyType.includes('apartment') || propertyType.includes('flat') || bedrooms <= 2) {
        return 'compact';
    } else {
        return 'modern';
    }
}

/**
 * DYNAMIC TITLE GENERATION
 * Generates contextual page titles based on property character
 */
const PAGE_TITLES = {
    // Page 2: Introduction/Overview
    intro: {
        luxury: 'Executive Summary',
        executive: 'Property Overview',
        family: 'Welcome to Your New Home',
        compact: 'Your Perfect Space',
        period: 'Character & Heritage',
        modern: 'Contemporary Living'
    },

    // Living areas
    living: {
        luxury: 'Entertain in Elegance',
        executive: 'Sophisticated Living Spaces',
        family: 'Spaces for Living',
        compact: 'Smart Living Design',
        period: 'Period Reception Rooms',
        modern: 'Open-Plan Living'
    },

    // Kitchen
    kitchen: {
        luxury: 'Culinary Excellence',
        executive: 'Designer Kitchen',
        family: 'The Heart of the Home',
        compact: 'Stylish Kitchen',
        period: 'Traditional Kitchen',
        modern: 'Contemporary Kitchen & Dining'
    },

    // Bedrooms
    bedrooms: {
        luxury: 'Private Sanctuaries',
        executive: 'Luxurious Bedrooms',
        family: 'Peaceful Retreats',
        compact: 'Restful Bedrooms',
        period: 'Character Bedrooms',
        modern: 'Modern Bedrooms'
    },

    // Bathrooms
    bathrooms: {
        luxury: 'Spa-Inspired Bathrooms',
        executive: 'Premium Bathrooms',
        family: 'Family Bathrooms',
        compact: 'Stylish Bathrooms',
        period: 'Classic Bathrooms',
        modern: 'Contemporary Bathrooms'
    },

    // Outdoor
    outdoor: {
        luxury: 'Private Oasis',
        executive: 'Landscaped Grounds',
        family: 'Your Private Garden',
        compact: 'Outdoor Space',
        period: 'Mature Gardens',
        modern: 'Outdoor Living'
    },

    // Exterior
    exterior: {
        luxury: 'Grand Arrival',
        executive: 'Impressive Exterior',
        family: 'Welcoming Exterior',
        compact: 'Street Appeal',
        period: 'Timeless Architecture',
        modern: 'Contemporary Design'
    }
};

function generateDynamicPageTitle(pageType, character, photoCount = 0) {
    const title = PAGE_TITLES[pageType]?.[character] || PAGE_TITLES[pageType]?.['modern'] || 'Property Features';
    console.log(`📝 Generated title for ${pageType} (${character}): "${title}"`);
    return title;
}

/**
 * INTELLIGENT PHOTO PAIRING
 * Groups photos that work well together for storytelling
 */
function getComplementaryPhotos(primaryCategory, allPhotos, maxCount = 2) {
    const pairingRules = {
        'kitchen': ['dining', 'interior'],
        'bedrooms': ['bathrooms'],  // Master + ensuite
        'garden': ['exterior'],
        'interior': ['kitchen', 'dining']
    };

    const complementary = [];
    const pairs = pairingRules[primaryCategory] || [];

    pairs.forEach(category => {
        if (allPhotos[category] && allPhotos[category].length > 0) {
            const available = maxCount - complementary.length;
            if (available > 0) {
                complementary.push(...allPhotos[category].slice(0, available));
            }
        }
    });

    console.log(`🔗 Found ${complementary.length} complementary photos for ${primaryCategory}`);
    return complementary;
}

/**
 * GET BEST PHOTOS FROM CATEGORY
 * Selects top photos based on quality scoring
 */
function getBestPhotos(photoIds, count = 2) {
    if (!photoIds || photoIds.length === 0) return [];

    // If we have quality scores from photo analysis, use them
    const scoredPhotos = photoIds.map(id => {
        const photo = window.uploadedPhotos?.find(p => p.id === id || p.name === id);
        const score = photo?.qualityScore || 0.5; // Default to neutral score
        return { id, score };
    });

    // Sort by score (descending) and take top count
    scoredPhotos.sort((a, b) => b.score - a.score);
    return scoredPhotos.slice(0, count).map(p => p.id);
}

/**
 * GET TOP SCORED PHOTOS (NEW - CROSS-CATEGORY)
 * Selects top N photos from ALL photos based on impact_score
 * Used for hero page - not constrained by category
 */
function getTopScoredPhotos(photoIds, count = 3) {
    if (!photoIds || photoIds.length === 0) return [];

    // Map photo IDs to their impact scores
    const scoredPhotos = photoIds.map(id => {
        const photo = window.uploadedPhotos?.find(p => p.id === id || p.name === id);
        const score = photo?.impact_score || 50; // Default to neutral score
        return { id, score, photo };
    });

    // Sort by impact_score (descending) and take top count
    scoredPhotos.sort((a, b) => b.score - a.score);
    const topPhotos = scoredPhotos.slice(0, count);

    console.log(`🏆 Selected top ${count} photos by impact score:`);
    topPhotos.forEach((item, idx) => {
        console.log(`  ${idx + 1}. ${item.photo?.name || item.id} (score: ${item.score.toFixed(1)})`);
    });

    return topPhotos.map(item => item.id);
}

/**
 * GENERATE PROPERTY SUMMARY (NEW - HERO PAGE)
 * Creates 2-3 sentence overview for Page 2
 * Based on property data + top photos
 */
function generatePropertySummary(propertyData, photoAssignments, character) {
    const bedrooms = propertyData.bedrooms || 0;
    const bathrooms = propertyData.bathrooms || 0;
    const propertyType = propertyData.propertyType || 'property';
    const address = propertyData.address || '';

    // Detect key features from photos
    const hasPool = (photoAssignments.luxury || []).some(id => {
        const photo = window.uploadedPhotos?.find(p => p.id === id);
        return photo && (photo.analysis?.caption || '').toLowerCase().includes('pool');
    });

    const hasGarden = (photoAssignments.garden || []).length > 0;
    const hasModernKitchen = (photoAssignments.kitchen || []).some(id => {
        const photo = window.uploadedPhotos?.find(p => p.id === id);
        const caption = (photo?.analysis?.caption || '').toLowerCase();
        return caption.includes('modern') || caption.includes('contemporary');
    });

    // Build summary based on character and features
    let summary = '';

    if (character === 'luxury') {
        summary = `Exceptional ${propertyType.toLowerCase()} offering ${bedrooms} bedrooms and ${bathrooms} bathrooms`;
        if (hasPool) summary += ' with swimming pool';
        if (hasGarden) summary += ' and beautifully landscaped gardens';
        summary += ' in this sought-after location.';
    } else if (character === 'executive') {
        summary = `Impressive ${propertyType.toLowerCase()} with ${bedrooms} bedrooms and ${bathrooms} bathrooms`;
        if (hasModernKitchen) summary += ', featuring a high-specification kitchen';
        if (hasGarden) summary += ' and attractive garden';
        summary += '.';
    } else if (character === 'family') {
        summary = `Spacious family home with ${bedrooms} bedrooms and ${bathrooms} bathrooms`;
        if (hasGarden) summary += ', perfect garden for children';
        if (hasModernKitchen) summary += ' and modern kitchen/family room';
        summary += ' in a convenient location.';
    } else {
        summary = `Well-presented ${propertyType.toLowerCase()} comprising ${bedrooms} bedrooms and ${bathrooms} bathrooms`;
        if (hasGarden) summary += ' with garden';
        summary += '.';
    }

    console.log(`📝 Generated property summary: "${summary}"`);
    return summary;
}

/**
 * EXTRACT FEATURE BULLETS (NEW - HERO PAGE)
 * Creates Savills-style bullet list of key features
 */
function extractFeatureBullets(propertyData, photoAssignments) {
    const bullets = [];

    const bedrooms = parseInt(propertyData.bedrooms) || 0;
    const bathrooms = parseInt(propertyData.bathrooms) || 0;
    const propertyType = propertyData.propertyType || 'property';

    // 1. Bedrooms and bathrooms
    if (bedrooms > 0 && bathrooms > 0) {
        const ensuites = Math.min(Math.floor(bedrooms / 2), bathrooms - 1);
        if (ensuites > 0) {
            bullets.push(`${bedrooms} bedrooms and ${bathrooms} bathrooms (${ensuites} en suite)`);
        } else {
            bullets.push(`${bedrooms} bedrooms and ${bathrooms} bathrooms`);
        }
    }

    // 2. Property type and condition
    if (propertyData.condition === 'excellent' || propertyData.condition === 'new') {
        bullets.push('Immaculately presented throughout');
    } else if (propertyData.condition === 'good') {
        bullets.push('Well-maintained throughout');
    }

    // 3. Detect features from photos
    const photoFeatures = [];

    // Check for pool
    if ((photoAssignments.luxury || []).some(id => {
        const photo = window.uploadedPhotos?.find(p => p.id === id);
        return photo && (photo.analysis?.caption || '').toLowerCase().includes('pool');
    })) {
        photoFeatures.push('Swimming pool and seating area');
    }

    // Check for garden
    if ((photoAssignments.garden || []).length > 0) {
        photoFeatures.push('Landscaped rear garden');
    }

    // Check for modern kitchen
    if ((photoAssignments.kitchen || []).some(id => {
        const photo = window.uploadedPhotos?.find(p => p.id === id);
        const caption = (photo?.analysis?.caption || '').toLowerCase();
        return caption.includes('modern') || caption.includes('open plan');
    })) {
        photoFeatures.push('High specification kitchen/family room');
    }

    // Check for parking/garage
    if ((photoAssignments.exterior || []).some(id => {
        const photo = window.uploadedPhotos?.find(p => p.id === id);
        const caption = (photo?.analysis?.caption || '').toLowerCase();
        return caption.match(/garage|parking|driveway/);
    })) {
        photoFeatures.push('Parking and garage');
    }

    // Add detected features
    bullets.push(...photoFeatures);

    // 4. Size if available
    if (propertyData.sizeSqft && propertyData.sizeSqft > 0) {
        bullets.push(`Approximately ${propertyData.sizeSqft.toLocaleString()} sq ft`);
    }

    // 5. EPC if available
    if (propertyData.epcRating) {
        bullets.push(`EPC Rating: ${propertyData.epcRating}`);
    }

    console.log(`📋 Generated ${bullets.length} feature bullets`);
    return bullets;
}

/**
 * GENERATE INTELLIGENT BROCHURE
 * Main function that creates narrative-driven pages
 */
window.generateSmartDefaultPagesIntelligent = function() {
    console.log('🎯 Generating intelligent brochure with narrative structure...');

    const pages = [];
    let pageNumber = 1;

    // Get property data
    const propertyData = {
        bedrooms: document.getElementById('bedrooms')?.value || '3',
        bathrooms: document.getElementById('bathrooms')?.value || '2',
        askingPrice: document.getElementById('askingPrice')?.value || '0',
        propertyType: document.getElementById('propertyType')?.value || 'house',
        condition: document.getElementById('condition')?.value || 'good',
        epcRating: document.getElementById('epcRating')?.value,
        sizeSqft: document.getElementById('sizeSqft')?.value,
        hasAgentPhoto: document.getElementById('includeAgentPhoto')?.checked || false,
        houseName: document.getElementById('houseName')?.value,
        address: document.getElementById('address')?.value,
        postcode: document.getElementById('postcode')?.value
    };

    // Get all content blocks from form
    const contentBlocks = typeof collectFormDataAsBlocks === 'function' ? collectFormDataAsBlocks() : [];
    console.log('📦 Collected', contentBlocks.length, 'content blocks');

    // Detect property character
    const character = detectPropertyCharacter(propertyData, window.photoCategoryAssignments);
    console.log('🏠 Property character:', character);

    // Get photo assignments
    const photos = window.photoCategoryAssignments || {};

    // Helper to create content blocks
    function createPageContent(photoIds, blockTypes = []) {
        const content = [];

        // Add photos
        photoIds.forEach(photoId => {
            content.push({
                type: 'photo',
                photoId: photoId,
                id: `photo_${photoId}_${Date.now()}_${Math.random()}`
            });
        });

        // Add matching text blocks
        blockTypes.forEach(blockType => {
            const matchingBlocks = contentBlocks.filter(b => {
                if (typeof blockType === 'string') {
                    return b.type === blockType;
                } else if (typeof blockType === 'object') {
                    return b.type === blockType.type && (!blockType.category || b.category === blockType.category);
                }
                return false;
            });
            content.push(...matchingBlocks);
        });

        return content;
    }

    // ========================================
    // PAGE 1: COVER (ALWAYS FIRST, ALWAYS EXISTS)
    // ========================================
    const coverPhotos = photos.cover || [];

    // ALWAYS create cover page, even if no cover photo assigned yet
    const coverPhotoId = coverPhotos.length > 0 ? coverPhotos[0] : null;
    const coverContentBlocks = [];

    if (coverPhotoId) {
        coverContentBlocks.push({
            type: 'photo',
            photoId: coverPhotoId,
            id: `photo_${coverPhotoId}_${Date.now()}`
        });
    }

    pages.push({
        id: pageNumber++,
        name: propertyData.houseName || propertyData.address || 'Welcome',
        contentBlocks: coverContentBlocks,
        locked: true,  // Cover is always locked
        theme: 'welcoming'
    });
    console.log(`✅ Page 1: Cover ${coverPhotoId ? '(with photo)' : '(placeholder - add cover photo)'}`);


    // ========================================
    // PAGE 2: INTRODUCTION / EXECUTIVE SUMMARY (HERO PAGE)
    // ========================================
    // NEW: Get TOP 3 photos from ALL categories based on impact score
    const allPhotoIds = Object.values(photos).flat();
    const top3Photos = getTopScoredPhotos(allPhotoIds, 3);  // NEW FUNCTION

    console.log(`📊 Selected top 3 photos for hero page:`, top3Photos.map(id => {
        const photo = window.uploadedPhotos?.find(p => p.id === id);
        return photo ? `${photo.name} (score: ${photo.impact_score || 'N/A'})` : id;
    }));

    if (top3Photos.length > 0) {
        // NEW: Build hero page with property summary + feature bullets
        const propertySummary = generatePropertySummary(propertyData, photos, character);
        const featureBullets = extractFeatureBullets(propertyData, photos);

        const heroBlocks = [
            // Top 3 photos
            ...top3Photos.map(photoId => ({
                type: 'photo',
                photoId: photoId,
                id: `photo_${photoId}_${Date.now()}_${Math.random()}`
            })),
            // Property summary (2-3 sentences)
            {
                type: 'text',
                category: 'property_summary',
                text: propertySummary,
                id: `summary_${Date.now()}`
            },
            // Feature bullets list
            {
                type: 'text',
                category: 'feature_bullets',
                text: featureBullets.map(b => `• ${b}`).join('\n'),
                id: `bullets_${Date.now()}`
            },
            // Agent contact
            ...contentBlocks.filter(b => b.type === 'agent_contact')
        ];

        pages.push({
            id: pageNumber++,
            name: generateDynamicPageTitle('intro', character),
            contentBlocks: heroBlocks,
            locked: false,
            theme: 'intro'
        });
        console.log(`✅ Page 2: Hero page with top 3 photos + summary + ${featureBullets.length} bullets + agent`);
    }

    // ========================================
    // PAGE 3: LIVING AREAS (Kitchen + Dining + Living)
    // ========================================
    const livingPhotos = [
        ...(photos.kitchen || []),
        ...(photos.interior || []),
        ...(photos.reception || [])
    ].slice(0, 4); // Max 4 photos

    if (livingPhotos.length > 0) {
        pages.push({
            id: pageNumber++,
            name: generateDynamicPageTitle('living', character),
            contentBlocks: createPageContent(
                livingPhotos,
                [
                    { type: 'features', category: 'kitchen' },
                    { type: 'features', category: 'indoor' }
                ]
            ),
            locked: false,
            theme: 'entertaining'
        });
        console.log('✅ Page 3: Living areas');
    }

    // ========================================
    // PAGE 4: BEDROOMS & BATHROOMS
    // ========================================
    const bedroomPhotos = (photos.bedrooms || []).slice(0, 3); // Max 3 bedrooms
    const bathroomPhotos = (photos.bathrooms || []).slice(0, 1); // 1 bathroom
    const sleepingPhotos = [...bedroomPhotos, ...bathroomPhotos];

    if (sleepingPhotos.length > 0) {
        pages.push({
            id: pageNumber++,
            name: generateDynamicPageTitle('bedrooms', character),
            contentBlocks: createPageContent(
                sleepingPhotos,
                [
                    { type: 'features', category: 'bedrooms' },
                    { type: 'features', category: 'bathrooms' }
                ]
            ),
            locked: false,
            theme: 'comfortable'
        });
        console.log('✅ Page 4: Bedrooms & Bathrooms');
    }

    // ========================================
    // PAGE 5: OUTDOOR / GARDEN (ONLY IF PHOTOS EXIST)
    // ========================================
    const gardenPhotos = photos.garden || [];
    if (gardenPhotos.length > 0) {
        pages.push({
            id: pageNumber++,
            name: generateDynamicPageTitle('outdoor', character),
            contentBlocks: createPageContent(
                gardenPhotos.slice(0, 4),
                [{ type: 'features', category: 'outdoor' }]
            ),
            locked: false,
            theme: 'outdoor'
        });
        console.log('✅ Page 5: Garden/Outdoor (conditional - photos exist)');
    } else {
        console.log('⏭️  Skipped garden page (no photos)');
    }

    // ========================================
    // PAGE X: FLOORPLAN (ALWAYS INCLUDE IF EXISTS)
    // ========================================
    const floorplanBlock = contentBlocks.find(b => b.type === 'floorplan');
    if (floorplanBlock) {
        pages.push({
            id: pageNumber++,
            name: 'Property Layout',
            contentBlocks: [floorplanBlock],
            locked: false,
            theme: 'technical'
        });
        console.log('✅ Floorplan page added (always included)');
    }

    // ========================================
    // FINAL PAGE: AGENT CONTACT (ALWAYS LAST)
    // ========================================
    const agentBlock = contentBlocks.find(b => b.type === 'agent_contact');
    if (agentBlock || propertyData.hasAgentPhoto) {
        const agentContentBlocks = agentBlock ? [agentBlock] : [];

        // Add property details as well
        const propertyDetailsBlock = contentBlocks.find(b => b.type === 'property_details');
        if (propertyDetailsBlock) {
            agentContentBlocks.push(propertyDetailsBlock);
        }

        pages.push({
            id: pageNumber++,
            name: 'Get In Touch',
            contentBlocks: agentContentBlocks,
            locked: false,
            theme: 'contact'
        });
        console.log('✅ Final page: Agent contact');
    }

    console.log(`🎉 Generated ${pages.length} intelligent pages`);
    return pages;
};

console.log('✅ Smart Brochure Builder ready');
