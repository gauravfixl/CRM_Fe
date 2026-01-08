"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import AddShiftWizard from "@/components/hrm/timeattend/shifts/AddShiftWizard";
import AddAutoAssignmentShiftWizard from "@/components/hrm/timeattend/shifts/AddAutoAssignmentShiftWizard";
import ShiftAndWeeklyOffRules from "@/components/hrm/timeattend/shifts/ShiftAndWeeklyOffRules";

export default function ShiftAndWeeklyOffs() {
  const [activeTab, setActiveTab] = useState("Shifts");
  const [selectedShift, setSelectedShift] = useState("Afternoon");
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAddShift, setShowAddShift] = useState(false);
  const [showAutoAssignShift, setShowAutoAssignShift] = useState(false);
  const [innerTab, setInnerTab] = useState("Summary");

  const [shifts, setShifts] = useState([
    { name: "Afternoon", employees: 53, default: true },
    { name: "Flexible Shift", employees: 18 },
    { name: "General", employees: 15 },
    { name: "Morning", employees: 0 },
    { name: "Night", employees: 0 },
  ]);

  // Unified save handler for both shift types
  const handleSaveShift = (newShift: any, type: "manual" | "auto" = "manual") => {
    const shiftTypeLabel = type === "auto" ? " (Auto)" : "";
    const name = newShift.name || newShift.shiftName || "Unnamed";
    const code = newShift.code || newShift.shiftCode || "";

    setShifts((prev) => [
      ...prev,
      {
        name: name + shiftTypeLabel,
        employees: 0,
        code,
        fixed: newShift.fixed,
      },
    ]);
  };

  // ✅ Conditional Render based on active tab
  return (
    <div className="p-4 text-xs">
      {/* Top Tabs */}
      <div className="flex gap-4 border-b mb-3 text-gray-700">
        {["Shifts", "Weekly Offs", "Shift & Weekly Off Rules"].map((tab) => (
          <button
            key={tab}
            className={cn(
              "pb-2 border-b-2 transition-colors",
              activeTab === tab
                ? "border-primary text-primary font-medium"
                : "border-transparent hover:text-primary"
            )}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ====== Conditional Rendering ====== */}
      {activeTab === "Shifts" && (
        <>
          {/* --- Your Existing Shift UI --- */}
          <div className="flex gap-3">
            {/* Left Sidebar */}
            <div className="w-[180px] border rounded-md bg-white overflow-hidden">
              <div className="p-2 border-b bg-gray-50 font-medium text-gray-600">
                Shifts
              </div>
              <div>
                {shifts.map((s) => (
                  <div
                    key={s.name}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 border-b last:border-none",
                      selectedShift === s.name && "bg-blue-50 text-blue-600"
                    )}
                    onClick={() => setSelectedShift(s.name)}
                  >
                    <div>
                      <p className="text-xs font-medium">{s.name}</p>
                      <p className="text-[10px] text-gray-500">
                        {s.employees} employees
                      </p>
                    </div>
                    {s.default && (
                      <span className="text-[9px] text-gray-500 italic">
                        Default
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 border rounded-md bg-white p-4">
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedShift}
                  </p>
                  <p className="text-[11px] text-gray-500">SHIFT CODE: AS</p>
                </div>

                {/* Add Shift Menu */}
                <div className="relative">
                  <Button
                    className="text-[11px] bg-primary hover:bg-primary text-white flex items-center gap-1 px-3 py-1"
                    onClick={() => setShowAddMenu((s) => !s)}
                  >
                    Add shifts
                    <ChevronDown className="w-3 h-3" />
                  </Button>

                  {showAddMenu && (
                    <div className="absolute right-0 mt-1 bg-white border rounded-lg shadow-md w-[180px] z-20 overflow-hidden text-[11px]">
                      <button
                        onClick={() => {
                          setShowAddShift(true);
                          setShowAddMenu(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        ➕ Create from scratch
                      </button>
                      <button
                        onClick={() => {
                          setShowAutoAssignShift(true);
                          setShowAddMenu(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors border-t"
                      >
                        ⚙️ Configure with auto assignment
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Inner Tabs */}
              <div className="flex gap-6 border-b mb-4 text-gray-600 text-[11px]">
                {["Summary", "Employees", "Track Shift Versions"].map((tab) => (
                  <button
                    key={tab}
                    className={cn(
                      "pb-2 border-b-2 transition-all",
                      innerTab === tab
                        ? "border-primary text-primary font-medium"
                        : "border-transparent hover:text-primary"
                    )}
                    onClick={() => setInnerTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Inner Tab Content */}
              {innerTab === "Summary" && (
                <div>
                  <h4 className="font-medium mb-2 text-gray-700">Summary</h4>
                  <table className="w-full text-xs border">
                    <thead className="bg-gray-50 text-gray-600 border-b">
                      <tr>
                        <th className="p-2 text-left">DAYS</th>
                        <th className="p-2 text-left">SHIFT TIMINGS</th>
                        <th className="p-2 text-left">BREAK DURATION</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-2">Sunday to Saturday</td>
                        <td className="p-2">
                          12:00 PM - 9:00 PM <br /> (1 hr 15 mins break)
                        </td>
                        <td className="p-2">1 hr 15 mins</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {innerTab === "Employees" && (
                <div className="text-gray-600 text-[12px]">
                  <p>No employees assigned to this shift yet.</p>
                </div>
              )}

              {innerTab === "Track Shift Versions" && (
                <div className="text-gray-700 text-[11px]">
                  <p className="font-medium mb-2 text-xs">Shift Versions</p>
                  <p className="text-gray-500 mb-3 text-xs">
                    History of changes made to this shift with effective dates.
                  </p>
                  <div className="border rounded-md bg-white">
                    <div className="grid grid-cols-5 text-gray-500 text-[11px] font-medium border-b bg-gray-50">
                      <div className="py-2 px-3 col-span-2">Effective Period</div>
                      <div className="py-2 px-3 col-span-2">Created By</div>
                      <div className="py-2 px-3 text-center">Actions</div>
                    </div>
                    {[{
                      id: 1,
                      start: "15 Sept 2025",
                      end: "Current",
                      createdBy: "Mark Senthuran",
                      createdOn: "08 Sept 2025",
                      employees: 10,
                    }].map((v) => (
                      <div
                        key={v.id}
                        className="grid grid-cols-5 items-center text-gray-700 border-b last:border-none hover:bg-gray-50"
                      >
                        <div className="py-2 px-3 col-span-2 flex items-center gap-2">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              v.end === "Current" ? "bg-green-500" : "bg-gray-400"
                            )}
                          ></div>
                          <span>
                            {v.start} – {v.end}
                          </span>
                        </div>

                        <div className="py-2 px-3 col-span-2">
                          <span className="block">
                            <span className="font-medium">{v.createdBy}</span> on {v.createdOn}
                          </span>
                        </div>

                        <div className="py-2 px-3 flex justify-center gap-3">
                          <button className="text-gray-500 hover:text-primary">👁</button>
                          <button className="text-gray-500 hover:text-primary">✏️</button>
                          <button className="text-gray-500 hover:text-red-500">🗑</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Wizards */}
          <AddShiftWizard
            open={showAddShift}
            onClose={() => setShowAddShift(false)}
            onSave={(shift) => handleSaveShift(shift, "manual")}
          />
          <AddAutoAssignmentShiftWizard
            isOpen={showAutoAssignShift}
            onClose={() => setShowAutoAssignShift(false)}
            onSave={(shift) => handleSaveShift(shift, "auto")}
          />
        </>
      )}

      {/* ✅ Render the Shift & Weekly Off Rules Component */}
      {activeTab === "Shift & Weekly Off Rules" && (
        <ShiftAndWeeklyOffRules />
      )}
    </div>
  );
}
