"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ProbationStatusDrawer from "./probationstatusdrawer"

// 👇 Define props type
interface Employee {
  id: number
  name: string
  title: string
  department: string
  location: string
  joiningDate: string
  probationEnd: string
  extension: string
  status: string
}

interface ProbationEmployeeTableProps {
  employeesData: Employee[]
}

export default function ProbationEmployeeTable({
  employees,
  onInitiateEvaluation,
  onUpdateProbationDate,
}: any) {
  const [selected, setSelected] = useState<number[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? employees.map((e) => e.id) : [])
  }

  const handleSelect = (id: number, checked: boolean) => {
    setSelected((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id)
    )
  }

  const handleInitiateEvaluation = () => {
    const selectedEmployees = employees.filter((e) => selected.includes(e.id))
    onInitiateEvaluation(selectedEmployees)
    setSelected([])
  }

  const handleDrawerSubmit = (id: number, newDate: string) => {
    onUpdateProbationDate(id, newDate)
    setDrawerOpen(false)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md text-[11px] shadow-sm relative">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-3 py-2 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-3 text-[11px] font-medium"
            onClick={handleInitiateEvaluation}
            disabled={selected.length === 0}
          >
            Initiate Evaluation
          </Button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200 text-[10px] text-gray-600 uppercase">
          <tr>
            <th className="py-2 px-3 w-[20px]">
              <Checkbox
                checked={selected.length === employees.length && employees.length > 0}
                onCheckedChange={(checked: any) => handleSelectAll(!!checked)}
              />
            </th>
            <th className="py-2 px-3">Employee</th>
            <th className="py-2 px-3">Department</th>
            <th className="py-2 px-3">Probation End</th>
            <th className="py-2 px-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-2 px-3">
                <Checkbox
                  checked={selected.includes(emp.id)}
                  onCheckedChange={(checked: any) =>
                    handleSelect(emp.id, !!checked)
                  }
                />
              </td>
              <td className="py-2 px-3">{emp.name}</td>
              <td className="py-2 px-3">{emp.department}</td>
              <td className="py-2 px-3">{emp.probationEnd}</td>
              <td className="py-2 px-3 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() => {
                    setSelectedEmployee(emp)
                    setDrawerOpen(true)
                  }}
                >
                  Change Status
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Drawer */}
      <ProbationStatusDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        employee={selectedEmployee}
        onSubmit={handleDrawerSubmit}
      />
    </div>
  )
}
