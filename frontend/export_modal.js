/**
 * ENHANCED EXPORT MODAL
 * Canva-like export experience with format selection, quality options, and page selection
 */

const ExportModal = (function() {
    'use strict';

    // Export formats
    const FORMATS = {
        png: {
            name: 'PNG',
            icon: '🖼️',
            description: 'Best for web & social media',
            extension: 'png',
            mimeType: 'image/png',
            supportsTransparency: true,
            qualities: [
                { label: 'Standard (1x)', value: 1, size: '~500 KB' },
                { label: 'High (2x)', value: 2, size: '~2 MB' },
                { label: 'Ultra (3x)', value: 3, size: '~4 MB' }
            ]
        },
        jpg: {
            name: 'JPG',
            icon: '📷',
            description: 'Best for photos, smaller files',
            extension: 'jpg',
            mimeType: 'image/jpeg',
            supportsTransparency: false,
            qualities: [
                { label: 'Web (70%)', value: 0.7, size: '~200 KB' },
                { label: 'Standard (85%)', value: 0.85, size: '~400 KB' },
                { label: 'Maximum (100%)', value: 1.0, size: '~800 KB' }
            ]
        },
        pdf: {
            name: 'PDF',
            icon: '📄',
            description: 'Best for print, preserves quality',
            extension: 'pdf',
            mimeType: 'application/pdf',
            supportsTransparency: false,
            qualities: [
                { label: 'Screen (72 DPI)', value: 72, size: '~1 MB' },
                { label: 'Print (150 DPI)', value: 150, size: '~3 MB' },
                { label: 'High Quality (300 DPI)', value: 300, size: '~8 MB' }
            ]
        },
        webp: {
            name: 'WebP',
            icon: '🌐',
            description: 'Modern format, best compression',
            extension: 'webp',
            mimeType: 'image/webp',
            supportsTransparency: true,
            qualities: [
                { label: 'Web (70%)', value: 0.7, size: '~150 KB' },
                { label: 'Standard (85%)', value: 0.85, size: '~300 KB' },
                { label: 'Lossless (100%)', value: 1.0, size: '~500 KB' }
            ]
        },
        html: {
            name: 'HTML',
            icon: '🏠',
            description: 'Professional brochure webpage',
            extension: 'html',
            mimeType: 'text/html',
            supportsTransparency: false,
            qualities: [
                { label: 'Standard', value: 1, size: '~1-2 MB' }
            ]
        }
    };

    // Social media presets
    const SOCIAL_PRESETS = [
        { id: 'none', name: 'Original Size', width: 0, height: 0, icon: '📐' },
        { id: 'instagram_post', name: 'Instagram Post', width: 1080, height: 1080, icon: '📸' },
        { id: 'instagram_story', name: 'Instagram Story', width: 1080, height: 1920, icon: '📱' },
        { id: 'facebook_post', name: 'Facebook Post', width: 1200, height: 630, icon: '👍' },
        { id: 'twitter_post', name: 'Twitter/X Post', width: 1200, height: 675, icon: '🐦' },
        { id: 'linkedin_post', name: 'LinkedIn Post', width: 1200, height: 627, icon: '💼' },
        { id: 'pinterest', name: 'Pinterest Pin', width: 1000, height: 1500, icon: '📌' },
        { id: 'youtube_thumbnail', name: 'YouTube Thumbnail', width: 1280, height: 720, icon: '▶️' }
    ];

    // State
    let currentFormat = 'png';
    let currentQuality = 1;
    let currentSocialPreset = 'none';
    let selectedPages = 'all';
    let isExporting = false;

    /**
     * Show export modal
     */
    function show() {
        // Remove existing modal if any
        const existing = document.getElementById('exportModalOverlay');
        if (existing) existing.remove();

        // Get pages
        const pages = document.querySelectorAll('.brochure-page, .page-canvas');
        const pageCount = pages.length || 1;

        // Create modal
        const overlay = document.createElement('div');
        overlay.id = 'exportModalOverlay';
        overlay.className = 'export-modal-overlay';

        overlay.innerHTML = `
            <div class="export-modal">
                <div class="export-modal-header">
                    <h2>Export Your Design</h2>
                    <button class="export-modal-close" onclick="ExportModal.close()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <div class="export-modal-body">
                    <!-- Format Selection -->
                    <div class="export-section">
                        <div class="export-section-title">File Type</div>
                        <div class="format-grid">
                            ${Object.entries(FORMATS).map(([id, format]) => `
                                <div class="format-card ${id === currentFormat ? 'selected' : ''}"
                                     data-format="${id}"
                                     onclick="ExportModal.selectFormat('${id}')">
                                    <span class="format-card-icon">${format.icon}</span>
                                    <span class="format-card-name">${format.name}</span>
                                    <span class="format-card-desc">${format.description}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Quality Selection -->
                    <div class="export-section">
                        <div class="export-section-title">Quality</div>
                        <div id="qualityOptions" class="quality-options">
                            ${renderQualityOptions(currentFormat)}
                        </div>
                    </div>

                    <!-- Social Media Preset (for images) -->
                    <div class="export-section" id="socialPresetSection">
                        <div class="export-section-title">Resize for Social Media</div>
                        <select class="social-presets-select" id="socialPresetSelect" onchange="ExportModal.selectSocialPreset(this.value)">
                            ${SOCIAL_PRESETS.map(preset => `
                                <option value="${preset.id}" ${preset.id === currentSocialPreset ? 'selected' : ''}>
                                    ${preset.icon} ${preset.name} ${preset.width ? `(${preset.width}×${preset.height})` : ''}
                                </option>
                            `).join('')}
                        </select>
                    </div>

                    <!-- Page Selection -->
                    <div class="export-section" id="pageSelectSection" ${pageCount <= 1 ? 'style="display:none"' : ''}>
                        <div class="export-section-title">Pages</div>
                        <div class="page-select-grid">
                            <button class="page-select-btn ${selectedPages === 'all' ? 'selected' : ''}"
                                    onclick="ExportModal.selectPages('all')">
                                All Pages (${pageCount})
                            </button>
                            <button class="page-select-btn ${selectedPages === 'current' ? 'selected' : ''}"
                                    onclick="ExportModal.selectPages('current')">
                                Current Page
                            </button>
                            ${pageCount > 2 ? `
                                <button class="page-select-btn ${selectedPages === 'custom' ? 'selected' : ''}"
                                        onclick="ExportModal.selectPages('custom')">
                                    Custom Range
                                </button>
                            ` : ''}
                        </div>
                    </div>

                    <!-- Transparency Option -->
                    <div class="export-section" id="transparencySection">
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                            <input type="checkbox" id="transparentBg" ${FORMATS[currentFormat].supportsTransparency ? '' : 'disabled'}>
                            <span>Transparent background</span>
                        </label>
                        ${!FORMATS[currentFormat].supportsTransparency ? '<small style="color: var(--text-muted); margin-left: 24px;">Not available for this format</small>' : ''}
                    </div>

                    <!-- Estimate -->
                    <div class="export-estimate">
                        <span class="export-estimate-label">Estimated file size:</span>
                        <span class="export-estimate-value" id="fileSizeEstimate">~500 KB</span>
                    </div>

                    <!-- Progress (hidden initially) -->
                    <div id="exportProgressSection" style="display: none;">
                        <div class="export-progress">
                            <div class="export-progress-bar" id="exportProgressBar" style="width: 0%"></div>
                        </div>
                        <div class="export-status" id="exportStatus">Preparing export...</div>
                    </div>
                </div>

                <div class="export-modal-footer">
                    <button class="export-btn-cancel" onclick="ExportModal.close()">Cancel</button>
                    <button class="export-btn-download" id="downloadBtn" onclick="ExportModal.startExport()">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Download
                    </button>
                </div>
            </div>
        `;

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        document.body.appendChild(overlay);

        // Update estimate
        updateFileSizeEstimate();

        console.log('[ExportModal] Opened');
    }

    /**
     * Render quality options for a format
     */
    function renderQualityOptions(format) {
        const qualities = FORMATS[format].qualities;
        return qualities.map((q, index) => `
            <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer;">
                <input type="radio" name="exportQuality" value="${q.value}"
                       ${index === 1 ? 'checked' : ''}
                       onchange="ExportModal.selectQuality(${q.value})">
                <span>${q.label}</span>
                <span style="color: var(--text-muted); font-size: 12px;">${q.size}</span>
            </label>
        `).join('');
    }

    /**
     * Select format
     */
    function selectFormat(format) {
        currentFormat = format;

        // Update UI
        document.querySelectorAll('.format-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.format === format);
        });

        // Update quality options
        const qualityContainer = document.getElementById('qualityOptions');
        if (qualityContainer) {
            qualityContainer.innerHTML = renderQualityOptions(format);
        }

        // Update transparency option
        const transpSection = document.getElementById('transparencySection');
        if (transpSection) {
            const checkbox = transpSection.querySelector('input[type="checkbox"]');
            const small = transpSection.querySelector('small');

            if (FORMATS[format].supportsTransparency) {
                checkbox.disabled = false;
                if (small) small.style.display = 'none';
            } else {
                checkbox.disabled = true;
                checkbox.checked = false;
                if (small) small.style.display = 'block';
            }
        }

        // Hide social presets for PDF
        const socialSection = document.getElementById('socialPresetSection');
        if (socialSection) {
            socialSection.style.display = format === 'pdf' ? 'none' : 'block';
        }

        updateFileSizeEstimate();
    }

    /**
     * Select quality
     */
    function selectQuality(quality) {
        currentQuality = quality;
        updateFileSizeEstimate();
    }

    /**
     * Select social preset
     */
    function selectSocialPreset(preset) {
        currentSocialPreset = preset;
        updateFileSizeEstimate();
    }

    /**
     * Select pages
     */
    function selectPages(selection) {
        selectedPages = selection;
        document.querySelectorAll('.page-select-btn').forEach(btn => {
            btn.classList.toggle('selected',
                btn.textContent.toLowerCase().includes(selection) ||
                (selection === 'all' && btn.textContent.includes('All')));
        });
    }

    /**
     * Update file size estimate
     */
    function updateFileSizeEstimate() {
        const format = FORMATS[currentFormat];
        const quality = format.qualities.find(q => q.value === currentQuality) || format.qualities[1];

        const estimateEl = document.getElementById('fileSizeEstimate');
        if (estimateEl) {
            estimateEl.textContent = quality.size;
        }
    }

    /**
     * Start export
     */
    async function startExport() {
        if (isExporting) return;
        isExporting = true;

        const downloadBtn = document.getElementById('downloadBtn');
        const progressSection = document.getElementById('exportProgressSection');
        const progressBar = document.getElementById('exportProgressBar');
        const statusEl = document.getElementById('exportStatus');

        // Disable button
        if (downloadBtn) {
            downloadBtn.disabled = true;
            downloadBtn.innerHTML = `
                <svg class="spinning" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Exporting...
            `;
        }

        // Show progress
        if (progressSection) progressSection.style.display = 'block';

        try {
            // Get canvas element
            const canvas = document.querySelector('.brochure-page.active, .page-canvas, .brochure-canvas');
            if (!canvas) {
                throw new Error('No canvas found to export');
            }

            // Update progress
            updateProgress(20, 'Rendering design...');

            // Get options
            const transparent = document.getElementById('transparentBg')?.checked || false;
            const filename = `brochure_${Date.now()}`;

            // Export based on format
            switch (currentFormat) {
                case 'png':
                    await exportPNG(canvas, { filename, scale: currentQuality, transparent });
                    break;
                case 'jpg':
                    await exportJPG(canvas, { filename, quality: currentQuality });
                    break;
                case 'pdf':
                    await exportPDF(canvas, { filename, dpi: currentQuality });
                    break;
                case 'webp':
                    await exportWebP(canvas, { filename, quality: currentQuality, transparent });
                    break;
                case 'html':
                    await exportHTML({ filename });
                    break;
            }

            updateProgress(100, 'Download complete!');

            // Auto close after success
            setTimeout(() => {
                close();
            }, 1500);

        } catch (error) {
            console.error('[ExportModal] Export failed:', error);
            if (statusEl) statusEl.textContent = `Export failed: ${error.message}`;
            if (downloadBtn) {
                downloadBtn.disabled = false;
                downloadBtn.innerHTML = 'Retry Download';
            }
        }

        isExporting = false;
    }

    /**
     * Update progress
     */
    function updateProgress(percent, status) {
        const progressBar = document.getElementById('exportProgressBar');
        const statusEl = document.getElementById('exportStatus');

        if (progressBar) progressBar.style.width = `${percent}%`;
        if (statusEl) statusEl.textContent = status;
    }

    /**
     * Export to PNG
     */
    async function exportPNG(element, options = {}) {
        updateProgress(40, 'Converting to PNG...');

        if (typeof html2canvas === 'undefined') {
            throw new Error('html2canvas not available');
        }

        const rendered = await html2canvas(element, {
            scale: options.scale || 1,
            useCORS: true,
            backgroundColor: options.transparent ? null : '#ffffff',
            logging: false
        });

        updateProgress(70, 'Preparing download...');

        const dataUrl = rendered.toDataURL('image/png');
        downloadDataURL(dataUrl, `${options.filename}.png`);

        updateProgress(90, 'Downloading...');
    }

    /**
     * Export to JPG
     */
    async function exportJPG(element, options = {}) {
        updateProgress(40, 'Converting to JPG...');

        if (typeof html2canvas === 'undefined') {
            throw new Error('html2canvas not available');
        }

        const rendered = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false
        });

        updateProgress(70, 'Preparing download...');

        const dataUrl = rendered.toDataURL('image/jpeg', options.quality || 0.92);
        downloadDataURL(dataUrl, `${options.filename}.jpg`);

        updateProgress(90, 'Downloading...');
    }

    /**
     * Export to WebP
     */
    async function exportWebP(element, options = {}) {
        updateProgress(40, 'Converting to WebP...');

        if (typeof html2canvas === 'undefined') {
            throw new Error('html2canvas not available');
        }

        const rendered = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: options.transparent ? null : '#ffffff',
            logging: false
        });

        updateProgress(70, 'Preparing download...');

        // Check WebP support
        if (rendered.toDataURL('image/webp').startsWith('data:image/webp')) {
            const dataUrl = rendered.toDataURL('image/webp', options.quality || 0.92);
            downloadDataURL(dataUrl, `${options.filename}.webp`);
        } else {
            // Fallback to PNG
            const dataUrl = rendered.toDataURL('image/png');
            downloadDataURL(dataUrl, `${options.filename}.png`);
            console.warn('[ExportModal] WebP not supported, exported as PNG');
        }

        updateProgress(90, 'Downloading...');
    }

    /**
     * Export to PDF
     */
    async function exportPDF(element, options = {}) {
        updateProgress(40, 'Generating PDF...');

        // Check if jsPDF is available
        if (typeof jspdf === 'undefined' && typeof window.jspdf === 'undefined') {
            // Try alternative: use the existing export system
            if (typeof EnhancedExport !== 'undefined' && EnhancedExport.toPDF) {
                await EnhancedExport.toPDF(element, options);
                return;
            }
            throw new Error('PDF export not available');
        }

        const { jsPDF } = window.jspdf;

        // Get canvas dimensions
        const rect = element.getBoundingClientRect();

        // Render to canvas
        updateProgress(60, 'Rendering pages...');

        if (typeof html2canvas === 'undefined') {
            throw new Error('html2canvas not available');
        }

        const rendered = await html2canvas(element, {
            scale: (options.dpi || 150) / 72,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false
        });

        updateProgress(80, 'Creating PDF...');

        // Create PDF
        const pdf = new jsPDF({
            orientation: rect.width > rect.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [rect.width, rect.height]
        });

        const imgData = rendered.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, rect.width, rect.height);

        updateProgress(95, 'Saving PDF...');

        pdf.save(`${options.filename}.pdf`);
    }

    /**
     * Export to HTML - Professional UK estate agent brochure
     */
    async function exportHTML(options = {}) {
        updateProgress(20, 'Gathering brochure data...');

        try {
            // Get session data from EditorState (the authoritative source)
            const sessionData = window.EditorState?.sessionData || {};
            const pages = sessionData.pages || [];

            // Also update window.brochureData for generateHTMLPreview compatibility
            if (!window.brochureData) window.brochureData = {};
            window.brochureData.property = sessionData.property || {};
            window.brochureData.pages = pages;

            // Get photos from EditorState or uploaded photos
            if (!window.uploadedPhotos) window.uploadedPhotos = [];
            if (sessionData.photos && sessionData.photos.length > 0) {
                window.uploadedPhotos = sessionData.photos;
            }

            console.log('[ExportHTML] Session data:', sessionData);
            console.log('[ExportHTML] Pages:', pages.length);
            console.log('[ExportHTML] Photos:', window.uploadedPhotos?.length || 0);

            updateProgress(40, 'Generating HTML brochure...');

            // Use the generateHTMLPreview function from multi_format_export.js
            let htmlContent;
            if (typeof generateHTMLPreview === 'function') {
                htmlContent = generateHTMLPreview(pages);
            } else if (typeof window.generateHTMLPreview === 'function') {
                htmlContent = window.generateHTMLPreview(pages);
            } else {
                // Fallback: generate basic HTML
                htmlContent = generateBasicHTML(pages);
            }

            updateProgress(70, 'Preparing download...');

            // Create blob and download
            const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `${options.filename || 'brochure'}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            updateProgress(90, 'Downloading...');
            console.log('[ExportModal] HTML brochure exported successfully');

        } catch (error) {
            console.error('[ExportModal] HTML export failed:', error);
            throw error;
        }
    }

    /**
     * Fallback basic HTML generator
     */
    function generateBasicHTML(pages) {
        // Get data from EditorState (authoritative) or fallback to window globals
        const sessionData = window.EditorState?.sessionData || {};
        const property = sessionData.property || window.brochureData?.property || {};
        const photos = sessionData.photos || window.uploadedPhotos || [];

        console.log('[generateBasicHTML] Property:', property);
        console.log('[generateBasicHTML] Photos:', photos.length);

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${property.address || 'Property Brochure'}</title>
    <style>
        body { font-family: Georgia, serif; max-width: 900px; margin: 0 auto; padding: 40px; }
        h1 { color: #722F37; border-bottom: 2px solid #722F37; padding-bottom: 10px; }
        .price { font-size: 1.5em; color: #722F37; }
        .gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 20px 0; }
        .gallery img { width: 100%; height: 200px; object-fit: cover; }
        .section { margin: 30px 0; }
        .section h2 { color: #722F37; }
    </style>
</head>
<body>
    <h1>${property.address || 'Property'}</h1>
    <p class="price">${property.price || ''}</p>
    <p>${property.bedrooms || ''} bedrooms | ${property.bathrooms || ''} bathrooms</p>

    ${photos.length > 0 ? `
    <div class="gallery">
        ${photos.slice(0, 9).map(p => `<img src="${p.dataUrl || p.url}" alt="Property photo">`).join('')}
    </div>
    ` : ''}

    ${pages.map(page => `
    <div class="section">
        <h2>${page.name || ''}</h2>
        <p>${page.content?.description || ''}</p>
    </div>
    `).join('')}

    <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; color: #666;">
        <p>Doorstep | hello@doorstep.co.uk</p>
    </footer>
</body>
</html>`;
    }

    /**
     * Download data URL
     */
    function downloadDataURL(dataUrl, filename) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Close modal
     */
    function close() {
        const overlay = document.getElementById('exportModalOverlay');
        if (overlay) {
            overlay.style.animation = 'fadeOut 0.2s ease';
            setTimeout(() => overlay.remove(), 200);
        }
        isExporting = false;
    }

    // Add spinning animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .spinning {
            animation: spin 1s linear infinite;
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Public API
    return {
        show,
        close,
        selectFormat,
        selectQuality,
        selectSocialPreset,
        selectPages,
        startExport,
        FORMATS,
        SOCIAL_PRESETS,
        isLoaded: true
    };
})();

// Export globally
window.ExportModal = ExportModal;

// Hook into export button
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            // Remove old click handler and add new one
            exportBtn.onclick = (e) => {
                e.preventDefault();
                ExportModal.show();
            };
            console.log('[ExportModal] Hooked to export button');
        }
    }, 1000);
});

console.log('[ExportModal] Loaded - Multi-format export ready');
