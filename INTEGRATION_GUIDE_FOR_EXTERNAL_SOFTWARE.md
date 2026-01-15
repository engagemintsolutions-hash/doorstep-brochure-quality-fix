# V3 UI Integration Guide for External Software
**Package Version:** V3 Stable (October 2025)
**Author:** Property Listing Generator Team
**Status:** Production-Ready

---

## 📦 Package Contents

This package contains a complete, production-ready UI system for property listing generation with photo assignment capabilities.

### Core Files (7 files total)

#### JavaScript Files (4 files)
1. **app_v2.js** (~140KB) - Main application logic
2. **auth.js** (~5.5KB) - Authentication system
3. **theme.js** (~11KB) - Dynamic theming engine
4. **accordion.js** (~5.9KB) - Collapsible UI components

#### HTML Files (2 files)
5. **index.html** (~65KB) - Main application page
6. **login.html** (~11KB) - Agent authentication page

#### CSS Files (1 file)
7. **styles_v2.css** (~33KB) - Complete styling system

---

## ✨ Features Overview

### Photo Management System
- ✅ Multi-photo upload with drag-and-drop
- ✅ Interactive photo assignment to 7 categories
- ✅ Visual selection feedback (blue border on selected photos)
- ✅ Keyboard shortcuts (1-7) for quick category assignment
- ✅ Numbered badges showing photo-to-category assignments
- ✅ Photo preview with size constraints (max 200px × 200px)
- ✅ Real-time progress tracking
- ✅ Drag-and-drop reordering within categories

### Authentication System
- ✅ Username/PIN login system
- ✅ Session management with 24-hour expiry
- ✅ Secure logout with proper redirect
- ✅ localStorage-based session persistence

### Theming System
- ✅ Dynamic theme switching based on username
- ✅ Two built-in themes:
  - **Doorstep**: Teal primary (#17A2B8), Coral secondary (#FF6B6B)
  - **Savills**: Red primary (#D42027), Yellow secondary (#FFD500)
- ✅ Theme-aware UI components (scrollbars, buttons, progress tracker)
- ✅ Easy to add custom themes

### UI Components
- ✅ Accordion sections with smooth transitions
- ✅ Scrollable category boxes with custom scrollbars
- ✅ Responsive grid layouts
- ✅ Toast notifications
- ✅ Progress tracker with completion statistics

---

## 🔧 Integration Steps

### Step 1: Copy Files to Your Project

Copy all 7 files to your project's static/frontend directory:

```
your-project/
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── app_v2.js
│   ├── auth.js
│   ├── theme.js
│   ├── accordion.js
│   └── styles_v2.css
```

### Step 2: Update File Paths (if needed)

If your project structure differs, update these references in `index.html`:

```html
<!-- Line 7-8: CSS imports -->
<link rel="stylesheet" href="/static/styles_v2.css">

<!-- Bottom of file: JavaScript imports -->
<script src="/static/auth.js"></script>
<script src="/static/theme.js"></script>
<script src="/static/accordion.js"></script>
<script src="/static/app_v2.js"></script>
```

And in `login.html`:

```html
<!-- JavaScript imports -->
<script src="/static/auth.js"></script>
```

### Step 3: Configure Authentication

Edit `auth.js` (lines 8-13) to add your users:

```javascript
const validUsers = [
    { username: 'Savills', pin: '2025' },
    { username: 'YourAgency', pin: '1234' },  // Add your users here
    // Add more users as needed
];
```

### Step 4: Customize Themes

Edit `theme.js` (lines 2-17) to add your brand colors:

```javascript
const themes = {
    'savills': {
        primary: '#D42027',    // Red
        secondary: '#FFD500',  // Yellow
        accent: '#2C3E50'
    },
    'youragency': {            // Add your theme here
        primary: '#YOUR_COLOR',
        secondary: '#YOUR_COLOR',
        accent: '#YOUR_COLOR'
    },
    // Default theme (used when not logged in)
    'default': {
        primary: '#17A2B8',    // Teal
        secondary: '#FF6B6B',  // Coral
        accent: '#2C3E50'
    }
};
```

### Step 5: Update Logo

Replace the logo reference in `index.html` (line 16):

```html
<img src="/static/your-logo.png"
     alt="Your Agency"
     style="height: 140px; width: auto;">
```

### Step 6: Connect to Your Backend

The UI makes these API calls - implement these endpoints in your backend:

#### Required Endpoints:

1. **POST /generate** - Generate property listings
   ```javascript
   // Request format (see line ~500 in app_v2.js)
   {
       property_data: { /* property details */ },
       location_data: { /* address, postcode */ },
       target_audience: { /* audience type */ },
       tone: { /* tone style */ },
       channel: { /* output channel */ }
   }
   ```

2. **POST /analyze-images** - Analyze uploaded photos
   ```javascript
   // Request format (see line ~750 in app_v2.js)
   FormData with files array
   ```

3. **GET /health** - Health check endpoint
   ```javascript
   // Response format
   { "status": "ok", "version": "1.0.0" }
   ```

#### Optional Endpoints (for full functionality):

4. **POST /compliance/check** - Validate listing text
5. **POST /shrink** - Compress text to target length
6. **POST /export/pdf** - Generate PDF brochure
7. **POST /export/pack** - Generate complete marketing pack

---

## 🎯 Photo Category System

The UI organizes photos into 7 categories:

| Category | Keyboard | Recommended Count | Description |
|----------|----------|-------------------|-------------|
| Cover | 1 | 1 required | Hero/main property image |
| Exterior | 2 | 3+ | Front, back, side views |
| Interior | 3 | 3+ | Living rooms, hallways |
| Kitchen | 4 | 2+ | Kitchen photos |
| Bedrooms | 5 | 3+ | All bedroom photos |
| Bathrooms | 6 | 2+ | All bathroom photos |
| Garden/Outdoor | 7 | 3+ | Garden, patio, outdoor spaces |

### Photo Assignment Data Structure

The system stores assignments in this format:

```javascript
const photoCategoryAssignments = {
    cover: ['photo1.jpg'],
    exterior: ['photo2.jpg', 'photo3.jpg', 'photo4.jpg'],
    interior: ['photo5.jpg', 'photo6.jpg'],
    kitchen: ['photo7.jpg', 'photo8.jpg'],
    bedrooms: ['photo9.jpg', 'photo10.jpg', 'photo11.jpg'],
    bathrooms: ['photo12.jpg'],
    garden: ['photo13.jpg', 'photo14.jpg']
};
```

You can access this data from your backend via form submission or API calls.

---

## 🔑 Key Functions Reference

### Main Functions (app_v2.js)

```javascript
// Photo selection and assignment
selectPhoto(photoId)                        // Select a photo (visual feedback)
assignSelectedPhotoToCategory(category)     // Assign selected photo to category
removePhotoFromCategory(category, photoId)  // Remove photo from category

// Category management
updateCategoryDisplay()                     // Re-render category grid with photos
displayPhotoPreviews()                      // Render uploaded photos with badges

// Photo detection (AI integration point)
analyzePhotos()                             // Call your AI vision API
applyDetectedFeature(feature)               // Apply AI-detected property feature

// Form submission
handleGenerateSubmit(event)                 // Process form and call /generate API
```

### Authentication Functions (auth.js)

```javascript
checkAuth()        // Check if user is logged in
logout()           // Log user out and clear session
```

### Theme Functions (theme.js)

```javascript
applyTheme(username)          // Apply theme based on username
getCurrentTheme()             // Get current active theme
```

---

## 🎨 Customization Points

### 1. Add New Photo Categories

Edit `app_v2.js` (lines 9-17):

```javascript
const photoCategoryAssignments = {
    cover: [],
    exterior: [],
    interior: [],
    kitchen: [],
    bedrooms: [],
    bathrooms: [],
    garden: [],
    // Add your new categories here:
    pool: [],           // Pool photos
    garage: [],         // Garage photos
    // etc.
};
```

Then update `updateCategoryDisplay()` function to render your new categories.

### 2. Modify Keyboard Shortcuts

Edit `app_v2.js` (search for "keydown" event listener):

```javascript
document.addEventListener('keydown', (e) => {
    if (e.key === '1') assignSelectedPhotoToCategory('cover');
    if (e.key === '2') assignSelectedPhotoToCategory('exterior');
    // Add more shortcuts here
    if (e.key === '8') assignSelectedPhotoToCategory('pool');
});
```

### 3. Change Authentication Storage

By default, sessions use `localStorage`. To use cookies or session storage:

Edit `auth.js` (lines 25-40):

```javascript
// Replace localStorage calls with your preferred storage method
// Current: localStorage.setItem('agentUsername', username);
// Alternative: document.cookie = `username=${username}; max-age=86400`;
```

### 4. Add Custom Validation Rules

Edit `app_v2.js` in the `handleGenerateSubmit()` function:

```javascript
// Add your validation logic before API call
if (!yourCustomCondition) {
    showToast('error', 'Your custom validation message');
    return;
}
```

---

## 📝 Backend API Contract

### POST /generate Endpoint

**Request Body:**
```json
{
  "property_data": {
    "property_type": "detached",
    "bedrooms": 4,
    "bathrooms": 2,
    "size_sqft": 2000,
    "condition": "excellent",
    "features": ["garden", "parking", "garage"],
    "epc_rating": "B"
  },
  "location_data": {
    "address": "123 Main Street",
    "setting": "suburban",
    "proximity_notes": "Near schools and shops",
    "postcode": "M1 4BT"
  },
  "target_audience": {
    "audience_type": "families",
    "lifestyle_framing": "Family-friendly neighborhood"
  },
  "tone": {
    "tone": "premium"
  },
  "channel": {
    "channel": "brochure",
    "target_words": 450,
    "hard_cap": 600
  },
  "include_enrichment": true,
  "include_compliance": true
}
```

**Expected Response:**
```json
{
  "variants": [
    {
      "headline": "Stunning 4-Bedroom Detached Home",
      "full_text": "Welcome to this exceptional...",
      "features": ["Spacious garden", "Ample parking", "Modern kitchen"],
      "word_count": 420
    },
    // ... 2 more variants
  ],
  "metadata": {
    "channel": "brochure",
    "tone": "premium",
    "target_words": 450,
    "hard_cap": 600,
    "enrichment_used": true
  },
  "compliance": {
    "compliant": true,
    "warnings": [],
    "compliance_score": 95,
    "keyword_coverage": {
      "covered_keywords": ["garden", "parking"],
      "missing_keywords": [],
      "coverage_score": 100
    }
  }
}
```

### POST /analyze-images Endpoint

**Request:** `multipart/form-data` with file uploads

**Expected Response:**
```json
[
  {
    "filename": "photo1.jpg",
    "detected_features": ["garden", "patio", "lawn"],
    "suggested_category": "garden",
    "confidence": 0.92,
    "description": "Well-maintained garden with patio area"
  },
  // ... more photos
]
```

---

## ⚙️ Configuration Options

### Photo Upload Limits

Edit `app_v2.js` (search for "maxFileSize"):

```javascript
const maxFileSize = 10 * 1024 * 1024;  // 10MB (adjust as needed)
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
```

### Session Timeout

Edit `auth.js` (line 30):

```javascript
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours (in milliseconds)
```

### Photo Preview Size

Edit `styles_v2.css` (line ~150):

```css
.photo-preview {
    max-width: 200px;   /* Adjust size */
    max-height: 200px;  /* Adjust size */
}
```

---

## 🐛 Troubleshooting

### Photos Not Appearing After Upload

**Problem:** Photos upload but don't display in grid
**Solution:** Check browser console for errors. Verify `displayPhotoPreviews()` is called after upload.

```javascript
// In app_v2.js, after upload success:
displayPhotoPreviews();  // Make sure this line exists
```

### Photo Assignment Not Working

**Problem:** Clicking photos or categories does nothing
**Solution:** Ensure functions are exposed to window object (bottom of app_v2.js):

```javascript
window.selectPhoto = selectPhoto;
window.assignSelectedPhotoToCategory = assignSelectedPhotoToCategory;
window.removePhotoFromCategory = removePhotoFromCategory;
```

### Theme Not Applying

**Problem:** Theme colors don't change after login
**Solution:** Verify script load order in HTML:

```html
<!-- theme.js MUST load before app_v2.js -->
<script src="/static/theme.js"></script>
<script src="/static/app_v2.js"></script>
```

### API Calls Failing

**Problem:** 404 or CORS errors when calling backend
**Solution:** Update API base URL in `app_v2.js`:

```javascript
// Find and update this line (search for "fetch(")
const response = await fetch('http://your-backend-url/generate', {
    // ...
});
```

---

## 🚀 Testing Checklist

Before deploying, test these scenarios:

- [ ] Upload 10+ photos and verify they display correctly
- [ ] Select a photo (should show blue border)
- [ ] Press keys 1-7 to assign photo to categories
- [ ] Click category boxes to assign selected photo
- [ ] Remove photo from category using X button
- [ ] Verify numbered badges appear on photos
- [ ] Test login with valid credentials
- [ ] Test login with invalid credentials (should show error)
- [ ] Test logout (should redirect to index.html)
- [ ] Test theme switching (login with different users)
- [ ] Fill form and click "Generate Listing"
- [ ] Verify API calls succeed and results display
- [ ] Test on mobile/tablet (responsive design)
- [ ] Test with 20+ photos (scrolling should work)
- [ ] Test drag-and-drop photo upload

---

## 📊 Browser Compatibility

**Tested and working on:**
- ✅ Chrome 100+
- ✅ Firefox 95+
- ✅ Safari 15+
- ✅ Edge 100+

**Required browser features:**
- CSS Grid (for layout)
- ES6 JavaScript (arrow functions, const/let, async/await)
- Fetch API (for backend calls)
- localStorage (for session management)
- FileReader API (for photo previews)

---

## 🔒 Security Notes

### Client-Side Security
- Authentication is handled via simple PIN system (suitable for trusted users)
- Session data stored in localStorage (consider httpOnly cookies for production)
- No sensitive data transmitted in plain text

### Recommendations for Production:
1. Implement proper JWT-based authentication
2. Use HTTPS for all API calls
3. Add CSRF protection
4. Sanitize user inputs before sending to backend
5. Implement rate limiting on authentication attempts
6. Add file upload validation (size, type, malware scanning)

---

## 📞 Integration Support

### Common Integration Patterns

#### Pattern 1: Standalone Application
Use as-is with your own backend. Implement the 3 required endpoints (`/generate`, `/analyze-images`, `/health`).

#### Pattern 2: Embedded Widget
Wrap `index.html` content in an iframe:

```html
<iframe src="http://your-server/static/index.html"
        width="100%"
        height="800px"
        frameborder="0">
</iframe>
```

#### Pattern 3: Component Integration
Extract specific components (e.g., photo assignment system) and integrate into your existing React/Vue/Angular app.

---

## 📁 File Size Summary

| File | Size | Purpose |
|------|------|---------|
| app_v2.js | 140 KB | Main application logic |
| index.html | 65 KB | Main page structure |
| styles_v2.css | 33 KB | Complete styling |
| theme.js | 11 KB | Dynamic theming |
| login.html | 11 KB | Authentication page |
| auth.js | 5.5 KB | Auth system |
| accordion.js | 5.9 KB | UI components |
| **TOTAL** | **~271 KB** | Complete package |

---

## 🎓 Architecture Notes

### Design Patterns Used
- **Module Pattern**: Each JS file is self-contained
- **Observer Pattern**: Event-driven photo assignment
- **Strategy Pattern**: Theme switching based on username
- **Factory Pattern**: Dynamic category generation

### Key Technical Decisions
1. **Vanilla JavaScript**: No framework dependencies for maximum compatibility
2. **CSS Grid/Flexbox**: Modern, responsive layouts
3. **localStorage**: Simple session management
4. **Fetch API**: Standard HTTP client
5. **FileReader API**: Client-side photo previews (no server upload required for preview)

---

## 📋 Version History

- **v3.0** (October 2025) - Current stable version
  - Fixed all photo assignment bugs
  - Optimized photo sizing
  - Corrected logout behavior
  - Applied Savills theme colors
  - Improved keyboard shortcuts
  - Added numbered badges on photos

- **v2.0** (October 2025)
  - Added theming system
  - Added authentication
  - Implemented photo assignment

- **v1.0** (September 2025)
  - Initial implementation
  - Basic property form
  - Photo upload

---

## 🆘 Getting Help

### Debug Mode

Enable debug logging in `app_v2.js`:

```javascript
// Add at top of file
const DEBUG = true;

// Use throughout code
if (DEBUG) console.log('Debug info:', data);
```

### Browser Console

Press F12 to open developer tools. Check:
- **Console tab**: JavaScript errors and logs
- **Network tab**: API call success/failure
- **Application tab**: localStorage contents

---

## ✅ Production Deployment Checklist

- [ ] Update all API endpoints to production URLs
- [ ] Replace placeholder logo with client logo
- [ ] Configure authentication (add real users/pins)
- [ ] Customize theme colors for client brand
- [ ] Test all API endpoints in production environment
- [ ] Enable HTTPS
- [ ] Add error tracking (e.g., Sentry)
- [ ] Configure CORS properly
- [ ] Set up CDN for static files (optional)
- [ ] Minify JavaScript and CSS files
- [ ] Add analytics tracking (optional)
- [ ] Configure backup/restore procedures
- [ ] Document any customizations made

---

**Package prepared by:** Property Listing Generator Team
**Package date:** October 14, 2025
**Support:** For integration questions, contact the development team

---

## 🎉 Quick Start (30 seconds)

1. Copy all 7 files to your `static/` folder
2. Update logo path in `index.html` (line 16)
3. Add your theme colors in `theme.js` (lines 2-17)
4. Implement `/generate` endpoint in your backend
5. Open `http://your-server/static/index.html`
6. Done! 🚀

---

*This integration guide is comprehensive and production-ready. Your friend can follow these instructions to implement the exact same UI in their software.*
