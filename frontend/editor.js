// Property Listing Generator - Editor JavaScript

const API_BASE = '';  // Same origin

// State
let editorData = null;
let selectedVariantForExport = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadEditorData();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    document.getElementById('backBtn').addEventListener('click', () => {
        window.location.href = '/static/index.html';
    });
    
    // Export panel listeners
    document.getElementById('exportTextBtn').addEventListener('click', exportAsText);
    document.getElementById('exportJsonBtn').addEventListener('click', exportAsJson);
    document.getElementById('closeExportBtn').addEventListener('click', () => {
        document.getElementById('exportPanel').style.display = 'none';
    });
}

// Load Editor Data from sessionStorage
function loadEditorData() {
    const storedData = sessionStorage.getItem('generatedListings');
    
    if (!storedData) {
        showNoDataMessage();
        return;
    }
    
    try {
        editorData = JSON.parse(storedData);
        
        // Check if data is stale (> 1 hour)
        const hourAgo = Date.now() - (60 * 60 * 1000);
        if (editorData.timestamp < hourAgo) {
            console.warn('Data is stale, but loading anyway');
        }
        
        renderEditor();
    } catch (error) {
        console.error('Failed to parse editor data:', error);
        showNoDataMessage();
    }
}

// Show No Data Message
function showNoDataMessage() {
    document.getElementById('variantsGrid').style.display = 'none';
    document.getElementById('noDataMessage').style.display = 'block';
}

// Render Editor
function renderEditor() {
    if (!editorData || !editorData.variants) {
        showNoDataMessage();
        return;
    }
    
    // Populate header meta
    const headerMeta = document.getElementById('headerMeta');
    headerMeta.innerHTML = `
        <span>Channel: <strong>${editorData.metadata.channel}</strong></span>
        <span>•</span>
        <span>Tone: <strong>${editorData.metadata.tone}</strong></span>
        <span>•</span>
        <span>Target: <strong>${editorData.metadata.target_words || 'N/A'} words</strong></span>
    `;
    
    // Render variant cards
    const variantsGrid = document.getElementById('variantsGrid');
    variantsGrid.innerHTML = '';
    
    editorData.variants.forEach((variant, index) => {
        const card = createVariantCard(variant, index);
        variantsGrid.appendChild(card);
    });
    
    // Initialize counters for all variants
    editorData.variants.forEach((_, index) => {
        updateCounters(index);
    });
    
    // Show grid
    variantsGrid.style.display = 'grid';
}

// Create Variant Card
function createVariantCard(variant, index) {
    const card = document.createElement('div');
    card.className = 'variant-card';
    card.dataset.variantIndex = index;
    
    // Get target ranges from metadata
    const targetRanges = editorData.metadata.target_ranges || {};
    const targetWords = editorData.metadata.target_words || 150;
    
    card.innerHTML = `
        <div class="variant-header">
            <h3>Variant ${variant.variant_id}</h3>
            <div class="variant-score">Score: ${(variant.score * 100).toFixed(0)}%</div>
        </div>
        
        <div class="counters-summary" data-counters="${index}">
            <span class="counter-item">
                <strong>Total:</strong> 
                <span class="total-words">0</span> words / 
                <span class="total-chars">0</span> chars
            </span>
        </div>
        
        <!-- Headline Section -->
        <div class="editable-section">
            <label>
                Headline
                <span class="section-hint">(target: 50-90 chars)</span>
            </label>
            <textarea 
                class="headline-input" 
                data-section="headline" 
                data-variant="${index}"
                rows="2"
            >${escapeHtml(variant.headline)}</textarea>
            <div class="section-counter" data-counter="headline-${index}">
                0 chars
            </div>
        </div>
        
        <!-- Full Text Section -->
        <div class="editable-section">
            <label>
                Full Text
                <span class="section-hint">(target: ${targetWords} words)</span>
            </label>
            <textarea 
                class="fulltext-input" 
                data-section="full_text" 
                data-variant="${index}"
                rows="12"
            >${escapeHtml(variant.full_text)}</textarea>
            <div class="section-counter" data-counter="fulltext-${index}">
                0 words
            </div>
        </div>
        
        <!-- Key Features -->
        <div class="features-section">
            <label>Key Features (${variant.key_features.length})</label>
            <ul class="features-list">
                ${variant.key_features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
            </ul>
        </div>
        
        <!-- Shrink Button -->
        <button class="shrink-btn" data-variant="${index}">
            📉 Shrink to Fit (${targetWords} words)
        </button>
        
        <!-- Hygiene Panel -->
        <div class="hygiene-panel" data-variant="${index}">
            <h4>📋 Hygiene Check</h4>
            ${renderHygieneContent(index)}
        </div>
    `;
    
    // Attach event listeners
    attachCardEventListeners(card, index);
    
    return card;
}

// Render Hygiene Content
function renderHygieneContent(variantIndex) {
    if (!editorData.compliance) {
        return '<p class="hygiene-info">No compliance data available.</p>';
    }
    
    const compliance = editorData.compliance;
    const warnings = compliance.warnings || [];
    const keywordCoverage = compliance.keyword_coverage || {};
    const missingKeywords = keywordCoverage.missing_keywords || [];
    
    let html = '';
    
    // Compliance Score
    html += `<div class="compliance-score">
        <span>Compliance Score: </span>
        <strong class="${compliance.compliance_score >= 0.7 ? 'score-good' : 'score-warning'}">
            ${(compliance.compliance_score * 100).toFixed(0)}%
        </strong>
    </div>`;
    
    // Warnings
    if (warnings.length > 0) {
        html += '<div class="warnings-section">';
        html += '<h5>⚠️ Warnings</h5>';
        html += '<ul class="warnings-list">';
        warnings.forEach(w => {
            html += `<li class="warning-${w.severity}">
                <strong>${w.severity.toUpperCase()}:</strong> ${escapeHtml(w.message)}
                ${w.suggestion ? `<br><em>→ ${escapeHtml(w.suggestion)}</em>` : ''}
            </li>`;
        });
        html += '</ul></div>';
    }
    
    // Missing Keywords
    if (missingKeywords.length > 0) {
        html += '<div class="missing-keywords-section">';
        html += '<h5>🔍 Missing Keywords</h5>';
        html += '<div class="keyword-tags">';
        missingKeywords.forEach(kw => {
            html += `<span class="keyword-tag missing">${escapeHtml(kw)}</span>`;
        });
        html += '</div>';
        html += '</div>';
    }
    
    // Covered Keywords
    const coveredKeywords = keywordCoverage.covered_keywords || [];
    if (coveredKeywords.length > 0) {
        html += '<div class="covered-keywords-section">';
        html += '<h5>✅ Covered Keywords</h5>';
        html += '<div class="keyword-tags">';
        coveredKeywords.forEach(kw => {
            html += `<span class="keyword-tag covered">${escapeHtml(kw)}</span>`;
        });
        html += '</div>';
        html += '</div>';
    }
    
    // No issues
    if (warnings.length === 0 && missingKeywords.length === 0) {
        html += '<p class="hygiene-success">✅ No issues detected. Listing looks great!</p>';
    }
    
    return html;
}

// Attach Card Event Listeners
function attachCardEventListeners(card, index) {
    // Live counter updates
    const textareas = card.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', debounce(() => {
            updateCounters(index);
        }, 300));
    });
    
    // Shrink button
    const shrinkBtn = card.querySelector('.shrink-btn');
    shrinkBtn.addEventListener('click', () => {
        shrinkVariant(index);
    });
}

// Update Counters
function updateCounters(variantIndex) {
    const card = document.querySelector(`.variant-card[data-variant-index="${variantIndex}"]`);
    if (!card) return;
    
    // Get textareas
    const headlineInput = card.querySelector('.headline-input');
    const fulltextInput = card.querySelector('.fulltext-input');
    
    // Count headline (characters)
    const headlineText = headlineInput.value;
    const headlineChars = headlineText.length;
    const headlineCounter = card.querySelector(`[data-counter="headline-${variantIndex}"]`);
    
    const headlineTarget = 90;
    const headlineOverLimit = headlineChars > headlineTarget;
    headlineCounter.innerHTML = `
        <span class="${headlineOverLimit ? 'over-limit' : ''}">${headlineChars} chars</span>
        ${headlineOverLimit ? ' <span class="warning-icon">⚠️</span>' : ''}
    `;
    
    // Count full text (words)
    const fulltextText = fulltextInput.value;
    const fulltextWords = countWords(fulltextText);
    const fulltextChars = fulltextText.length;
    const fulltextCounter = card.querySelector(`[data-counter="fulltext-${variantIndex}"]`);
    
    const targetWords = editorData.metadata.target_words || 150;
    const hardCap = editorData.metadata.hard_cap || 300;
    const fulltextOverLimit = fulltextWords > hardCap;
    
    fulltextCounter.innerHTML = `
        <span class="${fulltextOverLimit ? 'over-limit' : ''}">${fulltextWords} words</span>
        ${fulltextOverLimit ? ` <span class="warning-icon">⚠️ Over ${hardCap}</span>` : ''}
    `;
    
    // Update total counters
    const totalWords = fulltextWords;
    const totalChars = headlineChars + fulltextChars;
    
    const countersSummary = card.querySelector(`[data-counters="${variantIndex}"]`);
    countersSummary.querySelector('.total-words').textContent = totalWords;
    countersSummary.querySelector('.total-chars').textContent = totalChars;
}

// Shrink Variant
async function shrinkVariant(variantIndex) {
    const card = document.querySelector(`.variant-card[data-variant-index="${variantIndex}"]`);
    if (!card) return;
    
    const fulltextInput = card.querySelector('.fulltext-input');
    const text = fulltextInput.value;
    const targetWords = editorData.metadata.target_words || 150;
    
    // Show loading state
    const shrinkBtn = card.querySelector('.shrink-btn');
    const originalBtnText = shrinkBtn.textContent;
    shrinkBtn.disabled = true;
    shrinkBtn.textContent = '⏳ Shrinking...';
    
    try {
        const response = await fetch(`${API_BASE}/shrink`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                target_words: targetWords,
                tone: editorData.metadata.tone,
                channel: editorData.metadata.channel,
                preserve_keywords: editorData.compliance?.keyword_coverage?.covered_keywords || []
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Shrink failed');
        }
        
        const data = await response.json();
        
        // Update textarea with compressed text
        fulltextInput.value = data.compressed_text;
        
        // Update counters
        updateCounters(variantIndex);
        
        // Show success feedback
        showNotification(
            `Compressed from ${data.original_word_count} to ${data.compressed_word_count} words (${(data.compression_ratio * 100).toFixed(0)}%)`,
            'success'
        );
        
    } catch (error) {
        console.error('Shrink error:', error);
        showNotification(`Error: ${error.message}`, 'error');
    } finally {
        // Reset button
        shrinkBtn.disabled = false;
        shrinkBtn.textContent = originalBtnText;
    }
}

// Export Functions
function openExportPanel() {
    const exportPanel = document.getElementById('exportPanel');
    const exportVariantSelect = document.getElementById('exportVariantSelect');
    
    // Populate variant selection
    exportVariantSelect.innerHTML = '';
    editorData.variants.forEach((variant, index) => {
        const radio = document.createElement('label');
        radio.className = 'export-variant-option';
        radio.innerHTML = `
            <input type="radio" name="exportVariant" value="${index}" ${index === 0 ? 'checked' : ''}>
            <span>Variant ${variant.variant_id} - ${variant.headline.substring(0, 50)}...</span>
        `;
        exportVariantSelect.appendChild(radio);
    });
    
    exportPanel.style.display = 'flex';
}

function getSelectedVariantIndex() {
    const selected = document.querySelector('input[name="exportVariant"]:checked');
    return selected ? parseInt(selected.value) : 0;
}

function exportAsText() {
    const variantIndex = getSelectedVariantIndex();
    const card = document.querySelector(`.variant-card[data-variant-index="${variantIndex}"]`);
    
    const headline = card.querySelector('.headline-input').value;
    const fullText = card.querySelector('.fulltext-input').value;
    
    const exportText = `${headline}\n\n${fullText}`;
    
    downloadFile(`variant-${variantIndex + 1}.txt`, exportText, 'text/plain');
    showNotification('Variant exported as text', 'success');
}

function exportAsJson() {
    const variantIndex = getSelectedVariantIndex();
    const card = document.querySelector(`.variant-card[data-variant-index="${variantIndex}"]`);
    
    const headline = card.querySelector('.headline-input').value;
    const fullText = card.querySelector('.fulltext-input').value;
    
    const exportData = {
        variant_id: editorData.variants[variantIndex].variant_id,
        headline: headline,
        full_text: fullText,
        word_count: countWords(fullText),
        metadata: editorData.metadata,
        exported_at: new Date().toISOString()
    };
    
    downloadFile(
        `variant-${variantIndex + 1}.json`,
        JSON.stringify(exportData, null, 2),
        'application/json'
    );
    showNotification('Variant exported as JSON', 'success');
}

// Utility Functions
function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function showNotification(message, type = 'info') {
    // Simple notification (could be enhanced with a toast library)
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function countWords(text) {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add export button click handler
document.addEventListener('DOMContentLoaded', () => {
    // Add export button to header if data loaded
    setTimeout(() => {
        if (editorData && editorData.variants) {
            const headerContent = document.querySelector('.header-content');
            const exportBtn = document.createElement('button');
            exportBtn.className = 'btn-primary';
            exportBtn.textContent = '📦 Export';
            exportBtn.onclick = openExportPanel;
            headerContent.appendChild(exportBtn);
        }
    }, 100);
});
