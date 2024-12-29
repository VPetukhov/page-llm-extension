// popup.js

document.getElementById("askBtn").addEventListener("click", async () => {
  const userQuestion = document.getElementById("question").value;
  const modelDropdown = document.getElementById("modelSelect");
  const selectedModel = modelDropdown.value;
  const responseDiv = document.getElementById("response");

  // Reset response area
  responseDiv.textContent = "Loading...";

  try {
    // Get the active tab
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

    // 1. Ask the content script for the (Markdown) page content
    const pageData = await browser.tabs.sendMessage(tab.id, { action: "GET_PAGE_CONTENT" });
    const pageContent = pageData.content || "";

    // 2. Send the question + page content + selected model to background.js
    const chatGPTResponse = await browser.runtime.sendMessage({
      action: "FETCH_CHATGPT",
      pageContent,
      userQuestion,
      selectedModel
    });

    if (chatGPTResponse.success) {
      responseDiv.textContent = chatGPTResponse.answer;
    } else {
      responseDiv.textContent = "Error: " + (chatGPTResponse.error || "Unknown error.");
    }
  } catch (err) {
    console.error(err);
    responseDiv.textContent = "Error: " + err.message;
  }
});