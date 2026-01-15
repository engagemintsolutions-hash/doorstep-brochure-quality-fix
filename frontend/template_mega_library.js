/**
 * Mega Template Library - Hundreds of templates with color customization
 * Organized by: Property Type, Purpose, Style, Format
 */

(function() {
    'use strict';

    // ============================================================================
    // COLOR SCHEMES (30 schemes × multiple templates = hundreds of combinations)
    // ============================================================================

    const COLOR_SCHEMES = {
        // Classic & Professional
        classicNavy: { name: 'Classic Navy', primary: '#1a365d', secondary: '#2c5282', accent: '#ed8936', background: '#ffffff', text: '#2d3748' },
        corporateBlue: { name: 'Corporate Blue', primary: '#0066cc', secondary: '#004499', accent: '#ff6600', background: '#f8fafc', text: '#1e293b' },
        executiveGray: { name: 'Executive Gray', primary: '#374151', secondary: '#6b7280', accent: '#f59e0b', background: '#ffffff', text: '#111827' },
        professionalGreen: { name: 'Professional Green', primary: '#065f46', secondary: '#047857', accent: '#fbbf24', background: '#f0fdf4', text: '#14532d' },

        // Luxury & Premium
        blackGold: { name: 'Black & Gold', primary: '#1a1a1a', secondary: '#333333', accent: '#d4af37', background: '#0d0d0d', text: '#ffffff' },
        platinumLux: { name: 'Platinum Luxury', primary: '#2d3748', secondary: '#4a5568', accent: '#c9a961', background: '#f7fafc', text: '#1a202c' },
        roseGoldElite: { name: 'Rose Gold Elite', primary: '#4a3728', secondary: '#6b4423', accent: '#e8b4b8', background: '#fdf2f8', text: '#3d2914' },
        sapphireRoyal: { name: 'Sapphire Royal', primary: '#1e3a5f', secondary: '#2c5282', accent: '#c9a961', background: '#f0f9ff', text: '#0c4a6e' },
        emeraldPrestige: { name: 'Emerald Prestige', primary: '#064e3b', secondary: '#047857', accent: '#fcd34d', background: '#ecfdf5', text: '#022c22' },

        // Modern & Contemporary
        modernMono: { name: 'Modern Mono', primary: '#000000', secondary: '#404040', accent: '#666666', background: '#ffffff', text: '#000000' },
        cleanSlate: { name: 'Clean Slate', primary: '#334155', secondary: '#64748b', accent: '#0ea5e9', background: '#f8fafc', text: '#0f172a' },
        urbanChic: { name: 'Urban Chic', primary: '#18181b', secondary: '#3f3f46', accent: '#a855f7', background: '#fafafa', text: '#09090b' },
        techModern: { name: 'Tech Modern', primary: '#0f172a', secondary: '#1e293b', accent: '#22d3ee', background: '#f1f5f9', text: '#020617' },

        // Bold & Vibrant
        sunsetCoral: { name: 'Sunset Coral', primary: '#dc2626', secondary: '#f97316', accent: '#fbbf24', background: '#fff7ed', text: '#7c2d12' },
        oceanBreeze: { name: 'Ocean Breeze', primary: '#0891b2', secondary: '#06b6d4', accent: '#f97316', background: '#ecfeff', text: '#164e63' },
        forestFresh: { name: 'Forest Fresh', primary: '#15803d', secondary: '#22c55e', accent: '#facc15', background: '#f0fdf4', text: '#14532d' },
        berryBliss: { name: 'Berry Bliss', primary: '#7c3aed', secondary: '#a855f7', accent: '#f472b6', background: '#faf5ff', text: '#4c1d95' },
        electricBlue: { name: 'Electric Blue', primary: '#2563eb', secondary: '#3b82f6', accent: '#f59e0b', background: '#eff6ff', text: '#1e3a8a' },

        // Natural & Earthy
        warmSand: { name: 'Warm Sand', primary: '#92400e', secondary: '#b45309', accent: '#059669', background: '#fefce8', text: '#78350f' },
        stoneNatural: { name: 'Stone Natural', primary: '#57534e', secondary: '#78716c', accent: '#84cc16', background: '#fafaf9', text: '#292524' },
        woodlandBrown: { name: 'Woodland Brown', primary: '#5c4033', secondary: '#8b6914', accent: '#4ade80', background: '#fdf6e3', text: '#3d2914' },
        terracotta: { name: 'Terracotta', primary: '#c2410c', secondary: '#ea580c', accent: '#16a34a', background: '#fff7ed', text: '#7c2d12' },

        // 2026 British Cosy Modern - Warm, inviting, human-centered
        britishCottage: { name: 'British Cottage', primary: '#5d6e5c', secondary: '#a8b5a0', accent: '#d4a574', background: '#faf8f5', text: '#3d3d3d' },
        cosyHearth: { name: 'Cosy Hearth', primary: '#8b4d3b', secondary: '#c9a88e', accent: '#deb887', background: '#fff9f5', text: '#4a3728' },
        sageAndStone: { name: 'Sage & Stone', primary: '#7d8471', secondary: '#b5baa8', accent: '#c49a6c', background: '#f5f5f0', text: '#404040' },
        dustyRose: { name: 'Dusty Rose', primary: '#b8848c', secondary: '#d4a5a5', accent: '#8b7355', background: '#fdf6f6', text: '#5c4a4a' },
        warmTaupe: { name: 'Warm Taupe', primary: '#8b7d72', secondary: '#a89f94', accent: '#c17f59', background: '#faf7f4', text: '#4a4540' },
        heritageGreen: { name: 'Heritage Green', primary: '#2d4a3e', secondary: '#5c7a6b', accent: '#d4af37', background: '#f4f7f5', text: '#1a2e24' },
        countryManor: { name: 'Country Manor', primary: '#4a5568', secondary: '#9ca3af', accent: '#92400e', background: '#f8f6f3', text: '#2d3748' },
        coastalCalm: { name: 'Coastal Calm', primary: '#4a6670', secondary: '#8fa3ad', accent: '#d4a574', background: '#f5f8f9', text: '#2c3e43' },
        autumnWarm: { name: 'Autumn Warm', primary: '#8b5a2b', secondary: '#c49a6c', accent: '#6b4423', background: '#fdf8f3', text: '#4a3520' },
        softLinen: { name: 'Soft Linen', primary: '#6b6b5c', secondary: '#a3a390', accent: '#b87333', background: '#faf9f6', text: '#3d3d35' },
        modernRustic: { name: 'Modern Rustic', primary: '#5c4033', secondary: '#8b7355', accent: '#7d8471', background: '#f8f5f0', text: '#3d2914' },
        gentleBlush: { name: 'Gentle Blush', primary: '#9a7b6d', secondary: '#c4a99a', accent: '#d4a5a5', background: '#fdf8f6', text: '#5c4a42' },
        twilightTeal: { name: 'Twilight Teal', primary: '#3d5a5a', secondary: '#6b8a8a', accent: '#c49a6c', background: '#f4f7f7', text: '#2a3f3f' },
        velvetMoss: { name: 'Velvet Moss', primary: '#4a5d4a', secondary: '#7a8f7a', accent: '#b87333', background: '#f5f7f5', text: '#2d3a2d' },
        warmCharcoal: { name: 'Warm Charcoal', primary: '#4a4a4a', secondary: '#6b6b6b', accent: '#c49a6c', background: '#faf9f7', text: '#333333' },

        // UK Agency Inspired
        savillsStyle: { name: 'Savills', primary: '#1a3c6e', secondary: '#c9a961', accent: '#8b7355', background: '#f8f6f3', text: '#333333' },
        knightFrankStyle: { name: 'Knight Frank', primary: '#003366', secondary: '#d4af37', accent: '#4a4a4a', background: '#ffffff', text: '#1a1a1a' },
        foxtonsStyle: { name: 'Foxtons', primary: '#00594c', secondary: '#8dc63f', accent: '#ffffff', background: '#f5f5f5', text: '#333333' },
        purpleBricksStyle: { name: 'Purple Bricks', primary: '#6b2d5b', secondary: '#f7941d', accent: '#ffffff', background: '#ffffff', text: '#333333' },
        rightmoveStyle: { name: 'Rightmove', primary: '#00deb6', secondary: '#2c2c2c', accent: '#ff5a00', background: '#ffffff', text: '#2c2c2c' },
        zooplaStyle: { name: 'Zoopla', primary: '#6d2077', secondary: '#e95420', accent: '#8a3e91', background: '#ffffff', text: '#333333' },
        hamptonsStyle: { name: 'Hamptons', primary: '#003057', secondary: '#c5a572', accent: '#666666', background: '#f9f9f9', text: '#1a1a1a' },
        chestertonsStyle: { name: 'Chestertons', primary: '#1b4b6b', secondary: '#c7a44b', accent: '#8a8a8a', background: '#ffffff', text: '#333333' },
        dextersStyle: { name: 'Dexters', primary: '#000000', secondary: '#e31837', accent: '#ffffff', background: '#f5f5f5', text: '#1a1a1a' },
        winkworthStyle: { name: 'Winkworth', primary: '#2c3e50', secondary: '#c0392b', accent: '#f39c12', background: '#ffffff', text: '#2c3e50' }
    };

    // ============================================================================
    // BASE TEMPLATES (40 base designs)
    // ============================================================================

    const BASE_TEMPLATES = {
        // === FOR SALE BROCHURES ===
        forSale_classic: {
            name: 'Classic For Sale',
            category: 'for_sale',
            propertyType: 'any',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, title: 'top', price: 'overlay', features: 'bottom' },
                page2: { gallery: '2x2', description: 'right', features: 'icons' }
            }
        },
        forSale_modern: {
            name: 'Modern For Sale',
            category: 'for_sale',
            propertyType: 'any',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, title: 'overlay-bottom', price: 'badge', features: 'strip' },
                page2: { gallery: 'masonry', description: 'full-width' }
            }
        },
        forSale_luxury: {
            name: 'Luxury For Sale',
            category: 'for_sale',
            propertyType: 'luxury',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, title: 'elegant', price: 'discrete', border: 'gold' },
                page2: { gallery: 'editorial', description: 'serif' }
            }
        },
        forSale_minimal: {
            name: 'Minimal For Sale',
            category: 'for_sale',
            propertyType: 'any',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, title: 'clean', price: 'simple', whitespace: 'generous' },
                page2: { gallery: 'single-focus', description: 'minimal' }
            }
        },
        forSale_bold: {
            name: 'Bold For Sale',
            category: 'for_sale',
            propertyType: 'any',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, title: 'large', price: 'prominent', colorBlock: true },
                page2: { gallery: 'grid', description: 'punchy' }
            }
        },

        // === FOR RENT ===
        forRent_standard: {
            name: 'Standard Rental',
            category: 'for_rent',
            propertyType: 'any',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, title: 'rental-badge', price: 'pcm', availableFrom: true },
                page2: { gallery: '2x2', description: 'right', terms: 'footer' }
            }
        },
        forRent_student: {
            name: 'Student Let',
            category: 'for_rent',
            propertyType: 'flat',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, title: 'friendly', price: 'per-room', transport: true },
                page2: { gallery: 'rooms', amenities: 'icons', bills: 'included' }
            }
        },
        forRent_professional: {
            name: 'Professional Let',
            category: 'for_rent',
            propertyType: 'flat',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, title: 'executive', price: 'prominent', furnished: true },
                page2: { gallery: 'quality', amenities: 'premium' }
            }
        },

        // === NEW LISTING ===
        newListing_announcement: {
            name: 'New Listing Announcement',
            category: 'new_listing',
            propertyType: 'any',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, badge: 'NEW', title: 'attention', price: 'reveal' },
                page2: { gallery: 'preview', cta: 'viewings' }
            }
        },
        newListing_exclusive: {
            name: 'Exclusive New Listing',
            category: 'new_listing',
            propertyType: 'luxury',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, badge: 'EXCLUSIVE', title: 'prestige', price: 'poa' },
                page2: { gallery: 'curated', description: 'detailed' }
            }
        },
        newListing_justListed: {
            name: 'Just Listed',
            category: 'new_listing',
            propertyType: 'any',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, banner: 'JUST LISTED', title: 'excited', price: 'guide' },
                page2: { gallery: 'showcase', highlights: 'bullets' }
            }
        },

        // === PRICE REDUCED ===
        priceReduced_alert: {
            name: 'Price Reduced Alert',
            category: 'price_reduced',
            propertyType: 'any',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, banner: 'PRICE REDUCED', oldPrice: true, newPrice: 'highlight' },
                page2: { gallery: 'value', description: 'opportunity' }
            }
        },
        priceReduced_bargain: {
            name: 'Great Value',
            category: 'price_reduced',
            propertyType: 'any',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, badge: 'REDUCED', savings: true, price: 'comparison' },
                page2: { gallery: 'features', value: 'highlighted' }
            }
        },

        // === UNDER OFFER / SOLD ===
        underOffer_pending: {
            name: 'Under Offer',
            category: 'under_offer',
            propertyType: 'any',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, overlay: 'UNDER OFFER', title: 'success', similar: true },
                page2: { gallery: 'record', cta: 'similar-properties' }
            }
        },
        sold_success: {
            name: 'Sold Success',
            category: 'sold',
            propertyType: 'any',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, banner: 'SOLD', title: 'celebration', testimonial: true },
                page2: { gallery: 'achievement', cta: 'sell-yours' }
            }
        },
        soldSTC_pending: {
            name: 'Sold STC',
            category: 'sold',
            propertyType: 'any',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, ribbon: 'SOLD STC', title: 'pending', backup: true },
                page2: { gallery: 'documentation' }
            }
        },

        // === PROPERTY TYPES ===
        house_detached: {
            name: 'Detached House',
            category: 'property_type',
            propertyType: 'house',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, title: 'family-home', features: 'land-size', parking: true },
                page2: { gallery: 'exterior-interior', garden: 'featured', floorplan: true }
            }
        },
        house_semi: {
            name: 'Semi-Detached',
            category: 'property_type',
            propertyType: 'house',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, title: 'practical', features: 'value', parking: true },
                page2: { gallery: 'rooms', garden: 'rear' }
            }
        },
        house_terraced: {
            name: 'Terraced House',
            category: 'property_type',
            propertyType: 'house',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, title: 'character', features: 'location', period: true },
                page2: { gallery: 'cozy', courtyard: true }
            }
        },
        flat_modern: {
            name: 'Modern Apartment',
            category: 'property_type',
            propertyType: 'flat',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, title: 'urban-living', features: 'building-amenities', floor: true },
                page2: { gallery: 'interior', balcony: true, concierge: true }
            }
        },
        flat_penthouse: {
            name: 'Penthouse',
            category: 'property_type',
            propertyType: 'flat',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, title: 'sky-living', features: 'views', terrace: true },
                page2: { gallery: 'panoramic', amenities: 'exclusive' }
            }
        },
        bungalow: {
            name: 'Bungalow',
            category: 'property_type',
            propertyType: 'bungalow',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, title: 'single-level', features: 'accessibility', garden: true },
                page2: { gallery: 'accessible', parking: 'drive' }
            }
        },
        cottage: {
            name: 'Country Cottage',
            category: 'property_type',
            propertyType: 'cottage',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, title: 'character', features: 'period-details', beams: true },
                page2: { gallery: 'charming', garden: 'cottage-garden' }
            }
        },
        newBuild: {
            name: 'New Build',
            category: 'property_type',
            propertyType: 'new_build',
            format: 'brochure',
            layout: {
                page1: { heroImage: true, title: 'brand-new', features: 'warranty', epc: 'A-rated' },
                page2: { gallery: 'showroom', spec: 'detailed', developer: true }
            }
        },

        // === SOCIAL MEDIA ===
        social_instagram_square: {
            name: 'Instagram Post',
            category: 'social',
            propertyType: 'any',
            format: 'instagram_post',
            dimensions: { width: 1080, height: 1080 },
            layout: { heroImage: true, title: 'bold', price: 'overlay', cta: 'swipe' }
        },
        social_instagram_story: {
            name: 'Instagram Story',
            category: 'social',
            propertyType: 'any',
            format: 'instagram_story',
            dimensions: { width: 1080, height: 1920 },
            layout: { heroImage: 'full', title: 'top', price: 'middle', cta: 'bottom' }
        },
        social_instagram_carousel: {
            name: 'Instagram Carousel',
            category: 'social',
            propertyType: 'any',
            format: 'instagram_carousel',
            dimensions: { width: 1080, height: 1080 },
            pages: 5,
            layout: { slide1: 'hero', slide2: 'features', slide3: 'gallery', slide4: 'location', slide5: 'cta' }
        },
        social_facebook_post: {
            name: 'Facebook Post',
            category: 'social',
            propertyType: 'any',
            format: 'facebook_post',
            dimensions: { width: 1200, height: 630 },
            layout: { heroImage: true, title: 'left', price: 'right', features: 'strip' }
        },
        social_facebook_cover: {
            name: 'Facebook Cover',
            category: 'social',
            propertyType: 'any',
            format: 'facebook_cover',
            dimensions: { width: 820, height: 312 },
            layout: { heroImage: 'panoramic', branding: 'center' }
        },
        social_linkedin: {
            name: 'LinkedIn Post',
            category: 'social',
            propertyType: 'any',
            format: 'linkedin',
            dimensions: { width: 1200, height: 627 },
            layout: { heroImage: true, title: 'professional', stats: true }
        },
        social_twitter: {
            name: 'Twitter/X Post',
            category: 'social',
            propertyType: 'any',
            format: 'twitter',
            dimensions: { width: 1200, height: 675 },
            layout: { heroImage: true, title: 'concise', price: 'bold' }
        },
        social_pinterest: {
            name: 'Pinterest Pin',
            category: 'social',
            propertyType: 'any',
            format: 'pinterest',
            dimensions: { width: 1000, height: 1500 },
            layout: { heroImage: 'tall', title: 'overlay', features: 'list', save: 'cta' }
        },

        // === MARKETING MATERIALS ===
        openHouse_invitation: {
            name: 'Open House Invite',
            category: 'marketing',
            propertyType: 'any',
            format: 'flyer',
            layout: {
                heroImage: true, event: 'OPEN HOUSE', date: 'prominent', time: true,
                address: true, rsvp: true
            }
        },
        valuation_offer: {
            name: 'Free Valuation',
            category: 'marketing',
            propertyType: 'any',
            format: 'flyer',
            layout: {
                headline: 'FREE VALUATION', subhead: 'thinking-of-selling',
                benefits: 'list', cta: 'book-now', testimonial: true
            }
        },
        marketReport: {
            name: 'Market Report',
            category: 'marketing',
            propertyType: 'any',
            format: 'report',
            layout: {
                title: 'quarterly', stats: 'infographic', trends: 'chart',
                advice: 'expert', cta: 'contact'
            }
        },
        agentProfile: {
            name: 'Agent Profile',
            category: 'marketing',
            propertyType: 'any',
            format: 'card',
            layout: {
                photo: 'agent', name: 'prominent', title: true, contact: 'all',
                testimonials: 'carousel', achievements: 'badges'
            }
        }
    };

    // ============================================================================
    // TEMPLATE GENERATOR - Creates all template combinations
    // ============================================================================

    let generatedTemplates = [];

    /**
     * Generate all template combinations
     */
    function generateAllTemplates() {
        generatedTemplates = [];
        let id = 1;

        Object.entries(BASE_TEMPLATES).forEach(([baseId, baseTemplate]) => {
            Object.entries(COLOR_SCHEMES).forEach(([schemeId, scheme]) => {
                generatedTemplates.push({
                    id: `tpl_${id++}`,
                    baseId: baseId,
                    schemeId: schemeId,
                    name: `${baseTemplate.name} - ${scheme.name}`,
                    category: baseTemplate.category,
                    propertyType: baseTemplate.propertyType,
                    format: baseTemplate.format,
                    dimensions: baseTemplate.dimensions || { width: 595, height: 842 }, // A4 default
                    layout: baseTemplate.layout,
                    colors: { ...scheme },
                    fonts: getFontsForScheme(schemeId),
                    thumbnail: generateThumbnail(baseTemplate, scheme)
                });
            });
        });

        console.log(`Generated ${generatedTemplates.length} templates`);
        return generatedTemplates;
    }

    /**
     * Get appropriate fonts for a color scheme
     */
    function getFontsForScheme(schemeId) {
        const luxurySchemes = ['blackGold', 'platinumLux', 'roseGoldElite', 'sapphireRoyal', 'emeraldPrestige'];
        const modernSchemes = ['modernMono', 'cleanSlate', 'urbanChic', 'techModern'];
        const traditionalSchemes = ['savillsStyle', 'knightFrankStyle', 'hamptonsStyle', 'chestertonsStyle'];

        if (luxurySchemes.includes(schemeId)) {
            return { heading: 'Playfair Display', body: 'Lato', accent: 'Cormorant Garamond' };
        } else if (modernSchemes.includes(schemeId)) {
            return { heading: 'Inter', body: 'Inter', accent: 'Space Grotesk' };
        } else if (traditionalSchemes.includes(schemeId)) {
            return { heading: 'Georgia', body: 'Arial', accent: 'Times New Roman' };
        }
        return { heading: 'Montserrat', body: 'Open Sans', accent: 'Roboto' };
    }

    /**
     * Generate thumbnail preview for template
     */
    function generateThumbnail(baseTemplate, scheme) {
        // Create SVG thumbnail
        const width = 120;
        const height = 160;

        return `
            <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="${width}" height="${height}" fill="${scheme.background}"/>
                <rect y="0" width="${width}" height="${height * 0.6}" fill="${scheme.primary}" opacity="0.3"/>
                <rect x="8" y="8" width="${width - 16}" height="${height * 0.5}" fill="${scheme.secondary}" opacity="0.5"/>
                <rect x="8" y="${height * 0.65}" width="${width * 0.6}" height="12" fill="${scheme.primary}"/>
                <rect x="8" y="${height * 0.75}" width="${width * 0.8}" height="8" fill="${scheme.text}" opacity="0.3"/>
                <rect x="8" y="${height * 0.85}" width="${width * 0.4}" height="16" rx="4" fill="${scheme.accent}"/>
            </svg>
        `;
    }

    // ============================================================================
    // TEMPLATE CUSTOMIZATION
    // ============================================================================

    let currentTemplate = null;
    let customColors = null;

    /**
     * Select a template for editing
     */
    function selectTemplate(templateId) {
        currentTemplate = generatedTemplates.find(t => t.id === templateId);
        if (currentTemplate) {
            customColors = { ...currentTemplate.colors };
            renderTemplatePreview();
            renderColorEditor();
        }
        return currentTemplate;
    }

    /**
     * Update a color in the current template
     */
    function updateColor(colorKey, value) {
        if (customColors && colorKey in customColors) {
            customColors[colorKey] = value;
            renderTemplatePreview();

            // Dispatch event for live update
            window.dispatchEvent(new CustomEvent('templateColorChanged', {
                detail: { colorKey, value, colors: customColors }
            }));
        }
    }

    /**
     * Apply custom colors to current template
     */
    function applyCustomColors() {
        if (currentTemplate && customColors) {
            currentTemplate.colors = { ...customColors };
            return currentTemplate;
        }
        return null;
    }

    /**
     * Reset colors to original
     */
    function resetColors() {
        if (currentTemplate) {
            const scheme = COLOR_SCHEMES[currentTemplate.schemeId];
            customColors = { ...scheme };
            renderTemplatePreview();
            renderColorEditor();
        }
    }

    // ============================================================================
    // CUSTOM COLORS FIRST - User picks colors before browsing templates
    // ============================================================================

    let userCustomColors = null;
    let customColorsMode = false;

    /**
     * Get the user's custom colors or default
     */
    function getUserColors() {
        return userCustomColors || {
            primary: '#1a365d',
            secondary: '#2c5282',
            accent: '#ed8936',
            background: '#ffffff',
            text: '#2d3748'
        };
    }

    /**
     * Set user's custom colors and regenerate all templates with those colors
     */
    function setUserColors(colors) {
        userCustomColors = { ...colors };
        customColorsMode = true;
        regenerateWithUserColors();
    }

    /**
     * Regenerate all templates using user's custom colors
     */
    function regenerateWithUserColors() {
        if (!userCustomColors) return;

        generatedTemplates = [];
        let id = 1;

        Object.entries(BASE_TEMPLATES).forEach(([baseId, baseTemplate]) => {
            // In custom colors mode, generate each base template with user's colors
            generatedTemplates.push({
                id: `tpl_${id++}`,
                baseId: baseId,
                schemeId: 'custom',
                name: `${baseTemplate.name} - Your Colors`,
                category: baseTemplate.category,
                propertyType: baseTemplate.propertyType,
                format: baseTemplate.format,
                dimensions: baseTemplate.dimensions || { width: 595, height: 842 },
                layout: baseTemplate.layout,
                colors: { ...userCustomColors, name: 'Your Custom Colors' },
                fonts: { heading: 'Montserrat', body: 'Open Sans', accent: 'Roboto' },
                thumbnail: generateThumbnail(baseTemplate, userCustomColors)
            });
        });

        console.log(`Regenerated ${generatedTemplates.length} templates with user colors`);
    }

    /**
     * Exit custom colors mode and restore all templates
     */
    function exitCustomColorsMode() {
        customColorsMode = false;
        userCustomColors = null;
        generateAllTemplates();
    }

    // ============================================================================
    // UI RENDERING
    // ============================================================================

    /**
     * Render the mega template library UI
     */
    function renderTemplateLibrary(container) {
        // Generate templates if not done
        if (generatedTemplates.length === 0) {
            generateAllTemplates();
        }

        const categories = {
            for_sale: { name: 'For Sale', icon: '🏠' },
            for_rent: { name: 'For Rent', icon: '🔑' },
            new_listing: { name: 'New Listing', icon: '✨' },
            price_reduced: { name: 'Price Reduced', icon: '📉' },
            under_offer: { name: 'Under Offer', icon: '🤝' },
            sold: { name: 'Sold', icon: '🎉' },
            property_type: { name: 'Property Types', icon: '🏘️' },
            social: { name: 'Social Media', icon: '📱' },
            marketing: { name: 'Marketing', icon: '📣' }
        };

        const currentColors = getUserColors();

        let html = `
            <div class="mega-template-library">
                <div class="library-header">
                    <h3>Template Library</h3>
                    <span class="template-count">${generatedTemplates.length} templates</span>
                </div>

                <!-- CUSTOM COLORS FIRST PANEL -->
                <div class="custom-colors-panel ${customColorsMode ? 'active' : ''}">
                    <div class="custom-colors-header">
                        <span class="custom-colors-icon">🎨</span>
                        <div class="custom-colors-title">
                            <strong>Start with Your Colors</strong>
                            <small>Set your brand colors, then browse templates</small>
                        </div>
                        <button class="toggle-custom-colors-btn" id="toggleCustomColors">
                            ${customColorsMode ? 'Use Preset Schemes' : 'Use My Colors'}
                        </button>
                    </div>

                    <div class="custom-colors-editor ${customColorsMode ? 'expanded' : ''}" id="customColorsEditor">
                        <div class="custom-color-row">
                            <div class="custom-color-item">
                                <label>Primary</label>
                                <input type="color" id="userPrimary" value="${currentColors.primary}">
                                <input type="text" class="color-hex-input" id="userPrimaryHex" value="${currentColors.primary}">
                            </div>
                            <div class="custom-color-item">
                                <label>Secondary</label>
                                <input type="color" id="userSecondary" value="${currentColors.secondary}">
                                <input type="text" class="color-hex-input" id="userSecondaryHex" value="${currentColors.secondary}">
                            </div>
                            <div class="custom-color-item">
                                <label>Accent</label>
                                <input type="color" id="userAccent" value="${currentColors.accent}">
                                <input type="text" class="color-hex-input" id="userAccentHex" value="${currentColors.accent}">
                            </div>
                        </div>
                        <div class="custom-color-row">
                            <div class="custom-color-item">
                                <label>Background</label>
                                <input type="color" id="userBackground" value="${currentColors.background}">
                                <input type="text" class="color-hex-input" id="userBackgroundHex" value="${currentColors.background}">
                            </div>
                            <div class="custom-color-item">
                                <label>Text</label>
                                <input type="color" id="userText" value="${currentColors.text}">
                                <input type="text" class="color-hex-input" id="userTextHex" value="${currentColors.text}">
                            </div>
                            <div class="custom-color-item preview">
                                <label>Preview</label>
                                <div class="color-preview-strip" id="colorPreviewStrip">
                                    <span style="background: ${currentColors.primary}"></span>
                                    <span style="background: ${currentColors.secondary}"></span>
                                    <span style="background: ${currentColors.accent}"></span>
                                    <span style="background: ${currentColors.background}; border: 1px solid #ddd;"></span>
                                    <span style="background: ${currentColors.text}"></span>
                                </div>
                            </div>
                        </div>
                        <div class="custom-color-actions">
                            <div class="quick-scheme-buttons">
                                <span>Quick start:</span>
                                ${Object.entries(COLOR_SCHEMES).slice(0, 8).map(([id, scheme]) => `
                                    <button class="quick-scheme-btn" data-scheme="${id}" title="${scheme.name}">
                                        <span style="background: ${scheme.primary}"></span>
                                        <span style="background: ${scheme.accent}"></span>
                                    </button>
                                `).join('')}
                            </div>
                            <button class="apply-custom-colors-btn" id="applyCustomColors">
                                Apply Colors & Browse Templates
                            </button>
                        </div>
                    </div>
                </div>

                ${customColorsMode ? `
                    <div class="custom-mode-indicator">
                        <span>Showing all templates with your colors</span>
                        <button class="exit-custom-mode-btn" id="exitCustomMode">Show All Color Schemes</button>
                    </div>
                ` : ''}

                <div class="library-search">
                    <input type="text" id="templateSearch" placeholder="Search templates..." class="search-input">
                </div>

                <div class="library-filters">
                    <div class="filter-group">
                        <label>Category</label>
                        <select id="categoryFilter" class="filter-select">
                            <option value="all">All Categories</option>
                            ${Object.entries(categories).map(([id, cat]) =>
                                `<option value="${id}">${cat.icon} ${cat.name}</option>`
                            ).join('')}
                        </select>
                    </div>

                    ${!customColorsMode ? `
                        <div class="filter-group">
                            <label>Color Scheme</label>
                            <select id="schemeFilter" class="filter-select">
                                <option value="all">All Schemes</option>
                                ${Object.entries(COLOR_SCHEMES).map(([id, scheme]) =>
                                    `<option value="${id}">${scheme.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                    ` : ''}

                    <div class="filter-group">
                        <label>Format</label>
                        <select id="formatFilter" class="filter-select">
                            <option value="all">All Formats</option>
                            <option value="brochure">Brochure</option>
                            <option value="instagram_post">Instagram Post</option>
                            <option value="instagram_story">Instagram Story</option>
                            <option value="facebook_post">Facebook Post</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="twitter">Twitter/X</option>
                            <option value="flyer">Flyer</option>
                        </select>
                    </div>
                </div>

                <div class="library-grid" id="templateGrid">
                    <!-- Templates rendered here -->
                </div>
            </div>
        `;

        container.innerHTML = html;
        renderTemplateGrid(container.querySelector('#templateGrid'));
        initLibraryEvents(container);
        initCustomColorsEvents(container);
    }

    /**
     * Initialize custom colors panel events
     */
    function initCustomColorsEvents(container) {
        const toggleBtn = container.querySelector('#toggleCustomColors');
        const editor = container.querySelector('#customColorsEditor');
        const applyBtn = container.querySelector('#applyCustomColors');
        const exitBtn = container.querySelector('#exitCustomMode');

        // Toggle expand/collapse custom colors panel
        toggleBtn?.addEventListener('click', () => {
            const panel = container.querySelector('.custom-colors-panel');
            if (customColorsMode) {
                // Exit custom mode
                exitCustomColorsMode();
                renderTemplateLibrary(container.parentElement || container);
            } else {
                // Expand panel
                editor.classList.toggle('expanded');
                panel.classList.toggle('active');
            }
        });

        // Apply custom colors
        applyBtn?.addEventListener('click', () => {
            const colors = {
                primary: container.querySelector('#userPrimary').value,
                secondary: container.querySelector('#userSecondary').value,
                accent: container.querySelector('#userAccent').value,
                background: container.querySelector('#userBackground').value,
                text: container.querySelector('#userText').value
            };
            setUserColors(colors);
            renderTemplateLibrary(container.parentElement || container);
        });

        // Exit custom mode
        exitBtn?.addEventListener('click', () => {
            exitCustomColorsMode();
            renderTemplateLibrary(container.parentElement || container);
        });

        // Color input sync (color picker <-> hex input)
        const colorFields = ['Primary', 'Secondary', 'Accent', 'Background', 'Text'];
        colorFields.forEach(field => {
            const colorInput = container.querySelector(`#user${field}`);
            const hexInput = container.querySelector(`#user${field}Hex`);

            colorInput?.addEventListener('input', (e) => {
                hexInput.value = e.target.value;
                updateColorPreview(container);
            });

            hexInput?.addEventListener('change', (e) => {
                const val = e.target.value;
                if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                    colorInput.value = val;
                    updateColorPreview(container);
                }
            });
        });

        // Quick scheme buttons
        container.querySelectorAll('.quick-scheme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const scheme = COLOR_SCHEMES[btn.dataset.scheme];
                if (scheme) {
                    container.querySelector('#userPrimary').value = scheme.primary;
                    container.querySelector('#userPrimaryHex').value = scheme.primary;
                    container.querySelector('#userSecondary').value = scheme.secondary;
                    container.querySelector('#userSecondaryHex').value = scheme.secondary;
                    container.querySelector('#userAccent').value = scheme.accent;
                    container.querySelector('#userAccentHex').value = scheme.accent;
                    container.querySelector('#userBackground').value = scheme.background;
                    container.querySelector('#userBackgroundHex').value = scheme.background;
                    container.querySelector('#userText').value = scheme.text;
                    container.querySelector('#userTextHex').value = scheme.text;
                    updateColorPreview(container);
                }
            });
        });
    }

    /**
     * Update the color preview strip
     */
    function updateColorPreview(container) {
        const preview = container.querySelector('#colorPreviewStrip');
        if (!preview) return;

        const colors = {
            primary: container.querySelector('#userPrimary')?.value || '#1a365d',
            secondary: container.querySelector('#userSecondary')?.value || '#2c5282',
            accent: container.querySelector('#userAccent')?.value || '#ed8936',
            background: container.querySelector('#userBackground')?.value || '#ffffff',
            text: container.querySelector('#userText')?.value || '#2d3748'
        };

        preview.innerHTML = `
            <span style="background: ${colors.primary}"></span>
            <span style="background: ${colors.secondary}"></span>
            <span style="background: ${colors.accent}"></span>
            <span style="background: ${colors.background}; border: 1px solid #ddd;"></span>
            <span style="background: ${colors.text}"></span>
        `;
    }

    /**
     * Render template grid
     */
    function renderTemplateGrid(container, filters = {}) {
        let filtered = generatedTemplates;

        // Apply filters
        if (filters.category && filters.category !== 'all') {
            filtered = filtered.filter(t => t.category === filters.category);
        }
        if (filters.scheme && filters.scheme !== 'all') {
            filtered = filtered.filter(t => t.schemeId === filters.scheme);
        }
        if (filters.format && filters.format !== 'all') {
            filtered = filtered.filter(t => t.format === filters.format);
        }
        if (filters.search) {
            const term = filters.search.toLowerCase();
            filtered = filtered.filter(t =>
                t.name.toLowerCase().includes(term) ||
                t.category.toLowerCase().includes(term)
            );
        }

        // Limit display for performance
        const displayLimit = 50;
        const displayed = filtered.slice(0, displayLimit);

        container.innerHTML = `
            ${displayed.map(template => `
                <div class="template-card" data-template-id="${template.id}">
                    <div class="template-thumbnail">
                        ${template.thumbnail}
                    </div>
                    <div class="template-info">
                        <div class="template-name">${template.name.split(' - ')[0]}</div>
                        <div class="template-scheme">${template.colors.name || template.schemeId}</div>
                    </div>
                    <div class="template-colors">
                        <span style="background: ${template.colors.primary}"></span>
                        <span style="background: ${template.colors.secondary}"></span>
                        <span style="background: ${template.colors.accent}"></span>
                    </div>
                </div>
            `).join('')}
            ${filtered.length > displayLimit ? `
                <div class="load-more-notice">
                    Showing ${displayLimit} of ${filtered.length} templates.
                    Use filters to narrow down.
                </div>
            ` : ''}
        `;

        // Add click events
        container.querySelectorAll('.template-card').forEach(card => {
            card.addEventListener('click', () => {
                selectTemplate(card.dataset.templateId);
                showTemplateEditor(card.dataset.templateId);
            });
        });
    }

    /**
     * Initialize library events
     */
    function initLibraryEvents(container) {
        const searchInput = container.querySelector('#templateSearch');
        const categoryFilter = container.querySelector('#categoryFilter');
        const schemeFilter = container.querySelector('#schemeFilter');
        const formatFilter = container.querySelector('#formatFilter');
        const grid = container.querySelector('#templateGrid');

        const applyFilters = () => {
            renderTemplateGrid(grid, {
                search: searchInput.value,
                category: categoryFilter.value,
                scheme: schemeFilter.value,
                format: formatFilter.value
            });
        };

        searchInput?.addEventListener('input', applyFilters);
        categoryFilter?.addEventListener('change', applyFilters);
        schemeFilter?.addEventListener('change', applyFilters);
        formatFilter?.addEventListener('change', applyFilters);
    }

    /**
     * Show template editor modal
     */
    function showTemplateEditor(templateId) {
        const template = selectTemplate(templateId);
        if (!template) return;

        // Remove existing modal
        document.querySelector('.template-editor-modal')?.remove();

        const modal = document.createElement('div');
        modal.className = 'template-editor-modal';
        modal.innerHTML = `
            <div class="template-editor">
                <div class="editor-header">
                    <h3>Customize Template</h3>
                    <button class="close-btn">&times;</button>
                </div>

                <div class="editor-body">
                    <div class="editor-preview" id="templatePreview">
                        <!-- Preview rendered here -->
                    </div>

                    <div class="editor-controls">
                        <h4>Edit Colors</h4>
                        <div class="color-editors" id="colorEditors">
                            <!-- Color editors rendered here -->
                        </div>

                        <div class="preset-schemes">
                            <h4>Quick Color Schemes</h4>
                            <div class="scheme-grid">
                                ${Object.entries(COLOR_SCHEMES).slice(0, 12).map(([id, scheme]) => `
                                    <button class="scheme-btn" data-scheme="${id}" title="${scheme.name}">
                                        <span style="background: ${scheme.primary}"></span>
                                        <span style="background: ${scheme.secondary}"></span>
                                        <span style="background: ${scheme.accent}"></span>
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <div class="editor-actions">
                            <button class="btn btn-secondary" id="resetColorsBtn">Reset</button>
                            <button class="btn btn-primary" id="applyTemplateBtn">Apply Template</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Render preview and color editors
        renderTemplatePreview(modal.querySelector('#templatePreview'));
        renderColorEditor(modal.querySelector('#colorEditors'));

        // Event listeners
        modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        modal.querySelector('#resetColorsBtn').addEventListener('click', () => {
            resetColors();
            renderTemplatePreview(modal.querySelector('#templatePreview'));
            renderColorEditor(modal.querySelector('#colorEditors'));
        });

        modal.querySelector('#applyTemplateBtn').addEventListener('click', () => {
            applyCustomColors();
            applyTemplateToCanvas();
            modal.remove();
        });

        // Scheme buttons
        modal.querySelectorAll('.scheme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const scheme = COLOR_SCHEMES[btn.dataset.scheme];
                if (scheme) {
                    customColors = { ...scheme };
                    renderTemplatePreview(modal.querySelector('#templatePreview'));
                    renderColorEditor(modal.querySelector('#colorEditors'));
                }
            });
        });
    }

    /**
     * Render template preview
     */
    function renderTemplatePreview(container) {
        if (!container || !currentTemplate) return;

        const colors = customColors || currentTemplate.colors;
        const dims = currentTemplate.dimensions || { width: 200, height: 280 };
        const scale = Math.min(200 / dims.width, 280 / dims.height);

        container.innerHTML = `
            <svg viewBox="0 0 ${dims.width} ${dims.height}"
                 style="width: ${dims.width * scale}px; height: ${dims.height * scale}px; border: 1px solid #ddd;">
                <!-- Background -->
                <rect width="${dims.width}" height="${dims.height}" fill="${colors.background}"/>

                <!-- Hero image area -->
                <rect y="0" width="${dims.width}" height="${dims.height * 0.55}" fill="${colors.primary}" opacity="0.2"/>
                <rect x="20" y="20" width="${dims.width - 40}" height="${dims.height * 0.45}" fill="${colors.secondary}" opacity="0.4"/>

                <!-- Title bar -->
                <rect x="20" y="${dims.height * 0.6}" width="${dims.width * 0.7}" height="20" fill="${colors.primary}"/>

                <!-- Subtitle -->
                <rect x="20" y="${dims.height * 0.68}" width="${dims.width * 0.5}" height="10" fill="${colors.text}" opacity="0.5"/>

                <!-- Price badge -->
                <rect x="${dims.width - 80}" y="${dims.height * 0.58}" width="60" height="25" rx="4" fill="${colors.accent}"/>

                <!-- Features strip -->
                <rect x="20" y="${dims.height * 0.78}" width="${dims.width - 40}" height="30" fill="${colors.secondary}" opacity="0.2"/>

                <!-- Icons -->
                <circle cx="45" cy="${dims.height * 0.85}" r="8" fill="${colors.primary}" opacity="0.5"/>
                <circle cx="85" cy="${dims.height * 0.85}" r="8" fill="${colors.primary}" opacity="0.5"/>
                <circle cx="125" cy="${dims.height * 0.85}" r="8" fill="${colors.primary}" opacity="0.5"/>

                <!-- CTA -->
                <rect x="20" y="${dims.height * 0.92}" width="80" height="20" rx="4" fill="${colors.accent}"/>
            </svg>
            <div class="preview-name">${currentTemplate.name}</div>
        `;
    }

    /**
     * Render color editor controls
     */
    function renderColorEditor(container) {
        if (!container || !customColors) return;

        const colorLabels = {
            primary: 'Primary',
            secondary: 'Secondary',
            accent: 'Accent',
            background: 'Background',
            text: 'Text'
        };

        container.innerHTML = Object.entries(colorLabels).map(([key, label]) => `
            <div class="color-editor-row">
                <label>${label}</label>
                <div class="color-input-wrapper">
                    <input type="color"
                           id="color_${key}"
                           value="${customColors[key]}"
                           data-color-key="${key}">
                    <input type="text"
                           class="color-hex"
                           value="${customColors[key]}"
                           data-color-key="${key}">
                </div>
            </div>
        `).join('');

        // Add event listeners
        container.querySelectorAll('input[type="color"]').forEach(input => {
            input.addEventListener('input', (e) => {
                const key = e.target.dataset.colorKey;
                updateColor(key, e.target.value);
                container.querySelector(`input.color-hex[data-color-key="${key}"]`).value = e.target.value;
                renderTemplatePreview(document.querySelector('#templatePreview'));
            });
        });

        container.querySelectorAll('input.color-hex').forEach(input => {
            input.addEventListener('change', (e) => {
                const key = e.target.dataset.colorKey;
                const value = e.target.value;
                if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                    updateColor(key, value);
                    container.querySelector(`input[type="color"][data-color-key="${key}"]`).value = value;
                    renderTemplatePreview(document.querySelector('#templatePreview'));
                }
            });
        });
    }

    /**
     * Apply template to canvas
     */
    function applyTemplateToCanvas() {
        if (!currentTemplate) return;

        const colors = customColors || currentTemplate.colors;

        // Apply colors to CSS variables
        const root = document.documentElement;
        root.style.setProperty('--template-primary', colors.primary);
        root.style.setProperty('--template-secondary', colors.secondary);
        root.style.setProperty('--template-accent', colors.accent);
        root.style.setProperty('--template-background', colors.background);
        root.style.setProperty('--template-text', colors.text);

        // Apply to canvas
        const canvas = document.getElementById('brochureCanvas') ||
                      document.querySelector('.page-canvas');
        if (canvas) {
            canvas.style.backgroundColor = colors.background;
            canvas.style.color = colors.text;
        }

        // Update any existing elements
        document.querySelectorAll('.brochure-element').forEach(el => {
            if (el.classList.contains('header-element')) {
                el.style.backgroundColor = colors.primary;
                el.style.color = colors.background;
            }
            if (el.classList.contains('accent-element')) {
                el.style.backgroundColor = colors.accent;
            }
        });

        // Dispatch event
        window.dispatchEvent(new CustomEvent('templateApplied', {
            detail: { template: currentTemplate, colors }
        }));

        showToast(`Template "${currentTemplate.name}" applied!`);
    }

    /**
     * Show toast notification
     */
    function showToast(message) {
        if (typeof window.showToast === 'function') {
            window.showToast(message);
        }
    }

    // ============================================================================
    // INITIALIZATION
    // ============================================================================

    // Generate templates on load
    generateAllTemplates();

    // Export to global scope
    window.MegaTemplateLibrary = {
        COLOR_SCHEMES,
        BASE_TEMPLATES,
        getTemplates: () => generatedTemplates,
        getTemplateCount: () => generatedTemplates.length,
        selectTemplate,
        updateColor,
        applyCustomColors,
        resetColors,
        renderLibrary: renderTemplateLibrary,
        showEditor: showTemplateEditor,
        applyToCanvas: applyTemplateToCanvas,
        regenerate: generateAllTemplates,
        // Custom colors first
        setUserColors,
        getUserColors,
        isCustomColorsMode: () => customColorsMode,
        exitCustomColorsMode
    };

    console.log(`Mega Template Library loaded: ${generatedTemplates.length} templates (${Object.keys(BASE_TEMPLATES).length} bases × ${Object.keys(COLOR_SCHEMES).length} schemes)`);

})();
