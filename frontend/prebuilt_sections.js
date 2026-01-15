// ============================================================================
// PRE-BUILT SECTIONS SYSTEM
// Agent card, feature highlights, testimonials, and price banners
// ============================================================================

(function() {
    'use strict';

    // ========================================================================
    // SECTION TEMPLATES
    // ========================================================================

    const SECTION_TEMPLATES = {
        agentCard: {
            name: 'Agent Card',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
            </svg>`,
            defaultSize: { width: 280, height: 100 },
            create: createAgentCard
        },
        featuresBlock: {
            name: 'Features',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>`,
            defaultSize: { width: 300, height: 180 },
            create: createFeaturesBlock
        },
        testimonial: {
            name: 'Testimonial',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>`,
            defaultSize: { width: 300, height: 140 },
            create: createTestimonial
        },
        priceBanner: {
            name: 'Price Banner',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>`,
            defaultSize: { width: 200, height: 100 },
            create: createPriceBanner
        }
    };

    // ========================================================================
    // RENDER SECTIONS PANEL
    // ========================================================================

    function renderSectionsPanel() {
        console.log('🔧 PrebuiltSections.render() called');
        const container = document.getElementById('prebuiltSectionsContainer');
        if (!container) {
            console.warn('Prebuilt sections container not found');
            return;
        }
        console.log('✅ Found prebuiltSectionsContainer, rendering...');

        let html = `
            <div class="elements-section">
                <h4 class="section-title">Pre-built Sections</h4>
                <p class="help-text" style="margin: 0 0 12px 0; font-size: 11px; color: #6b7280;">
                    Click to add to current page
                </p>
                <div class="prebuilt-sections-grid">
        `;

        for (const [key, template] of Object.entries(SECTION_TEMPLATES)) {
            html += `
                <div class="prebuilt-section-item" onclick="PrebuiltSections.addSection('${key}')" title="Add ${template.name}">
                    ${template.icon}
                    <span class="prebuilt-section-label">${template.name}</span>
                </div>
            `;
        }

        html += `
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // ========================================================================
    // ADD SECTION TO PAGE
    // ========================================================================

    function addSection(sectionType) {
        const template = SECTION_TEMPLATES[sectionType];
        if (!template) {
            console.error('Unknown section type:', sectionType);
            return;
        }

        // Get current page
        const currentPageId = typeof EditorState !== 'undefined' ? EditorState.currentPage : null;
        const page = currentPageId
            ? document.querySelector(`.brochure-page[data-page-id="${currentPageId}"]`)
            : document.querySelector('.brochure-page');

        if (!page) {
            console.error('No page found to add section');
            if (typeof showToast === 'function') {
                showToast('Please select a page first', 'warning');
            }
            return;
        }

        // Create section data
        const pageId = page.dataset.pageId;
        const sectionId = `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const sectionData = {
            id: sectionId,
            type: 'section',
            sectionType: sectionType,
            position: { x: 50, y: 50 },
            size: { ...template.defaultSize },
            zIndex: typeof ElementDrag !== 'undefined' ? ElementDrag.getNextZIndex(pageId) : 20,
            locked: false,
            visible: true,
            data: getDefaultSectionData(sectionType)
        };

        // Add to EditorState
        if (typeof EditorState !== 'undefined') {
            if (!EditorState.elements[pageId]) {
                EditorState.elements[pageId] = [];
            }
            EditorState.elements[pageId].push(sectionData);
            EditorState.isDirty = true;
        }

        // Render on canvas
        renderSectionOnCanvas(sectionData, pageId);

        // Update layer panel
        if (typeof renderLayerPanel === 'function') {
            renderLayerPanel();
        }

        // Save to history
        if (typeof saveToHistory === 'function') {
            saveToHistory('add section');
        }

        if (typeof showToast === 'function') {
            showToast(`${template.name} added`, 'success');
        }

        console.log('➕ Added section:', sectionType);
    }

    function getDefaultSectionData(sectionType) {
        switch (sectionType) {
            case 'agentCard':
                return {
                    name: 'John Smith',
                    title: 'Senior Sales Negotiator',
                    phone: '020 1234 5678',
                    email: 'john@agency.com',
                    photo: null
                };
            case 'featuresBlock':
                return {
                    features: [
                        { icon: 'bed', text: '4 Bedrooms' },
                        { icon: 'bath', text: '2 Bathrooms' },
                        { icon: 'parking', text: 'Double Garage' },
                        { icon: 'garden', text: 'Large Garden' }
                    ]
                };
            case 'testimonial':
                return {
                    quote: 'The team at the agency were fantastic. They made the whole process seamless and stress-free.',
                    author: 'Mr & Mrs Johnson',
                    source: 'Recent Buyers'
                };
            case 'priceBanner':
                return {
                    label: 'Guide Price',
                    amount: '£450,000',
                    status: 'Available'
                };
            default:
                return {};
        }
    }

    // ========================================================================
    // RENDER SECTION ON CANVAS
    // ========================================================================

    function renderSectionOnCanvas(sectionData, pageId) {
        const page = document.querySelector(`.brochure-page[data-page-id="${pageId}"]`);
        if (!page) return;

        const element = document.createElement('div');
        element.className = `design-element section-element ${sectionData.sectionType}-section`;
        element.dataset.elementId = sectionData.id;
        element.dataset.elementType = 'section';
        element.dataset.sectionType = sectionData.sectionType;

        // Apply position and size
        element.style.position = 'absolute';
        element.style.left = sectionData.position.x + 'px';
        element.style.top = sectionData.position.y + 'px';
        element.style.width = sectionData.size.width + 'px';
        element.style.height = sectionData.size.height + 'px';
        element.style.zIndex = sectionData.zIndex;

        // Create content based on type
        const template = SECTION_TEMPLATES[sectionData.sectionType];
        if (template && template.create) {
            element.innerHTML = template.create(sectionData.data);
        }

        // Make content editable
        makeContentEditable(element, sectionData);

        page.appendChild(element);
    }

    // ========================================================================
    // CREATE SECTION CONTENT
    // ========================================================================

    function createAgentCard(data) {
        return `
            <div class="agent-card-element">
                <div class="agent-card-photo">
                    ${data.photo
                        ? `<img src="${data.photo}" alt="${data.name}">`
                        : `<svg viewBox="0 0 24 24" fill="#9ca3af" style="width:100%;height:100%;padding:15px;">
                            <circle cx="12" cy="8" r="4"/>
                            <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
                           </svg>`
                    }
                </div>
                <div class="agent-card-info">
                    <p class="agent-card-name" contenteditable="true">${data.name}</p>
                    <p class="agent-card-title" contenteditable="true">${data.title}</p>
                    <div class="agent-card-contact">
                        <span contenteditable="true">${data.phone}</span><br>
                        <a href="mailto:${data.email}" contenteditable="true">${data.email}</a>
                    </div>
                </div>
            </div>
        `;
    }

    function createFeaturesBlock(data) {
        const featureIcons = {
            bed: '<path d="M3 9v10a1 1 0 001 1h16a1 1 0 001-1V9M3 9V7a2 2 0 012-2h14a2 2 0 012 2v2M3 9h18M7 13h.01M7 17h.01"/>',
            bath: '<path d="M4 12h16v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5zM6 12V5a2 2 0 012-2h1a2 2 0 012 2v1"/>',
            parking: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M9 12h3a2 2 0 100-4H9v8"/>',
            garden: '<path d="M12 19V9M5 19h14M5 12c0-4 3-7 7-7s7 3 7 7"/>'
        };

        let featuresHtml = '';
        data.features.forEach(feature => {
            const iconPath = featureIcons[feature.icon] || featureIcons.bed;
            featuresHtml += `
                <div class="feature-item">
                    <div class="feature-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            ${iconPath}
                        </svg>
                    </div>
                    <span class="feature-text" contenteditable="true">${feature.text}</span>
                </div>
            `;
        });

        return `
            <div class="features-block-element">
                <div class="features-grid">
                    ${featuresHtml}
                </div>
            </div>
        `;
    }

    function createTestimonial(data) {
        return `
            <div class="testimonial-element">
                <p class="testimonial-quote" contenteditable="true">${data.quote}</p>
                <p class="testimonial-author" contenteditable="true">${data.author}</p>
                <p class="testimonial-source" contenteditable="true">${data.source}</p>
            </div>
        `;
    }

    function createPriceBanner(data) {
        return `
            <div class="price-banner-element">
                <p class="price-banner-label" contenteditable="true">${data.label}</p>
                <p class="price-banner-amount" contenteditable="true">${data.amount}</p>
                <p class="price-banner-status" contenteditable="true">${data.status}</p>
            </div>
        `;
    }

    // ========================================================================
    // MAKE CONTENT EDITABLE
    // ========================================================================

    function makeContentEditable(element, sectionData) {
        // Add click handler to stop propagation when editing text
        element.querySelectorAll('[contenteditable="true"]').forEach(editable => {
            editable.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            editable.addEventListener('blur', () => {
                // Update section data
                updateSectionData(element, sectionData);

                // Mark dirty
                if (typeof EditorState !== 'undefined') {
                    EditorState.isDirty = true;
                }
            });

            editable.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    editable.blur();
                }
            });
        });

        // Photo upload for agent card
        const photoContainer = element.querySelector('.agent-card-photo');
        if (photoContainer) {
            photoContainer.style.cursor = 'pointer';
            photoContainer.title = 'Click to upload photo';
            photoContainer.addEventListener('click', (e) => {
                e.stopPropagation();
                uploadAgentPhoto(element, sectionData);
            });
        }
    }

    function updateSectionData(element, sectionData) {
        const type = sectionData.sectionType;

        switch (type) {
            case 'agentCard':
                sectionData.data.name = element.querySelector('.agent-card-name')?.textContent || '';
                sectionData.data.title = element.querySelector('.agent-card-title')?.textContent || '';
                const contact = element.querySelector('.agent-card-contact');
                if (contact) {
                    const spans = contact.querySelectorAll('span, a');
                    if (spans[0]) sectionData.data.phone = spans[0].textContent;
                    if (spans[1]) sectionData.data.email = spans[1].textContent;
                }
                break;

            case 'featuresBlock':
                const features = [];
                element.querySelectorAll('.feature-item').forEach((item, index) => {
                    const text = item.querySelector('.feature-text')?.textContent || '';
                    const originalFeature = sectionData.data.features[index] || { icon: 'bed' };
                    features.push({ icon: originalFeature.icon, text });
                });
                sectionData.data.features = features;
                break;

            case 'testimonial':
                sectionData.data.quote = element.querySelector('.testimonial-quote')?.textContent || '';
                sectionData.data.author = element.querySelector('.testimonial-author')?.textContent || '';
                sectionData.data.source = element.querySelector('.testimonial-source')?.textContent || '';
                break;

            case 'priceBanner':
                sectionData.data.label = element.querySelector('.price-banner-label')?.textContent || '';
                sectionData.data.amount = element.querySelector('.price-banner-amount')?.textContent || '';
                sectionData.data.status = element.querySelector('.price-banner-status')?.textContent || '';
                break;
        }
    }

    function uploadAgentPhoto(element, sectionData) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const photoContainer = element.querySelector('.agent-card-photo');
                if (photoContainer) {
                    photoContainer.innerHTML = `<img src="${event.target.result}" alt="Agent Photo">`;
                    sectionData.data.photo = event.target.result;

                    if (typeof EditorState !== 'undefined') {
                        EditorState.isDirty = true;
                    }

                    console.log('📷 Agent photo updated');
                }
            };
            reader.readAsDataURL(file);
        };
        input.click();
    }

    // ========================================================================
    // INITIALIZATION
    // ========================================================================

    function initPrebuiltSections() {
        console.log('📦 Initializing pre-built sections...');
        renderSectionsPanel();
        console.log('✅ Pre-built sections initialized');
    }

    // ========================================================================
    // EXPOSE TO GLOBAL SCOPE
    // ========================================================================

    window.PrebuiltSections = {
        init: initPrebuiltSections,
        render: renderSectionsPanel,
        addSection,
        renderSectionOnCanvas,
        TEMPLATES: SECTION_TEMPLATES
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPrebuiltSections);
    } else {
        setTimeout(initPrebuiltSections, 700);
    }

})();
