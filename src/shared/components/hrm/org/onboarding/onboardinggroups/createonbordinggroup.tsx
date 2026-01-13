"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

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
]

interface CreateOnboardingGroupFormProps {
  onCreateGroup: (group: {
    name: string
    primaryRule: string
    primaryRuleValue: string
    secondaryRule?: string
    secondaryRuleValue?: string
    autoGroup: string
    matchingEmployees: Employee[]
    stages: string[]
  }) => void
}

export default function CreateOnboardingGroupForm({ onCreateGroup }: CreateOnboardingGroupFormProps) {
  const [groupName, setGroupName] = useState("")
  const [primaryRule, setPrimaryRule] = useState("")
  const [primaryRuleValue, setPrimaryRuleValue] = useState("")
  const [secondaryRule, setSecondaryRule] = useState("")
  const [secondaryRuleValue, setSecondaryRuleValue] = useState("")
  const [autoGroup, setAutoGroup] = useState("no")
  const [matchingEmployees, setMatchingEmployees] = useState<Employee[]>([])

  // Prompt for rule value when rule is selected
  const handlePrimaryRuleChange = (value: string) => {
    setPrimaryRule(value)
    const val = prompt(`Enter value for ${value}:`)
    if (val) setPrimaryRuleValue(val)
  }

  const handleSecondaryRuleChange = (value: string) => {
    setSecondaryRule(value)
    const val = prompt(`Enter value for ${value}:`)
    if (val) setSecondaryRuleValue(val)
  }

  const handleFindMatches = () => {
    if (!primaryRule || !primaryRuleValue) return

    let matches = mockEmployees.filter(emp => {
      if (primaryRule === "joiningDate") return emp.joiningDate === primaryRuleValue
      if (primaryRule === "location") return emp.location.toLowerCase() === primaryRuleValue.toLowerCase()
      if (primaryRule === "department") return emp.department.toLowerCase() === primaryRuleValue.toLowerCase()
      return false
    })

    if (secondaryRule && secondaryRuleValue) {
      matches = matches.filter(emp => {
        if (secondaryRule === "joiningDate") return emp.joiningDate === secondaryRuleValue
        if (secondaryRule === "location") return emp.location.toLowerCase() === secondaryRuleValue.toLowerCase()
        if (secondaryRule === "department") return emp.department.toLowerCase() === secondaryRuleValue.toLowerCase()
        return true
      })
    }

    setMatchingEmployees(matches)
  }

  const handleCreateGroup = () => {
    if (!groupName || !primaryRule || !primaryRuleValue) {
      alert("Please fill required fields and provide rule values.")
      return
    }

    const newGroup = {
      name: groupName,
      primaryRule,
      primaryRuleValue,
      secondaryRule: secondaryRule || undefined,
      secondaryRuleValue: secondaryRuleValue || undefined,
      autoGroup,
      matchingEmployees,
      stages: ["Joining Day"], // default stage
    }

    onCreateGroup(newGroup)

    // Reset form
    setGroupName("")
    setPrimaryRule("")
    setPrimaryRuleValue("")
    setSecondaryRule("")
    setSecondaryRuleValue("")
    setAutoGroup("no")
    setMatchingEmployees([])
  }

  return (
    <Card className="max-w-2xl mx-auto mt-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Create Onboarding Group</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Group Name</Label>
          <Input
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Primary Rule</Label>
            <Select onValueChange={handlePrimaryRuleChange}>
              <SelectTrigger><SelectValue placeholder="Select primary rule" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="joiningDate">Joining Date</SelectItem>
                <SelectItem value="location">Location</SelectItem>
                <SelectItem value="department">Department</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Secondary Rule (Optional)</Label>
            <Select onValueChange={handleSecondaryRuleChange}>
              <SelectTrigger><SelectValue placeholder="Select secondary rule" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="joiningDate">Joining Date</SelectItem>
                <SelectItem value="location">Location</SelectItem>
                <SelectItem value="department">Department</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Auto Group Employees</Label>
          <Select onValueChange={setAutoGroup}>
            <SelectTrigger><SelectValue placeholder="Enable auto grouping?" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes (auto group by rules)</SelectItem>
              <SelectItem value="no">No (manual selection)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleFindMatches}>Find Matching Employees</Button>
          <Button onClick={handleCreateGroup}>Create Group</Button>
        </div>

        {matchingEmployees.length > 0 && (
          <div className="border rounded-md mt-4 p-2 text-sm">
            <h3 className="font-medium mb-2">Matching Employees</h3>
            <table className="w-full text-xs border-collapse">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-1 text-left">Name</th>
                  <th className="p-1 text-left">Location</th>
                  <th className="p-1 text-left">Department</th>
                  <th className="p-1 text-left">Joining Date</th>
                </tr>
              </thead>
              <tbody>
                {matchingEmployees.map((emp) => (
                  <tr key={emp.id} className="border-b hover:bg-gray-50">
                    <td className="p-1">{emp.name}</td>
                    <td className="p-1">{emp.location}</td>
                    <td className="p-1">{emp.department}</td>
                    <td className="p-1">{emp.joiningDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
