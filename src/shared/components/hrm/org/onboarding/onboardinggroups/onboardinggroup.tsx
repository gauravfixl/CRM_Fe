"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import CreateOnboardingGroupForm from "./createonbordinggroup"

interface Employee {
  id: string
  name: string
  joiningDate: string
  location: string
  department: string
}

const mockEmployees: Employee[] = [
  { id: "1", name: "Aarav", joiningDate: "2025-10-17", location: "Mumbai", department: "Sales" },
  { id: "2", name: "Neha", joiningDate: "2025-10-17", location: "Delhi", department: "Marketing" },
  { id: "3", name: "Ravi", joiningDate: "2025-10-17", location: "Mumbai", department: "Sales" },
  { id: "4", name: "Ananya", joiningDate: "2025-10-18", location: "Delhi", department: "HR" },
]

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

interface OnboardingGroupsProps {
  groups: OnboardingGroup[]
  setGroups: React.Dispatch<React.SetStateAction<OnboardingGroup[]>>
}

export default function OnboardingGroups({ groups, setGroups }: OnboardingGroupsProps) {
  const [selectedGroup, setSelectedGroup] = useState<number>(groups[0]?.id || 1)
  const [showForm, setShowForm] = useState(false)

  // --- UPDATE GROUP RULES ---
  const updateGroupRules = (groupId: number, field: string, value: string) => {
    setGroups(groups.map(g =>
      g.id === groupId
        ? { ...g, [field]: value }
        : g
    ))
  }

  // --- APPLY RULES LOGIC ---
  const applyRules = (group: OnboardingGroup): Employee[] => {
    let matched = mockEmployees

    if (group.primaryRule && group.primaryRuleValue) {
      matched = matched.filter(emp => {
        if (group.primaryRule === "joiningDate") return emp.joiningDate === group.primaryRuleValue
        if (group.primaryRule === "location") return emp.location.toLowerCase() === group.primaryRuleValue.toLowerCase()
        if (group.primaryRule === "department") return emp.department.toLowerCase() === group.primaryRuleValue.toLowerCase()
        return false
      })
    }

    if (group.secondaryRule && group.secondaryRuleValue) {
      matched = matched.filter(emp => {
        if (group.secondaryRule === "joiningDate") return emp.joiningDate === group.secondaryRuleValue
        if (group.secondaryRule === "location") return emp.location.toLowerCase() === group.secondaryRuleValue.toLowerCase()
        if (group.secondaryRule === "department") return emp.department.toLowerCase() === group.secondaryRuleValue.toLowerCase()
        return true
      })
    }

    return matched
  }

  const applyUpdatedRules = (groupId: number) => {
    const group = groups.find(g => g.id === groupId)
    if (!group) return

    const updatedMatches = applyRules(group)

    setGroups(groups.map(g =>
      g.id === groupId
        ? { ...g, matchingEmployees: updatedMatches }
        : g
    ))
  }

  // --- CREATE NEW GROUP ---
  const handleCreateGroup = (newGroup: {
    name: string
    primaryRule: string
    primaryRuleValue: string
    secondaryRule?: string
    secondaryRuleValue?: string
    autoGroup: string
    matchingEmployees: Employee[]
    stages: string[]
  }) => {
    const groupWithId = {
      ...newGroup,
      id: groups.length + 1,
      taskCount: newGroup.stages.length,
      matchingEmployees: newGroup.matchingEmployees,
    }
    setGroups([...groups, groupWithId])
    setSelectedGroup(groupWithId.id)
    setShowForm(false)
  }

  // --- ADD STAGE ---
  const handleAddStage = () => {
    const stageName = prompt("Enter new stage name:")
    if (!stageName) return

    setGroups(groups.map(g =>
      g.id === selectedGroup
        ? { ...g, stages: [...g.stages, stageName], taskCount: g.stages.length + 1 }
        : g
    ))
  }

  return (
    <div className="text-xs w-full">
      {showForm ? (
        <div className="p-4 w-full">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold text-gray-700">Create Onboarding Group</h2>
            <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>Back</Button>
          </div>
          <CreateOnboardingGroupForm onCreateGroup={handleCreateGroup} />
        </div>
      ) : (
        <div className="flex space-x-4">
          {/* --- LEFT SIDEBAR --- */}
          <div className="w-48 bg-white border border-gray-200 rounded-md shadow-sm p-2">
            {groups.map((group) => (
              <div
                key={group.id}
                className={`flex items-center justify-between p-2 rounded cursor-pointer mb-1 ${
                  selectedGroup === group.id
                    ? "bg-blue-50 border-l-2 border-blue-500"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedGroup(group.id)}
              >
                <span className="truncate">{group.name}</span>
                <span className="text-blue-500 font-medium text-[10px]">
                  {group.taskCount} Task{group.taskCount > 1 ? "s" : ""}
                </span>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              className="w-full mt-2 text-blue-500 border-blue-500 hover:bg-blue-50 text-xs flex items-center justify-center gap-1"
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-3 h-3" /> New Onboarding Group
            </Button>
          </div>

          {/* --- RIGHT PANEL --- */}
          <div className="flex-1 bg-white border border-gray-200 rounded-md shadow-sm p-3">
            <Card className="border-none shadow-none p-0">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-xs font-semibold text-gray-700">
                  {groups.find((g) => g.id === selectedGroup)?.name}
                </CardTitle>
                <p className="text-[10px] text-gray-500">Onboarding workflow for new joining</p>
              </CardHeader>
              <CardContent className="p-0 space-y-2">
                <div className="flex flex-col space-y-1">
                  {groups.find((g) => g.id === selectedGroup)?.stages.map((stage, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-gray-50 rounded border border-gray-200 text-[10px] text-gray-600"
                    >
                      {stage}
                    </div>
                  ))}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 text-blue-500 border-blue-500 hover:bg-blue-50"
                  onClick={handleAddStage}
                >
                  + Add Stage
                </Button>
              </CardContent>
            </Card>

            {/* --- RULES EDIT SECTION --- */}
            <Card className="mt-4 border-none shadow-none p-3">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-xs font-semibold text-gray-700">Update Rules</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-2">
                {groups.find((g) => g.id === selectedGroup) && (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <label className="text-[10px]">Primary Rule:</label>
                      <select
                        className="text-[10px] border rounded p-1 flex-1"
                        value={groups.find((g) => g.id === selectedGroup)?.primaryRule || ""}
                        onChange={(e) => updateGroupRules(selectedGroup, "primaryRule", e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="joiningDate">Joining Date</option>
                        <option value="location">Location</option>
                        <option value="department">Department</option>
                      </select>
                      <input
                        className="text-[10px] border rounded p-1 flex-1"
                        placeholder="Value"
                        value={groups.find((g) => g.id === selectedGroup)?.primaryRuleValue || ""}
                        onChange={(e) => updateGroupRules(selectedGroup, "primaryRuleValue", e.target.value)}
                      />
                    </div>

                    <div className="flex gap-2">
                      <label className="text-[10px]">Secondary Rule:</label>
                      <select
                        className="text-[10px] border rounded p-1 flex-1"
                        value={groups.find((g) => g.id === selectedGroup)?.secondaryRule || ""}
                        onChange={(e) => updateGroupRules(selectedGroup, "secondaryRule", e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="joiningDate">Joining Date</option>
                        <option value="location">Location</option>
                        <option value="department">Department</option>
                      </select>
                      <input
                        className="text-[10px] border rounded p-1 flex-1"
                        placeholder="Value"
                        value={groups.find((g) => g.id === selectedGroup)?.secondaryRuleValue || ""}
                        onChange={(e) => updateGroupRules(selectedGroup, "secondaryRuleValue", e.target.value)}
                      />
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-blue-500 border-blue-500 hover:bg-blue-50 mt-2"
                      onClick={() => applyUpdatedRules(selectedGroup)}
                    >
                      Apply Rules
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* --- MATCHED EMPLOYEES --- */}
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-gray-700 mb-1">Matched Employees</h3>
              <ul className="text-[10px]">
                {groups.find(g => g.id === selectedGroup)?.matchingEmployees?.map(emp => (
                  <li key={emp.id}>{emp.name} - {emp.location} - {emp.department}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
