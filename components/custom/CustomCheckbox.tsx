"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomCheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: React.ReactNode
  labelPosition?: "before" | "after" // to control text placement
  className?: string
}

const CustomCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CustomCheckboxProps
>(({ className, label, labelPosition = "after", ...props }, ref) => {
  return (
    <label
      className={cn(
        "inline-flex items-center gap-2 cursor-pointer text-sm text-gray-700",
        props.disabled && "cursor-not-allowed opacity-60"
      )}
    >
      {label && labelPosition === "before" && <span>{label}</span>}

      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          "peer h-3.5 w-3.5 shrink-0 rounded border border-gray-300 bg-white " +
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 " +
            "data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
          <Check className="h-3 w-3" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {label && labelPosition === "after" && <span>{label}</span>}
    </label>
  )
})

CustomCheckbox.displayName = "CustomCheckbox"

export { CustomCheckbox }
