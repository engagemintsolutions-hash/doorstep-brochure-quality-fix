/**
 * REAL TEMPLATE SYSTEM
 * Actual unique template layouts (not just color swaps)
 * Each template has distinct element positions, sizes, and arrangements
 */

const RealTemplates = (function() {
    'use strict';

    // ==========================================================================
    // COVER PAGE LAYOUTS - 10 unique designs
    // ==========================================================================
    const COVER_LAYOUTS = {
        // Full bleed hero image with text overlay
        hero_full_bleed: {
            id: 'hero_full_bleed',
            name: 'Full Bleed Hero',
            description: 'Large hero image fills entire page',
            elements: [
                {
                    type: 'image',
                    id: 'hero_image',
                    role: 'hero',
                    style: { left: 0, top: 0, width: '100%', height: '100%', objectFit: 'cover' },
                    placeholder: 'Main property image'
                },
                {
                    type: 'overlay',
                    id: 'gradient_overlay',
                    style: {
                        left: 0, bottom: 0, width: '100%', height: '50%',
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))'
                    }
                },
                {
                    type: 'text',
                    id: 'price',
                    role: 'price',
                    style: {
                        left: '5%', bottom: '15%', fontSize: '48px', fontWeight: 'bold',
                        color: '#ffffff', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    },
                    placeholder: '£695,000'
                },
                {
                    type: 'text',
                    id: 'address',
                    role: 'address',
                    style: {
                        left: '5%', bottom: '8%', fontSize: '24px',
                        color: '#ffffff', textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    },
                    placeholder: '42 Primrose Lane, Richmond'
                },
                {
                    type: 'badge',
                    id: 'for_sale_badge',
                    style: {
                        right: '5%', top: '5%', padding: '12px 24px',
                        background: 'var(--primary-color)', color: 'white',
                        fontSize: '14px', fontWeight: 'bold', borderRadius: '4px'
                    },
                    content: 'FOR SALE'
                }
            ]
        },

        // Split layout - image left, content right
        hero_split_left: {
            id: 'hero_split_left',
            name: 'Split Left',
            description: 'Image on left, details on right',
            elements: [
                {
                    type: 'container',
                    id: 'image_container',
                    style: { left: 0, top: 0, width: '55%', height: '100%', background: '#f0f0f0' },
                    children: [
                        {
                            type: 'image',
                            id: 'hero_image',
                            role: 'hero',
                            style: { width: '100%', height: '100%', objectFit: 'cover' }
                        }
                    ]
                },
                {
                    type: 'container',
                    id: 'content_container',
                    style: {
                        right: 0, top: 0, width: '45%', height: '100%',
                        background: 'var(--bg-primary)', padding: '40px',
                        display: 'flex', flexDirection: 'column', justifyContent: 'center'
                    },
                    children: [
                        {
                            type: 'text',
                            id: 'price',
                            role: 'price',
                            style: { fontSize: '42px', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '16px' },
                            placeholder: '£695,000'
                        },
                        {
                            type: 'text',
                            id: 'address',
                            role: 'address',
                            style: { fontSize: '24px', fontWeight: '500', marginBottom: '24px' },
                            placeholder: '42 Primrose Lane\nRichmond, Surrey'
                        },
                        {
                            type: 'specs',
                            id: 'key_specs',
                            style: { display: 'flex', gap: '24px', marginBottom: '24px' },
                            items: ['4 Beds', '3 Baths', '2 Reception']
                        },
                        {
                            type: 'text',
                            id: 'tagline',
                            role: 'tagline',
                            style: { fontSize: '16px', color: 'var(--text-secondary)', fontStyle: 'italic' },
                            placeholder: 'A stunning family home in a sought-after location'
                        }
                    ]
                }
            ]
        },

        // Image with gradient overlay and centered text
        hero_overlay_center: {
            id: 'hero_overlay_center',
            name: 'Centered Overlay',
            description: 'Full image with centered text overlay',
            elements: [
                {
                    type: 'image',
                    id: 'hero_image',
                    role: 'hero',
                    style: { left: 0, top: 0, width: '100%', height: '100%', objectFit: 'cover' }
                },
                {
                    type: 'overlay',
                    id: 'dark_overlay',
                    style: {
                        left: 0, top: 0, width: '100%', height: '100%',
                        background: 'rgba(0,0,0,0.4)'
                    }
                },
                {
                    type: 'container',
                    id: 'centered_content',
                    style: {
                        position: 'absolute', left: '50%', top: '50%',
                        transform: 'translate(-50%, -50%)', textAlign: 'center'
                    },
                    children: [
                        {
                            type: 'badge',
                            id: 'status_badge',
                            style: {
                                display: 'inline-block', padding: '8px 24px',
                                background: 'var(--primary-color)', color: 'white',
                                fontSize: '12px', letterSpacing: '2px', marginBottom: '24px'
                            },
                            content: 'FOR SALE'
                        },
                        {
                            type: 'text',
                            id: 'address',
                            role: 'address',
                            style: {
                                fontSize: '36px', fontWeight: '300', color: 'white',
                                marginBottom: '16px', letterSpacing: '1px'
                            },
                            placeholder: '42 Primrose Lane, Richmond'
                        },
                        {
                            type: 'text',
                            id: 'price',
                            role: 'price',
                            style: { fontSize: '56px', fontWeight: 'bold', color: 'white' },
                            placeholder: '£695,000'
                        }
                    ]
                }
            ]
        },

        // Minimal - large text, small image
        hero_minimal: {
            id: 'hero_minimal',
            name: 'Minimal',
            description: 'Large text focus with small image',
            elements: [
                {
                    type: 'container',
                    id: 'main_container',
                    style: { width: '100%', height: '100%', padding: '60px', background: 'var(--bg-primary)' },
                    children: [
                        {
                            type: 'text',
                            id: 'price',
                            role: 'price',
                            style: {
                                fontSize: '72px', fontWeight: 'bold', color: 'var(--primary-color)',
                                marginBottom: '8px'
                            },
                            placeholder: '£695,000'
                        },
                        {
                            type: 'text',
                            id: 'address',
                            role: 'address',
                            style: { fontSize: '32px', fontWeight: '300', marginBottom: '40px' },
                            placeholder: '42 Primrose Lane, Richmond, Surrey'
                        },
                        {
                            type: 'divider',
                            style: { width: '80px', height: '4px', background: 'var(--primary-color)', marginBottom: '40px' }
                        },
                        {
                            type: 'specs',
                            id: 'specs_row',
                            style: { display: 'flex', gap: '40px', marginBottom: '40px' },
                            items: [
                                { icon: 'bed', value: '4', label: 'Bedrooms' },
                                { icon: 'bath', value: '3', label: 'Bathrooms' },
                                { icon: 'car', value: '2', label: 'Parking' }
                            ]
                        }
                    ]
                },
                {
                    type: 'image',
                    id: 'corner_image',
                    role: 'hero',
                    style: {
                        position: 'absolute', right: '40px', bottom: '40px',
                        width: '300px', height: '200px', objectFit: 'cover', borderRadius: '8px'
                    }
                }
            ]
        },

        // Collage - multiple images
        hero_collage: {
            id: 'hero_collage',
            name: 'Photo Collage',
            description: 'Multiple images in grid layout',
            elements: [
                {
                    type: 'container',
                    id: 'header',
                    style: { left: 0, top: 0, width: '100%', height: '20%', padding: '30px 40px', background: 'var(--primary-color)' },
                    children: [
                        {
                            type: 'text',
                            id: 'price',
                            role: 'price',
                            style: { fontSize: '42px', fontWeight: 'bold', color: 'white' },
                            placeholder: '£695,000'
                        },
                        {
                            type: 'text',
                            id: 'address',
                            role: 'address',
                            style: { fontSize: '18px', color: 'rgba(255,255,255,0.9)' },
                            placeholder: '42 Primrose Lane, Richmond, Surrey'
                        }
                    ]
                },
                {
                    type: 'grid',
                    id: 'photo_grid',
                    style: { left: 0, top: '20%', width: '100%', height: '80%', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4px' },
                    children: [
                        {
                            type: 'image',
                            id: 'main_image',
                            role: 'hero',
                            style: { gridRow: '1 / 3', width: '100%', height: '100%', objectFit: 'cover' }
                        },
                        {
                            type: 'image',
                            id: 'image_2',
                            role: 'room',
                            style: { width: '100%', height: '100%', objectFit: 'cover' }
                        },
                        {
                            type: 'image',
                            id: 'image_3',
                            role: 'room',
                            style: { width: '100%', height: '100%', objectFit: 'cover' }
                        }
                    ]
                }
            ]
        },

        // Magazine style with asymmetric layout
        hero_magazine: {
            id: 'hero_magazine',
            name: 'Magazine Style',
            description: 'Asymmetric editorial layout',
            elements: [
                {
                    type: 'image',
                    id: 'large_image',
                    role: 'hero',
                    style: {
                        position: 'absolute', left: '10%', top: '10%',
                        width: '50%', height: '70%', objectFit: 'cover'
                    }
                },
                {
                    type: 'container',
                    id: 'text_block',
                    style: {
                        position: 'absolute', right: '8%', top: '25%',
                        width: '35%', background: 'white', padding: '40px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    },
                    children: [
                        {
                            type: 'text',
                            id: 'price',
                            role: 'price',
                            style: { fontSize: '48px', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '16px' },
                            placeholder: '£695,000'
                        },
                        {
                            type: 'text',
                            id: 'address',
                            role: 'address',
                            style: { fontSize: '20px', lineHeight: '1.6', marginBottom: '20px' },
                            placeholder: '42 Primrose Lane\nRichmond, Surrey'
                        },
                        {
                            type: 'specs',
                            id: 'specs',
                            style: { borderTop: '1px solid #eee', paddingTop: '20px' },
                            items: ['4 Beds', '3 Baths', '2,400 sq ft']
                        }
                    ]
                },
                {
                    type: 'badge',
                    id: 'agent_badge',
                    style: {
                        position: 'absolute', left: '10%', bottom: '10%',
                        padding: '12px 24px', background: 'var(--primary-color)',
                        color: 'white', fontWeight: 'bold'
                    },
                    content: 'DOORSTEP PROPERTIES'
                }
            ]
        },

        // Bold geometric
        hero_geometric: {
            id: 'hero_geometric',
            name: 'Bold Geometric',
            description: 'Strong shapes and colors',
            elements: [
                {
                    type: 'shape',
                    id: 'bg_shape',
                    style: {
                        position: 'absolute', left: 0, top: 0,
                        width: '60%', height: '100%', background: 'var(--primary-color)',
                        clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)'
                    }
                },
                {
                    type: 'container',
                    id: 'content_left',
                    style: {
                        position: 'absolute', left: '40px', top: '50%',
                        transform: 'translateY(-50%)', width: '40%', color: 'white'
                    },
                    children: [
                        {
                            type: 'text',
                            id: 'price',
                            role: 'price',
                            style: { fontSize: '56px', fontWeight: 'bold', marginBottom: '16px' },
                            placeholder: '£695,000'
                        },
                        {
                            type: 'text',
                            id: 'address',
                            role: 'address',
                            style: { fontSize: '22px', opacity: '0.9', marginBottom: '24px' },
                            placeholder: '42 Primrose Lane\nRichmond, Surrey'
                        },
                        {
                            type: 'specs',
                            id: 'specs',
                            style: { display: 'flex', gap: '16px' },
                            items: ['4 Beds', '3 Baths']
                        }
                    ]
                },
                {
                    type: 'image',
                    id: 'hero_image',
                    role: 'hero',
                    style: {
                        position: 'absolute', right: '40px', top: '40px',
                        width: '45%', height: 'calc(100% - 80px)', objectFit: 'cover',
                        borderRadius: '8px'
                    }
                }
            ]
        },

        // Classic elegant
        hero_classic: {
            id: 'hero_classic',
            name: 'Classic Elegant',
            description: 'Traditional estate agent style',
            elements: [
                {
                    type: 'container',
                    id: 'frame',
                    style: {
                        position: 'absolute', left: '30px', top: '30px',
                        right: '30px', bottom: '30px',
                        border: '2px solid var(--primary-color)', padding: '30px'
                    },
                    children: [
                        {
                            type: 'image',
                            id: 'hero_image',
                            role: 'hero',
                            style: { width: '100%', height: '65%', objectFit: 'cover' }
                        },
                        {
                            type: 'container',
                            id: 'info_bar',
                            style: {
                                marginTop: '24px', display: 'flex',
                                justifyContent: 'space-between', alignItems: 'flex-start'
                            },
                            children: [
                                {
                                    type: 'text',
                                    id: 'address',
                                    role: 'address',
                                    style: { fontSize: '24px', fontWeight: '500' },
                                    placeholder: '42 Primrose Lane, Richmond, Surrey'
                                },
                                {
                                    type: 'text',
                                    id: 'price',
                                    role: 'price',
                                    style: { fontSize: '32px', fontWeight: 'bold', color: 'var(--primary-color)' },
                                    placeholder: '£695,000'
                                }
                            ]
                        },
                        {
                            type: 'specs',
                            id: 'specs',
                            style: { marginTop: '16px', display: 'flex', gap: '32px' },
                            items: ['4 Bedrooms', '3 Bathrooms', '2 Receptions', '2,400 sq ft']
                        }
                    ]
                }
            ]
        },

        // Modern vertical
        hero_vertical: {
            id: 'hero_vertical',
            name: 'Vertical Focus',
            description: 'Tall image with side text',
            elements: [
                {
                    type: 'container',
                    id: 'sidebar',
                    style: {
                        position: 'absolute', left: 0, top: 0,
                        width: '35%', height: '100%', background: '#1a1a1a',
                        padding: '60px 40px', display: 'flex',
                        flexDirection: 'column', justifyContent: 'center'
                    },
                    children: [
                        {
                            type: 'badge',
                            id: 'status',
                            style: {
                                alignSelf: 'flex-start', padding: '6px 16px',
                                background: 'var(--primary-color)', color: 'white',
                                fontSize: '11px', letterSpacing: '1px', marginBottom: '32px'
                            },
                            content: 'FOR SALE'
                        },
                        {
                            type: 'text',
                            id: 'price',
                            role: 'price',
                            style: { fontSize: '48px', fontWeight: 'bold', color: 'white', marginBottom: '16px' },
                            placeholder: '£695,000'
                        },
                        {
                            type: 'text',
                            id: 'address',
                            role: 'address',
                            style: { fontSize: '18px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' },
                            placeholder: '42 Primrose Lane\nRichmond\nSurrey TW10 6AH'
                        }
                    ]
                },
                {
                    type: 'image',
                    id: 'hero_image',
                    role: 'hero',
                    style: {
                        position: 'absolute', right: 0, top: 0,
                        width: '65%', height: '100%', objectFit: 'cover'
                    }
                }
            ]
        },

        // Polaroid style
        hero_polaroid: {
            id: 'hero_polaroid',
            name: 'Polaroid Style',
            description: 'Photo with white frame effect',
            elements: [
                {
                    type: 'container',
                    id: 'background',
                    style: { width: '100%', height: '100%', background: '#f5f5f5' }
                },
                {
                    type: 'container',
                    id: 'polaroid',
                    style: {
                        position: 'absolute', left: '50%', top: '50%',
                        transform: 'translate(-50%, -50%) rotate(-2deg)',
                        background: 'white', padding: '20px 20px 80px 20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                    },
                    children: [
                        {
                            type: 'image',
                            id: 'hero_image',
                            role: 'hero',
                            style: { width: '500px', height: '350px', objectFit: 'cover' }
                        },
                        {
                            type: 'text',
                            id: 'address',
                            role: 'address',
                            style: {
                                marginTop: '20px', fontSize: '24px',
                                fontFamily: '"Dancing Script", cursive', textAlign: 'center'
                            },
                            placeholder: '42 Primrose Lane'
                        }
                    ]
                },
                {
                    type: 'container',
                    id: 'price_badge',
                    style: {
                        position: 'absolute', right: '60px', top: '60px',
                        background: 'var(--primary-color)', color: 'white',
                        padding: '16px 24px', borderRadius: '50%',
                        transform: 'rotate(15deg)'
                    },
                    children: [
                        {
                            type: 'text',
                            id: 'price',
                            role: 'price',
                            style: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center' },
                            placeholder: '£695k'
                        }
                    ]
                }
            ]
        },

        // NEW: Luxury Dark
        hero_luxury_dark: {
            id: 'hero_luxury_dark',
            name: 'Luxury Dark',
            description: 'Dark elegant design with gold accents',
            elements: [
                {
                    type: 'container',
                    style: { width: '100%', height: '100%', background: '#1a1a1a' }
                },
                {
                    type: 'image',
                    id: 'hero_image',
                    role: 'hero',
                    style: {
                        position: 'absolute', right: 0, top: 0,
                        width: '60%', height: '100%', objectFit: 'cover',
                        opacity: '0.8'
                    }
                },
                {
                    type: 'container',
                    style: {
                        position: 'absolute', left: '50px', top: '50%',
                        transform: 'translateY(-50%)', width: '40%'
                    },
                    children: [
                        {
                            type: 'text',
                            content: 'FOR SALE',
                            style: { fontSize: '12px', letterSpacing: '3px', color: '#D4AF37', marginBottom: '20px' }
                        },
                        {
                            type: 'text',
                            id: 'price',
                            role: 'price',
                            style: { fontSize: '52px', fontWeight: '300', color: '#D4AF37', marginBottom: '16px', fontFamily: '"Playfair Display", serif' },
                            placeholder: '£1,250,000'
                        },
                        {
                            type: 'text',
                            id: 'address',
                            role: 'address',
                            style: { fontSize: '20px', color: 'white', lineHeight: '1.6', opacity: '0.9' },
                            placeholder: '42 Primrose Lane\nRichmond, Surrey'
                        }
                    ]
                }
            ]
        },

        // NEW: Split Diagonal
        hero_split_diagonal: {
            id: 'hero_split_diagonal',
            name: 'Diagonal Split',
            description: 'Dynamic diagonal layout',
            elements: [
                {
                    type: 'container',
                    style: {
                        width: '100%', height: '100%',
                        background: 'linear-gradient(135deg, var(--primary-color) 50%, transparent 50%)'
                    }
                },
                {
                    type: 'image',
                    id: 'hero_image',
                    role: 'hero',
                    style: {
                        position: 'absolute', right: 0, top: 0,
                        width: '65%', height: '100%', objectFit: 'cover',
                        clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)'
                    }
                },
                {
                    type: 'container',
                    style: {
                        position: 'absolute', left: '40px', top: '50%',
                        transform: 'translateY(-50%)', width: '35%', color: 'white'
                    },
                    children: [
                        {
                            type: 'text',
                            id: 'price',
                            role: 'price',
                            style: { fontSize: '48px', fontWeight: 'bold', marginBottom: '12px' },
                            placeholder: '£695,000'
                        },
                        {
                            type: 'text',
                            id: 'address',
                            role: 'address',
                            style: { fontSize: '18px', opacity: '0.9' },
                            placeholder: '42 Primrose Lane, Richmond'
                        }
                    ]
                }
            ]
        },

        // NEW: Boxed Frame
        hero_boxed_frame: {
            id: 'hero_boxed_frame',
            name: 'Boxed Frame',
            description: 'Image in decorative frame',
            elements: [
                {
                    type: 'container',
                    style: { width: '100%', height: '100%', background: '#fafafa', padding: '40px' }
                },
                {
                    type: 'container',
                    style: {
                        width: '100%', height: '100%',
                        border: '2px solid var(--primary-color)',
                        padding: '20px', position: 'relative'
                    },
                    children: [
                        {
                            type: 'image',
                            id: 'hero_image',
                            role: 'hero',
                            style: { width: '100%', height: '70%', objectFit: 'cover' }
                        },
                        {
                            type: 'container',
                            style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' },
                            children: [
                                {
                                    type: 'text',
                                    id: 'address',
                                    role: 'address',
                                    style: { fontSize: '22px', fontWeight: '500' },
                                    placeholder: '42 Primrose Lane, Richmond'
                                },
                                {
                                    type: 'text',
                                    id: 'price',
                                    role: 'price',
                                    style: { fontSize: '28px', fontWeight: 'bold', color: 'var(--primary-color)' },
                                    placeholder: '£695,000'
                                }
                            ]
                        }
                    ]
                }
            ]
        },

        // NEW: Bottom Bar
        hero_bottom_bar: {
            id: 'hero_bottom_bar',
            name: 'Bottom Bar',
            description: 'Full image with info bar at bottom',
            elements: [
                {
                    type: 'image',
                    id: 'hero_image',
                    role: 'hero',
                    style: { width: '100%', height: '80%', objectFit: 'cover' }
                },
                {
                    type: 'container',
                    style: {
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: '20%', background: 'var(--primary-color)', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0 40px'
                    },
                    children: [
                        {
                            type: 'container',
                            children: [
                                {
                                    type: 'text',
                                    id: 'address',
                                    role: 'address',
                                    style: { fontSize: '24px', fontWeight: '500' },
                                    placeholder: '42 Primrose Lane, Richmond'
                                },
                                {
                                    type: 'specs',
                                    style: { marginTop: '8px', display: 'flex', gap: '20px', opacity: '0.9' },
                                    items: ['4 Beds', '3 Baths', '2,400 sq ft']
                                }
                            ]
                        },
                        {
                            type: 'text',
                            id: 'price',
                            role: 'price',
                            style: { fontSize: '36px', fontWeight: 'bold' },
                            placeholder: '£695,000'
                        }
                    ]
                }
            ]
        },

        // NEW: Two Photos Grid
        hero_two_photos: {
            id: 'hero_two_photos',
            name: 'Two Photos',
            description: 'Two photos side by side',
            elements: [
                {
                    type: 'container',
                    style: { width: '100%', height: '70%', display: 'flex', gap: '10px', padding: '20px' }
                },
                {
                    type: 'image',
                    id: 'hero_image',
                    role: 'hero',
                    style: { flex: '1', objectFit: 'cover', borderRadius: '8px' }
                },
                {
                    type: 'image',
                    id: 'image_2',
                    role: 'room',
                    style: { flex: '1', objectFit: 'cover', borderRadius: '8px' }
                },
                {
                    type: 'container',
                    style: {
                        position: 'absolute', bottom: '20px', left: '20px', right: '20px',
                        background: 'white', padding: '30px', borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    },
                    children: [
                        {
                            type: 'container',
                            children: [
                                {
                                    type: 'text',
                                    id: 'address',
                                    role: 'address',
                                    style: { fontSize: '22px', fontWeight: '600', marginBottom: '8px' },
                                    placeholder: '42 Primrose Lane, Richmond'
                                },
                                {
                                    type: 'specs',
                                    style: { display: 'flex', gap: '16px', color: '#666' },
                                    items: ['4 Beds', '3 Baths']
                                }
                            ]
                        },
                        {
                            type: 'text',
                            id: 'price',
                            role: 'price',
                            style: { fontSize: '32px', fontWeight: 'bold', color: 'var(--primary-color)' },
                            placeholder: '£695,000'
                        }
                    ]
                }
            ]
        },

        // NEW: Arch Frame Cover
        hero_arch_frame: {
            id: 'hero_arch_frame',
            name: 'Arch Frame',
            description: 'Image in elegant arch shape',
            elements: [
                {
                    type: 'container',
                    style: { width: '100%', height: '100%', background: '#f8f6f3', display: 'flex', justifyContent: 'center', alignItems: 'center' }
                },
                {
                    type: 'container',
                    style: {
                        width: '60%', height: '80%', borderRadius: '200px 200px 0 0',
                        overflow: 'hidden', position: 'relative'
                    },
                    children: [
                        {
                            type: 'image',
                            id: 'hero_image',
                            role: 'hero',
                            style: { width: '100%', height: '100%', objectFit: 'cover' }
                        }
                    ]
                },
                {
                    type: 'container',
                    style: { position: 'absolute', bottom: '40px', left: '0', right: '0', textAlign: 'center' },
                    children: [
                        {
                            type: 'text',
                            id: 'price',
                            role: 'price',
                            style: { fontSize: '42px', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '8px' },
                            placeholder: '£695,000'
                        },
                        {
                            type: 'text',
                            id: 'address',
                            role: 'address',
                            style: { fontSize: '18px', color: '#666' },
                            placeholder: '42 Primrose Lane, Richmond'
                        }
                    ]
                }
            ]
        },

        // NEW: Gradient Overlay Bold
        hero_gradient_bold: {
            id: 'hero_gradient_bold',
            name: 'Gradient Bold',
            description: 'Bold gradient with large text',
            elements: [
                {
                    type: 'image',
                    id: 'hero_image',
                    role: 'hero',
                    style: { width: '100%', height: '100%', objectFit: 'cover' }
                },
                {
                    type: 'container',
                    style: {
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'linear-gradient(135deg, rgba(194,4,48,0.9) 0%, rgba(194,4,48,0.3) 100%)'
                    }
                },
                {
                    type: 'container',
                    style: { position: 'absolute', top: '50%', left: '50px', transform: 'translateY(-50%)', color: 'white', maxWidth: '50%' },
                    children: [
                        {
                            type: 'text',
                            id: 'price',
                            role: 'price',
                            style: { fontSize: '72px', fontWeight: '800', lineHeight: '1', marginBottom: '16px' },
                            placeholder: '£695K'
                        },
                        {
                            type: 'text',
                            id: 'address',
                            role: 'address',
                            style: { fontSize: '24px', fontWeight: '300', opacity: '0.9' },
                            placeholder: '42 Primrose Lane, Richmond'
                        }
                    ]
                }
            ]
        },

        // NEW: Vertical Split
        hero_vertical_split: {
            id: 'hero_vertical_split',
            name: 'Vertical Split',
            description: 'Narrow text bar with image',
            elements: [
                {
                    type: 'container',
                    style: { display: 'flex', height: '100%' },
                    children: [
                        {
                            type: 'container',
                            style: {
                                width: '25%', background: 'var(--primary-color)', color: 'white',
                                padding: '40px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                            },
                            children: [
                                { type: 'logo', style: { filter: 'brightness(0) invert(1)', height: '30px' } },
                                {
                                    type: 'container',
                                    children: [
                                        { type: 'text', content: 'FOR SALE', style: { fontSize: '11px', letterSpacing: '2px', marginBottom: '16px', opacity: '0.7' } },
                                        {
                                            type: 'text',
                                            id: 'price',
                                            role: 'price',
                                            style: { fontSize: '28px', fontWeight: 'bold', marginBottom: '12px' },
                                            placeholder: '£695,000'
                                        },
                                        {
                                            type: 'text',
                                            id: 'address',
                                            role: 'address',
                                            style: { fontSize: '14px', lineHeight: '1.5', opacity: '0.9' },
                                            placeholder: '42 Primrose Lane\nRichmond\nSurrey'
                                        }
                                    ]
                                },
                                {
                                    type: 'container',
                                    children: [
                                        { type: 'text', content: '4 Beds | 3 Baths', style: { fontSize: '12px', opacity: '0.8' } }
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'image',
                            id: 'hero_image',
                            role: 'hero',
                            style: { width: '75%', objectFit: 'cover' }
                        }
                    ]
                }
            ]
        },

        // NEW: Corner Badge
        hero_corner_badge: {
            id: 'hero_corner_badge',
            name: 'Corner Badge',
            description: 'Large corner price badge',
            elements: [
                {
                    type: 'image',
                    id: 'hero_image',
                    role: 'hero',
                    style: { width: '100%', height: '100%', objectFit: 'cover' }
                },
                {
                    type: 'container',
                    style: {
                        position: 'absolute', top: 0, right: 0,
                        width: '0', height: '0',
                        borderTop: '200px solid var(--primary-color)',
                        borderLeft: '200px solid transparent'
                    }
                },
                {
                    type: 'text',
                    id: 'price',
                    role: 'price',
                    style: {
                        position: 'absolute', top: '40px', right: '20px',
                        color: 'white', fontSize: '24px', fontWeight: 'bold',
                        transform: 'rotate(45deg)', transformOrigin: 'center'
                    },
                    placeholder: '£695K'
                },
                {
                    type: 'container',
                    style: {
                        position: 'absolute', bottom: '40px', left: '40px',
                        background: 'white', padding: '24px 32px', borderRadius: '4px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    },
                    children: [
                        {
                            type: 'text',
                            id: 'address',
                            role: 'address',
                            style: { fontSize: '20px', fontWeight: '600' },
                            placeholder: '42 Primrose Lane, Richmond'
                        }
                    ]
                }
            ]
        },

        // NEW: Magazine Style Cover
        hero_magazine: {
            id: 'hero_magazine',
            name: 'Magazine Style',
            description: 'Editorial magazine layout',
            elements: [
                {
                    type: 'image',
                    id: 'hero_image',
                    role: 'hero',
                    style: { width: '100%', height: '100%', objectFit: 'cover' }
                },
                {
                    type: 'container',
                    style: {
                        position: 'absolute', top: '30px', left: '30px', right: '30px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'
                    },
                    children: [
                        { type: 'logo', style: { height: '40px' } },
                        { type: 'text', content: 'PREMIUM PROPERTY', style: { fontSize: '11px', letterSpacing: '3px', color: 'white', background: 'rgba(0,0,0,0.5)', padding: '8px 16px' } }
                    ]
                },
                {
                    type: 'container',
                    style: {
                        position: 'absolute', bottom: '60px', left: '40px', right: '40px',
                        color: 'white'
                    },
                    children: [
                        {
                            type: 'text',
                            id: 'price',
                            role: 'price',
                            style: { fontSize: '64px', fontWeight: '300', fontFamily: '"Playfair Display", serif', marginBottom: '8px', textShadow: '0 2px 20px rgba(0,0,0,0.3)' },
                            placeholder: '£1,250,000'
                        },
                        {
                            type: 'text',
                            id: 'address',
                            role: 'address',
                            style: { fontSize: '22px', fontWeight: '400', textShadow: '0 2px 10px rgba(0,0,0,0.3)' },
                            placeholder: '42 Primrose Lane, Richmond upon Thames'
                        }
                    ]
                }
            ]
        }
    };

    // ==========================================================================
    // DETAILS PAGE LAYOUTS - 10 unique designs
    // ==========================================================================
    const DETAILS_LAYOUTS = {
        two_column_classic: {
            id: 'two_column_classic',
            name: 'Two Column Classic',
            description: 'Features on left, description on right',
            elements: [
                {
                    type: 'header',
                    id: 'page_header',
                    style: {
                        width: '100%', padding: '30px 40px',
                        borderBottom: '2px solid var(--primary-color)'
                    },
                    children: [
                        {
                            type: 'text',
                            id: 'title',
                            style: { fontSize: '28px', fontWeight: 'bold' },
                            content: 'Property Details'
                        }
                    ]
                },
                {
                    type: 'container',
                    id: 'content',
                    style: { display: 'flex', padding: '40px', gap: '40px' },
                    children: [
                        {
                            type: 'container',
                            id: 'left_column',
                            style: { width: '40%' },
                            children: [
                                {
                                    type: 'text',
                                    id: 'features_title',
                                    style: { fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--primary-color)' },
                                    content: 'Key Features'
                                },
                                {
                                    type: 'list',
                                    id: 'features_list',
                                    role: 'features',
                                    style: { listStyle: 'none', padding: 0 },
                                    placeholder: ['Victorian character', 'South-facing garden', 'Recently renovated', 'Close to transport']
                                }
                            ]
                        },
                        {
                            type: 'container',
                            id: 'right_column',
                            style: { width: '60%' },
                            children: [
                                {
                                    type: 'text',
                                    id: 'description_title',
                                    style: { fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--primary-color)' },
                                    content: 'Description'
                                },
                                {
                                    type: 'text',
                                    id: 'description',
                                    role: 'description',
                                    style: { fontSize: '14px', lineHeight: '1.8', color: '#333' },
                                    placeholder: 'A stunning Victorian family home...'
                                }
                            ]
                        }
                    ]
                }
            ]
        },

        feature_grid: {
            id: 'feature_grid',
            name: 'Feature Grid',
            description: 'Features displayed in card grid',
            elements: [
                {
                    type: 'text',
                    id: 'title',
                    style: {
                        fontSize: '32px', fontWeight: 'bold', textAlign: 'center',
                        padding: '40px 0 30px', color: 'var(--primary-color)'
                    },
                    content: 'Property Highlights'
                },
                {
                    type: 'grid',
                    id: 'features_grid',
                    style: {
                        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '24px', padding: '0 40px'
                    },
                    children: [
                        { type: 'feature_card', icon: 'bed', value: '4', label: 'Bedrooms' },
                        { type: 'feature_card', icon: 'bath', value: '3', label: 'Bathrooms' },
                        { type: 'feature_card', icon: 'sofa', value: '2', label: 'Receptions' },
                        { type: 'feature_card', icon: 'ruler', value: '2,400', label: 'Sq Ft' },
                        { type: 'feature_card', icon: 'car', value: '2', label: 'Parking' },
                        { type: 'feature_card', icon: 'leaf', value: 'South', label: 'Facing Garden' }
                    ]
                },
                {
                    type: 'container',
                    id: 'description_section',
                    style: { padding: '40px', marginTop: '20px' },
                    children: [
                        {
                            type: 'text',
                            id: 'description',
                            role: 'description',
                            style: { fontSize: '15px', lineHeight: '1.8', textAlign: 'justify' },
                            placeholder: 'Property description goes here...'
                        }
                    ]
                }
            ]
        },

        magazine_style: {
            id: 'magazine_style',
            name: 'Magazine Style',
            description: 'Editorial layout with pull quote',
            elements: [
                {
                    type: 'container',
                    id: 'page_layout',
                    style: { display: 'flex', height: '100%' },
                    children: [
                        {
                            type: 'container',
                            id: 'main_content',
                            style: { width: '65%', padding: '50px' },
                            children: [
                                {
                                    type: 'text',
                                    id: 'title',
                                    style: { fontSize: '36px', fontWeight: 'bold', marginBottom: '30px' },
                                    content: 'The Property'
                                },
                                {
                                    type: 'text',
                                    id: 'description',
                                    role: 'description',
                                    style: { fontSize: '14px', lineHeight: '2', columnCount: 2, columnGap: '30px' },
                                    placeholder: 'Description...'
                                }
                            ]
                        },
                        {
                            type: 'container',
                            id: 'sidebar',
                            style: {
                                width: '35%', background: 'var(--primary-color)',
                                color: 'white', padding: '50px'
                            },
                            children: [
                                {
                                    type: 'text',
                                    id: 'pull_quote',
                                    style: {
                                        fontSize: '24px', fontStyle: 'italic',
                                        lineHeight: '1.6', marginBottom: '40px'
                                    },
                                    content: '"An exceptional family home with character and charm"'
                                },
                                {
                                    type: 'list',
                                    id: 'features',
                                    role: 'features',
                                    style: { listStyle: 'none' },
                                    placeholder: ['Victorian character', 'Recently renovated']
                                }
                            ]
                        }
                    ]
                }
            ]
        },

        infographic: {
            id: 'infographic',
            name: 'Infographic',
            description: 'Visual data presentation',
            elements: [
                {
                    type: 'container',
                    id: 'header_bar',
                    style: {
                        background: 'var(--primary-color)', padding: '20px 40px',
                        display: 'flex', justifyContent: 'space-between', color: 'white'
                    },
                    children: [
                        { type: 'text', content: 'Property Overview', style: { fontSize: '24px', fontWeight: 'bold' } },
                        { type: 'text', id: 'epc', role: 'epc', content: 'EPC: B', style: { fontSize: '18px' } }
                    ]
                },
                {
                    type: 'container',
                    id: 'stats_row',
                    style: {
                        display: 'flex', justifyContent: 'space-around',
                        padding: '40px', background: '#f9f9f9'
                    },
                    children: [
                        { type: 'stat_circle', value: '4', label: 'Beds', color: 'var(--primary-color)' },
                        { type: 'stat_circle', value: '3', label: 'Baths', color: 'var(--primary-color)' },
                        { type: 'stat_circle', value: '2.4k', label: 'Sq Ft', color: 'var(--primary-color)' },
                        { type: 'stat_circle', value: '1890', label: 'Built', color: 'var(--primary-color)' }
                    ]
                },
                {
                    type: 'container',
                    id: 'features_description',
                    style: { padding: '40px', display: 'flex', gap: '40px' },
                    children: [
                        {
                            type: 'container',
                            style: { width: '50%' },
                            children: [
                                { type: 'text', content: 'Features', style: { fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' } },
                                { type: 'list', id: 'features', role: 'features' }
                            ]
                        },
                        {
                            type: 'container',
                            style: { width: '50%' },
                            children: [
                                { type: 'text', content: 'About', style: { fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' } },
                                { type: 'text', id: 'description', role: 'description', style: { lineHeight: '1.8' } }
                            ]
                        }
                    ]
                }
            ]
        },

        cards_layout: {
            id: 'cards_layout',
            name: 'Cards Layout',
            description: 'Information in card containers',
            elements: [
                {
                    type: 'text',
                    id: 'page_title',
                    style: { fontSize: '28px', fontWeight: 'bold', padding: '30px 40px', borderBottom: '1px solid #eee' },
                    content: 'Property Information'
                },
                {
                    type: 'grid',
                    id: 'cards_grid',
                    style: {
                        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '24px', padding: '30px 40px'
                    },
                    children: [
                        {
                            type: 'card',
                            style: { background: '#f9f9f9', padding: '24px', borderRadius: '8px' },
                            children: [
                                { type: 'text', content: 'Key Features', style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' } },
                                { type: 'list', id: 'features', role: 'features' }
                            ]
                        },
                        {
                            type: 'card',
                            style: { background: '#f9f9f9', padding: '24px', borderRadius: '8px' },
                            children: [
                                { type: 'text', content: 'Property Specifications', style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' } },
                                { type: 'specs_list', id: 'specs' }
                            ]
                        },
                        {
                            type: 'card',
                            style: { background: '#f9f9f9', padding: '24px', borderRadius: '8px', gridColumn: '1 / -1' },
                            children: [
                                { type: 'text', content: 'Description', style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' } },
                                { type: 'text', id: 'description', role: 'description', style: { lineHeight: '1.8' } }
                            ]
                        }
                    ]
                }
            ]
        },

        // NEW: Image with Description Overlay
        image_description_overlay: {
            id: 'image_description_overlay',
            name: 'Image with Description',
            description: 'Large image with text overlay',
            elements: [
                {
                    type: 'container',
                    style: { width: '100%', height: '100%', position: 'relative' },
                    children: [
                        {
                            type: 'image',
                            id: 'bg_image',
                            role: 'room',
                            style: { width: '100%', height: '100%', objectFit: 'cover' }
                        },
                        {
                            type: 'container',
                            style: {
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                padding: '60px 40px 40px', color: 'white'
                            },
                            children: [
                                {
                                    type: 'text',
                                    content: 'About This Property',
                                    style: { fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }
                                },
                                {
                                    type: 'text',
                                    id: 'description',
                                    role: 'description',
                                    style: { fontSize: '14px', lineHeight: '1.8', opacity: '0.9' },
                                    placeholder: 'A stunning Victorian family home...'
                                }
                            ]
                        }
                    ]
                }
            ]
        },

        // NEW: Sidebar Features
        sidebar_features: {
            id: 'sidebar_features',
            name: 'Sidebar Features',
            description: 'Features in colored sidebar',
            elements: [
                {
                    type: 'container',
                    style: { display: 'flex', height: '100%' },
                    children: [
                        {
                            type: 'container',
                            style: { width: '35%', background: 'var(--primary-color)', color: 'white', padding: '40px' },
                            children: [
                                {
                                    type: 'text',
                                    content: 'Key Features',
                                    style: { fontSize: '24px', fontWeight: 'bold', marginBottom: '30px' }
                                },
                                {
                                    type: 'list',
                                    id: 'features',
                                    role: 'features',
                                    style: { listStyle: 'none', padding: 0 },
                                    placeholder: ['Period features', 'South-facing garden', 'Recently renovated']
                                }
                            ]
                        },
                        {
                            type: 'container',
                            style: { width: '65%', padding: '40px' },
                            children: [
                                {
                                    type: 'text',
                                    content: 'Property Description',
                                    style: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }
                                },
                                {
                                    type: 'text',
                                    id: 'description',
                                    role: 'description',
                                    style: { fontSize: '15px', lineHeight: '1.9', color: '#444' }
                                }
                            ]
                        }
                    ]
                }
            ]
        },

        // NEW: Stats Bar Layout
        stats_bar: {
            id: 'stats_bar',
            name: 'Stats Bar',
            description: 'Prominent statistics bar',
            elements: [
                {
                    type: 'container',
                    style: {
                        background: 'var(--primary-color)', color: 'white',
                        display: 'flex', justifyContent: 'space-around', padding: '30px 20px'
                    },
                    children: [
                        {
                            type: 'container',
                            style: { textAlign: 'center' },
                            children: [
                                { type: 'text', content: '4', style: { fontSize: '42px', fontWeight: 'bold' } },
                                { type: 'text', content: 'Bedrooms', style: { fontSize: '13px', opacity: '0.8' } }
                            ]
                        },
                        {
                            type: 'container',
                            style: { textAlign: 'center' },
                            children: [
                                { type: 'text', content: '3', style: { fontSize: '42px', fontWeight: 'bold' } },
                                { type: 'text', content: 'Bathrooms', style: { fontSize: '13px', opacity: '0.8' } }
                            ]
                        },
                        {
                            type: 'container',
                            style: { textAlign: 'center' },
                            children: [
                                { type: 'text', content: '2,400', style: { fontSize: '42px', fontWeight: 'bold' } },
                                { type: 'text', content: 'Sq Ft', style: { fontSize: '13px', opacity: '0.8' } }
                            ]
                        },
                        {
                            type: 'container',
                            style: { textAlign: 'center' },
                            children: [
                                { type: 'text', content: 'B', style: { fontSize: '42px', fontWeight: 'bold' } },
                                { type: 'text', content: 'EPC Rating', style: { fontSize: '13px', opacity: '0.8' } }
                            ]
                        }
                    ]
                },
                {
                    type: 'container',
                    style: { padding: '40px', display: 'flex', gap: '40px' },
                    children: [
                        {
                            type: 'container',
                            style: { width: '50%' },
                            children: [
                                { type: 'text', content: 'Key Features', style: { fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' } },
                                { type: 'list', id: 'features', role: 'features' }
                            ]
                        },
                        {
                            type: 'container',
                            style: { width: '50%' },
                            children: [
                                { type: 'text', content: 'Description', style: { fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' } },
                                { type: 'text', id: 'description', role: 'description', style: { lineHeight: '1.8' } }
                            ]
                        }
                    ]
                }
            ]
        },

        // NEW: Timeline Layout
        timeline_layout: {
            id: 'timeline_layout',
            name: 'Timeline',
            description: 'Features in timeline format',
            elements: [
                {
                    type: 'text',
                    style: { fontSize: '28px', fontWeight: 'bold', padding: '30px 40px', borderBottom: '2px solid var(--primary-color)' },
                    content: 'Property Highlights'
                },
                {
                    type: 'container',
                    style: { padding: '30px 40px 30px 80px', position: 'relative' },
                    children: [
                        {
                            type: 'container',
                            style: {
                                position: 'absolute', left: '50px', top: '30px', bottom: '30px',
                                width: '2px', background: 'var(--primary-color)'
                            }
                        },
                        {
                            type: 'container',
                            style: { marginBottom: '30px', position: 'relative', paddingLeft: '30px' },
                            children: [
                                {
                                    type: 'container',
                                    style: {
                                        position: 'absolute', left: '-38px', top: '5px',
                                        width: '16px', height: '16px', borderRadius: '50%',
                                        background: 'var(--primary-color)'
                                    }
                                },
                                { type: 'text', content: 'Victorian Character', style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' } },
                                { type: 'text', content: 'Original features including cornicing and fireplaces', style: { color: '#666' } }
                            ]
                        },
                        {
                            type: 'container',
                            style: { marginBottom: '30px', position: 'relative', paddingLeft: '30px' },
                            children: [
                                {
                                    type: 'container',
                                    style: {
                                        position: 'absolute', left: '-38px', top: '5px',
                                        width: '16px', height: '16px', borderRadius: '50%',
                                        background: 'var(--primary-color)'
                                    }
                                },
                                { type: 'text', content: 'South-Facing Garden', style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' } },
                                { type: 'text', content: 'Beautifully maintained private garden', style: { color: '#666' } }
                            ]
                        },
                        {
                            type: 'container',
                            style: { position: 'relative', paddingLeft: '30px' },
                            children: [
                                {
                                    type: 'container',
                                    style: {
                                        position: 'absolute', left: '-38px', top: '5px',
                                        width: '16px', height: '16px', borderRadius: '50%',
                                        background: 'var(--primary-color)'
                                    }
                                },
                                { type: 'text', content: 'Prime Location', style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' } },
                                { type: 'text', content: 'Walking distance to shops and transport', style: { color: '#666' } }
                            ]
                        }
                    ]
                }
            ]
        },

        // NEW: Icon Features Layout
        icon_features: {
            id: 'icon_features',
            name: 'Icon Features',
            description: 'Features with large icons',
            elements: [
                {
                    type: 'text',
                    style: { fontSize: '32px', fontWeight: 'bold', textAlign: 'center', padding: '40px 40px 20px' },
                    content: 'Property Features'
                },
                {
                    type: 'container',
                    style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', padding: '20px 60px' },
                    children: [
                        {
                            type: 'container',
                            style: { textAlign: 'center', padding: '20px' },
                            children: [
                                { type: 'container', style: { fontSize: '48px', marginBottom: '12px' }, content: '🛏️' },
                                { type: 'text', content: '4 Bedrooms', style: { fontSize: '18px', fontWeight: 'bold' } },
                                { type: 'text', content: 'Spacious double rooms', style: { fontSize: '14px', color: '#666', marginTop: '8px' } }
                            ]
                        },
                        {
                            type: 'container',
                            style: { textAlign: 'center', padding: '20px' },
                            children: [
                                { type: 'container', style: { fontSize: '48px', marginBottom: '12px' }, content: '🚿' },
                                { type: 'text', content: '2 Bathrooms', style: { fontSize: '18px', fontWeight: 'bold' } },
                                { type: 'text', content: 'Modern fixtures', style: { fontSize: '14px', color: '#666', marginTop: '8px' } }
                            ]
                        },
                        {
                            type: 'container',
                            style: { textAlign: 'center', padding: '20px' },
                            children: [
                                { type: 'container', style: { fontSize: '48px', marginBottom: '12px' }, content: '🚗' },
                                { type: 'text', content: 'Double Garage', style: { fontSize: '18px', fontWeight: 'bold' } },
                                { type: 'text', content: 'Electric door', style: { fontSize: '14px', color: '#666', marginTop: '8px' } }
                            ]
                        },
                        {
                            type: 'container',
                            style: { textAlign: 'center', padding: '20px' },
                            children: [
                                { type: 'container', style: { fontSize: '48px', marginBottom: '12px' }, content: '🌳' },
                                { type: 'text', content: 'Large Garden', style: { fontSize: '18px', fontWeight: 'bold' } },
                                { type: 'text', content: 'South facing', style: { fontSize: '14px', color: '#666', marginTop: '8px' } }
                            ]
                        },
                        {
                            type: 'container',
                            style: { textAlign: 'center', padding: '20px' },
                            children: [
                                { type: 'container', style: { fontSize: '48px', marginBottom: '12px' }, content: '📐' },
                                { type: 'text', content: '2,400 sq ft', style: { fontSize: '18px', fontWeight: 'bold' } },
                                { type: 'text', content: 'Total floor area', style: { fontSize: '14px', color: '#666', marginTop: '8px' } }
                            ]
                        },
                        {
                            type: 'container',
                            style: { textAlign: 'center', padding: '20px' },
                            children: [
                                { type: 'container', style: { fontSize: '48px', marginBottom: '12px' }, content: '⚡' },
                                { type: 'text', content: 'EPC Rating B', style: { fontSize: '18px', fontWeight: 'bold' } },
                                { type: 'text', content: 'Energy efficient', style: { fontSize: '14px', color: '#666', marginTop: '8px' } }
                            ]
                        }
                    ]
                }
            ]
        },

        // NEW: Numbered Features List
        numbered_features: {
            id: 'numbered_features',
            name: 'Numbered Features',
            description: 'Large numbered feature list',
            elements: [
                {
                    type: 'container',
                    style: { display: 'flex', height: '100%' },
                    children: [
                        {
                            type: 'container',
                            style: { width: '45%', background: 'var(--primary-color)', padding: '50px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
                            children: [
                                { type: 'text', content: 'Key', style: { fontSize: '14px', letterSpacing: '3px', opacity: '0.8' } },
                                { type: 'text', content: 'Features', style: { fontSize: '52px', fontWeight: '300', marginTop: '8px' } }
                            ]
                        },
                        {
                            type: 'container',
                            style: { width: '55%', padding: '40px 50px' },
                            children: [
                                {
                                    type: 'container',
                                    style: { display: 'flex', alignItems: 'flex-start', marginBottom: '25px' },
                                    children: [
                                        { type: 'text', content: '01', style: { fontSize: '42px', fontWeight: '200', color: 'var(--primary-color)', marginRight: '20px', lineHeight: '1' } },
                                        {
                                            type: 'container',
                                            children: [
                                                { type: 'text', content: 'Stunning Period Features', style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' } },
                                                { type: 'text', content: 'Original cornicing, fireplaces and wood floors', style: { fontSize: '14px', color: '#666' } }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'container',
                                    style: { display: 'flex', alignItems: 'flex-start', marginBottom: '25px' },
                                    children: [
                                        { type: 'text', content: '02', style: { fontSize: '42px', fontWeight: '200', color: 'var(--primary-color)', marginRight: '20px', lineHeight: '1' } },
                                        {
                                            type: 'container',
                                            children: [
                                                { type: 'text', content: 'Prime Location', style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' } },
                                                { type: 'text', content: 'Walking distance to excellent schools', style: { fontSize: '14px', color: '#666' } }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'container',
                                    style: { display: 'flex', alignItems: 'flex-start', marginBottom: '25px' },
                                    children: [
                                        { type: 'text', content: '03', style: { fontSize: '42px', fontWeight: '200', color: 'var(--primary-color)', marginRight: '20px', lineHeight: '1' } },
                                        {
                                            type: 'container',
                                            children: [
                                                { type: 'text', content: 'Private Garden', style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' } },
                                                { type: 'text', content: 'South-facing 80ft landscaped garden', style: { fontSize: '14px', color: '#666' } }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'container',
                                    style: { display: 'flex', alignItems: 'flex-start' },
                                    children: [
                                        { type: 'text', content: '04', style: { fontSize: '42px', fontWeight: '200', color: 'var(--primary-color)', marginRight: '20px', lineHeight: '1' } },
                                        {
                                            type: 'container',
                                            children: [
                                                { type: 'text', content: 'Modern Kitchen', style: { fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' } },
                                                { type: 'text', content: 'Fully fitted with integrated appliances', style: { fontSize: '14px', color: '#666' } }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    };

    // ==========================================================================
    // GALLERY PAGE LAYOUTS - 10 unique designs
    // ==========================================================================
    const GALLERY_LAYOUTS = {
        masonry_grid: {
            id: 'masonry_grid',
            name: 'Masonry Grid',
            description: 'Pinterest-style image layout',
            imageSlots: 6,
            elements: [
                {
                    type: 'container',
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gridTemplateRows: 'repeat(3, 1fr)',
                        gap: '8px',
                        padding: '20px',
                        height: '100%'
                    },
                    children: [
                        { type: 'image', id: 'img1', style: { gridColumn: '1', gridRow: '1 / 3', objectFit: 'cover', width: '100%', height: '100%', borderRadius: '4px' } },
                        { type: 'image', id: 'img2', style: { gridColumn: '2', gridRow: '1', objectFit: 'cover', width: '100%', height: '100%', borderRadius: '4px' } },
                        { type: 'image', id: 'img3', style: { gridColumn: '3', gridRow: '1 / 3', objectFit: 'cover', width: '100%', height: '100%', borderRadius: '4px' } },
                        { type: 'image', id: 'img4', style: { gridColumn: '2', gridRow: '2 / 4', objectFit: 'cover', width: '100%', height: '100%', borderRadius: '4px' } },
                        { type: 'image', id: 'img5', style: { gridColumn: '1', gridRow: '3', objectFit: 'cover', width: '100%', height: '100%', borderRadius: '4px' } },
                        { type: 'image', id: 'img6', style: { gridColumn: '3', gridRow: '3', objectFit: 'cover', width: '100%', height: '100%', borderRadius: '4px' } }
                    ]
                }
            ]
        },

        full_width_single: {
            id: 'full_width_single',
            name: 'Full Width Feature',
            description: 'One large image with caption',
            imageSlots: 1,
            elements: [
                {
                    type: 'image',
                    id: 'main_image',
                    style: { width: '100%', height: '80%', objectFit: 'cover' }
                },
                {
                    type: 'container',
                    id: 'caption',
                    style: {
                        padding: '30px 40px', background: 'var(--primary-color)',
                        color: 'white', height: '20%'
                    },
                    children: [
                        { type: 'text', id: 'room_name', style: { fontSize: '24px', fontWeight: 'bold' }, placeholder: 'Reception Room' },
                        { type: 'text', id: 'room_desc', style: { fontSize: '14px', opacity: '0.9' }, placeholder: '24\'3" x 18\'6" (7.4m x 5.6m)' }
                    ]
                }
            ]
        },

        two_by_two: {
            id: 'two_by_two',
            name: '2x2 Grid',
            description: 'Four equal images with labels',
            imageSlots: 4,
            elements: [
                {
                    type: 'container',
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gridTemplateRows: 'repeat(2, 1fr)',
                        gap: '12px',
                        padding: '24px',
                        height: '100%'
                    },
                    children: [
                        {
                            type: 'container',
                            style: { position: 'relative', borderRadius: '8px', overflow: 'hidden' },
                            children: [
                                { type: 'image', id: 'img1', style: { width: '100%', height: '100%', objectFit: 'cover' } },
                                { type: 'text', content: 'Kitchen', style: { position: 'absolute', bottom: '12px', left: '12px', background: 'white', padding: '6px 14px', fontSize: '13px', fontWeight: '600', borderRadius: '4px' } }
                            ]
                        },
                        {
                            type: 'container',
                            style: { position: 'relative', borderRadius: '8px', overflow: 'hidden' },
                            children: [
                                { type: 'image', id: 'img2', style: { width: '100%', height: '100%', objectFit: 'cover' } },
                                { type: 'text', content: 'Living Room', style: { position: 'absolute', bottom: '12px', left: '12px', background: 'white', padding: '6px 14px', fontSize: '13px', fontWeight: '600', borderRadius: '4px' } }
                            ]
                        },
                        {
                            type: 'container',
                            style: { position: 'relative', borderRadius: '8px', overflow: 'hidden' },
                            children: [
                                { type: 'image', id: 'img3', style: { width: '100%', height: '100%', objectFit: 'cover' } },
                                { type: 'text', content: 'Bedroom', style: { position: 'absolute', bottom: '12px', left: '12px', background: 'white', padding: '6px 14px', fontSize: '13px', fontWeight: '600', borderRadius: '4px' } }
                            ]
                        },
                        {
                            type: 'container',
                            style: { position: 'relative', borderRadius: '8px', overflow: 'hidden' },
                            children: [
                                { type: 'image', id: 'img4', style: { width: '100%', height: '100%', objectFit: 'cover' } },
                                { type: 'text', content: 'Garden', style: { position: 'absolute', bottom: '12px', left: '12px', background: 'white', padding: '6px 14px', fontSize: '13px', fontWeight: '600', borderRadius: '4px' } }
                            ]
                        }
                    ]
                }
            ]
        },

        featured_with_thumbs: {
            id: 'featured_with_thumbs',
            name: 'Featured + Thumbnails',
            description: 'One large, four small',
            imageSlots: 5,
            elements: [
                {
                    type: 'image',
                    id: 'featured',
                    style: { width: '70%', height: '100%', objectFit: 'cover' }
                },
                {
                    type: 'container',
                    id: 'thumbs',
                    style: {
                        position: 'absolute', right: 0, top: 0,
                        width: '30%', height: '100%',
                        display: 'grid', gridTemplateRows: 'repeat(4, 1fr)', gap: '4px'
                    },
                    children: [
                        { type: 'image', id: 'thumb1' },
                        { type: 'image', id: 'thumb2' },
                        { type: 'image', id: 'thumb3' },
                        { type: 'image', id: 'thumb4' }
                    ]
                }
            ]
        },

        polaroid_collection: {
            id: 'polaroid_collection',
            name: 'Polaroid Collection',
            description: 'Scattered polaroid style photos',
            imageSlots: 4,
            style: { background: '#f5f5f5' },
            elements: [
                {
                    type: 'polaroid',
                    style: { position: 'absolute', left: '10%', top: '10%', transform: 'rotate(-5deg)' },
                    children: [{ type: 'image', id: 'photo1', style: { width: '200px', height: '150px' } }],
                    caption: 'Kitchen'
                },
                {
                    type: 'polaroid',
                    style: { position: 'absolute', right: '15%', top: '5%', transform: 'rotate(3deg)' },
                    children: [{ type: 'image', id: 'photo2', style: { width: '200px', height: '150px' } }],
                    caption: 'Living Room'
                },
                {
                    type: 'polaroid',
                    style: { position: 'absolute', left: '20%', bottom: '15%', transform: 'rotate(2deg)' },
                    children: [{ type: 'image', id: 'photo3', style: { width: '200px', height: '150px' } }],
                    caption: 'Garden'
                },
                {
                    type: 'polaroid',
                    style: { position: 'absolute', right: '10%', bottom: '10%', transform: 'rotate(-3deg)' },
                    children: [{ type: 'image', id: 'photo4', style: { width: '200px', height: '150px' } }],
                    caption: 'Bedroom'
                }
            ]
        },

        horizontal_strip: {
            id: 'horizontal_strip',
            name: 'Horizontal Strip',
            description: 'Panoramic strip of images',
            imageSlots: 5,
            elements: [
                {
                    type: 'text',
                    id: 'title',
                    style: { fontSize: '28px', fontWeight: 'bold', padding: '30px 40px' },
                    content: 'Gallery'
                },
                {
                    type: 'container',
                    id: 'strip',
                    style: {
                        display: 'flex', gap: '4px', height: '60%',
                        padding: '0 40px'
                    },
                    children: [
                        { type: 'image', id: 'img1', style: { flex: '1', objectFit: 'cover' } },
                        { type: 'image', id: 'img2', style: { flex: '1', objectFit: 'cover' } },
                        { type: 'image', id: 'img3', style: { flex: '1', objectFit: 'cover' } },
                        { type: 'image', id: 'img4', style: { flex: '1', objectFit: 'cover' } },
                        { type: 'image', id: 'img5', style: { flex: '1', objectFit: 'cover' } }
                    ]
                }
            ]
        },

        // NEW: Circular Frames Gallery
        circular_gallery: {
            id: 'circular_gallery',
            name: 'Circular Frames',
            description: 'Images in circular frames',
            imageSlots: 4,
            elements: [
                {
                    type: 'text',
                    style: { fontSize: '28px', fontWeight: 'bold', textAlign: 'center', padding: '30px' },
                    content: 'Room Highlights'
                },
                {
                    type: 'container',
                    style: { display: 'flex', justifyContent: 'space-around', padding: '20px 40px' },
                    children: [
                        {
                            type: 'container',
                            style: { textAlign: 'center' },
                            children: [
                                { type: 'image', id: 'img1', style: { width: '180px', height: '180px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary-color)' } },
                                { type: 'text', content: 'Kitchen', style: { marginTop: '12px', fontWeight: '500' } }
                            ]
                        },
                        {
                            type: 'container',
                            style: { textAlign: 'center' },
                            children: [
                                { type: 'image', id: 'img2', style: { width: '180px', height: '180px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary-color)' } },
                                { type: 'text', content: 'Living Room', style: { marginTop: '12px', fontWeight: '500' } }
                            ]
                        },
                        {
                            type: 'container',
                            style: { textAlign: 'center' },
                            children: [
                                { type: 'image', id: 'img3', style: { width: '180px', height: '180px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary-color)' } },
                                { type: 'text', content: 'Bedroom', style: { marginTop: '12px', fontWeight: '500' } }
                            ]
                        },
                        {
                            type: 'container',
                            style: { textAlign: 'center' },
                            children: [
                                { type: 'image', id: 'img4', style: { width: '180px', height: '180px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary-color)' } },
                                { type: 'text', content: 'Garden', style: { marginTop: '12px', fontWeight: '500' } }
                            ]
                        }
                    ]
                }
            ]
        },

        // NEW: Magazine Spread
        magazine_spread: {
            id: 'magazine_spread',
            name: 'Magazine Spread',
            description: 'Large feature with supporting images',
            imageSlots: 4,
            elements: [
                {
                    type: 'container',
                    style: { display: 'flex', height: '100%' },
                    children: [
                        {
                            type: 'image',
                            id: 'main_image',
                            style: { width: '60%', height: '100%', objectFit: 'cover' }
                        },
                        {
                            type: 'container',
                            style: { width: '40%', display: 'flex', flexDirection: 'column' },
                            children: [
                                { type: 'image', id: 'img2', style: { flex: '1', objectFit: 'cover' } },
                                { type: 'image', id: 'img3', style: { flex: '1', objectFit: 'cover' } },
                                { type: 'image', id: 'img4', style: { flex: '1', objectFit: 'cover' } }
                            ]
                        }
                    ]
                }
            ]
        },

        // NEW: Elegant Grid with Captions
        elegant_grid: {
            id: 'elegant_grid',
            name: 'Elegant Grid',
            description: 'Clean grid with room labels',
            imageSlots: 6,
            elements: [
                {
                    type: 'text',
                    style: {
                        fontSize: '14px', letterSpacing: '3px', textTransform: 'uppercase',
                        textAlign: 'center', padding: '30px', color: 'var(--primary-color)'
                    },
                    content: 'Property Gallery'
                },
                {
                    type: 'container',
                    style: {
                        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '16px', padding: '0 40px'
                    },
                    children: [
                        {
                            type: 'container',
                            children: [
                                { type: 'image', id: 'img1', style: { width: '100%', height: '180px', objectFit: 'cover' } },
                                { type: 'text', content: 'Reception', style: { fontSize: '13px', padding: '8px 0', textAlign: 'center' } }
                            ]
                        },
                        {
                            type: 'container',
                            children: [
                                { type: 'image', id: 'img2', style: { width: '100%', height: '180px', objectFit: 'cover' } },
                                { type: 'text', content: 'Kitchen', style: { fontSize: '13px', padding: '8px 0', textAlign: 'center' } }
                            ]
                        },
                        {
                            type: 'container',
                            children: [
                                { type: 'image', id: 'img3', style: { width: '100%', height: '180px', objectFit: 'cover' } },
                                { type: 'text', content: 'Master Bedroom', style: { fontSize: '13px', padding: '8px 0', textAlign: 'center' } }
                            ]
                        },
                        {
                            type: 'container',
                            children: [
                                { type: 'image', id: 'img4', style: { width: '100%', height: '180px', objectFit: 'cover' } },
                                { type: 'text', content: 'Bathroom', style: { fontSize: '13px', padding: '8px 0', textAlign: 'center' } }
                            ]
                        },
                        {
                            type: 'container',
                            children: [
                                { type: 'image', id: 'img5', style: { width: '100%', height: '180px', objectFit: 'cover' } },
                                { type: 'text', content: 'Garden', style: { fontSize: '13px', padding: '8px 0', textAlign: 'center' } }
                            ]
                        },
                        {
                            type: 'container',
                            children: [
                                { type: 'image', id: 'img6', style: { width: '100%', height: '180px', objectFit: 'cover' } },
                                { type: 'text', content: 'Exterior', style: { fontSize: '13px', padding: '8px 0', textAlign: 'center' } }
                            ]
                        }
                    ]
                }
            ]
        },

        // NEW: Overlapping Cards
        overlapping_cards: {
            id: 'overlapping_cards',
            name: 'Overlapping Cards',
            description: 'Stacked photo cards effect',
            imageSlots: 3,
            elements: [
                {
                    type: 'container',
                    style: { width: '100%', height: '100%', background: '#f5f5f5', position: 'relative' },
                    children: [
                        {
                            type: 'container',
                            style: {
                                position: 'absolute', left: '10%', top: '15%',
                                background: 'white', padding: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                transform: 'rotate(-5deg)'
                            },
                            children: [{ type: 'image', id: 'img1', style: { width: '280px', height: '200px', objectFit: 'cover' } }]
                        },
                        {
                            type: 'container',
                            style: {
                                position: 'absolute', left: '35%', top: '25%',
                                background: 'white', padding: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                transform: 'rotate(2deg)', zIndex: '1'
                            },
                            children: [{ type: 'image', id: 'img2', style: { width: '320px', height: '220px', objectFit: 'cover' } }]
                        },
                        {
                            type: 'container',
                            style: {
                                position: 'absolute', right: '8%', top: '35%',
                                background: 'white', padding: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                transform: 'rotate(-3deg)', zIndex: '2'
                            },
                            children: [{ type: 'image', id: 'img3', style: { width: '260px', height: '180px', objectFit: 'cover' } }]
                        }
                    ]
                }
            ]
        },

        // NEW: Filmstrip Gallery
        filmstrip_gallery: {
            id: 'filmstrip_gallery',
            name: 'Filmstrip',
            description: 'Cinema-style filmstrip with images',
            imageSlots: 6,
            style: { background: '#1a1a1a' },
            elements: [
                {
                    type: 'text',
                    style: { fontSize: '32px', fontWeight: '300', textAlign: 'center', padding: '30px', color: 'white', letterSpacing: '4px' },
                    content: 'PROPERTY GALLERY'
                },
                {
                    type: 'container',
                    style: {
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '20px', gap: '0', height: '60%'
                    },
                    children: [
                        { type: 'container', style: { width: '30px', height: '100%', background: '#333', borderLeft: '3px dotted #666', borderRight: '3px dotted #666' } },
                        { type: 'image', id: 'img1', style: { width: '200px', height: '140px', objectFit: 'cover' } },
                        { type: 'container', style: { width: '30px', height: '100%', background: '#333', borderLeft: '3px dotted #666', borderRight: '3px dotted #666' } },
                        { type: 'image', id: 'img2', style: { width: '200px', height: '140px', objectFit: 'cover' } },
                        { type: 'container', style: { width: '30px', height: '100%', background: '#333', borderLeft: '3px dotted #666', borderRight: '3px dotted #666' } },
                        { type: 'image', id: 'img3', style: { width: '200px', height: '140px', objectFit: 'cover' } },
                        { type: 'container', style: { width: '30px', height: '100%', background: '#333', borderLeft: '3px dotted #666', borderRight: '3px dotted #666' } }
                    ]
                }
            ]
        },

        // NEW: Diagonal Gallery
        diagonal_gallery: {
            id: 'diagonal_gallery',
            name: 'Diagonal Layout',
            description: 'Angled images with modern look',
            imageSlots: 3,
            elements: [
                {
                    type: 'container',
                    style: { position: 'relative', width: '100%', height: '100%', overflow: 'hidden' },
                    children: [
                        {
                            type: 'image', id: 'img1',
                            style: { position: 'absolute', left: '-10%', top: '5%', width: '45%', height: '55%', objectFit: 'cover', transform: 'rotate(-5deg)', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }
                        },
                        {
                            type: 'image', id: 'img2',
                            style: { position: 'absolute', left: '35%', top: '30%', width: '40%', height: '50%', objectFit: 'cover', transform: 'rotate(3deg)', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', zIndex: '1' }
                        },
                        {
                            type: 'image', id: 'img3',
                            style: { position: 'absolute', right: '-5%', top: '10%', width: '35%', height: '45%', objectFit: 'cover', transform: 'rotate(-2deg)', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }
                        }
                    ]
                }
            ]
        },

        // NEW: Grid with Labels
        labeled_grid: {
            id: 'labeled_grid',
            name: 'Labeled Grid',
            description: 'Images with room labels on top',
            imageSlots: 6,
            elements: [
                {
                    type: 'container',
                    style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: '4px', padding: '20px', height: '100%' },
                    children: [
                        {
                            type: 'container', style: { position: 'relative' },
                            children: [
                                { type: 'image', id: 'img1', style: { width: '100%', height: '100%', objectFit: 'cover' } },
                                { type: 'text', content: 'KITCHEN', style: { position: 'absolute', bottom: '10px', left: '10px', background: 'white', padding: '5px 12px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' } }
                            ]
                        },
                        {
                            type: 'container', style: { position: 'relative' },
                            children: [
                                { type: 'image', id: 'img2', style: { width: '100%', height: '100%', objectFit: 'cover' } },
                                { type: 'text', content: 'LIVING ROOM', style: { position: 'absolute', bottom: '10px', left: '10px', background: 'white', padding: '5px 12px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' } }
                            ]
                        },
                        {
                            type: 'container', style: { position: 'relative' },
                            children: [
                                { type: 'image', id: 'img3', style: { width: '100%', height: '100%', objectFit: 'cover' } },
                                { type: 'text', content: 'BEDROOM', style: { position: 'absolute', bottom: '10px', left: '10px', background: 'white', padding: '5px 12px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' } }
                            ]
                        },
                        {
                            type: 'container', style: { position: 'relative' },
                            children: [
                                { type: 'image', id: 'img4', style: { width: '100%', height: '100%', objectFit: 'cover' } },
                                { type: 'text', content: 'BATHROOM', style: { position: 'absolute', bottom: '10px', left: '10px', background: 'white', padding: '5px 12px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' } }
                            ]
                        },
                        {
                            type: 'container', style: { position: 'relative' },
                            children: [
                                { type: 'image', id: 'img5', style: { width: '100%', height: '100%', objectFit: 'cover' } },
                                { type: 'text', content: 'GARDEN', style: { position: 'absolute', bottom: '10px', left: '10px', background: 'white', padding: '5px 12px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' } }
                            ]
                        },
                        {
                            type: 'container', style: { position: 'relative' },
                            children: [
                                { type: 'image', id: 'img6', style: { width: '100%', height: '100%', objectFit: 'cover' } },
                                { type: 'text', content: 'EXTERIOR', style: { position: 'absolute', bottom: '10px', left: '10px', background: 'white', padding: '5px 12px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' } }
                            ]
                        }
                    ]
                }
            ]
        }
    };

    // ==========================================================================
    // CONTACT PAGE LAYOUTS - 5 unique designs
    // ==========================================================================
    const CONTACT_LAYOUTS = {
        split_contact: {
            id: 'split_contact',
            name: 'Split Contact',
            description: 'Agent photo with contact details',
            elements: [
                {
                    type: 'container',
                    style: { display: 'flex', height: '100%' },
                    children: [
                        {
                            type: 'container',
                            style: {
                                width: '50%', background: 'var(--primary-color)',
                                color: 'white', padding: '60px',
                                display: 'flex', flexDirection: 'column', justifyContent: 'center'
                            },
                            children: [
                                { type: 'text', content: 'Arrange a Viewing', style: { fontSize: '36px', fontWeight: 'bold', marginBottom: '24px' } },
                                { type: 'text', content: 'Contact us today to book your private viewing of this exceptional property.', style: { fontSize: '18px', lineHeight: '1.6', marginBottom: '32px' } },
                                { type: 'text', id: 'phone', content: '020 7123 4567', style: { fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' } },
                                { type: 'text', id: 'email', content: 'sales@doorstep.co.uk', style: { fontSize: '18px' } }
                            ]
                        },
                        {
                            type: 'container',
                            style: { width: '50%', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
                            children: [
                                { type: 'image', id: 'agent_photo', style: { width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover', marginBottom: '24px' } },
                                { type: 'text', id: 'agent_name', content: 'Sarah Johnson', style: { fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' } },
                                { type: 'text', content: 'Senior Sales Negotiator', style: { fontSize: '14px', color: '#666' } },
                                { type: 'qrcode', id: 'qr', style: { marginTop: '32px', width: '100px', height: '100px' } }
                            ]
                        }
                    ]
                }
            ]
        },

        minimal_contact: {
            id: 'minimal_contact',
            name: 'Minimal Contact',
            description: 'Clean, simple contact page',
            elements: [
                {
                    type: 'container',
                    style: {
                        height: '100%', display: 'flex', flexDirection: 'column',
                        justifyContent: 'center', alignItems: 'center', textAlign: 'center'
                    },
                    children: [
                        { type: 'logo', id: 'agency_logo', style: { height: '60px', marginBottom: '40px' } },
                        { type: 'text', content: 'Book Your Viewing', style: { fontSize: '42px', fontWeight: 'bold', marginBottom: '16px' } },
                        { type: 'divider', style: { width: '80px', height: '4px', background: 'var(--primary-color)', margin: '20px 0' } },
                        { type: 'text', id: 'phone', content: '020 7123 4567', style: { fontSize: '32px', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '16px' } },
                        { type: 'text', id: 'email', content: 'sales@doorstep.co.uk', style: { fontSize: '18px', marginBottom: '8px' } },
                        { type: 'text', id: 'address', content: '123 High Street, London W1K 3AB', style: { fontSize: '14px', color: '#666' } }
                    ]
                }
            ]
        },

        card_contact: {
            id: 'card_contact',
            name: 'Business Card Style',
            description: 'Professional card layout',
            elements: [
                {
                    type: 'container',
                    style: { height: '100%', background: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center' },
                    children: [
                        {
                            type: 'container',
                            style: {
                                background: 'white', padding: '60px 80px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                display: 'flex', gap: '60px', alignItems: 'center'
                            },
                            children: [
                                {
                                    type: 'container',
                                    style: { borderRight: '2px solid var(--primary-color)', paddingRight: '60px' },
                                    children: [
                                        { type: 'logo', style: { height: '50px', marginBottom: '24px' } },
                                        { type: 'text', id: 'agent_name', content: 'Sarah Johnson', style: { fontSize: '24px', fontWeight: 'bold' } },
                                        { type: 'text', content: 'Senior Negotiator', style: { fontSize: '14px', color: '#666' } }
                                    ]
                                },
                                {
                                    type: 'container',
                                    children: [
                                        { type: 'contact_row', icon: 'phone', value: '020 7123 4567' },
                                        { type: 'contact_row', icon: 'email', value: 'sarah@doorstep.co.uk' },
                                        { type: 'contact_row', icon: 'location', value: '123 High Street, London' }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },

        // NEW: Full Width Map Contact
        map_contact: {
            id: 'map_contact',
            name: 'Map Contact',
            description: 'Contact with location map',
            elements: [
                {
                    type: 'container',
                    style: { height: '50%', background: '#e8e8e8', display: 'flex', justifyContent: 'center', alignItems: 'center' },
                    children: [
                        { type: 'text', content: 'Map Location', style: { fontSize: '24px', color: '#999' } }
                    ]
                },
                {
                    type: 'container',
                    style: { height: '50%', padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
                    children: [
                        {
                            type: 'container',
                            children: [
                                { type: 'text', content: 'Contact Us', style: { fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' } },
                                { type: 'text', content: '020 7123 4567', style: { fontSize: '24px', color: 'var(--primary-color)', marginBottom: '8px' } },
                                { type: 'text', content: 'sales@agency.co.uk', style: { fontSize: '16px', color: '#666' } }
                            ]
                        },
                        {
                            type: 'container',
                            style: { textAlign: 'right' },
                            children: [
                                { type: 'logo', style: { height: '50px', marginBottom: '16px' } },
                                { type: 'text', content: '123 High Street', style: { fontSize: '14px', color: '#666' } },
                                { type: 'text', content: 'London SW1A 1AA', style: { fontSize: '14px', color: '#666' } }
                            ]
                        }
                    ]
                }
            ]
        },

        // NEW: Dark Contact
        dark_contact: {
            id: 'dark_contact',
            name: 'Dark Contact',
            description: 'Elegant dark theme contact',
            elements: [
                {
                    type: 'container',
                    style: { width: '100%', height: '100%', background: '#1a1a1a', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' },
                    children: [
                        { type: 'text', content: 'ARRANGE YOUR VIEWING', style: { fontSize: '14px', letterSpacing: '4px', color: '#D4AF37', marginBottom: '20px' } },
                        { type: 'text', content: '020 7123 4567', style: { fontSize: '48px', fontWeight: '300', marginBottom: '16px', fontFamily: '"Playfair Display", serif' } },
                        { type: 'text', content: 'sales@agency.co.uk', style: { fontSize: '18px', opacity: '0.7', marginBottom: '40px' } },
                        { type: 'container', style: { width: '60px', height: '1px', background: '#D4AF37', marginBottom: '40px' } },
                        { type: 'text', content: '123 High Street, Mayfair, London W1K 1AA', style: { fontSize: '14px', opacity: '0.6' } }
                    ]
                }
            ]
        },

        // NEW: QR Focus Contact
        qr_focus_contact: {
            id: 'qr_focus_contact',
            name: 'QR Focus',
            description: 'Large QR code with details',
            elements: [
                {
                    type: 'container',
                    style: { width: '100%', height: '100%', display: 'flex' },
                    children: [
                        {
                            type: 'container',
                            style: { width: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
                            children: [
                                { type: 'text', content: 'Scan for', style: { fontSize: '18px', opacity: '0.8' } },
                                { type: 'text', content: 'Virtual Tour', style: { fontSize: '36px', fontWeight: 'bold', marginBottom: '30px' } },
                                { type: 'container', style: { width: '200px', height: '200px', background: 'white', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
                                    children: [{ type: 'text', content: 'QR CODE', style: { color: '#333' } }]
                                }
                            ]
                        },
                        {
                            type: 'container',
                            style: { width: '50%', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
                            children: [
                                { type: 'logo', style: { height: '40px', marginBottom: '40px' } },
                                { type: 'text', content: 'Get in Touch', style: { fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' } },
                                { type: 'text', content: '020 7123 4567', style: { fontSize: '22px', color: 'var(--primary-color)', marginBottom: '12px' } },
                                { type: 'text', content: 'sales@agency.co.uk', style: { fontSize: '16px', color: '#666', marginBottom: '24px' } },
                                { type: 'text', content: '123 High Street, London', style: { fontSize: '14px', color: '#888' } }
                            ]
                        }
                    ]
                }
            ]
        },

        // NEW: Team Contact
        team_contact: {
            id: 'team_contact',
            name: 'Team Contact',
            description: 'Multiple agents display',
            elements: [
                {
                    type: 'text',
                    style: { fontSize: '28px', fontWeight: 'bold', textAlign: 'center', padding: '30px' },
                    content: 'Your Property Team'
                },
                {
                    type: 'container',
                    style: { display: 'flex', justifyContent: 'center', gap: '40px', padding: '20px 40px' },
                    children: [
                        {
                            type: 'container',
                            style: { textAlign: 'center' },
                            children: [
                                { type: 'container', style: { width: '120px', height: '120px', borderRadius: '50%', background: '#e8e8e8', margin: '0 auto 16px' } },
                                { type: 'text', content: 'Sarah Johnson', style: { fontSize: '16px', fontWeight: 'bold' } },
                                { type: 'text', content: 'Senior Negotiator', style: { fontSize: '12px', color: '#666', marginBottom: '8px' } },
                                { type: 'text', content: '020 7123 4567', style: { fontSize: '14px', color: 'var(--primary-color)' } }
                            ]
                        },
                        {
                            type: 'container',
                            style: { textAlign: 'center' },
                            children: [
                                { type: 'container', style: { width: '120px', height: '120px', borderRadius: '50%', background: '#e8e8e8', margin: '0 auto 16px' } },
                                { type: 'text', content: 'James Smith', style: { fontSize: '16px', fontWeight: 'bold' } },
                                { type: 'text', content: 'Branch Manager', style: { fontSize: '12px', color: '#666', marginBottom: '8px' } },
                                { type: 'text', content: '020 7123 4568', style: { fontSize: '14px', color: 'var(--primary-color)' } }
                            ]
                        }
                    ]
                },
                {
                    type: 'container',
                    style: { background: '#f5f5f5', padding: '30px', textAlign: 'center', marginTop: '20px' },
                    children: [
                        { type: 'logo', style: { height: '30px', marginBottom: '12px' } },
                        { type: 'text', content: '123 High Street, London SW1A 1AA', style: { fontSize: '14px', color: '#666' } }
                    ]
                }
            ]
        }
    };

    // ==========================================================================
    // TEMPLATE COMBINATIONS (Full brochure templates)
    // ==========================================================================
    const FULL_TEMPLATES = {
        modern_minimal: {
            id: 'modern_minimal',
            name: 'Modern Minimal',
            description: 'Clean, contemporary design',
            pages: {
                cover: 'hero_minimal',
                details: 'feature_grid',
                gallery: 'two_by_two',
                contact: 'minimal_contact'
            },
            colorScheme: {
                primary: '#1a1a1a',
                secondary: '#f5f5f5',
                accent: '#4A1420'
            }
        },

        classic_elegant: {
            id: 'classic_elegant',
            name: 'Classic Elegant',
            description: 'Traditional estate agent style',
            pages: {
                cover: 'hero_classic',
                details: 'two_column_classic',
                gallery: 'featured_with_thumbs',
                contact: 'card_contact'
            },
            colorScheme: {
                primary: '#2c3e50',
                secondary: '#ecf0f1',
                accent: '#c0392b'
            }
        },

        bold_impact: {
            id: 'bold_impact',
            name: 'Bold Impact',
            description: 'Strong visuals and colors',
            pages: {
                cover: 'hero_geometric',
                details: 'infographic',
                gallery: 'horizontal_strip',
                contact: 'split_contact'
            },
            colorScheme: {
                primary: '#4A1420',
                secondary: '#ffffff',
                accent: '#D4AF37'
            }
        },

        magazine_editorial: {
            id: 'magazine_editorial',
            name: 'Magazine Editorial',
            description: 'Publication-quality layout',
            pages: {
                cover: 'hero_magazine',
                details: 'magazine_style',
                gallery: 'masonry_grid',
                contact: 'minimal_contact'
            },
            colorScheme: {
                primary: '#333333',
                secondary: '#fafafa',
                accent: '#e74c3c'
            }
        },

        luxury_premium: {
            id: 'luxury_premium',
            name: 'Luxury Premium',
            description: 'High-end property presentation',
            pages: {
                cover: 'hero_full_bleed',
                details: 'cards_layout',
                gallery: 'full_width_single',
                contact: 'split_contact'
            },
            colorScheme: {
                primary: '#1a1a1a',
                secondary: '#f8f8f8',
                accent: '#D4AF37'
            }
        }
    };

    // ==========================================================================
    // PUBLIC API
    // ==========================================================================

    /**
     * Get all cover layouts
     */
    function getCoverLayouts() {
        return COVER_LAYOUTS;
    }

    /**
     * Get all details layouts
     */
    function getDetailsLayouts() {
        return DETAILS_LAYOUTS;
    }

    /**
     * Get all gallery layouts
     */
    function getGalleryLayouts() {
        return GALLERY_LAYOUTS;
    }

    /**
     * Get all contact layouts
     */
    function getContactLayouts() {
        return CONTACT_LAYOUTS;
    }

    /**
     * Get all full templates
     */
    function getFullTemplates() {
        return FULL_TEMPLATES;
    }

    /**
     * Get a specific layout by ID
     */
    function getLayout(layoutId, pageType) {
        const layouts = {
            cover: COVER_LAYOUTS,
            details: DETAILS_LAYOUTS,
            gallery: GALLERY_LAYOUTS,
            contact: CONTACT_LAYOUTS
        };

        if (pageType && layouts[pageType]) {
            return layouts[pageType][layoutId] || null;
        }

        // Search all types
        for (const type in layouts) {
            if (layouts[type][layoutId]) {
                return layouts[type][layoutId];
            }
        }

        return null;
    }

    /**
     * Apply a layout to a page element
     */
    function applyLayout(pageElement, layoutId, pageType, data = {}) {
        const layout = getLayout(layoutId, pageType);
        if (!layout) {
            console.warn(`[RealTemplates] Layout not found: ${layoutId}`);
            return false;
        }

        console.log(`[RealTemplates] Applying layout: ${layout.name}`);

        // Clear existing content
        pageElement.innerHTML = '';

        // Apply layout structure
        renderElements(pageElement, layout.elements || [], data);

        // Apply any special styles
        if (layout.style) {
            Object.assign(pageElement.style, layout.style);
        }

        return true;
    }

    /**
     * Render elements recursively
     */
    function renderElements(container, elements, data) {
        elements.forEach(elementDef => {
            const el = createElementFromDef(elementDef, data);
            if (el) {
                container.appendChild(el);

                // Render children if any
                if (elementDef.children) {
                    renderElements(el, elementDef.children, data);
                }
            }
        });
    }

    /**
     * Create DOM element from definition
     */
    function createElementFromDef(def, data) {
        const el = document.createElement('div');
        el.className = `template-element ${def.type}-element`;

        if (def.id) el.id = def.id;

        // Apply styles
        if (def.style) {
            Object.keys(def.style).forEach(key => {
                el.style[key] = def.style[key];
            });
        }

        // Handle specific types
        switch (def.type) {
            case 'text':
                el.textContent = data[def.role] || def.content || def.placeholder || '';
                if (def.role) el.contentEditable = true;
                break;

            case 'image':
                // Check for image in data by role, id, or index
                const imgSrc = data[def.role] || data[def.id] || data.images?.[def.id] || null;

                if (imgSrc) {
                    // Real image provided
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = def.role || def.id || 'Property image';
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = def.style?.objectFit || 'cover';
                    img.draggable = false;
                    el.appendChild(img);
                } else {
                    // Show placeholder as styled div (more reliable than SVG data URI)
                    el.style.background = '#e5e7eb';
                    el.style.display = 'flex';
                    el.style.alignItems = 'center';
                    el.style.justifyContent = 'center';
                    el.style.color = '#9ca3af';
                    el.style.fontSize = '14px';
                    el.style.fontFamily = 'system-ui, sans-serif';
                    el.innerHTML = `
                        <div style="text-align: center;">
                            <div style="font-size: 32px; margin-bottom: 8px;">📷</div>
                            <div>${def.role || def.id || 'Drop image here'}</div>
                        </div>
                    `;
                    // Mark as image drop zone
                    el.dataset.imageSlot = def.id || def.role || 'image';
                    el.classList.add('image-drop-zone');
                }
                break;

            case 'badge':
                el.textContent = def.content || '';
                el.className += ' badge';
                break;

            case 'divider':
                el.className = 'template-divider';
                break;

            case 'list':
                const ul = document.createElement('ul');
                const items = data[def.role] || def.placeholder || [];
                items.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = typeof item === 'string' ? item : item.text;
                    ul.appendChild(li);
                });
                el.appendChild(ul);
                break;

            case 'specs':
                const specs = def.items || [];
                specs.forEach(spec => {
                    const specEl = document.createElement('span');
                    specEl.className = 'spec-item';
                    specEl.textContent = typeof spec === 'string' ? spec : `${spec.value} ${spec.label}`;
                    el.appendChild(specEl);
                });
                break;

            default:
                // Generic container
                break;
        }

        return el;
    }

    /**
     * Get layout count
     */
    function getLayoutCount() {
        return {
            cover: Object.keys(COVER_LAYOUTS).length,
            details: Object.keys(DETAILS_LAYOUTS).length,
            gallery: Object.keys(GALLERY_LAYOUTS).length,
            contact: Object.keys(CONTACT_LAYOUTS).length,
            fullTemplates: Object.keys(FULL_TEMPLATES).length,
            total: Object.keys(COVER_LAYOUTS).length +
                   Object.keys(DETAILS_LAYOUTS).length +
                   Object.keys(GALLERY_LAYOUTS).length +
                   Object.keys(CONTACT_LAYOUTS).length
        };
    }

    // Initialize
    console.log('[RealTemplates] Loaded -', getLayoutCount().total, 'unique layouts');

    // Public API
    return {
        getCoverLayouts,
        getDetailsLayouts,
        getGalleryLayouts,
        getContactLayouts,
        getFullTemplates,
        getLayout,
        applyLayout,
        getLayoutCount,
        COVER_LAYOUTS,
        DETAILS_LAYOUTS,
        GALLERY_LAYOUTS,
        CONTACT_LAYOUTS,
        FULL_TEMPLATES,
        isLoaded: true
    };
})();

// Export globally
window.RealTemplates = RealTemplates;
