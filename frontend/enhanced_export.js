/**
 * Enhanced Export - SVG, GIF, and additional export formats
 * Matches Canva export capabilities
 */

(function() {
    'use strict';

    // Export formats configuration
    const EXPORT_FORMATS = {
        png: {
            name: 'PNG',
            extension: 'png',
            mimeType: 'image/png',
            description: 'Best for web, social media. Supports transparency.',
            quality: [1, 2, 3], // 1x, 2x, 3x
            hasTransparency: true
        },
        jpg: {
            name: 'JPG',
            extension: 'jpg',
            mimeType: 'image/jpeg',
            description: 'Best for photos. Smaller file size.',
            quality: [0.7, 0.85, 1.0], // Low, Medium, High
            hasTransparency: false
        },
        svg: {
            name: 'SVG',
            extension: 'svg',
            mimeType: 'image/svg+xml',
            description: 'Vector format. Scalable, perfect for logos.',
            hasTransparency: true
        },
        gif: {
            name: 'GIF',
            extension: 'gif',
            mimeType: 'image/gif',
            description: 'Animated images. Good for simple animations.',
            hasTransparency: true,
            maxColors: 256
        },
        pdf: {
            name: 'PDF',
            extension: 'pdf',
            mimeType: 'application/pdf',
            description: 'Best for print. Preserves quality.',
            hasTransparency: false
        },
        webp: {
            name: 'WebP',
            extension: 'webp',
            mimeType: 'image/webp',
            description: 'Modern format. Best compression.',
            quality: [0.7, 0.85, 1.0],
            hasTransparency: true
        }
    };

    // Social media presets
    const SOCIAL_PRESETS = {
        instagram_post: { width: 1080, height: 1080, name: 'Instagram Post' },
        instagram_story: { width: 1080, height: 1920, name: 'Instagram Story' },
        instagram_landscape: { width: 1080, height: 566, name: 'Instagram Landscape' },
        facebook_post: { width: 1200, height: 630, name: 'Facebook Post' },
        facebook_cover: { width: 820, height: 312, name: 'Facebook Cover' },
        twitter_post: { width: 1200, height: 675, name: 'Twitter/X Post' },
        twitter_header: { width: 1500, height: 500, name: 'Twitter/X Header' },
        linkedin_post: { width: 1200, height: 627, name: 'LinkedIn Post' },
        linkedin_cover: { width: 1584, height: 396, name: 'LinkedIn Cover' },
        pinterest: { width: 1000, height: 1500, name: 'Pinterest Pin' },
        youtube_thumbnail: { width: 1280, height: 720, name: 'YouTube Thumbnail' }
    };

    /**
     * Export canvas to SVG
     */
    async function exportToSVG(canvasElement, options = {}) {
        const { filename = 'design', includeStyles = true } = options;

        // Get canvas dimensions
        const rect = canvasElement.getBoundingClientRect();
        const width = options.width || rect.width;
        const height = options.height || rect.height;

        // Create SVG document
        let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${width}" height="${height}"
     viewBox="0 0 ${width} ${height}">
`;

        // Add styles
        if (includeStyles) {
            svgContent += `<style>
    text { font-family: Arial, sans-serif; }
    .text-element { white-space: pre-wrap; }
</style>
`;
        }

        // Add background
        const bgColor = window.getComputedStyle(canvasElement).backgroundColor || 'white';
        svgContent += `<rect width="100%" height="100%" fill="${bgColor}"/>
`;

        // Convert each element to SVG
        const elements = canvasElement.querySelectorAll('.design-element, .brochure-element, .editable');
        for (const element of elements) {
            const svgElement = await elementToSVG(element, canvasElement);
            if (svgElement) {
                svgContent += svgElement;
            }
        }

        svgContent += '</svg>';

        // Download
        downloadFile(svgContent, `${filename}.svg`, 'image/svg+xml');

        return svgContent;
    }

    /**
     * Convert DOM element to SVG representation
     */
    async function elementToSVG(element, parentCanvas) {
        const style = window.getComputedStyle(element);
        const parentRect = parentCanvas.getBoundingClientRect();
        const rect = element.getBoundingClientRect();

        const x = rect.left - parentRect.left;
        const y = rect.top - parentRect.top;
        const width = rect.width;
        const height = rect.height;

        const transform = style.transform !== 'none' ? style.transform : '';
        const opacity = style.opacity || 1;

        let svg = `<g transform="translate(${x}, ${y})" opacity="${opacity}">`;

        // Check element type
        if (element.querySelector('img')) {
            // Image element
            const img = element.querySelector('img');
            const imgData = await getImageAsDataURL(img);
            if (imgData) {
                svg += `<image href="${imgData}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>`;
            }
        } else if (element.querySelector('svg')) {
            // SVG element (shapes, icons)
            const innerSvg = element.querySelector('svg').outerHTML;
            svg += `<g transform="scale(${width/100}, ${height/100})">${innerSvg}</g>`;
        } else if (element.classList.contains('text-element') || element.classList.contains('editable')) {
            // Text element
            const text = element.innerText || element.textContent;
            const fontSize = parseInt(style.fontSize) || 16;
            const fontFamily = style.fontFamily || 'Arial';
            const fontWeight = style.fontWeight || 'normal';
            const color = style.color || '#000000';
            const textAlign = style.textAlign || 'left';

            let textAnchor = 'start';
            if (textAlign === 'center') textAnchor = 'middle';
            if (textAlign === 'right') textAnchor = 'end';

            const textX = textAlign === 'center' ? width / 2 : (textAlign === 'right' ? width : 0);

            svg += `<text x="${textX}" y="${fontSize}"
                         font-size="${fontSize}"
                         font-family="${fontFamily}"
                         font-weight="${fontWeight}"
                         fill="${color}"
                         text-anchor="${textAnchor}">`;

            // Handle multi-line text
            const lines = text.split('\n');
            lines.forEach((line, i) => {
                svg += `<tspan x="${textX}" dy="${i === 0 ? 0 : fontSize * 1.2}">${escapeXML(line)}</tspan>`;
            });

            svg += '</text>';
        } else {
            // Generic element - try to capture background
            const bgColor = style.backgroundColor;
            if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                const borderRadius = parseInt(style.borderRadius) || 0;
                svg += `<rect width="${width}" height="${height}" fill="${bgColor}" rx="${borderRadius}"/>`;
            }
        }

        svg += '</g>\n';
        return svg;
    }

    /**
     * Export canvas to GIF (simple static GIF)
     */
    async function exportToGIF(canvasElement, options = {}) {
        const { filename = 'design', width, height } = options;

        // Create canvas for rendering
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const rect = canvasElement.getBoundingClientRect();
        canvas.width = width || rect.width;
        canvas.height = height || rect.height;

        // Use html2canvas to render the element
        if (typeof html2canvas !== 'undefined') {
            const rendered = await html2canvas(canvasElement, {
                width: canvas.width,
                height: canvas.height,
                scale: 1,
                useCORS: true,
                allowTaint: true
            });

            // Convert to GIF using gif.js if available, otherwise fallback to PNG
            if (typeof GIF !== 'undefined') {
                const gif = new GIF({
                    workers: 2,
                    quality: 10,
                    width: canvas.width,
                    height: canvas.height
                });

                gif.addFrame(rendered, { delay: 1000 });

                gif.on('finished', (blob) => {
                    downloadBlob(blob, `${filename}.gif`);
                });

                gif.render();
            } else {
                // Fallback: export as PNG and inform user
                console.warn('GIF library not available, exporting as PNG');
                const dataUrl = rendered.toDataURL('image/png');
                downloadDataURL(dataUrl, `${filename}.png`);
            }
        } else {
            console.error('html2canvas not available for GIF export');
            showToast('GIF export requires additional libraries', 'error');
        }
    }

    /**
     * Export to WebP format
     */
    async function exportToWebP(canvasElement, options = {}) {
        const { filename = 'design', quality = 0.85 } = options;

        if (typeof html2canvas !== 'undefined') {
            const rect = canvasElement.getBoundingClientRect();
            const rendered = await html2canvas(canvasElement, {
                width: options.width || rect.width,
                height: options.height || rect.height,
                scale: options.scale || 1,
                useCORS: true
            });

            // Check if browser supports WebP
            const canvas = document.createElement('canvas');
            if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
                const dataUrl = rendered.toDataURL('image/webp', quality);
                downloadDataURL(dataUrl, `${filename}.webp`);
            } else {
                console.warn('WebP not supported, falling back to PNG');
                const dataUrl = rendered.toDataURL('image/png');
                downloadDataURL(dataUrl, `${filename}.png`);
            }
        }
    }

    /**
     * Export with social media preset
     */
    async function exportForSocial(canvasElement, presetId, format = 'png') {
        const preset = SOCIAL_PRESETS[presetId];
        if (!preset) {
            console.error('Unknown social preset:', presetId);
            return;
        }

        const options = {
            filename: `${presetId}_${Date.now()}`,
            width: preset.width,
            height: preset.height,
            scale: 1
        };

        switch (format) {
            case 'svg':
                await exportToSVG(canvasElement, options);
                break;
            case 'gif':
                await exportToGIF(canvasElement, options);
                break;
            case 'webp':
                await exportToWebP(canvasElement, options);
                break;
            default:
                await exportToPNG(canvasElement, options);
        }

        showToast(`Exported for ${preset.name}`, 'success');
    }

    /**
     * Export to PNG (enhanced)
     */
    async function exportToPNG(canvasElement, options = {}) {
        const { filename = 'design', scale = 1, transparent = false } = options;

        if (typeof html2canvas !== 'undefined') {
            const rect = canvasElement.getBoundingClientRect();
            const rendered = await html2canvas(canvasElement, {
                width: options.width || rect.width,
                height: options.height || rect.height,
                scale: scale,
                useCORS: true,
                backgroundColor: transparent ? null : '#ffffff'
            });

            const dataUrl = rendered.toDataURL('image/png');
            downloadDataURL(dataUrl, `${filename}.png`);
        }
    }

    /**
     * Render export panel UI
     */
    function renderExportPanel(container, canvasElement) {
        let html = `
            <div class="export-panel">
                <h3>Export Options</h3>

                <div class="export-section">
                    <h4>Format</h4>
                    <div class="format-grid">
        `;

        Object.entries(EXPORT_FORMATS).forEach(([id, format]) => {
            html += `
                <button class="format-btn" data-format="${id}">
                    <span class="format-name">${format.name}</span>
                    <span class="format-desc">${format.description}</span>
                </button>
            `;
        });

        html += `
                    </div>
                </div>

                <div class="export-section">
                    <h4>Social Media Presets</h4>
                    <select id="socialPreset" class="export-select">
                        <option value="">Select preset...</option>
        `;

        Object.entries(SOCIAL_PRESETS).forEach(([id, preset]) => {
            html += `<option value="${id}">${preset.name} (${preset.width}x${preset.height})</option>`;
        });

        html += `
                    </select>
                </div>

                <div class="export-section">
                    <h4>Quality</h4>
                    <div class="quality-options">
                        <label><input type="radio" name="quality" value="1" checked> Standard (1x)</label>
                        <label><input type="radio" name="quality" value="2"> High (2x)</label>
                        <label><input type="radio" name="quality" value="3"> Ultra (3x)</label>
                    </div>
                </div>

                <div class="export-section">
                    <label class="checkbox-label">
                        <input type="checkbox" id="transparentBg"> Transparent background
                    </label>
                </div>

                <div class="export-actions">
                    <button class="btn btn-primary" id="exportBtn">Export</button>
                    <button class="btn btn-secondary" id="exportAllBtn">Export All Pages</button>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Event listeners
        let selectedFormat = 'png';

        container.querySelectorAll('.format-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedFormat = btn.dataset.format;
            });
        });

        container.querySelector('#exportBtn').addEventListener('click', async () => {
            const quality = parseInt(container.querySelector('input[name="quality"]:checked').value);
            const transparent = container.querySelector('#transparentBg').checked;
            const socialPreset = container.querySelector('#socialPreset').value;

            const options = {
                filename: `brochure_${Date.now()}`,
                scale: quality,
                transparent
            };

            if (socialPreset) {
                await exportForSocial(canvasElement, socialPreset, selectedFormat);
            } else {
                switch (selectedFormat) {
                    case 'svg':
                        await exportToSVG(canvasElement, options);
                        break;
                    case 'gif':
                        await exportToGIF(canvasElement, options);
                        break;
                    case 'webp':
                        await exportToWebP(canvasElement, options);
                        break;
                    case 'jpg':
                        await exportToJPG(canvasElement, options);
                        break;
                    default:
                        await exportToPNG(canvasElement, options);
                }
            }
        });
    }

    /**
     * Export to JPG
     */
    async function exportToJPG(canvasElement, options = {}) {
        const { filename = 'design', quality = 0.92 } = options;

        if (typeof html2canvas !== 'undefined') {
            const rect = canvasElement.getBoundingClientRect();
            const rendered = await html2canvas(canvasElement, {
                width: options.width || rect.width,
                height: options.height || rect.height,
                scale: options.scale || 1,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const dataUrl = rendered.toDataURL('image/jpeg', quality);
            downloadDataURL(dataUrl, `${filename}.jpg`);
        }
    }

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================

    function escapeXML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }

    async function getImageAsDataURL(img) {
        return new Promise((resolve) => {
            if (img.src.startsWith('data:')) {
                resolve(img.src);
                return;
            }

            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');

            const newImg = new Image();
            newImg.crossOrigin = 'anonymous';
            newImg.onload = () => {
                ctx.drawImage(newImg, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            };
            newImg.onerror = () => resolve(null);
            newImg.src = img.src;
        });
    }

    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        downloadBlob(blob, filename);
    }

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function downloadDataURL(dataUrl, filename) {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function showToast(message, type = 'info') {
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        } else {
            console.log(`[${type}] ${message}`);
        }
    }

    /**
     * Show export modal dialog
     */
    function showModal(canvasElement) {
        // Remove existing modal
        const existing = document.querySelector('.enhanced-export-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.className = 'enhanced-export-modal';
        modal.innerHTML = `
            <div class="export-modal-content">
                <div class="export-modal-header">
                    <h2>Export Design</h2>
                    <button class="export-close-btn">&times;</button>
                </div>
                <div class="export-modal-body">
                    <div class="export-section">
                        <h4>Format</h4>
                        <div class="format-grid">
                            ${Object.entries(EXPORT_FORMATS).map(([id, format]) => `
                                <button class="format-btn${id === 'png' ? ' active' : ''}" data-format="${id}">
                                    <span class="format-name">${format.name}</span>
                                    <span class="format-desc">${format.description}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <div class="export-section">
                        <h4>Social Media Presets</h4>
                        <select id="socialPresetSelect" class="export-select">
                            <option value="">Original Size</option>
                            ${Object.entries(SOCIAL_PRESETS).map(([id, preset]) =>
                                `<option value="${id}">${preset.name} (${preset.width}x${preset.height})</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="export-section">
                        <h4>Quality</h4>
                        <div class="quality-options">
                            <label><input type="radio" name="exportQuality" value="1" checked> Standard (1x)</label>
                            <label><input type="radio" name="exportQuality" value="2"> High (2x)</label>
                            <label><input type="radio" name="exportQuality" value="3"> Ultra (3x)</label>
                        </div>
                    </div>
                </div>
                <div class="export-modal-footer">
                    <button class="export-cancel-btn">Cancel</button>
                    <button class="export-download-btn">Download</button>
                </div>
            </div>
        `;

        // Add styles if not present
        if (!document.getElementById('enhanced-export-modal-styles')) {
            const style = document.createElement('style');
            style.id = 'enhanced-export-modal-styles';
            style.textContent = `
                .enhanced-export-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10010;
                    backdrop-filter: blur(4px);
                }
                .export-modal-content {
                    background: #1a1a2e;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 600px;
                    max-height: 80vh;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .export-modal-header {
                    padding: 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .export-modal-header h2 {
                    margin: 0;
                    color: #fff;
                    font-size: 20px;
                }
                .export-close-btn {
                    background: none;
                    border: none;
                    color: #888;
                    font-size: 28px;
                    cursor: pointer;
                }
                .export-modal-body {
                    padding: 20px;
                    overflow-y: auto;
                }
                .export-section {
                    margin-bottom: 20px;
                }
                .export-section h4 {
                    color: #aaa;
                    font-size: 12px;
                    text-transform: uppercase;
                    margin: 0 0 10px;
                }
                .format-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                }
                .format-btn {
                    padding: 12px;
                    background: rgba(255,255,255,0.03);
                    border: 2px solid rgba(255,255,255,0.1);
                    border-radius: 8px;
                    cursor: pointer;
                    text-align: left;
                    transition: all 0.2s;
                }
                .format-btn:hover {
                    background: rgba(255,255,255,0.05);
                }
                .format-btn.active {
                    border-color: #6c5ce7;
                    background: rgba(108,92,231,0.1);
                }
                .format-name {
                    display: block;
                    color: #fff;
                    font-weight: 500;
                    font-size: 14px;
                }
                .format-desc {
                    display: block;
                    color: #888;
                    font-size: 11px;
                    margin-top: 4px;
                }
                .export-select {
                    width: 100%;
                    padding: 10px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px;
                    color: #fff;
                    font-size: 14px;
                }
                .quality-options {
                    display: flex;
                    gap: 20px;
                }
                .quality-options label {
                    color: #aaa;
                    font-size: 13px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .quality-options input {
                    accent-color: #6c5ce7;
                }
                .export-modal-footer {
                    padding: 15px 20px;
                    border-top: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }
                .export-cancel-btn {
                    padding: 10px 20px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px;
                    color: #aaa;
                    cursor: pointer;
                }
                .export-download-btn {
                    padding: 10px 24px;
                    background: linear-gradient(135deg, #6c5ce7, #a855f7);
                    border: none;
                    border-radius: 8px;
                    color: #fff;
                    font-weight: 500;
                    cursor: pointer;
                }
            `;
            document.head.appendChild(style);
        }

        // Event handlers
        let selectedFormat = 'png';

        modal.querySelector('.export-close-btn').onclick = () => modal.remove();
        modal.querySelector('.export-cancel-btn').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

        modal.querySelectorAll('.format-btn').forEach(btn => {
            btn.onclick = () => {
                modal.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedFormat = btn.dataset.format;
            };
        });

        modal.querySelector('.export-download-btn').onclick = async () => {
            const quality = parseInt(modal.querySelector('input[name="exportQuality"]:checked').value);
            const socialPreset = modal.querySelector('#socialPresetSelect').value;
            const canvas = canvasElement || document.querySelector('.brochure-canvas') || document.querySelector('.page-canvas');

            if (!canvas) {
                showToast('No canvas found to export', 'error');
                return;
            }

            const options = {
                filename: `design_${Date.now()}`,
                scale: quality
            };

            modal.remove();

            if (socialPreset) {
                await exportForSocial(canvas, socialPreset, selectedFormat);
            } else {
                switch (selectedFormat) {
                    case 'svg': await exportToSVG(canvas, options); break;
                    case 'gif': await exportToGIF(canvas, options); break;
                    case 'webp': await exportToWebP(canvas, options); break;
                    case 'jpg': await exportToJPG(canvas, options); break;
                    default: await exportToPNG(canvas, options);
                }
            }
        };

        document.body.appendChild(modal);
        return modal;
    }

    // Export to global scope
    window.EnhancedExport = {
        FORMATS: EXPORT_FORMATS,
        SOCIAL_PRESETS: SOCIAL_PRESETS,
        toSVG: exportToSVG,
        toGIF: exportToGIF,
        toWebP: exportToWebP,
        toPNG: exportToPNG,
        toJPG: exportToJPG,
        forSocial: exportForSocial,
        renderPanel: renderExportPanel,
        showModal: showModal,
        isLoaded: true
    };

    console.log('Enhanced Export loaded:',
        Object.keys(EXPORT_FORMATS).length, 'formats,',
        Object.keys(SOCIAL_PRESETS).length, 'social presets'
    );

})();
