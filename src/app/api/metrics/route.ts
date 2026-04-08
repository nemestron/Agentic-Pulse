import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { auth } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Parallelize high-performance database aggregations
    const [
      totalArticles,
      agentRuns,
      postAgg,
      runAgg,
      queueCounts,
      topSourcesRaw,
      recentPosts,
      recentArticles
    ] = await Promise.all([
      prisma.post.count(),
      prisma.agentRun.count(),
      prisma.post.aggregate({ _avg: { agentScore: true } }),
      prisma.agentRun.aggregate({ _avg: { durationMs: true } }),
      prisma.publishQueue.groupBy({ by: ['status'], _count: { status: true } }),
      prisma.post.groupBy({
        by: ['sourceDomain'],
        _count: { sourceDomain: true },
        orderBy: { _count: { sourceDomain: 'desc' } },
        take: 7
      }),
      // Fetch dates for the last 30 days of processed posts
      prisma.post.findMany({
        where: { 
          createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
          agentScore: { not: null }
        },
        select: { createdAt: true }
      }),
      // Fetch latest 10 articles for the live feed
      prisma.post.findMany({
        where: { agentScore: { not: null } },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { publishQueue: true }
      })
    ]);

    // Process Queue Metrics
    const pendingCount = queueCounts.find(q => q.status === "PENDING")?._count.status || 0;
    const publishedCount = queueCounts.find(q => q.status === "PUBLISHED")?._count.status || 0;
    const rejectedCount = queueCounts.find(q => q.status === "REJECTED")?._count.status || 0;

    // Process Top Sources
    const topSources = topSourcesRaw.map(s => ({
      name: s.sourceDomain,
      "Articles": s._count.sourceDomain
    }));

    // Process Daily Run History
    const historyMap: Record<string, number> = {};
    recentPosts.forEach(p => {
      const d = p.createdAt.toISOString().split('T')[0];
      historyMap[d] = (historyMap[d] || 0) + 1;
    });

    const dailyRunHistory = Object.entries(historyMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        "Processed": count
      }));

    return NextResponse.json({
      totalArticles,
      totalAgentRuns: agentRuns,
      avgAgentScore: Math.round(postAgg._avg.agentScore || 0),
      avgRunDurationMs: Math.round(runAgg._avg.durationMs || 0),
      publishedCount,
      pendingCount,
      rejectedCount,
      topSources,
      dailyRunHistory,
      recentArticles
    });
  } catch (error: any) {
    console.error("Metrics API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}