/**
 * Brochure Design Templates System - UK ESTATE AGENCY EDITION
 *
 * Professional templates based on top UK estate agencies' authentic brand colors
 * Enhanced with graphic design elements: borders, corners, patterns, gradients
 *
 * Author: Claude Code
 * Date: October 20, 2025
 */

// ============================================================================
// TEMPLATE DEFINITIONS - INSPIRED BY TOP UK ESTATE AGENCIES
// ============================================================================

const BrochureTemplates = {

    // FREE TEMPLATES - All UK Agency Templates Unlocked for Testing!
    free: {

        savills_classic: {
            id: 'savills_classic',
            name: 'Savills Classic',
            tier: 'free',
            description: 'Savills signature cream, red & yellow elegance',
            preview: '🏛️',
            styles: {
                pageBackground: '#FAF9F6', // Savills cream
                accentColor: '#4A1420', // Savills red
                accentSecondary: '#FFE850', // Savills yellow
                textPrimary: '#2d2d2d',
                textSecondary: '#6b7280',
                borderStyle: 'solid',
                borderWidth: '2px',
                borderColor: '#4A1420',
                cornerAccent: 'none',
                headerStyle: 'classic',
                footerStyle: 'minimal',
                gradient: 'none'
            }
        },

        rightmove_fresh: {
            id: 'rightmove_fresh',
            name: 'Rightmove Fresh',
            tier: 'free',
            description: 'Rightmove turquoise & cherry red vibrancy',
            preview: '🏠',
            styles: {
                pageBackground: '#FFFFFF',
                accentColor: '#E94B6F', // Cherry red
                accentSecondary: '#00B2A9', // Turquoise
                textPrimary: '#1a1a1a',
                textSecondary: '#666666',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#00B2A9',
                cornerAccent: 'none',
                gradient: 'subtle-turquoise'
            }
        },

        zoopla_purple: {
            id: 'zoopla_purple',
            name: 'Zoopla Purple',
            tier: 'free',
            description: 'Zoopla vibrant purple sophistication',
            preview: '💜',
            styles: {
                pageBackground: '#FDFCFF',
                accentColor: '#7B2CBF', // Zoopla bright purple
                accentSecondary: '#C77DFF', // Lighter purple
                textPrimary: '#2d2033',
                textSecondary: '#6b5d73',
                borderStyle: 'solid',
                borderWidth: '2px',
                borderColor: '#7B2CBF',
                cornerAccent: 'none',
                gradient: 'purple-fade'
            }
        },

        foxtons_iconic: {
            id: 'foxtons_iconic',
            name: 'Foxtons Iconic',
            tier: 'free',
            description: 'Foxtons British Racing Green & yellow energy',
            preview: '🎾',
            styles: {
                pageBackground: '#FCFCFA',
                accentColor: '#004225', // British Racing Green
                accentSecondary: '#FFE500', // Bright yellow
                textPrimary: '#1a2f1f',
                textSecondary: '#4a5f52',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#004225',
                cornerAccent: 'none',
                gradient: 'green-energy'
            }
        },

        knight_frank_prestige: {
            id: 'knight_frank_prestige',
            name: 'Knight Frank Prestige',
            tier: 'free',
            description: 'Knight Frank rich red & heritage green elegance',
            preview: '🏰',
            styles: {
                pageBackground: '#FFFEFA',
                accentColor: '#4A1420', // Knight Frank red
                accentSecondary: '#2D5832', // Heritage green
                textPrimary: '#1a1411',
                textSecondary: '#4a3f38',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#4A1420',
                cornerAccent: 'none',
                gradient: 'prestige-red'
            }
        },

        hamptons_refined: {
            id: 'hamptons_refined',
            name: 'Hamptons Refined',
            tier: 'free',
            description: 'Hamptons navy & champagne sophistication',
            preview: '🥂',
            styles: {
                pageBackground: '#FFFDF9',
                accentColor: '#1B3A57', // Navy
                accentSecondary: '#E8D5B5', // Champagne
                textPrimary: '#1a2433',
                textSecondary: '#4a5565',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#1B3A57',
                cornerAccent: 'none',
                gradient: 'navy-champagne'
            }
        },

        winkworth_heritage: {
            id: 'winkworth_heritage',
            name: 'Winkworth Heritage',
            tier: 'free',
            description: 'Winkworth traditional burgundy & gold heritage',
            preview: '🎩',
            styles: {
                pageBackground: '#FFFEF8',
                accentColor: '#6B1839', // Burgundy
                accentSecondary: '#D4AF37', // Gold
                textPrimary: '#2d1520',
                textSecondary: '#5a3d45',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#6B1839',
                cornerAccent: 'none',
                gradient: 'burgundy-luxury'
            }
        },

        strutt_parker_country: {
            id: 'strutt_parker_country',
            name: 'Strutt & Parker Country',
            tier: 'free',
            description: 'Strutt & Parker country house green & cream',
            preview: '🌳',
            styles: {
                pageBackground: '#F9F8F3',
                accentColor: '#2B5940', // Country green
                accentSecondary: '#B8A888', // Warm cream
                textPrimary: '#1f2d24',
                textSecondary: '#4a5650',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#2B5940',
                cornerAccent: 'none',
                gradient: 'country-green'
            }
        },

        chestertons_london: {
            id: 'chestertons_london',
            name: 'Chestertons London',
            tier: 'free',
            description: 'Chestertons metropolitan navy & gold',
            preview: '🏙️',
            styles: {
                pageBackground: '#FCFCFC',
                accentColor: '#0F2B52', // Deep navy
                accentSecondary: '#C9A961', // Metropolitan gold
                textPrimary: '#1a1f2e',
                textSecondary: '#4a5162',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#0F2B52',
                cornerAccent: 'none',
                gradient: 'london-navy'
            }
        },

        luxury_black_gold: {
            id: 'luxury_black_gold',
            name: 'Luxury Black & Gold',
            tier: 'free',
            description: 'Ultra-premium black with 24k gold accents',
            preview: '⬛',
            styles: {
                pageBackground: '#FAFAFA',
                accentColor: '#000000',
                accentSecondary: '#FFD700', // 24k gold
                textPrimary: '#1a1a1a',
                textSecondary: '#404040',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#000000',
                cornerAccent: 'none',
                gradient: 'black-gold-shimmer'
            }
        },

        coastal_blue: {
            id: 'coastal_blue',
            name: 'Coastal Blue',
            tier: 'free',
            description: 'Seaside property azure & sand tones',
            preview: '🌊',
            styles: {
                pageBackground: '#F8FBFD',
                accentColor: '#0077BE', // Azure
                accentSecondary: '#E8D5B7', // Sand
                textPrimary: '#1a3647',
                textSecondary: '#4a6273',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#0077BE',
                cornerAccent: 'none',
                gradient: 'ocean-breeze'
            }
        },

        urban_slate: {
            id: 'urban_slate',
            name: 'Urban Slate',
            tier: 'free',
            description: 'Contemporary city slate & electric blue',
            preview: '🏢',
            styles: {
                pageBackground: '#F9FAFB',
                accentColor: '#334155', // Slate
                accentSecondary: '#3B82F6', // Electric blue
                textPrimary: '#1e293b',
                textSecondary: '#64748b',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#3B82F6',
                cornerAccent: 'none',
                gradient: 'slate-urban'
            }
        },

        countryside_sage: {
            id: 'countryside_sage',
            name: 'Countryside Sage',
            tier: 'free',
            description: 'Rural property sage green & natural stone',
            preview: '🌾',
            styles: {
                pageBackground: '#F7F9F5',
                accentColor: '#6B8E6F', // Sage
                accentSecondary: '#B8A890', // Stone
                textPrimary: '#2d3d2f',
                textSecondary: '#5a6b5c',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#6B8E6F',
                cornerAccent: 'none',
                gradient: 'sage-countryside'
            }
        },

        period_burgundy: {
            id: 'period_burgundy',
            name: 'Period Burgundy',
            tier: 'free',
            description: 'Historic property deep burgundy & antique gold',
            preview: '🏛️',
            styles: {
                pageBackground: '#FFFEF9',
                accentColor: '#6B1F3A', // Deep burgundy
                accentSecondary: '#BF9B30', // Antique gold
                textPrimary: '#3d1a24',
                textSecondary: '#6b495a',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#6B1F3A',
                cornerAccent: 'none',
                gradient: 'burgundy-period'
            }
        },

        // ============================================================================
        // DOORSTEP PROFESSIONAL TEMPLATES
        // ============================================================================

        doorstep_classic: {
            id: 'doorstep_classic',
            name: 'Doorstep Classic',
            tier: 'free',
            description: 'Professional burgundy & cream estate agent styling',
            preview: '🏠',
            styles: {
                pageBackground: '#FAF9F6',
                accentColor: '#722F37', // Doorstep burgundy
                accentSecondary: '#F8F4E8', // Doorstep cream
                textPrimary: '#2d2d2d',
                textSecondary: '#6b7280',
                borderStyle: 'solid',
                borderWidth: '0',
                borderColor: '#722F37',
                cornerAccent: 'doorstep',
                headerStyle: 'elegant',
                footerStyle: 'branded',
                gradient: 'doorstep-subtle',
                fontHeading: 'Playfair Display',
                fontBody: 'Inter'
            }
        },

        doorstep_modern: {
            id: 'doorstep_modern',
            name: 'Doorstep Modern',
            tier: 'free',
            description: 'Clean modern Doorstep styling with white background',
            preview: '✨',
            styles: {
                pageBackground: '#ffffff',
                accentColor: '#722F37',
                accentSecondary: '#8B4049',
                textPrimary: '#333333',
                textSecondary: '#666666',
                borderStyle: 'none',
                borderWidth: '0',
                borderColor: 'transparent',
                cornerAccent: 'minimal',
                headerStyle: 'modern',
                footerStyle: 'minimal',
                gradient: 'none',
                fontHeading: 'Playfair Display',
                fontBody: 'Inter'
            }
        },

        doorstep_luxury: {
            id: 'doorstep_luxury',
            name: 'Doorstep Luxury',
            tier: 'free',
            description: 'Premium dark theme with gold accents',
            preview: '👑',
            styles: {
                pageBackground: '#1a1a1a',
                accentColor: '#D4AF37', // Gold
                accentSecondary: '#722F37',
                textPrimary: '#F8F4E8',
                textSecondary: '#a0a0a0',
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: '#D4AF37',
                cornerAccent: 'gold-corners',
                headerStyle: 'luxury',
                footerStyle: 'gold',
                gradient: 'dark-luxury',
                fontHeading: 'Playfair Display',
                fontBody: 'Inter'
            }
        },

        doorstep_heritage: {
            id: 'doorstep_heritage',
            name: 'Doorstep Heritage',
            tier: 'free',
            description: 'Traditional British heritage styling',
            preview: '🏰',
            styles: {
                pageBackground: '#F5F1EB',
                accentColor: '#4A1F24', // Deep burgundy
                accentSecondary: '#8B7355', // Tan
                textPrimary: '#2d2420',
                textSecondary: '#5a5048',
                borderStyle: 'double',
                borderWidth: '4px',
                borderColor: '#4A1F24',
                cornerAccent: 'classic',
                headerStyle: 'heritage',
                footerStyle: 'traditional',
                gradient: 'heritage-warm',
                fontHeading: 'Playfair Display',
                fontBody: 'Georgia'
            }
        },

        manhattan_platinum: {
            id: 'manhattan_platinum',
            name: 'Manhattan Platinum',
            tier: 'free',
            description: 'International luxury platinum & charcoal',
            preview: '⚪',
            styles: {
                pageBackground: '#FCFCFC',
                accentColor: '#2C3539', // Charcoal
                accentSecondary: '#C0C0C0', // Platinum
                textPrimary: '#1a1d1f',
                textSecondary: '#505458',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#C0C0C0',
                cornerAccent: 'none',
                gradient: 'platinum-shimmer'
            }
        },

        rose_garden: {
            id: 'rose_garden',
            name: 'Rose Garden',
            tier: 'free',
            description: 'Garden property soft rose & forest green',
            preview: '🌹',
            styles: {
                pageBackground: '#FFF9F9',
                accentColor: '#9B4F5C', // Rose
                accentSecondary: '#2D5832', // Forest green
                textPrimary: '#3d2b2f',
                textSecondary: '#6b5459',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#9B4F5C',
                cornerAccent: 'none',
                gradient: 'rose-garden'
            }
        },

        alpine_snow: {
            id: 'alpine_snow',
            name: 'Alpine Snow',
            tier: 'free',
            description: 'Mountain property crisp white & alpine blue',
            preview: '🏔️',
            styles: {
                pageBackground: '#FFFFFF',
                accentColor: '#2E5266', // Alpine blue
                accentSecondary: '#D1E8E2', // Snow
                textPrimary: '#1a2933',
                textSecondary: '#4a5f6b',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#2E5266',
                cornerAccent: 'none',
                gradient: 'alpine-crisp'
            }
        },

        tuscan_terracotta: {
            id: 'tuscan_terracotta',
            name: 'Tuscan Terracotta',
            tier: 'free',
            description: 'Mediterranean villa terracotta & olive',
            preview: '🍇',
            styles: {
                pageBackground: '#FBF9F6',
                accentColor: '#C1440E', // Terracotta
                accentSecondary: '#828E36', // Olive
                textPrimary: '#3d2817',
                textSecondary: '#6b5d4f',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#C1440E',
                cornerAccent: 'none',
                gradient: 'tuscan-warmth'
            }
        },

        mayfair_emerald: {
            id: 'mayfair_emerald',
            name: 'Mayfair Emerald',
            tier: 'free',
            description: 'Prime London emerald & champagne luxury',
            preview: '💎',
            styles: {
                pageBackground: '#F9F8F5',
                accentColor: '#1B4D3E', // Emerald
                accentSecondary: '#E8D5B5', // Champagne
                textPrimary: '#1B2E25',
                textSecondary: '#4a5f52',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#1B4D3E',
                cornerAccent: 'none',
                gradient: 'emerald-luxury'
            }
        },

        // ============================================================================
        // MODERN MINIMALIST TEMPLATES
        // ============================================================================

        minimal_white: {
            id: 'minimal_white',
            name: 'Pure White',
            tier: 'free',
            description: 'Clean minimalist design with maximum whitespace',
            preview: '⬜',
            category: 'minimalist',
            styles: {
                pageBackground: '#FFFFFF',
                accentColor: '#000000',
                accentSecondary: '#F5F5F5',
                textPrimary: '#1a1a1a',
                textSecondary: '#6b6b6b',
                borderStyle: 'none',
                borderWidth: '0',
                borderColor: 'transparent',
                cornerAccent: 'none',
                gradient: 'none'
            }
        },

        minimal_mono: {
            id: 'minimal_mono',
            name: 'Monochrome',
            tier: 'free',
            description: 'Elegant black and white contrast',
            preview: '⬛',
            category: 'minimalist',
            styles: {
                pageBackground: '#FFFFFF',
                accentColor: '#1a1a1a',
                accentSecondary: '#666666',
                textPrimary: '#000000',
                textSecondary: '#4a4a4a',
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: '#000000',
                cornerAccent: 'none',
                gradient: 'none'
            }
        },

        minimal_gray: {
            id: 'minimal_gray',
            name: 'Soft Gray',
            tier: 'free',
            description: 'Subtle gray tones for understated elegance',
            preview: '🔲',
            category: 'minimalist',
            styles: {
                pageBackground: '#FAFAFA',
                accentColor: '#374151',
                accentSecondary: '#E5E7EB',
                textPrimary: '#1F2937',
                textSecondary: '#6B7280',
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: '#E5E7EB',
                cornerAccent: 'none',
                gradient: 'none'
            }
        },

        minimal_sand: {
            id: 'minimal_sand',
            name: 'Sand Stone',
            tier: 'free',
            description: 'Warm sandy neutrals',
            preview: '🏜️',
            category: 'minimalist',
            styles: {
                pageBackground: '#FAF8F5',
                accentColor: '#78716C',
                accentSecondary: '#E7E5E4',
                textPrimary: '#44403C',
                textSecondary: '#78716C',
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: '#D6D3D1',
                cornerAccent: 'none',
                gradient: 'none'
            }
        },

        minimal_charcoal: {
            id: 'minimal_charcoal',
            name: 'Charcoal',
            tier: 'free',
            description: 'Dark sophisticated minimal',
            preview: '🖤',
            category: 'minimalist',
            styles: {
                pageBackground: '#F9FAFB',
                accentColor: '#1F2937',
                accentSecondary: '#D1D5DB',
                textPrimary: '#111827',
                textSecondary: '#4B5563',
                borderStyle: 'solid',
                borderWidth: '2px',
                borderColor: '#1F2937',
                cornerAccent: 'none',
                gradient: 'none'
            }
        },

        // ============================================================================
        // BOLD CONTEMPORARY TEMPLATES
        // ============================================================================

        bold_coral: {
            id: 'bold_coral',
            name: 'Coral Burst',
            tier: 'free',
            description: 'Vibrant coral with teal accents',
            preview: '🪸',
            category: 'bold',
            styles: {
                pageBackground: '#FFFBFA',
                accentColor: '#FF6B6B',
                accentSecondary: '#4ECDC4',
                textPrimary: '#2D3436',
                textSecondary: '#636E72',
                borderStyle: 'solid',
                borderWidth: '4px',
                borderColor: '#FF6B6B',
                cornerAccent: 'none',
                gradient: 'coral-teal'
            }
        },

        bold_electric: {
            id: 'bold_electric',
            name: 'Electric Blue',
            tier: 'free',
            description: 'Bold blue energy with cyan highlights',
            preview: '⚡',
            category: 'bold',
            styles: {
                pageBackground: '#F8FAFF',
                accentColor: '#0066FF',
                accentSecondary: '#00D4FF',
                textPrimary: '#0A1929',
                textSecondary: '#3D5A80',
                borderStyle: 'solid',
                borderWidth: '4px',
                borderColor: '#0066FF',
                cornerAccent: 'none',
                gradient: 'electric-blue'
            }
        },

        bold_sunset: {
            id: 'bold_sunset',
            name: 'Sunset Flame',
            tier: 'free',
            description: 'Warm orange and magenta sunset vibes',
            preview: '🌅',
            category: 'bold',
            styles: {
                pageBackground: '#FFFAF5',
                accentColor: '#FF512F',
                accentSecondary: '#DD2476',
                textPrimary: '#2D1B1B',
                textSecondary: '#6B4444',
                borderStyle: 'solid',
                borderWidth: '4px',
                borderColor: '#FF512F',
                cornerAccent: 'none',
                gradient: 'sunset-flame'
            }
        },

        bold_neon: {
            id: 'bold_neon',
            name: 'Neon Nights',
            tier: 'free',
            description: 'Electric pink and cyan pop',
            preview: '🌃',
            category: 'bold',
            styles: {
                pageBackground: '#0F0F1A',
                accentColor: '#FF00FF',
                accentSecondary: '#00FFFF',
                textPrimary: '#FFFFFF',
                textSecondary: '#B8B8D0',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#FF00FF',
                cornerAccent: 'none',
                gradient: 'neon-glow'
            }
        },

        bold_lime: {
            id: 'bold_lime',
            name: 'Lime Fresh',
            tier: 'free',
            description: 'Energetic lime green with navy',
            preview: '🍋',
            category: 'bold',
            styles: {
                pageBackground: '#F8FFF8',
                accentColor: '#84CC16',
                accentSecondary: '#1E3A5F',
                textPrimary: '#1A2E1A',
                textSecondary: '#3D5A3D',
                borderStyle: 'solid',
                borderWidth: '4px',
                borderColor: '#84CC16',
                cornerAccent: 'none',
                gradient: 'lime-navy'
            }
        },

        // ============================================================================
        // LUXURY TEMPLATES
        // ============================================================================

        luxury_gold: {
            id: 'luxury_gold',
            name: 'Black & Gold',
            tier: 'free',
            description: 'Opulent black with gold accents',
            preview: '🏆',
            category: 'luxury',
            styles: {
                pageBackground: '#1A1A1A',
                accentColor: '#D4AF37',
                accentSecondary: '#C9B037',
                textPrimary: '#FFFFFF',
                textSecondary: '#B0B0B0',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#D4AF37',
                cornerAccent: 'none',
                gradient: 'gold-shimmer'
            }
        },

        luxury_marble: {
            id: 'luxury_marble',
            name: 'Marble Elegance',
            tier: 'free',
            description: 'Sophisticated marble-inspired design',
            preview: '🪨',
            category: 'luxury',
            styles: {
                pageBackground: '#F5F5F5',
                accentColor: '#2C3E50',
                accentSecondary: '#BDC3C7',
                textPrimary: '#1A1A2E',
                textSecondary: '#4A4A6A',
                borderStyle: 'double',
                borderWidth: '4px',
                borderColor: '#2C3E50',
                cornerAccent: 'none',
                gradient: 'marble-subtle'
            }
        },

        luxury_rose_gold: {
            id: 'luxury_rose_gold',
            name: 'Rose Gold',
            tier: 'free',
            description: 'Elegant rose gold and blush',
            preview: '🌹',
            category: 'luxury',
            styles: {
                pageBackground: '#FFF9F9',
                accentColor: '#B76E79',
                accentSecondary: '#F4E4E4',
                textPrimary: '#3D2A2D',
                textSecondary: '#6B5A5E',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#B76E79',
                cornerAccent: 'none',
                gradient: 'rose-gold-shimmer'
            }
        },

        luxury_platinum: {
            id: 'luxury_platinum',
            name: 'Platinum',
            tier: 'free',
            description: 'Cool platinum and silver tones',
            preview: '💿',
            category: 'luxury',
            styles: {
                pageBackground: '#F8F9FA',
                accentColor: '#546E7A',
                accentSecondary: '#B0BEC5',
                textPrimary: '#263238',
                textSecondary: '#607D8B',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#546E7A',
                cornerAccent: 'none',
                gradient: 'platinum-sheen'
            }
        },

        luxury_sapphire: {
            id: 'luxury_sapphire',
            name: 'Royal Sapphire',
            tier: 'free',
            description: 'Deep sapphire blue with silver',
            preview: '💎',
            category: 'luxury',
            styles: {
                pageBackground: '#F5F8FC',
                accentColor: '#1A237E',
                accentSecondary: '#C0C0C0',
                textPrimary: '#0D1B3E',
                textSecondary: '#3D5A8A',
                borderStyle: 'solid',
                borderWidth: '3px',
                borderColor: '#1A237E',
                cornerAccent: 'none',
                gradient: 'sapphire-depth'
            }
        },

        // ============================================================================
        // SOCIAL MEDIA FORMAT TEMPLATES
        // ============================================================================

        social_instagram_square: {
            id: 'social_instagram_square',
            name: 'Instagram Post',
            tier: 'free',
            description: 'Perfect for Instagram feed posts (1080x1080)',
            preview: '📱',
            category: 'social',
            format: 'instagram_square',
            dimensions: { width: 1080, height: 1080 },
            styles: {
                pageBackground: '#FFFFFF',
                accentColor: '#E1306C',
                accentSecondary: '#F77737',
                textPrimary: '#262626',
                textSecondary: '#8E8E8E',
                borderStyle: 'none',
                borderWidth: '0',
                borderColor: 'transparent',
                cornerAccent: 'none',
                gradient: 'instagram-gradient'
            }
        },

        social_instagram_story: {
            id: 'social_instagram_story',
            name: 'Instagram Story',
            tier: 'free',
            description: 'Vertical format for stories (1080x1920)',
            preview: '📲',
            category: 'social',
            format: 'instagram_story',
            dimensions: { width: 1080, height: 1920 },
            styles: {
                pageBackground: '#0A0A0A',
                accentColor: '#FFFFFF',
                accentSecondary: '#E1306C',
                textPrimary: '#FFFFFF',
                textSecondary: '#B0B0B0',
                borderStyle: 'none',
                borderWidth: '0',
                borderColor: 'transparent',
                cornerAccent: 'none',
                gradient: 'story-dark'
            }
        },

        social_facebook: {
            id: 'social_facebook',
            name: 'Facebook Post',
            tier: 'free',
            description: 'Optimized for Facebook feed (1200x630)',
            preview: '👍',
            category: 'social',
            format: 'facebook_post',
            dimensions: { width: 1200, height: 630 },
            styles: {
                pageBackground: '#FFFFFF',
                accentColor: '#1877F2',
                accentSecondary: '#42B72A',
                textPrimary: '#1C1E21',
                textSecondary: '#65676B',
                borderStyle: 'none',
                borderWidth: '0',
                borderColor: 'transparent',
                cornerAccent: 'none',
                gradient: 'none'
            }
        },

        social_linkedin: {
            id: 'social_linkedin',
            name: 'LinkedIn Post',
            tier: 'free',
            description: 'Professional LinkedIn format (1200x627)',
            preview: '💼',
            category: 'social',
            format: 'linkedin_post',
            dimensions: { width: 1200, height: 627 },
            styles: {
                pageBackground: '#FFFFFF',
                accentColor: '#0A66C2',
                accentSecondary: '#057642',
                textPrimary: '#000000',
                textSecondary: '#666666',
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: '#E0E0E0',
                cornerAccent: 'none',
                gradient: 'none'
            }
        },

        social_twitter: {
            id: 'social_twitter',
            name: 'Twitter/X Post',
            tier: 'free',
            description: 'Optimized for Twitter/X (1200x675)',
            preview: '🐦',
            category: 'social',
            format: 'twitter_post',
            dimensions: { width: 1200, height: 675 },
            styles: {
                pageBackground: '#FFFFFF',
                accentColor: '#1DA1F2',
                accentSecondary: '#14171A',
                textPrimary: '#14171A',
                textSecondary: '#657786',
                borderStyle: 'none',
                borderWidth: '0',
                borderColor: 'transparent',
                cornerAccent: 'none',
                gradient: 'none'
            }
        }
    },

    // ============================================================================
    // PROFESSIONAL ESTATE AGENT TEMPLATES (NEW!)
    // These templates apply CSS classes for complete visual transformation
    // ============================================================================

    professional: {

        premium_classic: {
            id: 'premium_classic',
            name: 'Premium Classic',
            tier: 'free',
            description: 'Elegant Savills/Knight Frank style with gold accents',
            preview: '🏛️',
            category: 'professional',
            cssClass: 'template-premium-classic',
            styles: {
                pageBackground: '#FDFCFA',
                accentColor: '#1a1a1a',
                accentSecondary: '#C9A961',
                textPrimary: '#1a1a1a',
                textSecondary: '#666666',
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: '#e5e5e5',
                cornerAccent: 'none',
                gradient: 'none'
            }
        },

        modern_minimal: {
            id: 'modern_minimal',
            name: 'Modern Minimal',
            tier: 'free',
            description: 'Contemporary bold sans-serif with black accents',
            preview: '⬛',
            category: 'professional',
            cssClass: 'template-modern-minimal',
            styles: {
                pageBackground: '#FFFFFF',
                accentColor: '#000000',
                accentSecondary: '#f5f5f5',
                textPrimary: '#000000',
                textSecondary: '#333333',
                borderStyle: 'none',
                borderWidth: '0',
                borderColor: 'transparent',
                cornerAccent: 'none',
                gradient: 'none'
            }
        },

        country_estate: {
            id: 'country_estate',
            name: 'Country Estate',
            tier: 'free',
            description: 'Strutt & Parker style with earthy green tones',
            preview: '🌳',
            category: 'professional',
            cssClass: 'template-country-estate',
            styles: {
                pageBackground: '#F9F8F3',
                accentColor: '#2B5940',
                accentSecondary: '#B8A888',
                textPrimary: '#2B5940',
                textSecondary: '#3d4a3e',
                borderStyle: 'none',
                borderWidth: '0',
                borderColor: 'transparent',
                cornerAccent: 'none',
                gradient: 'none'
            }
        },

        luxury_noir: {
            id: 'luxury_noir',
            name: 'Luxury Noir',
            tier: 'free',
            description: 'Ultra-premium dark theme with gold corners',
            preview: '🖤',
            category: 'professional',
            cssClass: 'template-luxury-noir',
            styles: {
                pageBackground: '#0a0a0a',
                accentColor: '#D4AF37',
                accentSecondary: '#1a1a1a',
                textPrimary: '#FFFFFF',
                textSecondary: '#e0e0e0',
                borderStyle: 'none',
                borderWidth: '0',
                borderColor: 'transparent',
                cornerAccent: 'none',
                gradient: 'none'
            }
        },

        coastal_contemporary: {
            id: 'coastal_contemporary',
            name: 'Coastal Contemporary',
            tier: 'free',
            description: 'Light airy blues for seaside properties',
            preview: '🌊',
            category: 'professional',
            cssClass: 'template-coastal',
            styles: {
                pageBackground: '#F8FBFD',
                accentColor: '#0077BE',
                accentSecondary: '#E8D5B7',
                textPrimary: '#1a3647',
                textSecondary: '#4a6273',
                borderStyle: 'none',
                borderWidth: '0',
                borderColor: 'transparent',
                cornerAccent: 'none',
                gradient: 'none'
            }
        },

        heritage_burgundy: {
            id: 'heritage_burgundy',
            name: 'Heritage Burgundy',
            tier: 'free',
            description: 'Period property style with double border',
            preview: '🏰',
            category: 'professional',
            cssClass: 'template-heritage',
            styles: {
                pageBackground: '#FFFEF9',
                accentColor: '#6B1F3A',
                accentSecondary: '#BF9B30',
                textPrimary: '#3d2a2e',
                textSecondary: '#6b495a',
                borderStyle: 'none',
                borderWidth: '0',
                borderColor: 'transparent',
                cornerAccent: 'none',
                gradient: 'none'
            }
        }
    },

    // PREMIUM TEMPLATES - Empty (all templates unlocked in free tier for testing)
    premium: {}
};

// TEMPLATE APPLICATION FUNCTIONS
// ============================================================================

/**
 * Apply a template to a brochure page
 */
function applyTemplate(templateId, pageElement) {
    const template = getTemplateById(templateId);
    if (!template) {
        console.error(`Template ${templateId} not found`);
        return;
    }

    const styles = template.styles;

    // Remove any existing professional template CSS classes
    const templateClasses = [
        'template-premium-classic',
        'template-modern-minimal',
        'template-country-estate',
        'template-luxury-noir',
        'template-coastal',
        'template-heritage'
    ];
    templateClasses.forEach(cls => pageElement.classList.remove(cls));

    // Apply CSS class for professional templates (NEW!)
    if (template.cssClass) {
        pageElement.classList.add(template.cssClass);
        console.log(`🎨 Applied professional CSS class: ${template.cssClass}`);
    }

    // Apply base page styles
    pageElement.style.backgroundColor = styles.pageBackground;
    pageElement.style.color = styles.textPrimary;

    // Apply CSS custom properties for template colors
    pageElement.style.setProperty('--template-primary', styles.accentColor);
    pageElement.style.setProperty('--template-accent', styles.accentSecondary);
    pageElement.style.setProperty('--template-bg', styles.pageBackground);

    // Apply gradient background if specified
    if (styles.gradient && styles.gradient !== 'none') {
        applyGradientBackground(pageElement, styles);
    }

    // Apply border
    if (styles.borderStyle !== 'none') {
        pageElement.style.border = `${styles.borderWidth} ${styles.borderStyle} ${styles.borderColor}`;
        pageElement.style.boxShadow = `inset 0 0 0 1px ${styles.accentSecondary}15`;
    } else {
        pageElement.style.border = 'none';
    }

    // Remove existing decorative elements
    removeTemplateDecorations(pageElement);

    // Add corner accents
    if (styles.cornerAccent && styles.cornerAccent !== 'none') {
        addCornerAccents(pageElement, styles);
    }

    // Add watermark/pattern
    if (styles.watermark) {
        addWatermark(pageElement, styles);
    }

    // Store template ID on element
    pageElement.dataset.templateId = templateId;

    console.log(`✅ Applied template: ${template.name}`);
}

/**
 * Apply gradient background effects
 */
function applyGradientBackground(pageElement, styles) {
    const gradients = {
        'subtle-turquoise': `linear-gradient(to bottom, ${styles.pageBackground} 0%, ${styles.accentSecondary}08 100%)`,
        'purple-fade': `linear-gradient(135deg, ${styles.pageBackground} 0%, ${styles.accentColor}05 100%)`,
        'warm-glow': `radial-gradient(circle at top right, ${styles.accentSecondary}10 0%, ${styles.pageBackground} 50%)`,
        'green-energy': `linear-gradient(to bottom right, ${styles.pageBackground} 0%, ${styles.accentSecondary}12 100%)`,
        'prestige-red': `linear-gradient(to bottom, ${styles.pageBackground} 0%, ${styles.accentColor}06 100%)`,
        'navy-champagne': `linear-gradient(135deg, ${styles.accentSecondary}15 0%, ${styles.pageBackground} 50%, ${styles.accentColor}08 100%)`,
        'burgundy-luxury': `radial-gradient(circle at center, ${styles.pageBackground} 0%, ${styles.accentColor}05 100%)`,
        'country-green': `linear-gradient(to bottom, ${styles.accentSecondary}10 0%, ${styles.pageBackground} 30%, ${styles.pageBackground} 100%)`,
        'london-navy': `linear-gradient(to right, ${styles.pageBackground} 0%, ${styles.accentColor}04 100%)`,
        'black-gold-shimmer': `linear-gradient(135deg, ${styles.pageBackground} 0%, ${styles.accentSecondary}08 100%)`,
        'ocean-breeze': `linear-gradient(to bottom, ${styles.accentColor}05 0%, ${styles.pageBackground} 20%, ${styles.accentSecondary}10 100%)`,
        'slate-urban': `linear-gradient(to bottom right, ${styles.pageBackground} 0%, ${styles.accentColor}06 100%)`,
        'sage-countryside': `radial-gradient(ellipse at top, ${styles.accentColor}08 0%, ${styles.pageBackground} 50%)`,
        'burgundy-period': `linear-gradient(to bottom, ${styles.accentSecondary}12 0%, ${styles.pageBackground} 40%, ${styles.accentColor}04 100%)`,
        'platinum-shimmer': `linear-gradient(135deg, ${styles.accentSecondary}10 0%, ${styles.pageBackground} 50%, ${styles.accentSecondary}05 100%)`,
        'rose-garden': `radial-gradient(circle at bottom right, ${styles.accentColor}06 0%, ${styles.pageBackground} 60%)`,
        'alpine-crisp': `linear-gradient(to bottom, ${styles.accentSecondary}20 0%, ${styles.pageBackground} 30%)`,
        'tuscan-warmth': `radial-gradient(ellipse at center, ${styles.accentColor}08 0%, ${styles.accentSecondary}12 50%, ${styles.pageBackground} 100%)`,
        'emerald-luxury': `linear-gradient(135deg, ${styles.accentColor}06 0%, ${styles.pageBackground} 50%, ${styles.accentSecondary}10 100%)`,
        // Doorstep branded gradients
        'doorstep-subtle': `linear-gradient(to bottom, ${styles.accentSecondary} 0%, ${styles.pageBackground} 15%, ${styles.pageBackground} 100%)`,
        'dark-luxury': `linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)`,
        'heritage-warm': `linear-gradient(to bottom, ${styles.accentSecondary}20 0%, ${styles.pageBackground} 30%, ${styles.pageBackground} 85%, ${styles.accentColor}08 100%)`
    };

    if (gradients[styles.gradient]) {
        pageElement.style.backgroundImage = gradients[styles.gradient];
    }
}

/**
 * Apply template to all pages in the brochure
 */
function applyTemplateToAll(templateId) {
    const pages = document.querySelectorAll('.brochure-page');
    pages.forEach(page => applyTemplate(templateId, page));

    // Store in editor state
    if (window.EditorState) {
        window.EditorState.activeTemplate = templateId;
    }
}

/**
 * Get template by ID
 */
function getTemplateById(templateId) {
    // Check free templates
    if (BrochureTemplates.free[templateId]) {
        return BrochureTemplates.free[templateId];
    }
    // Check professional templates (NEW!)
    if (BrochureTemplates.professional && BrochureTemplates.professional[templateId]) {
        return BrochureTemplates.professional[templateId];
    }
    // Check premium templates
    if (BrochureTemplates.premium[templateId]) {
        return BrochureTemplates.premium[templateId];
    }
    return null;
}

/**
 * Get all available templates (considering user's access level)
 */
function getAvailableTemplates(hasPremium = false) {
    const templates = [...Object.values(BrochureTemplates.free)];

    // Always include professional templates (they're the best ones!)
    if (BrochureTemplates.professional) {
        templates.push(...Object.values(BrochureTemplates.professional));
    }

    if (hasPremium) {
        templates.push(...Object.values(BrochureTemplates.premium));
    }

    return templates;
}

/**
 * Remove existing template decorations from a page
 */
function removeTemplateDecorations(pageElement) {
    // Remove corner accents
    const corners = pageElement.querySelectorAll('.template-corner-accent');
    corners.forEach(corner => corner.remove());

    // Remove watermarks
    const watermarks = pageElement.querySelectorAll('.template-watermark');
    watermarks.forEach(wm => wm.remove());

    // Reset background
    pageElement.style.backgroundImage = 'none';
}

/**
 * Add corner accent decorations
 */
function addCornerAccents(pageElement, styles) {
    const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

    positions.forEach(position => {
        const corner = document.createElement('div');
        corner.className = `template-corner-accent corner-${position}`;
        corner.dataset.accentType = styles.cornerAccent;

        // Position absolutely in corners
        corner.style.position = 'absolute';
        corner.style.width = '80px';
        corner.style.height = '80px';
        corner.style.pointerEvents = 'none';
        corner.style.zIndex = '10';

        if (position.includes('top')) corner.style.top = '15mm';
        if (position.includes('bottom')) corner.style.bottom = '15mm';
        if (position.includes('left')) corner.style.left = '15mm';
        if (position.includes('right')) corner.style.right = '15mm';

        // Style based on accent type
        styleCornerAccent(corner, styles, position);

        pageElement.appendChild(corner);
    });
}

/**
 * Style corner accents based on type
 */
function styleCornerAccent(corner, styles, position) {
    const isTop = position.includes('top');
    const isLeft = position.includes('left');

    const accentStyles = {
        // UK AGENCY-SPECIFIC CORNER STYLES
        'savills-corners': () => {
            corner.innerHTML = `
                <svg width="80" height="80" style="display: block;">
                    <line x1="${isLeft ? '0' : '80'}" y1="${isTop ? '0' : '80'}"
                          x2="${isLeft ? '80' : '0'}" y2="${isTop ? '0' : '80'}"
                          stroke="${styles.accentColor}" stroke-width="2"/>
                    <line x1="${isLeft ? '0' : '80'}" y1="${isTop ? '0' : '80'}"
                          x2="${isLeft ? '0' : '80'}" y2="${isTop ? '80' : '0'}"
                          stroke="${styles.accentColor}" stroke-width="2"/>
                </svg>
            `;
        },
        'rightmove-hearts': () => {
            corner.innerHTML = `
                <div style="width: 100%; height: 100%; border-${isTop ? 'top' : 'bottom'}: 4px solid ${styles.accentSecondary}; border-${isLeft ? 'left' : 'right'}: 4px solid ${styles.accentColor}; border-radius: ${isTop && isLeft ? '8px 0 0 0' : isTop ? '0 8px 0 0' : isLeft ? '0 0 0 8px' : '0 0 8px 0'};"></div>
            `;
        },
        'zoopla-curves': () => {
            corner.style.borderRadius = '50%';
            corner.style.border = `3px solid ${styles.accentColor}`;
            corner.style.opacity = '0.3';
        },
        'foxtons-stripes': () => {
            corner.innerHTML = `
                <div style="width: 100%; height: 6px; background: ${styles.accentColor}; position: absolute; ${isTop ? 'top' : 'bottom'}: 0; ${isLeft ? 'left' : 'right'}: 0;"></div>
                <div style="width: 6px; height: 100%; background: ${styles.accentSecondary}; position: absolute; ${isTop ? 'top' : 'bottom'}: 0; ${isLeft ? 'left' : 'right'}: 0;"></div>
            `;
        },
        'knight-frank-crest': () => {
            corner.innerHTML = `
                <svg width="80" height="80">
                    <rect x="${isLeft ? '0' : '40'}" y="${isTop ? '0' : '40'}" width="40" height="40"
                          fill="none" stroke="${styles.accentColor}" stroke-width="3"/>
                    <rect x="${isLeft ? '5' : '45'}" y="${isTop ? '5' : '45'}" width="30" height="30"
                          fill="none" stroke="${styles.accentSecondary}" stroke-width="1.5"/>
                </svg>
            `;
        },
        'hamptons-elegance': () => {
            corner.innerHTML = `
                <div style="width: 100%; height: 100%; border-${isTop ? 'top' : 'bottom'}: 3px solid ${styles.accentColor}; border-${isLeft ? 'left' : 'right'}: 3px solid ${styles.accentColor};"></div>
                <div style="width: 80%; height: 80%; border-${isTop ? 'top' : 'bottom'}: 1px solid ${styles.accentSecondary}; border-${isLeft ? 'left' : 'right'}: 1px solid ${styles.accentSecondary}; position: absolute; ${isTop ? 'top' : 'bottom'}: 10px; ${isLeft ? 'left' : 'right'}: 10px;"></div>
            `;
        },

        // DEFAULT FALLBACK
        'default': () => {
            corner.innerHTML = `
                <div style="width: 100%; height: 100%; border-${isTop ? 'top' : 'bottom'}: 2px solid ${styles.accentColor}; border-${isLeft ? 'left' : 'right'}: 2px solid ${styles.accentColor};"></div>
            `;
        }
    };

    // Apply the appropriate style or fallback to default
    const styleFunction = accentStyles[styles.cornerAccent] || accentStyles['default'];
    styleFunction();
}

/**
 * Add subtle watermark/pattern to page
 */
function addWatermark(pageElement, styles) {
    const watermark = document.createElement('div');
    watermark.className = 'template-watermark';
    watermark.style.position = 'absolute';
    watermark.style.top = '0';
    watermark.style.left = '0';
    watermark.style.width = '100%';
    watermark.style.height = '100%';
    watermark.style.pointerEvents = 'none';
    watermark.style.zIndex = '0';
    watermark.style.opacity = '0.04';
    watermark.style.backgroundSize = '300px 300px';
    watermark.style.backgroundRepeat = 'repeat';

    // Set pattern based on watermark type
    const patterns = {
        'crest-pattern': `repeating-linear-gradient(45deg, ${styles.accentColor}, ${styles.accentColor} 2px, transparent 2px, transparent 20px)`,
        'hamptons-subtle': `radial-gradient(circle, ${styles.accentSecondary} 1px, transparent 1px)`,
        'damask-pattern': `repeating-linear-gradient(0deg, ${styles.accentColor}, ${styles.accentColor} 1px, transparent 1px, transparent 15px), repeating-linear-gradient(90deg, ${styles.accentSecondary}, ${styles.accentSecondary} 1px, transparent 1px, transparent 15px)`,
        'oak-leaf-pattern': `radial-gradient(circle at 25% 25%, ${styles.accentColor} 2px, transparent 2px)`,
        'city-grid': `linear-gradient(${styles.accentColor} 1px, transparent 1px), linear-gradient(90deg, ${styles.accentColor} 1px, transparent 1px)`,
        'luxury-diamond-pattern': `repeating-linear-gradient(45deg, ${styles.accentSecondary}, ${styles.accentSecondary} 10px, transparent 10px, transparent 20px), repeating-linear-gradient(-45deg, ${styles.accentSecondary}, ${styles.accentSecondary} 10px, transparent 10px, transparent 20px)`,
        'wave-pattern': `repeating-radial-gradient(circle at 50% 50%, ${styles.accentColor}, transparent 5px, transparent 25px)`,
        'grid-pattern': `linear-gradient(${styles.accentSecondary} 0.5px, transparent 0.5px), linear-gradient(90deg, ${styles.accentSecondary} 0.5px, transparent 0.5px)`,
        'botanical-pattern': `radial-gradient(circle, ${styles.accentColor} 1.5px, transparent 1.5px)`,
        'victorian-pattern': `repeating-linear-gradient(45deg, ${styles.accentColor}, ${styles.accentColor} 3px, transparent 3px, transparent 18px)`,
        'metallic-pattern': `linear-gradient(135deg, ${styles.accentSecondary} 25%, transparent 25%), linear-gradient(225deg, ${styles.accentSecondary} 25%, transparent 25%)`,
        'rose-pattern': `radial-gradient(circle at 30% 30%, ${styles.accentColor} 2px, transparent 2px)`,
        'snowflake-pattern': `radial-gradient(circle, ${styles.accentSecondary} 1px, transparent 1px)`,
        'vineyard-pattern': `repeating-linear-gradient(60deg, ${styles.accentColor}, ${styles.accentColor} 2px, transparent 2px, transparent 25px)`,
        'diamond-pattern': `repeating-linear-gradient(45deg, ${styles.accentColor}, ${styles.accentColor} 5px, transparent 5px, transparent 15px)`
    };

    if (patterns[styles.watermark]) {
        watermark.style.backgroundImage = patterns[styles.watermark];
        watermark.style.backgroundSize = '200px 200px';
    }

    pageElement.insertBefore(watermark, pageElement.firstChild);
}

// ============================================================================
// EXPORT
// ============================================================================

window.BrochureTemplates = BrochureTemplates;
window.applyTemplate = applyTemplate;
window.applyTemplateToAll = applyTemplateToAll;
window.getAvailableTemplates = getAvailableTemplates;
window.getTemplateById = getTemplateById;

console.log('🎨 PROFESSIONAL ESTATE AGENT TEMPLATES LOADED');
console.log(`   ✅ ${Object.keys(BrochureTemplates.free).length} color schemes + ${Object.keys(BrochureTemplates.professional).length} professional layouts!`);
console.log('   ⭐ NEW PROFESSIONAL: Premium Classic, Modern Minimal, Country Estate, Luxury Noir, Coastal, Heritage');
console.log('   🏢 UK Estate Agencies: Savills, Rightmove, Zoopla, Foxtons, Knight Frank, Hamptons');
console.log('   ⬜ Minimalist: Pure White, Monochrome, Soft Gray, Sand Stone, Charcoal');
console.log('   🌅 Bold: Coral Burst, Electric Blue, Sunset Flame, Neon Nights, Lime Fresh');
console.log('   🏆 Luxury: Black & Gold, Marble, Rose Gold, Platinum, Sapphire');
console.log('   📱 Social: Instagram, Facebook, LinkedIn, Twitter/X formats');
