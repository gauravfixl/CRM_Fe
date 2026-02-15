"use client"

import React from "react"
import { useParams } from "next/navigation"
import { TrendingUp, Plus, MoreHorizontal } from "lucide-react"
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

export default function PerformancePage() {
    const params = useParams()

    const reviews = [
        { id: "R-01", employee: "John Doe", reviewer: "Jane Smith", cycle: "Q4 2023", rating: "Exceeds Expectations", status: "COMPLETED" },
        { id: "R-02", employee: "Mike Ross", reviewer: "Harvey S.", cycle: "Q4 2023", rating: "Pending", status: "IN_PROGRESS" },
    ]

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>HRM</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">PERFORMANCE</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Performance Reviews</h1>
                        <p className="text-xs text-zinc-500 font-medium">Track appraisals and feedback cycles.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button className="h-8 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 shadow-sm" onClick={() => toast.success("New cycle started")}>
                            <Plus className="w-3.5 h-3.5 mr-2" />
                            New Review Cycle
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Employee</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Reviewer</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Cycle</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Rating</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Status</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-right pr-4">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reviews.map((r) => (
                            <TableRow key={r.id} className="hover:bg-zinc-50/50">
                                <TableCell className="py-3 px-4 text-xs font-bold text-zinc-900">{r.employee}</TableCell>
                                <TableCell className="py-3 text-xs text-zinc-600">{r.reviewer}</TableCell>
                                <TableCell className="py-3 text-xs text-zinc-600">{r.cycle}</TableCell>
                                <TableCell className="py-3 text-xs font-medium text-zinc-700">{r.rating}</TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge className={`text-[9px] uppercase font-bold border-none px-2 py-0.5 ${r.status === 'COMPLETED' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                                        }`}>
                                        {r.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.info("Opening review...")}>
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
