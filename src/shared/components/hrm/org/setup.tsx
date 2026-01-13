"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  Calendar,
  Users,
  DollarSign,
  ClipboardList,
} from "lucide-react"
import OrgSetupWizard from "./orgSetupWIzard"

export default function SetupPage() {
  const [activeSection, setActiveSection] = useState<"dashboard" | "orgsetup">("dashboard")

  const [coreSetup] = useState([
    { title: "Org Setup", subtitle: "Org Setup", date: "24 Apr, 2024", icon: Users, key: "orgsetup" },
    { title: "Leave", subtitle: "Leave", date: "22 Apr, 2024", icon: Calendar },
    { title: "Attendance", subtitle: "Attendance", date: "22 Apr, 2024", icon: ClipboardList },
    { title: "Payroll", subtitle: "Payroll", date: "22 Apr, 2024", icon: DollarSign },
  ])

  const [imports] = useState([
    { title: "Employee Personal Details", subtitle: "Employee Personal Details", status: "Completed" },
    { title: "Employee Job Details", subtitle: "Employee Job Details", status: "Completed" },
    { title: "Carryover Leave Balance", subtitle: "Carryover Leave Balance", status: "Completed" },
    { title: "Consumed Leave Balance", subtitle: "Consumed Leave Balance", status: "Completed" },
    { title: "Current Salaries Import", subtitle: "Current Salaries Import", status: "Completed" },
    { title: "Previous Salaries Import", subtitle: "Previous Salaries Import", status: "Completed" },
  ])

  // 🔁 Show Org Setup Wizard if activeSection is "orgsetup"
  if (activeSection === "orgsetup") {
    return <OrgSetupWizard onBack={() => setActiveSection("dashboard")} />
  }

  return (
    <div className="p-4 space-y-6 text-sm text-gray-700 bg-gray-50 min-h-screen">
      {/* Core Setup Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold">Core Setup</h2>
          <span className="text-xs font-medium text-gray-500">100%</span>
        </div>
        <Progress value={100} className="h-2 bg-gray-100 mb-3" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {coreSetup.map((item, i) => (
            <Card
              key={i}
              onClick={() => item.key && setActiveSection(item.key as any)}
              className={`rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer ${
                item.key ? "hover:border-blue-400" : ""
              }`}
            >
              <CardHeader className="flex flex-row items-center gap-2 p-3 pb-1">
                <item.icon className="w-4 h-4 text-gray-500" />
                <CardTitle className="text-xs font-semibold">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 text-[11px]">
                <div className="text-gray-500 mb-1">{item.subtitle}</div>
                <div className="flex items-center text-blue-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  <span>Completed on {item.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Imports Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold">Imports</h2>
          <span className="text-xs font-medium text-gray-500">100%</span>
        </div>
        <Progress value={100} className="h-2 bg-gray-100 mb-3" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {imports.map((item, i) => (
            <Card
              key={i}
              className="rounded-lg border shadow-sm bg-blue-50 hover:bg-blue-100 transition"
            >
              <CardHeader className="p-3 pb-1">
                <CardTitle className="text-xs font-semibold text-gray-700">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 text-[11px] text-gray-600">
                <div>{item.subtitle}</div>
                <div className="flex items-center text-blue-700 mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  <span>{item.status}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
