import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:outline-none flex min-h-16 w-full rounded-xl border bg-transparent px-3 py-2 text-base transition-colors break-words overflow-wrap-break-word whitespace-pre-wrap disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
