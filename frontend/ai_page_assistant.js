/**
 * AI Page Assistant System
 *
 * Provides intelligent page-level editing assistance with:
 * - Quick action buttons for common tasks
 * - Form data integration for missing elements
 * - Photo reshuffling and regeneration
 * - Text regeneration per page
 * - Issue detection and explanation
 *
 * Author: Claude Code
 * Date: October 15, 2025
 */

// ============================================
// GLOBAL STATE
// ============================================

window.aiAssistantState = {
    currentPageId: null,
    isOpen: false,
    conversationHistory: [],
    sessionStartTime: null,
    completionTime: null
};

// ============================================
// AI ASSISTANT MODAL
// ============================================

/**
 * Opens the AI Assistant for a specific page
 */
function openAIAssistant(pageId) {
    console.log(`🤖 Opening AI Assistant for page ${pageId}`);

    window.aiAssistantState.currentPageId = pageId;
    window.aiAssistantState.isOpen = true;

    const page = window.brochureData?.pages?.find(p => p.id === pageId);
    if (!page) {
        console.error('Page not found:', pageId);
        return;
    }

    // Create or show modal
    let modal = document.getElementById('aiAssistantModal');
    if (!modal) {
        modal = createAIAssistantModal();
        document.body.appendChild(modal);
    }

    // Update content
    updateAIAssistantContent(page);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

/**
 * Closes the AI Assistant modal
 */
function closeAIAssistant() {
    const modal = document.getElementById('aiAssistantModal');
    if (modal) {
        modal.style.display = 'none';
    }
    document.body.style.overflow = '';
    window.aiAssistantState.isOpen = false;
}

/**
 * Creates the AI Assistant modal HTML
 */
function createAIAssistantModal() {
    const modal = document.createElement('div');
    modal.id = 'aiAssistantModal';
    modal.className = 'ai-assistant-modal-overlay';
    modal.innerHTML = `
        <div class="ai-assistant-modal">
            <div class="ai-assistant-header">
                <div>
                    <h2>🤖 AI Page Assistant</h2>
                    <p id="aiAssistantPageTitle" class="ai-assistant-subtitle">Page 1</p>
                </div>
                <button onclick="closeAIAssistant()" class="ai-assistant-close">&times;</button>
            </div>

            <div class="ai-assistant-body">
                <!-- Quick Actions -->
                <div class="ai-quick-actions">
                    <h3>Quick Actions</h3>
                    <div class="ai-action-buttons" id="aiQuickActionButtons">
                        <!-- Dynamically populated -->
                    </div>
                </div>

                <!-- Missing Elements Detection -->
                <div class="ai-missing-elements" id="aiMissingElements">
                    <!-- Dynamically populated -->
                </div>

                <!-- Chat Interface -->
                <div class="ai-chat-container">
                    <h3>Custom Request</h3>
                    <div class="ai-chat-messages" id="aiChatMessages">
                        <div class="ai-message ai-message-assistant">
                            👋 Hi! I'm your AI assistant. I can help you with this page. Try one of the quick actions above, or type a custom request below!
                        </div>
                    </div>
                    <div class="ai-chat-input-container">
                        <textarea
                            id="aiChatInput"
                            placeholder="Type your request here... (e.g., 'Add the council tax to this page' or 'Make the description more engaging')"
                            rows="3"></textarea>
                        <button onclick="sendAIRequest()" class="ai-send-button">
                            Send 🚀
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Allow Enter to send (with Shift+Enter for new line)
    modal.querySelector('#aiChatInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendAIRequest();
        }
    });

    return modal;
}

/**
 * Updates AI Assistant content for the current page
 */
function updateAIAssistantContent(page) {
    // Update page title
    document.getElementById('aiAssistantPageTitle').textContent = page.name || `Page ${page.id}`;

    // Render quick actions
    renderQuickActions(page);

    // Detect and render missing elements
    detectMissingElements(page);
}

// ============================================
// QUICK ACTIONS
// ============================================

/**
 * Renders quick action buttons
 */
function renderQuickActions(page) {
    const container = document.getElementById('aiQuickActionButtons');

    const actions = [
        {
            icon: '🔄',
            label: 'Reshuffle Photos',
            description: 'Rearrange photos on this page',
            action: () => reshufflePhotos(page.id)
        },
        {
            icon: '✨',
            label: 'Regenerate Text',
            description: 'Rewrite the text content',
            action: () => regeneratePageText(page.id)
        },
        {
            icon: '🖼️',
            label: 'Regenerate Layout',
            description: 'New photo arrangement',
            action: () => regeneratePhotoLayout(page.id)
        },
        {
            icon: '🔍',
            label: 'Explain Issues',
            description: 'Identify potential problems',
            action: () => explainPageIssues(page.id)
        },
        {
            icon: '➕',
            label: 'Add Missing Data',
            description: 'Insert form data',
            action: () => showAddMissingDataOptions(page.id)
        }
    ];

    container.innerHTML = actions.map(action => `
        <button class="ai-action-btn" onclick='${action.action.toString().match(/=>\s*(.+)/)[1]}' title="${action.description}">
            <span class="ai-action-icon">${action.icon}</span>
            <span class="ai-action-label">${action.label}</span>
        </button>
    `).join('');
}

// ============================================
// MISSING ELEMENTS DETECTION
// ============================================

/**
 * Detects missing elements that could be added from form data
 */
function detectMissingElements(page) {
    const container = document.getElementById('aiMissingElements');
    const formData = window.brochureData?.formData || {};

    const missing = [];

    // Check for missing data points
    const checkItems = [
        { key: 'askingPrice', label: 'Asking Price', icon: '💰' },
        { key: 'councilTaxBand', label: 'Council Tax Band', icon: '🏛️' },
        { key: 'epcRating', label: 'EPC Rating', icon: '⚡' },
        { key: 'address', label: 'Full Address', icon: '📍' },
        { key: 'agentName', label: 'Agent Details', icon: '👤' },
        { key: 'agentPhoto', label: 'Agent Photo', icon: '📸' },
        { key: 'tenure', label: 'Tenure', icon: '📜' },
        { key: 'sizeSqft', label: 'Property Size', icon: '📏' }
    ];

    // Check if page content contains these items
    const pageContent = JSON.stringify(page.content).toLowerCase();

    checkItems.forEach(item => {
        const hasDataInForm = formData[item.key] && formData[item.key] !== '';
        const hasDataInPage = pageContent.includes(item.key.toLowerCase()) ||
                             (formData[item.key] && pageContent.includes(String(formData[item.key]).toLowerCase()));

        if (hasDataInForm && !hasDataInPage) {
            missing.push({
                ...item,
                value: formData[item.key]
            });
        }
    });

    if (missing.length === 0) {
        container.innerHTML = `
            <div class="ai-info-box ai-info-success">
                <span class="ai-info-icon">✅</span>
                <div>
                    <strong>All Data Present</strong>
                    <p>This page includes all available form data.</p>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="ai-info-box ai-info-warning">
            <span class="ai-info-icon">⚠️</span>
            <div>
                <strong>Missing Elements Detected</strong>
                <p>${missing.length} item${missing.length > 1 ? 's' : ''} from your form could be added:</p>
            </div>
        </div>
        <div class="ai-missing-items">
            ${missing.map(item => `
                <div class="ai-missing-item">
                    <span class="ai-missing-icon">${item.icon}</span>
                    <div class="ai-missing-info">
                        <strong>${item.label}</strong>
                        <span class="ai-missing-value">${item.value}</span>
                    </div>
                    <button class="ai-add-btn" onclick="addElementToPage('${item.key}', ${page.id})">
                        Add ➕
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Adds a missing element to the page
 */
async function addElementToPage(dataKey, pageId) {
    showToast('info', '🤖 Adding element to page...');

    const formData = window.brochureData?.formData || {};
    const value = formData[dataKey];

    if (!value) {
        showToast('error', 'Data not found in form');
        return;
    }

    // Find the page
    const pageIndex = window.brochureData.pages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) {
        showToast('error', 'Page not found');
        return;
    }

    // Add the element to the page description or create a new field
    const page = window.brochureData.pages[pageIndex];

    // Format the value appropriately
    let formattedText = '';
    switch(dataKey) {
        case 'askingPrice':
            formattedText = `\n\n**Asking Price:** £${parseInt(value).toLocaleString()}`;
            break;
        case 'councilTaxBand':
            formattedText = `\n\n**Council Tax:** Band ${value}`;
            break;
        case 'epcRating':
            formattedText = `\n\n**EPC Rating:** ${value}`;
            break;
        case 'address':
            formattedText = `\n\n**Address:** ${value}`;
            break;
        case 'tenure':
            formattedText = `\n\n**Tenure:** ${value.charAt(0).toUpperCase() + value.slice(1)}`;
            break;
        case 'sizeSqft':
            formattedText = `\n\n**Size:** ${value} sq ft`;
            break;
        default:
            formattedText = `\n\n**${dataKey}:** ${value}`;
    }

    // Append to description
    page.content.description = (page.content.description || '') + formattedText;

    // Update the page in the editor
    if (typeof updatePageInEditor === 'function') {
        updatePageInEditor(pageId);
    }

    // Re-detect missing elements
    detectMissingElements(page);

    showToast('success', `✅ Added ${dataKey} to page`);
    addToChatHistory('assistant', `I've added the ${dataKey} to the page.`);
}

// ============================================
// QUICK ACTION IMPLEMENTATIONS
// ============================================

/**
 * Reshuffles photos on a page
 */
async function reshufflePhotos(pageId) {
    showToast('info', '🔄 Reshuffling photos...');
    addToChatHistory('user', 'Reshuffle photos on this page');

    // Get page
    const page = window.brochureData.pages.find(p => p.id === pageId);
    if (!page) return;

    // Get photo blocks
    const photoBlocks = page.content.photos || [];
    if (photoBlocks.length < 2) {
        showToast('warning', 'Need at least 2 photos to reshuffle');
        addToChatHistory('assistant', 'This page needs at least 2 photos to reshuffle.');
        return;
    }

    // Shuffle array
    const shuffled = [...photoBlocks].sort(() => Math.random() - 0.5);
    page.content.photos = shuffled;

    // Update editor
    if (typeof updatePageInEditor === 'function') {
        updatePageInEditor(pageId);
    }

    showToast('success', '✅ Photos reshuffled!');
    addToChatHistory('assistant', `I've reshuffled the ${photoBlocks.length} photos on this page.`);
}

/**
 * Regenerates text content for a page
 */
async function regeneratePageText(pageId) {
    showToast('info', '✨ Regenerating text...');
    addToChatHistory('user', 'Regenerate the text on this page');

    // TODO: Call backend API to regenerate text
    // For now, show placeholder
    addToChatHistory('assistant', 'Text regeneration will call the AI API to create fresh content. This feature connects to your generation backend.');

    showToast('info', '🚀 Text regeneration feature coming soon - will integrate with your AI backend');
}

/**
 * Regenerates photo layout for a page
 */
async function regeneratePhotoLayout(pageId) {
    showToast('info', '🖼️ Regenerating photo layout...');
    addToChatHistory('user', 'Regenerate the photo layout');

    const page = window.brochureData.pages.find(p => p.id === pageId);
    if (!page) return;

    // Implement different layout patterns
    const layouts = ['grid', 'masonry', 'featured', 'collage'];
    const currentLayout = page.photoLayout || 'grid';
    const newLayout = layouts.filter(l => l !== currentLayout)[Math.floor(Math.random() * 3)];

    page.photoLayout = newLayout;

    if (typeof updatePageInEditor === 'function') {
        updatePageInEditor(pageId);
    }

    showToast('success', `✅ Changed layout to ${newLayout}`);
    addToChatHistory('assistant', `I've changed the photo layout to "${newLayout}" style.`);
}

/**
 * Explains issues with the page
 */
async function explainPageIssues(pageId) {
    addToChatHistory('user', 'Explain any issues with this page');

    const page = window.brochureData.pages.find(p => p.id === pageId);
    if (!page) return;

    const issues = [];

    // Check for various issues
    if (!page.content.description || page.content.description.length < 50) {
        issues.push('📝 Description is too short (less than 50 characters)');
    }

    if (!page.content.photos || page.content.photos.length === 0) {
        issues.push('📸 No photos on this page');
    }

    if (page.content.photos && page.content.photos.length > 6) {
        issues.push('🖼️ Too many photos (more than 6) - may look crowded');
    }

    if (!page.content.title) {
        issues.push('📋 Missing page title');
    }

    if (issues.length === 0) {
        addToChatHistory('assistant', '✅ Great news! I don\'t see any issues with this page. Everything looks good!');
    } else {
        addToChatHistory('assistant', `I found ${issues.length} potential issue${issues.length > 1 ? 's' : ''}:\n\n` + issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n'));
    }
}

/**
 * Shows options for adding missing data
 */
function showAddMissingDataOptions(pageId) {
    addToChatHistory('user', 'Show me what data I can add');
    addToChatHistory('assistant', 'I\'ve detected the missing elements above. Click the "Add" button next to any item to insert it into this page.');
}

// ============================================
// CHAT INTERFACE
// ============================================

/**
 * Sends a custom AI request
 */
async function sendAIRequest() {
    const input = document.getElementById('aiChatInput');
    const message = input.value.trim();

    if (!message) return;

    // Add user message to chat
    addToChatHistory('user', message);
    input.value = '';

    // Show typing indicator
    addTypingIndicator();

    // Simulate AI response (TODO: Connect to real AI backend)
    setTimeout(() => {
        removeTypingIndicator();

        // Parse intent from message
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('council tax')) {
            addElementToPage('councilTaxBand', window.aiAssistantState.currentPageId);
        } else if (lowerMessage.includes('price') || lowerMessage.includes('asking')) {
            addElementToPage('askingPrice', window.aiAssistantState.currentPageId);
        } else if (lowerMessage.includes('agent')) {
            addElementToPage('agentName', window.aiAssistantState.currentPageId);
        } else if (lowerMessage.includes('epc')) {
            addElementToPage('epcRating', window.aiAssistantState.currentPageId);
        } else if (lowerMessage.includes('address')) {
            addElementToPage('address', window.aiAssistantState.currentPageId);
        } else if (lowerMessage.includes('reshuffle') || lowerMessage.includes('rearrange')) {
            reshufflePhotos(window.aiAssistantState.currentPageId);
        } else if (lowerMessage.includes('regenerate') && lowerMessage.includes('text')) {
            regeneratePageText(window.aiAssistantState.currentPageId);
        } else if (lowerMessage.includes('regenerate') && lowerMessage.includes('layout')) {
            regeneratePhotoLayout(window.aiAssistantState.currentPageId);
        } else if (lowerMessage.includes('issue') || lowerMessage.includes('problem') || lowerMessage.includes('wrong')) {
            explainPageIssues(window.aiAssistantState.currentPageId);
        } else {
            addToChatHistory('assistant', `I understand you want to: "${message}". This will be processed by the AI backend. For now, try using the quick action buttons above, or be more specific about what you'd like to add or change.`);
        }
    }, 1000);
}

/**
 * Adds a message to chat history
 */
function addToChatHistory(role, message) {
    const container = document.getElementById('aiChatMessages');

    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ai-message-${role}`;
    messageDiv.textContent = message;

    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;

    window.aiAssistantState.conversationHistory.push({ role, message, timestamp: Date.now() });
}

/**
 * Adds typing indicator
 */
function addTypingIndicator() {
    const container = document.getElementById('aiChatMessages');
    const indicator = document.createElement('div');
    indicator.className = 'ai-typing-indicator';
    indicator.id = 'aiTypingIndicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(indicator);
    container.scrollTop = container.scrollHeight;
}

/**
 * Removes typing indicator
 */
function removeTypingIndicator() {
    const indicator = document.getElementById('aiTypingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// ============================================
// TIME TRACKING
// ============================================

/**
 * Starts session timer
 */
function startSessionTimer() {
    if (!window.aiAssistantState.sessionStartTime) {
        window.aiAssistantState.sessionStartTime = Date.now();
        console.log('⏱️ Session timer started');
    }
}

/**
 * Gets session duration in seconds
 */
function getSessionDuration() {
    if (!window.aiAssistantState.sessionStartTime) return 0;
    return Math.floor((Date.now() - window.aiAssistantState.sessionStartTime) / 1000);
}

// Start timer when brochure editor loads
if (typeof window.brochureData !== 'undefined') {
    startSessionTimer();
}

console.log('🤖 AI Page Assistant system loaded');
