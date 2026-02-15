"use client"

import React from "react"
import { useParams } from "next/navigation"
import { Briefcase, Plus, MoreHorizontal, User } from "lucide-react"
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

export default function RecruitmentPage() {
    const params = useParams()

    const jobs = [
        { id: "J-01", title: "Senior Frontend Engineer", dept: "Engineering", type: "Full-Time", candidates: 12, status: "OPEN" },
        { id: "J-02", title: "Sales Executive", dept: "Sales", type: "Contract", candidates: 45, status: "OPEN" },
        { id: "J-03", title: "Intern", dept: "Product", type: "Internship", candidates: 8, status: "CLOSED" },
    ]

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>HRM</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">RECRUITMENT</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Talent Acquisition</h1>
                        <p className="text-xs text-zinc-500 font-medium">Manage job postings and applicant tracking.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button className="h-8 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium px-3 shadow-sm" onClick={() => toast.success("Job posting wizard")}>
                            <Plus className="w-3.5 h-3.5 mr-2" />
                            Post Job
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Job Title</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Department</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Type</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Candidates</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Status</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-right pr-4">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {jobs.map((j) => (
                            <TableRow key={j.id} className="hover:bg-zinc-50/50">
                                <TableCell className="py-3 px-4 text-xs font-bold text-zinc-900">{j.title}</TableCell>
                                <TableCell className="py-3 text-xs text-zinc-600">{j.dept}</TableCell>
                                <TableCell className="py-3 text-xs text-zinc-600">{j.type}</TableCell>
                                <TableCell className="py-3 text-center">
                                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-zinc-600">
                                        <User className="w-3 h-3 text-zinc-400" />
                                        {j.candidates}
                                    </div>
                                </TableCell>
                                <TableCell className="py-3 text-center">
                                    <Badge className={`text-[9px] uppercase font-bold border-none px-2 py-0.5 ${j.status === 'OPEN' ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-500'
                                        }`}>
                                        {j.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="py-3 text-right pr-4">
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.info("View applicants...")}>
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
