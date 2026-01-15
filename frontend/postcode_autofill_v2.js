/**
 * Postcode & Full Address Lookup System with Location Enrichment
 * Flow: User types postcode → Selects postcode → Sees full addresses → Selects address → Auto-fills form
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
let postcodeResults = [];
let addressResults = [];
let selectedIndex = -1;
let currentMode = 'postcode'; // 'postcode' or 'address'

// ============================================================================
// API FUNCTIONS
// ============================================================================

// Fetch postcode suggestions from autocomplete API
async function fetchPostcodeSuggestions(partialPostcode) {
    try {
        const response = await fetch('/postcode/autocomplete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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

// Fetch full addresses for a postcode
async function fetchFullAddresses(postcode) {
    try {
        console.log('🏠 Fetching full addresses for:', postcode);

        const response = await fetch('/address/lookup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postcode })
        });

        if (!response.ok) {
            console.error('Address lookup API error:', response.status);
            return [];
        }

        const result = await response.json();
        console.log('✅ Found', result.addresses.length, 'addresses');
        return result.addresses || [];
    } catch (error) {
        console.error('Error fetching full addresses:', error);
        return [];
    }
}

// Fetch enrichment data for a postcode
async function fetchEnrichmentData(postcode) {
    try {
        console.log('📍 Fetching enrichment data for:', postcode);

        const response = await fetch('/enrich', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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

// ============================================================================
// DROPDOWN UI FUNCTIONS
// ============================================================================

// Create or update postcode autocomplete dropdown
function showPostcodeDropdown(postcodeInput, suggestions) {
    removeDropdown();

    if (suggestions.length === 0) {
        return;
    }

    const dropdown = createDropdown();
    dropdown.id = 'postcode-dropdown';

    suggestions.forEach((suggestion, index) => {
        const option = createDropdownOption(
            `<div style="font-weight: 600;">${suggestion.postcode}</div>
             <div style="font-size: 0.875rem; color: #666;">
                ${suggestion.district}${suggestion.county ? ', ' + suggestion.county : ''}
             </div>`,
            () => selectPostcode(suggestion.postcode)
        );

        if (index === selectedIndex) {
            option.classList.add('dropdown-option-selected');
        }

        dropdown.appendChild(option);
    });

    postcodeInput.parentElement.style.position = 'relative';
    postcodeInput.parentElement.appendChild(dropdown);
}

// Create or update full address dropdown
function showAddressDropdown(postcodeInput, addresses) {
    removeDropdown();

    if (addresses.length === 0) {
        console.warn('No addresses found for this postcode');
        return;
    }

    const dropdown = createDropdown();
    dropdown.id = 'address-dropdown';

    // Header
    const header = document.createElement('div');
    header.style.cssText = `
        padding: 12px 16px;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
        font-weight: 600;
        font-size: 0.875rem;
        color: #495057;
    `;
    header.textContent = `Select an address (${addresses.length} found)`;
    dropdown.appendChild(header);

    addresses.forEach((address, index) => {
        const option = createDropdownOption(
            `<div style="font-weight: 600;">${address.line_1}</div>
             <div style="font-size: 0.875rem; color: #666;">
                ${address.line_2 ? address.line_2 + ', ' : ''}${address.post_town}, ${address.postcode}
             </div>`,
            () => selectAddress(address)
        );

        if (index === selectedIndex) {
            option.classList.add('dropdown-option-selected');
        }

        dropdown.appendChild(option);
    });

    postcodeInput.parentElement.appendChild(dropdown);
}

// Helper: Create base dropdown element
function createDropdown() {
    const dropdown = document.createElement('div');
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
        max-height: 400px;
        overflow-y: auto;
        z-index: 1000;
        margin-top: -1px;
    `;
    return dropdown;
}

// Helper: Create dropdown option
function createDropdownOption(innerHTML, onClick) {
    const option = document.createElement('div');
    option.className = 'dropdown-option';
    option.style.cssText = `
        padding: 12px 16px;
        cursor: pointer;
        border-bottom: 1px solid #f0f0f0;
        transition: background 0.15s;
    `;
    option.innerHTML = innerHTML;

    option.addEventListener('mouseenter', () => {
        option.style.background = '#f8f9fa';
    });

    option.addEventListener('mouseleave', () => {
        if (!option.classList.contains('dropdown-option-selected')) {
            option.style.background = 'white';
        }
    });

    option.addEventListener('click', onClick);

    return option;
}

// Remove any existing dropdown
function removeDropdown() {
    const existing = document.getElementById('postcode-dropdown') || document.getElementById('address-dropdown');
    if (existing) {
        existing.remove();
    }
}

// ============================================================================
// SELECTION HANDLERS
// ============================================================================

// Handle postcode selection
async function selectPostcode(postcode) {
    console.log('📮 Postcode selected:', postcode);

    const postcodeInput = document.getElementById('postcode');
    if (postcodeInput) {
        postcodeInput.value = postcode;
    }

    // Fetch full addresses for this postcode
    addressResults = await fetchFullAddresses(postcode);
    currentMode = 'address';
    selectedIndex = -1;

    if (addressResults.length > 0) {
        showAddressDropdown(postcodeInput, addressResults);
    } else {
        // No addresses found - fall back to enrichment only
        removeDropdown();
        await fetchAndPopulateEnrichment(postcode);
    }
}

// Handle full address selection
async function selectAddress(address) {
    console.log('🏠 Address selected:', address);

    // Fill form fields
    const houseNameInput = document.getElementById('houseNameCustom');
    const addressInput = document.getElementById('address');
    const postcodeInput = document.getElementById('postcode');

    // Populate house name (line_1)
    if (houseNameInput) {
        houseNameInput.value = address.line_1;
        houseNameInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Populate address with road and town
    if (addressInput) {
        const parts = [];
        if (address.line_2) parts.push(address.line_2);
        if (address.line_3) parts.push(address.line_3);
        if (address.post_town) parts.push(address.post_town);
        addressInput.value = parts.join(', ');
        addressInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    if (postcodeInput) {
        postcodeInput.value = address.postcode;
        postcodeInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    removeDropdown();

    // Fetch enrichment data
    await fetchAndPopulateEnrichment(address.postcode);
}

// Fetch and populate enrichment data
async function fetchAndPopulateEnrichment(postcode) {
    // Show loading indicator
    const enrichmentPanel = document.getElementById('enrichment-panel');
    if (enrichmentPanel) {
        enrichmentPanel.innerHTML = '<div style="padding: 16px; text-align: center; color: #666;">Loading location data...</div>';
    }

    const enrichmentData = await fetchEnrichmentData(postcode);

    if (enrichmentData) {
        currentEnrichmentData = enrichmentData;
        displayEnrichmentData(enrichmentData);
    } else if (enrichmentPanel) {
        enrichmentPanel.innerHTML = '<div style="padding: 16px; text-align: center; color: #999;">No enrichment data available</div>';
    }
}

// Display enrichment data in the UI
function displayEnrichmentData(data) {
    const panel = document.getElementById('enrichment-panel');
    if (!panel) return;

    let html = '<div style="padding: 16px;">';
    html += '<h3 style="margin: 0 0 12px 0; font-size: 1.1rem;">Location Insights</h3>';

    // Highlights
    if (data.highlights && data.highlights.length > 0) {
        html += '<div style="margin-bottom: 16px;">';
        html += '<strong>Highlights:</strong>';
        html += '<ul style="margin: 8px 0; padding-left: 20px;">';
        data.highlights.forEach(highlight => {
            html += `<li>${highlight}</li>`;
        });
        html += '</ul>';
        html += '</div>';
    }

    // Amenities
    if (data.amenities) {
        html += '<div>';
        html += '<strong>Nearby Amenities:</strong>';
        html += '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 8px;">';

        const amenityLabels = {
            primary_schools: 'Primary Schools',
            secondary_schools: 'Secondary Schools',
            train_stations: 'Train Stations',
            tube_stations: 'Tube Stations',
            parks: 'Parks',
            supermarkets: 'Supermarkets',
            restaurants: 'Restaurants',
            cafes: 'Cafes'
        };

        for (const [key, count] of Object.entries(data.amenities)) {
            if (count > 0) {
                html += `<div style="padding: 8px; background: #f8f9fa; border-radius: 4px; font-size: 0.875rem;">
                    <strong>${count}</strong> ${amenityLabels[key] || key}
                </div>`;
            }
        }

        html += '</div>';
        html += '</div>';
    }

    html += '</div>';
    panel.innerHTML = html;
}

// ============================================================================
// INPUT HANDLERS
// ============================================================================

// Handle postcode input changes (debounced)
const handlePostcodeInput = debounce(async (event) => {
    const value = event.target.value.trim().toUpperCase();

    if (value.length < 3) {
        removeDropdown();
        return;
    }

    postcodeResults = await fetchPostcodeSuggestions(value);
    currentMode = 'postcode';
    selectedIndex = -1;

    showPostcodeDropdown(event.target, postcodeResults);
}, 300);

// Handle keyboard navigation
function handlePostcodeKeydown(event) {
    const dropdown = document.getElementById('postcode-dropdown') || document.getElementById('address-dropdown');
    if (!dropdown) return;

    const results = currentMode === 'postcode' ? postcodeResults : addressResults;

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
        updateDropdownHighlight(results);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        updateDropdownHighlight(results);
    } else if (event.key === 'Enter') {
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
            if (currentMode === 'postcode') {
                selectPostcode(results[selectedIndex].postcode);
            } else {
                selectAddress(results[selectedIndex]);
            }
        }
    } else if (event.key === 'Escape') {
        removeDropdown();
    }
}

// Update dropdown highlight for keyboard navigation
function updateDropdownHighlight(results) {
    if (currentMode === 'postcode') {
        showPostcodeDropdown(document.getElementById('postcode'), results);
    } else {
        showAddressDropdown(document.getElementById('postcode'), results);
    }
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
    const dropdown = document.getElementById('postcode-dropdown') || document.getElementById('address-dropdown');
    const postcodeInput = document.getElementById('postcode');

    if (dropdown && !dropdown.contains(event.target) && event.target !== postcodeInput) {
        removeDropdown();
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function initializePostcodeAutofill() {
    const postcodeInput = document.getElementById('postcode');

    if (!postcodeInput) {
        console.warn('Postcode input not found');
        return;
    }

    // Attach event listeners
    postcodeInput.addEventListener('input', handlePostcodeInput);
    postcodeInput.addEventListener('keydown', handlePostcodeKeydown);
    document.addEventListener('click', handleClickOutside);

    console.log('✅ Postcode & Address autofill system initialized');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePostcodeAutofill);
} else {
    initializePostcodeAutofill();
}
