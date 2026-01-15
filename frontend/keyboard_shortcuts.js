/**
 * Keyboard Shortcuts System
 * Comprehensive keyboard shortcut support with help panel
 */
const KeyboardShortcuts = (function() {
    'use strict';

    // All available shortcuts
    const SHORTCUTS = {
        // General
        general: {
            label: 'General',
            shortcuts: {
                'Ctrl+S': { action: 'save', description: 'Save project' },
                'Ctrl+Z': { action: 'undo', description: 'Undo' },
                'Ctrl+Y': { action: 'redo', description: 'Redo' },
                'Ctrl+Shift+Z': { action: 'redo', description: 'Redo (alternate)' },
                'Escape': { action: 'deselect', description: 'Deselect / Close modal' },
                '?': { action: 'showHelp', description: 'Show keyboard shortcuts' },
                'F11': { action: 'fullscreen', description: 'Toggle fullscreen' }
            }
        },

        // Element manipulation
        elements: {
            label: 'Elements',
            shortcuts: {
                'Delete': { action: 'delete', description: 'Delete selected' },
                'Backspace': { action: 'delete', description: 'Delete selected' },
                'Ctrl+C': { action: 'copy', description: 'Copy selected' },
                'Ctrl+X': { action: 'cut', description: 'Cut selected' },
                'Ctrl+V': { action: 'paste', description: 'Paste' },
                'Ctrl+D': { action: 'duplicate', description: 'Duplicate selected' },
                'Ctrl+A': { action: 'selectAll', description: 'Select all on page' }
            }
        },

        // Movement
        movement: {
            label: 'Movement',
            shortcuts: {
                'ArrowUp': { action: 'nudgeUp', description: 'Move up 1px' },
                'ArrowDown': { action: 'nudgeDown', description: 'Move down 1px' },
                'ArrowLeft': { action: 'nudgeLeft', description: 'Move left 1px' },
                'ArrowRight': { action: 'nudgeRight', description: 'Move right 1px' },
                'Shift+ArrowUp': { action: 'nudgeUp10', description: 'Move up 10px' },
                'Shift+ArrowDown': { action: 'nudgeDown10', description: 'Move down 10px' },
                'Shift+ArrowLeft': { action: 'nudgeLeft10', description: 'Move left 10px' },
                'Shift+ArrowRight': { action: 'nudgeRight10', description: 'Move right 10px' }
            }
        },

        // Layers
        layers: {
            label: 'Layers',
            shortcuts: {
                'Ctrl+]': { action: 'bringForward', description: 'Bring forward' },
                'Ctrl+[': { action: 'sendBackward', description: 'Send backward' },
                'Ctrl+Shift+]': { action: 'bringToFront', description: 'Bring to front' },
                'Ctrl+Shift+[': { action: 'sendToBack', description: 'Send to back' }
            }
        },

        // Grouping
        grouping: {
            label: 'Grouping',
            shortcuts: {
                'Ctrl+G': { action: 'group', description: 'Group selected' },
                'Ctrl+Shift+G': { action: 'ungroup', description: 'Ungroup' },
                'Ctrl+L': { action: 'lock', description: 'Lock/Unlock element' }
            }
        },

        // View
        view: {
            label: 'View',
            shortcuts: {
                'Ctrl+0': { action: 'zoomFit', description: 'Fit to screen' },
                'Ctrl+=': { action: 'zoomIn', description: 'Zoom in' },
                'Ctrl+-': { action: 'zoomOut', description: 'Zoom out' },
                'Ctrl+1': { action: 'zoom100', description: 'Zoom to 100%' },
                'Space': { action: 'pan', description: 'Pan canvas (hold)' }
            }
        },

        // Text
        text: {
            label: 'Text (when editing)',
            shortcuts: {
                'Ctrl+B': { action: 'bold', description: 'Bold' },
                'Ctrl+I': { action: 'italic', description: 'Italic' },
                'Ctrl+U': { action: 'underline', description: 'Underline' },
                'Ctrl+Shift+L': { action: 'alignLeft', description: 'Align left' },
                'Ctrl+Shift+E': { action: 'alignCenter', description: 'Align center' },
                'Ctrl+Shift+R': { action: 'alignRight', description: 'Align right' }
            }
        },

        // Export
        export: {
            label: 'Export',
            shortcuts: {
                'Ctrl+E': { action: 'export', description: 'Open export modal' },
                'Ctrl+P': { action: 'print', description: 'Print / Save as PDF' },
                'Ctrl+Shift+E': { action: 'quickExport', description: 'Quick export (last settings)' }
            }
        }
    };

    // State
    let isHelpVisible = false;
    let helpModal = null;
    let handlers = {};
    let enabled = true;

    /**
     * Parse key combination from event
     */
    function parseKeyEvent(e) {
        const parts = [];

        if (e.ctrlKey || e.metaKey) parts.push('Ctrl');
        if (e.shiftKey) parts.push('Shift');
        if (e.altKey) parts.push('Alt');

        // Get key name
        let key = e.key;

        // Normalize key names
        if (key === ' ') key = 'Space';
        else if (key === 'Delete') key = 'Delete';
        else if (key === 'Backspace') key = 'Backspace';
        else if (key === 'Escape') key = 'Escape';
        else if (key.startsWith('Arrow')) key = key;
        else if (key === '?') key = '?';
        else if (key === '=' || key === '+') key = '=';
        else if (key === '-' || key === '_') key = '-';
        else if (key === '[') key = '[';
        else if (key === ']') key = ']';
        else if (/^F\d+$/.test(key)) key = key; // Function keys
        else if (key.length === 1) key = key.toUpperCase();

        parts.push(key);

        return parts.join('+');
    }

    /**
     * Find shortcut action for key combination
     */
    function findShortcut(keyCombination) {
        for (const category of Object.values(SHORTCUTS)) {
            for (const [combo, shortcut] of Object.entries(category.shortcuts)) {
                if (combo === keyCombination) {
                    return shortcut;
                }
            }
        }
        return null;
    }

    /**
     * Handle keydown event
     */
    function handleKeydown(e) {
        if (!enabled) return;

        // Don't intercept when typing in inputs
        const target = e.target;
        const isTyping = target.tagName === 'INPUT' ||
                        target.tagName === 'TEXTAREA' ||
                        target.isContentEditable;

        // Allow ? even when typing
        if (e.key === '?' && !e.ctrlKey && !e.altKey) {
            if (!isTyping || e.shiftKey) {
                e.preventDefault();
                toggleHelp();
                return;
            }
        }

        // Escape closes help modal
        if (e.key === 'Escape') {
            if (isHelpVisible) {
                e.preventDefault();
                hideHelp();
                return;
            }
        }

        // Skip other shortcuts when typing (unless Ctrl/Cmd is held)
        if (isTyping && !e.ctrlKey && !e.metaKey) {
            return;
        }

        const keyCombination = parseKeyEvent(e);
        const shortcut = findShortcut(keyCombination);

        if (shortcut) {
            // Check if we have a handler for this action
            const handler = handlers[shortcut.action];

            if (handler) {
                e.preventDefault();
                handler(e);
            }
        }
    }

    /**
     * Register action handler
     */
    function registerHandler(action, callback) {
        handlers[action] = callback;
    }

    /**
     * Register multiple handlers
     */
    function registerHandlers(handlerMap) {
        Object.assign(handlers, handlerMap);
    }

    /**
     * Create help modal
     */
    function createHelpModal() {
        const modal = document.createElement('div');
        modal.className = 'keyboard-shortcuts-modal';
        modal.innerHTML = `
            <div class="shortcuts-content">
                <div class="shortcuts-header">
                    <h2>Keyboard Shortcuts</h2>
                    <button class="shortcuts-close">&times;</button>
                </div>
                <div class="shortcuts-body">
                    ${Object.entries(SHORTCUTS).map(([_, category]) => `
                        <div class="shortcuts-category">
                            <h3>${category.label}</h3>
                            <div class="shortcuts-list">
                                ${Object.entries(category.shortcuts).map(([combo, shortcut]) => `
                                    <div class="shortcut-item">
                                        <span class="shortcut-keys">${formatKeyCombo(combo)}</span>
                                        <span class="shortcut-desc">${shortcut.description}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="shortcuts-footer">
                    <p>Press <kbd>?</kbd> to toggle this panel</p>
                </div>
            </div>
        `;

        // Close handlers
        modal.querySelector('.shortcuts-close').onclick = hideHelp;
        modal.onclick = (e) => {
            if (e.target === modal) hideHelp();
        };

        return modal;
    }

    /**
     * Format key combination for display
     */
    function formatKeyCombo(combo) {
        return combo.split('+').map(key => {
            // Use symbols for common modifiers
            if (key === 'Ctrl') return '<kbd>Ctrl</kbd>';
            if (key === 'Shift') return '<kbd>Shift</kbd>';
            if (key === 'Alt') return '<kbd>Alt</kbd>';
            if (key === 'Space') return '<kbd>Space</kbd>';
            if (key === 'Escape') return '<kbd>Esc</kbd>';
            if (key === 'Delete') return '<kbd>Del</kbd>';
            if (key === 'Backspace') return '<kbd>Backspace</kbd>';
            if (key.startsWith('Arrow')) return `<kbd>${key.replace('Arrow', '')}</kbd>`;
            return `<kbd>${key}</kbd>`;
        }).join(' + ');
    }

    /**
     * Show help modal
     */
    function showHelp() {
        if (isHelpVisible) return;

        helpModal = createHelpModal();
        document.body.appendChild(helpModal);
        isHelpVisible = true;

        // Animate in
        requestAnimationFrame(() => {
            helpModal.classList.add('visible');
        });
    }

    /**
     * Hide help modal
     */
    function hideHelp() {
        if (!isHelpVisible || !helpModal) return;

        helpModal.classList.remove('visible');

        setTimeout(() => {
            if (helpModal) {
                helpModal.remove();
                helpModal = null;
            }
            isHelpVisible = false;
        }, 200);
    }

    /**
     * Toggle help modal
     */
    function toggleHelp() {
        if (isHelpVisible) {
            hideHelp();
        } else {
            showHelp();
        }
    }

    /**
     * Enable/disable shortcuts
     */
    function setEnabled(value) {
        enabled = value;
    }

    /**
     * Initialize
     */
    function init() {
        // Add event listener
        document.addEventListener('keydown', handleKeydown);

        // Register default showHelp handler
        registerHandler('showHelp', toggleHelp);

        // Add styles
        if (!document.getElementById('keyboard-shortcuts-styles')) {
            const style = document.createElement('style');
            style.id = 'keyboard-shortcuts-styles';
            style.textContent = `
                .keyboard-shortcuts-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10010;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                    backdrop-filter: blur(4px);
                }

                .keyboard-shortcuts-modal.visible {
                    opacity: 1;
                }

                .shortcuts-content {
                    background: #1a1a2e;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 800px;
                    max-height: 85vh;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    transform: scale(0.95);
                    transition: transform 0.2s ease;
                }

                .keyboard-shortcuts-modal.visible .shortcuts-content {
                    transform: scale(1);
                }

                .shortcuts-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 24px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .shortcuts-header h2 {
                    margin: 0;
                    color: #fff;
                    font-size: 20px;
                    font-weight: 600;
                }

                .shortcuts-close {
                    background: none;
                    border: none;
                    color: #888;
                    font-size: 28px;
                    cursor: pointer;
                    padding: 0;
                    line-height: 1;
                }

                .shortcuts-close:hover {
                    color: #fff;
                }

                .shortcuts-body {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px 24px;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 24px;
                }

                .shortcuts-category h3 {
                    margin: 0 0 12px 0;
                    color: #6c5ce7;
                    font-size: 14px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .shortcuts-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .shortcut-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 12px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 8px;
                }

                .shortcut-keys {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .shortcut-keys kbd {
                    display: inline-block;
                    padding: 4px 8px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', monospace;
                    font-size: 12px;
                    color: #fff;
                    min-width: 24px;
                    text-align: center;
                }

                .shortcut-desc {
                    color: #aaa;
                    font-size: 13px;
                }

                .shortcuts-footer {
                    padding: 16px 24px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    text-align: center;
                }

                .shortcuts-footer p {
                    margin: 0;
                    color: #666;
                    font-size: 13px;
                }

                .shortcuts-footer kbd {
                    display: inline-block;
                    padding: 2px 8px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                    font-family: monospace;
                    font-size: 12px;
                    color: #fff;
                }

                /* Scrollbar */
                .shortcuts-body::-webkit-scrollbar {
                    width: 8px;
                }

                .shortcuts-body::-webkit-scrollbar-track {
                    background: transparent;
                }

                .shortcuts-body::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                }

                /* Mobile */
                @media (max-width: 600px) {
                    .shortcuts-body {
                        grid-template-columns: 1fr;
                    }

                    .shortcut-item {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 6px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
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
        registerHandler,
        registerHandlers,
        showHelp,
        hideHelp,
        toggleHelp,
        setEnabled,
        SHORTCUTS,
        isHelpVisible: () => isHelpVisible,
        isLoaded: true
    };
})();

// Global export
window.KeyboardShortcuts = KeyboardShortcuts;
