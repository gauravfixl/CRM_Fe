"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import TabBar from "@/components/hrm/tabbar"

export default function DashboardPage() {
  const [activeSubTab, setActiveSubTab] = useState("Summary")

  const employeeStats = [
    { title: "Total headcount", value: 1526, change: -5 },
    { title: "Registered", value: 828 },
    { title: "Not invited", value: 143 },
    { title: "Yet to register", value: 795 },
  ]

  const pendingActions = [
    { title: "Documents", count: 3 },
    { title: "Expenses", count: 184 },
    { title: "Tickets", count: 341 },
    { title: "Probations", count: 662 },
    { title: "Join Tasks", count: 3696 },
    { title: "Exit Tasks", count: 308 },
    { title: "Profile Changes", count: 20 },
  ]

  const loginData = [
    { date: "25 Apr", count: 31 },
    { date: "26 Apr", count: 24 },
    { date: "27 Apr", count: 23 },
    { date: "28 Apr", count: 22 },
    { date: "29 Apr", count: 3 },
    { date: "30 Apr", count: 4 },
    { date: "01 May", count: 18 },
    { date: "02 May", count: 21 },
    { date: "03 May", count: 23 },
    { date: "04 May", count: 17 },
    { date: "05 May", count: 5 },
    { date: "06 May", count: 17 },
    { date: "07 May", count: 23 },
  ]

  return (
    <div className="p-4 space-y-4 text-xs text-gray-700 min-h-screen bg-gray-100">
      <TabBar
        tabs={["Summary", "Analytics", "Employee Reports", "Audit Logs"]}
        onTabChange={setActiveSubTab}
      />

      {activeSubTab === "Summary" && (
        <>
          <div className="grid grid-cols-4 gap-2">
            {employeeStats.map((stat, i) => (
              <Card key={i} className="rounded-lg border p-1">
                <CardContent className="p-1">
                  <p className="text-[10px] text-gray-500">{stat.title}</p>
                  <h2 className="text-lg font-semibold leading-tight">{stat.value}</h2>
                  {stat.change && (
                    <p className={`text-[9px] ${stat.change < 0 ? "text-red-500" : "text-green-500"}`}>
                      {stat.change > 0 ? "+" : ""}{stat.change}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border rounded-lg">
            <CardHeader className="pb-1 pt-2 px-3">
              <CardTitle className="text-[12px] font-semibold">Pending Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 px-3 pb-2">
              {pendingActions.map((p, i) => (
                <div key={i} className="flex flex-col items-center w-14">
                  <div className="text-[11px] font-semibold text-blue-600">{p.count}</div>
                  <div className="text-[9px] text-gray-500">{p.title}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-lg border">
            <CardHeader className="pb-1 pt-2 px-3">
              <CardTitle className="text-[12px] font-semibold">Employee Login Summary</CardTitle>
            </CardHeader>
            <CardContent className="h-36 px-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={loginData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 9 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#82ca9d" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}

      {activeSubTab === "Analytics" && (
        <div className="text-sm text-gray-600 p-3">📊 Analytics dashboard coming soon...</div>
      )}

      {activeSubTab === "Employee Reports" && (
        <div className="text-sm text-gray-600 p-3">📁 Employee reports section coming soon...</div>
      )}

      {activeSubTab === "Audit Logs" && (
        <div className="text-sm text-gray-600 p-3">📝 Audit logs section coming soon...</div>
      )}
    </div>
  )
}
