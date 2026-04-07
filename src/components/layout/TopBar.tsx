"use client";

import ThemeToggle from "../ui/ThemeToggle";
import { Bell, User } from "lucide-react";
import { signOut } from "next-auth/react";

export default function TopBar() {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 shrink-0">
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="p-2 rounded-md hover:bg-surface text-foreground transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 pl-4 border-l border-border">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 p-2 rounded-md hover:bg-surface text-foreground transition-colors"
          >
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}