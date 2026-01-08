"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const CustomAlertDialog = AlertDialogPrimitive.Root
const CustomAlertDialogTrigger = AlertDialogPrimitive.Trigger
const CustomAlertDialogPortal = AlertDialogPrimitive.Portal

const CustomAlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
CustomAlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const CustomAlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <CustomAlertDialogPortal>
    <CustomAlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2",
        "rounded-md border border-gray-200 bg-white shadow-md",
        "p-4 sm:p-5 space-y-3",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:zoom-in-90 data-[state=closed]:zoom-out-90",
        className
      )}
      {...props}
    />
  </CustomAlertDialogPortal>
))
CustomAlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const CustomAlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("space-y-1 text-left", className)} {...props} />
)
CustomAlertDialogHeader.displayName = "AlertDialogHeader"

const CustomAlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex justify-end gap-2 pt-2", className)} {...props} />
)
CustomAlertDialogFooter.displayName = "AlertDialogFooter"

const CustomAlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-base font-medium text-gray-900", className)}
    {...props}
  />
))
CustomAlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const CustomAlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
))
CustomAlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const CustomAlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants({ size: "sm" }), className)}
    {...props}
  />
))
CustomAlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const CustomAlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline", size: "sm" }),
      className
    )}
    {...props}
  />
))
CustomAlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  CustomAlertDialog,
  CustomAlertDialogPortal,
  CustomAlertDialogOverlay,
  CustomAlertDialogTrigger,
  CustomAlertDialogContent,
  CustomAlertDialogHeader,
  CustomAlertDialogFooter,
  CustomAlertDialogTitle,
  CustomAlertDialogDescription,
  CustomAlertDialogAction,
  CustomAlertDialogCancel,
}
