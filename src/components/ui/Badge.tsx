import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "error" | "pending" | "neutral"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-surface text-foreground border-border",
    success: "bg-success/20 text-success border-success/50",
    error: "bg-error/20 text-error border-error/50",
    pending: "bg-accent/20 text-accent border-accent/50",
    neutral: "bg-border/20 text-foreground border-border/50",
  }
  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none", variants[variant], className)} {...props} />
  )
}