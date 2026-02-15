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
      name: data.policyName || "Untitled policy",
      employees: 0,
    };
    setPolicies((prev) => [...prev, newPolicy]);
    setSelectedPolicy(newPolicy.name);
    setShowAddPolicy(false);
  };

  const handleAddCode = (data: any) => {
    const newCode: ShiftCode = {
      name: data.name || "Untitled code",
      code: data.name?.slice(0, 3).toUpperCase() || "NEW",
      payment: data.lumpFormula || data.fixedAmount || "[Basic]*0.1",
      lastUpdated: new Date().toLocaleDateString("en-GB"),
      updatedBy: "Mark Scoffield",
    };
    setShiftCodes((prev) => [...prev, newCode]);
    setShowAddCode(false);
  };

  return (
    <div className="flex-1 bg-[#fcfdff] overflow-x-hidden overflow-y-auto min-h-screen">
      <div style={{ zoom: '0.8' }} className="p-12 space-y-10">

        {/* Header Section */}
        <div className="flex justify-between items-end border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Shift Allowance</h1>
            <p className="text-slate-500 font-bold text-base mt-1">Configure and manage shift allowance policies and codes.</p>
          </div>

          <TabsList className="bg-slate-100/50 p-1.5 rounded-2xl gap-2 h-auto flex justify-start items-center border border-slate-200">
            {["Shift Allowance Policy", "Shift Allowance Code"].map((tab) => (
              <button
                key={tab}
                onClick={() => setMainTab(tab)}
                className={`px-8 py-3 rounded-xl font-bold text-xs transition-all ${mainTab === tab
                    ? "bg-white text-[#CB9DF0] shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                {tab}
              </button>
            ))}
          </TabsList>
        </div>

        {/* POLICY TAB CONTENT */}
        {mainTab === "Shift Allowance Policy" && (
          <div className="grid grid-cols-12 gap-8 items-start">
            {/* Sidebar */}
            <Card className="col-span-3 shadow-2xl shadow-slate-200/50 border-none rounded-[2.5rem] bg-white overflow-hidden p-8 h-fit">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
                Policy list
              </h2>
              <input
                type="text"
                placeholder="Search policies..."
                className="w-full h-12 rounded-xl bg-slate-50 border-none px-6 font-bold text-sm mb-6 placeholder:font-bold focus:ring-2 focus:ring-[#CB9DF0]/20 transition-all"
              />
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                {policies.map((policy) => (
                  <div
                    key={policy.name}
                    onClick={() => setSelectedPolicy(policy.name)}
                    className={`cursor-pointer rounded-2xl px-5 py-4 transition-all ${selectedPolicy === policy.name
                        ? "bg-[#CB9DF0]/10 text-[#9d5ccf]"
                        : "hover:bg-slate-50 text-slate-600"
                      }`}
                  >
                    <p className="font-bold text-sm tracking-tight">{policy.name}</p>
                    <p className={`text-[10px] font-bold ${selectedPolicy === policy.name ? 'text-[#9d5ccf]/70' : 'text-slate-400'}`}>
                      {policy.employees} staff coverage
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Main Content Area */}
            <div className="col-span-9 space-y-8">
              <Card className="shadow-2xl shadow-slate-200/50 border-none rounded-[2.5rem] bg-white overflow-hidden">
                {/* Policy Title Header */}
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                      {selectedPolicy}
                    </h3>
                    <p className="text-sm font-bold text-slate-400 mt-1">Managed via ESI Framework</p>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center bg-[#CB9DF0] text-white h-14 px-8 rounded-xl font-bold shadow-xl shadow-purple-100 hover:bg-[#b580e0] transition-all gap-3"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Create new policy</span>
                      <ChevronDown className="w-5 h-5" />
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-3 w-64 bg-white border-none rounded-2xl shadow-2xl z-20 overflow-hidden font-bold"
                        >
                          <div className="text-sm p-2">
                            <button
                              className="w-full text-left px-5 py-3 rounded-xl hover:bg-slate-50 transition-colors"
                              onClick={() => {
                                setDropdownOpen(false);
                                setShowAddPolicy(true);
                              }}
                            >
                              Create from scratch
                            </button>
                            <button className="w-full text-left px-5 py-3 rounded-xl hover:bg-slate-50 transition-colors">
                              Select from template
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Sub-tabs for Policy */}
                <div className="px-8 border-b border-slate-50 flex items-center gap-10">
                  {["Summary", "Employees", "Versions"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSubTab(tab)}
                      className={`py-6 text-sm font-bold transition-all relative ${subTab === tab
                          ? "text-[#9d5ccf]"
                          : "text-slate-400 hover:text-slate-600"
                        }`}
                    >
                      {tab}
                      {subTab === tab && (
                        <motion.div layoutId="subtab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#CB9DF0] rounded-t-full" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Policy Sub-tab Contents */}
                <div className="p-8 min-h-[300px]">
                  {subTab === "Summary" && (
                    <div className="space-y-6">
                      <p className="text-lg font-bold text-slate-600 leading-relaxed">Shifts to be considered for the purpose of shift allowance calculation:</p>
                      <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                          <Plus className="w-5 h-5" />
                        </div>
                        <p className="font-bold text-emerald-800">Shift allowance configured based on custom time ranges.</p>
                      </div>
                      <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                        <p className="font-bold text-slate-500 text-base leading-relaxed">• If shift start time is between <span className="text-slate-900">4 PM – 1 AM</span>, shift allowance is paid as <span className="text-[#9d5ccf]">GC Code</span>.</p>
                      </div>
                    </div>
                  )}

                  {subTab === "Employees" && (
                    <div className="flex flex-col items-center justify-center h-48 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100 p-8">
                      <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300 mb-4">
                        <Plus className="w-8 h-8" />
                      </div>
                      <p className="text-slate-400 font-bold italic">No internal staff members assigned to this policy yet.</p>
                    </div>
                  )}

                  {subTab === "Versions" && (
                    <div className="space-y-8">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                        History of policy modifications
                      </h4>

                      <div className="border border-slate-100 rounded-[2rem] overflow-hidden">
                        {[
                          { id: 1, dateRange: "17 Sept 2025 – Current", updatedBy: "Mark Scoffield", updatedOn: "17 Sept 2025", isCurrent: true, isPast: false },
                          { id: 2, dateRange: "1 Aug 2025 – 16 Sept 2025", updatedBy: "Sarah Lin", updatedOn: "1 Aug 2025", isCurrent: false, isPast: true },
                          { id: 3, dateRange: "1 Nov 2025 – Future", updatedBy: "Mark Scoffield", updatedOn: "22 Oct 2025", isCurrent: false, isPast: false },
                        ].map((v) => (
                          <div key={v.id} className="flex items-center justify-between px-8 py-6 hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-none">
                            <div className="flex items-center gap-4">
                              <div className={`w-3 h-3 rounded-full shadow-sm ${v.isCurrent ? "bg-emerald-500" : v.isPast ? "bg-slate-300" : "bg-[#CB9DF0]"}`} />
                              <p className="text-slate-900 font-bold text-base tracking-tight">{v.dateRange}</p>
                            </div>
                            <p className="text-slate-500 font-bold text-sm">
                              Modified by <span className="text-slate-800">{v.updatedBy}</span> on {v.updatedOn}
                            </p>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-[#CB9DF0] hover:bg-white active:scale-95 transition-all shadow-none">
                                <Eye size={18} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-[#CB9DF0] hover:bg-white active:scale-95 transition-all shadow-none">
                                <Pencil size={18} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-white active:scale-95 transition-all shadow-none disabled:opacity-20" disabled={v.isCurrent || v.isPast}>
                                <Trash2 size={18} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* CODE TAB CONTENT */}
        {mainTab === "Shift Allowance Code" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Active shift codes
              </h3>
              <button
                onClick={() => setShowAddCode(true)}
                className="flex items-center gap-3 bg-[#CB9DF0] text-white h-14 px-8 rounded-xl font-bold shadow-xl shadow-purple-100 hover:bg-[#b580e0] transition-all"
              >
                <Plus className="w-6 h-6" />
                <span>Register new shift code</span>
              </button>
            </div>

            <Card className="shadow-2xl shadow-slate-200/50 border-none rounded-[3rem] bg-white overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="p-8 font-bold text-xs uppercase tracking-widest text-slate-400">Shift code name</th>
                    <th className="p-8 font-bold text-xs uppercase tracking-widest text-slate-400">Identifier code</th>
                    <th className="p-8 font-bold text-xs uppercase tracking-widest text-slate-400">Payment logic</th>
                    <th className="p-8 font-bold text-xs uppercase tracking-widest text-slate-400">Audit details</th>
                    <th className="p-8 font-bold text-xs uppercase tracking-widest text-slate-400 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {shiftCodes.map((code) => (
                    <tr key={code.code} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-8 font-bold text-slate-900 text-lg">{code.name}</td>
                      <td className="p-8">
                        <Badge className="bg-slate-900 text-white border-none font-bold px-4 py-1.5 rounded-xl uppercase text-[10px] tracking-widest">{code.code}</Badge>
                      </td>
                      <td className="p-8">
                        <div className="bg-indigo-50/50 text-indigo-700 px-4 py-3 rounded-2xl font-bold text-sm border border-indigo-100 inline-block">
                          {code.payment}
                        </div>
                      </td>
                      <td className="p-8">
                        <p className="font-bold text-slate-600 text-sm mb-0.5">{code.lastUpdated}</p>
                        <p className="text-[10px] font-bold text-slate-400 italic">By {code.updatedBy}</p>
                      </td>
                      <td className="p-8 text-center">
                        <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-[#CB9DF0] hover:bg-white shadow-sm"><Eye size={18} /></Button>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-[#CB9DF0] hover:bg-white shadow-sm"><Pencil size={18} /></Button>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-white shadow-sm"><Trash2 size={18} /></Button>
                        </div>
                        <div className="group-hover:hidden transition-all text-slate-300">
                          <Plus className="w-5 h-5 mx-auto" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

      </div>

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
