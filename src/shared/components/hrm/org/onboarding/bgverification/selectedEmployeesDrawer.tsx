"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useState } from "react"

interface Employee {
  id: string
  name: string
  department: string
  location: string
  businessUnit: string
}

interface Props {
  open: boolean
  onClose: () => void
  onProceed: (selected: Employee[]) => void
}

export default function SelectEmployeesDrawer({ open, onClose, onProceed }: Props) {
  const [selected, setSelected] = useState<Employee[]>([])

  const employees: Employee[] = [
    { id: "1", name: "A P", department: "Engineering", location: "Abu Dhabi", businessUnit: "Not Available" },
    { id: "2", name: "Abhi", department: "Data Engineering", location: "Hyderabad", businessUnit: "Digital Tran" },
    { id: "3", name: "Ado", department: "Design", location: "Hyderabad", businessUnit: "CoreHR" },
  ]

  const toggleSelect = (emp: Employee) => {
    setSelected((prev) =>
      prev.some((e) => e.id === emp.id)
        ? prev.filter((e) => e.id !== emp.id)
        : [...prev, emp]
    )
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[700px] sm:w-[800px] text-[13px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-sm font-semibold">Select employees</SheetTitle>
        </SheetHeader>

        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-2 rounded text-xs mt-3 mb-3">
          This list consists of employees whose background verification has not been initiated.  
          <br />
          <span className="text-[11px] text-gray-600">
            Note: You can initiate background verification for an employee only once.
          </span>
        </div>

        {/* Table */}
        <div className="border rounded-md overflow-y-auto max-h-[60vh]">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-gray-50 border-b sticky top-0">
              <tr>
                <th className="p-2 w-8"></th>
                <th className="p-2 font-medium">EMPLOYEE NAME</th>
                <th className="p-2 font-medium">BUSINESS UNIT</th>
                <th className="p-2 font-medium">DEPARTMENT</th>
                <th className="p-2 font-medium">LOCATION</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr
                  key={emp.id}
                  className={`border-b hover:bg-gray-50 cursor-pointer ${
                    selected.some((e) => e.id === emp.id) ? "bg-blue-50" : ""
                  }`}
                  onClick={() => toggleSelect(emp)}
                >
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selected.some((e) => e.id === emp.id)}
                      onClick={(e) => e.stopPropagation()} // ⛔ Prevent double toggle
                      onChange={() => toggleSelect(emp)}
                    />
                  </td>
                  <td className="p-2">{emp.name}</td>
                  <td className="p-2">{emp.businessUnit}</td>
                  <td className="p-2">{emp.department}</td>
                  <td className="p-2">{emp.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-2 mt-4 border-t pt-3 bg-white sticky bottom-0">
          <Button variant="outline" className="text-xs h-8 px-3" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-3"
            onClick={() => {
              onProceed(selected)
              onClose()
            }}
            disabled={selected.length === 0}
          >
            Proceed
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
