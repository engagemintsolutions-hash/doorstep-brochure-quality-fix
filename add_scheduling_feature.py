"""
Add Social Media Scheduling Feature to Editor
Adds:
1. Schedule button next to Copy button
2. Scheduling modal with date/time picker
3. LocalStorage integration for saving scheduled posts
4. Toast notifications
5. View Calendar link
"""

def add_scheduling():
    filepath = 'frontend/social_media_editor_v2.html'

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. ADD SCHEDULE BUTTON (after Copy button, line 1133)
    old_copy_button = '''                    <button class="action-btn primary" onclick="copyContent()">Copy Post + Hashtags</button>'''

    new_buttons_with_schedule = '''                    <button class="action-btn primary" onclick="copyContent()">Copy Post + Hashtags</button>
                    <button class="action-btn schedule" onclick="openScheduleModal()">📅 Schedule Post</button>'''

    content = content.replace(old_copy_button, new_buttons_with_schedule)

    # 2. ADD "VIEW CALENDAR" LINK AT TOP (after title)
    old_title = '''    <title>Social Media Studio</title>'''

    new_title_with_nav = '''    <title>Social Media Studio</title>
    <!-- Navigation will be added in body -->'''

    content = content.replace(old_title, new_title_with_nav)

    # 3. ADD CSS FOR SCHEDULE BUTTON AND MODAL (before closing </style>)
    schedule_css = '''
        /* Schedule Button */
        .action-btn.schedule {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: 600;
        }

        .action-btn.schedule:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        /* Navigation Link */
        .nav-link {
            position: absolute;
            top: 2rem;
            right: 2rem;
            background: rgba(255, 255, 255, 0.9);
            padding: 0.75rem 1.5rem;
            border-radius: 12px;
            text-decoration: none;
            color: #667eea;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            z-index: 100;
        }

        .nav-link:hover {
            background: white;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        /* Modal Overlay */
        .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 1000;
            justify-content: center;
            align-items: center;
        }

        .modal-overlay.active {
            display: flex;
        }

        /* Modal Content */
        .modal-content {
            background: white;
            border-radius: 20px;
            padding: 2.5rem;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: modalSlideIn 0.3s ease;
        }

        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #f1f5f9;
        }

        .modal-header h3 {
            font-size: 1.75rem;
            color: #1e293b;
            margin: 0;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 2rem;
            color: #64748b;
            cursor: pointer;
            padding: 0;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            transition: all 0.2s ease;
        }

        .close-btn:hover {
            background: #f1f5f9;
            color: #1e293b;
        }

        /* Platform Selector */
        .platform-selector {
            margin-bottom: 1.5rem;
        }

        .platform-selector label {
            display: inline-flex;
            align-items: center;
            margin-right: 1.5rem;
            cursor: pointer;
            font-weight: 500;
            color: #475569;
        }

        .platform-selector input[type="checkbox"] {
            margin-right: 0.5rem;
            width: 20px;
            height: 20px;
            cursor: pointer;
        }

        /* Date Time Picker */
        .datetime-group {
            margin-bottom: 1.5rem;
        }

        .datetime-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #1e293b;
        }

        .datetime-inputs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        .datetime-inputs input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e2e8f0;
            border-radius: 10px;
            font-size: 1rem;
            transition: all 0.2s ease;
        }

        .datetime-inputs input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        /* Schedule Options */
        .schedule-options {
            display: grid;
            gap: 1rem;
            margin-top: 2rem;
        }

        .schedule-options button {
            padding: 1rem;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .schedule-options .btn-post-now {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
        }

        .schedule-options .btn-schedule {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .schedule-options .btn-draft {
            background: #f1f5f9;
            color: #64748b;
        }

        .schedule-options button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .schedule-options button:active {
            transform: translateY(0);
        }

        /* Success Message */
        .success-message {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1rem;
            display: none;
        }

        .success-message.active {
            display: block;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

    </style>'''

    # Find the closing </style> tag and insert CSS before it
    content = content.replace('    </style>', schedule_css)

    # 4. ADD NAVIGATION LINK (after opening body tag)
    old_body_start = '''    <div class="studio-container">'''

    new_body_with_nav = '''    <a href="social_media_calendar.html" class="nav-link">📅 View Calendar</a>

    <div class="studio-container">'''

    content = content.replace(old_body_start, new_body_with_nav)

    # 5. ADD SCHEDULING MODAL HTML (before toast div, line 1140)
    old_toast = '''    <div class="toast" id="toast">Action completed!</div>'''

    schedule_modal_html = '''    <!-- Scheduling Modal -->
    <div id="scheduleModal" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Schedule Post</h3>
                <button class="close-btn" onclick="closeScheduleModal()">&times;</button>
            </div>

            <div id="successMessage" class="success-message"></div>

            <div class="modal-body">
                <div class="platform-selector">
                    <label>
                        <input type="checkbox" id="platformFacebook" value="facebook" checked>
                        Facebook
                    </label>
                    <label>
                        <input type="checkbox" id="platformInstagram" value="instagram" checked>
                        Instagram
                    </label>
                </div>

                <div class="datetime-group">
                    <label>When do you want to post?</label>
                    <div class="datetime-inputs">
                        <input type="date" id="scheduleDate" required>
                        <input type="time" id="scheduleTime" required>
                    </div>
                </div>

                <div class="schedule-options">
                    <button class="btn-post-now" onclick="schedulePost('now')">
                        Post Now (Coming Soon)
                    </button>
                    <button class="btn-schedule" onclick="schedulePost('later')">
                        Schedule for Later
                    </button>
                    <button class="btn-draft" onclick="saveAsDraft()">
                        Save as Draft
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="toast" id="toast">Action completed!</div>'''

    content = content.replace(old_toast, schedule_modal_html)

    # 6. ADD JAVASCRIPT FUNCTIONS (before closing </script> tag at end)
    scheduling_js = '''
        // ==========================================
        // SCHEDULING FUNCTIONS
        // ==========================================

        function openScheduleModal() {
            const modal = document.getElementById('scheduleModal');
            modal.classList.add('active');

            // Set default date/time to tomorrow at 10am
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(10, 0, 0, 0);

            const dateStr = tomorrow.toISOString().split('T')[0];
            const timeStr = '10:00';

            document.getElementById('scheduleDate').value = dateStr;
            document.getElementById('scheduleTime').value = timeStr;
        }

        function closeScheduleModal() {
            const modal = document.getElementById('scheduleModal');
            modal.classList.remove('active');
            document.getElementById('successMessage').classList.remove('active');
        }

        function collectPostData() {
            // Get all current post data
            const caption = document.getElementById('textEditor').textContent;
            const hashtags = Array.from(document.querySelectorAll('.hashtag'))
                .map(el => el.textContent.split(/\\d+/)[0].trim());

            // Get current images
            const images = [];
            if (currentData && currentData.images) {
                images.push(...currentData.images);
            }

            // Get agent contact if enabled
            let agentContact = null;
            const contactToggle = document.getElementById('contactToggle');
            if (contactToggle && contactToggle.checked) {
                agentContact = {
                    name: document.getElementById('agentName')?.value || '',
                    phone: document.getElementById('agentPhone')?.value || '',
                    email: document.getElementById('agentEmail')?.value || ''
                };
            }

            // Get selected platforms
            const platforms = [];
            if (document.getElementById('platformFacebook').checked) platforms.push('facebook');
            if (document.getElementById('platformInstagram').checked) platforms.push('instagram');

            return {
                caption,
                hashtags,
                images,
                agentContact,
                platforms,
                propertyId: currentData?.session_id || null
            };
        }

        function schedulePost(timing) {
            const postData = collectPostData();

            // Validate platforms selected
            if (postData.platforms.length === 0) {
                showToast('Please select at least one platform', 'error');
                return;
            }

            // Validate caption
            if (!postData.caption || postData.caption.trim() === '' || postData.caption.includes('No content')) {
                showToast('Please add some text to your post first', 'error');
                return;
            }

            let scheduledTime;
            let status;

            if (timing === 'now') {
                scheduledTime = new Date();
                status = 'publishing';
                showToast('Post Now feature coming soon! Use Schedule for Later instead.', 'info');
                return;
            } else {
                // Get date and time from inputs
                const dateValue = document.getElementById('scheduleDate').value;
                const timeValue = document.getElementById('scheduleTime').value;

                if (!dateValue || !timeValue) {
                    showToast('Please select a date and time', 'error');
                    return;
                }

                scheduledTime = new Date(dateValue + 'T' + timeValue);
                status = 'scheduled';

                // Validate not in the past
                if (scheduledTime < new Date()) {
                    showToast('Cannot schedule posts in the past', 'error');
                    return;
                }
            }

            // Save to localStorage
            saveToSchedule(postData, scheduledTime, status);

            // Show success message in modal
            const successMsg = document.getElementById('successMessage');
            successMsg.textContent = `✓ Post scheduled for ${scheduledTime.toLocaleString()}!`;
            successMsg.classList.add('active');

            // Auto-close modal after 2 seconds
            setTimeout(() => {
                closeScheduleModal();
            }, 2000);
        }

        function saveAsDraft() {
            const postData = collectPostData();

            // Validate caption
            if (!postData.caption || postData.caption.trim() === '' || postData.caption.includes('No content')) {
                showToast('Please add some text to your post first', 'error');
                return;
            }

            // Save as draft (no scheduled time)
            saveToSchedule(postData, null, 'draft');

            // Show success
            const successMsg = document.getElementById('successMessage');
            successMsg.textContent = '✓ Post saved as draft!';
            successMsg.classList.add('active');

            setTimeout(() => {
                closeScheduleModal();
            }, 1500);
        }

        function saveToSchedule(postData, scheduledTime, status) {
            // Get existing posts from localStorage
            let scheduledPosts = JSON.parse(localStorage.getItem('scheduledPosts') || '[]');

            // Create new post object
            const newPost = {
                id: 'post_' + Date.now(),
                ...postData,
                scheduledTime: scheduledTime ? scheduledTime.toISOString() : null,
                status: status,
                createdAt: new Date().toISOString(),
                publishedAt: null
            };

            // Add to array
            scheduledPosts.push(newPost);

            // Save back to localStorage
            localStorage.setItem('scheduledPosts', JSON.stringify(scheduledPosts));

            console.log('✓ Post saved to schedule:', newPost);
            showToast(`Post ${status === 'draft' ? 'saved as draft' : 'scheduled'}!`);
        }

        // Close modal when clicking outside
        document.addEventListener('click', function(event) {
            const modal = document.getElementById('scheduleModal');
            if (event.target === modal) {
                closeScheduleModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const modal = document.getElementById('scheduleModal');
                if (modal && modal.classList.contains('active')) {
                    closeScheduleModal();
                }
            }
        });

    </script>'''

    # Find the last </script> tag and insert before it
    last_script_close = content.rfind('</script>')
    if last_script_close != -1:
        content = content[:last_script_close] + scheduling_js + content[last_script_close:]

    # Write updated file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    print("✓ Scheduling feature added successfully!")
    print("\nChanges made:")
    print("  1. Added 'Schedule Post' button next to Copy button")
    print("  2. Added 'View Calendar' navigation link at top")
    print("  3. Added scheduling modal with date/time picker")
    print("  4. Added platform selection (Facebook/Instagram)")
    print("  5. Added localStorage integration for saving scheduled posts")
    print("  6. Added Schedule/Draft/Post Now options")
    print("  7. Added validation and error handling")
    print("\nReady to test! Open social_media_editor_v2.html")

if __name__ == '__main__':
    add_scheduling()
