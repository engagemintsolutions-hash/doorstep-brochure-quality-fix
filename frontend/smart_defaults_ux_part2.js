/**
 * Smart Defaults UX Enhancement System - Part 2
 * Remaining advanced features
 */

// ============================================
// CATEGORY D: CONTINUOUS LEARNING
// ============================================

/**
 * D1: Learn User Preferences
 * Track and apply user patterns
 */
function initializeLearningSystem() {
    // Load existing preferences from localStorage
    const stored = localStorage.getItem('userSmartDefaultsPreferences');
    if (stored) {
        window.smartDefaultsState.userPreferences = JSON.parse(stored);
        console.log('📚 Loaded user preferences:', window.smartDefaultsState.userPreferences);
    } else {
        window.smartDefaultsState.userPreferences = {
            avgPageCountByProperty: {},
            commonPhotoMoves: [],
            preferredFeatures: [],
            learnEnabled: true
        };
    }
}

function trackUserEdit(editType, details) {
    if (!window.smartDefaultsState.userPreferences.learnEnabled) return;

    const edit = {
        type: editType,
        details: details,
        timestamp: Date.now(),
        propertyType: document.getElementById('propertyType')?.value || 'unknown',
        bedrooms: document.getElementById('bedrooms')?.value || 'unknown'
    };

    window.smartDefaultsState.editTracking.edits.push(edit);
    console.log('📝 Tracked edit:', edit);
}

function analyzeUserPatterns() {
    const edits = window.smartDefaultsState.editTracking.edits;
    if (edits.length < 5) return null;

    // Analyze page count preferences
    const pageCountEdits = edits.filter(e => e.type === 'page_count_changed');
    if (pageCountEdits.length > 0) {
        const avgAdjustment = pageCountEdits.reduce((sum, e) =>
            sum + (e.details.newCount - e.details.originalCount), 0) / pageCountEdits.length;

        if (Math.abs(avgAdjustment) > 0.5) {
            return {
                type: 'page_count_preference',
                message: `You typically ${avgAdjustment > 0 ? 'add' : 'remove'} ${Math.abs(Math.round(avgAdjustment))} pages`,
                adjustment: avgAdjustment
            };
        }
    }

    return null;
}

function saveUserPreferences() {
    const pattern = analyzeUserPatterns();
    if (pattern) {
        // Update preferences
        const key = `${document.getElementById('propertyType')?.value || 'unknown'}_${document.getElementById('bedrooms')?.value || 'unknown'}bed`;
        window.smartDefaultsState.userPreferences.avgPageCountByProperty[key] = pattern.adjustment;

        // Save to localStorage
        localStorage.setItem('userSmartDefaultsPreferences',
            JSON.stringify(window.smartDefaultsState.userPreferences));

        // Show learning notification
        showLearningNotification(pattern);
    }
}

function showLearningNotification(pattern) {
    const notification = `
        <div class="learning-notification">
            <div class="learning-icon">🧠</div>
            <div class="learning-content">
                <h4>Learning from your edits...</h4>
                <p>${pattern.message}</p>
                <p style="font-size: 0.85rem; margin-top: 0.5rem;">Next time we'll apply these preferences automatically.</p>
            </div>
            <div class="learning-actions">
                <button onclick="disableLearning()" class="btn-small">No thanks</button>
                <button onclick="closeLearningNotification()" class="btn-small btn-primary">Got it</button>
            </div>
        </div>
    `;

    const container = document.createElement('div');
    container.className = 'learning-notification-container';
    container.innerHTML = notification;
    document.body.appendChild(container);

    // Auto-dismiss after 10 seconds
    setTimeout(() => closeLearningNotification(), 10000);
}

function closeLearningNotification() {
    const notification = document.querySelector('.learning-notification-container');
    if (notification) notification.remove();
}

function disableLearning() {
    window.smartDefaultsState.userPreferences.learnEnabled = false;
    localStorage.setItem('userSmartDefaultsPreferences',
        JSON.stringify(window.smartDefaultsState.userPreferences));
    closeLearningNotification();
    showToast('info', 'Learning disabled. You can re-enable it in settings.');
}

/**
 * D2: Template Library
 * Save and load custom layouts
 */
function loadTemplates() {
    const stored = localStorage.getItem('brochureTemplates');
    if (stored) {
        window.smartDefaultsState.templates = JSON.parse(stored);
    } else {
        window.smartDefaultsState.templates = [];
    }
    return window.smartDefaultsState.templates;
}

function saveAsTemplate() {
    const templateName = prompt('Enter template name:', `Layout ${window.smartDefaultsState.templates.length + 1}`);
    if (!templateName) return;

    const template = {
        id: Date.now().toString(),
        name: templateName,
        pageCount: window.desiredPageCount || 8,
        wordCount: window.desiredWordCount || 1200,
        pages: JSON.parse(JSON.stringify(window.brochurePages)),
        preset: window.smartDefaultsState.currentPreset,
        usageCount: 0,
        createdAt: Date.now()
    };

    window.smartDefaultsState.templates.push(template);
    localStorage.setItem('brochureTemplates', JSON.stringify(window.smartDefaultsState.templates));

    showToast('success', `✓ Template "${templateName}" saved`);
    renderTemplateLibrary();
}

function applyTemplate(templateId) {
    const template = window.smartDefaultsState.templates.find(t => t.id === templateId);
    if (!template) return;

    // Apply template
    window.brochurePages = JSON.parse(JSON.stringify(template.pages));
    window.desiredPageCount = template.pageCount;
    window.desiredWordCount = template.wordCount;

    // Update sliders
    document.getElementById('pageCountSlider').value = template.pageCount;
    document.getElementById('wordCountSlider').value = template.wordCount;
    window.updatePageCount(template.pageCount);
    window.updateWordCount(template.wordCount);

    // Re-render
    if (typeof window.renderBrochurePages === 'function') {
        window.renderBrochurePages();
    }

    // Update usage count
    template.usageCount++;
    localStorage.setItem('brochureTemplates', JSON.stringify(window.smartDefaultsState.templates));

    showToast('success', `✓ Applied template "${template.name}"`);
    closeTemplateLibrary();
}

function deleteTemplate(templateId) {
    if (!confirm('Delete this template?')) return;

    window.smartDefaultsState.templates = window.smartDefaultsState.templates.filter(t => t.id !== templateId);
    localStorage.setItem('brochureTemplates', JSON.stringify(window.smartDefaultsState.templates));

    showToast('success', 'Template deleted');
    renderTemplateLibrary();
}

function renderTemplateLibrary() {
    const templates = loadTemplates();

    const libraryHTML = `
        <div class="template-library-modal">
            <div class="template-library-header">
                <h3>📚 Your Saved Layouts</h3>
                <button onclick="closeTemplateLibrary()" class="close-btn">✕</button>
            </div>

            <div class="template-library-content">
                ${templates.length === 0 ? `
                    <div class="template-empty-state">
                        <p>No saved templates yet.</p>
                        <p style="font-size: 0.9rem; color: #6c757d;">Create your first template by clicking "Save as Template" after customizing your brochure.</p>
                    </div>
                ` : templates.map(t => `
                    <div class="template-card">
                        <div class="template-info">
                            <h4>${t.name}</h4>
                            <div class="template-stats">
                                <span>${t.pageCount} pages</span>
                                <span>${t.wordCount} words</span>
                                <span>${t.preset || 'balanced'} style</span>
                            </div>
                            <div class="template-meta">
                                Used ${t.usageCount} times • Created ${new Date(t.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        <div class="template-actions">
                            <button onclick="applyTemplate('${t.id}')" class="btn-primary">
                                Use Template
                            </button>
                            <button onclick="deleteTemplate('${t.id}')" class="btn-danger-small">
                                Delete
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="template-library-footer">
                <button onclick="closeTemplateLibrary()" class="btn-secondary">
                    Close
                </button>
            </div>
        </div>
    `;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'templateLibraryOverlay';
    overlay.className = 'template-library-overlay';
    overlay.innerHTML = libraryHTML;

    document.body.appendChild(overlay);
}

function closeTemplateLibrary() {
    const overlay = document.getElementById('templateLibraryOverlay');
    if (overlay) overlay.remove();
}

// ============================================
// CATEGORY E: SLIDER INTEGRATION
// ============================================

/**
 * E1: Live Preview as Sliders Change
 */
function enableLiveSliderPreview() {
    const pageCountSlider = document.getElementById('pageCountSlider');
    const wordCountSlider = document.getElementById('wordCountSlider');

    if (pageCountSlider && !pageCountSlider.dataset.livePreviewEnabled) {
        pageCountSlider.addEventListener('input', (e) => {
            showSliderPreview('pageCount', e.target.value);
        });
        pageCountSlider.dataset.livePreviewEnabled = 'true';
    }

    if (wordCountSlider && !wordCountSlider.dataset.livePreviewEnabled) {
        wordCountSlider.addEventListener('input', (e) => {
            showSliderPreview('wordCount', e.target.value);
        });
        wordCountSlider.dataset.livePreviewEnabled = 'true';
    }
}

function showSliderPreview(sliderType, value) {
    const totalPhotos = window.uploadedPhotos?.length || 0;

    let previewText = '';

    if (sliderType === 'pageCount') {
        const photosPerPage = totalPhotos / (value - 2);
        const status = photosPerPage >= 2 && photosPerPage <= 4 ? '✓ Balanced' :
                      photosPerPage < 2 ? '→ More spacious' : '→ More compact';

        previewText = `
            <div class="slider-preview-popup">
                <strong>With ${value} pages:</strong>
                <p>${photosPerPage.toFixed(1)} photos per page ${status}</p>
            </div>
        `;
    } else if (sliderType === 'wordCount') {
        const pageCount = document.getElementById('pageCountSlider').value;
        const wordsPerPage = Math.floor((value - 100) / (pageCount - 2));

        previewText = `
            <div class="slider-preview-popup">
                <strong>${value} words total:</strong>
                <p>~${wordsPerPage} words per page</p>
            </div>
        `;
    }

    // Show preview popup
    let popup = document.querySelector('.slider-preview-popup');
    if (popup) popup.remove();

    const slider = document.getElementById(sliderType + 'Slider');
    slider.insertAdjacentHTML('afterend', previewText);

    // Auto-remove after 2 seconds
    setTimeout(() => {
        popup = document.querySelector('.slider-preview-popup');
        if (popup) popup.remove();
    }, 2000);
}

/**
 * E2: Slider Recommendations (Visual Optimal Zones)
 */
function addSliderRecommendations() {
    const pageCountSlider = document.getElementById('pageCountSlider');
    const totalPhotos = window.uploadedPhotos?.length || 0;

    if (!pageCountSlider || totalPhotos === 0) return;

    // Calculate optimal range
    const optimal = calculateOptimalPages(totalPhotos);
    const minOptimal = Math.max(4, optimal - 2);
    const maxOptimal = Math.min(16, optimal + 2);

    // Add visual zones
    const sliderContainer = pageCountSlider.parentElement;
    if (!sliderContainer.querySelector('.slider-zones')) {
        const zonesHTML = `
            <div class="slider-zones">
                <div class="zone-indicator" style="left: ${(minOptimal - 4) / 12 * 100}%; width: ${(maxOptimal - minOptimal) / 12 * 100}%">
                    <span class="zone-label">Optimal (${minOptimal}-${maxOptimal} pages)</span>
                </div>
            </div>
        `;
        sliderContainer.insertAdjacentHTML('beforeend', zonesHTML);
    }
}

// ============================================
// CATEGORY F: ERROR PREVENTION
// ============================================

/**
 * F1: Pre-Flight Checklist
 */
function showPreFlightChecklist() {
    const checks = performPreFlightChecks();

    const checklistHTML = `
        <div class="preflight-checklist">
            <h4>✅ Pre-Smart Defaults Checklist:</h4>

            <div class="checklist-items">
                ${checks.map(check => `
                    <div class="checklist-item ${check.status}">
                        <span class="check-icon">${check.icon}</span>
                        <div class="check-content">
                            <strong>${check.title}</strong>
                            ${check.note ? `<p>${check.note}</p>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>

            ${checks.some(c => c.status === 'warning') ? `
                <div class="preflight-warning">
                    <p>⚠️ Some items have warnings. Smart Defaults can still proceed, but results may vary.</p>
                </div>
            ` : ''}

            <div class="preflight-actions">
                <button onclick="closePreflight()" class="btn-secondary">Cancel</button>
                <button onclick="proceedWithSmartDefaults()" class="btn-primary">
                    Proceed with Smart Defaults →
                </button>
            </div>
        </div>
    `;

    // Show as modal overlay
    const overlay = document.createElement('div');
    overlay.id = 'preflightOverlay';
    overlay.className = 'preflight-overlay';
    overlay.innerHTML = checklistHTML;

    document.body.appendChild(overlay);
}

function performPreFlightChecks() {
    const checks = [];

    // Check 1: Photos uploaded
    const totalPhotos = window.uploadedPhotos?.length || 0;
    checks.push({
        icon: totalPhotos >= 5 ? '✓' : '✗',
        status: totalPhotos >= 5 ? 'success' : 'error',
        title: `${totalPhotos} photos uploaded`,
        note: totalPhotos < 5 ? 'Minimum 5 photos required' : null
    });

    // Check 2: Photos categorized
    const categorized = Object.values(window.photoCategoryAssignments || {}).flat().length > 0;
    checks.push({
        icon: categorized ? '✓' : '⚠️',
        status: categorized ? 'success' : 'warning',
        title: 'Photos categorized',
        note: !categorized ? 'Photos will be auto-categorized' : null
    });

    // Check 3: Property details
    const hasDetails = document.getElementById('address')?.value;
    checks.push({
        icon: hasDetails ? '✓' : '⚠️',
        status: hasDetails ? 'success' : 'warning',
        title: 'Property details filled',
        note: !hasDetails ? 'Some details may be missing' : null
    });

    // Check 4: Cover photo
    const hasCover = window.selectedCoverPhoto || window.photoCategoryAssignments.cover?.length > 0;
    checks.push({
        icon: hasCover ? '✓' : '⚠️',
        status: hasCover ? 'success' : 'warning',
        title: 'Cover photo selected',
        note: !hasCover ? 'We\'ll auto-select best one' : null
    });

    // Check 5: Floorplan
    const hasFloorplan = window.floorplanFile;
    checks.push({
        icon: hasFloorplan ? '✓' : '⚠️',
        status: hasFloorplan ? 'success' : 'warning',
        title: 'Floorplan uploaded',
        note: !hasFloorplan ? 'Brochure will skip floorplan page' : null
    });

    return checks;
}

function closePreflight() {
    const overlay = document.getElementById('preflightOverlay');
    if (overlay) overlay.remove();
}

function proceedWithSmartDefaults() {
    closePreflight();
    window.useSmartDefaults();
}

/**
 * F2: Conflict Resolution
 */
function detectConflicts() {
    const conflicts = [];
    const totalPhotos = window.uploadedPhotos?.length || 0;
    const pageCount = window.desiredPageCount || 8;
    const photosPerPage = totalPhotos / (pageCount - 2);

    // Conflict 1: Too many photos for page count
    if (photosPerPage > 5) {
        const recommended = Math.ceil(totalPhotos / 3) + 2;
        conflicts.push({
            type: 'photo_overflow',
            severity: 'high',
            title: 'Too many photos for current page count',
            description: `Your ${totalPhotos} photos won't fit well in ${pageCount} pages.`,
            options: [
                {
                    label: `Increase to ${recommended} pages`,
                    action: () => {
                        document.getElementById('pageCountSlider').value = recommended;
                        window.updatePageCount(recommended);
                        resolveConflict('photo_overflow');
                    }
                },
                {
                    label: 'Select fewer photos',
                    action: () => {
                        showToast('info', 'Please remove some photos from your selection');
                        resolveConflict('photo_overflow');
                    }
                },
                {
                    label: 'Proceed anyway',
                    action: () => resolveConflict('photo_overflow')
                }
            ]
        });
    }

    // Conflict 2: Too few words for page count
    const wordCount = window.desiredWordCount || 1200;
    const wordsPerPage = (wordCount - 100) / (pageCount - 2);
    if (wordsPerPage < 100) {
        conflicts.push({
            type: 'word_shortage',
            severity: 'medium',
            title: 'Word count may be too low',
            description: `With ${wordCount} words across ${pageCount} pages, each page will have only ~${Math.round(wordsPerPage)} words.`,
            options: [
                {
                    label: 'Increase word count',
                    action: () => {
                        document.getElementById('wordCountSlider').value = 1500;
                        window.updateWordCount(1500);
                        resolveConflict('word_shortage');
                    }
                },
                {
                    label: 'Reduce page count',
                    action: () => {
                        const newPageCount = Math.max(4, pageCount - 2);
                        document.getElementById('pageCountSlider').value = newPageCount;
                        window.updatePageCount(newPageCount);
                        resolveConflict('word_shortage');
                    }
                },
                {
                    label: 'Keep as is',
                    action: () => resolveConflict('word_shortage')
                }
            ]
        });
    }

    return conflicts;
}

function showConflictResolution() {
    const conflicts = detectConflicts();

    if (conflicts.length === 0) {
        // No conflicts, proceed
        window.useSmartDefaults();
        return;
    }

    const conflictHTML = `
        <div class="conflict-resolution-modal">
            <div class="conflict-header">
                <h3>⚠️ Issues Detected</h3>
                <p>Please resolve these issues before proceeding:</p>
            </div>

            <div class="conflict-list">
                ${conflicts.map(conflict => `
                    <div class="conflict-item ${conflict.severity}" data-conflict-type="${conflict.type}">
                        <h4>${conflict.title}</h4>
                        <p>${conflict.description}</p>

                        <div class="conflict-options">
                            ${conflict.options.map((opt, i) => `
                                <button onclick="handleConflictOption('${conflict.type}', ${i})" class="conflict-option-btn">
                                    ${opt.label}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    const overlay = document.createElement('div');
    overlay.id = 'conflictOverlay';
    overlay.className = 'conflict-overlay';
    overlay.innerHTML = conflictHTML;

    document.body.appendChild(overlay);

    // Store conflict options for later
    window.conflictOptions = conflicts;
}

function handleConflictOption(conflictType, optionIndex) {
    const conflict = window.conflictOptions.find(c => c.type === conflictType);
    if (conflict && conflict.options[optionIndex]) {
        conflict.options[optionIndex].action();
    }
}

function resolveConflict(conflictType) {
    const conflictItem = document.querySelector(`[data-conflict-type="${conflictType}"]`);
    if (conflictItem) {
        conflictItem.style.opacity = '0.5';
        conflictItem.style.pointerEvents = 'none';
    }

    // Check if all resolved
    const remaining = document.querySelectorAll('.conflict-item:not([style*="opacity: 0.5"])');
    if (remaining.length === 0) {
        closeConflictResolution();
    }
}

function closeConflictResolution() {
    const overlay = document.getElementById('conflictOverlay');
    if (overlay) overlay.remove();
}

// ============================================
// INITIALIZATION & EXPORT
// ============================================

// Export functions to window
window.initializeLearningSystem = initializeLearningSystem;
window.trackUserEdit = trackUserEdit;
window.saveUserPreferences = saveUserPreferences;
window.disableLearning = disableLearning;
window.closeLearningNotification = closeLearningNotification;
window.saveAsTemplate = saveAsTemplate;
window.applyTemplate = applyTemplate;
window.deleteTemplate = deleteTemplate;
window.renderTemplateLibrary = renderTemplateLibrary;
window.closeTemplateLibrary = closeTemplateLibrary;
window.enableLiveSliderPreview = enableLiveSliderPreview;
window.addSliderRecommendations = addSliderRecommendations;
window.showPreFlightChecklist = showPreFlightChecklist;
window.closePreflight = closePreflight;
window.proceedWithSmartDefaults = proceedWithSmartDefaults;
window.showConflictResolution = showConflictResolution;
window.closeConflictResolution = closeConflictResolution;
window.handleConflictOption = handleConflictOption;

console.log('✅ Smart Defaults UX enhancements Part 2 loaded');
