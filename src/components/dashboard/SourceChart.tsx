"use client";
import { Card, Title, BarChart } from "@tremor/react";

export function SourceChart({ data }: { data: any[] }) {
  return (
    <Card className="bg-surface border-border shadow-sm ring-0 rounded-xl p-6">
      <Title className="text-foreground font-bold text-lg border-b border-border pb-3 mb-6">Top Curated Sources</Title>
      {data.length > 0 ? (
        <BarChart
          className="h-80 mt-4"
          data={data}
          index="name"
          categories={["Articles"]}
          colors={["amber"]}
          yAxisWidth={120}
          showAnimation={true}
          showGridLines={false}
          layout="horizontal"
          valueFormatter={(number) => Intl.NumberFormat("us").format(number).toString()}
        />
      ) : (
        <div className="h-80 flex items-center justify-center text-border text-sm font-medium">Waiting for source aggregation.</div>
      )}
    </Card>
  );
}