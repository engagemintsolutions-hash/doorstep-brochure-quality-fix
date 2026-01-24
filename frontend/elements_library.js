// ============================================================================
// ELEMENTS LIBRARY
// Shapes, icons, and element management for brochure editor
// Uses expanded SHAPES_LIBRARY and ICONS_LIBRARY from elements_library_v2.js
// ============================================================================

(function() {
    'use strict';

    // ========================================================================
    // PANEL RENDERING - Canva-style with tabs, categories, and search
    // ========================================================================

    let renderRetryCount = 0;
    const MAX_RENDER_RETRIES = 5;

    function renderElementsPanel() {
        // Target the specific wrapper, NOT the whole elementsPanel
        // This preserves prebuiltSectionsContainer and textEffectsPanelContainer
        const container = document.getElementById('elementsLibraryContent');
        if (!container) {
            console.warn('Elements library content container not found');
            return;
        }

        // Dynamically reference the V2 libraries each time (fixes timing issues)
        const REAL_ESTATE_ICONS = window.ICONS_LIBRARY || {};
        const SHAPES = window.SHAPES_LIBRARY || {};
        const getShapeCategories = window.getShapesByCategory || (() => ({}));
        const getIconCategories = window.getIconsByCategory || (() => ({}));

        const shapeCategories = getShapeCategories();
        const iconCategories = getIconCategories();

        // If libraries not loaded yet, retry after a short delay
        if (Object.keys(shapeCategories).length === 0 && renderRetryCount < MAX_RENDER_RETRIES) {
            renderRetryCount++;
            console.log(`[Elements] V2 library not ready, retry ${renderRetryCount}/${MAX_RENDER_RETRIES}...`);
            setTimeout(renderElementsPanel, 200);
            return;
        }
        renderRetryCount = 0; // Reset counter on success

        // Render shapes by category
        function renderShapeCategories() {
            if (!shapeCategories || Object.keys(shapeCategories).length === 0) {
                return `<p class="no-items">Loading shapes...</p>`;
            }
            return Object.entries(shapeCategories).map(([category, shapes]) => `
                <div class="element-category" data-category="${category}">
                    <h5 class="category-title">${category.charAt(0).toUpperCase() + category.slice(1)}</h5>
                    <div class="elements-grid shapes-grid">
                        ${shapes.map(shape => `
                            <div class="element-item shape-item"
                                 data-element-type="shape"
                                 data-shape-type="${shape.id}"
                                 draggable="true"
                                 title="${shape.name}">
                                ${shape.svg}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }

        // Render icons by category
        function renderIconCategories() {
            if (!iconCategories || Object.keys(iconCategories).length === 0) {
                return `<p class="no-items">Loading icons...</p>`;
            }
            return Object.entries(iconCategories).map(([category, icons]) => `
                <div class="element-category" data-category="${category}">
                    <h5 class="category-title">${category.charAt(0).toUpperCase() + category.slice(1)}</h5>
                    <div class="elements-grid icons-grid">
                        ${icons.map(icon => `
                            <div class="element-item icon-item"
                                 data-element-type="icon"
                                 data-icon-type="${icon.id}"
                                 draggable="true"
                                 title="${icon.name}">
                                ${icon.svg}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }

        container.innerHTML = `
            <div class="elements-panel-content">
                <!-- Tabs for Shapes/Icons -->
                <div class="elements-tabs">
                    <button class="elements-tab active" data-tab="shapes">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                        </svg>
                        Shapes
                    </button>
                    <button class="elements-tab" data-tab="icons">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="16"/>
                            <line x1="8" y1="12" x2="16" y2="12"/>
                        </svg>
                        Icons
                    </button>
                    <button class="elements-tab" data-tab="qrcode">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="7" height="7"/>
                            <rect x="14" y="3" width="7" height="7"/>
                            <rect x="3" y="14" width="7" height="7"/>
                        </svg>
                        QR
                    </button>
                    <button class="elements-tab" data-tab="pro-blocks">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <line x1="3" y1="9" x2="21" y2="9"/>
                            <line x1="9" y1="21" x2="9" y2="9"/>
                        </svg>
                        Pro
                    </button>
                    <button class="elements-tab" data-tab="layouts">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="3" width="7" height="9"/>
                            <rect x="14" y="3" width="7" height="5"/>
                            <rect x="14" y="12" width="7" height="9"/>
                            <rect x="3" y="16" width="7" height="5"/>
                        </svg>
                        Layouts
                    </button>
                </div>

                <!-- Search Bar -->
                <div class="elements-search">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input type="text" id="elementsSearchInput" placeholder="Search elements...">
                </div>

                <!-- Shapes Tab Content -->
                <div class="elements-tab-content active" id="shapes-content">
                    ${renderShapeCategories()}
                </div>

                <!-- Icons Tab Content -->
                <div class="elements-tab-content" id="icons-content">
                    ${renderIconCategories()}
                </div>

                <!-- QR Code Tab Content -->
                <div class="elements-tab-content" id="qrcode-content">
                    <div class="qr-section">
                        <div class="qr-preview">
                            <svg viewBox="0 0 100 100" width="80" height="80">
                                <rect x="0" y="0" width="100" height="100" fill="#f0f0f0"/>
                                <rect x="10" y="10" width="25" height="25" fill="#333"/>
                                <rect x="65" y="10" width="25" height="25" fill="#333"/>
                                <rect x="10" y="65" width="25" height="25" fill="#333"/>
                                <rect x="45" y="45" width="10" height="10" fill="#333"/>
                            </svg>
                        </div>
                        <button id="addQRCodeBtn" class="action-btn primary full-width">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Add QR Code
                        </button>
                        <p class="help-text">Generates a QR code linking to the property listing</p>
                    </div>
                </div>

                <!-- Pro Blocks Tab Content (Professional Components) -->
                <div class="elements-tab-content" id="pro-blocks-content">
                    <div class="pro-blocks-section">
                        <p class="section-label" style="font-size: 11px; color: #666; margin-bottom: 12px;">Professional estate agent brochure components</p>

                        <div class="element-category">
                            <h5 class="category-title">Property Stats</h5>
                            <div class="elements-grid pro-grid" style="grid-template-columns: 1fr 1fr; gap: 8px;">
                                <button class="pro-block-btn" data-block="stats-row" title="Property Stats Row">
                                    <div style="display: flex; gap: 8px; font-size: 10px;">
                                        <span>4 Beds</span>
                                        <span>3 Baths</span>
                                        <span>2,400 sqft</span>
                                    </div>
                                    <span class="block-label">Stats Row</span>
                                </button>
                                <button class="pro-block-btn" data-block="stats-grid" title="Stats Boxes Grid">
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3px; font-size: 8px;">
                                        <div style="background: #f0f0f0; padding: 4px; text-align: center;">4</div>
                                        <div style="background: #f0f0f0; padding: 4px; text-align: center;">3</div>
                                    </div>
                                    <span class="block-label">Stats Grid</span>
                                </button>
                            </div>
                        </div>

                        <div class="element-category">
                            <h5 class="category-title">Features</h5>
                            <div class="elements-grid pro-grid" style="grid-template-columns: 1fr 1fr; gap: 8px;">
                                <button class="pro-block-btn" data-block="feature-pills" title="Feature Pills/Tags">
                                    <div style="display: flex; flex-wrap: wrap; gap: 3px; font-size: 8px;">
                                        <span style="background: #eee; padding: 2px 6px; border-radius: 10px;">Garden</span>
                                        <span style="background: #eee; padding: 2px 6px; border-radius: 10px;">Parking</span>
                                    </div>
                                    <span class="block-label">Feature Pills</span>
                                </button>
                                <button class="pro-block-btn" data-block="feature-list" title="Two Column Features">
                                    <div style="font-size: 8px; text-align: left;">
                                        <div>• Period features</div>
                                        <div>• South garden</div>
                                    </div>
                                    <span class="block-label">Feature List</span>
                                </button>
                            </div>
                        </div>

                        <div class="element-category">
                            <h5 class="category-title">Contact</h5>
                            <div class="elements-grid pro-grid" style="grid-template-columns: 1fr 1fr; gap: 8px;">
                                <button class="pro-block-btn" data-block="agent-card" title="Agent Contact Card">
                                    <div style="display: flex; gap: 6px; align-items: center; font-size: 8px;">
                                        <div style="width: 20px; height: 20px; background: #ddd; border-radius: 50%;"></div>
                                        <div>Agent Name</div>
                                    </div>
                                    <span class="block-label">Agent Card</span>
                                </button>
                                <button class="pro-block-btn" data-block="cta-button" title="Call to Action Button">
                                    <div style="background: var(--template-primary, #C20430); color: white; padding: 4px 10px; font-size: 8px; border-radius: 3px;">
                                        Book Viewing
                                    </div>
                                    <span class="block-label">CTA Button</span>
                                </button>
                            </div>
                        </div>

                        <div class="element-category">
                            <h5 class="category-title">Photo Layouts</h5>
                            <div class="elements-grid pro-grid" style="grid-template-columns: 1fr 1fr; gap: 8px;">
                                <button class="pro-block-btn" data-block="gallery-hero" title="Hero + 2 Side Layout">
                                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2px; height: 30px;">
                                        <div style="background: #ddd; grid-row: span 2;"></div>
                                        <div style="background: #ccc;"></div>
                                        <div style="background: #ccc;"></div>
                                    </div>
                                    <span class="block-label">Hero + Side</span>
                                </button>
                                <button class="pro-block-btn" data-block="gallery-grid" title="2x2 Photo Grid">
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2px; height: 30px;">
                                        <div style="background: #ddd;"></div>
                                        <div style="background: #ccc;"></div>
                                        <div style="background: #ccc;"></div>
                                        <div style="background: #ddd;"></div>
                                    </div>
                                    <span class="block-label">2x2 Grid</span>
                                </button>
                            </div>
                        </div>

                        <div class="element-category">
                            <h5 class="category-title">Branding</h5>
                            <div class="elements-grid pro-grid" style="grid-template-columns: 1fr 1fr; gap: 8px;">
                                <button class="pro-block-btn" data-block="price-badge" title="Price Badge">
                                    <div style="background: var(--template-primary, #C20430); color: white; padding: 4px 8px; font-size: 9px; font-weight: bold;">
                                        £850,000
                                    </div>
                                    <span class="block-label">Price Badge</span>
                                </button>
                                <button class="pro-block-btn" data-block="branding-footer" title="Agency Footer">
                                    <div style="border-top: 1px solid #ddd; padding-top: 4px; font-size: 7px; display: flex; justify-content: space-between;">
                                        <span>Logo</span>
                                        <span>Contact</span>
                                    </div>
                                    <span class="block-label">Footer</span>
                                </button>
                            </div>
                        </div>

                        <div class="element-category">
                            <h5 class="category-title">Status Badges</h5>
                            <div class="elements-grid pro-grid" style="grid-template-columns: 1fr 1fr; gap: 8px;">
                                <button class="pro-block-btn" data-block="badge-sold" title="Sold Badge">
                                    <div style="background: #C20430; color: white; padding: 3px 8px; font-size: 8px; font-weight: bold;">SOLD</div>
                                    <span class="block-label">Sold</span>
                                </button>
                                <button class="pro-block-btn" data-block="badge-under-offer" title="Under Offer Badge">
                                    <div style="background: #E67E22; color: white; padding: 3px 8px; font-size: 8px; font-weight: bold;">UNDER OFFER</div>
                                    <span class="block-label">Under Offer</span>
                                </button>
                                <button class="pro-block-btn" data-block="badge-new" title="New Badge">
                                    <div style="background: #27AE60; color: white; padding: 3px 8px; font-size: 8px; font-weight: bold;">NEW</div>
                                    <span class="block-label">New</span>
                                </button>
                                <button class="pro-block-btn" data-block="badge-price-reduced" title="Price Reduced Badge">
                                    <div style="background: #8E44AD; color: white; padding: 3px 8px; font-size: 7px; font-weight: bold;">PRICE REDUCED</div>
                                    <span class="block-label">Price Reduced</span>
                                </button>
                            </div>
                        </div>

                        <div class="element-category">
                            <h5 class="category-title">Dividers</h5>
                            <div class="elements-grid pro-grid" style="grid-template-columns: 1fr 1fr; gap: 8px;">
                                <button class="pro-block-btn" data-block="divider-elegant" title="Elegant Divider">
                                    <div style="display: flex; align-items: center; gap: 5px; width: 100%;">
                                        <div style="flex:1; height: 1px; background: #ccc;"></div>
                                        <span style="font-size: 10px;">✦</span>
                                        <div style="flex:1; height: 1px; background: #ccc;"></div>
                                    </div>
                                    <span class="block-label">Elegant</span>
                                </button>
                                <button class="pro-block-btn" data-block="divider-ornate" title="Ornate Divider">
                                    <div style="display: flex; align-items: center; gap: 5px;">
                                        <div style="width: 20px; height: 1px; background: #C9A961;"></div>
                                        <span style="font-size: 12px; color: #C9A961;">❧</span>
                                        <div style="width: 20px; height: 1px; background: #C9A961;"></div>
                                    </div>
                                    <span class="block-label">Ornate</span>
                                </button>
                            </div>
                        </div>

                        <div class="element-category">
                            <h5 class="category-title">Quotes & Highlights</h5>
                            <div class="elements-grid pro-grid" style="grid-template-columns: 1fr 1fr; gap: 8px;">
                                <button class="pro-block-btn" data-block="testimonial" title="Testimonial Block">
                                    <div style="font-size: 14px; color: #C9A961; opacity: 0.5;">"</div>
                                    <span class="block-label">Testimonial</span>
                                </button>
                                <button class="pro-block-btn" data-block="pull-quote" title="Pull Quote">
                                    <div style="font-size: 8px; font-style: italic; border-top: 2px solid #C9A961; border-bottom: 2px solid #C9A961; padding: 4px 0;">Quote</div>
                                    <span class="block-label">Pull Quote</span>
                                </button>
                                <button class="pro-block-btn" data-block="highlight-box" title="Highlight Box">
                                    <div style="background: #f8f6f2; border-left: 3px solid #C9A961; padding: 4px 6px; font-size: 7px;">Highlight</div>
                                    <span class="block-label">Highlight Box</span>
                                </button>
                                <button class="pro-block-btn" data-block="selling-points" title="Key Selling Points">
                                    <div style="display: flex; gap: 4px; font-size: 10px;">
                                        <span>🏠</span><span>🌳</span><span>🚗</span>
                                    </div>
                                    <span class="block-label">Selling Points</span>
                                </button>
                            </div>
                        </div>

                        <div class="element-category">
                            <h5 class="category-title">Property Info</h5>
                            <div class="elements-grid pro-grid" style="grid-template-columns: 1fr 1fr; gap: 8px;">
                                <button class="pro-block-btn" data-block="epc-rating" title="EPC Rating">
                                    <div style="display: flex; align-items: center; gap: 4px;">
                                        <div style="background: #8dce46; color: white; padding: 2px 6px; font-size: 10px; font-weight: bold;">C</div>
                                        <span style="font-size: 8px;">EPC</span>
                                    </div>
                                    <span class="block-label">EPC Rating</span>
                                </button>
                                <button class="pro-block-btn" data-block="council-tax" title="Council Tax Band">
                                    <div style="display: flex; align-items: center; gap: 4px;">
                                        <div style="background: #333; color: white; padding: 2px 6px; font-size: 10px; font-weight: bold;">D</div>
                                        <span style="font-size: 8px;">Tax</span>
                                    </div>
                                    <span class="block-label">Council Tax</span>
                                </button>
                                <button class="pro-block-btn" data-block="floorplan" title="Floor Plan Section">
                                    <div style="border: 1px dashed #ccc; padding: 8px; font-size: 8px; color: #999;">📐 Floor Plan</div>
                                    <span class="block-label">Floor Plan</span>
                                </button>
                                <button class="pro-block-btn" data-block="location-section" title="Location Section">
                                    <div style="display: flex; gap: 4px; font-size: 8px;">
                                        <div style="background: #e8e8e8; padding: 4px;">🗺️</div>
                                        <div style="font-size: 7px;">Transport</div>
                                    </div>
                                    <span class="block-label">Location</span>
                                </button>
                            </div>
                        </div>

                        <div class="element-category">
                            <h5 class="category-title">Interactive</h5>
                            <div class="elements-grid pro-grid" style="grid-template-columns: 1fr 1fr; gap: 8px;">
                                <button class="pro-block-btn" data-block="virtual-tour" title="Virtual Tour CTA">
                                    <div style="background: #1a1a1a; color: white; padding: 6px; font-size: 7px; border-radius: 3px;">🎬 Virtual Tour</div>
                                    <span class="block-label">Virtual Tour</span>
                                </button>
                                <button class="pro-block-btn" data-block="room-dimensions" title="Room Dimensions">
                                    <div style="font-size: 7px; text-align: left;">
                                        <div style="border-left: 2px solid #C20430; padding-left: 4px; margin-bottom: 2px;">Living: 5.2 x 4.1m</div>
                                        <div style="border-left: 2px solid #C20430; padding-left: 4px;">Kitchen: 4.8 x 3.6m</div>
                                    </div>
                                    <span class="block-label">Room Sizes</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Layouts Tab Content (Page Layouts) -->
                <div class="elements-tab-content" id="layouts-content">
                    <div class="layouts-panel">
                        <p class="section-label" style="font-size: 11px; color: #666; margin-bottom: 15px;">
                            Professional page layouts with photo placeholders - like real estate agent brochures
                        </p>

                        <div class="layout-category">
                            <div class="layout-category-title">Cover Pages</div>
                            <div class="layout-grid">
                                <div class="layout-card" data-layout="cover_hero_full" title="Full Hero Cover - Large image with text overlay">
                                    <div class="layout-preview-thumb cover-hero"></div>
                                    <div class="layout-card-name">Full Hero</div>
                                </div>
                                <div class="layout-card" data-layout="cover_hero_bottom" title="Bottom Text Cover - Hero image with info bar">
                                    <div class="layout-preview-thumb cover-hero"></div>
                                    <div class="layout-card-name">Bottom Bar</div>
                                </div>
                                <div class="layout-card" data-layout="cover_split_left" title="Split Cover - Image left, text right">
                                    <div class="layout-preview-thumb cover-split"></div>
                                    <div class="layout-card-name">Split Left</div>
                                </div>
                                <div class="layout-card" data-layout="cover_minimal" title="Minimal Cover - Clean modern style">
                                    <div class="layout-preview-thumb cover-hero"></div>
                                    <div class="layout-card-name">Minimal</div>
                                </div>
                            </div>
                        </div>

                        <div class="layout-category">
                            <div class="layout-category-title">Photo Galleries</div>
                            <div class="layout-grid">
                                <div class="layout-card" data-layout="gallery_grid_4" title="4-Photo Grid - Equal photos">
                                    <div class="layout-preview-thumb gallery-grid"></div>
                                    <div class="layout-card-name">4-Photo Grid</div>
                                </div>
                                <div class="layout-card" data-layout="gallery_hero_3" title="Hero + 3 Photos">
                                    <div class="layout-preview-thumb gallery-hero"></div>
                                    <div class="layout-card-name">Hero + 3</div>
                                </div>
                                <div class="layout-card" data-layout="gallery_magazine" title="Magazine Layout - Asymmetric grid">
                                    <div class="layout-preview-thumb gallery-hero"></div>
                                    <div class="layout-card-name">Magazine</div>
                                </div>
                                <div class="layout-card" data-layout="gallery_filmstrip" title="Filmstrip - Horizontal photos">
                                    <div class="layout-preview-thumb gallery-grid"></div>
                                    <div class="layout-card-name">Filmstrip</div>
                                </div>
                            </div>
                        </div>

                        <div class="layout-category">
                            <div class="layout-category-title">Content Pages</div>
                            <div class="layout-grid">
                                <div class="layout-card" data-layout="content_split_right" title="Image Right - Text left, image right">
                                    <div class="layout-preview-thumb content-split"></div>
                                    <div class="layout-card-name">Image Right</div>
                                </div>
                                <div class="layout-card" data-layout="content_split_left" title="Image Left - Image left, text right">
                                    <div class="layout-preview-thumb content-split" style="transform: scaleX(-1);"></div>
                                    <div class="layout-card-name">Image Left</div>
                                </div>
                                <div class="layout-card" data-layout="content_full_text" title="Full Text Page - For detailed descriptions">
                                    <div class="layout-preview-thumb" style="background: linear-gradient(to bottom, transparent 20%, #e0e0e0 20%, #e0e0e0 25%, transparent 25%, transparent 30%, #e0e0e0 30%, #e0e0e0 35%, transparent 35%, transparent 40%, #e0e0e0 40%, #e0e0e0 45%, transparent 45%);"></div>
                                    <div class="layout-card-name">Full Text</div>
                                </div>
                                <div class="layout-card" data-layout="content_features" title="Key Features - Bullet points with image">
                                    <div class="layout-preview-thumb content-split"></div>
                                    <div class="layout-card-name">Key Features</div>
                                </div>
                            </div>
                        </div>

                        <div class="layout-category">
                            <div class="layout-category-title">Special Pages</div>
                            <div class="layout-grid">
                                <div class="layout-card" data-layout="floorplan_page" title="Floor Plan Page">
                                    <div class="layout-preview-thumb" style="background: #f5f5f5; display: flex; align-items: center; justify-content: center;">
                                        <span style="font-size: 20px; opacity: 0.3;">⌂</span>
                                    </div>
                                    <div class="layout-card-name">Floor Plan</div>
                                </div>
                                <div class="layout-card" data-layout="location_map" title="Location Map Page">
                                    <div class="layout-preview-thumb" style="background: linear-gradient(to right, #e0e0e0 65%, #f5f5f5 65%);">
                                    </div>
                                    <div class="layout-card-name">Location Map</div>
                                </div>
                                <div class="layout-card" data-layout="agent_contact" title="Agent Contact Page">
                                    <div class="layout-preview-thumb" style="background: #fafafa; display: flex; align-items: center; justify-content: center;">
                                        <span style="font-size: 20px; opacity: 0.3;">📞</span>
                                    </div>
                                    <div class="layout-card-name">Contact</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Color Picker for Selected Element -->
                <div class="elements-section element-properties" id="elementPropertiesSection" style="display: none;">
                    <h4 class="section-title">Element Properties</h4>
                    <div class="property-row">
                        <label>Fill Color</label>
                        <div class="color-input-group">
                            <input type="color" id="elementFillColor" value="#C20430">
                            <input type="text" id="elementFillColorHex" value="#C20430" maxlength="7">
                        </div>
                    </div>
                    <div class="property-row">
                        <label>Stroke Color</label>
                        <div class="color-input-group">
                            <input type="color" id="elementStrokeColor" value="#000000">
                            <input type="text" id="elementStrokeColorHex" value="#000000" maxlength="7">
                        </div>
                    </div>
                    <div class="property-row">
                        <label>Stroke Width</label>
                        <input type="range" id="elementStrokeWidth" min="0" max="10" value="0" step="1">
                        <span id="elementStrokeWidthValue">0px</span>
                    </div>
                    <div class="property-row">
                        <label>Opacity</label>
                        <input type="range" id="elementOpacity" min="0" max="100" value="100" step="5">
                        <span id="elementOpacityValue">100%</span>
                    </div>
                </div>
            </div>
        `;

        // Attach event listeners
        attachElementsLibraryListeners();
    }

    // ========================================================================
    // EVENT LISTENERS
    // ========================================================================

    function attachElementsLibraryListeners() {
        const panel = document.getElementById('elementsPanel');
        if (!panel) return;

        // Tab switching
        panel.querySelectorAll('.elements-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                panel.querySelectorAll('.elements-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Show corresponding content
                const tabName = tab.dataset.tab;
                panel.querySelectorAll('.elements-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                const targetContent = panel.querySelector(`#${tabName}-content`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });

        // Search functionality
        const searchInput = panel.querySelector('#elementsSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase().trim();
                // Search in visible tab
                const activeContent = panel.querySelector('.elements-tab-content.active');
                if (activeContent) {
                    activeContent.querySelectorAll('.element-item').forEach(item => {
                        const name = item.title.toLowerCase();
                        item.style.display = !term || name.includes(term) ? 'flex' : 'none';
                    });
                    // Show/hide empty categories
                    activeContent.querySelectorAll('.element-category').forEach(cat => {
                        const visibleItems = cat.querySelectorAll('.element-item[style*="flex"], .element-item:not([style*="display"])');
                        cat.style.display = visibleItems.length > 0 ? 'block' : 'none';
                    });
                }
            });
        }

        // Drag start for shapes and icons
        panel.querySelectorAll('.element-item').forEach(item => {
            item.addEventListener('dragstart', handleLibraryDragStart);
            item.addEventListener('click', handleLibraryItemClick);
        });

        // QR Code button
        const qrBtn = document.getElementById('addQRCodeBtn');
        if (qrBtn) {
            qrBtn.addEventListener('click', addQRCodeToCurrentPage);
        }

        // Pro Blocks buttons
        panel.querySelectorAll('.pro-block-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const blockType = btn.dataset.block;
                if (blockType) {
                    addProBlockToCurrentPage(blockType);
                }
            });
        });

        // Layout cards - Apply page layouts
        panel.querySelectorAll('.layout-card').forEach(card => {
            card.addEventListener('click', () => {
                const layoutId = card.dataset.layout;
                if (layoutId && typeof window.applyPageLayout === 'function') {
                    // Get current page
                    const currentPage = document.querySelector('.brochure-page.active') ||
                                       document.querySelector('.brochure-page');
                    if (currentPage) {
                        // Apply the layout
                        window.applyPageLayout(layoutId, currentPage);

                        // Update active state in panel
                        panel.querySelectorAll('.layout-card').forEach(c => c.classList.remove('active'));
                        card.classList.add('active');

                        console.log(`📐 Applied layout: ${layoutId}`);
                    } else {
                        console.warn('No page found to apply layout to');
                    }
                } else if (!window.applyPageLayout) {
                    console.warn('Page layouts not loaded - make sure page_layouts.js is included');
                }
            });
        });

        // Property controls
        attachPropertyListeners();

        // Set up canvas drop zone
        setupCanvasDropZone();
    }

    function handleLibraryDragStart(event) {
        const item = event.target.closest('.element-item');
        if (!item) {
            console.warn('[Drag] No element-item found');
            return;
        }

        const elementType = item.dataset.elementType;
        const shapeType = item.dataset.shapeType || '';
        const iconType = item.dataset.iconType || '';

        console.log('[Drag] Starting drag:', { elementType, shapeType, iconType });

        // Set drag data
        const dragData = JSON.stringify({
            elementType,
            shapeType,
            iconType,
            source: 'elements-library'
        });

        event.dataTransfer.setData('text/plain', dragData);
        event.dataTransfer.setData('application/json', dragData);
        event.dataTransfer.effectAllowed = 'copy';

        // Create drag image (clone of the SVG)
        const svg = item.querySelector('svg');
        if (svg) {
            const dragImage = svg.cloneNode(true);
            dragImage.style.width = '50px';
            dragImage.style.height = '50px';
            dragImage.style.position = 'absolute';
            dragImage.style.top = '-1000px';
            document.body.appendChild(dragImage);
            event.dataTransfer.setDragImage(dragImage, 25, 25);
            setTimeout(() => document.body.removeChild(dragImage), 0);
        }

        // Add visual feedback
        item.classList.add('dragging');
        setTimeout(() => item.classList.remove('dragging'), 100);
    }

    function handleLibraryItemClick(event) {
        const item = event.target.closest('.element-item');
        if (!item) return;

        // Add element to center of current page
        const elementType = item.dataset.elementType;
        const shapeType = item.dataset.shapeType || '';
        const iconType = item.dataset.iconType || '';

        addElementToCurrentPage(elementType, shapeType, iconType);
    }

    function setupCanvasDropZone() {
        const canvas = document.getElementById('brochureCanvas');
        if (!canvas) {
            console.warn('[Drop Zone] Canvas not found, will retry...');
            // Retry after a delay in case canvas loads later
            setTimeout(setupCanvasDropZone, 1000);
            return;
        }

        console.log('[Drop Zone] Setting up canvas drop zone');

        // Remove any existing listeners first (prevent duplicates)
        canvas.removeEventListener('dragover', handleCanvasDragOver);
        canvas.removeEventListener('dragleave', handleCanvasDragLeave);
        canvas.removeEventListener('drop', handleCanvasDrop);

        // Add new listeners
        canvas.addEventListener('dragover', handleCanvasDragOver);
        canvas.addEventListener('dragleave', handleCanvasDragLeave);
        canvas.addEventListener('drop', handleCanvasDrop);

        console.log('[Drop Zone] Canvas drop zone ready');
    }

    function handleCanvasDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';

        // Highlight drop target
        const page = e.target.closest('.brochure-page');
        if (page) {
            // Remove highlight from other pages
            document.querySelectorAll('.brochure-page.drop-target').forEach(p => {
                if (p !== page) p.classList.remove('drop-target');
            });
            page.classList.add('drop-target');
        }
    }

    function handleCanvasDragLeave(e) {
        // Only remove highlight if we're actually leaving the page
        const page = e.target.closest('.brochure-page');
        const relatedPage = e.relatedTarget?.closest('.brochure-page');

        if (page && page !== relatedPage) {
            page.classList.remove('drop-target');
        }
    }

    function handleCanvasDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        console.log('[Drop] Drop event received');

        // Remove all highlights
        document.querySelectorAll('.brochure-page.drop-target').forEach(p => {
            p.classList.remove('drop-target');
        });

        // Get drop data - try both formats
        let data;
        try {
            const jsonData = e.dataTransfer.getData('application/json') ||
                           e.dataTransfer.getData('text/plain');
            if (!jsonData) {
                console.warn('[Drop] No drag data found');
                return;
            }
            data = JSON.parse(jsonData);
            console.log('[Drop] Parsed data:', data);
        } catch (err) {
            console.warn('[Drop] Failed to parse drag data:', err);
            return;
        }

        if (!data.elementType) {
            console.warn('[Drop] No element type in data');
            return;
        }

        // Find which page was dropped on
        const page = e.target.closest('.brochure-page');
        if (!page) {
            console.warn('[Drop] No page found at drop location');
            // Try to find the first page as fallback
            const firstPage = document.querySelector('.brochure-page');
            if (!firstPage) {
                console.error('[Drop] No pages available');
                return;
            }
            console.log('[Drop] Using first page as fallback');
        }

        const targetPage = page || document.querySelector('.brochure-page');
        const pageId = targetPage.dataset.pageId;
        const pageRect = targetPage.getBoundingClientRect();
        const zoom = getCanvasZoom();

        // Calculate drop position relative to page
        const x = Math.max(10, (e.clientX - pageRect.left) / zoom - 50);
        const y = Math.max(10, (e.clientY - pageRect.top) / zoom - 50);

        console.log('[Drop] Adding element at:', { pageId, x, y });

        // Create element at drop position
        addElementAtPosition(pageId, data.elementType, data.shapeType, data.iconType, x, y);

        // Show success feedback
        if (typeof showToast === 'function') {
            showToast(`Added ${data.shapeType || data.iconType || 'element'}`, 'success');
        }
    }

    function attachPropertyListeners() {
        // Fill color
        const fillColor = document.getElementById('elementFillColor');
        const fillColorHex = document.getElementById('elementFillColorHex');
        if (fillColor && fillColorHex) {
            fillColor.addEventListener('input', (e) => {
                fillColorHex.value = e.target.value;
                updateSelectedElementProperty('fill', e.target.value);
            });
            fillColorHex.addEventListener('change', (e) => {
                const val = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value;
                fillColor.value = val;
                updateSelectedElementProperty('fill', val);
            });
        }

        // Stroke color
        const strokeColor = document.getElementById('elementStrokeColor');
        const strokeColorHex = document.getElementById('elementStrokeColorHex');
        if (strokeColor && strokeColorHex) {
            strokeColor.addEventListener('input', (e) => {
                strokeColorHex.value = e.target.value;
                updateSelectedElementProperty('stroke', e.target.value);
            });
            strokeColorHex.addEventListener('change', (e) => {
                const val = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value;
                strokeColor.value = val;
                updateSelectedElementProperty('stroke', val);
            });
        }

        // Stroke width
        const strokeWidth = document.getElementById('elementStrokeWidth');
        const strokeWidthValue = document.getElementById('elementStrokeWidthValue');
        if (strokeWidth && strokeWidthValue) {
            strokeWidth.addEventListener('input', (e) => {
                strokeWidthValue.textContent = e.target.value + 'px';
                updateSelectedElementProperty('strokeWidth', parseInt(e.target.value));
            });
        }

        // Opacity
        const opacity = document.getElementById('elementOpacity');
        const opacityValue = document.getElementById('elementOpacityValue');
        if (opacity && opacityValue) {
            opacity.addEventListener('input', (e) => {
                opacityValue.textContent = e.target.value + '%';
                updateSelectedElementProperty('opacity', e.target.value / 100);
            });
        }
    }

    // ========================================================================
    // ELEMENT CREATION
    // ========================================================================

    function createShapeElement(shapeType, options = {}) {
        return {
            id: ElementDrag.createElementId(),
            type: 'shape',
            shapeType: shapeType,
            position: options.position || { x: 100, y: 100 },
            size: options.size || { width: 100, height: 100 },
            rotation: 0,
            zIndex: options.zIndex || 10,
            locked: false,
            visible: true,
            fill: options.fill || '#C20430',
            stroke: options.stroke || 'none',
            strokeWidth: options.strokeWidth || 0,
            opacity: options.opacity || 1,
            borderRadius: options.borderRadius || 0
        };
    }

    function createIconElement(iconType, options = {}) {
        const iconsLib = window.ICONS_LIBRARY || {};
        const iconDef = iconsLib[iconType];
        if (!iconDef) {
            console.warn('Unknown icon type:', iconType);
            return null;
        }

        return {
            id: ElementDrag.createElementId(),
            type: 'icon',
            iconType: iconType,
            position: options.position || { x: 100, y: 100 },
            size: options.size || { width: 48, height: 48 },
            rotation: 0,
            zIndex: options.zIndex || 10,
            locked: false,
            visible: true,
            fill: options.fill || '#374151',
            viewBox: iconDef.viewBox,
            svgPath: iconDef.path,
            opacity: options.opacity || 1
        };
    }

    function createQRCodeElement(url, options = {}) {
        return {
            id: ElementDrag.createElementId(),
            type: 'qrcode',
            position: options.position || { x: 100, y: 100 },
            size: options.size || { width: 100, height: 100 },
            rotation: 0,
            zIndex: options.zIndex || 10,
            locked: false,
            visible: true,
            url: url || '',
            foreground: options.foreground || '#000000',
            background: options.background || '#FFFFFF',
            opacity: options.opacity || 1
        };
    }

    // ========================================================================
    // ADD ELEMENTS TO PAGE
    // ========================================================================

    function addElementToCurrentPage(elementType, shapeType, iconType) {
        const pageId = EditorState.currentPage;
        if (!pageId) {
            showToast('Please select a page first', 'warning');
            return;
        }

        // Center position on page
        const page = document.querySelector(`.brochure-page[data-page-id="${pageId}"]`);
        if (!page) return;

        const centerX = (page.offsetWidth / 2) - 50;
        const centerY = (page.offsetHeight / 2) - 50;

        addElementAtPosition(pageId, elementType, shapeType, iconType, centerX, centerY);
    }

    function addElementAtPosition(pageId, elementType, shapeType, iconType, x, y) {
        let elementData;
        const zIndex = ElementDrag.getNextZIndex(pageId);

        switch (elementType) {
            case 'shape':
                elementData = createShapeElement(shapeType, {
                    position: { x, y },
                    zIndex
                });
                break;
            case 'icon':
                elementData = createIconElement(iconType, {
                    position: { x, y },
                    zIndex
                });
                break;
            case 'qrcode':
                const propertyUrl = getPropertyUrl();
                elementData = createQRCodeElement(propertyUrl, {
                    position: { x, y },
                    zIndex
                });
                break;
        }

        if (!elementData) return;

        // Save to history
        if (typeof saveToHistory === 'function') {
            saveToHistory('add element');
        }

        // Add to page
        ElementDrag.addElementToPage(elementData, pageId);

        // Select the new element
        setTimeout(() => {
            const element = document.querySelector(`[data-element-id="${elementData.id}"]`);
            if (element) {
                ElementDrag.selectElement(element);
            }
        }, 50);

        showToast(`Added ${elementType}`, 'success');
    }

    function addQRCodeToCurrentPage() {
        addElementToCurrentPage('qrcode', '', '');
    }

    // ========================================================================
    // ELEMENT PROPERTIES
    // ========================================================================

    function showElementProperties(element, elementType) {
        const section = document.getElementById('elementPropertiesSection');
        if (!section) return;

        section.style.display = 'block';

        // Get element data
        const elementId = element.dataset.elementId;
        const pageId = element.closest('.brochure-page')?.dataset.pageId;
        const elementData = getElementData(elementId, pageId);

        if (!elementData) return;

        // Update controls with element values
        const fillColor = document.getElementById('elementFillColor');
        const fillColorHex = document.getElementById('elementFillColorHex');
        if (fillColor && elementData.fill) {
            fillColor.value = elementData.fill;
            fillColorHex.value = elementData.fill;
        }

        const strokeColor = document.getElementById('elementStrokeColor');
        const strokeColorHex = document.getElementById('elementStrokeColorHex');
        if (strokeColor && elementData.stroke) {
            strokeColor.value = elementData.stroke === 'none' ? '#000000' : elementData.stroke;
            strokeColorHex.value = elementData.stroke === 'none' ? '#000000' : elementData.stroke;
        }

        const strokeWidth = document.getElementById('elementStrokeWidth');
        const strokeWidthValue = document.getElementById('elementStrokeWidthValue');
        if (strokeWidth) {
            strokeWidth.value = elementData.strokeWidth || 0;
            strokeWidthValue.textContent = (elementData.strokeWidth || 0) + 'px';
        }

        const opacity = document.getElementById('elementOpacity');
        const opacityValue = document.getElementById('elementOpacityValue');
        if (opacity) {
            opacity.value = (elementData.opacity || 1) * 100;
            opacityValue.textContent = Math.round((elementData.opacity || 1) * 100) + '%';
        }
    }

    function hideElementProperties() {
        const section = document.getElementById('elementPropertiesSection');
        if (section) {
            section.style.display = 'none';
        }
    }

    function updateSelectedElementProperty(property, value) {
        if (!EditorState.selectedElements || EditorState.selectedElements.length === 0) return;

        EditorState.selectedElements.forEach(element => {
            const elementId = element.dataset.elementId;
            const pageId = element.closest('.brochure-page')?.dataset.pageId;

            // Update data
            const elementData = getElementData(elementId, pageId);
            if (elementData) {
                elementData[property] = value;
            }

            // Update DOM
            updateElementAppearance(element, property, value);
        });

        EditorState.isDirty = true;
    }

    function updateElementAppearance(element, property, value) {
        const svg = element.querySelector('svg');
        if (!svg) return;

        const shape = svg.querySelector('rect, circle, ellipse, polygon, line, path');

        switch (property) {
            case 'fill':
                if (shape) shape.setAttribute('fill', value);
                break;
            case 'stroke':
                if (shape) shape.setAttribute('stroke', value);
                break;
            case 'strokeWidth':
                if (shape) shape.setAttribute('stroke-width', value);
                break;
            case 'opacity':
                element.style.opacity = value;
                break;
        }
    }

    // ========================================================================
    // HELPER FUNCTIONS
    // ========================================================================

    function getElementData(elementId, pageId) {
        if (!pageId || !EditorState.elements[pageId]) return null;
        return EditorState.elements[pageId].find(el => el.id === elementId);
    }

    function getCanvasZoom() {
        const canvas = document.getElementById('brochureCanvas');
        if (!canvas) return 1;
        const transform = canvas.style.transform;
        const match = transform.match(/scale\(([^)]+)\)/);
        return match ? parseFloat(match[1]) : 1;
    }

    function getPropertyUrl() {
        // Try to get property URL from session data
        if (EditorState.sessionData?.property?.url) {
            return EditorState.sessionData.property.url;
        }
        if (EditorState.sessionData?.property?.id) {
            return `https://doorstep.co.uk/property/${EditorState.sessionData.property.id}`;
        }
        return 'https://doorstep.co.uk';
    }

    function showToast(message, type = 'info') {
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        } else {
            console.log(`[${type}] ${message}`);
        }
    }

    // ========================================================================
    // PRO BLOCKS - Professional Brochure Components
    // ========================================================================

    const PRO_BLOCK_TEMPLATES = {
        'stats-row': {
            html: `
                <div class="property-stats-row" style="display: flex; gap: 40px; padding: 20px 0; border-top: 1px solid rgba(0,0,0,0.1); border-bottom: 1px solid rgba(0,0,0,0.1);">
                    <div class="stat" style="text-align: center;">
                        <div class="stat-icon" style="font-size: 20px;">🛏️</div>
                        <div class="stat-value" style="font-size: 24px; font-weight: 600;">4</div>
                        <div class="stat-label" style="font-size: 10px; text-transform: uppercase; color: #888;">Bedrooms</div>
                    </div>
                    <div class="stat" style="text-align: center;">
                        <div class="stat-icon" style="font-size: 20px;">🚿</div>
                        <div class="stat-value" style="font-size: 24px; font-weight: 600;">3</div>
                        <div class="stat-label" style="font-size: 10px; text-transform: uppercase; color: #888;">Bathrooms</div>
                    </div>
                    <div class="stat" style="text-align: center;">
                        <div class="stat-icon" style="font-size: 20px;">📐</div>
                        <div class="stat-value" style="font-size: 24px; font-weight: 600;">2,400</div>
                        <div class="stat-label" style="font-size: 10px; text-transform: uppercase; color: #888;">Sq Ft</div>
                    </div>
                    <div class="stat" style="text-align: center;">
                        <div class="stat-icon" style="font-size: 20px;">🚗</div>
                        <div class="stat-value" style="font-size: 24px; font-weight: 600;">2</div>
                        <div class="stat-label" style="font-size: 10px; text-transform: uppercase; color: #888;">Parking</div>
                    </div>
                </div>
            `,
            width: 500,
            height: 80
        },
        'stats-grid': {
            html: `
                <div class="property-stats-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
                    <div class="stat-box" style="background: #f5f5f5; padding: 15px; text-align: center; border-radius: 6px;">
                        <div class="value" style="font-size: 28px; font-weight: 600;">4</div>
                        <div class="label" style="font-size: 11px; color: #666;">Bedrooms</div>
                    </div>
                    <div class="stat-box" style="background: #f5f5f5; padding: 15px; text-align: center; border-radius: 6px;">
                        <div class="value" style="font-size: 28px; font-weight: 600;">3</div>
                        <div class="label" style="font-size: 11px; color: #666;">Bathrooms</div>
                    </div>
                    <div class="stat-box" style="background: #f5f5f5; padding: 15px; text-align: center; border-radius: 6px;">
                        <div class="value" style="font-size: 28px; font-weight: 600;">2,400</div>
                        <div class="label" style="font-size: 11px; color: #666;">Sq Ft</div>
                    </div>
                    <div class="stat-box" style="background: #f5f5f5; padding: 15px; text-align: center; border-radius: 6px;">
                        <div class="value" style="font-size: 28px; font-weight: 600;">2</div>
                        <div class="label" style="font-size: 11px; color: #666;">Parking</div>
                    </div>
                </div>
            `,
            width: 450,
            height: 90
        },
        'feature-pills': {
            html: `
                <div class="feature-pills" style="display: flex; flex-wrap: wrap; gap: 8px;">
                    <span class="feature-pill" style="background: #f0f0f0; padding: 6px 14px; border-radius: 16px; font-size: 12px;">Period Features</span>
                    <span class="feature-pill" style="background: #f0f0f0; padding: 6px 14px; border-radius: 16px; font-size: 12px;">South Facing Garden</span>
                    <span class="feature-pill" style="background: #f0f0f0; padding: 6px 14px; border-radius: 16px; font-size: 12px;">Off-Street Parking</span>
                    <span class="feature-pill highlight" style="background: #C20430; color: white; padding: 6px 14px; border-radius: 16px; font-size: 12px;">Newly Renovated</span>
                    <span class="feature-pill" style="background: #f0f0f0; padding: 6px 14px; border-radius: 16px; font-size: 12px;">Close to Schools</span>
                </div>
            `,
            width: 400,
            height: 60
        },
        'feature-list': {
            html: `
                <div class="features-two-column" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px 30px;">
                    <div class="feature-item" style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 18px; height: 18px; background: #C20430; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;">✓</span>
                        <span style="font-size: 13px;">Period features throughout</span>
                    </div>
                    <div class="feature-item" style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 18px; height: 18px; background: #C20430; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;">✓</span>
                        <span style="font-size: 13px;">South facing garden</span>
                    </div>
                    <div class="feature-item" style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 18px; height: 18px; background: #C20430; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;">✓</span>
                        <span style="font-size: 13px;">Off-street parking for 2 cars</span>
                    </div>
                    <div class="feature-item" style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 18px; height: 18px; background: #C20430; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;">✓</span>
                        <span style="font-size: 13px;">Close to excellent schools</span>
                    </div>
                    <div class="feature-item" style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 18px; height: 18px; background: #C20430; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;">✓</span>
                        <span style="font-size: 13px;">Recently renovated kitchen</span>
                    </div>
                    <div class="feature-item" style="display: flex; align-items: center; gap: 10px;">
                        <span style="width: 18px; height: 18px; background: #C20430; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;">✓</span>
                        <span style="font-size: 13px;">EPC Rating: C</span>
                    </div>
                </div>
            `,
            width: 450,
            height: 120
        },
        'agent-card': {
            html: `
                <div class="agent-card-full" style="display: flex; gap: 20px; padding: 25px; background: #f8f8f8; border-left: 4px solid #C20430;">
                    <div style="width: 80px; height: 80px; background: #ddd; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px;">👤</div>
                    <div style="flex: 1;">
                        <div class="agent-name" style="font-size: 18px; font-weight: 600; margin-bottom: 4px;">Sarah Thompson</div>
                        <div class="agent-title" style="font-size: 12px; color: #666; margin-bottom: 12px;">Senior Sales Negotiator</div>
                        <div style="display: flex; flex-direction: column; gap: 6px;">
                            <div style="display: flex; align-items: center; gap: 8px; font-size: 13px;">📞 020 7123 4567</div>
                            <div style="display: flex; align-items: center; gap: 8px; font-size: 13px;">✉️ sarah@agency.co.uk</div>
                        </div>
                    </div>
                </div>
            `,
            width: 400,
            height: 130
        },
        'cta-button': {
            html: `
                <button class="contact-cta" style="display: inline-flex; align-items: center; gap: 10px; background: #C20430; color: white; padding: 14px 28px; font-size: 14px; font-weight: 600; border-radius: 4px; border: none; cursor: pointer;">
                    📅 Book a Viewing
                </button>
            `,
            width: 180,
            height: 50
        },
        'gallery-hero': {
            html: `
                <div class="gallery-hero-side" style="display: grid; grid-template-columns: 2fr 1fr; grid-template-rows: 1fr 1fr; gap: 8px; height: 200px;">
                    <div style="background: #e0e0e0; grid-row: span 2; display: flex; align-items: center; justify-content: center; color: #999;">Main Photo</div>
                    <div style="background: #d0d0d0; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">Photo 2</div>
                    <div style="background: #d0d0d0; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">Photo 3</div>
                </div>
            `,
            width: 400,
            height: 200
        },
        'gallery-grid': {
            html: `
                <div class="gallery-grid-2x2" style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 8px; height: 200px;">
                    <div style="background: #e0e0e0; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">Photo 1</div>
                    <div style="background: #d0d0d0; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">Photo 2</div>
                    <div style="background: #d0d0d0; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">Photo 3</div>
                    <div style="background: #e0e0e0; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px;">Photo 4</div>
                </div>
            `,
            width: 350,
            height: 200
        },
        'price-badge': {
            html: `
                <div class="price-badge" style="display: inline-block; background: #C20430; color: white; padding: 12px 24px; font-weight: 700; font-size: 20px;">
                    £850,000
                </div>
            `,
            width: 160,
            height: 50
        },
        'branding-footer': {
            html: `
                <div class="branding-footer" style="display: flex; justify-content: space-between; align-items: center; padding: 15px 30px; background: rgba(255,255,255,0.95); border-top: 1px solid #eee;">
                    <div style="font-size: 18px; font-weight: 600; color: #333;">Your Agency</div>
                    <div style="text-align: right; font-size: 12px; color: #666;">
                        <div>020 7123 4567</div>
                        <div>info@agency.co.uk</div>
                    </div>
                </div>
            `,
            width: 500,
            height: 60
        },

        // Status Badges
        'badge-sold': {
            html: `<div class="status-badge sold" style="display: inline-block; background: #C20430; color: white; padding: 10px 25px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">SOLD</div>`,
            width: 120,
            height: 45
        },
        'badge-under-offer': {
            html: `<div class="status-badge under-offer" style="display: inline-block; background: #E67E22; color: white; padding: 10px 25px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">UNDER OFFER</div>`,
            width: 160,
            height: 45
        },
        'badge-new': {
            html: `<div class="status-badge new" style="display: inline-block; background: #27AE60; color: white; padding: 10px 25px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">NEW</div>`,
            width: 100,
            height: 45
        },
        'badge-price-reduced': {
            html: `<div class="status-badge price-reduced" style="display: inline-block; background: #8E44AD; color: white; padding: 10px 25px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">PRICE REDUCED</div>`,
            width: 180,
            height: 45
        },

        // Dividers
        'divider-elegant': {
            html: `
                <div class="divider-elegant" style="display: flex; align-items: center; gap: 15px; width: 100%;">
                    <div style="flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(0,0,0,0.3), transparent);"></div>
                    <span style="font-size: 18px; color: #C9A961;">✦</span>
                    <div style="flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(0,0,0,0.3), transparent);"></div>
                </div>
            `,
            width: 400,
            height: 40
        },
        'divider-ornate': {
            html: `
                <div class="divider-ornate" style="display: flex; align-items: center; justify-content: center; gap: 20px;">
                    <div style="width: 80px; height: 1px; background: #C9A961;"></div>
                    <span style="font-size: 24px; color: #C9A961;">❧</span>
                    <div style="width: 80px; height: 1px; background: #C9A961;"></div>
                </div>
            `,
            width: 300,
            height: 40
        },

        // Quotes & Highlights
        'testimonial': {
            html: `
                <div class="testimonial-block" style="position: relative; padding: 30px 40px; background: #f8f8f8;">
                    <div style="position: absolute; top: 10px; left: 20px; font-family: Georgia, serif; font-size: 60px; color: #C9A961; opacity: 0.3; line-height: 1;">"</div>
                    <p style="font-family: Georgia, serif; font-size: 18px; font-style: italic; line-height: 1.7; color: #333; margin-bottom: 15px;">
                        The team at this agency were exceptional throughout the entire process. Professional, knowledgeable and always available.
                    </p>
                    <div style="font-size: 13px; font-weight: 600; color: #1a1a1a;">— Mr & Mrs Johnson</div>
                    <div style="font-size: 11px; color: #888;">Satisfied Buyers, 2024</div>
                </div>
            `,
            width: 450,
            height: 180
        },
        'pull-quote': {
            html: `
                <div class="pull-quote" style="font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-style: italic; line-height: 1.5; color: #333; padding: 20px 0; border-top: 3px solid #C9A961; border-bottom: 3px solid #C9A961; text-align: center;">
                    "A rare opportunity to acquire a period property of exceptional character"
                </div>
            `,
            width: 450,
            height: 100
        },
        'highlight-box': {
            html: `
                <div class="highlight-box elegant" style="padding: 25px; background: linear-gradient(135deg, #f8f6f2, #fff); border: 1px solid #e8e4dc; border-left: 4px solid #C9A961; border-radius: 4px;">
                    <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 18px; font-weight: 600; margin-bottom: 10px; color: #1a1a1a;">Key Highlights</div>
                    <p style="font-size: 14px; line-height: 1.7; color: #555; margin: 0;">
                        This stunning property offers generous accommodation arranged over three floors, with period features throughout and a beautifully landscaped rear garden.
                    </p>
                </div>
            `,
            width: 400,
            height: 150
        },
        'selling-points': {
            html: `
                <div class="selling-points-box" style="background: #f9f9f9; padding: 30px; border-radius: 8px;">
                    <h4 style="font-family: 'Playfair Display', Georgia, serif; font-size: 20px; margin: 0 0 20px 0; text-align: center;">Key Selling Points</h4>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                        <div style="text-align: center; padding: 15px;">
                            <div style="font-size: 28px; margin-bottom: 10px;">🏡</div>
                            <div style="font-size: 13px; font-weight: 600;">Period Character</div>
                        </div>
                        <div style="text-align: center; padding: 15px;">
                            <div style="font-size: 28px; margin-bottom: 10px;">🌳</div>
                            <div style="font-size: 13px; font-weight: 600;">Large Garden</div>
                        </div>
                        <div style="text-align: center; padding: 15px;">
                            <div style="font-size: 28px; margin-bottom: 10px;">🚗</div>
                            <div style="font-size: 13px; font-weight: 600;">Off-Street Parking</div>
                        </div>
                    </div>
                </div>
            `,
            width: 450,
            height: 180
        },

        // Property Info
        'epc-rating': {
            html: `
                <div class="epc-rating" style="display: inline-flex; align-items: center; gap: 15px; padding: 15px 25px; background: #f9f9f9; border-radius: 8px;">
                    <div style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; background: #8dce46; color: white; font-size: 24px; font-weight: 700; border-radius: 4px;">C</div>
                    <div>
                        <div style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.5px;">Energy Rating</div>
                        <div style="font-size: 16px; font-weight: 600; color: #333;">EPC Band C (72)</div>
                    </div>
                </div>
            `,
            width: 250,
            height: 80
        },
        'council-tax': {
            html: `
                <div class="council-tax-band" style="display: inline-flex; align-items: center; gap: 12px; padding: 12px 20px; background: #f5f5f5; border-radius: 4px;">
                    <div style="width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; background: #333; color: white; font-size: 18px; font-weight: 700; border-radius: 4px;">D</div>
                    <div style="font-size: 13px; color: #666;">Council Tax Band D</div>
                </div>
            `,
            width: 200,
            height: 60
        },
        'floorplan': {
            html: `
                <div class="floorplan-container" style="background: #fff; padding: 30px; border: 1px solid #eee;">
                    <h3 style="font-family: 'Playfair Display', Georgia, serif; font-size: 22px; margin: 0 0 20px 0; text-align: center;">Floor Plan</h3>
                    <div style="background: #f5f5f5; min-height: 200px; display: flex; align-items: center; justify-content: center; color: #999; font-size: 14px; border: 2px dashed #ddd; margin-bottom: 20px;">
                        📐 Drop floor plan image here
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                        <div style="display: flex; justify-content: space-between; padding: 10px 15px; background: #f9f9f9; border-left: 3px solid #C20430; font-size: 13px;">
                            <span style="font-weight: 600;">Living Room</span>
                            <span style="color: #666;">5.2m x 4.1m</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 10px 15px; background: #f9f9f9; border-left: 3px solid #C20430; font-size: 13px;">
                            <span style="font-weight: 600;">Kitchen</span>
                            <span style="color: #666;">4.8m x 3.6m</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 10px 15px; background: #f9f9f9; border-left: 3px solid #C20430; font-size: 13px;">
                            <span style="font-weight: 600;">Master Bedroom</span>
                            <span style="color: #666;">4.5m x 3.8m</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 10px 15px; background: #f9f9f9; border-left: 3px solid #C20430; font-size: 13px;">
                            <span style="font-weight: 600;">Garden</span>
                            <span style="color: #666;">15m x 8m</span>
                        </div>
                    </div>
                </div>
            `,
            width: 450,
            height: 400
        },
        'location-section': {
            html: `
                <div class="location-container" style="background: #fff; padding: 30px;">
                    <h3 style="font-family: 'Playfair Display', Georgia, serif; font-size: 22px; margin: 0 0 20px 0;">Location & Transport</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                        <div style="background: #e8e8e8; min-height: 180px; display: flex; align-items: center; justify-content: center; color: #999; border-radius: 8px;">
                            🗺️ Map placeholder
                        </div>
                        <div>
                            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; font-size: 13px;">
                                <span>🚇 Hampstead Station</span>
                                <span style="color: #C20430; font-weight: 600;">0.3 miles</span>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; font-size: 13px;">
                                <span>🚌 Bus Stop (24, 168)</span>
                                <span style="color: #C20430; font-weight: 600;">0.1 miles</span>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; font-size: 13px;">
                                <span>🏫 Local Primary School</span>
                                <span style="color: #C20430; font-weight: 600;">0.4 miles</span>
                            </div>
                            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; font-size: 13px;">
                                <span>🛒 Waitrose</span>
                                <span style="color: #C20430; font-weight: 600;">0.2 miles</span>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            width: 500,
            height: 280
        },

        // Interactive
        'virtual-tour': {
            html: `
                <div class="virtual-tour-cta" style="display: flex; align-items: center; gap: 20px; padding: 25px; background: linear-gradient(135deg, #1a1a1a, #333); color: white; border-radius: 8px;">
                    <div style="font-size: 40px;">🎬</div>
                    <div style="flex: 1;">
                        <h4 style="font-family: 'Playfair Display', Georgia, serif; font-size: 18px; margin: 0 0 5px 0;">Take a Virtual Tour</h4>
                        <p style="font-size: 13px; color: #aaa; margin: 0;">Experience this property from the comfort of your home</p>
                    </div>
                    <button style="padding: 12px 24px; background: #C20430; color: white; font-size: 13px; font-weight: 600; border: none; border-radius: 4px; cursor: pointer;">
                        View Tour
                    </button>
                </div>
            `,
            width: 480,
            height: 100
        },
        'room-dimensions': {
            html: `
                <div class="room-dimensions-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    <div style="display: flex; justify-content: space-between; padding: 12px 15px; background: #f9f9f9; border-left: 3px solid #C20430; font-size: 13px;">
                        <span style="font-weight: 600;">Living Room</span>
                        <span style="color: #666;">5.2m x 4.1m (17'1" x 13'5")</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px 15px; background: #f9f9f9; border-left: 3px solid #C20430; font-size: 13px;">
                        <span style="font-weight: 600;">Kitchen/Dining</span>
                        <span style="color: #666;">4.8m x 3.6m (15'9" x 11'10")</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px 15px; background: #f9f9f9; border-left: 3px solid #C20430; font-size: 13px;">
                        <span style="font-weight: 600;">Master Bedroom</span>
                        <span style="color: #666;">4.5m x 3.8m (14'9" x 12'6")</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px 15px; background: #f9f9f9; border-left: 3px solid #C20430; font-size: 13px;">
                        <span style="font-weight: 600;">Bedroom 2</span>
                        <span style="color: #666;">3.8m x 3.2m (12'6" x 10'6")</span>
                    </div>
                </div>
            `,
            width: 500,
            height: 110
        }
    };

    function addProBlockToCurrentPage(blockType) {
        const template = PRO_BLOCK_TEMPLATES[blockType];
        if (!template) {
            showToast('Block type not found', 'error');
            return;
        }

        // Get current page
        const currentPageId = EditorState.currentPage;
        if (!currentPageId) {
            showToast('Please select a page first', 'warning');
            return;
        }

        const pageEl = document.querySelector(`.brochure-page[data-page-id="${currentPageId}"]`);
        if (!pageEl) {
            showToast('Page not found', 'error');
            return;
        }

        // Create element
        const elementId = 'block_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        const element = document.createElement('div');
        element.className = 'canvas-element design-element';
        element.id = elementId;
        element.dataset.elementId = elementId;
        element.dataset.elementType = 'pro-block';
        element.dataset.blockType = blockType;
        element.style.cssText = `
            position: absolute;
            left: 50px;
            top: 50px;
            width: ${template.width}px;
            min-height: ${template.height}px;
            cursor: move;
            z-index: 10;
        `;

        element.innerHTML = template.html;

        // Add resize handles
        element.innerHTML += `
            <div class="resize-handle nw"></div>
            <div class="resize-handle ne"></div>
            <div class="resize-handle sw"></div>
            <div class="resize-handle se"></div>
        `;

        pageEl.appendChild(element);

        // Make draggable
        if (typeof makeElementDraggable === 'function') {
            makeElementDraggable(element);
        }

        // Track in state
        if (!EditorState.elements[currentPageId]) {
            EditorState.elements[currentPageId] = [];
        }
        EditorState.elements[currentPageId].push({
            id: elementId,
            type: 'pro-block',
            blockType: blockType
        });

        EditorState.isDirty = true;

        // Select the new element
        element.click();

        showToast(`Added ${blockType.replace(/-/g, ' ')}`, 'success');

        // Save to history
        if (typeof saveToHistory === 'function') {
            saveToHistory('add pro block');
        }
    }

    // ========================================================================
    // EXPOSE TO GLOBAL SCOPE
    // ========================================================================

    window.ElementsLibrary = {
        render: renderElementsPanel,
        createShape: createShapeElement,
        createIcon: createIconElement,
        createQRCode: createQRCodeElement,
        addToCurrentPage: addElementToCurrentPage,
        addAtPosition: addElementAtPosition,
        addProBlock: addProBlockToCurrentPage,
        showProperties: showElementProperties,
        hideProperties: hideElementProperties,
        get ICONS() { return window.ICONS_LIBRARY || {}; },
        get SHAPES() { return window.SHAPES_LIBRARY || {}; },
        get PRO_BLOCKS() { return PRO_BLOCK_TEMPLATES; },
        isLoaded: true
    };

    // Expose property functions for external use
    window.showElementProperties = showElementProperties;
    window.hideElementProperties = hideElementProperties;

})();
