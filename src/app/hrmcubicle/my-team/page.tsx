"use client"
import TabBar from "@/components/hrm/tabbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react";
export default function MyTeamPage() {
  const [activeTab,setActiveTab]= useState("Summary")
  return (
    <div className="space-y-4 text-[13px] text-gray-700">
    <TabBar tabs={[
         "Summary"
        ]}
        onTabChange={setActiveTab}
      />

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
        <Metric title="Employees On Time today" value="0" color="border-l-sky-500" />
        <Metric title="Late Arrivals today" value="0" color="border-l-fuchsia-500" />
        <Metric title="WFH / On Duty today" value="0" color="border-l-lime-600" />
        <Metric title="Remote Clock-ins today" value="0" color="border-l-amber-500" />
      </div>

      {/* Who is off today */}
      <Card className="border text-[13px] shadow-none rounded-none">
        <CardHeader className="py-2 border-b">
          <CardTitle className="text-[13px] font-medium">Who is off today</CardTitle>
        </CardHeader>
        <CardContent className="py-3 bg-amber-50 border border-amber-100 text-gray-600">
          No employee is off today.
        </CardContent>
      </Card>

      {/* Not in yet today */}
      <Card className="border text-[13px] shadow-none rounded-none">
        <CardHeader className="py-2 border-b">
          <CardTitle className="text-[13px] font-medium">Not in yet today</CardTitle>
        </CardHeader>
        <CardContent className="py-3 bg-amber-50 border border-amber-100 text-gray-600">
          All employees are already in.
        </CardContent>
      </Card>

      {/* Team Calendar */}
      <Card className="border text-[13px] shadow-none rounded-none">
        <CardHeader className="py-2 border-b flex justify-between items-center">
          <CardTitle className="text-[13px] font-medium">Team Calendar</CardTitle>
          <div className="flex items-center space-x-1">
            <button className="px-2 py-1 bg-blue-500 text-white text-xs">&lt;</button>
            <span className="text-sm font-medium">Oct 2025</span>
            <button className="px-2 py-1 bg-blue-500 text-white text-xs">&gt;</button>
          </div>
        </CardHeader>
        <CardContent className="py-3 space-y-3">
          <div className="bg-amber-50 border border-amber-100 py-2 px-3 text-gray-600">
            Nobody is on leave for the selected month
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-gray-600">
            <Legend color="bg-purple-400" label="Work from home" />
            <Legend color="bg-pink-400" label="On duty" />
            <Legend color="bg-cyan-400" label="Paid Leave" />
            <Legend color="bg-gray-400" label="Unpaid Leave" />
            <Legend color="bg-red-400" label="Leave due to No Attendance" />
            <Legend color="bg-yellow-400" label="Weekly off" />
            <Legend color="bg-lime-600" label="Holiday" />
            <Legend color="bg-blue-500" label="Someone on Leave" />
            <Legend color="bg-rose-500" label="Multiple Leave on a day" />
            <Legend color="bg-indigo-500" label="Someone on WFH/OD" />
          </div>
        </CardContent>
      </Card>

      {/* Peers */}
      <Card className="border text-[13px] shadow-none rounded-none">
        <CardHeader className="py-2 border-b">
          <CardTitle className="text-[13px] font-medium">Peers</CardTitle>
        </CardHeader>
        <CardContent className="py-3 bg-amber-50 border border-amber-100 text-gray-600">
          No team employee found.
        </CardContent>
      </Card>
    </div>
  )
}

function Metric({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <Card className={`border-l-4 ${color} border shadow-none rounded-none`}>
      <CardHeader className="py-2">
        <CardTitle className="text-[12px] font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2 text-2xl font-semibold text-gray-800">{value}</CardContent>
    </Card>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center space-x-1">
      <span className={`w-2 h-2 rounded-full ${color}`}></span>
      <span>{label}</span>
    </div>
  )
}
