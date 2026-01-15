// Authentication System
console.log('🔐 Auth system loaded');

// Check if user is authorized (NO AUTO-REDIRECT)
function checkAuth() {
    const isAuthorized = localStorage.getItem('agentAuthorized') === 'true';
    const username = localStorage.getItem('agentUsername');
    const loginTime = localStorage.getItem('agentLoginTime');

    console.log('🔍 Auth check:', { isAuthorized, username, loginTime });

    if (!isAuthorized) {
        console.log('❌ Not authorized - showing login button');
        return false;
    }

    // Check session age (optional - expires after 24 hours)
    if (loginTime) {
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursSinceLogin = (now - loginDate) / (1000 * 60 * 60);

        if (hoursSinceLogin > 24) {
            console.log('⏰ Session expired - logging out');
            logout();
            return false;
        }
    }

    console.log('✅ Authorized:', username);
    return true;
}

// Logout function
function logout() {
    console.log('🚪 Logging out');
    localStorage.removeItem('agentAuthorized');
    localStorage.removeItem('agentUsername');
    localStorage.removeItem('agentLoginTime');
    window.location.href = '/static/index.html';
}

// Add login button to page (when not logged in)
function addLoginButton() {
    const header = document.querySelector('header');
    if (header) {
        const loginDiv = document.createElement('div');
        loginDiv.id = 'authButton';
        loginDiv.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 1rem;
            z-index: 1000;
        `;

        loginDiv.innerHTML = `
            <button
                onclick="window.location.href='/static/login.html'"
                style="
                    background: linear-gradient(135deg, var(--primary-color, #C20430) 0%, var(--primary-dark, #138496) 100%);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                "
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0, 0, 0, 0.15)'"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0, 0, 0, 0.1)'"
            >
                <span style="font-size: 1.1rem;">🔐</span>
                <span>Agent Login</span>
            </button>
        `;

        header.style.position = 'relative';
        header.appendChild(loginDiv);
    }
}

// Add logout button to page (when logged in)
function addLogoutButton() {
    const username = localStorage.getItem('agentUsername') || 'Agent';
    const theme = window.getCurrentTheme ? window.getCurrentTheme() : null;
    const primaryColor = theme ? theme.primary : '#C20430';

    const header = document.querySelector('header');
    if (header) {
        const logoutDiv = document.createElement('div');
        logoutDiv.id = 'authButton';
        logoutDiv.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 1rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            background: white;
            padding: 0.75rem 1.25rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border: 2px solid ${primaryColor};
            z-index: 1000;
        `;

        logoutDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.25rem;">👤</span>
                <div style="text-align: left;">
                    <div style="font-size: 0.75rem; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px;">Agent</div>
                    <div style="font-weight: 600; color: ${primaryColor}; font-size: 0.95rem;">${username}</div>
                </div>
            </div>
            <button
                onclick="logout()"
                style="
                    background: #9E0328;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: all 0.2s ease;
                "
                onmouseover="this.style.background='#ee5a5a'"
                onmouseout="this.style.background='#9E0328'"
            >
                Logout
            </button>
        `;

        header.style.position = 'relative';
        header.appendChild(logoutDiv);
    }
}

// Run auth check on page load
document.addEventListener('DOMContentLoaded', () => {
    // Wait for theme to initialize
    setTimeout(() => {
        if (checkAuth()) {
            addLogoutButton();
        } else {
            addLoginButton();
        }
    }, 100);
});

// Make logout function globally available
window.logout = logout;
