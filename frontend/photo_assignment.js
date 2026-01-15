// Photo Assignment System
console.log('📸 Photo assignment system loaded');

let uploadedPhotos = [];
let selectedPhoto = null;
let photoAssignments = {
    cover: [],
    exterior: [],
    interior: [],
    kitchen: [],
    bedrooms: [],
    bathrooms: [],
    garden: []
};

// Bug #48 fix: Keep photo assignment section hidden (deprecated - AI auto-categorization is now used)
function showPhotoAssignmentSection() {
    const photoAssignmentSection = document.getElementById('photoAssignmentSection');

    // ALWAYS keep this hidden - manual categorization is deprecated
    // Photos are now auto-categorized by AI and shown with emoji badges
    if (photoAssignmentSection) {
        photoAssignmentSection.style.display = 'none';
        console.log('ℹ️ Photo assignment section kept hidden (AI auto-categorization active)');
    }
}

// Monitor for photo uploads
function observePhotoUploads() {
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');

    if (!imagePreviewContainer) {
        console.log('⚠️ Image preview container not found');
        return;
    }

    // Create observer to watch for changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                showPhotoAssignmentSection();
                updatePhotoList();
            }
        });
    });

    // Start observing both child changes and attribute changes (like style)
    observer.observe(imagePreviewContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
    });

    console.log('👀 Observing photo uploads...');

    // Poll every 500ms to check for photos (backup method)
    setInterval(() => {
        showPhotoAssignmentSection();
    }, 500);

    // Initial check
    showPhotoAssignmentSection();
}

// Update the list of uploaded photos for assignment
function updatePhotoList() {
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    if (!imagePreviewContainer) return;

    // Get all uploaded photo thumbnails
    const photoElements = imagePreviewContainer.querySelectorAll('.image-preview-item');
    uploadedPhotos = Array.from(photoElements);

    console.log(`📷 ${uploadedPhotos.length} photos available for assignment`);
}

// Assign selected photo to category
function assignSelectedPhotoToCategory(category) {
    if (!selectedPhoto) {
        console.log('⚠️ No photo selected');
        return;
    }

    // Add photo to category
    if (!photoAssignments[category]) {
        photoAssignments[category] = [];
    }

    // Check if already assigned to this category
    const photoSrc = selectedPhoto.querySelector('img')?.src;
    if (photoAssignments[category].some(p => p.src === photoSrc)) {
        console.log(`ℹ️ Photo already assigned to ${category}`);
        return;
    }

    // Add to assignments
    photoAssignments[category].push({
        src: photoSrc,
        element: selectedPhoto.cloneNode(true)
    });

    // Update UI
    updateCategoryDisplay(category);
    updateProgressTracker();

    console.log(`✅ Photo assigned to ${category}`);
}

// Update category display with assigned photos
function updateCategoryDisplay(category) {
    const categoryPhotos = document.getElementById(`${category}-photos`);
    const categoryCount = document.getElementById(`${category}-count`);

    if (!categoryPhotos || !categoryCount) return;

    // Get theme color
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#C20430';

    // Clear existing photos
    categoryPhotos.innerHTML = '';

    // Add assigned photos
    const assigned = photoAssignments[category] || [];
    if (assigned.length === 0) {
        categoryPhotos.innerHTML = `<div style="color: #6c757d; font-size: 0.85rem; width: 100%; text-align: center; padding: 1rem;">Click to add ${category} photo</div>`;
    } else {
        assigned.forEach(photo => {
            const thumbnail = document.createElement('div');
            thumbnail.style.cssText = `width: 60px; height: 60px; border-radius: 4px; overflow: hidden; border: 2px solid ${primaryColor};`;
            thumbnail.innerHTML = `<img src="${photo.src}" style="width: 100%; height: 100%; object-fit: cover;">`;
            categoryPhotos.appendChild(thumbnail);
        });
    }

    // Update count
    categoryCount.textContent = assigned.length;
}

// Update progress tracker
function updateProgressTracker() {
    const totalAssigned = Object.values(photoAssignments).reduce((sum, arr) => sum + arr.length, 0);
    const coverCount = photoAssignments.cover?.length || 0;
    const exteriorCount = photoAssignments.exterior?.length || 0;
    const interiorCount = photoAssignments.interior?.length || 0;

    // Update progress text
    const progressText = document.getElementById('photoProgressText');
    const progressPercent = document.getElementById('photoProgressPercent');
    const progressBar = document.getElementById('photoProgressBar');

    if (progressText) progressText.textContent = `${totalAssigned} photos assigned`;

    // Calculate progress percentage (based on minimum requirements)
    const minPhotos = 15;
    const percentage = Math.min(100, Math.round((totalAssigned / minPhotos) * 100));

    if (progressPercent) progressPercent.textContent = `${percentage}%`;
    if (progressBar) progressBar.style.width = `${percentage}%`;

    // Update requirements
    updateRequirement('req-cover', coverCount >= 1);
    updateRequirement('req-exterior', exteriorCount >= 3);
    updateRequirement('req-interior', interiorCount >= 3);
    updateRequirement('req-min', totalAssigned >= 15);
}

// Update requirement checkmark
function updateRequirement(reqId, met) {
    const req = document.getElementById(reqId);
    if (!req) return;

    if (met) {
        req.innerHTML = req.innerHTML.replace('✗', '✓');
        req.style.color = '#28a745';
    } else {
        req.innerHTML = req.innerHTML.replace('✓', '✗');
        req.style.color = '#dc3545';
    }
}

// Handle photo selection
function setupPhotoSelection() {
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    if (!imagePreviewContainer) return;

    imagePreviewContainer.addEventListener('click', (e) => {
        const photoItem = e.target.closest('.image-preview-item');
        if (!photoItem) return;

        // Deselect previous
        if (selectedPhoto) {
            selectedPhoto.style.border = '';
            selectedPhoto.classList.remove('selected');
        }

        // Select new
        selectedPhoto = photoItem;
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#C20430';
        selectedPhoto.style.border = `3px solid ${primaryColor}`;
        selectedPhoto.classList.add('selected');

        console.log('📌 Photo selected');
    });
}

// Keyboard shortcuts (1-7 for categories)
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (!selectedPhoto) return;

        const categories = ['cover', 'exterior', 'interior', 'kitchen', 'bedrooms', 'bathrooms', 'garden'];
        const key = parseInt(e.key);

        if (key >= 1 && key <= 7) {
            assignSelectedPhotoToCategory(categories[key - 1]);
        }
    });
}

// Initialize on page load
function initPhotoAssignment() {
    console.log('🎬 Initializing photo assignment system...');

    observePhotoUploads();
    setupPhotoSelection();
    setupKeyboardShortcuts();

    console.log('✅ Photo assignment system ready');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPhotoAssignment);
} else {
    initPhotoAssignment();
}

// Export functions for external use
window.assignSelectedPhotoToCategory = assignSelectedPhotoToCategory;
window.showPhotoAssignmentSection = showPhotoAssignmentSection;
