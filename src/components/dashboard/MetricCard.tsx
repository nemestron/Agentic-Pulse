"use client";

import { Card, Metric, Text, Flex, BadgeDelta } from "@tremor/react";

interface MetricCardProps {
  title: string;
  metric: string;
  delta?: string;
  deltaType?: "increase" | "moderateIncrease" | "decrease" | "moderateDecrease" | "unchanged";
}

export default function MetricCard({ title, metric, delta, deltaType = "increase" }: MetricCardProps) {
  return (
    <Card className="bg-surface border-border ring-0">
      <Flex alignItems="start">
        <Text className="text-foreground">{title}</Text>
        {delta && (
          <BadgeDelta deltaType={deltaType} className="bg-background text-accent border-border">
            {delta}
          </BadgeDelta>
        )}
      </Flex>
      <Metric className="text-foreground mt-2 font-bold">{metric}</Metric>
    </Card>
  );
}