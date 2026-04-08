"use client";
import { Card, Title } from "@tremor/react";
import { FileText, ExternalLink } from "lucide-react";

export function LiveFeed({ articles }: { articles: any[] }) {
  // Enforce strict descending sort to ensure newest items are always at the top
  const sortedArticles = [...articles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Card className="bg-surface border-border shadow-sm ring-0 rounded-xl p-0 overflow-hidden flex flex-col h-full max-h-[800px]">
      <div className="p-6 border-b border-border bg-background/50">
        <Title className="text-foreground font-bold text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          Recent Curation Activity
        </Title>
      </div>
      <div className="overflow-y-auto flex-1 p-0">
        {sortedArticles.length === 0 && (
          <div className="p-8 text-center text-border text-sm font-medium">No articles processed yet.</div>
        )}
        {sortedArticles.map((article, i) => (
          <div key={article.id} className={`p-5 transition-colors hover:bg-background ${i !== sortedArticles.length - 1 ? 'border-b border-border' : ''}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-accent bg-background px-2 py-0.5 rounded border border-border">
                {article.sourceDomain}
              </span>
              <span className="text-xs font-bold text-border">Score: {article.agentScore}</span>
            </div>
            <h4 className="text-sm font-bold text-foreground leading-snug line-clamp-2 mb-1">{article.title}</h4>
            <p className="text-xs text-foreground/70 line-clamp-2 leading-relaxed mb-3">{article.agentSummary}</p>
            <div className="flex justify-between items-center text-xs font-medium">
              <span className="text-border">{new Date(article.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-accent flex items-center gap-1 hover:underline underline-offset-2">
                Source <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}