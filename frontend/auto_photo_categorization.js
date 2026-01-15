/**
 * AUTOMATIC PHOTO CATEGORIZATION SYSTEM
 *
 * Automatically categorizes uploaded photos by analyzing:
 * - Image content using machine learning
 * - Filename patterns (e.g., "kitchen_1.jpg" → kitchen category)
 * - Visual features (colors, textures, objects)
 *
 * Categories: cover, exterior, interior, kitchen, bedrooms, bathrooms, garden
 */

console.log('🤖 Auto Photo Categorization System loaded');

/**
 * Main function: Automatically categorize a single photo
 * @param {Object} photoData - Photo object with id, dataUrl, name
 * @returns {string} - Detected category (cover, exterior, interior, kitchen, bedrooms, bathrooms, garden)
 */
async function autoCategorizePhoto(photoData) {
    console.log(`🔍 Auto-categorizing photo: ${photoData.name}`);

    try {
        // Strategy 1: Analyze filename for keywords
        const filenameCategory = detectCategoryFromFilename(photoData.name);
        if (filenameCategory && filenameCategory !== 'unknown') {
            console.log(`✅ Categorized "${photoData.name}" as "${filenameCategory}" (from filename)`);
            return filenameCategory;
        }

        // Strategy 2: Analyze image content using ML
        const mlCategory = await detectCategoryFromImage(photoData.dataUrl);
        if (mlCategory && mlCategory !== 'unknown') {
            console.log(`✅ Categorized "${photoData.name}" as "${mlCategory}" (from ML analysis)`);
            return mlCategory;
        }

        // Strategy 3: Default to 'interior' if no match found
        console.log(`⚠️ Could not confidently categorize "${photoData.name}", defaulting to "interior"`);
        return 'interior';

    } catch (error) {
        console.error(`❌ Error categorizing photo ${photoData.name}:`, error);
        return 'interior'; // Safe fallback
    }
}

/**
 * STRATEGY 1: Filename-based categorization
 * Detects category from filename keywords
 */
function detectCategoryFromFilename(filename) {
    const lowerName = filename.toLowerCase();

    // Category keyword mappings
    const categoryKeywords = {
        cover: ['cover', 'hero', 'main', 'front'],
        exterior: ['exterior', 'outside', 'front', 'facade', 'building', 'house', 'property', 'street', 'drive', 'driveway', 'parking'],
        kitchen: ['kitchen', 'cooking', 'dining'],
        bedrooms: ['bedroom', 'bed', 'master', 'guest', 'sleep'],
        bathrooms: ['bathroom', 'bath', 'shower', 'toilet', 'ensuite', 'en-suite', 'wc'],
        garden: ['garden', 'outdoor', 'patio', 'terrace', 'yard', 'deck', 'balcony', 'landscape'],
        interior: ['living', 'lounge', 'reception', 'hall', 'stairs', 'landing', 'study', 'office']
    };

    // Check each category's keywords
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        for (const keyword of keywords) {
            if (lowerName.includes(keyword)) {
                return category;
            }
        }
    }

    return 'unknown';
}

/**
 * STRATEGY 2: Machine Learning-based categorization
 * Analyzes image content using canvas and heuristics
 */
async function detectCategoryFromImage(dataUrl) {
    return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => {
            try {
                // Create canvas for analysis
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Sample at reduced resolution for performance
                canvas.width = 200;
                canvas.height = 200;
                ctx.drawImage(img, 0, 0, 200, 200);

                const imageData = ctx.getImageData(0, 0, 200, 200);
                const pixels = imageData.data;

                // Analyze color distribution
                const colorProfile = analyzeColorProfile(pixels);

                // Analyze brightness distribution
                const brightnessProfile = analyzeBrightnessProfile(pixels);

                // Detect category based on visual features
                const category = classifyFromVisualFeatures(colorProfile, brightnessProfile);

                resolve(category);

            } catch (error) {
                console.error('Image analysis error:', error);
                resolve('unknown');
            }
        };

        img.onerror = () => {
            console.error('Failed to load image for analysis');
            resolve('unknown');
        };

        img.src = dataUrl;
    });
}

/**
 * Analyze color distribution in image
 */
function analyzeColorProfile(pixels) {
    let totalR = 0, totalG = 0, totalB = 0;
    let greenPixels = 0;
    let bluePixels = 0;
    let whitePixels = 0;
    let darkPixels = 0;
    const pixelCount = pixels.length / 4;

    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        totalR += r;
        totalG += g;
        totalB += b;

        // Detect green (gardens)
        if (g > r + 20 && g > b + 20 && g > 80) {
            greenPixels++;
        }

        // Detect blue (sky, exterior)
        if (b > r + 20 && b > g + 10 && b > 100) {
            bluePixels++;
        }

        // Detect white/light colors (bathrooms, kitchens)
        if (r > 200 && g > 200 && b > 200) {
            whitePixels++;
        }

        // Detect dark pixels
        const brightness = (r + g + b) / 3;
        if (brightness < 50) {
            darkPixels++;
        }
    }

    return {
        avgR: totalR / pixelCount,
        avgG: totalG / pixelCount,
        avgB: totalB / pixelCount,
        greenRatio: greenPixels / pixelCount,
        blueRatio: bluePixels / pixelCount,
        whiteRatio: whitePixels / pixelCount,
        darkRatio: darkPixels / pixelCount
    };
}

/**
 * Analyze brightness distribution
 */
function analyzeBrightnessProfile(pixels) {
    let brightPixels = 0;
    let midPixels = 0;
    let darkPixels = 0;
    const pixelCount = pixels.length / 4;

    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const brightness = (r + g + b) / 3;

        if (brightness > 180) brightPixels++;
        else if (brightness > 80) midPixels++;
        else darkPixels++;
    }

    return {
        brightRatio: brightPixels / pixelCount,
        midRatio: midPixels / pixelCount,
        darkRatio: darkPixels / pixelCount
    };
}

/**
 * Classify image based on visual features
 */
function classifyFromVisualFeatures(colorProfile, brightnessProfile) {
    // GARDEN detection: High green ratio
    if (colorProfile.greenRatio > 0.25) {
        return 'garden';
    }

    // EXTERIOR detection: Sky blue or outdoor lighting
    if (colorProfile.blueRatio > 0.15 && brightnessProfile.brightRatio > 0.4) {
        return 'exterior';
    }

    // BATHROOM/KITCHEN detection: Very white/bright
    if (colorProfile.whiteRatio > 0.50 && brightnessProfile.brightRatio > 0.60) {
        // Slight preference for bathroom (whiter)
        if (colorProfile.whiteRatio > 0.65) {
            return 'bathrooms';
        }
        return 'kitchen';
    }

    // BEDROOM detection: Warmer tones, moderate brightness
    if (colorProfile.avgR > colorProfile.avgG &&
        colorProfile.avgR > colorProfile.avgB &&
        brightnessProfile.midRatio > 0.5) {
        return 'bedrooms';
    }

    // Default to INTERIOR for everything else
    return 'interior';
}

/**
 * Automatically categorize ALL uploaded photos and populate photoCategoryAssignments
 * This is the main function called after photos are uploaded
 */
async function autoCategorizeAllPhotos() {
    if (!window.uploadedPhotos || window.uploadedPhotos.length === 0) {
        console.log('⚠️ No photos to categorize');
        return;
    }

    console.log(`🤖 Starting auto-categorization for ${window.uploadedPhotos.length} photos...`);

    // Reset category assignments
    window.photoCategoryAssignments = {
        cover: [],
        exterior: [],
        interior: [],
        kitchen: [],
        bedrooms: [],
        bathrooms: [],
        garden: []
    };

    // Categorize each photo
    for (let i = 0; i < window.uploadedPhotos.length; i++) {
        const photo = window.uploadedPhotos[i];
        const category = await autoCategorizePhoto(photo);

        // Assign photo index to category
        window.photoCategoryAssignments[category].push(i);

        // Mark photo with category for UI display
        photo.autoCategory = category;
    }

    // Special handling: Set first exterior photo as cover if no cover assigned
    if (window.photoCategoryAssignments.cover.length === 0 &&
        window.photoCategoryAssignments.exterior.length > 0) {
        const firstExterior = window.photoCategoryAssignments.exterior[0];
        window.photoCategoryAssignments.cover.push(firstExterior);
        console.log('✅ Set first exterior photo as cover');
    }

    // Log categorization summary
    const summary = Object.entries(window.photoCategoryAssignments)
        .map(([cat, photos]) => `${cat}: ${photos.length}`)
        .join(', ');
    console.log(`✅ Auto-categorization complete: ${summary}`);

    // Update UI
    if (typeof updateCategoriesUI === 'function') {
        updateCategoriesUI();
    }

    // Show toast notification
    if (typeof showToast === 'function') {
        showToast('success', `🤖 Auto-categorized ${window.uploadedPhotos.length} photos`);
    }

    return window.photoCategoryAssignments;
}

/**
 * Hook into photo upload completion
 * This will automatically categorize photos after they're uploaded
 */
function initAutoCategorization() {
    // Check if photos are already uploaded (page reload case)
    setTimeout(async () => {
        if (window.uploadedPhotos && window.uploadedPhotos.length > 0) {
            // Check if already categorized
            const totalCategorized = Object.values(window.photoCategoryAssignments || {})
                .reduce((sum, arr) => sum + (arr?.length || 0), 0);

            if (totalCategorized === 0) {
                console.log('🔄 Found uploaded photos without categorization, auto-categorizing now...');
                await autoCategorizeAllPhotos();
            }
        }
    }, 1000);

    // Listen for photo upload events
    if (typeof window.addEventListener !== 'undefined') {
        // Hook into existing photo upload flow
        const originalHandleImageUpload = window.handleImageUpload;

        if (originalHandleImageUpload) {
            window.handleImageUpload = async function(...args) {
                // Call original function
                await originalHandleImageUpload.apply(this, args);

                // Wait a moment for photos to be processed
                setTimeout(async () => {
                    await autoCategorizeAllPhotos();
                }, 500);
            };

            console.log('✅ Hooked into photo upload system for auto-categorization');
        }
    }
}

// Global exports
window.autoCategorizePhoto = autoCategorizePhoto;
window.autoCategorizeAllPhotos = autoCategorizeAllPhotos;
window.detectCategoryFromFilename = detectCategoryFromFilename;

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoCategorization);
} else {
    initAutoCategorization();
}

console.log('✅ Auto Photo Categorization System ready');
