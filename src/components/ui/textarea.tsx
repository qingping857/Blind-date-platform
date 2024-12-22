import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="relative">
        <textarea
          className={cn(
            "flex min-h-[60px] w-full rounded-xl border border-input bg-secondary px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-xs text-destructive mt-1">{error}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
