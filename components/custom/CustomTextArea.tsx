// components/ui/CustomTextarea.tsx
import React from "react";

interface CustomTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const CustomTextarea: React.FC<CustomTextareaProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col mb-2">
      {label && <label className="text-sm font-medium mb-1">{label}</label>}
      <textarea
        {...props}
        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
};