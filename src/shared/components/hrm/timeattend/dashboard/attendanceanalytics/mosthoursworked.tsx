// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Calendar } from "lucide-react"
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
// import { Button } from "@/components/ui/button"
// import { cn } from "@/lib/utils"

// const data = [
//   { date: "02 Sep", IT: 0, HR: 0.05, "Tele Sales": 0 },
//   { date: "03 Sep", IT: 0.18, HR: 0.08, "Tele Sales": 0.05 },
//   { date: "04 Sep", IT: 0.04, HR: 0.06, "Tele Sales": 0 },
//   { date: "05 Sep", IT: 0.16, HR: 0.05, "Tele Sales": 0.04 },
//   { date: "06 Sep", IT: 0, HR: 0, "Tele Sales": 0 },
//   { date: "07 Sep", IT: 0, HR: 0, "Tele Sales": 0 },
//   { date: "08 Sep", IT: 0, HR: 0, "Tele Sales": 0 },
// ]

// export default function MostHoursWorked() {
//   const [selectedTab, setSelectedTab] = useState("most")

//   return (
//     <div className="p-3 space-y-2">
//       <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
//         <TabsList className="grid grid-cols-4 w-fit border rounded-lg text-xs">
//           <TabsTrigger value="most" className="px-2 py-1">Most Hours Worked</TabsTrigger>
//           <TabsTrigger value="overtime" className="px-2 py-1">Overtime Hours</TabsTrigger>
//           <TabsTrigger value="shortage" className="px-2 py-1">Work Hours Shortage</TabsTrigger>
//           <TabsTrigger value="breaks" className="px-2 py-1">Most Breaks Taken</TabsTrigger>
//         </TabsList>
//       </Tabs>

//       <Card className="shadow-sm border rounded-xl">
//         <CardHeader className="pb-1">
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-sm font-medium">Avg. work hours leaderboard</CardTitle>
//             <Button
//               variant="outline"
//               size="sm"
//               className="h-7 text-[10px] px-2 flex items-center gap-1"
//             >
//               <Calendar className="w-3 h-3" />
//               02 Sept 2025 - 08 Sept 2025
//             </Button>
//           </div>
//           <p className="text-[10px] text-muted-foreground mt-1">
//             Most hours worked by department
//           </p>
//         </CardHeader>

//         <CardContent className="grid grid-cols-12 gap-2">
//           <div className="col-span-4 space-y-1">
//             {[
//               { name: "IT", employees: 2, color: "bg-pink-400" },
//               { name: "HR", employees: 3, color: "bg-green-400" },
//               { name: "Tele Sales", employees: 5, color: "bg-yellow-400" },
//               { name: "Express Sales", employees: 3, color: "bg-blue-400" },
//               { name: "Sales > Inside Sales", employees: 1, color: "bg-orange-400" },
//             ].map((dept, i) => (
//               <div key={i} className="flex items-center justify-between text-xs border-b pb-1">
//                 <div className="flex items-center gap-2">
//                   <span className={cn("w-2.5 h-2.5 rounded-full", dept.color)}></span>
//                   <span>{dept.name}</span>
//                 </div>
//                 <span className="text-muted-foreground">0 Avg. Hrs</span>
//               </div>
//             ))}
//           </div>

//           <div className="col-span-8">
//             <ResponsiveContainer width="100%" height={180}>
//               <LineChart data={data}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                 <XAxis dataKey="date" tick={{ fontSize: 10 }} />
//                 <YAxis tick={{ fontSize: 10 }} />
//                 <Tooltip contentStyle={{ fontSize: "10px" }} />
//                 <Line type="monotone" dataKey="IT" stroke="#3b82f6" strokeWidth={1.5} />
//                 <Line type="monotone" dataKey="HR" stroke="#22c55e" strokeWidth={1.5} />
//                 <Line type="monotone" dataKey="Tele Sales" stroke="#facc15" strokeWidth={1.5} />
//               </LineChart>
//             </ResponsiveContainer>

//             <div className="flex justify-between text-[10px] mt-1 text-muted-foreground">
//               <span>Highest Avg. Work Hours: CS</span>
//               <span>Min. Work Hours: 0</span>
//               <span>Max. Work Hours: 0</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { Button } from "@/components/ui/button"
import EmployeeHoursTable, { EmployeeHours } from "@/components/hrm/timeattend/dashboard/attendanceanalytics/employeehourstable"

const employeeData: EmployeeHours[] = [
  { employee: "Faki Admin", businessUnit: "Not Available", department: "Not Available", location: "Head Office", totalHours: "8h", avgHours: "1h 20m" },
  { employee: "Laxmi Brandari", businessUnit: "Not Available", department: "Operations", location: "Head Office", totalHours: "9h 30m", avgHours: "1h 35m" },
  { employee: "Manish Choudhary", businessUnit: "Not Available", department: "Operations", location: "Head Office", totalHours: "7h 36m", avgHours: "1h 16m" },
  { employee: "Nainy Verma", businessUnit: "Not Available", department: "HR", location: "Head Office", totalHours: "8h 10m", avgHours: "1h 22m" },
  { employee: "Pinki Manda", businessUnit: "Not Available", department: "Operations", location: "Head Office", totalHours: "9h", avgHours: "1h 30m" },
]

// helper: convert totalHours like "9h 30m" → 9.5
function parseHoursToNumber(hours: string): number {
  const match = hours.match(/(\d+)h(?:\s*(\d+)m)?/)
  if (!match) return 0
  const h = parseInt(match[1]) || 0
  const m = parseInt(match[2]) || 0
  return h + m / 60
}

// create chart data from employee list
const chartData = employeeData.map((emp) => ({
  name: emp.employee,
  Hours: parseHoursToNumber(emp.totalHours),
}))

export default function MostHoursWorked() {
  return (
    <div className="p-3 space-y-4">
      <Card className="shadow-sm border rounded-xl">
        <CardHeader className="pb-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Employee Hours Leaderboard</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[10px] px-2 flex items-center gap-1"
            >
              <Calendar className="w-3 h-3" />
              02 Sept 2025 - 08 Sept 2025
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            Total & Average work hours by employee
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Graph */}
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis
                tick={{ fontSize: 10 }}
                label={{ value: "Hours", angle: -90, position: "insideLeft", fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{ fontSize: "10px" }}
                formatter={(value: number, _name, props) => [
                  `${value.toFixed(2)} hrs`,
                  `Employee: ${props.payload.name}`,
                ]}
              />
              <Line type="monotone" dataKey="Hours" stroke="#3b82f6" strokeWidth={1.5} />
            </LineChart>
          </ResponsiveContainer>

          {/* Table below the graph */}
          <EmployeeHoursTable
            data={employeeData}
            fields={[
              "employee",
              "businessUnit",
              "department",
              "location",
              "totalHours",
              "avgHours",
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
