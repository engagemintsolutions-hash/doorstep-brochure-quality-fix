/**
 * ═══════════════════════════════════════════════════════════════════════
 * API COST TRACKER - Real-time tracking of photo analysis costs
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Tracks Claude API usage for photo analysis and displays costs in UI
 */

console.log('💰 API Cost Tracker loaded');

// Cost constants (Claude 3 Haiku pricing as of Oct 2024)
const COSTS = {
    PHOTO_ANALYSIS: 0.00025,  // $0.00025 per image (Claude Haiku vision)
    TEXT_GENERATION: 0.001,   // $0.001 per brochure (estimate)
    INPUT_TOKEN: 0.00000025,  // $0.25 per million input tokens
    OUTPUT_TOKEN: 0.00000125  // $1.25 per million output tokens
};

// Initialize cost tracking in localStorage
function initCostTracker() {
    if (!localStorage.getItem('apiCostTracker')) {
        const initialData = {
            sessionStart: new Date().toISOString(),
            photosAnalyzed: 0,
            brochuresGenerated: 0,
            totalCost: 0,
            sessionCosts: []
        };
        localStorage.setItem('apiCostTracker', JSON.stringify(initialData));
        console.log('💰 Initialized cost tracker');
    }
    return JSON.parse(localStorage.getItem('apiCostTracker'));
}

// Get current costs
function getCosts() {
    const data = JSON.parse(localStorage.getItem('apiCostTracker')) || initCostTracker();
    return data;
}

// Track photo analysis cost
function trackPhotoAnalysis(photoCount) {
    const data = getCosts();
    const cost = photoCount * COSTS.PHOTO_ANALYSIS;

    data.photosAnalyzed += photoCount;
    data.totalCost += cost;
    data.sessionCosts.push({
        timestamp: new Date().toISOString(),
        type: 'photo_analysis',
        count: photoCount,
        cost: cost
    });

    localStorage.setItem('apiCostTracker', JSON.stringify(data));
    console.log(`💰 Tracked ${photoCount} photos: $${cost.toFixed(5)} (total: $${data.totalCost.toFixed(5)})`);

    // Update UI if widget exists
    updateCostWidget();

    return cost;
}

// Track brochure generation cost
function trackBrochureGeneration() {
    const data = getCosts();
    const cost = COSTS.TEXT_GENERATION;

    data.brochuresGenerated += 1;
    data.totalCost += cost;
    data.sessionCosts.push({
        timestamp: new Date().toISOString(),
        type: 'brochure_generation',
        count: 1,
        cost: cost
    });

    localStorage.setItem('apiCostTracker', JSON.stringify(data));
    console.log(`💰 Tracked brochure generation: $${cost.toFixed(5)} (total: $${data.totalCost.toFixed(5)})`);

    // Update UI if widget exists
    updateCostWidget();

    return cost;
}

// Reset costs (for new session or testing)
function resetCosts() {
    localStorage.removeItem('apiCostTracker');
    initCostTracker();
    updateCostWidget();
    console.log('💰 Cost tracker reset');
}

// Create floating cost widget in UI
function createCostWidget() {
    // Remove existing widget if present
    const existing = document.getElementById('apiCostWidget');
    if (existing) existing.remove();

    const widget = document.createElement('div');
    widget.id = 'apiCostWidget';
    widget.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 13px;
        z-index: 10000;
        min-width: 200px;
        cursor: pointer;
        transition: all 0.3s ease;
    `;

    widget.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 20px;">💰</span>
                <strong style="font-size: 14px;">API Costs</strong>
            </div>
            <button onclick="toggleCostDetails()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                ▼
            </button>
        </div>
        <div id="costSummary" style="font-size: 12px; opacity: 0.95;">
            <div style="margin: 4px 0;">
                Photos: <strong id="photosCount">0</strong>
                (<span id="photosCost">$0.00</span>)
            </div>
            <div style="margin: 4px 0;">
                Brochures: <strong id="brochuresCount">0</strong>
                (<span id="brochuresCost">$0.00</span>)
            </div>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.3); font-weight: bold;">
                Total: <span id="totalCost" style="font-size: 16px; color: #ffeb3b;">$0.00</span>
            </div>
        </div>
        <div id="costDetails" style="display: none; margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 11px; max-height: 200px; overflow-y: auto;">
            <div style="margin-bottom: 6px; font-weight: bold; color: #ffeb3b;">Recent Activity:</div>
            <div id="costHistory"></div>
        </div>
        <div style="margin-top: 10px; display: flex; gap: 8px;">
            <button onclick="resetCosts()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; flex: 1;">
                Reset
            </button>
            <button onclick="exportCostReport()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; flex: 1;">
                Export
            </button>
        </div>
    `;

    document.body.appendChild(widget);

    // Add hover effect
    widget.addEventListener('mouseenter', () => {
        widget.style.transform = 'translateY(-2px)';
        widget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
    });

    widget.addEventListener('mouseleave', () => {
        widget.style.transform = 'translateY(0)';
        widget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });

    console.log('💰 Cost widget created');
    updateCostWidget();
}

// Toggle details panel
window.toggleCostDetails = function() {
    const details = document.getElementById('costDetails');
    const button = details.previousElementSibling.querySelector('button');

    if (details.style.display === 'none') {
        details.style.display = 'block';
        button.textContent = '▲';
        updateCostHistory();
    } else {
        details.style.display = 'none';
        button.textContent = '▼';
    }
};

// Update cost widget with current data
function updateCostWidget() {
    const data = getCosts();

    // Update or create widget
    if (!document.getElementById('apiCostWidget')) {
        createCostWidget();
        return;
    }

    const photosCost = data.photosAnalyzed * COSTS.PHOTO_ANALYSIS;
    const brochuresCost = data.brochuresGenerated * COSTS.TEXT_GENERATION;

    document.getElementById('photosCount').textContent = data.photosAnalyzed;
    document.getElementById('photosCost').textContent = `$${photosCost.toFixed(4)}`;
    document.getElementById('brochuresCount').textContent = data.brochuresGenerated;
    document.getElementById('brochuresCost').textContent = `$${brochuresCost.toFixed(4)}`;
    document.getElementById('totalCost').textContent = `$${data.totalCost.toFixed(4)}`;

    // Update history if details are open
    if (document.getElementById('costDetails').style.display !== 'none') {
        updateCostHistory();
    }
}

// Update cost history in details panel
function updateCostHistory() {
    const data = getCosts();
    const historyDiv = document.getElementById('costHistory');

    if (!historyDiv) return;

    // Show last 10 transactions
    const recentCosts = data.sessionCosts.slice(-10).reverse();

    if (recentCosts.length === 0) {
        historyDiv.innerHTML = '<div style="opacity: 0.7; font-style: italic;">No activity yet</div>';
        return;
    }

    historyDiv.innerHTML = recentCosts.map(item => {
        const time = new Date(item.timestamp).toLocaleTimeString();
        const icon = item.type === 'photo_analysis' ? '📸' : '📄';
        const label = item.type === 'photo_analysis' ? `${item.count} photos` : 'Brochure';

        return `
            <div style="margin: 4px 0; padding: 4px 0; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between;">
                <span>${icon} ${label}</span>
                <span style="color: #ffeb3b;">$${item.cost.toFixed(5)}</span>
            </div>
        `;
    }).join('');
}

// Export cost report
window.exportCostReport = function() {
    const data = getCosts();
    const report = {
        ...data,
        exportedAt: new Date().toISOString(),
        breakdown: {
            photoAnalysisCost: data.photosAnalyzed * COSTS.PHOTO_ANALYSIS,
            brochureGenerationCost: data.brochuresGenerated * COSTS.TEXT_GENERATION
        }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-costs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('💰 Cost report exported');
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initCostTracker();
    createCostWidget();
    console.log('💰 Cost tracker UI initialized');
});

// Export functions for use in other scripts
window.apiCostTracker = {
    trackPhotoAnalysis,
    trackBrochureGeneration,
    getCosts,
    resetCosts,
    updateCostWidget,
    createCostWidget
};

console.log('✅ API Cost Tracker ready');
