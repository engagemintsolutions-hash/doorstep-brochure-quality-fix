// Dynamic Theming System
console.log('🎨 Theme system loaded');

// Theme configurations
const THEMES = {
    doorstep: {
        name: 'Doorstep',
        primary: '#4A1420',      // Doorstep Burgundy
        primaryDark: '#3a0f18',
        primaryDarker: '#2a0b12',
        secondary: '#C4975A',    // Gold accent
        secondaryDark: '#a67d48',
        secondaryDarker: '#8a6838',
        primaryLight: 'rgba(74, 20, 32, 0.05)',
        secondaryLight: 'rgba(196, 151, 90, 0.05)',
        gradientStart: '#f9f7f3',
        gradientEnd: '#f5f1e8',
        radialPrimary: 'rgba(74, 20, 32, 0.15)',
        radialSecondary: 'rgba(196, 151, 90, 0.08)',
        logo: '/static/images/doorstep-logo.png'
    },
    savills: {
        name: 'Savills',
        primary: '#C8102E',      // Savills Red
        primaryDark: '#A00D25',
        primaryDarker: '#8A0B20',
        secondary: '#FFD500',    // Savills Yellow
        secondaryDark: '#E6C000',
        secondaryDarker: '#CCA800',
        primaryLight: 'rgba(200, 16, 46, 0.05)',
        secondaryLight: 'rgba(255, 213, 0, 0.05)',
        gradientStart: '#FFF9E6',
        gradientEnd: '#FFE8E8',
        radialPrimary: 'rgba(200, 16, 46, 0.23)',
        radialSecondary: 'rgba(255, 213, 0, 0.23)',
        logo: '/static/savills-logo.svg'
    }
};

// Get current theme from localStorage
function getCurrentTheme() {
    // Check new multi-tenant auth system first (orgId)
    const orgId = localStorage.getItem('orgId');

    if (orgId && orgId.toLowerCase() === 'savills') {
        return THEMES.savills;
    }

    // Fallback to old username-based system for backward compatibility
    const username = localStorage.getItem('agentUsername');

    if (username && username.toLowerCase() === 'savills') {
        return THEMES.savills;
    }

    return THEMES.doorstep;
}

// Apply theme to page
function applyTheme(theme) {
    console.log('🎨 Applying theme:', theme.name);

    // Update CSS variables
    document.documentElement.style.setProperty('--primary-color', theme.primary);
    document.documentElement.style.setProperty('--primary-dark', theme.primaryDark);
    document.documentElement.style.setProperty('--primary-darker', theme.primaryDarker);
    document.documentElement.style.setProperty('--secondary-color', theme.secondary);
    document.documentElement.style.setProperty('--secondary-dark', theme.secondaryDark);
    document.documentElement.style.setProperty('--secondary-darker', theme.secondaryDarker);

    // Update body background
    const body = document.body;
    if (body) {
        body.style.background = `linear-gradient(135deg, ${theme.gradientStart} 0%, #ffffff 50%, ${theme.gradientEnd} 100%)`;
    }

    // Update body::before (radial gradients)
    const styleId = 'dynamic-theme-style';
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
        body::before {
            background-image:
                radial-gradient(circle at 10% 20%, ${theme.radialPrimary} 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, ${theme.radialSecondary} 0%, transparent 40%) !important;
        }

        /* Update all primary color elements */
        .btn-primary,
        .accordion-header,
        input:focus,
        select:focus,
        textarea:focus {
            border-color: ${theme.primary} !important;
        }

        input:focus,
        select:focus,
        textarea:focus {
            box-shadow: 0 0 0 3px ${theme.primaryLight} !important;
        }

        .form-section h2 {
            color: ${theme.primary} !important;
            border-left-color: ${theme.secondary} !important;
            background: linear-gradient(90deg, ${theme.secondaryLight} 0%, transparent 100%) !important;
        }

        /* Accordion collapsed state - TEAL for Doorstep, YELLOW for Savills */
        .accordion-header {
            background: linear-gradient(135deg, ${theme.name === 'Savills' ? theme.secondary : theme.primary} 0%, ${theme.name === 'Savills' ? theme.secondaryDark : theme.primaryDark} 100%) !important;
            border-color: ${theme.name === 'Savills' ? theme.secondaryDark : theme.primaryDark} !important;
            border-left-color: ${theme.name === 'Savills' ? theme.secondaryDarker : theme.primaryDarker} !important;
            box-shadow: 0 2px 8px ${theme.name === 'Savills' ? theme.secondaryLight : theme.primaryLight} !important;
        }

        .accordion-header h2,
        .accordion-header .accordion-icon,
        .accordion-header .accordion-status {
            color: ${theme.name === 'Savills' ? theme.primary : '#ffffff'} !important;
        }

        /* Accordion expanded state - SECONDARY for Doorstep (coral), PRIMARY for Savills (red) */
        .accordion-header[data-expanded="true"] {
            background: linear-gradient(135deg, ${theme.name === 'Savills' ? theme.primary : theme.secondary} 0%, ${theme.name === 'Savills' ? theme.primaryDark : theme.secondaryDark} 100%) !important;
            border-color: ${theme.name === 'Savills' ? theme.primaryDark : theme.secondaryDark} !important;
            border-left-color: ${theme.name === 'Savills' ? theme.primaryDarker : theme.secondaryDarker} !important;
            box-shadow: 0 3px 10px ${theme.name === 'Savills' ? theme.primaryLight : theme.secondaryLight} !important;
        }

        .accordion-header[data-expanded="true"] h2,
        .accordion-header[data-expanded="true"] .accordion-icon,
        .accordion-header[data-expanded="true"] .accordion-status {
            color: #ffffff !important;
        }

        /* Progress percentage - CORAL for Doorstep, RED for Savills */
        #progressPercentage {
            color: ${theme.name === 'Savills' ? theme.primary : theme.secondary} !important;
        }

        /* Progress tracker container */
        #completionTracker {
            border: 2px solid ${theme.name === 'Savills' ? theme.secondary : theme.primary} !important;
        }

        /* Progress checkmarks - use appropriate color */
        .progress-tracker span:before {
            color: ${theme.secondary} !important;
        }

        /* Generate button - TEAL for Doorstep, RED for Savills */
        button[type="submit"],
        .btn-primary,
        #generateBtn {
            background: linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDark} 100%) !important;
            border: none !important;
        }

        button[type="submit"]:hover,
        .btn-primary:hover,
        #generateBtn:hover {
            background: linear-gradient(135deg, ${theme.primaryDark} 0%, ${theme.primaryDarker} 100%) !important;
        }

        /* Checkboxes */
        input[type="checkbox"]:checked {
            background: ${theme.secondary} !important;
            border-color: ${theme.secondary} !important;
        }

        /* Links and highlights */
        a, .text-primary {
            color: ${theme.primary} !important;
        }

        /* Upload zone hover */
        .image-upload-zone:hover,
        .floor-plan-upload-zone:hover {
            border-color: ${theme.primary} !important;
        }

        /* Photo Assignment Section */
        #photoAssignmentSection h3 {
            color: ${theme.primary} !important;
        }

        .category-section {
            border-color: ${theme.primary} !important;
        }

        .category-section:hover {
            border-color: ${theme.primaryDark} !important;
            box-shadow: 0 4px 12px ${theme.primaryLight} !important;
        }

        .category-section > div:first-child > div:first-child > div:first-child {
            color: ${theme.primary} !important;
        }

        /* Photo assignment selected photo border */
        .image-preview-item.selected {
            border-color: ${theme.primary} !important;
        }

        /* Progress tracker for photo assignment */
        .photo-progress-tracker {
            border-color: ${theme.name === 'Savills' ? theme.secondary : theme.primary} !important;
            background: ${theme.name === 'Savills' ? 'linear-gradient(135deg, #FFD500 0%, #FFF9E6 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'} !important;
        }

        .photo-progress-tracker .progress-header {
            color: ${theme.name === 'Savills' ? theme.primary : '#2c3e50'} !important;
        }

        .photo-progress-tracker #photoProgressPercent {
            color: ${theme.primary} !important;
            font-weight: bold !important;
        }

        .progress-bar-fill {
            background: linear-gradient(90deg, ${theme.primary} 0%, ${theme.primaryDark} 100%) !important;
        }

        .progress-bar-track {
            background: ${theme.name === 'Savills' ? '#FFE8E8' : '#e9ecef'} !important;
        }

        .requirement {
            font-size: 0.85rem !important;
        }

        /* Category photos scrollable area */
        .category-photos {
            max-height: 200px !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
        }

        /* Custom scrollbar for category photos */
        .category-photos::-webkit-scrollbar {
            width: 6px;
        }

        .category-photos::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
        }

        .category-photos::-webkit-scrollbar-thumb {
            background: ${theme.primary};
            border-radius: 3px;
        }

        .category-photos::-webkit-scrollbar-thumb:hover {
            background: ${theme.primaryDark};
        }

        /* Category assignment grid - better max height control */
        .category-assignment-grid {
            max-height: 600px !important;
            overflow-y: auto !important;
            padding-right: 0.5rem !important;
        }

        /* Custom scrollbar for category grid */
        .category-assignment-grid::-webkit-scrollbar {
            width: 8px;
        }

        .category-assignment-grid::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }

        .category-assignment-grid::-webkit-scrollbar-thumb {
            background: ${theme.secondary};
            border-radius: 4px;
        }

        .category-assignment-grid::-webkit-scrollbar-thumb:hover {
            background: ${theme.secondaryDark};
        }
    `;

    // Update logo if it exists
    updateLogo(theme);

    console.log('✅ Theme applied:', theme.name);
}

// Update logo in header
function updateLogo(theme) {
    const logoImg = document.querySelector('header img[src*="logo"]');
    if (logoImg && theme.logo) {
        logoImg.src = theme.logo;
        logoImg.alt = theme.name + ' Logo';
    }
}

// Initialize theme on page load
function initializeTheme() {
    const theme = getCurrentTheme();
    applyTheme(theme);
}

// Export functions
window.getCurrentTheme = getCurrentTheme;
window.applyTheme = applyTheme;
window.initializeTheme = initializeTheme;
window.THEMES = THEMES;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTheme);
} else {
    initializeTheme();
}
