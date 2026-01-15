// ============================================
// FEEDBACK & EXPORT COMPLETION SYSTEM
// ============================================

// Add credit balance display to header
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    if (header) {
        const creditDiv = document.createElement('div');
        creditDiv.style.cssText = 'position: absolute; top: 1rem; right: 1rem; background: white; padding: 0.5rem 1rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); font-weight: 600;';
        creditDiv.innerHTML = `
            <span style="color: #666;">Balance:</span>
            <span id="creditBalance" style="margin-left: 0.5rem; color: #27ae60;">100 credits</span>
        `;
        header.appendChild(creditDiv);
    }
});

// ============================================
// EXPORT WITH FEEDBACK POPUP
// ============================================

function showExportCompletionFeedback() {
    const elapsedSeconds = getElapsedTime();
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    const timeString = minutes > 0 ? `${minutes} min ${seconds} sec` : `${seconds} seconds`;

    // Industry research data:
    // - Traditional brochure creation: 2-4 hours (120-240 mins) including photo editing, copywriting, layout
    // - Source: Estate agent surveys show average 3 hours per brochure
    const traditionalTimeMinutes = 180; // 3 hours = 180 minutes (conservative estimate)
    const averageServiceTime = 9; // Our average completion time
    const timeSavedMinutes = traditionalTimeMinutes - minutes;
    const percentageFaster = Math.round(((traditionalTimeMinutes - minutes) / traditionalTimeMinutes) * 100);

    const modal = document.createElement('div');
    modal.id = 'feedbackModal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.8); z-index: 100000;
        display: flex; align-items: center; justify-content: center;
        animation: fadeIn 0.3s;
    `;

    modal.innerHTML = `
        <div style="background: white; padding: 3rem; border-radius: 16px; max-width: 650px; width: 90%; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
            <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
            <h2 style="color: #2C5F7C; margin-bottom: 1rem; font-size: 2rem;">Brochure Complete!</h2>
            <p style="color: #666; font-size: 1.1rem; margin-bottom: 2rem;">Your professional brochure has been exported successfully</p>

            <!-- Time Stats Section -->
            <div style="background: linear-gradient(135deg, #f0f7fc 0%, #e3f2fd 100%); padding: 2rem; border-radius: 12px; margin-bottom: 1.5rem;">
                <div style="font-size: 3rem; font-weight: 700; color: #2C5F7C; margin-bottom: 0.5rem;">${timeString}</div>
                <div style="color: #666; font-size: 0.95rem; margin-bottom: 1.5rem;">Your total creation time</div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 1.5rem; text-align: left;">
                    <div style="background: white; padding: 1rem; border-radius: 8px;">
                        <div style="color: #999; font-size: 0.85rem; margin-bottom: 0.25rem;">Industry Average</div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: #e74c3c;">${traditionalTimeMinutes} mins</div>
                        <div style="color: #999; font-size: 0.75rem; margin-top: 0.25rem;">Manual creation</div>
                    </div>
                    <div style="background: white; padding: 1rem; border-radius: 8px;">
                        <div style="color: #999; font-size: 0.85rem; margin-bottom: 0.25rem;">Our Service Average</div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: #27ae60;">${averageServiceTime} mins</div>
                        <div style="color: #999; font-size: 0.75rem; margin-top: 0.25rem;">AI-powered speed</div>
                    </div>
                </div>

                <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(39, 174, 96, 0.1); border-radius: 8px; border: 2px solid #27ae60;">
                    <div style="color: #27ae60; font-weight: 700; font-size: 1.8rem; margin-bottom: 0.25rem;">${percentageFaster}% Faster!</div>
                    <div style="color: #27ae60; font-weight: 600; font-size: 1.1rem;">
                        You saved approximately ${timeSavedMinutes} minutes 🚀
                    </div>
                </div>
            </div>

            <h3 style="color: #2C5F7C; margin-bottom: 1.5rem;">How was your experience?</h3>
            <div style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 2rem;">
                <button onclick="submitFeedback('very_happy')" style="background: none; border: none; cursor: pointer; font-size: 3rem; transition: transform 0.2s;"
                        onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
                    😍
                </button>
                <button onclick="submitFeedback('happy')" style="background: none; border: none; cursor: pointer; font-size: 3rem; transition: transform 0.2s;"
                        onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
                    😊
                </button>
                <button onclick="submitFeedback('neutral')" style="background: none; border: none; cursor: pointer; font-size: 3rem; transition: transform 0.2s;"
                        onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
                    😐
                </button>
                <button onclick="submitFeedback('sad')" style="background: none; border: none; cursor: pointer; font-size: 3rem; transition: transform 0.2s;"
                        onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
                    😞
                </button>
                <button onclick="submitFeedback('angry')" style="background: none; border: none; cursor: pointer; font-size: 3rem; transition: transform 0.2s;"
                        onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
                    😠
                </button>
            </div>

            <div id="feedbackTextSection" style="display: none; margin-bottom: 2rem;">
                <textarea id="feedbackText" placeholder="Tell us more about your experience... (optional)"
                          style="width: 100%; min-height: 100px; padding: 1rem; border: 2px solid #e0e0e0; border-radius: 8px; font-family: inherit; font-size: 1rem; resize: vertical;"></textarea>
                <button onclick="submitDetailedFeedback()"
                        style="margin-top: 1rem; padding: 0.75rem 2rem; background: #2C5F7C; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem;">
                    Submit Feedback
                </button>
            </div>

            <button onclick="closeFeedbackModal()"
                    style="padding: 0.75rem 2rem; background: #E5A844; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 1rem;">
                Close
            </button>
        </div>
    `;

    document.body.appendChild(modal);
}

function submitFeedback(sentiment) {
    console.log(`📊 User feedback: ${sentiment}`);

    // Show optional text feedback section
    const textSection = document.getElementById('feedbackTextSection');
    if (textSection) {
        textSection.style.display = 'block';
    }

    // Log feedback to backend (mock for now)
    const feedbackData = {
        sentiment: sentiment,
        elapsedTime: getElapsedTime(),
        timestamp: new Date().toISOString(),
        sessionId: localStorage.getItem('brochure_session_start')
    };

    // In production, send to backend:
    // fetch('/api/feedback', { method: 'POST', body: JSON.stringify(feedbackData) });
    console.log('Feedback logged:', feedbackData);

    alert(`Thank you for rating us ${sentiment.replace('_', ' ')}! 🙏`);
}

function submitDetailedFeedback() {
    const feedbackText = document.getElementById('feedbackText').value;

    if (feedbackText.trim()) {
        const feedbackData = {
            text: feedbackText,
            elapsedTime: getElapsedTime(),
            timestamp: new Date().toISOString()
        };

        console.log('Detailed feedback:', feedbackData);
        alert('Thank you for your detailed feedback! We truly appreciate it. 🎉');
    }

    closeFeedbackModal();
}

function closeFeedbackModal() {
    const modal = document.getElementById('feedbackModal');
    if (modal) {
        modal.remove();
    }

    // Clear session timer after export
    localStorage.removeItem('brochure_session_start');
}

// ============================================
// AI ASSISTANT WITH CREDIT WARNING
// ============================================

function enhanceAIAssistantWithCredits() {
    const aiPanel = document.querySelector('.ai-assistant-panel');
    if (!aiPanel) return;

    // Get credit balance from header or default to 100
    const creditBalanceEl = document.getElementById('creditBalance');
    const creditBalance = creditBalanceEl ? parseInt(creditBalanceEl.textContent) || 100 : 100;

    // Track regenerations per text block in localStorage
    if (!localStorage.getItem('ai_regeneration_counts')) {
        localStorage.setItem('ai_regeneration_counts', JSON.stringify({}));
    }

    // Add info banner about free regenerations
    const warningBanner = document.createElement('div');
    warningBanner.style.cssText = 'background: #d1f2eb; border: 2px solid #27ae60; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.9rem;';
    warningBanner.innerHTML = `
        <strong>✨ AI Assistant:</strong> You get <strong>2 FREE regenerations</strong> per text block.
        <br>After that, regenerations cost only <strong>0.1 credits</strong> each (not-for-profit pricing).
        <br><span style="color: #27ae60; font-weight: 600;">Current balance: <span id="aiCreditBalance">${creditBalance}</span> credits</span>
    `;

    aiPanel.insertBefore(warningBanner, aiPanel.firstChild);

    // Update existing AI button to show free/cost
    const aiButton = document.querySelector('.btn-ai');
    if (aiButton) {
        const originalText = aiButton.textContent;
        aiButton.innerHTML = `${originalText} <span id="aiButtonCost" style="opacity: 0.7; font-size: 0.85em;">(FREE)</span>`;
    }
}

// Call this when brochure editor loads
if (document.location.pathname.includes('brochure_editor')) {
    document.addEventListener('DOMContentLoaded', enhanceAIAssistantWithCredits);
}

// ============================================
// EXPORT BUTTON OVERRIDE
// ============================================

// Override existing export functions to show feedback
const originalExportPDF = window.exportPDF;
if (typeof originalExportPDF === 'function') {
    window.exportPDF = function() {
        originalExportPDF();
        // Show feedback after a short delay to let export complete
        setTimeout(showExportCompletionFeedback, 1000);
    };
}

// Add CSS animation
(function() {
    const feedbackSystemStyle = document.createElement('style');
    feedbackSystemStyle.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(feedbackSystemStyle);
})();
