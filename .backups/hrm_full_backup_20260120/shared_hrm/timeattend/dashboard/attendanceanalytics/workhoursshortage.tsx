"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import EmployeeHoursTable from "@/components/hrm/timeattend/dashboard/attendanceanalytics/employeehourstable"

// 🟢 Department color mapping
const departments = [
  { key: "Office", color: "#C084FC" }, // purple
  { key: "InsideSales", color: "#4ADE80" }, // green
  { key: "Engineering", color: "#22D3EE" }, // cyan
  { key: "SalesInside", color: "#F472B6" }, // pink
  { key: "SalesSolution", color: "#FACC15" }, // yellow
]

// 🟢 Chart data showing shortage hours over time
const data = [
  { date: "02 Sep", Office: 6, InsideSales: 5, Engineering: 7, SalesInside: 4, SalesSolution: 6 },
  { date: "03 Sep", Office: 5, InsideSales: 5, Engineering: 6, SalesInside: 4.5, SalesSolution: 6.5 },
  { date: "04 Sep", Office: 4, InsideSales: 5.5, Engineering: 7, SalesInside: 5, SalesSolution: 7 },
  { date: "05 Sep", Office: 5, InsideSales: 6, Engineering: 6.5, SalesInside: 5, SalesSolution: 6 },
  { date: "06 Sep", Office: 0, InsideSales: 0, Engineering: 0, SalesInside: 0, SalesSolution: 0 },
  { date: "07 Sep", Office: 0, InsideSales: 0, Engineering: 0, SalesInside: 0, SalesSolution: 0 },
  { date: "08 Sep", Office: 7, InsideSales: 8, Engineering: 7.5, SalesInside: 7, SalesSolution: 8 },
]

// 🟢 Table data (mock)
const shortageData = [
  { name: "Abhishek", department: "IT", totalShortageHours: "2.5 hrs", avgShortageHours: "0.5 hrs" },
  { name: "Priya", department: "HR", totalShortageHours: "1.8 hrs", avgShortageHours: "0.36 hrs" },
  { name: "Ravi", department: "Tele Sales", totalShortageHours: "3.2 hrs", avgShortageHours: "0.64 hrs" },
  { name: "Sanya", department: "Inside Sales", totalShortageHours: "1.2 hrs", avgShortageHours: "0.24 hrs" },
  { name: "Kiran", department: "Engineering", totalShortageHours: "2 hrs", avgShortageHours: "0.4 hrs" },
]

export default function WorkHoursShortage() {
  return (
    <Card className="w-full border p-2 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row gap-2">
        {/* Left Section — Department legend */}
        <div className="w-full md:w-1/3 border-r border-gray-100 pr-2 space-y-2">
          <p className="font-medium text-xs mb-2">Work hours shortage by department</p>
          {departments.map((dept) => (
            <div key={dept.key} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></span>
                <span>{dept.key.replace(/([A-Z])/g, " $1").trim()}</span>
              </div>
              <div className="flex flex-col items-end text-gray-500">
                <span>8 Avg. Hrs</span>
                <span>40 Total shortage hrs</span>
              </div>
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
          data={shortageData}
          fields={["name", "department", "totalShortageHours", "avgShortageHours"]}
        />
      </div>
    </Card>
  )
}
