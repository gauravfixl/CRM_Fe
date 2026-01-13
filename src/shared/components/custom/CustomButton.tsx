import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-900 text-white hover:bg-zinc-800 shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-gray-300 bg-white text-gray-700 hover:bg-zinc-900 hover:text-white hover:border-zinc-900",
        secondary:
          "bg-gray-100 text-gray-800 hover:bg-gray-200",
        ghost:
          "text-gray-700 hover:bg-gray-100",
        link:
          "text-primary underline-offset-4 hover:underline",
        subtle:
          "bg-transparent text-gray-700 hover:text-zinc-900", // Removed bg hover as requested
      },
      size: {
        sm: "h-7 px-2.5 text-xs", // 🔹 Compact small (Jira/Teams style)
        md: "h-8 px-3 text-sm",   // 🔹 Default compact
        lg: "h-9 px-4 text-sm",   // Slightly bigger, still compact
        icon: "h-7 w-7",          // Small icon-only button
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
CustomButton.displayName = "CustomButton"

export { CustomButton, buttonVariants }
