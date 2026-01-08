import React from "react";
import TemplateCard from "./TemplateCard";

type Props = {
  title: string;
  templates: string[];
};

const TemplateCategory = ({ title, templates }: Props) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {templates.map((template, index) => (
          <TemplateCard key={index} title={template} />
        ))}
      </div>
    </div>
  );
};

export default TemplateCategory;
