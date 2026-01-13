import React from "react";

type Props = {
  title: string;
};

const TemplateCard = ({ title }: Props) => {
  return (
    <div className="border rounded p-4 bg-white shadow-sm hover:shadow-md transition">
      <p className="text-sm">{title}</p>
    </div>
  );
};

export default TemplateCard;
