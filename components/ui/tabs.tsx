"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  variant?: "default" | "custom"
}

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ className, variant = "default", ...props }, ref) => (
  <TabsPrimitive.Root ref={ref} className={cn(className)} {...props} data-variant={variant} />
))
Tabs.displayName = TabsPrimitive.Root.displayName

// --- Tabs List ---
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const variant = (props as any)["data-variant"] || "default"

  const base = "inline-flex items-center text-sm"

  const variants = {
    default: cn(base, "border-b border-gray-200 text-gray-500"),
    custom: cn(base, "rounded-md bg-gray-100 p-1 text-gray-600 gap-1"),
  }

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(variants[variant], className)}
      {...props}
    />
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

// --- Tabs Trigger ---
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const variant = (props as any)["data-variant"] || "default"

  const base =
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 transition-colors"

  const variants = {
    default: cn(
      base,
      "px-3 py-2 text-gray-500 hover:text-gray-900",
      "border-b-2 border-transparent",
      "data-[state=active]:border-blue-500  data-[state=active]:text-gray-900"
    ),
    custom: cn(
      base,
      "rounded-sm px-3 py-1.5 text-gray-600 hover:bg-white hover:text-gray-900",
      "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
    ),
  }

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(variants[variant], className)}
      {...props}
    />
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

// --- Tabs Content ---
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-3 text-sm text-gray-700", className)}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
