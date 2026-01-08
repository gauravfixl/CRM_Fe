"use client";

import React, { useState } from "react";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";

const ShiftAndWeeklyOffRules: React.FC = () => {
  const [selectedRule, setSelectedRule] = useState("General");
  const [subTab, setSubTab] = useState("Summary");

  const rules = [
    { name: "General", employees: 1 },
    { name: "Night Shift", employees: 0 },
  ];

  return (
    <div className="w-full h-full bg-white border rounded-md shadow-sm flex flex-col">
      {/* ==== HEADER ==== */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <h2 className="text-sm font-semibold text-primary">
          Shift & weekly off rules
        </h2>
        <button className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 text-xs rounded-md hover:opacity-90">
          <Plus className="w-3 h-3" />
          Add Rule
        </button>
      </div>

      <div className="flex flex-1">
        {/* ==== LEFT SIDEBAR ==== */}
        <div className="w-1/4 border-r p-3 flex flex-col">
          <input
            type="text"
            placeholder="Search"
            className="w-full border rounded-md px-2 py-1 text-xs mb-3 focus:outline-none focus:ring-1 focus:ring-primary"
          />

          <div className="overflow-y-auto space-y-1">
            {rules.map((rule) => (
              <div
                key={rule.name}
                onClick={() => setSelectedRule(rule.name)}
                className={`cursor-pointer rounded-md px-3 py-2 ${
                  selectedRule === rule.name
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-gray-50"
                }`}
              >
                <p className="text-xs font-medium">{rule.name}</p>
                <p className="text-gray-500 text-xs">
                  {rule.employees} employee
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ==== MAIN SECTION ==== */}
        <div className="flex-1 flex flex-col">
          {/* Header with actions */}
          <div className="flex items-center justify-between border-b px-4 py-2">
            <h3 className="text-sm font-semibold text-gray-800">
              {selectedRule}
            </h3>
            <div className="flex items-center space-x-3 text-gray-400">
              <Eye className="w-4 h-4 hover:text-primary cursor-pointer" />
              <Pencil className="w-4 h-4 hover:text-primary cursor-pointer" />
              <Trash2 className="w-4 h-4 hover:text-red-500 cursor-pointer" />
            </div>
          </div>

          {/* Sub Tabs */}
          <div className="flex items-center border-b px-4 space-x-6 text-xs">
            {["Summary", "Employees"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSubTab(tab)}
                className={`py-2 ${
                  subTab === tab
                    ? "text-primary border-b-2 border-primary font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ==== CONTENT AREA ==== */}
          <div className="p-4 flex-1 overflow-y-auto text-xs text-gray-700 space-y-6">
            {/* === Summary Section === */}
            {subTab === "Summary" && (
              <>
                {/* Shift Assignment */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Shift assignment
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    ✅ Shift assignment (on weekly off or holidays), and shift
                    change (on regular weekdays) can be requested by employees.
                  </p>

                  <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-md border text-xs">
                    <div>
                      <p className="text-gray-500 mb-1 text-xs">DAYS OF SHIFT REQUEST ALLOWED</p>
                      <p className="text-gray-800 font-medium text-xs">3 days weekly</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1 text-xs">REQUIRES APPROVAL</p>
                      <p className="text-gray-800 font-medium text-xs">No</p>
                    </div>
                  </div>
                </div>

                {/* Weekly Off */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-1">
                    Weekly off
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    ✅ Weekly off can be requested by employees.
                  </p>

                  <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-md border text-xs">
                    <div>
                      <p className="text-gray-500 mb-1 text-xs">
                        DAYS OF WEEKLY OFF REQUEST ALLOWED
                      </p>
                      <p className="text-gray-800 font-medium text-xs">4 days monthly</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1 text-xs">REQUIRES APPROVAL</p>
                      <p className="text-gray-800 font-medium text-xs">Yes</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* === Employees Section === */}
            {subTab === "Employees" && (
              <div className="text-gray-600">
                No employees assigned to this rule yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftAndWeeklyOffRules;
