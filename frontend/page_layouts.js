/**
 * Professional Page Layouts System
 *
 * ACTUAL PAGE LAYOUTS with photo placeholders - like real Savills/Knight Frank brochures
 * These are NOT just color schemes - they're complete page structures!
 *
 * Author: Claude Code
 * Date: January 2026
 */

// ============================================================================
// PAGE LAYOUT DEFINITIONS
// Each layout defines the complete structure of a brochure page
// ============================================================================

const PageLayouts = {

    // ========================================================================
    // COVER PAGE LAYOUTS
    // ========================================================================

    cover_hero_full: {
        id: 'cover_hero_full',
        name: 'Full Hero Cover',
        category: 'cover',
        description: 'Full-bleed hero image with text overlay',
        preview: '🖼️',
        structure: {
            type: 'cover',
            elements: [
                {
                    type: 'image-placeholder',
                    id: 'hero-image',
                    label: 'Hero Property Image',
                    style: {
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: '1'
                    }
                },
                {
                    type: 'overlay',
                    id: 'gradient-overlay',
                    style: {
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)',
                        zIndex: '2'
                    }
                },
                {
                    type: 'image-placeholder',
                    id: 'agent-logo',
                    label: 'Agency Logo',
                    style: {
                        position: 'absolute',
                        top: '30px',
                        right: '30px',
                        width: '140px',
                        height: '50px',
                        objectFit: 'contain',
                        zIndex: '10',
                        background: 'transparent',
                        border: 'none'
                    }
                },
                {
                    type: 'text-block',
                    id: 'property-name',
                    placeholder: 'Property Name',
                    style: {
                        position: 'absolute',
                        bottom: '120px',
                        left: '40px',
                        right: '40px',
                        fontSize: '48px',
                        fontWeight: '300',
                        color: '#ffffff',
                        letterSpacing: '2px',
                        zIndex: '3'
                    }
                },
                {
                    type: 'text-block',
                    id: 'location',
                    placeholder: 'Location, County',
                    style: {
                        position: 'absolute',
                        bottom: '85px',
                        left: '40px',
                        right: '40px',
                        fontSize: '18px',
                        fontWeight: '400',
                        color: '#ffffff',
                        letterSpacing: '1px',
                        opacity: '0.9',
                        zIndex: '3'
                    }
                },
                {
                    type: 'text-block',
                    id: 'price',
                    placeholder: 'Guide Price £0,000,000',
                    style: {
                        position: 'absolute',
                        bottom: '40px',
                        left: '40px',
                        fontSize: '24px',
                        fontWeight: '500',
                        color: '#ffffff',
                        zIndex: '3'
                    }
                }
            ]
        }
    },

    cover_hero_bottom: {
        id: 'cover_hero_bottom',
        name: 'Bottom Text Cover',
        category: 'cover',
        description: 'Hero image with text bar at bottom',
        preview: '📷',
        structure: {
            type: 'cover',
            elements: [
                {
                    type: 'image-placeholder',
                    id: 'hero-image',
                    label: 'Hero Property Image',
                    style: {
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '75%',
                        objectFit: 'cover',
                        zIndex: '1'
                    }
                },
                {
                    type: 'image-placeholder',
                    id: 'agent-logo',
                    label: 'Agency Logo',
                    style: {
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        width: '120px',
                        height: '45px',
                        objectFit: 'contain',
                        zIndex: '5',
                        background: 'rgba(255,255,255,0.9)',
                        padding: '8px',
                        borderRadius: '4px'
                    }
                },
                {
                    type: 'container',
                    id: 'info-bar',
                    style: {
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        width: '100%',
                        height: '25%',
                        background: '#ffffff',
                        padding: '30px 40px',
                        boxSizing: 'border-box',
                        zIndex: '2'
                    },
                    children: [
                        {
                            type: 'text-block',
                            id: 'property-name',
                            placeholder: 'Property Name',
                            style: {
                                fontSize: '32px',
                                fontWeight: '600',
                                color: 'var(--template-primary, #1a1a1a)',
                                marginBottom: '8px'
                            }
                        },
                        {
                            type: 'text-block',
                            id: 'location',
                            placeholder: 'Location, County • Guide Price £0,000,000',
                            style: {
                                fontSize: '16px',
                                color: 'var(--template-accent, #666666)'
                            }
                        }
                    ]
                }
            ]
        }
    },

    cover_split_left: {
        id: 'cover_split_left',
        name: 'Split Cover Left',
        category: 'cover',
        description: 'Image left, text right - Savills style',
        preview: '◧',
        structure: {
            type: 'cover',
            elements: [
                {
                    type: 'image-placeholder',
                    id: 'hero-image',
                    label: 'Hero Property Image',
                    style: {
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '60%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: '1'
                    }
                },
                {
                    type: 'image-placeholder',
                    id: 'agent-logo',
                    label: 'Agency Logo',
                    style: {
                        position: 'absolute',
                        top: '30px',
                        right: '30px',
                        width: '120px',
                        height: '45px',
                        objectFit: 'contain',
                        zIndex: '10',
                        background: 'transparent'
                    }
                },
                {
                    type: 'container',
                    id: 'text-panel',
                    style: {
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        width: '40%',
                        height: '100%',
                        background: 'var(--template-bg, #FDFCFA)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        padding: '50px',
                        boxSizing: 'border-box',
                        zIndex: '2'
                    },
                    children: [
                        {
                            type: 'text-block',
                            id: 'property-name',
                            placeholder: 'Property Name',
                            style: {
                                fontSize: '36px',
                                fontWeight: '300',
                                color: 'var(--template-primary, #1a1a1a)',
                                marginBottom: '15px',
                                lineHeight: '1.2'
                            }
                        },
                        {
                            type: 'divider',
                            style: {
                                width: '60px',
                                height: '2px',
                                background: 'var(--template-accent, #C9A961)',
                                marginBottom: '20px'
                            }
                        },
                        {
                            type: 'text-block',
                            id: 'location',
                            placeholder: 'Location, County',
                            style: {
                                fontSize: '14px',
                                color: '#666666',
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                marginBottom: '30px'
                            }
                        },
                        {
                            type: 'text-block',
                            id: 'price',
                            placeholder: 'Guide Price £0,000,000',
                            style: {
                                fontSize: '22px',
                                fontWeight: '500',
                                color: 'var(--template-primary, #1a1a1a)'
                            }
                        }
                    ]
                }
            ]
        }
    },

    cover_minimal: {
        id: 'cover_minimal',
        name: 'Minimal Cover',
        category: 'cover',
        description: 'Large image with minimal text overlay',
        preview: '▢',
        structure: {
            type: 'cover',
            elements: [
                {
                    type: 'image-placeholder',
                    id: 'agent-logo',
                    label: 'Agency Logo',
                    style: {
                        position: 'absolute',
                        top: '40px',
                        left: '40px',
                        width: '100px',
                        height: '40px',
                        objectFit: 'contain',
                        zIndex: '10',
                        background: 'transparent'
                    }
                },
                {
                    type: 'image-placeholder',
                    id: 'hero-image',
                    label: 'Hero Property Image',
                    style: {
                        position: 'absolute',
                        top: '30px',
                        left: '30px',
                        right: '30px',
                        bottom: '100px',
                        objectFit: 'cover',
                        zIndex: '1'
                    }
                },
                {
                    type: 'container',
                    id: 'bottom-bar',
                    style: {
                        position: 'absolute',
                        bottom: '30px',
                        left: '30px',
                        right: '30px',
                        height: '50px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: '2'
                    },
                    children: [
                        {
                            type: 'text-block',
                            id: 'property-name',
                            placeholder: 'Property Name, Location',
                            style: {
                                fontSize: '18px',
                                fontWeight: '500',
                                color: 'var(--template-primary, #1a1a1a)'
                            }
                        },
                        {
                            type: 'text-block',
                            id: 'price',
                            placeholder: '£0,000,000',
                            style: {
                                fontSize: '18px',
                                fontWeight: '600',
                                color: 'var(--template-primary, #1a1a1a)'
                            }
                        }
                    ]
                }
            ]
        }
    },

    // ========================================================================
    // PHOTO GALLERY LAYOUTS
    // ========================================================================

    gallery_grid_4: {
        id: 'gallery_grid_4',
        name: '4-Photo Grid',
        category: 'gallery',
        description: 'Four equal photos in grid layout',
        preview: '⊞',
        structure: {
            type: 'gallery',
            elements: [
                {
                    type: 'grid-container',
                    id: 'photo-grid',
                    style: {
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gridTemplateRows: '1fr 1fr',
                        gap: '15px',
                        padding: '30px',
                        height: '100%',
                        boxSizing: 'border-box'
                    },
                    children: [
                        { type: 'image-placeholder', id: 'photo-1', label: 'Photo 1' },
                        { type: 'image-placeholder', id: 'photo-2', label: 'Photo 2' },
                        { type: 'image-placeholder', id: 'photo-3', label: 'Photo 3' },
                        { type: 'image-placeholder', id: 'photo-4', label: 'Photo 4' }
                    ]
                }
            ]
        }
    },

    gallery_hero_3: {
        id: 'gallery_hero_3',
        name: 'Hero + 3 Photos',
        category: 'gallery',
        description: 'Large hero with 3 smaller photos',
        preview: '▣',
        structure: {
            type: 'gallery',
            elements: [
                {
                    type: 'image-placeholder',
                    id: 'hero-photo',
                    label: 'Main Photo',
                    style: {
                        position: 'absolute',
                        top: '30px',
                        left: '30px',
                        width: 'calc(100% - 60px)',
                        height: '55%',
                        objectFit: 'cover'
                    }
                },
                {
                    type: 'grid-container',
                    id: 'bottom-photos',
                    style: {
                        position: 'absolute',
                        bottom: '30px',
                        left: '30px',
                        right: '30px',
                        height: 'calc(45% - 45px)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '15px'
                    },
                    children: [
                        { type: 'image-placeholder', id: 'photo-1', label: 'Photo 1' },
                        { type: 'image-placeholder', id: 'photo-2', label: 'Photo 2' },
                        { type: 'image-placeholder', id: 'photo-3', label: 'Photo 3' }
                    ]
                }
            ]
        }
    },

    gallery_magazine: {
        id: 'gallery_magazine',
        name: 'Magazine Layout',
        category: 'gallery',
        description: 'Asymmetric magazine-style grid',
        preview: '▤',
        structure: {
            type: 'gallery',
            elements: [
                {
                    type: 'grid-container',
                    id: 'magazine-grid',
                    style: {
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr',
                        gridTemplateRows: '1fr 1fr',
                        gap: '12px',
                        padding: '25px',
                        height: '100%',
                        boxSizing: 'border-box'
                    },
                    children: [
                        {
                            type: 'image-placeholder',
                            id: 'main-photo',
                            label: 'Main Photo',
                            style: { gridRow: 'span 2' }
                        },
                        { type: 'image-placeholder', id: 'photo-2', label: 'Photo 2' },
                        { type: 'image-placeholder', id: 'photo-3', label: 'Photo 3' }
                    ]
                }
            ]
        }
    },

    gallery_filmstrip: {
        id: 'gallery_filmstrip',
        name: 'Filmstrip',
        category: 'gallery',
        description: 'Horizontal strip of photos',
        preview: '▬',
        structure: {
            type: 'gallery',
            elements: [
                {
                    type: 'grid-container',
                    id: 'filmstrip',
                    style: {
                        display: 'flex',
                        gap: '15px',
                        padding: '80px 30px',
                        height: '100%',
                        boxSizing: 'border-box',
                        alignItems: 'center'
                    },
                    children: [
                        { type: 'image-placeholder', id: 'photo-1', label: 'Photo 1', style: { flex: '1', height: '100%' } },
                        { type: 'image-placeholder', id: 'photo-2', label: 'Photo 2', style: { flex: '1', height: '100%' } },
                        { type: 'image-placeholder', id: 'photo-3', label: 'Photo 3', style: { flex: '1', height: '100%' } },
                        { type: 'image-placeholder', id: 'photo-4', label: 'Photo 4', style: { flex: '1', height: '100%' } }
                    ]
                }
            ]
        }
    },

    // ========================================================================
    // CONTENT LAYOUTS (Text + Photos)
    // ========================================================================

    content_split_right: {
        id: 'content_split_right',
        name: 'Image Right',
        category: 'content',
        description: 'Text left, image right - classic brochure style',
        preview: '◨',
        structure: {
            type: 'content',
            elements: [
                {
                    type: 'container',
                    id: 'text-section',
                    style: {
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '45%',
                        height: '100%',
                        padding: '50px',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    },
                    children: [
                        {
                            type: 'text-block',
                            id: 'section-title',
                            placeholder: 'The Property',
                            style: {
                                fontSize: '28px',
                                fontWeight: '300',
                                color: 'var(--template-primary, #1a1a1a)',
                                marginBottom: '20px',
                                letterSpacing: '1px'
                            }
                        },
                        {
                            type: 'divider',
                            style: {
                                width: '50px',
                                height: '2px',
                                background: 'var(--template-accent, #C9A961)',
                                marginBottom: '25px'
                            }
                        },
                        {
                            type: 'text-block',
                            id: 'description',
                            placeholder: 'Property description text goes here. This exceptional property offers generous living accommodation with original period features throughout. The property benefits from landscaped gardens and off-street parking.',
                            style: {
                                fontSize: '14px',
                                lineHeight: '1.8',
                                color: '#444444'
                            }
                        }
                    ]
                },
                {
                    type: 'image-placeholder',
                    id: 'feature-image',
                    label: 'Feature Image',
                    style: {
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        width: '55%',
                        height: '100%',
                        objectFit: 'cover'
                    }
                }
            ]
        }
    },

    content_split_left: {
        id: 'content_split_left',
        name: 'Image Left',
        category: 'content',
        description: 'Image left, text right',
        preview: '◧',
        structure: {
            type: 'content',
            elements: [
                {
                    type: 'image-placeholder',
                    id: 'feature-image',
                    label: 'Feature Image',
                    style: {
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '55%',
                        height: '100%',
                        objectFit: 'cover'
                    }
                },
                {
                    type: 'container',
                    id: 'text-section',
                    style: {
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        width: '45%',
                        height: '100%',
                        padding: '50px',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    },
                    children: [
                        {
                            type: 'text-block',
                            id: 'section-title',
                            placeholder: 'The Location',
                            style: {
                                fontSize: '28px',
                                fontWeight: '300',
                                color: 'var(--template-primary, #1a1a1a)',
                                marginBottom: '20px'
                            }
                        },
                        {
                            type: 'divider',
                            style: {
                                width: '50px',
                                height: '2px',
                                background: 'var(--template-accent, #C9A961)',
                                marginBottom: '25px'
                            }
                        },
                        {
                            type: 'text-block',
                            id: 'description',
                            placeholder: 'Location description with nearby amenities, schools, and transport links. The area offers excellent schools, local shops, and easy access to the motorway network.',
                            style: {
                                fontSize: '14px',
                                lineHeight: '1.8',
                                color: '#444444'
                            }
                        }
                    ]
                }
            ]
        }
    },

    content_full_text: {
        id: 'content_full_text',
        name: 'Full Text Page',
        category: 'content',
        description: 'Full page for detailed description',
        preview: '≡',
        structure: {
            type: 'content',
            elements: [
                {
                    type: 'container',
                    id: 'text-container',
                    style: {
                        padding: '60px 80px',
                        height: '100%',
                        boxSizing: 'border-box'
                    },
                    children: [
                        {
                            type: 'text-block',
                            id: 'section-title',
                            placeholder: 'Property Details',
                            style: {
                                fontSize: '32px',
                                fontWeight: '300',
                                color: 'var(--template-primary, #1a1a1a)',
                                marginBottom: '15px',
                                textAlign: 'center'
                            }
                        },
                        {
                            type: 'divider',
                            style: {
                                width: '80px',
                                height: '2px',
                                background: 'var(--template-accent, #C9A961)',
                                margin: '0 auto 40px'
                            }
                        },
                        {
                            type: 'text-block',
                            id: 'description',
                            placeholder: 'Full property description text goes here. This exceptional family home has been thoughtfully extended and renovated to create generous, light-filled living spaces that flow seamlessly from one to the next.\n\nThe property benefits from a stunning open-plan kitchen/living area, four generous bedrooms, and beautifully landscaped gardens.',
                            style: {
                                fontSize: '15px',
                                lineHeight: '1.9',
                                color: '#333333',
                                columnCount: '2',
                                columnGap: '50px'
                            }
                        }
                    ]
                }
            ]
        }
    },

    content_features: {
        id: 'content_features',
        name: 'Key Features',
        category: 'content',
        description: 'Bullet points with feature icons',
        preview: '☰',
        structure: {
            type: 'content',
            elements: [
                {
                    type: 'container',
                    id: 'features-container',
                    style: {
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                        padding: '50px',
                        height: '100%',
                        boxSizing: 'border-box'
                    },
                    children: [
                        {
                            type: 'container',
                            id: 'left-column',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            },
                            children: [
                                {
                                    type: 'text-block',
                                    id: 'section-title',
                                    placeholder: 'Key Features',
                                    style: {
                                        fontSize: '28px',
                                        fontWeight: '300',
                                        color: 'var(--template-primary, #1a1a1a)',
                                        marginBottom: '30px'
                                    }
                                },
                                {
                                    type: 'feature-list',
                                    id: 'features',
                                    style: {
                                        fontSize: '14px',
                                        lineHeight: '2.2',
                                        color: '#333333'
                                    },
                                    items: [
                                        '4 bedrooms, 3 bathrooms',
                                        'Open-plan kitchen/living area',
                                        'South-facing garden',
                                        'Off-street parking for 2 cars',
                                        'Recently renovated throughout',
                                        'EPC Rating: C'
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'image-placeholder',
                            id: 'feature-image',
                            label: 'Interior Photo',
                            style: {
                                objectFit: 'cover',
                                height: '100%'
                            }
                        }
                    ]
                }
            ]
        }
    },

    // ========================================================================
    // SPECIAL LAYOUTS
    // ========================================================================

    floorplan_page: {
        id: 'floorplan_page',
        name: 'Floor Plan',
        category: 'special',
        description: 'Dedicated floor plan page',
        preview: '⌂',
        structure: {
            type: 'special',
            elements: [
                {
                    type: 'text-block',
                    id: 'section-title',
                    placeholder: 'Floor Plans',
                    style: {
                        position: 'absolute',
                        top: '40px',
                        left: '0',
                        width: '100%',
                        textAlign: 'center',
                        fontSize: '28px',
                        fontWeight: '300',
                        color: 'var(--template-primary, #1a1a1a)',
                        letterSpacing: '2px'
                    }
                },
                {
                    type: 'divider',
                    style: {
                        position: 'absolute',
                        top: '85px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60px',
                        height: '2px',
                        background: 'var(--template-accent, #C9A961)'
                    }
                },
                {
                    type: 'image-placeholder',
                    id: 'floorplan-image',
                    label: 'Floor Plan Image',
                    style: {
                        position: 'absolute',
                        top: '120px',
                        left: '50px',
                        right: '50px',
                        bottom: '100px',
                        objectFit: 'contain',
                        background: '#f9f9f9'
                    }
                },
                {
                    type: 'text-block',
                    id: 'total-area',
                    placeholder: 'Total Floor Area: Approx. 2,450 sq ft (227 sq m)',
                    style: {
                        position: 'absolute',
                        bottom: '50px',
                        left: '0',
                        width: '100%',
                        textAlign: 'center',
                        fontSize: '14px',
                        color: '#666666'
                    }
                }
            ]
        }
    },

    location_map: {
        id: 'location_map',
        name: 'Location Map',
        category: 'special',
        description: 'Map with nearby amenities',
        preview: '📍',
        structure: {
            type: 'special',
            elements: [
                {
                    type: 'text-block',
                    id: 'section-title',
                    placeholder: 'Location',
                    style: {
                        position: 'absolute',
                        top: '40px',
                        left: '50px',
                        fontSize: '28px',
                        fontWeight: '300',
                        color: 'var(--template-primary, #1a1a1a)'
                    }
                },
                {
                    type: 'image-placeholder',
                    id: 'map-image',
                    label: 'Location Map',
                    style: {
                        position: 'absolute',
                        top: '100px',
                        left: '50px',
                        width: 'calc(60% - 60px)',
                        bottom: '50px',
                        objectFit: 'cover',
                        background: '#e8e8e8'
                    }
                },
                {
                    type: 'container',
                    id: 'amenities-list',
                    style: {
                        position: 'absolute',
                        top: '100px',
                        right: '50px',
                        width: '35%',
                        padding: '25px',
                        background: 'var(--template-bg, #f9f9f9)',
                        boxSizing: 'border-box'
                    },
                    children: [
                        {
                            type: 'text-block',
                            id: 'nearby-title',
                            placeholder: 'Nearby',
                            style: {
                                fontSize: '16px',
                                fontWeight: '600',
                                marginBottom: '15px',
                                color: 'var(--template-primary, #1a1a1a)'
                            }
                        },
                        {
                            type: 'feature-list',
                            id: 'amenities',
                            style: {
                                fontSize: '13px',
                                lineHeight: '2',
                                color: '#555555'
                            },
                            items: [
                                'Primary School - 0.3 miles',
                                'Secondary School - 0.8 miles',
                                'Train Station - 0.5 miles',
                                'Supermarket - 0.2 miles',
                                'GP Surgery - 0.4 miles'
                            ]
                        }
                    ]
                }
            ]
        }
    },

    agent_contact: {
        id: 'agent_contact',
        name: 'Agent Contact',
        category: 'special',
        description: 'Back cover with agent details',
        preview: '📞',
        structure: {
            type: 'special',
            elements: [
                {
                    type: 'container',
                    id: 'contact-container',
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        padding: '60px',
                        textAlign: 'center',
                        boxSizing: 'border-box'
                    },
                    children: [
                        {
                            type: 'image-placeholder',
                            id: 'agent-logo',
                            label: 'Agent Logo',
                            style: {
                                width: '200px',
                                height: '80px',
                                objectFit: 'contain',
                                marginBottom: '40px'
                            }
                        },
                        {
                            type: 'text-block',
                            id: 'office-name',
                            placeholder: 'Your Estate Agency',
                            style: {
                                fontSize: '24px',
                                fontWeight: '600',
                                color: 'var(--template-primary, #1a1a1a)',
                                marginBottom: '10px'
                            }
                        },
                        {
                            type: 'text-block',
                            id: 'office-address',
                            placeholder: '123 High Street, Town, County, AB1 2CD',
                            style: {
                                fontSize: '14px',
                                color: '#666666',
                                marginBottom: '30px'
                            }
                        },
                        {
                            type: 'divider',
                            style: {
                                width: '100px',
                                height: '1px',
                                background: 'var(--template-accent, #C9A961)',
                                margin: '0 auto 30px'
                            }
                        },
                        {
                            type: 'text-block',
                            id: 'phone',
                            placeholder: '01onal 123456',
                            style: {
                                fontSize: '20px',
                                fontWeight: '500',
                                color: 'var(--template-primary, #1a1a1a)',
                                marginBottom: '10px'
                            }
                        },
                        {
                            type: 'text-block',
                            id: 'email',
                            placeholder: 'info@youragency.co.uk',
                            style: {
                                fontSize: '14px',
                                color: 'var(--template-accent, #666666)',
                                marginBottom: '5px'
                            }
                        },
                        {
                            type: 'text-block',
                            id: 'website',
                            placeholder: 'www.youragency.co.uk',
                            style: {
                                fontSize: '14px',
                                color: 'var(--template-accent, #666666)'
                            }
                        }
                    ]
                }
            ]
        }
    }
};

// ============================================================================
// LAYOUT APPLICATION FUNCTIONS
// ============================================================================

/**
 * Apply a page layout to a brochure page
 */
function applyPageLayout(layoutId, pageElement, data = {}) {
    const layout = PageLayouts[layoutId];
    if (!layout) {
        console.error(`Layout ${layoutId} not found`);
        return;
    }

    // Clear existing content
    pageElement.innerHTML = '';
    pageElement.classList.add('layout-applied', `layout-${layoutId}`);

    // Build the layout structure
    buildLayoutStructure(pageElement, layout.structure.elements, data);

    // Store layout ID
    pageElement.dataset.layoutId = layoutId;

    console.log(`✅ Applied layout: ${layout.name}`);
}

/**
 * Build layout structure recursively
 */
function buildLayoutStructure(parent, elements, data) {
    elements.forEach(element => {
        const el = createLayoutElement(element, data);
        if (el) {
            parent.appendChild(el);

            // Handle children recursively
            if (element.children) {
                buildLayoutStructure(el, element.children, data);
            }
        }
    });
}

/**
 * Create a single layout element
 */
function createLayoutElement(config, data) {
    let el;

    switch (config.type) {
        case 'image-placeholder':
            el = createImagePlaceholder(config, data);
            break;

        case 'text-block':
            el = createTextBlock(config, data);
            break;

        case 'container':
        case 'grid-container':
            el = document.createElement('div');
            el.className = `layout-${config.type}`;
            break;

        case 'overlay':
            el = document.createElement('div');
            el.className = 'layout-overlay';
            break;

        case 'divider':
            el = document.createElement('div');
            el.className = 'layout-divider';
            break;

        case 'feature-list':
            el = createFeatureList(config, data);
            break;

        default:
            el = document.createElement('div');
    }

    // Apply ID and styles
    if (config.id) el.id = config.id;
    if (config.style) {
        Object.assign(el.style, config.style);
    }

    return el;
}

/**
 * Create an image placeholder element
 */
function createImagePlaceholder(config, data) {
    const wrapper = document.createElement('div');
    wrapper.className = 'image-placeholder';
    wrapper.dataset.placeholderId = config.id;

    // Check if we have image data
    let imageUrl = data[config.id];

    // Special handling for logo placeholders - try to get from Brand Kit
    if (!imageUrl && config.id === 'agent-logo' && window.BrandKitV2) {
        imageUrl = window.BrandKitV2.getPrimaryLogo();
    }

    if (imageUrl) {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = config.label || 'Property image';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = config.style?.objectFit || 'cover';
        wrapper.appendChild(img);
    } else {
        // Show placeholder UI
        const isLogo = config.id === 'agent-logo';
        wrapper.innerHTML = `
            <div class="placeholder-content">
                <div class="placeholder-icon">${isLogo ? '🏢' : '📷'}</div>
                <div class="placeholder-label">${config.label || 'Drop image here'}</div>
                <div class="placeholder-hint">${isLogo ? 'Upload logo in Brand Kit' : 'Click to upload or drag & drop'}</div>
            </div>
        `;
    }

    // Make it droppable
    wrapper.addEventListener('dragover', handleDragOver);
    wrapper.addEventListener('drop', handleImageDrop);
    wrapper.addEventListener('click', handlePlaceholderClick);

    return wrapper;
}

/**
 * Create a text block element
 */
function createTextBlock(config, data) {
    const el = document.createElement('div');
    el.className = 'layout-text-block';
    el.contentEditable = 'true';
    el.dataset.placeholder = config.placeholder;

    // Use data if available, otherwise placeholder
    const content = data[config.id] || config.placeholder;
    el.textContent = content;

    // Add placeholder styling when empty
    el.addEventListener('focus', () => {
        if (el.textContent === config.placeholder) {
            el.textContent = '';
            el.classList.remove('is-placeholder');
        }
    });

    el.addEventListener('blur', () => {
        if (!el.textContent.trim()) {
            el.textContent = config.placeholder;
            el.classList.add('is-placeholder');
        }
    });

    if (el.textContent === config.placeholder) {
        el.classList.add('is-placeholder');
    }

    return el;
}

/**
 * Create a feature list element
 */
function createFeatureList(config, data) {
    const ul = document.createElement('ul');
    ul.className = 'layout-feature-list';

    const items = data[config.id] || config.items || [];
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        li.contentEditable = 'true';
        ul.appendChild(li);
    });

    return ul;
}

/**
 * Handle drag over for image drop
 */
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

/**
 * Handle image drop
 */
function handleImageDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const wrapper = e.currentTarget;
            wrapper.innerHTML = '';
            const img = document.createElement('img');
            img.src = event.target.result;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            wrapper.appendChild(img);
        };
        reader.readAsDataURL(files[0]);
    }
}

/**
 * Handle placeholder click for file upload
 */
function handlePlaceholderClick(e) {
    if (e.target.closest('.placeholder-content')) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const wrapper = e.currentTarget;
                    wrapper.innerHTML = '';
                    const img = document.createElement('img');
                    img.src = ev.target.result;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    wrapper.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }
}

/**
 * Get layouts by category
 */
function getLayoutsByCategory(category) {
    return Object.values(PageLayouts).filter(l => l.category === category);
}

/**
 * Get all available layouts
 */
function getAllLayouts() {
    return Object.values(PageLayouts);
}

// ============================================================================
// EXPORT
// ============================================================================

window.PageLayouts = PageLayouts;
window.applyPageLayout = applyPageLayout;
window.getLayoutsByCategory = getLayoutsByCategory;
window.getAllLayouts = getAllLayouts;

console.log('📐 PROFESSIONAL PAGE LAYOUTS LOADED');
console.log(`   ✅ Cover layouts: ${getLayoutsByCategory('cover').length}`);
console.log(`   ✅ Gallery layouts: ${getLayoutsByCategory('gallery').length}`);
console.log(`   ✅ Content layouts: ${getLayoutsByCategory('content').length}`);
console.log(`   ✅ Special layouts: ${getLayoutsByCategory('special').length}`);
