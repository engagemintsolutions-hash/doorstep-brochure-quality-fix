
// ============================================================================
// TEXT TRANSFORMATION CHATBOT
// ============================================================================

const ChatbotState = {
    currentText: null,
    currentElement: null,
    currentPageType: null,
    transformedText: null,
    transformationStyle: null,
    previewMessage: null
};

function openChatbot(textElement, pageType) {
    const panel = document.getElementById("chatbotPanel");
    const pageTitle = document.getElementById("chatbotPageTitle");
    const wordCount = document.getElementById("chatbotWordCount");
    const toggleBtn = document.getElementById("toggleChatbotBtn");

    const currentText = textElement.textContent.trim();
    ChatbotState.currentText = currentText;
    ChatbotState.currentElement = textElement;
    ChatbotState.currentPageType = pageType || "general";
    pageTitle.textContent = pageType || "Text Content";
    const words = currentText.split(/\s+/).length;
    wordCount.textContent = words + " words";
    panel.style.display = "flex";

    // Add active state to button
    if (toggleBtn) {
        toggleBtn.classList.add("active");
    }

    console.log("Chatbot opened for " + pageType + ", " + words + " words");
}

function closeChatbot() {
    document.getElementById("chatbotPanel").style.display = "none";
    const toggleBtn = document.getElementById("toggleChatbotBtn");

    // Remove active state from button
    if (toggleBtn) {
        toggleBtn.classList.remove("active");
    }

    ChatbotState.currentText = null;
    ChatbotState.currentElement = null;
    ChatbotState.currentPageType = null;
}

async function transformText(style, customInstruction) {
    if (!ChatbotState.currentText || !ChatbotState.currentElement) {
        showToast("No text selected for transformation", "error");
        return;
    }
    console.log("Transforming text with style: " + style);

    // Special handling for "regenerate" - generate fresh content instead of transforming
    if (style === "regenerate") {
        await regenerateTextFromScratch();
        return;
    }

    try {
        const payload = {
            original_text: ChatbotState.currentText,
            page_title: ChatbotState.currentPageType || "Content",
            transformation_style: style,
            page_type: ChatbotState.currentPageType,
            custom_instruction: customInstruction,
            session_id: EditorState.sessionId  // Include session_id for usage tracking
        };
        const response = await fetch("/api/transform-text", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            throw new Error("Transformation failed: " + response.statusText);
        }
        const result = await response.json();
        console.log("Transformation result:", result);
        ChatbotState.transformedText = result.transformed_text;
        ChatbotState.transformationStyle = result.transformation_style;
        ChatbotState.previewMessage = result.preview_message;
        showTransformPreview(result);
    } catch (error) {
        console.error("Transformation error:", error);
        showToast("Transformation failed: " + error.message, "error");
    }
}

function showTransformPreview(result) {
    console.log("Showing preview modal with result:", result);

    const modal = document.getElementById("transformPreviewModal");
    if (!modal) {
        console.error("Preview modal not found!");
        return;
    }

    document.getElementById("previewMessage").textContent = result.preview_message;
    document.getElementById("originalTextPreview").textContent = result.original_text;
    const originalWords = result.original_text.split(/\s+/).length;
    document.getElementById("originalWordCount").textContent = originalWords + " words";
    document.getElementById("originalCharCount").textContent = result.original_text.length + " characters";
    document.getElementById("transformedTextPreview").textContent = result.transformed_text;
    const transformedWords = result.transformed_text.split(/\s+/).length;
    document.getElementById("transformedWordCount").textContent = transformedWords + " words";
    document.getElementById("transformedCharCount").textContent = result.transformed_text.length + " characters";

    // Force display with multiple methods
    modal.style.display = "flex";
    modal.style.visibility = "visible";
    modal.style.opacity = "1";
    modal.classList.add("visible");

    console.log("Modal should now be visible");
}

function closeTransformPreview() {
    const modal = document.getElementById("transformPreviewModal");
    if (modal) {
        modal.style.display = "none";
        modal.style.visibility = "hidden";
        modal.style.opacity = "0";
        modal.classList.remove("visible");
    }
}

function applyTransformation() {
    if (!ChatbotState.transformedText || !ChatbotState.currentElement) {
        showToast("No transformation to apply", "error");
        return;
    }
    ChatbotState.currentElement.textContent = ChatbotState.transformedText;
    EditorState.isDirty = true;
    closeTransformPreview();
    closeChatbot();
    showToast("Text transformation applied successfully!", "success");
    console.log("Transformation applied");
}

function initializeChatbotListeners() {
    const closeChatbotBtn = document.getElementById("closeChatbotBtn");
    if (closeChatbotBtn) {
        closeChatbotBtn.addEventListener("click", closeChatbot);
    }
    const styleButtons = document.querySelectorAll(".style-btn");
    styleButtons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const style = btn.dataset.style;
            if (!style) return;
            btn.classList.add("loading");
            try {
                await transformText(style);
            } finally {
                btn.classList.remove("loading");
            }
        });
    });
    const customTransformBtn = document.getElementById("customTransformBtn");
    const customInstruction = document.getElementById("customInstruction");
    if (customTransformBtn && customInstruction) {
        customTransformBtn.addEventListener("click", async () => {
            const instruction = customInstruction.value.trim();
            if (!instruction) {
                showToast("Please enter a custom instruction", "warning");
                return;
            }
            customTransformBtn.classList.add("loading");
            try {
                await transformText("paragraph", instruction);
            } finally {
                customTransformBtn.classList.remove("loading");
            }
        });
    }
    const closePreviewBtn = document.getElementById("closePreviewBtn");
    const cancelTransformBtn = document.getElementById("cancelTransformBtn");
    const applyTransformBtn = document.getElementById("applyTransformBtn");
    if (closePreviewBtn) closePreviewBtn.addEventListener("click", closeTransformPreview);
    if (cancelTransformBtn) cancelTransformBtn.addEventListener("click", closeTransformPreview);
    if (applyTransformBtn) applyTransformBtn.addEventListener("click", applyTransformation);
    console.log("Chatbot listeners initialized");
}

// Store currently focused editable element
let currentEditableElement = null;
let currentPageType = null;

function getPageType(element) {
    const pageElement = element.closest(".brochure-page");
    if (!pageElement) return "general";

    // Try data-page-type attribute first
    if (pageElement.dataset.pageType) {
        return pageElement.dataset.pageType;
    }

    // Try to get from page ID
    if (pageElement.id) {
        const pageId = pageElement.id.toLowerCase();
        if (pageId.includes("kitchen")) return "kitchen";
        if (pageId.includes("bedroom")) return "bedroom";
        if (pageId.includes("bathroom")) return "bathroom";
        if (pageId.includes("garden")) return "garden";
        if (pageId.includes("living")) return "living";
        if (pageId.includes("exterior")) return "exterior";
        if (pageId.includes("location")) return "location";
    }

    // Try to get from page title
    const titleElement = pageElement.querySelector("h1, h2, h3, .page-title");
    if (titleElement) {
        const title = titleElement.textContent.toLowerCase();
        if (title.includes("kitchen")) return "kitchen";
        if (title.includes("bedroom")) return "bedroom";
        if (title.includes("bathroom")) return "bathroom";
        if (title.includes("garden") || title.includes("outdoor")) return "garden";
        if (title.includes("living")) return "living";
        if (title.includes("exterior")) return "exterior";
        if (title.includes("location")) return "location";
    }

    return "general";
}

function enhanceTextEditing() {
    // Track which editable element is currently focused/being edited
    document.addEventListener("focus", (e) => {
        if (e.target.getAttribute("contenteditable") === "true") {
            currentEditableElement = e.target;
            currentPageType = getPageType(e.target);
            console.log("Focused on editable element in page:", currentPageType);
        }
    }, true);

    document.addEventListener("blur", (e) => {
        if (e.target.getAttribute("contenteditable") === "true") {
            // Keep the reference for a moment in case they want to transform
            setTimeout(() => {
                if (document.activeElement.getAttribute("contenteditable") !== "true") {
                    // Only clear if we're not on another editable element
                    // currentEditableElement = null;
                }
            }, 100);
        }
    }, true);

    // Add click handler for the toggle button
    const toggleBtn = document.getElementById("toggleChatbotBtn");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            const panel = document.getElementById("chatbotPanel");

            // If panel is already open, just toggle it
            if (panel.style.display === "flex") {
                closeChatbot();
                return;
            }

            // If we have a currently focused/selected editable element, use it
            if (currentEditableElement && currentEditableElement.textContent.trim()) {
                openChatbot(currentEditableElement, currentPageType);
            } else {
                // Try to find the active element
                const activeElement = document.activeElement;
                if (activeElement && activeElement.getAttribute("contenteditable") === "true") {
                    const pageType = getPageType(activeElement);
                    openChatbot(activeElement, pageType);
                } else {
                    // Prompt user to select text first
                    showToast("Please click on some text to edit first, then click AI Transform", "info");
                }
            }
        });
    }
}

/**
 * Regenerate text from scratch using the /generate/room endpoint
 */
async function regenerateTextFromScratch() {
    console.log("🔄 Regenerating text from scratch");

    if (!EditorState.sessionId) {
        showToast("No session ID available", "error");
        return;
    }

    const pageType = ChatbotState.currentPageType || "general";

    // Get property info from session if available
    const property = EditorState.sessionData?.property || {};
    const bedrooms = property.bedrooms || 3;
    const propertyType = property.type || 'property';
    const address = property.address || 'this location';

    // Create appropriate prompt based on page type
    let prompt = "";

    if (pageType === "location") {
        prompt = `Write a comprehensive, professional description of the LOCATION for this ${bedrooms} bedroom ${propertyType} at ${address}. Include details about the area's character, local amenities, transport links, schools, shopping, dining, and what makes this neighborhood desirable. Write 150-200 words in flowing paragraphs.`;
    } else {
        // General property description
        prompt = `Write a comprehensive, professional description of this ${bedrooms} bedroom ${propertyType} at ${address}. Describe the accommodation, style, key features, and what makes it special. Write 150-200 words in flowing paragraphs.`;
    }

    try {
        showToast("Regenerating content...", "info");

        const payload = {
            prompt: prompt,
            target_words: 180,
            session_id: EditorState.sessionId
        };

        const response = await fetch("/generate/room", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Generation failed");
        }

        const result = await response.json();
        console.log("✅ Regeneration result:", result);

        // Store the new text and show preview
        ChatbotState.transformedText = result.text;
        ChatbotState.transformationStyle = "regenerate";

        const previewResult = {
            original_text: ChatbotState.currentText,
            transformed_text: result.text,
            transformation_style: "regenerate",
            preview_message: "✨ Fresh content generated from scratch using improved AI prompt (no jargon, no bullet points)"
        };

        showTransformPreview(previewResult);

    } catch (error) {
        console.error("❌ Regeneration error:", error);
        showToast("Regeneration failed: " + error.message, "error");
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        initializeChatbotListeners();
        enhanceTextEditing();
    });
} else {
    initializeChatbotListeners();
    enhanceTextEditing();
}

console.log("Chatbot system loaded and ready");
