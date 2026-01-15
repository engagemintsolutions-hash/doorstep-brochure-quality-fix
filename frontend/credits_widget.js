// Credits & Plan Widget
console.log('💳 Credits widget loaded');

// Fetch and display user credits/plan
async function loadCreditsWidget() {
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
        console.log('⚠️ No user email found - credits widget hidden');
        return;
    }

    try {
        const response = await fetch(`/usage/check?user_email=${encodeURIComponent(userEmail)}`);
        const data = await response.json();

        console.log('📊 Usage data:', data);

        // Extract usage object from response
        const usageData = data.usage || data;

        displayCreditsWidget(usageData);
    } catch (error) {
        console.error('❌ Error loading credits:', error);
        // Show default widget with error state
        displayCreditsWidget({
            is_trial: true,
            trial_brochures_used: 0,
            trial_limit: 5,
            subscription_tier: null,
            error: true
        });
    }
}

// Display the credits widget in the UI
function displayCreditsWidget(usageData) {
    const theme = window.getCurrentTheme ? window.getCurrentTheme() : { primary: '#C20430', secondary: '#9E0328' };

    // Remove existing widget if present
    const existing = document.getElementById('creditsWidget');
    if (existing) existing.remove();

    const widget = document.createElement('div');
    widget.id = 'creditsWidget';
    widget.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: white;
        border: 3px solid ${theme.primary};
        border-radius: 16px;
        padding: 1.25rem;
        width: 280px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        z-index: 998;
    `;

    let content = '';

    if (usageData.error) {
        // Error state
        content = `
            <div style="text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">⚠️</div>
                <div style="font-size: 0.9rem; color: #666;">Unable to load plan</div>
            </div>
        `;
    } else if (usageData.is_trial) {
        // Trial user
        const remaining = usageData.trial_limit - usageData.trial_brochures_used;
        const usedPercent = (usageData.trial_brochures_used / usageData.trial_limit) * 100;

        content = `
            <div style="text-align: center; margin-bottom: 1rem;">
                <div style="font-size: 1.1rem; font-weight: 700; color: ${theme.primary}; margin-bottom: 0.25rem;">Free Trial</div>
                <div style="font-size: 0.85rem; color: #666;">No credit card required</div>
            </div>

            <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="font-size: 0.9rem; color: #333; font-weight: 600;">Brochures Remaining</span>
                    <span style="font-size: 1.1rem; font-weight: 700; color: ${remaining > 0 ? theme.primary : '#9E0328'};">${remaining} / ${usageData.trial_limit}</span>
                </div>

                <!-- Progress bar -->
                <div style="background: #f0f0f0; border-radius: 8px; height: 12px; overflow: hidden;">
                    <div style="
                        background: linear-gradient(90deg, ${theme.primary} 0%, ${theme.secondary} 100%);
                        height: 100%;
                        width: ${usedPercent}%;
                        transition: width 0.3s ease;
                        border-radius: 8px;
                    "></div>
                </div>
            </div>

            ${remaining <= 1 ? `
                <div style="background: #FFF3CD; border-left: 4px solid #FFC107; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem;">
                    <div style="font-size: 0.85rem; color: #856404;">
                        ${remaining === 0 ? '⚠️ Trial expired!' : '⚠️ Last free brochure!'}
                    </div>
                </div>
            ` : ''}

            <button onclick="showUpgradeModal()" style="
                width: 100%;
                background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%);
                color: white;
                border: none;
                padding: 0.85rem;
                border-radius: 8px;
                font-weight: 700;
                font-size: 0.95rem;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.25)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.15)'">
                🚀 Upgrade to Unlimited
            </button>

            <div style="text-align: center; margin-top: 0.75rem;">
                <a href="#" onclick="showPricingDetails(); return false;" style="font-size: 0.85rem; color: ${theme.primary}; text-decoration: none;">View pricing →</a>
            </div>
        `;
    } else {
        // Subscribed user
        const tierNames = {
            'solo': 'Solo Agent',
            'small_agency': 'Small Agency',
            'medium_agency': 'Medium Agency',
            'enterprise': 'Enterprise'
        };

        const tierName = tierNames[usageData.subscription_tier] || usageData.subscription_tier;
        const isEnterprise = usageData.subscription_tier === 'enterprise';

        content = `
            <div style="text-align: center; margin-bottom: 1rem;">
                <div style="font-size: 1.1rem; font-weight: 700; color: ${theme.primary}; margin-bottom: 0.25rem;">${tierName} Plan</div>
                <div style="font-size: 0.85rem; color: #28a745; font-weight: 600;">✓ ${isEnterprise ? 'Custom Package' : 'Active Subscription'}</div>
            </div>

            <div style="margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="font-size: 0.9rem; color: #333;">Brochures Created</span>
                    <span style="font-size: 1.1rem; font-weight: 700; color: ${theme.primary};">${usageData.brochures_created}</span>
                </div>

                <div style="background: ${theme.primary}10; border-left: 4px solid ${theme.primary}; padding: 0.75rem; border-radius: 6px;">
                    <div style="font-size: 0.85rem; color: #333; font-weight: 600;">
                        ✨ Unlimited brochures
                    </div>
                    ${isEnterprise ? `
                        <div style="font-size: 0.8rem; color: #666; margin-top: 0.25rem;">
                            • Priority support
                        </div>
                        <div style="font-size: 0.8rem; color: #666;">
                            • Dedicated account manager
                        </div>
                        <div style="font-size: 0.8rem; color: #666;">
                            • Custom integrations
                        </div>
                    ` : ''}
                </div>
            </div>

            ${isEnterprise ? `
                <div style="text-align: center; padding: 0.75rem; background: linear-gradient(135deg, ${theme.primary}20 0%, ${theme.secondary}20 100%); border-radius: 8px;">
                    <div style="font-size: 0.85rem; color: #333; font-weight: 600;">
                        🏆 Premium Enterprise Partner
                    </div>
                </div>
            ` : `
                <button onclick="showManageSubscription()" style="
                    width: 100%;
                    background: white;
                    color: ${theme.primary};
                    border: 2px solid ${theme.primary};
                    padding: 0.75rem;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='${theme.primary}'; this.style.color='white'" onmouseout="this.style.background='white'; this.style.color='${theme.primary}'">
                    ⚙️ Manage Subscription
                </button>
            `}
        `;
    }

    widget.innerHTML = content;
    document.body.appendChild(widget);
}

// Show upgrade modal
function showUpgradeModal() {
    const theme = window.getCurrentTheme ? window.getCurrentTheme() : { primary: '#C20430', secondary: '#9E0328' };

    const modal = document.createElement('div');
    modal.id = 'upgradeModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 20px;
            padding: 2.5rem;
            max-width: 900px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: slideUp 0.4s ease;
        ">
            <div style="text-align: center; margin-bottom: 2rem;">
                <h2 style="font-size: 2rem; margin: 0 0 0.5rem 0; color: ${theme.primary};">🚀 Choose Your Plan</h2>
                <p style="font-size: 1rem; color: #666; margin: 0;">Unlimited brochures, professional features, priority support</p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                <!-- Solo Agent -->
                <div style="border: 3px solid ${theme.primary}; border-radius: 12px; padding: 1.5rem; text-align: center; transition: transform 0.3s ease;" onmouseover="this.style.transform='translateY(-8px)'" onmouseout="this.style.transform='translateY(0)'">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">👤</div>
                    <h3 style="margin: 0 0 0.5rem 0; color: ${theme.primary};">Solo Agent</h3>
                    <div style="font-size: 2rem; font-weight: 700; color: ${theme.primary}; margin: 0.75rem 0;">£49<span style="font-size: 1rem; font-weight: 400;">/mo</span></div>
                    <ul style="text-align: left; font-size: 0.9rem; color: #333; padding-left: 1.25rem; margin: 1rem 0;">
                        <li>Unlimited brochures</li>
                        <li>All marketing tools</li>
                        <li>Priority support</li>
                    </ul>
                    <button onclick="selectPlan('solo')" style="width: 100%; background: ${theme.primary}; color: white; border: none; padding: 0.75rem; border-radius: 8px; font-weight: 600; cursor: pointer;">Select Plan</button>
                </div>

                <!-- Small Agency -->
                <div style="border: 3px solid ${theme.secondary}; border-radius: 12px; padding: 1.5rem; text-align: center; position: relative; transition: transform 0.3s ease;" onmouseover="this.style.transform='translateY(-8px)'" onmouseout="this.style.transform='translateY(0)'">
                    <div style="position: absolute; top: -12px; right: 12px; background: ${theme.secondary}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 700;">POPULAR</div>
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">👥</div>
                    <h3 style="margin: 0 0 0.5rem 0; color: ${theme.secondary};">Small Agency</h3>
                    <div style="font-size: 2rem; font-weight: 700; color: ${theme.secondary}; margin: 0.75rem 0;">£99<span style="font-size: 1rem; font-weight: 400;">/mo</span></div>
                    <ul style="text-align: left; font-size: 0.9rem; color: #333; padding-left: 1.25rem; margin: 1rem 0;">
                        <li>Up to 5 agents</li>
                        <li>Unlimited brochures</li>
                        <li>Team collaboration</li>
                        <li>Dedicated support</li>
                    </ul>
                    <button onclick="selectPlan('small_agency')" style="width: 100%; background: ${theme.secondary}; color: white; border: none; padding: 0.75rem; border-radius: 8px; font-weight: 600; cursor: pointer;">Select Plan</button>
                </div>

                <!-- Medium Agency -->
                <div style="border: 3px solid ${theme.primary}; border-radius: 12px; padding: 1.5rem; text-align: center; transition: transform 0.3s ease;" onmouseover="this.style.transform='translateY(-8px)'" onmouseout="this.style.transform='translateY(0)'">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏢</div>
                    <h3 style="margin: 0 0 0.5rem 0; color: ${theme.primary};">Medium Agency</h3>
                    <div style="font-size: 2rem; font-weight: 700; color: ${theme.primary}; margin: 0.75rem 0;">£199<span style="font-size: 1rem; font-weight: 400;">/mo</span></div>
                    <ul style="text-align: left; font-size: 0.9rem; color: #333; padding-left: 1.25rem; margin: 1rem 0;">
                        <li>Up to 20 agents</li>
                        <li>Advanced analytics</li>
                        <li>Custom branding</li>
                        <li>Priority support</li>
                    </ul>
                    <button onclick="selectPlan('medium_agency')" style="width: 100%; background: ${theme.primary}; color: white; border: none; padding: 0.75rem; border-radius: 8px; font-weight: 600; cursor: pointer;">Select Plan</button>
                </div>

                <!-- Enterprise -->
                <div style="border: 3px solid #6c757d; border-radius: 12px; padding: 1.5rem; text-align: center; transition: transform 0.3s ease;" onmouseover="this.style.transform='translateY(-8px)'" onmouseout="this.style.transform='translateY(0)'">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏰</div>
                    <h3 style="margin: 0 0 0.5rem 0; color: #6c757d;">Enterprise</h3>
                    <div style="font-size: 2rem; font-weight: 700; color: #6c757d; margin: 0.75rem 0;">Custom</div>
                    <ul style="text-align: left; font-size: 0.9rem; color: #333; padding-left: 1.25rem; margin: 1rem 0;">
                        <li>Unlimited agents</li>
                        <li>White-label options</li>
                        <li>API access</li>
                        <li>Dedicated manager</li>
                    </ul>
                    <button onclick="contactSales()" style="width: 100%; background: #6c757d; color: white; border: none; padding: 0.75rem; border-radius: 8px; font-weight: 600; cursor: pointer;">Contact Sales</button>
                </div>
            </div>

            <div style="text-align: center;">
                <button onclick="closeUpgradeModal()" style="background: #f0f0f0; color: #333; border: none; padding: 0.75rem 2rem; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    Close
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function closeUpgradeModal() {
    const modal = document.getElementById('upgradeModal');
    if (modal) modal.remove();
}

function selectPlan(tier) {
    alert(`Selected plan: ${tier}\n\nPayment integration coming soon!\n\nFor now, this is a demo.`);
    closeUpgradeModal();
}

function contactSales() {
    alert('Enterprise Sales\n\nEmail: enterprise@doorstep.ai\nPhone: +44 20 1234 5678');
}

function showPricingDetails() {
    showUpgradeModal();
}

function showManageSubscription() {
    alert('Manage Subscription\n\nFeatures:\n- Update payment method\n- Change plan\n- Cancel subscription\n\n(Demo mode)');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for auth to load
    setTimeout(() => {
        const isAuthorized = localStorage.getItem('agentAuthorized') === 'true';
        if (isAuthorized) {
            loadCreditsWidget();
        }
    }, 500);
});

// Make functions globally available
window.loadCreditsWidget = loadCreditsWidget;
window.showUpgradeModal = showUpgradeModal;
window.closeUpgradeModal = closeUpgradeModal;
window.selectPlan = selectPlan;
window.contactSales = contactSales;
window.showPricingDetails = showPricingDetails;
window.showManageSubscription = showManageSubscription;

// Add CSS animations
(function() {
    const creditsWidgetStyle = document.createElement('style');
    creditsWidgetStyle.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(creditsWidgetStyle);
})();
