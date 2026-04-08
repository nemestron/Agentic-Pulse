"use client";
import { Share2, MessageCircle, Send, AtSign, Users, Briefcase, Copy } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function ShareMenu({ articleId, title }: { articleId: string; title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => setUrl(`${window.location.origin}/p/${articleId}`), 0);
    
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [articleId]);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="px-3 py-1.5 rounded-md hover:bg-surface text-accent transition-colors flex items-center gap-2 border border-border bg-background shadow-sm">
        <Share2 className="w-4 h-4" /> Share
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-md shadow-xl z-50 py-1">
          <a href={`https://wa.me/?text=${encodedTitle}%0A${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:text-accent hover:bg-background transition-colors"><MessageCircle className="w-4 h-4" /> WhatsApp</a>
          <a href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:text-accent hover:bg-background transition-colors"><Send className="w-4 h-4" /> Telegram</a>
          <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:text-accent hover:bg-background transition-colors"><AtSign className="w-4 h-4" /> X (Twitter)</a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:text-accent hover:bg-background transition-colors"><Users className="w-4 h-4" /> Facebook</a>
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:text-accent hover:bg-background transition-colors"><Briefcase className="w-4 h-4" /> LinkedIn</a>
          <div className="border-t border-border my-1" />
          <button onClick={copyToClipboard} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:text-accent hover:bg-background transition-colors text-left"><Copy className="w-4 h-4" /> {copied ? "Copied to Clipboard!" : "Copy Link"}</button>
        </div>
      )}
    </div>
  );
}