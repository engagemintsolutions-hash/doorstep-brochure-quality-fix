/**
 * CANVA-STYLE IMAGE EDITOR
 * Click-to-select images with corner radius, fit, and position controls
 */

// ============================================================================
// STATE
// ============================================================================

const ImageEditorState = {
    selectedElement: null,
    selectedPhotoId: null,
    isInitialized: false,
    // Default adjustment values
    defaults: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        rotation: 0,
        flipH: false,
        flipV: false
    },
    // Crop state
    crop: {
        active: false,
        ratio: 'free',
        overlay: null,
        startX: 0,
        startY: 0,
        cropX: 0,
        cropY: 0,
        cropWidth: 100,
        cropHeight: 100
    }
};

// ============================================================================
// INITIALIZATION
// ============================================================================

function initializeImageEditor() {
    if (ImageEditorState.isInitialized) return;

    console.log('🖼️ Initializing Canva-style image editor...');

    // Create the floating properties panel
    createPropertiesPanel();

    // Add click listeners to document for deselection
    document.addEventListener('click', handleDocumentClick);

    // Add keyboard listener for escape to deselect
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            deselectImage();
        }
    });

    ImageEditorState.isInitialized = true;
    console.log('✅ Image editor initialized');
}

// ============================================================================
// PROPERTIES PANEL
// ============================================================================

function createPropertiesPanel() {
    // Check if panel already exists
    if (document.getElementById('imagePropertiesPanel')) return;

    const panel = document.createElement('div');
    panel.id = 'imagePropertiesPanel';
    panel.className = 'image-properties-panel';
    panel.innerHTML = `
        <div class="properties-header">
            <h3>📷 Image Settings</h3>
            <button class="properties-close" onclick="deselectImage()">×</button>
        </div>
        <div class="properties-body">
            <!-- Corner Radius Section -->
            <div class="property-section">
                <div class="property-section-title">Corner Radius</div>
                <div class="radius-presets">
                    <button class="radius-preset active" data-radius="0" onclick="setCornerRadius(0)">
                        <div class="radius-preset-preview"></div>
                    </button>
                    <button class="radius-preset" data-radius="8" onclick="setCornerRadius(8)">
                        <div class="radius-preset-preview"></div>
                    </button>
                    <button class="radius-preset" data-radius="16" onclick="setCornerRadius(16)">
                        <div class="radius-preset-preview"></div>
                    </button>
                    <button class="radius-preset" data-radius="50" onclick="setCornerRadius(50)">
                        <div class="radius-preset-preview"></div>
                    </button>
                </div>
                <div class="radius-slider-container">
                    <input type="range" id="radiusSlider" min="0" max="50" value="0"
                           oninput="setCornerRadius(this.value)">
                    <span id="radiusValue" class="radius-value-display">0px</span>
                </div>
            </div>

            <!-- Image Fit Section -->
            <div class="property-section">
                <div class="property-section-title">Image Fit</div>
                <div class="fit-options">
                    <button class="fit-option active" data-fit="cover" onclick="setImageFit('cover')">
                        <div class="fit-option-icon">⬛</div>
                        <div class="fit-option-label">Fill</div>
                    </button>
                    <button class="fit-option" data-fit="contain" onclick="setImageFit('contain')">
                        <div class="fit-option-icon">🔲</div>
                        <div class="fit-option-label">Fit</div>
                    </button>
                    <button class="fit-option" data-fit="none" onclick="setImageFit('none')">
                        <div class="fit-option-icon">📐</div>
                        <div class="fit-option-label">Actual</div>
                    </button>
                </div>
            </div>

            <!-- Image Position Section -->
            <div class="property-section">
                <div class="property-section-title">Image Position</div>
                <div class="position-grid">
                    <button class="position-btn" data-pos="top left" onclick="setImagePosition('top left')"></button>
                    <button class="position-btn" data-pos="top center" onclick="setImagePosition('top center')"></button>
                    <button class="position-btn" data-pos="top right" onclick="setImagePosition('top right')"></button>
                    <button class="position-btn" data-pos="center left" onclick="setImagePosition('center left')"></button>
                    <button class="position-btn active" data-pos="center center" onclick="setImagePosition('center center')"></button>
                    <button class="position-btn" data-pos="center right" onclick="setImagePosition('center right')"></button>
                    <button class="position-btn" data-pos="bottom left" onclick="setImagePosition('bottom left')"></button>
                    <button class="position-btn" data-pos="bottom center" onclick="setImagePosition('bottom center')"></button>
                    <button class="position-btn" data-pos="bottom right" onclick="setImagePosition('bottom right')"></button>
                </div>
            </div>

            <!-- Filter Presets Section -->
            <div class="property-section">
                <div class="property-section-title">Filter Presets</div>
                <div class="filter-presets">
                    <button class="filter-preset active" data-filter="none" onclick="applyFilterPreset('none')">
                        <div class="filter-preview"></div>
                        <span>Original</span>
                    </button>
                    <button class="filter-preset" data-filter="bw" onclick="applyFilterPreset('bw')">
                        <div class="filter-preview bw"></div>
                        <span>B&W</span>
                    </button>
                    <button class="filter-preset" data-filter="sepia" onclick="applyFilterPreset('sepia')">
                        <div class="filter-preview sepia"></div>
                        <span>Sepia</span>
                    </button>
                    <button class="filter-preset" data-filter="warm" onclick="applyFilterPreset('warm')">
                        <div class="filter-preview warm"></div>
                        <span>Warm</span>
                    </button>
                    <button class="filter-preset" data-filter="cool" onclick="applyFilterPreset('cool')">
                        <div class="filter-preview cool"></div>
                        <span>Cool</span>
                    </button>
                    <button class="filter-preset" data-filter="vivid" onclick="applyFilterPreset('vivid')">
                        <div class="filter-preview vivid"></div>
                        <span>Vivid</span>
                    </button>
                </div>
            </div>

            <!-- Image Adjustments Section -->
            <div class="property-section">
                <div class="property-section-title">Image Adjustments</div>
                <div class="adjustment-slider">
                    <label>
                        <span>Brightness</span>
                        <span id="brightnessValue">100%</span>
                    </label>
                    <input type="range" id="brightnessSlider" min="0" max="200" value="100"
                           oninput="setImageAdjustment('brightness', this.value)">
                </div>
                <div class="adjustment-slider">
                    <label>
                        <span>Contrast</span>
                        <span id="contrastValue">100%</span>
                    </label>
                    <input type="range" id="contrastSlider" min="0" max="200" value="100"
                           oninput="setImageAdjustment('contrast', this.value)">
                </div>
                <div class="adjustment-slider">
                    <label>
                        <span>Saturation</span>
                        <span id="saturationValue">100%</span>
                    </label>
                    <input type="range" id="saturationSlider" min="0" max="200" value="100"
                           oninput="setImageAdjustment('saturation', this.value)">
                </div>
                <button class="reset-btn" onclick="resetImageAdjustments()" title="Reset to defaults">
                    Reset Adjustments
                </button>
            </div>

            <!-- Transform Section -->
            <div class="property-section">
                <div class="property-section-title">Transform</div>
                <div class="adjustment-slider">
                    <label>
                        <span>Rotation</span>
                        <span id="rotationValue">0°</span>
                    </label>
                    <input type="range" id="rotationSlider" min="-180" max="180" value="0"
                           oninput="setImageRotation(this.value)">
                </div>
                <div class="flip-buttons">
                    <button class="flip-btn" id="flipHBtn" onclick="toggleFlip('horizontal')" title="Flip Horizontal">
                        ↔️ Flip H
                    </button>
                    <button class="flip-btn" id="flipVBtn" onclick="toggleFlip('vertical')" title="Flip Vertical">
                        ↕️ Flip V
                    </button>
                </div>
            </div>

            <!-- Image Scale/Zoom Section -->
            <div class="property-section">
                <div class="property-section-title">Image Scale</div>
                <div class="adjustment-slider">
                    <label>
                        <span>Zoom</span>
                        <span id="zoomValue">100%</span>
                    </label>
                    <input type="range" id="imageZoomSlider" min="50" max="200" value="100"
                           oninput="setImageZoom(this.value)">
                </div>
                <button class="reset-btn" onclick="resetImageZoom()" title="Reset to 100%">
                    Reset Zoom
                </button>
            </div>

            <!-- Crop Tool Section -->
            <div class="property-section">
                <div class="property-section-title">Crop</div>
                <div class="crop-aspect-ratios">
                    <button class="aspect-ratio-btn active" data-ratio="free" onclick="setCropRatio('free')">Free</button>
                    <button class="aspect-ratio-btn" data-ratio="1:1" onclick="setCropRatio('1:1')">1:1</button>
                    <button class="aspect-ratio-btn" data-ratio="4:3" onclick="setCropRatio('4:3')">4:3</button>
                    <button class="aspect-ratio-btn" data-ratio="16:9" onclick="setCropRatio('16:9')">16:9</button>
                </div>
                <div class="crop-actions" style="margin-top: 12px;">
                    <button class="crop-btn" id="cropModeBtn" onclick="toggleCropMode()">
                        ✂️ Enter Crop Mode
                    </button>
                </div>
                <div id="cropControls" class="crop-controls" style="display: none;">
                    <button class="crop-apply-btn" onclick="applyCrop()">✓ Apply Crop</button>
                    <button class="crop-cancel-btn" onclick="cancelCrop()">✕ Cancel</button>
                </div>
                <button class="reset-btn" id="resetCropBtn" onclick="resetCrop()" style="margin-top: 8px;">
                    Reset Crop
                </button>
            </div>

            <!-- Quick Actions -->
            <div class="property-section">
                <div class="property-section-title">Quick Actions</div>
                <div style="display: flex; gap: 8px;">
                    <button class="edit-control-btn" style="flex: 1; width: auto; padding: 8px;"
                            onclick="replaceImage()" title="Replace Image">
                        🔄 Replace
                    </button>
                    <button class="edit-control-btn" style="flex: 1; width: auto; padding: 8px;"
                            onclick="removeImage()" title="Remove Image">
                        🗑️ Remove
                    </button>
                </div>
            </div>

            <!-- AI Background Removal -->
            <div class="property-section bg-removal-section">
                <div class="property-section-title">AI Background Removal</div>
                <p class="bg-removal-help">Remove backgrounds from property photos with one click. Perfect for creating cutouts of furniture, staging items, or isolating subjects.</p>
                <div class="bg-removal-controls">
                    <button id="removeBackgroundBtn" class="bg-removal-btn" onclick="removeImageBackground()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 3l6 6-6 6"></path>
                            <path d="M9 21l-6-6 6-6"></path>
                            <path d="M21 9H9"></path>
                            <path d="M3 15h12"></path>
                        </svg>
                        Remove Background
                    </button>
                    <div id="bgRemovalProgress" class="bg-removal-progress" style="display: none;">
                        <div class="bg-removal-spinner"></div>
                        <span>Removing background...</span>
                    </div>
                </div>
                <button id="restoreOriginalBtn" class="restore-original-btn" onclick="restoreOriginalBackground()" style="display: none;">
                    Restore Original
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(panel);
}

function showPropertiesPanel() {
    const panel = document.getElementById('imagePropertiesPanel');
    if (panel) {
        panel.classList.add('visible');
    }
}

function hidePropertiesPanel() {
    const panel = document.getElementById('imagePropertiesPanel');
    if (panel) {
        panel.classList.remove('visible');
    }
}

// ============================================================================
// IMAGE SELECTION
// ============================================================================

function handleDocumentClick(e) {
    // Check if clicked on a photo element or inside properties panel
    const clickedPhoto = e.target.closest('.photo-element, .layout-photo');
    const clickedPanel = e.target.closest('.image-properties-panel');

    if (clickedPhoto) {
        e.stopPropagation();
        selectImage(clickedPhoto);
    } else if (!clickedPanel) {
        // Clicked outside photo and panel - deselect
        deselectImage();
    }
}

function selectImage(element) {
    // Deselect previous
    if (ImageEditorState.selectedElement) {
        ImageEditorState.selectedElement.classList.remove('selected');
    }

    // Select new
    element.classList.add('selected');
    ImageEditorState.selectedElement = element;

    // Get photo ID if available
    ImageEditorState.selectedPhotoId = element.dataset.photoId || null;

    // Update panel with current image settings
    updatePanelFromElement(element);

    // Show panel
    showPropertiesPanel();

    console.log('🖼️ Selected image:', ImageEditorState.selectedPhotoId);
}

function deselectImage() {
    if (ImageEditorState.selectedElement) {
        ImageEditorState.selectedElement.classList.remove('selected');
        ImageEditorState.selectedElement = null;
        ImageEditorState.selectedPhotoId = null;
    }
    hidePropertiesPanel();
}

function updatePanelFromElement(element) {
    const img = element.querySelector('img');
    if (!img) return;

    // Get current border radius
    const computedStyle = window.getComputedStyle(element);
    let radius = parseInt(computedStyle.borderRadius) || 0;

    // Also check inline style
    if (element.style.borderRadius) {
        radius = parseInt(element.style.borderRadius) || 0;
    }

    // Update slider and presets
    const slider = document.getElementById('radiusSlider');
    const valueDisplay = document.getElementById('radiusValue');
    if (slider) slider.value = radius;
    if (valueDisplay) valueDisplay.textContent = `${radius}px`;

    // Update preset buttons
    document.querySelectorAll('.radius-preset').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.radius) === radius);
    });

    // Get current object fit
    const fit = img.style.objectFit || 'cover';
    document.querySelectorAll('.fit-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.fit === fit);
    });

    // Get current position
    const position = img.style.objectPosition || 'center center';
    document.querySelectorAll('.position-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.pos === position);
    });

    // Get current filter preset
    const filterPreset = img.dataset.filterPreset || 'none';
    document.querySelectorAll('.filter-preset').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filterPreset);
    });

    // Get current adjustments (brightness, contrast, saturation)
    const brightness = img.dataset.brightness || 100;
    const contrast = img.dataset.contrast || 100;
    const saturation = img.dataset.saturation || 100;

    const brightnessSlider = document.getElementById('brightnessSlider');
    const contrastSlider = document.getElementById('contrastSlider');
    const saturationSlider = document.getElementById('saturationSlider');
    const brightnessValue = document.getElementById('brightnessValue');
    const contrastValue = document.getElementById('contrastValue');
    const saturationValue = document.getElementById('saturationValue');

    if (brightnessSlider) brightnessSlider.value = brightness;
    if (contrastSlider) contrastSlider.value = contrast;
    if (saturationSlider) saturationSlider.value = saturation;
    if (brightnessValue) brightnessValue.textContent = `${brightness}%`;
    if (contrastValue) contrastValue.textContent = `${contrast}%`;
    if (saturationValue) saturationValue.textContent = `${saturation}%`;

    // Get current transform (rotation, flip)
    const rotation = img.dataset.rotation || 0;
    const flipH = img.dataset.flipH === 'true';
    const flipV = img.dataset.flipV === 'true';

    const rotationSlider = document.getElementById('rotationSlider');
    const rotationValue = document.getElementById('rotationValue');

    if (rotationSlider) rotationSlider.value = rotation;
    if (rotationValue) rotationValue.textContent = `${rotation}°`;

    document.getElementById('flipHBtn')?.classList.toggle('active', flipH);
    document.getElementById('flipVBtn')?.classList.toggle('active', flipV);

    // Get current zoom
    const zoom = img.dataset.zoom || 100;
    const zoomSlider = document.getElementById('imageZoomSlider');
    const zoomValue = document.getElementById('zoomValue');
    if (zoomSlider) zoomSlider.value = zoom;
    if (zoomValue) zoomValue.textContent = `${zoom}%`;
}

// ============================================================================
// IMAGE EDITING FUNCTIONS
// ============================================================================

function setCornerRadius(radius) {
    if (!ImageEditorState.selectedElement) return;

    const value = parseInt(radius);
    const element = ImageEditorState.selectedElement;
    const img = element.querySelector('img');

    // Apply to container
    element.style.borderRadius = `${value}px`;
    element.style.overflow = 'hidden';

    // Update UI
    const slider = document.getElementById('radiusSlider');
    const valueDisplay = document.getElementById('radiusValue');
    if (slider) slider.value = value;
    if (valueDisplay) valueDisplay.textContent = `${value}px`;

    // Update preset buttons
    document.querySelectorAll('.radius-preset').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.radius) === value);
    });

    // Mark session as dirty
    if (typeof EditorState !== 'undefined') {
        EditorState.isDirty = true;
    }

    console.log('🔄 Corner radius set to:', value);
}

function setImageFit(fit) {
    if (!ImageEditorState.selectedElement) return;

    const img = ImageEditorState.selectedElement.querySelector('img');
    if (!img) return;

    img.style.objectFit = fit;

    // Update UI
    document.querySelectorAll('.fit-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.fit === fit);
    });

    // Mark session as dirty
    if (typeof EditorState !== 'undefined') {
        EditorState.isDirty = true;
    }

    console.log('🔄 Image fit set to:', fit);
}

function setImagePosition(position) {
    if (!ImageEditorState.selectedElement) return;

    const img = ImageEditorState.selectedElement.querySelector('img');
    if (!img) return;

    img.style.objectPosition = position;

    // Update UI
    document.querySelectorAll('.position-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.pos === position);
    });

    // Mark session as dirty
    if (typeof EditorState !== 'undefined') {
        EditorState.isDirty = true;
    }

    console.log('🔄 Image position set to:', position);
}

// ============================================================================
// IMAGE ADJUSTMENTS (Brightness, Contrast, Saturation)
// ============================================================================

function setImageAdjustment(type, value) {
    if (!ImageEditorState.selectedElement) return;

    const img = ImageEditorState.selectedElement.querySelector('img');
    if (!img) return;

    // Store the value in data attribute for persistence
    img.dataset[type] = value;

    // Update UI display
    const valueDisplay = document.getElementById(`${type}Value`);
    if (valueDisplay) valueDisplay.textContent = `${value}%`;

    // Apply all filters
    applyImageFilters(img);

    // Mark session as dirty
    if (typeof EditorState !== 'undefined') {
        EditorState.isDirty = true;
    }

    console.log(`🎨 ${type} set to:`, value);
}

function applyImageFilters(img) {
    // Get current values from data attributes or defaults
    const brightness = img.dataset.brightness || 100;
    const contrast = img.dataset.contrast || 100;
    const saturation = img.dataset.saturation || 100;
    const filterPreset = img.dataset.filterPreset || 'none';

    // Build CSS filter string
    const filters = [
        `brightness(${brightness / 100})`,
        `contrast(${contrast / 100})`,
        `saturate(${saturation / 100})`
    ];

    // Add filter preset effects
    switch (filterPreset) {
        case 'bw':
            filters.push('grayscale(1)');
            break;
        case 'sepia':
            filters.push('sepia(0.8)');
            break;
        case 'warm':
            filters.push('sepia(0.2)', 'saturate(1.2)');
            break;
        case 'cool':
            filters.push('hue-rotate(15deg)', 'saturate(0.9)');
            break;
        case 'vivid':
            filters.push('saturate(1.4)', 'contrast(1.1)');
            break;
    }

    img.style.filter = filters.join(' ');
}

// ============================================================================
// FILTER PRESETS
// ============================================================================

const FILTER_PRESETS = {
    none: { name: 'Original', filters: [] },
    bw: { name: 'B&W', filters: ['grayscale(1)'] },
    sepia: { name: 'Sepia', filters: ['sepia(0.8)'] },
    warm: { name: 'Warm', filters: ['sepia(0.2)', 'saturate(1.2)'] },
    cool: { name: 'Cool', filters: ['hue-rotate(15deg)', 'saturate(0.9)'] },
    vivid: { name: 'Vivid', filters: ['saturate(1.4)', 'contrast(1.1)'] }
};

function applyFilterPreset(preset) {
    if (!ImageEditorState.selectedElement) return;

    const img = ImageEditorState.selectedElement.querySelector('img');
    if (!img) return;

    // Store the preset in data attribute
    img.dataset.filterPreset = preset;

    // Apply filters (includes preset)
    applyImageFilters(img);

    // Update UI
    document.querySelectorAll('.filter-preset').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === preset);
    });

    // Mark session as dirty
    if (typeof EditorState !== 'undefined') {
        EditorState.isDirty = true;
    }

    console.log('🎨 Filter preset applied:', preset);
}

// ============================================================================
// CROP TOOL
// ============================================================================

function setCropRatio(ratio) {
    ImageEditorState.crop.ratio = ratio;

    // Update UI
    document.querySelectorAll('.aspect-ratio-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.ratio === ratio);
    });

    // If crop mode is active, update the overlay
    if (ImageEditorState.crop.active && ImageEditorState.crop.overlay) {
        updateCropOverlay();
    }

    console.log('📐 Crop ratio set to:', ratio);
}

function toggleCropMode() {
    if (ImageEditorState.crop.active) {
        cancelCrop();
    } else {
        enterCropMode();
    }
}

function enterCropMode() {
    if (!ImageEditorState.selectedElement) return;

    const element = ImageEditorState.selectedElement;
    const img = element.querySelector('img');
    if (!img) return;

    ImageEditorState.crop.active = true;

    // Create crop overlay
    const overlay = document.createElement('div');
    overlay.className = 'crop-overlay';
    overlay.innerHTML = `
        <div class="crop-darkened-area crop-top"></div>
        <div class="crop-darkened-area crop-bottom"></div>
        <div class="crop-darkened-area crop-left"></div>
        <div class="crop-darkened-area crop-right"></div>
        <div class="crop-selection">
            <div class="crop-handle crop-handle-nw" data-handle="nw"></div>
            <div class="crop-handle crop-handle-ne" data-handle="ne"></div>
            <div class="crop-handle crop-handle-sw" data-handle="sw"></div>
            <div class="crop-handle crop-handle-se" data-handle="se"></div>
            <div class="crop-handle crop-handle-n" data-handle="n"></div>
            <div class="crop-handle crop-handle-s" data-handle="s"></div>
            <div class="crop-handle crop-handle-e" data-handle="e"></div>
            <div class="crop-handle crop-handle-w" data-handle="w"></div>
            <div class="crop-grid">
                <div class="crop-grid-line crop-grid-h1"></div>
                <div class="crop-grid-line crop-grid-h2"></div>
                <div class="crop-grid-line crop-grid-v1"></div>
                <div class="crop-grid-line crop-grid-v2"></div>
            </div>
        </div>
    `;

    // Position overlay over the image
    element.style.position = 'relative';
    element.appendChild(overlay);
    ImageEditorState.crop.overlay = overlay;

    // Initialize crop to full image
    const rect = img.getBoundingClientRect();
    const parentRect = element.getBoundingClientRect();
    ImageEditorState.crop.cropX = 10;
    ImageEditorState.crop.cropY = 10;
    ImageEditorState.crop.cropWidth = parentRect.width - 20;
    ImageEditorState.crop.cropHeight = parentRect.height - 20;

    updateCropOverlay();
    setupCropHandlers(overlay, element);

    // Update UI
    const cropBtn = document.getElementById('cropModeBtn');
    const cropControls = document.getElementById('cropControls');
    if (cropBtn) cropBtn.textContent = '✂️ Exit Crop Mode';
    if (cropControls) cropControls.style.display = 'flex';

    console.log('✂️ Entered crop mode');
}

function updateCropOverlay() {
    if (!ImageEditorState.crop.overlay) return;

    const overlay = ImageEditorState.crop.overlay;
    const element = ImageEditorState.selectedElement;
    const { cropX, cropY, cropWidth, cropHeight } = ImageEditorState.crop;

    const parentRect = element.getBoundingClientRect();
    const totalWidth = parentRect.width;
    const totalHeight = parentRect.height;

    // Update darkened areas
    const top = overlay.querySelector('.crop-top');
    const bottom = overlay.querySelector('.crop-bottom');
    const left = overlay.querySelector('.crop-left');
    const right = overlay.querySelector('.crop-right');
    const selection = overlay.querySelector('.crop-selection');

    top.style.cssText = `position:absolute; top:0; left:0; width:100%; height:${cropY}px; background:rgba(0,0,0,0.5);`;
    bottom.style.cssText = `position:absolute; bottom:0; left:0; width:100%; height:${totalHeight - cropY - cropHeight}px; background:rgba(0,0,0,0.5);`;
    left.style.cssText = `position:absolute; top:${cropY}px; left:0; width:${cropX}px; height:${cropHeight}px; background:rgba(0,0,0,0.5);`;
    right.style.cssText = `position:absolute; top:${cropY}px; right:0; width:${totalWidth - cropX - cropWidth}px; height:${cropHeight}px; background:rgba(0,0,0,0.5);`;

    selection.style.cssText = `position:absolute; top:${cropY}px; left:${cropX}px; width:${cropWidth}px; height:${cropHeight}px; border:2px solid white; box-sizing:border-box;`;
}

function setupCropHandlers(overlay, element) {
    const selection = overlay.querySelector('.crop-selection');
    let isDragging = false;
    let dragHandle = null;
    let startMouseX, startMouseY;
    let startCropX, startCropY, startCropW, startCropH;

    const onMouseDown = (e) => {
        const handle = e.target.closest('.crop-handle');
        if (handle) {
            isDragging = true;
            dragHandle = handle.dataset.handle;
        } else if (e.target.closest('.crop-selection')) {
            isDragging = true;
            dragHandle = 'move';
        }

        if (isDragging) {
            e.preventDefault();
            startMouseX = e.clientX;
            startMouseY = e.clientY;
            startCropX = ImageEditorState.crop.cropX;
            startCropY = ImageEditorState.crop.cropY;
            startCropW = ImageEditorState.crop.cropWidth;
            startCropH = ImageEditorState.crop.cropHeight;
        }
    };

    const onMouseMove = (e) => {
        if (!isDragging) return;

        const parentRect = element.getBoundingClientRect();
        const dx = e.clientX - startMouseX;
        const dy = e.clientY - startMouseY;
        const minSize = 30;

        let newX = ImageEditorState.crop.cropX;
        let newY = ImageEditorState.crop.cropY;
        let newW = ImageEditorState.crop.cropWidth;
        let newH = ImageEditorState.crop.cropHeight;

        switch (dragHandle) {
            case 'move':
                newX = Math.max(0, Math.min(parentRect.width - startCropW, startCropX + dx));
                newY = Math.max(0, Math.min(parentRect.height - startCropH, startCropY + dy));
                break;
            case 'se':
                newW = Math.max(minSize, startCropW + dx);
                newH = Math.max(minSize, startCropH + dy);
                break;
            case 'sw':
                newX = Math.max(0, startCropX + dx);
                newW = Math.max(minSize, startCropW - dx);
                newH = Math.max(minSize, startCropH + dy);
                break;
            case 'ne':
                newY = Math.max(0, startCropY + dy);
                newW = Math.max(minSize, startCropW + dx);
                newH = Math.max(minSize, startCropH - dy);
                break;
            case 'nw':
                newX = Math.max(0, startCropX + dx);
                newY = Math.max(0, startCropY + dy);
                newW = Math.max(minSize, startCropW - dx);
                newH = Math.max(minSize, startCropH - dy);
                break;
            case 'n':
                newY = Math.max(0, startCropY + dy);
                newH = Math.max(minSize, startCropH - dy);
                break;
            case 's':
                newH = Math.max(minSize, startCropH + dy);
                break;
            case 'e':
                newW = Math.max(minSize, startCropW + dx);
                break;
            case 'w':
                newX = Math.max(0, startCropX + dx);
                newW = Math.max(minSize, startCropW - dx);
                break;
        }

        // Constrain to element bounds
        newW = Math.min(newW, parentRect.width - newX);
        newH = Math.min(newH, parentRect.height - newY);

        // Apply aspect ratio if not free
        if (ImageEditorState.crop.ratio !== 'free') {
            const ratioMap = { '1:1': 1, '4:3': 4/3, '16:9': 16/9 };
            const targetRatio = ratioMap[ImageEditorState.crop.ratio];
            if (targetRatio) {
                if (['se', 'sw', 'ne', 'nw'].includes(dragHandle)) {
                    newH = newW / targetRatio;
                }
            }
        }

        ImageEditorState.crop.cropX = newX;
        ImageEditorState.crop.cropY = newY;
        ImageEditorState.crop.cropWidth = newW;
        ImageEditorState.crop.cropHeight = newH;

        updateCropOverlay();
    };

    const onMouseUp = () => {
        isDragging = false;
        dragHandle = null;
    };

    overlay.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    // Store handlers for cleanup
    overlay._cropHandlers = { onMouseDown, onMouseMove, onMouseUp };
}

function applyCrop() {
    if (!ImageEditorState.selectedElement || !ImageEditorState.crop.active) return;

    const element = ImageEditorState.selectedElement;
    const img = element.querySelector('img');
    if (!img) return;

    const parentRect = element.getBoundingClientRect();
    const { cropX, cropY, cropWidth, cropHeight } = ImageEditorState.crop;

    // Calculate crop percentages
    const clipTop = (cropY / parentRect.height) * 100;
    const clipRight = ((parentRect.width - cropX - cropWidth) / parentRect.width) * 100;
    const clipBottom = ((parentRect.height - cropY - cropHeight) / parentRect.height) * 100;
    const clipLeft = (cropX / parentRect.width) * 100;

    // Apply using clip-path
    img.style.clipPath = `inset(${clipTop}% ${clipRight}% ${clipBottom}% ${clipLeft}%)`;

    // Store crop data
    img.dataset.cropTop = clipTop;
    img.dataset.cropRight = clipRight;
    img.dataset.cropBottom = clipBottom;
    img.dataset.cropLeft = clipLeft;

    // Exit crop mode
    cancelCrop();

    // Mark session as dirty
    if (typeof EditorState !== 'undefined') {
        EditorState.isDirty = true;
    }

    console.log('✅ Crop applied');
}

function cancelCrop() {
    if (!ImageEditorState.crop.overlay) return;

    const overlay = ImageEditorState.crop.overlay;

    // Remove event listeners
    if (overlay._cropHandlers) {
        document.removeEventListener('mousemove', overlay._cropHandlers.onMouseMove);
        document.removeEventListener('mouseup', overlay._cropHandlers.onMouseUp);
    }

    // Remove overlay
    overlay.remove();

    // Reset state
    ImageEditorState.crop.active = false;
    ImageEditorState.crop.overlay = null;

    // Update UI
    const cropBtn = document.getElementById('cropModeBtn');
    const cropControls = document.getElementById('cropControls');
    if (cropBtn) cropBtn.textContent = '✂️ Enter Crop Mode';
    if (cropControls) cropControls.style.display = 'none';

    console.log('❌ Crop cancelled');
}

function resetCrop() {
    if (!ImageEditorState.selectedElement) return;

    const img = ImageEditorState.selectedElement.querySelector('img');
    if (!img) return;

    // Remove clip-path
    img.style.clipPath = '';

    // Remove crop data
    delete img.dataset.cropTop;
    delete img.dataset.cropRight;
    delete img.dataset.cropBottom;
    delete img.dataset.cropLeft;

    // Mark session as dirty
    if (typeof EditorState !== 'undefined') {
        EditorState.isDirty = true;
    }

    console.log('🔄 Crop reset');
}

// ============================================================================
// IMAGE ZOOM/SCALE
// ============================================================================

function setImageZoom(value) {
    if (!ImageEditorState.selectedElement) return;

    const img = ImageEditorState.selectedElement.querySelector('img');
    if (!img) return;

    const scale = value / 100;

    // Store zoom value
    img.dataset.zoom = value;

    // Apply scale transform (combined with any existing rotation/flip)
    applyImageTransformWithZoom(img, scale);

    // Update UI
    const zoomValue = document.getElementById('zoomValue');
    if (zoomValue) zoomValue.textContent = `${value}%`;

    // Mark session as dirty
    if (typeof EditorState !== 'undefined') {
        EditorState.isDirty = true;
    }

    console.log('🔍 Image zoom set to:', value + '%');
}

function resetImageZoom() {
    if (!ImageEditorState.selectedElement) return;

    const img = ImageEditorState.selectedElement.querySelector('img');
    if (!img) return;

    // Reset zoom
    img.dataset.zoom = 100;

    // Reapply transform without zoom scale
    applyImageTransformWithZoom(img, 1);

    // Update UI
    const zoomSlider = document.getElementById('imageZoomSlider');
    const zoomValue = document.getElementById('zoomValue');
    if (zoomSlider) zoomSlider.value = 100;
    if (zoomValue) zoomValue.textContent = '100%';

    // Mark session as dirty
    if (typeof EditorState !== 'undefined') {
        EditorState.isDirty = true;
    }

    console.log('🔄 Image zoom reset to 100%');
}

function applyImageTransformWithZoom(img, zoomScale = 1) {
    const rotation = img.dataset.rotation || 0;
    const flipH = img.dataset.flipH === 'true';
    const flipV = img.dataset.flipV === 'true';
    const zoom = zoomScale || (img.dataset.zoom ? img.dataset.zoom / 100 : 1);

    const transforms = [];

    // Add zoom/scale
    const scaleX = (flipH ? -1 : 1) * zoom;
    const scaleY = (flipV ? -1 : 1) * zoom;

    if (rotation != 0) {
        transforms.push(`rotate(${rotation}deg)`);
    }

    transforms.push(`scale(${scaleX}, ${scaleY})`);

    img.style.transform = transforms.join(' ');
}

function resetImageAdjustments() {
    if (!ImageEditorState.selectedElement) return;

    const img = ImageEditorState.selectedElement.querySelector('img');
    if (!img) return;

    // Reset data attributes
    img.dataset.brightness = 100;
    img.dataset.contrast = 100;
    img.dataset.saturation = 100;

    // Reset filter
    img.style.filter = '';

    // Update UI sliders
    const brightnessSlider = document.getElementById('brightnessSlider');
    const contrastSlider = document.getElementById('contrastSlider');
    const saturationSlider = document.getElementById('saturationSlider');
    const brightnessValue = document.getElementById('brightnessValue');
    const contrastValue = document.getElementById('contrastValue');
    const saturationValue = document.getElementById('saturationValue');

    if (brightnessSlider) brightnessSlider.value = 100;
    if (contrastSlider) contrastSlider.value = 100;
    if (saturationSlider) saturationSlider.value = 100;
    if (brightnessValue) brightnessValue.textContent = '100%';
    if (contrastValue) contrastValue.textContent = '100%';
    if (saturationValue) saturationValue.textContent = '100%';

    // Mark session as dirty
    if (typeof EditorState !== 'undefined') {
        EditorState.isDirty = true;
    }

    console.log('🔄 Image adjustments reset');
}

// ============================================================================
// IMAGE TRANSFORM (Rotation, Flip)
// ============================================================================

function setImageRotation(degrees) {
    if (!ImageEditorState.selectedElement) return;

    const img = ImageEditorState.selectedElement.querySelector('img');
    if (!img) return;

    // Store rotation value
    img.dataset.rotation = degrees;

    // Update UI
    const rotationValue = document.getElementById('rotationValue');
    if (rotationValue) rotationValue.textContent = `${degrees}°`;

    // Apply transform
    applyImageTransform(img);

    // Mark session as dirty
    if (typeof EditorState !== 'undefined') {
        EditorState.isDirty = true;
    }

    console.log('🔄 Rotation set to:', degrees);
}

function toggleFlip(direction) {
    if (!ImageEditorState.selectedElement) return;

    const img = ImageEditorState.selectedElement.querySelector('img');
    if (!img) return;

    if (direction === 'horizontal') {
        const current = img.dataset.flipH === 'true';
        img.dataset.flipH = !current;
        document.getElementById('flipHBtn')?.classList.toggle('active', !current);
    } else if (direction === 'vertical') {
        const current = img.dataset.flipV === 'true';
        img.dataset.flipV = !current;
        document.getElementById('flipVBtn')?.classList.toggle('active', !current);
    }

    // Apply transform
    applyImageTransform(img);

    // Mark session as dirty
    if (typeof EditorState !== 'undefined') {
        EditorState.isDirty = true;
    }

    console.log(`🔄 Flip ${direction} toggled`);
}

function applyImageTransform(img) {
    const rotation = img.dataset.rotation || 0;
    const flipH = img.dataset.flipH === 'true';
    const flipV = img.dataset.flipV === 'true';

    const transforms = [];

    if (rotation != 0) {
        transforms.push(`rotate(${rotation}deg)`);
    }

    if (flipH || flipV) {
        const scaleX = flipH ? -1 : 1;
        const scaleY = flipV ? -1 : 1;
        transforms.push(`scale(${scaleX}, ${scaleY})`);
    }

    img.style.transform = transforms.join(' ');
}

function replaceImage() {
    if (!ImageEditorState.selectedElement) return;

    // Trigger file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = ImageEditorState.selectedElement.querySelector('img');
            if (img) {
                img.src = event.target.result;
                console.log('🔄 Image replaced');

                // Mark session as dirty
                if (typeof EditorState !== 'undefined') {
                    EditorState.isDirty = true;
                }
            }
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

function removeImage() {
    if (!ImageEditorState.selectedElement) return;

    if (confirm('Remove this image from the brochure?')) {
        const img = ImageEditorState.selectedElement.querySelector('img');
        if (img) {
            img.src = '';
            img.style.display = 'none';

            // Show placeholder
            ImageEditorState.selectedElement.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center;
                            height: 100%; background: #f3f4f6; color: #9ca3af;">
                    <span>📷 Click to add image</span>
                </div>
            `;
        }

        deselectImage();

        // Mark session as dirty
        if (typeof EditorState !== 'undefined') {
            EditorState.isDirty = true;
        }

        console.log('🗑️ Image removed');
    }
}

// ============================================================================
// AI BACKGROUND REMOVAL
// ============================================================================

// Configuration for the backend API
const BG_REMOVAL_CONFIG = {
    // Use relative URL for same-origin, or configure full URL if different
    apiUrl: '/api/remove-background',
    timeout: 60000  // 60 second timeout
};

/**
 * Remove background from the currently selected image using AI
 */
async function removeImageBackground() {
    const img = ImageEditorState.selectedElement?.querySelector('img');
    if (!img) {
        showImageEditorToast('Select an image first', 'warning');
        return;
    }

    const btn = document.getElementById('removeBackgroundBtn');
    const progress = document.getElementById('bgRemovalProgress');
    const restoreBtn = document.getElementById('restoreOriginalBtn');

    try {
        // Show loading state
        if (btn) btn.disabled = true;
        if (progress) progress.style.display = 'flex';

        console.log('🎨 Starting background removal...');

        // Get image as base64
        const imageBase64 = await getImageAsBase64(img.src);

        // Determine API URL - check if we have a configured backend URL
        let apiUrl = BG_REMOVAL_CONFIG.apiUrl;

        // If running locally or need full URL, detect from environment
        if (typeof API_BASE_URL !== 'undefined' && API_BASE_URL) {
            apiUrl = API_BASE_URL + '/api/remove-background';
        } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // Local development - use Railway backend
            apiUrl = 'https://brochuresocialmedia-production.up.railway.app/api/remove-background';
        }

        console.log('📡 Calling API:', apiUrl);

        // Call backend API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), BG_REMOVAL_CONFIG.timeout);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageBase64 }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `Server error: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            // Store original for undo (if not already stored)
            if (!img.dataset.originalSrc) {
                img.dataset.originalSrc = img.src;
            }

            // Apply new image with transparent background
            img.src = `data:image/png;base64,${result.image}`;

            // Mark as processed
            img.dataset.bgRemoved = 'true';

            // Show restore button
            if (restoreBtn) restoreBtn.style.display = 'block';

            // Save to history if available
            if (typeof saveToHistory === 'function') {
                saveToHistory('remove background');
            }

            // Mark session as dirty
            if (typeof EditorState !== 'undefined') {
                EditorState.isDirty = true;
            }

            showImageEditorToast('Background removed successfully!', 'success');
            console.log('✅ Background removed successfully');
        } else {
            throw new Error(result.error || 'Background removal failed');
        }
    } catch (error) {
        console.error('❌ Background removal failed:', error);

        let errorMessage = 'Failed to remove background';
        if (error.name === 'AbortError') {
            errorMessage = 'Request timed out. Please try again.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        showImageEditorToast(errorMessage, 'error');
    } finally {
        if (btn) btn.disabled = false;
        if (progress) progress.style.display = 'none';
    }
}

/**
 * Convert an image source to base64
 * @param {string} src - Image source (URL or data URL)
 * @returns {Promise<string>} Base64 encoded image data
 */
async function getImageAsBase64(src) {
    // Handle data URLs - just extract the base64 part
    if (src.startsWith('data:')) {
        return src.split(',')[1];
    }

    // Handle blob URLs
    if (src.startsWith('blob:')) {
        const response = await fetch(src);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    // Handle regular URLs - fetch and convert
    try {
        const response = await fetch(src);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        // If fetch fails (CORS), try canvas approach
        console.log('Fetch failed, trying canvas approach...');
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                try {
                    const dataUrl = canvas.toDataURL('image/png');
                    resolve(dataUrl.split(',')[1]);
                } catch (e) {
                    reject(new Error('Cannot process image due to security restrictions'));
                }
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = src;
        });
    }
}

/**
 * Restore the original background of an image
 */
function restoreOriginalBackground() {
    const img = ImageEditorState.selectedElement?.querySelector('img');
    if (!img) return;

    if (img.dataset.originalSrc) {
        img.src = img.dataset.originalSrc;
        img.dataset.bgRemoved = 'false';

        // Hide restore button
        const restoreBtn = document.getElementById('restoreOriginalBtn');
        if (restoreBtn) restoreBtn.style.display = 'none';

        // Save to history if available
        if (typeof saveToHistory === 'function') {
            saveToHistory('restore original');
        }

        // Mark session as dirty
        if (typeof EditorState !== 'undefined') {
            EditorState.isDirty = true;
        }

        showImageEditorToast('Original image restored', 'info');
        console.log('🔄 Original image restored');
    }
}

/**
 * Show a toast notification for the image editor
 * @param {string} message - Message to display
 * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
 */
function showImageEditorToast(message, type = 'info') {
    // Try to use existing toast function if available
    if (typeof showToast === 'function') {
        showToast(message, type);
        return;
    }

    // Create simple toast if no global toast exists
    const existingToast = document.querySelector('.image-editor-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `image-editor-toast image-editor-toast-${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================================================
// SMART PHOTO MATCHING
// ============================================================================

/**
 * Match photos to pages based on category
 * Kitchen photos go to kitchen page, bedroom photos to bedroom page, etc.
 */
function matchPhotosToPages(photos, pages) {
    console.log('🎯 Smart matching photos to pages...');

    const categoryMap = {
        'cover': ['exterior', 'front', 'drone'],
        'overview': ['exterior', 'living', 'reception'],
        'kitchen': ['kitchen'],
        'living': ['living', 'lounge', 'reception', 'dining'],
        'bedrooms': ['bedroom', 'master'],
        'bathrooms': ['bathroom', 'ensuite', 'shower'],
        'exterior': ['exterior', 'front', 'garden', 'drone'],
        'garden': ['garden', 'outdoor', 'patio'],
        'location': ['street', 'aerial', 'map']
    };

    const assignments = {};

    pages.forEach(page => {
        const pageType = page.type || page.title?.toLowerCase() || '';
        let matchingCategories = [];

        // Find matching categories for this page type
        for (const [key, categories] of Object.entries(categoryMap)) {
            if (pageType.includes(key)) {
                matchingCategories = categories;
                break;
            }
        }

        // Find photos matching these categories
        const matchedPhotos = photos.filter(photo => {
            const photoCategory = (photo.category || '').toLowerCase();
            return matchingCategories.some(cat => photoCategory.includes(cat));
        });

        assignments[page.id] = matchedPhotos.length > 0 ? matchedPhotos : [];

        console.log(`  📄 ${page.title || page.type}: ${matchedPhotos.length} matching photos`);
    });

    return assignments;
}

/**
 * Auto-assign photos to pages if they don't have any
 */
function autoAssignPhotosToPages() {
    if (typeof EditorState === 'undefined' || !EditorState.sessionData) {
        console.warn('EditorState not available');
        return;
    }

    const photos = EditorState.sessionData.photos || [];
    const pages = EditorState.sessionData.pages || [];

    if (photos.length === 0 || pages.length === 0) {
        console.warn('No photos or pages to match');
        return;
    }

    const assignments = matchPhotosToPages(photos, pages);

    // Apply assignments to pages that don't have photos
    pages.forEach(page => {
        if (!page.photos || page.photos.length === 0) {
            const matchedPhotos = assignments[page.id];
            if (matchedPhotos && matchedPhotos.length > 0) {
                page.photos = matchedPhotos.slice(0, 4); // Max 4 photos per page
                console.log(`✅ Auto-assigned ${page.photos.length} photos to ${page.title}`);
            }
        }
    });

    // Re-render pages if function exists
    if (typeof renderPages === 'function') {
        renderPages();
    }
}

// ============================================================================
// INITIALIZATION ON LOAD
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize after a short delay to ensure other scripts are loaded
    setTimeout(initializeImageEditor, 500);
});

// Also initialize when called from brochure editor
if (typeof window !== 'undefined') {
    // Export as ImageEditor object for module detection
    window.ImageEditor = {
        initialize: initializeImageEditor,
        autoAssignPhotos: autoAssignPhotosToPages,
        select: selectImage,
        deselect: deselectImage,
        setCornerRadius: setCornerRadius,
        setFit: setImageFit,
        setPosition: setImagePosition,
        replace: replaceImage,
        remove: removeImage,
        isLoaded: true
    };

    window.initializeImageEditor = initializeImageEditor;
    window.autoAssignPhotosToPages = autoAssignPhotosToPages;
    window.selectImage = selectImage;
    window.deselectImage = deselectImage;
    window.setCornerRadius = setCornerRadius;
    window.setImageFit = setImageFit;
    window.setImagePosition = setImagePosition;
    window.replaceImage = replaceImage;
    window.removeImage = removeImage;
    // New adjustment functions
    window.setImageAdjustment = setImageAdjustment;
    window.resetImageAdjustments = resetImageAdjustments;
    window.setImageRotation = setImageRotation;
    window.toggleFlip = toggleFlip;
    window.applyFilterPreset = applyFilterPreset;
    // Crop functions
    window.setCropRatio = setCropRatio;
    window.toggleCropMode = toggleCropMode;
    window.applyCrop = applyCrop;
    window.cancelCrop = cancelCrop;
    window.resetCrop = resetCrop;
    // Zoom functions
    window.setImageZoom = setImageZoom;
    window.resetImageZoom = resetImageZoom;
    // Background removal functions
    window.removeImageBackground = removeImageBackground;
    window.restoreOriginalBackground = restoreOriginalBackground;
}
