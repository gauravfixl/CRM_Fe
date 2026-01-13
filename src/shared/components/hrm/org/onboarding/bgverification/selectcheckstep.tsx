"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
interface SelectChecksStepProps {
  onBack: () => void
  onNext: (selectedChecks: string[], vendor: string, mode: string, employeeId: string) => void
  employees: { id: string; name: string }[]
  selectedEmployee: string
  setSelectedEmployee: (id: string) => void
}

export default function SelectChecksStep({
  onBack,
  onNext,
  employees,
  selectedEmployee,
  setSelectedEmployee,
}: SelectChecksStepProps) {
  const [vendor, setVendor] = useState("OnGrid")
  const [selectedChecks, setSelectedChecks] = useState<string[]>([])
  const [isManual, setIsManual] = useState(false)


  const [employers, setEmployers] = useState([
    {
      company: "TechNova Pvt Ltd",
      duration: "Jan 2021 – Dec 2022",
      contact: "hr@technova.com",
      phone: "+91 98765 43210",
      status: "pending",
    },
    {
      company: "BluePeak Systems",
      duration: "Jul 2018 – Dec 2020",
      contact: "hr@bluepeak.com",
      phone: "+91 91234 56789",
      status: "pending",
    },
  ])

  const checks = [
    "Aadhaar Verification",
    "Bank Account Verification",
    "Credit Check",
    "Driving License Verification",
    "Education Verification",
    "Employment Verification",
  ]

  const toggleCheck = (check: string) => {
    setSelectedChecks((prev) =>
      prev.includes(check)
        ? prev.filter((c) => c !== check)
        : [...prev, check]
    )
  }

  const updateStatus = (index: number, status: string) => {
    setEmployers((prev) =>
      prev.map((emp, i) => (i === index ? { ...emp, status } : emp))
    )
  }

  return (
    <div className="flex flex-col h-full bg-white text-[13px] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-medium">Select vendor and checks you’d like to apply</h3>

        {/* Toggle between Vendor Mode / Manual HR Mode */}
        <div className="flex items-center gap-2 text-xs">
          <span className={!isManual ? "font-semibold text-blue-600" : "text-gray-500"}>
            Vendor Mode
          </span>
          <Switch checked={isManual} onCheckedChange={setIsManual} />
          <span className={isManual ? "font-semibold text-blue-600" : "text-gray-500"}>
            HR Manual Mode
          </span>
        </div>
      </div>

      {/* Employee Selection */}
  <div className="mb-5">
  <label className="text-xs font-medium text-gray-700 mb-1 block">
    Select Employee for Verification
  </label>
  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
    <SelectTrigger className="w-[280px] text-xs">
      <SelectValue placeholder="Select employee" />
    </SelectTrigger>
    <SelectContent>
      {employees.length > 0 ? (
  employees.map((emp) => (
        <SelectItem key={emp.id} value={emp.id.toString()}>
          {emp.name}
        </SelectItem>
      )
)) : (
  <p className="text-xs text-gray-500">No employee selected for verification.</p>
)}

     
    </SelectContent>
  </Select>
</div>



      {/* Mode 1: Vendor-based Verification */}
      {!isManual && (
        <div className="flex-1 flex flex-col items-center">
          <Card className="w-[420px] p-5 shadow-sm border-gray-200">
            <div className="mb-5">
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                Background verification vendor
              </label>
              <Select value={vendor} onValueChange={setVendor}>
                <SelectTrigger className="w-full text-xs">
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OnGrid">OnGrid</SelectItem>
                  <SelectItem value="IDfy">IDfy</SelectItem>
                  <SelectItem value="AuthBridge">AuthBridge</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 mb-2 block">
                Select checks to apply
              </label>
              <div className="flex flex-col border rounded-md max-h-[240px] overflow-y-auto">
                {checks.map((check) => (
                  <label
                    key={check}
                    className="flex items-center gap-2 px-3 py-2 border-b last:border-0 text-[12px] hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedChecks.includes(check)}
                      onChange={() => toggleCheck(check)}
                    />
                    {check}
                  </label>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Mode 2: HR Manual Verification */}
      {isManual && (
        <div className="flex-1 flex flex-col items-center">
          <Card className="w-[600px] p-5 shadow-sm border-gray-200">
            <h4 className="text-sm font-semibold mb-4">Previous Employment Details</h4>

            <div className="space-y-3">
              {employers.map((emp, idx) => (
                <div
                  key={idx}
                  className="border rounded-md p-3 text-[11px] bg-gray-50 flex justify-between items-start"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-[11.5px] leading-tight">
                      {emp.company}
                    </p>
                    <p className="text-gray-500 text-[10px] mt-0.5">{emp.duration}</p>
                  </div>

                  <div className="text-right text-gray-600 text-[10.5px] leading-tight">
                    <p className="text-xs">
                      <span className="font-medium">Email: </span>
                      {emp.contact}
                    </p>
                    <p className="text-xs">
                      <span className="font-medium">Phone: </span>
                      {emp.phone}
                    </p>

                    {/* Status dropdown */}
                    <div className="mt-2">
                      <Select
                        value={emp.status}
                        onValueChange={(val) => updateStatus(idx, val)}
                      >
                        <SelectTrigger className="h-7 text-[11px] w-[100px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="pass">Pass</SelectItem>
                          <SelectItem value="fail">Fail</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                Additional document verification
              </label>
              <div className="flex flex-col border rounded-md overflow-hidden">
                {[
                  "Aadhaar Verification",
                  "PAN Verification",
                  "Educational Certificates Verification",
                ].map((doc) => (
                  <label
                    key={doc}
                    className="flex items-center gap-2 px-3 py-2 border-b last:border-0 text-[12px] hover:bg-gray-50 cursor-pointer"
                  >
                    <input type="checkbox" /> {doc}
                  </label>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Footer Actions */}
      {/* <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" className="text-xs h-8 px-3" onClick={onBack}>
          Back
        </Button>
        <Button
          disabled={!selectedEmployee}
          className="bg-blue-600 text-white text-xs h-8 px-4"
          onClick={() =>
            onNext(selectedChecks, vendor, isManual ? "manual" : "vendor", selectedEmployee)
          }
        >
          Next
        </Button>
      </div> */}
    </div>
  )
}
