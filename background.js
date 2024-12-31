// background.js

async function sendToChatGPT(messages, model = 'gpt-4o') {
    const apiKey = await browser.storage.local.get('openaiApiKey');
    if (!apiKey.openaiApiKey) {
        throw new Error('OpenAI API key not found. Please set it in the extension options.');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.openaiApiKey}`
        },
        body: JSON.stringify({
            model: model,
            messages: messages,
            max_tokens: 3000
        })
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

async function sendToClaude(messages, model = 'claude-3-5-sonnet-latest') {
    const apiKey = await browser.storage.local.get('claudeApiKey');
    if (!apiKey.claudeApiKey) {
        throw new Error('Claude API key not found. Please set it in the extension options.');
    }

    // Convert system message to a human message for Claude
    const systemMessage = messages.find(m => m.role === 'system');
    const otherMessages = messages.filter(m => m.role !== 'system');
    
    // Combine system message with the first user message if it exists
    if (systemMessage) {
        const firstUserMessage = otherMessages.find(m => m.role === 'user');
        if (firstUserMessage) {
            firstUserMessage.content = `${systemMessage.content}\n\n${firstUserMessage.content}`;
        } else {
            otherMessages.unshift({
                role: 'user',
                content: systemMessage.content
            });
        }
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey.claudeApiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
            model: model,
            messages: otherMessages,
            max_tokens: 3000,
            system: "You are an expert assistant analyzing web content and providing clear, concise answers."
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Claude API request failed: ${response.statusText}. ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.content[0].text;
}

browser.browserAction.onClicked.addListener(() => {
    browser.sidebarAction.toggle();
});

browser.runtime.onMessage.addListener((request, sender) => {
    return (async () => {
        try {
            if (request.action === "askChatGPT") {
                // Get the page content from the active tab
                const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
                const results = await browser.tabs.executeScript(tab.id, {
                    code: `(() => {
                        const text = document.body.innerText || document.body.textContent;
                        if (!text) {
                            throw new Error("No content available on this page");
                        }
                        return text;
                    })()`
                });
                
                if (!results || !results[0]) {
                    throw new Error("Could not extract page content");
                }

                const pageContent = results[0];

                // Get chat history
                const storageKey = `chat_${request.tabId}`;
                const storage = await browser.storage.local.get(storageKey);
                const messages = storage[storageKey] || [];

                // Prepare messages for API
                const apiMessages = [
                    {
                        role: "system",
                        content: `Here is the current page content:\n\n\`\`\`\n${pageContent}\n\`\`\`\n\nAnalyze this content and provide clear, concise answers. When summarizing, focus on key points. If asked about specific details, cite relevant parts. Format responses with Markdown for better readability.`
                    },
                    ...messages.map(msg => ({
                        role: msg.role === 'user' ? 'user' : 'assistant',
                        content: msg.content
                    })).slice(-4), // Keep only last 4 messages for context
                    { role: "user", content: request.question }
                ];

                const answer = request.model.startsWith('claude') 
                    ? await sendToClaude(apiMessages, request.model)
                    : await sendToChatGPT(apiMessages, request.model);
                    
                return { response: answer };
            }
        } catch (error) {
            console.error("Error in background script:", error);
            return { error: error.message };
        }
    })();
});
