"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

const CustomDropdownMenu = DropdownMenuPrimitive.Root
const CustomDropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const CustomDropdownMenuGroup = DropdownMenuPrimitive.Group
const CustomDropdownMenuPortal = DropdownMenuPrimitive.Portal
const CustomDropdownMenuSub = DropdownMenuPrimitive.Sub
const CustomDropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

// SubTrigger for nested menus
const CustomDropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default items-center gap-2 rounded px-2 py-1 text-sm transition-colors hover:bg-gray-100 focus:bg-gray-200 outline-none",
      inset && "pl-6",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto w-3 h-3" />
  </DropdownMenuPrimitive.SubTrigger>
))
CustomDropdownMenuSubTrigger.displayName = "CustomDropdownMenuSubTrigger"

// SubContent for nested menus
const CustomDropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[6rem] rounded border bg-white p-1 shadow-md text-gray-800",
      className
    )}
    {...props}
  />
))
CustomDropdownMenuSubContent.displayName = "CustomDropdownMenuSubContent"

// Main Content
const CustomDropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[6rem] rounded border bg-white p-1 shadow-md text-gray-800",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
CustomDropdownMenuContent.displayName = "CustomDropdownMenuContent"

// Item
const CustomDropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "flex items-center gap-2 cursor-pointer rounded px-2 py-1 text-sm transition-colors hover:bg-blue-500 hover:text-white outline-none",
      inset && "pl-6",
      className
    )}
    {...props}
  />
))
CustomDropdownMenuItem.displayName = "CustomDropdownMenuItem"

// Checkbox Item
const CustomDropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex items-center py-1 pl-6 pr-2 text-sm rounded cursor-pointer hover:bg-gray-100 outline-none",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3 w-3 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="w-3 h-3" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
CustomDropdownMenuCheckboxItem.displayName =
  "CustomDropdownMenuCheckboxItem"

// Radio Item
const CustomDropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex items-center py-1 pl-6 pr-2 text-sm rounded cursor-pointer hover:bg-gray-100 outline-none",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3 w-3 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="w-2 h-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
CustomDropdownMenuRadioItem.displayName = "CustomDropdownMenuRadioItem"

// Label
const CustomDropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1 text-xs font-semibold text-gray-500", inset && "pl-6", className)}
    {...props}
  />
))
CustomDropdownMenuLabel.displayName = "CustomDropdownMenuLabel"

// Separator
const CustomDropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("my-1 h-px bg-gray-200", className)}
    {...props}
  />
))
CustomDropdownMenuSeparator.displayName = "CustomDropdownMenuSeparator"

// Shortcut text
const CustomDropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("ml-auto text-xs text-gray-400 tracking-wide", className)} {...props} />
)
CustomDropdownMenuShortcut.displayName = "CustomDropdownMenuShortcut"

export {
  CustomDropdownMenu,
  CustomDropdownMenuTrigger,
  CustomDropdownMenuContent,
  CustomDropdownMenuItem,
  CustomDropdownMenuCheckboxItem,
  CustomDropdownMenuRadioItem,
  CustomDropdownMenuLabel,
  CustomDropdownMenuSeparator,
  CustomDropdownMenuShortcut,
  CustomDropdownMenuGroup,
  CustomDropdownMenuPortal,
  CustomDropdownMenuSub,
  CustomDropdownMenuSubContent,
  CustomDropdownMenuSubTrigger,
  CustomDropdownMenuRadioGroup,
}
