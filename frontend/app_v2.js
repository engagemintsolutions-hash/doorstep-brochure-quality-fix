// V2 Improvements - Additional JavaScript
console.log('🚀 V2 JavaScript loaded - Wizard mode active');

// ============================================
// Photo Category Assignments - Must be at top level
// ============================================

// New category-based structure - allows multiple photos per category
const photoCategoryAssignments = {
    cover: [],      // 1 required
    exterior: [],   // 3+ recommended
    interior: [],   // 3+ recommended
    kitchen: [],    // 2+ recommended
    reception: [],  // 2+ recommended (living rooms, drawing rooms)
    bedrooms: [],   // 3+ recommended
    bathrooms: [],  // 2+ recommended
    garden: []      // 3+ recommended
};
// Expose to window so page_builder.js can access it
window.photoCategoryAssignments = photoCategoryAssignments;


// ============================================
// Photo Category Assignments - Must be at top level
// ============================================

// photoCategoryAssignments moved to top of file to avoid initialization errors


// ============================================
// Time Tracking System
// ============================================

let sessionStartTime = null;
let creditBalance = 100; // Mock credit system (100 credits = 100 API calls)

function initializeTimeTracking() {
    // Check if there's an existing session
    const existing = localStorage.getItem('brochure_session_start');
    if (!existing) {
        sessionStartTime = Date.now();
        localStorage.setItem('brochure_session_start', sessionStartTime.toString());
        console.log('⏱️ Session timer started');
    } else {
        sessionStartTime = parseInt(existing);
        console.log('⏱️ Session timer restored');
    }

    // Load credit balance from mock storage
    const savedCredits = localStorage.getItem('user_credit_balance');
    if (savedCredits) {
        creditBalance = parseInt(savedCredits);
    }

    // Display credit balance in header
    updateCreditDisplay();
}

function getElapsedTime() {
    if (!sessionStartTime) return 0;
    return Math.floor((Date.now() - sessionStartTime) / 1000); // seconds
}

function formatElapsedTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
}

function deductCredits(amount, reason) {
    creditBalance -= amount;
    localStorage.setItem('user_credit_balance', creditBalance.toString());
    updateCreditDisplay();
    console.log(`💰 Deducted ${amount} credits for: ${reason}. Balance: ${creditBalance}`);

    if (creditBalance < 10) {
        showToast('warning', `Low credit balance: ${creditBalance} credits remaining`);
    }
}

function updateCreditDisplay() {
    const creditEl = document.getElementById('creditBalance');
    if (creditEl) {
        creditEl.textContent = `${creditBalance} credits`;
        creditEl.style.color = creditBalance < 20 ? '#e74c3c' : creditBalance < 50 ? '#f39c12' : '#27ae60';
    }
}

// ============================================
// PROBLEM 9: Wizard-Style Mode Selection
// ============================================

// Pre-populate agent details for logged-in user
async function prePopulateAgentDetails() {
    try {
        const userEmail = localStorage.getItem('userEmail');
        console.log('🔍 Checking user data for pre-population:', userEmail);

        // Check if this is James Smith from Savills
        if (userEmail === 'james.smith@savills.com') {
            console.log('📋 Pre-populating James Smith agent details...');

            // Agent details
            const agentNameField = document.getElementById('agentName');
            const agentPhoneField = document.getElementById('agentPhone');
            const agentEmailField = document.getElementById('agentEmail');

            console.log('🔍 Agent fields found:', {
                name: !!agentNameField,
                phone: !!agentPhoneField,
                email: !!agentEmailField
            });

            if (agentNameField && !agentNameField.value) {
                agentNameField.value = 'James Smith';
                localStorage.setItem('userName', 'James Smith');
                console.log('✅ Set agent name');
            }
            if (agentPhoneField && !agentPhoneField.value) {
                agentPhoneField.value = '+44 7700 900123';
                localStorage.setItem('userPhone', '+44 7700 900123');
                console.log('✅ Set agent phone');
            }
            if (agentEmailField && !agentEmailField.value) {
                agentEmailField.value = 'james.smith@savills.com';
                localStorage.setItem('userEmail', 'james.smith@savills.com');
                console.log('✅ Set agent email');
            }

            // Office details
            const officePhoneField = document.getElementById('officePhone');
            const officeEmailField = document.getElementById('officeEmail');

            console.log('🔍 Office fields found:', {
                phone: !!officePhoneField,
                email: !!officeEmailField
            });

            if (officePhoneField && !officePhoneField.value) {
                officePhoneField.value = '+44 20 7499 8644';
                console.log('✅ Set office phone');
            }
            if (officeEmailField && !officeEmailField.value) {
                officeEmailField.value = 'london@savills.com';
                console.log('✅ Set office email');
            }

            // Pre-load agent headshot
            console.log('📸 Attempting to load agent headshot...');
            try {
                const headshotResponse = await fetch('/uploads/agent_assets/james_smith_headshot.png');
                console.log('📸 Headshot fetch response:', headshotResponse.status);

                if (headshotResponse.ok) {
                    const blob = await headshotResponse.blob();
                    console.log('📸 Headshot blob size:', blob.size);

                    const file = new File([blob], 'james_smith_headshot.png', { type: blob.type });

                    // Set the global agent photo file
                    window.agentPhotoFile = file;
                    console.log('✅ Set window.agentPhotoFile');

                    // Show preview
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const preview = document.getElementById('agentPhotoPreview');
                        if (preview) {
                            preview.innerHTML = `
                                <img src="${e.target.result}" style="max-width: 200px; max-height: 200px; border-radius: 50%; object-fit: cover;">
                                <button onclick="removeAgentPhoto()" style="margin-top: 0.5rem; background: #2C5F7C; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Remove</button>
                            `;
                            preview.style.display = 'block';
                            console.log('✅ Preview HTML set and displayed');
                        } else {
                            console.log('❌ Preview element not found');
                        }

                        // Hide upload prompt
                        const prompt = document.getElementById('agentPhotoPrompt');
                        if (prompt) {
                            prompt.style.display = 'none';
                            console.log('✅ Upload prompt hidden');
                        }
                    };
                    reader.readAsDataURL(blob);

                    console.log('✅ Agent headshot pre-loaded successfully');
                } else {
                    console.log('❌ Headshot fetch failed with status:', headshotResponse.status);
                }
            } catch (error) {
                console.log('❌ Agent headshot error:', error);
            }

            console.log('✅ Agent details pre-population complete');
        } else {
            console.log('ℹ️ Not James Smith, skipping pre-population');
        }
    } catch (error) {
        console.error('❌ Pre-population error:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize time tracking
    initializeTimeTracking();

    // Auto-start brochure mode (no wizard)
    window.currentMode = 'brochure';
    sessionStorage.setItem('selectedMode', 'brochure');
    console.log('✅ Auto-started in brochure mode');

    const modeWizard = document.getElementById('modeWizard');
    const generateForm = document.getElementById('generateForm');
    const backToWizardBtn = document.getElementById('backToWizard');

    // Always hide wizard if it exists
    if (modeWizard) {
        modeWizard.style.display = 'none';
    }

    // Restore mode from sessionStorage if available
    const savedMode = sessionStorage.getItem('selectedMode');
    if (savedMode) {
        window.currentMode = savedMode;
        console.log('✅ Mode restored from session:', savedMode);

        // If mode exists, restore the form view (don't go back to wizard)
        if (generateForm && modeWizard) {
            modeWizard.style.display = 'none';
            generateForm.style.display = 'block';
            console.log('✅ Form restored (mode:', savedMode, ')');

            // Show completion tracker
            const completionTracker = document.getElementById('completionTracker');
            if (completionTracker) {
                completionTracker.style.display = 'block';
                updateCompletionTracker();
            }

            // Restore mode-specific UI
            if (savedMode === 'brochure') {
                document.getElementById('photoRequiredIndicator').style.display = 'inline';
                document.getElementById('photoRequirementBadge').style.display = 'inline';
                document.getElementById('portalPhotoHelp').style.display = 'none';
                document.getElementById('brochurePhotoHelp').style.display = 'block';
                // customBrochureGroup removed - now using exampleBrochureSection
                document.getElementById('generateBtn').textContent = '📖 Generate Brochure';

                // Show example brochure section
                const exampleBrochureSection = document.getElementById('exampleBrochureSection');
                if (exampleBrochureSection) exampleBrochureSection.style.display = 'block';

                // Photo assignment section removed - auto-categorization now populates page builder directly
                // Keep page index reference visible for page builder
                if (uploadedPhotos.length > 0) {
                    const pageIndexRef = document.getElementById('pageIndexReference');
                    if (pageIndexRef) pageIndexRef.style.display = 'block';
                }
            } else {
                document.getElementById('photoRequiredIndicator').style.display = 'none';
                document.getElementById('photoRequirementBadge').style.display = 'none';
                document.getElementById('portalPhotoHelp').style.display = 'block';
                document.getElementById('brochurePhotoHelp').style.display = 'none';
                // customBrochureGroup removed - now using exampleBrochureSection
                document.getElementById('generateBtn').textContent = '✨ Generate Listing';
            }
        }
    }

    // Initialize brochure mode UI on page load
    if (window.currentMode === 'brochure') {
        const photoRequiredIndicator = document.getElementById('photoRequiredIndicator');
        const photoRequirementBadge = document.getElementById('photoRequirementBadge');
        const portalPhotoHelp = document.getElementById('portalPhotoHelp');
        const brochurePhotoHelp = document.getElementById('brochurePhotoHelp');
        const generateBtn = document.getElementById('generateBtn');

        if (photoRequiredIndicator) photoRequiredIndicator.style.display = 'inline';
        if (photoRequirementBadge) photoRequirementBadge.style.display = 'inline';
        if (portalPhotoHelp) portalPhotoHelp.style.display = 'none';
        if (brochurePhotoHelp) brochurePhotoHelp.style.display = 'block';
        if (generateBtn) generateBtn.textContent = '📖 Generate Brochure';

        // Show example brochure section
        const exampleBrochureSection = document.getElementById('exampleBrochureSection');
        if (exampleBrochureSection) {
            exampleBrochureSection.style.display = 'block';
            console.log('✅ Example brochure section shown on page load');
        }

        // Show completion tracker
        const completionTracker = document.getElementById('completionTracker');
        if (completionTracker) {
            completionTracker.style.display = 'block';
            updateCompletionTracker();
        }
    }

    // Check if resuming draft
    checkForDraft();

    // Pre-populate agent details for logged-in user (wait for DOM to be fully ready)
    setTimeout(() => {
        prePopulateAgentDetails();
    }, 1000);

    // Load photographer uploads for this agent (with small delay to ensure DOM and auth are ready)
    setTimeout(() => {
        console.log('🔄 Attempting to load photographer uploads...');
        loadPhotographerUploads();
    }, 500);

    // CRITICAL: Force photo assignment to show if conditions are met
    // This runs after page load to catch any race conditions
    setTimeout(() => {
        const currentMode = window.currentMode || sessionStorage.getItem('selectedMode');
        if (currentMode === 'brochure' && uploadedPhotos.length > 0) {
            const assignmentSection = document.getElementById('photoAssignmentSection');
            const pageIndexRef = document.getElementById('pageIndexReference');

            if (assignmentSection && assignmentSection.style.display === 'none') {
                assignmentSection.style.display = 'block';
                console.log('🔧 FORCE: Photo assignment shown (mode:', currentMode, ', photos:', uploadedPhotos.length, ')');
            }

            if (pageIndexRef && pageIndexRef.style.display === 'none') {
                pageIndexRef.style.display = 'block';
                console.log('🔧 FORCE: Page index shown');
            }
        }
    }, 500);

    // Wizard card selection
    document.querySelectorAll('.wizard-card').forEach(card => {
        card.addEventListener('click', () => {
            const mode = card.dataset.mode;
            startMode(mode);
        });

        card.querySelector('.btn-wizard').addEventListener('click', (e) => {
            e.stopPropagation();
            const mode = card.parentElement.dataset.mode;
            startMode(mode);
        });
    });

    // Back to wizard button
    if (backToWizardBtn) {
        backToWizardBtn.addEventListener('click', () => {
            // Clear mode from session so wizard shows on refresh
            sessionStorage.removeItem('selectedMode');
            window.currentMode = null;

            generateForm.style.display = 'none';
            modeWizard.style.display = 'block';
            window.scrollTo(0, 0);

            console.log('✅ Returned to wizard, session cleared');
        });
    }

    function startMode(mode) {
        modeWizard.style.display = 'none';
        generateForm.style.display = 'block';

        // Show completion tracker
        const completionTracker = document.getElementById('completionTracker');
        if (completionTracker) {
            completionTracker.style.display = 'block';
            // Initialize at 15% for viewing the guide
            updateCompletionTracker();
        }

        window.scrollTo(0, 0);

        // Store mode globally
        window.currentMode = mode;

        // Update mode-specific UI
        if (mode === 'brochure') {
            document.getElementById('photoRequiredIndicator').style.display = 'inline';
            document.getElementById('photoRequirementBadge').style.display = 'inline';
            document.getElementById('portalPhotoHelp').style.display = 'none';
            document.getElementById('brochurePhotoHelp').style.display = 'block';
            // customBrochureGroup removed - now using exampleBrochureSection
            document.getElementById('generateBtn').textContent = '📖 Generate Brochure';

            // Show example brochure section for brochure mode
            const exampleBrochureSection = document.getElementById('exampleBrochureSection');
            console.log('🔍 Looking for exampleBrochureSection:', exampleBrochureSection);
            if (exampleBrochureSection) {
                exampleBrochureSection.style.display = 'block';
                console.log('✅ Set exampleBrochureSection to display: block');
            } else {
                console.error('❌ exampleBrochureSection NOT FOUND!');
            }

            // If photos already uploaded, show photo assignment immediately
            if (uploadedPhotos.length > 0) {
                const assignmentSection = document.getElementById('photoAssignmentSection');
                if (assignmentSection) {
                    assignmentSection.style.display = 'block';
                    console.log('✅ Photo assignment shown on brochure mode start (', uploadedPhotos.length, 'photos)');
                }

                const pageIndexRef = document.getElementById('pageIndexReference');
                if (pageIndexRef) {
                    pageIndexRef.style.display = 'block';
                }
            }
        } else {
            document.getElementById('photoRequiredIndicator').style.display = 'none';
            document.getElementById('photoRequirementBadge').style.display = 'none';
            document.getElementById('portalPhotoHelp').style.display = 'block';
            document.getElementById('brochurePhotoHelp').style.display = 'none';
            // customBrochureGroup removed - now using exampleBrochureSection
            document.getElementById('generateBtn').textContent = '✨ Generate Listing';

            // Hide example brochure section for portal mode
            const exampleBrochureSection = document.getElementById('exampleBrochureSection');
            if (exampleBrochureSection) {
                exampleBrochureSection.style.display = 'none';
            }
        }

        // Store mode
        sessionStorage.setItem('selectedMode', mode);

        // Show toast
        showToast('success', `${mode === 'brochure' ? 'Brochure' : 'Portal Listing'} mode activated`);
    }
});

// ============================================
// COMPLETION PERCENTAGE CALCULATION
// ============================================

function calculateCompletionPercentage() {
    let percentage = 0;
    const tasks = [];

    // Task-based completion (each task is worth a fixed %)
    // Only give credit when task is FULLY complete

    // TASK 1: Upload 1+ photos (20%)
    if (uploadedPhotos && uploadedPhotos.length >= 1) {
        percentage += 20;
        tasks.push('photos');
    }

    // TASK 2: Select bedrooms (20%)
    const bedroomsEl = document.getElementById('bedrooms');
    if (bedroomsEl && bedroomsEl.value && bedroomsEl.value !== '' && bedroomsEl.value !== '0') {
        percentage += 20;
        tasks.push('bedrooms');
    }

    // TASK 3: Select bathrooms (20%)
    const bathroomsEl = document.getElementById('bathrooms');
    if (bathroomsEl && bathroomsEl.value && bathroomsEl.value !== '' && bathroomsEl.value !== '0') {
        percentage += 20;
        tasks.push('bathrooms');
    }

    // TASK 4: Enter location (address AND postcode) (20%)
    const addressEl = document.getElementById('address');
    const postcodeEl = document.getElementById('postcode');
    const hasAddress = addressEl && addressEl.value && addressEl.value.trim() !== '';
    const hasPostcode = postcodeEl && postcodeEl.value && postcodeEl.value.trim() !== '';

    if (hasAddress && hasPostcode) {
        percentage += 20;
        tasks.push('location');
    }

    // TASK 5: Select 5+ features (20%)
    const checkedFeatures = document.querySelectorAll('input[name="features"]:checked');
    if (checkedFeatures.length >= 5) {
        percentage += 20;
        tasks.push('features');
    }

    console.log('📊 Total: ' + percentage + '% - Tasks: [' + tasks.join(', ') + ']');
    return percentage;
}

// Function to manually update progress (called when form changes)
function manuallyUpdateProgress() {
    if (typeof calculateCompletionPercentage === 'function' && typeof updateLogoProgress === 'function') {
        const percentage = calculateCompletionPercentage();
        updateLogoProgress(percentage);
    }
}

// ============================================
// PROBLEM 1: Progressive Disclosure
// ============================================

const advancedToggle = document.getElementById('advancedToggle');
if (advancedToggle) {
    advancedToggle.addEventListener('click', () => {
        const content = document.getElementById('advancedContent');
        const icon = document.querySelector('.toggle-icon');

        if (content.style.display === 'none') {
            content.style.display = 'block';
            icon.classList.add('expanded');
            showToast('info', 'Advanced options expanded');
        } else {
            content.style.display = 'none';
            icon.classList.remove('expanded');
        }
    });
}

// Show detected features when photos are analyzed
function showDetectedFeatures(features) {
    const section = document.getElementById('detectedFeaturesSection');
    const list = document.getElementById('detectedFeaturesList');

    if (!features || features.length === 0) return;

    list.innerHTML = features.map(feature => `
        <label>
            <input type="checkbox" name="detectedFeatures" value="${feature.value}" checked>
            ${feature.label} <span style="color: #28a745; font-size: 0.85rem;">(${Math.round(feature.confidence * 100)}% confidence)</span>
        </label>
    `).join('');

    section.style.display = 'block';

    // Auto-expand advanced section
    document.getElementById('advancedContent').style.display = 'block';
    document.querySelector('.toggle-icon').classList.add('expanded');

    showToast('success', `Detected ${features.length} features from your photos`);
}

// ============================================
// PROBLEM 6: Auto-Save / Resume
// ============================================

let autoSaveTimeout;
const AUTOSAVE_DELAY = 10000; // 10 seconds

function startAutoSave() {
    // AUTO-SAVE DISABLED - Will add back later
    console.log('⚠️ Auto-save disabled for now');
}

function saveFormData() {
    const formData = {
        propertyType: document.getElementById('propertyType')?.value || '',
        bedrooms: document.getElementById('bedrooms')?.value || '',
        bathrooms: document.getElementById('bathrooms')?.value || '',
        address: document.getElementById('address')?.value || '',
        setting: document.getElementById('setting')?.value || '',
        features: Array.from(document.querySelectorAll('input[name="features"]:checked')).map(cb => cb.value),
        tone: document.querySelector('input[name="tone"]:checked')?.value || '',
        timestamp: new Date().toISOString()
    };

    try {
        localStorage.setItem('formDraft', JSON.stringify(formData));

        // Show saved indicator
        const indicator = document.getElementById('autoSaveIndicator');
        const status = document.getElementById('saveStatus');
        const timeEl = document.getElementById('saveTime');

        status.className = 'saved';
        status.textContent = '✓ Saved';
        timeEl.textContent = 'just now';

        // Hide after 3 seconds
        setTimeout(() => {
            indicator.style.display = 'none';
        }, 3000);
    } catch (error) {
        console.error('Auto-save failed:', error);
        const status = document.getElementById('saveStatus');
        status.className = 'error';
        status.textContent = '✗ Save failed';
    }
}

function checkForDraft() {
    const draft = localStorage.getItem('formDraft');
    if (!draft) return;

    const data = JSON.parse(draft);
    const draftAge = new Date() - new Date(data.timestamp);
    const minutesAgo = Math.round(draftAge / 60000);

    if (minutesAgo < 60) { // Only show if less than 1 hour old
        if (confirm(`Resume your draft from ${minutesAgo} minutes ago?`)) {
            restoreFormData(data);
            showToast('success', 'Draft restored');
        } else {
            localStorage.removeItem('formDraft');
        }
    } else {
        localStorage.removeItem('formDraft'); // Clear old drafts
    }
}

function restoreFormData(data) {
    if (data.propertyType) document.getElementById('propertyType').value = data.propertyType;
    if (data.bedrooms) document.getElementById('bedrooms').value = data.bedrooms;
    if (data.bathrooms) document.getElementById('bathrooms').value = data.bathrooms;
    if (data.address) document.getElementById('address').value = data.address;
    if (data.setting) document.getElementById('setting').value = data.setting;

    // Restore features
    if (data.features) {
        data.features.forEach(feature => {
            const checkbox = document.querySelector(`input[name="features"][value="${feature}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }

    // Restore tone
    if (data.tone) {
        const toneRadio = document.querySelector(`input[name="tone"][value="${data.tone}"]`);
        if (toneRadio) toneRadio.checked = true;
    }
}

// Clear draft after successful generation
function clearDraft() {
    localStorage.removeItem('formDraft');
}

// ============================================
// PROBLEM 5: Step-by-Step Progress
// ============================================

function showProgressModal() {
    const modal = document.getElementById('progressModal');
    modal.style.display = 'flex';

    // Reset progress
    document.getElementById('progressBar').style.width = '0%';
    document.querySelectorAll('.progress-step').forEach(step => {
        step.classList.remove('active', 'completed');
        step.querySelector('.step-icon').textContent = '⟳';
        step.querySelector('.step-time').textContent = '';
    });

    // Simulate progress steps
    simulateProgress();
}

function hideProgressModal() {
    document.getElementById('progressModal').style.display = 'none';
}

async function simulateProgress() {
    const steps = [
        { name: 'analyze', duration: 2000, text: 'Analyzing photos' },
        { name: 'features', duration: 3000, text: 'Extracting features' },
        { name: 'writing', duration: 8000, text: 'Writing content' },
        { name: 'compliance', duration: 2000, text: 'Checking compliance' }
    ];

    let totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
    let elapsed = 0;

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const stepElement = document.querySelector(`.progress-step[data-step="${step.name}"]`);

        // Mark as active
        stepElement.classList.add('active');

        // Update time remaining
        const remaining = Math.round((totalDuration - elapsed) / 1000);
        document.getElementById('timeRemaining').textContent =
            `Estimated time remaining: ${remaining} seconds`;

        // Update progress bar
        const progress = ((elapsed / totalDuration) * 100);
        document.getElementById('progressBar').style.width = `${progress}%`;

        // Wait for step duration
        await new Promise(resolve => setTimeout(resolve, step.duration));

        elapsed += step.duration;

        // Mark as completed
        stepElement.classList.remove('active');
        stepElement.classList.add('completed');
        stepElement.querySelector('.step-icon').textContent = '✓';
        stepElement.querySelector('.step-time').textContent = `${Math.round(step.duration / 1000)}s`;
    }

    // Final progress
    document.getElementById('progressBar').style.width = '100%';
    document.getElementById('timeRemaining').textContent = 'Complete!';
}

// ============================================
// PROBLEM 8: Results with Context
// ============================================

function displayVariantsWithContext(variants) {
    const container = document.getElementById('variantsContainer');
    container.innerHTML = '';

    variants.forEach((variant, index) => {
        const card = document.createElement('div');
        card.className = 'variant-card';

        // Determine recommendation
        let recommendation = '';
        if (index === 0) {
            recommendation = '<div class="variant-recommendation"><strong>⭐ Recommended:</strong> Best for Rightmove, Zoopla, lifestyle buyers</div>';
        } else if (variant.tone === 'premium') {
            recommendation = '<div class="variant-recommendation"><strong>💎 Best for:</strong> High-end brochures, £500K+ properties</div>';
        }

        card.innerHTML = `
            <div class="variant-header">
                <div>
                    <div class="variant-title">Variant ${index + 1}: ${variant.tone_display || variant.tone}</div>
                    ${index === 0 ? '<span class="variant-badge">RECOMMENDED</span>' : ''}
                </div>
                <div class="variant-meta">
                    <span>📏 ${variant.word_count || 0} words</span>
                    <span>⏱️ ${variant.channel || 'Portal'}</span>
                </div>
            </div>
            ${recommendation}
            <div class="variant-content">${variant.description}</div>
            <div class="variant-actions">
                <button class="btn-secondary" onclick="copyVariant(${index})">📋 Copy</button>
                <button class="btn-secondary" onclick="editVariant(${index})">✏️ Edit</button>
                <button class="btn-secondary" onclick="regenerateVariant(${index})">↻ Regenerate</button>
            </div>
        `;

        container.appendChild(card);
    });
}

// ============================================
// PROBLEM 3: Inline Editing
// ============================================

function makeVariantEditable(variantIndex) {
    const card = document.querySelectorAll('.variant-card')[variantIndex];
    const content = card.querySelector('.variant-content');
    const originalText = content.textContent;

    content.innerHTML = `
        <textarea class="section-textarea">${originalText}</textarea>
        <div class="section-edit-actions">
            <button class="btn-primary" onclick="saveVariantEdit(${variantIndex})">💾 Save</button>
            <button class="btn-secondary" onclick="cancelVariantEdit(${variantIndex}, '${originalText.replace(/'/g, "\\'")}')">✖ Cancel</button>
            <button class="btn-secondary" onclick="improveWithAI(${variantIndex})">✨ Improve with AI</button>
        </div>
    `;

    content.querySelector('textarea').focus();
}

function saveVariantEdit(variantIndex) {
    const card = document.querySelectorAll('.variant-card')[variantIndex];
    const textarea = card.querySelector('.section-textarea');
    const newText = textarea.value;

    card.querySelector('.variant-content').innerHTML = newText;

    showToast('success', 'Changes saved');
}

function cancelVariantEdit(variantIndex, originalText) {
    const card = document.querySelectorAll('.variant-card')[variantIndex];
    card.querySelector('.variant-content').innerHTML = originalText;
}

function copyVariant(variantIndex) {
    const card = document.querySelectorAll('.variant-card')[variantIndex];
    const text = card.querySelector('.variant-content').textContent;

    navigator.clipboard.writeText(text).then(() => {
        showToast('success', 'Copied to clipboard');
    }).catch(() => {
        showToast('error', 'Failed to copy');
    });
}

function editVariant(variantIndex) {
    makeVariantEditable(variantIndex);
}

function regenerateVariant(variantIndex) {
    showToast('info', 'Regenerating variant...');
    // TODO: Call API to regenerate specific variant
}

function improveWithAI(variantIndex) {
    showToast('info', 'Improving with AI...');
    // TODO: Call API to improve specific section
}

// ============================================
// Toast Notifications
// ============================================

function showToast(type, message, duration = 3000) {
    const container = document.getElementById('toastContainer');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '✓',
        error: '✗',
        info: 'ℹ'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(toast);

    // Auto-remove after duration
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ============================================
// Initialize All Features
// ============================================

// ============================================
// Form Data Collection for Brochure Generation
// ============================================

function collectBrochureFormData() {
    // Collect property features
    const features = Array.from(document.querySelectorAll('input[name="features"]:checked'))
        .map(cb => cb.value);

    // Property data
    const propertyData = {
        property_type: document.getElementById('propertyType')?.value || 'house',
        bedrooms: parseInt(document.getElementById('bedrooms')?.value || '3'),
        bathrooms: parseInt(document.getElementById('bathrooms')?.value || '2'),
        condition: document.getElementById('condition')?.value || 'good',
        features: features
    };

    // Add optional fields
    const sizeSqft = document.getElementById('sizeSqft')?.value;
    if (sizeSqft) {
        propertyData.size_sqft = parseInt(sizeSqft);
    }

    const epcRating = document.getElementById('epcRating')?.value;
    if (epcRating) {
        propertyData.epc_rating = epcRating;
    }

    // Location data
    const locationData = {
        address: document.getElementById('address')?.value || 'Property Address',
        setting: document.getElementById('setting')?.value || 'suburban'
    };

    const postcode = document.getElementById('postcode')?.value;
    if (postcode) {
        locationData.postcode = postcode;
    }

    // Location Enrichment Data
    const enrichmentSchools = document.getElementById('enrichmentSchools')?.value;
    const enrichmentAmenities = document.getElementById('enrichmentAmenities')?.value;
    const enrichmentTransport = document.getElementById('enrichmentTransport')?.value;

    if (enrichmentSchools || enrichmentAmenities || enrichmentTransport) {
        locationData.location_enrichment = {
            schools: enrichmentSchools || '',
            amenities: enrichmentAmenities || '',
            transport: enrichmentTransport || ''
        };

        // Combine into proximity notes for backward compatibility
        const enrichmentParts = [];
        if (enrichmentSchools) enrichmentParts.push(enrichmentSchools);
        if (enrichmentAmenities) enrichmentParts.push(enrichmentAmenities);
        if (enrichmentTransport) enrichmentParts.push(enrichmentTransport);
        locationData.proximity_notes = enrichmentParts.join('. ');
    }

    // Target audience - hardcoded to neutral (UI removed to avoid limiting buyers)
    const targetAudience = {
        audience_type: 'professionals'  // Uses neutral, property-focused prompts
    };

    // Tone
    const tone = {
        tone: document.getElementById('toneStyle')?.value || 'boutique'
    };

    // Channel - always brochure mode
    const channel = {
        channel: 'brochure'
    };

    // Brand and typography
    const brand = document.getElementById('estateAgentBrand')?.value || 'generic';
    const typography_style = document.getElementById('typographyStyle')?.value || 'classic';

    // Orientation
    const orientation = document.querySelector('input[name="orientation"]:checked')?.value || 'landscape';

    // ⭐ PHOTO ASSIGNMENTS - Convert photo IDs to integer indices
    // Backend expects integer indices (0, 1, 2...) not string IDs
    const convertPhotoIdsToIndices = (photoIds) => {
        if (!photoIds || !Array.isArray(photoIds)) return [];

        return photoIds.map(photoId => {
            // Find photo index in uploadedPhotos array
            const index = window.uploadedPhotos.findIndex(p =>
                p.id === photoId ||
                p.name === photoId ||
                p.id === photoId.replace('photo_', '') ||
                `photo_${p.id}` === photoId ||
                // Also try matching by array index if photoId is already a number
                window.uploadedPhotos[photoId] && window.uploadedPhotos[photoId].id === photoId
            );

            if (index !== -1) {
                return index;  // Return integer index
            }

            // Fallback: try parsing as integer
            const parsedInt = parseInt(photoId);
            if (!isNaN(parsedInt) && parsedInt >= 0 && parsedInt < window.uploadedPhotos.length) {
                return parsedInt;
            }

            console.warn('⚠️ Could not find photo index for ID:', photoId);
            return null;
        }).filter(index => index !== null);  // Remove nulls
    };

    const photo_assignments = {
        cover: convertPhotoIdsToIndices(window.photoCategoryAssignments.cover || []),
        exterior: convertPhotoIdsToIndices(window.photoCategoryAssignments.exterior || []),
        interior: convertPhotoIdsToIndices(window.photoCategoryAssignments.interior || []),
        kitchen: convertPhotoIdsToIndices(window.photoCategoryAssignments.kitchen || []),
        bedrooms: convertPhotoIdsToIndices(window.photoCategoryAssignments.bedrooms || []),
        bathrooms: convertPhotoIdsToIndices(window.photoCategoryAssignments.bathrooms || []),
        garden: convertPhotoIdsToIndices(window.photoCategoryAssignments.garden || [])
    };

    console.log('📸 Photo assignments being sent (integer indices):', photo_assignments);

    // ⭐ DISABLED - OLD system that conflicts with unified_brochure_builder.js
    // const brochureSectionMappings = createBrochureSectionMappings();

    // Build complete request payload
    const payload = {
        property_data: propertyData,
        location_data: locationData,
        target_audience: targetAudience,
        tone: tone,
        channel: channel,
        include_enrichment: true,  // ✅ ENABLED - Get schools, amenities, area info
        include_compliance: true,
        brand: brand,
        typography_style: typography_style,
        orientation: orientation,  // ⭐ Brochure orientation
        photo_assignments: photo_assignments,  // ⭐ Include photo assignments
        photo_analysis: photoAnalysisResults  // ⭐ Include photo analysis for text generation
        // brochure_sections: brochureSectionMappings  // ⭐ DISABLED - Using unified_brochure_builder.js instead
    };

    console.log('🎯 Complete payload with photo analysis and section mappings:', payload);

    return payload;
}

// ============================================
// Display Generated Results
// ============================================

function displayGeneratedResults(result) {
    const variantsContainer = document.getElementById('variantsContainer');
    if (!variantsContainer) return;

    variantsContainer.innerHTML = '';

    if (!result.variants || result.variants.length === 0) {
        variantsContainer.innerHTML = '<p>No variants generated</p>';
        return;
    }

    // Display each variant
    result.variants.forEach((variant, index) => {
        const variantCard = document.createElement('div');
        variantCard.className = 'variant-card';
        variantCard.innerHTML = `
            <div class="variant-header">
                <span class="variant-id">Variant ${variant.variant_id || index + 1}</span>
                <span class="variant-score">Score: ${(variant.score * 100).toFixed(0)}%</span>
            </div>
            <h3 class="variant-headline">${variant.headline}</h3>
            <div class="variant-text">${variant.full_text}</div>
            <div class="variant-meta">
                <span class="word-count">Word count: ${variant.word_count}</span>
            </div>
            ${variant.key_features && variant.key_features.length > 0 ? `
                <div class="variant-features">
                    <h4>Key Features:</h4>
                    <ul>
                        ${variant.key_features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            <div class="variant-actions">
                <button class="btn-copy" onclick="copyToClipboard('${variant.full_text.replace(/'/g, "\\'")}')">
                    📋 Copy Text
                </button>
            </div>
        `;
        variantsContainer.appendChild(variantCard);
    });
}

// ============================================
// Utility Functions
// ============================================

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('success', 'Copied to clipboard!');
    }).catch(err => {
        showToast('error', 'Failed to copy');
    });
}

// Bug #23, #24, #35, #34: Debounce, AbortController, Timeout, Offline detection
let isGenerating = false;
let generateAbortController = null;

// Bug #30 fix: Clean up old localStorage data
function cleanupLocalStorage() {
    console.log('🧹 Cleaning up old localStorage data...');
    const MAX_AGE_DAYS = 7;
    const now = Date.now();

    try {
        // Clean old drafts
        const draft = localStorage.getItem('openbrick_draft');
        if (draft) {
            try {
                const data = JSON.parse(draft);
                const age = now - (data.timestamp || 0);
                const ageDays = age / (1000 * 60 * 60 * 24);

                if (ageDays > MAX_AGE_DAYS) {
                    localStorage.removeItem('openbrick_draft');
                    console.log(`✓ Removed draft older than ${MAX_AGE_DAYS} days`);
                }
            } catch (e) {
                // Invalid draft, remove it
                localStorage.removeItem('openbrick_draft');
                console.log('✓ Removed invalid draft');
            }
        }

        // Clean old brochure editor data (keep only most recent)
        const editorData = localStorage.getItem('brochure_editor_data');
        if (editorData) {
            try {
                const data = JSON.parse(editorData);
                // If it exists but has no timestamp, it's old - don't remove automatically
                // Let user decide if they want to keep it
            } catch (e) {
                // Invalid data
                localStorage.removeItem('brochure_editor_data');
                console.log('✓ Removed corrupted brochure data');
            }
        }

        // Clean old session data
        const session = localStorage.getItem('brochure_session_start');
        if (session) {
            const sessionAge = now - parseInt(session);
            const sessionAgeDays = sessionAge / (1000 * 60 * 60 * 24);

            if (sessionAgeDays > MAX_AGE_DAYS) {
                localStorage.removeItem('brochure_session_start');
                console.log('✓ Removed old session data');
            }
        }

        console.log('✅ localStorage cleanup complete');
    } catch (error) {
        console.error('❌ localStorage cleanup error:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Bug #30 fix: Run cleanup on load
    cleanupLocalStorage();

    startAutoSave();

    // Override existing generate form handler
    const originalForm = document.getElementById('generateForm');
    if (originalForm) {
        originalForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Bug #23 fix: Debounce - prevent multiple concurrent generations
            if (isGenerating) {
                showToast('warning', 'Generation already in progress. Please wait...');
                return;
            }

            // Bug #34 fix: Check if online
            if (!navigator.onLine) {
                showToast('error', 'You\'re offline! Please check your internet connection.');
                return;
            }

            console.log('🚀 Form submitted - starting generation...');

            // Bug #12 fix: Validate required fields
            const address = document.getElementById('address')?.value?.trim();
            const bedrooms = document.getElementById('bedrooms')?.value;
            const bathrooms = document.getElementById('bathrooms')?.value;

            if (!address || address.length < 5) {
                showToast('error', 'Please enter a valid property address');
                document.getElementById('address')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // DISABLED PER USER REQUEST: Bedrooms/bathrooms no longer mandatory
            // User can choose to skip these fields - agent's responsibility to verify
            /*
            if (!bedrooms || bedrooms === '0') {
                showToast('error', 'Please select the number of bedrooms');
                document.getElementById('bedrooms')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            if (!bathrooms || bathrooms === '0') {
                showToast('error', 'Please select the number of bathrooms');
                document.getElementById('bathrooms')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            */

            // Bug #12 fix: Validate minimum photos
            if (uploadedPhotos.length < 1) {
                showToast('error', `Please upload at least 1 photo (currently: ${uploadedPhotos.length})`);
                const uploadSection = document.getElementById('imageSection');
                if (uploadSection) uploadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // ============================================
            // Page builder validation REMOVED
            // V3 Editor handles all layout - no pre-generation page building needed
            // ============================================

            // Bug #17 fix: Validate photo count against brand template requirements
            const brand = document.getElementById('estateAgentBrand')?.value || 'generic';
            let minPhotos = 1; // Generic default (relaxed for testing)

            if (brand === 'savills') {
                minPhotos = 1; // Savills requires 1+ photos (relaxed for testing)
                if (uploadedPhotos.length < minPhotos) {
                    showToast('error', `Savills brochures require at least ${minPhotos} photos (currently: ${uploadedPhotos.length})`);
                    const uploadSection = document.getElementById('imageSection');
                    if (uploadSection) uploadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return;
                }
            }

            // Show confirmation dialog for generation
            const hasCoverPhoto = window.coverPhotoId ? '✓ Cover photo selected\n' : '';

            const confirmed = confirm(
                `📖 Ready to generate your brochure?\n\n` +
                `✓ ${uploadedPhotos.length} photo${uploadedPhotos.length !== 1 ? 's' : ''} uploaded\n` +
                hasCoverPhoto +
                `\nThis will cost 1 credit (~£2).\n\n` +
                `Click OK to proceed with generation.`
            );

            if (!confirmed) {
                console.log('User cancelled generation');
                return; // Stop generation
            }

            console.log('✅ User approved generation - proceeding...');

            // Bug #23 fix: Set generating flag and disable button
            isGenerating = true;
            const generateBtn = document.getElementById('generateBtn');
            if (generateBtn) {
                generateBtn.disabled = true;
                generateBtn.style.opacity = '0.6';
                generateBtn.style.cursor = 'not-allowed';
                generateBtn.textContent = '⏳ Generating...';
            }
            // ============================================

            // Show progress modal
            showProgressModal();

            try {
                // Collect form data
                console.log('📋 Collecting form data...');
                const formData = collectBrochureFormData();
                console.log('📤 Form data collected successfully:', formData);
                console.log('📸 Photos uploaded:', uploadedPhotos.length);

                // Update progress modal with diagnostic info
                const progressModal = document.getElementById('generateProgressModal');
                if (progressModal) {
                    const progressText = progressModal.querySelector('p');
                    if (progressText) {
                        progressText.innerHTML = `Connecting to backend...<br><small>Photos: ${uploadedPhotos.length} | Retrying if needed</small>`;
                    }
                }

                // Bug #24, #35 fix: AbortController with 5-minute timeout (generation can be slow)
                generateAbortController = new AbortController();
                const REQUEST_TIMEOUT = 300000; // 5 minutes (300 seconds)

                // Make actual API call with retry logic for network suspension
                let response;
                let lastError;
                const maxRetries = 3;

                for (let attempt = 1; attempt <= maxRetries; attempt++) {
                    try {
                        console.log(`🔄 Attempt ${attempt}/${maxRetries} - Calling /generate endpoint...`);
                        console.log(`⏰ Start time: ${new Date().toISOString()}`);

                        // Update progress modal
                        if (progressModal) {
                            const progressText = progressModal.querySelector('p');
                            if (progressText) {
                                progressText.innerHTML = `Attempt ${attempt}/${maxRetries}<br><small>Generating brochure text with AI...</small>`;
                            }
                        }

                        // Bug #35 fix: Set timeout for this attempt
                        const timeoutId = setTimeout(() => {
                            generateAbortController.abort();
                            console.warn(`⏱️ Request timeout after ${REQUEST_TIMEOUT}ms`);
                        }, REQUEST_TIMEOUT);

                        try {
                            response = await fetch('/generate', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(formData),
                                signal: generateAbortController.signal  // Bug #24 fix: Add abort signal
                            });

                            clearTimeout(timeoutId); // Cancel timeout if request succeeds
                        } catch (fetchErr) {
                            clearTimeout(timeoutId);
                            if (fetchErr.name === 'AbortError') {
                                throw new Error(`Request timeout after ${REQUEST_TIMEOUT/1000} seconds`);
                            }
                            throw fetchErr;
                        }

                        console.log(`✅ Response received! Status: ${response.status}`);
                        console.log(`⏰ End time: ${new Date().toISOString()}`);

                        // Success! Break out of retry loop
                        break;
                    } catch (fetchError) {
                        lastError = fetchError;
                        console.error(`❌ Attempt ${attempt} FAILED:`, {
                            message: fetchError.message,
                            type: fetchError.name,
                            stack: fetchError.stack
                        });

                        if (attempt < maxRetries) {
                            // Wait before retrying (exponential backoff: 2s, 4s)
                            const delay = attempt * 2000;
                            console.warn(`⏳ Waiting ${delay/1000}s before retry...`);

                            // Update progress modal
                            if (progressModal) {
                                const progressText = progressModal.querySelector('p');
                                if (progressText) {
                                    progressText.innerHTML = `Network issue detected<br><small>Retrying in ${delay/1000}s... (${attempt}/${maxRetries})</small>`;
                                }
                            }

                            await new Promise(resolve => setTimeout(resolve, delay));
                        } else {
                            // All retries exhausted
                            console.error('💥 ALL RETRIES EXHAUSTED - Generation failed');
                            throw new Error(`Network error after ${maxRetries} attempts.\n\n${fetchError.message}\n\nTip: Try plugging in your laptop or disabling network power saving.`);
                        }
                    }
                }

                if (!response) {
                    throw new Error('No response received from server after retries');
                }

                if (!response.ok) {
                    console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
                    const errorData = await response.json();

                    // Handle validation errors (422 Unprocessable Entity)
                    if (response.status === 422 && Array.isArray(errorData.detail)) {
                        const validationErrors = errorData.detail.map(err =>
                            `${err.loc.join('.')}: ${err.msg}`
                        ).join('\n');
                        console.error('Validation errors:', validationErrors);
                        throw new Error(`Validation failed:\n${validationErrors}`);
                    }

                    throw new Error(errorData.detail || 'Generation failed');
                }

                const result = await response.json();
                console.log('✅ Backend response received successfully:', result);

                // Hide progress modal
                hideProgressModal();

                // Clear draft
                clearDraft();

                // ═══════════════════════════════════════════════════════════════
                // INTEGRATE UNIFIED BROCHURE BUILDER - Proper Page Generation
                // ═══════════════════════════════════════════════════════════════

                console.log('🔧 Integrating Unified Brochure Builder...');

                // Step 1: Sync photos to UnifiedBrochureState (categorizes photos by room type)
                console.log('📸 Current uploadedPhotos:', uploadedPhotos.length, 'photos');
                console.log('📸 All photo names:', uploadedPhotos.map(p => p.name).join(', '));
                console.log('📸 Sample photo:', uploadedPhotos[0]);

                if (typeof window.syncPhotosToUnifiedState === 'function') {
                    console.log('📸 Syncing photos to unified state with vision analysis...');
                    await window.syncPhotosToUnifiedState();
                    console.log('📸 After sync, UnifiedBrochureState.photos:', window.UnifiedBrochureState?.photos?.length);
                    console.log('📸 UnifiedBrochureState photo names:', window.UnifiedBrochureState?.photos?.map(p => p.name).join(', '));
                    console.log('📸 Categorized photos:', window.UnifiedBrochureState?.categorizedPhotos);
                } else {
                    console.warn('⚠️ syncPhotosToUnifiedState not found - unified_brochure_builder.js may not be loaded');
                }

                // Step 2: Update UnifiedBrochureState with form data
                if (window.UnifiedBrochureState) {
                    window.UnifiedBrochureState.property = {
                        houseName: formData.property_data.house_name || '',
                        address: formData.location_data.address,
                        postcode: formData.location_data.postcode,
                        askingPrice: document.getElementById('askingPrice')?.value || 'POA',
                        bedrooms: formData.property_data.bedrooms || 0,
                        bathrooms: formData.property_data.bathrooms || 0,
                        propertyType: formData.property_data.property_type || 'house',
                        sizeSqft: formData.property_data.size_sqft || 0,
                        tenure: formData.property_data.tenure || '',
                        councilTaxBand: formData.property_data.council_tax_band || '',
                        epcRating: formData.property_data.epc_rating || 'TBC',
                        features: formData.property_data.features || [],
                        locationEnrichment: {
                            schools: formData.location_data.schools || '',
                            amenities: formData.location_data.amenities || '',
                            transport: formData.location_data.transport || ''
                        }
                    };

                    window.UnifiedBrochureState.agent = {
                        name: document.getElementById('agentName')?.value || '',
                        phone: document.getElementById('agentPhone')?.value || '',
                        email: document.getElementById('agentEmail')?.value || '',
                        includePhoto: true
                    };
                }

                // Step 3: Generate pages using the proper page builder
                let generatedPages = [];
                if (typeof window.generateBrochurePages === 'function') {
                    console.log('📄 Generating pages with unified page builder...');
                    generatedPages = window.generateBrochurePages();
                    console.log(`✅ Generated ${generatedPages.length} pages:`, generatedPages.map(p => p.title));
                } else {
                    console.warn('⚠️ generateBrochurePages not found - falling back to basic pages');
                    // Fallback: basic pages if builder not available
                    generatedPages = [
                        { id: 1, type: 'cover', title: 'Cover Page', photos: [], content: {} }
                    ];
                }

                // Step 4: Prepare photo URLs mapping for editor (use UnifiedBrochureState photos - they have the correct IDs)
                const photoUrls = {};
                (window.UnifiedBrochureState?.photos || []).forEach(photo => {
                    if (photo.id && photo.dataUrl) {
                        photoUrls[photo.id] = photo.dataUrl;
                    }
                });

                // Step 5: Use UnifiedBrochureState photos directly (they already have vision analysis!)
                // The editor expects photos to have an 'analysis' property
                const photosWithAnalysis = (window.UnifiedBrochureState?.photos || []).map(p => {
                    return {
                        id: p.id,
                        name: p.name,
                        dataUrl: p.dataUrl,
                        category: p.category,
                        analysis: {
                            // Use actual vision analysis attributes, not just category
                            attributes: p.attributes || [p.category],
                            caption: p.caption || `${p.category.charAt(0).toUpperCase() + p.category.slice(1)} photo`,
                            roomType: p.roomType || p.category
                        }
                    };
                });

                console.log('📸 Photos with analysis:', photosWithAnalysis.length, 'photos');
                console.log('📸 Sample photo from UnifiedBrochureState:', window.UnifiedBrochureState?.photos?.[0]);

                // Step 6: Convert generated pages format to editor format
                // Keep full photo objects instead of just IDs
                const editorPages = generatedPages.map(page => ({
                    id: page.id || page.type,
                    type: page.type,
                    title: page.title,
                    photos: (page.photos || []).map(p => {
                        // Get the photo ID (either from p.id or p itself if it's just an ID string)
                        const photoId = p.id || p;

                        // ALWAYS look up the photo from photosWithAnalysis to ensure we have the correct dataUrl
                        const matchedPhoto = photosWithAnalysis.find(photo => photo.id === photoId);

                        if (matchedPhoto) {
                            return matchedPhoto;
                        }

                        // Fallback: if not found, log warning and return the original
                        console.warn('⚠️ Photo not found in photosWithAnalysis:', photoId);
                        return p;
                    }),
                    content: page.content || {}
                }));

                console.log('📋 Editor pages prepared:', editorPages);
                console.log('📋 Page IDs:', editorPages.map(p => `${p.id} (${p.type})`).join(', '));
                console.log('📋 Page structure check:', JSON.stringify(editorPages.map(p => ({
                    id: p.id,
                    type: p.type,
                    title: p.title,
                    photoCount: p.photos?.length || 0,
                    firstPhoto: p.photos?.[0] ? {
                        id: p.photos[0].id,
                        hasDataUrl: !!p.photos[0].dataUrl,
                        hasAnalysis: !!p.photos[0].analysis,
                        category: p.photos[0].category
                    } : null
                })), null, 2));

                // Critical debug: Check if photosWithAnalysis actually has the data
                console.log('📸 photosWithAnalysis sample:', photosWithAnalysis.slice(0, 2).map(p => ({
                    id: p.id,
                    name: p.name,
                    hasDataUrl: !!p.dataUrl,
                    dataUrlLength: p.dataUrl?.length,
                    category: p.category,
                    hasAnalysis: !!p.analysis
                })));

                // Prepare brochure editor data
                const editorData = {
                    property: {
                        address: formData.location_data.address,
                        price: document.getElementById('askingPrice')?.value || 'POA',
                        location: formData.location_data.proximity_notes || '',
                        features: formData.property_data.features || [],
                        epc: formData.property_data.epc_rating || 'TBC',
                        agentName: document.getElementById('agentName')?.value || '',
                        agentPhone: document.getElementById('agentPhone')?.value || '',
                        agentEmail: document.getElementById('agentEmail')?.value || '',
                        officePhone: document.getElementById('officePhone')?.value || '',
                        officeEmail: document.getElementById('officeEmail')?.value || ''
                    },
                    agent: {
                        name: document.getElementById('agentName')?.value || 'James Smith',
                        phone: document.getElementById('agentPhone')?.value || '+44 7700 900123',
                        email: document.getElementById('agentEmail')?.value || 'james.smith@savills.com',
                        includePhoto: document.getElementById('includeAgentPhoto')?.checked || true
                    },
                    photos: photosWithAnalysis,
                    photoUrls: photoUrls,
                    photoAssignments: photoCategoryAssignments,
                    agentPhoto: window.agentPhotoFile || null,
                    floorplan: window.propertyFloorPlan || null,
                    epcCertificate: window.epcFile || null,
                    generatedText: result.variants,
                    brand: formData.brand,
                    typography: formData.typography_style,
                    orientation: formData.orientation,
                    // Use dynamically generated pages from unified builder
                    pages: editorPages
                };

                // Save session to backend API
                showToast('info', 'Saving brochure session...');

                try {
                    // Create session request payload matching BrochureSessionCreateRequest schema
                    const sessionPayload = {
                        user_email: localStorage.getItem('agentEmail') || 'user@example.com',
                        property: {
                            address: editorData.property?.address || document.getElementById('address')?.value || '',
                            price: editorData.property?.price || document.getElementById('askingPrice')?.value || '',
                            bedrooms: parseInt(formData.property_data?.bedrooms) || 0,
                            bathrooms: parseInt(formData.property_data?.bathrooms) || 0,
                            property_type: formData.property_data?.property_type || 'house',
                            features: formData.property_data?.features || [],
                            postcode: document.getElementById('postcode')?.value || ''
                        },
                        agent: {
                            name: document.getElementById('agentName')?.value || 'Agent',
                            phone: document.getElementById('agentPhone')?.value || '',
                            email: document.getElementById('agentEmail')?.value || ''
                        },
                        photos: (editorData.photos || []).map((p, idx) => ({
                            id: p.id || `photo_${idx}`,
                            name: p.filename || p.name || `photo_${idx}.jpg`,
                            category: p.category || 'exterior',
                            dataUrl: p.dataUrl || p.base64 || '',
                            caption: p.caption || null,
                            width: p.width || null,
                            height: p.height || null,
                            analysis: p.analysis || null
                        })),
                        pages: (editorData.pages || []).map((page, idx) => {
                            // Ensure content is always a plain object (not array)
                            let safeContent = {};
                            if (page.content && typeof page.content === 'object' && !Array.isArray(page.content)) {
                                safeContent = page.content;
                            }
                            // Ensure id is always a string
                            const safeId = (page.id != null) ? String(page.id) : `page_${idx}`;
                            console.log(`🔴 Page ${idx}: id=${safeId}, type=${page.type}, content_type=${typeof page.content}, is_array=${Array.isArray(page.content)}`);
                            return {
                                id: safeId,
                                type: String(page.type || 'content'),
                                title: String(page.title || `Page ${idx + 1}`),
                                photos: [],
                                content: safeContent,
                                order: Number(idx)
                            };
                        }),
                        preferences: {
                            brand: editorData.brand || 'doorstep',
                            typography: editorData.typography || 'modern',
                            orientation: editorData.orientation || 'portrait',
                            generatedText: editorData.generatedText || []
                        }
                    };

                    console.log('Creating brochure session with payload:', sessionPayload);
                    console.log('🔴 Photos count:', sessionPayload.photos?.length);
                    console.log('🔴 Pages count:', sessionPayload.pages?.length);
                    if (sessionPayload.photos?.[0]) {
                        const fp = sessionPayload.photos[0];
                        console.log('🔴 First photo - id:', fp.id, 'name:', fp.name, 'category:', fp.category, 'dataUrl length:', fp.dataUrl?.length);
                    }
                    if (sessionPayload.pages?.[0]) {
                        const pg = sessionPayload.pages[0];
                        console.log('🔴 First page - id:', pg.id, 'type:', pg.type, 'title:', pg.title, 'order:', pg.order);
                    }

                    // First call debug endpoint
                    try {
                        await fetch('/api/brochure/session-debug', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(sessionPayload)
                        });
                    } catch (e) { console.log('Debug endpoint error:', e); }

                    const sessionResponse = await fetch('/api/brochure/session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(sessionPayload)
                    });

                    if (!sessionResponse.ok) {
                        const errorText = await sessionResponse.text();
                        console.error('Session creation failed:', errorText);
                        console.error('🔴 Full error response:', errorText);
                        throw new Error(`Failed to save session: ${sessionResponse.status}`);
                    }

                    const sessionResult = await sessionResponse.json();
                    const sessionId = sessionResult.session_id;
                    console.log('Session created successfully:', sessionId);

                    // Store in window as backup
                    window.brochureEditorData = editorData;
                    window.brochureSessionId = sessionId;

                    showToast('success', 'Brochure generated! Opening editor...');

                    // Navigate to editor (same tab to avoid popup blocker)
                    setTimeout(() => {
                        window.location.href = `/static/brochure_editor_v3.html?session=${sessionId}`;
                    }, 1000);

                } catch (sessionError) {
                    console.error('Session save error:', sessionError);
                    // Fallback: use client-side session ID
                    const sessionId = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/x/g, () =>
                        Math.floor(Math.random() * 16).toString(16)
                    );
                    window.brochureEditorData = editorData;
                    window.brochureSessionId = sessionId;
                    showToast('warning', 'Session save failed, using local storage fallback');
                    setTimeout(() => {
                        window.location.href = `/static/brochure_editor_v3.html?session=${sessionId}`;
                    }, 1000);
                }
            } catch (error) {
                console.error('❌ Generation error:', error);
                console.error('Error details:', {
                    message: error.message,
                    type: error.name,
                    stack: error.stack
                });
                hideProgressModal();

                // Show detailed error modal instead of just toast
                alert(`❌ GENERATION FAILED\n\n${error.message}\n\n🔍 Check browser console (F12) for detailed logs.\n\n💡 Common fixes:\n• Plug in your laptop\n• Disable network adapter power saving\n• Check if server is running on http://localhost:8000\n• Ensure Claude API key is configured`);

                showToast('error', `Generation failed: ${error.message}`);
            } finally {
                // Bug #23 fix: Always reset generating flag and button state
                isGenerating = false;
                if (generateBtn) {
                    generateBtn.disabled = false;
                    generateBtn.style.opacity = '1';
                    generateBtn.style.cursor = 'pointer';
                    generateBtn.textContent = '📄 Generate Brochure';
                }

                // Bug #24 fix: Cleanup AbortController
                generateAbortController = null;
            }
        });
    }

    // Social Media Generation Button Handler
    const generateSocialBtn = document.getElementById('generateSocialBtn');
    if (generateSocialBtn) {
        generateSocialBtn.addEventListener('click', async () => {
            console.log('Social Media button clicked!');

            // Collect form data
            const formData = new FormData();
            formData.append('property_name', document.getElementById('propertyName')?.value || '');
            formData.append('address', document.getElementById('address')?.value || '');
            formData.append('price', document.getElementById('askingPrice')?.value || '');
            formData.append('bedrooms', document.getElementById('bedrooms')?.value || '');
            formData.append('bathrooms', document.getElementById('bathrooms')?.value || '');
            formData.append('property_type', document.getElementById('propertyType')?.value || '');
            formData.append('description', document.getElementById('keyFeatures')?.value || '');
            formData.append('platform', 'facebook'); // Default platform

            // Get uploaded photos from window.uploadedPhotos or UnifiedBrochureState
            const photos = window.UnifiedBrochureState?.photos || window.uploadedPhotos || [];
            console.log(`Sending ${photos.length} photos with social media request`);

            // Package all data (form + photos + agent info) for the editor
            const packagedData = {
                formData: {
                    property_name: document.getElementById('propertyName')?.value || '',
                    address: document.getElementById('address')?.value || '',
                    price: document.getElementById('askingPrice')?.value || '',
                    bedrooms: document.getElementById('bedrooms')?.value || '',
                    bathrooms: document.getElementById('bathrooms')?.value || '',
                    property_type: document.getElementById('propertyType')?.value || '',
                    description: document.getElementById('keyFeatures')?.value || '',
                    agent_name: document.getElementById('agentName')?.value || '',
                    agent_phone: document.getElementById('agentPhone')?.value || '',
                    agent_email: document.getElementById('agentEmail')?.value || ''
                },
                photos: photos
            };

            // Call the API
            try {
                showToast('info', 'Generating social media post...');

                const response = await fetch('/marketing/social-post', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                console.log('Social media data:', data);

                // Store BOTH API response AND photos for the editor
                window.socialMediaData = {
                    ...data,
                    ...packagedData
                };

                window.open('/static/social_media_editor_v2.html', '_blank');

                showToast('success', 'Social media post generated!');
            } catch (error) {
                console.error('Social media generation error:', error);
                showToast('error', `Failed: ${error.message}`);
            }
        });
    }

    // Newsletter Generation Button Handler (placeholder for now)
    const generateNewsletterBtn = document.getElementById('generateNewsletterBtn');
    if (generateNewsletterBtn) {
        generateNewsletterBtn.addEventListener('click', () => {
            showToast('info', 'Newsletter generation coming soon!');
        });
    }

    // Email Generation Button Handler (placeholder for now)
    const generateEmailBtn = document.getElementById('generateEmailBtn');
    if (generateEmailBtn) {
        generateEmailBtn.addEventListener('click', () => {
            showToast('info', 'Email generation coming soon!');
        });
    }
});

// ============================================
// Photo Upload with Drag & Drop
// ============================================

const uploadedPhotos = [];
// Expose to window so progress tracker can access it
window.uploadedPhotos = uploadedPhotos;

document.addEventListener('DOMContentLoaded', () => {
    const imageUploadZone = document.getElementById('imageUploadZone');
    const imageInput = document.getElementById('imageInput');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');

    if (imageUploadZone && imageInput) {
        // Click handler removed - handled by auto_save_logo_progress.js to avoid double-click issue

        // File input change
        imageInput.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        });

        // Drag & drop
        imageUploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageUploadZone.style.borderColor = '#2C5F7C';
            imageUploadZone.style.background = 'rgba(44, 95, 124, 0.05)';
        });

        imageUploadZone.addEventListener('dragleave', () => {
            imageUploadZone.style.borderColor = '#555';
            imageUploadZone.style.background = '#444';
        });

        imageUploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            imageUploadZone.style.borderColor = '#555';
            imageUploadZone.style.background = '#444';
            handleFiles(e.dataTransfer.files);
        });
    }
});

// Photo upload queue and state
let uploadQueue = [];
let uploadingCount = 0;
const MAX_CONCURRENT_UPLOADS = 5; // Bug #18 fix: Throttle FileReader operations
const MAX_FILE_SIZE_MB = 10; // Bug #1, #21 fix: 10MB limit
const MAX_IMAGE_DIMENSION = 1920; // Bug #22 fix: Compress to 1920px max dimension

// Generate unique photo ID (Bug #20, #11, #3 fix)
function generatePhotoId() {
    return `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Check localStorage quota (Bug #8, #13, #20, #32 fix)
function checkLocalStorageQuota() {
    try {
        const testKey = '__quota_test__';
        const testValue = 'x'.repeat(1024 * 1024); // 1MB test
        localStorage.setItem(testKey, testValue);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        if (e.name === 'QuotaExceededError' || e.code === 22) {
            console.error('❌ localStorage quota exceeded');
            return false;
        }
        // Safari private mode or other errors
        console.warn('⚠️ localStorage not available:', e.name);
        return false;
    }
}

// Safe localStorage set with error handling (Bug #13, #32 fix)
function safeSetLocalStorage(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (e) {
        if (e.name === 'QuotaExceededError' || e.code === 22) {
            showToast('error', 'Storage full! Please clear browser data or use fewer photos.');
            console.error('❌ localStorage quota exceeded:', e);
        } else {
            showToast('error', 'Unable to save data. Try disabling private browsing mode.');
            console.error('❌ localStorage error:', e);
        }
        return false;
    }
}

// Compress image before storing (Bug #22 fix)
async function compressImage(file, maxDimension = MAX_IMAGE_DIMENSION) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        img.onload = () => {
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions
            if (width > maxDimension || height > maxDimension) {
                if (width > height) {
                    height = Math.round((height * maxDimension) / width);
                    width = maxDimension;
                } else {
                    width = Math.round((width * maxDimension) / height);
                    height = maxDimension;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to JPEG with 85% quality
            canvas.toBlob((blob) => {
                if (blob) {
                    const compressedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    resolve({
                        file: compressedFile,
                        dataUrl: canvas.toDataURL('image/jpeg', 0.85),
                        originalSize: file.size,
                        compressedSize: blob.size,
                        dimensions: { width, height }
                    });
                } else {
                    reject(new Error('Failed to compress image'));
                }
            }, 'image/jpeg', 0.85);
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = URL.createObjectURL(file);
    });
}

// Process upload queue with throttling (Bug #18 fix)
async function processUploadQueue() {
    while (uploadQueue.length > 0 && uploadingCount < MAX_CONCURRENT_UPLOADS) {
        const task = uploadQueue.shift();
        uploadingCount++;

        try {
            await task();
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            uploadingCount--;
        }
    }

    // Check if all uploads complete
    if (uploadQueue.length === 0 && uploadingCount === 0) {
        // Trigger photo analysis after all files loaded
        if (uploadedPhotos.length > 0) {
            analyzePhotosForFeatures();
        }
    }
}

async function handleFiles(files) {
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const uploadPrompt = document.getElementById('uploadPrompt');

    // Bug #4 fix: Clear auto-detected features from previous upload
    if (uploadedPhotos.length > 0) {
        console.log('🧹 Clearing previously auto-detected features...');

        // Uncheck all auto-detected checkboxes
        autoDetectedCheckboxes.forEach(featureValue => {
            const checkbox = document.querySelector(`input[name="features"][value="${featureValue}"]`);
            if (checkbox) {
                checkbox.checked = false;

                // Remove AI badge
                const label = checkbox.closest('label');
                if (label) {
                    const badge = label.querySelector('.auto-detected-badge');
                    if (badge) badge.remove();
                }
            }
        });

        // Clear the tracking set
        autoDetectedCheckboxes.clear();
        console.log('✅ Auto-detected features cleared');
    }

    // Bug #1, #21 fix: Validate file sizes and types
    const validFiles = [];
    const invalidFiles = [];

    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
            invalidFiles.push({ file, reason: 'Not an image file' });
            return;
        }

        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > MAX_FILE_SIZE_MB) {
            invalidFiles.push({ file, reason: `File too large (${fileSizeMB.toFixed(1)}MB, max ${MAX_FILE_SIZE_MB}MB)` });
            return;
        }

        validFiles.push(file);
    });

    // Show errors for invalid files
    if (invalidFiles.length > 0) {
        invalidFiles.forEach(({ file, reason }) => {
            showToast('error', `${file.name}: ${reason}`);
        });
    }

    if (validFiles.length === 0) {
        return; // No valid files to process
    }

    // Bug #20 fix: Add unique IDs and compress images
    const totalFiles = validFiles.length;
    let processedFiles = 0;

    // Show upload progress
    showToast('info', `Uploading ${totalFiles} photo${totalFiles > 1 ? 's' : ''}...`);

    validFiles.forEach(file => {
        const uploadTask = async () => {
            try {
                // Compress image (Bug #22 fix)
                const compressed = await compressImage(file);

                // Generate unique ID (Bug #20, #11, #3 fix)
                const photoId = generatePhotoId();

                // Create photo object with unique ID
                const photoData = {
                    id: photoId, // UNIQUE ID for matching
                    file: compressed.file,
                    dataUrl: compressed.dataUrl,
                    name: file.name,
                    originalName: file.name,
                    size: compressed.compressedSize,
                    dimensions: compressed.dimensions,
                    uploadedAt: Date.now()
                };

                // Add to uploadedPhotos array
                uploadedPhotos.push(photoData);

                processedFiles++;

                // Update UI
                displayPhotoPreviews();

                // Update progress tracker
                if (typeof updateProgress === 'function') {
                    updateProgress();
                }

                // Show progress
                if (processedFiles === totalFiles) {
                    const savedMB = validFiles.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024);
                    const compressedMB = uploadedPhotos.reduce((sum, p) => sum + p.size, 0) / (1024 * 1024);
                    showToast('success', `✓ ${totalFiles} photo${totalFiles > 1 ? 's' : ''} uploaded (saved ${(savedMB - compressedMB).toFixed(1)}MB)`);

                    // UNIFIED SYSTEM: Sync photos to unified state
                    if (typeof window.syncPhotosToUnifiedState === 'function') {
                        window.syncPhotosToUnifiedState();
                    }
                }

            } catch (error) {
                console.error(`❌ Failed to process ${file.name}:`, error);
                showToast('error', `Failed to upload ${file.name}: ${error.message}`);
            }
        };

        uploadQueue.push(uploadTask);
    });

    if (uploadPrompt) uploadPrompt.style.display = 'none';
    if (imagePreviewContainer) imagePreviewContainer.style.display = 'grid';

    // Start processing queue with throttling
    processUploadQueue();
}

function removePhoto(index) {
    // Remove photo from uploadedPhotos array
    uploadedPhotos.splice(index, 1);

    // Update progress tracker
    if (typeof updateProgress === 'function') {
        updateProgress();
    }

    // Remove this photo from ALL category assignments
    Object.keys(photoCategoryAssignments).forEach(category => {
        // Find and remove this photo index from the category
        const photoIndexInCategory = window.photoCategoryAssignments[category].indexOf(index);
        if (photoIndexInCategory > -1) {
            window.photoCategoryAssignments[category].splice(photoIndexInCategory, 1);
        }

        // Update all remaining photo indices in this category (shift down by 1 if they're after the deleted photo)
        window.photoCategoryAssignments[category] = window.photoCategoryAssignments[category].map(photoIdx => {
            return photoIdx > index ? photoIdx - 1 : photoIdx;
        });
    });

    // Update all displays
    displayPhotoPreviews();
    updateCategoryDisplay();
    updateProgressTracker();
    updateCompletionTracker();

    if (uploadedPhotos.length === 0) {
        const uploadPrompt = document.getElementById('uploadPrompt');
        const imagePreviewContainer = document.getElementById('imagePreviewContainer');
        if (uploadPrompt) uploadPrompt.style.display = 'flex';
        if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';

        // Hide photo assignment section if no photos
        const assignmentSection = document.getElementById('photoAssignmentSection');
        if (assignmentSection) assignmentSection.style.display = 'none';
    }
}

// ============================================
// Photo Category Assignment (Brochure Mode)
// ============================================

// photoCategoryAssignments moved to top of file to avoid initialization errors

// Category display order (can be reordered by dragging)
let categoryOrder = ['cover', 'exterior', 'interior', 'kitchen', 'bedrooms', 'bathrooms', 'garden'];

// Initialize selected photo index on window object (no local variable)
if (typeof window.selectedPhotoIndex === 'undefined') {
    window.selectedPhotoIndex = null;
}

// Helper function to get category number (1-7)
function getCategoryNumber(category) {
    const categoryNumbers = {
        'cover': 1,
        'exterior': 2,
        'interior': 3,
        'kitchen': 4,
        'bedrooms': 5,
        'bathrooms': 6,
        'garden': 7
    };
    return categoryNumbers[category] || 0;
}

function displayPhotoPreviews() {
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    if (!imagePreviewContainer) return;

    // Ensure container is visible when photos exist
    if (uploadedPhotos.length > 0) {
        imagePreviewContainer.style.display = 'grid';
    }

    // Find which categories each photo is assigned to
    const photoToCategoriesMap = {};
    Object.keys(photoCategoryAssignments).forEach(category => {
        window.photoCategoryAssignments[category].forEach(photoIndex => {
            if (!photoToCategoriesMap[photoIndex]) {
                photoToCategoriesMap[photoIndex] = [];
            }
            photoToCategoriesMap[photoIndex].push(category);
        });
    });

    imagePreviewContainer.innerHTML = uploadedPhotos.map((photo, index) => {
        const assignedCategories = photoToCategoriesMap[index] || [];

        // Create numbered badges for each assigned category
        const badges = assignedCategories.map(category => {
            const categoryNum = getCategoryNumber(category);
            return `<div class="photo-number-badge category-${category}" title="${category}">${categoryNum}</div>`;
        }).join('');

        // Display intelligent room name if available, otherwise show filename
        const displayName = photo.room_name || photo.name;
        const roomBadge = photo.room_name ? `<span style="display: inline-block; background: #C20430; color: white; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.75rem; margin-right: 0.25rem;">🏠</span>` : '';

        return `
            <div class="photo-preview image-preview-item ${window.selectedPhotoIndex === index ? 'selected' : ''}" data-index="${index}" onclick="selectPhoto(${index})">
                ${badges}
                <img src="${photo.dataUrl}" alt="${displayName}">
                <button class="photo-remove" onclick="removePhoto(${index}); event.stopPropagation();" type="button">×</button>
                <div class="photo-name">${roomBadge}${displayName}</div>
            </div>
        `;
    }).join('');

    // Update photo count
    const photoCountBadge = document.getElementById('photoCountBadge');
    if (photoCountBadge) {
        photoCountBadge.textContent = `${uploadedPhotos.length} photos uploaded`;
    }

    // Bug #52 fix: photoAssignmentSection removed - no longer needed with AI auto-categorization
    const currentMode = window.currentMode || sessionStorage.getItem('selectedMode');
    console.log('📸 Photo display update - Mode:', currentMode, ', Photos:', uploadedPhotos.length);

    // Auto-analyze photos and detect features
    if (uploadedPhotos.length > 0) {
        simulatePhotoAnalysis();
    }

    // Enable cover photo selection buttons
    if (typeof window.enableCoverPhotoSelection === 'function') {
        setTimeout(() => window.enableCoverPhotoSelection(), 100);
    }
}

function selectPhoto(index) {
    window.selectedPhotoIndex = index;

    // Update visual selection
    document.querySelectorAll('.photo-preview').forEach((preview, i) => {
        if (i === index) {
            preview.classList.add('selected');
        } else {
            preview.classList.remove('selected');
        }
    });

    // Highlight categories where this photo can be added
    document.querySelectorAll('.category-section').forEach(section => {
        section.style.borderColor = '#2C5F7C';
        section.style.boxShadow = '0 0 0 3px rgba(44, 95, 124, 0.15)';
        section.style.background = '#f0f7fc';
    });
}

function assignSelectedPhotoToCategory(category) {
    if (window.selectedPhotoIndex === null) {
        showToast('info', 'Please select a photo first');
        return;
    }

    // Check if photo is already in this category
    if (window.photoCategoryAssignments[category].includes(window.selectedPhotoIndex)) {
        showToast('info', 'Photo already assigned to this category');
        return;
    }

    // Cover photo can only have 1 photo
    if (category === 'cover' && window.photoCategoryAssignments[category].length >= 1) {
        showToast('warning', 'Cover category can only have 1 photo. Remove the existing one first.');
        return;
    }

    // Add photo to category
    window.photoCategoryAssignments[category].push(window.selectedPhotoIndex);

    // Update category display
    updateCategoryDisplay();

    // Update progress tracker
    updateProgressTracker();

    // Update completion tracker
    updateCompletionTracker();

    // Trigger auto-detection of features after assignment
    analyzePhotosForFeatures();

    // Refresh photo previews to show updated badges
    displayPhotoPreviews();

    // Clear selection
    window.selectedPhotoIndex = null;

    // Reset category borders
    document.querySelectorAll('.category-section').forEach(section => {
        section.style.borderColor = '#e1e8ed';
        section.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
        section.style.background = '#ffffff';
    });

    showToast('success', `Added to ${category.charAt(0).toUpperCase() + category.slice(1)}`);
}

function removePhotoFromCategory(category, photoIndex) {
    const index = window.photoCategoryAssignments[category].indexOf(photoIndex);
    if (index > -1) {
        window.photoCategoryAssignments[category].splice(index, 1);
    }

    updateCategoryDisplay();
    updateProgressTracker();
    updateCompletionTracker();
    displayPhotoPreviews();

    showToast('info', 'Photo removed from category');
}

function updateCategoryDisplay() {
    // Use categoryOrder instead of hardcoded array
    const categoryGrid = document.querySelector('.category-assignment-grid');
    if (!categoryGrid) return;

    // Clear and rebuild in the correct order
    categoryGrid.innerHTML = '';

    categoryOrder.forEach((category, orderIndex) => {
        // Create category section dynamically
        const categoryInfo = {
            cover: { icon: '1️⃣', title: 'Cover Photo', desc: 'Main hero image (1 required)' },
            exterior: { icon: '2️⃣', title: 'Exterior', desc: 'Front, street view, parking (3+ rec.)' },
            interior: { icon: '3️⃣', title: 'Interior', desc: 'Hallway, living areas, reception (3+ rec.)' },
            kitchen: { icon: '4️⃣', title: 'Kitchen', desc: 'Kitchen & dining spaces (2+ rec.)' },
            bedrooms: { icon: '5️⃣', title: 'Bedrooms', desc: 'All bedrooms & wardrobes (3+ rec.)' },
            bathrooms: { icon: '6️⃣', title: 'Bathrooms', desc: 'Bathrooms & ensuites (2+ rec.)' },
            garden: { icon: '7️⃣', title: 'Garden', desc: 'Garden, patio, outdoor spaces (3+ rec.)' }
        };

        const info = categoryInfo[category];
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'category-section';
        sectionDiv.setAttribute('data-category', category);
        sectionDiv.setAttribute('data-order-index', orderIndex);
        sectionDiv.draggable = true;
        sectionDiv.style.cssText = 'cursor: move; background: #ffffff; border-radius: 8px; padding: 1rem; border: 2px solid #e1e8ed; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.05);';

        sectionDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <div style="flex: 1; cursor: pointer;" onclick="assignSelectedPhotoToCategory('${category}')">
                    <div style="color: #2C5F7C; font-weight: bold; font-size: 1.1rem;">${info.icon} ${info.title}</div>
                    <div style="color: #6c757d; font-size: 0.85rem;">${info.desc}</div>
                </div>
                <div class="category-count" id="${category}-count" style="background: #f8f9fa; padding: 0.25rem 0.75rem; border-radius: 12px; color: #6c757d; font-weight: bold; font-size: 0.9rem; border: 1px solid #e1e8ed;">0</div>
            </div>
            <div class="category-photos" id="${category}-photos" style="display: flex; flex-wrap: wrap; gap: 0.5rem; min-height: 80px; background: #f8f9fa; border-radius: 4px; padding: 0.5rem; border: 1px dashed #d1d8dd; pointer-events: none;">
                <div style="color: #6c757d; font-size: 0.85rem; width: 100%; text-align: center; padding: 1rem;">Click to add ${category} photos</div>
            </div>
        `;

        categoryGrid.appendChild(sectionDiv);
    });

    // Now update each category's content
    categoryOrder.forEach(category => {
        const container = document.getElementById(`${category}-photos`);
        const countBadge = document.getElementById(`${category}-count`);

        if (!container) return;

        const photos = window.photoCategoryAssignments[category];
        const count = photos.length;

        // Update count badge
        if (countBadge) {
            countBadge.textContent = count;
            countBadge.style.color = count > 0 ? '#2C5F7C' : '#666';
            countBadge.style.background = count > 0 ? '#E5A844' : '#333';
        }

        // Update photo thumbnails
        if (photos.length === 0) {
            container.innerHTML = `<div style="color: #666; font-size: 0.85rem; width: 100%; text-align: center; padding: 1rem;">Click to add ${category} photos</div>`;
        } else {
            container.innerHTML = photos.map((photoIndex, arrayIndex) => {
                const photo = window.uploadedPhotos[photoIndex];
                if (!photo) return '';

                return `
                    <div draggable="true"
                         data-category="${category}"
                         data-photo-index="${photoIndex}"
                         data-array-index="${arrayIndex}"
                         class="draggable-photo"
                         style="position: relative; width: 80px; height: 80px; border-radius: 4px; overflow: hidden; border: 2px solid #2C5F7C; cursor: grab;">
                        <img src="${photo.dataUrl}" style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;">
                        <button onclick="removePhotoFromCategory('${category}', ${photoIndex}); event.stopPropagation();"
                                style="position: absolute; top: 2px; right: 2px; background: #dc3545; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; line-height: 1; z-index: 10;">×</button>
                    </div>
                `;
            }).join('');

            // Add drag-and-drop event listeners to newly created elements
            setupDragAndDrop(category);
            // Re-enable pointer events on photos after setup
            container.style.pointerEvents = 'auto';
        }
    });

    // Setup category-level drag-and-drop
    setupCategoryDragAndDrop();

    // Update progress tracker after all categories are updated
    if (typeof updateProgress === 'function') {
        setTimeout(updateProgress, 100); // Small delay to ensure DOM is updated
    }
}

// Drag-and-Drop functionality for photo reordering
let draggedElement = null;
let draggedFromCategory = null;
let draggedPhotoIndex = null;
let draggedArrayIndex = null;

function setupDragAndDrop(category) {
    const container = document.getElementById(`${category}-photos`);
    if (!container) return;

    const draggables = container.querySelectorAll('.draggable-photo');

    draggables.forEach(draggable => {
        // Drag start
        draggable.addEventListener('dragstart', function(e) {
            draggedElement = this;
            draggedFromCategory = this.getAttribute('data-category');
            draggedPhotoIndex = parseInt(this.getAttribute('data-photo-index'));
            draggedArrayIndex = parseInt(this.getAttribute('data-array-index'));

            this.style.opacity = '0.4';
            this.style.cursor = 'grabbing';
            e.dataTransfer.effectAllowed = 'move';
        });

        // Drag end
        draggable.addEventListener('dragend', function(e) {
            this.style.opacity = '1';
            this.style.cursor = 'grab';

            // Remove all drag-over styling
            document.querySelectorAll('.draggable-photo').forEach(el => {
                el.style.border = '2px solid #2C5F7C';
            });
        });

        // Drag over
        draggable.addEventListener('dragover', function(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.dataTransfer.dropEffect = 'move';

            // Only show drop indicator if dragging within same category
            if (draggedFromCategory === this.getAttribute('data-category')) {
                this.style.border = '2px dashed #E5A844';
            }

            return false;
        });

        // Drag enter
        draggable.addEventListener('dragenter', function(e) {
            if (draggedFromCategory === this.getAttribute('data-category')) {
                this.style.border = '2px dashed #E5A844';
            }
        });

        // Drag leave
        draggable.addEventListener('dragleave', function(e) {
            this.style.border = '2px solid #2C5F7C';
        });

        // Drop
        draggable.addEventListener('drop', function(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }

            const dropCategory = this.getAttribute('data-category');
            const dropArrayIndex = parseInt(this.getAttribute('data-array-index'));

            // Same category - reorder
            if (draggedFromCategory === dropCategory && draggedArrayIndex !== dropArrayIndex) {
                // Remove from old position
                const photoIndex = window.photoCategoryAssignments[dropCategory].splice(draggedArrayIndex, 1)[0];
                // Insert at new position
                window.photoCategoryAssignments[dropCategory].splice(dropArrayIndex, 0, photoIndex);

                updateCategoryDisplay();
                showToast('success', 'Photo reordered');
            }
            // Different category - move photo
            else if (draggedFromCategory !== dropCategory) {
                // Check cover photo limit
                if (dropCategory === 'cover' && window.photoCategoryAssignments[dropCategory].length >= 1) {
                    showToast('warning', 'Cover category can only have 1 photo');
                    return false;
                }

                // Remove from old category
                window.photoCategoryAssignments[draggedFromCategory].splice(draggedArrayIndex, 1);
                // Add to new category at drop position
                window.photoCategoryAssignments[dropCategory].splice(dropArrayIndex, 0, draggedPhotoIndex);

                updateCategoryDisplay();
                updateProgressTracker();
                showToast('success', `Moved to ${dropCategory}`);
            }

            return false;
        });
    });

    // Also add drop zone to the container itself (for dropping into empty categories)
    container.addEventListener('dragover', function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        this.style.background = '#f0f7fc';
        return false;
    });

    container.addEventListener('dragleave', function(e) {
        this.style.background = '#f8f9fa';
    });

    container.addEventListener('drop', function(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        this.style.background = '#f8f9fa';

        // Get the category from the container's parent
        const dropCategory = this.id.replace('-photos', '');

        // Check if trying to drop into same category (do nothing)
        if (draggedFromCategory === dropCategory) {
            return false;
        }

        // Check cover photo limit
        if (dropCategory === 'cover' && window.photoCategoryAssignments[dropCategory].length >= 1) {
            showToast('warning', 'Cover category can only have 1 photo');
            return false;
        }

        // Remove from old category
        window.photoCategoryAssignments[draggedFromCategory].splice(draggedArrayIndex, 1);
        // Add to new category at the end
        window.photoCategoryAssignments[dropCategory].push(draggedPhotoIndex);

        updateCategoryDisplay();
        updateProgressTracker();
        showToast('success', `Moved to ${dropCategory}`);

        return false;
    });
}

// Category-level drag-and-drop for reordering categories
let draggedCategoryElement = null;
let draggedCategoryIndex = null;

function setupCategoryDragAndDrop() {
    const categorySections = document.querySelectorAll('.category-section');

    categorySections.forEach(section => {
        // Drag start
        section.addEventListener('dragstart', function(e) {
            // Only allow dragging from the header area, not the photos area
            if (e.target.closest('.category-photos') || e.target.closest('.draggable-photo')) {
                e.preventDefault();
                return;
            }

            draggedCategoryElement = this;
            draggedCategoryIndex = parseInt(this.getAttribute('data-order-index'));

            this.style.opacity = '0.4';
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
        });

        // Drag end
        section.addEventListener('dragend', function(e) {
            this.style.opacity = '1';

            // Remove all drag-over styling
            document.querySelectorAll('.category-section').forEach(el => {
                el.style.border = '2px solid #e1e8ed';
            });
        });

        // Drag over
        section.addEventListener('dragover', function(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }

            // Don't allow dropping on photo areas
            if (e.target.closest('.category-photos') || e.target.closest('.draggable-photo')) {
                return false;
            }

            e.dataTransfer.dropEffect = 'move';
            this.style.border = '2px dashed #E5A844';

            return false;
        });

        // Drag enter
        section.addEventListener('dragenter', function(e) {
            if (!e.target.closest('.category-photos') && !e.target.closest('.draggable-photo')) {
                this.style.border = '2px dashed #E5A844';
            }
        });

        // Drag leave
        section.addEventListener('dragleave', function(e) {
            this.style.border = '2px solid #e1e8ed';
        });

        // Drop
        section.addEventListener('drop', function(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }

            // Don't allow dropping on photo areas
            if (e.target.closest('.category-photos') || e.target.closest('.draggable-photo')) {
                return false;
            }

            const dropIndex = parseInt(this.getAttribute('data-order-index'));

            if (draggedCategoryIndex !== dropIndex) {
                // Remove from old position
                const category = categoryOrder.splice(draggedCategoryIndex, 1)[0];
                // Insert at new position
                categoryOrder.splice(dropIndex, 0, category);

                // Update display
                updateCategoryDisplay();
                showToast('success', 'Category order updated');
            }

            return false;
        });
    });
}

function updateProgressTracker() {
    // Calculate total assigned photos
    let totalAssigned = 0;
    Object.values(photoCategoryAssignments).forEach(photos => {
        totalAssigned += photos.length;
    });

    const minRequired = 15; // Minimum photos for luxury brochure
    const percentage = Math.min(100, Math.round((totalAssigned / minRequired) * 100));

    // Update progress bar
    const progressBar = document.getElementById('photoProgressBar');
    const progressText = document.getElementById('photoProgressText');
    const progressPercent = document.getElementById('photoProgressPercent');

    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${totalAssigned} photos assigned`;
    if (progressPercent) progressPercent.textContent = `${percentage}%`;

    // Update requirements
    updateRequirement('req-cover', window.photoCategoryAssignments.cover.length >= 1);
    updateRequirement('req-exterior', window.photoCategoryAssignments.exterior.length >= 3);
    updateRequirement('req-interior', window.photoCategoryAssignments.interior.length >= 3);
    updateRequirement('req-min', totalAssigned >= 8);
}

function updateRequirement(id, met) {
    const element = document.getElementById(id);
    if (!element) return;

    if (met) {
        element.classList.add('met');
        element.textContent = element.textContent.replace('✗', '✓');
    } else {
        element.classList.remove('met');
        element.textContent = element.textContent.replace('✓', '✗');
    }
}

// Legacy function - now using analyzePhotosForFeatures()
function simulatePhotoAnalysis() {
    // Deprecated - call analyzePhotosForFeatures() instead
    analyzePhotosForFeatures();
}

// ============================================
// Floor Plan & Branding Upload (Brochure Back Page)
// ============================================

// Floorplan is stored in window.floorplanFile (set in handleFloorPlanFile)
let agencyLogoFile = null;
let agentPhotoFile = null;

document.addEventListener('DOMContentLoaded', () => {
    initFloorPlanUpload();
    initLogoUpload();
    initAgentPhotoUpload();
    initFloorplanUpload();
    initEPCUpload();
});

function initFloorPlanUpload() {
    const uploadZone = document.getElementById('floorPlanUploadZone');
    const fileInput = document.getElementById('floorPlanInput');
    const preview = document.getElementById('floorPlanPreview');

    if (!uploadZone || !fileInput) return;

    // Click to upload
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFloorPlanFile(e.target.files[0]);
    });

    // Drag & drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#2C5F7C';
        uploadZone.style.background = 'rgba(44, 95, 124, 0.05)';
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = '#555';
        uploadZone.style.background = '#444';
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#555';
        uploadZone.style.background = '#444';
        handleFloorPlanFile(e.dataTransfer.files[0]);
    });
}

function handleFloorPlanFile(file) {
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    if (!allowedTypes.includes(file.type)) {
        showToast('error', 'Please upload JPG, PNG, or PDF only');
        return;
    }

    if (file.size > maxSize) {
        showToast('error', 'Floor plan must be under 10MB');
        return;
    }

    window.floorplanFile = file;

    // Hide upload zone immediately to prevent flickering
    document.getElementById('floorPlanUploadZone').style.display = 'none';

    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('floorPlanPreview');

        if (file.type === 'application/pdf') {
            preview.innerHTML = `
                <div style="text-align: center; padding: 1.5rem; background: #e8f5e9; border: 2px solid #28a745; border-radius: 8px; position: relative;">
                    <div style="position: absolute; top: 10px; right: 10px; background: #28a745; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">✓</div>
                    <div style="font-size: 3rem;">📄</div>
                    <div style="color: #28a745; font-weight: bold; margin-top: 0.5rem;">✅ Floor Plan Uploaded</div>
                    <div style="color: #666; font-size: 0.9rem; margin-top: 0.25rem;">${file.name}</div>
                    <div style="color: #999; font-size: 0.85rem;">${(file.size / 1024).toFixed(1)} KB</div>
                    <button onclick="removeFloorPlan()" style="margin-top: 1rem; background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: bold;">✕ Remove</button>
                </div>
            `;
        } else {
            preview.innerHTML = `
                <div style="padding: 1rem; background: #e8f5e9; border: 2px solid #28a745; border-radius: 8px; position: relative;">
                    <div style="position: absolute; top: 10px; right: 10px; background: #28a745; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; z-index: 10;">✓</div>
                    <div style="color: #28a745; font-weight: bold; margin-bottom: 0.5rem; text-align: center;">✅ Floor Plan Uploaded</div>
                    <img src="${e.target.result}" style="max-width: 100%; max-height: 300px; border-radius: 4px; display: block; margin: 0 auto;">
                    <button onclick="removeFloorPlan()" style="margin-top: 1rem; background: #dc3545; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: bold; display: block; margin-left: auto; margin-right: auto;">✕ Remove</button>
                </div>
            `;
        }

        preview.style.display = 'block';
        // Upload zone already hidden at start of function

        showToast('success', 'Floor plan uploaded');

        // Update page 8 card preview
        updateFloorPlanCardPreview();
    };

    reader.readAsDataURL(file);
}

function removeFloorPlan() {
    window.floorplanFile = null;
    document.getElementById('floorPlanPreview').style.display = 'none';
    document.getElementById('floorPlanPreview').innerHTML = '';
    document.getElementById('floorPlanUploadZone').style.display = 'flex';
    document.getElementById('floorPlanInput').value = '';

    // Update progress tracker when floor plan is removed
    if (typeof updateProgress === 'function') {
        updateProgress();
    }

    // Clear page 8 card preview
    const thumbnail = document.getElementById('page-8-thumb');
    const pageCard = document.querySelector('.page-card[data-page="8"]');
    if (thumbnail) {
        thumbnail.innerHTML = '';
        thumbnail.classList.remove('has-photo');
    }
    if (pageCard) {
        pageCard.classList.remove('assigned');
    }

    showToast('info', 'Floor plan removed');
}

function initLogoUpload() {
    const uploadZone = document.getElementById('logoUploadZone');
    const fileInput = document.getElementById('logoInput');
    const preview = document.getElementById('logoPreview');

    if (!uploadZone || !fileInput) return;

    // Click to upload
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        handleLogoFile(e.target.files[0]);
    });

    // Drag & drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#2C5F7C';
        uploadZone.style.background = 'rgba(44, 95, 124, 0.05)';
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = '#555';
        uploadZone.style.background = '#444';
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#555';
        uploadZone.style.background = '#444';
        handleLogoFile(e.dataTransfer.files[0]);
    });
}

function handleLogoFile(file) {
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/png', 'image/svg+xml', 'image/jpeg'];

    if (!allowedTypes.includes(file.type)) {
        showToast('error', 'Please upload PNG, SVG, or JPG only');
        return;
    }

    if (file.size > maxSize) {
        showToast('error', 'Logo must be under 5MB');
        return;
    }

    agencyLogoFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('logoPreview');
        preview.innerHTML = `
            <img src="${e.target.result}" style="max-width: 300px; max-height: 150px; object-fit: contain;">
            <button onclick="removeLogo()" style="margin-top: 0.5rem; background: #2C5F7C; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Remove</button>
        `;
        preview.style.display = 'block';
        document.getElementById('logoUploadZone').style.display = 'none';

        showToast('success', 'Agency logo uploaded');
    };
    reader.readAsDataURL(file);
}

function removeLogo() {
    agencyLogoFile = null;
    document.getElementById('logoPreview').style.display = 'none';
    document.getElementById('logoPreview').innerHTML = '';
    document.getElementById('logoUploadZone').style.display = 'flex';
    document.getElementById('logoInput').value = '';
    showToast('info', 'Logo removed');
}

function initAgentPhotoUpload() {
    const uploadZone = document.getElementById('agentPhotoZone');
    const fileInput = document.getElementById('agentPhotoInput');
    const preview = document.getElementById('agentPhotoPreview');

    if (!uploadZone || !fileInput) return;

    // Click to upload
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        handleAgentPhotoFile(e.target.files[0]);
    });

    // Drag & drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#2C5F7C';
        uploadZone.style.background = 'rgba(44, 95, 124, 0.05)';
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = '#555';
        uploadZone.style.background = '#444';
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#555';
        uploadZone.style.background = '#444';
        handleAgentPhotoFile(e.dataTransfer.files[0]);
    });
}

function handleAgentPhotoFile(file) {
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
        showToast('error', 'Please upload JPG or PNG only');
        return;
    }

    if (file.size > maxSize) {
        showToast('error', 'Photo must be under 5MB');
        return;
    }

    agentPhotoFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('agentPhotoPreview');
        preview.innerHTML = `
            <img src="${e.target.result}" style="max-width: 200px; max-height: 200px; border-radius: 50%; object-fit: cover;">
            <button onclick="removeAgentPhoto()" style="margin-top: 0.5rem; background: #2C5F7C; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;">Remove</button>
        `;
        preview.style.display = 'block';
        document.getElementById('agentPhotoZone').style.display = 'none';

        showToast('success', 'Agent photo uploaded');
    };
    reader.readAsDataURL(file);
}

function removeAgentPhoto() {
    agentPhotoFile = null;
    document.getElementById('agentPhotoPreview').style.display = 'none';
    document.getElementById('agentPhotoPreview').innerHTML = '';
    document.getElementById('agentPhotoZone').style.display = 'flex';
    document.getElementById('agentPhotoInput').value = '';
    showToast('info', 'Agent photo removed');
}

// ============================================
// Floorplan Upload
// ============================================

let floorplanFile = null;

function initFloorplanUpload() {
    const uploadZone = document.getElementById('floorplanZone');
    const fileInput = document.getElementById('floorplanInput');
    const preview = document.getElementById('floorplanPreview');

    if (!uploadZone || !fileInput) return;

    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFloorplanUpload(file);
        }
    });
}

function handleFloorplanUpload(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        showToast('error', 'Floorplan must be under 5MB');
        return;
    }

    floorplanFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('floorplanPreview');
        preview.style.display = 'block';

        if (file.type === 'application/pdf') {
            preview.innerHTML = `
                <div style="position: relative; background: #f0f7fc; padding: 1rem; border: 2px solid #2C5F7C; border-radius: 8px; display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 2rem;">📄</span>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: #2C5F7C;">${file.name}</div>
                        <div style="font-size: 0.85rem; color: #666;">${(file.size / 1024).toFixed(1)} KB</div>
                    </div>
                    <button onclick="removeFloorplan()" style="background: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: 600;">Remove</button>
                </div>
            `;
        } else {
            preview.innerHTML = `
                <div style="position: relative;">
                    <img src="${e.target.result}" style="max-width: 100%; border-radius: 8px; border: 2px solid #2C5F7C;">
                    <button onclick="removeFloorplan()" style="position: absolute; top: 1rem; right: 1rem; background: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: 600;">Remove</button>
                </div>
            `;
        }

        document.getElementById('floorplanZone').style.display = 'none';
        showToast('success', 'Floorplan uploaded');
    };
    reader.readAsDataURL(file);
}

function removeFloorplan() {
    floorplanFile = null;
    document.getElementById('floorplanPreview').style.display = 'none';
    document.getElementById('floorplanPreview').innerHTML = '';
    document.getElementById('floorplanZone').style.display = 'flex';
    document.getElementById('floorplanInput').value = '';
    showToast('info', 'Floorplan removed');
}

// ============================================
// EPC Certificate Upload
// ============================================

let epcFile = null;

function initEPCUpload() {
    const uploadZone = document.getElementById('epcZone');
    const fileInput = document.getElementById('epcInput');
    const preview = document.getElementById('epcPreview');

    if (!uploadZone || !fileInput) return;

    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleEPCUpload(file);
        }
    });
}

function handleEPCUpload(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        showToast('error', 'EPC certificate must be under 5MB');
        return;
    }

    epcFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('epcPreview');
        preview.style.display = 'block';

        if (file.type === 'application/pdf') {
            preview.innerHTML = `
                <div style="position: relative; background: #f0f7fc; padding: 1rem; border: 2px solid #2C5F7C; border-radius: 8px; display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 2rem;">📄</span>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: #2C5F7C;">${file.name}</div>
                        <div style="font-size: 0.85rem; color: #666;">${(file.size / 1024).toFixed(1)} KB</div>
                    </div>
                    <button onclick="removeEPC()" style="background: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: 600;">Remove</button>
                </div>
            `;
        } else {
            preview.innerHTML = `
                <div style="position: relative;">
                    <img src="${e.target.result}" style="max-width: 100%; border-radius: 8px; border: 2px solid #2C5F7C;">
                    <button onclick="removeEPC()" style="position: absolute; top: 1rem; right: 1rem; background: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: 600;">Remove</button>
                </div>
            `;
        }

        document.getElementById('epcZone').style.display = 'none';
        showToast('success', 'EPC certificate uploaded');
    };
    reader.readAsDataURL(file);
}

function removeEPC() {
    epcFile = null;
    document.getElementById('epcPreview').style.display = 'none';
    document.getElementById('epcPreview').innerHTML = '';
    document.getElementById('epcZone').style.display = 'flex';
    document.getElementById('epcInput').value = '';
    showToast('info', 'EPC certificate removed');
}

// ============================================
// Floor Plan Card Click Handler (Page 8)
// ============================================

function handleFloorPlanCardClick() {
    // Show the floor plan upload section
    const uploadSection = document.getElementById('floorPlanUploadSection');
    if (uploadSection) {
        uploadSection.style.display = 'block';

        // Scroll to the upload section
        setTimeout(() => {
            uploadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);

        // Trigger file input if no floor plan uploaded yet
        if (!window.floorplanFile) {
            showToast('info', 'Upload a floor plan for Page 8 (optional)');
        }
    }
}

// Update floor plan preview in page 8 card when uploaded
function updateFloorPlanCardPreview() {
    const pageCard = document.querySelector('.page-card[data-page="8"]');
    const thumbnail = document.getElementById('page-8-thumb');

    if (window.floorplanFile && thumbnail) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (window.floorplanFile.type === 'application/pdf') {
                thumbnail.innerHTML = `<div style="padding: 1rem; text-align: center;"><div style="font-size: 2rem;">📄</div><div style="font-size: 0.8rem; color: #28a745;">Floor Plan PDF</div></div>`;
            } else {
                thumbnail.innerHTML = `<img src="${e.target.result}" alt="Floor Plan">`;
            }
            thumbnail.classList.add('has-photo');
        };
        reader.readAsDataURL(window.floorplanFile);

        if (pageCard) {
            pageCard.classList.add('assigned');
        }
    }
}

// ============================================
// Keyboard Shortcuts for Photo Assignment
// ============================================

document.addEventListener('keydown', (e) => {
    // Only activate keyboard shortcuts when in brochure mode and photos are uploaded
    const currentMode = window.currentMode || sessionStorage.getItem('selectedMode');
    if (currentMode !== 'brochure' || uploadedPhotos.length === 0) return;

    // Check if user is typing in an input field
    const activeElement = document.activeElement;
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'SELECT') {
        return; // Don't trigger shortcuts when typing in form fields
    }

    // Keys 1-7 assign selected photo to corresponding category
    const key = e.key;
    const categoryMap = {
        '1': 'cover',
        '2': 'exterior',
        '3': 'interior',
        '4': 'kitchen',
        '5': 'bedrooms',
        '6': 'bathrooms',
        '7': 'garden'
    };

    if (categoryMap[key]) {
        e.preventDefault();
        assignSelectedPhotoToCategory(categoryMap[key]);
    }
});

// ============================================
// Completion Tracker & Gamification System
// ============================================

function updateCompletionTracker() {
    let totalScore = 0;
    const maxScore = 100;

    // No base score - start at 0%

    // Required steps - Category-based system
    const photosUploaded = window.uploadedPhotos && window.uploadedPhotos.length >= 1;  // Accept 1+ photos for upload
    if (photosUploaded) totalScore += 15;

    // Check if minimum photos assigned to categories
    let totalAssigned = 0;
    Object.values(photoCategoryAssignments).forEach(photos => {
        totalAssigned += photos.length;
    });
    const photosAssigned = totalAssigned >= 7;  // Minimum 7 assigned (relaxed from 15 for testing)
    if (photosAssigned) totalScore += 15;

    // Check if bedroom/bathroom checkboxes are selected
    const checkedFeaturesArray = Array.from(document.querySelectorAll('input[name="features"]:checked'));
    const bedroomsEntered = checkedFeaturesArray.some(cb => cb.value.includes('bedroom'));
    if (bedroomsEntered) totalScore += 10;

    const bathroomsEntered = checkedFeaturesArray.some(cb => cb.value.includes('bathroom') || cb.value.includes('wc'));
    if (bathroomsEntered) totalScore += 10;

    const locationEntered = document.getElementById('address')?.value.trim().length > 0;
    if (locationEntered) totalScore += 10;

    // Optional boosters
    const hasFloorPlan = window.propertyFloorPlan !== null;
    if (hasFloorPlan) totalScore += 10;

    const hasSize = document.getElementById('sizeSqft')?.value.trim().length > 0;
    if (hasSize) totalScore += 5;

    const checkedFeatures = document.querySelectorAll('input[name="features"]:checked').length;
    if (checkedFeatures >= 5) totalScore += 20;  // Increased from 15 to 20 (removed branding's 5%)

    // Cap at 100%
    totalScore = Math.min(totalScore, maxScore);

    // Update visual elements
    updateTrackerUI(totalScore, {
        photosUploaded,
        photosAssigned,
        bedroomsEntered,  // Changed to match actual variable name
        bathroomsEntered,  // Changed to match actual variable name
        locationEntered,
        hasFloorPlan,
        hasSize,
        hasFeatures: checkedFeatures >= 5
    });
}

function updateTrackerUI(percentage, completionStates) {
    // Update percentage text
    const percentageEl = document.getElementById('completionPercentage');
    if (percentageEl) percentageEl.textContent = `${percentage}%`;

    // Update progress ring (navy blue only)
    const ring = document.getElementById('progressRing');
    if (ring) {
        const circumference = 339.292;
        const offset = circumference - (percentage / 100) * circumference;
        ring.style.strokeDashoffset = offset;
        ring.setAttribute('stroke', '#2C5F7C'); // Navy blue (brand color)
    }

    // Update brick center animation
    const brickCenter = document.getElementById('brickCenter');
    if (brickCenter) {
        const bricks = brickCenter.querySelectorAll('.brick');
        const bricksToShow = Math.floor((percentage / 100) * bricks.length);

        // Show brick container when progress > 0
        if (percentage > 15) {
            brickCenter.style.opacity = '1';
        } else {
            brickCenter.style.opacity = '0';
        }

        // Animate bricks appearing
        bricks.forEach((brick, index) => {
            if (index < bricksToShow) {
                setTimeout(() => {
                    brick.setAttribute('opacity', '1');
                }, index * 20); // Stagger animation
            } else {
                brick.setAttribute('opacity', '0');
            }
        });
    }

    // Update quality tier
    const tierEl = document.getElementById('qualityTier');
    if (tierEl) {
        if (percentage >= 90) {
            tierEl.textContent = '🏆 Luxury Listing';
            tierEl.style.color = '#28a745';
        } else if (percentage >= 80) {
            tierEl.textContent = '💎 Premium Listing';
            tierEl.style.color = '#FFA500';
        } else if (percentage >= 70) {
            tierEl.textContent = '⭐ Professional Listing';
            tierEl.style.color = '#2C5F7C';
        } else if (percentage >= 30) {
            tierEl.textContent = 'Good Progress';
            tierEl.style.color = '#666';
        } else {
            tierEl.textContent = 'Getting Started';
            tierEl.style.color = '#999';
        }
    }

    // Estimate time remaining (realistic calculation)
    const timeEl = document.getElementById('timeRemaining');
    if (timeEl) {
        if (percentage >= 90) {
            timeEl.textContent = 'Ready!';
        } else if (percentage >= 70) {
            timeEl.textContent = '~5-10 min';
        } else if (percentage >= 40) {
            timeEl.textContent = '~10-15 min';
        } else {
            timeEl.textContent = '~15-20 min';
        }
    }

    // Update required checklist
    updateTrackerItem('req-photos-uploaded', completionStates.photosUploaded);
    updateTrackerItem('req-photos-assigned', completionStates.photosAssigned);
    updateTrackerItem('req-bedrooms', completionStates.bedroomsEntered);  // Fixed variable name
    updateTrackerItem('req-bathrooms', completionStates.bathroomsEntered);  // Fixed variable name
    updateTrackerItem('req-location', completionStates.locationEntered);

    // Update optional boosters
    updateTrackerItem('boost-floorplan', completionStates.hasFloorPlan);
    updateTrackerItem('boost-size', completionStates.hasSize);
    updateTrackerItem('boost-features', completionStates.hasFeatures);
    // Removed branding - not offered yet

    // Show achievement badge at 85%+
    const achievementBadge = document.getElementById('achievementBadge');
    if (achievementBadge) {
        if (percentage >= 85 && achievementBadge.style.display === 'none') {
            achievementBadge.style.display = 'block';
            // Show celebration toast with animation
            showAchievementToast('🏆 Premium Listing Unlocked!', 'Your listing will stand out with professional quality.');
        } else if (percentage < 85) {
            achievementBadge.style.display = 'none';
        }
    }

    // Update generate button state
    updateGenerateButtonState();

    // Update section badges
    updateSectionBadges();

    // Save progress to localStorage
    saveDraftProgress();
}

function updateTrackerItem(itemId, isComplete) {
    const item = document.getElementById(itemId);
    if (!item) return;

    const icon = item.querySelector('.tracker-icon');
    if (icon) {
        icon.textContent = isComplete ? '✅' : '⚪';
    }

    if (isComplete) {
        item.style.color = '#28a745';
        item.style.fontWeight = 'bold';
    } else {
        item.style.color = '';
        item.style.fontWeight = '';
    }
}

// Listen for changes to update tracker
document.addEventListener('DOMContentLoaded', () => {
    // Update tracker when photos change
    const imageInput = document.getElementById('imageInput');
    if (imageInput) {
        imageInput.addEventListener('change', () => {
            setTimeout(() => updateCompletionTracker(), 500);
        });
    }

    // Update tracker when features change (including bedrooms/bathrooms)
    document.addEventListener('change', (e) => {
        if (e.target.name === 'features' ||
            e.target.id === 'address' ||
            e.target.id === 'sizeSqft' ||
            e.target.id === 'agencyName' ||
            e.target.id === 'agencyEmail' ||
            e.target.id === 'agencyPhone') {
            updateCompletionTracker();
        }
    });

    // Update tracker on any input changes (real-time)
    document.addEventListener('input', (e) => {
        if (e.target.id === 'address' ||
            e.target.id === 'sizeSqft' ||
            e.target.id === 'agencyName') {
            // Debounce to avoid too many updates
            clearTimeout(window.trackerDebounce);
            window.trackerDebounce = setTimeout(() => updateCompletionTracker(), 300);
        }
    });

    // Update tracker when floor plan or branding added
    const floorPlanInput = document.getElementById('floorPlanInput');
    if (floorPlanInput) {
        floorPlanInput.addEventListener('change', () => {
            setTimeout(() => updateCompletionTracker(), 500);
        });
    }

    const logoInput = document.getElementById('logoInput');
    if (logoInput) {
        logoInput.addEventListener('change', () => {
            setTimeout(() => updateCompletionTracker(), 500);
        });
    }

    const agentPhotoInput = document.getElementById('agentPhotoInput');
    if (agentPhotoInput) {
        agentPhotoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                window.agentPhotoFile = file;

                // Show preview
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('agentPhotoPreview');
                    if (preview) {
                        preview.innerHTML = `
                            <img src="${event.target.result}" style="max-width: 200px; max-height: 200px; border-radius: 50%; object-fit: cover;">
                        `;
                        preview.style.display = 'block';

                        const prompt = document.getElementById('agentPhotoPrompt');
                        if (prompt) prompt.style.display = 'none';
                    }
                };
                reader.readAsDataURL(file);
            }
            setTimeout(() => updateCompletionTracker(), 500);
        });
    }

    // Floor plan upload handler
    const floorplanInput = document.getElementById('floorplanInput');
    if (floorplanInput) {
        floorplanInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                window.floorplanFile = file;

                // Show preview
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('floorplanPreview');
                    if (preview) {
                        preview.innerHTML = `
                            <img src="${event.target.result}" style="max-width: 100%; max-height: 300px; object-fit: contain;">
                            <p style="color: #28a745; margin-top: 0.5rem;">✓ Floor plan uploaded</p>
                        `;
                        preview.style.display = 'block';

                        const prompt = document.getElementById('floorplanPrompt');
                        if (prompt) prompt.style.display = 'none';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // EPC upload handler
    const epcInput = document.getElementById('epcInput');
    if (epcInput) {
        epcInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                window.epcFile = file;

                // Show preview
                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.getElementById('epcPreview');
                    if (preview) {
                        preview.innerHTML = `
                            <img src="${event.target.result}" style="max-width: 100%; max-height: 300px; object-fit: contain;">
                            <p style="color: #28a745; margin-top: 0.5rem;">✓ EPC certificate uploaded</p>
                        `;
                        preview.style.display = 'block';

                        const prompt = document.getElementById('epcPrompt');
                        if (prompt) prompt.style.display = 'none';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Initialize generate button state
    updateGenerateButtonState();
});

// ============================================
// Generate Button Gating (70% minimum)
// ============================================

function updateGenerateButtonState() {
    const generateBtn = document.getElementById('generateBtn');
    if (!generateBtn) return;

    // Calculate current completion percentage
    let totalScore = 0; // No base score - start at 0%

    const photosUploaded = uploadedPhotos.length >= 1;
    if (photosUploaded) totalScore += 15;

    // Check if key categories have minimum photos
    const hasCover = window.photoCategoryAssignments.cover.length >= 1;
    const hasExterior = window.photoCategoryAssignments.exterior.length >= 3;
    const hasInterior = window.photoCategoryAssignments.interior.length >= 3;
    const categoriesComplete = hasCover && hasExterior && hasInterior;
    if (categoriesComplete) totalScore += 15;

    // Check if bedroom/bathroom checkboxes are selected
    const checkedFeaturesArray = Array.from(document.querySelectorAll('input[name="features"]:checked'));
    const bedroomsEntered = checkedFeaturesArray.some(cb => cb.value.includes('bedroom'));
    if (bedroomsEntered) totalScore += 10;

    const bathroomsEntered = checkedFeaturesArray.some(cb => cb.value.includes('bathroom') || cb.value.includes('wc'));
    if (bathroomsEntered) totalScore += 10;

    const locationEntered = document.getElementById('address')?.value.trim().length > 0;
    if (locationEntered) totalScore += 10;

    // Check if photos are assigned to categories
    let totalAssigned = 0;
    Object.values(photoCategoryAssignments).forEach(photos => {
        totalAssigned += photos.length;
    });
    const photosAssigned = totalAssigned >= 7;  // Minimum 7 assigned

    // Portal mode has lower requirements (no photo assignment needed)
    const isPortalMode = window.currentMode === 'portal';
    // TESTING MODE: All progress requirements disabled - button always enabled
    const meetsMinimum = true;

    if (meetsMinimum) {
        generateBtn.disabled = false;
        generateBtn.style.opacity = '1';
        generateBtn.style.cursor = 'pointer';
        generateBtn.title = '';
    } else {
        generateBtn.disabled = true;
        generateBtn.style.opacity = '0.5';
        generateBtn.style.cursor = 'not-allowed';
        const missing = [];
        if (!photosUploaded && !isPortalMode) missing.push('8+ photos');
        if (!photosAssigned && !isPortalMode) missing.push('assign 7+ photos to categories');
        if (!bedroomsEntered) missing.push('enter bedroom count');
        if (!bathroomsEntered) missing.push('enter bathroom count');
        if (!locationEntered) missing.push('enter location');
        generateBtn.title = `Complete required fields: ${missing.join(', ')}`;
    }
}

// ============================================
// Achievement Toast Notification
// ============================================

function showAchievementToast(title, message) {
    // Prevent showing multiple times
    if (window.achievementShown) return;
    window.achievementShown = true;

    const toast = document.createElement('div');
    toast.id = 'achievementToast';
    toast.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
        padding: 2rem 3rem;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        z-index: 10000;
        text-align: center;
        color: #2a2a2a;
        animation: achievementPop 0.5s ease-out forwards;
        max-width: 400px;
    `;

    toast.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🏆</div>
        <div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem;">${title}</div>
        <div style="font-size: 1rem; color: #333;">${message}</div>
    `;

    document.body.appendChild(toast);

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes achievementPop {
            0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.1); }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes achievementFade {
            to { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        }
    `;
    document.head.appendChild(style);

    // Remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'achievementFade 0.5s ease-in forwards';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// ============================================
// LocalStorage Draft Persistence
// ============================================

function saveDraftProgress() {
    const draft = {
        timestamp: Date.now(),
        mode: window.currentMode,
        formData: {
            address: document.getElementById('address')?.value || '',
            postcode: document.getElementById('postcode')?.value || '',
            askingPrice: document.getElementById('askingPrice')?.value || '',
            propertyType: document.getElementById('propertyType')?.value || '',
            sizeSqft: document.getElementById('sizeSqft')?.value || '',
            epcRating: document.getElementById('epcRating')?.value || '',
            agencyName: document.getElementById('agencyName')?.value || '',
            agencyEmail: document.getElementById('agencyEmail')?.value || '',
            agencyPhone: document.getElementById('agencyPhone')?.value || '',
            targetAudience: document.getElementById('targetAudience')?.value || '',
            tone: document.getElementById('tone')?.value || ''
        },
        features: Array.from(document.querySelectorAll('input[name="features"]:checked')).map(cb => cb.value),
        photoCount: uploadedPhotos.length,
        photoAssignments: Object.values(photoCategoryAssignments).reduce((sum, photos) => sum + photos.length, 0),
        photoCategoryAssignments: photoCategoryAssignments,
        hasFloorPlan: window.propertyFloorPlan !== null,  // V3: Using new propertyFloorPlan variable
        completionPercentage: document.getElementById('completionPercentage')?.textContent || '0%'
    };

    localStorage.setItem('openbrick_draft', JSON.stringify(draft));

    // Update auto-save indicator
    const indicator = document.getElementById('autoSaveIndicator');
    const status = document.getElementById('saveStatus');
    const time = document.getElementById('saveTime');

    if (indicator && status && time) {
        indicator.style.display = 'block';
        status.textContent = '✓ Saved';
        status.style.color = '#28a745';
        time.textContent = 'just now';

        // Hide after 3 seconds
        setTimeout(() => {
            indicator.style.display = 'none';
        }, 3000);
    }
}

function checkForDraft() {
    const draft = localStorage.getItem('openbrick_draft');
    if (!draft) return;

    const data = JSON.parse(draft);
    const draftAge = Date.now() - data.timestamp;
    const hoursSinceUpdate = Math.floor(draftAge / (1000 * 60 * 60));

    // Only show if draft is less than 24 hours old
    if (hoursSinceUpdate >= 24) {
        localStorage.removeItem('openbrick_draft');
        return;
    }

    // Add "Resume Draft" button to wizard
    const wizard = document.getElementById('modeWizard');
    if (wizard && !document.getElementById('resumeDraftBanner')) {
        const banner = document.createElement('div');
        banner.id = 'resumeDraftBanner';
        banner.style.cssText = `
            background: linear-gradient(135deg, #2C5F7C 0%, #A02818 100%);
            color: white;
            padding: 1.5rem;
            border-radius: 12px;
            margin-bottom: 2rem;
            text-align: center;
            box-shadow: 0 4px 12px rgba(44, 95, 124, 0.3);
        `;

        banner.innerHTML = `
            <div style="font-size: 1.2rem; font-weight: bold; margin-bottom: 0.5rem;">
                📝 Draft in Progress
            </div>
            <div style="font-size: 0.9rem; margin-bottom: 1rem; opacity: 0.9;">
                You have an unfinished ${data.mode} listing (${data.completionPercentage} complete, saved ${hoursSinceUpdate}h ago)
            </div>
            <button onclick="resumeDraft()" style="background: white; color: #2C5F7C; border: none; padding: 0.75rem 2rem; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 1rem;">
                Resume Draft →
            </button>
            <button onclick="clearDraft()" style="background: transparent; color: white; border: 2px solid white; padding: 0.75rem 2rem; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 1rem; margin-left: 1rem;">
                Start Fresh
            </button>
        `;

        wizard.insertBefore(banner, wizard.firstChild.nextSibling);
    }
}

function resumeDraft() {
    const draft = localStorage.getItem('openbrick_draft');
    if (!draft) return;

    const data = JSON.parse(draft);

    // Start the mode
    startMode(data.mode);

    // Restore form data
    setTimeout(() => {
        Object.keys(data.formData).forEach(key => {
            const element = document.getElementById(key);
            if (element) element.value = data.formData[key];
        });

        // Restore feature selections
        data.features.forEach(value => {
            const checkbox = document.querySelector(`input[name="features"][value="${value}"]`);
            if (checkbox) checkbox.checked = true;
        });

        // Update tracker
        updateCompletionTracker();

        // Show notification
        showToast('success', '📝 Draft restored! Continue where you left off.');

        // Smooth scroll to first incomplete section
        scrollToNextIncomplete();
    }, 500);
}

function clearDraft() {
    localStorage.removeItem('openbrick_draft');
    const banner = document.getElementById('resumeDraftBanner');
    if (banner) banner.remove();
    showToast('info', 'Draft cleared. Starting fresh!');
}

// ============================================
// Section Completion Badges
// ============================================

function updateSectionBadges() {
    // Image section
    const imageSection = document.querySelector('#imageSection h2');
    if (imageSection) {
        const totalAssigned = Object.values(photoCategoryAssignments).reduce((sum, photos) => sum + photos.length, 0);
        const photosComplete = uploadedPhotos.length >= 1 && totalAssigned >= 7;
        updateSectionBadge(imageSection, photosComplete);
    }

    // Essential details section
    const essentialSection = document.querySelector('#essentialDetailsSection h2');
    if (essentialSection) {
        const bedroomsSelected = Array.from(document.querySelectorAll('input[name="features"]:checked'))
            .some(cb => cb.value.includes('bedroom'));
        const bathroomsSelected = Array.from(document.querySelectorAll('input[name="features"]:checked'))
            .some(cb => cb.value.includes('bathroom'));
        const essentialComplete = bedroomsSelected && bathroomsSelected;
        updateSectionBadge(essentialSection, essentialComplete);
    }

    // Location section
    const locationSection = document.querySelector('#locationSection h2');
    if (locationSection) {
        const locationComplete = document.getElementById('address')?.value.trim().length > 0;
        updateSectionBadge(locationSection, locationComplete);
    }
}

function updateSectionBadge(headerElement, isComplete) {
    // Remove existing badge
    const existingBadge = headerElement.querySelector('.section-badge');
    if (existingBadge) existingBadge.remove();

    // Add new badge
    const badge = document.createElement('span');
    badge.className = 'section-badge';
    badge.style.cssText = `
        display: inline-block;
        margin-left: 0.75rem;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        text-align: center;
        line-height: 24px;
        font-size: 0.75rem;
        ${isComplete
            ? 'background: #28a745; color: white;'
            : 'background: #FFA500; color: white; animation: pulse 2s infinite;'}
    `;
    badge.textContent = isComplete ? '✓' : '!';
    badge.title = isComplete ? 'Section complete' : 'Incomplete - attention needed';

    headerElement.appendChild(badge);
}

// Add pulse animation for incomplete sections
const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.1); }
    }
`;
document.head.appendChild(pulseStyle);

// ============================================
// Smooth Scroll to Incomplete Sections
// ============================================

function scrollToNextIncomplete() {
    // Find first incomplete required item
    const photosComplete = uploadedPhotos.length >= 1;
    const totalAssigned = Object.values(photoCategoryAssignments).reduce((sum, photos) => sum + photos.length, 0);
    const photosAssigned = totalAssigned >= 7;
    const bedroomsSelected = Array.from(document.querySelectorAll('input[name="features"]:checked'))
        .some(cb => cb.value.includes('bedroom'));
    const bathroomsSelected = Array.from(document.querySelectorAll('input[name="features"]:checked'))
        .some(cb => cb.value.includes('bathroom'));
    const locationEntered = document.getElementById('address')?.value.trim().length > 0;

    let targetSection = null;

    if (!photosComplete || !photosAssigned) {
        targetSection = document.getElementById('imageSection');
    } else if (!bedroomsSelected || !bathroomsSelected) {
        targetSection = document.getElementById('essentialDetailsSection');
    } else if (!locationEntered) {
        targetSection = document.getElementById('locationSection');
    }

    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Highlight briefly
        targetSection.style.transition = 'background 0.5s';
        const originalBg = targetSection.style.background;
        targetSection.style.background = 'rgba(44, 95, 124, 0.1)';
        setTimeout(() => {
            targetSection.style.background = originalBg;
        }, 1500);
    }
}

// ============================================
// Example Brochure PDF Upload
// ============================================

let exampleBrochurePdf = null;

// Setup PDF upload handlers
document.addEventListener('DOMContentLoaded', () => {
    const uploadZone = document.getElementById('brochurePdfUploadZone');
    const fileInput = document.getElementById('brochurePdfInput');
    const preview = document.getElementById('brochurePdfPreview');
    const removeBtn = document.getElementById('removeBrochurePdf');

    if (!uploadZone || !fileInput) return;

    // Click to browse
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });

    // Drag and drop handlers
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#FF6B35';
        uploadZone.style.background = '#fff5f2';
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = '#2C5F7C';
        uploadZone.style.background = '#f8f9fa';
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#2C5F7C';
        uploadZone.style.background = '#f8f9fa';

        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'application/pdf') {
            handlePdfUpload(files[0]);
        } else {
            showToast('error', 'Please upload a PDF file');
        }
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handlePdfUpload(e.target.files[0]);
        }
    });

    // Remove button
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            exampleBrochurePdf = null;
            preview.style.display = 'none';
            uploadZone.style.display = 'block';
            fileInput.value = '';
            showToast('info', 'Example brochure removed');
        });
    }
});

function handlePdfUpload(file) {
    console.log('📄 Uploading example brochure:', file.name);

    // Store the file
    exampleBrochurePdf = file;

    // Show preview
    const preview = document.getElementById('brochurePdfPreview');
    const uploadZone = document.getElementById('brochurePdfUploadZone');
    const fileName = document.getElementById('brochurePdfFileName');
    const fileInfo = document.getElementById('brochurePdfInfo');

    fileName.textContent = file.name;
    fileInfo.textContent = `${(file.size / 1024).toFixed(1)} KB • Uploaded ${new Date().toLocaleTimeString()}`;

    uploadZone.style.display = 'none';
    preview.style.display = 'block';

    showToast('success', 'Example brochure received! AI will analyze style and layout when generating.');
}

// ============================================
// Auto-detected Features from Vision API
// ============================================

let detectedFeatures = [];
let autoDetectedCheckboxes = new Set(); // Track which checkboxes were auto-detected
let photoAnalysisResults = null; // Store full photo analysis for text generation

// ============================================
// Intelligent Room Numbering & Positioning
// ============================================

function applyIntelligentRoomNumbering(analysisResults) {
    // Count rooms by type
    const roomCounts = {};
    const roomPositions = {
        bedroom: ['principal_bedroom', 'bedroom_2', 'bedroom_3', 'bedroom_4', 'bedroom_5'],
        bathroom: ['ensuite', 'family_bathroom', 'bathroom_2', 'bathroom_3'],
        living_room: ['reception', 'drawing_room', 'sitting_room'],
        kitchen: ['kitchen', 'kitchen_dining_room'],
        dining_room: ['dining_room', 'breakfast_room'],
        office: ['study', 'home_office'],
        garage: ['garage', 'parking']
    };

    analysisResults.forEach((result, index) => {
        const roomType = result.room_type;

        // Skip non-room types
        if (roomType === 'exterior' || roomType === 'garden' || roomType === 'hallway') {
            result.numbered_name = roomType;
            result.position = roomType;
            return;
        }

        // Initialize counter for this room type
        if (!roomCounts[roomType]) {
            roomCounts[roomType] = 0;
        }
        roomCounts[roomType]++;

        const count = roomCounts[roomType];

        // Apply intelligent numbering
        let numberedName;
        let position;

        if (roomType === 'bedroom') {
            if (count === 1) {
                numberedName = 'Principal Bedroom';
                position = 'principal_bedroom';
            } else {
                numberedName = `Bedroom ${count}`;
                position = `bedroom_${count}`;
            }
        } else if (roomType === 'bathroom') {
            if (count === 1) {
                // Check if it's connected to principal bedroom
                numberedName = 'Ensuite';
                position = 'ensuite';
            } else if (count === 2) {
                numberedName = 'Family Bathroom';
                position = 'family_bathroom';
            } else {
                numberedName = `Bathroom ${count}`;
                position = `bathroom_${count}`;
            }
        } else if (roomType === 'living_room') {
            if (count === 1) {
                numberedName = 'Reception Room';
                position = 'reception';
            } else if (count === 2) {
                numberedName = 'Drawing Room';
                position = 'drawing_room';
            } else {
                numberedName = `Living Room ${count}`;
                position = `living_room_${count}`;
            }
        } else {
            // Default: capitalize and add number if multiple
            numberedName = count === 1
                ? roomType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                : `${roomType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} ${count}`;
            position = count === 1 ? roomType : `${roomType}_${count}`;
        }

        result.numbered_name = numberedName;
        result.position = position;

        console.log(`📋 Room ${index + 1}: ${result.filename} → ${numberedName} (${position})`);
    });

    console.log('✅ Intelligent room numbering applied:', roomCounts);

    // Update the uploadedPhotos array with the numbered names
    // Bug #5, #11 fix: Match by photo ID or filename (fallback for backwards compatibility)
    analysisResults.forEach((result) => {
        // First try to match by ID, fallback to filename
        const matchingPhoto = uploadedPhotos.find(photo => {
            // Try exact ID match first
            if (photo.id && result.photo_id) {
                return photo.id === result.photo_id;
            }
            // Fallback to filename matching (with normalization for special characters)
            const photoName = photo.name || photo.file?.name || '';
            const resultName = result.filename || '';
            return photoName === resultName || photoName === decodeURIComponent(resultName);
        });

        if (matchingPhoto) {
            matchingPhoto.room_name = result.numbered_name;
            matchingPhoto.room_position = result.position;
            matchingPhoto.room_type = result.room_type;
            console.log(`✅ Updated photo: ${result.filename} → ${result.numbered_name} (ID: ${matchingPhoto.id})`);
        } else {
            console.warn(`⚠️ Could not find photo for: ${result.filename}`);
        }
    });

    // Auto-categorize photos based on AI-detected room types
    // Bug #5, #11 fix: Store photo IDs instead of filenames
    console.log('📂 Auto-categorizing photos based on room types...');
    // Helper function: Check if photo is already manually assigned to ANY category
    function isPhotoManuallyAssigned(photoId) {
        const allCategories = ['cover', 'exterior', 'interior', 'kitchen', 'bedrooms', 'bathrooms', 'garden', 'reception'];
        return allCategories.some(category =>
            window.photoCategoryAssignments[category]?.includes(photoId)
        );
    }

    analysisResults.forEach((result) => {
        const roomType = result.room_type?.toLowerCase() || '';
        const filename = result.filename;

        // Find the photo to get its ID
        const matchingPhoto = uploadedPhotos.find(photo => {
            const photoName = photo.name || photo.file?.name || '';
            return photoName === filename || photoName === decodeURIComponent(filename);
        });

        if (!matchingPhoto) {
            console.warn(`⚠️ Could not find photo for categorization: ${filename}`);
            return;
        }

        const photoId = matchingPhoto.id; // Use unique ID instead of filename

        // ⭐ FIX: Don't auto-assign if photo is already manually assigned to ANY category
        if (isPhotoManuallyAssigned(photoId)) {
            console.log(`  ⏭️ Skipping ${filename} - already manually assigned`);
            return;
        }

        // Map room types to categories (now using IDs)
        if (roomType.includes('bedroom') || roomType.includes('principal')) {
            if (!window.photoCategoryAssignments['bedrooms'].includes(photoId)) {
                window.photoCategoryAssignments['bedrooms'].push(photoId);
                console.log(`  ✓ Auto-assigned ${filename} (ID: ${photoId}) to bedrooms category`);
            }
        } else if (roomType.includes('bathroom') || roomType.includes('ensuite')) {
            if (!window.photoCategoryAssignments['bathrooms'].includes(photoId)) {
                window.photoCategoryAssignments['bathrooms'].push(photoId);
                console.log(`  ✓ Auto-assigned ${filename} (ID: ${photoId}) to bathrooms category`);
            }
        } else if (roomType.includes('kitchen')) {
            if (!window.photoCategoryAssignments['kitchen'].includes(photoId)) {
                window.photoCategoryAssignments['kitchen'].push(photoId);
                console.log(`  ✓ Auto-assigned ${filename} (ID: ${photoId}) to kitchen category`);
            }
        } else if (roomType.includes('living') || roomType.includes('reception') || roomType.includes('drawing')) {
            if (!window.photoCategoryAssignments['reception'].includes(photoId)) {
                window.photoCategoryAssignments['reception'].push(photoId);
                console.log(`  ✓ Auto-assigned ${filename} (ID: ${photoId}) to reception category`);
            }
        } else if (roomType.includes('garden') || roomType.includes('exterior') || roomType.includes('pool')) {
            if (!window.photoCategoryAssignments['garden'].includes(photoId)) {
                window.photoCategoryAssignments['garden'].push(photoId);
                console.log(`  ✓ Auto-assigned ${filename} (ID: ${photoId}) to garden category`);
            }
        }
    });

    console.log('📊 Category summary:', {
        bedrooms: window.photoCategoryAssignments['bedrooms'].length,
        bathrooms: window.photoCategoryAssignments['bathrooms'].length,
        kitchen: window.photoCategoryAssignments['kitchen'].length,
        reception: window.photoCategoryAssignments['reception'].length,
        garden: window.photoCategoryAssignments['garden'].length
    });

    // Update the photo display with new names
    if (typeof updatePhotoDisplay === 'function') {
        updatePhotoDisplay();
    }

    // Sync auto-categorized photos to the UI display
    syncCategoriesToUI();
}

/**
 * Sync auto-categorized photos from window.photoCategoryAssignments to the visual UI
 */
// ============================================
// Create Brochure Section-Photo Mappings
// ============================================

/**
 * Intelligently assign photos to brochure sections BEFORE generation
 * so the LLM knows which photos it's writing about in each section.
 *
 * Returns section-photo mappings with vision analysis details
 */
function createBrochureSectionMappings() {
    console.log('📋 Creating intelligent section-photo mappings for brochure...');

    if (!photoAnalysisResults || !photoAnalysisResults.photos || photoAnalysisResults.photos.length === 0) {
        console.warn('⚠️ No photo analysis available');
        return null;
    }

    // ⭐ IMPORTANT: Update photo categories from user's actual assignments
    // (Smart Defaults or manual dragging may have changed categories since AI analysis)
    const updatedPhotos = photoAnalysisResults.photos.map(photo => {
        // Find which category this photo is currently assigned to
        let currentCategory = photo.category; // Default to AI category

        // Check window.photoCategoryAssignments for user's actual category
        Object.keys(window.photoCategoryAssignments || {}).forEach(categoryKey => {
            const photoIdsInCategory = window.photoCategoryAssignments[categoryKey] || [];

            // Find if this photo is in this category (by filename or ID)
            const matchingPhoto = window.uploadedPhotos?.find(p => {
                const matches = p.name === photo.filename ||
                               p.id === photo.filename ||
                               (p.file && p.file.name === photo.filename);
                return matches && photoIdsInCategory.includes(p.id);
            });

            if (matchingPhoto) {
                currentCategory = categoryKey;  // Use user's actual category
            }
        });

        return {
            ...photo,
            category: currentCategory,  // Override with current category
            originalCategory: photo.category  // Keep original for reference
        };
    });

    // Log category changes
    const categoryChanges = updatedPhotos.filter(p => p.category !== p.originalCategory);
    if (categoryChanges.length > 0) {
        console.log(`📂 ${categoryChanges.length} photos had categories updated by user:`);
        categoryChanges.forEach(photo => {
            console.log(`   ${photo.filename}: ${photo.originalCategory} → ${photo.category}`);
        });
    } else {
        console.log('📂 Using original AI categories (no user changes detected)');
    }

    const sections = {
        introduction: {
            name: 'Introduction',
            desiredCategories: ['exterior', 'cover'],
            maxPhotos: 2,
            photos: []
        },
        living_spaces: {
            name: 'Living Spaces',
            desiredCategories: ['interior', 'living_room', 'reception'],
            maxPhotos: 4,
            photos: []
        },
        kitchen_dining: {
            name: 'Kitchen & Dining',
            desiredCategories: ['kitchen', 'dining_room'],
            maxPhotos: 3,
            photos: []
        },
        bedrooms: {
            name: 'Bedrooms',
            desiredCategories: ['bedrooms', 'bedroom'],
            maxPhotos: 3,
            photos: []
        },
        bathrooms: {
            name: 'Bathrooms',
            desiredCategories: ['bathrooms', 'bathroom'],
            maxPhotos: 2,
            photos: []
        },
        garden_exterior: {
            name: 'Garden & Exterior',
            desiredCategories: ['garden', 'exterior'],
            maxPhotos: 2,
            photos: []
        }
    };

    // Assign photos to sections based on their CURRENT categories (not original AI categories)
    updatedPhotos.forEach(photo => {
        const category = (photo.category || '').toLowerCase();

        // Find which section(s) want this photo category
        Object.keys(sections).forEach(sectionKey => {
            const section = sections[sectionKey];

            if (section.photos.length < section.maxPhotos) {
                if (section.desiredCategories.some(desired =>
                    category.includes(desired) || desired.includes(category)
                )) {
                    section.photos.push({
                        filename: photo.filename,
                        category: photo.category,
                        attributes: photo.attributes || [],
                        caption: photo.caption || null
                    });
                }
            }
        });
    });

    // Log the mappings
    console.log('📸 Section-photo mappings:');
    Object.keys(sections).forEach(sectionKey => {
        const section = sections[sectionKey];
        console.log(`  ${section.name}: ${section.photos.length} photos`);
        section.photos.forEach(photo => {
            console.log(`    - ${photo.filename} (${photo.category}): ${photo.attributes.slice(0, 3).join(', ')}`);
        });
    });

    return sections;
}

function syncCategoriesToUI() {
    console.log('🔄 Syncing auto-categorized photos to UI...');

    const categories = ['cover', 'exterior', 'interior', 'kitchen', 'reception', 'bedrooms', 'bathrooms', 'garden'];

    categories.forEach(category => {
        const categoryPhotos = document.getElementById(`${category}-photos`);
        const categoryCount = document.getElementById(`${category}-count`);

        if (!categoryPhotos || !categoryCount) {
            console.log(`⚠️ Category UI elements not found for: ${category}`);
            return;
        }

        // Get assigned photos for this category
        const assignedFilenames = window.photoCategoryAssignments[category] || [];

        if (assignedFilenames.length === 0) {
            categoryPhotos.innerHTML = `<div style="color: #6c757d; font-size: 0.85rem; width: 100%; text-align: center; padding: 1rem;">Click to add ${category} photo</div>`;
            categoryCount.textContent = '0';
            return;
        }

        // Get theme color
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#C20430';

        // Clear existing display
        categoryPhotos.innerHTML = '';

        // Add each assigned photo to the display
        // Bug #5, #11 fix: assignedFilenames now contains photo IDs, not filenames
        assignedFilenames.forEach(photoId => {
            // Find the photo in uploadedPhotos array by matching ID (with fallback to filename for backwards compatibility)
            const uploadedPhoto = window.uploadedPhotos?.find(p => {
                // Try ID match first
                if (p.id === photoId) return true;
                // Fallback to filename match for backwards compatibility
                const photoFilename = p.file?.name || p.name;
                return photoFilename === photoId;
            });

            if (uploadedPhoto) {
                const thumbnail = document.createElement('div');
                thumbnail.style.cssText = `width: 60px; height: 60px; border-radius: 4px; overflow: hidden; border: 2px solid ${primaryColor}; margin: 2px; display: inline-block;`;
                const displayName = uploadedPhoto.room_name || uploadedPhoto.name || 'Photo';
                thumbnail.innerHTML = `<img src="${uploadedPhoto.dataUrl}" style="width: 100%; height: 100%; object-fit: cover;" alt="${displayName}">`;
                categoryPhotos.appendChild(thumbnail);
            }
        });

        // Update count
        categoryCount.textContent = assignedFilenames.length.toString();

        console.log(`  ✓ Updated ${category} category UI with ${assignedFilenames.length} photos`);
    });

    console.log('✅ Category UI sync complete');
}

// Create AI analysis indicator
function showAIAnalysisIndicator() {
    // Remove existing indicator if present
    const existing = document.getElementById('aiAnalysisIndicator');
    if (existing) existing.remove();

    const indicator = document.createElement('div');
    indicator.id = 'aiAnalysisIndicator';
    indicator.style.cssText = `
        position: fixed;
        top: 320px;
        right: 20px;
        background: linear-gradient(135deg, #C20430, #9E0328);
        color: white;
        padding: 0.75rem 1.25rem;
        border-radius: 50px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 998;
        font-size: 0.9rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        animation: slideInRight 0.3s ease-out;
    `;

    indicator.innerHTML = `
        <div style="animation: spin 2s linear infinite; font-size: 1.2rem;">🤖</div>
        <span>AI analyzing photos...</span>
    `;

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(indicator);
    return indicator;
}

function hideAIAnalysisIndicator() {
    const indicator = document.getElementById('aiAnalysisIndicator');
    if (indicator) {
        indicator.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => indicator.remove(), 300);
    }
}

// Bug #19, #2, #36 fix: Progress bar, rollback on failure, handle partial failures
let analysisProgressBar = null;

// Bug #25 fix: Track photo analysis state
let isAnalyzingPhotos = false;
window.isAnalyzingPhotos = false; // Expose to page_builder.js

function showAnalysisProgress(current, total) {
    if (!analysisProgressBar) {
        analysisProgressBar = document.createElement('div');
        analysisProgressBar.id = 'analysisProgressBar';
        analysisProgressBar.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border: 2px solid #2C5F7C;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            min-width: 300px;
        `;
        document.body.appendChild(analysisProgressBar);
    }

    const percentage = Math.round((current / total) * 100);
    analysisProgressBar.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 0.5rem; color: #2C5F7C;">
            🤖 Analyzing Photos
        </div>
        <div style="font-size: 0.9rem; color: #666; margin-bottom: 0.75rem;">
            ${current} of ${total} photos processed
        </div>
        <div style="background: #e0e0e0; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background: linear-gradient(90deg, #2C5F7C, #4A90E2); height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
        </div>
        <div style="font-size: 0.8rem; color: #888; margin-top: 0.5rem; text-align: right;">
            ${percentage}%
        </div>
    `;
}

function hideAnalysisProgress() {
    if (analysisProgressBar) {
        analysisProgressBar.remove();
        analysisProgressBar = null;
    }
}

async function analyzePhotosForFeatures() {
    if (uploadedPhotos.length === 0) return;

    // Bug #49 fix: Prevent concurrent batch analysis loops
    if (isAnalyzingPhotos) {
        console.log('⏸️ Analysis already in progress, skipping duplicate call');
        return;
    }

    // Bug #25 fix: Set analyzing flag
    isAnalyzingPhotos = true;
    window.isAnalyzingPhotos = true;

    // Show subtle AI indicator instead of toast spam
    const indicator = showAIAnalysisIndicator();

    // Bug #2 fix: Save state for rollback
    const originalPhotoCategoryAssignments = JSON.parse(JSON.stringify(window.photoCategoryAssignments));
    const originalAutoDetectedCheckboxes = new Set(autoDetectedCheckboxes);

    try {
        // ⭐ OPTIMIZATION: Only analyze photos that haven't been analyzed yet
        // Track analyzed photos by their unique ID
        if (!window.analyzedPhotoIds) {
            window.analyzedPhotoIds = new Set();
        }

        const photosToAnalyze = uploadedPhotos.filter(photo => !window.analyzedPhotoIds.has(photo.id));

        if (photosToAnalyze.length === 0) {
            console.log('✅ All photos already analyzed, skipping analysis');
            isAnalyzingPhotos = false;
            window.isAnalyzingPhotos = false;
            if (indicator) indicator.remove();
            return;
        }

        console.log(`📊 Analysis needed: ${photosToAnalyze.length} new photos (${window.analyzedPhotoIds.size} already analyzed)`);

        // ⭐ BATCH PROCESSING TO AVOID RATE LIMITS
        // Process photos in batches of 3 with 2-second delays between batches
        const BATCH_SIZE = 3;
        const BATCH_DELAY = 2000; // 2 seconds between batches

        const analysisResults = [];
        const failedPhotos = []; // Bug #36 fix: Track failed photos
        const totalPhotos = photosToAnalyze.length;
        const totalBatches = Math.ceil(photosToAnalyze.length / BATCH_SIZE);

        console.log(`📦 Starting batch processing: ${totalPhotos} photos in ${totalBatches} batches`);

        // Bug #19 fix: Show progress bar
        showAnalysisProgress(0, totalPhotos);

        for (let i = 0; i < photosToAnalyze.length; i += BATCH_SIZE) {
            const batch = photosToAnalyze.slice(i, i + BATCH_SIZE);
            const batchNumber = Math.floor(i / BATCH_SIZE) + 1;

            console.log(`📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} photos)...`);

            // Send batch to backend
            const formData = new FormData();
            batch.forEach((photo, idx) => {
                console.log(`📎 Batch ${batchNumber} photo ${idx}: file =`, photo.file, 'type:', photo.file?.type, 'size:', photo.file?.size);
                formData.append('files', photo.file);
            });

            try {
                console.log(`🌐 Sending fetch request to /analyze-images with ${batch.length} files`);
                const response = await fetch('/analyze-images', {
                    method: 'POST',
                    body: formData
                    // Removed keepalive - can cause issues with large payloads
                });
                console.log(`📡 Response received: ${response.status} ${response.statusText}`);

                if (response.ok) {
                    const batchResults = await response.json();
                    analysisResults.push(...batchResults);

                    // Mark these photos as analyzed
                    batch.forEach(photo => {
                        window.analyzedPhotoIds.add(photo.id);
                    });

                    console.log(`✅ Batch ${batchNumber}/${totalBatches} complete (${analysisResults.length}/${totalPhotos} photos analyzed)`);

                    // Bug #19 fix: Update progress bar
                    showAnalysisProgress(analysisResults.length, totalPhotos);
                } else {
                    console.error(`❌ Batch ${batchNumber} failed with status ${response.status}`);
                    // Bug #36 fix: Track which photos failed
                    batch.forEach(photo => failedPhotos.push(photo.name));
                }
            } catch (fetchError) {
                console.error(`❌ Batch ${batchNumber} network error:`, fetchError);
                // Bug #36 fix: Track failed photos
                batch.forEach(photo => failedPhotos.push(photo.name));
            }

            // Wait between batches (except for the last batch)
            if (i + BATCH_SIZE < photosToAnalyze.length) {
                console.log(`⏳ Waiting ${BATCH_DELAY}ms before next batch...`);
                await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
            }
        }

        console.log(`📊 Analysis complete! Total analyzed photos: ${window.analyzedPhotoIds.size} (${photosToAnalyze.length} new + ${window.analyzedPhotoIds.size - photosToAnalyze.length} previously analyzed)`);

        // Bug #36 fix: Show failed photos warning
        if (failedPhotos.length > 0) {
            console.warn(`⚠️ ${failedPhotos.length} photos failed to analyze:`, failedPhotos);
            showToast('warning', `${failedPhotos.length} photo${failedPhotos.length > 1 ? 's' : ''} could not be analyzed. Continuing with ${analysisResults.length} successful photos.`);
        }

        // Bug #2 fix: Rollback if ALL photos failed
        if (analysisResults.length === 0) {
            hideAnalysisProgress();
            throw new Error('No photos were successfully analyzed');
        }

        console.log(`✅ All batches complete! Successfully analyzed ${analysisResults.length}/${totalPhotos} photos`);

        // Hide progress bar
        hideAnalysisProgress();

        console.log('Vision analysis results:', analysisResults);

        // ⭐ INTELLIGENT ROOM NUMBERING
        // Apply intelligent numbering and positioning to rooms
        applyIntelligentRoomNumbering(analysisResults);

        // ⭐ STORE FULL ANALYSIS FOR TEXT GENERATION
        // Transform backend format to match PhotoAnalysisData schema
        photoAnalysisResults = {
            photos: analysisResults.map(result => ({
                filename: result.filename,
                category: result.room_type || 'general',
                attributes: result.attributes ? result.attributes.map(attr => attr.attribute) : [],
                caption: result.suggested_caption || null,
                confidence: result.attributes && result.attributes.length > 0
                    ? result.attributes[0].confidence
                    : null
            }))
        };
        console.log('📸 Stored photo analysis for generation:', photoAnalysisResults);

        // Extract all detected features from all images
        const allDetectedFeatures = new Set();

        analysisResults.forEach(result => {
            console.log('Processing result:', result.filename, result.attributes);
            // Get features from detected_features
            if (result.attributes) {
                result.attributes.forEach(attr => {
                    const featureName = attr.attribute.toLowerCase().replace(/ /g, '_');
                    allDetectedFeatures.add(featureName);
                    console.log('  Added feature:', featureName);
                });
            }
        });

        console.log('All detected features:', Array.from(allDetectedFeatures));

        // Map vision features to checkbox values
        const featuresToCheck = mapVisionFeaturesToCheckboxes(Array.from(allDetectedFeatures));
        console.log('Mapped features to check:', Array.from(featuresToCheck));

        // Also add features from category assignments and filenames (hybrid approach)
        const manualFeatures = detectFeaturesFromPhotos();
        manualFeatures.forEach(f => featuresToCheck.add(f.value));

        if (featuresToCheck.size > 0) {
            // Auto-check detected features
            let checkedCount = 0;
            featuresToCheck.forEach(featureValue => {
                const checkbox = document.querySelector(`input[name="features"][value="${featureValue}"]`);
                if (checkbox && !checkbox.checked) {
                    checkbox.checked = true;
                    autoDetectedCheckboxes.add(featureValue);
                    checkedCount++;

                    // Add visual indicator
                    const label = checkbox.closest('label');
                    if (label && !label.querySelector('.auto-detected-badge')) {
                        const badge = document.createElement('span');
                        badge.className = 'auto-detected-badge';
                        badge.innerHTML = '🤖';
                        badge.title = 'Auto-detected by AI vision';
                        badge.style.cssText = 'margin-left: 0.25rem; font-size: 0.85rem; opacity: 0.7;';
                        label.appendChild(badge);
                    }
                }
            });

            // Auto-detect bedrooms and bathrooms based on photo counts
            autoDetectRoomCounts();

            // Hide AI indicator (no toast spam)
            hideAIAnalysisIndicator();

            // Update progress tracker to show feature count
            if (typeof updateProgress === 'function') {
                updateProgress();
            }

            // Update completion tracker
            if (typeof updateCompletionTracker === 'function') {
                updateCompletionTracker();
            }
        } else {
            // Hide indicator silently (no toast spam)
            hideAIAnalysisIndicator();
        }

        // Always try to auto-detect room counts even if no features detected
        autoDetectRoomCounts();

    } catch (error) {
        console.error('Vision analysis failed:', error);
        // Hide indicator silently
        hideAIAnalysisIndicator();

        // Fallback to basic detection
        const features = detectFeaturesFromPhotos();
        features.forEach(feature => {
            const checkbox = document.querySelector(`input[name="features"][value="${feature.value}"]`);
            if (checkbox && !checkbox.checked) {
                checkbox.checked = true;
            }
        });
    } finally {
        // Bug #25 fix: Always reset analyzing flag
        isAnalyzingPhotos = false;
        window.isAnalyzingPhotos = false;
        console.log('✅ Photo analysis complete - Smart Defaults now enabled');

        // Check if there are more unanalyzed photos and trigger analysis again
        const remainingUnanalyzed = uploadedPhotos.filter(photo => !window.analyzedPhotoIds.has(photo.id));
        if (remainingUnanalyzed.length > 0) {
            console.log(`🔄 Found ${remainingUnanalyzed.length} more unanalyzed photos, re-triggering analysis...`);
            setTimeout(() => {
                analyzePhotosForFeatures();
            }, 1000); // Wait 1 second before analyzing next batch
        }
    }
}

// Auto-detect bedroom and bathroom counts based on assigned photos
function autoDetectRoomCounts() {
    console.log('🏠 Auto-detecting room counts from photo assignments...');

    // Count bedroom photos
    const bedroomPhotoCount = window.photoCategoryAssignments['bedrooms'].length;
    console.log(`Found ${bedroomPhotoCount} bedroom photos`);

    // Estimate bedroom count (typically 1-2 photos per bedroom)
    let estimatedBedrooms = 0;
    if (bedroomPhotoCount >= 5) {
        estimatedBedrooms = 5; // 5+ bedrooms
    } else if (bedroomPhotoCount >= 4) {
        estimatedBedrooms = 4;
    } else if (bedroomPhotoCount >= 3) {
        estimatedBedrooms = 3;
    } else if (bedroomPhotoCount >= 2) {
        estimatedBedrooms = 2;
    }

    // Auto-check bedroom checkbox
    if (estimatedBedrooms > 0) {
        const bedroomCheckbox = document.querySelector(`input[value="${estimatedBedrooms}_bedrooms"]`);
        if (bedroomCheckbox && !bedroomCheckbox.checked) {
            bedroomCheckbox.checked = true;
            autoDetectedCheckboxes.add(`${estimatedBedrooms}_bedrooms`);

            // Add AI badge
            const label = bedroomCheckbox.closest('label');
            if (label && !label.querySelector('.auto-detected-badge')) {
                const badge = document.createElement('span');
                badge.className = 'auto-detected-badge';
                badge.innerHTML = '🤖';
                badge.title = 'Auto-detected from bedroom photos';
                badge.style.cssText = 'margin-left: 0.25rem; font-size: 0.85rem; opacity: 0.7;';
                label.appendChild(badge);
            }
            console.log(`✓ Auto-checked ${estimatedBedrooms} bedrooms`);
        }
    }

    // Count bathroom photos
    const bathroomPhotoCount = window.photoCategoryAssignments['bathrooms'].length;
    console.log(`Found ${bathroomPhotoCount} bathroom photos`);

    // Estimate bathroom count (typically 1-2 photos per bathroom)
    let estimatedBathrooms = 0;
    if (bathroomPhotoCount >= 3) {
        estimatedBathrooms = 3; // 3+ bathrooms
    } else if (bathroomPhotoCount >= 2) {
        estimatedBathrooms = 2;
    }

    // Auto-check bathroom checkbox
    if (estimatedBathrooms > 0) {
        const bathroomCheckbox = document.querySelector(`input[value="${estimatedBathrooms}_bathrooms"]`);
        if (bathroomCheckbox && !bathroomCheckbox.checked) {
            bathroomCheckbox.checked = true;
            autoDetectedCheckboxes.add(`${estimatedBathrooms}_bathrooms`);

            // Add AI badge
            const label = bathroomCheckbox.closest('label');
            if (label && !label.querySelector('.auto-detected-badge')) {
                const badge = document.createElement('span');
                badge.className = 'auto-detected-badge';
                badge.innerHTML = '🤖';
                badge.title = 'Auto-detected from bathroom photos';
                badge.style.cssText = 'margin-left: 0.25rem; font-size: 0.85rem; opacity: 0.7;';
                label.appendChild(badge);
            }
            console.log(`✓ Auto-checked ${estimatedBathrooms} bathrooms`);
        }
    }

    // Update completion tracker if room counts were detected
    if (estimatedBedrooms > 0 || estimatedBathrooms > 0) {
        if (typeof updateCompletionTracker === 'function') {
            updateCompletionTracker();
        }
    }
}

function mapVisionFeaturesToCheckboxes(visionFeatures) {
    const checkboxValues = new Set();

    // Feature mapping from AI vision output to checkbox values
    const featureMap = {
        // Kitchen features
        'granite_countertops': 'fitted_kitchen',
        'stainless_steel_appliances': 'integrated_appliances',
        'kitchen_island': 'kitchen_island',
        'breakfast_bar': 'breakfast_bar',
        'range_cooker': 'range_cooker',
        'modern_kitchen': 'fitted_kitchen',

        // Flooring
        'hardwood_floors': 'original_flooring',
        'hardwood_flooring': 'original_flooring',
        'porcelain_tiles': 'fitted_kitchen',

        // Windows & Period Features
        'bay_window': 'period_features',
        'sash_windows': 'sash_windows',
        'double_glazing': 'double_glazing',
        'exposed_beams': 'exposed_beams',

        // Heating & Systems
        'central_heating': 'central_heating',
        'underfloor_heating': 'underfloor_heating',
        'recessed_lighting': 'fitted_kitchen',
        'air_conditioning': 'air_conditioning',
        'solar_panels': 'solar_panels',

        // Room Features
        'fireplace': 'fireplace',
        'walk_in_wardrobe': 'walk_in_wardrobe',
        'fitted_wardrobes': 'fitted_wardrobes',
        'ensuite': 'ensuite',
        'conservatory': 'conservatory',

        // Outdoor
        'garden': 'garden',
        'garden_view': 'garden',
        'patio': 'patio',
        'balcony': 'balcony',
        'terrace': 'terrace',
        'decking': 'decking',
        'landscaped_garden': 'landscaped_garden',

        // Parking
        'driveway': 'driveway',
        'garage': 'garage',
        'parking': 'parking',
        'carport': 'carport',

        // Premium Features
        'swimming_pool': 'swimming_pool',
        'hot_tub': 'hot_tub',
        'sauna': 'sauna',
        'home_gym': 'home_gym',
        'cinema_room': 'cinema_room',
        'wine_cellar': 'wine_cellar',

        // Additional Spaces
        'utility_room': 'utility_room',
        'study': 'study',
        'office': 'study',
        'loft_conversion': 'loft_conversion',
        'basement': 'basement',

        // Security
        'alarm_system': 'alarm_system',
        'cctv': 'cctv',
        'smart_home': 'smart_home',
        'secure_parking': 'secure_parking',
        'gated_entrance': 'gated_entrance'
    };

    visionFeatures.forEach(feature => {
        const normalizedFeature = feature.toLowerCase().replace(/ /g, '_');

        // Check if we have a direct mapping
        if (featureMap[normalizedFeature]) {
            checkboxValues.add(featureMap[normalizedFeature]);
        }

        // Also check for partial matches
        Object.keys(featureMap).forEach(key => {
            if (normalizedFeature.includes(key) || key.includes(normalizedFeature)) {
                checkboxValues.add(featureMap[key]);
            }
        });

        // Direct match (if AI returns exact checkbox value)
        const checkbox = document.querySelector(`input[name="features"][value="${normalizedFeature}"]`);
        if (checkbox) {
            checkboxValues.add(normalizedFeature);
        }
    });

    return checkboxValues;
}

function detectFeaturesFromPhotos() {
    const detected = new Map(); // Use Map to avoid duplicates

    // 1. Detect from photo category assignments
    Object.keys(photoCategoryAssignments).forEach(category => {
        const photos = window.photoCategoryAssignments[category];
        const count = photos.length;

        if (count > 0) {
            // Map categories to feature values
            const categoryFeatureMap = {
                'garden': ['garden'],
                'kitchen': ['fitted_kitchen'],
                'bedrooms': determineBedrooms(count),
                'bathrooms': determineBathrooms(count),
                'exterior': ['parking', 'driveway'], // Common exterior features
            };

            if (categoryFeatureMap[category]) {
                categoryFeatureMap[category].forEach(feature => {
                    if (!detected.has(feature)) {
                        detected.set(feature, {
                            value: feature,
                            confidence: 90,
                            source: 'category'
                        });
                    }
                });
            }
        }
    });

    // 2. Detect from photo filenames
    uploadedPhotos.forEach(photo => {
        // Bug #54 fix: Check if photo.file exists before accessing properties
        if (!photo.file || !photo.file.name) {
            console.warn('⚠️ Photo missing file object:', photo);
            return;
        }

        const filename = photo.file.name.toLowerCase();
        const filenameFeatures = detectFromFilename(filename);

        filenameFeatures.forEach(feature => {
            if (!detected.has(feature.value)) {
                detected.set(feature.value, {
                    ...feature,
                    source: 'filename',
                    confidence: 85
                });
            }
        });
    });

    return Array.from(detected.values());
}

function determineBedrooms(count) {
    // Based on number of bedroom photos, suggest bedroom count
    const features = [];

    if (count === 1) features.push('1_bedroom');
    else if (count === 2) features.push('2_bedrooms');
    else if (count === 3) features.push('3_bedrooms');
    else if (count === 4) features.push('4_bedrooms');
    else if (count >= 5) features.push('5_bedrooms');

    // If multiple bedroom photos, likely has master bedroom
    if (count >= 2) features.push('master_bedroom');
    if (count >= 3) features.push('double_bedroom');

    return features;
}

function determineBathrooms(count) {
    // Based on number of bathroom photos, suggest bathroom features
    const features = [];

    if (count === 1) features.push('1_bathroom');
    else if (count === 2) features.push('2_bathrooms');
    else if (count >= 3) features.push('3_bathrooms');

    // Common bathroom features
    if (count >= 1) features.push('family_bathroom');
    if (count >= 2) features.push('ensuite');

    return features;
}

function detectFromFilename(filename) {
    const features = [];

    // Filename keyword mapping
    const keywordMap = {
        'garden': { value: 'garden', name: 'Garden' },
        'outdoor': { value: 'garden', name: 'Garden' },
        'patio': { value: 'patio', name: 'Patio' },
        'balcony': { value: 'balcony', name: 'Balcony' },
        'terrace': { value: 'terrace', name: 'Terrace' },
        'parking': { value: 'parking', name: 'Parking' },
        'garage': { value: 'garage', name: 'Garage' },
        'driveway': { value: 'driveway', name: 'Driveway' },
        'kitchen': { value: 'fitted_kitchen', name: 'Fitted Kitchen' },
        'fireplace': { value: 'fireplace', name: 'Fireplace' },
        'conservatory': { value: 'conservatory', name: 'Conservatory' },
        'ensuite': { value: 'ensuite', name: 'En-suite' },
        'bathroom': { value: 'family_bathroom', name: 'Family Bathroom' },
        'shower': { value: 'shower_room', name: 'Shower Room' },
        'pool': { value: 'swimming_pool', name: 'Swimming Pool' },
        'gym': { value: 'home_gym', name: 'Home Gym' },
        'cinema': { value: 'cinema_room', name: 'Cinema/Media Room' },
        'study': { value: 'study', name: 'Study/Office' },
        'office': { value: 'study', name: 'Study/Office' },
        'utility': { value: 'utility_room', name: 'Utility Room' },
        'loft': { value: 'loft_conversion', name: 'Loft Conversion' },
        'basement': { value: 'basement', name: 'Basement' },
        'period': { value: 'period_features', name: 'Period Features' },
        'victorian': { value: 'period_features', name: 'Period Features' },
        'sash': { value: 'sash_windows', name: 'Sash Windows' },
        'beams': { value: 'exposed_beams', name: 'Exposed Beams' }
    };

    // Check each keyword
    Object.keys(keywordMap).forEach(keyword => {
        if (filename.includes(keyword)) {
            features.push(keywordMap[keyword]);
        }
    });

    return features;
}

function mockDetectFeatures() {
    // Deprecated - now using real detection
    return detectFeaturesFromPhotos();
}

function applyDetectedFeature(featureValue) {
    const checkbox = document.querySelector(`input[name="features"][value="${featureValue}"]`);
    if (checkbox) {
        checkbox.checked = true;
        updateCompletionTracker();
        showToast('success', '✓ Feature applied to listing');

        // Remove from detected list
        const featureDiv = event.target.closest('div[style*="background: #e8f5e9"]');
        if (featureDiv) {
            featureDiv.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => featureDiv.remove(), 300);
        }
    }
}

// Add slide animation
const slideStyle = document.createElement('style');
slideStyle.textContent = `
    @keyframes slideOut {
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(slideStyle);


// ============================================================================
// PHOTOGRAPHER UPLOADS: Load and display photo folders from photographers
// ============================================================================

async function loadPhotographerUploads() {
    console.log('📸 Loading photographer uploads...');

    const officeId = localStorage.getItem('officeId');
    const userEmail = localStorage.getItem('userEmail');

    if (!officeId || !userEmail) {
        console.log('⚠️ No office or user email - skipping photographer uploads');
        return;
    }

    try {
        // Get uploads for this office
        const response = await fetch(`/office/photographer-uploads/${officeId}`);
        const data = await response.json();

        console.log(`📦 Found ${data.count} photographer uploads`);

        if (data.count === 0) {
            // No uploads - hide the section
            document.getElementById('photographerUploadsSection').style.display = 'none';
            return;
        }

        // Filter uploads assigned to this agent
        const myUploads = data.uploads.filter(upload => upload.agent_email === userEmail);

        if (myUploads.length === 0) {
            console.log('ℹ️ No uploads assigned to this agent');
            document.getElementById('photographerUploadsSection').style.display = 'none';
            return;
        }

        // Show the section
        document.getElementById('photographerUploadsSection').style.display = 'block';

        // Get unique photographers
        const photographers = [...new Set(myUploads.map(u => u.photographer_name || u.uploaded_by.split('@')[0]))];
        console.log('📷 Found photographers:', photographers);

        // Render photographer selector
        const uploadsList = document.getElementById('photographerUploadsList');

        // Always show photographer selector (even with one photographer)
        uploadsList.innerHTML = `
            <div style="display: flex; gap: 1.5rem; align-items: flex-start;">
                <!-- Left: Photographer Selector Box -->
                <div style="
                    min-width: 250px;
                    max-width: 250px;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    padding: 1rem;
                    background: white;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
                ">
                    <label style="
                        display: block;
                        font-weight: 600;
                        color: #333;
                        margin-bottom: 0.75rem;
                        font-size: 1rem;
                    ">
                        📷 Photographer
                    </label>
                    <select id="photographerFilter" onchange="filterPhotographerUploads()" style="
                        width: 100%;
                        padding: 0.65rem;
                        border: 2px solid #e0e0e0;
                        border-radius: 6px;
                        font-size: 0.95rem;
                        background: white;
                        cursor: pointer;
                    ">
                        <option value="">Select a photographer...</option>
                        ${photographers.map(name => {
                            const count = myUploads.filter(u => (u.photographer_name || u.uploaded_by.split('@')[0]) === name).length;
                            return `<option value="${name}">${name} (${count})</option>`;
                        }).join('')}
                    </select>
                </div>

                <!-- Right: Folders Grid Box -->
                <div style="
                    flex: 1;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    padding: 1rem;
                    background: white;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.08);
                    min-height: 200px;
                ">
                    <div id="photographerFoldersList" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem;"></div>
                </div>
            </div>
        `;

        // Store uploads globally for filtering
        window.allPhotographerUploads = myUploads;

        // Don't render folders initially - wait for selection

        console.log(`✅ Displayed ${myUploads.length} upload folders`);

    } catch (error) {
        console.error('❌ Failed to load photographer uploads:', error);
    }
}

// Render photographer folder cards
function renderPhotographerFolders(uploads) {
    const container = document.getElementById('photographerFoldersList') || document.getElementById('photographerUploadsList');

    if (uploads.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 3rem 1rem; grid-column: 1 / -1;">Select a photographer to view their folders</p>';
        return;
    }

    container.innerHTML = uploads.map(upload => `
            <div class="photographer-upload-folder" style="
                border: 1px solid #FFD500;
                border-radius: 6px;
                padding: 0.5rem;
                background: white;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 1px 3px rgba(0,0,0,0.08);
            " onmouseover="this.style.transform='translateY(-1px)'; this.style.boxShadow='0 2px 6px rgba(255, 213, 0, 0.25)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 1px 3px rgba(0,0,0,0.08)';" onclick="loadPhotosFromFolder('${upload.property_name}', ${JSON.stringify(upload.photos).replace(/"/g, '&quot;')})">
                <div style="font-size: 1.5rem; text-align: center; margin-bottom: 0.15rem;">📁</div>
                <h4 style="margin: 0 0 0.15rem 0; color: #333; text-align: center; font-weight: 600; font-size: 0.8rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${upload.property_name}</h4>
                <div style="text-align: center; font-size: 0.7rem; color: #666; margin-bottom: 0.35rem;">
                    ${upload.photo_count} photos
                </div>
                <button style="
                    background: linear-gradient(135deg, #FFD500 0%, #FFC107 100%);
                    color: #333;
                    border: none;
                    padding: 0.3rem 0.5rem;
                    border-radius: 4px;
                    font-weight: 600;
                    cursor: pointer;
                    width: 100%;
                    font-size: 0.75rem;
                ">
                    📥 Load
                </button>
            </div>
        `).join('');
}

// Filter photographer uploads by selected photographer
function filterPhotographerUploads() {
    const selectedPhotographer = document.getElementById('photographerFilter').value;
    console.log('📷 Filtering by photographer:', selectedPhotographer || 'None');

    if (!selectedPhotographer) {
        // Show empty state - nothing selected
        renderPhotographerFolders([]);
    } else {
        // Filter by photographer
        const filtered = window.allPhotographerUploads.filter(u =>
            (u.photographer_name || u.uploaded_by.split('@')[0]) === selectedPhotographer
        );
        renderPhotographerFolders(filtered);
    }
}

async function loadPhotosFromFolder(propertyName, photoPaths) {
    console.log(`📥 Loading ${photoPaths.length} photos from "${propertyName}"`);

    try {
        // For each photo path, load it as if the user uploaded it
        for (const photoPath of photoPaths) {
            // Fetch the photo as a blob
            const response = await fetch(photoPath);
            const blob = await response.blob();

            // Create a File object from the blob
            const filename = photoPath.split('/').pop();
            const file = new File([blob], filename, { type: blob.type });

            // Convert blob to data URL for preview rendering
            const dataUrl = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });

            // Add to uploaded photos using existing upload handler format
            // IMPORTANT: Must match the structure from handleFiles() - wrap file in object
            window.uploadedPhotos.push({
                file: file,
                dataUrl: dataUrl,
                name: filename
            });
            console.log(`  ✓ Loaded: ${filename}`);
        }

        // Switch to brochure mode if not already active
        const currentMode = window.currentMode || sessionStorage.getItem('selectedMode');
        if (currentMode !== 'brochure') {
            console.log('🔄 Auto-switching to brochure mode...');
            startMode('brochure');
        }

        // Display photos using the V2 photo preview system
        console.log('🖼️ Triggering photo display...');
        if (typeof displayPhotoPreviews === 'function') {
            displayPhotoPreviews();
        }

        // Trigger photo analysis for room detection
        if (typeof simulatePhotoAnalysis === 'function') {
            await simulatePhotoAnalysis();
        }

        // Show success message
        alert(`✅ Loaded ${photoPaths.length} photos from "${propertyName}"!\n\nPhotos are now ready for brochure generation. Scroll down to review and generate.`);

        // Scroll to brochure form after a short delay
        setTimeout(() => {
            const brochureSection = document.getElementById('brochureInputForm') || document.querySelector('[data-mode="brochure"]');
            if (brochureSection) {
                brochureSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 1000);

        console.log(`✅ Successfully loaded ${photoPaths.length} photos from photographer`);

    } catch (error) {
        console.error('❌ Failed to load photos from folder:', error);
        alert('❌ Failed to load some photos. Please try again.');
    }
}


// ============================================
// Export functions to window for onclick handlers
// ============================================
window.selectPhoto = selectPhoto;
window.loadPhotosFromFolder = loadPhotosFromFolder;
window.assignSelectedPhotoToCategory = assignSelectedPhotoToCategory;
window.removePhotoFromCategory = removePhotoFromCategory;
window.applyDetectedFeature = applyDetectedFeature;
