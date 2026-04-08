import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma/client";
import { getTechNews, searchArticles } from "@/lib/news/client";
import { normalizeNewsArticle } from "@/lib/news/normalizer";
import { NEWS_CONFIG } from "@/config/newsSources";

export async function POST() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access blocked by Edge Proxy." }, { status: 401 });
    }

    const rawArticles: any /* eslint-disable-line @typescript-eslint/no-explicit-any */[] = [];
    const stats = { new: 0, duplicates: 0, errors: 0 };

    // 1. Fetch broad technology headlines
    try {
      const techRes = await getTechNews(NEWS_CONFIG.maxArticlesPerCollection / 2);
      if (techRes.articles) rawArticles.push(...techRes.articles);
    } catch (e) {
      console.error("Failed to fetch tech headlines:", e);
    }

    // 2. Fetch highly specific AI queries
    for (const query of NEWS_CONFIG.defaultQueries) {
      try {
        const searchRes = await searchArticles(query, "publishedAt", 5);
        if (searchRes.articles) rawArticles.push(...searchRes.articles);
      } catch (e) {
        console.error(`Failed to fetch query [${query}]:`, e);
      }
    }

    // 3. Normalize and strictly upsert to Database
    for (const raw of rawArticles) {
      const normalized = normalizeNewsArticle(raw);
      if (!normalized) continue;

      try {
        const existing = await prisma.post.findUnique({
          where: { articleId: normalized.articleId as string }
        });

        if (existing) {
          stats.duplicates++;
        } else {
          await prisma.post.create({ data: normalized });
          stats.new++;
        }
      } catch (e) {
        console.error(`DB write failed for ID ${normalized.articleId}:`, e);
        stats.errors++;
      }
    }

    return NextResponse.json({ success: true, payload: stats }, { status: 200 });
  } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    console.error("Collection engine failure:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}