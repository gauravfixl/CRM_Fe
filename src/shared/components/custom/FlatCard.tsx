import * as React from "react";
import { cn } from "@/lib/utils";

const FlatCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border border-white shadow-md bg-white text-gray-800 p-3",
      "text-sm", // smaller text overall
      "transition-colors duration-200", // keep smooth color changes, no hover shadow/lift
      className
    )}
    {...props}
  />
));
FlatCard.displayName = "FlatCard";

const FlatCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col p-2", className)} {...props} />
));
FlatCardHeader.displayName = "FlatCardHeader";

const FlatCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-base font-medium leading-snug truncate", className)}
    {...props}
  />
));
FlatCardTitle.displayName = "FlatCardTitle";

const FlatCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs text-gray-500", className)}
    {...props}
  />
));
FlatCardDescription.displayName = "FlatCardDescription";

const FlatCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-2 pt-0", className)} {...props} />
));
FlatCardContent.displayName = "FlatCardContent";

const FlatCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between p-2 pt-0", className)}
    {...props}
  />
));
FlatCardFooter.displayName = "FlatCardFooter";

export {
  FlatCard,
  FlatCardHeader,
  FlatCardFooter,
  FlatCardTitle,
  FlatCardDescription,
  FlatCardContent,
};
