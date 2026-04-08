"use client";
import { useState } from "react";
import { approvePost, rejectPost, publishToTelegram } from "@/app/actions/publish";

export function PostEditor({ item }: { item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(item.editedTitle || item.post.title);
  const [body, setBody] = useState(item.editedBody || item.post.agentSummary || "");
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    await approvePost(item.id, title, body);
    setLoading(false);
    setIsOpen(false);
  };

  const handleReject = async () => {
    setLoading(true);
    await rejectPost(item.id, "Rejected by editor");
    setLoading(false);
    setIsOpen(false);
  };

  const handlePublish = async () => {
    setLoading(true);
    await publishToTelegram(item.id);
    setLoading(false);
  };

  return (
    <>
      {item.status === "PENDING" && <button onClick={() => setIsOpen(true)} className="px-4 py-1.5 bg-surface border border-border text-foreground hover:bg-background rounded-md text-sm transition-colors shadow-sm font-medium">Review</button>}
      {item.status === "APPROVED" && <button onClick={handlePublish} disabled={loading} className="px-4 py-1.5 bg-accent text-background hover:opacity-90 rounded-md text-sm transition-opacity font-bold shadow-sm">{loading ? "Publishing..." : "Publish to Telegram"}</button>}
      {item.status === "PUBLISHED" && <span className="px-3 py-1 bg-success/10 border border-success/30 text-success rounded-full text-xs font-bold tracking-wide uppercase">Published</span>}
      {item.status === "REJECTED" && <span className="px-3 py-1 bg-error/10 border border-error/30 text-error rounded-full text-xs font-bold tracking-wide uppercase">Rejected</span>}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex justify-between items-center bg-background">
              <h2 className="text-2xl font-bold text-accent">Editorial Review</h2>
              <button onClick={() => setIsOpen(false)} className="text-border hover:text-foreground text-xl transition-colors">✕</button>
            </div>
            <div className="p-6 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-5">
                <h3 className="font-semibold text-foreground border-b border-border pb-2">Final Content (Editable)</h3>
                <div>
                  <label className="block text-sm font-medium text-border mb-1">Article Title</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-background border border-border rounded-md px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-accent transition-shadow shadow-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-border mb-1">Executive Summary <span className="text-xs float-right">{body.length} chars</span></label>
                  <textarea value={body} onChange={e => setBody(e.target.value)} rows={12} className="w-full bg-background border border-border rounded-md px-4 py-3 text-foreground focus:outline-none focus:ring-1 focus:ring-accent transition-shadow shadow-sm resize-none" />
                </div>
              </div>
              <div className="space-y-5">
                <h3 className="font-semibold text-foreground border-b border-border pb-2">AI Source Reference</h3>
                <div className="bg-background p-5 rounded-lg border border-border space-y-4 shadow-sm">
                  <div>
                    <span className="text-xs font-bold text-accent tracking-wider uppercase">Original Title</span>
                    <p className="text-sm text-foreground mt-1 leading-snug">{item.post.title}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-accent tracking-wider uppercase">AI Generated Tags</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.post.agentTags && JSON.parse(item.post.agentTags).map((tag: string) => (
                        <span key={tag} className="px-2.5 py-1 bg-surface border border-border rounded-md text-xs font-medium text-foreground">#{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-accent tracking-wider uppercase">Source Domain</span>
                    <p className="text-sm mt-1"><a href={item.post.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-accent transition-colors underline decoration-border underline-offset-4">{item.post.sourceDomain}</a></p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-accent tracking-wider uppercase">AI Reasoning Score</span>
                    <p className="text-2xl font-black text-foreground mt-1">{item.post.agentScore}/100</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-background">
              <button onClick={handleReject} disabled={loading} className="px-5 py-2.5 border border-error text-error hover:bg-error/10 rounded-md transition-colors font-medium">Reject Output</button>
              <button onClick={() => setIsOpen(false)} className="px-5 py-2.5 border border-border text-foreground hover:bg-surface rounded-md transition-colors font-medium">Cancel</button>
              <button onClick={handleApprove} disabled={loading} className="px-5 py-2.5 bg-accent text-background hover:opacity-90 rounded-md transition-opacity font-bold shadow-md">Save & Approve</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}