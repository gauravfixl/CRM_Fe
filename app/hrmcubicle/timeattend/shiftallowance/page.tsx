"use client";

import React, { useState } from "react";
import { ChevronDown, Plus, Pencil, Trash2, Eye } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import AddShiftAllowancePolicy from "@/components/hrm/timeattend/shiftallowance/addshiftallowancepolicy";
import AddShiftAllowanceCode from "@/components/hrm/timeattend/shiftallowance/addshiftallowancecode";

interface Policy {
  name: string;
  employees: number;
}

interface ShiftCode {
  name: string;
  code: string;
  payment: string;
  lastUpdated: string;
  updatedBy: string;
}

const ShiftAllowancePage: React.FC = () => {
  const [mainTab, setMainTab] = useState("Shift Allowance Policy");
  const [selectedPolicy, setSelectedPolicy] = useState("Evening shift-India");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [subTab, setSubTab] = useState("Summary");
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  const [showAddCode, setShowAddCode] = useState(false);

  const [policies, setPolicies] = useState<Policy[]>([
    { name: "Evening shift-India", employees: 0 },
    { name: "General", employees: 0 },
    { name: "General Shift", employees: 0 },
    { name: "Night Shift-India", employees: 0 },
    { name: "Noon Shift-India", employees: 0 },
  ]);

  const [shiftCodes, setShiftCodes] = useState<ShiftCode[]>([
    {
      name: "General",
      code: "GC",
      payment: "[Gross]*0.1 (Lump Sum)",
      lastUpdated: "03 May 2023",
      updatedBy: "Mark Scoffield",
    },
    {
      name: "Night Shift-Pay Code",
      code: "NIPC",
      payment: "[Basic]*0.2 (Lump Sum)",
      lastUpdated: "07 Oct 2024",
      updatedBy: "Mark Scoffield",
    },
    {
      name: "Night Shift-US",
      code: "NIUS",
      payment: "[Basic]*0.4 (Lump Sum)",
      lastUpdated: "07 Oct 2024",
      updatedBy: "Mark Scoffield",
    },
  ]);

  // Save new policy from modal
  const handleSave = (data: any) => {
    const newPolicy: Policy = {
      name: data.policyName || "Untitled Policy",
      employees: 0,
    };
    setPolicies((prev) => [...prev, newPolicy]);
    setSelectedPolicy(newPolicy.name);
    setShowAddPolicy(false);
  };

  const handleAddCode = (data: any) => {
    const newCode: ShiftCode = {
      name: data.name || "Untitled Code",
      code: data.name?.slice(0, 3).toUpperCase() || "NEW",
      payment: data.lumpFormula || data.fixedAmount || "[Basic]*0.1",
      lastUpdated: new Date().toLocaleDateString("en-GB"),
      updatedBy: "Mark Scoffield",
    };
    setShiftCodes((prev) => [...prev, newCode]);
    setShowAddCode(false);
  };

  return (
    <div className="w-full h-full bg-white border rounded-md shadow-sm flex flex-col">
      {/* ==== Top Tabs ==== */}
      <div className="flex items-center border-b">
        {["Shift Allowance Policy", "Shift Allowance Code"].map((tab) => (
          <button
            key={tab}
            onClick={() => setMainTab(tab)}
            className={`px-4 py-2 text-xs font-medium ${
              mainTab === tab
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ==== POLICY TAB ==== */}
      {mainTab === "Shift Allowance Policy" && (
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="w-1/4 border-r p-3 flex flex-col">
            <h2 className="text-sm font-semibold text-primary mb-2">
              Shift allowance policy
            </h2>
            <input
              type="text"
              placeholder="Search"
              className="w-full border rounded-md px-2 py-1 text-xs mb-3 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <div className="overflow-y-auto space-y-1">
              {policies.map((policy) => (
                <div
                  key={policy.name}
                  onClick={() => setSelectedPolicy(policy.name)}
                  className={`cursor-pointer rounded-md px-3 py-2 ${
                    selectedPolicy === policy.name
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <p className="text-xs font-medium">{policy.name}</p>
                  <p className="text-gray-500 text-xs">
                    {policy.employees} employee
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Section */}
          <div className="flex-1 flex flex-col">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between border-b px-4 py-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  {selectedPolicy}
                </h3>
                <p className="text-xs text-gray-500">ESI</p>
              </div>

              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-md space-x-1 hover:opacity-90"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Shift Allowance Policy</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute right-0 mt-1 w-40 bg-white border rounded-md shadow-md z-10"
                    >
                      <div className="text-xs">
                        <button
                          className="block w-full text-left px-3 py-1.5 hover:bg-gray-50"
                          onClick={() => {
                            setDropdownOpen(false);
                            setShowAddPolicy(true);
                          }}
                        >
                          Create from scratch
                        </button>
                        <button className="block w-full text-left px-3 py-1.5 hover:bg-gray-50">
                          Select from template
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex items-center border-b px-4 space-x-6 text-xs">
              {["Summary", "Employees", "Versions"].map((tab) => (
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

            {/* Sub Tab Content */}
            <div className="p-4 flex-1 overflow-y-auto text-xs text-gray-700">
              {subTab === "Summary" && (
                <div className="space-y-3">
                  <p>Shifts to be considered for the purpose of shift allowance calculation:</p>
                  <p>✅ Configure shift allowance based on time range.</p>
                  <p>• If shift start time is between <b>4 PM – 1 AM</b>, shift allowance is paid as <b>GC</b>.</p>
                </div>
              )}

              {subTab === "Employees" && (
                <p className="text-gray-600">
                  No employees assigned to this shift allowance policy yet.
                </p>
              )}

              {subTab === "Versions" && (
                <div className="space-y-3 text-xs">
                  <h4 className="font-medium text-gray-700 mb-2">
                    History of changes made to shifts with effective dates
                  </h4>

                  <div className="border rounded-md divide-y">
                    {[
                      { id: 1, dateRange: "17 Sept 2025 – Current", updatedBy: "Mark Scoffield", updatedOn: "17 Sept 2025", isCurrent: true, isPast: false },
                      { id: 2, dateRange: "1 Aug 2025 – 16 Sept 2025", updatedBy: "Sarah Lin", updatedOn: "1 Aug 2025", isCurrent: false, isPast: true },
                      { id: 3, dateRange: "1 Nov 2025 – Future", updatedBy: "Mark Scoffield", updatedOn: "22 Oct 2025", isCurrent: false, isPast: false },
                    ].map((v) => (
                      <div key={v.id} className="flex items-center justify-between px-4 py-2 hover:bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${v.isCurrent ? "bg-green-500" : v.isPast ? "bg-gray-400" : "bg-blue-500"}`} />
                          <p className="text-gray-700 font-medium">{v.dateRange}</p>
                        </div>
                        <p className="text-gray-500">
                          Updated by <b>{v.updatedBy}</b> on {v.updatedOn}
                        </p>
                        <div className="flex items-center space-x-3 text-gray-400">
                          <Eye className="w-4 h-4 hover:text-primary cursor-pointer" />
                          <Pencil className="w-4 h-4 hover:text-primary cursor-pointer" />
                          <Trash2
                            className={`w-4 h-4 ${
                              v.isCurrent || v.isPast
                                ? "opacity-40 cursor-not-allowed"
                                : "hover:text-red-500 cursor-pointer"
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==== CODE TAB ==== */}
      {mainTab === "Shift Allowance Code" && (
        <div className="flex flex-col p-4 text-xs flex-1">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold text-gray-800">
              Shift allowance code
            </h3>
            <button
              onClick={() => setShowAddCode(true)}
              className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 text-xs rounded-md hover:opacity-90"
            >
              <Plus className="w-3 h-3" />
              Add Shift Allowance Code
            </button>
          </div>

          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-gray-50 text-gray-700 font-medium">
                <tr>
                  <th className="px-3 py-2 border-b">SHIFT ALLOWANCE CODE NAME</th>
                  <th className="px-3 py-2 border-b">SHIFT ALLOWANCE CODE</th>
                  <th className="px-3 py-2 border-b">PAYMENT CALCULATION</th>
                  <th className="px-3 py-2 border-b">LAST UPDATED ON</th>
                  <th className="px-3 py-2 border-b text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {shiftCodes.map((code) => (
                  <tr key={code.code} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border-b">{code.name}</td>
                    <td className="px-3 py-2 border-b">{code.code}</td>
                    <td className="px-3 py-2 border-b">{code.payment}</td>
                    <td className="px-3 py-2 border-b">
                      {code.lastUpdated} <br />
                      <span className="text-gray-500">by {code.updatedBy}</span>
                    </td>
                    <td className="px-3 py-2 border-b text-center space-x-2">
                      <Eye className="w-4 h-4 inline-block hover:text-primary cursor-pointer" />
                      <Pencil className="w-4 h-4 inline-block hover:text-primary cursor-pointer" />
                      <Trash2 className="w-4 h-4 inline-block hover:text-red-500 cursor-pointer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==== DRAWERS ==== */}
      <AddShiftAllowancePolicy
        isOpen={showAddPolicy}
        onClose={() => setShowAddPolicy(false)}
        onSave={handleSave}
      />
      <AddShiftAllowanceCode
        isOpen={showAddCode}
        onClose={() => setShowAddCode(false)}
        onSave={handleAddCode}
      />
    </div>
  );
};

export default ShiftAllowancePage;
