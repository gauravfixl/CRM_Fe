"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import { DollarSign, Download, Play } from "lucide-react"
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

export default function PayrollPage() {
    const params = useParams()

    const runs = [
        { id: "P-001", period: "Dec 2023", date: "Jan 01, 2024", total: "$145,000", status: "PAID" },
        { id: "P-002", period: "Jan 2024", date: "Feb 01, 2024", total: "$148,500", status: "PENDING" },
    ]

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>HRM</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">PAYROLL</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Payroll Processing</h1>
                        <p className="text-xs text-zinc-500 font-medium">Manage salary disbursements and tax slips.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button className="h-8 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 shadow-sm" onClick={() => toast.success("Payroll wizard started")}>
                            <Play className="w-3.5 h-3.5 mr-2" />
                            Run Payroll
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Run ID</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Period</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Payment Date</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-right">Total Cost</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Status</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-right pr-4">Actions</TableHead>
                        TableRow>
                    </TableHeader>
                    <TableBody>
                        {runs.map((r) => (
                            <TableRow key={r.id} className="hover:bg-zinc-50/50">
                                <TableCell className="py-3 px-4 text-xs font-bold text-zinc-900">{r.id}</TableCell>
                                <TableCell className="py-3 text-xs text-zinc-600">{r.period}</TableCell>
                                <TableCell className="py-3 text-xs text-zinc-600">{r.date}</TableCell>
                                <TableCell className="py-3 text-right text-xs font-mono font-bold text-zinc-900">{r.total}</TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge className={`text-[9px] uppercase font-bold border-none px-2 py-0.5 ${r.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        {r.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.success("Downloading slips...")}>
                                        <Download className="w-4 h-4 text-zinc-400" />
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
