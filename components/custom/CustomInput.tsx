// CustomInput.tsx
import React from "react";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode; // change from string to ReactNode
}

export const CustomInput: React.FC<CustomInputProps> = ({ label, ...props }) => {
  return (
    <div className="flex flex-col mb-2">
      {label && <label className="text-sm font-medium mb-1">{label}</label>}
      <input
        {...props}
        className="border border-gray-300  px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
};
