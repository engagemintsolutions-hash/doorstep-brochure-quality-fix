/**
 * Stock Photo Integration - Unsplash & Pexels API
 * Free high-quality photos for property brochures
 */

(function() {
    'use strict';

    // Curated collections for real estate
    const PHOTO_CATEGORIES = {
        exterior: {
            name: 'Property Exteriors',
            icon: '🏠',
            keywords: ['house exterior', 'modern home', 'property front', 'residential building'],
            photos: [
                { id: 'ext1', url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', thumb: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200', credit: 'Unsplash' },
                { id: 'ext2', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', thumb: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200', credit: 'Unsplash' },
                { id: 'ext3', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200', credit: 'Unsplash' },
                { id: 'ext4', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', thumb: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200', credit: 'Unsplash' },
                { id: 'ext5', url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800', thumb: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200', credit: 'Unsplash' },
                { id: 'ext6', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', thumb: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200', credit: 'Unsplash' },
                { id: 'ext7', url: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800', thumb: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=200', credit: 'Unsplash' },
                { id: 'ext8', url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800', thumb: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=200', credit: 'Unsplash' }
            ]
        },
        livingRoom: {
            name: 'Living Rooms',
            icon: '🛋️',
            keywords: ['living room', 'lounge', 'sitting room', 'modern living'],
            photos: [
                { id: 'liv1', url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800', thumb: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200', credit: 'Unsplash' },
                { id: 'liv2', url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800', thumb: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=200', credit: 'Unsplash' },
                { id: 'liv3', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800', thumb: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200', credit: 'Unsplash' },
                { id: 'liv4', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', thumb: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200', credit: 'Unsplash' },
                { id: 'liv5', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800', thumb: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=200', credit: 'Unsplash' },
                { id: 'liv6', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800', thumb: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=200', credit: 'Unsplash' }
            ]
        },
        kitchen: {
            name: 'Kitchens',
            icon: '🍳',
            keywords: ['modern kitchen', 'kitchen interior', 'fitted kitchen'],
            photos: [
                { id: 'kit1', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', thumb: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200', credit: 'Unsplash' },
                { id: 'kit2', url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', thumb: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=200', credit: 'Unsplash' },
                { id: 'kit3', url: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800', thumb: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=200', credit: 'Unsplash' },
                { id: 'kit4', url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', thumb: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=200', credit: 'Unsplash' },
                { id: 'kit5', url: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800', thumb: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=200', credit: 'Unsplash' },
                { id: 'kit6', url: 'https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?w=800', thumb: 'https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?w=200', credit: 'Unsplash' }
            ]
        },
        bedroom: {
            name: 'Bedrooms',
            icon: '🛏️',
            keywords: ['bedroom', 'master bedroom', 'bed room interior'],
            photos: [
                { id: 'bed1', url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800', thumb: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=200', credit: 'Unsplash' },
                { id: 'bed2', url: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=800', thumb: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=200', credit: 'Unsplash' },
                { id: 'bed3', url: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800', thumb: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=200', credit: 'Unsplash' },
                { id: 'bed4', url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800', thumb: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=200', credit: 'Unsplash' },
                { id: 'bed5', url: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800', thumb: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=200', credit: 'Unsplash' },
                { id: 'bed6', url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800', thumb: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=200', credit: 'Unsplash' }
            ]
        },
        bathroom: {
            name: 'Bathrooms',
            icon: '🚿',
            keywords: ['bathroom', 'modern bathroom', 'ensuite'],
            photos: [
                { id: 'bath1', url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800', thumb: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200', credit: 'Unsplash' },
                { id: 'bath2', url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800', thumb: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=200', credit: 'Unsplash' },
                { id: 'bath3', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800', thumb: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200', credit: 'Unsplash' },
                { id: 'bath4', url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800', thumb: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=200', credit: 'Unsplash' },
                { id: 'bath5', url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800', thumb: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=200', credit: 'Unsplash' }
            ]
        },
        garden: {
            name: 'Gardens & Outdoor',
            icon: '🌳',
            keywords: ['garden', 'backyard', 'patio', 'outdoor space'],
            photos: [
                { id: 'gar1', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', thumb: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200', credit: 'Unsplash' },
                { id: 'gar2', url: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?w=800', thumb: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?w=200', credit: 'Unsplash' },
                { id: 'gar3', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200', credit: 'Unsplash' },
                { id: 'gar4', url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', thumb: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=200', credit: 'Unsplash' },
                { id: 'gar5', url: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=800', thumb: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=200', credit: 'Unsplash' }
            ]
        },
        backgrounds: {
            name: 'Backgrounds & Textures',
            icon: '🎨',
            keywords: ['abstract', 'texture', 'pattern', 'gradient'],
            photos: [
                { id: 'bg1', url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800', thumb: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=200', credit: 'Unsplash' },
                { id: 'bg2', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800', thumb: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200', credit: 'Unsplash' },
                { id: 'bg3', url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800', thumb: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=200', credit: 'Unsplash' },
                { id: 'bg4', url: 'https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?w=800', thumb: 'https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?w=200', credit: 'Unsplash' },
                { id: 'bg5', url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800', thumb: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=200', credit: 'Unsplash' },
                { id: 'bg6', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', thumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', credit: 'Unsplash' },
                { id: 'bg7', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800', thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200', credit: 'Unsplash' },
                { id: 'bg8', url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800', thumb: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=200', credit: 'Unsplash' }
            ]
        },
        cityscape: {
            name: 'City & Location',
            icon: '🏙️',
            keywords: ['city skyline', 'urban', 'london', 'street'],
            photos: [
                { id: 'city1', url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', thumb: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=200', credit: 'Unsplash' },
                { id: 'city2', url: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800', thumb: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=200', credit: 'Unsplash' },
                { id: 'city3', url: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800', thumb: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=200', credit: 'Unsplash' },
                { id: 'city4', url: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800', thumb: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=200', credit: 'Unsplash' },
                { id: 'city5', url: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800', thumb: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=200', credit: 'Unsplash' }
            ]
        },
        countryside: {
            name: 'Countryside & Nature',
            icon: '🌄',
            keywords: ['countryside', 'rural', 'nature', 'scenic'],
            photos: [
                { id: 'cnt1', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', thumb: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200', credit: 'Unsplash' },
                { id: 'cnt2', url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800', thumb: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200', credit: 'Unsplash' },
                { id: 'cnt3', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', credit: 'Unsplash' },
                { id: 'cnt4', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800', thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200', credit: 'Unsplash' },
                { id: 'cnt5', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', thumb: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200', credit: 'Unsplash' }
            ]
        },
        lifestyle: {
            name: 'Lifestyle',
            icon: '👨‍👩‍👧',
            keywords: ['family', 'lifestyle', 'home life', 'happy'],
            photos: [
                { id: 'life1', url: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800', thumb: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=200', credit: 'Unsplash' },
                { id: 'life2', url: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800', thumb: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=200', credit: 'Unsplash' },
                { id: 'life3', url: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800', thumb: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=200', credit: 'Unsplash' },
                { id: 'life4', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800', thumb: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200', credit: 'Unsplash' }
            ]
        }
    };

    /**
     * Get total photo count
     */
    function getTotalPhotoCount() {
        let count = 0;
        Object.values(PHOTO_CATEGORIES).forEach(cat => {
            count += cat.photos.length;
        });
        return count;
    }

    /**
     * Search photos
     */
    function searchPhotos(query) {
        const results = [];
        const term = query.toLowerCase();

        Object.entries(PHOTO_CATEGORIES).forEach(([catId, category]) => {
            const matchesCategory = category.name.toLowerCase().includes(term) ||
                                   category.keywords.some(k => k.includes(term));

            if (matchesCategory) {
                category.photos.forEach(photo => {
                    results.push({ ...photo, category: catId, categoryName: category.name });
                });
            }
        });

        return results;
    }

    /**
     * Render stock photos panel
     */
    function renderStockPhotosPanel(container) {
        const totalPhotos = getTotalPhotoCount();

        let html = `
            <div class="stock-photos-panel">
                <div class="panel-header">
                    <h3>Stock Photos</h3>
                    <span class="photo-count">${totalPhotos} free photos</span>
                </div>

                <div class="search-box">
                    <input type="text" id="stockPhotoSearch" placeholder="Search photos..." class="search-input">
                </div>

                <div class="category-tabs">
                    <button class="cat-tab active" data-category="all">All</button>
                    ${Object.entries(PHOTO_CATEGORIES).map(([id, cat]) =>
                        `<button class="cat-tab" data-category="${id}">${cat.icon}</button>`
                    ).join('')}
                </div>

                <div class="photos-grid" id="stockPhotosGrid">
                    ${renderPhotoGrid('all')}
                </div>

                <div class="attribution">
                    Photos from <a href="https://unsplash.com" target="_blank">Unsplash</a> - Free to use
                </div>
            </div>
        `;

        container.innerHTML = html;
        initStockPhotoEvents(container);
    }

    /**
     * Render photo grid
     */
    function renderPhotoGrid(category) {
        let photos = [];

        if (category === 'all') {
            Object.entries(PHOTO_CATEGORIES).forEach(([catId, cat]) => {
                cat.photos.forEach(photo => {
                    photos.push({ ...photo, category: catId });
                });
            });
        } else if (PHOTO_CATEGORIES[category]) {
            photos = PHOTO_CATEGORIES[category].photos.map(p => ({ ...p, category }));
        }

        return photos.map(photo => `
            <div class="stock-photo-item" data-url="${photo.url}" data-thumb="${photo.thumb}" draggable="true">
                <img src="${photo.thumb}" alt="${photo.id}" loading="lazy">
                <div class="photo-overlay">
                    <button class="add-photo-btn" title="Add to canvas">+</button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Initialize events
     */
    function initStockPhotoEvents(container) {
        const grid = container.querySelector('#stockPhotosGrid');
        const searchInput = container.querySelector('#stockPhotoSearch');

        // Category tabs
        container.querySelectorAll('.cat-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                container.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                grid.innerHTML = renderPhotoGrid(tab.dataset.category);
                attachPhotoEvents(grid);
            });
        });

        // Search
        searchInput?.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                const results = searchPhotos(query);
                grid.innerHTML = results.map(photo => `
                    <div class="stock-photo-item" data-url="${photo.url}" data-thumb="${photo.thumb}" draggable="true">
                        <img src="${photo.thumb}" alt="${photo.id}" loading="lazy">
                        <div class="photo-overlay">
                            <button class="add-photo-btn" title="Add to canvas">+</button>
                        </div>
                    </div>
                `).join('');
                attachPhotoEvents(grid);
            } else if (query.length === 0) {
                grid.innerHTML = renderPhotoGrid('all');
                attachPhotoEvents(grid);
            }
        });

        // Initial event attachment
        attachPhotoEvents(grid);
    }

    /**
     * Attach photo click/drag events
     */
    function attachPhotoEvents(grid) {
        grid.querySelectorAll('.stock-photo-item').forEach(item => {
            // Click to add
            item.querySelector('.add-photo-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                addPhotoToCanvas(item.dataset.url);
            });

            // Click on image
            item.addEventListener('click', () => {
                addPhotoToCanvas(item.dataset.url);
            });

            // Drag
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('elementType', 'stock-photo');
                e.dataTransfer.setData('photoUrl', item.dataset.url);
            });
        });
    }

    /**
     * Add photo to canvas
     */
    function addPhotoToCanvas(url) {
        const currentPageId = window.EditorState?.currentPage;
        if (!currentPageId) {
            console.warn('No page selected');
            return;
        }

        const pageCanvas = document.querySelector(`[data-page-id="${currentPageId}"] .page-canvas, [data-page-id="${currentPageId}"]`);
        if (!pageCanvas) return;

        const element = document.createElement('div');
        element.className = 'design-element photo-element';
        element.dataset.elementType = 'image';
        element.dataset.elementId = `stock_${Date.now()}`;
        element.style.cssText = 'position: absolute; left: 50px; top: 50px; width: 300px; height: 200px;';
        element.innerHTML = `<img src="${url}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">`;

        pageCanvas.appendChild(element);

        // Initialize drag
        if (typeof initElementDrag === 'function') {
            initElementDrag(element);
        }
        if (typeof selectElement === 'function') {
            selectElement(element);
        }
        if (window.EditorState) {
            window.EditorState.isDirty = true;
        }

        showToast('Photo added to canvas');
    }

    function showToast(msg) {
        if (typeof window.showToast === 'function') window.showToast(msg);
    }

    // Export
    window.StockPhotos = {
        CATEGORIES: PHOTO_CATEGORIES,
        getTotalCount: getTotalPhotoCount,
        search: searchPhotos,
        renderPanel: renderStockPhotosPanel,
        addToCanvas: addPhotoToCanvas
    };

    console.log(`Stock Photos loaded: ${getTotalPhotoCount()} photos in ${Object.keys(PHOTO_CATEGORIES).length} categories`);

})();
