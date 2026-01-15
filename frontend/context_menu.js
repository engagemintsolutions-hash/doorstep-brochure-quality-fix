/**
 * Context Menu - Right-click menu for elements
 * Provides quick access to common actions
 */

(function() {
    'use strict';

    let activeMenu = null;
    let targetElement = null;

    // Menu items configuration
    const MENU_ITEMS = [
        { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C', icon: 'copy', action: 'copy' },
        { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V', icon: 'paste', action: 'paste' },
        { id: 'duplicate', label: 'Duplicate', shortcut: 'Ctrl+D', icon: 'duplicate', action: 'duplicate' },
        { type: 'separator' },
        { id: 'bringFront', label: 'Bring to Front', shortcut: '', icon: 'front', action: 'bringToFront' },
        { id: 'sendBack', label: 'Send to Back', shortcut: '', icon: 'back', action: 'sendToBack' },
        { type: 'separator' },
        { id: 'lock', label: 'Lock', shortcut: '', icon: 'lock', action: 'lock' },
        { id: 'unlock', label: 'Unlock', shortcut: '', icon: 'unlock', action: 'unlock', hidden: true },
        { type: 'separator' },
        { id: 'delete', label: 'Delete', shortcut: 'Del', icon: 'delete', action: 'delete', danger: true }
    ];

    // Icons for menu items
    const ICONS = {
        copy: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>`,
        paste: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
            <rect x="8" y="2" width="8" height="4" rx="1"/>
        </svg>`,
        duplicate: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="8" y="8" width="12" height="12" rx="2"/>
            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>
        </svg>`,
        front: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="8" y="2" width="14" height="14" rx="2" fill="currentColor" opacity="0.3"/>
            <rect x="2" y="8" width="14" height="14" rx="2"/>
        </svg>`,
        back: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="2" width="14" height="14" rx="2"/>
            <rect x="8" y="8" width="14" height="14" rx="2" fill="currentColor" opacity="0.3"/>
        </svg>`,
        lock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>`,
        unlock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
        </svg>`,
        delete: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/>
            <line x1="14" y1="11" x2="14" y2="17"/>
        </svg>`
    };

    /**
     * Initialize context menu system
     */
    function init() {
        // Listen for right-click on elements
        document.addEventListener('contextmenu', handleContextMenu);

        // Close menu on click outside
        document.addEventListener('click', closeMenu);

        // Close menu on scroll
        document.addEventListener('scroll', closeMenu, true);

        // Close menu on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });

        console.log('Context Menu initialized');
    }

    /**
     * Handle right-click
     */
    function handleContextMenu(e) {
        // Find if we clicked on a design element
        const element = e.target.closest('.design-element, .shape-element, .icon-element, .brochure-element, .editable, [data-element-type]');

        if (element) {
            e.preventDefault();
            targetElement = element;

            // Select the element if not already selected
            if (typeof selectElement === 'function') {
                selectElement(element);
            } else if (window.EditorState) {
                window.EditorState.selectedElement = element;
            }

            showMenu(e.clientX, e.clientY, element);
        } else {
            closeMenu();
        }
    }

    /**
     * Show context menu at position
     */
    function showMenu(x, y, element) {
        closeMenu(); // Close any existing menu

        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.innerHTML = buildMenuHTML(element);

        document.body.appendChild(menu);
        activeMenu = menu;

        // Position menu
        const menuRect = menu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Adjust position if menu would go off screen
        let finalX = x;
        let finalY = y;

        if (x + menuRect.width > viewportWidth) {
            finalX = x - menuRect.width;
        }
        if (y + menuRect.height > viewportHeight) {
            finalY = y - menuRect.height;
        }

        menu.style.left = finalX + 'px';
        menu.style.top = finalY + 'px';

        // Attach menu item listeners
        menu.querySelectorAll('.context-menu-item:not(.disabled)').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = item.dataset.action;
                executeAction(action);
                closeMenu();
            });
        });
    }

    /**
     * Build menu HTML
     */
    function buildMenuHTML(element) {
        const isLocked = element.dataset.locked === 'true';

        return MENU_ITEMS.map(item => {
            if (item.type === 'separator') {
                return '<div class="context-menu-separator"></div>';
            }

            // Handle lock/unlock visibility
            if (item.id === 'lock' && isLocked) return '';
            if (item.id === 'unlock' && !isLocked) return '';

            const dangerClass = item.danger ? 'danger' : '';
            const icon = ICONS[item.icon] || '';

            return `
                <div class="context-menu-item ${dangerClass}" data-action="${item.action}">
                    <span class="menu-icon">${icon}</span>
                    <span class="menu-label">${item.label}</span>
                    ${item.shortcut ? `<span class="menu-shortcut">${item.shortcut}</span>` : ''}
                </div>
            `;
        }).join('');
    }

    /**
     * Close context menu
     */
    function closeMenu() {
        if (activeMenu) {
            activeMenu.remove();
            activeMenu = null;
        }
    }

    /**
     * Execute menu action
     */
    function executeAction(action) {
        if (!targetElement && action !== 'paste') return;

        switch (action) {
            case 'copy':
                if (typeof copySelectedElement === 'function') {
                    copySelectedElement();
                }
                break;

            case 'paste':
                if (typeof pasteElement === 'function') {
                    pasteElement();
                }
                break;

            case 'duplicate':
                if (typeof duplicateElement === 'function') {
                    duplicateElement();
                }
                break;

            case 'delete':
                if (typeof deleteSelectedElement === 'function') {
                    deleteSelectedElement();
                } else if (targetElement) {
                    targetElement.remove();
                    showToast('Element deleted');
                }
                break;

            case 'bringToFront':
                bringToFront(targetElement);
                break;

            case 'sendToBack':
                sendToBack(targetElement);
                break;

            case 'lock':
                lockElement(targetElement);
                break;

            case 'unlock':
                unlockElement(targetElement);
                break;
        }
    }

    /**
     * Bring element to front
     */
    function bringToFront(element) {
        if (!element) return;

        const parent = element.parentElement;
        const siblings = parent.querySelectorAll('.design-element, .shape-element, .icon-element, .brochure-element');
        let maxZ = 0;

        siblings.forEach(sibling => {
            const z = parseInt(sibling.style.zIndex) || 0;
            if (z > maxZ) maxZ = z;
        });

        element.style.zIndex = maxZ + 1;
        showToast('Brought to front');

        // Update layer panel if exists
        if (typeof LayerSystem !== 'undefined' && LayerSystem.render) {
            LayerSystem.render();
        }
    }

    /**
     * Send element to back
     */
    function sendToBack(element) {
        if (!element) return;

        const parent = element.parentElement;
        const siblings = parent.querySelectorAll('.design-element, .shape-element, .icon-element, .brochure-element');
        let minZ = Infinity;

        siblings.forEach(sibling => {
            const z = parseInt(sibling.style.zIndex) || 0;
            if (z < minZ) minZ = z;
        });

        element.style.zIndex = Math.max(0, minZ - 1);
        showToast('Sent to back');

        // Update layer panel if exists
        if (typeof LayerSystem !== 'undefined' && LayerSystem.render) {
            LayerSystem.render();
        }
    }

    /**
     * Lock element
     */
    function lockElement(element) {
        if (!element) return;
        element.dataset.locked = 'true';
        element.style.pointerEvents = 'none';
        element.classList.add('locked');
        showToast('Element locked');
    }

    /**
     * Unlock element
     */
    function unlockElement(element) {
        if (!element) return;
        element.dataset.locked = 'false';
        element.style.pointerEvents = '';
        element.classList.remove('locked');
        showToast('Element unlocked');
    }

    /**
     * Show toast
     */
    function showToast(message) {
        if (typeof window.showToast === 'function') {
            window.showToast(message);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export to global scope
    window.ContextMenu = {
        show: showMenu,
        close: closeMenu,
        bringToFront,
        sendToBack,
        lockElement,
        unlockElement
    };

})();
