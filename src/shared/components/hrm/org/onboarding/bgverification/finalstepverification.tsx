"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Employee {
  id: string
  name: string
  department: string
  position: string
}

interface FinalizeVerificationStepProps {
  employees: Employee[]
  selectedEmployeeId: string
  onStatusUpdate: (results: { id: string; status: string; note: string }[]) => void
}

export default function FinalizeVerificationStep({
  employees,
  selectedEmployeeId,
  onStatusUpdate,
}: FinalizeVerificationStepProps) {
  const selectedEmployee = employees.find((e) => e.id === selectedEmployeeId)

  const [results, setResults] = useState<{ id: string; status: string; note: string }[]>(
    []
  )

  // 🧠 Rebuild results if employees change
  useEffect(() => {
    setResults(employees.map((e) => ({ id: e.id, status: "", note: "" })))
  }, [employees])

  // 📢 Notify parent whenever results change
  useEffect(() => {
    onStatusUpdate(results)
  }, [results, onStatusUpdate])

  if (!selectedEmployee) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Please select an employee in the previous step.
      </div>
    )
  }

  const result = results.find((r) => r.id === selectedEmployee.id) || {
    id: selectedEmployee.id,
    status: "",
    note: "",
  }

  const handleStatusChange = (id: string, status: string) => {
    setResults((prev) =>
      prev.some((r) => r.id === id)
        ? prev.map((r) => (r.id === id ? { ...r, status } : r))
        : [...prev, { id, status, note: "" }]
    )
  }

  const handleNoteChange = (id: string, note: string) => {
    setResults((prev) =>
      prev.some((r) => r.id === id)
        ? prev.map((r) => (r.id === id ? { ...r, note } : r))
        : [...prev, { id, status: "", note }]
    )
  }

  return (
    <div className="flex flex-col h-full bg-white text-[13px] p-6">
      <h3 className="text-sm font-semibold mb-4">Finalize Verification</h3>

      <p className="text-gray-600 text-xs mb-6">
        Review verification results and mark this employee as{" "}
        <span className="font-medium text-green-600">Passed</span> or{" "}
        <span className="font-medium text-red-600">Failed</span>. Add notes if needed.
      </p>

      <Card className="p-4 shadow-sm border border-gray-200 text-xs">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="font-medium text-gray-800 text-[13px]">
              {selectedEmployee.name}
            </p>
            <p className="text-gray-500 text-[11px]">
              {selectedEmployee.position} — {selectedEmployee.department}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={result.status === "passed" ? "default" : "outline"}
              className={`h-7 text-xs px-3 ${
                result.status === "passed"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : ""
              }`}
              onClick={() => handleStatusChange(selectedEmployee.id, "passed")}
            >
              Passed
            </Button>
            <Button
              size="sm"
              variant={result.status === "failed" ? "default" : "outline"}
              className={`h-7 text-xs px-3 ${
                result.status === "failed"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : ""
              }`}
              onClick={() => handleStatusChange(selectedEmployee.id, "failed")}
            >
              Failed
            </Button>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-medium text-gray-600 mb-1 block">
            Add note (optional)
          </label>
          <Textarea
            placeholder="Add remarks or details..."
            className="text-xs resize-none h-16"
            value={result.note}
            onChange={(e) => handleNoteChange(selectedEmployee.id, e.target.value)}
          />
        </div>
      </Card>
    </div>
  )
}
