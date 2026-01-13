"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface Employee {
  name: string
  role: string
  id: string
  businessUnit: string
  department: string
  subDept: string
  location: string
  initials?: string
}

interface SelectedEmployeesStepProps {
  employees: Employee[]
  onAddMore: () => void
  onNext: () => void
  onRemove: (id: string) => void
}

export default function SelectedEmployeesStep({
  employees,
  onAddMore,
  onNext,
  onRemove,
}: SelectedEmployeesStepProps) {
  return (
    <div className="flex flex-col h-full px-8 pt-6 text-[13px] text-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h6  className="font-semibold text-gray-800 text-xs">Selected employees</h6>
        <button
          className="text-blue-600 text-sm font-medium hover:underline"
          onClick={onAddMore}
        >
          + Add more
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-left text-[12px]">
          <thead className="bg-gray-50 border-b text-gray-600">
            <tr>
              <th className="px-4 py-2 font-medium">EMP NAME & DESIGNATION</th>
              <th className="px-4 py-2 font-medium">EMP ID</th>
              <th className="px-4 py-2 font-medium">BUSINESS UNIT</th>
              <th className="px-4 py-2 font-medium">DEPARTMENT</th>
              <th className="px-4 py-2 font-medium">SUB DEPARTMENT</th>
              <th className="px-4 py-2 font-medium">LOCATION</th>
              <th className="px-4 py-2 font-medium text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-[11px] flex items-center justify-center font-medium">
                    {emp.initials || emp.name.charAt(0)}
                  </div>
                  <span>
                    {emp.name}{" "}
                    <span className="text-gray-500 text-xs">({emp.role})</span>
                  </span>
                </td>
                <td className="px-4 py-2">{emp.id}</td>
                <td className="px-4 py-2">{emp.businessUnit}</td>
                <td className="px-4 py-2">{emp.department}</td>
                <td className="px-4 py-2">{emp.subDept}</td>
                <td className="px-4 py-2">{emp.location}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => onRemove(emp.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination footer */}
        <div className="flex justify-between items-center text-gray-500 text-xs px-4 py-2 bg-gray-50">
          <span>
            1 to {employees.length} of {employees.length}
          </span>
          <span>Page 1 of 1</span>
        </div>
      </div>

      {/* Actions */}
      {/* <div className="mt-6 flex justify-end gap-2">
        <Button
          variant="outline"
          className="text-xs h-8 px-3"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-3"
          onClick={onNext}
        >
          Next
        </Button>
      </div> */}
    </div>
  )
}
