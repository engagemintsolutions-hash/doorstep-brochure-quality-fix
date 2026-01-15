/**
 * Floorplan Upload System - V3 Fresh Implementation
 * Clean, simple implementation with no legacy code
 */

// Global storage for floorplan file
window.propertyFloorPlan = null;

// Initialize the floorplan upload system
function initFloorplanSystem() {
    const uploadZone = document.getElementById('floorplanUploadZone');
    const fileInput = document.getElementById('floorplanFileInput');
    const preview = document.getElementById('floorplanPreviewArea');

    if (!uploadZone || !fileInput || !preview) {
        console.warn('Floorplan elements not found in DOM');
        return;
    }

    // Click to trigger file input
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });

    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#007bff';
        uploadZone.style.background = '#f0f8ff';
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.style.borderColor = '#ddd';
        uploadZone.style.background = 'white';
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '#ddd';
        uploadZone.style.background = 'white';

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFloorplanFile(file);
        }
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFloorplanFile(file);
        }
    });

    console.log('✅ Floorplan system initialized');
}

// Handle file upload
function handleFloorplanFile(file) {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
        showToast('error', 'Please upload an image (JPG, PNG, WebP) or PDF file');
        return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
        showToast('error', 'Floorplan must be under 10MB');
        return;
    }

    // Store file
    window.propertyFloorPlan = file;

    // Hide upload zone immediately
    const uploadZone = document.getElementById('floorplanUploadZone');
    if (uploadZone) {
        uploadZone.style.display = 'none';
    }

    // Show preview AND store dataUrl for brochure builder
    const reader = new FileReader();
    reader.onload = (e) => {
        // Store dataUrl globally for brochure builder
        window.floorplanDataUrl = e.target.result;

        const preview = document.getElementById('floorplanPreviewArea');
        if (!preview) return;

        if (file.type === 'application/pdf') {
            preview.innerHTML = `
                <div style="padding: 2rem; text-align: center; background: #f8f9fa; border-radius: 8px;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📄</div>
                    <div style="font-weight: 600; color: #28a745; margin-bottom: 0.5rem;">Floor Plan PDF Uploaded</div>
                    <div style="font-size: 0.9rem; color: #666; margin-bottom: 1.5rem;">${file.name}</div>
                    <button onclick="removeFloorplan()" style="background: #dc3545; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        Remove Floorplan
                    </button>
                </div>
            `;
        } else {
            preview.innerHTML = `
                <div style="position: relative; text-align: center;">
                    <img src="${e.target.result}" style="max-width: 100%; max-height: 400px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" alt="Floorplan Preview">
                    <div style="margin-top: 1rem;">
                        <button onclick="removeFloorplan()" style="background: #dc3545; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 600;">
                            Remove Floorplan
                        </button>
                    </div>
                </div>
            `;
        }

        preview.style.display = 'block';
    };

    reader.readAsDataURL(file);
    showToast('success', 'Floorplan uploaded successfully');

    // Update completion tracker if it exists
    if (typeof updateCompletionTracker === 'function') {
        updateCompletionTracker();
    }
}

// Remove floorplan
function removeFloorplan() {
    window.propertyFloorPlan = null;
    window.floorplanDataUrl = null;  // Clear dataUrl too

    const uploadZone = document.getElementById('floorplanUploadZone');
    const preview = document.getElementById('floorplanPreviewArea');
    const fileInput = document.getElementById('floorplanFileInput');

    if (uploadZone) uploadZone.style.display = 'flex';
    if (preview) {
        preview.style.display = 'none';
        preview.innerHTML = '';
    }
    if (fileInput) fileInput.value = '';

    showToast('info', 'Floorplan removed');

    // Update completion tracker if it exists
    if (typeof updateCompletionTracker === 'function') {
        updateCompletionTracker();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFloorplanSystem);
} else {
    initFloorplanSystem();
}
