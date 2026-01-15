/**
 * Postcode Autocomplete System with Location Enrichment
 * Provides live postcode suggestions and fetches local area data
 */

// Debounce function to avoid excessive API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// State
let currentEnrichmentData = null;
let autocompleteResults = [];
let selectedIndex = -1;

// Fetch postcode suggestions from autocomplete API
async function fetchPostcodeSuggestions(partialPostcode) {
    try {
        const response = await fetch('/postcode/autocomplete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postcode: partialPostcode })
        });

        if (!response.ok) {
            console.error('Autocomplete API error:', response.status);
            return [];
        }

        const result = await response.json();
        return result.addresses || [];
    } catch (error) {
        console.error('Error fetching postcode suggestions:', error);
        return [];
    }
}

// Fetch enrichment data for a postcode
async function fetchEnrichmentData(postcode) {
    try {
        console.log('📍 Fetching enrichment data for:', postcode);

        const response = await fetch('/enrich', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ postcode })
        });

        if (!response.ok) {
            console.error('Enrichment API error:', response.status);
            return null;
        }

        const data = await response.json();
        console.log('✅ Enrichment data received:', data);
        return data;
    } catch (error) {
        console.error('Error fetching enrichment data:', error);
        return null;
    }
}

// Create or update autocomplete dropdown
function showAutocompleteDropdown(postcodeInput, suggestions) {
    // Remove existing dropdown
    const existing = document.getElementById('postcode-dropdown');
    if (existing) {
        existing.remove();
    }

    if (suggestions.length === 0) {
        return;
    }

    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.id = 'postcode-dropdown';
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-top: none;
        border-radius: 0 0 8px 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
        margin-top: -1px;
    `;

    suggestions.forEach((suggestion, index) => {
        const option = document.createElement('div');
        option.className = 'postcode-option';
        option.style.cssText = `
            padding: 12px 16px;
            cursor: pointer;
            border-bottom: 1px solid #f0f0f0;
            transition: background-color 0.2s;
        `;

        option.innerHTML = `
            <div style="font-weight: 600; color: #333;">${suggestion.postcode}</div>
            <div style="font-size: 0.875rem; color: #666; margin-top: 2px;">
                ${suggestion.district}${suggestion.county ? ', ' + suggestion.county : ''}
            </div>
        `;

        option.addEventListener('mouseenter', () => {
            selectedIndex = index;
            highlightOption(dropdown, index);
        });

        option.addEventListener('click', () => {
            selectPostcode(suggestion.postcode);
        });

        dropdown.appendChild(option);
    });

    // Position dropdown relative to input
    const inputRect = postcodeInput.getBoundingClientRect();
    postcodeInput.parentElement.style.position = 'relative';
    postcodeInput.parentElement.appendChild(dropdown);
}

// Highlight selected option
function highlightOption(dropdown, index) {
    const options = dropdown.querySelectorAll('.postcode-option');
    options.forEach((opt, i) => {
        if (i === index) {
            opt.style.backgroundColor = '#f8f9fa';
            opt.style.borderLeftColor = '#C20430';
            opt.style.borderLeftWidth = '3px';
            opt.style.borderLeftStyle = 'solid';
        } else {
            opt.style.backgroundColor = 'white';
            opt.style.borderLeftWidth = '0';
        }
    });
}

// Select a postcode and fetch enrichment
async function selectPostcode(postcode) {
    const postcodeInput = document.getElementById('postcode');
    postcodeInput.value = postcode;

    // Remove dropdown
    const dropdown = document.getElementById('postcode-dropdown');
    if (dropdown) {
        dropdown.remove();
    }

    // Show loading indicator
    showLoadingNotification('Fetching location data...');

    // Fetch enrichment data
    const enrichmentData = await fetchEnrichmentData(postcode);

    if (enrichmentData) {
        currentEnrichmentData = enrichmentData;
        showEnrichmentNotification(enrichmentData);
    } else {
        showErrorNotification('Could not fetch location data');
    }
}

// Handle postcode input changes
const handlePostcodeInput = debounce(async (event) => {
    const input = event.target;
    const value = input.value.trim().toUpperCase();

    // Reset enrichment when user modifies postcode
    if (value !== input.value.trim()) {
        currentEnrichmentData = null;
    }

    // Minimum 3 characters for autocomplete
    if (value.length < 3) {
        const dropdown = document.getElementById('postcode-dropdown');
        if (dropdown) {
            dropdown.remove();
        }
        return;
    }

    // Fetch suggestions
    const suggestions = await fetchPostcodeSuggestions(value);
    autocompleteResults = suggestions;
    selectedIndex = -1;

    showAutocompleteDropdown(input, suggestions);
}, 300);

// Handle keyboard navigation
function handlePostcodeKeydown(event) {
    const dropdown = document.getElementById('postcode-dropdown');
    if (!dropdown || autocompleteResults.length === 0) {
        return;
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, autocompleteResults.length - 1);
        highlightOption(dropdown, selectedIndex);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        highlightOption(dropdown, selectedIndex);
    } else if (event.key === 'Enter') {
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < autocompleteResults.length) {
            selectPostcode(autocompleteResults[selectedIndex].postcode);
        }
    } else if (event.key === 'Escape') {
        dropdown.remove();
        autocompleteResults = [];
        selectedIndex = -1;
    }
}

// Show loading notification
function showLoadingNotification(message) {
    removeNotifications();

    const notification = document.createElement('div');
    notification.className = 'postcode-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #C20430 0%, #138496 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <div class="spinner" style="
                border: 2px solid rgba(255,255,255,0.3);
                border-top-color: white;
                border-radius: 50%;
                width: 16px;
                height: 16px;
                animation: spin 0.8s linear infinite;
            "></div>
            <span>${message}</span>
        </div>
    `;

    // Add spinner animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);
}

// Show enrichment notification
function showEnrichmentNotification(enrichmentData) {
    removeNotifications();

    const notification = document.createElement('div');
    notification.className = 'postcode-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;

    let message = '✅ Location data loaded!';

    // Add highlights from enrichment
    if (enrichmentData.highlights && enrichmentData.highlights.length > 0) {
        const firstHighlight = enrichmentData.highlights[0];
        message += `<br><small style="opacity: 0.9; margin-top: 0.5rem; display: block;">${firstHighlight}</small>`;
    }

    // Add descriptor summary
    if (enrichmentData.descriptors) {
        const descriptors = enrichmentData.descriptors;
        const descriptorText = Object.entries(descriptors)
            .map(([key, value]) => `${key.replace('_', ' ')}: ${value}`)
            .join(' • ');
        message += `<br><small style="opacity: 0.8; margin-top: 0.3rem; display: block; font-size: 0.75rem;">${descriptorText}</small>`;
    }

    notification.innerHTML = message;
    document.body.appendChild(notification);

    // Remove after 8 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 8000);
}

// Show error notification
function showErrorNotification(message) {
    removeNotifications();

    const notification = document.createElement('div');
    notification.className = 'postcode-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;

    notification.innerHTML = `⚠️ ${message}`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Remove all notifications
function removeNotifications() {
    document.querySelectorAll('.postcode-notification').forEach(n => n.remove());
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
    const postcodeInput = document.getElementById('postcode');
    const dropdown = document.getElementById('postcode-dropdown');

    if (dropdown && !postcodeInput.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.remove();
        autocompleteResults = [];
        selectedIndex = -1;
    }
}

// Get current enrichment data (called by main form)
function getCurrentEnrichmentData() {
    return currentEnrichmentData;
}

// Initialize postcode autocomplete when DOM is ready
function initializePostcodeAutofill() {
    const postcodeInput = document.getElementById('postcode');

    if (postcodeInput) {
        postcodeInput.addEventListener('input', handlePostcodeInput);
        postcodeInput.addEventListener('keydown', handlePostcodeKeydown);
        postcodeInput.autocomplete = 'off'; // Disable browser autocomplete

        console.log('✅ Postcode autocomplete initialized');
    } else {
        console.error('❌ Postcode input field not found');
    }

    // Global click handler
    document.addEventListener('click', handleClickOutside);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePostcodeAutofill);
} else {
    initializePostcodeAutofill();
}

// Export for use by other scripts
window.getCurrentEnrichmentData = getCurrentEnrichmentData;
