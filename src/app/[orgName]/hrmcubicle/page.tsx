"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import {
    Users,
    Calendar,
    Briefcase,
    DollarSign,
    Plus,
    Search,
    UserPlus,
    FileText,
    TrendingUp,
    Heart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SmallCard, SmallCardContent, SmallCardHeader } from "@/shared/components/custom/SmallCard"
import { toast } from "sonner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function HRMDashboardPage() {
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)

    const handleAction = (msg: string) => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            toast.success(msg)
        }, 800)
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-[#fafafa]">
            {/* PAGE HEADER */}
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
                    <span>ORGANIZATION</span>
                    <span>/</span>
                    <span className="text-zinc-900 font-semibold">HRM CUBICLE</span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Workforce Command Center</h1>
                        <p className="text-xs text-zinc-500 font-medium">Overview of human resources, attendance, and recruitment metrics.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button className="h-8 rounded-md bg-pink-600 hover:bg-pink-700 text-white text-xs font-medium px-3 shadow-sm active:scale-95" onClick={() => handleAction("Onboarding Wizard")}>
                            <UserPlus className="w-3.5 h-3.5 mr-2" />
                            Onboard Employee
                        </Button>
                    </div>
                </div>
            </div>

            {/* STATS CARDS */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <SmallCard className="bg-gradient-to-br from-pink-500 to-rose-600 border-t border-white/20 border-none text-white shadow-[0_8px_30px_rgb(236,72,153,0.3)] hover:shadow-[0_20px_40px_rgba(219,39,119,0.4)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-white font-medium uppercase tracking-wider">Total Headcount</p>
                        <Users className="w-4 h-4 text-white" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-white drop-shadow-md">142</p>
                        <p className="text-[10px] text-white">12 new this month</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">On Leave Today</p>
                        <Calendar className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">08</p>
                        <p className="text-[10px] text-zinc-400">Casual & Sick</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Open Positions</p>
                        <Briefcase className="w-4 h-4 text-zinc-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">24</p>
                        <p className="text-[10px] text-zinc-400">Recruitment active</p>
                    </SmallCardContent>
                </SmallCard>

                <SmallCard className="bg-white border-t border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 transform transition-all duration-300">
                    <SmallCardHeader className="flex flex-row items-center justify-between pb-1 px-4 pt-4">
                        <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Avg. Satisfaction</p>
                        <Heart className="w-4 h-4 text-rose-300" />
                    </SmallCardHeader>
                    <SmallCardContent className="px-4 pb-4">
                        <p className="text-2xl font-bold text-zinc-900">4.5</p>
                        <p className="text-[10px] text-zinc-400">eNPS Score</p>
                    </SmallCardContent>
                </SmallCard>
            </div>

            {/* QUICK ACTIONS ROW */}
            <div className="flex gap-4">
                <Button variant="outline" className="flex-1 h-12 bg-white border-zinc-200 hover:bg-zinc-50 shadow-sm" onClick={() => handleAction("Leave Request Dialog")}>
                    <Calendar className="w-4 h-4 mr-2 text-pink-500" />
                    <span className="text-xs font-bold text-zinc-700">Approve Leaves</span>
                </Button>
                <Button variant="outline" className="flex-1 h-12 bg-white border-zinc-200 hover:bg-zinc-50 shadow-sm" onClick={() => handleAction("Payroll Run Dialog")}>
                    <DollarSign className="w-4 h-4 mr-2 text-emerald-500" />
                    <span className="text-xs font-bold text-zinc-700">Run Payroll</span>
                </Button>
                <Button variant="outline" className="flex-1 h-12 bg-white border-zinc-200 hover:bg-zinc-50 shadow-sm" onClick={() => handleAction("Performance Review")}>
                    <TrendingUp className="w-4 h-4 mr-2 text-indigo-500" />
                    <span className="text-xs font-bold text-zinc-700">Reviews</span>
                </Button>
                <Button variant="outline" className="flex-1 h-12 bg-white border-zinc-200 hover:bg-zinc-50 shadow-sm" onClick={() => handleAction("Files Center")}>
                    <FileText className="w-4 h-4 mr-2 text-amber-500" />
                    <span className="text-xs font-bold text-zinc-700">Documents</span>
                </Button>
            </div>

            {/* RECENT JOINERS TABLE */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20">
                    <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">New Joiners</h3>
                </div>
                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow>
                            <TableHead className="py-3 px-4 font-semibold text-[11px] text-zinc-500 uppercase">Employee</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Role</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase">Department</TableHead>
                            <TableHead className="py-3 font-semibold text-[11px] text-zinc-500 uppercase text-center">Join Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="hover:bg-zinc-50/50">
                            <TableCell className="py-3 px-4 font-bold text-xs text-zinc-900">Sarah Connor</TableCell>
                            <TableCell className="py-3 text-xs text-zinc-600">Product Manager</TableCell>
                            <TableCell className="py-3 text-xs text-zinc-600">Product</TableCell>
                            <TableCell className="py-3 text-center text-xs text-zinc-500">Jan 15, 2024</TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-zinc-50/50">
                            <TableCell className="py-3 px-4 font-bold text-xs text-zinc-900">Kyle Reese</TableCell>
                            <TableCell className="py-3 text-xs text-zinc-600">Security Analyst</TableCell>
                            <TableCell className="py-3 text-xs text-zinc-600">IT Security</TableCell>
                            <TableCell className="py-3 text-center text-xs text-zinc-500">Jan 12, 2024</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
