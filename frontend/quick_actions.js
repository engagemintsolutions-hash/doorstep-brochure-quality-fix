/**
 * Quick Actions Toolbar
 * Floating toolbar for quick access to key features
 */
const QuickActions = (function() {
    'use strict';

    // Quick action definitions
    const ACTIONS = [
        {
            id: 'ai-content',
            icon: '✨',
            label: 'AI Content',
            tooltip: 'Generate text with AI',
            action: () => {
                if (typeof AIContent !== 'undefined') {
                    AIContent.showModal((text, type) => {
                        // Insert text element
                        if (typeof ElementsLibrary !== 'undefined') {
                            ElementsLibrary.addElementToCanvas('text', { content: text });
                        }
                    });
                }
            }
        },
        {
            id: 'brand-kit',
            icon: '🎨',
            label: 'Brand Kit',
            tooltip: 'Manage brand colors & fonts',
            action: () => {
                if (typeof BrandKitV2 !== 'undefined') {
                    BrandKitV2.showPanel();
                }
            }
        },
        {
            id: 'magic-resize',
            icon: '📐',
            label: 'Resize',
            tooltip: 'Convert to different format',
            action: () => {
                if (typeof MagicResize !== 'undefined') {
                    MagicResize.showModal('a4_portrait', (result) => {
                        console.log('Resize to:', result);
                    });
                }
            }
        },
        {
            id: 'bg-remove',
            icon: '🪄',
            label: 'Remove BG',
            tooltip: 'Remove image background',
            action: () => {
                // Find selected image
                const selected = document.querySelector('.canvas-element.selected');
                if (selected && selected.querySelector('img')) {
                    if (typeof BackgroundRemoval !== 'undefined') {
                        BackgroundRemoval.showModal(selected, (newSrc) => {
                            const img = selected.querySelector('img');
                            if (img) img.src = newSrc;
                        });
                    }
                } else {
                    alert('Please select an image first');
                }
            }
        },
        {
            id: 'photo-effects',
            icon: '🎭',
            label: 'Effects',
            tooltip: 'Apply photo filters',
            action: () => {
                const selected = document.querySelector('.canvas-element.selected');
                if (selected && selected.querySelector('img')) {
                    if (typeof PhotoEffects !== 'undefined') {
                        const rect = selected.getBoundingClientRect();
                        PhotoEffects.show(selected, { x: rect.right + 10, y: rect.top });
                    }
                } else {
                    alert('Please select an image first');
                }
            }
        },
        {
            id: 'animations',
            icon: '🎬',
            label: 'Animate',
            tooltip: 'Add animations',
            action: () => {
                const selected = document.querySelector('.canvas-element.selected');
                if (selected) {
                    if (typeof Animations !== 'undefined') {
                        Animations.showPanel(selected);
                    }
                } else {
                    alert('Please select an element first');
                }
            }
        },
        {
            id: 'history',
            icon: '🕐',
            label: 'History',
            tooltip: 'Version history',
            action: () => {
                if (typeof VersionHistory !== 'undefined') {
                    VersionHistory.showPanel((data) => {
                        if (typeof EditorState !== 'undefined') {
                            EditorState.sessionData = data;
                            // Trigger re-render
                        }
                    });
                }
            }
        },
        {
            id: 'export',
            icon: '💾',
            label: 'Export',
            tooltip: 'Export brochure',
            action: () => {
                if (typeof ExportModal !== 'undefined') {
                    ExportModal.show();
                }
            }
        },
        {
            id: 'shortcuts',
            icon: '⌨️',
            label: 'Shortcuts',
            tooltip: 'Keyboard shortcuts',
            action: () => {
                if (typeof KeyboardShortcuts !== 'undefined') {
                    KeyboardShortcuts.showHelp();
                }
            }
        }
    ];

    // State
    let toolbarElement = null;
    let isExpanded = true;
    let position = { x: null, y: null };  // Will be set dynamically to bottom-right

    /**
     * Create the toolbar
     */
    function createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'quick-actions-toolbar';
        toolbar.innerHTML = `
            <div class="qa-header">
                <button class="qa-toggle" title="Toggle toolbar">
                    <span class="qa-toggle-icon">${isExpanded ? '◀' : '▶'}</span>
                </button>
                <span class="qa-title">Quick Actions</span>
            </div>
            <div class="qa-actions ${isExpanded ? '' : 'collapsed'}">
                ${ACTIONS.map(action => `
                    <button class="qa-btn" data-action="${action.id}" title="${action.tooltip}">
                        <span class="qa-icon">${action.icon}</span>
                        <span class="qa-label">${action.label}</span>
                    </button>
                `).join('')}
            </div>
        `;

        // Toggle expand/collapse
        toolbar.querySelector('.qa-toggle').onclick = () => {
            isExpanded = !isExpanded;
            toolbar.querySelector('.qa-actions').classList.toggle('collapsed', !isExpanded);
            toolbar.querySelector('.qa-toggle-icon').textContent = isExpanded ? '◀' : '▶';
            savePosition();
        };

        // Action buttons
        toolbar.querySelectorAll('.qa-btn').forEach(btn => {
            btn.onclick = () => {
                const action = ACTIONS.find(a => a.id === btn.dataset.action);
                if (action && action.action) {
                    action.action();
                }
            };
        });

        // Make draggable
        let isDragging = false;
        let startX, startY;

        toolbar.querySelector('.qa-header').onmousedown = (e) => {
            if (e.target.closest('.qa-toggle')) return;
            isDragging = true;
            startX = e.clientX - position.x;
            startY = e.clientY - position.y;
            toolbar.style.cursor = 'grabbing';
        };

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            position.x = e.clientX - startX;
            position.y = e.clientY - startY;

            // Keep within viewport
            position.x = Math.max(0, Math.min(position.x, window.innerWidth - toolbar.offsetWidth));
            position.y = Math.max(0, Math.min(position.y, window.innerHeight - toolbar.offsetHeight));

            toolbar.style.left = `${position.x}px`;
            toolbar.style.top = `${position.y}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                toolbar.style.cursor = '';
                savePosition();
            }
        });

        // Position
        toolbar.style.left = `${position.x}px`;
        toolbar.style.top = `${position.y}px`;

        return toolbar;
    }

    /**
     * Load saved position
     */
    function loadPosition() {
        try {
            const saved = localStorage.getItem('quick_actions_position');
            if (saved) {
                const data = JSON.parse(saved);
                position = data.position || position;
                isExpanded = data.isExpanded !== false;
            }
        } catch (e) {
            console.warn('Failed to load quick actions position');
        }

        // Default position: bottom-right corner (avoiding sidebar overlap)
        if (position.x === null || position.y === null) {
            position.x = window.innerWidth - 200;  // Right side
            position.y = window.innerHeight - 450; // Above bottom
        }
    }

    /**
     * Save position
     */
    function savePosition() {
        try {
            localStorage.setItem('quick_actions_position', JSON.stringify({
                position,
                isExpanded
            }));
        } catch (e) {
            console.warn('Failed to save quick actions position');
        }
    }

    /**
     * Show toolbar
     */
    function show() {
        if (toolbarElement) return;

        loadPosition();
        toolbarElement = createToolbar();
        document.body.appendChild(toolbarElement);
    }

    /**
     * Hide toolbar
     */
    function hide() {
        if (toolbarElement) {
            toolbarElement.remove();
            toolbarElement = null;
        }
    }

    /**
     * Toggle toolbar
     */
    function toggle() {
        if (toolbarElement) {
            hide();
        } else {
            show();
        }
    }

    /**
     * Initialize styles
     */
    function init() {
        if (document.getElementById('quick-actions-styles')) return;

        const style = document.createElement('style');
        style.id = 'quick-actions-styles';
        style.textContent = `
            .quick-actions-toolbar {
                position: fixed;
                z-index: 9999;
                background: #1a1a2e;
                border-radius: 12px;
                box-shadow: 0 5px 30px rgba(0,0,0,0.4);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                user-select: none;
            }

            .qa-header {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 12px;
                background: rgba(255,255,255,0.03);
                border-radius: 12px 12px 0 0;
                cursor: grab;
            }

            .qa-toggle {
                width: 24px;
                height: 24px;
                background: rgba(255,255,255,0.1);
                border: none;
                border-radius: 6px;
                color: #888;
                font-size: 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }

            .qa-toggle:hover {
                background: rgba(255,255,255,0.15);
                color: #fff;
            }

            .qa-title {
                font-size: 12px;
                font-weight: 600;
                color: #888;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .qa-actions {
                padding: 8px;
                display: flex;
                flex-direction: column;
                gap: 4px;
                max-height: 400px;
                overflow-y: auto;
                transition: all 0.3s ease;
            }

            .qa-actions.collapsed {
                max-height: 0;
                padding: 0;
                overflow: hidden;
            }

            .qa-btn {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 12px;
                background: transparent;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
                text-align: left;
            }

            .qa-btn:hover {
                background: rgba(108,92,231,0.15);
            }

            .qa-icon {
                font-size: 18px;
                width: 24px;
                text-align: center;
            }

            .qa-label {
                font-size: 13px;
                color: #ccc;
                white-space: nowrap;
            }

            .qa-btn:hover .qa-label {
                color: #fff;
            }

            /* Scrollbar */
            .qa-actions::-webkit-scrollbar {
                width: 4px;
            }

            .qa-actions::-webkit-scrollbar-track {
                background: transparent;
            }

            .qa-actions::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.2);
                border-radius: 2px;
            }
        `;
        document.head.appendChild(style);

        // Auto-show toolbar
        show();
    }

    // Auto-init when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    return {
        init,
        show,
        hide,
        toggle,
        ACTIONS,
        isLoaded: true
    };
})();

// Global export
window.QuickActions = QuickActions;
