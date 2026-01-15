// Property Listing Generator - Frontend JavaScript

const API_BASE = '';  // Same origin

// Current mode tracking
let currentMode = 'brochure'; // Default to brochure

// DOM Elements
const generateForm = document.getElementById('generateForm');
const resultsSection = document.getElementById('resultsSection');
const variantsContainer = document.getElementById('variantsContainer');
const generateBtn = document.getElementById('generateBtn');

// Wizard Mode Selection
document.addEventListener('DOMContentLoaded', () => {
    const modeWizard = document.getElementById('modeWizard');

    if (modeWizard) {
        // Handle wizard card clicks
        document.querySelectorAll('.wizard-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking the button directly
                if (e.target.classList.contains('btn-wizard')) return;

                const mode = card.dataset.mode;
                startMode(mode);
            });

            // Handle button clicks
            const btn = card.querySelector('.btn-wizard');
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const mode = card.dataset.mode;
                    startMode(mode);
                });
            }
        });
    }
});

function startMode(mode) {
    currentMode = mode;
    const modeWizard = document.getElementById('modeWizard');
    const generateForm = document.getElementById('generateForm');

    // Hide wizard, show form
    if (modeWizard) modeWizard.style.display = 'none';
    if (generateForm) generateForm.style.display = 'block';

    // Show example brochure section for brochure mode
    const exampleBrochureSection = document.getElementById('exampleBrochureSection');
    if (mode === 'brochure' && exampleBrochureSection) {
        exampleBrochureSection.style.display = 'block';
        console.log('✅ Showing exampleBrochureSection for brochure mode');
    } else if (exampleBrochureSection) {
        exampleBrochureSection.style.display = 'none';
    }

    window.scrollTo(0, 0);
    console.log(`Mode selected: ${mode}`);
}

// Form Submit Handler (only add if form exists)
if (generateForm) {
    generateForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = collectFormData();
        await generateListings(formData);
    });
}

// Collect Form Data
function collectFormData() {
    // Property Data
    const features = Array.from(document.querySelectorAll('input[name="features"]:checked'))
        .map(cb => cb.value);
    
    const propertyData = {
        property_type: document.getElementById('propertyType').value,
        bedrooms: parseInt(document.getElementById('bedrooms').value),
        bathrooms: parseInt(document.getElementById('bathrooms').value),
        condition: document.getElementById('condition').value,
        features: features
    };
    
    const sizeSqft = document.getElementById('sizeSqft').value;
    if (sizeSqft) {
        propertyData.size_sqft = parseInt(sizeSqft);
    }
    
    const epcRating = document.getElementById('epcRating').value;
    if (epcRating) {
        propertyData.epc_rating = epcRating;
    }
    
    // Location Data
    const locationData = {
        address: document.getElementById('address').value,
        setting: document.getElementById('setting').value
    };
    
    const proximityNotes = document.getElementById('proximityNotes').value;
    if (proximityNotes) {
        locationData.proximity_notes = proximityNotes;
    }
    
    // Target Audience
    const targetAudience = {
        audience_type: document.getElementById('audienceType').value
    };
    
    const lifestyleFraming = document.getElementById('lifestyleFraming').value;
    if (lifestyleFraming) {
        targetAudience.lifestyle_framing = lifestyleFraming;
    }
    
    // Tone
    const tone = {
        tone: document.querySelector('input[name="tone"]:checked').value
    };
    
    // Channel
    const channel = {
        channel: document.getElementById('channel').value
    };
    
    const targetWords = document.getElementById('targetWords').value;
    if (targetWords) {
        channel.target_words = parseInt(targetWords);
    }
    
    const hardCap = document.getElementById('hardCap').value;
    if (hardCap) {
        channel.hard_cap = parseInt(hardCap);
    }

    // Brand and Typography (for brochure mode)
    const brandSelect = document.getElementById('estateAgentBrand');
    const typographySelect = document.getElementById('typographyStyle');

    const payload = {
        property_data: propertyData,
        location_data: locationData,
        target_audience: targetAudience,
        tone: tone,
        channel: channel
    };

    // Add brand and typography if elements exist (brochure mode)
    if (brandSelect) {
        payload.brand = brandSelect.value;
    }
    if (typographySelect) {
        payload.typography_style = typographySelect.value;
    }

    return payload;
}

// Generate Listings
async function generateListings(formData) {
    try {
        // Show loading state
        generateBtn.disabled = true;
        generateBtn.textContent = '⏳ Generating...';
        resultsSection.style.display = 'none';
        
        // Call API
        const response = await fetch(`${API_BASE}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Generation failed');
        }
        
        const data = await response.json();
        
        // Display results
        displayVariants(data.variants, data.metadata, data.compliance || null);
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error('Generation error:', error);
    } finally {
        // Reset button
        generateBtn.disabled = false;
        generateBtn.textContent = '✨ Generate Listings';
    }
}

// Display Variants
function displayVariants(variants, metadata, compliance) {
    variantsContainer.innerHTML = '';
    
    variants.forEach(variant => {
        const card = createVariantCard(variant, metadata);
        variantsContainer.appendChild(card);
    });
    
    // Store data for editor
    const editorData = {
        variants: variants,
        metadata: metadata,
        compliance: compliance,
        timestamp: Date.now()
    };
    sessionStorage.setItem('generatedListings', JSON.stringify(editorData));
    
    // Add "Open in Editor" button
    const editorBtn = document.createElement('button');
    editorBtn.className = 'btn-primary editor-btn';
    editorBtn.textContent = '✏️ Open in Editor';
    editorBtn.onclick = () => {
        window.location.href = '/static/editor.html';
    };
    variantsContainer.insertBefore(editorBtn, variantsContainer.firstChild);
    
    resultsSection.style.display = 'block';
}

// Create Variant Card
function createVariantCard(variant, metadata) {
    const card = document.createElement('div');
    card.className = 'variant-card';
    
    card.innerHTML = `
        <div class="variant-header">
            <span class="variant-id">Variant ${variant.variant_id}</span>
            <span class="variant-score">Score: ${(variant.score * 100).toFixed(0)}%</span>
        </div>
        
        <h3 class="variant-headline">${escapeHtml(variant.headline)}</h3>
        
        <div class="variant-meta">
            <span class="word-count">${variant.word_count} words</span>
            <span>•</span>
            <span>Channel: ${metadata.channel}</span>
            <span>•</span>
            <span>Tone: ${metadata.tone}</span>
        </div>
        
        <div class="variant-text">${escapeHtml(variant.full_text)}</div>
        
        <div class="variant-features">
            <h4>Key Features:</h4>
            <ul>
                ${variant.key_features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
            </ul>
        </div>
        
        <div class="variant-actions">
            <button class="btn-shrink" onclick="shrinkVariant(${variant.variant_id}, '${escapeHtml(variant.full_text)}')">
                📉 Shrink to Fit
            </button>
            <button class="btn-copy" onclick="copyToClipboard('${escapeHtml(variant.full_text)}')">
                📋 Copy Text
            </button>
        </div>
    `;
    
    return card;
}

// Shrink Variant
async function shrinkVariant(variantId, text) {
    const targetWords = prompt('Enter target word count:', '50');
    if (!targetWords) return;
    
    try {
        const response = await fetch(`${API_BASE}/shrink`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                target_words: parseInt(targetWords),
                preserve_keywords: []
            })
        });
        
        if (!response.ok) {
            throw new Error('Shrink failed');
        }
        
        const data = await response.json();
        
        alert(`Original: ${data.original_word_count} words\nCompressed: ${data.compressed_word_count} words\n\n${data.compressed_text}`);
        
    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error('Shrink error:', error);
    }
}

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Text copied to clipboard!');
    }).catch(err => {
        console.error('Copy failed:', err);
        alert('Failed to copy text');
    });
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Word Counter (Live)
document.getElementById('generateForm').addEventListener('input', updateWordCounters);

function updateWordCounters() {
    // Could add live word count displays if needed
}
