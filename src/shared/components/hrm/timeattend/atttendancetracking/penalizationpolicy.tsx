// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import NoAttendance from "./noattendance";
// import LateArrivalInfo from "./latearrivalinfo";
// import LateArrival from "./latearrival";

// export default function PenalisationPolicyMain() {
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showWizard, setShowWizard] = useState(false);
//   const [selectedOptions, setSelectedOptions] = useState([]);
//   const [activeSection, setActiveSection] = useState("Basic information");

//   const sidebarOptions = [
//     "Basic information",
//     "No attendance",
//     "Late arrival",
//     "Work hours",
//   ];

//   const penalisationOptions = [
//     "No Attendance",
//     "Late Arrival",
//     "Missing Logs",
//     "Work Hours",
//   ];

//   const toggleOption = (option) => {
//     if (selectedOptions.includes(option)) {
//       setSelectedOptions(selectedOptions.filter((o) => o !== option));
//     } else {
//       setSelectedOptions([...selectedOptions, option]);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-50 relative overflow-hidden">
//       {/* Sidebar */}
//       <div className="w-64 border-r bg-white flex flex-col">
//         <div className="p-3 border-b">
//           <input
//             type="text"
//             placeholder="Search"
//             className="w-full border rounded text-xs px-2 py-1"
//           />
//         </div>
//         <div className="p-3 text-[10px] font-semibold text-gray-500">
//           ACTIVE PENALISATION POLICIES
//         </div>
//         <div className="flex-1 overflow-y-auto text-xs">
//           {Array.from({ length: 10 }).map((_, i) => (
//             <div
//               key={i}
//               className={`px-3 py-2 border-l-4 hover:bg-gray-50 cursor-pointer ${
//                 i === 0 ? "border-blue-600 bg-blue-50" : "border-transparent"
//               }`}
//             >
//               <div className="font-medium">Policy {i + 1}</div>
//               <div className="text-[10px] text-gray-400">{i + 1} employees</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
//           <div>
//             <h1 className="text-lg font-semibold">Penalisation Policy</h1>
//             <p className="text-xs text-gray-500">
//               You can setup how you wanna penalise your employees here
//             </p>
//           </div>
//           <div className="flex gap-2">
//             <button className="bg-blue-600 text-white text-xs px-3 py-2 rounded">
//               Run Leave Deductions
//             </button>
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="bg-blue-600 text-white text-xs px-3 py-2 rounded"
//             >
//               + Add penalisation policy
//             </button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex items-center gap-4 px-6 py-2 border-b text-xs bg-white">
//           <div className="border-b-2 border-blue-600 pb-1 text-blue-600 cursor-pointer">
//             Summary
//           </div>
//           <div className="text-gray-500 cursor-pointer">Employees</div>
//           <div className="text-gray-500 cursor-pointer">Versions</div>
//         </div>

//         {/* Info Bar */}
//         <div className="mx-6 mt-3 bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-800">
//           You are viewing the current Penalisation Policy version that has been
//           assigned to the employees. If you wish to view all Penalisation Policy
//           versions, go to <span className="underline cursor-pointer">Versions</span>.
//         </div>

//         {/* Content */}
//         <div className="flex-1 flex gap-4 px-6 mt-4 overflow-y-auto">
//           <div className="flex-1 space-y-4">
//             <div className="bg-white p-4 rounded border">
//               <h2 className="text-sm font-semibold">No Attendance</h2>
//               <p className="text-[11px] text-gray-600 mt-1">
//                 PENALIZATION: 1 day leave for every no attendance day.
//               </p>
//             </div>

//             <div className="bg-white p-4 rounded border">
//               <h2 className="text-sm font-semibold">Late Arrival</h2>
//               <div className="grid grid-cols-3 gap-2 text-[11px] mt-2">
//                 <div>
//                   <p className="font-semibold text-gray-700">Instance Based</p>
//                 </div>
//                 <div>
//                   <p>
//                     <span className="text-gray-500">GRACE PERIOD:</span> 0 mins
//                   </p>
//                 </div>
//                 <div>
//                   <p>
//                     <span className="text-gray-500">INSTANCE ALLOWED:</span> 0 late coming/Month
//                   </p>
//                 </div>
//                 <div>
//                   <p>
//                     <span className="text-gray-500">PENALIZATION:</span> 0 day leave for every 1 instance of late arrival
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white p-4 rounded border">
//               <h2 className="text-sm font-semibold">Work Hours</h2>
//               <p className="text-[11px] text-gray-600 mt-1">PENALIZATION: —</p>
//             </div>
//           </div>

//           {/* Right Side - Assign Rule */}
//           <div className="w-72 bg-white rounded border p-4 text-xs h-fit">
//             <div className="flex items-center justify-between">
//               <p className="font-semibold text-gray-700">Assign rule</p>
//               <button className="text-gray-500 text-[10px]">✎</button>
//             </div>
//             <p className="text-gray-500 mt-1 text-[11px]">
//               New employees following this rule will be added to this penalisation policy automatically.
//             </p>

//             <div className="mt-3">
//               <p className="text-[11px] font-semibold">Include:</p>
//               <div className="mt-1 border rounded p-2 text-[11px] bg-gray-50">
//                 Department: <span className="font-medium">Finance_VK</span>
//               </div>
//               <div className="mt-1 border rounded p-2 text-[11px] bg-gray-50">
//                 AND Probation Status: <span className="font-medium">Not In Probation</span>
//               </div>

//               <p className="mt-3 text-[11px] font-semibold">Exclude:</p>
//               <div className="mt-1 border rounded p-2 text-[11px] bg-gray-50">
//                 Probation Status: <span className="font-medium">In Probation</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Step 1: Add Penalisation Modal */}
//       <AnimatePresence>
//         {showAddModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className="bg-white rounded-lg shadow-lg w-[400px] p-5 text-xs"
//             >
//               <h2 className="text-sm font-semibold mb-3">Select Penalisation Types</h2>
//               <div className="space-y-2 mb-4">
//                 {penalisationOptions.map((option) => (
//                   <label key={option} className="flex items-center gap-2 cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={selectedOptions.includes(option)}
//                       onChange={() => toggleOption(option)}
//                       className="accent-blue-600"
//                     />
//                     {option}
//                   </label>
//                 ))}
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button onClick={() => setShowAddModal(false)} className="px-3 py-1 border rounded">
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowAddModal(false);
//                     setShowWizard(true);
//                   }}
//                   className="px-3 py-1 bg-blue-600 text-white rounded"
//                 >
//                   Continue
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Step 2: Full Screen Wizard with Sidebar */}
//       <AnimatePresence>
//         {showWizard && (
//           <motion.div
//             initial={{ y: "100%" }}
//             animate={{ y: 0 }}
//             exit={{ y: "100%" }}
//             transition={{ type: "spring", stiffness: 100, damping: 20 }}
//             className="fixed bottom-0 left-0 right-0 top-0 bg-white z-50 flex flex-col"
//           >
//             <div className="flex items-center justify-between border-b p-4 text-xs">
//               <input
//                 type="text"
//                 placeholder="Enter the policy name here"
//                 className="border rounded px-2 py-1 text-xs w-64"
//               />
//               <h2 className="font-semibold text-sm text-gray-600">Keka Technologies Demo</h2>
//               <button onClick={() => setShowWizard(false)} className="text-gray-500 text-sm">✕</button>
//             </div>

//             <div className="flex flex-1 overflow-hidden">
//               {/* Sidebar */}
//               <div className="w-64 border-r bg-white p-3 overflow-y-auto text-xs">
//                 {sidebarOptions.map((item) => (
//                   <div
//                     key={item}
//                     onClick={() => setActiveSection(item)}
//                     className={`flex items-center gap-2 py-2 px-3 rounded cursor-pointer text-gray-700 hover:bg-blue-50 ${
//                       activeSection === item ? "bg-blue-50 text-blue-700 font-semibold" : ""
//                     }`}
//                   >
//                     {item === "Basic information" && "📄"}
//                     {item === "No attendance" && "🚫"}
//                     {item === "Late arrival" && "⏰"}
//                     {item === "Work hours" && "💼"}
//                     <span>{item}</span>
//                   </div>
//                 ))}
//                 <div className="mt-3 text-blue-600 cursor-pointer text-[11px]">
//                   + Add penalisation methods
//                 </div>
//               </div>

//               {/* Dynamic Config Area */}
//               <div className="flex-1 overflow-y-auto p-6 text-xs">
//                 {activeSection === "Basic information" && (
//                   <div>
//                     <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4 text-[11px] text-yellow-800">
//                       ⚠️ Double Penalty Risk: Attendance & Timesheet Penalisation Overlap — configuring for the same employee on the same day may result in double penalties.
//                     </div>
//                     <div className="bg-white border rounded p-4 mb-4">
//                       <h3 className="text-xs font-semibold mb-2">Policy effective date</h3>
//                       <div className="space-y-1">
//                         <label className="text-[11px]">Effective from</label>
//                         <input type="date" className="border rounded text-[11px] px-2 py-1 w-48" />
//                         <p className="text-gray-400 text-[10px]">
//                           Signifies the date from which the new penalisation policy will be effective for employees.
//                         </p>
//                       </div>
//                     </div>

//                     <div className="bg-white border rounded p-4">
//                       <h3 className="text-xs font-semibold mb-2">Penalty deduction & buffer period</h3>
//                       <div className="space-y-2">
//                         <div>
//                           <label className="text-[11px] font-medium block mb-1">How are penalties deducted?</label>
//                           <div className="flex flex-col gap-1">
//                             <label className="flex items-center gap-2">
//                               <input type="radio" name="deduct" className="accent-blue-600" /> Loss of pay
//                             </label>
//                             <label className="flex items-center gap-2">
//                               <input type="radio" name="deduct" className="accent-blue-600" /> Paid leave
//                             </label>
//                           </div>
//                         </div>
//                         <div>
//                           <label className="text-[11px] font-medium block mb-1">
//                             How many day(s) after the incident should the penalty be applied? (Buffer period)
//                           </label>
//                           <input type="number" className="border rounded text-[11px] px-2 py-1 w-32" />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                   {activeSection === "No attendance" && (
//                  <NoAttendance/>
//                 )}
//    {activeSection === "Late arrival" && (
//                  <LateArrival/>
//                 )}
//                 {/* {activeSection !== "Basic information" && (
//                   <div className="text-gray-500 text-[11px]">
//                     Configuration options for <strong>{activeSection}</strong> will appear here.
//                   </div>
//                 )} */}
//               </div>

//               {/* Help Section */}
//               {activeSection === "Basic information" && ( 
//                   <div className="w-80 border-l bg-gray-50 p-4 text-[11px] overflow-y-auto">
//                 <p className="font-semibold mb-2 text-gray-700 text-xs">What is a buffer period?</p>
//                 <p className="mb-3 text-gray-600 text-xs">
//                   The buffer period provides employees with a window of time to address attendance discrepancies before facing penalties.
//                 </p>
//                 <p className="font-semibold mb-2 text-gray-700 text-xs">How does order of paid leave deduction work?</p>
//                 <p className="mb-3 text-gray-600 text-xs">
//                   The leave deduction order defines the sequence in which an employee's paid leave balances are deducted during penalties.
//                 </p>
//                 <p className="font-semibold mb-2 text-gray-700 text-xs">How does policy effective date work?</p>
//                 <p className="text-gray-600 text-xs">
//                   This is the date from which the policy will come into effect. This is particularly useful for setting future effective dates.
//                 </p>
//               </div>
//                )}
//                 {activeSection === "No attendance" && ( 
//                <div className="w-80 border-l bg-gray-50 p-4 text-[11px] overflow-y-auto">
//       <p className="font-semibold mb-2 text-gray-700 text-xs">
//         What is a no attendance penalty?
//       </p>
//       <p className="mb-3 text-gray-600 text-xs">
//         This refers to the situation when employees have no attendance logged.
//       </p>

//       <p className="font-semibold mb-2 text-gray-700 text-xs">
//         What is adjoining holiday & week off penalty?
//       </p>
//       <p className="mb-3 text-gray-600 text-xs">
//         If an employee has no attendance before / after or in-between holidays and week-offs,
//         configure the settings to apply penalties. For e.g., an employee hasn’t logged any
//         attendance on Friday holiday (1st Jan), upon enabling this setting and selecting
//         “right before the holiday” option, the following Saturday (2nd Jan) and Sunday (3rd Jan)
//         will also be penalised for non-attendance.
//       </p>

//       <p className="font-semibold mb-2 text-gray-700 text-xs">
//         Can notifications be sent for no attendance without penalising employees for their absence?
//       </p>
//       <p className="text-gray-600 text-xs">
//         To do so, you can set deduction value to 0. The system will still send irregularity mails
//         for missed attendance without applying any deductions.
//       </p>
//     </div>
//                )}
//                 {activeSection === "Late arrival" && ( 
//                  <LateArrivalInfo/>
//                )}

            
//             </div>

//             <div className="border-t p-4 flex justify-end gap-2 bg-white">
//               <button onClick={() => setShowWizard(false)} className="px-3 py-1 border rounded">
//                 Discard Changes
//               </button>
//               <button onClick={() => setShowWizard(false)} className="px-3 py-1 bg-blue-600 text-white rounded">
//                 Save
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NoAttendance from "./noattendance";
import LateArrival from "./latearrival";
import { Button } from "@/components/ui/button";

export default function PenalisationPolicyMain({
  policies = [],
  employees = [],
  setPolicies,
}: {
  policies: any[];
  employees: any[];
  setPolicies: (p: any[]) => void;
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState("Basic information");
  const [activeTab, setActiveTab] = useState("Summary");
  const [newPolicyName, setNewPolicyName] = useState("");
  const [selected, setSelected] = useState<string | null>(
    policies.length > 0 ? policies[0].name : null
  );

  const sidebarOptions = [
    "Basic information",
    "No attendance",
    "Late arrival",
    "Work hours",
  ];

  const penalisationOptions = [
    "No Attendance",
    "Late Arrival",
    "Missing Logs",
    "Work Hours",
  ];

  // 🔁 Recalculate employee counts dynamically whenever employees change
  useEffect(() => {
    const updated = policies.map((policy) => ({
      ...policy,
      employees: employees.filter(
        (emp) => emp.penalizationPolicy === policy.name
      ).length,
      employeeList: employees.filter(
        (emp) => emp.penalizationPolicy === policy.name
      ),
    }));
    setPolicies(updated);
  }, [employees]);

  // ✅ Save handler to create new policy and update sidebar instantly
  const handleSavePolicy = () => {
    if (!newPolicyName.trim()) {
      alert("Please enter a policy name before saving.");
      return;
    }

    const newPolicy = {
      name: newPolicyName.trim(),
      penalisationTypes: selectedOptions,
      employees: 0,
      employeeList: [],
      default: false,
    };

    const updated = [...policies, newPolicy];
    setPolicies(updated);

    setSelected(newPolicy.name);
    setShowWizard(false);
    setSelectedOptions([]);
    setNewPolicyName("");
  };

  const selectedPolicy = policies.find((p) => p.name === selected);

  const policyEmployees =
    employees.filter((e) => e.penalizationPolicy === selected) || [];

  return (
    <div className="flex h-screen bg-gray-50 relative overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white flex flex-col">
        <div className="p-3 border-b">
          <input
            type="text"
            placeholder="Search"
            className="w-full border rounded text-xs px-2 py-1"
          />
        </div>
        <div className="p-3 text-[10px] font-semibold text-gray-500">
          ACTIVE PENALISATION POLICIES
        </div>
        <div className="flex-1 overflow-y-auto text-xs">
          {policies.length === 0 ? (
            <p className="px-3 text-gray-400 text-[11px]">
              No penalisation policies yet.
            </p>
          ) : (
            policies.map((p) => (
              <button
                key={p.name}
                onClick={() => {
                  setSelected(p.name);
                  setActiveTab("Summary");
                }}
                className={`w-full text-left px-3 py-2 border-l-4 cursor-pointer hover:bg-gray-50 ${
                  selected === p.name
                    ? "border-blue-600 bg-blue-50"
                    : "border-transparent"
                }`}
              >
                <div className="font-medium">{p.name}</div>
                <div className="text-[10px] text-gray-400">
                  {p.employees || 0} employees
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
          <div>
            <h1 className="text-lg font-semibold">Penalisation Policy</h1>
            <p className="text-xs text-gray-500">
              Setup how you want to penalise your employees here.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white text-xs px-3 py-2 rounded">
              Run Leave Deductions
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white text-xs px-3 py-2 rounded"
            >
              + Add penalisation policy
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 px-6 py-2 border-b text-xs bg-white">
          {["Summary", "Employees", "Versions"].map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer pb-1 ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Info Bar */}
        <div className="mx-6 mt-3 bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-800">
          You are viewing the current Penalisation Policy version that has been
          assigned to the employees.
        </div>

        {/* Main Tab Content */}
        <div className="flex-1 flex flex-col px-6 mt-4 overflow-y-auto">
          {/* SUMMARY TAB */}
          {activeTab === "Summary" && (
            <div className="flex gap-4">
              <div className="flex-1 space-y-4">
                {selected ? (
                  <div className="bg-white p-4 rounded border">
                    <h2 className="text-sm font-semibold">{selected}</h2>
                    <p className="text-[11px] text-gray-600 mt-1">
                      Penalisation Types:{" "}
                      {selectedPolicy?.penalisationTypes?.join(", ") || "—"}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 text-xs">
                    Select a policy from the sidebar to view details.
                  </p>
                )}
              </div>

              {/* Right Side - Assign Rule */}
              <div className="w-72 bg-white rounded border p-4 text-xs h-fit">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-700">Assign rule</p>
                  <button className="text-gray-500 text-[10px]">✎</button>
                </div>
                <p className="text-gray-500 mt-1 text-[11px]">
                  New employees following this rule will be added automatically.
                </p>
              </div>
            </div>
          )}

          {/* EMPLOYEES TAB */}
          {activeTab === "Employees" && (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold mt-2">
                Employees under this policy
              </h2>
              {policyEmployees.length === 0 ? (
                <p className="text-gray-400 text-xs mt-2">
                  No employees assigned to this policy yet.
                </p>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 border-b">
                      <tr className="text-left">
                        <th className="p-2">Employee Name</th>
                        <th className="p-2">Emp No</th>
                        <th className="p-2">Department</th>
                        <th className="p-2">Location</th>
                        <th className="p-2">Manager</th>
                      </tr>
                    </thead>
                    <tbody>
                      {policyEmployees.map((emp) => (
                        <tr key={emp.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">{emp.name}</td>
                          <td className="p-2">{emp.empNo}</td>
                          <td className="p-2">{emp.department}</td>
                          <td className="p-2">{emp.location}</td>
                          <td className="p-2">{emp.manager}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* VERSIONS TAB (placeholder) */}
          {activeTab === "Versions" && (
            <div className="text-xs text-gray-500 mt-3">
              Version history and audit logs will appear here.
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-lg w-[400px] p-5 text-xs"
            >
              <h2 className="text-sm font-semibold mb-3">
                Select Penalisation Types
              </h2>
              <div className="space-y-2 mb-4">
                {penalisationOptions.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedOptions.includes(option)}
                      onChange={() =>
                        setSelectedOptions((prev) =>
                          prev.includes(option)
                            ? prev.filter((o) => o !== option)
                            : [...prev, option]
                        )
                      }
                      className="accent-blue-600"
                    />
                    {option}
                  </label>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowWizard(true);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wizard */}
      <AnimatePresence>
        {showWizard && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed bottom-0 left-0 right-0 top-0 bg-white z-50 flex flex-col"
          >
            <div className="flex items-center justify-between border-b p-4 text-xs">
              <input
                type="text"
                placeholder="Enter the policy name here"
                value={newPolicyName}
                onChange={(e) => setNewPolicyName(e.target.value)}
                className="border rounded px-2 py-1 text-xs w-64"
              />
              <h2 className="font-semibold text-sm text-gray-600">
                Keka Technologies Demo
              </h2>
              <button
                onClick={() => setShowWizard(false)}
                className="text-gray-500 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-64 border-r bg-white p-3 overflow-y-auto text-xs">
                {sidebarOptions.map((item) => (
                  <div
                    key={item}
                    onClick={() => setActiveSection(item)}
                    className={`flex items-center gap-2 py-2 px-3 rounded cursor-pointer text-gray-700 hover:bg-blue-50 ${
                      activeSection === item
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : ""
                    }`}
                  >
                    {item === "Basic information" && "📄"}
                    {item === "No attendance" && "🚫"}
                    {item === "Late arrival" && "⏰"}
                    {item === "Work hours" && "💼"}
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Dynamic Config Area */}
              <div className="flex-1 overflow-y-auto p-6 text-xs">
                {activeSection === "Basic information" && (
                  <div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4 text-[11px] text-yellow-800">
                      ⚠️ Double Penalty Risk: Attendance & Timesheet Penalisation Overlap.
                    </div>
                  </div>
                )}
                {activeSection === "No attendance" && <NoAttendance />}
                {activeSection === "Late arrival" && <LateArrival />}
              </div>
            </div>

            <div className="border-t p-4 flex justify-end gap-2 bg-white">
              <button
                onClick={() => setShowWizard(false)}
                className="px-3 py-1 border rounded"
              >
                Discard
              </button>
              <button
                onClick={handleSavePolicy}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

