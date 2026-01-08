"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Pencil } from "lucide-react"
import AddProbationPolicy from "./addprobationpolicy"
import ProbationEmployeeTable from "./inprobationemployeelist"
import { ProbationPolicyWizard } from "./editprobationpolicywizard"
import ProbationFeedbackForm from "./probationfeedbackform"
import ProbationEvaluationTable, { Employee } from "./inevaluationtable"
import CompletedProbationActionsTable from "./completedprobationactiontable"

export default function ProbationPolicyPage() {
  const [activeTab, setActiveTab] = useState("Probation Policy")
  const [showAdd, setShowAdd] = useState(false)
  const [openWizard, setOpenWizard] = useState(false)

  // Dummy probation policies
  const [policies, setPolicies] = useState([
    {
      id: 1,
      name: "Probation-India",
      employees: 56,
      default: false,
      duration: "3 Months",
      maxExtension: "0 Times",
      evaluateEnd: "No",
      evaluationForm: "Enabled",
      autoStart: "15 Days before end",
      completeBefore: "30 Days before end date",
      evaluators: "Reporting Manager",
      region: "India",
    },
    {
      id: 2,
      name: "Probation Policy - ME",
      employees: 17,
      default: true,
      duration: "6 Months",
      maxExtension: "0 Times",
      evaluateEnd: "Yes",
      evaluationForm: "Enabled",
      autoStart: "15 Days before end",
      completeBefore: "90 Days before end date",
      evaluators: "Reporting Manager",
      region: "Middle East",
    },
  ])

  // Dummy Employees
  const dummyEmployees: Employee[] = [
    {
      id: 1,
      name: "Marina Marine",
      title: "Customer Success Manager",
      department: "HR",
      subDepartment: "Onboarding",
      location: "Hyderabad",
      businessUnit: "HR",
      joiningDate: "11 Jan, 2025",
      probationEnd: "11 Apr, 2025",
      feedback: "",
      waitingOn: "Pending",
    },
    {
      id: 2,
      name: "TST TEST",
      title: "COO",
      department: "Dev",
      subDepartment: "Ops",
      location: "Haryana",
      businessUnit: "Operations",
      joiningDate: "09 Nov, 2024",
      probationEnd: "07 Feb, 2025",
      feedback: "",
      waitingOn: "Pending",
    },
  ]

  const [selected, setSelected] = useState(policies[1])
  const [probationEmployees, setProbationEmployees] = useState<Employee[]>(dummyEmployees)
  const [evaluationEmployees, setEvaluationEmployees] = useState<Employee[]>([])
  const [completedEmployees, setCompletedEmployees] = useState<Employee[]>([])

  // Move selected employees from probation → evaluation
  const handleInitiateEvaluation = (selectedEmployees: Employee[]) => {
    setProbationEmployees((prev) =>
      prev.filter((emp) => !selectedEmployees.some((sel) => sel.id === emp.id))
    )
    setEvaluationEmployees((prev) => [...prev, ...selectedEmployees])
  }

  // Update probation end date
  const handleUpdateProbationDate = (employeeId: number, newDate: string) => {
    setProbationEmployees((prev) =>
      prev.map((emp) =>
        emp.id === employeeId ? { ...emp, probationEnd: newDate } : emp
      )
    )
  }

  // Add new policy
  const handleAddPolicy = (newPolicy: any) => {
    setPolicies([...policies, { id: Date.now(), ...newPolicy }])
    setSelected(newPolicy)
    setShowAdd(false)
  }

  // Edit policy
  const handleEdit = (policy: any) => {
    setSelected(policy)
    setOpenWizard(true)
  }

  // Save policy
  const handleSave = (updatedPolicy: any) => {
    setPolicies((prev) =>
      prev.map((p) => (p.name === updatedPolicy.name ? updatedPolicy : p))
    )
  }

  // ✅ Handle Mark Probation as Completed
  const handleMarkCompleted = (employee: Employee) => {
    // Remove from evaluation
    setEvaluationEmployees((prev) => prev.filter((e) => e.id !== employee.id))
    // Add to completed
    setCompletedEmployees((prev) => [...prev, employee])
  }

  const tabs = [
    "In Probation",
    "Evaluation in Progress",
    "Completed Probation Actions",
    "Probation Policy",
    "Probation Feedback Form",
  ]


  return (
    <div className="w-full bg-gray-50 rounded-md border border-gray-200 p-3 text-[11px]">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-3 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab
                ? "bg-blue-100 text-blue-700 border border-blue-500 rounded-t-md"
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-t-md"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Probation Policy Tab */}
      {activeTab === "Probation Policy" && (
        <>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-sm font-semibold text-gray-800">Probation Policy</h1>
            <Button
              size="sm"
              className="text-[11px] h-7 px-3 font-medium"
              onClick={() => setShowAdd(true)}
            >
              + Add Probation Policy
            </Button>
          </div>
          <p className="text-gray-500 mb-3">
            Here you can configure and manage the probation policy of employees.
          </p>

          <div className="flex gap-2">
            {/* Sidebar */}
            <div className="w-[28%] bg-white border border-gray-200 rounded-md overflow-hidden">
              {policies.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`flex justify-between items-center px-3 py-[6px] border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-all ${
                    selected.id === p.id ? "bg-blue-50 border-l-2 border-blue-500" : ""
                  }`}
                >
                  <div>
                    <p className="font-medium text-gray-800 leading-tight text-[11px]">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-gray-500">{p.employees} Employees</p>
                  </div>
                  {p.default && (
                    <span className="text-[9px] bg-gray-100 text-gray-600 px-2 py-[1px] rounded">
                      DEFAULT
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white border border-gray-200 rounded-md p-3">
              <div className="flex justify-between items-start border-b border-gray-100 pb-2 mb-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-800">{selected.name}</h2>
                  <p className="text-[10px] text-gray-500">
                    This policy will be applicable for all {selected.region} employees
                  </p>
                </div>
                <div className="text-right text-[10px] text-gray-600">
                  <p>
                    <span className="font-semibold text-xs">Duration:</span>{" "}
                    {selected.duration}
                  </p>
                  <p>
                    <span className="font-semibold text-xs">Max Extension:</span>{" "}
                    {selected.maxExtension}
                  </p>
                </div>
              </div>

              <Card className="border border-gray-200 rounded-md shadow-none">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h6 className="font-semibold text-gray-800 text-[12px]">
                      Probation Policy Settings
                    </h6>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[11px] text-blue-600 hover:bg-transparent"
                      onClick={() => handleEdit(selected)}
                    >
                      <Pencil className="w-3 h-3 mr-1" /> Edit
                    </Button>
                  </div>
                  <Separator className="mb-2" />

                  <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
                    <p>
                      <span className="font-medium text-gray-800 text-xs">
                        Evaluate at the end of probation: {selected.evaluateEnd}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-800 text-xs">
                        Probation Evaluation Form: {selected.evaluationForm}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-800 text-xs">
                        Evaluation starts automatically: {selected.autoStart}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-gray-800 text-xs">
                        Evaluation completed before: {selected.completeBefore}
                      </span>
                    </p>
                    <p className="col-span-2">
                      <span className="font-medium text-gray-800 text-xs">
                        Probation Evaluators: {selected.evaluators}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Add Policy Modal */}
          {showAdd && (
            <AddProbationPolicy
              onClose={() => setShowAdd(false)}
              onSave={handleAddPolicy}
            />
          )}
        </>
      )}

      {/* ✅ In Probation Tab — now passing dummyEmployees */}
      {activeTab === "In Probation" && (
        <ProbationEmployeeTable  employees={probationEmployees}
        onInitiateEvaluation={handleInitiateEvaluation}
        onUpdateProbationDate={handleUpdateProbationDate} />
      )}

      {/* ✅ Other Tabs */}
      {activeTab === "Evaluation in Progress" && (
        <ProbationEvaluationTable
          employees={evaluationEmployees}
          onMarkCompleted={handleMarkCompleted} // ✅ pass callback
        />
      )}
        
      {activeTab === "Completed Probation Actions" && (
        <CompletedProbationActionsTable employees={completedEmployees} />
      )}

      {activeTab === "Probation Feedback Form" && <ProbationFeedbackForm />}

      {/* ✅ Wizard */}
      <ProbationPolicyWizard
        open={openWizard}
        onClose={() => setOpenWizard(false)}
        policy={selected}
        onSave={(updatedPolicy) => handleSave(updatedPolicy)}
      />
    </div>
  )
}
