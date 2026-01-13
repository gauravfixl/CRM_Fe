"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export default function NewEmployeeWizard({
  onClose,
}: {
  onClose?: () => void
}) {
  const [step, setStep] = useState(1)

  const next = () => {
    if (step < 4) setStep(step + 1)
  }

  const back = () => {
    if (step > 1) setStep(step - 1)
  }

  const transition = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.2 } },
  }

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed inset-0 bg-white shadow-lg z-50 flex flex-col text-xs sm:text-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-3 bg-gray-50">
        <h2 className="text-sm font-semibold">New Employee</h2>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-xs px-3 py-1"
          >
            Cancel
          </Button>
          <Button
            onClick={step === 4 ? onClose : next}
            className="bg-blue-600 text-white text-xs px-3 py-1"
          >
            {step === 4 ? "Save" : "Continue"}
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between px-6 py-4 border-b text-[11px]">
        {["Basic Details", "Job Details", "Work Details", "Compensation"].map(
          (label, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 ${
                step === i + 1 ? "text-blue-600 font-medium" : "text-gray-400"
              }`}
            >
              <div
                className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                  step === i + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-400"
                }`}
              >
                {i + 1}
              </div>
              <span>{label}</span>
            </div>
          )
        )}
      </div>

      {/* Step Forms */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              variants={transition}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-2 gap-3"
            >
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Work Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="usa">USA</SelectItem>
                </SelectContent>
              </Select>

              <Input placeholder="Employee Number" />
              <Input placeholder="First Name" />
              <Input placeholder="Middle Name" />
              <Input placeholder="Last Name" />
              <Input placeholder="Display Name" />

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>

              <Input type="date" placeholder="Date of Birth" />

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Nationality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="usa">USA</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Number Series" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>

              <Input placeholder="Work Email" />
              <Input placeholder="Mobile Number" />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={transition}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-2 gap-3"
            >
              <Input type="date" placeholder="Joining Date" />
              <Input placeholder="Job Title" />

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Time Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Time</SelectItem>
                  <SelectItem value="part">Part Time</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Legal Entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="golden">Golden Bolt - India</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Business Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bd">Business Development</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content">Content</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hyd">Hyderabad</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Worker Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perm">Permanent</SelectItem>
                </SelectContent>
              </Select>

              <Input placeholder="Reporting Manager" />

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Probation Policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3m">3 Months</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Notice Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">60 Days</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={transition}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-2 gap-3"
            >
              <label className="col-span-2 flex items-center gap-2">
                <input type="checkbox" /> Invite employee to login
              </label>
              <label className="col-span-2 flex items-center gap-2">
                <input type="checkbox" /> Enable onboarding flow
              </label>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Leave Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lp1">Leave Plan - India</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Holiday List" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Shift" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Weekly Off" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekends">Weekends</SelectItem>
                </SelectContent>
              </Select>

              <Input placeholder="Attendance Number" />

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Attendance Scheme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">India Capture Scheme</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tracking Policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="policy">Tracking Policy</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Overtime" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ot">Overtime</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Expense Policy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ep1">Expense Policy</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              variants={transition}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-2 gap-3"
            >
              <label className="col-span-2 flex items-center gap-2">
                <input type="checkbox" /> Enable payroll for this employee
              </label>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Pay Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pg1">Pay Group - India</SelectItem>
                </SelectContent>
              </Select>

              <Input placeholder="Annual Salary" />
              <label className="col-span-2 flex items-center gap-2">
                <input type="checkbox" /> Bonus amount included
              </label>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Salary Structure Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="range">Range Based</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tax Regime" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New Regime</SelectItem>
                  <SelectItem value="old">Old Regime</SelectItem>
                </SelectContent>
              </Select>

              <label className="flex items-center gap-2">
                <input type="checkbox" /> ESI eligible
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" /> LWF eligible
              </label>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer navigation */}
      <div className="flex justify-between px-6 py-3 border-t">
        <Button
          variant="outline"
          onClick={back}
          disabled={step === 1}
          className="text-xs px-3 py-1"
        >
          Back
        </Button>
        <Button
          onClick={step === 4 ? onClose : next}
          className="bg-blue-600 text-white text-xs px-3 py-1"
        >
          {step === 4 ? "Finish" : "Continue"}
        </Button>
      </div>
    </motion.div>
  )
}
