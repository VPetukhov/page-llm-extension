// contentScript.js

// (function() {
//   function getPagePlainText() {
//     // Extract plain text from the body
//     return document.body.innerText;
//   }

//   // Listen for messages from the background script
//   browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === "GET_PAGE_CONTENT") {
//       // Return plain text content
//       const plainTextContent = getPagePlainText();
//       console.log("Plain text content:", plainTextContent);
//       sendResponse({ content: plainTextContent });
//     }
//     return true;
//   });
// })();

(function() {
  // Very naive HTML-to-Markdown conversion.
  // (Replace with a library like Turndown for robust usage)
  function htmlToMarkdown(html) {
    // Simple replacements (this won't handle all HTML structures).
    let md = html;

    // Remove script/style tags:
    md = md.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    md = md.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // Convert <h1> ... <h6> to #, ##, ...
    md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n');
    md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');
    md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n');
    md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n');
    md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n');

    // Convert <br>, <hr>
    md = md.replace(/<br\s*\/?>/gi, '\n');
    md = md.replace(/<hr\s*\/?>/gi, '\n---\n');

    // Convert paragraphs
    md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');

    // Convert bold and italics
    md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '_$1_');
    md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '_$1_');

    // Convert links
    md = md.replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

    // Remove all other HTML tags
    md = md.replace(/<\/?[^>]+(>|$)/g, '');

    // Trim extra spaces/newlines
    return md.trim();
  }

  // Grab the page content as HTML, then convert to markdown
  function getPageMarkdown() {
    const html = document.documentElement.outerHTML;
    return htmlToMarkdown(html);
  }

  // Listen for messages from the background script
  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "GET_PAGE_CONTENT") {
      // Scrape the page content as Markdown
      const contentInMarkdown = getPageMarkdown();
      sendResponse({ content: contentInMarkdown });
    }
    return true;
  });
})();
