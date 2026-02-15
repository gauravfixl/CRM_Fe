// "use client"

// import { Card } from "@/components/ui/card"
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

// const data = [
//   { date: "02 Sep", IT: 0, HR: 0, TeleSales: 0 },
//   { date: "03 Sep", IT: 0.15, HR: 0.05, TeleSales: 0.12 },
//   { date: "04 Sep", IT: 0.05, HR: 0.02, TeleSales: 0.06 },
//   { date: "05 Sep", IT: 0.13, HR: 0.04, TeleSales: 0.09 },
//   { date: "06 Sep", IT: 0, HR: 0, TeleSales: 0 },
//   { date: "07 Sep", IT: 0, HR: 0, TeleSales: 0 },
//   { date: "08 Sep", IT: 0, HR: 0, TeleSales: 0 },
// ]

// export default function OvertimeHours() {
//   return (
//     <Card className="w-full border p-2 rounded-lg shadow-sm">
//       <div className="flex flex-col md:flex-row gap-2">
//         {/* Left: Department List */}
//         <div className="w-full md:w-1/3 border-r border-gray-100 pr-2 space-y-2">
//           <p className="font-medium text-xs mb-2">Most overtime hours worked by department</p>
//           {[
//             { name: "IT", color: "bg-purple-400", employees: 2 },
//             { name: "HR", color: "bg-green-400", employees: 3 },
//             { name: "Tele Sales", color: "bg-cyan-400", employees: 5 },
//             { name: "Express Sales", color: "bg-pink-400", employees: 3 },
//             { name: "Sales > Inside Sales", color: "bg-yellow-400", employees: 1 },
//           ].map((dept) => (
//             <div key={dept.name} className="flex items-center justify-between text-xs">
//               <div className="flex items-center gap-2">
//                 <span className={`w-3 h-3 rounded-full ${dept.color}`}></span>
//                 <span>{dept.name}</span>
//               </div>
//               <span className="text-gray-500">0 Avg. Hrs</span>
//             </div>
//           ))}
//         </div>

//         {/* Right: Chart */}
//         <div className="flex-1">
//           <ResponsiveContainer width="100%" height={180}>
//             <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
//               <XAxis dataKey="date" tick={{ fontSize: 10 }} />
//               <YAxis tick={{ fontSize: 10 }} />
//               <Tooltip contentStyle={{ fontSize: "10px" }} />
//               <Line type="monotone" dataKey="IT" stroke="#C084FC" strokeWidth={1.5} dot={false} />
//               <Line type="monotone" dataKey="HR" stroke="#4ADE80" strokeWidth={1.5} dot={false} />
//               <Line type="monotone" dataKey="TeleSales" stroke="#22D3EE" strokeWidth={1.5} dot={false} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </Card>
//   )
// }


"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import EmployeeHoursTable from "./employeehourstable"

const chartData = [
  { date: "02 Sep", IT: 0, HR: 0, TeleSales: 0 },
  { date: "03 Sep", IT: 0.15, HR: 0.05, TeleSales: 0.12 },
  { date: "04 Sep", IT: 0.05, HR: 0.02, TeleSales: 0.06 },
  { date: "05 Sep", IT: 0.13, HR: 0.04, TeleSales: 0.09 },
  { date: "06 Sep", IT: 0, HR: 0, TeleSales: 0 },
  { date: "07 Sep", IT: 0, HR: 0, TeleSales: 0 },
  { date: "08 Sep", IT: 0, HR: 0, TeleSales: 0 },
]

// 🟢 Update the fields for EmployeeHoursTable
const fields = [
  { key: "name", label: "Name" },
  { key: "department", label: "Department" },
  { key: "avgOvertime", label: "Avg. Overtime Hours" },
  { key: "totalOvertime", label: "Total Overtime Hours" },
]

// 🟢 Mock data (adapt this later to live data)
const data = [
  { name: "Abhishek", department: "IT", avgOvertime: "0.08 hrs", totalOvertime: "3.2 hrs" },
  { name: "Priya", department: "HR", avgOvertime: "0.03 hrs", totalOvertime: "1.4 hrs" },
  { name: "Ravi", department: "Tele Sales", avgOvertime: "0.09 hrs", totalOvertime: "4.8 hrs" },
  { name: "Sanya", department: "Express Sales", avgOvertime: "0.07 hrs", totalOvertime: "2.6 hrs" },
  { name: "Kiran", department: "Inside Sales", avgOvertime: "0.05 hrs", totalOvertime: "1.9 hrs" },
]

export default function OvertimeHours() {
  return (
    <Card className="w-full border p-2 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row gap-2">
        {/* Left: Department List */}
        <div className="w-full md:w-1/3 border-r border-gray-100 pr-2 space-y-2">
          <p className="font-medium text-xs mb-2">Most overtime hours worked by department</p>
          {[
            { name: "IT", color: "bg-purple-400" },
            { name: "HR", color: "bg-green-400" },
            { name: "Tele Sales", color: "bg-cyan-400" },
            { name: "Express Sales", color: "bg-pink-400" },
            { name: "Inside Sales", color: "bg-yellow-400" },
          ].map((dept) => (
            <div key={dept.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${dept.color}`}></span>
                <span>{dept.name}</span>
              </div>
              <span className="text-gray-500">0 Avg. Hrs</span>
            </div>
          ))}
        </div>

        {/* Right: Overtime Graph */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: "10px" }} />
              <Line type="monotone" dataKey="IT" stroke="#C084FC" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="HR" stroke="#4ADE80" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="TeleSales" stroke="#22D3EE" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🟢 Employee Hours Table Below Graph */}
      <div className="mt-4">
      <EmployeeHoursTable
  data={data}
  fields={["name", "department", "avgOvertime", "totalOvertime"]}
/>
      </div>
    </Card>
  )
}
