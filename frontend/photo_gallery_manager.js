/**
 * PHOTO GALLERY MANAGER
 * Drag-and-drop photo reordering and management
 */

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const PhotoGalleryState = {
    draggedPhoto: null,
    draggedFromPage: null,
    dropTarget: null,
    unassignedPhotos: [],
    isInitialized: false
};

// ============================================================================
// INITIALIZATION
// ============================================================================

function initializePhotoGallery() {
    if (PhotoGalleryState.isInitialized) return;

    console.log("Initializing photo gallery...");

    // Tab switching
    const tabs = document.querySelectorAll(".gallery-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => switchGalleryTab(tab.dataset.tab));
    });

    // Toggle gallery visibility
    const toggleBtn = document.getElementById("toggleGalleryBtn");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", togglePhotoGallery);
    }

    PhotoGalleryState.isInitialized = true;
    console.log("Photo gallery initialized");
}

// ============================================================================
// TAB SWITCHING
// ============================================================================

function switchGalleryTab(tabName) {
    // Update tab buttons
    document.querySelectorAll(".gallery-tab").forEach(tab => {
        tab.classList.toggle("active", tab.dataset.tab === tabName);
    });

    // Update content panels
    document.querySelectorAll(".gallery-content").forEach(content => {
        content.classList.remove("active");
    });

    // Show selected content
    const contentMap = {
        "by-page": "galleryByPage",
        "all-photos": "galleryAllPhotos",
        "unassigned": "galleryUnassigned"
    };

    const contentId = contentMap[tabName];
    if (contentId) {
        document.getElementById(contentId).classList.add("active");
    }
}

function togglePhotoGallery() {
    const gallery = document.getElementById("photoGallery");
    const main = document.querySelector(".editor-main");

    gallery.classList.toggle("hidden");
    main.classList.toggle("gallery-hidden");
}

// ============================================================================
// POPULATE GALLERY
// ============================================================================

function populatePhotoGallery(sessionData) {
    console.log("Populating photo gallery with session data:", sessionData);

    if (!sessionData || !sessionData.photos) {
        console.warn("No photos in session data");
        return;
    }

    // Populate "By Page" view
    populateByPageView(sessionData);

    // Populate "All Photos" view
    populateAllPhotosView(sessionData);

    // Populate "Unassigned" view
    populateUnassignedView();
}

function populateByPageView(sessionData) {
    const container = document.getElementById("galleryByPage");
    if (!container) return;

    container.innerHTML = "";

    // Group photos by page
    const photosByPage = {};

    if (sessionData.pages && Array.isArray(sessionData.pages)) {
        sessionData.pages.forEach(page => {
            if (page.photos && page.photos.length > 0) {
                photosByPage[page.id] = {
                    title: page.title || page.type,
                    photos: page.photos
                };
            }
        });
    }

    // Render each page group
    Object.keys(photosByPage).forEach(pageId => {
        const pageGroup = photosByPage[pageId];
        const groupHTML = createPageGroupHTML(pageId, pageGroup);
        container.insertAdjacentHTML("beforeend", groupHTML);
    });

    console.log(`📸 Populated ${Object.keys(photosByPage).length} page groups in gallery`);
}

function createPageGroupHTML(pageId, pageGroup) {
    const photos = pageGroup.photos || [];
    const photosHTML = photos.map((photo, index) =>
        createPhotoItemHTML(photo, pageId, index)
    ).join("");

    return `
        <div class="gallery-page-group" data-page-id="${pageId}">
            <div class="gallery-page-header" onclick="togglePageGroup('${pageId}')">
                <span class="gallery-page-title">${pageGroup.title}</span>
                <span class="gallery-page-count">${photos.length} photo${photos.length !== 1 ? 's' : ''}</span>
            </div>
            <div class="gallery-page-photos" data-page-id="${pageId}">
                ${photosHTML}
            </div>
        </div>
    `;
}

function createPhotoItemHTML(photo, pageId, index) {
    const photoId = photo.id || `photo-${index}`;

    // Use EditorState.photoUrls to get the correct photo URL (same as main brochure)
    const photoUrl = EditorState.photoUrls[photoId] || photo.dataUrl || photo.url || "";
    const photoName = photo.name || `Photo ${index + 1}`;

    return `
        <div class="gallery-photo-item"
             data-photo-id="${photoId}"
             data-page-id="${pageId}"
             data-photo-index="${index}"
             onclick="selectGalleryPhoto('${photoId}', '${pageId}')">
            <img src="${photoUrl}" alt="${photoName}">
            <div class="gallery-photo-name">${photoName}</div>
        </div>
    `;
}

function populateAllPhotosView(sessionData) {
    const container = document.getElementById("galleryAllPhotos");
    if (!container) return;

    const allPhotos = [];

    if (sessionData.photos && Array.isArray(sessionData.photos)) {
        allPhotos.push(...sessionData.photos);
    }

    container.innerHTML = `<div class="photo-grid">${
        allPhotos.map((photo, index) => createPhotoItemHTML(photo, "all", index)).join("")
    }</div>`;

    console.log(`📸 Populated ${allPhotos.length} photos in All Photos view`);
}

function populateUnassignedView() {
    const container = document.getElementById("unassignedPhotoGrid");
    const hint = document.querySelector(".unassigned-hint");

    if (!container) return;

    if (PhotoGalleryState.unassignedPhotos.length === 0) {
        container.innerHTML = "";
        if (hint) hint.classList.remove("has-photos");
    } else {
        if (hint) hint.classList.add("has-photos");
        container.innerHTML = PhotoGalleryState.unassignedPhotos.map((photo, index) =>
            createPhotoItemHTML(photo, "unassigned", index)
        ).join("");
        console.log(`📸 Populated ${PhotoGalleryState.unassignedPhotos.length} unassigned photos`);
    }
}

function togglePageGroup(pageId) {
    const photosContainer = document.querySelector(`.gallery-page-photos[data-page-id="${pageId}"]`);
    if (photosContainer) {
        photosContainer.classList.toggle("collapsed");
    }
}

// ============================================================================
// SIMPLE CLICK-BASED PHOTO SELECTION
// ============================================================================

function selectGalleryPhoto(photoId, pageId) {
    console.log(`📸 Photo selected: ${photoId} from ${pageId}`);

    // Store selected photo
    PhotoGalleryState.selectedPhoto = { photoId, pageId };

    // Visual feedback - highlight selected photo
    document.querySelectorAll(".gallery-photo-item").forEach(item => {
        item.classList.remove("selected");
    });

    const selectedItem = document.querySelector(`[data-photo-id="${photoId}"][data-page-id="${pageId}"]`);
    if (selectedItem) {
        selectedItem.classList.add("selected");
    }

    showToast("Photo selected - click on any photo slot in the brochure to place it", "info");
}

// Add click handlers to photo slots in brochure pages
function attachBrochurePhotoClickHandlers() {
    // Find all photo containers - both .photo-element and .layout-photo classes
    const photoContainers = document.querySelectorAll(".photo-element, .layout-photo");

    photoContainers.forEach((container) => {
        // Remove existing handler to prevent duplicates
        container.removeEventListener("click", handleBrochurePhotoClick);

        // Add click handler
        container.addEventListener("click", handleBrochurePhotoClick);

        // Add visual hint on hover
        container.style.cursor = "pointer";
        container.title = "Click to change photo";

        // Add subtle border to indicate clickable
        container.style.border = "2px solid transparent";
        container.style.transition = "border-color 0.2s";

        // Hover effect
        container.addEventListener("mouseenter", function() {
            this.style.borderColor = "#f59e0b";
        });
        container.addEventListener("mouseleave", function() {
            this.style.borderColor = "transparent";
        });
    });

    console.log(`📎 Attached click handlers to ${photoContainers.length} photo slots`);
}

function handleBrochurePhotoClick(e) {
    e.stopPropagation();

    if (!PhotoGalleryState.selectedPhoto) {
        showToast("Please select a photo from the gallery first", "warning");
        return;
    }

    const photoContainer = e.currentTarget;
    const pageElement = photoContainer.closest(".brochure-page");

    if (!pageElement) {
        console.error("Could not find page element");
        return;
    }

    const pageId = pageElement.id;
    const { photoId } = PhotoGalleryState.selectedPhoto;

    console.log(`🔄 Replacing photo in ${pageId}`);

    // Replace the photo
    replacePhotoInBrochure(photoContainer, photoId, pageId);

    // Clear selection
    PhotoGalleryState.selectedPhoto = null;
    document.querySelectorAll(".gallery-photo-item").forEach(item => {
        item.classList.remove("selected");
    });
}

// ============================================================================
// PHOTO REPLACEMENT LOGIC
// ============================================================================

function replacePhotoInBrochure(photoContainer, newPhotoId, pageId) {
    console.log(`🔄 Replacing photo in ${pageId} with ${newPhotoId}`);

    // Get the new photo URL
    const newPhotoUrl = EditorState.photoUrls[newPhotoId];

    if (!newPhotoUrl) {
        console.error("Photo URL not found for:", newPhotoId);
        showToast("Error: Photo not found", "error");
        return;
    }

    // Update the image
    let img = photoContainer.querySelector("img");

    if (!img) {
        // Create new img if slot is empty
        img = document.createElement("img");
        img.loading = "lazy";
        photoContainer.appendChild(img);
    }

    img.src = newPhotoUrl;
    img.alt = "Property photo";

    // Update session data
    updateSessionPhotoData(pageId, photoContainer, newPhotoId);

    // Mark as dirty for auto-save
    EditorState.isDirty = true;

    showToast("Photo replaced successfully", "success");

    console.log("✅ Photo replaced and session updated");
}

function updateSessionPhotoData(pageId, photoContainer, newPhotoId) {
    if (!EditorState || !EditorState.sessionData) return;

    const page = EditorState.sessionData.pages.find(p => p.id === pageId);
    if (!page) return;

    // Find the photo object by scanning all session photos
    const allPhotos = EditorState.sessionData.photos || [];
    const newPhoto = allPhotos.find(p => p.id === newPhotoId);

    if (!newPhoto) {
        console.warn("Photo not found in session data:", newPhotoId);
        return;
    }

    // The photoContainer itself is the .photo-element
    // Get index of this photo container among its siblings
    const allPhotoElements = photoContainer.parentElement.querySelectorAll(".photo-element");
    const photoIndex = Array.from(allPhotoElements).indexOf(photoContainer);

    // Initialize photos array if needed
    if (!page.photos) {
        page.photos = [];
    }

    // Replace or add photo at this index
    page.photos[photoIndex] = newPhoto;

    console.log(`Updated page ${pageId} photos:`, page.photos);
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

// Make functions available globally
window.togglePageGroup = togglePageGroup;
window.selectGalleryPhoto = selectGalleryPhoto;
window.attachBrochurePhotoClickHandlers = attachBrochurePhotoClickHandlers;

// Initialize when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePhotoGallery);
} else {
    initializePhotoGallery();
}

console.log("✅ Photo gallery manager loaded (click-based)");
