"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// Base alias for Dialog
const CustomDialog = Dialog
const CustomDialogTrigger = DialogTrigger

// Content styled to look like Jira modal
const CustomDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  React.ComponentPropsWithoutRef<typeof DialogContent>
>(({ className, ...props }, ref) => (
  <DialogContent
    ref={ref}
    className={cn(
      "sm:max-w-sm w-full rounded-lg border border-border bg-background p-4 shadow-md", // compact + subtle
      "transition-all duration-200",
      className
    )}
    {...props}
  />
))
CustomDialogContent.displayName = "CustomDialogContent"

// Header with subtle padding and font
const CustomDialogHeader = React.forwardRef<
  React.ElementRef<typeof DialogHeader>,
  React.ComponentPropsWithoutRef<typeof DialogHeader>
>(({ className, ...props }, ref) => (
  <DialogHeader
    ref={ref}
    className={cn("mb-2 space-y-1.5 text-left", className)}
    {...props}
  />
))
CustomDialogHeader.displayName = "CustomDialogHeader"

// Title styled like Jira modal headers
const CustomDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogTitle>,
  React.ComponentPropsWithoutRef<typeof DialogTitle>
>(({ className, ...props }, ref) => (
  <DialogTitle
    ref={ref}
    className={cn("text-base font-semibold text-foreground", className)}
    {...props}
  />
))
CustomDialogTitle.displayName = "CustomDialogTitle"

// Description subtle like Jira subtitle
const CustomDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogDescription>,
  React.ComponentPropsWithoutRef<typeof DialogDescription>
>(({ className, ...props }, ref) => (
  <DialogDescription
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CustomDialogDescription.displayName = "CustomDialogDescription"

// Footer aligned right, compact buttons
const CustomDialogFooter = React.forwardRef<
  React.ElementRef<typeof DialogFooter>,
  React.ComponentPropsWithoutRef<typeof DialogFooter>
>(({ className, ...props }, ref) => (
  <DialogFooter
    ref={ref}
    className={cn("flex justify-end gap-2 pt-3", className)}
    {...props}
  />
))
CustomDialogFooter.displayName = "CustomDialogFooter"

export {
  CustomDialog,
  CustomDialogTrigger,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogDescription,
  CustomDialogFooter,
}
