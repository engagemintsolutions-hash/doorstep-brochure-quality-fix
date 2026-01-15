/**
 * Text Regeneration System
 *
 * Features:
 * - Per-text-block regeneration with credit tracking
 * - 3 free regenerations per text block
 * - Cost: £0.003 per regeneration after free limit
 * - Visual feedback and comparison modal
 *
 * Author: Claude Code
 * Date: October 16, 2025
 */

// ============================================
// GLOBAL STATE
// ============================================

window.textRegenerationSystem = {
    // Track regenerations per text block
    tracking: {}, // { textBlockId: { count: 0, timestamps: [], lastText: '' } }

    // Configuration
    config: {
        freeLimit: 3,
        costPerRegen: 0.003, // £0.003 per regeneration
        maxLength: 1000, // Max characters to regenerate
    },

    // Current regeneration in progress
    currentRegen: null
};

// ============================================
// CORE FUNCTIONS
// ============================================

/**
 * Initialize text regeneration buttons on all editable text blocks
 */
function initializeTextRegenerationButtons() {
    console.log('📝 Initializing text regeneration system...');

    // Find all editable text blocks in brochure pages
    const editableBlocks = document.querySelectorAll('.editable[data-field="description"], .editable[data-field="intro"]');

    editableBlocks.forEach((block, index) => {
        // Create unique ID if not exists
        if (!block.dataset.textId) {
            block.dataset.textId = `text-${Date.now()}-${index}`;
        }

        // Add regenerate button
        addRegenerateButtonToBlock(block);
    });

    console.log(`✅ Added regenerate buttons to ${editableBlocks.length} text blocks`);
}

/**
 * Add regenerate button to a text block
 */
function addRegenerateButtonToBlock(textBlock) {
    const textId = textBlock.dataset.textId;

    // Check if button already exists
    if (textBlock.parentElement.querySelector('.text-regen-btn')) {
        return;
    }

    // Create button container
    const btnContainer = document.createElement('div');
    btnContainer.className = 'text-regen-container';
    btnContainer.style.cssText = `
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        opacity: 0;
        transition: opacity 0.2s;
        z-index: 100;
    `;

    // Create regenerate button
    const regenBtn = document.createElement('button');
    regenBtn.className = 'text-regen-btn';
    regenBtn.innerHTML = '✨ Regenerate';
    regenBtn.style.cssText = `
        padding: 0.5rem 1rem;
        background: linear-gradient(135deg, #00CED1 0%, #20B2AA 100%);
        color: white;
        border: none;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,206,209,0.3);
        transition: all 0.2s;
        white-space: nowrap;
    `;

    regenBtn.onmouseover = () => {
        regenBtn.style.transform = 'translateY(-2px)';
        regenBtn.style.boxShadow = '0 4px 12px rgba(0,206,209,0.5)';
    };

    regenBtn.onmouseout = () => {
        regenBtn.style.transform = 'translateY(0)';
        regenBtn.style.boxShadow = '0 2px 8px rgba(0,206,209,0.3)';
    };

    regenBtn.onclick = (e) => {
        e.stopPropagation();
        regenerateTextBlock(textId);
    };

    // Create usage counter
    const usageCounter = document.createElement('div');
    usageCounter.className = 'regen-usage-counter';
    usageCounter.dataset.textId = textId;
    usageCounter.style.cssText = `
        font-size: 0.75rem;
        color: #6c757d;
        background: white;
        padding: 0.25rem 0.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        text-align: center;
    `;
    updateUsageCounter(textId, usageCounter);

    btnContainer.appendChild(regenBtn);
    btnContainer.appendChild(usageCounter);

    // Make parent position relative
    textBlock.parentElement.style.position = 'relative';

    // Show on hover
    textBlock.parentElement.addEventListener('mouseenter', () => {
        btnContainer.style.opacity = '1';
    });
    textBlock.parentElement.addEventListener('mouseleave', () => {
        btnContainer.style.opacity = '0';
    });

    textBlock.parentElement.appendChild(btnContainer);
}

/**
 * Update usage counter display
 */
function updateUsageCounter(textId, counterElement) {
    const tracking = window.textRegenerationSystem.tracking[textId] || { count: 0 };
    const freeLimit = window.textRegenerationSystem.config.freeLimit;

    if (tracking.count === 0) {
        counterElement.innerHTML = `🔄 <strong>${freeLimit}</strong> free left`;
        counterElement.style.color = '#28a745';
    } else if (tracking.count < freeLimit) {
        const remaining = freeLimit - tracking.count;
        counterElement.innerHTML = `🔄 <strong>${remaining}</strong> free left`;
        counterElement.style.color = remaining > 1 ? '#28a745' : '#ffc107';
    } else {
        counterElement.innerHTML = `💳 Using credits`;
        counterElement.style.color = '#dc3545';
    }
}

/**
 * Main regeneration function
 */
async function regenerateTextBlock(textId) {
    console.log(`🔄 Regenerating text block: ${textId}`);

    // Get text block element
    const textBlock = document.querySelector(`[data-text-id="${textId}"]`);
    if (!textBlock) {
        console.error('Text block not found:', textId);
        showToast('error', '❌ Text block not found');
        return;
    }

    // Get current text
    const currentText = textBlock.textContent.trim();
    if (!currentText || currentText.length < 10) {
        showToast('warning', '⚠️ Text too short to regenerate');
        return;
    }

    // Initialize tracking if not exists
    if (!window.textRegenerationSystem.tracking[textId]) {
        window.textRegenerationSystem.tracking[textId] = {
            count: 0,
            timestamps: [],
            lastText: currentText
        };
    }

    const tracking = window.textRegenerationSystem.tracking[textId];
    const freeLimit = window.textRegenerationSystem.config.freeLimit;

    // Check if exceeding free limit
    if (tracking.count >= freeLimit) {
        const confirmed = await confirmCreditUsage(tracking.count - freeLimit + 1);
        if (!confirmed) {
            return;
        }
    }

    // Increment count
    tracking.count++;
    tracking.timestamps.push(new Date().toISOString());

    // Update counter
    const counter = document.querySelector(`.regen-usage-counter[data-text-id="${textId}"]`);
    if (counter) {
        updateUsageCounter(textId, counter);
    }

    // Show loading state
    const originalHTML = textBlock.innerHTML;
    textBlock.innerHTML = '<div style="opacity: 0.5; text-align: center; padding: 2rem;">🤖 AI is regenerating your text...<br><small>This may take a few seconds</small></div>';
    textBlock.contentEditable = 'false';

    try {
        // Get context from page
        const pageElement = textBlock.closest('[data-page-index]');
        const pageIndex = pageElement ? parseInt(pageElement.dataset.pageIndex) : 0;
        const page = window.brochureData?.pages?.[pageIndex];

        // Call API
        const response = await fetch('/generate-text-variant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                original_text: currentText,
                context: {
                    page_name: page?.name || 'Unknown',
                    page_layout: page?.layout || 'standard',
                    property_type: window.brochureData?.property?.propertyType || 'house',
                    property_address: window.brochureData?.property?.address || '',
                    tone: 'professional',
                    max_length: window.textRegenerationSystem.config.maxLength
                },
                user_email: window.userEmail || 'demo@savills.com'
            })
        });

        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        // Restore original if API returned empty
        if (!result.text || result.text.trim().length < 10) {
            throw new Error('API returned empty or invalid text');
        }

        // Show comparison modal
        await showRegenerationComparison({
            textId: textId,
            original: currentText,
            regenerated: result.text,
            onAccept: () => {
                textBlock.textContent = result.text;
                textBlock.contentEditable = 'true';
                tracking.lastText = result.text;
                saveToUndoStack();
                showToast('success', '✅ Text updated successfully');
            },
            onReject: () => {
                textBlock.innerHTML = originalHTML;
                textBlock.contentEditable = 'true';
                tracking.count--; // Rollback count
                tracking.timestamps.pop();

                // Update counter
                if (counter) {
                    updateUsageCounter(textId, counter);
                }
                showToast('info', 'Original text restored');
            }
        });

    } catch (error) {
        console.error('Regeneration failed:', error);
        textBlock.innerHTML = originalHTML;
        textBlock.contentEditable = 'true';

        // Rollback tracking
        tracking.count--;
        tracking.timestamps.pop();

        // Update counter
        if (counter) {
            updateUsageCounter(textId, counter);
        }

        showToast('error', `❌ Failed: ${error.message}`);
    }
}

/**
 * Show credit usage confirmation modal
 */
function confirmCreditUsage(regenNumber) {
    return new Promise((resolve) => {
        const cost = window.textRegenerationSystem.config.costPerRegen;
        const totalCost = (cost * regenNumber).toFixed(3);

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(4px);
        `;

        modal.innerHTML = `
            <div class="modal-content" style="max-width: 450px; background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">💳</div>
                    <h3 style="margin: 0; color: #2c3e50; font-size: 1.5rem;">Credit Usage</h3>
                </div>

                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; border-left: 4px solid #00CED1;">
                    <p style="margin: 0 0 0.5rem 0; color: #495057; font-size: 0.95rem;">
                        You've used your <strong>3 free regenerations</strong> for this text block.
                    </p>
                    <p style="margin: 0; color: #495057; font-size: 0.95rem;">
                        <strong>Cost:</strong> ~£${cost.toFixed(3)} per regeneration<br>
                        <strong>This regeneration:</strong> Regeneration #${regenNumber + 3}
                    </p>
                </div>

                <div style="background: #e8f4f8; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                    <p style="margin: 0; font-size: 0.85rem; color: #00695c;">
                        <strong>💡 Tip:</strong> You can still edit text manually for free. Only use regeneration if you need fresh AI-generated content.
                    </p>
                </div>

                <div style="display: flex; gap: 1rem;">
                    <button class="btn-cancel" style="flex: 1; padding: 0.75rem; border: 2px solid #dee2e6; background: white; color: #6c757d; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s;">
                        Cancel
                    </button>
                    <button class="btn-confirm" style="flex: 1; padding: 0.75rem; border: none; background: linear-gradient(135deg, #00CED1 0%, #20B2AA 100%); color: white; border-radius: 8px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,206,209,0.3);">
                        Continue (Use Credit)
                    </button>
                </div>
            </div>
        `;

        const cancelBtn = modal.querySelector('.btn-cancel');
        const confirmBtn = modal.querySelector('.btn-confirm');

        cancelBtn.onclick = () => {
            modal.remove();
            resolve(false);
        };

        confirmBtn.onclick = () => {
            modal.remove();
            resolve(true);
        };

        document.body.appendChild(modal);
    });
}

/**
 * Show comparison modal for original vs regenerated text
 */
function showRegenerationComparison({ textId, original, regenerated, onAccept, onReject }) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(4px);
            overflow-y: auto;
            padding: 2rem;
        `;

        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px; width: 100%; background: white; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-height: 90vh; display: flex; flex-direction: column;">
                <div style="padding: 2rem; border-bottom: 2px solid #e9ecef;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <h3 style="margin: 0; color: #2c3e50; font-size: 1.5rem;">✨ AI Regenerated Text</h3>
                            <p style="margin: 0.5rem 0 0 0; color: #6c757d; font-size: 0.9rem;">Compare and choose the version you prefer</p>
                        </div>
                        <button class="btn-close" style="background: none; border: none; font-size: 2rem; color: #adb5bd; cursor: pointer; width: 40px; height: 40px; border-radius: 50%; transition: all 0.2s; line-height: 1;">×</button>
                    </div>
                </div>

                <div style="flex: 1; overflow-y: auto; padding: 2rem;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <!-- Original Text -->
                        <div style="background: #f8f9fa; border-radius: 12px; padding: 1.5rem; border: 2px solid #dee2e6;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                                <span style="font-size: 1.25rem;">📄</span>
                                <h4 style="margin: 0; color: #495057; font-size: 1.1rem;">Original</h4>
                            </div>
                            <div style="color: #495057; line-height: 1.7; font-size: 0.95rem; max-height: 400px; overflow-y: auto;">
                                ${escapeHtml(original)}
                            </div>
                            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #dee2e6; font-size: 0.85rem; color: #6c757d;">
                                ${original.split(/\s+/).length} words
                            </div>
                        </div>

                        <!-- Regenerated Text -->
                        <div style="background: linear-gradient(135deg, #e3f2fd 0%, #e8f5e9 100%); border-radius: 12px; padding: 1.5rem; border: 2px solid #00CED1;">
                            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                                <span style="font-size: 1.25rem;">✨</span>
                                <h4 style="margin: 0; color: #00695c; font-size: 1.1rem;">AI Regenerated</h4>
                                <span style="background: #00CED1; color: white; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">NEW</span>
                            </div>
                            <div style="color: #2c3e50; line-height: 1.7; font-size: 0.95rem; max-height: 400px; overflow-y: auto;">
                                ${escapeHtml(regenerated)}
                            </div>
                            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(0,206,209,0.3); font-size: 0.85rem; color: #00695c;">
                                ${regenerated.split(/\s+/).length} words
                            </div>
                        </div>
                    </div>
                </div>

                <div style="padding: 2rem; border-top: 2px solid #e9ecef; background: #f8f9fa; border-radius: 0 0 16px 16px;">
                    <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                        <button class="btn-reject" style="padding: 0.75rem 2rem; border: 2px solid #dee2e6; background: white; color: #6c757d; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s;">
                            Keep Original
                        </button>
                        <button class="btn-accept" style="padding: 0.75rem 2rem; border: none; background: linear-gradient(135deg, #00CED1 0%, #20B2AA 100%); color: white; border-radius: 8px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,206,209,0.3);">
                            ✓ Use Regenerated
                        </button>
                    </div>
                </div>
            </div>
        `;

        const closeBtn = modal.querySelector('.btn-close');
        const rejectBtn = modal.querySelector('.btn-reject');
        const acceptBtn = modal.querySelector('.btn-accept');

        closeBtn.onmouseover = () => closeBtn.style.background = '#f8f9fa';
        closeBtn.onmouseout = () => closeBtn.style.background = 'none';

        closeBtn.onclick = () => {
            modal.remove();
            onReject();
            resolve(false);
        };

        rejectBtn.onclick = () => {
            modal.remove();
            onReject();
            resolve(false);
        };

        acceptBtn.onclick = () => {
            modal.remove();
            onAccept();
            resolve(true);
        };

        document.body.appendChild(modal);
    });
}

/**
 * Escape HTML for safe display
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Save to undo stack (use existing function if available)
 */
function saveToUndoStack() {
    if (typeof saveBrochureData === 'function') {
        saveBrochureData();
    } else if (typeof window.saveBrochureState === 'function') {
        window.saveBrochureState();
    }
}

/**
 * Show toast notification (use existing function if available)
 */
function showToast(type, message) {
    // Use brochure editor's existing toast system
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

// ============================================
// AUTO-INITIALIZATION
// ============================================

// Wait for brochure to load, then initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeTextRegenerationButtons, 1000);
    });
} else {
    setTimeout(initializeTextRegenerationButtons, 1000);
}

// Re-initialize when pages are re-rendered
const originalRenderBrochureForText = window.renderBrochure;
if (originalRenderBrochureForText && typeof originalRenderBrochureForText === 'function') {
    window.renderBrochure = function(...args) {
        const result = originalRenderBrochureForText.apply(this, args);
        setTimeout(initializeTextRegenerationButtons, 500);
        return result;
    };
}

console.log('📝 Text Regeneration System loaded');
