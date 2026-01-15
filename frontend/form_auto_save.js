// ============================================
// FORM AUTO-SAVE & RESTORE SYSTEM
// Saves form data to localStorage after each change
// Restores data on page load
// ============================================

console.log('📝 Form Auto-Save system loaded');

// All form field IDs to track
const FORM_FIELDS = [
    // Agent details
    'agentName',
    'agentPhone',
    'agentEmail',
    'officePhone',
    'officeEmail',

    // Property details
    'houseNameCustom',
    'address',
    'postcode',
    'askingPrice',
    'propertyType',
    'tenure',
    'bedrooms',
    'bathrooms',
    'receptionRooms',
    'sqft',
    'epcRating',

    // Features and description
    'keyFeatures',
    'propertyDescription',

    // Style preferences
    'toneStyle',
    'targetAudience'
];

const STORAGE_KEY_PREFIX = 'brochure_form_';
// Note: Photos are NOT auto-saved to avoid localStorage quota issues

// ============================================
// AUTO-SAVE: Save field value on change
// ============================================

function autoSaveField(fieldId, value) {
    try {
        localStorage.setItem(STORAGE_KEY_PREFIX + fieldId, value);
        console.log(`💾 Auto-saved: ${fieldId}`);
    } catch (e) {
        console.warn(`⚠️ Could not save ${fieldId}:`, e);
    }
}

// Photos are NOT auto-saved to avoid localStorage quota issues and performance problems
// You'll need to re-upload photos after refresh, but form fields will be preserved

// ============================================
// AUTO-RESTORE: Load saved data on page load
// ============================================

function autoRestoreForm() {
    console.log('🔄 Restoring saved form data...');
    let restoredCount = 0;

    // Restore all form fields
    FORM_FIELDS.forEach(fieldId => {
        const savedValue = localStorage.getItem(STORAGE_KEY_PREFIX + fieldId);
        if (savedValue !== null) {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = savedValue;
                restoredCount++;

                // Trigger change event for fields that need it
                field.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    });

    if (restoredCount > 0) {
        console.log(`✅ Restored ${restoredCount} form fields`);
        showRestoreNotification(restoredCount);
    } else {
        console.log('ℹ️ No saved form data found');
    }
}

// ============================================
// CLEAR SAVED DATA
// ============================================

function clearSavedFormData() {
    if (confirm('🗑️ Clear all saved form data?\n\nThis will remove all auto-saved fields. You\'ll need to start fresh.\n\nContinue?')) {
        // Clear all form fields
        FORM_FIELDS.forEach(fieldId => {
            localStorage.removeItem(STORAGE_KEY_PREFIX + fieldId);
        });

        // Reload page to show clean form
        location.reload();
    }
}

// Expose globally
window.clearSavedFormData = clearSavedFormData;

// ============================================
// NOTIFICATION UI
// ============================================

function showRestoreNotification(count) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        animation: slideIn 0.3s ease-out;
    `;

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.5rem;">🔄</span>
            <div>
                <div style="font-weight: 600; margin-bottom: 0.25rem;">Form Data Restored</div>
                <div style="font-size: 0.875rem; opacity: 0.9;">
                    Restored ${count} fields from your last session
                </div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()"
                    style="background: rgba(255,255,255,0.2); border: none; color: white;
                           padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer;
                           margin-left: 1rem;">
                ✓
            </button>
        </div>
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
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

    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ============================================
// INITIALIZE: Attach listeners and restore
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing form auto-save system...');

    // Restore saved data first
    setTimeout(() => autoRestoreForm(), 100);

    // Attach change listeners to all form fields
    FORM_FIELDS.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            // Save on change (for selects and immediate changes)
            field.addEventListener('change', (e) => {
                autoSaveField(fieldId, e.target.value);
            });

            // Save on input (for text fields as user types)
            field.addEventListener('input', (e) => {
                // Debounce text input saves (wait 500ms after typing stops)
                clearTimeout(field._saveTimer);
                field._saveTimer = setTimeout(() => {
                    autoSaveField(fieldId, e.target.value);
                }, 500);
            });
        }
    });

    console.log('✅ Form auto-save system ready (form fields only - photos not saved)');
});

// ============================================
// EXPOSE API
// ============================================

window.FormAutoSave = {
    save: autoSaveField,
    restore: autoRestoreForm,
    clear: clearSavedFormData
};
