import { prisma } from "@/lib/prisma/client";
import { PostEditor } from "@/components/dashboard/PostEditor";
import { ShareMenu } from "@/components/dashboard/ShareMenu";

export const dynamic = "force-dynamic";

export default async function PublishPage(props: { searchParams: Promise<{ tab?: string }> }) {
  const searchParams = await props.searchParams;
  const activeTab = searchParams.tab || "PENDING";

  // Auto-sync strictly curated items into the publish queue
  const unprocessed = await prisma.post.findMany({
    where: { agentScore: { gte: 40 }, publishQueue: { is: null } }
  });
  
  if (unprocessed.length > 0) {
    await Promise.all(unprocessed.map(p => 
      prisma.publishQueue.create({ data: { postId: p.id, status: "PENDING" } })
    ));
  }

  const items = await prisma.publishQueue.findMany({
    where: { status: activeTab },
    include: { post: true },
    orderBy: { createdAt: "desc" }
  });

  const tabs = ["PENDING", "APPROVED", "REJECTED", "PUBLISHED"];
  const borderMap: Record<string, string> = {
    "PENDING": "border-l-border",
    "APPROVED": "border-l-accent",
    "REJECTED": "border-l-error",
    "PUBLISHED": "border-l-success"
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-4xl font-black text-accent tracking-tight">Editorial Queue</h1>
        <p className="text-border mt-2 text-sm">Review, edit, and publish the AI&apos;s curated feed directly to Telegram.</p>
      </div>
      
      <div className="flex gap-2 border-b border-border pb-px">
        {tabs.map(tab => (
          <a key={tab} href={`/publish?tab=${tab}`} className={`px-5 py-2.5 font-bold text-sm tracking-wide rounded-t-lg transition-all ${activeTab === tab ? "bg-surface text-accent border-b-2 border-accent" : "text-border hover:text-foreground hover:bg-surface/50"}`}>
            {tab}
          </a>
        ))}
      </div>

      <div className="grid gap-5">
        {items.length === 0 && <div className="p-12 text-center text-border bg-surface rounded-xl border border-border shadow-sm font-medium">No items found in this queue state.</div>}
        {items.map(item => (
          <div key={item.id} className={`p-6 bg-surface border rounded-xl flex flex-col lg:flex-row justify-between gap-6 shadow-sm border-l-4 ${borderMap[activeTab]}`}>
            <div className="flex-1 space-y-3">
              <h3 className="text-xl font-bold text-foreground leading-snug">{item.editedTitle || item.post.title}</h3>
              <p className="text-foreground/80 text-sm leading-relaxed line-clamp-3">{item.editedBody || item.post.agentSummary}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider pt-2">
                <a href={item.post.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-accent bg-background hover:opacity-80 px-2.5 py-1 rounded border border-border flex items-center transition-opacity">
                  {item.post.sourceDomain}
                </a>
                <span className="text-border">Score: {item.post.agentScore}</span>
                {item.publishedAt && <span className="text-border text-success/80">Pub: {item.publishedAt.toLocaleDateString()}</span>}
              </div>
            </div>
            <div className="flex items-start lg:items-center gap-4 shrink-0">
              <PostEditor item={item} />
              {item.status === "PUBLISHED" && <ShareMenu articleId={item.id} title={item.editedTitle || item.post.title} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}