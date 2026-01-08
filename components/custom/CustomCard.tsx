import React from "react";
import { cn } from "@/lib/utils";

interface CustomCardProps {
  className?: string;
  children: React.ReactNode;
}

export const CustomCard: React.FC<CustomCardProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow border border-gray-200 w-full max-w-full sm:max-w-md md:max-w-lg dark:bg-card flex flex-col",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CustomCardHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => (
  <div className={cn("border-b border-gray-200 px-4 py-2", className)}>
    {children}
  </div>
);

export const CustomCardTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => (
  <h3 className={cn("text-sm sm:text-base font-semibold dark:text-white", className)}>
    {children}
  </h3>
);

// New component: CustomCardDescription
export const CustomCardDescription: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => (
  <p className={cn("text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1", className)}>
    {children}
  </p>
);

export const CustomCardContent: React.FC<{
  className?: string;
  children: React.ReactNode;
  padding?: "none" | "xs" | "sm" | "md";
  maxHeight?: string;
}> = ({ className, children, padding = "xs", maxHeight = "500px" }) => {
  const paddingMap = {
    none: "p-0",
    xs: "p-2 sm:p-3 md:p-4",
    sm: "p-4 sm:p-5 md:p-6",
    md: "p-6 sm:p-8 md:p-10",
  };
  return (
    <div
      className={cn(
        paddingMap[padding],
        "overflow-y-auto flex-1",
        className
      )}
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
};

export const CustomCardFooter: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => (
  <div className={cn("border-t border-gray-200 px-4 py-2 text-xs sm:text-sm text-gray-500", className)}>
    {children}
  </div>
);
