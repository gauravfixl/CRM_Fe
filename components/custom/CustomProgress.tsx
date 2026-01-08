"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

interface CustomProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  size?: "sm" | "md" | "lg" // allow different sizes
  value?: number
}

const sizeMap = {
  sm: "h-2",
  md: "h-4",
  lg: "h-6",
}

const CustomProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  CustomProgressProps
>(({ className, value = 0, size = "md", ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn("relative w-full overflow-hidden rounded-full bg-secondary", sizeMap[size], className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full bg-primary transition-all"
      style={{ transform: `translateX(-${100 - value}%)` }}
    />
  </ProgressPrimitive.Root>
))

CustomProgress.displayName = "CustomProgress"

export { CustomProgress }
