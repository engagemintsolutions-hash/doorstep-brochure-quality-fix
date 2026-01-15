/**
 * ============================================================================
 * COLLABORATION SYSTEM
 * ============================================================================
 *
 * Enables real-time brochure handoff between agents.
 *
 * Features:
 * - Session heartbeat to track active users
 * - Share brochure state with other agents
 * - Receive and load shared brochures
 * - Real-time notifications
 */

// ============================================================================
// GLOBAL STATE
// ============================================================================
const COLLAB_CONFIG = {
    HEARTBEAT_INTERVAL: 30000,      // Send heartbeat every 30 seconds
    POLL_INTERVAL: 5000,            // Check for handoffs every 5 seconds
    API_BASE: ''                    // Will be set from window location
};

let collaborationState = {
    currentUserEmail: null,
    currentUserName: null,
    heartbeatTimer: null,
    pollTimer: null,
    isActive: false,
    pendingHandoffs: []
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize collaboration system
 * @param {string} userEmail - Current user's email
 * @param {string} userName - Current user's display name
 */
function initCollaboration(userEmail, userName) {
    if (!userEmail) {
        console.warn('⚠️ Collaboration: No user email provided, system disabled');
        return;
    }

    collaborationState.currentUserEmail = userEmail;
    collaborationState.currentUserName = userName || userEmail;
    collaborationState.isActive = true;

    console.log(`✅ Collaboration system initialized for ${userName || userEmail}`);

    // Start heartbeat
    startHeartbeat();

    // Start polling for handoffs
    startHandoffPolling();

    // Check for existing handoffs immediately
    checkForHandoffs();
}

/**
 * Shutdown collaboration system
 */
function shutdownCollaboration() {
    if (collaborationState.heartbeatTimer) {
        clearInterval(collaborationState.heartbeatTimer);
    }
    if (collaborationState.pollTimer) {
        clearInterval(collaborationState.pollTimer);
    }
    collaborationState.isActive = false;
    console.log('🔴 Collaboration system shut down');
}

// ============================================================================
// HEARTBEAT
// ============================================================================

/**
 * Start sending heartbeat to keep session alive
 */
function startHeartbeat() {
    // Send immediately
    sendHeartbeat();

    // Then send periodically
    collaborationState.heartbeatTimer = setInterval(() => {
        sendHeartbeat();
    }, COLLAB_CONFIG.HEARTBEAT_INTERVAL);
}

/**
 * Send heartbeat to backend
 */
async function sendHeartbeat() {
    if (!collaborationState.isActive) return;

    try {
        const response = await fetch('/collaborate/heartbeat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_email: collaborationState.currentUserEmail,
                user_name: collaborationState.currentUserName
            })
        });

        if (!response.ok) {
            console.warn('⚠️ Heartbeat failed:', response.status);
        }
    } catch (error) {
        console.error('❌ Heartbeat error:', error);
    }
}

// ============================================================================
// HANDOFF POLLING
// ============================================================================

/**
 * Start polling for pending handoffs
 */
function startHandoffPolling() {
    collaborationState.pollTimer = setInterval(() => {
        checkForHandoffs();
    }, COLLAB_CONFIG.POLL_INTERVAL);
}

/**
 * Check for pending brochure handoffs
 */
async function checkForHandoffs() {
    if (!collaborationState.isActive) return;

    try {
        const response = await fetch(
            `/collaborate/pending?user_email=${encodeURIComponent(collaborationState.currentUserEmail)}`
        );

        if (!response.ok) {
            console.warn('⚠️ Handoff check failed:', response.status);
            return;
        }

        const data = await response.json();

        // Check if there are new handoffs
        const newHandoffs = data.handoffs.filter(handoff =>
            !collaborationState.pendingHandoffs.find(existing => existing.handoff_id === handoff.handoff_id)
        );

        if (newHandoffs.length > 0) {
            collaborationState.pendingHandoffs = data.handoffs;
            showHandoffNotifications(newHandoffs);
        }
    } catch (error) {
        console.error('❌ Handoff check error:', error);
    }
}

/**
 * Show notifications for new handoffs
 */
function showHandoffNotifications(handoffs) {
    handoffs.forEach(handoff => {
        const senderName = handoff.sender_name || handoff.sender_email;
        const address = handoff.address || 'Unknown address';

        showToast(
            `📨 New brochure from ${senderName}`,
            `Property: ${address}\nClick to load`,
            () => loadHandoff(handoff.handoff_id)
        );
    });

    // Update notification badge
    updateNotificationBadge(collaborationState.pendingHandoffs.length);
}

// ============================================================================
// SHARING BROCHURE
// ============================================================================

/**
 * Share current brochure with another user
 * @param {string} recipientEmail - Email of recipient
 * @param {string} message - Optional message
 */
async function shareBrochure(recipientEmail, message = '') {
    if (!collaborationState.isActive) {
        showToast('❌ Collaboration not initialized', 'Please log in first', null, 'error');
        return;
    }

    try {
        // Capture current brochure state
        const brochureState = captureBrochureState();

        // Send to backend
        const response = await fetch('/collaborate/share', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipient_email: recipientEmail,
                sender_name: collaborationState.currentUserName,
                brochure_state: brochureState,
                message: message
            })
        });

        if (!response.ok) {
            throw new Error(`Share failed: ${response.status}`);
        }

        const result = await response.json();

        showToast(
            '✅ Brochure shared successfully',
            `Sent to ${recipientEmail}`,
            null,
            'success'
        );

        console.log('✅ Brochure shared:', result);

        return result;
    } catch (error) {
        console.error('❌ Share brochure error:', error);
        showToast('❌ Failed to share brochure', error.message, null, 'error');
        throw error;
    }
}

/**
 * Capture current brochure state from the form
 */
function captureBrochureState() {
    const state = {
        // Property data
        property_data: {
            property_type: document.getElementById('property-type')?.value || 'house',
            bedrooms: parseInt(document.getElementById('bedrooms')?.value) || 3,
            bathrooms: parseInt(document.getElementById('bathrooms')?.value) || 2,
            condition: document.getElementById('condition')?.value || 'good',
            features: []
        },

        // Location data
        location_data: {
            address: document.getElementById('address')?.value || '',
            setting: document.getElementById('setting')?.value || 'suburban'
        },

        // Target audience
        target_audience: {
            audience_type: document.getElementById('audience')?.value || 'professionals'
        },

        // Tone
        tone: {
            tone: document.getElementById('tone')?.value || 'boutique'
        },

        // Channel
        channel: {
            channel: document.getElementById('channel')?.value || 'brochure'
        },

        // Branding
        brand: document.getElementById('brand')?.value || 'generic',
        typography_style: document.getElementById('typography-style')?.value || 'classic',
        orientation: 'landscape',

        // Photos
        uploaded_photos: window.uploadedPhotos || [],
        photo_assignments: window.photoAssignments || {},

        // Generated content
        generated_variants: window.generatedVariants || null,
        selected_variant_id: window.selectedVariantId || null,
        custom_text: document.getElementById('custom-text')?.value || null,

        // Metadata
        address: document.getElementById('address')?.value || '',
        price: document.getElementById('price')?.value || ''
    };

    return state;
}

// ============================================================================
// LOADING HANDOFF
// ============================================================================

/**
 * Load a received brochure handoff
 * @param {string} handoffId - ID of the handoff to load
 */
async function loadHandoff(handoffId) {
    try {
        const response = await fetch(
            `/collaborate/accept/${handoffId}?user_email=${encodeURIComponent(collaborationState.currentUserEmail)}`,
            { method: 'POST' }
        );

        if (!response.ok) {
            throw new Error(`Failed to load handoff: ${response.status}`);
        }

        const data = await response.json();

        // Restore brochure state
        restoreBrochureState(data.brochure_state);

        // Remove from pending list
        collaborationState.pendingHandoffs = collaborationState.pendingHandoffs.filter(
            h => h.handoff_id !== handoffId
        );
        updateNotificationBadge(collaborationState.pendingHandoffs.length);

        const senderName = data.sender_name || data.sender_email;
        showToast(
            '✅ Brochure loaded successfully',
            `From ${senderName}`,
            null,
            'success'
        );

        console.log('✅ Handoff loaded:', data);

    } catch (error) {
        console.error('❌ Load handoff error:', error);
        showToast('❌ Failed to load brochure', error.message, null, 'error');
    }
}

/**
 * Restore brochure state to the form
 */
function restoreBrochureState(state) {
    // Property data
    if (state.property_data) {
        setInputValue('property-type', state.property_data.property_type);
        setInputValue('bedrooms', state.property_data.bedrooms);
        setInputValue('bathrooms', state.property_data.bathrooms);
        setInputValue('condition', state.property_data.condition);
    }

    // Location data
    if (state.location_data) {
        setInputValue('address', state.location_data.address);
        setInputValue('setting', state.location_data.setting);
    }

    // Target audience
    if (state.target_audience) {
        setInputValue('audience', state.target_audience.audience_type);
    }

    // Tone and channel
    if (state.tone) {
        setInputValue('tone', state.tone.tone);
    }
    if (state.channel) {
        setInputValue('channel', state.channel.channel);
    }

    // Branding
    setInputValue('brand', state.brand);
    setInputValue('typography-style', state.typography_style);

    // Price
    setInputValue('price', state.price);

    // Photos
    if (state.uploaded_photos && state.uploaded_photos.length > 0) {
        window.uploadedPhotos = state.uploaded_photos;
        // Trigger photo display update if available
        if (typeof displayUploadedPhotos === 'function') {
            displayUploadedPhotos();
        }
    }

    // Photo assignments
    if (state.photo_assignments) {
        window.photoAssignments = state.photo_assignments;
    }

    // Generated content
    if (state.generated_variants) {
        window.generatedVariants = state.generated_variants;
        if (state.selected_variant_id) {
            window.selectedVariantId = state.selected_variant_id;
        }
    }

    // Custom text
    if (state.custom_text) {
        setInputValue('custom-text', state.custom_text);
    }

    console.log('✅ Brochure state restored');
}

/**
 * Safely set input value
 */
function setInputValue(id, value) {
    const element = document.getElementById(id);
    if (element && value != null) {
        element.value = value;
    }
}

// ============================================================================
// USER SELECTION
// ============================================================================

/**
 * Show modal to select recipient and share brochure
 */
async function showShareModal() {
    try {
        // Fetch active users
        const response = await fetch(
            `/collaborate/active-users?current_user_email=${encodeURIComponent(collaborationState.currentUserEmail)}`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.status}`);
        }

        const data = await response.json();

        if (data.users.length === 0) {
            showToast('ℹ️ No other users available', 'No other agents in the system', null, 'info');
            return;
        }

        // Create and show modal
        const modal = createUserSelectionModal(data.users);
        document.body.appendChild(modal);

    } catch (error) {
        console.error('❌ Show share modal error:', error);
        showToast('❌ Failed to load users', error.message, null, 'error');
    }
}

/**
 * Create user selection modal
 */
function createUserSelectionModal(users) {
    // Check if user is online (last_seen within last 5 minutes)
    const isUserOnline = (lastSeen) => {
        if (!lastSeen || lastSeen === 0) return false;
        const fiveMinutesAgo = Date.now() / 1000 - 300; // 5 minutes in seconds
        return lastSeen > fiveMinutesAgo;
    };

    const modal = document.createElement('div');
    modal.className = 'collab-modal-overlay';
    modal.innerHTML = `
        <div class="collab-modal">
            <div class="collab-modal-header">
                <h2>📤 Share Brochure</h2>
                <button class="collab-modal-close" onclick="this.closest('.collab-modal-overlay').remove()">
                    ✕
                </button>
            </div>
            <div class="collab-modal-body">
                <p class="collab-modal-subtitle">
                    Select an agent to share this brochure with (they'll receive it when they next log in):
                </p>
                <div class="collab-user-list">
                    ${users.map(user => {
                        const online = isUserOnline(user.last_seen);
                        const statusIcon = online ? '🟢' : '🔴';
                        const statusText = online ? 'Online' : 'Offline';
                        return `
                            <div class="collab-user-item" data-email="${user.user_email}">
                                <div class="collab-user-avatar">
                                    ${(user.user_name || user.user_email).charAt(0).toUpperCase()}
                                </div>
                                <div class="collab-user-info">
                                    <div class="collab-user-name">${user.user_name || user.user_email}</div>
                                    <div class="collab-user-email">${user.user_email}</div>
                                </div>
                                <div class="collab-user-status" style="color: ${online ? '#10b981' : '#6b7280'}">
                                    ${statusIcon} ${statusText}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="collab-message-container">
                    <label for="collab-message">Optional message:</label>
                    <textarea id="collab-message" placeholder="Add a note for the recipient..." rows="3"></textarea>
                </div>
            </div>
            <div class="collab-modal-footer">
                <button class="collab-btn-secondary" onclick="this.closest('.collab-modal-overlay').remove()">
                    Cancel
                </button>
                <button class="collab-btn-primary" onclick="handleShareConfirm()">
                    Share Brochure
                </button>
            </div>
        </div>
    `;

    // Add click handlers to user items
    modal.querySelectorAll('.collab-user-item').forEach(item => {
        item.addEventListener('click', function() {
            // Deselect all
            modal.querySelectorAll('.collab-user-item').forEach(i => i.classList.remove('selected'));
            // Select this one
            this.classList.add('selected');
        });
    });

    return modal;
}

/**
 * Handle share confirm button click
 */
async function handleShareConfirm() {
    const modal = document.querySelector('.collab-modal-overlay');
    const selectedUser = modal.querySelector('.collab-user-item.selected');

    if (!selectedUser) {
        showToast('⚠️ No user selected', 'Please select a recipient', null, 'warning');
        return;
    }

    const recipientEmail = selectedUser.dataset.email;
    const message = document.getElementById('collab-message').value;

    // Close modal
    modal.remove();

    // Share brochure
    await shareBrochure(recipientEmail, message);
}

// ============================================================================
// UI HELPERS
// ============================================================================

/**
 * Show toast notification
 */
function showToast(title, message, onclick = null, type = 'info') {
    // Check if toast container exists
    let container = document.getElementById('collab-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'collab-toast-container';
        container.className = 'collab-toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `collab-toast collab-toast-${type}`;
    toast.innerHTML = `
        <div class="collab-toast-title">${title}</div>
        <div class="collab-toast-message">${message}</div>
    `;

    if (onclick) {
        toast.style.cursor = 'pointer';
        toast.addEventListener('click', () => {
            onclick();
            toast.remove();
        });
    }

    container.appendChild(toast);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('collab-toast-fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

/**
 * Update notification badge
 */
function updateNotificationBadge(count) {
    const badge = document.getElementById('collab-notification-badge');
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// ============================================================================
// EXPORT API
// ============================================================================

// Make functions available globally
window.CollaborationAPI = {
    init: initCollaboration,
    shutdown: shutdownCollaboration,
    share: shareBrochure,
    showShareModal: showShareModal,
    loadHandoff: loadHandoff,
    checkForHandoffs: checkForHandoffs,
    state: collaborationState
};

console.log('📦 Collaboration module loaded');
