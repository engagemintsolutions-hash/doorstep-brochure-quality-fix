/**
 * Button Handlers
 * Missing onclick handlers for the brochure editor
 */

(function() {
    'use strict';

    console.log('📍 Loading button handlers...');

    // ========================================================================
    // QR CODE
    // ========================================================================

    window.addQRCodeQuick = function() {
        console.log('Adding QR Code...');
        if (typeof ElementsLibrary !== 'undefined' && ElementsLibrary.addQRCodeToCurrentPage) {
            ElementsLibrary.addQRCodeToCurrentPage();
        } else {
            alert('QR Code feature not available');
        }
    };

    // ========================================================================
    // FONT PICKER
    // ========================================================================

    window.openAdvancedFontPicker = function() {
        console.log('Opening advanced font picker...');
        if (typeof FontLoader !== 'undefined' && FontLoader.showPicker) {
            FontLoader.showPicker();
        } else {
            alert('Advanced font picker not available');
        }
    };

    // ========================================================================
    // AI CONTENT
    // ========================================================================

    window.openAIContent = function() {
        console.log('Opening AI Content...');
        if (typeof AIContent !== 'undefined' && AIContent.showModal) {
            AIContent.showModal((text, type) => {
                console.log('AI generated:', type, text);
                if (typeof ElementsLibrary !== 'undefined') {
                    ElementsLibrary.addElementToCanvas('text', { content: text });
                }
            });
        } else {
            alert('AI Content feature not available. Check your API connection.');
        }
    };

    // ========================================================================
    // ANIMATIONS
    // ========================================================================

    window.openAnimations = function() {
        console.log('Opening Animations...');
        const selected = document.querySelector('.canvas-element.selected, .brochure-element.selected');
        if (!selected) {
            alert('Please select an element first');
            return;
        }
        if (typeof Animations !== 'undefined' && Animations.showPanel) {
            Animations.showPanel(selected);
        } else {
            alert('Animations feature not available');
        }
    };

    // ========================================================================
    // BACKGROUND REMOVAL
    // ========================================================================

    window.openBackgroundRemoval = function() {
        console.log('Opening Background Removal...');
        const selected = document.querySelector('.canvas-element.selected img, .brochure-element.selected img');
        if (!selected) {
            alert('Please select an image first');
            return;
        }
        if (typeof BackgroundRemoval !== 'undefined' && BackgroundRemoval.showModal) {
            BackgroundRemoval.showModal(selected.parentElement, (newSrc) => {
                selected.src = newSrc;
            });
        } else {
            alert('Background removal requires an API key. Feature not configured.');
        }
    };

    // ========================================================================
    // BACKGROUNDS
    // ========================================================================

    window.openBackgrounds = function() {
        console.log('Opening Page Backgrounds...');
        // Show backgrounds panel or modal
        const panel = document.getElementById('backgroundsPanel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        } else {
            alert('Backgrounds panel not found');
        }
    };

    // ========================================================================
    // BRAND KIT
    // ========================================================================

    window.openBrandKit = function() {
        console.log('Opening Brand Kit...');
        if (typeof BrandKitV2 !== 'undefined' && BrandKitV2.showPanel) {
            BrandKitV2.showPanel((kit) => {
                console.log('Brand kit applied:', kit);
            });
        } else {
            alert('Brand Kit not available');
        }
    };

    // ========================================================================
    // CURVED TEXT
    // ========================================================================

    window.openCurvedTextPanel = function() {
        console.log('Opening Curved Text...');
        if (typeof CurvedText !== 'undefined' && CurvedText.showPanel) {
            CurvedText.showPanel();
        } else {
            alert('Curved text feature not available');
        }
    };

    // ========================================================================
    // EXPORT OPTIONS
    // ========================================================================

    window.openExportOptions = function() {
        console.log('Opening Export Options...');
        if (typeof ExportModal !== 'undefined' && ExportModal.show) {
            ExportModal.show();
        } else {
            // Fallback - show basic export dialog
            const format = prompt('Export format (pdf, png, jpg):', 'pdf');
            if (format) {
                alert(`Exporting as ${format.toUpperCase()}... (feature needs backend)`);
            }
        }
    };

    // ========================================================================
    // EYEDROPPER
    // ========================================================================

    window.openEyedropper = function() {
        console.log('Opening Eyedropper...');
        if (typeof EyeDropper !== 'undefined') {
            const eyeDropper = new EyeDropper();
            eyeDropper.open().then(result => {
                console.log('Picked color:', result.sRGBHex);
                // Copy to clipboard
                navigator.clipboard.writeText(result.sRGBHex);
                alert(`Color picked: ${result.sRGBHex}\nCopied to clipboard!`);
            }).catch(e => {
                console.log('Eyedropper cancelled');
            });
        } else {
            alert('Eyedropper not supported in this browser');
        }
    };

    // ========================================================================
    // IMAGE CROP
    // ========================================================================

    window.openImageCrop = function() {
        console.log('Opening Image Crop...');
        const selected = document.querySelector('.canvas-element.selected img, .brochure-element.selected img');
        if (!selected) {
            alert('Please select an image first');
            return;
        }
        if (typeof ImageEditor !== 'undefined' && ImageEditor.openCrop) {
            ImageEditor.openCrop(selected);
        } else {
            alert('Image crop feature not available');
        }
    };

    // ========================================================================
    // KEYBOARD SHORTCUTS
    // ========================================================================

    window.openKeyboardShortcuts = function() {
        console.log('Opening Keyboard Shortcuts...');
        if (typeof KeyboardShortcuts !== 'undefined' && KeyboardShortcuts.showHelp) {
            KeyboardShortcuts.showHelp();
        } else {
            // Show basic shortcuts modal
            const shortcuts = `
KEYBOARD SHORTCUTS

Navigation:
  Ctrl + Z = Undo
  Ctrl + Y = Redo
  Delete = Delete selected
  Ctrl + C = Copy
  Ctrl + V = Paste
  Ctrl + D = Duplicate

Text:
  Ctrl + B = Bold
  Ctrl + I = Italic
  Ctrl + U = Underline

View:
  Ctrl + + = Zoom in
  Ctrl + - = Zoom out
  Ctrl + 0 = Reset zoom

Elements:
  Arrow keys = Move element
  Shift + Arrow = Move 10px
  Ctrl + L = Lock/Unlock
            `;
            alert(shortcuts);
        }
    };

    // ========================================================================
    // MAGIC RESIZE
    // ========================================================================

    window.openMagicResize = function() {
        console.log('Opening Magic Resize...');
        if (typeof MagicResize !== 'undefined' && MagicResize.showModal) {
            MagicResize.showModal('a4_portrait', (result) => {
                console.log('Resize result:', result);
            });
        } else {
            alert('Magic Resize feature not available');
        }
    };

    // ========================================================================
    // PHOTO EFFECTS
    // ========================================================================

    window.openPhotoEffects = function() {
        console.log('Opening Photo Effects...');
        const selected = document.querySelector('.canvas-element.selected, .brochure-element.selected');
        if (!selected) {
            alert('Please select an image first');
            return;
        }
        if (typeof PhotoEffects !== 'undefined' && PhotoEffects.show) {
            PhotoEffects.show(selected);
        } else {
            alert('Photo effects feature not available');
        }
    };

    // ========================================================================
    // PHOTO FRAMES
    // ========================================================================

    window.openPhotoFrames = function() {
        console.log('Opening Photo Frames...');
        if (typeof PhotoFrames !== 'undefined' && PhotoFrames.showPanel) {
            PhotoFrames.showPanel();
        } else {
            alert('Photo frames feature not available');
        }
    };

    // ========================================================================
    // PROPERTY BADGES
    // ========================================================================

    window.openPropertyBadges = function() {
        console.log('Opening Property Badges...');
        if (typeof PropertyBadges !== 'undefined' && PropertyBadges.showPanel) {
            PropertyBadges.showPanel();
        } else {
            // Add badge directly using Pro Blocks if available
            if (typeof ElementsLibrary !== 'undefined') {
                const badges = ['SOLD', 'UNDER OFFER', 'NEW LISTING', 'PRICE REDUCED'];
                const badge = prompt(`Select badge:\n1. ${badges[0]}\n2. ${badges[1]}\n3. ${badges[2]}\n4. ${badges[3]}`, '1');
                if (badge && badges[parseInt(badge) - 1]) {
                    ElementsLibrary.addProBlockToCurrentPage('badge-' + badges[parseInt(badge) - 1].toLowerCase().replace(' ', '-'));
                }
            }
        }
    };

    // ========================================================================
    // PROPERTY CHARTS
    // ========================================================================

    window.openPropertyCharts = function() {
        console.log('Opening Property Charts...');
        if (typeof PropertyCharts !== 'undefined' && PropertyCharts.showPanel) {
            PropertyCharts.showPanel();
        } else {
            alert('Property charts feature not available');
        }
    };

    // ========================================================================
    // PROPERTY GRAPHICS
    // ========================================================================

    window.openPropertyGraphics = function() {
        console.log('Opening Property Graphics...');
        // Switch to Elements panel and show property-related items
        const elementsTab = document.querySelector('[data-panel="elements"]');
        if (elementsTab) {
            elementsTab.click();
            setTimeout(() => {
                const iconsTab = document.querySelector('[data-tab="icons"]');
                if (iconsTab) iconsTab.click();
            }, 100);
        }
    };

    // ========================================================================
    // SHARE MODAL
    // ========================================================================

    window.openShareModal = function() {
        console.log('Opening Share Modal...');
        const modal = document.getElementById('shareModal');
        if (modal) {
            modal.classList.add('visible');
        } else {
            // Generate share link
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                alert('Link copied to clipboard!\n\n' + url);
            }).catch(() => {
                prompt('Copy this link to share:', url);
            });
        }
    };

    // ========================================================================
    // SOCIAL MEDIA REPURPOSE
    // ========================================================================

    window.openSocialMediaRepurpose = function() {
        console.log('Opening Social Media Repurpose...');
        if (typeof SocialMediaRepurpose !== 'undefined' && SocialMediaRepurpose.showPanel) {
            SocialMediaRepurpose.showPanel();
        } else {
            const modal = document.getElementById('socialMediaModal');
            if (modal) {
                modal.classList.add('visible');
            } else {
                alert('Social media repurpose feature not available');
            }
        }
    };

    // ========================================================================
    // STOCK PHOTOS
    // ========================================================================

    window.openStockPhotos = function() {
        console.log('Opening Stock Photos...');
        if (typeof StockPhotos !== 'undefined' && StockPhotos.showPanel) {
            StockPhotos.showPanel();
        } else {
            // Open Unsplash in new tab
            window.open('https://unsplash.com/s/photos/property', '_blank');
        }
    };

    // ========================================================================
    // STYLE PANEL FOR SELECTED
    // ========================================================================

    window.openStylePanelForSelected = function() {
        console.log('Opening Style Panel...');
        const selected = document.querySelector('.canvas-element.selected, .brochure-element.selected');
        if (!selected) {
            alert('Please select an element first');
            return;
        }
        const panel = document.getElementById('elementStylePanel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
    };

    // ========================================================================
    // TEXT ANIMATIONS
    // ========================================================================

    window.openTextAnimationsPanel = function() {
        console.log('Opening Text Animations...');
        const selected = document.querySelector('.text-element.selected, [contenteditable].selected');
        if (!selected) {
            alert('Please select a text element first');
            return;
        }
        if (typeof TextAnimations !== 'undefined' && TextAnimations.showPanel) {
            TextAnimations.showPanel(selected);
        } else {
            alert('Text animations feature not available');
        }
    };

    // ========================================================================
    // VERSION HISTORY
    // ========================================================================

    window.openVersionHistory = function() {
        console.log('Opening Version History...');
        if (typeof VersionHistory !== 'undefined' && VersionHistory.showPanel) {
            VersionHistory.showPanel((data) => {
                console.log('Restored version:', data);
            });
        } else {
            alert('Version history not available');
        }
    };

    // ========================================================================
    // ONBOARDING TOUR
    // ========================================================================

    window.startOnboardingTour = function() {
        console.log('Starting Onboarding Tour...');
        if (typeof OnboardingTour !== 'undefined' && OnboardingTour.start) {
            OnboardingTour.start();
        } else {
            alert('Onboarding tour not available');
        }
    };

    // ========================================================================
    // TEXT SHADOW
    // ========================================================================

    window.toggleTextShadow = function() {
        console.log('Toggling Text Shadow...');
        const selected = document.querySelector('.text-element.selected, [contenteditable].selected');
        if (!selected) {
            alert('Please select a text element first');
            return;
        }
        const current = selected.style.textShadow;
        if (current && current !== 'none') {
            selected.style.textShadow = 'none';
        } else {
            selected.style.textShadow = '2px 2px 4px rgba(0,0,0,0.3)';
        }
    };

    // ========================================================================
    // TEXT OUTLINE
    // ========================================================================

    window.toggleTextOutline = function() {
        console.log('Toggling Text Outline...');
        const selected = document.querySelector('.text-element.selected, [contenteditable].selected');
        if (!selected) {
            alert('Please select a text element first');
            return;
        }
        const current = selected.style.webkitTextStroke || selected.style.textStroke;
        if (current && current !== 'initial') {
            selected.style.webkitTextStroke = 'initial';
        } else {
            selected.style.webkitTextStroke = '1px #000000';
        }
    };

    // ========================================================================
    // CLOSE ELEMENT STYLE PANEL
    // ========================================================================

    window.closeElementStylePanel = function() {
        const panel = document.getElementById('elementStylePanel');
        if (panel) {
            panel.style.display = 'none';
        }
    };

    // ========================================================================
    // ADD NEW PAGE
    // ========================================================================

    window.addNewPage = function() {
        console.log('Adding new page...');

        // Initialize brochurePages if not exists
        if (typeof window.brochurePages === 'undefined') {
            window.brochurePages = [];
        }

        const newPageId = Math.max(...window.brochurePages.map(p => p.id), 0) + 1;
        const newPage = {
            id: newPageId,
            name: `Page ${newPageId}`,
            template: 'blank',
            elements: [],
            background: { type: 'color', value: '#ffffff' }
        };
        window.brochurePages.push(newPage);

        // Create visual page element
        const pagesContainer = document.getElementById('pagesContainer') ||
                               document.querySelector('.pages-container') ||
                               document.querySelector('.canvas-container');

        if (pagesContainer) {
            const pageEl = document.createElement('div');
            pageEl.className = 'brochure-page';
            pageEl.id = `page-${newPageId}`;
            pageEl.style.cssText = `
                width: 210mm;
                height: 297mm;
                background: white;
                margin: 20px auto;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                position: relative;
            `;
            pagesContainer.appendChild(pageEl);
        }

        // Render if function exists
        if (typeof window.renderPages === 'function') {
            window.renderPages();
        }
        if (typeof window.renderPageList === 'function') {
            window.renderPageList();
        }

        // Update page count display
        const pageCount = document.querySelectorAll('.brochure-page').length || window.brochurePages.length;
        const countEl = document.getElementById('pageCount');
        if (countEl) {
            countEl.textContent = `${pageCount} pages`;
        }

        console.log('✓ New page added:', newPage);
        return newPage;
    };

    // ========================================================================
    // UNDO / REDO (fallback if not defined by brochure_editor_v3.js)
    // ========================================================================

    // Only define if the proper implementation isn't already available
    if (typeof window.undo !== 'function' || window.undo.toString().includes('Maximum')) {
        window.undo = function() {
            console.log('Undo (fallback)...');
            // Try execCommand as last resort
            document.execCommand('undo');
        };
    }

    if (typeof window.redo !== 'function' || window.redo.toString().includes('Maximum')) {
        window.redo = function() {
            console.log('Redo (fallback)...');
            document.execCommand('redo');
        };
    }

    // ========================================================================
    // DUPLICATE CURRENT PAGE
    // ========================================================================

    window.duplicateCurrentPage = function() {
        console.log('Duplicating current page...');
        const activePage = document.querySelector('.brochure-page.active');
        if (!activePage) {
            alert('No page selected to duplicate');
            return;
        }

        // Clone the page
        const newPage = activePage.cloneNode(true);
        const pageId = Date.now();
        newPage.id = 'page-' + pageId;
        newPage.classList.remove('active');

        // Insert after active page
        activePage.parentNode.insertBefore(newPage, activePage.nextSibling);

        // Update page count
        const pageCount = document.querySelectorAll('.brochure-page').length;
        const countEl = document.getElementById('pageCount');
        if (countEl) {
            countEl.textContent = `${pageCount} pages`;
        }

        // Update page list if exists
        if (typeof window.renderPageList === 'function') {
            window.renderPageList();
        }

        console.log('✓ Page duplicated');
    };

    // ========================================================================
    // SKIP AI GENERATION
    // ========================================================================

    window.skipAIGeneration = function() {
        console.log('Skipping AI generation...');
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
        // Trigger load with default text
        if (typeof window.loadBrochureWithDefaults === 'function') {
            window.loadBrochureWithDefaults();
        }
    };

    // ========================================================================
    // SETUP EVENT LISTENERS FOR BUTTONS WITHOUT ONCLICK
    // ========================================================================

    document.addEventListener('DOMContentLoaded', function() {
        // Add Page button
        const addPageBtn = document.getElementById('addPageBtn');
        if (addPageBtn && !addPageBtn.onclick) {
            addPageBtn.addEventListener('click', function() {
                window.addNewPage();
            });
            console.log('✓ Add Page button wired');
        }

        // Elements sub-tabs (Shapes, Icons, QR, Pro, Layouts)
        document.querySelectorAll('.elements-sub-tab, [data-tab]').forEach(tab => {
            if (!tab.onclick && tab.dataset.tab) {
                tab.addEventListener('click', function() {
                    const tabName = this.dataset.tab;
                    // Switch tab content
                    document.querySelectorAll('.elements-sub-tab, [data-tab]').forEach(t => {
                        t.classList.remove('active');
                    });
                    this.classList.add('active');

                    // Show corresponding content
                    document.querySelectorAll('.tab-content, .elements-tab-content').forEach(c => {
                        c.style.display = 'none';
                    });
                    const content = document.querySelector(`[data-tab-content="${tabName}"]`);
                    if (content) {
                        content.style.display = 'block';
                    }
                });
            }
        });

        // Toggle sidebar button
        const toggleSidebar = document.querySelector('.toggle-sidebar, [data-toggle-sidebar]');
        if (toggleSidebar && !toggleSidebar.onclick) {
            toggleSidebar.addEventListener('click', function() {
                const sidebar = document.querySelector('.left-sidebar, .toolbar-sidebar');
                if (sidebar) {
                    sidebar.classList.toggle('collapsed');
                }
            });
        }

        console.log('✓ Additional event listeners attached');
    });

    console.log('✅ Button handlers loaded!');
})();
