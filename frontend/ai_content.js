/**
 * AI Content Generation
 * Generate property descriptions, headlines, and marketing copy
 */
const AIContent = (function() {
    'use strict';

    const API_ENDPOINT = '/api/generate';

    // Content types
    const CONTENT_TYPES = {
        headline: {
            name: 'Headline',
            icon: '📰',
            description: 'Catchy property headline',
            maxLength: 100,
            examples: [
                'Stunning Victorian Gem in Prime Location',
                'Modern Living Meets Period Charm',
                'Executive Family Home with Panoramic Views'
            ]
        },
        tagline: {
            name: 'Tagline',
            icon: '✨',
            description: 'Short punchy tagline',
            maxLength: 50,
            examples: [
                'Where luxury meets lifestyle',
                'Your forever home awaits',
                'Space to grow, room to breathe'
            ]
        },
        description: {
            name: 'Full Description',
            icon: '📝',
            description: 'Detailed property description',
            maxLength: 500,
            examples: []
        },
        features: {
            name: 'Key Features',
            icon: '🔑',
            description: 'Bullet point features list',
            maxLength: 300,
            examples: []
        },
        social: {
            name: 'Social Media Post',
            icon: '📱',
            description: 'Instagram/Facebook caption',
            maxLength: 150,
            examples: []
        },
        email_subject: {
            name: 'Email Subject',
            icon: '📧',
            description: 'Attention-grabbing subject line',
            maxLength: 60,
            examples: [
                'Just Listed: Your Dream Home in [Area]',
                'Price Reduced: Don\'t Miss This One!',
                'Exclusive: Off-Market Opportunity'
            ]
        }
    };

    // Tone options
    const TONES = {
        professional: { name: 'Professional', description: 'Formal estate agent tone' },
        luxury: { name: 'Luxury', description: 'High-end, exclusive feel' },
        friendly: { name: 'Friendly', description: 'Warm and approachable' },
        punchy: { name: 'Punchy', description: 'Short, impactful sentences' },
        descriptive: { name: 'Descriptive', description: 'Rich, detailed language' }
    };

    // State
    let isGenerating = false;
    let currentModal = null;

    /**
     * Generate content via API
     */
    async function generate(options) {
        const {
            contentType = 'description',
            propertyData = {},
            tone = 'professional',
            customPrompt = null
        } = options;

        if (isGenerating) {
            throw new Error('Generation already in progress');
        }

        isGenerating = true;

        try {
            // Build request
            const request = {
                property_data: {
                    address: propertyData.address || 'Property Address',
                    price: propertyData.price || 'Price on Application',
                    bedrooms: propertyData.bedrooms || 3,
                    bathrooms: propertyData.bathrooms || 2,
                    property_type: propertyData.propertyType || 'House',
                    features: propertyData.features || [],
                    description: propertyData.existingDescription || ''
                },
                tone: { style: tone },
                channel: getChannelForType(contentType),
                custom_instructions: customPrompt || getInstructionsForType(contentType)
            };

            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Generation failed');
            }

            const result = await response.json();

            // Extract the generated text
            if (result.variants && result.variants.length > 0) {
                return {
                    text: result.variants[0].description || result.variants[0].text,
                    variants: result.variants,
                    metadata: result.metadata
                };
            }

            throw new Error('No content generated');

        } finally {
            isGenerating = false;
        }
    }

    /**
     * Get channel for content type
     */
    function getChannelForType(contentType) {
        const channelMap = {
            headline: { type: 'brochure' },
            tagline: { type: 'social' },
            description: { type: 'brochure' },
            features: { type: 'rightmove' },
            social: { type: 'social' },
            email_subject: { type: 'email' }
        };
        return channelMap[contentType] || { type: 'brochure' };
    }

    /**
     * Get instructions for content type
     */
    function getInstructionsForType(contentType) {
        const instructions = {
            headline: 'Generate a catchy, attention-grabbing headline for this property. Maximum 10 words.',
            tagline: 'Create a short, memorable tagline. Maximum 8 words.',
            description: 'Write a compelling property description highlighting key features and lifestyle benefits.',
            features: 'List the key selling points as bullet points. Focus on unique features.',
            social: 'Write an engaging social media caption with relevant hashtags.',
            email_subject: 'Create an email subject line that encourages opens. Maximum 50 characters.'
        };
        return instructions[contentType] || '';
    }

    /**
     * Quick generate with fallback
     */
    async function quickGenerate(contentType, propertyData, tone = 'professional') {
        try {
            return await generate({ contentType, propertyData, tone });
        } catch (error) {
            // Fallback to template-based generation
            console.warn('API generation failed, using fallback:', error);
            return {
                text: generateFallback(contentType, propertyData),
                fallback: true
            };
        }
    }

    /**
     * Fallback template-based generation
     */
    function generateFallback(contentType, data) {
        const templates = {
            headline: [
                `Stunning ${data.bedrooms || 3} Bedroom ${data.propertyType || 'Home'} in ${data.area || 'Prime Location'}`,
                `Exceptional ${data.propertyType || 'Property'} Offering ${data.bedrooms || 3} Bedrooms`,
                `Beautifully Presented ${data.propertyType || 'Home'} - Must Be Seen`
            ],
            tagline: [
                'Where memories are made',
                'Your perfect home awaits',
                'Live the lifestyle you deserve'
            ],
            description: [
                `This exceptional ${data.bedrooms || 3} bedroom ${(data.propertyType || 'property').toLowerCase()} offers spacious accommodation throughout. ${data.features?.length ? 'Key features include ' + data.features.slice(0, 3).join(', ') + '.' : ''} Viewing highly recommended.`
            ],
            features: [
                `• ${data.bedrooms || 3} well-proportioned bedrooms\n• ${data.bathrooms || 2} modern bathrooms\n• Spacious reception rooms\n• Private garden\n• Excellent transport links`
            ],
            social: [
                `Just listed! Beautiful ${data.bedrooms || 3} bed ${(data.propertyType || 'home').toLowerCase()} in ${data.area || 'a sought-after location'}. DM for details! 🏠✨ #property #forsale #newhome`
            ],
            email_subject: [
                `New Listing: ${data.bedrooms || 3} Bed ${data.propertyType || 'Home'} - ${data.price || 'Price on Application'}`
            ]
        };

        const options = templates[contentType] || templates.description;
        return options[Math.floor(Math.random() * options.length)];
    }

    /**
     * Show generation modal
     */
    function showModal(onInsert, initialData = {}) {
        if (currentModal) {
            currentModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'ai-content-modal';
        modal.innerHTML = `
            <div class="ai-content-container">
                <div class="ai-header">
                    <h2>AI Content Generator</h2>
                    <button class="ai-close">&times;</button>
                </div>

                <div class="ai-body">
                    <div class="ai-section">
                        <h4>What do you need?</h4>
                        <div class="ai-type-grid">
                            ${Object.entries(CONTENT_TYPES).map(([id, type]) => `
                                <button class="ai-type-btn${id === 'description' ? ' selected' : ''}" data-type="${id}">
                                    <span class="ai-type-icon">${type.icon}</span>
                                    <span class="ai-type-name">${type.name}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <div class="ai-section">
                        <h4>Property Details</h4>
                        <div class="ai-form-grid">
                            <div class="ai-form-row">
                                <label>Property Type</label>
                                <select id="aiPropertyType">
                                    <option value="House">House</option>
                                    <option value="Flat">Flat</option>
                                    <option value="Apartment">Apartment</option>
                                    <option value="Bungalow">Bungalow</option>
                                    <option value="Cottage">Cottage</option>
                                    <option value="Penthouse">Penthouse</option>
                                    <option value="Townhouse">Townhouse</option>
                                </select>
                            </div>
                            <div class="ai-form-row">
                                <label>Bedrooms</label>
                                <input type="number" id="aiBedrooms" value="${initialData.bedrooms || 3}" min="1" max="10">
                            </div>
                            <div class="ai-form-row">
                                <label>Bathrooms</label>
                                <input type="number" id="aiBathrooms" value="${initialData.bathrooms || 2}" min="1" max="10">
                            </div>
                            <div class="ai-form-row">
                                <label>Area/Location</label>
                                <input type="text" id="aiArea" placeholder="e.g., Kensington" value="${initialData.area || ''}">
                            </div>
                            <div class="ai-form-row full">
                                <label>Key Features (comma separated)</label>
                                <input type="text" id="aiFeatures" placeholder="e.g., garden, parking, period features" value="${initialData.features || ''}">
                            </div>
                        </div>
                    </div>

                    <div class="ai-section">
                        <h4>Tone</h4>
                        <div class="ai-tone-options">
                            ${Object.entries(TONES).map(([id, tone]) => `
                                <label class="ai-tone-option">
                                    <input type="radio" name="aiTone" value="${id}" ${id === 'professional' ? 'checked' : ''}>
                                    <span class="ai-tone-label">${tone.name}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <div class="ai-section">
                        <h4>Generated Content</h4>
                        <div class="ai-output">
                            <textarea id="aiResult" placeholder="Click 'Generate' to create content..." readonly></textarea>
                            <div class="ai-output-actions">
                                <button class="ai-regenerate" disabled>🔄 Regenerate</button>
                                <button class="ai-copy" disabled>📋 Copy</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="ai-footer">
                    <button class="ai-cancel">Cancel</button>
                    <button class="ai-generate">
                        <span class="ai-icon">✨</span>
                        Generate
                    </button>
                    <button class="ai-insert" disabled>Insert into Design</button>
                </div>
            </div>
        `;

        // State
        let selectedType = 'description';
        let generatedText = '';

        // Elements
        const resultArea = modal.querySelector('#aiResult');
        const generateBtn = modal.querySelector('.ai-generate');
        const regenerateBtn = modal.querySelector('.ai-regenerate');
        const copyBtn = modal.querySelector('.ai-copy');
        const insertBtn = modal.querySelector('.ai-insert');

        // Close handlers
        modal.querySelector('.ai-close').onclick = () => {
            modal.remove();
            currentModal = null;
        };
        modal.querySelector('.ai-cancel').onclick = () => {
            modal.remove();
            currentModal = null;
        };
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
                currentModal = null;
            }
        };

        // Type selection
        modal.querySelectorAll('.ai-type-btn').forEach(btn => {
            btn.onclick = () => {
                modal.querySelectorAll('.ai-type-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedType = btn.dataset.type;
            };
        });

        // Generate
        const doGenerate = async () => {
            generateBtn.disabled = true;
            generateBtn.innerHTML = '<span class="ai-icon">⏳</span> Generating...';
            resultArea.value = 'Generating content...';

            try {
                const propertyData = {
                    propertyType: modal.querySelector('#aiPropertyType').value,
                    bedrooms: parseInt(modal.querySelector('#aiBedrooms').value),
                    bathrooms: parseInt(modal.querySelector('#aiBathrooms').value),
                    area: modal.querySelector('#aiArea').value,
                    features: modal.querySelector('#aiFeatures').value.split(',').map(f => f.trim()).filter(f => f)
                };

                const tone = modal.querySelector('input[name="aiTone"]:checked').value;

                const result = await quickGenerate(selectedType, propertyData, tone);
                generatedText = result.text;
                resultArea.value = generatedText;

                regenerateBtn.disabled = false;
                copyBtn.disabled = false;
                insertBtn.disabled = false;

            } catch (error) {
                resultArea.value = `Error: ${error.message}`;
            } finally {
                generateBtn.disabled = false;
                generateBtn.innerHTML = '<span class="ai-icon">✨</span> Generate';
            }
        };

        generateBtn.onclick = doGenerate;
        regenerateBtn.onclick = doGenerate;

        // Copy
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(generatedText);
            copyBtn.textContent = '✓ Copied!';
            setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
        };

        // Insert
        insertBtn.onclick = () => {
            if (onInsert && generatedText) {
                onInsert(generatedText, selectedType);
            }
            modal.remove();
            currentModal = null;
        };

        document.body.appendChild(modal);
        currentModal = modal;

        return modal;
    }

    /**
     * Initialize styles
     */
    function init() {
        if (document.getElementById('ai-content-styles')) return;

        const style = document.createElement('style');
        style.id = 'ai-content-styles';
        style.textContent = `
            .ai-content-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10010;
                backdrop-filter: blur(4px);
            }

            .ai-content-container {
                background: #1a1a2e;
                border-radius: 16px;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            }

            .ai-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .ai-header h2 {
                margin: 0;
                color: #fff;
                font-size: 20px;
            }

            .ai-close {
                background: none;
                border: none;
                color: #888;
                font-size: 28px;
                cursor: pointer;
            }

            .ai-body {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }

            .ai-section {
                margin-bottom: 20px;
            }

            .ai-section h4 {
                margin: 0 0 12px;
                color: #6c5ce7;
                font-size: 12px;
                text-transform: uppercase;
            }

            .ai-type-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
            }

            .ai-type-btn {
                padding: 12px;
                background: rgba(255,255,255,0.03);
                border: 2px solid transparent;
                border-radius: 10px;
                cursor: pointer;
                text-align: center;
                transition: all 0.2s;
            }

            .ai-type-btn:hover {
                background: rgba(255,255,255,0.05);
            }

            .ai-type-btn.selected {
                border-color: #6c5ce7;
                background: rgba(108,92,231,0.1);
            }

            .ai-type-icon {
                display: block;
                font-size: 24px;
                margin-bottom: 4px;
            }

            .ai-type-name {
                display: block;
                font-size: 11px;
                color: #aaa;
            }

            .ai-form-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
            }

            .ai-form-row {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .ai-form-row.full {
                grid-column: span 2;
            }

            .ai-form-row label {
                font-size: 11px;
                color: #888;
            }

            .ai-form-row input,
            .ai-form-row select {
                padding: 8px 10px;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 6px;
                color: #fff;
                font-size: 13px;
            }

            .ai-tone-options {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }

            .ai-tone-option {
                display: flex;
                align-items: center;
                gap: 6px;
                cursor: pointer;
            }

            .ai-tone-option input {
                accent-color: #6c5ce7;
            }

            .ai-tone-label {
                font-size: 13px;
                color: #aaa;
            }

            .ai-output {
                background: rgba(255,255,255,0.03);
                border-radius: 10px;
                padding: 12px;
            }

            .ai-output textarea {
                width: 100%;
                height: 120px;
                background: transparent;
                border: none;
                color: #fff;
                font-size: 14px;
                line-height: 1.5;
                resize: none;
            }

            .ai-output textarea:focus {
                outline: none;
            }

            .ai-output-actions {
                display: flex;
                gap: 10px;
                margin-top: 10px;
                padding-top: 10px;
                border-top: 1px solid rgba(255,255,255,0.1);
            }

            .ai-output-actions button {
                padding: 6px 12px;
                background: rgba(255,255,255,0.05);
                border: none;
                border-radius: 6px;
                color: #aaa;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .ai-output-actions button:hover:not(:disabled) {
                background: rgba(255,255,255,0.1);
                color: #fff;
            }

            .ai-output-actions button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .ai-footer {
                display: flex;
                gap: 10px;
                padding: 15px 20px;
                border-top: 1px solid rgba(255,255,255,0.1);
            }

            .ai-footer button {
                padding: 10px 20px;
                border-radius: 8px;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .ai-cancel {
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.1);
                color: #aaa;
            }

            .ai-generate {
                background: linear-gradient(135deg, #6c5ce7, #a855f7);
                border: none;
                color: #fff;
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .ai-generate:hover:not(:disabled) {
                transform: translateY(-1px);
                box-shadow: 0 4px 15px rgba(108,92,231,0.4);
            }

            .ai-insert {
                margin-left: auto;
                background: #10b981;
                border: none;
                color: #fff;
            }

            .ai-insert:disabled {
                background: #374151;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);
    }

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    return {
        init,
        generate,
        quickGenerate,
        showModal,
        CONTENT_TYPES,
        TONES,
        isGenerating: () => isGenerating,
        isLoaded: true
    };
})();

// Global export
window.AIContent = AIContent;
