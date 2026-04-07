"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Newspaper, Activity, Send, Settings } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "News Feed", href: "/news", icon: Newspaper },
  { name: "Agent Runs", href: "/agents", icon: Activity },
  { name: "Publish", href: "/publish", icon: Send },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full w-64 bg-surface border-r border-border text-foreground">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-accent tracking-tight">Agentic Pulse</h2>
      </div>
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive ? "bg-background border border-border text-accent font-medium" : "hover:bg-background/50"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-6 border-t border-border text-sm text-center">
        <span className="text-border">Built by </span>
        <br />
        <a
          href="https://linkedin.com/in/dhiraj-malwade-6a8385399"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent font-medium hover:opacity-80 transition-opacity"
        >
          Dhiraj Malwade
        </a>
        <div className="mt-2 flex justify-center">
          <a
            href="https://github.com/nemestron/Agentic-Pulse"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:opacity-80 transition-opacity"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}