document.addEventListener('DOMContentLoaded', async () => {
    const questionInput = document.getElementById('question');
    const sendButton = document.getElementById('sendButton');
    const clearButton = document.getElementById('clearButton');
    const chatContainer = document.getElementById('chat-container');
    const modelSelect = document.getElementById('modelSelect');

    let currentTabId = null;
    let isProcessing = false;

    // Configure marked options for safe Markdown rendering
    marked.setOptions({
        headerIds: false,
        mangle: false
    });

    function appendMessage(role, content) {
        if (!content) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}-message`;

        try {
            if (role === 'assistant') {
                const renderedContent = marked.parse(content);
                messageDiv.innerHTML = `<div class="markdown-content">${renderedContent}</div>`;
            } else {
                messageDiv.textContent = content;
            }
        } catch (error) {
            console.error('Error rendering message:', error);
            messageDiv.textContent = content;
        }

        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    async function saveMessage(role, content) {
        if (!currentTabId || !content) return;

        const storageKey = `chat_${currentTabId}`;
        try {
            const storage = await browser.storage.local.get(storageKey);
            const messages = storage[storageKey] || [];
            messages.push({ role, content });
            await browser.storage.local.set({ [storageKey]: messages });
        } catch (error) {
            console.error('Error saving message:', error);
        }
    }

    async function loadChatHistory() {
        if (!currentTabId) return;

        try {
            const storageKey = `chat_${currentTabId}`;
            const storage = await browser.storage.local.get(storageKey);
            const messages = storage[storageKey] || [];

            chatContainer.innerHTML = '';
            messages.forEach(msg => appendMessage(msg.role, msg.content));
        } catch (error) {
            console.error('Error loading chat history:', error);
            appendMessage('error', 'Error loading chat history');
        }
    }

    // Load saved model preference
    browser.storage.local.get('selectedModel').then(result => {
        if (result.selectedModel) {
            modelSelect.value = result.selectedModel;
        }
    });

    // Save model preference when changed
    modelSelect.addEventListener('change', () => {
        browser.storage.local.set({
            selectedModel: modelSelect.value
        });
    });

    // Initialize chat when a tab is active
    browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
        if (tabs[0]) {
            currentTabId = tabs[0].id;
            loadChatHistory();
        }
    });

    // Update chat when tab changes
    browser.tabs.onActivated.addListener(activeInfo => {
        currentTabId = activeInfo.tabId;
        loadChatHistory();
    });

    // Clear chat history
    clearButton.addEventListener('click', async () => {
        if (!currentTabId) return;

        if (confirm('Are you sure you want to clear the chat history for this tab?')) {
            const storageKey = `chat_${currentTabId}`;
            await browser.storage.local.remove(storageKey);
            chatContainer.innerHTML = '';
            appendMessage('system', 'Chat history cleared');
        }
    });

    async function sendMessage(question) {
        try {
            const response = await browser.runtime.sendMessage({
                action: "askChatGPT",
                question: question,
                tabId: currentTabId,
                model: modelSelect.value
            });

            if (response.error) {
                throw new Error(response.error);
            }

            if (response.response) {
                appendMessage('assistant', response.response);
                await saveMessage('assistant', response.response);
            } else {
                throw new Error('No response received');
            }
        } catch (error) {
            console.error("Error processing message:", error);
            appendMessage('error', `Error: ${error.message}`);
        }
    }

    // Send message handler
    sendButton.addEventListener('click', async () => {
        const question = questionInput.value.trim();
        if (!question || !currentTabId || isProcessing) return;

        try {
            isProcessing = true;
            sendButton.disabled = true;
            questionInput.value = '';

            // Add user message to chat
            appendMessage('user', question);
            await saveMessage('user', question);

            await sendMessage(question);
        } finally {
            isProcessing = false;
            sendButton.disabled = false;
            questionInput.focus();
        }
    });

    // Handle Enter key
    questionInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });
});
