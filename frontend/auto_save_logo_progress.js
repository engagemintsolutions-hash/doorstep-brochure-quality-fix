// Auto-save, Logo, and Progress System Integration
console.log('🔄 Auto-save and Progress System loaded');

// Global variables
window.uploadedPhotos = window.uploadedPhotos || [];
window.uploadedFloorPlan = window.uploadedFloorPlan || null;
window.uploadedExampleBrochure = window.uploadedExampleBrochure || null;

// Initialize file upload handlers
document.addEventListener('DOMContentLoaded', () => {
    console.log('📁 Initializing file upload handlers...');

    // Photo Upload Handler
    // Bug #53 fix: Disabled - main handler in app_v2.js handles photo uploads properly
    const photoInput = document.getElementById('imageInput');
    const imageUploadZone = document.getElementById('imageUploadZone');

    if (photoInput) {
        console.log('✅ Found imageInput (handler delegated to app_v2.js)');
        // photoInput.addEventListener('change', handlePhotoUpload);  // DISABLED

        // Add click handler to upload zone
        if (imageUploadZone) {
            imageUploadZone.addEventListener('click', () => {
                console.log('🖱️ Image upload zone clicked');
                photoInput.click();
            });

            // Add drag and drop handlers
            imageUploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                imageUploadZone.style.borderColor = '#C20430';
                imageUploadZone.style.background = 'rgba(23, 162, 184, 0.05)';
            });

            imageUploadZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                imageUploadZone.style.borderColor = '';
                imageUploadZone.style.background = '';
            });

            imageUploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                imageUploadZone.style.borderColor = '';
                imageUploadZone.style.background = '';

                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    console.log(`📥 Dropped ${files.length} files`);
                    // Create a new DataTransfer to set files
                    const dataTransfer = new DataTransfer();
                    Array.from(files).forEach(file => dataTransfer.items.add(file));
                    photoInput.files = dataTransfer.files;

                    // Trigger change event
                    const event = new Event('change', { bubbles: true });
                    photoInput.dispatchEvent(event);
                }
            });

            console.log('✅ Image upload zone click and drag handlers attached');
        }
    } else {
        console.error('❌ imageInput not found');
    }

    // Floor Plan Upload Handler - V3 with new IDs
    const floorPlanInput = document.getElementById('floorplanFileInput');
    const floorPlanUploadZone = document.getElementById('floorplanUploadZone');

    if (floorPlanInput) {
        console.log('✅ Found floorplanFileInput');
        // Floorplan upload is now handled by floorplan_upload.js
        console.log('ℹ️ Floorplan system managed by floorplan_upload.js');
    } else {
        console.log('ℹ️ floorplanFileInput not found (handled by floorplan_upload.js)');
    }

    // Example Brochure Upload Handler
    const brochureInput = document.getElementById('brochurePdfInput');
    const brochureUploadZone = document.getElementById('brochurePdfUploadZone');

    if (brochureInput) {
        console.log('✅ Found brochurePdfInput');
        brochureInput.addEventListener('change', handleBrochureUpload);

        // Add click handler to upload zone
        if (brochureUploadZone) {
            brochureUploadZone.addEventListener('click', () => {
                console.log('🖱️ Brochure upload zone clicked');
                brochureInput.click();
            });
            console.log('✅ Brochure upload zone click handler attached');
        }
    } else {
        console.error('❌ brochurePdfInput not found');
    }
});

// Photo Upload Handler
async function handlePhotoUpload(event) {
    console.log('📸 Photo upload triggered');
    const files = Array.from(event.target.files);

    if (files.length === 0) {
        console.log('No files selected');
        return;
    }

    console.log(`Processing ${files.length} photos`);
    const previewContainer = document.getElementById('imagePreviewContainer');
    if (!previewContainer) {
        console.error('❌ imagePreviewContainer not found');
        return;
    }

    // Bug #50 fix: Don't clear existing photos when adding more
    // The main handler in app_v2.js handles the uploadedPhotos array
    // This handler is mainly for UI preview during draft restoration
    previewContainer.style.display = 'block';

    // Process each file
    for (const file of files) {
        console.log(`Processing: ${file.name}`);

        // Create preview card
        const card = document.createElement('div');
        card.className = 'photo-preview-card';
        card.style.cssText = `
            display: inline-block;
            margin: 0.5rem;
            padding: 0.5rem;
            border: 2px solid #C20430;
            border-radius: 8px;
            background: white;
            position: relative;
        `;

        // Create image element
        const img = document.createElement('img');
        img.style.cssText = `
            width: 150px;
            height: 150px;
            object-fit: cover;
            border-radius: 4px;
        `;

        // Read file and create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
            window.uploadedPhotos.push({
                name: file.name,
                data: e.target.result
            });
            console.log(`✅ Photo loaded: ${file.name}`);

            // Update progress tracker
            if (typeof updateProgress === 'function') {
                updateProgress();
            }
        };
        reader.readAsDataURL(file);

        // Add remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: #9E0328;
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            cursor: pointer;
            font-size: 16px;
            line-height: 1;
        `;
        removeBtn.onclick = () => {
            const index = window.uploadedPhotos.findIndex(p => p.name === file.name);
            if (index > -1) {
                window.uploadedPhotos.splice(index, 1);
            }
            card.remove();
            console.log(`Removed photo: ${file.name}`);

            // Update progress tracker
            if (typeof updateProgress === 'function') {
                updateProgress();
            }
        };

        card.appendChild(img);
        card.appendChild(removeBtn);
        previewContainer.appendChild(card);
    }

    console.log(`Total photos uploaded: ${window.uploadedPhotos.length}`);
}

// Floor Plan Upload Handler
function handleFloorPlanUpload(event) {
    console.log('🗺️ Floor plan upload triggered');
    const file = event.target.files[0];

    if (!file) {
        console.log('No file selected');
        return;
    }

    console.log(`Processing floor plan: ${file.name}`);
    const previewContainer = document.getElementById('floorPlanPreview');
    if (!previewContainer) {
        console.error('❌ floorPlanPreview not found');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        window.uploadedFloorPlan = {
            name: file.name,
            data: e.target.result
        };

        previewContainer.innerHTML = `
            <div style="position: relative; display: inline-block;">
                <img src="${e.target.result}"
                     style="max-width: 300px; max-height: 200px; border-radius: 8px; border: 2px solid #C20430;">
                <button onclick="removeFloorPlan()"
                        style="position: absolute; top: 5px; right: 5px; background: #9E0328; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-size: 16px;">×</button>
            </div>
        `;
        previewContainer.style.display = 'block';
        console.log(`✅ Floor plan loaded: ${file.name}`);

        // Update progress tracker
        if (typeof updateProgress === 'function') {
            updateProgress();
        }
    };
    reader.readAsDataURL(file);
}

// Remove floor plan function (called from inline onclick)
window.removeFloorPlan = function() {
    console.log('Removing floor plan');
    window.uploadedFloorPlan = null;
    const previewContainer = document.getElementById('floorPlanPreview');
    if (previewContainer) {
        previewContainer.innerHTML = '';
        previewContainer.style.display = 'none';
    }
    const input = document.getElementById('floorPlanInput');
    if (input) {
        input.value = '';
    }

    // Update progress tracker
    if (typeof updateProgress === 'function') {
        updateProgress();
    }
};

// Example Brochure Upload Handler
function handleBrochureUpload(event) {
    console.log('📄 Example brochure upload triggered');
    const file = event.target.files[0];

    if (!file) {
        console.log('No file selected');
        return;
    }

    console.log(`Processing brochure: ${file.name}`);
    const previewContainer = document.getElementById('brochurePdfPreview');
    if (!previewContainer) {
        console.error('❌ brochurePdfPreview not found');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        window.uploadedExampleBrochure = {
            name: file.name,
            data: e.target.result
        };

        previewContainer.innerHTML = `
            <div style="position: relative; display: inline-block;">
                <img src="${e.target.result}"
                     style="max-width: 300px; max-height: 200px; border-radius: 8px; border: 2px solid #C20430;">
                <button onclick="removeBrochure()"
                        style="position: absolute; top: 5px; right: 5px; background: #9E0328; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-size: 16px;">×</button>
            </div>
        `;
        previewContainer.style.display = 'block';
        console.log(`✅ Brochure loaded: ${file.name}`);
    };
    reader.readAsDataURL(file);
}

// Remove brochure function (called from inline onclick)
window.removeBrochure = function() {
    console.log('Removing brochure');
    window.uploadedExampleBrochure = null;
    const previewContainer = document.getElementById('brochurePdfPreview');
    if (previewContainer) {
        previewContainer.innerHTML = '';
        previewContainer.style.display = 'none';
    }
    const input = document.getElementById('brochurePdfInput');
    if (input) {
        input.value = '';
    }
};

console.log('✅ File upload handlers initialized');
