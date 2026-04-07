import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "outline"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "primary", ...props }, ref) => {
  const variants = {
    primary: "bg-accent text-background hover:opacity-90",
    secondary: "bg-surface text-foreground hover:bg-border/50",
    destructive: "bg-error text-background hover:opacity-90",
    outline: "border border-border text-foreground hover:bg-surface",
  }
  return (
    <button
      ref={ref}
      className={cn("inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2", variants[variant], className)}
      {...props}
    />
  )
})
Button.displayName = "Button"
export { Button }