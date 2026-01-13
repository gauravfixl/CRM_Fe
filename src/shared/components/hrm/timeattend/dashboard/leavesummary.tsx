"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"

export default function LeaveSummary() {
  const [department, setDepartment] = useState("All Departments")
  const [location, setLocation] = useState("All Locations")

  // Dummy Data for Charts
  const leaveStatsData = [
    { date: "May 11", count: 1 },
    { date: "May 12", count: 1 },
    { date: "May 13", count: 2 },
    { date: "May 14", count: 3 },
    { date: "May 15", count: 4 },
    { date: "May 16", count: 4 },
    { date: "May 17", count: 2 },
    { date: "May 18", count: 3 },
    { date: "May 19", count: 1 },
    { date: "May 20", count: 2 },
    { date: "May 21", count: 3 },
    { date: "May 22", count: 4 },
    { date: "May 23", count: 4 },
    { date: "May 24", count: 2 },
    { date: "May 25", count: 1 },
    { date: "May 26", count: 2 },
    { date: "May 27", count: 4 },
    { date: "May 28", count: 3 },
    { date: "May 29", count: 3 },
    { date: "May 30", count: 2 },
    { date: "Jun 01", count: 3 },
    { date: "Jun 02", count: 3 },
    { date: "Jun 03", count: 1 },
    { date: "Jun 04", count: 3 },
    { date: "Jun 05", count: 2 },
    { date: "Jun 06", count: 3 },
    { date: "Jun 07", count: 2 },
    { date: "Jun 08", count: 2 },
    { date: "Jun 09", count: 1 },
  ]

  const leaveTypeData = [
    { name: "Paid", value: 60, color: "#4F46E5" },
    { name: "Unpaid", value: 20, color: "#F59E0B" },
    { name: "Sick", value: 15, color: "#10B981" },
    { name: "Privilege", value: 5, color: "#EC4899" },
  ]

  return (
    <div className="w-full p-2 space-y-4">
      {/* Header Filters */}
      <div className="flex justify-end items-center gap-2">
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-[140px] text-xs h-7">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Departments">All Departments</SelectItem>
            <SelectItem value="IT">IT</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="Sales">Sales</SelectItem>
          </SelectContent>
        </Select>

        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-[120px] text-xs h-7">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Locations">All Locations</SelectItem>
            <SelectItem value="Bangalore">Bangalore</SelectItem>
            <SelectItem value="Hyderabad">Hyderabad</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 border rounded-md px-2 py-[3px] text-xs text-gray-600">
          <CalendarIcon className="w-3 h-3" />
          <span>02 Sept 2025 - 08 Sept 2025</span>
        </div>
      </div>

      {/* Today’s Leave Stats */}
      <div>
        <p className="text-xs font-medium mb-2 text-gray-700">Today's leave stats</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[ 
            { label: "Paid Leave", value: 0, color: "border-blue-400" },
            { label: "Unpaid Leave", value: 0, color: "border-orange-400" },
            { label: "Sick Leave", value: 0, color: "border-green-400" },
            { label: "AWOL (Absent Without Leave)", value: 88, color: "border-pink-400", link: "View Employees" },
          ].map((item) => (
            <Card key={item.label} className={`p-2 border ${item.color} rounded-md text-xs flex flex-col justify-between`}>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{item.label}</span>
                {item.link && <span className="text-blue-600 cursor-pointer">{item.link}</span>}
              </div>
              <span className="text-xl font-semibold text-gray-800">{item.value}</span>
            </Card>
          ))}
        </div>
      </div>

      {/* Leave for Past Dates */}
      <div>
        <p className="text-xs font-medium mb-2 text-gray-700">Leave for past dates</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: "Employees on Leave", value: "0%", desc: "People on leave during selected duration", color: "border-purple-300" },
            { label: "Avg. Leave Taken", value: "0 Day", desc: "Average leave taken by an employee", color: "border-green-300" },
            { label: "Total Leave Balance", value: "9798.34 Days", desc: "Balance available with employees", color: "border-yellow-300" },
            { label: "Unplanned Leave Taken", value: "0 Day", desc: "Total leave applied after date has passed", color: "border-pink-300" },
          ].map((item) => (
            <Card key={item.label} className={`p-2 border ${item.color} rounded-md text-xs flex flex-col justify-between`}>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{item.label}</span>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">{item.value}</p>
                <p className="text-[10px] text-gray-500 mt-1">{item.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Employees Leave Stats Graph */}
      <Card className="p-3 mt-4">
        <p className="text-sm font-medium mb-3 text-gray-700">Employees’ Leave Stats</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={leaveStatsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Employees Leave by Types Graph */}
      <Card className="p-3 mt-4">
        <p className="text-sm font-medium mb-3 text-gray-700">Employees’ Leave by Types</p>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={leaveTypeData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={40}
              dataKey="value"
            >
              {leaveTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
