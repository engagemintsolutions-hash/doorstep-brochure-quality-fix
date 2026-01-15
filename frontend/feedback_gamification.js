/**
 * Feedback & Gamification System
 * Tracks time, collects feedback, and shows statistics after PDF export
 */

// Session tracking
let sessionStartTime = null;
let feedbackData = {
    experienceRating: null,
    qualityRating: null,
    feedbackText: '',
    timeSpentSeconds: 0,
    timeSavedSeconds: 0
};

// Constants
const MANUAL_BROCHURE_TIME_MINUTES = 120; // 2 hours manual time estimate
const AVERAGE_USER_TIME_MINUTES = 17.5; // Average between 15-20 minutes

/**
 * Initialize session tracking when brochure editor loads
 */
function initializeSessionTracking() {
    sessionStartTime = Date.now();
    console.log('📊 Session tracking started');
}

/**
 * Calculate time statistics
 */
function calculateTimeStats() {
    if (!sessionStartTime) {
        return {
            timeSpent: '0 min',
            timeSaved: '0 min',
            timeSpentSeconds: 0,
            timeSavedSeconds: 0
        };
    }

    const now = Date.now();
    const elapsedMs = now - sessionStartTime;
    const elapsedMinutes = Math.floor(elapsedMs / 1000 / 60);
    const elapsedSeconds = Math.floor(elapsedMs / 1000);

    // Calculate time saved (manual time - actual time)
    const savedMinutes = Math.max(0, MANUAL_BROCHURE_TIME_MINUTES - elapsedMinutes);
    const savedSeconds = savedMinutes * 60;

    return {
        timeSpent: formatTime(elapsedMinutes),
        timeSaved: formatTime(savedMinutes),
        timeSpentSeconds: elapsedSeconds,
        timeSavedSeconds: savedSeconds
    };
}

/**
 * Format time in a friendly way
 */
function formatTime(minutes) {
    if (minutes < 1) {
        return '< 1 min';
    } else if (minutes < 60) {
        return `${minutes} min`;
    } else {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
}

/**
 * Show feedback modal after PDF export
 */
function showFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    if (!modal) {
        console.error('Feedback modal not found');
        return;
    }

    // Calculate time stats
    const stats = calculateTimeStats();

    // Update time statistics in modal
    document.getElementById('timeSpent').textContent = stats.timeSpent;
    document.getElementById('timeSaved').textContent = stats.timeSaved;

    // Store in feedback data
    feedbackData.timeSpentSeconds = stats.timeSpentSeconds;
    feedbackData.timeSavedSeconds = stats.timeSavedSeconds;

    // Reset ratings
    resetRatings();

    // Clear feedback text
    document.getElementById('feedbackText').value = '';
    document.getElementById('feedbackCharCount').textContent = '0';

    // Hide thank you message
    document.getElementById('thankYouMessage').style.display = 'none';

    // Show modal
    modal.style.display = 'flex';

    console.log('📊 Feedback modal shown', stats);
}

/**
 * Close feedback modal
 */
function closeFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Set rating for experience or quality
 */
function setRating(type, rating) {
    console.log(`Setting ${type} rating to ${rating}`);

    const containerId = type === 'experience' ? 'experienceRating' : 'qualityRating';
    const container = document.getElementById(containerId);

    if (!container) return;

    // Update data
    if (type === 'experience') {
        feedbackData.experienceRating = rating;
    } else {
        feedbackData.qualityRating = rating;
    }

    // Reset all buttons in this container
    const buttons = container.querySelectorAll('.emoji-btn');
    buttons.forEach((btn, index) => {
        const btnRating = index + 1;
        if (btnRating === rating) {
            // Selected: full color, larger
            btn.style.filter = 'grayscale(0%)';
            btn.style.transform = 'scale(1.2)';
            btn.style.opacity = '1';
        } else {
            // Not selected: grayscale, normal size
            btn.style.filter = 'grayscale(100%)';
            btn.style.transform = 'scale(1)';
            btn.style.opacity = '0.5';
        }
    });
}

/**
 * Reset all ratings
 */
function resetRatings() {
    feedbackData.experienceRating = null;
    feedbackData.qualityRating = null;

    // Reset visual state
    ['experienceRating', 'qualityRating'].forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            const buttons = container.querySelectorAll('.emoji-btn');
            buttons.forEach(btn => {
                btn.style.filter = 'grayscale(100%)';
                btn.style.transform = 'scale(1)';
                btn.style.opacity = '1';
            });
        }
    });
}

/**
 * Skip feedback
 */
function skipFeedback() {
    console.log('User skipped feedback');
    closeFeedbackModal();
}

/**
 * Submit feedback to backend
 */
async function submitFeedback() {
    console.log('Submitting feedback...', feedbackData);

    // Get feedback text
    const feedbackTextEl = document.getElementById('feedbackText');
    feedbackData.feedbackText = feedbackTextEl ? feedbackTextEl.value.trim() : '';

    // Validate at least one rating is provided
    if (!feedbackData.experienceRating && !feedbackData.qualityRating && !feedbackData.feedbackText) {
        alert('Please provide at least one rating or feedback comment.');
        return;
    }

    try {
        // Prepare payload
        const payload = {
            experience_rating: feedbackData.experienceRating,
            quality_rating: feedbackData.qualityRating,
            feedback_text: feedbackData.feedbackText,
            time_spent_seconds: feedbackData.timeSpentSeconds,
            time_saved_seconds: feedbackData.timeSavedSeconds,
            user_email: localStorage.getItem('userEmail') || 'anonymous',
            property_address: brochureData?.metadata?.address || 'unknown',
            timestamp: new Date().toISOString()
        };

        console.log('Sending feedback payload:', payload);

        // Send to backend
        const response = await fetch('/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();
        console.log('Feedback submitted successfully:', result);

        // Show thank you message
        showThankYouMessage();

        // Close modal after 2 seconds
        setTimeout(() => {
            closeFeedbackModal();
        }, 2000);

    } catch (error) {
        console.error('Failed to submit feedback:', error);

        // Still show thank you (graceful failure)
        showThankYouMessage();
        setTimeout(() => {
            closeFeedbackModal();
        }, 2000);
    }
}

/**
 * Show thank you message
 */
function showThankYouMessage() {
    const thankYou = document.getElementById('thankYouMessage');
    const buttons = document.querySelectorAll('#feedbackModal .modal-body > div:last-of-type button');

    if (thankYou) {
        thankYou.style.display = 'block';
    }

    // Hide buttons
    buttons.forEach(btn => {
        btn.style.display = 'none';
    });
}

/**
 * Update character count for feedback text
 */
function updateCharacterCount() {
    const textarea = document.getElementById('feedbackText');
    const counter = document.getElementById('feedbackCharCount');

    if (textarea && counter) {
        counter.textContent = textarea.value.length;
    }
}

/**
 * Initialize feedback system
 */
function initializeFeedbackSystem() {
    console.log('🎮 Initializing feedback & gamification system');

    // Start session tracking
    initializeSessionTracking();

    // Add character counter listener
    const textarea = document.getElementById('feedbackText');
    if (textarea) {
        textarea.addEventListener('input', updateCharacterCount);
    }

    // Log initial state
    console.log('📊 Session start time:', new Date(sessionStartTime).toISOString());
    console.log('📊 Manual brochure time estimate:', MANUAL_BROCHURE_TIME_MINUTES, 'minutes');
    console.log('📊 Average user time:', AVERAGE_USER_TIME_MINUTES, 'minutes');
}

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFeedbackSystem);
} else {
    initializeFeedbackSystem();
}

// Export functions for use in other scripts
window.showFeedbackModal = showFeedbackModal;
window.closeFeedbackModal = closeFeedbackModal;
window.setRating = setRating;
window.submitFeedback = submitFeedback;
window.skipFeedback = skipFeedback;
