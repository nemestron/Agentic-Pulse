import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Clock, Activity } from "lucide-react";

interface AgentRunCardProps {
  status: "PENDING" | "RUNNING" | "SUCCESS" | "FAILED";
  durationMs?: number | null;
  output?: string | null;
  createdAt: Date;
}

export function AgentRunCard({ status, durationMs, output, createdAt }: AgentRunCardProps) {
  const statusColors = {
    PENDING: "neutral",
    RUNNING: "pending",
    SUCCESS: "success",
    FAILED: "error",
  } as const;

  return (
    <Card className="bg-surface border-border">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent" />
            Curator Agent
          </CardTitle>
          <Badge variant={statusColors[status]}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-sm text-border">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{durationMs ? `${(durationMs / 1000).toFixed(2)}s` : "--"}</span>
          </div>
          <p className="text-foreground mt-2">{output || "No output generated."}</p>
          <p className="text-xs mt-1">{new Date(createdAt).toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}