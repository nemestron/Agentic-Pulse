import { redirect } from "next/navigation";

export default function RootPage() {
  // Instantly routes incoming traffic to the dashboard.
  // Unauthenticated users will be automatically caught by middleware and sent to /login.
  redirect("/dashboard");
}