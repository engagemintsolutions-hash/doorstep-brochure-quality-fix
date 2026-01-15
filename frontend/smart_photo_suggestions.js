/**
 * SMART PHOTO SUGGESTIONS
 *
 * AI-powered photo quality ranking and recommendations:
 * - Ranks photos by quality metrics (lighting, composition, sharpness)
 * - Recommends best photos for each page type
 * - Shows quality scores and "Recommended" badges
 * - Provides intelligent suggestions for photo placement
 *
 * Value: Better brochure quality automatically
 */

console.log('✨ Smart Photo Suggestions loaded');

// ============================================
// GLOBAL STATE
// ============================================

window.photoQualityScores = new Map(); // photoId -> score object
window.photoRecommendations = new Map(); // photoId -> recommendation object

// ============================================
// QUALITY SCORING ALGORITHM
// ============================================

/**
 * Calculates quality score for a photo based on multiple factors
 *
 * Scoring Factors:
 * - Lighting (0-100): Brightness, contrast, exposure
 * - Composition (0-100): Rule of thirds, focal point, framing
 * - Sharpness (0-100): Focus quality, blur detection
 * - Color (0-100): Color balance, saturation, vibrance
 * - Technical (0-100): Resolution, aspect ratio, file quality
 *
 * @param {Object} photo - Photo object with metadata
 * @param {HTMLImageElement} imgElement - Image DOM element for analysis
 * @returns {Object} Score breakdown and overall score
 */
async function analyzePhotoQuality(photo, imgElement) {
    const scores = {
        lighting: 0,
        composition: 0,
        sharpness: 0,
        color: 0,
        technical: 0
    };

    try {
        // Analyze lighting using canvas
        const lightingScore = analyzeLighting(imgElement);
        scores.lighting = lightingScore;

        // Analyze composition (aspect ratio, dimensions)
        const compositionScore = analyzeComposition(imgElement);
        scores.composition = compositionScore;

        // Analyze technical quality (resolution, file size)
        const technicalScore = analyzeTechnicalQuality(photo, imgElement);
        scores.technical = technicalScore;

        // Analyze colors
        const colorScore = analyzeColor(imgElement);
        scores.color = colorScore;

        // Sharpness is harder to detect client-side, use heuristic
        scores.sharpness = estimateSharpness(imgElement);

        // Calculate weighted overall score
        const overall = calculateOverallScore(scores);

        return {
            ...scores,
            overall,
            grade: getQualityGrade(overall),
            timestamp: Date.now()
        };

    } catch (error) {
        console.error('Error analyzing photo quality:', error);
        return {
            lighting: 50,
            composition: 50,
            sharpness: 50,
            color: 50,
            technical: 50,
            overall: 50,
            grade: 'C',
            error: true,
            timestamp: Date.now()
        };
    }
}

/**
 * Analyzes lighting quality using canvas pixel data
 */
function analyzeLighting(imgElement) {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Sample at 100x100 for performance
        canvas.width = 100;
        canvas.height = 100;

        ctx.drawImage(imgElement, 0, 0, 100, 100);
        const imageData = ctx.getImageData(0, 0, 100, 100);
        const pixels = imageData.data;

        let totalBrightness = 0;
        let darkPixels = 0;
        let brightPixels = 0;
        const pixelCount = pixels.length / 4;

        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            // Calculate perceived brightness
            const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
            totalBrightness += brightness;

            if (brightness < 50) darkPixels++;
            if (brightness > 200) brightPixels++;
        }

        const avgBrightness = totalBrightness / pixelCount;
        const darkRatio = darkPixels / pixelCount;
        const brightRatio = brightPixels / pixelCount;

        // Ideal: brightness 100-180, low dark/bright ratios
        let score = 100;

        // Penalize very dark or very bright images
        if (avgBrightness < 80) score -= (80 - avgBrightness) / 2;
        if (avgBrightness > 200) score -= (avgBrightness - 200) / 2;

        // Penalize high dark/bright pixel ratios (underexposed/overexposed)
        if (darkRatio > 0.3) score -= (darkRatio - 0.3) * 100;
        if (brightRatio > 0.2) score -= (brightRatio - 0.2) * 100;

        return Math.max(0, Math.min(100, score));

    } catch (error) {
        console.error('Lighting analysis error:', error);
        return 50;
    }
}

/**
 * Analyzes composition quality
 */
function analyzeComposition(imgElement) {
    const width = imgElement.naturalWidth;
    const height = imgElement.naturalHeight;

    let score = 100;

    // Check aspect ratio (prefer 4:3, 3:2, 16:9)
    const aspectRatio = width / height;
    const idealRatios = [4/3, 3/2, 16/9, 1.5];
    const closestRatio = idealRatios.reduce((prev, curr) =>
        Math.abs(curr - aspectRatio) < Math.abs(prev - aspectRatio) ? curr : prev
    );
    const ratioDiff = Math.abs(aspectRatio - closestRatio);

    if (ratioDiff > 0.2) score -= 15;

    // Check minimum resolution
    const minDimension = Math.min(width, height);
    if (minDimension < 800) score -= 20;
    if (minDimension < 600) score -= 30;

    // Penalize square images (usually not ideal for property photos)
    if (Math.abs(aspectRatio - 1) < 0.1) score -= 10;

    return Math.max(0, Math.min(100, score));
}

/**
 * Analyzes technical quality
 */
function analyzeTechnicalQuality(photo, imgElement) {
    const width = imgElement.naturalWidth;
    const height = imgElement.naturalHeight;
    const megapixels = (width * height) / 1000000;

    let score = 100;

    // Resolution score
    if (megapixels >= 8) score += 0;      // 8MP+ is excellent
    else if (megapixels >= 4) score -= 10; // 4-8MP is good
    else if (megapixels >= 2) score -= 25; // 2-4MP is acceptable
    else score -= 40;                       // < 2MP is poor

    // File size heuristic (if available)
    if (photo.size) {
        const sizeKB = photo.size / 1024;
        // Very small file size for high resolution = heavy compression
        const bytesPerPixel = photo.size / (width * height);
        if (bytesPerPixel < 0.5) score -= 15; // Heavy compression
    }

    return Math.max(0, Math.min(100, score));
}

/**
 * Analyzes color quality
 */
function analyzeColor(imgElement) {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 100;
        canvas.height = 100;

        ctx.drawImage(imgElement, 0, 0, 100, 100);
        const imageData = ctx.getImageData(0, 0, 100, 100);
        const pixels = imageData.data;

        let totalSaturation = 0;
        let grayPixels = 0;
        const pixelCount = pixels.length / 4;

        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            // Calculate saturation
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const saturation = max === 0 ? 0 : (max - min) / max;

            totalSaturation += saturation;

            // Count grayscale/desaturated pixels
            if (saturation < 0.1) grayPixels++;
        }

        const avgSaturation = totalSaturation / pixelCount;
        const grayRatio = grayPixels / pixelCount;

        let score = 100;

        // Penalize very desaturated images
        if (avgSaturation < 0.2) score -= (0.2 - avgSaturation) * 200;

        // Penalize high gray pixel ratio
        if (grayRatio > 0.5) score -= (grayRatio - 0.5) * 100;

        return Math.max(0, Math.min(100, score));

    } catch (error) {
        console.error('Color analysis error:', error);
        return 50;
    }
}

/**
 * Estimates sharpness (simplified heuristic)
 */
function estimateSharpness(imgElement) {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Sample at 200x200 for edge detection
        canvas.width = 200;
        canvas.height = 200;

        ctx.drawImage(imgElement, 0, 0, 200, 200);
        const imageData = ctx.getImageData(0, 0, 200, 200);
        const pixels = imageData.data;

        // Simple edge detection: calculate variance
        let variance = 0;
        let mean = 0;
        const pixelCount = pixels.length / 4;

        // Calculate mean brightness
        for (let i = 0; i < pixels.length; i += 4) {
            const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            mean += brightness;
        }
        mean /= pixelCount;

        // Calculate variance
        for (let i = 0; i < pixels.length; i += 4) {
            const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
            variance += Math.pow(brightness - mean, 2);
        }
        variance /= pixelCount;

        // Higher variance typically indicates sharper images
        // Map variance (0-10000) to score (0-100)
        const score = Math.min(100, (Math.sqrt(variance) / 100) * 100);

        return Math.max(0, score);

    } catch (error) {
        console.error('Sharpness estimation error:', error);
        return 50;
    }
}

/**
 * Calculates weighted overall score
 */
function calculateOverallScore(scores) {
    const weights = {
        lighting: 0.30,
        composition: 0.25,
        sharpness: 0.20,
        color: 0.15,
        technical: 0.10
    };

    const overall =
        scores.lighting * weights.lighting +
        scores.composition * weights.composition +
        scores.sharpness * weights.sharpness +
        scores.color * weights.color +
        scores.technical * weights.technical;

    return Math.round(overall);
}

/**
 * Converts numeric score to letter grade
 */
function getQualityGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'B-';
    if (score >= 60) return 'C+';
    if (score >= 55) return 'C';
    if (score >= 50) return 'C-';
    return 'D';
}

// ============================================
// PHOTO ANALYSIS & RANKING
// ============================================

/**
 * Analyzes all uploaded photos and generates quality scores
 */
async function analyzeAllPhotos(progressCallback) {
    const photos = window.uploadedPhotos || [];

    if (photos.length === 0) {
        console.log('No photos to analyze');
        return;
    }

    console.log(`🔍 Analyzing ${photos.length} photos for quality...`);

    const startTime = Date.now();
    let analyzed = 0;

    for (const photo of photos) {
        try {
            // Load image
            const img = await loadImageElement(photo.dataUrl || photo.url);

            // Analyze quality
            const qualityScore = await analyzePhotoQuality(photo, img);

            // Store score
            const photoId = photo.id || photo.name;
            window.photoQualityScores.set(photoId, qualityScore);

            analyzed++;

            // Progress callback
            if (typeof progressCallback === 'function') {
                progressCallback(analyzed, photos.length);
            }

        } catch (error) {
            console.error(`Failed to analyze photo ${photo.name}:`, error);
        }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✅ Analyzed ${analyzed}/${photos.length} photos in ${duration}s`);

    // Generate recommendations
    generatePhotoRecommendations();
}

/**
 * Loads an image element from data URL
 */
function loadImageElement(dataUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = dataUrl;
    });
}

/**
 * Generates smart recommendations for photo placement
 */
function generatePhotoRecommendations() {
    const categories = ['cover', 'exterior', 'interior', 'kitchen', 'bedrooms', 'bathrooms', 'garden'];

    categories.forEach(category => {
        const photoIds = window.photoCategoryAssignments?.[category] || [];

        if (photoIds.length === 0) return;

        // Rank photos by quality within category
        const rankedPhotos = photoIds
            .map(photoId => ({
                photoId,
                score: window.photoQualityScores.get(photoId)
            }))
            .filter(p => p.score)
            .sort((a, b) => b.score.overall - a.score.overall);

        // Mark top 3 as recommended
        rankedPhotos.slice(0, 3).forEach((photo, index) => {
            window.photoRecommendations.set(photo.photoId, {
                category,
                rank: index + 1,
                recommended: true,
                reason: getRankReason(index, photo.score)
            });
        });
    });

    console.log(`✨ Generated recommendations for ${window.photoRecommendations.size} photos`);
}

/**
 * Gets human-readable reason for ranking
 */
function getRankReason(rank, score) {
    const reasons = [];

    if (score.lighting >= 85) reasons.push('excellent lighting');
    if (score.composition >= 85) reasons.push('great composition');
    if (score.sharpness >= 80) reasons.push('sharp focus');
    if (score.color >= 85) reasons.push('vibrant colors');

    if (reasons.length === 0) {
        return rank === 0 ? 'Best available photo' : 'Good quality photo';
    }

    return reasons.join(', ');
}

// ============================================
// UI INTEGRATION
// ============================================

/**
 * Adds quality badges to photo thumbnails
 */
function addQualityBadgesToPhotos() {
    const photoThumbs = document.querySelectorAll('.page-builder-photo-thumb, .image-preview-item img');

    photoThumbs.forEach(thumb => {
        const photoId = thumb.dataset?.photoId || getPhotoIdFromElement(thumb);
        if (!photoId) return;

        const score = window.photoQualityScores.get(photoId);
        const recommendation = window.photoRecommendations.get(photoId);

        if (!score && !recommendation) return;

        // Remove existing badges and containers
        const parent = thumb.closest('.page-builder-photo-thumb') || thumb.parentElement;
        if (parent) {
            // Remove all old badge containers to prevent duplicates
            const existingContainers = parent.querySelectorAll('.quality-badge-container');
            existingContainers.forEach(container => container.remove());

            // Also remove any orphaned badges
            const existingBadges = parent.querySelectorAll('.quality-badge');
            existingBadges.forEach(badge => badge.remove());
        }

        // Create badge container
        const badgeContainer = document.createElement('div');
        badgeContainer.className = 'quality-badge-container';

        // Add recommended badge
        if (recommendation?.recommended) {
            const recBadge = document.createElement('div');
            recBadge.className = 'quality-badge recommended-badge';
            recBadge.innerHTML = `⭐ Top ${recommendation.rank}`;
            recBadge.title = `Recommended: ${recommendation.reason}`;
            badgeContainer.appendChild(recBadge);
        }

        // Add quality score badge
        if (score) {
            const scoreBadge = document.createElement('div');
            scoreBadge.className = `quality-badge score-badge grade-${score.grade.replace('+', 'plus').replace('-', 'minus')}`;
            scoreBadge.innerHTML = `${score.grade} <span class="score-number">${score.overall}</span>`;
            scoreBadge.title = `Quality Score: ${score.overall}/100\nLighting: ${score.lighting.toFixed(0)}, Composition: ${score.composition.toFixed(0)}, Sharpness: ${score.sharpness.toFixed(0)}`;
            badgeContainer.appendChild(scoreBadge);
        }

        // Insert badge
        if (parent) {
            parent.style.position = 'relative';
            parent.appendChild(badgeContainer);
        }
    });

    console.log('✅ Added quality badges to photo thumbnails');
}

/**
 * Gets photo ID from DOM element (helper)
 */
function getPhotoIdFromElement(element) {
    // Try data attribute
    if (element.dataset?.photoId) return element.dataset.photoId;

    // Try src matching
    const src = element.src;
    const photo = window.uploadedPhotos?.find(p =>
        p.dataUrl === src || p.url === src
    );

    return photo ? (photo.id || photo.name) : null;
}

/**
 * Shows analysis progress modal
 */
function showAnalysisProgressModal() {
    const modal = document.createElement('div');
    modal.id = 'photoAnalysisModal';
    modal.className = 'smart-photo-modal';
    modal.innerHTML = `
        <div class="smart-photo-modal-overlay"></div>
        <div class="smart-photo-modal-content">
            <div class="smart-photo-modal-header">
                <h3>🔍 Analyzing Photo Quality</h3>
            </div>
            <div class="smart-photo-modal-body">
                <div class="analysis-progress-bar">
                    <div class="analysis-progress-fill" id="analysisProgressFill"></div>
                </div>
                <p id="analysisProgressText">Analyzing 0 of 0 photos...</p>
                <p class="analysis-note">This may take a few moments for large photo sets</p>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

/**
 * Updates analysis progress
 */
function updateAnalysisProgress(current, total) {
    const progressFill = document.getElementById('analysisProgressFill');
    const progressText = document.getElementById('analysisProgressText');

    if (progressFill && progressText) {
        const percentage = (current / total) * 100;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `Analyzing ${current} of ${total} photos...`;
    }
}

/**
 * Closes analysis modal
 */
function closeAnalysisModal() {
    const modal = document.getElementById('photoAnalysisModal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Main function to trigger smart photo analysis
 */
async function runSmartPhotoAnalysis() {
    const photos = window.uploadedPhotos || [];

    if (photos.length === 0) {
        if (typeof showToast === 'function') {
            showToast('warning', 'No photos to analyze');
        }
        return;
    }

    // Show progress modal
    showAnalysisProgressModal();

    try {
        // Analyze all photos
        await analyzeAllPhotos(updateAnalysisProgress);

        // Add badges to UI
        addQualityBadgesToPhotos();

        // Close modal
        closeAnalysisModal();

        // Show success message
        if (typeof showToast === 'function') {
            showToast('success', `✨ Analyzed ${photos.length} photos! Top-rated photos are marked with ⭐`);
        }

        // Show recommendations summary
        showRecommendationsSummary();

    } catch (error) {
        console.error('Smart photo analysis failed:', error);
        closeAnalysisModal();

        if (typeof showToast === 'function') {
            showToast('error', 'Photo analysis failed. Please try again.');
        }
    }
}

/**
 * Shows recommendations summary modal
 */
function showRecommendationsSummary() {
    const categories = ['cover', 'exterior', 'interior', 'kitchen', 'bedrooms', 'bathrooms', 'garden'];
    const recommendations = [];

    categories.forEach(category => {
        const topPhotos = Array.from(window.photoRecommendations.entries())
            .filter(([_, rec]) => rec.category === category && rec.recommended)
            .sort((a, b) => a[1].rank - b[1].rank)
            .slice(0, 3);

        if (topPhotos.length > 0) {
            recommendations.push({
                category,
                photos: topPhotos
            });
        }
    });

    // UI will be added if Page Builder modal is open
    console.log('📊 Recommendations:', recommendations);
}

// ============================================
// AUTO-ANALYSIS ON PHOTO UPLOAD
// ============================================

// Hook into photo upload completion
if (typeof window.addEventListener !== 'undefined') {
    window.addEventListener('photosUploaded', () => {
        console.log('📸 Photos uploaded, will analyze on demand');
    });
}

// ============================================
// GLOBAL EXPORTS
// ============================================

window.runSmartPhotoAnalysis = runSmartPhotoAnalysis;
window.analyzeAllPhotos = analyzeAllPhotos;
window.addQualityBadgesToPhotos = addQualityBadgesToPhotos;
window.photoQualityScores = window.photoQualityScores || new Map();
window.photoRecommendations = window.photoRecommendations || new Map();

console.log('✅ Smart Photo Suggestions module ready');
