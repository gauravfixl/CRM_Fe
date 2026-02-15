import * as React from "react";
import { cn } from "@/lib/utils";

const SmallCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border bg-white text-gray-800 shadow-sm transition-all duration-200",
      "text-sm",
      className
    )}
    {...props}
  />
));

SmallCard.displayName = "SmallCard";

const SmallCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col p-2", className)} // less padding
    {...props}
  />
));
SmallCardHeader.displayName = "SmallCardHeader";

const SmallCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-base font-medium leading-snug truncate", className)} // smaller title
    {...props}
  />
));
SmallCardTitle.displayName = "SmallCardTitle";

const SmallCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs text-gray-500", className)} // lighter, smaller desc
    {...props}
  />
));
SmallCardDescription.displayName = "SmallCardDescription";

const SmallCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-2 pt-0", className)} {...props} />
));
SmallCardContent.displayName = "SmallCardContent";

const SmallCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between p-2 pt-0", className)} // compact footer
    {...props}
  />
));
SmallCardFooter.displayName = "SmallCardFooter";

export {
  SmallCard,
  SmallCardHeader,
  SmallCardFooter,
  SmallCardTitle,
  SmallCardDescription,
  SmallCardContent,
};
