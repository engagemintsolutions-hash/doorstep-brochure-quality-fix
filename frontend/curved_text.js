/**
 * Curved Text - Create text along paths
 * Canva-level text manipulation
 */

(function() {
    'use strict';

    // Curve presets
    const CURVE_PRESETS = {
        none: { name: 'None', path: null },
        arcUp: {
            name: 'Arc Up',
            path: (w, h) => `M 0,${h} Q ${w/2},0 ${w},${h}`,
            textAnchor: 'middle'
        },
        arcDown: {
            name: 'Arc Down',
            path: (w, h) => `M 0,0 Q ${w/2},${h*2} ${w},0`,
            textAnchor: 'middle'
        },
        wave: {
            name: 'Wave',
            path: (w, h) => `M 0,${h/2} Q ${w*0.25},0 ${w*0.5},${h/2} T ${w},${h/2}`,
            textAnchor: 'middle'
        },
        circle: {
            name: 'Circle',
            path: (w, h) => {
                const r = Math.min(w, h) / 2;
                return `M ${w/2 - r},${h/2} A ${r},${r} 0 1,1 ${w/2 + r},${h/2} A ${r},${r} 0 1,1 ${w/2 - r},${h/2}`;
            },
            textAnchor: 'middle'
        },
        halfCircleTop: {
            name: 'Half Circle (Top)',
            path: (w, h) => {
                const r = w / 2;
                return `M 0,${h} A ${r},${r} 0 0,1 ${w},${h}`;
            },
            textAnchor: 'middle'
        },
        halfCircleBottom: {
            name: 'Half Circle (Bottom)',
            path: (w, h) => {
                const r = w / 2;
                return `M 0,0 A ${r},${r} 0 0,0 ${w},0`;
            },
            textAnchor: 'middle'
        },
        rise: {
            name: 'Rise',
            path: (w, h) => `M 0,${h} L ${w},0`,
            textAnchor: 'start'
        },
        fall: {
            name: 'Fall',
            path: (w, h) => `M 0,0 L ${w},${h}`,
            textAnchor: 'start'
        },
        bridgeUp: {
            name: 'Bridge Up',
            path: (w, h) => `M 0,${h} Q ${w*0.25},0 ${w/2},${h*0.3} Q ${w*0.75},0 ${w},${h}`,
            textAnchor: 'middle'
        },
        bridgeDown: {
            name: 'Bridge Down',
            path: (w, h) => `M 0,0 Q ${w*0.25},${h} ${w/2},${h*0.7} Q ${w*0.75},${h} ${w},0`,
            textAnchor: 'middle'
        },
        spiral: {
            name: 'Spiral In',
            path: (w, h) => {
                let path = `M 0,${h/2}`;
                const turns = 2;
                const points = 50;
                for (let i = 0; i <= points; i++) {
                    const angle = (i / points) * turns * Math.PI * 2;
                    const r = (w/2) * (1 - i/points * 0.5);
                    const x = w/2 + r * Math.cos(angle);
                    const y = h/2 + r * Math.sin(angle);
                    path += ` L ${x},${y}`;
                }
                return path;
            },
            textAnchor: 'start'
        }
    };

    /**
     * Create curved text element
     */
    function createCurvedText(text, options = {}) {
        const {
            curve = 'arcUp',
            fontSize = 24,
            fontFamily = 'Arial',
            fontWeight = 'normal',
            color = '#000000',
            width = 300,
            height = 100,
            letterSpacing = 0
        } = options;

        const preset = CURVE_PRESETS[curve];
        if (!preset || !preset.path) {
            // No curve - return regular text
            return createRegularText(text, options);
        }

        const pathId = `curve_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const pathD = preset.path(width, height);

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.style.overflow = 'visible';

        // Create the path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('id', pathId);
        path.setAttribute('d', pathD);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'none');

        // Create defs to hold the path
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.appendChild(path);
        svg.appendChild(defs);

        // Create text element
        const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textEl.setAttribute('fill', color);
        textEl.setAttribute('font-size', fontSize);
        textEl.setAttribute('font-family', fontFamily);
        textEl.setAttribute('font-weight', fontWeight);
        if (letterSpacing) {
            textEl.setAttribute('letter-spacing', letterSpacing);
        }

        // Create textPath
        const textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
        textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${pathId}`);
        textPath.setAttribute('startOffset', '50%');
        textPath.setAttribute('text-anchor', preset.textAnchor || 'middle');
        textPath.textContent = text;

        textEl.appendChild(textPath);
        svg.appendChild(textEl);

        return svg;
    }

    /**
     * Create regular text element (no curve)
     */
    function createRegularText(text, options = {}) {
        const {
            fontSize = 24,
            fontFamily = 'Arial',
            fontWeight = 'normal',
            color = '#000000'
        } = options;

        const span = document.createElement('span');
        span.textContent = text;
        span.style.fontSize = fontSize + 'px';
        span.style.fontFamily = fontFamily;
        span.style.fontWeight = fontWeight;
        span.style.color = color;
        return span;
    }

    /**
     * Apply curve to existing text element
     */
    function applyCurveToElement(element, curveType) {
        const text = element.textContent || element.innerText;
        if (!text) return;

        const computedStyle = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();

        const options = {
            curve: curveType,
            fontSize: parseInt(computedStyle.fontSize) || 24,
            fontFamily: computedStyle.fontFamily || 'Arial',
            fontWeight: computedStyle.fontWeight || 'normal',
            color: computedStyle.color || '#000000',
            width: rect.width || 300,
            height: rect.height || 100
        };

        const curvedSvg = createCurvedText(text, options);

        // Store original text for editing
        element.dataset.originalText = text;
        element.dataset.curveType = curveType;

        // Replace content
        element.innerHTML = '';
        element.appendChild(curvedSvg);

        return element;
    }

    /**
     * Remove curve from element
     */
    function removeCurveFromElement(element) {
        const originalText = element.dataset.originalText;
        if (!originalText) return;

        element.innerHTML = originalText;
        delete element.dataset.originalText;
        delete element.dataset.curveType;

        return element;
    }

    /**
     * Update curved text content
     */
    function updateCurvedText(element, newText) {
        const curveType = element.dataset.curveType;
        if (!curveType || curveType === 'none') {
            element.textContent = newText;
            return;
        }

        element.dataset.originalText = newText;
        applyCurveToElement(element, curveType);
    }

    /**
     * Render curve controls panel
     */
    function renderCurveControls(container, targetElement) {
        const currentCurve = targetElement?.dataset.curveType || 'none';

        let html = `
            <div class="curve-controls">
                <div class="control-group">
                    <label>Text Curve</label>
                    <div class="curve-presets">
        `;

        Object.entries(CURVE_PRESETS).forEach(([id, preset]) => {
            const isActive = id === currentCurve;
            const previewSvg = getCurvePreview(id);
            html += `
                <button class="curve-preset-btn ${isActive ? 'active' : ''}"
                        data-curve="${id}"
                        title="${preset.name}">
                    ${previewSvg}
                    <span class="curve-name">${preset.name}</span>
                </button>
            `;
        });

        html += `
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Add event listeners
        container.querySelectorAll('.curve-preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const curve = btn.dataset.curve;
                if (targetElement) {
                    if (curve === 'none') {
                        removeCurveFromElement(targetElement);
                    } else {
                        applyCurveToElement(targetElement, curve);
                    }
                }
                // Update active state
                container.querySelectorAll('.curve-preset-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    /**
     * Get curve preview SVG
     */
    function getCurvePreview(curveId) {
        const preset = CURVE_PRESETS[curveId];
        if (!preset || !preset.path) {
            return `<svg viewBox="0 0 40 20"><text x="20" y="15" text-anchor="middle" font-size="10">Aa</text></svg>`;
        }

        const pathD = preset.path(40, 20);
        return `
            <svg viewBox="0 0 40 20">
                <defs>
                    <path id="preview_${curveId}" d="${pathD}" fill="none"/>
                </defs>
                <text font-size="8">
                    <textPath href="#preview_${curveId}" startOffset="50%" text-anchor="middle">Text</textPath>
                </text>
            </svg>
        `;
    }

    /**
     * Add curved text to canvas
     */
    function addCurvedTextToCanvas(text = 'Curved Text', curveType = 'arcUp') {
        const currentPageId = window.EditorState?.currentPage;
        if (!currentPageId) return;

        const pageCanvas = document.querySelector(`[data-page-id="${currentPageId}"] .page-canvas, [data-page-id="${currentPageId}"]`);
        if (!pageCanvas) return;

        const element = document.createElement('div');
        element.className = 'design-element text-element curved-text-element editable';
        element.dataset.elementType = 'curved-text';
        element.dataset.elementId = `curved_${Date.now()}`;
        element.dataset.curveType = curveType;
        element.dataset.originalText = text;
        element.style.cssText = 'position: absolute; left: 100px; top: 100px; width: 300px; height: 100px;';
        element.contentEditable = 'false';

        const svg = createCurvedText(text, {
            curve: curveType,
            width: 300,
            height: 100,
            fontSize: 24,
            color: '#000000'
        });

        element.appendChild(svg);
        pageCanvas.appendChild(element);

        if (typeof initElementDrag === 'function') {
            initElementDrag(element);
        }
        if (typeof selectElement === 'function') {
            selectElement(element);
        }
        if (window.EditorState) {
            window.EditorState.isDirty = true;
        }

        return element;
    }

    // Export to global scope
    window.CurvedText = {
        PRESETS: CURVE_PRESETS,
        create: createCurvedText,
        apply: applyCurveToElement,
        remove: removeCurveFromElement,
        update: updateCurvedText,
        renderControls: renderCurveControls,
        addToCanvas: addCurvedTextToCanvas,
        getPreview: getCurvePreview
    };

    console.log('Curved Text loaded:', Object.keys(CURVE_PRESETS).length, 'curve presets');

})();
