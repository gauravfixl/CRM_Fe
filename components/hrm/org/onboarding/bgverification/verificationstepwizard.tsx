"use client"

import { Button } from "@/components/ui/button"
import { Users, X, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import SelectEmployeesDrawer from "./selectedEmployeesDrawer"
import SelectedEmployeesStep from "./selectedEmployessstep"
import SelectChecksStep from "./selectcheckstep"
import FinalizeVerificationStep from "./finalstepverification"
import { showSuccess,showError } from "@/utils/toast"
interface VerificationWizardProps {
  open: boolean
  onClose: () => void
}

export default function VerificationWizard({ open, onClose }: VerificationWizardProps) {
  const [step, setStep] = useState(0)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [employees, setEmployees] = useState<any[]>([])
  const [selectedChecks, setSelectedChecks] = useState<string[]>([])
  const [vendor, setVendor] = useState<string>("OnGrid")
  const [selectedEmployee, setSelectedEmployee] = useState<string>("")
  


  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
  }, [open])

  const handleRemove = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.empId !== id))
  }

  const handleNext = () => {
    if (step < 2) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }
// Example: handler passed to SelectChecksStep
const handleSelectChecksNext = (
  selectedChecks: string[],
  vendor: string,
  mode: string,
  employeeId: string
) => {
  setSelectedEmployee(employeeId) // store employee globally
  // proceed to next step
  setStep(3)
}
 const handleStatusUpdate = (results: any) => {
    console.log("Verification results:", results)
  }
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-white z-50 flex flex-col text-[13px] text-gray-800"
          >
            {/* Header Bar */}
            <div className="flex justify-between items-center border-b px-6 py-3 bg-white">
              <div className="flex items-center gap-2">
                {/* Back button in header */}
                {step > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBack}
                    className="text-gray-600 hover:text-gray-800"
                    title="Go Back"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <h2 className="text-sm font-semibold">Start new verification</h2>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
                title="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Stepper */}
            <div className="flex justify-center items-center gap-6 border-b py-3 bg-gray-50 text-[12px] text-gray-600">
              {[
                { id: 0, label: "Select Employees" },
                { id: 1, label: "Select Checks" },
                { id: 2, label: "Finalize" },
              ].map(({ id, label }) => (
                <div key={id} className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      step === id
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 text-gray-400"
                    }`}
                  >
                    {id + 1}
                  </div>
                  <span
                    className={`${
                      step === id ? "font-medium text-blue-600" : "text-gray-600"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Main Step Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {step === 0 && (
                <>
                  {employees.length === 0 ? (
                    <div className="text-center mt-10">
                      <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <Button
                        onClick={() => setOpenDrawer(true)}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded"
                      >
                        Select Employees
                      </Button>
                    </div>
                  ) : (
                    <SelectedEmployeesStep
                      employees={employees}
                      onAddMore={() => setOpenDrawer(true)}
                      onNext={() => setStep(1)}
                      onRemove={handleRemove}
                    />
                  )}
                </>
              )}

             {step === 1 && (
 <SelectChecksStep
  onBack={() => setStep(1)}
  onNext={handleSelectChecksNext}
  employees={employees}
  selectedEmployee={selectedEmployee}
  setSelectedEmployee={setSelectedEmployee}
/>
)}


         {step === 2 && (
<FinalizeVerificationStep
  employees={employees}
  selectedEmployeeId={selectedEmployee} // 👈 pass selected employee id here
  onStatusUpdate={handleStatusUpdate}
/>

)}


            </div>

            {/* Footer Buttons (Back, Next, Close) */}
            <div className="flex justify-end items-center border-t px-6 py-3 bg-gray-50">
             

              <div className="flex gap-2">
                {step > 0 && (
                  <Button
                    variant="outline"
                    className="text-xs h-8 px-3"
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                )}
       <Button
  className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-4"
  onClick={() => {
    if (step === 2) {
      // ✅ Close wizard
      onClose()

      // ✅ Show toast
     showSuccess("Verification completed successfully");
    } else {
      handleNext()
    }
  }}
>
  {step === 2 ? "Finish" : "Next"}
</Button>


              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Employee Drawer */}
      <SelectEmployeesDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onProceed={(selected) => {
          setEmployees(selected)
          setOpenDrawer(false)
          setStep(0)
        }}
      />
    </>
  )
}
