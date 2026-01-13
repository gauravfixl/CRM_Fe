// pages/onboarding.js
"use client"
import { useState } from "react";
import TabBar from "@/components/hrm/tabbar";
import PreboardingPage from "@/components/hrm/org/onboarding/preboarding/preboardinglist";
import NewJoinersPage from "@/components/hrm/org/onboarding/newjoinee/newjoinerspage";
import OnboardingTasksPage from "@/components/hrm/org/onboarding/onboardingtasks/onboardingtasklist";
import SettingsPage from "@/components/hrm/org/onboarding/settings/settingspage";
import ActiveVerifications from "@/components/hrm/org/onboarding/bgverification/verificationlist";
import TaskTemplates from "@/components/hrm/org/onboarding/tasktemplates/templateslist";
interface Employee {
  id: string
  name: string
  joiningDate: string
  location: string
  department: string
}
   interface OnboardingGroup {
  id: number
  name: string
  taskCount: number
  stages: string[]
  primaryRule?: string
  primaryRuleValue?: string
  secondaryRule?: string
  secondaryRuleValue?: string
  autoGroup?: "yes" | "no"
  matchingEmployees?: Employee[]
}
export default function OnboardingPage() {
 
  const [activeSubTab, setActiveSubTab] = useState("Preboarding");
 const [preboardingCandidates, setPreboardingCandidates] = useState([
    {
      id: "1",
      name: "Riya Patel",
      role: "QA Analyst",
      dept: "Quality",
      location: "Mumbai",
      joiningDate: "2024-05-02",
      email: "riyapatel@example.com",
      stage: "Preboarding",
      action: "Update",
    },
  ])
  const tabs = [
    "Preboarding",
    "New Joinee",
    "Past Offers",
    "Onboarding Tasks",
    "Task Templates",
    "Background Verification",
    "Archived",
    "Settings",
  ];
const [newJoiners, setNewJoiners] = useState([])
 const [groups, setGroups] = useState<OnboardingGroup[]>([
    { id: 1, name: "Onboarding - India", taskCount: 3, stages: ["Joining Day", "Day After Joining", "Week After Joining"] },
    { id: 2, name: "Onboarding-ME", taskCount: 1, stages: ["Joining Day"] },
    { id: 3, name: "Onboarding-UK", taskCount: 1, stages: ["Joining Day"] },
    { id: 4, name: "Onboarding-US", taskCount: 1, stages: ["Joining Day"] },
    { id: 5, name: "Onboarding-SEA", taskCount: 1, stages: ["Joining Day"] },
  ])
  return (
    <div className="min-h-screen bg-gray-100 p-6">
    

      <div className="border-t pt-2">
        <TabBar tabs={tabs} activeTab={activeSubTab} onTabChange={setActiveSubTab} />
      </div>

      <div className="p-4 bg-white rounded shadow mt-4">
        {activeSubTab === "Preboarding" &&  <PreboardingPage
          candidates={preboardingCandidates}
          onCandidateMoved={(candidate) => {
            setPreboardingCandidates(prev => prev.filter(c => c.id !== candidate.id))
            setNewJoiners(prev => [...prev, candidate])
          }}
        />}
        {activeSubTab === "New Joinee" && <NewJoinersPage
          candidates={newJoiners} // your list of candidates
          onboardingGroups={groups} // the state from parent
          onAssignToGroup={(candidateIds, groupId) => {
            // 1. Find the selected group
            setGroups(prevGroups =>
              prevGroups.map(group => {
                if (group.id === groupId) {
                  const assignedEmployees = candidateIds
                    .map(id => {
                      const cand = newJoiners.find(c => c.id === id)
                      return cand
                        ? {
                            id: cand.id,
                            name: cand.name,
                            joiningDate: cand.joiningDate,
                            location: cand.location,
                            department: cand.dept,
                          }
                        : null
                    })
                    .filter(Boolean) as Employee[]
        
                  return {
                    ...group,
                    matchingEmployees: [...(group.matchingEmployees || []), ...assignedEmployees],
                  }
                }
                return group
              })
            )
        
            // 2. Optionally, remove assigned candidates from New Joiners list
            setNewJoiners(prev => prev.filter(c => !candidateIds.includes(c.id)))
          }}
        />}
        {activeSubTab === "Past Offers" && <p>Past Offers Content</p>}
        {activeSubTab === "Onboarding Tasks" && <OnboardingTasksPage/>}
        {activeSubTab === "Task Templates" && <TaskTemplates/>}
        {activeSubTab === "Background Verification" &&   <ActiveVerifications/>}
        {activeSubTab === "Archived" && <p>Archived Content</p>}
        {activeSubTab === "Settings" &&<SettingsPage/>}
      </div>
    </div>
  );
}
