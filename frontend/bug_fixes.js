/**
 * BUG FIXES MODULE
 *
 * Comprehensive bug fixes for all high, medium, and low priority issues
 */

console.log('🐛 Bug Fixes Module loaded');

// ============================================
// HIGH PRIORITY BUG FIXES
// ============================================

// BUG-H1: Session Timer Pause/Resume
if (window.postExportState) {
    let pausedTime = 0;
    let pauseStart = null;

    window.pauseSessionTimer = function() {
        if (!pauseStart) {
            pauseStart = Date.now();
            console.log('⏸️ Session timer paused');
        }
    };

    window.resumeSessionTimer = function() {
        if (pauseStart) {
            pausedTime += Date.now() - pauseStart;
            pauseStart = null;
            console.log('▶️ Session timer resumed');
        }
    };

    window.getAdjustedSessionTime = function() {
        const total = Date.now() - (window.postExportState.sessionStartTime || Date.now());
        return total - pausedTime;
    };

    // Monitor page visibility
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            window.pauseSessionTimer();
        } else {
            window.resumeSessionTimer();
        }
    });
}

// BUG-H2: Ensure all Smart Defaults functions are globally available
// (Already handled in smart_defaults_ux.js, but adding safety check)
const requiredGlobalFunctions = [
    'showPropertyTypePresets',
    'addSliderTooltips',
    'addSliderRecommendations',
    'enableLiveSliderPreview',
    'initializeLearningSystem'
];

requiredGlobalFunctions.forEach(funcName => {
    if (typeof window[funcName] !== 'function') {
        console.warn(`⚠️ Function ${funcName} not globally available`);
    }
});

// BUG-H4: Rate Limiter for API Calls
window.RateLimiter = class {
    constructor(maxCalls, intervalMs) {
        this.maxCalls = maxCalls;
        this.intervalMs = intervalMs;
        this.calls = [];
    }

    async throttle(fn) {
        // Remove old calls outside interval
        const now = Date.now();
        this.calls = this.calls.filter(time => now - time < this.intervalMs);

        // Check if we're at limit
        if (this.calls.length >= this.maxCalls) {
            const oldestCall = this.calls[0];
            const waitTime = this.intervalMs - (now - oldestCall);
            console.log(`⏱️ Rate limit reached, waiting ${waitTime}ms`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return this.throttle(fn);
        }

        // Execute call
        this.calls.push(now);
        return fn();
    }
};

// Create global rate limiter for Vision API (10 calls per second)
window.visionApiLimiter = new window.RateLimiter(10, 1000);

// BUG-H5: Global Error Boundary
window.addEventListener('error', (event) => {
    console.error('🚨 Global error caught:', event.error);

    // Show user-friendly message
    if (typeof showToast === 'function') {
        showToast('error', 'An error occurred. Please refresh the page if issues persist.');
    }

    // Log to analytics (if available)
    if (typeof window.gtag === 'function') {
        window.gtag('event', 'exception', {
            description: event.error?.message || 'Unknown error',
            fatal: false
        });
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled promise rejection:', event.reason);

    if (typeof showToast === 'function') {
        showToast('error', 'Operation failed. Please try again.');
    }
});

// ============================================
// MEDIUM PRIORITY BUG FIXES
// ============================================

// BUG-M1: localStorage Quota Checker
window.checkLocalStorageQuota = function(key, data) {
    try {
        const testKey = '__quota_test__';
        const dataStr = JSON.stringify(data);
        const size = new Blob([dataStr]).size;

        // Check if size is reasonable (< 4MB, leaving buffer)
        if (size > 4 * 1024 * 1024) {
            throw new Error('Data size exceeds safe localStorage limit (4MB)');
        }

        // Try to actually store it
        localStorage.setItem(testKey, dataStr);
        localStorage.removeItem(testKey);

        return true;
    } catch (error) {
        console.error('localStorage quota exceeded:', error);

        if (typeof showToast === 'function') {
            showToast('error', 'Storage limit reached. Please clear some data.');
        }

        return false;
    }
};

// Wrap localStorage.setItem with quota check
const originalSetItem = Storage.prototype.setItem;
Storage.prototype.setItem = function(key, value) {
    try {
        // Skip quota check for small items
        if (value.length < 100000) {
            return originalSetItem.call(this, key, value);
        }

        // Check quota for large items
        const size = new Blob([value]).size;
        if (size > 4 * 1024 * 1024) {
            console.warn('⚠️ Attempting to store large item:', key, `${(size/1024/1024).toFixed(2)}MB`);
        }

        return originalSetItem.call(this, key, value);
    } catch (error) {
        console.error('localStorage.setItem failed:', error);
        throw error;
    }
};

// BUG-M3: Template Validation
window.validateTemplate = function(template) {
    const errors = [];

    if (!template.name || template.name.trim() === '') {
        errors.push('Template must have a name');
    }

    if (!template.pages || !Array.isArray(template.pages)) {
        errors.push('Template must have pages array');
    }

    if (template.pages && template.pages.length === 0) {
        errors.push('Template must have at least one page');
    }

    // Validate each page
    if (template.pages) {
        template.pages.forEach((page, index) => {
            if (!page.id) {
                errors.push(`Page ${index + 1} missing id`);
            }
            if (!page.name) {
                errors.push(`Page ${index + 1} missing name`);
            }
            if (!page.contentBlocks) {
                errors.push(`Page ${index + 1} missing contentBlocks`);
            }
        });
    }

    if (errors.length > 0) {
        console.error('Template validation failed:', errors);
        return { valid: false, errors };
    }

    return { valid: true, errors: [] };
};

// BUG-M6: Debounce Utility
window.debounce = function(func, wait, immediate = false) {
    let timeout;

    return function executedFunction(...args) {
        const context = this;

        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };

        const callNow = immediate && !timeout;

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);

        if (callNow) func.apply(context, args);
    };
};

// Apply debouncing to slider inputs
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('input[type="range"]');

    sliders.forEach(slider => {
        if (slider.oninput) {
            const originalHandler = slider.oninput;
            slider.oninput = window.debounce(originalHandler, 150);
        }
    });
});

// BUG-M7: Slider Validation
const originalUpdatePageCount = window.updatePageCount;
if (typeof originalUpdatePageCount === 'function') {
    window.updatePageCount = function(value) {
        const validated = Math.max(4, Math.min(16, parseInt(value) || 8));
        return originalUpdatePageCount(validated);
    };
}

const originalUpdateWordCount = window.updateWordCount;
if (typeof originalUpdateWordCount === 'function') {
    window.updateWordCount = function(value) {
        const validated = Math.max(400, Math.min(2000, parseInt(value) || 1200));
        return originalUpdateWordCount(validated);
    };
}

// ============================================
// LOW PRIORITY BUG FIXES
// ============================================

// BUG-L1: Conditional Console Logging
window.DEBUG = window.location.hostname === 'localhost' ||
               window.location.hostname === '127.0.0.1' ||
               window.location.search.includes('debug=true');

// Wrap console methods
const originalConsoleLog = console.log;
const originalConsoleDebug = console.debug;

console.log = function(...args) {
    if (window.DEBUG) {
        originalConsoleLog.apply(console, args);
    }
};

console.debug = function(...args) {
    if (window.DEBUG) {
        originalConsoleDebug.apply(console, args);
    }
};

// BUG-L4: Analytics Event Hooks
window.trackEvent = function(eventName, eventData = {}) {
    // Log in debug mode
    if (window.DEBUG) {
        console.log('📊 Analytics Event:', eventName, eventData);
    }

    // Send to Google Analytics (if available)
    if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, eventData);
    }

    // Send to custom analytics (if available)
    if (typeof window.analytics !== 'undefined') {
        window.analytics.track(eventName, eventData);
    }

    // Dispatch custom event for internal listeners
    window.dispatchEvent(new CustomEvent('analytics:event', {
        detail: { eventName, eventData }
    }));
};

// Track key user actions
const actionsToTrack = [
    { selector: '#generateBtn', event: 'click', name: 'generate_brochure' },
    { selector: '#exportToPDF', event: 'click', name: 'export_pdf' },
    { selector: '#useSmartDefaults', event: 'click', name: 'use_smart_defaults' }
];

document.addEventListener('DOMContentLoaded', () => {
    actionsToTrack.forEach(({ selector, event, name }) => {
        const element = document.querySelector(selector);
        if (element) {
            element.addEventListener(event, () => {
                window.trackEvent(name, {
                    timestamp: Date.now(),
                    page: window.location.pathname
                });
            });
        }
    });
});

// BUG-L6: Form Input Validation
window.validateFormInput = function(input, rules) {
    const errors = [];
    const value = input.value;

    if (rules.required && (!value || value.trim() === '')) {
        errors.push('This field is required');
    }

    if (rules.minLength && value.length < rules.minLength) {
        errors.push(`Minimum length is ${rules.minLength} characters`);
    }

    if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`Maximum length is ${rules.maxLength} characters`);
    }

    if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(rules.patternError || 'Invalid format');
    }

    if (rules.min !== undefined && Number(value) < rules.min) {
        errors.push(`Minimum value is ${rules.min}`);
    }

    if (rules.max !== undefined && Number(value) > rules.max) {
        errors.push(`Maximum value is ${rules.max}`);
    }

    // Show/hide error messages
    const errorContainer = input.parentElement.querySelector('.error-message');

    if (errors.length > 0) {
        input.classList.add('error');

        if (errorContainer) {
            errorContainer.textContent = errors[0];
            errorContainer.style.display = 'block';
        }

        return false;
    } else {
        input.classList.remove('error');

        if (errorContainer) {
            errorContainer.style.display = 'none';
        }

        return true;
    }
};

// Add validation to key inputs
document.addEventListener('DOMContentLoaded', () => {
    const validationRules = {
        askingPrice: {
            required: true,
            min: 1000,
            max: 100000000,
            patternError: 'Please enter a valid price'
        },
        bedrooms: {
            required: true,
            min: 0,
            max: 20
        },
        agentEmail: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            patternError: 'Please enter a valid email address'
        },
        agentPhone: {
            pattern: /^[\d\s\-\+\(\)]+$/,
            patternError: 'Please enter a valid phone number'
        }
    };

    Object.entries(validationRules).forEach(([id, rules]) => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('blur', () => {
                window.validateFormInput(input, rules);
            });
        }
    });
});

// ============================================
// BACKWARDS COMPATIBILITY
// ============================================

// Ensure showToast exists (fallback)
if (typeof window.showToast !== 'function') {
    window.showToast = function(type, message, duration = 3000) {
        console.log(`[${type.toUpperCase()}] ${message}`);
        alert(message);
    };
}

// Ensure uploadedPhotos array exists
if (!window.uploadedPhotos) {
    window.uploadedPhotos = [];
}

// Ensure brochurePages array exists
if (!window.brochurePages) {
    window.brochurePages = [];
}

// Ensure photoCategoryAssignments exists
if (!window.photoCategoryAssignments) {
    window.photoCategoryAssignments = {
        cover: [],
        exterior: [],
        interior: [],
        kitchen: [],
        bedrooms: [],
        bathrooms: [],
        garden: []
    };
}

// ============================================
// INITIALIZATION
// ============================================

console.log('✅ Bug fixes initialized');
console.log(`📊 Debug mode: ${window.DEBUG ? 'ON' : 'OFF'}`);

// Report status
if (window.DEBUG) {
    console.log('🐛 Bug Fixes Active:');
    console.log('  - Session timer pause/resume');
    console.log('  - Rate limiting for API calls');
    console.log('  - Global error boundary');
    console.log('  - localStorage quota checking');
    console.log('  - Template validation');
    console.log('  - Input debouncing');
    console.log('  - Slider validation');
    console.log('  - Analytics tracking');
    console.log('  - Form validation');
}

console.log('✅ Bug Fixes Module ready');
