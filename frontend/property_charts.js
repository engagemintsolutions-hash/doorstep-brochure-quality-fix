/**
 * Property Charts - Visual data representation for brochures
 * Price comparisons, area charts, room counts, EPC ratings
 */

(function() {
    'use strict';

    // ============================================================================
    // CHART TEMPLATES
    // ============================================================================

    const CHART_TYPES = {
        priceComparison: {
            name: 'Price Comparison',
            icon: '📊',
            description: 'Compare this property price with area average',
            defaultData: {
                thisProperty: 425000,
                areaAverage: 385000,
                label: 'Price vs Area Average'
            }
        },
        bedsBarChart: {
            name: 'Bedroom Count',
            icon: '🛏️',
            description: 'Visual bedroom count indicator',
            defaultData: { beds: 3, maxBeds: 6 }
        },
        bathsBarChart: {
            name: 'Bathroom Count',
            icon: '🚿',
            description: 'Visual bathroom count indicator',
            defaultData: { baths: 2, maxBaths: 4 }
        },
        sqftGauge: {
            name: 'Size Gauge',
            icon: '📐',
            description: 'Property size vs typical range',
            defaultData: { sqft: 1200, minRange: 800, maxRange: 2000 }
        },
        epcRating: {
            name: 'EPC Rating',
            icon: '⚡',
            description: 'Energy efficiency rating display',
            defaultData: { rating: 'B', score: 85 }
        },
        pricePerSqft: {
            name: 'Price per Sq Ft',
            icon: '💷',
            description: 'Value indicator',
            defaultData: { pricePerSqft: 354, areaAverage: 320 }
        },
        featureIcons: {
            name: 'Feature Icons',
            icon: '✅',
            description: 'Visual feature checklist',
            defaultData: {
                features: ['Garden', 'Parking', 'Modern Kitchen', 'Double Glazing']
            }
        },
        transportTimes: {
            name: 'Transport Times',
            icon: '🚇',
            description: 'Travel times to key locations',
            defaultData: {
                times: [
                    { location: 'City Centre', mins: 15 },
                    { location: 'Train Station', mins: 8 },
                    { location: 'Schools', mins: 5 }
                ]
            }
        }
    };

    // ============================================================================
    // CHART RENDERING
    // ============================================================================

    /**
     * Create price comparison bar chart
     */
    function createPriceComparisonChart(data) {
        const { thisProperty, areaAverage, label } = data;
        const max = Math.max(thisProperty, areaAverage) * 1.2;
        const thisPct = (thisProperty / max) * 100;
        const avgPct = (areaAverage / max) * 100;
        const diff = ((thisProperty - areaAverage) / areaAverage * 100).toFixed(0);
        const diffLabel = thisProperty > areaAverage ? `+${diff}%` : `${diff}%`;

        return `
            <div class="chart-element price-comparison-chart" data-chart-type="priceComparison">
                <div class="chart-title">${label || 'Price Comparison'}</div>
                <div class="chart-bars">
                    <div class="chart-bar-row">
                        <span class="bar-label">This Property</span>
                        <div class="bar-container">
                            <div class="bar this-property" style="width: ${thisPct}%"></div>
                        </div>
                        <span class="bar-value">£${thisProperty.toLocaleString()}</span>
                    </div>
                    <div class="chart-bar-row">
                        <span class="bar-label">Area Average</span>
                        <div class="bar-container">
                            <div class="bar area-average" style="width: ${avgPct}%"></div>
                        </div>
                        <span class="bar-value">£${areaAverage.toLocaleString()}</span>
                    </div>
                </div>
                <div class="chart-badge ${thisProperty < areaAverage ? 'good-value' : ''}">${diffLabel}</div>
            </div>
        `;
    }

    /**
     * Create bedroom/bathroom count chart
     */
    function createCountChart(type, data) {
        const count = type === 'beds' ? data.beds : data.baths;
        const max = type === 'beds' ? (data.maxBeds || 6) : (data.maxBaths || 4);
        const icon = type === 'beds' ? '🛏️' : '🚿';
        const label = type === 'beds' ? 'Bedrooms' : 'Bathrooms';

        let dots = '';
        for (let i = 0; i < max; i++) {
            dots += `<span class="count-dot ${i < count ? 'filled' : ''}">${icon}</span>`;
        }

        return `
            <div class="chart-element count-chart" data-chart-type="${type}BarChart">
                <div class="count-label">${label}</div>
                <div class="count-dots">${dots}</div>
                <div class="count-number">${count}</div>
            </div>
        `;
    }

    /**
     * Create size gauge chart
     */
    function createSizeGauge(data) {
        const { sqft, minRange, maxRange } = data;
        const range = maxRange - minRange;
        const position = Math.min(100, Math.max(0, ((sqft - minRange) / range) * 100));

        return `
            <div class="chart-element size-gauge" data-chart-type="sqftGauge">
                <div class="gauge-title">Property Size</div>
                <div class="gauge-track">
                    <div class="gauge-fill" style="width: ${position}%"></div>
                    <div class="gauge-marker" style="left: ${position}%">
                        <span class="marker-value">${sqft.toLocaleString()} sq ft</span>
                    </div>
                </div>
                <div class="gauge-labels">
                    <span>${minRange.toLocaleString()}</span>
                    <span>${maxRange.toLocaleString()}</span>
                </div>
            </div>
        `;
    }

    /**
     * Create EPC rating display
     */
    function createEPCChart(data) {
        const { rating, score } = data;
        const ratings = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        const colors = ['#00A651', '#4CB848', '#B8D433', '#FFC72C', '#F9A61A', '#EE7623', '#ED1C24'];

        let bars = '';
        ratings.forEach((r, i) => {
            const isActive = r === rating;
            bars += `
                <div class="epc-bar ${isActive ? 'active' : ''}" style="background: ${colors[i]}">
                    <span class="epc-letter">${r}</span>
                    ${isActive ? `<span class="epc-score">${score}</span>` : ''}
                </div>
            `;
        });

        return `
            <div class="chart-element epc-chart" data-chart-type="epcRating">
                <div class="epc-title">Energy Rating</div>
                <div class="epc-bars">${bars}</div>
            </div>
        `;
    }

    /**
     * Create price per sqft comparison
     */
    function createPricePerSqftChart(data) {
        const { pricePerSqft, areaAverage } = data;
        const max = Math.max(pricePerSqft, areaAverage) * 1.3;
        const thisPct = (pricePerSqft / max) * 100;
        const avgPct = (areaAverage / max) * 100;

        return `
            <div class="chart-element price-sqft-chart" data-chart-type="pricePerSqft">
                <div class="chart-title">Price per Sq Ft</div>
                <div class="comparison-visual">
                    <div class="comparison-item">
                        <div class="comp-circle this" style="transform: scale(${thisPct/80})">
                            <span>£${pricePerSqft}</span>
                        </div>
                        <div class="comp-label">This Property</div>
                    </div>
                    <div class="comparison-item">
                        <div class="comp-circle avg" style="transform: scale(${avgPct/80})">
                            <span>£${areaAverage}</span>
                        </div>
                        <div class="comp-label">Area Average</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create feature icons display
     */
    function createFeatureIcons(data) {
        const { features } = data;
        const icons = {
            'Garden': '🌳',
            'Parking': '🚗',
            'Modern Kitchen': '🍳',
            'Double Glazing': '🪟',
            'Gas Central Heating': '🔥',
            'New Build': '🏗️',
            'En-suite': '🚿',
            'Balcony': '🌇',
            'Conservatory': '🏡',
            'Garage': '🚙',
            'Fireplace': '🔥',
            'Solar Panels': '☀️',
            'Pool': '🏊',
            'Gym': '💪',
            'Security': '🔒'
        };

        let featureHtml = '';
        features.forEach(f => {
            const icon = icons[f] || '✅';
            featureHtml += `
                <div class="feature-icon-item">
                    <span class="feature-emoji">${icon}</span>
                    <span class="feature-name">${f}</span>
                </div>
            `;
        });

        return `
            <div class="chart-element feature-icons" data-chart-type="featureIcons">
                <div class="features-grid">${featureHtml}</div>
            </div>
        `;
    }

    /**
     * Create transport times chart
     */
    function createTransportChart(data) {
        const { times } = data;
        const maxTime = Math.max(...times.map(t => t.mins));

        let bars = '';
        times.forEach(t => {
            const pct = (t.mins / maxTime) * 100;
            bars += `
                <div class="transport-row">
                    <span class="transport-location">${t.location}</span>
                    <div class="transport-bar-container">
                        <div class="transport-bar" style="width: ${pct}%"></div>
                    </div>
                    <span class="transport-time">${t.mins} min</span>
                </div>
            `;
        });

        return `
            <div class="chart-element transport-chart" data-chart-type="transportTimes">
                <div class="chart-title">Travel Times</div>
                <div class="transport-bars">${bars}</div>
            </div>
        `;
    }

    // ============================================================================
    // MAIN FUNCTION
    // ============================================================================

    /**
     * Create chart element
     */
    function createChart(type, customData = {}) {
        const chartConfig = CHART_TYPES[type];
        if (!chartConfig) {
            console.error(`Unknown chart type: ${type}`);
            return null;
        }

        const data = { ...chartConfig.defaultData, ...customData };
        let chartHtml = '';

        switch (type) {
            case 'priceComparison':
                chartHtml = createPriceComparisonChart(data);
                break;
            case 'bedsBarChart':
                chartHtml = createCountChart('beds', data);
                break;
            case 'bathsBarChart':
                chartHtml = createCountChart('baths', data);
                break;
            case 'sqftGauge':
                chartHtml = createSizeGauge(data);
                break;
            case 'epcRating':
                chartHtml = createEPCChart(data);
                break;
            case 'pricePerSqft':
                chartHtml = createPricePerSqftChart(data);
                break;
            case 'featureIcons':
                chartHtml = createFeatureIcons(data);
                break;
            case 'transportTimes':
                chartHtml = createTransportChart(data);
                break;
        }

        return chartHtml;
    }

    /**
     * Add chart to canvas
     */
    function addChartToCanvas(type, customData = {}) {
        const chartHtml = createChart(type, customData);
        if (!chartHtml) return null;

        const currentPageId = window.EditorState?.currentPage;
        const pageCanvas = document.querySelector(`[data-page-id="${currentPageId}"] .page-canvas, .page-canvas`);
        if (!pageCanvas) {
            console.warn('No canvas found');
            return null;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'design-element';
        wrapper.dataset.elementType = 'chart';
        wrapper.dataset.chartType = type;
        wrapper.dataset.elementId = `chart_${Date.now()}`;
        wrapper.style.cssText = 'position: absolute; left: 50px; top: 50px;';
        wrapper.innerHTML = chartHtml;

        pageCanvas.appendChild(wrapper);

        // Initialize drag
        if (typeof initElementDrag === 'function') {
            initElementDrag(wrapper);
        }
        if (typeof selectElement === 'function') {
            selectElement(wrapper);
        }

        showToast(`Added ${CHART_TYPES[type].name} chart`);

        return wrapper;
    }

    /**
     * Render charts panel
     */
    function renderChartsPanel(container) {
        let html = `
            <div class="charts-panel">
                <div class="panel-header">
                    <h3>Property Charts</h3>
                </div>

                <div class="charts-grid">
                    ${Object.entries(CHART_TYPES).map(([type, config]) => `
                        <div class="chart-type-card" data-chart-type="${type}">
                            <div class="chart-icon">${config.icon}</div>
                            <div class="chart-info">
                                <div class="chart-name">${config.name}</div>
                                <div class="chart-desc">${config.description}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Add click events
        container.querySelectorAll('.chart-type-card').forEach(card => {
            card.addEventListener('click', () => {
                addChartToCanvas(card.dataset.chartType);
            });
        });
    }

    /**
     * Show toast
     */
    function showToast(msg) {
        if (typeof window.showToast === 'function') window.showToast(msg);
    }

    // ============================================================================
    // STYLES
    // ============================================================================

    const styles = document.createElement('style');
    styles.textContent = `
        /* Charts Panel */
        .charts-panel { padding: 12px; }
        .charts-panel .panel-header { margin-bottom: 16px; }
        .charts-panel .panel-header h3 { margin: 0; font-size: 16px; }

        .charts-grid {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .chart-type-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: #f8f9fa;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .chart-type-card:hover {
            border-color: #667eea;
            background: #f0f4ff;
            transform: translateX(4px);
        }

        .chart-icon { font-size: 24px; }
        .chart-name { font-weight: 600; font-size: 14px; color: #333; }
        .chart-desc { font-size: 11px; color: #888; margin-top: 2px; }

        /* Chart Elements - Common */
        .chart-element {
            padding: 16px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-width: 250px;
        }

        .chart-title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 12px;
        }

        /* Price Comparison */
        .price-comparison-chart .chart-bars { display: flex; flex-direction: column; gap: 8px; }
        .chart-bar-row { display: flex; align-items: center; gap: 8px; }
        .bar-label { width: 90px; font-size: 12px; color: #666; }
        .bar-container { flex: 1; height: 24px; background: #f0f0f0; border-radius: 4px; overflow: hidden; }
        .bar { height: 100%; border-radius: 4px; transition: width 0.5s; }
        .bar.this-property { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .bar.area-average { background: #94a3b8; }
        .bar-value { min-width: 80px; font-size: 13px; font-weight: 600; text-align: right; }
        .chart-badge { position: absolute; top: 8px; right: 8px; padding: 4px 10px; background: #f0f0f0; border-radius: 12px; font-size: 12px; font-weight: 600; }
        .chart-badge.good-value { background: #dcfce7; color: #16a34a; }

        /* Count Chart */
        .count-chart { text-align: center; min-width: 200px; }
        .count-label { font-size: 14px; font-weight: 500; color: #666; margin-bottom: 8px; }
        .count-dots { display: flex; justify-content: center; gap: 4px; margin-bottom: 8px; }
        .count-dot { font-size: 20px; opacity: 0.3; }
        .count-dot.filled { opacity: 1; }
        .count-number { font-size: 32px; font-weight: 700; color: #333; }

        /* Size Gauge */
        .size-gauge { min-width: 280px; }
        .gauge-title { font-size: 14px; font-weight: 500; color: #666; margin-bottom: 16px; }
        .gauge-track { position: relative; height: 12px; background: #e0e0e0; border-radius: 6px; overflow: visible; }
        .gauge-fill { height: 100%; background: linear-gradient(90deg, #22c55e, #eab308, #ef4444); border-radius: 6px; }
        .gauge-marker { position: absolute; top: -8px; transform: translateX(-50%); }
        .marker-value { background: #333; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; white-space: nowrap; }
        .gauge-labels { display: flex; justify-content: space-between; margin-top: 8px; font-size: 11px; color: #888; }

        /* EPC Chart */
        .epc-chart { min-width: 220px; }
        .epc-title { font-size: 14px; font-weight: 500; color: #666; margin-bottom: 12px; }
        .epc-bars { display: flex; flex-direction: column; gap: 2px; }
        .epc-bar { display: flex; align-items: center; padding: 4px 8px; border-radius: 4px; opacity: 0.4; }
        .epc-bar.active { opacity: 1; transform: scaleX(1.05); box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
        .epc-letter { font-weight: 700; color: white; font-size: 14px; }
        .epc-score { margin-left: auto; font-weight: 600; color: white; font-size: 13px; }

        /* Price per Sqft */
        .price-sqft-chart { min-width: 220px; }
        .comparison-visual { display: flex; justify-content: space-around; padding: 16px 0; }
        .comparison-item { text-align: center; }
        .comp-circle { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; color: white; margin: 0 auto 8px; }
        .comp-circle.this { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .comp-circle.avg { background: #94a3b8; }
        .comp-label { font-size: 11px; color: #666; }

        /* Feature Icons */
        .feature-icons { min-width: 200px; }
        .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
        .feature-icon-item { display: flex; align-items: center; gap: 8px; padding: 8px; background: #f8f9fa; border-radius: 8px; }
        .feature-emoji { font-size: 18px; }
        .feature-name { font-size: 12px; color: #333; }

        /* Transport Chart */
        .transport-chart { min-width: 280px; }
        .transport-bars { display: flex; flex-direction: column; gap: 8px; }
        .transport-row { display: flex; align-items: center; gap: 8px; }
        .transport-location { width: 100px; font-size: 12px; color: #666; }
        .transport-bar-container { flex: 1; height: 16px; background: #f0f0f0; border-radius: 4px; overflow: hidden; }
        .transport-bar { height: 100%; background: linear-gradient(90deg, #10b981, #22c55e); border-radius: 4px; }
        .transport-time { min-width: 50px; font-size: 13px; font-weight: 600; text-align: right; }
    `;
    document.head.appendChild(styles);

    // ============================================================================
    // EXPORTS
    // ============================================================================

    window.PropertyCharts = {
        CHART_TYPES,
        create: createChart,
        addToCanvas: addChartToCanvas,
        renderPanel: renderChartsPanel
    };

    console.log(`Property Charts loaded: ${Object.keys(CHART_TYPES).length} chart types`);

})();
