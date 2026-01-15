/**
 * Selective localStorage Cleaner
 * Only clears form-related data, preserves auth and other app data
 *
 * Run in browser console:
 * > clearFormDataOnly()
 */

function clearFormDataOnly() {
    console.log('🗑️ Clearing form-related localStorage only...');

    let clearedCount = 0;

    // Get all localStorage keys
    const keys = Object.keys(localStorage);

    // Keys to remove (form-related only)
    const formPrefixes = [
        'brochure_form_',  // Auto-save form data
        'waverly',
        'sefton',
        'houseName',
        'mockData',
        'testData',
        'savedForm',
        'formData',
        'property_',
        'listing_'
    ];

    keys.forEach(key => {
        // Check if key matches any form-related prefix
        const shouldRemove = formPrefixes.some(prefix =>
            key.toLowerCase().includes(prefix.toLowerCase())
        );

        if (shouldRemove) {
            localStorage.removeItem(key);
            console.log(`  ✓ Removed: ${key}`);
            clearedCount++;
        }
    });

    console.log(`✅ Cleared ${clearedCount} form-related items`);
    console.log(`📦 Preserved ${keys.length - clearedCount} other items (auth, settings, etc.)`);

    return { cleared: clearedCount, preserved: keys.length - clearedCount };
}

// Auto-run on page load if this script is included
if (typeof window !== 'undefined') {
    window.clearFormDataOnly = clearFormDataOnly;
    console.log('💡 Run clearFormDataOnly() to clear form data');
}
