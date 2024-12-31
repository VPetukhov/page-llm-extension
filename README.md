# Send Page to ChatGPT - Firefox Extension

A Firefox extension that helps you analyze web pages using ChatGPT and Claude AI models. Ask questions, get summaries, and gain insights about any webpage content through a convenient sidebar interface.

## Features

- 🤖 **Multiple AI Models**: Choose between different models:
  - OpenAI: GPT-4o, GPT-4o-mini, O1, O1-mini, O1-preview
  - Anthropic: Claude 3.5 Sonnet, Claude 3.5 Haiku
- 📑 **Sidebar Interface**: Easy-to-use chat interface with persistent history
- ⌨️ **Keyboard Shortcut**: Quick access with Alt+Y
- 🔒 **Privacy-Focused**: All data stored locally

## Installation

1. Install the extension from Firefox Add-ons
2. Click the extension icon or press Alt+Y to open the sidebar
3. Open extension settings to configure:
   - OpenAI API key (starts with 'sk-')
   - Claude API key (starts with 'sk-ant-')

## Usage

1. **Basic Usage**:
   - Navigate to any webpage
   - Open sidebar (click extension icon or Alt+Y)
   - Type your question and press Enter
   - Get AI-powered analysis of the page content

2. **Model Selection**:
   - Choose model from dropdown menu:
     - GPT-4o: Best for detailed analysis
     - Claude 3.5 Sonnet: Great for complex tasks
     - Claude 3.5 Haiku: Quick, efficient responses
     - Other models for specific needs

3. **Chat Features**:
   - Clear chat history with the "Clear" button
   - History persists per tab
   - Markdown support for formatted responses

## Privacy & Data Usage

### Data Processing
- Page content is temporarily accessed to send to AI providers
- Questions and responses are only kept in browser's local storage
- Selected model preference saved locally
- All data is sent directly to the chosen AI provider (OpenAI/Anthropic)
- No data is stored on our servers or any intermediate servers

### What We Access (But Don't Store)
- ✅ Current page content (sent directly to AI provider)
- ✅ Your questions (sent to AI provider, temporarily stored in browser)
- ✅ Chat responses (from AI provider, temporarily stored in browser)
- ✅ Selected AI model preference (stored only in your browser)

### What We Don't Collect or Process
- ❌ Personal information
- ❌ Browsing history
- ❌ Cookies or tracking data
- ❌ API usage statistics

### Data Storage and Security
- API keys stored securely in browser's local storage
- Chat history saved temporarily per-tab in browser memory
- No external databases or storage
- No analytics or tracking
- All communication is directly between your browser and the AI provider

### AI Provider Data Handling
- Page content and questions are sent to OpenAI/Anthropic
- Data handling follows the respective provider's privacy policy:
  - [OpenAI Privacy Policy](https://openai.com/privacy/)
  - [Anthropic Privacy Policy](https://www.anthropic.com/privacy)
- We recommend reviewing these policies

## Required Permissions

- `activeTab`: Read current page content
- `storage`: Save API keys and settings
- `tabs`: Manage per-tab chat history

## Keyboard Shortcuts

- `Alt+Y`: Toggle sidebar
- `Enter`: Send message
- `Shift+Enter`: New line in message

## Troubleshooting

1. **API Key Issues**:
   - Ensure key starts with correct prefix
   - Check key is entered correctly
   - Verify key has required permissions

2. **Sidebar Issues**:
   - Refresh page if sidebar doesn't load
   - Check if keyboard shortcut works
   - Try disabling/enabling extension

3. **Model Selection**:
   - Verify API key matches selected model
   - Try different model if one fails
   - Check API usage limits

## Security Tips

1. Regularly rotate API keys
2. Use separate API keys for different purposes
3. Monitor API usage
4. Don't share API keys or chat history

## Support

For issues or suggestions:
1. Check troubleshooting guide
2. Submit issue on GitHub
3. Contact support

## Contributing

Contributions welcome! Please:
1. Fork repository
2. Create feature branch
3. Submit pull request

## License

[Your License] - see LICENSE file for details
