"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ProbationStatusDrawerProps {
  open: boolean
  onClose: () => void
  employee: any
  onSubmit: (data: { status: string; date?: string; feedback: string }) => void
}

export default function ProbationStatusDrawer({
  open,
  onClose,
  employee,
  onSubmit,
}: ProbationStatusDrawerProps) {
  const [status, setStatus] = useState("end")
  const [feedback, setFeedback] = useState("")
  const [endDate, setEndDate] = useState("")
  const [extendDate, setExtendDate] = useState("")

  if (!open || !employee) return null

  const today = new Date().toISOString().split("T")[0]

  const handleSubmit = () => {
    let dateToSend = status === "end" ? endDate : status === "extend" ? extendDate : undefined

    onSubmit({
      status,
      date: dateToSend,
      feedback,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 flex justify-end bg-black/20 z-50 transition">
      <div className="w-[420px] bg-white h-full shadow-xl p-5 animate-slideInRight overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h6 className="text-sm font-semibold text-gray-800 text-xs">
            Probation feedback form – {employee.name}
          </h6>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Employee Info */}
        <div className="grid grid-cols-2 gap-y-1 text-[11px] text-gray-600 mb-4">
          <p className="text-xs">Worker Type: Permanent</p>
          <p className="text-xs">Department: {employee.department}</p>
          <p className="text-xs">Date of Joining: {employee.joiningDate}</p>
          <p className="text-xs">Location: {employee.location}</p>
          <p className="text-xs">Probation End: {employee.probationEnd}</p>
        </div>

        {/* Status Options */}
        <p className="text-[12px] font-medium mb-2">Confirm employee probation status</p>

        <div className="space-y-3 text-[11px]">
          {/* End Probation */}
          <label className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <input type="radio" checked={status === "end"} onChange={() => setStatus("end")} />
              End Probation and confirm as full-time employee
            </div>
            {status === "end" && (
              <input
                type="date"
                value={endDate}
                min={today}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded-md p-1 text-[11px] w-40"
              />
            )}
          </label>

          {/* Extend Probation */}
          <label className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                checked={status === "extend"}
                onChange={() => setStatus("extend")}
              />
              Extend Probation
            </div>
            {status === "extend" && (
              <input
                type="date"
                value={extendDate}
                min={today}
                onChange={(e) => setExtendDate(e.target.value)}
                className="border rounded-md p-1 text-[11px] w-40"
              />
            )}
          </label>

          {/* Terminate */}
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={status === "terminate"}
              onChange={() => setStatus("terminate")}
            />
            Terminate Employee
          </label>
        </div>

        {/* Feedback */}
        <div className="mt-4">
          <textarea
            placeholder="Please add your feedback"
            className="w-full border rounded-md p-2 text-[11px] h-24 focus:outline-none"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" className="text-[11px]" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0.3;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease forwards;
        }
      `}</style>
    </div>
  )
}
