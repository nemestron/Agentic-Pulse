import { Card, Metric, Text } from "@tremor/react";

export function KpiGrid({ data }: { data: any /* eslint-disable-line @typescript-eslint/no-explicit-any */ }) {
  const kpis = [
    { title: "Articles Processed", metric: data.totalArticles, detail: "Total indexed securely" },
    { title: "Avg Agent Score", metric: `${data.avgAgentScore}/100`, detail: "Across all curations" },
    { title: "Avg AI Duration", metric: `${(data.avgRunDurationMs / 1000).toFixed(2)}s`, detail: "Pipeline latency" },
    { title: "Awaiting Review", metric: data.pendingCount, detail: "In editorial queue" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, i) => (
        <Card key={i} className="bg-surface border-border shadow-sm ring-0 rounded-xl p-5">
          <Text className="text-border font-semibold uppercase tracking-wider text-xs">{kpi.title}</Text>
          <Metric className="text-foreground font-black text-3xl mt-2">{kpi.metric}</Metric>
          <Text className="text-foreground/70 text-xs mt-3">{kpi.detail}</Text>
        </Card>
      ))}
    </div>
  );
}