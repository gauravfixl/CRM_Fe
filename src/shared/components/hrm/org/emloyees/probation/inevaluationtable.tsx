"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { showSuccess } from "@/utils/toast"

export interface Employee {
  id: number
  name: string
  empCode: string
  title: string
  department: string
  subDepartment: string
  location: string
  businessUnit: string
  joiningDate: string
  probationEnd: string
  feedback: string
  waitingOn: string
}

interface ProbationEvaluationTableProps {
  employees?: Employee[]
  onMarkCompleted?: (employee: Employee) => void // callback to parent
}

export default function ProbationEvaluationTable({
  employees = [],
  onMarkCompleted,
}: ProbationEvaluationTableProps) {
  const [selected, setSelected] = useState<number[]>([])
  const [employeeData, setEmployeeData] = useState<Employee[]>(employees)

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelected(employeeData.map((e) => e.id))
    else setSelected([])
  }

  const handleSelect = (id: number, checked: boolean) => {
    setSelected((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    )
  }

  // ✅ Handle Remind on Feedback click
  const handleRemindOnFeedback = () => {
    if (selected.length === 0) return

    setEmployeeData((prev) =>
      prev.map((emp) =>
        selected.includes(emp.id)
          ? {
              ...emp,
              waitingOn: "Sent for Feedback",
              feedback: "In Process",
            }
          : emp
      )
    )

    showSuccess("Reminder sent to managers!")
    setSelected([]) // clear selection
  }

  // ✅ Handle Mark Probation as Completed
  const handleMarkCompleted = (emp: Employee) => {
    // Remove employee from evaluation table
    setEmployeeData((prev) => prev.filter((e) => e.id !== emp.id))
    showSuccess(`${emp.name} marked as completed!`)

    // Notify parent
    if (onMarkCompleted) onMarkCompleted(emp)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md text-xs shadow-sm">
      {/* Filter Row */}
      <div className="flex items-center justify-between border-b border-gray-200 p-2">
        <div className="flex items-center gap-2">
          <select className="border border-gray-200 rounded px-2 py-[3px] focus:outline-none">
            <option>Business Unit</option>
          </select>
          <select className="border border-gray-200 rounded px-2 py-[3px] focus:outline-none">
            <option>Department</option>
          </select>
          <select className="border border-gray-200 rounded px-2 py-[3px] focus:outline-none">
            <option>Location</option>
          </select>
          <select className="border border-gray-200 rounded px-2 py-[3px] focus:outline-none">
            <option>Waiting On</option>
          </select>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search"
              className="h-7 text-xs pl-2 pr-6"
            />
            <span className="absolute right-2 top-1.5 text-gray-400 text-[10px]">
              🔍
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className={`h-7 px-3 text-white text-xs font-medium ${
              selected.length > 0
                ? "bg-[#3B82F6] hover:bg-[#2563EB]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            size="sm"
            onClick={handleRemindOnFeedback}
            disabled={selected.length === 0}
          >
            Remind on Feedback
          </Button>

          <Button
            className="h-7 px-3 bg-gray-100 text-gray-400 border border-gray-200 text-xs font-medium cursor-not-allowed"
            size="sm"
            disabled
          >
            Download Received Feedback
          </Button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-600 uppercase">
          <tr>
            <th className="py-2 px-3 w-[20px]">
              <Checkbox
                checked={
                  employeeData.length > 0 &&
                  selected.length === employeeData.length
                }
                onCheckedChange={(checked: any) => handleSelectAll(!!checked)}
              />
            </th>
            <th className="py-2 px-3 text-left">Employee</th>
            <th className="py-2 px-3 text-left">Job Title</th>
            <th className="py-2 px-3 text-left">Department</th>
            <th className="py-2 px-3 text-left">Sub Department</th>
            <th className="py-2 px-3 text-left">Location</th>
            <th className="py-2 px-3 text-left">Business Unit</th>
            <th className="py-2 px-3 text-left">Date of Joining</th>
            <th className="py-2 px-3 text-left">Probation End Date</th>
            <th className="py-2 px-3 text-left">Feedback Received</th>
            <th className="py-2 px-3 text-left">Waiting On</th>
            <th className="py-2 px-3 text-left">Action</th>
          </tr>
        </thead>

        {employeeData.length > 0 && (
          <tbody>
            {employeeData.map((emp) => (
              <tr
                key={emp.id}
                className={`border-b border-gray-100 hover:bg-gray-50 ${
                  selected.includes(emp.id) ? "bg-blue-50" : ""
                }`}
              >
                <td className="py-2 px-3">
                  <Checkbox
                    checked={selected.includes(emp.id)}
                    onCheckedChange={(checked: any) =>
                      handleSelect(emp.id, !!checked)
                    }
                  />
                </td>
                <td className="py-2 px-3 text-gray-700">
                  <div className="flex flex-col leading-tight">
                    <span className="font-medium text-gray-800 truncate">
                      {emp.name}
                    </span>
                    <span className="text-gray-500 text-[10px]">{emp.empCode}</span>
                  </div>
                </td>
                <td className="py-2 px-3 text-gray-600 truncate">
                  {emp.title.length > 18 ? emp.title.slice(0, 18) + "..." : emp.title}
                </td>
                <td className="py-2 px-3 text-gray-600">{emp.department}</td>
                <td className="py-2 px-3 text-gray-600">{emp.subDepartment}</td>
                <td className="py-2 px-3 text-gray-600">{emp.location}</td>
                <td className="py-2 px-3 text-gray-600">{emp.businessUnit}</td>
                <td className="py-2 px-3 text-gray-600">{emp.joiningDate}</td>
                <td className="py-2 px-3 text-gray-600">{emp.probationEnd}</td>
                <td className="py-2 px-3 text-blue-600">{emp.feedback}</td>
                <td className="py-2 px-3 text-red-500 font-medium">{emp.waitingOn}</td>
                <td className="py-2 px-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[10px] text-gray-600 hover:text-gray-800"
                    onClick={() => handleMarkCompleted(emp)}
                  >
                    Mark Probation as Completed
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        )}

        {employeeData.length === 0 && (
          <tbody>
            <tr>
              <td colSpan={12} className="text-center py-4 text-gray-400 text-[10px]">
                No employees in evaluation list.
              </td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  )
}
