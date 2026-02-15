"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
  CalendarClock,
  Search,
  Filter,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function AttendancePage() {
  const params = useParams()

  // Mock
  const logs = [
    { id: 1, name: "John Doe", date: "Jan 16, 2024", checkIn: "09:00 AM", checkOut: "06:00 PM", status: "PRESENT" },
    { id: 2, name: "Jane Smith", date: "Jan 16, 2024", checkIn: "09:15 AM", checkOut: "06:10 PM", status: "LATE" },
    { id: 3, name: "Mike Ross", date: "Jan 16, 2024", checkIn: "-", checkOut: "-", status: "ABSENT" },
  ]

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
          <span>HRM</span>
          <span>/</span>
          <span className="text-zinc-900 font-semibold">ATTENDANCE</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Daily Attendance</h1>
            <p className="text-xs text-zinc-500 font-medium">Track employee check-ins and working hours.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-8 rounded-md bg-white border-zinc-200 text-xs font-medium px-3 shadow-sm" onClick={() => toast.success("Exporting report...")}>
              <Download className="w-3.5 h-3.5 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow>
              <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Employee</TableHead>
              <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Date</TableHead>
              <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Check In</TableHead>
              <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Check Out</TableHead>
              <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((row) => (
              <TableRow key={row.id} className="hover:bg-zinc-50/50">
                <TableCell className="py-3 px-4 text-xs font-bold text-zinc-900">{row.name}</TableCell>
                <TableCell className="py-3 text-xs text-zinc-600">{row.date}</TableCell>
                <TableCell className="py-3 text-center text-xs font-mono text-zinc-600">{row.checkIn}</TableCell>
                <TableCell className="py-3 text-center text-xs font-mono text-zinc-600">{row.checkOut}</TableCell>
                <TableCell className="py-3 text-center">
                  <Badge className={`text-[9px] uppercase font-bold border-none px-2 py-0.5 ${row.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600' :
                      row.status === 'LATE' ? 'bg-amber-50 text-amber-600' :
                        'bg-rose-50 text-rose-600'
                    }`}>
                    {row.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
