import React from "react";
import { cn } from "@/lib/utils";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const CustomInput: React.FC<CustomInputProps> = ({ label, className, ...props }) => {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="text-sm font-medium mb-1.5">{label}</label>}
      <input
        {...props}
        className={cn(
          "border border-zinc-200 bg-white px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-zinc-400",
          className
        )}
      />
    </div>
  );
};
