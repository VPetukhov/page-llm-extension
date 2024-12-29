// background.js

// Replace with your actual OpenAI API key (or store it securely)
const OPENAI_API_KEY = "";

browser.runtime.onMessage.addListener((request, sender) => {
    if (request.action === "FETCH_CHATGPT") {
      return (async () => {
        try {
          const { pageContent, userQuestion, selectedModel } = request;
          let maxTokens = 3000;

          const prompt = `### Page Content (Plain Text)\n\n${pageContent}\n\n### User's Question\n\n${userQuestion}`;
          console.log("Prompt:", prompt);

          const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: selectedModel,
              messages: [{ role: "user", content: prompt }],
              max_tokens: maxTokens
            })
          });

          if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
          }

          const data = await response.json();
          const chatGPTAnswer = data.choices?.[0]?.message?.content || "No response";
          console.log("ChatGPT Answer:", chatGPTAnswer);

          return { success: true, answer: chatGPTAnswer };
        } catch (error) {
          console.error(error);
          return { success: false, error: error.message };
        }
      })();
    }
  });
