import React from "react";
import { cn } from "@/lib/utils";

interface CustomTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const CustomTextarea: React.FC<CustomTextareaProps> = ({ label, className, ...props }) => {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="text-sm font-medium mb-1.5">{label}</label>}
      <textarea
        {...props}
        className={cn(
          "border border-zinc-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-zinc-400 min-h-[80px]",
          className
        )}
      />
    </div>
  );
};