/**
 * AI Background Removal Integration
 * Frontend component for removing image backgrounds
 */
const BackgroundRemoval = (function() {
    'use strict';

    const API_ENDPOINT = '/api/remove-background';

    // State
    let isProcessing = false;
    let currentModal = null;

    /**
     * Remove background from an image element
     */
    async function removeBackground(imageElement, options = {}) {
        if (isProcessing) {
            console.warn('Background removal already in progress');
            return null;
        }

        const {
            alphaMatting = false,
            foregroundThreshold = 240,
            backgroundThreshold = 10,
            onProgress = null
        } = options;

        isProcessing = true;

        try {
            // Get image source
            const img = imageElement.querySelector('img') || imageElement;
            const src = img.src;

            if (!src) {
                throw new Error('No image source found');
            }

            if (onProgress) onProgress('Converting image...', 10);

            // Convert image to base64
            const base64 = await imageToBase64(src);

            if (onProgress) onProgress('Removing background...', 30);

            // Call API
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image_base64: base64,
                    alpha_matting: alphaMatting,
                    foreground_threshold: foregroundThreshold,
                    background_threshold: backgroundThreshold
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Background removal failed');
            }

            if (onProgress) onProgress('Processing result...', 80);

            const result = await response.json();

            if (onProgress) onProgress('Complete!', 100);

            return {
                imageBase64: `data:image/png;base64,${result.image_base64}`,
                metadata: result.metadata
            };

        } catch (error) {
            console.error('Background removal error:', error);
            throw error;
        } finally {
            isProcessing = false;
        }
    }

    /**
     * Convert image URL to base64
     */
    async function imageToBase64(src) {
        return new Promise((resolve, reject) => {
            // If already base64
            if (src.startsWith('data:')) {
                resolve(src);
                return;
            }

            // Create canvas to convert
            const img = new Image();
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                try {
                    const base64 = canvas.toDataURL('image/png');
                    resolve(base64);
                } catch (e) {
                    reject(new Error('Failed to convert image to base64'));
                }
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = src;
        });
    }

    /**
     * Show background removal modal
     */
    function showModal(imageElement, onComplete) {
        if (currentModal) {
            currentModal.remove();
        }

        const img = imageElement.querySelector('img') || imageElement;

        const modal = document.createElement('div');
        modal.className = 'bg-removal-modal';
        modal.innerHTML = `
            <div class="bg-removal-content">
                <div class="bg-removal-header">
                    <h3>Remove Background</h3>
                    <button class="bg-removal-close">&times;</button>
                </div>

                <div class="bg-removal-preview">
                    <div class="preview-before">
                        <span class="preview-label">Original</span>
                        <img src="${img.src}" alt="Original">
                    </div>
                    <div class="preview-after">
                        <span class="preview-label">Result</span>
                        <div class="preview-placeholder">
                            <span>Click "Remove Background" to see result</span>
                        </div>
                        <img class="result-image" style="display:none;" alt="Result">
                    </div>
                </div>

                <div class="bg-removal-options">
                    <label class="option-row">
                        <input type="checkbox" id="alphaMatting">
                        <span>Soft edges (Alpha Matting)</span>
                        <span class="option-hint">Better for hair/fur, slower</span>
                    </label>
                </div>

                <div class="bg-removal-progress" style="display:none;">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <span class="progress-text">Processing...</span>
                </div>

                <div class="bg-removal-actions">
                    <button class="btn-secondary bg-removal-cancel">Cancel</button>
                    <button class="btn-primary bg-removal-start">
                        <span class="btn-icon">✨</span>
                        Remove Background
                    </button>
                    <button class="btn-primary bg-removal-apply" style="display:none;">
                        Apply Result
                    </button>
                </div>

                <div class="bg-removal-error" style="display:none;"></div>
            </div>
        `;

        // Event handlers
        const closeBtn = modal.querySelector('.bg-removal-close');
        const cancelBtn = modal.querySelector('.bg-removal-cancel');
        const startBtn = modal.querySelector('.bg-removal-start');
        const applyBtn = modal.querySelector('.bg-removal-apply');
        const progressEl = modal.querySelector('.bg-removal-progress');
        const progressFill = modal.querySelector('.progress-fill');
        const progressText = modal.querySelector('.progress-text');
        const errorEl = modal.querySelector('.bg-removal-error');
        const resultImg = modal.querySelector('.result-image');
        const placeholder = modal.querySelector('.preview-placeholder');
        const alphaMatting = modal.querySelector('#alphaMatting');

        let resultBase64 = null;

        const close = () => {
            modal.remove();
            currentModal = null;
        };

        closeBtn.onclick = close;
        cancelBtn.onclick = close;

        modal.onclick = (e) => {
            if (e.target === modal) close();
        };

        startBtn.onclick = async () => {
            startBtn.disabled = true;
            startBtn.innerHTML = '<span class="btn-icon">⏳</span> Processing...';
            progressEl.style.display = 'block';
            errorEl.style.display = 'none';

            try {
                const result = await removeBackground(imageElement, {
                    alphaMatting: alphaMatting.checked,
                    onProgress: (text, percent) => {
                        progressText.textContent = text;
                        progressFill.style.width = `${percent}%`;
                    }
                });

                resultBase64 = result.imageBase64;
                resultImg.src = resultBase64;
                resultImg.style.display = 'block';
                placeholder.style.display = 'none';

                startBtn.style.display = 'none';
                applyBtn.style.display = 'inline-flex';
                progressEl.style.display = 'none';

            } catch (error) {
                errorEl.textContent = error.message || 'Failed to remove background';
                errorEl.style.display = 'block';
                progressEl.style.display = 'none';
                startBtn.disabled = false;
                startBtn.innerHTML = '<span class="btn-icon">✨</span> Retry';
            }
        };

        applyBtn.onclick = () => {
            if (resultBase64 && onComplete) {
                onComplete(resultBase64);
            }
            close();
        };

        document.body.appendChild(modal);
        currentModal = modal;

        return modal;
    }

    /**
     * Quick remove - no modal, just process
     */
    async function quickRemove(imageElement, onProgress) {
        const result = await removeBackground(imageElement, { onProgress });
        if (result) {
            const img = imageElement.querySelector('img') || imageElement;
            img.src = result.imageBase64;
        }
        return result;
    }

    /**
     * Check if service is available
     */
    async function checkAvailability() {
        try {
            const response = await fetch('/health');
            const data = await response.json();
            return data.status === 'ok';
        } catch {
            return false;
        }
    }

    /**
     * Initialize styles
     */
    function init() {
        if (document.getElementById('bg-removal-styles')) return;

        const style = document.createElement('style');
        style.id = 'bg-removal-styles';
        style.textContent = `
            .bg-removal-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10002;
                backdrop-filter: blur(4px);
            }

            .bg-removal-content {
                background: #1a1a2e;
                border-radius: 16px;
                width: 90%;
                max-width: 700px;
                max-height: 90vh;
                overflow: auto;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            }

            .bg-removal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .bg-removal-header h3 {
                margin: 0;
                color: #fff;
                font-size: 18px;
            }

            .bg-removal-close {
                background: none;
                border: none;
                color: #888;
                font-size: 28px;
                cursor: pointer;
                line-height: 1;
                padding: 0;
            }

            .bg-removal-close:hover {
                color: #fff;
            }

            .bg-removal-preview {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                padding: 20px;
            }

            .preview-before,
            .preview-after {
                position: relative;
                background: repeating-conic-gradient(#333 0% 25%, #444 0% 50%) 50% / 20px 20px;
                border-radius: 12px;
                overflow: hidden;
                aspect-ratio: 4/3;
            }

            .preview-label {
                position: absolute;
                top: 10px;
                left: 10px;
                background: rgba(0,0,0,0.7);
                color: #fff;
                padding: 4px 10px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1;
            }

            .preview-before img,
            .preview-after img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }

            .preview-placeholder {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                color: #666;
                font-size: 13px;
                text-align: center;
                padding: 20px;
            }

            .bg-removal-options {
                padding: 0 20px 15px;
            }

            .option-row {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #fff;
                font-size: 14px;
                cursor: pointer;
            }

            .option-row input[type="checkbox"] {
                width: 18px;
                height: 18px;
                accent-color: #6c5ce7;
            }

            .option-hint {
                color: #666;
                font-size: 12px;
            }

            .bg-removal-progress {
                padding: 0 20px 15px;
            }

            .progress-bar {
                height: 6px;
                background: rgba(255,255,255,0.1);
                border-radius: 3px;
                overflow: hidden;
                margin-bottom: 8px;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #6c5ce7, #a855f7);
                border-radius: 3px;
                width: 0%;
                transition: width 0.3s ease;
            }

            .progress-text {
                font-size: 13px;
                color: #888;
            }

            .bg-removal-actions {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                padding: 15px 20px 20px;
                border-top: 1px solid rgba(255,255,255,0.1);
            }

            .bg-removal-actions button {
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: all 0.2s;
            }

            .bg-removal-actions .btn-secondary {
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                color: #aaa;
            }

            .bg-removal-actions .btn-secondary:hover {
                background: rgba(255,255,255,0.1);
                color: #fff;
            }

            .bg-removal-actions .btn-primary {
                background: linear-gradient(135deg, #6c5ce7, #a855f7);
                border: none;
                color: #fff;
            }

            .bg-removal-actions .btn-primary:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 15px rgba(108,92,231,0.4);
            }

            .bg-removal-actions .btn-primary:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }

            .bg-removal-error {
                margin: 0 20px 15px;
                padding: 12px;
                background: rgba(220,53,69,0.2);
                border: 1px solid rgba(220,53,69,0.3);
                border-radius: 8px;
                color: #ff6b6b;
                font-size: 13px;
            }

            @media (max-width: 600px) {
                .bg-removal-preview {
                    grid-template-columns: 1fr;
                }
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

    // Public API
    return {
        init,
        removeBackground,
        showModal,
        quickRemove,
        checkAvailability,
        isProcessing: () => isProcessing,
        isLoaded: true
    };
})();

// Global export
window.BackgroundRemoval = BackgroundRemoval;
