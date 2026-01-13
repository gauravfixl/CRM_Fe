"use client"

import { Employee } from "@/types" // optional, you can define Employee type here or import
import { Button } from "@/components/ui/button"

interface CompletedProbationActionsTableProps {
  employees: Employee[] // employees with feedback
}

export default function CompletedProbationActionsTable({
  employees = [],
}: CompletedProbationActionsTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-md text-xs shadow-sm mt-6">
      <div className="p-2 font-semibold text-gray-700 border-b border-gray-200">
        Completed Probation Actions
      </div>

      <table className="w-full border-collapse text-[10px]">
        <thead className="bg-gray-50 border-b border-gray-200 uppercase text-gray-600 text-left">
          <tr>
            <th className="py-2 px-3 align-middle">Employee</th>
            <th className="py-2 px-3 align-middle">Job Title</th>
            <th className="py-2 px-3 align-middle">Department</th>
            <th className="py-2 px-3 align-middle">Sub Department</th>
            <th className="py-2 px-3 align-middle">Location</th>
            <th className="py-2 px-3 align-middle">Business Unit</th>
            <th className="py-2 px-3 align-middle">Feedback Received</th>
            <th className="py-2 px-3 align-middle">Probation End Date</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr
              key={emp.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-2 px-3 align-middle text-gray-700">{emp.name}</td>
              <td className="py-2 px-3 align-middle text-gray-600 truncate">
                {emp.title.length > 18 ? emp.title.slice(0, 18) + "..." : emp.title}
              </td>
              <td className="py-2 px-3 align-middle text-gray-600">{emp.department}</td>
              <td className="py-2 px-3 align-middle text-gray-600">{emp.subDepartment}</td>
              <td className="py-2 px-3 align-middle text-gray-600">{emp.location}</td>
              <td className="py-2 px-3 align-middle text-gray-600">{emp.businessUnit}</td>
              <td className="py-2 px-3 align-middle text-blue-600">
                {emp.feedback === "In Process" ? "Processed" : emp.feedback}
              </td>
              <td className="py-2 px-3 align-middle text-gray-600">{emp.probationEnd}</td>
            </tr>
          ))}
          {employees.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="py-4 text-center text-gray-400 text-[10px]"
              >
                No completed probation actions yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
