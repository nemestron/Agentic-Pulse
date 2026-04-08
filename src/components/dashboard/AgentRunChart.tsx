"use client";
import { Card, AreaChart } from "@tremor/react";

export function AgentRunChart({ data }: { data: any[] }) {
  return (
    <Card className="bg-surface border-border shadow-sm ring-0 rounded-xl p-6">
      <h2 className="text-foreground font-bold text-lg border-b border-border pb-3 mb-6">Agent Ingestion Velocity (30 Days)</h2>
      {data.length > 0 ? (
        <AreaChart
          className="h-72 mt-4"
          data={data}
          index="date"
          categories={["Processed"]}
          colors={["amber"]}
          yAxisWidth={40}
          showAnimation={true}
          showGridLines={false}
          curveType="monotone"
        />
      ) : (
        <div className="h-72 flex items-center justify-center text-border text-sm font-medium">Not enough data to graph timeline.</div>
      )}
    </Card>
  );
}