// pages/tabs.js
"use client";

import { useState } from "react";
import TabBar from "@/components/hrm/tabbar";
import ProbationPolicyPage from "@/components/hrm/org/emloyees/probation/probationpolicy";
import EmployeeProfileStructure from "@/components/hrm/org/emloyees/settings/employeeprofilestructure";
const tabs = [
  "Employee Directory",
  "Organization Tree",
  "Logins",
  "Contingent Staff",
  "Profile Changes",
  "Private Profiles",
  "Probation",
  "Settings",
];

export default function TabsPage() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
     
      {/* Tab Bar Component */}
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="p-4 bg-white rounded shadow">
        {activeTab === "Employee Directory" && <p>Employee Directory Content</p>}
        {activeTab === "Organization Tree" && <p>Organization Tree Content</p>}
        {activeTab === "Logins" && <p>Logins Content</p>}
        {activeTab === "Contingent Staff" && <p>Contingent Staff Content</p>}
        {activeTab === "Profile Changes" && <p>Profile Changes Content</p>}
        {activeTab === "Private Profiles" && <p>Private Profiles Content</p>}
        {activeTab === "Probation" && <ProbationPolicyPage/>}
        {activeTab === "Settings" && <EmployeeProfileStructure/>}
      </div>
    </div>
  );
}
