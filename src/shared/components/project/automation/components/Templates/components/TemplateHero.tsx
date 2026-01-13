import React from "react";

const TemplateHero = () => {
  return (
    <div className="bg-yellow-100 p-6 rounded">
      <h2 className="text-lg font-semibold mb-4">
        Try these 3 simple rules for your team
      </h2>
      <div className="flex flex-col gap-2 mb-4">
        <div className="bg-white px-4 py-2 rounded shadow">
          ⚡ When a work item is transitioned → then automatically assign
        </div>
        <div className="bg-white px-4 py-2 rounded shadow">
          ⚡ When all child work items are completed → then close parent
        </div>
        <div className="bg-white px-4 py-2 rounded shadow">
          ⚡ When parent is completed → then close all the child work items present
        </div>
      </div>
      <button className="bg-yellow-300 px-4 py-2 rounded font-medium">
        Try them now
      </button>
    </div>
  );
};

export default TemplateHero;
