
// // "use client";

// // import { useState } from "react";
// // import { Plus, Fingerprint, MapPin, Smartphone } from "lucide-react";
// // import { cn } from "@/lib/utils";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { motion } from "framer-motion";
// // import AttendanceWizard from "./captureschemewizard";
// // import AssignmentRuleModal from "./assignmentrulemodal";
// // export default function CaptureScheme() {
// //   const [selected, setSelected] = useState("Attendance Capture Scheme");
// //   const [showModal, setShowModal] = useState(false);
// //   const [step, setStep] = useState(1);
// //   const [showWizard, setShowWizard] = useState(false);
// //   // ✅ Moved schemes into state so we can update dynamically
// //   const [schemes, setSchemes] = useState([
// //     { name: "Attendance Capture Scheme", employees: 0 },
// //     { name: "India-Capture Scheme", employees: 80, default: true },
// //     { name: "Remote Employees", employees: 11 },
// //     { name: "SEA-Capture Scene", employees: 9 },
// //     { name: "UK-Capture Scheme", employees: 22 },
// //     { name: "US-Capture Scheme", employees: 21 },
// //   ]);
// // const [captureSchemes, setCaptureSchemes] = useState(schemes);
// //   const [showRuleModal, setShowRuleModal] = useState(false);

// //   // ✅ store answers for 3 steps
// //   const [answers, setAnswers] = useState({
// //     biometric: null,
// //     remote: null,
// //     mobile: null,
// //   });

 


// //   const steps = [
// //     {
// //       key: "biometric",
// //       icon: <Fingerprint className="w-12 h-12 text-blue-500" />,
// //       title: "Do you capture attendance via bio-metric devices?",
// //       description: "Attendance will be captured through bio-metric devices set at your location.",
// //     },
// //     {
// //       key: "remote",
// //       icon: <MapPin className="w-12 h-12 text-green-500" />,
// //       title: "Do your employees work remotely?",
// //       description:
// //         "Remote work is when an employee works from places like home, location, etc. instead of office.",
// //     },
// //     {
// //       key: "mobile",
// //       icon: <Smartphone className="w-12 h-12 text-pink-500" />,
// //       title: "Do you also want to capture attendance via Cubicle mobile app?",
// //       description:
// //         "Useful when you have field employees whose location needs to be captured.",
// //     },
// //   ];

// //   const current = steps[step - 1];

// //   const handleSaveRule = (ruleData) => {
// //     console.log("Saved rule:", ruleData);
// //     setShowRuleModal(false);
// //   };

// //   const handleAnswer = (key, value) => {
// //     setAnswers((prev) => ({ ...prev, [key]: value }));

// //     if (step < steps.length) {
// //       setStep(step + 1);
// //     } else {
// //       // Finished — open wizard
// //       setShowModal(false);
// //       setStep(1);
// //       setTimeout(() => setShowWizard(true), 300);
// //     }
// //   };
// //   // 🔹 Callback from AttendanceWizard (when Save is clicked)
// //  const handleSavePolicy = (newScheme) => {
// //   setCaptureSchemes((prev) => [...prev, newScheme]);   
// //   setSelected(newScheme.name);
// //    setShowWizard(false);
// //  };

// //   return (
// //     <>
// //       <div className="flex gap-4">
// //         {/* Sidebar */}
// //         <div className="w-[240px] bg-white border rounded-lg p-3 h-fit">
// //           <input
// //             type="text"
// //             placeholder="Search"
// //             className="w-full text-[12px] border rounded-md px-2 py-1 mb-3 focus:outline-none"
// //           />

// //           <div className="space-y-[6px] text-[12px]">
// //             {captureSchemes.map((s) => (
// //               <button
// //                 key={s.name}
// //                 onClick={() => setSelected(s.name)}
// //                 className={cn(
// //                   "w-full flex justify-between items-center rounded-md px-2 py-1.5 text-left",
// //                   selected === s.name
// //                     ? "bg-blue-50 text-blue-600 font-medium"
// //                     : "hover:bg-gray-50"
// //                 )}
// //               >
// //                 <span>{s.name}</span>
// //                 <span className="text-gray-500">{s.employees} employees</span>
// //                 {s.default && (
// //                   <span className="text-[10px] ml-1 text-gray-400">DEFAULT</span>
// //                 )}
// //               </button>
// //             ))}
// //           </div>
// //         </div>

// //         {/* Main Section */}
// //         <div className="flex-1 bg-white border rounded-lg p-4">
// //           <div className="flex justify-between items-center mb-3">
// //             <h2 className="text-[13px] font-medium">Attendance Capture Scheme</h2>
// //             <button
// //               onClick={() => setShowModal(true)}
// //               className="flex items-center gap-1 text-[12px] bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-2 py-1 rounded-md"
// //             >
// //               <Plus className="w-3 h-3" />
// //               Add Attendance Capture
// //             </button>
// //           </div>

// //           {/* Tabs */}
// //           <div className="flex border-b mb-3 text-[12px]">
// //             <button className="border-b-2 border-blue-600 text-blue-600 pb-1 px-2">
// //               Summary
// //             </button>
// //             <button className="px-2 text-gray-500 hover:text-gray-700">Employees</button>
// //           </div>

// //           {/* Summary */}
// //           <div className="text-[12px] space-y-4">
// //             <div>
// //               <p className="font-medium text-gray-700 mb-1 text-xs">Capture Mode</p>
// //               <div className="space-y-1">
// //                 <p className="text-xs">🔴 Web clock in</p>
// //                 <p className="text-xs">🟢 Remote clock in (Captures Location)</p>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Rule Section */}
// //         <div className="w-[230px] bg-white border rounded-lg p-3 text-[12px]">
// //           <p className="font-medium text-gray-700 mb-2 text-xs">Rule based assignment</p>
// //           <p className="text-gray-500 mb-3 leading-tight text-xs">
// //             Employees following this rule will be added to this capture scheme
// //             policy automatically.
// //           </p>
// //           <div className="border rounded-lg flex flex-col items-center justify-center py-8 mb-3">
// //             <div className="bg-gray-100 w-10 h-10 rounded-md flex items-center justify-center text-lg font-bold text-gray-600">
// //               C
// //             </div>
// //           </div>
// //           <button   onClick={() => setShowRuleModal(true)} className="text-[12px] border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-50">
// //             Add rule
// //           </button>
// //         </div>
// //       </div>

// //       {/* Step Modal */}
// //       {showModal && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
// //           <Card className="w-[360px] rounded-2xl shadow-lg relative">
// //             <CardContent className="p-6 flex flex-col items-center text-center">
// //               {/* Progress */}
// //               <div className="flex items-center justify-center gap-2 mb-6">
// //                 {steps.map((_, idx) => (
// //                   <div
// //                     key={idx}
// //                     className={`h-1.5 w-8 rounded-full ${
// //                       idx < step ? "bg-blue-500" : "bg-gray-200"
// //                     }`}
// //                   ></div>
// //                 ))}
// //               </div>

// //               {/* Icon */}
// //               <motion.div
// //                 key={step}
// //                 initial={{ opacity: 0, y: 10 }}
// //                 animate={{ opacity: 1, y: 0 }}
// //                 className="mb-4"
// //               >
// //                 {current.icon}
// //               </motion.div>

// //               {/* Title */}
// //               <h2 className="text-sm font-medium mb-2">{current.title}</h2>

// //               {/* Description */}
// //               <p className="text-gray-500 text-xs mb-6">{current.description}</p>

// //               {/* Buttons */}
// //               <div className="flex gap-3">
// //                 <Button
// //                   size="sm"
// //                   className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-5"
// //                   onClick={() => handleAnswer(current.key, true)}
// //                 >
// //                   Yes
// //                 </Button>
// //                 <Button
// //                   size="sm"
// //                   variant="outline"
// //                   className="text-xs px-5"
// //                   onClick={() => handleAnswer(current.key, false)}
// //                 >
// //                   No
// //                 </Button>
// //               </div>

// //               {/* Close */}
// //               <button
// //                 onClick={() => setShowModal(false)}
// //                 className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-sm"
// //               >
// //                 ✕
// //               </button>
// //             </CardContent>
// //           </Card>
// //         </div>
// //       )}

// //       {/* Wizard Drawer */}
// //       <AttendanceWizard
// //         open={showWizard}
// //         onClose={() => setShowWizard(false)}
// //         selectedAnswers={answers}
// //         onSave={handleSavePolicy} // 🔹 Pass callback
// //       />
// //        <AssignmentRuleModal
// //         open={showRuleModal}
// //         onClose={() => setShowRuleModal(false)}
// //         onSave={handleSaveRule}
// //       />
// //     </>
// //   );
// // }


// "use client";

// import { useState } from "react";
// import { Plus, Fingerprint, MapPin, Smartphone } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { motion } from "framer-motion";
// import AttendanceWizard from "./captureschemewizard";
// import AssignmentRuleModal from "./assignmentrulemodal";

// export default function CaptureScheme() {
//   const [selected, setSelected] = useState("Attendance Capture Scheme");
//   const [showModal, setShowModal] = useState(false);
//   const [step, setStep] = useState(1);
//   const [showWizard, setShowWizard] = useState(false);
//   const [activeTab, setActiveTab] = useState<"Summary" | "Employees">("Summary");
//   const [showRuleModal, setShowRuleModal] = useState(false);

//   const [schemes, setSchemes] = useState([
//     { name: "Attendance Capture Scheme", employees: 0 },
//     { name: "India-Capture Scheme", employees: 80, default: true },
//     { name: "Remote Employees", employees: 11 },
//     { name: "SEA-Capture Scene", employees: 9 },
//     { name: "UK-Capture Scheme", employees: 22 },
//     { name: "US-Capture Scheme", employees: 21 },
//   ]);
//   const [captureSchemes, setCaptureSchemes] = useState(schemes);

//   const [answers, setAnswers] = useState({
//     biometric: null,
//     remote: null,
//     mobile: null,
//   });

//   const steps = [
//     {
//       key: "biometric",
//       icon: <Fingerprint className="w-12 h-12 text-primary" />,
//       title: "Do you capture attendance via bio-metric devices?",
//       description:
//         "Attendance will be captured through bio-metric devices set at your location.",
//     },
//     {
//       key: "remote",
//       icon: <MapPin className="w-12 h-12 text-primary" />,
//       title: "Do your employees work remotely?",
//       description:
//         "Remote work is when an employee works from places like home, location, etc. instead of office.",
//     },
//     {
//       key: "mobile",
//       icon: <Smartphone className="w-12 h-12 text-primary" />,
//       title: "Do you also want to capture attendance via mobile app?",
//       description:
//         "Useful when you have field employees whose location needs to be captured.",
//     },
//   ];

//   const current = steps[step - 1];

//   const handleSaveRule = (ruleData: any) => {
//     console.log("Saved rule:", ruleData);
//     setShowRuleModal(false);
//   };

//   const handleAnswer = (key: string, value: boolean) => {
//     setAnswers((prev) => ({ ...prev, [key]: value }));
//     if (step < steps.length) setStep(step + 1);
//     else {
//       setShowModal(false);
//       setStep(1);
//       setTimeout(() => setShowWizard(true), 300);
//     }
//   };

//   const handleSavePolicy = (newScheme: any) => {
//     setCaptureSchemes((prev) => [...prev, newScheme]);
//     setSelected(newScheme.name);
//     setShowWizard(false);
//   };

//   // 🔹 Static employee data
//   const employees = [
//     {
//       empNo: "1",
//       name: "Fixl Admin",
//       department: "Not Available",
//       jobTitle: "Not Available",
//       reportingTo: "Not Available",
//       location: "Head Office",
//     },
//     {
//       empNo: "FS001",
//       name: "Shashank Sharma",
//       department: "Administration",
//       jobTitle: "Director",
//       reportingTo: "Not Available",
//       location: "Head Office",
//     },
//     {
//       empNo: "FS007",
//       name: "Manish Choudhary",
//       department: "Operations",
//       jobTitle: "Senior Frontend Developer",
//       reportingTo: "Not Available",
//       location: "Head Office",
//     },
//     {
//       empNo: "FS009",
//       name: "Shubham Singh",
//       department: "Operations",
//       jobTitle: "Quality Analyst",
//       reportingTo: "Not Available",
//       location: "Head Office",
//     },
//     {
//       empNo: "FS012",
//       name: "Rammi Sharma",
//       department: "Operations",
//       jobTitle: "Designer",
//       reportingTo: "Not Available",
//       location: "Head Office",
//     },
//     {
//       empNo: "FS015",
//       name: "Riyanshi Sharma",
//       department: "Human Resource",
//       jobTitle: "Human Resource Manager",
//       reportingTo: "Not Available",
//       location: "Head Office",
//     },
//     {
//       empNo: "FS016",
//       name: "Nainy Verma",
//       department: "Human Resource",
//       jobTitle: "Human Resource Executive",
//       reportingTo: "Not Available",
//       location: "Head Office",
//     },
//   ];

//   return (
//     <>
//       <div className="flex gap-4">
//         {/* Sidebar */}
//         <div className="w-[240px] bg-white border rounded-lg p-3 h-fit">
//           <input
//             type="text"
//             placeholder="Search"
//             className="w-full text-[12px] border rounded-md px-2 py-1 mb-3 focus:outline-none"
//           />
//           <div className="space-y-[6px] text-[12px]">
//             {captureSchemes.map((s) => (
//               <button
//                 key={s.name}
//                 onClick={() => setSelected(s.name)}
//                 className={cn(
//                   "w-full flex justify-between items-center rounded-md px-2 py-1.5 text-left",
//                   selected === s.name
//                     ? "bg-primary/10 text-primary font-medium"
//                     : "hover:bg-gray-50"
//                 )}
//               >
//                 <span>{s.name}</span>
//                 <span className="text-gray-500">{s.employees} employees</span>
//                 {s.default && (
//                   <span className="text-[10px] ml-1 text-gray-400">DEFAULT</span>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Main Section */}
//         <div className="flex-1 bg-white border rounded-lg p-4">
//           <div className="flex justify-between items-center mb-3">
//             <h2 className="text-[13px] font-medium">Attendance Capture Scheme</h2>
//             <button
//               onClick={() => setShowModal(true)}
//               className="flex items-center gap-1 text-[12px] bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-2 py-1 rounded-md"
//             >
//               <Plus className="w-3 h-3" />
//               Add Attendance Capture
//             </button>
//           </div>

//           {/* Tabs */}
//           <div className="flex border-b mb-3 text-[12px]">
//             {["Summary", "Employees"].map((tab) => (
//               <button
//                 key={tab}
//                 className={cn(
//                   "pb-1 px-2",
//                   activeTab === tab
//                     ? "border-b-2 border-primary text-primary font-medium"
//                     : "text-gray-500 hover:text-gray-700"
//                 )}
//                 onClick={() => setActiveTab(tab as any)}
//               >
//                 {tab}
//               </button>
//             ))}
//           </div>

//           {/* Tab content */}
//           {activeTab === "Summary" ? (
//             <div className="text-[12px] space-y-4">
//               <div>
//                 <p className="font-medium text-gray-700 mb-1 text-xs">
//                   Capture Mode
//                 </p>
//                 <div className="space-y-1">
//                   <p className="text-xs">🔴 Web clock in</p>
//                   <p className="text-xs">
//                     🟢 Remote clock in (Captures Location)
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-xs border-collapse">
//                 <thead>
//                   <tr className="bg-gray-50 text-gray-700 text-[11px]">
//                     <th className="text-left px-3 py-2 border">EMPLOYEE NUMBER</th>
//                     <th className="text-left px-3 py-2 border">EMPLOYEE NAME</th>
//                     <th className="text-left px-3 py-2 border">DEPARTMENT</th>
//                     <th className="text-left px-3 py-2 border">JOB TITLE</th>
//                     <th className="text-left px-3 py-2 border">REPORTING TO</th>
//                     <th className="text-left px-3 py-2 border">LOCATION</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {employees.map((emp, idx) => (
//                     <tr key={idx} className="border-b hover:bg-gray-50">
//                       <td className="px-3 py-2">{emp.empNo}</td>
//                       <td className="px-3 py-2 text-primary cursor-pointer">
//                         {emp.name}
//                       </td>
//                       <td className="px-3 py-2">{emp.department}</td>
//                       <td className="px-3 py-2">{emp.jobTitle}</td>
//                       <td className="px-3 py-2">{emp.reportingTo}</td>
//                       <td className="px-3 py-2">{emp.location}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {/* Rule Section */}
//         <div className="w-[230px] bg-white border rounded-lg p-3 text-[12px]">
//           <p className="font-medium text-gray-700 mb-2 text-xs">
//             Rule based assignment
//           </p>
//           <p className="text-gray-500 mb-3 leading-tight text-xs">
//             Employees following this rule will be added to this capture scheme
//             policy automatically.
//           </p>
//           <div className="border rounded-lg flex flex-col items-center justify-center py-8 mb-3">
//             <div className="bg-gray-100 w-10 h-10 rounded-md flex items-center justify-center text-lg font-bold text-gray-600">
//               C
//             </div>
//           </div>
//           <button
//             onClick={() => setShowRuleModal(true)}
//             className="text-[12px] border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-50"
//           >
//             Add rule
//           </button>
//         </div>
//       </div>

//       {/* Step Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <Card className="w-[360px] rounded-2xl shadow-lg relative">
//             <CardContent className="p-6 flex flex-col items-center text-center">
//               {/* Progress */}
//               <div className="flex items-center justify-center gap-2 mb-6">
//                 {steps.map((_, idx) => (
//                   <div
//                     key={idx}
//                     className={`h-1.5 w-8 rounded-full ${
//                       idx < step ? "bg-primary" : "bg-gray-200"
//                     }`}
//                   ></div>
//                 ))}
//               </div>

//               <motion.div
//                 key={step}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="mb-4"
//               >
//                 {current.icon}
//               </motion.div>

//               <h2 className="text-sm font-medium mb-2">{current.title}</h2>
//               <p className="text-gray-500 text-xs mb-6">{current.description}</p>

//               <div className="flex gap-3">
//                 <Button
//                   size="sm"
//                   className="bg-primary hover:bg-primary/90 text-white text-xs px-5"
//                   onClick={() => handleAnswer(current.key, true)}
//                 >
//                   Yes
//                 </Button>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   className="text-xs px-5"
//                   onClick={() => handleAnswer(current.key, false)}
//                 >
//                   No
//                 </Button>
//               </div>

//               <button
//                 onClick={() => setShowModal(false)}
//                 className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-sm"
//               >
//                 ✕
//               </button>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* Wizard Drawer */}
//       <AttendanceWizard
//         open={showWizard}
//         onClose={() => setShowWizard(false)}
//         selectedAnswers={answers}
//         onSave={handleSavePolicy}
//       />
//       <AssignmentRuleModal
//         open={showRuleModal}
//         onClose={() => setShowRuleModal(false)}
//         onSave={handleSaveRule}
//       />
//     </>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Plus, Fingerprint, MapPin, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import AttendanceWizard from "./captureschemewizard";
import AssignmentRuleModal from "./assignmentrulemodal";

interface Employee {
  empNo: string;
  name: string;
  department: string;
  jobTitle: string;
  reportingTo: string;
  location: string;
  captureScheme?: string;
}

interface Policy {
  name: string;
  employees: number;
  default?: boolean;
  employeeList: Employee[];
}

interface CaptureSchemeProps {
  policies: Policy[];
  employees: Employee[]; // ✅ Added this
  onAddPolicy?: (newPolicy: Policy) => void;
  setPolicies?: (schemes: Policy[]) => void;
  onUpdateSchemes?: (updatedEmployees: Employee[], schemeName: string) => void;
}

export default function CaptureScheme({
  policies,
  employees,
  onAddPolicy,
  setPolicies,
}: CaptureSchemeProps) {
  const [selected, setSelected] = useState(policies?.[0]?.name || "");
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [showWizard, setShowWizard] = useState(false);
  const [activeTab, setActiveTab] = useState<"Summary" | "Employees">("Summary");
  const [showRuleModal, setShowRuleModal] = useState(false);

  const [answers, setAnswers] = useState({
    biometric: null,
    remote: null,
    mobile: null,
  });

  const steps = [
    {
      key: "biometric",
      icon: <Fingerprint className="w-12 h-12 text-primary" />,
      title: "Do you capture attendance via bio-metric devices?",
      description: "Attendance will be captured through bio-metric devices set at your location.",
    },
    {
      key: "remote",
      icon: <MapPin className="w-12 h-12 text-primary" />,
      title: "Do your employees work remotely?",
      description: "Remote work is when an employee works from places like home, location, etc. instead of office.",
    },
    {
      key: "mobile",
      icon: <Smartphone className="w-12 h-12 text-primary" />,
      title: "Do you also want to capture attendance via mobile app?",
      description: "Useful when you have field employees whose location needs to be captured.",
    },
  ];

  const current = steps[step - 1];

  // 🧠 Sync employee data with schemes dynamically
  useEffect(() => {
    if (!employees?.length || !setPolicies) return;

    console.log("🔁 Recalculating capture schemes based on updated employees...");

    const updatedSchemes = policies.map((scheme) => {
      const assignedEmployees = employees.filter(
        (emp) => emp.captureScheme === scheme.name
      );

      return {
        ...scheme,
        employees: assignedEmployees.length,
        employeeList: assignedEmployees,
      };
    });

    console.log("✅ Updated schemes:", updatedSchemes);
    setPolicies(updatedSchemes);
  }, [employees]);

  const handleSaveRule = (ruleData: any) => {
    console.log("📋 Saved rule:", ruleData);
    setShowRuleModal(false);
  };

  const handleAnswer = (key: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (step < steps.length) setStep(step + 1);
    else {
      setShowModal(false);
      setStep(1);
      setTimeout(() => setShowWizard(true), 300);
    }
  };

  const handleSavePolicy = (newScheme: any) => {
    console.log("🆕 New Scheme Added:", newScheme);

    const newPolicy: Policy = {
      ...newScheme,
      employees: 0,
      employeeList: [],
    };

    // Add to parent state (if provided)
    onAddPolicy?.(newPolicy);

    // Update local policy list (so sidebar updates immediately)
    setPolicies?.((prev: any[]) => [...prev, newPolicy]);

    // Select the newly added policy
    setSelected(newScheme.name);

    // Close the modal
    setShowWizard(false);
  };

  const selectedPolicy = policies.find((p) => p.name === selected);

  return (
    <>
      <div className="flex gap-4">
        {/* Sidebar */}
        <div className="w-[240px] bg-white border rounded-lg p-3 h-fit">
          <input
            type="text"
            placeholder="Search"
            className="w-full text-[12px] border rounded-md px-2 py-1 mb-3 focus:outline-none"
          />
          <div className="space-y-[6px] text-[12px]">
            {policies.map((s) => (
              <button
                key={s.name}
                onClick={() => setSelected(s.name)}
                className={cn(
                  "w-full flex justify-between items-center rounded-md px-2 py-1.5 text-left",
                  selected === s.name
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-gray-50"
                )}
              >
                <span>{s.name}</span>
                <span className="text-gray-500">{s.employees} employees</span>
                {s.default && (
                  <span className="text-[10px] ml-1 text-gray-400">DEFAULT</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Section */}
        <div className="flex-1 bg-white border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-[13px] font-medium">{selected}</h2>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1 text-[12px] bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-2 py-1 rounded-md"
            >
              <Plus className="w-3 h-3" />
              Add Attendance Capture
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-3 text-[12px]">
            {["Summary", "Employees"].map((tab) => (
              <button
                key={tab}
                className={cn(
                  "pb-1 px-2",
                  activeTab === tab
                    ? "border-b-2 border-primary text-primary font-medium"
                    : "text-gray-500 hover:text-gray-700"
                )}
                onClick={() => setActiveTab(tab as any)}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Summary" ? (
            <div className="text-[12px] space-y-4">
              <p className="font-medium text-gray-700 mb-1 text-xs">
                Capture Mode
              </p>
              <p className="text-xs">🔴 Web clock in</p>
              <p className="text-xs">🟢 Remote clock in (Captures Location)</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 text-[11px]">
                    <th className="text-left px-3 py-2 border">EMPLOYEE NUMBER</th>
                    <th className="text-left px-3 py-2 border">EMPLOYEE NAME</th>
                    <th className="text-left px-3 py-2 border">DEPARTMENT</th>
                    <th className="text-left px-3 py-2 border">JOB TITLE</th>
                    <th className="text-left px-3 py-2 border">REPORTING TO</th>
                    <th className="text-left px-3 py-2 border">LOCATION</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPolicy?.employeeList?.length ? (
                    selectedPolicy.employeeList.map((emp, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="px-3 py-2">{emp.id}</td>
                        <td className="px-3 py-2 text-primary cursor-pointer">
                          {emp.name}
                        </td>
                        <td className="px-3 py-2">{emp.department}</td>
                        <td className="px-3 py-2">{emp.jobTitle}</td>
                        <td className="px-3 py-2">{emp.reportingTo}</td>
                        <td className="px-3 py-2">{emp.location}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center text-gray-400 py-6">
                        No employees assigned to this policy yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Rule Section */}
        <div className="w-[230px] bg-white border rounded-lg p-3 text-[12px]">
          <p className="font-medium text-gray-700 mb-2 text-xs">
            Rule based assignment
          </p>
          <p className="text-gray-500 mb-3 leading-tight text-xs">
            Employees following this rule will be added to this capture scheme
            policy automatically.
          </p>
          <div className="border rounded-lg flex flex-col items-center justify-center py-8 mb-3">
            <div className="bg-gray-100 w-10 h-10 rounded-md flex items-center justify-center text-lg font-bold text-gray-600">
              C
            </div>
          </div>
          <button
            onClick={() => setShowRuleModal(true)}
            className="text-[12px] border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-50"
          >
            Add rule
          </button>
        </div>
      </div>

      {/* Step Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[360px] rounded-2xl shadow-lg relative">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 w-8 rounded-full ${
                      idx < step ? "bg-primary" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                {current.icon}
              </motion.div>
              <h2 className="text-sm font-medium mb-2">{current.title}</h2>
              <p className="text-gray-500 text-xs mb-6">{current.description}</p>
              <div className="flex gap-3">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white text-xs px-5"
                  onClick={() => handleAnswer(current.key, true)}
                >
                  Yes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs px-5"
                  onClick={() => handleAnswer(current.key, false)}
                >
                  No
                </Button>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-sm"
              >
                ✕
              </button>
            </CardContent>
          </Card>
        </div>
      )}

      <AttendanceWizard
        open={showWizard}
        onClose={() => setShowWizard(false)}
        selectedAnswers={answers}
        onSave={handleSavePolicy}
      />
      <AssignmentRuleModal
        open={showRuleModal}
        onClose={() => setShowRuleModal(false)}
        onSave={handleSaveRule}
      />
    </>
  );
}
