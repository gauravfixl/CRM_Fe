"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

const CustomTooltipProvider = TooltipPrimitive.Provider
const CustomTooltip = TooltipPrimitive.Root
const CustomTooltipTrigger = TooltipPrimitive.Trigger

const CustomTooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 rounded-md border border-gray-200 bg-gray-900/90 px-2.5 py-1 text-xs text-white shadow-sm",
      "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
      className
    )}
    {...props}
  />
))
CustomTooltipContent.displayName = TooltipPrimitive.Content.displayName

export { CustomTooltip, CustomTooltipTrigger, CustomTooltipContent, CustomTooltipProvider }
