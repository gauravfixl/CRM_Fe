"use client"

import { useState, useRef } from "react"
import { Calendar, Download, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import MostHoursWorked from "@/components/hrm/timeattend/dashboard/attendanceanalytics/attendanceanalytics"
import LeaveSummary from "@/components/hrm/timeattend/dashboard/leavesummary"
import LeaveDashboard from "@/components/hrm/timeattend/dashboard/leaveanalytics/leaveanalytics"

export default function AttendanceSummaryPage() {
  const [selectedTab, setSelectedTab] = useState("Attendance Summary")
  const [viewMode, setViewMode] = useState<"count" | "percentage">("count")

  const arrivalChartRef = useRef<HTMLDivElement>(null)
  const wfhChartRef = useRef<HTMLDivElement>(null)

  const exportChart = async (ref: React.RefObject<HTMLDivElement>, type: string) => {
    if (!ref.current) return
    const canvas = await html2canvas(ref.current)
    const imgData = canvas.toDataURL("image/png")
    if (type === "png") {
      const link = document.createElement("a")
      link.href = imgData
      link.download = "chart.png"
      link.click()
    } else {
      const pdf = new jsPDF("l", "mm", "a4")
      const imgWidth = 280
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight)
      pdf.save("chart.pdf")
    }
  }

  const tabs = [
    "Attendance Summary",
    "Attendance Analytics",
    "Leave Summary",
    "Leave Analytics",
  ]

  const summary = [
    { label: "Total Employees", value: 143 },
    { label: "Early/On Time Arrivals", value: 0 },
    { label: "Late Arrivals", value: 0 },
    { label: "Not In Yet", value: 143, link: "View Employees" },
    { label: "Work From Home", value: 0 },
    { label: "On Duty", value: 0 },
    { label: "Remote Clock-In", value: 0 },
    { label: "Holiday/Weekly Off", value: 0 },
  ]

  const pastStats = [
    {
      label: "Employees Present",
      value: "0%",
      subtext:
        "Range of employees that were present during the selected duration.",
    },
    {
      label: "Avg. Work Hours Spent",
      value: "0h/day",
      subtext:
        "Avg. effective hours spent by employees during the selected duration.",
    },
    {
      label: "Avg. Overtime Hours",
      value: "0h/day",
      subtext:
        "Avg. OT hours worked by employees during the selected duration.",
    },
    {
      label: "Total Attendance Discrepancies",
      value: "0",
      subtext:
        "Total penalties due to attendance discrepancies during selected period.",
    },
  ]

  const dataArrival = [
    { date: "02 Sep", early: 0, late: 0, noLogs: 143, holiday: 0 },
    { date: "03 Sep", early: 0, late: 0, noLogs: 143, holiday: 0 },
    { date: "04 Sep", early: 0, late: 0, noLogs: 143, holiday: 0 },
    { date: "05 Sep", early: 2, late: 1, noLogs: 140, holiday: 0 },
    { date: "06 Sep", early: 0, late: 0, noLogs: 0, holiday: 143 },
    { date: "07 Sep", early: 0, late: 0, noLogs: 0, holiday: 143 },
    { date: "08 Sep", early: 0, late: 0, noLogs: 143, holiday: 0 },
  ]

  const dataWFH = [
    { date: "02 Sep", wfh: 0, duty: 0, holiday: 0 },
    { date: "03 Sep", wfh: 0, duty: 0, holiday: 0 },
    { date: "04 Sep", wfh: 0, duty: 0, holiday: 0 },
    { date: "05 Sep", wfh: 2, duty: 0, holiday: 0 },
    { date: "06 Sep", wfh: 0, duty: 0, holiday: 143 },
    { date: "07 Sep", wfh: 0, duty: 0, holiday: 143 },
    { date: "08 Sep", wfh: 0, duty: 0, holiday: 0 },
  ]

  return (
   
    <div className="p-5 space-y-5 text-[12px] text-gray-700">
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b pb-2 text-[13px] font-medium">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={cn(
              "pb-1 transition-colors",
              selectedTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-primary"
            )}
          >
            {tab}
          </button>
        ))}
      </div>
{selectedTab === "Attendance Summary" && (
  <>
    {/* Filter bar */}
      <div className="flex flex-wrap justify-end gap-2 text-[11px]">
        <select className="border rounded-md px-2 py-1">
          <option>All Departments</option>
        </select>
        <select className="border rounded-md px-2 py-1">
          <option>All Locations</option>
        </select>
      </div>

      {/* Today's attendance */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summary.map((item) => (
          <Card
            key={item.label}
            className="border text-[12px] shadow-sm hover:shadow transition"
          >
            <CardContent className="p-3">
              <div className="text-gray-500 text-[11px]">{item.label}</div>
              <div className="text-[20px] font-semibold">{item.value}</div>
              {item.link && (
                <button className="text-[11px] text-blue-600 hover:underline">
                  {item.link}
                </button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Past attendance */}
      <div>
        <div className="text-[13px] font-medium mb-2">
          Attendance for past dates
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {pastStats.map((stat) => (
            <Card key={stat.label} className="border text-[12px]">
              <CardContent className="p-3">
                <div className="text-[22px] font-semibold">{stat.value}</div>
                <div className="text-[11px] font-medium mt-1">
                  {stat.label}
                </div>
                <div className="text-[10px] text-gray-500 mt-1 leading-tight">
                  {stat.subtext}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Employee Arrival Stats Graph */}
      <Card ref={arrivalChartRef} className="border shadow-sm">
        <CardContent className="p-3 space-y-2">
          <div className="flex justify-between items-center text-[12px]">
            <div className="font-medium">Employees arrival stats</div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setViewMode(viewMode === "count" ? "percentage" : "count")
                }
                className="text-blue-600 text-[11px] hover:underline"
              >
                {viewMode === "count"
                  ? "View as Percentage"
                  : "View as Count"}
              </button>
              <div className="relative group">
                <MoreVertical className="h-4 w-4 cursor-pointer text-gray-500" />
                <div className="absolute right-0 top-5 hidden group-hover:block bg-white border rounded-md shadow-md text-[11px]">
                  <button
                    onClick={() => exportChart(arrivalChartRef, "png")}
                    className="block px-3 py-1 hover:bg-gray-100 w-full text-left"
                  >
                    Export as PNG
                  </button>
                  <button
                    onClick={() => exportChart(arrivalChartRef, "pdf")}
                    className="block px-3 py-1 hover:bg-gray-100 w-full text-left"
                  >
                    Export as PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

       <ResponsiveContainer width="100%" height={220}>
  <BarChart
    data={dataArrival}
    barCategoryGap="25%"  // slimmer bars but still visible (default ~10-15%)
    barGap={3}            // small internal spacing
  >
    <XAxis dataKey="date" fontSize={10} />
    <YAxis fontSize={10} />
    <Tooltip />
    <Legend wrapperStyle={{ fontSize: "10px" }} />
    <Bar dataKey="early" stackId="a" fill="#8BC34A" name="Early/On Time Arrival" />
    <Bar dataKey="late" stackId="a" fill="#E57373" name="Late Arrival" />
    <Bar dataKey="noLogs" stackId="a" fill="#BA68C8" name="No Logs / On Leave" />
    <Bar dataKey="holiday" stackId="a" fill="#4FC3F7" name="Holiday / Weekly-Off" />
  </BarChart>
</ResponsiveContainer>

        </CardContent>
      </Card>

      {/* Work from home/OD Stats Graph */}
      <Card ref={wfhChartRef} className="border shadow-sm">
        <CardContent className="p-3 space-y-2">
          <div className="flex justify-between items-center text-[12px]">
            <div className="font-medium">Work from home/OD stats</div>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setViewMode(viewMode === "count" ? "percentage" : "count")
                }
                className="text-blue-600 text-[11px] hover:underline"
              >
                {viewMode === "count"
                  ? "View as Percentage"
                  : "View as Count"}
              </button>
              <div className="relative group">
                <MoreVertical className="h-4 w-4 cursor-pointer text-gray-500" />
                <div className="absolute right-0 top-5 hidden group-hover:block bg-white border rounded-md shadow-md text-[11px]">
                  <button
                    onClick={() => exportChart(wfhChartRef, "png")}
                    className="block px-3 py-1 hover:bg-gray-100 w-full text-left"
                  >
                    Export as PNG
                  </button>
                  <button
                    onClick={() => exportChart(wfhChartRef, "pdf")}
                    className="block px-3 py-1 hover:bg-gray-100 w-full text-left"
                  >
                    Export as PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

<ResponsiveContainer width="100%" height={220}>
  <BarChart
    data={dataWFH}
    barCategoryGap="25%"  // makes bars slimmer but still visible
    barGap={3}            // small internal spacing
  >
    <XAxis dataKey="date" fontSize={10} />
    <YAxis fontSize={10} />
    <Tooltip />
    <Legend wrapperStyle={{ fontSize: "10px" }} />
    <Bar dataKey="wfh" stackId="b" fill="#FBC02D" name="Work From Home" />
    <Bar dataKey="duty" stackId="b" fill="#CE93D8" name="On Duty" />
    <Bar dataKey="holiday" stackId="b" fill="#4FC3F7" name="Holiday / Weekly-Off" />
  </BarChart>
</ResponsiveContainer>

        </CardContent>
      </Card> {/* your existing summary + charts */}
  </>
)}
{selectedTab === "Attendance Analytics" && (
  <MostHoursWorked />
)}
{selectedTab === "Leave Summary" && (
   <LeaveSummary/>
)}
{selectedTab === "Leave Analytics" && (
 <LeaveDashboard/>
)}
     
     
    </div>
  )
}
