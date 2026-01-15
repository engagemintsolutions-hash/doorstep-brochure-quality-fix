/**
 * Repurpose Generator - Frontend Content Generation
 *
 * Generates portal listings, social media posts, and newsletters
 * directly from brochure data without backend dependency
 */

// ============================================================================
// PORTAL LISTING GENERATOR
// ============================================================================

async function generatePortalListing() {
    console.log('📝 Generating portal listing...');

    if (!window.EditorState || !window.EditorState.sessionData) {
        showToast('error', 'No brochure data available');
        return;
    }

    closeRepurposingModal();

    const sessionData = window.EditorState.sessionData;
    const photos = getBest4Photos();

    // Generate Rightmove-style listing (80 words max)
    const rightmoveText = await generateRightmoveText(sessionData);

    // Show portal listing preview modal
    showPortalListingPreview(rightmoveText, photos, sessionData);
}

function generateRightmoveText(sessionData) {
    const property = sessionData.property_data || {};
    const bedrooms = property.bedrooms || '4';
    const bathrooms = property.bathrooms || '3';
    const propertyType = property.property_type || 'house';

    // Extract main description (first 80 words from brochure)
    let description = '';
    if (sessionData.pages && sessionData.pages.length > 0) {
        const mainPage = sessionData.pages.find(p => p.type === 'description' || p.type === 'gallery');
        if (mainPage && mainPage.content && mainPage.content.text) {
            const words = mainPage.content.text.split(' ');
            description = words.slice(0, 80).join(' ');
            if (words.length > 80) description += '...';
        }
    }

    if (!description) {
        description = `Beautiful ${bedrooms} bedroom ${propertyType} with ${bathrooms} bathrooms. Modern kitchen, spacious living areas, private garden. Excellent location close to schools, shops and transport links. Must be viewed to appreciate the quality throughout.`;
    }

    return description;
}

function getBest4Photos() {
    if (!window.EditorState || !window.EditorState.photoUrls) {
        return [];
    }

    const photoUrls = Object.values(window.EditorState.photoUrls);
    return photoUrls.slice(0, 4);
}

function showPortalListingPreview(description, photos, sessionData) {
    const property = sessionData.property_data || {};
    const location = sessionData.location_data || {};

    const modal = document.createElement('div');
    modal.id = 'portalListingModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 2rem;
        overflow-y: auto;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 12px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        ">
            <!-- Header -->
            <div style="
                background: linear-gradient(135deg, #006B3D 0%, #00874D 100%);
                color: white;
                padding: 2rem;
                border-radius: 12px 12px 0 0;
                position: relative;
            ">
                <button onclick="document.getElementById('portalListingModal').remove()" style="
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    font-size: 1.5rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">&times;</button>

                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                    <div style="font-size: 2.5rem;">🏠</div>
                    <div>
                        <h2 style="margin: 0; font-size: 1.8rem; font-weight: 700;">Rightmove Listing Preview</h2>
                        <p style="margin: 0.5rem 0 0 0; opacity: 0.9; font-size: 0.95rem;">Ready to copy & paste</p>
                    </div>
                </div>
            </div>

            <!-- Listing Preview (Rightmove Style) -->
            <div style="padding: 2rem; background: #f8f9fa;">
                <!-- Photo Grid -->
                <div style="
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 8px;
                    margin-bottom: 1.5rem;
                    border-radius: 8px;
                    overflow: hidden;
                ">
                    ${photos.length > 0 ? `
                        <img src="${photos[0]}" style="
                            width: 100%;
                            height: 300px;
                            object-fit: cover;
                            grid-row: span 2;
                        " alt="Main photo">
                        ${photos.slice(1, 3).map(photo => `
                            <img src="${photo}" style="
                                width: 100%;
                                height: 146px;
                                object-fit: cover;
                            " alt="Property photo">
                        `).join('')}
                    ` : `
                        <div style="
                            background: #ddd;
                            height: 300px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: #999;
                            grid-column: span 2;
                        ">No photos available</div>
                    `}
                </div>

                <!-- Property Header -->
                <div style="
                    background: white;
                    padding: 1.5rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                ">
                    <div style="font-size: 1.8rem; font-weight: 700; color: #006B3D; margin-bottom: 0.5rem;">
                        £${property.asking_price ? property.asking_price.toLocaleString() : '1,250,000'}
                    </div>
                    <div style="font-size: 1.1rem; color: #2c3e50; margin-bottom: 0.5rem;">
                        ${property.bedrooms || '4'} bed ${property.property_type || 'house'} for sale
                    </div>
                    <div style="font-size: 0.95rem; color: #6c757d;">
                        ${location.address || 'Property Address'}, ${location.postcode || 'Postcode'}
                    </div>
                </div>

                <!-- Description -->
                <div style="
                    background: white;
                    padding: 1.5rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                ">
                    <h3 style="margin: 0 0 1rem 0; color: #2c3e50; font-size: 1.1rem;">Property Description</h3>
                    <p style="
                        margin: 0;
                        line-height: 1.6;
                        color: #2c3e50;
                        font-size: 0.95rem;
                    " id="portalDescription">${description}</p>
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #dee2e6;">
                        <small style="color: #6c757d;">Word count: ${description.split(' ').length} / 80 (Rightmove limit)</small>
                    </div>
                </div>

                <!-- Key Features -->
                <div style="
                    background: white;
                    padding: 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                ">
                    <h3 style="margin: 0 0 1rem 0; color: #2c3e50; font-size: 1.1rem;">Key Features</h3>
                    <ul style="margin: 0; padding-left: 1.5rem; color: #2c3e50; line-height: 1.8;">
                        <li>${property.bedrooms || '4'} bedrooms</li>
                        <li>${property.bathrooms || '3'} bathrooms</li>
                        <li>${property.property_type ? property.property_type.charAt(0).toUpperCase() + property.property_type.slice(1) : 'House'}</li>
                        <li>EPC Rating: ${property.epc_rating || 'C'}</li>
                        <li>${property.tenure || 'Freehold'}</li>
                        ${property.council_tax_band ? `<li>Council Tax Band ${property.council_tax_band}</li>` : ''}
                    </ul>
                </div>
            </div>

            <!-- Actions -->
            <div style="
                padding: 2rem;
                background: white;
                border-top: 1px solid #dee2e6;
                border-radius: 0 0 12px 12px;
                display: flex;
                gap: 1rem;
            ">
                <button onclick="copyPortalText()" style="
                    flex: 1;
                    padding: 1rem;
                    background: linear-gradient(135deg, #006B3D 0%, #00874D 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    📋 Copy Description
                </button>
                <button onclick="downloadPortalText()" style="
                    flex: 1;
                    padding: 1rem;
                    background: white;
                    color: #006B3D;
                    border: 2px solid #006B3D;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                " onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                    💾 Download as TXT
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Store description for copy function
    window.currentPortalDescription = description;

    console.log('✅ Portal listing preview shown');
}

function copyPortalText() {
    const text = window.currentPortalDescription || document.getElementById('portalDescription').textContent;
    navigator.clipboard.writeText(text).then(() => {
        showToast('success', '✅ Copied to clipboard!');
    });
}

function downloadPortalText() {
    const text = window.currentPortalDescription || document.getElementById('portalDescription').textContent;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rightmove-listing-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', '💾 Downloaded!');
}

// ============================================================================
// SOCIAL MEDIA GENERATOR
// ============================================================================

async function generateSocialMedia() {
    console.log('📱 Generating social media posts...');

    if (!window.EditorState || !window.EditorState.sessionData) {
        showToast('error', 'No brochure data available');
        return;
    }

    closeRepurposingModal();

    const sessionData = window.EditorState.sessionData;
    const photos = getBest4Photos();

    showSocialMediaPreview(sessionData, photos);
}

function showSocialMediaPreview(sessionData, photos) {
    const property = sessionData.property_data || {};
    const location = sessionData.location_data || {};

    // Generate Instagram caption
    const instagramCaption = generateInstagramCaption(property, location);
    const facebookPost = generateFacebookPost(property, location);

    const modal = document.createElement('div');
    modal.id = 'socialMediaModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 2rem;
        overflow-y: auto;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 12px;
            max-width: 900px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        ">
            <!-- Header -->
            <div style="
                background: linear-gradient(135deg, #E1306C 0%, #F77737 100%);
                color: white;
                padding: 2rem;
                border-radius: 12px 12px 0 0;
                position: relative;
            ">
                <button onclick="document.getElementById('socialMediaModal').remove()" style="
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    font-size: 1.5rem;
                    cursor: pointer;
                ">&times;</button>

                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="font-size: 2.5rem;">📱</div>
                    <div>
                        <h2 style="margin: 0; font-size: 1.8rem; font-weight: 700;">Social Media Posts</h2>
                        <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Instagram & Facebook ready</p>
                    </div>
                </div>
            </div>

            <div style="padding: 2rem;">
                <!-- Instagram Preview -->
                <div style="margin-bottom: 2rem;">
                    <h3 style="margin: 0 0 1rem 0; color: #E1306C; font-size: 1.3rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>📷</span> Instagram Post
                    </h3>

                    <div style="
                        border: 1px solid #dbdbdb;
                        border-radius: 8px;
                        overflow: hidden;
                        background: white;
                        max-width: 500px;
                        margin: 0 auto;
                        box-shadow: 0 2px 12px rgba(0,0,0,0.1);
                    ">
                        <!-- Instagram Header -->
                        <div style="
                            padding: 1rem;
                            display: flex;
                            align-items: center;
                            gap: 0.75rem;
                            border-bottom: 1px solid #dbdbdb;
                        ">
                            <div style="
                                width: 40px;
                                height: 40px;
                                border-radius: 50%;
                                background: linear-gradient(135deg, #006B3D 0%, #00874D 100%);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                                font-weight: 700;
                            ">S</div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; font-size: 0.9rem;">Savills London</div>
                                <div style="font-size: 0.75rem; color: #8e8e8e;">${location.postcode || 'Location'}</div>
                            </div>
                        </div>

                        <!-- Instagram Photo -->
                        ${photos.length > 0 ? `
                            <img src="${photos[0]}" style="
                                width: 100%;
                                aspect-ratio: 1;
                                object-fit: cover;
                            " alt="Property">
                        ` : `
                            <div style="
                                width: 100%;
                                aspect-ratio: 1;
                                background: #ddd;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: #999;
                            ">No photo</div>
                        `}

                        <!-- Instagram Actions -->
                        <div style="padding: 0.75rem 1rem; border-bottom: 1px solid #dbdbdb;">
                            <div style="display: flex; gap: 1rem; font-size: 1.5rem;">
                                <span>❤️</span>
                                <span>💬</span>
                                <span>📤</span>
                            </div>
                        </div>

                        <!-- Instagram Caption -->
                        <div style="padding: 0.75rem 1rem;">
                            <p style="margin: 0; font-size: 0.9rem; line-height: 1.5;" id="instagramCaption">
                                <strong>Savills London</strong> ${instagramCaption}
                            </p>
                        </div>
                    </div>

                    <button onclick="copyInstagramText()" style="
                        width: 100%;
                        max-width: 500px;
                        margin: 1rem auto;
                        display: block;
                        padding: 0.75rem;
                        background: linear-gradient(135deg, #E1306C 0%, #F77737 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                    ">📋 Copy Instagram Caption</button>
                </div>

                <!-- Facebook Preview -->
                <div>
                    <h3 style="margin: 0 0 1rem 0; color: #1877F2; font-size: 1.3rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>👍</span> Facebook Post
                    </h3>

                    <div style="
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        overflow: hidden;
                        background: white;
                        box-shadow: 0 2px 12px rgba(0,0,0,0.1);
                    ">
                        <!-- Facebook Header -->
                        <div style="
                            padding: 1rem;
                            display: flex;
                            align-items: center;
                            gap: 0.75rem;
                        ">
                            <div style="
                                width: 40px;
                                height: 40px;
                                border-radius: 50%;
                                background: linear-gradient(135deg, #006B3D 0%, #00874D 100%);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                                font-weight: 700;
                            ">S</div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; font-size: 0.95rem;">Savills London</div>
                                <div style="font-size: 0.8rem; color: #65676b;">Just now · 🌍</div>
                            </div>
                        </div>

                        <!-- Facebook Post Text -->
                        <div style="padding: 0 1rem 1rem 1rem;">
                            <p style="margin: 0; font-size: 0.95rem; line-height: 1.5;" id="facebookPost">${facebookPost}</p>
                        </div>

                        <!-- Facebook Photo Grid -->
                        ${photos.length > 0 ? `
                            <div style="
                                display: grid;
                                grid-template-columns: ${photos.length === 1 ? '1fr' : photos.length === 2 ? '1fr 1fr' : '2fr 1fr'};
                                gap: 2px;
                            ">
                                ${photos.slice(0, 3).map((photo, i) => `
                                    <img src="${photo}" style="
                                        width: 100%;
                                        ${i === 0 && photos.length > 2 ? 'grid-row: span 2;' : ''}
                                        height: ${i === 0 && photos.length > 2 ? '400px' : '199px'};
                                        object-fit: cover;
                                    " alt="Property photo ${i + 1}">
                                `).join('')}
                            </div>
                        ` : ''}

                        <!-- Facebook Actions -->
                        <div style="
                            padding: 0.75rem 1rem;
                            border-top: 1px solid #ddd;
                            display: flex;
                            justify-content: space-around;
                            color: #65676b;
                            font-size: 0.9rem;
                        ">
                            <span>👍 Like</span>
                            <span>💬 Comment</span>
                            <span>📤 Share</span>
                        </div>
                    </div>

                    <button onclick="copyFacebookText()" style="
                        width: 100%;
                        margin: 1rem 0;
                        padding: 0.75rem;
                        background: #1877F2;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                    ">📋 Copy Facebook Post</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Store text for copy functions
    window.currentInstagramCaption = instagramCaption;
    window.currentFacebookPost = facebookPost;

    console.log('✅ Social media previews shown');
}

function generateInstagramCaption(property, location) {
    const price = property.asking_price ? `£${property.asking_price.toLocaleString()}` : '';
    const beds = property.bedrooms || '4';
    const baths = property.bathrooms || '3';
    const loc = location.postcode || 'Prime Location';

    return `${price} | ${beds} bed, ${baths} bath ${property.property_type || 'home'} 🏡\n\n` +
           `Stunning property in ${loc}. Modern interiors, beautiful garden, excellent schools nearby. 📍\n\n` +
           `DM for viewings 📩\n\n` +
           `#PropertyForSale #${loc.replace(/\s+/g, '')} #LuxuryHomes #DreamHome #PropertyMarketing #EstateAgent #${beds}Bedroom #UKProperty #HomesForSale`;
}

function generateFacebookPost(property, location) {
    const price = property.asking_price ? `£${property.asking_price.toLocaleString()}` : '';
    const beds = property.bedrooms || '4';
    const baths = property.bathrooms || '3';

    return `🏡 NEW LISTING ALERT 🏡\n\n` +
           `${price} | ${beds} Bedrooms | ${baths} Bathrooms\n\n` +
           `This stunning ${property.property_type || 'property'} in ${location.postcode || 'a prime location'} won't be on the market for long!\n\n` +
           `✨ Beautifully presented throughout\n` +
           `✨ Excellent local schools\n` +
           `✨ Close to amenities & transport\n` +
           `✨ Private garden\n\n` +
           `Get in touch today to arrange your viewing. Don't miss out! 👇`;
}

function copyInstagramText() {
    const text = window.currentInstagramCaption;
    navigator.clipboard.writeText(text).then(() => {
        showToast('success', '✅ Copied Instagram caption!');
    });
}

function copyFacebookText() {
    const text = window.currentFacebookPost;
    navigator.clipboard.writeText(text).then(() => {
        showToast('success', '✅ Copied Facebook post!');
    });
}

// ============================================================================
// NEWSLETTER GENERATOR
// ============================================================================

async function generateNewsletter() {
    console.log('📧 Generating newsletter...');

    if (!window.EditorState || !window.EditorState.sessionData) {
        showToast('error', 'No brochure data available');
        return;
    }

    closeRepurposingModal();

    const sessionData = window.EditorState.sessionData;
    const photos = getBest4Photos();

    showNewsletterPreview(sessionData, photos);
}

function showNewsletterPreview(sessionData, photos) {
    const property = sessionData.property_data || {};
    const location = sessionData.location_data || {};

    const subject = `New Listing: ${property.bedrooms || '4'} Bed ${property.property_type || 'Property'} in ${location.postcode || 'Prime Location'}`;
    const newsletterHTML = generateNewsletterHTML(property, location, photos);

    const modal = document.createElement('div');
    modal.id = 'newsletterModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 2rem;
        overflow-y: auto;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 12px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        ">
            <!-- Header -->
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 2rem;
                border-radius: 12px 12px 0 0;
                position: relative;
            ">
                <button onclick="document.getElementById('newsletterModal').remove()" style="
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    font-size: 1.5rem;
                    cursor: pointer;
                ">&times;</button>

                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="font-size: 2.5rem;">📧</div>
                    <div>
                        <h2 style="margin: 0; font-size: 1.8rem; font-weight: 700;">Email Newsletter</h2>
                        <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Ready to send to your database</p>
                    </div>
                </div>
            </div>

            <div style="padding: 2rem;">
                <!-- Subject Line -->
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem; color: #2c3e50;">
                        Subject Line:
                    </label>
                    <div style="
                        padding: 1rem;
                        background: #f8f9fa;
                        border: 2px solid #667eea;
                        border-radius: 8px;
                        font-family: monospace;
                    " id="emailSubject">${subject}</div>
                </div>

                <!-- Email Preview -->
                <div style="
                    border: 2px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                    background: white;
                ">
                    <div id="newsletterContent">${newsletterHTML}</div>
                </div>

                <!-- Actions -->
                <div style="
                    display: flex;
                    gap: 1rem;
                    margin-top: 1.5rem;
                ">
                    <button onclick="copyNewsletterHTML()" style="
                        flex: 1;
                        padding: 1rem;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                    ">📋 Copy HTML</button>
                    <button onclick="downloadNewsletterHTML()" style="
                        flex: 1;
                        padding: 1rem;
                        background: white;
                        color: #667eea;
                        border: 2px solid #667eea;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                    ">💾 Download HTML</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Store for copy functions
    window.currentNewsletterHTML = newsletterHTML;
    window.currentEmailSubject = subject;

    console.log('✅ Newsletter preview shown');
}

function generateNewsletterHTML(property, location, photos) {
    const price = property.asking_price ? `£${property.asking_price.toLocaleString()}` : '';
    const beds = property.bedrooms || '4';
    const baths = property.bathrooms || '3';

    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #006B3D 0%, #00874D 100%); padding: 2rem; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 1.8rem;">New Property Alert</h1>
            </div>

            <!-- Hero Image -->
            ${photos.length > 0 ? `
                <img src="${photos[0]}" style="width: 100%; height: 350px; object-fit: cover;" alt="Property">
            ` : ''}

            <!-- Content -->
            <div style="padding: 2rem; background: white;">
                <h2 style="color: #2c3e50; margin: 0 0 1rem 0;">${price}</h2>
                <p style="font-size: 1.1rem; color: #6c757d; margin: 0 0 1.5rem 0;">
                    ${beds} Bedroom ${property.property_type || 'Property'} | ${baths} Bathrooms
                </p>
                <p style="color: #2c3e50; line-height: 1.6; margin-bottom: 1.5rem;">
                    Beautiful ${property.property_type || 'property'} in ${location.postcode || 'prime location'}.
                    Modern kitchen, spacious living areas, private garden. Excellent schools and transport links nearby.
                </p>

                <!-- Photo Grid -->
                ${photos.length > 1 ? `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 1.5rem;">
                        ${photos.slice(1, 4).map(photo => `
                            <img src="${photo}" style="width: 100%; height: 140px; object-fit: cover; border-radius: 8px;" alt="Property photo">
                        `).join('')}
                    </div>
                ` : ''}

                <!-- CTA Button -->
                <div style="text-align: center; margin-top: 2rem;">
                    <a href="mailto:agent@savills.com?subject=Viewing Request - ${location.postcode}" style="
                        display: inline-block;
                        padding: 1rem 2rem;
                        background: linear-gradient(135deg, #006B3D 0%, #00874D 100%);
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                        font-size: 1.1rem;
                    ">Book a Viewing</a>
                </div>
            </div>

            <!-- Footer -->
            <div style="background: #2c3e50; padding: 1.5rem; text-align: center; color: white; font-size: 0.85rem;">
                <p style="margin: 0;">Savills London | agent@savills.com | 020 XXXX XXXX</p>
            </div>
        </div>
    `;
}

function copyNewsletterHTML() {
    const html = window.currentNewsletterHTML;
    navigator.clipboard.writeText(html).then(() => {
        showToast('success', '✅ Copied HTML to clipboard!');
    });
}

function downloadNewsletterHTML() {
    const html = window.currentNewsletterHTML;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', '💾 Downloaded HTML file!');
}

// ============================================================================
// GLOBAL EXPORTS
// ============================================================================

window.generatePortalListing = generatePortalListing;
window.generateSocialMedia = generateSocialMedia;
window.generateNewsletter = generateNewsletter;

console.log('✅ Repurpose Generator loaded');
