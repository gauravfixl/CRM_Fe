"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Calendar,
    Plus,
    Check,
    X
} from "lucide-react"
import { Button } from "@/components/ui/button"
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

export default function LeaveManagementPage() {
    const params = useParams()

    // Mock
    const requests = [
        { id: 1, name: "John Doe", type: "Sick Leave", dates: "Jan 20 - Jan 22", days: 3, status: "PENDING" },
        { id: 2, name: "Jane Smith", type: "Annual Leave", dates: "Feb 01 - Feb 05", days: 5, status: "APPROVED" },
    ]

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>HRM</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">LEAVE MANAGEMENT</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Time Off Requests</h1>
                        <p className="text-xs text-zinc-500 font-medium">Manage vacation, sick leave, and other absences.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button className="h-8 rounded-md bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-3 shadow-sm" onClick={() => toast.success("Opening request form...")}>
                            <Plus className="w-3.5 h-3.5 mr-2" />
                            Request Leave
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Employee</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Type</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Dates</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Days</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Status</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-right pr-4">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.map((r) => (
                            <TableRow key={r.id} className="hover:bg-zinc-50/50">
                                <TableCell className="py-3 px-4 text-xs font-bold text-zinc-900">{r.name}</TableCell>
                                <TableCell className="py-3 text-xs text-zinc-600">{r.type}</TableCell>
                                <TableCell className="py-3 text-xs text-zinc-600">{r.dates}</TableCell>
                                <TableCell className="py-3 text-center text-xs font-bold text-zinc-900">{r.days}</TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge className={`text-[9px] uppercase font-bold border-none px-2 py-0.5 ${r.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                                            r.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                                                'bg-rose-50 text-rose-600'
                                        }`}>
                                        {r.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <Button variant="ghost" className="h-6 w-6 p-0 text-emerald-600 hover:bg-emerald-50" onClick={() => toast.success("Approved")}>
                                            <Check className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button variant="ghost" className="h-6 w-6 p-0 text-rose-600 hover:bg-rose-50" onClick={() => toast.error("Rejected")}>
                                            <X className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
