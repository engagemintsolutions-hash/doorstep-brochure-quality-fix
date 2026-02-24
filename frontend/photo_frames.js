/**
 * PHOTO FRAMES & GRIDS SYSTEM
 * Shaped frames, decorative borders, and collage grid layouts
 */

const PhotoFrames = (function() {
    'use strict';

    // =========================================================================
    // SHAPE FRAMES (CSS clip-path based)
    // =========================================================================
    const SHAPE_FRAMES = {
        // Basic shapes
        circle: {
            name: 'Circle',
            category: 'basic',
            clipPath: 'circle(50%)',
            preview: 'M50,0 A50,50 0 1,1 50,100 A50,50 0 1,1 50,0'
        },
        oval: {
            name: 'Oval',
            category: 'basic',
            clipPath: 'ellipse(50% 40%)',
            preview: 'M50,10 A40,30 0 1,1 50,90 A40,30 0 1,1 50,10'
        },
        square: {
            name: 'Square',
            category: 'basic',
            clipPath: 'inset(0)',
            preview: 'M0,0 L100,0 L100,100 L0,100 Z'
        },
        rounded: {
            name: 'Rounded',
            category: 'basic',
            clipPath: 'inset(0 round 16px)',
            borderRadius: '16px'
        },
        rounded_lg: {
            name: 'Large Rounded',
            category: 'basic',
            clipPath: 'inset(0 round 32px)',
            borderRadius: '32px'
        },

        // Geometric shapes
        hexagon: {
            name: 'Hexagon',
            category: 'geometric',
            clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'
        },
        octagon: {
            name: 'Octagon',
            category: 'geometric',
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
        },
        diamond: {
            name: 'Diamond',
            category: 'geometric',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
        },
        triangle: {
            name: 'Triangle',
            category: 'geometric',
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
        },
        pentagon: {
            name: 'Pentagon',
            category: 'geometric',
            clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'
        },
        star: {
            name: 'Star',
            category: 'geometric',
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
        },
        cross: {
            name: 'Cross',
            category: 'geometric',
            clipPath: 'polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)'
        },

        // Architectural shapes
        arch: {
            name: 'Arch',
            category: 'architectural',
            clipPath: 'polygon(0% 100%, 0% 30%, 5% 20%, 15% 10%, 30% 3%, 50% 0%, 70% 3%, 85% 10%, 95% 20%, 100% 30%, 100% 100%)'
        },
        arch_gothic: {
            name: 'Gothic Arch',
            category: 'architectural',
            clipPath: 'polygon(0% 100%, 0% 40%, 50% 0%, 100% 40%, 100% 100%)'
        },
        window: {
            name: 'Window',
            category: 'architectural',
            clipPath: 'inset(0 round 50% 50% 0 0)'
        },

        // Organic shapes
        blob1: {
            name: 'Blob 1',
            category: 'organic',
            clipPath: 'polygon(30% 0%, 70% 10%, 100% 35%, 90% 70%, 60% 100%, 20% 90%, 0% 60%, 10% 30%)'
        },
        blob2: {
            name: 'Blob 2',
            category: 'organic',
            clipPath: 'polygon(20% 5%, 80% 0%, 95% 30%, 100% 70%, 75% 100%, 25% 95%, 0% 65%, 5% 25%)'
        },
        leaf: {
            name: 'Leaf',
            category: 'organic',
            clipPath: 'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)'
        },
        heart: {
            name: 'Heart',
            category: 'organic',
            clipPath: 'polygon(50% 100%, 0% 35%, 0% 25%, 25% 0%, 50% 15%, 75% 0%, 100% 25%, 100% 35%)'
        },

        // Shield and badge shapes
        shield: {
            name: 'Shield',
            category: 'badge',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)'
        },
        badge: {
            name: 'Badge',
            category: 'badge',
            clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)'
        },
        ribbon: {
            name: 'Ribbon',
            category: 'badge',
            clipPath: 'polygon(0% 20%, 10% 0%, 90% 0%, 100% 20%, 100% 80%, 90% 100%, 10% 100%, 0% 80%)'
        }
    };

    // =========================================================================
    // DECORATIVE FRAMES (CSS-based borders and effects)
    // =========================================================================
    const DECORATIVE_FRAMES = {
        polaroid: {
            name: 'Polaroid',
            category: 'classic',
            css: {
                padding: '12px 12px 48px 12px',
                background: 'white',
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                transform: 'rotate(-2deg)'
            }
        },
        polaroid_tilted: {
            name: 'Polaroid Tilted',
            category: 'classic',
            css: {
                padding: '12px 12px 48px 12px',
                background: 'white',
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                transform: 'rotate(3deg)'
            }
        },
        vintage: {
            name: 'Vintage',
            category: 'classic',
            css: {
                padding: '16px',
                background: '#f5f0e6',
                border: '8px solid #d4c5a9',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
            },
            filter: 'sepia(30%)'
        },
        modern_thin: {
            name: 'Modern Thin',
            category: 'modern',
            css: {
                padding: '4px',
                background: 'white',
                border: '1px solid #ddd'
            }
        },
        modern_shadow: {
            name: 'Modern Shadow',
            category: 'modern',
            css: {
                borderRadius: '8px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
            }
        },
        modern_thick: {
            name: 'Thick Border',
            category: 'modern',
            css: {
                padding: '8px',
                background: 'white',
                border: '4px solid #333'
            }
        },
        film_strip: {
            name: 'Film Strip',
            category: 'creative',
            css: {
                padding: '8px 32px',
                background: '#1a1a1a',
                borderRadius: '0'
            },
            before: {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '8px',
                width: '16px',
                height: '100%',
                background: 'repeating-linear-gradient(to bottom, transparent, transparent 8px, white 8px, white 12px)'
            }
        },
        double_border: {
            name: 'Double Border',
            category: 'elegant',
            css: {
                padding: '8px',
                background: 'white',
                border: '2px solid #333',
                outline: '2px solid #333',
                outlineOffset: '4px'
            }
        },
        gold_frame: {
            name: 'Gold Frame',
            category: 'elegant',
            css: {
                padding: '16px',
                background: 'linear-gradient(135deg, #D4AF37 0%, #FFE55C 50%, #D4AF37 100%)',
                border: '4px solid #B8860B',
                boxShadow: 'inset 0 0 0 4px #FFE55C, 0 4px 15px rgba(0,0,0,0.2)'
            }
        },
        wood_frame: {
            name: 'Wood Frame',
            category: 'elegant',
            css: {
                padding: '20px',
                background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)',
                border: '4px solid #5D3A1A',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3), 0 4px 15px rgba(0,0,0,0.2)'
            }
        },
        rounded_shadow: {
            name: 'Rounded Shadow',
            category: 'soft',
            css: {
                borderRadius: '24px',
                boxShadow: '0 15px 50px rgba(0,0,0,0.2)'
            }
        },
        soft_glow: {
            name: 'Soft Glow',
            category: 'soft',
            css: {
                borderRadius: '12px',
                boxShadow: '0 0 30px rgba(255,255,255,0.8), 0 10px 40px rgba(0,0,0,0.1)'
            }
        },
        stamp: {
            name: 'Stamp',
            category: 'creative',
            css: {
                padding: '16px',
                background: 'white',
                border: '3px dashed #ccc'
            }
        }
    };

    // =========================================================================
    // PHOTO GRID LAYOUTS
    // =========================================================================
    const GRID_LAYOUTS = {
        // Simple grids
        grid_2x1: {
            name: '2 Horizontal',
            slots: 2,
            category: 'simple',
            css: {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px'
            }
        },
        grid_1x2: {
            name: '2 Vertical',
            slots: 2,
            category: 'simple',
            css: {
                display: 'grid',
                gridTemplateRows: '1fr 1fr',
                gap: '8px'
            }
        },
        grid_2x2: {
            name: '2x2 Grid',
            slots: 4,
            category: 'simple',
            css: {
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gridTemplateRows: 'repeat(2, 1fr)',
                gap: '8px'
            }
        },
        grid_3x1: {
            name: '3 Horizontal',
            slots: 3,
            category: 'simple',
            css: {
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px'
            }
        },
        grid_3x2: {
            name: '3x2 Grid',
            slots: 6,
            category: 'simple',
            css: {
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridTemplateRows: 'repeat(2, 1fr)',
                gap: '8px'
            }
        },
        grid_3x3: {
            name: '3x3 Grid',
            slots: 9,
            category: 'simple',
            css: {
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridTemplateRows: 'repeat(3, 1fr)',
                gap: '8px'
            }
        },

        // Featured layouts
        featured_left: {
            name: 'Featured Left',
            slots: 3,
            category: 'featured',
            css: {
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gridTemplateRows: '1fr 1fr',
                gap: '8px'
            },
            slotStyles: [
                { gridRow: '1 / 3' },
                {},
                {}
            ]
        },
        featured_right: {
            name: 'Featured Right',
            slots: 3,
            category: 'featured',
            css: {
                display: 'grid',
                gridTemplateColumns: '1fr 2fr',
                gridTemplateRows: '1fr 1fr',
                gap: '8px'
            },
            slotStyles: [
                {},
                { gridRow: '1 / 3', gridColumn: '2' },
                {}
            ]
        },
        featured_top: {
            name: 'Featured Top',
            slots: 3,
            category: 'featured',
            css: {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '2fr 1fr',
                gap: '8px'
            },
            slotStyles: [
                { gridColumn: '1 / 3' },
                {},
                {}
            ]
        },
        featured_center: {
            name: 'Featured Center',
            slots: 5,
            category: 'featured',
            css: {
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridTemplateRows: 'repeat(2, 1fr)',
                gap: '8px'
            },
            slotStyles: [
                {},
                { gridColumn: '2 / 4', gridRow: '1 / 3' },
                {},
                {},
                {}
            ]
        },

        // Masonry-style
        masonry_3: {
            name: 'Masonry 3',
            slots: 3,
            category: 'masonry',
            css: {
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                gap: '8px'
            },
            slotStyles: [
                { gridRow: '1 / 3' },
                {},
                {}
            ]
        },
        masonry_5: {
            name: 'Masonry 5',
            slots: 5,
            category: 'masonry',
            css: {
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridTemplateRows: 'repeat(2, 1fr)',
                gap: '8px'
            },
            slotStyles: [
                { gridRow: '1 / 3' },
                {},
                { gridRow: '1 / 3' },
                { gridColumn: '2' },
                {}
            ]
        },

        // Collage styles
        collage_diagonal: {
            name: 'Diagonal Split',
            slots: 2,
            category: 'collage',
            css: {
                position: 'relative'
            },
            custom: true
        },
        collage_overlap: {
            name: 'Overlap',
            slots: 3,
            category: 'collage',
            css: {
                position: 'relative'
            },
            slotStyles: [
                { position: 'absolute', left: '0', top: '0', width: '60%', height: '80%', zIndex: 1 },
                { position: 'absolute', right: '0', top: '10%', width: '50%', height: '70%', zIndex: 2 },
                { position: 'absolute', left: '20%', bottom: '0', width: '50%', height: '50%', zIndex: 3 }
            ],
            custom: true
        }
    };

    // =========================================================================
    // UI Functions
    // =========================================================================

    /**
     * Apply shape frame to element
     */
    function applyShapeFrame(element, frameId) {
        const frame = SHAPE_FRAMES[frameId];
        if (!frame) {
            console.warn('[PhotoFrames] Shape not found:', frameId);
            return;
        }

        // Reset previous frame
        element.style.clipPath = '';
        element.style.borderRadius = '';

        // Apply new frame
        if (frame.clipPath) {
            element.style.clipPath = frame.clipPath;
        }
        if (frame.borderRadius) {
            element.style.borderRadius = frame.borderRadius;
        }

        console.log('[PhotoFrames] Applied shape:', frame.name);
    }

    /**
     * Apply decorative frame to element
     */
    function applyDecorativeFrame(element, frameId) {
        const frame = DECORATIVE_FRAMES[frameId];
        if (!frame) {
            console.warn('[PhotoFrames] Frame not found:', frameId);
            return;
        }

        // Create wrapper if needed
        let wrapper = element.parentElement;
        if (!wrapper || !wrapper.classList.contains('frame-wrapper')) {
            wrapper = document.createElement('div');
            wrapper.className = 'frame-wrapper';
            element.parentNode.insertBefore(wrapper, element);
            wrapper.appendChild(element);
        }

        // Reset and apply styles
        Object.keys(frame.css).forEach(prop => {
            wrapper.style[prop] = frame.css[prop];
        });

        // Apply filter if any
        if (frame.filter) {
            element.style.filter = frame.filter;
        }

        console.log('[PhotoFrames] Applied frame:', frame.name);
    }

    /**
     * Create photo grid
     */
    function createPhotoGrid(container, layoutId, images = []) {
        const layout = GRID_LAYOUTS[layoutId];
        if (!layout) {
            console.warn('[PhotoFrames] Layout not found:', layoutId);
            return null;
        }

        // Create grid container
        const grid = document.createElement('div');
        grid.className = 'photo-grid';
        grid.dataset.layout = layoutId;

        // Apply grid CSS
        Object.keys(layout.css).forEach(prop => {
            grid.style[prop] = layout.css[prop];
        });

        // Create slots
        for (let i = 0; i < layout.slots; i++) {
            const slot = document.createElement('div');
            slot.className = 'photo-grid-slot';
            slot.dataset.slot = i;

            // Apply slot-specific styles
            if (layout.slotStyles && layout.slotStyles[i]) {
                Object.keys(layout.slotStyles[i]).forEach(prop => {
                    slot.style[prop] = layout.slotStyles[i][prop];
                });
            }

            // Add image or placeholder
            if (images[i]) {
                const img = document.createElement('img');
                img.src = images[i];
                img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
                slot.appendChild(img);
            } else {
                slot.innerHTML = `
                    <div class="photo-placeholder" style="
                        width: 100%;
                        height: 100%;
                        background: #f0f0f0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #999;
                        font-size: 12px;
                    ">
                        <span>+</span>
                    </div>
                `;
            }

            grid.appendChild(slot);
        }

        if (container) {
            container.appendChild(grid);
        }

        return grid;
    }

    /**
     * Show frame selector panel
     */
    function showFramePanel(targetElement, callback) {
        const existing = document.getElementById('framePanel');
        if (existing) existing.remove();

        const panel = document.createElement('div');
        panel.id = 'framePanel';
        panel.className = 'frame-panel';

        panel.innerHTML = `
            <div class="frame-panel-header">
                <h3>Photo Frames</h3>
                <button class="frame-close" onclick="PhotoFrames.closePanel()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <div class="frame-panel-body">
                <!-- Tabs -->
                <div class="frame-tabs">
                    <button class="frame-tab active" data-tab="shapes">Shapes</button>
                    <button class="frame-tab" data-tab="decorative">Frames</button>
                    <button class="frame-tab" data-tab="grids">Grids</button>
                </div>

                <!-- Shapes Tab -->
                <div class="frame-tab-content active" data-content="shapes">
                    ${Object.entries(groupByCategory(SHAPE_FRAMES)).map(([category, shapes]) => `
                        <div class="frame-category">
                            <div class="frame-category-title">${formatCategory(category)}</div>
                            <div class="frame-grid">
                                ${Object.entries(shapes).map(([id, shape]) => `
                                    <div class="frame-item shape-item"
                                         title="${shape.name}"
                                         style="clip-path: ${shape.clipPath || 'none'}; background: #ddd;"
                                         onclick="PhotoFrames.selectShape('${id}')">
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Decorative Frames Tab -->
                <div class="frame-tab-content" data-content="decorative">
                    ${Object.entries(groupByCategory(DECORATIVE_FRAMES)).map(([category, frames]) => `
                        <div class="frame-category">
                            <div class="frame-category-title">${formatCategory(category)}</div>
                            <div class="frame-grid decorative-grid">
                                ${Object.entries(frames).map(([id, frame]) => `
                                    <div class="frame-item decorative-item"
                                         title="${frame.name}"
                                         onclick="PhotoFrames.selectFrame('${id}')">
                                        <div class="frame-preview" style="${cssObjToString(frame.css)}">
                                            <div style="width: 100%; height: 100%; background: #ddd;"></div>
                                        </div>
                                        <span class="frame-label">${frame.name}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Grids Tab -->
                <div class="frame-tab-content" data-content="grids">
                    ${Object.entries(groupByCategory(GRID_LAYOUTS)).map(([category, grids]) => `
                        <div class="frame-category">
                            <div class="frame-category-title">${formatCategory(category)}</div>
                            <div class="frame-grid grid-grid">
                                ${Object.entries(grids).map(([id, grid]) => `
                                    <div class="frame-item grid-item"
                                         title="${grid.name} (${grid.slots} photos)"
                                         onclick="PhotoFrames.selectGrid('${id}')">
                                        ${generateGridPreview(id, grid)}
                                        <span class="frame-label">${grid.name}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Add styles
        addStyles();

        // Tab switching
        panel.querySelectorAll('.frame-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                panel.querySelectorAll('.frame-tab').forEach(t => t.classList.remove('active'));
                panel.querySelectorAll('.frame-tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                panel.querySelector(`.frame-tab-content[data-content="${tab.dataset.tab}"]`).classList.add('active');
            });
        });

        // Store target and callback
        window._frameTarget = targetElement;
        window._frameCallback = callback;

        document.body.appendChild(panel);
    }

    /**
     * Select shape
     */
    function selectShape(shapeId) {
        if (window._frameTarget) {
            applyShapeFrame(window._frameTarget, shapeId);
        }
        if (window._frameCallback) {
            window._frameCallback({ type: 'shape', id: shapeId, frame: SHAPE_FRAMES[shapeId] });
        }
    }

    /**
     * Select decorative frame
     */
    function selectFrame(frameId) {
        if (window._frameTarget) {
            applyDecorativeFrame(window._frameTarget, frameId);
        }
        if (window._frameCallback) {
            window._frameCallback({ type: 'decorative', id: frameId, frame: DECORATIVE_FRAMES[frameId] });
        }
    }

    /**
     * Select grid
     */
    function selectGrid(gridId) {
        if (window._frameCallback) {
            window._frameCallback({ type: 'grid', id: gridId, layout: GRID_LAYOUTS[gridId] });
        }
    }

    /**
     * Close panel
     */
    function closePanel() {
        const panel = document.getElementById('framePanel');
        if (panel) panel.remove();
    }

    // =========================================================================
    // Utility Functions
    // =========================================================================

    function groupByCategory(items) {
        const groups = {};
        Object.entries(items).forEach(([id, item]) => {
            const category = item.category || 'other';
            if (!groups[category]) groups[category] = {};
            groups[category][id] = item;
        });
        return groups;
    }

    function formatCategory(name) {
        return name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }

    function cssObjToString(obj) {
        return Object.entries(obj)
            .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v}`)
            .join('; ');
    }

    function generateGridPreview(id, grid) {
        const cells = [];
        for (let i = 0; i < Math.min(grid.slots, 6); i++) {
            cells.push('<div style="background: #ddd; min-height: 20px;"></div>');
        }
        return `<div style="display: grid; grid-template-columns: repeat(${Math.min(3, grid.slots)}, 1fr); gap: 2px; width: 100%; height: 40px;">${cells.join('')}</div>`;
    }

    function addStyles() {
        if (document.getElementById('photoFramesStyles')) return;

        const style = document.createElement('style');
        style.id = 'photoFramesStyles';
        style.textContent = `
            .frame-panel {
                position: fixed;
                right: 20px;
                top: 100px;
                width: 320px;
                max-height: 80vh;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                z-index: 10001;
                overflow: hidden;
            }

            .frame-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid #eee;
            }

            .frame-panel-header h3 { margin: 0; font-size: 16px; }

            .frame-close {
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                color: #666;
            }

            .frame-panel-body {
                padding: 16px;
                max-height: calc(80vh - 60px);
                overflow-y: auto;
            }

            .frame-tabs {
                display: flex;
                gap: 8px;
                margin-bottom: 16px;
            }

            .frame-tab {
                flex: 1;
                padding: 8px;
                border: 1px solid #ddd;
                background: white;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
            }

            .frame-tab.active {
                background: var(--primary-color, #4A1420);
                color: white;
                border-color: var(--primary-color, #4A1420);
            }

            .frame-tab-content { display: none; }
            .frame-tab-content.active { display: block; }

            .frame-category { margin-bottom: 16px; }

            .frame-category-title {
                font-size: 12px;
                font-weight: 600;
                color: #666;
                margin-bottom: 8px;
            }

            .frame-grid {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 8px;
            }

            .frame-item {
                aspect-ratio: 1;
                cursor: pointer;
                border: 2px solid transparent;
                border-radius: 4px;
                transition: all 0.2s ease;
                overflow: hidden;
            }

            .frame-item:hover {
                border-color: var(--primary-color, #4A1420);
                transform: scale(1.05);
            }

            .shape-item {
                background: #ddd;
            }

            .decorative-grid, .grid-grid {
                grid-template-columns: repeat(3, 1fr);
            }

            .decorative-item, .grid-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 8px;
                background: #f9f9f9;
            }

            .frame-preview {
                width: 50px;
                height: 50px;
            }

            .frame-label {
                font-size: 10px;
                color: #666;
                margin-top: 4px;
                text-align: center;
            }

            .photo-grid {
                width: 100%;
                height: 100%;
            }

            .photo-grid-slot {
                overflow: hidden;
                background: #f0f0f0;
            }

            .frame-wrapper {
                display: inline-block;
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * Get counts
     */
    function getCounts() {
        return {
            shapes: Object.keys(SHAPE_FRAMES).length,
            decorative: Object.keys(DECORATIVE_FRAMES).length,
            grids: Object.keys(GRID_LAYOUTS).length,
            total: Object.keys(SHAPE_FRAMES).length + Object.keys(DECORATIVE_FRAMES).length + Object.keys(GRID_LAYOUTS).length
        };
    }

    // Generic apply frame function
    function applyFrame(element, frameId, type = 'shape') {
        if (type === 'decorative' || DECORATIVE_FRAMES[frameId]) {
            return applyDecorativeFrame(element, frameId);
        }
        return applyShapeFrame(element, frameId);
    }

    // Public API
    return {
        SHAPE_FRAMES,
        DECORATIVE_FRAMES,
        GRID_LAYOUTS,
        applyShapeFrame,
        applyDecorativeFrame,
        applyFrame,  // Generic frame application
        createPhotoGrid,
        showFramePanel,
        selectShape,
        selectFrame,
        selectGrid,
        closePanel,
        getCounts,
        isLoaded: true
    };
})();

// Export globally
window.PhotoFrames = PhotoFrames;

console.log('[PhotoFrames] Loaded -',
    PhotoFrames.getCounts().shapes, 'shapes,',
    PhotoFrames.getCounts().decorative, 'frames,',
    PhotoFrames.getCounts().grids, 'grid layouts');
