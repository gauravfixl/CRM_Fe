"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Mail,
  Phone
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

export default function EmployeeDirectoryPage() {
  const params = useParams()
  const [searchQuery, setSearchQuery] = useState("")

  const employees = [
    { id: "E01", name: "John Doe", role: "Frontend Dev", dept: "Engineering", email: "john@fixl.com", status: "ACTIVE" },
    { id: "E02", name: "Jane Smith", role: "HR Manager", dept: "HR", email: "jane@fixl.com", status: "ACTIVE" },
    { id: "E03", name: "Mike Ross", role: "Legal Counsel", dept: "Legal", email: "mike@fixl.com", status: "ON_LEAVE" },
  ]

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
      {/* PAGE HEADER */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
          <span>HRM</span>
          <span>/</span>
          <span className="text-zinc-900 font-semibold">EMPLOYEES</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Employee Directory</h1>
            <p className="text-xs text-zinc-500 font-medium">Manage personnel records and roles.</p>
          </div>
          <Button className="h-8 rounded-md bg-pink-600 hover:bg-pink-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => toast.success("Add Employee Wizard")}>
            <Plus className="w-3.5 h-3.5 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <Input
              placeholder="Search employees..."
              className="pl-9 h-9 bg-white border-zinc-200 rounded-md text-xs font-medium focus:ring-1 focus:ring-pink-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow>
              <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Employee</TableHead>
              <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Role</TableHead>
              <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Department</TableHead>
              <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Status</TableHead>
              <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((e) => (
              <TableRow key={e.id} className="hover:bg-zinc-50/50">
                <TableCell className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600">
                      {e.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900">{e.name}</div>
                      <div className="text-[10px] text-zinc-400">{e.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-xs text-zinc-600">{e.role}</TableCell>
                <TableCell className="py-3 text-xs text-zinc-600">{e.dept}</TableCell>
                <TableCell className="py-3 text-center">
                  <Badge className={`text-[9px] uppercase font-bold border-none px-2 py-0.5 ${e.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                    {e.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-right pr-4">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.info("Opening Profile...")}>
                    <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
