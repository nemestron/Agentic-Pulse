"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Newspaper, Activity, Send, Settings, MessageCircle } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, external: false },
  { name: "News Feed", href: "/news", icon: Newspaper, external: false },
  { name: "Agent Runs", href: "/agents", icon: Activity, external: false },
  { name: "Telegram Channel", href: "https://t.me/agenticpulsenews", icon: MessageCircle, external: true },
  { name: "Publish", href: "/publish", icon: Send, external: false },
  { name: "Settings", href: "/settings", icon: Settings, external: false },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen border-r border-border bg-surface flex flex-col justify-between shrink-0 overflow-y-auto">
      <div>
        <div className="h-16 flex items-center px-6 border-b border-border">
          <h1 className="text-2xl font-black text-accent tracking-tight">Agentic Pulse</h1>
        </div>
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = !item.external && pathname === item.href;
            const Icon = item.icon;
            
            const linkClasses = `flex items-center gap-3 px-3 py-2 rounded-md transition-all font-medium text-sm ${
              isActive
                ? "bg-accent/10 text-accent"
                : "text-foreground/70 hover:bg-background/50 hover:text-foreground"
            }`;

            if (item.external) {
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClasses}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </a>
              );
            }

            return (
              <Link key={item.name} href={item.href} className={linkClasses}>
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-6 border-t border-border text-xs text-center text-foreground/60 space-y-1">
        <p>Built by</p>
        <a href="https://www.linkedin.com/in/dhiraj-malwade-6a8385399" target="_blank" rel="noopener noreferrer" className="block text-accent hover:opacity-80 transition-opacity">
          Dhiraj Malwade
        </a>
        <a href="https://github.com/nemestron/Agentic-Pulse" target="_blank" rel="noopener noreferrer" className="block text-accent hover:opacity-80 transition-opacity">
          GitHub
        </a>
      </div>
    </div>
  );
}