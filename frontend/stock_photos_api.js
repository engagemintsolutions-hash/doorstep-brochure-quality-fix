/**
 * STOCK PHOTOS API INTEGRATION
 * Integrates free stock photo APIs: Unsplash, Pexels, Pixabay
 * For UK Estate Agent Brochure Editor
 */

const StockPhotosAPI = (function() {
    'use strict';

    // API Configuration
    // Note: For production, move API keys to backend proxy
    const CONFIG = {
        unsplash: {
            endpoint: 'https://api.unsplash.com/search/photos',
            // Free tier: 50 requests/hour
            // Users can add their own key
            apiKey: localStorage.getItem('unsplash_api_key') || '',
            enabled: false
        },
        pexels: {
            endpoint: 'https://api.pexels.com/v1/search',
            // Free tier: 200 requests/hour
            apiKey: localStorage.getItem('pexels_api_key') || '',
            enabled: false
        },
        pixabay: {
            endpoint: 'https://pixabay.com/api/',
            // Unlimited free tier
            apiKey: localStorage.getItem('pixabay_api_key') || '',
            enabled: false
        }
    };

    // Property-related search categories with icons and subcategories
    const CATEGORIES = {
        exterior: {
            icon: '🏠',
            label: 'Exterior',
            terms: ['house exterior', 'home facade', 'property front', 'residential building'],
            subcategories: {
                front: 'house front view',
                back: 'house back garden view',
                aerial: 'aerial house view',
                night: 'house exterior night',
                modern: 'modern house exterior',
                traditional: 'traditional british house',
                victorian: 'victorian house exterior',
                detached: 'detached house uk'
            }
        },
        interior: {
            icon: '🛋️',
            label: 'Living Room',
            terms: ['home interior', 'living room', 'modern interior', 'room design'],
            subcategories: {
                modern: 'modern living room',
                traditional: 'traditional living room',
                open_plan: 'open plan living room',
                fireplace: 'living room fireplace',
                bay_window: 'bay window living room'
            }
        },
        kitchen: {
            icon: '🍳',
            label: 'Kitchen',
            terms: ['modern kitchen', 'kitchen design', 'kitchen interior', 'cooking space'],
            subcategories: {
                modern: 'modern kitchen',
                traditional: 'traditional kitchen',
                island: 'kitchen island',
                breakfast_bar: 'kitchen breakfast bar',
                utility: 'utility room'
            }
        },
        bedroom: {
            icon: '🛏️',
            label: 'Bedroom',
            terms: ['bedroom interior', 'master bedroom', 'cozy bedroom', 'bedroom design'],
            subcategories: {
                master: 'master bedroom suite',
                guest: 'guest bedroom',
                ensuite: 'bedroom with ensuite',
                fitted: 'fitted wardrobes bedroom',
                kids: 'childrens bedroom'
            }
        },
        bathroom: {
            icon: '🚿',
            label: 'Bathroom',
            terms: ['bathroom design', 'modern bathroom', 'bathroom interior', 'luxury bathroom'],
            subcategories: {
                ensuite: 'ensuite bathroom',
                family: 'family bathroom',
                shower_room: 'shower room',
                freestanding: 'freestanding bath',
                wet_room: 'wet room'
            }
        },
        garden: {
            icon: '🌳',
            label: 'Garden',
            terms: ['home garden', 'backyard', 'garden design', 'outdoor space'],
            subcategories: {
                lawn: 'garden lawn',
                patio: 'garden patio',
                decking: 'garden decking',
                landscaped: 'landscaped garden',
                cottage: 'cottage garden'
            }
        },
        dining: {
            icon: '🍽️',
            label: 'Dining',
            terms: ['dining room', 'dining area', 'dinner table', 'dining interior'],
            subcategories: {
                formal: 'formal dining room',
                kitchen_diner: 'kitchen diner',
                conservatory: 'conservatory dining'
            }
        },
        office: {
            icon: '💼',
            label: 'Office',
            terms: ['home office', 'study room', 'workspace', 'office interior'],
            subcategories: {
                study: 'home study',
                built_in: 'built in desk home office'
            }
        },
        hallway: {
            icon: '🚪',
            label: 'Hallway',
            terms: ['entrance hall', 'hallway interior', 'staircase', 'reception hall'],
            subcategories: {
                entrance: 'entrance hall',
                stairs: 'staircase hallway',
                landing: 'upstairs landing'
            }
        },
        garage: {
            icon: '🚗',
            label: 'Parking',
            terms: ['garage', 'parking', 'carport', 'driveway'],
            subcategories: {
                integral: 'integral garage',
                double: 'double garage',
                driveway: 'block paved driveway'
            }
        },
        views: {
            icon: '🏔️',
            label: 'Views',
            terms: ['scenic view property', 'countryside view', 'garden view', 'panoramic view'],
            subcategories: {
                countryside: 'countryside view',
                city: 'city skyline view',
                garden: 'garden view window'
            }
        },
        lifestyle: {
            icon: '✨',
            label: 'Lifestyle',
            terms: ['luxury home', 'family home', 'cozy interior', 'elegant interior'],
            subcategories: {
                luxury: 'luxury property interior',
                family: 'family home interior',
                contemporary: 'contemporary interior design'
            }
        }
    };

    // UK-specific property styles
    const PROPERTY_STYLES = {
        victorian: { label: 'Victorian', terms: ['victorian house', 'victorian interior', 'period property'] },
        edwardian: { label: 'Edwardian', terms: ['edwardian house', 'edwardian interior'] },
        georgian: { label: 'Georgian', terms: ['georgian house', 'georgian townhouse'] },
        modern: { label: 'Modern', terms: ['modern house', 'contemporary home'] },
        cottage: { label: 'Cottage', terms: ['cottage interior', 'country cottage'] },
        barn: { label: 'Barn Conversion', terms: ['barn conversion', 'converted barn interior'] }
    };

    // Demo images for when no API key is configured
    const DEMO_IMAGES = {
        exterior: [
            { id: 'demo1', url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400', thumb: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200', photographer: 'Unsplash', source: 'demo' },
            { id: 'demo2', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400', thumb: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200', photographer: 'Unsplash', source: 'demo' },
            { id: 'demo3', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200', photographer: 'Unsplash', source: 'demo' }
        ],
        interior: [
            { id: 'demo4', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400', thumb: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200', photographer: 'Unsplash', source: 'demo' },
            { id: 'demo5', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400', thumb: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=200', photographer: 'Unsplash', source: 'demo' }
        ],
        kitchen: [
            { id: 'demo6', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', thumb: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200', photographer: 'Unsplash', source: 'demo' },
            { id: 'demo7', url: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=400', thumb: 'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?w=200', photographer: 'Unsplash', source: 'demo' }
        ],
        bedroom: [
            { id: 'demo8', url: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400', thumb: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=200', photographer: 'Unsplash', source: 'demo' },
            { id: 'demo9', url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400', thumb: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=200', photographer: 'Unsplash', source: 'demo' }
        ],
        bathroom: [
            { id: 'demo10', url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400', thumb: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200', photographer: 'Unsplash', source: 'demo' },
            { id: 'demo11', url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400', thumb: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=200', photographer: 'Unsplash', source: 'demo' }
        ],
        garden: [
            { id: 'demo12', url: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=400', thumb: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=200', photographer: 'Unsplash', source: 'demo' },
            { id: 'demo13', url: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?w=400', thumb: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?w=200', photographer: 'Unsplash', source: 'demo' }
        ]
    };

    // State
    let currentResults = [];
    let searchHistory = [];
    let isLoading = false;

    /**
     * Initialize the stock photos panel
     */
    function init() {
        console.log('[Stock Photos] Initializing...');

        // Check for API keys
        checkAPIKeys();

        // Create the UI panel
        createStockPhotosPanel();

        // Add sidebar tab
        addSidebarTab();

        console.log('[Stock Photos] Initialized');
    }

    /**
     * Check which APIs are enabled
     */
    function checkAPIKeys() {
        CONFIG.unsplash.enabled = !!CONFIG.unsplash.apiKey;
        CONFIG.pexels.enabled = !!CONFIG.pexels.apiKey;
        CONFIG.pixabay.enabled = !!CONFIG.pixabay.apiKey;

        const enabledAPIs = Object.entries(CONFIG)
            .filter(([_, conf]) => conf.enabled)
            .map(([name]) => name);

        if (enabledAPIs.length === 0) {
            console.log('[Stock Photos] No API keys configured - using demo mode');
        } else {
            console.log('[Stock Photos] Enabled APIs:', enabledAPIs.join(', '));
        }
    }

    /**
     * Create the stock photos panel UI
     */
    function createStockPhotosPanel() {
        // Check if panel already exists
        if (document.getElementById('stockPhotosPanel')) {
            return;
        }

        const panel = document.createElement('div');
        panel.id = 'stockPhotosPanel';
        panel.className = 'sidebar-panel';
        panel.style.display = 'none';

        panel.innerHTML = `
            <div class="stock-photos-header">
                <h3>Stock Photos</h3>
                <button class="settings-btn" onclick="StockPhotosAPI.showSettings()" title="API Settings">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                </button>
            </div>

            <div class="stock-photos-search">
                <input type="text" id="stockPhotoSearch" placeholder="Search photos..." />
                <button onclick="StockPhotosAPI.search()" class="search-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="M21 21l-4.35-4.35"></path>
                    </svg>
                </button>
            </div>

            <div class="stock-photos-categories" id="stockPhotosCategories">
                <button class="category-btn active" data-category="all" onclick="StockPhotosAPI.filterCategory('all')">
                    <span class="cat-icon">📷</span><span class="cat-label">All</span>
                </button>
                <button class="category-btn" data-category="exterior" onclick="StockPhotosAPI.filterCategory('exterior')">
                    <span class="cat-icon">🏠</span><span class="cat-label">Exterior</span>
                </button>
                <button class="category-btn" data-category="interior" onclick="StockPhotosAPI.filterCategory('interior')">
                    <span class="cat-icon">🛋️</span><span class="cat-label">Living</span>
                </button>
                <button class="category-btn" data-category="kitchen" onclick="StockPhotosAPI.filterCategory('kitchen')">
                    <span class="cat-icon">🍳</span><span class="cat-label">Kitchen</span>
                </button>
                <button class="category-btn" data-category="bedroom" onclick="StockPhotosAPI.filterCategory('bedroom')">
                    <span class="cat-icon">🛏️</span><span class="cat-label">Bedroom</span>
                </button>
                <button class="category-btn" data-category="bathroom" onclick="StockPhotosAPI.filterCategory('bathroom')">
                    <span class="cat-icon">🚿</span><span class="cat-label">Bath</span>
                </button>
                <button class="category-btn" data-category="garden" onclick="StockPhotosAPI.filterCategory('garden')">
                    <span class="cat-icon">🌳</span><span class="cat-label">Garden</span>
                </button>
                <button class="category-btn" data-category="dining" onclick="StockPhotosAPI.filterCategory('dining')">
                    <span class="cat-icon">🍽️</span><span class="cat-label">Dining</span>
                </button>
                <button class="category-btn" data-category="hallway" onclick="StockPhotosAPI.filterCategory('hallway')">
                    <span class="cat-icon">🚪</span><span class="cat-label">Hall</span>
                </button>
                <button class="category-btn" data-category="views" onclick="StockPhotosAPI.filterCategory('views')">
                    <span class="cat-icon">🏔️</span><span class="cat-label">Views</span>
                </button>
            </div>

            <div class="stock-photos-subcategories" id="stockPhotosSubcategories" style="display: none;">
            </div>

            <div class="stock-photos-grid" id="stockPhotosGrid">
                <div class="stock-photos-loading" style="display: none;">
                    <div class="spinner"></div>
                    <span>Searching...</span>
                </div>
                <div class="stock-photos-empty">
                    <p>Select a category or search for photos</p>
                    <p class="hint">Click a photo to add it to your design</p>
                </div>
            </div>

            <div class="stock-photos-attribution" id="stockPhotosAttribution" style="display: none;">
                <small>Photos from <span id="photoSource">Unsplash/Pexels</span></small>
            </div>
        `;

        // Find the sidebar panels container
        const sidebar = document.querySelector('.sidebar, .editor-sidebar, #sidebar');
        if (sidebar) {
            sidebar.appendChild(panel);
        } else {
            // Fallback: add to body
            document.body.appendChild(panel);
        }

        // Add enter key handler for search
        const searchInput = document.getElementById('stockPhotoSearch');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    search();
                }
            });
        }

        // Load demo images initially
        loadDemoImages('all');
    }

    /**
     * Add sidebar tab for stock photos
     */
    function addSidebarTab() {
        const tabsContainer = document.querySelector('.sidebar-tabs, .editor-tabs');
        if (!tabsContainer) {
            console.log('[Stock Photos] Tabs container not found, creating floating button');
            createFloatingButton();
            return;
        }

        // Check if tab already exists
        if (document.querySelector('[data-panel="stockPhotos"]')) {
            return;
        }

        const tab = document.createElement('button');
        tab.className = 'sidebar-tab';
        tab.dataset.panel = 'stockPhotos';
        tab.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>Photos</span>
        `;

        tab.addEventListener('click', () => {
            showPanel();
        });

        tabsContainer.appendChild(tab);
    }

    /**
     * Create floating button if sidebar tabs not found
     */
    function createFloatingButton() {
        if (document.getElementById('stockPhotosFloatingBtn')) {
            return;
        }

        const btn = document.createElement('button');
        btn.id = 'stockPhotosFloatingBtn';
        btn.className = 'floating-stock-photos-btn';
        btn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
        `;
        btn.title = 'Stock Photos';
        btn.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--doorstep-red, #C20430);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        btn.addEventListener('click', () => {
            togglePanel();
        });

        document.body.appendChild(btn);
    }

    /**
     * Show the stock photos panel
     */
    function showPanel() {
        const panel = document.getElementById('stockPhotosPanel');
        if (panel) {
            // Hide other panels
            document.querySelectorAll('.sidebar-panel').forEach(p => {
                if (p.id !== 'stockPhotosPanel') {
                    p.style.display = 'none';
                }
            });
            panel.style.display = 'block';

            // Update active tab
            document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
            const tab = document.querySelector('[data-panel="stockPhotos"]');
            if (tab) tab.classList.add('active');
        }
    }

    /**
     * Toggle panel visibility
     */
    function togglePanel() {
        const panel = document.getElementById('stockPhotosPanel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    }

    /**
     * Search for photos
     */
    async function search(query) {
        const searchInput = document.getElementById('stockPhotoSearch');
        const searchQuery = query || (searchInput ? searchInput.value.trim() : '');

        if (!searchQuery) {
            loadDemoImages('all');
            return;
        }

        console.log('[Stock Photos] Searching for:', searchQuery);
        setLoading(true);

        try {
            // Try enabled APIs
            let results = [];

            if (CONFIG.pexels.enabled) {
                results = await searchPexels(searchQuery);
            } else if (CONFIG.unsplash.enabled) {
                results = await searchUnsplash(searchQuery);
            } else if (CONFIG.pixabay.enabled) {
                results = await searchPixabay(searchQuery);
            } else {
                // Demo mode - filter demo images by query
                results = filterDemoByQuery(searchQuery);
            }

            currentResults = results;
            renderResults(results);

            // Save to history
            if (!searchHistory.includes(searchQuery)) {
                searchHistory.unshift(searchQuery);
                if (searchHistory.length > 10) searchHistory.pop();
            }
        } catch (error) {
            console.error('[Stock Photos] Search error:', error);
            showError('Search failed. Using demo images.');
            loadDemoImages('all');
        } finally {
            setLoading(false);
        }
    }

    /**
     * Search Pexels API
     */
    async function searchPexels(query) {
        const response = await fetch(`${CONFIG.pexels.endpoint}?query=${encodeURIComponent(query)}&per_page=30`, {
            headers: {
                'Authorization': CONFIG.pexels.apiKey
            }
        });

        if (!response.ok) throw new Error('Pexels API error');

        const data = await response.json();
        return data.photos.map(photo => ({
            id: photo.id,
            url: photo.src.large,
            thumb: photo.src.medium,
            photographer: photo.photographer,
            source: 'pexels',
            alt: photo.alt || query
        }));
    }

    /**
     * Search Unsplash API
     */
    async function searchUnsplash(query) {
        const response = await fetch(`${CONFIG.unsplash.endpoint}?query=${encodeURIComponent(query)}&per_page=30`, {
            headers: {
                'Authorization': `Client-ID ${CONFIG.unsplash.apiKey}`
            }
        });

        if (!response.ok) throw new Error('Unsplash API error');

        const data = await response.json();
        return data.results.map(photo => ({
            id: photo.id,
            url: photo.urls.regular,
            thumb: photo.urls.small,
            photographer: photo.user.name,
            source: 'unsplash',
            alt: photo.alt_description || query
        }));
    }

    /**
     * Search Pixabay API
     */
    async function searchPixabay(query) {
        const response = await fetch(`${CONFIG.pixabay.endpoint}?key=${CONFIG.pixabay.apiKey}&q=${encodeURIComponent(query)}&per_page=30&image_type=photo`);

        if (!response.ok) throw new Error('Pixabay API error');

        const data = await response.json();
        return data.hits.map(photo => ({
            id: photo.id,
            url: photo.largeImageURL,
            thumb: photo.previewURL,
            photographer: photo.user,
            source: 'pixabay',
            alt: photo.tags
        }));
    }

    /**
     * Filter demo images by search query
     */
    function filterDemoByQuery(query) {
        const q = query.toLowerCase();
        const results = [];

        Object.entries(DEMO_IMAGES).forEach(([category, images]) => {
            if (category.includes(q) || q.includes(category)) {
                results.push(...images);
            }
        });

        // If no category match, return all demo images
        if (results.length === 0) {
            Object.values(DEMO_IMAGES).forEach(images => results.push(...images));
        }

        return results;
    }

    /**
     * Filter by category
     */
    function filterCategory(category, subcategory = null) {
        // Update button states
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        const subcategoriesContainer = document.getElementById('stockPhotosSubcategories');

        if (category === 'all') {
            // Hide subcategories
            if (subcategoriesContainer) subcategoriesContainer.style.display = 'none';
            loadDemoImages('all');
        } else {
            const categoryData = CATEGORIES[category];
            if (!categoryData) {
                loadDemoImages(category);
                return;
            }

            // Show subcategories if available
            if (categoryData.subcategories && subcategoriesContainer) {
                subcategoriesContainer.innerHTML = '';
                subcategoriesContainer.style.display = 'flex';

                // Add "All" subcategory
                const allBtn = document.createElement('button');
                allBtn.className = 'subcategory-btn' + (subcategory === null ? ' active' : '');
                allBtn.textContent = 'All ' + categoryData.label;
                allBtn.onclick = () => filterCategory(category, null);
                subcategoriesContainer.appendChild(allBtn);

                // Add specific subcategories
                Object.entries(categoryData.subcategories).forEach(([key, searchTerm]) => {
                    const btn = document.createElement('button');
                    btn.className = 'subcategory-btn' + (subcategory === key ? ' active' : '');
                    btn.textContent = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                    btn.onclick = () => filterCategory(category, key);
                    subcategoriesContainer.appendChild(btn);
                });
            }

            // Search for category-specific images
            let searchTerm;
            if (subcategory && categoryData.subcategories && categoryData.subcategories[subcategory]) {
                searchTerm = categoryData.subcategories[subcategory];
            } else if (categoryData.terms && categoryData.terms.length > 0) {
                searchTerm = categoryData.terms[0];
            }

            if (searchTerm) {
                search(searchTerm);
            } else {
                loadDemoImages(category);
            }
        }
    }

    /**
     * Search by property style
     */
    function searchByStyle(styleKey) {
        const style = PROPERTY_STYLES[styleKey];
        if (style && style.terms && style.terms.length > 0) {
            search(style.terms[0]);
        }
    }

    /**
     * Load demo images
     */
    function loadDemoImages(category) {
        let images = [];

        if (category === 'all') {
            Object.values(DEMO_IMAGES).forEach(categoryImages => {
                images.push(...categoryImages);
            });
        } else if (DEMO_IMAGES[category]) {
            images = DEMO_IMAGES[category];
        }

        currentResults = images;
        renderResults(images);
    }

    /**
     * Render search results
     */
    function renderResults(results) {
        const grid = document.getElementById('stockPhotosGrid');
        if (!grid) return;

        // Clear existing content
        const loading = grid.querySelector('.stock-photos-loading');
        const empty = grid.querySelector('.stock-photos-empty');

        // Remove photo items
        grid.querySelectorAll('.stock-photo-item').forEach(item => item.remove());

        if (results.length === 0) {
            if (empty) {
                empty.innerHTML = '<p>No photos found</p><p class="hint">Try a different search term</p>';
                empty.style.display = 'block';
            }
            return;
        }

        if (empty) empty.style.display = 'none';

        // Create photo items
        results.forEach(photo => {
            const item = document.createElement('div');
            item.className = 'stock-photo-item';
            item.draggable = true;
            item.dataset.photoUrl = photo.url;
            item.dataset.photoId = photo.id;
            item.dataset.source = photo.source;

            item.innerHTML = `
                <img src="${photo.thumb}" alt="${photo.alt || 'Stock photo'}" loading="lazy" />
                <div class="photo-overlay">
                    <span class="photographer">${photo.photographer}</span>
                    <span class="source">${photo.source}</span>
                </div>
            `;

            // Click to add to canvas
            item.addEventListener('click', () => {
                addPhotoToCanvas(photo);
            });

            // Drag support
            item.addEventListener('dragstart', (e) => {
                const dragData = JSON.stringify({
                    type: 'stock-photo',
                    url: photo.url,
                    thumb: photo.thumb,
                    photographer: photo.photographer,
                    source: photo.source
                });
                e.dataTransfer.setData('text/plain', dragData);
                e.dataTransfer.setData('application/json', dragData);
                e.dataTransfer.effectAllowed = 'copy';
            });

            grid.appendChild(item);
        });

        // Show attribution
        const sources = [...new Set(results.map(r => r.source))].join(', ');
        const attribution = document.getElementById('stockPhotosAttribution');
        const sourceSpan = document.getElementById('photoSource');
        if (attribution && sourceSpan) {
            sourceSpan.textContent = sources || 'Demo';
            attribution.style.display = 'block';
        }
    }

    /**
     * Add photo to canvas
     */
    function addPhotoToCanvas(photo) {
        console.log('[Stock Photos] Adding photo to canvas:', photo.url);

        // Find active page
        const activePage = document.querySelector('.brochure-page.active, .page-canvas.active') ||
                          document.querySelector('.brochure-page, .page-canvas');

        if (!activePage) {
            showError('No page available. Create a page first.');
            return;
        }

        // Create image element
        const imgElement = document.createElement('div');
        imgElement.className = 'design-element image-element stock-photo';
        imgElement.dataset.elementType = 'image';
        imgElement.dataset.source = photo.source;
        imgElement.dataset.photographer = photo.photographer;
        imgElement.style.cssText = `
            position: absolute;
            left: 50px;
            top: 50px;
            width: 200px;
            height: 150px;
            cursor: move;
        `;

        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = photo.alt || 'Stock photo';
        img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 4px;
        `;

        imgElement.appendChild(img);
        activePage.appendChild(imgElement);

        // Make it draggable/selectable
        if (typeof ElementDrag !== 'undefined' && ElementDrag.makeElementDraggable) {
            ElementDrag.makeElementDraggable(imgElement);
        }

        // Select the new element
        if (typeof selectElement === 'function') {
            selectElement(imgElement);
        }

        console.log('[Stock Photos] Photo added successfully');

        // Show success message
        showToast(`Photo added from ${photo.source}`);
    }

    /**
     * Show settings modal
     */
    function showSettings() {
        // Check if modal already exists
        let modal = document.getElementById('stockPhotosSettingsModal');
        if (modal) {
            modal.style.display = 'flex';
            return;
        }

        // Create modal
        modal = document.createElement('div');
        modal.id = 'stockPhotosSettingsModal';
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div class="modal-content" style="background: white; padding: 24px; border-radius: 8px; max-width: 500px; width: 90%;">
                <h3 style="margin: 0 0 16px 0;">Stock Photo API Settings</h3>
                <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
                    Add your API keys to search millions of free stock photos.
                    All these services have generous free tiers.
                </p>

                <div style="margin-bottom: 16px;">
                    <label style="display: block; font-weight: 500; margin-bottom: 4px;">
                        Pexels API Key
                        <a href="https://www.pexels.com/api/new/" target="_blank" style="font-size: 12px; color: var(--doorstep-red);">(Get free key)</a>
                    </label>
                    <input type="text" id="pexelsApiKey" value="${CONFIG.pexels.apiKey}"
                           placeholder="Enter Pexels API key"
                           style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" />
                </div>

                <div style="margin-bottom: 16px;">
                    <label style="display: block; font-weight: 500; margin-bottom: 4px;">
                        Unsplash API Key
                        <a href="https://unsplash.com/developers" target="_blank" style="font-size: 12px; color: var(--doorstep-red);">(Get free key)</a>
                    </label>
                    <input type="text" id="unsplashApiKey" value="${CONFIG.unsplash.apiKey}"
                           placeholder="Enter Unsplash Access Key"
                           style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" />
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: 500; margin-bottom: 4px;">
                        Pixabay API Key
                        <a href="https://pixabay.com/api/docs/" target="_blank" style="font-size: 12px; color: var(--doorstep-red);">(Get free key)</a>
                    </label>
                    <input type="text" id="pixabayApiKey" value="${CONFIG.pixabay.apiKey}"
                           placeholder="Enter Pixabay API key"
                           style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" />
                </div>

                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button onclick="document.getElementById('stockPhotosSettingsModal').style.display='none'"
                            style="padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">
                        Cancel
                    </button>
                    <button onclick="StockPhotosAPI.saveSettings()"
                            style="padding: 8px 16px; background: var(--doorstep-red, #C20430); color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Save Settings
                    </button>
                </div>
            </div>
        `;

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        document.body.appendChild(modal);
    }

    /**
     * Save API settings
     */
    function saveSettings() {
        const pexelsKey = document.getElementById('pexelsApiKey').value.trim();
        const unsplashKey = document.getElementById('unsplashApiKey').value.trim();
        const pixabayKey = document.getElementById('pixabayApiKey').value.trim();

        // Save to localStorage
        if (pexelsKey) localStorage.setItem('pexels_api_key', pexelsKey);
        if (unsplashKey) localStorage.setItem('unsplash_api_key', unsplashKey);
        if (pixabayKey) localStorage.setItem('pixabay_api_key', pixabayKey);

        // Update config
        CONFIG.pexels.apiKey = pexelsKey;
        CONFIG.unsplash.apiKey = unsplashKey;
        CONFIG.pixabay.apiKey = pixabayKey;

        // Re-check API keys
        checkAPIKeys();

        // Close modal
        const modal = document.getElementById('stockPhotosSettingsModal');
        if (modal) modal.style.display = 'none';

        showToast('Settings saved!');
    }

    /**
     * Set loading state
     */
    function setLoading(loading) {
        isLoading = loading;
        const loadingEl = document.querySelector('.stock-photos-loading');
        if (loadingEl) {
            loadingEl.style.display = loading ? 'flex' : 'none';
        }
    }

    /**
     * Show error message
     */
    function showError(message) {
        console.error('[Stock Photos]', message);
        showToast(message, 'error');
    }

    /**
     * Show toast notification
     */
    function showToast(message, type = 'success') {
        // Remove existing toast
        const existing = document.querySelector('.stock-photos-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'stock-photos-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
            color: white;
            border-radius: 4px;
            z-index: 10001;
            animation: fadeInUp 0.3s ease;
        `;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 3000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Small delay to ensure other scripts are loaded
        setTimeout(init, 500);
    }

    // Public API
    return {
        init,
        search,
        filterCategory,
        showSettings,
        saveSettings,
        showPanel,
        togglePanel,
        addPhotoToCanvas,
        SOURCES: CONFIG,
        CATEGORIES: CATEGORIES,
        isLoaded: true
    };
})();

// Export for global access
window.StockPhotosAPI = StockPhotosAPI;
