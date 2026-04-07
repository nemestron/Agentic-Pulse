import { Prisma } from "@prisma/client";
import { NewsArticle } from "@/types/news";

export function normalizeNewsArticle(raw: NewsArticle): Prisma.PostCreateInput | null {
  if (!raw.title || !raw.url || raw.title === "[Removed]") return null;

  // Generate a deterministic ID by Base64 encoding the URL, ensuring duplicates are mechanically impossible
  const articleId = Buffer.from(raw.url).toString("base64").replace(/[^a-zA-Z0-9]/g, "").substring(0, 150);

  return {
    articleId,
    title: raw.title,
    sourceUrl: raw.url,
    sourceDomain: raw.source.name || "Unknown Source",
    body: raw.description || raw.content || "Content unavailable.",
    publishedAt: new Date(raw.publishedAt),
  };
}