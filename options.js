document.addEventListener('DOMContentLoaded', async () => {
    const openaiKeyInput = document.getElementById('openaiKey');
    const claudeKeyInput = document.getElementById('claudeKey');
    const saveButton = document.getElementById('save');
    const statusDiv = document.getElementById('status');

    // Load saved API keys
    const result = await browser.storage.local.get(['openaiApiKey', 'claudeApiKey']);
    if (result.openaiApiKey) {
        openaiKeyInput.value = result.openaiApiKey;
    }
    if (result.claudeApiKey) {
        claudeKeyInput.value = result.claudeApiKey;
    }

    // Save API keys
    saveButton.addEventListener('click', async () => {
        const openaiKey = openaiKeyInput.value.trim();
        const claudeKey = claudeKeyInput.value.trim();
        
        if (!openaiKey && !claudeKey) {
            showStatus('Please enter at least one API key', 'error');
            return;
        }

        try {
            const settings = {};
            
            if (openaiKey) {
                if (!openaiKey.startsWith('sk-')) {
                    showStatus('Invalid OpenAI API key format. It should start with "sk-"', 'error');
                    return;
                }
                settings.openaiApiKey = openaiKey;
            }

            if (claudeKey) {
                if (!claudeKey.startsWith('sk-ant-')) {
                    showStatus('Invalid Claude API key format. It should start with "sk-ant-"', 'error');
                    return;
                }
                settings.claudeApiKey = claudeKey;
            }

            await browser.storage.local.set(settings);
            showStatus('Settings saved successfully!', 'success');
        } catch (error) {
            showStatus('Error saving settings: ' + error.message, 'error');
        }
    });

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = type;
        statusDiv.style.display = 'block';
        
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    }
});
