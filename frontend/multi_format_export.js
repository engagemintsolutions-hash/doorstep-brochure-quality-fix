/**
 * MULTI-FORMAT EXPORT SYSTEM
 *
 * Exports brochure in multiple formats simultaneously:
 * - PDF (original format)
 * - JPEG (optimized for web/email)
 * - PNG (high-quality images)
 * - Web HTML (responsive preview)
 * All packaged in a ZIP file
 *
 * Value: Covers all use cases instantly
 */

console.log('📦 Multi-Format Export loaded');

// Import JSZip library dynamically
let JSZip = null;

// Load JSZip from CDN
function loadJSZip() {
    return new Promise((resolve, reject) => {
        if (typeof window.JSZip !== 'undefined') {
            JSZip = window.JSZip;
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        script.onload = () => {
            JSZip = window.JSZip;
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// ============================================
// MULTI-FORMAT EXPORT
// ============================================

/**
 * Main function to export brochure in multiple formats
 */
async function exportMultipleFormats() {
    try {
        // Show progress modal
        showExportProgressModal();

        // Ensure JSZip is loaded
        await loadJSZip();

        // Create ZIP file
        const zip = new JSZip();

        // Update progress
        updateExportProgress('Generating PDF...', 10);

        // 1. Export PDF (using existing system)
        const pdfBlob = await exportPDFBlob();
        if (pdfBlob) {
            zip.file('brochure.pdf', pdfBlob);
            updateExportProgress('PDF generated successfully', 30);
        }

        // 2. Generate page images (JPEG and PNG)
        updateExportProgress('Generating page images...', 40);
        const pages = window.brochureData?.pages || [];

        if (pages.length > 0) {
            const imagesFolder = zip.folder('images');

            for (let i = 0; i < Math.min(pages.length, 10); i++) {
                const page = pages[i];

                try {
                    // Generate JPEG (compressed, smaller file size)
                    const jpegBlob = await generatePageImage(page, 'jpeg', 0.85);
                    if (jpegBlob) {
                        imagesFolder.file(`page_${i + 1}.jpg`, jpegBlob);
                    }

                    // Generate PNG (high quality)
                    const pngBlob = await generatePageImage(page, 'png', 1.0);
                    if (pngBlob) {
                        imagesFolder.file(`page_${i + 1}.png`, pngBlob);
                    }

                    // Update progress
                    const progress = 40 + ((i + 1) / pages.length) * 40;
                    updateExportProgress(`Generated images for page ${i + 1}/${pages.length}`, progress);

                } catch (error) {
                    console.error(`Failed to generate images for page ${i + 1}:`, error);
                }
            }
        }

        // 3. Generate HTML preview
        updateExportProgress('Creating HTML preview...', 85);
        const htmlContent = generateHTMLPreview(pages);
        zip.file('preview.html', htmlContent);

        // 4. Add README
        const readme = generateReadme();
        zip.file('README.txt', readme);

        // Generate ZIP
        updateExportProgress('Packaging files...', 90);
        const zipBlob = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        }, (metadata) => {
            const progress = 90 + (metadata.percent * 0.1);
            updateExportProgress(`Compressing... ${metadata.percent.toFixed(0)}%`, progress);
        });

        // Download ZIP
        updateExportProgress('Download ready!', 100);
        downloadBlob(zipBlob, 'brochure-multi-format.zip');

        // Close modal after short delay
        setTimeout(() => {
            closeExportProgressModal();
            if (typeof showToast === 'function') {
                showToast('success', '✓ Multi-format export complete!');
            }
        }, 1000);

    } catch (error) {
        console.error('Multi-format export failed:', error);
        closeExportProgressModal();

        if (typeof showToast === 'function') {
            showToast('error', `Export failed: ${error.message}`);
        }
    }
}

/**
 * Exports PDF and returns as Blob
 */
async function exportPDFBlob() {
    try {
        // Check if brochure data exists
        if (!window.brochureData || !window.brochureData.pages) {
            throw new Error('No brochure data available');
        }

        // Call backend API to generate PDF
        const response = await fetch('/api/export/brochure', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(window.brochureData)
        });

        if (!response.ok) {
            throw new Error(`PDF generation failed: ${response.statusText}`);
        }

        return await response.blob();

    } catch (error) {
        console.error('PDF export error:', error);
        // Return null to continue with other formats
        return null;
    }
}

/**
 * Generates an image of a single brochure page
 */
async function generatePageImage(page, format = 'jpeg', quality = 0.85) {
    return new Promise((resolve, reject) => {
        try {
            // Create canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set canvas size (A4 aspect ratio at 300 DPI)
            const width = format === 'png' ? 2480 : 1240; // Higher res for PNG
            const height = format === 'png' ? 3508 : 1754;

            canvas.width = width;
            canvas.height = height;

            // White background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);

            // Draw page content
            drawPageToCanvas(ctx, page, width, height);

            // Convert to blob
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to create image blob'));
                    }
                },
                format === 'png' ? 'image/png' : 'image/jpeg',
                quality
            );

        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Draws page content to canvas
 */
function drawPageToCanvas(ctx, page, width, height) {
    try {
        // Margins
        const margin = width * 0.1;
        const contentWidth = width - (margin * 2);
        const contentHeight = height - (margin * 2);

        // Page title
        ctx.fillStyle = '#2c3e50';
        ctx.font = `bold ${width * 0.04}px Arial, sans-serif`;
        ctx.fillText(page.name || 'Page', margin, margin + 40);

        // Draw photos
        let yOffset = margin + 80;
        const photos = page.contentBlocks?.filter(b => b.type === 'photo') || [];

        if (photos.length > 0) {
            const photoHeight = Math.min(contentHeight * 0.6, (contentWidth / photos.length) * 0.75);
            const photoWidth = contentWidth / Math.min(photos.length, 3);

            photos.slice(0, 3).forEach((photoBlock, index) => {
                const x = margin + (index * photoWidth);

                // Draw placeholder
                ctx.fillStyle = '#e0e0e0';
                ctx.fillRect(x, yOffset, photoWidth - 10, photoHeight);

                // Try to load and draw actual photo
                const photoData = window.uploadedPhotos?.find(p =>
                    p.id === photoBlock.photoId || p.name === photoBlock.photoId
                );

                if (photoData && (photoData.dataUrl || photoData.url)) {
                    const img = new Image();
                    img.src = photoData.dataUrl || photoData.url;
                    img.onload = () => {
                        ctx.drawImage(img, x, yOffset, photoWidth - 10, photoHeight);
                    };
                }
            });

            yOffset += photoHeight + 40;
        }

        // Draw text content
        const textBlocks = page.contentBlocks?.filter(b => b.type !== 'photo') || [];
        ctx.fillStyle = '#4a5568';
        ctx.font = `${width * 0.02}px Arial, sans-serif`;

        textBlocks.forEach((block, index) => {
            if (yOffset > height - margin - 100) return; // Stop if running out of space

            ctx.fillStyle = '#2c3e50';
            ctx.font = `bold ${width * 0.025}px Arial, sans-serif`;
            ctx.fillText(block.title || block.type, margin, yOffset);

            yOffset += 30;

            ctx.fillStyle = '#4a5568';
            ctx.font = `${width * 0.02}px Arial, sans-serif`;

            // Wrap text
            const content = String(block.content || '').substring(0, 500);
            const lines = wrapText(ctx, content, contentWidth);

            lines.slice(0, 10).forEach(line => {
                ctx.fillText(line, margin, yOffset);
                yOffset += 25;
            });

            yOffset += 20;
        });

    } catch (error) {
        console.error('Error drawing page to canvas:', error);
    }
}

/**
 * Wraps text to fit within specified width
 */
function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine) {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    });

    if (currentLine) {
        lines.push(currentLine.trim());
    }

    return lines;
}

/**
 * Generates HTML preview of brochure
 */
function generateHTMLPreview(pages) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Brochure Preview</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: #f5f5f5;
            padding: 2rem;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .page {
            padding: 3rem;
            page-break-after: always;
            min-height: 100vh;
        }
        .page-title {
            font-size: 2rem;
            color: #2c3e50;
            margin-bottom: 2rem;
            border-bottom: 3px solid #C20430;
            padding-bottom: 1rem;
        }
        .content-block {
            margin-bottom: 2rem;
        }
        .block-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 0.5rem;
        }
        .block-content {
            color: #4a5568;
            line-height: 1.6;
            white-space: pre-wrap;
        }
        @media print {
            body { background: white; padding: 0; }
            .page { box-shadow: none; min-height: auto; }
        }
    </style>
</head>
<body>
    <div class="container">
        ${pages.map((page, index) => `
            <div class="page">
                <h1 class="page-title">${page.name || `Page ${index + 1}`}</h1>
                ${(page.contentBlocks || []).filter(b => b.type !== 'photo').map(block => `
                    <div class="content-block">
                        <div class="block-title">${block.title || block.type}</div>
                        <div class="block-content">${escapeHtml(block.content || '')}</div>
                    </div>
                `).join('')}
            </div>
        `).join('')}
    </div>
</body>
</html>
    `;

    return html.trim();
}

/**
 * Escapes HTML special characters
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Generates README file content
 */
function generateReadme() {
    const timestamp = new Date().toLocaleString();

    return `PROPERTY BROCHURE - MULTI-FORMAT EXPORT
=====================================

Export Date: ${timestamp}

CONTENTS:
---------
1. brochure.pdf       - Full brochure in PDF format (print-ready)
2. images/            - Individual page images
   - page_*.jpg       - JPEG images (optimized for web/email)
   - page_*.png       - PNG images (high quality, lossless)
3. preview.html       - HTML preview (open in browser)

USAGE RECOMMENDATIONS:
---------------------
- PDF: Use for printing, official documents, and archiving
- JPEG: Use for website, social media, and email attachments
- PNG: Use when you need transparency or highest quality
- HTML: Use for web embedding or quick preview

SPECIFICATIONS:
--------------
- PDF: Vector format, print-ready
- JPEG: 1240x1754px, quality 85%
- PNG: 2480x3508px, lossless compression
- HTML: Responsive, print-friendly

Generated by Property Brochure Generator
For support, visit: https://doorstep.com/support
`;
}

/**
 * Downloads a blob as a file
 */
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

// ============================================
// PROGRESS MODAL
// ============================================

function showExportProgressModal() {
    const modal = document.createElement('div');
    modal.id = 'multiFormatExportModal';
    modal.className = 'multi-export-modal';
    modal.innerHTML = `
        <div class="multi-export-overlay"></div>
        <div class="multi-export-content">
            <div class="multi-export-header">
                <h3>📦 Exporting Multiple Formats</h3>
            </div>
            <div class="multi-export-body">
                <div class="export-progress-bar">
                    <div class="export-progress-fill" id="exportProgressFill"></div>
                </div>
                <p id="exportProgressText">Initializing export...</p>
                <div class="export-formats">
                    <div class="export-format">
                        <span class="format-icon">📄</span>
                        <span>PDF</span>
                    </div>
                    <div class="export-format">
                        <span class="format-icon">🖼️</span>
                        <span>JPEG</span>
                    </div>
                    <div class="export-format">
                        <span class="format-icon">🎨</span>
                        <span>PNG</span>
                    </div>
                    <div class="export-format">
                        <span class="format-icon">🌐</span>
                        <span>HTML</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function updateExportProgress(text, percentage) {
    const progressFill = document.getElementById('exportProgressFill');
    const progressText = document.getElementById('exportProgressText');

    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }

    if (progressText) {
        progressText.textContent = text;
    }
}

function closeExportProgressModal() {
    const modal = document.getElementById('multiFormatExportModal');
    if (modal) {
        modal.remove();
    }
}

// ============================================
// GLOBAL EXPORTS
// ============================================

window.exportMultipleFormats = exportMultipleFormats;

console.log('✅ Multi-Format Export module ready');
