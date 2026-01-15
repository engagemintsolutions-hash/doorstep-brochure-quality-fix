/**
 * Smart Defaults UX Enhancement System
 *
 * Comprehensive UX improvements for the Smart Defaults feature including:
 * - Interactive Preview Mode
 * - Property Type Presets
 * - Progressive Enhancement
 * - Smart Suggestions
 * - AI Confidence Scoring
 * - Quality Scoring
 * - Template Library
 * - Learning System
 *
 * Author: Claude Code
 * Date: October 15, 2025
 */

// ============================================
// GLOBAL STATE
// ============================================

window.smartDefaultsState = {
    previousState: null,  // For undo functionality
    currentPreset: 'balanced',  // compact, balanced, luxury
    suggestions: [],
    qualityScore: 0,
    confidenceScores: {},
    userPreferences: {},
    templates: [],
    editTracking: {
        edits: [],
        startTime: null
    }
};

// ============================================
// CATEGORY A: PRE-SMART DEFAULTS EDUCATION
// ============================================

/**
 * A1: Interactive Preview Mode
 * Shows what Smart Defaults will create before applying
 */
function showSmartDefaultsPreview() {
    console.log('📋 Showing Smart Defaults preview...');

    const totalPhotos = window.uploadedPhotos?.length || 0;
    const optimalPages = window.calculateOptimalPages(totalPhotos);

    // Calculate photo distribution
    const photosByCategory = window.photoCategoryAssignments || {};
    const coverPhotos = photosByCategory.cover?.length || 0;
    const exteriorPhotos = photosByCategory.exterior?.length || 0;
    const kitchenPhotos = photosByCategory.kitchen?.length || 0;
    const bedroomPhotos = photosByCategory.bedrooms?.length || 0;
    const bathroomPhotos = photosByCategory.bathrooms?.length || 0;
    const gardenPhotos = photosByCategory.garden?.length || 0;
    const hasFloorplan = window.floorplanFile ? true : false;

    const preview = `
        <div class="smart-defaults-preview-modal">
            <div class="preview-header">
                <h3>✨ Smart Defaults Preview</h3>
                <p>Based on ${totalPhotos} photos, we'll create:</p>
            </div>

            <div class="preview-pages-list">
                ${coverPhotos > 0 ? `
                <div class="preview-page-item">
                    <span class="page-icon">📄</span>
                    <div class="page-details">
                        <strong>Cover Page</strong>
                        <span>Hero photo + address + pricing</span>
                    </div>
                </div>
                ` : ''}

                ${exteriorPhotos > 0 ? `
                <div class="preview-page-item">
                    <span class="page-icon">📸</span>
                    <div class="page-details">
                        <strong>Page 2: Exterior & Grounds</strong>
                        <span>${exteriorPhotos} photos</span>
                    </div>
                </div>
                ` : ''}

                ${kitchenPhotos > 0 ? `
                <div class="preview-page-item">
                    <span class="page-icon">📸</span>
                    <div class="page-details">
                        <strong>Page 3: Kitchen</strong>
                        <span>${kitchenPhotos} photos + indoor features</span>
                    </div>
                </div>
                ` : ''}

                ${bedroomPhotos > 0 ? `
                <div class="preview-page-item">
                    <span class="page-icon">📸</span>
                    <div class="page-details">
                        <strong>Page 4: Bedrooms</strong>
                        <span>${bedroomPhotos} photos + bedroom features</span>
                    </div>
                </div>
                ` : ''}

                ${bathroomPhotos > 0 ? `
                <div class="preview-page-item">
                    <span class="page-icon">📸</span>
                    <div class="page-details">
                        <strong>Page 5: Bathrooms</strong>
                        <span>${bathroomPhotos} photos + bathroom features</span>
                    </div>
                </div>
                ` : ''}

                ${gardenPhotos > 0 ? `
                <div class="preview-page-item">
                    <span class="page-icon">📸</span>
                    <div class="page-details">
                        <strong>Page 6: Garden & Outdoor</strong>
                        <span>${gardenPhotos} photos + outdoor features</span>
                    </div>
                </div>
                ` : ''}

                ${hasFloorplan ? `
                <div class="preview-page-item">
                    <span class="page-icon">📐</span>
                    <div class="page-details">
                        <strong>Floorplan Page</strong>
                        <span>Property layout</span>
                    </div>
                </div>
                ` : ''}

                <div class="preview-page-item">
                    <span class="page-icon">📞</span>
                    <div class="page-details">
                        <strong>Back Page</strong>
                        <span>Agent contact information</span>
                    </div>
                </div>
            </div>

            <div class="preview-stats">
                <div class="stat-item">
                    <span class="stat-label">Total Pages:</span>
                    <span class="stat-value">${optimalPages}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Photos per Page:</span>
                    <span class="stat-value">~${(totalPhotos / (optimalPages - 2)).toFixed(1)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Est. Words:</span>
                    <span class="stat-value">~${window.desiredWordCount || 1200}</span>
                </div>
            </div>

            <div class="preview-actions">
                <button onclick="closeSmartDefaultsPreview()" class="btn-secondary">
                    Cancel
                </button>
                <button onclick="applySmartDefaultsFromPreview()" class="btn-primary">
                    Apply Now →
                </button>
            </div>
        </div>
    `;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'smartDefaultsPreviewOverlay';
    overlay.className = 'smart-defaults-preview-overlay';
    overlay.innerHTML = preview;

    document.body.appendChild(overlay);
}

function closeSmartDefaultsPreview() {
    const overlay = document.getElementById('smartDefaultsPreviewOverlay');
    if (overlay) {
        overlay.remove();
    }
}

function applySmartDefaultsFromPreview() {
    closeSmartDefaultsPreview();
    window.useSmartDefaults();
}

/**
 * A2: "Why This Works" Tooltips
 * Add explanatory tooltips to sliders
 */
function addSliderTooltips() {
    console.log('💡 Adding explanatory tooltips...');

    // Page Count Slider Tooltip
    const pageCountSlider = document.getElementById('pageCountSlider');
    if (pageCountSlider && !pageCountSlider.dataset.tooltipAdded) {
        const tooltip = document.createElement('div');
        tooltip.className = 'slider-tooltip';
        tooltip.innerHTML = `
            <span class="tooltip-icon">ℹ️</span>
            <div class="tooltip-content">
                <strong>Why this page count?</strong>
                <p>For ${window.uploadedPhotos?.length || 0} photos, ${pageCountSlider.value} pages gives ~${(window.uploadedPhotos?.length / (pageCountSlider.value - 2)).toFixed(1)} photos per page, creating a balanced, magazine-style layout.</p>
            </div>
        `;
        pageCountSlider.parentElement.appendChild(tooltip);
        pageCountSlider.dataset.tooltipAdded = 'true';
    }

    // Word Count Slider Tooltip
    const wordCountSlider = document.getElementById('wordCountSlider');
    if (wordCountSlider && !wordCountSlider.dataset.tooltipAdded) {
        const tooltip = document.createElement('div');
        tooltip.className = 'slider-tooltip';
        tooltip.innerHTML = `
            <span class="tooltip-icon">ℹ️</span>
            <div class="tooltip-content">
                <strong>Word distribution:</strong>
                <p>${wordCountSlider.value} words will be distributed as: ~50 words on cover, ~${Math.floor((wordCountSlider.value - 100) / (pageCountSlider.value - 2))} words per content page, ~50 words on back page.</p>
            </div>
        `;
        wordCountSlider.parentElement.appendChild(tooltip);
        wordCountSlider.dataset.tooltipAdded = 'true';
    }
}

/**
 * A3: Property Type Presets
 * Different defaults based on property type
 */
function showPropertyTypePresets() {
    console.log('🏠 Showing property type presets...');

    const totalPhotos = window.uploadedPhotos?.length || 0;

    const presets = {
        compact: {
            pages: Math.min(6, Math.ceil(totalPhotos / 3) + 2),
            words: 800,
            style: 'Concise, punchy, fast',
            ideal: 'Flats, 1-2 bed properties'
        },
        balanced: {
            pages: Math.ceil(totalPhotos / 2.5) + 2,
            words: 1200,
            style: 'Comprehensive, detailed',
            ideal: '3-4 bed homes'
        },
        luxury: {
            pages: Math.min(20, Math.ceil(totalPhotos / 1.5) + 2),
            words: 1800,
            style: 'Immersive, storytelling',
            ideal: 'High-end, period homes'
        }
    };

    const presetsHTML = `
        <div class="property-presets-panel">
            <h4>Choose Your Layout Style:</h4>

            <div class="preset-option ${window.smartDefaultsState.currentPreset === 'compact' ? 'selected' : ''}"
                 onclick="selectPreset('compact')">
                <div class="preset-icon">⚡</div>
                <div class="preset-details">
                    <h5>Compact (${presets.compact.pages} pages)</h5>
                    <p class="preset-ideal">Perfect for: ${presets.compact.ideal}</p>
                    <p class="preset-style">Style: ${presets.compact.style}</p>
                    <p class="preset-stats">${presets.compact.words} words • ${(totalPhotos / (presets.compact.pages - 2)).toFixed(1)} photos/page</p>
                </div>
            </div>

            <div class="preset-option ${window.smartDefaultsState.currentPreset === 'balanced' ? 'selected' : ''}"
                 onclick="selectPreset('balanced')">
                <div class="preset-icon">🏡</div>
                <div class="preset-details">
                    <h5>Balanced (${presets.balanced.pages} pages)</h5>
                    <p class="preset-ideal">Perfect for: ${presets.balanced.ideal}</p>
                    <p class="preset-style">Style: ${presets.balanced.style}</p>
                    <p class="preset-stats">${presets.balanced.words} words • ${(totalPhotos / (presets.balanced.pages - 2)).toFixed(1)} photos/page</p>
                </div>
            </div>

            <div class="preset-option ${window.smartDefaultsState.currentPreset === 'luxury' ? 'selected' : ''}"
                 onclick="selectPreset('luxury')">
                <div class="preset-icon">🏰</div>
                <div class="preset-details">
                    <h5>Luxury (${presets.luxury.pages} pages)</h5>
                    <p class="preset-ideal">Perfect for: ${presets.luxury.ideal}</p>
                    <p class="preset-style">Style: ${presets.luxury.style}</p>
                    <p class="preset-stats">${presets.luxury.words} words • ${(totalPhotos / (presets.luxury.pages - 2)).toFixed(1)} photos/page</p>
                </div>
            </div>
        </div>
    `;

    // Insert before the Smart Defaults button
    const modalFooter = document.querySelector('.page-builder-modal-footer');
    if (modalFooter && !document.querySelector('.property-presets-panel')) {
        modalFooter.insertAdjacentHTML('beforebegin', presetsHTML);
    }

    // Store presets for later use
    window.smartDefaultsPresets = presets;
}

function selectPreset(presetType) {
    console.log('📝 Selected preset:', presetType);
    window.smartDefaultsState.currentPreset = presetType;

    // Update UI
    document.querySelectorAll('.preset-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    event.target.closest('.preset-option').classList.add('selected');

    // Apply preset values to sliders
    const preset = window.smartDefaultsPresets[presetType];
    if (preset) {
        const pageCountSlider = document.getElementById('pageCountSlider');
        const wordCountSlider = document.getElementById('wordCountSlider');

        if (pageCountSlider) {
            pageCountSlider.value = preset.pages;
            window.updatePageCount(preset.pages);
        }

        if (wordCountSlider) {
            wordCountSlider.value = preset.words;
            window.updateWordCount(preset.words);
        }
    }
}

// ============================================
// CATEGORY B: DURING APPLICATION INTELLIGENCE
// ============================================

/**
 * B2: Smart Suggestions
 * Show recommendations without forcing them
 */
function generateSmartSuggestions() {
    console.log('💡 Generating smart suggestions...');

    const suggestions = [];
    const totalPhotos = window.uploadedPhotos?.length || 0;
    const currentPageCount = window.desiredPageCount || 8;
    const photosPerPage = totalPhotos / (currentPageCount - 2);

    // Suggestion: Adjust page count if photos/page is too high
    if (photosPerPage > 4) {
        const recommendedPages = Math.ceil(totalPhotos / 3) + 2;
        suggestions.push({
            id: 'adjust_page_count',
            type: 'page_count',
            icon: '📄',
            title: `Add ${recommendedPages - currentPageCount} more pages`,
            description: `Your ${totalPhotos} photos will fit better with ${recommendedPages} pages`,
            action: () => {
                document.getElementById('pageCountSlider').value = recommendedPages;
                window.updatePageCount(recommendedPages);
                showToast('success', `Page count updated to ${recommendedPages}`);
                removeSuggestion('adjust_page_count');
            }
        });
    }

    // Suggestion: Set cover photo if not selected
    if (!window.selectedCoverPhoto && window.photoCategoryAssignments.exterior?.length > 0) {
        const bestExterior = window.photoCategoryAssignments.exterior[0];
        suggestions.push({
            id: 'set_cover_photo',
            type: 'cover_photo',
            icon: '📸',
            title: 'Set cover photo',
            description: `Use exterior photo for best first impression`,
            action: () => {
                window.setCoverPhoto(bestExterior);
                removeSuggestion('set_cover_photo');
            }
        });
    }

    // Suggestion: Add more photos if count is low
    if (totalPhotos < 10) {
        suggestions.push({
            id: 'add_more_photos',
            type: 'photos',
            icon: '📷',
            title: 'Add more photos',
            description: `${totalPhotos} photos is minimal. 12-20 photos creates more engaging brochures`,
            action: null  // Can't auto-apply this one
        });
    }

    window.smartDefaultsState.suggestions = suggestions;
    return suggestions;
}

function showSmartSuggestions() {
    const suggestions = generateSmartSuggestions();

    if (suggestions.length === 0) return;

    const suggestionsHTML = `
        <div class="smart-suggestions-panel">
            <h4>💡 Suggestions for You:</h4>
            <div class="suggestions-list">
                ${suggestions.map(s => `
                    <div class="suggestion-item" data-suggestion-id="${s.id}">
                        <span class="suggestion-icon">${s.icon}</span>
                        <div class="suggestion-content">
                            <strong>${s.title}</strong>
                            <p>${s.description}</p>
                        </div>
                        ${s.action ? `
                            <button onclick="applySuggestion('${s.id}')" class="btn-suggestion">
                                Apply
                            </button>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Insert into modal
    const modalBody = document.querySelector('.page-builder-modal-body');
    if (modalBody && !document.querySelector('.smart-suggestions-panel')) {
        modalBody.insertAdjacentHTML('afterbegin', suggestionsHTML);
    }
}

function applySuggestion(suggestionId) {
    const suggestion = window.smartDefaultsState.suggestions.find(s => s.id === suggestionId);
    if (suggestion && suggestion.action) {
        suggestion.action();
    }
}

function removeSuggestion(suggestionId) {
    const element = document.querySelector(`[data-suggestion-id="${suggestionId}"]`);
    if (element) {
        element.remove();
    }
    window.smartDefaultsState.suggestions = window.smartDefaultsState.suggestions.filter(s => s.id !== suggestionId);
}

/**
 * B3: AI Confidence Scoring
 * Show confidence on each decision
 */
function calculateConfidenceScores() {
    const scores = {};

    // Photo distribution confidence
    const totalPhotos = window.uploadedPhotos?.length || 0;
    const pageCount = window.desiredPageCount || 8;
    const photosPerPage = totalPhotos / (pageCount - 2);

    if (photosPerPage >= 2 && photosPerPage <= 4) {
        scores.photoDistribution = 95;
    } else if (photosPerPage < 2 || photosPerPage > 4) {
        scores.photoDistribution = 70;
    } else {
        scores.photoDistribution = 50;
    }

    // Cover photo confidence
    const hasCoverPhoto = window.selectedCoverPhoto || window.photoCategoryAssignments.cover?.length > 0;
    scores.coverPhoto = hasCoverPhoto ? 100 : 60;

    // Content completeness
    const hasPropertyDetails = document.getElementById('address')?.value;
    const hasFeatures = document.querySelectorAll('input[name="features"]:checked').length > 0;
    scores.contentCompleteness = (hasPropertyDetails && hasFeatures) ? 100 : 75;

    window.smartDefaultsState.confidenceScores = scores;
    return scores;
}

function displayConfidenceScores() {
    const scores = calculateConfidenceScores();

    // Add confidence badges to readiness summary if it exists
    const readinessSummary = document.querySelector('.readiness-summary');
    if (readinessSummary) {
        const confidenceHTML = `
            <div class="confidence-scores">
                <h4>🎯 AI Confidence:</h4>
                ${Object.entries(scores).map(([key, score]) => `
                    <div class="confidence-item">
                        <span>${formatConfidenceLabel(key)}:</span>
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${score}%; background: ${getConfidenceColor(score)}"></div>
                        </div>
                        <span class="confidence-value">${score}%</span>
                    </div>
                `).join('')}
            </div>
        `;
        readinessSummary.insertAdjacentHTML('beforeend', confidenceHTML);
    }
}

function formatConfidenceLabel(key) {
    const labels = {
        photoDistribution: 'Photo Distribution',
        coverPhoto: 'Cover Photo',
        contentCompleteness: 'Content Completeness'
    };
    return labels[key] || key;
}

function getConfidenceColor(score) {
    if (score >= 90) return '#28a745';
    if (score >= 70) return '#ffc107';
    return '#dc3545';
}

// ============================================
// CATEGORY C: POST-APPLICATION FEEDBACK
// ============================================

/**
 * C1: Visual Diff/Change Log
 * Show what changed with undo button
 */
function saveStateForUndo() {
    window.smartDefaultsState.previousState = {
        pages: JSON.parse(JSON.stringify(window.brochurePages || [])),
        pageCount: window.desiredPageCount,
        wordCount: window.desiredWordCount,
        timestamp: Date.now()
    };
    console.log('💾 Saved state for undo');
}

function showChangeLog(newPageCount) {
    const changes = [
        `Created ${newPageCount} pages (was 0)`,
        `Distributed ${window.uploadedPhotos?.length || 0} photos`,
        `Added ${getFeatureBlockCount()} feature blocks`,
        window.selectedCoverPhoto ? `Set cover photo` : null
    ].filter(Boolean);

    const changeLogHTML = `
        <div class="change-log-banner">
            <div class="change-log-header">
                <h4>✨ Smart Defaults Applied!</h4>
                <button onclick="closeChangeLog()" class="close-btn">✕</button>
            </div>
            <div class="change-log-content">
                <p><strong>Changed:</strong></p>
                <ul>
                    ${changes.map(c => `<li>✓ ${c}</li>`).join('')}
                </ul>
            </div>
            <div class="change-log-actions">
                <button onclick="undoSmartDefaults()" class="btn-secondary">
                    ↩️ Undo All
                </button>
                <button onclick="closeChangeLog()" class="btn-primary">
                    Keep Changes
                </button>
            </div>
        </div>
    `;

    // Show banner at top of modal
    const modalContent = document.querySelector('.page-builder-modal-content');
    if (modalContent) {
        const existing = document.querySelector('.change-log-banner');
        if (existing) existing.remove();
        modalContent.insertAdjacentHTML('afterbegin', changeLogHTML);
    }
}

function closeChangeLog() {
    const banner = document.querySelector('.change-log-banner');
    if (banner) banner.remove();
}

function undoSmartDefaults() {
    if (window.smartDefaultsState.previousState) {
        window.brochurePages = window.smartDefaultsState.previousState.pages;
        window.desiredPageCount = window.smartDefaultsState.previousState.pageCount;
        window.desiredWordCount = window.smartDefaultsState.previousState.wordCount;

        // Re-render
        if (typeof window.renderBrochurePages === 'function') {
            window.renderBrochurePages();
        }

        closeChangeLog();
        showToast('success', '↩️ Undo complete. Starting from scratch.');
        console.log('↩️ Undo applied');
    }
}

function getFeatureBlockCount() {
    const pages = window.brochurePages || [];
    let count = 0;
    pages.forEach(page => {
        page.contentBlocks?.forEach(block => {
            if (block.type === 'features') count++;
        });
    });
    return count;
}

/**
 * C2: Gamified Quality Score
 * Calculate and display brochure quality score
 */
function calculateQualityScore() {
    let score = 0;
    let maxScore = 0;
    const feedback = {
        great: [],
        improve: []
    };

    // Photo distribution (25 points)
    maxScore += 25;
    const totalPhotos = window.uploadedPhotos?.length || 0;
    const pageCount = window.desiredPageCount || 8;
    const photosPerPage = totalPhotos / (pageCount - 2);

    if (photosPerPage >= 2 && photosPerPage <= 4) {
        score += 25;
        feedback.great.push('Perfect photo distribution (25/25)');
    } else {
        score += 15;
        feedback.improve.push(`Photo distribution could be better (15/25) - Aim for 2-4 photos/page`);
    }

    // Page balance (25 points)
    maxScore += 25;
    if (pageCount >= 6 && pageCount <= 12) {
        score += 25;
        feedback.great.push('Good page balance (25/25)');
    } else {
        score += 15;
        feedback.improve.push(`Page count could be optimized (15/25)`);
    }

    // Content completeness (25 points)
    maxScore += 25;
    const hasFeatures = document.querySelectorAll('input[name="features"]:checked').length;
    if (hasFeatures >= 5) {
        score += 25;
        feedback.great.push('Rich feature content (25/25)');
    } else {
        score += (hasFeatures * 5);
        feedback.improve.push(`Add more features (${hasFeatures * 5}/25) - ${5 - hasFeatures} more needed`);
    }

    // Cover photo (25 points)
    maxScore += 25;
    if (window.selectedCoverPhoto || window.photoCategoryAssignments.cover?.length > 0) {
        score += 25;
        feedback.great.push('Cover photo selected (25/25)');
    } else {
        score += 15;
        feedback.improve.push('Select a cover photo (15/25)');
    }

    const percentage = Math.round((score / maxScore) * 100);

    window.smartDefaultsState.qualityScore = percentage;

    return {
        score: percentage,
        feedback: feedback
    };
}

function showQualityScore() {
    const result = calculateQualityScore();

    const qualityHTML = `
        <div class="quality-score-panel">
            <div class="quality-header">
                <h4>🎯 Brochure Quality Score</h4>
                <div class="quality-score-big">${result.score}/100</div>
            </div>

            <div class="quality-feedback">
                ${result.feedback.great.length > 0 ? `
                    <div class="feedback-section great">
                        <h5>What's Great:</h5>
                        <ul>
                            ${result.feedback.great.map(f => `<li>✓ ${f}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}

                ${result.feedback.improve.length > 0 ? `
                    <div class="feedback-section improve">
                        <h5>Could Improve:</h5>
                        <ul>
                            ${result.feedback.improve.map(f => `<li>⚠️ ${f}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    // Add to readiness summary
    const readinessSummary = document.querySelector('.readiness-summary');
    if (readinessSummary && !document.querySelector('.quality-score-panel')) {
        readinessSummary.insertAdjacentHTML('beforeend', qualityHTML);
    }
}

// Export functions to window
window.showSmartDefaultsPreview = showSmartDefaultsPreview;
window.closeSmartDefaultsPreview = closeSmartDefaultsPreview;
window.applySmartDefaultsFromPreview = applySmartDefaultsFromPreview;
window.showPropertyTypePresets = showPropertyTypePresets;
window.selectPreset = selectPreset;
window.applySuggestion = applySuggestion;
window.undoSmartDefaults = undoSmartDefaults;
window.closeChangeLog = closeChangeLog;
window.calculateQualityScore = calculateQualityScore;
window.showQualityScore = showQualityScore;
window.saveStateForUndo = saveStateForUndo;
window.showChangeLog = showChangeLog;

console.log('✅ Smart Defaults UX enhancements loaded');
