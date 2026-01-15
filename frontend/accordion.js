// Collapsible Accordion Sections - DISABLED
console.log('🎯 Accordion loaded (DISABLED - all sections always visible)');

// ACCORDION DISABLED - User requested all sections to be permanently visible
// No collapsing behavior

/*
// Section configuration
const sections = [
    { id: 'imageSection', title: 'Property Images', required: true },
    { id: 'essentialDetailsSection', title: 'Essential Property Details', required: true },
    { id: 'advancedSection', title: 'Beneficial Property Features', required: false },
    { id: 'styleSection', title: 'Style & Output', required: false },
    { id: 'exampleBrochureSection', title: 'Example Brochure', required: false }
];

let currentOpenSection = null;

// Initialize accordion
function initializeAccordion() {
    console.log('🎨 Initializing accordion...');

    sections.forEach(section => {
        const sectionElement = document.getElementById(section.id);
        if (!sectionElement) {
            console.log(`⚠️ Section ${section.id} not found`);
            return;
        }

        // Find the h2 element
        const h2 = sectionElement.querySelector('h2');
        if (!h2) {
            console.log(`⚠️ No h2 found in ${section.id}`);
            return;
        }

        // Store original h2 content
        const originalH2Content = h2.innerHTML;

        // Create clickable header (theme system will style it)
        const header = document.createElement('div');
        header.className = 'accordion-header';
        header.dataset.sectionId = section.id;
        header.style.cssText = `
            cursor: pointer;
            padding: 1.25rem 1.5rem;
            border-radius: 8px;
            border: 1px solid;
            border-left: 4px solid;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.2s ease;
            margin-bottom: 0;
        `;

        header.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span class="accordion-icon" style="font-size: 0.875rem; transition: transform 0.2s ease;">▶</span>
                <h2 style="margin: 0; font-size: 1.125rem; font-weight: 600; letter-spacing: -0.01em;">${originalH2Content}</h2>
            </div>
            <span class="accordion-status" style="font-size: 0.8rem; font-weight: 500;">Click to expand</span>
        `;

        // Wrap all content after h2 in a collapsible container
        const content = document.createElement('div');
        content.className = 'accordion-content';
        content.style.cssText = `
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s ease, padding 0.4s ease, margin 0.4s ease;
            padding: 0 1.5rem;
            margin-top: 0;
        `;

        // Move all children except h2 into content
        const children = Array.from(sectionElement.children);
        children.forEach(child => {
            if (child.tagName !== 'H2') {
                content.appendChild(child);
            }
        });

        // Replace h2 with header and add content
        h2.remove();
        sectionElement.insertBefore(header, sectionElement.firstChild);
        sectionElement.appendChild(content);

        // Add click handler
        header.addEventListener('click', () => toggleSection(section.id));
    });

    // Don't auto-open any section on page load
    console.log('✅ Accordion initialized');
}

// Toggle section open/closed
function toggleSection(sectionId) {
    const sectionElement = document.getElementById(sectionId);
    if (!sectionElement) return;

    const header = sectionElement.querySelector('.accordion-header');
    const content = sectionElement.querySelector('.accordion-content');
    const icon = header.querySelector('.accordion-icon');
    const status = header.querySelector('.accordion-status');

    const isCurrentlyOpen = currentOpenSection === sectionId;

    // Close currently open section if different
    if (currentOpenSection && currentOpenSection !== sectionId) {
        closeSection(currentOpenSection);
    }

    if (isCurrentlyOpen) {
        // Close this section
        closeSection(sectionId);
        currentOpenSection = null;
    } else {
        // Open this section
        content.style.maxHeight = content.scrollHeight + 'px';
        content.style.paddingTop = '1.5rem';
        content.style.paddingBottom = '1.5rem';
        content.style.marginTop = '1rem';
        icon.style.transform = 'rotate(90deg)';
        status.textContent = 'Click to collapse';

        // Set data attribute for theme system to style
        header.setAttribute('data-expanded', 'true');

        currentOpenSection = sectionId;

        // Scroll to section smoothly
        setTimeout(() => {
            header.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// Close a section
function closeSection(sectionId) {
    const sectionElement = document.getElementById(sectionId);
    if (!sectionElement) return;

    const header = sectionElement.querySelector('.accordion-header');
    const content = sectionElement.querySelector('.accordion-content');
    const icon = header.querySelector('.accordion-icon');
    const status = header.querySelector('.accordion-status');

    content.style.maxHeight = '0';
    content.style.paddingTop = '0';
    content.style.paddingBottom = '0';
    content.style.marginTop = '0';
    icon.style.transform = 'rotate(0deg)';
    status.textContent = 'Click to expand';

    // Remove data attribute - theme system will style as collapsed
    header.removeAttribute('data-expanded');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // DISABLED: initializeAccordion();

        // Keep all feature category details open by default
        const featureCategories = document.querySelectorAll('.feature-category');
        featureCategories.forEach(details => {
            details.setAttribute('open', '');
        });
    }, 100);
});
*/
