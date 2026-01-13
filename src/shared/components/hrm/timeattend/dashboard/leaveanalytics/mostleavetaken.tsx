"use client"

import { Card } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

// Chart data – employees on leave per date per department
const data = [
  { date: "16 Oct", "Human Resource": 0, Operations: 0, Administration: 0 },
  { date: "17 Oct", "Human Resource": 0, Operations: 0, Administration: 0 },
  { date: "18 Oct", "Human Resource": 1, Operations: 0, Administration: 0 },
  { date: "19 Oct", "Human Resource": 0, Operations: 0, Administration: 0 },
  { date: "20 Oct", "Human Resource": 0, Operations: 0, Administration: 0 },
  { date: "21 Oct", "Human Resource": 1, Operations: 0, Administration: 0 },
  { date: "22 Oct", "Human Resource": 0, Operations: 0, Administration: 0 },
]

// Department info
const departmentData = [
  { color: "#A855F7", dept: "Human Resource", employees: 2, days: 2 },
  { color: "#84CC16", dept: "Operations", employees: 6, days: 0 },
  { color: "#3B82F6", dept: "Administration", employees: 1, days: 0 },
]

// Employee-level data
const employeeTable = [
  {
    employee: "Nainy Verma",
    businessUnit: "Not Available",
    department: "Human Resource",
    location: "Head Office",
    leaveInstances: 2,
    totalLeaveTaken: "2 days",
  },
]

export default function MostLeaveTaken() {
  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-xs font-semibold">Most leave taken by department</p>
        <div className="text-xs text-gray-500 flex gap-4">
          <span className="cursor-pointer text-blue-600">by Department</span>
          <span className="cursor-pointer">by Location</span>
        </div>
      </div>

      {/* --- First Section: Department list + Graph + Overview --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Left: Department List */}
        <Card className="p-3 space-y-2 col-span-1 border-gray-200">
          {departmentData.map((d) => (
            <div key={d.dept} className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                <span className="text-gray-700 truncate w-[120px]">{d.dept}</span>
              </div>
              <div className="text-right text-gray-600">
                <p className="text-xs" >{d.days} days</p>
                <p className="text-[10px] text-gray-400">{d.employees} Employees</p>
              </div>
            </div>
          ))}
        </Card>

        {/* Right: Graph + Overview */}
        <Card className="p-3 col-span-3">
          {/* Chart */}
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: "10px" }} />
              <Legend wrapperStyle={{ fontSize: "10px" }} />
              {departmentData.map((d) => (
                <Line
                  key={d.dept}
                  type="monotone"
                  dataKey={d.dept}
                  stroke={d.color}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>

          {/* Overview Summary */}
          <div className="flex justify-between text-xs text-gray-600 mt-2 border-t pt-2">
            <div>
              <p className="font-semibold text-xs">Most Leave Taken</p>
              <p className="text-xs">Human Resource</p>
            </div>
            <div>
              <p className="font-semibold text-xs">Min. Leave on a Day</p>
              <p className="text-xs">1 Day</p>
            </div>
            <div>
              <p className="font-semibold text-xs">Max. Leave on a Day</p>
              <p className="text-xs">1 Day</p>
            </div>
          </div>
        </Card>
      </div>

      {/* --- Second Section: Employee Table --- */}
      <Card className="p-3">
        <table className="w-full text-xs text-gray-700">
          <thead className="border-b font-semibold text-gray-600">
            <tr>
              <th className="text-left py-1">EMPLOYEE</th>
              <th className="text-left py-1">BUSINESS UNIT</th>
              <th className="text-left py-1">DEPARTMENT</th>
              <th className="text-left py-1">LOCATION</th>
              <th className="text-center py-1">LEAVE INSTANCES</th>
              <th className="text-center py-1">TOTAL LEAVE TAKEN</th>
            </tr>
          </thead>
          <tbody>
            {employeeTable.map((emp) => (
              <tr key={emp.employee} className="border-b last:border-0">
                <td className="py-1 text-blue-600">{emp.employee}</td>
                <td className="py-1">{emp.businessUnit}</td>
                <td className="py-1">{emp.department}</td>
                <td className="py-1">{emp.location}</td>
                <td className="py-1 text-center">{emp.leaveInstances}</td>
                <td className="py-1 text-center">{emp.totalLeaveTaken}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
