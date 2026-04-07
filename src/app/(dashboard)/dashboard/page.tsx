"use client";

import { signOut } from "next-auth/react";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-2xl p-8 bg-surface border border-border rounded-lg shadow-xl text-center">
        <h1 className="text-4xl font-bold text-accent mb-4">Dashboard Access Granted</h1>
        <p className="text-border mb-8">Authentication pipeline is securely connected to Neon PostgreSQL.</p>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="px-6 py-2.5 bg-error text-background font-bold rounded hover:opacity-90 transition-opacity"
        >
          Secure Log Out
        </button>
      </div>
    </main>
  );
}