"use client";
import useSWR from "swr";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { AgentRunChart } from "@/components/dashboard/AgentRunChart";
import { SourceChart } from "@/components/dashboard/SourceChart";
import { LiveFeed } from "@/components/dashboard/LiveFeed";
import { RefreshCw, Activity } from "lucide-react";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function DashboardPage() {
  // SWR continuously polls the API every 30 seconds to provide a "live" feel
  const { data, error, isLoading } = useSWR("/api/metrics", fetcher, { refreshInterval: 30000 });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <Activity className="w-12 h-12 text-error opacity-50" />
        <p className="text-error font-bold">Failed to load analytics engine.</p>
        <p className="text-border text-sm">Please verify your database connection.</p>
      </div>
    );
  }
  
  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-5">
        <RefreshCw className="w-10 h-10 text-accent animate-spin" />
        <p className="text-accent font-bold tracking-widest uppercase text-sm">Initializing Command Center</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-accent tracking-tight">Pulse Analytics</h1>
          <p className="text-border mt-2 text-sm">Real-time systemic overview of curation performance.</p>
        </div>
        <div className="flex items-center gap-2 bg-surface border border-border px-3 py-1.5 rounded-full shadow-sm">
          <RefreshCw className="w-3.5 h-3.5 text-success animate-spin-slow" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">Live Telemetry Active</span>
        </div>
      </div>

      <KpiGrid data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <AgentRunChart data={data.dailyRunHistory} />
          <SourceChart data={data.topSources} />
        </div>
        <div className="lg:col-span-1 h-full">
          <LiveFeed articles={data.recentArticles} />
        </div>
      </div>
    </div>
  );
}