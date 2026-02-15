"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProbationPolicyWizardProps {
  open: boolean
  onClose: () => void
  policy?: {
    name: string
    duration: string
    maxExtension: string
    evaluateEnd?: string
    evaluator?: string
    autoEvaluation?: string
    completeBefore?: string
  }
  onSave?: (updatedPolicy: any) => void
}

export const ProbationPolicyWizard = ({
  open,
  onClose,
  policy,
  onSave,
}: ProbationPolicyWizardProps) => {
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    maxExtension: "",
    evaluateEnd: "",
    evaluator: "",
    autoEvaluation: "",
    completeBefore: "",
  })

  useEffect(() => {
    if (policy) {
      setFormData({
        name: policy.name || "",
        duration: policy.duration || "",
        maxExtension: policy.maxExtension || "",
        evaluateEnd: policy.evaluateEnd || "Yes",
        evaluator: policy.evaluator || "Reporting Manager",
        autoEvaluation: policy.autoEvaluation || "15",
        completeBefore: policy.completeBefore?.replace(/\D/g, "") || "90",
      })
    }
  }, [policy])

  if (!open) return null

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    console.log("✅ Updated Probation Policy:", formData)
    onSave?.(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="w-[50vw] h-full bg-white shadow-xl p-6 overflow-y-auto">
        {/* ---------- Header ---------- */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">
            {formData.name || "Unnamed Policy"} — Settings
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* ---------- Form Section ---------- */}
        <div className="space-y-4 text-xs">
          {/* <div className="bg-gray-50 border p-3 rounded-md mb-2">
            <p><span className="font-semibold">Duration:</span> {formData.duration}</p>
            <p><span className="font-semibold">Max Extension:</span> {formData.maxExtension}</p>
            <p><span className="font-semibold">Evaluate at End:</span> {formData.evaluateEnd}</p>
            <p><span className="font-semibold">Evaluator:</span> {formData.evaluator}</p>
            <p><span className="font-semibold">Auto Evaluation:</span> {formData.autoEvaluation} Days before end</p>
            <p><span className="font-semibold">Complete Before:</span> {formData.completeBefore} Days</p>
          </div> */}

          {/* Q1 - Evaluation */}
          <div>
            <p className="font-medium mb-1">
              Do you want to evaluate an employee as part of probation status change?
            </p>
            <div className="flex gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="evaluate"
                  checked={formData.evaluateEnd === "Yes"}
                  onChange={() => handleChange("evaluateEnd", "Yes")}
                />{" "}
                Yes
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="evaluate"
                  checked={formData.evaluateEnd === "No"}
                  onChange={() => handleChange("evaluateEnd", "No")}
                />{" "}
                No
              </label>
            </div>
          </div>

          {/* Q2 - Feedback */}
          <div>
            <p className="font-medium mb-1">Who all should give feedback about Employee?</p>
            <div className="border rounded-md p-3">
              <p className="font-semibold mb-1">Level 1</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked /> Reporting Manager
                </label>
                <div className="flex items-center gap-2">
                  <label>Assign to</label>
                  <select
                    className="border rounded-md px-2 py-1 text-xs"
                    value={formData.evaluator}
                    onChange={(e) => handleChange("evaluator", e.target.value)}
                  >
                    <option>All</option>
                    <option>Reporting Manager</option>
                    <option>Department Head</option>
                  </select>
                </div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Send reminder after
                  <input
                    type="number"
                    min="0"
                    value={formData.autoEvaluation}
                    onChange={(e) => handleChange("autoEvaluation", e.target.value)}
                    className="border w-16 rounded-md px-1 text-xs"
                  />{" "}
                  days
                </label>
                <button className="text-blue-600 text-xs">+ Add New Level</button>
              </div>
            </div>
          </div>

          {/* Auto Trigger */}
          <div className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <label>
              Automatically trigger probation evaluation process{" "}
              <input
                type="number"
                min="0"
                value={formData.autoEvaluation}
                onChange={(e) => handleChange("autoEvaluation", e.target.value)}
                className="border w-12 px-1 text-xs rounded"
              />{" "}
              days before probation end date
            </label>
          </div>

          {/* Complete Feedback */}
          <div>
            <label className="flex items-center gap-2">
              Complete feedback in{" "}
              <input
                type="number"
                min="0"
                value={formData.completeBefore}
                onChange={(e) => handleChange("completeBefore", e.target.value)}
                className="border w-12 px-1 text-xs rounded"
              />{" "}
              days before probation end date
            </label>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" className="bg-blue-600 text-white" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
