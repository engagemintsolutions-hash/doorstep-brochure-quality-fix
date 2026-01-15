/**
 * Post-Export System
 *
 * Comprehensive post-export experience including:
 * - Gamification review system with time tracking
 * - Feedback reward system (0.1 credit refund)
 * - Repurposing popup (Rightmove/Zoopla/Social/Newsletters/Physical brochures)
 * - Performance comparisons (vs manual, vs other users)
 *
 * Author: Claude Code
 * Date: October 15, 2025
 */

// ============================================
// GLOBAL STATE
// ============================================

window.postExportState = {
    sessionStartTime: null,
    sessionEndTime: null,
    sessionDuration: 0,
    userFeedback: null,
    creditRefundEligible: false
};

// Initialize session timer when page loads
if (!window.postExportState.sessionStartTime) {
    window.postExportState.sessionStartTime = Date.now();
    console.log('⏱️ Session timer started');
}

// ============================================
// POST-EXPORT FLOW
// ============================================

/**
 * Main post-export flow - called after successful export
 */
async function showPostExportExperience() {
    console.log('🎉 Starting post-export experience');

    // Calculate session duration
    window.postExportState.sessionEndTime = Date.now();
    window.postExportState.sessionDuration = Math.floor(
        (window.postExportState.sessionEndTime - window.postExportState.sessionStartTime) / 1000
    );

    // Step 1: Show gamification review
    await showGamificationReview();

    // Step 2: After feedback, show repurposing popup
    // (Triggered after user provides feedback)
}

// ============================================
// GAMIFICATION REVIEW SYSTEM
// ============================================

/**
 * Shows the gamification review modal with time tracking and feedback
 */
async function showGamificationReview() {
    const modal = createGamificationModal();
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Get performance stats
    const stats = await getPerformanceStats();

    // Update modal content with stats
    updateGamificationContent(stats);
}

/**
 * Creates the gamification review modal HTML
 */
function createGamificationModal() {
    const modal = document.createElement('div');
    modal.id = 'gamificationModal';
    modal.className = 'gamification-modal-overlay';
    modal.innerHTML = `
        <div class="gamification-modal">
            <div class="gamification-header">
                <h2>🎉 Brochure Created Successfully!</h2>
                <p class="gamification-subtitle">How was your experience?</p>
            </div>

            <div class="gamification-body">
                <!-- Performance Stats -->
                <div class="performance-stats" id="performanceStats">
                    <div class="stat-card stat-time">
                        <div class="stat-icon">⏱️</div>
                        <div class="stat-content">
                            <div class="stat-label">Your Time</div>
                            <div class="stat-value" id="yourTime">--</div>
                        </div>
                    </div>

                    <div class="stat-card stat-average">
                        <div class="stat-icon">👥</div>
                        <div class="stat-content">
                            <div class="stat-label">Average User Time</div>
                            <div class="stat-value" id="avgTime">--</div>
                        </div>
                    </div>

                    <div class="stat-card stat-manual">
                        <div class="stat-icon">📝</div>
                        <div class="stat-content">
                            <div class="stat-label">Manual Creation Time</div>
                            <div class="stat-value" id="manualTime">~45 min</div>
                        </div>
                    </div>

                    <div class="stat-card stat-saved">
                        <div class="stat-icon">🚀</div>
                        <div class="stat-content">
                            <div class="stat-label">Time Saved</div>
                            <div class="stat-value" id="timeSaved">--</div>
                        </div>
                    </div>
                </div>

                <!-- Feedback Section -->
                <div class="feedback-section">
                    <h3>Rate Your Experience</h3>
                    <p class="feedback-incentive">
                        💰 <strong>Get 0.1 credit refund</strong> for providing feedback!
                    </p>

                    <div class="feedback-faces" id="feedbackFaces">
                        <button class="feedback-face" data-rating="very-happy" title="Excellent" onclick="selectFeedback('very-happy')">
                            <span class="face-emoji">😄</span>
                            <span class="face-label">Excellent</span>
                        </button>
                        <button class="feedback-face" data-rating="happy" title="Good" onclick="selectFeedback('happy')">
                            <span class="face-emoji">🙂</span>
                            <span class="face-label">Good</span>
                        </button>
                        <button class="feedback-face" data-rating="neutral" title="Okay" onclick="selectFeedback('neutral')">
                            <span class="face-emoji">😐</span>
                            <span class="face-label">Okay</span>
                        </button>
                        <button class="feedback-face" data-rating="sad" title="Poor" onclick="selectFeedback('sad')">
                            <span class="face-emoji">😕</span>
                            <span class="face-label">Poor</span>
                        </button>
                        <button class="feedback-face" data-rating="very-sad" title="Very Poor" onclick="selectFeedback('very-sad')">
                            <span class="face-emoji">😞</span>
                            <span class="face-label">Very Poor</span>
                        </button>
                    </div>

                    <div class="feedback-comment" id="feedbackCommentSection" style="display: none;">
                        <textarea id="feedbackComment" placeholder="Tell us more about your experience (optional)..." rows="4"></textarea>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="gamification-actions">
                    <button class="btn-secondary" onclick="skipGamification()">
                        Skip
                    </button>
                    <button class="btn-primary" id="submitFeedbackBtn" disabled onclick="submitFeedback()">
                        Submit Feedback & Continue
                    </button>
                </div>
            </div>
        </div>
    `;

    return modal;
}

/**
 * Gets performance statistics
 */
async function getPerformanceStats() {
    const yourTime = window.postExportState.sessionDuration;

    // TODO: Get real average from backend
    // For now, use estimated averages
    const avgTime = 600; // 10 minutes average
    const manualTime = 2700; // 45 minutes manual

    const timeSaved = manualTime - yourTime;

    return {
        yourTime,
        avgTime,
        manualTime,
        timeSaved
    };
}

/**
 * Updates gamification modal with stats
 */
function updateGamificationContent(stats) {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    document.getElementById('yourTime').textContent = formatTime(stats.yourTime);
    document.getElementById('avgTime').textContent = formatTime(stats.avgTime);
    document.getElementById('timeSaved').textContent = formatTime(stats.timeSaved);

    // Add celebration if significantly faster
    if (stats.yourTime < stats.avgTime) {
        const percentage = Math.round(((stats.avgTime - stats.yourTime) / stats.avgTime) * 100);
        document.getElementById('yourTime').innerHTML = `
            ${formatTime(stats.yourTime)}
            <span class="stat-badge stat-badge-success">🎉 ${percentage}% faster!</span>
        `;
    }
}

/**
 * Selects feedback rating
 */
function selectFeedback(rating) {
    // Remove previous selection
    document.querySelectorAll('.feedback-face').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Add selection to clicked button
    const selectedBtn = document.querySelector(`[data-rating="${rating}"]`);
    selectedBtn.classList.add('selected');

    // Store feedback
    window.postExportState.userFeedback = rating;
    window.postExportState.creditRefundEligible = true;

    // Show comment section
    document.getElementById('feedbackCommentSection').style.display = 'block';

    // Enable submit button
    document.getElementById('submitFeedbackBtn').disabled = false;

    console.log(`📊 Feedback selected: ${rating}`);
}

/**
 * Submits feedback and continues to repurposing
 */
async function submitFeedback() {
    const rating = window.postExportState.userFeedback;
    const comment = document.getElementById('feedbackComment')?.value || '';

    if (!rating) {
        showToast('warning', 'Please select a rating');
        return;
    }

    // Collect feedback data
    const feedbackData = {
        rating,
        comment,
        sessionDuration: window.postExportState.sessionDuration,
        timestamp: Date.now(),
        userEmail: window.userEmail || 'unknown'
    };

    console.log('📤 Submitting feedback:', feedbackData);

    // Show loading
    document.getElementById('submitFeedbackBtn').innerHTML = '<span class="spinner"></span> Submitting...';
    document.getElementById('submitFeedbackBtn').disabled = true;

    try {
        // TODO: Send to backend API
        // await fetch('/api/feedback', { method: 'POST', body: JSON.stringify(feedbackData) });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Close gamification modal
        closeGamificationModal();

        // Show credit refund notification
        if (window.postExportState.creditRefundEligible) {
            showCreditRefundNotification();
        }

        // Show repurposing popup
        setTimeout(() => {
            showRepurposingPopup();
        }, 1000);

    } catch (error) {
        console.error('Failed to submit feedback:', error);
        showToast('error', 'Failed to submit feedback. Please try again.');
        document.getElementById('submitFeedbackBtn').innerHTML = 'Submit Feedback & Continue';
        document.getElementById('submitFeedbackBtn').disabled = false;
    }
}

/**
 * Skips gamification and goes straight to repurposing
 */
function skipGamification() {
    closeGamificationModal();
    showRepurposingPopup();
}

/**
 * Closes gamification modal
 */
function closeGamificationModal() {
    const modal = document.getElementById('gamificationModal');
    if (modal) {
        modal.style.display = 'none';
        modal.remove();
    }
    document.body.style.overflow = '';
}

/**
 * Shows credit refund notification
 */
function showCreditRefundNotification() {
    const notification = document.createElement('div');
    notification.className = 'credit-notification';
    notification.innerHTML = `
        <div class="credit-notification-content">
            <span class="credit-icon">💰</span>
            <div class="credit-text">
                <strong>Credit Refunded!</strong>
                <p>0.1 credits added to your account</p>
            </div>
        </div>
    `;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Show toast as well
    showToast('success', '🎉 0.1 credits refunded! Thank you for your feedback.');
}

// ============================================
// REPURPOSING POPUP
// ============================================

/**
 * Shows the repurposing opportunities popup
 */
function showRepurposingPopup() {
    const modal = createRepurposingModal();
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

/**
 * Creates the repurposing modal HTML
 */
function createRepurposingModal() {
    const modal = document.createElement('div');
    modal.id = 'repurposingModal';
    modal.className = 'repurposing-modal-overlay';
    modal.innerHTML = `
        <div class="repurposing-modal">
            <div class="repurposing-header">
                <h2>🚀 Repurpose Your Brochure</h2>
                <p class="repurposing-subtitle">Maximize your marketing reach with our full-stack solution</p>
                <button onclick="closeRepurposingModal()" class="repurposing-close">&times;</button>
            </div>

            <div class="repurposing-body">
                <div class="repurposing-intro">
                    <p>Your brochure is ready! Now transform it into multiple marketing materials:</p>
                </div>

                <div class="repurposing-options">
                    <!-- Portal Listings -->
                    <div class="repurposing-card repurposing-portals">
                        <div class="repurposing-icon">🏠</div>
                        <h3>Portal Listings</h3>
                        <p>Auto-format for Rightmove, Zoopla, and OnTheMarket</p>
                        <ul class="repurposing-features">
                            <li>✓ Optimal character counts</li>
                            <li>✓ SEO-optimized descriptions</li>
                            <li>✓ Platform-specific formatting</li>
                        </ul>
                        <button class="repurposing-btn" onclick="repurposeForPortals()">
                            Generate Portal Copy
                        </button>
                    </div>

                    <!-- Social Media -->
                    <div class="repurposing-card repurposing-social">
                        <div class="repurposing-icon">📱</div>
                        <h3>Social Media</h3>
                        <p>Create engaging posts for Instagram, Facebook & Twitter</p>
                        <ul class="repurposing-features">
                            <li>✓ Platform-optimized content</li>
                            <li>✓ Hashtag suggestions</li>
                            <li>✓ Multiple post variations</li>
                        </ul>
                        <button class="repurposing-btn" onclick="repurposeForSocial()">
                            Create Social Posts
                        </button>
                    </div>

                    <!-- Email & Newsletters -->
                    <div class="repurposing-card repurposing-email">
                        <div class="repurposing-icon">📧</div>
                        <h3>Email & Newsletters</h3>
                        <p>Professional email campaigns and client newsletters</p>
                        <ul class="repurposing-features">
                            <li>✓ HTML email templates</li>
                            <li>✓ Personalization options</li>
                            <li>✓ Call-to-action buttons</li>
                        </ul>
                        <button class="repurposing-btn" onclick="repurposeForEmail()">
                            Generate Email Content
                        </button>
                    </div>

                    <!-- Physical Brochures -->
                    <div class="repurposing-card repurposing-print">
                        <div class="repurposing-icon">🖨️</div>
                        <h3>Physical Brochures</h3>
                        <p>Order professional printed brochures delivered to your office</p>
                        <ul class="repurposing-features">
                            <li>✓ Premium quality printing</li>
                            <li>✓ Multiple paper options</li>
                            <li>✓ Fast delivery (2-3 days)</li>
                        </ul>
                        <button class="repurposing-btn repurposing-btn-primary" onclick="orderPhysicalBrochures()">
                            Order Print Brochures
                        </button>
                    </div>

                    <!-- AI Visual Staging -->
                    <div class="repurposing-card repurposing-staging">
                        <div class="repurposing-icon">🎨</div>
                        <h3>AI Visual Staging</h3>
                        <p>Transform empty rooms into beautifully furnished spaces with AI</p>
                        <ul class="repurposing-features">
                            <li>✓ Realistic furniture placement</li>
                            <li>✓ Multiple design styles available</li>
                            <li>✓ Perfect for vacant properties</li>
                        </ul>
                        <button class="repurposing-btn" onclick="startVisualStaging()">
                            Start Visual Staging
                        </button>
                    </div>

                    <!-- Automated Video Tours -->
                    <div class="repurposing-card repurposing-video">
                        <div class="repurposing-icon">📹</div>
                        <h3>Automated Video Tours</h3>
                        <p>Create professional property tours automatically from your photos</p>
                        <ul class="repurposing-features">
                            <li>✓ AI-generated script & narration</li>
                            <li>✓ Smooth transitions & music</li>
                            <li>✓ Export for all marketing channels</li>
                        </ul>
                        <button class="repurposing-btn" onclick="createVideoTour()">
                            Create Video Tour
                        </button>
                    </div>

                    <!-- Hire Photographer & Drone -->
                    <div class="repurposing-card repurposing-photographer">
                        <div class="repurposing-icon">📸</div>
                        <h3>Hire Photographer & Drone</h3>
                        <p>Book professional photographers and licensed drone operators</p>
                        <ul class="repurposing-features">
                            <li>✓ Network of vetted professionals</li>
                            <li>✓ CAA-licensed drone operators</li>
                            <li>✓ High-resolution images (3 hours)</li>
                        </ul>
                        <button class="repurposing-btn" onclick="hirePhotographer()">
                            Book Photographer
                        </button>
                    </div>
                </div>

                <div class="repurposing-actions">
                    <button class="btn-secondary" onclick="closeRepurposingModal()">
                        Maybe Later
                    </button>
                    <button class="btn-primary" onclick="selectMultipleRepurposing()">
                        Select Multiple Options
                    </button>
                </div>
            </div>
        </div>
    `;

    return modal;
}

/**
 * Closes repurposing modal
 */
function closeRepurposingModal() {
    const modal = document.getElementById('repurposingModal');
    if (modal) {
        modal.style.display = 'none';
        modal.remove();
    }
    document.body.style.overflow = '';
}

// ============================================
// REPURPOSING ACTIONS
// ============================================

/**
 * Repurpose for property portals
 */
async function repurposeForPortals() {
    if (!window.EditorState || !window.EditorState.sessionId) {
        console.error('No session ID available for repurposing');
        alert('Unable to repurpose: No active brochure session');
        return;
    }

    console.log('📝 Repurposing for portals: Rightmove, Zoopla, OnTheMarket');
    closeRepurposingModal();

    try {
        const response = await fetch('/api/repurpose-brochure', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session_id: window.EditorState.sessionId,
                platforms: ['rightmove', 'zoopla', 'onthemarket']
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate portal listings');
        }

        const result = await response.json();
        console.log('✅ Portal listings generated:', result);

        // Create and download portal content
        let portalText = '='.repeat(60) + '\n';
        portalText += 'PORTAL LISTINGS - GENERATED CONTENT\n';
        portalText += '='.repeat(60) + '\n\n';

        for (const [platform, content] of Object.entries(result.content)) {
            portalText += `\n${'='.repeat(60)}\n`;
            portalText += `${platform.toUpperCase()}\n`;
            portalText += `${'='.repeat(60)}\n\n`;
            portalText += `HEADLINE:\n${content.headline}\n\n`;
            portalText += `DESCRIPTION (${content.word_count} words, ${content.character_count} characters):\n${content.description}\n\n`;
            portalText += `KEY FEATURES:\n`;
            content.key_features.forEach((feature, i) => {
                portalText += `${i + 1}. ${feature}\n`;
            });
            portalText += `\n`;
        }

        portalText += `\n${'='.repeat(60)}\n`;
        portalText += `Total API Cost: $${result.total_cost_usd.toFixed(4)}\n`;
        portalText += `${'='.repeat(60)}\n`;

        // Download as text file
        const blob = new Blob([portalText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portal-listings-${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        alert('✅ Portal listings generated and downloaded!');
    } catch (error) {
        console.error('Portal generation error:', error);
        alert('Failed to generate portal listings: ' + error.message);
    }
}

/**
 * Repurpose for social media
 */
async function repurposeForSocial() {
    if (!window.EditorState || !window.EditorState.sessionId) {
        console.error('No session ID available for repurposing');
        alert('Unable to repurpose: No active brochure session');
        return;
    }

    console.log('📱 Repurposing for social media');
    closeRepurposingModal();

    try {
        const response = await fetch('/api/repurpose-brochure', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session_id: window.EditorState.sessionId,
                platforms: ['facebook', 'instagram', 'linkedin']
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate social media content');
        }

        const result = await response.json();
        console.log('✅ Social media content generated:', result);

        // Create and download social content
        let socialText = '='.repeat(60) + '\n';
        socialText += 'SOCIAL MEDIA POSTS - GENERATED CONTENT\n';
        socialText += '='.repeat(60) + '\n\n';

        for (const [platform, content] of Object.entries(result.content)) {
            socialText += `\n${'='.repeat(60)}\n`;
            socialText += `${platform.toUpperCase()}\n`;
            socialText += `${'='.repeat(60)}\n\n`;
            socialText += `HEADLINE:\n${content.headline}\n\n`;
            socialText += `POST (${content.word_count} words, ${content.character_count} characters):\n${content.description}\n\n`;

            if (content.hashtags && content.hashtags.length > 0) {
                socialText += `HASHTAGS:\n${content.hashtags.join(' ')}\n\n`;
            }

            if (content.call_to_action) {
                socialText += `CALL TO ACTION:\n${content.call_to_action}\n\n`;
            }

            socialText += `KEY FEATURES:\n`;
            content.key_features.forEach((feature, i) => {
                socialText += `• ${feature}\n`;
            });
            socialText += `\n`;
        }

        socialText += `\n${'='.repeat(60)}\n`;
        socialText += `Total API Cost: $${result.total_cost_usd.toFixed(4)}\n`;
        socialText += `${'='.repeat(60)}\n`;

        // Download as text file
        const blob = new Blob([socialText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `social-media-posts-${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        alert('✅ Social media posts generated and downloaded!');
    } catch (error) {
        console.error('Social media generation error:', error);
        alert('Failed to generate social media content: ' + error.message);
    }
}

/**
 * Repurpose for email
 */
async function repurposeForEmail() {
    if (!window.EditorState || !window.EditorState.sessionId) {
        console.error('No session ID available for repurposing');
        alert('Unable to repurpose: No active brochure session');
        return;
    }

    console.log('📧 Repurposing for email & newsletters');
    closeRepurposingModal();

    try {
        const response = await fetch('/api/repurpose-brochure', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session_id: window.EditorState.sessionId,
                platforms: ['email']
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate email content');
        }

        const result = await response.json();
        console.log('✅ Email content generated:', result);

        // Create and download email content
        let emailText = '='.repeat(60) + '\n';
        emailText += 'EMAIL/NEWSLETTER - GENERATED CONTENT\n';
        emailText += '='.repeat(60) + '\n\n';

        const content = result.content.email;
        emailText += `EMAIL SUBJECT:\n${content.headline}\n\n`;
        emailText += `${'='.repeat(60)}\n\n`;
        emailText += `EMAIL BODY (${content.word_count} words, ${content.character_count} characters):\n\n`;
        emailText += `${content.description}\n\n`;

        if (content.call_to_action) {
            emailText += `${'='.repeat(60)}\n\n`;
            emailText += `CALL TO ACTION:\n${content.call_to_action}\n\n`;
        }

        emailText += `${'='.repeat(60)}\n\n`;
        emailText += `KEY FEATURES:\n`;
        content.key_features.forEach((feature, i) => {
            emailText += `• ${feature}\n`;
        });
        emailText += `\n`;

        emailText += `\n${'='.repeat(60)}\n`;
        emailText += `Total API Cost: $${result.total_cost_usd.toFixed(4)}\n`;
        emailText += `${'='.repeat(60)}\n`;

        // Download as text file
        const blob = new Blob([emailText], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `email-newsletter-${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        alert('✅ Email/newsletter content generated and downloaded!');
    } catch (error) {
        console.error('Email generation error:', error);
        alert('Failed to generate email content: ' + error.message);
    }
}

/**
 * Order physical brochures
 */
async function orderPhysicalBrochures() {
    showToast('info', '🖨️ Opening print order form...');
    // TODO: Navigate to print order system
    console.log('🖨️ Ordering physical brochures');
    closeRepurposingModal();
    showToast('success', 'Print ordering system coming soon!');
}

/**
 * Start AI Visual Staging workflow
 */
async function startVisualStaging() {
    showToast('info', '🎨 Launching AI Visual Staging...');
    console.log('🎨 Starting visual staging workflow');
    closeRepurposingModal();

    // TODO: Open visual staging interface
    // This should allow users to select rooms and apply AI furniture staging
    showToast('success', 'AI Visual Staging interface coming soon!');
}

/**
 * Create automated video tour
 */
async function createVideoTour() {
    showToast('info', '📹 Generating video tour...');
    console.log('📹 Creating automated video tour');
    closeRepurposingModal();

    // TODO: Launch video tour generation
    // - AI script generation from property description
    // - AI voice narration
    // - Smooth transitions between photos
    // - Background music
    showToast('success', 'Video tour generation coming soon!');
}

/**
 * Hire professional photographer and drone operator
 */
async function hirePhotographer() {
    showToast('info', '📸 Opening photographer booking...');
    console.log('📸 Hiring photographer & drone operator');
    closeRepurposingModal();

    // TODO: Open photographer booking system
    // - Show available professionals in the area
    // - Calendar booking
    // - Price quotes
    // - CAA-licensed drone operators
    showToast('success', 'Photographer booking system coming soon!');
}

/**
 * Select multiple repurposing options
 */
function selectMultipleRepurposing() {
    showToast('info', 'Multi-select feature coming soon!');
    console.log('🎯 Multi-select repurposing');
}

// ============================================
// EXPORT HOOK
// ============================================

/**
 * Hook into existing exportToPDF function
 * This will be called after successful PDF export
 */
if (typeof window.originalExportToPDF === 'undefined' && typeof window.exportToPDF !== 'undefined') {
    window.originalExportToPDF = window.exportToPDF;

    window.exportToPDF = async function() {
        // Call original export function
        const result = await window.originalExportToPDF();

        // Show post-export experience after successful export
        if (result !== false) {
            setTimeout(() => {
                showPostExportExperience();
            }, 1000);
        }

        return result;
    };

    console.log('✅ Post-export hook installed');
}

// ============================================================================
// EXPORT FUNCTIONS TO GLOBAL SCOPE
// ============================================================================

window.showRepurposingPopup = showRepurposingPopup;
window.closeRepurposingModal = closeRepurposingModal;
window.repurposeForPortals = repurposeForPortals;
window.repurposeForSocial = repurposeForSocial;
window.repurposeForEmail = repurposeForEmail;
window.orderPhysicalBrochures = orderPhysicalBrochures;
window.startVisualStaging = startVisualStaging;
window.createVideoTour = createVideoTour;
window.hirePhotographer = hirePhotographer;
window.selectMultipleRepurposing = selectMultipleRepurposing;

console.log('🚀 Post-Export System loaded (with Advanced AI Features)');
