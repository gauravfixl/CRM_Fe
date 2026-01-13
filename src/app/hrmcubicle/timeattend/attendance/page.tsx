"use client";

import { useState } from "react";
import CaptureScheme from "@/components/hrm/timeattend/atttendancetracking/capturescheme";
import CaptureSchemeAllocation from "@/components/hrm/timeattend/atttendancetracking/captureschemeallocation";
import PenalisationPolicyMain from "@/components/hrm/timeattend/atttendancetracking/penalizationpolicy";
import PenalizationPolicyAllocation from "@/components/hrm/timeattend/atttendancetracking/penalisationpolicyallocation";
import BulkPenaltyManagement from "@/components/hrm/timeattend/atttendancetracking/bulkattendancetracking";

const tabs = [
  "Capture Scheme",
  "Capture Scheme Allocation",
  "Penalization Policy",
  "Penalization Policy Allocation",
  "Bulk Penalty Management",
];

export default function HRMPage() {
  const [employees, setEmployees] = useState([
    { id: "E001", name: "Amit Kumar", department: "Sales", jobTitle: "Manager", reportingTo: "Rita Sharma", location: "Delhi" },
    { id: "E002", name: "Priya Singh", department: "HR", jobTitle: "Executive", reportingTo: "Vikas Yadav", location: "Pune" },
  ]);

  const [captureSchemes, setCaptureSchemes] = useState<any[]>([
    { name: "Office Biometric", employees: 0, employeeList: [] },
  ]);

  const [penalizationPolicies, setPenalizationPolicies] = useState<any[]>([
    { name: "Late Coming Policy", employees: 0, employeeList: [] },
  ]);

  const [activeTab, setActiveTab] = useState("Capture Scheme");

  const handleUpdateSchemes = (updatedSchemes: any[]) => {
    setCaptureSchemes(updatedSchemes);
    const updatedEmployees = employees.map((emp) => {
      const assignedScheme = updatedSchemes.find((scheme) =>
        scheme.employeeList?.some((e: any) => e.empNo === emp.empNo)
      );
      return { ...emp, captureScheme: assignedScheme?.name || emp.captureScheme };
    });
    setEmployees(updatedEmployees);
  };

  const handleUpdatePenalizationPolicies = (updatedEmployees: any[], updatedPolicies: any[]) => {
    setEmployees(updatedEmployees);
    setPenalizationPolicies(updatedPolicies);
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen text-gray-800">
      <div className="flex items-center gap-6 border-b text-[13px] font-medium text-gray-500">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 ${activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "hover:text-gray-700"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeTab === "Capture Scheme" && (
          <CaptureScheme policies={captureSchemes} employees={employees} setPolicies={setCaptureSchemes} />
        )}
        {activeTab === "Capture Scheme Allocation" && (
          <CaptureSchemeAllocation employees={employees} schemes={captureSchemes} onUpdateSchemes={handleUpdateSchemes} />
        )}
        {activeTab === "Penalization Policy" && (
          <PenalisationPolicyMain policies={penalizationPolicies} employees={employees} setPolicies={setPenalizationPolicies} />
        )}
        {activeTab === "Penalization Policy Allocation" && (
          <PenalizationPolicyAllocation employees={employees} policies={penalizationPolicies} onUpdateSchemes={handleUpdatePenalizationPolicies} />
        )}
        {activeTab === "Bulk Penalty Management" && <BulkPenaltyManagement />}
      </div>
    </div>
  );
}
