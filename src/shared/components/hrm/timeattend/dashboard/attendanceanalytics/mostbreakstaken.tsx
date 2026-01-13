"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import EmployeeHoursTable from "@/components/hrm/timeattend/dashboard/attendanceanalytics/employeehourstable"

// 🟢 Department color mapping
const departments = [
  { key: "IT", color: "#C084FC" }, // purple
  { key: "HR", color: "#4ADE80" }, // green
  { key: "TeleSales", color: "#22D3EE" }, // cyan
  { key: "ExpressSales", color: "#F472B6" }, // pink
  { key: "SalesInside", color: "#FACC15" }, // yellow
]

// 🟢 Chart data — number of breaks taken by department
const data = [
  { date: "02 Sep", IT: 0, HR: 0, TeleSales: 0, ExpressSales: 0, SalesInside: 0 },
  { date: "03 Sep", IT: 0.15, HR: 0.05, TeleSales: 0.12, ExpressSales: 0.08, SalesInside: 0.1 },
  { date: "04 Sep", IT: 0.05, HR: 0.02, TeleSales: 0.06, ExpressSales: 0.04, SalesInside: 0.05 },
  { date: "05 Sep", IT: 0.13, HR: 0.04, TeleSales: 0.09, ExpressSales: 0.07, SalesInside: 0.06 },
  { date: "06 Sep", IT: 0, HR: 0, TeleSales: 0, ExpressSales: 0, SalesInside: 0 },
  { date: "07 Sep", IT: 0, HR: 0, TeleSales: 0, ExpressSales: 0, SalesInside: 0 },
  { date: "08 Sep", IT: 0, HR: 0, TeleSales: 0, ExpressSales: 0, SalesInside: 0 },
]

// 🟢 Table data (mock)
const breakData = [
  { name: "Abhishek", department: "IT", totalBreaks: "5", avgBreaksPerDay: "1" },
  { name: "Priya", department: "HR", totalBreaks: "4", avgBreaksPerDay: "0.8" },
  { name: "Ravi", department: "Tele Sales", totalBreaks: "6", avgBreaksPerDay: "1.2" },
  { name: "Sanya", department: "Express Sales", totalBreaks: "3", avgBreaksPerDay: "0.6" },
  { name: "Kiran", department: "Sales > Inside Sales", totalBreaks: "5", avgBreaksPerDay: "1" },
]

export default function MostBreaksTaken() {
  return (
    <Card className="w-full border p-2 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row gap-2">
        {/* Left Section — Department legend */}
        <div className="w-full md:w-1/3 border-r border-gray-100 pr-2 space-y-2">
          <p className="font-medium text-xs mb-2">Most breaks taken by department</p>
          {departments.map((dept) => (
            <div key={dept.key} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></span>
                <span>{dept.key.replace(/([A-Z])/g, " $1").trim()}</span>
              </div>
              <span className="text-gray-500">0 Avg. Breaks</span>
            </div>
          ))}
        </div>

        {/* Right Section — Chart */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: "10px" }} />

              {/* Dynamically render a line per department */}
              {departments.map((dept) => (
                <Line
                  key={dept.key}
                  type="monotone"
                  dataKey={dept.key}
                  stroke={dept.color}
                  strokeWidth={1.5}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Below the Chart */}
      <div className="mt-4">
        <EmployeeHoursTable
          data={breakData}
          fields={["name", "department", "totalBreaks", "avgBreaksPerDay"]}
        />
      </div>
    </Card>
  )
}
