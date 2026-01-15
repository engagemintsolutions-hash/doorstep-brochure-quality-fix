/**
 * Clear Form Data Script
 * Clears all localStorage saved form data on page load
 * This ensures forms always start blank for testing
 */

console.log('🗑️ Clearing all saved form data...');

// Clear all localStorage keys that start with 'brochure_form_'
Object.keys(localStorage).forEach(key => {
    if (key.startsWith('brochure_form_')) {
        localStorage.removeItem(key);
        console.log(`✓ Cleared: ${key}`);
    }
});

// Also clear any other form-related storage
const keysToRemove = [
    'waverly',
    'sefton',
    'houseName',
    'mockData',
    'testData',
    'savedForm',
    'formData'
];

keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`✓ Cleared: ${key}`);
    }
});

console.log('✅ All saved form data cleared!');
