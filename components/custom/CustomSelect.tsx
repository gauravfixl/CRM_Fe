"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const CustomSelect = SelectPrimitive.Root

const CustomSelectValue = SelectPrimitive.Value

const CustomSelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-8 min-w-[120px] items-center justify-between rounded border border-gray-200 bg-white px-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    <CustomSelectValue  />
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
CustomSelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const CustomSelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "z-50 min-w-[120px] overflow-hidden rounded-md border border-gray-200 bg-white text-gray-800 shadow-md animate-in fade-in-80 zoom-in-90",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
CustomSelectContent.displayName = SelectPrimitive.Content.displayName

const CustomSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
   className={cn(
  "relative flex cursor-default select-none items-center rounded px-2 py-1 text-xs font-medium text-gray-700",
  "hover:bg-gray-100 hover:text-primary",
  "focus:bg-gray-100 focus:text-primary",
  "[&[data-state='checked']]:bg-gray-100 [&[data-state='checked']]:text-primary",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  className
)}

    {...props}
  >
    <span className="absolute left-1 flex h-3 w-3 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-3 w-3 text-blue-600" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
CustomSelectItem.displayName = SelectPrimitive.Item.displayName



export { 
  CustomSelect, 
  CustomSelectTrigger, 
  CustomSelectValue, 
  CustomSelectContent, 
  CustomSelectItem 
}
