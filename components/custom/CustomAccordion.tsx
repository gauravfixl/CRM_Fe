"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const CustomAccordion = AccordionPrimitive.Root

const CustomAccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b last:border-none", className)}
    {...props}
  />
))
CustomAccordionItem.displayName = "CustomAccordionItem"

const CustomAccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex w-full items-center justify-between py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
        "[&[data-state=open]>svg]:rotate-90",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
CustomAccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const CustomAccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm text-muted-foreground data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("py-2 pl-4", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
CustomAccordionContent.displayName = AccordionPrimitive.Content.displayName

export { CustomAccordion, CustomAccordionItem, CustomAccordionTrigger, CustomAccordionContent }
