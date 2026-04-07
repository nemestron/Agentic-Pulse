import { prisma } from "@/lib/prisma/client";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const item = await prisma.publishQueue.findUnique({
    where: { id: params.id },
    include: { post: true }
  });
  
  if (!item || item.status !== "PUBLISHED") return {};

  const title = item.editedTitle || item.post.title;
  const description = (item.editedBody || item.post.agentSummary || "").substring(0, 155) + "...";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: item.publishedAt?.toISOString(),
      siteName: "Agentic Pulse",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    }
  };
}

export default async function PublicArticlePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const item = await prisma.publishQueue.findUnique({
    where: { id: params.id },
    include: { post: true }
  });

  if (!item || item.status !== "PUBLISHED") notFound();

  const tags = item.post.agentTags ? JSON.parse(item.post.agentTags) : [];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-16 px-4 sm:px-6">
      <article className="max-w-3xl w-full bg-surface border border-border rounded-2xl p-8 sm:p-12 shadow-2xl space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
        
        <div className="space-y-5 border-b border-border pb-8">
          <h1 className="text-3xl sm:text-5xl font-black text-accent leading-tight tracking-tight">{item.editedTitle || item.post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-border tracking-wide uppercase">
            <span className="bg-background px-3.5 py-1.5 rounded-md border border-border shadow-sm text-foreground">{item.post.sourceDomain}</span>
            <span>{item.publishedAt?.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-lg sm:text-xl leading-relaxed text-foreground font-medium">
            {item.editedBody || item.post.agentSummary}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-6">
          {tags.map((tag: string) => (
            <span key={tag} className="px-3.5 py-1.5 bg-background border border-accent/20 text-accent rounded-lg text-sm font-bold tracking-wide">#{tag}</span>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-border">
          <a href={item.post.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-background bg-accent hover:opacity-90 transition-opacity font-bold text-base px-6 py-3 rounded-lg shadow-md">
            Read Full Original Article &rarr;
          </a>
        </div>
      </article>
      
      <footer className="mt-16 text-center text-sm font-medium space-y-2">
        <p className="text-border uppercase tracking-widest text-xs">Curated by Agentic Pulse</p>
        <p className="text-foreground">Built by <a href="https://linkedin.com/in/dhiraj-malwade-6a8385399" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline decoration-2 underline-offset-4">Dhiraj Malwade</a></p>
      </footer>
    </div>
  );
}