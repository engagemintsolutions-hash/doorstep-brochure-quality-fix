/**
 * Magic Resize System
 * Convert designs between different formats intelligently
 */
const MagicResize = (function() {
    'use strict';

    // Predefined formats with dimensions
    const FORMATS = {
        // Print formats (mm converted to px at 96 DPI)
        print: {
            label: 'Print',
            formats: {
                a4_portrait: {
                    name: 'A4 Portrait',
                    width: 794,   // 210mm at 96 DPI
                    height: 1123, // 297mm
                    unit: 'mm',
                    realWidth: 210,
                    realHeight: 297
                },
                a4_landscape: {
                    name: 'A4 Landscape',
                    width: 1123,
                    height: 794,
                    unit: 'mm',
                    realWidth: 297,
                    realHeight: 210
                },
                a5_portrait: {
                    name: 'A5 Portrait',
                    width: 559,
                    height: 794,
                    unit: 'mm',
                    realWidth: 148,
                    realHeight: 210
                },
                a3_portrait: {
                    name: 'A3 Portrait',
                    width: 1123,
                    height: 1587,
                    unit: 'mm',
                    realWidth: 297,
                    realHeight: 420
                },
                letter_portrait: {
                    name: 'US Letter Portrait',
                    width: 816,
                    height: 1056,
                    unit: 'in',
                    realWidth: 8.5,
                    realHeight: 11
                },
                letter_landscape: {
                    name: 'US Letter Landscape',
                    width: 1056,
                    height: 816,
                    unit: 'in',
                    realWidth: 11,
                    realHeight: 8.5
                }
            }
        },

        // Social media formats
        social: {
            label: 'Social Media',
            formats: {
                instagram_post: {
                    name: 'Instagram Post',
                    width: 1080,
                    height: 1080,
                    unit: 'px',
                    aspectRatio: '1:1'
                },
                instagram_story: {
                    name: 'Instagram Story',
                    width: 1080,
                    height: 1920,
                    unit: 'px',
                    aspectRatio: '9:16'
                },
                instagram_landscape: {
                    name: 'Instagram Landscape',
                    width: 1080,
                    height: 566,
                    unit: 'px',
                    aspectRatio: '1.91:1'
                },
                facebook_post: {
                    name: 'Facebook Post',
                    width: 1200,
                    height: 630,
                    unit: 'px',
                    aspectRatio: '1.91:1'
                },
                facebook_cover: {
                    name: 'Facebook Cover',
                    width: 820,
                    height: 312,
                    unit: 'px',
                    aspectRatio: '2.63:1'
                },
                facebook_story: {
                    name: 'Facebook Story',
                    width: 1080,
                    height: 1920,
                    unit: 'px',
                    aspectRatio: '9:16'
                },
                twitter_post: {
                    name: 'Twitter Post',
                    width: 1200,
                    height: 675,
                    unit: 'px',
                    aspectRatio: '16:9'
                },
                twitter_header: {
                    name: 'Twitter Header',
                    width: 1500,
                    height: 500,
                    unit: 'px',
                    aspectRatio: '3:1'
                },
                linkedin_post: {
                    name: 'LinkedIn Post',
                    width: 1200,
                    height: 627,
                    unit: 'px',
                    aspectRatio: '1.91:1'
                },
                linkedin_cover: {
                    name: 'LinkedIn Cover',
                    width: 1584,
                    height: 396,
                    unit: 'px',
                    aspectRatio: '4:1'
                },
                pinterest_pin: {
                    name: 'Pinterest Pin',
                    width: 1000,
                    height: 1500,
                    unit: 'px',
                    aspectRatio: '2:3'
                },
                youtube_thumbnail: {
                    name: 'YouTube Thumbnail',
                    width: 1280,
                    height: 720,
                    unit: 'px',
                    aspectRatio: '16:9'
                }
            }
        },

        // Property marketing specific
        property: {
            label: 'Property Marketing',
            formats: {
                rightmove_main: {
                    name: 'Rightmove Main',
                    width: 1024,
                    height: 768,
                    unit: 'px',
                    aspectRatio: '4:3'
                },
                rightmove_floorplan: {
                    name: 'Rightmove Floorplan',
                    width: 800,
                    height: 600,
                    unit: 'px',
                    aspectRatio: '4:3'
                },
                zoopla_main: {
                    name: 'Zoopla Main',
                    width: 1024,
                    height: 768,
                    unit: 'px',
                    aspectRatio: '4:3'
                },
                window_card: {
                    name: 'Window Card',
                    width: 600,
                    height: 900,
                    unit: 'px',
                    aspectRatio: '2:3'
                },
                email_header: {
                    name: 'Email Header',
                    width: 600,
                    height: 200,
                    unit: 'px',
                    aspectRatio: '3:1'
                }
            }
        },

        // Web formats
        web: {
            label: 'Web',
            formats: {
                web_banner_leaderboard: {
                    name: 'Leaderboard (728x90)',
                    width: 728,
                    height: 90,
                    unit: 'px'
                },
                web_banner_rectangle: {
                    name: 'Medium Rectangle (300x250)',
                    width: 300,
                    height: 250,
                    unit: 'px'
                },
                web_banner_skyscraper: {
                    name: 'Skyscraper (160x600)',
                    width: 160,
                    height: 600,
                    unit: 'px'
                },
                presentation_16_9: {
                    name: 'Presentation 16:9',
                    width: 1920,
                    height: 1080,
                    unit: 'px',
                    aspectRatio: '16:9'
                },
                presentation_4_3: {
                    name: 'Presentation 4:3',
                    width: 1024,
                    height: 768,
                    unit: 'px',
                    aspectRatio: '4:3'
                }
            }
        }
    };

    // State
    let currentModal = null;

    /**
     * Calculate scale factors for resize
     */
    function calculateScale(fromWidth, fromHeight, toWidth, toHeight) {
        const scaleX = toWidth / fromWidth;
        const scaleY = toHeight / fromHeight;

        return {
            scaleX,
            scaleY,
            uniform: Math.min(scaleX, scaleY),
            fill: Math.max(scaleX, scaleY)
        };
    }

    /**
     * Resize element positions and sizes
     */
    function resizeElements(elements, fromDimensions, toDimensions, mode = 'smart') {
        const scale = calculateScale(
            fromDimensions.width,
            fromDimensions.height,
            toDimensions.width,
            toDimensions.height
        );

        return elements.map(element => {
            const resized = { ...element };

            // Get element bounds
            const x = parseFloat(element.style?.left) || element.x || 0;
            const y = parseFloat(element.style?.top) || element.y || 0;
            const width = parseFloat(element.style?.width) || element.width || 100;
            const height = parseFloat(element.style?.height) || element.height || 100;

            switch (mode) {
                case 'stretch':
                    // Stretch to fill - different X/Y scaling
                    resized.x = x * scale.scaleX;
                    resized.y = y * scale.scaleY;
                    resized.width = width * scale.scaleX;
                    resized.height = height * scale.scaleY;
                    break;

                case 'fit':
                    // Fit uniformly - maintain proportions
                    resized.x = x * scale.uniform;
                    resized.y = y * scale.uniform;
                    resized.width = width * scale.uniform;
                    resized.height = height * scale.uniform;
                    break;

                case 'smart':
                default:
                    // Smart positioning based on element type and position
                    resized.x = repositionSmart(x, fromDimensions.width, toDimensions.width, width);
                    resized.y = repositionSmart(y, fromDimensions.height, toDimensions.height, height);

                    // Scale size uniformly
                    const sizeScale = scale.uniform;
                    resized.width = width * sizeScale;
                    resized.height = height * sizeScale;

                    // Ensure element stays within bounds
                    if (resized.x + resized.width > toDimensions.width) {
                        resized.x = toDimensions.width - resized.width - 10;
                    }
                    if (resized.y + resized.height > toDimensions.height) {
                        resized.y = toDimensions.height - resized.height - 10;
                    }
                    if (resized.x < 0) resized.x = 10;
                    if (resized.y < 0) resized.y = 10;
                    break;
            }

            return resized;
        });
    }

    /**
     * Smart repositioning based on relative position
     */
    function repositionSmart(pos, fromSize, toSize, elementSize) {
        // Calculate relative position (0 = start, 0.5 = center, 1 = end)
        const relativePos = pos / fromSize;
        const relativePosWithSize = (pos + elementSize / 2) / fromSize;

        // If centered, keep centered
        if (relativePosWithSize > 0.4 && relativePosWithSize < 0.6) {
            return (toSize - elementSize) / 2;
        }

        // If near edge, maintain edge distance
        const edgeDistance = fromSize - (pos + elementSize);
        if (edgeDistance < 50) {
            return toSize - elementSize - edgeDistance * (toSize / fromSize);
        }

        // Otherwise scale proportionally
        return pos * (toSize / fromSize);
    }

    /**
     * Get format by ID
     */
    function getFormat(formatId) {
        for (const category of Object.values(FORMATS)) {
            if (category.formats[formatId]) {
                return category.formats[formatId];
            }
        }
        return null;
    }

    /**
     * Get all formats as flat list
     */
    function getAllFormats() {
        const all = [];
        for (const [catId, category] of Object.entries(FORMATS)) {
            for (const [formatId, format] of Object.entries(category.formats)) {
                all.push({
                    id: formatId,
                    category: catId,
                    categoryLabel: category.label,
                    ...format
                });
            }
        }
        return all;
    }

    /**
     * Show resize modal
     */
    function showModal(currentFormat, onResize) {
        if (currentModal) {
            currentModal.remove();
        }

        const current = getFormat(currentFormat) || {
            name: 'Current',
            width: 794,
            height: 1123
        };

        const modal = document.createElement('div');
        modal.className = 'magic-resize-modal';
        modal.innerHTML = `
            <div class="resize-content">
                <div class="resize-header">
                    <h2>Magic Resize</h2>
                    <p>Convert your design to any format instantly</p>
                    <button class="resize-close">&times;</button>
                </div>

                <div class="resize-body">
                    <div class="current-format">
                        <span class="label">Current Format:</span>
                        <span class="value">${current.name} (${current.width} x ${current.height})</span>
                    </div>

                    <div class="resize-options">
                        <div class="resize-mode">
                            <label>Resize Mode:</label>
                            <div class="mode-buttons">
                                <button class="mode-btn active" data-mode="smart">
                                    <span class="mode-icon">✨</span>
                                    <span class="mode-name">Smart</span>
                                    <span class="mode-desc">Auto-adjust layout</span>
                                </button>
                                <button class="mode-btn" data-mode="fit">
                                    <span class="mode-icon">📐</span>
                                    <span class="mode-name">Fit</span>
                                    <span class="mode-desc">Keep proportions</span>
                                </button>
                                <button class="mode-btn" data-mode="stretch">
                                    <span class="mode-icon">↔️</span>
                                    <span class="mode-name">Stretch</span>
                                    <span class="mode-desc">Fill canvas</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="format-categories">
                        ${Object.entries(FORMATS).map(([catId, category]) => `
                            <div class="format-category">
                                <h3>${category.label}</h3>
                                <div class="format-grid">
                                    ${Object.entries(category.formats).map(([formatId, format]) => `
                                        <button class="format-btn" data-format="${formatId}">
                                            <div class="format-preview" style="aspect-ratio: ${format.width}/${format.height}"></div>
                                            <span class="format-name">${format.name}</span>
                                            <span class="format-size">${format.width} x ${format.height}</span>
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="resize-footer">
                    <label class="copy-option">
                        <input type="checkbox" id="createCopy" checked>
                        <span>Create copy (keep original)</span>
                    </label>
                    <button class="resize-cancel">Cancel</button>
                    <button class="resize-apply" disabled>
                        <span class="btn-icon">✨</span>
                        Resize
                    </button>
                </div>
            </div>
        `;

        // State
        let selectedFormat = null;
        let selectedMode = 'smart';

        // Event handlers
        const closeBtn = modal.querySelector('.resize-close');
        const cancelBtn = modal.querySelector('.resize-cancel');
        const applyBtn = modal.querySelector('.resize-apply');
        const formatBtns = modal.querySelectorAll('.format-btn');
        const modeBtns = modal.querySelectorAll('.mode-btn');
        const createCopy = modal.querySelector('#createCopy');

        const close = () => {
            modal.classList.remove('visible');
            setTimeout(() => {
                modal.remove();
                currentModal = null;
            }, 200);
        };

        closeBtn.onclick = close;
        cancelBtn.onclick = close;
        modal.onclick = (e) => {
            if (e.target === modal) close();
        };

        // Format selection
        formatBtns.forEach(btn => {
            btn.onclick = () => {
                formatBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedFormat = btn.dataset.format;
                applyBtn.disabled = false;
            };
        });

        // Mode selection
        modeBtns.forEach(btn => {
            btn.onclick = () => {
                modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedMode = btn.dataset.mode;
            };
        });

        // Apply resize
        applyBtn.onclick = () => {
            if (selectedFormat && onResize) {
                const format = getFormat(selectedFormat);
                onResize({
                    formatId: selectedFormat,
                    format: format,
                    mode: selectedMode,
                    createCopy: createCopy.checked
                });
            }
            close();
        };

        document.body.appendChild(modal);
        currentModal = modal;

        // Animate in
        requestAnimationFrame(() => {
            modal.classList.add('visible');
        });

        return modal;
    }

    /**
     * Initialize styles
     */
    function init() {
        if (document.getElementById('magic-resize-styles')) return;

        const style = document.createElement('style');
        style.id = 'magic-resize-styles';
        style.textContent = `
            .magic-resize-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10010;
                opacity: 0;
                transition: opacity 0.2s ease;
                backdrop-filter: blur(4px);
            }

            .magic-resize-modal.visible {
                opacity: 1;
            }

            .resize-content {
                background: #1a1a2e;
                border-radius: 16px;
                width: 90%;
                max-width: 900px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                transform: scale(0.95);
                transition: transform 0.2s ease;
            }

            .magic-resize-modal.visible .resize-content {
                transform: scale(1);
            }

            .resize-header {
                padding: 24px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                position: relative;
            }

            .resize-header h2 {
                margin: 0;
                color: #fff;
                font-size: 24px;
            }

            .resize-header p {
                margin: 8px 0 0;
                color: #888;
                font-size: 14px;
            }

            .resize-close {
                position: absolute;
                top: 20px;
                right: 20px;
                background: none;
                border: none;
                color: #888;
                font-size: 28px;
                cursor: pointer;
            }

            .resize-close:hover {
                color: #fff;
            }

            .resize-body {
                flex: 1;
                overflow-y: auto;
                padding: 24px;
            }

            .current-format {
                background: rgba(108, 92, 231, 0.1);
                border: 1px solid rgba(108, 92, 231, 0.3);
                border-radius: 8px;
                padding: 12px 16px;
                margin-bottom: 20px;
            }

            .current-format .label {
                color: #888;
                font-size: 13px;
            }

            .current-format .value {
                color: #fff;
                font-weight: 500;
                margin-left: 8px;
            }

            .resize-options {
                margin-bottom: 24px;
            }

            .resize-mode label {
                display: block;
                color: #888;
                font-size: 13px;
                margin-bottom: 10px;
            }

            .mode-buttons {
                display: flex;
                gap: 12px;
            }

            .mode-btn {
                flex: 1;
                padding: 12px;
                background: rgba(255, 255, 255, 0.03);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                cursor: pointer;
                text-align: center;
                transition: all 0.2s;
            }

            .mode-btn:hover {
                background: rgba(255, 255, 255, 0.05);
                border-color: rgba(255, 255, 255, 0.2);
            }

            .mode-btn.active {
                background: rgba(108, 92, 231, 0.1);
                border-color: #6c5ce7;
            }

            .mode-icon {
                display: block;
                font-size: 24px;
                margin-bottom: 6px;
            }

            .mode-name {
                display: block;
                color: #fff;
                font-weight: 500;
                font-size: 14px;
            }

            .mode-desc {
                display: block;
                color: #666;
                font-size: 11px;
                margin-top: 4px;
            }

            .format-category {
                margin-bottom: 24px;
            }

            .format-category h3 {
                color: #6c5ce7;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin: 0 0 12px;
            }

            .format-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                gap: 12px;
            }

            .format-btn {
                padding: 12px;
                background: rgba(255, 255, 255, 0.03);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                cursor: pointer;
                text-align: center;
                transition: all 0.2s;
            }

            .format-btn:hover {
                background: rgba(255, 255, 255, 0.05);
                border-color: rgba(255, 255, 255, 0.2);
            }

            .format-btn.selected {
                background: rgba(108, 92, 231, 0.1);
                border-color: #6c5ce7;
            }

            .format-preview {
                width: 100%;
                max-width: 80px;
                max-height: 60px;
                margin: 0 auto 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }

            .format-name {
                display: block;
                color: #fff;
                font-size: 12px;
                font-weight: 500;
            }

            .format-size {
                display: block;
                color: #666;
                font-size: 10px;
                margin-top: 2px;
            }

            .resize-footer {
                padding: 16px 24px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .copy-option {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #aaa;
                font-size: 13px;
                cursor: pointer;
                margin-right: auto;
            }

            .copy-option input {
                accent-color: #6c5ce7;
            }

            .resize-footer button {
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s;
            }

            .resize-cancel {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: #aaa;
            }

            .resize-cancel:hover {
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
            }

            .resize-apply {
                background: linear-gradient(135deg, #6c5ce7, #a855f7);
                border: none;
                color: #fff;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .resize-apply:hover:not(:disabled) {
                transform: translateY(-1px);
                box-shadow: 0 4px 15px rgba(108, 92, 231, 0.4);
            }

            .resize-apply:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            /* Scrollbar */
            .resize-body::-webkit-scrollbar {
                width: 8px;
            }

            .resize-body::-webkit-scrollbar-track {
                background: transparent;
            }

            .resize-body::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
            }
        `;
        document.head.appendChild(style);
    }

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Create flat lookup of all formats for easier access
    const ALL_FORMATS_FLAT = {};
    for (const [catId, category] of Object.entries(FORMATS)) {
        for (const [formatId, format] of Object.entries(category.formats)) {
            ALL_FORMATS_FLAT[formatId] = { ...format, category: catId };
        }
    }

    // Public API
    return {
        init,
        FORMATS,
        ALL_FORMATS: ALL_FORMATS_FLAT,  // Flat map for easy counting
        getFormat,
        getAllFormats,
        calculateScale,
        resizeElements,
        showModal,
        isLoaded: true
    };
})();

// Global export
window.MagicResize = MagicResize;
