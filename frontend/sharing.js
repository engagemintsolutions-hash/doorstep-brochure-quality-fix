/**
 * Sharing & Collaboration - Share designs, get feedback
 */

(function() {
    'use strict';

    const STORAGE_KEY = 'brochure_shared_designs';

    // Share settings
    const SHARE_OPTIONS = {
        view: { name: 'View Only', icon: 'eye', description: 'Recipients can only view' },
        comment: { name: 'Can Comment', icon: 'comment', description: 'Recipients can view and comment' },
        edit: { name: 'Can Edit', icon: 'edit', description: 'Recipients can make changes' }
    };

    let sharedDesigns = [];
    let comments = {};

    /**
     * Initialize sharing system
     */
    function init() {
        loadSharedDesigns();
        console.log('Sharing system initialized');
    }

    /**
     * Load shared designs from storage
     */
    function loadSharedDesigns() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                sharedDesigns = data.designs || [];
                comments = data.comments || {};
            }
        } catch (e) {
            console.error('Error loading shared designs:', e);
        }
    }

    /**
     * Save to storage
     */
    function saveSharedDesigns() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                designs: sharedDesigns,
                comments: comments
            }));
        } catch (e) {
            console.error('Error saving shared designs:', e);
        }
    }

    /**
     * Create share link for design
     */
    function createShareLink(designData, options = {}) {
        const {
            permission = 'view',
            expiresIn = null, // days
            password = null
        } = options;

        const shareId = generateShareId();
        const shareData = {
            id: shareId,
            designId: designData.id || `design_${Date.now()}`,
            name: designData.name || 'Untitled Design',
            thumbnail: designData.thumbnail || null,
            permission,
            password: password ? hashPassword(password) : null,
            expiresAt: expiresIn ? Date.now() + (expiresIn * 24 * 60 * 60 * 1000) : null,
            createdAt: Date.now(),
            createdBy: getCurrentUser(),
            views: 0,
            design: designData.content
        };

        sharedDesigns.push(shareData);
        saveSharedDesigns();

        // Generate shareable URL
        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = `${baseUrl}?share=${shareId}`;

        return {
            shareId,
            shareUrl,
            shareData
        };
    }

    /**
     * Get shared design by ID
     */
    function getSharedDesign(shareId) {
        const design = sharedDesigns.find(d => d.id === shareId);
        if (!design) return null;

        // Check expiration
        if (design.expiresAt && Date.now() > design.expiresAt) {
            return { error: 'Link has expired' };
        }

        // Increment views
        design.views++;
        saveSharedDesigns();

        return design;
    }

    /**
     * Delete shared link
     */
    function deleteShareLink(shareId) {
        const index = sharedDesigns.findIndex(d => d.id === shareId);
        if (index > -1) {
            sharedDesigns.splice(index, 1);
            saveSharedDesigns();
            return true;
        }
        return false;
    }

    /**
     * Add comment to design
     */
    function addComment(designId, commentData) {
        if (!comments[designId]) {
            comments[designId] = [];
        }

        const comment = {
            id: `comment_${Date.now()}`,
            author: commentData.author || 'Anonymous',
            text: commentData.text,
            position: commentData.position || null, // { x, y, elementId }
            createdAt: Date.now(),
            resolved: false,
            replies: []
        };

        comments[designId].push(comment);
        saveSharedDesigns();

        return comment;
    }

    /**
     * Get comments for design
     */
    function getComments(designId) {
        return comments[designId] || [];
    }

    /**
     * Reply to comment
     */
    function replyToComment(designId, commentId, replyData) {
        const designComments = comments[designId];
        if (!designComments) return null;

        const comment = designComments.find(c => c.id === commentId);
        if (!comment) return null;

        const reply = {
            id: `reply_${Date.now()}`,
            author: replyData.author || 'Anonymous',
            text: replyData.text,
            createdAt: Date.now()
        };

        comment.replies.push(reply);
        saveSharedDesigns();

        return reply;
    }

    /**
     * Resolve comment
     */
    function resolveComment(designId, commentId) {
        const designComments = comments[designId];
        if (!designComments) return false;

        const comment = designComments.find(c => c.id === commentId);
        if (comment) {
            comment.resolved = true;
            saveSharedDesigns();
            return true;
        }
        return false;
    }

    /**
     * Delete comment
     */
    function deleteComment(designId, commentId) {
        const designComments = comments[designId];
        if (!designComments) return false;

        const index = designComments.findIndex(c => c.id === commentId);
        if (index > -1) {
            designComments.splice(index, 1);
            saveSharedDesigns();
            return true;
        }
        return false;
    }

    /**
     * Render share modal
     */
    function renderShareModal(designData) {
        // Remove existing modal
        const existing = document.querySelector('.share-modal-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'share-modal-overlay';
        overlay.innerHTML = `
            <div class="share-modal">
                <div class="share-modal-header">
                    <h3>Share Design</h3>
                    <button class="share-modal-close">&times;</button>
                </div>

                <div class="share-modal-body">
                    <div class="share-section">
                        <h4>Share with Link</h4>
                        <div class="permission-options">
                            ${Object.entries(SHARE_OPTIONS).map(([id, opt]) => `
                                <label class="permission-option">
                                    <input type="radio" name="permission" value="${id}" ${id === 'view' ? 'checked' : ''}>
                                    <span class="permission-label">
                                        <strong>${opt.name}</strong>
                                        <small>${opt.description}</small>
                                    </span>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <div class="share-section">
                        <h4>Link Options</h4>
                        <label class="option-row">
                            <span>Expires after</span>
                            <select id="shareExpiry" class="form-select">
                                <option value="">Never</option>
                                <option value="1">1 day</option>
                                <option value="7">7 days</option>
                                <option value="30">30 days</option>
                            </select>
                        </label>
                        <label class="option-row">
                            <span>Password protect</span>
                            <input type="password" id="sharePassword" placeholder="Optional password" class="form-input">
                        </label>
                    </div>

                    <div class="share-section">
                        <div class="share-link-container">
                            <input type="text" id="shareLinkInput" readonly placeholder="Click 'Create Link' to generate">
                            <button class="btn btn-icon" id="copyLinkBtn" title="Copy link">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2"/>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                </svg>
                            </button>
                        </div>
                        <button class="btn btn-primary" id="createLinkBtn">Create Link</button>
                    </div>

                    <div class="share-section">
                        <h4>Quick Share</h4>
                        <div class="social-share-buttons">
                            <button class="social-btn email" data-platform="email">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                    <polyline points="22,6 12,13 2,6"/>
                                </svg>
                                Email
                            </button>
                            <button class="social-btn whatsapp" data-platform="whatsapp">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                WhatsApp
                            </button>
                            <button class="social-btn linkedin" data-platform="linkedin">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                LinkedIn
                            </button>
                        </div>
                    </div>
                </div>

                <div class="share-modal-footer">
                    <div class="share-history" id="shareHistory">
                        <h4>Active Links</h4>
                        <div class="share-list">
                            ${getActiveShareLinks(designData.id).map(share => `
                                <div class="share-item" data-share-id="${share.id}">
                                    <div class="share-info">
                                        <span class="share-permission">${SHARE_OPTIONS[share.permission]?.name}</span>
                                        <span class="share-views">${share.views} views</span>
                                    </div>
                                    <button class="btn btn-sm btn-danger share-delete">&times;</button>
                                </div>
                            `).join('') || '<p class="no-shares">No active share links</p>'}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        initShareModalEvents(overlay, designData);

        return overlay;
    }

    /**
     * Get active share links for design
     */
    function getActiveShareLinks(designId) {
        return sharedDesigns.filter(d =>
            d.designId === designId &&
            (!d.expiresAt || d.expiresAt > Date.now())
        );
    }

    /**
     * Initialize share modal events
     */
    function initShareModalEvents(modal, designData) {
        // Close button
        modal.querySelector('.share-modal-close')?.addEventListener('click', () => {
            modal.remove();
        });

        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Create link
        modal.querySelector('#createLinkBtn')?.addEventListener('click', () => {
            const permission = modal.querySelector('input[name="permission"]:checked')?.value || 'view';
            const expiresIn = modal.querySelector('#shareExpiry')?.value || null;
            const password = modal.querySelector('#sharePassword')?.value || null;

            const result = createShareLink(designData, {
                permission,
                expiresIn: expiresIn ? parseInt(expiresIn) : null,
                password
            });

            modal.querySelector('#shareLinkInput').value = result.shareUrl;
            showToast('Share link created!');

            // Refresh history
            refreshShareHistory(modal, designData.id);
        });

        // Copy link
        modal.querySelector('#copyLinkBtn')?.addEventListener('click', () => {
            const input = modal.querySelector('#shareLinkInput');
            if (input.value) {
                navigator.clipboard.writeText(input.value);
                showToast('Link copied to clipboard!');
            }
        });

        // Social share buttons
        modal.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const platform = btn.dataset.platform;
                const link = modal.querySelector('#shareLinkInput').value;

                if (!link) {
                    showToast('Create a share link first', 'warning');
                    return;
                }

                shareToSocial(platform, link, designData.name);
            });
        });

        // Delete share links
        modal.querySelectorAll('.share-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.target.closest('.share-item');
                if (item) {
                    deleteShareLink(item.dataset.shareId);
                    refreshShareHistory(modal, designData.id);
                    showToast('Share link deleted');
                }
            });
        });
    }

    /**
     * Refresh share history in modal
     */
    function refreshShareHistory(modal, designId) {
        const container = modal.querySelector('.share-list');
        const shares = getActiveShareLinks(designId);

        container.innerHTML = shares.length > 0
            ? shares.map(share => `
                <div class="share-item" data-share-id="${share.id}">
                    <div class="share-info">
                        <span class="share-permission">${SHARE_OPTIONS[share.permission]?.name}</span>
                        <span class="share-views">${share.views} views</span>
                    </div>
                    <button class="btn btn-sm btn-danger share-delete">&times;</button>
                </div>
            `).join('')
            : '<p class="no-shares">No active share links</p>';

        // Re-attach delete handlers
        container.querySelectorAll('.share-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const item = e.target.closest('.share-item');
                if (item) {
                    deleteShareLink(item.dataset.shareId);
                    refreshShareHistory(modal, designId);
                    showToast('Share link deleted');
                }
            });
        });
    }

    /**
     * Share to social platform
     */
    function shareToSocial(platform, link, title) {
        const encodedLink = encodeURIComponent(link);
        const encodedTitle = encodeURIComponent(title || 'Check out my design');

        let url;
        switch (platform) {
            case 'email':
                url = `mailto:?subject=${encodedTitle}&body=${encodedLink}`;
                break;
            case 'whatsapp':
                url = `https://wa.me/?text=${encodedTitle}%20${encodedLink}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`;
                break;
            default:
                return;
        }

        window.open(url, '_blank');
    }

    /**
     * Render comments panel
     */
    function renderCommentsPanel(container, designId) {
        const designComments = getComments(designId);

        let html = `
            <div class="comments-panel">
                <div class="comments-header">
                    <h3>Comments</h3>
                    <span class="comment-count">${designComments.length}</span>
                </div>

                <div class="comments-list">
                    ${designComments.length > 0 ? designComments.map(comment => `
                        <div class="comment-item ${comment.resolved ? 'resolved' : ''}" data-comment-id="${comment.id}">
                            <div class="comment-header">
                                <span class="comment-author">${comment.author}</span>
                                <span class="comment-time">${formatTime(comment.createdAt)}</span>
                            </div>
                            <div class="comment-text">${escapeHtml(comment.text)}</div>
                            ${comment.replies.length > 0 ? `
                                <div class="comment-replies">
                                    ${comment.replies.map(reply => `
                                        <div class="reply-item">
                                            <span class="reply-author">${reply.author}</span>
                                            <span class="reply-text">${escapeHtml(reply.text)}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                            <div class="comment-actions">
                                <button class="btn btn-sm reply-btn">Reply</button>
                                ${!comment.resolved ? '<button class="btn btn-sm resolve-btn">Resolve</button>' : ''}
                                <button class="btn btn-sm btn-danger delete-btn">Delete</button>
                            </div>
                        </div>
                    `).join('') : '<p class="no-comments">No comments yet</p>'}
                </div>

                <div class="add-comment">
                    <textarea id="newCommentText" placeholder="Add a comment..." rows="2"></textarea>
                    <button class="btn btn-primary" id="addCommentBtn">Add Comment</button>
                </div>
            </div>
        `;

        container.innerHTML = html;
        initCommentsEvents(container, designId);
    }

    /**
     * Initialize comments events
     */
    function initCommentsEvents(container, designId) {
        // Add comment
        container.querySelector('#addCommentBtn')?.addEventListener('click', () => {
            const textarea = container.querySelector('#newCommentText');
            const text = textarea.value.trim();
            if (text) {
                addComment(designId, { text, author: getCurrentUser() });
                textarea.value = '';
                renderCommentsPanel(container, designId);
            }
        });

        // Comment actions
        container.querySelectorAll('.comment-item').forEach(item => {
            const commentId = item.dataset.commentId;

            item.querySelector('.resolve-btn')?.addEventListener('click', () => {
                resolveComment(designId, commentId);
                renderCommentsPanel(container, designId);
            });

            item.querySelector('.delete-btn')?.addEventListener('click', () => {
                deleteComment(designId, commentId);
                renderCommentsPanel(container, designId);
            });

            item.querySelector('.reply-btn')?.addEventListener('click', () => {
                const reply = prompt('Enter your reply:');
                if (reply) {
                    replyToComment(designId, commentId, { text: reply, author: getCurrentUser() });
                    renderCommentsPanel(container, designId);
                }
            });
        });
    }

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================

    function generateShareId() {
        return 'share_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    function hashPassword(password) {
        // Simple hash for demo - use proper hashing in production
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }

    function getCurrentUser() {
        return localStorage.getItem('userName') || 'User';
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
        if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
        return date.toLocaleDateString();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function showToast(message, type = 'success') {
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        }
    }

    // Initialize
    init();

    // Export to global scope
    window.Sharing = {
        createShareLink,
        getSharedDesign,
        deleteShareLink,
        addComment,
        getComments,
        replyToComment,
        resolveComment,
        deleteComment,
        renderShareModal,
        renderCommentsPanel,
        SHARE_OPTIONS
    };

    console.log('Sharing system loaded');

})();
