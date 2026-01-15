/**
 * Version History System
 * Auto-save snapshots with IndexedDB storage
 */
const VersionHistory = (function() {
    'use strict';

    const DB_NAME = 'BrochureEditorVersions';
    const DB_VERSION = 1;
    const STORE_NAME = 'versions';
    const MAX_VERSIONS = 50;
    const AUTO_SAVE_INTERVAL = 5 * 60 * 1000; // 5 minutes

    // State
    let db = null;
    let autoSaveTimer = null;
    let currentProjectId = null;
    let panelElement = null;

    /**
     * Initialize IndexedDB
     */
    function initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error('Failed to open IndexedDB:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                db = request.result;
                resolve(db);
            };

            request.onupgradeneeded = (event) => {
                const database = event.target.result;

                if (!database.objectStoreNames.contains(STORE_NAME)) {
                    const store = database.createObjectStore(STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    store.createIndex('projectId', 'projectId', { unique: false });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    /**
     * Save a version snapshot
     */
    async function saveVersion(projectId, data, label = null) {
        if (!db) await initDB();

        const version = {
            projectId: projectId || currentProjectId || 'default',
            timestamp: Date.now(),
            label: label || null,
            data: JSON.stringify(data),
            thumbnail: await generateThumbnail()
        };

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.add(version);

            request.onsuccess = () => {
                // Cleanup old versions
                cleanupOldVersions(version.projectId);
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Get all versions for a project
     */
    async function getVersions(projectId) {
        if (!db) await initDB();

        const pid = projectId || currentProjectId || 'default';

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const index = store.index('projectId');
            const request = index.getAll(pid);

            request.onsuccess = () => {
                // Sort by timestamp descending
                const versions = request.result.sort((a, b) => b.timestamp - a.timestamp);
                resolve(versions);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Get a specific version
     */
    async function getVersion(versionId) {
        if (!db) await initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(versionId);

            request.onsuccess = () => {
                if (request.result) {
                    request.result.data = JSON.parse(request.result.data);
                }
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * Restore a version
     */
    async function restoreVersion(versionId, onRestore) {
        const version = await getVersion(versionId);

        if (!version) {
            throw new Error('Version not found');
        }

        // Save current state before restoring
        if (typeof EditorState !== 'undefined' && EditorState.sessionData) {
            await saveVersion(currentProjectId, EditorState.sessionData, 'Before restore');
        }

        if (onRestore) {
            onRestore(version.data);
        }

        return version;
    }

    /**
     * Delete a version
     */
    async function deleteVersion(versionId) {
        if (!db) await initDB();

        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(versionId);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Cleanup old versions (keep only MAX_VERSIONS)
     */
    async function cleanupOldVersions(projectId) {
        const versions = await getVersions(projectId);

        if (versions.length > MAX_VERSIONS) {
            const toDelete = versions.slice(MAX_VERSIONS);
            for (const version of toDelete) {
                await deleteVersion(version.id);
            }
        }
    }

    /**
     * Generate thumbnail of current canvas
     */
    async function generateThumbnail() {
        const canvas = document.querySelector('.brochure-canvas');
        if (!canvas) return null;

        try {
            // Use html2canvas if available
            if (typeof html2canvas !== 'undefined') {
                const canvasEl = await html2canvas(canvas, {
                    scale: 0.2,
                    useCORS: true,
                    logging: false
                });
                return canvasEl.toDataURL('image/jpeg', 0.5);
            }
        } catch (e) {
            console.warn('Failed to generate thumbnail:', e);
        }

        return null;
    }

    /**
     * Start auto-save
     */
    function startAutoSave(getData) {
        stopAutoSave();

        autoSaveTimer = setInterval(async () => {
            try {
                const data = getData();
                if (data) {
                    await saveVersion(currentProjectId, data, 'Auto-save');
                    console.log('Auto-saved version');
                }
            } catch (e) {
                console.error('Auto-save failed:', e);
            }
        }, AUTO_SAVE_INTERVAL);
    }

    /**
     * Stop auto-save
     */
    function stopAutoSave() {
        if (autoSaveTimer) {
            clearInterval(autoSaveTimer);
            autoSaveTimer = null;
        }
    }

    /**
     * Set current project ID
     */
    function setProject(projectId) {
        currentProjectId = projectId;
    }

    /**
     * Format timestamp for display
     */
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        // Less than 1 minute
        if (diff < 60000) {
            return 'Just now';
        }

        // Less than 1 hour
        if (diff < 3600000) {
            const mins = Math.floor(diff / 60000);
            return `${mins} min${mins > 1 ? 's' : ''} ago`;
        }

        // Less than 24 hours
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }

        // Same year
        if (date.getFullYear() === now.getFullYear()) {
            return date.toLocaleDateString('en-GB', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }

        // Different year
        return date.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Show version history panel
     */
    async function showPanel(onRestore) {
        if (panelElement) {
            panelElement.remove();
        }

        const versions = await getVersions();

        const panel = document.createElement('div');
        panel.className = 'version-history-panel';
        panel.innerHTML = `
            <div class="vh-header">
                <h3>Version History</h3>
                <button class="vh-close">&times;</button>
            </div>
            <div class="vh-actions">
                <button class="vh-save-now">
                    <span class="icon">💾</span>
                    Save Now
                </button>
            </div>
            <div class="vh-list">
                ${versions.length === 0 ? `
                    <div class="vh-empty">
                        <span class="icon">📁</span>
                        <p>No saved versions yet</p>
                        <p class="hint">Versions are auto-saved every 5 minutes</p>
                    </div>
                ` : versions.map(v => `
                    <div class="vh-item" data-id="${v.id}">
                        <div class="vh-thumb">
                            ${v.thumbnail ? `<img src="${v.thumbnail}" alt="">` : '<span>📄</span>'}
                        </div>
                        <div class="vh-info">
                            <span class="vh-time">${formatTime(v.timestamp)}</span>
                            <span class="vh-label">${v.label || 'Manual save'}</span>
                        </div>
                        <div class="vh-actions-item">
                            <button class="vh-restore" title="Restore this version">↩️</button>
                            <button class="vh-delete" title="Delete">&times;</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="vh-footer">
                <span>${versions.length} version${versions.length !== 1 ? 's' : ''} saved</span>
                <span class="vh-limit">Max ${MAX_VERSIONS}</span>
            </div>
        `;

        // Event handlers
        panel.querySelector('.vh-close').onclick = () => {
            panel.remove();
            panelElement = null;
        };

        panel.querySelector('.vh-save-now').onclick = async () => {
            if (typeof EditorState !== 'undefined' && EditorState.sessionData) {
                await saveVersion(currentProjectId, EditorState.sessionData, 'Manual save');
                // Refresh panel
                showPanel(onRestore);
            }
        };

        panel.querySelectorAll('.vh-restore').forEach(btn => {
            btn.onclick = async (e) => {
                e.stopPropagation();
                const item = btn.closest('.vh-item');
                const id = parseInt(item.dataset.id);

                if (confirm('Restore this version? Current changes will be saved first.')) {
                    await restoreVersion(id, onRestore);
                    panel.remove();
                    panelElement = null;
                }
            };
        });

        panel.querySelectorAll('.vh-delete').forEach(btn => {
            btn.onclick = async (e) => {
                e.stopPropagation();
                const item = btn.closest('.vh-item');
                const id = parseInt(item.dataset.id);

                if (confirm('Delete this version?')) {
                    await deleteVersion(id);
                    item.remove();

                    // Update count
                    const versions = await getVersions();
                    panel.querySelector('.vh-footer span').textContent =
                        `${versions.length} version${versions.length !== 1 ? 's' : ''} saved`;
                }
            };
        });

        document.body.appendChild(panel);
        panelElement = panel;

        return panel;
    }

    /**
     * Initialize styles
     */
    function initStyles() {
        if (document.getElementById('version-history-styles')) return;

        const style = document.createElement('style');
        style.id = 'version-history-styles';
        style.textContent = `
            .version-history-panel {
                position: fixed;
                right: 20px;
                top: 80px;
                width: 300px;
                background: #1a1a2e;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                z-index: 10005;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                max-height: 70vh;
            }

            .vh-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .vh-header h3 {
                margin: 0;
                color: #fff;
                font-size: 16px;
            }

            .vh-close {
                background: none;
                border: none;
                color: #888;
                font-size: 24px;
                cursor: pointer;
            }

            .vh-actions {
                padding: 10px 15px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            .vh-save-now {
                width: 100%;
                padding: 10px;
                background: rgba(108,92,231,0.1);
                border: 1px solid rgba(108,92,231,0.3);
                border-radius: 8px;
                color: #a78bfa;
                font-size: 13px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.2s;
            }

            .vh-save-now:hover {
                background: rgba(108,92,231,0.2);
            }

            .vh-list {
                flex: 1;
                overflow-y: auto;
                padding: 10px;
            }

            .vh-empty {
                text-align: center;
                padding: 30px 20px;
                color: #666;
            }

            .vh-empty .icon {
                font-size: 40px;
                display: block;
                margin-bottom: 10px;
            }

            .vh-empty p {
                margin: 5px 0;
            }

            .vh-empty .hint {
                font-size: 12px;
                color: #555;
            }

            .vh-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 10px;
                background: rgba(255,255,255,0.03);
                border-radius: 8px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .vh-item:hover {
                background: rgba(255,255,255,0.06);
            }

            .vh-thumb {
                width: 50px;
                height: 40px;
                background: rgba(255,255,255,0.05);
                border-radius: 4px;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            .vh-thumb img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .vh-thumb span {
                font-size: 20px;
                opacity: 0.5;
            }

            .vh-info {
                flex: 1;
                min-width: 0;
            }

            .vh-time {
                display: block;
                color: #fff;
                font-size: 13px;
                font-weight: 500;
            }

            .vh-label {
                display: block;
                color: #666;
                font-size: 11px;
                margin-top: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .vh-actions-item {
                display: flex;
                gap: 4px;
                opacity: 0;
                transition: opacity 0.2s;
            }

            .vh-item:hover .vh-actions-item {
                opacity: 1;
            }

            .vh-actions-item button {
                width: 28px;
                height: 28px;
                background: rgba(255,255,255,0.05);
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s;
            }

            .vh-actions-item .vh-restore:hover {
                background: rgba(108,92,231,0.3);
            }

            .vh-actions-item .vh-delete:hover {
                background: rgba(220,53,69,0.3);
                color: #ff6b6b;
            }

            .vh-footer {
                padding: 10px 15px;
                border-top: 1px solid rgba(255,255,255,0.1);
                display: flex;
                justify-content: space-between;
                font-size: 11px;
                color: #666;
            }

            /* Scrollbar */
            .vh-list::-webkit-scrollbar {
                width: 6px;
            }

            .vh-list::-webkit-scrollbar-track {
                background: transparent;
            }

            .vh-list::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.2);
                border-radius: 3px;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Initialize
     */
    async function init() {
        initStyles();
        await initDB();
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
        saveVersion,
        save: saveVersion,  // Alias for compatibility
        getVersions,
        getVersion,
        restoreVersion,
        deleteVersion,
        setProject,
        startAutoSave,
        stopAutoSave,
        showPanel,
        MAX_VERSIONS,
        isLoaded: true
    };
})();

// Global export
window.VersionHistory = VersionHistory;
