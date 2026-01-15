/**
 * Social Media Repurpose System - Section 1: UI Mockup with Mock Data
 * Provides interface for repurposing brochure content to social media platforms
 */

// ========================================
// MOCK DATA - Phase 0
// ========================================

const MOCK_SOCIAL_POSTS = {
    facebook: {
        variants: [
            {
                length: "short",
                caption: "4-bed family home in Didsbury\n\nModern kitchen • South-facing garden • Near top schools\n\nView at savills.me/abc123",
                characterCount: 118,
                wordCount: 18
            },
            {
                length: "medium",
                caption: "Spacious 4-bedroom home in sought-after Didsbury location\n\n• Modern kitchen with Bosch integrated appliances\n• South-facing garden perfect for family living\n• Walking distance to highly-rated primary and secondary schools\n• Off-street parking for 2 vehicles\n\nBook a viewing today: savills.me/abc123",
                characterCount: 321,
                wordCount: 44
            },
            {
                length: "long",
                caption: "Well-presented family home in the heart of Didsbury\n\nThis 4-bedroom semi-detached property offers versatile family accommodation across two floors. The ground floor features a bright reception room with bay window and modern fitted kitchen opening onto the garden. Upstairs provides 4 good-sized bedrooms and a contemporary family bathroom.\n\nKey features:\n• Modern kitchen with integrated Bosch appliances\n• South-facing garden (approx. 50ft)\n• Gas central heating and double glazing throughout\n• Off-street parking for 2 cars\n• 0.3 miles from Didsbury Village\n\nGuide Price: £625,000\n\nArrange a viewing: savills.me/abc123 or call 0161-928-XXXX",
                characterCount: 618,
                wordCount: 96
            }
        ],
        hashtags: {
            reach: ["#PropertyForSale", "#UKProperty", "#HouseForSale", "#FamilyHome", "#RealEstate", "#NewListing"],
            local: ["#ManchesterProperty", "#DidsburyHomes", "#Didsbury", "#HouseForSale", "#M20", "#SouthManchester"],
            recommended: ["#PropertyForSale", "#FamilyHome", "#ManchesterProperty", "#DidsburyHomes", "#HouseForSale", "#M20"],
            brand: ["#SavillsUK", "#SavillsManchester"]
        },
        images: [
            {
                size: "1.91:1",
                dimensions: { width: 1200, height: 628 },
                url: "mock-fb-landscape.jpg",
                caption: "Street view of property"
            }
        ],
        specs: {
            aspectRatio: "1.91:1 (landscape)",
            maxCaptionLength: 63206,
            recommendedCaptionLength: "250-300 chars",
            recommendedHashtags: "3-5 hashtags"
        }
    },
    instagram: {
        variants: [
            {
                length: "short",
                caption: "Family living in Didsbury 🏡\n\n4 beds • Modern kitchen • Garden\n\nLink in bio",
                characterCount: 82,
                wordCount: 13
            },
            {
                length: "medium",
                caption: "Your next family home awaits in Didsbury\n\n✨ 4 spacious bedrooms\n🍳 Modern kitchen with Bosch appliances\n🌿 South-facing garden\n🚗 Parking for 2 cars\n📍 0.3 miles from Didsbury Village\n\n£625,000 • Link in bio for details",
                characterCount: 234,
                wordCount: 38
            },
            {
                length: "long",
                caption: "Discover this beautifully presented 4-bedroom family home in one of Manchester's most desirable suburbs\n\nThe property offers:\n\n🏡 4 well-proportioned bedrooms\n🍳 Contemporary kitchen with Bosch integrated appliances\n🌳 South-facing garden (approx. 50ft) - perfect for outdoor living\n🚗 Off-street parking for 2 vehicles\n📏 Gas central heating & double glazing\n📍 Walking distance to top-rated schools and Didsbury Village\n\nGuide Price: £625,000\n\nTap the link in bio or DM us to arrange a viewing 📲\n\n.\n.\n.",
                characterCount: 505,
                wordCount: 84
            }
        ],
        hashtags: {
            reach: ["#PropertyForSale", "#HouseHunting", "#DreamHome", "#FamilyHome", "#PropertyGoals", "#HomeSweetHome"],
            local: ["#ManchesterProperty", "#ManchesterHomes", "#DidsburyProperty", "#Didsbury", "#M20", "#ManchesterRealEstate"],
            recommended: ["#PropertyForSale", "#FamilyHome", "#ManchesterProperty", "#Didsbury", "#HouseHunting", "#M20"],
            brand: ["#SavillsUK", "#SavillsManchester"]
        },
        images: [
            {
                size: "1:1",
                dimensions: { width: 1080, height: 1080 },
                url: "mock-ig-square.jpg",
                caption: "Front elevation"
            },
            {
                size: "4:5",
                dimensions: { width: 1080, height: 1350 },
                url: "mock-ig-portrait.jpg",
                caption: "Kitchen/diner"
            }
        ],
        specs: {
            aspectRatio: "1:1 (square) or 4:5 (portrait)",
            maxCaptionLength: 2200,
            recommendedCaptionLength: "200-250 chars",
            recommendedHashtags: "6-8 hashtags (can use up to 30)"
        }
    }
};

// Template visual mockups
const TEMPLATE_MOCKUPS = {
    classic: {
        name: "Classic Estate Agent",
        description: "Professional tone, fact-focused, traditional format",
        example: "Well-presented 4-bedroom family home...",
        icon: "📋"
    },
    modern: {
        name: "Modern & Visual",
        description: "Emoji highlights, bullet format, lifestyle-focused",
        example: "Your next family home awaits ✨\n\n🏡 4 beds • 🌿 Garden...",
        icon: "✨"
    },
    minimal: {
        name: "Minimal & Direct",
        description: "Short, punchy, key facts only",
        example: "4 beds • Didsbury • £625k\n\nLink in bio",
        icon: "⚡"
    }
};

// Strategy configurations
const REPURPOSE_STRATEGIES = {
    highlight_feature: {
        name: "Highlight Feature",
        description: "Lead with standout feature (garden, kitchen, location)",
        prompt_modifier: "emphasize_unique_selling_point"
    },
    location_appeal: {
        name: "Location Appeal",
        description: "Focus on area, schools, transport, local amenities",
        prompt_modifier: "emphasize_location_benefits"
    },
    price_value: {
        name: "Price/Value",
        description: "Value proposition, price per sq ft, investment angle",
        prompt_modifier: "emphasize_value_proposition"
    }
};

// ========================================
// STATE MANAGEMENT
// ========================================

let repurposeState = {
    selectedPlatforms: ['facebook'], // default to Facebook
    selectedStrategy: 'highlight_feature',
    selectedTemplate: 'classic',
    selectedVariant: 'medium',
    currentPlatform: 'facebook',
    currentHashtagSet: 'recommended',
    sessionData: null, // Will contain brochure session data
    brochureImages: [], // Array of image URLs from brochure
    selectedImageIndex: 0 // Currently selected image for preview
};

// ========================================
// MODAL INITIALIZATION
// ========================================

function initRepurposeModal() {
    const repurposeBtn = document.getElementById('repurposeBtn');

    if (!repurposeBtn) {
        console.warn('⚠️ Repurpose button not found');
        return;
    }

    // Create modal HTML structure
    createModalHTML();

    // Wire up event listeners
    repurposeBtn.addEventListener('click', openRepurposeModal);

    console.log('✅ Social Media Repurpose modal initialized');
}

// ========================================
// MODAL HTML CREATION
// ========================================

function createModalHTML() {
    const modalHTML = `
    <!-- Social Media Repurpose Modal -->
    <div id="repurposeModal" class="repurpose-modal" style="display: none;">
        <div class="repurpose-modal-content">
            <!-- Header -->
            <div class="repurpose-header">
                <h2>Repurpose to Social Media</h2>
                <button class="repurpose-close" onclick="closeRepurposeModal()">&times;</button>
            </div>

            <!-- Two-Column Layout -->
            <div class="repurpose-body">
                <!-- LEFT COLUMN: Configuration -->
                <div class="repurpose-config">
                    <div class="config-section">
                        <h3>1. Select Platform(s)</h3>
                        <div class="platform-selector">
                            <label class="platform-option">
                                <input type="checkbox" name="platform" value="facebook" checked onchange="handlePlatformChange(event)">
                                <div class="platform-card facebook">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                    <span>Facebook</span>
                                </div>
                            </label>
                            <label class="platform-option">
                                <input type="checkbox" name="platform" value="instagram" onchange="handlePlatformChange(event)">
                                <div class="platform-card instagram">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                    <span>Instagram</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div class="config-section">
                        <h3>2. Choose Strategy</h3>
                        <div class="strategy-selector">
                            <label class="strategy-option">
                                <input type="radio" name="strategy" value="highlight_feature" checked onchange="handleStrategyChange(event)">
                                <div class="strategy-card">
                                    <strong>Highlight Feature</strong>
                                    <small>Lead with standout feature</small>
                                </div>
                            </label>
                            <label class="strategy-option">
                                <input type="radio" name="strategy" value="location_appeal" onchange="handleStrategyChange(event)">
                                <div class="strategy-card">
                                    <strong>Location Appeal</strong>
                                    <small>Focus on area & amenities</small>
                                </div>
                            </label>
                            <label class="strategy-option">
                                <input type="radio" name="strategy" value="price_value" onchange="handleStrategyChange(event)">
                                <div class="strategy-card">
                                    <strong>Price/Value</strong>
                                    <small>Investment & value angle</small>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div class="config-section">
                        <h3>3. Pick Template Style</h3>
                        <div class="template-selector">
                            <label class="template-option">
                                <input type="radio" name="template" value="classic" checked onchange="handleTemplateChange(event)">
                                <div class="template-card">
                                    <div class="template-icon">📋</div>
                                    <strong>Classic</strong>
                                    <small>Professional & fact-focused</small>
                                </div>
                            </label>
                            <label class="template-option">
                                <input type="radio" name="template" value="modern" onchange="handleTemplateChange(event)">
                                <div class="template-card">
                                    <div class="template-icon">✨</div>
                                    <strong>Modern</strong>
                                    <small>Visual with emoji highlights</small>
                                </div>
                            </label>
                            <label class="template-option">
                                <input type="radio" name="template" value="minimal" onchange="handleTemplateChange(event)">
                                <div class="template-card">
                                    <div class="template-icon">⚡</div>
                                    <strong>Minimal</strong>
                                    <small>Short & punchy</small>
                                </div>
                            </label>
                        </div>
                    </div>

                    <button class="generate-btn" onclick="handleGenerate()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9"/>
                        </svg>
                        Generate Posts
                    </button>
                </div>

                <!-- RIGHT COLUMN: Preview -->
                <div class="repurpose-preview">
                    <div id="previewPlaceholder" class="preview-placeholder">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <path d="M21 15l-5-5L5 21"/>
                        </svg>
                        <p>Configure options and click "Generate Posts" to see preview</p>
                    </div>
                    <div id="previewContent" class="preview-content" style="display: none;">
                        <!-- Platform tabs -->
                        <div class="preview-tabs" id="previewTabs">
                            <!-- Dynamically populated based on selected platforms -->
                        </div>

                        <!-- Preview screen -->
                        <div class="preview-screen" id="previewScreen">
                            <!-- Platform mockup will be rendered here -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    // Insert modal into body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// ========================================
// MODAL CONTROLS
// ========================================

function openRepurposeModal() {
    const modal = document.getElementById('repurposeModal');
    if (modal) {
        modal.style.display = 'flex';

        // Try to load session data
        loadBrochureSessionData();
    }
}

function closeRepurposeModal() {
    const modal = document.getElementById('repurposeModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modal if clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('repurposeModal');
    if (event.target === modal) {
        closeRepurposeModal();
    }
});

// ========================================
// EVENT HANDLERS
// ========================================

function handlePlatformChange(event) {
    const platform = event.target.value;
    const checked = event.target.checked;

    if (checked) {
        if (!repurposeState.selectedPlatforms.includes(platform)) {
            repurposeState.selectedPlatforms.push(platform);
        }
    } else {
        repurposeState.selectedPlatforms = repurposeState.selectedPlatforms.filter(p => p !== platform);
    }

    // Ensure at least one platform is selected
    if (repurposeState.selectedPlatforms.length === 0) {
        event.target.checked = true;
        repurposeState.selectedPlatforms = [platform];
        alert('At least one platform must be selected');
    }

    console.log('Selected platforms:', repurposeState.selectedPlatforms);
}

function handleStrategyChange(event) {
    repurposeState.selectedStrategy = event.target.value;
    console.log('Selected strategy:', repurposeState.selectedStrategy);
}

function handleTemplateChange(event) {
    repurposeState.selectedTemplate = event.target.value;
    console.log('Selected template:', repurposeState.selectedTemplate);
}

function handleGenerate() {
    console.log('🚀 Generating social media posts...');
    console.log('State:', repurposeState);

    // Hide placeholder, show preview
    document.getElementById('previewPlaceholder').style.display = 'none';
    document.getElementById('previewContent').style.display = 'block';

    // Render platform tabs
    renderPlatformTabs();

    // Set first selected platform as current
    repurposeState.currentPlatform = repurposeState.selectedPlatforms[0];

    // Render preview
    renderPreview();
}

// ========================================
// PREVIEW RENDERING
// ========================================

function renderPlatformTabs() {
    const tabsContainer = document.getElementById('previewTabs');

    const tabsHTML = repurposeState.selectedPlatforms.map(platform => {
        const active = platform === repurposeState.currentPlatform ? 'active' : '';
        const icon = platform === 'facebook' ? '👥' : '📸';
        const label = platform.charAt(0).toUpperCase() + platform.slice(1);

        return `
            <button class="preview-tab ${active}" onclick="switchPlatform('${platform}')">
                ${icon} ${label}
            </button>
        `;
    }).join('');

    tabsContainer.innerHTML = tabsHTML;
}

function switchPlatform(platform) {
    repurposeState.currentPlatform = platform;
    renderPlatformTabs();
    renderPreview();
}

// Helper function to get image preview HTML
function getImagePreviewHTML(platform) {
    const hasImages = repurposeState.brochureImages.length > 0;

    if (hasImages) {
        const currentImage = repurposeState.brochureImages[repurposeState.selectedImageIndex];
        const dimensionInfo = platform === 'facebook' ? '1.91:1 (1200×628)' : '1:1 (1080×1080)';
        const aspectClass = platform === 'facebook' ? '' : 'square';

        // Create image selector dropdown if multiple images
        const imageSelectorHTML = repurposeState.brochureImages.length > 1 ? `
            <div class="image-selector-dropdown">
                <label>📸 Select Image:</label>
                <select onchange="handleImageChange(event)">
                    ${repurposeState.brochureImages.map((img, index) => `
                        <option value="${index}" ${index === repurposeState.selectedImageIndex ? 'selected' : ''}>
                            ${img.caption || `Image ${index + 1}`}
                        </option>
                    `).join('')}
                </select>
            </div>
        ` : '';

        return `
            <div class="actual-image ${aspectClass}">
                <img src="${currentImage.url}" alt="${currentImage.caption}" style="width: 100%; height: 100%; object-fit: cover;">
                <div class="image-dimension-overlay">${dimensionInfo}</div>
            </div>
            ${imageSelectorHTML}
        `;
    } else {
        // Fallback to placeholder
        const dimensionInfo = platform === 'facebook' ? '1.91:1 (1200×628)' : '1:1 (1080×1080)';
        return `
            <div class="image-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                </svg>
                <small>${dimensionInfo}</small>
            </div>
        `;
    }
}

// Helper function to handle image selection change
function handleImageChange(event) {
    repurposeState.selectedImageIndex = parseInt(event.target.value);
    renderPreview();
}

function renderPreview() {
    const platform = repurposeState.currentPlatform;
    const mockData = MOCK_SOCIAL_POSTS[platform];
    const previewScreen = document.getElementById('previewScreen');

    if (!mockData) {
        previewScreen.innerHTML = '<p>No mock data available for this platform</p>';
        return;
    }

    // Render platform-specific mockup
    if (platform === 'facebook') {
        renderFacebookPreview(mockData);
    } else if (platform === 'instagram') {
        renderInstagramPreview(mockData);
    }
}

function renderFacebookPreview(data) {
    const variant = data.variants.find(v => v.length === repurposeState.selectedVariant) || data.variants[1];
    const hashtags = data.hashtags[repurposeState.currentHashtagSet];

    const previewHTML = `
        <div class="social-preview facebook-preview">
            <div class="preview-header">
                <div class="preview-meta">
                    <strong>Savills Manchester</strong>
                    <small>Just now • 🌍</small>
                </div>
            </div>

            <div class="preview-caption">
                <p>${variant.caption.replace(/\n/g, '<br>')}</p>
                <div class="preview-hashtags">
                    ${hashtags.map(tag => `<span class="hashtag">${tag}</span>`).join(' ')}
                </div>
                <div class="preview-stats">
                    <small>${variant.characterCount} characters • ${variant.wordCount} words</small>
                </div>
            </div>

            <div class="preview-image facebook-image">
                ${getImagePreviewHTML('facebook')}
            </div>

            <div class="preview-controls">
                <div class="variant-selector">
                    <label>
                        <input type="radio" name="fbVariant" value="short" ${repurposeState.selectedVariant === 'short' ? 'checked' : ''} onchange="handleVariantChange(event)">
                        Short
                    </label>
                    <label>
                        <input type="radio" name="fbVariant" value="medium" ${repurposeState.selectedVariant === 'medium' ? 'checked' : ''} onchange="handleVariantChange(event)">
                        Medium
                    </label>
                    <label>
                        <input type="radio" name="fbVariant" value="long" ${repurposeState.selectedVariant === 'long' ? 'checked' : ''} onchange="handleVariantChange(event)">
                        Long
                    </label>
                </div>
                <div class="hashtag-selector">
                    <label>Hashtags:</label>
                    <select onchange="handleHashtagSetChange(event)">
                        <option value="recommended" selected>Recommended (Hybrid)</option>
                        <option value="reach">High Reach</option>
                        <option value="local">Local Focus</option>
                    </select>
                </div>
            </div>

            <div class="preview-actions">
                <button class="edit-btn" onclick="handleEditCaption()">
                    ✏️ Edit Caption
                </button>
                <button class="regenerate-btn" onclick="handleRegenerate()">
                    🔄 Regenerate
                </button>
                <button class="copy-btn" onclick="handleCopyToClipboard()">
                    📋 Copy
                </button>
                <button class="download-btn primary" onclick="handleDownloadAsset()">
                    ⬇️ Download
                </button>
            </div>
        </div>
    `;

    document.getElementById('previewScreen').innerHTML = previewHTML;
}

function renderInstagramPreview(data) {
    const variant = data.variants.find(v => v.length === repurposeState.selectedVariant) || data.variants[1];
    const hashtags = data.hashtags[repurposeState.currentHashtagSet];

    const previewHTML = `
        <div class="social-preview instagram-preview">
            <div class="preview-header">
                <div class="preview-meta">
                    <div class="ig-avatar"></div>
                    <strong>savillsmanchester</strong>
                </div>
            </div>

            <div class="preview-image instagram-image">
                ${getImagePreviewHTML('instagram')}
            </div>

            <div class="preview-caption">
                <p><strong>savillsmanchester</strong> ${variant.caption.replace(/\n/g, '<br>')}</p>
                <div class="preview-hashtags">
                    ${hashtags.map(tag => `<span class="hashtag">${tag}</span>`).join(' ')}
                </div>
                <div class="preview-stats">
                    <small>${variant.characterCount} characters • ${variant.wordCount} words</small>
                </div>
            </div>

            <div class="preview-controls">
                <div class="variant-selector">
                    <label>
                        <input type="radio" name="igVariant" value="short" ${repurposeState.selectedVariant === 'short' ? 'checked' : ''} onchange="handleVariantChange(event)">
                        Short
                    </label>
                    <label>
                        <input type="radio" name="igVariant" value="medium" ${repurposeState.selectedVariant === 'medium' ? 'checked' : ''} onchange="handleVariantChange(event)">
                        Medium
                    </label>
                    <label>
                        <input type="radio" name="igVariant" value="long" ${repurposeState.selectedVariant === 'long' ? 'checked' : ''} onchange="handleVariantChange(event)">
                        Long
                    </label>
                </div>
                <div class="hashtag-selector">
                    <label>Hashtags:</label>
                    <select onchange="handleHashtagSetChange(event)">
                        <option value="recommended" selected>Recommended (Hybrid)</option>
                        <option value="reach">High Reach</option>
                        <option value="local">Local Focus</option>
                    </select>
                </div>
                <div class="aspect-selector">
                    <label>Aspect:</label>
                    <select onchange="handleAspectChange(event)">
                        <option value="1:1" selected>Square (1:1)</option>
                        <option value="4:5">Portrait (4:5)</option>
                    </select>
                </div>
            </div>

            <div class="preview-actions">
                <button class="edit-btn" onclick="handleEditCaption()">
                    ✏️ Edit Caption
                </button>
                <button class="regenerate-btn" onclick="handleRegenerate()">
                    🔄 Regenerate
                </button>
                <button class="copy-btn" onclick="handleCopyToClipboard()">
                    📋 Copy
                </button>
                <button class="download-btn primary" onclick="handleDownloadAsset()">
                    ⬇️ Download
                </button>
            </div>
        </div>
    `;

    document.getElementById('previewScreen').innerHTML = previewHTML;
}

// ========================================
// PREVIEW ACTION HANDLERS
// ========================================

function handleVariantChange(event) {
    repurposeState.selectedVariant = event.target.value;
    renderPreview();
}

function handleHashtagSetChange(event) {
    repurposeState.currentHashtagSet = event.target.value;
    renderPreview();
}

function handleAspectChange(event) {
    console.log('Aspect ratio changed to:', event.target.value);
    // In future: update image preview dimensions
}

function handleEditCaption() {
    alert('✏️ Edit Caption - Coming in Section 6: Frontend Integration');
    // Future: Open inline editor for caption text
}

function handleRegenerate() {
    alert('🔄 Regenerate - Coming in Section 6: Frontend Integration');
    // Future: Call API to regenerate caption with same parameters
}

function handleCopyToClipboard() {
    const platform = repurposeState.currentPlatform;
    const mockData = MOCK_SOCIAL_POSTS[platform];
    const variant = mockData.variants.find(v => v.length === repurposeState.selectedVariant) || mockData.variants[1];
    const hashtags = mockData.hashtags[repurposeState.currentHashtagSet];

    const fullText = variant.caption + '\n\n' + hashtags.join(' ');

    navigator.clipboard.writeText(fullText).then(() => {
        alert('📋 Caption and hashtags copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
    });
}

function handleDownloadAsset() {
    alert('⬇️ Download Asset - Coming in Section 8: Download/Export');
    // Future: Download formatted image with caption as JSON/text file
}

// ========================================
// SESSION DATA LOADING
// ========================================

function loadBrochureSessionData() {
    // Try to get session ID from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session') || urlParams.get('session_id') || localStorage.getItem('current_session_id');

    if (!sessionId) {
        console.warn('⚠️ No session ID found - using mock data only');
        return;
    }

    console.log('📂 Loading brochure session:', sessionId);
    repurposeState.sessionData = { session_id: sessionId };

    // Load images from brochure pages (window.EditorState is set by brochure editor)
    if (window.EditorState && window.EditorState.sessionData) {
        console.log('📸 Loading images from EditorState...');

        const images = [];
        const sessionData = window.EditorState.sessionData;

        // EditorState.sessionData.photos can be an object (keyed by ID) or array
        const photosLookup = sessionData.photos || {};

        // EditorState.photoUrls contains the actual URLs/dataUrls keyed by photo ID
        const photoUrls = window.EditorState.photoUrls || {};

        console.log('🔍 Photos metadata:', photosLookup);
        console.log('🔍 Photo URLs available:', photoUrls);

        // Pages can be in EditorState.pages OR sessionData.pages
        const pages = window.EditorState.pages || sessionData.pages || [];

        // Iterate through pages and collect photo URLs
        if (pages && Array.isArray(pages) && pages.length > 0) {
            console.log(`🔍 Iterating ${pages.length} pages...`);

            pages.forEach((page, pageIndex) => {
                console.log(`🔍 Page ${pageIndex}: type="${page.type}", photos=${page.photos ? `Array(${page.photos.length})` : 'undefined'}`);

                if (page.photos && Array.isArray(page.photos)) {
                    console.log(`📄 Page ${pageIndex} (${page.type}) has ${page.photos.length} photos:`, page.photos);

                    page.photos.forEach((photoItem, photoIndex) => {
                        console.log(`  🔍 Processing photoItem[${photoIndex}]:`, photoItem, `(type: ${typeof photoItem})`);

                        let photo = null;
                        let photoId = null;

                        // photoItem might be an ID string OR an object with {id, ...}
                        if (typeof photoItem === 'object' && photoItem !== null) {
                            photo = photoItem;
                            photoId = photoItem.id;
                            console.log(`    → Object with id="${photoId}"`);
                        } else {
                            // Otherwise it's an ID, look it up
                            photoId = photoItem;
                            photo = photosLookup[photoId];
                            console.log(`    → String ID="${photoId}", lookup result:`, photo);

                            // If photos is an array, try direct lookup
                            if (!photo && Array.isArray(photosLookup)) {
                                photo = photosLookup.find(p => p.id === photoId);
                                console.log(`    → Array search result:`, photo);
                            }
                        }

                        // Get URL from EditorState.photoUrls (primary) or photo.dataUrl (fallback)
                        const photoUrl = photoUrls[photoId] || (photo && (photo.dataUrl || photo.url || photo.src));
                        console.log(`    → photoUrl from photoUrls[${photoId}]:`, photoUrls[photoId] ? 'FOUND' : 'NOT FOUND');
                        console.log(`    → Final photoUrl:`, photoUrl ? photoUrl.substring(0, 60) + '...' : 'NULL');

                        if (photoUrl) {
                            const caption = photo ? (photo.caption || photo.room_name || photo.name || photo.filename) : null;
                            images.push({
                                url: photoUrl,
                                caption: caption || page.room_name || `Photo ${images.length + 1}`,
                                page_index: pageIndex,
                                page_type: page.type,
                                photo_id: photoId
                            });
                            console.log(`  ✓ Added photo: ${caption || photoId}`);
                        } else {
                            console.warn(`  ✗ Could not resolve URL for photo ${photoId}`, photo);
                        }
                    });
                } else {
                    console.log(`  ⚠️ Page ${pageIndex} has no photos array`);
                }
            });
        } else {
            console.warn('⚠️ No pages found in EditorState.pages or sessionData.pages');
            console.log('   EditorState.pages:', window.EditorState.pages);
            console.log('   sessionData.pages:', sessionData.pages);
        }

        if (images.length > 0) {
            repurposeState.brochureImages = images;
            console.log(`✅ Loaded ${images.length} images from brochure`);
        } else {
            console.warn('⚠️ No images found in brochure pages');
        }
    } else {
        console.warn('⚠️ window.EditorState.sessionData not available - images will not load');
        console.log('   Available EditorState:', window.EditorState);
    }

    // In Section 6, we'll load actual session content from API
}

// ========================================
// INITIALIZATION
// ========================================

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRepurposeModal);
} else {
    initRepurposeModal();
}
