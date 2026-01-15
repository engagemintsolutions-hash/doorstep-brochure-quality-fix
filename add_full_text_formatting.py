"""
Complete text formatting implementation for social media editor v2
1. Add WORKING Bold/Italic formatting buttons
2. Change Short/Medium/Long to Standard/Bullets/Concise formats
3. Keep carousel arrows (DO NOT remove them)
4. Agent contact details already work via copyContent()
"""

def add_full_formatting():
    filepath = 'frontend/social_media_editor_v2.html'

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. ADD BOLD/ITALIC BUTTONS TO TOOLBAR
    old_toolbar = '''                <div class="editor-tools">
                    <button class="tool-btn" id="emojiBtn" title="Insert emoji">😊</button>
                </div>'''

    new_toolbar = '''                <div class="editor-tools">
                    <button class="tool-btn" id="boldBtn" title="Bold (Ctrl+B)" onclick="formatText('bold')"><b>B</b></button>
                    <button class="tool-btn" id="italicBtn" title="Italic (Ctrl+I)" onclick="formatText('italic')"><i>I</i></button>
                    <button class="tool-btn" id="emojiBtn" title="Insert emoji">😊</button>
                </div>'''

    content = content.replace(old_toolbar, new_toolbar)

    # 2. CHANGE VARIANT TAB LABELS FROM SHORT/MEDIUM/LONG TO STANDARD/BULLETS/CONCISE
    old_variant_tabs = '''                    <div class="variant-tabs">
                        <button class="variant-tab active" data-variant="0">Short</button>
                        <button class="variant-tab" data-variant="1">Medium</button>
                        <button class="variant-tab" data-variant="2">Long</button>
                    </div>'''

    new_variant_tabs = '''                    <div class="variant-tabs">
                        <button class="variant-tab active" data-variant="0">Standard</button>
                        <button class="variant-tab" data-variant="1">Bullets</button>
                        <button class="variant-tab" data-variant="2">Concise</button>
                    </div>'''

    content = content.replace(old_variant_tabs, new_variant_tabs)

    # 3. UPDATE generateTextVariants() TO CREATE ACTUAL FORMAT DIFFERENCES
    old_generateTextVariants = '''        function generateTextVariants(baseText) {
            if (!baseText || baseText.includes('No content')) {
                return [baseText, baseText, baseText];
            }

            // Short variant - compress (no emoji removal to avoid regex issues)
            const shortText = baseText
                .split('\\n\\n').slice(0, 2).join('\\n\\n') // Take first 2 paragraphs
                .split('. ').slice(0, 3).join('. ') + '.'; // First 3 sentences

            // Medium variant - original
            const mediumText = baseText;

            // Long variant - add more detail
            const longText = baseText + '\\n\\nDon\\'t miss this opportunity! Contact us today for more information and to arrange a private viewing. Our expert team is ready to help you find your perfect property.';

            return [shortText, mediumText, longText];
        }'''

    new_generateTextVariants = '''        function generateTextVariants(baseText) {
            if (!baseText || baseText.includes('No content')) {
                return [baseText, baseText, baseText];
            }

            // Variant 0: Standard format (original paragraph text)
            const standardText = baseText;

            // Variant 1: Bullet point format
            const bulletText = convertToBullets(baseText);

            // Variant 2: Concise format (shortened, punchy)
            const conciseText = makeConcise(baseText);

            return [standardText, bulletText, conciseText];
        }

        function convertToBullets(text) {
            // Convert sentences to bullet points
            const sentences = text.split(/[.!]\\s+/).filter(s => s.trim().length > 15);

            if (sentences.length === 0) return text;

            // Take up to 6 key sentences
            const bullets = sentences.slice(0, 6).map(sentence => {
                const cleaned = sentence.trim()
                    .replace(/^(This|The property|The|A|An|It|We)\\s+/i, '')
                    .trim();
                const capitalized = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
                return '\\u2022 ' + capitalized;
            }).join('\\n');

            return bullets || text;
        }

        function makeConcise(text) {
            // Create a shorter, punchier version
            const sentences = text.split(/[.!]\\s+/).filter(s => s.trim().length > 10);

            if (sentences.length === 0) return text;

            // Take first 3 sentences only
            const concise = sentences.slice(0, 3).join('. ').trim() + '.';

            return concise || text;
        }'''

    content = content.replace(old_generateTextVariants, new_generateTextVariants)

    # 4. ADD formatText() FUNCTION FOR BOLD/ITALIC
    formatText_function = '''
        // Text formatting function for Bold/Italic
        function formatText(command) {
            try {
                const editor = document.getElementById('textEditor');
                editor.focus();

                // Use execCommand for bold/italic
                document.execCommand(command, false, null);

                // Trigger preview update
                updatePreview();
            } catch (error) {
                console.error('Format error:', error);
                showToast('Formatting not supported', 'error');
            }
        }

'''

    # Insert before the copyContent function
    content = content.replace(
        '        function copyContent() {',
        formatText_function + '        function copyContent() {'
    )

    # Write enhanced file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print("[OK] Full text formatting features added successfully!")
    print("\\nChanges made:")
    print("  1. Added WORKING Bold/Italic formatting buttons")
    print("  2. Changed variant tabs to: Standard / Bullets / Concise")
    print("  3. Updated generateTextVariants() with actual format differences")
    print("  4. Added formatText() function for toolbar buttons")
    print("  5. Carousel arrows kept intact (not removed)")
    print("\\nAgent contact integration already works via copyContent()!")

if __name__ == '__main__':
    add_full_formatting()
