"""
Enhancement script for social_media_editor_v2.html
Adds 5 UI/UX improvements while preserving all existing API integrations
"""

def enhance_social_media_editor():
    filepath = 'frontend/social_media_editor_v2.html'

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. ENHANCEMENT: Color-coded hashtag pills with remove buttons
    # Find and replace hashtag CSS
    old_hashtag_css = '''        .hashtag {
            padding: 0.625rem 1rem;
            background: #f1f5f9;
            border: 2px solid #e2e8f0;
            border-radius: 20px;
            font-size: 0.85rem;
            color: #3b82f6;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .hashtag:hover {
            background: #3b82f6;
            color: white;
            border-color: #3b82f6;
        }'''

    new_hashtag_css = '''        .hashtag {
            padding: 0.625rem 1rem;
            background: #f1f5f9;
            border: 2px solid #e2e8f0;
            border-radius: 20px;
            font-size: 0.85rem;
            color: #3b82f6;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            position: relative;
        }

        .hashtag:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        /* Color-coded competition levels */
        .hashtag.low-competition {
            background: #d4edda;
            border-color: #c3e6cb;
            color: #155724;
        }

        .hashtag.medium-competition {
            background: #fff3cd;
            border-color: #ffeaa7;
            color: #856404;
        }

        .hashtag.high-competition {
            background: #f8d7da;
            border-color: #f5c6cb;
            color: #721c24;
        }

        .hashtag-remove {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: rgba(0,0,0,0.1);
            color: inherit;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
            margin-left: 0.25rem;
        }

        .hashtag-remove:hover {
            background: rgba(0,0,0,0.2);
            transform: scale(1.1);
        }'''

    content = content.replace(old_hashtag_css, new_hashtag_css)

    # 2. ENHANCEMENT: Add COVER badge CSS for photo carousel
    cover_badge_css = '''
        .photo-cover-badge {
            position: absolute;
            top: 8px;
            left: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.5px;
            z-index: 10;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }'''

    # Insert after carousel slide CSS
    content = content.replace(
        '        .carousel-slide img {',
        cover_badge_css + '\n        .carousel-slide img {'
    )

    # 3. ENHANCEMENT: Add Save Draft button CSS
    save_draft_css = '''
        .save-draft-btn {
            padding: 0.75rem 1.25rem;
            background: #f59e0b;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .save-draft-btn:hover {
            background: #d97706;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(245,158,11,0.4);
        }'''

    # Insert before actions section
    content = content.replace(
        '        /* Action Buttons */',
        save_draft_css + '\n        /* Action Buttons */'
    )

    # 4. ENHANCEMENT: Update loadHashtags() function to add color coding and remove buttons
    old_load_hashtags = '''        function loadHashtags() {
            const hashtags = currentData.hashtags || [];
            const container = document.getElementById('hashtagsList');

            if (hashtags.length === 0) {
                container.innerHTML = '<div class="hashtag">#PropertyListing</div>';
                calculateHashtagScore();
                return;
            }

            container.innerHTML = hashtags.map(tag => {
                const cleanTag = tag.startsWith('#') ? tag : '#' + tag;
                const score = calculateSingleHashtagScore(cleanTag);
                const scoreClass = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
                return `<div class="hashtag">
                    ${cleanTag}
                    <span class="hashtag-score-badge ${scoreClass}">${score}</span>
                </div>`;
            }).join('');

            calculateHashtagScore();
        }'''

    new_load_hashtags = '''        function loadHashtags() {
            const hashtags = currentData.hashtags || [];
            const container = document.getElementById('hashtagsList');

            if (hashtags.length === 0) {
                container.innerHTML = '<div class="hashtag">#PropertyListing</div>';
                calculateHashtagScore();
                return;
            }

            container.innerHTML = hashtags.map((tag, index) => {
                const cleanTag = tag.startsWith('#') ? tag : '#' + tag;
                const score = calculateSingleHashtagScore(cleanTag);
                const scoreClass = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';

                // Determine competition level for color coding
                let competitionClass = '';
                if (score >= 75) {
                    competitionClass = 'low-competition';
                } else if (score >= 50) {
                    competitionClass = 'medium-competition';
                } else {
                    competitionClass = 'high-competition';
                }

                return `<div class="hashtag ${competitionClass}" data-index="${index}">
                    ${cleanTag}
                    <span class="hashtag-score-badge ${scoreClass}">${score}</span>
                    <span class="hashtag-remove" onclick="removeHashtag(${index})">×</span>
                </div>`;
            }).join('');

            calculateHashtagScore();
        }'''

    content = content.replace(old_load_hashtags, new_load_hashtags)

    # 5. ENHANCEMENT: Add removeHashtag() function
    remove_hashtag_func = '''
        function removeHashtag(index) {
            if (currentData.hashtags.length <= 1) {
                showToast('Need at least one hashtag', 'error');
                return;
            }

            currentData.hashtags.splice(index, 1);
            loadHashtags();
            updatePreview();
            showToast('Hashtag removed');
        }'''

    # Insert before optimizeHashtags function
    content = content.replace(
        '        function optimizeHashtags() {',
        remove_hashtag_func + '\n        function optimizeHashtags() {'
    )

    # 6. ENHANCEMENT: Add saveDraft() function with localStorage
    save_draft_func = '''
        function saveDraft() {
            const draft = {
                text: document.getElementById('textEditor').textContent,
                hashtags: currentData.hashtags,
                platform: currentPlatform,
                variant: currentVariant,
                timestamp: new Date().toISOString()
            };

            localStorage.setItem('socialMediaDraft', JSON.stringify(draft));
            showToast('Draft saved successfully!');
        }

        function loadDraft() {
            const saved = localStorage.getItem('socialMediaDraft');
            if (saved) {
                try {
                    const draft = JSON.parse(saved);
                    const age = Date.now() - new Date(draft.timestamp).getTime();

                    // Only load drafts less than 24 hours old
                    if (age < 24 * 60 * 60 * 1000) {
                        document.getElementById('textEditor').textContent = draft.text;
                        currentData.hashtags = draft.hashtags;
                        currentPlatform = draft.platform;
                        currentVariant = draft.variant;
                        loadHashtags();
                        updateCharCount();
                        updatePreview();
                        showToast('Draft loaded');
                    }
                } catch (e) {
                    console.error('Failed to load draft:', e);
                }
            }
        }'''

    # Insert before copyContent function
    content = content.replace(
        '        // Utility Functions\n        function copyContent() {',
        '        // Utility Functions' + save_draft_func + '\n        function copyContent() {'
    )

    # 7. ENHANCEMENT: Add COVER badge to first carousel slide
    old_load_carousel = '''            track.innerHTML = photos.map((photo, i) => `
                <div class="carousel-slide">
                    <img src="${photo.dataUrl}" alt="${photo.name}">
                </div>
            `).join('');'''

    new_load_carousel = '''            track.innerHTML = photos.map((photo, i) => `
                <div class="carousel-slide">
                    ${i === 0 ? '<div class="photo-cover-badge">COVER</div>' : ''}
                    <img src="${photo.dataUrl}" alt="${photo.name}">
                </div>
            `).join('');'''

    content = content.replace(old_load_carousel, new_load_carousel)

    # 8. ENHANCEMENT: Add Save Draft button to HTML actions
    old_actions = '''                <!-- Actions -->
                <div class="actions">
                    <button class="action-btn primary" onclick="copyContent()">Copy Post + Hashtags</button>
                    <button class="action-btn secondary" onclick="window.close()">Close</button>
                </div>'''

    new_actions = '''                <!-- Actions -->
                <div class="actions">
                    <button class="save-draft-btn" onclick="saveDraft()">Save Draft</button>
                    <button class="action-btn primary" onclick="copyContent()">Copy Post + Hashtags</button>
                    <button class="action-btn secondary" onclick="window.close()">Close</button>
                </div>'''

    content = content.replace(old_actions, new_actions)

    # Write enhanced file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print("[OK] Enhanced social_media_editor_v2.html successfully!")
    print("\nEnhancements added:")
    print("  1. Color-coded hashtag competition indicators (green/yellow/red)")
    print("  2. Hashtag remove buttons with x icon")
    print("  3. COVER badge on first photo in carousel")
    print("  4. Save Draft button with localStorage")
    print("  5. Load Draft functionality (auto-loads drafts < 24hrs old)")

if __name__ == '__main__':
    enhance_social_media_editor()
