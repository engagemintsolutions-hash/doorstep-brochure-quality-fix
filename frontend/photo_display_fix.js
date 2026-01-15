// TEMPORARY FIX FOR PHOTO DISPLAY ISSUES
console.log('🔧 Photo display fix loaded');

// Force photo container to display as grid
function forcePhotoGridDisplay() {
    const container = document.getElementById('imagePreviewContainer');

    if (container) {
        // Check if there are photos
        const hasPhotos = uploadedPhotos && uploadedPhotos.length > 0;

        if (hasPhotos) {
            // Force display
            container.style.display = 'grid';
            container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
            container.style.gap = '1rem';
            container.style.marginTop = '1rem';

            console.log(`✅ Photo grid forced: ${uploadedPhotos.length} photos`);
        }
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Photo display fix initializing...');

    // Check every second for photos
    setInterval(() => {
        if (window.uploadedPhotos && window.uploadedPhotos.length > 0) {
            forcePhotoGridDisplay();
        }
    }, 1000);
});

// Also run immediately if photos already exist
if (window.uploadedPhotos && window.uploadedPhotos.length > 0) {
    setTimeout(forcePhotoGridDisplay, 100);
}

console.log('✅ Photo display fix ready');
