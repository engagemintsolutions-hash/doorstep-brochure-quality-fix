// Simple Progress Tracker - Fresh Start
console.log('🎯 Progress Tracker loaded');

// Create the tracker HTML
function createProgressTracker() {
    const tracker = document.getElementById('completionTracker');
    if (!tracker) return;

    tracker.innerHTML = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
            <div id="progressPercentage" style="font-size: 3rem; font-weight: bold; color: #9E0328;">0%</div>
        </div>

        <div style="position: relative; width: 200px; height: 200px; margin: 0 auto 1.5rem; overflow: hidden;">
            <!-- Background: Faded logo -->
            <img src="/static/doorstep-logo.png"
                 style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: contain; opacity: 0.15;">

            <!-- Foreground: Colored logo that fills from bottom -->
            <div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 0%; overflow: hidden; transition: height 0.5s ease;" id="progressFillContainer">
                <img src="/static/doorstep-logo.png"
                     style="position: absolute; bottom: 0; left: 0; width: 100%; height: 200px; object-fit: contain;
                            filter: brightness(1.2) saturate(1.5) drop-shadow(0 0 8px rgba(23, 162, 184, 0.6));">
            </div>
        </div>

        <div style="font-size: 0.85rem;">
            <div style="font-weight: bold; margin-bottom: 0.5rem;">Essential Tasks:</div>
            <div id="task1" style="padding: 0.3rem 0;">⚪ Upload 1+ photos (33%)</div>
            <div id="task2" style="padding: 0.3rem 0;">⚪ Complete property details (42%)</div>
            <div id="task3" style="padding: 0.3rem 0;">⚪ Select 5+ features (25%)</div>
        </div>
    `;

    console.log('✅ Progress tracker created');
}

// Update progress
function updateProgress() {
    console.log('🔄 updateProgress() called');
    let percentage = 0;

    // Task 1: Photos (33%) - Check window.uploadedPhotos (initialized by app_v2.js)
    const photos = window.uploadedPhotos || [];
    console.log('📸 Photos array:', photos, 'Length:', photos.length);

    const task1Element = document.getElementById('task1');
    if (!task1Element) {
        console.error('❌ task1 element not found!');
        return;
    }

    if (photos && photos.length >= 1) {
        percentage += 33;
        task1Element.innerHTML = '🟧 Upload 1+ photos (33%)';
    } else {
        task1Element.innerHTML = `⚪ Upload 1+ photos (${photos ? photos.length : 0}/1) (33%)`;
    }

    // Task 2: Property Details (42%) - ALL must be complete
    const bedroomCheckboxes = document.querySelectorAll('input[name="features"][value*="bedroom"]:checked');
    const bathroomCheckboxes = document.querySelectorAll('input[name="features"][value*="bathroom"]:checked, input[name="features"][value="ensuite"]:checked, input[name="features"][value="shower_room"]:checked, input[name="features"][value="downstairs_wc"]:checked, input[name="features"][value="family_bathroom"]:checked');
    const address = document.getElementById('address');
    const postcode = document.getElementById('postcode');
    const askingPrice = document.getElementById('askingPrice');
    const epcRating = document.getElementById('epcRating');
    const tenure = document.getElementById('tenure');

    const hasAddress = address && address.value.trim();
    const hasPostcode = postcode && postcode.value.trim();
    const hasPrice = askingPrice && askingPrice.value.trim();
    const hasEPC = epcRating && epcRating.value && epcRating.value !== '';
    const hasTenure = tenure && tenure.value && tenure.value !== '';
    const hasBedrooms = bedroomCheckboxes.length > 0;
    const hasBathrooms = bathroomCheckboxes.length > 0;

    // Count completed property details
    const detailsComplete = [hasAddress, hasPostcode, hasPrice, hasEPC, hasTenure, hasBedrooms, hasBathrooms].filter(Boolean).length;
    const detailsTotal = 7;

    console.log('🏠 Property Details:', detailsComplete + '/' + detailsTotal);
    console.log('   - Address:', hasAddress ? '✅' : '❌', address?.value);
    console.log('   - Postcode:', hasPostcode ? '✅' : '❌', postcode?.value);
    console.log('   - Price:', hasPrice ? '✅' : '❌', askingPrice?.value);
    console.log('   - EPC:', hasEPC ? '✅' : '❌', epcRating?.value);
    console.log('   - Tenure:', hasTenure ? '✅' : '❌', tenure?.value);
    console.log('   - Bedrooms:', hasBedrooms ? '✅ (' + bedroomCheckboxes.length + ')' : '❌');
    console.log('   - Bathrooms:', hasBathrooms ? '✅ (' + bathroomCheckboxes.length + ')' : '❌');

    if (detailsComplete === detailsTotal) {
        percentage += 42;
        document.getElementById('task2').innerHTML = '🟧 Complete property details (42%)';
        console.log('✅ Property details completed! New percentage:', percentage);
    } else {
        document.getElementById('task2').innerHTML = `⚪ Complete property details (${detailsComplete}/${detailsTotal}) (42%)`;
    }

    // Task 3: Features (25%)
    const features = document.querySelectorAll('input[name="features"]:checked');
    if (features.length >= 5) {
        percentage += 25;
        document.getElementById('task3').innerHTML = '🟧 Select 5+ features (25%)';
    } else {
        document.getElementById('task3').innerHTML = `⚪ Select 5+ features (${features.length}/5) (25%)`;
    }

    // Cap display at 100% but track actual percentage
    const displayPercentage = Math.min(percentage, 100);
    document.getElementById('progressPercentage').textContent = displayPercentage + '%';

    // Update fill height (use progressFillContainer instead of progressFill)
    const fillContainer = document.getElementById('progressFillContainer');
    if (fillContainer) {
        fillContainer.style.height = displayPercentage + '%';
    }

    // Show celebration popup when 100% reached (only once per session)
    if (percentage >= 100 && !window.premiumPopupShown) {
        window.premiumPopupShown = true;
        showPremiumPopup();
    }

    console.log('📊 Progress: ' + percentage + '% (display: ' + displayPercentage + '%) | Photos:', photos.length, '| Property Details:', detailsComplete + '/' + detailsTotal, '| Features:', features.length);
}

// Celebration popup for reaching 100%
function showPremiumPopup() {
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        background: linear-gradient(135deg, #C20430 0%, #9E0328 100%);
        color: white;
        padding: 2rem 3rem;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        z-index: 10000;
        text-align: center;
        animation: popupBounce 0.5s ease-out forwards;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    popup.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎉</div>
        <div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem;">Premium Listing Requirements Met!</div>
        <div style="font-size: 1rem; opacity: 0.95;">Your property listing is complete and ready to generate</div>
    `;

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes popupBounce {
            0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.05); }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes popupFadeOut {
            to { transform: translate(-50%, -50%) scale(0.9); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(popup);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        popup.style.animation = 'popupFadeOut 0.3s ease-out forwards';
        setTimeout(() => popup.remove(), 300);
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        createProgressTracker();
        updateProgress();

        // Listen for form changes (debounced)
        let timeout;
        document.addEventListener('change', () => {
            clearTimeout(timeout);
            timeout = setTimeout(updateProgress, 100);
        });

        document.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(updateProgress, 300);
        });
    }, 500);
});
