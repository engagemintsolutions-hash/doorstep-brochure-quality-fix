// ============================================================================
// QR CODE GENERATOR
// Generate QR codes for property URLs in brochure editor
// Uses qrcode.js library (loaded via CDN)
// ============================================================================

(function() {
    'use strict';

    // ========================================================================
    // QR CODE GENERATION
    // ========================================================================

    /**
     * Generate a QR code and render it into an element
     * @param {HTMLElement} container - The container element to render QR code into
     * @param {string} url - The URL to encode
     * @param {Object} options - QR code options
     */
    function generateQRCode(container, url, options = {}) {
        if (!container || !url) {
            console.warn('QR Code: Missing container or URL');
            return;
        }

        const width = options.width || container.offsetWidth || 100;
        const height = options.height || container.offsetHeight || 100;
        const foreground = options.foreground || '#000000';
        const background = options.background || '#FFFFFF';

        // Clear container
        container.innerHTML = '';

        // Check if QRCode library is available
        if (typeof QRCode !== 'undefined') {
            // Use qrcode.js library
            try {
                new QRCode(container, {
                    text: url,
                    width: width,
                    height: height,
                    colorDark: foreground,
                    colorLight: background,
                    correctLevel: QRCode.CorrectLevel.M
                });
                console.log('QR Code generated:', url);
            } catch (error) {
                console.error('QR Code generation failed:', error);
                renderFallback(container, url);
            }
        } else {
            // Fallback: Use API service
            renderQRCodeFromAPI(container, url, { width, height, foreground, background });
        }
    }

    /**
     * Render QR code using external API (fallback)
     */
    function renderQRCodeFromAPI(container, url, options) {
        const { width, height, foreground, background } = options;
        const fgColor = foreground.replace('#', '');
        const bgColor = background.replace('#', '');

        // Use QR Server API
        const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${width}x${height}&data=${encodeURIComponent(url)}&color=${fgColor}&bgcolor=${bgColor}`;

        const img = document.createElement('img');
        img.src = apiUrl;
        img.alt = 'QR Code';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';

        img.onerror = () => {
            renderFallback(container, url);
        };

        container.appendChild(img);
        console.log('QR Code generated via API:', url);
    }

    /**
     * Render fallback placeholder if QR generation fails
     */
    function renderFallback(container, url) {
        container.innerHTML = `
            <div class="qrcode-fallback" style="
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: #f5f5f5;
                border: 2px dashed #ccc;
                border-radius: 4px;
                padding: 8px;
                box-sizing: border-box;
            ">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#666" stroke-width="1.5">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                    <rect x="14" y="14" width="3" height="3"/>
                    <rect x="18" y="18" width="3" height="3"/>
                </svg>
                <span style="font-size: 10px; color: #666; margin-top: 4px; text-align: center; word-break: break-all;">
                    QR Code
                </span>
            </div>
        `;
    }

    /**
     * Update QR code URL for an existing element
     */
    function updateQRCodeUrl(elementId, newUrl) {
        const element = document.querySelector(`[data-element-id="${elementId}"]`);
        if (!element) return;

        const pageId = element.closest('.brochure-page')?.dataset.pageId;
        if (!pageId || !EditorState.elements[pageId]) return;

        // Update data
        const elementData = EditorState.elements[pageId].find(el => el.id === elementId);
        if (elementData) {
            elementData.url = newUrl;
        }

        // Re-render QR code
        generateQRCode(element, newUrl, {
            width: element.offsetWidth,
            height: element.offsetHeight,
            foreground: elementData?.foreground,
            background: elementData?.background
        });

        EditorState.isDirty = true;
    }

    /**
     * Show QR code edit dialog
     */
    function showQRCodeEditDialog(elementId) {
        const element = document.querySelector(`[data-element-id="${elementId}"]`);
        if (!element) return;

        const pageId = element.closest('.brochure-page')?.dataset.pageId;
        const elementData = EditorState.elements[pageId]?.find(el => el.id === elementId);

        if (!elementData) return;

        const currentUrl = elementData.url || '';

        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'qrcode-dialog-overlay';
        dialog.innerHTML = `
            <div class="qrcode-dialog">
                <div class="dialog-header">
                    <h3>Edit QR Code</h3>
                    <button class="close-btn" onclick="this.closest('.qrcode-dialog-overlay').remove()">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                <div class="dialog-body">
                    <div class="form-group">
                        <label>URL to encode:</label>
                        <input type="url" id="qrUrlInput" value="${currentUrl}" placeholder="https://..." style="width: 100%; padding: 8px;">
                    </div>
                    <div class="form-group">
                        <label>Foreground Color:</label>
                        <input type="color" id="qrFgColor" value="${elementData.foreground || '#000000'}">
                    </div>
                    <div class="form-group">
                        <label>Background Color:</label>
                        <input type="color" id="qrBgColor" value="${elementData.background || '#FFFFFF'}">
                    </div>
                </div>
                <div class="dialog-footer">
                    <button class="action-btn secondary" onclick="this.closest('.qrcode-dialog-overlay').remove()">Cancel</button>
                    <button class="action-btn primary" id="qrSaveBtn">Save Changes</button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        // Handle save
        dialog.querySelector('#qrSaveBtn').addEventListener('click', () => {
            const newUrl = dialog.querySelector('#qrUrlInput').value;
            const fgColor = dialog.querySelector('#qrFgColor').value;
            const bgColor = dialog.querySelector('#qrBgColor').value;

            // Update element data
            if (pageId && EditorState.elements[pageId]) {
                const data = EditorState.elements[pageId].find(el => el.id === elementId);
                if (data) {
                    data.url = newUrl;
                    data.foreground = fgColor;
                    data.background = bgColor;
                }
            }

            // Re-generate QR code
            generateQRCode(element, newUrl, {
                foreground: fgColor,
                background: bgColor
            });

            EditorState.isDirty = true;
            dialog.remove();

            if (typeof showToast === 'function') {
                showToast('QR Code updated', 'success');
            }
        });

        // Focus input
        dialog.querySelector('#qrUrlInput').focus();
    }

    // ========================================================================
    // ADD DIALOG STYLES
    // ========================================================================

    function addDialogStyles() {
        if (document.getElementById('qrcode-dialog-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'qrcode-dialog-styles';
        styles.textContent = `
            .qrcode-dialog-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10001;
            }

            .qrcode-dialog {
                background: white;
                border-radius: 8px;
                width: 400px;
                max-width: 90vw;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }

            .qrcode-dialog .dialog-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                border-bottom: 1px solid #e5e7eb;
            }

            .qrcode-dialog .dialog-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
            }

            .qrcode-dialog .close-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px;
                color: #6b7280;
            }

            .qrcode-dialog .close-btn:hover {
                color: #111827;
            }

            .qrcode-dialog .dialog-body {
                padding: 20px;
            }

            .qrcode-dialog .form-group {
                margin-bottom: 16px;
            }

            .qrcode-dialog .form-group label {
                display: block;
                margin-bottom: 6px;
                font-weight: 500;
                color: #374151;
            }

            .qrcode-dialog .form-group input[type="url"] {
                border: 1px solid #d1d5db;
                border-radius: 6px;
                font-size: 14px;
            }

            .qrcode-dialog .form-group input[type="color"] {
                width: 50px;
                height: 32px;
                padding: 0;
                border: 1px solid #d1d5db;
                border-radius: 4px;
                cursor: pointer;
            }

            .qrcode-dialog .dialog-footer {
                display: flex;
                justify-content: flex-end;
                gap: 12px;
                padding: 16px 20px;
                border-top: 1px solid #e5e7eb;
            }
        `;

        document.head.appendChild(styles);
    }

    // ========================================================================
    // EXPOSE TO GLOBAL SCOPE
    // ========================================================================

    window.QRCodeGenerator = {
        generate: generateQRCode,
        updateUrl: updateQRCodeUrl,
        showEditDialog: showQRCodeEditDialog
    };

    // Expose for element_drag.js
    window.generateQRCode = generateQRCode;

    // Add styles on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addDialogStyles);
    } else {
        addDialogStyles();
    }

})();
