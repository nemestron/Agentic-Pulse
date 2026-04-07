export async function sendMessage(text: string, parseMode: string = "HTML") {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error("Telegram credentials missing in environment");

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: parseMode,
      disable_web_page_preview: false,
    }),
  });
  
  if (!res.ok) {
    const errorData = await res.text();
    console.error("Telegram API Error:", errorData);
    throw new Error(`Telegram API failed: ${res.statusText}`);
  }
  
  return res.json();
}

export function formatArticleMessage(article: { title: string; summary: string; tags: string[]; sourceDomain: string; publicUrl: string; originalUrl: string }) {
  const tagsString = article.tags.map((t: string) => `#${t}`).join(" ");
  return `<b>${article.title}</b>\n\n${article.summary}\n\n${tagsString}\n\n<i>Source: <a href="${article.originalUrl}">${article.sourceDomain}</a></i>\n<a href="${article.publicUrl}">Read Curated View</a>\n\n<i>Curated by Agentic Pulse</i>`;
}

export async function sendCuratedArticle(article: { title: string; summary: string; tags: string[]; sourceDomain: string; publicUrl: string; originalUrl: string }) {
  const message = formatArticleMessage(article);
  return sendMessage(message);
}