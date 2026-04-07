import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import MetricCard from "@/components/dashboard/MetricCard"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-accent">Pulse Analytics</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Articles Processed" metric="--" delta="loading" />
        <MetricCard title="Avg Agent Score" metric="--" delta="loading" />
        <MetricCard title="Avg Run Duration" metric="-- ms" delta="loading" />
        <MetricCard title="Awaiting Review" metric="--" deltaType="unchanged" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Agent Run History</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-border border-t border-border">
            Chart loading...
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Live Feed</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center text-border border-t border-border">
            Recent articles will appear here
          </CardContent>
        </Card>
      </div>
    </div>
  )
}