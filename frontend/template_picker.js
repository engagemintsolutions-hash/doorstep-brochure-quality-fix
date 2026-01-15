/**
 * Template Picker - Canva-style template selection with category filtering
 */

(function() {
    'use strict';

    // Template categories
    const TEMPLATE_CATEGORIES = [
        { id: 'all', name: 'All Templates', icon: '🎨' },
        { id: 'agency', name: 'UK Agencies', icon: '🏢' },
        { id: 'minimalist', name: 'Minimalist', icon: '⬜' },
        { id: 'bold', name: 'Bold', icon: '🌅' },
        { id: 'luxury', name: 'Luxury', icon: '🏆' },
        { id: 'social', name: 'Social Media', icon: '📱' }
    ];

    let currentCategory = 'all';
    let searchTerm = '';

    /**
     * Get templates by category
     */
    function getTemplatesByCategory(category) {
        if (!window.BrochureTemplates || !window.BrochureTemplates.free) {
            console.warn('BrochureTemplates not loaded');
            return [];
        }

        const allTemplates = Object.values(window.BrochureTemplates.free);

        if (category === 'all') {
            return allTemplates;
        }

        // Map categories to template prefixes or category fields
        const categoryMap = {
            'agency': ['savills', 'rightmove', 'zoopla', 'foxtons', 'knight_frank', 'hamptons', 'winkworth', 'strutt', 'chestertons', 'dexters', 'purplebricks', 'connells', 'countrywide', 'countryside', 'jackson', 'mayfair'],
            'minimalist': template => template.category === 'minimalist' || template.id?.startsWith('minimal'),
            'bold': template => template.category === 'bold' || template.id?.startsWith('bold'),
            'luxury': template => template.category === 'luxury' || template.id?.startsWith('luxury'),
            'social': template => template.category === 'social' || template.id?.startsWith('social')
        };

        const filter = categoryMap[category];

        if (Array.isArray(filter)) {
            // Filter by ID prefix
            return allTemplates.filter(t => filter.some(prefix => t.id?.startsWith(prefix)));
        } else if (typeof filter === 'function') {
            // Filter by function
            return allTemplates.filter(filter);
        }

        return allTemplates;
    }

    /**
     * Filter templates by search term
     */
    function filterBySearch(templates, term) {
        if (!term) return templates;
        const lowerTerm = term.toLowerCase();
        return templates.filter(t =>
            t.name?.toLowerCase().includes(lowerTerm) ||
            t.description?.toLowerCase().includes(lowerTerm) ||
            t.id?.toLowerCase().includes(lowerTerm)
        );
    }

    /**
     * Render template picker panel
     */
    function renderTemplatePicker(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let templates = getTemplatesByCategory(currentCategory);
        templates = filterBySearch(templates, searchTerm);

        container.innerHTML = `
            <div class="template-picker">
                <!-- Search Bar -->
                <div class="template-search">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input type="text" id="templateSearchInput" placeholder="Search templates..." value="${searchTerm}">
                </div>

                <!-- Category Tabs -->
                <div class="template-categories">
                    ${TEMPLATE_CATEGORIES.map(cat => `
                        <button class="category-btn ${currentCategory === cat.id ? 'active' : ''}" data-category="${cat.id}">
                            <span class="category-icon">${cat.icon}</span>
                            <span class="category-name">${cat.name}</span>
                        </button>
                    `).join('')}
                </div>

                <!-- Templates Grid -->
                <div class="templates-grid">
                    ${templates.length > 0 ? templates.map(template => `
                        <div class="template-card" data-template-id="${template.id}" title="${template.description || template.name}">
                            <div class="template-preview" style="
                                background: ${template.styles?.pageBackground || '#fff'};
                                border: ${template.styles?.borderWidth || '2px'} ${template.styles?.borderStyle || 'solid'} ${template.styles?.borderColor || '#ccc'};
                            ">
                                <div class="template-preview-content">
                                    <div class="preview-header" style="background: ${template.styles?.accentColor || '#333'};"></div>
                                    <div class="preview-body">
                                        <div class="preview-text" style="background: ${template.styles?.textPrimary || '#333'}; opacity: 0.3;"></div>
                                        <div class="preview-text short" style="background: ${template.styles?.textSecondary || '#666'}; opacity: 0.2;"></div>
                                    </div>
                                    <div class="preview-accent" style="background: ${template.styles?.accentSecondary || '#ddd'};"></div>
                                </div>
                            </div>
                            <div class="template-info">
                                <span class="template-emoji">${template.preview || '🎨'}</span>
                                <span class="template-name">${template.name}</span>
                            </div>
                        </div>
                    `).join('') : `
                        <div class="no-templates">
                            <p>No templates found</p>
                        </div>
                    `}
                </div>

                <!-- Template Count -->
                <div class="template-count">
                    ${templates.length} template${templates.length !== 1 ? 's' : ''} available
                </div>
            </div>
        `;

        // Attach event listeners
        initTemplatePickerEvents(container);
    }

    /**
     * Initialize template picker events
     */
    function initTemplatePickerEvents(container) {
        // Category buttons
        container.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentCategory = btn.dataset.category;
                renderTemplatePicker('templatePickerContent');
            });
        });

        // Search input
        const searchInput = container.querySelector('#templateSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchTerm = e.target.value;
                // Debounce search
                clearTimeout(searchInput._debounce);
                searchInput._debounce = setTimeout(() => {
                    renderTemplatePicker('templatePickerContent');
                }, 200);
            });
        }

        // Template cards
        container.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => {
                const templateId = card.dataset.templateId;
                applyTemplateToCurrentPage(templateId);
            });
        });
    }

    /**
     * Apply template to current page
     */
    function applyTemplateToCurrentPage(templateId) {
        const currentPageId = window.EditorState?.currentPage;
        if (!currentPageId) {
            showToast('Please select a page first', 'warning');
            return;
        }

        const pageElement = document.querySelector(`.brochure-page[data-page-id="${currentPageId}"]`);
        if (!pageElement) {
            console.error('Page element not found');
            return;
        }

        // Use the global applyTemplate function from brochure_templates.js
        if (typeof window.applyTemplate === 'function') {
            window.applyTemplate(templateId, pageElement);
            showToast(`Applied "${templateId}" template`, 'success');

            // Mark as dirty
            if (window.EditorState) {
                window.EditorState.isDirty = true;
            }

            // Save to history
            if (typeof saveToHistory === 'function') {
                saveToHistory('apply template');
            }
        } else {
            console.error('applyTemplate function not found');
        }
    }

    /**
     * Apply template to all pages
     */
    function applyTemplateToAllPages(templateId) {
        const pages = document.querySelectorAll('.brochure-page');
        pages.forEach(pageElement => {
            if (typeof window.applyTemplate === 'function') {
                window.applyTemplate(templateId, pageElement);
            }
        });

        showToast(`Applied "${templateId}" to all pages`, 'success');

        if (window.EditorState) {
            window.EditorState.isDirty = true;
        }
    }

    /**
     * Show toast notification
     */
    function showToast(message, type = 'info') {
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        } else {
            console.log(`[${type}] ${message}`);
        }
    }

    // Export to global scope
    window.TemplatePicker = {
        render: renderTemplatePicker,
        applyToCurrentPage: applyTemplateToCurrentPage,
        applyToAllPages: applyTemplateToAllPages,
        getCategories: () => TEMPLATE_CATEGORIES,
        setCategory: (cat) => { currentCategory = cat; },
        setSearch: (term) => { searchTerm = term; }
    };

    console.log('Template Picker loaded');

})();
